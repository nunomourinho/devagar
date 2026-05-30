/* ============================================================
   Devagar — estado da app (sem dados de exemplo)
   Fonte de verdade: SQLite (window.DVDB). Fallback: localStorage.
   ============================================================ */
(function () {
  const LS_KEY = "devagar_state_fallback_v2";

  const todayISO = () => new Date().toISOString().slice(0, 10);

  function offset(d) {
    const t = new Date();
    t.setDate(t.getDate() + d);
    return t.toISOString().slice(0, 10);
  }

  function blankDay() {
    return {
      energyUsed: 0, mood: null, pain: null,
      sleepHours: null, sleepQuality: null, fog: null,
      symptoms: [], regions: {}, water: 0, meals: [],
      flare: false, note: "",
    };
  }

  function emptyState() {
    return {
      profile: { name: "", initials: "", energyBudget: 12 },
      days: {},
      journal: [], meds: [], appts: [], moves: [],
      settings: { accent: "sage", bg: "creme", radius: "suave", motion: "true" },
    };
  }

  let state = emptyState();
  let booted = false;
  let usingDB = false;
  const subs = new Set();

  function notify() { subs.forEach((fn) => fn()); }

  function ensureToday() {
    if (!state.days[todayISO()]) state.days[todayISO()] = blankDay();
  }

  /* ---- fallback localStorage ---- */
  function lsLoad() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY));
      if (s) return s;
    } catch (e) {}
    return null;
  }
  function lsSave() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function persist() {
    if (usingDB && window.DVDB && window.DVDB.isOpen()) {
      try { window.DVDB.writeState(state); return; } catch (e) {}
    }
    lsSave();
  }

  window.DV = {
    todayISO, offset, blankDay,

    isBooted: () => booted,
    usingDB: () => usingDB,

    async boot() {
      // tenta SQLite primeiro
      if (window.DVDB) {
        try {
          await window.DVDB.open();
          state = window.DVDB.readState();
          usingDB = true;
        } catch (e) {
          usingDB = false;
        }
      }
      // fallback se SQLite falhar
      if (!usingDB) {
        const ls = lsLoad();
        if (ls) state = ls;
      }
      ensureToday();
      booted = true;
      // grava o registo de hoje recém-criado
      persist();
      notify();
    },

    get: () => state,
    today: () => state.days[todayISO()],

    set(mutator) { mutator(state); persist(); notify(); },
    setToday(patch) { Object.assign(state.days[todayISO()], patch); persist(); notify(); },

    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },

    counts() {
      if (usingDB && window.DVDB && window.DVDB.isOpen()) return window.DVDB.counts();
      return {
        dias: Object.keys(state.days).length,
        diario: state.journal.length,
        medicacao: state.meds.length,
        consultas: state.appts.length,
        movimento: state.moves.length,
        registos_dor: Object.values(state.days).reduce((a, d) => a + Object.keys(d.regions || {}).length, 0),
        sintomas: Object.values(state.days).reduce((a, d) => a + (d.symptoms || []).length, 0),
      };
    },

    async exportDB() {
      let bytes;
      if (usingDB && window.DVDB && window.DVDB.isOpen()) {
        // garante que o último estado está escrito antes de exportar
        try { window.DVDB.writeState(state); await window.DVDB.persist(); } catch (e) {}
        bytes = window.DVDB.exportBytes();
      } else {
        bytes = new TextEncoder().encode(JSON.stringify(state, null, 2));
      }
      const blob = new Blob([bytes], { type: "application/x-sqlite3" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = usingDB ? "devagar.sqlite" : "devagar.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    },

    async importDB(file) {
      if (!file) throw new Error("Sem ficheiro.");
      const buf = new Uint8Array(await file.arrayBuffer());
      const name = (file.name || "").toLowerCase();

      // JSON (fallback exportado sem SQLite)
      if (name.endsWith(".json")) {
        let parsed;
        try { parsed = JSON.parse(new TextDecoder().decode(buf)); }
        catch (e) { throw new Error("Ficheiro JSON inválido."); }
        if (!parsed || !parsed.profile || !parsed.days) throw new Error("Este JSON não parece dados da Devagar.");
        state = Object.assign(emptyState(), parsed);
        ensureToday();
        if (usingDB && window.DVDB && window.DVDB.isOpen()) {
          try { window.DVDB.writeState(state); await window.DVDB.persist(); } catch (e) {}
        } else { lsSave(); }
        notify();
        return;
      }

      // SQLite
      if (usingDB && window.DVDB) {
        await window.DVDB.importBytes(buf);
        state = window.DVDB.readState();
        ensureToday();
        // grava o registo de hoje se tiver sido criado agora
        try { window.DVDB.writeState(state); await window.DVDB.persist(); } catch (e) {}
        notify();
        return;
      }

      throw new Error("A importação de .sqlite precisa do motor SQLite ativo.");
    },

    async reset() {
      state = emptyState();
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
      if (usingDB && window.DVDB) { try { await window.DVDB.wipe(); } catch (e) {} }
      ensureToday();
      persist();
      notify();
    },
  };

  // ----- catálogos -----
  window.DV.MOODS = [
    { key: "dificil", label: "Difícil", color: "peach", emoji: "🌧️" },
    { key: "cansado", label: "Cansada", color: "sky", emoji: "🌥️" },
    { key: "calmo", label: "Calma", color: "lav", emoji: "🌤️" },
    { key: "bem", label: "Bem", color: "sage", emoji: "☀️" },
    { key: "radiante", label: "Radiante", color: "honey", emoji: "🌈" },
  ];

  window.DV.SYMPTOMS = [
    "Dor generalizada", "Rigidez matinal", "Névoa mental", "Dor de cabeça",
    "Sensibilidade ao toque", "Formigueiro", "Tontura", "Dor articular",
    "Olhos secos", "Sensibilidade à luz", "Problemas digestivos", "Ansiedade",
  ];

  window.DV.REGIONS = [
    { id: "head", label: "Cabeça" }, { id: "neck", label: "Pescoço" },
    { id: "shoulderL", label: "Ombro esq." }, { id: "shoulderR", label: "Ombro dir." },
    { id: "chest", label: "Peito" }, { id: "armL", label: "Braço esq." }, { id: "armR", label: "Braço dir." },
    { id: "abdomen", label: "Abdómen" }, { id: "pelvis", label: "Anca" },
    { id: "thighL", label: "Coxa esq." }, { id: "thighR", label: "Coxa dir." },
    { id: "kneeL", label: "Joelho esq." }, { id: "kneeR", label: "Joelho dir." },
    { id: "calfL", label: "Perna esq." }, { id: "calfR", label: "Perna dir." },
    { id: "footL", label: "Pé esq." }, { id: "footR", label: "Pé dir." },
  ];

  window.DV.AFFIRMATIONS = [
    "Descansar não é desistir. É preparar o próximo passo.",
    "O teu valor não se mede pelo que produzes hoje.",
    "Um dia de cada vez. Às vezes, uma hora de cada vez.",
    "Foste gentil contigo. Isso também é coragem.",
    "O corpo pede pausa, e ouvi-lo é um ato de cuidado.",
    "Pequenos passos contam. Todos eles.",
  ];
})();

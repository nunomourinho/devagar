/* ============================================================
   Devagar — camada SQLite (sql.js / WebAssembly)
   Base de dados real, persistida em IndexedDB.
   Expõe window.DVDB
   ============================================================ */
(function () {
  const SQL_CDN = "https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/";
  const IDB_NAME = "devagar_sqlite";
  const IDB_STORE = "kv";
  const IDB_KEY = "db.sqlite";

  let SQL = null;
  let db = null;
  let opened = false;

  const SCHEMA = `
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT, initials TEXT, energy_budget INTEGER
    );
    CREATE TABLE IF NOT EXISTS days (
      date TEXT PRIMARY KEY,
      energy_used INTEGER DEFAULT 0,
      mood TEXT, pain INTEGER,
      sleep_hours REAL, sleep_quality INTEGER, fog INTEGER,
      water INTEGER DEFAULT 0, flare INTEGER DEFAULT 0, note TEXT
    );
    CREATE TABLE IF NOT EXISTS day_symptoms (date TEXT, symptom TEXT);
    CREATE TABLE IF NOT EXISTS day_regions  (date TEXT, region TEXT, intensity INTEGER);
    CREATE TABLE IF NOT EXISTS day_meals    (date TEXT, meal TEXT);
    CREATE TABLE IF NOT EXISTS journal (
      id INTEGER PRIMARY KEY, date TEXT, mood TEXT, text TEXT, gratitude TEXT, created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS meds (
      id INTEGER PRIMARY KEY, name TEXT, dose TEXT, time TEXT, color TEXT, taken INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS appts (
      id INTEGER PRIMARY KEY, title TEXT, who TEXT, date TEXT, time TEXT, place TEXT
    );
    CREATE TABLE IF NOT EXISTS moves (
      id INTEGER PRIMARY KEY, name TEXT, mins INTEGER, kind TEXT, done INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
  `;

  /* ---------- IndexedDB (guarda o binário .sqlite) ---------- */
  function idbOpen() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(IDB_NAME, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(IDB_STORE);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function idbGet(k) {
    const d = await idbOpen();
    return new Promise((res, rej) => {
      const tx = d.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(k);
      tx.onsuccess = () => res(tx.result);
      tx.onerror = () => rej(tx.error);
    });
  }
  async function idbSet(k, v) {
    const d = await idbOpen();
    return new Promise((res, rej) => {
      const tx = d.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(v, k);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  }
  async function idbDel(k) {
    const d = await idbOpen();
    return new Promise((res, rej) => {
      const tx = d.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).delete(k);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  }

  /* ---------- helpers de query ---------- */
  function all(sql) {
    const r = db.exec(sql);
    if (!r.length) return [];
    const { columns, values } = r[0];
    return values.map((row) => {
      const o = {};
      columns.forEach((c, i) => (o[c] = row[i]));
      return o;
    });
  }
  function one(sql) { return all(sql)[0] || null; }

  function emptyState() {
    return {
      profile: { name: "", initials: "", energyBudget: 12 },
      days: {},
      journal: [], meds: [], appts: [], moves: [],
      settings: { accent: "sage", bg: "creme", radius: "suave", motion: "true" },
    };
  }

  let persistTimer = null;

  window.DVDB = {
    isOpen: () => opened,

    async open() {
      if (!window.initSqlJs) throw new Error("sql.js indisponível");
      SQL = await window.initSqlJs({ locateFile: (f) => SQL_CDN + f });
      let blob = null;
      try { blob = await idbGet(IDB_KEY); } catch (e) {}
      db = blob ? new SQL.Database(new Uint8Array(blob)) : new SQL.Database();
      db.run(SCHEMA);
      opened = true;
      return true;
    },

    /* Lê toda a base de dados para o objeto de estado da app */
    readState() {
      const s = emptyState();
      const p = one("SELECT * FROM profile WHERE id = 1");
      if (p) s.profile = { name: p.name || "", initials: p.initials || "", energyBudget: p.energy_budget || 12 };

      for (const r of all("SELECT * FROM days")) {
        s.days[r.date] = {
          energyUsed: r.energy_used || 0, mood: r.mood, pain: r.pain,
          sleepHours: r.sleep_hours, sleepQuality: r.sleep_quality, fog: r.fog,
          water: r.water || 0, flare: !!r.flare, note: r.note || "",
          symptoms: [], regions: {}, meals: [],
        };
      }
      for (const r of all("SELECT * FROM day_symptoms")) if (s.days[r.date]) s.days[r.date].symptoms.push(r.symptom);
      for (const r of all("SELECT * FROM day_regions")) if (s.days[r.date]) s.days[r.date].regions[r.region] = r.intensity;
      for (const r of all("SELECT * FROM day_meals")) if (s.days[r.date]) s.days[r.date].meals.push(r.meal);

      s.journal = all("SELECT * FROM journal ORDER BY date DESC, id DESC")
        .map((j) => ({ id: j.id, date: j.date, mood: j.mood, text: j.text, gratitude: j.gratitude, created_at: j.created_at }));
      s.meds = all("SELECT * FROM meds")
        .map((m) => ({ id: m.id, name: m.name, dose: m.dose, time: m.time, color: m.color, taken: !!m.taken }));
      s.appts = all("SELECT * FROM appts")
        .map((a) => ({ id: a.id, title: a.title, who: a.who, date: a.date, time: a.time, place: a.place }));
      s.moves = all("SELECT * FROM moves")
        .map((m) => ({ id: m.id, name: m.name, mins: m.mins, kind: m.kind, done: !!m.done }));
      const st = {};
      for (const r of all("SELECT * FROM settings")) st[r.key] = r.value;
      s.settings = Object.assign(s.settings, st);
      return s;
    },

    /* Grava todo o estado nas tabelas (transação) */
    writeState(state) {
      if (!opened) return;
      db.run("BEGIN");
      try {
        [ "profile","days","day_symptoms","day_regions","day_meals",
          "journal","meds","appts","moves","settings" ].forEach((t) => db.run("DELETE FROM " + t));

        const p = state.profile;
        db.run("INSERT INTO profile VALUES (1,?,?,?)", [p.name, p.initials, p.energyBudget]);

        const insDay = db.prepare("INSERT INTO days VALUES (?,?,?,?,?,?,?,?,?,?)");
        const insSym = db.prepare("INSERT INTO day_symptoms VALUES (?,?)");
        const insReg = db.prepare("INSERT INTO day_regions VALUES (?,?,?)");
        const insMeal = db.prepare("INSERT INTO day_meals VALUES (?,?)");
        for (const [date, d] of Object.entries(state.days)) {
          insDay.run([date, d.energyUsed || 0, d.mood ?? null, d.pain ?? null,
            d.sleepHours ?? null, d.sleepQuality ?? null, d.fog ?? null,
            d.water || 0, d.flare ? 1 : 0, d.note || ""]);
          (d.symptoms || []).forEach((sy) => insSym.run([date, sy]));
          Object.entries(d.regions || {}).forEach(([rg, it]) => insReg.run([date, rg, it]));
          (d.meals || []).forEach((ml) => insMeal.run([date, ml]));
        }
        insDay.free(); insSym.free(); insReg.free(); insMeal.free();

        const insJ = db.prepare("INSERT INTO journal VALUES (?,?,?,?,?,?)");
        state.journal.forEach((j) => insJ.run([j.id, j.date, j.mood ?? null, j.text || "", j.gratitude || "", j.created_at || j.id]));
        insJ.free();

        const insM = db.prepare("INSERT INTO meds VALUES (?,?,?,?,?,?)");
        state.meds.forEach((m) => insM.run([m.id, m.name, m.dose, m.time, m.color, m.taken ? 1 : 0]));
        insM.free();

        const insA = db.prepare("INSERT INTO appts VALUES (?,?,?,?,?,?)");
        state.appts.forEach((a) => insA.run([a.id, a.title, a.who, a.date, a.time, a.place]));
        insA.free();

        const insMv = db.prepare("INSERT INTO moves VALUES (?,?,?,?,?)");
        state.moves.forEach((m) => insMv.run([m.id, m.name, m.mins, m.kind, m.done ? 1 : 0]));
        insMv.free();

        const insS = db.prepare("INSERT INTO settings VALUES (?,?)");
        Object.entries(state.settings || {}).forEach(([k, v]) => insS.run([k, String(v)]));
        insS.free();

        db.run("COMMIT");
      } catch (e) {
        db.run("ROLLBACK");
        throw e;
      }
      this.schedulePersist();
    },

    schedulePersist() {
      clearTimeout(persistTimer);
      persistTimer = setTimeout(() => this.persist(), 250);
    },
    async persist() {
      if (!opened) return;
      try { await idbSet(IDB_KEY, db.export()); } catch (e) {}
    },

    /* contagem de linhas — para mostrar que a BD está viva */
    counts() {
      const t = (name) => (one("SELECT COUNT(*) c FROM " + name) || {}).c || 0;
      return {
        dias: t("days"), diario: t("journal"), medicacao: t("meds"),
        consultas: t("appts"), movimento: t("moves"),
        registos_dor: t("day_regions"), sintomas: t("day_symptoms"),
      };
    },

    /* binário .sqlite para download */
    exportBytes() { return db ? db.export() : new Uint8Array(); },

    /* importa um ficheiro .sqlite (Uint8Array). Valida o esquema mínimo. */
    async importBytes(bytes) {
      if (!SQL) throw new Error("sql.js indisponível");
      let test;
      try {
        test = new SQL.Database(new Uint8Array(bytes));
        // valida que parece uma BD da Devagar
        test.run("SELECT 1 FROM days LIMIT 1");
        test.run("SELECT 1 FROM profile LIMIT 1");
      } catch (e) {
        if (test) try { test.free(); } catch (_) {}
        throw new Error("Este ficheiro não parece uma base de dados da Devagar.");
      }
      if (db) try { db.close(); } catch (_) {}
      db = test;
      db.run(SCHEMA); // garante tabelas em falta (compatibilidade)
      opened = true;
      await this.persist();
      return true;
    },

    async wipe() {
      try { await idbDel(IDB_KEY); } catch (e) {}
      if (SQL) { db = new SQL.Database(); db.run(SCHEMA); opened = true; }
    },
  };
})();

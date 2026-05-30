/* Devagar — Ecrã Padrões (tendências + insights encorajadores + perfil) */
function ScreenPadroes({ go }) {
  const dv = useDV();
  const s = dv.get();
  const [toast, showToast] = useToast();
  const [metric, setMetric] = useState("energy");

  // últimos 7 dias
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const iso = DV.offset(-i);
    const d = s.days[iso] || DV.blankDay();
    days.push({ iso, ...d });
  }

  const METRICS = {
    energy: { label: "Energia", color: "honey", get: (d) => s.profile.energyBudget - d.energyUsed, max: s.profile.energyBudget, unit: "colheres" },
    pain: { label: "Dor", color: "peach", get: (d) => d.pain ?? 0, max: 10, unit: "/10", invert: true },
    sleep: { label: "Sono", color: "sky", get: (d) => d.sleepHours ?? 0, max: 10, unit: "h" },
    mood: { label: "Humor", color: "lav", get: (d) => moodScore(d.mood), max: 5, unit: "/5" },
  };
  const M = METRICS[metric];

  const vals = days.map((d) => M.get(d));
  const avg = (vals.reduce((a, b) => a + b, 0) / vals.length);
  const flares = days.filter((d) => d.flare).length;

  // insight encorajador
  const insights = buildInsights(days, s);

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="eyebrow">Padrões &amp; Eu</div>
          <h1 className="page-title">A tua<br /><span className="serif-i">semana</span>.</h1>
        </div>
        <div className="avatar">{s.profile.initials}</div>
      </div>

      {/* resumo */}
      <div className="statrow" style={{ marginBottom: 16 }}>
        <div className="stat"><div className="v">{days.filter((d) => d.mood || d.pain != null).length}</div><div className="l">dias registados</div></div>
        <div className="stat"><div className="v" style={{ color: "var(--peach-ink)" }}>{flares}</div><div className="l">crises (flare)</div></div>
        <div className="stat"><div className="v" style={{ color: "var(--sage-ink)" }}>{s.journal.length}</div><div className="l">entradas diário</div></div>
      </div>

      {/* gráfico */}
      <Card>
        <div className="chips" style={{ marginBottom: 20 }}>
          {Object.entries(METRICS).map(([k, v]) => (
            <button key={k} className={"chip" + (metric === k ? " on" : "")} style={{ "--accent": col(v.color).c }} onClick={() => setMetric(k)}>{v.label}</button>
          ))}
        </div>
        <div className="trend">
          {days.map((d, i) => {
            const v = vals[i];
            const h = Math.max(6, (v / M.max) * 120);
            return (
              <div className="trend-col" key={i}>
                <div className="trend-bar" style={{ height: h, background: col(M.color).c, opacity: i === 6 ? 1 : .68 }} title={v + " " + M.unit} />
                <div className="trend-lbl">{weekday(d.iso)}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
          <span className="card-sub">Média da semana</span>
          <span style={{ fontFamily: "var(--serif)", fontSize: 19, color: col(M.color).i }}>{avg.toFixed(1)} {M.unit}</span>
        </div>
      </Card>

      {/* insights */}
      <div className="section-label">O que reparei</div>
      {insights.map((ins, i) => (
        <div key={i} className="card flat" style={{ display: "flex", gap: 14, alignItems: "flex-start", background: col(ins.c).s }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Icon name={ins.ico} size={21} color={col(ins.c).i} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: col(ins.c).i, marginBottom: 2 }}>{ins.title}</div>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)" }}>{ins.text}</p>
          </div>
        </div>
      ))}

      {/* relatório para o médico */}
      <Card title="Para a próxima consulta" dotColor="rose">
        <p className="card-sub" style={{ marginBottom: 14 }}>Um resumo dos teus registos, pronto a mostrar à equipa médica.</p>
        <button className="btn soft block" style={{ "--accent-soft": "var(--rose-soft)", "--accent-ink": "var(--rose-ink)" }}
          onClick={() => showToast("Resumo preparado (demonstração)")}>
          <Icon name="journal" size={18} /> Preparar resumo médico
        </button>
      </Card>

      {/* base de dados */}
      <div className="section-label">A tua base de dados</div>
      <Card>
        <div className="row" style={{ paddingTop: 0 }}>
          <div className="row-ico" style={{ background: "var(--sage-soft)" }}><Icon name="check" size={20} color="var(--sage-ink)" /></div>
          <div className="row-main">
            <div className="row-title">{dv.usingDB() ? "Guardado em SQLite" : "Guardado localmente"}</div>
            <div className="row-sub">{dv.usingDB() ? "Base de dados privada, só no teu dispositivo." : "A funcionar em modo offline (sem SQLite)."}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "4px 0 16px" }}>
          {Object.entries(dv.counts()).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 13px", background: "var(--surface-2)", borderRadius: 12, fontSize: 14 }}>
              <span style={{ color: "var(--ink-2)", textTransform: "capitalize" }}>{k.replace(/_/g, " ")}</span>
              <span style={{ fontWeight: 700, fontFamily: "var(--serif)" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn soft" style={{ flex: 1 }} onClick={() => { dv.exportDB(); showToast("A exportar a base de dados…"); }}>
            <Icon name="chart" size={18} /> Exportar
          </button>
          <label className="btn ghost" style={{ flex: 1, cursor: "pointer" }}>
            <Icon name="plus" size={18} /> Importar
            <input type="file" accept=".sqlite,.db,.json,application/x-sqlite3" style={{ display: "none" }}
              onChange={async (e) => {
                const f = e.target.files[0];
                e.target.value = "";
                if (!f) return;
                if (!confirm("Importar esta base de dados vai substituir todos os dados atuais. Continuar?")) return;
                try { await dv.importDB(f); showToast("Base de dados importada."); go("hoje"); }
                catch (err) { alert(err.message || "Não foi possível importar."); }
              }} />
          </label>
        </div>
        <p className="card-sub" style={{ fontSize: 13, marginTop: 12, textAlign: "center" }}>
          Exporta para guardar uma cópia de segurança (.sqlite). Importar substitui os dados atuais.
        </p>
      </Card>

      {/* perfil */}
      <div className="section-label">Eu</div>
      <Card>
        <div className="row" style={{ paddingTop: 0 }}>
          <div className="avatar" style={{ width: 52, height: 52 }}>{s.profile.initials}</div>
          <div className="row-main">
            <div className="row-title" style={{ fontSize: 18 }}>{s.profile.name}</div>
            <div className="row-sub">A viver devagar</div>
          </div>
        </div>
        <div className="row"><div className="row-ico" style={{ background: "var(--honey-soft)" }}><Icon name="spoon" size={20} color="var(--honey-ink)" /></div>
          <div className="row-main"><div className="row-title">Orçamento de energia</div><div className="row-sub">{s.profile.energyBudget} colheres por dia</div></div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn ghost" style={{ width: 40, height: 40, padding: 0, borderRadius: 12 }} onClick={() => dv.set((st) => { st.profile.energyBudget = Math.max(4, st.profile.energyBudget - 1); })}>−</button>
            <button className="btn ghost" style={{ width: 40, height: 40, padding: 0, borderRadius: 12 }} onClick={() => dv.set((st) => { st.profile.energyBudget = Math.min(20, st.profile.energyBudget + 1); })}><Icon name="plus" size={18} /></button>
          </div></div>
      </Card>

      <button className="btn ghost block" style={{ color: "var(--ink-3)", marginTop: 4 }} onClick={() => { if (confirm("Apagar tudo e recomeçar? Esta ação não pode ser anulada.")) { dv.reset(); } }}>
        Apagar todos os dados
      </button>
      <p style={{ textAlign: "center", fontSize: 12.5, color: "var(--ink-3)", margin: "20px 0 8px", maxWidth: 360, marginInline: "auto" }}>
        Devagar é um companheiro de bem-estar e não substitui aconselhamento médico.
      </p>
      {toast}
    </div>
  );
}

function moodScore(key) {
  const order = { dificil: 1, cansado: 2, calmo: 3, bem: 4, radiante: 5 };
  return order[key] || 0;
}
function weekday(iso) {
  return ["D", "S", "T", "Q", "Q", "S", "S"][new Date(iso + "T00:00:00").getDay()];
}

function buildInsights(days, s) {
  const out = [];
  const logged = days.filter((d) => d.mood || d.pain != null || d.sleepHours != null);

  if (logged.length === 0) {
    out.push({ ico: "leaf", c: "sage", title: "O teu diário de saúde começa aqui",
      text: "Ainda não há registos. À medida que fores anotando o teu dia, vou mostrar-te padrões gentis — sem julgamentos." });
    return out;
  }

  // sono vs dor (só com dados suficientes)
  const goodSleep = days.filter((d) => (d.sleepHours ?? 0) >= 7 && d.pain != null);
  const badSleep = days.filter((d) => (d.sleepHours ?? 99) < 6 && d.pain != null);
  if (goodSleep.length && badSleep.length) {
    const ag = avgOf(goodSleep.map((d) => d.pain));
    const ab = avgOf(badSleep.map((d) => d.pain));
    if (ab > ag) {
      out.push({ ico: "moon", c: "sky", title: "Sono e dor caminham juntos",
        text: `Quando dormiste 7h+, a tua dor média foi ${ag.toFixed(0)}/10 — mais baixa do que nas noites curtas (${ab.toFixed(0)}/10). O descanso está a ajudar-te.` });
    }
  }

  const flares = days.filter((d) => d.flare).length;
  if (flares) {
    out.push({ ico: "flame", c: "peach", title: `${flares} dia(s) de crise esta semana`,
      text: "Registar as crises ajuda-te a ti e à tua equipa médica a reconhecer gatilhos. Nos dias de crise, sê especialmente gentil contigo." });
  }

  if (s.journal.length >= 1) {
    out.push({ ico: "journal", c: "rose", title: "Escreveste para ti",
      text: `Já tens ${s.journal.length} entrada(s) no diário. Dar nome ao que sentes é um cuidado real.` });
  }

  if (out.length === 0) {
    out.push({ ico: "sparkle", c: "lav", title: "Continua, ao teu ritmo",
      text: "Quantos mais dias registares, mais claros ficarão os teus padrões. Não há pressa." });
  }
  return out;
}
function avgOf(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }

window.ScreenPadroes = ScreenPadroes;

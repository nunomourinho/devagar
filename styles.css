/* Devagar — Ecrã Hoje */
function ScreenToday({ go }) {
  const dv = useDV();
  const s = dv.get();
  const t = dv.today();
  const [toast, showToast] = useToast();
  const [sheet, setSheet] = useState(null); // 'mood' | 'energy' | null

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Bom dia" : hour < 19 ? "Boa tarde" : "Boa noite";
  const budget = s.profile.energyBudget;
  const remaining = Math.max(0, budget - t.energyUsed);
  const pct = Math.round((remaining / budget) * 100);

  const affirm = DV.AFFIRMATIONS[new Date().getDate() % DV.AFFIRMATIONS.length];
  const mood = DV.MOODS.find((m) => m.key === t.mood);

  const medsLeft = s.meds.filter((m) => !m.taken).length;
  const movesLeft = s.moves.filter((m) => !m.done).length;

  // sugestão gentil baseada na energia
  let suggestion;
  if (remaining <= 3) suggestion = { ico: "moon", c: "sky", txt: "A tua energia está baixa. Que tal uma pausa real — sem culpa?" };
  else if (remaining <= 7) suggestion = { ico: "leaf", c: "sage", txt: "Energia moderada. Escolhe uma coisa importante e poupa o resto." };
  else suggestion = { ico: "sparkle", c: "honey", txt: "Tens margem hoje. Aproveita devagar, sem te esgotares." };

  const spend = (n) => {
    dv.setToday({ energyUsed: Math.max(0, Math.min(budget, t.energyUsed + n)) });
    if (n < 0) showToast("Energia recuperada");
  };

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="eyebrow">{niceDate()}</div>
          <h1 className="page-title">{greet},<br /><span className="serif-i">{s.profile.name}</span>.</h1>
        </div>
        <button className="avatar" onClick={() => go("padroes")}>{s.profile.initials}</button>
      </div>

      {/* Afirmação do dia */}
      <div className="card" style={{ background: "var(--lav-soft)", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Icon name="sparkle" size={22} color="var(--lav-ink)" style={{ marginTop: 4, flexShrink: 0 }} />
          <p className="affirm" style={{ color: "var(--lav-ink)" }}>{affirm}</p>
        </div>
      </div>

      {/* Energia / colheres */}
      <Card title="As minhas colheres" dotColor="honey"
        action={<button className="link-soft" onClick={() => setSheet("energy")}>Ajustar</button>}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <span className="serif" style={{ fontSize: 46, color: "var(--honey-ink)", lineHeight: 1 }}>{remaining}</span>
          <span style={{ color: "var(--ink-2)", fontSize: 16 }}>de {budget} restantes</span>
        </div>
        <div style={{ margin: "14px 0 16px" }}>
          <Spoons budget={budget} used={t.energyUsed} />
        </div>
        <div className="bar" style={{ "--accent": "var(--honey)" }}>
          <i style={{ width: pct + "%", background: "var(--honey)" }} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn soft" style={{ flex: 1, "--accent-soft": "var(--honey-soft)", "--accent-ink": "var(--honey-ink)" }}
            onClick={() => spend(1)}>Usei energia</button>
          <button className="btn ghost" style={{ flex: 1 }} onClick={() => spend(-1)}>Recuperei</button>
        </div>
      </Card>

      {/* Check-in rápido */}
      <Card title="Como te sentes agora?" dotColor="lav"
        action={mood && <span style={{ fontSize: 22 }}>{mood.emoji}</span>}>
        <MoodRow value={t.mood} onPick={(k) => { dv.setToday({ mood: k }); showToast("Registado. Obrigada por partilhares."); }} />
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button className="btn soft block" onClick={() => go("corpo")}>
            <Icon name="body" size={19} /> Registar a dor
          </button>
        </div>
      </Card>

      {/* Sugestão gentil */}
      <div className="card flat" style={{ background: col(suggestion.c).s, display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name={suggestion.ico} size={22} color={col(suggestion.c).i} />
        </div>
        <p style={{ fontSize: 15.5, color: col(suggestion.c).i, fontWeight: 500 }}>{suggestion.txt}</p>
      </div>

      <div className="section-label">O plano gentil de hoje</div>

      {/* Atalhos de cuidado */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <MiniTile ico="pill" c="lav" label="Medicação"
          val={s.meds.length === 0 ? "Adicionar" : medsLeft === 0 ? "Tudo tomado" : medsLeft + " por tomar"} done={s.meds.length > 0 && medsLeft === 0} onClick={() => go("cuidar")} />
        <MiniTile ico="walk" c="sage" label="Movimento"
          val={s.moves.length === 0 ? "Adicionar" : movesLeft === 0 ? "Concluído" : movesLeft + " atividades"} done={s.moves.length > 0 && movesLeft === 0} onClick={() => go("cuidar")} />
        <MiniTile ico="drop" c="sky" label="Hidratação"
          val={t.water + " de 6 copos"} done={t.water >= 6} onClick={() => { dv.setToday({ water: Math.min(8, t.water + 1) }); showToast("Mais um copo. Bem feito."); }} />
        <MiniTile ico="journal" c="rose" label="Diário"
          val={hasJournalToday(s) ? "Escrito hoje" : "Escrever"} done={hasJournalToday(s)} onClick={() => go("diario")} />
      </div>

      {sheet === "energy" && (
        <Sheet title="As minhas colheres" onClose={() => setSheet(null)}>
          <p className="card-sub" style={{ marginBottom: 18 }}>
            A <em>teoria das colheres</em> ajuda a pensar a energia como um recurso limitado e precioso.
            Define quantas colheres tens hoje e regista as que vais usando.
          </p>
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>Colheres disponíveis hoje</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Stepper value={budget} suffix="" min={4} max={20}
                onChange={(v) => dv.set((st) => { st.profile.energyBudget = v; })} />
            </div>
          </div>
        </Sheet>
      )}
      {toast}
    </div>
  );
}

function MiniTile({ ico, c, label, val, done, onClick }) {
  const cc = col(c);
  return (
    <button onClick={onClick} className="card flat" style={{ margin: 0, textAlign: "left", padding: 18, position: "relative" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: cc.s, display: "grid", placeItems: "center", marginBottom: 12 }}>
        <Icon name={ico} size={21} color={cc.i} />
      </div>
      <div className="row-title" style={{ fontSize: 15 }}>{label}</div>
      <div className="row-sub" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {done && <Icon name="check" size={15} color={cc.i} />}{val}
      </div>
    </button>
  );
}

function niceDate() {
  const d = new Date();
  const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]}`;
}
function hasJournalToday(s) {
  return s.journal.some((j) => j.date === DV.todayISO());
}

window.ScreenToday = ScreenToday;

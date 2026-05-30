/* Devagar — Ecrã Diário (reflexão + gratidão) */
function ScreenDiario({ go }) {
  const dv = useDV();
  const s = dv.get();
  const [toast, showToast] = useToast();
  const [composing, setComposing] = useState(false);
  const [text, setText] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [mood, setMood] = useState("calmo");

  const save = () => {
    if (!text.trim() && !gratitude.trim()) { setComposing(false); return; }
    dv.set((st) => {
      st.journal.unshift({
        id: Date.now(), date: DV.todayISO(), mood, text: text.trim(), gratitude: gratitude.trim(),
      });
    });
    setText(""); setGratitude(""); setComposing(false);
    showToast("Guardado. Obrigada por escreveres.");
  };

  const prompts = [
    "O que foi gentil contigo hoje?",
    "Um pequeno momento que correu bem…",
    "O que é que o teu corpo te pediu hoje?",
    "De que te orgulhas, por mais pequeno que pareça?",
  ];
  const prompt = prompts[new Date().getDate() % prompts.length];

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="eyebrow">Diário</div>
          <h1 className="page-title">As tuas<br /><span className="serif-i">palavras</span>.</h1>
        </div>
      </div>

      {!composing && (
        <div className="card" style={{ background: "var(--rose-soft)", boxShadow: "var(--shadow-sm)", cursor: "pointer" }}
          onClick={() => { setComposing(true); }}>
          <div className="eyebrow" style={{ color: "var(--rose-ink)" }}>Sugestão de hoje</div>
          <p className="affirm" style={{ color: "var(--rose-ink)", margin: "8px 0 16px" }}>{prompt}</p>
          <span className="btn" style={{ background: "var(--rose)" }}>
            <Icon name="plus" size={19} color="#fff" /> Escrever
          </span>
        </div>
      )}

      {composing && (
        <Card>
          <div style={{ marginBottom: 14 }}>
            <div className="card-sub" style={{ marginBottom: 10 }}>Como estás hoje?</div>
            <MoodRow value={mood} onPick={setMood} />
          </div>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
            <textarea className="journal-input" autoFocus placeholder={prompt}
              value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
              <Icon name="sparkle" size={18} color="var(--honey-ink)" />
              <span style={{ fontWeight: 600, fontSize: 15 }}>Hoje agradeço…</span>
            </div>
            <input value={gratitude} onChange={(e) => setGratitude(e.target.value)}
              placeholder="uma coisa boa, por pequena que seja"
              style={{ width: "100%", border: "none", outline: "none", background: "transparent",
                fontFamily: "var(--serif)", fontSize: 18, color: "var(--ink)" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="btn ghost" style={{ flex: 1 }} onClick={() => { setComposing(false); setText(""); setGratitude(""); }}>Cancelar</button>
            <button className="btn" style={{ flex: 2 }} onClick={save}><Icon name="check" size={19} color="#fff" /> Guardar</button>
          </div>
        </Card>
      )}

      <div className="section-label">Entradas anteriores</div>

      {s.journal.length === 0 && (
        <div className="card flat"><p className="card-sub">Ainda não há entradas. Começa quando te apetecer — sem pressão.</p></div>
      )}

      {s.journal.map((j) => {
        const m = DV.MOODS.find((x) => x.key === j.mood);
        return (
          <div key={j.id} className="entry">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span className="entry-date">{fmtDate(j.date)}</span>
              {m && <span style={{ fontSize: 20 }} title={m.label}>{m.emoji}</span>}
            </div>
            {j.text && <p className="entry-body">{j.text}</p>}
            {j.gratitude && (
              <div style={{ display: "flex", gap: 9, alignItems: "center", marginTop: 12, padding: "10px 14px", background: "var(--honey-soft)", borderRadius: 14 }}>
                <Icon name="sparkle" size={16} color="var(--honey-ink)" />
                <span style={{ fontSize: 14.5, color: "var(--honey-ink)" }}>{j.gratitude}</span>
              </div>
            )}
          </div>
        );
      })}
      {toast}
    </div>
  );
}

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const today = DV.todayISO();
  if (iso === today) return "Hoje";
  if (iso === DV.offset(-1)) return "Ontem";
  const dias = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]}`;
}

Object.assign(window, { ScreenDiario, fmtDate });

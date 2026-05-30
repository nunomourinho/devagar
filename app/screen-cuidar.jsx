/* Devagar — Ecrã Cuidar (medicação, consultas, movimento, sono, alimentação) */
function ScreenCuidar({ go }) {
  const dv = useDV();
  const s = dv.get();
  const t = dv.today();
  const [toast, showToast] = useToast();
  const [sheet, setSheet] = useState(null);

  const toggleMed = (id) => {
    dv.set((st) => { const m = st.meds.find((x) => x.id === id); m.taken = !m.taken; });
    showToast("Atualizado");
  };
  const toggleMove = (id) => {
    dv.set((st) => { const m = st.moves.find((x) => x.id === id); m.done = !m.done; });
  };

  const medsDone = s.meds.filter((m) => m.taken).length;
  const meals = ["Pequeno-almoço", "Almoço", "Lanche", "Jantar"];

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="eyebrow">Cuidar de mim</div>
          <h1 className="page-title">Rotinas<br /><span className="serif-i">de cuidado</span>.</h1>
        </div>
      </div>

      {/* Sono */}
      <Card title="O sono desta noite" dotColor="sky"
        action={<Icon name="moon" size={20} color="var(--sky-ink)" />}>
        <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <div className="stat" style={{ background: "var(--sky-soft)" }}>
            <div className="v" style={{ color: "var(--sky-ink)" }}>{t.sleepHours ?? "—"}<span style={{ fontSize: 15 }}>h</span></div>
            <div className="l">horas dormidas</div>
          </div>
          <div className="stat" style={{ background: "var(--sky-soft)" }}>
            <div className="v" style={{ color: "var(--sky-ink)" }}>{t.sleepQuality ? t.sleepQuality + "/5" : "—"}</div>
            <div className="l">qualidade</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Stepper value={t.sleepHours ?? 7} suffix="h" min={0} max={14} step={0.5}
            onChange={(v) => dv.setToday({ sleepHours: v })} />
        </div>
        <div className="card-sub" style={{ marginBottom: 8 }}>Como descansaste?</div>
        <Segs value={t.sleepQuality} onPick={(v) => dv.setToday({ sleepQuality: v })} color="sky" lo="Inquieto" hi="Reparador" />
      </Card>

      {/* Medicação */}
      <Card title="Medicação" dotColor="lav"
        action={<span className="card-sub">{medsDone}/{s.meds.length}</span>}>
        {s.meds.map((m) => {
          const c = col(m.color);
          return (
            <div className="row" key={m.id}>
              <div className="row-ico" style={{ background: c.s }}><Icon name="pill" size={21} color={c.i} /></div>
              <div className="row-main">
                <div className="row-title" style={{ textDecoration: m.taken ? "line-through" : "none", opacity: m.taken ? .55 : 1 }}>{m.name}</div>
                <div className="row-sub"><Icon name="clock" size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />{m.time} · {m.dose}</div>
              </div>
              <button className={"check" + (m.taken ? " on" : "")} onClick={() => toggleMed(m.id)}
                style={m.taken ? { background: c.c, borderColor: c.c } : {}}>
                {m.taken && <Icon name="check" size={17} color="#fff" />}
              </button>
            </div>
          );
        })}
        <button className="btn soft block" style={{ marginTop: 16, "--accent-soft": "var(--lav-soft)", "--accent-ink": "var(--lav-ink)" }}
          onClick={() => setSheet("med")}><Icon name="plus" size={18} /> Adicionar medicação</button>
      </Card>

      {/* Movimento suave */}
      <Card title="Movimento suave" dotColor="sage"
        action={<button className="link-soft" onClick={() => setSheet("move")}>Sugestões</button>}>
        {s.moves.map((m) => (
          <div className="row" key={m.id}>
            <div className="row-ico" style={{ background: "var(--sage-soft)" }}>
              <Icon name={m.kind === "Calma" ? "wind" : m.kind === "Cardio leve" ? "walk" : "leaf"} size={21} color="var(--sage-ink)" />
            </div>
            <div className="row-main">
              <div className="row-title" style={{ opacity: m.done ? .55 : 1 }}>{m.name}</div>
              <div className="row-sub">{m.kind} · {m.mins} min</div>
            </div>
            <button className={"check" + (m.done ? " on" : "")} onClick={() => toggleMove(m.id)}
              style={m.done ? { background: "var(--sage)", borderColor: "var(--sage)" } : {}}>
              {m.done && <Icon name="check" size={17} color="#fff" />}
            </button>
          </div>
        ))}
        <p className="card-sub" style={{ marginTop: 14, fontStyle: "italic", fontFamily: "var(--serif)", fontSize: 15 }}>
          Faz só o que o corpo permitir. Parar a meio também é uma vitória.
        </p>
      </Card>

      {/* Alimentação & hidratação */}
      <Card title="Alimentação &amp; água" dotColor="honey">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <Icon name="drop" size={22} color="var(--sky-ink)" />
          <div style={{ display: "flex", gap: 6, flex: 1 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <button key={i} onClick={() => dv.setToday({ water: i + 1 === t.water ? i : i + 1 })}
                style={{ flex: 1, height: 30, borderRadius: 8, background: i < t.water ? "var(--sky)" : "var(--surface-2)", transition: "background .2s" }} />
            ))}
          </div>
          <span className="card-sub" style={{ minWidth: 34 }}>{t.water}/6</span>
        </div>
        <div className="card-sub" style={{ marginBottom: 9 }}>Refeições de hoje</div>
        <div className="chips">
          {meals.map((meal) => {
            const on = t.meals.includes(meal);
            return (
              <button key={meal} className={"chip" + (on ? " on" : "")} style={{ "--accent": "var(--honey)" }}
                onClick={() => dv.setToday({ meals: on ? t.meals.filter((x) => x !== meal) : [...t.meals, meal] })}>
                {on && <Icon name="check" size={14} color="var(--honey-ink)" />}{meal}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Consultas */}
      <Card title="Próximas consultas" dotColor="rose"
        action={<button className="link-soft" onClick={() => setSheet("appt")}>Adicionar</button>}>
        {s.appts.length === 0 && <p className="card-sub">Sem consultas marcadas.</p>}
        {s.appts.sort((a, b) => a.date.localeCompare(b.date)).map((a) => (
          <div className="row" key={a.id}>
            <div className="row-ico" style={{ background: "var(--rose-soft)", flexDirection: "column", gap: 0 }}>
              <span style={{ fontSize: 11, color: "var(--rose-ink)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1 }}>{monthShort(a.date)}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--rose-ink)", lineHeight: 1 }}>{dayNum(a.date)}</span>
            </div>
            <div className="row-main">
              <div className="row-title">{a.title}</div>
              <div className="row-sub">{a.who} · {a.time} · {a.place}</div>
            </div>
            <Icon name="chevron" size={20} color="var(--ink-3)" />
          </div>
        ))}
      </Card>

      {sheet === "med" && <AddMedSheet onClose={() => setSheet(null)} onAdd={(m) => { dv.set((st) => st.meds.push(m)); setSheet(null); showToast("Medicação adicionada"); }} />}
      {sheet === "appt" && <AddApptSheet onClose={() => setSheet(null)} onAdd={(a) => { dv.set((st) => st.appts.push(a)); setSheet(null); showToast("Consulta adicionada"); }} />}
      {sheet === "move" && <MoveSheet onClose={() => setSheet(null)} onAdd={(m) => { dv.set((st) => st.moves.push(m)); setSheet(null); showToast("Atividade adicionada"); }} />}
      {toast}
    </div>
  );
}

function AddMedSheet({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState("08:00");
  const colors = ["lav", "sage", "honey", "sky", "rose", "peach"];
  const [color, setColor] = useState("lav");
  return (
    <Sheet title="Nova medicação" onClose={onClose}>
      <Field label="Nome"><input className="ti" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Duloxetina" autoFocus /></Field>
      <Field label="Dose"><input className="ti" value={dose} onChange={(e) => setDose(e.target.value)} placeholder="Ex.: 30 mg" /></Field>
      <Field label="Hora"><input className="ti" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
      <Field label="Cor">
        <div className="chips">
          {colors.map((c) => (
            <button key={c} onClick={() => setColor(c)} style={{ width: 38, height: 38, borderRadius: 12, background: col(c).c, boxShadow: color === c ? "0 0 0 3px #fff, 0 0 0 5px " + col(c).c : "none" }} />
          ))}
        </div>
      </Field>
      <button className="btn block lg" disabled={!name} style={{ opacity: name ? 1 : .5, marginTop: 8 }}
        onClick={() => onAdd({ id: Date.now(), name, dose: dose || "1 dose", time, taken: false, color })}>Adicionar</button>
      <FieldStyles />
    </Sheet>
  );
}

function AddApptSheet({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [who, setWho] = useState("");
  const [date, setDate] = useState(DV.offset(3));
  const [time, setTime] = useState("10:00");
  const [place, setPlace] = useState("");
  return (
    <Sheet title="Nova consulta" onClose={onClose}>
      <Field label="Especialidade / motivo"><input className="ti" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Reumatologia" autoFocus /></Field>
      <Field label="Profissional"><input className="ti" value={who} onChange={(e) => setWho(e.target.value)} placeholder="Ex.: Dra. Antunes" /></Field>
      <div style={{ display: "flex", gap: 12 }}>
        <Field label="Data" style={{ flex: 1 }}><input className="ti" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Hora" style={{ flex: 1 }}><input className="ti" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
      </div>
      <Field label="Local"><input className="ti" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Ex.: Hospital de Dia" /></Field>
      <button className="btn block lg" disabled={!title} style={{ opacity: title ? 1 : .5, marginTop: 8 }}
        onClick={() => onAdd({ id: Date.now(), title, who: who || "—", date, time, place: place || "—" })}>Adicionar</button>
      <FieldStyles />
    </Sheet>
  );
}

function MoveSheet({ onClose, onAdd }) {
  const ideas = [
    { name: "Alongamentos na cama", mins: 5, kind: "Mobilidade" },
    { name: "Caminhada lenta", mins: 10, kind: "Cardio leve" },
    { name: "Respiração 4-7-8", mins: 5, kind: "Calma" },
    { name: "Yoga restaurativo", mins: 15, kind: "Mobilidade" },
    { name: "Tai chi suave", mins: 12, kind: "Mobilidade" },
    { name: "Alongar pescoço e ombros", mins: 4, kind: "Mobilidade" },
  ];
  return (
    <Sheet title="Movimento gentil" onClose={onClose}>
      <p className="card-sub" style={{ marginBottom: 16 }}>Atividades de baixo impacto. Escolhe sem te exigires demais.</p>
      {ideas.map((m, i) => (
        <div className="row" key={i}>
          <div className="row-ico" style={{ background: "var(--sage-soft)" }}><Icon name={m.kind === "Calma" ? "wind" : m.kind === "Cardio leve" ? "walk" : "leaf"} size={20} color="var(--sage-ink)" /></div>
          <div className="row-main"><div className="row-title">{m.name}</div><div className="row-sub">{m.kind} · {m.mins} min</div></div>
          <button className="btn soft" style={{ "--accent-soft": "var(--sage-soft)", "--accent-ink": "var(--sage-ink)", padding: "9px 14px" }}
            onClick={() => onAdd({ id: Date.now() + i, ...m, done: false })}>Juntar</button>
        </div>
      ))}
    </Sheet>
  );
}

function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );
}
function FieldStyles() {
  return (
    <style>{`.ti{width:100%;padding:14px 16px;border-radius:14px;border:1.5px solid var(--line-2);background:var(--surface);font-size:16px;color:var(--ink);outline:none;transition:border .2s}.ti:focus{border-color:var(--accent)}`}</style>
  );
}

function monthShort(iso) { return ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][new Date(iso + "T00:00:00").getMonth()]; }
function dayNum(iso) { return new Date(iso + "T00:00:00").getDate(); }

Object.assign(window, { ScreenCuidar });

/* Devagar — shell + navegação */
const NAV = [
  { key: "hoje", label: "Hoje", ico: "home" },
  { key: "corpo", label: "Corpo", ico: "body" },
  { key: "diario", label: "Diário", ico: "journal" },
  { key: "cuidar", label: "Cuidar", ico: "care" },
  { key: "padroes", label: "Padrões", ico: "chart" },
];

function Stub({ name }) {
  return (
    <div className="screen">
      <h1 className="page-title">{name}</h1>
      <div className="card" style={{ marginTop: 20 }}>
        <p className="card-sub">Em construção…</p>
      </div>
    </div>
  );
}

const ACCENTS = {
  "#6F9168": { s: "#E5EEDF", i: "#41633C", name: "Sálvia" },
  "#8B7EBE": { s: "#ECE7F7", i: "#5A4E8C", name: "Lavanda" },
  "#D2926B": { s: "#F7E7D9", i: "#A05F38", name: "Pêssego" },
  "#6FA0BB": { s: "#E1EDF3", i: "#3E748F", name: "Céu" },
  "#C27E92": { s: "#F5E3E9", i: "#97546A", name: "Rosa" },
};
const BGS = {
  creme: { bg: "#F4EFE6", bg2: "#EFE8DB" },
  bruma: { bg: "#EDF0EC", bg2: "#E4E9E2" },
  noite: { bg: "#ECE7E0", bg2: "#E3DCD2" },
};
const RADII = {
  nitido: { sm: "8px", r: "12px", lg: "16px", xl: "22px" },
  suave: { sm: "14px", r: "20px", lg: "28px", xl: "36px" },
  generoso: { sm: "18px", r: "26px", lg: "34px", xl: "44px" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#6F9168",
  "bg": "creme",
  "radius": "suave",
  "motion": true
}/*EDITMODE-END*/;

function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center" }}>
        <div className="breathe" style={{ width: 64, height: 64, borderRadius: 20, background: "var(--sage)", display: "grid", placeItems: "center", margin: "0 auto 22px", boxShadow: "var(--shadow)" }}>
          <Icon name="leaf" size={32} color="#fff" />
        </div>
        <div className="serif" style={{ fontSize: 26 }}>Devagar</div>
        <div className="card-sub" style={{ marginTop: 6 }}>a preparar o teu espaço…</div>
      </div>
      <style>{`.breathe{animation:breathe 2.6s ease-in-out infinite}@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`}</style>
    </div>
  );
}

function initialsOf(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

function Onboarding() {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(12);
  const [step, setStep] = useState(0);

  const finish = () => {
    DV.set((st) => {
      st.profile.name = name.trim();
      st.profile.initials = initialsOf(name) || "·";
      st.profile.energyBudget = budget;
    });
  };

  return (
    <div className="shell" style={{ justifyContent: "center" }}>
      <main className="main" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 26px 40px", maxWidth: 520 }}>
        <div className="screen" style={{ padding: 0 }}>
          <div style={{ width: 54, height: 54, borderRadius: 17, background: "var(--sage)", display: "grid", placeItems: "center", marginBottom: 26, boxShadow: "var(--shadow)" }}>
            <Icon name="leaf" size={27} color="#fff" />
          </div>

          {step === 0 && (
            <div>
              <h1 className="serif" style={{ fontSize: 38, lineHeight: 1.1, marginBottom: 14 }}>
                Olá. Bem-vinda ao <span className="serif-i">Devagar</span>.
              </h1>
              <p style={{ fontSize: 18, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 16 }}>
                Um espaço calmo para acompanhar a tua saúde ao teu ritmo — sem pressão, sem culpa.
                Tudo o que registas fica guardado <strong>só no teu dispositivo</strong>, numa base de dados privada.
              </p>
              <p className="affirm" style={{ color: "var(--sage-ink)", marginBottom: 30 }}>
                Vamos um dia de cada vez.
              </p>
              <button className="btn block lg" onClick={() => setStep(1)}>Começar <Icon name="chevron" size={19} color="#fff" /></button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="serif" style={{ fontSize: 32, lineHeight: 1.12, marginBottom: 8 }}>Como gostas de ser tratada?</h1>
              <p style={{ fontSize: 16, color: "var(--ink-2)", marginBottom: 22 }}>Só para tornar este espaço mais teu.</p>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) setStep(2); }}
                placeholder="O teu nome ou alcunha"
                style={{ width: "100%", padding: "18px 20px", borderRadius: 18, border: "1.5px solid var(--line-2)", background: "var(--surface)", fontSize: 19, fontFamily: "var(--serif)", color: "var(--ink)", outline: "none", marginBottom: 24 }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn ghost" onClick={() => setStep(0)} style={{ flex: 1 }}>Voltar</button>
                <button className="btn" disabled={!name.trim()} style={{ flex: 2, opacity: name.trim() ? 1 : .5 }} onClick={() => setStep(2)}>Continuar</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="serif" style={{ fontSize: 32, lineHeight: 1.12, marginBottom: 8 }}>As tuas colheres de energia</h1>
              <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 22 }}>
                A <span className="serif-i">teoria das colheres</span> ajuda a pensar a energia como um recurso limitado.
                Quantas colheres sentes que tens, num dia típico? Podes mudar quando quiseres.
              </p>
              <div className="card" style={{ display: "flex", justifyContent: "center", padding: 26 }}>
                <Stepper value={budget} min={4} max={20} onChange={setBudget} />
              </div>
              <div style={{ margin: "10px 0 26px" }}>
                <Spoons budget={budget} used={0} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>Voltar</button>
                <button className="btn" style={{ flex: 2 }} onClick={finish}>Entrar no meu espaço</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const dv = useDV();
  const [tab, setTab] = useState(() => location.hash.replace("#", "") || "hoje");
  const go = (k) => { setTab(k); location.hash = k; window.scrollTo({ top: 0, behavior: "smooth" }); };

  useEffect(() => { if (!DV.isBooted()) DV.boot(); }, []);

  useEffect(() => {
    const r = document.documentElement.style;
    const a = ACCENTS[t.accent] || ACCENTS["#6F9168"];
    r.setProperty("--accent", t.accent);
    r.setProperty("--accent-soft", a.s);
    r.setProperty("--accent-ink", a.i);
    const bg = BGS[t.bg] || BGS.creme;
    r.setProperty("--bg", bg.bg);
    r.setProperty("--bg-2", bg.bg2);
    const rad = RADII[t.radius] || RADII.suave;
    r.setProperty("--r-sm", rad.sm); r.setProperty("--r", rad.r);
    r.setProperty("--r-lg", rad.lg); r.setProperty("--r-xl", rad.xl);
    document.body.classList.toggle("no-motion", !t.motion);
  }, [t.accent, t.bg, t.radius, t.motion]);


  useEffect(() => {
    const h = () => setTab(location.hash.replace("#", "") || "hoje");
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);

  if (!DV.isBooted()) return <Loading />;
  if (!DV.get().profile.name) return <Onboarding />;

  const screens = {
    hoje: window.ScreenToday,
    corpo: window.ScreenCorpo,
    diario: window.ScreenDiario,
    cuidar: window.ScreenCuidar,
    padroes: window.ScreenPadroes,
  };
  const Screen = screens[tab] || (() => <Stub name={NAV.find((n) => n.key === tab)?.label} />);

  return (
    <div className="shell">
      {/* Desktop rail */}
      <nav className="rail">
        <div className="rail-brand">
          <div className="rail-mark"><Icon name="leaf" size={22} color="#fff" /></div>
          <div>
            <div className="rail-name">Devagar</div>
            <div className="rail-tag">um dia de cada vez</div>
          </div>
        </div>
        {NAV.map((n) => (
          <button key={n.key} className={"rail-item" + (tab === n.key ? " active" : "")} onClick={() => go(n.key)}>
            <Icon name={n.ico} size={22} /> {n.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="rail-item" onClick={() => go("padroes")} style={{ fontSize: 13.5, color: "var(--ink-3)" }}>
          <Icon name="settings" size={18} /> A minha base de dados
        </button>
      </nav>

      <main className="main">
        <Screen go={go} />
      </main>

      {/* Mobile tabbar */}
      <nav className="tabbar">
        <div className="tabbar-inner">
          {NAV.map((n) => (
            <button key={n.key} className={"tab" + (tab === n.key ? " active" : "")} onClick={() => go(n.key)}>
              <Icon name={n.ico} size={22} />
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Cor de destaque" />
        <TweakColor label="Tom" value={t.accent}
          options={Object.keys(ACCENTS)} onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Atmosfera" />
        <TweakRadio label="Plano de fundo" value={t.bg}
          options={["creme", "bruma", "noite"]} onChange={(v) => setTweak("bg", v)} />
        <TweakRadio label="Cantos" value={t.radius}
          options={["nitido", "suave", "generoso"]} onChange={(v) => setTweak("radius", v)} />
        <TweakToggle label="Animações suaves" value={t.motion} onChange={(v) => setTweak("motion", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

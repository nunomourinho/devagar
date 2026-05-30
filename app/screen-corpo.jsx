/* Devagar — Ecrã Corpo & Dor (mapa corporal + sintomas + crises) */

const PAIN_FILL = ["#EFE8DB", "#F3D9C4", "#E3A877", "#CC7B45"];
const PAIN_LBL = ["Sem dor", "Ligeira", "Moderada", "Forte"];

function BodyMap({ regions, onTap }) {
  const fill = (id) => PAIN_FILL[regions[id] || 0];
  const R = (id, El) => El(id, fill(id));
  const common = { stroke: "#fff", strokeWidth: 2.5, className: "region" };
  const rect = (id, f) => (
    <rect key={id} {...common} fill={f} onClick={() => onTap(id)}
      x={B[id].x} y={B[id].y} width={B[id].w} height={B[id].h} rx={B[id].r || 11} />
  );
  const ell = (id, f) => (
    <ellipse key={id} {...common} fill={f} onClick={() => onTap(id)}
      cx={B[id].cx} cy={B[id].cy} rx={B[id].rx} ry={B[id].ry} />
  );

  return (
    <svg className="bodyfig" viewBox="0 0 220 440" style={{ maxWidth: 240, margin: "0 auto", display: "block" }}>
      {R("armL", rect)}{R("armR", rect)}
      {R("handL", ell)}{R("handR", ell)}
      {R("shoulderL", ell)}{R("shoulderR", ell)}
      {R("chest", rect)}
      {R("abdomen", rect)}
      {R("pelvis", rect)}
      {R("thighL", rect)}{R("thighR", rect)}
      {R("kneeL", ell)}{R("kneeR", ell)}
      {R("calfL", rect)}{R("calfR", rect)}
      {R("footL", ell)}{R("footR", ell)}
      {R("neck", rect)}
      {R("head", ell)}
    </svg>
  );
}

const B = {
  head: { cx: 110, cy: 34, rx: 24, ry: 28 },
  neck: { x: 98, y: 56, w: 24, h: 18, r: 7 },
  shoulderL: { cx: 74, cy: 90, rx: 17, ry: 14 },
  shoulderR: { cx: 146, cy: 90, rx: 17, ry: 14 },
  chest: { x: 76, y: 80, w: 68, h: 58, r: 20 },
  abdomen: { x: 80, y: 140, w: 60, h: 52, r: 16 },
  armL: { x: 50, y: 92, w: 20, h: 100, r: 10 },
  armR: { x: 150, y: 92, w: 20, h: 100, r: 10 },
  handL: { cx: 60, cy: 200, rx: 11, ry: 14 },
  handR: { cx: 160, cy: 200, rx: 11, ry: 14 },
  pelvis: { x: 80, y: 190, w: 60, h: 38, r: 15 },
  thighL: { x: 84, y: 224, w: 27, h: 84, r: 13 },
  thighR: { x: 109, y: 224, w: 27, h: 84, r: 13 },
  kneeL: { cx: 97, cy: 314, rx: 14, ry: 12 },
  kneeR: { cx: 123, cy: 314, rx: 14, ry: 12 },
  calfL: { x: 86, y: 324, w: 23, h: 78, r: 11 },
  calfR: { x: 111, y: 324, w: 23, h: 78, r: 11 },
  footL: { cx: 97, cy: 410, rx: 13, ry: 11 },
  footR: { cx: 123, cy: 410, rx: 13, ry: 11 },
};

function ScreenCorpo({ go }) {
  const dv = useDV();
  const s = dv.get();
  const t = dv.today();
  const [toast, showToast] = useToast();

  const tapRegion = (id) => {
    const cur = t.regions[id] || 0;
    const next = (cur + 1) % 4;
    const regions = { ...t.regions };
    if (next === 0) delete regions[id]; else regions[id] = next;
    dv.setToday({ regions });
  };

  const toggleSymptom = (sym) => {
    const has = t.symptoms.includes(sym);
    dv.setToday({ symptoms: has ? t.symptoms.filter((x) => x !== sym) : [...t.symptoms, sym] });
  };

  const marked = Object.keys(t.regions).length;
  const allRegions = [...DV.REGIONS];
  // pílulas extra (costas) — usam ids próprios
  const backIds = [
    { id: "upperback", label: "Costas" },
    { id: "lowback", label: "Lombar" },
  ];

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="eyebrow">Corpo &amp; Dor</div>
          <h1 className="page-title">Onde dói<br /><span className="serif-i">hoje?</span></h1>
        </div>
      </div>

      {/* Intensidade geral */}
      <Card title="Dor no geral" dotColor="peach">
        <Scale value={t.pain} onPick={(v) => { dv.setToday({ pain: v }); }} max={10} color="peach"
          labels={["Sem dor", "Dor máxima"]} />
      </Card>

      {/* Mapa corporal */}
      <Card title="Mapa do corpo" dotColor="peach"
        action={<span className="card-sub">{marked ? marked + " zona(s)" : "toca para marcar"}</span>}>
        <BodyMap regions={t.regions} onTap={tapRegion} />
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
          {PAIN_LBL.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--ink-2)" }}>
              <span style={{ width: 16, height: 16, borderRadius: 5, background: PAIN_FILL[i], border: "1px solid var(--line-2)" }} />{l}
            </div>
          ))}
        </div>
        {/* costas */}
        <div style={{ marginTop: 16 }}>
          <div className="card-sub" style={{ marginBottom: 8 }}>Costas (não visíveis no mapa):</div>
          <div className="chips">
            {backIds.map((b) => {
              const v = t.regions[b.id] || 0;
              return (
                <button key={b.id} className={"chip" + (v ? " on" : "")} onClick={() => tapRegion(b.id)}
                  style={v ? { "--accent": PAIN_FILL[3], background: PAIN_FILL[v], color: "#5a3318", borderColor: "transparent" } : {}}>
                  {b.label}{v ? ` · ${PAIN_LBL[v]}` : ""}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Sintomas */}
      <Card title="Sintomas de hoje" dotColor="lav">
        <div className="chips">
          {DV.SYMPTOMS.map((sym) => (
            <button key={sym} className={"chip" + (t.symptoms.includes(sym) ? " on" : "")}
              style={{ "--accent": "var(--lav)" }} onClick={() => toggleSymptom(sym)}>{sym}</button>
          ))}
        </div>
      </Card>

      {/* Névoa mental */}
      <Card title="Névoa mental (fibro fog)" dotColor="sky">
        <Segs value={t.fog} onPick={(v) => dv.setToday({ fog: v })} color="sky" lo="Mente clara" hi="Muito enevoada" />
      </Card>

      {/* Crise / flare */}
      <div className="card" style={{ background: t.flare ? "var(--peach-soft)" : "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: t.flare ? "#fff" : "var(--peach-soft)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Icon name="flame" size={23} color="var(--peach-ink)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="row-title">Estou em crise</div>
            <div className="row-sub">Marca os dias de <em>flare-up</em> para veres padrões.</div>
          </div>
          <Switch on={t.flare} onToggle={() => { dv.setToday({ flare: !t.flare }); showToast(t.flare ? "Crise terminada" : "Crise registada. Cuida-te."); }} color="peach" />
        </div>
      </div>

      <button className="btn block lg" style={{ marginTop: 8 }} onClick={() => { showToast("Registo do corpo guardado."); go("hoje"); }}>
        <Icon name="check" size={20} color="#fff" /> Guardar registo
      </button>
      {toast}
    </div>
  );
}

function Switch({ on, onToggle, color = "sage" }) {
  const c = col(color);
  return (
    <button onClick={onToggle} style={{
      width: 54, height: 32, borderRadius: 999, padding: 3, flexShrink: 0,
      background: on ? c.c : "var(--line-2)", transition: "background .2s",
      display: "flex", justifyContent: on ? "flex-end" : "flex-start",
    }}>
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", boxShadow: "var(--shadow-sm)", transition: "all .2s" }} />
    </button>
  );
}

Object.assign(window, { ScreenCorpo, Switch });

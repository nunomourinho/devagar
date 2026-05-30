/* Devagar — componentes partilhados */
const { useState, useEffect, useRef } = React;

// mapa de cor -> variáveis CSS
const COLORS = {
  sage:  { c: "var(--sage)",  s: "var(--sage-soft)",  i: "var(--sage-ink)" },
  lav:   { c: "var(--lav)",   s: "var(--lav-soft)",   i: "var(--lav-ink)" },
  peach: { c: "var(--peach)", s: "var(--peach-soft)", i: "var(--peach-ink)" },
  sky:   { c: "var(--sky)",   s: "var(--sky-soft)",   i: "var(--sky-ink)" },
  honey: { c: "var(--honey)", s: "var(--honey-soft)", i: "var(--honey-ink)" },
  rose:  { c: "var(--rose)",  s: "var(--rose-soft)",  i: "var(--rose-ink)" },
};
const col = (k) => COLORS[k] || COLORS.sage;

/* Hook: subscreve ao estado global e re-renderiza */
function useDV() {
  const [, force] = useState(0);
  useEffect(() => DV.subscribe(() => force((n) => n + 1)), []);
  return DV;
}

/* Cartão genérico */
function Card({ title, dotColor, action, children, accent, className = "", style }) {
  return (
    <div className={"card " + className} style={style}>
      {(title || action) && (
        <div className="card-h">
          {title && (
            <div className="card-title">
              {dotColor && <span className="dot" style={{ background: col(dotColor).c }} />}
              {title}
            </div>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* Colheres de energia */
function Spoons({ budget, used }) {
  const remaining = Math.max(0, budget - used);
  return (
    <div className="spoons" aria-label={`${remaining} de ${budget} colheres restantes`}>
      {Array.from({ length: budget }).map((_, i) => {
        const filled = i < remaining;
        return (
          <svg key={i} className="spoon" width="22" height="34" viewBox="0 0 22 34">
            <ellipse cx="11" cy="9" rx="7.5" ry="9"
              fill={filled ? "var(--honey)" : "none"}
              stroke={filled ? "var(--honey)" : "var(--line-2)"} strokeWidth="2" />
            <rect x="9" y="16" width="4" height="16" rx="2"
              fill={filled ? "var(--honey)" : "var(--line-2)"} />
          </svg>
        );
      })}
    </div>
  );
}

/* Linha de humor */
function MoodRow({ value, onPick }) {
  return (
    <div className="moodrow">
      {DV.MOODS.map((m) => {
        const c = col(m.color);
        const on = value === m.key;
        return (
          <button key={m.key} className={"mood" + (on ? " on" : "")}
            onClick={() => onPick(m.key)}
            style={{ background: on ? c.s : "var(--surface-2)", "--accent": c.c, fontSize: 26 }}
            title={m.label}>
            {m.emoji}
          </button>
        );
      })}
    </div>
  );
}

/* Escala 0..N (dor, qualidade, etc.) */
function Scale({ value, onPick, max = 10, color = "peach", labels }) {
  const c = col(color);
  return (
    <div>
      <div className="scale">
        {Array.from({ length: max + 1 }).map((_, i) => {
          const on = value === i;
          return (
            <button key={i} className={"scale-seg" + (on ? " on" : "")}
              onClick={() => onPick(i)}
              style={{ background: on ? c.c : "var(--surface-2)" }}>
              {i}
            </button>
          );
        })}
      </div>
      {labels && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, color: "var(--ink-3)" }}>
          <span>{labels[0]}</span><span>{labels[1]}</span>
        </div>
      )}
    </div>
  );
}

/* Segmento compacto 1..5 (qualidade sono, névoa) */
function Segs({ value, onPick, max = 5, color = "sky", lo, hi }) {
  const c = col(color);
  return (
    <div>
      <div className="scale">
        {Array.from({ length: max }).map((_, i) => {
          const v = i + 1;
          const on = value === v;
          return (
            <button key={v} className={"scale-seg" + (on ? " on" : "")}
              onClick={() => onPick(v)}
              style={{ background: on ? c.c : "var(--surface-2)" }}>{v}</button>
          );
        })}
      </div>
      {(lo || hi) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, color: "var(--ink-3)" }}>
          <span>{lo}</span><span>{hi}</span>
        </div>
      )}
    </div>
  );
}

/* Bottom sheet */
function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grab" />
        {title && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div className="sheet-title">{title}</div>
            <button className="btn ghost" style={{ padding: 10, borderRadius: 999 }} onClick={onClose}>
              <Icon name="close" size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* Toast gentil */
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = (m) => {
    setMsg(m);
    clearTimeout(window.__dvToast);
    window.__dvToast = setTimeout(() => setMsg(null), 2400);
  };
  const node = msg ? (
    <div className="toast"><Icon name="sparkle" size={17} color="var(--honey)" />{msg}</div>
  ) : null;
  return [node, show];
}

/* Stepper +/- */
function Stepper({ value, onChange, suffix = "", step = 1, min = 0, max = 99 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <button className="btn ghost" style={{ width: 46, height: 46, padding: 0, borderRadius: 14 }}
        onClick={() => onChange(Math.max(min, value - step))}>
        <Icon name="close" size={2} /><span style={{ fontSize: 24, fontWeight: 600, marginTop: -2 }}>−</span>
      </button>
      <div style={{ fontFamily: "var(--serif)", fontSize: 26, minWidth: 64, textAlign: "center" }}>
        {value}{suffix}
      </div>
      <button className="btn ghost" style={{ width: 46, height: 46, padding: 0, borderRadius: 14 }}
        onClick={() => onChange(Math.min(max, value + step))}>
        <Icon name="plus" size={22} />
      </button>
    </div>
  );
}

Object.assign(window, { COLORS, col, useDV, Card, Spoons, MoodRow, Scale, Segs, Sheet, useToast, Stepper });

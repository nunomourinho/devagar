/* Devagar — ícones SVG suaves (line, arredondados) */
const Icon = ({ name, size = 24, stroke = 1.8, color = "currentColor", style }) => {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round",
    style, className: "ico",
  };
  switch (name) {
    case "home": // sol / hoje
      return (<svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg>);
    case "body":
      return (<svg {...p}><circle cx="12" cy="5" r="2.4"/><path d="M12 7.5v6M12 9l-4 1.5M12 9l4 1.5M12 13.5l-2.5 6M12 13.5l2.5 6"/></svg>);
    case "journal":
      return (<svg {...p}><path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z"/><path d="M5 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"/><path d="M9 8h5M9 12h5"/></svg>);
    case "care": // coração / cuidar
      return (<svg {...p}><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20Z"/></svg>);
    case "chart": // padrões
      return (<svg {...p}><path d="M4 19V5M4 19h16"/><path d="M8 16v-3M12 16V9M16 16v-6"/></svg>);
    case "spoon":
      return (<svg {...p}><ellipse cx="12" cy="7" rx="3.4" ry="4.4"/><path d="M12 11.4V21"/></svg>);
    case "moon":
      return (<svg {...p}><path d="M19 13.5A7 7 0 1 1 10.5 5a5.5 5.5 0 0 0 8.5 8.5Z"/></svg>);
    case "drop":
      return (<svg {...p}><path d="M12 3s6 6.3 6 10.5A6 6 0 0 1 6 13.5C6 9.3 12 3 12 3Z"/></svg>);
    case "leaf":
      return (<svg {...p}><path d="M5 19c0-8 6-13 14-13 0 8-5 14-13 14 0 0-1-3 1-6"/></svg>);
    case "pill":
      return (<svg {...p}><rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(45 12 12)"/><path d="M9 9l6 6"/></svg>);
    case "calendar":
      return (<svg {...p}><rect x="3.5" y="5" width="17" height="16" rx="3"/><path d="M3.5 9.5h17M8 3v3M16 3v3"/></svg>);
    case "plus":
      return (<svg {...p}><path d="M12 5v14M5 12h14"/></svg>);
    case "check":
      return (<svg {...p}><path d="M5 12.5l4.5 4.5L19 7"/></svg>);
    case "chevron":
      return (<svg {...p}><path d="M9 6l6 6-6 6"/></svg>);
    case "back":
      return (<svg {...p}><path d="M15 6l-6 6 6 6"/></svg>);
    case "close":
      return (<svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>);
    case "bell":
      return (<svg {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>);
    case "sparkle":
      return (<svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/></svg>);
    case "wind": // respiração
      return (<svg {...p}><path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h9a2.5 2.5 0 1 1-2.5 2.5"/></svg>);
    case "walk":
      return (<svg {...p}><circle cx="13" cy="4" r="1.8"/><path d="M11 21l1.5-5-2-2 1-4 3 2 2 1M9 12l1.5-3"/></svg>);
    case "flame":
      return (<svg {...p}><path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s0 2 1.5 2C11 13 9 9 12 3Z"/></svg>);
    case "warm": // refeição
      return (<svg {...p}><path d="M5 11h14a7 7 0 0 1-14 0Z"/><path d="M5 11V7M3 21h18"/><path d="M9 5c0-1 1-1 1-2M13 5c0-1 1-1 1-2"/></svg>);
    case "smile":
      return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5s1.3 1.5 3.5 1.5 3.5-1.5 3.5-1.5"/><path d="M9 9.5h.01M15 9.5h.01"/></svg>);
    case "settings":
      return (<svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.3l1.8-1.4-1.8-3.1-2.1.9a7 7 0 0 0-2.2-1.3L14 3h-4l-.3 2.5a7 7 0 0 0-2.2 1.3l-2.1-.9-1.8 3.1 1.8 1.4A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-1.8 1.4 1.8 3.1 2.1-.9a7 7 0 0 0 2.2 1.3L10 21h4l.3-2.5a7 7 0 0 0 2.2-1.3l2.1.9 1.8-3.1-1.8-1.4c.1-.4.1-.9.1-1.3Z"/></svg>);
    case "heart-pulse":
      return (<svg {...p}><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20Z"/><path d="M6 12h2l1.5-3 2 5 1.5-2H18"/></svg>);
    case "clock":
      return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>);
    default:
      return (<svg {...p}><circle cx="12" cy="12" r="9"/></svg>);
  }
};

window.Icon = Icon;

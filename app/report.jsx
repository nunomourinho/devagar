/* ============================================================
   Devagar — Resumo / Relatório por email
   Gera um documento HTML bonito com todos os dados e envia
   através da partilha nativa (mobile) ou mailto (desktop).
   ============================================================ */
(function () {
  const MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const MESL = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const esc = (x) => String(x == null ? "" : x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fdate = (iso) => { const d = new Date(iso + "T00:00:00"); return `${DIAS[d.getDay()]}, ${d.getDate()} ${MES[d.getMonth()]}`; };
  const flong = (iso) => { const d = new Date(iso + "T00:00:00"); return `${d.getDate()} de ${MESL[d.getMonth()]} de ${d.getFullYear()}`; };
  const moodLabel = (k) => (DV.MOODS.find((m) => m.key === k) || {}).label || "—";
  const moodEmoji = (k) => (DV.MOODS.find((m) => m.key === k) || {}).emoji || "";
  const regionLabel = (id) => (DV.REGIONS.find((r) => r.id === id) || { label: id }).label;
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  const f1 = (n) => (n == null ? "—" : (Math.round(n * 10) / 10).toString().replace(".", ","));

  /* recolhe e ordena os dias com algum registo */
  function gather(s) {
    const entries = Object.entries(s.days)
      .filter(([, d]) => d.mood || d.pain != null || d.sleepHours != null || d.flare ||
        (d.symptoms && d.symptoms.length) || Object.keys(d.regions || {}).length || d.energyUsed)
      .sort((a, b) => a[0].localeCompare(b[0]));
    const days = entries.map(([date, d]) => ({ date, ...d }));

    const pains = days.filter((d) => d.pain != null).map((d) => d.pain);
    const sleeps = days.filter((d) => d.sleepHours != null).map((d) => d.sleepHours);
    const energy = days.filter((d) => d.energyUsed != null).map((d) => d.energyUsed);
    const flares = days.filter((d) => d.flare).length;

    const symCount = {};
    const regCount = {};
    days.forEach((d) => {
      (d.symptoms || []).forEach((sy) => (symCount[sy] = (symCount[sy] || 0) + 1));
      Object.entries(d.regions || {}).forEach(([r, i]) => (regCount[r] = Math.max(regCount[r] || 0, i)));
    });
    const topSym = Object.entries(symCount).sort((a, b) => b[1] - a[1]);
    const topReg = Object.entries(regCount).sort((a, b) => b[1] - a[1]);

    const winTotals = {};
    days.forEach((d) => Object.entries(d.wins || {}).forEach(([k, n]) => (winTotals[k] = (winTotals[k] || 0) + n)));
    const wins = Object.entries(winTotals).sort((a, b) => b[1] - a[1]);

    return {
      days, range: days.length ? [days[0].date, days[days.length - 1].date] : null,
      avgPain: avg(pains), avgSleep: avg(sleeps),
      avgEnergyUsed: avg(energy), budget: s.profile.energyBudget, flares,
      topSym, topReg, wins,
    };
  }

  /* ---------- documento HTML bonito ---------- */
  function buildReportHTML(s) {
    const g = gather(s);
    const name = esc(s.profile.name || "Eu");
    const rangeTxt = g.range ? `${flong(g.range[0])} — ${flong(g.range[1])}` : "Ainda sem registos";
    const today = flong(DV.todayISO());

    const painColor = (p) => p == null ? "#EFE8DB" : ["#E5EEDF", "#E5EEDF", "#F8ECCF", "#F8ECCF", "#F7E7D9", "#F7E7D9", "#F7E7D9", "#F5E3E9", "#F5E3E9", "#F5E3E9", "#F5E3E9"][p];

    const dayRows = g.days.slice().reverse().map((d) => `
      <tr>
        <td style="padding:11px 14px;border-bottom:1px solid #EBE3D5;font-weight:600;white-space:nowrap;">${fdate(d.date)}</td>
        <td style="padding:11px 14px;border-bottom:1px solid #EBE3D5;">${d.mood ? moodEmoji(d.mood) + " " + esc(moodLabel(d.mood)) : "—"}</td>
        <td style="padding:11px 14px;border-bottom:1px solid #EBE3D5;text-align:center;">
          ${d.pain == null ? "—" : `<span style="display:inline-block;min-width:30px;padding:3px 8px;border-radius:20px;background:${painColor(d.pain)};font-weight:700;">${d.pain}/10</span>`}
        </td>
        <td style="padding:11px 14px;border-bottom:1px solid #EBE3D5;text-align:center;">${d.sleepHours == null ? "—" : f1(d.sleepHours) + "h"}</td>
        <td style="padding:11px 14px;border-bottom:1px solid #EBE3D5;text-align:center;">${d.energyUsed ? d.energyUsed + "/" + g.budget : "—"}</td>
        <td style="padding:11px 14px;border-bottom:1px solid #EBE3D5;text-align:center;">${d.flare ? "🔥" : ""}</td>
      </tr>`).join("");

    const card = (label, value, sub, color) => `
      <td style="padding:6px;">
        <div style="background:${color};border-radius:18px;padding:18px 16px;">
          <div style="font-size:30px;font-family:'Newsreader',Georgia,serif;line-height:1;color:#3B362F;">${value}</div>
          <div style="font-size:13px;color:#756E62;margin-top:6px;font-weight:600;">${label}</div>
          ${sub ? `<div style="font-size:12px;color:#A79E8F;margin-top:2px;">${sub}</div>` : ""}
        </div>
      </td>`;

    const chips = (arr, fmt) => arr.length
      ? `<div>${arr.map(fmt).join("")}</div>`
      : `<p style="color:#A79E8F;margin:0;">Sem registos.</p>`;

    const symChips = chips(g.topSym, ([sy, n]) =>
      `<span style="display:inline-block;margin:0 7px 7px 0;padding:8px 14px;border-radius:20px;background:#ECE7F7;color:#5A4E8C;font-size:14px;font-weight:600;">${esc(sy)} · ${n}×</span>`);
    const regChips = chips(g.topReg, ([r, i]) =>
      `<span style="display:inline-block;margin:0 7px 7px 0;padding:8px 14px;border-radius:20px;background:#F7E7D9;color:#A05F38;font-size:14px;font-weight:600;">${esc(regionLabel(r))} · ${["", "ligeira", "moderada", "forte"][i]}</span>`);
    const winLabel = (k) => (DV.WINS.find((w) => w.key === k) || { label: k }).label;
    const winChips = chips(g.wins, ([k, n]) =>
      `<span style="display:inline-block;margin:0 7px 7px 0;padding:8px 14px;border-radius:20px;background:#E5EEDF;color:#41633C;font-size:14px;font-weight:600;">${esc(winLabel(k))} · ${n}×</span>`);

    const meds = s.meds.length
      ? s.meds.map((m) => `<tr>
          <td style="padding:10px 14px;border-bottom:1px solid #EBE3D5;font-weight:600;">${esc(m.name)}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #EBE3D5;color:#756E62;">${esc(m.dose || "")}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #EBE3D5;color:#756E62;">${esc(m.time || "")}</td>
        </tr>`).join("")
      : `<tr><td style="padding:12px 14px;color:#A79E8F;" colspan="3">Sem medicação registada.</td></tr>`;

    const appts = s.appts.length
      ? s.appts.slice().sort((a, b) => a.date.localeCompare(b.date)).map((a) => `<tr>
          <td style="padding:10px 14px;border-bottom:1px solid #EBE3D5;font-weight:600;white-space:nowrap;">${fdate(a.date)} · ${esc(a.time || "")}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #EBE3D5;">${esc(a.title)}${a.who ? " — " + esc(a.who) : ""}<br><span style="color:#A79E8F;font-size:13px;">${esc(a.place || "")}</span></td>
        </tr>`).join("")
      : `<tr><td style="padding:12px 14px;color:#A79E8F;" colspan="2">Sem consultas marcadas.</td></tr>`;

    const journal = s.journal.length
      ? s.journal.map((j) => `
        <div style="background:#fff;border-radius:18px;padding:18px 20px;margin-bottom:12px;box-shadow:0 2px 8px rgba(91,74,48,0.05);">
          <div style="font-size:13px;color:#A79E8F;font-weight:600;margin-bottom:6px;">${fdate(j.date)} ${j.mood ? "· " + moodEmoji(j.mood) + " " + esc(moodLabel(j.mood)) : ""}</div>
          ${j.text ? `<div style="font-family:'Newsreader',Georgia,serif;font-size:17px;line-height:1.5;color:#3B362F;">${esc(j.text)}</div>` : ""}
          ${j.gratitude ? `<div style="margin-top:10px;padding:9px 13px;background:#F8ECCF;border-radius:12px;font-size:14px;color:#9A7220;">✦ Grata por: ${esc(j.gratitude)}</div>` : ""}
        </div>`).join("")
      : `<p style="color:#A79E8F;">Sem entradas no diário.</p>`;

    const sectionTitle = (t) => `<h2 style="font-family:'Newsreader',Georgia,serif;font-size:22px;font-weight:600;color:#3B362F;margin:34px 0 14px;letter-spacing:-0.01em;">${t}</h2>`;

    return `<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Resumo Devagar — ${name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;background:#EFE8DB;font-family:'Figtree',-apple-system,sans-serif;color:#3B362F;-webkit-font-smoothing:antialiased;">
<div style="max-width:660px;margin:0 auto;padding:0 0 40px;">
  <!-- header -->
  <div style="background:#6F9168;color:#fff;padding:40px 32px 34px;border-radius:0 0 28px 28px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
      <div style="width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,0.18);display:inline-flex;align-items:center;justify-content:center;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.25)" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-8 6-13 14-13 0 8-5 14-13 14 0 0-1-3 1-6"/></svg>
      </div>
      <span style="font-family:'Newsreader',Georgia,serif;font-size:24px;">Devagar</span>
    </div>
    <div style="font-size:13px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.8;font-weight:600;">Resumo de bem-estar</div>
    <h1 style="font-family:'Newsreader',Georgia,serif;font-size:34px;font-weight:500;margin:8px 0 4px;letter-spacing:-0.02em;">${name}</h1>
    <div style="opacity:0.9;font-size:15px;">${rangeTxt}</div>
  </div>

  <div style="padding:8px 26px;">
    <p style="font-size:16px;line-height:1.6;color:#756E62;margin:24px 4px;">
      Este é um resumo gentil dos registos de <strong style="color:#3B362F;">${name}</strong>, preparado a ${today}.
      Pode ser útil para uma consulta — uma fotografia honesta de como têm corrido os dias.
    </p>

    ${sectionTitle("Num relance")}
    <table style="width:100%;border-collapse:collapse;"><tr>
      ${card("Dor média", g.avgPain == null ? "—" : f1(g.avgPain), "em 10", "#F7E7D9")}
      ${card("Sono médio", g.avgSleep == null ? "—" : f1(g.avgSleep) + "h", "por noite", "#E1EDF3")}
    </tr><tr>
      ${card("Dias de crise", g.flares, "flare-ups", "#F5E3E9")}
      ${card("Dias registados", g.days.length, "com dados", "#E5EEDF")}
    </tr></table>

    ${sectionTitle("Dia a dia")}
    <div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 2px 8px rgba(91,74,48,0.05);">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead><tr style="background:#FBF6EE;text-align:left;">
          <th style="padding:11px 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#A79E8F;">Dia</th>
          <th style="padding:11px 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#A79E8F;">Humor</th>
          <th style="padding:11px 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#A79E8F;text-align:center;">Dor</th>
          <th style="padding:11px 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#A79E8F;text-align:center;">Sono</th>
          <th style="padding:11px 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#A79E8F;text-align:center;">Energia</th>
          <th style="padding:11px 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#A79E8F;text-align:center;">Crise</th>
        </tr></thead>
        <tbody>${dayRows || `<tr><td colspan="6" style="padding:16px;color:#A79E8F;">Ainda sem registos diários.</td></tr>`}</tbody>
      </table>
    </div>

    ${sectionTitle("Sintomas mais frequentes")}
    ${symChips}

    ${sectionTitle("Zonas de dor")}
    ${regChips}

    ${sectionTitle("Pequenas vitórias")}
    ${winChips}

    ${sectionTitle("Medicação")}
    <div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 2px 8px rgba(91,74,48,0.05);">
      <table style="width:100%;border-collapse:collapse;font-size:14px;"><tbody>${meds}</tbody></table>
    </div>

    ${sectionTitle("Próximas consultas")}
    <div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 2px 8px rgba(91,74,48,0.05);">
      <table style="width:100%;border-collapse:collapse;font-size:14px;"><tbody>${appts}</tbody></table>
    </div>

    ${sectionTitle("Do diário")}
    ${journal}

    <p style="text-align:center;font-size:12.5px;color:#A79E8F;margin:38px 20px 0;line-height:1.5;">
      Gerado pela Devagar · companheira de bem-estar.<br>
      Não substitui aconselhamento médico. Os dados pertencem a ${name}.
    </p>
  </div>
</div>
</body></html>`;
  }

  /* ---------- corpo de email curto (texto) ---------- */
  function buildEmailText(s) {
    const g = gather(s);
    const name = s.profile.name || "Eu";
    const L = [];
    L.push(`Resumo Devagar — ${name}`);
    if (g.range) L.push(`Período: ${flong(g.range[0])} a ${flong(g.range[1])}`);
    L.push("");
    L.push(`• Dor média: ${g.avgPain == null ? "—" : f1(g.avgPain) + "/10"}`);
    L.push(`• Sono médio: ${g.avgSleep == null ? "—" : f1(g.avgSleep) + "h por noite"}`);
    L.push(`• Dias de crise (flare): ${g.flares}`);
    L.push(`• Dias registados: ${g.days.length}`);
    if (g.topSym.length) L.push(`• Sintomas frequentes: ${g.topSym.slice(0, 5).map(([sy, n]) => `${sy} (${n}x)`).join(", ")}`);
    if (g.wins && g.wins.length) {
      const wl = (k) => (DV.WINS.find((w) => w.key === k) || { label: k }).label;
      L.push(`• Pequenas vitórias: ${g.wins.map(([k, n]) => `${wl(k)} (${n}x)`).join(", ")}`);
    }
    if (s.meds.length) L.push(`• Medicação: ${s.meds.map((m) => `${m.name}${m.dose ? " " + m.dose : ""}`).join(", ")}`);
    L.push("");
    L.push("O resumo detalhado e bonito segue em anexo (ficheiro HTML — abre em qualquer telemóvel ou computador).");
    L.push("");
    L.push("Enviado com a Devagar — saúde ao meu ritmo.");
    return L.join("\n");
  }

  function subjectOf(s) {
    return `Resumo Devagar — ${s.profile.name || "Eu"} — ${flong(DV.todayISO())}`;
  }

  /* ---------- abrir pré-visualização ---------- */
  function previewReport(s) {
    const html = buildReportHTML(s);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  /* ---------- enviar por email ---------- */
  async function sendByEmail(s) {
    const html = buildReportHTML(s);
    const text = buildEmailText(s);
    const subject = subjectOf(s);
    const fname = `devagar-resumo-${DV.todayISO()}.html`;
    const file = new File([html], fname, { type: "text/html" });

    // 1) Partilha nativa com ficheiro (Android Chrome / iOS) — abre Gmail/Email com anexo
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: subject, text });
        return "shared";
      }
    } catch (e) {
      if (e && e.name === "AbortError") return "cancel";
    }

    // 2) Fallback: descarrega o resumo + abre o email já preenchido para anexar
    try {
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url; a.download = fname;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {}
    const mail = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.location.href = mail;
    return "fallback";
  }

  window.DVReport = { buildReportHTML, buildEmailText, sendByEmail, previewReport, subjectOf };
})();

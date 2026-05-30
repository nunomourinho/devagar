/* ============================================================
   Devagar — companheira para fadiga crónica e fibromialgia
   Direção visual: calma, pastel quente, muito espaço, texto grande
   ============================================================ */

:root {
  /* Base — creme quente */
  --bg:        #F4EFE6;
  --bg-2:      #EFE8DB;
  --surface:   #FFFFFF;
  --surface-2: #FBF6EE;
  --line:      #EBE3D5;
  --line-2:    #E0D6C5;

  /* Tinta */
  --ink:    #3B362F;
  --ink-2:  #756E62;
  --ink-3:  #A79E8F;

  /* Acentos por área */
  --sage:      #6F9168;   --sage-soft: #E5EEDF;  --sage-ink: #41633C;
  --lav:       #8B7EBE;   --lav-soft:  #ECE7F7;  --lav-ink:  #5A4E8C;
  --peach:     #D2926B;   --peach-soft:#F7E7D9;  --peach-ink:#A05F38;
  --sky:       #6FA0BB;   --sky-soft:  #E1EDF3;  --sky-ink:  #3E748F;
  --honey:     #D7A546;   --honey-soft:#F8ECCF;  --honey-ink:#9A7220;
  --rose:      #C27E92;   --rose-soft: #F5E3E9;  --rose-ink: #97546A;

  /* Theme accent (alterável via Tweaks) */
  --accent:      var(--sage);
  --accent-soft: var(--sage-soft);
  --accent-ink:  var(--sage-ink);

  /* Tipografia */
  --serif: "Newsreader", Georgia, "Times New Roman", serif;
  --sans:  "Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Forma */
  --r-sm: 14px;
  --r:    20px;
  --r-lg: 28px;
  --r-xl: 36px;

  /* Sombras suaves e quentes */
  --shadow-sm: 0 2px 8px rgba(91, 74, 48, 0.05);
  --shadow:    0 8px 28px rgba(91, 74, 48, 0.07);
  --shadow-lg: 0 18px 48px rgba(91, 74, 48, 0.10);

  --maxw: 560px;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--sans);
  background: var(--bg);
  color: var(--ink);
  font-size: 17px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* very subtle warm vignette so the cream isn't flat */
.app-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(1200px 700px at 78% -8%, rgba(215,165,70,0.07), transparent 60%),
    radial-gradient(1000px 800px at 0% 100%, rgba(139,126,190,0.06), transparent 55%);
}

h1, h2, h3, h4 { margin: 0; font-weight: 600; letter-spacing: -0.01em; }
p { margin: 0; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
input, textarea, select { font-family: inherit; }

/* Display serif */
.serif { font-family: var(--serif); font-weight: 400; letter-spacing: -0.015em; }
.serif-i { font-family: var(--serif); font-style: italic; font-weight: 400; }

/* ---------- Layout shell ---------- */
.shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

/* Desktop rail */
.rail {
  display: none;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  width: 248px;
  padding: 34px 20px;
  flex-direction: column;
  gap: 6px;
}
.rail-brand {
  display: flex; align-items: center; gap: 12px;
  padding: 4px 12px 26px;
}
.rail-mark {
  width: 40px; height: 40px; border-radius: 13px;
  background: var(--accent); color: #fff;
  display: grid; place-items: center;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}
.rail-name { font-family: var(--serif); font-size: 25px; line-height: 1; }
.rail-tag { font-size: 12.5px; color: var(--ink-3); margin-top: 2px; }

.rail-item {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 14px;
  border-radius: var(--r);
  color: var(--ink-2);
  font-size: 16px; font-weight: 500;
  transition: background .2s, color .2s;
  text-align: left;
  width: 100%;
}
.rail-item:hover { background: rgba(255,255,255,0.6); color: var(--ink); }
.rail-item.active { background: var(--surface); color: var(--ink); box-shadow: var(--shadow-sm); }
.rail-item.active .ico { color: var(--accent); }
.rail-item .ico { color: var(--ink-3); flex-shrink: 0; }

/* Main column */
.main {
  width: 100%;
  max-width: var(--maxw);
  padding: 0 0 120px;
  min-height: 100vh;
}
.screen { padding: 26px 22px 0; animation: rise .5s cubic-bezier(.2,.7,.3,1); }
@keyframes rise { from { transform: translateY(12px); } to { transform: none; } }

/* ---------- Top greeting bar ---------- */
.topbar {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; margin-bottom: 22px;
}
.eyebrow { font-size: 13px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; }
.page-title { font-family: var(--serif); font-size: 34px; line-height: 1.08; margin-top: 6px; }
.avatar {
  width: 46px; height: 46px; border-radius: 50%;
  background: var(--lav-soft); color: var(--lav-ink);
  display: grid; place-items: center; font-weight: 600; font-size: 17px;
  flex-shrink: 0; box-shadow: var(--shadow-sm);
}

/* ---------- Cards ---------- */
.card {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: 22px;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
}
.card.flat { box-shadow: var(--shadow-sm); }
.card-h { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.card-title { font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 10px; }
.card-title .dot { width: 9px; height: 9px; border-radius: 50%; background: var(--accent); }
.card-sub { font-size: 14px; color: var(--ink-2); }
.link-soft { font-size: 14px; color: var(--ink-3); font-weight: 500; }
.link-soft:hover { color: var(--ink); }

/* section label */
.section-label { font-size: 13.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; margin: 26px 2px 12px; }

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 9px;
  padding: 14px 20px;
  border-radius: 999px;
  font-size: 16px; font-weight: 600;
  background: var(--accent); color: #fff;
  box-shadow: var(--shadow-sm);
  transition: transform .15s, filter .2s;
}
.btn:hover { filter: brightness(1.04); }
.btn:active { transform: scale(.98); }
.btn.block { width: 100%; }
.btn.ghost { background: var(--surface); color: var(--ink); box-shadow: var(--shadow-sm); }
.btn.soft { background: var(--accent-soft); color: var(--accent-ink); box-shadow: none; }
.btn.lg { padding: 17px 24px; font-size: 17px; }

/* ---------- Chips / pills ---------- */
.chips { display: flex; flex-wrap: wrap; gap: 9px; }
.chip {
  padding: 10px 15px; border-radius: 999px;
  background: var(--surface-2); color: var(--ink-2);
  font-size: 15px; font-weight: 500;
  border: 1.5px solid transparent;
  transition: all .18s;
  display: inline-flex; align-items: center; gap: 7px;
}
.chip:hover { background: #fff; }
.chip.on { background: var(--accent-soft); color: var(--accent-ink); border-color: color-mix(in oklab, var(--accent) 35%, transparent); }

/* pill stat */
.statrow { display: flex; gap: 12px; }
.stat {
  flex: 1; background: var(--surface-2); border-radius: var(--r);
  padding: 15px 16px;
}
.stat .v { font-family: var(--serif); font-size: 27px; line-height: 1; }
.stat .l { font-size: 13px; color: var(--ink-2); margin-top: 7px; }

/* ---------- Bottom nav (mobile) ---------- */
.tabbar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 30;
  display: flex; justify-content: center;
  padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--bg) 62%, rgba(244,239,230,0));
  pointer-events: none;
}
.tabbar-inner {
  pointer-events: auto;
  display: flex; gap: 2px;
  background: var(--surface);
  border-radius: 999px;
  padding: 7px 9px;
  box-shadow: var(--shadow-lg);
  max-width: 460px; width: 100%;
  justify-content: space-between;
}
.tab {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 8px 4px; border-radius: 999px;
  color: var(--ink-3); font-size: 11px; font-weight: 600;
  transition: color .2s, background .2s;
}
.tab.active { color: var(--accent-ink); background: var(--accent-soft); }
.tab .ico { transition: transform .2s; }
.tab.active .ico { transform: translateY(-1px); }

/* ---------- Energy spoons ---------- */
.spoons { display: flex; flex-wrap: wrap; gap: 7px; }
.spoon { transition: transform .2s; }
.spoon:active { transform: scale(.9); }

/* ---------- Mood faces ---------- */
.moodrow { display: flex; justify-content: space-between; gap: 8px; }
.mood {
  flex: 1; aspect-ratio: 1; max-width: 64px;
  border-radius: 50%; display: grid; place-items: center;
  background: var(--surface-2);
  transition: transform .18s, box-shadow .2s, background .2s;
}
.mood:hover { transform: translateY(-2px); }
.mood.on { box-shadow: 0 0 0 3px #fff, 0 0 0 5.5px var(--accent); transform: translateY(-2px); }

/* ---------- Sliders / scales ---------- */
.scale { display: flex; gap: 7px; }
.scale-seg {
  flex: 1; height: 44px; border-radius: 12px;
  background: var(--surface-2); display: grid; place-items: center;
  font-size: 15px; font-weight: 600; color: var(--ink-3);
  transition: all .15s;
}
.scale-seg.on { color: #fff; }

/* ---------- Body map ---------- */
.bodywrap { display: flex; gap: 8px; justify-content: center; }
.bodyfig { width: 100%; }
.region { cursor: pointer; transition: fill .2s, stroke .2s; }
.region:hover { stroke: var(--peach); stroke-width: 2; }

/* ---------- Journal ---------- */
.entry {
  background: var(--surface); border-radius: var(--r-lg);
  padding: 20px 22px; box-shadow: var(--shadow-sm); margin-bottom: 14px;
}
.entry-date { font-size: 13px; color: var(--ink-3); font-weight: 600; letter-spacing: .04em; }
.entry-body { font-family: var(--serif); font-size: 19px; line-height: 1.5; margin-top: 8px; color: var(--ink); }

textarea.journal-input {
  width: 100%; border: none; resize: none; outline: none;
  font-family: var(--serif); font-size: 20px; line-height: 1.5;
  color: var(--ink); background: transparent; min-height: 120px;
}
textarea.journal-input::placeholder { color: var(--ink-3); }

/* ---------- List rows (meds, appts) ---------- */
.row {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 0;
}
.row + .row { border-top: 1px solid var(--line); }
.row-ico { width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; flex-shrink: 0; }
.row-main { flex: 1; min-width: 0; }
.row-title { font-size: 16px; font-weight: 600; }
.row-sub { font-size: 14px; color: var(--ink-2); margin-top: 1px; }

.check {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid var(--line-2); flex-shrink: 0;
  display: grid; place-items: center; transition: all .2s;
  background: var(--surface);
}
.check.on { background: var(--accent); border-color: var(--accent); color: #fff; }

/* ---------- Progress ring & bars ---------- */
.bar { height: 10px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
.bar > i { display: block; height: 100%; border-radius: 999px; background: var(--accent); transition: width .5s cubic-bezier(.2,.7,.3,1); }

/* gentle quote / affirmation */
.affirm {
  font-family: var(--serif); font-style: italic;
  font-size: 21px; line-height: 1.45; color: var(--ink);
}

/* mini calendar week */
.week { display: flex; gap: 7px; }
.day {
  flex: 1; text-align: center; padding: 10px 0; border-radius: 14px;
  background: var(--surface-2);
}
.day .dn { font-size: 11px; color: var(--ink-3); font-weight: 600; text-transform: uppercase; }
.day .dd { font-size: 17px; font-weight: 600; margin-top: 4px; }
.day.today { background: var(--accent-soft); }
.day.today .dd { color: var(--accent-ink); }
.day .pip { width: 6px; height: 6px; border-radius: 50%; margin: 5px auto 0; }

/* trend bars (insights) */
.trend { display: flex; align-items: flex-end; gap: 8px; height: 130px; }
.trend-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 7px; height: 100%; justify-content: flex-end; }
.trend-bar { width: 100%; border-radius: 8px 8px 4px 4px; background: var(--accent); transition: height .6s cubic-bezier(.2,.7,.3,1); min-height: 6px; }
.trend-lbl { font-size: 11px; color: var(--ink-3); font-weight: 600; }

/* sheet / modal */
.sheet-scrim {
  position: fixed; inset: 0; z-index: 50; background: rgba(59,54,47,0.28);
  backdrop-filter: blur(3px);
  display: flex; align-items: flex-end; justify-content: center;
  animation: fade .25s both;
}
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
.sheet {
  background: var(--bg); width: 100%; max-width: var(--maxw);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  padding: 12px 22px calc(28px + env(safe-area-inset-bottom));
  box-shadow: var(--shadow-lg);
  animation: slideup .35s cubic-bezier(.2,.8,.25,1) both;
  max-height: 90vh; overflow-y: auto;
}
@keyframes slideup { from { transform: translateY(100%); } to { transform: none; } }
.sheet-grab { width: 42px; height: 5px; border-radius: 999px; background: var(--line-2); margin: 0 auto 18px; }
.sheet-title { font-family: var(--serif); font-size: 26px; margin-bottom: 4px; }

.fadein { animation: fade .4s both; }

/* desliga animações de entrada se o utilizador preferir */
.no-motion .screen { animation: none; }
.no-motion .sheet { animation: none; }

/* gentle toast */
.toast {
  position: fixed; left: 50%; bottom: 96px; transform: translateX(-50%);
  z-index: 60; background: var(--ink); color: #fff;
  padding: 13px 20px; border-radius: 999px; font-size: 15px; font-weight: 500;
  box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 9px;
  animation: toastin .4s cubic-bezier(.2,.8,.25,1) both;
}
@keyframes toastin { from { opacity: 0; transform: transl(-50%, 12px); } to { opacity: 1; } }

/* ---------- Responsive ---------- */
@media (min-width: 900px) {
  .rail { display: flex; }
  .tabbar { display: none; }
  .main { max-width: 600px; padding-bottom: 60px; border-left: 1px solid var(--line); border-right: 1px solid var(--line); background: color-mix(in oklab, var(--bg) 50%, #fff); min-height: 100vh; }
  .screen { padding: 40px 40px 0; }
  .shell { gap: 0; }
}
@media (min-width: 1180px) {
  .main { max-width: 680px; }
}

/* larger touch text option respected by default — already 17px base */

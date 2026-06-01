# Devagar 🌿

**Uma companheira digital, calma e sem pressões, para viver com fadiga crónica e fibromialgia.**

Devagar ajuda a acompanhar a saúde *ao teu ritmo* — registar energia, dor, sono, humor, sintomas e crises, escrever no diário, gerir medicação e consultas, celebrar pequenas vitórias e reconhecer padrões ao longo do tempo. O foco é o **apoio emocional e a motivação**, nunca a culpa ou a pressão de metas.

> *"Um dia de cada vez. Às vezes, uma hora de cada vez."*

---

## ✨ Funcionalidades

| Ecrã | O que faz |
|------|-----------|
| **Hoje** | Saudação, afirmação do dia, "as minhas colheres" (teoria das colheres para gerir energia), check-in de humor e atalhos gentis de cuidado. |
| **Corpo & Dor** | Escala de dor, **mapa corporal interativo** (toca para marcar zonas e intensidade), sintomas, névoa mental (*fibro fog*) e registo de crises (*flare-ups*). |
| **Diário** | Escrita reflexiva com sugestões e um campo de gratidão. |
| **Cuidar** | Sono, medicação (com lembretes), movimento suave, alimentação/hidratação, consultas, **dicas** para fibromialgia e **pequenas vitórias** (Água, Respirar, Alongar, Pausa). |
| **Padrões** | Tendências da semana (energia, dor, sono, humor), observações encorajadoras, gestão da base de dados e **resumo por email**. |

### Destaques
- 🥄 **Teoria das colheres** — gere a energia como um recurso limitado e precioso.
- 🧠 **Mapa corporal** interativo para localizar a dor.
- 💌 **Resumo por email** — gera um documento bonito com todos os registos (ideal para mostrar à equipa médica).
- 💡 **Dicas** — Pacing, Higiene do Sono, Respiração Diafragmática, Dizer Não.
- 🏆 **Pequenas vitórias** — celebra cada gesto de cuidado, sem mínimos nem metas.

---

## 🔒 Privacidade

**Todos os dados ficam apenas no teu dispositivo.** Não há servidor, não há conta, nada é enviado para a internet. A informação de saúde é guardada numa base de dados **SQLite** privada, dentro do próprio navegador.

---

## 🗄️ Base de dados (SQLite)

A app usa uma base de dados SQLite real (via [sql.js](https://github.com/sql-js/sql.js) / WebAssembly), persistida no **IndexedDB** do dispositivo. Se o SQLite não conseguir carregar (modo totalmente offline), a app recorre automaticamente ao armazenamento local, sem perder funcionalidade.

**Tabelas:** `profile`, `days`, `day_symptoms`, `day_regions`, `day_meals`, `day_wins`, `journal`, `meds`, `appts`, `moves`, `settings`.

No separador **Padrões → A tua base de dados** podes:
- **Exportar** uma cópia de segurança (`.sqlite`)
- **Importar** uma base de dados exportada (substitui os dados atuais, com confirmação)

A app **começa completamente vazia**, com um pequeno arranque (*onboarding*) para o nome e o orçamento de energia.

---

## 📱 Instalar no telemóvel (PWA)

A Devagar é uma **PWA** (Progressive Web App): instala-se no ecrã inicial, abre em ecrã inteiro e funciona offline.

1. Aloja a pasta num serviço com HTTPS (ex.: **GitHub Pages** — ver `PUBLICAR-GITHUB-PAGES.txt`).
2. Abre o link no **Chrome (Android)**.
3. Menu **⋮** → **"Adicionar ao ecrã principal" / "Instalar aplicação"**.

> Deixa a app carregar uma vez com internet — é quando o modo offline fica preparado.

---

## 🚀 Executar localmente

Como a app usa módulos e um *service worker*, deve ser servida por HTTP (não abrir o ficheiro diretamente como `file://`). Com Python:

```bash
# na pasta do projeto
python3 -m http.server 8000
# depois abre  http://localhost:8000/Devagar.html
```

O *service worker* (offline + instalável) só ativa em `http(s)://`.

---

## 🗂️ Estrutura do projeto

```
.
├── Devagar.html            App principal (carrega tudo)
├── index.html              Página de arranque / redireccionamento
├── manifest.webmanifest    Metadados da PWA (nome, ícones, cores)
├── sw.js                   Service worker (cache offline)
├── .nojekyll               Evita processamento Jekyll no GitHub Pages
├── icons/                  Ícones da app (192, 512, maskable)
└── app/
    ├── styles.css          Sistema visual (tokens, componentes)
    ├── db.js               Camada SQLite + persistência IndexedDB
    ├── data.js             Estado da app, catálogos, persistência
    ├── report.jsx          Gerador do resumo / email
    ├── icons.jsx           Ícones SVG
    ├── components.jsx      Componentes partilhados (cartões, escalas, etc.)
    ├── tweaks-panel.jsx    Painel de personalização (cor, fundo, cantos)
    ├── screen-today.jsx    Ecrã Hoje
    ├── screen-corpo.jsx    Ecrã Corpo & Dor
    ├── screen-diario.jsx   Ecrã Diário
    ├── screen-cuidar.jsx   Ecrã Cuidar
    ├── screen-padroes.jsx  Ecrã Padrões
    └── app.jsx             Shell, navegação, onboarding, PWA
```

---

## 🎨 Design

- **Tom visual:** calmo, tons pastel quentes sobre creme, muito espaço, cantos suaves, texto grande e legível.
- **Tipografia:** [Newsreader](https://fonts.google.com/specimen/Newsreader) (serifa humana, para os momentos emocionais) + [Figtree](https://fonts.google.com/specimen/Figtree) (sans limpa para a interface).
- **Cor por área:** sálvia (energia), lavanda (mente/humor), pêssego (corpo/dor), céu (sono), mel (colheres), rosa (cuidar).
- **Responsivo:** barra lateral no computador, navegação inferior no telemóvel.
- **Personalização:** botão *Tweaks* para cor de destaque, plano de fundo, cantos e animações.

---

## 🛠️ Tecnologia

- HTML + React 18 (via Babel, sem *build step*)
- SQLite (sql.js / WebAssembly) + IndexedDB
- Progressive Web App (manifest + service worker)
- Sem dependências de servidor — 100% no cliente

---

## ⚠️ Aviso

A Devagar é um **companheiro de bem-estar** e **não substitui aconselhamento médico**. Em caso de dúvida sobre a tua saúde, fala sempre com a tua equipa de saúde.

---

*Feito com cuidado, para se viver devagar.* 🌿

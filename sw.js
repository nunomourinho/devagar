/* ============================================================
   Devagar — Service Worker
   Cache offline do shell + dependências (React, Babel, SQLite WASM, fontes).
   Estratégia: cache-first com preenchimento em tempo de execução.
   ============================================================ */
const CACHE = "devagar-v1";

// Ficheiros locais essenciais (a app não arranca sem estes)
const SHELL = [
  "./",
  "Devagar.html",
  "index.html",
  "manifest.webmanifest",
  "app/styles.css",
  "app/db.js",
  "app/data.js",
  "app/icons.jsx",
  "app/components.jsx",
  "app/tweaks-panel.jsx",
  "app/screen-today.jsx",
  "app/screen-corpo.jsx",
  "app/screen-diario.jsx",
  "app/screen-cuidar.jsx",
  "app/screen-padroes.jsx",
  "app/app.jsx",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
];

// Dependências externas (CDN) — necessárias para funcionar offline
const EXTERNAL = [
  "https://unpkg.com/react@18.3.1/umd/react.development.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js",
  "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js",
  "https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-wasm.js",
  "https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-wasm.wasm",
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // shell: tem de entrar todo
    await cache.addAll(SHELL);
    // externos: tolerante a falhas individuais
    await Promise.allSettled(EXTERNAL.map(async (url) => {
      try {
        const res = await fetch(url, { mode: "cors" });
        if (res.ok || res.type === "opaque") await cache.put(url, res.clone());
      } catch (_) {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: false });
    if (cached) return cached;

    try {
      const res = await fetch(req);
      // guarda cópias úteis (mesma origem, CDN, fontes Google)
      if (res && (res.ok || res.type === "opaque")) {
        const url = req.url;
        const cacheable =
          url.startsWith(self.location.origin) ||
          url.includes("unpkg.com") ||
          url.includes("jsdelivr.net") ||
          url.includes("fonts.googleapis.com") ||
          url.includes("fonts.gstatic.com");
        if (cacheable) cache.put(req, res.clone());
      }
      return res;
    } catch (err) {
      // offline: para navegação, devolve a app
      if (req.mode === "navigate") {
        return (await cache.match("Devagar.html")) || (await cache.match("./"));
      }
      throw err;
    }
  })());
});

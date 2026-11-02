/* KIPROTU 규정집 — 오프라인 지원
   규정 데이터를 고친 뒤에는 아래 VERSION 숫자를 하나 올려 주세요. */
const VERSION = "kiprotu-v1";
const CORE = ["./", "index.html", "rules-data.js", "manifest.webmanifest",
  "logo-en.png", "logo-ko.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
/* 인터넷이 되면 항상 최신 규정을 받아오고(개정 즉시 반영), 안 되면 저장본을 보여줍니다. */
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === "navigate" ? caches.match("index.html") : undefined)))
  );
});

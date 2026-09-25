// Service Worker: hält die App offline verfügbar (z. B. bei schlechtem Empfang im Laden).
// Bei jeder Änderung an den Dateien VERSION erhöhen, damit das iPhone die neue Fassung lädt.
const VERSION = 'einkauf-7';
const DATEIEN = ['./', 'index.html', 'katalog.js', 'vendor/zxing.min.js', 'manifest.webmanifest', 'icon-180.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(namen => Promise.all(namen.filter(n => n !== VERSION).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // Seite und Katalog: erst Netz (damit Updates ankommen), sonst Cache
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('katalog.js')) {
    e.respondWith(
      fetch(e.request)
        .then(r => { const kopie = r.clone(); caches.open(VERSION).then(c => c.put(e.request, kopie)); return r; })
        .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
    );
    return;
  }
  // Alles andere: Cache zuerst
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

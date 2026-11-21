// Stock Filament 3D — réseau d'abord (toujours la dernière version), cache si hors ligne
const C = 'sf3d-v2';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const key = e.request.mode === 'navigate' ? './' : e.request;
  e.respondWith(caches.open(C).then(c =>
    fetch(e.request, { cache: 'no-cache' })
      .then(r => { if (r.ok) c.put(key, r.clone()); return r; })
      .catch(() => c.match(key).then(hit => hit || Response.error()))
  ));
});

// Stock Filament 3D — fonctionne hors ligne (l'app s'ouvre même sans réseau)
const C = 'sf3d-v1';
const FILES = ['./', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-180.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  const key = e.request.mode === 'navigate' ? './' : e.request;
  // Affichage immédiat depuis le cache, mise à jour en arrière-plan
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(key);
    const net = fetch(e.request).then(r => { if (r.ok) c.put(key, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});

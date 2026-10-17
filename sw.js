// Thêta — service worker (hors ligne, partage entrant, polices)
// Changez ce numéro à chaque mise à jour de index.html pour forcer le rafraîchissement.
const CACHE = 'theta-v2-preview-1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== 'theta-v2-share').map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// « Partager vers Thêta » depuis une autre application
async function handleShare(req) {
  const fd = await req.formData();
  const text = [fd.get('title'), fd.get('text'), fd.get('url')].filter(Boolean).join('\n');
  const files = fd.getAll('media').filter(f => f && f.size);
  const c = await caches.open('theta-v2-share');
  await c.put('share/meta', new Response(JSON.stringify({ text, n: files.length, t: Date.now() }), { headers: { 'Content-Type': 'application/json' } }));
  for (let i = 0; i < files.length; i++) await c.put('share/file' + i, new Response(files[i], { headers: { 'Content-Type': files[i].type || 'image/jpeg' } }));
  return Response.redirect(new URL('./?shared=1', self.registration.scope).href, 303);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  if (req.method === 'POST' && url.origin === location.origin && url.pathname.endsWith('/share')) {
    e.respondWith(handleShare(req));
    return;
  }

  // Polices Google : gardées en cache pour le hors ligne
  if (req.method === 'GET' && (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com')) {
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }))));
    return;
  }

  // Google (connexion, agenda, Drive) et autres sites : toujours en direct
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // Page : réseau d'abord (pour recevoir les mises à jour), cache si hors ligne
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req.url, { cache: 'no-store', credentials: 'same-origin' })
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(list => list.length ? list[0].focus() : self.clients.openWindow('./'))
  );
});

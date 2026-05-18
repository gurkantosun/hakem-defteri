const CACHE_NAME = 'hakem-defteri-v1';
const urlsToCache = ['./manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// index.html ve dinamik kaynakları HİÇ cache'leme — her zaman network'ten al
self.addEventListener('fetch', event => {
  const url = event.request.url;
  if(
    url.endsWith('/') ||
    url.includes('index.html') ||
    url.includes('docs.google.com') ||
    url.includes('firebase') ||
    url.includes('googleapis') ||
    url.includes('gstatic.com') ||
    url.includes('cdn.jsdelivr') ||
    url.includes('cdnjs.cloudflare')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
  );
});

const CACHE_NAME = 'hakem-defteri-v1';
const urlsToCache = ['./', './index.html', './manifest.json'];

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

// index.html'i HİÇ cache'leme — her zaman network'ten al
self.addEventListener('fetch', event => {
  if(event.request.url.includes('index.html') || 
     event.request.url.includes('docs.google.com') ||
     event.request.url.includes('firebase') ||
     event.request.url.includes('googleapis')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
  );
});

const CACHE_NAME = 'hakem-defteri-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Kurulum: yeni cache'i aç ve dosyaları ekle, hemen aktif ol
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // beklemeden aktif ol
  );
});

// Aktivasyon: eski cache'leri temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim()) // açık sekmeleri hemen devral
  );
});

// Fetch: önce network'ten dene, yoksa cache'den sun
self.addEventListener('fetch', event => {
  // Google Sheets gibi dış istekleri cache'leme
  if(event.request.url.includes('docs.google.com') ||
     event.request.url.includes('firestore.googleapis.com') ||
     event.request.url.includes('firebase')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

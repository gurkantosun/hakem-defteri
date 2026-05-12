const CACHE_NAME = 'hakem-defteri-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Kurulum aşaması: Belirtilen dosyaları önbelleğe (cache) al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch aşaması: İnternet yoksa bile önbellekteki dosyaları göster
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

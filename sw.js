const CACHE_NAME = 'trader-calc-v5';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clientsClaim();
  // Удаляем все старые кэши при обновлении
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // ГЛАВНОЕ ИСПРАВЛЕНИЕ: Для HTML-страниц всегда идём в сеть, игнорируя кэш
  if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Для остальных ресурсов (если будут) используем кэш
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

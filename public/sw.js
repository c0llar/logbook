const CACHE = 'logbook-cache'

const FILES_TO_CACHE = [
  '/',
  '/bundle.js',
  '/styles.css'
]

self.addEventListener('install', event => {
  event.waitUntil(caches
      .open(CACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE)))
})

self.addEventListener('fetch', function(event) {
  if (navigator.onLine) {
    event.respondWith(fetch(event.request))
  } else {
    event.respondWith(caches
        .match(event.request)
        .then(response => response ? response : caches.match('/')))
  }
})

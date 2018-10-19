const staticCacheName = 'restaurant-app-v1';


// caches files on service worker install
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache){
            return cache.addAll([
                '/',
                '/restaurant.html',
                'css/styles.css',
                'js/dbhelper.js',
                'js/main.js',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
                ]);
            }
        )
    )
});

// retrive files from cache if available or network if not
self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('restaurant-app-') &&
                    cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return cache.delete(cacheName);
                })
            )
        })
    )
});

// intercept requests and respond from cache if possible
self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request, {ignoreSearch: true}).then(function(response){
            if (response) {
                return response;
            }
            return fetch(event.request)
        })
    );
});

// skip waiting if user chooses to update service worker
self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
});
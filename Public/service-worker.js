
const FILES_TO_CACHE = [

    '/index.html',
    '/contact.html',
    '/style.css',
    '/manifest.webmanifest',
    '/Assets/images/alex.png',
    '/Assets/images/blur-cars.jpg',
    '/Assets/images/cost-tracker.jpg',
    '/Assets/images/employee.png',
    '/Assets/images/github.png',
    '/Assets/images/glasses.jpg',
    '/Assets/images/link.png',
    '/Assets/images/resume.jpg',
    '/Assets/images/Resume.pdf',
    '/Assets/images/theroad.jpg',
    '/Assets/icons/72.png',
    '/Assets/icons/96.png',
    '/Assets/icons/120.png',
    '/Assets/icons/128.png',
    '/Assets/icons/144.jpeg',
    '/Assets/icons/152.png',
    '/Assets/icons/180.png',
    '/Assets/icons/192.png',
    '/Assets/icons/384.png',
    '/Assets/icons/512.png'
  ];

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", function (evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch(err => {
                        // Network request failed, try to get it from the cache.
                        return cache.match(evt.request);
                    });
            }).catch(err => console.log(err))
        );

        return;
    }

    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    );
});

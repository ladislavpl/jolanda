const CACHE_NAME = 'jolanda-v5';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './data.json',
    './manifest.json',
    './assets/icons/icon.svg'
];

self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (event) => {
    // Claim any clients immediately, so that the new service worker controls the page
    // without a reload.
    event.waitUntil(self.clients.claim());

    // Remove old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Handle Google Fonts (CSS and WOFF2)
    if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((response) => {
                    if (response) return response;
                    return fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(() => new Response('', { status: 404, statusText: 'Offline' }));
                });
            })
        );
        return;
    }

    // Default strategy: Network first (for fresh content), fallback to cache
    // Or Stale-While-Revalidate could be better, but let's stick to a robust update strategy.
    // Actually, stick to Cache First but with the lifecycle updates above,
    // the next reload (triggered by controllerchange in script.js) will get new content.
    // BUT, for development/frequent updates, Network First is often safer.
    // However, for a PWA 'Offline First' experience, Cache First is standard.
    // The key fix is `skipWaiting` + `clients.claim` + `controllerchange` reload.
    
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((networkResponse) => {
                // Optionally cache new assets on fly
                if (networkResponse.ok && event.request.method === 'GET') {
                    const cacheCopy = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, cacheCopy);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // If it's a navigation request, we could show an offline page
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                return new Response('', { status: 404, statusText: 'Offline' });
            });
        })
    );
});

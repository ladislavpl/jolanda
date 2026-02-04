const CACHE_NAME = 'jolanda-v1';
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
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Handle Google Fonts (CSS and WOFF2)
    if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((response) => {
                    // Cache Hit or Network Fallback
                    return response || fetch(event.request).then((networkResponse) => {
                        // Cache the network response for future
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }).catch((err) => {
                        // If both cache and network fail, return a fallback or nothing (browser handles error)
                        // Returning a 404 allows the promise to resolve, silencing the "Uncaught" error.
                        // The font request will simply fail in the network tab.
                        return new Response('', { status: 404, statusText: 'Offline' });
                    });
                });
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request).catch((err) => {
                    console.log('Fetch failed for:', event.request.url);
                    // For navigation requests, we could return an offline page here
                    // For now, just ensuring we don't return undefined to respondWith
                    return new Response('', { status: 404, statusText: 'Offline' });
                });
            })
    );
});

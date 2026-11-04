// Service Worker for Karnataka Gym Hubli Progressive Web App (PWA)
// Cache version bump to invalidate and purge legacy stale caches
const CACHE_NAME = 'karnataka-gym-v3-clean';
const STATIC_ASSETS = [
  '/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  // Pre-cache only immutable icons/manifest - NEVER cache index.html or root
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Activate worker immediately without waiting for browser restart
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Delete all legacy and stale caches including karnataka-gym-v1
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => {
      // Claim all clients immediately
      return self.clients.claim();
    }).then(() => {
      // Auto-reload any open tabs stuck on stale HTML or broken script hashes
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          if (client.url && 'navigate' in client) {
            client.navigate(client.url);
          }
        });
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For HTML navigation requests, ALWAYS fetch directly from network
  // This guarantees users always get the latest bundle hashes on every visit/refresh
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Only if completely offline and network fails, check cache
        return caches.match(event.request);
      })
    );
    return;
  }

  // For static manifest or favicon, check cache then network
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
    return;
  }

  // Pass through all other requests (Vite JS bundles, CSS, API calls) directly to network
  // Do NOT intercept or cache hashed assets to prevent stale version collisions
  return;
});

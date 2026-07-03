const CACHE_NAME = "roadlink-trip-control-v3";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/roadlink-logo.svg",
  "./assets/roadlink-logo-home.svg",
  "./assets/roadlink-logo-light.svg",
  "./assets/pwa-icon-192.png",
  "./assets/pwa-icon-512.png",
  "./assets/pwa-icon-maskable-512.png",
  "./assets/pwa-icon.svg",
  "./assets/pwa-icon-maskable.svg",
  "./assets/roadlink-home.mov"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
    )
  );
});

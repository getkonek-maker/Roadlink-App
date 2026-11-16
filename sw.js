const CACHE_NAME = "roadlink-trip-control-v15";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=15",
  "./workspace.css?v=15",
  "./app.js?v=15",
  "./workspace.js?v=15",
  "./walkthrough.js?v=15",
  "./demo-chat.js?v=15",
  "./manifest.webmanifest",
  "./assets/roadlink-logo.svg",
  "./assets/roadlink-logo-home.svg",
  "./assets/roadlink-logo-light.svg",
  "./assets/pwa-icon-192.png",
  "./assets/pwa-icon-512.png",
  "./assets/pwa-icon-maskable-512.png",
  "./assets/pwa-icon.svg",
  "./assets/pwa-icon-maskable.svg"
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

  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

const CACHE_NAME = "ssp-pwa-v1";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/assets/ssp-logo.png",
  "/assets/ssp-app-icon-192.png",
  "/assets/ssp-app-icon-512.png",
  "/assets/hero_bg-mobile.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match("/"));
    })
  );
});

var cacheName = "afterschoolStore-v1";
var cacheFiles = [
  "index.html",
  //"products.js",
  "store-32.jpg",
  "store-512.jpg",
  //   "s/cat-litter.jpg",
  //   "images/icon-32.png",
  //   "images/icon-512.png",
  //   "images/laser-pointer.jpg",
  //   "images/yarn.jpg",
];
self.addEventListener("install", function (e) {
  console.log("[Service Worker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[Service Worker] Caching files");
      return cache.addAll(cacheFiles);
    })
  );
});

// Serve cached files
self.addEventListener("fetch", (event) => {
  // Skip caching if the request URL has the chrome-extension scheme
  if (e.request.url.startsWith("chrome-extension://")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedFile) => {
      // Return cached file if present
      if (cachedFile) {
        console.log(
          "[Service Worker] Resource fetched from the cache for: " +
            e.request.url
        );
        return cachedFile;
      }
      // Otherwise, fetch from network and cache dynamically
      return fetch(event.request).then((response) => {
        const clonedResponse = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      });
    })
  );
});

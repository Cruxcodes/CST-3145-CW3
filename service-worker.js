var cacheName = "afterschoolStore-v1";
var cacheFiles = [
  "./index.html",
  "assets/store-32.png",
  "assets/store-512.png",
];
// self.addEventListener("install", function (e) {
//   console.log("[Service Worker] Install");
//   e.waitUntil(
//     caches.open(cacheName).then(function (cache) {
//       console.log("[Service Worker] Caching files");
//       return cache.addAll(cacheFiles);
//     })
//   );
// });

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(cacheFiles).catch(function (error) {
        console.error("Cache.addAll error:", error);
      });
    })
  );
});

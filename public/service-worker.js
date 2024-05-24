const CACHE_NAME = 'public-dashboard-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/bundle.js',
  '/static/js/0.chunk.js',
  '/static/js/main.chunk.js',
  '/favicon.ico',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache during install:', error);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        // Clone the request to fetch it
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response to cache it
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(error => {
          console.error('Fetch failed:', error);
          throw error;
        });
      })
  );
});
// self.addEventListener('install', event => {
//   console.log('Service Worker: Installing...');
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => {
//         console.log('Service Worker: Caching Files');
//         return cache.addAll(urlsToCache);
//       })
//       .catch(error => {
//         console.error('Failed to cache during install:', error);
//       })
//   );
// });

// self.addEventListener('activate', event => {
//   console.log('Service Worker: Activating...');
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.map(cacheName => {
//           if (!cacheWhitelist.includes(cacheName)) {
//             console.log('Service Worker: Deleting old cache:', cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// self.addEventListener('fetch', event => {
//   if (event.request.mode === 'navigate') {
//     event.respondWith(
//       caches.match(event.request).then(response => {
//         return response || fetch(event.request).catch(() => {
//           return caches.match('/index.html');
//         });
//       })
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request).then(response => {
//         if (response) {
//           return response;
//         }

//         const fetchRequest = event.request.clone();
//         return fetch(fetchRequest).then(
//           response => {
//             if (!response || response.status !== 200 || response.type !== 'basic') {
//               return response;
//             }

//             const responseToCache = response.clone();
//             caches.open(CACHE_NAME)
//               .then(cache => {
//                 cache.put(event.request, responseToCache);
//               });

//             return response;
//           }
//         ).catch(error => {
//           console.error('Fetch failed:', error);
//           throw error;
//         });
//       })
//     );
//   }
// });

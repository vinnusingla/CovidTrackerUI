const cacheName = 'v1';

const cacheAssets = [
  'src/index.html',
  'bundle.js',
  '/',
  'sw_cached_pages.js'
];

const urlsToPrefetch = [
  'https://www.mohfw.gov.in/data/datanew.json'
]

// Call Install Event
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => {
        self.skipWaiting()
      })
  );
});

// Call Activate Event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});


// Call Fetch Event
self.addEventListener('fetch', e => {
  if (e.request.url.startsWith(self.location.origin)){
    console.log('Service Worker: Internal Fetching');
    // console.log(e.request);
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    console.log('Service Worker: External Fetching');
    e.respondWith(
      caches.match(e.request).then(cachedResponse => {
        // console.log(Number((new Map(cachedResponse.headers)).get('date')));
        // console.log(Date.now());
        // console.log(Number(Date.now()) - (Number((new Map(cachedResponse.headers)).get('date'))));
        if (cachedResponse && (Number((new Map(cachedResponse.headers)).get('date')) + 1000*60*2) > Date.now()) {
          // console.log('cached resp');
          return cachedResponse;
        }

        return caches.open(cacheName).then(cache => {
          return fetch(e.request).then(response => {
            // Put a copy of the response in the runtime cache.
            // console.log('un-cached resp');

            const newHeaders = new Headers(response.headers);
            newHeaders.append('date', Date.now());
            const anotherResponse = new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: newHeaders
            });
            return cache.put(e.request, anotherResponse.clone()).then(() => {
              return anotherResponse;
            });
          });
        });
      })
    );
  }
});

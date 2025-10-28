// Service Worker for Housekeeping Manager Notes App
const CACHE_NAME = 'housekeeping-notes-v1';
const urlsToCache = [
  '/meeting-notes/',
  '/meeting-notes/index.html',
  '/meeting-notes/styles.css',
  '/meeting-notes/app.js',
  '/meeting-notes/manifest.json'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((fetchResponse) => {
          // Don't cache non-GET requests or external resources
          if (event.request.method !== 'GET' ||
              !event.request.url.startsWith(self.location.origin)) {
            return fetchResponse;
          }

          // Clone the response before caching
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
      .catch(() => {
        // Return offline page if available
        return caches.match('/meeting-notes/index.html');
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event);
  if (event.tag === 'sync-meetings') {
    event.waitUntil(syncMeetings());
  }
});

async function syncMeetings() {
  console.log('Service Worker: Syncing meetings data');
  // This would sync any pending changes when connection is restored
  // Currently just logs, as data is stored in localStorage
}

// Push notifications support (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/meeting-notes/icon-192.png',
    badge: '/meeting-notes/icon-96.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Housekeeping Notes', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/meeting-notes/index.html')
  );
});

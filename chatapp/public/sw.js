// sw.js
const CACHE_NAME = 'chat-v1';
const urlsToCache = [
  '/', // Add static assets as needed
  '/notify.wav',
  '/badge.png',
];

// Install: Cache basics
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => name !== CACHE_NAME && caches.delete(name))
      )
    )
  );
});

// Fetch: Serve from cache (PWA offline support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Push: Show notification + Notify open clients (for unread update)
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    badge: '/badge.png',
    vibrate: [200, 100, 200],
    data: { senderId: data.senderId },
  };

  // Show native notification
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );

  // Post message to open clients (e.g., increment unread in store)
  if (event.waitUntil) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientsList) => {
          clientsList.forEach((client) => {
            client.postMessage({
              type: 'PUSH_RECEIVED',
              data: {
                senderId: data.senderId,
                title: data.title,
                body: data.body,
                unreadIncrement: 1, // Or parse from data if backend sends count
              },
            });
          });
        })
    );
  }
});

// Notification Click: Open/focus chat with flag
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const senderId = event.notification.data?.senderId || '';
  const urlToOpen = new URL(`/chat/${senderId}`, self.location.origin);
  urlToOpen.searchParams.set('fromPush', 'true'); // Flag for detection

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If chat with this sender is open, focus it
        const chatClient = clientList.find((client) =>
          client.url.includes(`/chat/${senderId}`)
        );
        if (chatClient) {
          return clientChat.focus();
        }
        // Else open new
        return clients.openWindow(urlToOpen.toString());
      })
  );
});
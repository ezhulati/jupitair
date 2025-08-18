/**
 * Enterprise Service Worker
 * Advanced caching strategies for optimal performance
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `jupitair-${CACHE_VERSION}`;
const RUNTIME_CACHE = `jupitair-runtime-${CACHE_VERSION}`;

// Assets to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/styles/design-system.css',
  '/scripts/main.js',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  cacheFirst: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    /\.(?:woff|woff2|ttf|otf)$/,
    /\.(?:css|js)$/,
  ],
  // Network first for API calls
  networkFirst: [
    /\/api\//,
    /\/analytics\//,
  ],
  // Stale while revalidate for HTML
  staleWhileRevalidate: [
    /\.html$/,
    /\/$/,
  ],
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE_URLS).catch((error) => {
        console.error('Failed to cache static assets:', error);
      });
    })
  );
  // Force immediate activation
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('jupitair-') && cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine cache strategy
  const strategy = getStrategy(request.url);

  if (strategy === 'cacheFirst') {
    event.respondWith(cacheFirst(request));
  } else if (strategy === 'networkFirst') {
    event.respondWith(networkFirst(request));
  } else if (strategy === 'staleWhileRevalidate') {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Default to network only
    event.respondWith(fetch(request));
  }
});

// Cache strategies implementation
async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await cache.match('/offline');
      if (offlinePage) {
        return offlinePage;
      }
    }
    throw error;
  }
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Silent fail for background revalidation
  });

  return cached || fetchPromise;
}

// Determine cache strategy based on URL
function getStrategy(url) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    for (const pattern of patterns) {
      if (pattern.test(url)) {
        return strategy;
      }
    }
  }
  return null;
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncOfflineForms());
  }
});

async function syncOfflineForms() {
  const cache = await caches.open('offline-forms');
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      const response = await fetch(request.clone());
      if (response.ok) {
        await cache.delete(request);
      }
    } catch (error) {
      console.error('Failed to sync form:', error);
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      },
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/services/emergency-hvac')
    );
  }
});

// Message handler for cache control
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});

// Performance monitoring
self.addEventListener('fetch', (event) => {
  const startTime = performance.now();
  
  event.waitUntil(
    event.respondWith(
      fetch(event.request).then((response) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log slow requests
        if (duration > 1000) {
          console.warn(`Slow request: ${event.request.url} took ${duration}ms`);
        }
        
        return response;
      })
    )
  );
});
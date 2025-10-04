/* ===============================================
   CHRONICLES OF THE SOLAR MONARCH - SERVICE WORKER
   Offline functionality and performance optimization
   =============================================== */

const CACHE_NAME = 'solar-monarch-v1.0.0';
const STATIC_CACHE = 'solar-monarch-static-v1';
const DYNAMIC_CACHE = 'solar-monarch-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/main.css',
    '/css/animations.css', 
    '/css/components.css',
    '/js/main.js',
    '/js/modules/galaxy-generator.js',
    '/js/modules/story-engine.js',
    '/data/nasa-data.js',
    // Core images (will be added when available)
    '/assets/images/icon-192x192.png',
    '/assets/images/icon-512x512.png'
];

// Network-first resources (always try to get fresh data)
const NETWORK_FIRST = [
    '/data/nasa-data.js',
    '/api/'
];

// Cache-first resources (use cached version if available)
const CACHE_FIRST = [
    '/assets/images/',
    '/assets/audio/',
    'https://fonts.googleapis.com/',
    'https://fonts.gstatic.com/'
];

// Install event - cache core assets
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const { url, method } = request;
    
    // Only handle GET requests
    if (method !== 'GET') return;
    
    // Determine caching strategy based on URL
    if (isNetworkFirst(url)) {
        event.respondWith(networkFirst(request));
    } else if (isCacheFirst(url)) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('🌐 Service Worker: Network failed, trying cache for', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline fallback for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/offline.html') || new Response(
                createOfflinePage(),
                { headers: { 'Content-Type': 'text/html' } }
            );
        }
        
        throw error;
    }
}

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('❌ Service Worker: Failed to fetch', request.url);
        
        // Return placeholder for images
        if (request.destination === 'image') {
            return new Response(
                createPlaceholderSVG(),
                { headers: { 'Content-Type': 'image/svg+xml' } }
            );
        }
        
        throw error;
    }
}

// Stale-while-revalidate strategy (for most content)
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(error => {
            console.log('🌐 Service Worker: Network error for', request.url);
            return cachedResponse;
        });
    
    return cachedResponse || fetchPromise;
}

// Helper functions
function isNetworkFirst(url) {
    return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

function isCacheFirst(url) {
    return CACHE_FIRST.some(pattern => url.includes(pattern));
}

function createOfflinePage() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - Solar Monarch</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #0f0f23, #16213e, #1a1a2e);
                    color: white;
                    margin: 0;
                    padding: 2rem;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .offline-content {
                    max-width: 500px;
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
                h1 {
                    color: #00f5ff;
                    margin-bottom: 1rem;
                }
                p {
                    line-height: 1.6;
                    margin-bottom: 1rem;
                }
                .retry-btn {
                    background: linear-gradient(45deg, #00f5ff, #06ffa5);
                    border: none;
                    color: #0a0a1f;
                    padding: 1rem 2rem;
                    border-radius: 50px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-top: 1rem;
                }
                .retry-btn:hover {
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="offline-content">
                <div class="offline-icon">🛸</div>
                <h1>Space Connection Lost!</h1>
                <p>It looks like you're offline or having connection issues. The Solar Monarch adventures need an internet connection to access real NASA space weather data.</p>
                <p>Don't worry - some cached content may still be available!</p>
                <button class="retry-btn" onclick="location.reload()">🔄 Retry Connection</button>
            </div>
        </body>
        </html>
    `;
}

function createPlaceholderSVG() {
    return `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#1a1a2e"/>
            <circle cx="200" cy="150" r="50" fill="#00f5ff" opacity="0.3"/>
            <text x="200" y="200" text-anchor="middle" fill="#00f5ff" font-family="Arial" font-size="16">
                Image Loading...
            </text>
        </svg>
    `;
}

// Background sync for offline data
self.addEventListener('sync', event => {
    if (event.tag === 'nasa-data-sync') {
        event.waitUntil(syncNASAData());
    }
});

async function syncNASAData() {
    try {
        console.log('🔄 Service Worker: Syncing NASA data...');
        
        // Attempt to fetch fresh NASA data
        const response = await fetch('/data/nasa-data.js');
        
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put('/data/nasa-data.js', response);
            console.log('✅ Service Worker: NASA data synced');
            
            // Notify all clients about the update
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'NASA_DATA_UPDATED',
                    timestamp: Date.now()
                });
            });
        }
    } catch (error) {
        console.log('❌ Service Worker: NASA data sync failed', error);
    }
}

// Push notifications for space weather alerts
self.addEventListener('push', event => {
    if (!event.data) return;
    
    try {
        const data = event.data.json();
        const options = {
            body: data.body || 'New space weather activity detected!',
            icon: '/assets/images/icon-192x192.png',
            badge: '/assets/images/badge-72x72.png',
            image: data.image,
            tag: 'space-weather-alert',
            renotify: true,
            requireInteraction: true,
            actions: [
                {
                    action: 'view',
                    title: 'View Details',
                    icon: '/assets/images/action-view.png'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss',
                    icon: '/assets/images/action-dismiss.png'
                }
            ],
            data: {
                url: data.url || '/#dashboard',
                timestamp: Date.now()
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(
                data.title || '🌟 Solar Monarch Alert',
                options
            )
        );
    } catch (error) {
        console.error('❌ Service Worker: Push notification error', error);
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    const action = event.action;
    const data = event.notification.data;
    
    if (action === 'dismiss') {
        return;
    }
    
    // Default action or 'view' action
    const urlToOpen = data?.url || '/#dashboard';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                // Focus existing window if available
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus().then(() => {
                            return client.navigate(urlToOpen);
                        });
                    }
                }
                
                // Open new window if no existing window found
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Handle messages from the main app
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CACHE_STORY_ASSETS':
            cacheStoryAssets(data.storyType);
            break;
            
        case 'CLEAR_CACHE':
            clearCaches();
            break;
            
        case 'GET_CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0].postMessage(status);
            });
            break;
    }
});

async function cacheStoryAssets(storyType) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const assetsToCache = [
            `/assets/images/stories/${storyType}/`,
            `/assets/audio/stories/${storyType}/`
        ];
        
        // This would need to be implemented based on actual story assets
        console.log(`📦 Service Worker: Caching assets for ${storyType}`);
    } catch (error) {
        console.error('❌ Service Worker: Failed to cache story assets', error);
    }
}

async function clearCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(name => caches.delete(name))
        );
        console.log('🗑️ Service Worker: All caches cleared');
    } catch (error) {
        console.error('❌ Service Worker: Failed to clear caches', error);
    }
}

async function getCacheStatus() {
    try {
        const cacheNames = await caches.keys();
        const status = {};
        
        for (const name of cacheNames) {
            const cache = await caches.open(name);
            const keys = await cache.keys();
            status[name] = keys.length;
        }
        
        return {
            caches: status,
            totalCaches: cacheNames.length,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('❌ Service Worker: Failed to get cache status', error);
        return { error: error.message };
    }
}

// Periodic background sync for space weather updates
self.addEventListener('periodicsync', event => {
    if (event.tag === 'space-weather-update') {
        event.waitUntil(updateSpaceWeatherData());
    }
});

async function updateSpaceWeatherData() {
    try {
        console.log('🌌 Service Worker: Periodic space weather update...');
        
        // This would connect to real NASA APIs in production
        const response = await fetch('/data/nasa-data.js');
        
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put('/data/nasa-data.js', response);
            
            // Check if there are significant space weather events
            // and send notifications if needed
            await checkForSpaceWeatherAlerts();
        }
    } catch (error) {
        console.log('❌ Service Worker: Periodic update failed', error);
    }
}

async function checkForSpaceWeatherAlerts() {
    // This would analyze the updated NASA data and send push notifications
    // for significant space weather events
    console.log('🔍 Service Worker: Checking for space weather alerts...');
}

console.log('🛡️ Service Worker: Script loaded and ready');
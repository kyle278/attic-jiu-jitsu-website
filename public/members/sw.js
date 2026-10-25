/* Offline support never caches member pages, API replies, login codes or bookings. */
const CACHE='attic-member-offline-v1';
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.add('/members/offline.html')).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('attic-member-offline-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.mode==='navigate'&&url.origin===self.location.origin&&url.pathname.startsWith('/members'))event.respondWith(fetch(event.request).catch(()=>caches.match('/members/offline.html')));});

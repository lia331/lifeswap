self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { clients.claim(); });
self.addEventListener('fetch', event => { /* Basic offline shell: customize caching strategies here */ });
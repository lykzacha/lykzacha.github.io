const CACHE='teachinghours-v1.7.4';
const CORE=['./','./index.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Μόνο η σελίδα της εφαρμογής περνά από εδώ (για λειτουργία χωρίς internet).
// Εικονίδια, manifest και όλα τα υπόλοιπα τα φορτώνει απευθείας ο browser.
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||req.mode!=='navigate')return;
 e.respondWith(fetch(req).then(res=>{const u=new URL(req.url);if(res.ok&&(u.pathname==='/'||u.pathname==='/index.html')){const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy))}return res}).catch(()=>caches.match('./index.html')))});

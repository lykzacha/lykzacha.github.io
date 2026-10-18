const CACHE='teachinghours-v1.7.7';
const CORE=['./','./index.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Μόνο η σελίδα της εφαρμογής και ο οδηγός περνούν από εδώ (για λειτουργία χωρίς internet): πρώτα από το δίκτυο,
// χωρίς σύνδεση το τελευταίο αντίγραφο της ίδιας σελίδας (ποτέ η εφαρμογή στη θέση του οδηγού).
// Εικονίδια, manifest, PDF και όλα τα υπόλοιπα τα φορτώνει απευθείας ο browser.
const PAGES=new Map([['','./index.html'],['index.html','./index.html'],['odigies.html','./odigies.html']]);
const NO_GUIDE='<!doctype html><html lang="el"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Οδηγός χρήσης</title><body style="margin:0;padding:24px 18px;font:16px/1.5 system-ui,-apple-system,sans-serif;color:#1f2d27;background:#fff"><p><strong>Ο οδηγός δεν είναι διαθέσιμος χωρίς internet.</strong></p><p>Ανοίξτε τον μία φορά με σύνδεση· μετά διαβάζεται και χωρίς internet.</p></body></html>';
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||req.mode!=='navigate')return;
 const scope=new URL(self.registration.scope).pathname,path=new URL(req.url).pathname,key=path.startsWith(scope)?PAGES.get(path.slice(scope.length)):undefined;
 if(!key)return;
 e.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(key,copy))}return res})
  .catch(()=>caches.match(key).then(r=>r||(key==='./odigies.html'?new Response(NO_GUIDE,{headers:{'Content-Type':'text/html; charset=utf-8'}}):Response.error()))))});

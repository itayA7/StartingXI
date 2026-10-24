/* =============================================================================
 * Starting XI — service worker (offline play)
 * - On install, caches index.html plus every file it references (so the exact
 *   ?v=… versions of game.js / data.js / style.css are always the ones cached).
 * - Page requests: network first, falling back to the cached page when offline.
 * - Other same-origin files: served from cache, refreshed in the background.
 * Bump CACHE when this file's logic changes; content updates need no bump.
 * ========================================================================== */
'use strict';

const CACHE = 'starting-xi-v2';
const SHELL = ['./', 'index.html', 'favicon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'manifest.webmanifest', '404.html'];

/** Files referenced by index.html (scripts, stylesheet, icons). */
async function referencedAssets() {
  const res = await fetch('index.html', { cache: 'no-cache' });
  const html = await res.text();
  return [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
    .map(m => m[1])
    .filter(u => !/^(?:[a-z]+:|\/\/)/i.test(u));   // same-origin, relative URLs only
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const assets = await referencedAssets().catch(() => []);
    await cache.addAll([...new Set([...SHELL, ...assets])]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    // Network first so players get updates; cached page when offline.
    event.respondWith((async () => {
      try {
        // Always revalidate the page with the server (never a stale HTTP-cache copy),
        // so a new release's ?v=… file versions are picked up on the next visit.
        const fresh = await fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' });
        const cache = await caches.open(CACHE);
        cache.put('index.html', fresh.clone());
        return fresh;
      } catch (e) {
        return (await caches.match('index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Stale-while-revalidate for everything else.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const network = fetch(req).then(res => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});

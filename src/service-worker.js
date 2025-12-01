/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, prerendered, version } from '$service-worker';

// Inspired by
// https://svelte.dev/docs/kit/service-workers
// https://dev.to/braide/building-progressive-web-applications-using-sveltekit-58gj

// Unique cache name for this service worker
const CACHE = `cache-${version}`;

const ASSETS = [...build, ...files, ...prerendered];

// Install event: cache all assets
self.addEventListener('install', (event) => {
  console.log('Installing service worker for version ', version);
  console.log('Assets to cache:', ASSETS);

  event.waitUntil(
    caches.open(CACHE)
    .then((cache) => cache.addAll(ASSETS))
    .catch((err) => console.error(err))
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  async function cleanupOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) {
        console.log('Deleting old cache:', key);
        await caches.delete(key);
      }
    }
  }

  console.log('Activating service worker for version ', version);

  event.waitUntil(cleanupOldCaches());
});

// Fetch event: serve cached assets or fetch from network
self.addEventListener('fetch', (fetchEvent) => {
  /**
   * @type {FetchEvent}
   */
  let event = fetchEvent;

  if (event.request.method !== 'GET') {
    return;
  }

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // Try getting the resource from the cache first
    if (ASSETS.includes(url.pathname)) {
      const response = await cache.match(url.pathname);
      if (response) {
        console.log('Serving from cache:', url.pathname);
        return response;
      }
    }

    // We couldn't find the resource in the cache, try fetching it from network
    try {
      const response = await fetch(event.request);

      // If we are offline, response can be a value that is not a Response
      if (!(response instanceof Response)) {
        throw new Error('Network request failed for ' + event.request.url);
      }

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (error) {
      // Couldn't get the resource from network, we try getting it from the cache
      // The resource may have been cached when online, see `cache.put` above
      const response = await cache.match(event.request);

      if (response) {
        console.log('Returning resource from cache:', event.request.url);
        return response;
      }

      // If it is not in the cache, throw an error as we can't do much more
      throw error;
    }
  }

  event.respondWith(respond());
});

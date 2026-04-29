// mydevtools service worker — minimal offline shell + runtime caching
const CACHE_VERSION = "v1";
const SHELL_CACHE = `mydevtools-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `mydevtools-runtime-${CACHE_VERSION}`;

const SHELL_URLS = [
    "/",
    "/manifest.webmanifest",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(SHELL_CACHE)
            .then((cache) => cache.addAll(SHELL_URLS).catch(() => undefined))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
                        .map((k) => caches.delete(k))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (req.method !== "GET") return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    // Network-first for HTML / navigation; falls back to cache when offline
    if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
                    return res;
                })
                .catch(() => caches.match(req).then((m) => m || caches.match("/")))
        );
        return;
    }

    // Cache-first for hashed static assets
    if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
        event.respondWith(
            caches.match(req).then(
                (cached) =>
                    cached ||
                    fetch(req).then((res) => {
                        const copy = res.clone();
                        caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
                        return res;
                    })
            )
        );
        return;
    }

    // Stale-while-revalidate for everything else
    event.respondWith(
        caches.match(req).then((cached) => {
            const network = fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
                    return res;
                })
                .catch(() => cached);
            return cached || network;
        })
    );
});

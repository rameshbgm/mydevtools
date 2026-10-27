// Only public app documents and hashed assets are persisted. User/API data is excluded.
const VERSION = "2.1.0";
const SHELL = `mydevtools-shell-${VERSION}`;
const ASSETS = `mydevtools-assets-${VERSION}`;
const categories = "artificial-intelligence|diff-and-compare|api-and-web-services|encoding-and-decoding|certificates-and-keys|cryptography|data-converters|formatters|fun-and-games|generators|image-and-media|network|text-and-utilities|validators|reference";
const publicPage = (path) => ["/", "/release-notes"].includes(path) || new RegExp(`^/(?:${categories})/[a-z0-9-]+$`).test(path);
const safeAsset = (url) => url.origin === self.location.origin && (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/monaco/vs/") || /^\/sqlite\/sql-wasm\.(?:js|wasm)$/.test(url.pathname));
async function storeAsset(url) {
    const cache = await caches.open(ASSETS);
    if (await cache.match(url)) return;
    const res = await fetch(url, { credentials: "omit", signal: AbortSignal.timeout(15000) });
    if (res.ok && !res.headers.get("cache-control")?.includes("no-store")) await cache.put(url, res);
}
async function warmPage(path) {
    if (!publicPage(path)) return;
    const url = new URL(path, self.location.origin);
    const res = await fetch(url, { credentials: "omit", signal: AbortSignal.timeout(15000) });
    if (!res.ok || !res.headers.get("content-type")?.includes("text/html") || res.headers.get("cache-control")?.includes("no-store")) return;
    const html = await res.clone().text();
    await (await caches.open(SHELL)).put(url, res);
    const assets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map((match) => new URL(match[1], url)).filter(safeAsset);
    await Promise.allSettled([...new Set(assets.map(String))].slice(0, 80).map(storeAsset));
}
self.addEventListener("install", (event) => {
    event.waitUntil(Promise.allSettled([warmPage("/"), ...["/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"].map(storeAsset)]));
});
self.addEventListener("message", (event) => {
    if (event.data?.type === "ACTIVATE_UPDATE") { self.skipWaiting(); return; }
    if (event.data?.type === "CACHE_PUBLIC_PAGE" && typeof event.data.path === "string") event.waitUntil(Promise.allSettled([warmPage(event.data.path), ...(Array.isArray(event.data.assets) ? event.data.assets : []).filter((value) => typeof value === "string").slice(0, 80).map((value) => { try { const url = new URL(value, self.location.origin); return safeAsset(url) ? storeAsset(url.href) : Promise.resolve(); } catch { return Promise.resolve(); } })]));
});
self.addEventListener("activate", (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("mydevtools-") && key !== SHELL && key !== ASSETS).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
    const req = event.request, url = new URL(req.url);
    if (req.method !== "GET" || url.origin !== self.location.origin || req.headers.has("authorization") || url.pathname.startsWith("/api/") || req.headers.has("rsc") || url.searchParams.has("_rsc")) return;
    if (req.mode === "navigate" && publicPage(url.pathname) && !url.search) {
        event.respondWith(fetch(req).then((res) => {
            if (res.ok && !res.headers.get("cache-control")?.includes("no-store")) { const copy = res.clone(); event.waitUntil(caches.open(SHELL).then((cache) => cache.put(url, copy))); }
            return res;
        }).catch(async () => (await caches.match(url)) || new Response("This page is not available offline yet. Reconnect and open it once to save it on this device.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } })));
    } else if (safeAsset(url)) {
        event.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => {
            if (res.ok && !res.headers.get("cache-control")?.includes("no-store")) { const copy = res.clone(); event.waitUntil(caches.open(ASSETS).then((cache) => cache.put(req, copy))); }
            return res;
        })));
    }
});

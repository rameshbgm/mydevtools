const APP_ORIGIN = "mydevtools://app";
const FRAME_PROOF_HEADER = "x-mydevtools-desktop-frame";
const MAX_BODY = 14 * 1024 * 1024;
/** @param {string} value */
function isAppUrl(value) {
    try { const url = new URL(value); return url.protocol === "mydevtools:" && url.hostname === "app" && !url.port && !url.username && !url.password; } catch { return false; }
}
/** @param {string} value */
function safeExternalUrl(value) {
    try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password && url.href.length <= 8192 ? url.href : null; } catch { return null; }
}
/** @param {string} value @param {string} backendOrigin */
function requestTarget(value, backendOrigin) {
    if (!isAppUrl(value)) throw new Error("Unknown app origin.");
    const source = new URL(value), target = new URL(backendOrigin);
    if (target.protocol !== "http:" || target.hostname !== "127.0.0.1" || !target.port || target.username || target.password) throw new Error("Invalid local runtime.");
    // Assign components rather than resolving a path: //host must remain a
    // local path and must never change the trusted loopback destination.
    target.pathname = source.pathname; target.search = source.search; target.hash = "";
    return target;
}
/** @param {{url: string, webContentsId?: number, initiatorOrigin?: string, frame?: {url: string} | null}} details @param {number | undefined} contentsId */
function trustedDesktopInitiator(details, contentsId) {
    return typeof contentsId === "number" && details.webContentsId === contentsId && details.initiatorOrigin === APP_ORIGIN && isAppUrl(details.url) && !!details.frame && isAppUrl(details.frame.url);
}
/** @param {Request} request @param {string} backendOrigin @param {string} token @param {boolean} [trustedInitiator] */
function relayHeaders(request, backendOrigin, token, trustedInitiator = false) {
    const headers = new Headers(request.headers), origin = headers.get("origin"), target = requestTarget(request.url, backendOrigin);
    if (origin && origin !== APP_ORIGIN) throw new Error("Foreign or opaque app origin.");
    if (headers.get("sec-fetch-site") === "cross-site") throw new Error("Cross-site app request.");
    if (!["GET", "HEAD"].includes(request.method) && origin !== APP_ORIGIN && !trustedInitiator) throw new Error("App write request is missing its origin.");
    for (const name of ["host", "connection", "content-length", "transfer-encoding", "x-mydevtools-local-token", FRAME_PROOF_HEADER]) headers.delete(name);
    if (origin || trustedInitiator) headers.set("origin", backendOrigin);
    if (target.pathname === "/api/local-connectors") headers.set("x-mydevtools-local-token", token);
    return headers;
}
/** @param {Request} request */
async function boundedBody(request) {
    if (["GET", "HEAD"].includes(request.method) || !request.body) return undefined;
    const length = request.headers.get("content-length");
    if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BODY)) throw new Error("App request exceeds 14 MiB.");
    const reader = request.body.getReader(), chunks = []; let bytes = 0;
    try {
        while (true) { const { done, value } = await reader.read(); if (done) break; bytes += value.length; if (bytes > MAX_BODY) { await reader.cancel(); throw new Error("App request exceeds 14 MiB."); } chunks.push(value); }
    } finally { reader.releaseLock(); }
    const result = new Uint8Array(bytes); let offset = 0; for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; } return result;
}
/** @param {string} value @param {string} backendOrigin */
function appLocation(value, backendOrigin) {
    const url = new URL(value, backendOrigin);
    if (url.origin !== backendOrigin) throw new Error("Unexpected external redirect.");
    const result = new URL(APP_ORIGIN); result.pathname = url.pathname; result.search = url.search; result.hash = url.hash; return result.href;
}
// Dynamic evaluation is needed by bundled schema validators and user-entered
// HTTP test scripts. No remote scripts or Node bridge are allowed. Renderer
// sandbox/context isolation remain enabled; this policy is not a JS sandbox.
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: wss: ws://127.0.0.1:* ws://localhost:* ws://[::1]:*; worker-src 'self' blob:; frame-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'";
module.exports = { APP_ORIGIN, FRAME_PROOF_HEADER, CSP, isAppUrl, safeExternalUrl, requestTarget, trustedDesktopInitiator, relayHeaders, boundedBody, appLocation };

// mydevtools — context-menu launcher.
//
// On install, register one parent menu with a child per "send to" target.
// On click, encode the selected text into the mydevtools share-URL format
// and open the target tool with the selection pre-loaded.
//
// The share-URL format mirrors src/lib/shareable-state.ts in the main app:
//   <site>/<category>/<toolId>#s=<base64url(deflate-raw(JSON.stringify({t,v,s})))>
//
// This file has NO bundler — it ships as plain JS so users can review it
// before installing.

const DEFAULT_SITE = "https://mydevtools.com";

const TARGETS = [
    // `state(text)` must match the target's share schema exactly.
    { id: "json-formatter",   title: "Format JSON",                path: "/formatters/json-formatter",            state: (text) => ({ input: text, mode: "Prettify" }) },
    { id: "jwt-decoder",      title: "Decode JWT",                 path: "/cryptography/jwt-decoder",             state: (text) => ({ token: text }) },
    { id: "base64",           title: "Base64 encode",              path: "/encoding-and-decoding/base64",         state: (text) => ({ input: text, mode: "Encode" }) },
    { id: "base64-decode",    title: "Base64 decode",              path: "/encoding-and-decoding/base64",         toolId: "base64", state: (text) => ({ input: text, mode: "Decode" }) },
    { id: "url-encoder",      title: "URL encode",                 path: "/encoding-and-decoding/url-encoder",    state: (text) => ({ input: text, mode: "Encode" }) },
    { id: "url-decoder",      title: "URL decode",                 path: "/encoding-and-decoding/url-encoder",    toolId: "url-encoder", state: (text) => ({ input: text, mode: "Decode" }) },
    { id: "hash-generator",   title: "Generate hashes",            path: "/cryptography/hash-generator",          state: (text) => ({ input: text }) },
    { id: "regex-tester",     title: "Test with regex",            path: "/validators/regex-tester",              state: (text) => ({ pattern: "", flags: "g", testStr: text }) },
];

// ── share-URL builder (matches src/lib/shareable-state.ts) ────────────

async function deflate(text) {
    if (typeof CompressionStream === "undefined") {
        return new TextEncoder().encode(text);
    }
    const stream = new Response(
        new Blob([text]).stream().pipeThrough(new CompressionStream("deflate-raw"))
    );
    return new Uint8Array(await stream.arrayBuffer());
}

function bytesToBase64Url(b) {
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < b.length; i += chunk) {
        bin += String.fromCharCode.apply(null, b.subarray(i, i + chunk));
    }
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function buildShareUrl(siteOrigin, target, text) {
    const toolId = target.toolId || target.id;
    const state = target.state(text);
    const payload = JSON.stringify({ t: toolId, v: 1, s: state });
    const bytes = await deflate(payload);
    const b64 = bytesToBase64Url(bytes);
    return `${siteOrigin}${target.path}#s=${b64}`;
}

// ── settings ──────────────────────────────────────────────────────────

async function getSiteOrigin() {
    const stored = await chrome.storage.sync.get("siteOrigin");
    const raw = stored.siteOrigin || DEFAULT_SITE;
    const parsed = new URL(raw);
    const isLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "[::1]";
    if (!["https:", "http:"].includes(parsed.protocol) || (parsed.protocol !== "https:" && !isLocal)) {
        throw new Error("Use an HTTPS origin (HTTP is allowed only for localhost)");
    }
    return parsed.origin;
}

// ── menus ─────────────────────────────────────────────────────────────

function installMenus() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "mydevtools-parent",
            title: "Open in mydevtools",
            contexts: ["selection"],
        });
        for (const t of TARGETS) {
            chrome.contextMenus.create({
                id: t.id,
                parentId: "mydevtools-parent",
                title: t.title,
                contexts: ["selection"],
            });
        }
    });
}

chrome.runtime.onInstalled.addListener(installMenus);
chrome.runtime.onStartup?.addListener?.(installMenus);

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    const target = TARGETS.find((t) => t.id === info.menuItemId);
    if (!target) return;
    const text = info.selectionText || "";
    if (!text) return;
    try {
        const origin = await getSiteOrigin();
        const url = await buildShareUrl(origin, target, text);
        await chrome.tabs.create({ url, index: tab ? tab.index + 1 : undefined });
    } catch (e) {
        // Fallback: open the bare tool URL
        const origin = await getSiteOrigin();
        await chrome.tabs.create({ url: `${origin}${target.path}` });
    }
});

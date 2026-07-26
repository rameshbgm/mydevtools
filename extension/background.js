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
    // { id: "<tool-id>", title: "<menu label>", path: "<canonical path>", kind: "<input field key>" }
    { id: "json-formatter",   title: "Format JSON",                path: "/formatters/json-formatter",            field: "input", extra: { mode: "Prettify" } },
    { id: "jwt-decoder",      title: "Decode JWT",                 path: "/cryptography/jwt-decoder",             field: "token" },
    { id: "base64",           title: "Base64 encode",              path: "/encoding-and-decoding/base64",         field: "input", extra: { mode: "Encode" } },
    { id: "base64-decode",    title: "Base64 decode",              path: "/encoding-and-decoding/base64",         field: "input", extra: { mode: "Decode" }, toolId: "base64" },
    { id: "url-encoder",      title: "URL encode",                 path: "/encoding-and-decoding/url-encoder",    field: "input", extra: { mode: "Encode" } },
    { id: "url-decoder",      title: "URL decode",                 path: "/encoding-and-decoding/url-encoder",    field: "input", extra: { mode: "Decode" }, toolId: "url-encoder" },
    { id: "hash-generator",   title: "Generate hashes",            path: "/cryptography/hash-generator",          field: "input" },
    { id: "regex-tester",     title: "Test with regex",            path: "/validators/regex-tester",              field: "input" },
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
    const state = { [target.field]: text, ...(target.extra || {}) };
    const payload = JSON.stringify({ t: toolId, v: 1, s: state });
    const bytes = await deflate(payload);
    const b64 = bytesToBase64Url(bytes);
    return `${siteOrigin}${target.path}#s=${b64}`;
}

// ── settings ──────────────────────────────────────────────────────────

async function getSiteOrigin() {
    const stored = await chrome.storage.sync.get("siteOrigin");
    return stored.siteOrigin || DEFAULT_SITE;
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

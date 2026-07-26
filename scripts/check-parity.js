// Guards against the registry/url-table/seo/orphan-tool drift class of bug —
// e.g. a tool page shipped with a layout.tsx and SEO copy but never added to
// tools-registry.ts, so it's unreachable from navigation and search.
//
// Plain node, no deps, run in `prebuild`. Parses tools-registry.ts by regex
// (it's a static literal — importing the TS file from node needs a loader,
// which is not worth it for a build-time check).

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TOOLS_DIR = path.join(ROOT, "src/app/tools");

// Redirect stubs intentionally outside the registry — 13-line pages that
// 308-redirect to a canonical tool id. Add here only for the same reason.
const KNOWN_STUBS = new Set([
    "ssl-checker",
    "csr-generator",
    "pem-parser",
    "certificate-converter",
    "certificate-decoder",
    "certificate-fingerprint",
]);

const errors = [];

function read(file) {
    return fs.readFileSync(path.join(ROOT, file), "utf8");
}

// ── 1/2. Parse the registry: id + category pairs, and confirm page/layout exist ──
const registrySrc = read("src/lib/tools-registry.ts");
const registryEntries = new Map(); // id -> category
{
    const re = /id:\s*"([a-z0-9-]+)"[\s\S]{0,300}?category:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(registrySrc))) registryEntries.set(m[1], m[2]);
}
if (registryEntries.size === 0) {
    errors.push("Parsed zero entries from tools-registry.ts — regex is out of sync with the file's shape.");
}

for (const [id, category] of registryEntries) {
    if (!fs.existsSync(path.join(TOOLS_DIR, id, "page.tsx"))) {
        errors.push(`Registry tool "${id}" has no src/app/tools/${id}/page.tsx`);
    }
    if (!fs.existsSync(path.join(TOOLS_DIR, id, "layout.tsx"))) {
        errors.push(`Registry tool "${id}" has no src/app/tools/${id}/layout.tsx`);
    }

    const urlTableSrc = read("src/lib/tool-url-table.ts");
    const rowRe = new RegExp(`"${id}":\\s*"([^"]+)"`);
    const rowMatch = urlTableSrc.match(rowRe);
    if (!rowMatch) {
        errors.push(`Registry tool "${id}" is missing from tool-url-table.ts`);
    } else if (rowMatch[1] !== category) {
        errors.push(`Category mismatch for "${id}": registry says "${category}", tool-url-table.ts says "${rowMatch[1]}"`);
    }
}

// ── 3. SEO coverage ──
const seoSrc = read("src/lib/seo-content.ts");
const seoKeys = new Set();
{
    const seoBlockMatch = seoSrc.match(/export const SEO_CONTENT[\s\S]*/);
    const body = seoBlockMatch ? seoBlockMatch[0] : "";
    const keyRe = /^\s+"?([a-zA-Z0-9-]+)"?:\s*\{/gm;
    let k;
    while ((k = keyRe.exec(body))) seoKeys.add(k[1]);
}
for (const id of registryEntries.keys()) {
    if (!seoKeys.has(id)) {
        errors.push(`Registry tool "${id}" has no entry in seo-content.ts`);
    }
}

// ── 4. Orphan dirs: every tools/* dir is registered or an allowlisted stub ──
const toolDirs = fs.readdirSync(TOOLS_DIR).filter((entry) =>
    fs.statSync(path.join(TOOLS_DIR, entry)).isDirectory()
);
for (const dir of toolDirs) {
    if (!registryEntries.has(dir) && !KNOWN_STUBS.has(dir)) {
        errors.push(`Orphan tool dir "${dir}" — not in tools-registry.ts and not in KNOWN_STUBS. Register it or add it to KNOWN_STUBS with a reason.`);
    }
}
for (const stub of KNOWN_STUBS) {
    if (!toolDirs.includes(stub)) {
        errors.push(`KNOWN_STUBS lists "${stub}" but src/app/tools/${stub} no longer exists — remove it from the allowlist.`);
    }
}

// ── 5. No dead generateMetadata in client-component pages ──
for (const dir of toolDirs) {
    const pagePath = path.join(TOOLS_DIR, dir, "page.tsx");
    if (!fs.existsSync(pagePath)) continue;
    const src = fs.readFileSync(pagePath, "utf8");
    if (/^"use client";/.test(src) && /generateMetadata/.test(src)) {
        errors.push(`${dir}/page.tsx is a client component but exports generateMetadata — it's never called by Next.js. Remove it (layout.tsx already handles metadata).`);
    }
}

// ── 6. No stale domain references ──
{
    const staleRefs = [];
    function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (/\.(ts|tsx)$/.test(entry.name)) {
                const src = fs.readFileSync(full, "utf8");
                if (src.includes("devtools-hub.com")) staleRefs.push(path.relative(ROOT, full));
            }
        }
    }
    walk(path.join(ROOT, "src"));
    for (const f of staleRefs) errors.push(`${f} references the stale "devtools-hub.com" domain.`);
}

// ── 7. Every BRIDGE_TARGETS row points at a registered, actually-wired tool ──
{
    const bridgeSrc = read("src/lib/tool-bridge.ts");
    const targetRe = /toolId:\s*"([a-z0-9-]+)"/g;
    let t;
    while ((t = targetRe.exec(bridgeSrc))) {
        const id = t[1];
        if (!registryEntries.has(id)) {
            errors.push(`BRIDGE_TARGETS references "${id}", which is not in tools-registry.ts`);
            continue;
        }
        const pagePath = path.join(TOOLS_DIR, id, "page.tsx");
        if (fs.existsSync(pagePath)) {
            const pageSrc = fs.readFileSync(pagePath, "utf8");
            if (!/ToolBridgeBanner|consumeFromBridge/.test(pageSrc)) {
                errors.push(`BRIDGE_TARGETS advertises "${id}" as a pipeline destination, but its page never reads the bridge (no ToolBridgeBanner/consumeFromBridge) — payloads sent to it are silently dropped.`);
            }
        }
    }
}

if (errors.length > 0) {
    console.error(`✗ check-parity found ${errors.length} issue(s):\n`);
    for (const e of errors) console.error(`  - ${e}`);
    console.error("");
    process.exit(1);
}

console.log(`✓ check-parity passed — ${registryEntries.size} registered tools, ${toolDirs.length} tool dirs, ${KNOWN_STUBS.size} allowlisted stubs.`);

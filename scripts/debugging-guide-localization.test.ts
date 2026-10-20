import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { DEBUGGING_GUIDES } from "../src/lib/debugging-guides";
import { guideExampleHref, guideExamplePayload } from "../src/lib/guide-examples";
import { DEBUGGING_GUIDE_TRANSLATIONS } from "../src/lib/i18n/debugging-guides";

const required = new Set<string>();
for (const guide of DEBUGGING_GUIDES) {
    for (const copy of [guide.title, guide.explanation, ...guide.steps, guide.expected]) required.add(copy);
}
const component = readFileSync("src/components/DebuggingGuides.tsx", "utf8");
const source = ts.createSourceFile("DebuggingGuides.tsx", component, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function inspectCopy(node: ts.Node): void {
    if (ts.isStringLiteralLike(node)) required.add(node.text);
    else if (ts.isConditionalExpression(node)) {
        inspectCopy(node.whenTrue);
        inspectCopy(node.whenFalse);
    }
}
function visit(node: ts.Node): void {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "t" && node.arguments[0]) inspectCopy(node.arguments[0]);
    if (ts.isJsxText(node)) assert.equal(node.text.trim(), "", "Visible guide copy must be translated");
    ts.forEachChild(node, visit);
}
visit(source);
assert.equal(required.size, 38);
assert.deepEqual(Object.keys(DEBUGGING_GUIDE_TRANSLATIONS).sort(), [...required].sort(), "Every guide and page string has a translation entry");
for (const key of required) {
    const columns = DEBUGGING_GUIDE_TRANSLATIONS[key];
    assert.equal(columns.length, 7, key);
    for (const [index, value] of columns.entries()) {
        assert.ok(value.trim().length > 0, `${key}: column ${index} is empty`);
        assert.notEqual(value, key, `${key}: column ${index} fell back to English`);
        // Wire identifiers and RFC/version references are meaningful, not translatable prose.
        for (const identifier of ["sub=demo", "RFC 8725", "OPTIONS", "A2A 1.0", "JSONRPC", "supportedInterfaces", "SendMessage", "0.3", "legacy", "server/discover", "2026-07-28", "notifications/initialized", "example.com", "oneOf"]) {
            if (key.includes(identifier)) assert.ok(value.includes(identifier), `${key}: column ${index} changed ${identifier}`);
        }
    }
}
assert.match(component, /<pre dir="ltr" tabIndex=\{0\}>\{guide\.example\}<\/pre>/, "Fixtures stay literal, LTR and keyboard-scrollable");
assert.match(component, /href=\{guideExampleHref\(guide\)\}/, "Example buttons retain the canonical loader");
assert.match(component, /href=\{guide\.source\}/, "Primary references are not localized");
const fixtureHashes: Record<string, string> = {
    jwt: "3164e77b5094c0ad9f21925c596f458eb2cb8d11f1ec7b1829e65aa3dff85c03",
    cors: "aa71d04a6f3759c143aedf59f0d47adb3e6f2a34f0cd8635504c230380372f00",
    webhook: "1fbbcbc3d140371a917ec636ec3d843aff8d93118bb2296413a82e29e2b7be4e",
    protocol: "e0e0018abc9ff1ee71edf4ba4d25dfbc76d69a69bf6013362ddcd0be8e021466",
    schema: "0465d32b2eb6174592c9a33dfa8049d499966653bd76b711c0e39f4bd57475cb",
};
for (const guide of DEBUGGING_GUIDES) {
    assert.equal(createHash("sha256").update(guide.example).digest("hex"), fixtureHashes[guide.id], `${guide.id}: localization must not modify public fixture bytes`);
    const url = new URL(guideExampleHref(guide), "https://example.invalid");
    assert.ok(!url.pathname.startsWith("/tools/"), "Guide links use public category routes");
    if (guide.id === "cors") {
        assert.equal(url.search, "", "CORS opens its form without an automatic network request");
        assert.equal(guideExamplePayload(url.pathname, url.search), null);
    } else {
        const payload = guideExamplePayload(url.pathname, url.search);
        assert.equal(payload?.data, guide.example);
        assert.equal(payload?.kind, guide.kind);
        assert.equal(payload?.sourceToolId, "guides");
        assert.throws(() => guideExamplePayload("/wrong/tool", url.search), /does not match/);
    }
    assert.equal(new URL(guide.source).protocol, "https:");
}
console.log("Debugging guides: all 38 text keys translated in seven languages; public fixtures and canonical loaders unchanged.");

import ts from "typescript";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { LANGUAGE_KEY, LANGUAGES, SHARED_TRANSLATIONS, translate, validLanguage } from "../src/lib/i18n/catalog";
import { readLanguage, subscribeLanguage, writeLanguage } from "../src/lib/i18n/preference";
import { TOOL_NAME_TRANSLATIONS } from "../src/lib/i18n/tool-names";
import { matchesToolQuery } from "../src/lib/tool-search";
import { BRIDGE_TARGETS } from "../src/lib/tool-bridge";
import { toolsRegistry } from "../src/lib/tools-registry";

assert.deepEqual(LANGUAGES.map((entry) => entry.id), ["en", "hi", "es", "fr", "de", "ja", "zh", "ar"]);
for (const tool of toolsRegistry) {
    assert.ok(Object.hasOwn(TOOL_NAME_TRANSLATIONS, tool.name), `Missing translated tool name: ${tool.id}`);
    for (const language of LANGUAGES.slice(1)) assert.ok(translate(language.id, tool.name).trim(), `${tool.id}/${language.id}`);
}
for (const language of LANGUAGES) {
    const formatter = toolsRegistry.find((tool) => tool.id === "json-formatter")!;
    assert.ok(matchesToolQuery(formatter, translate(language.id, formatter.name), language.id));
    assert.ok(matchesToolQuery(formatter, "JSON Formatter", language.id), "English names stay searchable");
    assert.ok(matchesToolQuery(formatter, translate(language.id, formatter.category), language.id));
    assert.ok(matchesToolQuery(formatter, "ＪＳＯＮ", language.id), "Compatibility-width query normalizes");
    assert.equal(matchesToolQuery(formatter, "nonexistentfixturexyz", language.id), false);
    const workflow = toolsRegistry.find((tool) => tool.id === "saved-workflows")!;
    assert.ok(matchesToolQuery(workflow, translate(language.id, "repeat task"), language.id), "Translated task aliases work");
}
assert.equal(translate("ar", "Saved Workflows"), "سير العمل المحفوظ");
assert.equal(translate("ja", "JSON Formatter"), "JSONフォーマッター");
assert.equal(translate("de", "__proto__"), "__proto__");
for (const [source, columns] of Object.entries(SHARED_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
    for (const column of columns) {
        assert.ok(column.trim(), source);
        assert.deepEqual(placeholders(column), placeholders(source), source);
    }
}
for (const language of LANGUAGES) {
    assert.equal(validLanguage(language.id), language.id);
    assert.ok(translate(language.id, "What's new in version {version} — release notes", { version: "2.0.0" }).includes("2.0.0"));
    assert.equal(translate(language.id, "Unknown parser details: {value}", { value: "日本語 العربية" }), "Unknown parser details: 日本語 العربية");
}
for (const invalid of [null, undefined, "AR", "xx", "<script>", "__proto__", 1]) assert.equal(validLanguage(invalid), "en");

// The introduction must not silently fall back for authored interface text.
const protocolText = new Set(["checkout-api", "release-checklist.md", "id", "status", "ready", "1041", "1042", "1043", "JSON", "SHA-256", "·"]);
for (const path of ["src/components/LandingMarketing.tsx", "src/components/ProjectSwitcher.tsx", "src/components/CodeEditor.tsx", "src/app/tools/code-snippets/page.tsx"]) {
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, path.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const requireTranslation = (value: string) => assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, value), `Missing introduction translation: ${value}`);
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim() && node.text.trim() !== "/" && !protocolText.has(node.text.trim())) requireTranslation(node.text.trim());
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) requireTranslation(node.arguments[0].text);
        if (path === "src/components/LandingMarketing.tsx" && ts.isPropertyAssignment(node) && ["name", "title", "description", "action", "task", "result", "hint"].includes(node.name.getText(file)) && ts.isStringLiteral(node.initializer)) requireTranslation(node.initializer.text);
        if (path.endsWith("code-snippets/page.tsx") && ts.isCallExpression(node) && ["setNotice", "setError"].includes(node.expression.getText(file)) && node.arguments[0] && ts.isStringLiteral(node.arguments[0]) && node.arguments[0].text) requireTranslation(node.arguments[0].text);
        if (path.endsWith("code-snippets/page.tsx") && ts.isNewExpression(node) && node.expression.getText(file) === "Error" && node.arguments?.[0] && ts.isStringLiteral(node.arguments[0])) requireTranslation(node.arguments[0].text);
        ts.forEachChild(node, visit);
    };
    visit(file);
}

// Precision controls have localized conditional guidance even while the wider
// legacy tool-copy translation pass remains in progress.
for (const path of ["src/app/tools/json-path-tester/page.tsx", "src/app/tools/json-schema-generator/page.tsx"]) {
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const inspect = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, node.text), `Missing numeric control translation: ${node.text}`);
        else if (ts.isConditionalExpression(node)) { inspect(node.whenTrue); inspect(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0]) inspect(node.arguments[0]);
        ts.forEachChild(node, visit);
    };
    visit(file);
}

// Detailed JSON controls, examples and authored help must remain translated.
// Parser diagnostics and machine syntax are preserved below localized recovery.
for (const path of ["src/app/tools/json-path-tester/page.tsx", "src/app/tools/json-schema-generator/page.tsx", "src/app/tools/toml-converter/page.tsx", "src/components/SendToButton.tsx", "src/components/ToolBridgeBanner.tsx"]) {
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const requireTranslation = (value: string) => assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, value), `Missing JSON tool translation in ${path}: ${value}`);
    const inspectCopy = (node: ts.Node) => {
        if (ts.isStringLiteral(node) && node.text) requireTranslation(node.text);
        else if (ts.isConditionalExpression(node)) { inspectCopy(node.whenTrue); inspectCopy(node.whenFalse); }
        else if (ts.isArrayLiteralExpression(node)) node.elements.forEach(inspectCopy);
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) requireTranslation(node.text.trim());
        if (ts.isCallExpression(node) && ["t", "setError"].includes(node.expression.getText(file)) && node.arguments[0]) inspectCopy(node.arguments[0]);
        if (ts.isNewExpression(node) && node.expression.getText(file) === "Error" && node.arguments?.[0]) inspectCopy(node.arguments[0]);
        if (ts.isJsxAttribute(node) && ["title", "description", "aria-label"].includes(node.name.getText(file)) && node.initializer) inspectCopy(node.initializer);
        if (ts.isPropertyAssignment(node) && ["desc", "whatIs", "whyUse", "howToUse", "tips", "useCases"].includes(node.name.getText(file))) inspectCopy(node.initializer);
        ts.forEachChild(node, visit);
    };
    visit(file);
}
for (const target of BRIDGE_TARGETS) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, target.label), `Missing bridge target translation: ${target.label}`);
for (const language of LANGUAGES) {
    const rawName = "日本語 العربية <item>";
    assert.ok(translate(language.id, "Invalid XML element or attribute name: {name}", { name: rawName }).includes(rawName));
    assert.ok(translate(language.id, "Items: {count}", { count: 11 }).includes("11"));
    assert.ok(translate(language.id, "Download {format}", { format: "TOML" }).includes("TOML"));
}

// SQL and the shared native-client controls must not silently regain English
// labels or lose authored recoveries when their source copy changes.
const sqlDataText = new Set(["PostgreSQL", "MySQL", "MariaDB", "NULL", ".", "·", ":"]);
for (const path of ["src/app/tools/sql-client/page.tsx", "src/components/ConnectionVault.tsx", "src/components/LocalConnectorAccess.tsx", "src/components/QueryResultTable.tsx", "src/lib/sqlite-workspace.ts", "src/lib/sql-connector.ts"]) {
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, path.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const requireTranslation = (value: string) => assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, value), `Missing SQL/connector translation in ${path}: ${value}`);
    const inspectCopy = (node: ts.Node) => {
        if (ts.isStringLiteral(node) && node.text) requireTranslation(node.text);
        else if (ts.isConditionalExpression(node)) { inspectCopy(node.whenTrue); inspectCopy(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim() && !sqlDataText.has(node.text.trim())) requireTranslation(node.text.trim());
        if (ts.isCallExpression(node) && ["t", "setMessage", "setStatus", "setError"].includes(node.expression.getText(file)) && node.arguments[0]) inspectCopy(node.arguments[0]);
        if (ts.isNewExpression(node) && node.expression.getText(file) === "Error" && node.arguments?.[0]) inspectCopy(node.arguments[0]);
        if (ts.isJsxAttribute(node) && ["title", "description"].includes(node.name.getText(file)) && node.initializer && ts.isStringLiteral(node.initializer)) inspectCopy(node.initializer);
        ts.forEachChild(node, visit);
    };
    visit(file);
}
for (const language of LANGUAGES) {
    const name = "日本語 العربية <script> 9223372036854775807";
    assert.ok(translate(language.id, "Undo delete {name}", { name }).includes(name), "User names are interpolated intact");
    assert.ok(translate(language.id, "Returned rows: {count}", { count: 500 }).includes("500"));
}
const clipboardSource = ts.createSourceFile("src/lib/clipboard.ts", readFileSync("src/lib/clipboard.ts", "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const inspectClipboard = (node: ts.Node) => {
    if (ts.isCallExpression(node) && node.expression.getText(clipboardSource) === "translate" && node.arguments[1] && ts.isStringLiteral(node.arguments[1])) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, node.arguments[1].text));
    ts.forEachChild(node, inspectClipboard);
};
inspectClipboard(clipboardSource);

class PreferenceWindow extends EventTarget {
    value: string | null = null;
    writable = true;
    localStorage = {
        getItem: (key: string) => key === LANGUAGE_KEY ? this.value : null,
        setItem: (key: string, value: string) => { if (!this.writable) throw new Error("Storage denied"); assert.equal(key, LANGUAGE_KEY); this.value = value; },
    };
}
const fixtureWindow = new PreferenceWindow();
Object.defineProperty(globalThis, "window", { configurable: true, value: fixtureWindow });
let notifications = 0;
const unsubscribe = subscribeLanguage(() => notifications++);
assert.equal(readLanguage(), "en");
assert.equal(writeLanguage("ar"), true);
assert.equal(readLanguage(), "ar");
assert.equal(notifications, 1);
fixtureWindow.value = "de";
fixtureWindow.dispatchEvent(Object.assign(new Event("storage"), { key: LANGUAGE_KEY }));
assert.equal(readLanguage(), "de");
fixtureWindow.writable = false;
assert.equal(writeLanguage("ja"), false);
assert.equal(readLanguage(), "ja", "Storage denial preserves the session choice");
fixtureWindow.value = null;
fixtureWindow.dispatchEvent(Object.assign(new Event("storage"), { key: null }));
assert.equal(readLanguage(), "en", "Cleared preferences restore English");
unsubscribe();
const count = notifications;
fixtureWindow.dispatchEvent(new Event("mydevtools-language-changed"));
assert.equal(notifications, count);
Reflect.deleteProperty(globalThis, "window");

const layout = readFileSync("src/app/layout.tsx", "utf8");
const bootstrap = layout.match(/__html: "(try\{var l=localStorage\.getItem\('mydevtools-language'\).*?)" \}\}/)?.[1];
assert.ok(bootstrap);
for (const [stored, expected, direction] of [[null, "en", "ltr"], ["ar", "ar", "rtl"], ["de", "de", "ltr"], ["xx", "en", "ltr"]]) {
    const root = { lang: "en", dir: "ltr" };
    runInNewContext(bootstrap, { document: { documentElement: root }, localStorage: { getItem: () => stored } });
    assert.equal(root.lang, expected); assert.equal(root.dir, direction);
}
console.log("Eight-language catalog/placeholders, safe fallback, global preference, cross-window notifications, storage-denied session choice and first-paint Arabic direction pass.");

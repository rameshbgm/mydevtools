import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate } from "../src/lib/i18n/catalog";
import { MEMORY_TRANSLATIONS, localizeMemoryMessage, memoryRowLabel } from "../src/lib/i18n/memory";
import { clearStorageRow, parseLocalRecords, storageValueText, type StorageRow } from "../src/lib/storage-inventory";

async function main() {
const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(MEMORY_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const [index, value] of columns.entries()) {
        assert.ok(value.trim(), `${source}/${index}`);
        assert.deepEqual(placeholders(value), placeholders(source), source);
    }
}
const requireTranslation = (text: string) => {
    if (text) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, text), `Missing memory translation: ${text}`);
};
const pagePath = "src/app/memory/page.tsx";
const pageSource = readFileSync(pagePath, "utf8");
for (const path of [pagePath, "src/lib/storage-inventory.ts", "src/lib/i18n/memory.ts"]) {
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, path.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const inspectCopy = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) requireTranslation(node.text);
        else if (ts.isConditionalExpression(node)) { inspectCopy(node.whenTrue); inspectCopy(node.whenFalse); }
        else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) inspectCopy(node.right);
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && /[a-z]/i.test(node.text)) assert.fail(`Untranslated memory JSX: ${node.text.trim()}`);
        if (ts.isCallExpression(node) && ["t", "setNotice", "setError", "warnings.push"].includes(node.expression.getText(file)) && node.arguments[0]) inspectCopy(node.arguments[0]);
        if (ts.isNewExpression(node) && node.expression.getText(file) === "Error" && node.arguments?.[0]) inspectCopy(node.arguments[0]);
        if (ts.isPropertyAssignment(node) && ["label", "description", "title"].includes(node.name.getText(file))) inspectCopy(node.initializer);
        if (ts.isJsxAttribute(node) && ["title", "aria-label", "placeholder"].includes(node.name.getText(file)) && node.initializer) inspectCopy(node.initializer);
        ts.forEachChild(node, visit);
    };
    visit(file);
}

requireTranslation("Local storage could not be fully read.");
requireTranslation("Tab session storage could not be fully read.");

const values = { count: 23, name: "db {name} / 顧客", scope: "مشروع · Å", quota: "1.5 MB", start: 26, end: 50, id: "raw-id", store: "Tasks/原始", status: "status", recovery: "recovery", detail: "QuotaExceededError: raw diagnostic" };
for (const language of LANGUAGES) {
    const t = (source: string, data?: Record<string, string | number>) => translate(language.id, source, data);
    for (const source of Object.keys(MEMORY_TRANSLATIONS)) {
        assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Memory catalog not registered: ${source}`);
        const expected = language.id === "en" ? source : SHARED_TRANSLATIONS[source][LANGUAGES.findIndex((entry) => entry.id === language.id) - 1];
        assert.equal(t(source, values), expected.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (match, key) => String(values[key as keyof typeof values] ?? match)));
    }
    // Only template structure translates; interpolation keeps arbitrary keys intact.
    assert.equal(localizeMemoryMessage(`Database ${values.name} did not respond.`, t), t("Database {name} did not respond.", { name: values.name }));
    assert.equal(localizeMemoryMessage(`Cannot read ${values.name}. Check browser storage permissions.`, t), t("Cannot read {name}. Check browser storage permissions.", { name: values.name }));
    assert.equal(localizeMemoryMessage(`Cannot read ${values.name}.`, t), t("Cannot read {name}.", { name: values.name }));
    assert.equal(localizeMemoryMessage(values.detail, t), values.detail);
    for (const recovery of ["Previous values were restored.", "Some previous values could not be restored; verify your records and use a backup."]) {
        assert.equal(localizeMemoryMessage(`Import could not finish. ${recovery} Check storage permissions/quota. ${values.detail}`, t), t("Import could not finish. {recovery} Check storage permissions/quota. {detail}", { recovery: t(recovery), detail: values.detail }));
    }
    const clearing = "Clearing could not finish; some entries may already be removed. Refresh and retry. ";
    assert.equal(localizeMemoryMessage(`${clearing}IndexedDB is unavailable.`, t), t(`${clearing}{detail}`, { detail: t("IndexedDB is unavailable.") }));
    for (const key of ["Name", "Refresh", "Saved SQL queries", "raw:{name}/مرحبا"]) {
        assert.equal(memoryRowLabel({ engine: "local", key: `mydevtools:project:project-id:${key}`, label: key }, t), key);
    }
    assert.equal(memoryRowLabel({ engine: "indexeddb", database: "db", key: "raw/store", label: "db · raw/store" }, t), "db · raw/store");
    assert.equal(memoryRowLabel({ engine: "indexeddb", toolId: "todo-list", key: "raw/store", label: "Tasks · raw/store" }, t), t("Tasks · {store}", { store: "raw/store" }));
    assert.equal(memoryRowLabel({ engine: "local", key: "mydevtools-sql-queries-v1", label: "Saved SQL queries" }, t), t("Saved SQL queries"));
}

// State is source data, translated at render time. Language changes must not
// remount the page or reset filters, previews, imports, selection or typed CLEAR.
assert.match(pageSource, /const \{ t \} = useLanguage\(\)/);
assert.doesNotMatch(pageSource, /key=\{(?:language|t\()/);
assert.match(pageSource, /useState<StorageRow\[\] \| null>\(null\)/);
assert.match(pageSource, /open=\{pendingClear !== null\}/);
assert.doesNotMatch(pageSource, /modal\.confirm/);
assert.match(pageSource, /localizeMemoryMessage\(error, t\)/);
assert.match(pageSource, /\{t\(notice\)\}/);
const pageFile = ts.createSourceFile(pagePath, pageSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const stateSetters = new Set(["setQuery", "setScope", "setEngine", "setSensitive", "setPreview", "setPendingImport", "setPendingClear", "setResetText"]);
const inspectEffects = (node: ts.Node) => {
    if (ts.isCallExpression(node) && node.expression.getText(pageFile) === "useEffect") {
        const inspect = (child: ts.Node) => {
            if (ts.isCallExpression(child)) assert.ok(!stateSetters.has(child.expression.getText(pageFile)), `Effect resets retained state: ${child.expression.getText(pageFile)}`);
            ts.forEachChild(child, inspect);
        };
        inspect(node);
    }
    ts.forEachChild(node, inspectEffects);
};
inspectEffects(pageFile);

// Destructive protections and the literal confirmation token stay intact.
assert.match(pageSource, /rows\.filter\(\(row\) => !row\.protected\)/);
assert.match(pageSource, /disabled=\{busy \|\| row\.protected\}/);
assert.match(pageSource, /if \(resetText !== "CLEAR"\) return/);
assert.match(pageSource, /disabled=\{busy \|\| resetText !== "CLEAR"\}/);
assert.match(pageSource, /if \(fresh\.warnings\.length\) throw new Error/);
assert.match(pageSource, /if \(!pendingClear \|\| working\.current\) return/);
assert.match(pageSource, /storageValueText\(preview\.value, sensitive, Infinity\)\.slice\(0, 65_536\)/);
assert.doesNotMatch(pageSource, /t\(storageValueText/);
const protectedRow: StorageRow = { id: "project", engine: "local", key: "projects", label: "Project catalogue", scope: "global", description: "", protected: true };
let removed = false;
const storage = { removeItem() { removed = true; } } as unknown as Storage;
await assert.rejects(clearStorageRow(protectedRow, { local: storage, session: storage }), /Manage project metadata/);
assert.equal(removed, false);
assert.throws(() => parseLocalRecords(JSON.stringify({ format: "mydevtools-storage", version: 1, entries: [{ engine: "local", key: "same", value: "first" }, { engine: "local", key: "same", value: "second" }] })), /duplicate storage keys/);
assert.equal(storageValueText("raw name / {count} / 2026-10-20T12:34:56Z", true), "raw name / {count} / 2026-10-20T12:34:56Z");
console.log(`Memory localization: ${Object.keys(MEMORY_TRANSLATIONS).length} entries in all eight languages; authored copy, templates, raw data, retained state and destructive guards verified.`);

}
void main().catch((cause) => { console.error(cause); process.exitCode = 1; });

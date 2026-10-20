/* eslint-disable @typescript-eslint/no-explicit-any -- Heterogeneous VM/React callback regression harness. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { scopedStorage, projectKey, PROJECTS_KEY, ACTIVE_PROJECT_KEY, deleteProject } from "../src/lib/project-storage";
import { LANGUAGES, translate, type Language } from "../src/lib/i18n/catalog";
const require = createRequire(resolve("package.json")), React = require("react"), runtime = require("react/jsx-runtime"), library = require(resolve("src/lib/local-library.ts"));
const project = "11111111-1111-4111-8111-111111111111", other = "22222222-2222-4222-8222-222222222222";
const text = (value: any): string => value == null ? "" : typeof value === "string" || typeof value === "number" ? String(value) : Array.isArray(value) ? value.map(text).join("") : text(value.props?.children);
function fixture(kind: "snippets" | "bookmarks", id = "public-existing", title = "Public existing") {
    const common = { id, title, tags: ["public"], updatedAt: "2026-10-21" };
    return kind === "snippets" ? { ...common, code: 'console.log("PUBLIC 日本語 العربية 🌍")', language: "javascript" } : { ...common, url: "https://example.com/docs", folder: "Public" };
}
function harness(id: string, language: Language) {
    const kind: "snippets" | "bookmarks" = id === "code-snippets" ? "snippets" : "bookmarks", key = kind === "snippets" ? "mydevtools-code-snippets-v1" : "mydevtools-resource-bookmarks-v1";
    const values = new Map<string, string>([[PROJECTS_KEY, JSON.stringify([{ id: project, name: "Public one", createdAt: "2026-10-21" }, { id: other, name: "Public two", createdAt: "2026-10-21" }])], [ACTIVE_PROJECT_KEY, project], [projectKey(key, project), JSON.stringify([fixture(kind)])], [projectKey(key, other), JSON.stringify([fixture(kind, "public-other", "Other project")])]]);
    const storage: Storage = { get length() { return values.size; }, key: (index) => [...values.keys()][index] ?? null, getItem: (name) => values.get(name) ?? null, setItem: (name, value) => { values.set(name, value); }, removeItem: (name) => { values.delete(name); }, clear: () => values.clear() };
    const scoped = scopedStorage(storage, () => project), writes: string[] = [];
    const projectStorage = { ...scoped, getItem: scoped.getItem, setItem: (key: string, value: string) => { scoped.setItem(key, value); writes.push(value); } };
    let index = 0, effectIndex = 0, changed = false; const states: any[] = [], effects: { pending: boolean; fn: () => void }[] = [];
    const hooks = { useState: (initial: unknown) => { const i = index++; if (!(i in states)) states[i] = initial; return [states[i], (next: any) => { states[i] = typeof next === "function" ? next(states[i]) : next; changed = true; }]; }, useEffect: (fn: () => void) => { const i = effectIndex++; effects[i] ??= { fn, pending: true }; } };
    const dependencies = (name: string): any => {
        if (name === "react") return hooks; if (name === "react/jsx-runtime") return runtime;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t: (source: string, values?: Record<string, string | number>) => translate(language, source, values) }) };
        if (name.endsWith("ToolPageLayout")) return { default: (props: any) => props.children, __esModule: true };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => () => null });
        if (name.endsWith("CodeEditor")) return { CodeEditor: (props: any) => React.createElement("editor", props) };
        if (name.endsWith("local-library")) return library;
        if (name.endsWith("project-storage")) return { projectStorage };
        if (name.endsWith("download")) return { downloadText: () => {} };
        if (name.endsWith("clipboard")) return { copyToClipboard: () => true };
        throw new Error(name);
    };
    const compiled = { exports: {} as { default: () => any } };
    runInNewContext(ts.transpileModule(readFileSync(`src/app/tools/${id}/page.tsx`, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText, { module: compiled, exports: compiled.exports, require: dependencies, crypto: globalThis.crypto, Date, Error });
    const render = () => {
        let nodes: any[] = [];
        for (let turn = 0; turn < 8; turn++) {
            changed = false; index = effectIndex = 0; nodes = [];
            const walk = (value: any) => { if (!value || typeof value !== "object") return; if (Array.isArray(value)) { value.forEach(walk); return; } if (typeof value.type === "function") { walk(value.type(value.props)); return; } nodes.push(value); walk(value.props.children); };
            walk(compiled.exports.default()); effects.forEach((effect) => { if (effect.pending) { effect.pending = false; effect.fn(); } }); if (!changed) break; assert.ok(turn < 7);
        }
        return nodes;
    };
    const button = (view: any[], label: string) => { const node = view.find((node) => node.type === "button" && text(node) === translate(language, label)); assert.ok(node, `${id}/${language}: missing ${label}`); return node; };
    const pending = (view: any[], record: unknown) => { let release!: (value: string) => void; const file = { size: 100, text: () => new Promise<string>((resolve) => { release = resolve; }) }; const action = view.find((node) => node.type === "input" && node.props.type === "file").props.onChange({ target: { files: [file], value: "public-fixture" } }); return { finish: async () => { release(JSON.stringify({ version: 1, kind, records: [record] })); await action; } }; };
    const records = () => JSON.parse(storage.getItem(projectKey(key, project)) ?? "[]") as any[];
    return { render, button, pending, records, kind, key, storage, writes, values };
}
async function main() {
    for (const id of ["code-snippets", "resource-bookmarks"]) for (const { id: language } of LANGUAGES) {
        // A deleted record must not be resurrected when the old file read settles.
        const app = harness(id, language); let view = app.render();
        if (app.kind === "snippets") { view.find((node) => node.type === "button" && text(node).startsWith("Public existing")).props.onClick(); view = app.render(); }
        const task = app.pending(view, fixture(app.kind, "public-incoming", "Imported 日本語 العربية 🌍"));
        app.button(view, app.kind === "snippets" ? "Remove saved snippet" : "Remove").props.onClick(); app.render(); assert.deepEqual(app.records(), []);
        await task.finish(); app.render(); assert.equal(app.records().length, 1); assert.equal(app.records()[0].title, "Imported 日本語 العربية 🌍");
        assert.equal(app.records().some((record) => record.id === "public-existing"), false);
        assert.equal(JSON.parse(app.storage.getItem(projectKey(app.key, other))!)[0].id, "public-other");

        // Intervening persisted edits, another tab and two out-of-order imports merge.
        const edits = harness(id, language); view = edits.render();
        const first = edits.pending(view, fixture(edits.kind, "ignored-one", "Import one")), second = edits.pending(view, fixture(edits.kind, "ignored-two", "Import two"));
        if (edits.kind === "snippets") view.find((node) => node.type === "button" && text(node).startsWith("Public existing")).props.onClick();
        else view.find((node) => node.type === "button" && text(node) === translate(language, "Edit {name}", { name: "Public existing" })).props.onClick();
        view = edits.render(); view.find((node) => node.type === "input" && node.props.maxLength === 160).props.onChange({ target: { value: "Edited while reading" } }); view = edits.render();
        if (edits.kind === "snippets") edits.button(view, "Save snippet").props.onClick();
        else view.find((node) => node.type === "form").props.onSubmit({ preventDefault() {} });
        view = edits.render(); assert.equal(edits.records()[0].title, "Edited while reading");
        view.find((node) => node.type === "input" && node.props.maxLength === 160).props.onChange({ target: { value: "Unfinished draft" } }); edits.render();
        const added = fixture(edits.kind, "public-new", "Other tab addition");
        edits.storage.setItem(projectKey(edits.key, project), JSON.stringify([...edits.records(), added]));
        edits.storage.setItem(ACTIVE_PROJECT_KEY, other); // The mounted document remains in its original scope.
        await second.finish(); edits.render(); await first.finish(); edits.render();
        assert.deepEqual(edits.records().map((record) => record.title).sort(), ["Edited while reading", "Other tab addition", "Import one", "Import two"].sort());
        assert.equal(JSON.parse(edits.storage.getItem(projectKey(edits.key, other))!)[0].title, "Other project");
        assert.equal(edits.render().find((node) => node.type === "input" && node.props.maxLength === 160).props.value, "Unfinished draft");

        // No repair/overwrite of data that became invalid while a read was pending.
        const corrupt = harness(id, language); const invalid = corrupt.pending(corrupt.render(), fixture(corrupt.kind)); corrupt.storage.setItem(projectKey(corrupt.key, project), "PUBLIC invalid saved data"); await invalid.finish(); assert.equal(corrupt.storage.getItem(projectKey(corrupt.key, project)), "PUBLIC invalid saved data"); assert.equal(corrupt.writes.length, 0);
        // Existing real project guards reject the old document after deletion/purge.
        const deleted = harness(id, language); const late = deleted.pending(deleted.render(), fixture(deleted.kind)); deleteProject(project, deleted.storage); deleted.storage.removeItem(projectKey(deleted.key, project)); await late.finish(); assert.equal(deleted.storage.getItem(projectKey(deleted.key, project)), null); assert.equal(deleted.writes.length, 0);
    }
    console.log("Library imports: actual deferred file callbacks preserve deletes, concurrent edits/imports, corrupted-storage recovery and original project isolation/deletion guards in eight languages.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { JSON_VALIDATION_TRANSLATIONS } from "../src/lib/i18n/json-validation";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { SEO_CONTENT } from "../src/lib/seo-content";
import { formatJsonText } from "../src/lib/json-formatting";
import { parseStructuredData } from "../src/lib/structured-data";
import { validateJsonSchema } from "../src/lib/json-schema-workbench";

const ids = ["json-formatter", "json-validator", "json-schema-workbench"] as const;
type ToolId = typeof ids[number];
const placeholders = (text: string) => (text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(JSON_VALIDATION_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const [index, language] of LANGUAGES.slice(1).entries()) {
        assert.ok(columns[index].trim(), source);
        assert.deepEqual(placeholders(columns[index]), placeholders(source), `${source}/${language.id}`);
        assert.equal(translate(language.id, source), columns[index], `${source}/${language.id}: catalog registration`);
    }
}
for (const id of ids) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const check = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, node.text), `${id}: missing ${node.text}`);
        else if (ts.isConditionalExpression(node)) { check(node.whenTrue); check(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t") check(node.arguments[0]);
        if (ts.isJsxText(node)) assert.equal(node.text.trim(), "", `${id}: unlocalized JSX`);
        if (ts.isJsxAttribute(node) && ["title", "description", "aria-label", "ariaLabel"].includes(node.name.getText(file))) assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `${id}: unlocalized attribute`);
        if (ts.isJsxAttribute(node) && node.name.getText(file) === "learnMore") {
            const help = (child: ts.Node) => { if (ts.isStringLiteral(child)) check(child); ts.forEachChild(child, help); }; help(node);
        }
        ts.forEachChild(node, visit);
    }; visit(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction|t\()/, "Locale must not remount editors");
    assert.doesNotMatch(source, /\bt\((?:input|output|schema|instance|issue\.message|issue\.path|result\.error|error\.message|e\.message)\)/, "Source and engine diagnostics remain exact");
    for (const faq of SEO_CONTENT[id]?.faq ?? []) for (const text of [faq.q, faq.a]) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, text), `${id}: FAQ ${text}`);
}
for (const type of ["Array", "Object", "string", "number", "boolean", "object", "undefined"]) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, type), type);

const require = createRequire(import.meta.url);
const React = require("react") as typeof import("react"), jsxRuntime = require("react/jsx-runtime");
type Props = { [key: string]: unknown; children?: unknown; title?: unknown; description?: unknown; extra?: unknown; value?: string; readOnly?: boolean; dir?: string; ariaLabel?: string; options?: { value: string; label: string }[]; onClick?: () => unknown; onChange?: (value: any) => void; onAccept?: (payload: { data: string }) => void; getState?: () => unknown; learnMore?: Record<string, string | string[]>; };
type Node = { type: unknown; props: Props };
type WorkerMode = "normal" | "timeout" | "error" | "deferred";
function harness(id: ToolId, initial: Record<string, unknown> = {}, workerMode: WorkerMode = "normal") {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const names: string[] = [], cells: unknown[] = [], memos: { deps: unknown[]; value: unknown }[] = [], effects: unknown[][] = [];
    const writes: string[] = [], copied: string[] = [], notices: unknown[] = [], posted: unknown[] = [];
    const engine = { parses: 0, formats: 0, stats: 0, worker: 0, terminated: 0 };
    let language: Language = "en", cursor = 0, memoIndex = 0, effectIndex = 0, dirty = false, pending: (() => void)[] = [], timeout: (() => void) | undefined;
    let completeWorker: (() => void) | undefined;
    let restore: ((state: any) => void) | undefined;
    const scan = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file)); ts.forEachChild(node, scan); }; scan(file);
    const same = (a: unknown[] | undefined, b: unknown[]) => !!a && a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
    const component = (name: string) => (props: Props) => React.createElement(name, props, props.children as import("react").ReactNode);
    const ui = new Proxy({ App: { useApp: () => ({ message: { success: (value: unknown) => notices.push(value), error: (value: unknown) => notices.push(value) } }) }, Input: { TextArea: component("TextArea") }, Typography: { Text: component("Text") } }, { get: (target, name: string) => name in target ? target[name as keyof typeof target] : component(name) });
    class TestWorker {
        onmessage?: (event: { data: unknown }) => void;
        onerror?: () => void;
        workerSelf: { onmessage?: (event: { data: unknown }) => void; postMessage: (data: unknown) => void };
        constructor(url: URL, options: { type: string }) {
            assert.ok(url.pathname.endsWith("/src/workers/schema.worker.ts")); assert.equal(options.type, "module"); engine.worker++;
            this.workerSelf = { postMessage: (data) => this.onmessage?.({ data }) };
            const module = { exports: {} };
            const workerSource = ts.transpileModule(readFileSync("src/workers/schema.worker.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
            runInNewContext(workerSource, { module, exports: module.exports, self: this.workerSelf, require: (name: string) => { assert.equal(name, "../lib/json-schema-workbench"); return { validateJsonSchema }; } });
        }
        postMessage(payload: unknown) { const clone = structuredClone(payload); posted.push(clone); if (workerMode === "timeout") timeout?.(); else if (workerMode === "error") this.onerror?.(); else if (workerMode === "deferred") completeWorker = () => this.workerSelf.onmessage?.({ data: clone }); else this.workerSelf.onmessage?.({ data: clone }); }
        terminate() { engine.terminated++; }
    }
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (fallback: unknown) => { const index = cursor++; if (!(index in cells)) cells[index] = Object.hasOwn(initial, names[index]) ? initial[names[index]] : fallback; return [cells[index], (value: unknown) => { const next = typeof value === "function" ? (value as (old: unknown) => unknown)(cells[index]) : value; if (!Object.is(next, cells[index])) dirty = true; cells[index] = next; writes.push(names[index]); }]; }, useMemo: (compute: () => unknown, deps: unknown[]) => { const index = memoIndex++; if (!same(memos[index]?.deps, deps)) memos[index] = { value: compute(), deps }; return memos[index].value; }, useEffect: (callback: () => void, deps: unknown[]) => { const index = effectIndex++; if (!same(effects[index], deps)) { effects[index] = deps; pending.push(callback); } } };
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name === "antd") return ui;
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => component("Icon") });
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => translate(language, source, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Props) => React.createElement("Layout", props, ...[...Object.values(props.learnMore ?? {}).flat().map((text) => translate(language, String(text))), props.children] as import("react").ReactNode[]) };
        if (name.endsWith("CodeEditor")) return { CodeEditor: component("CodeEditor") };
        if (name.endsWith("ToolBridgeBanner") || name.endsWith("ShareButton") || name.endsWith("SendToButton")) return { __esModule: true, default: component(name.split("/").at(-1)!) };
        if (name.endsWith("shareable-state")) return { useShareableState: (_schema: unknown, callback: typeof restore) => { restore = callback; } };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copied.push(value); return true; } };
        if (name.endsWith("json-formatting")) return { formatJsonText: (value: string, compact?: boolean) => { engine.formats++; return formatJsonText(value, compact); } };
        if (name.endsWith("structured-data")) return { parseStructuredData: (value: string) => { engine.parses++; return parseStructuredData(value); } };
        throw new Error(`Unexpected dependency ${name}`);
    };
    const module = { exports: {} as { default: () => unknown } };
    const instrumented = source.replace("import.meta.url", JSON.stringify(new URL(`../${path}`, import.meta.url).href)).replace(/(function validateJSON\([^\n]+\{)/, "$1\n    engine.parses++;").replace(/(function getJSONStats\([^\n]+\{)\n/, "$1\n    engine.stats++;\n");
    const code = ts.transpileModule(instrumented, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module, exports: module.exports, require: dependencies, engine, Error, TextEncoder, URL, Worker: TestWorker, setTimeout: (callback: () => void, delay: number) => { assert.equal(delay, 5000); timeout = callback; return 1; }, clearTimeout: () => { timeout = undefined; } });
    const collect = (tree: unknown) => {
        const nodes: Node[] = [], text: string[] = [];
        const walk = (node: unknown): void => {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { text.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            const element = node as Node;
            if (typeof element.type === "function") { walk(element.type(element.props)); return; }
            if (element.props) { nodes.push(element); for (const name of ["title", "description", "extra"]) if (element.props[name] != null) walk(element.props[name]); walk(element.props.children); }
        }; walk(tree); return { nodes, text: text.join(" ") };
    };
    const render = (locale: Language) => {
        language = locale; let tree: unknown;
        for (let attempt = 0; attempt < 5; attempt++) { dirty = false; cursor = 0; memoIndex = 0; effectIndex = 0; pending = []; tree = module.exports.default(); pending.forEach((effect) => effect()); if (!dirty) break; assert.ok(attempt < 4); }
        const view = collect(tree);
        return { ...view, button: (source: string) => { const node = view.nodes.find((node) => node.type === "Button" && node.props.children === translate(language, source)); assert.ok(node, `${id}: ${source}`); return node.props.onClick!; }, editor: (readOnly = false) => { const node = view.nodes.find((node) => node.type === "CodeEditor" && !!node.props.readOnly === readOnly); assert.ok(node); return node; }, bridge: () => { const node = view.nodes.find((node) => node.type === "ToolBridgeBanner"); assert.ok(node); return node.props.onAccept!; } };
    };
    return { render, state: () => Object.fromEntries(names.map((name, index) => [name, cells[index]])), writes, copied, notices, engine, posted, notice: () => collect(notices.at(-1)), restore: (state: unknown) => { assert.ok(restore); restore(state); }, completeWorker: () => { assert.ok(completeWorker); completeWorker(); } };
}

function localeInvariant(work: ReturnType<typeof harness>) {
    const state = work.state(), calls = { ...work.engine }; work.writes.length = 0;
    for (const language of LANGUAGES) { work.render(language.id); assert.deepEqual(work.state(), state, "Locale changed raw source, options or result"); assert.deepEqual(work.engine, calls, "Locale reran parser, formatter, stats or worker"); }
    assert.deepEqual(work.writes, [], "Locale called a state setter");
}
const numericSource = '{"fraction":0.9999999999999999999,"zero":-0,"tiny":1e-999,"huge":1e400,"id":9223372036854775807,"duplicate":1,"duplicate":2,"name":"عينة 日本語 <data>"}';
async function main() {
for (const language of LANGUAGES) {
    const formatter = harness("json-formatter", { input: numericSource });
    let view = formatter.render(language.id);
    assert.equal(view.editor().props.value, numericSource);
    assert.equal(view.editor(true).props.value, formatJsonText(numericSource));
    assert.equal(view.editor().props.ariaLabel, translate(language.id, "JSON input editor"));
    assert.equal(view.editor(true).props.ariaLabel, translate(language.id, "JSON result editor"));
    const options = view.nodes.find((node) => node.type === "Segmented")!;
    assert.deepEqual(Array.from(options.props.options!, (option) => option.value), ["Prettify", "Minify", "Validate"]);
    assert.deepEqual(Array.from(options.props.options!, (option) => option.label), ["Prettify", "Minify", "Validate"].map((source) => translate(language.id, source)));
    localeInvariant(formatter); view = formatter.render(language.id);
    view.button("Copy")(); assert.equal(formatter.copied.at(-1), formatJsonText(numericSource));
    view.nodes.find((node) => node.type === "Segmented")!.props.onChange!("Minify"); view = formatter.render(language.id);
    assert.equal(view.editor(true).props.value, numericSource);
    view.button("Copy")(); assert.equal(formatter.copied.at(-1), numericSource);
    const send = view.nodes.find((node) => node.type === "SendToButton")!; assert.equal(send.props.data, numericSource);
    const share = view.nodes.find((node) => node.type === "ShareButton")!; assert.equal((share.props.getState!() as any).mode, "Minify");
    view.nodes.find((node) => node.type === "Segmented")!.props.onChange!("Validate"); view = formatter.render(language.id);
    assert.ok(view.text.includes(translate(language.id, "JSON is valid!")));
    view.editor().props.onChange!("{broken"); view = formatter.render(language.id);
    assert.ok(view.text.includes(translate(language.id, "JSON is invalid")));
    assert.ok(formatter.notice().text.includes(translate(language.id, "Invalid JSON. Check the syntax and try again.")));
    assert.ok(formatter.notice().nodes.some((node) => node.type === "pre" && node.props.dir === "ltr" && typeof node.props.children === "string"));
    localeInvariant(formatter); view = formatter.render(language.id); view.button("Clear")(); view = formatter.render(language.id);
    assert.equal(view.editor().props.value, ""); assert.ok(view.text.includes(translate(language.id, "Paste JSON and it will be validated automatically")));
    view.bridge()({ data: numericSource }); view = formatter.render(language.id); assert.equal(view.editor().props.value, numericSource); localeInvariant(formatter);
    formatter.restore({ input: numericSource, mode: "Minify" }); view = formatter.render(language.id); assert.equal(view.editor(true).props.value, numericSource);

    const validator = harness("json-validator", { input: numericSource });
    let valid = validator.render(language.id); assert.ok(valid.text.includes(translate(language.id, "The JSON is well-formed and valid.")));
    assert.ok(valid.text.includes(translate(language.id, "Type: {type}", { type: translate(language.id, "Object") })));
    localeInvariant(validator); valid = validator.render(language.id);
    valid.editor().props.onChange!('[1,\n broken]'); valid = validator.render(language.id);
    assert.ok(valid.text.includes(translate(language.id, "Invalid JSON")));
    assert.ok(valid.nodes.some((node) => node.type === "pre" && node.props.dir === "ltr")); localeInvariant(validator);
    valid = validator.render(language.id); valid.button("Clear")(); valid = validator.render(language.id); assert.ok(valid.text.includes(translate(language.id, "Input is empty")));
    valid.bridge()({ data: numericSource }); valid = validator.render(language.id); assert.equal(valid.editor().props.value, numericSource);
    validator.restore({ input: '["user owned","عينة"]' }); valid = validator.render(language.id); assert.equal(valid.editor().props.value, '["user owned","عينة"]'); localeInvariant(validator);

    const schema = harness("json-schema-workbench"); let schemaView = schema.render(language.id);
    const initial = schema.state(); localeInvariant(schema); schemaView = schema.render(language.id);
    for (const editor of schemaView.nodes.filter((node) => node.type === "TextArea")) assert.equal(editor.props.dir, "ltr");
    await schemaView.button("Validate instance")(); schemaView = schema.render(language.id);
    assert.equal(schema.engine.worker, 1); assert.equal(schema.engine.terminated, 1);
    assert.deepEqual(schema.posted[0], { instance: parseStructuredData(String(initial.instance)), schema: parseStructuredData(String(initial.schema)) });
    const expected = validateJsonSchema(parseStructuredData(String(initial.instance)), parseStructuredData(String(initial.schema)));
    assert.deepEqual(schema.state().issues, expected);
    for (const issue of expected) assert.ok(schemaView.nodes.some((node) => node.type === "pre" && node.props.dir === "ltr" && node.props.children === issue.message));
    assert.ok(schemaView.text.includes(translate(language.id, "Instance issue. Check the value at this path."))); localeInvariant(schema);
    schemaView = schema.render(language.id);
    const payload = { data: JSON.stringify({ schema: { $schema: "https://json-schema.org/draft/2020-12/schema", oneOf: [{ type: "string" }, { type: "integer", minimum: 10 }] }, instance: 5 }) };
    schemaView.bridge()(payload); schemaView = schema.render(language.id); const fixtureState = schema.state(); localeInvariant(schema);
    schemaView = schema.render(language.id); await schemaView.button("Validate instance")(); schemaView = schema.render(language.id);
    assert.deepEqual(schema.posted.at(-1), { instance: parseStructuredData(String(fixtureState.instance)), schema: parseStructuredData(String(fixtureState.schema)) });
    schemaView.bridge()({ data: '{"schema":{"type":"string"},"instance":"user 日本語 العربية"}' }); schemaView = schema.render(language.id);
    await schemaView.button("Validate instance")(); schemaView = schema.render(language.id); assert.ok(schemaView.text.includes(translate(language.id, "The instance satisfies the schema"))); localeInvariant(schema);
    schemaView = schema.render(language.id); schemaView.bridge()({ data: '{"schema":{"$ref":"https://example.invalid/remote"},"instance":{}}' }); schemaView = schema.render(language.id);
    await schemaView.button("Validate instance")(); schemaView = schema.render(language.id);
    assert.ok(schemaView.text.includes(translate(language.id, "Schema error. Check the schema and local references.")));
    assert.ok(schemaView.text.includes("No validity claim can be made.")); localeInvariant(schema);
    schemaView = schema.render(language.id); schemaView.bridge()({ data: '{}' }); assert.equal(schema.notices.at(-1), translate(language.id, "Expected an object with schema and instance fields."));
    schemaView.bridge()({ data: '{bad' }); assert.equal(schema.notices.at(-1), translate(language.id, "Invalid JSON fixture."));
    const editor = schemaView.nodes.find((node) => node.type === "TextArea")!; editor.props.onChange!({ target: { value: 'type: object\nproperties:\n  item: {type: string}' } }); schemaView = schema.render(language.id);
    assert.equal(schema.state().schema, 'type: object\nproperties:\n  item: {type: string}'); assert.equal(schema.state().issues, null); localeInvariant(schema);
    schemaView = schema.render(language.id); schemaView.button("Reset example")(); schemaView = schema.render(language.id); assert.equal(schema.state().schema, initial.schema); assert.equal(schema.state().instance, initial.instance);
    // Language changes during an outstanding worker task preserve loading,
    // source and worker ownership until that same task resolves.
    const inflight = harness("json-schema-workbench", {}, "deferred");
    const pendingValidation = inflight.render(language.id).button("Validate instance")();
    const loading = inflight.render(language.id);
    assert.equal(inflight.state().validating, true);
    assert.ok(loading.nodes.filter((node) => node.type === "TextArea").every((node) => node.props.disabled));
    localeInvariant(inflight); inflight.completeWorker(); await pendingValidation;
    inflight.render(language.id); assert.equal(inflight.state().validating, false); assert.equal(inflight.engine.worker, 1); assert.equal(inflight.engine.terminated, 1);
    localeInvariant(inflight);
    // Retain each schema dialect URL and local-reference key exactly at the
    // worker boundary; these are protocol values, not translated labels.
    for (const dialect of ["https://json-schema.org/draft/2020-12/schema", "https://json-schema.org/draft/2019-09/schema", "http://json-schema.org/draft-07/schema#"]) {
        const fixture = { schema: { $schema: dialect, type: "object", definitions: { text: { type: "string" } }, properties: { name: { $ref: "#/definitions/text" } } }, instance: { name: "اسم 日本語" } };
        schemaView = schema.render(language.id); schemaView.bridge()({ data: JSON.stringify(fixture) }); schemaView = schema.render(language.id);
        await schemaView.button("Validate instance")(); schemaView = schema.render(language.id);
        assert.deepEqual(schema.posted.at(-1), fixture); assert.deepEqual(schema.state().issues, []); localeInvariant(schema);
    }
    for (const [mode, source] of [["timeout", "Validation exceeded five seconds. Simplify the schema or input; validity has not been determined."], ["error", "Validation worker failed. No validity claim can be made."]] as const) {
        const failed = harness("json-schema-workbench", {}, mode); const failedView = failed.render(language.id); await failedView.button("Validate instance")(); failed.render(language.id);
        assert.equal(failed.state().issues, null); assert.equal(failed.state().validating, false); assert.ok(failed.notice().text.includes(translate(language.id, source))); localeInvariant(failed);
    }
}
console.log("JSON validation localization: eight languages, three pages, help/FAQ coverage, exact numeric formatter output and clipboard, stable mode/share/bridge data, actual schema-worker handler and engine payloads, raw diagnostics, LTR technical content, and locale-invariant state/parser/worker counts pass.");

}
main().catch((error) => { console.error(error); process.exitCode = 1; });

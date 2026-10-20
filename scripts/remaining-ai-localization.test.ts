/* eslint-disable @typescript-eslint/no-explicit-any -- Heterogeneous React element/VM test harness only. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { REMAINING_AI_TRANSLATIONS, formatAiDiagnostic } from "../src/lib/i18n/remaining-ai";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { LLM_MODELS } from "../src/lib/llm-models";
import { encodeToon, decodeToon } from "../src/lib/toon";
const integrated = !!SHARED_TRANSLATIONS["Current settings produce {chunks} chunks from {chars} characters."];
const placeholders = (value: string) => (value.match(/\{[A-Za-z][A-Za-z0-9]*\}/g) ?? []).sort();
function tr(language: Language, source: string, values?: Record<string, string | number>) {
    const index = LANGUAGES.findIndex((item) => item.id === language) - 1;
    let value = index < 0 ? source : REMAINING_AI_TRANSLATIONS[source]?.[index] ?? translate(language, source);
    for (const [key, replacement] of Object.entries(values ?? {})) value = value.replaceAll(`{${key}}`, String(replacement));
    return value;
}
for (const [source, row] of Object.entries(REMAINING_AI_TRANSLATIONS)) {
    assert.equal(row.length, 7, source);
    row.forEach((value, index) => { assert.ok(value.trim(), source); assert.deepEqual(placeholders(value), placeholders(source), source); if (integrated) assert.equal(translate(LANGUAGES[index + 1].id, source), value, source); });
}
const raw = new Set(["#", "JSON", "XML", "TOON", "KEY", "KB", "ms"]);
function covered(value: string) { assert.ok(raw.has(value) || REMAINING_AI_TRANSLATIONS[value] || SHARED_TRANSLATIONS[value], `Missing AI copy: ${value}`); }
const ids = ["token-counter", "rag-search", "jsonl-validator", "agent-manifest-generator", "toon-converter"];
for (const id of ids) {
    const source = readFileSync(`src/app/tools/${id}/page.tsx`, "utf8"), ast = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const strings = (node: ts.Node) => { if (ts.isStringLiteral(node)) covered(node.text); else if (ts.isConditionalExpression(node)) { strings(node.whenTrue); strings(node.whenFalse); } };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && /[A-Za-z]/.test(node.text)) assert.fail(`${id}: raw JSX ${node.text}`);
        if (ts.isCallExpression(node) && node.expression.getText(ast) === "t" && node.arguments[0]) strings(node.arguments[0]);
        if (ts.isJsxAttribute(node) && node.name.getText(ast) === "learnMore") {
            const inspect = (item: ts.Node) => { if (ts.isStringLiteral(item) && !(ts.isPropertyAssignment(item.parent) && item.parent.name === item)) covered(item.text); ts.forEachChild(item, inspect); };
            inspect(node);
        }
        ts.forEachChild(node, visit);
    };
    visit(ast);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
    assert.doesNotMatch(source, /\[(?:language|t)\]/);
}
for (const model of LLM_MODELS) { if (model.pricingNote) covered(model.pricingNote); covered(model.tokenizerNote); }
const require = createRequire(resolve("package.json"));
const React = require("react") as typeof import("react"), jsx = require("react/jsx-runtime"), realTokenizer = require("gpt-tokenizer");
type Node = { type: unknown; props: Record<string, any> };
type Hook = { value: any; deps?: unknown[]; cleanup?: () => void };
const same = (left: unknown[] | undefined, right: unknown[]) => !!left && left.length === right.length && left.every((value, index) => Object.is(value, right[index]));
const tick = async () => { for (let n = 0; n < 35; n++) await Promise.resolve(); };
function harness(id: string) {
    let language: Language = "en", scope = "root", cursor = 0, dirty = false;
    const hooks = new Map<string, Hook[]>(), pending: (() => void)[] = [], copied: string[] = [], downloads: string[] = [];
    const calls = { token: 0, model: 0, embed: 0, convert: 0, provider: 0 };
    let share: (() => unknown) | undefined, providerDone: ((value: number) => void) | undefined, modelDone: (() => void) | undefined;
    const getHook = () => { const values = hooks.get(scope) ?? []; hooks.set(scope, values); return { values, index: cursor++ }; };
    const react = { ...React,
        useState: (initial: any) => { const { values, index } = getHook(); values[index] ??= { value: typeof initial === "function" ? initial() : initial }; return [values[index].value, (next: any) => { const value = typeof next === "function" ? next(values[index].value) : next; if (!Object.is(value, values[index].value)) { values[index].value = value; dirty = true; } }]; },
        useRef: (initial: any) => { const { values, index } = getHook(); values[index] ??= { value: { current: initial } }; return values[index].value; },
        useMemo: (factory: () => unknown, deps: unknown[]) => { const { values, index } = getHook(); if (!values[index] || !same(values[index].deps, deps)) values[index] = { value: factory(), deps }; return values[index].value; },
        useCallback: (fn: unknown, deps: unknown[]) => react.useMemo(() => fn, deps),
        useEffect: (effect: () => (() => void) | void, deps: unknown[]) => { const { values, index } = getHook(); if (!values[index] || !same(values[index].deps, deps)) { const previous = values[index]; values[index] = { value: null, deps }; pending.push(() => { previous?.cleanup?.(); const cleanup = effect(); if (cleanup) values[index].cleanup = cleanup; }); } },
    };
    const component = (type: string) => function Component(props: Record<string, unknown>) { return React.createElement(type, props, props.children as React.ReactNode); };
    const Input = Object.assign(component("Input"), { TextArea: component("TextArea"), Password: component("Password") });
    const Typography = Object.fromEntries(["Text", "Paragraph", "Title"].map((name) => [name, component(name)]));
    const antd = new Proxy({ Typography, Input, Form: Object.assign(component("Form"), { Item: component("FormItem") }), Radio: { Group: component("RadioGroup") }, Upload: Object.assign(component("Upload"), { Dragger: component("Dragger") }), Space: Object.assign(component("Space"), { Compact: component("Compact") }) }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
    const embedding = (value: string) => { const vector = new Array(384).fill(0); vector[/cat|feline/i.test(value) ? 0 : 1] = 1; return vector; };
    const dependencies = (name: string): any => {
        if (name === "react") return react; if (name === "react/jsx-runtime") return jsx;
        if (name === "antd") return antd;
        if (name === "@ant-design/icons") return new Proxy({}, { get: (_target, key) => component(String(key)) });
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => tr(language, source, values) }) };
        if (name.endsWith("remaining-ai")) return { formatAiDiagnostic };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: any) => React.createElement("Layout", props, props.children) };
        if (name.endsWith("ShareButton")) return { __esModule: true, default: (props: any) => { share = props.getState; return React.createElement("ShareButton", props); } };
        if (name.startsWith("@/components/")) return { __esModule: true, default: component(name.slice(name.lastIndexOf("/") + 1)) };
        if (name.endsWith("shareable-state")) return { useShareableState: () => {} };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copied.push(value); return false; } };
        if (name.endsWith("download")) return { downloadText: (value: string) => downloads.push(value) };
        if (name.endsWith("llm-models")) return require(resolve("src/lib/llm-models.ts"));
        if (name.endsWith("provider-token-count")) return { countProviderTokens: () => { calls.provider++; return new Promise<number>((resolve) => { providerDone = resolve; }); } };
        if (name.endsWith("json-number-source")) return require(resolve("src/lib/json-number-source.ts"));
        if (name.endsWith("/toon")) return { encodeToon: (value: unknown) => { calls.convert++; return encodeToon(value); }, decodeToon: (value: string, options?: { legacyDataRootArray?: boolean }) => { calls.convert++; return decodeToon(value, options); } };
        if (name.startsWith("gpt-tokenizer")) return { countTokens: (value: string) => { calls.token++; return realTokenizer.countTokens(value); } };
        if (name === "@huggingface/transformers") return { env: { backends: { onnx: { wasm: {} } } }, pipeline: async () => { calls.model++; await new Promise<void>((resolve) => { modelDone = resolve; }); return async (values: string[]) => { calls.embed++; return { tolist: () => values.map(embedding) }; }; } };
        throw new Error(`Unexpected dependency ${name}`);
    };
    const source = readFileSync(`src/app/tools/${id}/page.tsx`, "utf8");
    const compiledModule = { exports: {} as { default: () => unknown; helpers: Record<string, (...args: any[]) => any> } };
    const helpers: Record<string, string[]> = { "jsonl-validator": ["validateOpenAI", "validateAnthropic", "validateGemini", "validateMistral"], "agent-manifest-generator": ["buildMcpConfig", "validateMcp", "buildAgentCard"], "toon-converter": ["convert", "objectToXml"], "rag-search": ["chunkText", "cosineSimilarity"] };
    const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    class BrowserParser {
        parseFromString(source: string, mime: string) {
            const issues: string[] = [];
            const Parser = require("@xmldom/xmldom").DOMParser;
            const doc = new Parser({ errorHandler: { warning: (value: string) => issues.push(value), error: (value: string) => issues.push(value), fatalError: (value: string) => { throw new Error(value); } } }).parseFromString(source, mime);
            Object.defineProperty(doc, "querySelector", { value: (selector: string) => { assert.equal(selector, "parsererror"); return issues.length ? { textContent: issues.join("\n") } : null; } });
            const visit = (element: any) => { if (!element) return; const children = Array.from(element.childNodes ?? []).filter((child: any) => child.nodeType === 1); Object.defineProperty(element, "children", { value: children }); children.forEach(visit); };
            visit(doc.documentElement); return doc;
        }
    }
    runInNewContext(compiled + `\nmodule.exports.helpers = {${(helpers[id] ?? []).join(",")}};`, { module: compiledModule, exports: compiledModule.exports, require: dependencies, console, URL, performance, DOMParser: BrowserParser, Node: { TEXT_NODE: 3 }, navigator: {}, window: { location: { href: "http://localhost:3100" } }, Error, TextEncoder, TextDecoder });
    let view: ReturnType<typeof render>;
    function render(locale: Language = language): { nodes: Node[]; text: string; find: (type: string, predicate?: (props: Record<string, any>) => boolean) => Node; t: (value: string) => string } {
        language = locale; let nodes: Node[] = [], texts: string[] = [];
        function walk(value: unknown, path: string) {
            if (value == null || typeof value === "boolean") return;
            if (typeof value === "string" || typeof value === "number") { texts.push(String(value)); return; }
            if (Array.isArray(value)) { value.forEach((item, index) => walk(item, `${path}/${index}`)); return; }
            const node = value as Node;
            if (typeof node.type === "function") { const before = scope, oldCursor = cursor; scope = path; cursor = 0; walk(node.type(node.props), `${path}/render`); scope = before; cursor = oldCursor; return; }
            if (!node.props) return; nodes.push(node);
            for (const prop of ["title", "description", "extra"]) if (node.props[prop]) walk(node.props[prop], `${path}/${prop}`);
            if (node.type === "Tabs") for (const item of node.props.items ?? []) { walk(item.label, `${path}/${item.key}/label`); walk(item.children, `${path}/${item.key}/children`); }
            walk(node.props.children, `${path}/children`);
        }
        for (let attempt = 0; attempt < 10; attempt++) { dirty = false; nodes = []; texts = []; scope = "root"; cursor = 0; walk(compiledModule.exports.default(), "root/tree"); pending.splice(0).forEach((effect) => effect()); if (!dirty) break; assert.ok(attempt < 9, `${id} did not settle`); }
        view = { nodes, text: texts.join(" "), t: (value) => tr(language, value), find: (type, predicate = () => true) => { const result = nodes.find((node) => node.type === type && predicate(node.props)); assert.ok(result, `${id}/${locale}: missing ${type}`); return result; } }; return view;
    }
    return { render, calls, copied, downloads, helpers: compiledModule.exports.helpers, share: () => share?.(), providerDone: (value: number) => providerDone?.(value), modelDone: () => modelDone?.() };
}
async function main() {
const mixed = '  你好 العربية 🌍\n literal {provider}  ';
for (const locale of LANGUAGES.map((item) => item.id)) {
    const token = harness("token-counter"); let view = token.render();
    view.find("TextArea").props.onChange({ target: { value: mixed } }); view = token.render(); await tick(); view = token.render();
    const before = { ...token.calls }; view = token.render(locale);
    assert.equal(view.find("TextArea").props.value, mixed); assert.deepEqual(token.calls, before, "locale reran tokenization");
    assert.equal(view.find("Card", (props) => props.title === view.t("Text")).props.title, view.t("Text"));
    view.find("Password").props.onChange({ target: { value: "PUBLIC_FIXTURE_API_KEY" } }); view = token.render();
    const request = view.find("button", (props) => String(props.children).includes("OpenAI")).props.onClick();
    await tick(); view = token.render(locale === "ar" ? "en" : "ar"); assert.equal(token.calls.provider, 1);
    token.providerDone(17); await request; view = token.render(); assert.ok(view.text.includes("17"));
    assert.equal(JSON.stringify(token.share()).includes("PUBLIC_FIXTURE_API_KEY"), false);

    const jsonl = harness("jsonl-validator"); view = jsonl.render(); await tick();
    view = jsonl.render(); view.find("Select").props.onChange("raw"); view = jsonl.render();
    const source = '\nnull\n\n{"id":9223372036854775807,"text":"你好 🌍"}\nfalse\n';
    view.find("TextArea").props.onChange({ target: { value: source } }); jsonl.render(); await tick(); view = jsonl.render();
    const calls = { ...jsonl.calls }; view = jsonl.render(locale); assert.deepEqual(jsonl.calls, calls);
    const rows = view.find("Table").props.dataSource; assert.deepEqual(Array.from(rows, (r: any) => r.line), [2, 4, 5]);
    const exported = view.find("SendToButton").props.data; assert.ok(exported.includes("9223372036854775807")); assert.ok(exported.includes("null")); assert.equal(JSON.parse(exported).length, 3);
    for (const validator of ["validateOpenAI", "validateAnthropic", "validateMistral"]) assert.ok(jsonl.helpers[validator]({ messages: [null] }).length > 0);
    assert.ok(jsonl.helpers.validateGemini({ contents: [null] }).length > 0);

    const toon = harness("toon-converter"); view = toon.render();
    for (const number of ["9223372036854775807", "0.1234567890123456789", "-0", "1e400"]) {
        const result = toon.helpers.convert(`{"n":${number}}`, "encode", "json", "json"); assert.equal(result.output, ""); assert.match(result.error, /precision|negative zero/);
        const quoted = toon.helpers.convert(`{"n":"${number}"}`, "encode", "json", "json"); assert.equal(quoted.error, null); assert.equal((decodeToon(quoted.output) as { n: string }).n, number);
    }
    const xml = toon.helpers.convert('<__proto__ note="日本語 &amp; العربية"><constructor>🌍</constructor><constructor>42</constructor></__proto__>', "encode", "xml", "xml");
    assert.equal(xml.error, null); assert.deepEqual(JSON.parse(JSON.stringify(decodeToon(xml.output))), { ["__proto__"]: { "@note": "日本語 & العربية", constructor: ["🌍", "42"] } });
    assert.equal(toon.helpers.convert('"invalid name": value', "decode", "json", "xml").output, "");
    const legacy = toon.helpers.convert("data[2]: 1,2", "decode", "json", "json", true); assert.deepEqual(JSON.parse(legacy.output), [1, 2]);
    const original = JSON.stringify({ name: mixed, rows: [{ code: "true", n: "42" }, { code: "null", n: "1e+2" }] });
    view.find("TextArea", (props) => !props.readOnly).props.onChange({ target: { value: original } }); toon.render(); await tick(); view = toon.render();
    const output = view.find("TextArea", (props) => props.readOnly).props.value, count = { ...toon.calls };
    view = toon.render(locale); assert.deepEqual(toon.calls, count); assert.equal(view.find("TextArea", (props) => props.readOnly).props.value, output);
    await view.find("a").props.onClick(); assert.equal(toon.copied.at(-1), output);
    view.find("SwapOutlined").props.onClick(); view = toon.render(); assert.equal(view.find("TextArea", (props) => !props.readOnly).props.value, output); assert.deepEqual(JSON.parse(view.find("TextArea", (props) => props.readOnly).props.value), JSON.parse(original));

    const manifest = harness("agent-manifest-generator"); view = manifest.render(); const inputs = view.nodes.filter((node) => node.type === "Input");
    const name = inputs.find((node) => node.props.value === "My Agent")!; name.props.onChange({ target: { value: mixed } }); view = manifest.render();
    const jsons = view.nodes.filter((node) => node.type === "pre").map((node) => node.props.children); view = manifest.render(locale);
    assert.deepEqual(view.nodes.filter((node) => node.type === "pre").map((node) => node.props.children), jsons);
    view.find("Input", (props) => props.value === '["-y", "@my-org/my-mcp-server"]').props.onChange({ target: { value: "not a JSON array" } });
    view = manifest.render(); assert.ok(view.nodes.some((node) => node.type === "Button" && node.props.disabled === true));
    assert.ok(view.text.includes(view.t("Arguments must be a JSON array of strings")));
    const config = manifest.helpers.buildMcpConfig({ transport: "stdio", serverName: "public", command: "node", args: '["a b","", "日本語"]', env: [{ key: "PUBLIC_KEY", value: mixed }] });
    assert.deepEqual(JSON.parse(JSON.stringify(config)), { mcpServers: { public: { command: "node", args: ["a b", "", "日本語"], env: { PUBLIC_KEY: mixed } } } });
    assert.ok(manifest.helpers.validateMcp({ transport: "stdio", serverName: "x", command: "node", args: "a b", env: [] }).length);

    const rag = harness("rag-search"); view = rag.render(); assert.equal(rag.calls.model, 0);
    const load = view.find("Button", (props) => props.children === view.t("Load model")).props.onClick(); await tick();
    const concurrent = view.find("Button", (props) => props.children === view.t("Load model")).props.onClick(); await tick(); assert.equal(rag.calls.model, 1, "in-flight model load must be shared");
    view = rag.render(locale); assert.equal(rag.calls.model, 1); rag.modelDone(); await Promise.all([load, concurrent]); view = rag.render();
    view.find("TextArea").props.onChange({ target: { value: "A cat is a feline. Boats float on water. " } }); view = rag.render();
    await view.find("Button", (props) => props.children === view.t("Index documents")).props.onClick(); view = rag.render();
    const indexed = { ...rag.calls }; view = rag.render(locale === "ar" ? "en" : "ar"); assert.deepEqual(rag.calls, indexed);
    view.find("Input", (props) => "onPressEnter" in props).props.onChange({ target: { value: "feline" } }); view = rag.render(); await view.find("Button", (props) => props.children === view.t("Search")).props.onClick(); view = rag.render(); assert.ok(view.text.includes("A cat is a feline."));
    const afterSearch = { ...rag.calls }; view = rag.render(locale); assert.deepEqual(rag.calls, afterSearch);
    view.find("TextArea").props.onChange({ target: { value: "New document" } }); view = rag.render(); assert.ok(view.nodes.some((node) => node.type === "Alert" && node.props.title === view.t("Documents or chunk settings changed since the last index — re-index to apply them.")));
    assert.equal(formatAiDiagnostic('invalid JSON: PUBLIC raw 日本語 {count}', (source, values) => tr(locale, source, values)).includes('PUBLIC raw 日本語 {count}'), true);
}
console.log(`Remaining AI localization: ${Object.keys(REMAINING_AI_TRANSLATIONS).length} rows; five actual pages, held provider/model calls, source-preserving JSONL and TOON swap verified in eight languages.`);

}
main().catch((error) => { console.error(error); process.exitCode = 1; });

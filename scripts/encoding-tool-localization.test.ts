import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { ENCODING_TOOL_TRANSLATIONS } from "../src/lib/i18n/encoding-tools";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { SEO_CONTENT } from "../src/lib/seo-content";

const ids = ["url-encoder", "html-entities", "hex-converter", "unicode-converter", "string-escape", "gzip-tools"] as const;
const placeholders = (text: string) => (text.match(/(?<!\\)\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(ENCODING_TOOL_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const [index, language] of LANGUAGES.slice(1).entries()) {
        assert.ok(columns[index].trim(), source);
        assert.deepEqual(placeholders(columns[index]), placeholders(source), `${source}/${language.id}`);
        assert.equal(translate(language.id, source), columns[index], `${source}/${language.id}: catalog registration or conflicting translation`);
    }
}
for (const id of ids) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const covered = (text: string) => assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, text), `${id}: untranslated copy ${text}`);
    const inspect = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && ts.isStringLiteral(node.arguments[0])) covered(node.arguments[0].text);
        if (ts.isJsxText(node) && node.text.trim()) assert.fail(`${id}: untranslated JSX ${node.text}`);
        if (ts.isJsxAttribute(node) && ["title", "description", "placeholder", "aria-label"].includes(node.name.getText(file))) assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `${id}: untranslated attribute`);
        if (ts.isJsxAttribute(node) && node.name.getText(file) === "learnMore") {
            const help = (child: ts.Node) => { if (ts.isStringLiteral(child)) covered(child.text); ts.forEachChild(child, help); };
            help(node);
        }
        if (ts.isPropertyAssignment(node) && ["description", "desc"].includes(node.name.getText(file)) && ts.isStringLiteral(node.initializer)) covered(node.initializer.text);
        if (id === "unicode-converter" && ts.isReturnStatement(node) && node.expression && ts.isStringLiteral(node.expression) && node.expression.text) covered(node.expression.text);
        ts.forEachChild(node, inspect);
    };
    inspect(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction|t\()/, "Locale must not remount inputs");
    assert.doesNotMatch(source, /\bt\((?:input|output|error|msg|err\.message|e\.message)\)/, "Payloads and raw diagnostics are never translated");
    for (const faq of SEO_CONTENT[id]?.faq ?? []) for (const text of [faq.q, faq.a]) covered(text);
}

const require = createRequire(import.meta.url);
const React = require("react") as typeof import("react");
const jsxRuntime = require("react/jsx-runtime");
type Props = {
    [key: string]: unknown;
    children?: unknown; title?: unknown; description?: unknown; extra?: unknown;
    readOnly?: boolean; value?: string; dir?: string;
    options?: { value: string; label: unknown }[];
    columns?: { title: unknown; dataIndex: string; render?: (text: unknown) => unknown }[];
    dataSource?: Record<string, unknown>[];
    onClick?: () => unknown;
    onChange?: (value: unknown) => void;
    learnMore?: Record<string, string | string[]>;
};
type Node = { type: unknown; props: Props };
function harness(id: typeof ids[number], initial: Record<string, unknown> = {}) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    let language: Language = "en", cursor = 0, memoIndex = 0, effectIndex = 0, dirty = false;
    const cells: unknown[] = [], names: string[] = [], memoCells: { value: unknown; deps: unknown[] }[] = [], effectCells: unknown[][] = [];
    const writes: string[] = [], copied: string[] = [], notices: string[] = [], engine = { calls: 0 }, payloads = { shares: 0, accepts: 0 };
    let restore: ((state: Record<string, unknown>) => void) | undefined, pending: (() => void)[] = [];
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const scan = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file)); ts.forEachChild(node, scan); };
    scan(file);
    const same = (a: unknown[] | undefined, b: unknown[]) => !!a && a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
    const component = (name: string) => {
        function Component(props: Props) { return React.createElement(name, props, props.children as import("react").ReactNode); }
        return Component;
    };
    const messages = { success: (value: string) => notices.push(value), error: (value: string) => notices.push(value), warning: (value: string) => notices.push(value) };
    const ui = new Proxy({ App: { useApp: () => ({ message: messages }) }, message: messages, Input: Object.assign(component("Input"), { TextArea: component("TextArea") }), Typography: { Text: component("Text"), Paragraph: component("Paragraph") } }, { get: (target, name: string) => name in target ? target[name as keyof typeof target] : component(name) });
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (fallback: unknown) => { const index = cursor++; if (!(index in cells)) cells[index] = Object.hasOwn(initial, names[index]) ? initial[names[index]] : fallback; return [cells[index], (value: unknown) => { const next = typeof value === "function" ? (value as (old: unknown) => unknown)(cells[index]) : value; if (!Object.is(next, cells[index])) dirty = true; cells[index] = next; writes.push(names[index]); }]; }, useMemo: (compute: () => unknown, deps: unknown[]) => { const index = memoIndex++; if (!same(memoCells[index]?.deps, deps)) { engine.calls++; memoCells[index] = { value: compute(), deps }; } return memoCells[index].value; }, useEffect: (callback: () => void, deps: unknown[]) => { const index = effectIndex++; if (!same(effectCells[index], deps)) { effectCells[index] = deps; pending.push(callback); } } };
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name === "antd") return ui;
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => component("Icon") });
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => translate(language, source, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Props) => React.createElement("Layout", props, ...[props.title, props.description, ...Object.values(props.learnMore ?? {}).flat().map((text) => translate(language, String(text))), props.children] as import("react").ReactNode[]) };
        if (name.endsWith("CodeEditor")) return { CodeEditor: component("CodeEditor") };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string, notice?: string) => { copied.push(value); if (notice) notices.push(notice); return true; } };
        if (name.endsWith("messageService")) return { messageService: messages };
        if (name.endsWith("SendToButton") || name.endsWith("ShareButton") || name.endsWith("ToolBridgeBanner")) return { __esModule: true, default: component(name.split("/").at(-1)!) };
        if (name.endsWith("shareable-state")) return { useShareableState: (_schema: unknown, accept: typeof restore) => { restore = accept; } };
        throw new Error(`Unexpected dependency ${name}`);
    };
    const compiled = { exports: {} as { default: () => unknown } };
    const instrumented = source.replace(/\r\n/g, "\n").replace(/((?:async )?function (?:textToHex|hexToText|encodeHtmlEntities|decodeHtmlEntities|textToUnicodeEscape|unicodeEscapeToText|textToCodePoints|codePointsToText|textToUtf8Hex|utf8HexToText|textToUtf16|utf16ToText|escapeString|unescapeString|compressGzip|decompressGzip)\([^\n]+\{)\n/g, "$1\n    engine.calls++;\n");
    const code = ts.transpileModule(instrumented, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, Error, String, TextEncoder, TextDecoder, Uint8Array, CompressionStream, DecompressionStream, btoa, atob, engine, encodeURIComponent: (text: string) => { engine.calls++; return encodeURIComponent(text); }, decodeURIComponent: (text: string) => { engine.calls++; return decodeURIComponent(text); } });
    const render = (locale: Language) => {
        language = locale;
        let tree: unknown;
        for (let attempt = 0; attempt < 5; attempt++) {
            dirty = false; cursor = 0; memoIndex = 0; effectIndex = 0; pending = [];
            tree = compiled.exports.default(); pending.forEach((effect) => effect());
            if (!dirty) break;
            assert.ok(attempt < 4, "Render did not settle");
        }
        const nodes: Node[] = [], text: string[] = [];
        const walk = (node: unknown) => {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { text.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            const element = node as Node;
            if (typeof element.type === "function") { walk(element.type(element.props)); return; }
            if (element.props) {
                nodes.push(element);
                for (const name of ["title", "description", "extra"]) if (element.props[name] != null) walk(element.props[name]);
                for (const option of element.props.options ?? []) walk(option.label);
                if (element.type === "Table") for (const column of element.props.columns ?? []) { walk(column.title); for (const row of element.props.dataSource ?? []) walk(column.render ? column.render(row[column.dataIndex]) : row[column.dataIndex]); }
                walk(element.props.children);
            }
        };
        walk(tree);
        const find = (type: string, predicate: (props: Props) => boolean = () => true) => { const node = nodes.find((node) => node.type === type && predicate(node.props)); assert.ok(node, `${id}/${locale}: missing ${type}`); return node; };
        return { nodes, text: text.join(" "), find, button: (source: string) => find("Button", (props) => props.children === translate(language, source)).props.onClick!, input: () => find("TextArea", (props) => !props.readOnly), output: () => nodes.find((node) => node.type === "TextArea" && node.props.readOnly), segment: (index: number, value: string) => { const node = nodes.filter((node) => node.type === "Segmented")[index]; assert.ok(node); node.props.onChange!(value); } };
    };
    return { render, writes, copied, notices, engine, payloads, state: () => Object.fromEntries(names.map((name, index) => [name, cells[index]])), restore: (state: Record<string, unknown>) => { assert.ok(restore); restore(state); } };
}

function preserveAcrossLocales(work: ReturnType<typeof harness>) {
    const baseline = work.state(), calls = work.engine.calls, payloads = { ...work.payloads }, copied = work.copied.length, notices = work.notices.length;
    work.writes.length = 0;
    for (const language of LANGUAGES) {
        const view = work.render(language.id);
        assert.deepEqual(work.state(), baseline, "Language changed inputs, mode, settings, result or error state");
        assert.equal(work.engine.calls, calls, "Language reran conversion or compression");
        assert.deepEqual(work.payloads, payloads, "Language accepted or shared a payload");
        assert.equal(work.copied.length, copied, "Language copied a payload");
        assert.equal(work.notices.length, notices, "Language replayed a notice");
        assert.equal(view.input().props["aria-label"], translate(language.id, "Input"));
        if (view.output()) assert.equal(view.output()!.props["aria-label"], translate(language.id, "Output"));
    }
    assert.deepEqual(work.writes, [], "Language called a state setter");
}

async function main() {
for (const language of LANGUAGES) for (const id of ids) {
    const work = harness(id);
    let view = work.render(language.id);
    assert.ok(view.input().props.value !== undefined);
    preserveAcrossLocales(work);
    view = work.render(language.id);
    const edit = (value: string) => { view.input().props.onChange!({ target: { value } }); view = work.render(language.id); };
    const click = async (label: string) => { await view.button(label)(); view = work.render(language.id); };
    if (id === "url-encoder") {
        edit("https://example.com/?q=你好 & café"); await click("Encode");
        assert.equal(view.output()!.props.value, encodeURIComponent(String(view.input().props.value)));
        await click("Copy"); assert.equal(work.copied.at(-1), view.output()!.props.value);
        const shared = view.find("ShareButton").props.getState as () => unknown; work.payloads.shares++;
        assert.deepEqual(JSON.parse(JSON.stringify(shared())), { input: "https://example.com/?q=你好 & café", mode: "Encode" });
        work.restore({ input: "caf%C3%A9%20%26%20%E4%BD%A0%E5%A5%BD", mode: "Decode" }); view = work.render(language.id);
        assert.equal(view.output()!.props.value, "café & 你好");
        const accept = view.find("ToolBridgeBanner").props.onAccept as (payload: { data: string }) => void; work.payloads.accepts++; accept({ data: "%3Ctag%3E" }); view = work.render(language.id);
        assert.equal(view.output()!.props.value, "<tag>");
        edit("%Q0"); await click("Decode"); assert.ok(work.notices.at(-1)!.startsWith(translate(language.id, "Invalid URL input. Check percent escapes and try again.") + "\n"));
        preserveAcrossLocales(work); view = work.render(language.id); await click("Clear"); assert.equal(view.input().props.value, ""); assert.equal(view.output()!.props.value, "");
    } else if (id === "html-entities") {
        edit('<b title="café">🌍&</b>'); assert.ok(view.output()!.props.value!.includes("&lt;b"));
        assert.equal(view.output()!.props.dir, "ltr");
        view.segment(1, "numeric"); view = work.render(language.id); assert.ok(view.output()!.props.value!.includes("&#233;")); assert.ok(view.output()!.props.value!.includes("&#127757;"));
        await click("Copy"); assert.equal(work.copied.at(-1), view.output()!.props.value);
        await click("Swap"); assert.equal(view.input().props.dir, "ltr"); assert.equal(view.output()!.props.value, '<b title="café">🌍&</b>');
        work.restore({ input: "&copy; &amp; &#169;", mode: "decode", encodeType: "named" }); view = work.render(language.id); assert.equal(view.output()!.props.value, "© & ©");
        const accept = view.find("ToolBridgeBanner").props.onAccept as (payload: { data: string }) => void; work.payloads.accepts++; accept({ data: "&lt;source&gt;" }); view = work.render(language.id); assert.equal(view.output()!.props.value, "<source>");
        assert.ok(view.text.includes(translate(language.id, "Ampersand")));
        assert.ok(view.text.includes(translate(language.id, "HTML entities are special codes used to display reserved characters in HTML, or characters that are not present on your keyboard.")));
        preserveAcrossLocales(work);
        view = work.render(language.id); edit(""); assert.equal(view.output()!.props.value, "");
    } else if (id === "hex-converter") {
        edit("café 你好 🌍"); assert.equal(view.output()!.props.value, Buffer.from("café 你好 🌍").toString("hex"));
        const formats = view.find("Select").props.options!;
        assert.deepEqual(Array.from(formats, (option) => option.value), ["lowercase", "UPPERCASE", "spaced", "0xPrefix", "\\xPrefix"]);
        view.find("Select").props.onChange!("0xPrefix"); view = work.render(language.id); assert.ok(view.output()!.props.value!.startsWith("0x63 0x61"));
        await click("Copy"); assert.equal(work.copied.at(-1), view.output()!.props.value);
        await click("Swap"); assert.equal(view.output()!.props.value, "café 你好 🌍");
        edit("f"); assert.equal(view.output()!.props.value, ""); assert.ok(work.notices.at(-1)!.startsWith(translate(language.id, "Unable to convert hex. Check that each byte has two hex digits, then try again.") + "\n"));
        preserveAcrossLocales(work); view = work.render(language.id); await click("Clear"); assert.equal(view.input().props.value, "");
    } else if (id === "unicode-converter") {
        edit("A你好🌍"); assert.equal(view.output()!.props.value, "\\u0041\\u4F60\\u597D\\u{1F30D}");
        assert.deepEqual(Array.from(view.nodes.filter((node) => node.type === "Segmented")[1].props.options!, (option) => option.value), ["escape", "codepoints", "utf8hex", "utf16"]);
        await click("Copy"); assert.equal(work.copied.at(-1), view.output()!.props.value);
        view.segment(1, "utf16"); view = work.render(language.id); assert.equal(view.output()!.props.value, "0041 4F60 597D D83C DF0D");
        preserveAcrossLocales(work); view = work.render(language.id);
        await click("Swap"); assert.equal(view.output()!.props.value, "A你好🌍");
        view.segment(1, "codepoints"); view = work.render(language.id); edit("U+0041 U+4F60 U+597D U+1F30D"); assert.equal(view.output()!.props.value, "A你好🌍");
        edit("U+110000"); assert.equal(view.output()!.props.value, ""); assert.ok(view.text.includes(translate(language.id, "Invalid Unicode input. Check the selected format and code point range, then try again.")));
        assert.ok(view.nodes.some((node) => node.type === "pre" && node.props.dir === "ltr" && String(node.props.children).includes("1114112")));
        preserveAcrossLocales(work); view = work.render(language.id); edit(""); assert.equal(view.output()!.props.value, ""); assert.ok(!view.nodes.some((node) => node.type === "Alert"));
    } else if (id === "string-escape") {
        edit('你好 "café"\n<tag>&'); assert.equal(view.output()!.props.value, JSON.stringify('你好 "café"\n<tag>&').slice(1, -1));
        assert.deepEqual(Array.from(view.find("Select").props.options!, (option) => option.value), ["json", "xml", "html", "javascript", "sql", "csv", "java"]);
        await click("Copy"); assert.equal(work.copied.at(-1), view.output()!.props.value);
        await click("Swap & Toggle"); assert.equal(view.output()!.props.value, '你好 "café"\n<tag>&');
        view.find("Select").props.onChange!("sql"); view = work.render(language.id); view.segment(0, "escape"); view = work.render(language.id); edit("O'Reilly"); assert.equal(view.output()!.props.value, "O''Reilly");
        preserveAcrossLocales(work); view = work.render(language.id); edit(""); assert.equal(view.output()!.props.value, "");
    } else {
        await click("Compress"); assert.equal(work.notices.at(-1), translate(language.id, "Please enter some content")); assert.equal(work.engine.calls, 0);
        await click("Load Sample"); const fixture = String(view.input().props.value); assert.ok(fixture.startsWith("Lorem ipsum"));
        await click("Compress"); assert.ok(view.output()!.props.value!.startsWith("H4sI")); assert.equal(work.state().loading, false); assert.ok(work.state().stats);
        await click("Copy"); assert.equal(work.copied.at(-1), view.output()!.props.value);
        preserveAcrossLocales(work); view = work.render(language.id); await click("Swap"); await click("Decompress"); assert.equal(view.output()!.props.value, fixture);
        edit("?"); await click("Decompress"); assert.ok(view.text.includes(translate(language.id, "Unable to process Gzip. Check the input and browser compression support, then try again.")));
        assert.ok(view.nodes.some((node) => node.type === "pre" && node.props.dir === "ltr" && String(node.props.children).length > 0));
        preserveAcrossLocales(work);
    }
}
console.log("Encoding localization: eight languages, six pages, authored help/reference copy, exact UTF-8 fixtures/clipboard, real edit/mode/options/swap/clear/share/bridge/compress callbacks, guards, raw diagnostics and state-preserving locale changes pass.");

}
main().catch((error) => { console.error(error); process.exitCode = 1; });

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const require = createRequire(`${process.cwd()}/package.json`);
const { LANGUAGES, translate, SHARED_TRANSLATIONS } = require(`${process.cwd()}/src/lib/i18n/catalog.ts`) as typeof import("../src/lib/i18n/catalog");
const base = process.env.MYDEVTOOLS_TEXT_STAGE || process.cwd();
const { TEXT_TOOL_TRANSLATIONS } = require(`${base}/src/lib/i18n/text-tools.ts`) as { TEXT_TOOL_TRANSLATIONS: Record<string, readonly string[]> };
type Language = "en" | "hi" | "es" | "fr" | "de" | "ja" | "zh" | "ar";
const tr = (language: Language, source: string, values?: Record<string, string | number>): string => {
    const index = LANGUAGES.findIndex((item) => item.id === language) - 1;
    const text = index < 0 ? source : TEXT_TOOL_TRANSLATIONS[source]?.[index] ?? translate(language, source);
    return text.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (whole, key: string) => values?.[key] === undefined ? whole : String(values[key]));
};
const ids = ["case-converter", "text-tools", "markdown-preview", "rich-text-editor", "mermaid-viewer", "mermaid-formatter"];
for (const [source, row] of Object.entries(TEXT_TOOL_TRANSLATIONS)) {
    assert.equal(row.length, 7, source);
    for (const [index, value] of row.entries()) {
        assert.ok(value.trim()); assert.deepEqual(value.match(/\{\w+\}/g) ?? [], source.match(/\{\w+\}/g) ?? [], source);
        if (!process.env.MYDEVTOOLS_TEXT_STAGE) assert.equal(translate(LANGUAGES[index + 1].id, source), value, `Catalog: ${source}`);
    }
}
const requireCopy = (value: string) => {
    assert.ok(TEXT_TOOL_TRANSLATIONS[value] || SHARED_TRANSLATIONS[value], `Missing authored copy: ${value}`);
};
for (const id of ids) {
    const source = readFileSync(`${base}/src/app/tools/${id}/page.tsx`, "utf8"), ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const inspect = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) requireCopy(node.text);
        if (ts.isConditionalExpression(node)) { inspect(node.whenTrue); inspect(node.whenFalse); }
        if (ts.isArrayLiteralExpression(node)) node.elements.forEach(inspect);
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.equal(node.text.trim(), "·", `Untranslated ${id}: ${node.text}`);
        if (ts.isCallExpression(node) && ["t", "translationRef.current", "initialTranslate.current"].includes(node.expression.getText(ast)) && node.arguments[0]) inspect(node.arguments[0]);
        if (ts.isPropertyAssignment(node) && ["whatIs", "whyUse", "tips", "howToUse", "useCases", "desc"].includes(node.name.getText(ast).replaceAll('"', ""))) inspect(node.initializer);
        ts.forEachChild(node, visit);
    }; visit(ast);
    assert.match(source, /useLanguage\(\)/); assert.doesNotMatch(source, /key=\{(?:language|direction|locale)\}/);
    assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest)\s*\(/);
}

// Stateful render/handler harness. Mermaid is a controlled engine boundary double;
// Markdown conversion and HTML sanitization use their installed, real libraries.
type Element = { type: unknown; props: Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any
function nodes(value: unknown): Element[] {
    if (Array.isArray(value)) return value.flatMap(nodes);
    if (!value || typeof value !== "object") return [];
    if (!("props" in value)) return Object.values(value).flatMap(nodes);
    const element = value as Element; return [element, ...Object.values(element.props).flatMap(nodes)];
}
const visible = (value: unknown): string => typeof value === "string" || typeof value === "number" ? String(value) : Array.isArray(value) ? value.map(visible).join(" ") : value && typeof value === "object" && "props" in value ? visible((value as Element).props.children) : "";
const depsEqual = (left: unknown[], right: unknown[]) => left.length === right.length && left.every((value, index) => Object.is(value, right[index]));
function harness(id: string) {
    let language: Language = "en", cursor = 0, dirty = false;
    const hooks: unknown[] = [], pending: (() => void)[] = [], copies: string[] = [], notices: string[] = [], downloads: { content: string; name: string; mime: string }[] = [], store = new Map<string, string>();
    const activity = { memos: 0, parses: 0, renders: 0, writes: 0, dom: 0 }, configurations: Record<string, unknown>[] = [];
    let shared: ((value: Record<string, unknown>) => void) | undefined;
    const deferred: (() => void)[] = [];
    let hold = false, fail: string | undefined;
    const react = {
        useState(initial: unknown) { const index = cursor++; if (!(index in hooks)) hooks[index] = typeof initial === "function" ? (initial as () => unknown)() : initial; return [hooks[index], (next: unknown) => { const value = typeof next === "function" ? (next as (value: unknown) => unknown)(hooks[index]) : next; if (!Object.is(value, hooks[index])) { hooks[index] = value; dirty = true; } }]; },
        useMemo(compute: () => unknown, deps: unknown[]) { const index = cursor++, before = hooks[index] as { value: unknown; deps: unknown[] } | undefined; if (!before || !depsEqual(before.deps, deps)) { activity.memos++; hooks[index] = { value: compute(), deps }; } return (hooks[index] as { value: unknown }).value; },
        useCallback(callback: unknown, deps: unknown[]) { return react.useMemo(() => callback, deps); },
        useRef(initial: unknown) { const index = cursor++; if (!(index in hooks)) hooks[index] = { current: initial }; return hooks[index]; },
        useEffect(effect: () => void, deps: unknown[]) { const index = cursor++, before = hooks[index] as unknown[] | undefined; if (!before || !depsEqual(before, deps)) { hooks[index] = deps; pending.push(effect); } },
        memo: (component: unknown) => component,
        Suspense: "Suspense",
    };
    const mermaid = {
        initialize: (config: Record<string, unknown>) => configurations.push(config),
        parse: async (_source: string) => { activity.parses++; assert.equal(typeof _source, "string"); if (hold) await new Promise<void>((resolve) => { deferred.push(resolve); }); if (fail) throw new Error(fail); return true; },
        render: async (_id: string, source: string) => { activity.renders++; if (hold) await new Promise<void>((resolve) => { deferred.push(resolve); }); if (fail) throw new Error(fail); return { svg: `<svg xmlns="http://www.w3.org/2000/svg"><text>${source.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</text></svg>` }; },
    };
    const component = (name: string) => name;
    const input = Object.assign((props: Record<string, unknown>) => ({ type: "Input", props }), { TextArea: "TextArea" });
    const typography = { Text: "Text", Title: "Title" };
    class DOMParser {
        parseFromString(source: string) {
            activity.dom++;
            const { createDocument } = require("@mixmark-io/domino"); const document = createDocument(source);
            for (const element of Array.from(document.querySelectorAll("*")) as { remove?: () => void; parentNode: { removeChild: (node: unknown) => void } }[]) if (!element.remove) Object.defineProperty(element, "remove", { value: () => element.parentNode?.removeChild(element) });
            return document;
        }
    }
    const dependencies = (name: string): unknown => {
        if (name === "react") return react;
        if (name === "next/dynamic") return { __esModule: true, default: () => "MarkdownRenderer" };
        if (name === "mermaid") return { __esModule: true, default: mermaid };
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => { const active = language; return { language: active, t: (source: string, values?: Record<string, string | number>) => tr(active, source, values) }; } };
        if (name.endsWith("project-storage")) return { projectStorage: { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => { activity.writes++; store.set(key, value); } } };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copies.push(value); return true; } };
        if (name.endsWith("download")) return { downloadText: (content: string, name: string, mime: string) => downloads.push({ content, name, mime }) };
        if (name.endsWith("html-markdown")) return require(`${process.cwd()}/src/lib/html-markdown.ts`);
        if (name.endsWith("shareable-state")) return { useShareableState: (_schema: unknown, callback: typeof shared) => { shared = callback; } };
        if (name === "antd") return new Proxy({ App: { useApp: () => ({ message: { success: (text: string) => notices.push(text), error: (text: string) => notices.push(text) } }) }, Typography: typography, Input: input, Space: Object.assign((props: Record<string, unknown>) => ({ type: "Space", props }), { Compact: "Compact" }) }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name === "@ant-design/icons") return new Proxy({}, { get: (_target, key) => component(String(key)) });
        if (name.endsWith("CodeEditor")) return { CodeEditor: "CodeEditor" };
        if (name.startsWith("@/components/")) return { __esModule: true, default: name.split("/").at(-1) };
        return require(name);
    };
    const record = { exports: {} as { default: () => Element } }, source = readFileSync(`${base}/src/app/tools/${id}/page.tsx`, "utf8");
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(compiled, { module: record, exports: record.exports, require: dependencies, DOMParser, window: { getSelection: () => null }, document: { addEventListener: () => {}, removeEventListener: () => {} }, Error, Date, URL, Blob, console, setTimeout: (callback: () => void) => callback() });
    const render = () => { let tree: Element; let pass = 0; do { cursor = 0; dirty = false; tree = record.exports.default(); while (pending.length) pending.shift()!(); assert.ok(++pass < 8, "Settled render"); } while (dirty); return tree!; };
    return { render, language: (value: Language) => { language = value; }, copies, notices, downloads, activity, configurations, store, share: (value: Record<string, unknown>) => shared?.(value), hold: () => { hold = true; }, resume: () => { hold = false; for (const resolve of deferred.splice(0)) resolve(); }, fail: (message?: string) => { fail = message; } };
}
const byType = (tree: Element, type: string) => nodes(tree).filter((node) => node.type === type || typeof node.type === "function" && node.type.name === type);
const findButton = (h: ReturnType<typeof harness>, source: string, language: Language) => { const button = byType(h.render(), "Button").find((node) => visible(node.props.children).trim() === tr(language, source)); assert.ok(button, source); return button; };
const settle = async () => { for (let i = 0; i < 12; i++) await new Promise((resolve) => setImmediate(resolve)); };
function stableAcrossLocales(h: ReturnType<typeof harness>, snapshot: () => unknown) {
    const before = JSON.stringify(snapshot()), activity = { ...h.activity };
    for (const language of LANGUAGES) { h.language(language.id); h.render(); assert.equal(JSON.stringify(snapshot()), before, `State remains exact: ${language.id}`); assert.deepEqual(h.activity, activity, `Locale has no engine/storage side effect: ${language.id}`); }
}
async function main() {
    const cases = harness("case-converter"); cases.render(); cases.share({ input: "helloWorld 日本語 العربية 😀\nHTTP_response", targetCase: "snake_case" }); let tree = cases.render();
    await findButton(cases, "Copy Result", "en").props.onClick(); assert.equal(cases.copies.at(-1), "hello_world_日本語_العربية_😀\nhttp_response");
    stableAcrossLocales(cases, () => ({ text: byType(cases.render(), "TextArea")[0].props.value, selected: byType(cases.render(), "Select")[0].props.value, share: nodes(cases.render()).find((node) => node.type === "ShareButton")?.props.getState() }));
    for (const language of LANGUAGES) { cases.language(language.id); await findButton(cases, "Copy Result", language.id).props.onClick(); assert.equal(cases.copies.at(-1), "hello_world_日本語_العربية_😀\nhttp_response"); }

    const text = harness("text-tools"); tree = text.render(); byType(tree, "TextArea")[0].props.onChange({ target: { value: " b \n日本語\n b \n\nالعربية 😀" } });
    findButton(text, "Unique & Clean", "en").props.onClick(); tree = text.render(); assert.equal(byType(tree, "TextArea")[1].props.value, "b\n日本語\nالعربية 😀");
    stableAcrossLocales(text, () => byType(text.render(), "TextArea").map((node) => node.props.value));
    for (const language of LANGUAGES) { text.language(language.id); await findButton(text, "Copy", language.id).props.onClick(); assert.equal(text.copies.at(-1), "b\n日本語\nالعربية 😀"); }

    const markdown = harness("markdown-preview"); markdown.render(); const document = '# 日本語 العربية 😀\n\n```html\n<script>publicFixture()</script>\n```\n\n<script>publicFixture()</script>\n\n[unsafe](javascript:publicFixture())'; markdown.share({ markdown: document }); markdown.render();
    stableAcrossLocales(markdown, () => nodes(markdown.render()).find((node) => node.type === "ShareButton")!.props.getState());
    for (const language of LANGUAGES) { markdown.language(language.id); await findButton(markdown, "Copy Markdown", language.id).props.onClick(); assert.equal(markdown.copies.at(-1), document); await findButton(markdown, "Download .md", language.id).props.onClick(); assert.equal(markdown.downloads.at(-1)?.content, document); await findButton(markdown, "Download .html", language.id).props.onClick(); const exported = markdown.downloads.at(-1)!; assert.equal(exported.name, "document.html"); const { createDocument } = require("@mixmark-io/domino"); const parsed = createDocument(exported.content); assert.equal(parsed.querySelectorAll("script").length, 0); assert.equal(parsed.querySelectorAll('a[href^="javascript:"]').length, 0); assert.ok(parsed.querySelector("code").textContent.includes("<script>publicFixture()</script>")); }

    const rich = harness("rich-text-editor"); tree = rich.render(); const tabs = byType(tree, "Tabs")[0]; const docId = tabs.props.activeKey; const label = tabs.props.items[0].label; label.props.onDoubleClick({ stopPropagation() {} }); tree = rich.render(); const rename = nodes(tree).find((node) => node.props["aria-label"] === "Document name")!; const maliciousTitle = '</title><script>publicFixture()</script>日本語 العربية 😀'; rename.props.onChange({ target: { value: maliciousTitle } }); tree = rich.render(); nodes(tree).find((node) => node.props["aria-label"] === "Document name")!.props.onPressEnter(); rich.render();
    findButton(rich, "Source", "en").props.onClick(); tree = rich.render(); const source = byType(tree, "TextArea")[0]; source.props.onChange({ target: { value: '<p>日本語 العربية 😀 &amp; safe</p><script>publicFixture()</script><img src="x" onerror="publicFixture()"><a href="javascript:publicFixture()">link</a>' } }); rich.render();
    const persisted = () => [...rich.store.values()]; stableAcrossLocales(rich, persisted);
    for (const language of LANGUAGES) { rich.language(language.id); tree = rich.render(); const menu = byType(tree, "Dropdown")[0].props.menu; menu.onClick({ key: "html" }); const exported = rich.downloads.at(-1)!; const { createDocument } = require("@mixmark-io/domino"); const parsed = createDocument(exported.content); assert.equal(parsed.title, maliciousTitle); assert.equal(parsed.querySelectorAll("script, [onerror], a[href^='javascript:']").length, 0); assert.equal(exported.name, `${maliciousTitle}.html`); assert.ok(parsed.body.textContent.includes("日本語 العربية 😀")); menu.onClick({ key: "txt" }); assert.equal(rich.downloads.at(-1)?.name, `${maliciousTitle}.txt`); assert.ok(rich.downloads.at(-1)?.content.includes("日本語 العربية 😀")); }
    assert.ok(docId);

    for (const id of ["mermaid-viewer", "mermaid-formatter"]) {
        const h = harness(id); h.render(); await settle(); h.render(); const code = 'graph TD\n A["日本語 العربية 😀 <script>publicFixture()</script>"] --> B[Done]';
        h.share(id === "mermaid-viewer" ? { input: code, theme: "forest" } : { input: code, mode: "View" }); h.render(); await settle(); h.render();
        stableAcrossLocales(h, () => nodes(h.render()).find((node) => node.type === "ShareButton")!.props.getState());
        assert.ok(h.configurations.length > 0); assert.ok(h.configurations.every((config) => config.securityLevel === "strict"));
        for (const language of LANGUAGES) { h.language(language.id); const frame = byType(h.render(), "iframe")[0]; assert.ok(frame); assert.equal(frame.props.sandbox, ""); assert.equal(frame.props.referrerPolicy, "no-referrer"); assert.equal(frame.props.title, tr(language.id, "Mermaid diagram preview")); assert.ok(frame.props.srcDoc.includes("日本語 العربية 😀")); }
        if (id === "mermaid-formatter") {
            for (const language of LANGUAGES) {
                h.language(language.id); byType(h.render(), "Segmented")[0].props.onChange("Format"); h.render(); await settle();
                const expected = code.split("\n").map(line => `  ${line.trim()}`).join("\n");
                assert.equal(byType(h.render(), "CodeEditor")[1].props.value, expected);
                await findButton(h, "Copy", language.id).props.onClick(); assert.equal(h.copies.at(-1), expected);
                byType(h.render(), "Segmented")[0].props.onChange("Validate"); h.render(); await settle();
                assert.equal(h.notices.at(-1), tr(language.id, "Valid Mermaid!"));
            }
            byType(h.render(), "Segmented")[0].props.onChange("View"); h.render(); await settle(); h.render();
        } else {
            const svg = byType(h.render(), "iframe")[0].props.srcDoc;
            for (const language of LANGUAGES) { h.language(language.id); await findButton(h, "Copy", language.id).props.onClick(); assert.equal(h.copies.at(-1), svg); }
        }
        // An in-flight parse/render completes after a language change, without a locale-triggered rerun.
        h.language("en"); h.fail("RAW_DIAGNOSTIC 日本語 العربية 42"); h.hold(); const editor = byType(h.render(), "CodeEditor")[0]; editor.props.onChange(`${code}\n C[Next]`); h.render(); await settle(); const started = { ...h.activity }; h.language("ar"); h.render(); assert.deepEqual(h.activity, started); h.resume(); await settle(); h.render(); assert.equal(h.activity.parses, started.parses); assert.ok(JSON.stringify(h.render()).includes("RAW_DIAGNOSTIC 日本語 العربية 42"), `${id}: ${JSON.stringify(h.render()).slice(-2000)}`);
    }
    console.log(`Text/productivity localization: ${Object.keys(TEXT_TOOL_TRANSLATIONS).length} rows, 6 pages, all 8 languages, real callbacks/export sanitization, persistent state and strict sandboxed Mermaid boundary checks passed.`);
}
main().catch((cause) => { console.error(cause); process.exitCode = 1; });

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { FORMATTER_TRANSLATIONS } from "../src/lib/i18n/formatters";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { SEO_CONTENT } from "../src/lib/seo-content";
import { parseYamlForFormatting } from "../src/lib/yaml-formatting";

const ids = ["css", "html", "js", "xml", "yaml"] as const;
const paths = ids.map((id) => `src/app/tools/${id}-formatter/page.tsx`);
const placeholders = (text: string) => (text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(FORMATTER_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const [index, language] of LANGUAGES.slice(1).entries()) {
        assert.ok(columns[index].trim(), source);
        assert.deepEqual(placeholders(columns[index]), placeholders(source), `${source}/${language.id}`);
        assert.equal(translate(language.id, source), columns[index], `${source}/${language.id}: missing catalog registration or conflicting translation`);
    }
}
for (const path of paths) {
    const source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const checkCopy = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, node.text), `${path}: missing ${node.text}`);
        else if (ts.isConditionalExpression(node)) { checkCopy(node.whenTrue); checkCopy(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t") checkCopy(node.arguments[0]);
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(["·"].includes(node.text.trim()), `${path}: unlocalized JSX ${node.text}`);
        if (ts.isJsxAttribute(node) && ["title", "description", "aria-label", "ariaLabel"].includes(node.name.getText(file))) assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `${path}: unlocalized attribute`);
        if (ts.isJsxAttribute(node) && node.name.getText(file) === "learnMore") {
            const help = (child: ts.Node) => { if (ts.isStringLiteral(child)) checkCopy(child); ts.forEachChild(child, help); };
            help(node);
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction|t\()/, "Language changes must not remount editors");
    assert.doesNotMatch(source, /\bt\((?:input|output|formatted|minified|msg|validState\.error|e\.message|err\.message)\)/, "Do not translate code or raw diagnostics");
}
// The shared layout renders authored FAQs when present. None of these tools has
// one today; any future addition must be translated before this check passes.
for (const id of ids) for (const faq of SEO_CONTENT[`${id}-formatter`]?.faq ?? []) for (const text of [faq.q, faq.a]) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, text), `Untranslated FAQ: ${text}`);

const require = createRequire(import.meta.url);
const React = require("react") as typeof import("react");
const jsxRuntime = require("react/jsx-runtime");
const beautify = require("js-beautify");
const YAML = require("yaml");
type NodeProps = {
    [key: string]: unknown;
    children?: unknown; title?: unknown; extra?: unknown; readOnly?: boolean;
    value?: string; language?: string; ariaLabel?: string; dir?: string;
    options?: { value: string; label: string }[];
    onClick?: () => unknown; onChange?: (value: string) => void;
    learnMore?: Record<string, string | string[]>;
};
type Node = { type: unknown; props: NodeProps };
type View = { nodes: Node[]; text: string; button: (source: string, occurrence?: number) => () => unknown; editor: (readOnly?: boolean) => Node };
function harness(id: typeof ids[number], initial: Record<string, unknown> = {}) {
    const path = `src/app/tools/${id}-formatter/page.tsx`;
    let language: Language = "en", cursor = 0, dirty = false;
    const cells: unknown[] = [], memoCells: { value: unknown; deps: unknown[] }[] = [], effectCells: unknown[][] = [];
    const names: string[] = [], writes: string[] = [], copied: string[] = [], notices: string[] = [], engine = { calls: 0 };
    let memoIndex = 0, effectIndex = 0, pending: (() => void)[] = [];
    const source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const scan = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file)); ts.forEachChild(node, scan); };
    scan(file);
    const same = (a: unknown[] | undefined, b: unknown[]) => !!a && a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
    const component = (name: string) => {
        function Component(props: Record<string, unknown>) { return React.createElement(name, props, props.children as import("react").ReactNode); }
        return Component;
    };
    const ui = new Proxy({ App: { useApp: () => ({ message: { success: (value: string) => notices.push(value), error: (value: string) => notices.push(value) } }) }, message: { success: (value: string) => notices.push(value), error: (value: string) => notices.push(value) }, Input: Object.assign(component("Input"), { TextArea: component("TextArea") }), Typography: { Text: component("Text") } }, { get: (target, name: string) => name in target ? target[name as keyof typeof target] : component(name) });
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (fallback: unknown) => { const index = cursor++; if (!(index in cells)) cells[index] = Object.hasOwn(initial, names[index]) ? initial[names[index]] : fallback; return [cells[index], (value: unknown) => { const next = typeof value === "function" ? (value as (old: unknown) => unknown)(cells[index]) : value; if (!Object.is(next, cells[index])) dirty = true; cells[index] = next; writes.push(names[index]); }]; }, useMemo: (compute: () => unknown, deps: unknown[]) => { const index = memoIndex++; if (!same(memoCells[index]?.deps, deps)) memoCells[index] = { value: compute(), deps }; return memoCells[index].value; }, useEffect: (callback: () => void, deps: unknown[]) => { const index = effectIndex++; if (!same(effectCells[index], deps)) { effectCells[index] = deps; pending.push(callback); } } };
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name === "antd") return ui;
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => component("Icon") });
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => translate(language, source, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: NodeProps) => React.createElement("Layout", props, ...[props.title, props.description, ...Object.values(props.learnMore ?? {}).flat().map((text) => translate(language, String(text))), props.children] as import("react").ReactNode[]) };
        if (name.endsWith("CodeEditor")) return { CodeEditor: component("CodeEditor") };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string, notice?: string) => { copied.push(value); if (notice) notices.push(notice); return true; } };
        if (name.endsWith("SendToButton") || name.endsWith("ShareButton") || name.endsWith("ToolBridgeBanner")) return { __esModule: true, default: component(name.split("/").at(-1)!) };
        if (name.endsWith("shareable-state")) return { useShareableState: () => {} };
        if (name === "js-beautify") return { ...beautify, ...Object.fromEntries(["css", "html", "js"].map((name) => [name, (...args: unknown[]) => { engine.calls++; if (String(args[0]).includes("fixture-throw")) throw new Error("RAW parser detail <source> العربية"); return beautify[name](...args); }])) };
        if (name === "yaml") return { ...YAML, parse: (...args: unknown[]) => { engine.calls++; return YAML.parse(...args); }, stringify: (...args: unknown[]) => { engine.calls++; return YAML.stringify(...args); } };
        if (name.endsWith("yaml-formatting")) return { parseYamlForFormatting: (source: string) => { engine.calls++; return parseYamlForFormatting(source); } };
        throw new Error(`Unexpected dependency ${name}`);
    };
    const compiled = { exports: {} as { default: () => unknown } };
    const instrumented = source.replace(/\r\n/g, "\n").replace(/(function (?:formatXml|minifyXml|validateXml)\([^\n]+\{)\n/g, "$1\n    engine.calls++;\n");
    const code = ts.transpileModule(instrumented, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    class TestDOMParser { parseFromString(src: string) { return { querySelector: () => src.includes("fixture-invalid") ? { textContent: "RAW parser detail <source> العربية" } : null }; } }
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, Blob, Math, Error, DOMParser: TestDOMParser, engine });
    const render = (locale: Language): View => {
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
            if (element.props) { nodes.push(element); for (const name of ["title", "extra"]) if (element.props[name] != null) walk(element.props[name]); walk(element.props.children); }
        };
        walk(tree);
        return { nodes, text: text.join(" "), button: (source: string, occurrence = 0) => { const found = nodes.filter((node) => node.type === "Button" && node.props.children === translate(language, source))[occurrence]; assert.ok(found, `${id}/${locale}: button ${source}`); return found.props.onClick!; }, editor: (readOnly = false) => { const found = nodes.find((node) => node.type === "CodeEditor" && !!node.props.readOnly === readOnly); assert.ok(found, `${id}: editor`); return found; } };
    };
    return { render, writes, copied, notices, engine, state: () => Object.fromEntries(names.map((name, index) => [name, cells[index]])) };
}

for (const language of LANGUAGES) for (const id of ids) {
    const work = harness(id);
    let view = work.render(language.id);
    const input = view.editor().props.value;
    assert.ok(input && !String(input).includes('{t('), "Fixture source must remain exact code");
    assert.ok(view.text.includes(translate(language.id, `${id === "js" ? "JavaScript" : id.toUpperCase()} Formatter`)));
    assert.ok(view.editor().props.ariaLabel, "Input editor has a translated accessible name");
    // Exercise actual editing/option callbacks before checking locale changes,
    // so preserving only default fixtures is insufficient.
    view.editor().props.onChange!(String(input) + "\n");
    view = work.render(language.id);
    const indentControl = view.nodes.find((node) => node.type === "InputNumber");
    if (indentControl) {
        (indentControl.props.onChange as unknown as (value: number) => void)(4);
        view = work.render(language.id);
        assert.equal(work.state()[id === "yaml" ? "indent" : "indentSize"], 4);
    }
    assert.ok(work.engine.calls > 0, `${id}: real formatter/parser was not invoked`);
    const baseline = work.state(), calls = work.engine.calls;
    const editors = view.nodes.filter((node) => node.type === "CodeEditor").map((node) => ({ value: node.props.value, language: node.props.language, readOnly: node.props.readOnly }));
    work.writes.length = 0;
    for (const locale of LANGUAGES) {
        view = work.render(locale.id);
        assert.deepEqual(work.state(), baseline, `${id}: language changed input/options/output/validation`);
        assert.equal(work.engine.calls, calls, `${id}: language change reran formatter/parser`);
        assert.deepEqual(view.nodes.filter((node) => node.type === "CodeEditor").map((node) => ({ value: node.props.value, language: node.props.language, readOnly: node.props.readOnly })), editors, `${id}: editor source/output changed`);
    }
    assert.deepEqual(work.writes, [], `${id}: language switch called a state setter`);
    view = work.render(language.id);
    if (["css", "html", "js"].includes(id)) {
        view.button("Copy")();
        assert.equal(work.copied.at(-1), view.editor(true).props.value);
        view.button("Copy", 1)();
        assert.equal(work.copied.at(-1), view.nodes.find((node) => node.type === "TextArea")!.props.value);
        if (id === "html") { const expected = view.editor(true).props.value; view.button("Apply")(); view = work.render(language.id); assert.equal(view.editor().props.value, expected); assert.equal(work.notices.at(-1), translate(language.id, "Applied formatted HTML to input")); }
        if (id === "js") assert.deepEqual(Array.from(view.nodes.find((node) => node.type === "Select")!.props.options!, (option) => option.value), ["collapse", "expand", "end-expand"]);
        const broken = harness(id, { input: "fixture-throw" });
        const failed = broken.render(language.id);
        assert.ok(failed.editor(true).props.value!.includes("RAW parser detail <source> العربية"));
        assert.ok(failed.text.includes(translate(language.id, "If formatting fails, check the source syntax and options. Parser details are shown unchanged.")));
    } else {
        const options = view.nodes.find((node) => node.type === "Segmented")!;
        assert.deepEqual(Array.from(options.props.options!, (option) => option.value), id === "xml" ? ["Prettify", "Minify", "Validate"] : ["Format", "Minify", "Validate"]);
        options.props.onChange!("Minify"); view = work.render(language.id);
        const result = view.editor(true).props.value;
        assert.ok(result);
        view.button("Copy")(); assert.equal(work.copied.at(-1), result);
        view.nodes.find((node) => node.type === "Segmented")!.props.onChange!("Validate"); view = work.render(language.id);
        assert.ok(view.text.includes(translate(language.id, `${id.toUpperCase()} is valid!`)));
        view.editor().props.onChange!(id === "xml" ? "<fixture-invalid>" : "list: [unfinished"); view = work.render(language.id);
        assert.ok(view.text.includes(translate(language.id, `${id.toUpperCase()} is invalid`)));
        if (id === "xml") {
            assert.ok(view.text.includes(translate(language.id, "Invalid XML. Check matching tags and syntax, then try again.")));
            assert.ok(view.nodes.some((node) => node.type === "pre" && node.props.dir === "ltr" && node.props.children === "RAW parser detail <source> العربية"));
        } else assert.ok(work.notices.at(-1)?.startsWith(translate(language.id, "Invalid YAML. Check indentation and syntax, then try again.") + "\n"));
        const invalidState = work.state(), invalidCalls = work.engine.calls; work.writes.length = 0;
        for (const locale of LANGUAGES) { work.render(locale.id); assert.deepEqual(work.state(), invalidState); assert.equal(work.engine.calls, invalidCalls); }
        assert.deepEqual(work.writes, []);
        view = work.render(language.id);
    }
    view.button("Clear")(); view = work.render(language.id);
    assert.equal(view.editor().props.value, "");
    if (["css", "html", "js"].includes(id)) {
        assert.equal(view.editor(true).props.value, "");
        assert.ok(!view.text.includes("NaN"), "Empty compression statistics remain readable");
    } else {
        view.nodes.find((node) => node.type === "Segmented")!.props.onChange!("Validate"); view = work.render(language.id);
        assert.ok(view.text.includes(translate(language.id, `Paste ${id.toUpperCase()} and it will be validated automatically`)));
    }
}
// Exercise the actual standalone YAML page callbacks in both output modes.
// The failsafe schema supplies a text-token oracle instead of comparing rounded
// JavaScript Numbers; each locale must retain the same exact authored values.
const exactYaml = 'id: 9223372036854775807\ndecimal: 0.123456789012345678901\nzero: -0\nexponent: 1.00e+02\noverflow: 1e400\nquoted: "9223372036854775807"\nfirst: &exact 0.123456789012345678901\nagain: *exact\n';
const yamlTokenOracle = YAML.parseDocument(exactYaml, { schema: "failsafe" }).toJS();
for (const locale of LANGUAGES) {
    const work = harness("yaml", { input: exactYaml });
    let view = work.render(locale.id);
    for (const mode of ["Format", "Minify"]) {
        view.nodes.find((node) => node.type === "Segmented")!.props.onChange!(mode);
        view = work.render(locale.id);
        const output = view.editor(true).props.value!;
        assert.deepEqual(YAML.parseDocument(output, { schema: "failsafe" }).toJS(), yamlTokenOracle, `YAML ${mode}/${locale.id}: scalar source changed`);
        assert.match(output, /first: &exact /);
        assert.match(output, /again: \*exact/);
        view.button("Copy")();
        assert.equal(work.copied.at(-1), output);
    }
}
console.log("Formatter localization: all eight languages, five pages, authored help, accessible names, stable option IDs, raw diagnostics, exact clipboard, real apply/clear/mode/edit callbacks, and state/counter-preserving locale switches pass.");

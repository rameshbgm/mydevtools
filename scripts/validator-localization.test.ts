/* eslint-disable @typescript-eslint/no-explicit-any -- VM fixtures inspect heterogeneous UI props and actual parser callbacks. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { VALIDATOR_TRANSLATIONS } from "../src/lib/i18n/validators";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { SEO_CONTENT } from "../src/lib/seo-content";

const ids = ["xml-validator", "html-validator", "xsd-validator", "xpath-tester", "regex-tester"] as const;
type ToolId = typeof ids[number];
const placeholders = (text: string) => (text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(VALIDATOR_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const [index, language] of LANGUAGES.slice(1).entries()) {
        assert.ok(columns[index].trim(), `${source}/${language.id}`);
        assert.deepEqual(placeholders(columns[index]), placeholders(source), `${source}/${language.id}`);
        assert.equal(translate(language.id, source), columns[index], `${source}/${language.id}: catalog wiring`);
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
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(["/", "DOCTYPE", ":"].includes(node.text.trim()), `${id}: unlocalized JSX ${node.text}`);
        if (ts.isJsxAttribute(node) && ["title", "description", "placeholder", "aria-label", "ariaLabel", "label"].includes(node.name.getText(file))) assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `${id}: unlocalized attribute`);
        if (ts.isJsxAttribute(node) && node.name.getText(file) === "learnMore") {
            const help = (child: ts.Node) => { if (ts.isStringLiteral(child)) check(child); ts.forEachChild(child, help); }; help(node);
        }
        if (id === "xpath-tester" && ts.isPropertyAssignment(node) && node.name.getText(file) === "desc" && ts.isStringLiteral(node.initializer)) check(node.initializer);
        ts.forEachChild(node, visit);
    }; visit(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction|t\()/, "Locale must not remount editors");
    assert.doesNotMatch(source, /\bt\((?:input|xml|xpath|pattern|flags|testStr|xsdInput|xmlInput|err\.message|result\.error|xsdParseError|error)\)/, "Source and engine diagnostics stay exact");
    for (const faq of SEO_CONTENT[id]?.faq ?? []) for (const text of [faq.q, faq.a]) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, text), `${id}: FAQ ${text}`);
}
for (const type of ["Number", "String", "Boolean", "Element", "Attribute", "Text", "Node"]) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, type), type);

const require = createRequire(import.meta.url);
const React = require("react") as typeof import("react"), jsxRuntime = require("react/jsx-runtime");
const { DOMParser: XmlParser, XMLSerializer } = require("@xmldom/xmldom");
type Props = { [key: string]: any; children?: unknown };
type UINode = { type: unknown; props: Props };
function harness(id: ToolId, initial: Record<string, unknown> = {}) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const names: string[] = [], cells: unknown[] = [], memos: { deps: unknown[]; value: unknown }[] = [];
    const writes: string[] = [], copied: string[] = [], notices: unknown[] = [], xpathCalls: string[] = [];
    const engine = { memo: 0, parses: 0, evaluates: 0, workers: 0, network: 0 };
    let language: Language = "en", cursor = 0, memoIndex = 0;
    let restore: ((state: any) => void) | undefined;
    const scan = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file)); ts.forEachChild(node, scan); }; scan(file);
    const same = (a: unknown[] | undefined, b: unknown[]) => !!a && a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
    const component = (name: string) => Object.assign((props: Props) => React.createElement(name, props, props.children as import("react").ReactNode), { Item: (props: Props) => React.createElement(`${name}.Item`, props, props.children as import("react").ReactNode) });
    const ui = new Proxy({ Input: Object.assign(component("Input"), { TextArea: component("TextArea") }), Space: Object.assign(component("Space"), { Compact: component("Space.Compact") }), Typography: { Text: component("Text"), Paragraph: component("Paragraph"), Title: component("Title") } }, { get: (target, name: string) => name in target ? target[name as keyof typeof target] : component(name) });
    // A real XML parser backs the browser DOM boundary. XPath evaluation is
    // deterministic at that boundary so every browser result type can be tested.
    const augment = (doc: any) => {
        const walk = (node: any) => {
            if (!node) return;
            Object.defineProperty(node, "parentElement", { configurable: true, get: () => node.parentNode?.nodeType === 1 ? node.parentNode : null });
            Object.defineProperty(node, "outerHTML", { configurable: true, get: () => new XMLSerializer().serializeToString(node) });
            for (let child = node.firstChild; child; child = child.nextSibling) walk(child);
        }; walk(doc);
        doc.querySelector = (selector: string) => { assert.equal(selector, "parsererror"); return doc.getElementsByTagName("parsererror")[0] ?? null; };
        doc.evaluate = (expression: string, context: any, resolver: unknown, type: number, previous: unknown) => {
            engine.evaluates++; xpathCalls.push(expression); assert.equal(context, doc); assert.equal(resolver, null); assert.equal(type, 0); assert.equal(previous, null);
            if (expression === "invalid[") throw new Error("RAW XPath diagnostic 日本語 العربية");
            if (expression === "count(//book)") return { resultType: 1, numberValue: doc.getElementsByTagName("book").length };
            if (expression === "string(//title)") return { resultType: 2, stringValue: doc.getElementsByTagName("title")[0]?.textContent ?? "" };
            if (expression === "boolean(//book)") return { resultType: 3, booleanValue: !!doc.getElementsByTagName("book").length };
            let nodes: any[] = [];
            if (expression === "//@category") nodes = Array.from(doc.getElementsByTagName("book"), (node: any) => node.getAttributeNode("category")).filter(Boolean);
            else if (expression === "//book/author/text()") nodes = Array.from(doc.getElementsByTagName("author"), (node: any) => node.firstChild).filter(Boolean);
            else if (expression === "//book/title") nodes = Array.from(doc.getElementsByTagName("title"));
            else if (expression === "//book") nodes = Array.from(doc.getElementsByTagName("book"));
            let index = 0; return { resultType: 4, iterateNext: () => nodes[index++] ?? null };
        };
        return doc;
    };
    class BrowserParser {
        parseFromString(text: string, mime: string) {
            engine.parses++; let diagnostic = "";
            const parser = new XmlParser({ errorHandler: { warning: (message: string) => { diagnostic = message; }, error: (message: string) => { diagnostic = message; }, fatalError: (message: string) => { diagnostic = message; } } });
            let doc: any;
            try { doc = parser.parseFromString(text, mime); } catch { diagnostic = "RAW XML diagnostic line 2 column 3 日本語 العربية"; }
            if (diagnostic) doc = new XmlParser().parseFromString('<parsererror>RAW XML diagnostic line 2 column 3 日本語 العربية</parsererror>', "application/xml");
            return augment(doc);
        }
    }
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (fallback: unknown) => { const index = cursor++; if (!(index in cells)) cells[index] = Object.hasOwn(initial, names[index]) ? initial[names[index]] : fallback; return [cells[index], (value: unknown) => { cells[index] = typeof value === "function" ? (value as (old: unknown) => unknown)(cells[index]) : value; writes.push(names[index]); }]; }, useMemo: (compute: () => unknown, deps: unknown[]) => { const index = memoIndex++; if (!same(memos[index]?.deps, deps)) { engine.memo++; memos[index] = { value: compute(), deps }; } return memos[index].value; } };
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name === "antd") return ui;
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => component("Icon") });
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => translate(language, source, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Props) => React.createElement("Layout", props, ...[...Object.values(props.learnMore ?? {}).flat().map((text) => translate(language, String(text))), props.children] as import("react").ReactNode[]) };
        if (name.endsWith("CodeEditor")) return { CodeEditor: component("CodeEditor") };
        if (["ToolBridgeBanner", "ShareButton", "SendToButton", "SimpleList"].some((part) => name.endsWith(part))) return { __esModule: true, default: component(name.split("/").at(-1)!) };
        if (name.endsWith("shareable-state")) return { useShareableState: (_schema: unknown, callback: typeof restore) => { restore = callback; } };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string, label?: string) => { copied.push(value); if (label) notices.push(label); return true; } };
        if (name.endsWith("messageService")) return { messageService: { success: (value: unknown) => notices.push(value), warning: (value: unknown) => notices.push(value), error: (value: unknown) => notices.push(value) } };
        throw new Error(`Unexpected dependency ${name}`);
    };
    const compiled = { exports: {} as { default: () => unknown } };
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, Error, RegExp, DOMParser: BrowserParser, Node: { ELEMENT_NODE: 1, ATTRIBUTE_NODE: 2, TEXT_NODE: 3 }, XPathResult: { ANY_TYPE: 0, NUMBER_TYPE: 1, STRING_TYPE: 2, BOOLEAN_TYPE: 3 }, Worker: class { constructor() { engine.workers++; throw new Error("Unexpected worker"); } }, fetch: () => { engine.network++; throw new Error("Unexpected network"); } });
    const collect = (tree: unknown) => {
        const nodes: UINode[] = [], text: string[] = [];
        const walk = (node: unknown): void => {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { text.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            const element = node as UINode;
            if (typeof element.type === "function") { walk(element.type(element.props)); return; }
            if (element.props) {
                nodes.push(element);
                for (const key of ["title", "description", "extra", "label"]) if (element.props[key] != null) walk(element.props[key]);
                for (const item of element.props.items ?? []) { walk(item.label); walk(item.children); }
                if (element.props.dataSource && element.props.renderItem) element.props.dataSource.forEach((item: unknown, index: number) => walk(element.props.renderItem(item, index)));
                for (const column of element.props.columns ?? []) {
                    walk(column.title);
                    for (const [index, record] of (element.props.dataSource ?? []).entries()) walk(column.render ? column.render(column.dataIndex ? record[column.dataIndex] : undefined, record, index) : record[column.dataIndex]);
                }
                walk(element.props.children);
            }
        }; walk(tree); return { nodes, text: text.join(" ") };
    };
    const render = (locale: Language) => {
        language = locale; cursor = 0; memoIndex = 0;
        const view = collect(compiled.exports.default());
        return { ...view, button: (source: string) => { const node = view.nodes.find((node) => node.type === "Button" && node.props.children === translate(language, source)); assert.ok(node, `${id}: ${source}`); return node.props.onClick; }, editor: (index = 0) => { const node = view.nodes.filter((node) => node.type === "CodeEditor")[index]; assert.ok(node, id); return node; } };
    };
    return { render, state: () => Object.fromEntries(names.map((name, index) => [name, cells[index]])), writes, copied, notices, engine, xpathCalls, restore: (state: unknown) => { assert.ok(restore); restore(state); } };
}
function localeInvariant(work: ReturnType<typeof harness>) {
    const state = work.state(), calls = { ...work.engine }; work.writes.length = 0;
    for (const language of LANGUAGES) { work.render(language.id); assert.deepEqual(work.state(), state, "Locale changed source, settings or results"); assert.deepEqual(work.engine, calls, "Locale reran validation, XPath, regex, worker or network"); }
    assert.deepEqual(work.writes, [], "Locale called a state setter");
}
const xmlSource = '<bookstore><book category="fiction"><title>日本語 العربية &amp; text</title><author>Writer</author></book></bookstore>';
for (const language of LANGUAGES) {
    const xml = harness("xml-validator", { input: xmlSource }); let view = xml.render(language.id);
    assert.equal(view.editor().props.value, xmlSource); assert.equal(view.editor().props.ariaLabel, translate(language.id, "XML input editor"));
    assert.ok(view.text.includes(translate(language.id, "Valid XML"))); assert.ok(view.text.includes(translate(language.id, "Elements: {count}", { count: 4 }))); localeInvariant(xml);
    view = xml.render(language.id); view.editor().props.onChange('<broken>'); view = xml.render(language.id);
    assert.ok(view.text.includes(translate(language.id, "Invalid XML"))); assert.ok(view.nodes.some((node) => node.type === "Text" && node.props.dir === "ltr" && String(node.props.children).includes("RAW XML diagnostic"))); localeInvariant(xml);
    view = xml.render(language.id); view.button("Clear")(); view = xml.render(language.id); assert.equal(view.editor().props.value, ""); assert.ok(view.text.includes("Input is empty")); localeInvariant(xml);

    const html = harness("html-validator", { input: '<html>\n<body>\n<img src="user.png">\n</body>\n</html>' }); view = html.render(language.id);
    assert.equal(view.editor().props.ariaLabel, translate(language.id, "HTML input editor"));
    assert.ok(view.text.includes(translate(language.id, "Warnings: {count}", { count: 3 })));
    assert.ok(view.nodes.some((node) => node.type === "Text" && node.props.dir === "auto" && node.props.children === translate(language.id, "Missing <!DOCTYPE html> declaration"))); localeInvariant(html);
    view = html.render(language.id); view.editor().props.onChange('<html>\n<body>\n</wrong>'); view = html.render(language.id);
    assert.ok(view.text.includes(translate(language.id, "Errors: {count}", { count: 3 }))); assert.ok(view.text.includes(translate(language.id, "Unexpected closing tag {tag}", { tag: "</wrong>" }))); localeInvariant(html);
    view = html.render(language.id); view.button("Clear")(); view = html.render(language.id); assert.equal(view.editor().props.value, ""); localeInvariant(html);

    const xsd = harness("xsd-validator"); view = xsd.render(language.id);
    const sample = xsd.state(); assert.equal(view.editor().props.ariaLabel, translate(language.id, "XSD schema editor")); assert.equal(view.editor(1).props.ariaLabel, translate(language.id, "XML input editor")); assert.ok(view.text.includes(translate(language.id, "Parse XSD First"))); localeInvariant(xsd);
    const scope = "Only XML well-formedness, declared root name and root namespace are checked. Child content, datatypes, cardinality and required attributes require a full XSD validator such as Xerces or libxml2.";
    const passed = "Supported checks found no errors; full XSD conformance was not tested.";
    assert.ok(view.text.includes(translate(language.id, scope)), `${language.id}: explicit supported-check limits`);
    view = xsd.render(language.id); view.button("Run basic checks")(); assert.equal(xsd.notices.at(-1), translate(language.id, "Please parse the XSD first"));
    view.button("Parse XSD")(); view = xsd.render(language.id); assert.equal(xsd.notices.at(-1), translate(language.id, "XSD parsed successfully!")); assert.equal((xsd.state().parsedXsd as any).elements[0].name, "bookstore"); localeInvariant(xsd);
    view = xsd.render(language.id); view.button("Run basic checks")(); view = xsd.render(language.id);
    assert.equal(xsd.notices.at(-1), translate(language.id, passed));
    const info = (xsd.state().validationErrors as any[])[0]; assert.equal(info.severity, "info"); assert.ok(view.nodes.some((node) => node.type === "Text" && node.props.dir === (language.id === "ar" ? "rtl" : "ltr") && node.props.children === translate(language.id, info.translationKey)));
    assert.ok(view.text.includes(translate(language.id, scope))); assert.ok(view.text.includes(translate(language.id, "No root/XML errors"))); localeInvariant(xsd);
    view = xsd.render(language.id); view.editor(1).props.onChange('<wrong xmlns="urn:other"/>'); view = xsd.render(language.id); view.button("Run basic checks")(); view = xsd.render(language.id);
    assert.equal(xsd.notices.at(-1), translate(language.id, "Basic checks found {count} error(s)", { count: 1 }));
    const wrong = xsd.state().validationErrors as any[];
    assert.equal(wrong[0].message, "Namespace mismatch. Expected: http://example.com/bookstore, Found: urn:other", "Raw diagnostic and namespace bytes remain intact");
    assert.equal(wrong[1].message, 'Unknown root element: "wrong". Expected one of: bookstore');
    for (const issue of wrong) assert.ok(view.text.includes(translate(language.id, issue.translationKey, issue.translationValues)));
    localeInvariant(xsd);
    view = xsd.render(language.id); view.editor(1).props.onChange('<bookstore/>'); view = xsd.render(language.id); view.button("Run basic checks")(); view = xsd.render(language.id);
    const missingNamespace = (xsd.state().validationErrors as any[])[0]; assert.equal(missingNamespace.message, "Namespace mismatch. Expected: http://example.com/bookstore, Found: none");
    assert.ok(view.text.includes(translate(language.id, missingNamespace.translationKey, { expected: "http://example.com/bookstore", found: translate(language.id, "none") }))); localeInvariant(xsd);
    view = xsd.render(language.id); view.editor(1).props.onChange('<bookstore xmlns="none"/>'); view = xsd.render(language.id); view.button("Run basic checks")(); view = xsd.render(language.id);
    const literalNone = (xsd.state().validationErrors as any[])[0]; assert.equal(literalNone.translationValues.found, "none");
    assert.ok(view.text.includes(translate(language.id, literalNone.translationKey, literalNone.translationValues)), "A user namespace literally named none is never translated"); localeInvariant(xsd);
    view = xsd.render(language.id); view.button("Datatype-error sample")(); view = xsd.render(language.id); assert.equal(xsd.state().validated, false); assert.ok(String(xsd.state().xmlInput).includes('id="abc"'));
    const datatypeExample = xsd.state().xmlInput;
    view.button("Run basic checks")(); view = xsd.render(language.id);
    assert.equal(xsd.state().xmlInput, datatypeExample, "Checks preserve the complete XML example");
    assert.equal((xsd.state().validationErrors as any[]).filter(issue => issue.severity === "error").length, 0, "Datatype and child-content validation remains outside the supported engine");
    assert.equal(xsd.notices.at(-1), translate(language.id, passed), "The datatype-error example must not be called schema-valid");
    assert.ok(view.text.includes(translate(language.id, "No root/XML errors"))); assert.ok(view.text.includes(translate(language.id, scope)));
    for (const misleading of ["Validation passed!", "The XML document is valid according to the XSD schema."]) assert.ok(!view.text.includes(translate(language.id, misleading)), `Misleading full-validation claim: ${misleading}`);
    localeInvariant(xsd);
    view = xsd.render(language.id); view.button("Baseline sample")(); view = xsd.render(language.id); assert.equal(xsd.state().xmlInput, sample.xmlInput);
    view.editor().props.onChange('<broken>'); view = xsd.render(language.id); view.button("Parse XSD")(); view = xsd.render(language.id); assert.equal(xsd.state().parsedXsd, null); assert.ok(String(xsd.state().xsdParseError).includes("RAW XML diagnostic")); localeInvariant(xsd);
    assert.match(SEO_CONTENT["xsd-validator"].description, /Full XSD conformance is not validated/);
    assert.doesNotMatch(SEO_CONTENT["xsd-validator"].description, /type mismatches and missing element errors/);

    const xpath = harness("xpath-tester", { xml: xmlSource }); view = xpath.render(language.id);
    assert.equal(view.editor().props.value, xmlSource); assert.equal(xpath.xpathCalls.at(-1), "//book/title"); assert.ok(view.text.includes('<title>日本語 العربية &amp; text</title>')); localeInvariant(xpath);
    view = xpath.render(language.id); view.button("Copy")(); assert.equal(xpath.copied.at(-1), '<title>日本語 العربية &amp; text</title>'); assert.equal(xpath.notices.at(-1), translate(language.id, "Results copied!"));
    for (const [expression, expected, type] of [["count(//book)", "1", "Number"], ["string(//title)", "日本語 العربية & text", "String"], ["boolean(//book)", "true", "Boolean"], ["//@category", 'category="fiction"', "Attribute"], ["//book/author/text()", "Writer", "Text"]]) {
        view = xpath.render(language.id); const field = view.nodes.find((node) => node.type === "Input")!; assert.equal(field.props.dir, "ltr"); field.props.onChange({ target: { value: expression } }); view = xpath.render(language.id);
        assert.ok(view.text.includes(expected)); assert.ok(view.text.includes(translate(language.id, type))); localeInvariant(xpath);
    }
    view = xpath.render(language.id); const example = view.nodes.find((node) => node.type === "button" && Array.isArray(node.props.children) && node.props.children[0]?.props?.children === "//book")!; assert.ok(example); example.props.onClick(); view = xpath.render(language.id); assert.equal(xpath.state().xpath, "//book"); localeInvariant(xpath);
    view = xpath.render(language.id); view.nodes.find((node) => node.type === "Input")!.props.onChange({ target: { value: "invalid[" } }); view = xpath.render(language.id); assert.ok(view.text.includes(translate(language.id, "XPath evaluation failed"))); assert.ok(view.nodes.some((node) => node.type === "pre" && node.props.dir === "ltr" && node.props.children === "RAW XPath diagnostic 日本語 العربية")); localeInvariant(xpath);
    view = xpath.render(language.id); view.button("Clear")(); view = xpath.render(language.id); assert.equal(xpath.state().xml, ""); localeInvariant(xpath);

    const regex = harness("regex-tester", { pattern: "(日本語|العربية)", flags: "gu", testStr: "日本語 and العربية" }); view = regex.render(language.id);
    assert.ok(view.text.includes(translate(language.id, "Matches ({count})", { count: 2 }))); assert.ok(view.text.includes("العربية"));
    const fields = view.nodes.filter((node) => ["Input", "TextArea"].includes(String(node.type))); assert.ok(fields.every((node) => node.props.dir === "ltr")); assert.deepEqual(fields.map((node) => node.props["aria-label"]), ["Regular expression pattern", "Regular expression flags", "Test string"].map((key) => translate(language.id, key))); localeInvariant(regex);
    view = regex.render(language.id); const iconCopy = view.nodes.filter((node) => node.type === "Button" && node.props.onClick); iconCopy[0].props.onClick(); assert.equal(regex.copied.at(-1), "/(日本語|العربية)/gu"); assert.equal(regex.notices.at(-1), translate(language.id, "Pattern copied!"));
    view.button("Copy All")(); assert.equal(regex.copied.at(-1), "日本語\nالعربية");
    view.nodes.find((node) => node.type === "Tag" && node.props.onClick)!.props.onClick(); assert.equal(regex.copied.at(-1), "日本語"); assert.equal(regex.notices.at(-1), translate(language.id, "Group {number} copied!", { number: 1 }));
    const share = view.nodes.find((node) => node.type === "ShareButton")!; assert.deepEqual(JSON.parse(JSON.stringify(share.props.getState())),  { pattern: "(日本語|العربية)", flags: "gu", testStr: "日本語 and العربية" }); assert.equal(view.nodes.find((node) => node.type === "SendToButton")!.props.data, "日本語 and العربية");
    view.nodes.find((node) => node.type === "ToolBridgeBanner")!.props.onAccept({ data: "new العربية" }); view = regex.render(language.id); assert.equal(regex.state().testStr, "new العربية"); localeInvariant(regex);
    regex.restore({ pattern: "(a)", flags: "g", testStr: "a a" }); view = regex.render(language.id); assert.ok(view.text.includes(translate(language.id, "Matches ({count})", { count: 2 }))); localeInvariant(regex);
    view = regex.render(language.id); view.nodes.find((node) => node.type === "Input")!.props.onChange({ target: { value: "[" } }); view = regex.render(language.id); assert.ok(view.text.includes(translate(language.id, "Regular expression error"))); assert.ok(view.nodes.some((node) => node.type === "pre" && node.props.dir === "ltr" && String(node.props.children).includes("Invalid regular expression"))); localeInvariant(regex);
}
console.log("Validator localization: eight languages, five pages, authored UI/help/ARIA and existing FAQ coverage and truthful limited-XSD scope, actual XML/HTML/XSD/XPath/regex handlers, exact source/diagnostics/copy/share/bridge payloads, native keyboard examples, and locale-invariant state/evaluation/network/worker counts pass. XPath DOM evaluation is mocked at the browser boundary; no browser rendering claim.");

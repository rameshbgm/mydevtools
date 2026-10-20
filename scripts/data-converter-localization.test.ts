import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import YAML from "yaml";
import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { DATA_CONVERTER_TRANSLATIONS } from "../src/lib/i18n/data-converters";
import { getSeoContent } from "../src/lib/seo-content";
import { toolPathFromId } from "../src/lib/category-routes";

const ids = ["xml-to-json", "json-to-xml", "csv-to-json", "csv-to-xml", "yaml-json-converter", "json-to-csv", "xslt-transformer"];
const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(DATA_CONVERTER_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog integration: ${source}`);
    for (const [index, text] of columns.entries()) {
        assert.ok(text.trim(), source);
        assert.notEqual(text, source, `Authored copy: ${source}`);
        assert.deepEqual(placeholders(text), placeholders(source));
        assert.equal(translate(LANGUAGES[index + 1].id, source), text);
        for (const token of ["#text", "@attribute", "{@id: '123'}", "'address.city'", "'address.zip'", "xsl:for-each", "xsl:value-of", "xsl:template"]) {
            if (source.includes(token)) assert.ok(text.includes(token), `Preserve technical example: ${token}`);
        }
    }
}
for (const id of ids) {
    for (const item of getSeoContent(id)?.faq ?? []) for (const source of [item.q, item.a]) {
        assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `${id} visible FAQ: ${source}`);
        for (const lang of LANGUAGES.slice(1)) assert.notEqual(translate(lang.id, source), source);
    }
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const copy = (text: string) => assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, text), `${id}: ${text}`);
    const inspect = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) copy(node.text);
        if (ts.isConditionalExpression(node)) { inspect(node.whenTrue); inspect(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.match(node.text.trim(), /^xsl:[a-z-]+$/, `Untranslated JSX: ${id}: ${node.text}`);
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0]) inspect(node.arguments[0]);
        if (ts.isPropertyAssignment(node) && ["whatIs", "whyUse", "howToUse", "tips", "useCases"].includes(node.name.getText(file))) {
            const values = ts.isArrayLiteralExpression(node.initializer) ? node.initializer.elements : [node.initializer]; values.forEach(inspect);
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
    assert.match(source, /useLanguage\(\)/);
    assert.doesNotMatch(source, /key=\{(?:language|direction|locale)\}/);
    assert.doesNotMatch(source, /\[[^\]]*(?:language|direction|\bt\b)[^\]]*\]\);/);
    assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|Worker)\b/);
}

// Actual page callbacks run with persistent React state and dependency-aware memos.
// XML DOM uses the installed XML parser with a querySelector adapter. XSLTProcessor
// is a browser boundary double: this test does not claim browser XSLT engine coverage.
const nodeRequire = createRequire(`${process.cwd()}/package.json`);
type Element = { type: unknown; props: Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any
function elements(node: unknown): Element[] {
    if (Array.isArray(node)) return node.flatMap(elements);
    if (!node || typeof node !== "object" || !("props" in node)) return [];
    const item = node as Element;
    return [item, ...Object.values(item.props).flatMap(elements)];
}
function byType(tree: Element, type: string) { return elements(tree).filter((item) => item.type === type); }
function visible(node: unknown): string {
    if (node === undefined || node === null || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(visible).join(" ");
    const props = (node as Element).props;
    return props ? [props.title, props.description, props.children].map(visible).join(" ") : "";
}
function harness(id: string, query = "") {
    const hooks: unknown[] = []; let cursor = 0, dirty = false, language: Language = "en";
    const effects: (() => void)[] = [], copied: { value: string; label?: string }[] = [], downloads: { value: string; name: string; mime: string }[] = [];
    const activity = { memo: 0, json: 0, yaml: 0, dom: 0, xslt: 0, shared: 0 };
    let shared: ((value: Record<string, unknown>) => void) | undefined;
    const transforms: { xml: string; xslt: string }[] = [], redirects: string[] = [];
    let rawFailure: string | undefined;
    const router = { replace: (value: string) => redirects.push(value) };
    const depsEqual = (previous: unknown[], next: unknown[]) => previous.length === next.length && previous.every((value, index) => Object.is(value, next[index]));
    class DOMParser {
        parseFromString(source: string) {
            activity.dom++;
            if (rawFailure) throw new Error(rawFailure);
            let diagnostic: string | undefined;
            const doc = new XmlDomParser({ errorHandler: { warning: (message) => { diagnostic = message; }, error: (message) => { diagnostic = message; }, fatalError: (message) => { diagnostic = message; } } }).parseFromString(source, "application/xml");
            return Object.assign(doc, { querySelector: (selector: string) => selector === "parsererror" && diagnostic ? { textContent: diagnostic } : null, source });
        }
    }
    class XSLTProcessor {
        stylesheet?: { source: string };
        importStylesheet(doc: { source: string }) { this.stylesheet = doc; }
        transformToDocument(doc: { source: string }) {
            activity.xslt++;
            transforms.push({ xml: doc.source, xslt: this.stylesheet!.source });
            return { serialized: '<result id="01">日本語 العربية &amp; 0.9999999999999999999</result>' };
        }
    }
    const stub = () => null;
    const react = {
        Suspense: "suspense",
        useState: (initial: unknown) => {
            const index = cursor++;
            if (!(index in hooks)) hooks[index] = typeof initial === "function" ? (initial as () => unknown)() : initial;
            return [hooks[index], (next: unknown) => {
                const value = typeof next === "function" ? (next as (value: unknown) => unknown)(hooks[index]) : next;
                if (!Object.is(value, hooks[index])) { hooks[index] = value; dirty = true; }
            }];
        },
        useMemo: (compute: () => unknown, dependencies: unknown[]) => {
            const index = cursor++, previous = hooks[index] as { value: unknown; deps: unknown[] } | undefined;
            if (!previous || !depsEqual(previous.deps, dependencies)) { activity.memo++; hooks[index] = { value: compute(), deps: [...dependencies] }; }
            return (hooks[index] as { value: unknown }).value;
        },
        useEffect: (effect: () => void, dependencies: unknown[]) => {
            const index = cursor++, previous = hooks[index] as unknown[] | undefined;
            if (!previous || !depsEqual(previous, dependencies)) { hooks[index] = [...dependencies]; effects.push(effect); }
        },
    };
    const dependencies = (name: string): unknown => {
        if (name === "react") return react;
        if (name === "next/navigation") return { useSearchParams: () => new URLSearchParams(query), useRouter: () => router };
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => { const active = language; return { language: active, direction: active === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => translate(active, source, values) }; } };
        if (name === "yaml") return { __esModule: true, default: { parse: (source: string) => { activity.yaml++; return YAML.parse(source); }, stringify: (value: unknown, options?: Record<string, unknown>) => { activity.yaml++; return YAML.stringify(value, options); } } };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string, label?: string) => { copied.push({ value, label }); return true; } };
        if (name.endsWith("download")) return { downloadText: (value: string, name: string, mime: string) => downloads.push({ value, name, mime }) };
        if (name.endsWith("category-routes")) return { toolPathFromId };
        if (name.endsWith("shareable-state")) return { useShareableState: (_schema: unknown, callback: typeof shared) => { shared = callback; } };
        if (name === "antd") return { Card: "card", Input: "input", Typography: { Text: "text", Paragraph: "paragraph" }, Row: "row", Col: "col", Button: "button", Space: "space", Alert: "alert", Switch: "switch", Select: "select", Segmented: "segmented" };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => stub });
        if (name.endsWith("CodeEditor")) return { CodeEditor: "editor" };
        if (name.startsWith("@/components/")) return { __esModule: true, default: name.split("/").at(-1) };
        return nodeRequire(name);
    };
    const record = { exports: {} as { default: () => Element } };
    const source = readFileSync(`src/app/tools/${id}/page.tsx`, "utf8");
    const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: record, exports: record.exports, require: dependencies, Error, URLSearchParams, Node: { ELEMENT_NODE: 1, TEXT_NODE: 3 }, DOMParser, XSLTProcessor, XMLSerializer: class { serializeToString(doc: { serialized: string }) { return doc.serialized; } }, JSON: { ...JSON, parse: (source: string) => { activity.json++; return JSON.parse(source); }, stringify: JSON.stringify }, console });
    const expand = (node: Element): Element => {
        if (typeof node.type === "function") return expand((node.type as () => Element)());
        if (node.type === "suspense") return expand(node.props.children);
        return node;
    };
    return {
        render: () => {
            let tree: Element; let passes = 0;
            do { dirty = false; cursor = 0; tree = expand(record.exports.default()); while (effects.length) effects.shift()!(); assert.ok(++passes < 8, "Stable render"); } while (dirty);
            return tree!;
        },
        language: (value: Language) => { language = value; },
        share: (value: Record<string, unknown>) => { activity.shared++; shared?.(value); },
        fail: (value?: string) => { rawFailure = value; },
        copied, downloads, activity, transforms, redirects,
    };
}
function button(h: ReturnType<typeof harness>, source: string, lang: Language = "en", index = 0) {
    const matches = byType(h.render(), "button").filter((item) => visible(item.props.children).trim() === translate(lang, source));
    assert.ok(matches[index], `Button: ${source}`); return matches[index];
}
function edit(h: ReturnType<typeof harness>, value: string, index = 0) { byType(h.render(), "editor")[index].props.onChange(value); return h.render(); }
function option(h: ReturnType<typeof harness>, value: string | number, index = 0) { byType(h.render(), "select")[index].props.onChange(value); return h.render(); }
function snapshot(h: ReturnType<typeof harness>) {
    const tree = h.render();
    return { editors: byType(tree, "editor").map((item) => [item.props.value, item.props.language, item.props.readOnly]), selects: byType(tree, "select").map((item) => [item.props.value, item.props.options.map((o: { value: unknown }) => o.value)]), switches: byType(tree, "switch").map((item) => item.props.checked), inputs: byType(tree, "input").map((item) => item.props.value), shares: elements(tree).filter((item) => item.type === "ShareButton").map((item) => item.props.getState()), sends: elements(tree).filter((item) => item.type === "SendToButton").map((item) => [item.props.data, item.props.kind, item.props.sourceToolId]) };
}
function localeMatrix(h: ReturnType<typeof harness>, title?: string) {
    const before = snapshot(h), activity = { ...h.activity };
    for (const lang of LANGUAGES) {
        h.language(lang.id); const tree = h.render();
        assert.deepEqual(snapshot(h), before, `${title}: ${lang.id} retains data/options/share/bridge`);
        assert.deepEqual(h.activity, activity, `${title}: ${lang.id} performs no conversion or share load`);
        if (title) assert.equal(tree.props.title, translate(lang.id, title));
        for (const item of byType(tree, "select")) assert.equal(item.props.direction, "ltr");
        for (const item of byType(tree, "input")) { assert.equal(item.props.dir, "ltr"); assert.equal(item.props.styles.input.direction, "ltr"); assert.equal(item.props.styles.input.textAlign, "left"); }
    }
    h.language("en");
}

async function main() {
    // Existing page samples plus precision/Unicode/attribute fixtures used by the conversion suites.
    const csv = harness("csv-to-json"); csv.render();
    const rawCsv = 'id,number,text\r\n9223372036854775807,0.9999999999999999999,"日本語 العربية, & <"';
    edit(csv, rawCsv);
    const json = JSON.stringify([{ id: "9223372036854775807", number: "0.9999999999999999999", text: "日本語 العربية, & <" }], null, 2);
    assert.equal(byType(csv.render(), "editor")[1].props.value, json);
    localeMatrix(csv, "CSV Converter");
    for (const lang of LANGUAGES) {
        csv.language(lang.id); await button(csv, "Copy", lang.id).props.onClick(); assert.equal(csv.copied.at(-1)?.value, json); assert.equal(csv.copied.at(-1)?.label, translate(lang.id, "JSON copied!"));
    }
    csv.language("en");
    byType(csv.render(), "segmented")[0].props.onChange("xml");
    byType(csv.render(), "input")[0].props.onChange({ target: { value: "records" } });
    byType(csv.render(), "input")[1].props.onChange({ target: { value: "entry" } });
    assert.ok(byType(csv.render(), "editor")[1].props.value.includes('<records>\n  <entry>\n    <id>9223372036854775807</id>'));
    assert.ok(byType(csv.render(), "editor")[1].props.value.includes('日本語 العربية, &amp; &lt;'));
    localeMatrix(csv, "CSV Converter");
    option(csv, ";"); edit(csv, "id;number\n01;0.9999999999999999999");
    assert.equal(byType(csv.render(), "select")[0].props.value, ";");
    byType(csv.render(), "switch")[0].props.onChange(false);
    assert.ok(byType(csv.render(), "editor")[1].props.value.includes("<field1>id</field1>"));
    csv.share({ input: rawCsv, outputFormat: "json", hasHeader: true, delimiter: ",", arrayFormat: true, rootElement: "custom", rowElement: "item" });
    assert.deepEqual(JSON.parse(byType(csv.render(), "editor")[1].props.value), [["id", "number", "text"], ["9223372036854775807", "0.9999999999999999999", "日本語 العربية, & <"]]);
    localeMatrix(csv, "CSV Converter");
    const bridge = elements(csv.render()).find((item) => item.type === "ToolBridgeBanner")!;
    bridge.props.onAccept({ data: rawCsv, kind: "csv" }); assert.equal(byType(csv.render(), "editor")[0].props.value, rawCsv);
    button(csv, "Clear").props.onClick(); assert.deepEqual(byType(csv.render(), "editor").map((item) => item.props.value), ["", ""]);

    // Only an initial supported query selects XML. Manual choices survive rerenders and locale changes.
    for (const [query, expected] of [["", "json"], ["format=json", "json"], ["format=xml", "xml"], ["format=csv", "json"], ["format=XML", "json"], ["format=%3Cscript%3E", "json"], ["format=xml&format=json", "xml"]]) {
        const h = harness("csv-to-json", query); const tree = h.render();
        assert.equal(byType(tree, "segmented")[0].props.value, expected, query);
        assert.equal(byType(tree, "editor")[1].props.language, expected, query);
        byType(tree, "segmented")[0].props.onChange(expected === "xml" ? "json" : "xml"); localeMatrix(h, "CSV Converter");
    }
    const alias = harness("csv-to-xml"); alias.render(); assert.deepEqual(alias.redirects, [`${toolPathFromId("csv-to-json")}?format=xml`]);
    for (const lang of LANGUAGES) { alias.language(lang.id); assert.ok(visible(alias.render()).includes(translate(lang.id, "Redirecting to CSV Converter..."))); }
    assert.equal(alias.redirects.length, 1, "Locale changes do not redirect again");

    const xml = harness("xml-to-json"); xml.render();
    edit(xml, '<root id="01"><n>0.9999999999999999999</n><n>9223372036854775807</n><text lang="ar">العربية &amp; 日本語</text></root>');
    assert.deepEqual(JSON.parse(byType(xml.render(), "editor")[1].props.value), { root: { "@id": "01", n: ["0.9999999999999999999", "9223372036854775807"], text: { "@lang": "ar", "#text": "العربية & 日本語" } } });
    option(xml, "_"); option(xml, "$value", 1); byType(xml.render(), "switch")[0].props.onChange(true);
    assert.equal(byType(xml.render(), "editor")[1].props.value, '{"root":{"_id":"01","n":["0.9999999999999999999","9223372036854775807"],"text":{"_lang":"ar","$value":"العربية & 日本語"}}}');
    localeMatrix(xml, "XML to JSON Converter");
    xml.share({ input: '<root id="raw">text</root>', attributePrefix: "$", textKey: "value", compact: false });
    assert.deepEqual(JSON.parse(byType(xml.render(), "editor")[1].props.value), { root: { "$id": "raw", value: "text" } });
    const diagnostic = "Platform Δ 日本語 العربية <raw>"; xml.fail(diagnostic); edit(xml, "<invalid>");
    for (const lang of LANGUAGES) { xml.language(lang.id); const alert = byType(xml.render(), "alert")[0]; assert.equal(alert.props.title, translate(lang.id, "Conversion failed. Check the input and options, then try again.")); assert.equal(visible(alert.props.description).trim(), diagnostic); assert.equal(alert.props.description.props.dir, "ltr"); }
    localeMatrix(xml, "XML to JSON Converter"); xml.fail(); xml.language("en"); button(xml, "Clear").props.onClick(); assert.equal(byType(xml.render(), "editor")[1].props.value, "");

    const jxml = harness("json-to-xml"); jxml.render();
    // Explicit fixture avoids accidental escaping changes in the authored examples.
    edit(jxml, JSON.stringify({ root: { "@id": "01", n: ["0.9999999999999999999", "9223372036854775807"], text: '日本語 العربية & < > "' } }));
    assert.equal(byType(jxml.render(), "editor")[1].props.value, '<?xml version="1.0" encoding="UTF-8"?>\n<root id="01">\n  <n>0.9999999999999999999</n>\n  <n>9223372036854775807</n>\n  <text>日本語 العربية &amp; &lt; &gt; &quot;</text>\n</root>');
    option(jxml, 0, 2); byType(jxml.render(), "switch")[0].props.onChange(false);
    assert.ok(byType(jxml.render(), "editor")[1].props.value.startsWith('<root id="01"><n>'));
    localeMatrix(jxml, "JSON to XML Converter");
    jxml.share({ input: '{"root":{"_id":"01","$value":"raw"}}', attributePrefix: "_", textKey: "$value", declaration: false, indent: 4 });
    assert.equal(byType(jxml.render(), "editor")[1].props.value, '<root id="01">raw</root>');
    edit(jxml, "{invalid"); const jsonError = visible(byType(jxml.render(), "alert")[0].props.description).trim();
    assert.ok(jsonError.length); localeMatrix(jxml, "JSON to XML Converter");
    assert.equal(visible(byType(jxml.render(), "alert")[0].props.description).trim(), jsonError);

    const yaml = harness("yaml-json-converter"); yaml.render();
    edit(yaml, 'root:\n  n: "0.9999999999999999999"\n  id: "9223372036854775807"\n  name: 日本語 العربية');
    const yamlJson = byType(yaml.render(), "editor")[1].props.value;
    assert.deepEqual(JSON.parse(yamlJson), { root: { n: "0.9999999999999999999", id: "9223372036854775807", name: "日本語 العربية" } });
    localeMatrix(yaml, "YAML ↔ JSON Converter");
    button(yaml, "Swap").props.onClick(); assert.equal(byType(yaml.render(), "segmented")[0].props.value, "json-to-yaml"); assert.equal(byType(yaml.render(), "editor")[0].props.value, yamlJson);
    assert.deepEqual(YAML.parse(byType(yaml.render(), "editor")[1].props.value), JSON.parse(yamlJson));
    byType(yaml.render(), "segmented")[0].props.onChange("yaml-to-json");
    // Native-number behavior remains the existing parser behavior, including its precision limits.
    const numericYaml = "n: 0.9999999999999999999\nsmall: 1e-400";
    edit(yaml, numericYaml); assert.equal(byType(yaml.render(), "editor")[1].props.value, JSON.stringify(YAML.parse(numericYaml), null, 2));
    localeMatrix(yaml, "YAML ↔ JSON Converter");
    edit(yaml, 'root:\n  n: "0.9999999999999999999"\n  id: "9223372036854775807"\n  name: 日本語 العربية');
    button(yaml, "Swap").props.onClick();
    const secondDraft = '{"other":"raw 日本語 العربية"}'; edit(yaml, secondDraft);
    byType(yaml.render(), "segmented")[0].props.onChange("yaml-to-json"); assert.ok(byType(yaml.render(), "editor")[0].props.value.includes('n: "0.9999999999999999999"'));
    byType(yaml.render(), "segmented")[0].props.onChange("json-to-yaml"); assert.equal(byType(yaml.render(), "editor")[0].props.value, secondDraft);
    localeMatrix(yaml, "YAML ↔ JSON Converter");
    const yamlBridge = elements(yaml.render()).find((item) => item.type === "ToolBridgeBanner")!; yamlBridge.props.onAccept({ kind: "json", data: secondDraft });
    assert.equal(byType(yaml.render(), "editor")[0].props.value, secondDraft);
    yaml.share({ mode: "yaml-to-json", yamlInput: "root: [unclosed", jsonInput: secondDraft });
    assert.equal(byType(yaml.render(), "editor")[1].props.value, ""); const yamlError = visible(byType(yaml.render(), "alert")[0].props.description).trim();
    localeMatrix(yaml, "YAML ↔ JSON Converter"); assert.equal(visible(byType(yaml.render(), "alert")[0].props.description).trim(), yamlError);
    assert.equal(byType(yaml.render(), "button").some((item) => visible(item.props.children).trim() === "Swap"), false, "Invalid data guards Swap");

    const jcsv = harness("json-to-csv"); jcsv.render();
    const csvInput = JSON.stringify([{ id: "9223372036854775807", n: "0.9999999999999999999", address: { city: '日本語 العربية, "' }, tags: ["a", "b"] }]);
    edit(jcsv, csvInput); button(jcsv, "Convert").props.onClick();
    const csvOutput = 'id,n,address.city,tags\n9223372036854775807,0.9999999999999999999,"日本語 العربية, """,a|b';
    assert.equal(byType(jcsv.render(), "editor")[1].props.value, csvOutput);
    localeMatrix(jcsv, "JSON to CSV Converter");
    for (const lang of LANGUAGES) { jcsv.language(lang.id); await button(jcsv, "Copy", lang.id).props.onClick(); button(jcsv, "Download", lang.id).props.onClick(); assert.equal(jcsv.copied.at(-1)?.value, csvOutput); assert.deepEqual(jcsv.downloads.at(-1), { value: csvOutput, name: "data.csv", mime: "text/csv;charset=utf-8" }); }
    jcsv.language("en"); option(jcsv, ";"); byType(jcsv.render(), "switch")[0].props.onChange(false); button(jcsv, "Convert").props.onClick();
    assert.equal(byType(jcsv.render(), "editor")[1].props.value, '9223372036854775807;0.9999999999999999999;"日本語 العربية, """;a|b');
    localeMatrix(jcsv, "JSON to CSV Converter");
    edit(jcsv, "{invalid"); button(jcsv, "Convert").props.onClick(); assert.equal(byType(jcsv.render(), "editor")[1].props.value, "");
    for (const lang of LANGUAGES) { jcsv.language(lang.id); const alert = byType(jcsv.render(), "alert")[0]; assert.equal(alert.props.title, translate(lang.id, "Conversion failed. Check the input and options, then try again.")); assert.equal(alert.props.description.props.dir, "ltr"); assert.equal(button(jcsv, "Download", lang.id).props.disabled, true); }
    localeMatrix(jcsv, "JSON to CSV Converter"); jcsv.language("en"); button(jcsv, "Clear").props.onClick(); assert.equal(byType(jcsv.render(), "alert").length, 0);
    const beforeDownload = jcsv.downloads.length; button(jcsv, "Download").props.onClick(); assert.equal(jcsv.downloads.length, beforeDownload, "Empty download guard");

    const xslt = harness("xslt-transformer"); xslt.render();
    const sourceXml = '<root id="01">日本語 العربية 0.9999999999999999999</root>', sourceXslt = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:template match="/"><result><xsl:value-of select="root"/></result></xsl:template></xsl:stylesheet>';
    edit(xslt, sourceXml); edit(xslt, sourceXslt, 1); button(xslt, "Transform").props.onClick();
    assert.deepEqual(xslt.transforms, [{ xml: sourceXml, xslt: sourceXslt }]);
    assert.equal(byType(xslt.render(), "editor")[2].props.value, '<result id="01">日本語 العربية &amp; 0.9999999999999999999</result>');
    localeMatrix(xslt, "XSLT Transformer");
    for (const lang of LANGUAGES) { xslt.language(lang.id); await button(xslt, "Copy", lang.id).props.onClick(); assert.equal(xslt.copied.at(-1)?.value, '<result id="01">日本語 العربية &amp; 0.9999999999999999999</result>'); }
    xslt.language("en"); xslt.fail(diagnostic); button(xslt, "Transform").props.onClick();
    for (const lang of LANGUAGES) { xslt.language(lang.id); const alert = byType(xslt.render(), "alert")[0]; assert.equal(alert.props.title, translate(lang.id, "Transformation failed. Check the XML and XSLT, then try again.")); assert.equal(visible(alert.props.description).trim(), diagnostic); }
    localeMatrix(xslt, "XSLT Transformer");
    console.log("Data converters: seven routes, eight authored languages; actual JSON/YAML/CSV functions and XML DOM traversal, stable values, precision strings, Unicode, raw diagnostics, all-locale state/memo guards, query alias and callback/download/bridge/share paths pass. Browser XSLTProcessor and Monaco lifecycle require production browser verification.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

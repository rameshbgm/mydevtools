import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { REFERENCE_STANDARDS_TRANSLATIONS as rows } from "../src/lib/i18n/reference-standards";

const require = createRequire(import.meta.url), jsx = require("react/jsx-runtime"), React = require("react");
const tr = (locale: Language, source: string, values?: Record<string, string | number>) => {
    let copy = locale === "en" ? source : rows[source]?.[LANGUAGES.findIndex(l => l.id === locale) - 1] ?? translate(locale, source);
    for (const [key, value] of Object.entries(values ?? {})) copy = copy.replaceAll(`{${key}}`, String(value));
    return copy;
};
const placeholders = (value: string) => (value.match(/\{\w+\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(rows)) {
    assert.equal(columns.length, 7, source);
    if (SHARED_TRANSLATIONS[source]) assert.deepEqual(columns, SHARED_TRANSLATIONS[source], `Existing vocabulary: ${source}`);
    columns.forEach((value, index) => {
        assert.ok(value.trim()); assert.deepEqual(placeholders(value), placeholders(source));
        if (!process.env.REFERENCE_STANDARDS_STAGE) assert.equal(translate(LANGUAGES[index + 1].id, source), value, source);
    });
}
type Element = { type: unknown; props: Record<string, any> };
const text = (node: any): string => node == null || typeof node === "boolean" ? "" : Array.isArray(node) ? node.map(text).join("") : typeof node === "object" ? text(node.props?.children) : String(node);
function harness(id: "http-status-codes" | "rfc-standards") {
    const source = readFileSync(`src/app/tools/${id}/page.tsx`, "utf8"), ast = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), names: string[] = [];
    assert.equal((ast as ts.SourceFile & { parseDiagnostics: ts.Diagnostic[] }).parseDiagnostics.length, 0);
    const collect = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(ast) === "useState") names.push(node.name.elements[0].getText(ast)); ts.forEachChild(node, collect); }; collect(ast);
    const cells: Record<string, any> = {}; let slot = 0, locale: Language = "en", tree: Element;
    const component = (name: string) => (props: any) => React.createElement(name, props, props.children);
    const module = { exports: {} as { default: () => Element; data: any[] } };
    const dependencies = (name: string): any => {
        if (name === "react") return { ...React, useState: (initial: any) => { const key = names[slot++]; if (!Object.hasOwn(cells, key)) cells[key] = typeof initial === "function" ? initial() : initial; return [cells[key], (value: any) => { cells[key] = typeof value === "function" ? value(cells[key]) : value; }]; }, useMemo: (compute: () => unknown) => compute() };
        if (name === "react/jsx-runtime") return jsx;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => { const language = locale; return { t: (key: string, values?: Record<string,string|number>) => tr(language, key, values) }; } };
        if (name.endsWith("reference-standards")) return { REFERENCE_STANDARDS_TRANSLATIONS: rows };
        if (name === "antd") return new Proxy({ Typography: { Text: "text", Title: "title", Paragraph: "paragraph" } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => component("icon") });
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: component("layout") };
        throw new Error(`Unexpected import ${name}`);
    };
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText + `\nmodule.exports.data = ${id === "http-status-codes" ? "STATUS_CODES" : "RFC_STANDARDS"};`, { module, exports: module.exports, require: dependencies });
    const render = (language: Language = locale) => { locale = language; slot = 0; tree = module.exports.default(); return tree; };
    const all = () => { const result: Element[] = [], seen = new Set(); const walk = (node: any) => { if (!node || typeof node !== "object" || seen.has(node)) return; seen.add(node); if (Array.isArray(node)) return node.forEach(walk); if (node.props) { result.push(node); ["children", "title", "description", "label", "extra"].forEach(k => walk(node.props[k])); for (const item of node.props.items ?? []) { walk(item.label); walk(item.children); } } }; walk(tree); return result; };
    const search = (query: string) => { const input = all().find(n => n.props["aria-label"] === tr(locale, "Search references")); assert.ok(input); input.props.onChange({ target: { value: query } }); render(); };
    const stable = () => { const originalLocale = locale; const state = JSON.stringify(cells), reference = JSON.stringify(module.exports.data); for (const language of LANGUAGES) { render(language.id); assert.equal(JSON.stringify(cells), state); assert.equal(JSON.stringify(module.exports.data), reference); } render(originalLocale); };
    return { source, data: module.exports.data, cells, render, all, search, stable, text: () => text(tree) };
}
const plain = <T>(value: T): T => JSON.parse(JSON.stringify(value));

function main() {
    const http = harness("http-status-codes"), rfc = harness("rfc-standards");
    assert.equal(http.data.length, 63); assert.equal(rfc.data.length, 72);
    // Snapshot facts verified from IANA and RFC Editor primary records on 2026-10-21.
    const code = (value: number) => http.data.find(row => row.code === value);
    assert.match(code(104).description, /Temporary.*2026-11-13.*2026-10-21/);
    assert.equal(code(104).name, "Upload Resumption Supported"); assert.equal(code(104).rfcUrl, "https://www.iana.org/assignments/http-status-codes");
    assert.equal(code(102).rfc, "RFC 2518 (WebDAV)"); assert.match(code(102).rfcUrl, /rfc2518/);
    assert.match(code(303).description, /GET or HEAD/); assert.match(code(414).description, /no universal/); assert.match(code(429).description, /Retry-After is optional/); assert.match(code(510).description, /Obsoleted/);
    assert.match(code(409).description, /If-Match.*412/); assert.equal(code(409).example, "A write conflicts with an existing unique resource");
    assert.equal(new Set(http.data.map(row => row.code)).size, 63); assert.equal(new Set(rfc.data.map(row => row.rfc)).size, 72);
    const byRfc = Object.fromEntries(rfc.data.map(row => [row.rfc, row]));
    const maturity: Record<string, string[]> = {
        "Internet Standard": ["9110", "9111", "9112", "1035", "6376", "3986", "8259", "9293"],
        "Draft Standard": ["5321", "5322"],
        "Best Current Practice": ["9700", "8725", "8252", "9325"],
        "Informational": ["7034", "7489", "8017", "7748", "8032", "9106", "7914", "9512"],
        "Proposed Standard": ["7519", "7515", "7516", "7517", "7518", "6749", "6750", "7636", "7662", "7009", "7033", "9113", "9114", "7541", "8446", "5246", "6066", "6797", "7469", "6454", "6455", "7231", "8484", "7858", "7208", "6570", "6901", "6902", "7396", "7807", "4918", "5789", "9000", "9001", "4648", "3339", "9562", "9460", "8693", "8414", "7725", "9457", "9421", "9530", "9651", "9580", "9846", "9989", "9990", "9991"],
    };
    assert.equal(Object.values(maturity).flat().length, 72);
    for (const [status, ids] of Object.entries(maturity)) for (const number of ids) assert.equal(byRfc[`RFC ${number}`].status, status, number);
    assert.deepEqual(plain(byRfc["RFC 8446"].obsoletedBy), ["RFC 9846"]); assert.deepEqual(plain(byRfc["RFC 7489"].obsoletedBy), ["RFC 9989", "RFC 9990", "RFC 9991"]);
    assert.equal(byRfc["RFC 9846"].year, 2026); assert.equal(byRfc["RFC 9846"].url, "https://www.rfc-editor.org/rfc/rfc9846.html");
    for (const id of ["http-status-codes", "rfc-standards"] as const) {
        const page = harness(id), ast = ts.createSourceFile(id, page.source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
        const inspect = (node: ts.Node) => { if (ts.isCallExpression(node) && node.expression.getText(ast) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(rows[node.arguments[0].text]); if (ts.isJsxText(node) && /[A-Za-z]/.test(node.text.trim())) assert.equal(node.text.trim(), "DELETE:", `${id}: ${node.text.trim()}`); ts.forEachChild(node, inspect); }; inspect(ast);
        assert.doesNotMatch(page.source, /\b(?:fetch|XMLHttpRequest)\s*\(/); assert.doesNotMatch(page.source, /key=\{(?:language|direction|locale)\}/);
        page.data.forEach(record => { assert.ok(rows[record.description], record.description); if (record.useCase) assert.ok(rows[record.useCase], record.useCase); });
        for (const { id: language } of LANGUAGES) {
            page.render(language);
            const status = page.all().find(n => n.props.role === "status"); assert.ok(status); assert.equal(text(status), tr(language, id === "http-status-codes" ? "Showing {shown} of {total} status codes" : "Showing {shown} of {total} standards", { shown: page.data.length, total: page.data.length }));
            if (id === "http-status-codes") {
                const collapses = page.all().filter(n => n.props.items?.[0]?.key && typeof n.props.items[0].key === "number"); assert.ok(collapses.length); const entries = collapses.flatMap(n => n.props.items); assert.equal(entries.length, 63);
                for (const record of page.data) { const item = entries.find(item => item.key === record.code); assert.ok(item); assert.ok(text(item.label).includes(record.name)); assert.ok(text(item.children).includes(tr(language, record.description))); if (record.useCase) assert.ok(text(item.children).includes(tr(language, record.useCase))); if (record.example) assert.ok(text(item.children).includes(record.example)); }
                collapses[0].props.onChange(["104"]); page.render(); assert.deepEqual(plain(page.cells.expandedCodes), ["104"]); page.stable();
                page.search("permanent method-preserving redirect"); const shown = page.all().find(n => n.props.role === "status"); assert.equal(text(shown), tr(language, "Showing {shown} of {total} status codes", { shown: 1, total: 63 })); assert.ok(page.all().some(n => n.props.items?.some((item: any) => item.key === 308)), "Use-case search is operational");
                page.search(tr("fr", code(429).useCase)); assert.ok(page.all().some(n => n.props.items?.some((item: any) => item.key === 429)), "Translated use-case search works in every locale");
                page.search(""); const category = page.all().find(n => typeof n.props.onClick === "function" && text(n).includes(tr(language, "4xx Client Error"))); assert.ok(category); category.props.onClick(); page.render(); const filtered = page.all().filter(n => n.props.items?.[0]?.key && typeof n.props.items[0].key === "number").flatMap(n => n.props.items); assert.ok(filtered.every(item => item.key >= 400 && item.key < 500)); assert.ok(filtered.length > 0); page.stable();
                const selected = page.all().find(n => typeof n.props.onClick === "function" && text(n).includes(tr(language, "4xx Client Error"))); selected!.props.onClick(); page.render(); assert.equal(page.cells.selectedCategory, null);
                let prevented = 0; const keyboardCategory = page.all().find(n => n.props.role === "button" && text(n).includes(tr(language,"4xx Client Error"))); keyboardCategory!.props.onKeyDown({ key: " ", preventDefault: () => prevented++ }); page.render(); assert.equal(page.cells.selectedCategory,"client-error"); const allButton = page.all().find(n => n.props.role === "button" && n.props["aria-pressed"] === false && text(n) === tr(language,"All ({count})", {count:63})); assert.ok(allButton); allButton.props.onKeyDown({ key:"Enter", preventDefault:()=>prevented++ }); page.render(); assert.equal(page.cells.selectedCategory,null); assert.equal(prevented,2);
            } else {
                const tables = page.all().filter(n => n.props.rowKey === "rfc"); assert.equal(tables.reduce((count,n) => count+n.props.dataSource.length,0),72);
                for (const table of tables) for (const record of table.props.dataSource) { const link = table.props.columns.find((c: any) => c.dataIndex === "rfc").render(record.rfc, record); assert.equal(link.props.href,record.url); assert.equal(text(link),record.rfc); const title = table.props.columns.find((c: any) => c.dataIndex === "title").render(record.title, record); assert.ok(text(title).includes(record.title)); assert.ok(text(title).includes(tr(language,record.description))); const status = table.props.columns.find((c:any) => c.dataIndex === "status").render(record.status); assert.equal(text(status),tr(language,record.status)); }
                const collapse = page.all().find(n => n.props.activeKey && typeof n.props.onChange === "function" && n.props.items?.[0]?.children?.props?.rowKey === "rfc"); assert.ok(collapse); collapse.props.onChange(["HTTP"]); page.render(); assert.deepEqual(plain(page.cells.expandedCategories),["HTTP"]); page.stable();
                page.search("RFC 9846"); const table = page.all().find(n=>n.props.rowKey==="rfc"&&n.props.dataSource.some((r:any)=>r.rfc==="RFC 9846")); assert.ok(table); page.stable();
                page.search(tr("ja",byRfc["RFC 9990"].description)); assert.ok(page.all().some(n=>n.props.rowKey==="rfc"&&n.props.dataSource.some((r:any)=>r.rfc==="RFC 9990")),"Localized explanations are searchable in every locale");
                page.search(""); const tabs = page.all().find(n=>n.props.items?.some((item:any)=>item.key==="all")&&typeof n.props.onChange==="function"); assert.ok(tabs); tabs.props.onChange("Security - OAuth"); page.render(); const list = page.all().find(n=>n.props.rowKey==="rfc"); assert.ok(list); assert.ok(list.props.dataSource.every((r:any)=>r.category==="Security - OAuth")); page.stable(); tabs.props.onChange("all"); page.render();
            }
            page.search("public fixture no match 1234567890"); const count = page.all().find(n=>n.props.role==="status"); assert.equal(text(count),tr(language,id==="http-status-codes"?"Showing {shown} of {total} status codes":"Showing {shown} of {total} standards",{shown:0,total:page.data.length})); page.search("");
        }
    }
    console.log("Reference standards: all eight languages, 63 HTTP / 72 RFC entries, independent dated maturity/replacement facts, actual multilingual search/category/count/collapse callbacks and immutable official titles/URLs/example bytes passed. No browser or live-registry conformance claim.");
}
main();

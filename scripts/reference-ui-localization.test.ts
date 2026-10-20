/* eslint-disable @typescript-eslint/no-explicit-any -- Actual page fixtures model heterogeneous table/control props. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as React from "react";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { REFERENCE_UI_TRANSLATIONS } from "../src/lib/i18n/reference-ui";
import { LLM_MODELS, LLM_PROVIDERS, PRICES_LAST_VERIFIED } from "../src/lib/llm-models";
const placeholders = (text: string) => (text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(REFERENCE_UI_TRANSLATIONS)) {
    assert.equal(columns.length, 7);
    columns.forEach((value, index) => { assert.ok(value.trim()); assert.deepEqual(placeholders(value), placeholders(source)); assert.equal(translate(LANGUAGES[index + 1].id, source), value); });
}
for (const id of ["mime-types", "model-pricing-reference"]) {
    const file = `src/app/tools/${id}/page.tsx`, source = readFileSync(file, "utf8"), ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(ast) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(SHARED_TRANSLATIONS[node.arguments[0].text], `${id}: missing ${node.arguments[0].text}`);
        if (ts.isJsxText(node)) assert.doesNotMatch(node.text, /[a-zA-Z]/, `${id}: raw authored UI`);
        ts.forEachChild(node, visit);
    }; visit(ast);
}
const nativeRequire = createRequire(import.meta.url), jsx = nativeRequire("react/jsx-runtime");
type Node = { type: unknown; props: Record<string, any> };
function walk(value: any, out: Node[] = []): Node[] {
    if (!value || typeof value !== "object") return out;
    if (Array.isArray(value)) { value.forEach((child) => walk(child, out)); return out; }
    if (typeof value.type === "function") return walk(value.type(value.props), out);
    if (!value.props) return out;
    out.push(value);
    for (const key of ["children", "title", "description"]) walk(value.props[key], out);
    return out;
}
function harness(id: string) {
    let language: Language = "en", cursor = 0, parses = 0;
    const hooks: { value: any; deps?: unknown[] }[] = [], copies: string[] = [];
    const react = { ...React, useState: (initial: any) => { const n = cursor++; hooks[n] ??= { value: initial }; return [hooks[n].value, (next: any) => { hooks[n].value = typeof next === "function" ? next(hooks[n].value) : next; }]; }, useMemo: (factory: () => any, deps: unknown[]) => { const n = cursor++; if (!hooks[n] || deps.some((value, index) => value !== hooks[n].deps![index])) { parses++; hooks[n] = { value: factory(), deps }; } return hooks[n].value; } };
    const component = (name: string) => function ReferenceFixture(props: Record<string, unknown>) { return React.createElement(name, props); };
    const compiled = { exports: {} as { default: () => React.ReactNode } };
    const code = ts.transpileModule(readFileSync(`src/app/tools/${id}/page.tsx`, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: (name: string): any => {
        if (name === "react") return react;
        if (name === "react/jsx-runtime") return jsx;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, t: (text: string, values?: Record<string, string | number>) => translate(language, text, values) }) };
        if (name === "antd") return new Proxy({ Typography: { Text: component("Text") } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name === "@ant-design/icons") return new Proxy({}, { get: (_target, key) => component(String(key)) });
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: component("Layout") };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copies.push(value); return true; } };
        if (name.endsWith("llm-models")) return { LLM_MODELS, LLM_PROVIDERS, PRICES_LAST_VERIFIED };
        throw new Error(`Unexpected reference dependency ${name}`);
    } });
    let latest: Node[] = [];
    const render = (next: Language) => { language = next; cursor = 0; latest = walk(compiled.exports.default()); return latest; };
    const find = (type: string, predicate: (node: Node) => boolean = () => true) => { const found = latest.find((node) => node.type === type && predicate(node)); assert.ok(found, `Missing ${id}/${type}`); return found; };
    return { render, find, copies, parses: () => parses };
}
async function main() {
const modelSnapshot = JSON.stringify(LLM_MODELS);
for (const { id: language } of LANGUAGES) {
    const mime = harness("mime-types"); mime.render(language);
    let table = mime.find("Table");
    assert.ok(table.props.dataSource.some((row: any) => row.type === "application/octet-stream"));
    assert.equal(new Set(table.props.dataSource.map((row: any) => row.type)).size, table.props.dataSource.length, "Each media type appears once in the curated table");
    assert.ok(table.props.dataSource.some((row: any) => row.type === "application/yaml"));
    assert.ok(!table.props.dataSource.some((row: any) => ["text/yaml", "font/eot"].includes(row.type)));
    mime.find("Input").props.onChange({ target: { value: ".eot" } }); mime.render(language); table = mime.find("Table");
    assert.equal(table.props.dataSource.length, 1); assert.equal(table.props.dataSource[0].type, "application/vnd.ms-fontobject");
    const typeColumn = table.props.columns.find((column: any) => column.dataIndex === "type");
    const copy = walk(typeColumn.render(table.props.dataSource[0].type)).find((node) => node.type === "Button"); assert.ok(copy); await copy.props.onClick();
    assert.equal(mime.copies[0], "application/vnd.ms-fontobject");
    const category = table.props.columns.find((column: any) => column.dataIndex === "category");
    assert.ok(category.filters.some((filter: any) => filter.value === "Font" && filter.text === translate(language, "Font")));
    assert.equal(category.onFilter("Font", table.props.dataSource[0]), true);
    const parsed = mime.parses(); mime.render("ar"); mime.render("ja"); assert.equal(mime.parses(), parsed); assert.equal(mime.find("Input").props.value, ".eot");
    assert.equal(mime.find("Table").props.dataSource[0].type, "application/vnd.ms-fontobject");
    const pricing = harness("model-pricing-reference"); pricing.render(language);
    let prices = pricing.find("Table"); assert.equal(prices.props.dataSource.length, LLM_MODELS.length);
    pricing.find("Select").props.onChange("Google"); pricing.render(language); prices = pricing.find("Table");
    assert.ok(prices.props.dataSource.length); assert.ok(prices.props.dataSource.every((model: any) => model.provider === "Google"));
    const before = pricing.parses(); pricing.render("ar"); pricing.render("fr"); assert.equal(pricing.parses(), before); assert.equal(pricing.find("Select").props.value, "Google");
    const columns = pricing.find("Table").props.columns, model = LLM_MODELS[0];
    const link = walk(columns.find((column: any) => column.key === "model").render(null, model)).find((node) => node.type === "a");
    assert.equal(link?.props.href, model.pricingUrl); assert.equal(link?.props.children, model.label);
    const input = columns.find((column: any) => column.key === "inputPrice");
    assert.equal(input.render(0.075), "$0.075", "Sub-cent rates must not be rounded into a different advertised price");
    const context = columns.find((column: any) => column.key === "contextWindow");
    assert.equal(context.render(1048576), "1,048,576", "Show the exact context limit, not a rounded K/M estimate");
    for (const row of LLM_MODELS) for (const key of ["inputPrice", "outputPrice", "cachedInputPrice"] as const) {
        if (row[key] === undefined) continue;
        const column = columns.find((entry: any) => entry.key === key), rendered = column.render(row[key]);
        assert.equal(Number(String(rendered).replace(/[$,]/g, "")), row[key]);
    }
    const historical = walk(columns.find((column: any) => column.key === "review").render(null, { ...model, verifiedAt: undefined, pricingNote: undefined }));
    assert.ok(historical.some((node) => node.type === "span" && node.props.children.includes(translate("fr", "Historical · verify before use"))));
    pricing.find("Input").props.onChange({ target: { value: "provider-that-does-not-exist" } }); pricing.render("fr"); assert.equal(pricing.find("Table").props.dataSource.length, 0);
}
assert.equal(JSON.stringify(LLM_MODELS), modelSnapshot, "Reference rendering never rewrites model IDs, metadata, rates, dates or URLs");
console.log("Reference interfaces: eight-language MIME/model controls and help, actual search/filter/copy callbacks, registered YAML/EOT examples, exact raw identifiers/prices/URLs and stable locale transitions pass without browser/UI verification.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

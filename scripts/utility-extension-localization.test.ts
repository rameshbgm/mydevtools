import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { UTILITY_EXTENSION_TRANSLATIONS } from "../src/lib/i18n/utility-extensions";
import * as secretEngine from "../src/lib/random-secrets";
import * as htmlEngine from "../src/lib/html-markdown";

for (const [source, columns] of Object.entries(UTILITY_EXTENSION_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog integration: ${source}`);
    const placeholders = (text: string) => (text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
    for (const [index, text] of columns.entries()) {
        assert.ok(text.trim(), `${source}/${index}`);
        assert.deepEqual(placeholders(text), placeholders(source), source);
        assert.equal(translate(LANGUAGES[index + 1].id, source), text, source);
    }
}

// Authored labels, help and accessible editor names must reach the catalog;
// code samples and protocol names remain literal user content.
for (const path of ["src/app/tools/sql-formatter/page.tsx", "src/components/BulkSecretGenerator.tsx", "src/components/HtmlMarkdownConverter.tsx", "src/app/tools/markdown-preview/page.tsx"]) {
    const source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const check = (text: string) => assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, text), `${path}: ${text}`);
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node)) assert.equal(node.text.trim(), "", `Untranslated JSX in ${path}: ${node.text}`);
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "t") {
            const arg = node.arguments[0];
            if (arg && ts.isStringLiteral(arg)) check(arg.text);
            if (arg && ts.isConditionalExpression(arg)) for (const part of [arg.whenTrue, arg.whenFalse]) if (ts.isStringLiteral(part)) check(part.text);
        }
        if (ts.isJsxAttribute(node) && ["title", "description"].includes(node.name.getText()) && node.initializer && ts.isStringLiteral(node.initializer) && node.initializer.text !== "Markdown") check(node.initializer.text);
        if (ts.isPropertyAssignment(node) && ["whatIs", "whyUse", "howToUse", "tips", "useCases"].includes(node.name.getText())) {
            const values = ts.isArrayLiteralExpression(node.initializer) ? node.initializer.elements : [node.initializer];
            for (const value of values) if (ts.isStringLiteral(value)) check(value.text);
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
}

// Exercise the actual client handlers with a small hook harness. This checks
// language changes without remounting or replacing drafts, not a copied model.
const nodeRequire = createRequire(`${process.cwd()}/package.json`);
type Element = { type: unknown; props: Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any
function harness(path: string) {
    const values: unknown[] = []; let cursor = 0, language: Language = "en";
    let copied = "", downloaded = "";
    const useState = (initial: unknown) => {
        const index = cursor++;
        if (!(index in values)) values[index] = initial;
        return [values[index], (next: unknown) => { values[index] = typeof next === "function" ? (next as (old: unknown) => unknown)(values[index]) : next; }];
    };
    const moduleRecord = { exports: {} as { default: (props: Record<string, unknown>) => Element } };
    const require = (name: string) => {
        if (name === "react") return { useState };
        if (name === "@/components/LanguageProvider") return { useLanguage: () => ({ t: (source: string, params?: Record<string, string | number>) => translate(language, source, params) }) };
        if (name === "@/lib/random-secrets") return secretEngine;
        if (name === "@/lib/html-markdown") return htmlEngine;
        if (name === "@/lib/clipboard") return { copyToClipboard: async (text: string) => { copied = text; return true; } };
        if (name === "@/lib/download") return { downloadText: (text: string) => { downloaded = text; } };
        return nodeRequire(name);
    };
    const code = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: moduleRecord, exports: moduleRecord.exports, require, Error });
    return {
        render: (props: Record<string, unknown> = {}) => { cursor = 0; return moduleRecord.exports.default(props); },
        setLanguage: (next: Language) => { language = next; },
        copied: () => copied, downloaded: () => downloaded,
    };
}
function elements(node: unknown): Element[] {
    if (Array.isArray(node)) return node.flatMap(elements);
    if (!node || typeof node !== "object" || !("props" in node)) return [];
    const element = node as Element;
    return [element, ...elements(element.props.children)];
}
function byType(root: Element, type: string) { return elements(root).filter((element) => element.type === type); }
function button(root: Element, label: string) { const found = byType(root, "button").find((element) => element.props.children === label); assert.ok(found, label); return found; }

async function main() {
const secrets = harness("src/components/BulkSecretGenerator.tsx");
let secretTree = secrets.render();
byType(secretTree, "select")[0].props.onChange({ target: { value: "custom" } });
secretTree = secrets.render();
assert.equal(byType(secretTree, "select")[0].props.value, "custom", "Custom selection stays selected before editing");
assert.equal(byType(secretTree, "input")[2].props.value, secretEngine.SECRET_ALPHABETS.base64url, "Selecting Custom preserves the alphabet draft");
byType(secretTree, "input")[2].props.onChange({ target: { value: "😀甲عA" } });
byType(secretTree, "input")[0].props.onChange({ target: { value: "12" } });
byType(secretTree, "input")[1].props.onChange({ target: { value: "4" } });
secretTree = secrets.render();
button(secretTree, "Generate bulk secrets").props.onClick();
secretTree = secrets.render();
const generated = byType(secretTree, "textarea")[0].props.value as string;
assert.equal(generated.split("\n").length, 4);
for (const value of generated.split("\n")) { assert.equal([...value].length, 12); assert.ok([...value].every((char) => [..."😀甲عA"].includes(char))); }
for (const language of LANGUAGES) {
    secrets.setLanguage(language.id);
    secretTree = secrets.render();
    assert.equal(byType(secretTree, "textarea")[0].props.value, generated, "Language change preserves generated output");
    assert.equal(byType(secretTree, "textarea")[0].props.dir, "ltr");
    assert.equal(byType(secretTree, "input")[2].props.value, "😀甲عA");
    await button(secretTree, translate(language.id, "Copy generated secrets")).props.onClick();
    button(secretTree, translate(language.id, "Download secrets")).props.onClick();
    assert.equal(secrets.copied(), generated); assert.equal(secrets.downloaded(), generated);
}
secrets.setLanguage("en"); secretTree = secrets.render();
byType(secretTree, "input")[2].props.onChange({ target: { value: "AA" } });
secretTree = secrets.render(); button(secretTree, "Generate bulk secrets").props.onClick();
for (const language of LANGUAGES) {
    secrets.setLanguage(language.id); secretTree = secrets.render();
    const alert = elements(secretTree).find((element) => element.props.role === "alert"); assert.ok(alert);
    assert.ok(elements(alert).some((element) => element.props.children === translate(language.id, "Use 2–256 unique characters without tabs, newlines or control characters.")));
}

const html = harness("src/components/HtmlMarkdownConverter.tsx"); let converted = "";
const props = { onConverted: (value: string) => { converted = value; } };
let htmlTree = html.render(props);
const publicSource = '<h1>日本語 العربية</h1><script>alert(1)</script><p><a href="javascript:alert(1)">unsafe</a> <strong>safe</strong></p>';
byType(htmlTree, "textarea")[0].props.onChange({ target: { value: publicSource } });
htmlTree = html.render(props);
await button(htmlTree, "Convert into Markdown editor").props.onClick();
assert.ok(converted.includes("# 日本語 العربية")); assert.ok(converted.includes("**safe**"));
assert.equal(converted.includes("javascript:"), false); assert.equal(converted.includes("alert(1)"), false);
for (const language of LANGUAGES) {
    html.setLanguage(language.id); htmlTree = html.render(props);
    assert.equal(byType(htmlTree, "textarea")[0].props.value, publicSource);
    assert.equal(byType(htmlTree, "textarea")[0].props.dir, "ltr");
    assert.ok(elements(htmlTree).some((element) => element.props.role === "status" && element.props.children === translate(language.id, "Converted HTML into the Markdown editor below.")));
}
await byType(htmlTree, "input")[0].props.onChange({ target: { files: [{ size: 1024 * 1024 + 1 }], value: "" } });
html.setLanguage("ar"); htmlTree = html.render(props);
const htmlAlert = elements(htmlTree).find((element) => element.props.role === "alert"); assert.ok(htmlAlert);
assert.ok(elements(htmlAlert).some((element) => element.props.children === translate("ar", "HTML file limit is 1 MiB.")));
assert.equal(byType(htmlTree, "textarea")[0].props.value, publicSource, "Oversized file does not replace an existing source");
console.log("Utility extension localization passed: 8 languages, SQL/Markdown help and aria, custom secret presets, exact Unicode copy/download, draft/output retention, localized recovery and sanitized HTML conversion.");

}
void main().catch((error) => { console.error(error); process.exitCode = 1; });

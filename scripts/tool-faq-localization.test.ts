import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as React from "react";
import { SEO_CONTENT } from "../src/lib/seo-content";
import { toolsRegistry } from "../src/lib/tools-registry";
import { toolPath } from "../src/lib/category-routes";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { TOOL_FAQ_TRANSLATIONS } from "../src/lib/i18n/tool-faq";
const integrated = !!SHARED_TRANSLATIONS["Does this send my documents to a server?"];
function tr(language: Language, source: string) {
    const index = LANGUAGES.findIndex((item) => item.id === language) - 1;
    return index < 0 ? source : TOOL_FAQ_TRANSLATIONS[source]?.[index] ?? translate(language, source);
}
for (const [source, columns] of Object.entries(TOOL_FAQ_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    columns.forEach((text, index) => { assert.ok(text.trim(), source); if (integrated) assert.equal(translate(LANGUAGES[index + 1].id, source), text, source); });
}
const require = createRequire(resolve("package.json"));
let currentPath = "/", language: Language = "en";
const component = (name: string) => function Component(props: Record<string, unknown>) { return React.createElement(name, props); };
const code = ts.transpileModule(readFileSync("src/components/ToolPageLayout.tsx", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
const compiled = { exports: {} as { default: (props: Record<string, unknown>) => React.ReactNode } };
runInNewContext(code, { module: compiled, exports: compiled.exports, require: (name: string): unknown => {
    if (name === "react/jsx-runtime") return require(name);
    if (name === "react") return { ...React, useMemo: (factory: () => unknown) => factory(), useId: () => "faq-fixture" };
    if (name === "next/navigation") return { usePathname: () => currentPath };
    if (name === "next/link") return { __esModule: true, default: component("Link") };
    if (name === "framer-motion") return { motion: { div: component("MotionDiv") } };
    if (name === "antd") return new Proxy({ Typography: { Title: component("Title"), Text: component("Text"), Paragraph: component("Paragraph") } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
    if (name === "@ant-design/icons") return new Proxy({}, { get: (_target, key) => component(String(key)) });
    if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t: (source: string) => tr(language, source) }) };
    if (name.endsWith("ServerProxyNotice")) return { __esModule: true, default: () => null };
    if (name.endsWith("ReferenceProvenance")) return { __esModule: true, default: () => null };
    if (name.startsWith("@/lib/")) return require(resolve(`src/lib/${name.slice(6)}`));
    throw new Error(`Unexpected FAQ import ${name}`);
} });
type Element = { type: unknown; props: Record<string, unknown> };
function flatten(value: unknown, output: Element[] = []): Element[] {
    if (Array.isArray(value)) { value.forEach((child) => flatten(child, output)); return output; }
    if (!value || typeof value !== "object") return output;
    const node = value as Element;
    if (typeof node.type === "function") return flatten(node.type(node.props), output);
    if (!node.props) return output; output.push(node);
    for (const key of ["children", "title", "label"]) flatten(node.props[key], output);
    return output;
}
let groups = 0, questions = 0;
for (const [id, seo] of Object.entries(SEO_CONTENT)) {
    if (!seo.faq?.length) continue;
    groups++; questions += seo.faq.length;
    const tool = toolsRegistry.find((tool) => tool.id === id); assert.ok(tool, id);
    currentPath = toolPath(tool);
    for (const current of LANGUAGES) {
        language = current.id;
        for (const item of seo.faq) for (const text of [item.q, item.a]) {
            assert.ok(TOOL_FAQ_TRANSLATIONS[text] || SHARED_TRANSLATIONS[text], `${id}: missing FAQ copy ${text}`);
            if (language !== "en") assert.notEqual(tr(language, text), text, `${id}/${language}: FAQ falls back to English`);
        }
        const tree = flatten(compiled.exports.default({ title: tool.name, description: tool.description, icon: null, color: "#08979c", children: null }));
        const faq = tree.find((node) => node.type === "Collapse" && Array.isArray(node.props.items) && (node.props.items as Record<string, unknown>[]).some((item) => item.key === "faq-0"));
        assert.ok(faq, `${id}/${language}: actual FAQ slot missing`);
        const items = faq.props.items as { key: string; label: unknown; children: unknown }[];
        assert.equal(items.length, seo.faq.length);
        items.forEach((item, index) => {
            assert.equal(flatten(item.label).find((node) => node.type === "Text")?.props.children, tr(language, seo.faq![index].q));
            assert.equal(flatten(item.children).find((node) => node.type === "Paragraph")?.props.children, tr(language, seo.faq![index].a));
        });
    }
}
const answers = (id: string) => SEO_CONTENT[id].faq!.map((item) => item.a).join(" ");
assert.match(answers("rag-search"), /91 MB.*FP32/); assert.doesNotMatch(answers("rag-search"), /25 MB|one-time|only network request/);
assert.match(readFileSync("src/app/tools/rag-search/page.tsx", "utf8"), /dtype: "fp32"/);
assert.match(answers("coin-toss"), /Math\.random\(\).*pseudorandom/); assert.doesNotMatch(answers("coin-toss"), /cryptographically unpredictable/);
assert.match(answers("jsonl-validator"), /not authoritative/);
assert.match(answers("toon-converter"), /precision-sensitive.*quoted explicitly/); assert.match(answers("toon-converter"), /XML mapping is lossy/); assert.doesNotMatch(answers("toon-converter"), /30–50%/);
assert.match(answers("timer"), /may block sound/);
assert.match(answers("spin-wheel"), /active workspace.*storage is available/);
assert.match(answers("token-counter"), /only after you choose Send/);
assert.match(answers("mcp-inspector"), /direct-strict without fallback/);
assert.match(answers("a2a-inspector"), /partial structural review/);
console.log(`Tool FAQs: ${groups} actual route groups / ${questions} rendered question-answer pairs checked in eight languages; ${Object.keys(TOOL_FAQ_TRANSLATIONS).length} new rows and known privacy/precision/model/randomness boundaries verified.`);

import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as React from "react";
import { toolsRegistry } from "../src/lib/tools-registry";
import { toolPath } from "../src/lib/category-routes";
import { dataBoundaryForTool, BOUNDARY_LABELS } from "../src/lib/data-boundaries";
import { TOOL_HELP } from "../src/lib/tool-help";
import { TOOL_NETWORK_DISCLOSURES } from "../src/lib/tool-network-disclosures";
import { LANGUAGES, translate } from "../src/lib/i18n/catalog";
import { SEO_CONTENT } from "../src/lib/seo-content";

type Element = { type: unknown; props: Record<string, unknown> };
const nativeRequire = createRequire(import.meta.url);
let path = "/", language: (typeof LANGUAGES)[number]["id"] = "en";
const component = (name: string) => function GuidanceFixture(props: Record<string, unknown>) { return React.createElement(name, props); };
const noticeMarker = component("NetworkNotice");
function load(file: string, overrides: Record<string, unknown> = {}) {
    const source = readFileSync(file, "utf8");
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const compiled = { exports: {} as { default: (props: Record<string, unknown>) => React.ReactNode } };
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: (name: string): unknown => {
        if (name in overrides) return overrides[name];
        if (name === "react/jsx-runtime") return nativeRequire(name);
        if (name === "react") return { ...React, useMemo: (factory: () => unknown) => factory(), useId: () => "guidance-fixture" };
        if (name === "next/navigation") return { usePathname: () => path };
        if (name === "next/link") return { __esModule: true, default: component("Link") };
        if (name === "framer-motion") return { motion: { div: component("MotionDiv") } };
        if (name === "antd") return new Proxy({ Typography: { Title: component("Title"), Text: component("Text"), Paragraph: component("Paragraph") } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name === "@ant-design/icons") return new Proxy({}, { get: (_target, key) => component(String(key)) });
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t: (value: string) => translate(language, value) }) };
        if (name.endsWith("ServerProxyNotice")) return { __esModule: true, default: noticeMarker };
        if (name.endsWith("ReferenceProvenance")) return { __esModule: true, default: () => null };
        if (name.startsWith("@/lib/")) return nativeRequire(`../src/lib/${name.slice(6)}`);
        throw new Error(`Unexpected page guidance import: ${name}`);
    } });
    return compiled.exports.default;
}
function nodes(value: React.ReactNode | unknown, output: Element[] = []): Element[] {
    if (Array.isArray(value)) { value.forEach((child) => nodes(child, output)); return output; }
    if (!value || typeof value !== "object") return output;
    const node = value as Element;
    if (typeof node.type === "function") return nodes((node.type as (props: unknown) => unknown)(node.props), output);
    if (!node.props) return output;
    output.push(node);
    for (const key of ["children", "title", "description", "label"]) nodes(node.props[key], output);
    if (Array.isArray(node.props.items)) for (const item of node.props.items as Record<string, unknown>[]) { nodes(item.label, output); nodes(item.children, output); }
    return output;
}
const layout = load("src/components/ToolPageLayout.tsx");
const notice = load("src/components/ServerProxyNotice.tsx");
const redirects = new Map<string, string>();
let authoredHelp = 0, fallbackHelp = 0, networkPages = 0;
for (const tool of toolsRegistry) {
    const file = `src/app/tools/${tool.id}/page.tsx`, source = readFileSync(file, "utf8");
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    let opening: ts.JsxOpeningLikeElement | undefined;
    const visit = (node: ts.Node) => { if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(ast) === "ToolPageLayout") opening = node; ts.forEachChild(node, visit); };
    visit(ast);
    if (!opening) {
        const target = source.match(/toolPathFromId\("([^"]+)"\)/)?.[1];
        assert.ok(target && toolsRegistry.some((entry) => entry.id === target), `${tool.id}: missing layout or registered redirect`);
        redirects.set(tool.id, target); continue;
    }
    const help = opening.attributes.properties.find((attr) => ts.isJsxAttribute(attr) && attr.name.getText(ast) === "learnMore");
    const fallback = TOOL_HELP[tool.id];
    assert.ok(help || fallback, `${tool.id}: Learn More is missing`);
    if (help) authoredHelp++; else fallbackHelp++;
    const hasServerNotice = !!help && /serverNotice\s*:/.test(help.getText(ast));
    const disclosure = TOOL_NETWORK_DISCLOSURES[tool.id];
    if (dataBoundaryForTool(tool.id) !== "local") {
        networkPages++;
        assert.ok(hasServerNotice || disclosure, `${tool.id}: network data disclosure is missing`);
    }
    for (const current of LANGUAGES) {
        path = toolPath(tool); language = current.id;
        // Existing authored props remain caller-owned; exercise shared fallback rendering
        // and the detailed-notice slot with a public, byte-sensitive fixture.
        const ownHelp = help ? { whatIs: tool.description, ...(hasServerNotice ? { serverNotice: { route: "proxy", purpose: "Hostname", sentFields: ["raw-header-日本語-العربية"] } } : {}) } : undefined;
        const tree = nodes(layout({ title: tool.name, description: tool.description, icon: null, color: "#08979c", learnMore: ownHelp, children: React.createElement("textarea", { defaultValue: "raw-日本語-العربية" }) }));
        const collapse = tree.find((node) => node.type === "Collapse" && node.props.className === "wb-tool-learn-collapse");
        assert.ok(collapse, `${tool.id}/${language}: Learn More not wired`);
        assert.equal(collapse.props.defaultActiveKey, undefined);
        const notices = tree.filter((node) => node.type === "NetworkNotice");
        assert.equal(notices.length, dataBoundaryForTool(tool.id) !== "local" || hasServerNotice ? 1 : 0, `${tool.id}/${language}: one disclosure per page`);
        if (!help) assert.ok(fallback.howToUse.length >= 2, `${tool.id}: actionable help`);
        if (hasServerNotice) assert.equal((notices[0].props.sentFields as string[])[0], "raw-header-日本語-العربية");
        assert.equal(tree.find((node) => node.type === "textarea")?.props.defaultValue, "raw-日本語-العربية");
    }
}
let legacyAliases = 0;
for (const id of readdirSync("src/app/tools")) {
    const file = `src/app/tools/${id}/page.tsx`;
    if (!existsSync(file) || toolsRegistry.some((tool) => tool.id === id)) continue;
    const source = readFileSync(file, "utf8");
    const target = source.match(/toolPathFromId\("([^"]+)"\)/)?.[1];
    assert.ok(target && toolsRegistry.some((tool) => tool.id === target), `${id}: legacy alias must reach registered tool help`);
    redirects.set(id, target); legacyAliases++;
}
for (const [id, target] of redirects) assert.ok(!redirects.has(target), `${id}: redirect must reach a real help page`);
for (const [id, help] of Object.entries(TOOL_HELP)) {
    assert.ok(toolsRegistry.some((tool) => tool.id === id), id);
    for (const text of [...help.howToUse, ...help.tips ?? []]) for (const current of LANGUAGES.slice(1)) assert.notEqual(translate(current.id, text), text, `${id}/${current.id}: untranslated help`);
}
for (const [id, disclosure] of Object.entries(TOOL_NETWORK_DISCLOSURES)) {
    assert.ok(toolsRegistry.some((tool) => tool.id === id), id);
    assert.notEqual(dataBoundaryForTool(id), "local", `${id}: nonlocal disclosure`);
    disclosure.sourceFiles.forEach((file) => assert.ok(existsSync(file), `${id}: source link ${file}`));
    for (const current of LANGUAGES) {
        language = current.id;
        const tree = nodes(notice(disclosure as unknown as Record<string, unknown>));
        const details = tree.find((node) => node.type === "details");
        assert.ok(details, `${id}: expandable notice`);
        assert.equal(details.props.open, undefined, `${id}: disclosure must start collapsed`);
        assert.equal(tree.filter((node) => node.type === "summary").length, 1);
        assert.equal(tree.filter((node) => node.type === "a").length, disclosure.sourceFiles.length);
        for (const text of [disclosure.title, disclosure.purpose, disclosure.handling, ...disclosure.sentFields]) if (language !== "en") assert.notEqual(translate(language, text), text, `${id}/${language}: untranslated disclosure`);
    }
}
// Existing route-specific notices retain their source, retention explanation and
// caller-owned rich content while gaining the same collapsed-by-default behavior.
for (const current of LANGUAGES) {
    language = current.id;
    for (const route of ["proxy", "proxy-stream", "fetch-cert", "webhook"]) {
        const raw = "public-raw_日本語_العربية";
        const extra = React.createElement("code", { id: "caller-extra" }, raw);
        const tree = nodes(notice({ route, purpose: "Hostname", sentFields: [raw], extra }));
        const details = tree.find((node) => node.type === "details");
        assert.ok(details);
        assert.equal(details.props.open, undefined);
        assert.equal(tree.find((node) => node.type === "code" && node.props.id === "caller-extra")?.props.children, raw);
        assert.equal(tree.find((node) => node.type === "li")?.props.children, raw);
        const file = `src/app/api/${route === "webhook" ? "webhook/[sessionId]" : route}/route.ts`;
        assert.equal(tree.find((node) => node.type === "a")?.props.href, `https://github.com/rameshbgm/mydevtools/blob/main/${file}`);
        const expectedHandling = route === "webhook" ? "webhooks are delivered only to an actively listening browser; the server keeps no request history." : route === "fetch-cert" ? "the server opens a TLS connection to the hostname and returns the certificate chain." : "the server relays this request to your target and returns its response; the target receives the fields above.";
        assert.ok(tree.some((node) => node.type === "Paragraph" && Array.isArray(node.props.children) && node.props.children.includes(translate(language, expectedHandling))), `${route}/${language}: retain handling explanation`);
    }
}
assert.doesNotMatch(BOUNDARY_LABELS.network, /Network connection · review before sending/);
assert.doesNotMatch(SEO_CONTENT["jks-tool"].description, /Free keytool alternative|Create, inspect and manage/);
console.log(`Page-level guidance audit: ${toolsRegistry.length} registered routes plus ${legacyAliases} legacy aliases, ${authoredHelp} authored help sections, ${fallbackHelp} new help sections, ${redirects.size} redirects to help pages, ${networkPages} network pages. Collapsed disclosure wiring, preserved request bytes and eight-language content checked without browser/UI verification.`);

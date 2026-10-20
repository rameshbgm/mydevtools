import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { NETWORK_IDENTITY_TRANSLATIONS, localizeUserAgentError, USER_AGENT_NOTICES } from "../src/lib/i18n/network-identity";
import * as agentEngine from "../src/lib/user-agent-inspector";
import { TOOL_NETWORK_DISCLOSURES } from "../src/lib/tool-network-disclosures";
import * as rdapEngine from "../src/lib/rdap";

const paths = ["user-agent-parser", "whois-rdap"].map((id) => `src/app/tools/${id}/page.tsx`);
const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(NETWORK_IDENTITY_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog missing ${source}`);
    for (const column of columns) { assert.ok(column.trim()); assert.deepEqual(placeholders(column), placeholders(source)); }
    for (const [index, language] of LANGUAGES.slice(1).entries()) assert.equal(translate(language.id, source), columns[index], `${source}/${language.id}: catalog override`);
}
for (const path of paths) {
    const source = readFileSync(path, "utf8"), file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, node.arguments[0].text), `Missing copy ${node.arguments[0].text}`);
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(["Bowser", "·", "."].includes(node.text.trim()), `Unlocalized JSX ${path}: ${node.text}`);
        if (ts.isJsxAttribute(node) && ["title", "description", "aria-label"].includes(node.name.getText(file))) assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `Unlocalized attribute ${path}`);
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ["input", "textarea", "code", "time"].includes(node.tagName.getText(file))) assert.ok(node.attributes.properties.some((attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText(file) === "dir" && attribute.initializer && ts.isStringLiteral(attribute.initializer) && attribute.initializer.text === "ltr"), `Missing machine-data LTR ${path}`);
        ts.forEachChild(node, visit);
    };
    visit(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
    assert.doesNotMatch(source, /\bt\((?:error|notice)(?:\)|,)|\bt\((?:entity|event|result)\.[a-zA-Z.]+(?:\)|,)/, "Untrusted data must not enter translation lookup");
}
const nativeRequire = createRequire(import.meta.url), React = nativeRequire("react"), jsxRuntime = nativeRequire("react/jsx-runtime");
type Element = { type: unknown; props: Record<string, any> };
function harness(path: string, initial: Record<string, unknown> = {}, browserData?: unknown) {
    let language: Language = "en", stateIndex = 0, refIndex = 0;
    const names: string[] = [], cells: unknown[] = [], refs: { current: unknown }[] = [], writes: string[] = [], copied: string[] = [], downloads: string[][] = [];
    let lookups = 0;
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const collect = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file)); ts.forEachChild(node, collect); }; collect(file);
    const stub = () => null, compiled = { exports: {} as { default: () => unknown } };
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (fallback: unknown) => { const index = stateIndex++; if (!(index in cells)) cells[index] = Object.hasOwn(initial, names[index]) ? initial[names[index]] : fallback; return [cells[index], (value: unknown) => { cells[index] = typeof value === "function" ? (value as (old: unknown) => unknown)(cells[index]) : value; writes.push(names[index]); }]; }, useMemo: (compute: () => unknown) => compute(), useEffect: stub, useRef: (value: unknown) => refs[refIndex++] ??= { current: value } };
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t: (source: string, values?: Record<string, string | number>) => translate(language, source, values), direction: language === "ar" ? "rtl" : "ltr" }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Record<string, unknown>) => React.createElement("div", null, props.title, props.description, props.children) };
        if (name.endsWith("ServerProxyNotice")) return { __esModule: true, default: (props: Record<string, any>) => React.createElement("div", null, translate(language, props.purpose), props.sentFields.map((value: string) => translate(language, value)), props.extra) };
        if (name === "@ant-design/icons") return { GlobalOutlined: stub };
        if (name.endsWith("user-agent-inspector")) return agentEngine;
        if (name.endsWith("i18n/network-identity")) return { localizeUserAgentError, USER_AGENT_NOTICES };
        if (name.endsWith("rdap")) return { ...rdapEngine, lookupRdap: async () => { lookups++; throw new Error("Provider diagnostic: Name/Handle — exact"); } };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copied.push(value); return true; } };
        if (name.endsWith("download")) return { downloadText: (...values: string[]) => downloads.push(values) };
        throw new Error(`Unexpected dependency ${name}`);
    };
    const code = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, navigator: { userAgent: "fixture browser", userAgentData: browserData }, Date, Error, SyntaxError, URL, AbortController, AbortSignal, setTimeout: () => 0, Promise });
    const render = (nextLanguage: Language) => {
        language = nextLanguage; stateIndex = 0; refIndex = 0;
        const elements: Element[] = [], visible: string[] = [];
        const walk = (node: any) => { if (node == null || typeof node === "boolean") return; if (typeof node === "string" || typeof node === "number") { visible.push(String(node)); return; } if (Array.isArray(node)) { node.forEach(walk); return; } if (typeof node.type === "function") { walk(node.type(node.props)); return; } if (node.props) { elements.push(node); walk(node.props.children); } };
        walk(compiled.exports.default());
        return { text: visible.join(" "), elements, button: (label: string) => { const found = elements.find((node) => node.type === "button" && node.props.children === translate(nextLanguage, label)); assert.ok(found, `Missing button ${label}/${language}`); return found.props.onClick as () => unknown; } };
    };
    return { render, writes, copied, downloads, lookups: () => lookups, state: () => Object.fromEntries(names.map((name, index) => [name, cells[index]])) };
}
const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const hints = '{"brands":[{"brand":"Browser", "version":"131"}],"architecture":"x86","bitness":"64","model":"Name"}';
const raw = JSON.stringify({ objectClassName: "domain", ldhName: "example.com", handle: "Handle", status: ["Name"], country: "DE", entities: [{ handle: "Browser", roles: ["Action"], vcardArray: ["vcard", [["fn", {}, "text", "Name"]]] }, { handle: "empty" }], events: [{ eventAction: "Action", eventDate: "2026-10-20T00:00:00Z", eventActor: "Browser" }], nameservers: [{ ldhName: "ns1.example.com" }], notices: [{ title: "Name", description: ["Browser"] }, { description: ["Notice without title"] }], links: [{ href: "https://example.com/provider", title: "Name" }], redacted: [{}] }, null, 2);
const result = { query: rdapEngine.rdapQuery("example.com"), summary: rdapEngine.summarizeRdap(JSON.parse(raw)), raw, registryUrl: "https://rdap.example.com/domain/example.com", at: "2026-10-20T00:00:00.000Z" };
async function main() {
for (const { id } of LANGUAGES) {
    const page = harness(paths[0], { source: ua, hints }), parsed = page.render(id), expected = JSON.stringify(agentEngine.inspectUserAgent(ua, hints), null, 2);
    assert.ok(parsed.text.includes(translate(id, "Reported CPU architecture")));
    assert.ok(parsed.elements.some((node) => node.type === "textarea" && node.props.readOnly && node.props.value === expected && node.props.dir === "ltr"));
    const options = parsed.elements.filter((node) => node.type === "option"); assert.equal(options[1].props.value, ua); assert.equal(options[1].props.children, translate(id, "Chrome on Windows"));
    parsed.button("Copy parsed JSON")(); parsed.button("Download parsed JSON")(); assert.equal(page.copied[0], expected); assert.deepEqual(page.downloads[0], [expected, "user-agent.json", "application/json"]);
    const saved = page.state(); page.writes.length = 0; page.render("ar"); page.render("ja"); assert.deepEqual(page.state(), saved); assert.deepEqual(page.writes, []);
    for (const notice of USER_AGENT_NOTICES) assert.ok(harness(paths[0], { notice }).render(id).text.includes(translate(id, notice)));
    const unsupported = harness(paths[0]); await unsupported.render(id).button("Read optional detailed hints from this browser")(); assert.ok(unsupported.render(id).text.includes(translate(id, USER_AGENT_NOTICES[1])));
    const failures: [string, string, string][] = [["", "", "Enter a User-Agent string up to 16 KiB."], [ua, "[]", "Client Hints must be a JSON object."], [ua, "{bad", "Client Hints JSON could not be parsed. Check its syntax."], [ua, '{"platform":1}', "Client Hint platform must be text up to 200 characters."], [ua, '{"mobile":1}', "Client Hint mobile must be a boolean."], [ua, '{"brands":1}', "Client Hint brands needs up to 20 brand/version objects."]];
    for (const [source, hintSource, message] of failures) assert.ok(harness(paths[0], { source, hints: hintSource }).render(id).text.includes(localizeUserAgentError(message, (s, values) => translate(id, s, values))), `${id}/${message}`);
    assert.equal(localizeUserAgentError("Name", (s) => translate(id, s)), "Name");
    for (const [keys, suffix] of [
        [["platform", "platformVersion", "architecture", "bitness", "model"], "must be text up to 200 characters."],
        [["mobile", "wow64"], "must be a boolean."],
        [["brands", "fullVersionList"], "needs up to 20 brand/version objects."],
    ] as const) for (const name of keys) assert.equal(localizeUserAgentError(`Client Hint ${name} ${suffix}`, (s, values) => translate(id, s, values)), translate(id, `Client Hint {name} ${suffix}`, { name }));
    const detailed = harness(paths[0], {}, { brands: [{ brand: "Name", version: "131" }], mobile: false, platform: "Windows", getHighEntropyValues: async (keys: string[]) => { assert.deepEqual([...keys], ["architecture", "bitness", "model", "platformVersion", "fullVersionList", "wow64"]); return { architecture: "arm", bitness: "64", model: "Browser", fullVersionList: [{ brand: "Name", version: "131.0.0.0" }] }; } });
    await detailed.render(id).button("Read optional detailed hints from this browser")();
    assert.equal(detailed.state().source, "fixture browser");
    assert.equal(JSON.parse(String(detailed.state().hints)).fullVersionList[0].brand, "Name");
    assert.ok(detailed.render(id).text.includes(translate(id, USER_AGENT_NOTICES[2])));
    const detailedState = detailed.state(); detailed.writes.length = 0; detailed.render("ar"); detailed.render("fr"); assert.deepEqual(detailed.state(), detailedState); assert.deepEqual(detailed.writes, []);
    const denied = harness(paths[0], {}, { getHighEntropyValues: async () => { throw new Error("Name"); } });
    await denied.render(id).button("Read optional detailed hints from this browser")();
    const deniedPage = denied.render(id); assert.ok(deniedPage.text.includes(translate(id, "Could not read browser hints. Paste captured hint values or try again."))); assert.ok(deniedPage.elements.some((node) => node.type === "bdi" && node.props.children === "Name"));
    assert.ok(harness(paths[0], { busy: true }).render(id).text.includes(translate(id, "Reading hints…")));

    const lookup = harness(paths[1], { input: "example.com", result }), rendered = lookup.render(id);
    assert.ok(rendered.text.includes(translate(id, "Registrar & registry entities"))); // This disclosure moved from the owning page into the shared page layout.
    // tool-page-guidance.test.ts exercises the actual shared slot and collapsed notice.
    assert.equal(TOOL_NETWORK_DISCLOSURES["whois-rdap"].handling, "IANA directory matching identifies the registry. Public-target and redirect checks remain enforced. Lookup data is not logged by this route; providers may log requests.");
    if (id !== "en") assert.notEqual(translate(id, TOOL_NETWORK_DISCLOSURES["whois-rdap"].handling), TOOL_NETWORK_DISCLOSURES["whois-rdap"].handling);
    assert.ok(rendered.elements.some((node) => node.type === "textarea" && node.props.value === raw && node.props.dir === "ltr"));
    for (const exact of ["Name", "Browser", "Action", "Handle", "DE", "ns1.example.com", "2026-10-20T00:00:00Z"]) assert.ok(rendered.text.includes(exact), `${id}: changed provider value ${exact}`);
    assert.ok(rendered.elements.some((node) => node.type === "a" && node.props.href === "https://example.com/provider" && node.props.children === "Name"));
    rendered.button("Copy RDAP JSON")(); rendered.button("Download RDAP JSON")(); assert.equal(lookup.copied[0], raw); assert.deepEqual(lookup.downloads[0], [raw, "registration-rdap.json", "application/json"]);
    const snapshot = lookup.state(); lookup.writes.length = 0; lookup.render("ar"); lookup.render("de"); assert.deepEqual(lookup.state(), snapshot); assert.deepEqual(lookup.writes, []); assert.equal(lookup.lookups(), 0);
    const failed = harness(paths[1], { error: "Name" }).render(id); assert.ok(failed.text.includes(translate(id, "Registration lookup failed. Review the diagnostic, check the query, or try again later."))); assert.ok(failed.elements.some((node) => node.type === "bdi" && node.props.children === "Name" && node.props.dir === "ltr"));
    const invalid = harness(paths[1], { input: "999.1.1.1" }); await invalid.render(id).button("Look up registration")(); assert.equal(invalid.state().input, "999.1.1.1"); assert.equal(invalid.state().error, "Invalid IPv4 address."); assert.equal(invalid.lookups(), 0);
    const network = harness(paths[1]); network.render(id).button("Look up registration")(); await new Promise((resolve) => setImmediate(resolve)); assert.equal(network.state().error, "Provider diagnostic: Name/Handle — exact"); assert.equal(network.lookups(), 1);
    assert.ok(harness(paths[1], { busy: true }).render(id).text.includes(translate(id, "Looking up…")));
}
console.log("Network identity localization: eight-language copy, real rendered state/callbacks, exact payloads, stable locale switching and error boundaries passed.");

}
main().catch((error) => { console.error(error); process.exitCode = 1; });

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { isIP } from "node:net";
import { execFileSync } from "node:child_process";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { REMAINING_NETWORK_TRANSLATIONS as rows } from "../src/lib/i18n/remaining-network";
import { parseJsonResponse } from "../src/lib/certificate-fetch-response";

const nativeRequire = createRequire(import.meta.url), React = nativeRequire("react"), jsx = nativeRequire("react/jsx-runtime");
const { DOMParser: XmlParser, XMLSerializer } = nativeRequire("@xmldom/xmldom");
// Standards XML parser boundary, adapted only for the browser DOM convenience accessors used by the page.
class DOMParser {
    parseFromString(source: string, mime: string) {
        const diagnostics: string[] = [];
        const doc = new XmlParser({ errorHandler: { warning: (m: string) => diagnostics.push(m), error: (m: string) => diagnostics.push(m), fatalError: (m: string) => diagnostics.push(m) } }).parseFromString(source, mime);
        const visit = (node: any) => {
            if (node.nodeType === 1) {
                Object.defineProperty(node, "parentElement", { get: () => node.parentNode?.nodeType === 1 ? node.parentNode : null });
                Object.defineProperty(node, "outerHTML", { get: () => new XMLSerializer().serializeToString(node) });
            }
            for (let child = node.firstChild; child; child = child.nextSibling) visit(child);
        }; visit(doc);
        doc.querySelector = (selector: string) => selector === "parsererror" && diagnostics.length ? { textContent: diagnostics.join("\n") } : null;
        return doc;
    }
}
const ids = ["ip-address-tools", "mac-address-tools", "wsdl-parser", "soap-client", "cors-tester", "webhook-receiver"];
const tr = (language: Language, source: string, values?: Record<string, string | number>) => {
    let copy = language === "en" ? source : rows[source]?.[LANGUAGES.findIndex(l => l.id === language) - 1] ?? translate(language, source);
    for (const [key, value] of Object.entries(values ?? {})) copy = copy.replaceAll(`{${key}}`, String(value));
    return copy;
};
const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(rows)) {
    assert.equal(columns.length, 7, source);
    if (SHARED_TRANSLATIONS[source]) assert.deepEqual(columns, SHARED_TRANSLATIONS[source], `Existing vocabulary: ${source}`);
    columns.forEach((copy, i) => {
        assert.ok(copy.trim(), source); assert.deepEqual(placeholders(copy), placeholders(source), source);
        if (!process.env.REMAINING_NETWORK_STAGE) assert.equal(translate(LANGUAGES[i + 1].id, source), copy, `Catalog: ${source}`);
    });
}
type Element = { type: any; props: Record<string, any> };
function text(node: any): string { return node == null || typeof node === "boolean" ? "" : Array.isArray(node) ? node.map(text).join("") : typeof node === "object" ? text(node.props?.children) : String(node); }
function harness(id: string, initial: Record<string, any> = {}) {
    const source = readFileSync(`src/app/tools/${id}/page.tsx`, "utf8"), ast = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), names: string[] = [];
    assert.equal((ast as ts.SourceFile & { parseDiagnostics: ts.Diagnostic[] }).parseDiagnostics.length, 0, id);
    function collect(node: ts.Node) { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(ast) === "useState") names.push(node.name.elements[0].getText(ast)); ts.forEachChild(node, collect); } collect(ast);
    let language: Language = "en", stateSlot = 0, refSlot = 0, effectSlot = 0, memoSlot = 0, renderPhase = false;
    const state = { ...initial }, refs: any[] = [], effects: { deps: unknown[]; effect: () => any; pending: boolean; cleanup?: () => void }[] = [], memo: { deps: unknown[]; value: unknown }[] = [];
    const log = { requests: [] as { url: string; init?: RequestInit; resolve: (r: Response) => void; reject: (e: Error) => void }[], notices: [] as string[], copies: [] as string[], writes: [] as unknown[], randomness: 0, downloads: [] as unknown[] };
    const changed = (a: unknown[] | undefined, b: unknown[]) => !a || a.length !== b.length || b.some((v, i) => !Object.is(v, a[i]));
    const component = (name: string): any => Object.assign((props: any) => React.createElement(name, props, props.children), { Item: `${name}-item`, Option: "option", Compact: "compact", TextArea: "textarea", PRESENTED_IMAGE_SIMPLE: "simple" });
    const message = Object.fromEntries(["success", "error", "warning", "info"].map(k => [k, (s: string) => log.notices.push(s)]));
    const dependencies = (name: string): any => {
        if (name === "react") return { ...React,
            useState: (fallback: any) => { const key = names[stateSlot++]; assert.ok(key); if (!Object.hasOwn(state, key)) state[key] = typeof fallback === "function" ? fallback() : fallback; return [state[key], (v: any) => { assert.ok(!renderPhase, "No render-time state mutation"); state[key] = typeof v === "function" ? v(state[key]) : v; }]; },
            useRef: (value: any) => refs[refSlot++] ??= { current: value },
            useEffect: (effect: () => any, deps: unknown[]) => { const slot = effectSlot++; if (changed(effects[slot]?.deps, deps)) effects[slot] = { deps, effect, pending: true, cleanup: effects[slot]?.cleanup }; },
            useMemo: (compute: () => unknown, deps: unknown[]) => { const slot = memoSlot++; if (!memo[slot] || changed(memo[slot].deps, deps)) memo[slot] = { deps, value: compute() }; return memo[slot].value; },
            useCallback: (callback: unknown, deps: unknown[]) => { const slot = memoSlot++; if (!memo[slot] || changed(memo[slot].deps, deps)) memo[slot] = { deps, value: callback }; return memo[slot].value; },
        };
        if (name === "react/jsx-runtime") return jsx;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => { const locale = language; return { language: locale, t: (s: string, values?: Record<string, string | number>) => tr(locale, s, values) }; } };
        if (name === "antd") return new Proxy({ App: { useApp: () => ({ message }) }, Typography: { Text: "text", Paragraph: "paragraph", Title: "heading" } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => component("icon") });
        if (name.endsWith("messageService")) return { messageService: message };
        if (name.endsWith("store")) return { useAppStore: () => ({ darkMode: false }) };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { log.copies.push(value); return true; } };
        if (name.endsWith("download")) return { downloadText: (...args: unknown[]) => log.downloads.push(args) };
        if (name.endsWith("certificate-fetch-response")) return { parseJsonResponse };
        if (name.endsWith("project-storage")) return { projectStorage: { getItem: () => "public-fixture-session-0001", setItem: (...args: unknown[]) => log.writes.push(args) } };
        if (name.endsWith("CodeEditor")) return { CodeEditor: "editor" };
        if (name.endsWith("SslConfigSection")) return { __esModule: true, default: "ssl", DEFAULT_SSL_CONFIG: { sslVerify: true, sslCaCert: "", sslClientCert: "", sslClientKey: "" }, buildSslProxyFields: (v: any) => ({ sslVerify: v.sslVerify }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: component("layout") };
        throw new Error(`Unexpected import ${name}`);
    };
    const module = { exports: {} as { default: () => Element; internals: any } };
    const expose = id === "ip-address-tools" ? "{ parseIPv6, analyzeIP, calculateIPv4Subnet, calculateIPv6Subnet, decimalToIPv4, binaryToIPv4, hexToIPv4 }" : id === "mac-address-tools" ? "{ analyzeMac, generateRandomMac }" : id === "wsdl-parser" ? "{ parseWSDL, SAMPLE_WSDL }" : "{}";
    let time = 0;
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText + `\nmodule.exports.internals = ${expose};`, {
        module, exports: module.exports, require: dependencies, console, URL, Error, TypeError, DOMParser, XMLSerializer, Date, Response, Headers, TextEncoder, TextDecoder, Uint8Array, AbortController, btoa, atob,
        performance: { now: () => time++ }, setTimeout: () => 1, clearTimeout: () => {},
        window: { location: { origin: "https://tools.example" }, setTimeout: () => 1 },
        crypto: { getRandomValues: (bytes: Uint8Array) => { log.randomness++; bytes.fill(42); return bytes; } },
        fetch: (url: string, init?: RequestInit) => new Promise<Response>((resolve, reject) => log.requests.push({ url, init, resolve, reject })),
    });
    let tree: Element;
    const render = (next = language) => { language = next; stateSlot = refSlot = effectSlot = memoSlot = 0; renderPhase = true; try { tree = module.exports.default(); } finally { renderPhase = false; } effects.forEach(e => { if (e.pending) { e.cleanup?.(); e.cleanup = e.effect(); e.pending = false; } }); return tree; };
    const all = () => { const nodes: Element[] = [], seen = new Set(); const walk = (node: any) => { if (!node || typeof node !== "object" || seen.has(node)) return; seen.add(node); if (Array.isArray(node)) return node.forEach(walk); if (node.props) { nodes.push(node); ["children", "title", "label", "description", "extra"].forEach(k => walk(node.props[k])); (node.props.items ?? []).forEach((item: any) => { walk(item.label); walk(item.children); }); } }; walk(tree); return nodes; };
    const handler = (name: string) => { const n = all().find(n => n.props.onClick?.name === name); assert.ok(n, `${id}: ${name}`); return n.props.onClick; };
    const button = (source: string) => { const n = all().find(n => typeof n.props.onClick === "function" && text(n) === tr(language, source)); assert.ok(n, `${id}: ${source}`); return n.props.onClick; };
    const field = (source: string) => { const n = all().find(n => n.props["aria-label"] === tr(language, source)); assert.ok(n, `${id}: field ${source}`); return n; };
    const stable = () => { const before = JSON.stringify(state), requests = log.requests.length, writes = log.writes.length, randomness = log.randomness; for (const l of LANGUAGES) render(l.id); assert.equal(JSON.stringify(state), before, id + ": locale preserves drafts/results"); assert.equal(log.requests.length, requests, id + ": no locale network effect"); assert.equal(log.writes.length, writes, id + ": no locale storage write"); assert.equal(log.randomness, randomness, id + ": no locale generation"); };
    return { source, state, log, render, all, handler, button, field, stable, internals: module.exports.internals, cleanup: () => effects.forEach(e => e.cleanup?.()) };
}
const json = (value: any, status = 200) => new Response(JSON.stringify(value), { status, headers: { "content-type": "application/json" } });
const plain = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };

async function main() {
    for (const id of ids) {
        const h = harness(id, id === "webhook-receiver" ? { polling: false } : {}); h.render(); h.render(); h.stable();
        const ast = ts.createSourceFile(id, h.source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
        const check = (node: ts.Node) => {
            if (ts.isCallExpression(node) && ["t", "tCurrent.current"].includes(node.expression.getText(ast)) && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(rows[node.arguments[0].text], `${id}: ${node.arguments[0].text}`);
            if (ts.isJsxText(node) && /[A-Za-z]/.test(node.text.trim())) assert.ok(/^(?:SOAP(?: 1\.[12])?|SOAPAction|WS-Security|SSL|XSD|WSDL|EUI-64:|HTTP|ms|s|Content-Type|Origin:|curl -X POST|-H|-d|(?:[0-9A-F]{2}:){2}[0-9A-F]{2} - .+)$/.test(node.text.trim()), `${id}: unlocalized JSX ${node.text.trim()}`);
            if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) { const tag = node.tagName.getText(ast); if (["Input", "InputNumber", "TextArea"].includes(tag)) { const attributes = node.attributes.properties.filter(ts.isJsxAttribute); assert.ok(attributes.some(a => a.name.getText(ast) === "aria-label"), `${id}: accessible ${tag}`); assert.ok(attributes.some(a => a.name.getText(ast) === "dir" && a.initializer && ts.isStringLiteral(a.initializer) && a.initializer.text === "ltr")); } }
            ts.forEachChild(node, check);
        }; check(ast); assert.doesNotMatch(h.source, /key=\{(?:language|direction)\}/); h.cleanup();
    }
    // Independent OS/Node IPv6 parser, not a reconstruction of our implementation.
    const ip = harness("ip-address-tools").internals;
    const vectors = ["::", "::1", "2001:db8::1", "fe80::1%en0", "febf::1234", "ff02::1", "ff0e::1", "::ffff:192.0.2.1", "2001:db8:0:0:0:192.0.2.1", "2001:DB8:0:0:8:800:200C:417A", "1:2:3:4:5:6:7:8", "1:2:3:4:5:6:7::", "1:2:3:4:5:6:7:8::", ":::1", "1:::2", "1::2::3", "1:2:3:4:5:6:7", "1:2:3:4:5:6:7:8:9", ":1:2:3:4:5:6:7", "1:2:3:4:5:6:7:", "1g::1", "gggg::", "12345::", "::ffff:192.0.2.999", "::ffff:192.0.2.01", "::ffff:192.0.2.1junk", "fe80::1%", "fe80::1%en0%oops"];
    for (const value of vectors) assert.equal(ip.parseIPv6(value) !== null, isIP(value) === 6, value);
    assert.equal(ip.analyzeIP("febf::1234").isLinkLocal, true); assert.equal(ip.analyzeIP("fec0::1").isLinkLocal, false);
    assert.equal(ip.analyzeIP("ff02::1").scope, "Multicast (Link-Local)"); assert.equal(ip.analyzeIP("ff0e::1").scope, "Multicast (Global)"); assert.equal(ip.analyzeIP("::").scope, "Unspecified"); assert.equal(ip.analyzeIP("2001::1").isAnycast, false);
    for (const value of ["3junk", "1.5", "-1", "4294967296", "1e3"]) assert.equal(ip.decimalToIPv4(value), "", value);
    assert.equal(ip.decimalToIPv4("4294967295"), "255.255.255.255"); assert.equal(ip.decimalToIPv4("0"), "0.0.0.0");
    assert.equal(ip.calculateIPv4Subnet("203.0.113.7", 0).networkAddress, "0.0.0.0"); assert.equal(ip.calculateIPv4Subnet("203.0.113.7", 0).totalHosts, 4294967296);
    assert.equal(ip.calculateIPv4Subnet("192.0.2.11", 31).usableHosts, 2); assert.equal(ip.calculateIPv4Subnet("192.0.2.11", 24.5), null); assert.equal(ip.calculateIPv6Subnet("2001:db8::1", 64.5), null);
    for (const { id: language } of LANGUAGES) {
        const page = harness("ip-address-tools", { conversionType: "decimal", conversionInput: "4294967295" }); page.render(language); page.button("Convert")(); assert.equal(page.state.inputIP, "255.255.255.255"); assert.equal(page.log.notices.at(-1), tr(language, "Converted successfully!")); page.stable();
        page.render(language); page.field("Conversion input").props.onChange({ target: { value: "42bad" } }); page.render(); page.button("Convert")(); assert.equal(page.state.inputIP, "255.255.255.255"); assert.equal(page.log.notices.at(-1), tr(language, "Invalid input format"));
        const mac = harness("mac-address-tools", { generatePrefix: "00:50:56", generateCount: 3, generateUnicast: true, generateUniversal: false }); mac.render(language); mac.button("Generate MAC Addresses")(); assert.equal(mac.state.generatedMACs.length, 3); mac.state.generatedMACs.forEach((value: string) => { assert.match(value, /^02:50:56:(?:[0-9A-F]{2}:){2}[0-9A-F]{2}$/); }); mac.render(); await mac.handler("handleCopyAll")(); assert.equal(mac.log.copies[0], mac.state.generatedMACs.join("\n")); mac.stable();
        const invalid = harness("mac-address-tools", { generatePrefix: "not-hex", generatedMACs: ["02:00:00:00:00:01"] }); invalid.render(language); invalid.button("Generate MAC Addresses")(); assert.deepEqual(invalid.state.generatedMACs, ["02:00:00:00:00:01"]); assert.equal(invalid.log.notices[0], tr(language, "Enter a MAC prefix containing 1 to 6 complete hex bytes"));
        const info = mac.internals.analyzeMac("00:1C:B3:00:00:01"); assert.equal(info.vendor, "Apple, Inc."); assert.equal(info.eui64, "021c:b3ff:fe00:0001");
    }
    const raw = "日本語 العربية 🌍 9223372036854775807 %252F", header = "Bearer public-fixture-'$()";
    for (const { id: language } of LANGUAGES) {
        const wsdl = harness("wsdl-parser"), document = wsdl.internals.SAMPLE_WSDL.replace("A simple calculator web service", raw);
        wsdl.render(language); wsdl.field("WSDL URL").props.onChange({ target: { value: "https://schemas.example/contract?key=%2525" } }); wsdl.state.wsdlInput = document; wsdl.state.xsdEntries = [{ id: "public-schema", label: raw, content: '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:public-fixture"><xs:element name="ExtraType" type="xs:string"/></xs:schema>' }];
        wsdl.render(); wsdl.handler("handleParse")(); assert.equal(wsdl.state.parsedWsdl.services[0].documentation, raw); assert.equal(wsdl.state.parsedWsdl.xsdResolved, 1); assert.equal(wsdl.state.parsedWsdl.rawXml, document); assert.equal(wsdl.log.notices.at(-1), tr(language, "WSDL parsed: {count} external types resolved", { count: 1 })); wsdl.render(); wsdl.stable();
        const unsupported = harness("wsdl-parser", { wsdlInput: '<description xmlns="http://www.w3.org/ns/wsdl"/>' }); unsupported.render(language); unsupported.handler("handleParse")(); assert.equal(unsupported.state.parsedWsdl, null); assert.equal(unsupported.state.error, "Expected a WSDL 1.1 definitions document"); unsupported.render(); assert.ok(unsupported.all().some(n => n.props.description === tr(language, unsupported.state.error)));
        const malformed = harness("wsdl-parser", { wsdlInput: document, xsdEntries: [{ id: "bad", label: raw, content: "<not-schema/>" }] }); malformed.render(language); malformed.handler("handleParse")(); assert.equal(malformed.state.parsedWsdl, null); assert.ok(malformed.state.error.includes(raw));
        const fetched = harness("wsdl-parser", { wsdlUrl: "https://schemas.example/a?key=%2525", headers: [{ key: "Authorization", value: header, enabled: true }] }); fetched.render(language); const pending = fetched.handler("handleFetchWsdl")(); assert.equal(fetched.log.requests.length, 1); assert.equal(fetched.log.requests[0].init?.headers && (fetched.log.requests[0].init.headers as Record<string,string>).Authorization, header);
        fetched.log.requests[0].reject(new TypeError("browser network diagnostic")); await flush(); assert.equal(fetched.log.requests.length, 2); const proxy = JSON.parse(String(fetched.log.requests[1].init?.body)); assert.deepEqual(proxy, { url: "https://schemas.example/a?key=%2525", method: "GET", headers: { Authorization: header } }); fetched.stable(); fetched.log.requests[1].resolve(json({ bodyIsBase64: true, body: Buffer.from(document).toString("base64") })); await pending; assert.equal(fetched.state.wsdlInput, document); assert.equal(fetched.state.parsedWsdl.services[0].documentation, raw);
        const requestXml = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Body> ${raw}\n  <value xml:space="preserve"> a  b </value></soap:Body></soap:Envelope>`;
        const endpoint = "https://soap.example/a'$(printf public-injection)?q=%2525", action = "urn:public-'$()-action";
        const soap = harness("soap-client", { endpoint, soapAction: action, soapVersion: "1.2", requestBody: requestXml, headers: [{ key: "X-Public", value: header, enabled: true }] }); soap.render(language);
        const curl = soap.all().find(n => n.type === "editor" && n.props.language === "bash"); assert.ok(curl);
        // An actual POSIX shell parses the displayed command with a harmless function replacing curl.
        const args = execFileSync("/bin/sh", ["-c", `curl() { printf '%s\\0' "$@"; }\n${curl.props.value}`], { encoding: "utf8" }).split("\0").slice(0,-1);
        assert.deepEqual(args, ["-X", "POST", "--url", endpoint, "-H", `X-Public: ${header}`, "-H", `Content-Type: application/soap+xml; charset=utf-8; action="${action}"`, "--data-raw", requestXml]);
        const sent = soap.handler("handleSend")(); assert.equal(soap.log.requests[0].url, endpoint); assert.equal(soap.log.requests[0].init?.body, requestXml); assert.equal((soap.log.requests[0].init?.headers as Record<string,string>)["Content-Type"], `application/soap+xml; charset=utf-8; action="${action}"`); soap.stable(); soap.render(language);
        const response = `<soap:Envelope>\n <body xml:space="preserve">  ${raw} <child/>  tail </body>\n</soap:Envelope>`; soap.log.requests[0].resolve(new Response(response, { headers: { "content-type": "application/soap+xml", "x-public": "public-fixture-%2525" } })); await sent;
        assert.equal(soap.state.responseBody, response, "Do not format away XML whitespace or text nodes"); assert.equal(soap.state.history[0].body, requestXml); assert.equal(soap.state.history[0].response, response); soap.stable();
        const invalidHeaders = harness("soap-client", { headerMode: "json", headerJson: "{bad" }); invalidHeaders.render(language); await invalidHeaders.handler("handleSend")(); assert.equal(invalidHeaders.log.requests.length, 0); assert.equal(invalidHeaders.log.notices[0], tr(language, "Headers must be a valid JSON object"));
        const cors = harness("cors-tester", { url: "https://cors.example/opaque?key=%2525", method: "POST", headers: `content-type: application/xml\nX-Public: ${header}`, body: requestXml }); cors.render(language); const checking = cors.handler("send")(); assert.equal(cors.log.requests[0].init?.mode, "cors"); assert.equal(cors.log.requests[0].init?.body, requestXml); assert.deepEqual(plain(cors.log.requests[0].init?.headers), { "content-type": "application/xml", "X-Public": header }); cors.stable(); cors.log.requests[0].resolve(new Response(raw, { status: 403 })); await checking; cors.render(language); assert.ok(cors.all().some(n => n.props.title === tr(language, "Upstream returned HTTP {status}; the browser allowed this response.", { status: 403 }))); assert.equal(cors.state.result.body, raw); cors.stable();
        const noResponse = harness("cors-tester"); noResponse.render(language); const failed = noResponse.handler("send")(); noResponse.log.requests[0].reject(new TypeError(raw)); await failed; noResponse.render(language); assert.equal(noResponse.state.result.networkError, raw); assert.ok(noResponse.all().some(n => n.props.title === tr(language, noResponse.state.result.explanation))); assert.ok(!noResponse.all().some(n => text(n) === "Blocked by CORS")); noResponse.stable();
        const captured = { id: 1, receivedAt: 1767225600000, method: "POST", path: "/original%252F", query: { raw }, headers: { authorization: header }, bodyText: ` {"id":9223372036854775807,"text":"${raw}"}\n` };
        const webhook = harness("webhook-receiver", { polling: false, requests: [captured] }); webhook.render(language); webhook.render(language); await webhook.button("Copy")(); assert.equal(webhook.log.copies[0], "https://tools.example/api/webhook/public-fixture-session-0001");
        const items = webhook.all().find(n => n.props.items?.[0]?.key === 1); assert.ok(items); assert.ok(text(items.props.items[0].children).includes(captured.bodyText), "Original JSON integer and whitespace are displayed unchanged"); webhook.stable(); webhook.render(language);
        const clear = webhook.handler("clearHistory")(); webhook.log.requests[0].resolve(json({ error: "public-fixture refusal" }, 503)); await clear; assert.equal(webhook.state.requests.length, 1); assert.equal(webhook.log.notices.at(-1), tr(language, "Could not clear history: {error}", { error: "HTTP 503" })); webhook.render(language); const clearOk = webhook.handler("clearHistory")(); webhook.log.requests[1].resolve(json({ cleared: true })); await clearOk; assert.equal(webhook.state.requests.length, 0); webhook.cleanup();
    }
    // Held asynchronous work reports in the current language and never restarts on locale changes.
    const asyncSoap = harness("soap-client"); asyncSoap.render("en"); const held = asyncSoap.handler("handleSend")(); asyncSoap.render("ar"); asyncSoap.log.requests[0].resolve(new Response("<ok/>")); await held; assert.equal(asyncSoap.log.notices.at(-1), tr("ar", "Request completed in {count} ms", { count: asyncSoap.state.duration }));
    const captured = { id: 1, receivedAt: 1767225600000, method: "POST", path: "/fixture", query: {}, headers: {}, bodyText: "public fixture" };
    const poll = harness("webhook-receiver", { requests: [captured] }); poll.render(); poll.render(); assert.equal(poll.log.requests.length, 1); poll.stable(); assert.equal(poll.log.requests.length, 1);
    const clearing = poll.handler("clearHistory")(); assert.equal(poll.log.requests.length, 2); poll.log.requests[1].resolve(json({ cleared: true })); await clearing; poll.log.requests[0].resolve(json({ requests: [captured] })); await flush(); assert.equal(poll.state.requests.length, 0, "A long poll started before clearing cannot resurrect deleted entries"); poll.cleanup();
    console.log("Remaining network pages: eight-language actual callbacks, inert locale changes, Node IPv6 oracle, independent POSIX cURL argv parsing, WSDL/XML fixtures, exact HTTP/webhook bodies and controlled network/error/race fixtures passed. No browser or external network verification claimed.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });

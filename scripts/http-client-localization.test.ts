import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { HTTP_CLIENT_TRANSLATIONS } from "../src/lib/i18n/http-client";
import * as variables from "../src/lib/api-builder/variables";
import * as codegen from "../src/lib/api-builder/client-codegen";
import * as curl from "../src/lib/api-builder/curl-import";
import * as postman from "../src/lib/api-builder/postman-collection";
import * as model from "../src/lib/api-builder/request-model";

const path = "src/app/tools/api-request-builder/page.tsx", source = readFileSync(path, "utf8");
const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
assert.equal(ts.transpileModule(source, { reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).diagnostics?.length, 0);
const slots = (value: string) => (value.match(/(?<!\{)\{[a-zA-Z][a-zA-Z0-9]*\}(?!\})/g) ?? []).sort();
const variablesIn = (value: string) => (value.match(/\{\{[^}]+\}\}/g) ?? []).sort();
for (const [key, columns] of Object.entries(HTTP_CLIENT_TRANSLATIONS)) {
    assert.equal(columns.length, 7, key);
    assert.deepEqual(SHARED_TRANSLATIONS[key], columns, `Catalog wiring: ${key}`);
    for (const column of columns) { assert.ok(column.trim(), key); assert.deepEqual(slots(column), slots(key), key); assert.deepEqual(variablesIn(column), variablesIn(key), key); }
    for (const { id } of LANGUAGES) assert.equal(translate(id, key), id === "en" ? key : columns[LANGUAGES.findIndex((language) => language.id === id) - 1]);
}
const rawJsx = new Set(["cURL", "Postman", "OAuth 2.0", "SSL", "ms", "Content-Type:", "Secure", "HttpOnly", "SameSite="]);
const authored = new Set<string>();
const requireCopy = (node: ts.Node) => {
    if (ts.isStringLiteral(node)) { authored.add(node.text); assert.ok(SHARED_TRANSLATIONS[node.text], `Missing authored translation: ${node.text}`); }
    else if (ts.isConditionalExpression(node)) { requireCopy(node.whenTrue); requireCopy(node.whenFalse); }
};
const inspect = (node: ts.Node) => {
    if (ts.isJsxText(node) && /[a-zA-Z]/.test(node.text.trim())) assert.ok(rawJsx.has(node.text.trim()), `Untranslated JSX: ${node.text}`);
    if (ts.isCallExpression(node) && ["t", "translateRef.current", "notify"].includes(node.expression.getText(file))) {
        const value = node.arguments[node.expression.getText(file) === "notify" ? 1 : 0]; if (value) requireCopy(value);
    }
    if (ts.isNewExpression(node) && node.expression.getText(file) === "HttpClientValidationError" && node.arguments?.[0]) requireCopy(node.arguments[0]);
    if (ts.isPropertyAssignment(node) && node.name.getText(file) === "source" && ts.isStringLiteral(node.initializer)) requireCopy(node.initializer);
    if (ts.isJsxAttribute(node) && ["title", "description", "label", "aria-label", "alt", "okText", "cancelText"].includes(node.name.getText(file)) && node.initializer && ts.isStringLiteral(node.initializer)) assert.fail(`Literal UI attribute: ${node.getText(file)}`);
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ["Input", "Input.Password", "TextArea", "InputNumber", "pre", "code"].includes(node.tagName.getText(file))) {
        const dir = node.attributes.properties.find((attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText(file) === "dir") as ts.JsxAttribute | undefined;
        assert.ok(dir?.initializer && ts.isStringLiteral(dir.initializer) && ["ltr", "auto"].includes(dir.initializer.text), `Missing data direction: ${node.getText(file).slice(0, 100)}`);
    }
    ts.forEachChild(node, inspect);
};
inspect(file);
assert.ok(authored.size >= 170);
assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
assert.match(source, /translateRef\.current = t/);
assert.match(source, /confirmation\?\.modal\.update/);
assert.match(source, /description=\{<>.*t\(responseError.source, responseError.values\)/);
// Generated code and test assertions remain application artifacts, never translated.
const artifact = source.slice(source.indexOf("const generateCurl"), source.indexOf("const methodColor"));
assert.doesNotMatch(artifact, /\bt\(|translateRef/);
const assertions = source.slice(source.indexOf("const runTestScript"), source.indexOf("// ── Send request"));
assert.doesNotMatch(assertions, /\bt\(|translateRef/);

const rawName = "日本語 العربية Ω <fixture>", rawBody = '{"id":9223372036854775807,"n":0.9999999999999999999,"name":"日本語 العربية"}';
const env = { id: "env-fixture", name: rawName, variables: [{ key: "id", value: "9223372036854775807", enabled: true }, { key: "token", value: "Bearer-raw-日本語", enabled: true }] };
const ssl = { sslVerify: true, sslCaCert: "CA_LITERAL", sslClientCert: "CERT_LITERAL", sslClientKey: "KEY_LITERAL" };
const saved = { id: "saved-fixture", name: rawName, method: "POST", url: "https://api.example.test/{{id}}", headers: [{ id: "header", key: "X-Literal", value: "Literal-日本語", enabled: true }], queryParams: [{ id: "param", key: "q", value: "{{id}}", enabled: true }], body: rawBody, bodyType: "json", auth: { type: "bearer", bearer: { prefix: "Bearer", token: "{{token}}" } }, settings: { timeout: 17000, followRedirects: false, validateSSL: true, maxResponsePreviewBytes: 512 * 1024 }, createdAt: "2026-10-20" };
const response = { status: 200, body: rawBody, headers: { "content-type": "text/plain", "x-literal": rawName, "set-cookie": "fixture=literal; Secure; HttpOnly; SameSite=None" }, timing: 1.234, size: 101 };
const defaults = { method: saved.method, url: saved.url, headers: saved.headers, queryParams: saved.queryParams, body: saved.body, bodyType: saved.bodyType, auth: saved.auth, settings: saved.settings, sslConfig: ssl, mounted: true, environments: [env], activeEnvId: env.id, savedRequests: [saved], cookies: [{ id: "cookie", key: "fixture", value: "Cookie-日本語", enabled: true }] };
const nativeRequire = createRequire(import.meta.url), React = nativeRequire("react"), jsx = nativeRequire("react/jsx-runtime");
type Node = { type: any; props: Record<string, any> };
function harness(initial: Record<string, any> = {}) {
    let language: Language = "en", stateIndex = 0, refIndex = 0, memoIndex = 0, effectIndex = 0;
    const values: Record<string, any> = { ...defaults, ...initial }, refs: any[] = [], memos: any[] = [], effectDeps: any[] = [], effects: (() => unknown)[] = [];
    const calls: any[] = [], downloads: any[] = [], copies: any[] = [], saves: any[] = [], notices: any[] = [], confirms: any[] = [];
    const hooks: string[] = [];
    const collect = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") hooks.push(node.name.elements[0].getText(file)); ts.forEachChild(node, collect); }; collect(file);
    let failure: string | null = null, pending: ((signal: AbortSignal) => Promise<any>) | null = null;
    const same = (previous: any[] | undefined, next: any[] | undefined) => !!previous && !!next && previous.length === next.length && previous.every((entry, index) => Object.is(entry, next[index]));
    const memo = (factory: () => any, deps: any[]) => { const index = memoIndex++; if (!memos[index] || !same(memos[index].deps, deps)) memos[index] = { value: factory(), deps }; return memos[index].value; };
    const components = new Map<string, any>();
    const component = (name: string): any => { if (!components.has(name)) components.set(name, Object.assign(() => null, { fixtureName: name })); return components.get(name); };
    const Input = Object.assign(component("Input"), { Password: component("Input.Password"), TextArea: component("TextArea") });
    const Select = Object.assign(component("Select"), { Option: component("Select.Option") });
    const Modal = Object.assign(component("Modal"), { confirm: (props: any) => { const current = { props, updates: [] as any[], update: (next: any) => { current.updates.push(next); current.props = { ...current.props, ...next }; } }; confirms.push(current); return current; } });
    const antd = new Proxy({ Input, Select, Modal, Typography: { Text: component("Text") }, Space: Object.assign(component("Space"), { Compact: component("Space.Compact") }), Form: Object.assign(component("Form"), { Item: component("Form.Item") }) } as Record<string, any>, { get: (target, key: string) => target[key] ?? component(key) });
    const translations = Object.fromEntries(LANGUAGES.map(({ id }) => [id, (key: string, substitutions?: Record<string, string | number>) => translate(id, key, substitutions)]));
    const dispatch = async (request: any, signal: AbortSignal) => { calls.push(request); if (pending) return pending(signal); if (failure) throw new Error(failure); return response; };
    const module = { exports: {} as { default: () => Node } };
    const dependencies = (name: string): any => {
        if (name === "react/jsx-runtime") return jsx;
        if (name === "react") return { ...React, useState: (value: any) => { const key = hooks[stateIndex++]; if (!Object.hasOwn(values, key)) values[key] = typeof value === "function" ? value() : value; return [values[key], (next: any) => { values[key] = typeof next === "function" ? next(values[key]) : next; }]; }, useRef: (current: any) => { const index = refIndex++; return refs[index] ??= { current }; }, useMemo: memo, useCallback: (fn: any, deps: any[]) => memo(() => fn, deps), useEffect: (effect: () => unknown, deps: any[]) => { const index = effectIndex++; if (!same(effectDeps[index], deps)) { effects.push(effect); effectDeps[index] = deps; } } };
        if (name === "antd") return antd;
        if (name === "@ant-design/icons") return new Proxy({}, { get: (_target, key: string) => component(key) });
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: translations[language] }) };
        if (name.endsWith("messageService")) return { messageService: Object.fromEntries(["success", "warning", "error"].map((kind) => [kind, (text: string) => notices.push({ kind, text })])) };
        if (name.endsWith("project-storage")) return { projectStorage: { getItem: () => null, setItem: (key: string, value: string) => saves.push({ key, value }), removeItem: (key: string) => saves.push({ key }) } };
        if (name.endsWith("SslConfigSection")) return { __esModule: true, default: component("SslConfigSection"), DEFAULT_SSL_CONFIG: { sslVerify: true, sslCaCert: "", sslClientCert: "", sslClientKey: "" }, buildSslProxyFields: (input: any) => ({ ...input }) };
        if (name.endsWith("/variables")) return variables;
        if (name.endsWith("client-codegen")) return codegen;
        if (name.endsWith("curl-import")) return curl;
        if (name.endsWith("postman-collection")) return postman;
        if (name.endsWith("request-model")) return model;
        if (name.endsWith("download")) return { downloadText: (...args: any[]) => downloads.push(args), downloadBytes: (...args: any[]) => downloads.push(args) };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (...args: any[]) => { copies.push(args); return true; } };
        if (name.endsWith("certificate-fetch-response")) return { parseJsonResponse: async (value: any) => value };
        if (name.endsWith("local-connector-client")) return { connectorRequest: (request: any, signal: AbortSignal) => dispatch({ native: true, request, signal }, signal) };
        if (name.endsWith("CodeEditor")) return { CodeEditor: component("CodeEditor") };
        if (/ToolPageLayout|ApiClientExtensions/.test(name)) return { __esModule: true, default: component(name.split("/").at(-1)!) };
        throw new Error(`Unstubbed import: ${name}`);
    };
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module, exports: module.exports, require: dependencies, URL, URLSearchParams, AbortController, DOMException, Blob, FormData, Response, Uint8Array, Error, btoa, atob, console, fetch: async (url: string, options: any) => dispatch({ url, options, request: JSON.parse(options.body), signal: options.signal }, options.signal) });
    const render = (next: Language = language) => { language = next; stateIndex = refIndex = memoIndex = effectIndex = 0; return module.exports.default(); };
    const all = (root: any): Node[] => { const nodes: Node[] = [], seen = new Set(); const visit = (node: any) => { if (!node || typeof node !== "object" || seen.has(node)) return; seen.add(node); if (Array.isArray(node)) return node.forEach(visit); if (node.props) { nodes.push(node); for (const key of ["children", "title", "label", "description", "extra", "tabBarExtraContent"]) visit(node.props[key]); if (node.props.items) for (const item of node.props.items) { visit(item.label); visit(item.children); } } }; visit(root); return nodes; };
    const text = (node: any): string => { if (node === null || node === undefined || typeof node === "boolean") return ""; if (typeof node !== "object") return String(node); if (Array.isArray(node)) return node.map(text).join(""); return text(node.props?.children); };
    const named = (node: Node, name: string) => node.type?.fixtureName === name || node.type === name;
    const find = (name: string, predicate: (node: Node) => boolean = () => true) => { const match = all(render()).find((node) => named(node, name) && predicate(node)); assert.ok(match, `Missing ${name}`); return match; };
    const button = (key: string, substitutions?: Record<string, string | number>) => { const label = translate(language, key, substitutions); return find("Button", (node) => text(node) === label || node.props["aria-label"] === label); };
    const flushEffects = () => { effects.splice(0).forEach((effect) => effect()); };
    return { render, all, text, named, find, button, flushEffects, values, calls, downloads, copies, saves, notices, confirms, refs, setFailure: (detail: string | null) => { failure = detail; }, setPending: (handler: typeof pending) => { pending = handler; } };
}

async function main() {
    const fixture = harness({ response: rawBody, responseHeaders: response.headers, status: 200, responseCookies: [{ name: rawName, value: rawBody, domain: "fixture.example", path: "/literal", secure: true, httpOnly: true, sameSite: "None" }], history: [{ id: "history", method: "POST", url: saved.url, status: 200, time: 1.234, timestamp: "2026-10-20" }], requestName: rawName, testScript: `pm.test(${JSON.stringify(rawName)}, () => pm.expect(pm.response.code).to.equal(200));`, testResults: [{ name: rawName, passed: false, message: "Provider Ω: Expected status 200 but got 500" }], editingEnv: env, envModalOpen: true, responseError: null });
    fixture.render(); const stable = JSON.stringify(fixture.values), snippets = new Map<string, string>();
    const codeKeys = ["curl", "javascript-fetch", "javascript-axios", "node-http", "python", "go", "php", "ruby", "csharp", "java"];
    for (const { id } of LANGUAGES) {
        const root = fixture.render(id), nodes = fixture.all(root);
        assert.equal(JSON.stringify(fixture.values), stable, `${id}: language reset state`); assert.equal(fixture.calls.length, 0); assert.equal(fixture.saves.length, 0);
        assert.equal(root.props.title, translate(id, "API Request Builder"));
        assert.equal(root.props.description, translate(id, "HTTP and gRPC clients, collection runner, local mock server, environments, imports and code generation"));
        assert.ok(root.props.learnMore.howToUse.includes(translate(id, "Set up an environment (gear icon) so {{baseUrl}}, {{token}}, etc. resolve at send time")));
        assert.ok(root.props.learnMore.tips.some((tip: string) => tip.includes("{{$timestamp}}") && tip.includes("{{$randomUUID}}")));
        assert.equal(nodes.find((node) => fixture.named(node, "Input") && node.props["aria-label"] === translate(id, "Request URL"))?.props.value, saved.url);
        assert.ok(nodes.some((node) => fixture.named(node, "CodeEditor") && node.props.value === rawBody));
        assert.ok(nodes.some((node) => fixture.named(node, "CodeEditor") && node.props.value === fixture.values.testScript));
        const transport = nodes.find((node) => fixture.named(node, "Select") && node.props["aria-label"] === translate(id, "HTTP transport"))!;
        assert.deepEqual(Array.from(transport.props.options, (option: any) => option.value), ["managed", "native"]);
        const bodyTypes = nodes.find((node) => fixture.named(node, "Segmented") && node.props.value === "json" && node.props.options.length === 7)!;
        assert.deepEqual(Array.from(bodyTypes.props.options, (option: any) => option.value), ["none", "json", "xml", "text", "x-www-form-urlencoded", "form-data", "graphql"]);
        const codeTabs = nodes.find((node) => fixture.named(node, "Tabs") && node.props.items?.[0]?.key === "curl")!;
        assert.deepEqual(Array.from(codeTabs.props.items, (item: any) => item.key), codeKeys);
        for (const item of codeTabs.props.items) {
            const output = fixture.all(item.children).find((node) => node.type === "pre")!;
            assert.equal(output.props.dir, "ltr");
            const code = fixture.text(output); if (!snippets.has(item.key)) snippets.set(item.key, code); else assert.equal(code, snippets.get(item.key), `${id}: code changed: ${item.key}`);
            assert.ok(code.includes("9223372036854775807")); assert.ok(code.includes("Literal-日本語"));
        }
        assert.ok(nodes.some((node) => fixture.text(node).trim() === translate(id, "Saved Requests") + " (1)"));
        for (const modal of nodes.filter((node) => fixture.named(node, "Modal"))) assert.equal(modal.props.cancelText, translate(id, "Cancel"));
        for (const key of ["Add Header", "Add Param", "Add Cookie", "Send", "New Environment", "Add Variable"]) fixture.button(key);
        for (const key of ["Copy", "Download", "Save", "Settings", "Delete"]) assert.ok(nodes.some((node) => node.props["aria-label"] === translate(id, key)));
        const copy = nodes.find((node) => node.type === "button" && fixture.text(node) === translate(id, "Copy {language}", { language: "PHP" }))!; await copy.props.onClick(); assert.equal(fixture.copies.at(-1)[0], snippets.get("php"));
        const download = nodes.find((node) => node.type === "button" && fixture.text(node) === translate(id, "Download {language}", { language: "C#" }))!; download.props.onClick(); assert.equal(fixture.downloads.at(-1)[0], snippets.get("csharp")); assert.equal(fixture.downloads.at(-1)[1], "request.cs");
    }
    for (const { id } of LANGUAGES) {
        const client = harness({ testScript: `pm.test(${JSON.stringify(rawName)}, () => pm.expect(pm.response.code).to.equal(200));` }); client.render(id); await client.button("Send").props.onClick();
        assert.equal(client.calls.length, 1); const sent = client.calls[0].request;
        assert.equal(sent.url, "https://api.example.test/9223372036854775807?q=9223372036854775807"); assert.equal(sent.method, "POST"); assert.equal(sent.body, rawBody); assert.equal(sent.headers.Authorization, "Bearer Bearer-raw-日本語"); assert.equal(sent.headers.Cookie, "fixture=Cookie-日本語"); assert.equal(sent.headers["X-Literal"], "Literal-日本語"); assert.equal(sent.timeout, 17000); assert.equal(sent.followRedirects, false); assert.equal(sent.sslClientKey, "KEY_LITERAL");
        assert.equal(client.values.response, rawBody); assert.equal(client.values.testResults[0].name, rawName); assert.equal(client.values.testResults[0].passed, true);
        client.render(id === "ar" ? "de" : "ar"); const unchanged = JSON.stringify(client.values); client.render(id); assert.equal(JSON.stringify(client.values), unchanged); assert.equal(client.calls.length, 1);
        await client.button("Copy").props.onClick(); assert.equal(client.copies.at(-1)[0], rawBody); assert.equal(client.copies.at(-1)[1], translate(id, "Response copied"));
        client.values.requestName = rawName; const saveModal = client.find("Modal", (node) => node.props.title === translate(id, "Save Request")); saveModal.props.onOk(); assert.equal(client.values.savedRequests[0].name, rawName); assert.equal(client.values.savedRequests[0].body, rawBody); assert.equal(client.notices.at(-1).text, translate(id, "Request saved!"));
        const native = harness({ transport: "native" }); native.render(id); await native.button("Send").props.onClick(); assert.equal(native.calls[0].native, true); assert.equal(native.calls[0].request.body, rawBody); assert.equal(native.calls[0].request.tls.privateKey, "KEY_LITERAL"); assert.equal(native.calls[0].request.timeout, 15000);
        const failed = harness(); failed.setFailure("Provider Ω: Request failed. 日本語 العربية"); failed.render(id); await failed.button("Send").props.onClick(); const state = failed.values.responseError; const next = id === "ar" ? "de" : "ar"; const errorNodes = failed.all(failed.render(next)); const errorAlert = errorNodes.find((node) => failed.named(node, "Alert") && node.props.type === "error")!;
        assert.equal(failed.values.responseError, state); assert.equal(failed.text(errorAlert.props.description), translate(next, "Request failed.") + "Provider Ω: Request failed. 日本語 العربية");
        const invalid = harness({ url: "invalid-url" }); invalid.render(id); await invalid.button("Send").props.onClick(); assert.equal(invalid.calls.length, 0); assert.equal(invalid.values.responseError.source, "Invalid URL after variable substitution: {url}"); assert.equal(invalid.values.responseError.values.url, "invalid-url");
        const empty = harness({ url: "" }); empty.render(id); await empty.button("Send").props.onClick(); assert.equal(empty.notices.at(-1).text, translate(id, "Enter a URL first")); assert.equal(empty.calls.length, 0);
        const imports = harness({ curlText: `curl -X POST 'https://api.example.test/literal' -H 'X-Literal: 日本語' --data-raw '${rawBody}'` }); imports.render(id); imports.find("Modal", (node) => node.props.title === translate(id, "Import from cURL")).props.onOk(); assert.equal(imports.values.url, "https://api.example.test/literal"); assert.equal(imports.values.body, rawBody); assert.equal(imports.notices.at(-1).text, translate(id, "cURL imported")); assert.equal(imports.calls.length, 0);
        imports.values.importText = JSON.stringify({ info: { name: rawName, schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" }, item: [{ name: rawName, request: { method: "POST", url: "https://api.example.test/literal", body: { mode: "raw", raw: rawBody, options: { raw: { language: "json" } } } } }] });
        imports.find("Modal", (node) => node.props.title === translate(id, "Import Postman Collection (v2.1)")).props.onOk(); assert.equal(imports.values.savedRequests[0].name, rawName); assert.equal(imports.values.savedRequests[0].body, rawBody); assert.equal(imports.notices.at(-1).text, translate(id, "Requests imported: {count}", { count: 1 }));
        imports.button("Export").props.onClick(); assert.equal(imports.downloads.at(-1)[1], "mydevtools-collection.json"); const exported = JSON.parse(imports.downloads.at(-1)[0]); assert.equal(exported.item[0].name, rawName); assert.equal(exported.item[0].request.body.raw, rawBody);
        const envClient = harness({ editingEnv: env }); envClient.render(id); envClient.find("Modal", (node) => node.props.title === translate(id, "Edit Environment")).props.onOk(); assert.equal(envClient.values.environments[0].name, rawName); assert.equal(envClient.values.environments[0].variables[1].value, env.variables[1].value); assert.equal(envClient.notices.at(-1).text, translate(id, "Environment saved"));
    }
    // One existing confirmation changes its labels while keeping the same promise;
    // declining it never sends, and accepting it sends once with unresolved syntax.
    const confirm = harness({ url: "https://api.example.test/{{missing}}" }); confirm.render("en"); const sending = confirm.button("Send").props.onClick(); assert.equal(confirm.confirms.length, 1); confirm.render("ar"); confirm.flushEffects(); assert.equal(confirm.confirms[0].props.title, translate("ar", "Unresolved variables")); assert.ok(confirm.confirms[0].props.content.includes("{{vars}}")); assert.ok(confirm.confirms[0].props.content.includes("missing")); confirm.confirms[0].props.onCancel(); await sending; assert.equal(confirm.calls.length, 0);
    const accept = confirm.button("Send").props.onClick(); confirm.confirms[1].props.onOk(); await accept; assert.equal(confirm.calls.length, 1); assert.ok(confirm.calls[0].request.url.includes("%7B%7Bmissing%7D%7D"));
    // Cancellation remains connected to the original signal across locale changes.
    const pending = harness(); pending.setPending((signal) => new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(new DOMException("raw abort detail", "AbortError")), { once: true }))); pending.render("en"); const sent = pending.button("Send").props.onClick(); pending.render("ar"); pending.button("Cancel").props.onClick(); await sent; assert.equal(pending.calls.length, 1); assert.equal(pending.calls[0].signal.aborted, true); assert.equal(pending.values.responseError.source, "Cancelled"); assert.equal(pending.values.loading, false);
    console.log("HTTP client localization: 8 locales, authored UI/help/ARIA, stable drafts/options/URLs/payloads/credentials, all 10 code targets, managed/native send, scripts, save/import/export/environment, raw provider diagnostics, reactive confirmations and cancellation passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

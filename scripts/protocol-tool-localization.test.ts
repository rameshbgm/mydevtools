import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { webcrypto } from "node:crypto";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, type Language } from "../src/lib/i18n/catalog";
import { PROTOCOL_TOOL_TRANSLATIONS } from "../src/lib/i18n/protocol-tools";
import * as mcp from "../src/lib/mcp-protocol";
import * as a2a from "../src/lib/a2a-protocol";
import * as sse from "../src/lib/sse";
import * as structured from "../src/lib/structured-data";
import * as trace from "../src/lib/trace-context";
import * as asyncApi from "../src/lib/asyncapi";
import { parseJsonResponse } from "../src/lib/certificate-fetch-response";
import { APP_VERSION } from "../src/lib/app-version";

const browserCrypto = webcrypto as unknown as Crypto;
const translations = { ...SHARED_TRANSLATIONS, ...PROTOCOL_TOOL_TRANSLATIONS };
const tr = (language: Language, key: string, values?: Record<string, string | number>) => {
    const column = LANGUAGES.findIndex((item) => item.id === language) - 1;
    let copy = column < 0 ? key : translations[key]?.[column] ?? key;
    for (const [name, value] of Object.entries(values ?? {})) copy = copy.replaceAll(`{${name}}`, String(value));
    return copy;
};
const placeholders = (text: string) => [...text.matchAll(/\{([\w]+)\}/g)].map((m) => m[1]).sort();
for (const [source, columns] of Object.entries(PROTOCOL_TOOL_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    if (!process.env.PROTOCOL_STAGE) assert.deepEqual(SHARED_TRANSLATIONS[source], columns, `Catalog integration: ${source}`);
    if (SHARED_TRANSLATIONS[source]) assert.deepEqual(columns, SHARED_TRANSLATIONS[source], `Incumbent translation: ${source}`);
    for (const copy of columns) { assert.ok(copy.trim(), source); assert.deepEqual(placeholders(copy), placeholders(source), source); }
}

const ids = ["mcp-inspector", "a2a-inspector", "oauth-oidc-playground", "trace-context-inspector", "asyncapi-explorer", "swagger-ui"];
const nativeRequire = createRequire(import.meta.url), React = nativeRequire("react"), jsx = nativeRequire("react/jsx-runtime");
type Element = { type: any; props: Record<string, any> };
const rawName = "日本語 العربية 🌍", rawDiagnostic = "public-provider-diagnostic: 日本語 العربية 9223372036854775807";
const fixtureCard = { name: rawName, description: rawDiagnostic, version: "1.0.0", supportedInterfaces: [{ url: "https://agent.example/rpc", protocolBinding: "JSONRPC", protocolVersion: "1.0" }], capabilities: { streaming: true }, skills: [{ id: "raw-skill", name: rawName }] };
function harness(id: string, overrides: Record<string, any> = {}) {
    const path = process.env.PROTOCOL_STAGE ? `${process.env.PROTOCOL_STAGE}/${id}/page.tsx` : `src/app/tools/${id}/page.tsx`;
    const source = readFileSync(path, "utf8"), ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.equal((ast as ts.SourceFile & { parseDiagnostics: ts.Diagnostic[] }).parseDiagnostics.length, 0, id);
    const names: string[] = [];
    const collect = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(ast) === "useState") names.push(node.name.elements[0].getText(ast));
        ts.forEachChild(node, collect);
    }; collect(ast);
    let language: Language = "en", stateSlot = 0, refSlot = 0, effectSlot = 0, memoSlot = 0;
    const state: Record<string, any> = { ...overrides }, refs: any[] = [], effectDeps: unknown[][] = [], memo: { deps: unknown[]; value: unknown }[] = [], pending: (() => void)[] = [];
    const log = { requests: [] as { url: string; init?: RequestInit }[], notices: [] as string[], copies: [] as string[], writes: [] as unknown[], randomCalls: 0, digests: 0 };
    let deferredFetch: ((url: string, init?: RequestInit) => Promise<Response>) | null = null;
    let deferredDigest: ((algorithm: AlgorithmIdentifier, data: BufferSource) => Promise<ArrayBuffer>) | null = null;
    const messages = Object.fromEntries(["success", "error", "info", "warning"].map((kind) => [kind, (copy: string) => log.notices.push(copy)]));
    const changed = (previous: unknown[] | undefined, deps: unknown[]) => !previous || previous.length !== deps.length || deps.some((v, i) => !Object.is(v, previous[i]));
    const component = (name: string) => Object.assign((props: Record<string, unknown>) => React.createElement(name, props, props.children), { Item: "item-fixture", Group: "group-fixture", Compact: "compact-fixture", Password: "password-fixture", TextArea: "textarea-fixture", Button: "radio-button-fixture", PRESENTED_IMAGE_SIMPLE: "empty-fixture" });
    const dependencies = (name: string): any => {
        if (name === "react") return { ...React,
            useState: (initial: any) => { const key = names[stateSlot++]; assert.ok(key, `${id}: known state hook`); if (!Object.hasOwn(state, key)) state[key] = typeof initial === "function" ? initial() : initial; return [state[key], (value: any) => { state[key] = typeof value === "function" ? value(state[key]) : value; }]; },
            useRef: (value: unknown) => { const slot = refSlot++; return refs[slot] ??= { current: value }; },
            useEffect: (effect: () => void, deps: unknown[]) => { const slot = effectSlot++; if (changed(effectDeps[slot], deps)) { effectDeps[slot] = deps; pending.push(effect); } },
            useCallback: (callback: unknown) => callback,
            useMemo: (compute: () => unknown, deps: unknown[]) => { const slot = memoSlot++; if (!memo[slot] || changed(memo[slot].deps, deps)) memo[slot] = { deps, value: compute() }; return memo[slot].value; },
        };
        if (name === "react/jsx-runtime") return jsx;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (key: string, values?: Record<string, string | number>) => tr(language, key, values) }) };
        if (name === "antd") return new Proxy({ App: { useApp: () => ({ message: messages }) }, Typography: { Text: "text-fixture", Paragraph: "paragraph-fixture" } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => component("icon-fixture") });
        if (name.endsWith("mcp-protocol")) return mcp;
        if (name.endsWith("a2a-protocol")) return a2a;
        if (name.endsWith("/sse")) return sse;
        if (name.endsWith("structured-data")) return structured;
        if (name.endsWith("trace-context")) return { ...trace, generateTraceParent: () => { log.randomCalls++; return trace.generateTraceParent(); } };
        if (name.endsWith("/asyncapi")) return asyncApi;
        if (name.endsWith("app-version")) return { APP_VERSION };
        if (name.endsWith("store")) return { useAppStore: () => ({ darkMode: false }) };
        if (name.endsWith("project-storage")) return { projectStorage: { getItem: () => null, setItem: (...args: unknown[]) => log.writes.push(args) } };
        if (name.endsWith("messageService")) return { messageService: messages };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { log.copies.push(value); return true; } };
        if (name.endsWith("SslConfigSection")) return { __esModule: true, default: "ssl-fixture", DEFAULT_SSL_CONFIG: { sslVerify: true, sslCaCert: "", sslClientCert: "", sslClientKey: "" }, buildSslProxyFields: () => ({}) };
        if (name.endsWith("certificate-fetch-response")) return { parseJsonResponse };
        if (name.endsWith("CodeEditor")) return { CodeEditor: "editor-fixture" };
        if (name === "next/dynamic") return { __esModule: true, default: () => "swagger-fixture" };
        if (name.endsWith(".css")) return {};
        if (name.endsWith("ToolPageLayout") || name.endsWith("ToolBridgeBanner")) return { __esModule: true, default: component(name.split("/").at(-1)!) };
        throw new Error(`Unstubbed import: ${name}`);
    };
    const mockFetch = async (input: string, init?: RequestInit) => {
        log.requests.push({ url: input, init });
        if (deferredFetch) return deferredFetch(input, init);
        if (id === "a2a-inspector") return new Response(JSON.stringify(fixtureCard), { headers: { "content-type": "application/json" } });
        const request = JSON.parse(String(init?.body));
        return new Response(JSON.stringify({ jsonrpc: "2.0", id: request.id, result: request.method === "tools/list" ? { tools: [{ name: rawName, inputSchema: { type: "object" } }] } : request.method === "tools/call" ? { content: [{ type: "text", text: rawDiagnostic }] } : { serverInfo: { name: rawName } } }), { headers: { "content-type": "application/json" } });
    };
    const module = { exports: {} as { default: () => Element } };
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module, exports: module.exports, require: dependencies, console, URL, URLSearchParams, Response, Headers, AbortController, Error, Date, TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, setTimeout, clearTimeout, btoa, atob,
        crypto: { randomUUID: () => "public-fixture-uuid", getRandomValues: (array: Uint8Array) => { log.randomCalls++; return browserCrypto.getRandomValues(array); }, subtle: { digest: (algorithm: AlgorithmIdentifier, data: BufferSource) => { log.digests++; return deferredDigest ? deferredDigest(algorithm, data) : browserCrypto.subtle.digest(algorithm, data); } } },
        window: { location: { origin: "https://tools.example" }, addEventListener: () => {}, removeEventListener: () => {} }, fetch: mockFetch,
    });
    let tree: Element;
    const render = (next: Language = language) => { language = next; stateSlot = refSlot = effectSlot = memoSlot = 0; tree = module.exports.default(); while (pending.length) pending.shift()!(); return tree; };
    const all = (root: any = tree): Element[] => { const nodes: Element[] = []; const seen = new Set(); const walk = (node: any) => { if (Array.isArray(node)) return node.forEach(walk); if (!node || typeof node !== "object" || seen.has(node)) return; seen.add(node); if (node.props) { nodes.push(node); walk(node.props.children); walk(node.props.title); walk(node.props.label); walk(node.props.description); walk(node.props.extra); walk(node.props.tabBarExtraContent); for (const item of node.props.items ?? []) { walk(item.children); walk(item.label); } } }; walk(root); return nodes; };
    const handler = (name: string) => { const node = all().find((n) => n.props.onClick?.name === name); assert.ok(node, `${id}: handler ${name}`); return node.props.onClick; };
    const button = (key: string) => { const node = all().find((n) => text(n) === tr(language, key) && typeof n.props.onClick === "function"); assert.ok(node, `${id}: button ${key}`); return node.props.onClick; };
    return { source, state, log, render, all, handler, button, language: () => language, deferFetch: (next: typeof deferredFetch) => { deferredFetch = next; }, deferDigest: (next: typeof deferredDigest) => { deferredDigest = next; } };
}
function text(node: any): string { if (node === null || node === undefined || typeof node === "boolean") return ""; if (typeof node !== "object") return String(node); if (Array.isArray(node)) return node.map(text).join(""); return text(node.props?.children); }

async function main() {
    for (const id of ids) {
        const h = harness(id); h.render(); const draft = JSON.stringify(h.state), requests = h.log.requests.length, randomness = h.log.randomCalls;
        for (const { id: language } of LANGUAGES) {
            h.render(language); assert.equal(JSON.stringify(h.state), draft, `${id}: draft preserved in ${language}`); assert.equal(h.log.requests.length, requests, `${id}: no locale request`); assert.equal(h.log.randomCalls, randomness, `${id}: no locale random generation`);
            assert.match(h.source, /useLanguage\(\)/); assert.doesNotMatch(h.source, /key=\{(?:language|direction)\}/);
            assert.ok(h.all().some((node) => node.props.title === tr(language, id === "mcp-inspector" ? "MCP Inspector" : id === "a2a-inspector" ? "A2A Inspector" : id === "oauth-oidc-playground" ? "OAuth / OIDC & PKCE Playground" : id === "trace-context-inspector" ? "Trace Context Inspector" : id === "asyncapi-explorer" ? "AsyncAPI Explorer" : "Swagger / OpenAPI Viewer")), `${id}: translated title`);
        }
    }
    // Authored JSX/help copy is covered; machine identifiers and parser diagnostics are exempt.
    for (const id of ids) {
        const work = harness(id), ast = ts.createSourceFile(id, work.source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
        const check = (node: ts.Node) => {
            if (ts.isCallExpression(node) && ["t", "notice"].includes(node.expression.getText(ast)) && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(translations[node.arguments[0].text], id + ": " + node.arguments[0].text);
            if (ts.isPropertyAssignment(node) && ["whatIs", "whyUse", "purpose"].includes(node.name.getText(ast)) && ts.isStringLiteral(node.initializer)) assert.ok(translations[node.initializer.text], id + ": help " + node.initializer.text);
            if (ts.isPropertyAssignment(node) && ["howToUse", "tips", "useCases", "sentFields"].includes(node.name.getText(ast)) && ts.isArrayLiteralExpression(node.initializer)) for (const child of node.initializer.elements) if (ts.isStringLiteral(child)) assert.ok(translations[child.text], id + ": help " + child.text);
            ts.forEachChild(node, check);
        }; check(ast);
        assert.doesNotMatch(work.source, /t\((?:step\.detail|cardError|result\.error|msg\.content|cardJson|callArgs|lastResult)\)/, "Raw diagnostics/payloads stay exact");
    }
    // Every language exercises the actual authored PKCE and Swagger render handlers.
    for (const { id: language } of LANGUAGES) {
        const q = harness("oauth-oidc-playground"); q.render(language); q.button("Inspect metadata")(); q.render(); await q.button("Generate PKCE S256")(); q.render();
        assert.equal(q.log.notices.at(-1), tr(language, "PKCE S256 pair generated locally")); assert.equal(q.log.requests.length, 0); assert.equal(q.state.result.supportsS256, true);
        const viewer = harness("swagger-ui", { spec: 'openapi: 3.1.0\ninfo:\n  title: "日本語 العربية 🌍"\n  version: 1.0.0\npaths: {}' }); viewer.render(language); viewer.button("Render Docs")(); assert.equal(viewer.state.mode, "view"); assert.equal(viewer.log.requests.length, 0);
        const tracing = harness("trace-context-inspector", { parent: "invalid" }); tracing.render(language); tracing.button("Inspect headers")(); tracing.render(); assert.ok(tracing.all().some((node) => node.props.role === "alert" && text(node) === tr(language, tracing.state.error)));
    }
    // The real PKCE handler uses WebCrypto; locale changes do not regenerate any secret.
    const oauth = harness("oauth-oidc-playground"); oauth.render(); oauth.button("Inspect metadata")(); oauth.render();
    let completeDigest!: (value: ArrayBuffer) => void;
    oauth.deferDigest((_algorithm, data) => new Promise((resolve) => { completeDigest = async () => resolve(await browserCrypto.subtle.digest("SHA-256", data)); }));
    const generating = oauth.button("Generate PKCE S256")();
    const callsBeforeLocale = oauth.log.randomCalls;
    oauth.render("ar"); assert.equal(oauth.log.randomCalls, callsBeforeLocale); completeDigest(new ArrayBuffer(0)); await generating; oauth.render();
    assert.equal(oauth.log.notices.at(-1), tr("ar", "PKCE S256 pair generated locally"));
    const pair = oauth.state.pkce, expectedChallenge = Buffer.from(await browserCrypto.subtle.digest("SHA-256", new TextEncoder().encode(pair.verifier))).toString("base64url");
    assert.equal(pair.challenge, expectedChallenge); assert.match(pair.verifier, /^[A-Za-z0-9_-]{64}$/); assert.equal(oauth.log.requests.length, 0);
    for (const { id: language } of LANGUAGES) { oauth.render(language); assert.deepEqual(oauth.state.pkce, pair); assert.equal(oauth.log.digests, 1); const url = oauth.all().find((node) => typeof node.props.children === "string" && node.props.children.startsWith("https://id.example.com/authorize?"))?.props.children; assert.ok(url); assert.equal(new URL(url).searchParams.get("code_challenge"), pair.challenge); }
    oauth.state.discovery = '{"issuer":"http://insecure.example"}'; oauth.render(); oauth.button("Inspect metadata")(); oauth.render("ja"); assert.ok(oauth.state.result.issues.length >= 4); assert.ok(oauth.all().some((node) => node.props.title === tr("ja", "Missing authorization_endpoint.")));
    // Actual MCP connection/call handlers retain versioned wire envelopes and raw results.
    const m = harness("mcp-inspector"); m.render(); m.render(); m.state.config = { ...m.state.config, serverUrl: "https://mcp.example/mcp", connectionMode: "direct-strict", protocolVersion: mcp.MCP_CURRENT_VERSION };
    m.render(); await m.handler("handleConnect")(); m.render(); assert.equal(m.state.connected, true); assert.deepEqual(m.log.requests.map(({ init }) => JSON.parse(String(init?.body)).method), ["server/discover", "tools/list"]);
    const header = m.log.requests[0].init?.headers as Record<string, string>; assert.equal(header["MCP-Protocol-Version"], mcp.MCP_CURRENT_VERSION); assert.equal(header["Mcp-Method"], "server/discover");
    m.state.selectedTool = m.state.tools[0]; m.state.callArgs = '{"id":"9223372036854775807","message":"日本語 العربية 🌍"}'; m.render(); await m.handler("handleCall")(); m.render(); const exactResult = m.state.lastResult, requestCount = m.log.requests.length;
    assert.ok(exactResult.includes(rawDiagnostic)); const lastRequest = JSON.parse(String(m.log.requests.at(-1)?.init?.body)); assert.equal(lastRequest.method, "tools/call"); assert.equal(lastRequest.params.arguments.message, rawName);
    let expectedRequests = requestCount;
    for (const { id: language } of LANGUAGES) { m.render(language); assert.equal(m.state.lastResult, exactResult); assert.equal(m.log.requests.length, expectedRequests); await m.handler("handleCall")(); m.render(); expectedRequests++; assert.equal(m.log.requests.length, expectedRequests); assert.equal(m.state.lastResult, exactResult); }
    // The real discovery handler emits RFC 7617 UTF-8/NFC Basic bytes and keeps ASCII compatible.
    const auth = { type: "basic", basic: { username: "public-e\u0301-日本語", password: "العربية-🌍" }, bearer: { token: "" }, apiKey: { name: "X-API-Key", value: "", in: "header" }, oauth2: { accessToken: "", tokenType: "Bearer" } };
    const a = harness("a2a-inspector", { agentUrl: "https://agent.example", protocolVersion: "1.0", connectionMode: "direct-strict", auth }); a.render(); a.render();
    let resolveCard!: (value: Response) => void; a.deferFetch(() => new Promise((resolve) => { resolveCard = resolve; })); const discovering = a.handler("fetchAgentCard")(); a.render("fr"); assert.equal(a.log.requests.length, 1); resolveCard(new Response(JSON.stringify(fixtureCard), { headers: { "content-type": "application/json" } })); await discovering; a.render();
    assert.equal(a.log.notices.at(-1), tr("fr", "Agent card loaded")); const rawCard = a.state.cardJson;
    assert.equal((a.log.requests[0].init?.headers as Record<string, string>).Authorization, `Basic ${Buffer.from(`${auth.basic.username.normalize("NFC")}:${auth.basic.password.normalize("NFC")}`, "utf8").toString("base64")}`);
    assert.equal((a.log.requests[0].init?.headers as Record<string, string>)["A2A-Version"], "1.0");
    for (const { id: language } of LANGUAGES) { a.render(language); assert.equal(a.state.cardJson, rawCard); assert.equal(a.state.agentCard.name, rawName); assert.equal(a.log.requests.length, 1); }
    for (const { id: language } of LANGUAGES) { const client = harness("a2a-inspector", { agentUrl: "https://agent.example", protocolVersion: "1.0", connectionMode: "direct-strict", auth }); client.render(language); await client.handler("fetchAgentCard")(); client.render(); assert.equal(client.state.agentCard.name, rawName); assert.equal(client.log.notices.at(-1), tr(language, "Agent card loaded")); assert.equal(client.log.requests.length, 1); }
    a.deferFetch(null); a.state.auth = { ...auth, basic: { username: "Aladdin", password: "open sesame" } }; a.render(); await a.handler("fetchAgentCard")(); assert.equal((a.log.requests.at(-1)?.init?.headers as Record<string, string>).Authorization, "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==");
    for (const credentials of [{ username: "invalid:name", password: "public" }, { username: "public", password: "bad\nvalue" }]) { const before: number = a.log.requests.length; a.state.auth = { ...auth, basic: credentials }; a.render(); await a.handler("fetchAgentCard")(); assert.equal(a.log.requests.length, before); assert.ok(a.state.cardError); }
    // Real trace/AsyncAPI engines remain locale-independent; only authored review copy changes.
    const t = harness("trace-context-inspector"); t.render(); t.button("Inspect headers")(); t.render(); const original = t.state.result; assert.equal(JSON.parse(original).traceparent.traceId, "4bf92f3577b34da6a3ce929d0e0e4736");
    for (const { id: language } of LANGUAGES) { t.render(language); assert.equal(t.state.result, original); assert.equal(t.log.randomCalls, 0); }
    t.state.parent = "invalid"; t.render(); t.button("Inspect headers")(); t.render("ar"); assert.equal(t.state.result, ""); assert.ok(t.all().some((node) => node.props.role === "alert" && text(node) === tr("ar", t.state.error)));
    const async = harness("asyncapi-explorer"); async.render(); async.state.document = 'asyncapi: 3.0.0\ninfo:\n  title: "日本語 العربية 🌍"\n  version: 1.2.3\nchannels: {}';
    for (const { id: language } of LANGUAGES) { async.render(language); assert.ok(async.all().some((node) => text(node) === rawName)); assert.ok(async.all().some((node) => node.props.title === tr(language, "No channels were declared."))); assert.equal(async.log.requests.length, 0); }
    // Swagger accepts JSON/YAML through its actual upload and render handlers; malformed/multi-document YAML never enters view mode.
    const swagger = harness("swagger-ui"); swagger.render(); const upload = swagger.all().find((node) => typeof node.props.beforeUpload === "function"); assert.ok(upload);
    const yaml = 'openapi: 3.1.0\ninfo:\n  title: "日本語 العربية 🌍"\n  version: 1.0.0\npaths: {}'; assert.equal(await upload.props.beforeUpload({ text: async () => yaml }), false); swagger.render("ar"); swagger.button("Render Docs")(); assert.equal(swagger.state.mode, "view"); assert.equal(swagger.state.spec, yaml);
    for (const { id: language } of LANGUAGES) { swagger.render(language); assert.equal(swagger.state.spec, yaml); assert.equal(swagger.state.mode, "view"); assert.equal(swagger.log.requests.length, 0); }
    for (const input of ['{"openapi":"3.0.0","info":{"title":"public","version":"1"},"paths":{}}', yaml, '---\nopenapi: 3.0.0\n---\nopenapi: 3.1.0', 'openapi: [', '[]']) { swagger.state.mode = "edit"; swagger.state.spec = input; swagger.render(); swagger.button("Render Docs")(); assert.equal(swagger.state.mode, input === yaml || input.startsWith('{"openapi"') ? "view" : "edit"); if (swagger.state.mode === "edit") assert.ok(swagger.state.validationError); }
    console.log("✓ Protocol UI: eight-language drafts, real PKCE, modern MCP, UTF-8/NFC A2A Basic, trace/AsyncAPI review and Swagger JSON/YAML handlers; no locale resend or regeneration");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

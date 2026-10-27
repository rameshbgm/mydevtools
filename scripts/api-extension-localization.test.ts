import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { API_EXTENSION_TRANSLATIONS } from "../src/lib/i18n/api-extensions";
import * as collectionRunner from "../src/lib/api-builder/collection-runner";
import type { ApiSavedRequest } from "../src/lib/api-builder/request-model";

const paths = ["ApiClientExtensions", "ApiCollectionRunner", "ApiGrpcClient", "ApiLocalMocks"].map((name) => `src/components/${name}.tsx`);
const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(API_EXTENSION_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.deepEqual(SHARED_TRANSLATIONS[source], columns, `Catalog integration: ${source}`);
    for (const column of columns) { assert.ok(column.trim(), source); assert.deepEqual(placeholders(column), placeholders(source), source); }
    for (const { id } of LANGUAGES) {
        const copy = translate(id, source);
        assert.ok(copy.trim(), `${id}: ${source}`);
        if (id !== "en" && !["Host", "Port", "Assertions", "Transport"].includes(source)) assert.notEqual(copy, source, `${id}: English fallback: ${source}`);
    }
}

// Inspect authored copy and direction without interpreting schema, requests,
// result payloads, options' stable values or provider diagnostics as translations.
for (const path of paths) {
    const source = readFileSync(path, "utf8"), file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const requireCopy = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) assert.ok(Object.hasOwn(API_EXTENSION_TRANSLATIONS, node.text), `${path}: ${node.text}`);
        else if (ts.isConditionalExpression(node)) { requireCopy(node.whenTrue); requireCopy(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && /[a-zA-Z]/.test(node.text.trim())) assert.ok(/^(?:gRPC|HTTP|ms)$/.test(node.text.trim()), `${path}: untranslated JSX: ${node.text}`);
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0]) requireCopy(node.arguments[0]);
        if (ts.isCallExpression(node) && node.expression.getText(file) === "setNotice" && node.arguments[0] && !(ts.isStringLiteral(node.arguments[0]) && !node.arguments[0].text)) requireCopy(node.arguments[0]);
        if (ts.isPropertyAssignment(node) && node.name.getText(file) === "source" && ts.isStringLiteral(node.initializer) && /\s/.test(node.initializer.text) && !node.initializer.text.includes("\n")) requireCopy(node.initializer);
        if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && ["textarea", "pre", "code", "input"].includes(node.tagName.getText(file))) {
            const attrs = node.attributes.properties.filter(ts.isJsxAttribute), type = attrs.find((a) => a.name.getText(file) === "type")?.initializer;
            if (!(type && ts.isStringLiteral(type) && ["checkbox", "file"].includes(type.text))) {
                const dir = attrs.find((a) => a.name.getText(file) === "dir")?.initializer;
                assert.ok(dir && ts.isStringLiteral(dir) && dir.text === "ltr", `${path}: machine editor/output direction`);
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
    assert.match(source, /useLanguage\(\)/);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
    assert.doesNotMatch(source, /useEffect\([\s\S]*?,\s*\[(?:language|t)\]\)/, "Locale changes must not restart operations");
    assert.match(source, /dir="auto"|ApiClientExtensions/);
}

const nativeRequire = createRequire(import.meta.url), React = nativeRequire("react"), jsx = nativeRequire("react/jsx-runtime");
type Node = { type: unknown; props: Record<string, any> };
type Sent = { input: any; signal?: AbortSignal };
const rawName = "日本語 العربية <fixture>", rawJson = '{"id":9223372036854775807,"n":0.9999999999999999999,"message":"日本語 العربية"}';
const request: ApiSavedRequest = { id: "saved", name: rawName, method: "POST", url: "http://localhost:4312/{{id}}", headers: [{ id: "header", key: "X-Literal", value: "literal-fixture", enabled: true }], queryParams: [], body: rawJson, bodyType: "json", auth: { type: "bearer", bearer: { prefix: "Bearer", token: "{{token}}" } }, settings: { timeout: 2000, followRedirects: false, validateSSL: true, maxResponsePreviewBytes: 1024 }, createdAt: "2026-10-20" };
const step = { id: "step", requestId: request.id, assertions: [{ source: "status", path: "", operator: "equals", expected: "200" }], captures: [{ source: "json", path: "/id", name: "capturedId" }] };
const response = { status: 200, body: rawJson, headers: { "content-type": "application/json", "x-literal": rawName }, timing: 1.234, size: 117 };
const method = { service: "example.Echo", name: "Chat", path: "/example.Echo/Chat", requestStream: true, responseStream: true, requestType: "example.EchoRequest", responseType: "example.EchoReply", sample: { id: "9223372036854775807", message: rawName } };
const rpcResult = { status: { code: 0, name: "OK", details: rawName }, messages: [JSON.parse('{"id":"9223372036854775807","message":"日本語 العربية"}')], elapsedMs: 1.234, metadata: { "x-raw": "AAE=" } };
const mock = { id: "mock-raw", name: rawName, baseUrl: "http://127.0.0.1:4312/m/raw-capability", project: "personal", expiresAt: "2026-10-20T12:30:00Z", routes: [{ method: "GET", path: "/日本語", status: 201, headers: {}, body: rawJson, delayMs: 12 }], requests: 2 };

function harness(path: string, initial: Record<string, any> = {}, props: Record<string, any> = {}) {
    let language: Language = "en", stateIndex = 0, refIndex = 0;
    const values: Record<string, any> = { ...initial }, refs: any[] = [], calls: Sent[] = [], exports: any[] = [], copies: string[] = [], saves: any[] = [], effects: (() => unknown)[] = [];
    const hookNames: string[] = [], source = readFileSync(path, "utf8"), file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const collect = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") hookNames.push(node.name.elements[0].getText(file)); ts.forEachChild(node, collect); }; collect(file);
    let fail: string | null = null, pending: ((input: any, signal?: AbortSignal) => Promise<any>) | null = null;
    const connector = async (input: any, signal?: AbortSignal) => {
        calls.push({ input, signal });
        if (pending) return pending(input, signal);
        if (fail) throw new Error(fail);
        if (input.service === "request") return response;
        if (input.service === "grpc") return input.operation === "describe" ? { methods: [method] } : rpcResult;
        if (input.operation === "list") return { mocks: [mock] };
        return { ok: true };
    };
    const noop = () => null, module = { exports: {} as { default: (props?: any) => Node } };
    const dependencies = (name: string): any => {
        if (name === "react/jsx-runtime") return jsx;
        if (name === "react") return { ...React, useState: (initialValue: any) => { const key = hookNames[stateIndex++]; if (!Object.hasOwn(values, key)) values[key] = typeof initialValue === "function" ? initialValue() : initialValue; return [values[key], (next: any) => { values[key] = typeof next === "function" ? next(values[key]) : next; }]; }, useRef: (current: any) => { const index = refIndex++; return refs[index] ??= { current }; }, useEffect: (effect: () => unknown) => { if (!effects.length) effects.push(effect); }, useCallback: (callback: unknown) => callback };
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (source: string, substitutions?: Record<string, string | number>) => translate(language, source, substitutions) }) };
        if (name === "antd") return { Select: "select-fixture", Tabs: "tabs-fixture" };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => noop });
        if (name.endsWith("collection-runner")) return collectionRunner;
        if (name.endsWith("local-connector-client")) return { connectorRequest: connector };
        if (name.endsWith("project-storage")) return { activeSessionProjectId: () => "personal", projectStorage: { getItem: () => null, setItem: (key: string, value: string) => saves.push({ key, value }) } };
        if (name.endsWith("download")) return { downloadText: (...args: any[]) => exports.push(args) };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (text: string) => { copies.push(text); } };
        if (name.endsWith("certificate-fetch-response")) return { parseJsonResponse: async () => response };
        if (/ApiCollectionRunner|ApiGrpcClient|ApiLocalMocks|LocalConnectorAccess/.test(name)) return { __esModule: true, default: noop };
        throw new Error(`Unstubbed import: ${name}`);
    };
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module, exports: module.exports, require: dependencies, Error, AbortController, TextEncoder, crypto: { randomUUID: () => "new-stable-step" }, fetch: async (...args: any[]) => { calls.push({ input: args }); return {}; }, window: { addEventListener: noop, removeEventListener: noop }, console });
    const render = (nextLanguage: Language = language) => { language = nextLanguage; stateIndex = refIndex = 0; return module.exports.default(props); };
    const all = (root: any): Node[] => { const nodes: Node[] = []; const visit = (node: any) => { if (Array.isArray(node)) return node.forEach(visit); if (!node || typeof node !== "object" || !node.props) return; nodes.push(node); visit(node.props.children); if (node.props.items) for (const item of node.props.items) visit(item.children); }; visit(root); return nodes; };
    const text = (node: any): string => { if (node === null || node === undefined || typeof node === "boolean") return ""; if (typeof node !== "object") return String(node); if (Array.isArray(node)) return node.map(text).join(""); return text(node.props?.children); };
    const findButton = (source: string) => { const root = render(); const found = all(root).find((node) => node.type === "button" && text(node) === translate(language, source)); assert.ok(found, `${path}: missing button ${source}`); return found; };
    return { render, all, text, values, calls, exports, copies, saves, refs, effects, findButton, setFailure: (message: string | null) => { fail = message; }, setPending: (handler: typeof pending) => { pending = handler; }, click: async (source: string) => { await findButton(source).props.onClick(); await new Promise((resolve) => setTimeout(resolve, 0)); } };
}

async function main() {
    // Reuse the exact same hook state across all eight locales. Translation
    // cannot clear plans, requests, credentials, proto files, results or servers.
    const runnerResult = { stepId: "step", requestId: "saved", name: rawName, iteration: 2, passed: false, response, error: "Provider Ω: RPC failed.", assertions: [{ passed: false, description: "json /id equals 9223372036854775807", actual: "9223372036854775807" }], captured: ["capturedId"] };
    const fixtures = [
        harness(paths[0], {}, { requests: [request], variables: { token: "fixture", id: "9223372036854775807" }, environmentName: rawName }),
        harness(paths[1], { steps: [step], results: [runnerResult], run: { stopped: "failure", results: [runnerResult], variables: { token: "fixture" } }, notice: "Plan saved in this project. Requests and environment values are managed in the HTTP client.", error: { source: "Saved plan could not be loaded.", detail: "Provider Ω: Plan saved in this project." } }, { requests: [request], variables: { token: "fixture", id: "9223372036854775807" }, environmentName: rawName }),
        harness(paths[2], { methods: [method], method: method.path, result: rpcResult, messages: rawJson, metadata: '{"authorization":"Bearer fixture","trace-bin":"AAE="}', certificates: { serverName: "fixture.local", ca: "CA_LITERAL", certificate: "CERT_LITERAL", privateKey: "KEY_LITERAL" }, notice: 0, error: { source: "RPC failed.", detail: "Provider Ω: RPC failed." } }),
        harness(paths[3], { configuration: rawJson, mocks: [mock], loaded: true, notice: "Mock base URL copied.", error: { source: "Mock operation failed.", detail: "Provider Ω: Mock operation failed." } }),
    ];
    for (const fixture of fixtures) {
        fixture.render(); const stable = JSON.stringify(fixture.values);
        for (const { id } of LANGUAGES) {
            const root = fixture.render(id), nodes = fixture.all(root), text = fixture.text(root);
            assert.equal(JSON.stringify(fixture.values), stable, `${id}: locale changed operational state`);
            assert.equal(fixture.calls.length, 0, `${id}: locale triggered network`);
            for (const node of nodes.filter((node) => ["input", "textarea", "pre", "code"].includes(String(node.type)) && !["file", "checkbox"].includes(node.props.type))) assert.equal(node.props.dir, "ltr");
            if (fixture.values.error) { assert.ok(text.includes(translate(id, fixture.values.error.source))); assert.ok(text.includes(fixture.values.error.detail)); }
            if (fixture.values.messages) { assert.ok(nodes.some((node) => node.type === "textarea" && node.props.value === rawJson)); assert.ok(text.includes(translate(id, "Messages: {count}", { count: 1 }))); assert.ok(text.includes("9223372036854775807")); assert.ok(text.includes(translate(id, "Methods loaded: {count}. No service connection has been made.", { count: 0 }))); }
            if (fixture.values.configuration) { assert.ok(text.includes(mock.baseUrl)); assert.ok(text.includes(rawName)); assert.ok(text.includes(rawJson.replaceAll('"', '\\"')) || nodes.some((node) => node.type === "textarea" && node.props.value === rawJson)); }
            if (fixture.values.steps) {
                const selects = nodes.filter((node) => node.type === "select-fixture");
                assert.deepEqual(Array.from(selects[0].props.options, (option: any) => option.value), ["managed", "native"]);
                assert.deepEqual(Array.from(selects[2].props.options, (option: any) => option.value), ["status", "header", "json", "duration"]);
                assert.deepEqual(Array.from(selects[3].props.options, (option: any) => option.value), ["equals", "contains", "exists", "less-than"]);
                assert.ok(text.includes("9223372036854775807")); assert.ok(text.includes(rawName)); assert.ok(text.includes("{{$iteration}}"));
            }
        }
    }

    for (const { id } of LANGUAGES) {
        const emptyRunner = harness(paths[1], {}, { requests: [], variables: {}, environmentName: rawName });
        assert.ok(emptyRunner.text(emptyRunner.render(id)).includes(translate(id, "Save a request in the HTTP client above, or import a Postman collection, to add the first step.")));
        for (const [stopped, label] of Object.entries({ finished: "Finished", failure: "Stopped on failure", cancelled: "Cancelled", budget: "Limit reached" })) {
            const completed = harness(paths[1], { run: { stopped, results: [], variables: {} } }, { requests: [request], variables: {}, environmentName: rawName });
            assert.ok(completed.text(completed.render(id)).includes(translate(id, "Run {state}", { state: translate(id, label) })));
        }
        for (const requestStream of [false, true]) for (const responseStream of [false, true]) {
            const entry = { ...method, requestStream, responseStream }, grpcBranch = harness(paths[2], { methods: [entry], method: entry.path });
            const content = grpcBranch.text(grpcBranch.render(id));
            assert.ok(content.includes(translate(id, requestStream ? "Send a JSON array of up to 100 messages. This client sends the array in order, then half-closes the stream." : "Send one JSON object.")));
            assert.ok(content.includes(translate(id, responseStream ? "Responses are collected until stream completion or deadline." : "Returns one response message.")));
            assert.ok(content.includes(translate(id, requestStream ? "Request messages (JSON array)" : "Request message (JSON object)")));
        }
        const noMocks = harness(paths[3], { loaded: true });
        const noMocksText = noMocks.text(noMocks.render(id));
        assert.ok(noMocksText.includes(translate(id, "No mocks are running for this project. Start one above.")));
        const busyGrpc = harness(paths[2], { busy: true });
        busyGrpc.render(id); assert.equal(busyGrpc.findButton("Working…").props.disabled, true); assert.equal(busyGrpc.findButton("Cancel RPC").props.disabled, false);
        const busyRunner = harness(paths[1], { busy: true }, { requests: [request], variables: {}, environmentName: rawName });
        busyRunner.render(id); assert.equal(busyRunner.findButton("Running…").props.disabled, true); assert.equal(busyRunner.findButton("Cancel run").props.disabled, false);
        const runner = harness(paths[1], { steps: [step], transport: "native" }, { requests: [request], variables: { token: "fixture-token", id: "9223372036854775807" }, environmentName: rawName });
        runner.render(id); await runner.click("Save plan");
        assert.deepEqual(JSON.parse(runner.saves[0].value), { steps: [step], iterations: 1, stopOnFailure: true });
        await runner.click("Run collection");
        assert.equal(runner.calls.length, 1, JSON.stringify(runner.values)); assert.equal(runner.calls[0].input.service, "request");
        assert.equal(runner.calls[0].input.url, "http://localhost:4312/9223372036854775807"); assert.equal(runner.calls[0].input.body, rawJson); assert.equal(runner.calls[0].input.headers.authorization, "Bearer fixture-token");
        assert.equal(runner.values.run.variables.capturedId, "9223372036854775807"); assert.equal(runner.values.results[0].response.body, rawJson);
        await runner.click("Export results"); assert.equal(runner.exports[0][1], "collection-results.json"); assert.equal(JSON.parse(runner.exports[0][0]).results[0].response.body, rawJson);

        const grpc = harness(paths[2], { messages: rawJson, metadata: '{"authorization":"Bearer fixture","trace-bin":"AAE="}' });
        grpc.render(id); const schema = JSON.stringify(grpc.values.files); await grpc.click("Load schema methods"); assert.equal(JSON.stringify(grpc.calls[0].input.files), schema); assert.equal(grpc.calls[0].input.operation, "describe");
        await grpc.click("Send RPC"); const sent = grpc.calls[1].input;
        assert.equal(sent.operation, "call"); assert.equal(sent.method, method.path); assert.equal(sent.messages, rawJson); assert.equal(sent.metadata.authorization, "Bearer fixture"); assert.equal(sent.metadata["trace-bin"], "AAE="); assert.equal(sent.connection.tls, true); assert.equal(sent.timeoutMs, 10000);
        await grpc.click("Export RPC result"); assert.equal(grpc.exports[0][1], "grpc-result.json"); assert.equal(JSON.parse(grpc.exports[0][0]).messages[0].id, "9223372036854775807");
        grpc.setFailure("Provider Ω: RPC failed."); await grpc.click("Send RPC"); const failure = grpc.values.error; grpc.render(id === "ar" ? "de" : "ar"); assert.equal(grpc.values.error, failure); assert.equal(grpc.values.error.detail, "Provider Ω: RPC failed.");

        const mocks = harness(paths[3]); mocks.render(id); const configuration = mocks.values.configuration;
        await mocks.click("Start local mock"); assert.equal(mocks.calls[0].input.operation, "start"); assert.equal(mocks.calls[0].input.project, "personal"); assert.deepEqual(JSON.parse(JSON.stringify(mocks.calls[0].input.configuration)), JSON.parse(configuration)); assert.equal(mocks.calls[1].input.operation, "list");
        await mocks.click("Copy base URL"); assert.equal(mocks.copies[0], mock.baseUrl);
        const beforeLanguage = mocks.calls.length; mocks.render(id === "ar" ? "en" : "ar"); assert.equal(mocks.calls.length, beforeLanguage, "Locale must not stop or refresh mocks");
        await mocks.click("Stop mock"); assert.equal(mocks.calls[2].input.operation, "stop"); assert.equal(mocks.calls[2].input.id, mock.id);
    }
    // Cancellation remains wired to the same in-flight abort controller after
    // switching language, and does not create another operation.
    for (const path of [paths[1], paths[2]]) {
        const fixture = harness(path, path === paths[1] ? { steps: [step], transport: "native" } : { methods: [method], method: method.path }, { requests: [request], variables: { token: "fixture", id: "1" }, environmentName: rawName });
        fixture.setPending((_input, signal) => new Promise((_resolve, reject) => signal?.addEventListener("abort", () => reject(new Error("provider abort detail")), { once: true })));
        fixture.render("en"); await fixture.click(path === paths[1] ? "Run collection" : "Send RPC"); fixture.render("ar"); assert.equal(fixture.values.busy, true);
        await fixture.click(path === paths[1] ? "Cancel run" : "Cancel RPC"); assert.equal(fixture.calls.length, 1); assert.equal(fixture.calls[0].signal?.aborted, true); assert.equal(fixture.values.busy, false);
        if (path === paths[2]) assert.equal(fixture.values.error.source, "RPC cancelled."); else assert.equal(fixture.values.run.stopped, "cancelled");
    }
    console.log("API extension localization: all 8 languages, authored copy/columns, retained drafts/results/credentials, stable options, raw precision, translated notices/errors, runner captures/auth/export, gRPC schema/call/export/cancellation and mock lifecycle/copy without server history passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

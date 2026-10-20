import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, translate, type Language } from "../src/lib/i18n/catalog";
import { SHARED_DIALOG_TRANSLATIONS } from "../src/lib/i18n/shared-dialogs";

const files = ["ShareButton", "ServerProxyNotice", "SslConfigSection", "NavigationLoader", "PwaRegister"];
const placeholders = (value: string) => [...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map((match) => match[1]).sort();
for (const [source, columns] of Object.entries(SHARED_DIALOG_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const [index, column] of columns.entries()) {
        assert.ok(column.trim(), `${source}: ${index}`);
        assert.deepEqual(placeholders(column), placeholders(source), `${source}: placeholder parity`);
        assert.equal(translate(LANGUAGES[index + 1].id, source), column, `${source}: catalog integration`);
    }
}
for (const name of files) {
    const path = `src/components/${name}.tsx`;
    const source = readFileSync(path, "utf8");
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.match(source, /useLanguage\(\)/);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/, "Locale must not remount stateful dialogs");
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(ast) === "t" && ts.isStringLiteral(node.arguments[0])) {
            const copy = node.arguments[0].text;
            for (const language of LANGUAGES.slice(1)) assert.notEqual(translate(language.id, copy), copy, `${name}: ${copy}: ${language.id}`);
        }
        if (ts.isCallExpression(node) && node.expression.getText(ast) === "useEffect") {
            const dependencies = node.arguments[1]?.getText(ast) ?? "";
            assert.doesNotMatch(dependencies, /\b(?:language|direction|t)\b/, `${name}: locale must not run operational effects`);
        }
        ts.forEachChild(node, visit);
    };
    visit(ast);
}
// Random loading messages are stored as source keys, so an active loader reacts
// to language changes without selecting a new message or restarting its timers.
const navigationSource = readFileSync("src/components/NavigationLoader.tsx", "utf8");
const loadingMessages = navigationSource.match(/const LOADING_MESSAGES = \[([\s\S]*?)\];/)?.[1] ?? "";
for (const [, source] of loadingMessages.matchAll(/"([^"]+)"/g)) {
    assert.ok(SHARED_DIALOG_TRANSLATIONS[source], source);
}

const nativeRequire = createRequire(import.meta.url);
const React = nativeRequire("react") as typeof import("react");
const jsx = nativeRequire("react/jsx-runtime");
type Node = { type: unknown; props: Record<string, unknown> };
type ActionLog = { build: unknown[]; copies: unknown[]; resets: number; posts: unknown[]; reloads: number; listeners: { name: string; listener: () => void; options: unknown }[]; changes: unknown[] };
function render(name: string, language: Language, options: { state?: unknown; props?: Record<string, unknown>; share?: Record<string, unknown>; store?: Record<string, unknown> } = {}) {
    const log: ActionLog = { build: [], copies: [], resets: 0, posts: [], reloads: 0, listeners: [], changes: [] };
    const effects: { callback: () => void; dependencies: unknown }[] = [];
    const component = (name: string) => function FixtureComponent(props: Record<string, unknown>) { return React.createElement(name, props); };
    const Input = Object.assign(component("Input"), { TextArea: component("TextArea") });
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (initial: unknown) => [Object.hasOwn(options, "state") ? options.state : initial, (value: unknown) => log.changes.push(value)], useEffect: (callback: () => void, dependencies: unknown) => effects.push({ callback, dependencies }), useRef: (current: unknown) => ({ current }), useCallback: (callback: unknown) => callback };
        if (name === "react/jsx-runtime") return jsx;
        if (name === "antd") return new Proxy({ Input, Typography: { Text: component("Text"), Paragraph: component("Paragraph") } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name === "@ant-design/icons") return new Proxy({}, { get: (_, key) => component(String(key)) });
        if (name === "framer-motion") return { AnimatePresence: component("AnimatePresence"), motion: new Proxy({}, { get: (_, key) => component(`motion.${String(key)}`) }) };
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => translate(language, source, values) }) };
        if (name === "next/navigation") return { usePathname: () => "/formatters/json-formatter" };
        if (name.endsWith("/store")) return { useAppStore: () => ({ darkMode: false, isNavigating: true, setNavigating: () => {}, navTargetId: null, ...options.store }) };
        if (name.endsWith("tools-registry")) return { toolsRegistry: [{ id: "json-formatter", name: "JSON Formatter", color: "#0891b2" }] };
        if (name.endsWith("shareable-state")) return { useBuildShareUrl: () => ({ url: null, error: null, building: false, build: (state: unknown) => log.build.push(state), reset: () => log.resets++, ...options.share }) };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (...values: unknown[]) => { log.copies.push(values); return true; } };
        if (name.endsWith("pwa-install-prompt")) return {};
        throw new Error(`Unexpected dependency ${name}`);
    };
    const compiled = { exports: {} as { default: (props: unknown) => unknown; buildSslProxyFields?: (config: unknown) => unknown } };
    const code = ts.transpileModule(readFileSync(`src/components/${name}.tsx`, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const worker = { postMessage: (value: unknown) => log.posts.push(value) };
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, setTimeout, clearTimeout, Date, navigator: { serviceWorker: { addEventListener: (name: string, listener: () => void, options: unknown) => log.listeners.push({ name, listener, options }) } }, location: { reload: () => log.reloads++ }, process: { env: { NODE_ENV: "production" } } });
    const root = compiled.exports.default({ value: ssl, onChange: (value: unknown) => log.changes.push(value), ...options.props });
    const nodes: Node[] = [], visible: string[] = [];
    const walk = (value: unknown) => {
        if (value === null || value === undefined || typeof value === "boolean") return;
        if (typeof value === "string" || typeof value === "number") { visible.push(String(value)); return; }
        if (Array.isArray(value)) { value.forEach(walk); return; }
        const node = value as Node;
        if (typeof node.type === "function") { walk((node.type as (props: unknown) => unknown)(node.props)); return; }
        if (!node.props) return;
        nodes.push(node);
        for (const key of ["children", "title", "description", "closeIcon"]) walk(node.props[key]);
    };
    walk(root);
    return { nodes, text: visible.join(" "), log, effects, worker, exports: compiled.exports };
}
const rawUrl = "https://example.test/crypto/jwt-decoder#s=AA_00-日本語";
const rawInput = { input: "العربية 日本語 🔐", token: "eyJ.private.payload" };
const ssl = { sslVerify: true, sslCaCert: "-----BEGIN CERTIFICATE-----\n日本語\n-----END CERTIFICATE-----", sslClientCert: "client-cert", sslClientKey: "private-key-عربي" };
const find = (page: ReturnType<typeof render>, type: string, label?: string) => {
    const node = page.nodes.find((node) => node.type === type && (!label || node.props.children === label || node.props["aria-label"] === label));
    assert.ok(node, `Missing ${type}: ${label}`);
    return node;
};
async function main() {
for (const language of LANGUAGES) {
    const t = (source: string) => translate(language.id, source);
    const shareProps = { schema: { toolId: "fixture", version: 1 }, getState: () => rawInput, sensitiveFieldHint: "JWT tokens often carry sensitive claims (user IDs, scopes). Only share with people you trust." };
    const share = render("ShareButton", language.id, { state: true, props: shareProps, share: { url: rawUrl } });
    assert.equal((find(share, "Modal").props.closable as Record<string, string>)["aria-label"], t("Close share dialog"));
    assert.equal(find(share, "TextArea").props.value, rawUrl);
    assert.equal(find(share, "TextArea").props.dir, "ltr");
    assert.ok(share.text.includes(t("Before you share")));
    assert.ok(share.text.includes(t(String(shareProps.sensitiveFieldHint))));
    assert.equal(share.log.build.length + share.log.copies.length, 0, "Rendering/localizing must not share or copy");
    await (find(share, "Button", t("Copy link")).props.onClick as () => Promise<void>)();
    assert.deepEqual(share.log.copies, [[rawUrl, t("Share link copied")]]);
    (find(share, "Button", t("Share")).props.onClick as () => void)();
    assert.deepEqual(share.log.build, [rawInput], "Only an explicit Share action reads and builds input");
    (find(share, "Modal").props.onCancel as () => void)();
    assert.equal(share.log.resets, 2);
    const building = render("ShareButton", language.id, { props: shareProps, share: { building: true } });
    assert.ok(building.text.includes(t("Building link…")));
    for (const error of ["State is too large to fit in a URL — consider trimming the input.", "RAW_PLATFORM_DIAGNOSTIC_日本語"]) {
        const failure = render("ShareButton", language.id, { props: shareProps, share: { error } });
        assert.ok(failure.text.includes(t(error)));
        assert.ok(failure.text.includes(t("Trim the input and open Share again to retry.")));
        assert.equal(failure.log.build.length, 0);
    }
    const tls = render("SslConfigSection", language.id);
    const fields = tls.nodes.filter((node) => node.type === "TextArea");
    assert.deepEqual(fields.map((node) => node.props.value), [ssl.sslCaCert, ssl.sslClientCert, ssl.sslClientKey]);
    assert.ok(fields.every((node) => node.props.dir === "ltr" && node.props["aria-label"]));
    assert.equal(tls.log.changes.length, 0, "Locale does not mutate TLS settings");
    (find(tls, "Switch").props.onChange as (value: boolean) => void)(false);
    assert.deepEqual(JSON.parse(JSON.stringify(tls.log.changes)), [{ ...ssl, sslVerify: false }]);
    assert.deepEqual(JSON.parse(JSON.stringify(tls.exports.buildSslProxyFields?.(ssl))), ssl, "TLS payload stays exact");
    assert.deepEqual(JSON.parse(JSON.stringify(tls.exports.buildSslProxyFields?.({ ...ssl, sslCaCert: " ", sslClientCert: "", sslClientKey: "" }))), { sslVerify: true });
    for (const route of ["proxy", "proxy-stream", "fetch-cert", "webhook"]) {
        const extra = React.createElement("span", null, "Share", " provider-日本語");
        const notice = render("ServerProxyNotice", language.id, { props: { route, purpose: "Hostname", sentFields: ["Port number (default 443)", "raw-header-عربي"], extra } });
        assert.ok(notice.text.includes(t("This action sends data to the server")));
        assert.ok(notice.text.includes("raw-header-عربي"));
        assert.ok(notice.text.includes("Share  provider-日本語"), "Arbitrary extra ReactNodes are caller-owned and preserved");
        const source = find(notice, "a");
        assert.equal(source.props.href, `https://github.com/rameshbgm/mydevtools/blob/main/src/app/api/${route === "webhook" ? "webhook/[sessionId]" : route}/route.ts`);
        assert.equal(find(notice, "bdi").props.dir, "ltr");
    }
    const loading = render("NavigationLoader", language.id, { state: "Warming up the dev tools…", store: { navTargetId: "json-formatter" } });
    assert.ok(loading.text.includes(t("Warming up the dev tools…")));
    assert.ok(loading.text.includes(t("JSON Formatter")));
    assert.equal(find(loading, "motion.div").props["aria-label"], t("Loading tool"));
    const pwa = render("PwaRegister", language.id, { state: { postMessage: () => {} } });
    assert.ok(pwa.text.includes(t("An app update is ready.")));
    assert.equal(pwa.log.posts.length + pwa.log.reloads + pwa.log.listeners.length, 0, "Locale/render never activates or reloads an update");
    (find(pwa, "button", t("Later")).props.onClick as () => void)();
    assert.deepEqual(pwa.log.changes, [null]);
    assert.equal(pwa.log.listeners.length, 0, "Later never activates an update");
    const explicit = render("PwaRegister", language.id);
    assert.equal(explicit.nodes.length, 0, "No waiting worker means no update notice");
    const update = render("PwaRegister", language.id, { state: { postMessage: (value: unknown) => explicit.log.posts.push(value) } });
    (find(update, "button", t("Reload to update")).props.onClick as () => void)();
    assert.deepEqual(JSON.parse(JSON.stringify(explicit.log.posts)), [{ type: "ACTIVATE_UPDATE" }]);
    assert.equal(update.log.reloads, 0, "The explicit choice waits for the controller change");
    assert.equal(update.log.listeners[0].name, "controllerchange");
    assert.deepEqual(JSON.parse(JSON.stringify(update.log.listeners[0].options)), { once: true });
    update.log.listeners[0].listener();
    assert.equal(update.log.reloads, 1);
}
console.log("Shared dialogs: eight languages, placeholder parity, share consent/actions, raw links/PEM/diagnostics, TLS payloads, route disclosures and explicit PWA update choice pass.");

}
void main().catch((error) => { console.error(error); process.exitCode = 1; });

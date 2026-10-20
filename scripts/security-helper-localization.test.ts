import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { spawnSync } from "node:child_process";
import ts from "typescript";
import { SECURITY_HELPER_TRANSLATIONS } from "../src/lib/i18n/security-helpers";
import type { Language } from "../src/lib/i18n/catalog";

const nodeRequire = createRequire(`${process.cwd()}/package.json`);
const { LANGUAGES, SHARED_TRANSLATIONS, translate } = nodeRequire("./src/lib/i18n/catalog");
const forge = nodeRequire("node-forge");
const { inspectPasskeyCredential } = nodeRequire("./src/lib/webauthn-tools");
const { analyseSecurityHeaders, parseResponseHeaders } = nodeRequire("./src/lib/security-headers");
const { analyseComposeDocument } = nodeRequire("./src/lib/docker-compose");
const { parseStructuredData } = nodeRequire("./src/lib/structured-data");
const { redactDocument } = nodeRequire("./src/lib/redaction");
const { verifyWebhookSignature } = nodeRequire("./src/lib/webhook-signatures");
const ids = ["jks-tool", "webauthn-passkey-playground", "har-log-redactor", "webhook-signature-debugger", "security-headers-analyzer", "docker-compose-analyzer"];
const sourceRoot = process.env.SECURITY_HELPER_SOURCE_ROOT ?? process.cwd();
const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
const t = (language: Language, source: string, values?: Record<string, string | number>) => {
    const column = LANGUAGES.findIndex((item: { id: string }) => item.id === language) - 1;
    let value = column >= 0 && SECURITY_HELPER_TRANSLATIONS[source] ? SECURITY_HELPER_TRANSLATIONS[source][column] : translate(language, source);
    for (const [key, replacement] of Object.entries(values ?? {})) value = value.replaceAll(`{${key}}`, String(replacement));
    return value;
};
for (const [source, columns] of Object.entries(SECURITY_HELPER_TRANSLATIONS)) {
    assert.equal(columns.length, 7);
    if (!process.env.SECURITY_HELPER_SOURCE_ROOT) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog integration: ${source}`);
    columns.forEach((text, index) => {
        assert.ok(text.trim()); assert.notEqual(text, source); assert.deepEqual(placeholders(text), placeholders(source));
        if (!process.env.SECURITY_HELPER_SOURCE_ROOT) assert.equal(translate(LANGUAGES[index + 1].id, source), text);
        for (const token of ["clientDataJSON", "authenticatorData", "Content-Security-Policy-Report-Only", "strict-origin-when-cross-origin", "object-src", "frame-ancestors", "1 MiB", "5 MiB", "PKCS#12", "-storetype JKS"])
            if (source.includes(token)) assert.ok(text.includes(token), `Preserve protocol token ${token}: ${source}`);
    });
}
for (const id of ids) {
    const path = `${sourceRoot}/src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const copy = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) assert.ok(Object.hasOwn(SECURITY_HELPER_TRANSLATIONS, node.text) || Object.hasOwn(SHARED_TRANSLATIONS, node.text), `${id}: ${node.text}`);
        if (ts.isConditionalExpression(node)) { copy(node.whenTrue); copy(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.ok([":", "compose.yaml", "GitHub · X-Hub-Signature-256", "Stripe · Stripe-Signature", "Slack · X-Slack-Signature", "X-Slack-Request-Timestamp"].includes(node.text.trim()), `${id} untranslated JSX: ${node.text}`);
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0]) copy(node.arguments[0]);
        if (ts.isPropertyAssignment(node) && ["whatIs", "whyUse", "howToUse", "tips", "useCases", "title", "note"].includes(node.name.getText(file))) {
            (ts.isArrayLiteralExpression(node.initializer) ? node.initializer.elements : [node.initializer]).forEach(copy);
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
    assert.match(source, /useLanguage\(\)/);
    assert.doesNotMatch(source, /key=\{(?:language|locale|direction|t\()/);
    assert.doesNotMatch(source, /\[[^\]]*(?:language|direction|\bt\b)[^\]]*\]\);/);
    assert.doesNotMatch(source, /localStorage|sessionStorage|\bfetch\(/);
}

// Actual page callbacks run with persistent hooks and real helpers. The file
// picker, clipboard and download activation are boundary doubles, not browser
// transfer evidence. Real node-forge PKCS#12 and WebCrypto HMAC are exercised.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Element = { type: unknown; props: Record<string, any> };
function elements(node: unknown): Element[] {
    if (Array.isArray(node)) return node.flatMap(elements);
    if (!node || typeof node !== "object" || !("props" in node)) return [];
    const item = node as Element;
    return [item, ...Object.values(item.props).flatMap(elements)];
}
function visible(node: unknown): string {
    if (node == null || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(visible).join(" ");
    const item = node as Element;
    return item.props ? [item.props.children, item.props.title, item.props.description, item.props.label].map(visible).join(" ") : "";
}
function harness(id: string, entry = "default") {
    const hooks: unknown[] = []; let cursor = 0, dirty = false, language: Language = "en";
    const pendingEffects: (() => void)[] = [], notices: string[] = [], copied: string[] = [];
    const downloads: { bytes: Uint8Array; name: string; mime: string }[] = [], blobs: Blob[] = [];
    const activity = { inspect: 0, headers: 0, parseHeaders: 0, compose: 0, redact: 0, verify: 0, forge: 0 };
    const same = (a: unknown[], b: unknown[]) => a.length === b.length && a.every((value, i) => Object.is(value, b[i]));
    const react = {
        useState: (initial: unknown) => {
            const index = cursor++; if (!(index in hooks)) hooks[index] = typeof initial === "function" ? (initial as () => unknown)() : initial;
            return [hooks[index], (next: unknown) => { const value = typeof next === "function" ? (next as (value: unknown) => unknown)(hooks[index]) : next; if (!Object.is(value, hooks[index])) { hooks[index] = value; dirty = true; } }];
        },
        useMemo: (compute: () => unknown, deps: unknown[]) => {
            const index = cursor++, previous = hooks[index] as { value: unknown; deps: unknown[] } | undefined;
            if (!previous || !same(previous.deps, deps)) hooks[index] = { value: compute(), deps: [...deps] };
            return (hooks[index] as { value: unknown }).value;
        },
        useEffect: (effect: () => void, deps: unknown[]) => { const index = cursor++, previous = hooks[index] as unknown[] | undefined; if (!previous || !same(previous, deps)) { hooks[index] = [...deps]; pendingEffects.push(effect); } },
    };
    const message = new Proxy({}, { get: () => (text: string) => notices.push(text) });
    const input = Object.assign(() => null, { TextArea: "textarea", Password: "password" });
    const dependencies = (name: string): unknown => {
        if (name === "react") return react;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => t(language, source, values) }) };
        if (name === "antd") return { App: { useApp: () => ({ message }) }, Input: input, Card: "card", Button: "button", Space: "space", Alert: "alert", Tabs: "tabs", Typography: { Text: "text", Paragraph: "paragraph" }, Tag: "tag", Descriptions: Object.assign(() => null, { Item: "description" }), Row: "row", Col: "col" };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => () => null });
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copied.push(value); return true; } };
        if (name.endsWith("download")) return { downloadBytes: (bytes: Uint8Array, name: string, mime: string) => downloads.push({ bytes, name, mime }) };
        if (name.endsWith("webauthn-tools")) return { inspectPasskeyCredential: (value: unknown) => { activity.inspect++; return inspectPasskeyCredential(value); } };
        if (name.endsWith("security-headers")) return { analyseSecurityHeaders: (value: string) => { activity.headers++; return analyseSecurityHeaders(value); }, parseResponseHeaders: (value: string) => { activity.parseHeaders++; return parseResponseHeaders(value); } };
        if (name.endsWith("docker-compose")) return { analyseComposeDocument: (value: unknown) => { activity.compose++; return analyseComposeDocument(value); } };
        if (name.endsWith("structured-data")) return { parseStructuredData };
        if (name.endsWith("redaction")) return { redactDocument: (source: string, fields: string[]) => { activity.redact++; return redactDocument(source, fields); } };
        if (name.endsWith("webhook-signatures")) return { verifyWebhookSignature: async (value: unknown) => { activity.verify++; return verifyWebhookSignature(value); } };
        if (name === "node-forge") return { __esModule: true, default: { ...forge, pkcs12: { ...forge.pkcs12, toPkcs12Asn1: (...args: unknown[]) => { activity.forge++; return forge.pkcs12.toPkcs12Asn1(...args); } } } };
        if (name.startsWith("@/components/")) return { __esModule: true, default: name.split("/").at(-1) };
        return nodeRequire(name);
    };
    const record = { exports: {} as Record<string, () => Element> };
    const source = readFileSync(`${sourceRoot}/src/app/tools/${id}/page.tsx`, "utf8") + (id === "jks-tool" ? "\nexport { ConvertTab, CommandsTab };" : "");
    const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: record, exports: record.exports, require: dependencies, Error, Blob, Uint8Array, TextDecoder, TextEncoder, console, JSON, window: { PublicKeyCredential: class {} }, URL: { createObjectURL: (blob: Blob) => { blobs.push(blob); return "blob:public-fixture"; }, revokeObjectURL: () => {} }, document: { createElement: () => ({ click: () => {} }) } });
    return {
        render: (effects = true) => { let tree: Element; let attempts = 0; do { dirty = false; cursor = 0; tree = record.exports[entry](); if (effects) while (pendingEffects.length) pendingEffects.shift()!(); assert.ok(++attempts < 8); } while (dirty); return tree!; },
        locale: (next: Language) => { language = next; }, notices, copied, downloads, blobs, activity,
    };
}
const byType = (tree: Element, type: unknown) => elements(tree).filter((node) => node.type === type);
const button = (tree: Element, label: string) => byType(tree, "button").find((node) => visible(node.props.children) === label)!;
const change = async (node: Element, value: string) => node.props.onChange({ target: { value } });
const locales = LANGUAGES.map((item: { id: Language }) => item.id) as Language[];

async function main() {
// WebAuthn: deterministic hydration, actual supplementary Unicode clientData,
// retained draft and result without another inspection on locale changes.
{
    const h = harness("webauthn-passkey-playground");
    const initial = h.render(false);
    assert.ok(visible(initial).includes(t("en", "WebAuthn unavailable in this browser")));
    const payload = { id: "public-العربية-日本語-🌍", response: { clientDataJSON: Buffer.from(JSON.stringify({ type: "webauthn.create", challenge: "Å-🌍", origin: "https://example.com" })).toString("base64url"), authenticatorData: Buffer.from([0, 1, 255]).toString("base64url") } };
    const raw = JSON.stringify(payload);
    await change(byType(h.render(), "textarea")[0], raw);
    button(h.render(), "Inspect credential").props.onClick();
    const snapshot = JSON.stringify(h.activity);
    for (const language of locales) {
        h.locale(language); const tree = h.render();
        assert.equal(byType(tree, "textarea")[0].props.value, raw);
        assert.ok(visible(tree).includes(payload.id)); assert.ok(visible(tree).includes('"challenge":"Å-🌍"'));
        assert.ok(visible(tree).includes(t(language, "Credential metadata decoded")));
        assert.equal(JSON.stringify(h.activity), snapshot);
    }
    await change(byType(h.render(), "textarea")[0], "{}");
    button(h.render(), t("ar", "Inspect credential")).props.onClick();
    assert.ok(visible(h.render()).includes(t("ar", "Credential id is missing.")));
    assert.ok(visible(h.render()).includes(t("ar", "clientDataJSON is missing.")));
}
// Security headers and Compose: helpers run for edits, never for locale changes;
// generated human findings translate while headers and service names stay exact.
{
    const h = harness("security-headers-analyzer");
    const raw = "Content-Security-Policy: script-src 'unsafe-inline' 'unsafe-eval'\nX-Public-Fixture: 日本語 العربية 🌍";
    await change(byType(h.render(), "textarea")[0], raw); h.render(); const activity = JSON.stringify(h.activity);
    for (const language of locales) { h.locale(language); const tree = h.render(); assert.equal(byType(tree, "textarea")[0].props.value, raw); assert.ok(visible(tree).includes(t(language, "CSP permits inline code"))); assert.ok(visible(tree).includes(t(language, "HIGH"))); assert.equal(JSON.stringify(h.activity), activity); }
}
{
    const h = harness("docker-compose-analyzer");
    const raw = 'services:\n  "日本語 العربية 🌍":\n    image: alpine:3\n    privileged: true\n    network_mode: host\n    ports: ["0.0.0.0:8080:80"]\n';
    await change(byType(h.render(), "textarea")[0], raw); h.render(); const activity = JSON.stringify(h.activity);
    for (const language of locales) { h.locale(language); const tree = h.render(); assert.equal(byType(tree, "textarea")[0].props.value, raw); assert.ok(visible(tree).includes("日本語 العربية 🌍")); assert.ok(visible(tree).includes(t(language, "Privileged containers have broad host access."))); assert.ok(visible(tree).includes("0.0.0.0:8080:80")); assert.equal(JSON.stringify(h.activity), activity); }
    await change(byType(h.render(), "textarea")[0], "{}"); assert.ok(visible(h.render()).includes(t("ar", "No services were declared under `services`.")));
}
// HAR preview and browser-file boundary: exact redaction output is stable and
// locale changes do not recompute or trigger downloads. File delivery unclaimed.
{
    const h = harness("har-log-redactor"), raw = '{"request":{"headers":[{"name":"Authorization","value":"Bearer fixture"}]},"email":"公開-العربية-🌍","keep":"日本語"}';
    await change(byType(h.render(), "textarea")[0], raw); button(h.render(), "Preview redaction").props.onClick();
    const expected = redactDocument(raw, ["email"]), activity = h.activity.redact;
    for (const language of locales) { h.locale(language); const tree = h.render(); assert.equal(byType(tree, "textarea")[0].props.value, raw); assert.equal(byType(tree, "textarea")[1].props.value, expected); assert.equal(h.activity.redact, activity); assert.equal(h.blobs.length, 0); }
    button(h.render(), t("ar", "Download redacted data")).props.onClick(); assert.equal(await h.blobs[0].text(), expected);
    const fileInput = byType(h.render(), "input").find((node) => node.props.type === "file")!;
    await fileInput.props.onChange({ target: { files: [{ size: 6 * 1024 * 1024 }] } });
    for (const language of locales) { h.locale(language); assert.ok(visible(h.render()).includes(t(language, "Choose a file smaller than 5 MiB."))); }
}
// Webhook: real GitHub HMAC verification, byte-preserving body edit invalidates,
// locale changes preserve the result JSON and do not sign/reverify. File UTF-8
// boundary doubles prove rejection behavior, not browser upload capability.
{
    const h = harness("webhook-signature-debugger");
    const body = '{"text":"日本語 العربية 🌍","amount":0.9999999999999999999}\n', secret = "public-fixture-Å-🌍";
    const crypto = nodeRequire("node:crypto");
    const signature = `sha256=${crypto.createHmac("sha256", secret).update(body, "utf8").digest("hex")}`;
    const tree = h.render(); const inputs = byType(tree, "input").filter((node) => node.props.type !== "file");
    await change(inputs[0], secret); await change(inputs[1], signature); await change(byType(h.render(), "textarea")[0], body);
    const promise = button(h.render(), "Verify signature").props.onClick();
    assert.equal(button(h.render(), "Verifying…").props.disabled, true); await promise;
    const result = byType(h.render(), "pre")[0].props.children; assert.equal(JSON.parse(result).verified, true); const activity = h.activity.verify;
    for (const language of locales) { h.locale(language); const view = h.render(); assert.equal(byType(view, "textarea")[0].props.value, body); assert.equal(byType(view, "pre")[0].props.children, result); assert.equal(h.activity.verify, activity); assert.ok(visible(view).includes(t(language, "Signature matches. This diagnostic does not replace server-side verification and replay protection."))); }
    await change(byType(h.render(), "textarea")[0], body + " "); assert.equal(byType(h.render(), "pre").length, 0);
    await button(h.render(), t("ar", "Verify signature")).props.onClick(); assert.equal(JSON.parse(byType(h.render(), "pre")[0].props.children).verified, false);
    const fileInput = byType(h.render(), "input").find((node) => node.props.type === "file")!;
    const previous = byType(h.render(), "textarea")[0].props.value;
    await fileInput.props.onChange({ target: { files: [{ size: 1, arrayBuffer: async () => Uint8Array.of(0xff).buffer }] } });
    for (const language of locales) { h.locale(language); assert.ok(visible(h.render()).includes(t(language, "The file is not valid UTF-8. Body bytes were not changed or verified."))); assert.equal(byType(h.render(), "textarea")[0].props.value, previous); }
}
// Real PKCS#12 handler and independent Python shlex argv oracle. Public fixtures
// only: parsing shell text never executes keytool, commands, aliases or secrets.
{
    const h = harness("jks-tool", "ConvertTab");
    button(h.render(), "Download mykey.p12").props.onClick(); assert.ok(h.notices.includes("Provide both certificate and private key (PEM)"));
    const keys = forge.pki.rsa.generateKeyPair(1024), cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey; cert.serialNumber = "01"; cert.validity.notBefore = new Date("2026-01-01T00:00:00Z"); cert.validity.notAfter = new Date("2027-01-01T00:00:00Z"); cert.setSubject([{ name: "commonName", value: "public-fixture.example" }]); cert.setIssuer(cert.subject.attributes); cert.sign(keys.privateKey, forge.md.sha256.create());
    const certPem = forge.pki.certificateToPem(cert), keyPem = forge.pki.privateKeyToPem(keys.privateKey);
    let tree = h.render(); await change(byType(tree, "textarea")[0], certPem); await change(byType(tree, "textarea")[1], keyPem);
    const alias = "-public alias'$(printf injected)`uname`\\\n日本語 العربية 🌍", password = "public-only'$(fixture)";
    tree = h.render(); await change(elements(tree).find((node) => node.props.value === "mykey")!, alias); await change(byType(h.render(), "password")[0], password);
    button(h.render(), `Download ${alias}.p12`).props.onClick(); assert.equal(h.downloads.length, 1); assert.equal(h.downloads[0].name, `${alias}.p12`);
    const der = forge.util.createBuffer(String.fromCharCode(...h.downloads[0].bytes)), p12 = forge.pkcs12.pkcs12FromAsn1(forge.asn1.fromDer(der), false, password);
    const bags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag]; assert.equal(bags.length, 1); assert.equal(bags[0].key.n.toString(16), keys.privateKey.n.toString(16)); assert.equal(bags[0].attributes.friendlyName[0], alias);
    const commands = byType(h.render(), "pre").map((node) => String(node.props.children)); assert.equal(commands.length, 1); assert.ok(!commands[0].includes(password));
    const parse = (command: string): string[] => { const result = spawnSync("python3", ["-c", "import sys,shlex,json; print(json.dumps(shlex.split(sys.stdin.read(), comments=True)))"], { input: command, encoding: "utf8" }); assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout); };
    let argv = parse(commands[0]); assert.equal(argv[argv.indexOf("-alias") + 1], alias); assert.equal(argv[argv.indexOf("-srckeystore") + 1], `${alias}.p12`); assert.equal(argv[argv.indexOf("-destkeystore") + 1], `${alias}.jks`); assert.ok(!argv.includes("-srcstorepass")); assert.ok(!argv.includes("-deststorepass"));
    const activity = h.activity.forge;
    for (const language of locales) { h.locale(language); const view = h.render(); assert.equal(byType(view, "pre")[0].props.children, commands[0]); assert.equal(h.activity.forge, activity); assert.equal(h.downloads.length, 1); }
    const c = harness("jks-tool", "CommandsTab"); tree = c.render(); await change(elements(tree).find((node) => node.props.value === "server.jks")!, "public' file\n$(fixture).jks"); await change(elements(c.render()).find((node) => node.props.value === "server")!, alias);
    const tableCommands = byType(c.render(), "pre").map((node) => String(node.props.children)); assert.equal(tableCommands.length, 8);
    for (const command of tableCommands) { argv = parse(command); assert.equal(argv[0], "keytool"); assert.ok(!command.includes("<password>")); if (argv.includes("-alias")) assert.equal(argv[argv.indexOf("-alias") + 1], alias); if (argv.includes("-keystore")) assert.equal(argv[argv.indexOf("-keystore") + 1], "public' file\n$(fixture).jks"); if (argv.includes("-file")) assert.equal(argv[argv.indexOf("-file") + 1], `${alias}.crt`); if (argv.includes("-dname")) assert.equal(argv[argv.indexOf("-dname") + 1], `CN=${alias}, O=mydevtools, C=US`); }
    for (const language of locales) { c.locale(language); assert.deepEqual(byType(c.render(), "pre").map((node) => String(node.props.children)), tableCommands); }
}
console.log(`Security helper localization: six pages, ${Object.keys(SECURITY_HELPER_TRANSLATIONS).length} authored rows; eight-language real callback/crypto/redaction/metadata fixtures passed. Browser file delivery unclaimed.`);

}
void main().catch((error) => { console.error(error); process.exitCode = 1; });

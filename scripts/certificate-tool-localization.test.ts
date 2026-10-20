/* eslint-disable @typescript-eslint/no-explicit-any -- VM fixtures model heterogeneous Ant component records and crypto overloads. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { generateKeyPairSync, webcrypto, createPublicKey, createPrivateKey, createHash, X509Certificate } from "node:crypto";
import ts from "typescript";
import forge from "node-forge";
import * as certificate from "../src/lib/cert-utils";
import * as ssh from "../src/lib/ssh-key-generation";
import * as x509 from "../src/lib/x509-generation";
import { CERTIFICATE_TOOL_TRANSLATIONS } from "../src/lib/i18n/certificate-tools";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { SEO_CONTENT } from "../src/lib/seo-content";

const ids = ["certificate-inspector", "certificate-chain-validator", "certificate-generator", "pkcs12-tool", "key-pair-generator", "ssh-key-generator"] as const;
const tokens = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
// The local table is used in the handler harness before root catalog integration; this
// still requires each authored row to preserve interpolation contracts in every locale.
for (const [source, columns] of Object.entries(CERTIFICATE_TOOL_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const value of columns) { assert.ok(value.trim(), source); assert.deepEqual(tokens(value), tokens(source), source); }
}
function localized(language: Language, source: string, values?: Record<string, string | number>) {
    const index = LANGUAGES.findIndex((item) => item.id === language) - 1;
    const template = index < 0 ? source : CERTIFICATE_TOOL_TRANSLATIONS[source]?.[index];
    return template ? template.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (match, name) => values && name in values ? String(values[name]) : match) : translate(language, source, values);
}
for (const id of ids) {
    const source = readFileSync(`src/app/tools/${id}/page.tsx`, "utf8");
    const file = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && ["t", "certificateText"].includes(node.expression.getText(file)) && ts.isStringLiteral(node.arguments[0])) assert.ok(Object.hasOwn(CERTIFICATE_TOOL_TRANSLATIONS, node.arguments[0].text) || Object.hasOwn(SHARED_TRANSLATIONS, node.arguments[0].text), `${id}: missing ${node.arguments[0].text}`);
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            if (["Input", "Input.Password", "InputNumber", "Select", "TextArea"].includes(node.tagName.getText(file))) assert.ok(node.attributes.properties.some((property) => property.name?.getText(file) === "aria-label"), `${id}: accessible ${node.tagName.getText(file)}`);
        }
        ts.forEachChild(node, visit);
    }; visit(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction|t\()/, "Locale must not remount forms");
    assert.doesNotMatch(source, /\bt\((?:input|password|passphrase|certPem|keyPem|error|err|pem|privateKey|certificate|csr)\)/, "User material and raw diagnostic values stay exact");
    for (const faq of SEO_CONTENT[id]?.faq ?? []) for (const text of [faq.q, faq.a]) assert.ok(Object.hasOwn(CERTIFICATE_TOOL_TRANSLATIONS, text) || Object.hasOwn(SHARED_TRANSLATIONS, text), `${id}: authored FAQ ${text}`);
}

type Props = Record<string, any>; // VM component records intentionally model multiple Ant signatures.
type Node = { type: unknown; props: Props };
function harness(id: typeof ids[number], target: string, initial: Props = {}, props: Props = {}) {
    const source = readFileSync(`src/app/tools/${id}/page.tsx`, "utf8"), file = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    let declaration: ts.FunctionDeclaration | undefined;
    file.forEachChild((node) => { if (ts.isFunctionDeclaration(node) && node.name?.text === target) declaration = node; });
    assert.ok(declaration, target);
    const names: string[] = [];
    const visit = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file)); ts.forEachChild(node, visit); }; visit(declaration);
    const require = createRequire(import.meta.url), React = require("react"), runtime = require("react/jsx-runtime");
    let language: Language = "en", cursor = 0, mounted = false, effects: (() => unknown)[] = [];
    const cells: unknown[] = [], copied: string[] = [], downloads: { value: string | Uint8Array; filename: string; mime: string }[] = [], notices: unknown[] = [], modals: Props[] = [];
    const engine = { generate: 0, parse: 0, fingerprint: 0, validate: 0, convert: 0, pkcsRead: 0, pkcsCreate: 0, network: 0, ssh: 0, x509: 0, csr: 0, writes: 0 };
    let rejectCrypto = false, clipboardSuccess = true;
    const successNotices: { source: "helper" | "component"; label: unknown }[] = [];
    const copyFailures: string[] = [];
    const messages = new Proxy({}, { get: (_target, type) => (value: unknown) => { notices.push(value); if (type === "success") successNotices.push({ source: "component", label: value }); } });
    const component = (name: string) => Object.assign((value: Props) => React.createElement(name, value), { displayName: name });
    const input = Object.assign(component("Input"), { Password: component("Input.Password"), TextArea: component("TextArea") });
    const ui = new Proxy({ Input: input, App: { useApp: () => ({ message: messages }) } }, { get: (object, key) => key in object ? object[key as keyof typeof object] : key === "message" ? messages : key === "Typography" ? new Proxy({}, { get: (_object, name) => component(String(name)) }) : key === "Descriptions" ? Object.assign(component("Descriptions"), { Item: component("Descriptions.Item") }) : component(String(key)) });
    const calls = (name: keyof typeof engine, fn: (...args: any[]) => any) => (...args: any[]) => { engine[name]++; return fn(...args); };
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (fallback: unknown) => { const index = cursor++; if (!(index in cells)) cells[index] = Object.hasOwn(initial, names[index]) ? initial[names[index]] : typeof fallback === "function" ? (fallback as () => unknown)() : fallback; return [cells[index], (value: unknown) => { engine.writes++; cells[index] = typeof value === "function" ? (value as (old: unknown) => unknown)(cells[index]) : value; }]; }, useCallback: (callback: unknown) => callback, useMemo: (callback: () => unknown) => callback(), useRef: () => ({ current: null }), useEffect: (effect: () => unknown) => { if (!mounted) effects.push(effect); } };
        if (name === "react/jsx-runtime") return runtime;
        if (name === "antd") return ui;
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => component("Icon") });
        if (name === "node-forge") return forge;
        if (name === "next/navigation") return { useSearchParams: () => new URLSearchParams(), useRouter: () => ({ replace() {} }) };
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (key: string, values?: Record<string, string | number>) => localized(language, key, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: component("Layout") };
        if (name.endsWith("ToolBridgeBanner")) return { __esModule: true, default: component("ToolBridgeBanner") };
        if (name.endsWith("cert-utils")) return { ...certificate, parseCertificate: calls("parse", certificate.parseCertificate), fingerprint: calls("fingerprint", certificate.fingerprint), validateChain: calls("validate", certificate.validateChain), convertCertificate: calls("convert", certificate.convertCertificate), readPkcs12: calls("pkcsRead", certificate.readPkcs12), createPkcs12: calls("pkcsCreate", certificate.createPkcs12) };
        if (name.endsWith("ssh-key-generation")) return { ...ssh, generateSSHKeyPair: calls("ssh", ssh.generateSSHKeyPair) };
        if (name.endsWith("x509-generation")) return { ...x509, generateSelfSignedCertificate: calls("x509", x509.generateSelfSignedCertificate), generateCertificateRequest: calls("csr", x509.generateCertificateRequest) };
        if (name.endsWith("certificate-fetch-response")) return { parseCertificateFetchResponse: async (response: Response) => response.json() };
        if (name.endsWith("certificate-tools")) return { CERTIFICATE_TOOL_TRANSLATIONS };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string, label?: string) => {
            copied.push(value);
            if (clipboardSuccess) { const notice = label ?? localized(language, "Copied!"); notices.push(notice); successNotices.push({ source: "helper", label: notice }); }
            else { const notice = localized(language, "Copy failed — please copy manually"); notices.push(notice); copyFailures.push(notice); }
            return clipboardSuccess;
        } };
        if (name.endsWith("download")) return { downloadText: (value: string, filename: string, mime: string) => downloads.push({ value, filename, mime }), downloadBytes: (value: Uint8Array, filename: string, mime: string) => downloads.push({ value, filename, mime }) };
        if (name.endsWith("errorModal")) return { showErrorModal: (value: Props) => modals.push(value) };
        if (name.endsWith("store")) return { useAppStore: () => ({ darkMode: false }) };
        throw new Error(`Unexpected dependency ${name}`);
    };
    const fixtureModule = { exports: {} as { test: (props: Props) => unknown } };
    const compiled = ts.transpileModule(source + `\nmodule.exports.test = ${target};`, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const cryptoMock = { ...webcrypto, getRandomValues: webcrypto.getRandomValues.bind(webcrypto), subtle: new Proxy(webcrypto.subtle, { get: (object, property) => property === "generateKey" ? (...args: Parameters<SubtleCrypto["generateKey"]>) => { engine.generate++; if (rejectCrypto) return Promise.reject(new Error("RAW platform unsupported 日本語 العربية")); return (object.generateKey as (...values: unknown[]) => unknown).apply(object, args); } : typeof object[property as keyof SubtleCrypto] === "function" ? (object[property as keyof SubtleCrypto] as (...values: unknown[]) => unknown).bind(object) : object[property as keyof SubtleCrypto] }) };
    runInNewContext(compiled, { module: fixtureModule, exports: fixtureModule.exports, require: dependencies, console: { error() {} }, crypto: cryptoMock, Error, Date, TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, btoa, atob, URLSearchParams, Intl, FileReader: class {
        onload?: (event: { target: { result: string | ArrayBuffer } }) => void;
        readAsArrayBuffer() { const bytes = initial.__fileBytes as Uint8Array; this.onload?.({ target: { result: bytes.slice().buffer as ArrayBuffer } }); }
        readAsText() { this.onload?.({ target: { result: initial.__fileText as string } }); }
    }, setTimeout: (callback: () => unknown) => { callback(); return 0; }, fetch: () => { engine.network++; if (initial.__fetchPems) return Promise.resolve(new Response(JSON.stringify({ pems: initial.__fetchPems }), { headers: { "content-type": "application/json" } })); throw new Error("Unexpected network request"); } });
    const collect = (tree: unknown) => {
        const nodes: Node[] = [], text: string[] = [];
        const walk = (node: unknown): void => {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { text.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            const item = node as Node;
            if (typeof item.type === "function") { const fn = item.type as (props: Props) => unknown; if (/^(?:ReadPkcs12|CreatePkcs12|CSRTab|SelfSignedTab|DecodeTab|FingerprintTab|ConvertTab|PemParserTab|LiveCheckTab|ChainValidatorTab)$/.test(fn.name) && fn.name !== target) return; walk(fn(item.props)); return; }
            if (item.props) {
                nodes.push(item);
                for (const key of ["title", "description", "extra", "label"]) walk(item.props[key]);
                for (const option of item.props.items ?? []) { walk(option.label); walk(option.title); walk(option.description); walk(option.children); }
                for (const value of Object.values(item.props.learnMore ?? {})) { if (typeof value === "string") walk(value); else if (Array.isArray(value)) value.forEach(walk); }
                walk(item.props.children);
            }
        }; walk(tree); return { nodes, text: text.join(" ") };
    };
    const render = (locale: Language) => { language = locale; cursor = 0; const result = collect(fixtureModule.exports.test(props)); if (!mounted) { mounted = true; const pending = effects; effects = []; pending.forEach((effect) => effect()); } return { ...result, button: (key: string, index = 0) => { const matches = result.nodes.filter((node) => node.type === "Button" && collect(node.props.children).text === localized(locale, key)); assert.ok(matches[index], `${target}/${locale}: ${key}`); return matches[index].props.onClick; } }; };
    return { render, engine, copied, downloads, notices, modals, successNotices, copyFailures, setCopyResult: (success: boolean) => { clipboardSuccess = success; }, rejectCrypto: () => { rejectCrypto = true; }, state: () => Object.fromEntries(names.map((name, index) => [name, cells[index]])), set: (name: string, value: unknown) => { const index = names.indexOf(name); assert.notEqual(index, -1, name); cells[index] = value; } };
}
function invariant(work: ReturnType<typeof harness>) {
    const state = work.state(), calls = { ...work.engine };
    const machine = (locale: Language) => work.render(locale).nodes.filter((node) => node.type === "pre").map((node) => node.props.children);
    const commands = machine("en");
    for (const language of LANGUAGES) { work.render(language.id); assert.deepEqual(work.state(), state, "Locale changed certificate material, draft, result or settings"); assert.deepEqual(work.engine, calls, "Locale re-generated keys, parsed certificates, validated, fetched or wrote state"); assert.deepEqual(machine(language.id), commands, "Locale changed machine commands"); }
}
async function assertCopy(work: ReturnType<typeof harness>, locale: Language, action: () => unknown, expected: string, label: string) {
    for (const success of [false, true]) {
        work.setCopyResult(success);
        const noticeStart = work.successNotices.length, failedStart = work.copyFailures.length, copiedStart = work.copied.length, engine = { ...work.engine };
        await action();
        assert.equal(work.copied.length, copiedStart + 1, "One exact payload reaches the clipboard helper");
        assert.equal(work.copied.at(-1), expected, "Copy preserves the raw certificate/key/fingerprint/conversion text");
        assert.deepEqual(work.engine, engine, "Copy must not parse, generate, fetch or change certificate state");
        const successEvents = work.successNotices.slice(noticeStart);
        assert.deepEqual(successEvents, success ? [{ source: "helper", label: localized(locale, label) }] : [], "Only the clipboard helper may announce a successful copy");
        assert.equal(work.copyFailures.length - failedStart, success ? 0 : 1);
        if (!success) assert.equal(work.copyFailures.at(-1), localized(locale, "Copy failed — please copy manually"));
    }
}
async function main() {
    const generated = generateKeyPairSync("rsa", { modulusLength: 2048, privateKeyEncoding: { type: "pkcs1", format: "pem" }, publicKeyEncoding: { type: "spki", format: "pem" } });
    const key = forge.pki.privateKeyFromPem(generated.privateKey), pub = forge.pki.publicKeyFromPem(generated.publicKey);
    const cert = forge.pki.createCertificate(); cert.publicKey = pub; cert.serialNumber = "012345"; cert.validity.notBefore = new Date(Date.now() - 86_400_000); cert.validity.notAfter = new Date(Date.now() + 90 * 86_400_000); cert.setSubject([{ name: "commonName", value: "public-fixture.example" }]); cert.setIssuer(cert.subject.attributes); cert.setExtensions([{ name: "basicConstraints", cA: true }]); cert.sign(key, forge.md.sha256.create());
    const pem = forge.pki.certificateToPem(cert), password = "public fixture 日本語 العربية 🔑";
    const parsedFixture = await certificate.parseCertificate(pem);
    const independentFingerprints = Object.fromEntries(["sha256", "sha1", "md5"].map((algorithm) => [algorithm, createHash(algorithm).update(parsedFixture.derBytes).digest("hex").toUpperCase().match(/../g)!.join(":")])) as Record<"sha256" | "sha1" | "md5", string>;
    for (const language of LANGUAGES) {
        for (const filename of ["public.crt", "public.cer", "public.der"]) {
            for (const material of [new TextEncoder().encode(pem), certificate.convertCertificate(pem, "der-bytes") as Uint8Array]) {
                const upload = harness("certificate-inspector", "CertificateInspectorPageContent", { __fileBytes: material });
                const node = upload.render(language.id).nodes.find((item) => item.type === "Upload"); assert.ok(node);
                assert.equal(node.props.beforeUpload({ name: filename }), false);
                const uploaded = upload.state().input as string;
                assert.equal((await certificate.parseCertificate(uploaded)).fingerprintSha256, (await certificate.fingerprint(pem)).sha256);
                if (material[0] === 45) assert.equal(uploaded, pem, "PEM bytes stay exact even in .crt/.cer/.der");
                invariant(upload);
            }
        }
        const decode = harness("certificate-inspector", "DecodeTab", {}, { input: pem }); await decode.render(language.id).button("Decode")(); const decoded = decode.state().info as certificate.ParsedCertificate; assert.equal(decoded.subject.CN, "public-fixture.example"); assert.equal(decoded.pem, pem.trim()); assert.equal(decode.notices.at(-1), localized(language.id, "Certificate decoded")); invariant(decode);
        const exactInfo = { ...parsedFixture, pem: pem + "\n\n", publicKeyPem: generated.publicKey + " \n" };
        const certView = harness("certificate-inspector", "CertView", {}, { info: exactInfo });
        const certButtons = certView.render(language.id);
        await assertCopy(certView, language.id, certButtons.button("Copy public key PEM"), exactInfo.publicKeyPem, "Public key copied");
        await assertCopy(certView, language.id, certButtons.button("Copy PEM"), exactInfo.pem, "PEM copied");
        const rawFingerprints = certButtons.nodes.filter((node) => node.type === "Text" && node.props.copyable).map((node) => node.props.copyable.text);
        for (const digest of Object.values(independentFingerprints)) assert.ok(rawFingerprints.includes(digest), "Native copyable fingerprint payload stays exact");
        invariant(certView);
        const parser = harness("certificate-inspector", "PemParserTab", {}, { input: pem + "\n" + generated.privateKey }); await parser.render(language.id).button("Parse PEM Blocks")(); assert.equal((parser.state().blocks as unknown[]).length, 2); invariant(parser); assert.ok(parser.render(language.id).text.includes(localized(language.id, "Subject: {subject}", { subject: "public-fixture.example" })));
        const fp = harness("certificate-inspector", "FingerprintTab", {}, { input: pem }); await fp.render(language.id).button("Compute Fingerprints")(); assert.equal((fp.state().fps as any).sha256, (await certificate.fingerprint(pem)).sha256); invariant(fp);
        const fpView = fp.render(language.id), fingerprintCopies = fpView.nodes.filter((node) => node.type === "Button" && node.props["aria-label"] === localized(language.id, "Copy"));
        assert.equal(fingerprintCopies.length, 3);
        for (const [index, algorithm] of (["sha256", "sha1", "md5"] as const).entries()) {
            const label = algorithm === "sha256" ? "SHA-256 copied" : algorithm === "sha1" ? "SHA-1 copied" : "MD5 copied";
            await assertCopy(fp, language.id, fingerprintCopies[index].props.onClick, independentFingerprints[algorithm], label);
            await assertCopy(fp, language.id, fpView.button("plain", index), independentFingerprints[algorithm].replace(/:/g, "").toLowerCase(), "Plain hex copied");
        }
        for (const format of ["pem", "der-base64"]) {
            const textConversion = harness("certificate-inspector", "ConvertTab", { target: format }, { input: pem });
            await textConversion.render(language.id).button("Convert")();
            const exactOutput = certificate.convertCertificate(pem, format as "pem" | "der-base64") as string;
            assert.equal(textConversion.state().output, exactOutput);
            await assertCopy(textConversion, language.id, textConversion.render(language.id).button("Copy"), exactOutput, "Output copied");
            invariant(textConversion);
        }
        const convert = harness("certificate-inspector", "ConvertTab", { target: "der-bytes" }, { input: pem }); await convert.render(language.id).button("Convert")(); const view = convert.render(language.id); const binary = convert.state().downloadBytesOut as Uint8Array; assert.deepEqual(Array.from(binary), Array.from(certificate.convertCertificate(pem, "der-bytes") as Uint8Array)); view.button("Download")(); assert.deepEqual(convert.downloads.at(-1)?.value, binary); convert.set("target", "pem"); convert.render(language.id).button("Download")(); assert.ok(convert.downloads.at(-1)?.filename.endsWith(".der")); invariant(convert);
        const chain = harness("certificate-chain-validator", "ChainValidatorTab", { input: pem }); await chain.render(language.id).button("Validate Chain")(); assert.equal((chain.state().result as certificate.ChainValidationResult).valid, true); invariant(chain);
        const live = harness("certificate-chain-validator", "LiveCheckTab", { urlInput: "https://public-fixture.example", __fetchPems: [pem] });
        await live.render(language.id).button("Inspect")(); assert.equal(live.engine.network, 1); assert.equal((live.state().certs as unknown[]).length, 1); assert.equal((live.state().chainResult as certificate.ChainValidationResult).valid, true); invariant(live);
        const liveView = live.render(language.id), liveFingerprintCopies = liveView.nodes.filter((node) => node.type === "Button" && node.props["aria-label"] === localized(language.id, "Copy"));
        assert.equal(liveFingerprintCopies.length, 3);
        for (const [index, algorithm] of (["sha256", "sha1", "md5"] as const).entries()) {
            const label = algorithm === "sha256" ? "SHA-256 copied" : algorithm === "sha1" ? "SHA-1 copied" : "MD5 copied";
            await assertCopy(live, language.id, liveFingerprintCopies[index].props.onClick, independentFingerprints[algorithm], label);
        }
        await assertCopy(live, language.id, liveView.button("Copy"), pem, "PEM copied");
        // Empty successful responses are app-authored recovery, not a raw provider error.
        for (const [id, target, initial, action] of [
            ["certificate-inspector", "CertificateInspectorPageContent", { urlInput: "public-fixture.example", input: pem, __fetchPems: [] }, "Fetch"],
            ["certificate-chain-validator", "LiveCheckTab", { urlInput: "public-fixture.example", __fetchPems: [] }, "Inspect"],
            ["certificate-chain-validator", "ChainValidatorTab", { fetchHost: "public-fixture.example", input: pem, __fetchPems: [] }, "Fetch"],
        ] as const) {
            const empty = harness(id, target, initial);
            await empty.render(language.id).button(action)();
            assert.equal(empty.notices.at(-1), localized(language.id, "The server returned no certificates. Check the hostname and try again."));
            assert.equal(empty.engine.parse, 0); assert.equal(empty.engine.fingerprint, 0);
            if ("input" in initial) assert.equal(empty.state().input, pem);
            invariant(empty);
        }
        const bundle = certificate.createPkcs12({ certificatePem: pem, privateKeyPem: generated.privateKey, password, friendlyName: "Fixture 日本語 العربية" });
        const read = harness("pkcs12-tool", "ReadPkcs12", { bytes: bundle, password }); await read.render(language.id).button("Unlock & Inspect")(); assert.equal((read.state().bundle as certificate.Pkcs12Bundle).friendlyName, "Fixture 日本語 العربية"); assert.ok((read.state().bundle as certificate.Pkcs12Bundle).privateKeyPem?.includes("PRIVATE KEY")); invariant(read);
        read.set("password", "wrong"); await read.render(language.id).button("Unlock & Inspect")(); assert.equal((read.state().error as any).kind, "password"); invariant(read); assert.ok(read.render(language.id).text.includes(localized(language.id, "Wrong password")));
        const create = harness("pkcs12-tool", "CreatePkcs12", { certPem: pem, keyPem: generated.privateKey, password, name: "Fixture 日本語 العربية" }); create.render(language.id).button("Create & Download .p12")(); const file = create.downloads.at(-1)!; assert.equal(file.filename, "Fixture 日本語 العربية.p12"); const roundTrip = await certificate.readPkcs12(file.value as Uint8Array, password); assert.equal(roundTrip.friendlyName, "Fixture 日本語 العربية"); invariant(create);
    }
    // The actual repaired page controls select genuine algorithms and preserve their
    // completed output while translated labels and country names change.
    for (const language of LANGUAGES) {
        const self = harness("certificate-generator", "SelfSignedTab");
        let selfView = self.render(language.id);
        const algorithm = selfView.nodes.find((node) => node.type === "Select" && node.props["aria-label"] === localized(language.id, "Algorithm"));
        assert.ok(algorithm); algorithm.props.onChange("ECDSA");
        const options = self.state().options as any;
        assert.equal(options.keyUsage.keyEncipherment, false); assert.equal(options.keyUsage.dataEncipherment, false);
        selfView = self.render(language.id);
        const encipherment = selfView.nodes.find((node) => node.type === "Checkbox" && node.props.children === localized(language.id, "Key Encipherment"));
        assert.ok(encipherment); assert.equal(encipherment.props.disabled, true);
        await selfView.button("Generate Certificate")();
        const parsed = new X509Certificate(self.state().certificate as string);
        assert.equal(parsed.publicKey.asymmetricKeyType, "ec"); assert.equal(parsed.verify(parsed.publicKey), true);
        const independentKey = createPrivateKey(self.state().privateKey as string); assert.equal(independentKey.asymmetricKeyType, "ec"); invariant(self);
        const csr = harness("certificate-generator", "CSRTab", { commonName: "fixture.example", organization: "Fixture 日本語 العربية", keyAlgorithm: "Ed25519", sanInput: "fixture.example, 127.0.0.1" });
        await csr.render(language.id).button("Generate CSR & Private Key")();
        assert.match(csr.state().csr as string, /-----BEGIN CERTIFICATE REQUEST-----/);
        assert.equal(createPrivateKey(csr.state().privateKey as string).asymmetricKeyType, "ed25519"); invariant(csr);
        csr.render(language.id).button("Copy")(); assert.equal(csr.copied.at(-1), csr.state().csr);
        const sshWork = harness("ssh-key-generator", "SSHKeyGeneratorPage", { keyType: "Ed25519", comment: "Fixture 日本語 العربية 🌍" });
        await sshWork.render(language.id).button("Generate SSH Key Pair")();
        const pair = sshWork.state().keyPair as ssh.GeneratedSSHKeyPair; assert.ok(pair); assert.equal(pair.keyType, "Ed25519");
        assert.match(pair.publicKey, /^ssh-ed25519 [A-Za-z0-9+/=]+ Fixture 日本語 العربية 🌍$/);
        assert.equal(Buffer.from(pair.privateKey.replace(/-----[^-]+-----|\s/g, ""), "base64").subarray(0, 15).toString("binary"), "openssh-key-v1\0");
        invariant(sshWork); sshWork.render(language.id).button("Copy")(); assert.equal(sshWork.copied.at(-1), pair.publicKey);
        const malformed = harness("ssh-key-generator", "SSHKeyGeneratorPage", { keyType: "Ed25519", comment: "two\nlines" });
        await malformed.render(language.id).button("Generate SSH Key Pair")();
        assert.equal(malformed.modals.at(-1)?.context, localized(language.id, "The SSH comment must be a single line without control characters."));
        assert.equal(malformed.modals.at(-1)?.error.message, "The SSH comment must be a single line without control characters."); invariant(malformed);
    }
    // Exercise actual generic-key handlers with native Node Web Crypto, then import
    // the outputs independently and verify signatures (including Ed25519, no fallback).
    for (const [algorithm, format] of [["Ed25519", "PEM"], ["Ed25519", "JWK"], ["RSA", "PEM"], ["ECDSA", "JWK"]]) {
        const work = harness("key-pair-generator", "KeyPairGeneratorPage", { algorithm, outputFormat: format }); await work.render("ja").button("Generate Key Pair")(); const pair = work.state().keyPair as { publicKey: string; privateKey: string; algorithm: string; format: string }; assert.ok(pair, JSON.stringify(work.modals));
        const privateKey = createPrivateKey(format === "JWK" ? { key: JSON.parse(pair.privateKey), format: "jwk" } : pair.privateKey), publicKey = createPublicKey(format === "JWK" ? { key: JSON.parse(pair.publicKey), format: "jwk" } : pair.publicKey);
        assert.equal(privateKey.asymmetricKeyType, algorithm === "Ed25519" ? "ed25519" : algorithm === "RSA" ? "rsa" : "ec"); assert.equal(publicKey.asymmetricKeyType, privateKey.asymmetricKeyType);
        const native = await import("node:crypto"); const data = Buffer.from("Fixture 日本語 العربية 🌍"); const digest = algorithm === "Ed25519" ? null : "sha256"; const signature = native.sign(digest, data, privateKey); assert.equal(native.verify(digest, data, publicKey, signature), true); assert.equal(native.verify(digest, Buffer.from("tampered"), publicKey, signature), false);
        invariant(work); work.set("outputFormat", format === "JWK" ? "PEM" : "JWK"); work.render("ar").button("Download")(); assert.equal(work.downloads.at(-1)?.value, pair.publicKey); assert.ok(work.downloads.at(-1)?.filename.endsWith(format === "JWK" ? ".jwk" : ".pem"));
    }
    for (const language of LANGUAGES) {
        const unsupported = harness("key-pair-generator", "KeyPairGeneratorPage", { algorithm: "Ed25519" }); unsupported.rejectCrypto(); await unsupported.render(language.id).button("Generate Key Pair")(); assert.equal(unsupported.state().keyPair, null); assert.equal(unsupported.engine.generate, 1); assert.equal(unsupported.modals.at(-1)?.title, localized(language.id, "Key pair generation failed")); assert.equal(unsupported.modals.at(-1)?.error.message, "RAW platform unsupported 日本語 العربية"); invariant(unsupported);
    }
    console.log("✓ Certificate/key localization: seven translation columns, authored coverage, native Ed25519/RSA/ECDSA import/sign/verify, exact copy payloads with zero failed-copy success notices and one helper success notice, PEM parse/fingerprints/DER, chain checks, PKCS#12 read/write/password errors and eight-language state/engine preservation. Download checks cover handler bytes, not browser delivery.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

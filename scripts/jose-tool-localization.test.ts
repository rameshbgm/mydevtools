import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { webcrypto, createHmac } from "node:crypto";
import ts from "typescript";
import { JOSE_TOOL_TRANSLATIONS, localizeJoseError } from "../src/lib/i18n/jose-tools";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import * as jweCrypto from "../src/lib/jwe-crypto";
import { SEO_CONTENT } from "../src/lib/seo-content";

const ids = ["jwt-decoder", "jws-tool", "jwe-tool", "jwk-generator"] as const;
const placeholders = (text: string) => (text.match(/(?<!\\)\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(JOSE_TOOL_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const [index, language] of LANGUAGES.slice(1).entries()) {
        assert.ok(columns[index].trim(), source);
        assert.deepEqual(placeholders(columns[index]), placeholders(source), source);
        assert.equal(translate(language.id, source), columns[index], `${source}: catalog registration`);
    }
}
for (const id of ids) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const covered = (text: string) => assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, text), `${id}: untranslated copy ${text}`);
    const inspect = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && ts.isStringLiteral(node.arguments[0])) covered(node.arguments[0].text);
        if (ts.isJsxText(node) && node.text.trim() && ![".", "(", ")", "BASE64URL"].includes(node.text.trim())) assert.fail(`${id}: untranslated JSX ${node.text}`);
        if (ts.isJsxAttribute(node) && ["title", "description", "aria-label"].includes(node.name.getText(file))) assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `${id}: untranslated attribute`);
        if (ts.isJsxAttribute(node) && node.name.getText(file) === "learnMore") {
            const help = (child: ts.Node) => { if (ts.isStringLiteral(child)) covered(child.text); ts.forEachChild(child, help); }; help(node);
        }
        ts.forEachChild(node, inspect);
    }; inspect(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction|t\()/, "Locale cannot remount editors");
    assert.doesNotMatch(source, /\bt\((?:token|payload|plaintext|publicJwk|privateJwk|jwkSet|error|editError|e\.message)\)/, "Machine data and raw diagnostics cannot be translated");
    for (const faq of SEO_CONTENT[id]?.faq ?? []) for (const text of [faq.q, faq.a]) covered(text);
}

const require = createRequire(import.meta.url);
const React = require("react") as typeof import("react");
const jsxRuntime = require("react/jsx-runtime");
type Props = { [key: string]: any; children?: any; value?: any; onClick?: () => any; onChange?: (value: any) => void };
type Node = { type: any; props: Props };
function harness(id: typeof ids[number], initial: Record<string, unknown> = {}) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    let language: Language = "en", cursor = 0, memoIndex = 0, effectIndex = 0, dirty = false;
    const cells: unknown[] = [], names: string[] = [], memoCells: { value: unknown; deps: unknown[] }[] = [], effectCells: unknown[][] = [];
    const writes: string[] = [], copied: string[] = [], notices: string[] = [], downloads: { data: string; filename: string; mime: string }[] = [], modals: Props[] = [];
    const cryptoCalls: { method: string; args: unknown[] }[] = [];
    let restore: ((state: Record<string, unknown>) => void) | undefined, pending: (() => void)[] = [];
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const scan = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file)); ts.forEachChild(node, scan); }; scan(file);
    const same = (a: unknown[] | undefined, b: unknown[]) => !!a && a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
    const component = (name: string) => (props: Props) => React.createElement(name, props, props.children);
    const messages = { success: (value: string) => notices.push(value), error: (value: string) => notices.push(value), warning: (value: string) => notices.push(value) };
    const ui = new Proxy({ App: { useApp: () => ({ message: messages }) }, message: messages, Input: Object.assign(component("Input"), { TextArea: component("TextArea"), Password: component("Password") }), Typography: { Text: component("Text"), Title: component("Title") }, Radio: { Group: component("RadioGroup"), Button: component("RadioButton") } }, { get: (target, name: string) => name in target ? target[name as keyof typeof target] : component(name) });
    const memo = (compute: () => unknown, deps: unknown[]) => { const index = memoIndex++; if (!same(memoCells[index]?.deps, deps)) memoCells[index] = { value: compute(), deps }; return memoCells[index].value; };
    // Translation function identity changes with locale as it does in the real provider.
    const translations = Object.fromEntries(LANGUAGES.map(({ id }) => [id, (source: string, values?: Record<string, string | number>) => translate(id, source, values)]));
    const libraries = new Map<string, unknown>();
    const dependencies = (name: string): unknown => {
        if (name.endsWith("jws-crypto") || name.endsWith("jwk-tools")) {
            const library = name.endsWith("jws-crypto") ? "jws-crypto" : "jwk-tools";
            if (!libraries.has(library)) {
                const output = { exports: {} };
                const compiledLibrary = ts.transpileModule(readFileSync(`src/lib/${library}.ts`, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
                runInNewContext(compiledLibrary, { module: output, exports: output.exports, require: dependencies, Error, JSON, String, TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, btoa, atob, crypto });
                libraries.set(library, output.exports);
            }
            return libraries.get(library);
        }
        if (name === "react") return { ...React, useState: (fallback: unknown) => { const index = cursor++; if (!(index in cells)) cells[index] = Object.hasOwn(initial, names[index]) ? initial[names[index]] : fallback; return [cells[index], (value: unknown) => { const next = typeof value === "function" ? (value as (old: unknown) => unknown)(cells[index]) : value; if (!Object.is(next, cells[index])) dirty = true; cells[index] = next; writes.push(names[index]); }]; }, useMemo: memo, useCallback: (callback: unknown, deps: unknown[]) => memo(() => callback, deps), useEffect: (callback: () => void, deps: unknown[]) => { const index = effectIndex++; if (!same(effectCells[index], deps)) { effectCells[index] = deps; pending.push(callback); } } };
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name === "antd") return ui;
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => component("Icon") });
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: translations[language] }) };
        if (name.endsWith("jose-tools")) return { localizeJoseError };
        if (name.endsWith("jwe-crypto")) return jweCrypto;
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Props) => React.createElement("Layout", props, ...[props.title, props.description, ...Object.values(props.learnMore ?? {}).flat().map((text) => translate(language, String(text))), props.children]) };
        if (name.endsWith("store")) return { useAppStore: () => ({ darkMode: false }) };
        if (name.endsWith("CodeEditor")) return { CodeEditor: component("CodeEditor") };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string, notice?: string) => { copied.push(value); if (notice) notices.push(notice); return true; } };
        if (name.endsWith("download")) return { downloadText: (data: string, filename: string, mime: string) => downloads.push({ data, filename, mime }) };
        if (name.endsWith("errorModal")) return { showErrorModal: (props: Props) => modals.push(props) };
        if (name.endsWith("SendToButton") || name.endsWith("ShareButton") || name.endsWith("ToolBridgeBanner")) return { __esModule: true, default: component(name.split("/").at(-1)!) };
        if (name.endsWith("shareable-state")) return { useShareableState: (_schema: unknown, accept: typeof restore) => { restore = accept; } };
        throw new Error(`Unexpected dependency ${name}`);
    };
    const subtle = new Proxy(webcrypto.subtle, { get: (target, method: string) => (...args: unknown[]) => { cryptoCalls.push({ method, args }); return (target[method as keyof SubtleCrypto] as Function).apply(target, args); } });
    const crypto = { subtle, getRandomValues: (array: Uint8Array<ArrayBuffer>) => { cryptoCalls.push({ method: "getRandomValues", args: [array.length] }); return webcrypto.getRandomValues(array); } };
    const compiled = { exports: {} as { default: () => unknown } };
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, Error, JSON, String, TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, btoa, atob, crypto, console: { error: () => {} } });
    const render = (locale: Language) => {
        language = locale; let tree: unknown;
        for (let attempt = 0; attempt < 5; attempt++) { dirty = false; cursor = 0; memoIndex = 0; effectIndex = 0; pending = []; tree = compiled.exports.default(); pending.forEach((effect) => effect()); if (!dirty) break; assert.ok(attempt < 4, "Render did not settle"); }
        const nodes: Node[] = [], text: string[] = [];
        const walk = (node: any) => {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { text.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            if (typeof node.type === "function") { walk(node.type(node.props)); return; }
            if (node.props) { nodes.push(node); for (const name of ["title", "description", "extra"]) walk(node.props[name]); for (const option of node.props.options ?? []) walk(option.label); for (const item of node.props.items ?? []) { walk(item.label); walk(item.children); } walk(node.props.children); }
        }; walk(tree);
        const find = (type: string, predicate: (props: Props) => boolean = () => true) => { const node = nodes.find((node) => node.type === type && predicate(node.props)); assert.ok(node, `${id}/${locale}: missing ${type}`); return node; };
        return { nodes, text: text.join(" "), find, input: (source: string) => { const label = translate(language, source); const node = nodes.find(({ type, props }) => ["Input", "TextArea", "Password", "CodeEditor"].includes(type) && (props["aria-label"] === label || props.ariaLabel === label)); assert.ok(node, `Missing input ${source}`); return node; }, button: (source: string) => find("Button", (props) => props.children === translate(language, source)).props.onClick! };
    };
    return { render, writes, copied, notices, cryptoCalls, downloads, modals, state: () => Object.fromEntries(names.map((name, index) => [name, cells[index]])), restore: (state: Record<string, unknown>) => { assert.ok(restore); restore(state); } };
}
function preserveAcrossLocales(work: ReturnType<typeof harness>) {
    const baseline = JSON.stringify(work.state()), calls = work.cryptoCalls.length, copied = work.copied.length, notices = work.notices.length, downloads = work.downloads.length, modals = work.modals.length;
    work.writes.length = 0;
    for (const { id } of LANGUAGES) {
        const view = work.render(id);
        assert.equal(JSON.stringify(work.state()), baseline, "Locale altered draft, secrets, keys, token, selected algorithm, result or error");
        assert.equal(work.cryptoCalls.length, calls, "Locale invoked Web Crypto or generated random bytes");
        assert.equal(work.copied.length, copied, "Locale copied user data"); assert.equal(work.notices.length, notices, "Locale replayed a notice"); assert.equal(work.downloads.length, downloads); assert.equal(work.modals.length, modals);
        for (const { type, props } of view.nodes) if (["Input", "TextArea", "Password"].includes(type)) { assert.equal(props.dir, "ltr"); assert.equal(props.styles[type === "TextArea" ? "textarea" : "input"].direction, "ltr"); assert.ok(props["aria-label"]); }
        for (const { props } of view.nodes.filter(({ type }) => type === "Select")) { assert.equal(props.dir, undefined, "AntD Select has no dir prop"); assert.ok(props["aria-label"]); }
    }
    assert.deepEqual(work.writes, [], "Locale called state setters");
}

// Public JWT.io fixture (HS256 / your-256-bit-secret). Data is deliberately public test material.
const fixtureHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
const fixturePayload = "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";
const signingSecret = "0123456789abcdef0123456789abcdef";
const publicJwt = `${fixtureHeader}.${fixturePayload}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
const validJws = `${fixtureHeader}.${fixturePayload}.${createHmac("sha256", signingSecret).update(`${fixtureHeader}.${fixturePayload}`).digest("base64url")}`;
async function main() {
    for (const { id: locale } of LANGUAGES) {
        const jwt = harness("jwt-decoder", { token: publicJwt }); let view = jwt.render(locale);
        assert.ok(view.text.includes("1234567890")); preserveAcrossLocales(jwt);
        view = jwt.render(locale); view.input("Header").props.onChange!(JSON.stringify({ alg: "HS256", typ: "JWT" })); view.input("Payload").props.onChange!(JSON.stringify({ sub: "public-fixture", name: "你好 مرحبا 🌍", exp: 2000000000 }));
        view = jwt.render(locale); await view.button("Re-encode Token")(); view = jwt.render(locale);
        const modified = String(jwt.state().modifiedToken); assert.equal(modified.split(".")[2], publicJwt.split(".")[2], "Editor must preserve signature placeholder"); assert.equal(JSON.parse(Buffer.from(modified.split(".")[1], "base64url").toString()).name, "你好 مرحبا 🌍"); preserveAcrossLocales(jwt);
        view = jwt.render(locale); await view.button("Copy Token")(); assert.equal(jwt.copied.at(-1), publicJwt);
        const share = view.find("ShareButton").props.getState; assert.deepEqual(JSON.parse(JSON.stringify(share())), { token: publicJwt });
        assert.equal(view.find("SendToButton").props.data, JSON.stringify(JSON.parse(Buffer.from(fixturePayload, "base64url").toString()), null, 2));
        jwt.restore({ token: "broken" }); view = jwt.render(locale); assert.ok(view.text.includes(translate(locale, "JWT must have exactly 3 parts separated by '.'"))); preserveAcrossLocales(jwt);
        view.find("ToolBridgeBanner").props.onAccept({ data: publicJwt }); view = jwt.render(locale); assert.equal(jwt.state().token, publicJwt);
        view.input("Payload").props.onChange!("{"); view = jwt.render(locale); await view.button("Re-encode Token")(); view = jwt.render(locale); assert.ok(view.text.includes(translate(locale, "Check the header and payload JSON, then try again."))); preserveAcrossLocales(jwt);

        const jws = harness("jws-tool", { payload: JSON.stringify({ sub: "public-fixture", name: "你好 مرحبا 🌍", exp: 2000000000 }), secret: signingSecret, jwsToVerify: validJws, verifySecret: signingSecret }); view = jws.render(locale);
        await view.button("Sign JWS")(); view = jws.render(locale); const signed = String(jws.state().signedJws); assert.equal(signed.split(".")[2], createHmac("sha256", signingSecret).update(signed.split(".").slice(0, 2).join(".")).digest("base64url"));
        await view.button("Verify Signature")(); view = jws.render(locale); assert.equal((jws.state().verifyResult as Props).valid, true); assert.equal(JSON.parse((jws.state().verifyResult as Props).payload).sub, "1234567890"); preserveAcrossLocales(jws);
        view = jws.render(locale); await view.button("Copy")(); assert.equal(jws.copied.at(-1), signed);
        view.find("Select", props => props["aria-label"] === translate(locale, "Expected algorithm")).props.onChange!("HS384"); assert.equal(jws.state().verifyResult, null);
        view = jws.render(locale); await view.button("Verify Signature")(); assert.equal((jws.state().verifyResult as Props).valid, false);
        view.find("Select", props => props["aria-label"] === translate(locale, "Expected algorithm")).props.onChange!("HS256"); view = jws.render(locale);

        view.input("JWS Token").props.onChange!({ target: { value: validJws.slice(0, -1) + (validJws.endsWith("A") ? "B" : "A") } }); view = jws.render(locale); await view.button("Verify Signature")(); view = jws.render(locale); assert.equal((jws.state().verifyResult as Props).valid, false); assert.ok(view.text.includes(translate(locale, "Signature verification failed"))); preserveAcrossLocales(jws);
        view = jws.render(locale); view.input("JWS Token").props.onChange!({ target: { value: "bad" } }); view = jws.render(locale); await view.button("Verify Signature")(); view = jws.render(locale); assert.ok(view.text.includes(translate(locale, "Invalid JWS format - must have 3 parts")));
        view.input("Payload (JSON)").props.onChange!({ target: { value: "{" } }); view = jws.render(locale); await view.button("Sign JWS")(); assert.ok(jws.notices.at(-1)!.startsWith(translate(locale, "Signing failed. Check the JSON, algorithm and key, then try again.") + "\n")); preserveAcrossLocales(jws);

        const weakJws = harness("jws-tool", { payload: "{}", secret: "your-256-bit-secret", jwsToVerify: publicJwt, verifySecret: "your-256-bit-secret", signedJws: "stale" });
        view = weakJws.render(locale); await view.button("Sign JWS")(); assert.equal(weakJws.state().signedJws, ""); assert.ok(weakJws.notices.at(-1)!.includes("32 UTF-8 bytes"));
        await view.button("Verify Signature")(); assert.equal((weakJws.state().verifyResult as Props).valid, false); preserveAcrossLocales(weakJws);
        const malformedJwt = harness("jwt-decoder", { token: `${fixtureHeader}.${Buffer.from("null").toString("base64url")}.untrusted` }); view = malformedJwt.render(locale); assert.equal(malformedJwt.state().decoded, null); assert.ok(view.text.includes(translate(locale, "JWT header and claims must be JSON objects")));

        // Real Node Web Crypto, not a crypto adapter mock. RSA fixtures are generated once per locale and are test-only.
        const pair = await webcrypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["encrypt", "decrypt"]);
        const pem = async (key: webcrypto.CryptoKey, format: "spki" | "pkcs8", kind: string) => `-----BEGIN ${kind} KEY-----\n${Buffer.from(await webcrypto.subtle.exportKey(format, key)).toString("base64")}\n-----END ${kind} KEY-----`;
        const pub = await pem(pair.publicKey, "spki", "PUBLIC"), priv = await pem(pair.privateKey, "pkcs8", "PRIVATE"), plaintext = "public fixture: 你好 مرحبا 🌍";
        const jwe = harness("jwe-tool", { keyAlgorithm: "RSA-OAEP-256", contentAlgorithm: "A256GCM", publicKey: pub, privateKey: priv, plaintext }); view = jwe.render(locale);
        await view.button("Encrypt JWE")(); view = jwe.render(locale); const encrypted = String(jwe.state().encryptedJwe); assert.equal(encrypted.split(".").length, 5); assert.deepEqual(JSON.parse(Buffer.from(encrypted.split(".")[0], "base64url").toString()), { alg: "RSA-OAEP-256", enc: "A256GCM" });
        view.input("JWE Token").props.onChange!({ target: { value: encrypted } }); view = jwe.render(locale); await view.button("Decrypt JWE")(); view = jwe.render(locale); assert.equal((jwe.state().decryptResult as Props).plaintext, plaintext); preserveAcrossLocales(jwe);
        view = jwe.render(locale); await view.button("Copy")(); assert.equal(jwe.copied.at(-1), encrypted);
        const tampered = encrypted.split("."); tampered[4] = (tampered[4][0] === "A" ? "B" : "A") + tampered[4].slice(1); view.input("JWE Token").props.onChange!({ target: { value: tampered.join(".") } }); view = jwe.render(locale); await view.button("Decrypt JWE")(); view = jwe.render(locale); assert.equal((jwe.state().decryptResult as Props).success, false); assert.ok(view.text.includes(translate(locale, "Decryption failed. Check the token, algorithm and key, then try again."))); preserveAcrossLocales(jwe);
        view = jwe.render(locale); view.input("JWE Token").props.onChange!({ target: { value: "bad" } }); view = jwe.render(locale); await view.button("Decrypt JWE")(); view = jwe.render(locale); assert.ok(view.text.includes(translate(locale, "Invalid JWE format - must have 5 parts")));

        // Exact authenticated JSON survives the repaired direct and AES-KW/CBC-HS UI handlers.
        for (const [alg, enc, length] of [["dir", "A128GCM", 16], ["dir", "A256CBC-HS512", 64], ["A192KW", "A192CBC-HS384", 24]] as const) {
            const raw = '{ "integer":9007199254740993, "decimal":0.123456789012345678901, "text":"日本語 العربية 🌍" }';
            const key = "K".repeat(length), symmetric = harness("jwe-tool", { keyAlgorithm: alg, contentAlgorithm: enc, encryptKey: key, decryptKey: key, plaintext: raw });
            let result = symmetric.render(locale);
            assert.ok(result.text.includes(translate(locale, "Use an exact {length}-byte key (UTF-8, hex: or base64url:). Keys are never padded or truncated.", { length })));
            await result.button("Encrypt JWE")(); result = symmetric.render(locale);
            const token = String(symmetric.state().encryptedJwe); assert.equal(token.split(".").length, 5);
            preserveAcrossLocales(symmetric);
            result = symmetric.render(locale); result.input("JWE Token").props.onChange!({ target: { value: token } }); result = symmetric.render(locale);
            await result.button("Decrypt JWE")(); result = symmetric.render(locale);
            assert.equal((symmetric.state().decryptResult as Props).plaintext, raw, `${alg}/${enc} changed authenticated JSON text`);
            preserveAcrossLocales(symmetric);
            result = symmetric.render(locale); result.input("Encryption Key").props.onChange!({ target: { value: "short" } }); result = symmetric.render(locale);
            await result.button("Encrypt JWE")(); result = symmetric.render(locale);
            assert.equal(symmetric.state().encryptedJwe, "", "A failed encryption retained a stale token");
            assert.equal(symmetric.state().working, false);
            assert.equal(symmetric.notices.at(-1), translate(locale, "Encryption failed. Check the algorithm and key, then try again."));
        }

        const jwk = harness("jwk-generator", { keyType: "EC", keyId: "public-fixture-你好" }); view = jwk.render(locale); await view.button("Generate JWK")(); view = jwk.render(locale);
        const publicKey = JSON.parse(String(jwk.state().publicJwk)), privateKey = JSON.parse(String(jwk.state().privateJwk)); assert.equal(publicKey.kid, "public-fixture-你好"); assert.equal(publicKey.kty, "EC"); assert.equal(publicKey.alg, "ES256"); assert.equal(publicKey.crv, "P-256"); assert.equal(publicKey.d, undefined); assert.ok(privateKey.d); assert.deepEqual(JSON.parse(String(jwk.state().jwkSet)).keys, [publicKey]);
        const pubKey = await webcrypto.subtle.importKey("jwk", publicKey, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]), privKey = await webcrypto.subtle.importKey("jwk", privateKey, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]); const bytes = new TextEncoder().encode("public fixture"); const signature = await webcrypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privKey, bytes); assert.equal(await webcrypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, pubKey, signature, bytes), true); preserveAcrossLocales(jwk);
        view = jwk.render(locale); await view.button("Copy")(); assert.equal(jwk.copied.at(-1), jwk.state().publicJwk); await view.button("Download")(); assert.deepEqual(jwk.downloads.at(-1), { data: jwk.state().publicJwk, filename: "public-key.jwk", mime: "application/json" });
        const constraints = harness("jwk-generator", { keyType: "oct", keyUse: "enc", symmetricKeySize: 128 });
        let constraintsView = constraints.render(locale);
        assert.deepEqual(Array.from(constraintsView.find("Select", props => props["aria-label"] === translate(locale, "Key Size (bits)")).props.options, (option: Props) => option.value), [128, 192, 256]);
        constraintsView.find("Select", props => props["aria-label"] === translate(locale, "Key Use")).props.onChange!("sig"); constraintsView = constraints.render(locale);
        assert.equal(constraints.state().symmetricKeySize, 256);
        assert.deepEqual(Array.from(constraintsView.find("Select", props => props["aria-label"] === translate(locale, "Key Size (bits)")).props.options, (option: Props) => option.value), [256, 384, 512]); preserveAcrossLocales(constraints);
        const symmetric = harness("jwk-generator", { keyType: "oct", keyUse: "sig", symmetricKeySize: 256, keyId: "public-test-only" }); view = symmetric.render(locale); await view.button("Generate JWK")(); view = symmetric.render(locale); const oct = JSON.parse(String(symmetric.state().privateJwk)); assert.equal(Buffer.from(oct.k, "base64url").length, 32); assert.equal(oct.alg, "HS256"); assert.equal(symmetric.state().publicJwk, ""); assert.ok(view.text.includes(translate(locale, "Contains a secret key — do not publish"))); preserveAcrossLocales(symmetric);
    }
    // Authored recovery is localized, while the original parser/provider detail survives byte-for-byte.
    for (const { id } of LANGUAGES) {
        const t = (source: string, values?: Record<string, string | number>) => translate(id, source, values);
        const diagnostic = 'OperationError: provider says "bad tag" (0x00)';
        assert.equal(localizeJoseError(t, diagnostic), diagnostic);
        assert.equal(localizeJoseError(t, "Decryption failed: " + diagnostic), t("Decryption failed. Check the token, algorithm and key, then try again.") + "\n" + diagnostic);
    }
    console.log("JOSE localization: eight locales, authored coverage, actual handlers/state, JWT/JWS fixtures, RSA-OAEP/A256GCM and EC/oct Web Crypto boundaries passed.");
    console.log("Limits: React/AntD/editor/share/clipboard/download are UI adapters. Web Crypto is real; browser layout, focus and password visibility are not simulated. Independent RFC and Node/OpenSSL interoperability coverage lives in the separate JWE and JWS/JWK functional suites.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

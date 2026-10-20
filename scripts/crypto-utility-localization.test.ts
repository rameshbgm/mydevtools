import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { createHash, createHmac, webcrypto } from "node:crypto";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { CRYPTO_UTILITY_TRANSLATIONS, CRYPTO_UTILITY_HELP } from "../src/lib/i18n/crypto-utilities";
import { SEO_CONTENT } from "../src/lib/seo-content";

const ids = ["hash-generator", "hmac-generator", "bcrypt-tool", "aes-tool"] as const;
const nativeRequire = createRequire(import.meta.url);
const React = nativeRequire("react") as typeof import("react");
const jsx = nativeRequire("react/jsx-runtime");
const CryptoJS = nativeRequire("crypto-js") as typeof import("crypto-js");
const bcrypt = nativeRequire("bcryptjs") as typeof import("bcryptjs");
const placeholders = (value: string) => [...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map((match) => match[1]).sort();
for (const [source, columns] of Object.entries(CRYPTO_UTILITY_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    columns.forEach((value) => { assert.ok(value.trim()); assert.deepEqual(placeholders(value), placeholders(source), source); });
    // Shared vocabulary may have another equivalent authored translation; every key must resolve.
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog registration: ${source}`);
    for (const [index, { id }] of LANGUAGES.slice(1).entries()) assert.equal(translate(id, source), SHARED_TRANSLATIONS[source][index], `Catalog integration: ${id}: ${source}`);
}
function requireCopy(source: string) {
    if (["Base64", "AES-128", "AES-192", "AES-256"].includes(source)) return;
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Missing authored copy: ${source}`);
    assert.ok(SHARED_TRANSLATIONS[source].every((value) => value.trim()));
}
for (const id of ids) {
    for (const text of Object.values(CRYPTO_UTILITY_HELP[id]).flat()) requireCopy(text);
    for (const faq of SEO_CONTENT[id]?.faq ?? []) { requireCopy(faq.q); requireCopy(faq.a); }
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(/^AES-(128|192|256)(-CBC)?$/.test(node.text.trim()), `Untranslated JSX: ${id}: ${node.text.trim()}`);
        if (ts.isCallExpression(node) && ["t", "latestT.current"].includes(node.expression.getText(ast)) && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) requireCopy(node.arguments[0].text);
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(ast) === "Select") assert.ok(!node.attributes.properties.some((prop) => ts.isJsxAttribute(prop) && prop.name.getText(ast) === "dir"), "AntD Select has no dir prop");
        ts.forEachChild(node, visit);
    }; visit(ast);
    assert.match(source, /useLanguage\(\)/);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}|localStorage|sessionStorage|fetch\(/);
    assert.match(source, /useEffect\(\(\) => \{ latestT\.current = t; \}, \[t\]\)/, "Translation ref updates after commit");
}

type Element = { type: unknown; props: Record<string, any> };
type Hook = { deps?: unknown[]; value?: unknown };
type Controls = { diagnostic?: string; gate?: Promise<void> };
function harness(id: typeof ids[number], overrides: Record<string, unknown> = {}, controls: Controls = {}) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8"), ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const hooks: string[] = [];
    const collect = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(ast) === "useState") hooks.push(node.name.elements[0].getText(ast));
        ts.forEachChild(node, collect);
    }; collect(ast);
    let language: Language = "en", slot = 0, refSlot = 0, effectSlot = 0, callbackSlot = 0;
    const state = new Map<string, any>(), refs: { current: unknown }[] = [], effects: Hook[] = [], callbacks: Hook[] = [], pending: (() => unknown)[] = [];
    const log = { copies: [] as string[], notices: [] as string[], cryptoCalls: 0, randomCalls: 0, effects: 0, shares: [] as unknown[], sends: [] as unknown[] };
    let restore: ((value: unknown) => void) | undefined;
    const message = Object.fromEntries(["error", "warning", "success"].map((name) => [name, (value: string) => log.notices.push(value)]));
    const component = (name: string): any => (props: Record<string, unknown>) => React.createElement(name, props, props.children as import("react").ReactNode);
    const changed = (previous: Hook | undefined, deps: unknown[]) => !previous || deps.some((dep, index) => !Object.is(dep, previous.deps?.[index]));
    const count = <T,>(operation: () => T): T => { log.cryptoCalls++; if (controls.diagnostic) throw new Error(controls.diagnostic); return operation(); };
    const asyncOperation = async <T,>(operation: () => T): Promise<T> => { if (controls.gate) await controls.gate; return count(operation); };
    const cryptoJs = new Proxy(CryptoJS, { get: (target, property) => {
        if (property === "AES") return {
            encrypt: (...args: Parameters<typeof CryptoJS.AES.encrypt>) => count(() => CryptoJS.AES.encrypt(...args)),
            decrypt: (...args: Parameters<typeof CryptoJS.AES.decrypt>) => count(() => CryptoJS.AES.decrypt(...args)),
        };
        if (["MD5", "SHA1", "SHA224", "SHA256", "SHA384", "SHA512", "SHA3", "RIPEMD160"].includes(String(property))) return (...args: unknown[]) => count(() => (target[property as keyof typeof target] as (...args: unknown[]) => unknown)(...args));
        return target[property as keyof typeof target];
    } });
    const components: Record<string, any> = {};
    for (const name of ["Button", "Card", "Row", "Col", "Select", "Segmented", "Spin", "InputNumber", "Tag", "Divider", "Alert"]) components[name] = component(name);
    components.Input = Object.assign(component("Input"), { Password: component("Password"), TextArea: component("TextArea") });
    components.Space = Object.assign(component("Space"), { Compact: component("Compact") });
    components.Tabs = (props: { items: { key: string; label: string; children: unknown }[] }) => React.createElement("Tabs", props, props.items.map((item) => React.createElement("Tab", { key: item.key }, item.label, item.children as import("react").ReactNode)));
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React,
            useState: (initial: unknown) => {
                const key = hooks[slot++]; assert.ok(key, "Known state hook");
                if (!state.has(key)) state.set(key, Object.hasOwn(overrides, key) ? overrides[key] : typeof initial === "function" ? (initial as () => unknown)() : initial);
                return [state.get(key), (value: unknown) => state.set(key, typeof value === "function" ? (value as (previous: unknown) => unknown)(state.get(key)) : value)];
            },
            useRef: (initial: unknown) => { const index = refSlot++; return refs[index] ??= { current: initial }; },
            useCallback: (callback: unknown, deps: unknown[]) => { const index = callbackSlot++; if (changed(callbacks[index], deps)) callbacks[index] = { deps, value: callback }; return callbacks[index].value; },
            useEffect: (effect: () => unknown, deps: unknown[]) => { const index = effectSlot++; if (changed(effects[index], deps)) { effects[index] = { deps }; pending.push(() => { log.effects++; return effect(); }); } },
        };
        if (name === "react/jsx-runtime") return jsx;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => {
            const committedLanguage = language;
            return { language: committedLanguage, direction: committedLanguage === "ar" ? "rtl" : "ltr", t: (key: string, values?: Record<string, string | number>) => translate(committedLanguage, key, values) };
        } };
        if (name.endsWith("crypto-utilities")) return { CRYPTO_UTILITY_HELP };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Record<string, any>) => React.createElement("Layout", props, props.title, props.description, Object.values(props.learnMore).flat().map((key) => translate(language, String(key))).join(" "), props.children) };
        if (name.endsWith("clipboard")) return { copyToClipboard: (value: string, notice?: string) => { log.copies.push(value); if (notice) log.notices.push(notice); return Promise.resolve(true); } };
        if (name.endsWith("shareable-state")) return { useShareableState: (_schema: unknown, callback: (value: unknown) => void) => { restore = callback; } };
        if (name.endsWith("ShareButton")) return { __esModule: true, default: component("ShareButton") };
        if (name.endsWith("SendToButton")) return { __esModule: true, default: component("SendToButton") };
        if (name.endsWith("ToolBridgeBanner")) return { __esModule: true, default: component("BridgeBanner") };
        if (name.endsWith("aes-text")) {
            const helper = { exports: {} };
            const helperSource = readFileSync("src/lib/aes-text.ts", "utf8");
            const helperCode = ts.transpileModule(helperSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
            runInNewContext(helperCode, { module: helper, exports: helper.exports, require: dependencies, Error });
            return helper.exports;
        }
        if (name === "crypto-js") return { __esModule: true, default: cryptoJs };
        if (name === "bcryptjs") return { __esModule: true, default: { hash: (password: string, rounds: number) => asyncOperation(() => bcrypt.hash(password, rounds)), compare: (password: string, hash: string) => asyncOperation(() => bcrypt.compare(password, hash)) } };
        if (name === "antd") return { ...components, App: { useApp: () => ({ message }) }, message, Typography: { Text: component("Text"), Paragraph: component("Paragraph") } };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => () => null });
        throw new Error(`Unexpected import: ${name}`);
    };
    const compiled = { exports: {} as { default: () => unknown } };
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const cryptoProxy = { subtle: {
        importKey: (...args: Parameters<typeof webcrypto.subtle.importKey>) => asyncOperation(() => webcrypto.subtle.importKey(...args)),
        sign: (...args: Parameters<typeof webcrypto.subtle.sign>) => count(() => webcrypto.subtle.sign(...args)),
    }, getRandomValues: (array: Uint8Array<ArrayBuffer>) => { log.randomCalls++; return webcrypto.getRandomValues(array); } };
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, Error, Number, TextEncoder, Uint8Array, ArrayBuffer, btoa, crypto: cryptoProxy });
    function render(next: Language) {
        language = next; slot = 0; refSlot = 0; effectSlot = 0; callbackSlot = 0;
        const nodes: Element[] = [], visible: string[] = [];
        const walk = (value: unknown) => {
            if (value == null || typeof value === "boolean") return;
            if (typeof value === "string" || typeof value === "number") { visible.push(String(value)); return; }
            if (Array.isArray(value)) { value.forEach(walk); return; }
            const element = value as Element;
            if (typeof element.type === "function") { walk(element.type(element.props)); return; }
            if (!element.props) return;
            nodes.push(element); walk(element.props.children);
            for (const prop of ["title", "extra", "suffix"]) walk(element.props[prop]);
        }; walk(compiled.exports.default());
        pending.splice(0).forEach((effect) => effect());
        return { nodes, text: visible.join(" ") };
    }
    return { render, state, log, restore: (value: unknown) => { assert.ok(restore); restore(value); }, mount: async () => { render("en"); pending.splice(0).forEach((effect) => effect()); await settle(); } };
}
async function settle() { for (let index = 0; index < 8; index++) await new Promise((resolve) => setImmediate(resolve)); }
type Page = ReturnType<ReturnType<typeof harness>["render"]>;
const find = (page: Page, predicate: (node: Element) => boolean) => { const node = page.nodes.find(predicate); assert.ok(node, "Expected control"); return node; };
const click = (page: Page, text: string) => find(page, (node) => node.type === "Button" && node.props.children === text).props.onClick();
const snapshot = (state: Map<string, unknown>) => JSON.stringify([...state]);
const same = (actual: unknown, expected: unknown) => assert.equal(JSON.stringify(actual), JSON.stringify(expected));
const payload = "  العربية 日本語 😀\nexact\tdata \u0000 ";
const secret = "S3crét العربية 🔐\n ";
const diagnostic = "RAW platform diagnostic: العربية 日本語\nDo not translate!";

async function main() {
for (const { id: language } of LANGUAGES) {
    const t = (key: string, values?: Record<string, string | number>) => translate(language, key, values);
    const hash = harness("hash-generator", { input: payload }); await hash.mount();
    let page = hash.render("en"); const initial = snapshot(hash.state), calls = hash.log.cryptoCalls;
    page = hash.render(language); assert.equal(snapshot(hash.state), initial); assert.equal(hash.log.cryptoCalls, calls);
    assert.ok(page.text.includes(t("Generate Hashes")));
    const hashes = hash.state.get("hashes") as Record<string, string>;
    assert.equal(Object.keys(hashes).length, 11);
    for (const bits of [224, 256, 384, 512]) assert.ok(page.text.includes(`Keccak-${bits} (CryptoJS SHA3)`));
    assert.ok(!page.text.includes("SHA-3 (256)"), "Do not display Keccak under the standard SHA-3 name");
    for (const [name, nodeName] of [["MD5", "md5"], ["SHA-1", "sha1"], ["SHA-224", "sha224"], ["SHA-256", "sha256"], ["SHA-384", "sha384"], ["SHA-512", "sha512"], ["RIPEMD-160", "ripemd160"]]) assert.equal(hashes[name], createHash(nodeName).update(payload).digest("hex"));
    for (const bits of [224, 256, 384, 512]) assert.equal(hashes[`Keccak-${bits}`], CryptoJS.SHA3(payload, { outputLength: bits }).toString());
    click(page, t("Copy All")); assert.equal(hash.log.copies.at(-1), Object.entries(hashes).map(([key, value]) => `${key}: ${value}`).join("\n"));
    find(page, (node) => node.type === "Button" && node.props["aria-label"] === t("Copy")).props.onClick(); assert.equal(hash.log.copies.at(-1), hashes.MD5);
    same(find(page, (node) => node.type === "ShareButton").props.getState(), { input: payload });
    assert.equal(find(page, (node) => node.type === "SendToButton").props.data, payload);
    find(page, (node) => node.type === "BridgeBanner").props.onAccept({ data: payload + "BRIDGE" }); assert.equal(hash.state.get("input"), payload + "BRIDGE"); assert.equal(hash.log.cryptoCalls, calls);
    hash.restore({ input: payload }); await settle(); assert.equal(hash.state.get("hashes")["SHA-256"], hashes["SHA-256"]);
    hash.restore({ input: "" }); await settle();
    // Keccak empty-message vectors; each deliberately differs from standardized SHA-3.
    const keccakEmpty: Record<number, string> = {
        224: "f71837502ba8e10837bdd8d365adb85591895602fc552b48b7390abd",
        256: "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
        384: "2c23146a63a29acf99e73b88f8c24eaa7dc60aa771780ccc006afbfa8fe2479b2dd2b21362337441ac12b515911957ff",
        512: "0eab42de4c3ceb9235fc91acffe746b29c29a8c366b7c60e4e67c466f36a4304c00fa9caf9d87976ba469bcbe06713b435f091ef2769fb160cdab33d3670680e",
    };
    for (const bits of [224, 256, 384, 512]) {
        assert.equal(hash.state.get("hashes")[`Keccak-${bits}`], keccakEmpty[bits]);
        assert.notEqual(hash.state.get("hashes")[`Keccak-${bits}`], createHash(`sha3-${bits}`).update("").digest("hex"));
    }
    page = hash.render(language); click(page, t("Copy All"));
    assert.ok(hash.log.copies.at(-1)?.includes("Keccak-256: " + keccakEmpty[256]));
    assert.ok(!hash.log.copies.at(-1)?.includes("SHA-3 ("));
    hash.state.set("input", ""); page = hash.render(language); await click(page, t("Generate Hashes")); assert.equal(hash.log.notices.at(-1), t("Enter some text first"));
    const hashFail = harness("hash-generator", {}, { diagnostic }); await hashFail.mount(); page = hashFail.render(language); await click(page, t("Generate Hashes")); assert.equal(hashFail.log.notices.at(-1), t("Crypto operation failed: {detail}", { detail: diagnostic }));

    // Actual Web Crypto signatures, exact encodings and stable algorithm IDs in every locale.
    const hmac = harness("hmac-generator", { inputText: payload, secretKey: secret, showSecret: false }); page = hmac.render("en");
    const hmacBefore = snapshot(hmac.state); page = hmac.render(language); assert.equal(snapshot(hmac.state), hmacBefore); assert.equal(hmac.log.cryptoCalls, 0); assert.equal(hmac.log.randomCalls, 0);
    const algorithms = find(page, (node) => node.type === "Select"); same(algorithms.props.options.map((option: { value: string }) => option.value), ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]);
    for (const algorithm of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]) for (const format of ["hex", "base64"]) {
        hmac.state.set("algorithm", algorithm); hmac.state.set("outputFormat", format); page = hmac.render(language);
        await click(page, t("Generate HMAC"));
        const expected = createHmac(algorithm.replace("-", "").toLowerCase(), secret).update(payload).digest(format as "hex" | "base64"); assert.equal(hmac.state.get("hmacResult"), expected);
        page = hmac.render(language); click(page, t("Copy")); assert.equal(hmac.log.copies.at(-1), expected);
        const before = snapshot(hmac.state); const count: number = hmac.log.cryptoCalls; hmac.render("ar"); hmac.render(language); assert.equal(snapshot(hmac.state), before); assert.equal(hmac.log.cryptoCalls, count); assert.equal(hmac.log.randomCalls, 0);
    }
    page = hmac.render(language); same(find(page, (node) => node.type === "ShareButton").props.getState(), { inputText: payload }); assert.equal(find(page, (node) => node.type === "SendToButton").props.data, payload);
    const secretInput = find(page, (node) => node.type === "Password"); assert.equal(secretInput.props.styles.input.direction, "ltr"); assert.equal(secretInput.props.visibilityToggle.visible, false);
    hmac.restore({ inputText: payload + "SHARED" }); assert.equal(hmac.state.get("secretKey"), secret); assert.equal(hmac.state.get("inputText"), payload + "SHARED");
    find(hmac.render(language), (node) => node.type === "Button" && node.props["aria-label"] === t("Generate random secret key")).props.onClick(); assert.equal(hmac.log.randomCalls, 1); assert.equal(Buffer.from(hmac.state.get("secretKey"), "base64").length, 32);
    hmac.state.set("secretKey", ""); page = hmac.render(language); await click(page, t("Generate HMAC")); assert.equal(hmac.log.notices.at(-1), t("Please enter both message and secret key"));

    // BCrypt produces randomized hashes but locale changes preserve the completed output exactly.
    const bc = harness("bcrypt-tool", { password: secret, rounds: 4, verifyPwd: secret }); page = bc.render(language); await click(page, t("Generate Hash")); const result = bc.state.get("hash"); assert.ok(await bcrypt.compare(secret, result)); assert.match(result, /^\$2[aby]\$04\$/);
    const bcBefore = snapshot(bc.state), bcCalls = bc.log.cryptoCalls; page = bc.render("ar"); page = bc.render(language); assert.equal(snapshot(bc.state), bcBefore); assert.equal(bc.log.cryptoCalls, bcCalls);
    click(page, t("Copy")); assert.equal(bc.log.copies.at(-1), result);
    bc.state.set("verifyHash", result); page = bc.render(language); await click(page, t("Verify")); page = bc.render(language); assert.equal(bc.state.get("verifyResult"), "match"); assert.ok(page.text.includes(t("Password matches the hash")));
    bc.state.set("verifyPwd", secret + "x"); page = bc.render(language); await click(page, t("Verify")); assert.ok(bc.render(language).text.includes(t("Password does NOT match the hash")));
    const rounds = find(page, (node) => node.type === "InputNumber"); assert.equal(rounds.props.min, 4); assert.equal(rounds.props.max, 15); rounds.props.onChange(null); assert.equal(bc.state.get("rounds"), 10);
    bc.state.set("password", ""); page = bc.render(language); await click(page, t("Generate Hash")); assert.equal(bc.log.notices.at(-1), t("Enter a password to hash"));
    bc.state.set("verifyPwd", ""); page = bc.render(language); await click(page, t("Verify")); assert.equal(bc.log.notices.at(-1), t("Enter both a password and a BCrypt hash"));
    const bcFail = harness("bcrypt-tool", { password: secret, verifyPwd: secret, verifyHash: result }, { diagnostic }); page = bcFail.render(language); await click(page, t("Generate Hash")); assert.equal(bcFail.log.notices.at(-1), t("Crypto operation failed: {detail}", { detail: diagnostic })); await click(page, t("Verify")); assert.equal(bcFail.log.notices.at(-1), t("Crypto operation failed: {detail}", { detail: diagnostic }));

    const aes = harness("aes-tool", { passphrase: secret, input: payload }); page = aes.render(language);
    same(find(page, (node) => node.type === "Segmented").props.options.map((option: { value: string }) => option.value), ["Encrypt", "Decrypt"]);
    assert.equal(page.nodes.filter((node) => node.type === "Select").length, 0, "No ineffective key-size selector");
    assert.ok(page.text.includes("AES-256-CBC"));
    assert.ok(page.text.includes(t("Fixed compatibility format")));
    assert.ok(page.text.includes(t("Legacy compatibility only")));
    assert.equal(find(page, (node) => node.type === "Alert").props.description, t("No authentication tag: a successful decryption does not prove the passphrase or ciphertext is correct. Use for existing CryptoJS data and compatibility checks."));
    { aes.state.set("mode", "Encrypt"); aes.state.set("input", payload); page = aes.render(language); click(page, t("Encrypt")); const encrypted = aes.state.get("output"); assert.match(encrypted, /^U2FsdGVkX1/); assert.equal(CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8), payload);
        const aesBefore = snapshot(aes.state), aesCalls = aes.log.cryptoCalls; page = aes.render("ar"); page = aes.render(language); assert.equal(snapshot(aes.state), aesBefore); assert.equal(aes.log.cryptoCalls, aesCalls); click(page, t("Copy")); assert.equal(aes.log.copies.at(-1), encrypted);
        click(page, t("Use Output as Input")); assert.equal(aes.state.get("input"), encrypted); assert.equal(aes.state.get("mode"), "Decrypt"); assert.equal(aes.state.get("output"), ""); page = aes.render(language); click(page, t("Decrypt")); assert.equal(aes.state.get("output"), payload);
    }
    page = aes.render(language); assert.equal(find(page, (node) => node.type === "TextArea" && !node.props.readOnly).props.dir, "ltr"); assert.equal(find(page, (node) => node.type === "TextArea" && node.props.readOnly).props.dir, "auto");
    aes.state.set("input", "not ciphertext"); page = aes.render(language); click(page, t("Decrypt")); assert.equal(aes.state.get("output"), ""); assert.equal(aes.log.notices.at(-1), t("Decryption failed — wrong passphrase or corrupted ciphertext"));
    const aesFail = harness("aes-tool", { input: payload, passphrase: secret }, { diagnostic }); page = aesFail.render(language); click(page, t("Encrypt")); assert.equal(aesFail.log.notices.at(-1), t("Crypto operation failed: {detail}", { detail: diagnostic })); assert.equal(aesFail.state.get("passphrase"), secret);
    aes.state.set("passphrase", ""); page = aes.render(language); click(page, t("Decrypt")); assert.equal(aes.log.notices.at(-1), t("Enter a passphrase")); aes.state.set("passphrase", secret); aes.state.set("input", ""); page = aes.render(language); click(page, t("Decrypt")); assert.equal(aes.log.notices.at(-1), t("Enter text"));
    // Editing secrets, drafts or mode clears stale output; locale changes do not.
    aes.state.set("output", "stale"); page = aes.render(language); find(page, (node) => node.type === "Password").props.onChange({ target: { value: secret } }); assert.equal(aes.state.get("output"), "");
    aes.state.set("output", "stale"); page = aes.render(language); find(page, (node) => node.type === "TextArea" && !node.props.readOnly).props.onChange({ target: { value: payload } }); assert.equal(aes.state.get("output"), "");
    aes.state.set("output", "stale"); page = aes.render(language); find(page, (node) => node.type === "Segmented").props.onChange("Decrypt"); assert.equal(aes.state.get("output"), "");
    aes.state.set("input", CryptoJS.AES.encrypt("", secret).toString()); page = aes.render(language); click(page, t("Decrypt")); assert.equal(aes.state.get("output"), ""); assert.equal(aes.log.notices.at(-1), t("Decryption completed"));
    aes.state.set("output", "stale"); aes.state.set("passphrase", ""); page = aes.render(language); click(page, t("Decrypt")); assert.equal(aes.state.get("output"), "");
    page = aes.render(language); click(page, t("Clear")); assert.equal(aes.state.get("input"), ""); assert.equal(aes.state.get("output"), ""); assert.equal(aes.state.get("passphrase"), "");

    // Change locale during a real in-flight async operation, without restarting it or mutating drafts.
    let release!: () => void; const gate = new Promise<void>((resolve) => { release = resolve; });
    const flight = harness("bcrypt-tool", { password: secret, rounds: 4 }, { gate }); page = flight.render("en"); const operation = click(page, translate("en", "Generate Hash")); assert.equal(flight.state.get("hashing"), true); const during = snapshot(flight.state); flight.render(language); assert.equal(snapshot(flight.state), during); assert.equal(flight.log.cryptoCalls, 0); release(); await operation; assert.equal(flight.log.cryptoCalls, 1); assert.ok(await bcrypt.compare(secret, flight.state.get("hash"))); assert.equal(flight.log.notices.at(-1), t("Hash generated"));
    let releaseError!: () => void; const errorGate = new Promise<void>((resolve) => { releaseError = resolve; });
    const failingFlight = harness("hmac-generator", { inputText: payload, secretKey: secret }, { gate: errorGate, diagnostic }); page = failingFlight.render("en"); const pending = click(page, translate("en", "Generate HMAC")); failingFlight.render(language); releaseError(); await pending; assert.equal(failingFlight.log.notices.at(-1), t("Crypto operation failed: {detail}", { detail: diagnostic })); assert.equal(failingFlight.state.get("secretKey"), secret); assert.equal(failingFlight.state.get("showSecret"), false);
}
// Verify CryptoJS passphrase route and BCrypt byte limit claims against the installed engines.
for (const size of [128, 192, 256]) { const encrypted = CryptoJS.AES.encrypt(payload, secret, { keySize: size / 32 }); assert.equal(encrypted.key.sigBytes, 32); assert.equal(encrypted.iv.sigBytes, 16); assert.equal(encrypted.salt.sigBytes, 8); }
assert.equal(bcrypt.truncates("😀".repeat(19)), true);
const prefix = "a".repeat(72), longHash = await bcrypt.hash(prefix + "suffix", 4); assert.ok(await bcrypt.compare(prefix + "other", longHash));
console.log(`Crypto utilities: ${Object.keys(CRYPTO_UTILITY_TRANSLATIONS).length} authored keys, all 8 locales, real hash/HMAC/BCrypt/AES handlers, literal payloads, preserved state, in-flight locale changes and unchanged engine fixtures passed.`);

}
main().catch((cause) => { console.error(cause); process.exitCode = 1; });

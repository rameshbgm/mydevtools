import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { VAULT_INTERFACE_TRANSLATIONS } from "../src/lib/i18n/vault-interface";
import { LANGUAGES, SHARED_TRANSLATIONS, translate } from "../src/lib/i18n/catalog";
import { createVault, openVault, type VaultEnvelope } from "../src/lib/local-vault";
import { vaultContents, bytesToBase64, base64ToBytes, type VaultRecord } from "../src/lib/vault-records";

const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(VAULT_INTERFACE_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const [index, value] of columns.entries()) {
        assert.ok(value.trim(), `${source}/${index}`);
        assert.deepEqual(placeholders(value), placeholders(source), source);
    }
}
const requireTranslation = (text: string) => assert.ok(Object.hasOwn(VAULT_INTERFACE_TRANSLATIONS, text), `Missing vault translation: ${text}`);
for (const path of ["src/components/EncryptedVault.tsx", "src/app/tools/credential-vault/page.tsx", "src/app/tools/secure-files/page.tsx", "src/lib/local-vault.ts", "src/lib/vault-records.ts"]) {
    const source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, path.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const inspectCopy = (node: ts.Node) => {
        if (ts.isStringLiteral(node) && node.text) requireTranslation(node.text);
        else if (ts.isConditionalExpression(node)) { inspectCopy(node.whenTrue); inspectCopy(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.fail(`Untranslated vault JSX: ${node.text.trim()}`);
        if (ts.isCallExpression(node) && ["t", "setNotice", "setError"].includes(node.expression.getText(file)) && node.arguments[0]) inspectCopy(node.arguments[0]);
        if (ts.isNewExpression(node) && node.expression.getText(file) === "Error" && node.arguments?.[0]) inspectCopy(node.arguments[0]);
        if (ts.isJsxAttribute(node) && ["title", "description", "aria-label", "placeholder"].includes(node.name.getText(file)) && node.initializer) inspectCopy(node.initializer);
        ts.forEachChild(node, visit);
    };
    visit(file);
}

// Integration with the shared provider: existing notices and interpolated
// counts translate on rerender, while user data is interpolated unchanged.
for (const language of LANGUAGES) {
    for (const source of Object.keys(VAULT_INTERFACE_TRANSLATIONS)) {
        const result = translate(language.id, source, { count: "23" });
        if (language.id !== "en") {
            const index = LANGUAGES.findIndex((entry) => entry.id === language.id) - 1;
            assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Vault translation not registered: ${source}`);
            // Existing shared storage copy may override an equivalent local row.
            const expected = SHARED_TRANSLATIONS[source][index].replaceAll("{count}", "23");
            assert.equal(result, expected, `${source}/${language.id}`);
        }
        assert.ok(!result.includes("{count}"));
    }
}
assert.equal(translate("ar", "{count} records imported. Existing records were preserved.", { count: "23" }), VAULT_INTERFACE_TRANSLATIONS["{count} records imported. Existing records were preserved."][6].replace("{count}", "23"));
console.log(`Vault interface translations: ${Object.keys(VAULT_INTERFACE_TRANSLATIONS).length} strings across all eight languages; all authored UI and vault-library errors covered.`);

// Actual import callbacks use real authenticated envelopes. Only the storage,
// File and React boundaries are doubled; this does not exercise browser picking
// or saving a file and never opens a real browser database.
const fixtureRequire = createRequire(resolve("package.json"));
type FixtureElement = { type: unknown; props: Record<string, unknown> };
function importHarness() {
    const source = readFileSync("src/components/EncryptedVault.tsx", "utf8");
    const file = ts.createSourceFile("EncryptedVault.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const names: string[] = [];
    const collect = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file));
        ts.forEachChild(node, collect);
    }; collect(file);
    const values: unknown[] = [], references: { current: unknown }[] = [], effects: { cleanup?: () => void }[] = [];
    const writes: { id: string; envelope: VaultEnvelope }[] = [];
    let stateIndex = 0, refIndex = 0, effectIndex = 0;
    const react = {
        useState(initial: unknown) {
            const index = stateIndex++;
            if (!(index in values)) values[index] = names[index] === "backupPassphrase" ? "public backup passphrase" : names[index] === "passphrase" || names[index] === "confirmation" ? "public target passphrase" : initial;
            return [values[index], (next: unknown) => { values[index] = typeof next === "function" ? next(values[index]) : next; }];
        },
        useRef(initial: unknown) { const index = refIndex++; return references[index] ?? (references[index] = { current: initial }); },
        useCallback(callback: unknown) { return callback; },
        useEffect(effect: () => (() => void) | undefined) { const index = effectIndex++; if (!effects[index]) effects[index] = { cleanup: effect() }; },
    };
    const compiled = { exports: {} as { default: (props: { purpose: "files" }) => unknown } };
    const dependency = (name: string): unknown => {
        if (name === "react") return react;
        if (name === "react/jsx-runtime") return fixtureRequire("react/jsx-runtime");
        if (name.endsWith("local-vault")) return { createVault, openVault, readVault: async () => null, writeVault: async (id: string, envelope: VaultEnvelope) => { writes.push({ id, envelope }); } };
        if (name.endsWith("project-storage")) return { activeSessionProjectId: () => "personal" };
        if (name.endsWith("vault-records")) return { vaultContents, bytesToBase64, base64ToBytes };
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language: "en", t: (key: string, replacements?: Record<string, string | number>) => translate("en", key, replacements) }) };
        if (name.endsWith("vault-interface")) return { VAULT_INTERFACE_TRANSLATIONS };
        if (name.endsWith("clipboard")) return { copyToClipboard: async () => true };
        if (name.endsWith("download")) return { downloadBlob: () => assert.fail("Import must not start a download") };
        throw new Error(`Unexpected vault fixture dependency: ${name}`);
    };
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, { module: compiled, exports: compiled.exports, require: dependency, window: { addEventListener() {}, removeEventListener() {} }, Date, JSON, Error, crypto: globalThis.crypto, setInterval: () => 1, clearInterval() {} });
    const render = () => {
        stateIndex = refIndex = effectIndex = 0;
        const elements: FixtureElement[] = [];
        const walk = (node: unknown) => {
            if (!node || typeof node !== "object") return;
            if (Array.isArray(node)) { node.forEach(walk); return; }
            const element = node as FixtureElement;
            if (typeof element.type === "function") { walk(element.type(element.props)); return; }
            elements.push(element); walk(element.props?.children);
        }; walk(compiled.exports.default({ purpose: "files" }));
        return elements;
    };
    const state = (name: string) => values[names.indexOf(name)];
    return {
        writes, state, render,
        async importEnvelope(envelope: VaultEnvelope) {
            render(); await Promise.resolve(); const elements = render();
            const input = elements.find(element => element.type === "input" && element.props.accept === "application/json,.json");
            assert.ok(input && !input.props.disabled, "Fixture imports through the actual enabled backup control");
            const text = JSON.stringify(envelope);
            const onChange = input.props.onChange as (event: unknown) => void;
            onChange({ target: { files: [{ size: Buffer.byteLength(text), text: async () => text }], value: "public-backup.json" } });
            for (let tick = 0; tick < 200 && state("busy"); tick++) await new Promise(resolve => setTimeout(resolve, 10));
            assert.equal(state("busy"), false, "Import callback settled");
            render();
        },
        cleanup() { effects.forEach(effect => effect.cleanup?.()); },
    };
}
async function testAuthenticatedFileImports() {
    const base: VaultRecord = { id: "public-file", kind: "file", name: "public-画像-مرحبا.bin", folder: "Public fixtures", username: "", environment: "", value: "AP8=", updatedAt: "2026-10-21", file: { mime: "application/octet-stream", size: 2, modified: 0 } };
    for (const [value, size] of [["A", 4], ["AB==", 1], ["AAEC", 4]] as const) {
        const record = { ...base, value, file: { ...base.file!, size } };
        const backup = await createVault("public backup passphrase", "public-source:files", { version: 1, records: [record] });
        const independentlyOpened = await openVault(backup.envelope, "public backup passphrase");
        assert.throws(() => vaultContents(independentlyOpened.read(), "files"), /invalid record/); independentlyOpened.lock();
        const app = importHarness();
        try {
            await app.importEnvelope(backup.envelope);
            assert.equal(app.writes.length, 0, "Invalid decrypted files must be rejected before any storage write");
            assert.equal((app.state("records") as unknown[]).length, 0); assert.equal(app.state("unlocked"), false);
            assert.equal(app.state("error"), "Vault contains an invalid record.");
        } finally { app.cleanup(); backup.lock(); }
    }
    const records = [base, { ...base, id: "public-unpadded", value: "AP8" }, { ...base, id: "public-empty", value: "", file: { ...base.file!, size: 0 } }];
    const backup = await createVault("public backup passphrase", "public-source:files", { version: 1, records });
    const app = importHarness();
    try {
        await app.importEnvelope(backup.envelope);
        assert.equal(app.writes.length, 1); assert.equal(app.writes[0].id, "personal:files");
        const reopened = await openVault(app.writes[0].envelope, "public target passphrase", "personal:files");
        try {
            const restored = vaultContents(reopened.read(), "files").records;
            assert.equal(restored.length, 3);
            for (const [index, record] of restored.entries()) {
                assert.notEqual(record.id, records[index].id);
                assert.deepEqual({ ...record, id: records[index].id }, records[index]);
                assert.deepEqual(Buffer.from(base64ToBytes(record.value)), index === 2 ? Buffer.alloc(0) : Buffer.from([0, 255]));
            }
        } finally { reopened.lock(); }
    } finally { app.cleanup(); backup.lock(); }
    console.log("Authenticated file imports reject impossible Base64, nonzero padding bits and size mismatches before storage; padded, unpadded and empty files retain exact bytes and metadata.");
}
testAuthenticatedFileImports().catch(error => { console.error(error); process.exitCode = 1; });

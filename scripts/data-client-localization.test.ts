import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { DATA_CLIENT_TRANSLATIONS } from "../src/lib/i18n/data-clients";

const protocolCopy = new Set(["MongoDB", "Firestore", "Elasticsearch", "DNS SRV (TLS)", "SCRAM-SHA-256", "SCRAM-SHA-1", ".", "·"]);
const paths = ["data-explorer", "redis-browser", "s3-browser"].map((id) => `src/app/tools/${id}/page.tsx`);
const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(DATA_CLIENT_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog integration missing: ${source}`);
    for (const column of columns) {
        assert.ok(column.trim(), source);
        assert.deepEqual(placeholders(column), placeholders(source), source);
    }
    for (const language of LANGUAGES) assert.ok(translate(language.id, source).trim(), `${language.id}: ${source}`);
}

for (const path of paths) {
    const source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const requireCopy = (value: string) => {
        if (value && !protocolCopy.has(value)) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, value), `Missing data-client translation in ${path}: ${value}`);
    };
    const inspect = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) requireCopy(node.text);
        else if (ts.isConditionalExpression(node)) { inspect(node.whenTrue); inspect(node.whenFalse); }
        else if (ts.isArrayLiteralExpression(node)) node.elements.forEach(inspect);
        else if (ts.isJsxExpression(node) && node.expression) inspect(node.expression);
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(protocolCopy.has(node.text.trim()), `Untranslated visible copy in ${path}: ${node.text.trim()}`);
        if (ts.isCallExpression(node) && ["t", "setError"].includes(node.expression.getText(file)) && node.arguments[0]) inspect(node.arguments[0]);
        if (ts.isNewExpression(node) && node.expression.getText(file) === "Error" && node.arguments?.[0]) inspect(node.arguments[0]);
        if (ts.isJsxAttribute(node) && ["title", "description", "label", "aria-label"].includes(node.name.getText(file)) && node.initializer) inspect(node.initializer);
        if (ts.isPropertyAssignment(node) && ["whatIs", "howToUse", "tips", "source"].includes(node.name.getText(file))) inspect(node.initializer);
        if (ts.isArrayLiteralExpression(node) && node.elements.length === 2 && node.elements.every(ts.isStringLiteral) && ["endpoint", "region", "accessKeyId", "secretAccessKey", "sessionToken"].includes((node.elements[0] as ts.StringLiteral).text)) inspect(node.elements[1]);
        if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && ["input", "textarea", "pre"].includes(node.tagName.getText(file))) {
            const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
            const type = attrs.find((attr) => attr.name.getText(file) === "type")?.initializer;
            const isExcluded = type && ts.isStringLiteral(type) && ["file", "checkbox"].includes(type.text);
            if (!isExcluded) {
                const direction = attrs.find((attr) => attr.name.getText(file) === "dir")?.initializer;
                assert.ok(direction && ts.isStringLiteral(direction) && direction.text === "ltr", `Machine input/output must stay LTR: ${path}: ${node.getText(file).slice(0, 90)}`);
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
    assert.match(source, /const \{ t \} = useLanguage\(\)/);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/, "Language changes must preserve component state");
}

// Render every data-engine branch and stored state in each language without
// networking. The same hook values are reused across locale changes, including
// precision-sensitive provider data, binary keys, object names and notices.
const nativeRequire = createRequire(import.meta.url);
const React = nativeRequire("react") as typeof import("react");
const jsxRuntime = nativeRequire("react/jsx-runtime");
type ElementNode = { type: unknown; props: Record<string, unknown> };
const rawName = "日本語 العربية <item>";
const rawJson = '{"id":9223372036854775807,"n":0.9999999999999999999}';
function render(path: string, language: Language, override: Record<string, unknown> = {}) {
    let stateIndex = 0;
    const hookValues: Record<string, unknown> = {};
    const hookNames: string[] = [];
    const sourceFile = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const collectHookNames = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(sourceFile) === "useState") hookNames.push(node.name.elements[0].getText(sourceFile));
        ts.forEachChild(node, collectHookNames);
    };
    collectHookNames(sourceFile);
    const compiledModule = { exports: {} as { default: () => unknown } };
    const code = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const stub = () => null;
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (initial: unknown) => { const name = hookNames[stateIndex++]; const value = Object.hasOwn(override, name) ? override[name] : initial; hookValues[name] = value; return [value, stub]; }, useMemo: (compute: () => unknown) => compute(), useRef: (current: unknown) => ({ current }), useEffect: stub };
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t: (copy: string, values?: Record<string, string | number>) => translate(language, copy, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Record<string, unknown>) => React.createElement("div", null, translate(language, String(props.title)), translate(language, String(props.description)), props.children as import("react").ReactNode) };
        if (name === "@ant-design/icons") return { DatabaseOutlined: stub, CloudOutlined: stub };
        if (name.endsWith("document-preview")) return { documentPreview: (value: unknown) => JSON.stringify(value) };
        if (name.endsWith("LocalConnectorAccess") || name.endsWith("ConnectionVault")) return { __esModule: true, default: stub };
        return new Proxy({}, { get: () => stub });
    };
    runInNewContext(code, { module: compiledModule, exports: compiledModule.exports, require: dependencies, AbortController, console });
    const root = compiledModule.exports.default();
    const visible: string[] = [], machine: string[] = [];
    const walk = (node: unknown) => {
        if (node === null || node === undefined || typeof node === "boolean") return;
        if (typeof node === "string" || typeof node === "number") { visible.push(String(node)); return; }
        if (Array.isArray(node)) { node.forEach(walk); return; }
        const element = node as ElementNode;
        if (typeof element.type === "function") { walk((element.type as (props: unknown) => unknown)(element.props)); return; }
        if (element.props) {
            if (["input", "textarea"].includes(String(element.type)) && element.props.value !== undefined) machine.push(String(element.props.value));
            walk(element.props.children);
        }
    };
    walk(root);
    return { text: visible.join(" "), machine, hookValues };
}
const documentPath = paths[0];
const docResult = { documents: [{ _id: rawName, id: "9223372036854775807", n: "0.9999999999999999999" }], raw: rawJson, encoding: "Canonical Extended JSON", convertedNumbers: 2, truncated: true, details: { provider: rawName } };
const documentFixtures = [
    { engine: "mongodb", catalog: { kind: "databases", result: { names: [rawName], truncated: true } }, result: docResult },
    { engine: "mongodb", mongoMode: "aggregate", result: docResult, view: "table" },
    { engine: "firestore", firestore: { mode: "production", projectId: "fixture-project", databaseId: "(default)", token: "public-token", emulatorHost: "127.0.0.1", emulatorPort: 8080 }, fireMode: "query", result: docResult },
    { engine: "firestore", firestore: { mode: "emulator", projectId: "fixture-project", databaseId: "(default)", token: "", emulatorHost: "127.0.0.1", emulatorPort: 8080 }, result: docResult },
    { engine: "elasticsearch", elastic: { endpoint: "https://localhost:9200", allowHttp: false, authMode: "apiKey", username: "", password: "", token: "public-key" }, result: { ...docResult, details: { timedOut: true } } },
];
for (const language of LANGUAGES) {
    const documentDefault = render(documentPath, language.id);
    assert.ok(documentDefault.text.includes(translate(language.id, "MongoDB host")));
    for (const fixture of documentFixtures) {
        const page = render(documentPath, language.id, fixture);
        assert.ok(page.text.includes(rawName), `Provider names remain unchanged: ${language.id}`);
        assert.ok(page.text.includes("9223372036854775807"));
        assert.ok(page.text.includes("0.9999999999999999999"));
        assert.equal((page.hookValues.result as typeof docResult).raw, rawJson);
    }
    const redis = render(paths[1], language.id, { keys: [{ display: rawName, base64: "AAE=" }], scanned: true, inspection: { key: { display: rawName, base64: "AAE=" }, type: "string", ttlMilliseconds: "-1", truncated: true, nextCursor: "42", value: "9223372036854775807" }, write: true, result: { integer: "9223372036854775807" } });
    assert.ok(redis.text.includes(rawName));
    assert.ok(redis.text.includes(translate(language.id, "No expiry")));
    assert.ok(redis.text.includes("9223372036854775807"));
    assert.ok(redis.text.includes('["GET","name"]'), "Protocol examples are not translated");
    assert.ok(redis.machine.includes('["PING"]'));
    const s3 = render(paths[2], language.id, { bucket: "fixture-bucket", buckets: { buckets: [{ name: rawName }], truncated: true }, objects: { folders: [rawName], objects: [{ key: rawName, size: "9223372036854775807" }], truncated: true }, selectedKey: rawName, info: { userMetadata: { name: rawName } }, notice: { source: "Upload accepted: {key}, {bytes} bytes. Refresh the object list to see the current state.", values: { key: rawName, bytes: 4096 } } });
    assert.ok(s3.text.includes(rawName));
    assert.ok(s3.text.includes("9223372036854775807"));
    assert.ok(s3.text.includes(translate(language.id, "Upload accepted: {key}, {bytes} bytes. Refresh the object list to see the current state.", { key: rawName, bytes: 4096 })));
    assert.ok(s3.machine.includes(rawName));
}
console.log("Data-client translations: eight languages, authored copy/help/recoveries, placeholders, engine branches, LTR machine fields, exact provider values and locale-reactive status pass.");

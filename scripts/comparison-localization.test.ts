import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const nodeRequire = createRequire(resolve("package.json"));
const { LANGUAGES, SHARED_TRANSLATIONS, translate: catalogTranslate } = nodeRequire("./src/lib/i18n/catalog.ts");
const stagedRoot = process.env.COMPARISON_STAGE_ROOT;
const sourceRoot = stagedRoot ?? process.cwd();
const { COMPARISON_TRANSLATIONS } = nodeRequire(resolve(sourceRoot, "src/lib/i18n/comparisons.ts"));
const { getSeoContent } = nodeRequire("./src/lib/seo-content.ts");
const contractEngine = nodeRequire("./src/lib/openapi-contract.ts");
const authoredDiagnostics = nodeRequire("./src/lib/i18n/authored-diagnostics.ts");
const structuredData = nodeRequire("./src/lib/structured-data.ts");
type Language = "en" | "hi" | "es" | "fr" | "de" | "ja" | "zh" | "ar";
const translations = { ...SHARED_TRANSLATIONS, ...COMPARISON_TRANSLATIONS };
const translate = (language: Language, source: string, values?: Record<string, string | number>): string => {
    if (!stagedRoot) return catalogTranslate(language, source, values);
    const index = LANGUAGES.findIndex((item: { id: string }) => item.id === language) - 1;
    return (index < 0 ? source : translations[source]?.[index] ?? source).replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (match: string, key: string) => values && Object.hasOwn(values, key) ? String(values[key]) : match);
};
const ids = ["text-diff", "json-diff", "xml-diff", "csv-diff", "image-diff", "openapi-contract-diff"];
const placeholders = (text: string) => (text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(COMPARISON_TRANSLATIONS) as [string, string[]][]) {
    assert.equal(columns.length, 7, source);
    if (!stagedRoot) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog integration: ${source}`);
    columns.forEach((text, index) => {
        assert.ok(text.trim()); assert.notEqual(text, source, `Authored translation: ${source}`);
        assert.deepEqual(placeholders(text), placeholders(source), `Placeholders: ${source}`);
        assert.equal(translate(LANGUAGES[index + 1].id, source), text);
        for (const token of ["$ref", "RFC 4180", "Swagger 2.0", "OpenAPI 3.0", "XSLT"]) if (source.includes(token)) assert.ok(text.includes(token), `${source}: preserve ${token}`);
    });
}
// Locale dependencies may synchronize the translator ref, but must not re-run engines.
function assertLocaleEngineDependencies(file: ts.SourceFile) {
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && ["useEffect", "useMemo", "useCallback"].includes(node.expression.getText(file))) {
            const callback = node.arguments[0], deps = node.arguments[1];
            if (deps && ts.isArrayLiteralExpression(deps) && deps.elements.some((dep) => ts.isIdentifier(dep) && ["language", "direction", "locale", "t"].includes(dep.text))) {
                const statement = callback && ts.isArrowFunction(callback) && ts.isBlock(callback.body) && callback.body.statements.length === 1 ? callback.body.statements[0] : undefined;
                const assignment = statement && ts.isExpressionStatement(statement) && ts.isBinaryExpression(statement.expression) ? statement.expression : undefined;
                const onlyTranslatorSync = node.expression.getText(file) === "useEffect" && deps.elements.length === 1 && deps.elements[0].getText(file) === "t" && assignment?.operatorToken.kind === ts.SyntaxKind.EqualsToken && assignment.left.getText(file) === "translation.current" && assignment.right.getText(file) === "t";
                assert.ok(onlyTranslatorSync, `Locale-dependent engine callback: ${node.getText(file)}`);
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
}
const fixture = (source: string) => ts.createSourceFile("locale-fixture.ts", source, ts.ScriptTarget.Latest, true);
assertLocaleEngineDependencies(fixture("useEffect(() => { translation.current = t; }, [t]);"));
for (const source of ["useEffect(() => { translation.current = t; compare(); }, [t]);", "useEffect(() => compare(), [language]);", "useMemo(() => parse(source), [source, t]);", "useEffect(() => { output.current = t; }, [t]);"]) assert.throws(() => assertLocaleEngineDependencies(fixture(source)), /Locale-dependent engine callback/);
for (const id of ids) {
    for (const item of getSeoContent(id)?.faq ?? []) for (const source of [item.q, item.a]) {
        assert.ok(Object.hasOwn(translations, source), `${id} visible FAQ: ${source}`);
        for (const lang of LANGUAGES.slice(1)) assert.notEqual(translate(lang.id, source), source);
    }
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(resolve(sourceRoot, path), "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const copy = (text: string) => assert.ok(Object.hasOwn(translations, text), `${id} translated copy: ${text}`);
    const inspect = (node: ts.Node) => { if (ts.isStringLiteral(node)) copy(node.text); };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && /[\p{L}\p{N}]/u.test(node.text.trim())) assert.fail(`Untranslated JSX: ${id}: ${node.text.trim()}`);
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0]) inspect(node.arguments[0]);
        if (ts.isPropertyAssignment(node) && ["whatIs", "whyUse", "howToUse", "tips", "useCases"].includes(node.name.getText(file))) {
            const values = ts.isArrayLiteralExpression(node.initializer) ? node.initializer.elements : [node.initializer]; values.forEach(inspect);
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
    assert.match(source, /useLanguage\(\)/);
    assert.doesNotMatch(source, /key=\{(?:language|direction|locale)\}/);
    assertLocaleEngineDependencies(file);
    assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|Worker)\b/);
}

// Real route callbacks and CSV/OpenAPI processing, persistent hook state, and dependency counters.
// FileReader, browser image decoding and canvas are exact-input boundary doubles, not a browser test.
type Element = { type: unknown; props: Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any
function elements(node: unknown): Element[] {
    if (Array.isArray(node)) return node.flatMap(elements);
    if (!node || typeof node !== "object" || !("props" in node)) return [];
    const item = node as Element; return [item, ...Object.values(item.props).flatMap(elements)];
}
function byType(tree: Element, type: string) { return elements(tree).filter((item) => item.type === type); }
function visible(node: unknown): string {
    if (node === undefined || node === null || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(visible).join(" ");
    const props = (node as Element).props; return props ? [props.title, props.description, props.children].map(visible).join(" ") : "";
}
type ImageFile = { name: string; bytes: Uint8Array; rgba: number[]; w: number; h: number; failure?: "read" | "decode" };
function harness(id: string) {
    const hooks: unknown[] = [], stateIndices: number[] = []; let cursor = 0, dirty = false, language: Language = "en";
    const effects: (() => void)[] = [], copied: string[] = [], messages: { kind: string; value: unknown }[] = [];
    const activity = { memo: 0, effect: 0, parse: 0, contract: 0, read: 0, decode: 0, draw: 0, pixels: 0, worker: 0, translationSync: 0 };
    const reads: { name: string; bytes: number[] }[] = [], images = new Map<string, ImageFile>(), imageFiles: ImageFile[] = [];
    const translators = new Map<Language, (source: string, values?: Record<string, string | number>) => string>();
    for (const entry of LANGUAGES) { const locale = entry.id as Language; translators.set(locale, (source, values) => translate(locale, source, values)); }
    const draws: { source: string; coordinates: number[]; alpha: number }[] = [];
    const depsEqual = (a: unknown[], b: unknown[]) => a.length === b.length && a.every((item, index) => Object.is(item, b[index]));
    let shared: ((value: Record<string, unknown>) => void) | undefined;
    class BrowserImage {
        onload?: () => void; onerror?: () => void; naturalWidth = 0; naturalHeight = 0; fixture?: ImageFile; private url = "";
        get src() { return this.url; }
        set src(value: string) {
            activity.decode++; this.url = value; this.fixture = images.get(value)!;
            if (this.fixture.failure === "decode") { this.onerror?.(); return; }
            this.naturalWidth = this.fixture.w; this.naturalHeight = this.fixture.h; this.onload?.();
        }
    }
    class FileReader {
        result = ""; onload?: () => void; onerror?: () => void;
        readAsDataURL(file: ImageFile) {
            activity.read++; imageFiles.push(file); reads.push({ name: file.name, bytes: [...file.bytes] });
            if (file.failure === "read") { this.onerror?.(); return; }
            this.result = `data:image/mock;base64,${Buffer.from(file.bytes).toString("base64")}`;
            images.set(this.result, file); this.onload?.();
        }
    }
    class Canvas {
        width = 0; height = 0; output: number[] = []; source?: BrowserImage;
        getContext() {
            const recordDraw = (image: BrowserImage, coordinates: number[], alpha: number) => { activity.draw++; this.source = image; draws.push({ source: image.src, coordinates, alpha }); };
            return {
                globalAlpha: 1, fillStyle: "", clearRect: () => { this.output = []; }, fillRect: () => {},
                drawImage(image: BrowserImage, ...coordinates: number[]) { recordDraw(image, coordinates, this.globalAlpha); },
                getImageData: () => { activity.pixels++; return { data: new Uint8ClampedArray(this.source!.fixture!.rgba) }; },
                createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }),
                putImageData: (image: { data: Uint8ClampedArray }) => { this.output = [...image.data]; },
            };
        }
    }
    const canvas = new Canvas();
    const react = {
        useState(initial: unknown) {
            const index = cursor++;
            if (!(index in hooks)) { hooks[index] = typeof initial === "function" ? (initial as () => unknown)() : initial; stateIndices.push(index); }
            return [hooks[index], (next: unknown) => {
                const value = typeof next === "function" ? (next as (value: unknown) => unknown)(hooks[index]) : next;
                if (!Object.is(value, hooks[index])) { hooks[index] = value; dirty = true; }
            }];
        },
        useRef: (initial: unknown) => { const index = cursor++; if (!(index in hooks)) hooks[index] = { current: initial === null ? canvas : initial }; return hooks[index]; },
        useMemo(compute: () => unknown, dependencies: unknown[]) {
            const index = cursor++, previous = hooks[index] as { value: unknown; deps: unknown[] } | undefined;
            if (!previous || !depsEqual(previous.deps, dependencies)) { activity.memo++; hooks[index] = { value: compute(), deps: [...dependencies] }; }
            return (hooks[index] as { value: unknown }).value;
        },
        useEffect(effect: () => void, dependencies: unknown[]) {
            const index = cursor++, previous = hooks[index] as unknown[] | undefined;
            if (!previous || !depsEqual(previous, dependencies)) { hooks[index] = [...dependencies]; effects.push(() => { if (dependencies.length === 1 && [...translators.values()].some((translator) => translator === dependencies[0])) activity.translationSync++; else activity.effect++; effect(); }); }
        },
    };
    const stub = () => null;
    const dependencies = (name: string): unknown => {
        if (name === "react") return react;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => { const active = language; return { language: active, direction: active === "ar" ? "rtl" : "ltr", t: translators.get(active)! }; } };
        if (name.endsWith("authored-diagnostics")) return authoredDiagnostics;
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copied.push(value); return true; } };
        if (name.endsWith("shareable-state")) return { useShareableState: (_schema: unknown, callback: typeof shared) => { shared = callback; } };
        if (name.endsWith("structured-data")) return { ...structuredData, parseStructuredData: (source: string) => { activity.parse++; return structuredData.parseStructuredData(source); } };
        if (name.endsWith("openapi-contract")) return { ...contractEngine, compareOpenApiContracts: (left: unknown, right: unknown) => { activity.contract++; return contractEngine.compareOpenApiContracts(left, right); } };
        if (name === "antd") return {
            Card: "card", Input: { TextArea: "textarea" }, Typography: { Text: "text" }, Upload: { Dragger: "dragger" }, Radio: { Group: "radio" },
            Row: "row", Col: "col", Button: "button", Space: "space", Alert: "alert", Tag: "tag", Empty: "empty", Select: "select", Slider: "slider",
            App: { useApp: () => ({ message: { success: (value: unknown) => messages.push({ kind: "success", value }), error: (value: unknown) => messages.push({ kind: "error", value }) } }) },
        };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => stub });
        if (name.endsWith("CodeEditor")) return { CodeEditor: "editor", CodeDiff: "code-diff" };
        if (name.startsWith("@/components/")) return { __esModule: true, default: name.split("/").at(-1) };
        return nodeRequire(name);
    };
    const record = { exports: {} as { default: () => Element } };
    const source = readFileSync(resolve(sourceRoot, `src/app/tools/${id}/page.tsx`), "utf8");
    const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: record, exports: record.exports, require: dependencies, Error, String, Intl, Uint8ClampedArray, FileReader, Image: BrowserImage, document: { createElement: (type: string) => { assert.equal(type, "canvas"); return new Canvas(); } }, console });
    return {
        render() { let tree: Element, passes = 0; do { dirty = false; cursor = 0; tree = record.exports.default(); while (effects.length) effects.shift()!(); assert.ok(++passes < 8); } while (dirty); return tree!; },
        language: (value: Language) => { language = value; }, share: (value: Record<string, unknown>) => shared?.(value),
        state: () => stateIndices.map((index) => hooks[index]), copied, activity, messages, reads, imageFiles, draws, canvas,
    };
}
function button(h: ReturnType<typeof harness>, source: string, language: Language = "en", index = 0) {
    const result = byType(h.render(), "button").filter((item) => visible(item.props.children).trim() === translate(language, source))[index];
    assert.ok(result, `Button ${source} (${language})`); return result;
}
function edit(h: ReturnType<typeof harness>, value: string, index = 0, type = "textarea") { byType(h.render(), type)[index].props.onChange(type === "editor" ? value : { target: { value } }); return h.render(); }
function snapshot(h: ReturnType<typeof harness>) {
    const tree = h.render();
    return {
        states: JSON.stringify(h.state()), editors: byType(tree, "editor").map((item) => [item.props.value, item.props.language]),
        diff: byType(tree, "code-diff").map((item) => [item.props.original, item.props.modified, item.props.language]),
        textareas: byType(tree, "textarea").map((item) => item.props.value), selects: byType(tree, "select").map((item) => [item.props.value, item.props.options.map((option: { value: unknown }) => option.value)]),
        radios: byType(tree, "radio").map((item) => [item.props.value, item.props.options.map((option: { value: unknown }) => option.value)]),
        sliders: byType(tree, "slider").map((item) => item.props.value), shares: elements(tree).filter((item) => item.type === "ShareButton").map((item) => item.props.getState()),
        canvas: [h.canvas.width, h.canvas.height, [...h.canvas.output]],
    };
}
function localeMatrix(h: ReturnType<typeof harness>, title: string) {
    const before = snapshot(h);
    const engineActivity = () => Object.fromEntries(Object.entries(h.activity).filter(([key]) => key !== "translationSync"));
    const activity = engineActivity(), syncBefore = h.activity.translationSync;
    for (const lang of LANGUAGES) {
        h.language(lang.id); const tree = h.render();
        assert.equal(tree.props.title, translate(lang.id, title));
        assert.deepEqual(snapshot(h), before, `${title}: ${lang.id} preserves drafts/options/results/files`);
        assert.deepEqual(engineActivity(), activity, `${title}: ${lang.id} does not reprocess or read files`);
        for (const item of byType(tree, "textarea")) { assert.equal(item.props.dir, "ltr"); assert.equal(item.props.styles.textarea.direction, "ltr"); assert.equal(item.props.styles.textarea.textAlign, "left"); }
        for (const item of byType(tree, "select")) { assert.equal(item.props.dir, undefined, "AntD Select has no dir prop"); assert.equal(item.props.styles.input.direction, "ltr"); }
    }
    assert.ok(h.activity.translationSync - syncBefore <= LANGUAGES.length, "Only one translator synchronization per changed locale");
    h.language("en");
}
async function main() {
    for (const id of ["text-diff", "json-diff", "xml-diff"]) {
        const h = harness(id), title = id === "text-diff" ? "Text Diff" : id === "json-diff" ? "JSON Diff" : "XML Diff";
        h.render();
        const left = id === "json-diff" ? '{"n":9223372036854775807,"text":"日本語 العربية"}' : id === "xml-diff" ? '<root id="01">日本語 العربية &amp; 0.9999999999999999999</root>' : "原文 العربية\r\n0.9999999999999999999\n";
        const right = `${left}\nchanged 日本語 العربية`;
        edit(h, left, 0, "editor"); edit(h, right, 1, "editor"); localeMatrix(h, title);
        for (const lang of LANGUAGES) {
            h.language(lang.id); button(h, "Compare", lang.id).props.onClick();
            const result = byType(h.render(), "code-diff")[0];
            assert.equal(result.props.original, left); assert.equal(result.props.modified, right);
            assert.equal(result.props.language, id === "text-diff" ? "plaintext" : id === "json-diff" ? "json" : "xml");
            localeMatrix(h, title); h.language(lang.id); button(h, "Edit", lang.id).props.onClick();
            assert.equal(byType(h.render(), "editor")[0].props.value, left); assert.equal(byType(h.render(), "editor")[1].props.value, right);
        }
        h.language("en"); const bridge = elements(h.render()).find((item) => item.type === "ToolBridgeBanner")!;
        bridge.props.onAccept({ data: left + " bridge" }); assert.equal(byType(h.render(), "editor")[0].props.value, left + " bridge");
        h.share({ left, right }); assert.equal(byType(h.render(), "editor")[0].props.value, left); localeMatrix(h, title);
        button(h, "Clear").props.onClick(); assert.deepEqual(byType(h.render(), "editor").map((item) => item.props.value), ["", ""]); localeMatrix(h, title);
    }

    const csv = harness("csv-diff"); csv.render();
    const leftCsv = 'id,name,note\r\n1,Ada,"日本語,\nالعربية"\r\n2,Bob,old\r\n3,Cora,stable';
    const rightCsv = 'id,name,note\n3,Cora,stable\n1,Ada,0.9999999999999999999\n4,Dan,"new ""quoted"""';
    edit(csv, leftCsv); edit(csv, rightCsv, 1);
    const parsedRows = byType(csv.render(), "tr").slice(1);
    assert.equal(parsedRows.length, 4);
    assert.deepEqual(byType(csv.render(), "tag").slice(2, 6).map((item) => visible(item.props.children).trim().replace(/\s*:\s*/g, ": ")), ["Added: 1", "Removed: 1", "Modified: 1", "Unchanged: 1"]);
    const expectedReport = '# CSV Diff Report — key=id\n\n[MODIFIED] 1\n  note: 日本語,\nالعربية → 0.9999999999999999999\n[ADDED] 4\n[REMOVED] 2';
    localeMatrix(csv, "CSV Diff");
    for (const lang of LANGUAGES) {
        csv.language(lang.id);
        for (const label of ["Added", "Removed", "Modified", "Unchanged"]) assert.ok(visible(csv.render()).includes(translate(lang.id, label)));
        await button(csv, "Copy report", lang.id).props.onClick();
        assert.equal(csv.copied.at(-1), expectedReport, `${lang.id} report bytes`);
        assert.equal(csv.messages.at(-1)?.value, translate(lang.id, "Report copied"));
    }
    csv.language("en"); byType(csv.render(), "select")[0].props.onChange(1);
    assert.equal(byType(csv.render(), "select")[0].props.value, 1); localeMatrix(csv, "CSV Diff");
    csv.share({ leftText: leftCsv, rightText: rightCsv, keyCol: 0 }); localeMatrix(csv, "CSV Diff");
    await button(csv, "Copy report").props.onClick(); assert.equal(csv.copied.at(-1), expectedReport);
    elements(csv.render()).find((item) => item.type === "ToolBridgeBanner")!.props.onAccept({ data: "id,value\n1,bridge" });
    assert.equal(byType(csv.render(), "textarea")[0].props.value, "id,value\n1,bridge");
    edit(csv, ""); edit(csv, "", 1); assert.equal(byType(csv.render(), "empty").length, 1); localeMatrix(csv, "CSV Diff");

    // Contract fixture also used by scripts/contract-tools.test.ts; actual compatibility engine runs here.
    const before = { openapi: "3.1.0", paths: { "/users": { get: { responses: { 200: {} } } } }, components: { schemas: { User: { required: ["id"] } } } };
    const after = { openapi: "3.1.0", paths: { "/users": { get: { parameters: [{ name: "tenant", in: "query", required: true }], responses: {} } } }, components: { schemas: { User: { required: ["id", "email"] } } } };
    const api = harness("openapi-contract-diff"); api.render();
    const beforeSource = JSON.stringify(before), afterSource = JSON.stringify(after);
    edit(api, beforeSource); edit(api, afterSource, 1);
    const expectedChanges = contractEngine.compareOpenApiContracts(before, after);
    assert.ok(expectedChanges.some((change: { message: string }) => change.message.includes("Response 200 was removed")));
    for (const lang of LANGUAGES) {
        api.language(lang.id); button(api, "Compare contracts", lang.id).props.onClick();
        assert.deepEqual(JSON.parse(JSON.stringify(api.state()[2])), expectedChanges);
        assert.ok(visible(api.render()).includes(translate(lang.id, "Breaking")));
        for (const change of expectedChanges) {
            assert.ok(visible(api.render()).includes(change.location)); assert.ok(visible(api.render()).includes(change.message));
        }
        localeMatrix(api, "OpenAPI Contract Diff");
    }
    assert.equal(api.activity.contract, 8); assert.equal(api.activity.parse, 16);
    api.language("en"); edit(api, "{}"); button(api, "Compare contracts").props.onClick();
    const diagnostic = 'Baseline: Expected an OpenAPI `openapi` or Swagger `swagger` version field.. Candidate: valid.';
    assert.ok(visible(api.messages.at(-1)?.value).includes(diagnostic));
    assert.equal(elements(api.messages.at(-1)?.value).find((item) => item.type === "bdi")?.props.dir, "ltr");
    assert.deepEqual(JSON.parse(JSON.stringify(api.state()[2])), expectedChanges, "Failed comparison preserves last findings");
    localeMatrix(api, "OpenAPI Contract Diff");
    for (const lang of LANGUAGES) { api.language(lang.id); button(api, "Compare contracts", lang.id).props.onClick(); assert.ok(visible(api.messages.at(-1)?.value).includes(diagnostic)); assert.ok(visible(api.messages.at(-1)?.value).includes(translate(lang.id, "Unable to compare these contracts."))); }
    api.language("en"); edit(api, beforeSource); edit(api, beforeSource, 1); button(api, "Compare contracts").props.onClick();
    assert.equal(byType(api.render(), "alert")[0].props.title, "No compatibility findings in evaluated rules"); localeMatrix(api, "OpenAPI Contract Diff");
    button(api, "Reset example").props.onClick(); assert.equal(api.state()[2], null); localeMatrix(api, "OpenAPI Contract Diff");

    const image = harness("image-diff"); image.render(); localeMatrix(image, "Image Diff");
    const fileA: ImageFile = { name: "原本 العربية.png", bytes: Uint8Array.from([0, 255, 42, 17]), w: 2, h: 1, rgba: [10, 20, 30, 255, 100, 110, 120, 255] };
    const fileB: ImageFile = { name: "変更 العربية.png", bytes: Uint8Array.from([0, 255, 42, 18]), w: 2, h: 1, rgba: [10, 20, 30, 255, 120, 110, 120, 255] };
    for (const lang of LANGUAGES) {
        const localizedImage = harness("image-diff"); localizedImage.language(lang.id); localizedImage.render();
        await byType(localizedImage.render(), "dragger")[0].props.beforeUpload(fileA); localizedImage.render();
        await byType(localizedImage.render(), "dragger")[0].props.beforeUpload(fileB); localizedImage.render();
        assert.deepEqual(localizedImage.reads, [fileA, fileB].map((file) => ({ name: file.name, bytes: [...file.bytes] })));
        assert.deepEqual(localizedImage.canvas.output, [20, 20, 20, 64, 255, 0, 0, 255]);
        assert.equal(localizedImage.imageFiles[0], fileA); assert.equal(localizedImage.imageFiles[1], fileB);
        assert.equal(localizedImage.messages.length, 0); localeMatrix(localizedImage, "Image Diff");
        assert.equal(localizedImage.activity.read, 2); assert.equal(localizedImage.activity.decode, 2);
    }
    assert.equal(await byType(image.render(), "dragger")[0].props.beforeUpload(fileA), false); image.render();
    assert.equal(await byType(image.render(), "dragger")[0].props.beforeUpload(fileB), false); image.render();
    assert.deepEqual(image.reads, [fileA, fileB].map((file) => ({ name: file.name, bytes: [...file.bytes] })));
    assert.equal(image.imageFiles[0], fileA, "Exact browser File boundary identity"); assert.equal(image.imageFiles[1], fileB);
    assert.deepEqual(image.canvas.output, [20, 20, 20, 64, 255, 0, 0, 255]);
    assert.deepEqual(JSON.parse(JSON.stringify(image.state()[5])), { totalPixels: 2, diffPixels: 1 });
    localeMatrix(image, "Image Diff"); assert.equal(image.activity.read, 2); assert.equal(image.activity.decode, 2);
    for (const lang of LANGUAGES) {
        image.language(lang.id); const options = byType(image.render(), "radio")[0].props.options as { value: string; label: string }[];
        assert.deepEqual(Array.from(options).map((item: { value: string }) => item.value), ["side-by-side", "overlay", "difference"]);
        assert.deepEqual(Array.from(options).map((item: { label: string }) => item.label), ["Side-by-side", "Overlay", "Difference"].map((label) => translate(lang.id, label)));
        button(image, "Swap", lang.id).props.onClick(); image.render();
        assert.equal(image.state()[0] && (image.state()[0] as { name: string }).name, lang.id === "en" || lang.id === "es" || lang.id === "de" || lang.id === "zh" ? fileB.name : fileA.name);
        localeMatrix(image, "Image Diff");
    }
    byType(image.render(), "slider")[0].props.onChange(64); image.render();
    assert.deepEqual(JSON.parse(JSON.stringify(image.state()[5])), { totalPixels: 2, diffPixels: 0 }); localeMatrix(image, "Image Diff");
    byType(image.render(), "radio")[0].props.onChange({ target: { value: "overlay" } }); image.render();
    byType(image.render(), "slider")[0].props.onChange(37); image.render(); assert.equal(image.draws.at(-1)?.alpha, 0.37); localeMatrix(image, "Image Diff");
    byType(image.render(), "radio")[0].props.onChange({ target: { value: "side-by-side" } }); image.render();
    assert.equal(image.canvas.width, 8); assert.equal(image.canvas.height, 1); assert.equal(image.state()[5], null); localeMatrix(image, "Image Diff");
    button(image, "Remove").props.onClick(); image.render(); localeMatrix(image, "Image Diff");
    for (const lang of LANGUAGES) {
        image.language(lang.id);
        const failure: ImageFile = { ...fileA, name: `failed-${lang.id}.png`, bytes: Uint8Array.from([11, LANGUAGES.findIndex((item: { id: string }) => item.id === lang.id)]), failure: lang.id === "en" ? "read" : "decode" };
        assert.equal(await byType(image.render(), "dragger")[0].props.beforeUpload(failure), false);
        const message = image.messages.at(-1)!; assert.equal(message.kind, "error");
        assert.ok(visible(message.value).includes(translate(lang.id, "Image could not be loaded.")));
        assert.ok(visible(message.value).includes(translate(lang.id, lang.id === "en" ? "Could not read file" : "Could not decode image")));
        assert.equal(elements(message.value).find((item) => item.type === "bdi")?.props.dir, "auto");
    }
    localeMatrix(image, "Image Diff"); assert.equal(image.activity.worker, 0, "Existing implementation remains canvas based");
    console.log("Comparison localization: six routes and eight authored languages pass copy/placeholder/FAQ coverage, real callbacks, state/memo/effect counters, unchanged drafts/options/reports/findings, exact Unicode/precision source, share/bridge/reset, contract fixtures and modeled image file/pixel boundaries. Browser file delivery, image decoding/canvas and Monaco lifecycle remain unverified by this Node suite.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

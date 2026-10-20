import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import ExcelJS from "exceljs";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { FILE_CONVERSION_TRANSLATIONS, isFileConversionMessage } from "../src/lib/i18n/file-conversions";
import * as binary from "../src/lib/binary-base64";
import * as spreadsheet from "../src/lib/spreadsheet-conversion";
import * as grid from "../src/lib/spreadsheet-grid";
import * as table from "../src/lib/table-export";
import { getSeoContent } from "../src/lib/seo-content";

const placeholders = (text: string) => (text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(FILE_CONVERSION_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog integration: ${source}`);
    for (const [index, text] of columns.entries()) {
        assert.ok(text.trim(), source);
        assert.notEqual(text, source, `Authored translation: ${source}`);
        assert.deepEqual(placeholders(text), placeholders(source));
        assert.equal(translate(LANGUAGES[index + 1].id, source), text);
    }
}
const paths = ["src/components/SpreadsheetConverter.tsx", "src/components/BinaryBase64.tsx", "src/app/tools/base64/page.tsx"];
// ToolPageLayout also renders FAQ copy supplied outside the parent page.
for (const item of getSeoContent("base64")?.faq ?? []) {
    for (const source of [item.q, item.a]) {
        assert.ok(Object.hasOwn(FILE_CONVERSION_TRANSLATIONS, source), `Visible Base64 FAQ: ${source}`);
        for (const language of LANGUAGES.slice(1)) assert.notEqual(translate(language.id, source), source);
    }
}
for (const path of paths) {
    const source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const copy = (text: string) => assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, text), `${path}: ${text}`);
    const inspect = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) copy(node.text);
        if (ts.isConditionalExpression(node)) { inspect(node.whenTrue); inspect(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node)) assert.equal(node.text.trim(), "", `Untranslated JSX: ${path}: ${node.text}`);
        if (ts.isCallExpression(node) && ["t", "setError"].includes(node.expression.getText(file)) && node.arguments[0]) {
            const arg = node.arguments[0];
            if (!(ts.isStringLiteral(arg) && arg.text === "")) inspect(arg);
        }
        if (ts.isNewExpression(node) && node.expression.getText(file) === "Error" && node.arguments?.[0]) inspect(node.arguments[0]);
        if (ts.isPropertyAssignment(node) && ["whatIs", "whyUse", "howToUse", "tips", "useCases"].includes(node.name.getText(file))) {
            const values = ts.isArrayLiteralExpression(node.initializer) ? node.initializer.elements : [node.initializer];
            values.forEach(inspect);
        }
        if (ts.isJsxAttribute(node) && ["title", "description", "placeholder", "aria-label"].includes(node.name.getText(file)) && node.initializer) inspect(node.initializer);
        ts.forEachChild(node, visit);
    };
    visit(file);
    assert.match(source, /useLanguage\(\)/);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
}
// Every stable engine error/warning displayed by these controls has authored copy.
for (const path of ["src/lib/binary-base64.ts", "src/lib/spreadsheet-conversion.ts", "src/lib/spreadsheet-grid.ts"]) {
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
    const visit = (node: ts.Node) => {
        const isError = ts.isNewExpression(node) && node.expression.getText(file) === "Error";
        const isWarning = ts.isCallExpression(node) && node.expression.getText(file) === "warnings.add";
        if (isError || isWarning) {
            const arg = node.arguments?.[0];
            if (arg && ts.isStringLiteral(arg)) assert.ok(isFileConversionMessage(arg.text), `${path}: ${arg.text}`);
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
}

const nodeRequire = createRequire(`${process.cwd()}/package.json`);
type Element = { type: unknown; props: Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any
function elements(node: unknown): Element[] {
    if (Array.isArray(node)) return node.flatMap(elements);
    if (!node || typeof node !== "object" || !("props" in node)) return [];
    const item = node as Element;
    return [item, ...elements(item.props.children)];
}
function byType(tree: Element, type: string) { return elements(tree).filter((item) => item.type === type); }
function visible(node: unknown): string {
    if (node === undefined || node === null || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(visible).join(" ");
    return visible((node as Element).props?.children);
}
function harness(path: string) {
    const hooks: unknown[] = []; let cursor = 0, language: Language = "en";
    let copied = "", workerFailure = false, workerTimeout = false;
    const timers: (() => void)[] = [];
    const downloads: { bytes?: Uint8Array; text?: string; name: string; mime?: string }[] = [];
    const workerInputs: Record<string, unknown>[] = [];
    let shared: ((value: { input: string; mode: string }) => void) | undefined;
    class WorkerMock {
        onmessage?: (event: { data: unknown }) => void;
        onerror?: () => void;
        terminated = false;
        terminate() { this.terminated = true; }
        async postMessage(input: Record<string, unknown>) {
            workerInputs.push(input);
            if (workerTimeout) { timers.at(-1)?.(); return; }
            if (workerFailure) { this.onerror?.(); return; }
            try {
                const value = input.operation === "read" ? await spreadsheet.readSpreadsheet(input.bytes as Uint8Array) : await spreadsheet.writeSpreadsheet(grid.jsonToSpreadsheetRows(input.json as string), input.name as string);
                if (!this.terminated) this.onmessage?.({ data: { value } });
            } catch (cause) { this.onmessage?.({ data: { error: cause instanceof Error ? cause.message : String(cause) } }); }
        }
    }
    const stub = () => null;
    const Input = Object.assign("input", { TextArea: "textarea" });
    const dependencies = (name: string): unknown => {
        if (name === "react") return {
            useState: (initial: unknown) => { const index = cursor++; if (!(index in hooks)) hooks[index] = initial; return [hooks[index], (next: unknown) => { hooks[index] = typeof next === "function" ? (next as (value: unknown) => unknown)(hooks[index]) : next; }]; },
            useRef: (current: unknown) => { const index = cursor++; if (!(index in hooks)) hooks[index] = { current }; return hooks[index]; },
            useMemo: (compute: () => unknown) => compute(), useEffect: stub,
        };
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (source: string, params?: Record<string, string | number>) => translate(language, source, params) }) };
        if (name.endsWith("i18n/file-conversions")) return { isFileConversionMessage };
        if (name.endsWith("binary-base64")) return binary;
        if (name.endsWith("spreadsheet-grid")) return grid;
        if (name.endsWith("table-export")) return table;
        if (name.endsWith("clipboard")) return { copyToClipboard: async (text: string) => { copied = text; return true; } };
        if (name.endsWith("download")) return { downloadBytes: (bytes: Uint8Array, name: string, mime?: string) => downloads.push({ bytes, name, mime }), downloadText: (text: string, name: string, mime?: string) => downloads.push({ text, name, mime }) };
        if (name === "antd") return { Button: "button", Card: "card", Space: "space", Segmented: "segmented", Input };
        if (name === "@ant-design/icons") return { SwapOutlined: stub, CopyOutlined: stub, ClearOutlined: stub };
        if (name.endsWith("shareable-state")) return { useShareableState: (_schema: unknown, callback: typeof shared) => { shared = callback; } };
        if (name.startsWith("@/components/")) return { __esModule: true, default: name.split("/").at(-1) };
        return nodeRequire(name);
    };
    const record = { exports: {} as { default: (props: Record<string, unknown>) => Element } };
    const source = readFileSync(path, "utf8").replace(/import\.meta\.url/g, '"file:///test/SpreadsheetConverter.tsx"');
    const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: record, exports: record.exports, require: dependencies, Error, Uint8Array, URL, Worker: WorkerMock, setTimeout: (callback: () => void) => { timers.push(callback); return timers.length; }, clearTimeout: stub, btoa, atob, escape, unescape, encodeURIComponent, decodeURIComponent });
    return { render: (props: Record<string, unknown> = {}) => { cursor = 0; return record.exports.default(props); }, language: (next: Language) => { language = next; }, copied: () => copied, downloads, workerInputs, failWorker: (timeout = false) => { workerFailure = !timeout; workerTimeout = timeout; }, share: (value: { input: string; mode: string }) => shared?.(value) };
}
const event = (value: string | boolean) => ({ target: { value, checked: value } });
const rawName = "日本語 العربية", rawJson = '[["id","formula","n"],["9223372036854775807","=1+2","0.9999999999999999999"]]';
const bytes = new Uint8Array([0, 255, 128, 10, 13, 42]);
const fileEvent = (data: Uint8Array, name = rawName, type = "image/png") => ({ target: { files: [{ name, type, size: data.length, arrayBuffer: async () => data.buffer }], value: "file" } });
function click(h: ReturnType<typeof harness>, source: string, lang: Language = "en", props: Record<string, unknown> = {}) {
    const found = byType(h.render(props), "button").find((item) => visible(item.props.children) === translate(lang, source));
    assert.ok(found, source); return found.props.onClick();
}

async function main() {
    const b = harness(paths[1]);
    await byType(b.render(), "input")[0].props.onChange(fileEvent(bytes));
    const encoded = binary.encodeBinaryBase64(bytes, "image/png", true);
    for (const lang of LANGUAGES) {
        b.language(lang.id); const tree = b.render();
        assert.equal(byType(tree, "textarea")[0].props.value, encoded);
        assert.equal(byType(tree, "textarea")[0].props.dir, "ltr");
        assert.equal(byType(tree, "input")[1].props.value, "image/png");
        assert.equal(byType(tree, "input")[2].props.value, rawName);
        assert.equal(byType(tree, "input")[2].props.dir, "auto");
        assert.ok(visible(tree).includes(translate(lang.id, lang.id === "en" ? "{bytes} bytes encoded locally." : "{bytes} bytes decoded.", { bytes: bytes.length.toLocaleString(lang.id) })));
        await click(b, "Copy binary Base64", lang.id); assert.equal(b.copied(), encoded);
        click(b, "Download encoded text", lang.id); assert.equal(b.downloads.at(-1)?.text, encoded);
        click(b, "Decode and download file", lang.id);
        const output = b.downloads.at(-1)!;
        assert.deepEqual(output.bytes, bytes); assert.equal(output.name, rawName); assert.equal(output.mime, "image/png");
    }
    b.language("en");
    byType(b.render(), "input")[3].props.onChange(event(false));
    assert.equal(byType(b.render(), "textarea")[0].props.value, binary.encodeBinaryBase64(bytes, "image/png", false));
    byType(b.render(), "textarea")[0].props.onChange(event("Zh=="));
    click(b, "Decode and download file");
    for (const lang of LANGUAGES) {
        b.language(lang.id); assert.ok(visible(b.render()).includes(translate(lang.id, "Invalid or noncanonical Base64 padding bits.")));
        assert.equal(byType(b.render(), "textarea")[0].props.value, "Zh==");
    }
    const diagnostic = "Platform Δ العربية <raw>";
    await byType(b.render(), "input")[0].props.onChange({ target: { files: [{ size: 4, name: rawName, type: "image/png", arrayBuffer: async () => { throw new Error(diagnostic); } }], value: "file" } });
    for (const lang of LANGUAGES) { b.language(lang.id); const tree = b.render(); assert.ok(visible(tree).includes(translate(lang.id, "File conversion diagnostic:"))); assert.equal(visible(byType(tree, "bdi")[0]), diagnostic); }
    b.language("en"); click(b, "Clear binary input"); assert.equal(byType(b.render(), "textarea")[0].props.value, "");

    // Deferred actual File callbacks must not overwrite a replacement or Clear.
    for (const lang of LANGUAGES) {
        const race = harness(paths[1]); race.language(lang.id);
        const start = (name: string, type: string, pending: Promise<ArrayBuffer>, size = 3) => byType(race.render(), "input")[0].props.onChange({ target: { value: "file", files: [{ name, type, size, arrayBuffer: () => pending }] } });
        let resolveFirst!: (value: ArrayBuffer) => void;
        const first = start("old.bin", "application/octet-stream", new Promise<ArrayBuffer>((resolve) => { resolveFirst = resolve; }));
        const busy = race.render();
        assert.equal(byType(busy, "textarea")[0].props.disabled, true);
        for (const control of byType(busy, "input").slice(1)) assert.equal(control.props.disabled, true);
        assert.ok(visible(busy).includes(translate(lang.id, "Processing…")));
        const latest = new Uint8Array([3, 2, 1]);
        await start("latest.png", "image/png", Promise.resolve(latest.buffer));
        resolveFirst(new Uint8Array([9, 9, 9]).buffer); await first;
        let tree = race.render();
        assert.equal(byType(tree, "textarea")[0].props.value, binary.encodeBinaryBase64(latest, "image/png", true));
        assert.equal(byType(tree, "input")[1].props.value, "image/png");
        assert.equal(byType(tree, "input")[2].props.value, "latest.png");
        let rejectCleared!: (error: Error) => void;
        const cleared = start("cleared.bin", "application/octet-stream", new Promise<ArrayBuffer>((_resolve, reject) => { rejectCleared = reject; }));
        click(race, "Clear binary input", lang.id);
        rejectCleared(new Error("stale failure")); await cleared;
        tree = race.render();
        assert.equal(byType(tree, "textarea")[0].props.value, "");
        assert.equal(byType(tree, "textarea")[0].props.disabled, false);
        assert.ok(!visible(tree).includes("stale failure"));
        let resolveStale!: (value: ArrayBuffer) => void;
        const stale = start("stale.bin", "application/octet-stream", new Promise<ArrayBuffer>((resolve) => { resolveStale = resolve; }));
        await start("oversized.bin", "application/octet-stream", Promise.resolve(latest.buffer), binary.MAX_BINARY_BYTES + 1);
        resolveStale(latest.buffer); await stale;
        tree = race.render();
        assert.equal(byType(tree, "textarea")[0].props.value, "");
        assert.ok(visible(tree).includes(translate(lang.id, "File limit is 8 MiB.")));
        assert.equal(byType(tree, "textarea")[0].props.disabled, false);
    }

    // Real XLSX buffers travel through mocked File/Worker/download handlers.
    // This verifies transformations and arguments, not browser file delivery.
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(rawName); sheet.addRows(JSON.parse(rawJson));
    sheet.getCell("D1").value = "cached"; sheet.getCell("D2").value = { formula: "1+2", result: 3 };
    sheet.getCell("E1").value = "link"; sheet.getCell("E2").value = { text: rawName, hyperlink: "https://example.test" };
    const duplicate = workbook.addWorksheet("duplicate"); duplicate.addRows([["x", "x"], [1, 2]]);
    const xlsx = new Uint8Array(await workbook.xlsx.writeBuffer());
    const s = harness(paths[0]); let imported = "";
    const props = { onImportJson: (value: string) => { imported = value; } };
    await byType(s.render(props), "input")[0].props.onChange(fileEvent(xlsx));
    const importedJson = byType(s.render(props), "textarea")[0].props.value;
    assert.ok(importedJson.includes("9223372036854775807")); assert.ok(importedJson.includes("0.9999999999999999999")); assert.ok(importedJson.includes("=1+2"));
    for (const lang of LANGUAGES) {
        s.language(lang.id); const tree = s.render(props);
        assert.equal(byType(tree, "textarea")[0].props.value, importedJson);
        assert.equal(byType(tree, "select")[0].props.value, 0);
        assert.deepEqual(byType(tree, "option").map((item) => item.props.value), [0, 1]);
        assert.ok(visible(tree).includes(rawName));
        for (const warning of ["Formulas are not executed. Only their cached results are imported; missing results become null.", "Hyperlinks are imported as display text without opening links."]) assert.ok(visible(tree).includes(translate(lang.id, warning)));
        await click(s, "Copy sheet JSON", lang.id, props); assert.equal(s.copied(), importedJson);
        click(s, "Download sheet JSON", lang.id, props); assert.equal(s.downloads.at(-1)?.text, importedJson);
        click(s, "Download sheet CSV", lang.id, props); assert.ok(s.downloads.at(-1)?.text?.includes("9223372036854775807"));
        click(s, "Use JSON in converter", lang.id, props); assert.equal(imported, importedJson);
    }
    byType(s.render(props), "select")[0].props.onChange(event("1"));
    for (const lang of LANGUAGES) { s.language(lang.id); assert.ok(visible(s.render(props)).includes(translate(lang.id, "Object output needs unique, nonempty first-row headers. Choose row arrays to preserve this sheet."))); }
    byType(s.render(props), "input")[1].props.onChange(event(false));
    assert.equal(byType(s.render(props), "textarea")[0].props.value, JSON.stringify([["x", "x"], [1, 2]], null, 2));
    byType(s.render(props), "textarea")[1].props.onChange(event(rawJson));
    byType(s.render(props), "input")[2].props.onChange(event(rawName));
    for (const lang of LANGUAGES) {
        s.language(lang.id); const tree = s.render(props);
        assert.equal(byType(tree, "textarea")[1].props.value, rawJson); assert.equal(byType(tree, "input")[2].props.value, rawName);
        await click(s, "Download XLSX", lang.id, props);
        const output = s.downloads.at(-1)!; assert.equal(output.name, "workbook.xlsx");
        const decoded = await spreadsheet.readSpreadsheet(output.bytes!); assert.equal(decoded.sheets[0].name, rawName); assert.deepEqual(decoded.sheets[0].rows, JSON.parse(rawJson));
        assert.equal(s.workerInputs.at(-1)?.json, rawJson); assert.equal(s.workerInputs.at(-1)?.name, rawName);
    }
    // The integrated converter's JSON source is passed byte-for-byte, rather than translated.
    s.language("en"); await click(s, "Download XLSX", "en", { jsonSource: rawJson }); assert.equal(s.workerInputs.at(-1)?.json, rawJson);
    await byType(s.render(), "input")[0].props.onChange({ target: { files: [{ size: 8 * 1024 * 1024 + 1 }] } });
    for (const lang of LANGUAGES) { s.language(lang.id); assert.ok(visible(s.render()).includes(translate(lang.id, "XLSX file limit is 8 MiB."))); }
    const precision = harness(paths[0]), precisionSource = '[[9223372036854775807,0.1234567890123456789,-0,1e400]]';
    await click(precision, "Download XLSX", "en", { jsonSource: precisionSource });
    assert.equal(precision.downloads.length, 0, "Unsafe numeric JSON must not produce an altered workbook");
    const precisionMessage = "A JSON number cannot be preserved safely as an Excel numeric cell. Quote precision-sensitive numbers as JSON strings to keep their exact text.";
    for (const lang of LANGUAGES) { precision.language(lang.id); assert.ok(visible(precision.render({ jsonSource: precisionSource })).includes(translate(lang.id, precisionMessage))); }
    assert.equal(precision.workerInputs.length, 1, "Locale changes must not restart precision validation or write a workbook");
    const quotedPrecision = '[["9223372036854775807","0.1234567890123456789","-0","1e400"]]';
    precision.language("en"); await click(precision, "Download XLSX", "en", { jsonSource: quotedPrecision });
    assert.deepEqual((await spreadsheet.readSpreadsheet(precision.downloads[0].bytes!)).sheets[0].rows, JSON.parse(quotedPrecision));
    assert.equal(precision.workerInputs.at(-1)?.json, quotedPrecision);
    const worker = harness(paths[0]); worker.failWorker(); await click(worker, "Download XLSX");
    for (const lang of LANGUAGES) { worker.language(lang.id); assert.ok(visible(worker.render()).includes(translate(lang.id, "Spreadsheet worker could not start. Reload and retry."))); }
    const timeout = harness(paths[0]); timeout.failWorker(true); await click(timeout, "Download XLSX");
    for (const lang of LANGUAGES) { timeout.language(lang.id); assert.ok(visible(timeout.render()).includes(translate(lang.id, "Spreadsheet processing exceeded 20 seconds. Try a smaller workbook."))); }

    const text = harness(paths[2]); const rawText = "日本語 العربية 😀";
    byType(text.render(), "textarea")[0].props.onChange(event(rawText)); click(text, "Encode");
    const base64 = Buffer.from(rawText).toString("base64");
    for (const lang of LANGUAGES) {
        text.language(lang.id); const tree = text.render(); assert.equal(byType(tree, "textarea")[0].props.value, rawText); assert.equal(byType(tree, "textarea")[1].props.value, base64); assert.equal(byType(tree, "textarea")[0].props.dir, "auto"); assert.equal(byType(tree, "textarea")[1].props.dir, "ltr");
        const choices = byType(tree, "segmented")[0].props.options; assert.deepEqual(Array.from(choices, (item: { value: string }) => item.value), ["Encode", "Decode"]);
        assert.equal(choices[0].label, translate(lang.id, "Encode"));
        const shared = elements(tree).find((item) => item.type === "ShareButton")!; assert.equal(shared.props.getState().mode, "Encode");
        text.share({ input: base64, mode: "Decode" }); assert.equal(byType(text.render(), "textarea")[1].props.value, rawText); assert.equal(byType(text.render(), "textarea")[0].props.dir, "ltr"); assert.equal(byType(text.render(), "textarea")[1].props.dir, "auto");
        text.share({ input: rawText, mode: "Encode" });
    }
    text.share({ input: "_invalid_", mode: "Decode" });
    for (const lang of LANGUAGES) { text.language(lang.id); assert.ok(visible(text.render()).includes(translate(lang.id, "Base64 could not be decoded as UTF-8 text. Check the input or use binary decoding below."))); }
    console.log("File conversions: eight authored languages; source error/warning coverage; locale-reactive state; exact XLSX buffers, sheet names, rows, formula text, MIME, Base64 and UTF-8 handler arguments pass. Browser file delivery is not exercised.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

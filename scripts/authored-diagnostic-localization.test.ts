/* eslint-disable @typescript-eslint/no-explicit-any -- Actual React callback and browser failure fixtures. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { AUTHORED_DIAGNOSTIC_TRANSLATIONS, AuthoredDiagnosticError, authoredDiagnosticText } from "../src/lib/i18n/authored-diagnostics";
import { mediaHarness } from "./media-tool-localization.test";
const req = createRequire(resolve("package.json")), React = req("react"), jsx = req("react/jsx-runtime");
const placeholders = (s: string) => [...s.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map((m) => m[1]).sort();
for (const [source, columns] of Object.entries(AUTHORED_DIAGNOSTIC_TRANSLATIONS)) {
    assert.equal(columns.length, 7);
    for (const [index, column] of columns.entries()) { assert.ok(column.trim()); assert.notEqual(column, source); assert.deepEqual(placeholders(column), placeholders(source)); assert.equal(translate(LANGUAGES[index + 1].id, source), column); }
}
const text = (value: any): string => value == null || typeof value === "boolean" ? "" : typeof value === "string" || typeof value === "number" ? String(value) : Array.isArray(value) ? value.map(text).join("") : text(value.props?.children);
function htmlHarness() {
    let locale: Language = "en", cursor = 0, work = 0; const hooks: any[] = [];
    const component = (name: string) => function FixtureComponent(props: any) { return React.createElement(name, props, props.children); };
    const hookReact = { ...React, useState: (initial: any) => { const i = cursor++; hooks[i] ??= { value: initial }; return [hooks[i].value, (next: any) => { hooks[i].value = next; }]; }, useMemo: (factory: () => unknown, deps: unknown[]) => { const i = cursor++; if (!hooks[i] || !deps.every((value, j) => Object.is(value, hooks[i].deps[j]))) { work++; hooks[i] = { value: factory(), deps }; } return hooks[i].value; } };
    const compiledModule = { exports: {} as any };
    const source = readFileSync(resolve("src/app/tools/html-validator/page.tsx"), "utf8");
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: compiledModule, exports: compiledModule.exports, require: (name: string): any => {
        if (name === "react") return hookReact; if (name === "react/jsx-runtime") return jsx;
        if (name === "antd") return new Proxy({ Typography: { Text: component("Text") } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name === "@ant-design/icons") return new Proxy({}, { get: (_target, key) => component(String(key)) });
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t: (s: string, values?: Record<string, string | number>) => translate(locale, s, values), direction: locale === "ar" ? "rtl" : "ltr" }) };
        if (name.endsWith("CodeEditor")) return { CodeEditor: component("Editor") };
        if (name.endsWith("SimpleList")) return { __esModule: true, default: (props: any) => React.createElement("IssueList", null, props.dataSource.map(props.renderItem)) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: component("Layout") };
        throw new Error(name);
    } });
    return { work: () => work, render(language: Language) { locale = language; cursor = 0; const nodes: any[] = [], strings: string[] = [];
        const walk = (node: any) => { if (node == null || typeof node === "boolean") return; if (typeof node === "string" || typeof node === "number") { strings.push(String(node)); return; } if (Array.isArray(node)) { node.forEach(walk); return; } if (typeof node.type === "function") { walk(node.type(node.props)); return; } nodes.push(node); for (const key of ["title", "extra", "children"]) walk(node.props?.[key]); };
        walk(compiledModule.exports.default()); return { nodes, text: strings.join(" "), editor: nodes.find((node) => node.type === "Editor") };
    } };
}
const source = new File([readFileSync(resolve("scripts/fixtures/images/metadata.png"))], "PUBLIC-画像-مرحبا.png", { type: "image/png" });
async function choose(h: ReturnType<typeof mediaHarness>, locale: Language, file: any = source) {
    let view = h.render(locale); if (view.nodes.some((node) => node.type === "input" && node.props.type === "file")) view.find("input", (props) => props.type === "file").props.onChange({ target: { files: [file] } });
    else await view.find("Dragger").props.beforeUpload(file);
    for (let i = 0; i < 4; i++) view = await h.flush(); return view;
}
function detail(h: ReturnType<typeof mediaHarness>, view: ReturnType<typeof h.render>) { return view.text + " " + text(h.notices.at(-1)); }
async function mediaFailure(id: string, locale: Language, options: Parameters<ReturnType<typeof mediaHarness>["setDiagnosticFixture"]>[0], key: string, values?: Record<string, string | number>, prepare = false, timer?: number) {
    const h = mediaHarness(id); let view;
    if (prepare) { await choose(h, locale); h.setDiagnosticFixture(options); view = h.render(locale); view.find("select", (props) => props.value === "strip").props.onChange({ target: { value: "convert" } }); view = h.render(locale); view.button("Prepare clean image").props.onClick(); await h.flush(); view = await h.flush(); }
    else { h.setDiagnosticFixture(options); view = await choose(h, locale); }
    if (timer) { h.fireTimer(timer); view = await h.flush(); }
    assert.ok(detail(h, view).includes(translate(locale, key, values)), `${id}/${locale}: ${key}; got ${detail(h, view)}`);
    if (id === "favicon-generator" || id === "exif-viewer") { const counts = JSON.stringify(h.calls); for (const next of LANGUAGES) { const changed = h.render(next.id); assert.ok(changed.text.includes(translate(next.id, key, values))); } assert.equal(JSON.stringify(h.calls), counts, "Locale must not rerun image/worker work"); }
    assert.equal(h.downloads.length, 0); assert.equal(h.anchors.length, 0); return h;
}
async function main() {
    for (const language of LANGUAGES) {
        const locale = language.id;
        const html = htmlHarness(); let page = html.render(locale); const input = '<html>\n<body>\n<div>\n</body>\n</surprise>\n<center>\n<img src="PUBLIC-画像-مرحبا.png">'; page.editor.props.onChange(input); page = html.render(locale);
        for (const key of ["Missing <!DOCTYPE html> declaration", "Missing <head> element", "Image without alt attribute (accessibility)"]) assert.ok(page.text.includes(translate(locale, key)));
        for (const [key, values] of [["Unexpected closing tag {tag}", { tag: "</surprise>" }], ["Mismatched closing tag {tag}, expected {expected}", { tag: "</body>", expected: "</div>" }], ["Deprecated tag {tag} found", { tag: "<center>" }], ["Unclosed tag {tag}", { tag: "<div>" }]] as const) assert.ok(page.text.includes(translate(locale, key, values)));
        const work = html.work(); for (const next of LANGUAGES) { page = html.render(next.id); assert.equal(page.editor.props.value, input); } assert.equal(html.work(), work);
        page.editor.props.onChange("<head>"); page = html.render(locale); for (const key of ["Missing <html> element", "Missing <body> element", "Missing <title> element in head"]) assert.ok(page.text.includes(translate(locale, key)));
        for (const id of ["image-compressor", "image-resizer", "image-diff"]) {
            const h = mediaHarness(id); h.failDecode(); const view = await choose(h, locale); assert.ok(detail(h, view).includes(translate(locale, id === "image-diff" ? "Could not decode image" : "Decode failed")));
        }
        for (const id of ["image-compressor", "image-diff"]) await mediaFailure(id, locale, { readFails: true }, id === "image-diff" ? "Could not read file" : "Read failed");
        const pendingDiff = mediaHarness("image-diff"); let pendingView = pendingDiff.render("en"); pendingDiff.setDiagnosticFixture({ readFails: true }); const pendingRead = pendingView.find("Dragger").props.beforeUpload(source); pendingDiff.render(locale); await pendingRead; pendingView = await pendingDiff.flush(); assert.ok(detail(pendingDiff, pendingView).includes(translate(locale, "Could not read file"))); assert.equal(pendingDiff.calls.reader, 1);
        for (const id of ["image-compressor", "image-resizer"]) {
            await mediaFailure(id, locale, { canvasUnavailable: true }, "Canvas not supported");
            await mediaFailure(id, locale, { encodingFails: true }, "Encoding failed");
            const raw = "Decode failed"; const h = mediaHarness(id); h.setDiagnosticFixture({ rawCanvasError: raw }); const view = await choose(h, locale); assert.ok(h.notices.at(-1)?.endsWith("\n" + raw)); assert.ok(detail(h, view).includes(translate(locale, "Unable to process this image. Check the image format and size, then try again.")));
        }
        await mediaFailure("favicon-generator", locale, { holdDecode: true }, "Image decoding exceeded twenty seconds. Try a smaller source or another format.", undefined, false, 20_000);
        await mediaFailure("favicon-generator", locale, { dimensions: [10_001, 1] }, "Source limit is 10,000 pixels per side and 40 megapixels.");
        const badFavicon = mediaHarness("favicon-generator"); badFavicon.failDecode(); let view = await choose(badFavicon, locale); assert.ok(view.text.includes(translate(locale, "This browser cannot decode the image. Try a self-contained SVG, PNG, JPEG, WebP or AVIF.")));
        await mediaFailure("favicon-generator", locale, { canvasUnavailable: true }, "Canvas is unavailable.");
        await mediaFailure("favicon-generator", locale, { encodingFails: true }, "PNG encoding failed.");
        for (const [id, key] of [["favicon-generator", "Source image limit is 16 MiB."], ["exif-viewer", "Image file limit is 16 MiB."]]) { const h = mediaHarness(id); view = await choose(h, locale, { size: 16 * 1024 * 1024 + 1, name: source.name }); assert.ok(view.text.includes(translate(locale, key))); assert.equal(h.calls.image + h.calls.worker, 0); }
        await mediaFailure("exif-viewer", locale, { workerStartFails: true }, "The local metadata worker could not start. Reload and retry.");
        await mediaFailure("exif-viewer", locale, { holdWorker: true }, "Image processing exceeded fifteen seconds. Try a smaller image.", undefined, false, 15_000);
        const external = mediaHarness("exif-viewer"); external.setDiagnosticFixture({ workerError: "Decode failed" }); view = await choose(external, locale); assert.ok(view.nodes.some((node) => node.type === "bdi" && node.props.children === "Decode failed"));
        for (const [options, key] of [[{ bitmapFails: true }, "This browser cannot decode the image for canvas conversion. Metadata inspection may still work; try a supported JPEG, PNG, WebP or AVIF input."], [{ dimensions: [10_001, 1] }, "Canvas export is limited to 10,000 pixels per side and 40 megapixels."], [{ canvasUnavailable: true }, "Canvas is unavailable."], [{ encodingFails: true }, "The browser could not encode this image."], [{ outputSize: 32 * 1024 * 1024 + 1 }, "Encoded output exceeds 32 MiB. Try JPEG/WebP or resize the source first."]] as const) await mediaFailure("exif-viewer", locale, options, key, undefined, true);
        const encoder = mediaHarness("exif-viewer"); await choose(encoder, locale); encoder.setOutputMime("image/jpeg"); view = encoder.render(locale); view.find("select", (props) => props.value === "strip").props.onChange({ target: { value: "convert" } }); view = encoder.render(locale); view.button("Prepare clean image").props.onClick(); await encoder.flush(); view = await encoder.flush(); assert.ok(view.text.includes(translate(locale, "This browser has no {format} encoder. Choose PNG instead.", { format: "PNG" })));
        assert.equal(authoredDiagnosticText((s, values) => translate(locale, s, values), new Error("Decode failed")), "Decode failed");
        assert.equal(authoredDiagnosticText((s, values) => translate(locale, s, values), new AuthoredDiagnosticError("Unsupported encoder: requested {requested}, received {received}. Choose PNG instead.", { requested: "image/webp", received: "image/画像-مرحبا" })), translate(locale, "Unsupported encoder: requested {requested}, received {received}. Choose PNG instead.", { requested: "image/webp", received: "image/画像-مرحبا" }));
    }
    // Every tagged page error has an integrated translation, including cancellation paths that cannot render after unmount.
    for (const id of ["favicon-generator", "exif-viewer", "image-compressor", "image-resizer", "image-diff"]) {
        const ast = ts.createSourceFile(id, readFileSync(resolve(`src/app/tools/${id}/page.tsx`), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
        const visit = (node: ts.Node) => { if (ts.isNewExpression(node) && node.expression.getText(ast) === "AuthoredDiagnosticError") { const key = node.arguments?.[0]; assert.ok(key && ts.isStringLiteral(key)); assert.ok(SHARED_TRANSLATIONS[key.text], `${id}: ${key.text}`); } ts.forEachChild(node, visit); }; visit(ast);
    }
    console.log(`Authored diagnostic copy: ${Object.keys(AUTHORED_DIAGNOSTIC_TRANSLATIONS).length} rows, six actual pages, eight languages; HTML keys/tag values, file read/decode/worker/canvas/encoder/limits/timeouts, raw external diagnostics and locale work invariance pass. No UI/browser verification.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

/* eslint-disable @typescript-eslint/no-explicit-any -- VM fixtures model heterogeneous React props and browser API callbacks. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as authoredDiagnostics from "../src/lib/i18n/authored-diagnostics";
import { MEDIA_TOOL_TRANSLATIONS } from "../src/lib/i18n/media-tools";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { imageCrc32, stripImageMetadata } from "../src/lib/image-metadata";
import { packIco, maskableImageRect } from "../src/lib/favicon-exports";
import { inspectImageMetadata } from "../src/lib/image-inspection";
import { optimizeSvg, DEFAULT_OPTS } from "../src/app/tools/svg-optimizer/optimize";

const ids = ["favicon-generator", "exif-viewer", "image-compressor", "image-resizer", "svg-optimizer", "qrcode-generator"];
const stage = process.env.MEDIA_STAGE_ROOT;
const sourcePath = (id: string) => resolve(stage ?? ".", `src/app/tools/${id}/page.tsx`);
const placeholders = (value: string) => [...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map((match) => match[1]).sort();
function mediaTranslate(language: Language, source: string, values?: Record<string, string | number>) {
    let value = language === "en" ? source : MEDIA_TOOL_TRANSLATIONS[source]?.[LANGUAGES.findIndex((entry) => entry.id === language) - 1] ?? translate(language, source);
    for (const [key, replacement] of Object.entries(values ?? {})) value = value.replaceAll(`{${key}}`, String(replacement));
    return value;
}
for (const [source, columns] of Object.entries(MEDIA_TOOL_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    columns.forEach((value, index) => {
        assert.ok(value.trim(), source);
        assert.deepEqual(placeholders(value), placeholders(source), source);
        if (!stage) assert.equal(translate(LANGUAGES[index + 1].id, source), value, `Catalog integration: ${source}`);
    });
}
const covered = (text: string) => assert.ok(MEDIA_TOOL_TRANSLATIONS[text] || SHARED_TRANSLATIONS[text], `Untranslated media copy: ${text}`);
for (const id of ids) {
    const source = readFileSync(sourcePath(id), "utf8"), ast = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && /[A-Za-z]/.test(node.text)) assert.fail(`${id}: raw UI text ${node.text}`);
        if (ts.isCallExpression(node) && ["t", "translation.current"].includes(node.expression.getText(ast)) && node.arguments[0]) {
            const collect = (child: ts.Node) => { if (ts.isStringLiteral(child)) covered(child.text); else if (ts.isConditionalExpression(child)) { collect(child.whenTrue); collect(child.whenFalse); } };
            collect(node.arguments[0]);
        }
        if (ts.isJsxAttribute(node) && node.name.getText(ast) === "learnMore") {
            const collect = (child: ts.Node) => { if (ts.isStringLiteral(child)) covered(child.text); ts.forEachChild(child, collect); };
            collect(node);
        }
        ts.forEachChild(node, visit);
    };
    visit(ast);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
    assert.doesNotMatch(source, /(?:useMemo|useCallback)[\s\S]{0,300}?\[language\]/);
    assert.doesNotMatch(source, /t\((?:input|output|metadataJson|manifest|html|file\.name)\)/);
}

const nativeRequire = createRequire(resolve("package.json")), React = nativeRequire("react") as typeof import("react"), jsx = nativeRequire("react/jsx-runtime");
type Element = { type: unknown; props: Record<string, any> };
type Hook = { value: any; deps?: unknown[]; cleanup?: () => void };
const same = (left: unknown[] | undefined, right: unknown[]) => !!left && left.length === right.length && left.every((value, index) => Object.is(value, right[index]));
const tick = async () => { for (let n = 0; n < 40; n++) await Promise.resolve(); };
function png(width: number, height: number) {
    const chunk = (type: string, data: Uint8Array) => { const out = new Uint8Array(data.length + 12), view = new DataView(out.buffer); view.setUint32(0, data.length); out.set(new TextEncoder().encode(type), 4); out.set(data, 8); view.setUint32(data.length + 8, imageCrc32(out.subarray(4, data.length + 8))); return out; };
    const header = new Uint8Array(13), view = new DataView(header.buffer); view.setUint32(0, width); view.setUint32(4, height); header[8] = 8; header[9] = 6;
    const parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", header), chunk("IDAT", new Uint8Array([120, 156, 3, 0, 0, 0, 0, 1])), chunk("IEND", new Uint8Array())];
    const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0)); let offset = 0; for (const part of parts) { out.set(part, offset); offset += part.length; } return out;
}
export function mediaHarness(id: string) {
    let language: Language = "en", scope = "root", cursor = 0, dirty = false, urlIndex = 0;
    const scopes = new Map<string, Hook[]>(), pending: (() => void)[] = [], notices: string[] = [], copied: string[] = [], downloads: { data: Blob | string; name: string; mime?: string }[] = [], anchors: { href: string; download: string }[] = [];
    const calls = { canvas: 0, reader: 0, image: 0, worker: 0, optimizer: 0, qr: 0, revoked: [] as string[], draw: [] as number[][] };
    const timers = new Map<number, { callback: () => void; delay: number }>(); let timerId = 0;
    const qrPending: { resolve: (value: string) => void; reject: (error: Error) => void; content: string; options: any }[] = [];
    let outputMime: string | undefined, clipboardFails = false, rawClipboardFails = false, decodeFails = false, readFails = false, canvasUnavailable = false, encodingFails = false, holdDecode = false, holdWorker = false, workerStartFails = false, bitmapFails = false;
    let workerError: string | undefined, rawCanvasError: string | undefined, dimensions = [320, 160], outputSize = 0;
    const blobs = new Map<string, Blob>();
    const hook = () => { const values = scopes.get(scope) ?? []; scopes.set(scope, values); const index = cursor++; return { values, index }; };
    const react = { ...React,
        useState: (initial: any) => { const { values, index } = hook(); values[index] ??= { value: typeof initial === "function" ? initial() : initial }; return [values[index].value, (next: any) => { const previous = values[index].value, value = typeof next === "function" ? next(previous) : next; if (!Object.is(value, previous)) { values[index].value = value; dirty = true; } }]; },
        useRef: (initial: any) => { const { values, index } = hook(); values[index] ??= { value: { current: initial } }; return values[index].value; },
        useMemo: (factory: () => unknown, deps: unknown[]) => { const { values, index } = hook(); if (!values[index] || !same(values[index].deps, deps)) values[index] = { value: factory(), deps }; return values[index].value; },
        useCallback: (callback: unknown, deps: unknown[]) => react.useMemo(() => callback, deps),
        useEffect: (effect: () => (() => void) | void, deps: unknown[]) => { const { values, index } = hook(); if (!values[index] || !same(values[index].deps, deps)) { const previous = values[index]; values[index] = { value: null, deps }; pending.push(() => { previous?.cleanup?.(); const cleanup = effect(); if (cleanup) values[index].cleanup = cleanup; }); } },
    };
    const component = (name: string) => function Component(props: Record<string, unknown>) { return React.createElement(name, props, props.children as React.ReactNode); };
    const Typography = Object.fromEntries(["Text", "Paragraph", "Title"].map((name) => [name, component(name)]));
    const Input = Object.assign(component("Input"), { Password: component("Password"), TextArea: component("TextArea") });
    const Upload = Object.assign(component("Upload"), { Dragger: component("Dragger") });
    const messages = Object.fromEntries(["success", "warning", "error", "info"].map((key) => [key, (value: string) => notices.push(value)]));
    class MockImage { get naturalWidth() { return dimensions[0]; } get naturalHeight() { return dimensions[1]; } onload?: () => void; onerror?: () => void; private source = ""; get src() { return this.source; } set src(value: string) { this.source = value; if (!value) return; calls.image++; if (holdDecode) return; queueMicrotask(() => decodeFails ? this.onerror?.() : this.onload?.()); } }
    class MockReader { result: string = ""; onload?: () => void; onerror?: () => void; readAsDataURL(file: File) { calls.reader++; this.result = `data:${file.type};base64,PUBLIC`; queueMicrotask(() => readFails ? this.onerror?.() : this.onload?.()); } }
    class MockWorker { onmessage?: (event: { data: { value?: unknown; error?: string } }) => void; onerror?: () => void; terminate() {} postMessage(request: { operation: "inspect" | "strip"; bytes: Uint8Array }) { calls.worker++; if (holdWorker) return; if (workerStartFails) { queueMicrotask(() => this.onerror?.()); return; } if (workerError !== undefined) { queueMicrotask(() => this.onmessage?.({ data: { error: workerError } })); return; } Promise.resolve(request.operation === "inspect" ? inspectImageMetadata(request.bytes) : stripImageMetadata(request.bytes)).then((value) => this.onmessage?.({ data: { value } }), (error: Error) => this.onmessage?.({ data: { error: error.message } })); } }
    const document = { createElement: (tag: string) => {
        if (tag === "a") { const anchor = { href: "", download: "", click: () => anchors.push({ href: anchor.href, download: anchor.download }) }; return anchor; }
        assert.equal(tag, "canvas"); const canvas = { width: 0, height: 0, getContext: () => { if (rawCanvasError !== undefined) throw new Error(rawCanvasError); if (canvasUnavailable) return null; return ({ fillStyle: "", fillRect: () => {}, drawImage: (_image: unknown, ...rect: number[]) => calls.draw.push(rect), imageSmoothingQuality: "", imageSmoothingEnabled: true }); }, toBlob: (callback: (blob: Blob | null) => void, mime = "image/png") => { calls.canvas++; const actual = outputMime ?? mime; queueMicrotask(() => callback(encodingFails ? null : new Blob([outputSize ? new Uint8Array(outputSize) : new Uint8Array(png(canvas.width, canvas.height))], { type: actual }))); } }; return canvas;
    } };
    const dependencies = (name: string): any => {
        if (name === "react") return react; if (name === "react/jsx-runtime") return jsx;
        if (name === "@ant-design/icons") return new Proxy({}, { get: (_target, key) => component(String(key)) });
        if (name === "antd") return new Proxy({ Typography, Input, Upload, App: { useApp: () => ({ message: messages }) }, Radio: { Group: component("RadioGroup") }, message: messages }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => mediaTranslate(language, source, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: any) => React.createElement("Layout", props, ...[props.title, props.description, ...Object.values(props.learnMore ?? {}).flat().map((text) => mediaTranslate(language, String(text))), props.children] as React.ReactNode[]) };
        if (name.endsWith("authored-diagnostics")) return authoredDiagnostics;
        if (name.endsWith("favicon-exports")) return { packIco, maskableImageRect };
        if (name.endsWith("image-metadata")) return nativeRequire(resolve("src/lib/image-metadata.ts"));
        if (name.endsWith("download")) return { downloadBlob: (data: Blob, name: string) => downloads.push({ data, name }), downloadText: (data: string, name: string, mime?: string) => downloads.push({ data, name, mime }) };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (text: string) => { copied.push(text); return true; } };
        if (name === "./optimize") return { DEFAULT_OPTS, optimizeSvg: (...args: Parameters<typeof optimizeSvg>) => { calls.optimizer++; return optimizeSvg(...args); } };
        if (name === "qrcode") return { __esModule: true, default: { toDataURL: (content: string, options: any) => { calls.qr++; return new Promise<string>((resolve, reject) => qrPending.push({ content, options, resolve, reject })); }, toString: (content: string, options: any) => nativeRequire("qrcode").toString(content, options) } };
        if (name === "jszip") return nativeRequire("jszip");
        throw new Error(`Unexpected media dependency ${name}`);
    };
    const compiledModule = { exports: {} as { default: () => unknown } };
    const source = readFileSync(sourcePath(id), "utf8").replace(/import\.meta\.url/g, '"http://localhost/image-metadata.worker.js"');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const MockURL = class extends URL { static createObjectURL(blob: Blob) { const url = `blob:public-media-${++urlIndex}`; blobs.set(url, blob); return url; } static revokeObjectURL(url: string) { calls.revoked.push(url); } };
    runInNewContext(code, { module: compiledModule, exports: compiledModule.exports, require: dependencies, Error, Blob, File, Uint8Array, ArrayBuffer, TextEncoder, TextDecoder, URL: MockURL, Image: MockImage, FileReader: MockReader, Worker: MockWorker, document, queueMicrotask, setTimeout: (callback: () => void, delay: number) => { timers.set(++timerId, { callback, delay }); return timerId; }, clearTimeout: (id: number) => timers.delete(id), createImageBitmap: async () => { if (bitmapFails) throw new Error("PUBLIC bitmap failure"); return { width: dimensions[0], height: dimensions[1], close() {} }; }, navigator: { clipboard: { write: async () => { if (clipboardFails) throw new Error("PUBLIC clipboard denied"); }, writeText: async (value: string) => { if (rawClipboardFails) throw new Error("PUBLIC fallback denied"); copied.push(value); } } }, ClipboardItem: class { constructor(public value: unknown) {} }, fetch: async () => ({ blob: async () => new Blob(["PUBLIC QR PNG"], { type: "image/png" }) }) });
    type View = { nodes: Element[]; text: string; find: (type: string, predicate?: (props: Record<string, any>) => boolean) => Element; button: (source: string) => Element; t: (source: string) => string };
    let view: View;
    function render(locale: Language = language): View {
        language = locale;
        let nodes: Element[] = [], texts: string[] = [];
        const walk = (node: unknown, path: string) => {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { texts.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach((child, index) => walk(child, `${path}/${index}`)); return; }
            const element = node as Element;
            if (typeof element.type === "function") { const before = scope, previous = cursor; scope = path; cursor = 0; walk(element.type(element.props), `${path}/result`); scope = before; cursor = previous; return; }
            if (!element.props) return; nodes.push(element);
            for (const name of ["title", "description", "extra"]) if (element.props[name] != null) walk(element.props[name], `${path}/${name}`);
            for (const [index, option] of (element.props.options ?? []).entries()) walk(option.label, `${path}/option/${index}`);
            walk(element.props.children, `${path}/children`);
        };
        for (let attempt = 0; attempt < 8; attempt++) { dirty = false; nodes = []; texts = []; scope = "root"; cursor = 0; walk(compiledModule.exports.default(), "root/tree"); pending.splice(0).forEach((effect) => effect()); if (!dirty) break; assert.ok(attempt < 7, `${id} did not settle`); }
        const find = (type: string, predicate: (props: Record<string, any>) => boolean = () => true) => { const node = nodes.find((node) => node.type === type && predicate(node.props)); assert.ok(node, `${id}/${locale}: missing ${type}`); return node; };
        view = { nodes, text: texts.join(" "), find, button: (source: string) => find(id === "favicon-generator" || id === "exif-viewer" ? "button" : "Button", (props) => props.children === mediaTranslate(language, source)), t: (source: string) => mediaTranslate(language, source) };
        return view;
    }
    const flush = async () => { await tick(); for (const [id, timer] of [...timers]) if (timer.delay === 150) { timers.delete(id); timer.callback(); } await tick(); return render(); };
    return { render, flush, calls, notices, copied, downloads, anchors, qrPending, blobs, fireTimer: (delay: number) => { for (const [key, timer] of timers) if (timer.delay === delay) { timers.delete(key); timer.callback(); } }, setDiagnosticFixture: (options: { readFails?: boolean; canvasUnavailable?: boolean; encodingFails?: boolean; holdDecode?: boolean; holdWorker?: boolean; workerStartFails?: boolean; bitmapFails?: boolean; workerError?: string; rawCanvasError?: string; dimensions?: readonly number[]; outputSize?: number }) => { readFails = options.readFails ?? false; canvasUnavailable = options.canvasUnavailable ?? false; encodingFails = options.encodingFails ?? false; holdDecode = options.holdDecode ?? false; holdWorker = options.holdWorker ?? false; workerStartFails = options.workerStartFails ?? false; bitmapFails = options.bitmapFails ?? false; workerError = options.workerError; rawCanvasError = options.rawCanvasError; dimensions = [...(options.dimensions ?? [320, 160])]; outputSize = options.outputSize ?? 0; }, setOutputMime: (mime?: string) => { outputMime = mime; }, failCopy: () => { clipboardFails = true; rawClipboardFails = true; }, failDecode: () => { decodeFails = true; }, rootState: () => (scopes.get("root") ?? []).map((cell) => cell.value), view: () => view };
}

async function main() {
    for (const language of LANGUAGES) {
        const compressor = mediaHarness("image-compressor"); let view = compressor.render(language.id);
        assert.ok(view.text.includes(view.t("Drop image or click to choose")));
        const source = new File([png(320, 160)], "PUBLIC-画像-مرحبا.png", { type: "image/png" });
        await view.find("Dragger").props.beforeUpload(source); view = await compressor.flush(); view = await compressor.flush();
        assert.equal(compressor.calls.reader, 1); assert.ok(compressor.calls.canvas > 0);
        assert.deepEqual(compressor.calls.draw.at(-1), [0, 0, 320, 160]);
        const before = { ...compressor.calls }; for (const next of LANGUAGES) compressor.render(next.id); assert.equal(compressor.calls.canvas, before.canvas); assert.equal(compressor.calls.reader, 1);
        view = compressor.render(language.id); view.find("a").props.onClick(); assert.equal(compressor.anchors.at(-1)?.download, "PUBLIC-画像-مرحبا-compressed.jpg");
        compressor.setOutputMime("image/png"); view.find("RadioGroup").props.onChange({ target: { value: "image/webp" } }); view = await compressor.flush(); view = await compressor.flush();
        assert.ok(compressor.notices.at(-1)?.startsWith(view.t("This browser cannot encode the selected format. Choose PNG and try again."))); assert.ok(compressor.notices.at(-1)?.includes(mediaTranslate(language.id, "Unsupported encoder: requested {requested}, received {received}. Choose PNG instead.", { requested: "image/webp", received: "image/png" }))); assert.ok(!view.nodes.some((node) => node.type === "a"));
        compressor.setOutputMime(); view.find("RadioGroup").props.onChange({ target: { value: "image/png" } }); await compressor.flush(); view = await compressor.flush(); view.find("a").props.onClick(); assert.ok(compressor.anchors.at(-1)?.download.endsWith(".png"));

        const resizer = mediaHarness("image-resizer"); view = resizer.render(language.id); await view.find("Dragger").props.beforeUpload(source); view = await resizer.flush(); view = await resizer.flush();
        assert.equal(view.find("InputNumber").props.value, 320); assert.equal(view.find("InputNumber").props.dir, "ltr");
        const count = resizer.calls.canvas; for (const next of LANGUAGES) resizer.render(next.id); await resizer.flush(); assert.equal(resizer.calls.canvas, count); assert.equal(resizer.calls.image, 1);
        view = resizer.render(language.id); view.button("Download").props.onClick(); assert.equal(resizer.anchors.at(-1)?.download, "PUBLIC-画像-مرحبا-320x160.png");
        resizer.setOutputMime("image/png"); view.find("RadioGroup", (props) => props.value === "keep").props.onChange({ target: { value: "image/webp" } }); view = await resizer.flush(); view = await resizer.flush(); assert.ok(resizer.notices.at(-1)?.startsWith(view.t("This browser cannot encode the selected format. Choose PNG and try again."))); assert.equal(view.button("Download").props.disabled, true);

        const optimizer = mediaHarness("svg-optimizer"); view = optimizer.render(language.id); const fixture = '<svg xmlns="http://www.w3.org/2000/svg"><text>画像 مرحبا 1.2345</text><circle r="1.234567"/></svg>';
        view.find("TextArea", (props) => !props.readOnly).props.onChange({ target: { value: fixture } }); view = optimizer.render(language.id); const output = view.find("TextArea", (props) => props.readOnly).props.value; assert.equal(output, optimizeSvg(fixture, DEFAULT_OPTS)); assert.ok(output.includes("画像 مرحبا 1.2345"));
        assert.equal(view.find("iframe").props.sandbox, ""); assert.equal(view.find("iframe").props.referrerPolicy, "no-referrer"); assert.equal(view.find("TextArea").props.style.fontSize, 16);
        const optimizations = optimizer.calls.optimizer; for (const next of LANGUAGES) optimizer.render(next.id); assert.equal(optimizer.calls.optimizer, optimizations); view = optimizer.render(language.id); await view.button("Copy").props.onClick(); assert.equal(optimizer.copied.at(-1), output); view.button("Download").props.onClick(); assert.equal(optimizer.downloads.at(-1)?.data, output);

        const favicon = mediaHarness("favicon-generator"); view = favicon.render(language.id); view.find("input", (props) => props.type === "file").props.onChange({ target: { files: [source] } }); await favicon.flush(); await favicon.flush(); view = await favicon.flush();
        assert.equal(favicon.calls.canvas, 14); const iconWork = favicon.calls.canvas; const manifestBefore = view.find("textarea", (props) => props.rows === 15).props.value;
        for (const next of LANGUAGES) favicon.render(next.id); await favicon.flush(); assert.equal(favicon.calls.canvas, iconWork); assert.equal(favicon.calls.image, 1);
        view = favicon.render(language.id); await view.button("Copy manifest").props.onClick(); assert.equal(favicon.copied.at(-1), manifestBefore); const manifest = JSON.parse(manifestBefore); assert.equal(manifest.icons.find((icon: any) => icon.purpose === "maskable").sizes, "512x512");
        view.button("Download manifest").props.onClick(); assert.equal(favicon.downloads.at(-1)?.data, manifestBefore); assert.equal(favicon.downloads.at(-1)?.mime, "application/manifest+json");
        const icoButton = view.nodes.find((node) => node.type === "button" && Array.isArray(node.props.children) && node.props.children.includes("ICO")); assert.ok(icoButton); icoButton.props.onClick(); const ico = favicon.downloads.at(-1)!; assert.equal(ico.name, "favicon.ico"); const bytes = new Uint8Array(await (ico.data as Blob).arrayBuffer()); assert.equal(new DataView(bytes.buffer).getUint16(4, true), 6);

        const exif = mediaHarness("exif-viewer"); view = exif.render(language.id); const metadataBytes = readFileSync(resolve("scripts/fixtures/images/metadata.png")); const original = new File([metadataBytes], "PUBLIC-画像-مرحبا.png", { type: "image/png" });
        await view.find("input", (props) => props.type === "file").props.onChange({ target: { files: [original] } }); await exif.flush(); view = await exif.flush(); assert.equal(exif.calls.worker, 1); assert.ok(view.text.includes("PUBLIC-FIXTURE-CAMERA"));
        view.button("Copy metadata JSON").props.onClick(); await tick(); const exactMetadata = exif.copied.at(-1)!; assert.ok(exactMetadata.includes("PUBLIC-FIXTURE-CAMERA"));
        for (const next of LANGUAGES) exif.render(next.id); await exif.flush(); assert.equal(exif.calls.worker, 1); view = exif.render(language.id); await view.button("Copy metadata JSON").props.onClick(); assert.equal(exif.copied.at(-1), exactMetadata);
        view.button("Prepare clean image").props.onClick(); await exif.flush(); view = await exif.flush(); assert.equal(exif.calls.worker, 2); view.button("Download prepared image").props.onClick(); const prepared = exif.downloads.at(-1)!; assert.equal(prepared.name, "PUBLIC-画像-مرحبا-clean.png"); assert.deepEqual(new Uint8Array(await (prepared.data as Blob).arrayBuffer()), stripImageMetadata(new Uint8Array(metadataBytes)).bytes);
        const workers = exif.calls.worker; for (const next of LANGUAGES) exif.render(next.id); await exif.flush(); assert.equal(exif.calls.worker, workers);

        const qr = mediaHarness("qrcode-generator"); view = qr.render(language.id); assert.equal(qr.calls.qr, 1); qr.qrPending[0].resolve("data:image/png;base64,PUBLIC-INITIAL"); view = await qr.flush();
        const encoded = "https://example.com/画像?text=مرحبا🌍"; view.find("TextArea").props.onChange({ target: { value: encoded } }); view = qr.render(language.id); assert.ok(!view.nodes.some((node) => node.type === "Button" && node.props.children === view.t("Copy"))); const second = qr.qrPending.at(-1)!; assert.equal(second.content, encoded);
        for (const next of LANGUAGES) qr.render(next.id); assert.equal(qr.calls.qr, 2); second.resolve("data:image/png;base64,PUBLIC-UNICODE"); view = await qr.flush(); assert.equal(view.find("img").props.src, "data:image/png;base64,PUBLIC-UNICODE"); assert.equal(view.find("TextArea").props.dir, "ltr");
        view = qr.render(language.id); view.find("TextArea").props.onChange({ target: { value: "PUBLIC-OLD" } }); qr.render(language.id); const old = qr.qrPending.at(-1)!; view = qr.render(language.id); view.find("TextArea").props.onChange({ target: { value: "PUBLIC-NEW" } }); qr.render(language.id); const latest = qr.qrPending.at(-1)!; latest.resolve("data:image/png;base64,PUBLIC-NEW"); await qr.flush(); old.resolve("data:image/png;base64,PUBLIC-OLD"); view = await qr.flush(); assert.equal(view.find("img").props.src, "data:image/png;base64,PUBLIC-NEW");
        view.find("TextArea").props.onChange({ target: { value: "PUBLIC-TOO-LARGE" } }); qr.render(language.id); qr.qrPending.at(-1)!.reject(new Error("PUBLIC engine capacity exceeded")); view = await qr.flush(); assert.ok(view.text.includes(view.t("Unable to generate this QR code. Shorten the content or lower error correction, then try again."))); assert.ok(view.text.includes("PUBLIC engine capacity exceeded")); assert.ok(!view.nodes.some((node) => node.type === "img")); assert.ok(!view.nodes.some((node) => node.type === "Button" && node.props.children === view.t("Copy")));
        view = qr.render(language.id); view.button("Try again").props.onClick(); qr.qrPending.at(-1)!.resolve("data:image/png;base64,PUBLIC-RETRY"); view = await qr.flush(); qr.failCopy(); await view.button("Copy").props.onClick(); assert.equal(qr.notices.at(-1), view.t("Unable to copy the QR code. Download PNG or SVG instead."));
    }
    // Independent real QR encoder oracle: these are Unicode input bytes, not translated UI.
    const realQr = nativeRequire("qrcode"); const svg = await realQr.toString("画像 مرحبا 🌍", { type: "svg", errorCorrectionLevel: "M" }); assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')); assert.ok(realQr.create("画像 مرحبا 🌍").modules.size > 0);
    console.log("Media UI/help/recovery covers eight languages. Actual page handlers preserve source files, exact metadata/manifest/Blob exports, Canvas geometry and memoized work across locale changes; QR latest-run, stale-copy/error recovery and unsupported encoder MIME guards passed. Browser file delivery is not asserted.");
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) main().catch((error) => { console.error(error); process.exitCode = 1; });

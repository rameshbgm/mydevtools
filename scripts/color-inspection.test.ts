/* eslint-disable @typescript-eslint/no-explicit-any -- Controlled React/browser fixtures use heterogeneous props. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as React from "react";
import { extractPalette } from "../src/lib/color-palette";
import { colorContrast, parseContrastHex } from "../src/lib/color-contrast";
import { COLOR_INSPECTION_TRANSLATIONS } from "../src/lib/i18n/color-inspection";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";

assert.equal(colorContrast("#000", "#fff"), 21);
assert.equal(colorContrast("000000", "#000000"), 1);
assert.ok(Math.abs(colorContrast("#ff0000", "#ffffff")! - 3.9984767707539985) < 1e-12);
assert.ok(colorContrast("#767676", "white") === null);
for (const invalid of ["#ff", "12#3456", "transparent", "#1234", "#12345678", "#fff; color:red", "#GGG"]) assert.equal(colorContrast(invalid, "#fff"), null);
assert.deepEqual(parseContrastHex(" abc "), [170, 187, 204]);
assert.equal(colorContrast("#777", "#fff")! >= 4.5, false);
assert.equal(colorContrast("#767676", "#fff")! >= 4.5, true);
const red = [255, 0, 0], blue = [0, 0, 255];
const oldDuplicateSeedFixture = [red, blue, red, red, blue, red];
const two = extractPalette(oldDuplicateSeedFixture, 2);
assert.deepEqual(two.map(({ hex, count }) => [hex, count]), [["#ff0000", 4], ["#0000ff", 2]]);
assert.deepEqual(extractPalette([red, red, red], 16).map(({ hex, count }) => [hex, count]), [["#ff0000", 3]]);
assert.deepEqual(extractPalette([red, blue], 1), [{ hex: "#800080", rgb: [128, 0, 128], hsl: [300, 100, 25], count: 2 }]);
assert.deepEqual(extractPalette([], 3), []);
assert.throws(() => extractPalette([red], 0));
assert.throws(() => extractPalette([[NaN, 0, 0]], 3));
for (let k = 1; k <= 16; k++) {
    const pixels = Array.from({ length: 99 }, (_, n) => [n * 17 % 256, n * 43 % 256, n * 71 % 256]);
    const swatches = extractPalette(pixels, k);
    assert.equal(swatches.reduce((sum, color) => sum + color.count, 0), pixels.length);
    assert.equal(new Set(swatches.map((color) => color.hex)).size, swatches.length);
    assert.deepEqual(extractPalette(pixels, k), swatches, "No random palette changes");
}
const placeholders = (text: string) => (text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(COLOR_INSPECTION_TRANSLATIONS)) {
    assert.equal(columns.length, 7);
    columns.forEach((value, index) => { assert.ok(value.trim()); assert.deepEqual(placeholders(value), placeholders(source)); assert.equal(translate(LANGUAGES[index + 1].id, source), value); });
}
for (const id of ["color-contrast-checker", "color-palette-extractor"]) {
    const file = `src/app/tools/${id}/page.tsx`, source = readFileSync(file, "utf8"), ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const collect = (node: ts.Node) => { if (ts.isStringLiteral(node) && node.text) assert.ok(SHARED_TRANSLATIONS[node.text], `${id}: untranslated ${node.text}`); else if (ts.isConditionalExpression(node)) { collect(node.whenTrue); collect(node.whenFalse); } };
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && ["t", "setError"].includes(node.expression.getText(ast)) && node.arguments[0]) collect(node.arguments[0]);
        if (ts.isJsxText(node) && /[a-zA-Z]/.test(node.text)) assert.ok(["rgb(", "hsl("].includes(node.text.trim()), `${id}: raw text ${node.text}`);
        ts.forEachChild(node, visit);
    }; visit(ast);
}

const nativeRequire = createRequire(import.meta.url), jsx = nativeRequire("react/jsx-runtime");
type Node = { type: unknown; props: Record<string, any> };
function harness(id: string) {
    let language: Language = "en", cursor = 0, dirty = false;
    const hooks: { value: any; deps?: unknown[] }[] = [], effects: (() => void)[] = [], copies: string[] = [], readers: any[] = [], images: any[] = [];
    const work = { canvas: 0, pixels: new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 255, 255]), canvasMissing: false };
    const hook = () => cursor++;
    const react = { ...React,
        useState: (initial: any) => { const n = hook(); hooks[n] ??= { value: initial }; return [hooks[n].value, (next: any) => { hooks[n].value = typeof next === "function" ? next(hooks[n].value) : next; dirty = true; }]; },
        useRef: (initial: any) => { const n = hook(); hooks[n] ??= { value: { current: initial } }; return hooks[n].value; },
        useMemo: (factory: () => any, deps: unknown[]) => { const n = hook(); if (!hooks[n] || !hooks[n].deps || deps.some((value, index) => value !== hooks[n].deps![index])) hooks[n] = { value: factory(), deps }; return hooks[n].value; },
        useEffect: (effect: () => void, deps: unknown[]) => { const n = hook(); if (!hooks[n] || !hooks[n].deps || deps.some((value, index) => value !== hooks[n].deps![index])) { hooks[n] = { value: null, deps }; effects.push(effect); } },
    };
    const component = (name: string) => function ColorFixture(props: Record<string, unknown>) { return React.createElement(name, props); };
    const Input = component("Input"), Upload = Object.assign(component("Upload"), { Dragger: component("Dragger") });
    const compiled = { exports: {} as { default: () => React.ReactNode } };
    const code = ts.transpileModule(readFileSync(`src/app/tools/${id}/page.tsx`, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    class Reader { result = "data:image/png;base64,PUBLIC"; onload?: () => void; onerror?: () => void; constructor() { readers.push(this); } readAsDataURL() {} }
    class Image { src = ""; naturalWidth = 2; naturalHeight = 1; onload?: () => void; onerror?: () => void; constructor() { images.push(this); } }
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: (name: string): any => {
        if (name === "react") return react;
        if (name === "react/jsx-runtime") return jsx;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (text: string, values?: Record<string, string | number>) => translate(language, text, values) }) };
        if (name === "antd") return new Proxy({ Input, Upload, Typography: { Text: component("Text"), Title: component("Title") } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name === "@ant-design/icons") return new Proxy({}, { get: (_target, key) => component(String(key)) });
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: component("Layout") };
        if (name.endsWith("color-palette")) return { extractPalette };
        if (name.endsWith("color-contrast")) return { colorContrast, parseContrastHex };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copies.push(value); return false; } };
        throw new Error(`Unexpected color dependency ${name}`);
    }, FileReader: Reader, Image, document: { createElement: () => { work.canvas++; return { width: 0, height: 0, getContext: () => work.canvasMissing ? null : { drawImage: () => {}, getImageData: () => ({ data: work.pixels }) } }; } } });
    let latest: Node[] = [];
    const walk = (value: any, out: Node[]) => { if (!value || typeof value !== "object") return; if (Array.isArray(value)) { value.forEach((child) => walk(child, out)); return; } if (typeof value.type === "function") { walk(value.type(value.props), out); return; } if (!value.props) return; out.push(value); for (const key of ["children", "title", "extra", "description"]) walk(value.props[key], out); };
    const render = (next: Language = language) => { language = next; for (let pass = 0; pass < 10; pass++) { dirty = false; cursor = 0; latest = []; walk(compiled.exports.default(), latest); effects.splice(0).forEach((effect) => effect()); if (!dirty) return latest; } throw new Error("Color effect loop"); };
    const find = (type: string, predicate: (node: Node) => boolean = () => true) => { const found = latest.find((node) => node.type === type && predicate(node)); assert.ok(found, `Missing ${id}/${type}`); return found; };
    return { render, find, copies, readers, images, work };
}
async function main() {
for (const current of LANGUAGES) {
    const contrast = harness("color-contrast-checker"); contrast.render(current.id);
    contrast.find("Input", (node) => node.props.value === "#171717").props.onChange({ target: { value: "invalid" } });
    let tree = contrast.render(); assert.ok(tree.some((node) => node.type === "Alert" && node.props.type === "error"));
    assert.ok(!tree.some((node) => node.type === "Tag"), "Invalid input has no fabricated pass/fail results");
    contrast.find("Input", (node) => node.props.value === "invalid").props.onChange({ target: { value: "000" } });
    tree = contrast.render(); assert.ok(!tree.some((node) => node.type === "Alert"));
    assert.ok(tree.some((node) => node.type === "div" && node.props.style?.background === "#ffffff" && node.props.style?.color === "#000000"), "Hash-free input uses the exact normalized preview colors");
    contrast.render("ar"); assert.equal(contrast.find("Input", (node) => node.props.value === "000").props.value, "000");
    const palette = harness("color-palette-extractor"); palette.render(current.id);
    let upload = palette.find("Dragger").props.beforeUpload;
    upload({ size: 16 }); upload({ size: 16 });
    palette.readers[0].onload(); assert.equal(palette.images.length, 0, "Stale image read cannot start a decode");
    palette.readers[1].onload(); palette.images[0].onload(); palette.render();
    assert.equal(palette.work.canvas, 1);
    const swatches = palette.find("Tag", (node) => typeof node.props.children === "string" && node.props.children === translate(current.id, "{count} swatches", { count: 2 })); assert.ok(swatches);
    const before = palette.work.canvas;
    palette.render("ar"); palette.render("ja"); assert.equal(palette.work.canvas, before, "Language changes do not recluster or reread pixels");
    const copy = palette.find("Button", (node) => node.props.children === translate("ja", "Copy")); await copy.props.onClick();
    assert.equal(palette.copies[0], "#ff0000  rgb(255, 0, 0)  hsl(0, 100%, 50%)\n#0000ff  rgb(0, 0, 255)  hsl(240, 100%, 50%)");
    // Clipboard returns false: the page delegates the result to the shared helper,
    // and has no independent success-toast call that could contradict failure.
    palette.find("Button", (node) => node.props.children === translate("ja", "Choose another")).props.onClick(); palette.render();
    upload = palette.find("Dragger").props.beforeUpload; upload({ size: 16 }); const stale = palette.readers.at(-1); upload({ size: 33 * 1024 * 1024 }); stale.onload();
    assert.equal(palette.images.length, 1, "Oversized replacement invalidates earlier pending file");
    let failed = palette.render(); assert.ok(failed.some((node) => node.type === "p" && node.props.role === "alert" && node.props.children === translate("ja", "Image file limit is 32 MiB.")));
    upload({ size: 16 }); palette.readers.at(-1).onerror(); failed = palette.render(); assert.ok(failed.some((node) => node.type === "p" && node.props.role === "alert"));
}
console.log("Color inspection: independent contrast/centroid/count fixtures, eight-language page handlers, invalid input recovery, normalized previews, exact copied colors, read/decode race guards and locale-stable extraction pass. No browser/UI or file-delivery verification.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

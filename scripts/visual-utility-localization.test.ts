import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { VISUAL_UTILITY_TRANSLATIONS, localizeVisualUtilityError } from "../src/lib/i18n/visual-utilities";
import * as cssEngine from "../src/lib/css-builders";
import * as colorEngine from "../src/lib/color-harmonies";
import * as codeEngine from "../src/lib/code-screenshot";

const paths = ["css-generators", "code-screenshot", "keycode-inspector"].map((id) => `src/app/tools/${id}/page.tsx`);
const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(VISUAL_UTILITY_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog missing ${source}`);
    for (const column of columns) { assert.ok(column.trim(), source); assert.deepEqual(placeholders(column), placeholders(source), source); }
    for (const [index, language] of LANGUAGES.slice(1).entries()) assert.equal(translate(language.id, source), columns[index], `${source}/${language.id}`);
}
for (const library of ["css-builders", "code-screenshot", "color-harmonies", "../workers/code-screenshot.worker"]) {
    const source = readFileSync(`src/lib/${library}.ts`, "utf8");
    for (const [, message] of source.matchAll(/throw new Error\("([^"]+)"\)/g)) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, message), `Missing diagnostic ${message}`);
}
for (const path of paths) {
    const source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const diagnostics = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true }).diagnostics ?? [];
    assert.equal(diagnostics.length, 0, path);
    const checkCopy = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, node.text), `Missing copy in ${path}: ${node.text}`);
        else if (ts.isConditionalExpression(node)) { checkCopy(node.whenTrue); checkCopy(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0]) checkCopy(node.arguments[0]);
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(["(px)", "1×", "2×", "3×", "×", "px ·", "KiB", "·", "/"].includes(node.text.trim()), `Unlocalized JSX in ${path}: ${node.text}`);
        if (ts.isJsxAttribute(node) && ["title", "description", "aria-label", "alt"].includes(node.name.getText(file))) assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `Unlocalized attribute in ${path}`);
        if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && ["input", "textarea", "code", "time"].includes(node.tagName.getText(file))) {
            const dir = node.attributes.properties.find((attr) => ts.isJsxAttribute(attr) && attr.name.getText(file) === "dir");
            assert.ok(dir && ts.isJsxAttribute(dir) && dir.initializer && ts.isStringLiteral(dir.initializer) && ["ltr", "auto"].includes(dir.initializer.text), `Explicit data direction required: ${path}`);
        }
        ts.forEachChild(node, visit);
    }; visit(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
}
const nativeRequire = createRequire(import.meta.url);
const React = nativeRequire("react") as typeof import("react");
const jsxRuntime = nativeRequire("react/jsx-runtime");
type Node = { type: unknown; props: Record<string, any> };
function harness(path: string, initial: Record<string, unknown> = {}) {
    let language: Language = "en", stateIndex = 0, refIndex = 0;
    const names: string[] = [], cells: any[] = [], refs: any[] = [], writes: string[] = [], copied: string[] = [], downloads: any[][] = [], painted: string[] = [], workerMessages: any[] = [];
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const collect = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file)); ts.forEachChild(node, collect); }; collect(file);
    const stub = () => null;
    const compiled = { exports: {} as { default: () => unknown } };
    const t = (source: string, values?: Record<string, string | number>) => translate(language, source, values);
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (fallback: any) => { const index = stateIndex++; if (!(index in cells)) cells[index] = Object.hasOwn(initial, names[index]) ? initial[names[index]] : fallback; return [cells[index], (value: any) => { cells[index] = typeof value === "function" ? value(cells[index]) : value; writes.push(names[index]); }]; }, useMemo: (compute: () => unknown) => compute(), useEffect: stub, useRef: (value: unknown) => { const index = refIndex++; return refs[index] ??= { current: value }; } };
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Record<string, any>) => React.createElement("div", null, props.title, props.description, JSON.stringify(props.learnMore ?? {}), props.children) };
        if (name === "@ant-design/icons") return { BgColorsOutlined: stub, CameraOutlined: stub, DesktopOutlined: stub };
        if (name.endsWith("css-builders")) return cssEngine;
        if (name.endsWith("color-harmonies")) return colorEngine;
        if (name.endsWith("code-screenshot")) return codeEngine;
        if (name.endsWith("i18n/visual-utilities")) return { localizeVisualUtilityError };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copied.push(value); return true; } };
        if (name.endsWith("download")) return { downloadText: (...args: any[]) => downloads.push(args), downloadBlob: (...args: any[]) => downloads.push(args) };
        throw new Error(`Unexpected dependency: ${name}`);
    };
    const source = readFileSync(path, "utf8").replace('new URL("../../../workers/code-screenshot.worker.ts",import.meta.url)', '"worker-fixture"');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    class WorkerStub { onmessage: any; terminate() {} postMessage(message: any) { workerMessages.push(message); queueMicrotask(() => this.onmessage({ data: { lines: codeEngine.plainCodeLines(message.source) } })); } }
    const context = new Proxy({ measureText: (text: string) => ({ width: Array.from(text).length * 10 }), fillText: (text: string) => painted.push(text) } as Record<string, any>, { get: (object, key: string) => object[key] ?? stub });
    const canvas = { width: 0, height: 0, getContext: () => context, toBlob: (callback: (blob: Blob) => void) => callback(new Blob(["png-fixture"])) };
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, Date, Number, Error, RangeError, Set, Intl, console, Blob, TextEncoder, Worker: WorkerStub, queueMicrotask, setTimeout, clearTimeout, crypto: { randomUUID: () => "fixture-added" }, URL: { createObjectURL: () => "blob:fixture", revokeObjectURL: stub }, getComputedStyle: () => ({ getPropertyValue: () => "monospace" }), document: { documentElement: {}, fonts: { load: async () => [] }, createElement: () => canvas } });
    const render = (nextLanguage: Language) => {
        language = nextLanguage; stateIndex = 0; refIndex = 0;
        const elements: Node[] = [], visible: string[] = [];
        const walk = (node: any) => {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { visible.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            if (typeof node.type === "function") { walk(node.type(node.props)); return; }
            if (node.props) { elements.push(node); walk(node.props.children); }
        }; walk(compiled.exports.default());
        const nodeText = (node: any): string => node == null || typeof node === "boolean" ? "" : typeof node === "string" || typeof node === "number" ? String(node) : Array.isArray(node) ? node.map(nodeText).join("") : nodeText(node.props?.children);
        const button = (label: string) => { const found = elements.find((node) => node.type === "button" && nodeText(node) === translate(nextLanguage, label)); assert.ok(found, `Missing button ${label}/${language}`); return found.props.onClick as () => unknown; };
        return { text: visible.join(" "), elements, button };
    };
    return { render, copied, downloads, writes, painted, workerMessages, refs, state: () => Object.fromEntries(names.map((name, index) => [name, cells[index]])) };
}
const preserve = (app: ReturnType<typeof harness>) => { const before = { ...app.state() }; app.writes.length = 0; app.render("ar"); app.render("ja"); assert.deepEqual(app.state(), before); assert.deepEqual(app.writes, []); };
async function main() {
for (const language of LANGUAGES) {
    const t = (source: string, values?: Record<string, string | number>) => translate(language.id, source, values);
    for (const mode of ["shadow", "radius", "fluid", "gradient"]) {
        const app = harness(paths[0], { mode }); const view = app.render(language.id);
        assert.ok(view.text.includes(t("CSS Visual Builders")));
        const css = view.elements.find((node) => node.type === "textarea")!;
        assert.ok(css.props.value.startsWith(".element {\n  "));
        assert.equal(css.props.dir, "ltr");
        view.button("Copy CSS")(); assert.equal(app.copied[0], css.props.value);
        view.button("Download CSS")(); assert.equal(app.downloads[0][0], css.props.value + "\n"); assert.equal(app.downloads[0][1], `${mode}.css`);
        assert.deepEqual(view.elements.filter((node) => node.type === "option").slice(0, 4).map((node) => node.props.value), ["shadow", "radius", "fluid", "gradient"]);
        preserve(app);
        if (mode === "shadow") { view.button("Add shadow layer")(); assert.equal(app.state().layers.length, 2); const next = app.render(language.id); next.button("Remove layer")(); assert.equal(app.state().layers.length, 1); app.render(language.id).button("Undo layer removal")(); assert.equal(app.state().layers.length, 2); }
        if (mode === "radius") { view.button("Use an ellipse")(); assert.equal(app.state().unit, "%"); assert.deepEqual(Array.from(app.state().horizontal), [50, 50, 50, 50]); }
        if (mode === "gradient") { view.button("Add color stop")(); assert.equal(app.state().stops.length, 3); const next = app.render(language.id); next.button("Remove stop")(); app.render(language.id).button("Undo stop removal")(); assert.equal(app.state().stops.length, 3); }
    }
    const badCss = harness(paths[0], { layers: [{ id: "x", x: 201, y: 0, blur: 0, spread: 0, color: "#000", inset: false }] });
    assert.ok(badCss.render(language.id).text.includes(t("{field} must be {minimum}–{maximum}.", { field: t("Horizontal offset"), minimum: -200, maximum: 200 })));
    assert.ok(harness(paths[0], { layers: [{ id: "x", x: 0, y: 0, blur: 0, spread: 0, color: "invalid", inset: false }] }).render(language.id).text.includes(t("Enter a HEX color with 3, 4, 6 or 8 digits.")));
    for (const [fixture, message] of [
        [{ layers: [] }, "Use 1–8 shadow layers."],
        [{ mode: "radius", horizontal: [1] }, "Enter four horizontal and four vertical corner radii."],
        [{ mode: "fluid", fluid: { narrowSize: 16, wideSize: 32, narrowViewport: 400, wideViewport: 400, rootSize: 16 } }, "Wide viewport must be larger than narrow viewport."],
        [{ mode: "gradient", stops: [] }, "Choose 2–8 gradient stops and a supported gradient type."],
    ] as const) {
        const view = harness(paths[0], fixture).render(language.id); assert.ok(view.text.includes(t(message))); assert.equal(view.elements.find((node) => node.type === "textarea")!.props.value, "");
    }
    const draft = "const message = 'مرحبا 世界';";
    const shot = harness(paths[1], { source: draft, language: "plaintext", title: "custom.ts" }); const shotView = shot.render(language.id);
    assert.ok(shotView.text.includes(t("Prepare the image to preview the exact PNG before downloading.")));
    assert.equal(shotView.elements.find((node) => node.type === "textarea")!.props.value, draft);
    const shotOptions = shotView.elements.filter((node) => node.type === "option");
    assert.deepEqual(shotOptions.slice(0, 19).map((node) => node.props.value), ["plaintext", "typescript", "javascript", "python", "java", "csharp", "go", "rust", "kotlin", "swift", "ruby", "php", "bash", "sql", "json", "yaml", "xml", "css", "markdown"]);
    assert.deepEqual(shotOptions.slice(19, 22).map((node) => node.props.value), ["midnight", "paper", "forest"]);
    for (const theme of Object.values(codeEngine.CODE_THEMES)) assert.ok(shotView.text.includes(t(theme.name)));
    assert.ok(shotView.text.includes(t("Plain text"))); assert.ok(shotView.text.includes(t("Shell")));

    shotView.button("Prepare image")();
    for (let attempt = 0; attempt < 12 && !shot.state().prepared; attempt++) await new Promise((resolve) => setTimeout(resolve, 0));
    assert.ok(shot.state().prepared, `${language.id}: image prepared`);
    assert.equal(shot.workerMessages[0].source, draft); assert.equal(shot.workerMessages[0].language, "plaintext");
    assert.ok(shot.painted.includes(draft));
    const preview = shot.render(language.id); assert.ok(preview.text.includes(t("PNG preview"))); preview.button("Download PNG")(); assert.equal(shot.downloads[0][1], "custom.png");
    preserve(shot);
    const title = preview.elements.find((node) => node.type === "input" && node.props.value === "custom.ts")!; title.props.onChange({ target: { value: "عنوان.ts" } });
    const stale = shot.render(language.id); assert.ok(stale.text.includes(t("Settings changed. Prepare the image again to update this preview."))); assert.ok(stale.elements.some((node) => node.type === "button" && node.props.disabled === true));
    for (const fixture of [{ source: "", error: "Enter code to render." }, { source: "x".repeat(20_001), error: "Use up to 20,000 characters and 64 KiB of code." }, { source: "x\n".repeat(500), error: "Use up to 500 source lines." }, { source: "x\u0001", error: "Remove nonprinting control characters from the code." }, { width: 0, source: "x", error: "Choose a width of 360–1600 px, font size 12–32 px, padding 0–96 px and scale 1–3." }]) {
        const app = harness(paths[1], fixture); app.render(language.id).button("Prepare image")(); await Promise.resolve(); const failure = app.render(language.id); assert.ok(failure.text.includes(t(fixture.error)), `${language.id}/${fixture.error}`); preserve(app); assert.equal(app.workerMessages.length, 0);
    }
    for (const diagnostic of Object.keys(VISUAL_UTILITY_TRANSLATIONS).filter((key) => /could not|timed out|exceeded|exceeds|failed|registered|unavailable|no lines/.test(key) && !key.includes("{line}"))) {
        const app = harness(paths[1], { error: `Error: Error: ${diagnostic}` }); assert.ok(app.render(language.id).text.includes(t(diagnostic))); preserve(app);
    }
    const dynamic = harness(paths[1], { error: "Error: Line 42 exceeds the image width. Enable line wrapping, increase width or reduce font size." }); assert.ok(dynamic.render(language.id).text.includes(t("Line {line} exceeds the image width. Enable line wrapping, increase width or reduce font size.", { line: 42 })));

    const keys = harness(paths[2], { prevent: true }); let keyView = keys.render(language.id);
    assert.ok(keyView.text.includes(t("No captured events")));
    let focused = 0, blurred = 0, prevented = 0;
    keys.refs[0].current = { focus: () => focused++, blur: () => blurred++ }; keyView.button("Focus capture area")(); assert.equal(focused, 1);
    const capture = keyView.elements.find((node) => node.props.className === "wb-key-capture")!;
    const event = (key: string, code: string, type = "keydown") => ({ type, key, code, location: 2, repeat: true, nativeEvent: { isComposing: true }, altKey: true, ctrlKey: false, metaKey: false, shiftKey: true, getModifierState: (key: string) => key === "AltGraph", preventDefault: () => prevented++ });
    capture.props.onFocus(); assert.ok(keys.render(language.id).text.includes(t("Listening in this area. Press a key.")));
    capture.props.onKeyDown(event(" ", "Space")); assert.equal(prevented, 1);
    keyView = keys.render(language.id); assert.ok(keyView.text.includes(t("Space"))); assert.ok(keyView.text.includes("Space")); assert.ok(keyView.text.includes(t("Right")));
    keyView.button("Copy events JSON")(); const exported = JSON.parse(keys.copied[0]); assert.equal(exported[0].key, " "); assert.equal(exported[0].code, "Space"); assert.equal(exported[0].location, 2); assert.equal(exported[0].repeat, true); assert.equal(exported[0].composing, true); assert.equal(exported[0].modifiers.altGraph, true);
    keyView.button("Download events JSON")(); assert.equal(keys.downloads[0][0], keys.copied[0]); assert.equal(keys.downloads[0][1], "keyboard-events.json"); preserve(keys);
    capture.props.onKeyUp(event("界", "KeyA", "keyup")); assert.equal(keys.state().history[0].key, "界"); assert.equal(keys.state().history[0].event, "keyup");
    capture.props.onKeyDown(event("Tab", "Tab")); assert.equal(prevented, 2); const count = keys.state().history.length;
    capture.props.onKeyDown(event("Escape", "Escape")); assert.equal(blurred, 1); assert.equal(keys.state().history.length, count);
    for (let index = 0; index < 105; index++) capture.props.onKeyDown(event(String(index), "KeyA")); assert.equal(keys.state().history.length, 100);
    keys.render(language.id).button("Clear history")(); assert.equal(keys.state().history.length, 0);
}
console.log("Visual utilities localization: eight languages; four builders, exact CSS/PNG/keyboard data, renderer/validation diagnostics, prepared/stale previews, real callbacks, capture modifiers/Tab/Escape/history limits and state-preserving language changes pass.");

}
main().catch((cause) => { console.error(cause); process.exitCode = 1; });

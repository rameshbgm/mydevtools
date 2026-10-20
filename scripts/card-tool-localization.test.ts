/* eslint-disable @typescript-eslint/no-explicit-any -- Hook VM fixtures inspect actual heterogeneous page callbacks. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { CARD_TOOL_TRANSLATIONS as rows } from "../src/lib/i18n/card-tools";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
const ids = ["credit-card-validator", "credit-card-generator"];
const root = process.env.CARD_STAGE_ROOT ?? process.cwd();
const placeholders = (text: string) => (text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
const tr = (language: Language, source: string, values: Record<string, string | number> = {}) => {
    let value = language === "en" ? source : rows[source]?.[LANGUAGES.findIndex(item => item.id === language) - 1] ?? translate(language, source);
    for (const [key, item] of Object.entries(values)) value = value.replaceAll(`{${key}}`, String(item));
    return value;
};
for (const [source, columns] of Object.entries(rows)) {
    assert.equal(columns.length, 7, source);
    columns.forEach((value, index) => {
        assert.ok(value.trim()); assert.deepEqual(placeholders(value), placeholders(source));
        if (SHARED_TRANSLATIONS[source]) assert.deepEqual(columns, SHARED_TRANSLATIONS[source], `Shared collision: ${source}`);
        if (!process.env.CARD_STAGE_ROOT) assert.equal(translate(LANGUAGES[index + 1].id, source), value, `Catalog wiring: ${source}`);
    });
}
for (const id of ids) {
    const source = readFileSync(resolve(root, `src/app/tools/${id}/page.tsx`), "utf8"), file = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function scan(node: ts.Node) {
        if (ts.isJsxText(node)) assert.doesNotMatch(node.text, /[A-Za-z]/, `${id}: raw authored UI copy`);
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0]) {
            const collect = (child: ts.Node) => {
                if (ts.isStringLiteral(child)) assert.ok(rows[child.text] || SHARED_TRANSLATIONS[child.text], `${id}: untranslated ${child.text}`);
                else if (ts.isConditionalExpression(child)) { collect(child.whenTrue); collect(child.whenFalse); }
            }; collect(node.arguments[0]);
        }
        ts.forEachChild(node, scan);
    } scan(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
}
import { CARD_TYPES, luhnCheck, type GeneratedCard } from "../src/lib/credit-card";
import { parseString } from "@fast-csv/parse";
const parseCsv = (csv: string) => new Promise<string[][]>((resolve, reject) => { const rows: string[][] = []; parseString(csv).on("error", reject).on("data", row => rows.push(row)).on("end", () => resolve(rows)); });
const nativeRequire = createRequire(resolve("package.json")), React = nativeRequire("react"), jsxRuntime = nativeRequire("react/jsx-runtime");
function harness(id: string, initial: Record<string, any> = {}, saved: string | null = null) {
    const source = readFileSync(resolve(root, `src/app/tools/${id}/page.tsx`), "utf8"), file = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), stateNames: string[] = [];
    function scan(node: ts.Node) {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") stateNames.push(node.name.elements[0].getText(file));
        ts.forEachChild(node, scan);
    } scan(file);
    const cells: any[] = [], refs: any[] = [], effects: any[] = [], memos: any[] = [], writes: string[] = [], storageWrites: string[] = [], copies: { value: string; label?: string }[] = [], downloads: { value: string; filename: string; mime: string }[] = [];
    let generationCalls = 0;
    let stateIndex = 0, refIndex = 0, effectIndex = 0, memoIndex = 0, language: Language = "en", renderPhase = false, now = 1_000_000, nextTimer = 0, randomCalls = 0;
    const randomValues: number[] = [], timers = new Map<number, { fn: () => void; delay: number; due: number; interval: boolean }>();
    const schedule = (fn: () => void, delay = 0, interval = false) => { const id = ++nextTimer; timers.set(id, { fn, delay, due: now + delay, interval }); return id; };
    const clear = (id: number) => timers.delete(id);
    const advance = (ms: number) => {
        now += ms;
        // Simulate a throttled browser: each due interval callback runs once, not once per missed tick.
        for (const [key, item] of [...timers]) if (timers.has(key) && item.due <= now) { if (item.interval) item.due = now + item.delay; else timers.delete(key); item.fn(); }
    };
    const memoCell = (fn: () => any, deps: any[]) => { const i = memoIndex++; if (!memos[i] || deps.some((value, k) => value !== memos[i].deps[k])) memos[i] = { deps, value: fn() }; return memos[i].value; };
    const hooks = { ...React,
        useState: (fallback: any) => { const i = stateIndex++; if (!(i in cells)) cells[i] = Object.hasOwn(initial, stateNames[i]) ? initial[stateNames[i]] : typeof fallback === "function" ? fallback() : fallback; return [cells[i], (value: any) => { assert.ok(!renderPhase, `${id}: state writes during render`); cells[i] = typeof value === "function" ? value(cells[i]) : value; writes.push(stateNames[i]); }]; },
        useRef: (fallback: any) => { const i = refIndex++; return refs[i] ?? (refs[i] = { current: fallback }); }, useMemo: memoCell,
        useCallback: (fn: any, deps: any[]) => memoCell(() => fn, deps),
        useEffect: (fn: any, deps: any[] = []) => { const i = effectIndex++; if (!effects[i] || deps.some((value, k) => value !== effects[i].deps[k])) effects[i] = { fn, deps, pending: true, cleanup: effects[i]?.cleanup }; },
    };
    const ui = (tag: string) => function FixtureUI(props: any) { return React.createElement(tag, props, props.title || props.extra ? [props.title, props.extra, props.children] : props.children); };
    const stub = () => null, motion = new Proxy({}, { get: (_, tag) => ui(`motion-${String(tag)}`) });
    const dependencies = (name: string): any => {
        if (name === "react") return hooks;
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => { const locale = language; return { language: locale, direction: locale === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => tr(locale, source, values) }; } };
        if (name.endsWith("store")) return { useAppStore: () => ({ darkMode: false }) };
        if (name.endsWith("project-storage")) return { projectStorage: { getItem: () => saved, setItem: (_: string, value: string) => storageWrites.push(value) } };
        if (name.endsWith("clipboard")) return { copyToClipboard: (value: string, label?: string) => { copies.push({ value, label }); return Promise.resolve(true); } };
        if (name.endsWith("download")) return { downloadText: (value: string, filename: string, mime: string) => downloads.push({ value, filename, mime }) };
        if (name.endsWith("table-export")) return nativeRequire(resolve("src/lib/table-export.ts"));
        if (name.endsWith("credit-card")) { const actual = nativeRequire(resolve("src/lib/credit-card.ts")); return { ...actual, generateCard: (...args: any[]) => { generationCalls++; return actual.generateCard(...args); }, generateCardNumber: (...args: any[]) => { generationCalls++; return actual.generateCardNumber(...args); } }; }
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: any) => React.createElement("layout", props, props.title, props.description, Object.values(props.learnMore ?? {}).flat(), props.children) };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => stub });
        if (name === "framer-motion") return { motion, AnimatePresence: ui("presence") };
        if (name === "antd") return { Button: ui("button"), Card: ui("card"), Typography: { Text: ui("text"), Title: ui("title"), Paragraph: ui("paragraph") }, Row: ui("row"), Col: ui("col"), Space: Object.assign(ui("space"), { Compact: ui("compact") }), Select: ui("select"), Input: ui("input"), InputNumber: ui("number"), Statistic: ui("statistic"), Switch: ui("switch"), Table: ui("table"), Tag: ui("tag"), Tooltip: ui("tooltip"), Progress: ui("progress"), Divider: ui("divider"), Alert: ui("alert"), Segmented: ui("segmented") };
        throw new Error(`Unexpected dependency ${name}`);
    };
    class ClockDate extends Date { static now() { return now; } }
    const math = Object.create(Math); math.random = () => { randomCalls++; return randomValues.shift() ?? 0.25; };
    const compiled = { exports: {} as { default: () => any } };
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, { module: compiled, exports: compiled.exports, require: dependencies, Date: ClockDate, Math: math, setTimeout: (fn: () => void, delay: number) => schedule(fn, delay), setInterval: (fn: () => void, delay: number) => schedule(fn, delay, true), clearTimeout: clear, clearInterval: clear });
    const state = () => JSON.parse(JSON.stringify(Object.fromEntries(stateNames.map((key, i) => [key, cells[i]]))));
    const render = (next = language) => {
        language = next; stateIndex = refIndex = effectIndex = memoIndex = 0;
        const elements: any[] = [], text: string[] = [];
        const walk = (node: any): void => {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { text.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            if (typeof node.type === "function") { walk(node.type(node.props)); return; }
            elements.push(node); walk(node.props?.children);
        };
        renderPhase = true; try { walk(compiled.exports.default()); } finally { renderPhase = false; }
        effects.forEach(effect => { if (effect.pending) { effect.cleanup?.(); effect.pending = false; effect.cleanup = effect.fn(); } });
        const find = (type: string, predicate: (props: any) => boolean = () => true) => { const element = elements.find(node => node.type === type && predicate(node.props)); assert.ok(element, `${id}: missing ${type}`); return element.props; };
        return { elements, text: text.join(" "), find, button: (source: string, values?: Record<string, string | number>) => find("button", props => props.children === tr(language, source, values)) };
    };
    const stable = () => { const before = state(), generated = generationCalls, count = randomCalls, tasks = [...timers.keys()], storage = [...storageWrites]; writes.length = 0; for (const item of LANGUAGES) render(item.id); assert.deepEqual(state(), before, `${id}: locale mutated data`); assert.deepEqual(writes, [], `${id}: locale wrote state`); assert.equal(randomCalls, count, `${id}: locale rerolled`); assert.equal(generationCalls, generated, `${id}: locale generated card data`); assert.deepEqual([...timers.keys()], tasks, `${id}: locale restarted timer`); assert.deepEqual(storageWrites, storage, `${id}: locale wrote storage`); };
    return { render, state, stable, advance, timers, randomValues, storageWrites, copies, downloads, generationCalls: () => generationCalls, randomCalls: () => randomCalls, cleanup: () => effects.forEach(effect => effect.cleanup?.()) };
}
const fixtureCards: GeneratedCard[] = [
    { brand: "Visa", color: "#1a1f71", number: "4111111111111111", formatted: "4111 1111 1111 1111", cvv: "007", expiry: "01/30", holder: '=PUBLIC,"日本語"\r\nمرحبا 🌍', length: 16 },
    { brand: "American Express", color: "#006fcf", number: "378282246310005", formatted: "3782 822463 10005", cvv: "0001", expiry: "02/31", holder: "+Public Test", length: 15 },
];
async function main() {
for (const language of LANGUAGES) {
    for (const [input, success] of [["4111-1111 1111-1111", true], ["4111x111111111111", false], ["4111111111111111abc", false], ["４１１１１１１１１１１１１１１１", false], ["4111111111111112", false], ["4111111111111111\n", false]] as const) {
        const validator = harness("credit-card-validator"); let view = validator.render(language.id); view.find("input").onChange({ target: { value: input } }); view = validator.render();
        assert.equal(view.find("alert").type, success ? "success" : "error", input); assert.equal(validator.state().cardNumber, input); validator.stable(); assert.equal(validator.generationCalls(), 0); validator.cleanup();
    }
    const validator = harness("credit-card-validator", { mode: "generate", generateCount: 3, generateType: "American Express" }); let view = validator.render(language.id); view.button("Generate").onClick(); view = validator.render(); const batch = validator.state().generatedCards; assert.equal(batch.length, 3); batch.forEach((number: string) => { assert.equal(number.length, 15); assert.equal(luhnCheck(number), true); }); validator.stable();
    view = validator.render(language.id); view.find("select").onChange("Visa"); view = validator.render(); assert.ok(view.find("card", props => props.type === "inner").title.includes("American Express")); view.button("Copy All").onClick(); assert.equal(validator.copies.at(-1)?.value, batch.join("\n")); assert.equal(validator.copies.at(-1)?.label, tr(language.id, "Card numbers copied!")); assert.equal(validator.generationCalls(), 3); validator.stable(); validator.cleanup();
    for (const count of [0, 101, 1.5]) { const invalid = harness("credit-card-validator", { mode: "generate", generateCount: count }); const view = invalid.render(language.id); assert.ok(view.button("Generate").disabled); view.button("Generate").onClick(); assert.equal(invalid.generationCalls(), 0); invalid.cleanup(); }

    const initial = harness("credit-card-generator"); initial.render(language.id); assert.equal(initial.generationCalls(), 0, "No random cards during initial SSR render"); initial.render(); initial.render(); assert.equal(initial.generationCalls(), 4); initial.stable(); initial.cleanup();
    for (const type of CARD_TYPES) {
        const generator = harness("credit-card-generator", { cards: fixtureCards, brand: type.name, length: type.lengths.at(-1), count: 2 }); generator.render(language.id); view = generator.render(); view.button("Generate").onClick(); view = generator.render(); const cards = generator.state().cards; assert.equal(cards.length, 2); for (const card of cards) { assert.equal(card.brand, type.name); assert.equal(card.number.length, type.lengths.at(-1)); assert.equal(card.cvv.length, type.cvvLength); assert.equal(luhnCheck(card.number), true); } generator.stable(); generator.cleanup();
    }
    const generator = harness("credit-card-generator", { cards: fixtureCards }); generator.render(language.id); view = generator.render(); view.find("select", props => props["aria-label"] === tr(language.id, "Card brand")).onChange("American Express"); view = generator.render(); assert.deepEqual(generator.state().cards, fixtureCards); assert.ok(view.find("select", props => props["aria-label"] === tr(language.id, "Card brand")).options.some((option: any) => option.value === "Visa" && option.label === "Visa"));
    for (const format of ["plain", "csv", "json"] as const) {
        view = generator.render(language.id); view.find("segmented").onChange(format); view = generator.render(); view.button("Download").onClick(); view.button("Copy all").onClick(); const download = generator.downloads.at(-1)!; assert.equal(generator.copies.at(-1)?.value, download.value); assert.equal(download.filename, `test-cards.${format === "plain" ? "txt" : format}`); assert.equal(download.mime, format === "plain" ? "text/plain;charset=utf-8" : format === "csv" ? "text/csv;charset=utf-8" : "application/json;charset=utf-8");
        if (format === "plain") assert.equal(download.value, fixtureCards.map(card => card.number).join("\n"));
        if (format === "json") assert.deepEqual(JSON.parse(download.value), fixtureCards.map(({ brand, number, cvv, expiry, holder }) => ({ brand, number, cvv, expiry, holder })));
        if (format === "csv") assert.deepEqual(await parseCsv(download.value), [["brand", "number", "cvv", "expiry", "holder"], ...fixtureCards.map(card => [card.brand, card.number, card.cvv, card.expiry, card.holder])]);
        generator.stable();
    }
    view = generator.render(language.id); const face = view.find("button", props => props.title === tr(language.id, "Copy card number")); face.onClick(); assert.equal(generator.copies.at(-1)?.value, fixtureCards[0].number); assert.equal(generator.copies.at(-1)?.label, tr(language.id, "{label} copied", { label: tr(language.id, "Card number") })); assert.equal(generator.generationCalls(), 0); generator.cleanup();
    for (const count of [0, 51, 1.5]) { const invalid = harness("credit-card-generator", { cards: fixtureCards, count }); let view = invalid.render(language.id); view = invalid.render(); assert.ok(view.button("Generate").disabled); view.button("Generate").onClick(); assert.equal(invalid.generationCalls(), 0); invalid.cleanup(); }
}
console.log(`Card tools: two actual pages, ${Object.keys(rows).length} complete translation rows; strict input, generated brand snapshots, all-brand callbacks and exact plain/CSV/JSON exports passed in eight languages.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });

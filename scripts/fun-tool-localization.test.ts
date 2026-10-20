/* eslint-disable @typescript-eslint/no-explicit-any -- Hook VM fixtures inspect actual heterogeneous page callbacks. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { FUN_TOOL_TRANSLATIONS as rows } from "../src/lib/i18n/fun-tools";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
const ids = ["coin-toss", "dice-roll", "timer", "stopwatch", "spin-wheel", "magic-8ball", "typing-test"];
const root = process.env.FUN_STAGE_ROOT ?? process.cwd();
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
        if (!process.env.FUN_STAGE_ROOT) assert.equal(translate(LANGUAGES[index + 1].id, source), value, `Catalog wiring: ${source}`);
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
const nativeRequire = createRequire(resolve("package.json")), React = nativeRequire("react"), jsxRuntime = nativeRequire("react/jsx-runtime");
function harness(id: string, initial: Record<string, any> = {}, saved: string | null = null) {
    const source = readFileSync(resolve(root, `src/app/tools/${id}/page.tsx`), "utf8"), file = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), stateNames: string[] = [];
    function scan(node: ts.Node) {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") stateNames.push(node.name.elements[0].getText(file));
        ts.forEachChild(node, scan);
    } scan(file);
    const cells: any[] = [], refs: any[] = [], effects: any[] = [], memos: any[] = [], writes: string[] = [], storageWrites: string[] = [];
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
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: any) => React.createElement("layout", props, props.title, props.description, Object.values(props.learnMore ?? {}).flat(), props.children) };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => stub });
        if (name === "framer-motion") return { motion, AnimatePresence: ui("presence") };
        if (name === "antd") return { Button: ui("button"), Card: ui("card"), Typography: { Text: ui("text"), Title: ui("title") }, Row: ui("row"), Col: ui("col"), Space: Object.assign(ui("space"), { Compact: ui("compact") }), Select: ui("select"), Input: ui("input"), InputNumber: ui("number"), Statistic: ui("statistic"), Switch: ui("switch"), Table: ui("table"), Tag: ui("tag"), Tooltip: ui("tooltip"), Progress: ui("progress"), Divider: ui("divider") };
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
    const stable = () => { const before = state(), count = randomCalls, tasks = [...timers.keys()], storage = [...storageWrites]; writes.length = 0; for (const item of LANGUAGES) render(item.id); assert.deepEqual(state(), before, `${id}: locale mutated data`); assert.deepEqual(writes, [], `${id}: locale wrote state`); assert.equal(randomCalls, count, `${id}: locale rerolled`); assert.deepEqual([...timers.keys()], tasks, `${id}: locale restarted timer`); assert.deepEqual(storageWrites, storage, `${id}: locale wrote storage`); };
    return { render, state, stable, advance, timers, randomValues, storageWrites, randomCalls: () => randomCalls, cleanup: () => effects.forEach(effect => effect.cleanup?.()) };
}
for (const language of LANGUAGES) {
    const coin = harness("coin-toss"); let view = coin.render(language.id); coin.render();
    view.button("Flip Coin").onClick(); view = coin.render(); coin.stable(); coin.randomValues.push(0); coin.advance(1400); view = coin.render(); assert.equal(coin.state().result, "heads"); assert.equal(coin.state().stats.heads, 1); assert.ok(view.text.includes(tr("ar", "Heads"))); coin.stable();
    view = coin.render(language.id); view.find("switch").onChange(true); coin.render(); coin.advance(1400); coin.render(); coin.advance(1500); coin.render(); coin.advance(1400); view = coin.render(); assert.equal(coin.state().stats.heads, 3, "Auto flip must continue after first completion"); view.button("Clear All").onClick(); coin.render(); coin.advance(10000); coin.render(); assert.equal(coin.state().stats.heads, 0); assert.equal(coin.timers.size, 0); coin.cleanup();

    for (const mode of ["normal", "advantage", "disadvantage"]) {
        const dice = harness("dice-roll", { mode, dieCount: 3 }); view = dice.render(language.id); view = dice.render(); view.button("Roll {count}d{sides}", { count: mode === "normal" ? 3 : 2, sides: 6 }).onClick(); view = dice.render(); assert.ok(view.find("select", props => props.value === 6).disabled); dice.stable(); dice.randomValues.push(...(mode === "normal" ? [0.25, 0.25, 0.25, 0, 0.999999, 0.5] : [0.25, 0.25, 0, 0.999999])); dice.advance(700); view = dice.render(); const entry = dice.state().history[0]; assert.ok(entry.rolls.every((v: number) => v >= 1 && v <= 6)); assert.equal(entry.total, mode === "normal" ? 11 : mode === "advantage" ? 6 : 1); dice.stable(); dice.cleanup(); assert.equal(dice.timers.size, 0);
    }

    const timer = harness("timer", { totalSeconds: 10, remainingSeconds: 10, timerLabel: "日本語 مرحبا Focus 🌍" }); view = timer.render(language.id); view = timer.render(); view.button("Start").onClick(); timer.render(); timer.advance(4100); timer.render(); assert.equal(timer.state().remainingSeconds, 6, "Countdown catches up after throttled callbacks"); timer.stable(); view = timer.render(language.id); view.button("Pause").onClick(); timer.render(); timer.advance(20000); assert.equal(timer.state().remainingSeconds, 6); view = timer.render(language.id); view.button("Start").onClick(); timer.render(); timer.advance(5900); view = timer.render(); assert.equal(timer.state().isComplete, true); assert.equal(timer.state().sessions, 1); timer.stable(); timer.advance(3000); timer.render(); assert.equal(timer.state().sessions, 1); assert.equal(timer.state().timerLabel, "日本語 مرحبا Focus 🌍"); timer.cleanup(); assert.equal(timer.timers.size, 0);

    const watch = harness("stopwatch"); view = watch.render(language.id); view.button("Start").onClick(); watch.render(); watch.advance(1234); view = watch.render(language.id); view.button("Lap").onClick(); view = watch.render(); assert.equal(watch.state().laps[0].lapTime, 1234); watch.stable(); watch.advance(66); view = watch.render(language.id); view.button("Pause").onClick(); watch.render(); assert.equal(watch.state().display, 1300); watch.advance(2000); view = watch.render(language.id); view.button("Resume").onClick(); watch.render(); watch.advance(400); view = watch.render(language.id); view.button("Lap").onClick(); watch.render(); assert.equal(watch.state().laps[0].lapTime, 466); watch.stable(); watch.cleanup(); assert.equal(watch.timers.size, 0);

    const labels = ["日本語 🌍", "مرحبا %252F", "Option A"];
    const wheel = harness("spin-wheel", {}, JSON.stringify(labels)); wheel.render(language.id); view = wheel.render(); wheel.randomValues.push(0.5, 0, 0); view.button("Spin!").onClick(); view = wheel.render(); assert.ok(view.find("input").disabled); assert.ok(view.find("button", props => props["aria-label"] === tr(language.id, "Delete")).disabled); wheel.stable(); wheel.advance(4200); wheel.render(); assert.equal(wheel.state().winner, labels[1]); assert.deepEqual(wheel.state().items, labels); assert.equal(wheel.storageWrites.length, 0); wheel.stable(); wheel.cleanup(); assert.equal(wheel.timers.size, 0);
    const corrupt = harness("spin-wheel", {}, '{"wrong":"shape"}'); corrupt.render(language.id); assert.equal(corrupt.state().items.length, 6); corrupt.cleanup();

    const ball = harness("magic-8ball", { question: "هل 🌍 日本語?" }); view = ball.render(language.id); ball.randomValues.push(0.999999); view.button("Ask the 8-Ball").onClick(); ball.render(); ball.stable(); ball.advance(900); view = ball.render(); assert.equal(ball.state().fortune.text, "Very doubtful."); assert.equal(ball.state().history[0].q, "هل 🌍 日本語?"); assert.ok(view.text.includes(tr("ar", "Very doubtful."))); ball.stable(); view = ball.render(language.id); view.button("Ask the 8-Ball").onClick(); ball.render(); view.button("Reset").onClick(); ball.render(); ball.advance(900); ball.render(); assert.equal(ball.state().fortune, null); assert.equal(ball.state().shaking, false); assert.deepEqual(ball.state().history, []); ball.cleanup(); assert.equal(ball.timers.size, 0);

    const typing = harness("typing-test"); typing.render(language.id); view = typing.render(); view.find("textarea").onChange({ target: { value: "The quick" } }); typing.render(); typing.stable(); typing.advance(30000); view = typing.render(); assert.equal(typing.state().timeLeft, 30); typing.stable(); typing.advance(30000); view = typing.render(); assert.equal(typing.state().results.length, 1); assert.equal(typing.state().results[0].wpm, 2); assert.equal(typing.state().results[0].accuracy, 100); typing.stable(); assert.equal(typing.state().results.length, 1); typing.cleanup(); assert.equal(typing.timers.size, 0);
    const duration = harness("typing-test"); duration.render(language.id); view = duration.render(); view.find("select").onChange(15); view = duration.render(); assert.equal(duration.state().duration, 15); assert.equal(duration.state().timeLeft, 15); view.find("textarea").onChange({ target: { value: "" } }); duration.render(); assert.equal(duration.state().started, false); duration.cleanup(); duration.advance(50); assert.equal(duration.timers.size, 0);
}
// Cancelling or leaving an animation must not publish a result later.
for (const id of ["coin-toss", "dice-roll", "spin-wheel", "magic-8ball"]) {
    const test = harness(id); test.render(); const view = test.render();
    const label = id === "coin-toss" ? "Flip Coin" : id === "dice-roll" ? "Roll {count}d{sides}" : id === "spin-wheel" ? "Spin!" : "Ask the 8-Ball";
    view.button(label, id === "dice-roll" ? { count: 2, sides: 6 } : undefined).onClick(); test.render(); assert.ok(test.timers.size > 0);
    const before = test.state(); test.cleanup(); assert.equal(test.timers.size, 0); test.advance(10000); assert.deepEqual(test.state(), before);
}
for (const id of ids) { const page = harness(id); page.render(); assert.equal(page.randomCalls(), 0, `${id}: deterministic initial render`); page.cleanup(); }
// Fractional pause/resume time is preserved instead of granting an extra second.
const precise = harness("timer", { totalSeconds: 2, remainingSeconds: 2 }); let preciseView = precise.render(); preciseView.button("Start").onClick(); precise.render(); precise.advance(350); preciseView = precise.render(); preciseView.button("Pause").onClick(); precise.render(); precise.advance(5000); preciseView = precise.render(); preciseView.button("Start").onClick(); precise.render(); precise.advance(1649); precise.render(); assert.equal(precise.state().isComplete, false); precise.advance(250); precise.render(); assert.equal(precise.state().isComplete, true); precise.cleanup();
console.log(`Fun tools: ${ids.length} actual pages, ${Object.keys(rows).length} complete translation rows, eight-language callback/timer/random fixtures passed.`);

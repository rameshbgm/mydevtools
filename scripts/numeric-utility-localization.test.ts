import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, translate, type Language } from "../src/lib/i18n/catalog";
import { NUMERIC_UTILITY_TRANSLATIONS, numericUtilityMessage } from "../src/lib/i18n/numeric-utilities";
import { SEO_CONTENT } from "../src/lib/seo-content";
import { convertIntegerBase } from "../src/lib/number-base";
import { generateSecrets } from "../src/lib/random-secrets";

const ids = ["number-base", "password-generator", "timestamp-converter", "unix-permissions"];
const technical = new Set(["R", "W", "X", "ISO 8601", "755", "chmod", "filename", "chmod -R", "directory/", "r", "w", "x", "-", "=", ":", "."]);
const placeholders = (value: string) => [...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map((match) => match[1]).sort();
for (const [source, columns] of Object.entries(NUMERIC_UTILITY_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    columns.forEach((value, index) => {
        assert.ok(value.trim(), source);
        assert.deepEqual(placeholders(value), placeholders(source), source);
        assert.equal(translate(LANGUAGES[index + 1].id, source), value, `Catalog integration: ${source}`);
    });
}
function requireCopy(value: string) {
    if (!value || technical.has(value)) return;
    assert.ok(NUMERIC_UTILITY_TRANSLATIONS[value] || LANGUAGES.slice(1).every((lang) => translate(lang.id, value) !== value), `Missing authored copy: ${value}`);
}
for (const id of ids) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const inspect = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) requireCopy(node.text);
        else if (ts.isArrayLiteralExpression(node)) node.elements.forEach(inspect);
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(technical.has(node.text.trim()) || /^\d+$/.test(node.text.trim()), `Untranslated JSX in ${id}: ${node.text.trim()}`);
        if (ts.isCallExpression(node) && node.expression.getText(ast) === "t" && node.arguments[0]) inspect(node.arguments[0]);
        if (ts.isPropertyAssignment(node) && ["whatIs", "whyUse", "howToUse", "tips", "useCases", "desc", "read", "write", "execute"].includes(node.name.getText(ast)) && ts.isStringLiteral(node.initializer)) inspect(node.initializer);
        if (ts.isPropertyAssignment(node) && ["howToUse", "tips", "useCases"].includes(node.name.getText(ast))) inspect(node.initializer);
        if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
            const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
            if (["Input", "InputNumber", "textarea", "select"].includes(node.tagName.getText(ast))) {
                assert.ok(attrs.some((attr) => attr.name.getText(ast) === "dir" && attr.initializer && ts.isStringLiteral(attr.initializer) && attr.initializer.text === "ltr"), `Machine direction: ${id}`);
            }
            if (node.tagName.getText(ast) === "option") assert.ok(attrs.some((attr) => attr.name.getText(ast) === "value"), `Stable option values: ${id}`);
        }
        ts.forEachChild(node, visit);
    };
    visit(ast);
    assert.match(source, /useLanguage\(\)/);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
    for (const faq of SEO_CONTENT[id]?.faq ?? []) { requireCopy(faq.q); requireCopy(faq.a); }
}

const nativeRequire = createRequire(import.meta.url), React = nativeRequire("react") as typeof import("react"), jsx = nativeRequire("react/jsx-runtime");
type Element = { type: unknown; props: Record<string, unknown> };
type Dependencies = { deps: unknown[]; value?: unknown };
function harness(id: string, overrides: Record<string, unknown> = {}, forcedDiagnostic?: string) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8"), ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const hooks: string[] = [];
    const collect = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(ast) === "useState") hooks.push(node.name.elements[0].getText(ast));
        ts.forEachChild(node, collect);
    }; collect(ast);
    let language: Language = "en", slot = 0, memoSlot = 0, effectSlot = 0;
    const state = new Map<string, unknown>(), memos: Dependencies[] = [], effects: Dependencies[] = [], pending: (() => void)[] = [];
    const log = { copies: [] as string[], notices: [] as string[], generatorCalls: 0, conversionCalls: 0, effectRuns: 0 };
    const message = { error: (value: string) => log.notices.push(value), warning: (value: string) => log.notices.push(value) };
    const changed = (previous: Dependencies | undefined, deps: unknown[]) => !previous || deps.some((value, index) => !Object.is(value, previous.deps[index]));
    const component = (name: string) => function HarnessComponent(props: Record<string, unknown>) { return React.createElement(name, props, props.children as import("react").ReactNode); };
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React,
            useState: (initial: unknown) => {
                const key = hooks[slot++]; assert.ok(key, "Known state hook");
                if (!state.has(key)) state.set(key, Object.hasOwn(overrides, key) ? overrides[key] : typeof initial === "function" ? (initial as () => unknown)() : initial);
                return [state.get(key), (value: unknown) => state.set(key, typeof value === "function" ? (value as (previous: unknown) => unknown)(state.get(key)) : value)];
            },
            useMemo: (compute: () => unknown, deps: unknown[]) => { const index = memoSlot++; if (changed(memos[index], deps)) memos[index] = { deps, value: compute() }; return memos[index].value; },
            useCallback: (callback: unknown) => callback,
            useEffect: (effect: () => void, deps: unknown[]) => { const index = effectSlot++; if (changed(effects[index], deps)) { effects[index] = { deps }; pending.push(() => { log.effectRuns++; effect(); }); } },
        };
        if (name === "react/jsx-runtime") return jsx;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (key: string, values?: Record<string, string | number>) => translate(language, key, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Record<string, unknown>) => React.createElement("Layout", props, String(props.title), String(props.description), Object.values(props.learnMore as Record<string, string | string[]>).flat().map((key) => translate(language, key)).join(" "), props.children as import("react").ReactNode) };
        if (name.endsWith("numeric-utilities")) return { numericUtilityMessage };
        if (name.endsWith("number-base")) return { convertIntegerBase: (...args: Parameters<typeof convertIntegerBase>) => { log.conversionCalls++; if (forcedDiagnostic) throw new Error(forcedDiagnostic); return convertIntegerBase(...args); } };
        if (name.endsWith("random-secrets")) return { generateSecrets: (...args: Parameters<typeof generateSecrets>) => { log.generatorCalls++; return generateSecrets(...args); } };
        if (name.endsWith("clipboard")) return { copyToClipboard: (value: string, notice?: string) => { log.copies.push(value); if (notice) log.notices.push(notice); return Promise.resolve(true); } };
        if (name.endsWith("BulkSecretGenerator")) return { __esModule: true, default: () => null };
        if (name.endsWith("SimpleList")) return { __esModule: true, default: (props: { dataSource: unknown[]; renderItem: (item: unknown, index: number) => unknown; renderExtra: (item: unknown) => unknown }) => props.dataSource.map((item, index) => [props.renderItem(item, index), props.renderExtra(item)]) };
        if (name === "antd") return new Proxy({ App: { useApp: () => ({ message }) }, Typography: { Text: component("Text"), Title: component("Title") } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => () => null });
        throw new Error(`Unexpected import: ${name}`);
    };
    const compiled = { exports: {} as { default: () => unknown } };
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, Error, Number, Date, crypto: globalThis.crypto });
    function render(next: Language) {
        language = next; slot = 0; memoSlot = 0; effectSlot = 0;
        const nodes: Element[] = [], visible: string[] = [];
        const walk = (value: unknown) => {
            if (value === null || value === undefined || typeof value === "boolean") return;
            if (typeof value === "string" || typeof value === "number") { visible.push(String(value)); return; }
            if (Array.isArray(value)) { value.forEach(walk); return; }
            const element = value as Element;
            if (typeof element.type === "function") { walk((element.type as (props: unknown) => unknown)(element.props)); return; }
            if (!element.props) return;
            nodes.push(element); walk(element.props.children);
            for (const prop of ["title", "extra", "suffix"]) walk(element.props[prop]);
        };
        walk(compiled.exports.default());
        return { nodes, text: visible.join(" ") };
    }
    return { render, state, log, mount: () => { render("en"); pending.splice(0).forEach((effect) => effect()); } };
}
type Page = ReturnType<ReturnType<typeof harness>["render"]>;
const find = (page: Page, predicate: (node: Element) => boolean) => { const node = page.nodes.find(predicate); assert.ok(node, "Expected control"); return node; };
const click = (page: Page, text: string) => (find(page, (node) => ["button", "Button"].includes(String(node.type)) && node.props.children === text).props.onClick as () => void)();
const change = (node: Element, value: string | boolean) => (node.props.onChange as (event: unknown) => void)({ target: { value, checked: value } });
const snapshot = (state: Map<string, unknown>) => JSON.stringify([...state]);

// Every arbitrary source/destination base remains a machine value, including beyond Number precision.
const exact = "12345678901234567890123456789012345678901234567890";
for (let base = 2; base <= 36; base++) assert.equal(convertIntegerBase(convertIntegerBase(exact, 10, base), base, 10), exact);
assert.equal(convertIntegerBase("f".repeat(4096), 16, 16), "f".repeat(4096));
for (const input of ["", "-", "0x", "1.5", "1e3", "٢٥٥", "1".repeat(4097)]) assert.throws(() => convertIntegerBase(input, "auto", 16));
for (const language of LANGUAGES) {
    const t = (key: string, values?: Record<string, string | number>) => translate(language.id, key, values);
    const base = harness("number-base", { input: "-0x" + "f".repeat(128), from: "auto", to: 36 });
    let page = base.render("en"); const original = snapshot(base.state), calls = base.log.conversionCalls;
    page = base.render(language.id);
    assert.ok(page.text.includes(t("Integer to convert"))); assert.equal(snapshot(base.state), original); assert.equal(base.log.conversionCalls, calls);
    const output = convertIntegerBase(String(base.state.get("input")), "auto", 36);
    assert.equal(find(page, (node) => node.type === "textarea" && node.props.readOnly === true).props.value, output);
    const selects = page.nodes.filter((node) => node.type === "select");
    assert.equal(selects[0].props.value, "auto"); assert.equal(selects[1].props.value, 36);
    assert.deepEqual(page.nodes.filter((node) => node.type === "option").map((node) => node.props.value), ["auto", ...Array.from({ length: 35 }, (_, index) => index + 2), ...Array.from({ length: 35 }, (_, index) => index + 2)]);
    click(page, t("Copy result")); assert.equal(base.log.copies.at(-1), output);
    click(page, t("Copy common bases")); assert.equal(base.log.copies.at(-1), [2, 8, 10, 16].map((radix) => `Base ${radix}: ${convertIntegerBase(String(base.state.get("input")), "auto", radix)}`).join("\n"));
    click(page, t("Swap conversion direction")); assert.equal(base.state.get("input"), output); assert.equal(base.state.get("from"), 36); assert.equal(base.state.get("to"), 10);
    page = base.render(language.id); change(find(page, (node) => node.type === "textarea" && !node.props.readOnly), "z");
    page = base.render(language.id); assert.ok(!page.nodes.some((node) => node.props.role === "alert"));
    change(page.nodes.filter((node) => node.type === "select")[0], "2"); page = base.render(language.id);
    assert.ok(page.text.includes(t("“{digit}” is not a digit in base {base}.", { digit: "z", base: 2 })));
    for (const input of ["", "-", "0x", "1.5", "1".repeat(4097)]) {
        const invalid = harness("number-base", { input, from: "auto", to: 16 });
        const errorPage = invalid.render(language.id);
        const alert = find(errorPage, (node) => node.props.role === "alert"); assert.ok(alert);
        assert.equal(invalid.state.get("input"), input);
        let detail = ""; try { convertIntegerBase(input, "auto", 16); } catch (cause) { detail = (cause as Error).message; }
        assert.ok(errorPage.text.includes(numericUtilityMessage(t, detail)!));
    }
    const maximum = harness("number-base", { input: "z".repeat(4096), from: 36, to: 16 });
    const maximumPage = maximum.render(language.id);
    assert.equal(find(maximumPage, (node) => node.type === "textarea" && node.props.readOnly === true).props.value, convertIntegerBase("z".repeat(4096), 36, 16));
    const diagnostic = 'custom engine: 日本語 العربية\nexact RAW';
    const raw = harness("number-base", {}, diagnostic).render(language.id); assert.ok(raw.text.includes(diagnostic)); assert.ok(raw.text.includes(t("Conversion diagnostic")));

    const secret = harness("password-generator"); secret.mount(); page = secret.render("en");
    const first = String(secret.state.get("password")); assert.equal(first.length, 16); assert.equal(secret.log.generatorCalls, 1);
    const before = snapshot(secret.state); page = secret.render(language.id);
    assert.equal(snapshot(secret.state), before); assert.equal(secret.log.generatorCalls, 1); assert.equal(secret.log.effectRuns, 1);
    assert.ok(page.text.includes(t("Password Strength"))); assert.ok(page.text.includes(first));
    click(page, t("Copy Password")); assert.equal(secret.log.copies.at(-1), first);
    (find(page, (node) => node.type === "InputNumber").props.onChange as (value: number) => void)(32);
    page = secret.render(language.id); click(page, t("Generate New")); assert.equal(secret.log.generatorCalls, 2);
    assert.equal(String(secret.state.get("password")).length, 32); assert.equal((secret.state.get("history") as string[])[0], secret.state.get("password"));
    const saved = snapshot(secret.state); secret.render("ar"); secret.render(language.id); assert.equal(snapshot(secret.state), saved); assert.equal(secret.log.generatorCalls, 2);
    page = secret.render(language.id); click(page, t("Clear")); assert.equal((secret.state.get("history") as string[]).length, 0);
    secret.state.set("options", { lowercase: true, uppercase: false, numbers: false, symbols: false });
    page = secret.render(language.id); click(page, t("Generate New")); assert.match(String(secret.state.get("password")), /^[a-z]{32}$/);
    page = secret.render(language.id);
    (find(page, (node) => node.type === "Switch" && node.props["aria-label"] === t("Uppercase (A-Z)")).props.onChange as (value: boolean) => void)(true);
    assert.equal((secret.state.get("options") as { uppercase: boolean }).uppercase, true);
    secret.state.set("options", { lowercase: false, uppercase: false, numbers: false, symbols: false });
    page = secret.render(language.id); click(page, t("Generate New")); assert.equal(secret.log.notices.at(-1), t("Select at least one character set")); assert.equal(String(secret.state.get("password")).length, 32);
    secret.state.set("password", "a"); assert.ok(secret.render(language.id).text.includes(t("Weak")));
    secret.state.set("password", "abcdefgh"); assert.ok(secret.render(language.id).text.includes(t("Weak")));
    secret.state.set("password", "abcdefghiA"); assert.ok(secret.render(language.id).text.includes(t("Fair")));
    secret.state.set("password", "abcdefghiA12"); assert.ok(secret.render(language.id).text.includes(t("Good")));
    secret.state.set("password", "abcdefghiA12!XYZ"); assert.ok(secret.render(language.id).text.includes(t("Strong")));

    const timestamp = harness("timestamp-converter");
    const initialClock = timestamp.render("en");
    assert.deepEqual(initialClock.nodes.filter((node) => node.type === "Title").map((node) => node.props.children), ["—", "—", "—"], "Initial server/client clock markup must not depend on the time or local timezone");
    timestamp.mount();
    timestamp.state.set("timestamp", "1700000000"); timestamp.state.set("dateStr", "draft 日本語 العربية");
    page = timestamp.render("en"); const timeBefore = snapshot(timestamp.state); const current = page.nodes.filter((node) => node.type === "Title").map((node) => node.props.children);
    page = timestamp.render(language.id); assert.equal(snapshot(timestamp.state), timeBefore); assert.equal(timestamp.log.effectRuns, 1);
    const clockTitles = page.nodes.filter((node) => node.type === "Title").map((node) => node.props.children);
    assert.deepEqual(clockTitles.slice(0, 2), current.slice(0, 2));
    assert.equal(clockTitles[2], (timestamp.state.get("now") as Date).toLocaleString(language.id));
    click(page, t("Convert to Date")); assert.equal(timestamp.state.get("dateStr"), "2023-11-14T22:13:20.000Z");
    timestamp.state.set("timestamp", "1700000000123"); page = timestamp.render(language.id); click(page, t("Convert to Date")); assert.equal(timestamp.state.get("dateStr"), "2023-11-14T22:13:20.123Z");
    timestamp.state.set("timestamp", "-1000000000"); page = timestamp.render(language.id); click(page, t("Convert to Date")); assert.equal(timestamp.state.get("dateStr"), "1938-04-24T22:13:20.000Z");
    timestamp.state.set("timestamp", "1700000000123"); page = timestamp.render(language.id); click(page, t("Convert to Date"));
    page = timestamp.render(language.id); click(page, t("Convert to Timestamp")); assert.equal(timestamp.state.get("timestamp"), "1700000000");
    for (const value of ["", " ", "nope", "1700000000junk", "1.5", "1e3", "Infinity", "999999999999999999999", "9007199254740992", "8640000000000001", "-8640000000000001"]) {
        timestamp.state.set("timestamp", value); timestamp.state.set("dateStr", "unchanged 日本語 العربية"); page = timestamp.render(language.id);
        assert.doesNotThrow(() => click(page, t("Convert to Date"))); assert.equal(timestamp.state.get("timestamp"), value); assert.equal(timestamp.state.get("dateStr"), "unchanged 日本語 العربية");
        assert.equal(timestamp.log.notices.at(-1), t("Enter a whole-number timestamp within the supported date range."));
    }
    timestamp.state.set("dateStr", "not-a-date"); timestamp.state.set("timestamp", "original"); page = timestamp.render(language.id); click(page, t("Convert to Timestamp")); assert.equal(timestamp.state.get("timestamp"), "original"); assert.equal(timestamp.log.notices.at(-1), t("Invalid date"));
    for (const value of ["0", "-1", "+1700000000", " 1700000000 ", "8640000000000000"]) { timestamp.state.set("timestamp", value); page = timestamp.render(language.id); click(page, t("Convert to Date")); assert.ok(!isNaN(new Date(String(timestamp.state.get("dateStr"))).getTime())); }
    page = timestamp.render(language.id); (find(page, (node) => node.type === "Button" && typeof node.props.onClick === "function" && !node.props.children).props.onClick as () => void)(); assert.match(timestamp.log.copies.at(-1)!, /^\d+$/); assert.equal(timestamp.log.notices.at(-1), t("Timestamp copied!"));

    const permissions = harness("unix-permissions", { octalInput: "0644" });
    page = permissions.render("en"); const permissionsBefore = snapshot(permissions.state); page = permissions.render(language.id);
    assert.equal(snapshot(permissions.state), permissionsBefore); assert.ok(page.text.includes(t("Owner (User)"))); assert.ok(page.text.includes("chmod"));
    const preset = find(page, (node) => node.type === "button" && node.props.children != null && JSON.stringify(node.props.children).includes('"600"'));
    (preset.props.onClick as () => void)(); page = permissions.render(language.id);
    assert.equal(permissions.state.get("octalInput"), "600"); assert.ok(page.text.includes("rw-------"));
    click(page, t("Copy")); assert.equal(permissions.log.copies.at(-1), "600");
    const checkbox = find(page, (node) => node.type === "Checkbox" && node.props["aria-label"] === t("Group can write")); change(checkbox, true);
    page = permissions.render(language.id); assert.ok(page.text.includes("rw--w----"));
    const originalPermissions = JSON.stringify(permissions.state.get("permissions"));
    change(find(page, (node) => node.type === "Input"), "899"); page = permissions.render(language.id);
    assert.equal(permissions.state.get("octalInput"), "899"); assert.equal(JSON.stringify(permissions.state.get("permissions")), originalPermissions);
    change(find(page, (node) => node.type === "Input"), "0644"); page = permissions.render(language.id);
    assert.ok(page.text.includes("rw-r--r--"));
    const commands = page.nodes.filter((node) => node.props.copyable).map((node) => (node.props.copyable as { text: string }).text);
    assert.deepEqual(commands, ["chmod 644 filename", "chmod -R 644 directory/"]);
}
console.log(`Numeric utilities: ${Object.keys(NUMERIC_UTILITY_TRANSLATIONS).length} copy keys, all 8 languages, exact engine fixtures, preserved state, real callbacks and timestamp boundary guards passed.`);

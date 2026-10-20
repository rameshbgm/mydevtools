import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { TEMPORAL_UNIT_TRANSLATIONS } from "../src/lib/i18n/temporal-unit";
import * as unitEngine from "../src/lib/unit-converter";
import * as timezoneEngine from "../src/lib/timezone-planner";
import * as totpEngine from "../src/lib/totp";

const paths = ["totp-generator", "timezone-planner", "unit-converter"].map((id) => `src/app/tools/${id}/page.tsx`);
const placeholderNames = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(TEMPORAL_UNIT_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog missing ${source}`);
    for (const column of columns) {
        assert.ok(column.trim(), source);
        assert.deepEqual(placeholderNames(column), placeholderNames(source), source);
    }
    for (const [index, language] of LANGUAGES.slice(1).entries()) assert.equal(translate(language.id, source), columns[index], `${source}/${language.id}: unexpected catalog override`);
}
for (const category of unitEngine.UNIT_CATEGORIES) for (const name of [category.name, ...category.units.map((unit) => unit.name)]) assert.ok(Object.hasOwn(TEMPORAL_UNIT_TRANSLATIONS, name), `Missing library display label ${name}`);
for (const library of ["totp", "timezone-planner", "unit-converter"]) {
    const source = readFileSync(`src/lib/${library}.ts`, "utf8");
    for (const [, message] of source.matchAll(/throw new Error\("([^"]+)"\)/g)) assert.ok(Object.hasOwn(TEMPORAL_UNIT_TRANSLATIONS, message), `Missing library error ${message}`);
}
for (const path of paths) {
    const source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const checkCopy = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, node.text), `Missing copy in ${path}: ${node.text}`);
        else if (ts.isConditionalExpression(node)) { checkCopy(node.whenTrue); checkCopy(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0]) checkCopy(node.arguments[0]);
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(["SHA-1", "SHA-256", "SHA-512", "6", "8", "(", ")", "="].includes(node.text.trim()), `Unlocalized JSX in ${path}: ${node.text}`);
        if (ts.isJsxAttribute(node) && ["title", "description", "aria-label"].includes(node.name.getText(file))) assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `Unlocalized attribute in ${path}`);
        if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && ["input", "output", "code"].includes(node.tagName.getText(file))) {
            const direction = node.attributes.properties.find((attr) => ts.isJsxAttribute(attr) && attr.name.getText(file) === "dir");
            assert.ok(direction && ts.isJsxAttribute(direction) && direction.initializer && ts.isStringLiteral(direction.initializer) && direction.initializer.text === "ltr", `Machine data must be LTR in ${path}`);
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/, "Locale switches must preserve state");
}

// Render the actual page functions and invoke their real callbacks, using persistent
// hook cells across language switches. No browser, network, or crypto timer is needed.
const nativeRequire = createRequire(import.meta.url);
const React = nativeRequire("react") as typeof import("react");
const jsxRuntime = nativeRequire("react/jsx-runtime");
type ElementNode = { type: unknown; props: Record<string, unknown> };
function harness(path: string, initial: Record<string, unknown> = {}) {
    let language: Language = "en", stateIndex = 0;
    const names: string[] = [];
    const cells: unknown[] = [];
    const writes: string[] = [];
    const copied: string[] = [];
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const collect = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file));
        ts.forEachChild(node, collect);
    };
    collect(file);
    const stub = () => null;
    const compiled = { exports: {} as { default: () => unknown } };
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (fallback: unknown) => { const index = stateIndex++; if (!(index in cells)) cells[index] = Object.hasOwn(initial, names[index]) ? initial[names[index]] : fallback; return [cells[index], (value: unknown) => { cells[index] = typeof value === "function" ? (value as (old: unknown) => unknown)(cells[index]) : value; writes.push(names[index]); }]; }, useMemo: (compute: () => unknown) => compute(), useEffect: stub };
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t: (source: string, values?: Record<string, string | number>) => translate(language, source, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Record<string, unknown>) => React.createElement("div", null, props.title as string, props.description as string, props.children as import("react").ReactNode) };
        if (name === "@ant-design/icons") return { SafetyOutlined: stub, GlobalOutlined: stub, SwapOutlined: stub };
        if (name.endsWith("unit-converter")) return unitEngine;
        if (name.endsWith("timezone-planner")) return timezoneEngine;
        if (name.endsWith("totp")) return totpEngine;
        if (name.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copied.push(value); return true; } };
        throw new Error(`Unexpected dependency: ${name}`);
    };
    const code = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, Date, Number, Error, RangeError, Set, Intl, console });
    const render = (nextLanguage: Language) => {
        language = nextLanguage; stateIndex = 0;
        const elements: ElementNode[] = [], visible: string[] = [];
        const walk = (node: unknown) => {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { visible.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            const element = node as ElementNode;
            if (typeof element.type === "function") { walk((element.type as (props: unknown) => unknown)(element.props)); return; }
            if (element.props) { elements.push(element); walk(element.props.children); }
        };
        walk(compiled.exports.default());
        const text = visible.join(" ");
        const button = (label: string) => {
            const translated = translate(nextLanguage, label);
            const found = elements.find((element) => element.type === "button" && element.props.children === translated);
            assert.ok(found, `Button ${label}/${language}`);
            return found.props.onClick as () => unknown;
        };
        return { text, elements, button };
    };
    return { render, copied, writes, state: () => Object.fromEntries(names.map((name, index) => [name, cells[index]])) };
}
for (const language of LANGUAGES) {
    const empty = harness(paths[0]).render(language.id);
    assert.ok(empty.text.includes(translate(language.id, "Enter a Base32 secret to generate a code.")));
    const otp = harness(paths[0], { secret: "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", live: false, timestamp: "59", digits: 8, result: { code: "94287082", remaining: 1, counter: "1" } });
    const otpPage = otp.render(language.id);
    assert.ok(otpPage.text.includes("94287082"));
    assert.ok(otpPage.text.includes(translate(language.id, "{seconds} seconds until the next code · counter {counter}", { seconds: 1, counter: "1" })));
    assert.ok(otpPage.elements.some((node) => node.type === "output" && node.props["aria-label"] === translate(language.id, "Authenticator code") && node.props.dir === "ltr"));
    otpPage.button("Copy code")(); assert.equal(otp.copied[0], "94287082");
    const savedOtp = { ...otp.state() }; otp.writes.length = 0; otp.render("ar"); otp.render("ja"); assert.deepEqual(otp.state(), savedOtp); assert.deepEqual(otp.writes, []);
    for (const source of Object.keys(TEMPORAL_UNIT_TRANSLATIONS).filter((source) => /Base32 secret|nonnegative Unix/.test(source))) {
        const error = harness(paths[0], { error: source }).render(language.id);
        assert.ok(error.elements.some((node) => node.props.role === "alert" && node.props.children === translate(language.id, source)));
    }

    const planner = harness(paths[1], { date: "2026-10-20T10:30", reference: "UTC", zones: ["Asia/Singapore", "America/New_York"], nextZone: "Asia/Tokyo" });
    const meeting = planner.render(language.id);
    assert.ok(meeting.text.includes("2026-10-20T10:30:00.000Z"));
    assert.ok(meeting.text.includes("Asia/Singapore"));
    assert.ok(meeting.text.includes(translate(language.id, "Within hours")));
    assert.ok(meeting.text.includes(translate(language.id, "Outside hours / weekend")));
    assert.deepEqual(meeting.elements.filter((node) => node.type === "option").slice(0, 3).map((node) => node.props.value), ["reject", "earlier", "later"]);
    meeting.button("Copy comparison")();
    assert.ok(planner.copied[0].includes("Asia/Singapore\t2026-10-20 18:30\tUTC+08:00\t"));
    assert.ok(planner.copied[0].includes(translate(language.id, "Outside working hours")));
    const savedMeeting = { ...planner.state() }; planner.writes.length = 0; planner.render("ar"); planner.render("hi"); assert.deepEqual(planner.state(), savedMeeting); assert.deepEqual(planner.writes, []);
    meeting.button("Move meeting one hour later")(); assert.equal(planner.state().date, "2026-10-20T11:30");
    const zoneFailures = [
        ["2026-03-08T02:30", "America/New_York", "This local time does not exist because the timezone's clock moves forward. Choose another time."],
        ["2026-11-01T01:30", "America/New_York", "This local time occurs twice when the clock moves back. Choose the earlier or later occurrence."],
        ["2026-10-20T10:30", "invalid/fixture", "Choose a valid IANA timezone."],
        ["bad-date", "UTC", "Choose a date and time in YYYY-MM-DDTHH:mm format."],
        ["1969-10-20T10:30", "UTC", "Choose a valid date from 1970 through 2100."],
    ];
    for (const [date, reference, error] of zoneFailures) {
        const failed = harness(paths[1], { date, reference, zones: [] }).render(language.id);
        assert.ok(failed.elements.some((node) => node.props.role === "alert" && node.props.children === translate(language.id, error)), `${language.id}: ${error}`);
    }

    for (const category of unitEngine.UNIT_CATEGORIES) {
        const converter = harness(paths[2], { category: category.name, from: category.units[0].symbol, to: category.units[1].symbol, input: "1.234e2", precision: 12 });
        const converted = converter.render(language.id);
        const selects = converted.elements.filter((node) => node.type === "select");
        assert.equal(selects[0].props.value, category.name);
        const options = converted.elements.filter((node) => node.type === "option");
        assert.deepEqual(options.slice(0, 34).map((node) => node.props.value), unitEngine.UNIT_CATEGORIES.map((item) => item.name));
        for (const unit of category.units) {
            const option = options.find((node) => node.props.value === unit.symbol); assert.ok(option, `${category.name}/${unit.symbol}`);
            assert.equal((option.props.children as unknown[])[0], translate(language.id, unit.name));
            assert.ok(converted.text.includes(unit.symbol), "Symbols remain exact");
        }
        assert.ok(converted.text.includes(translate(language.id, category.name)));
        const expected = Number(unitEngine.convertUnit(123.4, category.name, category.units[0].symbol, category.units[1].symbol).toPrecision(12)).toString();
        converted.button("Copy conversion")(); assert.equal(converter.copied[0], `${expected} ${category.units[1].symbol}`);
        const saved = { ...converter.state() }; converter.writes.length = 0; converter.render("ar"); converter.render("de"); assert.deepEqual(converter.state(), saved); assert.deepEqual(converter.writes, []);
        converted.button("Swap units")(); assert.equal(converter.state().input, expected); assert.equal(converter.state().from, category.units[1].symbol); assert.equal(converter.state().to, category.units[0].symbol);
    }
    const inputFailures = [
        { input: "1,2", error: "Enter a decimal number, optionally using scientific notation." },
        { input: "1e999", error: "Choose units in one category and enter a finite number." },
        { category: "Temperature", from: "K", to: "°C", input: "-1", error: "Absolute temperature cannot be below zero kelvin." },
        { category: "Length", from: "km", to: "nm", input: "1e308", error: "The converted value exceeds numeric range." },
    ];
    for (const fixture of inputFailures) {
        const failed = harness(paths[2], fixture).render(language.id);
        assert.ok(failed.elements.some((node) => node.props.role === "alert" && node.props.children === translate(language.id, fixture.error)), `${language.id}: ${fixture.error}`);
    }
}
console.log("Temporal/unit localization: eight languages, all 34 categories/202 unit labels, TOTP result/errors, DST/IANA recoveries, stable option IDs, exact outputs/clipboard, real callbacks and state-preserving language switches pass.");

/* eslint-disable @typescript-eslint/no-explicit-any, react/display-name -- The VM harness deliberately models arbitrary React props and anonymous UI doubles. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { COLOR_EMAIL_TRANSLATIONS } from "../src/lib/i18n/color-email";
import * as colors from "../src/lib/color-harmonies";
import type { MxDiagnostic } from "../src/lib/email-mx";

const paths = ["src/components/ColorHarmonies.tsx", "src/components/EmailMxDiagnostic.tsx", "src/app/tools/color-picker/page.tsx", "src/app/tools/email-validator/page.tsx"];
const placeholders = (s: string) => (s.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(COLOR_EMAIL_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog missing ${source}`);
    columns.forEach((value, i) => { assert.ok(value.trim()); assert.deepEqual(placeholders(value), placeholders(source)); assert.equal(translate(LANGUAGES[i + 1].id, source), value, `Catalog collision: ${source}`); });
}
for (const path of paths) {
    const source = readFileSync(path, "utf8"), file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const check = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(["Cloudflare", "Google Public DNS"].includes(node.text.trim()), `Unlocalized JSX ${path}: ${node.text}`);
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(SHARED_TRANSLATIONS[node.arguments[0].text], `Missing ${node.arguments[0].text}`);
        if (ts.isJsxAttribute(node) && ["description", "aria-label"].includes(node.name.getText(file))) assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `${path}: untranslated attribute`);
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ["input", "textarea", "Input", "TextArea", "code", "bdi"].includes(node.tagName.getText(file))) assert.ok(node.attributes.properties.some((p) => ts.isJsxAttribute(p) && p.name.getText(file) === "dir" && p.initializer && ts.isStringLiteral(p.initializer) && p.initializer.text === "ltr"), `${path}: technical field needs LTR`);
        ts.forEachChild(node, check);
    }; check(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
}
const nativeRequire = createRequire(import.meta.url), React = nativeRequire("react"), runtime = nativeRequire("react/jsx-runtime");
type Element = { type: string; props: Record<string, any> };
function harness(path: string, initial: Record<string, any> = {}, props: Record<string, any> = {}, lookupFailure?: unknown) {
    const source = readFileSync(path, "utf8"), file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), names: string[] = [];
    function collect(node: ts.Node) { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file)); ts.forEachChild(node, collect); } collect(file);
    let language: Language = "en", stateIndex = 0, memoIndex = 0;
    const cells: any[] = [], memos: { deps: unknown[]; value: unknown }[] = [], writes: string[] = [], copied: string[][] = [], downloads: string[][] = [], lookups: string[][] = [];
    const calls = { harmony: 0, parse: 0 }, stub = () => null, compiled = { exports: {} as { default: (p: Record<string, any>) => unknown } };
    const ui = (tag: string) => (p: Record<string, any>) => React.createElement(tag, p, p.title || p.extra ? [p.title, p.extra, p.children] : p.children);
    const input = Object.assign(ui("input"), { TextArea: ui("textarea") }), space = Object.assign(ui("space"), { Compact: ui("compact") });
    const dependencies = (name: string): any => {
        if (name === "react") return { ...React, useState: (fallback: unknown) => { const i = stateIndex++; if (!(i in cells)) cells[i] = Object.hasOwn(initial, names[i]) ? initial[names[i]] : fallback; return [cells[i], (value: any) => { cells[i] = typeof value === "function" ? value(cells[i]) : value; writes.push(names[i]); }]; }, useMemo: (compute: () => unknown, deps: unknown[]) => { const i = memoIndex++; if (!memos[i] || deps.some((value, k) => value !== memos[i].deps[k])) memos[i] = { deps, value: compute() }; return memos[i].value; } };
        if (name === "react/jsx-runtime") return runtime;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (s: string, values?: Record<string, string | number>) => translate(language, s, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (p: Record<string, any>) => React.createElement("layout", p, p.title, p.description, Object.values(p.learnMore ?? {}).flat(), p.children) };
        if (name.endsWith("ColorHarmonies") || name.endsWith("EmailMxDiagnostic")) return { __esModule: true, default: ui("nested-component") };
        if (name === "@ant-design/icons") return { BgColorsOutlined: stub, CopyOutlined: stub, CheckCircleOutlined: stub, CloseCircleOutlined: stub, ClearOutlined: stub, MailOutlined: stub };
        if (name === "antd") return { Button: ui("button"), Card: ui("card"), Space: space, Input: input, Tag: ui("tag"), Switch: ui("switch"), ColorPicker: ui("colorpicker"), Typography: { Text: ui("text") }, Table: (p: Record<string, any>) => React.createElement("table", p, p.columns.map((c: any) => c.title), p.dataSource.map((r: any) => p.columns.map((c: any) => c.render ? c.render(r[c.dataIndex], r) : r[c.dataIndex]))) };
        if (name.endsWith("color-harmonies")) return { ...colors, parseHexColor: (s: string) => { calls.parse++; return colors.parseHexColor(s); }, colorHarmony: (s: string, mode: colors.ColorHarmony) => { calls.harmony++; return colors.colorHarmony(s, mode); } };
        if (name.endsWith("email-mx")) return { lookupEmailMx: async (domain: string, resolver: string) => { lookups.push([domain, resolver]); if (lookupFailure !== undefined) throw lookupFailure; return fixture; } };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (...args: string[]) => { copied.push(args); return true; } };
        if (name.endsWith("download")) return { downloadText: (...args: string[]) => downloads.push(args) };
        throw new Error(`Unexpected dependency: ${name}`);
    };
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, { module: compiled, exports: compiled.exports, require: dependencies, Error, String });
    const state = () => Object.fromEntries(names.map((name, i) => [name, cells[i]]));
    const render = (next: Language) => {
        language = next; stateIndex = 0; memoIndex = 0;
        const elements: Element[] = [], visible: string[] = [];
        function walk(node: any) { if (node == null || typeof node === "boolean") return; if (typeof node === "string" || typeof node === "number") { visible.push(String(node)); return; } if (Array.isArray(node)) { node.forEach(walk); return; } if (typeof node.type === "function") { walk(node.type(node.props)); return; } if (node.props) { elements.push(node); walk(node.props.children); } }
        walk(compiled.exports.default(props));
        return { text: visible.join(" "), elements, button: (source: string) => { const node = elements.find((e) => e.type === "button" && e.props.children === translate(next, source)); assert.ok(node, `${source}/${next}`); return node.props.onClick; } };
    };
    const stable = () => { const before = JSON.stringify(state()), count = writes.length, counters = JSON.stringify(calls), requests = lookups.length; LANGUAGES.forEach(({ id }) => render(id)); assert.equal(JSON.stringify(state()), before); assert.equal(writes.length, count); assert.equal(JSON.stringify(calls), counters); assert.equal(lookups.length, requests); };
    return { render, state, calls, copied, downloads, lookups, stable };
}
const fixture: MxDiagnostic = { domain: "example.com", status: "mx", records: [{ priority: 10, exchange: "mail.example.com", ttl: 3600 }], addresses: [], authenticated: true };
const statusSources = [
    "MX records found. The domain publishes mail exchangers; this does not verify the mailbox or delivery.",
    "Null MX: this domain explicitly states that it does not accept email (RFC 7505).",
    "No MX records. Address records exist, so SMTP can attempt implicit delivery to the domain. This does not verify that an SMTP service is running.",
    "No MX or fallback A/AAAA address records were returned. Delivery is not currently discoverable through these DNS answers.",
    "NXDOMAIN: the resolver reports that this domain does not exist.",
    "Invalid null-MX configuration: the root target must be the only MX record with priority 0. Review the domain’s DNS configuration.",
];
async function main() {
for (const { id } of LANGUAGES) {
    const base = "#1567ab80", modes: colors.ColorHarmony[] = ["complementary", "analogous", "triadic", "split-complementary", "tetradic", "shades"];
    for (const mode of modes) {
        const palette = harness(paths[0], { mode }, { color: base }), view = palette.render(id), values = colors.colorHarmony(base, mode);
        assert.ok(view.text.includes(translate(id, "Harmonies & shade scales")));
        assert.deepEqual(view.elements.filter((e) => e.type === "option").map((e) => e.props.value), modes);
        assert.deepEqual(view.elements.filter((e) => e.type === "code").map((e) => e.props.children), values);
        const swatch = view.elements.find((e) => e.type === "button" && e.props["aria-label"])!;
        assert.equal(swatch.props["aria-label"], translate(id, "Copy palette color {index}: {value}", { index: 1, value: values[0] }));
        swatch.props.onClick(); view.button("Copy CSS variables")(); view.button("Download palette JSON")();
        assert.equal(palette.copied[0][0], values[0]);
        assert.equal(palette.copied[1][0], ":root {\n" + values.map((v, i) => `  --palette-${i + 1}: ${v};`).join("\n") + "\n}");
        assert.deepEqual(JSON.parse(palette.downloads[0][0]), { base, mode, colors: values });
        assert.deepEqual(palette.downloads[0].slice(1), ["palette.json", "application/json"]);
        assert.equal(palette.calls.harmony, 1); palette.stable();
        view.elements.find((e) => e.type === "select")!.props.onChange({ target: { value: "shades" } }); assert.equal(palette.state().mode, "shades");
    }
    const bad = harness(paths[0], {}, { color: "#invalid" }), badView = bad.render(id);
    assert.ok(badView.text.includes(translate(id, "Enter a HEX color with 3, 4, 6 or 8 digits."))); assert.ok(badView.elements.filter((e) => e.type === "button").every((e) => e.props.disabled)); bad.stable();

    for (const [index, status] of (["mx", "null-mx", "implicit", "no-address", "nxdomain", "invalid-mx"] as const).entries()) {
        const result = { ...fixture, status, addresses: ["192.0.2.1", "2001:db8::1"], authenticated: index % 2 === 0 }, mx = harness(paths[1], { result }, { domain: "example.com" }), view = mx.render(id);
        assert.ok(view.text.includes(translate(id, statusSources[index]))); assert.ok(view.text.includes("mail.example.com")); assert.ok(view.text.includes("192.0.2.1, 2001:db8::1"));
        assert.deepEqual(view.elements.filter((e) => e.type === "option").map((e) => e.props.value), ["cloudflare", "google"]);
        assert.ok(view.text.includes(translate(id, result.authenticated ? "The resolver set the DNSSEC authenticated-data flag." : "The resolver did not set the DNSSEC authenticated-data flag."))); mx.stable();
        view.elements.find((e) => e.type === "select")!.props.onChange({ target: { value: "google" } }); assert.equal(mx.state().resolver, "google"); assert.equal(mx.state().result, null); assert.equal(mx.state().error, "");
    }
    const empty = harness(paths[1], {}, { domain: "" }).render(id); assert.ok(empty.elements.find((e) => e.type === "button")!.props.disabled);
    const busy = harness(paths[1], { busy: true }, { domain: "example.com" }).render(id); assert.ok(busy.text.includes(translate(id, "Checking DNS…"))); assert.ok(busy.elements.find((e) => e.type === "select")!.props.disabled);
    const stale = harness(paths[1], { result: fixture }, { domain: "other.example" }).render(id); assert.ok(!stale.elements.some((e) => e.props.role === "status"));
    const lookup = harness(paths[1], { resolver: "google" }, { domain: "example.com" }); await lookup.render(id).button("Check domain MX")(); assert.deepEqual(lookup.lookups, [["example.com", "google"]]); assert.deepEqual(lookup.state().result, fixture); lookup.stable();
    for (const source of Object.keys(COLOR_EMAIL_TRANSLATIONS).filter((s) => /^(Enter an email domain|Enter a valid public|The resolver truncated|The resolver returned malformed|MX was absent|DNS resolver returned an empty|DNS response exceeds|DNS resolver response has|Choose a supported)/.test(s))) {
        const diagnostic = harness(paths[1], { error: source }, { domain: "example.com" }); assert.ok(diagnostic.render(id).text.includes(translate(id, source))); diagnostic.stable();
    }
    for (const [raw, source, status] of [["DNS resolver returned HTTP 429.", "DNS resolver returned HTTP {status}.", "429"], ["DNS resolver returned status 2. This does not establish whether mail is accepted.", "DNS resolver returned status {status}. This does not establish whether mail is accepted.", "2"]]) {
        const diagnostic = harness(paths[1], { error: raw }, { domain: "example.com" }); assert.ok(diagnostic.render(id).text.includes(translate(id, source, { status }))); diagnostic.stable();
    }
    const failure = harness(paths[1], {}, { domain: "example.com" }, new Error("Invalid")); await failure.render(id).button("Check domain MX")(); const failed = failure.render(id); assert.ok(failed.text.includes(translate(id, "DNS lookup failed. Resolver details:"))); assert.ok(failed.elements.some((e) => e.type === "bdi" && e.props.children === "Invalid")); assert.equal(failure.state().busy, false); failure.stable();

    const picker = harness(paths[2], { color: base }), view = picker.render(id); assert.ok(view.text.includes(translate(id, "Pick a Color"))); assert.ok(view.text.includes("#1567ab80")); view.button("Copy All Formats")();
    assert.equal(picker.copied[0][0], "HEX: #1567ab80\nRGB: rgba(21, 103, 171, 0.502)\nHSL: hsla(207.2, 78.12%, 37.65%, 0.502)"); assert.equal(picker.copied[0][1], translate(id, "All formats copied!"));
    view.elements.find((e) => e.type === "button" && e.props["aria-label"] === translate(id, "Copy"))!.props.onClick(); assert.equal(picker.copied[1][0], base); assert.equal(picker.copied[1][1], translate(id, "{format} copied!", { format: "HEX" })); picker.stable();
    view.elements.find((e) => e.type === "input")!.props.onChange({ target: { value: "#ff0000" } }); assert.equal(picker.state().color, "#ff0000");
    picker.render(id).elements.find((e) => e.type === "colorpicker")!.props.onChange({ toHexString: () => "#abcdef" }); assert.equal(picker.state().color, "#abcdef");
    const invalidPicker = harness(paths[2], { color: "#badhex" }); assert.ok(invalidPicker.render(id).text.includes(translate(id, "Enter a HEX color with 3, 4, 6 or 8 digits."))); invalidPicker.stable();

    const email = harness(paths[3]), emailView = email.render(id); assert.ok(emailView.text.includes(translate(id, "Single Email"))); assert.ok(emailView.text.includes(translate(id, "Valid: {count}", { count: 3 })));
    const table = emailView.elements.find((e) => e.type === "table")!; assert.equal(table.props.dataSource[1].email, "bob@mailinator.com"); assert.equal(table.props.dataSource[1].issues[0], "Disposable domain");
    assert.ok(emailView.text.includes(translate(id, "Invalid syntax"))); assert.equal(emailView.elements.find((e) => e.type === "nested-component")!.props.domain, "example.com"); email.stable();
    emailView.elements.find((e) => e.type === "switch" && e.props["aria-label"] === translate(id, "Allow disposable"))!.props.onChange(false);
    email.render(id).elements.find((e) => e.type === "switch" && e.props["aria-label"] === translate(id, "Allow role"))!.props.onChange(false);
    assert.ok(email.render(id).text.includes(translate(id, "Valid: {count}", { count: 1 }))); email.stable();
    emailView.button("Clear")(); assert.equal(email.state().single, ""); assert.ok(email.render(id).text.includes(translate(id, "Empty"))); email.stable();
    const cases = [["broken@", "Invalid syntax"], [".alice@example.com", "Local part starts/ends with dot"], ["ali..ce@example.com", "Consecutive dots in local part"], ["a".repeat(65) + "@example.com", "Local part exceeds 64 chars"], ["a@" + "b".repeat(250) + ".com", "Exceeds 254 chars"], ["admin@mailinator.com", "Role-based account"]];
    for (const [single, issue] of cases) { const diagnostic = harness(paths[3], { single }); assert.ok(diagnostic.render(id).text.includes(translate(id, issue))); diagnostic.stable(); }
    const draft = "Name@Example.COM", bulk = "Name@Example.COM\ninvalid@\n";
    email.render(id).elements.find((e) => e.type === "input")!.props.onChange({ target: { value: draft } }); email.render(id).elements.find((e) => e.type === "textarea")!.props.onChange({ target: { value: bulk } }); assert.equal(email.state().single, draft); assert.equal(email.state().bulk, bulk); email.stable();
}
console.log("Color/email localization: eight-language rendered modes, parent help/forms/tables, callback artifacts, MX statuses/errors, preserved raw diagnostics and locale-stable drafts/results passed; DNS mocked throughout.");

}
main().catch((error) => { console.error(error); process.exitCode = 1; });

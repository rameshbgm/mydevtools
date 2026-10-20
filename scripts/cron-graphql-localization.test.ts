import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { CRON_GRAPHQL_TRANSLATIONS } from "../src/lib/i18n/cron-graphql";
import * as cron from "../src/lib/cron-schedule";
import * as builder from "../src/lib/graphql-builder";
import * as graphql from "graphql";

const paths = ["src/components/CronFieldControl.tsx", "src/components/GraphqlVisualBuilder.tsx", "src/app/tools/cron-parser/page.tsx", "src/app/tools/graphql-explorer/page.tsx"];
const placeholders = (s: string) => (s.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(CRON_GRAPHQL_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog missing ${source}`);
    columns.forEach((value, i) => { assert.ok(value.trim()); assert.deepEqual(placeholders(value), placeholders(source)); assert.equal(translate(LANGUAGES[i + 1].id, source), value, `Catalog collision: ${source}`); });
}
for (const path of paths) {
    const source = readFileSync(path, "utf8"), file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const check = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(["UTC", "·", "(", ":", ")"].includes(node.text.trim()), `Unlocalized JSX ${path}: ${node.text}`);
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(SHARED_TRANSLATIONS[node.arguments[0].text], `Missing ${node.arguments[0].text}`);
        if (ts.isJsxAttribute(node) && ["title", "description", "aria-label"].includes(node.name.getText(file))) assert.ok(node.initializer && ts.isJsxExpression(node.initializer), `${path}: untranslated attribute`);
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ["input", "textarea", "TextArea", "code", "time"].includes(node.tagName.getText(file))) assert.ok(node.attributes.properties.some((p) => ts.isJsxAttribute(p) && p.name.getText(file) === "dir" && p.initializer && ts.isStringLiteral(p.initializer) && p.initializer.text === "ltr"), `${path}: technical field needs LTR`);
        ts.forEachChild(node, check);
    }; check(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
}
const nativeRequire = createRequire(import.meta.url), React = nativeRequire("react"), runtime = nativeRequire("react/jsx-runtime");
type Element = { type: string; props: Record<string, any> };
function harness(path: string, initial: Record<string, any> = {}, props: Record<string, any> = {}, schemaFailure?: unknown) {
    const source = readFileSync(path, "utf8"), file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), names: string[] = [];
    function collect(node: ts.Node) { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") names.push(node.name.elements[0].getText(file)); ts.forEachChild(node, collect); } collect(file);
    let language: Language = "en", stateIndex = 0, memoIndex = 0;
    const cells: any[] = [], memos: { deps: unknown[]; value: unknown }[] = [], writes: string[] = [], copied: string[] = [], downloads: string[][] = [], used: string[] = [];
    const calls = { parseCron: 0, preview: 0, schema: 0, operation: 0 }, stub = () => null, compiled = { exports: {} as { default: (p: Record<string, any>) => unknown } };
    const ui = (tag: string) => (p: Record<string, any>) => React.createElement(tag, p, p.title ? [p.title, p.children] : p.children);
    const dependencies = (name: string): any => {
        if (name === "react") return { ...React, useState: (fallback: unknown) => { const i = stateIndex++; if (!(i in cells)) cells[i] = Object.hasOwn(initial, names[i]) ? initial[names[i]] : fallback; return [cells[i], (value: any) => { cells[i] = typeof value === "function" ? value(cells[i]) : value; writes.push(names[i]); }]; }, useEffect: stub, useMemo: (compute: () => unknown, deps: unknown[]) => { const i = memoIndex++; if (!memos[i] || deps.some((value, k) => value !== memos[i].deps[k])) memos[i] = { deps, value: compute() }; return memos[i].value; } };
        if (name === "react/jsx-runtime") return runtime;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: (s: string, values?: Record<string, string | number>) => translate(language, s, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (p: Record<string, any>) => React.createElement("div", null, p.title, p.description, Object.values(p.learnMore ?? {}).flat(), p.children) };
        if (name.endsWith("CronFieldControl") || name.endsWith("GraphqlVisualBuilder")) return { __esModule: true, default: (p: Record<string, any>) => React.createElement("nested-component", p) };
        if (name === "@ant-design/icons") return { ApiOutlined: stub, ReloadOutlined: stub, ClockCircleOutlined: stub };
        if (name === "antd") return { Alert: ui("alert"), Button: ui("button"), Card: ui("card"), Col: ui("col"), Row: ui("row"), Space: ui("space"), Tag: ui("tag"), Typography: { Text: ui("text") }, Input: { TextArea: ui("textarea") } };
        if (name === "graphql") return graphql;
        if (name.endsWith("graphql-builder")) return { ...builder, parseBuilderSchema: (s: string) => { calls.schema++; if (schemaFailure !== undefined) throw schemaFailure; return builder.parseBuilderSchema(s); }, buildVisualOperation: (...args: Parameters<typeof builder.buildVisualOperation>) => { calls.operation++; return builder.buildVisualOperation(...args); } };
        if (name.endsWith("cron-schedule")) return { ...cron, parseCronSchedule: (...args: Parameters<typeof cron.parseCronSchedule>) => { calls.parseCron++; return cron.parseCronSchedule(...args); }, nextCronRuns: (...args: Parameters<typeof cron.nextCronRuns>) => { calls.preview++; return cron.nextCronRuns(...args); } };
        if (name.endsWith("clipboard")) return { copyToClipboard: async (s: string) => { copied.push(s); return true; } };
        if (name.endsWith("download")) return { downloadText: (...args: string[]) => downloads.push(args) };
        throw new Error(`Unexpected dependency: ${name}`);
    };
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, { module: compiled, exports: compiled.exports, require: dependencies, Date, Intl, Error, String });
    const state = () => Object.fromEntries(names.map((name, i) => [name, cells[i]]));
    const render = (next: Language) => {
        language = next; stateIndex = 0; memoIndex = 0;
        const elements: Element[] = [], visible: string[] = [];
        function walk(node: any) { if (node == null || typeof node === "boolean") return; if (typeof node === "string" || typeof node === "number") { visible.push(String(node)); return; } if (Array.isArray(node)) { node.forEach(walk); return; } if (typeof node.type === "function") { walk(node.type(node.props)); return; } if (node.props) { elements.push(node); walk(node.props.children); } }
        walk(compiled.exports.default({ onUse: (s: string) => used.push(s), ...props }));
        return { text: visible.join(" "), elements, button: (source: string) => { const node = elements.find((e) => e.type === "button" && e.props.children === translate(language, source)); assert.ok(node, `${source}/${language}`); return node.props.onClick as () => void; } };
    };
    const stable = () => { const saved = state(), before = { ...calls }; writes.length = 0; render("ar"); render("ja"); assert.deepEqual(state(), saved); assert.deepEqual(writes, []); assert.deepEqual(calls, before, "Changing language must not run operational work"); };
    return { render, state, stable, copied, downloads, used, calls };
}
const schemaSource = '"Operation" type Query { user(id: ID!, optional: Int): User } type User { id: ID!, name: String } type Mutation { rename(id: ID!): String } type Subscription { changed: String }';
const expression = "0 9 * * 1-5", reference = "2026-10-18T10:00:00Z", instant = "2026-10-19T09:00:00.000Z", operation = 'query FindUser { user(id: "Name") { id name } }';
for (const { id } of LANGUAGES) {
    for (const [value, mode] of [["*", "every"], ["5", "at"], ["*/2", "step"], ["1-5", "range"], ["1,3", "list"], ["*/5,7", "custom"]]) {
        const changed: string[] = [], control = harness(paths[0], {}, { index: 4, value, onChange: (s: string) => changed.push(s) }), view = control.render(id);
        assert.ok(view.text.includes(translate(id, "Day of week"))); assert.ok(view.text.includes(translate(id, "0 and 7 = Sunday; 1 = Monday … 6 = Saturday.")));
        const select = view.elements.find((e) => e.type === "select")!; assert.equal(select.props.value, mode);
        const options = view.elements.filter((e) => e.type === "option"); assert.deepEqual(options.map((e) => e.props.value), ["every", "at", "step", "range", "list", "custom"]);
        for (const [pattern, expected] of [["every", "*"], ["at", "0"], ["step", "*/2"], ["range", "0-7"], ["list", "0,1"], ["custom", "*/5,7"]]) { select.props.onChange({ target: { value: pattern } }); assert.equal(changed.at(-1), expected); }
        const inputs = view.elements.filter((e) => e.type === "input"); if (inputs.length) { inputs[0].props.onChange({ target: { value: "3" } }); assert.equal(changed.at(-1), mode === "step" ? "*/3" : mode === "range" ? "3-5" : "3"); }
        if (inputs.length > 1) { inputs[1].props.onChange({ target: { value: "6" } }); assert.equal(changed.at(-1), "1-6"); }
    }
    const page = harness(paths[2], { reference }), cronView = page.render(id);
    assert.equal(page.calls.parseCron, 1); assert.ok(cronView.text.includes(translate(id, "Choose a schedule")));
    assert.deepEqual(cronView.elements.filter((e) => e.type === "option").slice(1).map((e) => e.props.value), cron.CRON_PRESETS.map((p) => p[1]));
    cronView.button("Copy cron")(); cronView.button("Download expression")(); assert.equal(page.copied[0], expression); assert.deepEqual(page.downloads[0], [expression + "\n", "schedule.cron"]);
    cronView.button("Preview next five runs")(); const runs = page.render(id); assert.ok(runs.text.includes(instant)); assert.ok(runs.text.includes(new Intl.DateTimeFormat(id, { timeZone: "UTC", dateStyle: "full", timeStyle: "long" }).format(new Date(instant)))); assert.equal(page.calls.preview, 1); page.stable();
    const offset = harness(paths[2], { reference: "2026-10-18T10:00:00", runs: [instant] }); offset.render(id).button("Preview next five runs")(); assert.ok(offset.render(id).text.includes(translate(id, "Include Z or an explicit UTC offset in the reference timestamp."))); assert.equal(offset.calls.preview, 0); offset.stable();
    const invalid = harness(paths[2], { expression: "bad" }).render(id); assert.ok(invalid.text.includes(translate(id, "Enter five fields to use visual controls."))); assert.ok(invalid.elements.find((e) => e.type === "button")!.props.disabled); assert.ok(invalid.text.includes("Error: Use five numeric cron fields"));
    const rawCron = harness(paths[2], { error: { detail: "Operation" } }); assert.ok(rawCron.render(id).text.includes("Operation")); rawCron.stable();
    const preset = harness(paths[2], { runs: [instant] }), presetView = preset.render(id); presetView.elements.find((e) => e.type === "select")!.props.onChange({ target: { value: "*/15 * * * *" } }); assert.equal(preset.state().expression, "*/15 * * * *"); assert.equal(preset.state().runs.length, 0);

    const visual = harness(paths[1], {}, { schemaSource }); visual.render(id).button("Load current schema into builder")(); let tree = visual.render(id);
    assert.deepEqual(tree.elements.filter((e) => e.type === "option").map((e) => e.props.value), ["query", "mutation", "subscription"]);
    const field = tree.elements.find((e) => e.type === "input" && e.props.type === "checkbox" && e.props.checked === false && e === tree.elements.filter((n) => n.type === "input" && n.props.type === "checkbox")[1])!;
    field.props.onChange({ target: { checked: true } }); tree = visual.render(id);
    assert.ok(tree.text.includes(translate(id, " · required"))); assert.ok(tree.text.includes(translate(id, " · optional"))); assert.equal(visual.state().argumentsByPath["user:id"], '"example-id"');
    tree.button("Generate validated operation")(); const generated = visual.render(id); assert.ok(visual.state().output.includes("MyOperation")); const exact = visual.state().output; generated.button("Copy operation")(); generated.button("Use in operation editor")(); assert.equal(visual.copied[0], exact); assert.equal(visual.used[0], exact); visual.stable();
    const limited = harness(paths[1], { schema: builder.parseBuilderSchema(schemaSource), selected: Array.from({ length: 500 }, (_, i) => `fixture${i}`) }, { schemaSource }); limited.render(id).elements.find((e) => e.type === "input" && e.props.type === "checkbox")!.props.onChange({ target: { checked: true } }); assert.ok(limited.render(id).text.includes(translate(id, "Selection limit is 500 fields."))); limited.stable();
    const missing = harness(paths[1], { schema: builder.parseBuilderSchema("type Query { name: String }"), operation: "mutation" }, { schemaSource }); assert.ok(missing.render(id).text.includes(translate(id, "This schema has no {operation} root. Choose an available operation.", { operation: "mutation" })));
    const recursive = builder.parseBuilderSchema('type Query { node: Node } type Node { next: Node }');
    const depthPaths = Array.from({ length: 8 }, (_, i) => "node" + ".next".repeat(i));
    const depth = harness(paths[1], { schema: recursive, selected: depthPaths }, { schemaSource }); assert.ok(depth.render(id).text.includes(translate(id, "Depth limit reached. __typename is selected automatically.")));
    const wideSchema = builder.parseBuilderSchema(`type Query { ${Array.from({ length: 201 }, (_, i) => `field${i}: String`).join(" ")} }`);
    const wide = harness(paths[1], { schema: wideSchema }, { schemaSource }); assert.ok(wide.render(id).text.includes(translate(id, "Showing the first 200 fields at this level. Use the operation editor for additional fields.")));
    const rawBuilder = harness(paths[1], { error: { detail: "Operation" }, output: operation }, { schemaSource }); assert.ok(rawBuilder.render(id).text.includes("Operation")); assert.equal(rawBuilder.render(id).elements.find((e) => e.type === "textarea")!.props.value, operation); rawBuilder.stable();
    const badSchema = harness(paths[1], {}, { schemaSource: "bad" }); badSchema.render(id).button("Load current schema into builder")(); assert.match(badSchema.state().error.detail, /Syntax Error/); badSchema.stable();
    const buildError = harness(paths[1], { schema: builder.parseBuilderSchema(schemaSource), selected: ["user"], argumentsByPath: {} }, { schemaSource }); buildError.render(id).button("Generate validated operation")(); assert.match(buildError.state().error.detail, /required argument/); buildError.stable();

    const explorer = harness(paths[3], { schemaSource, operationSource: operation }); explorer.render(id).button("Validate operation")(); assert.ok(explorer.render(id).text.includes(translate(id, "Operation is valid"))); assert.ok(explorer.render(id).text.includes(translate(id, "The operation matches this schema"))); explorer.stable();
    const erroneous = harness(paths[3], { schemaSource, operationSource: "{ missing }" }); erroneous.render(id).button("Validate operation")(); const diagnostic = erroneous.state().errors[0]; assert.match(diagnostic, /Cannot query field "missing"/); assert.ok(erroneous.render(id).text.includes(diagnostic)); assert.ok(erroneous.render(id).text.includes(translate(id, "Validation errors: {count}", { count: 1 }))); erroneous.stable();
    const guard = harness(paths[3], { schemaSource, operationSource: "x".repeat(500_001) }); guard.render(id).button("Validate operation")(); assert.ok(guard.render(id).text.includes(translate(id, "Operation limit is 500,000 characters."))); guard.stable();
    const fallback = harness(paths[3], {}, {}, "Operation"); fallback.render(id).button("Validate operation")(); assert.ok(fallback.render(id).text.includes(translate(id, "Unable to parse schema or operation."))); fallback.stable();
    const format = harness(paths[3], { schemaSource, operationSource: operation }); format.render(id).button("Format operation")(); assert.equal(format.state().operationSource, builder.formatGraphql(operation, false)); format.render(id).button("Minify operation")(); assert.equal(format.state().operationSource, builder.formatGraphql(operation, true)); format.stable();
    const broken = harness(paths[3], { operationSource: "query {" }); broken.render(id).button("Format operation")(); assert.match(broken.state().errors[0], /Syntax Error/); broken.stable();
    const raw = harness(paths[3], { errors: ["Operation"], schemaSource, operationSource: operation }); assert.ok(raw.render(id).text.includes("Operation")); raw.stable(); raw.render(id).button("Reset example")(); assert.equal(raw.state().errors, null); assert.ok(raw.state().operationSource.includes("query FindUser($id: ID!)"));
}
console.log("Cron/GraphQL localization: eight-language rendered modes, guards/callbacks, exact machine values/diagnostics, localized dates and stable locale changes passed.");

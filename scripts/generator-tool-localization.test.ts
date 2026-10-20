import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { GENERATOR_TOOL_TRANSLATIONS } from "../src/lib/i18n/generator-tools";

async function main() {
const project = process.cwd(), stage = process.env.GENERATOR_STAGE_DIR, base = stage ?? project;
const { LANGUAGES, translate: sharedTranslate } = await import(pathToFileURL(resolve(project, "src/lib/i18n/catalog.ts")).href) as typeof import("../src/lib/i18n/catalog");
type Language = typeof LANGUAGES[number]["id"];
const ids = ["lorem-ipsum", "slug-generator", "markdown-table", "json-to-typescript", "java-pojo-generator", "mock-data-generator"];
const technical = new Set(["Lombok @Data", "@Builder", "@SuperBuilder", "Jackson", "Gson", "Jakarta Validation", "JAXB (XML)", "Swagger / OpenAPI", "JPA / Hibernate", "toString()", "equals() & hashCode()", "Serializable"]);
const tokens = (s: string) => [...s.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map((m) => m[1]).sort();
for (const [source, columns] of Object.entries(GENERATOR_TOOL_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    columns.forEach((value, index) => {
        assert.ok(value.trim(), source); assert.deepEqual(tokens(value), tokens(source), source);
        if (!stage) assert.equal(sharedTranslate(LANGUAGES[index + 1].id, source), value, `Catalog integration: ${source}`);
    });
}
const translate = (lang: Language, key: string, values?: Record<string, string | number>) => {
    const col = LANGUAGES.findIndex((l) => l.id === lang) - 1;
    let result = col < 0 ? key : GENERATOR_TOOL_TRANSLATIONS[key]?.[col] ?? sharedTranslate(lang, key);
    for (const [name, value] of Object.entries(values ?? {})) result = result.replaceAll(`{${name}}`, String(value));
    return result;
};
const nativeRequire = createRequire(resolve(project, "package.json")), React = nativeRequire("react") as typeof import("react"), jsx = nativeRequire("react/jsx-runtime");
type Element = { type: unknown; props: Record<string, unknown> };
type Memo = { deps: unknown[]; value: unknown };
function harness(id: string, overrides: Record<string, unknown> = {}) {
    const file = resolve(base, `src/app/tools/${id}/page.tsx`), source = readFileSync(file, "utf8"), ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const hooks: string[] = [];
    const collect = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(ast) === "useState") hooks.push(node.name.elements[0].getText(ast));
        ts.forEachChild(node, collect);
    }; collect(ast);
    const state = new Map<string, unknown>(), memos: Memo[] = [], effects: unknown[][] = [], refs: { current: unknown }[] = [], pending: (() => void)[] = [];
    const log = { copies: [] as string[], notices: [] as string[], downloads: [] as { text: string; filename: string; type: string }[], randomCalls: 0, memoRuns: 0, effectRuns: 0 };
    let language: Language = "en", slot = 0, memoSlot = 0, effectSlot = 0, refSlot = 0;
    const changed = (before: unknown[] | undefined, after: unknown[]) => !before || before.length !== after.length || after.some((v, i) => !Object.is(v, before[i]));
    const translators = Object.fromEntries(LANGUAGES.map((lang) => [lang.id, (key: string, values?: Record<string, string | number>) => translate(lang.id, key, values)]));
    const component = (name: string) => Object.assign((props: Record<string, unknown>) => React.createElement(name, props, props.children as import("react").ReactNode), { Compact: (props: Record<string, unknown>) => React.createElement(name + ".Compact", props, props.children as import("react").ReactNode) });
    const message = { success: (s: string) => log.notices.push(s), error: (s: string) => log.notices.push(s) };
    const antd = new Proxy({ App: { useApp: () => ({ message }) }, Typography: { Text: component("Text"), Title: component("Title") }, Input: Object.assign(component("Input"), { TextArea: component("TextArea") }), Radio: { Group: component("Radio.Group") } }, { get: (target, key) => target[key as keyof typeof target] ?? component(String(key)) });
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React,
            useState: (initial: unknown) => { const key = hooks[slot++]; assert.ok(key); if (!state.has(key)) state.set(key, Object.hasOwn(overrides, key) ? overrides[key] : typeof initial === "function" ? (initial as () => unknown)() : initial); return [state.get(key), (next: unknown) => state.set(key, typeof next === "function" ? (next as (old: unknown) => unknown)(state.get(key)) : next)]; },
            useMemo: (compute: () => unknown, deps: unknown[]) => { const index = memoSlot++; if (changed(memos[index]?.deps, deps)) { log.memoRuns++; memos[index] = { deps, value: compute() }; } return memos[index].value; },
            useCallback: (callback: unknown) => callback,
            useRef: (initial: unknown) => { const index = refSlot++; return refs[index] ?? (refs[index] = { current: initial }); },
            useEffect: (effect: () => void, deps: unknown[]) => { const index = effectSlot++; if (changed(effects[index], deps)) { effects[index] = deps; pending.push(() => { log.effectRuns++; effect(); }); } },
        };
        if (name === "react/jsx-runtime") return jsx;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ language, direction: language === "ar" ? "rtl" : "ltr", t: translators[language] }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Record<string, unknown>) => React.createElement("Layout", props, props.title as string, props.description as string, ...Object.values(props.learnMore as Record<string, string | string[]>).flat().map((text) => translate(language, text)), props.children as import("react").ReactNode) };
        if (name.endsWith("clipboard")) return { copyToClipboard: (text: string) => { log.copies.push(text); return Promise.resolve(true); } };
        if (name.endsWith("download")) return { downloadText: (text: string, filename: string, type: string) => log.downloads.push({ text, filename, type }) };
        if (name.endsWith("CodeEditor")) return { CodeEditor: component("CodeEditor") };
        if (name.endsWith("shareable-state")) return { useShareableState: () => {} };
        if (["SendToButton", "ShareButton", "ToolBridgeBanner"].some((suffix) => name.endsWith(suffix))) return { __esModule: true, default: component(name.split("/").at(-1)!) };
        if (name === "antd") return antd;
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => () => null });
        throw new Error("Unexpected import " + name);
    };
    const engines: Record<string, string[]> = { "lorem-ipsum": ["generate"], "slug-generator": ["slugify"], "markdown-table": ["generateMarkdown"], "json-to-typescript": ["jsonToTypeScript"], "java-pojo-generator": ["generateJavaFiles", "DEFAULT_OPTIONS", "parseJavaClasses", "classToObj"], "mock-data-generator": ["GENERATORS", "makeRng", "toJson", "toCsv", "toSql"] };
    const compiledModule = { exports: {} as { default: () => unknown; engines: Record<string, (...args: never[]) => unknown> } };
    const compiled = ts.transpileModule(source + `\nexport const engines = { ${engines[id].join(", ")} };`, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, reportDiagnostics: true });
    assert.equal(compiled.diagnostics?.filter((d) => d.category === ts.DiagnosticCategory.Error).length, 0, id);
    const math = Object.create(Math) as Math; math.random = () => { log.randomCalls++; return 0.375; };
    runInNewContext(compiled.outputText, { module: compiledModule, exports: compiledModule.exports, require: dependencies, Error, Math: math, Number, Date, Map, Set, JSON });
    const flush = () => { pending.splice(0).forEach((effect) => effect()); };
    function render(next: Language = language) {
        language = next; slot = 0; memoSlot = 0; effectSlot = 0; refSlot = 0;
        const nodes: Element[] = [], text: string[] = [];
        const walk = (value: unknown) => {
            if (value === null || value === undefined || typeof value === "boolean") return;
            if (typeof value === "string" || typeof value === "number") { text.push(String(value)); return; }
            if (Array.isArray(value)) { value.forEach(walk); return; }
            const element = value as Element;
            if (typeof element.type === "function") { walk((element.type as (props: unknown) => unknown)(element.props)); return; }
            if (!element.props) return;
            nodes.push(element); walk(element.props.children); for (const key of ["title", "extra", "message"]) walk(element.props[key]);
            for (const item of element.props.items as { label: unknown; children: unknown }[] ?? []) { walk(item.label); walk(item.children); }
        }; walk(compiledModule.exports.default());
        return { nodes, text: text.join(" ") };
    }
    return { render, flush, state, log, engines: compiledModule.exports.engines };
}
type Page = ReturnType<ReturnType<typeof harness>["render"]>;
const find = (page: Page, predicate: (node: Element) => boolean) => { const node = page.nodes.find(predicate); assert.ok(node, "Expected control"); return node; };
const click = (page: Page, label: string) => (find(page, (n) => n.type === "Button" && n.props.children === label).props.onClick as () => unknown)();
const snapshot = (state: Map<string, unknown>) => JSON.stringify([...state], (_key, value) => value instanceof Map ? [...value] : value);
const engine = (id: string, name: string) => harness(id).engines[name] as (...args: unknown[]) => unknown;

// Independent compiler validates syntax and semantics, including mixed and top-level arrays.
const infer = engine("json-to-typescript", "jsonToTypeScript") as (input: unknown, name?: string) => string;
function compileGenerated(source: string, fixture?: unknown) {
    const checked = source + (fixture !== undefined ? `\nconst fixture: Root = ${JSON.stringify(fixture)};` : "");
    const filename = resolve(project, "generator-fixture.ts"), options: ts.CompilerOptions = { strict: true, noEmit: true, target: ts.ScriptTarget.ES2022, skipLibCheck: true, types: [] };
    const host = ts.createCompilerHost(options), getSourceFile = host.getSourceFile.bind(host);
    host.getSourceFile = (file, languageVersion, onError, shouldCreateNewSourceFile) => file === filename ? ts.createSourceFile(file, "export {};\n" + checked, languageVersion, true) : getSourceFile(file, languageVersion, onError, shouldCreateNewSourceFile);
    host.fileExists = ((original) => (file) => file === filename || original(file))(host.fileExists.bind(host));
    const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([filename], options, host));
    assert.deepEqual(diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")), [], source);
}
for (const input of [null, true, 42, "日本語 العربية 🌍", [], [null, 1, "x", true], [{ a: 1 }, { a: "x", b: null }], { "bad-key": 1, 'quote"line\n': "x", "1st": { "": true }, "a-b": { x: 1 }, a_b: { x: "x" }, Root: { id: 2 }, arrays: [[null, 1], ["x"], []] }, { nested: { valid: 1 }, list: [{ id: 1 }, { id: 2 }] }]) compileGenerated(infer(input), input);
assert.match(infer([null, 1]), /type Root = \(null \| number\)\[\];/);
assert.equal(infer({ id: 1, name: "x", active: true }), "interface Root {\n  id: number;\n  name: string;\n  active: boolean;\n}");
for (const name of ["", "1Root", "Bad Name", "class", "string", "Root; hacked"] ) assert.throws(() => infer({}, name), /valid TypeScript interface name/);
for (const name of ["Root", "_$Root2", "$", "_"]) compileGenerated(infer({ value: null }, name));

// Literal separator behavior includes every regular-expression metacharacter, without changing ASCII/Unicode policy.
const slugify = engine("slug-generator", "slugify") as (value: string, options: { separator: string; lowercase: boolean; maxLength: number; strict: boolean }) => string;
for (const separator of ["-", "_", ".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]", "\\"]) {
    assert.equal(slugify("Alpha Beta Gamma", { separator, lowercase: true, maxLength: 9, strict: true }), "alpha" + separator + "bet");
    assert.equal(slugify("Alpha Beta", { separator, lowercase: true, maxLength: 6, strict: true }), "alpha");
}
assert.equal(slugify("Café 日本語 العربية", { separator: "-", lowercase: true, maxLength: 0, strict: false }), "cafe-日本語-العربية");

// Installed marked is the independent GFM oracle: hostile structural cells keep their shape and formatting.
const { marked } = await import(pathToFileURL(nativeRequire.resolve("marked")).href) as typeof import("marked");
const markdown = engine("markdown-table", "generateMarkdown") as (table: unknown) => string;
const markdownFixture = { rows: 2, cols: 3, headers: ["A|B", "Path\\file", "Line\nBreak"], data: [["a|b", "\\|\\", "**bold**\r\nnext"], ["日本語 العربية 🌍", "[link](https://example.com)", "x\\y"]], alignments: ["left", "center", "right"] };
const md = markdown(markdownFixture), tableToken = marked.lexer(md, { gfm: true }).find((t) => t.type === "table");
assert.ok(tableToken && tableToken.type === "table"); assert.equal(tableToken.header.length, 3); assert.equal(tableToken.rows.length, 2); tableToken.rows.forEach((row: unknown[]) => assert.equal(row.length, 3));
assert.deepEqual(tableToken.align, ["left", "center", "right"]); const html = marked.parse(md, { gfm: true }) as string;
assert.ok(html.includes("A|B")); assert.ok(html.includes("Path\\file")); assert.ok(html.includes("Line<br>Break")); assert.ok(html.includes("<strong>bold</strong><br>next"));

// SQLite executes only public fixtures: quoted identifier payloads remain names and values remain data.
const { DatabaseSync } = await import("node:sqlite");
const toSql = engine("mock-data-generator", "toSql") as (fields: { name: string; type: string }[], rows: Record<string, unknown>[], table: string) => string;
const tableName = 'test"; DROP TABLE retained; --', fieldName = 'value"column', sqlFields = [{ name: fieldName, type: "lorem-words" }, { name: "flag", type: "boolean" }, { name: "count", type: "integer" }];
const db = new DatabaseSync(":memory:"); const q = (s: string) => '"' + s.replaceAll('"', '""') + '"';
db.exec(`CREATE TABLE retained (id INTEGER); CREATE TABLE ${q(tableName)} (${q(fieldName)} TEXT, flag BOOLEAN, count INTEGER);`);
db.exec(toSql(sqlFields, [{ [fieldName]: "O'Reilly 日本語 العربية 🌍", flag: true, count: 7 }], tableName));
const record = db.prepare(`SELECT * FROM ${q(tableName)}`).get()!; assert.equal(record[fieldName], "O'Reilly 日本語 العربية 🌍"); assert.equal(record.flag, 1); assert.equal(record.count, 7); assert.ok(db.prepare("SELECT name FROM sqlite_master WHERE name = 'retained'").get()); db.close();

for (const lang of LANGUAGES) {
    const t = (key: string, values?: Record<string, string | number>) => translate(lang.id, key, values);
    const lorem = harness("lorem-ipsum"); let page = lorem.render("en");
    assert.equal(lorem.state.get("output"), ""); assert.equal(lorem.log.randomCalls, 0, "SSR performs no random generation");
    lorem.flush(); page = lorem.render("en"); const loremBefore = snapshot(lorem.state), randomBefore = lorem.log.randomCalls;
    page = lorem.render(lang.id); lorem.flush(); assert.equal(snapshot(lorem.state), loremBefore); assert.equal(lorem.log.randomCalls, randomBefore, "Locale does not regenerate Lorem");
    assert.ok(page.text.includes(t("Generated Text"))); click(page, t("Copy to Clipboard")); assert.equal(lorem.log.copies.at(-1), lorem.state.get("output"));
    (find(page, (n) => n.type === "Select").props.onChange as (s: string) => void)("words");
    (find(page, (n) => n.type === "InputNumber").props.onChange as (n: number) => void)(5);
    (find(page, (n) => n.type === "input" && n.props.type === "checkbox").props.onChange as (e: unknown) => void)({ target: { checked: false } });
    page = lorem.render(lang.id); click(page, t("Generate")); assert.equal(String(lorem.state.get("output")).split(" ").length, 5);
    assert.equal(find(page, (n) => n.type === "textarea").props.dir, "ltr");

    const slug = harness("slug-generator", { input: "Café 日本語 العربية\nAnother Title", strict: false, maxLength: 0 });
    page = slug.render("en"); const slugBefore = snapshot(slug.state), slugRuns = slug.log.memoRuns;
    page = slug.render(lang.id); assert.equal(snapshot(slug.state), slugBefore); assert.equal(slug.log.memoRuns, slugRuns); assert.ok(page.text.includes(t("Slug Output")));
    click(page, t("Copy")); assert.equal(slug.log.copies.at(-1), "cafe-日本語-العربية\nanother-title");
    assert.equal(JSON.stringify((find(page, (n) => n.type === "Select").props.options as { value: string }[]).map((o) => o.value)), JSON.stringify(["-", "_", "."]));
    click(page, t("Clear")); assert.equal(slug.state.get("input"), "");

    const table = harness("markdown-table", { table: structuredClone(markdownFixture) }); page = table.render("en"); const tableBefore = snapshot(table.state);
    page = table.render(lang.id); assert.equal(snapshot(table.state), tableBefore); assert.ok(page.text.includes(t("Table Editor")));
    click(page, t("Copy")); assert.equal(table.log.copies.at(-1), md);
    const cell = find(page, (n) => n.type === "input" && n.props["aria-label"] === t("Row {row}, column {column}", { row: 1, column: 1 }));
    (cell.props.onChange as (e: unknown) => void)({ target: { value: "changed|日本語" } });
    assert.equal((table.state.get("table") as { data: string[][] }).data[0][0], "changed|日本語");
    const aligns = page.nodes.filter((n) => n.type === "Button" && n.props["aria-label"] === t("Align right"));
    (aligns[0].props.onClick as () => void)(); assert.equal((table.state.get("table") as { alignments: string[] }).alignments[0], "right");
    page.nodes.filter((n) => n.type === "input").forEach((n) => { assert.equal(n.props.dir, "ltr"); assert.equal((n.props.style as { fontSize: number }).fontSize, 16); assert.ok(n.props["aria-label"]); });

    const json = harness("json-to-typescript", { input: JSON.stringify({ text: "日本語 العربية 🌍", values: [null, 1, "x"], 'bad"key': true }) });
    json.render("en"); json.flush(); page = json.render("en"); const jsonBefore = snapshot(json.state), effectBefore = json.log.effectRuns;
    page = json.render(lang.id); json.flush(); assert.equal(snapshot(json.state), jsonBefore); assert.equal(json.log.effectRuns, effectBefore, "Locale does not recompute generated types");
    click(page, t("Copy TypeScript")); assert.equal(json.log.copies.at(-1), json.state.get("output")); compileGenerated(String(json.state.get("output")));
    (find(page, (n) => n.type === "Input").props.onChange as (e: unknown) => void)({ target: { value: "bad name" } });
    json.render(lang.id); json.flush(); page = json.render(lang.id); assert.equal(json.state.get("output"), ""); assert.equal(json.state.get("interfaceName"), "bad name");
    assert.ok(page.text.includes(t("Use a valid TypeScript interface name: start with an ASCII letter, _ or $, and avoid reserved words."))); assert.equal(find(page, (n) => n.type === "Button").props.disabled, true);
    (find(page, (n) => n.type === "Input").props.onChange as (e: unknown) => void)({ target: { value: "Recovered" } });
    json.render(lang.id); json.flush(); page = json.render(lang.id); assert.equal(json.state.get("error"), null); compileGenerated(String(json.state.get("output")));
    (find(page, (n) => n.type === "CodeEditor" && n.props.language === "json").props.onChange as (s: string) => void)("{\"unfinished\":");
    json.render(lang.id); json.flush(); page = json.render(lang.id); assert.equal(json.state.get("input"), '{"unfinished":'); assert.equal(json.state.get("output"), ""); assert.ok(page.text.includes(t("Check the JSON input and root interface name.")));

    const java = harness("java-pojo-generator", { input: '{"id":1,"name":"日本語 العربية 🌍","active":true}' });
    page = java.render("en"); java.flush(); click(page, "Generate"); page = java.render("en"); const javaBefore = snapshot(java.state), javaOutput = String(java.state.get("output"));
    assert.ok(javaOutput.includes("private int id;")); assert.ok(javaOutput.includes("private String name;"));
    page = java.render(lang.id); java.flush(); assert.equal(snapshot(java.state), javaBefore); assert.ok(page.text.includes(t("Package Name")), "Memoized Java options follow language");
    click(page, t("Copy")); assert.equal(java.log.copies.at(-1), javaOutput);
    click(page, t("Download")); assert.deepEqual(java.log.downloads.at(-1), { text: javaOutput, filename: "Root.java", type: "text/plain" });
    click(page, t("Generate")); assert.equal(java.state.get("output"), javaOutput); assert.equal(java.log.notices.at(-1), t("Generated Java files: {count}", { count: 1 }));
    const javaType = find(page, (n) => n.type === "Select" && n.props["aria-label"] === t("Java Type"));
    assert.equal(JSON.stringify((javaType.props.options as { value: string }[]).map((o) => o.value)), JSON.stringify(["class", "abstract-class", "record", "interface", "annotation", "enum"]));
    (find(page, (n) => n.type === "CodeEditor" && n.props.language === "json").props.onChange as (s: string) => void)("[]"); page = java.render(lang.id); click(page, t("Generate")); assert.ok(java.log.notices.at(-1)?.includes(t("Empty array"))); assert.equal(java.state.get("input"), "[]");
    (find(page, (n) => n.type === "Segmented").props.onChange as (s: string) => void)("java-to-json"); page = java.render(lang.id); click(page, t("Convert")); assert.doesNotThrow(() => JSON.parse(String(java.state.get("output"))));

    const multiple = harness("java-pojo-generator", { input: '{"id":1,"address":{"city":"Tokyo"}}' });
    multiple.render("en"); multiple.flush(); const opts = multiple.state.get("options") as Record<string, unknown>;
    multiple.state.set("options", { ...opts, outputMode: "multiple-files" });
    let multiplePage = multiple.render("en"); click(multiplePage, "Generate"); multiplePage = multiple.render(lang.id); multiple.flush();
    const outputFiles = multiple.state.get("outputFiles") as Map<string, string>;
    assert.equal(outputFiles.size, 2); const allBytes = [...outputFiles.entries()].map(([name, content]) => `// ═══ ${name}.java ═══\n\n${content}`).join("\n\n");
    click(multiplePage, t("Copy All")); assert.equal(multiple.log.copies.at(-1), allBytes);
    click(multiplePage, t("Download")); assert.deepEqual(multiple.log.downloads.at(-1), { text: allBytes, filename: "generated.java", type: "text/plain" });
    const fileButton = find(multiplePage, (n) => n.type === "Button" && Array.isArray(n.props.children) && n.props.children[0] === "Address");
    (fileButton.props.onClick as () => void)(); assert.equal(multiple.state.get("selectedFile"), "Address"); assert.equal(multiple.state.get("output"), outputFiles.get("Address"));

    const mock = harness("mock-data-generator"); page = mock.render("en"); mock.flush(); const mockBefore = snapshot(mock.state), mockRuns = mock.log.memoRuns;
    const initialOutput = String(find(page, (n) => n.type === "TextArea").props.value);
    const independent = harness("mock-data-generator").render("en"); assert.equal(find(independent, (n) => n.type === "TextArea").props.value, initialOutput, "Seeded dates are stable across instances");
    page = mock.render(lang.id); mock.flush(); assert.equal(snapshot(mock.state), mockBefore); assert.equal(mock.log.memoRuns, mockRuns, "Locale does not regenerate mock records");
    assert.equal(find(page, (n) => n.type === "TextArea").props.value, initialOutput); await click(page, t("Copy")); assert.equal(mock.log.copies.at(-1), initialOutput); assert.equal(mock.log.notices.at(-1), t("Copied {count} rows as {format}", { count: 10, format: "JSON" }));
    const fields = page.nodes.filter((n) => n.type === "Input" && String(n.props["aria-label"]).includes("1"));
    assert.equal(fields[0].props.value, "id");
    const fieldTypes = page.nodes.filter((n) => n.type === "Select")[0].props.options as { value: string; label: string }[];
    assert.equal(fieldTypes.find((f) => f.value === "first-name")!.label, t("First name")); assert.equal(fieldTypes.find((f) => f.value === "date-iso")!.label, t("Date (ISO)"));
    const nameControl = find(page, (n) => n.type === "Input" && n.props["aria-label"] === t("Field name {index}", { index: 2 }));
    (nameControl.props.onChange as (e: unknown) => void)({ target: { value: "id" } }); page = mock.render(lang.id);
    assert.equal(find(page, (n) => n.type === "TextArea").props.value, "", "Duplicate fields clear stale output"); assert.ok(page.text.includes(t("Field names must be unique. Rename duplicate fields to generate data."))); assert.equal(find(page, (n) => n.type === "Button" && n.props.children === t("Copy")).props.disabled, true);
    (find(page, (n) => n.type === "Input" && n.props["aria-label"] === t("Field name {index}", { index: 2 })).props.onChange as (e: unknown) => void)({ target: { value: "display_name" } }); page = mock.render(lang.id); assert.notEqual(find(page, (n) => n.type === "TextArea").props.value, "");
    // Clipboard completion uses the current committed language without changing bytes.
    const inflight = click(page, t("Copy")); mock.render("ar"); mock.flush(); await inflight; assert.equal(mock.log.notices.at(-1), translate("ar", "Copied {count} rows as {format}", { count: 10, format: "JSON" }));
}

// Source boundaries: no locale-key remount or code generation tied to translation effects.
for (const id of ids) {
    const source = readFileSync(resolve(base, `src/app/tools/${id}/page.tsx`), "utf8"); assert.match(source, /useLanguage\(\)/); assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
    const ast = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const inspect = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.getText(ast) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
            const key = node.arguments[0].text; assert.ok(GENERATOR_TOOL_TRANSLATIONS[key] || LANGUAGES.slice(1).every((l) => sharedTranslate(l.id, key) !== key), `Authored text ${id}: ${key}`);
            if (!technical.has(key)) assert.ok(LANGUAGES.slice(1).some((l) => translate(l.id, key) !== key), `Translated text ${key}`);
        }
        ts.forEachChild(node, inspect);
    }; inspect(ast);
}
console.log("Generator tools: all eight languages, locale-stable handlers, seeded dates, GFM structure, SQLite identifier safety and independently compiled TypeScript passed. Clipboard/download helper bytes verified; browser delivery and Java/XML parsing are separate checks.");

}
void main().catch((error) => { console.error(error); process.exitCode = 1; });

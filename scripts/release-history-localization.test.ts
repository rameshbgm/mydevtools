/* eslint-disable @typescript-eslint/no-explicit-any -- Render actual release callbacks with deterministic React/UI boundaries. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { RELEASE_NOTES, KIND_LABEL, KIND_COLORS, APP_VERSION } from "../src/lib/release-notes";
import { RELEASE_HISTORY_TRANSLATIONS as rows } from "../src/lib/i18n/release-history";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import * as registry from "../src/lib/tools-registry";
import { toolPathFromId } from "../src/lib/category-routes";

const originalReleases = JSON.stringify(RELEASE_NOTES);
const prose = [...new Set(RELEASE_NOTES.flatMap(release => [release.title, ...(release.summary ? [release.summary] : []), ...release.sections.flatMap(section => [section.label, ...section.bullets])]))];
const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
const code = (value: string) => value.match(/`[^`]*`/g) ?? [];
const tr = (language: Language, source: string, values: Record<string, string | number> = {}) => {
    let value = language === "en" ? source : rows[source]?.[LANGUAGES.findIndex(item => item.id === language) - 1] ?? translate(language, source);
    for (const [key, item] of Object.entries(values)) value = value.replaceAll(`{${key}}`, String(item));
    return value;
};
assert.equal(RELEASE_NOTES.length, 10);
assert.equal(prose.length, 339);
for (const source of prose) assert.ok(rows[source], `Release prose absent: ${source}`);
for (const source of Object.values(KIND_LABEL)) assert.ok(rows[source] || SHARED_TRANSLATIONS[source], source);
for (const [source, columns] of Object.entries(rows)) {
    assert.equal(columns.length, 7, source);
    columns.forEach((value, index) => {
        assert.ok(value.trim(), source);
        assert.deepEqual(placeholders(value), placeholders(source), `Interpolation changed: ${source}`);
        // Literal paths, shell commands, expressions and code examples remain exact.
        assert.deepEqual(code(value).sort(), code(source).sort(), `Literal code changed: ${source}`);
        for (const url of source.match(/https?:\/\/[^\s)]+/g) ?? []) assert.ok(value.includes(url), `URL changed: ${source}`);
        for (const numeral of new Set(source.match(/\d+(?:\.\d+)*/g) ?? [])) assert.ok(value.includes(numeral), `Version, count or date changed: ${numeral} in ${source}`);
        if (SHARED_TRANSLATIONS[source]) assert.deepEqual(columns, SHARED_TRANSLATIONS[source], `Shared collision: ${source}`);
        if (!process.env.RELEASE_HISTORY_STAGE_ROOT) assert.equal(translate(LANGUAGES[index + 1].id, source), value, `Catalog wiring: ${source}`);
    });
}
const source = readFileSync(resolve(process.env.RELEASE_HISTORY_STAGE_ROOT ?? process.cwd(), "src/app/release-notes/page.tsx"), "utf8");
const syntax = ts.createSourceFile("release-notes", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function scan(node: ts.Node) {
    if (ts.isJsxText(node) && /[A-Za-z]/.test(node.text)) assert.match(node.text.trim(), /^(GitHub|V)$/, `Untranslated authored JSX: ${node.text.trim()}`);
    if (ts.isCallExpression(node) && node.expression.getText(syntax) === "t" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(rows[node.arguments[0].text] || SHARED_TRANSLATIONS[node.arguments[0].text], `Missing control: ${node.arguments[0].text}`);
    if (ts.isPropertyAssignment(node) && node.name.getText(syntax) === "text" && ts.isStringLiteral(node.initializer)) assert.ok(rows[node.initializer.text] || SHARED_TRANSLATIONS[node.initializer.text], `Missing example: ${node.initializer.text}`);
    ts.forEachChild(node, scan);
}
scan(syntax);
for (const expression of ["release.title", "release.summary", "section.label", "b", "category", "catDesc", "tool.name", "tool.description", "text", "KIND_LABEL[release.kind]"]) assert.ok(source.includes(`t(${expression})`), `${expression} not translated at render`);
assert.doesNotMatch(source, /key=\{(?:language|direction|t\()/);
assert.doesNotMatch(source, /(?:marginLeft|paddingLeft|borderLeft):/);

const nativeRequire = createRequire(resolve("package.json"));
const React = nativeRequire("react"), runtime = nativeRequire("react/jsx-runtime");
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
function harness(darkMode: boolean) {
    let language: Language = "en", effectIndex = 0, memoIndex = 0;
    const effects: any[] = [], memos: any[] = [], seen: string[] = [], recent: string[] = [], navigating: any[] = [], pushes: string[] = [];
    const hooks = { ...React,
        useEffect: (fn: () => any, deps: any[]) => { const i = effectIndex++; if (!effects[i] || deps.length !== effects[i].deps.length || deps.some((item, k) => item !== effects[i].deps[k])) effects[i] = { fn, deps, pending: true, cleanup: effects[i]?.cleanup }; },
        useMemo: (fn: () => any, deps: any[]) => { const i = memoIndex++; if (!memos[i] || deps.length !== memos[i].deps.length || deps.some((item, k) => item !== memos[i].deps[k])) memos[i] = { value: fn(), deps }; return memos[i].value; },
    };
    const ui = (tag: string) => function Fixture(props: any) { return React.createElement(tag, props, props.children); };
    const icon = () => null;
    const dependencies = (name: string): any => {
        if (name === "react") return hooks;
        if (name === "react/jsx-runtime") return runtime;
        if (name === "next/link") return { __esModule: true, default: ui("a") };
        if (name === "next/navigation") return { useRouter: () => ({ push: (path: string) => pushes.push(path) }) };
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => { const locale = language; return { language: locale, direction: locale === "ar" ? "rtl" : "ltr", t: (key: string, values?: Record<string, string | number>) => tr(locale, key, values) }; } };
        if (name.endsWith("/store")) return { useAppStore: () => ({ darkMode, addRecentTool: (id: string) => recent.push(id), setNavigating: (...args: any[]) => navigating.push(args) }) };
        if (name.endsWith("release-notes")) return { RELEASE_NOTES, KIND_LABEL, KIND_COLORS, APP_VERSION };
        if (name.endsWith("category-routes")) return { toolPathFromId };
        if (name.endsWith("release-preference")) return { markReleaseSeen: (version: string) => seen.push(version) };
        if (name.endsWith("tools-registry")) return { ...registry, toolsRegistry: registry.toolsRegistry.map(tool => ({ ...tool, icon })), getToolsByCategory: () => new Map([...registry.getToolsByCategory()].map(([key, tools]) => [key, tools.map(tool => ({ ...tool, icon }))])), CATEGORY_ICONS: new Proxy({}, { get: () => icon }) };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => icon });
        if (name === "framer-motion") return { motion: new Proxy({}, { get: (_, tag) => ui(`motion-${String(tag)}`) }) };
        if (name === "antd") return {
            Typography: { Title: ui("title"), Text: ui("text") },
            Badge: (props: any) => React.createElement("badge", props, props.count),
            Breadcrumb: (props: any) => React.createElement("breadcrumb", props, props.items.map((item: any) => item.title)),
            Collapse: (props: any) => React.createElement("collapse", props, props.items.map((item: any) => React.createElement("panel", { key: item.key, panelKey: item.key }, item.label, item.children))),
        };
        throw new Error(`Unexpected release dependency ${name}`);
    };
    const compiled = { exports: {} as { default: () => any } };
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, { module: compiled, exports: compiled.exports, require: dependencies });
    const render = (locale: Language) => {
        language = locale; effectIndex = memoIndex = 0;
        const elements: any[] = [], texts: string[] = [];
        function walk(node: any): void {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "number" || typeof node === "string") { texts.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            if (typeof node.type === "function") { walk(node.type(node.props)); return; }
            elements.push(node); walk(node.props?.children);
        }
        walk(compiled.exports.default());
        const beforeEffects = [...seen];
        effects.forEach(effect => { if (effect.pending) { effect.pending = false; effect.cleanup?.(); effect.cleanup = effect.fn(); } });
        const find = (type: string) => { const node = elements.find(item => item.type === type); assert.ok(node, `Missing ${type}`); return node.props; };
        return { elements, texts, find, beforeEffects, cards: elements.filter(item => item.props?.role === "button") };
    };
    return { render, seen, recent, navigating, pushes };
}
for (const dark of [false, true]) {
    const page = harness(dark);
    for (const [index, locale] of LANGUAGES.entries()) {
        const view = page.render(locale.id);
        assert.deepEqual(view.beforeEffects, index === 0 ? [] : [APP_VERSION], "Release acknowledgement only after mount");
        assert.deepEqual(page.seen, [APP_VERSION], "Locale changes must not repeat release acknowledgement");
        assert.equal(view.elements[0].props.dir, locale.id === "ar" ? "rtl" : "ltr");
        assert.deepEqual(clone(view.find("collapse").defaultActiveKey), [`${RELEASE_NOTES[0].version}-${RELEASE_NOTES[0].date}`]);
        assert.deepEqual(clone(view.find("collapse").items.map((item: any) => item.key)), RELEASE_NOTES.map(item => `${item.version}-${item.date}`));
        assert.deepEqual(view.elements.filter(item => item.props?.id?.startsWith("release-")).map(item => item.props.id), RELEASE_NOTES.map(item => `release-${item.version}`));
        for (const release of RELEASE_NOTES) { assert.ok(view.texts.includes(release.date)); assert.ok(view.texts.includes(release.version)); }
        for (const item of prose) assert.ok(view.texts.includes(tr(locale.id, item)), `Historical row not rendered (${locale.id}): ${item}`);
        for (const label of Object.values(KIND_LABEL)) if (RELEASE_NOTES.some(release => KIND_LABEL[release.kind] === label)) assert.ok(view.texts.includes(tr(locale.id, label)));
        assert.ok(view.texts.includes(tr(locale.id, "{count} releases", { count: RELEASE_NOTES.length })));
        assert.ok(view.texts.includes(tr(locale.id, "{tools} tools across {categories} categories", { tools: registry.toolsRegistry.length, categories: registry.getToolsByCategory().size })));
        assert.ok(view.texts.includes(tr(locale.id, "{count} tools · local processing by default · no account required", { count: registry.toolsRegistry.length })));
        for (const [category, tools] of registry.getToolsByCategory()) {
            assert.ok(view.texts.includes(tr(locale.id, category)));
            assert.ok(view.texts.includes(tr(locale.id, registry.CATEGORY_DESCRIPTIONS[category])));
            for (const tool of tools) {
                assert.ok(view.texts.includes(tr(locale.id, tool.name)));
                assert.ok(view.texts.includes(tr(locale.id, tool.description)));
                if (locale.id !== "en") { assert.notEqual(translate(locale.id, tool.description), tool.description, `Missing catalog description: ${tool.id}`); }
            }
        }
        assert.equal(view.cards.length, registry.toolsRegistry.length);
        const expectedTools = [...registry.getToolsByCategory().values()].flat();
        // Actual navigation handlers for every catalog entry, with identifiers and canonical routes unchanged.
        view.cards.forEach((card, i) => { card.props.onClick(); assert.equal(page.recent.at(-1), expectedTools[i].id); assert.deepEqual(clone(page.navigating.at(-1)), [true, expectedTools[i].id]); assert.equal(page.pushes.at(-1), toolPathFromId(expectedTools[i].id)); });
        for (const key of ["Enter", " "]) { let prevented = false; view.cards[0].props.onKeyDown({ key, preventDefault: () => { prevented = true; } }); assert.ok(prevented); assert.equal(page.pushes.at(-1), toolPathFromId(expectedTools[0].id)); }
        const count = page.pushes.length; view.cards[0].props.onKeyDown({ key: "Tab", preventDefault: () => assert.fail("Unexpected preventDefault") }); assert.equal(page.pushes.length, count);
        const style = { background: "" }; view.cards[0].props.onMouseEnter({ currentTarget: { style } }); assert.ok(style.background.includes(dark ? "255" : "0,0,0")); view.cards[0].props.onMouseLeave({ currentTarget: { style } }); assert.equal(style.background, "transparent");
        assert.deepEqual(view.elements.filter(item => item.type === "a").map(item => item.props.href), ["/", "https://github.com/rameshbgm/mydevtools/commits/main", "https://github.com/rameshbgm/mydevtools"]);
        assert.equal(JSON.stringify(RELEASE_NOTES), originalReleases, "Locale/navigation mutated release source");
    }
}
console.log(`Release history: ${prose.length} historical strings, ${Object.keys(rows).length} complete translation rows, ten releases and ${registry.toolsRegistry.length} canonical catalog callbacks verified in all eight languages and both themes; mount-only release acknowledgement preserved.`);

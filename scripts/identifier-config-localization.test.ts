import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, translate, type Language } from "../src/lib/i18n/catalog";
import { IDENTIFIER_CONFIG_TRANSLATIONS, COMPOSE_TEMPLATE_NOTES, identifierConfigMessage } from "../src/lib/i18n/identifier-config";
import * as uuid from "../src/lib/uuid-tools";
import * as compose from "../src/lib/compose-generator";
import * as gitignore from "../src/lib/gitignore-templates";

const placeholders = (text: string) => [...text.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map((match) => match[1]).sort();
for (const [source, columns] of Object.entries(IDENTIFIER_CONFIG_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    columns.forEach((column, index) => {
        assert.ok(column.trim(), source);
        assert.deepEqual(placeholders(column), placeholders(source), source);
        assert.equal(translate(LANGUAGES[index + 1].id, source), column, `Catalog integration: ${source}`);
    });
}
for (const template of compose.COMPOSE_TEMPLATES) {
    assert.equal(COMPOSE_TEMPLATE_NOTES[template.id], template.note, `Description lookup must use original ID: ${template.id}`);
    assert.ok(IDENTIFIER_CONFIG_TRANSLATIONS[template.note]);
}
const ids = ["uuid-generator", "gitignore-generator", "docker-compose-generator"];
const technical = new Set(["·", "RFC 9562", "TCP", "UDP", "compose.yaml", ".env.example", "docker compose config --quiet"]);
const requireCopy = (source: string) => {
    if (!source || technical.has(source)) return;
    assert.ok(IDENTIFIER_CONFIG_TRANSLATIONS[source], `Missing authored copy: ${source}`);
};
for (const id of ids) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const inspect = (node: ts.Node) => {
        if (ts.isStringLiteral(node)) requireCopy(node.text);
        else if (ts.isArrayLiteralExpression(node)) node.elements.forEach(inspect);
        else if (ts.isJsxExpression(node) && node.expression) inspect(node.expression);
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(technical.has(node.text.trim()), `Untranslated JSX in ${id}: ${node.text.trim()}`);
        if (ts.isCallExpression(node) && node.expression.getText(ast) === "t" && node.arguments[0]) inspect(node.arguments[0]);
        if (ts.isPropertyAssignment(node) && ["whatIs", "whyUse", "howToUse", "tips"].includes(node.name.getText(ast))) inspect(node.initializer);
        if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node))) {
            const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
            if (["input", "textarea", "pre"].includes(node.tagName.getText(ast))) {
                const type = attrs.find((attr) => attr.name.getText(ast) === "type")?.initializer;
                if (!(type && ts.isStringLiteral(type) && type.text === "checkbox")) {
                    const dir = attrs.find((attr) => attr.name.getText(ast) === "dir")?.initializer;
                    assert.ok(dir && ts.isStringLiteral(dir) && ["ltr", "auto"].includes(dir.text), `Explicit data direction: ${id}`);
                }
            }
            if (node.tagName.getText(ast) === "option") assert.ok(attrs.some((attr) => attr.name.getText(ast) === "value"), `Option values must survive translation: ${id}`);
        }
        ts.forEachChild(node, visit);
    };
    visit(ast);
    assert.match(source, /useLanguage\(\)/);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
    assert.doesNotMatch(source, /\[(?:[^\]]*,\s*)?(?:t|language|direction)\s*\]/, "Locale changes must not run generators or reset drafts");
}

const nativeRequire = createRequire(import.meta.url);
const React = nativeRequire("react") as typeof import("react");
const jsx = nativeRequire("react/jsx-runtime");
type Element = { type: unknown; props: Record<string, unknown> };
function harness(id: string, override: Record<string, unknown> = {}) {
    const path = `src/app/tools/${id}/page.tsx`, source = readFileSync(path, "utf8");
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), hooks: string[] = [];
    const collect = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(ast) === "useState") hooks.push(node.name.elements[0].getText(ast));
        ts.forEachChild(node, collect);
    };
    collect(ast);
    let language: Language = "en", slot = 0, memoSlot = 0;
    const state = new Map<string, unknown>(), memos: { deps: unknown[]; value: unknown }[] = [];
    const log = { copies: [] as string[], downloads: [] as string[], generatorCalls: 0 };
    const stub = () => null;
    const dependencies = (name: string): unknown => {
        if (name === "react") return { ...React, useState: (initial: unknown) => {
            const key = hooks[slot++];
            if (!state.has(key)) state.set(key, Object.hasOwn(override, key) ? override[key] : typeof initial === "function" ? (initial as () => unknown)() : initial);
            return [state.get(key), (value: unknown) => state.set(key, typeof value === "function" ? (value as (previous: unknown) => unknown)(state.get(key)) : value)];
        }, useMemo: (compute: () => unknown, deps: unknown[]) => {
            const index = memoSlot++, previous = memos[index];
            if (!previous || !deps.every((value, index) => Object.is(value, previous.deps[index]))) memos[index] = { deps, value: compute() };
            return memos[index].value;
        } };
        if (name === "react/jsx-runtime") return jsx;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t: (key: string, values?: Record<string, string | number>) => translate(language, key, values) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Record<string, unknown>) => {
            const help = props.learnMore as Record<string, string | string[]> | undefined;
            return React.createElement("div", null, String(props.title), String(props.description), help && Object.values(help).flat().map((text) => translate(language, text)).join(" "), props.children as import("react").ReactNode);
        } };
        if (name.endsWith("identifier-config")) return { COMPOSE_TEMPLATE_NOTES, identifierConfigMessage };
        if (name.endsWith("uuid-tools")) return { ...uuid, generateUuids: (...args: Parameters<typeof uuid.generateUuids>) => { log.generatorCalls++; return uuid.generateUuids(...args); }, generateUlids: (...args: Parameters<typeof uuid.generateUlids>) => { log.generatorCalls++; return uuid.generateUlids(...args); }, generateNamedUuids: (...args: Parameters<typeof uuid.generateNamedUuids>) => { log.generatorCalls++; return uuid.generateNamedUuids(...args); } };
        if (name.endsWith("gitignore-templates")) return { ...gitignore, generateGitignore: (...args: Parameters<typeof gitignore.generateGitignore>) => { log.generatorCalls++; return gitignore.generateGitignore(...args); } };
        if (name.endsWith("compose-generator")) return { ...compose, generateCompose: (...args: Parameters<typeof compose.generateCompose>) => { log.generatorCalls++; return compose.generateCompose(...args); } };
        if (name.endsWith("clipboard")) return { copyToClipboard: (value: string) => { log.copies.push(value); return Promise.resolve(true); } };
        if (name.endsWith("download")) return { downloadText: (value: string) => log.downloads.push(value) };
        if (name.endsWith("category-routes")) return { toolPathFromId: (id: string) => `/tools/${id}` };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => stub });
        if (name === "next/link") return { __esModule: true, default: (props: Record<string, unknown>) => React.createElement("a", props) };
        throw new Error(`Unexpected import: ${name}`);
    };
    const compiled = { exports: {} as { default: () => unknown } };
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependencies, Error, SyntaxError, crypto: globalThis.crypto });
    const render = (next: Language) => {
        language = next; slot = 0; memoSlot = 0;
        const nodes: Element[] = [], visible: string[] = [];
        const walk = (value: unknown) => {
            if (value === null || value === undefined || typeof value === "boolean") return;
            if (typeof value === "string" || typeof value === "number") { visible.push(String(value)); return; }
            if (Array.isArray(value)) { value.forEach(walk); return; }
            const element = value as Element;
            if (typeof element.type === "function") { walk((element.type as (props: unknown) => unknown)(element.props)); return; }
            if (!element.props) return;
            nodes.push(element); walk(element.props.children);
        };
        walk(compiled.exports.default());
        return { nodes, text: visible.join(" ") };
    };
    return { render, state, log };
}
const button = (page: ReturnType<ReturnType<typeof harness>["render"]>, text: string) => {
    const found = page.nodes.find((node) => node.type === "button" && node.props.children === text);
    assert.ok(found, `Missing button: ${text}`);
    return found.props.onClick as () => void;
};
const rawNames = "日本語 العربية Exact Name\nMixed CASE ";
const identifiers = "6ba7b810-9dad-11d1-80b4-00c04fd430c8\n01ARZ3NDEKTSV4RRFFQ69G5FAV";
const inspection = '{"version":7,"unixMilliseconds":1777777777777,"raw":"日本語"}';
for (const mode of ["4", "7", "ulid", "3", "5"]) {
    const tool = harness("uuid-generator", { mode, names: rawNames, output: identifiers, inspection, error: "Enter a valid namespace UUID." });
    for (const language of LANGUAGES) {
        const page = tool.render(language.id), t = (key: string) => translate(language.id, key);
        assert.ok(page.text.includes(t("Identifier format")));
        assert.ok(page.text.includes(t("Enter a valid namespace UUID.")));
        assert.ok(page.text.includes(inspection));
        assert.equal(tool.state.get("names"), rawNames);
        assert.equal(tool.state.get("output"), identifiers);
        assert.equal(tool.state.get("inspection"), inspection);
        button(page, t("Copy all"))(); button(page, t("Download IDs"))();
        assert.equal(tool.log.copies.at(-1), identifiers);
        assert.equal(tool.log.downloads.at(-1), identifiers + "\n");
    }
    assert.equal(tool.log.generatorCalls, 0, "Switching languages must not regenerate IDs");
}
const custom = "# 日本語 العربية\n!important.log\n*.RAW ";
const git = harness("gitignore-generator", { selected: ["frontend", "pulumi", "secrets", "logs"], custom });
const gitOutput = gitignore.generateGitignore(["frontend", "pulumi", "secrets", "logs"], custom);
for (const language of LANGUAGES) {
    const page = git.render(language.id), t = (key: string) => translate(language.id, key);
    assert.ok(page.text.includes(t("Local environment / private keys")));
    assert.equal(git.state.get("custom"), custom);
    button(page, t("Copy .gitignore"))(); button(page, t("Download .gitignore"))();
    assert.equal(git.log.copies.at(-1), gitOutput); assert.equal(git.log.downloads.at(-1), gitOutput);
    assert.ok(page.nodes.some((node) => node.type === "textarea" && node.props.value === gitOutput && node.props.dir === "ltr"));
}
assert.equal(git.log.generatorCalls, 1, "Locale changes must preserve memoized .gitignore result");
for (const template of compose.COMPOSE_TEMPLATES) {
    const service = compose.serviceFromTemplate(template, `fixture-${template.id}`), undo = compose.serviceFromTemplate(compose.COMPOSE_TEMPLATES[1], "undo");
    const tool = harness("docker-compose-generator", { templateId: template.id, services: [service], undo, error: "Could not prepare the setup ZIP. Try again." });
    const expected = compose.generateCompose("local-stack", [service]);
    for (const language of LANGUAGES) {
        const page = tool.render(language.id), t = (key: string) => translate(language.id, key);
        assert.ok(page.text.includes(t(template.note)), template.id);
        assert.ok(page.text.includes(t("Undo service removal")));
        assert.ok(page.text.includes(t("Could not prepare the setup ZIP. Try again.")));
        assert.deepEqual(tool.state.get("services"), [service]);
        assert.equal(tool.state.get("undo"), undo);
        const preview = page.nodes.find((node) => node.type === "textarea" && node.props.value === expected.yaml);
        assert.equal(preview?.props.dir, "ltr");
        assert.ok(page.nodes.some((node) => node.type === "option" && node.props.value === template.id));
        button(page, t("Copy Compose YAML"))(); button(page, t("Download compose.yaml"))();
        assert.equal(tool.log.copies.at(-1), expected.yaml); assert.equal(tool.log.downloads.at(-1), expected.yaml);
    }
    assert.equal(tool.log.generatorCalls, 1, "Locale changes must not regenerate YAML");
}
const diagnostics = [
    "Duplicate environment variable: RAW_KEY.", "Dependency cycle includes raw-name.", "raw-name: dependencies must be unique.",
    "raw-name: unknown dependency exact-key.", "raw-name: enter a Docker image reference without whitespace or interpolation.",
    "raw-name: invalid restart policy.", "raw-name: use at most 12 ports and 12 named volumes.", "raw-name: command exceeds 16 KiB.",
    "raw-name: command must be a JSON array of 1–128 strings, with no NUL characters.", "raw-name: ports must be integers from 1 to 65535 with TCP or UDP.",
    "raw-name: use unique absolute Linux mount paths and simple named volume names.", "Host port collision: 127.0.0.1:5432/tcp.",
    "raw-name: the image tag can move. Pin an image digest for reproducible deployments.",
    "raw-volume is shared by raw-name, exact-key. Separate database services should not share a data volume.", "Unknown template: exact-key",
];
for (const language of LANGUAGES.slice(1)) for (const diagnostic of diagnostics) {
    const result = identifierConfigMessage(diagnostic, (key, values) => translate(language.id, key, values));
    assert.notEqual(result, diagnostic, `${language.id}: ${diagnostic}`);
    for (const raw of ["raw-name", "exact-key", "RAW_KEY", "raw-volume", "5432/tcp"]) if (diagnostic.includes(raw)) assert.ok(result.includes(raw));
}
const invalid = harness("docker-compose-generator", { project: "INVALID PROJECT" });
const syntax = harness("docker-compose-generator", { services: [{ ...compose.serviceFromTemplate(compose.COMPOSE_TEMPLATES[0], "syntax"), command: "[invalid" }] });
const invalidGit = harness("gitignore-generator", { custom: "raw\0pattern" });
for (const language of LANGUAGES) {
    assert.ok(invalid.render(language.id).text.includes(translate(language.id, "Project name: 1–63 lowercase letters, digits, hyphens or underscores, beginning with a letter or digit.")));
    assert.ok(syntax.render(language.id).text.includes(translate(language.id, "Command arguments must contain valid JSON.")));
    assert.ok(invalidGit.render(language.id).text.includes(translate(language.id, "Custom patterns must be plain text up to 100,000 characters.")));
}
console.log("Identifier/config localization: eight languages, authored help/errors, all UUID modes and 12 stable templates, exact drafts/outputs/downloads, options, diagnostics, undo and locale-stable generation pass.");

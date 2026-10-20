import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate } from "../src/lib/i18n/catalog";
import { WORKSPACE_TOOL_TRANSLATIONS, localizeWorkflowDiagnostic } from "../src/lib/i18n/workspace-tools";
import { WORKFLOW_OPERATIONS } from "../src/lib/workflow-engine";

const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(WORKSPACE_TOOL_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const column of columns) {
        assert.ok(column.trim(), source);
        assert.deepEqual(placeholders(column), placeholders(source), source);
    }
    for (const language of LANGUAGES.slice(1)) {
        assert.equal(translate(language.id, source), SHARED_TRANSLATIONS[source][LANGUAGES.indexOf(language) - 1], `Catalog wiring: ${language.id}/${source}`);
    }
}

const paths = ["resource-bookmarks", "saved-workflows", "tool-workbench", "project-workspaces"].map((tool) => `src/app/tools/${tool}/page.tsx`);
for (const path of paths) {
    const source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.ok(source.includes("useLanguage()"), path);
    const requireTranslation = (copy: string) => assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, copy), `Missing translation in ${path}: ${copy}`);
    const inspectCopy = (node: ts.Node) => {
        if (ts.isStringLiteral(node) && node.text) requireTranslation(node.text);
        else if (ts.isConditionalExpression(node)) { inspectCopy(node.whenTrue); inspectCopy(node.whenFalse); }
    };
    const visit = (node: ts.Node) => {
        if (ts.isJsxText(node) && node.text.trim()) assert.fail(`Untranslated JSX copy in ${path}: ${node.text.trim()}`);
        if (ts.isCallExpression(node) && ["t", "setNotice", "setError"].includes(node.expression.getText(file)) && node.arguments[0]) inspectCopy(node.arguments[0]);
        if (ts.isNewExpression(node) && node.expression.getText(file) === "Error" && node.arguments?.[0]) inspectCopy(node.arguments[0]);
        if (ts.isPropertyAssignment(node) && node.name.getText(file) === "source") inspectCopy(node.initializer);
        if (ts.isJsxAttribute(node) && ["title", "description", "aria-label"].includes(node.name.getText(file)) && node.initializer) inspectCopy(node.initializer);
        ts.forEachChild(node, visit);
    };
    visit(file);
}

// Imported storage/library failures are translated without changing the data or
// weakening validation; parser-generated diagnostics keep their exact details.
for (const path of ["src/lib/project-storage.ts", "src/lib/project-purge.ts", "src/lib/local-library.ts"]) {
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
    const visit = (node: ts.Node) => {
        if (ts.isNewExpression(node) && node.expression.getText(file) === "Error" && node.arguments?.[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, node.arguments[0].text), `${path}: ${node.arguments[0].text}`);
        ts.forEachChild(node, visit);
    };
    visit(file);
}
for (const operation of Object.values(WORKFLOW_OPERATIONS)) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, operation), operation);
for (const key of ["Invalid bookmarks list or record limit exceeded.", "An imported bookmarks record is invalid."]) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, key));

for (const language of LANGUAGES) {
    const t = (source: string, values?: Record<string, string | number>) => translate(language.id, source, values);
    const userName = "日本語 العربية <script> {count} 9223372036854775807";
    assert.ok(t("Type {name} to confirm", { name: userName }).includes(userName), "User names remain intact, including braces");
    assert.ok(t("Imported bookmarks: {count}.", { count: 17 }).includes("17"));
    assert.equal(localizeWorkflowDiagnostic("Step 2: data exceeds the 2 MiB limit.", t), t("Step {number}: data exceeds the 2 MiB limit.", { number: 2 }));
    assert.equal(localizeWorkflowDiagnostic("Step 3: output exceeds the 2 MiB limit.", t), t("Step {number}: output exceeds the 2 MiB limit.", { number: 3 }));
    const parserDetails = 'Unexpected token 日本語 العربية: {"id":9223372036854775807}';
    assert.equal(localizeWorkflowDiagnostic(`Step 4 (Extract JSONPath): ${parserDetails}`, t), t("Step {number} ({operation}): {details}", { number: 4, operation: t("Extract JSONPath"), details: parserDetails }));
    assert.equal(localizeWorkflowDiagnostic("Step 5 (Format JSON): Unsupported workflow step.", t), t("Step {number} ({operation}): {details}", { number: 5, operation: t("Format JSON"), details: t("Unsupported workflow step.") }));
    assert.equal(localizeWorkflowDiagnostic(parserDetails, t), parserDetails);
}
const bookmarkSource = readFileSync(paths[0], "utf8");
assert.match(bookmarkSource, /<input dir="ltr" type="url"/);
assert.match(bookmarkSource, /<bdi>\{row\.title\}<\/bdi>/);
const workflowSource = readFileSync(paths[1], "utf8");
assert.match(workflowSource, /<textarea dir="ltr" rows=\{10\}/);
assert.match(workflowSource, /<pre dir="ltr"/);
const tabsSource = readFileSync(paths[2], "utf8");
assert.match(tabsSource, /direction === "rtl" \? 1 : -1/);
assert.match(tabsSource, /hidden=\{active !== tab\.id\}/, "Inactive tool frames stay mounted");
console.log(`Workspace tools: ${Object.keys(WORKSPACE_TOOL_TRANSLATIONS).length} seven-language entries, authored controls and recovery coverage, exact user data and workflow diagnostics verified.`);

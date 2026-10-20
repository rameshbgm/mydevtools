// Build public document data from the UI registry without executing icon imports.
import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const path = resolve("src/lib/tools-registry.ts");
const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
let array;
function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === "toolsRegistry") array = node.initializer;
    ts.forEachChild(node, visit);
}
visit(source);
if (!array || !ts.isArrayLiteralExpression(array)) throw new Error("toolsRegistry must be a literal array for public discovery generation.");
const fields = ["id", "name", "description", "category", "tags", "color"];
function literal(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
    throw new Error("Public catalog fields must be literal strings or arrays.");
}
const tools = array.elements.map((node) => {
    if (!ts.isObjectLiteralExpression(node)) throw new Error("Every registered tool must be a literal object.");
    const row = {};
    for (const field of fields) {
        const property = node.properties.find((item) => ts.isPropertyAssignment(item) && item.name.getText(source) === field);
        if (!property) throw new Error(`Tool is missing ${field}.`);
        row[field] = literal(property.initializer);
    }
    return row;
});
if (!tools.length || new Set(tools.map((tool) => tool.id)).size !== tools.length) throw new Error("Public catalog identifiers must be unique.");
writeFileSync(resolve("src/lib/public-tool-catalog.json"), JSON.stringify(tools, null, 2) + "\n");
console.log(`Generated ${tools.length} public catalog rows from tools-registry.ts; no icon code executed.`);

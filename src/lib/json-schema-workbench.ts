import { asRecord, getArray, isRecord, type DataRecord } from "@/lib/structured-data";

export type SchemaIssue = { path: string; message: string };

function typeMatches(value: unknown, expected: string): boolean {
    if (expected === "null") return value === null;
    if (expected === "array") return Array.isArray(value);
    if (expected === "object") return isRecord(value);
    if (expected === "integer") return typeof value === "number" && Number.isInteger(value);
    return typeof value === expected;
}

function resolveLocalRef(root: DataRecord, ref: string): DataRecord | null {
    if (!ref.startsWith("#/")) return null;
    let value: unknown = root;
    for (const segment of ref.slice(2).split("/")) {
        value = asRecord(value)[segment.replace(/~1/g, "/").replace(/~0/g, "~")];
    }
    return isRecord(value) ? value : null;
}

export function validateJsonSchema(value: unknown, schemaValue: unknown): SchemaIssue[] {
    const root = asRecord(schemaValue);
    const issues: SchemaIssue[] = [];
    const visit = (current: unknown, rawSchema: DataRecord, path: string, depth: number) => {
        if (depth > 48) { issues.push({ path, message: "Schema nesting is too deep to validate safely." }); return; }
        const ref = typeof rawSchema.$ref === "string" ? resolveLocalRef(root, rawSchema.$ref) : null;
        const schema = ref ?? rawSchema;
        if (typeof schema.type === "string" && !typeMatches(current, schema.type)) {
            issues.push({ path, message: `Expected ${schema.type}, received ${Array.isArray(current) ? "array" : current === null ? "null" : typeof current}.` });
            return;
        }
        const enumValues = getArray(schema.enum);
        if (enumValues.length && !enumValues.some((candidate) => JSON.stringify(candidate) === JSON.stringify(current))) {
            issues.push({ path, message: "Value is not one of the allowed enum values." });
        }
        if (typeof current === "string") {
            if (typeof schema.minLength === "number" && current.length < schema.minLength) issues.push({ path, message: `Must contain at least ${schema.minLength} characters.` });
            if (typeof schema.maxLength === "number" && current.length > schema.maxLength) issues.push({ path, message: `Must contain at most ${schema.maxLength} characters.` });
            if (typeof schema.pattern === "string") {
                try { if (!new RegExp(schema.pattern).test(current)) issues.push({ path, message: `Does not match pattern ${schema.pattern}.` }); }
                catch { issues.push({ path, message: "Schema contains an invalid regular expression pattern." }); }
            }
        }
        if (typeof current === "number") {
            if (typeof schema.minimum === "number" && current < schema.minimum) issues.push({ path, message: `Must be at least ${schema.minimum}.` });
            if (typeof schema.maximum === "number" && current > schema.maximum) issues.push({ path, message: `Must be at most ${schema.maximum}.` });
        }
        if (Array.isArray(current)) {
            if (typeof schema.minItems === "number" && current.length < schema.minItems) issues.push({ path, message: `Must contain at least ${schema.minItems} items.` });
            const items = asRecord(schema.items);
            current.forEach((item, index) => { if (Object.keys(items).length) visit(item, items, `${path}/${index}`, depth + 1); });
        }
        if (isRecord(current)) {
            const required = getArray(schema.required).filter((item): item is string => typeof item === "string");
            for (const field of required) if (!(field in current)) issues.push({ path, message: `Required property \`${field}\` is missing.` });
            const properties = asRecord(schema.properties);
            for (const [key, propertySchema] of Object.entries(properties)) {
                if (key in current && isRecord(propertySchema)) visit(current[key], propertySchema, `${path}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`, depth + 1);
            }
            if (schema.additionalProperties === false) {
                for (const key of Object.keys(current)) if (!(key in properties)) issues.push({ path: `${path}/${key}`, message: "Additional property is not allowed." });
            }
        }
    };
    visit(value, root, "$", 0);
    return issues;
}

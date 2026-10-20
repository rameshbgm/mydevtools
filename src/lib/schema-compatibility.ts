import { asRecord, getArray, isRecord, type DataRecord } from "./structured-data";
import type { ContractChange } from "./openapi-contract";

export function resolveContractRef(value: unknown, document: DataRecord, report: (message: string) => void): unknown {
    if (!isRecord(value) || typeof value.$ref !== "string") return value;
    const seen = new Set<string>();
    let current: unknown = value;
    while (isRecord(current) && typeof current.$ref === "string") {
        const ref: string = current.$ref;
        if (!ref.startsWith("#/")) { report(`Reference ${ref} is not bundled. External references are never fetched.`); return {}; }
        if (seen.has(ref)) { report(`Recursive reference ${ref} requires additional semantic review.`); return {}; }
        seen.add(ref);
        let target: unknown = document;
        for (const part of ref.slice(2).split("/")) target = asRecord(target)[part.replace(/~1/g, "/").replace(/~0/g, "~")];
        if (target === undefined) { report(`Reference ${ref} cannot be resolved.`); return {}; }
        current = target;
    }
    return current;
}

/** Compare accepted request sets and produced response sets in opposite directions. */
export function compareContractSchemas(oldValue: unknown, newValue: unknown, location: string, direction: "request" | "response", before: DataRecord, after: DataRecord): ContractChange[] {
    const findings: ContractChange[] = [];
    const add = (severity: ContractChange["severity"], path: string, message: string) => findings.push({ severity, location: path, message });
    const seen = new WeakMap<object, WeakSet<object>>();
    const visit = (oldRaw: unknown, newRaw: unknown, path: string, depth: number) => {
        if (depth > 32) { add("attention", path, "Schema comparison depth exceeded; review this branch manually."); return; }
        const oldSchema = resolveContractRef(oldRaw, before, (message) => add("attention", path, message));
        const newSchema = resolveContractRef(newRaw, after, (message) => add("attention", path, message));
        if (JSON.stringify(oldSchema) === JSON.stringify(newSchema)) return;
        if (oldSchema === false || newSchema === false || oldSchema === true || newSchema === true) {
            if (direction === "request" ? newSchema === false || oldSchema === true : oldSchema === false || newSchema === true) add("breaking", path, `${direction} schema changed its allowed value set.`);
            else add("attention", path, "Boolean schema changed; review allowed values.");
            return;
        }
        const old = asRecord(oldSchema), next = asRecord(newSchema);
        if (seen.get(old)?.has(next)) return;
        if (!seen.has(old)) seen.set(old, new WeakSet());
        seen.get(old)!.add(next);
        const typeSet = (schema: DataRecord) => new Set(typeof schema.type === "string" ? [schema.type] : getArray(schema.type).map(String));
        const oldTypes = typeSet(old), newTypes = typeSet(next);
        if (JSON.stringify([...oldTypes].sort()) !== JSON.stringify([...newTypes].sort())) {
            const restricted = direction === "request" ? oldTypes : newTypes;
            const permitted = direction === "request" ? newTypes : oldTypes;
            // integer is a subset of number; removing a type assertion widens acceptance.
            if ((!restricted.size && permitted.size) || (permitted.size && [...restricted].some((type) => !permitted.has(type) && !(type === "integer" && permitted.has("number"))))) add("breaking", path, `${direction} type changed from ${[...oldTypes].join("|") || "any"} to ${[...newTypes].join("|") || "any"}.`);
        }
        const oldEnum = getArray(old.enum), newEnum = getArray(next.enum);
        if (direction === "request" && newEnum.length && (!oldEnum.length || oldEnum.some((v) => !newEnum.some((n) => JSON.stringify(v) === JSON.stringify(n))))) add("breaking", path, "Request enum was narrowed.");
        if (direction === "response" && oldEnum.length && (!newEnum.length || newEnum.some((v) => !oldEnum.some((n) => JSON.stringify(v) === JSON.stringify(n))))) add("breaking", path, "Response enum was widened.");
        for (const keyword of ["minimum", "exclusiveMinimum", "minLength", "minItems", "minProperties", "maximum", "exclusiveMaximum", "maxLength", "maxItems", "maxProperties"]) {
            const a = old[keyword], b = next[keyword];
            if (a === b) continue;
            const min = keyword.startsWith("min") || keyword === "exclusiveMinimum";
            const oldBound = typeof a === "number" ? a : (min ? -Infinity : Infinity);
            const newBound = typeof b === "number" ? b : (min ? -Infinity : Infinity);
            const narrows = min ? newBound > oldBound : newBound < oldBound;
            if (direction === "request" ? narrows : !narrows) add("breaking", path, `${direction} constraint ${keyword} changed from ${a ?? "unbounded"} to ${b ?? "unbounded"}.`);
        }
        const oldRequired = new Set(getArray(old.required).map(String)), newRequired = new Set(getArray(next.required).map(String));
        for (const field of direction === "request" ? newRequired : oldRequired) if (!(direction === "request" ? oldRequired : newRequired).has(field)) add("breaking", path, direction === "request" ? `Property \`${field}\` became required.` : `Response property \`${field}\` is no longer guaranteed.`);
        const oldProps = asRecord(old.properties), newProps = asRecord(next.properties);
        for (const key of new Set([...Object.keys(oldProps), ...Object.keys(newProps)])) {
            if (key in oldProps && key in newProps) visit(oldProps[key], newProps[key], `${path}.properties.${key}`, depth + 1);
            else if (direction === "response" && oldRequired.has(key) && !(key in newProps)) add("breaking", path, `Required response property ${key} was removed.`);
            else if (direction === "request" && key in oldProps && !(key in newProps) && next.additionalProperties === false) add("breaking", path, `Request property ${key} is no longer allowed.`);
        }
        if (direction === "request" && next.additionalProperties === false && old.additionalProperties !== false) add("breaking", path, "Additional request properties are no longer allowed.");
        if (direction === "response" && old.additionalProperties === false && next.additionalProperties !== false) add("breaking", path, "Additional response properties may now be produced.");
        if (old.items !== undefined || next.items !== undefined) visit(old.items ?? {}, next.items ?? {}, `${path}.items`, depth + 1);
        for (const keyword of ["allOf", "anyOf", "oneOf", "not", "if", "then", "else", "pattern", "format", "const", "nullable", "discriminator", "prefixItems", "unevaluatedProperties", "dependentSchemas", "contains", "multipleOf", "uniqueItems"]) {
            if (JSON.stringify(old[keyword]) !== JSON.stringify(next[keyword])) add("attention", path, `Changed ${keyword}; semantic compatibility requires review.`);
        }
    };
    visit(oldValue, newValue, location, 0);
    return findings;
}

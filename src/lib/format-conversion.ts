import YAML from "yaml";
import { parse as parseToml, stringify as stringifyToml } from "smol-toml";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { parseQueryJson } from "./json-number-source";
import { checkYamlNumber, CONVERSION_PRECISION_ERROR, prepareTomlSource } from "./format-number-source";
export type StructuredFormat = "json" | "yaml" | "toml" | "xml";
const XML_NAME = /^[A-Za-z_][A-Za-z0-9_.:-]*$/;
function normalized(value: unknown, target: StructuredFormat, depth = 0, budget = { nodes: 0 }): unknown {
    if (++budget.nodes > 100_000 || depth > 80) throw new Error("Document exceeds 100,000 values or 80 nesting levels.");
    if (value === null) { if (target === "toml" || target === "xml") throw new Error(`${target.toUpperCase()} has no unambiguous null representation. Remove nulls or choose JSON/YAML.`); return null; }
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "bigint") { if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) throw new Error("A large integer cannot be represented safely in all four formats. Encode it as a quoted string first."); return Number(value); }
    if (typeof value === "number" && (!Number.isFinite(value) || (Number.isInteger(value) && !Number.isSafeInteger(value)))) throw new Error("A numeric value is nonfinite or outside the safe integer range. Encode it as a string first.");
    if (typeof value === "string" && target === "xml") {
        for (const char of value) { const code = char.codePointAt(0)!; if ((code < 32 && ![9, 10, 13].includes(code)) || code === 0xfffe || code === 0xffff || (code >= 0xd800 && code <= 0xdfff)) throw new Error("A text value contains characters XML 1.0 cannot represent."); }
    }
    if (Array.isArray(value)) return value.map((item) => normalized(item, target, depth + 1, budget));
    if (typeof value === "object") {
        const result: Record<string, unknown> = Object.create(null);
        for (const [key, item] of Object.entries(value)) {
            if (target === "xml" && key !== "#text" && !XML_NAME.test(key.startsWith("@_") ? key.slice(2) : key)) throw new Error(`“${key}” is not a valid XML element or attribute name.`);
            if (target === "xml" && (key === "#text" || key.startsWith("@_")) && typeof item === "object" && item !== null) throw new Error("XML attributes and #text must have scalar values.");
            result[key] = normalized(item, target, depth + 1, budget);
        }
        return result;
    }
    if (!["string", "number", "boolean"].includes(typeof value)) throw new Error("Unsupported value type in this document.");
    return value;
}
export function convertStructuredFormat(input: string, from: StructuredFormat, to: StructuredFormat, rootName = "root"): string {
    if (input.length > 2 * 1024 * 1024) throw new Error("Format conversion limit is 2 MiB.");
    if (!input.trim()) return "";
    let value: unknown;
    if (from === "json") value = parseQueryJson(input, "reject", CONVERSION_PRECISION_ERROR);
    else if (from === "toml") {
        // Validate before examining tokens, then parse exact date/time text.
        value = parseToml(input, { integersAsBigInt: "asNeeded", maxDepth: 80 });
        const preciseSource = prepareTomlSource(input);
        if (preciseSource !== input) value = parseToml(preciseSource, { integersAsBigInt: "asNeeded", maxDepth: 80 });
    }
    else if (from === "yaml") {
        const document = YAML.parseDocument(input, { uniqueKeys: true, strict: true, intAsBigInt: true });
        if (document.errors.length || document.warnings.length) throw new Error((document.errors[0] ?? document.warnings[0]).message);
        YAML.visit(document, {
            Map(_key, node) { if (node.items.some((pair) => !YAML.isScalar(pair.key) || typeof pair.key.value !== "string")) throw new Error("Use string mapping keys when converting YAML to other formats."); },
            Scalar(_key, node) { if ((typeof node.value === "number" || typeof node.value === "bigint") && node.source) checkYamlNumber(node.source, node.value); },
        });
        value = document.toJS({ maxAliasCount: 50 });
    } else {
        if (/<!DOCTYPE|<!ENTITY/i.test(input)) throw new Error("DTD and entity declarations are disabled. Use plain XML elements, attributes and text.");
        const valid = XMLValidator.validate(input);
        if (valid !== true) throw new Error(`Invalid XML: ${valid.err.msg}`);
        value = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", textNodeName: "#text", parseTagValue: false, parseAttributeValue: false, trimValues: false, ignoreDeclaration: true }).parse(input);
    }
    const data = normalized(value, to);
    if (to === "json") return JSON.stringify(data, null, 2);
    if (to === "yaml") return YAML.stringify(data);
    if (to === "toml") {
        if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("A TOML document must have an object at its root.");
        return stringifyToml(data as Record<string, unknown>);
    }
    if (!XML_NAME.test(rootName)) throw new Error("Choose a valid XML root name, starting with a letter or underscore.");
    const object = data && typeof data === "object" && !Array.isArray(data) ? data as Record<string, unknown> : null;
    const keys = object ? Object.keys(object) : [];
    const root = object && keys.length === 1 && !keys[0].startsWith("@_") && keys[0] !== "#text" && !Array.isArray(object[keys[0]]) ? object : { [rootName]: Array.isArray(data) ? { item: data } : data };
    const xml = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_", textNodeName: "#text", format: true }).build(root);
    const valid = XMLValidator.validate(xml);
    if (valid !== true) throw new Error(`The data cannot be represented as a single XML document: ${valid.err.msg}`);
    return xml;
}

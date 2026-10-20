import { numberSourceRoundTrips } from "./json-number-source";

// Supported TOON subset: two-space indentation, comma-delimited primitive/list/
// flat tabular arrays, objects and root primitives. See TOON 4.4 working draft:
// https://github.com/toon-format/spec/blob/main/SPEC.md (reviewed 2026-10-21).
// Not a complete conformance implementation: keyed tables, nested table field
// groups, alternate delimiters and non-strict recovery are deliberately rejected.
// Numeric decoding rejects decimal values that would change on JavaScript's
// number/string round trip, including negative zero; quote such values explicitly.
const INDENT = "  ";
const NUMBER = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
function validUnicode(value: string) {
    for (let i = 0; i < value.length; i++) {
        const c = value.charCodeAt(i);
        if (c >= 0xd800 && c <= 0xdbff) { const next = value.charCodeAt(++i); if (!(next >= 0xdc00 && next <= 0xdfff)) throw new Error("Unpaired Unicode surrogate"); }
        else if (c >= 0xdc00 && c <= 0xdfff) throw new Error("Unpaired Unicode surrogate");
    }
}
function quote(value: string): string {
    return '"' + value.replace(/[\x00-\x1f"\\]/g, (character) => {
        const escapes: Record<string, string> = { '"': '\\"', "\\": "\\\\", "\n": "\\n", "\r": "\\r", "\t": "\\t" };
        return escapes[character] ?? `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`;
    }) + '"';
}
function string(value: string): string {
    validUnicode(value);
    return !value || /^\s|\s$/.test(value) || /^[#-]/.test(value) || /[:,\[\]{}"\\\x00-\x1f]/.test(value) || ["true", "false", "null"].includes(value) || /^[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(value) ? quote(value) : value;
}
function key(value: string): string { validUnicode(value); return /^[A-Za-z_][A-Za-z0-9_.]*$/.test(value) ? value : quote(value); }
function primitive(value: unknown): string {
    if (typeof value === "string") return string(value);
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
    if (typeof value === "boolean") return String(value);
    return "null";
}
function tableFields(values: unknown[]): string[] | null {
    if (!values.length || !values[0] || typeof values[0] !== "object" || Array.isArray(values[0])) return null;
    const fields = Object.keys(values[0]);
    if (!fields.length) return null;
    return values.every((v) => v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === fields.length && fields.every((field) => Object.hasOwn(v, field) && ((v as Record<string, unknown>)[field] === null || typeof (v as Record<string, unknown>)[field] !== "object"))) ? fields : null;
}
export function encodeToon(value: unknown): string {
    const out: string[] = [], seen = new Set<object>();
    function emit(value: unknown, depth: number, prefix: string) {
        const pad = INDENT.repeat(depth);
        if (value === null || typeof value !== "object") { out.push(`${pad}${prefix}${primitive(value)}`); return; }
        if (seen.has(value)) throw new Error("Circular input is not supported");
        seen.add(value);
        if (Array.isArray(value)) {
            if (!value.length) out.push(prefix === "- " ? `${pad}- [0]:` : `${pad}${prefix}[]`);
            else {
                // A keyed array uses key[N]: rather than key: [N]:.
                const header = prefix.endsWith(": ") ? prefix.slice(0, -2) : prefix;
                const fields = prefix === "- " ? null : tableFields(value);
                if (value.every((item) => item === null || typeof item !== "object")) out.push(`${pad}${header}[${value.length}]: ${value.map(primitive).join(",")}`);
                else if (fields) {
                    out.push(`${pad}${header}[${value.length}]{${fields.map(key).join(",")}}:`);
                    value.forEach((item) => out.push(`${pad}${INDENT}${fields.map((field) => primitive((item as Record<string, unknown>)[field])).join(",")}`));
                } else {
                    out.push(`${pad}${header}[${value.length}]:`);
                    value.forEach((item) => emit(item, depth + 1, "- "));
                }
            }
        } else {
            const entries = Object.entries(value);
            if (!entries.length) { if (prefix) out.push(`${pad}${prefix.trimEnd()}`); }
            else {
                if (prefix) { out.push(`${pad}${prefix.trimEnd()}`); depth++; }
                const start = out.length;
                for (const [name, child] of entries) emit(child, depth, `${key(name)}: `);
                if (prefix === "- ") { out.splice(start - 1, 1); out[start - 1] = `${pad}- ${out[start - 1].slice(INDENT.repeat(depth).length)}`; }
            }
        }
        seen.delete(value);
    }
    emit(value, 0, "");
    return out.join("\n");
}
interface Line { text: string; depth: number; line: number; }
function fail(line: Line | undefined, reason: string): never { throw new Error(`Line ${line?.line ?? "EOF"}: ${reason}`); }
function split(text: string, delimiter: string): string[] {
    const values: string[] = []; let quoted = false, start = 0;
    for (let i = 0; i < text.length; i++) {
        if (quoted && text[i] === "\\") { i++; continue; }
        if (text[i] === '"') quoted = !quoted;
        else if (!quoted && text[i] === delimiter) { values.push(text.slice(start, i)); start = i + 1; }
    }
    if (quoted) throw new Error("Unterminated quoted string");
    values.push(text.slice(start)); return values;
}
function scalar(raw: string, emptyStructures = true): unknown {
    const text = raw.trim();
    if (!text) throw new Error("A value is required");
    if (text.startsWith('"')) { const parsed: unknown = JSON.parse(text.replace(/[\x00-\x1f]/g, (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`)); if (typeof parsed !== "string") throw new Error("Invalid quoted string"); validUnicode(parsed); return parsed; }
    if (text.includes('"')) throw new Error("Unexpected quote in bare value");
    if (text === "null") return null;
    if (text === "true") return true;
    if (text === "false") return false;
    if (emptyStructures && text === "[]") return [];
    if (emptyStructures && text === "{}") return {};
    if (NUMBER.test(text)) { const value = Number(text); if (!numberSourceRoundTrips(text)) throw new Error("A numeric value would lose precision or negative zero. Quote that value as text before converting."); return value === 0 ? 0 : value; }
    validUnicode(text); return text;
}
function fieldName(raw: string): string {
    if (!raw || raw !== raw.trim()) throw new Error("Invalid object key");
    if (raw.startsWith('"')) { const parsed: unknown = JSON.parse(raw); if (typeof parsed !== "string") throw new Error("Invalid object key"); validUnicode(parsed); return parsed; }
    if (/[\[\]{}:,"\t]/.test(raw)) throw new Error("Unsupported or malformed key/header");
    validUnicode(raw); return raw;
}
function header(text: string): { name: string; count: number; fields: string[] | null; inline: string } | null {
    if (text === "[]") return null;
    // Locate the first structural bracket outside quoted keys.
    let quoted = false, bracket = -1;
    for (let i = 0; i < text.length; i++) {
        if (quoted && text[i] === "\\") { i++; continue; }
        if (text[i] === '"') quoted = !quoted;
        else if (!quoted && text[i] === ":") break;
        else if (!quoted && text[i] === "[") { bracket = i; break; }
    }
    if (bracket < 0) return null;
    const match = text.slice(bracket).match(/^\[(0|[1-9]\d*)\](?:\{(.*)\})?:(?: (.*))?$/);
    if (!match) throw new Error("Unsupported or malformed array header");
    const count = Number(match[1]); if (!Number.isSafeInteger(count)) throw new Error("Array count exceeds the supported range");
    const fields = match[2] === undefined ? null : split(match[2], ",").map(fieldName);
    if (fields && (!fields.length || new Set(fields).size !== fields.length)) throw new Error("Duplicate or empty table fields");
    return { name: text.slice(0, bracket), count, fields, inline: match[3] ?? "" };
}
function assign(object: Record<string, unknown>, name: string, value: unknown) {
    if (Object.hasOwn(object, name)) throw new Error("Duplicate object key");
    Object.defineProperty(object, name, { value, writable: true, enumerable: true, configurable: true });
}
export function decodeToon(source: string, options: { legacyDataRootArray?: boolean } = {}): unknown {
    const lines: Line[] = [];
    source.replace(/^\uFEFF/, "").split(/\r?\n/).forEach((raw, index) => {
        if (!raw.trim() || /^ *#/.test(raw)) return;
        const leading = raw.match(/^[ \t]*/)?.[0] ?? "";
        if (leading.includes("\t") || leading.length % 2) throw new Error(`Line ${index + 1}: indentation must use multiples of two spaces`);
        lines.push({ text: raw.slice(leading.length).trimEnd(), depth: leading.length / 2, line: index + 1 });
    });
    if (!lines.length) return {};
    if (lines[0].depth !== 0) fail(lines[0], "root must not be indented");
    let position = 0;
    function array(h: NonNullable<ReturnType<typeof header>>, depth: number): unknown[] {
        if (h.inline) {
            if (h.fields) fail(lines[position - 1], "tabular arrays cannot have inline values");
            const values = split(h.inline, ",").map((cell) => scalar(cell, false));
            if (values.length !== h.count) fail(lines[position - 1], "array length mismatch");
            return values;
        }
        const values: unknown[] = [];
        for (let i = 0; i < h.count; i++) {
            const row = lines[position];
            if (!row || row.depth !== depth + 1) fail(row, "array row count or indentation mismatch");
            position++;
            if (h.fields) {
                const cells = split(row.text, ",");
                if (cells.length !== h.fields.length) fail(row, "table column count mismatch");
                const value: Record<string, unknown> = {};
                h.fields.forEach((name, index) => assign(value, name, cells[index] === "" ? null : scalar(cells[index], false)));
                values.push(value);
            } else {
                if (!/^-($| )/.test(row.text)) fail(row, "expected a list item");
                const rest = row.text.slice(1).trimStart(), nested = header(rest);
                if (nested && !nested.name) values.push(array(nested, row.depth));
                else if (nested?.name) { lines.splice(position, 0, { ...row, text: rest, depth: row.depth + 1 }); values.push(object(row.depth + 1)); }
                else if (!rest) {
                    // Compatibility with older emitted bare-marker nested lists.
                    if (lines[position]?.depth === row.depth + 1 && /^-($| )/.test(lines[position].text)) {
                        let count = 0; for (let n = position; n < lines.length && lines[n].depth > row.depth; n++) if (lines[n].depth === row.depth + 1) count++;
                        values.push(array({ name: "", count, fields: null, inline: "" }, row.depth));
                    } else values.push(lines[position]?.depth === row.depth + 1 ? object(row.depth + 1) : {});
                } else if (split(rest, ":").length > 1) {
                    // Standard first field carried on a list marker.
                    lines.splice(position, 0, { ...row, text: rest, depth: row.depth + 1 }); values.push(object(row.depth + 1));
                } else values.push(scalar(rest));
            }
        }
        return values;
    }
    function object(depth: number): Record<string, unknown> {
        const value: Record<string, unknown> = {};
        while (position < lines.length && lines[position].depth >= depth) {
            const row = lines[position]; if (row.depth !== depth) fail(row, "unexpected indentation");
            const h = header(row.text); position++;
            if (h) { if (!h.name) fail(row, "keyless array inside object"); assign(value, fieldName(h.name), array(h, depth)); continue; }
            const parts = split(row.text, ":"); if (parts.length < 2) fail(row, "expected object field");
            const name = fieldName(parts.shift()!), rest = parts.join(":").trimStart();
            assign(value, name, rest ? scalar(rest) : lines[position]?.depth === depth + 1 ? object(depth + 1) : {});
        }
        return value;
    }
    const rootHeader = header(lines[0].text);
    let result: unknown;
    if (rootHeader && rootHeader.name === "") { position++; result = array(rootHeader, 0); }
    else if (lines.length === 1 && split(lines[0].text, ":").length === 1) { result = scalar(lines[0].text); position++; }
    else result = object(0);
    if (position !== lines.length) fail(lines[position], "trailing content after root value");
    // Older builds encoded a root array as a named data field. It is
    // fundamentally ambiguous, so recover it only by explicit caller choice.
    if (options.legacyDataRootArray && result && typeof result === "object" && !Array.isArray(result) && Object.keys(result).length === 1 && Object.hasOwn(result, "data") && Array.isArray((result as Record<string, unknown>).data)) return (result as Record<string, unknown>).data;
    return result;
}

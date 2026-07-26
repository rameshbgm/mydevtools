// TOON (Token-Oriented Object Notation) codec — a compact text format that
// drops JSON's structural tokens (quotes, braces, brackets, commas) wherever
// they can be inferred from layout:
//
//   key: value             — scalar
//   key:                   — nested object (children indented 2 sp)
//   key[N]:                — list of N items, each on a `- ` line
//   key[N]{f1,f2,f3}:      — tabular: N rows of CSV-like records
//
// Pure functions, no DOM/React dependency — importable from Node (tests) and
// the browser tool page alike.

const INDENT = "  ";

export function encodeToon(value: unknown): string {
    if (value === null || value === undefined) return "null";
    if (typeof value !== "object") return formatScalar(value);
    const lines: string[] = [];
    if (Array.isArray(value)) {
        encodeArrayInline("data", value, lines, 0);
    } else {
        encodeObject(value as Record<string, unknown>, lines, 0);
    }
    return lines.join("\n");
}

function encodeObject(obj: Record<string, unknown>, out: string[], depth: number) {
    const pad = INDENT.repeat(depth);
    for (const [rawKey, val] of Object.entries(obj)) {
        const key = formatKey(rawKey);
        if (Array.isArray(val)) {
            encodeArrayInline(key, val, out, depth);
        } else if (typeof val === "object" && val !== null) {
            const keys = Object.keys(val);
            if (keys.length === 0) {
                out.push(`${pad}${key}: {}`);
            } else {
                out.push(`${pad}${key}:`);
                encodeObject(val as Record<string, unknown>, out, depth + 1);
            }
        } else {
            out.push(`${pad}${key}: ${formatScalar(val)}`);
        }
    }
}

function encodeArrayInline(key: string, arr: unknown[], out: string[], depth: number) {
    const pad = INDENT.repeat(depth);
    if (arr.length === 0) {
        out.push(`${pad}${key}[0]:`);
        return;
    }
    // tabular form: array of objects with same scalar fields → key[N]{f1,f2}:
    const table = detectUniformTable(arr);
    if (table) {
        out.push(`${pad}${key}[${arr.length}]{${table.fields.join(",")}}:`);
        const rowPad = INDENT.repeat(depth + 1);
        for (const row of arr) {
            const r = row as Record<string, unknown>;
            out.push(`${rowPad}${table.fields.map((f) => formatCell(r[f])).join(",")}`);
        }
        return;
    }
    out.push(`${pad}${key}[${arr.length}]:`);
    for (const item of arr) {
        encodeListItem(item, out, depth + 1);
    }
}

function encodeListItem(value: unknown, out: string[], depth: number) {
    const pad = INDENT.repeat(depth);
    if (value === null || value === undefined) { out.push(`${pad}- null`); return; }
    if (typeof value !== "object") { out.push(`${pad}- ${formatScalar(value)}`); return; }
    if (Array.isArray(value)) {
        out.push(`${pad}-`);
        // emit each nested item one deeper, also using `- ` prefix
        for (const item of value) encodeListItem(item, out, depth + 1);
        return;
    }
    const entries = Object.entries(value);
    if (entries.length === 0) { out.push(`${pad}- {}`); return; }
    out.push(`${pad}-`);
    encodeObject(value as Record<string, unknown>, out, depth + 1);
}

function detectUniformTable(arr: unknown[]): { fields: string[] } | null {
    if (arr.length === 0) return null;
    const first = arr[0];
    if (typeof first !== "object" || first === null || Array.isArray(first)) return null;
    const fields = Object.keys(first);
    if (fields.length === 0) return null;
    for (const item of arr) {
        if (typeof item !== "object" || item === null || Array.isArray(item)) return null;
        const keys = Object.keys(item);
        if (keys.length !== fields.length) return null;
        for (let i = 0; i < fields.length; i++) {
            if (keys[i] !== fields[i]) return null;
            const v = (item as Record<string, unknown>)[fields[i]];
            if (v !== null && typeof v === "object") return null; // table cells must be scalar
        }
    }
    return { fields };
}

function formatScalar(v: unknown): string {
    if (v === null) return "null";
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "number") return Number.isFinite(v) ? String(v) : JSON.stringify(String(v));
    if (typeof v === "string") return formatString(v);
    return JSON.stringify(v);
}

// A string can be written bare in TOON when it's free of structural characters,
// doesn't visually collide with reserved literals (true/false/null/numbers),
// and has no leading/trailing whitespace.
function formatString(s: string): string {
    if (s === "") return '""';
    if (/^\s|\s$/.test(s)) return JSON.stringify(s);
    if (/[\n\r\t]/.test(s)) return JSON.stringify(s);
    if (/[:,\[\]{}#"]/.test(s)) return JSON.stringify(s);
    if (s === "true" || s === "false" || s === "null") return JSON.stringify(s);
    if (/^-?\d+(\.\d+)?(e-?\d+)?$/i.test(s)) return JSON.stringify(s);
    return s;
}

// In a tabular row the separator is `,` and newlines break the row, so the
// quoting rules are stricter than for a regular scalar.
function formatCell(v: unknown): string {
    if (v === null || v === undefined) return "";
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "number") return Number.isFinite(v) ? String(v) : JSON.stringify(String(v));
    const s = String(v);
    if (s === "") return '""';
    if (/[,"\n\r]/.test(s)) return JSON.stringify(s);
    return s;
}

function formatKey(k: string): string {
    if (k === "") return '""';
    if (/^[A-Za-z_@#][A-Za-z0-9_\-.@#]*$/.test(k)) return k;
    return JSON.stringify(k);
}

// ──────────────────────────────────────────────────────────────────────────────
// Decoder — the inverse of encodeToon above.
// ──────────────────────────────────────────────────────────────────────────────

interface ToonLine { indent: number; text: string; }

function tokenizeToon(toon: string): ToonLine[] {
    return toon
        .split("\n")
        .filter((l) => l.trim().length > 0)
        .map((l) => {
            const match = l.match(/^( *)(.*)$/);
            const spaces = match ? match[1].length : 0;
            return { indent: Math.floor(spaces / INDENT.length), text: (match ? match[2] : l).trimEnd() };
        });
}

// Splits a CSV-like row respecting JSON-quoted cells (which may contain commas).
function splitCsvRow(row: string): string[] {
    const cells: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const c = row[i];
        if (inQuotes) {
            cur += c;
            if (c === "\\" && i + 1 < row.length) { cur += row[++i]; continue; }
            if (c === '"') inQuotes = false;
        } else if (c === '"') {
            inQuotes = true;
            cur += c;
        } else if (c === ",") {
            cells.push(cur);
            cur = "";
        } else {
            cur += c;
        }
    }
    cells.push(cur);
    return cells;
}

function parseScalar(raw: string): unknown {
    const s = raw.trim();
    if (s === "") return "";
    if (s === "null") return null;
    if (s === "true") return true;
    if (s === "false") return false;
    if (s.startsWith('"')) {
        try { return JSON.parse(s); } catch { /* fall through to bare string */ }
    }
    if (/^-?\d+(\.\d+)?(e-?\d+)?$/i.test(s)) return Number(s);
    return s;
}

// Table cells distinguish bare-empty (formatCell(null) → "") from quoted-empty
// (formatCell("") → '""'), unlike regular scalar lines where parseScalar's
// bare-empty case never occurs (formatString always quotes "").
function parseTableCell(raw: string): unknown {
    if (raw === "") return null;
    return parseScalar(raw);
}

function unquoteKey(k: string): string {
    if (k.startsWith('"')) {
        try { return JSON.parse(k); } catch { /* fall through */ }
    }
    return k;
}

// Parses the body of a block (all lines strictly deeper than `parentIndent`,
// stopping at the first line back at parentIndent or shallower) into an object.
function parseObjectBody(lines: ToonLine[], pos: { i: number }, parentIndent: number): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    const childIndent = pos.i < lines.length ? lines[pos.i].indent : parentIndent + 1;
    while (pos.i < lines.length && lines[pos.i].indent >= childIndent) {
        const line = lines[pos.i];
        if (line.indent > childIndent) { pos.i++; continue; } // defensive: skip stray over-indented lines
        const tableMatch = line.text.match(/^(.+?)\[(\d+)\]\{(.+)\}:$/);
        const listMatch = !tableMatch && line.text.match(/^(.+?)\[(\d+)\]:$/);
        const objMatch = !tableMatch && !listMatch && line.text.match(/^(.+?):$/);
        const scalarMatch = !tableMatch && !listMatch && !objMatch && line.text.match(/^(.+?): (.*)$/);

        if (tableMatch) {
            const key = unquoteKey(tableMatch[1]);
            const n = parseInt(tableMatch[2], 10);
            const fields = tableMatch[3].split(",");
            pos.i++;
            const rows: Record<string, unknown>[] = [];
            for (let r = 0; r < n && pos.i < lines.length; r++, pos.i++) {
                const cells = splitCsvRow(lines[pos.i].text);
                const row: Record<string, unknown> = {};
                fields.forEach((f, idx) => { row[f] = parseTableCell(cells[idx] ?? ""); });
                rows.push(row);
            }
            obj[key] = rows;
        } else if (listMatch) {
            const key = unquoteKey(listMatch[1]);
            const n = parseInt(listMatch[2], 10);
            pos.i++;
            obj[key] = parseListBody(lines, pos, n, childIndent);
        } else if (objMatch && !line.text.includes(": ")) {
            const key = unquoteKey(objMatch[1]);
            pos.i++;
            if (pos.i < lines.length && lines[pos.i].indent > childIndent) {
                obj[key] = parseObjectBody(lines, pos, childIndent);
            } else {
                obj[key] = {};
            }
        } else if (scalarMatch) {
            const key = unquoteKey(scalarMatch[1]);
            obj[key] = scalarMatch[2] === "{}" ? {} : parseScalar(scalarMatch[2]);
            pos.i++;
        } else {
            pos.i++; // unrecognized line shape — skip rather than throw
        }
    }
    return obj;
}

function parseListBody(lines: ToonLine[], pos: { i: number }, n: number, parentIndent: number): unknown[] {
    const items: unknown[] = [];
    const itemIndent = pos.i < lines.length ? lines[pos.i].indent : parentIndent + 1;
    for (let count = 0; count < n && pos.i < lines.length && lines[pos.i].indent === itemIndent; count++) {
        const line = lines[pos.i];
        if (line.text === "-") {
            pos.i++;
            const next = pos.i < lines.length ? lines[pos.i] : null;
            if (next && next.indent > itemIndent && (next.text === "-" || next.text.startsWith("- "))) {
                // encodeListItem's array branch: bare "-" followed by "- "-prefixed
                // items one level deeper is a nested list, not a nested object.
                items.push(parseListBody(lines, pos, Infinity, itemIndent));
            } else if (next && next.indent > itemIndent) {
                items.push(parseObjectBody(lines, pos, itemIndent));
            } else {
                items.push({});
            }
        } else if (line.text.startsWith("- ")) {
            items.push(parseScalar(line.text.slice(2)));
            pos.i++;
        } else {
            pos.i++; // defensive
        }
    }
    return items;
}

export function decodeToon(toon: string): unknown {
    if (!toon.trim()) return null;
    const lines = tokenizeToon(toon);
    if (lines.length === 0) return null;
    const pos = { i: 0 };
    // Top-level array (encodeToon's `encodeArrayInline("data", ...)` path).
    const first = lines[0];
    if (/^data\[\d+\]/.test(first.text)) {
        const obj = parseObjectBody(lines, pos, -1);
        return obj.data;
    }
    return parseObjectBody(lines, pos, -1);
}

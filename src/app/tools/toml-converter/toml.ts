// TOML parser / serializer for the TOML Converter tool.
//
// Extracted from page.tsx so it can be imported by Node without a React/DOM
// dependency — see scripts/toml-parser.test.ts for the regression suite.

// ──────────────────────────────────────────────────────────────────────────────
// Minimal TOML parser / serializer.
// Supports: key=value, dotted keys (a.b = 1), [section], [nested.section],
// [[array.of.tables]], inline tables ({ x = 1 }), nested arrays, strings
// (basic + literal), numbers, booleans, dates (as strings), and comments —
// including a `#` inside a quoted string, which naive line-splitting eats.
// Not supported: multi-line strings ("""..."""), offset date-times as real
// Date objects (they stay strings). Fall back to JSON for those.
// See toml-parser.test.mjs for the round-trip assertions covering the above.
// ──────────────────────────────────────────────────────────────────────────────

export type TomlValue = string | number | boolean | TomlValue[] | { [k: string]: TomlValue };

// Strip a trailing `# comment`, but only when the `#` is outside a string —
// otherwise `color = "#ff0000"` silently loses its value.
function stripComment(line: string): string {
    let quote: '"' | "'" | null = null;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (quote) {
            // Basic strings honour backslash escapes; literal ('') strings don't.
            if (quote === '"' && ch === "\\") { i++; continue; }
            if (ch === quote) quote = null;
        } else if (ch === '"' || ch === "'") {
            quote = ch;
        } else if (ch === "#") {
            return line.slice(0, i);
        }
    }
    return line;
}

// Split on top-level commas only, so quoted elements containing a comma
// ("Smith, John") survive intact.
function splitTopLevel(s: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let quote: '"' | "'" | null = null;
    let start = 0;
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (quote) {
            if (quote === '"' && ch === "\\") { i++; continue; }
            if (ch === quote) quote = null;
            continue;
        }
        if (ch === '"' || ch === "'") quote = ch;
        else if (ch === "[" || ch === "{") depth++;
        else if (ch === "]" || ch === "}") depth--;
        else if (ch === "," && depth === 0) {
            parts.push(s.slice(start, i));
            start = i + 1;
        }
    }
    parts.push(s.slice(start));
    return parts.map((p) => p.trim()).filter((p) => p.length > 0);
}

/** Walk/create a nested path, e.g. ["server","tls"] → root.server.tls */
function descend(root: Record<string, TomlValue>, path: string[]): Record<string, TomlValue> {
    let cur = root;
    for (const part of path) {
        const existing = cur[part];
        const next =
            typeof existing === "object" && existing !== null && !Array.isArray(existing)
                ? (existing as Record<string, TomlValue>)
                : {};
        cur[part] = next;
        cur = next;
    }
    return cur;
}

export function parseToml(src: string): TomlValue {
    const root: Record<string, TomlValue> = {};
    let cur: Record<string, TomlValue> = root;
    src.split("\n").forEach((rawLine) => {
        const line = stripComment(rawLine).trim();
        if (!line) return;

        // Array of tables: [[servers]] — appends a new element each time.
        const arrayTable = line.match(/^\[\[([^\]]+)\]\]$/);
        if (arrayTable) {
            const path = arrayTable[1].split(".").map((p) => p.trim());
            const key = path[path.length - 1];
            const parent = descend(root, path.slice(0, -1));
            const existing = parent[key];
            const arr = Array.isArray(existing) ? existing : [];
            const entry: Record<string, TomlValue> = {};
            arr.push(entry);
            parent[key] = arr;
            cur = entry;
            return;
        }

        const section = line.match(/^\[([^\]]+)\]$/);
        if (section) {
            cur = descend(root, section[1].split(".").map((p) => p.trim()));
            return;
        }

        const kv = line.match(/^((?:[A-Za-z0-9_-]+|"[^"]*"|'[^']*')(?:\s*\.\s*(?:[A-Za-z0-9_-]+|"[^"]*"|'[^']*'))*)\s*=\s*(.+)$/);
        if (!kv) return;
        // Dotted keys nest: `a.b = 1` is {a:{b:1}}, per the TOML spec.
        const keyPath = splitDottedKey(kv[1]);
        const target = keyPath.length > 1 ? descend(cur, keyPath.slice(0, -1)) : cur;
        target[keyPath[keyPath.length - 1]] = parseTomlValue(kv[2]);
    });
    return root;
}

function splitDottedKey(raw: string): string[] {
    const parts: string[] = [];
    let quote: '"' | "'" | null = null;
    let buf = "";
    for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];
        if (quote) {
            if (ch === quote) { quote = null; continue; }
            buf += ch;
            continue;
        }
        if (ch === '"' || ch === "'") { quote = ch; continue; }
        if (ch === ".") { parts.push(buf.trim()); buf = ""; continue; }
        buf += ch;
    }
    parts.push(buf.trim());
    return parts.filter((p) => p.length > 0);
}

function parseTomlValue(s: string): TomlValue {
    s = s.trim();
    if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
    if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1);
    if (s === "true") return true;
    if (s === "false") return false;
    if (/^-?\d+$/.test(s)) return parseInt(s, 10);
    if (/^-?\d+\.\d+(e-?\d+)?$/i.test(s)) return parseFloat(s);
    if (s.startsWith("[") && s.endsWith("]")) {
        const inner = s.slice(1, -1).trim();
        if (!inner) return [];
        return splitTopLevel(inner).map((p) => parseTomlValue(p));
    }
    if (s.startsWith("{") && s.endsWith("}")) {
        const inner = s.slice(1, -1).trim();
        const table: Record<string, TomlValue> = {};
        if (!inner) return table;
        for (const pair of splitTopLevel(inner)) {
            const eq = pair.match(/^(.+?)\s*=\s*(.+)$/);
            if (!eq) continue;
            const keyPath = splitDottedKey(eq[1].trim());
            const target = keyPath.length > 1 ? descend(table, keyPath.slice(0, -1)) : table;
            target[keyPath[keyPath.length - 1]] = parseTomlValue(eq[2]);
        }
        return table;
    }
    return s; // fallback: bare string (dates, unquoted values)
}

export function serializeToml(obj: TomlValue, prefix = ""): string {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
        throw new Error("TOML root must be an object");
    }
    const out: string[] = [];
    const entries = Object.entries(obj);
    const isTable = (v: unknown) => typeof v === "object" && v !== null && !Array.isArray(v);
    // An array whose entries are all tables round-trips as [[name]] blocks;
    // an inline array would be re-parsed as a plain array of strings.
    const isTableArray = (v: unknown) =>
        Array.isArray(v) && v.length > 0 && v.every(isTable);

    const scalars = entries.filter(([, v]) => !isTable(v) && !isTableArray(v));
    const tables = entries.filter(([, v]) => isTable(v));
    const tableArrays = entries.filter(([, v]) => isTableArray(v));

    if (prefix && (scalars.length || tables.length || tableArrays.length)) out.push(`[${prefix}]`);
    for (const [k, v] of scalars) out.push(`${k} = ${formatTomlValue(v)}`);

    for (const [k, v] of tableArrays) {
        const newPrefix = prefix ? `${prefix}.${k}` : k;
        for (const item of v as TomlValue[]) {
            const body = serializeToml(item, newPrefix);
            // serializeToml emits a [prefix] header; swap it for [[prefix]].
            out.push("", body.replace(`[${newPrefix}]`, `[[${newPrefix}]]`));
        }
    }

    for (const [k, v] of tables) {
        const newPrefix = prefix ? `${prefix}.${k}` : k;
        const sub = serializeToml(v as TomlValue, newPrefix);
        if (sub) out.push("", sub);
    }
    return out.join("\n").trim();
}

function formatTomlValue(v: unknown): string {
    if (typeof v === "string") return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (Array.isArray(v)) return `[${v.map(formatTomlValue).join(", ")}]`;
    if (v === null) return '""';
    return JSON.stringify(v);
}


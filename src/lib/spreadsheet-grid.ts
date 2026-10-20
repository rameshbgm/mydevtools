import { numberSourceRoundTrips } from "./json-number-source";

const MAX_CELLS = 100_000;
export type GridCell = string | number | boolean | null;
export function spreadsheetJson(rows: GridCell[][], records: boolean): string {
    if (!records) return JSON.stringify(rows, null, 2);
    if (!rows.length) return "[]";
    const headers = rows[0].map((cell) => cell === null ? "" : String(cell));
    if (headers.some((header) => !header.trim()) || new Set(headers).size !== headers.length) throw new Error("Object output needs unique, nonempty first-row headers. Choose row arrays to preserve this sheet.");
    return JSON.stringify(rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? null]))), null, 2);
}
export function jsonToSpreadsheetRows(source: string): GridCell[][] {
    if (source.length > 8 * 1024 * 1024 || new TextEncoder().encode(source).byteLength > 8 * 1024 * 1024) throw new Error("JSON input limit is 8 MiB.");
    // Parse for grammar first, then inspect the original numeric lexemes before
    // the parsed values can reach any cell. Skip complete JSON string tokens.
    // This intentionally retains the converter's 8 MiB limit rather than using
    // the separate query parser's smaller input limit.
    const value: unknown = JSON.parse(source);
    const tokens = source.match(/"(?:[^"\\]|\\[\s\S])*"|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/g) ?? [];
    for (const token of tokens) {
        if (token.startsWith('"')) continue;
        const number = Number(token), coefficient = token.replace(/^-/, "").split(/[eE]/)[0].replace(".", "").replace(/^0+|0+$/g, "");
        // Excel documents 15-digit precision and no denormalized numbers.
        // https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/floating-point-arithmetic-inaccurate-result
        if (!numberSourceRoundTrips(token) || coefficient.length > 15 || number !== 0 && Math.abs(number) < 2.2250738585072014e-308) throw new Error("A JSON number cannot be preserved safely as an Excel numeric cell. Quote precision-sensitive numbers as JSON strings to keep their exact text.");
    }
    if (!Array.isArray(value) || !value.length || value.length > 10_000) throw new Error("Use an array of 1–10,000 row arrays or objects.");
    const normalize = (cell: unknown): GridCell => { if (cell === null || typeof cell === "string" || typeof cell === "boolean" || typeof cell === "number" && Number.isFinite(cell)) return cell; if (cell && typeof cell === "object") return JSON.stringify(cell); throw new Error("Unsupported cell value."); };
    let rows: GridCell[][];
    if (value.every(Array.isArray)) rows = value.map((row) => row.map(normalize));
    else if (value.every((row) => row && typeof row === "object" && !Array.isArray(row))) { const keys = [...new Set(value.flatMap((row) => Object.keys(row)))]; rows = [keys, ...value.map((row) => keys.map((key) => normalize(row[key] ?? null)))]; }
    else throw new Error("Use only row arrays, or only objects, in the input array.");
    if (rows.length > 10_000 || rows.some((row) => row.length > 200) || rows.reduce((sum, row) => sum + row.length, 0) > MAX_CELLS) throw new Error("Export limit is 10,000 rows, 200 columns and 100,000 cells.");
    return rows;
}

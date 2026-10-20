import type { SqlJsStatic, SqlValue } from "sql.js";
import type { SqlResult } from "./sql-connector";
export interface SqliteRequest { bytes?: Uint8Array; sql: string; parameters: unknown[]; write: boolean }
export interface SqliteResponse { result: SqlResult; bytes?: Uint8Array }
export function executeSqlite(SQL: SqlJsStatic, input: SqliteRequest): SqliteResponse {
    if (input.bytes && (input.bytes.length > 32 * 1024 * 1024 || new TextDecoder().decode(input.bytes.subarray(0, 16)) !== "SQLite format 3\0")) throw new Error("Choose a valid SQLite database file of up to 32 MiB.");
    if (!input.sql.trim() || input.sql.length > 500_000 || input.parameters.length > 1000) throw new Error("Enter one SQL statement up to 500,000 characters and at most 1000 parameters.");
    const parameters = input.parameters.map((value): SqlValue => {
        if (value === null || typeof value === "string" || (typeof value === "number" && Number.isFinite(value) && (!Number.isInteger(value) || Number.isSafeInteger(value)))) return value;
        throw new Error("SQLite parameters must be strings, finite safe numbers or null. Pass large integers as strings and CAST them in SQL.");
    });
    const db = input.bytes ? new SQL.Database(input.bytes) : new SQL.Database();
    try {
        if (!input.write) db.run("PRAGMA query_only = ON");
        const iterator = db.iterateStatements(input.sql);
        for (const statement of iterator) {
            const remaining = iterator.getRemainingSQL();
            if (remaining.trim()) {
                let hasAnother = false;
                try { for (const other of db.iterateStatements(remaining)) { void other; hasAnother = true; break; } } catch { hasAnother = true; }
                if (hasAnother) throw new Error("Run one SQL statement at a time.");
            }
            statement.bind(parameters);
            const columns = statement.getColumnNames(), rows: unknown[][] = []; let truncated = false;
            while (statement.step()) {
                if (rows.length >= 500) { truncated = true; break; }
                // sql.js documents this precision option; @types/sql.js still
                // describes only the older one-argument get() overload.
                const values = (statement as unknown as { get(params: null, config: { useBigInt: true }): unknown[] }).get(null, { useBigInt: true });
                rows.push(values.map((value) => typeof value === "bigint" ? value.toString() : value instanceof Uint8Array ? { type: "binary", hex: Array.from(value).map((byte) => byte.toString(16).padStart(2, "0")).join(""), bytes: value.length } : value));
            }
            const result: SqlResult = { columns, rows, truncated, readOnly: !input.write, affectedRows: db.getRowsModified() };
            if (new TextEncoder().encode(JSON.stringify(result)).length > 2 * 1024 * 1024) throw new Error("Query results exceed 2 MiB. Select fewer rows or columns.");
            return { result, ...(input.write ? { bytes: db.export() } : {}) };
        }
        throw new Error("Enter a SQL statement.");
    } finally { db.close(); }
}

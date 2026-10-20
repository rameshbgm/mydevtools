import net from "node:net";
import { redactDocument } from "./redaction";
export interface SqlConnection {
    engine: "postgresql" | "mysql" | "mariadb";
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    tls: boolean;
}
export interface SqlResult { columns: string[]; rows: unknown[][]; truncated: boolean; readOnly: boolean; affectedRows?: number }
export function parseSqlConnection(value: unknown): SqlConnection {
    if (!value || typeof value !== "object") throw new Error("Enter connection settings.");
    const input = value as Record<string, unknown>;
    if (!["postgresql", "mysql", "mariadb"].includes(String(input.engine)) || typeof input.host !== "string" || !input.host || input.host.length > 253 || /[\s/\\@?#]/.test(input.host) || typeof input.port !== "number" || !Number.isInteger(input.port) || input.port < 1 || input.port > 65535 || typeof input.database !== "string" || input.database.length > 200 || typeof input.user !== "string" || !input.user || input.user.length > 200 || typeof input.password !== "string" || input.password.length > 4096 || typeof input.tls !== "boolean") throw new Error("Check the database engine, hostname, port, database, username and TLS setting.");
    const host = input.host.replace(/^\[|\]$/g, "");
    if (/^169\.254\.|^0\.|^fe[89ab][0-9a-f]:|^ff[0-9a-f]{0,2}:/i.test(host) || (net.isIP(host) === 4 && Number(host.split(".")[0]) >= 224)) throw new Error("Link-local, unspecified and multicast targets are not database hosts.");
    return { engine: input.engine as SqlConnection["engine"], host, port: input.port, database: input.database, user: input.user, password: input.password, tls: input.tls };
}
function jsonValue(value: unknown): unknown {
    if (typeof value === "number" && !Number.isFinite(value)) return { type: "number", value: String(value) };
    if (typeof value === "bigint") return value.toString();
    if (value instanceof Date) return value.toISOString();
    if (value instanceof Uint8Array) return { type: "binary", hex: Buffer.from(value).toString("hex"), bytes: value.byteLength };
    if (Array.isArray(value)) return value.map(jsonValue);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, jsonValue(child)]));
    return value;
}
export async function runSql(connection: SqlConnection, sql: string, parameters: unknown[], readOnly = true): Promise<SqlResult> {
    if (!sql.trim() || sql.length > 500_000 || parameters.length > 1000) throw new Error("Enter one SQL statement up to 500,000 characters and at most 1000 parameters.");
    try { return connection.engine === "postgresql" ? await postgres(connection, sql, parameters, readOnly) : await mysql(connection, sql, parameters, readOnly); }
    catch (cause) { let message = redactDocument(cause instanceof Error ? cause.message : String(cause)); if (connection.password) message = message.split(connection.password).join("[REDACTED]"); throw new Error(message.slice(0, 2000)); }
}
// Validate the displayed result before committing transactional writes, so a
// response rejected for size cannot silently commit a successful DML operation.
function safeResult(result: SqlResult): SqlResult {
    const safe = jsonValue(result) as SqlResult;
    if (Buffer.byteLength(JSON.stringify(safe)) > 2 * 1024 * 1024) throw new Error("Query results exceed 2 MiB. Select fewer rows/columns or smaller values.");
    return safe;
}
async function postgres(config: SqlConnection, sql: string, parameters: unknown[], readOnly: boolean): Promise<SqlResult> {
    const [{ Client, types }, { default: Cursor }] = await Promise.all([import("pg"), import("pg-cursor")]);
    // A password callback also represents an intentionally empty password.
    // Passing an empty string directly makes pg fall back to PGPASSWORD/pgpass.
    const client = new Client({ host: config.host, port: config.port, database: config.database || "postgres", user: config.user, password: () => config.password, application_name: "mydevtools", client_encoding: "UTF8", sslnegotiation: "postgres", options: "-c statement_timeout=8000 -c lock_timeout=5000", ssl: config.tls ? { rejectUnauthorized: true } : false, connectionTimeoutMillis: 5000, statement_timeout: 8000, query_timeout: 10_000 });
    // A socket error must reject the current request rather than become an
    // uncaught EventEmitter error. The deadline below also closes the socket.
    client.on("error", () => {});
    const deadline = setTimeout(() => { void client.end().catch(() => {}); }, 12_000);
    try {
        await client.connect();
        await client.query(readOnly ? "BEGIN READ ONLY" : "BEGIN");
        // Keep server wire text for dates and JSON, including arrays. Parsing JSON
        // here would round 64-bit integers before the table/export sees them.
        const textOids = new Set([1082, 1083, 1114, 1184, 1266, 1182, 1183, 1115, 1185, 1270, 114, 199, 3802, 3807]);
        const cursor = client.query(new Cursor(sql, parameters, { rowMode: "array", types: { getTypeParser: (oid, format) => textOids.has(Number(oid)) ? (value: string) => value : types.getTypeParser(oid, format) } }));
        let closed = false;
        try {
            const { rows, metadata } = await new Promise<{ rows: unknown[][]; metadata: import("pg").QueryResult }>((resolve, reject) => {
                cursor.read(501, (error, rows, metadata) => { if (error) reject(error); else resolve({ rows, metadata }); });
            });
            const columns = metadata.fields.map((field) => field.name);
            await cursor.close(); closed = true;
            const result = safeResult({ columns, rows: rows.slice(0, 500), truncated: rows.length > 500, readOnly, ...(metadata.command !== "SELECT" && metadata.rowCount !== null ? { affectedRows: metadata.rowCount } : {}) });
            await client.query(readOnly ? "ROLLBACK" : "COMMIT");
            return result;
        } finally { if (!closed) await cursor.close().catch(() => {}); }
    } finally { clearTimeout(deadline); await client.end().catch(() => {}); }
}
async function mysql(config: SqlConnection, sql: string, parameters: unknown[], readOnly: boolean): Promise<SqlResult> {
    const driver = await import("mysql2");
    const connection = driver.createConnection({ host: config.host, port: config.port, database: config.database || undefined, user: config.user, password: config.password, ssl: config.tls ? { rejectUnauthorized: true } : undefined, connectTimeout: 5000, multipleStatements: false, rowsAsArray: true, supportBigNumbers: true, bigNumberStrings: true, dateStrings: true, jsonStrings: true });
    connection.on("error", () => {});
    const deadline = setTimeout(() => connection.destroy(), 12_000);
    try {
        // DDL can implicitly end START TRANSACTION. Keep the session default
        // read-only too, so the next implicit transaction cannot become writable.
        if (readOnly) await connection.promise().query("SET SESSION TRANSACTION READ ONLY");
        await connection.promise().query(readOnly ? "START TRANSACTION READ ONLY" : "START TRANSACTION");
        const result = await new Promise<SqlResult>((resolve, reject) => {
            const rows: unknown[][] = []; let columns: string[] = [], affectedRows = 0, truncated = false;
            const query = connection.execute({ sql, values: parameters, timeout: 8000, rowsAsArray: true });
            query.on("fields", (fields) => { if (Array.isArray(fields)) columns = fields.map((field: { name: string }) => field.name); else if (fields?.name) columns = [fields.name]; });
            query.on("result", (row) => {
                if (Array.isArray(row)) {
                    if (rows.length === 500) {
                        truncated = true;
                        // A write with RETURNING must finish and commit even
                        // when only its first 500 result rows are displayed.
                        if (readOnly) { connection.destroy(); resolve({ columns, rows, truncated, readOnly }); }
                    }
                    else rows.push(row);
                } else if (row && typeof row === "object" && "affectedRows" in row) affectedRows = Number(row.affectedRows);
            });
            query.on("error", reject);
            query.on("end", () => resolve({ columns, rows, truncated, readOnly, affectedRows }));
        });
        const safe = safeResult(result);
        if (!result.truncated || !readOnly) await connection.promise().query(readOnly ? "ROLLBACK" : "COMMIT");
        return safe;
    } finally { clearTimeout(deadline); connection.destroy(); }
}

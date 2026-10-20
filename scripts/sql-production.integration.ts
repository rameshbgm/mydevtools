import assert from "node:assert/strict";
import type { SqlConnection, SqlResult } from "../src/lib/sql-connector";

const origin = process.env.EXPANSION_APP_ORIGIN ?? "http://127.0.0.1:3100";
if (new URL(origin).hostname !== "127.0.0.1") throw new Error("Use the owned loopback production fixture.");
const configurations: Array<[SqlConnection["engine"], number, string]> = [
    ["postgresql", Number(process.env.EXPANSION_PG_PORT), "fixture"],
    ["mysql", Number(process.env.EXPANSION_MYSQL_PORT), "root"],
    ["mariadb", Number(process.env.EXPANSION_MARIADB_PORT), "fixture"],
];
if (configurations.some(([, port]) => !Number.isInteger(port) || port < 1)) throw new Error("Set all three disposable SQL fixture ports.");
const headers = { "Content-Type": "application/json", Origin: origin, "X-MyDevtools-Local-Token": "public-fixture-local-access-key-2026-expansion" };
const call = async (connection: SqlConnection, sql: string, parameters: unknown[] = [], write = false, overrides = {}) => {
    const response = await fetch(origin + "/api/local-connectors", { method: "POST", headers: { ...headers, ...overrides }, body: JSON.stringify({ service: "sql", operation: "query", connection, sql, parameters, write }), signal: AbortSignal.timeout(20_000) });
    return { status: response.status, value: await response.json() as SqlResult & { error?: string } };
};
async function verify([engine, port, user]: typeof configurations[number]) {
    const connection: SqlConnection = { engine, host: "127.0.0.1", port, database: "fixture", user, password: "public-fixture-password-only", tls: false };
    assert.equal((await call(connection, "SELECT 1", [], false, { "X-MyDevtools-Local-Token": "" })).status, 401);
    assert.equal((await call(connection, "SELECT 1", [], false, { Origin: "https://other.example" })).status, 403);
    const sql = engine === "postgresql" ? "SELECT $1::bigint AS big, $2::text AS label, $3::jsonb AS document" : "SELECT CAST(? AS UNSIGNED) AS big, ? AS label, JSON_EXTRACT(?, '$') AS document";
    const precise = await call(connection, sql, ["9223372036854775807", "public 日本語 العربية 😀", '{"id":9223372036854775807}']);
    assert.equal(precise.status, 200, JSON.stringify(precise.value));
    assert.equal(precise.value.readOnly, true);
    assert.deepEqual(precise.value.columns, ["big", "label", "document"]);
    assert.equal(precise.value.rows[0][0], "9223372036854775807");
    assert.equal(precise.value.rows[0][1], "public 日本語 العربية 😀");
    assert.equal(typeof precise.value.rows[0][2], "string");
    assert.match(precise.value.rows[0][2] as string, /9223372036854775807/);
    try {
        const cleared = await call(connection, "DROP TABLE IF EXISTS expansion_production_readonly_fixture", [], true);
        assert.equal(cleared.status, 200, JSON.stringify(cleared.value));
        const denied = await call(connection, "CREATE TABLE expansion_production_readonly_fixture (id INTEGER)");
        assert.notEqual(denied.status, 200);
        assert.match(denied.value.error ?? "", /read.only|READ ONLY/i);
        const absentSql = engine === "postgresql" ? "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = current_schema() AND table_name = 'expansion_production_readonly_fixture'" : "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'expansion_production_readonly_fixture'";
        const absent = await call(connection, absentSql);
        assert.equal(absent.status, 200);
        assert.equal(String(absent.value.rows[0][0]), "0");
    } finally {
        const cleanup = await call(connection, "DROP TABLE IF EXISTS expansion_production_readonly_fixture", [], true);
        assert.equal(cleanup.status, 200, JSON.stringify(cleanup.value));
    }
    if (engine !== "mysql") {
        try {
            assert.equal((await call(connection, "DROP TABLE IF EXISTS expansion_production_write_fixture", [], true)).status, 200);
            assert.equal((await call(connection, "CREATE TABLE expansion_production_write_fixture (id INTEGER PRIMARY KEY)", [], true)).status, 200);
            const tuples = Array.from({ length: 600 }, (_, index) => `(${index + 1})`).join(",");
            const returned = await call(connection, `INSERT INTO expansion_production_write_fixture (id) VALUES ${tuples} RETURNING id`, [], true);
            assert.equal(returned.status, 200, JSON.stringify(returned.value));
            assert.equal(returned.value.readOnly, false);
            assert.equal(returned.value.rows.length, 500);
            assert.equal(returned.value.truncated, true);
            const count = await call(connection, "SELECT COUNT(*) FROM expansion_production_write_fixture");
            assert.equal(count.status, 200);
            assert.equal(String(count.value.rows[0][0]), "600");
            const oversized = await call(connection, "INSERT INTO expansion_production_write_fixture (id) VALUES (601) RETURNING REPEAT('x', 2097152) AS oversized", [], true);
            assert.equal(oversized.status, 502);
            assert.match(oversized.value.error ?? "", /exceed 2 MiB/);
            const rolledBack = await call(connection, "SELECT COUNT(*) FROM expansion_production_write_fixture WHERE id = 601");
            assert.equal(rolledBack.status, 200);
            assert.equal(String(rolledBack.value.rows[0][0]), "0");
        } finally {
            assert.equal((await call(connection, "DROP TABLE IF EXISTS expansion_production_write_fixture", [], true)).status, 200);
        }
    }
    console.log(`Production ${engine}: token/origin gates, Unicode/bigint/JSON wire precision and read-only DDL passed${engine === "mysql" ? "." : "; truncated-write commit and oversized-result rollback passed."}`);
}
Promise.all(configurations.map(verify)).catch((cause) => { console.error(cause); process.exitCode = 1; });

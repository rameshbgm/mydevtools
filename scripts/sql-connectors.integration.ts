import assert from "node:assert/strict";
import { runSql, type SqlConnection } from "../src/lib/sql-connector";
const password = "public-fixture-password-only";
async function verify(engine: SqlConnection["engine"], port: number, user: string) {
    const connection: SqlConnection = { engine, host: "127.0.0.1", port, database: "fixture", user, password, tls: false };
    let connected = false;
    for (let attempt = 0; attempt < 30; attempt++) {
        try { await runSql(connection, "SELECT 1", [], true); connected = true; break; }
        catch (error) { if (attempt === 29) throw error; await new Promise((resolve) => setTimeout(resolve, 1000)); }
    }
    assert.ok(connected);
    console.log(`${engine}: ${(await runSql(connection, "SELECT VERSION()", [], true)).rows[0][0]}`);
    const duplicate = await runSql(connection, "SELECT 1 AS duplicate, 2 AS duplicate", [], true);
    assert.deepEqual(duplicate.columns, ["duplicate", "duplicate"]); assert.deepEqual(duplicate.rows.map((row) => row.map(String)), [["1", "2"]]);
    await runSql(connection, "DROP TABLE IF EXISTS expansion_fixture", [], false);
    await runSql(connection, "CREATE TABLE expansion_fixture (id INTEGER PRIMARY KEY, label VARCHAR(100))", [], false);
    const insert = engine === "postgresql" ? "INSERT INTO expansion_fixture (id,label) VALUES ($1,$2)" : "INSERT INTO expansion_fixture (id,label) VALUES (?,?)";
    await runSql(connection, insert, [1, "public fixture 日本語 العربية 😀"], false);
    const parameters = engine === "postgresql" ? "SELECT label FROM expansion_fixture WHERE id = $1" : "SELECT label FROM expansion_fixture WHERE id = ?";
    assert.deepEqual((await runSql(connection, parameters, [1], true)).rows, [["public fixture 日本語 العربية 😀"]]);
    await runSql(connection, "DROP TABLE IF EXISTS expansion_readonly_fixture", [], false);
    await assert.rejects(() => runSql(connection, "CREATE TABLE expansion_readonly_fixture (id INTEGER)", [], true), /read.only|READ ONLY/i);
    const absentSql = engine === "postgresql" ? "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = current_schema() AND table_name = 'expansion_readonly_fixture'" : "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'expansion_readonly_fixture'";
    assert.equal(String((await runSql(connection, absentSql, [], true)).rows[0][0]), "0", "Rejected DDL must not leave a table behind");
    await assert.rejects(() => runSql(connection, insert, [2, "must not persist"], true), /read.only|READ ONLY/i);
    assert.equal(String((await runSql(connection, "SELECT COUNT(*) AS count FROM expansion_fixture", [], true)).rows[0][0]), "1");
    const thousand = engine === "postgresql" ? "SELECT n FROM generate_series(1,1000) AS n" : "WITH RECURSIVE numbers AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM numbers WHERE n < 1000) SELECT n FROM numbers";
    const limited = await runSql(connection, thousand, [], true);
    assert.equal(limited.rows.length, 500); assert.equal(limited.truncated, true);
    await assert.rejects(() => runSql(connection, "SELECT REPEAT('x', 2097152) AS oversized", [], true), /exceed 2 MiB/);
    const binary = engine === "postgresql" ? "SELECT decode('00ff','hex') AS bytes, 9223372036854775807::bigint AS big, '2026-10-19 12:34:56.123456'::timestamp AS time" : "SELECT X'00FF' AS bytes, CAST(9223372036854775807 AS UNSIGNED) AS big, CAST('2026-10-19 12:34:56.123456' AS DATETIME(6)) AS time";
    const precise = (await runSql(connection, binary, [], true)).rows[0];
    assert.deepEqual(precise[0], { type: "binary", hex: "00ff", bytes: 2 });
    assert.equal(precise[1], "9223372036854775807"); assert.equal(precise[2], "2026-10-19 12:34:56.123456");
    const jsonSql = engine === "postgresql" ? "SELECT $1::json AS document, $1::jsonb AS binary_document, ARRAY[$1::json] AS documents, ARRAY[$1::jsonb] AS binary_documents" : engine === "mariadb" ? "SELECT JSON_EXTRACT(?, '$') AS document" : "SELECT CAST(? AS JSON) AS document";
    const documents = (await runSql(connection, jsonSql, ['{"id":9223372036854775807,"text":"日本語 😀"}'], true)).rows[0];
    for (const document of documents) {
        assert.equal(typeof document, "string", `${engine} must preserve JSON number tokens instead of parsing them into JavaScript numbers`);
        assert.match(document as string, /9223372036854775807/);
        assert.match(document as string, /日本語 😀/);
    }
    const nullSql = engine === "postgresql" ? "SELECT NULL AS absent, 'null'::json AS json_null, 'null'::jsonb AS jsonb_null" : engine === "mariadb" ? "SELECT NULL AS absent, JSON_EXTRACT('null', '$') AS json_null" : "SELECT NULL AS absent, CAST('null' AS JSON) AS json_null";
    const nulls = (await runSql(connection, nullSql, [], true)).rows[0];
    assert.equal(nulls[0], null);
    for (const value of nulls.slice(1)) assert.equal(value, "null", "SQL NULL and JSON null must remain distinct");
    await assert.rejects(() => runSql({ ...connection, password: "incorrect public fixture password" }, "SELECT 1", [], true), (error: unknown) => error instanceof Error && !error.message.includes("incorrect public fixture password"));
    if (engine !== "mysql") {
        const tuples = Array.from({ length: 600 }, (_, index) => `(${index + 2}, 'returning fixture')`).join(",");
        const returned = await runSql(connection, `INSERT INTO expansion_fixture (id,label) VALUES ${tuples} RETURNING id`, [], false);
        assert.equal(returned.rows.length, 500); assert.equal(returned.truncated, true);
        assert.equal(String((await runSql(connection, "SELECT COUNT(*) FROM expansion_fixture", [], true)).rows[0][0]), "601", `${engine}: a display row limit must not roll back an explicit write`);
        await assert.rejects(() => runSql(connection, "INSERT INTO expansion_fixture (id,label) VALUES (602, 'oversized result') RETURNING REPEAT('x', 2097152) AS oversized", [], false), /exceed 2 MiB/);
        assert.equal(String((await runSql(connection, "SELECT COUNT(*) FROM expansion_fixture WHERE id = 602", [], true)).rows[0][0]), "0", `${engine}: a rejected oversized result must roll back its transactional write`);
    }
    await runSql(connection, "DROP TABLE expansion_fixture", [], false);
    console.log(`${engine}: real queries, bound parameters, database-enforced read-only mode, duplicate columns, row/size limits, write result semantics, binary/64-bit/timestamp/JSON precision, Unicode, read-only DDL and auth errors passed.`);
}
const pgPort = Number(process.env.EXPANSION_PG_PORT), mysqlPort = Number(process.env.EXPANSION_MYSQL_PORT), mariaPort = Number(process.env.EXPANSION_MARIADB_PORT);
if (!pgPort || !mysqlPort || !mariaPort) throw new Error("Set EXPANSION_PG_PORT, EXPANSION_MYSQL_PORT and EXPANSION_MARIADB_PORT to the disposable fixture ports. All three engines are required for this integration matrix.");
Promise.all([verify("postgresql", pgPort, "fixture"), verify("mysql", mysqlPort, "root"), verify("mariadb", mariaPort, "fixture")]).catch((error) => { console.error(error); process.exitCode = 1; });

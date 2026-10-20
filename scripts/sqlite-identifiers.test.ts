import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { executeSqlite } from "../src/lib/sqlite-workspace";
import { tableToCsv } from "../src/lib/table-export";
import { createUlidGenerator, generateNamedUuids, inspectUlid, UUID_NAMESPACES } from "../src/lib/uuid-tools";
async function main() {
const SQL = await initSqlJs();
const execute = (sql: string, bytes?: Uint8Array, write = false, parameters: unknown[] = []) => executeSqlite(SQL, { sql, bytes, write, parameters });
const created = execute("CREATE TABLE fixture (id INTEGER, note TEXT, bytes BLOB)", undefined, true);
assert.ok(created.bytes);
const inserted = execute("INSERT INTO fixture VALUES (9223372036854775807, ?, x'00ff80')", created.bytes, true, ["quoted,\ntext"]);
assert.equal(inserted.result.affectedRows, 1);
const result = execute("SELECT id, note, bytes, id AS id FROM fixture", inserted.bytes).result;
assert.deepEqual(result.columns, ["id", "note", "bytes", "id"]);
assert.deepEqual(result.rows[0], ["9223372036854775807", "quoted,\ntext", { type: "binary", hex: "00ff80", bytes: 3 }, "9223372036854775807"]);
assert.throws(() => execute("DELETE FROM fixture", inserted.bytes), /readonly/i);
assert.throws(() => execute("SELECT 1; DROP TABLE fixture", inserted.bytes, true), /one SQL statement/);
assert.equal(execute("SELECT count(*) FROM fixture; -- tail", inserted.bytes).result.rows[0][0], "1");
assert.throws(() => execute("SELECT ?", inserted.bytes, false, [Number.MAX_SAFE_INTEGER + 1]), /safe numbers/);
assert.throws(() => execute("SELECT 1", new Uint8Array([1, 2, 3])), /valid SQLite/);
const limited = execute("WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<600) SELECT x FROM n").result;
assert.equal(limited.rows.length, 500); assert.equal(limited.truncated, true);
assert.equal(tableToCsv(["id", "value"], [["9223372036854775807", '=HYPERLINK("https://example.com")'], [-3, "a,\n\"b\""]]), 'id,value\r\n9223372036854775807,"\'=HYPERLINK(""https://example.com"")"\r\n-3,"a,\n""b"""');
assert.equal(generateNamedUuids(["www.example.com"], UUID_NAMESPACES.DNS, 5)[0], "2ed6657d-e927-568b-95e1-2665a8aea6a2");
assert.equal(generateNamedUuids(["www.example.com"], UUID_NAMESPACES.DNS, 3)[0], "5df41881-3aed-3515-88a7-2f4a814cf09e");
assert.throws(() => generateNamedUuids(["name"], "bad", 5));
const generator = createUlidGenerator((bytes) => bytes.fill(0));
assert.equal(generator(0), "00000000000000000000000000");
assert.equal(generator(0), "00000000000000000000000001");
const third = generator(1000), fourth = generator(999); assert.ok(fourth > third); assert.equal(inspectUlid(fourth).unixMilliseconds, 1000);
assert.equal(inspectUlid("7ZZZZZZZZZZZZZZZZZZZZZZZZZ").unixMilliseconds, 0xffffffffffff);
assert.throws(() => inspectUlid("8ZZZZZZZZZZZZZZZZZZZZZZZZZ"));
assert.throws(() => inspectUlid("01ARZ3NDEKTSV4RRFFQ69G5FAI"));
const overflow = createUlidGenerator((bytes) => bytes.fill(255)); overflow(1); assert.throws(() => overflow(1), /overflow/);
console.log("SQLite binary/precision, read-only, bounds, CSV safety, RFC namespace UUIDs and monotonic ULID fixtures passed.");

}
main().catch((error) => { console.error(error); process.exitCode = 1; });

import assert from "node:assert/strict";
import { totp, encodeBase32, decodeBase32 } from "../src/lib/totp";
import { convertIntegerBase } from "../src/lib/number-base";
import { generateSecrets } from "../src/lib/random-secrets";
import { timezoneRow, zonedTimeToEpoch } from "../src/lib/timezone-planner";
import { UNIT_CATEGORIES, convertUnit } from "../src/lib/unit-converter";
import { encodeBinaryBase64, decodeBinaryBase64 } from "../src/lib/binary-base64";
import { queryJson } from "../src/lib/json-query";
import { formatSqlQuery, compactSqlQuery } from "../src/lib/sql-formatting";
import { htmlToMarkdown, markdownToHtmlDocument } from "../src/lib/html-markdown";
async function main() {
    // RFC 6238 Appendix B, all six timestamps and all three algorithms.
    const seconds = [59, 1111111109, 1111111111, 1234567890, 2000000000, 20000000000];
    const expected = { "SHA-1": ["94287082", "07081804", "14050471", "89005924", "69279037", "65353130"], "SHA-256": ["46119246", "68084774", "67062674", "91819424", "90698825", "77737706"], "SHA-512": ["90693936", "25091201", "99943326", "93441116", "38618901", "47863826"] };
    for (const algorithm of ["SHA-1", "SHA-256", "SHA-512"] as const) {
        const length = algorithm === "SHA-1" ? 20 : algorithm === "SHA-256" ? 32 : 64;
        const bytes = new TextEncoder().encode("1234567890".repeat(7).slice(0, length));
        const secret = encodeBase32(bytes);
        assert.deepEqual(decodeBase32(secret), bytes);
        for (let index = 0; index < seconds.length; index++) assert.equal((await totp(secret, { algorithm, digits: 8, seconds: seconds[index] })).code, expected[algorithm][index]);
    }
    for (const invalid of ["A", "AB", "MZXW6===extra", "MZXW6=", "1AAAAAAA"]) assert.throws(() => decodeBase32(invalid));
    assert.equal(convertIntegerBase("90071992547409931234567890", 10, 16), "4a817c800000029da1e6d2");
    assert.equal(convertIntegerBase("-0xFF", "auto", 2), "-11111111");
    assert.equal(convertIntegerBase("z", 36, 10), "35");
    assert.equal(convertIntegerBase(convertIntegerBase("1".repeat(1000), 2, 36), 36, 2), "1".repeat(1000));
    assert.throws(() => convertIntegerBase("10102", 2, 10));
    assert.throws(() => convertIntegerBase("1.2", 10, 2));
    const secrets = generateSecrets("abc😀", 128, 20);
    assert.equal(secrets.length, 20);
    for (const value of secrets) { assert.equal([...value].length, 128); assert.ok([...value].every((char) => "abc😀".includes(char))); }
    assert.throws(() => generateSecrets("aa", 20, 1));
    assert.throws(() => generateSecrets("a\nb", 20, 1));
    assert.throws(() => generateSecrets("abc", 4096, 1000));
    const meeting = zonedTimeToEpoch("2026-10-19T09:00", "Asia/Singapore");
    assert.equal(new Date(meeting).toISOString(), "2026-10-19T01:00:00.000Z");
    const la = timezoneRow(meeting, "America/Los_Angeles", "Asia/Singapore");
    assert.equal(la.dayShift, -1); assert.equal(la.time, "18:00");
    assert.equal(timezoneRow(meeting, "Asia/Kolkata", "Asia/Singapore").time, "06:30");
    assert.throws(() => zonedTimeToEpoch("2026-03-08T02:30", "America/New_York"), /does not exist/);
    assert.throws(() => zonedTimeToEpoch("2026-11-01T01:30", "America/New_York"), /occurs twice/);
    assert.equal(zonedTimeToEpoch("2026-11-01T01:30", "America/New_York", "later") - zonedTimeToEpoch("2026-11-01T01:30", "America/New_York", "earlier"), 3600000);
    assert.throws(() => zonedTimeToEpoch("2011-12-30T12:00", "Pacific/Apia"), /does not exist/);
    assert.throws(() => zonedTimeToEpoch("2026-02-30T12:00", "UTC"), /valid date/);
    assert.equal(convertUnit(32, "Temperature", "°F", "°C"), 0);
    assert.equal(convertUnit(0, "Temperature", "°C", "K"), 273.15);
    assert.equal(convertUnit(1, "Energy", "eV", "J"), 1.602176634e-19);
    assert.equal(convertUnit(1, "Data size", "MiB", "B"), 1048576);
    assert.throws(() => convertUnit(-1, "Temperature", "K", "°C"), /below zero/);
    assert.ok(Math.abs(convertUnit(1, "Volume", "gal UK", "L") - 4.54609) < 1e-12);
    for (const group of UNIT_CATEGORIES) for (const source of group.units) for (const target of group.units) {
        const result = convertUnit(convertUnit(5, group.name, source.symbol, target.symbol), group.name, target.symbol, source.symbol);
        assert.ok(Math.abs(result - 5) < 1e-6, `${group.name}: ${source.symbol} to ${target.symbol}`);
    }
    const binary = Uint8Array.from([0, 255, 128, 1]);
    assert.deepEqual(decodeBinaryBase64(encodeBinaryBase64(binary, "image/png", true)).bytes, binary);
    assert.equal(decodeBinaryBase64("data:image/png;base64,AP+AAQ==").mime, "image/png");
    for (const bad of ["A", "AB==", "AA=A", "data:text/html,hello", "data:bad;base64,AA=="]) assert.throws(() => decodeBinaryBase64(bad));
    const json = '{"items":[{"name":"a","n":1},{"name":"b","n":3}],"empty":false}';
    assert.deepEqual(queryJson(json, "items[?n > `1`].name", "jmespath"), ["b"]);
    assert.equal(queryJson(json, "length(items)", "jmespath"), 2);
    assert.equal(queryJson(json, "empty", "jmespath"), false);
    assert.equal(queryJson(json, "missing", "jmespath"), null);
    assert.deepEqual(queryJson(json, "$.items[?(@.n > 1)].name", "jsonpath"), ["b"]);
    const precise = '{"id":9223372036854775807,"fraction":0.9999999999999999999,"zero":-0,"overflow":1e400,"text":"日本語 العربية","ordinary":1.2500}';
    for (const engine of ["jsonpath", "jmespath"] as const) {
        assert.throws(() => queryJson(precise, engine === "jsonpath" ? "$" : "@", engine), /lose precision/);
        const projection = queryJson(precise, engine === "jsonpath" ? "$" : "@", engine, "strings");
        const expected = { id: "9223372036854775807", fraction: "0.9999999999999999999", zero: "-0", overflow: "1e400", text: "日本語 العربية", ordinary: 1.25 };
        assert.deepEqual(projection, engine === "jsonpath" ? [expected] : expected);
    }
    assert.deepEqual(queryJson('{"items":[{"id":9223372036854775807},{"id":9223372036854775806}]}', "items[?id == '9223372036854775807'].id", "jmespath", "strings"), ["9223372036854775807"]);
    assert.equal(queryJson('{"n":1e-0000000000000}', "n", "jmespath"), 1);
    assert.equal(queryJson('{"n":0.1000}', "n", "jmespath"), 0.1);
    assert.equal(queryJson('{"s":"😀"}', "length(s)", "jmespath"), 1);
    assert.equal(queryJson('{"s":"a𝌆b"}', "reverse(s)", "jmespath"), "b𝌆a");
    assert.deepEqual(queryJson('{"s":["𝌆","北"]}', "sort(s)", "jmespath"), ["北", "𝌆"]);
    assert.equal(queryJson('{"s":"é"}', "length(s)", "jmespath"), 2, "JMESPath counts code points, not graphemes");
    assert.deepEqual(queryJson('{"s":[{"name":"𝌆"},{"name":"北"}]}', "sort_by(s, &name)[].name", "jmespath"), ["北", "𝌆"]);
    assert.equal(queryJson('{"s":["𝌆","北"]}', "min(s)", "jmespath"), "北");
    assert.throws(() => queryJson("{}", "[?", "jmespath"));

    for (const dialect of ["postgresql", "mysql", "sqlite"] as const) {
        const sql = "select 'two  spaces' as value, 1 as n -- keep comment\nfrom example where id = 1;";
        assert.ok(formatSqlQuery(sql, dialect).includes("'two  spaces'"));
        const compact = compactSqlQuery(sql, dialect);
        assert.ok(compact.includes("'two  spaces'")); assert.ok(compact.includes("-- keep comment\n"));
    }
    assert.ok(compactSqlQuery("select $$space  preserved$$ as value;", "postgresql").includes("$$space  preserved$$"));
    assert.ok(formatSqlQuery("select json_extract(value, '$.x') from example;", "sqlite").includes("json_extract"));
    const md = await htmlToMarkdown('<h1>Example</h1><p><strong>Bold</strong> and <a href="https://example.com/">link</a></p><script>alert(1)</script><a href="javascript:alert(1)">unsafe</a><table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>Fixture</td></tr></tbody></table>');
    assert.ok(md.includes("# Example") && md.includes("**Bold**") && md.includes("[link](https://example.com/)"));
    assert.ok(md.includes("| Name |")); assert.equal(md.includes("alert(1)"), false);
    const document = await markdownToHtmlDocument('# Heading\n\n**Bold**\n\n<script>bad()</script>\n\n<img src="https://example.com/track" onerror="bad()">');
    assert.ok(document.includes("<h1>Heading</h1>") && document.includes("<strong>Bold</strong>"));
    assert.ok(document.includes("default-src 'none'")); assert.equal(document.includes("<script>"), false); assert.equal(document.includes("onerror"), false);
    await assert.rejects(() => htmlToMarkdown("x".repeat(1024 * 1024 + 1)), /1 MiB/);
    console.log("RFC 6238 vectors, precise arbitrary-base integers and bounded cryptographic secret generation passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

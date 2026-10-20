import { formatJsonText } from "../src/lib/json-formatting";
import { runWorkflow } from "../src/lib/workflow-engine";
import assert from "node:assert/strict";
import { detectCodeLanguage, formatSnippet, parseLibrary, resourceUrl } from "../src/lib/local-library";
import { vaultContents, bytesToBase64, base64ToBytes } from "../src/lib/vault-records";
import { isScalar, parseDocument } from "yaml";
async function main() {
    for (const url of ["javascript:alert(1)", "data:text/html,hi", "file:///etc/passwd", "https://user:password@example.com/"]) assert.throws(() => resourceUrl(url));
    assert.equal(resourceUrl("https://example.com/docs?q=hello"), "https://example.com/docs?q=hello");
    const bookmark = { id: "fixture", title: "Documentation", url: "https://example.com/", folder: "Docs", tags: ["reference"], updatedAt: "2026-10-19" };
    assert.equal(parseLibrary([bookmark], "bookmarks").length, 1);
    assert.throws(() => parseLibrary([bookmark, bookmark], "bookmarks"));
    assert.throws(() => parseLibrary([{ ...bookmark, url: "javascript:alert(1)" }], "bookmarks"));
    assert.equal(detectCodeLanguage('{"x":1}'), "json");
    assert.equal(detectCodeLanguage('<!DOCTYPE html><html><body>Hello</body></html>'), "html");
    assert.equal(await formatSnippet('{"id":9223372036854775807,"x":-0,"n":1.0000000000000000001}', "json"), '{\n  "id": 9223372036854775807,\n  "x": -0,\n  "n": 1.0000000000000000001\n}');
    assert.equal(detectCodeLanguage("def example():\n  return 1"), "python");
    assert.equal(detectCodeLanguage("select 'FROM name' from table_name;"), "sql");
    assert.equal(detectCodeLanguage("const value: string = 'hello';"), "typescript");
    assert.equal(await formatSnippet('{"x":1}', "json"), '{\n  "x": 1\n}');
    const formatted = await formatSnippet("select 'FROM name' as text from table_name", "sql");
    assert.ok(formatted.includes("'FROM name'"), "SQL formatting must not alter string contents");
    await assert.rejects(() => formatSnippet("def function(): pass", "python"), /Formatting is available/);

    const yamlSource = '# Preserve exact numeric tokens and YAML types.\nid: 9223372036854775807\ndecimal: 0.123456789012345678901\nzero: -0\nexponent: 1.00e+02\noverflow: 1e400\nhex: 0xFFFFFFFFFFFFFFFF\nquoted: "9223372036854775807"\nflag: true\nempty: null\nfirst: &exact 0.123456789012345678901\nagain: *exact\n';
    const formattedYaml = await formatSnippet(yamlSource, "yaml");
    // Failsafe parses scalars as text, independently of JavaScript numeric
    // rounding. Comparing Number-valued objects would miss the original bug.
    const originalText = parseDocument(yamlSource, { schema: "failsafe" }).toJS();
    assert.deepEqual(parseDocument(formattedYaml, { schema: "failsafe" }).toJS(), originalText);
    const typedYaml = parseDocument(formattedYaml, { intAsBigInt: true });
    assert.equal(typedYaml.get("id"), BigInt("9223372036854775807"));
    assert.equal(typeof typedYaml.get("decimal"), "number");
    assert.ok(Object.is(parseDocument(formattedYaml).get("zero"), -0));
    assert.equal(typedYaml.get("quoted"), "9223372036854775807");
    assert.equal(typedYaml.get("flag"), true);
    const nullScalar = typedYaml.get("empty", true);
    assert.ok(isScalar(nullScalar));
    assert.equal(nullScalar.value, null);
    const anchoredScalar = typedYaml.get("first", true);
    assert.ok(isScalar(anchoredScalar));
    assert.equal(anchoredScalar.anchor, "exact");
    assert.match(formattedYaml, /again: \*exact/);
    assert.match(formattedYaml, /^# Preserve exact numeric tokens and YAML types\./);
    const yaml11 = '%YAML 1.1\n---\nhex: 0xFFFFFFFFFFFFFFFF\nsexagesimal: 1:20:30.1234567890123456789\n';
    assert.match(await formatSnippet(yaml11, "yaml"), /sexagesimal: 1:20:30\.1234567890123456789/);
    for (const invalid of ["duplicate: 1\nduplicate: 2\n", "list: [unfinished", "a: *missing", "a: 1\n---\nb: 2"]) await assert.rejects(() => formatSnippet(invalid, "yaml"));
    const aliasExpansion = `a: &a [${Array(11).fill("x").join(",")}]\nb: &b [${Array(11).fill("*a").join(",")}]\nc: [${Array(11).fill("*b").join(",")}]\n`;
    await assert.rejects(() => formatSnippet(aliasExpansion, "yaml"), /Excessive alias count/);

    const exactJson = String.raw`{"id":9223372036854775807,"decimal":0.123456789012345678901,"zero":-0,"exponent":1.00e+02,"overflow":1e400,"duplicate":1,"duplicate":2,"text":"日本語 العربية \\ \" : , { }","empty":[],"object":{}}`;
    const pretty = formatJsonText(exactJson);
    assert.equal(formatJsonText(pretty, true), exactJson, "format/minify preserves every non-whitespace token, including duplicate keys");
    assert.ok(pretty.includes('"id": 9223372036854775807'));
    assert.equal(formatJsonText(' [ {}, [], true, null, " a b " ] ', true), '[{},[],true,null," a b "]');
    for (const invalid of ['', '{"x":}', '[1,]', '{"x":01}', 'NaN']) assert.throws(() => formatJsonText(invalid));
    assert.throws(() => formatJsonText('['.repeat(129) + '0' + ']'.repeat(129)), /128 nesting/);
    const steps = await runWorkflow(exactJson, [{ operation: "format-json", argument: "" }, { operation: "minify-json", argument: "" }]);
    assert.equal(steps[1].output, exactJson, "saved format workflows preserve precision too");
    const bytes = Uint8Array.from([0, 1, 2, 255]);
    assert.deepEqual(base64ToBytes(bytesToBase64(bytes)), bytes);
    const file = { id: "file", kind: "file", name: "example.bin", folder: "", username: "", environment: "", value: bytesToBase64(bytes), updatedAt: "2026-10-19", file: { mime: "application/octet-stream", size: bytes.length, modified: 0 } };
    assert.equal(vaultContents({ version: 1, records: [file] }, "files").records.length, 1);
    assert.throws(() => vaultContents({ version: 1, records: [file] }, "credentials"));
    assert.throws(() => vaultContents({ version: 1, records: [{ ...file, file: { ...file.file, size: 999999999 } }] }, "files"));
    // Node's independent encoder provides canonical byte fixtures. Accept old
    // unpadded values too, without rewriting their stored bytes or metadata.
    for (let length = 0; length <= 64; length++) {
        const expected = Buffer.from(Array.from({ length }, (_, index) => (index * 73 + 255) % 256));
        const canonical = expected.toString("base64");
        for (const encoded of [canonical, canonical.replace(/=+$/, "")]) {
            const record = { ...file, name: "public-画像-مرحبا.bin", value: encoded, file: { ...file.file, size: length } };
            assert.equal(vaultContents({ version: 1, records: [record] }, "files").records[0], record);
            assert.deepEqual(Buffer.from(base64ToBytes(encoded)), expected);
        }
    }
    for (const [encoded, size] of [["A", 0], ["=", 0], ["AA=", 1], ["AA===", 1], ["AB==", 1], ["AB", 1], ["AAB=", 2], ["AAB", 2], ["AA==", 0], ["AAEC", 4], ["", 1], ["AA\n==", 1], ["_w==", 1]] as const) {
        assert.throws(() => vaultContents({ version: 1, records: [{ ...file, value: encoded, file: { ...file.file, size } }] }, "files"), /invalid/);
    }
    const largest = Buffer.alloc(8 * 1024 * 1024, 0xa5).toString("base64");
    assert.equal(vaultContents({ version: 1, records: [{ ...file, value: largest, file: { ...file.file, size: 8 * 1024 * 1024 } }] }, "files").records[0].value, largest);
    console.log("Safe bookmark imports, snippet detection/formatting and encrypted file record validation passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

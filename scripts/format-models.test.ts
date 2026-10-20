import assert from "node:assert/strict";
import { convertStructuredFormat, type StructuredFormat } from "../src/lib/format-conversion";
import { inferSchema } from "../src/lib/schema-inference";
import { validateJsonSchema } from "../src/lib/json-schema-workbench";
import { generateModelFiles, MODEL_TARGETS, type ModelTarget } from "../src/lib/model-generation";
async function main() {
    const json = '{"root":{"name":"Example","count":3,"active":true,"tags":{"tag":["a","b"]}}}';
    const formats: StructuredFormat[] = ["json", "yaml", "toml", "xml"];
    const sources = Object.fromEntries(formats.map((format) => [format, convertStructuredFormat(json, "json", format)]));
    let combinations = 0;
    for (const from of formats) for (const to of formats) {
        if (from === to) continue;
        const output = convertStructuredFormat(sources[from], from, to);
        assert.ok(output.trim(), `${from} to ${to}`);
        const parsed = JSON.parse(convertStructuredFormat(output, to, "json"));
        assert.equal(parsed.root.name, "Example");
        assert.equal(String(parsed.root.count), "3");
        if (from !== "xml" && to !== "xml") assert.deepEqual(parsed, JSON.parse(json));
        combinations++;
    }
    assert.equal(combinations, 12);
    assert.throws(() => convertStructuredFormat('{"x":null}', "json", "toml"), /null/);
    assert.throws(() => convertStructuredFormat('{"x":null}', "json", "xml"), /null/);
    assert.throws(() => convertStructuredFormat('<!DOCTYPE x [<!ENTITY y "test">]><x>&y;</x>', "xml", "json"), /DTD/);
    assert.throws(() => convertStructuredFormat('{"x":"\\u0000"}', "json", "xml"), /XML 1.0/);
    assert.throws(() => convertStructuredFormat('x: !unsupported value', "yaml", "json"));
    assert.throws(() => convertStructuredFormat('x = 9007199254740999', "toml", "json"), /large integer/);
    const multiline = JSON.parse(convertStructuredFormat('text = """hello\nworld"""', "toml", "json"));
    assert.equal(multiline.text, "hello\nworld");
    const xmlAttributes = JSON.parse(convertStructuredFormat('<root id="01">text &amp; value</root>', "xml", "json"));
    assert.equal(xmlAttributes.root["@_id"], "01"); assert.equal(xmlAttributes.root["#text"], "text & value");

    // Every numeric source format must reject lossy decimals before a parser
    // turns them into an apparently harmless rounded Number.
    for (const literal of ["0.9999999999999999999", "1.0000000000000000001", "1e-400", "-0", "-0.0", "1e9999999999999999999"]) {
        const numericSources: Partial<Record<StructuredFormat, string>> = {
            json: `{"n":${literal}}`, yaml: `n: ${literal}`, toml: `n = ${literal}`,
        };
        for (const [from, source] of Object.entries(numericSources) as [StructuredFormat, string][]) {
            for (const to of formats.filter((format) => format !== from)) {
                assert.throws(() => convertStructuredFormat(source, from, to), /quoted string/, `${from} → ${to}: ${literal}`);
            }
        }
    }
    const exactDecimals = { n: 0.1, exponent: 1.25e-7, equivalent: 125, zero: 0 };
    for (const source of ['{"n":0.1,"exponent":1.25e-7,"equivalent":1.2500e2,"zero":0.0}', 'n: +.1\nexponent: 1.25e-7\nequivalent: 1.2500e2\nzero: 0.', 'n = +0.1\nexponent = 1.25e-7\nequivalent = 1.2500e2\nzero = 0.0']) {
        const from = source.startsWith("{") ? "json" : source.includes(" = ") ? "toml" : "yaml";
        for (const to of formats.filter((format) => format !== "xml")) {
            assert.deepEqual(JSON.parse(convertStructuredFormat(convertStructuredFormat(source, from, to), to, "json")), exactDecimals);
        }
    }
    const exactText = "0.9999999999999999999";
    for (const [from, source] of Object.entries({ json: `{"root":{"n":"${exactText}"}}`, yaml: `root:\n  n: "${exactText}"`, toml: `[root]\nn = "${exactText}"`, xml: `<root><n>${exactText}</n></root>` }) as [StructuredFormat, string][]) {
        for (const to of formats) {
            const converted = JSON.parse(convertStructuredFormat(convertStructuredFormat(source, from, to), to, "json"));
            assert.equal(converted.root.n, exactText, `quoted precision recovery ${from} → ${to}`);
        }
    }
    assert.throws(() => convertStructuredFormat("n: &decimal 0.9999999999999999999\ncopy: *decimal", "yaml", "json"), /quoted string/);
    assert.throws(() => convertStructuredFormat('n = [{ safe = 1, nested = [2, 0.9999999999999999999] }]', "toml", "json"), /quoted string/);
    assert.throws(() => convertStructuredFormat('n = 0.999_999_999_999_999_999_9', "toml", "json"), /quoted string/);
    assert.throws(() => convertStructuredFormat('[table] # unmatched quote " is only a comment\nn = 0.9999999999999999999', "toml", "json"), /quoted string/);
    const tomlSource = `# ignored = 0.9999999999999999999
"0.9999999999999999999" = "0.9999999999999999999"
0.9999999999999999999 = '1e-400'
escaped = "quote: \\\" and \\\\"
basic = """A value containing = 0.9999999999999999999
[fake.header] and # a comment and an escaped \\\" quote"""
literal = '''A literal containing = 0.9999999999999999999
[fake.header] and # a comment'''
four = """trailing quote""""
five = '''trailing quotes'''''
"fraction.key"."1e-400" = 1
['header]with bracket'] # unmatched comment quote "
"1e-400" = [
  0xF, # 0.9999999999999999999
  0o10, 0b11, +1_000.125,
  {"1e-400" = [true, false, "1e-400"]},
]
[[entries]]
n = 0.25
[[entries]]
n = 0.5
`;
    const scannedToml = JSON.parse(convertStructuredFormat(tomlSource, "toml", "json"));
    assert.equal(scannedToml["0.9999999999999999999"], exactText);
    assert.equal(scannedToml["0"]["9999999999999999999"], "1e-400", "numeric-looking dotted keys stay keys");
    assert.equal(scannedToml.four, 'trailing quote"'); assert.equal(scannedToml.five, "trailing quotes''");
    assert.deepEqual(scannedToml["header]with bracket"]["1e-400"], [15, 8, 3, 1000.125, { "1e-400": [true, false, "1e-400"] }]);
    assert.deepEqual(scannedToml.entries, [{ n: 0.25 }, { n: 0.5 }]);
    const tomlDates = `date = 1979-05-27
local = 1979-05-27T07:32:00.123456789
offset = 1979-05-27T07:32:00.123456789-07:00
space = 1979-05-27 07:32:00.0000000001z
times = [07:32:00.123456789, {time = 07:32:00.0000000001}]
`;
    const exactDates = { date: "1979-05-27", local: "1979-05-27T07:32:00.123456789", offset: "1979-05-27T07:32:00.123456789-07:00", space: "1979-05-27T07:32:00.0000000001Z", times: ["07:32:00.123456789", { time: "07:32:00.0000000001" }] };
    for (const to of ["json", "yaml", "toml"] as StructuredFormat[]) {
        assert.deepEqual(JSON.parse(convertStructuredFormat(convertStructuredFormat(tomlDates, "toml", to), to, "json")), exactDates, `TOML fractional-second precision → ${to}`);
    }
    const datesXml = convertStructuredFormat(tomlDates, "toml", "xml");
    assert.match(datesXml, /1979-05-27T07:32:00\.123456789-07:00/); assert.match(datesXml, /07:32:00\.0000000001/);

    const examples = [{ id: 1, name: "Example", optional: "seen" }, { id: 2.5, name: null }];
    const schema = inferSchema(JSON.stringify(examples), { multipleSamples: true });
    for (const example of examples) assert.equal(validateJsonSchema(example, schema).length, 0);
    assert.deepEqual(schema.required, ["id", "name"]);
    assert.equal(validateJsonSchema({ id: "not numeric", name: "Example" }, schema).length > 0, true);
    const closed = inferSchema('{"name":"Example"}', { closedObjects: true });
    assert.ok(validateJsonSchema({ name: "Example", extra: true }, closed).length > 0);
    assert.equal(validateJsonSchema({ extra: true }, inferSchema("{}" )).length, 0);
    assert.equal(validateJsonSchema(["anything"], inferSchema("[]")).length, 0);
    assert.throws(() => inferSchema("[]", { multipleSamples: true }));
    assert.equal(Object.prototype.hasOwnProperty.call((inferSchema('{"__proto__":{"x":1}}').properties as object), "__proto__"), true);
    for (const literal of ["0.9999999999999999999", "1.0000000000000000001", "1e-400", "-1e-999999999999999999999", "12.5e-1"]) {
        assert.deepEqual(inferSchema(literal), { $schema: "https://json-schema.org/draft/2020-12/schema", type: "number" }, literal);
    }
    for (const literal of ["9223372036854775807", "-0", "1.00", "1.25e2", "1e400", "1e999999999999999999999", "0e-999999999999999999999", "1e-0000000000000"]) {
        assert.deepEqual(inferSchema(literal), { $schema: "https://json-schema.org/draft/2020-12/schema", type: "integer" }, literal);
    }
    const fractional = inferSchema('[{"n":9223372036854775807},{"n":0.9999999999999999999}]', { multipleSamples: true });
    assert.deepEqual((fractional.properties as Record<string, unknown>).n, { type: "number" });
    const shaped = inferSchema('{"n":{"source":"1","integer":true},"dup":0.1,"dup":1,"items":[1e-400,1]}');
    assert.equal((shaped.properties as Record<string, { type: string }>).n.type, "object", "user data cannot impersonate numeric parser nodes");
    assert.equal((shaped.properties as Record<string, { type: string }>).dup.type, "integer", "duplicate keys match native JSON last-value semantics");

    const modelInput = '{"id":1,"name":"Example","address":{"city":"Singapore"},"tags":["developer"]}';
    for (const target of Object.keys(MODEL_TARGETS) as ModelTarget[]) {
        const files = await generateModelFiles(modelInput, target, "ExampleModel");
        assert.ok(files.length > 0 && files.every((file) => file.content.length > 0));
        const code = files.map((file) => file.content).join("\n");
        assert.match(code, /ExampleModel/); assert.match(code, /[Cc]ity/); assert.match(code, /[Tt]ags/);
        if (target === "java") assert.ok(files.some((file) => file.filename === "Address.java"), "Java must be delivered as separate source files");
    }
    await assert.rejects(() => generateModelFiles(modelInput, "python", "unsafe/name"), /type name/);
    console.log("All 12 format directions, unsafe/lossy conversion errors, sample schema validation and nine model targets passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

// Round-trip check for the TOON codec: encodeToon -> decodeToon must recover
// the original value exactly. This is the property that actually matters for
// a codec, and the cheapest thing that fails if the parser breaks.
//
// Run with: npx tsx scripts/toon-roundtrip.test.ts  (also wired as `npm run test:toon`)

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { encodeToon, decodeToon } from "../src/lib/toon";

const fixtures: { name: string; data: unknown }[] = [
    { name: "tabular array", data: [{ id: 1, name: "Ada", role: "admin" }, { id: 2, name: "Bob", role: "user" }] },
    { name: "nested object", data: { title: "mydevtools", version: "1.4", active: true, tags: ["a", "b", "c"] } },
    { name: "empty array", data: { items: [] } },
    { name: "empty object", data: { config: {} } },
    { name: "string needing quotes", data: { note: "has, a comma", weird: "true", num_str: "42" } },
    { name: "unicode", data: { name: "Ada Lovelace 日本語", emoji: "🎉" } },
    { name: "nested list of objects (non-uniform)", data: { mixed: [{ a: 1 }, { b: 2, c: 3 }] } },
    { name: "list of scalars", data: { nums: [1, 2, 3] } },
    { name: "list of lists", data: { grid: [[1, 2], [3, 4]] } },
    { name: "deep nesting", data: { a: { b: { c: { d: "deep" } } } } },
    { name: "top-level array", data: [1, 2, 3] },
    { name: "single object top-level array of objects", data: [{ x: 1 }] },
    { name: "nested tabular inside object", data: { report: { title: "Q1", rows: [{ a: 1, b: "x" }, { a: 2, b: "y" }] } } },
    { name: "table with quoted comma cell", data: [{ id: 1, note: "a, b" }, { id: 2, note: "c" }] },
    { name: "negative and float numbers", data: { neg: -5, pi: 3.14, exp: 1e10 } },
    { name: "string that looks like float", data: { v: "3.14" } },
    { name: "empty string value", data: { blank: "" } },
    { name: "key needing quotes", data: { "weird key!": 1 } },
    { name: "boolean array", data: { flags: [true, false, true] } },
    { name: "null in table cell", data: [{ a: 1, b: null }, { a: 2, b: "x" }] },
];

let pass = 0;
for (const f of fixtures) {
    const toon = encodeToon(f.data);
    const roundtrip = decodeToon(toon);
    try {
        assert.deepStrictEqual(roundtrip, f.data, `round-trip mismatch for "${f.name}"`);
        pass++;
    } catch (err) {
        console.error(`FAIL: ${f.name}`);
        console.error("  original:  ", JSON.stringify(f.data));
        console.error("  toon:\n" + toon.split("\n").map((l) => "    " + l).join("\n"));
        console.error("  roundtrip: ", JSON.stringify(roundtrip));
        throw err;
    }
}

console.log(`✓ ${pass}/${fixtures.length} TOON round-trip fixtures passed`);

// Expected values are from the independently maintained official MIT fixtures,
// not values produced by this codec. Non-strict mode is outside our subset.
const official = JSON.parse(readFileSync(resolve("scripts/fixtures/toon/official-decode.json"), "utf8")) as { tests: { name: string; input: string; expected: unknown }[] };
for (const row of official.tests) assert.deepEqual(decodeToon(row.input), row.expected, `Official: ${row.name}`);
const edgeCases: unknown[] = [null, true, false, 0, -3, 1e-7, "hello", "true", "42", "1e+2", "#note", "-item", "", {}, [], [[], {}], { data: [1, 2] },
    [{ "a,b": "true", 'x:y': "001", 'say"hi': "null" }, { "a,b": "42", 'x:y': "1e+2", 'say"hi': " leading " }],
    JSON.parse('{"__proto__":{"value":1},"constructor":[{"__proto__":"x"},{"__proto__":"y"}]}'),
    { rows: [null, { a: [[], {}, [true, "false"]] }, [1, { "a:b": " x " }]] }, { "quoted:key": { 'other,key': ["a\\b", "\t", "\u0000", "🌍 العربية"] } },
];
for (const value of edgeCases) assert.deepEqual(decodeToon(encodeToon(value)), value, JSON.stringify(value));
for (const source of ["a[2]: 1", "a[1]: 1,2", "a[1]{id,name}:\n  1", "a[2]{id}:\n  1", "a:\n   b: 1", "a: 1\n  b: 2", "a: 1\na: 2", "a[01]: x", "a[1|]: x", "a[1]{x,x}:\n  1,2", "a[1]:\n  1", "[1]: a\ntrailing: value", 'a: "unterminated', "1e999"]) assert.throws(() => decodeToon(source), { name: "Error" }, source);
assert.deepEqual(decodeToon("data[2]: 1,2"), { data: [1, 2] }, "A named data field remains an object rather than being silently unwrapped");
assert.deepEqual(decodeToon("data[2]: 1,2", { legacyDataRootArray: true }), [1, 2]);
assert.equal(encodeToon([1, 2]), "[2]: 1,2");
assert.throws(() => encodeToon("\ud800"));
console.log(`✓ ${official.tests.length} independent official strict vectors and ${edgeCases.length} structural/type round trips; malformed counts/keys/indentation rejected`);

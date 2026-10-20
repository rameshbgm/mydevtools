import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { queryJson } from "../src/lib/json-query";
import { search } from "../src/lib/vendor/jmespath.mjs";

interface ComplianceCase { expression: string; result?: unknown; error?: string; bench?: string }
interface ComplianceGroup { given: unknown; cases: ComplianceCase[] }
const expectedErrors: Record<string, RegExp> = {
    syntax: /Parser|Lexer|Syntax|Unexpected|Invalid token|Expect|JSON|Unknown character|not allowed/i,
    "invalid-arity": /ArgumentError|arity/i,
    "invalid-type": /TypeError|invalid.type/i,
    "invalid-value": /Invalid slice|invalid.value/i,
    "unknown-function": /Unknown function/i,
};
// These unmodified fixtures are included with the Apache-2.0 upstream JS engine.
// An optional path runs the independent, newer official compliance repository too.
const directory = process.env.JMESPATH_COMPLIANCE_DIR ?? fileURLToPath(new URL("./fixtures/jmespath/", import.meta.url));
let count = 0;
for (const file of readdirSync(directory).filter((file) => file.endsWith(".json")).sort()) {
    const groups = JSON.parse(readFileSync(`${directory}/${file}`, "utf8")) as ComplianceGroup[];
    for (const group of groups) for (const test of group.cases) {
        if (test.bench) continue;
        const context = `${file}: ${test.expression}`;
        if (test.error) {
            assert.throws(() => search(group.given, test.expression), expectedErrors[test.error], context);
        } else {
            assert.deepEqual(search(group.given, test.expression), test.result, context);
        }
        count++;
    }
}

const run = (input: unknown, expression: string) => queryJson(JSON.stringify(input), expression, "jmespath");
for (const [text, length, reverse] of [
    ["😀", 1, "😀"], ["a𝌆b", 3, "b𝌆a"], ["é", 2, "́e"],
    ["👨‍👩‍👧‍👦", 7, "👦‍👧‍👩‍👨"], ["日本語", 3, "語本日"], ["عربي", 4, "يبرع"],
] as const) {
    assert.equal(run({ text }, "length(text)"), length);
    assert.equal(run({ text }, "reverse(text)"), reverse);
}
const letters = ["𝌆", "北", "é", "é", "a", "Z", "😀", "𐀀", "\uFFFF"];
const sorted = ["Z", "a", "é", "é", "北", "\uFFFF", "𐀀", "𝌆", "😀"];
assert.deepEqual(run(letters, "sort(@)"), sorted);
assert.equal(run(letters, "min(@)"), "Z");
assert.equal(run(letters, "max(@)"), "😀");
const records = letters.map((key, index) => ({ key, index }));
assert.deepEqual(run(records, "sort_by(@, &key)[].key"), sorted);
assert.deepEqual(run(records, "min_by(@, &key)"), { key: "Z", index: 5 });
assert.deepEqual(run(records, "max_by(@, &key)"), { key: "😀", index: 6 });
assert.deepEqual(run([2, 10, 1, -100, 0.5, 1.25], "sort(@)"), [-100, 0.5, 1, 1.25, 2, 10]);
assert.equal(run([0, 1], "min_by(@, &@)"), 0);
assert.equal(run([0, -1], "max_by(@, &@)"), 0);
assert.equal(run([], "max_by(@, &@)"), null);
assert.equal(run([], "min_by(@, &@)"), null);
assert.equal(run([], "avg(@)"), null);
assert.deepEqual(run([{ key: "x", n: 1 }, { key: "x", n: 2 }], "sort_by(@, &key)[].n"), [1, 2]);
assert.equal(run([{ key: "x", n: 1 }, { key: "x", n: 2 }], "max_by(@, &key).n"), 1);
for (const operation of ["sort_by", "min_by", "max_by"]) {
    for (const input of [[{ key: false }], [{ key: 1 }, { key: "2" }], [{ key: null }]]) {
        assert.throws(() => run(input, `${operation}(@, &key)`), /TypeError/);
    }
}
assert.equal(run({ data: [{ x: [1, null] }] }, "contains(data, `{\"x\":[1,null]}`)"), true);
assert.equal(run({ data: [{ x: [1, null] }] }, "contains(data, `{\"x\":[1,false]}`)"), false);
assert.equal(run("false", "contains(@, `false`)"), false);
assert.equal(run("a", "starts_with(@, 'aa')"), false);
assert.equal(run("a", "ends_with(@, 'aa')"), false);
assert.equal(run("a", "starts_with(@, '')"), true);
assert.equal(run("a", "ends_with(@, '')"), true);
for (const expression of ["`1` < '2'", "'a' < 'b'", "`null` <= `0`", "`false` > `0`", "`[]` >= `[]`"]) {
    assert.equal(run({}, expression), null, `Ordering must not coerce non-numeric operands: ${expression}`);
}
for (const value of ["", " ", "\n", "+1", "01", ".1", "0x10", "0b10", "Infinity", "NaN", "1e400", " 1", "1 "]) {
    assert.equal(run(value, "to_number(@)"), null, value);
}
assert.equal(run("-1.25e+2", "to_number(@)"), -125);
assert.throws(() => run({}, "merge(`{}`, `1`)"), /TypeError/);
assert.throws(() => run({}, "merge(`{}`, `{}`, `false`)"), /TypeError/);
assert.throws(() => run({}, "constructor()"), /Unknown function/);
assert.throws(() => run({}, "__proto__()"), /Unknown function/);
assert.equal(run({}, "constructor"), null);
assert.equal(run({}, "__proto__"), null);
assert.equal(run({ hasOwnProperty: false }, "!@"), false);
assert.equal(run({ jmespathType: "Expref" }, "type(@)"), "object");
assert.throws(() => run({ jmespathType: "Expref", type: "Literal", value: 9 }, "map(@, `[1]`)"), /TypeError/);
const special = JSON.parse('{"__proto__":{"polluted":true},"constructor":9,"hasOwnProperty":false}') as unknown;
assert.deepEqual(run(special, "merge(@, `{\"added\":1}`)"), { ...special as object, added: 1 });
assert.deepEqual(run(special, '{"__proto__": "__proto__", constructor: constructor}'), JSON.parse('{"__proto__":{"polluted":true},"constructor":9}'));
assert.equal(run(special, "@ == @"), true);
assert.equal(Object.hasOwn(Object.prototype, "polluted"), false);
assert.equal(run({}, "'a\\'b\\'c'"), "a'b'c");
assert.equal(run({}, "`\"a\\`b\\`c\"`"), "a`b`c");
assert.equal(run({ a: 1 }, "a\r"), 1);
for (const expression of ["'unterminated", '"unterminated', "`1", "`false", "`plain`", "[:::]", "[1 2:3]", "[1-2]", "[--1]", "[::0]"]) {
    assert.throws(() => run([], expression), Error, expression);
}
// JSON literals and input documents follow the same explicit precision policy.
for (const literal of ["9223372036854775807", "0.9999999999999999999", "-0", "1e400"]) {
    assert.throws(() => queryJson("{}", `\`${literal}\``, "jmespath"), /lose precision/);
    assert.equal(queryJson("{}", `\`${literal}\``, "jmespath", "strings"), literal);
}
assert.throws(() => run([1e308, 1e308], "sum(@)"), /finite JSON number range/);
assert.equal(run([1e308, 1e308], "avg(@)"), 1e308);
assert.equal(run([Number.MIN_VALUE, Number.MIN_VALUE], "avg(@)"), Number.MIN_VALUE);
assert.deepEqual(run({ a: { x: 1 } }, "keys(@.a)"), ["x"]);
assert.equal(run({ a: true }, "(@.a)"), true);
for (const expression of ["[a b]", "{a:a b:b}", "join('' `[]`)", "length(@,)", "(a b)"]) assert.throws(() => run({}, expression));
// Regression against JS argument-count limits in extrema and flattening.
const large = new Array(150_000).fill(1) as number[];
assert.equal(run(large, "max(@)"), 1);
assert.equal(run(large, "min(@)"), 1);
assert.equal((run([large], "[]") as unknown[]).length, 150_000);
assert.deepEqual(queryJson('{"items":[{"n":1},{"n":3}]}', "$.items[?(@.n > 1)].n", "jsonpath"), [3]);
console.log(`JMESPath: ${count} official compliance cases, Unicode ordering, all core functions, precision, type/syntax errors and safe JSON keys passed.`);

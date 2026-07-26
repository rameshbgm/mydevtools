// Regression tests for the in-file TOML parser used by the TOML Converter tool.
//
// These pin the three silent data-corruption bugs found in the v1.4 parser:
//   1. `color = "#ff0000"` → the `#` was treated as a comment, value became ""
//   2. `["Smith, John"]`   → split on every comma, shredding quoted elements
//   3. `a.b = 1`           → produced the literal key "a.b" instead of nesting
// plus inline tables and arrays of tables, which were previously unsupported.
//
// Run with: npx tsx scripts/toml-parser.test.ts  (wired as `npm run test:toml`)

import assert from "node:assert";
import { parseToml, serializeToml } from "../src/app/tools/toml-converter/toml";

let passed = 0;
function check(name: string, actual: unknown, expected: unknown) {
    assert.deepStrictEqual(actual, expected, `${name}\n  got:  ${JSON.stringify(actual)}\n  want: ${JSON.stringify(expected)}`);
    passed++;
}

// ── comments vs strings ──
check("# inside a basic string", parseToml('color = "#ff0000"'), { color: "#ff0000" });
check("# in a URL fragment", parseToml('url = "https://x.com/p#frag"'), { url: "https://x.com/p#frag" });
check("real trailing comment", parseToml("a = 1 # note"), { a: 1 });
check("full-line comment", parseToml("# just a note\na = 1"), { a: 1 });
check("# inside a literal string", parseToml("s = '#lit'"), { s: "#lit" });

// ── arrays ──
check("comma inside quoted element", parseToml('n = ["Smith, John", "Doe, Jane"]'), {
    n: ["Smith, John", "Doe, Jane"],
});
check("nested arrays", parseToml("n = [[1,2],[3,4]]"), { n: [[1, 2], [3, 4]] });
check("empty array", parseToml("n = []"), { n: [] });

// ── keys and tables ──
check("dotted key nests", parseToml("a.b = 1"), { a: { b: 1 } });
check("quoted dotted key", parseToml('"a.b" = 1'), { "a.b": 1 });
check("nested sections", parseToml("[a]\nb = 1\n[a.c]\nd = 2"), { a: { b: 1, c: { d: 2 } } });
check("inline table", parseToml("pt = { x = 1, y = 2 }"), { pt: { x: 1, y: 2 } });
check("array of tables", parseToml('[[srv]]\nname="a"\n[[srv]]\nname="b"'), {
    srv: [{ name: "a" }, { name: "b" }],
});

// ── scalars ──
check("types", parseToml('i = 1\nf = 1.5\nb = true\ns = "x"'), { i: 1, f: 1.5, b: true, s: "x" });
check("literal string keeps backslashes", parseToml("p = 'C:\\path\\n'"), { p: "C:\\path\\n" });

// ── round trips ──
function roundTrip(name: string, toml: string) {
    const parsed = parseToml(toml);
    const reparsed = parseToml(serializeToml(parsed));
    check(`round-trip: ${name}`, reparsed, parsed);
}
roundTrip("basic config", 'title = "x"\n\n[server]\nhost = "0.0.0.0"\nport = 3000\nenabled = true');
roundTrip("array of tables", '[[srv]]\nname="a"\nport=1\n\n[[srv]]\nname="b"\nport=2');
roundTrip("strings with # and commas", 'color = "#abc"\nlist = ["a, b", "c"]');
roundTrip("deep nesting", "[a.b.c]\nd = 1\n[a.b.e]\nf = 2");

console.log(`✓ ${passed}/${passed} TOML parser assertions passed`);

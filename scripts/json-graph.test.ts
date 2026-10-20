import assert from "node:assert/strict";
import { graphTableCsv, graphCellText, graphJsonText, graphNodeSummary, graphArrayTable, indexJsonGraph, jsonGraphLayout, jsonGraphSvg, JSON_GRAPH_PALETTES } from "../src/lib/json-graph";
const graph = indexJsonGraph('{"users":[{"name":"Asha","score":1},{"name":"María","score":2}],"a.b":{"quote\\\"key":null},"__proto__":{"safe":true}}');
assert.equal(graph.nodes[0].children.length, 3);
assert.equal(graph.nodes.find((n) => n.key === 'quote"key')?.path, '$["a.b"]["quote\\\"key"]');
assert.equal(graph.nodes.find((n) => n.key === "safe")?.path, '$["__proto__"]["safe"]');
assert.equal(graph.unsafeNumbers, false);
const expanded = jsonGraphLayout(graph, new Set()); assert.equal(expanded.nodes.length, graph.nodes.length); assert.ok(expanded.width > 0 && expanded.height > 0);
for (const node of expanded.nodes) { assert.ok(node.y >= 0); if (node.parent !== null) assert.ok(expanded.nodes.find((n) => n.id === node.parent)!.x < node.x); }
assert.equal(jsonGraphLayout(graph, new Set([0])).nodes.length, 1);
const users = graph.nodes.find((n) => n.key === "users")!;
const focused = jsonGraphLayout(graph, new Set(), users.id); assert.equal(focused.nodes[0].id, users.id); assert.equal(focused.nodes[0].x, 24);
const limited = jsonGraphLayout(indexJsonGraph(JSON.stringify(Array.from({ length: 800 }, (_, i) => i))), new Set()); assert.equal(limited.nodes.length, 500); assert.equal(limited.limited, true);
const table = graphArrayTable(users.value)!; assert.deepEqual(table.columns, ["name", "score"]); assert.deepEqual(table.rows, [["Asha", 1], ["María", 2]]);
assert.deepEqual(graphArrayTable([{ "__proto__": null }, JSON.parse('{"__proto__":"safe","x":2}')])!.rows, [[null, null], ["safe", 2]]);
assert.deepEqual(graphArrayTable([null, 2, [3]])!.rows, [[null], [2], [[3]]]); assert.equal(graphArrayTable(null), null);
assert.equal(graphArrayTable(Array.from({ length: 1001 }, () => 1))!.limited, true);
const hostile = indexJsonGraph(JSON.stringify({ '<script>alert("public fixture")</script>': '<img src=x onerror="alert(1)">\u0000\ud800' }));
const svg = jsonGraphSvg(jsonGraphLayout(hostile, new Set()), new Set(), JSON_GRAPH_PALETTES.light);
assert.ok(!svg.includes("<script>")); assert.ok(!svg.includes("<img")); assert.ok(!svg.includes("\u0000")); assert.ok(!svg.includes("\ud800")); assert.ok(svg.includes("&lt;script&gt;")); assert.ok(!svg.includes("href="));
assert.equal(indexJsonGraph('{"big":9223372036854775807}').unsafeNumbers, true);
assert.equal(indexJsonGraph('{"overflow":1e400}').unsafeNumbers, true);
assert.throws(() => indexJsonGraph("["), /JSON/); assert.throws(() => indexJsonGraph(" ".repeat(2 * 1024 * 1024 + 1)), /2 MiB/);
assert.throws(() => indexJsonGraph(JSON.stringify(Array.from({ length: 10_000 }, () => null))), /10,000 nodes/);
assert.throws(() => indexJsonGraph("[".repeat(81) + "0" + "]".repeat(81)), /80 nesting/);
assert.throws(() => indexJsonGraph(JSON.stringify({ ["x".repeat(8193)]: 1 })), /path/);
console.log("JSON graph hierarchy/path escaping, branch collapse/focus, display bounds, array tables, unsafe number warnings and inert XML export fixtures passed.");

// Preserve JSON numbers as numeric tokens through every graph-derived output.
const precise = indexJsonGraph('{"fraction":0.9999999999999999999,"zero":-0,"tiny":1e-999,"huge":1e400,"integer":9223372036854775807,"ordinary":1.25,"rows":[{"number":9007199254740993,"nested":[-0,0.9999999999999999999],"text":"=SUM(A1)","value":"user-owned"}]}');
assert.equal(precise.unsafeNumbers, true);
for (const [key, source] of Object.entries({ fraction: "0.9999999999999999999", zero: "-0", tiny: "1e-999", huge: "1e400", integer: "9223372036854775807", ordinary: "1.25" })) {
    const node = precise.nodes.find((n) => n.key === key)!;
    assert.equal(node.kind, "number"); assert.equal(node.summary, source); assert.equal(graphJsonText(node.value), source); assert.equal(graphCellText(node.value), source);
}
const exactRoot = graphJsonText(precise.nodes[0].value);
assert.ok(exactRoot.includes('"fraction": 0.9999999999999999999')); assert.ok(exactRoot.includes('"zero": -0')); assert.ok(exactRoot.includes('"huge": 1e400')); assert.ok(!exactRoot.includes('"source"'));
const preciseRows = graphArrayTable(precise.nodes.find((n) => n.key === "rows")!.value)!;
assert.equal(preciseRows.objectRows, true);
const csv = graphTableCsv(preciseRows.columns, preciseRows.rows);
assert.equal(csv, "number,nested,text,value\r\n9007199254740993,\"[-0,0.9999999999999999999]\",'=SUM(A1),user-owned");
const primitives = graphArrayTable(indexJsonGraph('[-0,1e400,-1,"-1"]') .nodes[0].value)!;
assert.equal(primitives.objectRows, false); assert.equal(graphTableCsv(primitives.columns, primitives.rows), "value\r\n-0\r\n1e400\r\n-1\r\n'-1");
assert.equal(graphTableCsv(["=column"], [[" @formula"], ["a,\"b\"\n"]]), "'=column\r\n' @formula\r\n\"a,\"\"b\"\"\n\"");
assert.equal(graphTableCsv(["text"], [["=formula"]], false), "text\r\n=formula");
const collision = indexJsonGraph('{"source":"1e999","integer":true,"__proto__":{"source":"-0"},"constructor":{"source":"2e999"},"number":1}');
assert.equal(collision.unsafeNumbers, false); assert.deepEqual(JSON.parse(graphJsonText(collision.nodes[0].value)), JSON.parse('{"source":"1e999","integer":true,"__proto__":{"source":"-0"},"constructor":{"source":"2e999"},"number":1}'));
assert.equal(indexJsonGraph('{"same":1e999,"same":2}').unsafeNumbers, false);
const exactSvg = jsonGraphSvg(jsonGraphLayout(precise, new Set()), new Set(), JSON_GRAPH_PALETTES.dark, { title: "日本語 العربية", limitedTitle: "表示上限", array: "配列", object: "オブジェクト" });
assert.ok(exactSvg.includes("0.9999999999999999999")); assert.ok(exactSvg.includes("-0")); assert.ok(exactSvg.includes("1e400")); assert.ok(exactSvg.includes("日本語 العربية")); assert.ok(exactSvg.includes("オブジェクト"));
assert.equal(graphNodeSummary(precise.nodes[0], { array: "配列", object: "オブジェクト" }), "オブジェクト {7}");
console.log("Source-sensitive numeric type/display/copy/table/CSV/vector export, text formula protection, user-data shape collisions and localized graph labels passed.");

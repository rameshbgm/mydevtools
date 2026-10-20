import assert from "node:assert/strict";
import { graphql, parse, print } from "graphql";
import { buildVisualOperation, exampleArgument, formatGraphql, parseBuilderSchema } from "../src/lib/graphql-builder";
import { nextCronRuns, parseCronSchedule } from "../src/lib/cron-schedule";
import { colorHarmony, hslaHex, parseHexColor } from "../src/lib/color-harmonies";
async function main() {
    const schema = parseBuilderSchema('enum Role { ADMIN USER } input Filter { role: Role!, tags: [String!] } type User { id: ID!, name: String } union Result = User type Query { user(id: ID!): User, search(filter: Filter!): [Result!]! }');
    const source = buildVisualOperation(schema, "query", ["user", "user.id", "user.name"], { "user:id": '"42"' }, "FindUser");
    const response = await graphql({ schema, source, rootValue: { user: ({ id }: { id: string }) => ({ id, name: "Fixture" }) } });
    assert.deepEqual(JSON.parse(JSON.stringify(response)), { data: { user: { id: "42", name: "Fixture" } } });
    assert.match(buildVisualOperation(schema, "query", ["search"], { "search:filter": "{role: ADMIN}" }, "Find"), /__typename/);
    assert.equal(exampleArgument(schema.getQueryType()!.getFields().search.args[0].type), "{role: ADMIN}");
    assert.throws(() => buildVisualOperation(schema, "query", ["user"], {}, "Find"), /required argument/);
    assert.throws(() => buildVisualOperation(schema, "query", ["user", "user.nope"], { "user:id": '"42"' }, "Find"), /Unknown field/);
    assert.throws(() => buildVisualOperation(schema, "query", ["search"], { "search:filter": "{role: UNKNOWN}" }, "Find"), /does not exist/);
    const document = '{ user(id: "space # preserved") { id name } }'; assert.equal(print(parse(formatGraphql(document, true))), print(parse(document)));
    assert.throws(() => formatGraphql("query {", false));
    assert.deepEqual(nextCronRuns("0 9 * * 1-5", "UTC", new Date("2026-10-18T10:00:00Z"), 2), ["2026-10-19T09:00:00.000Z", "2026-10-20T09:00:00.000Z"]);
    assert.equal(nextCronRuns("0 0 1 * *", "UTC", new Date("2026-10-02T00:00:00Z"), 1)[0], "2026-11-01T00:00:00.000Z");
    assert.deepEqual(nextCronRuns("0 0 13 * 1", "UTC", new Date("2026-10-12T00:00:00Z"), 2), ["2026-10-13T00:00:00.000Z", "2026-10-19T00:00:00.000Z"]);
    assert.deepEqual(nextCronRuns("0 9 * * *", "America/New_York", new Date("2026-03-07T14:00:00Z"), 2), ["2026-03-08T13:00:00.000Z", "2026-03-09T13:00:00.000Z"]);
    assert.deepEqual(nextCronRuns("2-10/3 * * * *", "UTC", new Date("2026-01-01T00:00:00Z"), 3).map((value) => value.slice(14, 16)), ["02", "05", "08"]);
    for (const invalid of ["5junk * * * *", "*/0 * * * *", "61 * * * *", "* * * * * *", "* * * * 9"]) assert.throws(() => parseCronSchedule(invalid));
    assert.deepEqual(colorHarmony("#ff0000", "complementary"), ["#ff0000", "#00ffff"]);
    assert.deepEqual(colorHarmony("#ff0000", "triadic"), ["#ff0000", "#00ff00", "#0000ff"]);
    assert.equal(parseHexColor("#0f08").hex, "#00ff0088"); assert.equal(colorHarmony("#000000", "shades").length, 9);
    for (const hex of ["#000000", "#ffffff", "#e5a413", "#1567ab80"]) { const parsed = parseHexColor(hex); assert.equal(hslaHex(parsed.hsla), hex); }
    assert.throws(() => parseHexColor("#gg0000"));
    console.log("GraphQL execution/build/minify, cron weekday/month/OR/DST/range, and color harmony fixtures passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

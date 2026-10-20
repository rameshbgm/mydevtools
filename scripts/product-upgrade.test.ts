import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { validateJsonSchema } from "../src/lib/json-schema-workbench";
import { redactDocument, redactSecrets } from "../src/lib/redaction";
import { inspectTraceParent, inspectTraceState, generateTraceParent } from "../src/lib/trace-context";
import { verifyWebhookSignature } from "../src/lib/webhook-signatures";
import { runWorkflow, validateWorkflow } from "../src/lib/workflow-engine";
import { generateUuids, inspectUuid } from "../src/lib/uuid-tools";
import { compareOpenApiContracts } from "../src/lib/openapi-contract";
import { detectPaste } from "../src/lib/smart-paste";

async function main() {
    for (const [instance, schema] of [
        [123, { type: ["string", "null"] }], ["other", { const: "expected" }], [{}, false],
        [true, { oneOf: [{ type: "string" }, { type: "number" }] }],
        ["anything", { $ref: "#/$defs/missing" }], ["no", { type: "string", format: "email" }],
        [{ age: 5 }, { if: { required: ["age"] }, then: { properties: { age: { minimum: 18 } } } }],
        [{}, { $schema: "https://example.com/unsupported" }], [{}, { inventKeyword: true }],
    ]) assert.ok(validateJsonSchema(instance, schema).length > 0, JSON.stringify(schema));
    assert.equal(validateJsonSchema(null, { type: ["string", "null"] }).length, 0);
    assert.equal(validateJsonSchema("ok", { $defs: { text: { type: "string" } }, $ref: "#/$defs/text" }).length, 0);
    assert.equal(validateJsonSchema({}, true).length, 0);
    assert.equal(validateJsonSchema(["a", 1], { type: "array", prefixItems: [{ type: "string" }, { type: "integer" }], items: false }).length, 0);
    const exported = JSON.stringify(redactSecrets({ auth: { bearer: { token: "secret-example" } }, headers: [{ key: "Authorization", value: "Bearer hidden" }], url: "https://example.com?api_key=private" }));
    assert.ok(!JSON.stringify(redactSecrets({ body: '{"password":"embedded-secret"}' })).includes("embedded-secret"));
    assert.ok(!exported.includes("secret-example") && !exported.includes("Bearer hidden") && !exported.includes("=private"));
    assert.ok(!redactDocument('{"log":{"entries":[{"request":{"headers":[{"name":"Cookie","value":"session=secret"}]}}]},"email":"private@example.com"}', ["email"]).includes("private@example.com"));
    assert.ok(!redactDocument("Authorization: Bearer hidden\nCookie: session=secret\npassword=example-secret").includes("example-secret"));
    const trace = inspectTraceParent(generateTraceParent()); assert.equal(trace.traceId.length, 32); assert.equal(trace.sampled, true);
    assert.throws(() => inspectTraceParent("00-00000000000000000000000000000000-00f067aa0ba902b7-01"));
    assert.throws(() => inspectTraceParent("ff-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"));
    assert.throws(() => inspectTraceState("vendor=a,vendor=b"));
    assert.equal(inspectTraceState("tenant@vendor=opaque")[0].key, "tenant@vendor");
    const secret = "test-signing-secret", body = '{"event":"test"}', timestamp = "1700000000";
    const sign = (value: string) => createHmac("sha256", secret).update(value).digest("hex");
    for (const provider of ["github", "stripe", "slack", "hmac"] as const) {
        const signature = provider === "github" ? `sha256=${sign(body)}` : provider === "stripe" ? `t=${timestamp},v1=${sign(timestamp + "." + body)}` : provider === "slack" ? `v0=${sign("v0:" + timestamp + ":" + body)}` : sign(body);
        const options = { provider, body, secret, signature, timestamp, nowSeconds: Number(timestamp) };
        assert.equal((await verifyWebhookSignature(options)).verified, true, provider);
        assert.equal((await verifyWebhookSignature({ ...options, body: body + " " })).verified, false, provider);
        if (provider === "stripe" || provider === "slack") assert.equal((await verifyWebhookSignature({ ...options, nowSeconds: Number(timestamp) + 301 })).verified, false);
    }
    assert.equal(detectPaste('{"hello":"world"}')[0].toolId, "json-formatter");
    assert.equal(detectPaste("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0In0.signature")[0].toolId, "jwt-decoder");
    assert.equal(detectPaste("a,b\n1,2")[0].kind, "csv");
    const sensitiveExport = JSON.stringify(redactSecrets({ sslClientKey: "private-mtls-value", env: [{ key: "OPENAI_API_KEY", value: "provider-secret" }, { key: "AWS_SECRET_ACCESS_KEY", value: "cloud-secret" }], arbitrary: "-----BEGIN PRIVATE KEY-----\nprivate-pem\n-----END PRIVATE KEY-----", log: "Authorization: Bearer abc.def.test" }));
    for (const secret of ["private-mtls-value", "provider-secret", "cloud-secret", "private-pem", "abc.def.test"]) assert.equal(sensitiveExport.includes(secret), false);
    const encoded = btoa('{"private":"example","name":"hello"}');
    const pipeline = await runWorkflow(encoded, [{ operation: "decode-base64", argument: "" }, { operation: "jsonpath", argument: "$.name" }, { operation: "minify-json", argument: "" }]);
    assert.equal(pipeline.at(-1)?.output, '["hello"]');
    await assert.rejects(() => runWorkflow("invalid", [{ operation: "format-json", argument: "" }]), /Step 1/);
    await assert.rejects(() => runWorkflow('{"id":9223372036854775807}', [{ operation: "jsonpath", argument: "$.id" }]), /lose precision/);
    assert.ok(validateWorkflow({ version: 1, id: "example", name: "Example", steps: [{ operation: "redact", argument: "email" }], pinned: false }));
    assert.ok(!validateWorkflow({ version: 1, id: "example", name: "Example", steps: [{ operation: "execute-js", argument: "" }], pinned: false }));
    const generated = generateUuids(100, 7);
    assert.equal(new Set(generated).size, 100);
    assert.equal(inspectUuid(generated[0]).version, 7);
    assert.ok(Math.abs(inspectUuid(generated[0]).unixMilliseconds! - Date.now()) < 5000);
    assert.deepEqual([...generated].sort(), generated);
    assert.throws(() => generateUuids(1001, 4));
    const oldContract = { openapi: "3.2.1", paths: { "/items": { post: { requestBody: { content: { "application/json": { schema: { type: "object", properties: { id: { type: "string" } } } } } }, responses: { "200": { content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string" } } } } } } } } } } };
    const newContract = JSON.parse(JSON.stringify(oldContract));
    newContract.paths["/items"].post.requestBody.content["application/json"].schema.properties.id.type = "integer";
    newContract.paths["/items"].post.responses["200"].content["application/json"].schema.required = [];
    const changes = compareOpenApiContracts(oldContract, newContract);
    assert.ok(changes.some((finding) => finding.severity === "breaking" && finding.message.includes("type changed")));
    assert.ok(changes.some((finding) => finding.message.includes("no longer guaranteed")));
    console.log("✓ Product-upgrade regressions: schema dialects and unsupported rules, export redaction, trace context, four webhook schemes, timestamp/byte tampering, and smart paste");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

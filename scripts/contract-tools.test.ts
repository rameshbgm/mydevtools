import assert from "node:assert/strict";
import { inspectAsyncApi } from "../src/lib/asyncapi";
import { validateJsonSchema } from "../src/lib/json-schema-workbench";
import { compareOpenApiContracts } from "../src/lib/openapi-contract";
import { analyseSecurityHeaders } from "../src/lib/security-headers";

const changes = compareOpenApiContracts(
    { openapi: "3.1.0", paths: { "/users": { get: { responses: { 200: {} } } } }, components: { schemas: { User: { required: ["id"] } } } },
    { openapi: "3.1.0", paths: { "/users": { get: { parameters: [{ name: "tenant", in: "query", required: true }], responses: {} } } }, components: { schemas: { User: { required: ["id", "email"] } } } },
);
assert.ok(changes.filter((change) => change.severity === "breaking").length >= 3);
assert.ok(changes.some((change) => change.message.includes("became required")));
assert.ok(changes.some((change) => change.message.includes("Response 200 was removed")));

const missingHeaders = analyseSecurityHeaders("X-Content-Type-Options: nosniff");
assert.ok(missingHeaders.some((finding) => finding.title.includes("Content-Security-Policy is missing")));
assert.ok(!analyseSecurityHeaders("Content-Security-Policy: default-src 'self'; object-src 'none'; frame-ancestors 'none'\nStrict-Transport-Security: max-age=1\nX-Content-Type-Options: nosniff\nReferrer-Policy: no-referrer\nPermissions-Policy: camera=()").some((finding) => finding.severity === "high"));

const schemaIssues = validateJsonSchema({ name: "A", extra: true }, { type: "object", required: ["name", "email"], properties: { name: { type: "string", minLength: 2 } }, additionalProperties: false });
assert.equal(schemaIssues.length, 3);

const asyncSummary = inspectAsyncApi({ asyncapi: "3.0.0", info: { title: "Events", version: "1.0.0" }, channels: { created: {} }, operations: { receive: {} }, servers: { prod: {} } });
assert.equal(asyncSummary.issues.length, 0);
assert.equal(asyncSummary.channels, 1);
assert.equal(asyncSummary.operations, 1);

console.log("✓ Contract, schema, security-header, and AsyncAPI helpers passed");

import assert from "node:assert";
import { parseManagedProxyRequest } from "../src/lib/proxy-request";

const valid = parseManagedProxyRequest({
    url: "https://example.com/api",
    method: "post",
    headers: { "content-type": "application/json" },
    body: "{}",
    bodyIsBase64: false,
    timeout: 5_000,
    followRedirects: true,
}, "GET");

assert.equal(typeof valid, "object");
if (typeof valid !== "string") {
    assert.equal(valid.method, "POST");
    assert.deepEqual(valid.headers, { "content-type": "application/json" });
    assert.equal(valid.body, "{}");
    assert.equal(valid.followRedirects, true);
}

const cases: Array<[unknown, string, string]> = [
    [null, "GET", "Request body must be a JSON object"],
    [[], "GET", "Request body must be a JSON object"],
    [{}, "GET", "Missing required field: url"],
    [{ url: "https://example.com", method: 42 }, "GET", "Invalid field: method must be a string"],
    [{ url: "https://example.com", headers: { authorization: 42 } }, "GET", "Invalid field: headers must be an object of strings"],
    [{ url: "https://example.com", body: 42 }, "GET", "Invalid field: body must be a string or null"],
    [{ url: "https://example.com", bodyIsBase64: "yes" }, "GET", "Invalid field: bodyIsBase64 must be a boolean"],
    [{ url: "https://example.com", timeout: "fast" }, "GET", "Invalid field: timeout must be a finite number"],
];

for (const [input, defaultMethod, expected] of cases) {
    assert.equal(parseManagedProxyRequest(input, defaultMethod), expected);
}

console.log(`✓ ${cases.length + 4}/${cases.length + 4} managed proxy request assertions passed`);

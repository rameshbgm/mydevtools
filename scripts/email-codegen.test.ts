import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { classifyMx, lookupEmailMx, normalizeMxDomain } from "../src/lib/email-mx";
import { generateExtraClientCode, prepareCodeRequest, type ClientCodeRequest } from "../src/lib/api-builder/client-codegen";
const run = promisify(execFile);
async function main() {
    assert.equal(normalizeMxDomain("BÜCHER.example."), "xn--bcher-kva.example");
    for (const invalid of ["user@example.com", "https://example.com", "localhost", "127.0.0.1", "bad-.example", "example.com/path"]) assert.throws(() => normalizeMxDomain(invalid));
    assert.equal(classifyMx("example.com", { Status: 0, Answer: [{ type: 15, data: "0 .", TTL: 300 }] }).status, "null-mx");
    assert.equal(classifyMx("example.com", { Status: 0, Answer: [{ type: 15, data: "10 mail.example.com.", TTL: 300 }, { type: 15, data: "0 .", TTL: 300 }] }).status, "invalid-mx");
    assert.equal(classifyMx("example.com", { Status: 0 }, [{ Status: 0, Answer: [{ type: 1, data: "192.0.2.1", TTL: 60 }] }]).status, "implicit");
    assert.equal(classifyMx("example.com", { Status: 3 }).status, "nxdomain");
    assert.equal(classifyMx("example.com", { Status: 0 }, [{ Status: 0 }, { Status: 0 }]).status, "no-address");
    assert.throws(() => classifyMx("example.com", { Status: 2 }), /resolver returned/);
    assert.throws(() => classifyMx("example.com", { Status: 0 }, [{ Status: 2 }]), /fallback/);
    const calls: string[] = [];
    const resolver = (async (url: string | URL | Request) => { calls.push(String(url)); return Response.json({ Status: 0, Answer: [{ type: 15, data: "10 mail.example.com.", TTL: 60 }] }); }) as typeof fetch;
    const mx = await lookupEmailMx("example.com", "cloudflare", resolver); assert.equal(mx.status, "mx"); assert.deepEqual(calls, ["https://cloudflare-dns.com/dns-query?name=example.com&type=MX"]);
    await assert.rejects(() => lookupEmailMx("example.com", "cloudflare", (async () => new Response("x".repeat(65_537))) as typeof fetch), /64 KiB/);
    const baseRequest: ClientCodeRequest = { url: "https://example.com", method: "POST", headers: { "Content-Length": "999999" }, body: [["same", "one"], ["same", "two"]] };
    const prepared = prepareCodeRequest(baseRequest);
    assert.equal(prepared.headers["Content-Length"], undefined);
    assert.equal(prepared.body!.match(/name="same"/g)?.length, 2);
    for (const target of ["php", "ruby", "csharp"] as const) assert.ok(generateExtraClientCode(target, baseRequest).includes("example.com"));
    assert.throws(() => prepareCodeRequest({ ...baseRequest, url: "file:///tmp/private" }));
    assert.throws(() => prepareCodeRequest({ ...baseRequest, headers: { x: "bad\r\nheader" } }));
    assert.throws(() => prepareCodeRequest({ ...baseRequest, method: "GET" }));
    if (process.env.EXPANSION_LIVE_DNS === "true") console.log("Live DNS public fixture:", await lookupEmailMx("example.com", "google"));
    console.log("MX/null-MX/implicit/NXDOMAIN/failure and domain-only bounded request fixtures passed.");

    if (process.env.EXPANSION_CODEGEN_RUNTIME !== "true") { console.log("Codegen transport fixtures require EXPANSION_CODEGEN_RUNTIME=true (opens an owned loopback HTTP fixture)."); return; }
    const server = createServer((request, response) => { const chunks: Buffer[] = []; request.on("data", (chunk) => chunks.push(chunk)); request.on("end", () => { response.setHeader("Content-Type", "application/json"); response.end(JSON.stringify({ method: request.method, url: request.url, header: request.headers["x-fixture"], contentType: request.headers["content-type"], body: Buffer.concat(chunks).toString("utf8") })); }); });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve)); const address = server.address(); assert.ok(address && typeof address === "object");
    const directory = await mkdtemp(join(tmpdir(), "mydevtools-codegen-"));
    try {
        for (const body of ['Unicode 日本語 العربية \' " \\ $ #{raise("bad")}\n\0 end', [["same", "one"], ["same", 'two\nquotes " and العربية']] as [string, string][]]) {
            const request: ClientCodeRequest = { url: `http://127.0.0.1:${address.port}/fixture?q=space%20value`, method: "PATCH", headers: { "Content-Type": "application/json", "X-Fixture": 'quote \' " \\ $ #{raise("bad")}', "Content-Length": "999999" }, body };
            const expected = prepareCodeRequest(request);
            for (const target of ["php", "ruby"] as const) {
                const file = join(directory, "request." + (target === "ruby" ? "rb" : "php")); await writeFile(file, generateExtraClientCode(target, request));
                const syntax = await run(target, [target === "php" ? "-l" : "-c", file]); assert.match(syntax.stdout, target === "php" ? /No syntax errors/ : /Syntax OK/);
                const execution = await run(target, [file], { timeout: 20_000 }); const output = JSON.parse(execution.stdout.slice(execution.stdout.indexOf("\n") + 1));
                assert.equal(output.method, "PATCH"); assert.equal(output.url, "/fixture?q=space%20value"); assert.equal(output.header, request.headers["X-Fixture"]); assert.equal(output.body, expected.body); assert.equal(output.contentType, expected.headers["Content-Type"]);
            }
            const csharp = generateExtraClientCode("csharp", request); assert.match(csharp, /HttpRequestMessage/); assert.match(csharp, /ByteArrayContent/); assert.ok(!csharp.includes('"999999"'));
        }
        assert.throws(() => prepareCodeRequest({ url: "file:///tmp/private", method: "GET", headers: {}, body: null }));
        assert.throws(() => prepareCodeRequest({ url: "https://example.com", method: "GET", headers: { x: "bad\r\nheader" }, body: null }));
        console.log("Generated PHP/Ruby syntax and actual raw/multipart HTTP request bytes, duplicate fields, Unicode/control/quote escaping passed. C# compilation is a separate release check.");
    } finally { await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); await rm(directory, { recursive: true, force: true }); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

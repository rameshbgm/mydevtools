import assert from "node:assert/strict";
import http from "node:http";
import https from "node:https";
import forge from "node-forge";
import { startLocalMock, manageLocalMock, type MockSummary } from "../src/lib/local-mock-server";
import { runLocalHttp } from "../src/lib/local-http-client";
import { runCollection, type CollectionStep } from "../src/lib/api-builder/collection-runner";
import { compileSavedRequest, type ApiSavedRequest } from "../src/lib/api-builder/request-model";
const owner = "http://127.0.0.1:3100", project = "personal";
const routes = [
    { method: "POST", path: "/login", status: 200, headers: { "content-type": "application/json", "cache-control": "public, max-age=600" }, body: '{"session":{"token":"public-fixture-token"},"id":9223372036854775807}', delayMs: 0 },
    { method: "GET", path: "/item/9223372036854775807", status: 200, headers: { "content-type": "application/json", "cache-control": "public, max-age=600" }, body: '{"ok":true}', delayMs: 0 },
];
async function listen(server: http.Server) { await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", () => resolve()); }); return (server.address() as { port: number }).port; }
async function close(server: http.Server) { server.closeAllConnections(); await new Promise<void>((resolve) => server.close(() => resolve())); }
function certificate(name: string, issuer?: { cert: forge.pki.Certificate; privateKey: forge.pki.rsa.PrivateKey }, client = false) {
    const keys = forge.pki.rsa.generateKeyPair(2048), cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey; cert.serialNumber = String(Math.floor(Math.random() * 100000) + 1);
    cert.validity.notBefore = new Date(Date.now() - 60_000); cert.validity.notAfter = new Date(Date.now() + 86400000);
    cert.setSubject([{ name: "commonName", value: name }]); cert.setIssuer(issuer ? issuer.cert.subject.attributes : cert.subject.attributes);
    cert.setExtensions(issuer ? [{ name: "basicConstraints", cA: false }, { name: "keyUsage", digitalSignature: true, keyEncipherment: true }, { name: "extKeyUsage", serverAuth: !client, clientAuth: client }, { name: "subjectAltName", altNames: [{ type: 2, value: "localhost" }] }] : [{ name: "basicConstraints", cA: true, critical: true }, { name: "keyUsage", keyCertSign: true, cRLSign: true, critical: true }]);
    cert.sign(issuer?.privateKey ?? keys.privateKey, forge.md.sha256.create());
    return { cert, privateKey: keys.privateKey, certPem: forge.pki.certificateToPem(cert), keyPem: forge.pki.privateKeyToPem(keys.privateKey) };
}
async function main() {
    const mocks: MockSummary[] = [], servers: http.Server[] = [];
    try {
        const mock = await startLocalMock({ name: "Public integration fixture", routes, origins: [] }, project, owner); mocks.push(mock);
        const wrongProject = "11111111-1111-4111-8111-111111111111";
        await assert.rejects(() => manageLocalMock({ operation: "history", project: wrongProject, id: mock.id }, owner), /another project/);
        const preflight = await runLocalHttp({ url: mock.baseUrl + "/login", method: "OPTIONS", headers: { origin: owner, "access-control-request-method": "POST", "access-control-request-headers": "authorization,content-type" } });
        assert.equal(preflight.status, 204); assert.equal(preflight.headers["access-control-allow-origin"], owner);
        const blocked = await runLocalHttp({ url: mock.baseUrl + "/login", method: "POST", headers: { origin: "https://untrusted.example" }, body: "public" }); assert.equal(blocked.status, 403);
        const opaque = await runLocalHttp({ url: mock.baseUrl + "/login", method: "POST", headers: { origin: "null" }, body: "public" }); assert.equal(opaque.status, 403);
        const absent = await runLocalHttp({ url: new URL("/login", mock.baseUrl).href, method: "POST", body: "public" }); assert.equal(absent.status, 404);
        const request = (id: string): ApiSavedRequest => ({ id, name: id, method: id === "login" ? "POST" : "GET", url: id === "login" ? "{{baseUrl}}/login" : "{{baseUrl}}/item/{{id}}", headers: [], queryParams: [], body: id === "login" ? '{"iteration":{{$iteration}}}' : "", bodyType: id === "login" ? "json" : "none", auth: id === "login" ? { type: "none" } : { type: "bearer", bearer: { prefix: "Bearer", token: "{{token}}" } }, settings: { timeout: 2000, followRedirects: false, validateSSL: true, maxResponsePreviewBytes: 1024 }, createdAt: "2026-10-20" });
        const steps: CollectionStep[] = [
            { id: "one", requestId: "login", assertions: [{ source: "status", path: "", operator: "equals", expected: "200" }], captures: [{ source: "json", path: "/session/token", name: "token" }, { source: "json", path: "/id", name: "id" }] },
            { id: "two", requestId: "item", assertions: [{ source: "json", path: "/ok", operator: "equals", expected: "true" }], captures: [] },
        ];
        const run = await runCollection({ steps, requests: [request("login"), request("item")], variables: { baseUrl: mock.baseUrl }, iterations: 2, stopOnFailure: true, transport: (input, signal) => runLocalHttp({ ...input }, signal) });
        assert.equal(run.results.length, 4); assert.ok(run.results.every((result) => result.passed));
        assert.ok(run.results.every((result) => result.response?.headers["cache-control"] === "no-store"), "Mock response settings cannot enable payload caching");
        await assert.rejects(() => manageLocalMock({ operation: "history", project, id: mock.id }, owner), /supported/);
        await assert.rejects(() => manageLocalMock({ operation: "clear-history", project, id: mock.id }, owner), /supported/);
        await Promise.all(Array.from({ length: 6 }, () => runLocalHttp({ url: mock.baseUrl + "/login", method: "POST", body: "public" })));
        const listed = (await manageLocalMock({ operation: "list", project }, owner) as { mocks: MockSummary[] }).mocks[0];
        assert.equal(listed.requests, 10);
        assert.equal(JSON.stringify(listed).includes('"iteration"'), false);
        assert.equal(Object.hasOwn(listed, "history"), false);
        const concurrent = await Promise.allSettled([startLocalMock({ name: "Limit fixture one", routes, origins: [] }, project, owner), startLocalMock({ name: "Limit fixture two", routes, origins: [] }, project, owner)]);
        const started = concurrent.filter((result): result is PromiseFulfilledResult<MockSummary> => result.status === "fulfilled"); mocks.push(...started.map((result) => result.value)); assert.equal(started.length, 1); assert.equal(concurrent.filter((result) => result.status === "rejected").length, 1);
        console.log("Local mock + collection: scoped management, CORS/opaque-origin rejection, capability paths, two-step token capture/iterations, no request history and concurrent server cap passed.");
        let redirectedHeaders: http.IncomingHttpHeaders = {}, redirectMethod = "", redirectBody = "";
        const destination = http.createServer((req, res) => { redirectedHeaders = req.headers; redirectMethod = req.method!; req.on("data", (chunk) => { redirectBody += chunk; }); req.on("end", () => res.end("redirected")); }); servers.push(destination); const destinationPort = await listen(destination);
        let lastBytes = Buffer.alloc(0), lastContentType = "";
        const binary = Buffer.from(Array.from({ length: 256 }, (_, i) => i));
        const source = http.createServer((req, res) => {
            if (req.url === "/redirect") { res.writeHead(303, { location: `http://127.0.0.1:${destinationPort}/final` }); res.end(); }
            else if (req.url === "/binary") { res.setHeader("content-type", "application/octet-stream"); res.end(binary); }
            else if (req.url === "/bom") { res.setHeader("content-type", "application/json"); res.end(Buffer.from('\uFEFF{"ok":true}')); }
            else if (req.url === "/large-declared") { res.setHeader("content-length", 2 * 1024 * 1024 + 1); res.end("oversized declaration"); }
            else if (req.url === "/large-stream") { for (let i = 0; i < 9; i++) res.write(Buffer.alloc(256 * 1024)); res.end(); }
            else if (req.url === "/head") { res.writeHead(200, { "content-length": 1_000_000_000 }); res.end(); }
            else if (req.url === "/delay") setTimeout(() => { if (!res.destroyed) res.end("late"); }, 500);
            else { const chunks: Buffer[] = []; req.on("data", (chunk) => chunks.push(chunk)); req.on("end", () => { lastBytes = Buffer.concat(chunks); lastContentType = String(req.headers["content-type"]); res.setHeader("set-cookie", ["public-one=1", "public-two=2"]); res.end("received"); }); }
        }); servers.push(source); const port = await listen(source), baseUrl = `http://127.0.0.1:${port}`;
        const encoded = await runLocalHttp({ url: baseUrl + "/binary" }); assert.equal(encoded.bodyIsBase64, true); assert.deepEqual(Buffer.from(encoded.body, "base64"), binary);
        const bom = await runLocalHttp({ url: baseUrl + "/bom" }); assert.equal(bom.body.charCodeAt(0), 0xFEFF);
        await assert.rejects(() => runLocalHttp({ url: baseUrl + "/large-declared" }), /2 MiB/);
        await assert.rejects(() => runLocalHttp({ url: baseUrl + "/large-stream" }), /2 MiB/);
        assert.equal((await runLocalHttp({ url: baseUrl + "/head", method: "HEAD" })).body, "");
        await assert.rejects(() => runLocalHttp({ url: baseUrl + "/delay", timeout: 100 }), /timed out/);
        const abort = new AbortController(); setTimeout(() => abort.abort(), 30); await assert.rejects(() => runLocalHttp({ url: baseUrl + "/delay" }, abort.signal), /abort/i);
        const redirect = await runLocalHttp({ url: baseUrl + "/redirect", method: "POST", body: "public-body", headers: { authorization: "Bearer public", cookie: "fixture=public", "x-public-secret": "public-value" }, followRedirects: true });
        assert.equal(redirect.status, 200); assert.equal(redirectMethod, "GET"); assert.equal(redirectBody, ""); for (const key of ["authorization", "cookie", "x-public-secret"]) assert.equal(redirectedHeaders[key], undefined);
        const form = await compileSavedRequest({ ...request("login"), url: baseUrl + "/form", bodyType: "form-data", formData: [{ id: "message", key: "message", value: "日本語 with spaces", enabled: true }], body: "" }, {});
        const sent = await runLocalHttp({ ...form }); assert.deepEqual(lastBytes, Buffer.from(form.body!)); assert.equal(lastContentType, form.headers["content-type"]); assert.equal(sent.headerPairs.filter(([key]) => key.toLowerCase() === "set-cookie").length, 2);
        console.log("Native HTTP: exact multipart bytes, binary/base64, BOM preservation, duplicate headers, streamed/declared limits, HEAD, cancellation/deadline and redirect credential stripping passed.");
        const ca = certificate("Public fixture CA"), serverCert = certificate("localhost", ca), clientCert = certificate("Public fixture client", ca, true);
        const secure = https.createServer({ key: serverCert.keyPem, cert: serverCert.certPem, ca: ca.certPem, requestCert: true, rejectUnauthorized: true }, (_req, res) => res.end("verified mTLS")); servers.push(secure);
        const securePort = await listen(secure), secureUrl = `https://127.0.0.1:${securePort}/`, tls = { ca: ca.certPem, certificate: clientCert.certPem, privateKey: clientCert.keyPem, serverName: "localhost" };
        assert.equal((await runLocalHttp({ url: secureUrl, tls })).body, "verified mTLS");
        await assert.rejects(() => runLocalHttp({ url: secureUrl, tls: { ...tls, ca: "" } }), /certificate|issuer|self.signed/i);
        await assert.rejects(() => runLocalHttp({ url: secureUrl, tls: { ...tls, certificate: "", privateKey: "" } }), /certificate|alert|socket/i);
        await assert.rejects(() => runLocalHttp({ url: secureUrl, tls: { ...tls, serverName: "different.example" } }), /hostname|altnames/i);
        console.log("Native HTTPS: verified CA and mTLS succeed; unknown CA, missing client certificate and wrong server identity fail.");
    } finally {
        for (const mock of mocks) await manageLocalMock({ operation: "stop", project, id: mock.id }, owner).catch(() => {});
        for (const server of servers) await close(server);
    }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

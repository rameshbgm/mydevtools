// Public fixtures only. Starts a fresh compiled server and inspects its output
// and runtime filesystem; never reads or changes any deployed service.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import http from "node:http";
const port = Number(process.env.PRIVACY_TEST_PORT ?? 3104), origin = `http://127.0.0.1:${port}`;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
async function snapshot(path: string, result: Record<string, string> = {}) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
        if (entry.name === "node_modules") continue;
        const name = join(path, entry.name);
        if (entry.isDirectory()) await snapshot(name, result);
        else { const info = await stat(name); result[name] = `${info.size}:${info.mtimeMs}`; }
    }
    return result;
}
function privateResponse(response: Response) {
    assert.match(response.headers.get("cache-control") ?? "", /no-store/);
    assert.equal(response.headers.get("cdn-cache-control"), "no-store");
    assert.equal(response.headers.get("surrogate-control"), "no-store");
}
async function main() {
    let output = "", code: number | null = null;
    const child = spawn(process.execPath, ["scripts/start-production.mjs", "--port", String(port), "--hostname", "127.0.0.1"], { env: { ...process.env, MYDEVTOOLS_LOCAL_CONNECTORS: "true", MYDEVTOOLS_LOCAL_CONNECTOR_TOKEN: "public-privacy-fixture-token-at-least-32" }, stdio: ["ignore", "pipe", "pipe"] });
    child.stdout.on("data", (data) => { output += String(data); }); child.stderr.on("data", (data) => { output += String(data); });
    const exited = new Promise<void>((resolve) => child.once("exit", (value) => { code = value; resolve(); }));
    const file = Buffer.from("public-upload-fixture-".repeat(30));
    let uploaded = Buffer.alloc(0);
    const storage = http.createServer((request, response) => {
        if (request.method === "HEAD") { response.writeHead(404); response.end(); return; }
        const parts: Buffer[] = []; request.on("data", (chunk: Buffer) => parts.push(chunk));
        request.on("end", () => { uploaded = Buffer.concat(parts); response.writeHead(200, { ETag: '"public-fixture"' }); response.end(); });
    });
    await new Promise<void>((resolve) => storage.listen(0, "127.0.0.1", resolve));
    try {
        let ready = false;
        for (let i = 0; i < 100; i++) {
            try { if ((await fetch(origin + "/manifest.webmanifest")).ok) { ready = true; break; } } catch {}
            if (code !== null) break;
            await sleep(200);
        }
        assert.ok(ready, "Compiled server starts without emitting a startup log");
        const before = await snapshot(".next/standalone");
        for (const path of ["/api/local-connectors", "/api/fetch-cert", "/api/proxy"]) {
            const response = await fetch(origin + path); privateResponse(response); await response.text();
        }
        const invalid = await fetch(origin + "/api/proxy", { method: "POST", body: "public-malformed-json" });
        assert.equal(invalid.status, 400); privateResponse(invalid);
        const session = "/api/webhook/public-privacy-sentinel-session";
        const offline = await fetch(origin + session, { method: "POST", body: "public-offline-sentinel" });
        assert.equal(offline.status, 409); privateResponse(offline);
        const noReplay = await fetch(origin + session + "/events?wait=5");
        assert.deepEqual(await noReplay.json(), { requests: [] }); privateResponse(noReplay);
        const poll = fetch(origin + session + "/events?wait=2000"); await sleep(150);
        const sent = await fetch(origin + session + "?public=query", { method: "POST", headers: { authorization: "Bearer public-auth-sentinel" }, body: "public-body-sentinel" });
        assert.equal(sent.status, 200); privateResponse(sent);
        const live = await poll; privateResponse(live);
        const delivered = await live.json(); assert.equal(delivered.requests.length, 1);
        assert.equal(delivered.requests[0].bodyText, "public-body-sentinel"); assert.equal(delivered.requests[0].headers.authorization, "Bearer public-auth-sentinel");
        assert.equal(delivered.requests[0].remoteIp, undefined);
        const replay = await fetch(origin + session + "/events?wait=5"); assert.deepEqual(await replay.json(), { requests: [] });
        const upload = await fetch(origin + "/api/local-connectors", { method: "POST", headers: { "content-type": "application/json", origin, "x-mydevtools-local-token": "public-privacy-fixture-token-at-least-32" }, body: JSON.stringify({ service: "s3", operation: "upload", connection: { endpoint: `http://127.0.0.1:${(storage.address() as { port: number }).port}`, region: "us-east-1", accessKeyId: "public-fixture", secretAccessKey: "public-fixture-secret", sessionToken: "", forcePathStyle: true, allowHttp: true }, bucket: "public-fixture", key: "public-file.txt", write: true, base64: file.toString("base64") }) });
        assert.equal(upload.status, 200, JSON.stringify(await upload.clone().json())); privateResponse(upload); assert.deepEqual(uploaded, file);
        await sleep(100);
        assert.deepEqual(await snapshot(".next/standalone"), before, "Requests/uploads create no runtime files or traces");
        assert.equal(output, "", "No startup, request, response, warning or error output");
    } finally {
        storage.closeAllConnections(); await new Promise<void>((resolve) => storage.close(() => resolve()));
        child.kill("SIGTERM"); await exited;
    }
    assert.equal(output, "", "Shutdown produces no logs or traces");
    console.log("Compiled server privacy: silent startup/requests/errors/shutdown; private API caching; live webhooks without offline/replay storage; exact S3 upload; unchanged runtime filesystem passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

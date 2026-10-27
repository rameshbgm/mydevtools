import assert from "node:assert/strict";
import * as grpc from "@grpc/grpc-js";
import { compileGrpcSchema } from "../src/lib/grpc-proto";
const origin = "http://127.0.0.1:3100", token = "public-fixture-local-access-key-2026-expansion";
const files = [{ name: "echo.proto", source: 'syntax="proto3"; package fixture; message Message { string text=1; } service Echo { rpc Say(Message)returns(Message); }' }];
async function main() {
    const endpoint = origin + "/api/local-connectors", headers = { "Content-Type": "application/json", Origin: origin, "X-MyDevtools-Local-Token": token };
    const call = async (input: object, overrides = {}) => { const response = await fetch(endpoint, { method: "POST", headers: { ...headers, ...overrides }, body: JSON.stringify(input), signal: AbortSignal.timeout(20000) }); return { status: response.status, value: await response.json() }; };
    const info = await fetch(endpoint, { headers }); assert.equal(info.status, 200);
    const advertised = await info.json(); for (const service of ["sql", "redis", "s3", "documents", "grpc", "request", "mock"]) assert.ok(advertised.services.includes(service));
    for (const service of ["grpc", "request", "mock"]) {
        assert.equal((await call({ service }, { "X-MyDevtools-Local-Token": "" })).status, 401);
        assert.equal((await call({ service }, { Origin: "https://other.example" })).status, 403);
    }
    const server = new grpc.Server(), schema = compileGrpcSchema(files);
    server.addService(schema.definition["fixture.Echo"] as grpc.ServiceDefinition, { Say(call: grpc.ServerUnaryCall<{ text: string }, unknown>, callback: grpc.sendUnaryData<{ text: string }>) { callback(null, call.request); } });
    const port = await new Promise<number>((resolve, reject) => server.bindAsync("127.0.0.1:0", grpc.ServerCredentials.createInsecure(), (error, port) => error ? reject(error) : resolve(port)));
    let mockId = "";
    try {
        const described = await call({ service: "grpc", operation: "describe", files }); assert.equal(described.status, 200); assert.equal(described.value.methods[0].path, "/fixture.Echo/Say");
        const rpc = await call({ service: "grpc", operation: "call", files, method: "/fixture.Echo/Say", connection: { host: "127.0.0.1", port, tls: false }, messages: '{"text":"public 日本語 fixture"}' }); assert.equal(rpc.status, 200, JSON.stringify(rpc.value)); assert.equal(rpc.value.status.code, 0); assert.equal(rpc.value.messages[0].text, "public 日本語 fixture");
        const created = await call({ service: "mock", operation: "start", project: "personal", configuration: { name: "Production public fixture", routes: [{ method: "POST", path: "/echo", status: 201, headers: { "content-type": "application/json" }, body: '{"ok":true}', delayMs: 0 }], origins: [] } }); assert.equal(created.status, 200, JSON.stringify(created.value)); mockId = created.value.id;
        const sent = await call({ service: "request", url: created.value.baseUrl + "/echo", method: "POST", body: "public 日本語 body", timeout: 2000 }); assert.equal(sent.status, 200); assert.equal(sent.value.status, 201); assert.equal(sent.value.body, '{"ok":true}');
        const history = await call({ service: "mock", operation: "history", project: "personal", id: mockId }); assert.equal(history.status, 400); assert.equal(history.value.requests, undefined);
        assert.equal((await call({ service: "request", url: "http://169.254.169.254/" })).status, 400);
        console.log("Production native route: advertised services, per-service token/origin rejection, proto description and actual RPC, mock start + HTTP request + history rejection, and metadata-host rejection passed.");
    } finally {
        if (mockId) assert.equal((await call({ service: "mock", operation: "stop", project: "personal", id: mockId })).status, 200);
        server.forceShutdown();
    }
}
main().catch((cause) => { console.error(cause); process.exitCode = 1; });

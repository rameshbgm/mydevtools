import assert from "node:assert/strict";
import * as grpc from "@grpc/grpc-js";
import forge from "node-forge";
import { compileGrpcSchema } from "../src/lib/grpc-proto";
import { runGrpc, type GrpcCallResult } from "../src/lib/grpc-connector";
const files = [{ name: "echo.proto", source: `syntax="proto3"; package fixture; message Message { string text=1; int64 number=2; bytes content=3; map<int64,string> by_id=4; }
service Echo { rpc Say(Message)returns(Message); rpc Watch(Message)returns(stream Message); rpc Collect(stream Message)returns(Message); rpc Chat(stream Message)returns(stream Message); rpc Reject(Message)returns(Message); rpc Slow(Message)returns(Message); rpc Flood(Message)returns(stream Message); }` }];
const schema = compileGrpcSchema(files);
type Message = { text: string; number: string; content?: string; by_id?: Record<string, string> };
const initial = new grpc.Metadata(); initial.add("public-tag", "one"); initial.add("public-tag", "two"); initial.set("public-bin", Buffer.from([0, 1, 255]));
const trailers = new grpc.Metadata(); trailers.set("public-trailer", "finished");
function fixtureMessage(message: Message): Message {
    // Independently decode protobufjs' internal int64 map-key hashes on the
    // fixture server before it re-encodes a response. Node Buffer is used here
    // rather than the connector's response-normalization implementation.
    return { ...message, ...(message.by_id ? { by_id: Object.fromEntries(Object.entries(message.by_id).map(([key, value]) => [Buffer.from(key, "latin1").readBigInt64LE().toString(), value])) } : {}) };
}
function fixture(credentials: grpc.ServerCredentials) {
    const server = new grpc.Server(); let hits = 0;
    server.addService(schema.definition["fixture.Echo"] as grpc.ServiceDefinition, {
        Say(call: grpc.ServerUnaryCall<Message, Message>, callback: grpc.sendUnaryData<Message>) { hits++; assert.equal(call.metadata.get("authorization")[0], "Bearer public-fixture"); call.sendMetadata(initial); callback(null, fixtureMessage(call.request), trailers); },
        Watch(call: grpc.ServerWritableStream<Message, Message>) { hits++; for (let i = 0; i < 3; i++) call.write({ ...fixtureMessage(call.request), text: `${call.request.text}-${i}` }); call.end(trailers); },
        Collect(call: grpc.ServerReadableStream<Message, Message>, callback: grpc.sendUnaryData<Message>) { hits++; const received: Message[] = []; call.on("data", (message: Message) => received.push(message)); call.on("end", () => callback(null, { text: received.map((m) => m.text).join("|"), number: received.reduce((sum, m) => sum + BigInt(m.number || "0"), BigInt(0)).toString() })); },
        Chat(call: grpc.ServerDuplexStream<Message, Message>) { hits++; call.on("data", (message: Message) => call.write(message)); call.on("end", () => call.end()); },
        Reject(_call: grpc.ServerUnaryCall<Message, Message>, callback: grpc.sendUnaryData<Message>) { hits++; callback({ code: grpc.status.PERMISSION_DENIED, details: "Public fixture rejected" }, null, trailers); },
        Slow(call: grpc.ServerUnaryCall<Message, Message>, callback: grpc.sendUnaryData<Message>) { hits++; setTimeout(() => callback(null, call.request), 500); },
        Flood(call: grpc.ServerWritableStream<Message, Message>) { hits++; for (let i = 0; i < 102; i++) call.write({ text: String(i), number: "0" }); call.end(); },
    });
    return { server, get hits() { return hits; }, port: new Promise<number>((resolve, reject) => server.bindAsync("127.0.0.1:0", credentials, (error, port) => error ? reject(error) : resolve(port))) };
}
function certificate(commonName: string, issuer?: { cert: forge.pki.Certificate; privateKey: forge.pki.rsa.PrivateKey }, client = false) {
    const keys = forge.pki.rsa.generateKeyPair(2048), cert = forge.pki.createCertificate(); cert.publicKey = keys.publicKey; cert.serialNumber = String(Math.floor(Math.random() * 100000) + 1);
    cert.validity.notBefore = new Date(Date.now() - 60_000); cert.validity.notAfter = new Date(Date.now() + 86400000);
    cert.setSubject([{ name: "commonName", value: commonName }]); cert.setIssuer(issuer ? issuer.cert.subject.attributes : cert.subject.attributes);
    cert.setExtensions(issuer ? [{ name: "basicConstraints", cA: false }, { name: "keyUsage", digitalSignature: true, keyEncipherment: true }, { name: "extKeyUsage", serverAuth: !client, clientAuth: client }, { name: "subjectAltName", altNames: [{ type: 7, ip: "127.0.0.1" }, { type: 2, value: "localhost" }] }] : [{ name: "basicConstraints", cA: true, critical: true }, { name: "keyUsage", keyCertSign: true, cRLSign: true, critical: true }]);
    cert.sign(issuer?.privateKey ?? keys.privateKey, forge.md.sha256.create());
    return { cert, privateKey: keys.privateKey, certPem: forge.pki.certificateToPem(cert), keyPem: forge.pki.privateKeyToPem(keys.privateKey) };
}
async function stop(server: grpc.Server) { await new Promise<void>((resolve) => { const timer = setTimeout(() => { server.forceShutdown(); resolve(); }, 1000); server.tryShutdown(() => { clearTimeout(timer); resolve(); }); }); }
async function main() {
    const plain = fixture(grpc.ServerCredentials.createInsecure()), port = await plain.port;
    const base = { service: "grpc", operation: "call", files, connection: { host: "127.0.0.1", port, tls: false }, metadata: { authorization: "Bearer public-fixture" }, timeoutMs: 2000 };
    const payload = { text: "日本語-public", number: "9223372036854775807", content: "AAEC/w==", by_id: { "-9223372036854775808": "min", "9223372036854775807": "max" } };
    try {
        const echo = await runGrpc({ ...base, method: "/fixture.Echo/Say", messages: JSON.stringify(payload) }) as GrpcCallResult;
        assert.equal(echo.status.code, 0); assert.deepEqual(JSON.parse(JSON.stringify(echo.messages[0])), payload);
        assert.deepEqual(echo.initialMetadata["public-bin"], ["AAH/"]); assert.equal(echo.initialMetadata["public-tag"].join(", "), "one, two"); assert.deepEqual(echo.trailers["public-trailer"], ["finished"]);
        const watch = await runGrpc({ ...base, method: "/fixture.Echo/Watch", messages: JSON.stringify(payload) }) as GrpcCallResult;
        assert.equal(watch.messages.length, 3); assert.equal((watch.messages[2] as Message).text, payload.text + "-2");
        const streamInput = [{ text: "one", number: "9007199254740993" }, { text: "two", number: "2" }];
        const collect = await runGrpc({ ...base, method: "/fixture.Echo/Collect", messages: JSON.stringify(streamInput) }) as GrpcCallResult;
        assert.equal((collect.messages[0] as Message).text, "one|two"); assert.equal((collect.messages[0] as Message).number, "9007199254740995");
        const chat = await runGrpc({ ...base, method: "/fixture.Echo/Chat", messages: JSON.stringify(streamInput) }) as GrpcCallResult;
        assert.deepEqual(JSON.parse(JSON.stringify(chat.messages)), streamInput);
        const rejected = await runGrpc({ ...base, method: "/fixture.Echo/Reject", messages: "{}" }) as GrpcCallResult;
        assert.equal(rejected.status.code, grpc.status.PERMISSION_DENIED); assert.equal(rejected.messages.length, 0);
        const slow = await runGrpc({ ...base, method: "/fixture.Echo/Slow", timeoutMs: 100, messages: "{}" }) as GrpcCallResult;
        assert.equal(slow.status.code, grpc.status.DEADLINE_EXCEEDED);
        const abort = new AbortController(); setTimeout(() => abort.abort(), 30);
        const cancelled = await runGrpc({ ...base, method: "/fixture.Echo/Slow", messages: "{}" }, abort.signal) as GrpcCallResult;
        assert.equal(cancelled.status.code, grpc.status.CANCELLED);
        await assert.rejects(() => runGrpc({ ...base, method: "/fixture.Echo/Flood", messages: "{}" }), /100 messages/);
        const before = plain.hits;
        await assert.rejects(() => runGrpc({ ...base, method: "/fixture.Echo/Say", messages: '{"unknown":true}' }), /Unknown field/);
        assert.equal(plain.hits, before);
        console.log("gRPC loopback: unary/server/client/bidi streams, exact longs/maps/bytes, metadata/trailers, status, deadlines, cancellation and response cap passed.");
    } finally { await stop(plain.server); }
    const ca = certificate("Public fixture CA"), serverCert = certificate("localhost", ca), clientCert = certificate("Public fixture client", ca, true);
    const secure = fixture(grpc.ServerCredentials.createSsl(Buffer.from(ca.certPem), [{ private_key: Buffer.from(serverCert.keyPem), cert_chain: Buffer.from(serverCert.certPem) }], true));
    const securePort = await secure.port;
    try {
        const request = { ...base, method: "/fixture.Echo/Say", messages: JSON.stringify(payload), connection: { host: "127.0.0.1", port: securePort, tls: true, serverName: "localhost", ca: ca.certPem, certificate: clientCert.certPem, privateKey: clientCert.keyPem } };
        const trusted = await runGrpc(request) as GrpcCallResult; assert.equal(trusted.status.code, 0, JSON.stringify(trusted.status)); assert.equal((trusted.messages[0] as Message).number, payload.number);
        const untrusted = await runGrpc({ ...request, connection: { ...request.connection, ca: "" }, timeoutMs: 500 }) as GrpcCallResult; assert.notEqual(untrusted.status.code, 0);
        const noClient = await runGrpc({ ...request, connection: { ...request.connection, certificate: "", privateKey: "" }, timeoutMs: 500 }) as GrpcCallResult; assert.notEqual(noClient.status.code, 0);
        console.log("gRPC TLS: trusted CA + client certificate succeeds; untrusted CA and missing required client identity fail.");
    } finally { await stop(secure.server); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

import assert from "node:assert/strict";
import { connectMcp, makeMcpRequest, mcpProtocolHeaders, McpHttpError, MCP_CURRENT_VERSION, type McpEnvelope, type McpVersion } from "../src/lib/mcp-protocol";
import { a2aEndpoint, a2aMessage, a2aPart, normalizeA2aResult, A2aStreamAccumulator, A2A_METHODS } from "../src/lib/a2a-protocol";
import { SseDataParser, firstSseRpcResult } from "../src/lib/sse";
import { providerTokenRequest, countProviderTokens } from "../src/lib/provider-token-count";
import { verifyWebhookSignature } from "../src/lib/webhook-signatures";
import { validateJsonSchema } from "../src/lib/json-schema-workbench";

async function main() {
    const requests: { request: McpEnvelope; version: McpVersion; sessionId?: string }[] = [];
    const modern = await connectMcp(async (request, version, sessionId) => {
        requests.push({ request, version, sessionId });
        assert.equal(request.params?._meta && (request.params._meta as Record<string, unknown>)["io.modelcontextprotocol/protocolVersion"], MCP_CURRENT_VERSION);
        return { data: { jsonrpc: "2.0", id: request.id, result: request.method === "tools/list" ? { tools: [{ name: "echo" }] } : { serverInfo: { name: "fixture" } } }, sessionId: "ignored-modern-session" };
    });
    assert.equal(modern.version, MCP_CURRENT_VERSION);
    assert.equal(modern.sessionId, undefined);
    assert.deepEqual(requests.map((row) => row.request.method), ["server/discover", "tools/list"]);
    assert.equal(requests[1].sessionId, undefined);
    assert.deepEqual(mcpProtocolHeaders(MCP_CURRENT_VERSION, makeMcpRequest(MCP_CURRENT_VERSION, "tools/call", { name: "echo" }, 3)), { "MCP-Protocol-Version": MCP_CURRENT_VERSION, "Mcp-Method": "tools/call", "Mcp-Name": "echo" });
    requests.length = 0;
    const legacy = await connectMcp(async (request, version, sessionId) => {
        requests.push({ request, version, sessionId });
        if (request.method === "server/discover") return { data: { error: { code: -32601, message: "Method not found" } } };
        if (request.method === "initialize") return { data: { result: { protocolVersion: "2025-06-18" } }, sessionId: "legacy-session" };
        if (request.method === "notifications/initialized") return { data: null };
        return { data: { result: { tools: [request.params?.cursor ? "second" : "first"], ...(request.params?.cursor ? {} : { nextCursor: "next" }) } } };
    });
    assert.equal(legacy.version, "2025-06-18"); assert.equal(legacy.sessionId, "legacy-session");
    assert.deepEqual(legacy.tools, ["first", "second"]);
    assert.equal(requests[2].sessionId, "legacy-session");
    assert.equal(requests[2].request.params?._meta, undefined);
    await assert.rejects(() => connectMcp(async () => { throw new McpHttpError(401, "Unauthorized"); }), /Unauthorized/);
    let sent = 0;
    const fallback = await connectMcp(async (request) => {
        sent++;
        if (request.method === "server/discover") throw new McpHttpError(400, "legacy HTTP");
        return { data: { result: request.method === "initialize" ? { protocolVersion: "2025-11-25" } : { tools: [] } } };
    });
    assert.equal(sent, 4); assert.equal(fallback.version, "2025-11-25");
    await assert.rejects(() => connectMcp(async () => ({ data: { error: { code: -32022, message: "No compatible version", data: { supported: ["2099-01-01"] } } } })), /No compatible version/);
    await assert.rejects(() => connectMcp(async () => ({ data: { error: { code: -32601, message: "No method" } } }), MCP_CURRENT_VERSION), /No method/);
    await assert.rejects(() => connectMcp(async () => ({ data: { result: { protocolVersion: "invalid" } } }), "2025-11-25"), /Unsupported negotiated/);
    let pages = 0;
    await assert.rejects(() => connectMcp(async (request) => { pages++; return { data: { result: request.method === "server/discover" ? {} : { tools: [], nextCursor: "forever" } } }; }), /20-page/);
    assert.equal(pages, 21);
    assert.deepEqual(a2aPart("1.0", "text", "hello"), { text: "hello" });
    assert.deepEqual(a2aPart("0.3", "data", { a: 1 }), { kind: "data", data: { a: 1 } });
    assert.equal(a2aMessage("1.0", "hello", "id").role, "ROLE_USER");
    assert.equal(a2aMessage("legacy", "hello", "id").messageId, undefined);
    assert.equal(A2A_METHODS["1.0"].send, "SendMessage");
    assert.equal(A2A_METHODS["0.3"].send, "message/send");
    const card = { supportedInterfaces: [{ url: "https://agent.example/rpc", protocolBinding: "JSONRPC", protocolVersion: "1.0" }] };
    assert.equal(a2aEndpoint(card, "1.0", "https://agent.example"), "https://agent.example/rpc");
    assert.throws(() => a2aEndpoint(card, "1.0", "https://different.example"), /different origin/);
    assert.throws(() => a2aEndpoint({ supportedInterfaces: [] }, "1.0", "https://agent.example"), /JSONRPC/);
    assert.equal((normalizeA2aResult({ task: { id: "t", status: { state: "TASK_STATE_INPUT_REQUIRED" } } }).status as { state: string }).state, "input-required");
    const stream = new A2aStreamAccumulator();
    assert.equal(stream.consume({ artifactUpdate: { artifact: { artifactId: "a", parts: [{ text: "hello" }] } } }).finalText, "hello");
    assert.equal(stream.consume({ artifactUpdate: { artifact: { artifactId: "a", parts: [{ text: " world" }] }, append: true } }).finalText, "hello world");
    assert.equal(stream.consume({ artifactUpdate: { artifact: { artifactId: "a", parts: [{ text: "replacement" }] }, append: false } }).finalText, "replacement");
    assert.equal(stream.consume({ statusUpdate: { status: { state: "TASK_STATE_COMPLETED" } } }).state, "completed");
    assert.equal(stream.consume({ message: { parts: [{ text: "one-shot" }] } }).deltaText, "one-shot");
    const parser = new SseDataParser();
    assert.deepEqual(parser.push(": comment\r\ndata: {\r"), []);
    assert.deepEqual(parser.push("\ndata: \"a\":1}\r\n\r"), []);
    assert.deepEqual(parser.push("\n"), ['{\n"a":1}']);
    let canceled = false;
    const response = new Response(new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('data: {"method":"progress"}\r\n\r\ndata: {"id":4,"result":{"ok":true}}\r\n\r\n')); }, cancel() { canceled = true; } }), { headers: { "content-type": "text/event-stream" } });
    assert.deepEqual(await firstSseRpcResult(response, 4), { id: 4, result: { ok: true } }); assert.equal(canceled, true);
    for (const provider of ["OpenAI", "Anthropic", "Google"]) {
        const model = { provider, apiModelId: "test-model" };
        const request = providerTokenRequest(model, "hello", "demo-key");
        assert.ok(request.url.startsWith("https://")); assert.equal(request.url.includes("demo-key"), false);
        const value = await countProviderTokens(model, "hello", "demo-key", (async (_url, init) => {
            assert.equal(init?.cache, "no-store"); assert.equal(init?.redirect, "error");
            return new Response(JSON.stringify({ [request.countKey]: 7 }));
        }) as typeof fetch);
        assert.equal(value, 7);
    }
    await assert.rejects(() => countProviderTokens({ provider: "OpenAI", apiModelId: "model" }, "hi", "key", (async () => new Response('{"input_tokens":-1}')) as typeof fetch), /valid token count/);
    const webhook = { provider: "github" as const, secret: "demo-secret", body: '{"event":"example"}', signature: "sha256=c5ea8a78bece62e8827a681f3d9aac74ab23d3a77774927524e4335b9f152e57" };
    assert.equal((await verifyWebhookSignature(webhook)).verified, true);
    assert.equal((await verifyWebhookSignature({ ...webhook, body: webhook.body + " " })).verified, false);
    const schema = { schema: { $schema: "https://json-schema.org/draft/2020-12/schema", oneOf: [{ type: "string" }, { type: "integer", minimum: 10 }] }, instance: 5 };
    assert.ok(validateJsonSchema(schema.instance, schema.schema).length);
    assert.equal(validateJsonSchema(10, schema.schema).length, 0);
    console.log("✓ Modern/legacy MCP, A2A 1.0/0.3, stream framing/artifact replacement, provider count contracts and independent signature/schema fixtures");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

import { APP_VERSION } from "./app-version";

export class McpHttpError extends Error { constructor(public status: number, message: string) { super(message); this.name = "McpHttpError"; } }
export const MCP_CURRENT_VERSION = "2026-07-28";
export const MCP_LEGACY_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"] as const;
export type McpVersion = typeof MCP_CURRENT_VERSION | typeof MCP_LEGACY_VERSIONS[number];
export type McpVersionChoice = "auto" | McpVersion;
export interface McpEnvelope { jsonrpc: string; id?: number | string; method?: string; params?: Record<string, unknown>; result?: Record<string, unknown>; error?: { code: number; message: string; data?: { supported?: string[] } } }
export function makeMcpRequest(version: McpVersion, method: string, params: Record<string, unknown> = {}, id?: number): McpEnvelope {
    return { jsonrpc: "2.0", ...(id === undefined ? {} : { id }), method, params: version === MCP_CURRENT_VERSION ? {
        ...params, _meta: { ...(params._meta as Record<string, unknown> ?? {}), "io.modelcontextprotocol/protocolVersion": version,
            "io.modelcontextprotocol/clientCapabilities": {}, "io.modelcontextprotocol/clientInfo": { name: "mydevtools", version: APP_VERSION } },
    } : params };
}
export function mcpProtocolHeaders(version: McpVersion, request: McpEnvelope): Record<string, string> {
    return { "MCP-Protocol-Version": version, ...(version === MCP_CURRENT_VERSION ? {
        "Mcp-Method": request.method ?? "", ...(typeof request.params?.name === "string" ? { "Mcp-Name": request.params.name } : {}),
    } : {}) };
}
export type McpSender = (request: McpEnvelope, version: McpVersion, sessionId?: string) => Promise<{ data: unknown; sessionId?: string }>;
function resultOf(response: unknown, method: string): Record<string, unknown> {
    const envelope = response as McpEnvelope;
    if (envelope?.error) throw new Error(`${method}: ${envelope.error.message}`);
    if (!envelope || !envelope.result || typeof envelope.result !== "object") throw new Error(`${method} returned an invalid JSON-RPC result.`);
    return envelope.result;
}

/** Modern requests are stateless. Legacy connections retain the server's negotiated version and session. */
export async function connectMcp(send: McpSender, preferred: McpVersionChoice = "auto") {
    let version: McpVersion = preferred === "auto" ? MCP_CURRENT_VERSION : preferred;
    let sessionId: string | undefined;
    if (version === MCP_CURRENT_VERSION) {
        let discovery: { data: unknown };
        try { discovery = await send(makeMcpRequest(version, "server/discover", {}, 1), version); }
        catch (error) {
            if (preferred === "auto" && error instanceof McpHttpError && error.status === 400) discovery = { data: { error: { code: -32601, message: "Legacy HTTP endpoint" } } };
            else throw error;
        }
        const envelope = discovery.data as McpEnvelope;
        if (envelope?.error && preferred === "auto" && (envelope.error.code === -32601 || (envelope.error.code === -32022 && envelope.error.data?.supported?.some((item) => (MCP_LEGACY_VERSIONS as readonly string[]).includes(item))))) {
            version = MCP_LEGACY_VERSIONS.find((candidate) => !envelope.error?.data?.supported || envelope.error.data.supported.includes(candidate)) ?? "2025-11-25";
        } else resultOf(discovery.data, "server/discover");
    }
    if (version !== MCP_CURRENT_VERSION) {
        const initialization = await send(makeMcpRequest(version, "initialize", { protocolVersion: version, capabilities: {}, clientInfo: { name: "mydevtools", version: APP_VERSION } }, 1), version);
        const result = resultOf(initialization.data, "initialize");
        if (!(MCP_LEGACY_VERSIONS as readonly unknown[]).includes(result.protocolVersion)) throw new Error(`Unsupported negotiated MCP version: ${String(result.protocolVersion)}`);
        version = result.protocolVersion as McpVersion;
        sessionId = initialization.sessionId;
        await send(makeMcpRequest(version, "notifications/initialized"), version, sessionId);
    }
    const tools: unknown[] = [];
    let cursor: string | undefined;
    for (let page = 0; page < 20; page++) {
        const response = await send(makeMcpRequest(version, "tools/list", cursor ? { cursor } : {}, 2 + page), version, sessionId);
        if (version !== MCP_CURRENT_VERSION) sessionId = response.sessionId ?? sessionId;
        const result = resultOf(response.data, "tools/list");
        if (!Array.isArray(result.tools)) throw new Error("tools/list returned no tools array.");
        tools.push(...result.tools);
        cursor = typeof result.nextCursor === "string" ? result.nextCursor : undefined;
        if (!cursor) return { version, sessionId: version === MCP_CURRENT_VERSION ? undefined : sessionId, tools };
    }
    throw new Error("Tool listing exceeded the 20-page limit. The catalog is incomplete.");
}

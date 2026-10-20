import { timingSafeEqual } from "node:crypto";
export interface LocalConnectorEnvironment { MYDEVTOOLS_LOCAL_CONNECTORS?: string; MYDEVTOOLS_LOCAL_CONNECTOR_TOKEN?: string }
export class ConnectorHttpError extends Error { constructor(message: string, public status: number) { super(message); } }
const LOOPBACK_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i;
export function authorizeLocalConnector(request: Request, environment: LocalConnectorEnvironment = { MYDEVTOOLS_LOCAL_CONNECTORS: process.env.MYDEVTOOLS_LOCAL_CONNECTORS, MYDEVTOOLS_LOCAL_CONNECTOR_TOKEN: process.env.MYDEVTOOLS_LOCAL_CONNECTOR_TOKEN }): void {
    const expected = environment.MYDEVTOOLS_LOCAL_CONNECTOR_TOKEN;
    if (environment.MYDEVTOOLS_LOCAL_CONNECTORS !== "true" || !expected || expected.length < 32) throw new ConnectorHttpError("Native connectors are disabled. Use the desktop app or a localhost connector runtime with an access key.", 503);
    const url = new URL(request.url), host = request.headers.get("host") ?? url.host;
    if (!LOOPBACK_HOST.test(host) || !LOOPBACK_HOST.test(url.host)) throw new ConnectorHttpError("Native connectors are available through localhost only.", 403);
    // Next's standalone server can reconstruct request.url using its internal
    // listen address. The validated Host header identifies the browser origin.
    const browserUrl = new URL(url); browserUrl.host = host;
    const origin = request.headers.get("origin");
    if ((request.method !== "GET" && origin !== browserUrl.origin) || (origin && origin !== browserUrl.origin) || request.headers.get("sec-fetch-site") === "cross-site") throw new ConnectorHttpError("The connector request must come from this local app origin.", 403);
    const actual = request.headers.get("x-mydevtools-local-token") ?? "";
    if (actual.length > 4096 || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) throw new ConnectorHttpError("Enter the local connector access key, or open this tool in the desktop app.", 401);
    if (request.method !== "GET" && !/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") ?? "")) throw new ConnectorHttpError("Connector requests must use application/json.", 415);
}
export async function readConnectorBody(request: Request, limit = 12 * 1024 * 1024): Promise<Record<string, unknown>> {
    const declared = request.headers.get("content-length");
    if (declared && (!/^\d+$/.test(declared) || Number(declared) > limit)) throw new ConnectorHttpError("Connector request body is too large.", 413);
    if (!request.body) throw new ConnectorHttpError("Connector request body is empty.", 400);
    const reader = request.body.getReader(), parts: Uint8Array[] = []; let size = 0;
    try {
        while (true) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > limit) { await reader.cancel(); throw new ConnectorHttpError("Connector request body is too large.", 413); } parts.push(value); }
    } finally { reader.releaseLock(); }
    try {
        const bytes = new Uint8Array(size); let offset = 0; for (const part of parts) { bytes.set(part, offset); offset += part.length; }
        const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
        if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
        return value;
    } catch { throw new ConnectorHttpError("Connector request body must be a JSON object.", 400); }
}
let active = 0;
export async function withConnectorSlot<T>(operation: () => Promise<T>): Promise<T> {
    if (active >= 4) throw new ConnectorHttpError("Four connector operations are already running. Wait for one to finish.", 429);
    active++;
    try { return await operation(); } finally { active--; }
}

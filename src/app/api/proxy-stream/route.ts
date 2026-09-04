// Server-side streaming HTTP proxy. Unlike /api/proxy (which buffers the full
// response and returns one JSON payload), this endpoint pipes the upstream
// response body to the client as it arrives — required for SSE / text/event-stream
// transports such as A2A `message/stream` and MCP streamable-HTTP that emit
// long-lived event streams. It bypasses browser CORS the same way /api/proxy does.

import http from "http";
import https from "https";
import { NextResponse } from "next/server";
import type { IncomingMessage } from "http";
import {
    consumeManagedRouteQuota,
    createPinnedLookup,
    managedRoutesEnabled,
    resolvePublicHost,
} from "@/lib/server-network-policy";
import { parseManagedProxyRequest, type ManagedProxyRequest } from "@/lib/proxy-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Headers we must not forward back to the browser — they refer to the
// upstream hop and break the response when copied verbatim.
const HOP_BY_HOP = new Set([
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "content-encoding",
    "content-length",
    "set-cookie",
]);
const MAX_REQUEST_BYTES = 5 * 1024 * 1024;
const MAX_STREAM_BYTES = 25 * 1024 * 1024;
const MAX_TIMEOUT_MS = 120_000;
export async function POST(request: Request) {
    if (!managedRoutesEnabled()) {
        return NextResponse.json({ error: "Managed network tools are disabled for this deployment" }, { status: 503 });
    }
    if (!consumeManagedRouteQuota(request, "proxy-stream", 20)) {
        return NextResponse.json({ error: "Too many managed stream requests. Try again in a minute." }, { status: 429 });
    }

    let input: unknown;
    try {
        input = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }
    const parsedRequest = parseManagedProxyRequest(input, "POST");
    if (typeof parsedRequest === "string") {
        return NextResponse.json({ error: parsedRequest }, { status: 400 });
    }
    const req: ManagedProxyRequest = parsedRequest;

    let parsed: URL;
    try {
        parsed = new URL(req.url);
    } catch {
        return NextResponse.json({ error: `Invalid URL: ${req.url}` }, { status: 400 });
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
        return NextResponse.json({ error: "Only http and https URLs are supported" }, { status: 400 });
    }

    let addresses;
    try {
        addresses = await resolvePublicHost(parsed.hostname);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Target is not permitted";
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const isHttps = parsed.protocol === "https:";
    const lib = isHttps ? https : http;

    const outHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers || {})) {
        if (!HOP_BY_HOP.has(key.toLowerCase()) && key.toLowerCase() !== "host") outHeaders[key] = value;
    }

    let bodyBuffer: Buffer | null = null;
    if (req.body) {
        bodyBuffer = req.bodyIsBase64
            ? Buffer.from(req.body, "base64")
            : Buffer.from(req.body, "utf-8");
        if (bodyBuffer.byteLength > MAX_REQUEST_BYTES) {
            return NextResponse.json({ error: `Request body exceeds the ${MAX_REQUEST_BYTES / 1024 / 1024} MB limit` }, { status: 413 });
        }
        if (!outHeaders["content-length"] && !outHeaders["Content-Length"]) {
            outHeaders["content-length"] = String(bodyBuffer.byteLength);
        }
    }

    const options: https.RequestOptions = {
        hostname: parsed.hostname,
        port: parsed.port ? parseInt(parsed.port, 10) : isHttps ? 443 : 80,
        path: parsed.pathname + parsed.search,
        method: (req.method || "POST").toUpperCase(),
        headers: outHeaders,
        lookup: createPinnedLookup(addresses),
        agent: false,
        rejectUnauthorized: req.sslVerify !== false,
    };
    if (isHttps) {
        if (req.sslCaCert) options.ca = req.sslCaCert;
        if (req.sslClientCert) options.cert = req.sslClientCert;
        if (req.sslClientKey) options.key = req.sslClientKey;
    }

    const timeoutMs = Math.min(Math.max(Number(req.timeout) || MAX_TIMEOUT_MS, 1_000), MAX_TIMEOUT_MS);

    // Capture client-abort signal before any await, so we can tear down upstream
    // if the browser closes the connection.
    const clientAbort = request.signal;

    let clientReq: http.ClientRequest;
    let upstream: IncomingMessage;
    try {
        upstream = await new Promise<IncomingMessage>((resolve, reject) => {
            clientReq = lib.request(options, (res) => resolve(res));
            clientReq.on("error", reject);
            clientReq.setTimeout(timeoutMs, () => {
                clientReq.destroy(new Error(`Upstream timed out after ${timeoutMs}ms`));
            });
            clientAbort.addEventListener("abort", () => clientReq.destroy(new Error("Client aborted")));
            if (bodyBuffer) clientReq.write(bodyBuffer);
            clientReq.end();
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: msg }, { status: 502 });
    }

    // Forward upstream response headers (minus hop-by-hop ones).
    const headers = new Headers();
    for (const [k, v] of Object.entries(upstream.headers)) {
        if (v === undefined) continue;
        if (HOP_BY_HOP.has(k.toLowerCase())) continue;
        headers.set(k, Array.isArray(v) ? v.join(", ") : String(v));
    }
    // Always advertise no caching for streamed proxy responses.
    if (!headers.has("cache-control")) headers.set("cache-control", "no-cache, no-transform");
    headers.set("x-proxy-source", "mydevtools-stream-proxy");

    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            let bytesForwarded = 0;
            const onData = (chunk: Buffer) => {
                bytesForwarded += chunk.byteLength;
                if (bytesForwarded > MAX_STREAM_BYTES) {
                    upstream.destroy(new Error(`Stream exceeded the ${MAX_STREAM_BYTES / 1024 / 1024} MB limit`));
                    try { controller.error(new Error("Stream response exceeded the safety limit")); } catch { /* closed */ }
                    return;
                }
                try {
                    controller.enqueue(new Uint8Array(chunk));
                } catch {
                    // Controller already closed (client aborted); discard chunk.
                }
            };
            const onEnd = () => {
                try { controller.close(); } catch { /* already closed */ }
            };
            const onError = (err: Error) => {
                try { controller.error(err); } catch { /* already closed */ }
            };

            upstream.on("data", onData);
            upstream.on("end", onEnd);
            upstream.on("error", onError);

            clientAbort.addEventListener("abort", () => {
                upstream.destroy();
                try { controller.close(); } catch { /* already closed */ }
            });
        },
        cancel() {
            upstream.destroy();
        },
    });

    return new Response(stream, {
        status: upstream.statusCode || 200,
        statusText: upstream.statusMessage || "",
        headers,
    });
}

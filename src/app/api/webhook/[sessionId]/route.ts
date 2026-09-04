// Catch-all webhook capture endpoint. Any method, any body — recorded into
// the in-memory store keyed by `sessionId`. Returns 200 OK with a tiny JSON
// receipt so curl/Postman/upstream test harnesses see success.

import { NextRequest, NextResponse } from "next/server";
import { isValidWebhookSessionId, recordRequest } from "@/lib/webhook-store";
import { consumeManagedRouteQuota, managedRoutesEnabled } from "@/lib/server-network-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(req: NextRequest, ctx: { params: Promise<{ sessionId: string }> }) {
    if (!managedRoutesEnabled()) {
        return NextResponse.json({ error: "Managed network tools are disabled for this deployment" }, { status: 503 });
    }
    if (!consumeManagedRouteQuota(req, "webhook-ingest", 120)) {
        return NextResponse.json({ error: "Too many webhook requests. Try again in a minute." }, { status: 429 });
    }
    const { sessionId } = await ctx.params;
    if (!isValidWebhookSessionId(sessionId)) {
        return NextResponse.json({ error: "invalid session id" }, { status: 400 });
    }

    const url = new URL(req.url);
    const headers: Record<string, string> = {};
    let capturedHeaderBytes = 0;
    const MAX_CAPTURED_HEADER_BYTES = 16 * 1024;
    req.headers.forEach((v, k) => {
        const size = new TextEncoder().encode(k).byteLength + new TextEncoder().encode(v).byteLength;
        if (capturedHeaderBytes + size <= MAX_CAPTURED_HEADER_BYTES) {
            headers[k] = v;
            capturedHeaderBytes += size;
        }
    });
    if (capturedHeaderBytes >= MAX_CAPTURED_HEADER_BYTES) headers["x-mydevtools-headers-truncated"] = "true";

    const query: Record<string, string> = {};
    url.searchParams.forEach((v, k) => { query[k] = v; });

    // The store is process-local memory (200 requests × N sessions), so an
    // uncapped body is the one input that can push this node over. Truncate
    // rather than reject — a debugging tool should still show you the headers
    // and the start of an oversized payload.
    const MAX_BODY_BYTES = 256 * 1024;

    let bodyText = "";
    let bodyBase64: string | undefined;
    let truncated = false;
    try {
        let buf = await req.arrayBuffer();
        if (buf.byteLength > MAX_BODY_BYTES) {
            truncated = true;
            buf = buf.slice(0, MAX_BODY_BYTES);
        }
        if (buf.byteLength > 0) {
            // Non-fatal decode: a truncated multi-byte char at the cut point
            // must not misclassify otherwise-valid UTF-8 as binary.
            const decoder = new TextDecoder("utf-8", { fatal: !truncated });
            try {
                bodyText = decoder.decode(buf);
            } catch {
                bodyBase64 = Buffer.from(buf).toString("base64");
                bodyText = `[binary, ${buf.byteLength} bytes — see base64 below]`;
            }
            if (truncated) {
                bodyText += `\n\n[truncated — only the first ${MAX_BODY_BYTES / 1024} KB was captured]`;
            }
        }
    } catch {
        // body unreadable; leave empty
    }

    const remoteIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined;

    const captured = recordRequest(sessionId, {
        method: req.method,
        path: url.pathname,
        query,
        headers,
        bodyText,
        bodyBase64,
        remoteIp,
    });

    return NextResponse.json({ ok: true, id: captured.id }, { status: 200 });
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE, handle as OPTIONS, handle as HEAD };

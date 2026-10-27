// Deliver only to a browser currently waiting; no request capture store.
import { NextRequest, NextResponse } from "next/server";
import { isValidWebhookSessionId, hasWebhookListener, deliverRequest } from "@/lib/webhook-store";
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

    // Reject before reading a payload when no browser can receive it.
    if (!hasWebhookListener(sessionId)) {
        await req.body?.cancel();
        return NextResponse.json({ error: "No browser is listening. Requests are never saved for later delivery." }, { status: 409 });
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

    const MAX_BODY_BYTES = 256 * 1024;

    let bodyText = "";
    let bodyBase64: string | undefined;
    let truncated = false;
    try {
        // Bound the actual stream, including chunked requests, before decoding.
        const reader = req.body?.getReader();
        const chunks: Uint8Array[] = [];
        let size = 0;
        try {
            while (reader) {
                const { value, done } = await reader.read();
                if (done) break;
                const remaining = MAX_BODY_BYTES - size;
                chunks.push(value.subarray(0, remaining));
                size += Math.min(value.byteLength, remaining);
                if (value.byteLength > remaining || size === MAX_BODY_BYTES) {
                    truncated = true;
                    await reader.cancel();
                    break;
                }
            }
        } finally { reader?.releaseLock(); }
        const buf = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) { buf.set(chunk, offset); offset += chunk.byteLength; }
        chunks.length = 0;
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

    const deliveryId = deliverRequest(sessionId, {
        method: req.method,
        path: url.pathname,
        query,
        headers,
        bodyText,
        bodyBase64,
    });

    return deliveryId === null
        ? NextResponse.json({ error: "The browser disconnected. This request was discarded." }, { status: 409 })
        : NextResponse.json({ ok: true, id: deliveryId }, { status: 200 });
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE, handle as OPTIONS, handle as HEAD };

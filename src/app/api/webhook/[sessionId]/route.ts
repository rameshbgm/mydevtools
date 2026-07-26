// Catch-all webhook capture endpoint. Any method, any body — recorded into
// the in-memory store keyed by `sessionId`. Returns 200 OK with a tiny JSON
// receipt so curl/Postman/upstream test harnesses see success.

import { NextRequest, NextResponse } from "next/server";
import { recordRequest } from "@/lib/webhook-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(req: NextRequest, ctx: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await ctx.params;
    if (!/^[A-Za-z0-9_-]{6,64}$/.test(sessionId)) {
        return NextResponse.json({ error: "invalid session id" }, { status: 400 });
    }

    const url = new URL(req.url);
    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => { headers[k] = v; });

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

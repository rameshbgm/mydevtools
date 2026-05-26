// Polling endpoint for the webhook-receiver UI. Returns captured requests
// newer than `since` (defaults to 0). Long-poll up to `wait` ms so idle tabs
// don't hammer.

import { NextRequest, NextResponse } from "next/server";
import { getRequestsSince, clearSession } from "@/lib/webhook-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await ctx.params;
    const url = new URL(req.url);
    const since = parseInt(url.searchParams.get("since") || "0", 10) || 0;
    const waitMs = Math.min(parseInt(url.searchParams.get("wait") || "0", 10) || 0, 25000);

    let rows = getRequestsSince(sessionId, since);
    if (rows.length === 0 && waitMs > 0) {
        const deadline = Date.now() + waitMs;
        while (Date.now() < deadline) {
            await new Promise((r) => setTimeout(r, 500));
            rows = getRequestsSince(sessionId, since);
            if (rows.length > 0) break;
        }
    }
    return NextResponse.json({ requests: rows });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await ctx.params;
    clearSession(sessionId);
    return NextResponse.json({ ok: true });
}

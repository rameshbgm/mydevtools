// Live browser poll; no server replay buffer.
import { NextRequest, NextResponse } from "next/server";
import { waitForRequest, clearSession, isValidWebhookSessionId } from "@/lib/webhook-store";
import { consumeManagedRouteQuota, managedRoutesEnabled } from "@/lib/server-network-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ sessionId: string }> }) {
    if (!managedRoutesEnabled()) return NextResponse.json({ error: "Managed network tools are disabled for this deployment" }, { status: 503 });
    if (!consumeManagedRouteQuota(req, "webhook-events", 60)) return NextResponse.json({ error: "Too many webhook poll requests. Try again in a minute." }, { status: 429 });
    const { sessionId } = await ctx.params;
    if (!isValidWebhookSessionId(sessionId)) return NextResponse.json({ error: "invalid session id" }, { status: 400 });
    const url = new URL(req.url);
    const waitMs = Math.max(0, Math.min(parseInt(url.searchParams.get("wait") || "0", 10) || 0, 25000));
    const rows = await waitForRequest(sessionId, waitMs, req.signal);
    return NextResponse.json({ requests: rows });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ sessionId: string }> }) {
    if (!managedRoutesEnabled()) return NextResponse.json({ error: "Managed network tools are disabled for this deployment" }, { status: 503 });
    if (!consumeManagedRouteQuota(req, "webhook-events", 60)) return NextResponse.json({ error: "Too many webhook poll requests. Try again in a minute." }, { status: 429 });
    const { sessionId } = await ctx.params;
    if (!isValidWebhookSessionId(sessionId)) return NextResponse.json({ error: "invalid session id" }, { status: 400 });
    clearSession(sessionId);
    return NextResponse.json({ ok: true });
}

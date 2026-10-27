// Live delivery only. This registry holds pending browser polls, never payloads.
// No requests can be replayed after delivery, disconnection or timeout.
import { randomInt } from "node:crypto";

export interface CapturedRequest {
    id: number;
    receivedAt: number;
    method: string;
    path: string;
    query: Record<string, string>;
    headers: Record<string, string>;
    bodyText: string;
    bodyBase64?: string;
}
type Listener = (request?: CapturedRequest) => void;
const KEY = Symbol.for("mydevtools.live-webhooks.v2");
const root = globalThis as typeof globalThis & { [KEY]?: Map<string, Listener> };
const listeners = root[KEY] ??= new Map<string, Listener>();
const MAX_LISTENERS = 100;

export function waitForRequest(id: string, waitMs: number, signal: AbortSignal): Promise<CapturedRequest[]> {
    if (signal.aborted || waitMs <= 0) return Promise.resolve([]);
    if (!listeners.has(id) && listeners.size >= MAX_LISTENERS) return Promise.resolve([]);
    listeners.get(id)?.();
    return new Promise((resolve) => {
        const finish: Listener = (request) => {
            clearTimeout(timer);
            signal.removeEventListener("abort", abort);
            if (listeners.get(id) === finish) listeners.delete(id);
            resolve(request ? [request] : []);
        };
        const abort = () => finish();
        const timer = setTimeout(abort, Math.min(waitMs, 25_000));
        listeners.set(id, finish);
        signal.addEventListener("abort", abort, { once: true });
        if (signal.aborted) finish();
    });
}
export function hasWebhookListener(id: string): boolean { return listeners.has(id); }
export function deliverRequest(id: string, request: Omit<CapturedRequest, "id" | "receivedAt">): number | null {
    const listener = listeners.get(id);
    if (!listener) return null;
    const deliveryId = randomInt(1, 2 ** 48 - 1);
    listener({ ...request, id: deliveryId, receivedAt: Date.now() });
    return deliveryId;
}
export function clearSession(id: string): void { listeners.get(id)?.(); }
export function isValidWebhookSessionId(id: string): boolean { return /^[A-Za-z0-9_-]{16,64}$/.test(id); }

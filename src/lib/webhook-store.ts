// In-memory webhook capture store.
//
// Sessions live for SESSION_TTL_MS after their last activity. Captured
// requests are bounded to MAX_PER_SESSION (FIFO eviction).
//
// This is intentionally process-local: it works on a single Next.js node
// instance, evaporates on redeploy, and never persists. Trading durability
// for "no infra" — appropriate for a debugging tool, not for production use.

export interface CapturedRequest {
    id: number;
    receivedAt: number;
    method: string;
    path: string;
    query: Record<string, string>;
    headers: Record<string, string>;
    bodyText: string;
    bodyBase64?: string;
    remoteIp?: string;
}

interface Session {
    createdAt: number;
    lastActivity: number;
    nextId: number;
    requests: CapturedRequest[];
    storedBytes: number;
}

const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour idle
const MAX_PER_SESSION = 50;
const MAX_SESSIONS = 100;
const MAX_SESSION_BYTES = 5 * 1024 * 1024;

// `globalThis` keeps the Map alive across Next.js hot reloads in dev.
const KEY = "__mydevtools_webhook_store__";
type Store = { sessions: Map<string, Session> };
const store: Store = (globalThis as unknown as Record<string, Store>)[KEY] || { sessions: new Map<string, Session>() };
(globalThis as unknown as Record<string, Store>)[KEY] = store;

function gc() {
    const now = Date.now();
    for (const [id, s] of store.sessions) {
        if (now - s.lastActivity > SESSION_TTL_MS) store.sessions.delete(id);
    }
}

export function getOrCreateSession(id: string): Session {
    gc();
    let s = store.sessions.get(id);
    if (!s) {
        if (store.sessions.size >= MAX_SESSIONS) {
            const oldest = [...store.sessions.entries()].sort(([, a], [, b]) => a.lastActivity - b.lastActivity)[0];
            if (oldest) store.sessions.delete(oldest[0]);
        }
        s = { createdAt: Date.now(), lastActivity: Date.now(), nextId: 1, requests: [], storedBytes: 0 };
        store.sessions.set(id, s);
    } else {
        s.lastActivity = Date.now();
    }
    return s;
}

export function recordRequest(id: string, req: Omit<CapturedRequest, "id" | "receivedAt">): CapturedRequest {
    const s = getOrCreateSession(id);
    const captured: CapturedRequest = { ...req, id: s.nextId++, receivedAt: Date.now() };
    s.requests.push(captured);
    s.storedBytes += captured.bodyText.length + (captured.bodyBase64?.length ?? 0);
    while (s.requests.length > MAX_PER_SESSION || s.storedBytes > MAX_SESSION_BYTES) {
        const removed = s.requests.shift();
        if (!removed) break;
        s.storedBytes -= removed.bodyText.length + (removed.bodyBase64?.length ?? 0);
    }
    return captured;
}

export function getRequestsSince(id: string, sinceId: number): CapturedRequest[] {
    const s = store.sessions.get(id);
    if (!s) return [];
    s.lastActivity = Date.now();
    return s.requests.filter((r) => r.id > sinceId);
}

export function clearSession(id: string): void {
    const s = store.sessions.get(id);
    if (s) {
        s.requests = [];
        s.storedBytes = 0;
    }
}

export function isValidWebhookSessionId(id: string): boolean {
    return /^[A-Za-z0-9_-]{16,64}$/.test(id);
}

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
}

const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour idle
const MAX_PER_SESSION = 200;

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
        s = { createdAt: Date.now(), lastActivity: Date.now(), nextId: 1, requests: [] };
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
    if (s.requests.length > MAX_PER_SESSION) s.requests.splice(0, s.requests.length - MAX_PER_SESSION);
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
    if (s) s.requests = [];
}

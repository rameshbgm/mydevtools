import http from "node:http";
import { randomBytes } from "node:crypto";
import { ConnectorHttpError } from "./local-connector-auth";
import { connectorObject } from "./connector-config";

export interface MockRoute { method: string; path: string; status: number; headers: Record<string, string>; body: string; delayMs: number }
export interface MockConfiguration { name: string; routes: MockRoute[]; origins: string[] }
export interface MockSummary { id: string; name: string; project: string; baseUrl: string; expiresAt: string; routes: MockRoute[]; requests: number }
interface RunningMock { summary: MockSummary; server: http.Server; ttl: ReturnType<typeof setTimeout>; delays: Set<ReturnType<typeof setTimeout>> }
interface MockState { servers: Map<string, RunningMock>; creating: number }
const key = Symbol.for("mydevtools.local-mocks.v1");
const globalState = globalThis as typeof globalThis & { [key]?: MockState };
const state = globalState[key] ??= { servers: new Map(), creating: 0 };
const ALLOWED_METHODS = new Set(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "*"]);
function invalid(message: string): never { throw new ConnectorHttpError(message, 400); }
export function parseMockConfiguration(value: unknown): MockConfiguration {
    const input = connectorObject(value);
    if (typeof input.name !== "string" || !input.name.trim() || input.name.length > 100) invalid("Name the mock server (up to 100 characters).");
    if (!Array.isArray(input.routes) || !input.routes.length || input.routes.length > 20) invalid("Configure 1–20 mock routes.");
    let bodyBytes = 0; const seen = new Set<string>();
    const routes = input.routes.map((value) => {
        const row = connectorObject(value), method = String(row.method).toUpperCase();
        if (!ALLOWED_METHODS.has(method)) invalid("Choose an HTTP method or * for a mock route.");
        if (typeof row.path !== "string" || !row.path.startsWith("/") || row.path.startsWith("//") || /[?#\x00-\x20\\]/.test(row.path) || row.path.length > 1024) invalid("Mock paths start with / and cannot include query strings, fragments or whitespace.");
        const path = new URL(row.path, "http://fixture.invalid").pathname, routeId = `${method} ${path}`;
        if (seen.has(routeId)) invalid(`Duplicate mock route: ${routeId}.`); seen.add(routeId);
        if (typeof row.status !== "number" || !Number.isInteger(row.status) || row.status < 200 || row.status > 599) invalid("Mock status must be 200–599.");
        if (typeof row.body !== "string" || Buffer.byteLength(row.body) > 64 * 1024) invalid("Each mock response body supports up to 64 KiB of UTF-8 text.");
        bodyBytes += Buffer.byteLength(row.body); if (bodyBytes > 256 * 1024) invalid("Combined mock responses exceed 256 KiB.");
        const delayMs = row.delayMs ?? 0; if (typeof delayMs !== "number" || !Number.isInteger(delayMs) || delayMs < 0 || delayMs > 5000) invalid("Response delay must be 0–5000 milliseconds.");
        const raw = connectorObject(row.headers ?? {}), headers: Record<string, string> = Object.create(null); let headerBytes = 0;
        if (Object.keys(raw).length > 30) invalid("Each mock route supports up to 30 response headers.");
        for (const [name, value] of Object.entries(raw)) {
            if (/^(?:connection|transfer-encoding|content-length|upgrade|set-cookie|access-control-|proxy-)/i.test(name)) invalid("Mock framing, cookie, proxy and CORS headers are managed by the runtime.");
            if (typeof value !== "string") invalid("Mock header values must be strings.");
            try { http.validateHeaderName(name); http.validateHeaderValue(name, value); } catch { invalid("A mock response header is invalid."); }
            headerBytes += name.length + Buffer.byteLength(value); if (headerBytes > 16 * 1024) invalid("Mock response headers exceed 16 KiB.");
            headers[name.toLowerCase()] = value;
        }
        return { method, path, status: row.status, headers, body: row.body, delayMs };
    });
    if (input.origins !== undefined && (!Array.isArray(input.origins) || input.origins.length > 5)) invalid("Allow at most five additional browser origins.");
    const origins = (input.origins as unknown[] ?? []).map((value) => {
        if (typeof value !== "string" || value.length > 300) invalid("Enter full HTTP(S) origins without paths.");
        let url: URL; try { url = new URL(value); } catch { invalid("A mock browser origin is invalid."); }
        if (!["http:", "https:"].includes(url.protocol) || url.origin !== value) invalid("Enter full HTTP(S) origins without paths or credentials.");
        return value;
    });
    return { name: input.name.trim(), routes, origins };
}
function projectId(value: unknown): string { if (typeof value !== "string" || !/^(?:personal|[a-f0-9-]{36})$/.test(value)) invalid("Choose a valid project for the mock server."); return value; }
async function shutdown(id: string): Promise<void> {
    const mock = state.servers.get(id); if (!mock) return;
    state.servers.delete(id); clearTimeout(mock.ttl); mock.delays.forEach(clearTimeout);
    mock.server.closeAllConnections(); await new Promise<void>((resolve) => mock.server.close(() => resolve()));
}
export async function startLocalMock(value: unknown, projectValue: unknown, ownerOrigin: string): Promise<MockSummary> {
    const configuration = parseMockConfiguration(value), project = projectId(projectValue);
    const owner = new URL(ownerOrigin);
    if (!["http:", "https:"].includes(owner.protocol) || !/^(?:localhost|127\.0\.0\.1|\[::1\])$/.test(owner.hostname)) invalid("Start a mock through the authenticated localhost app.");
    if (state.servers.size + state.creating >= 2) throw new ConnectorHttpError("At most two local mocks may run at once. Stop a mock or wait for its expiry.", 429);
    state.creating++;
    const id = randomBytes(24).toString("hex"), capability = randomBytes(24).toString("hex"), prefix = `/m/${capability}`;
    const origins = new Set([owner.origin, ...configuration.origins]), delays = new Set<ReturnType<typeof setTimeout>>();
    let count = 0, port = 0;
    const server = http.createServer({ maxHeaderSize: 32 * 1024 }, (request, response) => {
        const sendError = (status: number, message: string) => { response.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" }); response.end(JSON.stringify({ error: message })); };
        if (request.headers.host !== `127.0.0.1:${port}`) { sendError(403, "Use this mock's loopback address."); request.resume(); return; }
        let target: URL; try { target = new URL(request.url ?? "/", `http://127.0.0.1:${port}`); } catch { sendError(400, "Invalid mock path."); request.resume(); return; }
        if (target.pathname !== prefix && !target.pathname.startsWith(prefix + "/")) { sendError(404, "Mock URL not found."); request.resume(); return; }
        const origin = request.headers.origin;
        if (origin && !origins.has(origin)) { sendError(403, "This browser origin is not allowed by this mock."); request.resume(); return; }
        if (origin) { response.setHeader("access-control-allow-origin", origin); response.setHeader("vary", "origin"); response.setHeader("access-control-allow-private-network", "true"); response.setHeader("access-control-expose-headers", "*"); }
        response.setHeader("cache-control", "no-store");
        if (request.method === "OPTIONS" && request.headers["access-control-request-method"]) {
            const allowedHeaders = request.headers["access-control-request-headers"] ?? "content-type, authorization";
            if (typeof allowedHeaders !== "string" || allowedHeaders.length > 4096 || /[\r\n]/.test(allowedHeaders)) { sendError(400, "Invalid preflight headers."); request.resume(); return; }
            response.writeHead(204, { "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS", "access-control-allow-headers": allowedHeaders }); response.end(); request.resume(); return;
        }
        if (count >= 1000) { sendError(429, "This mock has reached its 1000-request limit."); request.resume(); return; }
        ++count;
        const running = state.servers.get(id); if (running) running.summary.requests = count;
        const routePath = target.pathname.slice(prefix.length) || "/", route = configuration.routes.find((entry) => entry.path === routePath && entry.method === request.method) ?? configuration.routes.find((entry) => entry.path === routePath && entry.method === "*");
        // Drain the body without retaining headers, payloads or request history.
        let bytes = 0, rejected = false;
        request.on("error", () => { rejected = true; });
        request.on("data", (chunk: Buffer) => {
            if (rejected) return;
            bytes += chunk.length;
            if (bytes > 1024 * 1024) { rejected = true; sendError(413, "Mock request exceeds 1 MiB."); request.destroy(); return; }
        });
        request.on("end", () => {
            if (rejected || response.destroyed) return;
            const send = () => {
                if (response.destroyed || response.writableEnded) return;
                if (!route) { sendError(404, "No configured route matches this method and path."); return; }
                response.writeHead(route.status, { "content-type": "text/plain; charset=utf-8", ...route.headers, "cache-control": "no-store" });
                response.end(request.method === "HEAD" || [204, 304].includes(route.status) ? undefined : route.body);
            };
            if (route?.delayMs) { const timer = setTimeout(() => { delays.delete(timer); send(); }, route.delayMs); delays.add(timer); timer.unref(); }
            else send();
        });
    });
    server.requestTimeout = 10_000; server.headersTimeout = 5000; server.keepAliveTimeout = 1000; server.maxConnections = 20;
    try {
        await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", () => { server.removeListener("error", reject); resolve(); }); });
        port = (server.address() as { port: number }).port;
        const summary: MockSummary = { id, name: configuration.name, project, baseUrl: `http://127.0.0.1:${port}${prefix}`, expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(), routes: configuration.routes, requests: 0 };
        const ttl = setTimeout(() => { void shutdown(id); }, 10 * 60_000); ttl.unref(); server.unref();
        state.servers.set(id, { server, summary, ttl, delays });
        return summary;
    } catch (cause) { server.closeAllConnections(); server.close(); throw cause; }
    finally { state.creating--; }
}
export async function manageLocalMock(input: Record<string, unknown>, ownerOrigin: string): Promise<unknown> {
    const project = projectId(input.project);
    if (input.operation === "start") return startLocalMock(input.configuration, project, ownerOrigin);
    if (input.operation === "list") return { mocks: [...state.servers.values()].filter((mock) => mock.summary.project === project).map((mock) => ({ ...mock.summary })) };
    const mock = typeof input.id === "string" ? state.servers.get(input.id) : undefined;
    if (!mock || mock.summary.project !== project) throw new ConnectorHttpError("This mock is stopped, expired or belongs to another project.", 404);
    if (input.operation === "stop") { await shutdown(mock.summary.id); return { stopped: true }; }
    throw new ConnectorHttpError("Choose a supported mock-server operation.", 400);
}

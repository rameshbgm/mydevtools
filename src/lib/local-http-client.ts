import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import type { LookupFunction } from "node:net";
import { checkServerIdentity, getCACertificates } from "node:tls";
import { connectorHost, connectorObject, connectorText } from "./connector-config";
import { ConnectorHttpError } from "./local-connector-auth";

export interface LocalHttpResult { status: number; statusText: string; headers: Record<string, string>; headerPairs: [string, string][]; body: string; bodyIsBase64: boolean; size: number; timing: number; url: string; redirects: number }
const METHODS = new Set(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);
const FORBIDDEN = /^(?:host|content-length|transfer-encoding|connection|upgrade|proxy-authorization|proxy-connection|expect)$/i;
function target(value: unknown): URL {
    if (typeof value !== "string" || value.length > 8192) throw new ConnectorHttpError("Enter an HTTP(S) URL up to 8192 characters.", 400);
    let url: URL; try { url = new URL(value); } catch { throw new ConnectorHttpError("Enter a valid HTTP(S) URL.", 400); }
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.hash) throw new ConnectorHttpError("Use HTTP(S) without URL credentials or a fragment.", 400);
    connectorHost(url.hostname); if (url.port && (Number(url.port) < 1 || Number(url.port) > 65535)) throw new ConnectorHttpError("Invalid endpoint port.", 400);
    return url;
}
export function localRequestHeaders(value: unknown): Record<string, string> {
    const input = connectorObject(value ?? {}), headers: Record<string, string> = Object.create(null); let size = 0;
    if (Object.keys(input).length > 100) throw new ConnectorHttpError("Request headers exceed 100 fields.", 400);
    for (const [key, value] of Object.entries(input)) {
        try { http.validateHeaderName(key); } catch { throw new ConnectorHttpError("A request header name is invalid.", 400); }
        if (FORBIDDEN.test(key) || key.toLowerCase() === "x-mydevtools-local-token") throw new ConnectorHttpError("Host, framing, proxy and local-runtime authentication headers are reserved.", 400);
        if (typeof value !== "string") throw new ConnectorHttpError("Request header values must be strings.", 400);
        try { http.validateHeaderValue(key, value); } catch { throw new ConnectorHttpError("A request header value contains invalid characters.", 400); }
        size += Buffer.byteLength(key) + Buffer.byteLength(value); if (size > 32 * 1024) throw new ConnectorHttpError("Request headers exceed 32 KiB.", 400);
        headers[key.toLowerCase()] = value;
    }
    return headers;
}
/** Native HTTP uses an explicit agent and a bounded direct DNS lookup. No
 * ambient proxy, cookies, client certificates or cloud credentials are read. */
export async function runLocalHttp(input: Record<string, unknown>, signal?: AbortSignal): Promise<LocalHttpResult> {
    let url = target(input.url);
    let method = typeof input.method === "string" ? input.method.toUpperCase() : "GET";
    if (!METHODS.has(method)) throw new ConnectorHttpError("Choose a supported HTTP method.", 400);
    const headers = localRequestHeaders(input.headers);
    const timeout = input.timeout ?? 10_000;
    if (typeof timeout !== "number" || !Number.isInteger(timeout) || timeout < 100 || timeout > 15_000) throw new ConnectorHttpError("HTTP timeout must be 100–15,000 milliseconds.", 400);
    let body: Buffer | undefined;
    if (input.body !== undefined && input.body !== null) {
        if (typeof input.body !== "string" || input.body.length > 2 * 1024 * 1024) throw new ConnectorHttpError("HTTP body must be a string fitting within 1 MiB.", 400);
        if (input.bodyIsBase64 === true && (input.body.length % 4 !== 0 || !/^(?:[a-z\d+/]{4})*(?:[a-z\d+/]{2}==|[a-z\d+/]{3}=)?$/i.test(input.body))) throw new ConnectorHttpError("Binary HTTP body must be padded base64.", 400);
        body = Buffer.from(input.body, input.bodyIsBase64 === true ? "base64" : "utf8");
        if (body.length > 1024 * 1024) throw new ConnectorHttpError("HTTP request body exceeds 1 MiB.", 413);
    }
    if (["GET", "HEAD"].includes(method) && body?.length) throw new ConnectorHttpError("GET and HEAD requests cannot include a body.", 400);
    const tlsInput = connectorObject(input.tls ?? {}), ca = connectorText(tlsInput.ca ?? "", "CA certificate", 64 * 1024), certificate = connectorText(tlsInput.certificate ?? "", "client certificate", 64 * 1024), privateKey = connectorText(tlsInput.privateKey ?? "", "client key", 64 * 1024), serverName = connectorText(tlsInput.serverName ?? "", "TLS server name", 253);
    if (!!certificate !== !!privateKey) throw new ConnectorHttpError("Provide both client certificate and private key for mTLS.", 400);
    if (serverName) connectorHost(serverName);
    if (url.protocol === "http:" && (ca || certificate || privateKey || serverName)) throw new ConnectorHttpError("TLS settings require an HTTPS endpoint.", 400);
    const agent = new http.Agent({ keepAlive: false, maxSockets: 1 });
    const secureAgent = new https.Agent({ keepAlive: false, maxSockets: 1, rejectUnauthorized: true, ca: ca || getCACertificates("bundled"), cert: certificate || undefined, key: privateKey || undefined, minVersion: "TLSv1.2", ...(serverName ? { servername: serverName, checkServerIdentity: (_host, cert) => checkServerIdentity(serverName, cert) } : {}) });
    const started = Date.now();
    try {
        for (let redirects = 0; ; redirects++) {
            const remaining = timeout - (Date.now() - started); if (remaining <= 0) throw new ConnectorHttpError("HTTP request timed out.", 504);
            const current = url, currentBody = body;
            const result = await new Promise<LocalHttpResult>((resolve, reject) => {
                let settled = false;
                const fail = (cause: unknown) => { if (settled) return; settled = true; clearTimeout(timer); reject(cause instanceof Error ? cause : new Error("HTTP request failed.")); };
                const lookup: LookupFunction = (hostname, options, callback) => {
                    dns.lookup(hostname, { ...options, all: true } as dns.LookupAllOptions, (error, addresses) => {
                        if (error) { callback(error, "", 0); return; }
                        try { for (const entry of addresses) connectorHost(entry.address); } catch { callback(new Error("The endpoint resolves to a link-local, unspecified or multicast address."), "", 0); return; }
                        if (typeof options === "object" && options.all) callback(null, addresses);
                        else if (addresses[0]) callback(null, addresses[0].address, addresses[0].family);
                        else callback(new Error("Endpoint DNS returned no addresses."), "", 0);
                    });
                };
                const request = (current.protocol === "https:" ? https : http).request(current, { method, headers: { ...headers, "accept-encoding": headers["accept-encoding"] ?? "identity", ...(currentBody ? { "content-length": String(currentBody.length) } : {}) }, agent: current.protocol === "https:" ? secureAgent : agent, lookup, signal, maxHeaderSize: 32 * 1024 }, (response) => {
                    const declared = Number(response.headers["content-length"]);
                    if (Number.isFinite(declared) && declared > 2 * 1024 * 1024 && method !== "HEAD") { fail(new ConnectorHttpError("HTTP response exceeds 2 MiB.", 413)); response.destroy(); request.destroy(); return; }
                    const chunks: Buffer[] = []; let size = 0;
                    response.on("data", (chunk: Buffer) => { size += chunk.length; if (size > 2 * 1024 * 1024) { fail(new ConnectorHttpError("HTTP response exceeds 2 MiB.", 413)); response.destroy(); request.destroy(); } else chunks.push(chunk); });
                    response.on("aborted", () => fail(new Error("The HTTP response was interrupted."))); response.on("error", fail);
                    response.on("end", () => {
                        if (settled) return;
                        const bytes = Buffer.concat(chunks); let bodyText: string, bodyIsBase64 = false;
                        const mediaType = String(response.headers["content-type"] ?? "");
                        try {
                            if (/^(?:image\/|audio\/|video\/|font\/|application\/(?:octet-stream|pdf|zip|gzip|x-protobuf))/i.test(mediaType) || response.headers["content-encoding"] && response.headers["content-encoding"] !== "identity") throw new Error("Binary representation");
                            bodyText = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
                        } catch { bodyText = bytes.toString("base64"); bodyIsBase64 = true; }
                        const values: Record<string, string> = Object.create(null), headerPairs: [string, string][] = [];
                        for (let i = 0; i < response.rawHeaders.length; i += 2) headerPairs.push([response.rawHeaders[i], response.rawHeaders[i + 1]]);
                        for (const [key, value] of Object.entries(response.headers)) if (value !== undefined) values[key] = Array.isArray(value) ? value.join("\n") : value;
                        settled = true; clearTimeout(timer); resolve({ status: response.statusCode ?? 0, statusText: response.statusMessage ?? "", headers: values, headerPairs, body: bodyText, bodyIsBase64, size: bytes.length, timing: Date.now() - started, url: current.href, redirects });
                    });
                });
                request.on("error", fail);
                const timer = setTimeout(() => request.destroy(new Error("HTTP request timed out.")), remaining);
                if (currentBody) request.write(currentBody);
                request.end();
            });
            if (input.followRedirects !== true || ![301, 302, 303, 307, 308].includes(result.status) || !result.headers.location) return result;
            if (redirects >= 4) throw new ConnectorHttpError("HTTP redirect limit is 5 requests.", 502);
            const next = target(new URL(result.headers.location, current).href);
            if (current.protocol === "https:" && next.protocol !== "https:") throw new ConnectorHttpError("An HTTPS redirect cannot downgrade to HTTP.", 400);
            if (next.origin !== current.origin) {
                for (const key of Object.keys(headers)) if (!/^(?:accept|accept-language|content-type)$/.test(key)) delete headers[key];
                // Certificates and explicit server-name credentials cannot be
                // carried to a different origin under redirect following.
                if (certificate || serverName || ca) throw new ConnectorHttpError("Follow this cross-origin redirect manually when using custom TLS credentials.", 400);
            }
            if (result.status === 303 || [301, 302].includes(result.status) && method === "POST") { method = "GET"; body = undefined; delete headers["content-type"]; }
            url = next;
        }
    } finally { agent.destroy(); secureAgent.destroy(); }
}

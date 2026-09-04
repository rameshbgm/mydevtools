// Server-side HTTP proxy for the API Request Builder.
// Bypasses browser CORS restrictions and TLS certificate validation errors
// by making all outbound requests from Node.js rather than the browser.
//
// PRIVACY INVARIANT — DO NOT BREAK
// ────────────────────────────────
// This route MUST NOT log any of:
//   • the target URL
//   • request headers (Authorization / Cookie / API keys leak here)
//   • request body (PII / secrets)
//   • response body
//   • response headers (Set-Cookie / Location leak here)
// Only request *failures* may be returned to the caller, and even then only
// the error message (which we generated ourselves) goes back — never the
// upstream payload. This guarantee is surfaced in the tool UI via
// ServerProxyNotice. If you find yourself wanting to console.log() something
// from this file, add it behind a build-time DEBUG flag and route only
// non-sensitive context (status codes, byte counts) through it.

import http from "http";
import https from "https";
import { NextResponse } from "next/server";
import {
    consumeManagedRouteQuota,
    createPinnedLookup,
    managedRoutesEnabled,
    resolvePublicHost,
    type ResolvedAddress,
} from "@/lib/server-network-policy";

export const runtime = "nodejs";

// Hard cap on the response body we'll buffer. Anything larger is truncated
// with a synthetic header so the UI can warn the user.
const MAX_RESPONSE_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_REQUEST_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_TIMEOUT_MS = 30_000;
const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]);
const HOP_BY_HOP_HEADERS = new Set(["connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "te", "trailer", "transfer-encoding", "upgrade", "host"]);
const CROSS_ORIGIN_SENSITIVE_HEADERS = new Set(["authorization", "cookie", "proxy-authorization"]);

interface ProxyRequest {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string | null;    // base64 when bodyIsBase64=true, otherwise UTF-8 text
    bodyIsBase64: boolean;
    timeout: number;
    followRedirects: boolean;
    // SSL / TLS configuration (all optional, all only apply to https URLs)
    sslVerify?: boolean;      // strict cert validation; default false (current behavior — accept self-signed)
    sslCaCert?: string;       // PEM-encoded CA bundle to trust
    sslClientCert?: string;   // PEM-encoded client cert (mTLS)
    sslClientKey?: string;    // PEM-encoded private key (mTLS)
}

interface ProxyResponse {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;           // base64 when bodyIsBase64=true, otherwise UTF-8 text
    bodyIsBase64: boolean;
    size: number;
    timing: number;
}

export async function POST(request: Request) {
    if (!managedRoutesEnabled()) {
        return NextResponse.json({ error: "Managed network tools are disabled for this deployment" }, { status: 503 });
    }
    if (!consumeManagedRouteQuota(request, "proxy")) {
        return NextResponse.json({ error: "Too many managed requests. Try again in a minute." }, { status: 429 });
    }

    let req: ProxyRequest;
    try {
        req = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    if (!req.url) {
        return NextResponse.json({ error: "Missing required field: url" }, { status: 400 });
    }

    const method = (req.method || "GET").toUpperCase();
    if (!ALLOWED_METHODS.has(method)) {
        return NextResponse.json({ error: "Unsupported HTTP method" }, { status: 400 });
    }
    req.method = method;
    if (!req.headers || typeof req.headers !== "object" || Array.isArray(req.headers)) req.headers = {};

    let parsed: URL;
    try {
        parsed = new URL(req.url);
    } catch {
        return NextResponse.json({ error: `Invalid URL: ${req.url}` }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
        return NextResponse.json({ error: "Only http and https URLs are supported" }, { status: 400 });
    }

    try {
        const addresses = await resolvePublicHost(parsed.hostname);
        const result = await proxyRequest(req, parsed, addresses, 0);
        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const status = /blocked|public internet|Unsupported|too large/i.test(msg) ? 400 : 502;
        return NextResponse.json({ error: msg }, { status });
    }
}

function prepareHeaders(headers: Record<string, string>, crossOrigin = false): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
        const normalised = key.toLowerCase();
        if (HOP_BY_HOP_HEADERS.has(normalised)) continue;
        if (crossOrigin && CROSS_ORIGIN_SENSITIVE_HEADERS.has(normalised)) continue;
        out[key] = value;
    }
    delete out["content-length"];
    delete out["Content-Length"];
    return out;
}

async function proxyRequest(req: ProxyRequest, parsed: URL, addresses: ResolvedAddress[], redirectCount: number): Promise<ProxyResponse> {
    const startTime = Date.now();

    return new Promise<ProxyResponse>((resolve, reject) => {
        const isHttps = parsed.protocol === "https:";
        const lib = isHttps ? https : http;

        const outHeaders = prepareHeaders(req.headers);

        // Decode body
        let bodyBuffer: Buffer | null = null;
        if (req.body !== null && req.body !== "") {
            bodyBuffer = req.bodyIsBase64
                ? Buffer.from(req.body, "base64")
                : Buffer.from(req.body, "utf-8");
            if (bodyBuffer.byteLength > MAX_REQUEST_BYTES) {
                reject(new Error(`Request body exceeds the ${MAX_REQUEST_BYTES / 1024 / 1024} MB limit`));
                return;
            }
            // Set Content-Length so the server knows the body size
            if (!outHeaders["content-length"] && !outHeaders["Content-Length"]) {
                outHeaders["content-length"] = String(bodyBuffer.byteLength);
            }
        }

        const options: https.RequestOptions = {
            hostname: parsed.hostname,
            port: parsed.port
                ? parseInt(parsed.port, 10)
                : isHttps ? 443 : 80,
            path: parsed.pathname + parsed.search,
            method: (req.method || "GET").toUpperCase(),
            headers: outHeaders,
            lookup: createPinnedLookup(addresses),
            agent: false,
            // TLS validation is safe by default. A custom CA extends trust rather
            // than disabling verification, which keeps mTLS deployments working.
            rejectUnauthorized: req.sslVerify !== false,
        };
        if (isHttps) {
            if (req.sslCaCert) options.ca = req.sslCaCert;
            if (req.sslClientCert) options.cert = req.sslClientCert;
            if (req.sslClientKey) options.key = req.sslClientKey;
        }

        const clientReq = lib.request(options, (res) => {
            // Handle redirects
            const location = res.headers["location"];
            if (
                req.followRedirects &&
                redirectCount < 10 &&
                location &&
                res.statusCode !== undefined &&
                res.statusCode >= 300 &&
                res.statusCode < 400
            ) {
                res.resume(); // consume and discard redirect body
                let redirectUrl: URL;
                try {
                    redirectUrl = new URL(location, parsed.href);
                } catch {
                    reject(new Error(`Invalid redirect location: ${location}`));
                    return;
                }
                // For 303, switch to GET and drop the body
                const redirectMethod = res.statusCode === 303 ? "GET" : req.method;
                const redirectBody   = res.statusCode === 303 ? null : req.body;
                void (async () => {
                    try {
                        const redirectAddresses = await resolvePublicHost(redirectUrl.hostname);
                        const crossOrigin = redirectUrl.origin !== parsed.origin;
                        resolve(await proxyRequest(
                            {
                                ...req,
                                method: redirectMethod,
                                body: redirectBody,
                                headers: prepareHeaders(req.headers, crossOrigin),
                            },
                            redirectUrl,
                            redirectAddresses,
                            redirectCount + 1,
                        ));
                    } catch (error) {
                        reject(error);
                    }
                })();
                return;
            }

            const chunks: Buffer[] = [];
            let bytesReceived = 0;
            let truncated = false;
            res.on("data", (chunk: Buffer) => {
                bytesReceived += chunk.byteLength;
                if (bytesReceived > MAX_RESPONSE_BYTES) {
                    if (!truncated) {
                        // Keep only the bytes up to the cap so the user sees a
                        // partial preview instead of nothing.
                        const overshoot = bytesReceived - MAX_RESPONSE_BYTES;
                        if (overshoot < chunk.byteLength) {
                            chunks.push(chunk.subarray(0, chunk.byteLength - overshoot));
                        }
                        truncated = true;
                    }
                    // discard further chunks but keep socket draining
                    return;
                }
                chunks.push(chunk);
            });
            res.on("end", () => {
                const raw = Buffer.concat(chunks);
                const timing = Date.now() - startTime;

                const responseHeaders: Record<string, string> = {};
                for (const [k, v] of Object.entries(res.headers)) {
                    if (v !== undefined) {
                        responseHeaders[k] = Array.isArray(v) ? v.join(", ") : v;
                    }
                }
                if (truncated) {
                    responseHeaders["x-mydevtools-truncated"] = `response was truncated at ${MAX_RESPONSE_BYTES} bytes`;
                }

                const contentType = responseHeaders["content-type"] ?? "";
                const isText =
                    contentType.includes("text") ||
                    contentType.includes("json") ||
                    contentType.includes("xml") ||
                    contentType.includes("javascript") ||
                    contentType.includes("form-urlencoded") ||
                    contentType.includes("graphql") ||
                    raw.length === 0;

                resolve({
                    status: res.statusCode ?? 0,
                    statusText: res.statusMessage ?? "",
                    headers: responseHeaders,
                    body: isText ? raw.toString("utf-8") : raw.toString("base64"),
                    bodyIsBase64: !isText,
                    size: bytesReceived, // report the real upstream size, not just what we kept
                    timing,
                });
            });
            res.on("error", reject);
        });

        clientReq.on("error", reject);
        const timeoutMs = Math.min(Math.max(Number(req.timeout) || MAX_TIMEOUT_MS, 1_000), MAX_TIMEOUT_MS);
        clientReq.setTimeout(timeoutMs, () => {
            clientReq.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
        });

        if (bodyBuffer) clientReq.write(bodyBuffer);
        clientReq.end();
    });
}

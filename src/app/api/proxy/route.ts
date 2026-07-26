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

export const runtime = "nodejs";

// Hard cap on the response body we'll buffer. Anything larger is truncated
// with a synthetic header so the UI can warn the user.
const MAX_RESPONSE_BYTES = 25 * 1024 * 1024; // 25 MB

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
    let req: ProxyRequest;
    try {
        req = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    if (!req.url) {
        return NextResponse.json({ error: "Missing required field: url" }, { status: 400 });
    }

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
        const result = await proxyRequest(req, parsed, 0);
        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: msg }, { status: 502 });
    }
}

async function proxyRequest(req: ProxyRequest, parsed: URL, redirectCount: number): Promise<ProxyResponse> {
    const startTime = Date.now();

    return new Promise<ProxyResponse>((resolve, reject) => {
        const isHttps = parsed.protocol === "https:";
        const lib = isHttps ? https : http;

        const outHeaders: Record<string, string> = { ...req.headers };

        // Decode body
        let bodyBuffer: Buffer | null = null;
        if (req.body !== null && req.body !== "") {
            bodyBuffer = req.bodyIsBase64
                ? Buffer.from(req.body, "base64")
                : Buffer.from(req.body, "utf-8");
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
            // Default to lenient (false) for backward compatibility with existing tools.
            // A request can opt into strict cert validation by sending sslVerify: true.
            rejectUnauthorized: req.sslVerify === true,
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
                proxyRequest(
                    { ...req, method: redirectMethod, body: redirectBody },
                    redirectUrl,
                    redirectCount + 1
                ).then(resolve).catch(reject);
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
        clientReq.setTimeout(req.timeout || 30000, () => {
            clientReq.destroy(new Error(`Request timed out after ${req.timeout || 30000}ms`));
        });

        if (bodyBuffer) clientReq.write(bodyBuffer);
        clientReq.end();
    });
}

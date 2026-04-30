// This runs server-side only (Node.js TLS) since browsers can't open raw TCP connections.
// The browser cannot initiate raw TCP socket connections, so fetching live certificate chains
// from arbitrary hosts must be done via a server-side Route Handler that uses Node's tls module.

import tls from "tls";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const host = searchParams.get("host")?.trim();
    const portParam = searchParams.get("port");
    const port = portParam ? parseInt(portParam, 10) : 443;

    if (!host) {
        return NextResponse.json({ error: "Missing required query parameter: host" }, { status: 400 });
    }

    if (isNaN(port) || port < 1 || port > 65535) {
        return NextResponse.json({ error: "Invalid port number" }, { status: 400 });
    }

    try {
        const pems = await fetchCertChain(host, port);
        return NextResponse.json({ pems });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: `Failed to fetch certificate from ${host}:${port} — ${message}` }, { status: 500 });
    }
}

function derBufferToPem(raw: Buffer): string {
    const b64 = raw.toString("base64");
    // Wrap at 64 characters per line per RFC 7468
    const lines = b64.match(/.{1,64}/g) ?? [];
    return `-----BEGIN CERTIFICATE-----\n${lines.join("\n")}\n-----END CERTIFICATE-----`;
}

function fetchCertChain(host: string, port: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            socket.destroy();
            reject(new Error("Connection timed out after 10 seconds"));
        }, 10_000);

        const socket = tls.connect(
            {
                host,
                port,
                rejectUnauthorized: false,
                servername: host,
            },
            () => {
                clearTimeout(timeout);

                try {
                    // getPeerCertificate(true) walks the full chain
                    const leafCert = socket.getPeerCertificate(true);
                    socket.destroy();

                    if (!leafCert || !leafCert.raw) {
                        reject(new Error("No certificate returned by server"));
                        return;
                    }

                    const pems: string[] = [];
                    const seen = new Set<string>();

                    // Walk the issuerCertificate chain from leaf to root
                    let current: tls.DetailedPeerCertificate | null = leafCert;
                    while (current && current.raw) {
                        // Use the fingerprint as a dedup key to avoid infinite loops
                        // (self-signed roots point to themselves)
                        const key = current.fingerprint256 ?? current.fingerprint ?? current.serialNumber;
                        if (seen.has(key)) break;
                        seen.add(key);

                        pems.push(derBufferToPem(current.raw));

                        const issuer = current.issuerCertificate as tls.DetailedPeerCertificate | null | undefined;
                        // Stop if the issuer is the same cert (self-signed root)
                        if (!issuer || issuer === current) break;
                        current = issuer;
                    }

                    resolve(pems);
                } catch (e) {
                    reject(e);
                }
            }
        );

        socket.on("error", (err) => {
            clearTimeout(timeout);
            reject(err);
        });
    });
}

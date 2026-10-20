export type WebhookProvider = "github" | "stripe" | "slack" | "hmac";

async function hmac(secret: string, data: string) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data))), (b) => b.toString(16).padStart(2, "0")).join("");
}
function equalHex(a: string, b: string) {
    if (!/^[a-fA-F0-9]{64}$/.test(a) || !/^[a-fA-F0-9]{64}$/.test(b)) return false;
    let difference = 0;
    for (let i = 0; i < 64; i++) difference |= a.toLowerCase().charCodeAt(i) ^ b.toLowerCase().charCodeAt(i);
    return difference === 0;
}

/** Secrets and raw bodies are never stored or transmitted. */
export async function verifyWebhookSignature(options: {
    provider: WebhookProvider; body: string; secret: string; signature: string;
    timestamp?: string; toleranceSeconds?: number; nowSeconds?: number;
}) {
    if (new TextEncoder().encode(options.body).length > 1024 * 1024) throw new Error("Body exceeds the 1 MiB limit.");
    if (!options.secret) throw new Error("Enter the signing secret. It stays in this page's memory.");
    let timestamp = options.timestamp, message = options.body, candidates: string[];
    if (options.provider === "stripe") {
        const entries = options.signature.split(",").map((item) => item.trim().split("="));
        timestamp = entries.find(([key]) => key === "t")?.[1];
        candidates = entries.filter(([key]) => key === "v1").map(([, value]) => value);
        message = `${timestamp}.${options.body}`;
    } else if (options.provider === "slack") {
        candidates = options.signature.startsWith("v0=") ? [options.signature.slice(3)] : [];
        message = `v0:${timestamp}:${options.body}`;
    } else if (options.provider === "github") {
        candidates = options.signature.startsWith("sha256=") ? [options.signature.slice(7)] : [];
    } else candidates = [options.signature.trim()];
    const needsTimestamp = options.provider === "stripe" || options.provider === "slack";
    if (needsTimestamp && (!timestamp || !/^\d+$/.test(timestamp))) throw new Error("A valid Unix timestamp is required by this signature scheme.");
    const expected = await hmac(options.secret, message);
    const signatureMatches = candidates.some((candidate) => equalHex(candidate, expected));
    const ageSeconds = needsTimestamp ? Math.abs((options.nowSeconds ?? Date.now() / 1000) - Number(timestamp)) : null;
    const withinTolerance = ageSeconds === null ? null : ageSeconds <= (options.toleranceSeconds ?? 300);
    return { verified: signatureMatches && withinTolerance !== false, signatureMatches, withinTolerance, ageSeconds,
        explanation: !signatureMatches ? "Signature mismatch. Check the provider, signing secret, signature header, and exact raw body bytes."
            : withinTolerance === false ? "The signature matches, but the timestamp is outside the allowed window."
                : "Signature matches. This diagnostic does not replace server-side verification and replay protection." };
}

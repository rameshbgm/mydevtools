/** Compact JWS (RFC 7515, RFC 7518). No remote keys or critical extensions. */
export type JwsAlgorithm = "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512";
export const JWS_ALGORITHMS: readonly JwsAlgorithm[] = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "PS256", "PS384", "PS512"];
export function encodeJwsBytes(bytes: Uint8Array): string {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function decodeJwsBytes(text: string): Uint8Array<ArrayBuffer> {
    if (!/^[A-Za-z0-9_-]*$/.test(text) || text.length % 4 === 1) throw new Error("Invalid compact JWS base64url encoding");
    const bytes = Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - text.length % 4) % 4)), character => character.charCodeAt(0));
    if (encodeJwsBytes(bytes) !== text) throw new Error("Non-canonical compact JWS base64url encoding");
    return bytes;
}
const textBytes = (text: string) => new TextEncoder().encode(text);
const utf8 = (bytes: Uint8Array) => new TextDecoder("utf-8", { fatal: true }).decode(bytes);
export function parseJwsHeader(encoded: string): Record<string, unknown> & { alg: JwsAlgorithm } {
    const text = utf8(decodeJwsBytes(encoded));
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("JWS protected header must be a JSON object");
    // JSON.parse alone accepts duplicate names. RFC 7515 requires unique header names.
    const names = new Set<string>();
    let depth = 0;
    for (let index = 0; index < text.length; index++) {
        const character = text[index];
        if (character === '"') {
            const start = index++;
            while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index] === '"') break; else index++; }
            let after = index + 1;
            while (/\s/.test(text[after] ?? "") && after < text.length) after++;
            if (depth === 1 && text[after] === ":") {
                const name = JSON.parse(text.slice(start, index + 1)) as string;
                if (names.has(name)) throw new Error("Duplicate JWS protected header name");
                names.add(name);
            }
        } else if (character === "{" || character === "[") depth++;
        else if (character === "}" || character === "]") depth--;
    }
    const header = parsed as Record<string, unknown>;
    if (typeof header.alg !== "string" || !JWS_ALGORITHMS.includes(header.alg as JwsAlgorithm)) throw new Error("Unsupported JWS algorithm");
    if (Object.hasOwn(header, "crit")) throw new Error("Critical JWS header extensions are not supported");
    if (Object.hasOwn(header, "b64") && header.b64 !== true) throw new Error("Unencoded JWS payloads are not supported");
    return header as Record<string, unknown> & { alg: JwsAlgorithm };
}
const parameters = (algorithm: JwsAlgorithm) => {
    const bits = Number(algorithm.slice(2));
    const hash = `SHA-${bits}`;
    const name = algorithm.startsWith("HS") ? "HMAC" : algorithm.startsWith("RS") ? "RSASSA-PKCS1-v1_5" : algorithm.startsWith("PS") ? "RSA-PSS" : "ECDSA";
    return { name, hash, bits, curve: bits === 256 ? "P-256" : bits === 384 ? "P-384" : "P-521" };
};
function pemBytes(pem: string, usage: "sign" | "verify"): Uint8Array<ArrayBuffer> {
    const label = usage === "sign" ? "PRIVATE" : "PUBLIC";
    const match = pem.trim().match(new RegExp(`^-----BEGIN ${label} KEY-----\\s*([A-Za-z0-9+/=\\s]+)\\s*-----END ${label} KEY-----$`));
    if (!match) throw new Error(`Expected ${label === "PRIVATE" ? "PKCS#8 PRIVATE" : "SPKI PUBLIC"} KEY PEM`);
    return Uint8Array.from(atob(match[1].replace(/\s/g, "")), character => character.charCodeAt(0));
}
export type JwsKeyMaterial = string | Uint8Array<ArrayBuffer>;
async function importJwsKey(algorithm: JwsAlgorithm, material: JwsKeyMaterial, usage: "sign" | "verify") {
    if (!JWS_ALGORITHMS.includes(algorithm)) throw new Error("Unsupported JWS algorithm");
    const params = parameters(algorithm);
    if (algorithm.startsWith("HS")) {
        const bytes = typeof material === "string" ? textBytes(material) : material;
        if (bytes.length < params.bits / 8) throw new Error(`${algorithm} requires a secret of at least ${params.bits / 8} UTF-8 bytes`);
        if (typeof material === "string" && material.includes("-----BEGIN")) throw new Error("PEM public or private keys cannot be used as HMAC secrets");
        return crypto.subtle.importKey("raw", bytes, { name: "HMAC", hash: params.hash }, false, [usage]);
    }
    if (typeof material !== "string") throw new Error("Asymmetric JWS requires PEM key material");
    const key = await crypto.subtle.importKey(usage === "sign" ? "pkcs8" : "spki", pemBytes(material, usage), algorithm.startsWith("ES") ? { name: "ECDSA", namedCurve: params.curve } : { name: params.name, hash: params.hash }, false, [usage]);
    if (!algorithm.startsWith("ES") && (key.algorithm as RsaKeyAlgorithm).modulusLength < 2048) throw new Error("JWS RSA keys must be at least 2048 bits");
    return key;
}
const operation = (algorithm: JwsAlgorithm): AlgorithmIdentifier | RsaPssParams | EcdsaParams => {
    const params = parameters(algorithm);
    return algorithm.startsWith("PS") ? { name: "RSA-PSS", saltLength: params.bits / 8 } : algorithm.startsWith("ES") ? { name: "ECDSA", hash: params.hash } : { name: params.name };
};
export async function signCompactJws(payload: string, algorithm: JwsAlgorithm, keyMaterial: JwsKeyMaterial): Promise<string> {
    JSON.parse(payload); // This UI signs JSON; preserve the user's exact UTF-8 representation.
    const input = `${encodeJwsBytes(textBytes(JSON.stringify({ alg: algorithm, typ: "JWT" })))}.${encodeJwsBytes(textBytes(payload))}`;
    const key = await importJwsKey(algorithm, keyMaterial, "sign");
    const signature = await crypto.subtle.sign(operation(algorithm), key, textBytes(input));
    return `${input}.${encodeJwsBytes(new Uint8Array(signature))}`;
}
export async function verifyCompactJws(token: string, expectedAlgorithm: JwsAlgorithm, keyMaterial: JwsKeyMaterial): Promise<{ valid: boolean; payload?: string; error?: string }> {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[0] || !parts[2]) throw new Error("Invalid JWS format - must have 3 parts");
    const [headerPart, payloadPart, signaturePart] = parts;
    const header = parseJwsHeader(headerPart);
    if (header.alg !== expectedAlgorithm) throw new Error("JWS algorithm does not match the selected expected algorithm");
    const payloadBytes = decodeJwsBytes(payloadPart), signature = decodeJwsBytes(signaturePart);
    const key = await importJwsKey(expectedAlgorithm, keyMaterial, "verify");
    const valid = await crypto.subtle.verify(operation(expectedAlgorithm), key, signature, textBytes(`${headerPart}.${payloadPart}`));
    if (!valid) return { valid: false, error: "Signature verification failed" };
    // Display verified bytes as UTF-8 text; parsing and serializing JSON would round large numbers.
    return { valid: true, payload: utf8(payloadBytes) };
}

// RFC 6238 / RFC 4226. All key material stays in the calling page's memory.
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function decodeBase32(input: string): Uint8Array<ArrayBuffer> {
    const value = input.replace(/\s/g, "").toUpperCase();
    if (!value || value.length > 2048 || !/^[A-Z2-7]+=*$/.test(value)) throw new Error("Enter a Base32 secret using A–Z and 2–7, with optional trailing padding.");
    const unpadded = value.replace(/=+$/, "");
    const remainder = unpadded.length % 8;
    if (![0, 2, 4, 5, 7].includes(remainder) || (value.includes("=") && (value.length % 8 !== 0 || value.length - unpadded.length !== (8 - remainder) % 8))) throw new Error("The Base32 secret has invalid length or padding.");
    const result: number[] = []; let bits = 0, buffer = 0;
    for (const char of unpadded) {
        buffer = (buffer << 5) | ALPHABET.indexOf(char); bits += 5;
        if (bits >= 8) { bits -= 8; result.push((buffer >> bits) & 255); buffer &= (1 << bits) - 1; }
    }
    if (buffer !== 0) throw new Error("The Base32 secret has nonzero padding bits.");
    return new Uint8Array(result);
}
export function encodeBase32(bytes: Uint8Array): string {
    let result = "", bits = 0, buffer = 0;
    for (const byte of bytes) { buffer = (buffer << 8) | byte; bits += 8; while (bits >= 5) { bits -= 5; result += ALPHABET[(buffer >> bits) & 31]; } buffer &= (1 << bits) - 1; }
    if (bits) result += ALPHABET[(buffer << (5 - bits)) & 31];
    return result;
}
export async function totp(secret: string, options: { seconds?: number; period?: number; digits?: 6 | 8; algorithm?: "SHA-1" | "SHA-256" | "SHA-512" } = {}) {
    const seconds = options.seconds ?? Math.floor(Date.now() / 1000), period = options.period ?? 30, digits = options.digits ?? 6, algorithm = options.algorithm ?? "SHA-1";
    if (!Number.isSafeInteger(seconds) || seconds < 0 || !Number.isInteger(period) || period < 1 || period > 3600 || ![6, 8].includes(digits) || !["SHA-1", "SHA-256", "SHA-512"].includes(algorithm)) throw new Error("Use a nonnegative Unix timestamp, a 1–3600 second period and 6 or 8 digits.");
    const counter = BigInt(Math.floor(seconds / period)), message = new Uint8Array(8);
    new DataView(message.buffer).setBigUint64(0, counter);
    const key = await crypto.subtle.importKey("raw", decodeBase32(secret), { name: "HMAC", hash: algorithm }, false, ["sign"]);
    const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, message));
    const offset = digest[digest.length - 1] & 15;
    const number = new DataView(digest.buffer).getUint32(offset) & 0x7fffffff;
    return { code: String(number % 10 ** digits).padStart(digits, "0"), remaining: period - seconds % period, counter: counter.toString() };
}

export const SECRET_ALPHABETS = {
    alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    hex: "0123456789abcdef",
    base64url: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    readable: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789",
};
export function generateSecrets(alphabet: string, length: number, count: number): string[] {
    const chars = [...alphabet];
    if (chars.length < 2 || chars.length > 256 || new Set(chars).size !== chars.length || /[\u0000-\u001f\u007f]/.test(alphabet)) throw new Error("Use 2–256 unique characters without tabs, newlines or control characters.");
    if (!Number.isInteger(length) || length < 1 || length > 4096 || !Number.isInteger(count) || count < 1 || count > 1000 || length * count > 1_000_000) throw new Error("Use 1–4096 characters and 1–1000 secrets, up to one million characters total.");
    const limit = Math.floor(256 / chars.length) * chars.length;
    let pool = new Uint8Array(0), cursor = 0;
    const random = () => { if (cursor >= pool.length) { pool = crypto.getRandomValues(new Uint8Array(8192)); cursor = 0; } return pool[cursor++]; };
    return Array.from({ length: count }, () => {
        let output = "";
        for (let index = 0; index < length;) { const value = random(); if (value >= limit) continue; output += chars[value % chars.length]; index++; }
        return output;
    });
}

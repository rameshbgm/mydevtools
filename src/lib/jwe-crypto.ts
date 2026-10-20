/** Compact JWE (RFC 7516 / RFC 7518), using browser Web Crypto only. */
export type JweKeyAlgorithm = "RSA-OAEP" | "RSA-OAEP-256" | "RSA-OAEP-384" | "RSA-OAEP-512" | "A128KW" | "A192KW" | "A256KW" | "dir";
export type JweContentAlgorithm = "A128GCM" | "A192GCM" | "A256GCM" | "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512";
const RSA_HASH = { "RSA-OAEP": "SHA-1", "RSA-OAEP-256": "SHA-256", "RSA-OAEP-384": "SHA-384", "RSA-OAEP-512": "SHA-512" } as const;
const CONTENT = {
    A128GCM: { size: 16, iv: 12, tag: 16, hash: "" },
    A192GCM: { size: 24, iv: 12, tag: 16, hash: "" },
    A256GCM: { size: 32, iv: 12, tag: 16, hash: "" },
    "A128CBC-HS256": { size: 32, iv: 16, tag: 16, hash: "SHA-256" },
    "A192CBC-HS384": { size: 48, iv: 16, tag: 24, hash: "SHA-384" },
    "A256CBC-HS512": { size: 64, iv: 16, tag: 32, hash: "SHA-512" },
} as const;
const encoder = new TextEncoder();
const buffer = (bytes: Uint8Array): ArrayBuffer => Uint8Array.from(bytes).buffer;
const concat = (...parts: Uint8Array[]) => {
    const result = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
    let offset = 0; for (const part of parts) { result.set(part, offset); offset += part.length; } return result;
};
export function jweBase64url(bytes: Uint8Array): string {
    let binary = ""; for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
function decode(value: string): Uint8Array {
    if (!/^[A-Za-z0-9_-]*$/.test(value) || value.length % 4 === 1) throw new Error("Invalid base64url encoding");
    const bytes = Uint8Array.from(atob(value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - value.length % 4) % 4)), c => c.charCodeAt(0));
    if (jweBase64url(bytes) !== value) throw new Error("Invalid base64url encoding");
    return bytes;
}
export function jweKeyBytes(alg: JweKeyAlgorithm, enc: JweContentAlgorithm): number {
    return alg === "dir" ? CONTENT[enc].size : alg.endsWith("KW") ? Number(alg.slice(1, 4)) / 8 : 0;
}
function symmetricKey(input: string | Uint8Array, size: number): Uint8Array {
    let bytes: Uint8Array;
    if (typeof input !== "string") bytes = Uint8Array.from(input);
    else if (input.startsWith("base64url:")) bytes = decode(input.slice(10));
    else if (input.startsWith("hex:")) {
        const hex = input.slice(4); if (!/^(?:[a-fA-F0-9]{2})+$/.test(hex)) throw new Error("Invalid hexadecimal key");
        bytes = Uint8Array.from(hex.match(/../g)!, x => Number.parseInt(x, 16));
    } else bytes = encoder.encode(input.startsWith("utf8:") ? input.slice(5) : input);
    if (bytes.length !== size) throw new Error(`Key must contain exactly ${size} bytes; received ${bytes.length}`);
    return bytes;
}
function parameters(enc: JweContentAlgorithm) {
    if (!Object.hasOwn(CONTENT, enc)) throw new Error("Unsupported content encryption algorithm");
    return CONTENT[enc];
}
function validAlgorithm(alg: JweKeyAlgorithm) {
    if (alg !== "dir" && !["A128KW", "A192KW", "A256KW"].includes(alg) && !Object.hasOwn(RSA_HASH, alg)) throw new Error("Unsupported key management algorithm");
}
async function rsaKey(pem: string, alg: keyof typeof RSA_HASH, usage: "encrypt" | "decrypt") {
    const label = usage === "encrypt" ? "PUBLIC KEY" : "PRIVATE KEY";
    const match = pem.trim().match(new RegExp(`^-----BEGIN ${label}-----\\s*([A-Za-z0-9+/=\\s]+)\\s*-----END ${label}-----$`));
    if (!match) throw new Error(`Expected ${label} PEM (${usage === "encrypt" ? "SPKI" : "PKCS#8"})`);
    const bytes = Uint8Array.from(atob(match[1].replace(/\s/g, "")), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey(usage === "encrypt" ? "spki" : "pkcs8", buffer(bytes), { name: "RSA-OAEP", hash: RSA_HASH[alg] }, false, [usage]);
    if ((key.algorithm as RsaHashedKeyAlgorithm).modulusLength < 2048) throw new Error("RSA keys must be at least 2048 bits");
    return key;
}
async function cbcTag(enc: JweContentAlgorithm, cek: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array, aad: Uint8Array) {
    const p = parameters(enc), half = p.size / 2;
    const key = await crypto.subtle.importKey("raw", buffer(cek.slice(0, half)), { name: "HMAC", hash: p.hash }, false, ["sign"]);
    const al = new Uint8Array(8), view = new DataView(al.buffer), bits = aad.length * 8;
    view.setUint32(0, Math.floor(bits / 2 ** 32)); view.setUint32(4, bits >>> 0);
    return new Uint8Array(await crypto.subtle.sign("HMAC", key, buffer(concat(aad, iv, ciphertext, al)))).slice(0, p.tag);
}
/** Exposed for standards-vector verification; production callers use encryptCompactJwe. */
export async function encryptJweContent(enc: JweContentAlgorithm, cek: Uint8Array, iv: Uint8Array, plaintext: Uint8Array, aad: Uint8Array) {
    const p = parameters(enc);
    if (cek.length !== p.size || iv.length !== p.iv) throw new Error("Invalid content key or IV length");
    const key = await crypto.subtle.importKey("raw", buffer(p.hash ? cek.slice(p.size / 2) : cek), p.hash ? "AES-CBC" : "AES-GCM", false, ["encrypt"]);
    const result = new Uint8Array(await crypto.subtle.encrypt(p.hash ? { name: "AES-CBC", iv: buffer(iv) } : { name: "AES-GCM", iv: buffer(iv), additionalData: buffer(aad), tagLength: 128 }, key, buffer(plaintext)));
    return p.hash ? { ciphertext: result, tag: await cbcTag(enc, cek, iv, result, aad) } : { ciphertext: result.slice(0, -p.tag), tag: result.slice(-p.tag) };
}
export async function decryptJweContent(enc: JweContentAlgorithm, cek: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array, tag: Uint8Array, aad: Uint8Array) {
    const p = parameters(enc);
    if (cek.length !== p.size || iv.length !== p.iv || tag.length !== p.tag || (p.hash && (!ciphertext.length || ciphertext.length % 16))) throw new Error("Invalid encrypted content lengths");
    if (p.hash) {
        const expected = await cbcTag(enc, cek, iv, ciphertext, aad);
        let difference = 0; for (let i = 0; i < expected.length; i++) difference |= expected[i] ^ tag[i];
        if (difference !== 0) throw new Error("Authentication failed");
    }
    const key = await crypto.subtle.importKey("raw", buffer(p.hash ? cek.slice(p.size / 2) : cek), p.hash ? "AES-CBC" : "AES-GCM", false, ["decrypt"]);
    return new Uint8Array(await crypto.subtle.decrypt(p.hash ? { name: "AES-CBC", iv: buffer(iv) } : { name: "AES-GCM", iv: buffer(iv), additionalData: buffer(aad), tagLength: 128 }, key, buffer(p.hash ? ciphertext : concat(ciphertext, tag))));
}
export async function encryptCompactJwe(plaintext: string, alg: JweKeyAlgorithm, enc: JweContentAlgorithm, inputKey: string | Uint8Array): Promise<string> {
    validAlgorithm(alg); const p = parameters(enc);
    const cek = alg === "dir" ? symmetricKey(inputKey, p.size) : crypto.getRandomValues(new Uint8Array(p.size));
    let encryptedKey = new Uint8Array(0);
    if (Object.hasOwn(RSA_HASH, alg)) {
        const key = await rsaKey(String(inputKey), alg as keyof typeof RSA_HASH, "encrypt");
        encryptedKey = new Uint8Array(await crypto.subtle.encrypt("RSA-OAEP", key, buffer(cek)));
    } else if (alg !== "dir") {
        const key = await crypto.subtle.importKey("raw", buffer(symmetricKey(inputKey, jweKeyBytes(alg, enc))), "AES-KW", false, ["wrapKey"]);
        // A raw HMAC carrier permits all CEK sizes, including 384/512-bit CBC-HS keys.
        const carrier = await crypto.subtle.importKey("raw", buffer(cek), { name: "HMAC", hash: "SHA-256" }, true, ["sign"]);
        encryptedKey = new Uint8Array(await crypto.subtle.wrapKey("raw", carrier, key, "AES-KW"));
    }
    const header = jweBase64url(encoder.encode(JSON.stringify({ alg, enc }))), iv = crypto.getRandomValues(new Uint8Array(p.iv));
    const { ciphertext, tag } = await encryptJweContent(enc, cek, iv, encoder.encode(plaintext), encoder.encode(header));
    return [header, jweBase64url(encryptedKey), jweBase64url(iv), jweBase64url(ciphertext), jweBase64url(tag)].join(".");
}
export async function decryptCompactJwe(token: string, inputKey: string | Uint8Array): Promise<string> {
    try {
        const parts = token.trim().split("."); if (parts.length !== 5 || !parts[0]) throw new Error("Invalid compact JWE");
        const [protectedHeader, wrapped, encodedIv, encodedCiphertext, encodedTag] = parts;
        const header = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(decode(protectedHeader)));
        if (!header || typeof header !== "object" || Array.isArray(header) || typeof header.alg !== "string" || typeof header.enc !== "string") throw new Error("Invalid protected header");
        if (Object.hasOwn(header, "crit") || Object.hasOwn(header, "zip")) throw new Error("Unsupported critical header or compression");
        const alg = header.alg as JweKeyAlgorithm, enc = header.enc as JweContentAlgorithm;
        validAlgorithm(alg); const p = parameters(enc);
        const encryptedKey = decode(wrapped), iv = decode(encodedIv), ciphertext = decode(encodedCiphertext), tag = decode(encodedTag);
        let cek: Uint8Array;
        if (alg === "dir") {
            if (encryptedKey.length) throw new Error("Direct encryption requires an empty encrypted key");
            cek = symmetricKey(inputKey, p.size);
        } else if (Object.hasOwn(RSA_HASH, alg)) {
            const key = await rsaKey(String(inputKey), alg as keyof typeof RSA_HASH, "decrypt");
            cek = new Uint8Array(await crypto.subtle.decrypt("RSA-OAEP", key, buffer(encryptedKey)));
        } else {
            if (encryptedKey.length !== p.size + 8) throw new Error("Invalid wrapped key length");
            const key = await crypto.subtle.importKey("raw", buffer(symmetricKey(inputKey, jweKeyBytes(alg, enc))), "AES-KW", false, ["unwrapKey"]);
            const carrier = await crypto.subtle.unwrapKey("raw", buffer(encryptedKey), key, "AES-KW", { name: "HMAC", hash: "SHA-256", length: p.size * 8 }, true, ["sign"]);
            cek = new Uint8Array(await crypto.subtle.exportKey("raw", carrier));
        }
        const plaintext = await decryptJweContent(enc, cek, iv, ciphertext, tag, encoder.encode(protectedHeader));
        return new TextDecoder("utf-8", { fatal: true }).decode(plaintext);
    } catch { throw new Error("JWE decryption failed. Check the token and key."); }
}

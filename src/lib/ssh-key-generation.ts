/** OpenSSH public/private encoding. No private-key encryption is performed.
 * Public formats: RFC 4253 §6.6, RFC 5656 §3.1, RFC 8709 §4.
 * Private envelope: OpenSSH PROTOCOL.key and PROTOCOL.agent key field order.
 */
export type SSHKeyType = "RSA" | "ECDSA" | "Ed25519";
export type SSHRSASize = 2048 | 3072 | 4096;
export type SSHCurve = "P-256" | "P-384" | "P-521";
export interface SSHGenerationOptions {
    type: SSHKeyType;
    rsaSize?: SSHRSASize;
    curve?: SSHCurve;
    comment: string;
}
export interface GeneratedSSHKeyPair {
    publicKey: string;
    privateKey: string;
    fingerprint: string;
    keyType: string;
    comment: string;
    filename: string;
}
const encoder = new TextEncoder();
function concat(...parts: Uint8Array[]): Uint8Array<ArrayBuffer> {
    const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
    let offset = 0;
    for (const part of parts) { out.set(part, offset); offset += part.length; }
    return out;
}
function uint32(value: number): Uint8Array<ArrayBuffer> {
    const bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setUint32(0, value, false);
    return bytes;
}
function string(value: string | Uint8Array): Uint8Array<ArrayBuffer> {
    const bytes = typeof value === "string" ? encoder.encode(value) : value;
    return concat(uint32(bytes.length), bytes);
}
function fromBase64Url(value: string | undefined): Uint8Array<ArrayBuffer> {
    if (!value) throw new Error("The browser did not export the required SSH key material.");
    return Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (char) => char.charCodeAt(0));
}
function base64(bytes: Uint8Array): string {
    // Small chunks avoid argument-count limits without changing byte values.
    let binary = "";
    for (let i = 0; i < bytes.length; i += 4096) binary += String.fromCharCode(...bytes.subarray(i, i + 4096));
    return btoa(binary);
}
function mpint(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
    let first = 0;
    while (first < bytes.length && bytes[first] === 0) first++;
    const magnitude = bytes.subarray(first);
    return string(magnitude.length && magnitude[0] & 0x80 ? concat(new Uint8Array([0]), magnitude) : magnitude);
}

export async function generateSSHKeyPair(options: SSHGenerationOptions): Promise<GeneratedSSHKeyPair> {
    const { type, comment } = options;
    if (/[\u0000-\u001f\u007f\u2028\u2029]/u.test(comment)) throw new Error("The SSH comment must be a single line without control characters.");
    if (comment !== comment.toWellFormed()) throw new Error("The SSH comment must contain valid Unicode text.");
    if (!["RSA", "ECDSA", "Ed25519"].includes(type)) throw new Error("Unsupported SSH key type.");
    const rsaSize = options.rsaSize ?? 4096;
    const curve = options.curve ?? "P-256";
    if (type === "RSA" && ![2048, 3072, 4096].includes(rsaSize)) throw new Error("Unsupported RSA key size.");
    if (type === "ECDSA" && !["P-256", "P-384", "P-521"].includes(curve)) throw new Error("Unsupported ECDSA curve.");
    let pair: CryptoKeyPair;
    if (type === "RSA") {
        pair = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: rsaSize, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
    } else if (type === "ECDSA") {
        pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: curve }, true, ["sign", "verify"]);
    } else {
        // Unsupported browsers reject; never replace Ed25519 with another algorithm.
        pair = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]) as CryptoKeyPair;
    }
    const jwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
    let algorithm: string;
    let publicBlob: Uint8Array<ArrayBuffer>;
    let privateFields: Uint8Array<ArrayBuffer>;
    if (type === "RSA") {
        algorithm = "ssh-rsa";
        const n = mpint(fromBase64Url(jwk.n));
        const e = mpint(fromBase64Url(jwk.e));
        publicBlob = concat(string(algorithm), e, n);
        privateFields = concat(string(algorithm), n, e, mpint(fromBase64Url(jwk.d)), mpint(fromBase64Url(jwk.qi)), mpint(fromBase64Url(jwk.p)), mpint(fromBase64Url(jwk.q)));
    } else if (type === "ECDSA") {
        const sshCurve = `nistp${curve.slice(2)}`;
        algorithm = `ecdsa-sha2-${sshCurve}`;
        const point = concat(new Uint8Array([4]), fromBase64Url(jwk.x), fromBase64Url(jwk.y));
        publicBlob = concat(string(algorithm), string(sshCurve), string(point));
        privateFields = concat(publicBlob, mpint(fromBase64Url(jwk.d)));
    } else {
        algorithm = "ssh-ed25519";
        const pub = fromBase64Url(jwk.x);
        const seed = fromBase64Url(jwk.d);
        if (pub.length !== 32 || seed.length !== 32) throw new Error("The browser returned invalid Ed25519 key material.");
        publicBlob = concat(string(algorithm), string(pub));
        privateFields = concat(publicBlob, string(concat(seed, pub)));
    }
    const check = crypto.getRandomValues(new Uint8Array(4));
    const privateBody = concat(check, check, privateFields, string(comment));
    const paddingLength = (8 - (privateBody.length % 8)) % 8;
    const padded = concat(privateBody, Uint8Array.from({ length: paddingLength }, (_, i) => i + 1));
    const envelope = concat(encoder.encode("openssh-key-v1\0"), string("none"), string("none"), string(new Uint8Array()), uint32(1), string(publicBlob), string(padded));
    const digest = await crypto.subtle.digest("SHA-256", publicBlob);
    const encoded = base64(envelope).match(/.{1,70}/g)!.join("\n");
    return {
        publicKey: `${algorithm} ${base64(publicBlob)}${comment ? ` ${comment}` : ""}`,
        privateKey: `-----BEGIN OPENSSH PRIVATE KEY-----\n${encoded}\n-----END OPENSSH PRIVATE KEY-----\n`,
        fingerprint: `SHA256:${base64(new Uint8Array(digest)).replace(/=+$/, "")}`,
        keyType: type === "RSA" ? `RSA ${rsaSize}` : type === "ECDSA" ? `ECDSA ${curve}` : "Ed25519",
        comment,
        filename: type === "RSA" ? "id_rsa" : type === "ECDSA" ? "id_ecdsa" : "id_ed25519",
    };
}

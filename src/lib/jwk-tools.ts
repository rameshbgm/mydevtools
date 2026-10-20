/** JWK generation parameters are matched to RFC 7517/7518 algorithm metadata. */
import { encodeJwsBytes } from "./jws-crypto";
export interface GeneratedJwk extends JsonWebKey { kid: string }
export type JwkKeyType = "RSA" | "EC" | "oct";
export type JwkKeyUse = "sig" | "enc";
export type JwkEcCurve = "P-256" | "P-384" | "P-521";
export const symmetricJwkSizes = (use: JwkKeyUse): number[] => use === "sig" ? [256, 384, 512] : [128, 192, 256];
export async function generateJwk(options: { keyType: JwkKeyType; keyUse: JwkKeyUse; rsaKeySize: number; ecCurve: JwkEcCurve; symmetricKeySize: number; keyId: string }): Promise<{ publicKey: GeneratedJwk | null; privateKey: GeneratedJwk; jwks: { keys: GeneratedJwk[] } }> {
    const { keyType, keyUse, rsaKeySize, ecCurve, symmetricKeySize } = options;
    if (!["RSA", "EC", "oct"].includes(keyType) || !["sig", "enc"].includes(keyUse)) throw new Error("Unsupported JWK key type or use");
    const kid = options.keyId || Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, "0")).join("");
    let publicKey: GeneratedJwk | null = null;
    let privateKey: GeneratedJwk;
    if (keyType === "oct") {
        if (!symmetricJwkSizes(keyUse).includes(symmetricKeySize)) throw new Error("Symmetric JWK size does not match the selected key use");
        const alg = keyUse === "sig" ? `HS${symmetricKeySize}` : `A${symmetricKeySize}KW`;
        privateKey = { kty: "oct", k: encodeJwsBytes(crypto.getRandomValues(new Uint8Array(symmetricKeySize / 8))), alg, kid, use: keyUse, key_ops: keyUse === "sig" ? ["sign", "verify"] : ["wrapKey", "unwrapKey"], ext: true };
    } else {
        let pair: CryptoKeyPair;
        let alg: string;
        if (keyType === "EC") {
            if (keyUse !== "sig" || !["P-256", "P-384", "P-521"].includes(ecCurve)) throw new Error("EC JWK generation supports signing with P-256, P-384 or P-521");
            pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: ecCurve }, true, ["sign", "verify"]);
            alg = ecCurve === "P-256" ? "ES256" : ecCurve === "P-384" ? "ES384" : "ES512";
        } else {
            if (![2048, 3072, 4096].includes(rsaKeySize)) throw new Error("RSA JWK size must be 2048, 3072 or 4096 bits");
            const bits = rsaKeySize === 2048 ? 256 : rsaKeySize === 3072 ? 384 : 512;
            pair = await crypto.subtle.generateKey({ name: keyUse === "sig" ? "RSASSA-PKCS1-v1_5" : "RSA-OAEP", modulusLength: rsaKeySize, publicExponent: new Uint8Array([1, 0, 1]), hash: `SHA-${bits}` }, true, keyUse === "sig" ? ["sign", "verify"] : ["encrypt", "decrypt"]);
            alg = keyUse === "sig" ? `RS${bits}` : `RSA-OAEP-${bits}`;
        }
        publicKey = { ...await crypto.subtle.exportKey("jwk", pair.publicKey), kid, use: keyUse, alg };
        privateKey = { ...await crypto.subtle.exportKey("jwk", pair.privateKey), kid, use: keyUse, alg };
    }
    return { publicKey, privateKey, jwks: { keys: publicKey ? [publicKey] : [privateKey] } };
}

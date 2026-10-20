import assert from "node:assert/strict";
import { constants, createHmac, createPrivateKey, createPublicKey, generateKeyPairSync, privateDecrypt, publicEncrypt, sign, verify, createCipheriv, createDecipheriv } from "node:crypto";
import { JWS_ALGORITHMS, encodeJwsBytes, decodeJwsBytes, parseJwsHeader, signCompactJws, verifyCompactJws, type JwsAlgorithm } from "../src/lib/jws-crypto";
import { generateJwk, symmetricJwkSizes } from "../src/lib/jwk-tools";

async function main() {
    // Public RFC 7515 Appendix A.1 fixture (including original CRLF whitespace).
    const rfcHeader = "eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9";
    const rfcPayload = "eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ";
    const rfcKey = decodeJwsBytes("AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow");
    const rfcSignature = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
    assert.equal(createHmac("sha256", rfcKey).update(`${rfcHeader}.${rfcPayload}`).digest("base64url"), rfcSignature);
    assert.equal((await verifyCompactJws(`${rfcHeader}.${rfcPayload}.${rfcSignature}`, "HS256", rfcKey)).valid, true);
    const payload = '{"name":"你好 مرحبا 🌍","number":9223372036854775807,"spaces":"a  b"}';
    const rsa = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const ec = Object.fromEntries([["ES256", "prime256v1"], ["ES384", "secp384r1"], ["ES512", "secp521r1"]].map(([algorithm, namedCurve]) => [algorithm, generateKeyPairSync("ec", { namedCurve })]));
    for (const algorithm of JWS_ALGORITHMS) {
        const bits = Number(algorithm.slice(2)), hash = `sha${bits}`;
        const pair = algorithm.startsWith("ES") ? ec[algorithm] : rsa;
        const privatePem = pair.privateKey.export({ type: "pkcs8", format: "pem" }).toString(), publicPem = pair.publicKey.export({ type: "spki", format: "pem" }).toString();
        const secret = "public-test-only-".repeat(5);
        const compact = await signCompactJws(payload, algorithm, algorithm.startsWith("HS") ? secret : privatePem);
        const [header, encoded, signature] = compact.split(".");
        assert.equal(Buffer.from(encoded, "base64url").toString("utf8"), payload, `${algorithm}: preserve exact UTF-8 bytes and numeric lexemes`);
        const data = Buffer.from(`${header}.${encoded}`), signatureBytes = Buffer.from(signature, "base64url");
        const options = { key: pair.publicKey, ...(algorithm.startsWith("ES") ? { dsaEncoding: "ieee-p1363" as const } : {}), ...(algorithm.startsWith("PS") ? { padding: constants.RSA_PKCS1_PSS_PADDING, saltLength: bits / 8 } : {}) };
        if (algorithm.startsWith("HS")) assert.deepEqual(signatureBytes, createHmac(hash, secret).update(data).digest());
        else assert.equal(verify(hash, data, options, signatureBytes), true, `${algorithm}: independent Node/OpenSSL verifier`);
        const verified = await verifyCompactJws(compact, algorithm, algorithm.startsWith("HS") ? secret : publicPem);
        assert.equal(verified.valid, true); assert.equal(verified.payload, payload, `${algorithm}: preserve verified UTF-8 text and numeric lexemes`);
        const independentSignature = algorithm.startsWith("HS") ? createHmac(hash, secret).update(data).digest() : sign(hash, data, { ...options, key: pair.privateKey });
        assert.equal((await verifyCompactJws(`${header}.${encoded}.${independentSignature.toString("base64url")}`, algorithm, algorithm.startsWith("HS") ? secret : publicPem)).valid, true, `${algorithm}: independently signed token`);
        const altered = Buffer.from(signatureBytes); altered[0] ^= 1;
        assert.equal((await verifyCompactJws(`${header}.${encoded}.${altered.toString("base64url")}`, algorithm, algorithm.startsWith("HS") ? secret : publicPem)).valid, false);
        const tamperedPayload = Buffer.from('{"name":"tampered"}').toString("base64url");
        assert.equal((await verifyCompactJws(`${header}.${tamperedPayload}.${signature}`, algorithm, algorithm.startsWith("HS") ? secret : publicPem)).valid, false);
        await assert.rejects(verifyCompactJws(compact, algorithm === "HS256" ? "RS256" : "HS256", secret), /selected expected algorithm/);
        if (algorithm.startsWith("ES")) assert.equal(signatureBytes.length, algorithm === "ES256" ? 64 : algorithm === "ES384" ? 96 : 132);
        if (algorithm.startsWith("HS")) { await assert.rejects(signCompactJws(payload, algorithm, "short"), /requires a secret/); await assert.rejects(verifyCompactJws(compact, algorithm, "short"), /requires a secret/); }
    }
    for (const header of ['{"alg":"none"}', 'null', '[]', '{"alg":"HS256","alg":"HS256"}', '{"alg":"HS256","\\u0061lg":"HS256"}', '{"alg":"HS256","crit":["exp"],"exp":true}', '{"alg":"HS256","b64":false}']) assert.throws(() => parseJwsHeader(Buffer.from(header).toString("base64url")));
    assert.equal(parseJwsHeader(Buffer.from('{"alg":"HS256","nested":{"alg":"nested"}}').toString("base64url")).alg, "HS256");
    for (const malformed of ["=", "A", "AA=", "AA+", "AB", "AA\n"]) assert.throws(() => decodeJwsBytes(malformed));
    assert.deepEqual(decodeJwsBytes(encodeJwsBytes(Uint8Array.of(0, 127, 128, 255))), Uint8Array.of(0, 127, 128, 255));
    await assert.rejects(signCompactJws(payload, "HS256", "-----BEGIN PUBLIC KEY-----" + "x".repeat(64)), /cannot be used as HMAC/);
    const weakRsa = generateKeyPairSync("rsa", { modulusLength: 1024 });
    await assert.rejects(signCompactJws(payload, "RS256", weakRsa.privateKey.export({ type: "pkcs8", format: "pem" }).toString()), /at least 2048/);
    await assert.rejects(signCompactJws(payload, "ES384", ec.ES256.privateKey.export({ type: "pkcs8", format: "pem" }).toString()));
    await assert.rejects(verifyCompactJws("bad", "HS256", "x".repeat(32)), /3 parts/);

    const defaults = { keyType: "RSA" as const, keyUse: "sig" as const, rsaKeySize: 2048, ecCurve: "P-256" as const, symmetricKeySize: 256, keyId: "public-fixture-你好" };
    for (const keyUse of ["sig", "enc"] as const) for (const size of symmetricJwkSizes(keyUse)) {
        const result = await generateJwk({ ...defaults, keyType: "oct", keyUse, symmetricKeySize: size });
        assert.equal(result.publicKey, null); assert.equal(Buffer.from(result.privateKey.k!, "base64url").length, size / 8);
        assert.deepEqual(result.jwks.keys, [result.privateKey]);
        if (keyUse === "sig") {
            assert.equal(result.privateKey.alg, `HS${size}`);
            const key = await crypto.subtle.importKey("jwk", result.privateKey, { name: "HMAC", hash: `SHA-${size}` }, false, ["sign", "verify"]);
            const data = new TextEncoder().encode(payload), signature = await crypto.subtle.sign("HMAC", key, data);
            assert.deepEqual(Buffer.from(signature), createHmac(`sha${size}`, Buffer.from(result.privateKey.k!, "base64url")).update(data).digest());
        } else {
            assert.equal(result.privateKey.alg, `A${size}KW`);
            const key = await crypto.subtle.importKey("jwk", result.privateKey, "AES-KW", false, ["wrapKey", "unwrapKey"]);
            const content = await crypto.subtle.importKey("raw", new Uint8Array(32), "AES-GCM", true, ["encrypt"]);
            const wrapped = await crypto.subtle.wrapKey("raw", content, key, "AES-KW");
            const decipher = createDecipheriv(`id-aes${size}-wrap`, Buffer.from(result.privateKey.k!, "base64url"), Buffer.alloc(8, 0xa6));
            assert.deepEqual(Buffer.concat([decipher.update(Buffer.from(wrapped)), decipher.final()]), Buffer.alloc(32));
            const cipher = createCipheriv(`id-aes${size}-wrap`, Buffer.from(result.privateKey.k!, "base64url"), Buffer.alloc(8, 0xa6));
            const independent = Buffer.concat([cipher.update(Buffer.alloc(32)), cipher.final()]);
            const unwrapped = await crypto.subtle.unwrapKey("raw", independent, key, "AES-KW", "AES-GCM", true, ["encrypt"]);
            assert.deepEqual(Buffer.from(await crypto.subtle.exportKey("raw", unwrapped)), Buffer.alloc(32));
        }
    }
    for (const [keyUse, size] of [["sig", 128], ["sig", 192], ["enc", 384], ["enc", 512]] as const) await assert.rejects(generateJwk({ ...defaults, keyType: "oct", keyUse, symmetricKeySize: size }), /does not match/);
    for (const ecCurve of ["P-256", "P-384", "P-521"] as const) {
        const result = await generateJwk({ ...defaults, keyType: "EC", ecCurve });
        assert.equal(result.privateKey.use, "sig"); assert.equal(result.publicKey?.d, undefined); assert.ok(result.privateKey.d);
        const hash = ecCurve === "P-256" ? "SHA-256" : ecCurve === "P-384" ? "SHA-384" : "SHA-512";
        const privateKey = await crypto.subtle.importKey("jwk", result.privateKey, { name: "ECDSA", namedCurve: ecCurve }, false, ["sign"]);
        const signature = await crypto.subtle.sign({ name: "ECDSA", hash }, privateKey, new TextEncoder().encode(payload));
        assert.equal(verify(hash.replace("-", "").toLowerCase(), Buffer.from(payload), { key: createPublicKey({ key: result.publicKey!, format: "jwk" }), dsaEncoding: "ieee-p1363" }, Buffer.from(signature)), true);
    }
    for (const rsaKeySize of [2048, 3072, 4096]) for (const keyUse of ["sig", "enc"] as const) {
        const result = await generateJwk({ ...defaults, rsaKeySize, keyUse });
        const bits = rsaKeySize === 2048 ? 256 : rsaKeySize === 3072 ? 384 : 512, hash = `SHA-${bits}`, nodeHash = `sha${bits}`;
        assert.equal(result.privateKey.alg, keyUse === "sig" ? `RS${bits}` : `RSA-OAEP-${bits}`);
        assert.equal(result.privateKey.kid, defaults.keyId); assert.equal(result.publicKey?.d, undefined); assert.deepEqual(result.jwks.keys, [result.publicKey]);
        const data = Buffer.from("你好 🌍");
        if (keyUse === "sig") {
            const key = await crypto.subtle.importKey("jwk", result.privateKey, { name: "RSASSA-PKCS1-v1_5", hash }, false, ["sign"]);
            const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, data);
            assert.equal(verify(nodeHash, data, createPublicKey({ key: result.publicKey!, format: "jwk" }), Buffer.from(sig)), true);
        } else {
            const pub = await crypto.subtle.importKey("jwk", result.publicKey!, { name: "RSA-OAEP", hash }, false, ["encrypt"]), priv = await crypto.subtle.importKey("jwk", result.privateKey, { name: "RSA-OAEP", hash }, false, ["decrypt"]);
            const encrypted = await crypto.subtle.encrypt("RSA-OAEP", pub, data);
            assert.deepEqual(privateDecrypt({ key: createPrivateKey({ key: result.privateKey, format: "jwk" }), oaepHash: nodeHash }, Buffer.from(encrypted)), data);
            const encryptedByNode = publicEncrypt({ key: createPublicKey({ key: result.publicKey!, format: "jwk" }), oaepHash: nodeHash }, data);
            assert.deepEqual(Buffer.from(await crypto.subtle.decrypt("RSA-OAEP", priv, encryptedByNode)), data);
        }
    }
    await assert.rejects(generateJwk({ ...defaults, keyType: "EC", keyUse: "enc" }));
    console.log("JWS/JWK: RFC7515 vector, all12 JWSalgorithms, malformed/critical/tamperedtokens, UTF8, weakkeys, all15 JWKconfigurations and independentNode/OpenSSL interoperability passed");
}
main().catch(error => { console.error(error); process.exitCode = 1; });

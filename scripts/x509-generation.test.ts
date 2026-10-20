import assert from "node:assert/strict";
import { X509Certificate, createPrivateKey, createPublicKey, verify } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
    generateSelfSignedCertificate, generateCertificateRequest, certificateSubjectAltNames,
    type CertificateGenerationOptions, type CertificateKeyOptions,
} from "../src/lib/x509-generation";

// Portable independent Node/OpenSSL-backed crypto oracles verify actual DER.
// Optional --openssl additionally runs an external OpenSSL CLI. No CLI or
// platform-specific install is needed for the default suite.
const useOpenSSL = process.argv.includes("--openssl");
const openssl = process.env.MYDEVTOOLS_TEST_OPENSSL ?? (["/opt/homebrew/opt/openssl@3/bin/openssl", "/usr/local/opt/openssl@3/bin/openssl"].find(existsSync) ?? "openssl");
const directory = mkdtempSync(join(tmpdir(), "mydevtools-x509-"));
const run = (...args: string[]) => execFileSync(openssl, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const now = new Date("2026-10-21T00:00:00Z");
const defaults: CertificateGenerationOptions = {
    commonName: "fixture.example", organization: "Test café 日本語", organizationalUnit: "Development",
    country: "US", state: "California", locality: "San Francisco", email: "test@fixture.example",
    subjectAltNames: ["fixture.example", "*.example.org", "127.0.0.1", "2001:db8::1", "::ffff:192.0.2.1", "bücher.example"],
    keyAlgorithm: "RSA", rsaKeySize: 2048, hashAlgorithm: "SHA-256", validityDays: 365,
    isCA: false, keyUsage: { digitalSignature: true, keyEncipherment: true, dataEncipherment: false, keyCertSign: false, cRLSign: false },
    extKeyUsage: { serverAuth: true, clientAuth: true, codeSigning: true, emailProtection: true },
};
interface DerItem { tag: number; raw: Buffer; content: Buffer }
function derItem(input: Buffer, offset = 0): DerItem {
    let cursor = offset + 2;
    let size = input[offset + 1];
    assert.ok(size !== undefined);
    if (size & 128) {
        const count = size & 127;
        assert.ok(count > 0 && count <= 4);
        size = 0;
        for (let index = 0; index < count; index++) size = size * 256 + input[cursor++];
    }
    assert.ok(cursor + size <= input.length);
    return { tag: input[offset], raw: input.subarray(offset, cursor + size), content: input.subarray(cursor, cursor + size) };
}
function children(item: DerItem): DerItem[] {
    const result: DerItem[] = [];
    let offset = 0;
    while (offset < item.content.length) {
        const child = derItem(item.content, offset);
        result.push(child);
        offset += child.raw.length;
    }
    assert.equal(offset, item.content.length);
    return result;
}
function fromPEM(value: string): DerItem {
    const input = Buffer.from(value.replace(/-----[^-]+-----/g, "").replace(/\s/g, ""), "base64");
    const result = derItem(input);
    assert.equal(result.raw.length, input.length, "no trailing DER bytes");
    assert.equal(result.tag, 0x30);
    return result;
}
function extensionMap(extensions: DerItem) {
    return new Map(children(extensions).map((extension) => {
        const parts = children(extension);
        assert.equal(parts[0].tag, 0x06);
        const critical = parts[1].tag === 1;
        const value = parts[critical ? 2 : 1];
        assert.equal(value.tag, 4);
        return [parts[0].content.toString("hex"), { critical, value: derItem(value.content) }];
    }));
}
function checkSAN(extension: { value: DerItem } | undefined) {
    assert.ok(extension);
    const names = children(extension.value);
    assert.deepEqual(names.map(name => name.tag), [0x82, 0x82, 0x87, 0x87, 0x87, 0x82]);
    assert.deepEqual(names.filter(name => name.tag === 0x82).map(name => name.content.toString()), ["fixture.example", "*.example.org", "xn--bcher-kva.example"]);
    assert.deepEqual(names.filter(name => name.tag === 0x87).map(name => name.content.toString("hex")), ["7f000001", "20010db8000000000000000000000001", "00000000000000000000ffffc0000201"]);
}
let checks = 0;
async function certificate(key: CertificateKeyOptions, start = now, ca = false) {
    const options = { ...defaults, ...key, isCA: ca, keyUsage: { ...defaults.keyUsage, keyEncipherment: key.keyAlgorithm === "RSA", keyCertSign: ca, cRLSign: ca } };
    const result = await generateSelfSignedCertificate(options, start);
    assert.ok(result.certificatePem.startsWith("-----BEGIN CERTIFICATE-----\n"));
    assert.ok(result.privateKeyPem.startsWith("-----BEGIN PRIVATE KEY-----\n"));
    const parsed = new X509Certificate(result.certificatePem);
    const privateKey = createPrivateKey(result.privateKeyPem);
    assert.equal(parsed.checkPrivateKey(privateKey), true, "certificate binds to exported private key");
    assert.equal(parsed.verify(parsed.publicKey), true, "self-signature verifies independently");
    assert.equal(parsed.ca, ca);
    assert.equal(parsed.subject, parsed.issuer);
    assert.ok(parsed.subject.includes("Test café 日本語"));
    assert.equal(new Date(parsed.validFrom).getTime(), start.getTime());
    assert.equal(new Date(parsed.validTo).getTime() - start.getTime(), 365 * 86400000);
    assert.match(parsed.serialNumber, /^[0-7][0-9A-F]{39}$/);
    assert.equal(parsed.checkHost("fixture.example"), "fixture.example");
    assert.equal(parsed.checkHost("service.example.org"), "*.example.org");
    assert.equal(parsed.checkHost("xn--bcher-kva.example"), "xn--bcher-kva.example");
    assert.equal(parsed.checkIP("127.0.0.1"), "127.0.0.1");
    assert.equal(parsed.checkIP("2001:db8::1"), "2001:db8::1");
    assert.equal(parsed.checkIP("::ffff:192.0.2.1"), "::ffff:192.0.2.1");
    const derParts = children(fromPEM(result.certificatePem));
    const tbs = children(derParts[0]);
    assert.equal(tbs[0].tag, 0xa0);
    assert.equal(children(tbs[0])[0].content.toString("hex"), "02", "X.509 v3");
    assert.deepEqual(tbs[2].raw, derParts[1].raw, "inner and outer signature identifiers match");
    const extensions = extensionMap(children(tbs.find(part => part.tag === 0xa3)!)[0]);
    const basic = extensions.get("551d13")!;
    assert.equal(basic.critical, true);
    assert.equal(children(basic.value).length, ca ? 1 : 0);
    if (ca) assert.equal(children(basic.value)[0].content.toString("hex"), "ff");
    const usage = extensions.get("551d0f")!;
    assert.equal(usage.critical, true);
    const expectedUsage = 0x80 | (key.keyAlgorithm === "RSA" ? 0x20 : 0) | (ca ? 0x06 : 0);
    assert.equal(usage.value.content[1], expectedUsage);
    const ski = extensions.get("551d0e")!.value.content;
    const aki = children(extensions.get("551d23")!.value)[0].content;
    assert.equal(ski.length, 20);
    assert.deepEqual(ski, aki);
    assert.deepEqual(children(extensions.get("551d25")!.value).map(part => part.content.toString("hex")), ["2b06010505070301", "2b06010505070302", "2b06010505070303", "2b06010505070304"]);
    checkSAN(extensions.get("551d11"));
    const path = join(directory, `certificate-${checks++}.pem`);
    if (useOpenSSL) {
        writeFileSync(path, result.certificatePem);
        const text = run("x509", "-in", path, "-text", "-noout");
        assert.match(text, /Version: 3 \(0x2\)/);
        assert.match(text, /X509v3 Basic Constraints: critical/);
        assert.match(text, /X509v3 Key Usage: critical/);
        for (const usage of ["TLS Web Server Authentication", "TLS Web Client Authentication", "Code Signing", "E-mail Protection"]) assert.ok(text.includes(usage), usage);
        assert.match(run("verify", "-check_ss_sig", "-attime", String(start.getTime() / 1000 + 60), "-CAfile", path, path), /: OK/);
    }
    const corrupted = Buffer.from(parsed.raw);
    corrupted[corrupted.length - 1] ^= 1;
    assert.equal(new X509Certificate(corrupted).verify(parsed.publicKey), false);
}
async function csr(key: CertificateKeyOptions, names = defaults.subjectAltNames) {
    const result = await generateCertificateRequest({ ...defaults, ...key, subjectAltNames: names });
    const [info, identifier, signature] = children(fromPEM(result.csrPem));
    const infoParts = children(info);
    assert.equal(infoParts[0].content.toString("hex"), "00");
    assert.equal(infoParts[3].tag, 0xa0, "PKCS#10 attributes are context-specific IMPLICIT SET");
    const publicKey = createPublicKey({ key: infoParts[2].raw, type: "spki", format: "der" });
    assert.deepEqual(publicKey.export({ format: "der", type: "spki" }), createPublicKey(createPrivateKey(result.privateKeyPem)).export({ format: "der", type: "spki" }));
    assert.equal(signature.tag, 3);
    assert.equal(signature.content[0], 0);
    const hash = key.hashAlgorithm ?? "SHA-256";
    const verifyHash = key.keyAlgorithm === "Ed25519" ? null : hash.toLowerCase().replace("-", "");
    assert.equal(verify(verifyHash, info.raw, publicKey, signature.content.subarray(1)), true, "independent CSR DER signature verification");
    const tampered = Buffer.from(info.raw);
    tampered[tampered.length - 1] ^= 1;
    assert.equal(verify(verifyHash, tampered, publicKey, signature.content.subarray(1)), false);
    const rsaOID = { "SHA-256": "2a864886f70d01010b", "SHA-384": "2a864886f70d01010c", "SHA-512": "2a864886f70d01010d" };
    const ecOID = { "SHA-256": "2a8648ce3d040302", "SHA-384": "2a8648ce3d040303", "SHA-512": "2a8648ce3d040304" };
    const algorithmParts = children(identifier);
    assert.equal(algorithmParts[0].content.toString("hex"), key.keyAlgorithm === "Ed25519" ? "2b6570" : key.keyAlgorithm === "ECDSA" ? ecOID[hash] : rsaOID[hash]);
    assert.equal(algorithmParts.length, key.keyAlgorithm === "RSA" ? 2 : 1, "ECDSA/Ed25519 parameters absent; RSA has NULL");
    if (key.keyAlgorithm === "RSA") assert.equal(algorithmParts[1].raw.toString("hex"), "0500");
    if (names.length) {
        const attributes = children(infoParts[3]);
        assert.equal(attributes.length, 1);
        const requested = children(attributes[0]);
        assert.equal(requested[0].content.toString("hex"), "2a864886f70d01090e", "PKCS#9 extensionRequest");
        assert.equal(requested[1].tag, 0x31);
        checkSAN(extensionMap(children(requested[1])[0]).get("551d11"));
    } else assert.equal(children(infoParts[3]).length, 0);
    const path = join(directory, `request-${checks++}.pem`);
    if (useOpenSSL) {
        writeFileSync(path, result.csrPem);
        run("req", "-in", path, "-verify", "-noout");
        const text = run("req", "-in", path, "-text", "-noout");
        if (names.length) {
            assert.match(text, /Requested Extensions:/);
            assert.match(text, /DNS:fixture.example/);
            assert.match(text, /IP Address:127.0.0.1/);
        }
        assert.deepEqual(createPublicKey(run("req", "-in", path, "-pubkey", "-noout")).export({ format: "der", type: "spki" }), publicKey.export({ format: "der", type: "spki" }));
    }
    const expectedType = key.keyAlgorithm === "RSA" ? "rsa" : key.keyAlgorithm === "ECDSA" ? "ec" : "ed25519";
    assert.equal(createPrivateKey(result.privateKeyPem).asymmetricKeyType, expectedType, "never substitute an advertised algorithm");
    if (key.keyAlgorithm === "RSA") assert.equal(createPrivateKey(result.privateKeyPem).asymmetricKeyDetails?.modulusLength, key.rsaKeySize ?? 2048);
    if (key.keyAlgorithm === "ECDSA") assert.equal(createPrivateKey(result.privateKeyPem).asymmetricKeyDetails?.namedCurve, { "P-256": "prime256v1", "P-384": "secp384r1", "P-521": "secp521r1" }[key.ecCurve ?? "P-256"]);
}
async function main() {
    try {
        for (const hashAlgorithm of ["SHA-256", "SHA-384", "SHA-512"] as const) {
            await csr({ keyAlgorithm: "RSA", rsaKeySize: 2048, hashAlgorithm });
            for (const ecCurve of ["P-256", "P-384", "P-521"] as const) await csr({ keyAlgorithm: "ECDSA", ecCurve, hashAlgorithm });
        }
        await csr({ keyAlgorithm: "Ed25519" });
        await csr({ keyAlgorithm: "ECDSA", ecCurve: "P-256" }, []);
        for (const key of [{ keyAlgorithm: "RSA", rsaKeySize: 2048 }, ...(["P-256", "P-384", "P-521"] as const).map(ecCurve => ({ keyAlgorithm: "ECDSA" as const, ecCurve }))] as CertificateKeyOptions[]) await certificate(key);
        await certificate({ keyAlgorithm: "RSA", rsaKeySize: 2048 }, now, true);
        await certificate({ keyAlgorithm: "ECDSA", ecCurve: "P-384" }, new Date("2050-01-01T00:00:00Z"), true);
        if (process.argv.includes("--all-key-sizes")) {
            for (const rsaKeySize of [1024, 3072, 4096, 8192]) await csr({ keyAlgorithm: "RSA", rsaKeySize });
            for (const rsaKeySize of [3072, 4096]) await certificate({ keyAlgorithm: "RSA", rsaKeySize });
        }
        for (const invalid of ["999.1.1.1", "01.1.1.1", "127.1", "bad name.example", "domain/path", "example.com?x=1", "bad_.example", "-bad.example", "::gg", "2001:db8::1%eth0", "[::1]:80", "*.*.example", "", "\u0000example"]) assert.throws(() => certificateSubjectAltNames([invalid]), { name: "Error" }, invalid);
        assert.deepEqual(certificateSubjectAltNames(["::", "::1", "2001:db8:0:0:0:0:0:1"]).map(name => name.encoded.length), [18, 18, 18]);
        for (const validityDays of [0, -1, 1.5, Infinity, 3651]) await assert.rejects(generateSelfSignedCertificate({ ...defaults, validityDays }), /Validity/);
        await assert.rejects(generateSelfSignedCertificate({ ...defaults, keyUsage: { ...defaults.keyUsage, keyCertSign: true } }), /CA Certificate/);
        await assert.rejects(generateSelfSignedCertificate({ ...defaults, keyAlgorithm: "ECDSA" }), /encipherment/);
        await assert.rejects(generateCertificateRequest({ ...defaults, commonName: " " }), /Common Name/);
        await assert.rejects(generateCertificateRequest({ ...defaults, country: "USA" }), /Country/);
        await assert.rejects(generateCertificateRequest({ ...defaults, email: "日本語@example.com" }), /ASCII/);
        await assert.rejects(generateCertificateRequest({ ...defaults, commonName: "bad\nsubject" }), /control/);
        await assert.rejects(generateCertificateRequest({ ...defaults, commonName: "a".repeat(65) }), /64-character/);
        await assert.rejects(generateCertificateRequest({ ...defaults, commonName: "bad\uD800" }), /valid Unicode/);
        // Unsupported Ed25519 fails explicitly. The generator must never create ECDSA instead.
        const originalCrypto = globalThis.crypto;
        Object.defineProperty(globalThis, "crypto", { configurable: true, value: { subtle: { generateKey: async () => { throw new DOMException("Unavailable", "NotSupportedError"); } } } });
        try { await assert.rejects(generateCertificateRequest({ ...defaults, keyAlgorithm: "Ed25519" }), /no substitute key was generated/); }
        finally { Object.defineProperty(globalThis, "crypto", { configurable: true, value: originalCrypto }); }
        console.log(`✓ X.509 generation: ${checks} independently verified certificates/CSRs${useOpenSSL ? " plus external OpenSSL" : " without external CLI"}; SANs, key usages, dates, key binding, all EC/hash combinations, Ed25519, tampering and invalid inputs`);
    } finally { rmSync(directory, { recursive: true, force: true }); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

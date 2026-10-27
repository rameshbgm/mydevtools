import assert from "node:assert/strict";
import { generateKeyPairSync, privateEncrypt, constants, createHash } from "node:crypto";
import forge from "node-forge";
import { validateChain } from "../src/lib/cert-utils";
async function main() {
    const pair = generateKeyPairSync("rsa", { modulusLength: 2048, privateKeyEncoding: { type: "pkcs1", format: "pem" }, publicKeyEncoding: { type: "spki", format: "pem" } });
    const privateKey = forge.pki.privateKeyFromPem(pair.privateKey), publicKey = forge.pki.publicKeyFromPem(pair.publicKey);
    function certificate(name: string, issuer: string, serial: string) {
        const cert = forge.pki.createCertificate(); cert.publicKey = publicKey; cert.serialNumber = serial;
        cert.validity.notBefore = new Date(Date.now() - 86400000); cert.validity.notAfter = new Date(Date.now() + 86400000);
        cert.setSubject([{ name: "commonName", value: name }]); cert.setIssuer([{ name: "commonName", value: issuer }]);
        cert.setExtensions([{ name: "basicConstraints", cA: name === issuer }]); cert.sign(privateKey, forge.md.sha256.create()); return cert;
    }
    const root = certificate("Fixture root", "Fixture root", "01"), child = certificate("Fixture leaf", "Fixture root", "02"), rootPem = forge.pki.certificateToPem(root);
    assert.equal((await validateChain([forge.pki.certificateToPem(child), rootPem])).valid, true);
    child.signature = String.fromCharCode(child.signature.charCodeAt(0) ^ 1) + child.signature.slice(1);
    assert.equal((await validateChain([forge.pki.certificateToPem(child), rootPem])).valid, false);
    // Reproduce the advisory's extra DigestAlgorithm element with a generated test key.
    const clean = certificate("Fixture leaf", "Fixture root", "03"), asn1 = forge.pki.certificateToAsn1(clean);
    const tbs = forge.asn1.toDer((asn1.value as forge.asn1.Asn1[])[0]).getBytes();
    const digest = createHash("sha256").update(Buffer.from(tbs, "binary")).digest();
    const { Class, Type, create, oidToDer, toDer } = forge.asn1;
    const digestInfo = create(Class.UNIVERSAL, Type.SEQUENCE, true, [
        create(Class.UNIVERSAL, Type.SEQUENCE, true, [create(Class.UNIVERSAL, Type.OID, false, oidToDer("2.16.840.1.101.3.4.2.1").getBytes()), create(Class.UNIVERSAL, Type.NULL, false, ""), create(Class.UNIVERSAL, Type.NULL, false, "")]),
        create(Class.UNIVERSAL, Type.OCTETSTRING, false, digest.toString("binary")),
    ]);
    clean.signature = privateEncrypt({ key: pair.privateKey, padding: constants.RSA_PKCS1_PADDING }, Buffer.from(toDer(digestInfo).getBytes(), "binary")).toString("binary");
    assert.throws(() => publicKey.verify(digest.toString("binary"), clean.signature), /DigestInfo/, "Patched upstream verifier must reject the malformed signature");
    const result = await validateChain([forge.pki.certificateToPem(clean), rootPem]);
    assert.equal(result.valid, false, "Platform verifier must reject a noncanonical DigestInfo");
    assert.ok(result.issues.some((issue) => issue.includes("signature failed")));
    console.log("✓ Certificate signatures: valid RSA chain, tampering, and malformed nested DigestAlgorithm rejected by patched upstream and platform verification");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

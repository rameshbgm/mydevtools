import assert from "node:assert/strict";
import { createCipheriv, createDecipheriv, createHash } from "node:crypto";
import CryptoJS from "crypto-js";
import { decryptLegacyAesText, encryptLegacyAesText } from "../src/lib/aes-text";

// Independent OpenSSL EVP_BytesToKey reference using node:crypto, not CryptoJS.
// https://docs.openssl.org/3.0/man3/EVP_BytesToKey/
function derive(passphrase: string, salt: Buffer) {
    let previous = Buffer.alloc(0), derived = Buffer.alloc(0);
    while (derived.length < 48) {
        previous = createHash("md5").update(previous).update(Buffer.from(passphrase, "utf8")).update(salt).digest();
        derived = Buffer.concat([derived, previous]);
    }
    return { key: derived.subarray(0, 32), iv: derived.subarray(32, 48) };
}
const salt = Buffer.from("0001020304050607", "hex");
const passphrase = "public fixture 🔑 العربية";
function encryptNode(plaintext: string | Buffer, padding = true) {
    const { key, iv } = derive(passphrase, salt);
    const cipher = createCipheriv("aes-256-cbc", key, iv).setAutoPadding(padding);
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    return Buffer.concat([Buffer.from("Salted__"), salt, ciphertext]).toString("base64");
}
function decryptNode(envelope: string) {
    const bytes = Buffer.from(envelope, "base64");
    const { key, iv } = derive(passphrase, bytes.subarray(8, 16));
    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    return Buffer.concat([decipher.update(bytes.subarray(16)), decipher.final()]).toString("utf8");
}
for (const plaintext of ["", "Hello, mydevtools!", "  日本語 العربية 😀\n\u0000 exact\t ", "a".repeat(16), "z".repeat(1_000)]) {
    const fixture = encryptNode(plaintext);
    assert.equal(decryptLegacyAesText(fixture, passphrase), plaintext);
    assert.equal(decryptLegacyAesText(fixture.replace(/.{1,16}/g, "$&\r\n"), passphrase), plaintext, "Wrapped OpenSSL Base64");
    const actual = encryptLegacyAesText(plaintext, passphrase);
    assert.equal(decryptNode(actual), plaintext, "Node independently decrypts tool ciphertext");
    assert.equal(CryptoJS.AES.decrypt(actual, passphrase).toString(CryptoJS.enc.Utf8), plaintext);
    assert.notEqual(encryptLegacyAesText(plaintext, passphrase), actual, "New salt on each encryption");
    // Every previously offered selector used this same fixed 256-bit passphrase route.
    for (const keySize of [4, 6, 8]) assert.equal(decryptLegacyAesText(CryptoJS.AES.encrypt(plaintext, passphrase, { keySize }).toString(), passphrase), plaintext);
}
// Fixed cross-implementation regression vector (UTF-8 passphrase and message).
const unicodeFixture = "U2FsdGVkX18AAQIDBAUGB3/ioGXAiJ7eRwIIhVh+Dhio3IU+g/jpimVQ34gRYSP+xCLqnbQzEffoktOyi+g2zQ==";
const unicodePlaintext = "  日本語 العربية 😀\n\u0000 exact\t ";
assert.equal(encryptNode(unicodePlaintext), unicodeFixture);
assert.equal(decryptLegacyAesText(unicodeFixture, passphrase), unicodePlaintext);
const fixture = encryptNode("fixture plaintext");
for (const invalid of ["", "not ciphertext", fixture + "!", fixture.slice(0, -1), Buffer.alloc(32).toString("base64"), Buffer.from("Salted__12345678").toString("base64"), Buffer.concat([Buffer.from("Salted__12345678"), Buffer.alloc(15)]).toString("base64")]) {
    assert.throws(() => decryptLegacyAesText(invalid, passphrase));
}
assert.throws(() => decryptLegacyAesText(fixture, "known wrong fixture passphrase"));
assert.throws(() => decryptLegacyAesText(fixture, ""));
assert.throws(() => encryptLegacyAesText("text", ""));
// Invalid zero/overlong/inconsistent PKCS7 suffixes must not be silently stripped.
for (const padded of [Buffer.alloc(16, 0), Buffer.alloc(16, 17), Buffer.concat([Buffer.alloc(14, 65), Buffer.from([1, 2])])]) {
    assert.throws(() => decryptLegacyAesText(encryptNode(padded, false), passphrase));
}
assert.throws(() => decryptLegacyAesText(encryptNode(Buffer.from([0xff])), passphrase), "Malformed UTF-8 is not text");

// CBC is unauthenticated: a plaintext block ending in a valid padding byte
// permits a truncation attack. Removing C2 leaves a valid padded C1 and silently
// changes the message. This must never be described as verified/authenticated.
const tamperPlaintext = "Attack at dawn!\x01" + "cancelled";
const tamperFixture = Buffer.from(encryptNode(tamperPlaintext), "base64");
assert.equal(decryptLegacyAesText(tamperFixture.subarray(0, 32).toString("base64"), passphrase), "Attack at dawn!");
assert.notEqual(decryptLegacyAesText(tamperFixture.subarray(0, 32).toString("base64"), passphrase), tamperPlaintext);
console.log("AES legacy compatibility: independent EVP/AES-CBC interoperability, Unicode/empty text, previous selector outputs, salted envelope, full PKCS7 validation, wrong-password fixture and unauthenticated tampering limitation passed.");

import CryptoJS from "crypto-js";

// Compatibility format only: EVP_BytesToKey (MD5, one iteration), AES-256-CBC,
// PKCS7 padding, and an OpenSSL Salted__ envelope. This format has no MAC.
export function encryptLegacyAesText(plaintext: string, passphrase: string): string {
    if (!passphrase) throw new Error("A passphrase is required");
    return CryptoJS.AES.encrypt(plaintext, passphrase, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    }).toString();
}

const invalidCiphertext = () => new Error("Invalid legacy AES ciphertext or passphrase");

export function decryptLegacyAesText(ciphertext: string, passphrase: string): string {
    if (!passphrase) throw invalidCiphertext();
    // Accept wrapped OpenSSL Base64 without accepting arbitrary ignored characters.
    const normalized = ciphertext.replace(/[\t\n\r ]/g, "");
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(normalized)) throw invalidCiphertext();
    const envelope = CryptoJS.enc.Base64.parse(normalized);
    if (envelope.toString(CryptoJS.enc.Base64) !== normalized || envelope.sigBytes < 32 || (envelope.sigBytes - 16) % 16 !== 0 || envelope.words[0] !== 0x53616c74 || envelope.words[1] !== 0x65645f5f) throw invalidCiphertext();

    // CryptoJS's default unpad only reads the last byte. Validate every PKCS7
    // byte before removing it. This is a format check, never authentication.
    const padded = CryptoJS.AES.decrypt(normalized, passphrase, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.NoPadding,
    });
    const byteAt = (index: number) => (padded.words[index >>> 2] >>> (24 - (index % 4) * 8)) & 0xff;
    const paddingLength = byteAt(padded.sigBytes - 1);
    if (paddingLength < 1 || paddingLength > 16 || paddingLength > padded.sigBytes) throw invalidCiphertext();
    for (let index = padded.sigBytes - paddingLength; index < padded.sigBytes; index++) {
        if (byteAt(index) !== paddingLength) throw invalidCiphertext();
    }
    padded.sigBytes -= paddingLength;
    padded.clamp();
    try {
        return padded.toString(CryptoJS.enc.Utf8);
    } catch {
        throw invalidCiphertext();
    }
}

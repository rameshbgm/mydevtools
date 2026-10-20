/** Browser-local X.509 v3 and PKCS#10 generation (RFC 5280/2986/5480/8410).
 * The signed bytes are the DER TBSCertificate/CertificationRequestInfo, never
 * a JSON preview. Web Crypto ECDSA uses P1363; X.509 requires DER (r, s).
 */
export type CertificateKeyAlgorithm = "RSA" | "ECDSA" | "Ed25519";
export type CertificateHash = "SHA-256" | "SHA-384" | "SHA-512";
export interface CertificateSubject {
    commonName: string;
    country?: string;
    state?: string;
    locality?: string;
    organization?: string;
    organizationalUnit?: string;
    email?: string;
}
export interface CertificateKeyOptions {
    keyAlgorithm: CertificateKeyAlgorithm;
    rsaKeySize?: number;
    ecCurve?: "P-256" | "P-384" | "P-521";
    hashAlgorithm?: CertificateHash;
}
export interface CertificateGenerationOptions extends CertificateSubject, CertificateKeyOptions {
    subjectAltNames: string[];
    validityDays: number;
    isCA: boolean;
    keyUsage: {
        digitalSignature: boolean;
        keyEncipherment: boolean;
        dataEncipherment: boolean;
        keyCertSign: boolean;
        cRLSign: boolean;
    };
    extKeyUsage: { serverAuth: boolean; clientAuth: boolean; codeSigning: boolean; emailProtection: boolean };
}
export interface CSRGenerationOptions extends CertificateSubject, CertificateKeyOptions {
    subjectAltNames: string[];
}
type Bytes = number[];
const bytes = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer));
const concat = (...parts: Bytes[]) => parts.flat();
function length(value: number): Bytes {
    if (value < 128) return [value];
    const result: Bytes = [];
    for (let remaining = value; remaining; remaining = Math.floor(remaining / 256)) result.unshift(remaining % 256);
    return [0x80 | result.length, ...result];
}
const der = (tag: number, contents: Bytes): Bytes => [tag, ...length(contents.length), ...contents];
const sequence = (...parts: Bytes[]) => der(0x30, concat(...parts));
const set = (...parts: Bytes[]) => der(0x31, concat(...parts));
const utf8 = (value: string) => Array.from(new TextEncoder().encode(value));
function oid(value: string): Bytes {
    const arcs = value.split(".").map(Number);
    const encoded: Bytes = [];
    for (const arc of [40 * arcs[0] + arcs[1], ...arcs.slice(2)]) {
        const octets = [arc % 128];
        for (let remaining = Math.floor(arc / 128); remaining; remaining = Math.floor(remaining / 128)) octets.unshift((remaining % 128) | 0x80);
        encoded.push(...octets);
    }
    return der(0x06, encoded);
}
function integer(value: Bytes): Bytes {
    let start = 0;
    while (start < value.length - 1 && value[start] === 0) start++;
    const result = value.slice(start);
    if (!result.length) result.push(0);
    if (result[0] & 0x80) result.unshift(0);
    return der(0x02, result);
}
const bitString = (value: Bytes) => der(0x03, [0, ...value]);
const pem = (value: Bytes, label: string) => {
    // Chunked conversion avoids argument limits for larger RSA keys.
    let binary = "";
    for (let offset = 0; offset < value.length; offset += 8192) binary += String.fromCharCode(...value.slice(offset, offset + 8192));
    return `-----BEGIN ${label}-----\n${btoa(binary).match(/.{1,64}/g)?.join("\n")}\n-----END ${label}-----\n`;
};
function subjectName(subject: CertificateSubject): Bytes {
    if (!subject.commonName.trim()) throw new Error("Common Name (CN) is required.");
    if (subject.country && !/^[A-Z]{2}$/.test(subject.country)) throw new Error("Country must be exactly two uppercase letters.");
    if (subject.email && (!/^[\x21-\x7e]+$/.test(subject.email) || !/^[^@\s]+@[^@\s]+$/.test(subject.email))) throw new Error("Subject email must be an ASCII email address.");
    const limits: [string | undefined, number][] = [
        [subject.commonName, 64], [subject.organization, 64], [subject.organizationalUnit, 64],
        [subject.locality, 128], [subject.state, 128], [subject.email, 255],
    ];
    for (const [value, maximum] of limits) {
        if (value && Array.from(value).length > maximum) throw new Error(`Subject field exceeds its ${maximum}-character X.509 limit.`);
        if (value && Array.from(value).some((character) => { const point = character.codePointAt(0)!; return point >= 0xd800 && point <= 0xdfff; })) throw new Error("Subject fields must contain valid Unicode characters.");
    }
    const fields: [string, string | undefined, number][] = [
        ["2.5.4.6", subject.country, 0x13], ["2.5.4.8", subject.state, 0x0c],
        ["2.5.4.7", subject.locality, 0x0c], ["2.5.4.10", subject.organization, 0x0c],
        ["2.5.4.11", subject.organizationalUnit, 0x0c], ["2.5.4.3", subject.commonName, 0x0c],
        ["1.2.840.113549.1.9.1", subject.email, 0x16],
    ];
    for (const [, value] of fields) if (value && /[\u0000-\u001f\u007f]/.test(value)) throw new Error("Subject fields cannot contain control characters.");
    return sequence(...fields.filter(([, value]) => !!value).map(([id, value, tag]) => set(sequence(oid(id), der(tag, utf8(value!))))));
}
function ipv4(value: string): Bytes | null {
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(value)) return null;
    const result = value.split(".").map(Number);
    if (result.some((part) => part > 255) || value.split(".").some((part) => part.length > 1 && part.startsWith("0"))) throw new Error("Invalid IPv4 subject alternative name.");
    return result;
}
function ipAddress(value: string): Bytes | null {
    const v4 = ipv4(value);
    if (v4) return v4;
    if (!value.includes(":")) return null;
    // URL's IPv6 parser is available in browsers and normalizes embedded IPv4.
    let normalized: string;
    try { normalized = new URL(`http://[${value.replace(/^\[|\]$/g, "")}]/`).hostname.replace(/^\[|\]$/g, ""); }
    catch { throw new Error("Invalid IPv6 subject alternative name."); }
    const halves = normalized.split("::");
    const left = halves[0] ? halves[0].split(":") : [];
    const right = halves[1] ? halves[1].split(":") : [];
    const groups = halves.length === 2 ? [...left, ...Array(8 - left.length - right.length).fill("0"), ...right] : left;
    if (groups.length !== 8) throw new Error("Invalid IPv6 subject alternative name.");
    return groups.flatMap((group) => [parseInt(group, 16) >> 8, parseInt(group, 16) & 255]);
}
/** Canonical DNS/IP names used by both generated DER and OpenSSL command hints. */
export function certificateSubjectAltNames(names: string[]): { type: "DNS" | "IP"; value: string; encoded: number[] }[] {
    return names.map((raw) => {
        const name = raw.trim();
        if (!name || /[\s/\\?#@\u0000-\u001f\u007f]/.test(name)) throw new Error("Subject alternative names must be DNS names or IP addresses.");
        const ip = ipAddress(name);
        if (ip) return { type: "IP" as const, value: name.replace(/^\[|\]$/g, ""), encoded: der(0x87, ip) };
        const wildcard = name.startsWith("*.") ? "*." : "";
        let ascii: string;
        try { ascii = new URL(`http://${wildcard ? name.slice(2) : name}/`).hostname; }
        catch { throw new Error("Invalid DNS subject alternative name."); }
        if (/^\d+\.\d+\.\d+\.\d+$/.test(ascii)) throw new Error("Use a complete dotted-decimal IPv4 address for an IP subject alternative name.");
        const labels = ascii.replace(/\.$/, "").split(".");
        if (ascii.length > 253 || labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) throw new Error("Invalid DNS subject alternative name.");
        const value = wildcard + ascii;
        if (value.length > 253) throw new Error("DNS subject alternative name is too long.");
        return { type: "DNS" as const, value, encoded: der(0x82, utf8(value)) };
    });
}
function sanExtension(names: ReturnType<typeof certificateSubjectAltNames>): Bytes {
    return sequence(oid("2.5.29.17"), der(0x04, sequence(...names.map((name) => name.encoded))));
}
function signatureIdentifier(algorithm: CertificateKeyAlgorithm, hash: CertificateHash): Bytes {
    if (algorithm === "Ed25519") return sequence(oid("1.3.101.112")); // parameters MUST be absent (RFC 8410)
    const suffix = { "SHA-256": "11", "SHA-384": "12", "SHA-512": "13" }[hash];
    if (algorithm === "RSA") return sequence(oid(`1.2.840.113549.1.1.${suffix}`), der(0x05, []));
    const ecSuffix = { "SHA-256": "2", "SHA-384": "3", "SHA-512": "4" }[hash];
    return sequence(oid(`1.2.840.10045.4.3.${ecSuffix}`));
}
async function generateKeys(options: CertificateKeyOptions) {
    if (!globalThis.crypto?.subtle) throw new Error("Web Crypto requires HTTPS or localhost.");
    const hash = options.hashAlgorithm ?? "SHA-256";
    if (!["SHA-256", "SHA-384", "SHA-512"].includes(hash)) throw new Error("Unsupported signature hash.");
    let keyAlgorithm: RsaHashedKeyGenParams | EcKeyGenParams | Algorithm;
    let signAlgorithm: AlgorithmIdentifier | EcdsaParams;
    if (options.keyAlgorithm === "RSA") {
        const size = options.rsaKeySize ?? 2048;
        if (![1024, 2048, 3072, 4096, 8192].includes(size)) throw new Error("Unsupported RSA key size.");
        keyAlgorithm = { name: "RSASSA-PKCS1-v1_5", modulusLength: size, publicExponent: new Uint8Array([1, 0, 1]), hash };
        signAlgorithm = "RSASSA-PKCS1-v1_5";
    } else if (options.keyAlgorithm === "ECDSA") {
        const curve = options.ecCurve ?? "P-256";
        if (!["P-256", "P-384", "P-521"].includes(curve)) throw new Error("Unsupported elliptic curve.");
        keyAlgorithm = { name: "ECDSA", namedCurve: curve };
        signAlgorithm = { name: "ECDSA", hash };
    } else if (options.keyAlgorithm === "Ed25519") {
        keyAlgorithm = { name: "Ed25519" };
        signAlgorithm = "Ed25519";
    } else throw new Error("Unsupported key algorithm.");
    let pair: CryptoKeyPair;
    try { pair = await crypto.subtle.generateKey(keyAlgorithm, true, ["sign", "verify"]) as CryptoKeyPair; }
    catch (error) {
        if (options.keyAlgorithm === "Ed25519" && error instanceof Error && error.name === "NotSupportedError") throw new Error("Ed25519 is unavailable in this browser. Choose RSA/ECDSA or use the OpenSSL command; no substitute key was generated.");
        throw error;
    }
    return { pair, signAlgorithm, identifier: signatureIdentifier(options.keyAlgorithm, hash), publicKey: bytes(await crypto.subtle.exportKey("spki", pair.publicKey)) };
}
async function signDER(value: Bytes, options: CertificateKeyOptions, keys: Awaited<ReturnType<typeof generateKeys>>): Promise<Bytes> {
    const input = new Uint8Array(value);
    const raw = await crypto.subtle.sign(keys.signAlgorithm, keys.pair.privateKey, input);
    if (!await crypto.subtle.verify(keys.signAlgorithm, keys.pair.publicKey, raw, input)) throw new Error("Generated signature failed verification.");
    const signature = bytes(raw);
    if (options.keyAlgorithm !== "ECDSA") return signature;
    if (signature.length % 2) throw new Error("Unexpected ECDSA signature encoding.");
    return sequence(integer(signature.slice(0, signature.length / 2)), integer(signature.slice(signature.length / 2)));
}
function time(value: Date): Bytes {
    const year = value.getUTCFullYear();
    if (year < 1950 || year > 9999) throw new Error("Certificate validity is outside the supported 1950–9999 range.");
    const timestamp = value.toISOString().replace(/[-:]/g, "").replace("T", "").replace(/\.\d{3}Z$/, "Z");
    return der(year < 2050 ? 0x17 : 0x18, utf8(year < 2050 ? timestamp.slice(2) : timestamp));
}
function extension(id: string, value: Bytes, critical = false): Bytes {
    return sequence(oid(id), ...(critical ? [der(0x01, [0xff])] : []), der(0x04, value));
}
function subjectPublicKeyBits(spki: Bytes): Bytes {
    function item(offset: number) {
        let start = offset + 2;
        let size = spki[offset + 1];
        if (size & 0x80) {
            const count = size & 0x7f;
            size = 0;
            for (let index = 0; index < count; index++) size = size * 256 + spki[start++];
        }
        return { start, end: start + size };
    }
    const outer = item(0);
    const algorithm = item(outer.start);
    const bits = item(algorithm.end);
    if (spki[algorithm.end] !== 0x03 || spki[bits.start] !== 0) throw new Error("Invalid generated public key encoding.");
    return spki.slice(bits.start + 1, bits.end);
}
export async function generateSelfSignedCertificate(options: CertificateGenerationOptions, now = new Date()): Promise<{ certificatePem: string; privateKeyPem: string }> {
    const subject = subjectName(options);
    const names = certificateSubjectAltNames(options.subjectAltNames);
    if (!Number.isInteger(options.validityDays) || options.validityDays < 1 || options.validityDays > 3650) throw new Error("Validity must be a whole number between 1 and 3650 days.");
    if (!Number.isFinite(now.getTime())) throw new Error("Invalid certificate start date.");
    if (options.keyUsage.keyCertSign && !options.isCA) throw new Error("Certificate signing key usage requires CA Certificate to be enabled.");
    if (options.keyAlgorithm !== "RSA" && (options.keyUsage.keyEncipherment || options.keyUsage.dataEncipherment)) throw new Error("ECDSA and Ed25519 signing keys cannot be used for key or data encipherment. Clear those key usages.");
    const validFrom = new Date(Math.floor(now.getTime() / 1000) * 1000);
    const validTo = new Date(validFrom.getTime() + options.validityDays * 86400000);
    const validity = sequence(time(validFrom), time(validTo));
    const keys = await generateKeys(options);
    const serial = Array.from(crypto.getRandomValues(new Uint8Array(20)));
    serial[0] = (serial[0] & 0x7f) || 1;
    const ski = bytes(await crypto.subtle.digest("SHA-1", new Uint8Array(subjectPublicKeyBits(keys.publicKey))));
    const extensions: Bytes[] = [
        extension("2.5.29.19", sequence(...(options.isCA ? [der(0x01, [0xff])] : [])), true),
        extension("2.5.29.14", der(0x04, ski)),
        extension("2.5.29.35", sequence(der(0x80, ski))),
    ];
    const usageBits = [options.keyUsage.digitalSignature, false, options.keyUsage.keyEncipherment, options.keyUsage.dataEncipherment, false, options.keyUsage.keyCertSign, options.keyUsage.cRLSign];
    const lastBit = usageBits.lastIndexOf(true);
    if (lastBit >= 0) {
        const value = usageBits.reduce((mask, enabled, index) => mask | (enabled ? 0x80 >> index : 0), 0);
        extensions.push(extension("2.5.29.15", der(0x03, [7 - lastBit, value]), true));
    }
    const eku = Object.entries(options.extKeyUsage).filter(([, enabled]) => enabled).map(([name]) => oid(`1.3.6.1.5.5.7.3.${({ serverAuth: 1, clientAuth: 2, codeSigning: 3, emailProtection: 4 } as Record<string, number>)[name]}`));
    if (eku.length) extensions.push(extension("2.5.29.37", sequence(...eku)));
    if (names.length) extensions.push(sanExtension(names));
    const tbs = sequence(der(0xa0, integer([2])), integer(serial), keys.identifier, subject, validity, subject, keys.publicKey, der(0xa3, sequence(...extensions)));
    const signature = await signDER(tbs, options, keys);
    const certificate = sequence(tbs, keys.identifier, bitString(signature));
    return { certificatePem: pem(certificate, "CERTIFICATE"), privateKeyPem: pem(bytes(await crypto.subtle.exportKey("pkcs8", keys.pair.privateKey)), "PRIVATE KEY") };
}
export async function generateCertificateRequest(options: CSRGenerationOptions): Promise<{ csrPem: string; privateKeyPem: string }> {
    const subject = subjectName(options);
    const names = certificateSubjectAltNames(options.subjectAltNames);
    const keys = await generateKeys(options);
    const attributes = names.length ? sequence(oid("1.2.840.113549.1.9.14"), set(sequence(sanExtension(names)))) : [];
    const info = sequence(integer([0]), subject, keys.publicKey, der(0xa0, attributes));
    const signature = await signDER(info, options, keys);
    return { csrPem: pem(sequence(info, keys.identifier, bitString(signature)), "CERTIFICATE REQUEST"), privateKeyPem: pem(bytes(await crypto.subtle.exportKey("pkcs8", keys.pair.privateKey)), "PRIVATE KEY") };
}

// Shared X.509 / ASN.1 / PEM utilities backed by node-forge.
// All certificate-related tools should use this module so we have a single,
// well-tested code path for parsing, fingerprinting, and converting between
// encodings — instead of hand-rolled regex / hex hacks.

import forge from "node-forge";

export type CertificateInput = string | Uint8Array;

export interface DistinguishedName {
    CN?: string;
    O?: string;
    OU?: string;
    C?: string;
    ST?: string;
    L?: string;
    E?: string;
    [k: string]: string | undefined;
}

export interface ParsedCertificate {
    version: number;
    serialNumber: string; // hex, no separators
    serialNumberDecimal: string;
    signatureAlgorithm: string;
    issuer: DistinguishedName;
    subject: DistinguishedName;
    notBefore: Date;
    notAfter: Date;
    isExpired: boolean;
    isSelfSigned: boolean;
    daysUntilExpiry: number;
    publicKeyAlgorithm: string;
    publicKeySize: number; // bits
    publicKeyPem: string;
    sans: string[];
    keyUsage: string[];
    extendedKeyUsage: string[];
    basicConstraints: { ca: boolean; pathLenConstraint?: number } | null;
    fingerprintSha1: string;
    fingerprintSha256: string;
    fingerprintMd5: string;
    raw: forge.pki.Certificate;
    pem: string;
    derBase64: string;
    derBytes: Uint8Array;
}

export interface ParsedCSR {
    version: number;
    subject: DistinguishedName;
    publicKeyAlgorithm: string;
    publicKeySize: number;
    sans: string[];
    signatureAlgorithm: string;
    pem: string;
}

const PEM_BLOCK_RE = /-----BEGIN ([A-Z0-9 ]+)-----[\s\S]*?-----END \1-----/g;

/**
 * Detect whether the input is PEM (starts with `-----BEGIN`), Base64-encoded
 * DER, or raw binary DER bytes, and normalize to a binary string node-forge
 * understands.
 */
export function normalizeToDer(input: CertificateInput): { der: string; pem?: string } {
    if (typeof input !== "string") {
        const der = forge.util.createBuffer(forge.util.binary.raw.encode(input)).getBytes();
        return { der };
    }
    const text = input.trim();
    if (text.includes("-----BEGIN")) {
        return { der: pemToDer(text), pem: text };
    }
    // Strip whitespace; assume base64 DER
    const cleaned = text.replace(/\s+/g, "");
    try {
        const der = forge.util.decode64(cleaned);
        return { der };
    } catch {
        throw new Error("Input is not valid PEM, base64-DER, or binary DER");
    }
}

export function pemToDer(pem: string): string {
    const m = pem.match(/-----BEGIN [^-]+-----([\s\S]*?)-----END [^-]+-----/);
    if (!m) throw new Error("PEM block not found");
    const b64 = m[1].replace(/\s+/g, "");
    return forge.util.decode64(b64);
}

export function derToPem(der: string, label: string): string {
    const b64 = forge.util.encode64(der);
    const lines = b64.match(/.{1,64}/g) ?? [];
    return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----\n`;
}

export function listPemBlocks(text: string): { label: string; body: string }[] {
    const blocks: { label: string; body: string }[] = [];
    let m: RegExpExecArray | null;
    PEM_BLOCK_RE.lastIndex = 0;
    while ((m = PEM_BLOCK_RE.exec(text)) !== null) {
        blocks.push({ label: m[1], body: m[0] });
    }
    return blocks;
}

function dnAttrsToObject(attrs: forge.pki.CertificateField[]): DistinguishedName {
    const out: DistinguishedName = {};
    for (const a of attrs) {
        const key = a.shortName || a.name;
        if (!key || a.value == null) continue;
        out[key] = String(a.value);
    }
    return out;
}

export function formatDN(dn: DistinguishedName): string {
    return Object.entries(dn)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");
}

/** Public-key bit length detector that handles RSA, EC, Ed25519. */
function detectPublicKeyInfo(cert: forge.pki.Certificate): { algorithm: string; size: number } {
    const pk = cert.publicKey as unknown as { n?: forge.jsbn.BigInteger; algorithm?: string };
    if (pk?.n) {
        return { algorithm: "RSA", size: pk.n.bitLength() };
    }
    // node-forge has limited EC support; inspect oid
    const oid = (cert as unknown as { siginfo?: { algorithmOid?: string } }).siginfo?.algorithmOid ?? "";
    if (oid.includes("1.2.840.10045")) return { algorithm: "ECDSA", size: 256 };
    if (oid.includes("1.3.101.112")) return { algorithm: "Ed25519", size: 256 };
    return { algorithm: "Unknown", size: 0 };
}

function getExtension<T = unknown>(cert: forge.pki.Certificate, oidOrName: string): T | undefined {
    const ext = cert.extensions.find((e) => e.id === oidOrName || e.name === oidOrName);
    return ext as T | undefined;
}

const KEY_USAGE_NAMES: Record<string, string> = {
    digitalSignature: "Digital Signature",
    nonRepudiation: "Non-Repudiation",
    keyEncipherment: "Key Encipherment",
    dataEncipherment: "Data Encipherment",
    keyAgreement: "Key Agreement",
    keyCertSign: "Certificate Signing",
    cRLSign: "CRL Signing",
    encipherOnly: "Encipher Only",
    decipherOnly: "Decipher Only",
};

const EXT_KEY_USAGE_NAMES: Record<string, string> = {
    serverAuth: "TLS Web Server Authentication",
    clientAuth: "TLS Web Client Authentication",
    codeSigning: "Code Signing",
    emailProtection: "Email Protection",
    timeStamping: "Time Stamping",
    OCSPSigning: "OCSP Signing",
};

/**
 * Parse an X.509 certificate from PEM, base64-DER, or raw bytes.
 * Returns rich, fully-typed metadata. Throws with a helpful message on bad input.
 */
export async function parseCertificate(input: CertificateInput): Promise<ParsedCertificate> {
    const { der, pem: maybePem } = normalizeToDer(input);
    const asn1 = forge.asn1.fromDer(der);
    const cert = forge.pki.certificateFromAsn1(asn1);

    const { algorithm: publicKeyAlgorithm, size: publicKeySize } = detectPublicKeyInfo(cert);
    const sansExt = getExtension<{ altNames?: { type: number; value: string }[] }>(cert, "subjectAltName");
    const sans = sansExt?.altNames?.map((a) => a.value) ?? [];
    const keyUsageExt = getExtension<Record<string, boolean>>(cert, "keyUsage");
    const keyUsage = keyUsageExt
        ? Object.keys(KEY_USAGE_NAMES)
              .filter((k) => keyUsageExt[k])
              .map((k) => KEY_USAGE_NAMES[k])
        : [];
    const ekuExt = getExtension<{ serverAuth?: boolean; clientAuth?: boolean; codeSigning?: boolean; emailProtection?: boolean; timeStamping?: boolean; OCSPSigning?: boolean }>(
        cert,
        "extKeyUsage"
    );
    const extendedKeyUsage = ekuExt
        ? Object.keys(EXT_KEY_USAGE_NAMES)
              .filter((k) => (ekuExt as Record<string, boolean>)[k])
              .map((k) => EXT_KEY_USAGE_NAMES[k])
        : [];
    const bcExt = getExtension<{ cA?: boolean; pathLenConstraint?: number }>(cert, "basicConstraints");
    const basicConstraints = bcExt ? { ca: !!bcExt.cA, pathLenConstraint: bcExt.pathLenConstraint } : null;

    // Fingerprints over the DER bytes
    const derBytes = new Uint8Array(forge.util.binary.raw.decode(der));
    const fingerprintSha256 = await digestHex(derBytes, "SHA-256");
    const fingerprintSha1 = await digestHex(derBytes, "SHA-1");
    const fingerprintMd5 = forge.md.md5
        .create()
        .update(der)
        .digest()
        .toHex()
        .toUpperCase()
        .replace(/(.{2})(?=.)/g, "$1:");

    const issuer = dnAttrsToObject(cert.issuer.attributes);
    const subject = dnAttrsToObject(cert.subject.attributes);
    const isSelfSigned = formatDN(issuer) === formatDN(subject);
    const now = Date.now();
    const daysUntilExpiry = Math.floor((cert.validity.notAfter.getTime() - now) / 86400000);

    const pem = maybePem ?? derToPem(der, "CERTIFICATE");

    return {
        version: cert.version + 1, // forge stores 0-indexed
        serialNumber: cert.serialNumber.toUpperCase().replace(/(.{2})(?=.)/g, "$1:"),
        serialNumberDecimal: forge.jsbn.BigInteger
            ? new forge.jsbn.BigInteger(cert.serialNumber, 16).toString(10)
            : cert.serialNumber,
        signatureAlgorithm: oidToFriendly(cert.signatureOid),
        issuer,
        subject,
        notBefore: cert.validity.notBefore,
        notAfter: cert.validity.notAfter,
        isExpired: cert.validity.notAfter.getTime() < now,
        isSelfSigned,
        daysUntilExpiry,
        publicKeyAlgorithm,
        publicKeySize,
        publicKeyPem: forge.pki.publicKeyToPem(cert.publicKey),
        sans,
        keyUsage,
        extendedKeyUsage,
        basicConstraints,
        fingerprintSha1,
        fingerprintSha256,
        fingerprintMd5,
        raw: cert,
        pem,
        derBase64: forge.util.encode64(der),
        derBytes,
    };
}

async function digestHex(bytes: Uint8Array, algo: "SHA-1" | "SHA-256"): Promise<string> {
    // Use a fresh ArrayBuffer copy to satisfy SubtleCrypto's BufferSource type
    const buf = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buf).set(bytes);
    const hashBuf = await crypto.subtle.digest(algo, buf);
    return Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
        .join(":");
}

const FRIENDLY_OIDS: Record<string, string> = {
    "1.2.840.113549.1.1.5": "SHA-1 with RSA",
    "1.2.840.113549.1.1.11": "SHA-256 with RSA",
    "1.2.840.113549.1.1.12": "SHA-384 with RSA",
    "1.2.840.113549.1.1.13": "SHA-512 with RSA",
    "1.2.840.10045.4.3.2": "ECDSA with SHA-256",
    "1.2.840.10045.4.3.3": "ECDSA with SHA-384",
    "1.2.840.10045.4.3.4": "ECDSA with SHA-512",
    "1.3.101.112": "Ed25519",
};

function oidToFriendly(oid: string | undefined): string {
    if (!oid) return "Unknown";
    return FRIENDLY_OIDS[oid] ?? oid;
}

/** Parse a PKCS#10 CSR (base64-DER or PEM). */
export function parseCSR(input: CertificateInput): ParsedCSR {
    const { der } = normalizeToDer(input);
    const csr = forge.pki.certificationRequestFromAsn1(forge.asn1.fromDer(der));
    const subject = dnAttrsToObject(csr.subject.attributes);
    let publicKeyAlgorithm = "Unknown";
    let publicKeySize = 0;
    const pk = csr.publicKey as unknown as { n?: forge.jsbn.BigInteger };
    if (pk?.n) {
        publicKeyAlgorithm = "RSA";
        publicKeySize = pk.n.bitLength();
    }
    let sans: string[] = [];
    const reqAttrs = (csr as unknown as { attributes?: forge.pki.CertificateField[] }).attributes ?? [];
    for (const a of reqAttrs) {
        if (a.name === "extensionRequest" && Array.isArray((a as unknown as { extensions?: { name: string; altNames?: { value: string }[] }[] }).extensions)) {
            const exts = (a as unknown as { extensions: { name: string; altNames?: { value: string }[] }[] }).extensions;
            for (const e of exts) {
                if (e.name === "subjectAltName" && e.altNames) {
                    sans = e.altNames.map((n) => n.value);
                }
            }
        }
    }
    return {
        version: 1,
        subject,
        publicKeyAlgorithm,
        publicKeySize,
        sans,
        signatureAlgorithm: oidToFriendly(csr.signatureOid ?? undefined),
        pem: forge.pki.certificationRequestToPem(csr),
    };
}

/** Convert PEM ↔ DER ↔ base64-DER. */
export function convertCertificate(
    input: CertificateInput,
    target: "pem" | "der-base64" | "der-bytes"
): string | Uint8Array {
    const { der } = normalizeToDer(input);
    if (target === "der-bytes") {
        return new Uint8Array(forge.util.binary.raw.decode(der));
    }
    if (target === "der-base64") {
        return forge.util.encode64(der);
    }
    return derToPem(der, "CERTIFICATE");
}

/**
 * Read a PKCS#12 (.pfx / .p12) keystore.
 * Returns the certificates, the (optional) private key, and any chain certs.
 */
export interface Pkcs12Bundle {
    certificate?: ParsedCertificate;
    privateKeyPem?: string;
    chain: ParsedCertificate[];
    friendlyName?: string;
}

export async function readPkcs12(bytes: Uint8Array, password: string): Promise<Pkcs12Bundle> {
    const der = forge.util.createBuffer(forge.util.binary.raw.encode(bytes)).getBytes();
    const asn1 = forge.asn1.fromDer(der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(asn1, false, password);

    const bundle: Pkcs12Bundle = { chain: [] };

    // Cert bag
    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const certs = certBags[forge.pki.oids.certBag] ?? [];
    if (certs.length > 0) {
        const certPem = forge.pki.certificateToPem(certs[0].cert!);
        bundle.certificate = await parseCertificate(certPem);
        bundle.friendlyName = certs[0].attributes?.friendlyName?.[0];
        for (let i = 1; i < certs.length; i++) {
            bundle.chain.push(await parseCertificate(forge.pki.certificateToPem(certs[i].cert!)));
        }
    }

    // Key bag (encrypted or unencrypted)
    const pkcs8 = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
    const keyBag = pkcs8[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0];
    if (keyBag?.key) {
        bundle.privateKeyPem = forge.pki.privateKeyToPem(keyBag.key);
    } else {
        const keyBags2 = p12.getBags({ bagType: forge.pki.oids.keyBag });
        const k2 = keyBags2[forge.pki.oids.keyBag]?.[0];
        if (k2?.key) bundle.privateKeyPem = forge.pki.privateKeyToPem(k2.key);
    }

    return bundle;
}

/**
 * Build a PKCS#12 (.pfx / .p12) keystore from a certificate, private key,
 * optional chain, and password. Returns raw bytes for download.
 */
export function createPkcs12(opts: {
    certificatePem: string;
    privateKeyPem: string;
    chainPems?: string[];
    password: string;
    friendlyName?: string;
}): Uint8Array {
    const cert = forge.pki.certificateFromPem(opts.certificatePem);
    const key = forge.pki.privateKeyFromPem(opts.privateKeyPem);
    const chain = (opts.chainPems ?? []).map((p) => forge.pki.certificateFromPem(p));
    const p12Asn1 = forge.pkcs12.toPkcs12Asn1(key, [cert, ...chain], opts.password, {
        friendlyName: opts.friendlyName ?? "mydevtools",
        algorithm: "3des",
    });
    const der = forge.asn1.toDer(p12Asn1).getBytes();
    return new Uint8Array(forge.util.binary.raw.decode(der));
}

/**
 * Validate a chain — verify that each cert in the array is signed by the next one.
 * Returns issues found (empty array = valid).
 */
export interface ChainValidationResult {
    valid: boolean;
    issues: string[];
    chain: ParsedCertificate[];
}

export async function validateChain(pemBlocks: string[]): Promise<ChainValidationResult> {
    const issues: string[] = [];
    if (pemBlocks.length === 0) {
        return { valid: false, issues: ["No certificates provided"], chain: [] };
    }
    const parsed = await Promise.all(pemBlocks.map((p) => parseCertificate(p)));
    for (let i = 0; i < parsed.length - 1; i++) {
        const child = parsed[i];
        const parent = parsed[i + 1];
        const childDN = formatDN(child.issuer);
        const parentDN = formatDN(parent.subject);
        if (childDN !== parentDN) {
            issues.push(
                `Cert #${i + 1} issuer (${childDN}) does not match cert #${i + 2} subject (${parentDN})`
            );
        }
        try {
            const verified = parent.raw.verify(child.raw);
            if (!verified) issues.push(`Cert #${i + 1} signature failed to verify against cert #${i + 2}`);
        } catch (e) {
            issues.push(`Cert #${i + 1} signature verification error: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
    // Last cert should be self-signed (root) — informational
    const last = parsed[parsed.length - 1];
    if (!last.isSelfSigned) {
        issues.push(`Top of chain is not self-signed — root CA may be missing`);
    }
    // Expiry check
    parsed.forEach((c, i) => {
        if (c.isExpired) issues.push(`Cert #${i + 1} (${c.subject.CN ?? "?"}) is expired`);
    });
    return { valid: issues.length === 0, issues, chain: parsed };
}

/** Compute SHA-1, SHA-256, MD5 fingerprints of any X.509 certificate input. */
export async function fingerprint(input: CertificateInput): Promise<{
    sha1: string;
    sha256: string;
    md5: string;
}> {
    const { der } = normalizeToDer(input);
    const bytes = new Uint8Array(forge.util.binary.raw.decode(der));
    const sha1 = await digestHex(bytes, "SHA-1");
    const sha256 = await digestHex(bytes, "SHA-256");
    const md5 = forge.md.md5
        .create()
        .update(der)
        .digest()
        .toHex()
        .toUpperCase()
        .replace(/(.{2})(?=.)/g, "$1:");
    return { sha1, sha256, md5 };
}

/** Helper to download a Uint8Array as a file. */
export function downloadBytes(bytes: Uint8Array, filename: string, mime = "application/octet-stream") {
    const blob = new Blob([new Uint8Array(bytes)], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

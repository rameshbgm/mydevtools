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
    serialNumber: string; // hex, colon-separated
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
    raw: forge.pki.Certificate | null; // null for non-RSA certs (forge limitation)
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

export function normalizeToDer(input: CertificateInput): { der: string; pem?: string } {
    if (typeof input !== "string") {
        const der = forge.util.createBuffer(forge.util.binary.raw.encode(input)).getBytes();
        return { der };
    }
    const text = input.trim();
    if (text.includes("-----BEGIN")) {
        return { der: pemToDer(text), pem: text };
    }
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

// ─── ASN.1 tree helpers ───────────────────────────────────────────────────────

// OID → short attribute name for DN parsing
const DN_OID_MAP: Record<string, string> = {
    "2.5.4.3": "CN",
    "2.5.4.4": "SN",
    "2.5.4.5": "serialNumber",
    "2.5.4.6": "C",
    "2.5.4.7": "L",
    "2.5.4.8": "ST",
    "2.5.4.9": "street",
    "2.5.4.10": "O",
    "2.5.4.11": "OU",
    "2.5.4.12": "title",
    "2.5.4.42": "GN",
    "2.5.4.43": "initials",
    "1.2.840.113549.1.9.1": "E",
    "0.9.2342.19200300.100.1.25": "DC",
};

// CONTEXT_SPECIFIC class value in forge
const CTX = forge.asn1.Class.CONTEXT_SPECIFIC; // === 2

function parseDN(nameAsn1: forge.asn1.Asn1): DistinguishedName {
    const dn: DistinguishedName = {};
    const rdns = nameAsn1.value as forge.asn1.Asn1[];
    for (const rdn of rdns) {
        const atvSet = rdn.value as forge.asn1.Asn1[];
        for (const atv of atvSet) {
            try {
                const atvParts = atv.value as forge.asn1.Asn1[];
                const oid = forge.asn1.derToOid(atvParts[0].value as string);
                const value = atvParts[1].value as string;
                const short = DN_OID_MAP[oid] ?? oid;
                dn[short] = value;
            } catch { /* skip unparseable attribute */ }
        }
    }
    return dn;
}

function parseTime(asn1: forge.asn1.Asn1): Date {
    const str = asn1.value as string;
    if (asn1.type === forge.asn1.Type.UTCTIME) {
        const yy = parseInt(str.slice(0, 2), 10);
        const year = yy >= 50 ? 1900 + yy : 2000 + yy;
        return new Date(`${year}-${str.slice(2, 4)}-${str.slice(4, 6)}T${str.slice(6, 8)}:${str.slice(8, 10)}:${str.slice(10, 12)}Z`);
    }
    // GeneralizedTime
    return new Date(`${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}T${str.slice(8, 10)}:${str.slice(10, 12)}:${str.slice(12, 14)}Z`);
}

function parseExtensions(extsSeq: forge.asn1.Asn1): {
    sans: string[];
    keyUsage: string[];
    extendedKeyUsage: string[];
    basicConstraints: { ca: boolean; pathLenConstraint?: number } | null;
} {
    const SAN_OID = "2.5.29.17";
    const KU_OID  = "2.5.29.15";
    const EKU_OID = "2.5.29.37";
    const BC_OID  = "2.5.29.19";
    const EKU_NAMES: Record<string, string> = {
        "1.3.6.1.5.5.7.3.1": "TLS Web Server Authentication",
        "1.3.6.1.5.5.7.3.2": "TLS Web Client Authentication",
        "1.3.6.1.5.5.7.3.3": "Code Signing",
        "1.3.6.1.5.5.7.3.4": "Email Protection",
        "1.3.6.1.5.5.7.3.8": "Time Stamping",
        "1.3.6.1.5.5.7.3.9": "OCSP Signing",
    };

    const sans: string[] = [];
    let keyUsage: string[] = [];
    const extendedKeyUsage: string[] = [];
    let basicConstraints: { ca: boolean; pathLenConstraint?: number } | null = null;

    const extensions = extsSeq.value as forge.asn1.Asn1[];
    for (const ext of extensions) {
        try {
            const extParts = ext.value as forge.asn1.Asn1[];
            const oid = forge.asn1.derToOid(extParts[0].value as string);
            // Last element is the OCTET STRING wrapping the extension value
            const octetVal = extParts[extParts.length - 1].value as string;
            const extValue = forge.asn1.fromDer(octetVal);

            if (oid === SAN_OID) {
                const gnames = extValue.value as forge.asn1.Asn1[];
                for (const gn of gnames) {
                    let val = gn.value as string;
                    if (gn.type === 7) {
                        // iPAddress: 4 bytes = IPv4, 16 bytes = IPv6
                        if (val.length === 4) {
                            val = Array.from(val).map(c => c.charCodeAt(0)).join(".");
                        } else if (val.length === 16) {
                            val = Array.from({ length: 8 }, (_, i) => {
                                const hi = val.charCodeAt(i * 2).toString(16).padStart(2, "0");
                                const lo = val.charCodeAt(i * 2 + 1).toString(16).padStart(2, "0");
                                return hi + lo;
                            }).join(":");
                        }
                    }
                    if (typeof val === "string" && val) sans.push(val);
                }
            }

            if (oid === KU_OID) {
                // BIT STRING: value[0] = unused bits, value[1..] = key usage bytes
                const bits = extValue.value as string;
                const b0 = bits.charCodeAt(1) || 0;
                const b1 = bits.length > 2 ? bits.charCodeAt(2) : 0;
                const KU_FLAGS: [number, number, string][] = [
                    [b0, 0x80, "Digital Signature"],
                    [b0, 0x40, "Non-Repudiation"],
                    [b0, 0x20, "Key Encipherment"],
                    [b0, 0x10, "Data Encipherment"],
                    [b0, 0x08, "Key Agreement"],
                    [b0, 0x04, "Certificate Signing"],
                    [b0, 0x02, "CRL Signing"],
                    [b0, 0x01, "Encipher Only"],
                    [b1, 0x80, "Decipher Only"],
                ];
                keyUsage = KU_FLAGS.filter(([byte, mask]) => byte & mask).map(([,, name]) => name);
            }

            if (oid === EKU_OID) {
                const ekuOids = extValue.value as forge.asn1.Asn1[];
                for (const e of ekuOids) {
                    try {
                        const ekuStr = forge.asn1.derToOid(e.value as string);
                        extendedKeyUsage.push(EKU_NAMES[ekuStr] ?? ekuStr);
                    } catch { /* skip */ }
                }
            }

            if (oid === BC_OID) {
                const bcParts = extValue.value as forge.asn1.Asn1[];
                let ca = false;
                let pathLen: number | undefined;
                for (const part of bcParts) {
                    if ((part.type as number) === 1 /* BOOLEAN */) {
                        ca = (part.value as string).charCodeAt(0) !== 0;
                    } else if ((part.type as number) === 2 /* INTEGER */) {
                        pathLen = (part.value as string).charCodeAt(0);
                    }
                }
                basicConstraints = { ca, pathLenConstraint: pathLen };
            }
        } catch { /* skip unparseable extension */ }
    }

    return { sans, keyUsage, extendedKeyUsage, basicConstraints };
}

/** Navigate to the SubjectPublicKeyInfo ASN.1 node inside a parsed Certificate. */
function getSpkiAsn1(certAsn1: forge.asn1.Asn1): forge.asn1.Asn1 {
    const tbsCert = certAsn1.value[0] as forge.asn1.Asn1;
    const children = tbsCert.value as forge.asn1.Asn1[];
    const firstChild = children[0] as forge.asn1.Asn1;
    // version [0] EXPLICIT is context-specific tag 0
    const spkiIndex = (firstChild.tagClass === CTX && (firstChild.type as number) === 0) ? 6 : 5;
    return children[spkiIndex] as forge.asn1.Asn1;
}

/** Extract the SubjectPublicKeyInfo as a "PUBLIC KEY" PEM — works for RSA, EC, Ed25519. */
function extractSpkiPem(certAsn1: forge.asn1.Asn1): string {
    const spki = getSpkiAsn1(certAsn1);
    const spkiDer = forge.asn1.toDer(spki).getBytes();
    return derToPem(spkiDer, "PUBLIC KEY");
}

/** Detect public key algorithm and bit size from the SPKI OID, not from the signature algorithm. */
function detectPublicKeyInfo(
    cert: forge.pki.Certificate | null,
    certAsn1: forge.asn1.Asn1
): { algorithm: string; size: number } {
    // RSA: forge successfully parsed the key, use it directly
    if (cert) {
        const pk = cert.publicKey as unknown as { n?: forge.jsbn.BigInteger };
        if (pk?.n) return { algorithm: "RSA", size: pk.n.bitLength() };
    }

    // Non-RSA: read the SPKI algorithm OID from the ASN.1 tree
    try {
        const spki = getSpkiAsn1(certAsn1);
        const algSeq = spki.value[0] as forge.asn1.Asn1;
        const algParts = algSeq.value as forge.asn1.Asn1[];
        const algOid = forge.asn1.derToOid(algParts[0].value as string);

        if (algOid === "1.2.840.10045.2.1") {
            // ecPublicKey — get named curve from parameters
            try {
                const curveOid = forge.asn1.derToOid(algParts[1].value as string);
                const CURVES: Record<string, { name: string; size: number }> = {
                    "1.2.840.10045.3.1.7": { name: "P-256", size: 256 },
                    "1.3.132.0.34":        { name: "P-384", size: 384 },
                    "1.3.132.0.35":        { name: "P-521", size: 521 },
                };
                const c = CURVES[curveOid];
                return { algorithm: `ECDSA (${c?.name ?? curveOid})`, size: c?.size ?? 0 };
            } catch {
                return { algorithm: "ECDSA", size: 0 };
            }
        }
        if (algOid === "1.3.101.112") return { algorithm: "Ed25519", size: 256 };
        if (algOid === "1.3.101.113") return { algorithm: "Ed448",   size: 448 };
        if (algOid === "1.2.840.113549.1.1.1") return { algorithm: "RSA", size: 0 };
        return { algorithm: algOid, size: 0 };
    } catch {
        return { algorithm: "Unknown", size: 0 };
    }
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

// ─── OID → friendly name ─────────────────────────────────────────────────────

const FRIENDLY_OIDS: Record<string, string> = {
    "1.2.840.113549.1.1.5":  "SHA-1 with RSA",
    "1.2.840.113549.1.1.11": "SHA-256 with RSA",
    "1.2.840.113549.1.1.12": "SHA-384 with RSA",
    "1.2.840.113549.1.1.13": "SHA-512 with RSA",
    "1.2.840.10045.4.3.2":   "ECDSA with SHA-256",
    "1.2.840.10045.4.3.3":   "ECDSA with SHA-384",
    "1.2.840.10045.4.3.4":   "ECDSA with SHA-512",
    "1.3.101.112":           "Ed25519",
    "1.3.101.113":           "Ed448",
};

function oidToFriendly(oid: string | undefined): string {
    if (!oid) return "Unknown";
    return FRIENDLY_OIDS[oid] ?? oid;
}

async function digestHex(bytes: Uint8Array, algo: "SHA-1" | "SHA-256"): Promise<string> {
    const buf = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buf).set(bytes);
    const hashBuf = await crypto.subtle.digest(algo, buf);
    return Array.from(new Uint8Array(hashBuf))
        .map(b => b.toString(16).padStart(2, "0").toUpperCase())
        .join(":");
}

// ─── parseCertificate ─────────────────────────────────────────────────────────

/**
 * Parse an X.509 certificate from PEM, base64-DER, or raw bytes.
 * Supports RSA, ECDSA (P-256/P-384/P-521), and Ed25519 certificates.
 */
export async function parseCertificate(input: CertificateInput): Promise<ParsedCertificate> {
    const { der, pem: maybePem } = normalizeToDer(input);
    const asn1 = forge.asn1.fromDer(der);
    const derBytes = new Uint8Array(forge.util.binary.raw.decode(der));

    // Try RSA path (forge gives us a full Certificate object)
    let forgeCert: forge.pki.Certificate | null = null;
    try {
        forgeCert = forge.pki.certificateFromAsn1(asn1);
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!msg.includes("OID is not RSA") && !msg.includes("Cannot read public key")) {
            throw e; // unexpected error — rethrow
        }
        // Non-RSA cert — will parse manually below
    }

    return forgeCert
        ? buildFromForgeCert(forgeCert, asn1, der, derBytes, maybePem)
        : buildFromAsn1(asn1, der, derBytes, maybePem);
}

async function buildFromForgeCert(
    cert: forge.pki.Certificate,
    asn1: forge.asn1.Asn1,
    der: string,
    derBytes: Uint8Array,
    maybePem?: string
): Promise<ParsedCertificate> {
    const { algorithm: publicKeyAlgorithm, size: publicKeySize } = detectPublicKeyInfo(cert, asn1);

    const sansExt = getExtension<{ altNames?: { type: number; value: string }[] }>(cert, "subjectAltName");
    const sans = sansExt?.altNames?.map(a => a.value) ?? [];
    const keyUsageExt = getExtension<Record<string, boolean>>(cert, "keyUsage");
    const keyUsage = keyUsageExt
        ? Object.keys(KEY_USAGE_NAMES).filter(k => keyUsageExt[k]).map(k => KEY_USAGE_NAMES[k])
        : [];
    const ekuExt = getExtension<Record<string, boolean>>(cert, "extKeyUsage");
    const extendedKeyUsage = ekuExt
        ? Object.keys(EXT_KEY_USAGE_NAMES).filter(k => ekuExt[k]).map(k => EXT_KEY_USAGE_NAMES[k])
        : [];
    const bcExt = getExtension<{ cA?: boolean; pathLenConstraint?: number }>(cert, "basicConstraints");
    const basicConstraints = bcExt ? { ca: !!bcExt.cA, pathLenConstraint: bcExt.pathLenConstraint } : null;

    const fingerprintSha256 = await digestHex(derBytes, "SHA-256");
    const fingerprintSha1   = await digestHex(derBytes, "SHA-1");
    const fingerprintMd5    = forge.md.md5.create().update(der).digest().toHex()
        .toUpperCase().replace(/(.{2})(?=.)/g, "$1:");

    const issuer  = dnAttrsToObject(cert.issuer.attributes);
    const subject = dnAttrsToObject(cert.subject.attributes);
    const isSelfSigned = formatDN(issuer) === formatDN(subject);
    const now = Date.now();
    const pem = maybePem ?? derToPem(der, "CERTIFICATE");

    // Try forge's publicKeyToPem first (RSA), fall back to SPKI extraction (EC/Ed)
    let publicKeyPem: string;
    try {
        publicKeyPem = forge.pki.publicKeyToPem(cert.publicKey);
    } catch {
        publicKeyPem = extractSpkiPem(asn1);
    }

    return {
        version: cert.version + 1,
        serialNumber: cert.serialNumber.toUpperCase().replace(/(.{2})(?=.)/g, "$1:"),
        serialNumberDecimal: new forge.jsbn.BigInteger(cert.serialNumber, 16).toString(10),
        signatureAlgorithm: oidToFriendly(cert.signatureOid),
        issuer,
        subject,
        notBefore: cert.validity.notBefore,
        notAfter:  cert.validity.notAfter,
        isExpired: cert.validity.notAfter.getTime() < now,
        isSelfSigned,
        daysUntilExpiry: Math.floor((cert.validity.notAfter.getTime() - now) / 86400000),
        publicKeyAlgorithm,
        publicKeySize,
        publicKeyPem,
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

/** Manual parse path for non-RSA certificates (ECDSA, Ed25519, Ed448). */
async function buildFromAsn1(
    asn1: forge.asn1.Asn1,
    der: string,
    derBytes: Uint8Array,
    maybePem?: string
): Promise<ParsedCertificate> {
    const tbsCert = asn1.value[0] as forge.asn1.Asn1;
    const children = tbsCert.value as forge.asn1.Asn1[];
    let idx = 0;

    // version [0] EXPLICIT INTEGER (optional)
    let version = 0;
    const firstChild = children[0] as forge.asn1.Asn1;
    if (firstChild.tagClass === CTX && (firstChild.type as number) === 0) {
        const versionInt = (firstChild.value as forge.asn1.Asn1[])[0];
        version = (versionInt.value as string).charCodeAt(0);
        idx++;
    }

    // serialNumber INTEGER
    const serialNode = children[idx++];
    const serialHex = forge.util.createBuffer(serialNode.value as string).toHex().toUpperCase();
    const serialFormatted = serialHex.replace(/(.{2})(?=.)/g, "$1:");
    let serialDecimal = "0";
    try { serialDecimal = BigInt("0x" + (serialHex || "0")).toString(10); } catch { /* ignore */ }

    // signature AlgorithmIdentifier
    const sigAlgSeq = children[idx++];
    const sigAlgParts = sigAlgSeq.value as forge.asn1.Asn1[];
    const signatureOid = forge.asn1.derToOid(sigAlgParts[0].value as string);

    // issuer Name
    const issuer = parseDN(children[idx++]);

    // validity
    const validitySeq = children[idx++];
    const validityParts = validitySeq.value as forge.asn1.Asn1[];
    const notBefore = parseTime(validityParts[0]);
    const notAfter  = parseTime(validityParts[1]);

    // subject Name
    const subject = parseDN(children[idx++]);

    // subjectPublicKeyInfo — skip, handled by detectPublicKeyInfo via getSpkiAsn1
    idx++; // skip spki node (already accessed via getSpkiAsn1)

    // extensions [3] EXPLICIT
    let sans: string[] = [];
    let keyUsage: string[] = [];
    let extendedKeyUsage: string[] = [];
    let basicConstraints: { ca: boolean; pathLenConstraint?: number } | null = null;

    while (idx < children.length) {
        const child = children[idx] as forge.asn1.Asn1;
        if (child.tagClass === CTX && (child.type as number) === 3) {
            const extsSeq = (child.value as forge.asn1.Asn1[])[0];
            const parsed = parseExtensions(extsSeq);
            sans = parsed.sans;
            keyUsage = parsed.keyUsage;
            extendedKeyUsage = parsed.extendedKeyUsage;
            basicConstraints = parsed.basicConstraints;
        }
        idx++;
    }

    const { algorithm: publicKeyAlgorithm, size: publicKeySize } = detectPublicKeyInfo(null, asn1);
    const publicKeyPem = extractSpkiPem(asn1);

    const fingerprintSha256 = await digestHex(derBytes, "SHA-256");
    const fingerprintSha1   = await digestHex(derBytes, "SHA-1");
    const fingerprintMd5    = forge.md.md5.create().update(der).digest().toHex()
        .toUpperCase().replace(/(.{2})(?=.)/g, "$1:");

    const isSelfSigned = formatDN(issuer) === formatDN(subject);
    const now = Date.now();
    const pem = maybePem ?? derToPem(der, "CERTIFICATE");

    return {
        version: version + 1,
        serialNumber: serialFormatted,
        serialNumberDecimal: serialDecimal,
        signatureAlgorithm: oidToFriendly(signatureOid),
        issuer,
        subject,
        notBefore,
        notAfter,
        isExpired: notAfter.getTime() < now,
        isSelfSigned,
        daysUntilExpiry: Math.floor((notAfter.getTime() - now) / 86400000),
        publicKeyAlgorithm,
        publicKeySize,
        publicKeyPem,
        sans,
        keyUsage,
        extendedKeyUsage,
        basicConstraints,
        fingerprintSha1,
        fingerprintSha256,
        fingerprintMd5,
        raw: null, // forge cannot parse non-RSA certs
        pem,
        derBase64: forge.util.encode64(der),
        derBytes,
    };
}

// ─── Chain validation ─────────────────────────────────────────────────────────

const KEY_USAGE_NAMES: Record<string, string> = {
    digitalSignature: "Digital Signature",
    nonRepudiation:   "Non-Repudiation",
    keyEncipherment:  "Key Encipherment",
    dataEncipherment: "Data Encipherment",
    keyAgreement:     "Key Agreement",
    keyCertSign:      "Certificate Signing",
    cRLSign:          "CRL Signing",
    encipherOnly:     "Encipher Only",
    decipherOnly:     "Decipher Only",
};

const EXT_KEY_USAGE_NAMES: Record<string, string> = {
    serverAuth:      "TLS Web Server Authentication",
    clientAuth:      "TLS Web Client Authentication",
    codeSigning:     "Code Signing",
    emailProtection: "Email Protection",
    timeStamping:    "Time Stamping",
    OCSPSigning:     "OCSP Signing",
};

function getExtension<T = unknown>(cert: forge.pki.Certificate, oidOrName: string): T | undefined {
    const ext = cert.extensions.find(e => e.id === oidOrName || e.name === oidOrName);
    return ext as T | undefined;
}

/** Convert a DER-encoded ECDSA signature (SEQUENCE { INTEGER r, INTEGER s }) to raw r‖s bytes. */
function derEcdsaToRaw(sig: Uint8Array, namedCurve: string): Uint8Array {
    const sizeMap: Record<string, number> = { "P-256": 32, "P-384": 48, "P-521": 66 };
    const size = sizeMap[namedCurve] ?? 32;

    let offset = 0;
    if (sig[offset++] !== 0x30) throw new Error("Expected DER SEQUENCE for ECDSA signature");
    // Length — handle multi-byte lengths
    if (sig[offset] & 0x80) {
        offset += (sig[offset] & 0x7f) + 1;
    } else {
        offset++;
    }

    function readInt(): Uint8Array {
        if (sig[offset++] !== 0x02) throw new Error("Expected DER INTEGER");
        let len = sig[offset++];
        if (len & 0x80) {
            const nBytes = len & 0x7f;
            len = 0;
            for (let i = 0; i < nBytes; i++) len = (len << 8) | sig[offset++];
        }
        const val = sig.slice(offset, offset + len);
        offset += len;
        return val[0] === 0 ? val.slice(1) : val; // strip DER positive-integer leading 0x00
    }

    const r = readInt();
    const s = readInt();
    const result = new Uint8Array(size * 2);
    result.set(r, size - r.length);
    result.set(s, size * 2 - s.length);
    return result;
}

/** Verify a certificate's signature using Web Crypto (supports ECDSA and Ed25519). */
async function verifyWithWebCrypto(
    child: ParsedCertificate,
    parent: ParsedCertificate
): Promise<boolean> {
    const childDer  = normalizeToDer(child.pem).der;
    const parentDer = normalizeToDer(parent.pem).der;
    const childAsn1  = forge.asn1.fromDer(childDer);
    const parentAsn1 = forge.asn1.fromDer(parentDer);

    // TBSCertificate DER — the bytes that were signed
    const tbsCertDer   = forge.asn1.toDer(childAsn1.value[0] as forge.asn1.Asn1).getBytes();
    const tbsCertBytes = new Uint8Array(forge.util.binary.raw.decode(tbsCertDer));

    // Signature BIT STRING: first byte = unused bits count, rest = sig bytes
    const sigBitStr = (childAsn1.value[2] as forge.asn1.Asn1).value as string;
    const sigBytes  = new Uint8Array(forge.util.binary.raw.decode(sigBitStr.slice(1)));

    // Signature algorithm OID (from the signatureAlgorithm field, index 1)
    const sigAlgParts = (childAsn1.value[1] as forge.asn1.Asn1).value as forge.asn1.Asn1[];
    const sigAlgOid   = forge.asn1.derToOid(sigAlgParts[0].value as string);

    // Parent's SubjectPublicKeyInfo bytes
    const parentSpki      = getSpkiAsn1(parentAsn1);
    const parentSpkiDer   = new Uint8Array(forge.util.binary.raw.decode(forge.asn1.toDer(parentSpki).getBytes()));
    const parentAlgParts  = (parentSpki.value[0] as forge.asn1.Asn1).value as forge.asn1.Asn1[];
    const parentPkAlgOid  = forge.asn1.derToOid(parentAlgParts[0].value as string);

    // ECDSA
    if (parentPkAlgOid === "1.2.840.10045.2.1") {
        const curveOid = forge.asn1.derToOid(parentAlgParts[1].value as string);
        const CURVE_MAP: Record<string, string> = {
            "1.2.840.10045.3.1.7": "P-256",
            "1.3.132.0.34":        "P-384",
            "1.3.132.0.35":        "P-521",
        };
        const HASH_MAP: Record<string, string> = {
            "1.2.840.10045.4.3.2": "SHA-256",
            "1.2.840.10045.4.3.3": "SHA-384",
            "1.2.840.10045.4.3.4": "SHA-512",
        };
        const namedCurve = CURVE_MAP[curveOid] ?? "P-256";
        const hash       = HASH_MAP[sigAlgOid]  ?? "SHA-256";

        const pubKey = await crypto.subtle.importKey(
            "spki", parentSpkiDer, { name: "ECDSA", namedCurve }, false, ["verify"]
        );
        const rawSig = derEcdsaToRaw(sigBytes, namedCurve);
        return crypto.subtle.verify({ name: "ECDSA", hash }, pubKey, rawSig.buffer as ArrayBuffer, tbsCertBytes.buffer as ArrayBuffer);
    }

    // Ed25519
    if (parentPkAlgOid === "1.3.101.112") {
        const pubKey = await crypto.subtle.importKey(
            "spki", parentSpkiDer, { name: "Ed25519" }, false, ["verify"]
        );
        return crypto.subtle.verify({ name: "Ed25519" }, pubKey, sigBytes.buffer as ArrayBuffer, tbsCertBytes.buffer as ArrayBuffer);
    }

    throw new Error(`Unsupported public key algorithm OID: ${parentPkAlgOid}`);
}

/** Verify child is signed by parent — tries forge (RSA) then Web Crypto (ECDSA/Ed25519). */
async function verifySignature(child: ParsedCertificate, parent: ParsedCertificate): Promise<boolean> {
    if (child.raw && parent.raw) {
        try {
            return parent.raw.verify(child.raw);
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            if (!msg.includes("OID is not RSA") && !msg.includes("Cannot read public key")) {
                throw e;
            }
        }
    }
    return verifyWithWebCrypto(child, parent);
}

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
    const parsed = await Promise.all(pemBlocks.map(p => parseCertificate(p)));
    for (let i = 0; i < parsed.length - 1; i++) {
        const child  = parsed[i];
        const parent = parsed[i + 1];
        const childDN  = formatDN(child.issuer);
        const parentDN = formatDN(parent.subject);
        if (childDN !== parentDN) {
            issues.push(`Cert #${i + 1} issuer (${childDN}) does not match cert #${i + 2} subject (${parentDN})`);
        }
        try {
            const verified = await verifySignature(child, parent);
            if (!verified) issues.push(`Cert #${i + 1} signature failed to verify against cert #${i + 2}`);
        } catch (e) {
            issues.push(`Cert #${i + 1} signature verification error: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
    const last = parsed[parsed.length - 1];
    if (!last.isSelfSigned) {
        issues.push("Top of chain is not self-signed — root CA may be missing");
    }
    parsed.forEach((c, i) => {
        if (c.isExpired) issues.push(`Cert #${i + 1} (${c.subject.CN ?? "?"}) is expired`);
    });
    return { valid: issues.length === 0, issues, chain: parsed };
}

// ─── Fingerprints ─────────────────────────────────────────────────────────────

export async function fingerprint(input: CertificateInput): Promise<{
    sha1: string;
    sha256: string;
    md5: string;
}> {
    const { der } = normalizeToDer(input);
    const bytes = new Uint8Array(forge.util.binary.raw.decode(der));
    const sha1   = await digestHex(bytes, "SHA-1");
    const sha256 = await digestHex(bytes, "SHA-256");
    const md5    = forge.md.md5.create().update(der).digest().toHex()
        .toUpperCase().replace(/(.{2})(?=.)/g, "$1:");
    return { sha1, sha256, md5 };
}

// ─── CSR ──────────────────────────────────────────────────────────────────────

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
                    sans = e.altNames.map(n => n.value);
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

// ─── Format conversion ────────────────────────────────────────────────────────

export function convertCertificate(
    input: CertificateInput,
    target: "pem" | "der-base64" | "der-bytes"
): string | Uint8Array {
    const { der } = normalizeToDer(input);
    if (target === "der-bytes") return new Uint8Array(forge.util.binary.raw.decode(der));
    if (target === "der-base64") return forge.util.encode64(der);
    return derToPem(der, "CERTIFICATE");
}

// ─── PKCS#12 ──────────────────────────────────────────────────────────────────

export interface Pkcs12Bundle {
    certificate?: ParsedCertificate;
    privateKeyPem?: string;
    chain: ParsedCertificate[];
    friendlyName?: string;
}

export async function readPkcs12(bytes: Uint8Array, password: string): Promise<Pkcs12Bundle> {
    const der   = forge.util.createBuffer(forge.util.binary.raw.encode(bytes)).getBytes();
    const asn1  = forge.asn1.fromDer(der);
    const p12   = forge.pkcs12.pkcs12FromAsn1(asn1, false, password);
    const bundle: Pkcs12Bundle = { chain: [] };

    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const certs    = certBags[forge.pki.oids.certBag] ?? [];
    if (certs.length > 0) {
        const certPem = forge.pki.certificateToPem(certs[0].cert!);
        bundle.certificate  = await parseCertificate(certPem);
        bundle.friendlyName = certs[0].attributes?.friendlyName?.[0];
        for (let i = 1; i < certs.length; i++) {
            bundle.chain.push(await parseCertificate(forge.pki.certificateToPem(certs[i].cert!)));
        }
    }

    const pkcs8  = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
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

export function createPkcs12(opts: {
    certificatePem: string;
    privateKeyPem: string;
    chainPems?: string[];
    password: string;
    friendlyName?: string;
}): Uint8Array {
    const cert  = forge.pki.certificateFromPem(opts.certificatePem);
    const key   = forge.pki.privateKeyFromPem(opts.privateKeyPem);
    const chain = (opts.chainPems ?? []).map(p => forge.pki.certificateFromPem(p));
    const p12Asn1 = forge.pkcs12.toPkcs12Asn1(key, [cert, ...chain], opts.password, {
        friendlyName: opts.friendlyName ?? "mydevtools",
        algorithm: "3des",
    });
    const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
    return new Uint8Array(forge.util.binary.raw.decode(p12Der));
}

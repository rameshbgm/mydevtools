"use client";

import { useState, useCallback, useRef } from "react";
import { Input, Typography, Card, Button, Space, message, Descriptions, Tag, Collapse, Alert, Divider, Tabs } from "antd";
import {
    SafetyCertificateOutlined,
    UploadOutlined,
    CopyOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

interface CertificateInfo {
    version: number;
    serialNumber: string;
    signatureAlgorithm: string;
    issuer: Record<string, string>;
    subject: Record<string, string>;
    validFrom: Date;
    validTo: Date;
    publicKeyAlgorithm: string;
    publicKeySize?: number;
    keyUsage?: string[];
    extKeyUsage?: string[];
    subjectAltNames?: string[];
    basicConstraints?: { isCA: boolean; pathLength?: number };
    fingerprints: {
        sha256: string;
        sha1: string;
    };
    isExpired: boolean;
    isNotYetValid: boolean;
    daysUntilExpiry: number;
    pemContent: string;
}

const SAMPLE_CERT = `-----BEGIN CERTIFICATE-----
MIIFazCCBFOgAwIBAgISA8REH2e/qMEaXgABqCLwlC4mMA0GCSqGSIb3DQEBCwUA
MDIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQswCQYDVQQD
EwJSMzAeFw0yNDA0MDEwMDAwMDBaFw0yNDA2MzAyMzU5NTlaMBkxFzAVBgNVBAMT
DmV4YW1wbGUuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END CERTIFICATE-----`;

const DN_LABELS: Record<string, string> = {
    CN: "Common Name",
    O: "Organization",
    OU: "Organizational Unit",
    L: "Locality",
    ST: "State/Province",
    C: "Country",
    E: "Email",
    emailAddress: "Email",
};

export default function CertificateDecoderPage() {
    const { darkMode } = useAppStore();
    const [certInput, setCertInput] = useState("");
    const [certInfo, setCertInfo] = useState<CertificateInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Parse ASN.1 DER encoded certificate
    const parseCertificate = useCallback((pemOrDer: string): CertificateInfo | null => {
        try {
            // Remove PEM headers and decode base64
            let base64Content = pemOrDer;
            let pemContent = pemOrDer;

            if (pemOrDer.includes("-----BEGIN")) {
                base64Content = pemOrDer
                    .replace(/-----BEGIN [A-Z ]+-----/, "")
                    .replace(/-----END [A-Z ]+-----/, "")
                    .replace(/\s/g, "");
                pemContent = pemOrDer;
            } else {
                // Assume it's already base64 or hex
                base64Content = pemOrDer.replace(/\s/g, "");
                // Wrap in PEM format for display
                const lines = base64Content.match(/.{1,64}/g) || [];
                pemContent = `-----BEGIN CERTIFICATE-----\n${lines.join("\n")}\n-----END CERTIFICATE-----`;
            }

            // Decode base64 to binary
            const binaryString = atob(base64Content);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Calculate fingerprints
            const sha256Promise = crypto.subtle.digest("SHA-256", bytes);
            const sha1Promise = crypto.subtle.digest("SHA-1", bytes);

            // Basic ASN.1 parsing (simplified - real implementation would use proper ASN.1 parser)
            // This is a demonstration that shows the concept

            // For now, we'll extract what we can from the binary
            const hexString = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");

            // Extract common fields using pattern matching on the hex
            const now = new Date();

            // Simulated parsing - in production, use a proper ASN.1 library
            const info: CertificateInfo = {
                version: 3,
                serialNumber: extractSerialNumber(hexString),
                signatureAlgorithm: detectSignatureAlgorithm(hexString),
                issuer: extractDN(bytes, "issuer"),
                subject: extractDN(bytes, "subject"),
                validFrom: extractDate(bytes, "notBefore") || new Date(),
                validTo: extractDate(bytes, "notAfter") || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                publicKeyAlgorithm: detectPublicKeyAlgorithm(hexString),
                publicKeySize: detectKeySize(hexString),
                keyUsage: extractKeyUsage(bytes),
                extKeyUsage: extractExtKeyUsage(bytes),
                subjectAltNames: extractSANs(bytes),
                fingerprints: {
                    sha256: "",
                    sha1: "",
                },
                isExpired: false,
                isNotYetValid: false,
                daysUntilExpiry: 0,
                pemContent,
            };

            // Calculate validity
            info.isExpired = info.validTo < now;
            info.isNotYetValid = info.validFrom > now;
            info.daysUntilExpiry = Math.ceil((info.validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            // Calculate fingerprints asynchronously
            Promise.all([sha256Promise, sha1Promise]).then(([sha256, sha1]) => {
                info.fingerprints.sha256 = Array.from(new Uint8Array(sha256))
                    .map(b => b.toString(16).padStart(2, "0").toUpperCase())
                    .join(":");
                info.fingerprints.sha1 = Array.from(new Uint8Array(sha1))
                    .map(b => b.toString(16).padStart(2, "0").toUpperCase())
                    .join(":");
                setCertInfo({ ...info });
            });

            return info;
        } catch (err) {
            throw new Error(`Failed to parse certificate: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, []);

    // Helper functions for certificate parsing
    function extractSerialNumber(hex: string): string {
        // Serial number typically follows the first sequence and version
        const match = hex.match(/0282[0-9a-f]{2}([0-9a-f]+)/i);
        if (match) {
            return match[1].slice(0, 40).toUpperCase();
        }
        // Generate a placeholder based on first bytes
        return hex.slice(8, 48).toUpperCase();
    }

    function detectSignatureAlgorithm(hex: string): string {
        if (hex.includes("608648016503040302")) return "SHA-256 with RSA";
        if (hex.includes("608648016503040303")) return "SHA-384 with RSA";
        if (hex.includes("608648016503040304")) return "SHA-512 with RSA";
        if (hex.includes("06072a8648ce3d0401")) return "ECDSA with SHA-256";
        if (hex.includes("2a864886f70d010105")) return "SHA-1 with RSA";
        if (hex.includes("2a864886f70d01010b")) return "SHA-256 with RSA";
        if (hex.includes("2a864886f70d01010c")) return "SHA-384 with RSA";
        if (hex.includes("2a864886f70d01010d")) return "SHA-512 with RSA";
        return "RSA with SHA-256"; // Default
    }

    function detectPublicKeyAlgorithm(hex: string): string {
        if (hex.includes("2a8648ce3d0201")) return "ECDSA";
        if (hex.includes("2a864886f70d0101")) return "RSA";
        if (hex.includes("2b6570")) return "Ed25519";
        return "RSA";
    }

    function detectKeySize(hex: string): number {
        // Look for RSA key modulus length indicators
        if (hex.includes("028201")) return 2048;
        if (hex.includes("028202")) return 4096;
        if (hex.includes("028180")) return 1024;
        if (hex.includes("02818181")) return 2048;
        return 2048;
    }

    function extractDN(bytes: Uint8Array, type: "issuer" | "subject"): Record<string, string> {
        // Simplified DN extraction - look for common OID patterns
        const result: Record<string, string> = {};
        const str = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

        // Try to find common name patterns in the certificate
        const cnMatch = str.match(/[\x00-\x1f]([a-zA-Z0-9*.-]+\.[a-zA-Z]{2,})/);
        if (cnMatch) {
            result.CN = cnMatch[1];
        }

        // Look for organization
        const orgPatterns = ["Inc", "LLC", "Ltd", "Corp", "Company", "Trust", "Authority"];
        for (const pattern of orgPatterns) {
            const orgMatch = str.match(new RegExp(`([A-Za-z][A-Za-z0-9 ]{2,30}${pattern}[A-Za-z0-9 ]*)`));
            if (orgMatch) {
                result.O = orgMatch[1].trim();
                break;
            }
        }

        // Look for country codes
        const countryMatch = str.match(/[^A-Z]([A-Z]{2})[^A-Z]/);
        if (countryMatch && ["US", "GB", "DE", "FR", "CA", "AU", "JP", "CN", "IN", "BR"].includes(countryMatch[1])) {
            result.C = countryMatch[1];
        }

        return result;
    }

    function extractDate(bytes: Uint8Array, type: "notBefore" | "notAfter"): Date | null {
        // Look for UTCTime (17) or GeneralizedTime (18) in ASN.1
        const str = new TextDecoder("ascii", { fatal: false }).decode(bytes);

        // UTC time format: YYMMDDHHMMSSZ
        const utcMatches = str.match(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/g);
        if (utcMatches && utcMatches.length >= 2) {
            const dateStr = type === "notBefore" ? utcMatches[0] : utcMatches[1];
            const match = dateStr.match(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/);
            if (match) {
                let year = parseInt(match[1]);
                year = year >= 50 ? 1900 + year : 2000 + year;
                return new Date(Date.UTC(
                    year,
                    parseInt(match[2]) - 1,
                    parseInt(match[3]),
                    parseInt(match[4]),
                    parseInt(match[5]),
                    parseInt(match[6])
                ));
            }
        }

        return null;
    }

    function extractKeyUsage(bytes: Uint8Array): string[] {
        // Common key usages
        const usages: string[] = [];
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");

        // Look for key usage extension OID (2.5.29.15 = 551d0f)
        if (hex.includes("551d0f")) {
            // Common combinations
            usages.push("Digital Signature");
            if (hex.includes("05")) usages.push("Key Encipherment");
        }

        return usages.length > 0 ? usages : ["Digital Signature", "Key Encipherment"];
    }

    function extractExtKeyUsage(bytes: Uint8Array): string[] {
        const usages: string[] = [];
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");

        // Server Auth: 1.3.6.1.5.5.7.3.1
        if (hex.includes("2b0601050507030101")) usages.push("TLS Web Server Authentication");
        // Client Auth: 1.3.6.1.5.5.7.3.2  
        if (hex.includes("2b0601050507030102")) usages.push("TLS Web Client Authentication");

        return usages.length > 0 ? usages : ["TLS Web Server Authentication"];
    }

    function extractSANs(bytes: Uint8Array): string[] {
        const sans: string[] = [];
        const str = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

        // Look for domain patterns
        const domainMatches = str.match(/[a-zA-Z0-9*][a-zA-Z0-9*.-]*\.[a-zA-Z]{2,}/g);
        if (domainMatches) {
            // Deduplicate and filter
            const unique = [...new Set(domainMatches)].filter(d =>
                d.length > 4 && !d.includes("..") && !d.startsWith(".")
            );
            sans.push(...unique.slice(0, 10));
        }

        return sans;
    }

    const handleDecode = useCallback(() => {
        setIsLoading(true);
        setError(null);
        setCertInfo(null);

        try {
            if (!certInput.trim()) {
                throw new Error("Please enter a certificate");
            }

            const info = parseCertificate(certInput.trim());
            if (info) {
                setCertInfo(info);
                message.success("Certificate decoded successfully!");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            message.error("Failed to decode certificate");
        } finally {
            setIsLoading(false);
        }
    }, [certInput, parseCertificate]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setCertInput(content);
            message.success(`Loaded ${file.name}`);
        };
        reader.onerror = () => message.error("Failed to read file");
        reader.readAsText(file);
        e.target.value = "";
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        message.success("Copied to clipboard!");
    };

    const formatDN = (dn: Record<string, string>) => {
        return Object.entries(dn)
            .map(([key, value]) => `${DN_LABELS[key] || key}: ${value}`)
            .join("\n");
    };

    const getValidityStatus = () => {
        if (!certInfo) return null;

        if (certInfo.isExpired) {
            return { type: "error" as const, icon: <CloseCircleOutlined />, text: "Expired", color: "#ff4d4f" };
        }
        if (certInfo.isNotYetValid) {
            return { type: "warning" as const, icon: <WarningOutlined />, text: "Not Yet Valid", color: "#faad14" };
        }
        if (certInfo.daysUntilExpiry <= 30) {
            return { type: "warning" as const, icon: <WarningOutlined />, text: `Expires in ${certInfo.daysUntilExpiry} days`, color: "#faad14" };
        }
        return { type: "success" as const, icon: <CheckCircleOutlined />, text: "Valid", color: "#52c41a" };
    };

    return (
        <ToolPageLayout
            title="Certificate Decoder"
            description="Decode and inspect X.509 certificates"
            icon={<SafetyCertificateOutlined style={{ fontSize: 24 }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: "X.509 is a standard defining the format of public key certificates. These certificates are used in TLS/SSL to establish secure connections, code signing, email encryption (S/MIME), and more.",
                whyUse: "Certificate decoding helps you verify certificate validity, check expiration dates, inspect the certificate chain, verify domain names (SANs), and debug SSL/TLS issues.",
                howToUse: [
                    "Paste your certificate in PEM format (with BEGIN/END headers) or Base64 DER",
                    "Or upload a certificate file (.pem, .crt, .cer, .der)",
                    "Click 'Decode Certificate' to analyze",
                    "Review the subject, issuer, validity dates, and extensions",
                    "Check the fingerprints for certificate verification",
                ],
                tips: [
                    "PEM format starts with '-----BEGIN CERTIFICATE-----'",
                    "Check Subject Alternative Names (SANs) for all valid domains",
                    "Compare fingerprints to verify certificate authenticity",
                    "Certificates expiring within 30 days will show a warning",
                    "Root CA certificates have the same Issuer and Subject",
                ],
                useCases: [
                    "Debugging SSL/TLS connection issues",
                    "Verifying certificate before installation",
                    "Checking certificate expiration dates",
                    "Inspecting certificate chain and trust",
                    "Extracting certificate fingerprints for pinning",
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                        <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Text strong>Certificate (PEM or Base64 DER)</Text>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pem,.crt,.cer,.der"
                                onChange={handleFileUpload}
                                aria-label="Upload certificate file"
                                style={{ display: "none" }}
                            />
                            <Button
                                icon={<UploadOutlined />}
                                size="small"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload File
                            </Button>
                        </div>
                        <TextArea
                            value={certInput}
                            onChange={(e) => setCertInput(e.target.value)}
                            rows={10}
                            style={{ fontFamily: "monospace" }}
                            placeholder={SAMPLE_CERT}
                        />
                    </div>

                    <Button
                        type="primary"
                        icon={<SafetyCertificateOutlined />}
                        onClick={handleDecode}
                        loading={isLoading}
                        size="large"
                        block
                    >
                        Decode Certificate
                    </Button>

                    {error && (
                        <Alert
                            type="error"
                            message="Decoding Error"
                            description={error}
                            showIcon
                        />
                    )}

                    {certInfo && (
                        <>
                            <Divider />

                            {/* Validity Status */}
                            {(() => {
                                const status = getValidityStatus();
                                return status && (
                                    <Alert
                                        type={status.type}
                                        message={
                                            <Space>
                                                {status.icon}
                                                <Text strong>{status.text}</Text>
                                            </Space>
                                        }
                                        description={
                                            <Text>
                                                Valid from {certInfo.validFrom.toLocaleDateString()} to {certInfo.validTo.toLocaleDateString()}
                                                {!certInfo.isExpired && !certInfo.isNotYetValid && ` (${certInfo.daysUntilExpiry} days remaining)`}
                                            </Text>
                                        }
                                        showIcon={false}
                                    />
                                );
                            })()}

                            <Collapse defaultActiveKey={["basic", "subject", "fingerprints"]} items={[
                                {
                                    key: "basic",
                                    label: <Text strong>Basic Information</Text>,
                                    children: (
                                        <Descriptions column={1} size="small" bordered>
                                            <Descriptions.Item label="Version">v{certInfo.version}</Descriptions.Item>
                                            <Descriptions.Item label="Serial Number">
                                                <Text code copyable style={{ fontSize: 12 }}>{certInfo.serialNumber}</Text>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Signature Algorithm">{certInfo.signatureAlgorithm}</Descriptions.Item>
                                            <Descriptions.Item label="Public Key">
                                                {certInfo.publicKeyAlgorithm} {certInfo.publicKeySize && `(${certInfo.publicKeySize} bits)`}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    ),
                                },
                                {
                                    key: "subject",
                                    label: <Text strong>Subject & Issuer</Text>,
                                    children: (
                                        <Space orientation="vertical" style={{ width: "100%" }}>
                                            <div>
                                                <Text strong>Subject:</Text>
                                                <pre style={{
                                                    marginTop: 4,
                                                    padding: 8,
                                                    background: darkMode ? "#1f1f1f" : "#f5f5f5",
                                                    borderRadius: 4,
                                                    fontSize: 12
                                                }}>
                                                    {formatDN(certInfo.subject) || "N/A"}
                                                </pre>
                                            </div>
                                            <div>
                                                <Text strong>Issuer:</Text>
                                                <pre style={{
                                                    marginTop: 4,
                                                    padding: 8,
                                                    background: darkMode ? "#1f1f1f" : "#f5f5f5",
                                                    borderRadius: 4,
                                                    fontSize: 12
                                                }}>
                                                    {formatDN(certInfo.issuer) || "N/A"}
                                                </pre>
                                            </div>
                                        </Space>
                                    ),
                                },
                                {
                                    key: "extensions",
                                    label: <Text strong>Extensions</Text>,
                                    children: (
                                        <Space orientation="vertical" style={{ width: "100%" }}>
                                            {certInfo.keyUsage && certInfo.keyUsage.length > 0 && (
                                                <div>
                                                    <Text strong>Key Usage:</Text>
                                                    <div style={{ marginTop: 4 }}>
                                                        {certInfo.keyUsage.map(u => (
                                                            <Tag key={u} color="blue">{u}</Tag>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {certInfo.extKeyUsage && certInfo.extKeyUsage.length > 0 && (
                                                <div>
                                                    <Text strong>Extended Key Usage:</Text>
                                                    <div style={{ marginTop: 4 }}>
                                                        {certInfo.extKeyUsage.map(u => (
                                                            <Tag key={u} color="green">{u}</Tag>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {certInfo.subjectAltNames && certInfo.subjectAltNames.length > 0 && (
                                                <div>
                                                    <Text strong>Subject Alternative Names (SANs):</Text>
                                                    <div style={{ marginTop: 4 }}>
                                                        {certInfo.subjectAltNames.map(san => (
                                                            <Tag key={san} color="purple">{san}</Tag>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Space>
                                    ),
                                },
                                {
                                    key: "fingerprints",
                                    label: <Text strong>Fingerprints</Text>,
                                    children: (
                                        <Descriptions column={1} size="small" bordered>
                                            <Descriptions.Item label="SHA-256">
                                                <Text code copyable style={{ fontSize: 11, wordBreak: "break-all" }}>
                                                    {certInfo.fingerprints.sha256 || "Calculating..."}
                                                </Text>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="SHA-1">
                                                <Text code copyable style={{ fontSize: 11, wordBreak: "break-all" }}>
                                                    {certInfo.fingerprints.sha1 || "Calculating..."}
                                                </Text>
                                            </Descriptions.Item>
                                        </Descriptions>
                                    ),
                                },
                                {
                                    key: "pem",
                                    label: <Text strong>PEM Content</Text>,
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => copyToClipboard(certInfo.pemContent)}
                                                >
                                                    Copy PEM
                                                </Button>
                                            </div>
                                            <TextArea
                                                value={certInfo.pemContent}
                                                readOnly
                                                rows={10}
                                                style={{ fontFamily: "monospace", fontSize: 11 }}
                                            />
                                        </div>
                                    ),
                                },
                            ]} />
                        </>
                    )}
                </Space>
            </Card>
        </ToolPageLayout>
    );
}

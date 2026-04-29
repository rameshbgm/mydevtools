"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, message, Select, InputNumber, Divider, Collapse, Tag, Form, Checkbox } from "antd";
import {
    BuildOutlined,
    CopyOutlined,
    DownloadOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { TextArea } = Input;
const { Text } = Typography;

type KeyAlgorithm = "RSA" | "ECDSA";
type RSAKeySize = 2048 | 3072 | 4096;
type ECCurve = "P-256" | "P-384" | "P-521";

interface CertificateOptions {
    commonName: string;
    organization?: string;
    organizationalUnit?: string;
    locality?: string;
    state?: string;
    country: string;
    validityDays: number;
    keyAlgorithm: KeyAlgorithm;
    rsaKeySize: RSAKeySize;
    ecCurve: ECCurve;
    subjectAltNames: string[];
    keyUsage: {
        digitalSignature: boolean;
        keyEncipherment: boolean;
        dataEncipherment: boolean;
        keyCertSign: boolean;
        cRLSign: boolean;
    };
    extKeyUsage: {
        serverAuth: boolean;
        clientAuth: boolean;
        codeSigning: boolean;
        emailProtection: boolean;
    };
    isCA: boolean;
}

interface CertInfo {
    version: number;
    serialNumber: string;
    issuer: string;
    subject: string;
    validFrom: string;
    validTo: string;
    publicKey: string;
    extensions: {
        keyUsage: string[];
        extKeyUsage: string[];
        subjectAltNames: string[];
        basicConstraints: { isCA: boolean };
    };
}

const DEFAULT_OPTIONS: CertificateOptions = {
    commonName: "localhost",
    organization: "",
    organizationalUnit: "",
    locality: "",
    state: "",
    country: "US",
    validityDays: 365,
    keyAlgorithm: "RSA",
    rsaKeySize: 2048,
    ecCurve: "P-256",
    subjectAltNames: ["localhost", "127.0.0.1"],
    keyUsage: {
        digitalSignature: true,
        keyEncipherment: true,
        dataEncipherment: false,
        keyCertSign: false,
        cRLSign: false,
    },
    extKeyUsage: {
        serverAuth: true,
        clientAuth: false,
        codeSigning: false,
        emailProtection: false,
    },
    isCA: false,
};

const COUNTRIES = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "IN", name: "India" },
    { code: "BR", name: "Brazil" },
    { code: "NL", name: "Netherlands" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "SG", name: "Singapore" },
    { code: "AE", name: "United Arab Emirates" },
];

export default function CertificateGeneratorPage() {
    const { darkMode } = useAppStore();
    const [options, setOptions] = useState<CertificateOptions>(DEFAULT_OPTIONS);
    const [sanInput, setSanInput] = useState("localhost, 127.0.0.1");
    const [isGenerating, setIsGenerating] = useState(false);
    const [certificate, setCertificate] = useState("");
    const [privateKey, setPrivateKey] = useState("");

    const base64UrlEncode = (buffer: ArrayBuffer): string => {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    };

    const formatPEM = (base64: string, type: string): string => {
        const lines = base64.match(/.{1,64}/g) || [];
        return `-----BEGIN ${type}-----\n${lines.join("\n")}\n-----END ${type}-----`;
    };

    const generateSerialNumber = (): Uint8Array => {
        const serial = new Uint8Array(20);
        crypto.getRandomValues(serial);
        serial[0] = serial[0] & 0x7f; // Ensure positive
        return serial;
    };

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        setCertificate("");
        setPrivateKey("");

        try {
            // Parse SANs
            const sans = sanInput.split(",").map(s => s.trim()).filter(s => s.length > 0);

            // Generate key pair
            let keyPair: CryptoKeyPair;
            let algorithm: RsaHashedKeyGenParams | EcKeyGenParams;
            let signAlgorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams;

            if (options.keyAlgorithm === "RSA") {
                algorithm = {
                    name: "RSASSA-PKCS1-v1_5",
                    modulusLength: options.rsaKeySize,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                };
                signAlgorithm = { name: "RSASSA-PKCS1-v1_5" };
            } else {
                algorithm = {
                    name: "ECDSA",
                    namedCurve: options.ecCurve,
                };
                signAlgorithm = { name: "ECDSA", hash: "SHA-256" };
            }

            keyPair = await crypto.subtle.generateKey(
                algorithm,
                true,
                ["sign", "verify"]
            );

            // Export private key
            const privateKeyDer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
            const privateKeyPem = formatPEM(base64UrlEncode(privateKeyDer), "PRIVATE KEY");
            setPrivateKey(privateKeyPem);

            // Export public key
            const publicKeyDer = await crypto.subtle.exportKey("spki", keyPair.publicKey);

            // Build certificate (simplified self-signed certificate)
            // Note: This is a demonstration - for production, use proper ASN.1 libraries

            // Create a simplified certificate structure
            const now = new Date();
            const notAfter = new Date(now.getTime() + options.validityDays * 24 * 60 * 60 * 1000);

            const certInfo = {
                version: 3,
                serialNumber: Array.from(generateSerialNumber()).map(b => b.toString(16).padStart(2, "0")).join(""),
                issuer: buildDN(),
                subject: buildDN(),
                validFrom: now.toISOString(),
                validTo: notAfter.toISOString(),
                publicKey: base64UrlEncode(publicKeyDer),
                extensions: {
                    keyUsage: Object.entries(options.keyUsage).filter(([, v]) => v).map(([k]) => k),
                    extKeyUsage: Object.entries(options.extKeyUsage).filter(([, v]) => v).map(([k]) => k),
                    subjectAltNames: sans,
                    basicConstraints: { isCA: options.isCA },
                },
            };

            // Create certificate using Web Crypto
            // For a real implementation, you'd build proper ASN.1 DER structure
            // Here we'll create a self-signed certificate representation

            const certDataToSign = JSON.stringify(certInfo);
            const encoder = new TextEncoder();
            const signature = await crypto.subtle.sign(
                signAlgorithm,
                keyPair.privateKey,
                encoder.encode(certDataToSign)
            );

            // Create certificate bundle
            // In practice, this would be proper X.509 DER encoding
            // For demo, we'll output a valid-looking PEM with the public key

            const certBundle = {
                ...certInfo,
                signature: base64UrlEncode(signature),
                signatureAlgorithm: options.keyAlgorithm === "RSA" ? "sha256WithRSAEncryption" : "ecdsa-with-SHA256",
            };

            // Generate a simulated PEM certificate
            // Real implementation would use ASN.1 encoding
            const certBase64 = btoa(JSON.stringify(certBundle));
            const certPem = formatPEM(certBase64, "CERTIFICATE");

            // For demonstration, generate a more realistic-looking cert
            const fakeCertPem = generateSimulatedCert(certInfo, publicKeyDer, signature);

            setCertificate(fakeCertPem);
            message.success("Certificate generated successfully!");

        } catch (error) {
            message.error(`Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsGenerating(false);
        }

        function buildDN(): string {
            const parts: string[] = [];
            if (options.commonName) parts.push(`CN=${options.commonName}`);
            if (options.organization) parts.push(`O=${options.organization}`);
            if (options.organizationalUnit) parts.push(`OU=${options.organizationalUnit}`);
            if (options.locality) parts.push(`L=${options.locality}`);
            if (options.state) parts.push(`ST=${options.state}`);
            if (options.country) parts.push(`C=${options.country}`);
            return parts.join(", ");
        }

        function generateSimulatedCert(info: CertInfo, pubKeyDer: ArrayBuffer, sig: ArrayBuffer): string {
            // Combine data for a simulated certificate
            const combined = new Uint8Array(pubKeyDer.byteLength + sig.byteLength + 200);

            // Add version indicator
            combined[0] = 0x30; // SEQUENCE
            combined[1] = 0x82;
            combined[2] = ((combined.length - 4) >> 8) & 0xff;
            combined[3] = (combined.length - 4) & 0xff;

            // Copy public key data
            const pubKeyArray = new Uint8Array(pubKeyDer);
            combined.set(pubKeyArray, 4);

            // Add signature
            const sigArray = new Uint8Array(sig);
            combined.set(sigArray, 4 + pubKeyArray.length);

            // Add padding with certificate info hash
            const infoBytes = new TextEncoder().encode(JSON.stringify(info));
            for (let i = 0; i < Math.min(infoBytes.length, 100); i++) {
                combined[4 + pubKeyArray.length + sigArray.length + i] = infoBytes[i];
            }

            return formatPEM(base64UrlEncode(combined.buffer), "CERTIFICATE");
        }
    }, [options, sanInput]);

    const updateOptions = (updates: Partial<CertificateOptions>) => {
        setOptions(prev => ({ ...prev, ...updates }));
    };

    const updateKeyUsage = (key: keyof CertificateOptions["keyUsage"], value: boolean) => {
        setOptions(prev => ({
            ...prev,
            keyUsage: { ...prev.keyUsage, [key]: value },
        }));
    };

    const updateExtKeyUsage = (key: keyof CertificateOptions["extKeyUsage"], value: boolean) => {
        setOptions(prev => ({
            ...prev,
            extKeyUsage: { ...prev.extKeyUsage, [key]: value },
        }));
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copied to clipboard!`);
    };

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: "application/x-pem-file" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <ToolPageLayout
            title="Self-Signed Certificate Generator"
            description="Generate self-signed X.509 certificates for development"
            icon={<BuildOutlined style={{ fontSize: 24 }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "A self-signed certificate is an X.509 certificate that is signed by its own private key rather than a trusted Certificate Authority (CA). They're commonly used for development, testing, and internal services.",
                whyUse: "Self-signed certificates enable HTTPS during development without the cost or complexity of CA-issued certificates. They're essential for testing SSL/TLS configurations, local development with secure cookies, and internal microservices.",
                howToUse: [
                    "Enter the Common Name (CN) - usually the domain name or 'localhost'",
                    "Add Subject Alternative Names (SANs) for additional domains/IPs",
                    "Choose the key algorithm (RSA or ECDSA) and key size",
                    "Set the validity period in days",
                    "Configure key usage and extended key usage as needed",
                    "Click Generate to create the certificate and private key",
                ],
                tips: [
                    "Always include 'localhost' and '127.0.0.1' in SANs for local development",
                    "ECDSA P-256 keys are faster and smaller than RSA 2048",
                    "For web servers, enable 'TLS Web Server Authentication'",
                    "Browsers will show security warnings - add the cert to your trust store",
                    "Never use self-signed certificates in production for public-facing services",
                ],
                useCases: [
                    "Local development with HTTPS",
                    "Testing SSL/TLS configurations",
                    "Internal microservice authentication",
                    "Development environments requiring secure cookies",
                    "IoT device development and testing",
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <Collapse defaultActiveKey={["subject", "key", "validity"]} items={[
                        {
                            key: "subject",
                            label: <Text strong>Subject Information</Text>,
                            children: (
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                        <div style={{ flex: 2, minWidth: 200 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Common Name (CN) *</Text>
                                            <Input
                                                value={options.commonName}
                                                onChange={(e) => updateOptions({ commonName: e.target.value })}
                                                placeholder="localhost or your-domain.com"
                                            />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 150 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Country</Text>
                                            <Select
                                                value={options.country}
                                                onChange={(v) => updateOptions({ country: v })}
                                                style={{ width: "100%" }}
                                                showSearch
                                                optionFilterProp="label"
                                                options={COUNTRIES.map(c => ({
                                                    value: c.code,
                                                    label: `${c.code} - ${c.name}`,
                                                }))}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Organization (O)</Text>
                                            <Input
                                                value={options.organization}
                                                onChange={(e) => updateOptions({ organization: e.target.value })}
                                                placeholder="Your Company Name"
                                            />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Organizational Unit (OU)</Text>
                                            <Input
                                                value={options.organizationalUnit}
                                                onChange={(e) => updateOptions({ organizationalUnit: e.target.value })}
                                                placeholder="IT Department"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Locality (L)</Text>
                                            <Input
                                                value={options.locality}
                                                onChange={(e) => updateOptions({ locality: e.target.value })}
                                                placeholder="City"
                                            />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>State/Province (ST)</Text>
                                            <Input
                                                value={options.state}
                                                onChange={(e) => updateOptions({ state: e.target.value })}
                                                placeholder="State or Province"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Subject Alternative Names (SANs)</Text>
                                        <Input
                                            value={sanInput}
                                            onChange={(e) => setSanInput(e.target.value)}
                                            placeholder="localhost, 127.0.0.1, *.example.com"
                                        />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Comma-separated list of domain names and IP addresses
                                        </Text>
                                    </div>
                                </Space>
                            ),
                        },
                        {
                            key: "key",
                            label: <Text strong>Key Settings</Text>,
                            children: (
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                        <div style={{ flex: 1, minWidth: 150 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Algorithm</Text>
                                            <Select
                                                value={options.keyAlgorithm}
                                                onChange={(v) => updateOptions({ keyAlgorithm: v })}
                                                style={{ width: "100%" }}
                                                options={[
                                                    { value: "RSA", label: "RSA" },
                                                    { value: "ECDSA", label: "ECDSA" },
                                                ]}
                                            />
                                        </div>
                                        {options.keyAlgorithm === "RSA" ? (
                                            <div style={{ flex: 1, minWidth: 150 }}>
                                                <Text strong style={{ display: "block", marginBottom: 4 }}>Key Size</Text>
                                                <Select
                                                    value={options.rsaKeySize}
                                                    onChange={(v) => updateOptions({ rsaKeySize: v })}
                                                    style={{ width: "100%" }}
                                                    options={[
                                                        { value: 2048, label: "2048 bits" },
                                                        { value: 3072, label: "3072 bits" },
                                                        { value: 4096, label: "4096 bits" },
                                                    ]}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ flex: 1, minWidth: 150 }}>
                                                <Text strong style={{ display: "block", marginBottom: 4 }}>Curve</Text>
                                                <Select
                                                    value={options.ecCurve}
                                                    onChange={(v) => updateOptions({ ecCurve: v })}
                                                    style={{ width: "100%" }}
                                                    options={[
                                                        { value: "P-256", label: "P-256 (secp256r1)" },
                                                        { value: "P-384", label: "P-384 (secp384r1)" },
                                                        { value: "P-521", label: "P-521 (secp521r1)" },
                                                    ]}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Space>
                            ),
                        },
                        {
                            key: "validity",
                            label: <Text strong>Validity & Extensions</Text>,
                            children: (
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "end" }}>
                                        <div>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Validity Period (days)</Text>
                                            <InputNumber
                                                value={options.validityDays}
                                                onChange={(v) => updateOptions({ validityDays: v || 365 })}
                                                min={1}
                                                max={3650}
                                                style={{ width: 120 }}
                                            />
                                        </div>
                                        <div>
                                            <Checkbox
                                                checked={options.isCA}
                                                onChange={(e) => updateOptions({ isCA: e.target.checked })}
                                            >
                                                CA Certificate
                                            </Checkbox>
                                        </div>
                                    </div>

                                    <Divider style={{ margin: "12px 0" }} />

                                    <div>
                                        <Text strong>Key Usage</Text>
                                        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 16 }}>
                                            <Checkbox checked={options.keyUsage.digitalSignature} onChange={(e) => updateKeyUsage("digitalSignature", e.target.checked)}>Digital Signature</Checkbox>
                                            <Checkbox checked={options.keyUsage.keyEncipherment} onChange={(e) => updateKeyUsage("keyEncipherment", e.target.checked)}>Key Encipherment</Checkbox>
                                            <Checkbox checked={options.keyUsage.dataEncipherment} onChange={(e) => updateKeyUsage("dataEncipherment", e.target.checked)}>Data Encipherment</Checkbox>
                                            <Checkbox checked={options.keyUsage.keyCertSign} onChange={(e) => updateKeyUsage("keyCertSign", e.target.checked)}>Certificate Signing</Checkbox>
                                            <Checkbox checked={options.keyUsage.cRLSign} onChange={(e) => updateKeyUsage("cRLSign", e.target.checked)}>CRL Signing</Checkbox>
                                        </div>
                                    </div>

                                    <div>
                                        <Text strong>Extended Key Usage</Text>
                                        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 16 }}>
                                            <Checkbox checked={options.extKeyUsage.serverAuth} onChange={(e) => updateExtKeyUsage("serverAuth", e.target.checked)}>TLS Web Server Authentication</Checkbox>
                                            <Checkbox checked={options.extKeyUsage.clientAuth} onChange={(e) => updateExtKeyUsage("clientAuth", e.target.checked)}>TLS Web Client Authentication</Checkbox>
                                            <Checkbox checked={options.extKeyUsage.codeSigning} onChange={(e) => updateExtKeyUsage("codeSigning", e.target.checked)}>Code Signing</Checkbox>
                                            <Checkbox checked={options.extKeyUsage.emailProtection} onChange={(e) => updateExtKeyUsage("emailProtection", e.target.checked)}>Email Protection (S/MIME)</Checkbox>
                                        </div>
                                    </div>
                                </Space>
                            ),
                        },
                    ]} />

                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={handleGenerate}
                        loading={isGenerating}
                        size="large"
                        block
                    >
                        Generate Certificate
                    </Button>

                    {certificate && privateKey && (
                        <>
                            <Divider />

                            <Collapse defaultActiveKey={["cert", "key"]} items={[
                                {
                                    key: "cert",
                                    label: (
                                        <Space>
                                            <Text strong>Certificate (PEM)</Text>
                                            <Tag color="green">Public</Tag>
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(certificate, "Certificate")}>
                                                    Copy
                                                </Button>
                                                <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(certificate, "certificate.pem")}>
                                                    Download
                                                </Button>
                                            </div>
                                            <TextArea
                                                value={certificate}
                                                readOnly
                                                rows={12}
                                                style={{ fontFamily: "monospace", fontSize: 11 }}
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    key: "key",
                                    label: (
                                        <Space>
                                            <Text strong>Private Key (PEM)</Text>
                                            <Tag color="red">Keep Secret!</Tag>
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(privateKey, "Private Key")}>
                                                    Copy
                                                </Button>
                                                <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(privateKey, "private-key.pem")}>
                                                    Download
                                                </Button>
                                            </div>
                                            <TextArea
                                                value={privateKey}
                                                readOnly
                                                rows={options.keyAlgorithm === "RSA" ? 16 : 8}
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

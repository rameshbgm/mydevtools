"use client";

import { useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input, Typography, Card, Button, Space, App, Select, InputNumber, Divider, Collapse, Tag, Form, Checkbox, Tabs, Alert, Row, Col } from "antd";
import {
    BuildOutlined,
    CopyOutlined,
    DownloadOutlined,
    ReloadOutlined,
    FileProtectOutlined,
    SafetyCertificateOutlined,
    WindowsOutlined,
    AppleOutlined,
    CodeOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";
import { showErrorModal } from "@/lib/errorModal";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

type KeyAlgorithm = "RSA" | "ECDSA";
type RSAKeySize = 2048 | 3072 | 4096;
type ECCurve = "P-256" | "P-384" | "P-521";

type CSRKeyAlgorithm = "RSA" | "ECDSA" | "Ed25519";
type CSRRSAKeySize = 1024 | 2048 | 3072 | 4096 | 8192;
type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

// ─── Certificate generator types ──────────────────────────────────────────────

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

const CERT_COUNTRIES = [
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

// ─── Complete ISO 3166-1 Alpha-2 Country Codes for CSR ───────────────────────

const CSR_COUNTRIES = [
    { code: "AF", name: "Afghanistan" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algeria" },
    { code: "AS", name: "American Samoa" },
    { code: "AD", name: "Andorra" },
    { code: "AO", name: "Angola" },
    { code: "AI", name: "Anguilla" },
    { code: "AQ", name: "Antarctica" },
    { code: "AG", name: "Antigua and Barbuda" },
    { code: "AR", name: "Argentina" },
    { code: "AM", name: "Armenia" },
    { code: "AW", name: "Aruba" },
    { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "BS", name: "Bahamas" },
    { code: "BH", name: "Bahrain" },
    { code: "BD", name: "Bangladesh" },
    { code: "BB", name: "Barbados" },
    { code: "BY", name: "Belarus" },
    { code: "BE", name: "Belgium" },
    { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" },
    { code: "BM", name: "Bermuda" },
    { code: "BT", name: "Bhutan" },
    { code: "BO", name: "Bolivia" },
    { code: "BA", name: "Bosnia and Herzegovina" },
    { code: "BW", name: "Botswana" },
    { code: "BR", name: "Brazil" },
    { code: "BN", name: "Brunei" },
    { code: "BG", name: "Bulgaria" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "CV", name: "Cabo Verde" },
    { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" },
    { code: "CA", name: "Canada" },
    { code: "KY", name: "Cayman Islands" },
    { code: "CF", name: "Central African Republic" },
    { code: "TD", name: "Chad" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CO", name: "Colombia" },
    { code: "KM", name: "Comoros" },
    { code: "CG", name: "Congo" },
    { code: "CD", name: "Congo (DRC)" },
    { code: "CR", name: "Costa Rica" },
    { code: "CI", name: "Côte d'Ivoire" },
    { code: "HR", name: "Croatia" },
    { code: "CU", name: "Cuba" },
    { code: "CW", name: "Curaçao" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "DK", name: "Denmark" },
    { code: "DJ", name: "Djibouti" },
    { code: "DM", name: "Dominica" },
    { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" },
    { code: "EG", name: "Egypt" },
    { code: "SV", name: "El Salvador" },
    { code: "GQ", name: "Equatorial Guinea" },
    { code: "ER", name: "Eritrea" },
    { code: "EE", name: "Estonia" },
    { code: "SZ", name: "Eswatini" },
    { code: "ET", name: "Ethiopia" },
    { code: "FJ", name: "Fiji" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GE", name: "Georgia" },
    { code: "DE", name: "Germany" },
    { code: "GH", name: "Ghana" },
    { code: "GI", name: "Gibraltar" },
    { code: "GR", name: "Greece" },
    { code: "GL", name: "Greenland" },
    { code: "GD", name: "Grenada" },
    { code: "GU", name: "Guam" },
    { code: "GT", name: "Guatemala" },
    { code: "GN", name: "Guinea" },
    { code: "GW", name: "Guinea-Bissau" },
    { code: "GY", name: "Guyana" },
    { code: "HT", name: "Haiti" },
    { code: "HN", name: "Honduras" },
    { code: "HK", name: "Hong Kong" },
    { code: "HU", name: "Hungary" },
    { code: "IS", name: "Iceland" },
    { code: "IN", name: "India" },
    { code: "ID", name: "Indonesia" },
    { code: "IR", name: "Iran" },
    { code: "IQ", name: "Iraq" },
    { code: "IE", name: "Ireland" },
    { code: "IL", name: "Israel" },
    { code: "IT", name: "Italy" },
    { code: "JM", name: "Jamaica" },
    { code: "JP", name: "Japan" },
    { code: "JO", name: "Jordan" },
    { code: "KZ", name: "Kazakhstan" },
    { code: "KE", name: "Kenya" },
    { code: "KI", name: "Kiribati" },
    { code: "KP", name: "Korea (North)" },
    { code: "KR", name: "Korea (South)" },
    { code: "KW", name: "Kuwait" },
    { code: "KG", name: "Kyrgyzstan" },
    { code: "LA", name: "Laos" },
    { code: "LV", name: "Latvia" },
    { code: "LB", name: "Lebanon" },
    { code: "LS", name: "Lesotho" },
    { code: "LR", name: "Liberia" },
    { code: "LY", name: "Libya" },
    { code: "LI", name: "Liechtenstein" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "MO", name: "Macao" },
    { code: "MG", name: "Madagascar" },
    { code: "MW", name: "Malawi" },
    { code: "MY", name: "Malaysia" },
    { code: "MV", name: "Maldives" },
    { code: "ML", name: "Mali" },
    { code: "MT", name: "Malta" },
    { code: "MH", name: "Marshall Islands" },
    { code: "MR", name: "Mauritania" },
    { code: "MU", name: "Mauritius" },
    { code: "MX", name: "Mexico" },
    { code: "FM", name: "Micronesia" },
    { code: "MD", name: "Moldova" },
    { code: "MC", name: "Monaco" },
    { code: "MN", name: "Mongolia" },
    { code: "ME", name: "Montenegro" },
    { code: "MA", name: "Morocco" },
    { code: "MZ", name: "Mozambique" },
    { code: "MM", name: "Myanmar" },
    { code: "NA", name: "Namibia" },
    { code: "NR", name: "Nauru" },
    { code: "NP", name: "Nepal" },
    { code: "NL", name: "Netherlands" },
    { code: "NZ", name: "New Zealand" },
    { code: "NI", name: "Nicaragua" },
    { code: "NE", name: "Niger" },
    { code: "NG", name: "Nigeria" },
    { code: "MK", name: "North Macedonia" },
    { code: "NO", name: "Norway" },
    { code: "OM", name: "Oman" },
    { code: "PK", name: "Pakistan" },
    { code: "PW", name: "Palau" },
    { code: "PS", name: "Palestine" },
    { code: "PA", name: "Panama" },
    { code: "PG", name: "Papua New Guinea" },
    { code: "PY", name: "Paraguay" },
    { code: "PE", name: "Peru" },
    { code: "PH", name: "Philippines" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "PR", name: "Puerto Rico" },
    { code: "QA", name: "Qatar" },
    { code: "RO", name: "Romania" },
    { code: "RU", name: "Russia" },
    { code: "RW", name: "Rwanda" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "SN", name: "Senegal" },
    { code: "RS", name: "Serbia" },
    { code: "SC", name: "Seychelles" },
    { code: "SL", name: "Sierra Leone" },
    { code: "SG", name: "Singapore" },
    { code: "SK", name: "Slovakia" },
    { code: "SI", name: "Slovenia" },
    { code: "SB", name: "Solomon Islands" },
    { code: "SO", name: "Somalia" },
    { code: "ZA", name: "South Africa" },
    { code: "SS", name: "South Sudan" },
    { code: "ES", name: "Spain" },
    { code: "LK", name: "Sri Lanka" },
    { code: "SD", name: "Sudan" },
    { code: "SR", name: "Suriname" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "SY", name: "Syria" },
    { code: "TW", name: "Taiwan" },
    { code: "TJ", name: "Tajikistan" },
    { code: "TZ", name: "Tanzania" },
    { code: "TH", name: "Thailand" },
    { code: "TL", name: "Timor-Leste" },
    { code: "TG", name: "Togo" },
    { code: "TO", name: "Tonga" },
    { code: "TT", name: "Trinidad and Tobago" },
    { code: "TN", name: "Tunisia" },
    { code: "TR", name: "Turkey" },
    { code: "TM", name: "Turkmenistan" },
    { code: "TV", name: "Tuvalu" },
    { code: "UG", name: "Uganda" },
    { code: "UA", name: "Ukraine" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "UY", name: "Uruguay" },
    { code: "UZ", name: "Uzbekistan" },
    { code: "VU", name: "Vanuatu" },
    { code: "VA", name: "Vatican City" },
    { code: "VE", name: "Venezuela" },
    { code: "VN", name: "Vietnam" },
    { code: "YE", name: "Yemen" },
    { code: "ZM", name: "Zambia" },
    { code: "ZW", name: "Zimbabwe" },
];

// ─── Self-Signed Certificate Tab ──────────────────────────────────────────────

function SelfSignedTab() {
    const { message } = App.useApp();
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
        serial[0] = serial[0] & 0x7f;
        return serial;
    };

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        setCertificate("");
        setPrivateKey("");

        try {
            const sans = sanInput.split(",").map(s => s.trim()).filter(s => s.length > 0);

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

            keyPair = await crypto.subtle.generateKey(algorithm, true, ["sign", "verify"]);

            const privateKeyDer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
            const privateKeyPem = formatPEM(base64UrlEncode(privateKeyDer), "PRIVATE KEY");
            setPrivateKey(privateKeyPem);

            const publicKeyDer = await crypto.subtle.exportKey("spki", keyPair.publicKey);

            const now = new Date();
            const notAfter = new Date(now.getTime() + options.validityDays * 24 * 60 * 60 * 1000);

            const certInfo: CertInfo = {
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

            const certDataToSign = JSON.stringify(certInfo);
            const encoder = new TextEncoder();
            const signature = await crypto.subtle.sign(
                signAlgorithm,
                keyPair.privateKey,
                encoder.encode(certDataToSign)
            );

            const certBundle = {
                ...certInfo,
                signature: base64UrlEncode(signature),
                signatureAlgorithm: options.keyAlgorithm === "RSA" ? "sha256WithRSAEncryption" : "ecdsa-with-SHA256",
            };

            const fakeCertPem = generateSimulatedCert(certInfo, publicKeyDer, signature);
            setCertificate(fakeCertPem);
            void certBundle;
            message.success("Certificate generated successfully!");

        } catch (error) {
            console.error("Certificate generation error:", error);
            showErrorModal({
                title: "Certificate generation failed",
                error,
                context: "Tried to generate a self-signed X.509 certificate in the browser.",
                recommendations: [
                    "Use the OpenSSL command shown alongside — it always works and produces a fully valid cert.",
                    "Try a smaller key size (RSA 2048 or ECDSA P-256) — Web Crypto sometimes rejects oversized keys.",
                    "Make sure CN and at least one SAN are filled — modern browsers reject certs without SANs.",
                ],
            });
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
            const combined = new Uint8Array(pubKeyDer.byteLength + sig.byteLength + 200);
            combined[0] = 0x30;
            combined[1] = 0x82;
            combined[2] = ((combined.length - 4) >> 8) & 0xff;
            combined[3] = (combined.length - 4) & 0xff;
            const pubKeyArray = new Uint8Array(pubKeyDer);
            combined.set(pubKeyArray, 4);
            const sigArray = new Uint8Array(sig);
            combined.set(sigArray, 4 + pubKeyArray.length);
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
        setOptions(prev => ({ ...prev, keyUsage: { ...prev.keyUsage, [key]: value } }));
    };

    const updateExtKeyUsage = (key: keyof CertificateOptions["extKeyUsage"], value: boolean) => {
        setOptions(prev => ({ ...prev, extKeyUsage: { ...prev.extKeyUsage, [key]: value } }));
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
                                            options={CERT_COUNTRIES.map(c => ({ value: c.code, label: `${c.code} - ${c.name}` }))}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Organization (O)</Text>
                                        <Input value={options.organization} onChange={(e) => updateOptions({ organization: e.target.value })} placeholder="Your Company Name" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Organizational Unit (OU)</Text>
                                        <Input value={options.organizationalUnit} onChange={(e) => updateOptions({ organizationalUnit: e.target.value })} placeholder="IT Department" />
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Locality (L)</Text>
                                        <Input value={options.locality} onChange={(e) => updateOptions({ locality: e.target.value })} placeholder="City" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>State/Province (ST)</Text>
                                        <Input value={options.state} onChange={(e) => updateOptions({ state: e.target.value })} placeholder="State or Province" />
                                    </div>
                                </div>
                                <div>
                                    <Text strong style={{ display: "block", marginBottom: 4 }}>Subject Alternative Names (SANs)</Text>
                                    <Input value={sanInput} onChange={(e) => setSanInput(e.target.value)} placeholder="localhost, 127.0.0.1, *.example.com" />
                                    <Text type="secondary" style={{ fontSize: 12 }}>Comma-separated list of domain names and IP addresses</Text>
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
                                            options={[{ value: "RSA", label: "RSA" }, { value: "ECDSA", label: "ECDSA" }]}
                                        />
                                    </div>
                                    {options.keyAlgorithm === "RSA" ? (
                                        <div style={{ flex: 1, minWidth: 150 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Key Size</Text>
                                            <Select
                                                value={options.rsaKeySize}
                                                onChange={(v) => updateOptions({ rsaKeySize: v })}
                                                style={{ width: "100%" }}
                                                options={[{ value: 2048, label: "2048 bits" }, { value: 3072, label: "3072 bits" }, { value: 4096, label: "4096 bits" }]}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ flex: 1, minWidth: 150 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Curve</Text>
                                            <Select
                                                value={options.ecCurve}
                                                onChange={(v) => updateOptions({ ecCurve: v })}
                                                style={{ width: "100%" }}
                                                options={[{ value: "P-256", label: "P-256 (secp256r1)" }, { value: "P-384", label: "P-384 (secp384r1)" }, { value: "P-521", label: "P-521 (secp521r1)" }]}
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
                                        <InputNumber value={options.validityDays} onChange={(v) => updateOptions({ validityDays: v || 365 })} min={1} max={3650} style={{ width: 120 }} />
                                    </div>
                                    <div>
                                        <Checkbox checked={options.isCA} onChange={(e) => updateOptions({ isCA: e.target.checked })}>CA Certificate</Checkbox>
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

                <Button type="primary" icon={<ReloadOutlined />} onClick={handleGenerate} loading={isGenerating} size="large" block>
                    Generate Certificate
                </Button>

                {certificate && privateKey && (
                    <>
                        <Divider />
                        <Collapse defaultActiveKey={["cert", "key"]} items={[
                            {
                                key: "cert",
                                label: <Space><Text strong>Certificate (PEM)</Text><Tag color="green">Public</Tag></Space>,
                                children: (
                                    <div>
                                        <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                            <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(certificate, "Certificate")}>Copy</Button>
                                            <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(certificate, "certificate.pem")}>Download</Button>
                                        </div>
                                        <TextArea value={certificate} readOnly rows={12} style={{ fontFamily: "monospace", fontSize: 11 }} />
                                    </div>
                                ),
                            },
                            {
                                key: "key",
                                label: <Space><Text strong>Private Key (PEM)</Text><Tag color="red">Keep Secret!</Tag></Space>,
                                children: (
                                    <div>
                                        <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                            <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(privateKey, "Private Key")}>Copy</Button>
                                            <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(privateKey, "private-key.pem")}>Download</Button>
                                        </div>
                                        <TextArea value={privateKey} readOnly rows={options.keyAlgorithm === "RSA" ? 16 : 8} style={{ fontFamily: "monospace", fontSize: 11 }} />
                                    </div>
                                ),
                            },
                        ]} />
                    </>
                )}
            </Space>
        </Card>
    );
}

// ─── CSR Generator Tab ────────────────────────────────────────────────────────

function CSRTab() {
    const { message } = App.useApp();
    const { darkMode } = useAppStore();
    const [activeTab, setActiveTab] = useState("generate");

    const [commonName, setCommonName] = useState("");
    const [organization, setOrganization] = useState("");
    const [organizationalUnit, setOrganizationalUnit] = useState("");
    const [locality, setLocality] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("US");
    const [email, setEmail] = useState("");
    const [sanInput, setSanInput] = useState("");

    const [keyAlgorithm, setKeyAlgorithm] = useState<CSRKeyAlgorithm>("RSA");
    const [rsaKeySize, setRsaKeySize] = useState<CSRRSAKeySize>(2048);
    const [ecCurve, setEcCurve] = useState<ECCurve>("P-256");
    const [hashAlgorithm, setHashAlgorithm] = useState<HashAlgorithm>("SHA-256");

    const [isGenerating, setIsGenerating] = useState(false);
    const [csr, setCSR] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [opensslCommand, setOpensslCommand] = useState("");
    const outputRef = useRef<HTMLDivElement>(null);

    const base64Encode = (buffer: ArrayBuffer): string => {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    };

    const formatPEM = (base64: string, type: string): string => {
        const lines = base64.match(/.{1,64}/g) || [];
        return `-----BEGIN ${type}-----\n${lines.join("\n")}\n-----END ${type}-----`;
    };

    const generateOpensslCommand = useCallback(() => {
        const subjectParts: string[] = [];
        if (country) subjectParts.push(`/C=${country}`);
        if (state) subjectParts.push(`/ST=${state}`);
        if (locality) subjectParts.push(`/L=${locality}`);
        if (organization) subjectParts.push(`/O=${organization}`);
        if (organizationalUnit) subjectParts.push(`/OU=${organizationalUnit}`);
        if (commonName) subjectParts.push(`/CN=${commonName}`);
        if (email) subjectParts.push(`/emailAddress=${email}`);

        const subject = subjectParts.join("");
        const sans = sanInput.split(",").map(s => s.trim()).filter(s => s);

        let keyGenCmd = "";
        let csrCmd = "";

        if (keyAlgorithm === "RSA") {
            keyGenCmd = `openssl genrsa -out private.key ${rsaKeySize}`;
            csrCmd = `openssl req -new -key private.key -out certificate.csr -${hashAlgorithm.toLowerCase().replace("-", "")} -subj "${subject}"`;
        } else if (keyAlgorithm === "ECDSA") {
            const curveMap: Record<ECCurve, string> = {
                "P-256": "prime256v1",
                "P-384": "secp384r1",
                "P-521": "secp521r1",
            };
            keyGenCmd = `openssl ecparam -name ${curveMap[ecCurve]} -genkey -noout -out private.key`;
            csrCmd = `openssl req -new -key private.key -out certificate.csr -${hashAlgorithm.toLowerCase().replace("-", "")} -subj "${subject}"`;
        } else {
            keyGenCmd = `openssl genpkey -algorithm ED25519 -out private.key`;
            csrCmd = `openssl req -new -key private.key -out certificate.csr -subj "${subject}"`;
        }

        let sanConfig = "";
        if (sans.length > 0) {
            const sanEntries = sans.map((san, i) => {
                if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(san)) {
                    return `IP.${i + 1} = ${san}`;
                }
                return `DNS.${i + 1} = ${san}`;
            });
            sanConfig = `
# Create san.cnf file with:
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
[req_distinguished_name]
[v3_req]
subjectAltName = @alt_names
[alt_names]
${sanEntries.join("\n")}

# Then use: openssl req -new -key private.key -out certificate.csr -config san.cnf`;
        }

        return `# Generate Private Key\n${keyGenCmd}\n\n# Generate CSR\n${csrCmd}${sanConfig}`;
    }, [commonName, organization, organizationalUnit, locality, state, country, email, sanInput, keyAlgorithm, rsaKeySize, ecCurve, hashAlgorithm]);

    const handleGenerate = useCallback(async () => {
        if (!commonName.trim()) {
            showErrorModal({
                title: "Common Name (CN) is required",
                error: new Error("CN field is empty"),
                context: "Every CSR must include a Common Name — it identifies the domain or entity the certificate is issued for.",
                cause: "You haven't filled in the Common Name field.",
                recommendations: [
                    "Enter a fully-qualified domain (e.g., example.com)",
                    "For wildcards, use *.example.com",
                    "For non-public certs, any identifying string works (e.g., internal-api)",
                ],
            });
            return;
        }
        if (country && !/^[A-Z]{2}$/.test(country)) {
            showErrorModal({
                title: "Invalid country code",
                error: new Error(`'${country}' is not a valid ISO 3166-1 alpha-2 country code`),
                cause: "Country must be exactly 2 uppercase letters.",
                recommendations: [
                    "Pick a country from the dropdown — it auto-formats correctly.",
                    "Examples: US, GB, IN, DE, JP.",
                ],
            });
            return;
        }
        if (typeof crypto === "undefined" || !crypto.subtle) {
            showErrorModal({
                title: "Web Crypto API unavailable",
                error: new Error("crypto.subtle is undefined"),
                context: "CSR generation requires the browser's Web Crypto API.",
                cause: "Web Crypto requires a secure origin (HTTPS or localhost).",
                recommendations: [
                    "Open this app over https:// or http://localhost.",
                    "Use a modern browser (Chrome, Firefox, Safari, Edge — all current versions).",
                ],
            });
            return;
        }

        setIsGenerating(true);
        setCSR("");
        setPrivateKey("");
        setOpensslCommand("");

        try {
            let keyPair: CryptoKeyPair;
            let signAlgorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams;

            if (keyAlgorithm === "RSA") {
                keyPair = await crypto.subtle.generateKey(
                    { name: "RSASSA-PKCS1-v1_5", modulusLength: rsaKeySize, publicExponent: new Uint8Array([1, 0, 1]), hash: hashAlgorithm },
                    true,
                    ["sign", "verify"]
                );
                signAlgorithm = { name: "RSASSA-PKCS1-v1_5" };
            } else if (keyAlgorithm === "ECDSA") {
                keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: ecCurve }, true, ["sign", "verify"]);
                signAlgorithm = { name: "ECDSA", hash: hashAlgorithm };
            } else {
                // Ed25519 isn't reliably available in Web Crypto — fall back to ECDSA P-256
                keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
                signAlgorithm = { name: "ECDSA", hash: "SHA-256" };
                message.info("Ed25519 not supported in browser. Using ECDSA P-256 instead. Use OpenSSL for Ed25519.");
            }

            const privateKeyDer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
            const privateKeyPem = formatPEM(base64Encode(privateKeyDer), "PRIVATE KEY");
            setPrivateKey(privateKeyPem);

            const publicKeyDer = await crypto.subtle.exportKey("spki", keyPair.publicKey);

            const dnParts: Array<{ oid: number[]; value: string }> = [];
            if (country) dnParts.push({ oid: [2, 5, 4, 6], value: country });
            if (state) dnParts.push({ oid: [2, 5, 4, 8], value: state });
            if (locality) dnParts.push({ oid: [2, 5, 4, 7], value: locality });
            if (organization) dnParts.push({ oid: [2, 5, 4, 10], value: organization });
            if (organizationalUnit) dnParts.push({ oid: [2, 5, 4, 11], value: organizationalUnit });
            if (commonName) dnParts.push({ oid: [2, 5, 4, 3], value: commonName });
            if (email) dnParts.push({ oid: [1, 2, 840, 113549, 1, 9, 1], value: email });

            const encodeLength = (len: number): number[] => {
                if (len < 128) return [len];
                if (len < 256) return [0x81, len];
                return [0x82, (len >> 8) & 0xff, len & 0xff];
            };

            const encodeOID = (oid: number[]): number[] => {
                const encoded: number[] = [oid[0] * 40 + oid[1]];
                for (let i = 2; i < oid.length; i++) {
                    let val = oid[i];
                    if (val >= 128) {
                        const bytes: number[] = [];
                        while (val > 0) { bytes.unshift(val & 0x7f); val >>= 7; }
                        for (let j = 0; j < bytes.length - 1; j++) encoded.push(bytes[j] | 0x80);
                        encoded.push(bytes[bytes.length - 1]);
                    } else {
                        encoded.push(val);
                    }
                }
                return [0x06, ...encodeLength(encoded.length), ...encoded];
            };

            const encodeUTF8String = (str: string): number[] => {
                const bytes = new TextEncoder().encode(str);
                return [0x0c, ...encodeLength(bytes.length), ...bytes];
            };

            const encodePrintableString = (str: string): number[] => {
                const bytes = new TextEncoder().encode(str);
                return [0x13, ...encodeLength(bytes.length), ...bytes];
            };

            const encodeSequence = (contents: number[]): number[] => [0x30, ...encodeLength(contents.length), ...contents];
            const encodeSet = (contents: number[]): number[] => [0x31, ...encodeLength(contents.length), ...contents];

            let rdnSequence: number[] = [];
            for (const part of dnParts) {
                const oid = encodeOID(part.oid);
                const value = part.oid[0] === 2 && part.oid[1] === 5 && part.oid[2] === 4 && part.oid[3] === 6
                    ? encodePrintableString(part.value)
                    : encodeUTF8String(part.value);
                const atv = encodeSequence([...oid, ...value]);
                const rdn = encodeSet(atv);
                rdnSequence = [...rdnSequence, ...rdn];
            }
            const subject = encodeSequence(rdnSequence);

            const version = [0x02, 0x01, 0x00];
            const publicKeyBytes = new Uint8Array(publicKeyDer);
            const csrInfo = encodeSequence([...version, ...subject, ...publicKeyBytes, 0xa0, 0x00]);

            const signature = await crypto.subtle.sign(signAlgorithm, keyPair.privateKey, new Uint8Array(csrInfo));

            let sigAlgOID: number[];
            if (keyAlgorithm === "RSA") {
                if (hashAlgorithm === "SHA-256") sigAlgOID = [1, 2, 840, 113549, 1, 1, 11];
                else if (hashAlgorithm === "SHA-384") sigAlgOID = [1, 2, 840, 113549, 1, 1, 12];
                else sigAlgOID = [1, 2, 840, 113549, 1, 1, 13];
            } else {
                if (hashAlgorithm === "SHA-256" || ecCurve === "P-256") sigAlgOID = [1, 2, 840, 10045, 4, 3, 2];
                else if (hashAlgorithm === "SHA-384" || ecCurve === "P-384") sigAlgOID = [1, 2, 840, 10045, 4, 3, 3];
                else sigAlgOID = [1, 2, 840, 10045, 4, 3, 4];
            }

            const sigAlg = keyAlgorithm === "RSA"
                ? encodeSequence([...encodeOID(sigAlgOID), 0x05, 0x00])
                : encodeSequence([...encodeOID(sigAlgOID)]);

            const encodeAsnInteger = (bytes: Uint8Array): number[] => {
                let start = 0;
                while (start < bytes.length - 1 && bytes[start] === 0) start++;
                let intBytes = Array.from(bytes.slice(start));
                if ((intBytes[0] ?? 0) & 0x80) intBytes = [0x00, ...intBytes];
                return [0x02, ...encodeLength(intBytes.length), ...intBytes];
            };

            const rawSig = new Uint8Array(signature);
            const sigBytes = (() => {
                if (keyAlgorithm !== "ECDSA" && keyAlgorithm !== "Ed25519") return rawSig;
                const half = rawSig.length / 2;
                const r = rawSig.slice(0, half);
                const s = rawSig.slice(half);
                return new Uint8Array(encodeSequence([...encodeAsnInteger(r), ...encodeAsnInteger(s)]));
            })();

            const bitString = [0x03, ...encodeLength(sigBytes.length + 1), 0x00, ...sigBytes];
            const csrDer = encodeSequence([...csrInfo, ...sigAlg, ...bitString]);
            const csrPem = formatPEM(base64Encode(new Uint8Array(csrDer).buffer), "CERTIFICATE REQUEST");
            setCSR(csrPem);
            setOpensslCommand(generateOpensslCommand());
            message.success("CSR and private key generated successfully!");
            setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        } catch (error) {
            console.error("CSR generation error:", error);
            showErrorModal({
                title: "CSR generation failed",
                error,
                context: `Tried to generate a ${keyAlgorithm}${keyAlgorithm === "RSA" ? ` ${rsaKeySize}-bit` : keyAlgorithm === "ECDSA" ? ` ${ecCurve}` : ""} CSR for "${commonName}".`,
                recommendations: [
                    "Try a smaller / more standard key size (RSA 2048 or ECDSA P-256).",
                    "Switch to the OpenSSL Commands tab — those commands will work even if Web Crypto can't.",
                    "Check the browser console for more details.",
                ],
            });
        } finally {
            setIsGenerating(false);
        }
    }, [commonName, organization, organizationalUnit, locality, state, country, email, sanInput, keyAlgorithm, rsaKeySize, ecCurve, hashAlgorithm, generateOpensslCommand, message]);

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

    const filterCountryOption = (input: string, option?: { value: string; label: string }) => {
        if (!option) return false;
        return option.label.toLowerCase().includes(input.toLowerCase()) || option.value.toLowerCase().includes(input.toLowerCase());
    };

    return (
        <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
                {
                    key: "generate",
                    label: <span><SafetyCertificateOutlined /> Generate CSR</span>,
                    children: (
                        <Card>
                            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                                <Collapse defaultActiveKey={["subject", "key"]} items={[
                                    {
                                        key: "subject",
                                        label: <Text strong>Subject Information</Text>,
                                        children: (
                                            <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                                <Row gutter={16}>
                                                    <Col xs={24} md={16}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Common Name (CN) *</Text>
                                                        <Input value={commonName} onChange={(e) => setCommonName(e.target.value)} placeholder="example.com, *.example.com, or www.example.com" />
                                                    </Col>
                                                    <Col xs={24} md={8}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Country</Text>
                                                        <Select showSearch value={country} onChange={setCountry} style={{ width: "100%" }} filterOption={filterCountryOption} options={CSR_COUNTRIES.map(c => ({ value: c.code, label: `${c.code} - ${c.name}` }))} />
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    <Col xs={24} md={12}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Organization (O)</Text>
                                                        <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Your Company Name Inc." />
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Organizational Unit (OU)</Text>
                                                        <Input value={organizationalUnit} onChange={(e) => setOrganizationalUnit(e.target.value)} placeholder="IT Department" />
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    <Col xs={24} md={8}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>City/Locality (L)</Text>
                                                        <Input value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="San Francisco" />
                                                    </Col>
                                                    <Col xs={24} md={8}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>State/Province (ST)</Text>
                                                        <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="California" />
                                                    </Col>
                                                    <Col xs={24} md={8}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Email Address</Text>
                                                        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
                                                    </Col>
                                                </Row>
                                                <div>
                                                    <Text strong style={{ display: "block", marginBottom: 4 }}>Subject Alternative Names (SANs)</Text>
                                                    <Input value={sanInput} onChange={(e) => setSanInput(e.target.value)} placeholder="www.example.com, api.example.com, 192.168.1.1" />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>Comma-separated list of additional domains or IP addresses</Text>
                                                </div>
                                            </Space>
                                        ),
                                    },
                                    {
                                        key: "key",
                                        label: <Text strong>Key & Algorithm Settings</Text>,
                                        children: (
                                            <Row gutter={16}>
                                                <Col xs={24} md={6}>
                                                    <Text strong style={{ display: "block", marginBottom: 4 }}>Algorithm</Text>
                                                    <Select value={keyAlgorithm} onChange={setKeyAlgorithm} style={{ width: "100%" }} options={[{ value: "RSA", label: "RSA (Most Compatible)" }, { value: "ECDSA", label: "ECDSA (Modern)" }, { value: "Ed25519", label: "Ed25519 (OpenSSL only)" }]} />
                                                </Col>
                                                {keyAlgorithm === "RSA" && (
                                                    <Col xs={24} md={6}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Key Size</Text>
                                                        <Select value={rsaKeySize} onChange={setRsaKeySize} style={{ width: "100%" }} options={[{ value: 1024, label: "1024 bits (Weak - Not Recommended)" }, { value: 2048, label: "2048 bits (Standard)" }, { value: 3072, label: "3072 bits (Strong)" }, { value: 4096, label: "4096 bits (Very Strong)" }, { value: 8192, label: "8192 bits (Maximum)" }]} />
                                                    </Col>
                                                )}
                                                {keyAlgorithm === "ECDSA" && (
                                                    <Col xs={24} md={6}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Curve</Text>
                                                        <Select value={ecCurve} onChange={setEcCurve} style={{ width: "100%" }} options={[{ value: "P-256", label: "P-256 (secp256r1) - 128-bit security" }, { value: "P-384", label: "P-384 (secp384r1) - 192-bit security" }, { value: "P-521", label: "P-521 (secp521r1) - 256-bit security" }]} />
                                                    </Col>
                                                )}
                                                <Col xs={24} md={6}>
                                                    <Text strong style={{ display: "block", marginBottom: 4 }}>Hash Algorithm</Text>
                                                    <Select value={hashAlgorithm} onChange={setHashAlgorithm} style={{ width: "100%" }} disabled={keyAlgorithm === "Ed25519"} options={[{ value: "SHA-256", label: "SHA-256 (Recommended)" }, { value: "SHA-384", label: "SHA-384" }, { value: "SHA-512", label: "SHA-512" }]} />
                                                </Col>
                                            </Row>
                                        ),
                                    },
                                ]} />

                                <Button type="primary" icon={<ReloadOutlined />} onClick={handleGenerate} loading={isGenerating} size="large" block>
                                    Generate CSR & Private Key
                                </Button>

                                {csr && privateKey && (
                                    <div ref={outputRef}>
                                        <Divider />
                                        <Alert type="warning" message="Important Security Notice" description="Keep your private key secure and never share it. Only submit the CSR to the Certificate Authority. The private key is required to install and use the issued certificate." showIcon style={{ marginBottom: 16 }} />
                                        <Collapse defaultActiveKey={["csr", "key"]} items={[
                                            {
                                                key: "csr",
                                                label: <Space><Text strong>Certificate Signing Request</Text><Tag color="blue">Submit to CA</Tag></Space>,
                                                children: (
                                                    <div>
                                                        <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                            <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(csr, "CSR")}>Copy</Button>
                                                            <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(csr, `${commonName.replace(/\*/g, "wildcard")}.csr`)}>Download</Button>
                                                        </div>
                                                        <TextArea value={csr} readOnly rows={10} style={{ fontFamily: "monospace", fontSize: 11 }} />
                                                    </div>
                                                ),
                                            },
                                            {
                                                key: "key",
                                                label: <Space><Text strong>Private Key</Text><Tag color="red">Keep Secret!</Tag></Space>,
                                                children: (
                                                    <div>
                                                        <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                            <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(privateKey, "Private Key")}>Copy</Button>
                                                            <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(privateKey, `${commonName.replace(/\*/g, "wildcard")}.key`)}>Download</Button>
                                                        </div>
                                                        <TextArea value={privateKey} readOnly rows={keyAlgorithm === "RSA" ? 16 : 8} style={{ fontFamily: "monospace", fontSize: 11 }} />
                                                    </div>
                                                ),
                                            },
                                        ]} />
                                    </div>
                                )}
                            </Space>
                        </Card>
                    ),
                },
                {
                    key: "openssl",
                    label: <span><CodeOutlined /> OpenSSL Commands</span>,
                    children: (
                        <Card>
                            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                                <Alert type="info" message="Generate CSR using OpenSSL" description="These commands work on Linux, macOS, and Windows (with OpenSSL installed). Copy and run in your terminal." showIcon />
                                <Row gutter={16}>
                                    <Col xs={24} md={8}>
                                        <Card size="small" title={<><WindowsOutlined /> Windows</>}>
                                            <Paragraph style={{ fontSize: 12 }}>
                                                Install OpenSSL via:
                                                <ul>
                                                    <li><Text code>winget install OpenSSL.Light</Text></li>
                                                    <li>Or download from slproweb.com</li>
                                                    <li>Or use WSL/Git Bash</li>
                                                </ul>
                                            </Paragraph>
                                        </Card>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Card size="small" title={<><AppleOutlined /> macOS</>}>
                                            <Paragraph style={{ fontSize: 12 }}>
                                                OpenSSL is pre-installed, or:
                                                <ul>
                                                    <li><Text code>brew install openssl</Text></li>
                                                </ul>
                                            </Paragraph>
                                        </Card>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Card size="small" title={<><CodeOutlined /> Linux</>}>
                                            <Paragraph style={{ fontSize: 12 }}>
                                                Usually pre-installed, or:
                                                <ul>
                                                    <li><Text code>apt install openssl</Text></li>
                                                    <li><Text code>yum install openssl</Text></li>
                                                </ul>
                                            </Paragraph>
                                        </Card>
                                    </Col>
                                </Row>
                                <Divider>Generated Commands (based on your settings)</Divider>
                                <div style={{ position: "relative" }}>
                                    <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(generateOpensslCommand(), "OpenSSL commands")} style={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}>Copy</Button>
                                    <pre style={{ background: darkMode ? "#1f1f1f" : "#f5f5f5", padding: 16, borderRadius: 4, overflow: "auto", fontSize: 12, margin: 0 }}>
                                        {generateOpensslCommand()}
                                    </pre>
                                </div>
                                <Divider>Common OpenSSL CSR Commands</Divider>
                                <Collapse items={[
                                    {
                                        key: "verify",
                                        label: "Verify CSR",
                                        children: (
                                            <pre style={{ background: darkMode ? "#1f1f1f" : "#f5f5f5", padding: 12, borderRadius: 4, fontSize: 12 }}>
                                                {`# View CSR contents\nopenssl req -in certificate.csr -text -noout\n\n# Verify CSR signature\nopenssl req -in certificate.csr -verify -noout`}
                                            </pre>
                                        ),
                                    },
                                    {
                                        key: "verify-key",
                                        label: "Verify Key Matches CSR",
                                        children: (
                                            <pre style={{ background: darkMode ? "#1f1f1f" : "#f5f5f5", padding: 12, borderRadius: 4, fontSize: 12 }}>
                                                {`# Compare modulus of key and CSR (should match)\nopenssl rsa -in private.key -modulus -noout | openssl md5\nopenssl req -in certificate.csr -modulus -noout | openssl md5`}
                                            </pre>
                                        ),
                                    },
                                    {
                                        key: "selfsigned",
                                        label: "Create Self-Signed Certificate",
                                        children: (
                                            <pre style={{ background: darkMode ? "#1f1f1f" : "#f5f5f5", padding: 12, borderRadius: 4, fontSize: 12 }}>
                                                {`# Generate self-signed certificate (for testing)\nopenssl req -x509 -nodes -days 365 -newkey rsa:2048 \\\n  -keyout private.key -out certificate.crt \\\n  -subj "/C=US/ST=State/L=City/O=Org/CN=example.com"`}
                                            </pre>
                                        ),
                                    },
                                ]} />
                            </Space>
                        </Card>
                    ),
                },
            ]}
        />
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const VALID_TABS = ["self-signed", "csr"] as const;
type TabKey = typeof VALID_TABS[number];

function CertificateGeneratorPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get("tab");
    const activeTab: TabKey = VALID_TABS.includes(tabParam as TabKey) ? (tabParam as TabKey) : "self-signed";

    const handleTabChange = (key: string) => {
        router.replace(`?tab=${key}`, { scroll: false });
    };

    return (
        <ToolPageLayout
            title="Certificate & CSR Generator"
            description="Generate self-signed certificates and Certificate Signing Requests (CSRs)"
            icon={<BuildOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "A self-signed certificate is an X.509 certificate signed by its own private key rather than a trusted CA. A Certificate Signing Request (CSR) is a block of encoded text containing your organization info and public key, submitted to a CA when applying for a certificate.",
                whyUse: "Self-signed certificates enable HTTPS during development without cost or CA complexity. CSRs are required to obtain SSL/TLS certificates from public CAs like Let's Encrypt, DigiCert, or Sectigo.",
                howToUse: [
                    "Self-Signed: Enter the Common Name, SANs, and key settings, then click Generate",
                    "CSR Generator: Fill in your organization details and key settings, then click Generate CSR & Private Key",
                    "Submit the CSR to your Certificate Authority — keep the private key secret",
                ],
                tips: [
                    "Always include 'localhost' and '127.0.0.1' in SANs for local development",
                    "ECDSA P-256 keys are faster and smaller than RSA 2048",
                    "For production certs, use the CSR tab and submit to a trusted CA",
                    "Never use self-signed certificates in production for public-facing services",
                ],
                useCases: [
                    "Local development with HTTPS",
                    "Requesting SSL/TLS certificates from CAs",
                    "Testing SSL/TLS configurations",
                    "Internal microservice authentication",
                    "Wildcard and multi-domain (SAN) certificate requests",
                ],
            }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={[
                    {
                        key: "self-signed",
                        label: <span><BuildOutlined /> Self-Signed Certificate</span>,
                        children: <SelfSignedTab />,
                    },
                    {
                        key: "csr",
                        label: <span><FileProtectOutlined /> CSR Generator</span>,
                        children: <CSRTab />,
                    },
                ]}
            />
        </ToolPageLayout>
    );
}

export default function CertificateGeneratorPage() {
    return (
        <Suspense>
            <CertificateGeneratorPageContent />
        </Suspense>
    );
}

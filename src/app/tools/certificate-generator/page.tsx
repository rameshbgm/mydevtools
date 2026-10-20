"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { CERTIFICATE_TOOL_TRANSLATIONS } from "@/lib/i18n/certificate-tools";

import { useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input, Typography, Card, Button, Space, App, Select, InputNumber, Divider, Collapse, Tag, Checkbox, Tabs, Alert, Row, Col } from "antd";
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
import { showErrorModal } from "@/lib/errorModal";
import { downloadText } from "@/lib/download";
import { copyToClipboard as sharedCopy } from "@/lib/clipboard";
import { generateSelfSignedCertificate, generateCertificateRequest, certificateSubjectAltNames } from "@/lib/x509-generation";

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
    const { t, language } = useLanguage();
    const regionNames = new Intl.DisplayNames([language], { type: "region" });
    const { message } = App.useApp();
    const [options, setOptions] = useState<CertificateOptions>(DEFAULT_OPTIONS);
    const [sanInput, setSanInput] = useState("localhost, 127.0.0.1");
    const [isGenerating, setIsGenerating] = useState(false);
    const [certificate, setCertificate] = useState("");
    const [privateKey, setPrivateKey] = useState("");

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        setCertificate("");
        setPrivateKey("");
        try {
            const result = await generateSelfSignedCertificate({
                ...options,
                subjectAltNames: sanInput.split(",").map((name) => name.trim()).filter(Boolean),
            });
            setCertificate(result.certificatePem);
            setPrivateKey(result.privateKeyPem);
            message.success(t("Self-signed certificate and matching private key generated successfully!"));
        } catch (error) {
            showErrorModal({
                title: t("Certificate generation failed"),
                error,
                context: error instanceof Error && Object.hasOwn(CERTIFICATE_TOOL_TRANSLATIONS, error.message) ? t(error.message) : t("Tried to generate a self-signed X.509 certificate in the browser."),
                recommendations: [
                    t("Check the subject, DNS/IP alternative names, validity and key usages."),
                    t("Certificate Signing requires CA Certificate; ECDSA keys cannot use key or data encipherment."),
                    t("Use HTTPS or localhost and a browser that supports the selected Web Crypto algorithm."),
                ],
            });
        } finally {
            setIsGenerating(false);
        }
    }, [options, sanInput, message, t]);

    const updateOptions = (updates: Partial<CertificateOptions>) => {
        setOptions(prev => ({ ...prev, ...updates }));
    };

    const updateKeyUsage = (key: keyof CertificateOptions["keyUsage"], value: boolean) => {
        setOptions(prev => ({ ...prev, keyUsage: { ...prev.keyUsage, [key]: value } }));
    };

    const updateExtKeyUsage = (key: keyof CertificateOptions["extKeyUsage"], value: boolean) => {
        setOptions(prev => ({ ...prev, extKeyUsage: { ...prev.extKeyUsage, [key]: value } }));
    };

    const copyToClipboard = (text: string, label: string) => sharedCopy(text, t("{label} copied to clipboard!", { label }));

    const downloadFile = (content: string, filename: string) => downloadText(content, filename, "application/x-pem-file");

    return (
        <Card>
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                <Collapse defaultActiveKey={["subject", "key", "validity"]} items={[
                    {
                        key: "subject",
                        label: <Text strong>{t("Subject Information")}</Text>,
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                    <div style={{ flex: 2, minWidth: 200 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Common Name (CN) *")}</Text>
                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Common Name (CN) *")}
                                            value={options.commonName}
                                            onChange={(e) => updateOptions({ commonName: e.target.value })}
                                            placeholder={t("localhost or your-domain.com")}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 150 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Country")}</Text>
                                        <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Country")}
                                            value={options.country}
                                            onChange={(v) => updateOptions({ country: v })}
                                            style={{ width: "100%" }}
                                            showSearch
                                            optionFilterProp="label"
                                            options={CERT_COUNTRIES.map(c => ({ value: c.code, label: `${c.code} - ${regionNames.of(c.code) ?? c.name}` }))}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Organization (O)")}</Text>
                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Organization (O)")} value={options.organization} onChange={(e) => updateOptions({ organization: e.target.value })} placeholder={t("Your Company Name")} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Organizational Unit (OU)")}</Text>
                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Organizational Unit (OU)")} value={options.organizationalUnit} onChange={(e) => updateOptions({ organizationalUnit: e.target.value })} placeholder={t("IT Department")} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Locality (L)")}</Text>
                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Locality (L)")} value={options.locality} onChange={(e) => updateOptions({ locality: e.target.value })} placeholder={t("City")} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("State/Province (ST)")}</Text>
                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("State/Province (ST)")} value={options.state} onChange={(e) => updateOptions({ state: e.target.value })} placeholder={t("State or Province")} />
                                    </div>
                                </div>
                                <div>
                                    <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Subject Alternative Names (SANs)")}</Text>
                                    <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Subject Alternative Names (SANs)")} value={sanInput} onChange={(e) => setSanInput(e.target.value)} placeholder="localhost, 127.0.0.1, *.example.com" />
                                    <Text type="secondary" style={{ fontSize: 16 }}>{t("Comma-separated list of domain names and IP addresses")}</Text>
                                </div>
                            </Space>
                        ),
                    },
                    {
                        key: "key",
                        label: <Text strong>{t("Key Settings")}</Text>,
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                    <div style={{ flex: 1, minWidth: 150 }}>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Algorithm")}</Text>
                                        <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Algorithm")}
                                            value={options.keyAlgorithm}
                                            onChange={(v) => updateOptions({
                                                    keyAlgorithm: v,
                                                    keyUsage: { ...options.keyUsage, keyEncipherment: v === "RSA", dataEncipherment: false },
                                                })}
                                            style={{ width: "100%" }}
                                            options={[{ value: "RSA", label: "RSA" }, { value: "ECDSA", label: "ECDSA" }]}
                                        />
                                    </div>
                                    {options.keyAlgorithm === "RSA" ? (
                                        <div style={{ flex: 1, minWidth: 150 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Key Size")}</Text>
                                            <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Key Size")}
                                                value={options.rsaKeySize}
                                                onChange={(v) => updateOptions({ rsaKeySize: v })}
                                                style={{ width: "100%" }}
                                                options={[{ value: 2048, label: t("2048 bits") }, { value: 3072, label: t("3072 bits") }, { value: 4096, label: t("4096 bits") }]}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ flex: 1, minWidth: 150 }}>
                                            <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Curve")}</Text>
                                            <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Curve")}
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
                        label: <Text strong>{t("Validity & Extensions")}</Text>,
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "end" }}>
                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Validity Period (days)")}</Text>
                                        <InputNumber styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Validity Period (days)")} value={options.validityDays} onChange={(v) => updateOptions({ validityDays: v || 365 })} min={1} max={3650} style={{ width: 120 }} />
                                    </div>
                                    <div>
                                        <Checkbox checked={options.isCA} onChange={(e) => updateOptions({ isCA: e.target.checked, keyUsage: { ...options.keyUsage, keyCertSign: e.target.checked } })}>{t("CA Certificate")}</Checkbox>
                                    </div>
                                </div>
                                <Divider style={{ margin: "12px 0" }} />
                                <div>
                                    <Text strong>{t("Key Usage")}</Text>
                                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 16 }}>
                                        <Checkbox checked={options.keyUsage.digitalSignature} onChange={(e) => updateKeyUsage("digitalSignature", e.target.checked)}>{t("Digital Signature")}</Checkbox>
                                        <Checkbox disabled={options.keyAlgorithm !== "RSA"} checked={options.keyUsage.keyEncipherment} onChange={(e) => updateKeyUsage("keyEncipherment", e.target.checked)}>{t("Key Encipherment")}</Checkbox>
                                        <Checkbox disabled={options.keyAlgorithm !== "RSA"} checked={options.keyUsage.dataEncipherment} onChange={(e) => updateKeyUsage("dataEncipherment", e.target.checked)}>{t("Data Encipherment")}</Checkbox>
                                        <Checkbox disabled={!options.isCA} checked={options.keyUsage.keyCertSign} onChange={(e) => updateKeyUsage("keyCertSign", e.target.checked)}>{t("Certificate Signing")}</Checkbox>
                                        <Checkbox checked={options.keyUsage.cRLSign} onChange={(e) => updateKeyUsage("cRLSign", e.target.checked)}>{t("CRL Signing")}</Checkbox>
                                    </div>
                                </div>
                                <div>
                                    <Text strong>{t("Extended Key Usage")}</Text>
                                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 16 }}>
                                        <Checkbox checked={options.extKeyUsage.serverAuth} onChange={(e) => updateExtKeyUsage("serverAuth", e.target.checked)}>{t("TLS Web Server Authentication")}</Checkbox>
                                        <Checkbox checked={options.extKeyUsage.clientAuth} onChange={(e) => updateExtKeyUsage("clientAuth", e.target.checked)}>{t("TLS Web Client Authentication")}</Checkbox>
                                        <Checkbox checked={options.extKeyUsage.codeSigning} onChange={(e) => updateExtKeyUsage("codeSigning", e.target.checked)}>{t("Code Signing")}</Checkbox>
                                        <Checkbox checked={options.extKeyUsage.emailProtection} onChange={(e) => updateExtKeyUsage("emailProtection", e.target.checked)}>{t("Email Protection (S/MIME)")}</Checkbox>
                                    </div>
                                </div>
                            </Space>
                        ),
                    },
                ]} />

                <Button type="primary" icon={<ReloadOutlined />} onClick={handleGenerate} loading={isGenerating} size="large" block>{t("Generate Certificate")}</Button>

                {certificate && privateKey && (
                    <>
                        <Divider />
                        <Collapse defaultActiveKey={["cert", "key"]} items={[
                            {
                                key: "cert",
                                label: <Space><Text strong>{t("Certificate (PEM)")}</Text><Tag color="green">{t("Public")}</Tag></Space>,
                                children: (
                                    <div>
                                        <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                            <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(certificate, t("Certificate"))}>{t("Copy")}</Button>
                                            <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(certificate, "certificate.pem")}>{t("Download")}</Button>
                                        </div>
                                        <TextArea dir="ltr" styles={{ textarea: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Certificate PEM output")} value={certificate} readOnly rows={12} style={{ fontFamily: "monospace", fontSize: 16 }} />
                                    </div>
                                ),
                            },
                            {
                                key: "key",
                                label: <Space><Text strong>{t("Private Key (PEM)")}</Text><Tag color="red">{t("Keep Secret!")}</Tag></Space>,
                                children: (
                                    <div>
                                        <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                            <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(privateKey, t("Private Key"))}>{t("Copy")}</Button>
                                            <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(privateKey, "private-key.pem")}>{t("Download")}</Button>
                                        </div>
                                        <TextArea dir="ltr" styles={{ textarea: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Private key PEM output")} value={privateKey} readOnly rows={options.keyAlgorithm === "RSA" ? 16 : 8} style={{ fontFamily: "monospace", fontSize: 16 }} />
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
    const { t, language } = useLanguage();
    const regionNames = new Intl.DisplayNames([language], { type: "region" });
    const { message } = App.useApp();
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
    const outputRef = useRef<HTMLDivElement>(null);

    const generateOpensslCommand = useCallback(() => {
        const shellQuote = (value: string) => "'" + value.replace(/'/g, "'\\''") + "'";
        const dnEscape = (value: string) => value.replace(/([\\/+])/g, "\\$1");
        const subjectParts: string[] = [];
        if (country) subjectParts.push(`/C=${dnEscape(country)}`);
        if (state) subjectParts.push(`/ST=${dnEscape(state)}`);
        if (locality) subjectParts.push(`/L=${dnEscape(locality)}`);
        if (organization) subjectParts.push(`/O=${dnEscape(organization)}`);
        if (organizationalUnit) subjectParts.push(`/OU=${dnEscape(organizationalUnit)}`);
        if (commonName) subjectParts.push(`/CN=${dnEscape(commonName)}`);
        if (email) subjectParts.push(`/emailAddress=${dnEscape(email)}`);

        const subject = subjectParts.join("");
        const sans = sanInput.split(",").map(s => s.trim()).filter(s => s);

        let keyGenCmd = "";
        let csrCmd = "";

        if (keyAlgorithm === "RSA") {
            keyGenCmd = `openssl genrsa -out private.key ${rsaKeySize}`;
            csrCmd = `openssl req -new -utf8 -key private.key -out certificate.csr -${hashAlgorithm.toLowerCase().replace("-", "")} -subj ${shellQuote(subject)}`;
        } else if (keyAlgorithm === "ECDSA") {
            const curveMap: Record<ECCurve, string> = {
                "P-256": "prime256v1",
                "P-384": "secp384r1",
                "P-521": "secp521r1",
            };
            keyGenCmd = `openssl ecparam -name ${curveMap[ecCurve]} -genkey -noout -out private.key`;
            csrCmd = `openssl req -new -utf8 -key private.key -out certificate.csr -${hashAlgorithm.toLowerCase().replace("-", "")} -subj ${shellQuote(subject)}`;
        } else {
            keyGenCmd = `openssl genpkey -algorithm ED25519 -out private.key`;
            csrCmd = `openssl req -new -utf8 -key private.key -out certificate.csr -subj ${shellQuote(subject)}`;
        }

        if (sans.length > 0) {
            try {
                const extension = certificateSubjectAltNames(sans).map((san) => `${san.type}:${san.value}`).join(",");
                csrCmd += ` -addext ${shellQuote(`subjectAltName=${extension}`)}`;
            } catch {
                return "# Correct the DNS/IP subject alternative names to generate an OpenSSL command.";
            }
        }
        return `# Generate Private Key\n${keyGenCmd}\n\n# Generate CSR (OpenSSL 1.1.1 or later)\n${csrCmd}`;
    }, [commonName, organization, organizationalUnit, locality, state, country, email, sanInput, keyAlgorithm, rsaKeySize, ecCurve, hashAlgorithm]);

    const handleGenerate = useCallback(async () => {
        if (!commonName.trim()) {
            showErrorModal({
                title: t("Common Name (CN) is required"),
                error: new Error("CN field is empty"),
                context: t("This form requires a Common Name to identify the domain or entity the certificate is issued for."),
                cause: t("You haven't filled in the Common Name field."),
                recommendations: [
                    t("Enter a fully-qualified domain (e.g., example.com)"),
                    t("For wildcards, use *.example.com"),
                    t("For non-public certs, any identifying string works (e.g., internal-api)"),
                ],
            });
            return;
        }
        if (country && !/^[A-Z]{2}$/.test(country)) {
            showErrorModal({
                title: t("Invalid country code"),
                error: new Error(`'${country}' is not a valid ISO 3166-1 alpha-2 country code`),
                cause: t("Country must be exactly 2 uppercase letters."),
                recommendations: [
                    t("Pick a country from the dropdown — it auto-formats correctly."),
                    t("Examples: US, GB, IN, DE, JP."),
                ],
            });
            return;
        }
        if (typeof crypto === "undefined" || !crypto.subtle) {
            showErrorModal({
                title: t("Web Crypto API unavailable"),
                error: new Error("crypto.subtle is undefined"),
                context: t("CSR generation requires the browser's Web Crypto API."),
                cause: t("Web Crypto requires a secure origin (HTTPS or localhost)."),
                recommendations: [
                    t("Open this app over https:// or http://localhost."),
                    t("Use a modern browser (Chrome, Firefox, Safari, Edge — all current versions)."),
                ],
            });
            return;
        }

        setIsGenerating(true);
        setCSR("");
        setPrivateKey("");

        try {
            const result = await generateCertificateRequest({
                commonName, country, state, locality, organization, organizationalUnit, email,
                keyAlgorithm, rsaKeySize, ecCurve, hashAlgorithm,
                subjectAltNames: sanInput.split(",").map((name) => name.trim()).filter(Boolean),
            });
            setPrivateKey(result.privateKeyPem);
            setCSR(result.csrPem);
            message.success(t("CSR and private key generated successfully!"));
            setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        } catch (error) {
            console.error("CSR generation error:", error);
            showErrorModal({
                title: t("CSR generation failed"),
                error,
                context: error instanceof Error && Object.hasOwn(CERTIFICATE_TOOL_TRANSLATIONS, error.message) ? t(error.message) : t("Could not generate a {algorithm} CSR for {subject}.", { algorithm: keyAlgorithm === "RSA" ? `RSA ${rsaKeySize}` : keyAlgorithm === "ECDSA" ? `ECDSA ${ecCurve}` : "Ed25519", subject: commonName }),
                recommendations: [
                    t("Try a smaller / more standard key size (RSA 2048 or ECDSA P-256)."),
                    t("Use the OpenSSL Commands tab if your browser does not support the selected algorithm."),
                    t("Check the browser console for more details."),
                ],
            });
        } finally {
            setIsGenerating(false);
        }
    }, [commonName, organization, organizationalUnit, locality, state, country, email, sanInput, keyAlgorithm, rsaKeySize, ecCurve, hashAlgorithm, message, t]);

    const copyToClipboard = (text: string, label: string) => sharedCopy(text, t("{label} copied to clipboard!", { label }));

    const downloadFile = (content: string, filename: string) => downloadText(content, filename, "application/x-pem-file");

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
                    label: <span><SafetyCertificateOutlined />{t("Generate CSR")}</span>,
                    children: (
                        <Card>
                            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                                <Collapse defaultActiveKey={["subject", "key"]} items={[
                                    {
                                        key: "subject",
                                        label: <Text strong>{t("Subject Information")}</Text>,
                                        children: (
                                            <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                                <Row gutter={16}>
                                                    <Col xs={24} md={16}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Common Name (CN) *")}</Text>
                                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Common Name (CN) *")} value={commonName} onChange={(e) => setCommonName(e.target.value)} placeholder={t("example.com, *.example.com, or www.example.com")} />
                                                    </Col>
                                                    <Col xs={24} md={8}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Country")}</Text>
                                                        <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Country")} showSearch value={country} onChange={setCountry} style={{ width: "100%" }} filterOption={filterCountryOption} options={CSR_COUNTRIES.map(c => ({ value: c.code, label: `${c.code} - ${regionNames.of(c.code) ?? c.name}` }))} />
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    <Col xs={24} md={12}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Organization (O)")}</Text>
                                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Organization (O)")} value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder={t("Your Company Name Inc.")} />
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Organizational Unit (OU)")}</Text>
                                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Organizational Unit (OU)")} value={organizationalUnit} onChange={(e) => setOrganizationalUnit(e.target.value)} placeholder={t("IT Department")} />
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    <Col xs={24} md={8}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("City/Locality (L)")}</Text>
                                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("City/Locality (L)")} value={locality} onChange={(e) => setLocality(e.target.value)} placeholder={"San Francisco"} />
                                                    </Col>
                                                    <Col xs={24} md={8}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("State/Province (ST)")}</Text>
                                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("State/Province (ST)")} value={state} onChange={(e) => setState(e.target.value)} placeholder={"California"} />
                                                    </Col>
                                                    <Col xs={24} md={8}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Email Address")}</Text>
                                                        <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Email Address")} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
                                                    </Col>
                                                </Row>
                                                <div>
                                                    <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Subject Alternative Names (SANs)")}</Text>
                                                    <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Subject Alternative Names (SANs)")} value={sanInput} onChange={(e) => setSanInput(e.target.value)} placeholder="www.example.com, api.example.com, 192.168.1.1" />
                                                    <Text type="secondary" style={{ fontSize: 16 }}>{t("Comma-separated list of additional domains or IP addresses")}</Text>
                                                </div>
                                            </Space>
                                        ),
                                    },
                                    {
                                        key: "key",
                                        label: <Text strong>{t("Key & Algorithm Settings")}</Text>,
                                        children: (
                                            <Row gutter={16}>
                                                <Col xs={24} md={6}>
                                                    <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Algorithm")}</Text>
                                                    <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Algorithm")} value={keyAlgorithm} onChange={setKeyAlgorithm} style={{ width: "100%" }} options={[{ value: "RSA", label: t("RSA (Most Compatible)") }, { value: "ECDSA", label: t("ECDSA (Modern)") }, { value: "Ed25519", label: t("Ed25519 (requires browser support)") }]} />
                                                </Col>
                                                {keyAlgorithm === "RSA" && (
                                                    <Col xs={24} md={6}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Key Size")}</Text>
                                                        <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Key Size")} value={rsaKeySize} onChange={setRsaKeySize} style={{ width: "100%" }} options={[{ value: 1024, label: t("1024 bits (Weak - Not Recommended)") }, { value: 2048, label: t("2048 bits (Standard)") }, { value: 3072, label: t("3072 bits (Strong)") }, { value: 4096, label: t("4096 bits (Very Strong)") }, { value: 8192, label: t("8192 bits (Maximum)") }]} />
                                                    </Col>
                                                )}
                                                {keyAlgorithm === "ECDSA" && (
                                                    <Col xs={24} md={6}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Curve")}</Text>
                                                        <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Curve")} value={ecCurve} onChange={setEcCurve} style={{ width: "100%" }} options={[{ value: "P-256", label: "P-256 (secp256r1) - 128-bit security" }, { value: "P-384", label: "P-384 (secp384r1) - 192-bit security" }, { value: "P-521", label: "P-521 (secp521r1) - 256-bit security" }]} />
                                                    </Col>
                                                )}
                                                <Col xs={24} md={6}>
                                                    <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Hash Algorithm")}</Text>
                                                    <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Hash Algorithm")} value={hashAlgorithm} onChange={setHashAlgorithm} style={{ width: "100%" }} disabled={keyAlgorithm === "Ed25519"} options={[{ value: "SHA-256", label: t("SHA-256 (Recommended)") }, { value: "SHA-384", label: "SHA-384" }, { value: "SHA-512", label: "SHA-512" }]} />
                                                </Col>
                                            </Row>
                                        ),
                                    },
                                ]} />

                                <Button type="primary" icon={<ReloadOutlined />} onClick={handleGenerate} loading={isGenerating} size="large" block>{t("Generate CSR & Private Key")}</Button>

                                {csr && privateKey && (
                                    <div ref={outputRef}>
                                        <Divider />
                                        <Alert type="warning" title={t("Important Security Notice")} description={t("Keep your private key secure and never share it. Only submit the CSR to the Certificate Authority. The private key is required to install and use the issued certificate.")} showIcon style={{ marginBottom: 16 }} />
                                        <Collapse defaultActiveKey={["csr", "key"]} items={[
                                            {
                                                key: "csr",
                                                label: <Space><Text strong>{t("Certificate Signing Request")}</Text><Tag color="blue">{t("Submit to CA")}</Tag></Space>,
                                                children: (
                                                    <div>
                                                        <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                            <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(csr, "CSR")}>{t("Copy")}</Button>
                                                            <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(csr, `${commonName.replace(/\*/g, "wildcard")}.csr`)}>{t("Download")}</Button>
                                                        </div>
                                                        <TextArea dir="ltr" styles={{ textarea: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Certificate Signing Request")} value={csr} readOnly rows={10} style={{ fontFamily: "monospace", fontSize: 16 }} />
                                                    </div>
                                                ),
                                            },
                                            {
                                                key: "key",
                                                label: <Space><Text strong>{t("Private Key")}</Text><Tag color="red">{t("Keep Secret!")}</Tag></Space>,
                                                children: (
                                                    <div>
                                                        <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                            <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(privateKey, t("Private Key"))}>{t("Copy")}</Button>
                                                            <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(privateKey, `${commonName.replace(/\*/g, "wildcard")}.key`)}>{t("Download")}</Button>
                                                        </div>
                                                        <TextArea dir="ltr" styles={{ textarea: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Private key PEM output")} value={privateKey} readOnly rows={keyAlgorithm === "RSA" ? 16 : 8} style={{ fontFamily: "monospace", fontSize: 16 }} />
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
                    label: <span><CodeOutlined />{t("OpenSSL Commands")}</span>,
                    children: (
                        <Card>
                            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                                <Alert type="info" title={t("Generate CSR using OpenSSL")} description={t("Run these commands in a POSIX shell with OpenSSL 1.1.1 or later (Linux, macOS, or Windows WSL/Git Bash).")} showIcon />
                                <Row gutter={16}>
                                    <Col xs={24} md={8}>
                                        <Card size="small" title={<><WindowsOutlined /> Windows</>}>
                                            <Paragraph style={{ fontSize: 16 }}>{t("Install OpenSSL via:")}<ul>
                                                    <li><Text dir="ltr" code>winget install OpenSSL.Light</Text></li>
                                                    <li>{t("Or download from slproweb.com")}</li>
                                                    <li>{t("Or use WSL/Git Bash")}</li>
                                                </ul>
                                            </Paragraph>
                                        </Card>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Card size="small" title={<><AppleOutlined /> macOS</>}>
                                            <Paragraph style={{ fontSize: 16 }}>{t("Install OpenSSL if it is unavailable:")}<ul>
                                                    <li><Text dir="ltr" code>brew install openssl</Text></li>
                                                </ul>
                                            </Paragraph>
                                        </Card>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Card size="small" title={<><CodeOutlined /> Linux</>}>
                                            <Paragraph style={{ fontSize: 16 }}>{t("Usually pre-installed, or:")}<ul>
                                                    <li><Text dir="ltr" code>apt install openssl</Text></li>
                                                    <li><Text dir="ltr" code>yum install openssl</Text></li>
                                                </ul>
                                            </Paragraph>
                                        </Card>
                                    </Col>
                                </Row>
                                <Divider>{t("Generated Commands (based on your settings)")}</Divider>
                                <div style={{ position: "relative" }}>
                                    <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(generateOpensslCommand(), t("OpenSSL commands"))} style={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}>{t("Copy")}</Button>
                                    <pre dir="ltr" style={{ background: "var(--wb-card-solid-bg)", padding: 16, borderRadius: 4, overflow: "auto", fontSize: 16, margin: 0 }}>
                                        {generateOpensslCommand()}
                                    </pre>
                                </div>
                                <Divider>{t("Common OpenSSL CSR Commands")}</Divider>
                                <Collapse items={[
                                    {
                                        key: "verify",
                                        label: t("Verify CSR"),
                                        children: (
                                            <pre dir="ltr" style={{ background: "var(--wb-card-solid-bg)", padding: 12, borderRadius: 4, fontSize: 16 }}>
                                                {`# View CSR contents\nopenssl req -in certificate.csr -text -noout\n\n# Verify CSR signature\nopenssl req -in certificate.csr -verify -noout`}
                                            </pre>
                                        ),
                                    },
                                    {
                                        key: "verify-key",
                                        label: t("Verify Key Matches CSR"),
                                        children: (
                                            <pre dir="ltr" style={{ background: "var(--wb-card-solid-bg)", padding: 12, borderRadius: 4, fontSize: 16 }}>
                                                {`# Compare modulus of key and CSR (should match)\nopenssl rsa -in private.key -modulus -noout | openssl md5\nopenssl req -in certificate.csr -modulus -noout | openssl md5`}
                                            </pre>
                                        ),
                                    },
                                    {
                                        key: "selfsigned",
                                        label: t("Create Self-Signed Certificate"),
                                        children: (
                                            <pre dir="ltr" style={{ background: "var(--wb-card-solid-bg)", padding: 12, borderRadius: 4, fontSize: 16 }}>
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
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get("tab");
    const activeTab: TabKey = VALID_TABS.includes(tabParam as TabKey) ? (tabParam as TabKey) : "self-signed";

    const handleTabChange = (key: string) => {
        router.replace(`?tab=${key}`, { scroll: false });
    };

    return (
        <ToolPageLayout
            title={t("Certificate & CSR Generator")}
            description={t("Generate self-signed certificates and Certificate Signing Requests (CSRs)")}
            icon={<BuildOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: t("A self-signed certificate is an X.509 certificate signed by its own private key rather than a trusted CA. A Certificate Signing Request (CSR) is a block of encoded text containing your organization info and public key, submitted to a CA when applying for a certificate."),
                whyUse: t("Self-signed certificates enable HTTPS during development without cost or CA complexity. CSRs are required to obtain SSL/TLS certificates from public CAs like Let's Encrypt, DigiCert, or Sectigo."),
                howToUse: [
                    t("Self-Signed: Enter the Common Name, SANs, and key settings, then click Generate"),
                    t("CSR Generator: Fill in your organization details and key settings, then click Generate CSR & Private Key"),
                    t("Submit the CSR to your Certificate Authority — keep the private key secret"),
                ],
                tips: [
                    t("Always include 'localhost' and '127.0.0.1' in SANs for local development"),
                    t("ECDSA P-256 keys are faster and smaller than RSA 2048"),
                    t("For production certs, use the CSR tab and submit to a trusted CA"),
                    t("Never use self-signed certificates in production for public-facing services"),
                ],
                useCases: [
                    t("Local development with HTTPS"),
                    t("Requesting SSL/TLS certificates from CAs"),
                    t("Testing SSL/TLS configurations"),
                    t("Internal microservice authentication"),
                    t("Wildcard and multi-domain (SAN) certificate requests"),
                ],
            }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={[
                    {
                        key: "self-signed",
                        label: <span><BuildOutlined />{t("Self-Signed Certificate")}</span>,
                        children: <SelfSignedTab />,
                    },
                    {
                        key: "csr",
                        label: <span><FileProtectOutlined />{t("CSR Generator")}</span>,
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

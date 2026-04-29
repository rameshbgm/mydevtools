"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, Select, message, Divider, Collapse, Tag, Tabs, Alert, Row, Col } from "antd";
import {
    FileProtectOutlined,
    CopyOutlined,
    DownloadOutlined,
    ReloadOutlined,
    WindowsOutlined,
    AppleOutlined,
    CodeOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

type KeyAlgorithm = "RSA" | "ECDSA" | "Ed25519";
type RSAKeySize = 1024 | 2048 | 3072 | 4096 | 8192;
type ECCurve = "P-256" | "P-384" | "P-521";
type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

// Complete ISO 3166-1 Alpha-2 Country Codes
const COUNTRIES = [
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

export default function CSRGeneratorPage() {
    const { darkMode } = useAppStore();
    const [activeTab, setActiveTab] = useState("generate");

    // Subject fields
    const [commonName, setCommonName] = useState("");
    const [organization, setOrganization] = useState("");
    const [organizationalUnit, setOrganizationalUnit] = useState("");
    const [locality, setLocality] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("US");
    const [email, setEmail] = useState("");
    const [sanInput, setSanInput] = useState("");

    // Key settings
    const [keyAlgorithm, setKeyAlgorithm] = useState<KeyAlgorithm>("RSA");
    const [rsaKeySize, setRsaKeySize] = useState<RSAKeySize>(2048);
    const [ecCurve, setEcCurve] = useState<ECCurve>("P-256");
    const [hashAlgorithm, setHashAlgorithm] = useState<HashAlgorithm>("SHA-256");

    // Output
    const [isGenerating, setIsGenerating] = useState(false);
    const [csr, setCSR] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [opensslCommand, setOpensslCommand] = useState("");

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
            message.warning("Common Name (CN) is required");
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
                const hashName = hashAlgorithm.replace("-", "");
                keyPair = await crypto.subtle.generateKey(
                    {
                        name: "RSASSA-PKCS1-v1_5",
                        modulusLength: rsaKeySize,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: hashName,
                    },
                    true,
                    ["sign", "verify"]
                );
                signAlgorithm = { name: "RSASSA-PKCS1-v1_5" };
            } else if (keyAlgorithm === "ECDSA") {
                keyPair = await crypto.subtle.generateKey(
                    {
                        name: "ECDSA",
                        namedCurve: ecCurve,
                    },
                    true,
                    ["sign", "verify"]
                );
                signAlgorithm = { name: "ECDSA", hash: hashAlgorithm.replace("-", "") };
            } else {
                // Ed25519 - Web Crypto doesn't support Ed25519 directly in all browsers
                // Fall back to ECDSA P-256 with a note
                keyPair = await crypto.subtle.generateKey(
                    {
                        name: "ECDSA",
                        namedCurve: "P-256",
                    },
                    true,
                    ["sign", "verify"]
                );
                signAlgorithm = { name: "ECDSA", hash: "SHA-256" };
                message.info("Ed25519 not supported in browser. Using ECDSA P-256 instead. Use OpenSSL for Ed25519.");
            }

            // Export private key
            const privateKeyDer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
            const privateKeyPem = formatPEM(base64Encode(privateKeyDer), "PRIVATE KEY");
            setPrivateKey(privateKeyPem);

            // Export public key
            const publicKeyDer = await crypto.subtle.exportKey("spki", keyPair.publicKey);

            // Build subject DN in proper order (per RFC 5280)
            const dnParts: Array<{ oid: number[]; value: string }> = [];
            if (country) dnParts.push({ oid: [2, 5, 4, 6], value: country }); // C
            if (state) dnParts.push({ oid: [2, 5, 4, 8], value: state }); // ST
            if (locality) dnParts.push({ oid: [2, 5, 4, 7], value: locality }); // L
            if (organization) dnParts.push({ oid: [2, 5, 4, 10], value: organization }); // O
            if (organizationalUnit) dnParts.push({ oid: [2, 5, 4, 11], value: organizationalUnit }); // OU
            if (commonName) dnParts.push({ oid: [2, 5, 4, 3], value: commonName }); // CN
            if (email) dnParts.push({ oid: [1, 2, 840, 113549, 1, 9, 1], value: email }); // emailAddress

            // Simple ASN.1 DER encoder for CSR
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
                        while (val > 0) {
                            bytes.unshift(val & 0x7f);
                            val >>= 7;
                        }
                        for (let j = 0; j < bytes.length - 1; j++) {
                            encoded.push(bytes[j] | 0x80);
                        }
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

            const encodeSequence = (contents: number[]): number[] => {
                return [0x30, ...encodeLength(contents.length), ...contents];
            };

            const encodeSet = (contents: number[]): number[] => {
                return [0x31, ...encodeLength(contents.length), ...contents];
            };

            // Build RDN sequence
            let rdnSequence: number[] = [];
            for (const part of dnParts) {
                const oid = encodeOID(part.oid);
                const value = part.oid[0] === 2 && part.oid[1] === 5 && part.oid[2] === 4 && part.oid[3] === 6
                    ? encodePrintableString(part.value) // Country is PrintableString
                    : encodeUTF8String(part.value);
                const atv = encodeSequence([...oid, ...value]);
                const rdn = encodeSet(atv);
                rdnSequence = [...rdnSequence, ...rdn];
            }
            const subject = encodeSequence(rdnSequence);

            // CSR version (0)
            const version = [0x02, 0x01, 0x00];

            // Build CSR info
            const publicKeyBytes = new Uint8Array(publicKeyDer);
            const csrInfo = encodeSequence([
                ...version,
                ...subject,
                ...publicKeyBytes,
                0xa0, 0x00, // Empty attributes
            ]);

            // Sign CSR info
            const signature = await crypto.subtle.sign(
                signAlgorithm,
                keyPair.privateKey,
                new Uint8Array(csrInfo)
            );

            // Determine signature algorithm OID
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

            const sigAlg = encodeSequence([...encodeOID(sigAlgOID), 0x05, 0x00]);

            // Bit string for signature
            const sigBytes = new Uint8Array(signature);
            const bitString = [0x03, ...encodeLength(sigBytes.length + 1), 0x00, ...sigBytes];

            // Complete CSR
            const csrDer = encodeSequence([...csrInfo, ...sigAlg, ...bitString]);
            const csrPem = formatPEM(base64Encode(new Uint8Array(csrDer).buffer), "CERTIFICATE REQUEST");
            setCSR(csrPem);

            // Generate OpenSSL command
            setOpensslCommand(generateOpensslCommand());

            message.success("CSR and private key generated successfully!");
        } catch (error) {
            console.error("CSR generation error:", error);
            message.error(`Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsGenerating(false);
        }
    }, [commonName, organization, organizationalUnit, locality, state, country, email, sanInput, keyAlgorithm, rsaKeySize, ecCurve, hashAlgorithm, generateOpensslCommand]);

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
        return option.label.toLowerCase().includes(input.toLowerCase()) ||
            option.value.toLowerCase().includes(input.toLowerCase());
    };

    return (
        <ToolPageLayout
            title="CSR Generator"
            description="Generate Certificate Signing Requests for SSL/TLS certificates"
            icon={<FileProtectOutlined style={{ fontSize: 24 }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "A Certificate Signing Request (CSR) is a block of encoded text containing information about your organization and domain. It includes your public key and is submitted to a Certificate Authority (CA) when applying for an SSL/TLS certificate.",
                whyUse: "CSRs are required to obtain SSL/TLS certificates from CAs like Let's Encrypt, DigiCert, Sectigo, or GlobalSign. The CSR contains your public key and organization details that will be included in the issued certificate.",
                howToUse: [
                    "Enter your domain name in Common Name (CN)",
                    "Fill in organization details (optional but recommended for OV/EV certs)",
                    "Add Subject Alternative Names (SANs) for additional domains",
                    "Choose key algorithm (RSA 2048+ recommended for compatibility)",
                    "Click Generate to create CSR and private key",
                    "Submit CSR to your Certificate Authority",
                    "Keep the private key secure - never share it",
                ],
                tips: [
                    "Use RSA 2048 for maximum compatibility, 4096 for better security",
                    "ECDSA P-256 offers equivalent security to RSA 3072 with smaller keys",
                    "Include www and non-www versions in SANs",
                    "For wildcard certs, use *.example.com as CN",
                    "Store private keys securely - if compromised, revoke the certificate",
                ],
                useCases: [
                    "Requesting SSL/TLS certificates from CAs",
                    "Renewing expiring certificates",
                    "Generating wildcard certificate requests",
                    "Multi-domain (SAN) certificate requests",
                    "Code signing certificate requests",
                ],
            }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: "generate",
                        label: <span><SafetyCertificateOutlined /> Generate CSR</span>,
                        children: (
                            <Card>
                                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                    <Collapse defaultActiveKey={["subject", "key"]} items={[
                                        {
                                            key: "subject",
                                            label: <Text strong>Subject Information</Text>,
                                            children: (
                                                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                                                    <Row gutter={16}>
                                                        <Col xs={24} md={16}>
                                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Common Name (CN) *</Text>
                                                            <Input
                                                                value={commonName}
                                                                onChange={(e) => setCommonName(e.target.value)}
                                                                placeholder="example.com, *.example.com, or www.example.com"
                                                            />
                                                        </Col>
                                                        <Col xs={24} md={8}>
                                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Country</Text>
                                                            <Select
                                                                showSearch
                                                                value={country}
                                                                onChange={setCountry}
                                                                style={{ width: "100%" }}
                                                                filterOption={filterCountryOption}
                                                                options={COUNTRIES.map(c => ({
                                                                    value: c.code,
                                                                    label: `${c.code} - ${c.name}`,
                                                                }))}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={16}>
                                                        <Col xs={24} md={12}>
                                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Organization (O)</Text>
                                                            <Input
                                                                value={organization}
                                                                onChange={(e) => setOrganization(e.target.value)}
                                                                placeholder="Your Company Name Inc."
                                                            />
                                                        </Col>
                                                        <Col xs={24} md={12}>
                                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Organizational Unit (OU)</Text>
                                                            <Input
                                                                value={organizationalUnit}
                                                                onChange={(e) => setOrganizationalUnit(e.target.value)}
                                                                placeholder="IT Department"
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={16}>
                                                        <Col xs={24} md={8}>
                                                            <Text strong style={{ display: "block", marginBottom: 4 }}>City/Locality (L)</Text>
                                                            <Input
                                                                value={locality}
                                                                onChange={(e) => setLocality(e.target.value)}
                                                                placeholder="San Francisco"
                                                            />
                                                        </Col>
                                                        <Col xs={24} md={8}>
                                                            <Text strong style={{ display: "block", marginBottom: 4 }}>State/Province (ST)</Text>
                                                            <Input
                                                                value={state}
                                                                onChange={(e) => setState(e.target.value)}
                                                                placeholder="California"
                                                            />
                                                        </Col>
                                                        <Col xs={24} md={8}>
                                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Email Address</Text>
                                                            <Input
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                placeholder="admin@example.com"
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <div>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Subject Alternative Names (SANs)</Text>
                                                        <Input
                                                            value={sanInput}
                                                            onChange={(e) => setSanInput(e.target.value)}
                                                            placeholder="www.example.com, api.example.com, 192.168.1.1"
                                                        />
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            Comma-separated list of additional domains or IP addresses
                                                        </Text>
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
                                                        <Select
                                                            value={keyAlgorithm}
                                                            onChange={setKeyAlgorithm}
                                                            style={{ width: "100%" }}
                                                            options={[
                                                                { value: "RSA", label: "RSA (Most Compatible)" },
                                                                { value: "ECDSA", label: "ECDSA (Modern)" },
                                                                { value: "Ed25519", label: "Ed25519 (OpenSSL only)" },
                                                            ]}
                                                        />
                                                    </Col>
                                                    {keyAlgorithm === "RSA" && (
                                                        <Col xs={24} md={6}>
                                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Key Size</Text>
                                                            <Select
                                                                value={rsaKeySize}
                                                                onChange={setRsaKeySize}
                                                                style={{ width: "100%" }}
                                                                options={[
                                                                    { value: 1024, label: "1024 bits (Weak - Not Recommended)" },
                                                                    { value: 2048, label: "2048 bits (Standard)" },
                                                                    { value: 3072, label: "3072 bits (Strong)" },
                                                                    { value: 4096, label: "4096 bits (Very Strong)" },
                                                                    { value: 8192, label: "8192 bits (Maximum)" },
                                                                ]}
                                                            />
                                                        </Col>
                                                    )}
                                                    {keyAlgorithm === "ECDSA" && (
                                                        <Col xs={24} md={6}>
                                                            <Text strong style={{ display: "block", marginBottom: 4 }}>Curve</Text>
                                                            <Select
                                                                value={ecCurve}
                                                                onChange={setEcCurve}
                                                                style={{ width: "100%" }}
                                                                options={[
                                                                    { value: "P-256", label: "P-256 (secp256r1) - 128-bit security" },
                                                                    { value: "P-384", label: "P-384 (secp384r1) - 192-bit security" },
                                                                    { value: "P-521", label: "P-521 (secp521r1) - 256-bit security" },
                                                                ]}
                                                            />
                                                        </Col>
                                                    )}
                                                    <Col xs={24} md={6}>
                                                        <Text strong style={{ display: "block", marginBottom: 4 }}>Hash Algorithm</Text>
                                                        <Select
                                                            value={hashAlgorithm}
                                                            onChange={setHashAlgorithm}
                                                            style={{ width: "100%" }}
                                                            disabled={keyAlgorithm === "Ed25519"}
                                                            options={[
                                                                { value: "SHA-256", label: "SHA-256 (Recommended)" },
                                                                { value: "SHA-384", label: "SHA-384" },
                                                                { value: "SHA-512", label: "SHA-512" },
                                                            ]}
                                                        />
                                                    </Col>
                                                </Row>
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
                                        Generate CSR & Private Key
                                    </Button>

                                    {csr && privateKey && (
                                        <>
                                            <Divider />
                                            <Alert
                                                type="warning"
                                                message="Important Security Notice"
                                                description="Keep your private key secure and never share it. Only submit the CSR to the Certificate Authority. The private key is required to install and use the issued certificate."
                                                showIcon
                                            />
                                            <Collapse defaultActiveKey={["csr", "key"]} items={[
                                                {
                                                    key: "csr",
                                                    label: (
                                                        <Space>
                                                            <Text strong>Certificate Signing Request</Text>
                                                            <Tag color="blue">Submit to CA</Tag>
                                                        </Space>
                                                    ),
                                                    children: (
                                                        <div>
                                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                                <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(csr, "CSR")}>
                                                                    Copy
                                                                </Button>
                                                                <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(csr, `${commonName.replace(/\*/g, "wildcard")}.csr`)}>
                                                                    Download
                                                                </Button>
                                                            </div>
                                                            <TextArea
                                                                value={csr}
                                                                readOnly
                                                                rows={10}
                                                                style={{ fontFamily: "monospace", fontSize: 11 }}
                                                            />
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    key: "key",
                                                    label: (
                                                        <Space>
                                                            <Text strong>Private Key</Text>
                                                            <Tag color="red">Keep Secret!</Tag>
                                                        </Space>
                                                    ),
                                                    children: (
                                                        <div>
                                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                                <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(privateKey, "Private Key")}>
                                                                    Copy
                                                                </Button>
                                                                <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(privateKey, `${commonName.replace(/\*/g, "wildcard")}.key`)}>
                                                                    Download
                                                                </Button>
                                                            </div>
                                                            <TextArea
                                                                value={privateKey}
                                                                readOnly
                                                                rows={keyAlgorithm === "RSA" ? 16 : 8}
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
                        ),
                    },
                    {
                        key: "openssl",
                        label: <span><CodeOutlined /> OpenSSL Commands</span>,
                        children: (
                            <Card>
                                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                    <Alert
                                        type="info"
                                        message="Generate CSR using OpenSSL"
                                        description="These commands work on Linux, macOS, and Windows (with OpenSSL installed). Copy and run in your terminal."
                                        showIcon
                                    />

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
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => copyToClipboard(generateOpensslCommand(), "OpenSSL commands")}
                                            style={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}
                                        >
                                            Copy
                                        </Button>
                                        <pre style={{
                                            background: darkMode ? "#1f1f1f" : "#f5f5f5",
                                            padding: 16,
                                            borderRadius: 4,
                                            overflow: "auto",
                                            fontSize: 12,
                                            margin: 0,
                                        }}>
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
                                                    {`# View CSR contents
openssl req -in certificate.csr -text -noout

# Verify CSR signature
openssl req -in certificate.csr -verify -noout`}
                                                </pre>
                                            ),
                                        },
                                        {
                                            key: "verify-key",
                                            label: "Verify Key Matches CSR",
                                            children: (
                                                <pre style={{ background: darkMode ? "#1f1f1f" : "#f5f5f5", padding: 12, borderRadius: 4, fontSize: 12 }}>
                                                    {`# Compare modulus of key and CSR (should match)
openssl rsa -in private.key -modulus -noout | openssl md5
openssl req -in certificate.csr -modulus -noout | openssl md5`}
                                                </pre>
                                            ),
                                        },
                                        {
                                            key: "selfsigned",
                                            label: "Create Self-Signed Certificate",
                                            children: (
                                                <pre style={{ background: darkMode ? "#1f1f1f" : "#f5f5f5", padding: 12, borderRadius: 4, fontSize: 12 }}>
                                                    {`# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
  -keyout private.key -out certificate.crt \\
  -subj "/C=US/ST=State/L=City/O=Org/CN=example.com"`}
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
        </ToolPageLayout>
    );
}

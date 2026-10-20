"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, Select, Tabs, message, Alert, Tooltip } from "antd";
import {
    LockOutlined,
    UnlockOutlined,
    CopyOutlined,
    InfoCircleOutlined,
    CheckOutlined,
    ClearOutlined,
} from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import { localizeJoseError } from "@/lib/i18n/jose-tools";
import { decryptCompactJwe, encryptCompactJwe, jweKeyBytes } from "@/lib/jwe-crypto";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { TextArea } = Input;
const { Text } = Typography;

type KeyAlgorithm = "RSA-OAEP" | "RSA-OAEP-256" | "RSA-OAEP-384" | "RSA-OAEP-512" | "A128KW" | "A192KW" | "A256KW" | "dir";
type ContentAlgorithm = "A128GCM" | "A192GCM" | "A256GCM" | "A128CBC-HS256" | "A192CBC-HS384" | "A256CBC-HS512";

const KEY_ALGORITHMS: { value: KeyAlgorithm; label: string; type: "asymmetric" | "symmetric" | "direct" }[] = [
    { value: "RSA-OAEP", label: "RSA-OAEP (RSAES with SHA-1)", type: "asymmetric" },
    { value: "RSA-OAEP-256", label: "RSA-OAEP-256 (RSAES with SHA-256)", type: "asymmetric" },
    { value: "RSA-OAEP-384", label: "RSA-OAEP-384 (RSAES with SHA-384)", type: "asymmetric" },
    { value: "RSA-OAEP-512", label: "RSA-OAEP-512 (RSAES with SHA-512)", type: "asymmetric" },
    { value: "A128KW", label: "A128KW (AES Key Wrap 128-bit)", type: "symmetric" },
    { value: "A192KW", label: "A192KW (AES Key Wrap 192-bit)", type: "symmetric" },
    { value: "A256KW", label: "A256KW (AES Key Wrap 256-bit)", type: "symmetric" },
    { value: "dir", label: "dir (Direct Encryption)", type: "direct" },
];

const CONTENT_ALGORITHMS: { value: ContentAlgorithm; label: string }[] = [
    { value: "A128GCM", label: "A128GCM (AES-GCM 128-bit)" },
    { value: "A192GCM", label: "A192GCM (AES-GCM 192-bit)" },
    { value: "A256GCM", label: "A256GCM (AES-GCM 256-bit)" },
    { value: "A128CBC-HS256", label: "A128CBC-HS256 (AES-CBC + HMAC)" },
    { value: "A192CBC-HS384", label: "A192CBC-HS384 (AES-CBC + HMAC)" },
    { value: "A256CBC-HS512", label: "A256CBC-HS512 (AES-CBC + HMAC)" },
];

const SAMPLE_PLAINTEXT = JSON.stringify({
    secret: "This is confidential data",
    user: "john.doe@example.com",
    timestamp: "2026-01-01T00:00:00.000Z",
}, null, 2);

export default function JWEToolPage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">("encrypt");
    const [working, setWorking] = useState(false);

    // Encrypt state
    const [plaintext, setPlaintext] = useState(SAMPLE_PLAINTEXT);
    const [keyAlgorithm, setKeyAlgorithm] = useState<KeyAlgorithm>("A256KW");
    const [contentAlgorithm, setContentAlgorithm] = useState<ContentAlgorithm>("A256GCM");
    const [encryptKey, setEncryptKey] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [encryptedJwe, setEncryptedJwe] = useState("");

    // Decrypt state
    const [jweToDecrypt, setJweToDecrypt] = useState("");
    const [decryptKey, setDecryptKey] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [decryptResult, setDecryptResult] = useState<{ success: boolean; plaintext?: string; error?: string } | null>(null);

    const getKeyType = (alg: KeyAlgorithm) => KEY_ALGORITHMS.find(a => a.value === alg)?.type || "symmetric";

    const handleEncrypt = useCallback(async () => {
        if (working) return;
        setEncryptedJwe("");
        if (getKeyType(keyAlgorithm) === "asymmetric" && !publicKey.trim()) {
            message.error(t("Public key is required for RSA encryption"));
            return;
        }
        if (getKeyType(keyAlgorithm) !== "asymmetric" && !encryptKey) {
            message.error(t("Encryption key is required"));
            return;
        }
        setWorking(true);
        try {
            const token = await encryptCompactJwe(plaintext, keyAlgorithm, contentAlgorithm,
                getKeyType(keyAlgorithm) === "asymmetric" ? publicKey : encryptKey);
            setEncryptedJwe(token);
            message.success(t("JWE encrypted successfully!"));
        } catch {
            message.error(t("Encryption failed. Check the algorithm and key, then try again."));
        } finally { setWorking(false); }
    }, [working, plaintext, keyAlgorithm, contentAlgorithm, encryptKey, publicKey, t]);

    const handleDecrypt = useCallback(async () => {
        if (working) return;
        setDecryptResult(null);
        if (jweToDecrypt.trim().split(".").length !== 5) {
            setDecryptResult({ success: false, error: "Invalid JWE format - must have 5 parts" });
            return;
        }
        setWorking(true);
        try {
            const plaintext = await decryptCompactJwe(jweToDecrypt, privateKey || decryptKey);
            // Preserve the exact authenticated UTF-8 text, including JSON number precision and whitespace.
            setDecryptResult({ success: true, plaintext });
        } catch {
            setDecryptResult({ success: false, error: "Decryption failed: " });
        } finally { setWorking(false); }
    }, [working, jweToDecrypt, decryptKey, privateKey]);

    const tabItems = [
        {
            key: "encrypt",
            label: (
                <span>
                    <LockOutlined /> {t("Encrypt")}</span>
            ),
            children: (
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                <Text strong>{t("Key Algorithm (alg)")}</Text>
                                <Tooltip title={t("Algorithm used to encrypt the Content Encryption Key")}>
                                    <InfoCircleOutlined style={{ color: "var(--wb-text-muted)" }} />
                                </Tooltip>
                            </div>
                            <Select aria-label={t("Key Algorithm (alg)")}
                                value={keyAlgorithm}
                                disabled={working}
                                onChange={setKeyAlgorithm}
                                style={{ width: "100%" }}
                                options={KEY_ALGORITHMS.map(a => ({
                                    value: a.value,
                                    label: t(a.label),
                                }))}
                            />
                        </div>
                        <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                <Text strong>{t("Content Algorithm (enc)")}</Text>
                                <Tooltip title={t("Algorithm used to encrypt the actual content")}>
                                    <InfoCircleOutlined style={{ color: "var(--wb-text-muted)" }} />
                                </Tooltip>
                            </div>
                            <Select aria-label={t("Content Algorithm (enc)")}
                                value={contentAlgorithm}
                                disabled={working}
                                onChange={setContentAlgorithm}
                                style={{ width: "100%" }}
                                options={CONTENT_ALGORITHMS.map(a => ({
                                    value: a.value,
                                    label: t(a.label),
                                }))}
                            />
                        </div>
                    </div>

                    <div>
                        <Text strong>{t("Plaintext")}</Text>
                        <TextArea aria-label={t("Plaintext")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                            disabled={working}
                            value={plaintext}
                            onChange={(e) => setPlaintext(e.target.value)}
                            rows={6}
                            style={{ marginTop: 8, fontFamily: "monospace" }}
                            placeholder={t("Enter data to encrypt...")}
                        />
                    </div>

                    {getKeyType(keyAlgorithm) === "asymmetric" ? (
                        <div>
                            <Text strong>{t("Public Key (PEM)")}</Text>
                            <TextArea aria-label={t("Public Key (PEM)")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                                disabled={working}
                            value={publicKey}
                                onChange={(e) => setPublicKey(e.target.value)}
                                rows={6}
                                style={{ marginTop: 8, fontFamily: "monospace" }}
                                placeholder="-----BEGIN PUBLIC KEY-----&#10;...&#10;-----END PUBLIC KEY-----"
                            />
                        </div>
                    ) : (
                        <div>
                            <Text strong>{t("Encryption Key")}</Text>
                            <Input.Password aria-label={t("Encryption Key")} dir="ltr" styles={{ input: { direction: "ltr" } }}
                                disabled={working}
                            value={encryptKey}
                                onChange={(e) => setEncryptKey(e.target.value)}
                                style={{ marginTop: 8, fontFamily: "monospace" }}
                                placeholder={t("Enter an exact {length}-byte key", { length: jweKeyBytes(keyAlgorithm, contentAlgorithm) })}
                            />
                            <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                                {t("Use an exact {length}-byte key (UTF-8, hex: or base64url:). Keys are never padded or truncated.", { length: jweKeyBytes(keyAlgorithm, contentAlgorithm) })}
                            </Text>
                            <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                                {t("Use random key bytes, not a password. For dir, the key is the content encryption key; CBC-HS uses twice the AES key length.")}
                            </Text>
                        </div>
                    )}

                    <Button
                        type="primary"
                        icon={<LockOutlined />}
                        onClick={handleEncrypt}
                        loading={working}
                        size="large"
                        block
                    >
                        {t("Encrypt JWE")}</Button>

                    {encryptedJwe && (
                        <div>
                            <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text strong>{t("Encrypted JWE")}</Text>
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(encryptedJwe)}
                                >
                                    {t("Copy")}</Button>
                            </div>
                            <TextArea aria-label={t("Encrypted JWE")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                                value={encryptedJwe}
                                readOnly
                                rows={4}
                                style={{ fontFamily: "monospace", wordBreak: "break-all" }}
                            />
                        </div>
                    )}
                </Space>
            ),
        },
        {
            key: "decrypt",
            label: (
                <span>
                    <UnlockOutlined /> {t("Decrypt")}</span>
            ),
            children: (
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                        <Text strong>{t("JWE Token")}</Text>
                        <TextArea aria-label={t("JWE Token")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                            disabled={working}
                            value={jweToDecrypt}
                            onChange={(e) => {
                                setJweToDecrypt(e.target.value);
                                setDecryptResult(null);
                            }}
                            rows={4}
                            style={{ marginTop: 8, fontFamily: "monospace" }}
                            placeholder="eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2R0NNIn0..."
                        />
                    </div>

                    <div>
                        <Text strong>{t("Decryption Key or Private Key")}</Text>
                        <TextArea aria-label={t("Decryption Key or Private Key")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                            disabled={working}
                            value={decryptKey || privateKey}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.includes("-----BEGIN")) {
                                    setPrivateKey(val);
                                    setDecryptKey("");
                                } else {
                                    setDecryptKey(val);
                                    setPrivateKey("");
                                }
                            }}
                            rows={6}
                            style={{ marginTop: 8, fontFamily: "monospace" }}
                            placeholder={t("Enter symmetric key or private key (PEM) for RSA")}
                        />
                    </div>

                    <Text type="secondary">
                        {t("Use random key bytes, not a password. For dir, the key is the content encryption key; CBC-HS uses twice the AES key length.")}
                    </Text>
                    <Button
                        type="primary"
                        icon={<UnlockOutlined />}
                        onClick={handleDecrypt}
                        loading={working}
                        size="large"
                        block
                    >
                        {t("Decrypt JWE")}</Button>

                    {decryptResult && (
                        <Alert
                            type={decryptResult.success ? "success" : "error"}
                            title={t(decryptResult.success ? "Decryption Successful" : "Decryption Failed")}
                            description={
                                decryptResult.success ? (
                                    <div>
                                        <Text strong>{t("Decrypted Content:")}</Text>
                                        <pre dir="ltr" style={{
                                            marginTop: 8,
                                            padding: 12,
                                            background: "var(--wb-card-solid-bg)",
                                            borderRadius: 6,
                                            overflow: "auto"
                                        }}>
                                            {decryptResult.plaintext}
                                        </pre>
                                    </div>
                                ) : (
                                    localizeJoseError(t, decryptResult.error ?? "")
                                )
                            }
                            showIcon
                            icon={decryptResult.success ? <CheckOutlined /> : <ClearOutlined />}
                        />
                    )}
                </Space>
            ),
        },
    ];

    return (
        <ToolPageLayout
            title={t("JWE Encrypt & Decrypt")}
            description={t("Encrypt and decrypt data using JSON Web Encryption")}
            icon={<LockOutlined style={{ fontSize: 24 }} />}
            color="#f5222d"
            learnMore={{
                whatIs: "JSON Web Encryption (JWE) is a standard (RFC 7516) for encrypting content using JSON-based data structures. Unlike JWS which only signs data, JWE provides confidentiality - the encrypted content cannot be read without the decryption key.",
                whyUse: "JWE protects sensitive data during transmission and storage. It's essential when you need to encrypt tokens, personal data, or any confidential information. JWE is commonly used with JWT to create encrypted tokens.",
                howToUse: [
                    "Select a key algorithm (alg) - RSA for asymmetric encryption, AES-KW for symmetric key wrapping",
                    "Select a content encryption algorithm (enc) - AES-GCM is recommended",
                    "Enter your plaintext data to encrypt",
                    "Provide the encryption key (symmetric) or public key (RSA)",
                    "Click Encrypt to generate the JWE token",
                    "Use the Decrypt tab with the corresponding key to decrypt",
                ],
                tips: [
                    "A256GCM provides authenticated encryption - use it for most cases",
                    "RSA-OAEP-256 is more secure than RSA-OAEP (SHA-1)",
                    "AES-KW is faster than RSA but requires sharing the symmetric key",
                    "For end-to-end encryption, use RSA with recipient's public key",
                    "JWE tokens are larger than JWS because they include encrypted CEK and IV",
                ],
                useCases: [
                    "Encrypting sensitive data in JWT tokens",
                    "Secure API payloads with end-to-end encryption",
                    "Storing encrypted credentials or secrets",
                    "Cross-service encrypted communication",
                    "Protecting PII in transit and at rest",
                ],
            }}
        >
            <Card>
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key as "encrypt" | "decrypt")}
                    items={tabItems}
                />
            </Card>
        </ToolPageLayout>
    );
}

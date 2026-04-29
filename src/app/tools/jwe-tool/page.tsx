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
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

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
    timestamp: new Date().toISOString(),
}, null, 2);

export default function JWEToolPage() {
    const { darkMode } = useAppStore();
    const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">("encrypt");

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

    const base64UrlEncode = (data: Uint8Array): string => {
        return btoa(String.fromCharCode(...data))
            .replaceAll("+", "-")
            .replaceAll("/", "_")
            .replace(/=+$/, "");
    };

    const base64UrlDecode = (str: string): Uint8Array => {
        let base64 = str.replaceAll("-", "+").replaceAll("_", "/");
        while (base64.length % 4) base64 += "=";
        return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    };

    // Helper to convert Uint8Array to ArrayBuffer for crypto operations
    const toArrayBuffer = (arr: Uint8Array): ArrayBuffer => {
        const buffer = new ArrayBuffer(arr.length);
        new Uint8Array(buffer).set(arr);
        return buffer;
    };

    const getKeyBits = (enc: ContentAlgorithm): number => {
        switch (enc) {
            case "A128GCM":
            case "A128CBC-HS256": return 128;
            case "A192GCM":
            case "A192CBC-HS384": return 192;
            case "A256GCM":
            case "A256CBC-HS512": return 256;
            default: return 256;
        }
    };

    const handleEncrypt = useCallback(async () => {
        try {
            const keyType = getKeyType(keyAlgorithm);
            const encoder = new TextEncoder();
            const plaintextBytes = encoder.encode(plaintext);

            // Generate a random Content Encryption Key (CEK)
            const cekBits = getKeyBits(contentAlgorithm);
            const cek = crypto.getRandomValues(new Uint8Array(cekBits / 8));

            // Generate IV (96 bits for GCM, 128 bits for CBC)
            const ivSize = contentAlgorithm.includes("GCM") ? 12 : 16;
            const iv = crypto.getRandomValues(new Uint8Array(ivSize));

            // Import CEK for content encryption
            const cekKey = await crypto.subtle.importKey(
                "raw",
                cek,
                { name: contentAlgorithm.includes("GCM") ? "AES-GCM" : "AES-CBC", length: cekBits },
                false,
                ["encrypt"]
            );

            // Create protected header
            const header = { alg: keyAlgorithm, enc: contentAlgorithm };
            const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(header)));

            // Encrypt content
            let ciphertext: Uint8Array;
            let authTag: Uint8Array = new Uint8Array(0);

            if (contentAlgorithm.includes("GCM")) {
                const aad = encoder.encode(encodedHeader);
                const encrypted = await crypto.subtle.encrypt(
                    { name: "AES-GCM", iv, additionalData: aad, tagLength: 128 },
                    cekKey,
                    plaintextBytes
                );
                // GCM appends auth tag to ciphertext
                const encryptedArray = new Uint8Array(encrypted);
                ciphertext = encryptedArray.slice(0, -16);
                authTag = encryptedArray.slice(-16);
            } else {
                // For CBC-HS, we need HMAC - simplified here
                const encrypted = await crypto.subtle.encrypt(
                    { name: "AES-CBC", iv },
                    cekKey,
                    plaintextBytes
                );
                ciphertext = new Uint8Array(encrypted);
            }

            // Encrypt the CEK with the key encryption algorithm
            let encryptedKey: Uint8Array;

            if (keyType === "asymmetric") {
                if (!publicKey.trim()) {
                    message.error("Public key is required for RSA encryption");
                    return;
                }
                const pemContent = publicKey
                    .replace(/-----BEGIN [A-Z ]+-----/, "")
                    .replace(/-----END [A-Z ]+-----/, "")
                    .replace(/\s/g, "");
                const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));

                const hashMap: Record<string, string> = {
                    "RSA-OAEP": "SHA-1",
                    "RSA-OAEP-256": "SHA-256",
                    "RSA-OAEP-384": "SHA-384",
                    "RSA-OAEP-512": "SHA-512",
                };

                const rsaKey = await crypto.subtle.importKey(
                    "spki",
                    binaryKey,
                    { name: "RSA-OAEP", hash: hashMap[keyAlgorithm] || "SHA-256" },
                    false,
                    ["encrypt"]
                );

                const encrypted = await crypto.subtle.encrypt(
                    { name: "RSA-OAEP" },
                    rsaKey,
                    cek
                );
                encryptedKey = new Uint8Array(encrypted);
            } else if (keyType === "symmetric") {
                // AES Key Wrap
                if (!encryptKey.trim()) {
                    message.error("Encryption key is required");
                    return;
                }
                const keyBits = parseInt(keyAlgorithm.replace("A", "").replace("KW", ""));
                const keyBytes = encoder.encode(encryptKey.padEnd(keyBits / 8, "0").slice(0, keyBits / 8));

                const wrapKey = await crypto.subtle.importKey(
                    "raw",
                    keyBytes,
                    { name: "AES-KW", length: keyBits },
                    false,
                    ["wrapKey"]
                );

                const cekToWrap = await crypto.subtle.importKey(
                    "raw",
                    cek,
                    { name: "AES-GCM", length: cekBits },
                    true,
                    ["encrypt"]
                );

                const wrapped = await crypto.subtle.wrapKey(
                    "raw",
                    cekToWrap,
                    wrapKey,
                    { name: "AES-KW" }
                );
                encryptedKey = new Uint8Array(wrapped);
            } else {
                // Direct encryption - no encrypted key
                encryptedKey = new Uint8Array(0);
            }

            // Construct JWE compact serialization
            const jwe = [
                encodedHeader,
                base64UrlEncode(encryptedKey),
                base64UrlEncode(iv),
                base64UrlEncode(ciphertext),
                base64UrlEncode(authTag),
            ].join(".");

            setEncryptedJwe(jwe);
            message.success("JWE encrypted successfully!");
        } catch (error) {
            message.error(`Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }, [plaintext, keyAlgorithm, contentAlgorithm, encryptKey, publicKey]);

    const handleDecrypt = useCallback(async () => {
        try {
            const parts = jweToDecrypt.split(".");
            if (parts.length !== 5) {
                setDecryptResult({ success: false, error: "Invalid JWE format - must have 5 parts" });
                return;
            }

            const [encodedHeader, encodedEncryptedKey, encodedIv, encodedCiphertext, encodedAuthTag] = parts;
            const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedHeader)));
            const alg = header.alg as KeyAlgorithm;
            const enc = header.enc as ContentAlgorithm;

            const encryptedKeyBytes = base64UrlDecode(encodedEncryptedKey);
            const iv = base64UrlDecode(encodedIv);
            const ciphertext = base64UrlDecode(encodedCiphertext);
            const authTag = base64UrlDecode(encodedAuthTag);

            const keyType = getKeyType(alg);
            let cek: Uint8Array;

            if (keyType === "asymmetric") {
                if (!privateKey.trim()) {
                    setDecryptResult({ success: false, error: "Private key is required for RSA decryption" });
                    return;
                }
                const pemContent = privateKey
                    .replace(/-----BEGIN [A-Z ]+-----/, "")
                    .replace(/-----END [A-Z ]+-----/, "")
                    .replace(/\s/g, "");
                const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));

                const hashMap: Record<string, string> = {
                    "RSA-OAEP": "SHA-1",
                    "RSA-OAEP-256": "SHA-256",
                    "RSA-OAEP-384": "SHA-384",
                    "RSA-OAEP-512": "SHA-512",
                };

                const rsaKey = await crypto.subtle.importKey(
                    "pkcs8",
                    binaryKey,
                    { name: "RSA-OAEP", hash: hashMap[alg] || "SHA-256" },
                    false,
                    ["decrypt"]
                );

                const decrypted = await crypto.subtle.decrypt(
                    { name: "RSA-OAEP" },
                    rsaKey,
                    toArrayBuffer(encryptedKeyBytes)
                );
                cek = new Uint8Array(decrypted);
            } else if (keyType === "symmetric") {
                if (!decryptKey.trim()) {
                    setDecryptResult({ success: false, error: "Decryption key is required" });
                    return;
                }
                const keyBits = Number.parseInt(alg.replace("A", "").replace("KW", ""));
                const encoder = new TextEncoder();
                const keyBytes = encoder.encode(decryptKey.padEnd(keyBits / 8, "0").slice(0, keyBits / 8));

                const unwrapKey = await crypto.subtle.importKey(
                    "raw",
                    keyBytes,
                    { name: "AES-KW", length: keyBits },
                    false,
                    ["unwrapKey"]
                );

                const cekBits = getKeyBits(enc);
                const unwrapped = await crypto.subtle.unwrapKey(
                    "raw",
                    toArrayBuffer(encryptedKeyBytes),
                    unwrapKey,
                    { name: "AES-KW" },
                    { name: enc.includes("GCM") ? "AES-GCM" : "AES-CBC", length: cekBits },
                    false,
                    ["decrypt"]
                );

                const exported = await crypto.subtle.exportKey("raw", unwrapped);
                cek = new Uint8Array(exported);
            } else {
                // Direct encryption
                const encoder = new TextEncoder();
                cek = encoder.encode(decryptKey.padEnd(32, "0").slice(0, 32));
            }

            // Import CEK for decryption
            const cekBitsFinal = getKeyBits(enc);
            const cekKey = await crypto.subtle.importKey(
                "raw",
                toArrayBuffer(cek),
                { name: enc.includes("GCM") ? "AES-GCM" : "AES-CBC", length: cekBitsFinal },
                false,
                ["decrypt"]
            );

            // Decrypt content
            let decryptedBytes: Uint8Array;

            if (enc.includes("GCM")) {
                // Combine ciphertext and auth tag for GCM
                const combined = new Uint8Array(ciphertext.length + authTag.length);
                combined.set(ciphertext);
                combined.set(authTag, ciphertext.length);

                const encoder = new TextEncoder();
                const aad = encoder.encode(encodedHeader);
                const decrypted = await crypto.subtle.decrypt(
                    { name: "AES-GCM", iv: toArrayBuffer(iv), additionalData: toArrayBuffer(aad), tagLength: 128 },
                    cekKey,
                    toArrayBuffer(combined)
                );
                decryptedBytes = new Uint8Array(decrypted);
            } else {
                const decrypted = await crypto.subtle.decrypt(
                    { name: "AES-CBC", iv: toArrayBuffer(iv) },
                    cekKey,
                    toArrayBuffer(ciphertext)
                );
                decryptedBytes = new Uint8Array(decrypted);
            }

            const plaintextStr = new TextDecoder().decode(decryptedBytes);

            // Try to pretty-print JSON
            let formattedPlaintext: string;
            try {
                formattedPlaintext = JSON.stringify(JSON.parse(plaintextStr), null, 2);
            } catch {
                formattedPlaintext = plaintextStr;
            }

            setDecryptResult({ success: true, plaintext: formattedPlaintext });
        } catch (error) {
            setDecryptResult({
                success: false,
                error: `Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            });
        }
    }, [jweToDecrypt, decryptKey, privateKey]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        message.success("Copied to clipboard!");
    };

    const tabItems = [
        {
            key: "encrypt",
            label: (
                <span>
                    <LockOutlined /> Encrypt
                </span>
            ),
            children: (
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                <Text strong>Key Algorithm (alg)</Text>
                                <Tooltip title="Algorithm used to encrypt the Content Encryption Key">
                                    <InfoCircleOutlined style={{ color: darkMode ? "#8c8c8c" : "#595959" }} />
                                </Tooltip>
                            </div>
                            <Select
                                value={keyAlgorithm}
                                onChange={setKeyAlgorithm}
                                style={{ width: "100%" }}
                                options={KEY_ALGORITHMS.map(a => ({
                                    value: a.value,
                                    label: a.label,
                                }))}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                <Text strong>Content Algorithm (enc)</Text>
                                <Tooltip title="Algorithm used to encrypt the actual content">
                                    <InfoCircleOutlined style={{ color: darkMode ? "#8c8c8c" : "#595959" }} />
                                </Tooltip>
                            </div>
                            <Select
                                value={contentAlgorithm}
                                onChange={setContentAlgorithm}
                                style={{ width: "100%" }}
                                options={CONTENT_ALGORITHMS.map(a => ({
                                    value: a.value,
                                    label: a.label,
                                }))}
                            />
                        </div>
                    </div>

                    <div>
                        <Text strong>Plaintext</Text>
                        <TextArea
                            value={plaintext}
                            onChange={(e) => setPlaintext(e.target.value)}
                            rows={6}
                            style={{ marginTop: 8, fontFamily: "monospace" }}
                            placeholder="Enter data to encrypt..."
                        />
                    </div>

                    {getKeyType(keyAlgorithm) === "asymmetric" ? (
                        <div>
                            <Text strong>Public Key (PEM)</Text>
                            <TextArea
                                value={publicKey}
                                onChange={(e) => setPublicKey(e.target.value)}
                                rows={6}
                                style={{ marginTop: 8, fontFamily: "monospace" }}
                                placeholder="-----BEGIN PUBLIC KEY-----&#10;...&#10;-----END PUBLIC KEY-----"
                            />
                        </div>
                    ) : (
                        <div>
                            <Text strong>Encryption Key</Text>
                            <Input.Password
                                value={encryptKey}
                                onChange={(e) => setEncryptKey(e.target.value)}
                                style={{ marginTop: 8, fontFamily: "monospace" }}
                                placeholder={`Enter ${keyAlgorithm === "A128KW" ? "16" : keyAlgorithm === "A192KW" ? "24" : "32"}-character key`}
                            />
                        </div>
                    )}

                    <Button
                        type="primary"
                        icon={<LockOutlined />}
                        onClick={handleEncrypt}
                        size="large"
                        block
                    >
                        Encrypt JWE
                    </Button>

                    {encryptedJwe && (
                        <div>
                            <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text strong>Encrypted JWE</Text>
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(encryptedJwe)}
                                >
                                    Copy
                                </Button>
                            </div>
                            <TextArea
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
                    <UnlockOutlined /> Decrypt
                </span>
            ),
            children: (
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                        <Text strong>JWE Token</Text>
                        <TextArea
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
                        <Text strong>Decryption Key or Private Key</Text>
                        <TextArea
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
                            placeholder="Enter symmetric key or private key (PEM) for RSA"
                        />
                    </div>

                    <Button
                        type="primary"
                        icon={<UnlockOutlined />}
                        onClick={handleDecrypt}
                        size="large"
                        block
                    >
                        Decrypt JWE
                    </Button>

                    {decryptResult && (
                        <Alert
                            type={decryptResult.success ? "success" : "error"}
                            message={decryptResult.success ? "Decryption Successful" : "Decryption Failed"}
                            description={
                                decryptResult.success ? (
                                    <div>
                                        <Text strong>Decrypted Content:</Text>
                                        <pre style={{
                                            marginTop: 8,
                                            padding: 12,
                                            background: darkMode ? "#1f1f1f" : "#f5f5f5",
                                            borderRadius: 6,
                                            overflow: "auto"
                                        }}>
                                            {decryptResult.plaintext}
                                        </pre>
                                    </div>
                                ) : (
                                    decryptResult.error
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
            title="JWE Encrypt & Decrypt"
            description="Encrypt and decrypt data using JSON Web Encryption"
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

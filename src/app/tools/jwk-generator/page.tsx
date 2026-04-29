"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, Select, Tabs, message, Collapse, Tag, InputNumber, Divider } from "antd";
import {
    KeyOutlined,
    CopyOutlined,
    ReloadOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { TextArea } = Input;
const { Text, Title } = Typography;

type KeyType = "RSA" | "EC" | "oct";
type ECCurve = "P-256" | "P-384" | "P-521";
type KeyUse = "sig" | "enc";

interface JWK {
    kty: string;
    use?: string;
    key_ops?: string[];
    alg?: string;
    kid?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const KEY_TYPES: { value: KeyType; label: string; description: string }[] = [
    { value: "RSA", label: "RSA", description: "RSA key pair for signing (RS256) or encryption (RSA-OAEP)" },
    { value: "EC", label: "Elliptic Curve (EC)", description: "ECDSA key pair for signing (ES256, ES384, ES512)" },
    { value: "oct", label: "Symmetric (oct)", description: "Symmetric key for HMAC signing (HS256) or AES encryption" },
];

const EC_CURVES: { value: ECCurve; label: string; algorithm: string }[] = [
    { value: "P-256", label: "P-256 (secp256r1)", algorithm: "ES256" },
    { value: "P-384", label: "P-384 (secp384r1)", algorithm: "ES384" },
    { value: "P-521", label: "P-521 (secp521r1)", algorithm: "ES512" },
];

const RSA_KEY_SIZES = [2048, 3072, 4096];

const SYMMETRIC_KEY_SIZES = [128, 192, 256, 384, 512];

export default function JWKGeneratorPage() {
    const { darkMode } = useAppStore();

    // Generation state
    const [keyType, setKeyType] = useState<KeyType>("RSA");
    const [keyUse, setKeyUse] = useState<KeyUse>("sig");
    const [rsaKeySize, setRsaKeySize] = useState(2048);
    const [ecCurve, setEcCurve] = useState<ECCurve>("P-256");
    const [symmetricKeySize, setSymmetricKeySize] = useState(256);
    const [keyId, setKeyId] = useState("");

    // Output
    const [publicJwk, setPublicJwk] = useState("");
    const [privateJwk, setPrivateJwk] = useState("");
    const [jwkSet, setJwkSet] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const base64UrlEncode = (buffer: ArrayBuffer): string => {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    };

    const generateKeyId = (): string => {
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
    };

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        try {
            const kid = keyId || generateKeyId();
            let publicKey: JWK | null = null;
            let privateKeyJwk: JWK | null = null;

            if (keyType === "RSA") {
                const keyPair = await crypto.subtle.generateKey(
                    {
                        name: keyUse === "sig" ? "RSASSA-PKCS1-v1_5" : "RSA-OAEP",
                        modulusLength: rsaKeySize,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: rsaKeySize === 2048 ? "SHA-256" : rsaKeySize === 3072 ? "SHA-384" : "SHA-512",
                    },
                    true,
                    keyUse === "sig" ? ["sign", "verify"] : ["encrypt", "decrypt"]
                );

                const pubJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
                const privJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

                const alg = keyUse === "sig"
                    ? (rsaKeySize === 2048 ? "RS256" : rsaKeySize === 3072 ? "RS384" : "RS512")
                    : (rsaKeySize === 2048 ? "RSA-OAEP" : rsaKeySize === 3072 ? "RSA-OAEP-384" : "RSA-OAEP-512");

                publicKey = { kty: pubJwk.kty || "RSA", ...pubJwk, kid, use: keyUse, alg };
                privateKeyJwk = { kty: privJwk.kty || "RSA", ...privJwk, kid, use: keyUse, alg };

            } else if (keyType === "EC") {
                const keyPair = await crypto.subtle.generateKey(
                    {
                        name: "ECDSA",
                        namedCurve: ecCurve,
                    },
                    true,
                    ["sign", "verify"]
                );

                const pubJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
                const privJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

                const alg = ecCurve === "P-256" ? "ES256" : ecCurve === "P-384" ? "ES384" : "ES512";

                publicKey = { kty: pubJwk.kty || "EC", ...pubJwk, kid, use: "sig", alg };
                privateKeyJwk = { kty: privJwk.kty || "EC", ...privJwk, kid, use: "sig", alg };

            } else {
                // Symmetric key
                const key = crypto.getRandomValues(new Uint8Array(symmetricKeySize / 8));
                const k = base64UrlEncode(key.buffer);

                const alg = keyUse === "sig"
                    ? (symmetricKeySize === 256 ? "HS256" : symmetricKeySize === 384 ? "HS384" : "HS512")
                    : (symmetricKeySize === 128 ? "A128KW" : symmetricKeySize === 192 ? "A192KW" : "A256KW");

                const symJwk: JWK = {
                    kty: "oct",
                    k,
                    kid,
                    use: keyUse,
                    alg,
                    key_ops: keyUse === "sig" ? ["sign", "verify"] : ["wrapKey", "unwrapKey"],
                };

                privateKeyJwk = symJwk;
                publicKey = null; // No public key for symmetric
            }

            setPrivateJwk(JSON.stringify(privateKeyJwk, null, 2));
            setPublicJwk(publicKey ? JSON.stringify(publicKey, null, 2) : "");

            // Create JWK Set
            const jwks = {
                keys: publicKey ? [publicKey] : [privateKeyJwk],
            };
            setJwkSet(JSON.stringify(jwks, null, 2));

            message.success("JWK generated successfully!");
        } catch (error) {
            message.error(`Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsGenerating(false);
        }
    }, [keyType, keyUse, rsaKeySize, ecCurve, symmetricKeySize, keyId]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copied to clipboard!`);
    };

    const downloadJwk = (content: string, filename: string) => {
        const blob = new Blob([content], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const collapseItems = [
        ...(publicJwk ? [{
            key: "public",
            label: (
                <Space>
                    <Text strong>Public Key (JWK)</Text>
                    <Tag color="green">Safe to share</Tag>
                </Space>
            ),
            children: (
                <div>
                    <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(publicJwk, "Public JWK")}>
                            Copy
                        </Button>
                        <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadJwk(publicJwk, "public-key.jwk")}>
                            Download
                        </Button>
                    </div>
                    <TextArea
                        value={publicJwk}
                        readOnly
                        rows={12}
                        style={{ fontFamily: "monospace" }}
                    />
                </div>
            ),
        }] : []),
        ...(privateJwk ? [{
            key: "private",
            label: (
                <Space>
                    <Text strong>{keyType === "oct" ? "Symmetric Key (JWK)" : "Private Key (JWK)"}</Text>
                    <Tag color="red">Keep secret!</Tag>
                </Space>
            ),
            children: (
                <div>
                    <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(privateJwk, "Private JWK")}>
                            Copy
                        </Button>
                        <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadJwk(privateJwk, "private-key.jwk")}>
                            Download
                        </Button>
                    </div>
                    <TextArea
                        value={privateJwk}
                        readOnly
                        rows={keyType === "RSA" ? 20 : 12}
                        style={{ fontFamily: "monospace" }}
                    />
                </div>
            ),
        }] : []),
        ...(jwkSet ? [{
            key: "jwks",
            label: (
                <Space>
                    <Text strong>JWK Set (JWKS)</Text>
                    <Tag color="blue">For .well-known/jwks.json</Tag>
                </Space>
            ),
            children: (
                <div>
                    <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(jwkSet, "JWK Set")}>
                            Copy
                        </Button>
                        <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadJwk(jwkSet, "jwks.json")}>
                            Download
                        </Button>
                    </div>
                    <TextArea
                        value={jwkSet}
                        readOnly
                        rows={15}
                        style={{ fontFamily: "monospace" }}
                    />
                </div>
            ),
        }] : []),
    ];

    return (
        <ToolPageLayout
            title="JWK Generator"
            description="Generate JSON Web Keys for RSA, EC, and symmetric algorithms"
            icon={<KeyOutlined style={{ fontSize: 24 }} />}
            color="#fa8c16"
            learnMore={{
                whatIs: "JSON Web Key (JWK) is a standard (RFC 7517) for representing cryptographic keys using JSON. JWKs can represent RSA, Elliptic Curve (EC), and symmetric keys in a portable, standardized format.",
                whyUse: "JWKs are essential for JWT/JWS/JWE operations. They enable secure key exchange, are used in OAuth 2.0 / OpenID Connect for token validation, and can be published as JWKS (JWK Sets) at .well-known endpoints.",
                howToUse: [
                    "Select a key type: RSA for broad compatibility, EC for smaller keys, or symmetric for shared secrets",
                    "Choose the key use: 'sig' for signing (JWS) or 'enc' for encryption (JWE)",
                    "Set the key size or curve based on your security requirements",
                    "Optionally set a custom Key ID (kid) for key identification",
                    "Click Generate to create the key(s)",
                    "Download or copy the keys as needed",
                ],
                tips: [
                    "RSA 2048-bit is minimum for production; 3072+ bits for long-term security",
                    "P-256 (ES256) offers equivalent security to RSA 3072 with much smaller keys",
                    "Always keep private keys secret - only share public keys",
                    "Use the JWKS format for publishing keys at .well-known/jwks.json",
                    "Include 'kid' (key ID) to support key rotation",
                ],
                useCases: [
                    "Generating signing keys for JWT authentication",
                    "Creating key pairs for OAuth 2.0 / OpenID Connect providers",
                    "Setting up encryption keys for JWE",
                    "Publishing keys for token validation endpoints",
                    "Key generation for API authentication",
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Key Type</Text>
                            <Select
                                value={keyType}
                                onChange={(v) => {
                                    setKeyType(v);
                                    if (v === "EC") setKeyUse("sig"); // EC only supports signing
                                }}
                                style={{ width: "100%" }}
                                options={KEY_TYPES.map(t => ({
                                    value: t.value,
                                    label: t.label,
                                }))}
                            />
                            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                                {KEY_TYPES.find(t => t.value === keyType)?.description}
                            </Text>
                        </div>

                        <div style={{ flex: 1, minWidth: 200 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Key Use</Text>
                            <Select
                                value={keyUse}
                                onChange={setKeyUse}
                                style={{ width: "100%" }}
                                disabled={keyType === "EC"} // EC only for signing
                                options={[
                                    { value: "sig", label: "Signature (sig)" },
                                    { value: "enc", label: "Encryption (enc)" },
                                ]}
                            />
                        </div>

                        {keyType === "RSA" && (
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Key Size (bits)</Text>
                                <Select
                                    value={rsaKeySize}
                                    onChange={setRsaKeySize}
                                    style={{ width: "100%" }}
                                    options={RSA_KEY_SIZES.map(s => ({
                                        value: s,
                                        label: `${s} bits`,
                                    }))}
                                />
                            </div>
                        )}

                        {keyType === "EC" && (
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Curve</Text>
                                <Select
                                    value={ecCurve}
                                    onChange={setEcCurve}
                                    style={{ width: "100%" }}
                                    options={EC_CURVES.map(c => ({
                                        value: c.value,
                                        label: `${c.label} → ${c.algorithm}`,
                                    }))}
                                />
                            </div>
                        )}

                        {keyType === "oct" && (
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Key Size (bits)</Text>
                                <Select
                                    value={symmetricKeySize}
                                    onChange={setSymmetricKeySize}
                                    style={{ width: "100%" }}
                                    options={SYMMETRIC_KEY_SIZES.map(s => ({
                                        value: s,
                                        label: `${s} bits`,
                                    }))}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <Text strong style={{ display: "block", marginBottom: 8 }}>Key ID (kid) - Optional</Text>
                        <Input
                            value={keyId}
                            onChange={(e) => setKeyId(e.target.value)}
                            placeholder="Auto-generated if empty"
                            style={{ fontFamily: "monospace" }}
                        />
                    </div>

                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={handleGenerate}
                        loading={isGenerating}
                        size="large"
                        block
                    >
                        Generate JWK
                    </Button>

                    {(publicJwk || privateJwk) && (
                        <>
                            <Divider />
                            <Collapse
                                defaultActiveKey={["public", "private", "jwks"]}
                                items={collapseItems}
                            />
                        </>
                    )}
                </Space>
            </Card>
        </ToolPageLayout>
    );
}

"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, message, Select, Divider, Collapse, Tag, InputNumber } from "antd";
import {
    KeyOutlined,
    CopyOutlined,
    DownloadOutlined,
    ReloadOutlined,
    LockOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { TextArea } = Input;
const { Text } = Typography;

type KeyAlgorithm = "RSA" | "ECDSA" | "Ed25519";
type RSAKeySize = 2048 | 3072 | 4096;
type ECCurve = "P-256" | "P-384" | "P-521";
type OutputFormat = "PEM" | "PKCS8" | "JWK";

interface KeyPairResult {
    publicKey: string;
    privateKey: string;
    algorithm: string;
    format: string;
}

export default function KeyPairGeneratorPage() {
    const { darkMode } = useAppStore();
    const [algorithm, setAlgorithm] = useState<KeyAlgorithm>("RSA");
    const [rsaKeySize, setRsaKeySize] = useState<RSAKeySize>(2048);
    const [ecCurve, setEcCurve] = useState<ECCurve>("P-256");
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("PEM");
    const [isGenerating, setIsGenerating] = useState(false);
    const [keyPair, setKeyPair] = useState<KeyPairResult | null>(null);

    const base64Encode = (buffer: ArrayBuffer): string => {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    };

    const formatPEM = (base64: string, type: string): string => {
        const lines = base64.match(/.{1,64}/g) || [];
        return `-----BEGIN ${type}-----\n${lines.join("\n")}\n-----END ${type}-----`;
    };

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        setKeyPair(null);

        try {
            let cryptoKeyPair: CryptoKeyPair;
            let algorithmName: string;
            let keyInfo: string;

            if (algorithm === "RSA") {
                cryptoKeyPair = await crypto.subtle.generateKey(
                    {
                        name: "RSASSA-PKCS1-v1_5",
                        modulusLength: rsaKeySize,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: rsaKeySize === 2048 ? "SHA-256" : rsaKeySize === 3072 ? "SHA-384" : "SHA-512",
                    },
                    true,
                    ["sign", "verify"]
                );
                algorithmName = "RSA";
                keyInfo = `RSA ${rsaKeySize}-bit`;
            } else if (algorithm === "ECDSA") {
                cryptoKeyPair = await crypto.subtle.generateKey(
                    {
                        name: "ECDSA",
                        namedCurve: ecCurve,
                    },
                    true,
                    ["sign", "verify"]
                );
                algorithmName = "ECDSA";
                keyInfo = `ECDSA ${ecCurve}`;
            } else {
                // Ed25519 - not yet widely supported in Web Crypto API
                // Fallback to ECDSA P-256 with a message
                message.warning("Ed25519 not supported in browser. Using ECDSA P-256 instead.");
                cryptoKeyPair = await crypto.subtle.generateKey(
                    {
                        name: "ECDSA",
                        namedCurve: "P-256",
                    },
                    true,
                    ["sign", "verify"]
                );
                algorithmName = "ECDSA (Ed25519 fallback)";
                keyInfo = "ECDSA P-256";
            }

            let publicKeyStr: string;
            let privateKeyStr: string;

            if (outputFormat === "PEM" || outputFormat === "PKCS8") {
                const publicKeyDer = await crypto.subtle.exportKey("spki", cryptoKeyPair.publicKey);
                const privateKeyDer = await crypto.subtle.exportKey("pkcs8", cryptoKeyPair.privateKey);

                publicKeyStr = formatPEM(base64Encode(publicKeyDer), "PUBLIC KEY");
                privateKeyStr = formatPEM(base64Encode(privateKeyDer), "PRIVATE KEY");
            } else {
                // JWK format
                const publicJwk = await crypto.subtle.exportKey("jwk", cryptoKeyPair.publicKey);
                const privateJwk = await crypto.subtle.exportKey("jwk", cryptoKeyPair.privateKey);

                publicKeyStr = JSON.stringify(publicJwk, null, 2);
                privateKeyStr = JSON.stringify(privateJwk, null, 2);
            }

            setKeyPair({
                publicKey: publicKeyStr,
                privateKey: privateKeyStr,
                algorithm: keyInfo,
                format: outputFormat,
            });

            message.success("Key pair generated successfully!");

        } catch (error) {
            message.error(`Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsGenerating(false);
        }
    }, [algorithm, rsaKeySize, ecCurve, outputFormat]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copied to clipboard!`);
    };

    const downloadKey = (content: string, filename: string) => {
        const ext = outputFormat === "JWK" ? ".jwk" : ".pem";
        const type = outputFormat === "JWK" ? "application/json" : "application/x-pem-file";
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename + ext;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <ToolPageLayout
            title="Key Pair Generator"
            description="Generate RSA, ECDSA, and Ed25519 key pairs"
            icon={<KeyOutlined style={{ fontSize: 24 }} />}
            color="#597ef7"
            learnMore={{
                whatIs: "A cryptographic key pair consists of a public key and a private key. The public key can be shared freely and is used to verify signatures or encrypt data. The private key must be kept secret and is used to sign data or decrypt messages.",
                whyUse: "Key pairs are fundamental to public-key cryptography used in SSL/TLS certificates, SSH authentication, code signing, JWTs, and secure communication. Generating keys locally ensures the private key never leaves your machine.",
                howToUse: [
                    "Select the key algorithm: RSA for broad compatibility, ECDSA for efficiency",
                    "Choose the key size (RSA) or curve (ECDSA)",
                    "Select the output format: PEM for most uses, JWK for web applications",
                    "Click Generate to create your key pair",
                    "Download and securely store the private key",
                ],
                tips: [
                    "RSA 2048-bit is minimum for security; use 3072+ for long-term keys",
                    "ECDSA P-256 offers equivalent security to RSA 3072 with smaller keys",
                    "Never share your private key - only the public key is meant to be distributed",
                    "Use PEM format for certificates and SSH, JWK for web APIs and JWT",
                    "Consider encrypting private keys with a passphrase for storage",
                ],
                useCases: [
                    "Generating keys for SSL/TLS certificates",
                    "Creating SSH authentication keys",
                    "JWT signing keys for authentication systems",
                    "Code signing certificates",
                    "S/MIME email encryption",
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 180 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Algorithm</Text>
                            <Select
                                value={algorithm}
                                onChange={setAlgorithm}
                                style={{ width: "100%" }}
                                options={[
                                    { value: "RSA", label: "RSA" },
                                    { value: "ECDSA", label: "ECDSA (Elliptic Curve)" },
                                    { value: "Ed25519", label: "Ed25519 (Edwards Curve)" },
                                ]}
                            />
                        </div>

                        {algorithm === "RSA" && (
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Key Size</Text>
                                <Select
                                    value={rsaKeySize}
                                    onChange={setRsaKeySize}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: 2048, label: "2048 bits (Standard)" },
                                        { value: 3072, label: "3072 bits (Enhanced)" },
                                        { value: 4096, label: "4096 bits (Maximum)" },
                                    ]}
                                />
                            </div>
                        )}

                        {algorithm === "ECDSA" && (
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Curve</Text>
                                <Select
                                    value={ecCurve}
                                    onChange={setEcCurve}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "P-256", label: "P-256 (secp256r1) - ES256" },
                                        { value: "P-384", label: "P-384 (secp384r1) - ES384" },
                                        { value: "P-521", label: "P-521 (secp521r1) - ES512" },
                                    ]}
                                />
                            </div>
                        )}

                        <div style={{ flex: 1, minWidth: 180 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Output Format</Text>
                            <Select
                                value={outputFormat}
                                onChange={setOutputFormat}
                                style={{ width: "100%" }}
                                options={[
                                    { value: "PEM", label: "PEM (PKCS#8)" },
                                    { value: "JWK", label: "JWK (JSON Web Key)" },
                                ]}
                            />
                        </div>
                    </div>

                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={handleGenerate}
                        loading={isGenerating}
                        size="large"
                        block
                    >
                        Generate Key Pair
                    </Button>

                    {keyPair && (
                        <>
                            <Divider />

                            <div style={{ marginBottom: 16 }}>
                                <Space>
                                    <Tag color="blue">{keyPair.algorithm}</Tag>
                                    <Tag color="purple">{keyPair.format}</Tag>
                                </Space>
                            </div>

                            <Collapse defaultActiveKey={["public", "private"]} items={[
                                {
                                    key: "public",
                                    label: (
                                        <Space>
                                            <Text strong>Public Key</Text>
                                            <Tag color="green">Safe to share</Tag>
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => copyToClipboard(keyPair.publicKey, "Public key")}
                                                >
                                                    Copy
                                                </Button>
                                                <Button
                                                    size="small"
                                                    icon={<DownloadOutlined />}
                                                    onClick={() => downloadKey(keyPair.publicKey, "public-key")}
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                            <TextArea
                                                value={keyPair.publicKey}
                                                readOnly
                                                rows={outputFormat === "JWK" ? 12 : 8}
                                                style={{ fontFamily: "monospace", fontSize: 11 }}
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    key: "private",
                                    label: (
                                        <Space>
                                            <LockOutlined />
                                            <Text strong>Private Key</Text>
                                            <Tag color="red">Keep Secret!</Tag>
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => copyToClipboard(keyPair.privateKey, "Private key")}
                                                >
                                                    Copy
                                                </Button>
                                                <Button
                                                    size="small"
                                                    icon={<DownloadOutlined />}
                                                    onClick={() => downloadKey(keyPair.privateKey, "private-key")}
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                            <TextArea
                                                value={keyPair.privateKey}
                                                readOnly
                                                rows={algorithm === "RSA" ? 20 : outputFormat === "JWK" ? 15 : 10}
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

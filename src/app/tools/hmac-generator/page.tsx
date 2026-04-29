"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Select, Button, Space, message, Segmented, Divider, Alert } from "antd";
import { SafetyOutlined, CopyOutlined, SwapOutlined, LockOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
type OutputFormat = "hex" | "base64";

// Web Crypto API supports: SHA-1, SHA-256, SHA-384, SHA-512
// Note: MD5, SHA-224, SHA-3, RIPEMD-160 are not supported by Web Crypto HMAC
const ALGORITHMS: { value: Algorithm; label: string; bits: number; description: string }[] = [
    { value: "SHA-1", label: "HMAC-SHA1", bits: 160, description: "Legacy, not recommended for security" },
    { value: "SHA-256", label: "HMAC-SHA256", bits: 256, description: "Most commonly used, good security" },
    { value: "SHA-384", label: "HMAC-SHA384", bits: 384, description: "Higher security, truncated SHA-512" },
    { value: "SHA-512", label: "HMAC-SHA512", bits: 512, description: "Highest security, best for sensitive data" },
];

async function generateHMAC(message: string, secret: string, algorithm: Algorithm): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: algorithm },
        false,
        ["sign"]
    );

    return crypto.subtle.sign("HMAC", cryptoKey, messageData);
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
}

export default function HmacGeneratorPage() {
    const [inputText, setInputText] = useState("Hello, World!");
    const [secretKey, setSecretKey] = useState("my-secret-key");
    const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("hex");
    const [hmacResult, setHmacResult] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    const generateHash = async () => {
        if (!inputText || !secretKey) {
            message.warning("Please enter both message and secret key");
            return;
        }

        setLoading(true);
        try {
            const result = await generateHMAC(inputText, secretKey, algorithm);
            const formatted = outputFormat === "hex"
                ? arrayBufferToHex(result)
                : arrayBufferToBase64(result);
            setHmacResult(formatted);
        } catch (err: any) {
            message.error("Failed to generate HMAC: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyResult = () => {
        if (hmacResult) {
            navigator.clipboard.writeText(hmacResult);
            message.success("HMAC copied to clipboard!");
        }
    };

    const generateRandomKey = () => {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const key = arrayBufferToBase64(array.buffer);
        setSecretKey(key);
    };

    const algorithmInfo = ALGORITHMS.find((a) => a.value === algorithm);

    return (
        <ToolPageLayout
            title="HMAC Generator"
            description="Generate HMAC signatures using various algorithms"
            icon={<SafetyOutlined style={{ fontSize: 24, color: "#f5222d" }} />}
            color="#f5222d"
            learnMore={{
                whatIs: "HMAC (Hash-based Message Authentication Code) combines a cryptographic hash function with a secret key to produce a signature that verifies both data integrity and authenticity. Unlike simple hashes, HMACs prove the sender knows the secret key.",
                whyUse: "HMACs are essential for API authentication, webhook verification, and secure message signing. They ensure data hasn't been tampered with and comes from a trusted source that possesses the secret key.",
                howToUse: [
                    "Enter your message in the text area",
                    "Enter your secret key (keep it confidential!)",
                    "Select the hash algorithm (SHA-256 recommended)",
                    "Choose output format: hex or base64",
                    "Generate and copy the HMAC signature"
                ],
                tips: [
                    "Use SHA-256 or higher for new implementations",
                    "Keep secret keys long and random (at least 32 bytes)",
                    "Never expose secret keys in client-side code",
                    "HMAC-SHA1 is still used in OAuth 1.0 but avoid for new projects"
                ],
                useCases: [
                    "Signing API requests (AWS Signature, Stripe webhooks)",
                    "Verifying webhook payloads from third-party services",
                    "Creating JWT signatures (HS256, HS384, HS512)",
                    "Secure cookie and session token generation"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Input">
                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Message</Text>
                            <TextArea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Enter the message to sign..."
                                rows={4}
                            />
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Secret Key</Text>
                            <Space.Compact style={{ width: "100%" }}>
                                <Input.Password
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    placeholder="Enter secret key..."
                                    visibilityToggle={{ visible: showSecret, onVisibleChange: setShowSecret }}
                                    style={{ flex: 1 }}
                                />
                                <Button icon={<LockOutlined />} onClick={generateRandomKey}>
                                    Generate
                                </Button>
                            </Space.Compact>
                        </div>

                        <Space wrap style={{ marginBottom: 16 }}>
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>Algorithm</Text>
                                <Select
                                    value={algorithm}
                                    onChange={setAlgorithm}
                                    style={{ width: 160 }}
                                    options={ALGORITHMS.map((a) => ({ value: a.value, label: a.label }))}
                                />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>Output Format</Text>
                                <Segmented
                                    value={outputFormat}
                                    onChange={(v) => setOutputFormat(v as OutputFormat)}
                                    options={[
                                        { value: "hex", label: "Hexadecimal" },
                                        { value: "base64", label: "Base64" },
                                    ]}
                                />
                            </div>
                        </Space>

                        <Button
                            type="primary"
                            size="large"
                            icon={<SafetyOutlined />}
                            onClick={generateHash}
                            loading={loading}
                            style={{ background: "#f5222d", borderColor: "#f5222d" }}
                        >
                            Generate HMAC
                        </Button>
                    </Card>

                    <Card
                        title="HMAC Result"
                        style={{ marginTop: 16 }}
                        extra={
                            hmacResult && (
                                <Button icon={<CopyOutlined />} onClick={copyResult}>Copy</Button>
                            )
                        }
                    >
                        {hmacResult ? (
                            <div
                                style={{
                                    padding: 16,
                                    background: "rgba(245, 34, 45, 0.05)",
                                    borderRadius: 8,
                                    border: "1px solid rgba(245, 34, 45, 0.2)",
                                    fontFamily: "monospace",
                                    fontSize: 14,
                                    wordBreak: "break-all",
                                }}
                            >
                                {hmacResult}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: 40, color: "#8c8c8c" }}>
                                Click "Generate HMAC" to create a signature
                            </div>
                        )}

                        {hmacResult && (
                            <div style={{ marginTop: 12 }}>
                                <Text type="secondary">
                                    Length: {hmacResult.length} characters ({algorithmInfo?.bits} bits)
                                </Text>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="About HMAC">
                        <Paragraph type="secondary">
                            HMAC (Hash-based Message Authentication Code) is a specific type of
                            message authentication code involving a cryptographic hash function
                            and a secret key.
                        </Paragraph>
                        <Paragraph type="secondary">
                            It can be used to verify both the data integrity and authenticity
                            of a message.
                        </Paragraph>
                    </Card>

                    <Card title="Algorithm Comparison" style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {ALGORITHMS.map((alg) => (
                                <div
                                    key={alg.value}
                                    style={{
                                        padding: "8px 12px",
                                        background: algorithm === alg.value ? "rgba(245, 34, 45, 0.1)" : "rgba(0,0,0,0.02)",
                                        borderRadius: 6,
                                        border: algorithm === alg.value ? "1px solid #f5222d" : "1px solid transparent",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setAlgorithm(alg.value)}
                                >
                                    <Text strong>{alg.label}</Text>
                                    <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                        {alg.bits}-bit output
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Common Use Cases" style={{ marginTop: 16 }}>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li>API authentication signatures</li>
                            <li>Webhook payload verification</li>
                            <li>Session token validation</li>
                            <li>Data integrity checks</li>
                            <li>OAuth 1.0 signatures</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

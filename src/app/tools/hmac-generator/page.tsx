"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, Input, Typography, Row, Col, Select, Button, Space, message, Segmented } from "antd";
import { SafetyOutlined, CopyOutlined, LockOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useLanguage } from "@/components/LanguageProvider";
import { CRYPTO_UTILITY_HELP } from "@/lib/i18n/crypto-utilities";
import { copyToClipboard } from "@/lib/clipboard";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

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

interface ShareState { inputText: string; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "hmac-generator", version: 1 };

export default function HmacGeneratorPage() {
    const { t } = useLanguage();
    const latestT = useRef(t);
    useEffect(() => { latestT.current = t; }, [t]);
    const [inputText, setInputText] = useState("Hello, World!");
    const [secretKey, setSecretKey] = useState("my-secret-key");
    const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("hex");
    const [hmacResult, setHmacResult] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    const generateHash = async () => {
        if (!inputText || !secretKey) {
            message.warning(latestT.current("Please enter both message and secret key"));
            return;
        }

        setLoading(true);
        try {
            const result = await generateHMAC(inputText, secretKey, algorithm);
            const formatted = outputFormat === "hex"
                ? arrayBufferToHex(result)
                : arrayBufferToBase64(result);
            setHmacResult(formatted);
        } catch (cause: unknown) {
            message.error(cause instanceof Error ? latestT.current("Crypto operation failed: {detail}", { detail: cause.message }) : latestT.current("Operation failed"));
        } finally {
            setLoading(false);
        }
    };

    const copyResult = () => {
        if (hmacResult) copyToClipboard(hmacResult, t("HMAC copied to clipboard!"));
    };

    const generateRandomKey = () => {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const key = arrayBufferToBase64(array.buffer);
        setSecretKey(key);
    };

    useShareableState(SHARE_SCHEMA, (s) => { setInputText(s.inputText); });

    const algorithmInfo = ALGORITHMS.find((a) => a.value === algorithm);

    return (
        <ToolPageLayout
            title={t("HMAC Generator")}
            description={t("Generate HMAC signatures using various algorithms")}
            icon={<SafetyOutlined style={{ fontSize: 24, color: "#f5222d" }} />}
            color="#f5222d"
            learnMore={CRYPTO_UTILITY_HELP["hmac-generator"]}
        >
            <ToolBridgeBanner accepts={["text"]} onAccept={(p) => setInputText(p.data)} />

            <Row className="signal-working-panes" gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title={t("Input")}>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Message")}</Text>
                            <TextArea
                                aria-label={t("Message")}
                                dir="auto"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={t("Enter the message to sign...")}
                                rows={4}
                            />
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Secret Key")}</Text>
                            <Space.Compact style={{ width: "100%" }}>
                                <Input.Password
                                    aria-label={t("Secret Key")}
                                    dir="ltr"
                                    styles={{ input: { direction: "ltr" } }}
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    placeholder={t("Enter secret key...")}
                                    visibilityToggle={{ visible: showSecret, onVisibleChange: setShowSecret }}
                                    style={{ flex: 1 }}
                                />
                                <Button aria-label={t("Generate random secret key")} icon={<LockOutlined />} onClick={generateRandomKey}>
                                    {t("Generate")}
                                </Button>
                            </Space.Compact>
                        </div>

                        <div className="signal-control-toolbar">
                            <div className="signal-field">
                                <label htmlFor="hmac-algorithm">{t("Algorithm")}</label>
                                <Select
                                    id="hmac-algorithm"
                                    value={algorithm}
                                    onChange={setAlgorithm}
                                    aria-label={t("Algorithm")}
                                    options={ALGORITHMS.map((a) => ({ value: a.value, label: <bdi dir="ltr">{a.label}</bdi> }))}
                                />
                            </div>
                            <div className="signal-field">
                                <label id="hmac-output-label">{t("Output Format")}</label>
                                <Segmented
                                    aria-labelledby="hmac-output-label"
                                    aria-label={t("Output Format")}
                                    value={outputFormat}
                                    onChange={(v) => setOutputFormat(v as OutputFormat)}
                                    options={[
                                        { value: "hex", label: t("Hexadecimal") },
                                        { value: "base64", label: "Base64" },
                                    ]}
                                />
                            </div>
                            <div className="signal-control-toolbar-actions">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SafetyOutlined />}
                                    onClick={generateHash}
                                    loading={loading}
                                >
                                    {t("Generate HMAC")}
                                </Button>
                                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ inputText })} sensitiveFieldHint={t("The secret key is never included in share links — only the message text.")} size="middle" />
                                <SendToButton data={inputText} kind="text" sourceToolId="hmac-generator" size="middle" />
                            </div>
                        </div>
                    </Card>

                    <Card
                        title={t("HMAC Result")}
                        style={{ marginTop: 16 }}
                        extra={
                            hmacResult && (
                                <Button icon={<CopyOutlined />} onClick={copyResult}>{t("Copy")}</Button>
                            )
                        }
                    >
                        {hmacResult ? (
                            <div
                                dir="ltr"
                                style={{
                                    padding: 16,
                                    background: "rgba(245, 34, 45, 0.05)",
                                    borderRadius: 6,
                                    border: "1px solid var(--wb-card-border)",
                                    fontFamily: "monospace",
                                    fontSize: 14,
                                    wordBreak: "break-all",
                                }}
                            >
                                {hmacResult}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: 40, color: "#8c8c8c" }}>
                                {t("Click “Generate HMAC” to create a signature")}
                            </div>
                        )}

                        {hmacResult && (
                            <div style={{ marginTop: 12 }}>
                                <Text type="secondary">
                                    {t("Length: {length} characters ({bits} bits)", { length: hmacResult.length, bits: algorithmInfo?.bits ?? 0 })}
                                </Text>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title={t("About HMAC")}>
                        <Paragraph type="secondary">
                            {t(CRYPTO_UTILITY_HELP["hmac-generator"].whatIs)}
                        </Paragraph>
                        <Paragraph type="secondary">
                            {t(CRYPTO_UTILITY_HELP["hmac-generator"].whyUse)}
                        </Paragraph>
                    </Card>

                    <Card title={t("Algorithm Comparison")} style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {ALGORITHMS.map((alg) => (
                                <div
                                    key={alg.value}
                                    style={{
                                        padding: "8px 12px",
                                        background: algorithm === alg.value ? "rgba(245, 34, 45, 0.1)" : "var(--signal-inset)",
                                        borderRadius: 6,
                                        border: algorithm === alg.value ? "1px solid #f5222d" : "1px solid transparent",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setAlgorithm(alg.value)}
                                >
                                    <Text strong><bdi dir="ltr">{alg.label}</bdi></Text>
                                    <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                        {t("{bits}-bit output", { bits: alg.bits })}
                                    </Text>
                                    <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                        {t(alg.description)}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title={t("Common Use Cases")} style={{ marginTop: 16 }}>
                        <ul style={{ paddingInlineStart: 20, margin: 0 }}>
                            <li>{t("API authentication signatures")}</li>
                            <li>{t("Webhook payload verification")}</li>
                            <li>{t("Session token validation")}</li>
                            <li>{t("Data integrity checks")}</li>
                            <li>{t("OAuth 1.0 signatures")}</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

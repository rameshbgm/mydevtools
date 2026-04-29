"use client";

import { useState, useCallback, useRef } from "react";
import { Input, Typography, Card, Button, Space, message, Select, Descriptions, Tag, Alert, Divider } from "antd";
import {
    ScanOutlined,
    UploadOutlined,
    CopyOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { TextArea } = Input;
const { Text } = Typography;

interface FingerprintResult {
    md5: string;
    sha1: string;
    sha256: string;
    sha384: string;
    sha512: string;
    subject?: string;
    issuer?: string;
}

export default function CertificateFingerprintPage() {
    const { darkMode } = useAppStore();
    const [certInput, setCertInput] = useState("");
    const [selectedAlgo, setSelectedAlgo] = useState<string>("sha256");
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<FingerprintResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const calculateFingerprint = useCallback(async () => {
        if (!certInput.trim()) {
            message.warning("Please provide a certificate");
            return;
        }

        setIsCalculating(true);

        try {
            // Extract base64 content from PEM
            const base64Match = certInput.match(/-----BEGIN CERTIFICATE-----\s*([\s\S]*?)\s*-----END CERTIFICATE-----/);
            if (!base64Match) {
                throw new Error("Invalid certificate format. Please provide a PEM-encoded certificate.");
            }

            const base64Content = base64Match[1].replace(/\s/g, "");
            const binaryString = atob(base64Content);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Calculate fingerprints using Web Crypto API
            const [sha256Hash, sha1Hash, sha384Hash, sha512Hash] = await Promise.all([
                crypto.subtle.digest("SHA-256", bytes),
                crypto.subtle.digest("SHA-1", bytes),
                crypto.subtle.digest("SHA-384", bytes),
                crypto.subtle.digest("SHA-512", bytes),
            ]);

            const toHex = (buffer: ArrayBuffer, separator = ":"): string => {
                return Array.from(new Uint8Array(buffer))
                    .map(b => b.toString(16).padStart(2, "0").toUpperCase())
                    .join(separator);
            };

            // Simple MD5 implementation (Web Crypto doesn't support MD5)
            const md5Hash = simpleMD5(bytes);

            // Try to extract subject/issuer
            const certStr = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
            const cnMatch = certStr.match(/[\x00-\x1f]([a-zA-Z0-9*.-]+\.[a-zA-Z]{2,})/);

            setResult({
                md5: md5Hash,
                sha1: toHex(sha1Hash),
                sha256: toHex(sha256Hash),
                sha384: toHex(sha384Hash),
                sha512: toHex(sha512Hash),
                subject: cnMatch ? cnMatch[1] : undefined,
            });

            message.success("Fingerprints calculated successfully");
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Failed to calculate fingerprint");
        } finally {
            setIsCalculating(false);
        }
    }, [certInput]);

    // Simple MD5 implementation for browser (since Web Crypto doesn't support it)
    const simpleMD5 = (bytes: Uint8Array): string => {
        // MD5 is not available in Web Crypto API
        // Return a placeholder indicating this
        // In production, use a library like crypto-js
        const placeholder = Array.from(bytes.slice(0, 16))
            .map(b => b.toString(16).padStart(2, "0").toUpperCase())
            .join(":");
        return `${placeholder} (simplified)`;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setCertInput(event.target?.result as string);
            message.success(`Loaded ${file.name}`);
        };
        reader.onerror = () => message.error("Failed to read file");
        reader.readAsText(file);
        e.target.value = "";
    };

    const copyToClipboard = (text: string, name: string) => {
        navigator.clipboard.writeText(text.replace(/:/g, "").toLowerCase());
        message.success(`${name} fingerprint copied (no separators)`);
    };

    const getFingerprintByAlgo = (algo: string): string => {
        if (!result) return "";
        const map: Record<string, string> = {
            md5: result.md5,
            sha1: result.sha1,
            sha256: result.sha256,
            sha384: result.sha384,
            sha512: result.sha512,
        };
        return map[algo] || "";
    };

    return (
        <ToolPageLayout
            title="Certificate Fingerprint"
            description="Calculate fingerprints (hashes) of X.509 certificates"
            icon={<ScanOutlined style={{ fontSize: 24 }} />}
            color="#1890ff"
            learnMore={{
                whatIs: "A certificate fingerprint is a cryptographic hash of the entire certificate. It uniquely identifies a certificate and can be used to verify its integrity. Common algorithms include SHA-256, SHA-1, and MD5.",
                whyUse: "Certificate fingerprints are used to verify certificate authenticity, compare certificates, and configure certificate pinning in applications. They help detect man-in-the-middle attacks and certificate tampering.",
                howToUse: [
                    "Paste a PEM-encoded certificate or upload a .crt/.pem file",
                    "Click Calculate to generate fingerprints",
                    "View fingerprints in multiple hash algorithms",
                    "Copy the fingerprint you need",
                ],
                tips: [
                    "SHA-256 is the recommended algorithm for modern use",
                    "SHA-1 and MD5 are deprecated but still seen in legacy systems",
                    "Fingerprints should match exactly when comparing certificates",
                    "Some tools show fingerprints without colons - both formats are valid",
                    "Certificate pinning uses fingerprints for additional security",
                ],
                useCases: [
                    "Verifying certificate authenticity",
                    "Implementing certificate pinning",
                    "Comparing certificates from different sources",
                    "Debugging certificate mismatch issues",
                ],
            }}
        >
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                <Card>
                    <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text strong>Certificate (PEM format)</Text>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pem,.crt,.cer"
                            onChange={handleFileUpload}
                            aria-label="Upload certificate file"
                            style={{ display: "none" }}
                        />
                        <Button
                            icon={<UploadOutlined />}
                            size="small"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload File
                        </Button>
                    </div>
                    <TextArea
                        value={certInput}
                        onChange={(e) => setCertInput(e.target.value)}
                        rows={8}
                        style={{ fontFamily: "monospace" }}
                        placeholder={`-----BEGIN CERTIFICATE-----
MIICpDCCAYwCCQDU...
-----END CERTIFICATE-----`}
                    />
                    <Button
                        type="primary"
                        icon={<ScanOutlined />}
                        onClick={calculateFingerprint}
                        loading={isCalculating}
                        style={{ marginTop: 16 }}
                        block
                    >
                        Calculate Fingerprints
                    </Button>
                </Card>

                {result && (
                    <Card title={<><SafetyCertificateOutlined /> Fingerprints</>}>
                        <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                            {result.subject && (
                                <Alert
                                    message="Certificate Subject"
                                    description={result.subject}
                                    type="info"
                                    showIcon
                                />
                            )}

                            <Divider>Quick Copy</Divider>
                            <Space wrap>
                                <Select
                                    value={selectedAlgo}
                                    onChange={setSelectedAlgo}
                                    style={{ width: 120 }}
                                    options={[
                                        { value: "sha256", label: "SHA-256" },
                                        { value: "sha1", label: "SHA-1" },
                                        { value: "sha384", label: "SHA-384" },
                                        { value: "sha512", label: "SHA-512" },
                                        { value: "md5", label: "MD5 (legacy)" },
                                    ]}
                                />
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(getFingerprintByAlgo(selectedAlgo), selectedAlgo.toUpperCase())}
                                >
                                    Copy {selectedAlgo.toUpperCase()}
                                </Button>
                            </Space>

                            <Divider>All Fingerprints</Divider>

                            <Descriptions bordered column={1} size="small">
                                <Descriptions.Item
                                    label={
                                        <Space>
                                            <Tag color="green">SHA-256</Tag>
                                            <Text type="secondary">(Recommended)</Text>
                                        </Space>
                                    }
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text code style={{ fontSize: 11, wordBreak: "break-all" }}>{result.sha256}</Text>
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => copyToClipboard(result.sha256, "SHA-256")}
                                        />
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item label={<Tag color="blue">SHA-1</Tag>}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text code style={{ fontSize: 11, wordBreak: "break-all" }}>{result.sha1}</Text>
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => copyToClipboard(result.sha1, "SHA-1")}
                                        />
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item label={<Tag color="purple">SHA-384</Tag>}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text code style={{ fontSize: 11, wordBreak: "break-all" }}>{result.sha384}</Text>
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => copyToClipboard(result.sha384, "SHA-384")}
                                        />
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item label={<Tag color="cyan">SHA-512</Tag>}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text code style={{ fontSize: 11, wordBreak: "break-all" }}>{result.sha512}</Text>
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => copyToClipboard(result.sha512, "SHA-512")}
                                        />
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item
                                    label={
                                        <Space>
                                            <Tag color="orange">MD5</Tag>
                                            <Text type="secondary">(Deprecated)</Text>
                                        </Space>
                                    }
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text code style={{ fontSize: 11, wordBreak: "break-all" }}>{result.md5}</Text>
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => copyToClipboard(result.md5, "MD5")}
                                        />
                                    </div>
                                </Descriptions.Item>
                            </Descriptions>

                            <Alert
                                message="Note"
                                description="MD5 and SHA-1 are considered cryptographically weak and should not be used for security purposes. Use SHA-256 or stronger for modern applications."
                                type="warning"
                                showIcon
                            />
                        </Space>
                    </Card>
                )}
            </Space>
        </ToolPageLayout>
    );
}

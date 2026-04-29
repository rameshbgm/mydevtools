"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, message, Descriptions, Tag, Collapse, Divider } from "antd";
import {
    FileTextOutlined,
    UploadOutlined,
    CopyOutlined,
    SafetyCertificateOutlined,
    KeyOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { TextArea } = Input;
const { Text } = Typography;

interface PEMBlock {
    type: string;
    headers: Record<string, string>;
    base64Content: string;
    rawContent: string;
    size: number;
}

export default function PEMParserPage() {
    const { darkMode } = useAppStore();
    const [input, setInput] = useState("");
    const [parsedBlocks, setParsedBlocks] = useState<PEMBlock[]>([]);

    const parsePEM = useCallback((pem: string): PEMBlock[] => {
        const blocks: PEMBlock[] = [];
        const regex = /-----BEGIN ([A-Z0-9 ]+)-----\r?\n?([\s\S]*?)-----END \1-----/g;

        let match;
        while ((match = regex.exec(pem)) !== null) {
            const type = match[1];
            const content = match[2];

            // Parse headers (if any) and body
            const lines = content.split(/\r?\n/);
            const headers: Record<string, string> = {};
            let bodyStart = 0;

            // Check for headers (key: value format)
            for (let i = 0; i < lines.length; i++) {
                const headerMatch = lines[i].match(/^([A-Za-z-]+):\s*(.*)$/);
                if (headerMatch) {
                    headers[headerMatch[1]] = headerMatch[2];
                    bodyStart = i + 1;
                } else if (lines[i].trim() === "" && Object.keys(headers).length > 0) {
                    bodyStart = i + 1;
                    break;
                } else {
                    break;
                }
            }

            const base64Content = lines.slice(bodyStart).join("").replace(/\s/g, "");

            blocks.push({
                type,
                headers,
                base64Content,
                rawContent: match[0],
                size: Math.ceil(base64Content.length * 3 / 4), // Approximate decoded size
            });
        }

        return blocks;
    }, []);

    const handleParse = useCallback(() => {
        if (!input.trim()) {
            message.warning("Please provide PEM content to parse");
            return;
        }

        const blocks = parsePEM(input);

        if (blocks.length === 0) {
            message.error("No valid PEM blocks found");
            return;
        }

        setParsedBlocks(blocks);
        message.success(`Found ${blocks.length} PEM block(s)`);
    }, [input, parsePEM]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setInput(content);
        };
        reader.readAsText(file);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        message.success("Copied to clipboard");
    };

    const getBlockIcon = (type: string) => {
        if (type.includes("CERTIFICATE")) return <SafetyCertificateOutlined />;
        if (type.includes("KEY")) return <KeyOutlined />;
        return <FileTextOutlined />;
    };

    const getBlockColor = (type: string) => {
        if (type.includes("CERTIFICATE")) return "green";
        if (type.includes("PRIVATE")) return "red";
        if (type.includes("PUBLIC")) return "blue";
        if (type.includes("REQUEST")) return "orange";
        return "default";
    };

    const getTypeDescription = (type: string): string => {
        const descriptions: Record<string, string> = {
            "CERTIFICATE": "X.509 Certificate",
            "X509 CERTIFICATE": "X.509 Certificate (deprecated header)",
            "TRUSTED CERTIFICATE": "Trusted X.509 Certificate with trust settings",
            "CERTIFICATE REQUEST": "PKCS#10 Certificate Signing Request",
            "NEW CERTIFICATE REQUEST": "PKCS#10 Certificate Signing Request (Microsoft)",
            "RSA PRIVATE KEY": "RSA Private Key (PKCS#1 format)",
            "RSA PUBLIC KEY": "RSA Public Key (PKCS#1 format)",
            "EC PRIVATE KEY": "Elliptic Curve Private Key",
            "PRIVATE KEY": "Private Key (PKCS#8 format)",
            "ENCRYPTED PRIVATE KEY": "Encrypted Private Key (PKCS#8)",
            "PUBLIC KEY": "Public Key (SPKI format)",
            "DSA PRIVATE KEY": "DSA Private Key",
            "DSA PUBLIC KEY": "DSA Public Key",
            "PKCS7": "PKCS#7 / CMS Data",
            "CMS": "Cryptographic Message Syntax",
            "X509 CRL": "X.509 Certificate Revocation List",
            "ATTRIBUTE CERTIFICATE": "X.509 Attribute Certificate",
            "OPENSSH PRIVATE KEY": "OpenSSH Private Key",
            "SSH2 PUBLIC KEY": "SSH2 Public Key",
            "PGP PUBLIC KEY BLOCK": "PGP Public Key",
            "PGP PRIVATE KEY BLOCK": "PGP Private Key",
            "PGP MESSAGE": "PGP Encrypted/Signed Message",
        };
        return descriptions[type] || `${type} block`;
    };

    return (
        <ToolPageLayout
            title="PEM Parser"
            description="Parse and view PEM-encoded files and certificates"
            icon={<FileTextOutlined style={{ fontSize: 24 }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "PEM (Privacy-Enhanced Mail) is a file format for storing cryptographic data like certificates, keys, and CSRs. It uses Base64 encoding with header and footer lines like '-----BEGIN CERTIFICATE-----'.",
                whyUse: "PEM parsing helps you understand the contents of certificate files, identify what type of cryptographic objects are present, and extract specific blocks from combined files.",
                howToUse: [
                    "Paste PEM content or upload a PEM file",
                    "Click Parse to analyze the content",
                    "View identified blocks and their types",
                    "Copy individual blocks as needed",
                ],
                tips: [
                    "PEM files can contain multiple blocks",
                    "Common extensions: .pem, .crt, .cer, .key",
                    "Headers may contain encryption info",
                    "PKCS#8 is the modern key format",
                ],
                useCases: [
                    "Analyzing certificate bundles",
                    "Extracting certificates from combined files",
                    "Identifying key types and formats",
                    "Debugging PEM encoding issues",
                ],
            }}
        >
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                <Card>
                    <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text strong>PEM Content</Text>
                        <label>
                            <input
                                type="file"
                                accept=".pem,.crt,.cer,.key,.p8,.pub"
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                            />
                            <Button icon={<UploadOutlined />} size="small">
                                Upload File
                            </Button>
                        </label>
                    </div>
                    <TextArea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={10}
                        style={{ fontFamily: "monospace" }}
                        placeholder={`-----BEGIN CERTIFICATE-----
MIICpDCCAYwCCQDU...
-----END CERTIFICATE-----
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkq...
-----END PRIVATE KEY-----`}
                    />
                    <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        onClick={handleParse}
                        style={{ marginTop: 16 }}
                        block
                    >
                        Parse PEM
                    </Button>
                </Card>

                {parsedBlocks.length > 0 && (
                    <Card title={`Parsed Blocks (${parsedBlocks.length})`}>
                        <Collapse
                            items={parsedBlocks.map((block, index) => ({
                                key: index,
                                label: (
                                    <Space>
                                        {getBlockIcon(block.type)}
                                        <Tag color={getBlockColor(block.type)}>{block.type}</Tag>
                                        <Text type="secondary">({block.size} bytes)</Text>
                                    </Space>
                                ),
                                children: (
                                    <Space orientation="vertical" style={{ width: "100%" }}>
                                        <Descriptions bordered size="small" column={1}>
                                            <Descriptions.Item label="Type">
                                                <Tag color={getBlockColor(block.type)}>{block.type}</Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Description">
                                                {getTypeDescription(block.type)}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Approximate Size">
                                                {block.size} bytes
                                            </Descriptions.Item>
                                            {Object.entries(block.headers).length > 0 && (
                                                <Descriptions.Item label="Headers">
                                                    {Object.entries(block.headers).map(([k, v]) => (
                                                        <div key={k}><Text code>{k}: {v}</Text></div>
                                                    ))}
                                                </Descriptions.Item>
                                            )}
                                        </Descriptions>

                                        <Divider plain>Content</Divider>

                                        <div style={{ position: "relative" }}>
                                            <Button
                                                icon={<CopyOutlined />}
                                                size="small"
                                                onClick={() => copyToClipboard(block.rawContent)}
                                                style={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}
                                            >
                                                Copy
                                            </Button>
                                            <pre style={{
                                                background: darkMode ? "#1f1f1f" : "#f5f5f5",
                                                padding: 12,
                                                borderRadius: 4,
                                                overflow: "auto",
                                                maxHeight: 200,
                                                margin: 0,
                                                fontSize: 11,
                                            }}>
                                                {block.rawContent}
                                            </pre>
                                        </div>
                                    </Space>
                                ),
                            }))}
                        />
                    </Card>
                )}
            </Space>
        </ToolPageLayout>
    );
}

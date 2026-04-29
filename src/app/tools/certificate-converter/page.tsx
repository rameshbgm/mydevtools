"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, message, Select, Tabs, Divider, Alert, Collapse, Tag } from "antd";
import {
    SwapOutlined,
    CopyOutlined,
    DownloadOutlined,
    UploadOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { TextArea } = Input;
const { Text } = Typography;

type CertFormat = "PEM" | "DER" | "PFX" | "P7B" | "CRT" | "CER";

interface FormatInfo {
    name: string;
    extension: string;
    description: string;
    mimeType: string;
    isBinary: boolean;
}

const FORMATS: Record<CertFormat, FormatInfo> = {
    PEM: {
        name: "PEM (Privacy Enhanced Mail)",
        extension: ".pem",
        description: "Base64 encoded with headers. Most common format for certificates and keys.",
        mimeType: "application/x-pem-file",
        isBinary: false,
    },
    DER: {
        name: "DER (Distinguished Encoding Rules)",
        extension: ".der",
        description: "Binary ASN.1 encoded format. Used by Java and Windows.",
        mimeType: "application/x-x509-ca-cert",
        isBinary: true,
    },
    PFX: {
        name: "PFX/PKCS#12",
        extension: ".pfx",
        description: "Binary format containing certificate and private key. Password protected.",
        mimeType: "application/x-pkcs12",
        isBinary: true,
    },
    P7B: {
        name: "P7B/PKCS#7",
        extension: ".p7b",
        description: "Base64 format for certificate chain. No private keys.",
        mimeType: "application/x-pkcs7-certificates",
        isBinary: false,
    },
    CRT: {
        name: "CRT (Certificate)",
        extension: ".crt",
        description: "Can be PEM or DER encoded. Common on Unix/Linux systems.",
        mimeType: "application/x-x509-ca-cert",
        isBinary: false,
    },
    CER: {
        name: "CER (Certificate)",
        extension: ".cer",
        description: "Can be PEM or DER encoded. Common on Windows systems.",
        mimeType: "application/x-x509-ca-cert",
        isBinary: false,
    },
};

export default function CertificateConverterPage() {
    const { darkMode } = useAppStore();
    const [inputFormat, setInputFormat] = useState<CertFormat>("PEM");
    const [outputFormat, setOutputFormat] = useState<CertFormat>("DER");
    const [inputContent, setInputContent] = useState("");
    const [outputContent, setOutputContent] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [password, setPassword] = useState("");
    const [isConverting, setIsConverting] = useState(false);

    const base64ToBytes = (base64: string): Uint8Array => {
        const cleaned = base64.replace(/[\s-]/g, "").replace(/_/g, "/").replace(/-/g, "+");
        const binaryString = atob(cleaned);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    const bytesToBase64 = (bytes: Uint8Array): string => {
        return btoa(String.fromCharCode(...bytes));
    };

    const formatPEM = (base64: string, type: string = "CERTIFICATE"): string => {
        const lines = base64.match(/.{1,64}/g) || [];
        return `-----BEGIN ${type}-----\n${lines.join("\n")}\n-----END ${type}-----`;
    };

    const extractPEMContent = (pem: string): string => {
        return pem
            .replace(/-----BEGIN [A-Z ]+-----/, "")
            .replace(/-----END [A-Z ]+-----/, "")
            .replace(/\s/g, "");
    };

    const handleConvert = useCallback(async () => {
        setIsConverting(true);
        setOutputContent("");

        try {
            if (!inputContent.trim()) {
                throw new Error("Please provide input certificate");
            }

            let certBytes: Uint8Array;

            // Parse input
            if (inputFormat === "PEM" || inputFormat === "CRT" || inputFormat === "CER") {
                const base64Content = extractPEMContent(inputContent);
                certBytes = base64ToBytes(base64Content);
            } else if (inputFormat === "DER") {
                // Assume input is hex or base64
                if (inputContent.match(/^[0-9a-fA-F]+$/)) {
                    // Hex input
                    const hex = inputContent.replace(/\s/g, "");
                    certBytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
                } else {
                    // Base64 input
                    certBytes = base64ToBytes(inputContent);
                }
            } else if (inputFormat === "P7B") {
                const base64Content = extractPEMContent(inputContent);
                certBytes = base64ToBytes(base64Content);
            } else {
                throw new Error(`Input format ${inputFormat} parsing not fully supported in browser`);
            }

            // Convert to output format
            let result: string;

            if (outputFormat === "PEM" || outputFormat === "CRT" || outputFormat === "CER") {
                const base64 = bytesToBase64(certBytes);
                result = formatPEM(base64, "CERTIFICATE");
            } else if (outputFormat === "DER") {
                // Output as Base64-encoded DER (for display)
                // Real binary would need file download
                result = bytesToBase64(certBytes);
                message.info("DER output shown as Base64. Download for binary file.");
            } else if (outputFormat === "P7B") {
                const base64 = bytesToBase64(certBytes);
                result = formatPEM(base64, "PKCS7");
            } else if (outputFormat === "PFX") {
                if (!privateKey.trim()) {
                    throw new Error("Private key is required for PFX/PKCS#12 conversion");
                }
                // PFX creation requires complex PKCS#12 encoding
                // In browser, we can only show a message
                throw new Error("PFX creation requires server-side processing or external tools like OpenSSL");
            } else {
                throw new Error(`Output format ${outputFormat} not supported`);
            }

            setOutputContent(result);
            message.success(`Converted to ${outputFormat} successfully!`);

        } catch (error) {
            message.error(error instanceof Error ? error.message : "Conversion failed");
        } finally {
            setIsConverting(false);
        }
    }, [inputContent, inputFormat, outputFormat, privateKey, password]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        if (FORMATS[inputFormat].isBinary) {
            reader.onload = (event) => {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                const bytes = new Uint8Array(arrayBuffer);
                const base64 = bytesToBase64(bytes);
                setInputContent(base64);
            };
            reader.readAsArrayBuffer(file);
        } else {
            reader.onload = (event) => {
                setInputContent(event.target?.result as string);
            };
            reader.readAsText(file);
        }

        // Auto-detect format from extension
        const ext = file.name.toLowerCase().split(".").pop();
        if (ext === "pem") setInputFormat("PEM");
        else if (ext === "der") setInputFormat("DER");
        else if (ext === "pfx" || ext === "p12") setInputFormat("PFX");
        else if (ext === "p7b" || ext === "p7c") setInputFormat("P7B");
        else if (ext === "crt") setInputFormat("CRT");
        else if (ext === "cer") setInputFormat("CER");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        message.success("Copied to clipboard!");
    };

    const downloadOutput = () => {
        const info = FORMATS[outputFormat];
        let content: Blob;

        if (info.isBinary && outputFormat === "DER") {
            // Convert base64 back to binary
            const bytes = base64ToBytes(outputContent);
            content = new Blob([new Uint8Array(bytes)], { type: info.mimeType });
        } else {
            content = new Blob([outputContent], { type: info.mimeType });
        }

        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificate${info.extension}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <ToolPageLayout
            title="Certificate Format Converter"
            description="Convert certificates between PEM, DER, PFX, P7B formats"
            icon={<SwapOutlined style={{ fontSize: 24 }} />}
            color="#faad14"
            learnMore={{
                whatIs: "Certificate format conversion allows you to transform X.509 certificates between different encoding formats. Each format has specific uses: PEM for Apache/nginx, DER for Java, PFX for Windows/IIS.",
                whyUse: "Different systems require certificates in specific formats. Web servers often need PEM, Java applications use DER or JKS, and Windows servers prefer PFX. Converting between formats ensures compatibility.",
                howToUse: [
                    "Select the input format of your certificate",
                    "Paste or upload your certificate file",
                    "Select the desired output format",
                    "For PFX output, provide the private key and password",
                    "Click Convert and download the result",
                ],
                tips: [
                    "PEM files can contain multiple certificates (chains)",
                    "DER is binary - use Base64 encoding for text display",
                    "PFX/P12 requires the private key for creation",
                    "P7B format is for certificate chains only (no private keys)",
                    "CRT and CER can be either PEM or DER encoded",
                ],
                useCases: [
                    "Converting PEM to DER for Java applications",
                    "Creating PFX files for Windows IIS",
                    "Extracting certificates from P7B chains",
                    "Converting server certificates for different web servers",
                    "Preparing certificates for mobile app deployment",
                ],
            }}
        >
            <Card>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    {/* Format descriptions */}
                    <Collapse items={[{
                        key: "formats",
                        label: <Text strong>Certificate Format Reference</Text>,
                        children: (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                                {Object.entries(FORMATS).map(([key, info]) => (
                                    <Card key={key} size="small" style={{ background: darkMode ? "#1f1f1f" : "#fafafa" }}>
                                        <Space direction="vertical" size="small">
                                            <Space>
                                                <Text strong>{key}</Text>
                                                <Tag>{info.extension}</Tag>
                                                {info.isBinary && <Tag color="orange">Binary</Tag>}
                                            </Space>
                                            <Text type="secondary" style={{ fontSize: 12 }}>{info.description}</Text>
                                        </Space>
                                    </Card>
                                ))}
                            </div>
                        ),
                    }]} />

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Input Format</Text>
                            <Select
                                value={inputFormat}
                                onChange={setInputFormat}
                                style={{ width: "100%" }}
                                options={Object.entries(FORMATS).map(([key, info]) => ({
                                    value: key,
                                    label: `${key} (${info.extension})`,
                                }))}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Output Format</Text>
                            <Select
                                value={outputFormat}
                                onChange={setOutputFormat}
                                style={{ width: "100%" }}
                                options={Object.entries(FORMATS).map(([key, info]) => ({
                                    value: key,
                                    label: `${key} (${info.extension})`,
                                }))}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Text strong>Input Certificate</Text>
                            <label>
                                <input
                                    type="file"
                                    accept=".pem,.der,.pfx,.p12,.p7b,.p7c,.crt,.cer"
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                />
                                <Button icon={<UploadOutlined />} size="small">
                                    Upload File
                                </Button>
                            </label>
                        </div>
                        <TextArea
                            value={inputContent}
                            onChange={(e) => setInputContent(e.target.value)}
                            rows={10}
                            style={{ fontFamily: "monospace" }}
                            placeholder={`Paste your ${inputFormat} certificate here...`}
                        />
                    </div>

                    {outputFormat === "PFX" && (
                        <>
                            <Alert
                                type="info"
                                message="PFX/PKCS#12 Creation"
                                description="PFX format requires the private key and a password to protect the file."
                                showIcon
                            />
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Private Key (PEM)</Text>
                                <TextArea
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    rows={6}
                                    style={{ fontFamily: "monospace" }}
                                    placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                                />
                            </div>
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Password</Text>
                                <Input.Password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password for PFX file"
                                />
                            </div>
                        </>
                    )}

                    <Button
                        type="primary"
                        icon={<SwapOutlined />}
                        onClick={handleConvert}
                        loading={isConverting}
                        size="large"
                        block
                    >
                        Convert to {outputFormat}
                    </Button>

                    {outputContent && (
                        <>
                            <Divider />
                            <div>
                                <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Space>
                                        <Text strong>Output ({outputFormat})</Text>
                                        <Tag color="green">{FORMATS[outputFormat].extension}</Tag>
                                    </Space>
                                    <Space>
                                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(outputContent)}>
                                            Copy
                                        </Button>
                                        <Button size="small" icon={<DownloadOutlined />} onClick={downloadOutput}>
                                            Download
                                        </Button>
                                    </Space>
                                </div>
                                <TextArea
                                    value={outputContent}
                                    readOnly
                                    rows={12}
                                    style={{ fontFamily: "monospace", fontSize: 11 }}
                                />
                            </div>
                        </>
                    )}
                </Space>
            </Card>
        </ToolPageLayout>
    );
}

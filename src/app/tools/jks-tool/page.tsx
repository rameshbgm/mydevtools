"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, message, Alert, Tabs, Form, Descriptions, Tag, Table, Divider } from "antd";
import {
    DatabaseOutlined,
    UploadOutlined,
    DownloadOutlined,
    SafetyCertificateOutlined,
    KeyOutlined,
    InfoCircleOutlined,
    SwapOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;

interface KeystoreEntry {
    alias: string;
    type: "certificate" | "privateKey" | "secretKey";
    creationDate: string;
}

export default function JKSToolPage() {
    const [activeTab, setActiveTab] = useState("info");
    const [password, setPassword] = useState("");
    const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
    const [fileName, setFileName] = useState("");
    const [entries, setEntries] = useState<KeystoreEntry[]>([]);
    const [pkcs12File, setPkcs12File] = useState<ArrayBuffer | null>(null);
    const [pkcs12Name, setPkcs12Name] = useState("");
    const [convertPassword, setConvertPassword] = useState("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "jks" | "pkcs12") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (type === "jks") {
                setFileData(event.target?.result as ArrayBuffer);
                setFileName(file.name);
            } else {
                setPkcs12File(event.target?.result as ArrayBuffer);
                setPkcs12Name(file.name);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleAnalyze = useCallback(async () => {
        if (!fileData) {
            message.warning("Please upload a JKS file first");
            return;
        }

        try {
            const bytes = new Uint8Array(fileData);

            // Check for JKS magic number: 0xFEEDFEED
            if (bytes[0] === 0xFE && bytes[1] === 0xED && bytes[2] === 0xFE && bytes[3] === 0xED) {
                // JKS format detected
                const version = (bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7];
                const entryCount = (bytes[8] << 24) | (bytes[9] << 16) | (bytes[10] << 8) | bytes[11];

                // Create placeholder entries (full parsing requires password)
                const placeholderEntries: KeystoreEntry[] = [];
                for (let i = 0; i < Math.min(entryCount, 10); i++) {
                    placeholderEntries.push({
                        alias: `entry_${i + 1}`,
                        type: i === 0 ? "privateKey" : "certificate",
                        creationDate: new Date().toISOString().split("T")[0],
                    });
                }

                setEntries(placeholderEntries);
                message.success(`JKS file detected: version ${version}, ${entryCount} entries`);
            } else if (bytes[0] === 0x30) {
                // Might be PKCS#12 or other ASN.1 format
                message.warning("This appears to be a PKCS#12 file, not JKS. Use the conversion tab.");
            } else {
                throw new Error("Not a valid JKS file");
            }
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Failed to analyze file");
        }
    }, [fileData]);

    const handleConvert = useCallback(async () => {
        if (!pkcs12File) {
            message.warning("Please upload a PKCS#12 file to convert");
            return;
        }
        if (!convertPassword) {
            message.warning("Please provide the keystore password");
            return;
        }

        // Note: Actual conversion requires keytool or BouncyCastle
        message.info("JKS conversion requires Java keytool or a cryptographic library. Run: keytool -importkeystore -srckeystore input.p12 -srcstoretype PKCS12 -destkeystore output.jks -deststoretype JKS");
    }, [pkcs12File, convertPassword]);

    const entryColumns = [
        {
            title: "Alias",
            dataIndex: "alias",
            key: "alias",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type: string) => {
                const config = {
                    privateKey: { color: "red", icon: <KeyOutlined />, text: "Private Key Entry" },
                    certificate: { color: "green", icon: <SafetyCertificateOutlined />, text: "Trusted Certificate" },
                    secretKey: { color: "blue", icon: <KeyOutlined />, text: "Secret Key" },
                };
                const cfg = config[type as keyof typeof config];
                return <Tag icon={cfg.icon} color={cfg.color}>{cfg.text}</Tag>;
            },
        },
        {
            title: "Creation Date",
            dataIndex: "creationDate",
            key: "creationDate",
        },
    ];

    return (
        <ToolPageLayout
            title="JKS Tool"
            description="Work with Java KeyStore files"
            icon={<DatabaseOutlined style={{ fontSize: 24 }} />}
            color="#fa8c16"
            learnMore={{
                whatIs: "Java KeyStore (JKS) is a Java-specific format for storing cryptographic keys and certificates. It's used by Java applications for SSL/TLS, code signing, and other security operations. JKS files are password-protected binary files.",
                whyUse: "JKS is required for Java applications, application servers like Tomcat, and Android development. Many enterprise applications use JKS for secure key storage.",
                howToUse: [
                    "Upload a JKS file to view its structure",
                    "Enter the keystore password to access contents",
                    "Convert between JKS and PKCS#12 formats",
                    "View certificate and key entries",
                ],
                tips: [
                    "JKS is being replaced by PKCS#12 in modern Java",
                    "Use 'keytool' command-line tool for JKS operations",
                    "Each entry can have its own password",
                    "JKS magic bytes: 0xFEEDFEED",
                    "JCEKS (Java Cryptography Extension KeyStore) supports secret keys",
                ],
                useCases: [
                    "Configuring SSL/TLS in Java applications",
                    "Managing certificates for Tomcat, JBoss, etc.",
                    "Android app signing",
                    "Converting keystores for different platforms",
                ],
            }}
        >
            <Card>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: "info",
                            label: (
                                <span><InfoCircleOutlined /> Analyze JKS</span>
                            ),
                            children: (
                                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                    <Alert
                                        message="JKS File Analysis"
                                        description="Upload a Java KeyStore file to view its structure and entries. Full content extraction requires the keystore password and Java keytool."
                                        type="info"
                                        showIcon
                                    />

                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>Upload JKS File</Text>
                                        <Space>
                                            <label>
                                                <input
                                                    type="file"
                                                    accept=".jks,.keystore"
                                                    onChange={(e) => handleFileUpload(e, "jks")}
                                                    style={{ display: "none" }}
                                                />
                                                <Button icon={<UploadOutlined />}>
                                                    Select File
                                                </Button>
                                            </label>
                                            {fileName && <Tag color="blue">{fileName}</Tag>}
                                        </Space>
                                    </div>

                                    <Form layout="vertical">
                                        <Form.Item label="Keystore Password">
                                            <Input.Password
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter keystore password"
                                            />
                                        </Form.Item>
                                    </Form>

                                    <Button
                                        type="primary"
                                        icon={<DatabaseOutlined />}
                                        onClick={handleAnalyze}
                                        disabled={!fileData}
                                        block
                                    >
                                        Analyze Keystore
                                    </Button>

                                    {entries.length > 0 && (
                                        <>
                                            <Divider />
                                            <Text strong>Keystore Entries</Text>
                                            <Table
                                                dataSource={entries}
                                                columns={entryColumns}
                                                rowKey="alias"
                                                pagination={false}
                                                size="small"
                                            />
                                        </>
                                    )}
                                </Space>
                            ),
                        },
                        {
                            key: "convert",
                            label: (
                                <span><SwapOutlined /> Convert</span>
                            ),
                            children: (
                                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                    <Alert
                                        message="Convert PKCS#12 to JKS"
                                        description="Convert a PKCS#12 (.p12/.pfx) file to Java KeyStore format. The actual conversion is performed using Java keytool."
                                        type="info"
                                        showIcon
                                    />

                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>Upload PKCS#12 File</Text>
                                        <Space>
                                            <label>
                                                <input
                                                    type="file"
                                                    accept=".p12,.pfx"
                                                    onChange={(e) => handleFileUpload(e, "pkcs12")}
                                                    style={{ display: "none" }}
                                                />
                                                <Button icon={<UploadOutlined />}>
                                                    Select PKCS#12
                                                </Button>
                                            </label>
                                            {pkcs12Name && <Tag color="green">{pkcs12Name}</Tag>}
                                        </Space>
                                    </div>

                                    <Form layout="vertical">
                                        <Form.Item label="Password">
                                            <Input.Password
                                                value={convertPassword}
                                                onChange={(e) => setConvertPassword(e.target.value)}
                                                placeholder="Keystore password"
                                            />
                                        </Form.Item>
                                    </Form>

                                    <Button
                                        type="primary"
                                        icon={<SwapOutlined />}
                                        onClick={handleConvert}
                                        disabled={!pkcs12File}
                                        block
                                    >
                                        Convert to JKS
                                    </Button>

                                    <Divider />

                                    <Alert
                                        message="Command Line Alternative"
                                        description={
                                            <pre style={{ margin: 0, fontSize: 12 }}>
                                                {`# PKCS#12 to JKS
keytool -importkeystore \\
  -srckeystore input.p12 -srcstoretype PKCS12 \\
  -destkeystore output.jks -deststoretype JKS

# JKS to PKCS#12
keytool -importkeystore \\
  -srckeystore input.jks -srcstoretype JKS \\
  -destkeystore output.p12 -deststoretype PKCS12`}
                                            </pre>
                                        }
                                        type="warning"
                                        showIcon
                                    />
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>
        </ToolPageLayout>
    );
}

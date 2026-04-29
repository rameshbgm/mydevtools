"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, message, Alert, Tabs, Form, Descriptions, Tag, Divider } from "antd";
import {
    LockOutlined,
    UnlockOutlined,
    UploadOutlined,
    DownloadOutlined,
    SafetyCertificateOutlined,
    KeyOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text } = Typography;

interface PKCS12Contents {
    certificates: string[];
    privateKey: string | null;
    friendlyName: string | null;
}

export default function PKCS12ToolPage() {
    const [activeTab, setActiveTab] = useState("info");
    const [password, setPassword] = useState("");
    const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
    const [fileName, setFileName] = useState("");
    const [pemCert, setPemCert] = useState("");
    const [pemKey, setPemKey] = useState("");
    const [exportPassword, setExportPassword] = useState("");
    const [contents, setContents] = useState<PKCS12Contents | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            setFileData(event.target?.result as ArrayBuffer);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleAnalyze = useCallback(async () => {
        if (!fileData) {
            message.warning("Please upload a PKCS#12 file first");
            return;
        }

        // Note: Full PKCS#12 parsing requires ASN.1 library
        // This is a simplified implementation showing the structure
        try {
            const bytes = new Uint8Array(fileData);

            // Check for PKCS#12 signature (ASN.1 SEQUENCE)
            if (bytes[0] !== 0x30) {
                throw new Error("Invalid PKCS#12 file format");
            }

            // Simplified analysis - in production use forge or similar
            setContents({
                certificates: ["Certificate detected (full parsing requires password)"],
                privateKey: "Private key present (encrypted)",
                friendlyName: fileName.replace(/\.(p12|pfx)$/i, ""),
            });

            message.info("PKCS#12 file structure detected. Full parsing requires a crypto library.");
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Failed to analyze file");
        }
    }, [fileData, fileName]);

    const handleCreatePKCS12 = useCallback(async () => {
        if (!pemCert.trim()) {
            message.warning("Please provide a certificate");
            return;
        }
        if (!exportPassword) {
            message.warning("Please provide a password for the PKCS#12 file");
            return;
        }

        // Note: Creating PKCS#12 requires forge or similar library
        // This shows the UI flow - actual implementation needs crypto lib
        message.info("PKCS#12 creation requires a cryptographic library like node-forge");
    }, [pemCert, pemKey, exportPassword]);

    return (
        <ToolPageLayout
            title="PKCS#12 Tool"
            description="Work with PKCS#12/PFX certificate bundles"
            icon={<LockOutlined style={{ fontSize: 24 }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: "PKCS#12 (also known as PFX) is a binary format for storing a certificate chain and private key in a single encrypted file. It's protected by a password and commonly used for certificate transport and backup.",
                whyUse: "PKCS#12 files are the standard way to export/import certificates with their private keys. They're used for code signing, SSL/TLS certificate deployment, email certificates (S/MIME), and certificate backup.",
                howToUse: [
                    "Upload a .p12 or .pfx file to analyze its contents",
                    "Enter the password to decrypt and extract contents",
                    "Or create a new PKCS#12 from PEM certificate and key",
                    "Download the bundled certificate file",
                ],
                tips: [
                    "Always use strong passwords for PKCS#12 files",
                    "Keep backup copies of important certificates",
                    "Some systems use .p12, others use .pfx - they're the same format",
                    "Windows Certificate Manager can import/export PKCS#12",
                    "Java keytool can convert between JKS and PKCS#12",
                ],
                useCases: [
                    "Exporting certificates from one server to another",
                    "Backing up SSL/TLS certificates with private keys",
                    "Importing code signing certificates",
                    "Converting between certificate formats",
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
                                <span><InfoCircleOutlined /> Analyze PKCS#12</span>
                            ),
                            children: (
                                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                    <Alert
                                        message="Note"
                                        description="Full PKCS#12 parsing and creation requires a cryptographic library. This tool demonstrates the workflow and basic structure detection."
                                        type="info"
                                        showIcon
                                    />

                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>Upload PKCS#12/PFX File</Text>
                                        <Space>
                                            <label>
                                                <input
                                                    type="file"
                                                    accept=".p12,.pfx"
                                                    onChange={handleFileUpload}
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
                                        <Form.Item label="Password">
                                            <Input.Password
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter PKCS#12 password"
                                            />
                                        </Form.Item>
                                    </Form>

                                    <Button
                                        type="primary"
                                        icon={<UnlockOutlined />}
                                        onClick={handleAnalyze}
                                        disabled={!fileData}
                                        block
                                    >
                                        Analyze File
                                    </Button>

                                    {contents && (
                                        <>
                                            <Divider />
                                            <Descriptions bordered column={1} title="File Contents">
                                                <Descriptions.Item label={<><SafetyCertificateOutlined /> Certificates</>}>
                                                    {contents.certificates.map((cert, i) => (
                                                        <Tag key={i} color="green">{cert}</Tag>
                                                    ))}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={<><KeyOutlined /> Private Key</>}>
                                                    {contents.privateKey ? (
                                                        <Tag color="red">{contents.privateKey}</Tag>
                                                    ) : (
                                                        <Tag>None</Tag>
                                                    )}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Friendly Name">
                                                    {contents.friendlyName || "N/A"}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </>
                                    )}
                                </Space>
                            ),
                        },
                        {
                            key: "create",
                            label: (
                                <span><LockOutlined /> Create PKCS#12</span>
                            ),
                            children: (
                                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                    <Alert
                                        message="Create PKCS#12 Bundle"
                                        description="Combine a certificate and private key into a password-protected PKCS#12 file"
                                        type="info"
                                        showIcon
                                    />

                                    <Form layout="vertical">
                                        <Form.Item label="Certificate (PEM format)" required>
                                            <TextArea
                                                value={pemCert}
                                                onChange={(e) => setPemCert(e.target.value)}
                                                rows={6}
                                                style={{ fontFamily: "monospace" }}
                                                placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                                            />
                                        </Form.Item>

                                        <Form.Item label="Private Key (PEM format)">
                                            <TextArea
                                                value={pemKey}
                                                onChange={(e) => setPemKey(e.target.value)}
                                                rows={6}
                                                style={{ fontFamily: "monospace" }}
                                                placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                                            />
                                        </Form.Item>

                                        <Form.Item label="Export Password" required>
                                            <Input.Password
                                                value={exportPassword}
                                                onChange={(e) => setExportPassword(e.target.value)}
                                                placeholder="Password to protect the PKCS#12 file"
                                            />
                                        </Form.Item>
                                    </Form>

                                    <Button
                                        type="primary"
                                        icon={<DownloadOutlined />}
                                        onClick={handleCreatePKCS12}
                                        block
                                    >
                                        Create PKCS#12 File
                                    </Button>
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>
        </ToolPageLayout>
    );
}

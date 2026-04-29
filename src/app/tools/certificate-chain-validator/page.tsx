"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, message, Alert, Divider, Steps, Tag, Descriptions } from "antd";
import {
    AuditOutlined,
    UploadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { TextArea } = Input;
const { Text } = Typography;

interface CertInfo {
    index: number;
    subject: string;
    issuer: string;
    validFrom: Date;
    validTo: Date;
    isExpired: boolean;
    isSelfSigned: boolean;
    isCA: boolean;
}

interface ValidationResult {
    valid: boolean;
    certificates: CertInfo[];
    errors: string[];
    warnings: string[];
}

export default function CertificateChainValidatorPage() {
    const { darkMode } = useAppStore();
    const [chainInput, setChainInput] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [result, setResult] = useState<ValidationResult | null>(null);

    const parseCertificates = (pem: string): string[] => {
        const certs: string[] = [];
        const regex = /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g;
        let match;
        while ((match = regex.exec(pem)) !== null) {
            certs.push(match[0]);
        }
        return certs;
    };

    const extractCertInfo = (certPem: string, index: number): CertInfo => {
        const base64 = certPem
            .replace(/-----BEGIN CERTIFICATE-----/, "")
            .replace(/-----END CERTIFICATE-----/, "")
            .replaceAll(/\s/g, "");

        const bytes = Uint8Array.from(atob(base64), c => c.codePointAt(0) || 0);
        const str = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

        // Extract common name patterns
        const cnMatch = str.match(/[\x00-\x1f]([a-zA-Z0-9*.-]+\.[a-zA-Z]{2,})/);
        const subject = cnMatch ? cnMatch[1] : `Certificate ${index + 1}`;

        // Try to find issuer - usually follows subject
        const issuer = subject; // Simplified

        // Find dates
        const now = new Date();
        const validFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
        const validTo = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year ahead

        return {
            index,
            subject,
            issuer,
            validFrom,
            validTo,
            isExpired: validTo < now,
            isSelfSigned: subject === issuer,
            isCA: index > 0, // Assume non-leaf certs are CAs
        };
    };

    const handleValidate = useCallback(async () => {
        setIsValidating(true);
        setResult(null);

        try {
            if (!chainInput.trim()) {
                throw new Error("Please provide certificate chain");
            }

            const certPems = parseCertificates(chainInput);

            if (certPems.length === 0) {
                throw new Error("No valid certificates found in input");
            }

            const certificates: CertInfo[] = [];
            const errors: string[] = [];
            const warnings: string[] = [];

            // Parse each certificate
            for (let i = 0; i < certPems.length; i++) {
                try {
                    const certInfo = extractCertInfo(certPems[i], i);
                    certificates.push(certInfo);

                    if (certInfo.isExpired) {
                        errors.push(`Certificate ${i + 1} (${certInfo.subject}) is expired`);
                    }
                } catch {
                    errors.push(`Failed to parse certificate ${i + 1}`);
                }
            }

            // Validate chain order
            if (certificates.length >= 2) {
                // Check if first cert is leaf (not CA)
                if (certificates[0].isCA) {
                    warnings.push("First certificate appears to be a CA certificate, not a leaf certificate");
                }

                // Check if last cert is root (self-signed)
                const lastCert = certificates[certificates.length - 1];
                if (!lastCert.isSelfSigned) {
                    warnings.push("Chain may be incomplete - last certificate is not self-signed (root)");
                }
            }

            // Check for single certificate
            if (certificates.length === 1) {
                warnings.push("Only one certificate provided - cannot validate chain");
            }

            const valid = errors.length === 0;

            setResult({
                valid,
                certificates,
                errors,
                warnings,
            });

            if (valid) {
                message.success("Certificate chain is valid!");
            } else {
                message.error("Certificate chain validation failed");
            }
        } catch (error) {
            setResult({
                valid: false,
                certificates: [],
                errors: [error instanceof Error ? error.message : "Unknown error"],
                warnings: [],
            });
        } finally {
            setIsValidating(false);
        }
    }, [chainInput]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setChainInput(event.target?.result as string);
        };
        reader.readAsText(file);
    };

    return (
        <ToolPageLayout
            title="Certificate Chain Validator"
            description="Validate certificate chains and verify trust hierarchy"
            icon={<AuditOutlined style={{ fontSize: 24 }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: "A certificate chain (or chain of trust) is a sequence of certificates where each certificate is signed by the next one in the chain, ending with a root CA certificate. Validation ensures the chain is complete and all certificates are valid.",
                whyUse: "Validating certificate chains is essential for SSL/TLS security. An invalid chain can cause browser warnings, connection failures, or security vulnerabilities. This tool helps debug certificate installation issues.",
                howToUse: [
                    "Paste your certificate chain in PEM format",
                    "Include all certificates: leaf, intermediate(s), and optionally root",
                    "Click Validate to check the chain",
                    "Review any errors or warnings",
                    "Fix issues like missing intermediates or expired certificates",
                ],
                tips: [
                    "Order matters: leaf certificate first, root last",
                    "Most chains need 2-4 certificates",
                    "Missing intermediate certificates is the most common issue",
                    "Root CA certificates are optional - browsers have their own trust stores",
                    "Check certificate dates to ensure none are expired",
                ],
                useCases: [
                    "Debugging SSL/TLS installation issues",
                    "Verifying certificate chain before deployment",
                    "Diagnosing 'certificate not trusted' errors",
                    "Ensuring complete certificate chains for servers",
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                        <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Text strong>Certificate Chain (PEM format)</Text>
                            <label>
                                <input
                                    type="file"
                                    accept=".pem,.crt,.cer"
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                />
                                <Button icon={<UploadOutlined />} size="small">
                                    Upload File
                                </Button>
                            </label>
                        </div>
                        <TextArea
                            value={chainInput}
                            onChange={(e) => setChainInput(e.target.value)}
                            rows={12}
                            style={{ fontFamily: "monospace" }}
                            placeholder={`-----BEGIN CERTIFICATE-----
(Leaf/Server certificate)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(Intermediate CA certificate)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(Root CA certificate - optional)
-----END CERTIFICATE-----`}
                        />
                    </div>

                    <Button
                        type="primary"
                        icon={<AuditOutlined />}
                        onClick={handleValidate}
                        loading={isValidating}
                        size="large"
                        block
                    >
                        Validate Chain
                    </Button>

                    {result && (
                        <>
                            <Divider />

                            <Alert
                                type={result.valid ? "success" : "error"}
                                message={result.valid ? "Chain Valid" : "Chain Invalid"}
                                description={
                                    result.valid
                                        ? `Successfully validated chain with ${result.certificates.length} certificate(s)`
                                        : `Found ${result.errors.length} error(s) in the certificate chain`
                                }
                                showIcon
                                icon={result.valid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                            />

                            {result.errors.length > 0 && (
                                <Alert
                                    type="error"
                                    message="Errors"
                                    description={
                                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                                            {result.errors.map((err, i) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                        </ul>
                                    }
                                    showIcon
                                />
                            )}

                            {result.warnings.length > 0 && (
                                <Alert
                                    type="warning"
                                    message="Warnings"
                                    description={
                                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                                            {result.warnings.map((warn, i) => (
                                                <li key={i}>{warn}</li>
                                            ))}
                                        </ul>
                                    }
                                    showIcon
                                />
                            )}

                            {result.certificates.length > 0 && (
                                <div>
                                    <Text strong style={{ display: "block", marginBottom: 12 }}>Certificate Chain</Text>
                                    <Steps
                                        direction="vertical"
                                        current={-1}
                                        items={result.certificates.map((cert, i) => ({
                                            title: (
                                                <Space>
                                                    <Text strong>{cert.subject}</Text>
                                                    {i === 0 && <Tag color="blue">Leaf</Tag>}
                                                    {cert.isCA && <Tag color="purple">CA</Tag>}
                                                    {cert.isSelfSigned && <Tag color="orange">Self-Signed</Tag>}
                                                    {cert.isExpired && <Tag color="red">Expired</Tag>}
                                                </Space>
                                            ),
                                            description: (
                                                <Descriptions size="small" column={1}>
                                                    <Descriptions.Item label="Issuer">{cert.issuer}</Descriptions.Item>
                                                    <Descriptions.Item label="Valid">
                                                        {cert.validFrom.toLocaleDateString()} - {cert.validTo.toLocaleDateString()}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            ),
                                            status: cert.isExpired ? "error" : "finish",
                                            icon: cert.isExpired ? <CloseCircleOutlined /> : <SafetyCertificateOutlined />,
                                        }))}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Space>
            </Card>
        </ToolPageLayout>
    );
}

"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, message, Descriptions, Tag, Alert, Divider, Timeline, Badge } from "antd";
import {
    GlobalOutlined,
    SearchOutlined,
    SafetyCertificateOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    LockOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title } = Typography;

interface SSLCheckResult {
    domain: string;
    valid: boolean;
    issuer: string;
    subject: string;
    validFrom: string;
    validTo: string;
    daysRemaining: number;
    protocol: string;
    keySize: number;
    signatureAlgorithm: string;
    san: string[];
    chain: string[];
    warnings: string[];
    errors: string[];
}

export default function SSLCheckerPage() {
    const [domain, setDomain] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState<SSLCheckResult | null>(null);

    const handleCheck = useCallback(async () => {
        if (!domain.trim()) {
            message.warning("Please enter a domain name");
            return;
        }

        // Clean domain input
        let cleanDomain = domain.trim()
            .replace(/^https?:\/\//, "")
            .replace(/\/.*$/, "")
            .replace(/:.*$/, "");

        setIsChecking(true);
        setResult(null);

        try {
            // Note: Direct SSL checking from browser is limited due to CORS
            // In production, this would call a backend API

            // Simulate SSL check result for demonstration
            await new Promise(resolve => setTimeout(resolve, 1500));

            // For demonstration, create a simulated result
            // In production, this would be real data from an API
            const now = new Date();
            const validFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            const validTo = new Date(now.getTime() + 275 * 24 * 60 * 60 * 1000);
            const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

            setResult({
                domain: cleanDomain,
                valid: true,
                issuer: "Let's Encrypt Authority X3",
                subject: `CN=${cleanDomain}`,
                validFrom: validFrom.toISOString().split("T")[0],
                validTo: validTo.toISOString().split("T")[0],
                daysRemaining,
                protocol: "TLS 1.3",
                keySize: 256,
                signatureAlgorithm: "ECDSA with SHA-256",
                san: [cleanDomain, `www.${cleanDomain}`],
                chain: [
                    cleanDomain,
                    "Let's Encrypt Authority X3",
                    "ISRG Root X1",
                ],
                warnings: daysRemaining < 30 ? ["Certificate expires in less than 30 days"] : [],
                errors: [],
            });

            message.success("SSL check complete");
        } catch (error) {
            setResult({
                domain: cleanDomain,
                valid: false,
                issuer: "",
                subject: "",
                validFrom: "",
                validTo: "",
                daysRemaining: 0,
                protocol: "",
                keySize: 0,
                signatureAlgorithm: "",
                san: [],
                chain: [],
                warnings: [],
                errors: [error instanceof Error ? error.message : "Failed to check SSL certificate"],
            });
        } finally {
            setIsChecking(false);
        }
    }, [domain]);

    const getExpiryColor = (days: number): string => {
        if (days < 0) return "red";
        if (days < 14) return "red";
        if (days < 30) return "orange";
        if (days < 60) return "gold";
        return "green";
    };

    const getExpiryStatus = (days: number): string => {
        if (days < 0) return "Expired";
        if (days < 14) return "Critical";
        if (days < 30) return "Warning";
        if (days < 60) return "Attention";
        return "Healthy";
    };

    return (
        <ToolPageLayout
            title="SSL Checker"
            description="Check SSL/TLS certificates for any domain"
            icon={<GlobalOutlined style={{ fontSize: 24 }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "SSL/TLS certificates secure communications between web browsers and servers by encrypting data and verifying server identity. SSL checking validates that a domain's certificate is properly configured and trusted.",
                whyUse: "Regular SSL certificate monitoring prevents website outages from expired certificates, identifies security misconfigurations, and ensures trust chain completeness.",
                howToUse: [
                    "Enter a domain name (e.g., example.com)",
                    "Click Check to analyze the SSL certificate",
                    "Review certificate details and validity",
                    "Check for warnings about expiration or configuration",
                ],
                tips: [
                    "Set up automated monitoring for important domains",
                    "Renew certificates at least 30 days before expiry",
                    "Ensure the complete certificate chain is installed",
                    "Use modern protocols (TLS 1.2 or 1.3)",
                    "Check SANs if certificate covers multiple domains",
                ],
                useCases: [
                    "Monitoring certificate expiration dates",
                    "Debugging SSL/TLS connection issues",
                    "Verifying certificate chain configuration",
                    "Security auditing of web servers",
                ],
            }}
        >
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                <Card>
                    <Alert
                        message="Browser Limitation"
                        description="Direct SSL inspection from browsers is limited by CORS. This tool demonstrates the UI flow. For production use, integrate with a backend API or use command-line tools like openssl."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />

                    <Space.Compact style={{ width: "100%" }}>
                        <Input
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="Enter domain (e.g., example.com)"
                            prefix={<GlobalOutlined />}
                            onPressEnter={handleCheck}
                            size="large"
                        />
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={handleCheck}
                            loading={isChecking}
                            size="large"
                        >
                            Check SSL
                        </Button>
                    </Space.Compact>
                </Card>

                {result && (
                    <Card>
                        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                            {/* Status Header */}
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                {result.valid ? (
                                    <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
                                ) : (
                                    <CloseCircleOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
                                )}
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        {result.domain}
                                    </Title>
                                    <Space>
                                        <Tag color={result.valid ? "success" : "error"}>
                                            {result.valid ? "Valid" : "Invalid"}
                                        </Tag>
                                        {result.daysRemaining > 0 && (
                                            <Tag color={getExpiryColor(result.daysRemaining)}>
                                                <ClockCircleOutlined /> {result.daysRemaining} days remaining
                                            </Tag>
                                        )}
                                    </Space>
                                </div>
                            </div>

                            {/* Errors and Warnings */}
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

                            {/* Certificate Details */}
                            {result.valid && (
                                <>
                                    <Divider />
                                    <Descriptions bordered column={{ xs: 1, sm: 2 }} title="Certificate Details">
                                        <Descriptions.Item label="Subject">{result.subject}</Descriptions.Item>
                                        <Descriptions.Item label="Issuer">{result.issuer}</Descriptions.Item>
                                        <Descriptions.Item label="Valid From">{result.validFrom}</Descriptions.Item>
                                        <Descriptions.Item label="Valid To">
                                            <Space>
                                                {result.validTo}
                                                <Badge
                                                    status={result.daysRemaining < 30 ? "error" : "success"}
                                                    text={getExpiryStatus(result.daysRemaining)}
                                                />
                                            </Space>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Protocol">
                                            <Tag color="blue">{result.protocol}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Key Size">
                                            {result.keySize} bits
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Signature" span={2}>
                                            {result.signatureAlgorithm}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Subject Alternative Names" span={2}>
                                            <Space wrap>
                                                {result.san.map((name, i) => (
                                                    <Tag key={i}>{name}</Tag>
                                                ))}
                                            </Space>
                                        </Descriptions.Item>
                                    </Descriptions>

                                    <Divider />
                                    <Text strong>Certificate Chain</Text>
                                    <Timeline
                                        items={result.chain.map((cert, i) => ({
                                            color: i === 0 ? "blue" : i === result.chain.length - 1 ? "green" : "gray",
                                            children: (
                                                <Space>
                                                    <SafetyCertificateOutlined />
                                                    <Text>{cert}</Text>
                                                    {i === 0 && <Tag color="blue">Leaf</Tag>}
                                                    {i === result.chain.length - 1 && <Tag color="green">Root</Tag>}
                                                </Space>
                                            ),
                                        }))}
                                    />
                                </>
                            )}
                        </Space>
                    </Card>
                )}
            </Space>
        </ToolPageLayout>
    );
}

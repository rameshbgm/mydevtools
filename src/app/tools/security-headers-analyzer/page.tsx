"use client";

import { useMemo, useState } from "react";
import { Alert, Card, Input, Space, Tag, Typography } from "antd";
import { SecurityScanOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { analyseSecurityHeaders, parseResponseHeaders, type SecurityFinding } from "@/lib/security-headers";

const { TextArea } = Input;
const { Text } = Typography;
const SAMPLE = `Content-Security-Policy: default-src 'self'; object-src 'none'; frame-ancestors 'none'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()`;
const colors: Record<SecurityFinding["severity"], string> = { high: "error", medium: "warning", low: "gold", info: "success" };

export default function SecurityHeadersAnalyzerPage() {
    const [headers, setHeaders] = useState(SAMPLE);
    const findings = useMemo(() => analyseSecurityHeaders(headers), [headers]);
    const parsed = useMemo(() => parseResponseHeaders(headers), [headers]);
    const high = findings.filter((item) => item.severity === "high").length;
    return (
        <ToolPageLayout
            title="Security Headers & CSP Analyzer"
            description="Audit pasted HTTP response headers and explain practical browser-security gaps"
            icon={<SecurityScanOutlined style={{ fontSize: 24, color: "#cf1322" }} />}
            color="#cf1322"
            learnMore={{
                whatIs: "A local analyzer for Content-Security-Policy, HSTS, nosniff, Referrer-Policy, and Permissions-Policy headers.",
                whyUse: "Security headers are easy to omit and difficult to review from a raw response. The analyzer turns them into focused next actions without scanning your site.",
                howToUse: ["Copy response headers from your browser, CDN, or curl output", "Paste them below", "Read each finding and tailor the suggested policy to your app"],
                tips: ["Test new CSP policies with Content-Security-Policy-Report-Only first.", "Do not enable HSTS preload until every relevant subdomain supports HTTPS.", "A green result is not a substitute for application security testing."],
                useCases: ["Deployment reviews", "CSP migrations", "CDN and reverse-proxy configuration checks"],
            }}
        >
            <Card title="Response headers">
                <TextArea aria-label="HTTP response headers" value={headers} onChange={(event) => setHeaders(event.target.value)} autoSize={{ minRows: 10, maxRows: 24 }} placeholder="Content-Security-Policy: default-src 'self'" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} />
                <Space wrap style={{ marginTop: 12 }}><Tag color="blue">{Object.keys(parsed).length} headers parsed</Tag><Tag color={high ? "error" : "success"}>{high ? `${high} high-priority finding${high === 1 ? "" : "s"}` : "No high-priority finding"}</Tag></Space>
            </Card>
            <Card title="Findings" style={{ marginTop: 16 }}>
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}>{findings.map((finding) => <Space align="start" key={finding.title}><Tag color={colors[finding.severity]}>{finding.severity.toUpperCase()}</Tag><div><Text strong>{finding.title}</Text><br /><Text type="secondary">{finding.detail}</Text></div></Space>)}</Space>
                <Alert type="info" showIcon title="Local analysis only" description="This tool does not fetch a URL or send your headers anywhere." style={{ marginTop: 12 }} />
            </Card>
        </ToolPageLayout>
    );
}

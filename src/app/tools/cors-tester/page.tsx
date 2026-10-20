"use client";

import { useLanguage } from "@/components/LanguageProvider";
import React, { useEffect, useState } from "react";
import {
    Card, Typography, Input, Select, Button, Row, Col, Space, Tag, Alert, Spin,
} from "antd";
import { BugOutlined, SendOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"] as const;
type Method = typeof METHODS[number];

interface CorsResult {
    ok: boolean;
    status?: number;
    durationMs: number;
    responseHeaders?: Record<string, string>;
    body?: string;
    networkError?: string;
    explanation: string;
}

// Browser fetch enforces CORS. If the request is blocked, fetch throws a TypeError
// with no detail (this is intentional in the spec — you can't read response headers
// of a blocked request). We compare the TypeError against the request shape to
// produce a useful explanation.
function explainFailure(): string {
    return "The browser could not expose a response. Possible causes include CORS, DNS, TLS, connectivity and browser policy. Check developer tools and server logs; this tool cannot identify a missing header from a failed fetch.";
}

export default function CorsTesterPage() {
    const { t } = useLanguage();
    const [origin, setOrigin] = useState("");
    useEffect(() => { setOrigin(window.location.origin); }, []);
    const [url, setUrl] = useState("https://httpbin.org/anything");
    const [method, setMethod] = useState<Method>("GET");
    const [headers, setHeaders] = useState("X-Custom-Header: hello");
    const [body, setBody] = useState("");
    const [contentType, setContentType] = useState("application/json");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CorsResult | null>(null);

    const parseHeaders = (text: string): Record<string, string> => {
        const out: Record<string, string> = {};
        text.split("\n").forEach((line) => {
            const colon = line.indexOf(":");
            if (colon === -1) return;
            const k = line.slice(0, colon).trim();
            const v = line.slice(colon + 1).trim();
            if (k) out[k] = v;
        });
        return out;
    };

    const send = async () => {
        setLoading(true);
        setResult(null);
        const customHeaders = parseHeaders(headers);
        const init: RequestInit = {
            method,
            headers: { ...customHeaders, ...(body && !["GET", "HEAD"].includes(method) && !Object.keys(customHeaders).some(key => key.toLowerCase() === "content-type") ? { "Content-Type": contentType } : {}) },
            body: body && !["GET", "HEAD"].includes(method) ? body : undefined,
            mode: "cors",
        };
        const t0 = performance.now();
        try {
            const res = await fetch(url, init);
            const dur = Math.round(performance.now() - t0);
            const resHeaders: Record<string, string> = {};
            res.headers.forEach((v, k) => { resHeaders[k] = v; });
            const text = await res.text();
            setResult({
                ok: res.ok,
                status: res.status,
                durationMs: dur,
                responseHeaders: resHeaders,
                body: text.slice(0, 2000),
                explanation: res.ok
                    ? "The response is readable by this browser. Same-origin requests do not require CORS response headers."
                    : `Upstream returned HTTP ${res.status} — CORS did not block this, the server returned an error response.`,
            });
        } catch (err) {
            const dur = Math.round(performance.now() - t0);
            const msg = err instanceof Error ? err.message : String(err);
            setResult({
                ok: false,
                durationMs: dur,
                networkError: msg,
                explanation: explainFailure(),
            });
        } finally {
            setLoading(false);
        }
    };

    const corsHeaders = result?.responseHeaders
        ? Object.entries(result.responseHeaders).filter(([k]) => k.toLowerCase().startsWith("access-control"))
        : [];

    return (
        <ToolPageLayout
            title={t("CORS Tester")}
            description={t("Send requests from your browser and see exactly how CORS responds")}
            icon={<BugOutlined style={{ fontSize: 24, color: "#22d3ee" }} />}
            color="#22d3ee"
            learnMore={{
                whatIs: t("Send a real browser request and inspect the response permitted by browser CORS rules."),
                whyUse: t("Enter the URL, method, headers and body, then send from this origin."),
                howToUse: [t("A failed fetch can mean CORS, DNS, TLS, connectivity or browser policy; this page cannot distinguish them reliably.")],
                tips: [t("The browser may hide CORS response headers. Use browser developer tools and server logs for the exact failure."), t("A readable HTTP error response passed browser access checks even when its status is not successful.")],
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card size="small" title={t("Request")}>
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                            <Space.Compact style={{ width: "100%" }}>
                                <Select
                                    value={method}
                                    onChange={(v) => setMethod(v)}
                                    options={METHODS.map((m) => ({ value: m, label: m }))}
                                    style={{ width: 110 }}
                                />
                                <Input
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://api.example.com/endpoint" dir="ltr" aria-label={t("Request URL")}
                                />
                            </Space.Compact>

                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>{t("Custom headers (one per line, key: value)")}</Text>
                                <TextArea
                                    value={headers}
                                    onChange={(e) => setHeaders(e.target.value)}
                                    autoSize={{ minRows: 3, maxRows: 6 }}
                                    placeholder="Authorization: Bearer …"
                                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} dir="ltr" aria-label={t("Request headers")}
                                />
                            </div>

                            {!["GET", "HEAD"].includes(method) && (
                                <>
                                    <div>
                                        <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>Content-Type</Text>
                                        <Select
                                            value={contentType}
                                            onChange={setContentType}
                                            style={{ width: "100%" }}
                                            options={[
                                                "application/json",
                                                "text/plain",
                                                "application/x-www-form-urlencoded",
                                                "multipart/form-data",
                                                "application/xml",
                                            ].map((v) => ({ value: v, label: v }))}
                                        />
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>{t("Body")}</Text>
                                        <TextArea
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            autoSize={{ minRows: 3, maxRows: 8 }}
                                            placeholder='{"hello":"world"}'
                                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} dir="ltr" aria-label={t("Request body")}
                                        />
                                    </div>
                                </>
                            )}

                            <Button type="primary" icon={<SendOutlined />} onClick={send} loading={loading} block>
                                {t("Send from this origin")}
                            </Button>
                            <Paragraph type="secondary" style={{ fontSize: 11, margin: 0 }}>
                                {t("Request origin:")} <code>{origin || t("this origin")}</code>
                            </Paragraph>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    {loading && <Card><Spin /> {t("Sending…")}</Card>}
                    {!loading && !result && (
                        <Card>
                            <Text type="secondary">{t("Send a request to see the CORS verdict.")}</Text>
                        </Card>
                    )}
                    {result && (
                        <>
                            <Card size="small" title={
                                <Space>
                                    <Text strong>{t("Verdict")}</Text>
                                    {result.ok ? (
                                        <Tag color="green">{t("Allowed by browser")}</Tag>
                                    ) : result.networkError ? (
                                        <Tag color="red">{t("No readable response")}</Tag>
                                    ) : (
                                        <Tag color="orange">HTTP {result.status}</Tag>
                                    )}
                                    <Tag>{result.durationMs} ms</Tag>
                                </Space>
                            }>
                                <Alert
                                    type={result.ok ? "success" : "warning"}
                                    title={result.status && !result.ok && !result.networkError ? t("Upstream returned HTTP {status}; the browser allowed this response.", { status: result.status }) : t(result.explanation)}
                                    showIcon
                                />
                                {result.networkError && (
                                    <Paragraph style={{ marginTop: 12, fontFamily: "var(--font-geist-mono)", fontSize: 12 }} type="danger">
                                        {result.networkError}
                                    </Paragraph>
                                )}
                            </Card>

                            {corsHeaders.length > 0 && (
                                <Card size="small" title={t("Access-Control-* headers")} style={{ marginTop: 16 }}>
                                    <Space orientation="vertical" style={{ width: "100%" }}>
                                        {corsHeaders.map(([k, v]) => (
                                            <div key={k} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>
                                                <Tag color="cyan">{k}</Tag>
                                                <Text>{v}</Text>
                                            </div>
                                        ))}
                                    </Space>
                                </Card>
                            )}

                            {result.body && (
                                <Card size="small" title={t("Response body (first 2,000 characters)")} style={{ marginTop: 16 }}>
                                    <pre style={{ margin: 0, fontFamily: "var(--font-geist-mono)", fontSize: 11, whiteSpace: "pre-wrap" }}>
                                        {result.body}
                                    </pre>
                                </Card>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

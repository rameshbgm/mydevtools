"use client";

import React, { useState } from "react";
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
function explainFailure(method: Method, hasCustomHeaders: boolean, bodyType: string): string {
    const simpleMethod = ["GET", "POST", "HEAD"].includes(method);
    const simpleContentType = ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"].includes(bodyType);
    const triggersPreflight = !simpleMethod || hasCustomHeaders || (method === "POST" && !simpleContentType);
    if (triggersPreflight) {
        return "Browser sent a preflight OPTIONS request. The upstream server must respond with Access-Control-Allow-Origin, Access-Control-Allow-Methods (covering " +
            method + "), and Access-Control-Allow-Headers (covering any custom headers) before the browser will issue the actual request. The most common cause is the upstream not handling OPTIONS at all.";
    }
    return "Request was simple (no preflight), but the upstream did not return Access-Control-Allow-Origin matching this page's origin. Add the header server-side, or use a server-side proxy if you don't control the upstream.";
}

export default function CorsTesterPage() {
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
            headers: { ...customHeaders, ...(body && !customHeaders["Content-Type"] ? { "Content-Type": contentType } : {}) },
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
                    ? "Request succeeded. The browser saw an Access-Control-Allow-Origin header that allows this page's origin."
                    : `Upstream returned HTTP ${res.status} — CORS did not block this, the server returned an error response.`,
            });
        } catch (err) {
            const dur = Math.round(performance.now() - t0);
            const msg = err instanceof Error ? err.message : String(err);
            setResult({
                ok: false,
                durationMs: dur,
                networkError: msg,
                explanation: explainFailure(method, Object.keys(customHeaders).length > 0, contentType),
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
            title="CORS Tester"
            description="Send requests from your browser and see exactly how CORS responds"
            icon={<BugOutlined style={{ fontSize: 24, color: "#22d3ee" }} />}
            color="#22d3ee"
            learnMore={{
                whatIs: "CORS Tester sends a real fetch from your browser to a chosen URL and shows whether the browser allowed the response, what CORS headers the upstream returned, and a plain-English explanation when things fail.",
                whyUse: "CORS errors in the browser console are notoriously cryptic — 'TypeError: Failed to fetch' tells you nothing about preflight vs simple requests, missing headers, or origin mismatches. This tool decodes the failure mode.",
                howToUse: [
                    "Enter the URL, method and any custom headers",
                    "Click Send — the request goes from your browser (this origin) to the upstream",
                    "Inspect the Access-Control-* headers and the verdict",
                    "If blocked, read the explanation — it tells you exactly which header is missing",
                ],
                tips: [
                    "Custom headers or non-simple content types trigger a preflight OPTIONS",
                    "If a request fails with no response headers, the browser blocked it before reading the body",
                    "Use httpbin.org/anything as a quick echo server to confirm your client is set up right",
                ],
                useCases: [
                    "Debugging 'Failed to fetch' errors in your own app",
                    "Verifying CORS config on an API before shipping",
                    "Teaching CORS to new team members with live examples",
                ],
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card size="small" title="Request">
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
                                    placeholder="https://api.example.com/endpoint"
                                />
                            </Space.Compact>

                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>Custom headers (one per line, key: value)</Text>
                                <TextArea
                                    value={headers}
                                    onChange={(e) => setHeaders(e.target.value)}
                                    autoSize={{ minRows: 3, maxRows: 6 }}
                                    placeholder="Authorization: Bearer …"
                                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
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
                                        <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>Body</Text>
                                        <TextArea
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            autoSize={{ minRows: 3, maxRows: 8 }}
                                            placeholder='{"hello":"world"}'
                                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                                        />
                                    </div>
                                </>
                            )}

                            <Button type="primary" icon={<SendOutlined />} onClick={send} loading={loading} block>
                                Send from this origin
                            </Button>
                            <Paragraph type="secondary" style={{ fontSize: 11, margin: 0 }}>
                                Request runs from <code>{typeof window !== "undefined" ? window.location.origin : "this origin"}</code> — the upstream sees that as <code>Origin:</code>.
                            </Paragraph>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    {loading && <Card><Spin /> Sending…</Card>}
                    {!loading && !result && (
                        <Card>
                            <Text type="secondary">Send a request to see the CORS verdict.</Text>
                        </Card>
                    )}
                    {result && (
                        <>
                            <Card size="small" title={
                                <Space>
                                    <Text strong>Verdict</Text>
                                    {result.ok ? (
                                        <Tag color="green">Allowed by browser</Tag>
                                    ) : result.networkError ? (
                                        <Tag color="red">Blocked by CORS</Tag>
                                    ) : (
                                        <Tag color="orange">HTTP {result.status}</Tag>
                                    )}
                                    <Tag>{result.durationMs} ms</Tag>
                                </Space>
                            }>
                                <Alert
                                    type={result.ok ? "success" : "warning"}
                                    title={result.explanation}
                                    showIcon
                                />
                                {result.networkError && (
                                    <Paragraph style={{ marginTop: 12, fontFamily: "var(--font-geist-mono)", fontSize: 12 }} type="danger">
                                        {result.networkError}
                                    </Paragraph>
                                )}
                            </Card>

                            {corsHeaders.length > 0 && (
                                <Card size="small" title="Access-Control-* headers" style={{ marginTop: 16 }}>
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
                                <Card size="small" title="Response body (first 2 KB)" style={{ marginTop: 16 }}>
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

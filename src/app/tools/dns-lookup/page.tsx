"use client";

import React, { useState } from "react";
import { Card, Typography, Input, Button, Row, Col, Space, Tag, Select, App, Spin, Empty } from "antd";
import { GlobalOutlined, SearchOutlined, CopyOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { parseJsonResponse } from "@/lib/certificate-fetch-response";
import { copyToClipboard } from "@/lib/clipboard";

const { Text, Paragraph } = Typography;

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "CAA", "SRV"] as const;
type RecordType = typeof RECORD_TYPES[number];

const TYPE_CODE: Record<RecordType, number> = {
    A: 1, AAAA: 28, CNAME: 5, MX: 15, TXT: 16, NS: 2, SOA: 6, CAA: 257, SRV: 33,
};
const CODE_TO_TYPE: Record<number, string> = Object.fromEntries(
    Object.entries(TYPE_CODE).map(([k, v]) => [v, k])
);

interface DohAnswer { name: string; type: number; TTL: number; data: string; }
interface DohResponse { Status: number; TC?: boolean; Answer?: DohAnswer[]; Authority?: DohAnswer[]; Comment?: string; }

const RESOLVERS = [
    { value: "cloudflare", label: "Cloudflare (1.1.1.1)", url: "https://cloudflare-dns.com/dns-query" },
    { value: "google", label: "Google (8.8.8.8)", url: "https://dns.google/resolve" },
];

export default function DnsLookupPage() {
    const { message } = App.useApp();
    const [hostname, setHostname] = useState("example.com");
    const [types, setTypes] = useState<RecordType[]>(["A", "AAAA", "MX", "NS", "TXT"]);
    const [resolver, setResolver] = useState("cloudflare");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Record<string, DohResponse | { error: string }> | null>(null);

    const resolverUrl = RESOLVERS.find((r) => r.value === resolver)?.url || RESOLVERS[0].url;

    const lookup = async () => {
        const host = hostname.trim();
        if (!host) { message.warning("Enter a hostname"); return; }
        setLoading(true);
        setResults(null);
        const out: Record<string, DohResponse | { error: string }> = {};
        await Promise.all(types.map(async (t) => {
            try {
                const url = `${resolverUrl}?name=${encodeURIComponent(host)}&type=${t}`;
                const res = await fetch(url, { headers: { Accept: "application/dns-json" } });
                if (!res.ok) {
                    out[t] = { error: `HTTP ${res.status}` };
                    return;
                }
                out[t] = await parseJsonResponse<DohResponse>(res, "DNS resolver");
            } catch (err) {
                out[t] = { error: err instanceof Error ? err.message : String(err) };
            }
        }));
        setResults(out);
        setLoading(false);
    };

    const copyAll = async () => {
        if (!results) return;
        const lines: string[] = [`; DNS lookup for ${hostname} via ${resolver}`, ""];
        Object.entries(results).forEach(([t, r]) => {
            lines.push(`;; ${t}`);
            if ("error" in r) { lines.push(`; error: ${r.error}`); return; }
            (r.Answer || []).forEach((a) => {
                lines.push(`${a.name}\t${a.TTL}\tIN\t${CODE_TO_TYPE[a.type] || a.type}\t${a.data}`);
            });
            if (!r.Answer?.length) lines.push("; (no records)");
            lines.push("");
        });
        await copyToClipboard(lines.join("\n"));
        message.success("Copied as zone-file lines");
    };

    return (
        <ToolPageLayout
            title="DNS Lookup"
            description="Resolve A, AAAA, CNAME, MX, TXT, NS, SOA records via DNS-over-HTTPS"
            icon={<GlobalOutlined style={{ fontSize: 24, color: "#1890ff" }} />}
            color="#1890ff"
            learnMore={{
                whatIs: "DNS Lookup queries public DNS-over-HTTPS (DoH) resolvers from your browser. DoH wraps DNS in standard HTTPS, so the lookup works from any network and bypasses CORS restrictions on raw DNS.",
                whyUse: "Native nslookup/dig need a terminal. DoH lookups in the browser are quick, network-agnostic, and let you compare what different resolvers return.",
                howToUse: [
                    "Enter a hostname (no protocol, no path)",
                    "Pick the record types you want",
                    "Lookups fan out in parallel and return as soon as the resolver answers",
                    "Copy the result as standard zone-file lines",
                ],
                tips: [
                    "TXT records often hold SPF, DKIM verifiers and domain ownership proofs",
                    "MX preference is the first number in the data field — lower = more preferred",
                    "If A and AAAA both return, the host is dual-stack",
                ],
                useCases: [
                    "Verifying DNS propagation after a record change",
                    "Inspecting third-party domains (CDN, email, auth provider)",
                    "Debugging email delivery (SPF/DKIM/DMARC TXT records)",
                ],
            }}
        >
            <Card>
                <Space.Compact style={{ width: "100%" }}>
                    <Input
                        placeholder="example.com"
                        value={hostname}
                        onChange={(e) => setHostname(e.target.value)}
                        onPressEnter={lookup}
                        size="large"
                    />
                    <Button type="primary" icon={<SearchOutlined />} onClick={lookup} loading={loading} size="large">
                        Lookup
                    </Button>
                </Space.Compact>
                <Space wrap style={{ marginTop: 12, width: "100%" }}>
                    <Text type="secondary">Types:</Text>
                    <Select
                        mode="multiple"
                        value={types}
                        onChange={(v) => setTypes(v as RecordType[])}
                        options={RECORD_TYPES.map((t) => ({ value: t, label: t }))}
                        style={{ minWidth: 280 }}
                        maxTagCount="responsive"
                    />
                    <Text type="secondary">Resolver:</Text>
                    <Select value={resolver} onChange={setResolver} options={RESOLVERS} style={{ minWidth: 220 }} />
                </Space>
            </Card>

            {loading && <Card style={{ marginTop: 16 }}><Spin /> Querying resolver…</Card>}

            {results && (
                <Card
                    style={{ marginTop: 16 }}
                    title="Results"
                    extra={<a onClick={copyAll}><CopyOutlined /> Copy all</a>}
                >
                    <Row gutter={[16, 16]}>
                        {Object.entries(results).map(([t, r]) => (
                            <Col xs={24} md={12} key={t}>
                                <Card size="small" title={<Space><Tag color="blue">{t}</Tag></Space>}>
                                    {"error" in r ? (
                                        <Text type="danger">{r.error}</Text>
                                    ) : !(r.Answer && r.Answer.length) ? (
                                        <Empty description="No records" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    ) : (
                                        <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>
                                            {r.Answer.map((a, i) => (
                                                <div key={i} style={{ padding: "4px 0", borderBottom: i < r.Answer!.length - 1 ? "1px solid rgba(0,0,0,0.06)" : undefined }}>
                                                    <div style={{ wordBreak: "break-all" }}>{a.data}</div>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>TTL {a.TTL}s</Text>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Paragraph type="secondary" style={{ marginTop: 16, fontSize: 11, marginBottom: 0 }}>
                        Lookups go directly from your browser to the chosen DoH resolver — no proxy, no logging by mydevtools.
                    </Paragraph>
                </Card>
            )}
        </ToolPageLayout>
    );
}

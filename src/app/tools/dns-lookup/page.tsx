"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, Typography, Input, Button, Row, Col, Space, Tag, Select, App, Spin, Empty } from "antd";
import { GlobalOutlined, SearchOutlined, CopyOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
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
    const { t } = useLanguage();
    const tRef = useRef(t);
    useEffect(() => { tRef.current = t; }, [t]);
    const { message } = App.useApp();
    const [hostname, setHostname] = useState("example.com");
    const [types, setTypes] = useState<RecordType[]>(["A", "AAAA", "MX", "NS", "TXT"]);
    const [resolver, setResolver] = useState("cloudflare");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Record<string, DohResponse | { error: string }> | null>(null);

    const resolverUrl = RESOLVERS.find((r) => r.value === resolver)?.url || RESOLVERS[0].url;

    const lookup = async () => {
        const host = hostname.trim();
        if (!host) { message.warning(t("Enter a hostname")); return; }
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
        const copied = await copyToClipboard(lines.join("\n"));
        if (copied) message.success(tRef.current("Copied as zone-file lines"));
    };

    return (
        <ToolPageLayout
            title={t("DNS Lookup")}
            description={t("Resolve A, AAAA, CNAME, MX, TXT, NS, SOA records via DNS-over-HTTPS")}
            icon={<GlobalOutlined style={{ fontSize: 24, color: "var(--wb-accent)" }} />}
            color="#1890ff"
            learnMore={{
                whatIs: t("Query public DNS-over-HTTPS resolvers directly from your browser. The selected resolver receives the hostname and record types."),
                whyUse: t("Compare DNS answers while diagnosing domain, email or resolver configuration."),
                howToUse: [t("Enter a hostname without a protocol or path."), t("Choose record types and a resolver, then select Lookup."), t("Copy returned answers as zone-file lines.")],
                tips: [t("TXT records can contain SPF, DKIM and ownership checks. MX preference uses smaller numbers first."), t("Resolver access depends on network policy, CORS support and connectivity.")],
                useCases: [t("Check DNS changes and investigate email delivery.")],
            }}
        >
            <Card>
                <Space.Compact style={{ width: "100%" }}>
                    <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                        aria-label={t("Hostname")} placeholder="example.com"
                        value={hostname}
                        onChange={(e) => setHostname(e.target.value)}
                        onPressEnter={lookup}
                        size="large"
                    />
                    <Button type="primary" icon={<SearchOutlined />} onClick={lookup} loading={loading} size="large">
                        {t("Lookup")}</Button>
                </Space.Compact>
                <Space wrap style={{ marginTop: 12, width: "100%" }}>
                    <Text type="secondary">{t("Types:")}</Text>
                    <Select
                        mode="multiple"
                        value={types}
                        onChange={(v) => setTypes(v as RecordType[])}
                        options={RECORD_TYPES.map((t) => ({ value: t, label: t }))}
                        style={{ width: "min(100%, 360px)", minWidth: 0 }} aria-label={t("Record types")}
                        maxTagCount="responsive"
                    />
                    <Text type="secondary">{t("Resolver:")}</Text>
                    <Select value={resolver} onChange={setResolver} options={RESOLVERS} style={{ width: "min(100%, 280px)", minWidth: 0 }} aria-label={t("DNS resolver")} />
                </Space>
            </Card>

            {loading && <Card style={{ marginTop: 16 }}><Spin /> {t("Querying resolver…")}</Card>}

            {results && (
                <Card
                    style={{ marginTop: 16 }}
                    title={t("Results")}
                    extra={<Button type="text" icon={<CopyOutlined />} onClick={copyAll}>{t("Copy all")}</Button>}
                >
                    <Row gutter={[16, 16]}>
                        {Object.entries(results).map(([recordType, r]) => (
                            <Col xs={24} md={12} key={recordType}>
                                <Card size="small" title={<Space><Tag color="blue">{recordType}</Tag></Space>}>
                                    {"error" in r ? (
                                        <Text type="danger">{r.error}</Text>
                                    ) : !(r.Answer && r.Answer.length) ? (
                                        <Empty description={t("No records")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    ) : (
                                        <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}>
                                            {r.Answer.map((a, i) => (
                                                <div key={i} style={{ padding: "4px 0", borderBottom: i < r.Answer!.length - 1 ? "var(--wb-card-border)" : undefined }}>
                                                    <div dir="ltr" style={{ direction: "ltr", textAlign: "left", wordBreak: "break-all" }}>{a.data}</div>
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
                        {t("Lookups go directly from your browser to the chosen DoH resolver — no proxy, no logging by mydevtools.")}</Paragraph>
                </Card>
            )}
        </ToolPageLayout>
    );
}

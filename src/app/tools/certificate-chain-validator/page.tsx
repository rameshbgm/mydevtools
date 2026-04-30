"use client";

import React, { useState } from "react";
import { Card, Input, Button, Space, App, Alert, Tag, Steps, Typography, Upload, Empty, Descriptions, Table, InputNumber, Tabs } from "antd";
import {
    AuditOutlined,
    UploadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    GlobalOutlined,
    SecurityScanOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { listPemBlocks, validateChain, formatDN, type ChainValidationResult } from "@/lib/cert-utils";

const { TextArea } = Input;
const { Text } = Typography;

const SAMPLE = `Paste the leaf certificate first, followed by intermediates, root last.

-----BEGIN CERTIFICATE-----
(leaf cert)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(intermediate cert)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(root CA)
-----END CERTIFICATE-----`;

interface CrtShEntry {
    issuer_ca_id: number;
    issuer_name: string;
    common_name: string;
    name_value: string;
    id: number;
    entry_timestamp: string;
    not_before: string;
    not_after: string;
    serial_number: string;
}

export default function CertificateChainValidatorPage() {
    const { message } = App.useApp();

    // Chain Validator state
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ChainValidationResult | null>(null);

    // Fetch from URL state
    const [fetchHost, setFetchHost] = useState("");
    const [fetchPort, setFetchPort] = useState<number>(443);
    const [fetchLoading, setFetchLoading] = useState(false);

    // CT Log Search state
    const [domain, setDomain] = useState("");
    const [ctLoading, setCtLoading] = useState(false);
    const [ctResults, setCtResults] = useState<CrtShEntry[] | null>(null);
    const [ctError, setCtError] = useState<string | null>(null);

    const validate = async () => {
        if (!input.trim()) {
            message.warning("Paste at least one certificate");
            return;
        }
        const blocks = listPemBlocks(input).filter((b) => b.label === "CERTIFICATE");
        if (blocks.length === 0) {
            message.error("No CERTIFICATE PEM blocks found");
            return;
        }
        setLoading(true);
        try {
            const r = await validateChain(blocks.map((b) => b.body));
            setResult(r);
            if (r.valid) message.success("Chain is valid");
            else message.warning(`Found ${r.issues.length} issue${r.issues.length === 1 ? "" : "s"}`);
        } catch (e) {
            message.error(e instanceof Error ? e.message : "Validation failed");
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => setInput((e.target?.result as string) ?? "");
        reader.readAsText(file);
        return false;
    };

    const handleFetch = async () => {
        const host = fetchHost.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        if (!host) {
            message.warning("Enter a hostname");
            return;
        }
        setFetchLoading(true);
        try {
            const res = await fetch(`/api/fetch-cert?host=${encodeURIComponent(host)}&port=${fetchPort}`);
            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
                throw new Error(err.error ?? `HTTP ${res.status}`);
            }
            const data = await res.json();
            const pems: string[] = data.pems ?? [];
            if (pems.length === 0) throw new Error("No certificates returned");
            setInput(pems.join("\n\n"));
            message.success(`Fetched ${pems.length} certificate${pems.length === 1 ? "" : "s"} from ${host}:${fetchPort}`);
        } catch (e) {
            message.error(e instanceof Error ? e.message : "Fetch failed");
        } finally {
            setFetchLoading(false);
        }
    };

    const ctLookup = async () => {
        const cleaned = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        if (!cleaned) {
            message.warning("Enter a domain");
            return;
        }
        setCtLoading(true);
        setCtError(null);
        setCtResults(null);
        try {
            const url = `https://crt.sh/?q=${encodeURIComponent("%." + cleaned)}&output=json`;
            const res = await fetch(url, { headers: { Accept: "application/json" } });
            if (!res.ok) throw new Error(`crt.sh returned ${res.status}`);
            const data: CrtShEntry[] = await res.json();
            const seen = new Set<string>();
            const dedup = data.filter((e) => {
                const k = `${e.serial_number}-${e.common_name}`;
                if (seen.has(k)) return false;
                seen.add(k);
                return true;
            });
            dedup.sort((a, b) => new Date(b.not_before).getTime() - new Date(a.not_before).getTime());
            setCtResults(dedup);
            message.success(`Found ${dedup.length} certificate${dedup.length === 1 ? "" : "s"}`);
        } catch (e) {
            setCtError(e instanceof Error ? e.message : "Lookup failed — crt.sh may be down or rate-limiting");
        } finally {
            setCtLoading(false);
        }
    };

    return (
        <ToolPageLayout
            title="Certificate Chain & SSL"
            description="Validate certificate chains, verify trust hierarchy, and search Certificate Transparency logs"
            icon={<AuditOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs:
                    "A certificate chain (or trust path) is the sequence of certificates that links a leaf certificate (your server) to a trusted root CA, via zero or more intermediate CAs. Each certificate must be signed by the next one in the chain. Certificate Transparency (CT) logs are public, append-only ledgers that record every TLS certificate issued by participating CAs.",
                whyUse:
                    "Misconfigured chains are the #1 cause of mysterious TLS errors. This tool verifies that each cert is signed by the next, that the chain ends at a self-signed root, and that nothing is expired. The CT log search lets you audit all certificates ever issued for your domain.",
                howToUse: [
                    "Chain Validator: Paste all certificates in order (leaf first, root last) or fetch directly from a URL",
                    "Click Validate — see the full chain with pass/fail per link",
                    "CT Log Search: Enter a domain to find all certificates ever issued for it",
                ],
                tips: [
                    "openssl s_client -connect host:443 -showcerts gives you the chain",
                    "Always include intermediates — don't rely on AIA fetching",
                    "A self-signed root at the end is normal; only client trust stores need it",
                    "CT log search shows both current and expired certificates",
                ],
                useCases: [
                    "Debugging 'untrusted certificate' browser errors",
                    "Verifying that your nginx/Apache config sends the full chain",
                    "Auditing certificate expiry across a pipeline",
                    "Spotting unauthorized certificate issuance for your domain",
                ],
            }}
        >
            <Tabs
                defaultActiveKey="chain"
                items={[
                    {
                        key: "chain",
                        label: <span><AuditOutlined /> Chain Validator</span>,
                        children: (
                            <Space direction="vertical" style={{ width: "100%" }}>
                                <Card size="small" title="Fetch from URL">
                                    <Space.Compact style={{ width: "100%" }}>
                                        <Input
                                            prefix={<GlobalOutlined />}
                                            placeholder="example.com"
                                            value={fetchHost}
                                            onChange={(e) => setFetchHost(e.target.value)}
                                            onPressEnter={handleFetch}
                                            style={{ flex: 1 }}
                                        />
                                        <InputNumber
                                            value={fetchPort}
                                            onChange={(v) => setFetchPort(v ?? 443)}
                                            min={1}
                                            max={65535}
                                            style={{ width: 90 }}
                                            placeholder="443"
                                        />
                                        <Button type="primary" loading={fetchLoading} onClick={handleFetch}>
                                            Fetch
                                        </Button>
                                    </Space.Compact>
                                    <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
                                        Fetches the certificate chain directly from the host and populates the textarea below.
                                    </Text>
                                </Card>

                                <Card
                                    size="small"
                                    title="Certificate Chain (PEM, leaf first)"
                                    extra={
                                        <Space size={4}>
                                            <Upload accept=".pem,.crt,.cer,.txt" beforeUpload={handleUpload} showUploadList={false}>
                                                <Button size="small" icon={<UploadOutlined />}>Upload</Button>
                                            </Upload>
                                            <Button size="small" onClick={() => setInput(SAMPLE)}>Sample</Button>
                                            <Button size="small" onClick={() => { setInput(""); setResult(null); }}>Clear</Button>
                                        </Space>
                                    }
                                >
                                    <TextArea
                                        rows={14}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Concatenated PEM certificates"
                                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                                    />
                                    <div style={{ marginTop: 12 }}>
                                        <Button type="primary" icon={<AuditOutlined />} loading={loading} onClick={validate}>Validate Chain</Button>
                                    </div>
                                </Card>

                                {!result ? (
                                    <Card size="small"><Empty description="Validate a chain to see results" /></Card>
                                ) : (
                                    <Space direction="vertical" style={{ width: "100%" }}>
                                        <Alert
                                            type={result.valid ? "success" : "error"}
                                            icon={result.valid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                            showIcon
                                            message={result.valid ? "Chain is valid" : `${result.issues.length} issue${result.issues.length === 1 ? "" : "s"} found`}
                                            description={
                                                !result.valid && (
                                                    <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
                                                        {result.issues.map((i, idx) => <li key={idx}>{i}</li>)}
                                                    </ul>
                                                )
                                            }
                                        />

                                        <Card size="small" title={`Chain (${result.chain.length} certificate${result.chain.length === 1 ? "" : "s"})`}>
                                            <Steps
                                                direction="vertical"
                                                size="small"
                                                items={result.chain.map((c, i) => {
                                                    const role = i === 0 ? "Leaf" : i === result.chain.length - 1 ? (c.isSelfSigned ? "Root CA" : "Top of chain") : "Intermediate";
                                                    const status = c.isExpired ? "error" : "finish";
                                                    return {
                                                        title: (
                                                            <Space>
                                                                <Tag color="blue">{role}</Tag>
                                                                <Text strong>{c.subject.CN ?? formatDN(c.subject)}</Text>
                                                                {c.isExpired && <Tag color="error" icon={<WarningOutlined />}>EXPIRED</Tag>}
                                                                {!c.isExpired && c.daysUntilExpiry < 30 && (
                                                                    <Tag color="warning" icon={<WarningOutlined />}>
                                                                        Expires in {c.daysUntilExpiry}d
                                                                    </Tag>
                                                                )}
                                                            </Space>
                                                        ),
                                                        description: (
                                                            <Descriptions size="small" column={1} style={{ marginTop: 8 }}>
                                                                <Descriptions.Item label="Issued by">{formatDN(c.issuer)}</Descriptions.Item>
                                                                <Descriptions.Item label="Public key">{c.publicKeyAlgorithm} {c.publicKeySize} bits</Descriptions.Item>
                                                                <Descriptions.Item label="Valid until">{c.notAfter.toUTCString()}</Descriptions.Item>
                                                                <Descriptions.Item label="SHA-256">
                                                                    <Text code style={{ fontSize: 10, wordBreak: "break-all" }}>{c.fingerprintSha256}</Text>
                                                                </Descriptions.Item>
                                                            </Descriptions>
                                                        ),
                                                        status,
                                                    };
                                                })}
                                            />
                                        </Card>
                                    </Space>
                                )}
                            </Space>
                        ),
                    },
                    {
                        key: "ct-logs",
                        label: <span><SecurityScanOutlined /> CT Log Search</span>,
                        children: (
                            <Space direction="vertical" style={{ width: "100%" }}>
                                <Alert
                                    type="info"
                                    showIcon
                                    message="How this works"
                                    description="This tool queries crt.sh — the public Certificate Transparency log — over HTTPS from your browser. No data passes through any backend we control. crt.sh sees your IP and the domain you searched."
                                />

                                <Card size="small" title="Search by Domain">
                                    <Space.Compact style={{ width: "100%" }}>
                                        <Input
                                            size="large"
                                            prefix={<GlobalOutlined />}
                                            placeholder="example.com"
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value)}
                                            onPressEnter={ctLookup}
                                        />
                                        <Button size="large" type="primary" loading={ctLoading} onClick={ctLookup}>Search</Button>
                                    </Space.Compact>
                                    <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
                                        Tip: shows all certs ever issued for *.{domain || "example.com"} — including expired and current.
                                    </Text>
                                </Card>

                                {ctError && <Alert type="error" message={ctError} showIcon />}

                                {ctResults && (
                                    <Card size="small" title={`Results (${ctResults.length})`}>
                                        {ctResults.length === 0 ? (
                                            <Empty description="No certificates found in CT logs" />
                                        ) : (
                                            <Table
                                                size="small"
                                                dataSource={ctResults}
                                                rowKey={(r) => `${r.id}-${r.serial_number}`}
                                                pagination={{ pageSize: 20, showSizeChanger: true }}
                                                scroll={{ x: 720 }}
                                                columns={[
                                                    {
                                                        title: "Common Name",
                                                        dataIndex: "common_name",
                                                        key: "cn",
                                                        width: 220,
                                                        ellipsis: true,
                                                    },
                                                    {
                                                        title: "Issuer",
                                                        dataIndex: "issuer_name",
                                                        key: "issuer",
                                                        ellipsis: true,
                                                        render: (val: string) => {
                                                            const o = val.match(/O=([^,]+)/)?.[1] ?? val;
                                                            return <Text style={{ fontSize: 12 }}>{o}</Text>;
                                                        },
                                                    },
                                                    {
                                                        title: "Issued",
                                                        dataIndex: "not_before",
                                                        key: "issued",
                                                        width: 110,
                                                        render: (v: string) => new Date(v).toLocaleDateString(),
                                                    },
                                                    {
                                                        title: "Expires",
                                                        dataIndex: "not_after",
                                                        key: "expires",
                                                        width: 110,
                                                        render: (v: string) => {
                                                            const d = new Date(v);
                                                            const expired = d.getTime() < Date.now();
                                                            return (
                                                                <Tag color={expired ? "default" : "success"}>
                                                                    {d.toLocaleDateString()}
                                                                </Tag>
                                                            );
                                                        },
                                                    },
                                                    {
                                                        title: "SANs",
                                                        dataIndex: "name_value",
                                                        key: "sans",
                                                        render: (v: string) => {
                                                            const sans = v.split("\n").slice(0, 3);
                                                            return (
                                                                <Space size={4} wrap>
                                                                    {sans.map((s, i) => <Tag key={i} style={{ fontSize: 11 }}>{s}</Tag>)}
                                                                    {v.split("\n").length > 3 && <Tag>+{v.split("\n").length - 3}</Tag>}
                                                                </Space>
                                                            );
                                                        },
                                                    },
                                                ]}
                                            />
                                        )}
                                    </Card>
                                )}
                            </Space>
                        ),
                    },
                ]}
            />
        </ToolPageLayout>
    );
}

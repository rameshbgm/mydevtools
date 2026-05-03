"use client";

import React, { Suspense, useState, useCallback } from "react";
import {
    Card,
    Input,
    Button,
    Space,
    App,
    Alert,
    Tag,
    Steps,
    Typography,
    Upload,
    Empty,
    Descriptions,
    Tabs,
    InputNumber,
    Collapse,
    Segmented,
} from "antd";
import {
    AuditOutlined,
    UploadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    GlobalOutlined,
    SecurityScanOutlined,
    CopyOutlined,
} from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import {
    listPemBlocks,
    validateChain,
    parseCertificate,
    fingerprint,
    formatDN,
    type ChainValidationResult,
    type ParsedCertificate,
} from "@/lib/cert-utils";

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

interface LiveCert {
    pem: string;
    parsed: ParsedCertificate | null;
    fps: { sha1: string; sha256: string; md5: string } | null;
}

// ─── Live Server Check tab ─────────────────────────────────────────────────────

function LiveCheckTab() {
    const { message } = App.useApp();
    const [urlInput, setUrlInput] = useState("");
    const [port, setPort] = useState<number>(443);
    const [loading, setLoading] = useState(false);
    const [certs, setCerts] = useState<LiveCert[]>([]);
    const [chainResult, setChainResult] = useState<ChainValidationResult | null>(null);
    const [fetchedHost, setFetchedHost] = useState<string>("");

    const fetch_and_inspect = useCallback(async () => {
        const raw = urlInput.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        const portMatch = raw.match(/:(\d+)$/);
        const host = raw.replace(/:\d+$/, "");
        const resolvedPort = portMatch ? parseInt(portMatch[1], 10) : port;
        if (!host) { message.warning("Enter a hostname or URL"); return; }

        setLoading(true);
        setCerts([]);
        setChainResult(null);
        try {
            const res = await fetch(`/api/fetch-cert?host=${encodeURIComponent(host)}&port=${resolvedPort}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);

            const pems: string[] = data.pems ?? [];
            if (pems.length === 0) throw new Error("No certificates returned from server");

            // Parse each cert and compute fingerprints locally — no external calls
            const liveCerts: LiveCert[] = await Promise.all(
                pems.map(async (pem) => {
                    const [parsed, fps] = await Promise.all([
                        parseCertificate(pem).catch(() => null),
                        fingerprint(pem).catch(() => null),
                    ]);
                    return { pem, parsed, fps };
                })
            );
            setCerts(liveCerts);
            setFetchedHost(host);

            // Validate chain locally
            const blocks = listPemBlocks(pems.join("\n\n")).filter((b) => b.label === "CERTIFICATE");
            if (blocks.length > 0) {
                const result = await validateChain(blocks.map((b) => b.body)).catch(() => null);
                setChainResult(result);
            }
            message.success(`Fetched ${pems.length} certificate${pems.length === 1 ? "" : "s"} from ${host}:${resolvedPort}`);
        } catch (e) {
            message.error(e instanceof Error ? e.message : "Fetch failed");
        } finally {
            setLoading(false);
        }
    }, [urlInput, port, message]);

    const copy = (text: string, label: string) => { copyToClipboard(text, label); message.success(label); };

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <Card size="small" title="Enter URL or Hostname">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 0, width: "100%" }}>
                    <Input
                        size="large"
                        prefix={<GlobalOutlined />}
                        placeholder="example.com or https://example.com"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onPressEnter={fetch_and_inspect}
                        style={{ flex: "1 1 200px", minWidth: 0, borderRadius: "6px 0 0 6px" }}
                    />
                    <InputNumber
                        value={port}
                        onChange={(v) => setPort(v ?? 443)}
                        min={1}
                        max={65535}
                        size="large"
                        style={{ width: 90, borderRadius: 0, marginLeft: -1 }}
                        placeholder="Port"
                    />
                    <Button
                        size="large"
                        type="primary"
                        icon={<SecurityScanOutlined />}
                        loading={loading}
                        onClick={fetch_and_inspect}
                        style={{ borderRadius: "0 6px 6px 0", marginLeft: -1 }}
                    >
                        Inspect
                    </Button>
                </div>
                <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
                    Fetches the full certificate chain directly from the server — leaf + all intermediates + root CA.
                    Everything is processed locally; no external services involved.
                </Text>
            </Card>

            {certs.length === 0 && !loading && (
                <Card size="small"><Empty description="Enter a URL to inspect its certificate chain" /></Card>
            )}

            {chainResult && (
                <Alert
                    type={chainResult.valid ? "success" : "warning"}
                    icon={chainResult.valid ? <CheckCircleOutlined /> : <WarningOutlined />}
                    showIcon
                    message={
                        chainResult.valid
                            ? `Chain is valid — ${certs.length} certificate${certs.length === 1 ? "" : "s"} from ${fetchedHost}`
                            : `${chainResult.issues.length} issue${chainResult.issues.length === 1 ? "" : "s"} found in chain`
                    }
                    description={
                        !chainResult.valid && chainResult.issues.length > 0 && (
                            <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
                                {chainResult.issues.map((i, idx) => <li key={idx}>{i}</li>)}
                            </ul>
                        )
                    }
                />
            )}

            {certs.map((cert, idx) => {
                const role = idx === 0 ? "Leaf" : idx === certs.length - 1 ? (cert.parsed?.isSelfSigned ? "Root CA" : "Top of chain") : "Intermediate";
                const roleColor = idx === 0 ? "blue" : idx === certs.length - 1 ? "purple" : "orange";
                const p = cert.parsed;

                return (
                    <Collapse
                        key={idx}
                        defaultActiveKey={idx === 0 ? ["detail"] : []}
                        items={[{
                            key: "detail",
                            label: (
                                <Space wrap>
                                    <Tag color={roleColor}>{role}</Tag>
                                    <Text strong>{p?.subject.CN ?? `Certificate ${idx + 1}`}</Text>
                                    {p?.isExpired && <Tag color="error" icon={<CloseCircleOutlined />}>EXPIRED</Tag>}
                                    {p && !p.isExpired && p.daysUntilExpiry < 30 && (
                                        <Tag color="warning" icon={<WarningOutlined />}>Expires in {p.daysUntilExpiry}d</Tag>
                                    )}
                                    {p && !p.isExpired && p.daysUntilExpiry >= 30 && (
                                        <Tag color="success" icon={<CheckCircleOutlined />}>Valid</Tag>
                                    )}
                                </Space>
                            ),
                            children: p ? (
                                <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                    {/* ── Summary ── */}
                                    <Descriptions bordered size="small" column={{ xs: 1, md: 2 }} labelStyle={{ width: 160 }}>
                                        <Descriptions.Item label="Common Name" span={2}>{p.subject.CN ?? "—"}</Descriptions.Item>
                                        <Descriptions.Item label="Issuer">{formatDN(p.issuer)}</Descriptions.Item>
                                        <Descriptions.Item label="Serial">
                                            <Text code style={{ fontSize: 11 }}>{p.serialNumber}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Algorithm">{p.signatureAlgorithm}</Descriptions.Item>
                                        <Descriptions.Item label="Public Key">{p.publicKeyAlgorithm} {p.publicKeySize ? `${p.publicKeySize} bits` : ""}</Descriptions.Item>
                                        <Descriptions.Item label="Valid From">{p.notBefore.toUTCString()}</Descriptions.Item>
                                        <Descriptions.Item label="Valid Until">
                                            <Space>
                                                {p.notAfter.toUTCString()}
                                                {p.isExpired
                                                    ? <Tag color="error">EXPIRED</Tag>
                                                    : p.daysUntilExpiry < 30
                                                        ? <Tag color="warning">{p.daysUntilExpiry}d left</Tag>
                                                        : <Tag color="success">{p.daysUntilExpiry}d left</Tag>
                                                }
                                            </Space>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Self-Signed">{p.isSelfSigned ? <Tag color="purple">Yes</Tag> : <Tag>No</Tag>}</Descriptions.Item>
                                        {p.basicConstraints && (
                                            <Descriptions.Item label="CA">
                                                {p.basicConstraints.ca ? <Tag color="orange">CA: TRUE</Tag> : <Tag>CA: FALSE</Tag>}
                                            </Descriptions.Item>
                                        )}
                                    </Descriptions>

                                    {/* ── SANs ── */}
                                    {p.sans.length > 0 && (
                                        <Card size="small" title={`Subject Alternative Names (${p.sans.length})`}>
                                            <Space wrap size={4}>
                                                {p.sans.map((san, i) => (
                                                    <Tag key={i} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>{san}</Tag>
                                                ))}
                                            </Space>
                                        </Card>
                                    )}

                                    {/* ── Key Usage ── */}
                                    {(p.keyUsage.length > 0 || p.extendedKeyUsage.length > 0) && (
                                        <Card size="small" title="Key Usage">
                                            <Space orientation="vertical" size={4}>
                                                {p.keyUsage.length > 0 && (
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>Key Usage:</Text>
                                                        {p.keyUsage.map((u, i) => <Tag key={i} color="blue">{u}</Tag>)}
                                                    </div>
                                                )}
                                                {p.extendedKeyUsage.length > 0 && (
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>Extended:</Text>
                                                        {p.extendedKeyUsage.map((u, i) => <Tag key={i} color="cyan">{u}</Tag>)}
                                                    </div>
                                                )}
                                            </Space>
                                        </Card>
                                    )}

                                    {/* ── Fingerprints ── */}
                                    {cert.fps && (
                                        <Card size="small" title="Fingerprints">
                                            <Descriptions bordered size="small" column={1} labelStyle={{ width: 90 }}>
                                                <Descriptions.Item label={<Space>SHA-256 <Tag color="success" style={{ fontSize: 10 }}>recommended</Tag></Space>}>
                                                    <Space>
                                                        <Text code style={{ fontSize: 11, wordBreak: "break-all" }}>{cert.fps.sha256}</Text>
                                                        <Button size="small" icon={<CopyOutlined />} onClick={() => copy(cert.fps!.sha256, "SHA-256 copied")} />
                                                    </Space>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="SHA-1">
                                                    <Space>
                                                        <Text code style={{ fontSize: 11, wordBreak: "break-all" }}>{cert.fps.sha1}</Text>
                                                        <Button size="small" icon={<CopyOutlined />} onClick={() => copy(cert.fps!.sha1, "SHA-1 copied")} />
                                                    </Space>
                                                </Descriptions.Item>
                                                <Descriptions.Item label={<Space>MD5 <Tag color="warning" style={{ fontSize: 10 }}>legacy</Tag></Space>}>
                                                    <Space>
                                                        <Text code style={{ fontSize: 11, wordBreak: "break-all" }}>{cert.fps.md5}</Text>
                                                        <Button size="small" icon={<CopyOutlined />} onClick={() => copy(cert.fps!.md5, "MD5 copied")} />
                                                    </Space>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    )}

                                    {/* ── Raw PEM ── */}
                                    <Card
                                        size="small"
                                        title="PEM"
                                        extra={
                                            <Button size="small" icon={<CopyOutlined />} onClick={() => copy(cert.pem, "PEM copied")}>Copy</Button>
                                        }
                                    >
                                        <TextArea
                                            rows={6}
                                            value={cert.pem}
                                            readOnly
                                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}
                                        />
                                    </Card>
                                </Space>
                            ) : (
                                <Alert type="warning" message="Could not parse this certificate" showIcon />
                            ),
                        }]}
                    />
                );
            })}
        </Space>
    );
}

// ─── Chain Validator tab (paste / upload) ─────────────────────────────────────

function ChainValidatorTab() {
    const { message } = App.useApp();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ChainValidationResult | null>(null);
    const [fetchHost, setFetchHost] = useState("");
    const [fetchPort, setFetchPort] = useState<number>(443);
    const [fetchLoading, setFetchLoading] = useState(false);

    const validate = async () => {
        if (!input.trim()) { message.warning("Paste at least one certificate"); return; }
        const blocks = listPemBlocks(input).filter((b) => b.label === "CERTIFICATE");
        if (blocks.length === 0) { message.error("No CERTIFICATE PEM blocks found"); return; }
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
        const raw = fetchHost.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        const portMatch = raw.match(/:(\d+)$/);
        const host = raw.replace(/:\d+$/, "");
        const resolvedPort = portMatch ? parseInt(portMatch[1], 10) : fetchPort;
        if (!host) { message.warning("Enter a hostname"); return; }
        setFetchLoading(true);
        try {
            const res = await fetch(`/api/fetch-cert?host=${encodeURIComponent(host)}&port=${resolvedPort}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
            const pems: string[] = data.pems ?? [];
            if (pems.length === 0) throw new Error("No certificates returned");
            setInput(pems.join("\n\n"));
            message.success(`Fetched ${pems.length} cert${pems.length === 1 ? "" : "s"} from ${host}:${resolvedPort}`);
        } catch (e) {
            message.error(e instanceof Error ? e.message : "Fetch failed");
        } finally {
            setFetchLoading(false);
        }
    };

    return (
        <Space orientation="vertical" style={{ width: "100%" }}>
            <Card size="small" title="Fetch from URL">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 0, width: "100%" }}>
                    <Input
                        prefix={<GlobalOutlined />}
                        placeholder="example.com"
                        value={fetchHost}
                        onChange={(e) => setFetchHost(e.target.value)}
                        onPressEnter={handleFetch}
                        style={{ flex: "1 1 200px", minWidth: 0, borderRadius: "6px 0 0 6px" }}
                    />
                    <InputNumber
                        value={fetchPort}
                        onChange={(v) => setFetchPort(v ?? 443)}
                        min={1} max={65535}
                        style={{ width: 90, borderRadius: 0, marginLeft: -1 }}
                        placeholder="443"
                    />
                    <Button
                        type="primary"
                        loading={fetchLoading}
                        onClick={handleFetch}
                        style={{ borderRadius: "0 6px 6px 0", marginLeft: -1 }}
                    >
                        Fetch
                    </Button>
                </div>
                <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
                    Fetches the live certificate chain and populates the textarea below for validation.
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
                <Space orientation="vertical" style={{ width: "100%" }}>
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
                                return {
                                    title: (
                                        <Space>
                                            <Tag color="blue">{role}</Tag>
                                            <Text strong>{c.subject.CN ?? formatDN(c.subject)}</Text>
                                            {c.isExpired && <Tag color="error" icon={<WarningOutlined />}>EXPIRED</Tag>}
                                            {!c.isExpired && c.daysUntilExpiry < 30 && (
                                                <Tag color="warning" icon={<WarningOutlined />}>Expires in {c.daysUntilExpiry}d</Tag>
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
                                    status: c.isExpired ? "error" : "finish",
                                };
                            })}
                        />
                    </Card>
                </Space>
            )}
        </Space>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CertificateChainValidatorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialTab = searchParams.get("tab") ?? "live";

    const handleTabChange = (key: string) => {
        router.replace(`?tab=${key}`, { scroll: false });
    };

    return (
        <ToolPageLayout
            title="Certificate Chain & SSL"
            description="Inspect live server certificates, validate chains, and verify trust hierarchy — all locally"
            icon={<AuditOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs:
                    "A certificate chain (trust path) links a leaf certificate to a trusted root CA via intermediates. This tool fetches the live certificate chain from any server using a direct TLS connection — no external services — then decodes every cert's fields, SANs, key usage, fingerprints, and validates the chain signature.",
                whyUse:
                    "Everything runs locally: the server-side Route Handler opens a raw TLS socket, retrieves the chain, and your browser parses it with node-forge. No third-party requests. Misconfigured chains are the #1 cause of TLS errors; enter a URL and diagnose instantly.",
                howToUse: [
                    "Live Check: enter any URL or hostname to fetch and inspect the full certificate chain",
                    "Chain Validator: paste PEM certificates manually or fetch then validate",
                    "See decoded fields, SANs, fingerprints, expiry, and chain trust for every cert",
                ],
                tips: [
                    "The leaf certificate is the server's own cert; intermediates link it to the root CA",
                    "A self-signed root at the end is expected — browsers have their own root trust stores",
                    "Check all SANs: the domain you're connecting to must match at least one SAN",
                    "SHA-256 fingerprint uniquely identifies a certificate for pinning",
                ],
                useCases: [
                    "Debugging 'untrusted certificate' browser errors",
                    "Verifying nginx/Apache sends the full chain (not just leaf)",
                    "Auditing certificate expiry, SANs, and key strength",
                    "SSL pinning — get the exact SHA-256 fingerprint",
                ],
            }}
        >
            <Tabs
                activeKey={initialTab}
                onChange={handleTabChange}
                items={[
                    {
                        key: "live",
                        label: <span><SecurityScanOutlined /> Live Server Check</span>,
                        children: <LiveCheckTab />,
                    },
                    {
                        key: "chain",
                        label: <span><AuditOutlined /> Chain Validator</span>,
                        children: <ChainValidatorTab />,
                    },
                ]}
            />
        </ToolPageLayout>
    );
}

export default function CertificateChainValidatorPage() {
    return (
        <Suspense fallback={null}>
            <CertificateChainValidatorContent />
        </Suspense>
    );
}

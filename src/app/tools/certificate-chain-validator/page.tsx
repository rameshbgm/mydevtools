"use client";
import { useLanguage } from "@/components/LanguageProvider";

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
import { parseCertificateFetchResponse } from "@/lib/certificate-fetch-response";

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
    const { t } = useLanguage();
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
        if (!host) { message.warning(t("Enter a hostname or URL")); return; }

        setLoading(true);
        setCerts([]);
        setChainResult(null);
        try {
            const res = await fetch(`/api/fetch-cert?host=${encodeURIComponent(host)}&port=${resolvedPort}`);
            const data = await parseCertificateFetchResponse(res);

            const pems: string[] = data.pems ?? [];
            if (pems.length === 0) { message.error(t("The server returned no certificates. Check the hostname and try again.")); return; }

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
            message.success(t("Certificates fetched from {host}: {count}", { host: `${host}:${resolvedPort}`, count: pems.length }));
        } catch (e) {
            message.error(e instanceof Error ? e.message : t("Fetch failed"));
        } finally {
            setLoading(false);
        }
    }, [urlInput, port, message, t]);

    const copy = (text: string, label: string) => void copyToClipboard(text, label);

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <Card size="small" title={t("Enter URL or Hostname")}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 0, width: "100%" }}>
                    <Input aria-label={t("Hostname or URL")} styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }}
                        size="large"
                        prefix={<GlobalOutlined />}
                        placeholder={t("example.com or https://example.com")}
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onPressEnter={fetch_and_inspect}
                        style={{ flex: "1 1 200px", minWidth: 0, borderRadius: "6px 0 0 6px" }}
                    />
                    <InputNumber aria-label={t("Port")} styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }}
                        value={port}
                        onChange={(v) => setPort(v ?? 443)}
                        min={1}
                        max={65535}
                        size="large"
                        style={{ width: 90, borderRadius: 0, marginLeft: -1 }}
                        placeholder={t("Port")}
                    />
                    <Button
                        size="large"
                        type="primary"
                        icon={<SecurityScanOutlined />}
                        loading={loading}
                        onClick={fetch_and_inspect}
                        style={{ borderRadius: "0 6px 6px 0", marginLeft: -1 }}
                    >{t("Inspect")}</Button>
                </div>
                <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 16 }}>{t("After fetching, selected chain and signature checks run locally. Browser trust, revocation and hostname verification are not performed.")}</Text>
            </Card>

            {certs.length === 0 && !loading && (
                <Card size="small"><Empty description={t("Enter a URL to inspect its certificate chain")} /></Card>
            )}

            {chainResult && (
                <Alert
                    type={chainResult.valid ? "success" : "warning"}
                    icon={chainResult.valid ? <CheckCircleOutlined /> : <WarningOutlined />}
                    showIcon
                    title={
                        chainResult.valid
                            ? t("Evaluated checks passed: {count} certificates from {host}", { count: certs.length, host: fetchedHost })
                            : t("Chain issues: {count}", { count: chainResult.issues.length })
                    }
                    description={
                        !chainResult.valid && chainResult.issues.length > 0 && (
                            <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
                                {chainResult.issues.map((i, idx) => <li key={idx}><bdi dir="ltr">{i}</bdi></li>)}
                            </ul>
                        )
                    }
                />
            )}

            {certs.map((cert, idx) => {
                const role = idx === 0 ? t("Leaf") : idx === certs.length - 1 ? (cert.parsed?.isSelfSigned ? t("Root CA") : t("Top of chain")) : t("Intermediate");
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
                                    <Text strong>{p?.subject.CN ?? t("Certificate {number}", { number: idx + 1 })}</Text>
                                    {p?.isExpired && <Tag color="error" icon={<CloseCircleOutlined />}>{t("EXPIRED")}</Tag>}
                                    {p && !p.isExpired && p.daysUntilExpiry < 30 && (
                                        <Tag color="warning" icon={<WarningOutlined />}>{t("Expires in {days} days", { days: p.daysUntilExpiry })}</Tag>
                                    )}
                                    {p && !p.isExpired && p.daysUntilExpiry >= 30 && (
                                        <Tag color="success" icon={<CheckCircleOutlined />}>{t("Valid")}</Tag>
                                    )}
                                </Space>
                            ),
                            children: p ? (
                                <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                    {/* ── Summary ── */}
                                    <Descriptions bordered size="small" column={{ xs: 1, md: 2 }} styles={{ label: { width: 160 } }}>
                                        <Descriptions.Item label={t("Common Name")} span={2}>{p.subject.CN ?? "—"}</Descriptions.Item>
                                        <Descriptions.Item label={t("Issuer")}>{formatDN(p.issuer)}</Descriptions.Item>
                                        <Descriptions.Item label={t("Serial")}>
                                            <Text dir="ltr" code style={{ fontSize: 16 }}>{p.serialNumber}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("Algorithm")}>{p.signatureAlgorithm}</Descriptions.Item>
                                        <Descriptions.Item label={t("Public Key")}>{p.publicKeyAlgorithm} {p.publicKeySize ? t("{count} bits", { count: p.publicKeySize }) : ""}</Descriptions.Item>
                                        <Descriptions.Item label={t("Valid From")}>{p.notBefore.toUTCString()}</Descriptions.Item>
                                        <Descriptions.Item label={t("Valid Until")}>
                                            <Space>
                                                {p.notAfter.toUTCString()}
                                                {p.isExpired
                                                    ? <Tag color="error">{t("EXPIRED")}</Tag>
                                                    : p.daysUntilExpiry < 30
                                                        ? <Tag color="warning">{t("{days} days left", { days: p.daysUntilExpiry })}</Tag>
                                                        : <Tag color="success">{t("{days} days left", { days: p.daysUntilExpiry })}</Tag>
                                                }
                                            </Space>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("Self-Signed")}>{p.isSelfSigned ? <Tag color="purple">{t("Yes")}</Tag> : <Tag>{t("No")}</Tag>}</Descriptions.Item>
                                        {p.basicConstraints && (
                                            <Descriptions.Item label={t("CA")}>
                                                {p.basicConstraints.ca ? <Tag color="orange">CA: TRUE</Tag> : <Tag>CA: FALSE</Tag>}
                                            </Descriptions.Item>
                                        )}
                                    </Descriptions>

                                    {/* ── SANs ── */}
                                    {p.sans.length > 0 && (
                                        <Card size="small" title={t("SANs ({count})", { count: p.sans.length })}>
                                            <Space wrap size={4}>
                                                {p.sans.map((san, i) => (
                                                    <Tag key={i} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}>{san}</Tag>
                                                ))}
                                            </Space>
                                        </Card>
                                    )}

                                    {/* ── Key Usage ── */}
                                    {(p.keyUsage.length > 0 || p.extendedKeyUsage.length > 0) && (
                                        <Card size="small" title={t("Key Usage")}>
                                            <Space orientation="vertical" size={4}>
                                                {p.keyUsage.length > 0 && (
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: 16, marginRight: 8 }}>{t("Key Usage:")}</Text>
                                                        {p.keyUsage.map((u, i) => <Tag key={i} color="blue">{u}</Tag>)}
                                                    </div>
                                                )}
                                                {p.extendedKeyUsage.length > 0 && (
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: 16, marginRight: 8 }}>{t("Extended:")}</Text>
                                                        {p.extendedKeyUsage.map((u, i) => <Tag key={i} color="cyan">{u}</Tag>)}
                                                    </div>
                                                )}
                                            </Space>
                                        </Card>
                                    )}

                                    {/* ── Fingerprints ── */}
                                    {cert.fps && (
                                        <Card size="small" title={t("Fingerprints")}>
                                            <Descriptions bordered size="small" column={1} styles={{ label: { width: 90 } }}>
                                                <Descriptions.Item label={<Space>SHA-256 <Tag color="success" style={{ fontSize: 10 }}>{t("recommended")}</Tag></Space>}>
                                                    <Space>
                                                        <Text dir="ltr" code style={{ fontSize: 16, wordBreak: "break-all" }}>{cert.fps.sha256}</Text>
                                                        <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => copy(cert.fps!.sha256, t("SHA-256 copied"))} />
                                                    </Space>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="SHA-1">
                                                    <Space>
                                                        <Text dir="ltr" code style={{ fontSize: 16, wordBreak: "break-all" }}>{cert.fps.sha1}</Text>
                                                        <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => copy(cert.fps!.sha1, t("SHA-1 copied"))} />
                                                    </Space>
                                                </Descriptions.Item>
                                                <Descriptions.Item label={<Space>MD5 <Tag color="warning" style={{ fontSize: 10 }}>{t("legacy")}</Tag></Space>}>
                                                    <Space>
                                                        <Text dir="ltr" code style={{ fontSize: 16, wordBreak: "break-all" }}>{cert.fps.md5}</Text>
                                                        <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => copy(cert.fps!.md5, t("MD5 copied"))} />
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
                                            <Button size="small" icon={<CopyOutlined />} onClick={() => copy(cert.pem, t("PEM copied"))}>{t("Copy")}</Button>
                                        }
                                    >
                                        <TextArea aria-label={t("Certificate PEM output")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                            rows={6}
                                            value={cert.pem}
                                            readOnly
                                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}
                                        />
                                    </Card>
                                </Space>
                            ) : (
                                <Alert type="warning" title={t("Could not parse this certificate")} showIcon />
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
    const { t } = useLanguage();
    const { message } = App.useApp();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ChainValidationResult | null>(null);
    const [fetchHost, setFetchHost] = useState("");
    const [fetchPort, setFetchPort] = useState<number>(443);
    const [fetchLoading, setFetchLoading] = useState(false);

    const validate = async () => {
        if (!input.trim()) { message.warning(t("Paste at least one certificate")); return; }
        const blocks = listPemBlocks(input).filter((b) => b.label === "CERTIFICATE");
        if (blocks.length === 0) { message.error(t("No CERTIFICATE PEM blocks found")); return; }
        setLoading(true);
        try {
            const r = await validateChain(blocks.map((b) => b.body));
            setResult(r);
            if (r.valid) message.success(t("Evaluated chain checks passed"));
            else message.warning(t("Chain issues: {count}", { count: r.issues.length }));
        } catch (e) {
            message.error(e instanceof Error ? e.message : t("Validation failed"));
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
        if (!host) { message.warning(t("Enter a hostname")); return; }
        setFetchLoading(true);
        try {
            const res = await fetch(`/api/fetch-cert?host=${encodeURIComponent(host)}&port=${resolvedPort}`);
            const data = await parseCertificateFetchResponse(res);
            const pems: string[] = data.pems ?? [];
            if (pems.length === 0) { message.error(t("The server returned no certificates. Check the hostname and try again.")); return; }
            setInput(pems.join("\n\n"));
            message.success(t("Certificates fetched from {host}: {count}", { host: `${host}:${resolvedPort}`, count: pems.length }));
        } catch (e) {
            message.error(e instanceof Error ? e.message : t("Fetch failed"));
        } finally {
            setFetchLoading(false);
        }
    };

    return (
        <Space orientation="vertical" style={{ width: "100%" }}>
            <Card size="small" title={t("Fetch from URL")}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 0, width: "100%" }}>
                    <Input aria-label={t("Hostname")} styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }}
                        prefix={<GlobalOutlined />}
                        placeholder="example.com"
                        value={fetchHost}
                        onChange={(e) => setFetchHost(e.target.value)}
                        onPressEnter={handleFetch}
                        style={{ flex: "1 1 200px", minWidth: 0, borderRadius: "6px 0 0 6px" }}
                    />
                    <InputNumber aria-label={t("Port")} styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }}
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
                    >{t("Fetch")}</Button>
                </div>
                <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 16 }}>{t("After fetching, selected chain checks run in your browser.")}</Text>
            </Card>

            <Card
                size="small"
                title={t("Certificate Chain (PEM, leaf first)")}
                extra={
                    <Space size={4}>
                        <Upload accept=".pem,.crt,.cer,.txt" beforeUpload={handleUpload} showUploadList={false}>
                            <Button size="small" icon={<UploadOutlined />}>{t("Upload")}</Button>
                        </Upload>
                        <Button size="small" onClick={() => setInput(SAMPLE)}>{t("Sample")}</Button>
                        <Button size="small" onClick={() => { setInput(""); setResult(null); }}>{t("Clear")}</Button>
                    </Space>
                }
            >
                <TextArea aria-label={t("Certificate input")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                    rows={14}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("Concatenated PEM certificates")}
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}
                />
                <div style={{ marginTop: 12 }}>
                    <Button type="primary" icon={<AuditOutlined />} loading={loading} onClick={validate}>{t("Validate Chain")}</Button>
                </div>
            </Card>

            {!result ? (
                <Card size="small"><Empty description={t("Validate a chain to see results")} /></Card>
            ) : (
                <Space orientation="vertical" style={{ width: "100%" }}>
                    <Alert
                        type={result.valid ? "success" : "error"}
                        icon={result.valid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        showIcon
                        title={result.valid ? t("Evaluated chain checks passed") : t("Chain issues: {count}", { count: result.issues.length })}
                        description={
                            !result.valid && (
                                <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
                                    {result.issues.map((i, idx) => <li key={idx}><bdi dir="ltr">{i}</bdi></li>)}
                                </ul>
                            )
                        }
                    />
                    <Card size="small" title={t("Chain certificates: {count}", { count: result.chain.length })}>
                        <Steps
                            direction="vertical"
                            size="small"
                            items={result.chain.map((c, i) => {
                                const role = i === 0 ? t("Leaf") : i === result.chain.length - 1 ? (c.isSelfSigned ? t("Root CA") : t("Top of chain")) : t("Intermediate");
                                return {
                                    title: (
                                        <Space>
                                            <Tag color="blue">{role}</Tag>
                                            <Text strong>{c.subject.CN ?? formatDN(c.subject)}</Text>
                                            {c.isExpired && <Tag color="error" icon={<WarningOutlined />}>{t("EXPIRED")}</Tag>}
                                            {!c.isExpired && c.daysUntilExpiry < 30 && (
                                                <Tag color="warning" icon={<WarningOutlined />}>{t("Expires in {days} days", { days: c.daysUntilExpiry })}</Tag>
                                            )}
                                        </Space>
                                    ),
                                    description: (
                                        <Descriptions size="small" column={1} style={{ marginTop: 8 }}>
                                            <Descriptions.Item label={t("Issued by")}>{formatDN(c.issuer)}</Descriptions.Item>
                                            <Descriptions.Item label={t("Public key")}>{c.publicKeyAlgorithm} {c.publicKeySize}{t("bits")}</Descriptions.Item>
                                            <Descriptions.Item label={t("Valid until")}>{c.notAfter.toUTCString()}</Descriptions.Item>
                                            <Descriptions.Item label="SHA-256">
                                                <Text dir="ltr" code style={{ fontSize: 10, wordBreak: "break-all" }}>{c.fingerprintSha256}</Text>
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
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialTab = searchParams.get("tab") ?? "live";

    const handleTabChange = (key: string) => {
        router.replace(`?tab=${key}`, { scroll: false });
    };

    return (
        <ToolPageLayout
            title={t("Certificate Chain & SSL")}
            description={t("Inspect live server certificates through a disclosed server route and evaluate pasted certificate chains locally")}
            icon={<AuditOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs:
                    t("A certificate chain (trust path) links a leaf certificate to a trusted root CA via intermediates. This tool fetches the live certificate chain from any server using a direct TLS connection — no external services — then decodes every cert's fields, SANs, key usage, fingerprints, and validates the chain signature."),
                whyUse:
                    t("Fetching uses this app’s server to open a TLS connection. Parsing and selected chain/signature checks run in your browser. This does not reproduce a browser trust store, revocation checking, policy processing or full PKIX validation. Misconfigured chains are the #1 cause of TLS errors; enter a URL and diagnose instantly."),
                howToUse: [
                    t("Live Check: enter any URL or hostname to fetch and inspect the full certificate chain"),
                    t("Chain Validator: paste PEM certificates manually or fetch then validate"),
                    t("See decoded fields, SANs, fingerprints, expiry, and evaluated chain checks for every cert"),
                ],
                tips: [
                    t("The leaf certificate is the server's own cert; intermediates link it to the root CA"),
                    t("A self-signed root at the end is expected — browsers have their own root trust stores"),
                    t("Check all SANs: the domain you're connecting to must match at least one SAN"),
                    t("SHA-256 fingerprint uniquely identifies a certificate for pinning"),
                ],
                useCases: [
                    t("Debugging 'untrusted certificate' browser errors"),
                    t("Verifying nginx/Apache sends the full chain (not just leaf)"),
                    t("Auditing certificate expiry, SANs, and key strength"),
                    t("SSL pinning — get the exact SHA-256 fingerprint"),
                ],
                serverNotice: {
                    route: "fetch-cert",
                    purpose: t("The 'Fetch from URL' / 'Inspect' buttons are the only features that contact a server. Browsers cannot open raw TLS sockets, so the server opens a TLS connection on your behalf, walks the full chain (leaf → intermediates → root), and returns PEM blocks. All chain validation, signature checks, expiry, and hostname matching then run in your browser."),
                    sentFields: [
                        t("Hostname"),
                        t("Port number (default 443)"),
                    ],
                    extra: (
                        <Text style={{ fontSize: 16 }}>
                            <Text strong>{t("Local-only alternative:")}</Text>{" "}{t("paste PEM blocks into the Chain Validator tab — that path runs 100% in your browser.")}
                        </Text>
                    ),
                },
            }}
        >
            <Tabs
                activeKey={initialTab}
                onChange={handleTabChange}
                items={[
                    {
                        key: "live",
                        label: <span><SecurityScanOutlined />{t("Live Server Check")}</span>,
                        children: <LiveCheckTab />,
                    },
                    {
                        key: "chain",
                        label: <span><AuditOutlined />{t("Chain Validator")}</span>,
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

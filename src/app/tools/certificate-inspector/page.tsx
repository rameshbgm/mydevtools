"use client";
import { useLanguage } from "@/components/LanguageProvider";

import React, { Suspense, useState, useCallback } from "react";
import {
    Card,
    Input,
    Button,
    Space,
    App,
    Tabs,
    Select,
    Descriptions,
    Tag,
    Alert,
    Upload,
    Empty,
    Typography,
} from "antd";
import {
    SafetyCertificateOutlined,
    SearchOutlined,
    SwapOutlined,
    EyeOutlined,
    UploadOutlined,
    CopyOutlined,
    DownloadOutlined,
    GlobalOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import {
    parseCertificate,
    fingerprint,
    convertCertificate,
    listPemBlocks,
    formatDN,
    parseCSR,
    type ParsedCertificate,
} from "@/lib/cert-utils";
import { downloadBytes, downloadText } from "@/lib/download";
import { parseCertificateFetchResponse } from "@/lib/certificate-fetch-response";
import forge from "node-forge";

const { TextArea } = Input;
const { Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

type ConvertFormat = "pem" | "der-base64" | "der-bytes";

interface ParsedBlock {
    label: string;
    body: string;
    summary: React.ReactNode;
    detail: React.ReactNode;
    valid: boolean;
}

function CertificateText({ source, values }: { source: string; values?: Record<string, string | number> }) {
    const { t } = useLanguage();
    return <>{t(source, values)}</>;
}
function certificateText(source: string, values?: Record<string, string | number>) {
    return <CertificateText source={source} values={values} />;
}

// ─── DN label map (shared with decoder) ───────────────────────────────────────

const DN_LABELS: Record<string, string> = {
    CN: "Common Name",
    O: "Organization",
    OU: "Organizational Unit",
    L: "Locality",
    ST: "State/Province",
    C: "Country",
    E: "Email",
    emailAddress: "Email",
};

const FORMAT_LABEL: Record<ConvertFormat, string> = {
    pem: "PEM (text, base64 with header)",
    "der-base64": "DER (binary, shown as base64)",
    "der-bytes": "DER (raw binary file)",
};

// ─── Upload helper (shared across tabs) ───────────────────────────────────────

function useFileUpload(onText: (t: string) => void) {
    return (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
                onText(result);
            } else if (result instanceof ArrayBuffer) {
                const bytes = new Uint8Array(result);
                const text = new TextDecoder().decode(bytes);
                // .crt and .cer may contain PEM text or binary DER. Preserve the
                // original encoded material rather than base64-wrapping PEM again.
                onText(/^\s*-----BEGIN [^-]+-----/.test(text)
                    ? text
                    : btoa(Array.from(bytes).map((b) => String.fromCharCode(b)).join("")));
            }
        };
        if (file.name.match(/\.(der|cer|crt)$/i)) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
        return false;
    };
}

// ─── Strip URL to plain hostname (+ optional port) ────────────────────────────

function extractHostAndPort(raw: string): { host: string; port: number } {
    let s = raw.trim();
    // Remove protocol
    s = s.replace(/^https?:\/\//i, "");
    // Remove path, query, fragment
    s = s.split("/")[0].split("?")[0].split("#")[0];
    // Split host:port
    const colonIdx = s.lastIndexOf(":");
    if (colonIdx > 0) {
        const maybePort = parseInt(s.slice(colonIdx + 1), 10);
        if (!isNaN(maybePort)) {
            return { host: s.slice(0, colonIdx), port: maybePort };
        }
    }
    return { host: s, port: 443 };
}

// ─── Cert view (same structure as certificate-decoder) ────────────────────────

function CertView({ info }: { info: ParsedCertificate }) {
    const { t } = useLanguage();
    const copy = (text: string, label = t("Copied")) => void copyToClipboard(text, label);

    const downloadDer = () => {
        downloadBytes(
            info.derBytes,
            `${info.subject.CN ?? "certificate"}.der`,
            "application/x-x509-ca-cert"
        );
    };

    return (
        <div>
            {info.isExpired && (
                <Alert
                    title={t("This certificate is EXPIRED")}
                    type="error"
                    icon={<CloseCircleOutlined />}
                    showIcon
                    style={{ marginBottom: 12 }}
                />
            )}
            {!info.isExpired && info.daysUntilExpiry < 30 && (
                <Alert
                    title={t("Expires in {days} days", { days: info.daysUntilExpiry })}
                    type="warning"
                    icon={<WarningOutlined />}
                    showIcon
                    style={{ marginBottom: 12 }}
                />
            )}
            {!info.isExpired && info.daysUntilExpiry >= 30 && (
                <Alert
                    title={t("Valid ({days} days remaining)", { days: info.daysUntilExpiry })}
                    type="success"
                    icon={<CheckCircleOutlined />}
                    showIcon
                    style={{ marginBottom: 12 }}
                />
            )}

            <Tabs
                size="small"
                items={[
                    {
                        key: "summary",
                        label: t("Summary"),
                        children: (
                            <Descriptions bordered size="small" column={1} styles={{ label: { width: 180 } }}>
                                <Descriptions.Item label={t("Common Name")}>{info.subject.CN ?? "—"}</Descriptions.Item>
                                <Descriptions.Item label={t("Issuer")}>{formatDN(info.issuer)}</Descriptions.Item>
                                <Descriptions.Item label={t("Serial Number")}>
                                    <Text dir="ltr" code
                                        copyable={{ text: info.serialNumber.replace(/:/g, "") }}
                                        style={{ fontSize: 16 }}
                                    >
                                        {info.serialNumber}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={t("Version")}>v{info.version}</Descriptions.Item>
                                <Descriptions.Item label={t("Signature Algorithm")}>{info.signatureAlgorithm}</Descriptions.Item>
                                <Descriptions.Item label={t("Public Key")}>
                                    {info.publicKeyAlgorithm} {info.publicKeySize ? t("{count} bits", { count: info.publicKeySize }) : ""}
                                </Descriptions.Item>
                                <Descriptions.Item label={t("Valid From")}>{info.notBefore.toUTCString()}</Descriptions.Item>
                                <Descriptions.Item label={t("Valid Until")}>{info.notAfter.toUTCString()}</Descriptions.Item>
                                <Descriptions.Item label={t("Self-Signed")}>
                                    {info.isSelfSigned ? <Tag color="purple">{t("Yes")}</Tag> : <Tag>{t("No")}</Tag>}
                                </Descriptions.Item>
                                {info.basicConstraints && (
                                    <Descriptions.Item label={t("Basic Constraints")}>
                                        {info.basicConstraints.ca ? (
                                            <Tag color="orange">CA: TRUE</Tag>
                                        ) : (
                                            <Tag>CA: FALSE</Tag>
                                        )}
                                        {info.basicConstraints.pathLenConstraint !== undefined && (
                                            <Tag>pathLen={info.basicConstraints.pathLenConstraint}</Tag>
                                        )}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        ),
                    },
                    {
                        key: "subject",
                        label: t("Subject / Issuer"),
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                <Card size="small" title={t("Subject")}>
                                    <Descriptions bordered size="small" column={1}>
                                        {Object.entries(info.subject).map(([k, v]) => (
                                            <Descriptions.Item key={k} label={`${t(DN_LABELS[k] ?? k)} (${k})`}>
                                                {v}
                                            </Descriptions.Item>
                                        ))}
                                    </Descriptions>
                                </Card>
                                <Card size="small" title={t("Issuer")}>
                                    <Descriptions bordered size="small" column={1}>
                                        {Object.entries(info.issuer).map(([k, v]) => (
                                            <Descriptions.Item key={k} label={`${t(DN_LABELS[k] ?? k)} (${k})`}>
                                                {v}
                                            </Descriptions.Item>
                                        ))}
                                    </Descriptions>
                                </Card>
                            </Space>
                        ),
                    },
                    {
                        key: "sans",
                        label: t("SANs ({count})", { count: info.sans.length }),
                        children:
                            info.sans.length > 0 ? (
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    {info.sans.map((san, i) => (
                                        <Tag
                                            key={i}
                                            icon={<CopyOutlined onClick={() => copy(san, t("SAN copied"))} />}
                                        >
                                            {san}
                                        </Tag>
                                    ))}
                                </Space>
                            ) : (
                                <Empty description={t("No Subject Alternative Names")} />
                            ),
                    },
                    {
                        key: "usage",
                        label: t("Key Usage"),
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                <div>
                                    <Text strong style={{ display: "block", marginBottom: 6 }}>{t("Key Usage")}</Text>
                                    {info.keyUsage.length > 0 ? (
                                        info.keyUsage.map((u, i) => (
                                            <Tag key={i} color="blue">
                                                {u}
                                            </Tag>
                                        ))
                                    ) : (
                                        <Text type="secondary">{t("None")}</Text>
                                    )}
                                </div>
                                <div>
                                    <Text strong style={{ display: "block", marginBottom: 6 }}>{t("Extended Key Usage")}</Text>
                                    {info.extendedKeyUsage.length > 0 ? (
                                        info.extendedKeyUsage.map((u, i) => (
                                            <Tag key={i} color="cyan">
                                                {u}
                                            </Tag>
                                        ))
                                    ) : (
                                        <Text type="secondary">{t("None")}</Text>
                                    )}
                                </div>
                            </Space>
                        ),
                    },
                    {
                        key: "fingerprints",
                        label: t("Fingerprints"),
                        children: (
                            <Descriptions bordered size="small" column={1} styles={{ label: { width: 100 } }}>
                                <Descriptions.Item label="SHA-256">
                                    <Text dir="ltr" code
                                        copyable={{ text: info.fingerprintSha256 }}
                                        style={{ fontSize: 16, wordBreak: "break-all" }}
                                    >
                                        {info.fingerprintSha256}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="SHA-1">
                                    <Text dir="ltr" code
                                        copyable={{ text: info.fingerprintSha1 }}
                                        style={{ fontSize: 16, wordBreak: "break-all" }}
                                    >
                                        {info.fingerprintSha1}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="MD5">
                                    <Text dir="ltr" code
                                        copyable={{ text: info.fingerprintMd5 }}
                                        style={{ fontSize: 16, wordBreak: "break-all" }}
                                    >
                                        {info.fingerprintMd5}
                                    </Text>
                                </Descriptions.Item>
                            </Descriptions>
                        ),
                    },
                    {
                        key: "publickey",
                        label: t("Public Key"),
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                <TextArea aria-label={t("Public key PEM output")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                    rows={10}
                                    value={info.publicKeyPem}
                                    readOnly
                                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}
                                />
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => copy(info.publicKeyPem, t("Public key copied"))}
                                >{t("Copy public key PEM")}</Button>
                            </Space>
                        ),
                    },
                    {
                        key: "raw",
                        label: t("Raw"),
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                <Card size="small" title="PEM">
                                    <TextArea aria-label={t("Certificate PEM output")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                        rows={8}
                                        value={info.pem}
                                        readOnly
                                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}
                                    />
                                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => copy(info.pem, t("PEM copied"))}
                                        >{t("Copy PEM")}</Button>
                                        <Button size="small" icon={<DownloadOutlined />} onClick={downloadDer}>{t("Download DER")}</Button>
                                    </div>
                                </Card>
                                <Card size="small" title="Base64 DER">
                                    <TextArea aria-label={t("Base64 DER output")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                        rows={6}
                                        value={info.derBase64}
                                        readOnly
                                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}
                                    />
                                </Card>
                            </Space>
                        ),
                    },
                ]}
            />
        </div>
    );
}

// ─── Decode Tab ───────────────────────────────────────────────────────────────

function DecodeTab({ input }: { input: string }) {
    const { t } = useLanguage();
    const { message } = App.useApp();
    const [info, setInfo] = useState<ParsedCertificate | null>(null);
    const [err, setErr] = useState<{ detail: string; authored: "empty" | "fallback" | null } | null>(null);
    const [loading, setLoading] = useState(false);

    const decode = useCallback(async () => {
        if (!input.trim()) {
            setErr({ detail: "", authored: "empty" });
            return;
        }
        setLoading(true);
        setErr(null);
        try {
            const parsed = await parseCertificate(input.trim());
            setInfo(parsed);
            message.success(t("Certificate decoded"));
        } catch (e) {
            setInfo(null);
            const msg = e instanceof Error ? e.message : "Failed to parse certificate";
            setErr({ detail: msg, authored: e instanceof Error ? null : "fallback" });
            message.error(e instanceof Error ? msg : t("Failed to parse certificate"));
        } finally {
            setLoading(false);
        }
    }, [input, message, t]);

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Button type="primary" icon={<SafetyCertificateOutlined />} loading={loading} onClick={decode}>{t("Decode")}</Button>
                {err && <Tag color="error">{err.authored === "empty" ? t("Paste a certificate in the input area above") : err.authored === "fallback" ? t("Failed to parse certificate") : <bdi dir="ltr">{err.detail}</bdi>}</Tag>}
            </div>

            <Card size="small" title={t("Decoded Output")}>
                {!info ? (
                    <Empty description={t("Decode a certificate to see its fields")} />
                ) : (
                    <CertView info={info} />
                )}
            </Card>
        </Space>
    );
}

// ─── Fingerprint Tab ──────────────────────────────────────────────────────────

function FingerprintTab({ input }: { input: string }) {
    const { t, language } = useLanguage();
    const { message } = App.useApp();
    const [info, setInfo] = useState<ParsedCertificate | null>(null);
    const [fps, setFps] = useState<{ sha1: string; sha256: string; md5: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const compute = useCallback(async () => {
        if (!input.trim()) {
            message.warning(t("Paste a certificate in the input area above"));
            return;
        }
        setLoading(true);
        try {
            const [parsed, computed] = await Promise.all([
                parseCertificate(input.trim()).catch(() => null),
                fingerprint(input.trim()),
            ]);
            setInfo(parsed);
            setFps(computed);
        } catch (e) {
            message.error(e instanceof Error ? e.message : t("Could not parse certificate"));
            setInfo(null);
            setFps(null);
        } finally {
            setLoading(false);
        }
    }, [input, message, t]);

    const copy = (text: string, label: string) => void copyToClipboard(text, label);

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <div>
                <Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={compute}>{t("Compute Fingerprints")}</Button>
            </div>

            {fps ? (
                <Card size="small" title={t("Fingerprints")}>
                    {info && (
                        <div style={{ marginBottom: 12 }}>
                            <Tag color="success">CN: {info.subject.CN ?? "?"}</Tag>
                            <Tag>
                                {info.publicKeyAlgorithm} {info.publicKeySize ? t("{count} bits", { count: info.publicKeySize }) : ""}
                            </Tag>
                            <Tag color={info.isExpired ? "error" : "default"}>
                                {info.isExpired
                                    ? t("Expired")
                                    : t("Valid until {date}", { date: info.notAfter.toLocaleDateString(language) })}
                            </Tag>
                        </div>
                    )}
                    <Descriptions bordered size="small" column={1} styles={{ label: { width: 120, fontWeight: 600 } }}>
                        <Descriptions.Item
                            label={
                                <Space>
                                    SHA-256 <Tag color="success">{t("recommended")}</Tag>
                                </Space>
                            }
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <Text dir="ltr" code style={{ fontSize: 16, wordBreak: "break-all", flex: 1 }}>
                                    {fps.sha256}
                                </Text>
                                <Button aria-label={t("Copy")}
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copy(fps.sha256, t("SHA-256 copied"))}
                                />
                                <Button
                                    size="small"
                                    onClick={() =>
                                        copy(fps.sha256.replace(/:/g, "").toLowerCase(), t("Plain hex copied"))
                                    }
                                >{t("plain")}</Button>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="SHA-1">
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <Text dir="ltr" code style={{ fontSize: 16, wordBreak: "break-all", flex: 1 }}>
                                    {fps.sha1}
                                </Text>
                                <Button aria-label={t("Copy")}
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copy(fps.sha1, t("SHA-1 copied"))}
                                />
                                <Button
                                    size="small"
                                    onClick={() =>
                                        copy(fps.sha1.replace(/:/g, "").toLowerCase(), t("Plain hex copied"))
                                    }
                                >{t("plain")}</Button>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={
                                <Space>
                                    MD5 <Tag color="warning">{t("legacy")}</Tag>
                                </Space>
                            }
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <Text dir="ltr" code style={{ fontSize: 16, wordBreak: "break-all", flex: 1 }}>
                                    {fps.md5}
                                </Text>
                                <Button aria-label={t("Copy")}
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copy(fps.md5, t("MD5 copied"))}
                                />
                                <Button
                                    size="small"
                                    onClick={() =>
                                        copy(fps.md5.replace(/:/g, "").toLowerCase(), t("Plain hex copied"))
                                    }
                                >{t("plain")}</Button>
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            ) : (
                <Card size="small">
                    <Empty description={t("Compute fingerprints to view results")} />
                </Card>
            )}
        </Space>
    );
}

// ─── Convert Tab ──────────────────────────────────────────────────────────────

function ConvertTab({ input }: { input: string }) {
    const { t, language } = useLanguage();
    const { message } = App.useApp();
    const [target, setTarget] = useState<ConvertFormat>("pem");
    const [output, setOutput] = useState("");
    const [resultFormat, setResultFormat] = useState<ConvertFormat>("pem");
    const [info, setInfo] = useState<ParsedCertificate | null>(null);
    const [downloadBytesOut, setDownloadBytesOut] = useState<Uint8Array | null>(null);
    const [loading, setLoading] = useState(false);

    const convert = useCallback(async () => {
        if (!input.trim()) {
            message.warning(t("Paste or upload a certificate in the input area above"));
            return;
        }
        setLoading(true);
        try {
            const parsed = await parseCertificate(input.trim()).catch(() => null);
            setInfo(parsed);

            const result = convertCertificate(input.trim(), target);
            setResultFormat(target);
            if (target === "der-bytes") {
                setDownloadBytesOut(result as Uint8Array);
                setOutput("");
            } else {
                setDownloadBytesOut(null);
                setOutput(result as string);
            }
            message.success(t("Converted to {format}", { format: target.toUpperCase() }));
        } catch (e) {
            message.error(e instanceof Error ? e.message : t("Conversion failed"));
        } finally {
            setLoading(false);
        }
    }, [input, target, message, t]);

    const handleDownload = () => {
        const name = info?.subject.CN ?? "certificate";
        if (resultFormat === "der-bytes" && downloadBytesOut) {
            downloadBytes(downloadBytesOut, `${name}.der`, "application/x-x509-ca-cert");
        } else if (output) {
            const ext = resultFormat === "pem" ? "pem" : "txt";
            downloadText(output, `${name}.${ext}`, "application/x-pem-file");
        }
    };

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <Text strong>{t("Convert to:")}</Text>
                <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Conversion format")}
                    value={target}
                    onChange={setTarget}
                    style={{ width: "min(100%, 360px)", minWidth: 0 }}
                    options={(Object.keys(FORMAT_LABEL) as ConvertFormat[]).map((f) => ({
                        value: f,
                        label: t(FORMAT_LABEL[f]),
                    }))}
                />
                <Button type="primary" icon={<SwapOutlined />} loading={loading} onClick={convert}>{t("Convert")}</Button>
            </div>

            {info && (
                <Alert
                    type={info.isExpired ? "warning" : "info"}
                    title={
                        <Space wrap>
                            <Tag color="success">{info.subject.CN ?? "?"}</Tag>
                            <Tag>
                                {info.publicKeyAlgorithm} {info.publicKeySize}{t("bits")}</Tag>
                            <Tag color={info.isExpired ? "error" : "default"}>
                                {info.isExpired
                                    ? t("Expired")
                                    : t("Valid until {date}", { date: info.notAfter.toLocaleDateString(language) })}
                            </Tag>
                        </Space>
                    }
                />
            )}

            {(output || downloadBytesOut) ? (
                <Card
                    size="small"
                    title={t("Output ({format})", { format: t(FORMAT_LABEL[resultFormat]) })}
                    extra={
                        <Space size={4}>
                            {resultFormat !== "der-bytes" && (
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => {
                                        copyToClipboard(output, t("Output copied"));
                                    }}
                                >{t("Copy")}</Button>
                            )}
                            <Button
                                size="small"
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={handleDownload}
                            >{t("Download")}</Button>
                        </Space>
                    }
                >
                    <TextArea aria-label={t("Converted certificate output")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                        rows={resultFormat === "der-bytes" ? 3 : 12}
                        value={downloadBytesOut ? t("Binary DER ({count} bytes) — click Download", { count: downloadBytesOut.length }) : output}
                        readOnly
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}
                    />
                </Card>
            ) : (
                <Card size="small">
                    <Empty description={t("Choose a format and click Convert")} />
                </Card>
            )}
        </Space>
    );
}

// ─── PEM Parser Tab ───────────────────────────────────────────────────────────

async function parseSingleBlock(label: string, body: string): Promise<ParsedBlock> {
    const upperLabel = label.toUpperCase();
    try {
        if (upperLabel === "CERTIFICATE") {
            const c = await parseCertificate(body);
            return {
                label,
                body,
                valid: true,
                summary: certificateText("Subject: {subject}", { subject: c.subject.CN ?? formatDN(c.subject) }),
                detail: (
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label={certificateText("Subject")}>{formatDN(c.subject)}</Descriptions.Item>
                        <Descriptions.Item label={certificateText("Issuer")}>{formatDN(c.issuer)}</Descriptions.Item>
                        <Descriptions.Item label={certificateText("Valid Until")}>
                            {c.notAfter.toUTCString()}{" "}
                            {c.isExpired && <Tag color="error">{certificateText("expired")}</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label={certificateText("Public Key")}>
                            {c.publicKeyAlgorithm} {c.publicKeySize}{certificateText("bits")}</Descriptions.Item>
                        <Descriptions.Item label="SHA-256">
                            <Text dir="ltr" code style={{ fontSize: 10, wordBreak: "break-all" }}>
                                {c.fingerprintSha256}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>
                ),
            };
        }

        if (
            upperLabel.includes("CERTIFICATE REQUEST") ||
            upperLabel === "NEW CERTIFICATE REQUEST"
        ) {
            const csr = parseCSR(body);
            return {
                label,
                body,
                valid: true,
                summary: certificateText("CSR for: {subject}", { subject: csr.subject.CN ?? formatDN(csr.subject) }),
                detail: (
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label={certificateText("Subject")}>{formatDN(csr.subject)}</Descriptions.Item>
                        <Descriptions.Item label={certificateText("Public Key")}>
                            {csr.publicKeyAlgorithm} {csr.publicKeySize}{certificateText("bits")}</Descriptions.Item>
                        <Descriptions.Item label={certificateText("Signature Algorithm")}>
                            {csr.signatureAlgorithm}
                        </Descriptions.Item>
                        {csr.sans.length > 0 && (
                            <Descriptions.Item label="SANs">
                                <Space wrap size={4}>
                                    {csr.sans.map((s, i) => (
                                        <Tag key={i}>{s}</Tag>
                                    ))}
                                </Space>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                ),
            };
        }

        if (upperLabel.includes("PRIVATE KEY")) {
            const key = forge.pki.privateKeyFromPem(body);
            const k = key as unknown as { n?: forge.jsbn.BigInteger };
            const bits = k.n?.bitLength?.() ?? 0;
            const algo = k.n
                ? "RSA"
                : upperLabel.includes("EC")
                ? "EC"
                : upperLabel.includes("ED25519")
                ? "Ed25519"
                : "Unknown";
            return {
                label,
                body,
                valid: true,
                summary: certificateText("{algorithm} private key ({bits} bits)", { algorithm: algo, bits }),
                detail: (
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label={certificateText("Algorithm")}>{algo}</Descriptions.Item>
                        {bits > 0 && (
                            <Descriptions.Item label={certificateText("Key Size")}>{bits}{certificateText("bits")}</Descriptions.Item>
                        )}
                        <Descriptions.Item label={certificateText("Format")}>
                            PKCS#{upperLabel.startsWith("PRIVATE") ? "8" : "1"}
                        </Descriptions.Item>
                        <Descriptions.Item label={certificateText("Block Length")}>{body.length}{certificateText("chars")}</Descriptions.Item>
                    </Descriptions>
                ),
            };
        }

        if (upperLabel.includes("PUBLIC KEY")) {
            const key = forge.pki.publicKeyFromPem(body);
            const k = key as unknown as { n?: forge.jsbn.BigInteger };
            const bits = k.n?.bitLength?.() ?? 0;
            const algo = k.n ? "RSA" : "EC/Ed25519";
            return {
                label,
                body,
                valid: true,
                summary: certificateText("{algorithm} public key ({bits} bits)", { algorithm: algo, bits }),
                detail: (
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label={certificateText("Algorithm")}>{algo}</Descriptions.Item>
                        {bits > 0 && (
                            <Descriptions.Item label={certificateText("Key Size")}>{bits}{certificateText("bits")}</Descriptions.Item>
                        )}
                    </Descriptions>
                ),
            };
        }

        // Unknown label — decode raw size only
        const m = body.match(/-----BEGIN [^-]+-----([\s\S]*?)-----END [^-]+-----/);
        const b64 = m?.[1].replace(/\s+/g, "") ?? "";
        const der = b64 ? forge.util.decode64(b64) : "";
        return {
            label,
            body,
            valid: true,
            summary: certificateText("Raw DER bytes: {count} (unrecognised label)", { count: der.length }),
            detail: (
                <Text type="secondary">                    {certificateText("No specific parser for PEM label {label}. Decoded length: {count} bytes.", { label, count: der.length })}</Text>
            ),
        };
    } catch (e) {
        return {
            label,
            body,
            valid: false,
            summary: e instanceof Error ? <bdi dir="ltr">{e.message}</bdi> : certificateText("Failed to parse certificate"),
            detail: <Text type="danger">{e instanceof Error ? e.message : String(e)}</Text>,
        };
    }
}

function PemParserTab({ input }: { input: string }) {
    const { t } = useLanguage();
    const { message } = App.useApp();
    const [blocks, setBlocks] = useState<ParsedBlock[]>([]);
    const [loading, setLoading] = useState(false);

    const parse = useCallback(async () => {
        if (!input.trim()) {
            message.warning(t("Paste PEM data in the input area above"));
            return;
        }
        setLoading(true);
        try {
            const found = listPemBlocks(input);
            if (found.length === 0) {
                message.error(t("No PEM blocks found in input"));
                setBlocks([]);
                return;
            }
            const parsed = await Promise.all(
                found.map((b) => parseSingleBlock(b.label, b.body))
            );
            setBlocks(parsed);
            message.success(t("PEM blocks parsed: {count}", { count: parsed.length }));
        } finally {
            setLoading(false);
        }
    }, [input, message, t]);

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <div>
                <Button type="primary" icon={<EyeOutlined />} loading={loading} onClick={parse}>{t("Parse PEM Blocks")}</Button>
            </div>

            {blocks.length === 0 ? (
                <Card size="small">
                    <Empty description={t("Parse PEM to see all blocks")} />
                </Card>
            ) : (
                <Space orientation="vertical" style={{ width: "100%" }}>
                    {blocks.map((b, i) => (
                        <Card
                            key={i}
                            size="small"
                            title={
                                <Space>
                                    <Tag color={b.valid ? "success" : "error"}>{b.label}</Tag>
                                    <Text>{b.summary}</Text>
                                </Space>
                            }
                        >
                            {b.detail}
                        </Card>
                    ))}
                </Space>
            )}
        </Space>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function CertificateInspectorPageContent() {
    const { t } = useLanguage();
    const { message } = App.useApp();
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialTab = searchParams.get("tab") ?? "decode";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [input, setInput] = useState("");
    const [urlInput, setUrlInput] = useState("");
    const [fetchLoading, setFetchLoading] = useState(false);

    const handleUpload = useFileUpload(setInput);

    const handleFetch = useCallback(async () => {
        if (!urlInput.trim()) {
            message.warning(t("Enter a hostname or URL"));
            return;
        }
        const { host, port } = extractHostAndPort(urlInput);
        if (!host) {
            message.error(t("Could not parse hostname"));
            return;
        }
        setFetchLoading(true);
        try {
            const res = await fetch(`/api/fetch-cert?host=${encodeURIComponent(host)}&port=${port}`);
            const data = await parseCertificateFetchResponse(res);
            if (!data.pems || data.pems.length === 0) {
                message.error(t("The server returned no certificates. Check the hostname and try again."));
                return;
            }
            setInput(data.pems.join("\n\n"));
            message.success(t("Certificates fetched from {host}: {count}", { host, count: data.pems.length }));
        } catch (e) {
            message.error(e instanceof Error ? e.message : t("Failed to fetch certificate"));
        } finally {
            setFetchLoading(false);
        }
    }, [urlInput, message, t]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        router.replace(`?tab=${key}`, { scroll: false });
    };

    const handleClear = () => {
        setInput("");
        setUrlInput("");
    };

    return (
        <ToolPageLayout
            title={t("Certificate Inspector")}
            description={t("Decode, fingerprint, convert, and parse X.509 certificates")}
            icon={<SearchOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs:
                    t("A comprehensive X.509 certificate inspection suite. Decode certificate fields, compute fingerprints, convert between PEM/DER formats, and parse bundled PEM files — all in one place. Supports live URL fetching to inspect any server's certificate directly."),
                whyUse:
                    t("Stop switching between openssl commands and online tools. Paste a cert or enter a URL and get fingerprints, decoded fields, format conversions, and PEM block analysis in seconds."),
                howToUse: [
                    t("Paste a PEM/DER certificate or enter a URL to fetch live"),
                    t("Switch tabs for Decode, Fingerprints, Convert, or PEM Parser"),
                    t("Upload .crt/.cer/.der files directly"),
                ],
                tips: [
                    t("URL fetch retrieves the live certificate chain from the server"),
                    t("Fingerprints tab shows SHA-256 (recommended), SHA-1, and MD5"),
                    t("PEM Parser handles bundles with multiple certificates, keys, and CSRs"),
                ],
                useCases: [
                    t("Debugging TLS handshake errors"),
                    t("Computing fingerprints for SSL pinning"),
                    t("Converting PEM to DER for Java truststore"),
                    t("Inspecting certificate bundles"),
                ],
                serverNotice: {
                    route: "fetch-cert",
                    purpose: t("The 'Fetch from URL' button is the only feature that contacts a server. Browsers cannot open raw TLS sockets to a remote host, so the server opens a TLS connection on your behalf, captures the certificate chain, and returns the PEM blocks."),
                    sentFields: [
                        t("Hostname (e.g. example.com)"),
                        t("Port number (default 443)"),
                    ],
                    extra: (
                        <Typography.Paragraph style={{ fontSize: 16, marginBottom: 0 }}>
                            <Text strong>{t("Local-only alternative:")}</Text>{" "}{t("paste a PEM/DER cert or use the Upload button — those paths run 100% in your browser and never touch the server.")}
                        </Typography.Paragraph>
                    ),
                },
            }}
        >
            <ToolBridgeBanner accepts={["text"]} onAccept={(payload) => setInput(payload.data)} />
            {/* ── Shared Input Section ── */}
            <Card
                size="small"
                title={t("Certificate Input")}
                style={{ marginBottom: 16 }}
                extra={
                    <Space size={4}>
                        <Upload
                            accept=".pem,.crt,.cer,.der,.txt"
                            beforeUpload={handleUpload}
                            showUploadList={false}
                        >
                            <Button size="small" icon={<UploadOutlined />}>{t("Upload")}</Button>
                        </Upload>
                        <Button size="small" onClick={handleClear}>{t("Clear")}</Button>
                    </Space>
                }
            >
                <TextArea aria-label={t("Certificate input")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                    rows={10}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("Paste PEM-encoded or base64-DER certificate (or multiple PEM blocks)")}
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16, marginBottom: 12 }}
                />

                {/* URL fetch row */}
                <div style={{ display: "flex", gap: 0 }}>
                    <Input aria-label={t("Hostname or URL")} styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }}
                        prefix={<GlobalOutlined style={{ color: "#8c8c8c" }} />}
                        placeholder={t("example.com or https://example.com")}
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onPressEnter={handleFetch}
                        style={{ flex: 1, borderRadius: "6px 0 0 6px" }}
                    />
                    <Button
                        type="primary"
                        icon={<GlobalOutlined />}
                        loading={fetchLoading}
                        onClick={handleFetch}
                        style={{ borderRadius: "0 6px 6px 0" }}
                    >{t("Fetch")}</Button>
                </div>
            </Card>

            {/* ── Tabbed Actions ── */}
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={[
                    {
                        key: "decode",
                        label: (
                            <Space size={4}>
                                <SafetyCertificateOutlined />{t("Decode")}</Space>
                        ),
                        children: <DecodeTab input={input} />,
                    },
                    {
                        key: "fingerprint",
                        label: (
                            <Space size={4}>
                                <SearchOutlined />{t("Fingerprints")}</Space>
                        ),
                        children: <FingerprintTab input={input} />,
                    },
                    {
                        key: "convert",
                        label: (
                            <Space size={4}>
                                <SwapOutlined />{t("Convert")}</Space>
                        ),
                        children: <ConvertTab input={input} />,
                    },
                    {
                        key: "pem-parser",
                        label: (
                            <Space size={4}>
                                <EyeOutlined />{t("PEM Parser")}</Space>
                        ),
                        children: <PemParserTab input={input} />,
                    },
                ]}
            />
        </ToolPageLayout>
    );
}

export default function CertificateInspectorPage() {
    return (
        <Suspense fallback={null}>
            <CertificateInspectorPageContent />
        </Suspense>
    );
}

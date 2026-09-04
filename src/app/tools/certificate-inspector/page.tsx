"use client";

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
import forge from "node-forge";

const { TextArea } = Input;
const { Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

type ConvertFormat = "pem" | "der-base64" | "der-bytes";

interface ParsedBlock {
    label: string;
    body: string;
    summary: string;
    detail: React.ReactNode;
    valid: boolean;
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
                onText(btoa(Array.from(bytes).map((b) => String.fromCharCode(b)).join("")));
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
    const { message } = App.useApp();

    const copy = (text: string, label = "Copied") => {
        copyToClipboard(text, label);
        message.success(label);
    };

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
                    title="This certificate is EXPIRED"
                    type="error"
                    icon={<CloseCircleOutlined />}
                    showIcon
                    style={{ marginBottom: 12 }}
                />
            )}
            {!info.isExpired && info.daysUntilExpiry < 30 && (
                <Alert
                    title={`Expires in ${info.daysUntilExpiry} days`}
                    type="warning"
                    icon={<WarningOutlined />}
                    showIcon
                    style={{ marginBottom: 12 }}
                />
            )}
            {!info.isExpired && info.daysUntilExpiry >= 30 && (
                <Alert
                    title={`Valid (${info.daysUntilExpiry} days remaining)`}
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
                        label: "Summary",
                        children: (
                            <Descriptions bordered size="small" column={1} styles={{ label: { width: 180 } }}>
                                <Descriptions.Item label="Common Name">{info.subject.CN ?? "—"}</Descriptions.Item>
                                <Descriptions.Item label="Issuer">{formatDN(info.issuer)}</Descriptions.Item>
                                <Descriptions.Item label="Serial Number">
                                    <Text
                                        code
                                        copyable={{ text: info.serialNumber.replace(/:/g, "") }}
                                        style={{ fontSize: 11 }}
                                    >
                                        {info.serialNumber}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Version">v{info.version}</Descriptions.Item>
                                <Descriptions.Item label="Signature Algorithm">{info.signatureAlgorithm}</Descriptions.Item>
                                <Descriptions.Item label="Public Key">
                                    {info.publicKeyAlgorithm} {info.publicKeySize ? `${info.publicKeySize} bits` : ""}
                                </Descriptions.Item>
                                <Descriptions.Item label="Valid From">{info.notBefore.toUTCString()}</Descriptions.Item>
                                <Descriptions.Item label="Valid Until">{info.notAfter.toUTCString()}</Descriptions.Item>
                                <Descriptions.Item label="Self-Signed">
                                    {info.isSelfSigned ? <Tag color="purple">Yes</Tag> : <Tag>No</Tag>}
                                </Descriptions.Item>
                                {info.basicConstraints && (
                                    <Descriptions.Item label="Basic Constraints">
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
                        label: "Subject / Issuer",
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                <Card size="small" title="Subject">
                                    <Descriptions bordered size="small" column={1}>
                                        {Object.entries(info.subject).map(([k, v]) => (
                                            <Descriptions.Item key={k} label={`${DN_LABELS[k] ?? k} (${k})`}>
                                                {v}
                                            </Descriptions.Item>
                                        ))}
                                    </Descriptions>
                                </Card>
                                <Card size="small" title="Issuer">
                                    <Descriptions bordered size="small" column={1}>
                                        {Object.entries(info.issuer).map(([k, v]) => (
                                            <Descriptions.Item key={k} label={`${DN_LABELS[k] ?? k} (${k})`}>
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
                        label: `SANs (${info.sans.length})`,
                        children:
                            info.sans.length > 0 ? (
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    {info.sans.map((san, i) => (
                                        <Tag
                                            key={i}
                                            icon={<CopyOutlined onClick={() => copy(san, "SAN copied")} />}
                                        >
                                            {san}
                                        </Tag>
                                    ))}
                                </Space>
                            ) : (
                                <Empty description="No Subject Alternative Names" />
                            ),
                    },
                    {
                        key: "usage",
                        label: "Key Usage",
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                <div>
                                    <Text strong style={{ display: "block", marginBottom: 6 }}>
                                        Key Usage
                                    </Text>
                                    {info.keyUsage.length > 0 ? (
                                        info.keyUsage.map((u, i) => (
                                            <Tag key={i} color="blue">
                                                {u}
                                            </Tag>
                                        ))
                                    ) : (
                                        <Text type="secondary">None</Text>
                                    )}
                                </div>
                                <div>
                                    <Text strong style={{ display: "block", marginBottom: 6 }}>
                                        Extended Key Usage
                                    </Text>
                                    {info.extendedKeyUsage.length > 0 ? (
                                        info.extendedKeyUsage.map((u, i) => (
                                            <Tag key={i} color="cyan">
                                                {u}
                                            </Tag>
                                        ))
                                    ) : (
                                        <Text type="secondary">None</Text>
                                    )}
                                </div>
                            </Space>
                        ),
                    },
                    {
                        key: "fingerprints",
                        label: "Fingerprints",
                        children: (
                            <Descriptions bordered size="small" column={1} styles={{ label: { width: 100 } }}>
                                <Descriptions.Item label="SHA-256">
                                    <Text
                                        code
                                        copyable={{ text: info.fingerprintSha256 }}
                                        style={{ fontSize: 11, wordBreak: "break-all" }}
                                    >
                                        {info.fingerprintSha256}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="SHA-1">
                                    <Text
                                        code
                                        copyable={{ text: info.fingerprintSha1 }}
                                        style={{ fontSize: 11, wordBreak: "break-all" }}
                                    >
                                        {info.fingerprintSha1}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="MD5">
                                    <Text
                                        code
                                        copyable={{ text: info.fingerprintMd5 }}
                                        style={{ fontSize: 11, wordBreak: "break-all" }}
                                    >
                                        {info.fingerprintMd5}
                                    </Text>
                                </Descriptions.Item>
                            </Descriptions>
                        ),
                    },
                    {
                        key: "publickey",
                        label: "Public Key",
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                <TextArea
                                    rows={10}
                                    value={info.publicKeyPem}
                                    readOnly
                                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}
                                />
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => copy(info.publicKeyPem, "Public key copied")}
                                >
                                    Copy public key PEM
                                </Button>
                            </Space>
                        ),
                    },
                    {
                        key: "raw",
                        label: "Raw",
                        children: (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                <Card size="small" title="PEM">
                                    <TextArea
                                        rows={8}
                                        value={info.pem}
                                        readOnly
                                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}
                                    />
                                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => copy(info.pem, "PEM copied")}
                                        >
                                            Copy PEM
                                        </Button>
                                        <Button size="small" icon={<DownloadOutlined />} onClick={downloadDer}>
                                            Download DER
                                        </Button>
                                    </div>
                                </Card>
                                <Card size="small" title="Base64 DER">
                                    <TextArea
                                        rows={6}
                                        value={info.derBase64}
                                        readOnly
                                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}
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
    const { message } = App.useApp();
    const [info, setInfo] = useState<ParsedCertificate | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const decode = useCallback(async () => {
        if (!input.trim()) {
            setErr("Paste a certificate in the input area above");
            return;
        }
        setLoading(true);
        setErr(null);
        try {
            const parsed = await parseCertificate(input.trim());
            setInfo(parsed);
            message.success("Certificate decoded");
        } catch (e) {
            setInfo(null);
            const msg = e instanceof Error ? e.message : "Failed to parse certificate";
            setErr(msg);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    }, [input, message]);

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Button type="primary" icon={<SafetyCertificateOutlined />} loading={loading} onClick={decode}>
                    Decode
                </Button>
                {err && <Tag color="error">{err}</Tag>}
            </div>

            <Card size="small" title="Decoded Output">
                {!info ? (
                    <Empty description="Decode a certificate to see its fields" />
                ) : (
                    <CertView info={info} />
                )}
            </Card>
        </Space>
    );
}

// ─── Fingerprint Tab ──────────────────────────────────────────────────────────

function FingerprintTab({ input }: { input: string }) {
    const { message } = App.useApp();
    const [info, setInfo] = useState<ParsedCertificate | null>(null);
    const [fps, setFps] = useState<{ sha1: string; sha256: string; md5: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const compute = useCallback(async () => {
        if (!input.trim()) {
            message.warning("Paste a certificate in the input area above");
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
            message.error(e instanceof Error ? e.message : "Could not parse certificate");
            setInfo(null);
            setFps(null);
        } finally {
            setLoading(false);
        }
    }, [input, message]);

    const copy = (text: string, label: string) => {
        copyToClipboard(text, label);
        message.success(label);
    };

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <div>
                <Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={compute}>
                    Compute Fingerprints
                </Button>
            </div>

            {fps ? (
                <Card size="small" title="Fingerprints">
                    {info && (
                        <div style={{ marginBottom: 12 }}>
                            <Tag color="success">CN: {info.subject.CN ?? "?"}</Tag>
                            <Tag>
                                {info.publicKeyAlgorithm} {info.publicKeySize ? `${info.publicKeySize} bits` : ""}
                            </Tag>
                            <Tag color={info.isExpired ? "error" : "default"}>
                                {info.isExpired
                                    ? "Expired"
                                    : `Valid until ${info.notAfter.toLocaleDateString()}`}
                            </Tag>
                        </div>
                    )}
                    <Descriptions bordered size="small" column={1} styles={{ label: { width: 120, fontWeight: 600 } }}>
                        <Descriptions.Item
                            label={
                                <Space>
                                    SHA-256 <Tag color="success">recommended</Tag>
                                </Space>
                            }
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <Text code style={{ fontSize: 11, wordBreak: "break-all", flex: 1 }}>
                                    {fps.sha256}
                                </Text>
                                <Button aria-label="Copy"
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copy(fps.sha256, "SHA-256 copied")}
                                />
                                <Button
                                    size="small"
                                    onClick={() =>
                                        copy(fps.sha256.replace(/:/g, "").toLowerCase(), "Plain hex copied")
                                    }
                                >
                                    plain
                                </Button>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="SHA-1">
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <Text code style={{ fontSize: 11, wordBreak: "break-all", flex: 1 }}>
                                    {fps.sha1}
                                </Text>
                                <Button aria-label="Copy"
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copy(fps.sha1, "SHA-1 copied")}
                                />
                                <Button
                                    size="small"
                                    onClick={() =>
                                        copy(fps.sha1.replace(/:/g, "").toLowerCase(), "Plain hex copied")
                                    }
                                >
                                    plain
                                </Button>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={
                                <Space>
                                    MD5 <Tag color="warning">legacy</Tag>
                                </Space>
                            }
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <Text code style={{ fontSize: 11, wordBreak: "break-all", flex: 1 }}>
                                    {fps.md5}
                                </Text>
                                <Button aria-label="Copy"
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copy(fps.md5, "MD5 copied")}
                                />
                                <Button
                                    size="small"
                                    onClick={() =>
                                        copy(fps.md5.replace(/:/g, "").toLowerCase(), "Plain hex copied")
                                    }
                                >
                                    plain
                                </Button>
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            ) : (
                <Card size="small">
                    <Empty description="Compute fingerprints to view results" />
                </Card>
            )}
        </Space>
    );
}

// ─── Convert Tab ──────────────────────────────────────────────────────────────

function ConvertTab({ input }: { input: string }) {
    const { message } = App.useApp();
    const [target, setTarget] = useState<ConvertFormat>("pem");
    const [output, setOutput] = useState("");
    const [info, setInfo] = useState<ParsedCertificate | null>(null);
    const [downloadBytesOut, setDownloadBytesOut] = useState<Uint8Array | null>(null);
    const [loading, setLoading] = useState(false);

    const convert = useCallback(async () => {
        if (!input.trim()) {
            message.warning("Paste or upload a certificate in the input area above");
            return;
        }
        setLoading(true);
        try {
            const parsed = await parseCertificate(input.trim()).catch(() => null);
            setInfo(parsed);

            const result = convertCertificate(input.trim(), target);
            if (target === "der-bytes") {
                setDownloadBytesOut(result as Uint8Array);
                setOutput(`Binary DER (${(result as Uint8Array).length} bytes) — click Download`);
            } else {
                setDownloadBytesOut(null);
                setOutput(result as string);
            }
            message.success(`Converted to ${target.toUpperCase()}`);
        } catch (e) {
            message.error(e instanceof Error ? e.message : "Conversion failed");
        } finally {
            setLoading(false);
        }
    }, [input, target, message]);

    const handleDownload = () => {
        const name = info?.subject.CN ?? "certificate";
        if (target === "der-bytes" && downloadBytesOut) {
            downloadBytes(downloadBytesOut, `${name}.der`, "application/x-x509-ca-cert");
        } else if (output) {
            const ext = target === "pem" ? "pem" : "txt";
            downloadText(output, `${name}.${ext}`, "application/x-pem-file");
        }
    };

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <Text strong>Convert to:</Text>
                <Select
                    value={target}
                    onChange={setTarget}
                    style={{ minWidth: 280 }}
                    options={(Object.keys(FORMAT_LABEL) as ConvertFormat[]).map((f) => ({
                        value: f,
                        label: FORMAT_LABEL[f],
                    }))}
                />
                <Button type="primary" icon={<SwapOutlined />} loading={loading} onClick={convert}>
                    Convert
                </Button>
            </div>

            {info && (
                <Alert
                    type={info.isExpired ? "warning" : "info"}
                    title={
                        <Space wrap>
                            <Tag color="success">{info.subject.CN ?? "?"}</Tag>
                            <Tag>
                                {info.publicKeyAlgorithm} {info.publicKeySize} bits
                            </Tag>
                            <Tag color={info.isExpired ? "error" : "default"}>
                                {info.isExpired
                                    ? "Expired"
                                    : `Valid until ${info.notAfter.toLocaleDateString()}`}
                            </Tag>
                        </Space>
                    }
                />
            )}

            {output ? (
                <Card
                    size="small"
                    title={`Output (${FORMAT_LABEL[target]})`}
                    extra={
                        <Space size={4}>
                            {target !== "der-bytes" && (
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => {
                                        copyToClipboard(output, "Output copied");
                                        message.success("Copied");
                                    }}
                                >
                                    Copy
                                </Button>
                            )}
                            <Button
                                size="small"
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                        </Space>
                    }
                >
                    <TextArea
                        rows={target === "der-bytes" ? 3 : 12}
                        value={output}
                        readOnly
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}
                    />
                </Card>
            ) : (
                <Card size="small">
                    <Empty description="Choose a format and click Convert" />
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
                summary: `Subject: ${c.subject.CN ?? formatDN(c.subject)}`,
                detail: (
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label="Subject">{formatDN(c.subject)}</Descriptions.Item>
                        <Descriptions.Item label="Issuer">{formatDN(c.issuer)}</Descriptions.Item>
                        <Descriptions.Item label="Valid Until">
                            {c.notAfter.toUTCString()}{" "}
                            {c.isExpired && <Tag color="error">expired</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Public Key">
                            {c.publicKeyAlgorithm} {c.publicKeySize} bits
                        </Descriptions.Item>
                        <Descriptions.Item label="SHA-256">
                            <Text code style={{ fontSize: 10, wordBreak: "break-all" }}>
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
                summary: `CSR for: ${csr.subject.CN ?? formatDN(csr.subject)}`,
                detail: (
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label="Subject">{formatDN(csr.subject)}</Descriptions.Item>
                        <Descriptions.Item label="Public Key">
                            {csr.publicKeyAlgorithm} {csr.publicKeySize} bits
                        </Descriptions.Item>
                        <Descriptions.Item label="Signature Algorithm">
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
                summary: `${algo} private key${bits ? ` (${bits} bits)` : ""}`,
                detail: (
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label="Algorithm">{algo}</Descriptions.Item>
                        {bits > 0 && (
                            <Descriptions.Item label="Key Size">{bits} bits</Descriptions.Item>
                        )}
                        <Descriptions.Item label="Format">
                            PKCS#{upperLabel.startsWith("PRIVATE") ? "8" : "1"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Block Length">{body.length} chars</Descriptions.Item>
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
                summary: `${algo} public key${bits ? ` (${bits} bits)` : ""}`,
                detail: (
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label="Algorithm">{algo}</Descriptions.Item>
                        {bits > 0 && (
                            <Descriptions.Item label="Key Size">{bits} bits</Descriptions.Item>
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
            summary: `${der.length} bytes raw DER (unrecognised label)`,
            detail: (
                <Text type="secondary">
                    Block decoded but parser does not have a specific handler for label &quot;{label}&quot;.
                    Length: {der.length} bytes.
                </Text>
            ),
        };
    } catch (e) {
        return {
            label,
            body,
            valid: false,
            summary: e instanceof Error ? e.message : "Failed to parse",
            detail: <Text type="danger">{e instanceof Error ? e.message : String(e)}</Text>,
        };
    }
}

function PemParserTab({ input }: { input: string }) {
    const { message } = App.useApp();
    const [blocks, setBlocks] = useState<ParsedBlock[]>([]);
    const [loading, setLoading] = useState(false);

    const parse = useCallback(async () => {
        if (!input.trim()) {
            message.warning("Paste PEM data in the input area above");
            return;
        }
        setLoading(true);
        try {
            const found = listPemBlocks(input);
            if (found.length === 0) {
                message.error("No PEM blocks found in input");
                setBlocks([]);
                return;
            }
            const parsed = await Promise.all(
                found.map((b) => parseSingleBlock(b.label, b.body))
            );
            setBlocks(parsed);
            message.success(`Parsed ${parsed.length} block${parsed.length === 1 ? "" : "s"}`);
        } finally {
            setLoading(false);
        }
    }, [input, message]);

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <div>
                <Button type="primary" icon={<EyeOutlined />} loading={loading} onClick={parse}>
                    Parse PEM Blocks
                </Button>
            </div>

            {blocks.length === 0 ? (
                <Card size="small">
                    <Empty description="Parse PEM to see all blocks" />
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
            message.warning("Enter a hostname or URL");
            return;
        }
        const { host, port } = extractHostAndPort(urlInput);
        if (!host) {
            message.error("Could not parse hostname");
            return;
        }
        setFetchLoading(true);
        try {
            const res = await fetch(`/api/fetch-cert?host=${encodeURIComponent(host)}&port=${port}`);
            const data = await res.json() as { pems?: string[]; error?: string };
            if (!res.ok || data.error) {
                throw new Error(data.error ?? "Fetch failed");
            }
            if (!data.pems || data.pems.length === 0) {
                throw new Error("No certificates returned");
            }
            setInput(data.pems.join("\n\n"));
            message.success(`Fetched ${data.pems.length} certificate${data.pems.length === 1 ? "" : "s"} from ${host}`);
        } catch (e) {
            message.error(e instanceof Error ? e.message : "Failed to fetch certificate");
        } finally {
            setFetchLoading(false);
        }
    }, [urlInput, message]);

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
            title="Certificate Inspector"
            description="Decode, fingerprint, convert, and parse X.509 certificates"
            icon={<SearchOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs:
                    "A comprehensive X.509 certificate inspection suite. Decode certificate fields, compute fingerprints, convert between PEM/DER formats, and parse bundled PEM files — all in one place. Supports live URL fetching to inspect any server's certificate directly.",
                whyUse:
                    "Stop switching between openssl commands and online tools. Paste a cert or enter a URL and get fingerprints, decoded fields, format conversions, and PEM block analysis in seconds.",
                howToUse: [
                    "Paste a PEM/DER certificate or enter a URL to fetch live",
                    "Switch tabs for Decode, Fingerprints, Convert, or PEM Parser",
                    "Upload .crt/.cer/.der files directly",
                ],
                tips: [
                    "URL fetch retrieves the live certificate chain from the server",
                    "Fingerprints tab shows SHA-256 (recommended), SHA-1, and MD5",
                    "PEM Parser handles bundles with multiple certificates, keys, and CSRs",
                ],
                useCases: [
                    "Debugging TLS handshake errors",
                    "Computing fingerprints for SSL pinning",
                    "Converting PEM to DER for Java truststore",
                    "Inspecting certificate bundles",
                ],
                serverNotice: {
                    route: "fetch-cert",
                    purpose: "The 'Fetch from URL' button is the only feature that contacts a server. Browsers cannot open raw TLS sockets to a remote host, so the server opens a TLS connection on your behalf, captures the certificate chain, and returns the PEM blocks.",
                    sentFields: [
                        "Hostname (e.g. example.com)",
                        "Port number (default 443)",
                    ],
                    extra: (
                        <Typography.Paragraph style={{ fontSize: 12, marginBottom: 0 }}>
                            <Text strong>Local-only alternative:</Text> paste a PEM/DER cert or use the Upload button —
                            those paths run 100% in your browser and never touch the server.
                        </Typography.Paragraph>
                    ),
                },
            }}
        >
            {/* ── Shared Input Section ── */}
            <Card
                size="small"
                title="Certificate Input"
                style={{ marginBottom: 16 }}
                extra={
                    <Space size={4}>
                        <Upload
                            accept=".pem,.crt,.cer,.der,.txt"
                            beforeUpload={handleUpload}
                            showUploadList={false}
                        >
                            <Button size="small" icon={<UploadOutlined />}>
                                Upload
                            </Button>
                        </Upload>
                        <Button size="small" onClick={handleClear}>
                            Clear
                        </Button>
                    </Space>
                }
            >
                <TextArea
                    rows={10}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste PEM-encoded or base64-DER certificate (or multiple PEM blocks)"
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, marginBottom: 12 }}
                />

                {/* URL fetch row */}
                <div style={{ display: "flex", gap: 0 }}>
                    <Input
                        prefix={<GlobalOutlined style={{ color: "#8c8c8c" }} />}
                        placeholder="example.com or https://example.com"
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
                    >
                        Fetch
                    </Button>
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
                                <SafetyCertificateOutlined />
                                Decode
                            </Space>
                        ),
                        children: <DecodeTab input={input} />,
                    },
                    {
                        key: "fingerprint",
                        label: (
                            <Space size={4}>
                                <SearchOutlined />
                                Fingerprints
                            </Space>
                        ),
                        children: <FingerprintTab input={input} />,
                    },
                    {
                        key: "convert",
                        label: (
                            <Space size={4}>
                                <SwapOutlined />
                                Convert
                            </Space>
                        ),
                        children: <ConvertTab input={input} />,
                    },
                    {
                        key: "pem-parser",
                        label: (
                            <Space size={4}>
                                <EyeOutlined />
                                PEM Parser
                            </Space>
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

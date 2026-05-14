"use client";

import React, { useState, useEffect } from "react";
import { Card, Tabs, Input, Button, Space, App, Upload, Alert, Typography, Tag, Descriptions } from "antd";
import {
    LockOutlined,
    UploadOutlined,
    DownloadOutlined,
    KeyOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import {
    readPkcs12,
    createPkcs12,
    formatDN,
    downloadBytes,
    type Pkcs12Bundle,
} from "@/lib/cert-utils";

const { TextArea } = Input;
const { Text } = Typography;

export default function Pkcs12Page() {
    return (
        <ToolPageLayout
            title="PKCS#12 / PFX Tool"
            description="Read, create and convert PKCS#12 (.pfx / .p12) keystores"
            icon={<LockOutlined style={{ fontSize: 24, color: "#f5222d" }} />}
            color="#f5222d"
            learnMore={{
                whatIs:
                    "PKCS#12 (.pfx / .p12) is a password-protected binary keystore that bundles a certificate, its private key, and any intermediate CA certs into a single file. It's the standard format for distributing TLS server identities to Windows IIS, Java applications (after conversion to JKS), and many cloud platforms.",
                whyUse:
                    "Generate a .p12 from PEM files, extract the private key + certs from a customer-supplied .p12, or inspect what's inside one before deploying. All processing happens locally in your browser — passwords never leave your machine.",
                howToUse: [
                    "Read tab: upload a .p12/.pfx, enter password, see all bundled certs and keys",
                    "Create tab: paste a certificate PEM and private key PEM, set a password, download the .p12",
                ],
                tips: [
                    "PKCS#12 supports SHA1, 3DES, AES — node-forge uses 3DES for max compatibility",
                    "Lost the password? It cannot be recovered — start over with a new keystore",
                    "Java's keytool reads modern .p12 files since Java 9",
                ],
                useCases: [
                    "Importing a TLS cert into Windows IIS",
                    "Splitting a vendor-supplied .pfx into separate .crt and .key files",
                    "Creating a portable client-auth keystore",
                ],
            }}
        >
            <Tabs
                size="large"
                items={[
                    { key: "read", label: "Read PKCS#12", children: <ReadPkcs12 /> },
                    { key: "create", label: "Create PKCS#12", children: <CreatePkcs12 /> },
                ]}
            />
        </ToolPageLayout>
    );
}

function ReadPkcs12() {
    const { message } = App.useApp();
    const [mounted, setMounted] = useState(false);
    const [bytes, setBytes] = useState<Uint8Array | null>(null);
    const [filename, setFilename] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => { setMounted(true); }, []);
    const [loading, setLoading] = useState(false);
    const [bundle, setBundle] = useState<Pkcs12Bundle | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const buf = e.target?.result as ArrayBuffer;
            setBytes(new Uint8Array(buf));
            setFilename(file.name);
            setBundle(null);
            setError(null);
        };
        reader.readAsArrayBuffer(file);
        return false;
    };

    const handleRead = async () => {
        if (!bytes) {
            message.warning("Upload a .p12 / .pfx file first");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const result = await readPkcs12(bytes, password);
            setBundle(result);
            message.success("PKCS#12 unlocked");
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to read keystore";
            setError(msg.includes("MAC") || msg.toLowerCase().includes("password") ? "Wrong password" : msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                <Upload accept=".p12,.pfx" beforeUpload={handleUpload} showUploadList={false} maxCount={1}>
                    <Button icon={<UploadOutlined />} size="large">{filename || "Upload .p12 or .pfx"}</Button>
                </Upload>
                {mounted && (
                    <Input.Password
                        placeholder="Keystore password (empty if none)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                )}
                <Button type="primary" icon={<LockOutlined />} onClick={handleRead} loading={loading} disabled={!bytes}>
                    Unlock & Inspect
                </Button>
                {error && <Alert type="error" message={error} showIcon />}
                {bundle && <Pkcs12Result bundle={bundle} />}
            </Space>
        </Card>
    );
}

function Pkcs12Result({ bundle }: { bundle: Pkcs12Bundle }) {
    const { message } = App.useApp();
    const copy = (text: string, label: string) => { copyToClipboard(text, label); message.success(label); };

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <Alert
                type="success"
                message={
                    <Space wrap>
                        {bundle.certificate ? <Tag icon={<SafetyCertificateOutlined />} color="success">Cert: {bundle.certificate.subject.CN ?? "?"}</Tag> : null}
                        {bundle.privateKeyPem && <Tag icon={<KeyOutlined />} color="processing">Private key</Tag>}
                        <Tag color="default">Chain: {bundle.chain.length} cert{bundle.chain.length === 1 ? "" : "s"}</Tag>
                        {bundle.friendlyName && <Tag>Friendly: {bundle.friendlyName}</Tag>}
                    </Space>
                }
            />
            {bundle.certificate && (
                <Card size="small" title="Leaf Certificate">
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label="Subject">{formatDN(bundle.certificate.subject)}</Descriptions.Item>
                        <Descriptions.Item label="Issuer">{formatDN(bundle.certificate.issuer)}</Descriptions.Item>
                        <Descriptions.Item label="Valid From">{bundle.certificate.notBefore.toUTCString()}</Descriptions.Item>
                        <Descriptions.Item label="Valid Until">{bundle.certificate.notAfter.toUTCString()}</Descriptions.Item>
                        <Descriptions.Item label="Public Key">{bundle.certificate.publicKeyAlgorithm} {bundle.certificate.publicKeySize} bits</Descriptions.Item>
                        <Descriptions.Item label="SHA-256 Fingerprint">
                            <Text code style={{ fontSize: 10, wordBreak: "break-all" }}>{bundle.certificate.fingerprintSha256}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                    <div style={{ marginTop: 12 }}>
                        <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadBytes(new TextEncoder().encode(bundle.certificate!.pem), `${bundle.certificate!.subject.CN ?? "cert"}.pem`, "application/x-pem-file")}>
                            Download cert PEM
                        </Button>
                    </div>
                </Card>
            )}
            {bundle.privateKeyPem && (
                <Card size="small" title="Private Key" extra={<Tag color="warning">⚠ keep secret</Tag>}>
                    <TextArea rows={6} value={bundle.privateKeyPem} readOnly style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }} />
                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <Button size="small" onClick={() => copy(bundle.privateKeyPem!, "Private key copied")}>Copy</Button>
                        <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadBytes(new TextEncoder().encode(bundle.privateKeyPem!), "private.key", "application/x-pem-file")}>Download .key</Button>
                    </div>
                </Card>
            )}
            {bundle.chain.length > 0 && (
                <Card size="small" title={`Chain (${bundle.chain.length})`}>
                    {bundle.chain.map((c, i) => (
                        <div key={i} style={{ marginBottom: 8, padding: 8, background: "rgba(0,0,0,0.04)", borderRadius: 6 }}>
                            <Text strong>{c.subject.CN ?? `Chain cert #${i + 1}`}</Text> — issued by {c.issuer.CN ?? "?"}
                        </div>
                    ))}
                </Card>
            )}
        </Space>
    );
}

function CreatePkcs12() {
    const { message } = App.useApp();
    const [certPem, setCertPem] = useState("");
    const [keyPem, setKeyPem] = useState("");
    const [chainPem, setChainPem] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("mydevtools");
    const [loading, setLoading] = useState(false);

    const handleCreate = () => {
        if (!certPem.trim() || !keyPem.trim()) {
            message.warning("Provide both a certificate and a private key");
            return;
        }
        if (!password) {
            message.warning("Set a keystore password");
            return;
        }
        setLoading(true);
        try {
            const chainPems = chainPem.trim()
                ? chainPem.split(/(?=-----BEGIN)/g).map((s) => s.trim()).filter(Boolean)
                : [];
            const bytes = createPkcs12({
                certificatePem: certPem,
                privateKeyPem: keyPem,
                chainPems,
                password,
                friendlyName: name,
            });
            downloadBytes(bytes, `${name}.p12`, "application/x-pkcs12");
            message.success(`Generated ${name}.p12`);
        } catch (e) {
            message.error(e instanceof Error ? e.message : "Failed to create PKCS#12");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                <div className="tool-split-pane" style={{ gap: 16 }}>
                    <div>
                        <Text strong>Certificate (PEM)</Text>
                        <TextArea
                            rows={8}
                            value={certPem}
                            onChange={(e) => setCertPem(e.target.value)}
                            placeholder="-----BEGIN CERTIFICATE-----…"
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, marginTop: 4 }}
                        />
                    </div>
                    <div>
                        <Text strong>Private Key (PEM)</Text>
                        <TextArea
                            rows={8}
                            value={keyPem}
                            onChange={(e) => setKeyPem(e.target.value)}
                            placeholder="-----BEGIN RSA PRIVATE KEY----- (or PRIVATE KEY)"
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, marginTop: 4 }}
                        />
                    </div>
                </div>
                <div>
                    <Text strong>Chain Certificates (optional, PEM, can be multiple concatenated)</Text>
                    <TextArea
                        rows={4}
                        value={chainPem}
                        onChange={(e) => setChainPem(e.target.value)}
                        placeholder="Intermediate CAs and root CA, in order"
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, marginTop: 4 }}
                    />
                </div>
                <div className="tool-split-pane" style={{ gap: 16 }}>
                    <div>
                        <Text strong>Friendly Name</Text>
                        <Input value={name} onChange={(e) => setName(e.target.value)} style={{ marginTop: 4 }} />
                    </div>
                    <div>
                        <Text strong>Password</Text>
                        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Keystore password" style={{ marginTop: 4 }} />
                    </div>
                </div>
                <Button type="primary" size="large" icon={<DownloadOutlined />} onClick={handleCreate} loading={loading}>
                    Create & Download .p12
                </Button>
            </Space>
        </Card>
    );
}

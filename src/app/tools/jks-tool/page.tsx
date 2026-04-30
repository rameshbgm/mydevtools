"use client";

import React, { useState } from "react";
import { Card, Input, Button, Space, App, Alert, Tabs, Typography, Tag, Upload } from "antd";
import { DatabaseOutlined, UploadOutlined, CopyOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import forge from "node-forge";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

export default function JksToolPage() {
    return (
        <ToolPageLayout
            title="Java KeyStore (JKS) Tool"
            description="Convert between JKS and PKCS#12, generate keytool commands"
            icon={<DatabaseOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs:
                    "JKS (Java KeyStore) is a proprietary keystore format from Sun/Oracle. JCEKS is its slightly stronger variant. Since Java 9, the default keystore is the more standard PKCS#12 (.p12). JKS is still encountered in legacy enterprise Java apps, Tomcat configs, and older Spring/JBoss deployments.",
                whyUse:
                    "JKS is a Java-only binary format that requires the JVM (or a Java-compatible decoder) to read. Browsers can't natively parse JKS — but they CAN create PKCS#12 files which Java can convert. This tool generates the exact keytool commands you need, AND lets you produce a PKCS#12 to feed into them.",
                howToUse: [
                    "Convert tab: paste cert + key PEMs, generate a .p12, then use the keytool command shown to convert to .jks",
                    "Inspect tab: paste PEM input — see information and exact keytool commands",
                ],
                tips: [
                    "Modern Java (≥9) reads .p12 keystores natively — JKS is rarely needed",
                    "JCEKS uses stronger crypto than JKS but is still proprietary",
                    "Always include the -storetype JKS flag to avoid ambiguity",
                ],
                useCases: [
                    "Migrating a legacy Tomcat keystore to PKCS#12",
                    "Setting up a Spring Boot SSL keystore",
                    "Generating keytool import/export commands without Googling",
                ],
            }}
        >
            <Alert
                type="info"
                showIcon
                message="JKS parsing requires Java"
                description={
                    <span>
                        JKS is a proprietary Java format that cannot be safely parsed in a browser. This tool helps you{" "}
                        <Text strong>create a PKCS#12 file from PEM</Text> (which Java understands), then{" "}
                        <Text strong>generates the exact keytool commands</Text> to convert it to JKS.
                    </span>
                }
                style={{ marginBottom: 16 }}
            />

            <Tabs
                size="large"
                items={[
                    { key: "convert", label: "Convert PEM → JKS", children: <ConvertTab /> },
                    { key: "commands", label: "keytool Commands", children: <CommandsTab /> },
                ]}
            />
        </ToolPageLayout>
    );
}

function ConvertTab() {
    const { message } = App.useApp();
    const [certPem, setCertPem] = useState("");
    const [keyPem, setKeyPem] = useState("");
    const [chainPem, setChainPem] = useState("");
    const [password, setPassword] = useState("");
    const [alias, setAlias] = useState("mykey");
    const [loading, setLoading] = useState(false);

    const buildAndDownload = () => {
        if (!certPem.trim() || !keyPem.trim()) {
            message.warning("Provide both certificate and private key (PEM)");
            return;
        }
        if (!password) {
            message.warning("Set a keystore password");
            return;
        }
        setLoading(true);
        try {
            const cert = forge.pki.certificateFromPem(certPem);
            const key = forge.pki.privateKeyFromPem(keyPem);
            const chain = chainPem.trim()
                ? chainPem.split(/(?=-----BEGIN)/g).map((s) => s.trim()).filter(Boolean).map((p) => forge.pki.certificateFromPem(p))
                : [];
            const p12Asn1 = forge.pkcs12.toPkcs12Asn1(key, [cert, ...chain], password, {
                friendlyName: alias,
                algorithm: "3des",
            });
            const der = forge.asn1.toDer(p12Asn1).getBytes();
            const bytes = new Uint8Array(forge.util.binary.raw.decode(der));
            const blob = new Blob([new Uint8Array(bytes)], { type: "application/x-pkcs12" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${alias}.p12`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            message.success("Downloaded .p12 — now run the keytool command below");
        } catch (e) {
            message.error(e instanceof Error ? e.message : "Failed to build keystore");
        } finally {
            setLoading(false);
        }
    };

    const keytoolCmd = `# After downloading ${alias}.p12, run:
keytool -importkeystore \\
    -srckeystore ${alias}.p12 \\
    -srcstoretype PKCS12 \\
    -srcstorepass '${password || "<your-password>"}' \\
    -destkeystore ${alias}.jks \\
    -deststoretype JKS \\
    -deststorepass '${password || "<your-password>"}' \\
    -alias ${alias}`;

    return (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Card size="small" title="Step 1: Provide PEM inputs">
                <div className="tool-split-pane" style={{ gap: 16 }}>
                    <div>
                        <Text strong>Certificate (PEM)</Text>
                        <TextArea rows={6} value={certPem} onChange={(e) => setCertPem(e.target.value)} placeholder="-----BEGIN CERTIFICATE-----…" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, marginTop: 4 }} />
                    </div>
                    <div>
                        <Text strong>Private Key (PEM)</Text>
                        <TextArea rows={6} value={keyPem} onChange={(e) => setKeyPem(e.target.value)} placeholder="-----BEGIN RSA PRIVATE KEY-----…" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, marginTop: 4 }} />
                    </div>
                </div>
                <div style={{ marginTop: 12 }}>
                    <Text strong>Chain certificates (optional)</Text>
                    <TextArea rows={3} value={chainPem} onChange={(e) => setChainPem(e.target.value)} placeholder="Concatenated intermediate CAs and root" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, marginTop: 4 }} />
                </div>
                <div className="tool-split-pane" style={{ gap: 16, marginTop: 12 }}>
                    <div>
                        <Text strong>Alias</Text>
                        <Input value={alias} onChange={(e) => setAlias(e.target.value)} style={{ marginTop: 4 }} />
                    </div>
                    <div>
                        <Text strong>Password</Text>
                        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginTop: 4 }} />
                    </div>
                </div>
            </Card>

            <Card size="small" title="Step 2: Generate PKCS#12">
                <Button type="primary" size="large" loading={loading} onClick={buildAndDownload}>
                    Download {alias}.p12
                </Button>
            </Card>

            <Card
                size="small"
                title="Step 3: Convert to JKS with keytool"
                extra={<Button size="small" icon={<CopyOutlined />} onClick={() => { copyToClipboard(keytoolCmd, "Command copied"); message.success("Copied"); }}>Copy</Button>}
            >
                <pre style={{ background: "rgba(0,0,0,0.04)", padding: 12, borderRadius: 6, fontSize: 12, overflowX: "auto" }}>{keytoolCmd}</pre>
                <Tag color="warning">Requires Java JDK with keytool installed</Tag>
            </Card>
        </Space>
    );
}

function CommandsTab() {
    const { message } = App.useApp();
    const [keystore, setKeystore] = useState("server.jks");
    const [alias, setAlias] = useState("server");

    const cmds: { title: string; cmd: string; note?: string }[] = [
        {
            title: "List all entries",
            cmd: `keytool -list -keystore ${keystore} -storepass <password>`,
        },
        {
            title: "List with details (-v)",
            cmd: `keytool -list -v -keystore ${keystore} -storepass <password>`,
        },
        {
            title: "Export a certificate",
            cmd: `keytool -export -keystore ${keystore} -alias ${alias} -file ${alias}.crt -storepass <password>`,
        },
        {
            title: "Import a trusted certificate",
            cmd: `keytool -import -keystore ${keystore} -alias ${alias} -file ${alias}.crt -storepass <password>`,
        },
        {
            title: "Generate a new keypair (self-signed)",
            cmd: `keytool -genkeypair -keystore ${keystore} -alias ${alias} -keyalg RSA -keysize 2048 -validity 365 -storepass <password> -dname "CN=${alias}, O=mydevtools, C=US"`,
        },
        {
            title: "Convert JKS → PKCS#12",
            cmd: `keytool -importkeystore -srckeystore ${keystore} -srcstoretype JKS -destkeystore ${alias}.p12 -deststoretype PKCS12 -srcstorepass <password> -deststorepass <password>`,
            note: "Use this to read your JKS in this site's PKCS#12 tool",
        },
        {
            title: "Change a keystore password",
            cmd: `keytool -storepasswd -keystore ${keystore} -storepass <old-password> -new <new-password>`,
        },
        {
            title: "Delete an entry",
            cmd: `keytool -delete -keystore ${keystore} -alias ${alias} -storepass <password>`,
        },
    ];

    return (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Card size="small">
                <div className="tool-split-pane" style={{ gap: 16 }}>
                    <div>
                        <Text strong>Keystore filename</Text>
                        <Input value={keystore} onChange={(e) => setKeystore(e.target.value)} style={{ marginTop: 4 }} />
                    </div>
                    <div>
                        <Text strong>Alias</Text>
                        <Input value={alias} onChange={(e) => setAlias(e.target.value)} style={{ marginTop: 4 }} />
                    </div>
                </div>
            </Card>
            {cmds.map((c, i) => (
                <Card
                    key={i}
                    size="small"
                    title={c.title}
                    extra={<Button size="small" icon={<CopyOutlined />} onClick={() => { copyToClipboard(c.cmd, "Command copied"); message.success("Copied"); }}>Copy</Button>}
                >
                    <pre style={{ background: "rgba(0,0,0,0.04)", padding: 10, borderRadius: 6, fontSize: 12, overflowX: "auto", margin: 0 }}>{c.cmd}</pre>
                    {c.note && <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0, fontSize: 12 }}>{c.note}</Paragraph>}
                </Card>
            ))}
        </Space>
    );
}

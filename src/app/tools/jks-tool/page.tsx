"use client";

import React, { useState } from "react";
import { Card, Input, Button, Space, App, Alert, Tabs, Typography, Tag } from "antd";
import { DatabaseOutlined, CopyOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadBytes } from "@/lib/download";
import forge from "node-forge";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

// Every user-controlled value is one literal POSIX shell argument. Commands are
// only displayed/copied; keytool prompts interactively for passwords.
function shellArgument(value: string): string {
    return "'" + value.replace(/'/g, "'\\''") + "'";
}

export default function JksToolPage() {
    const { t } = useLanguage();
    return (
        <ToolPageLayout
            title={t("Java KeyStore (JKS) Tool")}
            description={t("Build PKCS#12 from PEM and prepare Java keytool commands for JKS")}
            icon={<DatabaseOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs:
                    "JKS is a Java keystore format used by legacy applications. Java 9 and newer use PKCS#12 as the default keystore format.",
                whyUse:
                    "This page builds a PKCS#12 file from PEM certificates and an RSA private key. It prepares keytool commands for you to run with Java; it does not read, inspect, or create native JKS files in this browser.",
                howToUse: [
                    "Convert tab: paste cert + key PEMs, generate a .p12, then use the keytool command shown to convert to .jks",
                    "Commands tab: enter a keystore filename and alias to prepare keytool commands",
                ],
                tips: [
                    "Modern Java (≥9) reads .p12 keystores natively — JKS is rarely needed",
                    "Review commands before running them. Generated commands are not executed by this tool.",
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
                title={t("Native JKS conversion requires Java")}
                description={
                    <span>{t("Build PKCS#12 from PEM here, then run the prepared keytool commands with Java to convert it to JKS. Native JKS files are not parsed in this browser.")}</span>
                }
                style={{ marginBottom: 16 }}
            />

            <Tabs
                size="large"
                items={[
                    { key: "convert", label: t("PEM → PKCS#12 + keytool"), children: <ConvertTab /> },
                    { key: "commands", label: t("keytool Commands"), children: <CommandsTab /> },
                ]}
            />
        </ToolPageLayout>
    );
}

function ConvertTab() {
    const { t } = useLanguage();
    const { message } = App.useApp();
    const [certPem, setCertPem] = useState("");
    const [keyPem, setKeyPem] = useState("");
    const [chainPem, setChainPem] = useState("");
    const [password, setPassword] = useState("");
    const [alias, setAlias] = useState("mykey");
    const [loading, setLoading] = useState(false);

    const buildAndDownload = () => {
        if (!certPem.trim() || !keyPem.trim()) {
            message.warning(t("Provide both certificate and private key (PEM)"));
            return;
        }
        if (!password) {
            message.warning(t("Set a keystore password"));
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
            downloadBytes(bytes, `${alias}.p12`, "application/x-pkcs12");
            message.success(t("PKCS#12 download prepared — review the keytool command below"));
        } catch (e) {
            message.error(e instanceof Error ? e.message : t("Failed to build keystore"));
        } finally {
            setLoading(false);
        }
    };

    const keytoolCmd = `# Run after downloading the PKCS#12 file. Enter passwords when keytool prompts.
keytool -importkeystore -srckeystore ${shellArgument(`${alias}.p12`)} -srcstoretype PKCS12 -destkeystore ${shellArgument(`${alias}.jks`)} -deststoretype JKS -alias ${shellArgument(alias)}`;

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <Card size="small" title={t("Step 1: Provide PEM certificates and RSA key")}>
                <div className="tool-split-pane" style={{ gap: 16 }}>
                    <div>
                        <Text strong>{t("Certificate (PEM)")}</Text>
                        <TextArea dir="ltr" rows={6} value={certPem} onChange={(e) => setCertPem(e.target.value)} placeholder="-----BEGIN CERTIFICATE-----…" style={{ direction: "ltr", textAlign: "left", fontFamily: "var(--font-geist-mono)", fontSize: 16, marginTop: 4 }} />
                    </div>
                    <div>
                        <Text strong>{t("Private Key (PEM)")}</Text>
                        <TextArea dir="ltr" rows={6} value={keyPem} onChange={(e) => setKeyPem(e.target.value)} placeholder="-----BEGIN RSA PRIVATE KEY-----…" style={{ direction: "ltr", textAlign: "left", fontFamily: "var(--font-geist-mono)", fontSize: 16, marginTop: 4 }} />
                    </div>
                </div>
                <div style={{ marginTop: 12 }}>
                    <Text strong>{t("Chain certificates (optional)")}</Text>
                    <TextArea dir="ltr" rows={3} value={chainPem} onChange={(e) => setChainPem(e.target.value)} placeholder={t("Concatenated intermediate CAs and root")} style={{ direction: "ltr", textAlign: "left", fontFamily: "var(--font-geist-mono)", fontSize: 16, marginTop: 4 }} />
                </div>
                <div className="tool-split-pane" style={{ gap: 16, marginTop: 12 }}>
                    <div>
                        <Text strong>{t("Alias")}</Text>
                        <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }} value={alias} onChange={(e) => setAlias(e.target.value)} style={{ marginTop: 4 }} />
                    </div>
                    <div>
                        <Text strong>{t("Password")}</Text>
                        <Input.Password dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }} value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginTop: 4 }} />
                    </div>
                </div>
            </Card>

            <Card size="small" title={t("Step 2: Generate PKCS#12")}>
                <Button type="primary" size="large" loading={loading} onClick={buildAndDownload}>
                    {t("Download {filename}", { filename: `${alias}.p12` })}
                </Button>
            </Card>

            <Card
                size="small"
                title={t("Step 3: Convert to JKS with keytool")}
                extra={<Button size="small" icon={<CopyOutlined />} onClick={() => { copyToClipboard(keytoolCmd, t("Command copied")); message.success(t("Copied")); }}>{t("Copy")}</Button>}
            >
                <pre dir="ltr" style={{ background: "var(--signal-inset)", padding: 12, borderRadius: 6, fontSize: 12, overflowX: "auto" }}>{keytoolCmd}</pre>
                <Tag color="warning">{t("Requires Java JDK with keytool installed")}</Tag><Paragraph>{t("Commands use POSIX shell quoting and interactive password prompts. Review them before running in a compatible terminal; this page never executes them.")}</Paragraph>
            </Card>
        </Space>
    );
}

function CommandsTab() {
    const { t } = useLanguage();
    const { message } = App.useApp();
    const [keystore, setKeystore] = useState("server.jks");
    const [alias, setAlias] = useState("server");

    const cmds: { title: string; cmd: string; note?: string }[] = [
        {
            title: "List all entries",
            cmd: `keytool -list -keystore ${shellArgument(keystore)}`,
        },
        {
            title: "List with details (-v)",
            cmd: `keytool -list -v -keystore ${shellArgument(keystore)}`,
        },
        {
            title: "Export a certificate",
            cmd: `keytool -export -keystore ${shellArgument(keystore)} -alias ${shellArgument(alias)} -file ${shellArgument(`${alias}.crt`)}`,
        },
        {
            title: "Import a trusted certificate",
            cmd: `keytool -import -keystore ${shellArgument(keystore)} -alias ${shellArgument(alias)} -file ${shellArgument(`${alias}.crt`)}`,
        },
        {
            title: "Generate a new keypair (self-signed)",
            cmd: `keytool -genkeypair -keystore ${shellArgument(keystore)} -alias ${shellArgument(alias)} -keyalg RSA -keysize 2048 -validity 365 -dname ${shellArgument(`CN=${alias}, O=mydevtools, C=US`)}`,
        },
        {
            title: "Convert JKS → PKCS#12",
            cmd: `keytool -importkeystore -srckeystore ${shellArgument(keystore)} -srcstoretype JKS -destkeystore ${shellArgument(`${alias}.p12`)} -deststoretype PKCS12`,
            note: "Use this to read your JKS in this site's PKCS#12 tool",
        },
        {
            title: "Change a keystore password",
            cmd: `keytool -storepasswd -keystore ${shellArgument(keystore)}`,
        },
        {
            title: "Delete an entry",
            cmd: `keytool -delete -keystore ${shellArgument(keystore)} -alias ${shellArgument(alias)}`,
        },
    ];

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <Card size="small">
                <Paragraph>{t("Commands use POSIX shell quoting and interactive password prompts. Review them before running in a compatible terminal; this page never executes them.")}</Paragraph>
                <div className="tool-split-pane" style={{ gap: 16 }}>
                    <div>
                        <Text strong>{t("Keystore filename")}</Text>
                        <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }} value={keystore} onChange={(e) => setKeystore(e.target.value)} style={{ marginTop: 4 }} />
                    </div>
                    <div>
                        <Text strong>{t("Alias")}</Text>
                        <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }} value={alias} onChange={(e) => setAlias(e.target.value)} style={{ marginTop: 4 }} />
                    </div>
                </div>
            </Card>
            {cmds.map((c, i) => (
                <Card
                    key={i}
                    size="small"
                    title={t(c.title)}
                    extra={<Button size="small" icon={<CopyOutlined />} onClick={() => { copyToClipboard(c.cmd, t("Command copied")); message.success(t("Copied")); }}>{t("Copy")}</Button>}
                >
                    <pre dir="ltr" style={{ background: "var(--signal-inset)", padding: 10, borderRadius: 6, fontSize: 12, overflowX: "auto", margin: 0 }}>{c.cmd}</pre>
                    {c.note && <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0, fontSize: 12 }}>{t(c.note)}</Paragraph>}
                </Card>
            ))}
        </Space>
    );
}

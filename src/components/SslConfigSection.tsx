"use client";

import React from "react";
import { Switch, Input, Typography, Space, Alert, Tooltip } from "antd";
import { SafetyCertificateOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";

const { Text } = Typography;
const { TextArea } = Input;

export interface SslConfig {
    sslVerify: boolean;        // when true, proxy uses rejectUnauthorized: true
    sslCaCert: string;         // PEM CA bundle
    sslClientCert: string;     // PEM client cert (mTLS)
    sslClientKey: string;      // PEM client key (mTLS)
}

export const DEFAULT_SSL_CONFIG: SslConfig = {
    sslVerify: true,
    sslCaCert: "",
    sslClientCert: "",
    sslClientKey: "",
};

/**
 * Build the SSL fields the /api/proxy route accepts. Returns only the keys
 * relevant to the request — empty PEM strings are dropped so the proxy does
 * not send empty `ca`/`cert`/`key` to https.request.
 */
export function buildSslProxyFields(cfg: SslConfig): Record<string, unknown> {
    const out: Record<string, unknown> = { sslVerify: cfg.sslVerify };
    if (cfg.sslCaCert.trim()) out.sslCaCert = cfg.sslCaCert;
    if (cfg.sslClientCert.trim()) out.sslClientCert = cfg.sslClientCert;
    if (cfg.sslClientKey.trim()) out.sslClientKey = cfg.sslClientKey;
    return out;
}

interface Props {
    value: SslConfig;
    onChange: (next: SslConfig) => void;
    /** Hide the explanatory alert (use a tighter layout where space is at a premium). */
    compact?: boolean;
}

export default function SslConfigSection({ value, onChange, compact }: Props) {
    const { t } = useLanguage();
    const update = (patch: Partial<SslConfig>) => onChange({ ...value, ...patch });

    return (
        <Space orientation="vertical" size={12} style={{ width: "100%" }}>
            {!compact && (
                <Alert
                    type="info"
                    showIcon
                    icon={<SafetyCertificateOutlined />}
                    title={t("SSL / TLS configuration")}
                    description={t("These options are applied when the request is made through the server proxy (i.e. when the browser cannot reach the host directly due to CORS or cert errors). They have no effect on direct browser fetches.")}
                    style={{ fontSize: 12 }}
                />
            )}

            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, padding: "8px 0",
            }}>
                <div>
                    <Text strong style={{ fontSize: 13 }}>{t("Verify SSL certificate")}</Text>
                    <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {t("On by default. Turn it off only for a deliberately trusted development endpoint with a self-signed or expired certificate.")}
                        </Text>
                    </div>
                </div>
                <Switch
                    aria-label={t("Verify SSL certificate")}
                    checked={value.sslVerify}
                    onChange={(v) => update({ sslVerify: v })}
                />
            </div>

            <div>
                <Text strong style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                    {t("Custom CA bundle (PEM)")}{" "}
                    <Tooltip title={t("Paste one or more BEGIN CERTIFICATE blocks. The proxy will trust these in addition to the system CA store.")}>
                        <InfoCircleOutlined aria-label={t("About custom CA bundles")} style={{ color: "#9a9a9a" }} />
                    </Tooltip>
                </Text>
                <TextArea
                    aria-label={t("Custom CA bundle (PEM)")}
                    dir="ltr"
                    value={value.sslCaCert}
                    onChange={(e) => update({ sslCaCert: e.target.value })}
                    placeholder="-----BEGIN CERTIFICATE-----&#10;…&#10;-----END CERTIFICATE-----"
                    rows={3}
                    style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11 }}
                />
            </div>

            <div>
                <Text strong style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                    {t("Client certificate (mTLS — PEM)")}
                </Text>
                <TextArea
                    aria-label={t("Client certificate (mTLS — PEM)")}
                    dir="ltr"
                    value={value.sslClientCert}
                    onChange={(e) => update({ sslClientCert: e.target.value })}
                    placeholder="-----BEGIN CERTIFICATE-----&#10;…&#10;-----END CERTIFICATE-----"
                    rows={3}
                    style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11 }}
                />
            </div>

            <div>
                <Text strong style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                    {t("Client private key (PEM)")}
                </Text>
                <TextArea
                    aria-label={t("Client private key (PEM)")}
                    dir="ltr"
                    value={value.sslClientKey}
                    onChange={(e) => update({ sslClientKey: e.target.value })}
                    placeholder="-----BEGIN PRIVATE KEY-----&#10;…&#10;-----END PRIVATE KEY-----"
                    rows={3}
                    style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11 }}
                />
                <Text type="secondary" style={{ fontSize: 11 }}>{t("The client private key is sensitive. When you send a proxied request, the configured certificate and key are sent to the proxy server. Use them only with a server you trust.")}</Text>
            </div>
        </Space>
    );
}

"use client";

import React from "react";
import { Alert, Typography, Space } from "antd";
import { CloudServerOutlined, GithubOutlined, DownOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";

const { Text, Paragraph } = Typography;

const REPO_BASE = "https://github.com/rameshbgm/mydevtools/blob/main";

export type ServerRouteId = "proxy" | "fetch-cert" | "proxy-stream" | "webhook";

interface Props {
    /** Which server route the tool calls — controls the source-code link. */
    route?: ServerRouteId;
    title?: string;
    handling?: string;
    sourceFiles?: string[];
    /** One-line summary of what the server does for this tool. */
    purpose: string;
    /** Bullet list of the exact data fields that leave the browser. */
    sentFields: string[];
    /** Optional disclosure for route-specific retention or operational limits. */
    extra?: React.ReactNode;
}

const ROUTE_FILE: Record<ServerRouteId, string> = {
    "proxy": "src/app/api/proxy/route.ts",
    "fetch-cert": "src/app/api/fetch-cert/route.ts",
    "proxy-stream": "src/app/api/proxy-stream/route.ts",
    "webhook": "src/app/api/webhook/[sessionId]/route.ts",
};

/**
 * Collapsed trust disclosure shown before network-capable tools. Callers can
 * describe direct requests, localhost connectors or external asset downloads;
 * legacy route-specific disclosures retain their exact fields and source link.
 */
export default function ServerProxyNotice({ route, purpose, sentFields, extra, title, handling, sourceFiles }: Props) {
    const { t } = useLanguage();
    const files = sourceFiles ?? (route ? [ROUTE_FILE[route]] : []);

    return (
        <Alert
            type="warning"
            showIcon
            icon={<CloudServerOutlined />}
            style={{ marginBottom: 16 }}
            className="wb-network-notice"
            title={
                <details>
                    <summary>
                        <Text strong>{t(title ?? "This action sends data to the server")}</Text>
                        <DownOutlined className="wb-network-notice-chevron" aria-hidden />
                    </summary>
                    <Space orientation="vertical" size={6} style={{ width: "100%" }}>
                        <Paragraph style={{ fontSize: 12, marginBottom: 0 }}>
                            <Text strong>{t("Why:")}</Text> {t(purpose)}
                        </Paragraph>

                        <div style={{ fontSize: 12 }}>
                            <Text strong>{t(sourceFiles ? "Data sent:" : "Sent to the server:")}</Text>
                            <ul style={{ marginBlock: "4px 0", marginInline: 0, paddingInlineStart: 18 }}>
                                {sentFields.map((f, i) => (
                                    <li key={i} style={{ fontSize: 12 }}>{t(f)}</li>
                                ))}
                            </ul>
                        </div>

                        <Paragraph style={{ fontSize: 12, marginBottom: 0 }}>
                            <Text strong>{t("Data handling:")}</Text>{" "}
                            {handling ? t(handling) : route === "webhook"
                                ? t("captured requests are stored in temporary process memory so this page can display them.")
                                : route === "fetch-cert"
                                    ? t("the server opens a TLS connection to the hostname and returns the certificate chain.")
                                    : t("the server relays this request to your target and returns its response; the target receives the fields above.")}
                        </Paragraph>

                        {extra}

                        {files.map((filePath) => (
                            <Paragraph key={filePath} style={{ fontSize: 12, marginBottom: 0 }}>
                                <GithubOutlined style={{ marginInlineEnd: 4 }} />
                                {t("Audit the source:")}{" "}
                                <a href={`${REPO_BASE}/${filePath}`} target="_blank" rel="noopener noreferrer">
                                    <bdi dir="ltr">{filePath}</bdi>
                                </a>
                            </Paragraph>
                        ))}
                    </Space>
                </details>
            }
        />
    );
}

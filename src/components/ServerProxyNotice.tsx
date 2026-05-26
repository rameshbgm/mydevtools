"use client";

import React from "react";
import { Alert, Typography, Space } from "antd";
import { CloudServerOutlined, GithubOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const REPO_BASE = "https://github.com/rameshbgm/mydevtools/blob/main";

export type ServerRouteId = "proxy" | "fetch-cert";

interface Props {
    /** Which server route the tool calls — controls the source-code link. */
    route: ServerRouteId;
    /** One-line summary of what the server does for this tool. */
    purpose: string;
    /** Bullet list of the exact data fields that leave the browser. */
    sentFields: string[];
    /** Optional override; defaults to the standard "no logs" line. */
    extra?: React.ReactNode;
}

const ROUTE_FILE: Record<ServerRouteId, string> = {
    "proxy": "src/app/api/proxy/route.ts",
    "fetch-cert": "src/app/api/fetch-cert/route.ts",
};

/**
 * Trust notice for tools whose features require a server-side route
 * (CORS bypass, raw TLS sockets) that cannot run in a browser.
 *
 * Renders a single warning Alert that explains: what is sent, why it is sent,
 * that nothing is logged, and links to the route source on GitHub for audit.
 */
export default function ServerProxyNotice({ route, purpose, sentFields, extra }: Props) {
    const filePath = ROUTE_FILE[route];
    const sourceUrl = `${REPO_BASE}/${filePath}`;

    return (
        <Alert
            type="warning"
            showIcon
            icon={<CloudServerOutlined />}
            style={{ marginBottom: 16 }}
            title={
                <Text strong style={{ fontSize: 13 }}>
                    This action sends data to the server
                </Text>
            }
            description={
                <Space orientation="vertical" size={6} style={{ width: "100%" }}>
                    <Paragraph style={{ fontSize: 12, marginBottom: 0 }}>
                        <Text strong>Why:</Text> {purpose}
                    </Paragraph>

                    <div style={{ fontSize: 12 }}>
                        <Text strong>Sent to the server:</Text>
                        <ul style={{ margin: "4px 0 0 18px", padding: 0 }}>
                            {sentFields.map((f, i) => (
                                <li key={i} style={{ fontSize: 12 }}>{f}</li>
                            ))}
                        </ul>
                    </div>

                    <Paragraph style={{ fontSize: 12, marginBottom: 0 }}>
                        <Text strong>Privacy:</Text> the server does not log, store, or forward any of this
                        data. The route forwards your request, returns the response, and discards everything.
                    </Paragraph>

                    {extra}

                    <Paragraph style={{ fontSize: 12, marginBottom: 0 }}>
                        <GithubOutlined style={{ marginRight: 4 }} />
                        Audit the source:{" "}
                        <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                            {filePath}
                        </a>
                    </Paragraph>
                </Space>
            }
        />
    );
}

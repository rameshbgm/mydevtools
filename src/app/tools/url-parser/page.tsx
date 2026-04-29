"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Table, Tag, Descriptions } from "antd";
import { GlobalOutlined, CopyOutlined, LinkOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;

interface ParsedURL {
    href: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    origin: string;
    username: string;
    password: string;
    queryParams: { key: string; value: string }[];
}

function parseURL(urlString: string): ParsedURL | null {
    try {
        const url = new URL(urlString);
        const queryParams: { key: string; value: string }[] = [];
        url.searchParams.forEach((value, key) => {
            queryParams.push({ key, value });
        });

        return {
            href: url.href,
            protocol: url.protocol,
            host: url.host,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
            origin: url.origin,
            username: url.username,
            password: url.password,
            queryParams,
        };
    } catch {
        return null;
    }
}

const SAMPLE_URLS = [
    "https://www.example.com:8080/path/to/page?name=John&age=30&city=NYC#section1",
    "https://user:pass@api.example.com/v1/users?limit=10&offset=0",
    "ftp://files.example.com/downloads/file.zip",
    "mailto:user@example.com?subject=Hello&body=World",
];

export default function UrlParserPage() {
    const [url, setUrl] = useState(SAMPLE_URLS[0]);

    const parsed = useMemo(() => parseURL(url), [url]);

    const copyValue = (value: string, label: string) => {
        navigator.clipboard.writeText(value);
        message.success(`${label} copied!`);
    };

    const buildUrl = () => {
        if (!parsed) return;

        const newUrl = new URL(parsed.origin);
        newUrl.pathname = parsed.pathname;
        newUrl.hash = parsed.hash;
        parsed.queryParams.forEach((p) => {
            newUrl.searchParams.set(p.key, p.value);
        });

        setUrl(newUrl.href);
    };

    return (
        <ToolPageLayout
            title="URL Parser"
            description="Parse and analyze URLs into components"
            icon={<GlobalOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "A URL parser breaks down URLs into their components: protocol, host, port, path, query parameters, and fragment. It helps you understand and manipulate URL structures.",
                whyUse: "URLs contain multiple parts that often need to be extracted or modified. This tool visualizes URL structure, making it easy to debug routing, query params, and link issues.",
                howToUse: [
                    "Paste a URL in the input field",
                    "View all parsed components (protocol, host, path, etc.)",
                    "See query parameters as key-value pairs",
                    "Copy individual components as needed"
                ],
                tips: [
                    "Query params start after ? and are separated by &",
                    "Fragment/hash (#) is client-side only",
                    "Default ports: HTTP=80, HTTPS=443",
                    "Use for debugging routing and API endpoints"
                ],
                useCases: [
                    "Debugging URL routing issues",
                    "Extracting query parameters from URLs",
                    "Understanding OAuth callback URLs",
                    "Validating URL formats"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Card>
                        <Input
                            size="large"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter URL to parse..."
                            prefix={<LinkOutlined />}
                            allowClear
                        />
                        <Space wrap style={{ marginTop: 12 }}>
                            <Text type="secondary">Examples:</Text>
                            {SAMPLE_URLS.map((sample, i) => (
                                <Button
                                    key={i}
                                    size="small"
                                    onClick={() => setUrl(sample)}
                                >
                                    {sample.split("/")[2]?.substring(0, 20) || sample.substring(0, 20)}...
                                </Button>
                            ))}
                        </Space>
                    </Card>
                </Col>

                {parsed ? (
                    <>
                        <Col xs={24} lg={12}>
                            <Card title="URL Components">
                                <Descriptions column={1} size="small" bordered>
                                    {[
                                        { label: "Full URL", value: parsed.href },
                                        { label: "Protocol", value: parsed.protocol },
                                        { label: "Origin", value: parsed.origin },
                                        { label: "Host", value: parsed.host },
                                        { label: "Hostname", value: parsed.hostname },
                                        { label: "Port", value: parsed.port || "(default)" },
                                        { label: "Pathname", value: parsed.pathname },
                                        { label: "Search", value: parsed.search || "(none)" },
                                        { label: "Hash", value: parsed.hash || "(none)" },
                                    ].map((item) => (
                                        <Descriptions.Item
                                            key={item.label}
                                            label={item.label}
                                            labelStyle={{ width: 100 }}
                                        >
                                            <Space>
                                                <Text code style={{ fontSize: 12, wordBreak: "break-all" }}>
                                                    {item.value}
                                                </Text>
                                                {item.value && item.value !== "(none)" && item.value !== "(default)" && (
                                                    <Button
                                                        size="small"
                                                        type="text"
                                                        icon={<CopyOutlined />}
                                                        onClick={() => copyValue(item.value, item.label)}
                                                    />
                                                )}
                                            </Space>
                                        </Descriptions.Item>
                                    ))}
                                    {parsed.username && (
                                        <Descriptions.Item label="Username">
                                            <Text code>{parsed.username}</Text>
                                        </Descriptions.Item>
                                    )}
                                    {parsed.password && (
                                        <Descriptions.Item label="Password">
                                            <Text code>{parsed.password}</Text>
                                        </Descriptions.Item>
                                    )}
                                </Descriptions>
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <Space>
                                        <span>Query Parameters</span>
                                        <Tag>{parsed.queryParams.length}</Tag>
                                    </Space>
                                }
                            >
                                {parsed.queryParams.length > 0 ? (
                                    <Table
                                        size="small"
                                        pagination={false}
                                        dataSource={parsed.queryParams.map((p, i) => ({ ...p, rowKey: i, paramKey: p.key }))}
                                        rowKey="rowKey"
                                        columns={[
                                            {
                                                title: "Key",
                                                dataIndex: "paramKey",
                                                render: (k: string) => <Text code>{k}</Text>,
                                            },
                                            {
                                                title: "Value",
                                                dataIndex: "value",
                                                render: (v: string) => <Text code style={{ wordBreak: "break-all" }}>{decodeURIComponent(v)}</Text>,
                                            },
                                            {
                                                title: "",
                                                width: 50,
                                                render: (_, record: { paramKey: string; value: string }) => (
                                                    <Button
                                                        size="small"
                                                        type="text"
                                                        icon={<CopyOutlined />}
                                                        onClick={() => copyValue(record.value, record.paramKey)}
                                                    />
                                                ),
                                            },
                                        ]}
                                    />
                                ) : (
                                    <Text type="secondary">No query parameters</Text>
                                )}
                            </Card>

                            <Card title="URL Structure" style={{ marginTop: 16 }}>
                                <div style={{ fontFamily: "monospace", fontSize: 12, overflowX: "auto" }}>
                                    <span style={{ color: "#722ed1" }}>{parsed.protocol}</span>
                                    <span style={{ color: "#8c8c8c" }}>//</span>
                                    {parsed.username && (
                                        <>
                                            <span style={{ color: "#fa541c" }}>{parsed.username}</span>
                                            {parsed.password && (
                                                <>
                                                    <span style={{ color: "#8c8c8c" }}>:</span>
                                                    <span style={{ color: "#fa541c" }}>{parsed.password}</span>
                                                </>
                                            )}
                                            <span style={{ color: "#8c8c8c" }}>@</span>
                                        </>
                                    )}
                                    <span style={{ color: "#1677ff" }}>{parsed.hostname}</span>
                                    {parsed.port && (
                                        <>
                                            <span style={{ color: "#8c8c8c" }}>:</span>
                                            <span style={{ color: "#faad14" }}>{parsed.port}</span>
                                        </>
                                    )}
                                    <span style={{ color: "#52c41a" }}>{parsed.pathname}</span>
                                    {parsed.search && <span style={{ color: "#eb2f96" }}>{parsed.search}</span>}
                                    {parsed.hash && <span style={{ color: "#13c2c2" }}>{parsed.hash}</span>}
                                </div>
                                <Space wrap style={{ marginTop: 12 }}>
                                    <Tag color="#722ed1">protocol</Tag>
                                    <Tag color="#1677ff">hostname</Tag>
                                    <Tag color="#faad14">port</Tag>
                                    <Tag color="#52c41a">pathname</Tag>
                                    <Tag color="#eb2f96">search</Tag>
                                    <Tag color="#13c2c2">hash</Tag>
                                </Space>
                            </Card>
                        </Col>
                    </>
                ) : url ? (
                    <Col xs={24}>
                        <Card>
                            <Text type="danger">Invalid URL. Please enter a valid URL.</Text>
                        </Card>
                    </Col>
                ) : null}
            </Row>
        </ToolPageLayout>
    );
}

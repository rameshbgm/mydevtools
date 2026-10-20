"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Table, Tag, Descriptions } from "antd";
import { GlobalOutlined, CopyOutlined, LinkOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text } = Typography;

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
    const { t } = useLanguage();
    const [url, setUrl] = useState(SAMPLE_URLS[0]);

    const parsed = useMemo(() => parseURL(url), [url]);

    const copyValue = (value: string) => copyToClipboard(value, t("Copied!"));



    return (
        <ToolPageLayout
            title={t("URL Parser")}
            description={t("Parse and analyze URLs into components")}
            icon={<GlobalOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: t("Inspect URL components using the browser WHATWG URL parser. Parsing happens locally and does not open the URL."),
                whyUse: t("Check encoded paths, credentials, duplicate query parameters and fragments while debugging links."),
                howToUse: [t("Paste an absolute URL, including its scheme."), t("Inspect components and query parameters. Duplicate keys stay in their original order."), t("Copy the normalized full URL or an individual component.")],
                tips: [t("Query values are decoded once by URLSearchParams. Fragments stay client-side; default ports are normalized."), t("Usernames, passwords and tokens remain visible in the input and results.")],
                useCases: [t("Inspect callback URLs, signed links and application deep links.")],
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Card>
                        <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                            size="large"
                            aria-label={t("URL to parse")} value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={t("Enter URL to parse...")}
                            prefix={<LinkOutlined />}
                            allowClear
                        />
                        <Space wrap style={{ marginTop: 12 }}>
                            <Text type="secondary">{t("Examples:")}</Text>
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
                            <Card title={t("URL Components")}>
                                <Descriptions column={1} size="small" bordered>
                                    {[
                                        { label: "Full URL", value: parsed.href },
                                        { label: "Protocol", value: parsed.protocol },
                                        { label: "Origin", value: parsed.origin },
                                        { label: "Host", value: parsed.host },
                                        { label: "Hostname", value: parsed.hostname },
                                        { label: "Port", value: parsed.port, empty: "(default)" },
                                        { label: "Pathname", value: parsed.pathname },
                                        { label: "Search", value: parsed.search, empty: "(none)" },
                                        { label: "Hash", value: parsed.hash, empty: "(none)" },
                                    ].map((item) => (
                                        <Descriptions.Item
                                            key={item.label}
                                            label={t(item.label)}
                                            styles={{ label: { width: 100 } }}
                                        >
                                            <Space>
                                                <Text dir="ltr" code style={{ fontSize: 16, wordBreak: "break-all" }}>
                                                    {item.value || (item.empty ? t(item.empty) : "")}
                                                </Text>
                                                {item.value && (
                                                    <Button aria-label={t("Copy")}
                                                        size="small"
                                                        type="text"
                                                        icon={<CopyOutlined />}
                                                        onClick={() => copyValue(item.value)}
                                                    />
                                                )}
                                            </Space>
                                        </Descriptions.Item>
                                    ))}
                                    {parsed.username && (
                                        <Descriptions.Item label={t("Username")}>
                                            <Text dir="ltr" code>{parsed.username}</Text>
                                        </Descriptions.Item>
                                    )}
                                    {parsed.password && (
                                        <Descriptions.Item label={t("Password")}>
                                            <Text dir="ltr" code>{parsed.password}</Text>
                                        </Descriptions.Item>
                                    )}
                                </Descriptions>
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <Space>
                                        <span>{t("Query Parameters")}</span>
                                        <Tag>{parsed.queryParams.length}</Tag>
                                    </Space>
                                }
                            >
                                {parsed.queryParams.length > 0 ? (
                                    <Table
                                        size="small"
                                        scroll={{ x: 460 }}
                                        pagination={false}
                                        dataSource={parsed.queryParams.map((p, i) => ({ ...p, rowKey: i, paramKey: p.key }))}
                                        rowKey="rowKey"
                                        columns={[
                                            {
                                                title: t("Key"),
                                                dataIndex: "paramKey",
                                                render: (k: string) => <Text dir="ltr" code>{k}</Text>,
                                            },
                                            {
                                                title: t("Value"),
                                                dataIndex: "value",
                                                render: (v: string) => <Text dir="ltr" code style={{ wordBreak: "break-all" }}>{v}</Text>,
                                            },
                                            {
                                                title: "",
                                                width: 50,
                                                render: (_, record: { paramKey: string; value: string }) => (
                                                    <Button aria-label={t("Copy")}
                                                        size="small"
                                                        type="text"
                                                        icon={<CopyOutlined />}
                                                        onClick={() => copyValue(record.value)}
                                                    />
                                                ),
                                            },
                                        ]}
                                    />
                                ) : (
                                    <Text type="secondary">{t("No query parameters")}</Text>
                                )}
                            </Card>

                            <Card title={t("URL Structure")} style={{ marginTop: 16 }}>
                                <div dir="ltr" style={{ fontFamily: "monospace", fontSize: 16, overflowX: "auto" }}>
                                    <span style={{ color: "#722ed1" }}>{parsed.protocol}</span>
                                    <span style={{ color: "#8c8c8c" }}>{ "//" }</span>
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
                            <Text type="danger">{t("Invalid URL. Please enter a valid URL.")}</Text>
                        </Card>
                    </Col>
                ) : null}
            </Row>
        </ToolPageLayout>
    );
}

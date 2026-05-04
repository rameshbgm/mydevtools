"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, Input, Space, Typography, Button, App } from "antd";
import { FieldTimeOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title } = Typography;

export default function TimestampConverterPage() {
    const { message } = App.useApp();
    const [timestamp, setTimestamp] = useState("");
    const [dateStr, setDateStr] = useState("");

    useEffect(() => {
        setTimestamp(String(Math.floor(Date.now() / 1000)));
        setDateStr(new Date().toISOString());
    }, []);

    const tsToDate = () => {
        const ts = parseInt(timestamp);
        if (isNaN(ts)) { message.error("Invalid timestamp"); return; }
        const ms = ts.toString().length <= 10 ? ts * 1000 : ts;
        setDateStr(new Date(ms).toISOString());
    };

    const dateToTs = () => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) { message.error("Invalid date"); return; }
        setTimestamp(Math.floor(d.getTime() / 1000).toString());
    };

    const now = useMemo(() => new Date(), []);
    const currentTs = Math.floor(now.getTime() / 1000);

    const copyCurrentTs = () => copyToClipboard(currentTs.toString(), "Timestamp copied!");
    const copyIso = () => copyToClipboard(now.toISOString(), "ISO date copied!");
    const copyLocal = () => copyToClipboard(now.toLocaleString(), "Local time copied!");

    return (
        <ToolPageLayout
            title="Timestamp Converter"
            description="Convert between Unix timestamps and human-readable dates"
            icon={<FieldTimeOutlined style={{ fontSize: 24, color: "#faad14" }} />}
            color="#faad14"
            learnMore={{
                whatIs: "A Unix timestamp is the number of seconds since January 1, 1970 (UTC). This tool converts between Unix timestamps (seconds/milliseconds) and human-readable date-time formats.",
                whyUse: "Timestamps are common in databases, APIs, and logs but aren't human-readable. This tool helps debug time-related issues by converting to readable dates with timezone support.",
                howToUse: [
                    "View the current Unix timestamp in real-time",
                    "Enter a timestamp to convert to a readable date",
                    "Enter a date/time to get its Unix timestamp",
                    "Copy timestamps in seconds or milliseconds"
                ],
                tips: [
                    "JavaScript uses milliseconds, Unix uses seconds",
                    "Timestamps are always UTC - local time depends on timezone",
                    "13-digit timestamps are milliseconds, 10-digit are seconds",
                    "Use for debugging API responses and log entries"
                ],
                useCases: [
                    "Debugging date/time issues in APIs",
                    "Converting log timestamps to readable format",
                    "Calculating time differences between events",
                    "Generating timestamps for database queries"
                ]
            }}
        >
            <Card size="small" title="Current Time" style={{ marginBottom: 16 }}>
                <Space size="large" wrap>
                    <div>
                        <Text type="secondary">Unix (seconds)</Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Title level={4} style={{ margin: 0 }}>{currentTs}</Title>
                            <Button size="small" icon={<CopyOutlined />} onClick={copyCurrentTs} />
                        </div>
                    </div>
                    <div>
                        <Text type="secondary">ISO 8601</Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Title level={4} style={{ margin: 0 }}>{now.toISOString()}</Title>
                            <Button size="small" icon={<CopyOutlined />} onClick={copyIso} />
                        </div>
                    </div>
                    <div>
                        <Text type="secondary">Local</Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Title level={4} style={{ margin: 0 }}>{now.toLocaleString()}</Title>
                            <Button size="small" icon={<CopyOutlined />} onClick={copyLocal} />
                        </div>
                    </div>
                </Space>
            </Card>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title="Timestamp → Date">
                    <Input
                        size="large"
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        placeholder="e.g. 1700000000"
                        style={{ fontFamily: "var(--font-geist-mono)", marginBottom: 8 }}
                        suffix={<Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard(timestamp)} />}
                    />
                    <Button type="primary" onClick={tsToDate} block>Convert to Date</Button>
                </Card>
                <Card size="small" title="Date → Timestamp">
                    <Input
                        size="large"
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        placeholder="e.g. 2024-01-01T00:00:00Z"
                        style={{ fontFamily: "var(--font-geist-mono)", marginBottom: 8 }}
                        suffix={<Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard(dateStr)} />}
                    />
                    <Button type="primary" onClick={dateToTs} block>Convert to Timestamp</Button>
                </Card>
            </div>
        </ToolPageLayout>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { Card, Input, Space, Typography, Button, App } from "antd";
import { FieldTimeOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title } = Typography;

export default function TimestampConverterPage() {
    const { t, language } = useLanguage();
    const { message } = App.useApp();
    const [timestamp, setTimestamp] = useState("");
    const [dateStr, setDateStr] = useState("");
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        const captured = new Date();
        setNow(captured);
        setTimestamp(String(Math.floor(captured.getTime() / 1000)));
        setDateStr(captured.toISOString());
    }, []);

    const tsToDate = () => {
        const text = timestamp.trim();
        const ts = Number(text);
        if (!/^[+-]?\d+$/.test(text) || !Number.isSafeInteger(ts)) {
            message.error(t("Enter a whole-number timestamp within the supported date range.")); return;
        }
        const ms = Math.abs(ts).toString().length <= 10 ? ts * 1000 : ts;
        const date = new Date(ms);
        if (isNaN(date.getTime())) {
            message.error(t("Enter a whole-number timestamp within the supported date range.")); return;
        }
        setDateStr(date.toISOString());
    };

    const dateToTs = () => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) { message.error(t("Invalid date")); return; }
        setTimestamp(Math.floor(d.getTime() / 1000).toString());
    };

    const currentTs = now ? Math.floor(now.getTime() / 1000) : null;

    const copyCurrentTs = () => currentTs !== null && copyToClipboard(currentTs.toString(), t("Timestamp copied!"));
    const copyIso = () => now && copyToClipboard(now.toISOString(), t("ISO date copied!"));
    const copyLocal = () => now && copyToClipboard(now.toLocaleString(language), t("Local time copied!"));

    return (
        <ToolPageLayout
            title={t("Timestamp Converter")}
            description={t("Convert between Unix timestamps and human-readable dates")}
            icon={<FieldTimeOutlined style={{ fontSize: 24, color: "#faad14" }} />}
            color="#faad14"
            learnMore={{
                whatIs: "A Unix timestamp is the number of seconds since January 1, 1970 (UTC). This tool converts between Unix timestamps (seconds/milliseconds) and human-readable date-time formats.",
                whyUse: "Timestamps are common in databases, APIs, and logs but aren't human-readable. This tool helps debug time-related issues by converting to readable dates with timezone support.",
                howToUse: [
                    "View the time captured when this tool opened",
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
            <Card size="small" title={t("Current Time")} style={{ marginBottom: 16 }}>
                <Space size="large" wrap>
                    <div>
                        <Text type="secondary">{t("Unix (seconds)")}</Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Title dir="ltr" level={4} style={{ margin: 0 }}>{currentTs ?? "—"}</Title>
                            <Button disabled={!now} aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={copyCurrentTs} />
                        </div>
                    </div>
                    <div>
                        <Text type="secondary">ISO 8601</Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Title dir="ltr" level={4} style={{ margin: 0 }}>{now?.toISOString() ?? "—"}</Title>
                            <Button disabled={!now} aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={copyIso} />
                        </div>
                    </div>
                    <div>
                        <Text type="secondary">{t("Local")}</Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Title dir="auto" level={4} style={{ margin: 0 }}>{now?.toLocaleString(language) ?? "—"}</Title>
                            <Button disabled={!now} aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={copyLocal} />
                        </div>
                    </div>
                </Space>
            </Card>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title={t("Timestamp → Date")}>
                    <Input
                        dir="ltr"
                        size="large"
                        aria-label={t("Timestamp → Date")}
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        placeholder={t("e.g. 1700000000")}
                        style={{ fontFamily: "var(--font-geist-mono)", marginBottom: 8 }}
                        suffix={<Button aria-label={t("Copy")} size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard(timestamp)} />}
                    />
                    <Button type="primary" onClick={tsToDate} block>{t("Convert to Date")}</Button>
                </Card>
                <Card size="small" title={t("Date → Timestamp")}>
                    <Input
                        dir="ltr"
                        size="large"
                        aria-label={t("Date → Timestamp")}
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        placeholder={t("e.g. 2024-01-01T00:00:00Z")}
                        style={{ fontFamily: "var(--font-geist-mono)", marginBottom: 8 }}
                        suffix={<Button aria-label={t("Copy")} size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard(dateStr)} />}
                    />
                    <Button type="primary" onClick={dateToTs} block>{t("Convert to Timestamp")}</Button>
                </Card>
            </div>
        </ToolPageLayout>
    );
}

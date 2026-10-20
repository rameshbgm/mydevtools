"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Tag, Typography, Space, Alert, Button, Tooltip } from "antd";
import { SearchOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

const { TextArea } = Input;
const { Text } = Typography;

interface ShareState { pattern: string; flags: string; testStr: string; }
const SHARE_SCHEMA: ShareSchema<ShareState> = {
    toolId: "regex-tester",
    version: 1,
    validate: (state: unknown): state is ShareState => {
        if (!state || typeof state !== "object") return false;
        const candidate = state as Record<string, unknown>;
        return typeof candidate.pattern === "string" && typeof candidate.flags === "string" && typeof candidate.testStr === "string";
    },
};

export default function RegexTesterPage() {
    const { t, direction } = useLanguage();
    const [pattern, setPattern] = useState("(\\w+)@(\\w+\\.\\w+)");
    const [flags, setFlags] = useState("gi");
    const [testStr, setTestStr] = useState("Contact us at hello@example.com or support@devtools.io for help.");

    useShareableState(SHARE_SCHEMA, (s) => {
        setPattern(s.pattern);
        setFlags(s.flags);
        setTestStr(s.testStr);
    });

    const { matches, error } = useMemo(() => {
        try {
            const regex = new RegExp(pattern, flags);
            return { matches: [...testStr.matchAll(regex)], error: "" };
        } catch (e: unknown) {
            return { matches: [], error: e instanceof Error ? e.message : "Invalid regex" };
        }
    }, [pattern, flags, testStr]);

    const copyPattern = () => copyToClipboard(`/${pattern}/${flags}`, t("Pattern copied!"));
    const copyAllMatches = () => {
        if (matches.length > 0) {
            copyToClipboard(matches.map((m) => m[0]).join("\n"), t("All matches copied!"));
        }
    };

    return (
        <ToolPageLayout
            title={t("Regex Tester")}
            description={t("Test regular expressions with live matching")}
            icon={<SearchOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs: "A Regex (Regular Expression) Tester helps you write and debug regular expressions by showing matches in real-time. Regex is a powerful pattern-matching language used for text search, validation, and transformation.",
                whyUse: "Regular expressions are essential for text processing but can be tricky to write correctly. This tool lets you test patterns instantly, see all matches, and catch errors before using regex in code.",
                howToUse: [
                    "Enter your regular expression pattern",
                    "Set flags: g (global), i (ignore case), m (multiline)",
                    "Enter test text to match against",
                    "See highlighted matches and captured groups"
                ],
                tips: [
                    "Use \\d for digits, \\w for word characters, \\s for whitespace",
                    "Escape special characters: . * + ? ^ $ { } [ ] \\ | ( )",
                    "Use ? after quantifiers for non-greedy matching",
                    "Capture groups with () to extract specific parts"
                ],
                useCases: [
                    "Validating email addresses, phone numbers, URLs",
                    "Extracting data from log files",
                    "Search and replace in text editors",
                    "Input validation in web forms"
                ]
            }}
        >
            <ToolBridgeBanner accepts={["text"]} onAccept={(p) => setTestStr(p.data)} />

            <Space dir={direction} style={{ marginBottom: 16 }} wrap>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ pattern, flags, testStr })} size="middle" />
                <SendToButton data={testStr} kind="text" sourceToolId="regex-tester" size="middle" />
            </Space>

            <div dir={direction} className="tool-split-pane" style={{ gap: 16 }}>
                <div>
                    <Card
                        size="small"
                        title={t("Regular Expression")}
                        style={{ marginBottom: 12 }}
                        extra={
                            <Tooltip title={t("Copy pattern")}>
                                <Button aria-label={t("Copy pattern")} size="small" icon={<CopyOutlined />} onClick={copyPattern} />
                            </Tooltip>
                        }
                    >
                        <Space.Compact style={{ width: "100%" }}>
                            <Button disabled style={{ pointerEvents: "none" }}>/</Button>
                            <Input
                                aria-label={t("Regular expression pattern")} dir="ltr"
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                style={{ fontFamily: "var(--font-geist-mono)" }}
                            />
                            <Button disabled style={{ pointerEvents: "none" }}>/</Button>
                            <Input
                                aria-label={t("Regular expression flags")} dir="ltr"
                                value={flags}
                                onChange={(e) => setFlags(e.target.value)}
                                style={{ width: 80, fontFamily: "var(--font-geist-mono)" }}
                            />
                        </Space.Compact>
                    </Card>

                    <Card
                        size="small"
                        title={t("Test String")}
                        extra={
                            <Tooltip title={t("Copy test string")}>
                                <Button aria-label={t("Copy test string")} size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(testStr, t("Test string copied!"))} />
                            </Tooltip>
                        }
                    >
                        <TextArea
                            rows={10}
                            aria-label={t("Test string")} dir="ltr"
                            value={testStr}
                            onChange={(e) => setTestStr(e.target.value)}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                        />
                    </Card>
                </div>

                <div>
                    {error && <Alert type="error" title={t("Regular expression error")} description={<pre dir="ltr" style={{ whiteSpace: "pre-wrap", margin: 0 }}>{error}</pre>} style={{ marginBottom: 12 }} />}
                    <Card
                        size="small"
                        title={t("Matches ({count})", { count: matches.length })}
                        extra={
                            matches.length > 0 && (
                                <Tooltip title={t("Copy all matches")}>
                                    <Button size="small" icon={<CopyOutlined />} onClick={copyAllMatches}>{t("Copy All")}</Button>
                                </Tooltip>
                            )
                        }
                    >
                        {matches.length === 0 && !error && <Text type="secondary">{t("No matches found")}</Text>}
                        {matches.map((m, i) => (
                            <Card key={i} size="small" style={{ marginBottom: 8 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div>
                                        <Tag color="blue">{t("Match {number}", { number: i + 1 })}</Tag>
                                        <Text code dir="ltr" style={{ unicodeBidi: "isolate" }}>{m[0]}</Text>
                                        <Text type="secondary" style={{ marginLeft: 8 }}>{t("Index: {index}", { index: m.index ?? 0 })}</Text>
                                    </div>
                                    <Tooltip title={t("Copy match")}>
                                        <Button aria-label={t("Copy match")} size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard(m[0])} />
                                    </Tooltip>
                                </div>
                                {m.length > 1 && (
                                    <div style={{ marginTop: 4 }}>
                                        {Array.from(m).slice(1).map((g, gi) => (
                                            <Tag
                                                key={gi}
                                                color="purple"
                                                style={{ marginTop: 4, cursor: "pointer" }}
                                                onClick={() => copyToClipboard(g, t("Group {number} copied!", { number: gi + 1 }))}
                                            >{t("Group {number}:", { number: gi + 1 })} <bdi dir="ltr">{g}</bdi>
                                            </Tag>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </Card>
                </div>
            </div>
        </ToolPageLayout>
    );
}

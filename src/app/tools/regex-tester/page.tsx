"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Tag, Typography, Space, Alert, Button, Tooltip } from "antd";
import { SearchOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
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

    const copyPattern = () => copyToClipboard(`/${pattern}/${flags}`, "Pattern copied!");
    const copyAllMatches = () => {
        if (matches.length > 0) {
            copyToClipboard(matches.map((m) => m[0]).join("\n"), "All matches copied!");
        }
    };

    return (
        <ToolPageLayout
            title="Regex Tester"
            description="Test regular expressions with live matching"
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

            <Space style={{ marginBottom: 16 }} wrap>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ pattern, flags, testStr })} size="middle" />
                <SendToButton data={testStr} kind="text" sourceToolId="regex-tester" size="middle" />
            </Space>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <div>
                    <Card
                        size="small"
                        title="Regular Expression"
                        style={{ marginBottom: 12 }}
                        extra={
                            <Tooltip title="Copy pattern">
                                <Button aria-label="Copy" size="small" icon={<CopyOutlined />} onClick={copyPattern} />
                            </Tooltip>
                        }
                    >
                        <Space.Compact style={{ width: "100%" }}>
                            <Button disabled style={{ pointerEvents: "none" }}>/</Button>
                            <Input
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                style={{ fontFamily: "var(--font-geist-mono)" }}
                            />
                            <Button disabled style={{ pointerEvents: "none" }}>/</Button>
                            <Input
                                value={flags}
                                onChange={(e) => setFlags(e.target.value)}
                                style={{ width: 80, fontFamily: "var(--font-geist-mono)" }}
                            />
                        </Space.Compact>
                    </Card>

                    <Card
                        size="small"
                        title="Test String"
                        extra={
                            <Tooltip title="Copy test string">
                                <Button aria-label="Copy" size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(testStr, "Test string copied!")} />
                            </Tooltip>
                        }
                    >
                        <TextArea
                            rows={10}
                            value={testStr}
                            onChange={(e) => setTestStr(e.target.value)}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                        />
                    </Card>
                </div>

                <div>
                    {error && <Alert type="error" title={error} style={{ marginBottom: 12 }} />}
                    <Card
                        size="small"
                        title={`Matches (${matches.length})`}
                        extra={
                            matches.length > 0 && (
                                <Tooltip title="Copy all matches">
                                    <Button size="small" icon={<CopyOutlined />} onClick={copyAllMatches}>
                                        Copy All
                                    </Button>
                                </Tooltip>
                            )
                        }
                    >
                        {matches.length === 0 && !error && <Text type="secondary">No matches found</Text>}
                        {matches.map((m, i) => (
                            <Card key={i} size="small" style={{ marginBottom: 8 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div>
                                        <Tag color="blue">Match {i + 1}</Tag>
                                        <Text code>{m[0]}</Text>
                                        <Text type="secondary" style={{ marginLeft: 8 }}>index: {m.index}</Text>
                                    </div>
                                    <Tooltip title="Copy match">
                                        <Button aria-label="Copy" size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard(m[0])} />
                                    </Tooltip>
                                </div>
                                {m.length > 1 && (
                                    <div style={{ marginTop: 4 }}>
                                        {Array.from(m).slice(1).map((g, gi) => (
                                            <Tag
                                                key={gi}
                                                color="purple"
                                                style={{ marginTop: 4, cursor: "pointer" }}
                                                onClick={() => copyToClipboard(g, `Group ${gi + 1} copied!`)}
                                            >
                                                Group {gi + 1}: {g}
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

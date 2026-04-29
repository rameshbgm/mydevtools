"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Space, Typography, Row, Col, Input, Select, App } from "antd";
import { FontSizeOutlined, CopyOutlined, SwapOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text, Title } = Typography;

type CaseType = "camelCase" | "PascalCase" | "snake_case" | "SCREAMING_SNAKE_CASE" | "kebab-case" | "TRAIN-CASE" | "dot.case" | "Title Case" | "Sentence case" | "lowercase" | "UPPERCASE" | "path/case";

const CASE_OPTIONS: { value: CaseType; label: string }[] = [
    { value: "camelCase", label: "camelCase" },
    { value: "PascalCase", label: "PascalCase" },
    { value: "snake_case", label: "snake_case" },
    { value: "SCREAMING_SNAKE_CASE", label: "SCREAMING_SNAKE_CASE" },
    { value: "kebab-case", label: "kebab-case" },
    { value: "TRAIN-CASE", label: "TRAIN-CASE" },
    { value: "dot.case", label: "dot.case" },
    { value: "path/case", label: "path/case" },
    { value: "Title Case", label: "Title Case" },
    { value: "Sentence case", label: "Sentence case" },
    { value: "lowercase", label: "lowercase" },
    { value: "UPPERCASE", label: "UPPERCASE" },
];

function splitWords(text: string): string[] {
    // Split by common separators and camelCase boundaries
    return text
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
        .split(/[-_\s./]+/)
        .filter(Boolean);
}

function convertCase(text: string, targetCase: CaseType): string {
    const words = splitWords(text);
    if (words.length === 0) return text;

    switch (targetCase) {
        case "camelCase":
            return words.map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join("");
        case "PascalCase":
            return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
        case "snake_case":
            return words.map((w) => w.toLowerCase()).join("_");
        case "SCREAMING_SNAKE_CASE":
            return words.map((w) => w.toUpperCase()).join("_");
        case "kebab-case":
            return words.map((w) => w.toLowerCase()).join("-");
        case "TRAIN-CASE":
            return words.map((w) => w.toUpperCase()).join("-");
        case "dot.case":
            return words.map((w) => w.toLowerCase()).join(".");
        case "path/case":
            return words.map((w) => w.toLowerCase()).join("/");
        case "Title Case":
            return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
        case "Sentence case":
            return words.map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase())).join(" ");
        case "lowercase":
            return words.join(" ").toLowerCase();
        case "UPPERCASE":
            return words.join(" ").toUpperCase();
        default:
            return text;
    }
}

function processMultiLine(text: string, targetCase: CaseType): string {
    return text
        .split("\n")
        .map((line) => convertCase(line.trim(), targetCase))
        .join("\n");
}

export default function CaseConverterPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState("hello_world_example");
    const [targetCase, setTargetCase] = useState<CaseType>("camelCase");

    const conversions = CASE_OPTIONS.map((opt) => ({
        ...opt,
        result: convertCase(input.split("\n")[0], opt.value),
    }));

    const mainOutput = processMultiLine(input, targetCase);

    return (
        <ToolPageLayout
            title="String Case Converter"
            description="Convert text between different case formats"
            icon={<FontSizeOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "A case converter transforms text between naming conventions: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more. These conventions are used in programming for variables, files, and identifiers.",
                whyUse: "Different languages and contexts require different naming conventions. This tool quickly converts between formats, saving time when adapting code between languages or following style guides.",
                howToUse: [
                    "Paste or type your text in the input field",
                    "Select the target case format",
                    "View all case conversions at once",
                    "Copy the format you need"
                ],
                tips: [
                    "camelCase: JavaScript variables, functions",
                    "PascalCase: Classes, React components",
                    "snake_case: Python, Ruby, databases",
                    "kebab-case: CSS classes, URLs, file names"
                ],
                useCases: [
                    "Converting API field names between conventions",
                    "Renaming variables when porting code",
                    "Generating consistent file names",
                    "Following project naming conventions"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title="Input">
                        <TextArea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter text to convert... (supports multiple lines)"
                            rows={6}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14 }}
                        />
                        <div style={{ marginTop: 16 }}>
                            <Text type="secondary">
                                Supports: camelCase, PascalCase, snake_case, kebab-case, spaces, and more
                            </Text>
                        </div>
                    </Card>

                    <Card title="Convert To" style={{ marginTop: 16 }}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Select
                                value={targetCase}
                                onChange={setTargetCase}
                                options={CASE_OPTIONS}
                                style={{ width: "100%" }}
                                size="large"
                            />
                            <div
                                style={{
                                    padding: 16,
                                    background: "rgba(114, 46, 209, 0.1)",
                                    borderRadius: 8,
                                    fontFamily: "var(--font-geist-mono)",
                                    fontSize: 16,
                                    wordBreak: "break-all",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {mainOutput || "..."}
                            </div>
                            <Button
                                type="primary"
                                icon={<CopyOutlined />}
                                onClick={() => copyToClipboard(mainOutput)}
                                block
                            >
                                Copy Result
                            </Button>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="All Conversions">
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {conversions.map((c) => (
                                <div
                                    key={c.value}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "12px 16px",
                                        background: targetCase === c.value ? "rgba(114, 46, 209, 0.1)" : "rgba(0,0,0,0.02)",
                                        borderRadius: 8,
                                        border: targetCase === c.value ? "1px solid rgba(114, 46, 209, 0.3)" : "1px solid transparent",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                    onClick={() => setTargetCase(c.value)}
                                >
                                    <div>
                                        <Text strong style={{ display: "block" }}>{c.label}</Text>
                                        <Text
                                            style={{
                                                fontFamily: "var(--font-geist-mono)",
                                                fontSize: 13,
                                                wordBreak: "break-all",
                                            }}
                                        >
                                            {c.result}
                                        </Text>
                                    </div>
                                    <Button
                                        size="small"
                                        type="text"
                                        icon={<CopyOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(c.result);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

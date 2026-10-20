"use client";

import React, { useState, useMemo } from "react";
import { Button, Card, Space, Typography, Row, Col, Input, Select } from "antd";
import { FontSizeOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

const { TextArea } = Input;
const { Text } = Typography;

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

interface ShareState { input: string; targetCase: CaseType; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "case-converter", version: 1 };

export default function CaseConverterPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState("hello_world_example");
    const [targetCase, setTargetCase] = useState<CaseType>("camelCase");

    const conversions = useMemo(() => CASE_OPTIONS.map((opt) => ({
        ...opt,
        result: convertCase(input.split("\n")[0], opt.value),
    })), [input]);

    const mainOutput = useMemo(() => processMultiLine(input, targetCase), [input, targetCase]);

    useShareableState(SHARE_SCHEMA, (s) => {
        setInput(s.input);
        setTargetCase(s.targetCase);
    });

    return (
        <ToolPageLayout
            title={t("String Case Converter")}
            description={t("Convert text between different case formats")}
            icon={<FontSizeOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "Convert text between programming naming conventions.",
                whyUse: "Prepare variable names, API fields and file names consistently.",
                howToUse: [
                    "Enter text, choose a case format, then copy the result.",
                ],
                tips: [
                    "Each line is converted separately. Technical case names remain unchanged.",
                ],
            }}
        >
            <ToolBridgeBanner accepts={["text"]} onAccept={(p) => setInput(p.data)} />

            <Space style={{ marginBottom: 16 }} wrap>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ input, targetCase })} size="middle" />
                <SendToButton data={mainOutput} kind="text" sourceToolId="case-converter" size="middle" />
            </Space>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title={t("Input")}>
                        <TextArea aria-label={t("Input text")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t("Enter text to convert... (supports multiple lines)")}
                            rows={6}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}
                        />
                        <div style={{ marginTop: 16 }}>
                            <Text type="secondary">
                                {t("Supports: camelCase, PascalCase, snake_case, kebab-case, spaces, and more")}</Text>
                        </div>
                    </Card>

                    <Card title={t("Convert To")} style={{ marginTop: 16 }}>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            <Select aria-label={t("Convert To")} direction="ltr"
                                value={targetCase}
                                onChange={setTargetCase}
                                options={CASE_OPTIONS.map(option => ({ ...option, label: ["Title Case", "Sentence case", "lowercase", "UPPERCASE"].includes(option.value) ? t(option.label) : option.label }))}
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
                                {t("Copy Result")}</Button>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title={t("All Conversions")}>
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
                                        <Text strong style={{ display: "block" }}>{["Title Case", "Sentence case", "lowercase", "UPPERCASE"].includes(c.value) ? t(c.label) : c.label}</Text>
                                        <Text
                                            style={{
                                                fontFamily: "var(--font-geist-mono)",
                                                fontSize: 16,
                                                wordBreak: "break-all",
                                            }}
                                        >
                                            {c.result}
                                        </Text>
                                    </div>
                                    <Button aria-label={t("Copy")}
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

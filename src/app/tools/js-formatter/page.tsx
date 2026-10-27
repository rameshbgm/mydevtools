"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, InputNumber, Switch, Select } from "antd";
import { CodeOutlined, CopyOutlined, ClearOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import { copyToClipboard } from "@/lib/clipboard";
import beautify from "js-beautify";

const beautifyJs = (beautify as unknown as { js: (input: string, opts?: Record<string, unknown>) => string }).js;

const { Text } = Typography;

const SAMPLE_JS = `function fibonacci(n){if(n<=1)return n;let prev=0,curr=1;for(let i=2;i<=n;i++){const next=prev+curr;prev=curr;curr=next;}return curr;}const result=fibonacci(10);console.log("Fibonacci(10):",result);const arr=[1,2,3,4,5].map(x=>x*2).filter(x=>x>4);`;

export default function JsFormatterPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState(SAMPLE_JS);
    const [indentSize, setIndentSize] = useState(2);
    const [useTabs, setUseTabs] = useState(false);
    const [preserveNewlines, setPreserveNewlines] = useState(true);
    const [braceStyle, setBraceStyle] = useState<"collapse" | "expand" | "end-expand">("collapse");
    const [spaceInParen, setSpaceInParen] = useState(false);

    const formatted = useMemo(() => {
        if (!input.trim()) return "";
        try {
            return beautifyJs(input, {
                indent_size: indentSize,
                indent_with_tabs: useTabs,
                preserve_newlines: preserveNewlines,
                brace_style: braceStyle,
                space_in_paren: spaceInParen,
                space_after_anon_function: true,
                jslint_happy: false,
            });
        } catch (err: any) {
            return `// Error: ${err.message}`;
        }
    }, [input, indentSize, useTabs, preserveNewlines, braceStyle, spaceInParen]);

    const minified = useMemo(() => {
        if (!input.trim()) return "";
        // Simple minification - remove comments, extra whitespace
        return input
            .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
            .replace(/\/\/.*$/gm, "") // Remove line comments
            .replace(/\s+/g, " ") // Collapse whitespace
            .replace(/\s*([{}\[\]();,:])\s*/g, "$1") // Remove space around punctuation
            .replace(/;\}/g, "}") // Remove unnecessary semicolons
            .trim();
    }, [input]);

    const copyFormatted = () => copyToClipboard(formatted, t("Formatted JavaScript copied!"));

    const copyMinified = () => copyToClipboard(minified, t("Minified JavaScript copied!"));

    const stats = useMemo(() => {
        const originalSize = new Blob([input]).size;
        const minSize = new Blob([minified]).size;
        const formattedSize = new Blob([formatted]).size;
        const lines = formatted.split("\n").length;
        return { originalSize, minSize, formattedSize, lines };
    }, [input, minified, formatted]);

    return (
        <ToolPageLayout
            title={t("JavaScript Formatter")}
            description={t("Beautify and minify JavaScript code")}
            icon={<CodeOutlined style={{ fontSize: 24, color: "#f7df1e" }} />}
            color="#f7df1e"
            learnMore={{
                whatIs: "A JavaScript Formatter transforms JavaScript code into a clean, consistently styled format with proper indentation and spacing. It can also minify code by removing whitespace and comments to reduce file size.",
                whyUse: "Readable JavaScript is essential for debugging and code reviews. Minified JavaScript loads faster and reduces bandwidth. This tool helps developers maintain code quality while optimizing for production.",
                howToUse: [
                    "Paste your JavaScript code into the input editor",
                    "Configure formatting options like indent size and brace style",
                    "View beautified and minified output side by side",
                    "Copy the formatted code to your clipboard"
                ],
                tips: [
                    "Choose brace style based on your team's coding conventions",
                    "Use 'Preserve newlines' to keep logical code groupings",
                    "Minification removes comments - keep a formatted version for development",
                    "Works with ES6+ features including arrow functions and template literals"
                ],
                useCases: [
                    "Formatting minified third-party libraries for debugging",
                    "Standardizing code before committing to version control",
                    "Preparing JavaScript for production bundling",
                    "Cleaning up code snippets from Stack Overflow"
                ]
            }}
        >
            <Row className="signal-working-panes" gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card
                        title={t("Input JavaScript")}
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setInput("")}>
                                {t("Clear")}
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={input}
                            onChange={(val) => setInput(val || "")}
                            ariaLabel={t("Input JavaScript")}
                            language="javascript"
                            height={350}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">{t("{count} bytes", { count: stats.originalSize })}</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={t("Beautified JavaScript")}
                        extra={
                            <Button size="small" icon={<CopyOutlined />} onClick={copyFormatted}>
                                {t("Copy")}
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={formatted}
                            ariaLabel={t("Beautified JavaScript")}
                            language="javascript"
                            height={350}
                            readOnly
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">{t("{count} lines", { count: stats.lines })} · {t("{count} bytes", { count: stats.formattedSize })}</Text>
                        </div>
                        <Text type="secondary" style={{ display: "block", marginTop: 8 }}>{t("If formatting fails, check the source syntax and options. Parser details are shown unchanged.")}</Text>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title={t("Formatting Options")}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text style={{ display: "block", marginBottom: 4 }}>{t("Indent Size")}</Text>
                                <InputNumber
                                    aria-label={t("Indent Size")}
                                    value={indentSize}
                                    onChange={(v) => setIndentSize(v || 2)}
                                    min={1}
                                    max={8}
                                    style={{ width: "100%" }}
                                />
                            </Col>
                            <Col span={12}>
                                <Text style={{ display: "block", marginBottom: 4 }}>{t("Brace Style")}</Text>
                                <Select
                                    aria-label={t("Brace Style")}
                                    value={braceStyle}
                                    onChange={setBraceStyle}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "collapse", label: t("Collapse") },
                                        { value: "expand", label: t("Expand") },
                                        { value: "end-expand", label: t("End Expand") },
                                    ]}
                                />
                            </Col>
                            <Col span={8}>
                                <Space>
                                    <Switch aria-label={t("Use Tabs")} checked={useTabs} onChange={setUseTabs} size="small" />
                                    <Text>{t("Tabs")}</Text>
                                </Space>
                            </Col>
                            <Col span={8}>
                                <Space>
                                    <Switch aria-label={t("Preserve Newlines")} checked={preserveNewlines} onChange={setPreserveNewlines} size="small" />
                                    <Text>{t("Newlines")}</Text>
                                </Space>
                            </Col>
                            <Col span={8}>
                                <Space>
                                    <Switch aria-label={t("Space in ()")} checked={spaceInParen} onChange={setSpaceInParen} size="small" />
                                    <Text>{t("Space in ()")}</Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={t("Minified JavaScript")}
                        extra={
                            <Button size="small" icon={<CopyOutlined />} onClick={copyMinified}>
                                {t("Copy")}
                            </Button>
                        }
                    >
                        <Input.TextArea
                            dir="ltr"
                            aria-label={t("Minified JavaScript")}
                            value={minified}
                            readOnly
                            rows={4}
                            style={{ fontFamily: "monospace", fontSize: 11 }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                                {t("{count} bytes ({percent}% smaller)", { count: stats.minSize, percent: stats.originalSize ? Math.round((1 - stats.minSize / stats.originalSize) * 100) : 0 })}
                            </Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

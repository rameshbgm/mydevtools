"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, InputNumber, Switch, Select } from "antd";
import { CodeOutlined, CopyOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import beautify from "js-beautify";

const beautifyJs = (beautify as unknown as { js: (input: string, opts?: Record<string, unknown>) => string }).js;

const { Text } = Typography;

const SAMPLE_JS = `function fibonacci(n){if(n<=1)return n;let prev=0,curr=1;for(let i=2;i<=n;i++){const next=prev+curr;prev=curr;curr=next;}return curr;}const result=fibonacci(10);console.log("Fibonacci(10):",result);const arr=[1,2,3,4,5].map(x=>x*2).filter(x=>x>4);`;

export default function JsFormatterPage() {
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

    const copyFormatted = () => {
        navigator.clipboard.writeText(formatted);
        message.success("Formatted JavaScript copied!");
    };

    const copyMinified = () => {
        navigator.clipboard.writeText(minified);
        message.success("Minified JavaScript copied!");
    };

    const stats = useMemo(() => {
        const originalSize = new Blob([input]).size;
        const minSize = new Blob([minified]).size;
        const formattedSize = new Blob([formatted]).size;
        const lines = formatted.split("\n").length;
        return { originalSize, minSize, formattedSize, lines };
    }, [input, minified, formatted]);

    return (
        <ToolPageLayout
            title="JavaScript Formatter"
            description="Beautify and minify JavaScript code"
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
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card
                        title="Input JavaScript"
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setInput("")}>
                                Clear
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={input}
                            onChange={(val) => setInput(val || "")}
                            language="javascript"
                            height={350}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">{stats.originalSize} bytes</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="Beautified JavaScript"
                        extra={
                            <Button size="small" icon={<CopyOutlined />} onClick={copyFormatted}>
                                Copy
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={formatted}
                            language="javascript"
                            height={350}
                            readOnly
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">{stats.lines} lines • {stats.formattedSize} bytes</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Formatting Options">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text style={{ display: "block", marginBottom: 4 }}>Indent Size</Text>
                                <InputNumber
                                    value={indentSize}
                                    onChange={(v) => setIndentSize(v || 2)}
                                    min={1}
                                    max={8}
                                    style={{ width: "100%" }}
                                />
                            </Col>
                            <Col span={12}>
                                <Text style={{ display: "block", marginBottom: 4 }}>Brace Style</Text>
                                <Select
                                    value={braceStyle}
                                    onChange={setBraceStyle}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "collapse", label: "Collapse" },
                                        { value: "expand", label: "Expand" },
                                        { value: "end-expand", label: "End Expand" },
                                    ]}
                                />
                            </Col>
                            <Col span={8}>
                                <Space>
                                    <Switch checked={useTabs} onChange={setUseTabs} size="small" />
                                    <Text>Tabs</Text>
                                </Space>
                            </Col>
                            <Col span={8}>
                                <Space>
                                    <Switch checked={preserveNewlines} onChange={setPreserveNewlines} size="small" />
                                    <Text>Newlines</Text>
                                </Space>
                            </Col>
                            <Col span={8}>
                                <Space>
                                    <Switch checked={spaceInParen} onChange={setSpaceInParen} size="small" />
                                    <Text>Space in ()</Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="Minified JavaScript"
                        extra={
                            <Button size="small" icon={<CopyOutlined />} onClick={copyMinified}>
                                Copy
                            </Button>
                        }
                    >
                        <Input.TextArea
                            value={minified}
                            readOnly
                            rows={4}
                            style={{ fontFamily: "monospace", fontSize: 11 }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                                {stats.minSize} bytes ({Math.round((1 - stats.minSize / stats.originalSize) * 100)}% smaller)
                            </Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

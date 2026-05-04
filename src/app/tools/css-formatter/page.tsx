"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, InputNumber, Switch, Select } from "antd";
import { FormatPainterOutlined, CopyOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import beautify from "js-beautify";

const beautifyCss = (beautify as unknown as { css: (input: string, opts?: Record<string, unknown>) => string }).css;

const { Text } = Typography;

const SAMPLE_CSS = `.container{display:flex;flex-direction:column;align-items:center;padding:20px;margin:0 auto;max-width:1200px;}.header{background:#1677ff;color:#fff;padding:16px 24px;border-radius:8px;}.nav ul{list-style:none;display:flex;gap:16px;margin:0;padding:0;}.nav ul li a{color:#333;text-decoration:none;font-weight:500;}@media(max-width:768px){.container{padding:10px;}.nav ul{flex-direction:column;}}`;

export default function CssFormatterPage() {
    const [input, setInput] = useState(SAMPLE_CSS);
    const [indentSize, setIndentSize] = useState(2);
    const [useTabs, setUseTabs] = useState(false);
    const [selectorSeparatorNewline, setSelectorSeparatorNewline] = useState(true);
    const [newlineBetweenRules, setNewlineBetweenRules] = useState(true);

    const formatted = useMemo(() => {
        if (!input.trim()) return "";
        try {
            return beautifyCss(input, {
                indent_size: indentSize,
                indent_with_tabs: useTabs,
                selector_separator_newline: selectorSeparatorNewline,
                newline_between_rules: newlineBetweenRules,
            });
        } catch (err: any) {
            return `/* Error: ${err.message} */`;
        }
    }, [input, indentSize, useTabs, selectorSeparatorNewline, newlineBetweenRules]);

    const minified = useMemo(() => {
        if (!input.trim()) return "";
        return input
            .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
            .replace(/\s+/g, " ") // Collapse whitespace
            .replace(/\s*([{};:,])\s*/g, "$1") // Remove space around punctuation
            .replace(/;}/g, "}") // Remove last semicolon before }
            .replace(/\s*{\s*/g, "{")
            .replace(/\s*}\s*/g, "}")
            .trim();
    }, [input]);

    const copyFormatted = () => {
        navigator.clipboard.writeText(formatted);
        message.success("Formatted CSS copied!");
    };

    const copyMinified = () => {
        navigator.clipboard.writeText(minified);
        message.success("Minified CSS copied!");
    };

    const stats = useMemo(() => {
        const selectors = (input.match(/[^{}]+(?=\{)/g) || []).length;
        const properties = (input.match(/[a-z-]+\s*:/gi) || []).length;
        const originalSize = new Blob([input]).size;
        const minSize = new Blob([minified]).size;
        const formattedSize = new Blob([formatted]).size;
        return { selectors, properties, originalSize, minSize, formattedSize };
    }, [input, minified, formatted]);

    return (
        <ToolPageLayout
            title="CSS Formatter"
            description="Beautify and minify CSS stylesheets"
            icon={<FormatPainterOutlined style={{ fontSize: 24, color: "#264de4" }} />}
            color="#264de4"
            learnMore={{
                whatIs: "A CSS Formatter beautifies CSS stylesheets by applying proper indentation, spacing between rules, and consistent formatting. It can also minify CSS by removing all unnecessary characters to reduce file size.",
                whyUse: "Consistent CSS formatting improves code readability and maintainability. Minified CSS loads faster in production. This tool helps developers maintain clean stylesheets and optimize for performance.",
                howToUse: [
                    "Paste your CSS code into the input editor",
                    "Adjust options like indent size and newlines between rules",
                    "View beautified and minified versions simultaneously",
                    "Copy the version that fits your needs"
                ],
                tips: [
                    "Use 'Newline between rules' for better visual separation",
                    "Minified CSS can significantly reduce stylesheet file size",
                    "The formatter handles media queries and nested selectors",
                    "Check the statistics to see compression ratios"
                ],
                useCases: [
                    "Formatting CSS from browser DevTools",
                    "Cleaning up auto-generated CSS from preprocessors",
                    "Optimizing CSS for production deployment",
                    "Standardizing CSS before code reviews"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card
                        title="Input CSS"
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setInput("")}>
                                Clear
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={input}
                            onChange={(val) => setInput(val || "")}
                            language="css"
                            height={350}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                                {stats.selectors} selectors • {stats.properties} properties • {stats.originalSize} bytes
                            </Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="Beautified CSS"
                        extra={
                            <Button size="small" icon={<CopyOutlined />} onClick={copyFormatted}>
                                Copy
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={formatted}
                            language="css"
                            height={350}
                            readOnly
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">{stats.formattedSize} bytes</Text>
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
                                <Space>
                                    <Switch checked={useTabs} onChange={setUseTabs} />
                                    <Text>Use Tabs</Text>
                                </Space>
                            </Col>
                            <Col span={12}>
                                <Space>
                                    <Switch checked={selectorSeparatorNewline} onChange={setSelectorSeparatorNewline} />
                                    <Text>Selector Newlines</Text>
                                </Space>
                            </Col>
                            <Col span={12}>
                                <Space>
                                    <Switch checked={newlineBetweenRules} onChange={setNewlineBetweenRules} />
                                    <Text>Newline Between Rules</Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="Minified CSS"
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

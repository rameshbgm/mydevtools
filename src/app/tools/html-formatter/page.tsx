"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Segmented, InputNumber, Switch, Alert } from "antd";
import { Html5Outlined, CopyOutlined, FormatPainterOutlined, CompressOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import beautify from "js-beautify";

const beautifyHtml = (beautify as unknown as { html: (input: string, opts?: Record<string, unknown>) => string }).html;

const { Text } = Typography;

const SAMPLE_HTML = `<!DOCTYPE html><html><head><title>Sample</title><style>body{margin:0;padding:20px;}</style></head><body><div class="container"><h1>Hello World</h1><p>This is a <strong>sample</strong> HTML document.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div><script>console.log("Hello");</script></body></html>`;

export default function HtmlFormatterPage() {
    const [input, setInput] = useState(SAMPLE_HTML);
    const [indentSize, setIndentSize] = useState(2);
    const [useTabs, setUseTabs] = useState(false);
    const [wrapLineLength, setWrapLineLength] = useState(120);
    const [preserveNewlines, setPreserveNewlines] = useState(true);

    const formatted = useMemo(() => {
        if (!input.trim()) return "";
        try {
            return beautifyHtml(input, {
                indent_size: indentSize,
                indent_with_tabs: useTabs,
                wrap_line_length: wrapLineLength,
                preserve_newlines: preserveNewlines,
                indent_inner_html: true,
                indent_head_inner_html: true,
                indent_body_inner_html: true,
            });
        } catch (err: any) {
            return `Error: ${err.message}`;
        }
    }, [input, indentSize, useTabs, wrapLineLength, preserveNewlines]);

    const minified = useMemo(() => {
        if (!input.trim()) return "";
        return input
            .replace(/\s+/g, " ")
            .replace(/>\s+</g, "><")
            .replace(/\s+>/g, ">")
            .replace(/<\s+/g, "<")
            .trim();
    }, [input]);

    const copyFormatted = () => {
        navigator.clipboard.writeText(formatted);
        message.success("Formatted HTML copied!");
    };

    const copyMinified = () => {
        navigator.clipboard.writeText(minified);
        message.success("Minified HTML copied!");
    };

    const applyFormatted = () => {
        setInput(formatted);
        message.success("Applied formatted HTML to input");
    };

    const stats = useMemo(() => {
        const tags = (input.match(/<[a-zA-Z][^>]*>/g) || []).length;
        const originalSize = new Blob([input]).size;
        const minSize = new Blob([minified]).size;
        const formattedSize = new Blob([formatted]).size;
        return { tags, originalSize, minSize, formattedSize };
    }, [input, minified, formatted]);

    return (
        <ToolPageLayout
            title="HTML Formatter"
            description="Format, prettify and beautify HTML documents"
            icon={<Html5Outlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs: "An HTML Formatter beautifies HTML markup by applying consistent indentation, line breaks, and spacing. It makes messy or minified HTML readable while preserving the document structure and functionality.",
                whyUse: "Clean, well-formatted HTML is easier to read, debug, and maintain. When working with generated HTML, third-party templates, or legacy code, a formatter helps standardize the codebase and improve team collaboration.",
                howToUse: [
                    "Paste your HTML code into the input editor",
                    "Adjust formatting options like indent size and line wrapping",
                    "View the beautified and minified versions side by side",
                    "Copy whichever version you need"
                ],
                tips: [
                    "Use tabs vs spaces based on your project's coding standards",
                    "Enable 'Preserve newlines' to keep intentional blank lines",
                    "The formatter handles inline CSS and JavaScript within HTML",
                    "Minified output is perfect for production deployment"
                ],
                useCases: [
                    "Cleaning up HTML from WYSIWYG editors",
                    "Formatting email templates for better readability",
                    "Standardizing HTML before committing to version control",
                    "Preparing HTML snippets for documentation"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card
                        title="Input HTML"
                        extra={
                            <Space>
                                <Button size="small" icon={<ClearOutlined />} onClick={() => setInput("")}>
                                    Clear
                                </Button>
                            </Space>
                        }
                    >
                        <CodeEditor
                            value={input}
                            onChange={(val) => setInput(val || "")}
                            language="html"
                            height={400}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                                {stats.tags} tags • {stats.originalSize} bytes
                            </Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="Formatted HTML"
                        extra={
                            <Space>
                                <Button size="small" icon={<CopyOutlined />} onClick={copyFormatted}>
                                    Copy
                                </Button>
                                <Button size="small" onClick={applyFormatted}>
                                    Apply
                                </Button>
                            </Space>
                        }
                    >
                        <CodeEditor
                            value={formatted}
                            language="html"
                            height={400}
                            readOnly
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">{stats.formattedSize} bytes</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Options">
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
                                <Text style={{ display: "block", marginBottom: 4 }}>Wrap Line Length</Text>
                                <InputNumber
                                    value={wrapLineLength}
                                    onChange={(v) => setWrapLineLength(v || 120)}
                                    min={0}
                                    max={500}
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
                                    <Switch checked={preserveNewlines} onChange={setPreserveNewlines} />
                                    <Text>Preserve Newlines</Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="Minified HTML"
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
                            style={{ fontFamily: "monospace", fontSize: 12 }}
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

"use client";

import React, { useState, useMemo } from "react";
import { Card, Typography, Row, Col, Button, Space, Alert, Tag } from "antd";
import SimpleList from "@/components/SimpleList";
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, ClearOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text } = Typography;

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
</head>
<body>
  <header>
    <h1>Welcome to My Site</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <h2>Article Title</h2>
      <p>This is a sample paragraph with <strong>bold</strong> text.</p>
      <img src="image.jpg" alt="Sample image">
    </article>
  </main>
  <footer>
    <p>&copy; 2024 My Site</p>
  </footer>
</body>
</html>`;

interface ValidationIssue {
    type: "error" | "warning" | "info";
    message: string;
    values?: Record<string, string>;
    line?: number;
}

interface ValidationResult {
    valid: boolean;
    issues: ValidationIssue[];
    stats: {
        elements: number;
        hasDoctype: boolean;
        hasHtmlTag: boolean;
        hasHead: boolean;
        hasBody: boolean;
        hasTitle: boolean;
    };
}

function validateHTML(input: string): ValidationResult {
    const issues: ValidationIssue[] = [];
    const lines = input.split("\n");

    // Check for DOCTYPE
    const hasDoctype = /<!DOCTYPE\s+html/i.test(input);
    if (!hasDoctype) {
        issues.push({ type: "warning", message: "Missing <!DOCTYPE html> declaration", line: 1 });
    }

    // Check for required elements
    const hasHtmlTag = /<html[\s>]/i.test(input);
    const hasHead = /<head[\s>]/i.test(input);
    const hasBody = /<body[\s>]/i.test(input);
    const hasTitle = /<title[\s>]/i.test(input);

    if (!hasHtmlTag) issues.push({ type: "error", message: "Missing <html> element" });
    if (!hasHead) issues.push({ type: "warning", message: "Missing <head> element" });
    if (!hasBody) issues.push({ type: "warning", message: "Missing <body> element" });
    if (!hasTitle && hasHead) issues.push({ type: "warning", message: "Missing <title> element in head" });

    // Check for unclosed tags
    const voidElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
    const tagStack: { tag: string; line: number }[] = [];

    lines.forEach((line, lineIndex) => {
        // Find opening tags
        const openTags = line.matchAll(/<([a-z][a-z0-9]*)[^>]*(?<!\/)\s*>/gi);
        for (const match of openTags) {
            const tag = match[1].toLowerCase();
            if (!voidElements.includes(tag)) {
                tagStack.push({ tag, line: lineIndex + 1 });
            }
        }

        // Find closing tags
        const closeTags = line.matchAll(/<\/([a-z][a-z0-9]*)>/gi);
        for (const match of closeTags) {
            const tag = match[1].toLowerCase();
            const lastOpen = tagStack.findLastIndex((t) => t.tag === tag);
            if (lastOpen === -1) {
                issues.push({ type: "error", message: "Unexpected closing tag {tag}", values: { tag: `</${tag}>` }, line: lineIndex + 1 });
            } else if (lastOpen !== tagStack.length - 1) {
                issues.push({ type: "error", message: "Mismatched closing tag {tag}, expected {expected}", values: { tag: `</${tag}>`, expected: `</${tagStack[tagStack.length - 1].tag}>` }, line: lineIndex + 1 });
            } else {
                tagStack.pop();
            }
        }

        // Check for img without alt
        if (/<img[^>]*(?!alt=)[^>]*>/i.test(line) && !line.includes('alt=')) {
            issues.push({ type: "warning", message: "Image without alt attribute (accessibility)", line: lineIndex + 1 });
        }

        // Check for deprecated tags
        const deprecatedTags = ["center", "font", "marquee", "blink", "frame", "frameset"];
        deprecatedTags.forEach((tag) => {
            if (new RegExp(`<${tag}[\\s>]`, "i").test(line)) {
                issues.push({ type: "warning", message: "Deprecated tag {tag} found", values: { tag: `<${tag}>` }, line: lineIndex + 1 });
            }
        });
    });

    // Report unclosed tags
    tagStack.forEach(({ tag, line }) => {
        issues.push({ type: "error", message: "Unclosed tag {tag}", values: { tag: `<${tag}>` }, line });
    });

    // Count elements
    const elements = (input.match(/<[a-z][^>]*>/gi) || []).length;

    return {
        valid: !issues.some((i) => i.type === "error"),
        issues,
        stats: {
            elements,
            hasDoctype,
            hasHtmlTag,
            hasHead,
            hasBody,
            hasTitle,
        },
    };
}

export default function HtmlValidatorPage() {
    const { t, direction } = useLanguage();
    const [input, setInput] = useState(SAMPLE_HTML);

    const result = useMemo(() => validateHTML(input), [input]);

    const errors = result.issues.filter((i) => i.type === "error");
    const warnings = result.issues.filter((i) => i.type === "warning");

    return (
        <ToolPageLayout
            title={t("HTML Validator")}
            description={t("Validate HTML markup for errors and best practices")}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs: "An HTML validator checks markup for syntax errors, missing tags, accessibility issues, and HTML5 compliance. It identifies problems that might cause rendering issues or SEO penalties.",
                whyUse: "Valid HTML improves browser compatibility, accessibility, SEO, and maintainability. Catching errors early prevents display issues and helps meet web standards.",
                howToUse: [
                    "Paste your HTML code in the input editor",
                    "Validation runs automatically showing errors and warnings",
                    "Click on issues to see detailed explanations",
                    "Fix issues to improve HTML quality"
                ],
                tips: [
                    "Always include doctype, html, head, and body tags",
                    "Close all tags or use self-closing syntax for void elements",
                    "Add alt attributes to images for accessibility",
                    "Use semantic elements like header, nav, main, footer"
                ],
                useCases: [
                    "Checking email templates before sending",
                    "Validating web page markup for SEO",
                    "Ensuring accessibility compliance",
                    "Debugging rendering issues in browsers"
                ]
            }}
        >
            <Row dir={direction} gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        title={t("HTML Input")}
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setInput("")}>{t("Clear")}</Button>
                        }
                    >
                        <CodeEditor
                            ariaLabel={t("HTML input editor")}
                            value={input}
                            onChange={(val) => setInput(val || "")}
                            language="html"
                            height={400}
                        />
                    </Card>

                    <Card title={t("Validation Result")} style={{ marginTop: 16 }}>
                        {result.valid && warnings.length === 0 ? (
                            <Alert
                                type="success"
                                showIcon
                                icon={<CheckCircleOutlined />}
                                title={t("Valid HTML")}
                                description={
                                    <Space wrap>
                                        <Tag color="green">{t("Elements: {count}", { count: result.stats.elements })}</Tag>
                                        {result.stats.hasDoctype && <Tag color="blue">{t("DOCTYPE ✓")}</Tag>}
                                        {result.stats.hasTitle && <Tag color="blue">{t("Title ✓")}</Tag>}
                                    </Space>
                                }
                            />
                        ) : (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                {errors.length > 0 && (
                                    <Alert
                                        type="error"
                                        showIcon
                                        title={t("Errors: {count}", { count: errors.length })}
                                    />
                                )}
                                {warnings.length > 0 && (
                                    <Alert
                                        type="warning"
                                        showIcon
                                        title={t("Warnings: {count}", { count: warnings.length })}
                                    />
                                )}
                                <SimpleList
                                    size="small"
                                    dataSource={result.issues}
                                    renderItem={(item) => (
                                        <Space>
                                            {item.type === "error" ? (
                                                <CloseCircleOutlined style={{ color: "#f5222d" }} />
                                            ) : (
                                                <WarningOutlined style={{ color: "#faad14" }} />
                                            )}
                                            <Text dir="auto" style={{ unicodeBidi: "isolate" }}>{t(item.message, item.values)}</Text>
                                            {item.line && <Tag>{t("Line {line}", { line: item.line })}</Tag>}
                                        </Space>
                                    )}
                                />
                            </Space>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title={t("Document Structure")}>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text>DOCTYPE</Text>
                                {result.stats.hasDoctype ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CloseCircleOutlined style={{ color: "#f5222d" }} />}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text>{"<html>"}</Text>
                                {result.stats.hasHtmlTag ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CloseCircleOutlined style={{ color: "#f5222d" }} />}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text>{"<head>"}</Text>
                                {result.stats.hasHead ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CloseCircleOutlined style={{ color: "#f5222d" }} />}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text>{"<title>"}</Text>
                                {result.stats.hasTitle ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CloseCircleOutlined style={{ color: "#f5222d" }} />}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text>{"<body>"}</Text>
                                {result.stats.hasBody ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CloseCircleOutlined style={{ color: "#f5222d" }} />}
                            </div>
                        </Space>
                    </Card>

                    <Card title={t("Best Practices")} style={{ marginTop: 16 }}>
                        <ul style={{ paddingInlineStart: 20, margin: 0, fontSize: 13 }}>
                            <li>{t("Always include DOCTYPE")}</li>
                            <li>{t("Add lang attribute to html")}</li>
                            <li>{t("Use semantic HTML5 elements")}</li>
                            <li>{t("Include alt for images")}</li>
                            <li>{t("Use proper heading hierarchy")}</li>
                            <li>{t("Close all non-void tags")}</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

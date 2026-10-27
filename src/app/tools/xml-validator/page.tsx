"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Alert, Tag, Collapse } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClearOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text } = Typography;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>10.99</price>
  </book>
  <book category="non-fiction">
    <title lang="en">Thinking, Fast and Slow</title>
    <author>Daniel Kahneman</author>
    <year>2011</year>
    <price>15.99</price>
  </book>
</bookstore>`;

interface ValidationResult {
    valid: boolean;
    error?: string;
    line?: number;
    column?: number;
    elements?: number;
    attributes?: number;
}

function validateXML(input: string): ValidationResult {
    if (!input.trim()) {
        return { valid: false, error: "Input is empty" };
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(input, "application/xml");
        const errorNode = doc.querySelector("parsererror");

        if (errorNode) {
            const errorText = errorNode.textContent || "Unknown XML error";
            const lineMatch = errorText.match(/line (\d+)/i);
            const colMatch = errorText.match(/column (\d+)/i);

            return {
                valid: false,
                error: errorText.split("\n")[0],
                line: lineMatch ? parseInt(lineMatch[1], 10) : undefined,
                column: colMatch ? parseInt(colMatch[1], 10) : undefined,
            };
        }

        // Count elements and attributes
        const elements = doc.getElementsByTagName("*").length;
        let attributes = 0;
        const allElements = doc.getElementsByTagName("*");
        for (let i = 0; i < allElements.length; i++) {
            attributes += allElements[i].attributes.length;
        }

        return { valid: true, elements, attributes };
    } catch (err: any) {
        return { valid: false, error: err.message };
    }
}

export default function XmlValidatorPage() {
    const { t, direction } = useLanguage();
    const [input, setInput] = useState(SAMPLE_XML);

    const result = useMemo(() => validateXML(input), [input]);

    return (
        <ToolPageLayout
            title={t("XML Validator")}
            description={t("Validate XML syntax and well-formedness")}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "An XML validator checks whether an XML document is well-formed according to XML specification. It verifies proper tag nesting, attribute syntax, entity references, and XML declaration.",
                whyUse: "Malformed XML causes parser failures in applications. Validating XML ensures documents can be processed correctly by any XML-compliant parser or SOAP service.",
                howToUse: [
                    "Paste your XML content in the input editor",
                    "Validation runs automatically as you type",
                    "Errors show with detailed descriptions",
                    "Valid XML displays document structure info"
                ],
                tips: [
                    "XML is case-sensitive: <Tag> and <tag> are different",
                    "All elements must have closing tags or be self-closing",
                    "Attribute values must be quoted (single or double)",
                    "Special characters like < > & must be escaped"
                ],
                useCases: [
                    "Validating SOAP request/response messages",
                    "Checking XML configuration files",
                    "Verifying XML exports before import",
                    "Debugging XML parsing errors"
                ]
            }}
        >
            <Row className="signal-working-panes" dir={direction} gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        title={t("XML Input")}
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setInput("")}>{t("Clear")}</Button>
                        }
                    >
                        <CodeEditor
                            ariaLabel={t("XML input editor")}
                            value={input}
                            onChange={(val) => setInput(val || "")}
                            language="xml"
                            height={400}
                        />
                    </Card>

                    <Card title={t("Validation Result")} style={{ marginTop: 16 }}>
                        {result.valid ? (
                            <Alert
                                type="success"
                                showIcon
                                icon={<CheckCircleOutlined />}
                                title={t("Valid XML")}
                                description={
                                    <Space orientation="vertical">
                                        <Text>{t("The XML is well-formed and valid.")}</Text>
                                        <Space wrap>
                                            <Tag color="green">{t("Elements: {count}", { count: result.elements ?? 0 })}</Tag>
                                            <Tag color="blue">{t("Attributes: {count}", { count: result.attributes ?? 0 })}</Tag>
                                        </Space>
                                    </Space>
                                }
                            />
                        ) : (
                            <Alert
                                type="error"
                                showIcon
                                icon={<CloseCircleOutlined />}
                                title={t("Invalid XML")}
                                description={
                                    <Space orientation="vertical">
                                        <Text dir="ltr" style={{ whiteSpace: "pre-wrap", unicodeBidi: "isolate" }}>{result.error}</Text>
                                        {result.line && (
                                            <Text type="secondary">{t("Line {line}", { line: result.line })}{result.column && t(", Column {column}", { column: result.column })}
                                            </Text>
                                        )}
                                    </Space>
                                }
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title={t("Common XML Errors")}>
                        <Collapse
                            ghost
                            items={[
                                {
                                    key: "1",
                                    label: t("Unclosed tags"),
                                    children: <Text type="secondary">{t("Every opening tag must have a corresponding closing tag, or be self-closing.")}</Text>,
                                },
                                {
                                    key: "2",
                                    label: t("Mismatched tags"),
                                    children: <Text type="secondary">{t("Tags must be properly nested.")}{" "}<code dir="ltr">{"<a><b></a></b>"}</code>{" "}{t("is invalid.")}</Text>,
                                },
                                {
                                    key: "3",
                                    label: t("Unquoted attributes"),
                                    children: <Text type="secondary">{t("Attribute values must be quoted: name=\"value\"")}</Text>,
                                },
                                {
                                    key: "4",
                                    label: t("Special characters"),
                                    children: <Text type="secondary">{t("Use entities for < > & in text content.")}</Text>,
                                },
                                {
                                    key: "5",
                                    label: t("Multiple root elements"),
                                    children: <Text type="secondary">{t("XML must have exactly one root element.")}</Text>,
                                },
                            ]}
                        />
                    </Card>

                    <Card title={t("XML Quick Reference")} style={{ marginTop: 16 }}>
                        <ul style={{ paddingInlineStart: 20, margin: 0 }}>
                            <li>{t("Declaration:")} <code dir="ltr">{'<?xml version="1.0"?>'}</code></li>
                            <li>{t("Tags are case-sensitive")}</li>
                            <li>{t("Attribute values must be quoted")}</li>
                            <li>{t("Self-closing:")} <code dir="ltr">{"<element />"}</code></li>
                            <li>{t("Comments:")} <code dir="ltr">{"<!-- comment -->"}</code></li>
                            <li>{t("CDATA:")} <code dir="ltr">{"<![CDATA[...]]>"}</code></li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

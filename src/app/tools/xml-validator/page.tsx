"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Alert, Tag, Collapse } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClearOutlined } from "@ant-design/icons";
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
    const [input, setInput] = useState(SAMPLE_XML);

    const result = useMemo(() => validateXML(input), [input]);

    return (
        <ToolPageLayout
            title="XML Validator"
            description="Validate XML syntax and well-formedness"
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
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        title="XML Input"
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setInput("")}>
                                Clear
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={input}
                            onChange={(val) => setInput(val || "")}
                            language="xml"
                            height={400}
                        />
                    </Card>

                    <Card title="Validation Result" style={{ marginTop: 16 }}>
                        {result.valid ? (
                            <Alert
                                type="success"
                                showIcon
                                icon={<CheckCircleOutlined />}
                                message="Valid XML"
                                description={
                                    <Space orientation="vertical">
                                        <Text>The XML is well-formed and valid.</Text>
                                        <Space wrap>
                                            <Tag color="green">Elements: {result.elements}</Tag>
                                            <Tag color="blue">Attributes: {result.attributes}</Tag>
                                        </Space>
                                    </Space>
                                }
                            />
                        ) : (
                            <Alert
                                type="error"
                                showIcon
                                icon={<CloseCircleOutlined />}
                                message="Invalid XML"
                                description={
                                    <Space orientation="vertical">
                                        <Text style={{ whiteSpace: "pre-wrap" }}>{result.error}</Text>
                                        {result.line && (
                                            <Text type="secondary">
                                                Line {result.line}{result.column && `, Column ${result.column}`}
                                            </Text>
                                        )}
                                    </Space>
                                }
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Common XML Errors">
                        <Collapse
                            ghost
                            items={[
                                {
                                    key: "1",
                                    label: "Unclosed tags",
                                    children: <Text type="secondary">Every opening tag must have a corresponding closing tag, or be self-closing.</Text>,
                                },
                                {
                                    key: "2",
                                    label: "Mismatched tags",
                                    children: <Text type="secondary">Tags must be properly nested. {"<a><b></a></b>"} is invalid.</Text>,
                                },
                                {
                                    key: "3",
                                    label: "Unquoted attributes",
                                    children: <Text type="secondary">Attribute values must be quoted: name="value"</Text>,
                                },
                                {
                                    key: "4",
                                    label: "Special characters",
                                    children: <Text type="secondary">Use entities for &lt; &gt; &amp; in text content.</Text>,
                                },
                                {
                                    key: "5",
                                    label: "Multiple root elements",
                                    children: <Text type="secondary">XML must have exactly one root element.</Text>,
                                },
                            ]}
                        />
                    </Card>

                    <Card title="XML Quick Reference" style={{ marginTop: 16 }}>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li>Declaration: &lt;?xml version="1.0"?&gt;</li>
                            <li>Tags are case-sensitive</li>
                            <li>Attribute values must be quoted</li>
                            <li>Self-closing: &lt;element /&gt;</li>
                            <li>Comments: &lt;!-- comment --&gt;</li>
                            <li>CDATA: &lt;![CDATA[...]]&gt;</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

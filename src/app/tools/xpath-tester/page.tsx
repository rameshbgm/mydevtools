"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Alert, Table, Tag, Select } from "antd";
import { NodeIndexOutlined, CopyOutlined, ClearOutlined, PlayCircleOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import { copyToClipboard } from "@/lib/clipboard";

const { Text, Paragraph } = Typography;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction" id="1">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>10.99</price>
  </book>
  <book category="non-fiction" id="2">
    <title lang="en">Thinking, Fast and Slow</title>
    <author>Daniel Kahneman</author>
    <year>2011</year>
    <price>15.99</price>
  </book>
  <book category="fiction" id="3">
    <title lang="es">Cien años de soledad</title>
    <author>Gabriel García Márquez</author>
    <year>1967</year>
    <price>12.99</price>
  </book>
</bookstore>`;

const XPATH_EXAMPLES = [
    { xpath: "//book", desc: "All book elements" },
    { xpath: "//book[@category='fiction']", desc: "Fiction books" },
    { xpath: "//book/title", desc: "All book titles" },
    { xpath: "//book[price > 12]/title", desc: "Titles of books over $12" },
    { xpath: "//book[1]", desc: "First book" },
    { xpath: "//book[last()]", desc: "Last book" },
    { xpath: "//title[@lang='en']", desc: "English titles" },
    { xpath: "//@category", desc: "All category attributes" },
    { xpath: "//book/author/text()", desc: "Author text nodes" },
    { xpath: "count(//book)", desc: "Count of books" },
];

interface XPathResult {
    success: boolean;
    error?: string;
    results: { type: string; value: string; path?: string }[];
    count: number;
}

function evaluateXPath(xml: string, xpath: string): XPathResult {
    if (!xml.trim() || !xpath.trim()) {
        return { success: false, error: "Please provide both XML and XPath", results: [], count: 0 };
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "application/xml");

        const errorNode = doc.querySelector("parsererror");
        if (errorNode) {
            return { success: false, error: "Invalid XML: " + errorNode.textContent, results: [], count: 0 };
        }

        const result = doc.evaluate(
            xpath,
            doc,
            null,
            XPathResult.ANY_TYPE,
            null
        );

        const results: { type: string; value: string; path?: string }[] = [];

        switch (result.resultType) {
            case XPathResult.NUMBER_TYPE:
                results.push({ type: "Number", value: result.numberValue.toString() });
                break;
            case XPathResult.STRING_TYPE:
                results.push({ type: "String", value: result.stringValue });
                break;
            case XPathResult.BOOLEAN_TYPE:
                results.push({ type: "Boolean", value: result.booleanValue.toString() });
                break;
            default:
                let node = result.iterateNext();
                while (node) {
                    let value = "";
                    let type = "";

                    if (node.nodeType === Node.ELEMENT_NODE) {
                        type = "Element";
                        value = (node as Element).outerHTML;
                    } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
                        type = "Attribute";
                        value = `${(node as Attr).name}="${(node as Attr).value}"`;
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        type = "Text";
                        value = node.textContent || "";
                    } else {
                        type = "Node";
                        value = node.textContent || "";
                    }

                    results.push({ type, value: value.trim() });
                    node = result.iterateNext();
                }
        }

        return { success: true, results, count: results.length };
    } catch (err: any) {
        return { success: false, error: err.message, results: [], count: 0 };
    }
}

export default function XPathTesterPage() {
    const [xml, setXml] = useState(SAMPLE_XML);
    const [xpath, setXpath] = useState("//book/title");

    const result = useMemo(() => evaluateXPath(xml, xpath), [xml, xpath]);

    const copyResults = () => {
        const text = result.results.map((r) => r.value).join("\n");
        copyToClipboard(text, "Results copied!");
    };

    return (
        <ToolPageLayout
            title="XPath Tester"
            description="Test and evaluate XPath expressions against XML"
            icon={<NodeIndexOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "XPath (XML Path Language) Tester evaluates XPath expressions against XML documents. XPath is a query language for selecting nodes from XML, similar to CSS selectors for HTML.",
                whyUse: "XPath is essential for XML processing, XSLT transformations, and web scraping. Testing expressions before using them in code saves debugging time and ensures correct node selection.",
                howToUse: [
                    "Paste your XML document in the editor",
                    "Enter an XPath expression in the query field",
                    "Results show matching nodes immediately",
                    "Use the quick reference for common expressions"
                ],
                tips: [
                    "Use // to search anywhere in the document",
                    "[@attr='value'] filters by attribute",
                    "text() returns element text content",
                    "position() and last() work with node positions"
                ],
                useCases: [
                    "Building XSLT transformations",
                    "Extracting data from XML feeds",
                    "Web scraping with XML documents",
                    "Testing XML parsing logic"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={14}>
                    <Card
                        title="XML Document"
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setXml("")}>
                                Clear
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={xml}
                            onChange={(val) => setXml(val || "")}
                            language="xml"
                            height={300}
                        />
                    </Card>

                    <Card title="XPath Expression" style={{ marginTop: 16 }}>
                        <Space.Compact style={{ width: "100%" }}>
                            <Input
                                size="large"
                                value={xpath}
                                onChange={(e) => setXpath(e.target.value)}
                                placeholder="Enter XPath expression..."
                                prefix={<NodeIndexOutlined />}
                            />
                        </Space.Compact>
                    </Card>

                    <Card
                        title={
                            <Space>
                                <span>Results</span>
                                {result.success && <Tag color="purple">{result.count} match{result.count !== 1 ? "es" : ""}</Tag>}
                            </Space>
                        }
                        style={{ marginTop: 16 }}
                        extra={
                            result.results.length > 0 && (
                                <Button size="small" icon={<CopyOutlined />} onClick={copyResults}>
                                    Copy
                                </Button>
                            )
                        }
                    >
                        {!result.success ? (
                            <Alert type="error" title={result.error} showIcon />
                        ) : result.results.length === 0 ? (
                            <Alert type="info" title="No matches found" showIcon />
                        ) : (
                            <Table
                                size="small"
                                pagination={result.results.length > 10 ? { pageSize: 10 } : false}
                                dataSource={result.results.map((r, i) => ({ ...r, key: i }))}
                                columns={[
                                    {
                                        title: "#",
                                        width: 50,
                                        render: (_, __, index) => index + 1,
                                    },
                                    {
                                        title: "Type",
                                        dataIndex: "type",
                                        width: 100,
                                        render: (type) => <Tag>{type}</Tag>,
                                    },
                                    {
                                        title: "Value",
                                        dataIndex: "value",
                                        render: (value) => (
                                            <Text code style={{ fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                                                {value.length > 200 ? value.substring(0, 200) + "..." : value}
                                            </Text>
                                        ),
                                    },
                                ]}
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card title="XPath Examples">
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {XPATH_EXAMPLES.map((ex, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: "8px 12px",
                                        background: xpath === ex.xpath ? "rgba(114, 46, 209, 0.1)" : "rgba(0,0,0,0.02)",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        border: xpath === ex.xpath ? "1px solid #722ed1" : "1px solid transparent",
                                    }}
                                    onClick={() => setXpath(ex.xpath)}
                                >
                                    <Text code style={{ fontSize: 12 }}>{ex.xpath}</Text>
                                    <Text type="secondary" style={{ display: "block", fontSize: 11 }}>{ex.desc}</Text>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="XPath Syntax" style={{ marginTop: 16 }}>
                        <Table
                            size="small"
                            pagination={false}
                            showHeader={false}
                            dataSource={[
                                { expr: "/", desc: "Root node" },
                                { expr: "//", desc: "Any descendant" },
                                { expr: ".", desc: "Current node" },
                                { expr: "..", desc: "Parent node" },
                                { expr: "@", desc: "Attribute" },
                                { expr: "*", desc: "Any element" },
                                { expr: "[@attr]", desc: "Has attribute" },
                                { expr: "[n]", desc: "nth element" },
                                { expr: "text()", desc: "Text content" },
                            ].map((r, i) => ({ ...r, key: i }))}
                            columns={[
                                { dataIndex: "expr", width: 80, render: (t) => <Text code>{t}</Text> },
                                { dataIndex: "desc", render: (t) => <Text type="secondary" style={{ fontSize: 12 }}>{t}</Text> },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Space, Button, Alert, Table, Tag, message } from "antd";
import { FileSearchOutlined, CopyOutlined, PlayCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import { JSONPath } from "jsonpath-plus";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const SAMPLE_JSON = `{
  "store": {
    "book": [
      { "category": "reference", "author": "Nigel Rees", "title": "Sayings of the Century", "price": 8.95 },
      { "category": "fiction", "author": "Evelyn Waugh", "title": "Sword of Honour", "price": 12.99 },
      { "category": "fiction", "author": "Herman Melville", "title": "Moby Dick", "isbn": "0-553-21311-3", "price": 8.99 },
      { "category": "fiction", "author": "J. R. R. Tolkien", "title": "The Lord of the Rings", "isbn": "0-395-19395-8", "price": 22.99 }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`;

const EXAMPLES = [
    { path: "$.store.book[*].author", desc: "All authors" },
    { path: "$.store.book[?(@.price < 10)]", desc: "Books cheaper than $10" },
    { path: "$.store.book[?(@.isbn)]", desc: "Books with ISBN" },
    { path: "$.store.book[0]", desc: "First book" },
    { path: "$.store.book[-1:]", desc: "Last book" },
    { path: "$.store.book[0,1]", desc: "First two books" },
    { path: "$.store.book[:2]", desc: "First two books (slice)" },
    { path: "$..price", desc: "All prices" },
    { path: "$.store.*", desc: "All items in store" },
    { path: "$..book[?(@.category=='fiction')]", desc: "All fiction books" },
    { path: "$..book.length", desc: "Number of books" },
];

const SYNTAX_REFERENCE = [
    { symbol: "$", desc: "Root object/element" },
    { symbol: "@", desc: "Current object/element" },
    { symbol: ".", desc: "Child operator" },
    { symbol: "..", desc: "Recursive descent" },
    { symbol: "*", desc: "Wildcard - all objects/elements" },
    { symbol: "[]", desc: "Subscript operator" },
    { symbol: "[,]", desc: "Union operator" },
    { symbol: "[start:end:step]", desc: "Array slice operator" },
    { symbol: "?()", desc: "Filter expression" },
    { symbol: "()", desc: "Script expression" },
];

export default function JsonPathTesterPage() {
    const [json, setJson] = useState(SAMPLE_JSON);
    const [path, setPath] = useState("$.store.book[*].author");
    const [error, setError] = useState<string | null>(null);

    const result = useMemo(() => {
        setError(null);
        if (!json.trim() || !path.trim()) return null;

        try {
            const data = JSON.parse(json);
            const results = JSONPath({ path, json: data, wrap: true });
            return results;
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    }, [json, path]);

    const copyResult = () => {
        if (result) {
            navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            message.success("Result copied to clipboard!");
        }
    };

    const loadExample = (examplePath: string) => {
        setPath(examplePath);
    };

    return (
        <ToolPageLayout
            title="JSONPath Tester"
            description="Test and validate JSONPath expressions"
            icon={<FileSearchOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "JSONPath is a query language for JSON, similar to XPath for XML. It allows you to extract specific data from JSON documents using path expressions like $.store.book[*].author.",
                whyUse: "Large JSON documents can be hard to navigate. JSONPath lets you extract exactly the data you need without writing parsing code, useful for APIs, configs, and data processing.",
                howToUse: [
                    "Paste your JSON document in the input editor",
                    "Enter a JSONPath expression in the query field",
                    "View matching results instantly",
                    "Use the reference for expression syntax"
                ],
                tips: [
                    "$ represents the root object",
                    ".name or ['name'] accesses properties",
                    "[*] selects all array elements",
                    "[?(@.price < 10)] filters by condition"
                ],
                useCases: [
                    "Extracting specific fields from API responses",
                    "Filtering JSON data by conditions",
                    "Testing data extraction logic before coding",
                    "Navigating complex nested JSON structures"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="JSON Input" style={{ marginBottom: 16 }}>
                        <CodeEditor
                            value={json}
                            onChange={(val) => setJson(val || "")}
                            language="json"
                            height={250}
                        />
                    </Card>

                    <Card title="JSONPath Expression">
                        <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
                            <Input
                                size="large"
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                                placeholder="Enter JSONPath expression (e.g., $.store.book[*].author)"
                                prefix={<FileSearchOutlined />}
                            />
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlayCircleOutlined />}
                                style={{ background: "#722ed1" }}
                            >
                                Evaluate
                            </Button>
                        </Space.Compact>

                        {error && (
                            <Alert
                                type="error"
                                message="Error"
                                description={error}
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        <Card
                            type="inner"
                            title={
                                <Space>
                                    <Text>Result</Text>
                                    {result && <Tag color="purple">{result.length} match{result.length !== 1 ? "es" : ""}</Tag>}
                                </Space>
                            }
                            extra={
                                result && (
                                    <Button icon={<CopyOutlined />} size="small" onClick={copyResult}>
                                        Copy
                                    </Button>
                                )
                            }
                        >
                            {result ? (
                                <CodeEditor
                                    value={JSON.stringify(result, null, 2)}
                                    language="json"
                                    height={200}
                                    readOnly
                                />
                            ) : (
                                <div style={{ textAlign: "center", padding: 20, color: "#8c8c8c" }}>
                                    {error ? "Fix the error to see results" : "Enter a JSONPath expression to see results"}
                                </div>
                            )}
                        </Card>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Example Expressions" style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {EXAMPLES.map((example, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: "8px 12px",
                                        background: "rgba(114, 46, 209, 0.05)",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        border: path === example.path ? "1px solid #722ed1" : "1px solid transparent",
                                    }}
                                    onClick={() => loadExample(example.path)}
                                >
                                    <Text code style={{ fontSize: 12, display: "block" }}>{example.path}</Text>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{example.desc}</Text>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card
                        title={
                            <Space>
                                <InfoCircleOutlined />
                                <span>Syntax Reference</span>
                            </Space>
                        }
                    >
                        <Table
                            size="small"
                            pagination={false}
                            showHeader={false}
                            dataSource={SYNTAX_REFERENCE.map((s, i) => ({ ...s, key: i }))}
                            columns={[
                                {
                                    dataIndex: "symbol",
                                    width: 80,
                                    render: (text) => <Text code>{text}</Text>,
                                },
                                {
                                    dataIndex: "desc",
                                    render: (text) => <Text type="secondary" style={{ fontSize: 12 }}>{text}</Text>,
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

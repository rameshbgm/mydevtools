"use client";

import { useLanguage } from "@/components/LanguageProvider";
import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Space, Button, Alert, Table, Tag, Select, Checkbox } from "antd";
import { FileSearchOutlined, CopyOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import { copyToClipboard } from "@/lib/clipboard";
import { queryJson, type JsonQueryEngine } from "@/lib/json-query";

const { Text } = Typography;

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
    const { t } = useLanguage();
    const [preserveNumbers, setPreserveNumbers] = useState(false);
    const [json, setJson] = useState(SAMPLE_JSON);
    const [path, setPath] = useState("$.store.book[*].author");
    const [engine, setEngine] = useState<JsonQueryEngine>("jsonpath");
    const query = useMemo(() => {
        if (!json.trim() || !path.trim()) return { value: undefined, error: null };
        try { return { value: queryJson(json, path, engine, preserveNumbers ? "strings" : "reject"), error: null }; }
        catch (cause) { return { value: undefined, error: cause instanceof Error ? cause.message : String(cause) }; }
    }, [json, path, engine, preserveNumbers]);
    const result = query.value, error = query.error;
    const hasResult = result !== undefined && !error;
    const matchCount = Array.isArray(result) ? result.length : 1;
    const examples = engine === "jsonpath" ? EXAMPLES : [
        { path: "store.book[].author", desc: "All authors" },
        { path: "store.book[?price < `10`].title", desc: "Titles priced below 10" },
        { path: "length(store.book)", desc: "Number of books" },
        { path: "sort_by(store.book, &price)[].{title: title, price: price}", desc: "Objects sorted by price" },
    ];

    const copyResult = () => {
        if (hasResult) copyToClipboard(JSON.stringify(result, null, 2), t("Result copied to clipboard!"));
    };

    const loadExample = (examplePath: string) => {
        setPath(examplePath);
    };

    return (
        <ToolPageLayout
            title="JSONPath Tester"
            description="Query JSON with JSONPath or JMESPath and inspect exact array, object or scalar results"
            icon={<FileSearchOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "JSONPath selects nodes; JMESPath also projects, filters and transforms JSON values. Queries run locally in your browser.",
                whyUse: "Inspect API responses and test extraction logic without uploading the document.",
                howToUse: ["Choose a query language, paste JSON up to 2 MiB, then enter an expression up to 2048 characters.", "Click an example to change the expression. Examples use the initial sample; restore it with Load sample JSON.", "Results update as you type. Copy preserves the returned array, object, scalar or null."],
                tips: ["JSONPath uses jsonpath-plus safe evaluation; implementation extensions may differ from RFC 9535 or other tools.", "JMESPath examples use projections, filters, functions and pipes. Syntax differs from JSONPath.", "A JSONPath result is always a list of matches. JMESPath returns the expression value; null can mean no match."],
            }}
        >
            <Select aria-label={t("JSON query language")} value={engine} onChange={(value: JsonQueryEngine) => { setEngine(value); setPath(value === "jsonpath" ? "$.store.book[*].author" : "store.book[].author"); }} options={[{ value: "jsonpath", label: "JSONPath" }, { value: "jmespath", label: "JMESPath" }]} style={{ minWidth: 180, maxWidth: "100%", marginBottom: 18 }} />
            <Button onClick={() => setJson(SAMPLE_JSON)} style={{ marginInlineStart: 8, marginBottom: 18 }}>{t("Load sample JSON")}</Button>
            <div className="wb-query-precision">
                <Checkbox checked={preserveNumbers} onChange={(event) => setPreserveNumbers(event.target.checked)}>{t("Preserve precision-sensitive numbers as text")}</Checkbox>
                <p>{t(preserveNumbers ? "Affected input numbers become strings. Numeric filters and functions no longer receive numbers. Use quoted text equality; string sorting is lexical." : "Input numbers that cannot round-trip through JavaScript numbers are rejected instead of silently changed.")}</p>
                <p>{t("Numeric functions use IEEE 754 arithmetic and may round. JMESPath JSON literals follow the input precision setting.")}</p>
            </div>
            <Row className="signal-working-panes" gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title={t("JSON Input")} style={{ marginBottom: 16 }}>
                        <CodeEditor
                            value={json}
                            onChange={(val) => setJson(val || "")}
                            language="json"
                            ariaLabel={t("JSON input editor")}
                            height={250}
                        />
                    </Card>

                    <Card title={t(engine === "jsonpath" ? "JSONPath Expression" : "JMESPath Expression")}>
                        <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
                            <Input
                                size="large"
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                                aria-label={t("JSON query expression")}
                                dir="ltr"
                                styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                placeholder={engine === "jsonpath" ? "$.store.book[*].author" : "store.book[].author"}
                                prefix={<FileSearchOutlined />}
                            />

                        </Space.Compact>

                        {error && (
                            <Alert
                                type="error"
                                title={t("Query could not run")}
                                description={<><p>{t("Check the JSON and expression syntax, limits and numeric precision settings.")}</p><span dir="auto">{t(error)}</span></>}
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        <Card
                            type="inner"
                            title={
                                <Space>
                                    <Text>{t("Result")}</Text>
                                    {hasResult && <Tag color="purple">{t(Array.isArray(result) ? "Items: {count}" : "Values: {count}", { count: matchCount })}</Tag>}
                                </Space>
                            }
                            extra={
                                hasResult && (
                                    <Button icon={<CopyOutlined />} size="small" onClick={copyResult}>
                                        {t("Copy")}
                                    </Button>
                                )
                            }
                        >
                            {hasResult ? (
                                <CodeEditor
                                    value={JSON.stringify(result, null, 2)}
                                    language="json"
                                    ariaLabel={t("JSON result editor")}
                                    height={200}
                                    readOnly
                                />
                            ) : (
                                <div style={{ textAlign: "center", padding: 20, color: "#8c8c8c" }}>
                                    {t(error ? "Fix the error to see results" : "Enter JSON and a query expression to see results")}
                                </div>
                            )}
                        </Card>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title={t("Example Expressions")} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {examples.map((example, i) => (
                                <button
                                    type="button"
                                    key={i}
                                    aria-pressed={path === example.path}
                                    style={{
                                        padding: "8px 12px",
                                        background: "rgba(114, 46, 209, 0.05)",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        border: path === example.path ? "1px solid #722ed1" : "1px solid transparent",
                                        color: "inherit", textAlign: "start",
                                    }}
                                    onClick={() => loadExample(example.path)}
                                >
                                    <Text code dir="ltr" style={{ fontSize: 12, display: "block", overflowWrap: "anywhere" }}>{example.path}</Text>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{t(example.desc)}</Text>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card
                        title={
                            <Space>
                                <InfoCircleOutlined />
                                <span>{t("Syntax Reference")}</span>
                            </Space>
                        }
                    >
                        <Table
                            size="small"
                            pagination={false}
                            showHeader={false}
                            dataSource={(engine === "jsonpath" ? SYNTAX_REFERENCE : [{ symbol: "foo.bar", desc: "Select a nested property" }, { symbol: "[]", desc: "Project array values" }, { symbol: "[?condition]", desc: "Filter an array" }, { symbol: "|", desc: "Pipe to another expression" }, { symbol: "length(@)", desc: "Count values" }, { symbol: "`10`", desc: "JSON literal" }]).map((s, i) => ({ ...s, key: i }))}
                            columns={[
                                {
                                    dataIndex: "symbol",
                                    width: 80,
                                    render: (text) => <Text code dir="ltr">{text}</Text>,
                                },
                                {
                                    dataIndex: "desc",
                                    render: (text) => <Text type="secondary" style={{ fontSize: 12 }}>{t(text)}</Text>,
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

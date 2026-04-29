"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Alert, Tag, Collapse } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClearOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text, Paragraph } = Typography;

const SAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York"
  },
  "tags": ["developer", "designer"]
}`;

interface ValidationResult {
    valid: boolean;
    error?: string;
    line?: number;
    column?: number;
    parsed?: unknown;
}

function validateJSON(input: string): ValidationResult {
    if (!input.trim()) {
        return { valid: false, error: "Input is empty" };
    }

    try {
        const parsed = JSON.parse(input);
        return { valid: true, parsed };
    } catch (err: any) {
        const match = err.message.match(/position (\d+)/);
        let line = 1;
        let column = 1;

        if (match) {
            const pos = parseInt(match[1], 10);
            const lines = input.substring(0, pos).split("\n");
            line = lines.length;
            column = lines[lines.length - 1].length + 1;
        }

        return {
            valid: false,
            error: err.message,
            line,
            column,
        };
    }
}

function getJSONStats(parsed: unknown): { type: string; keys?: number; length?: number; depth: number } {
    const getDepth = (obj: unknown, current = 0): number => {
        if (typeof obj !== "object" || obj === null) return current;
        if (Array.isArray(obj)) {
            return Math.max(current + 1, ...obj.map((item) => getDepth(item, current + 1)));
        }
        return Math.max(current + 1, ...Object.values(obj).map((val) => getDepth(val, current + 1)));
    };

    if (Array.isArray(parsed)) {
        return { type: "Array", length: parsed.length, depth: getDepth(parsed) };
    }
    if (typeof parsed === "object" && parsed !== null) {
        return { type: "Object", keys: Object.keys(parsed).length, depth: getDepth(parsed) };
    }
    return { type: typeof parsed, depth: 0 };
}

export default function JsonValidatorPage() {
    const [input, setInput] = useState(SAMPLE_JSON);

    const result = useMemo(() => validateJSON(input), [input]);
    const stats = useMemo(() => (result.valid && result.parsed ? getJSONStats(result.parsed) : null), [result]);

    return (
        <ToolPageLayout
            title="JSON Validator"
            description="Validate JSON syntax with detailed error messages"
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "A JSON validator checks whether a JSON document is syntactically correct according to the JSON specification. It identifies issues like missing quotes, trailing commas, and malformed structures.",
                whyUse: "Invalid JSON causes parsing errors that can crash applications. Validating JSON before processing helps catch issues early, especially when working with API responses, configs, or data imports.",
                howToUse: [
                    "Paste or type your JSON in the input editor",
                    "Validation happens automatically as you type",
                    "Errors show the exact line and character position",
                    "Valid JSON shows structure stats (objects, arrays, keys)"
                ],
                tips: [
                    "JSON requires double quotes for strings, not single quotes",
                    "Trailing commas after the last item are not allowed",
                    "Keys must be quoted strings, not bare identifiers",
                    "Use JSON5 syntax for comments (though not standard JSON)"
                ],
                useCases: [
                    "Validating API responses before processing",
                    "Debugging malformed configuration files",
                    "Checking JSON exports from databases",
                    "Verifying JSON payloads in webhooks"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        title="JSON Input"
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setInput("")}>
                                Clear
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={input}
                            onChange={(val) => setInput(val || "")}
                            language="json"
                            height={400}
                        />
                    </Card>

                    <Card title="Validation Result" style={{ marginTop: 16 }}>
                        {result.valid ? (
                            <Alert
                                type="success"
                                showIcon
                                icon={<CheckCircleOutlined />}
                                message="Valid JSON"
                                description={
                                    <Space orientation="vertical">
                                        <Text>The JSON is well-formed and valid.</Text>
                                        {stats && (
                                            <Space wrap>
                                                <Tag color="green">Type: {stats.type}</Tag>
                                                {stats.keys !== undefined && <Tag color="blue">Keys: {stats.keys}</Tag>}
                                                {stats.length !== undefined && <Tag color="blue">Length: {stats.length}</Tag>}
                                                <Tag color="purple">Depth: {stats.depth}</Tag>
                                            </Space>
                                        )}
                                    </Space>
                                }
                            />
                        ) : (
                            <Alert
                                type="error"
                                showIcon
                                icon={<CloseCircleOutlined />}
                                message="Invalid JSON"
                                description={
                                    <Space orientation="vertical">
                                        <Text>{result.error}</Text>
                                        {result.line && (
                                            <Text type="secondary">
                                                Line {result.line}, Column {result.column}
                                            </Text>
                                        )}
                                    </Space>
                                }
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Common JSON Errors">
                        <Collapse
                            ghost
                            items={[
                                {
                                    key: "1",
                                    label: "Trailing commas",
                                    children: <Text type="secondary">JSON doesn't allow trailing commas after the last item in arrays or objects.</Text>,
                                },
                                {
                                    key: "2",
                                    label: "Single quotes",
                                    children: <Text type="secondary">JSON requires double quotes for strings, not single quotes.</Text>,
                                },
                                {
                                    key: "3",
                                    label: "Unquoted keys",
                                    children: <Text type="secondary">Object keys must be enclosed in double quotes.</Text>,
                                },
                                {
                                    key: "4",
                                    label: "Comments",
                                    children: <Text type="secondary">JSON doesn't support comments. Use JSONC or JSON5 for comments.</Text>,
                                },
                                {
                                    key: "5",
                                    label: "Special values",
                                    children: <Text type="secondary">undefined, NaN, and Infinity are not valid JSON values.</Text>,
                                },
                            ]}
                        />
                    </Card>

                    <Card title="JSON Quick Reference" style={{ marginTop: 16 }}>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li>Strings must use double quotes</li>
                            <li>Numbers can be integers or floats</li>
                            <li>Booleans: true or false (lowercase)</li>
                            <li>Null value: null (lowercase)</li>
                            <li>Arrays: [item1, item2, ...]</li>
                            <li>Objects: {"{"}"key": value{"}"}</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

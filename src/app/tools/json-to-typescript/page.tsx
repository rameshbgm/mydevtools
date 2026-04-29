"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Space, Typography, Row, Col, App, Input } from "antd";
import { CodeOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text, Title } = Typography;
const { TextArea } = Input;

const SAMPLE_JSON = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "roles": ["admin", "user"],
  "metadata": {
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLogin": null
  }
}`;

function jsonToTypeScript(json: unknown, interfaceName: string = "Root", indent: number = 0): string {
    const spaces = "  ".repeat(indent);
    const lines: string[] = [];

    if (Array.isArray(json)) {
        if (json.length === 0) {
            return "unknown[]";
        }
        const itemType = jsonToTypeScript(json[0], interfaceName + "Item", indent);
        if (itemType.startsWith("interface")) {
            return itemType + "[]";
        }
        return itemType + "[]";
    }

    if (json === null) {
        return "null";
    }

    if (typeof json === "object") {
        lines.push(`interface ${interfaceName} {`);
        const nestedInterfaces: string[] = [];

        for (const [key, value] of Object.entries(json)) {
            const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
            let type: string;

            if (value === null) {
                type = "null";
            } else if (Array.isArray(value)) {
                if (value.length === 0) {
                    type = "unknown[]";
                } else if (typeof value[0] === "object" && value[0] !== null) {
                    const nestedName = capitalize(key) + "Item";
                    nestedInterfaces.push(jsonToTypeScript(value[0], nestedName, 0));
                    type = nestedName + "[]";
                } else {
                    type = typeof value[0] + "[]";
                }
            } else if (typeof value === "object") {
                const nestedName = capitalize(key);
                nestedInterfaces.push(jsonToTypeScript(value, nestedName, 0));
                type = nestedName;
            } else {
                type = typeof value;
            }

            lines.push(`  ${safeKey}: ${type};`);
        }

        lines.push("}");

        if (nestedInterfaces.length > 0) {
            return nestedInterfaces.join("\n\n") + "\n\n" + lines.join("\n");
        }
        return lines.join("\n");
    }

    return typeof json;
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function JsonToTypescriptPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState(SAMPLE_JSON);
    const [output, setOutput] = useState("");
    const [interfaceName, setInterfaceName] = useState("Root");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const parsed = JSON.parse(input);
            const ts = jsonToTypeScript(parsed, interfaceName);
            setOutput(ts);
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setOutput("");
        }
    }, [input, interfaceName]);

    return (
        <ToolPageLayout
            title="JSON to TypeScript"
            description="Convert JSON to TypeScript interfaces"
            icon={<CodeOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "A JSON to TypeScript converter analyzes JSON data structure and generates corresponding TypeScript interfaces. It infers types from values and creates nested interfaces for complex objects.",
                whyUse: "TypeScript interfaces provide type safety and IDE autocompletion. Instead of manually writing interfaces for API responses, this tool automatically generates them from JSON samples.",
                howToUse: [
                    "Paste a JSON sample (like an API response) in the input",
                    "Optionally customize the root interface name",
                    "The TypeScript interfaces are generated automatically",
                    "Copy and use them in your TypeScript project"
                ],
                tips: [
                    "Use a representative JSON sample with all possible fields",
                    "Review generated types - some may need manual refinement",
                    "Arrays are typed based on first element analysis",
                    "Null values generate optional properties with unknown type"
                ],
                useCases: [
                    "Creating types for REST API responses",
                    "Typing configuration file structures",
                    "Generating interfaces for JSON-based data models",
                    "Bootstrapping TypeScript projects from JSON specs"
                ]
            }}
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Text>Root Interface Name:</Text>
                <Input
                    value={interfaceName}
                    onChange={(e) => setInterfaceName(e.target.value || "Root")}
                    style={{ width: 150 }}
                    placeholder="Root"
                />
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output)} disabled={!output}>
                    Copy TypeScript
                </Button>
            </Space>

            {error && (
                <div style={{ marginBottom: 16, padding: "8px 12px", background: "rgba(255,77,79,0.1)", borderRadius: 8 }}>
                    <Text type="danger">{error}</Text>
                </div>
            )}

            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <Card size="small" title="JSON Input" styles={{ body: { padding: 0 } }}>
                        <CodeEditor
                            value={input}
                            onChange={setInput}
                            language="json"
                            height="500px"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card size="small" title="TypeScript Output" styles={{ body: { padding: 0 } }}>
                        <CodeEditor
                            value={output}
                            language="typescript"
                            height="500px"
                            readOnly
                        />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

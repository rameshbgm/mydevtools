"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Alert, Select, Segmented } from "antd";
import { CodeOutlined, CopyOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type EscapeType = "json" | "xml" | "html" | "javascript" | "sql" | "csv" | "java";

const ESCAPE_INFO: Record<EscapeType, { name: string; color: string; description: string }> = {
    json: { name: "JSON", color: "#1677ff", description: "Escape for JSON strings" },
    xml: { name: "XML", color: "#52c41a", description: "Escape for XML content" },
    html: { name: "HTML", color: "#fa541c", description: "Escape HTML entities" },
    javascript: { name: "JavaScript", color: "#f7df1e", description: "Escape for JS strings" },
    sql: { name: "SQL", color: "#faad14", description: "Escape for SQL queries" },
    csv: { name: "CSV", color: "#722ed1", description: "Escape for CSV fields" },
    java: { name: "Java/.NET", color: "#ed8b00", description: "Escape for Java/C# strings" },
};

function escapeString(input: string, type: EscapeType): string {
    switch (type) {
        case "json":
            return JSON.stringify(input).slice(1, -1);
        case "xml":
            return input
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&apos;");
        case "html":
            return input
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        case "javascript":
            return input
                .replace(/\\/g, "\\\\")
                .replace(/'/g, "\\'")
                .replace(/"/g, '\\"')
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t");
        case "sql":
            return input.replace(/'/g, "''");
        case "csv":
            if (input.includes(",") || input.includes('"') || input.includes("\n")) {
                return '"' + input.replace(/"/g, '""') + '"';
            }
            return input;
        case "java":
            return input
                .replace(/\\/g, "\\\\")
                .replace(/"/g, '\\"')
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t");
        default:
            return input;
    }
}

function unescapeString(input: string, type: EscapeType): string {
    switch (type) {
        case "json":
            try {
                return JSON.parse(`"${input}"`);
            } catch {
                return input;
            }
        case "xml":
            return input
                .replace(/&apos;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&gt;/g, ">")
                .replace(/&lt;/g, "<")
                .replace(/&amp;/g, "&");
        case "html":
            return input
                .replace(/&#39;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&gt;/g, ">")
                .replace(/&lt;/g, "<")
                .replace(/&amp;/g, "&");
        case "javascript":
        case "java":
            return input
                .replace(/\\t/g, "\t")
                .replace(/\\r/g, "\r")
                .replace(/\\n/g, "\n")
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'")
                .replace(/\\\\/g, "\\");
        case "sql":
            return input.replace(/''/g, "'");
        case "csv":
            if (input.startsWith('"') && input.endsWith('"')) {
                return input.slice(1, -1).replace(/""/g, '"');
            }
            return input;
        default:
            return input;
    }
}

export default function StringEscapePage() {
    const [input, setInput] = useState('Hello "World"!\nThis is a <test> with special & characters.');
    const [escapeType, setEscapeType] = useState<EscapeType>("json");
    const [mode, setMode] = useState<"escape" | "unescape">("escape");

    const output = useMemo(() => {
        if (!input) return "";
        return mode === "escape" ? escapeString(input, escapeType) : unescapeString(input, escapeType);
    }, [input, escapeType, mode]);

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        message.success("Copied!");
    };

    const swapContent = () => {
        setInput(output);
        setMode(mode === "escape" ? "unescape" : "escape");
    };

    return (
        <ToolPageLayout
            title="String Escape/Unescape"
            description="Escape and unescape strings for various formats"
            icon={<CodeOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: "String escaping converts special characters into escape sequences that can be safely used in different contexts (JSON, HTML, XML, regex, etc.). Unescaping reverses this process.",
                whyUse: "Special characters can break code or cause security issues. Proper escaping is essential for JSON strings, HTML content, SQL queries, and regular expressions.",
                howToUse: [
                    "Choose escape or unescape mode",
                    "Select the target format (JSON, HTML, XML, etc.)",
                    "Paste your string in the input",
                    "Copy the transformed output"
                ],
                tips: [
                    "JSON escaping handles quotes, newlines, tabs",
                    "HTML escaping prevents XSS vulnerabilities",
                    "Regex escaping is needed for special characters: . * + ? etc.",
                    "URL escaping handles spaces and special chars in URLs"
                ],
                useCases: [
                    "Preparing strings for JSON payloads",
                    "Escaping user input for HTML display",
                    "Creating regex patterns with literal characters",
                    "Debugging escaped string issues"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Card>
                        <Space wrap style={{ marginBottom: 16 }}>
                            <Segmented
                                value={mode}
                                onChange={(v) => setMode(v as "escape" | "unescape")}
                                options={[
                                    { value: "escape", label: "Escape" },
                                    { value: "unescape", label: "Unescape" },
                                ]}
                            />
                            <Select
                                value={escapeType}
                                onChange={setEscapeType}
                                style={{ width: 150 }}
                                options={Object.entries(ESCAPE_INFO).map(([key, info]) => ({
                                    value: key,
                                    label: info.name,
                                }))}
                            />
                            <Button onClick={swapContent}>Swap & Toggle</Button>
                        </Space>

                        <Row gutter={16}>
                            <Col xs={24} lg={12}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Input</Text>
                                <TextArea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    rows={10}
                                    placeholder="Enter text to escape/unescape..."
                                />
                            </Col>
                            <Col xs={24} lg={12}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <Text strong>Output ({ESCAPE_INFO[escapeType].name})</Text>
                                    <Button size="small" icon={<CopyOutlined />} onClick={copyOutput}>
                                        Copy
                                    </Button>
                                </div>
                                <TextArea
                                    value={output}
                                    readOnly
                                    rows={10}
                                    style={{ background: "rgba(235, 47, 150, 0.05)" }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Escape Types">
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {Object.entries(ESCAPE_INFO).map(([key, info]) => (
                                <div
                                    key={key}
                                    style={{
                                        padding: "8px 12px",
                                        background: escapeType === key ? `${info.color}10` : "rgba(0,0,0,0.02)",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        border: escapeType === key ? `1px solid ${info.color}` : "1px solid transparent",
                                    }}
                                    onClick={() => setEscapeType(key as EscapeType)}
                                >
                                    <Text strong style={{ color: info.color }}>{info.name}</Text>
                                    <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                        {info.description}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Common Escape Sequences">
                        <table style={{ width: "100%", fontSize: 13 }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: "4px 8px" }}>Char</th>
                                    <th style={{ textAlign: "left", padding: "4px 8px" }}>Escaped</th>
                                    <th style={{ textAlign: "left", padding: "4px 8px" }}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { char: "\\n", escaped: "\\\\n", desc: "Newline" },
                                    { char: "\\t", escaped: "\\\\t", desc: "Tab" },
                                    { char: "\\r", escaped: "\\\\r", desc: "Carriage return" },
                                    { char: '"', escaped: '\\"', desc: "Double quote" },
                                    { char: "'", escaped: "\\'", desc: "Single quote" },
                                    { char: "\\", escaped: "\\\\", desc: "Backslash" },
                                    { char: "<", escaped: "&lt;", desc: "Less than (HTML/XML)" },
                                    { char: ">", escaped: "&gt;", desc: "Greater than (HTML/XML)" },
                                    { char: "&", escaped: "&amp;", desc: "Ampersand (HTML/XML)" },
                                ].map((row, i) => (
                                    <tr key={i}>
                                        <td style={{ padding: "4px 8px" }}><Text code>{row.char}</Text></td>
                                        <td style={{ padding: "4px 8px" }}><Text code>{row.escaped}</Text></td>
                                        <td style={{ padding: "4px 8px" }}><Text type="secondary">{row.desc}</Text></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

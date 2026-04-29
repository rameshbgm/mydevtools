"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Alert, Switch, Select } from "antd";
import { SwapOutlined, CopyOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text } = Typography;

const SAMPLE_JSON = `{
  "bookstore": {
    "book": [
      {
        "@category": "fiction",
        "@id": "1",
        "title": {
          "@lang": "en",
          "#text": "The Great Gatsby"
        },
        "author": "F. Scott Fitzgerald",
        "year": 1925,
        "price": 10.99
      },
      {
        "@category": "non-fiction",
        "@id": "2",
        "title": {
          "@lang": "en",
          "#text": "Thinking, Fast and Slow"
        },
        "author": "Daniel Kahneman",
        "year": 2011,
        "price": 15.99
      }
    ]
  }
}`;

interface ConversionOptions {
    attributePrefix: string;
    textKey: string;
    rootElement: string;
    declaration: boolean;
    indent: number;
}

function jsonToXml(jsonString: string, options: ConversionOptions): string {
    const data = JSON.parse(jsonString);
    const indent = "  ".repeat(options.indent > 0 ? 1 : 0);

    function objectToXml(obj: unknown, tagName: string, level: number): string {
        const currentIndent = options.indent > 0 ? indent.repeat(level) : "";
        const nextIndent = options.indent > 0 ? indent.repeat(level + 1) : "";
        const newline = options.indent > 0 ? "\n" : "";

        if (obj === null || obj === undefined) {
            return `${currentIndent}<${tagName}/>`;
        }

        if (typeof obj !== "object") {
            return `${currentIndent}<${tagName}>${escapeXml(String(obj))}</${tagName}>`;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => objectToXml(item, tagName, level)).join(newline);
        }

        // Handle object
        const record = obj as Record<string, unknown>;
        const attrs: string[] = [];
        const children: string[] = [];
        let textContent = "";

        for (const [key, value] of Object.entries(record)) {
            if (key.startsWith(options.attributePrefix)) {
                const attrName = key.slice(options.attributePrefix.length);
                attrs.push(`${attrName}="${escapeXml(String(value))}"`);
            } else if (key === options.textKey) {
                textContent = escapeXml(String(value));
            } else {
                children.push(objectToXml(value, key, level + 1));
            }
        }

        const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";

        if (children.length === 0 && !textContent) {
            return `${currentIndent}<${tagName}${attrStr}/>`;
        }

        if (children.length === 0) {
            return `${currentIndent}<${tagName}${attrStr}>${textContent}</${tagName}>`;
        }

        return `${currentIndent}<${tagName}${attrStr}>${newline}${children.join(newline)}${newline}${currentIndent}</${tagName}>`;
    }

    function escapeXml(str: string): string {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }

    let xml = "";

    if (options.declaration) {
        xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
    }

    const keys = Object.keys(data);
    if (keys.length === 1) {
        xml += objectToXml(data[keys[0]], keys[0], 0);
    } else {
        xml += objectToXml(data, options.rootElement || "root", 0);
    }

    return xml;
}

export default function JsonToXmlPage() {
    const [input, setInput] = useState(SAMPLE_JSON);
    const [attributePrefix, setAttributePrefix] = useState("@");
    const [textKey, setTextKey] = useState("#text");
    const [declaration, setDeclaration] = useState(true);
    const [indent, setIndent] = useState(2);
    const [error, setError] = useState<string | null>(null);

    const output = useMemo(() => {
        setError(null);
        if (!input.trim()) return "";

        try {
            return jsonToXml(input, { attributePrefix, textKey, rootElement: "root", declaration, indent });
        } catch (err: any) {
            setError(err.message);
            return "";
        }
    }, [input, attributePrefix, textKey, declaration, indent]);

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        message.success("XML copied!");
    };

    return (
        <ToolPageLayout
            title="JSON to XML Converter"
            description="Convert JSON objects to well-formed XML"
            icon={<SwapOutlined style={{ fontSize: 24, color: "#faad14" }} />}
            color="#faad14"
            learnMore={{
                whatIs: "A JSON to XML converter transforms JavaScript Object Notation (JSON) data into eXtensible Markup Language (XML) format. It handles objects, arrays, nested structures, and supports configurable attribute prefixes.",
                whyUse: "Many enterprise systems, SOAP services, and legacy applications require XML format. This tool bridges modern JSON-based APIs with XML-based systems, making data integration seamless.",
                howToUse: [
                    "Paste your JSON data in the input editor",
                    "Configure options like attribute prefix (@) and root element name",
                    "The XML output is generated automatically",
                    "Copy the result for use in your XML-based systems"
                ],
                tips: [
                    "Use @attribute prefix convention for XML attributes: {@id: '123'}",
                    "Use #text key for element text content with attributes",
                    "Arrays are converted to repeated elements",
                    "Enable XML declaration for standalone documents"
                ],
                useCases: [
                    "Converting REST API responses to SOAP format",
                    "Generating XML configuration from JSON templates",
                    "Integrating with legacy enterprise systems",
                    "Creating XML feeds from JSON data sources"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
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
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="XML Output"
                        extra={
                            output && (
                                <Button size="small" icon={<CopyOutlined />} onClick={copyOutput}>
                                    Copy
                                </Button>
                            )
                        }
                    >
                        {error ? (
                            <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />
                        ) : null}
                        <CodeEditor
                            value={output}
                            language="xml"
                            height={400}
                            readOnly
                        />
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card title="Conversion Options">
                        <Space wrap size="large">
                            <div>
                                <Text style={{ display: "block", marginBottom: 4 }}>Attribute Prefix</Text>
                                <Select
                                    value={attributePrefix}
                                    onChange={setAttributePrefix}
                                    style={{ width: 120 }}
                                    options={[
                                        { value: "@", label: "@ (default)" },
                                        { value: "_", label: "_ (underscore)" },
                                        { value: "$", label: "$ (dollar)" },
                                    ]}
                                />
                            </div>
                            <div>
                                <Text style={{ display: "block", marginBottom: 4 }}>Text Content Key</Text>
                                <Select
                                    value={textKey}
                                    onChange={setTextKey}
                                    style={{ width: 120 }}
                                    options={[
                                        { value: "#text", label: "#text" },
                                        { value: "_text", label: "_text" },
                                        { value: "$value", label: "$value" },
                                    ]}
                                />
                            </div>
                            <div>
                                <Text style={{ display: "block", marginBottom: 4 }}>Indentation</Text>
                                <Select
                                    value={indent}
                                    onChange={setIndent}
                                    style={{ width: 120 }}
                                    options={[
                                        { value: 0, label: "None" },
                                        { value: 2, label: "2 spaces" },
                                        { value: 4, label: "4 spaces" },
                                    ]}
                                />
                            </div>
                            <div style={{ paddingTop: 22 }}>
                                <Space>
                                    <Switch checked={declaration} onChange={setDeclaration} />
                                    <Text>XML Declaration</Text>
                                </Space>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

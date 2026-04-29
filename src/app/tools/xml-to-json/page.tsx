"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Alert, Switch, Select } from "antd";
import { SwapOutlined, CopyOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text } = Typography;

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
</bookstore>`;

interface ConversionOptions {
    attributePrefix: string;
    textKey: string;
    preserveOrder: boolean;
    compact: boolean;
}

function xmlToJson(xmlString: string, options: ConversionOptions): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");

    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
        throw new Error("Invalid XML: " + errorNode.textContent);
    }

    function nodeToObject(node: Element): unknown {
        const obj: Record<string, unknown> = {};

        // Handle attributes
        if (node.attributes.length > 0) {
            for (let i = 0; i < node.attributes.length; i++) {
                const attr = node.attributes[i];
                obj[options.attributePrefix + attr.name] = attr.value;
            }
        }

        // Handle child nodes
        const children = Array.from(node.childNodes);
        const elementChildren = children.filter((c) => c.nodeType === Node.ELEMENT_NODE) as Element[];
        const textContent = children
            .filter((c) => c.nodeType === Node.TEXT_NODE)
            .map((c) => c.textContent?.trim())
            .filter(Boolean)
            .join("");

        if (elementChildren.length === 0 && textContent) {
            // Text-only node with attributes
            if (Object.keys(obj).length > 0) {
                obj[options.textKey] = textContent;
            } else {
                return textContent;
            }
        } else {
            // Process child elements
            const childGroups: Record<string, unknown[]> = {};

            elementChildren.forEach((child) => {
                const childName = child.tagName;
                const childObj = nodeToObject(child);

                if (!childGroups[childName]) {
                    childGroups[childName] = [];
                }
                childGroups[childName].push(childObj);
            });

            // Add children to object
            for (const [name, items] of Object.entries(childGroups)) {
                obj[name] = items.length === 1 ? items[0] : items;
            }
        }

        return obj;
    }

    const root = doc.documentElement;
    const result = { [root.tagName]: nodeToObject(root) };

    return JSON.stringify(result, null, options.compact ? 0 : 2);
}

export default function XmlToJsonPage() {
    const [input, setInput] = useState(SAMPLE_XML);
    const [attributePrefix, setAttributePrefix] = useState("@");
    const [textKey, setTextKey] = useState("#text");
    const [compact, setCompact] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const output = useMemo(() => {
        setError(null);
        if (!input.trim()) return "";

        try {
            return xmlToJson(input, { attributePrefix, textKey, preserveOrder: false, compact });
        } catch (err: any) {
            setError(err.message);
            return "";
        }
    }, [input, attributePrefix, textKey, compact]);

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        message.success("JSON copied!");
    };

    return (
        <ToolPageLayout
            title="XML to JSON Converter"
            description="Convert XML documents to JSON format"
            icon={<SwapOutlined style={{ fontSize: 24, color: "#faad14" }} />}
            color="#faad14"
            learnMore={{
                whatIs: "An XML to JSON converter transforms eXtensible Markup Language (XML) documents into JavaScript Object Notation (JSON) format. It preserves attributes, text content, and nested element structures.",
                whyUse: "Modern web applications and REST APIs typically use JSON. This tool helps convert XML data from legacy systems, SOAP services, or configuration files into JSON for easier processing.",
                howToUse: [
                    "Paste your XML content in the input editor",
                    "Configure attribute prefix and text content key",
                    "Choose between compact and verbose output formats",
                    "Copy the JSON result for use in your application"
                ],
                tips: [
                    "Attributes are prefixed with @ by default",
                    "Text content uses #text key when mixed with attributes",
                    "Repeated elements become arrays automatically",
                    "Invalid XML will show parsing errors"
                ],
                useCases: [
                    "Converting SOAP API responses to JSON",
                    "Parsing XML configuration files in Node.js",
                    "Migrating data from XML-based systems",
                    "Processing RSS/Atom feeds in JavaScript"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
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
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="JSON Output"
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
                            language="json"
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
                                        { value: "", label: "None" },
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
                                        { value: "value", label: "value" },
                                    ]}
                                />
                            </div>
                            <div style={{ paddingTop: 22 }}>
                                <Space>
                                    <Switch checked={compact} onChange={setCompact} />
                                    <Text>Compact Output</Text>
                                </Space>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

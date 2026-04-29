"use client";

import React, { useState, useEffect } from "react";
import { Card, Segmented, Space, Button, App, Tag, Typography } from "antd";
import { copyToClipboard } from "@/lib/clipboard";
import { CopyOutlined, ClearOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text } = Typography;

const SAMPLE = `<?xml version="1.0"?><catalog><book id="1"><title>XML Developer's Guide</title><author>Gambardella</author><price>44.95</price></book><book id="2"><title>Midnight Rain</title><author>Ralls</author><price>5.95</price></book></catalog>`;

function formatXml(xml: string): string {
    let formatted = "";
    let indent = 0;
    const tab = "  ";
    xml.split(/>\s*</).forEach((node) => {
        if (node.match(/^\/\w/)) indent--;
        formatted += "\n" + tab.repeat(Math.max(indent, 0)) + "<" + node + ">";
        if (node.match(/^<?\w[^>]*[^/]$/) && !node.startsWith("?")) indent++;
    });
    return formatted.substring(1).replace(/</g, "<").replace(/<</g, "<");
}

function minifyXml(xml: string): string {
    return xml.replace(/>\s+</g, "><").replace(/\n/g, "").replace(/\s{2,}/g, " ").trim();
}

function validateXml(xml: string): { valid: boolean; error: string } {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "application/xml");
        const err = doc.querySelector("parsererror");
        if (err) return { valid: false, error: err.textContent ?? "Parse error" };
        return { valid: true, error: "" };
    } catch (e) {
        return { valid: false, error: e instanceof Error ? e.message : "Unknown error" };
    }
}

type Mode = "Prettify" | "Minify" | "Validate";

export default function XmlFormatterPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState(SAMPLE);
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<Mode>("Prettify");
    const [validState, setValidState] = useState<{ valid: boolean; error: string } | null>(null);

    const run = (m: Mode, src: string) => {
        setValidState(null);
        if (m === "Prettify") {
            try { setOutput(formatXml(src)); }
            catch { message.error("Error formatting XML"); setOutput(""); }
        } else if (m === "Minify") {
            try { setOutput(minifyXml(src)); }
            catch { message.error("Error minifying XML"); setOutput(""); }
        } else {
            const result = validateXml(src);
            setValidState(result);
            if (result.valid) message.success("✅ Valid XML!");
            else message.error("❌ Invalid XML");
            setOutput("");
        }
    };

    useEffect(() => { if (input) run(mode, input); }, [mode]);

    return (
        <ToolPageLayout
            title="XML Formatter"
            description="Format, prettify, minify and validate XML documents"
            icon={<FileTextOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "An XML Formatter is a tool that transforms raw XML (eXtensible Markup Language) data into properly indented, readable format. It can also minify XML by removing whitespace, or validate XML structure to ensure it's well-formed.",
                whyUse: "XML is widely used in enterprise applications, SOAP web services, configuration files, and data exchange. Properly formatted XML is essential for debugging, code reviews, and understanding complex document structures.",
                howToUse: [
                    "Paste your XML content into the input editor",
                    "Select 'Prettify' to format, 'Minify' to compress, or 'Validate' to check syntax",
                    "View the result in the output panel",
                    "Copy the formatted XML with one click"
                ],
                tips: [
                    "Use validation to catch missing closing tags or malformed elements",
                    "Minify XML before storage or transmission to save bandwidth",
                    "The formatter handles nested elements, attributes, and namespaces",
                    "Works with SOAP envelopes, configuration files, and data feeds"
                ],
                useCases: [
                    "Formatting SOAP API responses for debugging",
                    "Beautifying XML configuration files (web.config, pom.xml)",
                    "Validating XML documents before processing",
                    "Preparing XML for version control readability"
                ]
            }}
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Segmented<Mode>
                    options={["Prettify", "Minify", "Validate"]}
                    value={mode}
                    onChange={(v) => setMode(v)}
                    size="large"
                />
                {validState?.valid === true && <Tag icon={<CheckCircleOutlined />} color="success">Valid XML</Tag>}
                {validState?.valid === false && <Tag icon={<CloseCircleOutlined />} color="error">Invalid XML</Tag>}
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output || input)}>Copy</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); setValidState(null); }}>Clear</Button>
            </Space>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Card size="small" title="Input" styles={{ body: { padding: 0 } }}>
                    <CodeEditor value={input} onChange={(v) => { setInput(v); run(mode, v); }} language="xml" height="500px" />
                </Card>
                <Card size="small" title={mode === "Validate" ? "Validation" : "Output"} styles={{ body: mode === "Validate" ? { padding: 24 } : { padding: 0 } }}>
                    {mode === "Validate" ? (
                        validState ? (
                            <div style={{ textAlign: "center", paddingTop: 60 }}>
                                {validState.valid
                                    ? <CheckCircleOutlined style={{ fontSize: 64, color: "#52c41a" }} />
                                    : <CloseCircleOutlined style={{ fontSize: 64, color: "#f5222d" }} />
                                }
                                <div style={{ marginTop: 16, fontSize: 18 }}>
                                    <Text type={validState.valid ? "success" : "danger"}>
                                        {validState.valid ? "XML is valid!" : "XML is invalid"}
                                    </Text>
                                </div>
                                {!validState.valid && (
                                    <pre style={{ marginTop: 16, fontSize: 12, textAlign: "left", background: "#1a1a1a", padding: 16, borderRadius: 8, whiteSpace: "pre-wrap", color: "#f5222d" }}>
                                        {validState.error}
                                    </pre>
                                )}
                            </div>
                        ) : (
                            <Text type="secondary" style={{ display: "block", padding: "80px 0", textAlign: "center" }}>Paste XML and it will be validated automatically</Text>
                        )
                    ) : (
                        <CodeEditor value={output} language="xml" height="500px" readOnly />
                    )}
                </Card>
            </div>
        </ToolPageLayout>
    );
}

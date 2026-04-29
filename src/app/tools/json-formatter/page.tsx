"use client";

import React, { useState, useEffect } from "react";
import { Button, Space, Card, Segmented, App, Tag, Typography } from "antd";
import { copyToClipboard } from "@/lib/clipboard";
import {
    CopyOutlined,
    ClearOutlined,
    CodeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text } = Typography;

const SAMPLE = `{"name":"mydevtools","version":"1.0.0","features":["json-formatter","xml-formatter","diff-tools"],"config":{"theme":"dark","language":"en"}}`;

type Mode = "Prettify" | "Minify" | "Validate";

export default function JsonFormatterPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState(SAMPLE);
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<Mode>("Prettify");
    const [validState, setValidState] = useState<"valid" | "invalid" | null>(null);

    const run = (m: Mode, src: string) => {
        setValidState(null);
        if (m === "Prettify") {
            try {
                setOutput(JSON.stringify(JSON.parse(src), null, 2));
            } catch (e: unknown) {
                message.error("Invalid JSON: " + (e instanceof Error ? e.message : "Parse error"));
                setOutput("");
            }
        } else if (m === "Minify") {
            try {
                setOutput(JSON.stringify(JSON.parse(src)));
            } catch (e: unknown) {
                message.error("Invalid JSON: " + (e instanceof Error ? e.message : "Parse error"));
                setOutput("");
            }
        } else {
            try {
                JSON.parse(src);
                setValidState("valid");
                message.success("✅ Valid JSON!");
            } catch (e: unknown) {
                setValidState("invalid");
                message.error("❌ Invalid JSON: " + (e instanceof Error ? e.message : "Parse error"));
            }
            setOutput("");
        }
    };

    // Re-run when mode switches
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (input) run(mode, input); }, [mode]);

    return (
        <ToolPageLayout
            title="JSON Formatter"
            description="Prettify, minify and validate JSON"
            icon={<CodeOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "A JSON Formatter is a tool that transforms raw JSON (JavaScript Object Notation) data into a properly indented, human-readable format. It can also minify JSON by removing all unnecessary whitespace, or validate JSON syntax to ensure it's properly structured.",
                whyUse: "JSON is the most common data interchange format in modern web development. Poorly formatted JSON is difficult to read and debug. This tool helps developers quickly format API responses, configuration files, and data structures for better readability and easier debugging.",
                howToUse: [
                    "Paste your JSON data into the input editor on the left",
                    "Select 'Prettify' to format with proper indentation, 'Minify' to compress, or 'Validate' to check syntax",
                    "The output appears instantly in the right panel",
                    "Click 'Copy' to copy the result to your clipboard"
                ],
                tips: [
                    "Use Prettify mode when debugging API responses or reading config files",
                    "Use Minify mode before sending JSON over the network to reduce payload size",
                    "Validate mode is useful for catching syntax errors like missing commas or unquoted keys",
                    "The editor supports syntax highlighting for easier navigation"
                ],
                useCases: [
                    "Formatting API responses for debugging",
                    "Preparing JSON configuration files for deployment",
                    "Validating JSON payloads before sending to servers",
                    "Converting minified JSON from production logs into readable format"
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
                {validState === "valid" && (
                    <Tag icon={<CheckCircleOutlined />} color="success">Valid JSON</Tag>
                )}
                {validState === "invalid" && (
                    <Tag icon={<CloseCircleOutlined />} color="error">Invalid JSON</Tag>
                )}
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output || input)}>Copy</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); setValidState(null); }}>Clear</Button>
            </Space>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Card size="small" title="Input" styles={{ body: { padding: 0 } }}>
                    <CodeEditor
                        value={input}
                        onChange={(v) => { setInput(v); run(mode, v); }}
                        language="json"
                        height="500px"
                    />
                </Card>
                <Card
                    size="small"
                    title={mode === "Validate" ? "Validation" : "Output"}
                    styles={{ body: mode === "Validate" ? { padding: 24 } : { padding: 0 } }}
                >
                    {mode === "Validate" ? (
                        <ValidationResult state={validState} type="JSON" />
                    ) : (
                        <CodeEditor value={output} language="json" height="500px" readOnly />
                    )}
                </Card>
            </div>
        </ToolPageLayout>
    );
}

function ValidationResult({ state, type }: { state: "valid" | "invalid" | null; type: string }) {
    if (!state) {
        return (
            <Text type="secondary" style={{ display: "block", padding: "80px 0", textAlign: "center" }}>
                Paste {type} and it will be validated automatically
            </Text>
        );
    }
    return (
        <div style={{ textAlign: "center", paddingTop: 80 }}>
            {state === "valid"
                ? <CheckCircleOutlined style={{ fontSize: 64, color: "#52c41a" }} />
                : <CloseCircleOutlined style={{ fontSize: 64, color: "#f5222d" }} />
            }
            <div style={{ marginTop: 16, fontSize: 18 }}>
                <Text type={state === "valid" ? "success" : "danger"}>
                    {state === "valid" ? `${type} is valid!` : `${type} is invalid`}
                </Text>
            </div>
        </div>
    );
}

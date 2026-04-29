"use client";

import React, { useState, useEffect } from "react";
import { Button, Space, Card, Segmented, App, Tag, InputNumber, Typography } from "antd";
import { copyToClipboard } from "@/lib/clipboard";
import {
    CopyOutlined,
    ClearOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import YAML from "yaml";

const { Text } = Typography;

const SAMPLE = `name: mydevtools
version: 1.0.0
features:
  - yaml-formatter
  - json-formatter
config:
  theme: dark
  language: en
  modules:
    - id: 1
      enabled: true
    - id: 2
      enabled: false
`;

type Mode = "Format" | "Minify" | "Validate";

export default function YamlFormatterPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState(SAMPLE);
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<Mode>("Format");
    const [indent, setIndent] = useState(2);
    const [validState, setValidState] = useState<"valid" | "invalid" | null>(null);

    const run = (m: Mode, src: string, ind: number) => {
        setValidState(null);
        if (!src.trim()) {
            setOutput("");
            return;
        }
        try {
            const parsed = YAML.parse(src);
            if (m === "Format") {
                setOutput(YAML.stringify(parsed, { indent: ind }));
            } else if (m === "Minify") {
                setOutput(YAML.stringify(parsed, { indent: 1, lineWidth: -1, minContentWidth: 0 }).trim());
            } else {
                setValidState("valid");
                setOutput("");
                message.success("Valid YAML");
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Parse error";
            if (m === "Validate") {
                setValidState("invalid");
                message.error("Invalid YAML: " + msg);
            } else {
                message.error("Invalid YAML: " + msg);
            }
            setOutput("");
        }
    };

    useEffect(() => {
        if (input) run(mode, input, indent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, indent]);

    return (
        <ToolPageLayout
            title="YAML Formatter"
            description="Format, validate and beautify YAML documents"
            icon={<FileTextOutlined style={{ fontSize: 24, color: "#cb171e" }} />}
            color="#cb171e"
            learnMore={{
                whatIs:
                    "A YAML formatter parses YAML documents and re-emits them with consistent indentation and structure. It can validate syntax, normalize quoting, and pretty-print or minify YAML used in Kubernetes manifests, Docker Compose, GitHub Actions, and other configuration files.",
                whyUse:
                    "YAML's whitespace-sensitive syntax makes it easy to introduce subtle bugs. This tool catches errors immediately, normalizes indentation across teams, and ensures your config files are valid before deployment.",
                howToUse: [
                    "Paste your YAML document into the input panel",
                    "Choose Format, Minify or Validate mode",
                    "Adjust the indent width (2 or 4 spaces is standard)",
                    "Copy the formatted output",
                ],
                tips: [
                    "Use 2-space indent for Kubernetes & Docker Compose",
                    "Validate mode flags syntax errors with line numbers",
                    "Anchors (&) and aliases (*) are preserved in output",
                ],
                useCases: [
                    "Cleaning up Kubernetes manifests",
                    "Validating GitHub Actions workflows",
                    "Normalizing team config files",
                ],
            }}
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Segmented<Mode>
                    options={["Format", "Minify", "Validate"]}
                    value={mode}
                    onChange={(v) => setMode(v)}
                    size="large"
                />
                <span>
                    <Text type="secondary" style={{ marginRight: 8 }}>Indent:</Text>
                    <InputNumber min={1} max={8} value={indent} onChange={(v) => setIndent(v ?? 2)} />
                </span>
                {validState === "valid" && <Tag icon={<CheckCircleOutlined />} color="success">Valid YAML</Tag>}
                {validState === "invalid" && <Tag icon={<CloseCircleOutlined />} color="error">Invalid YAML</Tag>}
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output || input)}>Copy</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); setValidState(null); }}>Clear</Button>
            </Space>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title="Input" styles={{ body: { padding: 0 } }}>
                    <CodeEditor
                        value={input}
                        onChange={(v) => { setInput(v); run(mode, v, indent); }}
                        language="yaml"
                        height="500px"
                    />
                </Card>
                <Card
                    size="small"
                    title={mode === "Validate" ? "Validation" : "Output"}
                    styles={{ body: mode === "Validate" ? { padding: 24 } : { padding: 0 } }}
                >
                    {mode === "Validate" ? (
                        <div style={{ textAlign: "center", paddingTop: 80 }}>
                            {validState === "valid" ? (
                                <CheckCircleOutlined style={{ fontSize: 64, color: "#52c41a" }} />
                            ) : validState === "invalid" ? (
                                <CloseCircleOutlined style={{ fontSize: 64, color: "#f5222d" }} />
                            ) : (
                                <Text type="secondary">Paste YAML and it will be validated automatically</Text>
                            )}
                            {validState && (
                                <div style={{ marginTop: 16, fontSize: 18 }}>
                                    <Text type={validState === "valid" ? "success" : "danger"}>
                                        {validState === "valid" ? "YAML is valid!" : "YAML is invalid"}
                                    </Text>
                                </div>
                            )}
                        </div>
                    ) : (
                        <CodeEditor value={output} language="yaml" height="500px" readOnly />
                    )}
                </Card>
            </div>
        </ToolPageLayout>
    );
}

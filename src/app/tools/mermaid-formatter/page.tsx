"use client";

import React, { useState, useEffect } from "react";
import { Button, Space, Card, Segmented, App, Tag, Typography, Alert } from "antd";
import { copyToClipboard } from "@/lib/clipboard";
import {
    CopyOutlined,
    ClearOutlined,
    FileMarkdownOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";
import type { Mermaid } from "mermaid";

const { Text } = Typography;

const SAMPLE = `graph TD;
    A[Start] --> B{Is it?};
    B -->|Yes| C[OK];
    C --> D[End];
    B -->|No| E[End];
    A -->|No| C;`

type Mode = "Format" | "Validate" | "View";

interface ShareState { input: string; mode: Mode; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "mermaid-formatter", version: 1 };

export default function MermaidFormatterPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState(SAMPLE);
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<Mode>("View");
    const [validState, setValidState] = useState<"valid" | "invalid" | null>(null);
    const [previewSvg, setPreviewSvg] = useState<string>("");
    const [error, setError] = useState<string>("");
    const mermaidRef = React.useRef<Mermaid | null>(null);

    const loadMermaid = async (): Promise<Mermaid> => {
        if (!mermaidRef.current) {
            const mermaid = (await import("mermaid")).default;
            mermaid.initialize({ theme: "base", securityLevel: "loose", fontFamily: "monospace", startOnLoad: false });
            mermaidRef.current = mermaid;
        }
        return mermaidRef.current;
    };

    const run = async (m: Mode, src: string) => {
        setValidState(null);
        setError("");
        setPreviewSvg("");

        if (!src.trim()) {
            setOutput("");
            return;
        }

        try {
            const mermaid = await loadMermaid();
            if (m === "Format") {
                const formatted = formatMermaid(src);
                setOutput(formatted);
            } else if (m === "Validate") {
                const validationResult = await validateMermaid(mermaid, src);
                setValidState(validationResult.valid ? "valid" : "invalid");
                if (validationResult.valid) {
                    message.success("✅ Valid Mermaid!");
                } else {
                    message.error("❌ Invalid Mermaid: " + validationResult.error);
                }
                setOutput("");
            } else {
                try {
                    const svg = await renderMermaid(mermaid, src);
                    setPreviewSvg(svg);
                    setOutput("");
                } catch (e) {
                    setError(e instanceof Error ? e.message : "Rendering error");
                    setOutput("");
                }
            }
        } catch (e: unknown) {
            const errMessage = e instanceof Error ? e.message : "Processing error";
            if (m === "Validate") {
                setValidState("invalid");
                message.error("❌ Invalid Mermaid: " + errMessage);
            } else {
                message.error("Error: " + errMessage);
            }
            setOutput("");
        }
    };

    const formatMermaid = (code: string): string => {
        const lines = code.split('\n');
        const indent = 2;
        const indentStr = ' '.repeat(indent);

        return lines.map((line) => {
            const trimmed = line.trim();
            if (!trimmed) return '';

            const hasSemicolon = trimmed.endsWith('%;');
            const words = trimmed.replace(/[;]$/, '').split(/\s+/);

            if (words.length > 1 && words[1] === '{') {
                return indentStr + words.join(' ');
            }

            if (words.length > 1 && words[0] === 'end') {
                return indentStr + words.join(' ');
            }

            return indentStr + trimmed;
        }).join('\n');
    };

    const validateMermaid = async (mermaid: Mermaid, code: string): Promise<{ valid: boolean; error?: string }> => {
        const cleanedCode = code.split('\n').map(line => line.trim()).join('\n');

        try {
            await mermaid.parse(cleanedCode);
            return { valid: true };
        } catch (e) {
            return { valid: false, error: e instanceof Error ? e.message : "Parse error" };
        }
    };

    const renderMermaid = async (mermaid: Mermaid, code: string): Promise<string> => {
        const { svg } = await mermaid.render('mermaid-diagram', code);
        return svg;
    };

    useEffect(() => {
        if (input) run(mode, input);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    useEffect(() => {
        if (input && mode === "View") {
            run("View", input);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    useShareableState(SHARE_SCHEMA, (s) => {
        setInput(s.input);
        setMode(s.mode);
        setTimeout(() => run(s.mode, s.input), 100);
    });

    return (
        <ToolPageLayout
            title="Mermaid Formatter"
            description="Format, validate and preview Mermaid diagrams and flowcharts"
            icon={<FileMarkdownOutlined style={{ fontSize: 24, color: "#667eea" }} />}
            color="#667eea"
            learnMore={{
                whatIs: "A Mermaid Formatter beautifies Mermaid diagram code by applying consistent indentation, formatting, and validation. It also renders diagrams as visual graphs and charts, making it easier to create flowcharts, sequence diagrams, class diagrams, and more.",
                whyUse: "Mermaid makes it easy to create diagrams and flowcharts from text. This tool helps you write cleaner, more readable Mermaid code with proper indentation, validates your syntax to catch errors early, and provides a live preview so you can see the rendered diagram instantly.",
                howToUse: [
                    "Paste your Mermaid diagram code into the input editor",
                    "Select 'Format' to apply consistent indentation and formatting",
                    "Choose 'Validate' to check for syntax errors and validate your diagram",
                    "Use 'View' to see a live rendered preview of your diagram",
                    "Copy formatted code or the SVG preview as needed"
                ],
                tips: [
                    "Standard indentation of 2 spaces for readability",
                    "Use validation to catch undefined shapes or syntax errors early",
                    "The preview shows exactly how your diagram will render",
                    "Copy the SVG output for use in documentation"
                ],
                useCases: [
                    "Creating flowcharts and process diagrams",
                    "Documenting API endpoints and services",
                    "Designing database schemas and relationships",
                    "Building sequence diagrams for technical documentation",
                    "Creating class diagrams for software architecture"
                ]
            }}
        >
            <ToolBridgeBanner
                accepts={["mermaid", "text"]}
                onAccept={(p) => { setInput(p.data); setTimeout(() => run(mode, p.data), 100); }}
            />

            <Space style={{ marginBottom: 16 }} wrap>
                <Segmented<Mode>
                    options={["Format", "Validate", "View"]}
                    value={mode}
                    onChange={(v) => setMode(v)}
                    size="large"
                />
                {validState === "valid" && (
                    <Tag icon={<CheckCircleOutlined />} color="success">Valid Mermaid</Tag>
                )}
                {validState === "invalid" && (
                    <Tag icon={<CloseCircleOutlined />} color="error">Invalid Mermaid</Tag>
                )}
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output || input)}>Copy</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); setValidState(null); setPreviewSvg(""); setError(""); }}>Clear</Button>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ input, mode })} size="middle" />
                <SendToButton data={output || input} kind="mermaid" sourceToolId="mermaid-formatter" size="middle" />
            </Space>

            {mode === "View" && previewSvg && (
                <Alert
                    title="Preview is generated by Mermaid.js"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title="Input" styles={{ body: { padding: 0 } }}>
                    <CodeEditor
                        value={input}
                        onChange={(v) => { setInput(v); run(mode, v); }}
                        language="text"
                        height="500px"
                    />
                </Card>
                <Card
                    size="small"
                    title={mode === "Validate" ? "Validation" : mode === "View" ? "Preview" : "Output"}
                    styles={{ body: mode === "Validate" ? { padding: 24 } : mode === "View" ? { padding: 32, textAlign: "center" } : { padding: 0 } }}
                >
                    {mode === "Validate" ? (
                        <div style={{ textAlign: "center", paddingTop: 80 }}>
                            {validState === "valid" ? (
                                <CheckCircleOutlined style={{ fontSize: 64, color: "#52c41a" }} />
                            ) : validState === "invalid" ? (
                                <CloseCircleOutlined style={{ fontSize: 64, color: "#f5222d" }} />
                            ) : (
                                <Text type="secondary">Paste Mermaid and it will be validated automatically</Text>
                            )}
                            {validState && (
                                <div style={{ marginTop: 16, fontSize: 18 }}>
                                    <Text type={validState === "valid" ? "success" : "danger"}>
                                        {validState === "valid" ? "Mermaid is valid!" : "Mermaid is invalid"}
                                    </Text>
                                </div>
                            )}
                        </div>
                    ) : mode === "View" ? (
                        previewSvg ? (
                            <div dangerouslySetInnerHTML={{ __html: previewSvg }} />
                        ) : error ? (
                            <div>
                                <Text type="danger">{error}</Text>
                            </div>
                        ) : (
                            <Text type="secondary" style={{ display: "block", padding: "80px 0", textAlign: "center" }}>
                                Paste Mermaid diagram and it will be rendered here
                            </Text>
                        )
                    ) : (
                        <CodeEditor value={output} language="text" height="500px" readOnly />
                    )}
                </Card>
            </div>
        </ToolPageLayout>
    );
}
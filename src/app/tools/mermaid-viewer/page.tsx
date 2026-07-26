"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Space, Card, App, Typography, Select, Segmented } from "antd";
import { copyToClipboard } from "@/lib/clipboard";
import {
    CopyOutlined,
    ClearOutlined,
    EyeOutlined,
    DownloadOutlined,
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

type Theme = "default" | "dark" | "forest" | "neutral" | "base";

interface ShareState { input: string; theme: Theme; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "mermaid-viewer", version: 1 };

export default function MermaidViewerPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState(SAMPLE);
    const [previewSvg, setPreviewSvg] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [theme, setTheme] = useState<Theme>("default");
    const containerRef = useRef<HTMLDivElement>(null);
    const mermaidRef = useRef<Mermaid | null>(null);
    const initedThemeRef = useRef<Theme | null>(null);

    const renderDiagram = useCallback(async (src: string, t: Theme) => {
        setError("");
        setPreviewSvg("");

        if (!src.trim()) return;

        try {
            if (!mermaidRef.current) {
                mermaidRef.current = (await import("mermaid")).default;
            }
            const mermaid = mermaidRef.current;
            if (initedThemeRef.current !== t) {
                mermaid.initialize({ theme: t, securityLevel: "loose", fontFamily: "monospace", startOnLoad: false });
                initedThemeRef.current = t;
            }
            await mermaid.parse(src);
            const { svg } = await mermaid.render("mermaid-viewer-diagram", src);
            setPreviewSvg(svg);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Rendering error");
        }
    }, []);

    useEffect(() => {
        renderDiagram(input, theme);
    }, [input, theme, renderDiagram]);

    useShareableState(SHARE_SCHEMA, (s) => {
        setInput(s.input);
        setTheme(s.theme);
        setTimeout(() => renderDiagram(s.input, s.theme), 100);
    });

    const handleDownload = () => {
        if (!previewSvg) return;
        const blob = new Blob([previewSvg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diagram.svg";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <ToolPageLayout
            title="Mermaid Viewer"
            description="Render and preview Mermaid diagrams with live editing, theme support, and SVG export"
            icon={<EyeOutlined style={{ fontSize: 24, color: "#667eea" }} />}
            color="#667eea"
            learnMore={{
                whatIs: "A Mermaid Viewer is a dedicated tool for rendering Mermaid diagram code as visual SVG graphics. It provides live preview, multiple theme options, and the ability to export diagrams as SVG files.",
                whyUse: "Mermaid lets you create diagrams and flowcharts from plain text. This viewer focuses purely on rendering, giving you a clean side-by-side editing experience with real-time updates and theme switching.",
                howToUse: [
                    "Paste your Mermaid diagram code into the input editor",
                    "See the rendered diagram update live in the preview panel",
                    "Switch themes (default, dark, forest, neutral, base) to match your style",
                    "Download the diagram as SVG for use in documentation",
                    "Share the diagram state via URL with the share button"
                ],
                tips: [
                    "The preview updates in real-time as you type",
                    "Try different themes to find the best look for your diagram",
                    "Export as SVG for high-quality vector graphics",
                    "Use the share button to create a link with your current diagram and theme"
                ],
                useCases: [
                    "Creating flowcharts and process diagrams",
                    "Building sequence diagrams for documentation",
                    "Designing entity-relationship diagrams",
                    "Rendering Gantt charts for project planning",
                    "Exporting diagrams for presentations and reports"
                ]
            }}
        >
            <ToolBridgeBanner
                accepts={["mermaid", "text"]}
                onAccept={(p) => { setInput(p.data); renderDiagram(p.data, theme); }}
            />

            <Space style={{ marginBottom: 16 }} wrap>
                <Select
                    value={theme}
                    onChange={(v) => setTheme(v)}
                    options={[
                        { value: "default", label: "Default" },
                        { value: "dark", label: "Dark" },
                        { value: "forest", label: "Forest" },
                        { value: "neutral", label: "Neutral" },
                        { value: "base", label: "Base" },
                    ]}
                    style={{ width: 140 }}
                    size="large"
                />
                <Button icon={<DownloadOutlined />} disabled={!previewSvg} onClick={handleDownload}>
                    Download SVG
                </Button>
                <Button icon={<CopyOutlined />} onClick={() => {
                    if (previewSvg) {
                        copyToClipboard(previewSvg);
                        message.success("SVG copied to clipboard");
                    } else {
                        copyToClipboard(input);
                    }
                }}>
                    Copy
                </Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setPreviewSvg(""); setError(""); }}>
                    Clear
                </Button>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ input, theme })} size="middle" />
                <SendToButton data={input} kind="mermaid" sourceToolId="mermaid-viewer" size="middle" />
            </Space>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title="Input" styles={{ body: { padding: 0 } }}>
                    <CodeEditor
                        value={input}
                        onChange={(v) => setInput(v)}
                        language="text"
                        height="500px"
                    />
                </Card>
                <Card
                    size="small"
                    title="Preview"
                    styles={{ body: { padding: 32, textAlign: "center", minHeight: 500 } }}
                >
                    {previewSvg ? (
                        <div ref={containerRef} style={{
                            background: theme === "dark" ? "#1e1e1e" : "#ffffff",
                            borderRadius: 8,
                            padding: 24,
                            overflow: "auto",
                            maxHeight: 600,
                        }}>
                            <div dangerouslySetInnerHTML={{ __html: previewSvg }} />
                        </div>
                    ) : error ? (
                        <div style={{ paddingTop: 80 }}>
                            <Text type="danger">{error}</Text>
                        </div>
                    ) : (
                        <Text type="secondary" style={{ display: "block", padding: "80px 0", textAlign: "center" }}>
                            Paste Mermaid diagram code and it will be rendered here
                        </Text>
                    )}
                </Card>
            </div>
        </ToolPageLayout>
    );
}

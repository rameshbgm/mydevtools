"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Space, Card, App, Typography, Select } from "antd";
import { copyToClipboard } from "@/lib/clipboard";
import {
    CopyOutlined,
    ClearOutlined,
    EyeOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
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
    const { t } = useLanguage();
    const translationRef = React.useRef(t);
    useEffect(() => { translationRef.current = t; }, [t]);
    const { message } = App.useApp();
    const [input, setInput] = useState(SAMPLE);
    const [previewSvg, setPreviewSvg] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [theme, setTheme] = useState<Theme>("default");
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
                mermaid.initialize({ theme: t, securityLevel: "strict", fontFamily: "monospace", startOnLoad: false });
                initedThemeRef.current = t;
            }
            await mermaid.parse(src);
            const { svg } = await mermaid.render("mermaid-viewer-diagram", src);
            setPreviewSvg(svg);
        } catch (e) {
            setError(e instanceof Error ? e.message : translationRef.current("Rendering error"));
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
            title={t("Mermaid Viewer")}
            description={t("Render and preview Mermaid diagrams with live editing, theme support, and SVG export")}
            icon={<EyeOutlined style={{ fontSize: 24, color: "#667eea" }} />}
            color="#667eea"
            learnMore={{
                whatIs: "Render Mermaid text diagrams with live preview and SVG export.",
                whyUse: "Create flowcharts, sequence diagrams and documentation graphics.",
                howToUse: [
                    "Enter Mermaid code, choose a theme and download the SVG.",
                ],
                tips: [
                    "A shared link contains the diagram code and theme.",
                ],
            }}
        >
            <ToolBridgeBanner
                accepts={["mermaid", "text"]}
                onAccept={(p) => { setInput(p.data); renderDiagram(p.data, theme); }}
            />

            <Space style={{ marginBottom: 16 }} wrap>
                <Select aria-label={t("Diagram theme")}
                    value={theme}
                    onChange={(v) => setTheme(v)}
                    options={[
                        { value: "default", label: t("Default") },
                        { value: "dark", label: t("Dark") },
                        { value: "forest", label: t("Forest") },
                        { value: "neutral", label: t("Neutral") },
                        { value: "base", label: t("Base") },
                    ]}
                    style={{ minWidth: 140, maxWidth: "100%" }}
                    size="large"
                />
                <Button icon={<DownloadOutlined />} disabled={!previewSvg} onClick={handleDownload}>
                    {t("Download SVG")}</Button>
                <Button icon={<CopyOutlined />} onClick={() => {
                    if (previewSvg) {
                        copyToClipboard(previewSvg);
                        message.success(t("SVG copied to clipboard"));
                    } else {
                        copyToClipboard(input);
                    }
                }}>
                    {t("Copy")}</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setPreviewSvg(""); setError(""); }}>
                    {t("Clear")}</Button>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ input, theme })} size="middle" />
                <SendToButton data={input} kind="mermaid" sourceToolId="mermaid-viewer" size="middle" />
            </Space>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title={t("Input")} styles={{ body: { padding: 0 } }}>
                    <CodeEditor ariaLabel={t("Diagram code editor")} value={input}
                        onChange={(v) => setInput(v)}
                        language="text"
                        height="500px"
                    />
                </Card>
                <Card
                    size="small"
                    title={t("Preview")}
                    styles={{ body: { padding: 32, textAlign: "center", minHeight: 500 } }}
                >
                    {previewSvg ? (
                        <div style={{
                            background: theme === "dark" ? "#1e1e1e" : "#ffffff",
                            borderRadius: 8,
                            padding: 24,
                            overflow: "auto",
                            maxHeight: 600,
                        }}>
                            <iframe
                                title={t("Mermaid diagram preview")}
                                sandbox=""
                                referrerPolicy="no-referrer"
                                srcDoc={previewSvg}
                                style={{ width: "100%", minHeight: 500, border: 0, background: theme === "dark" ? "#1e1e1e" : "#ffffff" }}
                            />
                        </div>
                    ) : error ? (
                        <div style={{ paddingTop: 80 }}>
                            <Text type="danger">{error}</Text>
                        </div>
                    ) : (
                        <Text type="secondary" style={{ display: "block", padding: "80px 0", textAlign: "center" }}>
                            {t("Paste Mermaid diagram code and it will be rendered here")}</Text>
                    )}
                </Card>
            </div>
        </ToolPageLayout>
    );
}

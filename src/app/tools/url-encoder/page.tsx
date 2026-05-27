"use client";

import React, { useState } from "react";
import { Button, Input, Card, Space, message, Segmented } from "antd";
import { copyToClipboard } from "@/lib/clipboard";
import { LinkOutlined, CopyOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

const { TextArea } = Input;

interface ShareState { input: string; mode: string; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "url-encoder", version: 1 };

export default function UrlEncoderPage() {
    const [input, setInput] = useState("https://example.com/path?name=John Doe&city=New York");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<string>("Encode");

    const handleAction = (overrideMode?: string, overrideInput?: string) => {
        const m = overrideMode ?? mode;
        const src = overrideInput ?? input;
        try {
            if (m === "Encode") setOutput(encodeURIComponent(src));
            else setOutput(decodeURIComponent(src));
        } catch {
            message.error("Invalid input");
        }
    };

    useShareableState(SHARE_SCHEMA, (s) => {
        setInput(s.input); setMode(s.mode);
        handleAction(s.mode, s.input);
    });

    return (
        <ToolPageLayout
            title="URL Encode / Decode"
            description="Encode and decode URL components"
            icon={<LinkOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "URL encoding (also called percent-encoding) converts special characters to their percent-encoded equivalents, making them safe for use in URLs. Spaces become %20, special characters become %XX format.",
                whyUse: "URLs can only contain certain ASCII characters. Special characters, spaces, and non-ASCII characters must be encoded to be transmitted correctly in URLs, query strings, and form data.",
                howToUse: [
                    "Select 'Encode' to encode special characters or 'Decode' to decode them",
                    "Paste your URL or text with special characters",
                    "Click the action button to transform",
                    "Copy the URL-safe result"
                ],
                tips: [
                    "Common encoded characters: space=%20, &=%26, ?=%3F, =%3D",
                    "Use encoding for query string parameters with special characters",
                    "Decode URLs to see their actual content and parameters",
                    "encodeURIComponent() is safer than encodeURI() for query params"
                ],
                useCases: [
                    "Encoding query string parameters for API requests",
                    "Making URLs with special characters safe to share",
                    "Debugging encoded URLs from logs or analytics",
                    "Preparing form data for submission"
                ]
            }}
        >
            <ToolBridgeBanner
                accepts={["text", "url"]}
                onAccept={(p) => { setInput(p.data); handleAction(undefined, p.data); }}
            />

            <Space style={{ marginBottom: 16 }} wrap>
                <Segmented options={["Encode", "Decode"]} value={mode} onChange={(v) => setMode(v as string)} />
                <Button type="primary" onClick={() => handleAction()}>{mode}</Button>
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output)}>Copy</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); }}>Clear</Button>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ input, mode })} />
                <SendToButton data={output} kind={mode === "Encode" ? "url" : "text"} sourceToolId="url-encoder" />
            </Space>
            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title="Input">
                    <TextArea rows={10} value={input} onChange={(e) => setInput(e.target.value)} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }} />
                </Card>
                <Card size="small" title="Output">
                    <TextArea rows={10} value={output} readOnly style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }} />
                </Card>
            </div>
        </ToolPageLayout>
    );
}

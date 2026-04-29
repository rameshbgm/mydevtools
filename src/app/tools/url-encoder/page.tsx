"use client";

import React, { useState } from "react";
import { Button, Input, Card, Space, message, Segmented } from "antd";
import { copyToClipboard } from "@/lib/clipboard";
import { LinkOutlined, CopyOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;

export default function UrlEncoderPage() {
    const [input, setInput] = useState("https://example.com/path?name=John Doe&city=New York");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<string>("Encode");

    const handleAction = () => {
        try {
            if (mode === "Encode") setOutput(encodeURIComponent(input));
            else setOutput(decodeURIComponent(input));
        } catch {
            message.error("Invalid input");
        }
    };

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
            <Space style={{ marginBottom: 16 }}>
                <Segmented options={["Encode", "Decode"]} value={mode} onChange={(v) => setMode(v as string)} />
                <Button type="primary" onClick={handleAction}>{mode}</Button>
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output)}>Copy</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); }}>Clear</Button>
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

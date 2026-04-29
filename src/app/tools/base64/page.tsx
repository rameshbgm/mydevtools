"use client";

import React, { useState } from "react";
import { Button, Input, Card, Space, message, Segmented } from "antd";
import { copyToClipboard } from "@/lib/clipboard";
import { SwapOutlined, CopyOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;

export default function Base64Page() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<string>("Encode");

    const handleAction = () => {
        try {
            if (mode === "Encode") {
                setOutput(btoa(unescape(encodeURIComponent(input))));
            } else {
                setOutput(decodeURIComponent(escape(atob(input))));
            }
        } catch {
            message.error("Invalid input for " + mode.toLowerCase());
        }
    };

    return (
        <ToolPageLayout
            title="Base64 Encode / Decode"
            description="Encode and decode Base64 strings"
            icon={<SwapOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's commonly used to encode data that needs to be stored or transferred via media designed for text.",
                whyUse: "Base64 encoding is essential for embedding images in HTML/CSS, transmitting binary data in JSON/XML, encoding email attachments (MIME), and storing binary data in databases or config files as text.",
                howToUse: [
                    "Select 'Encode' to convert text to Base64 or 'Decode' to convert Base64 back to text",
                    "Paste your input text or Base64 string",
                    "Click the action button to transform",
                    "Copy the result from the output panel"
                ],
                tips: [
                    "Base64 encoding increases data size by approximately 33%",
                    "Supports UTF-8 text including emojis and special characters",
                    "Invalid Base64 strings will show an error when decoding",
                    "Use for data URIs like 'data:image/png;base64,...'"
                ],
                useCases: [
                    "Embedding small images directly in HTML or CSS",
                    "Encoding API authentication tokens",
                    "Transmitting binary files as text in JSON APIs",
                    "Encoding configuration secrets for environment variables"
                ]
            }}
        >
            <Space style={{ marginBottom: 16 }}>
                <Segmented options={["Encode", "Decode"]} value={mode} onChange={(v) => setMode(v as string)} />
                <Button type="primary" onClick={handleAction}>{mode}</Button>
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output)}>Copy Output</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); }}>Clear</Button>
            </Space>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Card size="small" title="Input">
                    <TextArea rows={16} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to encode/decode..." style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }} />
                </Card>
                <Card size="small" title="Output">
                    <TextArea rows={16} value={output} readOnly style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }} />
                </Card>
            </div>
        </ToolPageLayout>
    );
}

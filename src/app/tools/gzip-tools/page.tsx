"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Segmented, Statistic, Alert } from "antd";
import { CompressOutlined, CopyOutlined, SwapOutlined, ExpandAltOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// Using the built-in CompressionStream API (modern browsers)
async function compressGzip(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const cs = new CompressionStream("gzip");
    const writer = cs.writable.getWriter();
    writer.write(data);
    writer.close();

    const reader = cs.readable.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }

    // Convert to Base64
    let binary = "";
    result.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
}

async function decompressGzip(base64: string): Promise<string> {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    const ds = new DecompressionStream("gzip");
    const writer = ds.writable.getWriter();
    writer.write(bytes);
    writer.close();

    const reader = ds.readable.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }

    const decoder = new TextDecoder();
    return decoder.decode(result);
}

export default function GzipToolsPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"compress" | "decompress">("compress");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);

    const handleProcess = async () => {
        if (!input.trim()) {
            message.warning("Please enter some content");
            return;
        }

        setLoading(true);
        setError(null);
        setOutput("");
        setStats(null);

        try {
            if (mode === "compress") {
                const compressed = await compressGzip(input);
                setOutput(compressed);
                setStats({
                    original: new TextEncoder().encode(input).length,
                    compressed: compressed.length,
                });
            } else {
                const decompressed = await decompressGzip(input.trim());
                setOutput(decompressed);
                setStats({
                    original: input.length,
                    compressed: new TextEncoder().encode(decompressed).length,
                });
            }
        } catch (err: any) {
            setError(err.message || "Failed to process. Make sure the input is valid.");
        } finally {
            setLoading(false);
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        message.success("Copied to clipboard!");
    };

    const swapContent = () => {
        setInput(output);
        setOutput("");
        setStats(null);
        setMode(mode === "compress" ? "decompress" : "compress");
    };

    const loadSample = () => {
        setInput(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.`);
        setMode("compress");
    };

    const compressionRatio = stats
        ? mode === "compress"
            ? ((1 - stats.compressed / stats.original) * 100).toFixed(1)
            : ((1 - stats.original / stats.compressed) * 100).toFixed(1)
        : null;

    return (
        <ToolPageLayout
            title="Gzip Compress/Decompress"
            description="Compress and decompress text using Gzip with Base64 encoding"
            icon={<CompressOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "Gzip is a popular data compression algorithm used to reduce file sizes. This tool compresses text using Gzip and encodes the result in Base64 for easy storage and transmission as text.",
                whyUse: "Gzip compression can reduce text size by 70-90%, making it essential for web performance, API payload optimization, and efficient data storage. Base64 encoding makes compressed data portable as text.",
                howToUse: [
                    "Select 'Compress' to reduce text size or 'Decompress' to restore",
                    "Paste your text (for compression) or Base64 gzipped data (for decompression)",
                    "Click the action button to process",
                    "View compression statistics and copy the result"
                ],
                tips: [
                    "Text with repetitive patterns compresses better",
                    "The output is Base64-encoded gzip data, safe for text storage",
                    "Check the compression ratio to see how effective the compression was",
                    "Modern browsers support CompressionStream API natively"
                ],
                useCases: [
                    "Compressing large JSON payloads before storing in databases",
                    "Reducing API response sizes for faster transmission",
                    "Storing compressed data in localStorage or cookies",
                    "Testing Content-Encoding: gzip in web applications"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card>
                        <Space style={{ marginBottom: 16 }}>
                            <Segmented
                                value={mode}
                                onChange={(v) => {
                                    setMode(v as "compress" | "decompress");
                                    setOutput("");
                                    setStats(null);
                                }}
                                options={[
                                    { value: "compress", label: "Compress", icon: <CompressOutlined /> },
                                    { value: "decompress", label: "Decompress", icon: <ExpandAltOutlined /> },
                                ]}
                            />
                            <Button onClick={loadSample}>Load Sample</Button>
                            {output && (
                                <Button icon={<SwapOutlined />} onClick={swapContent}>
                                    Swap
                                </Button>
                            )}
                        </Space>

                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>
                                {mode === "compress" ? "Plain Text" : "Base64 Compressed Data"}
                            </Text>
                            <TextArea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={mode === "compress"
                                    ? "Enter text to compress..."
                                    : "Enter Base64 gzip data to decompress..."}
                                rows={8}
                            />
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            icon={mode === "compress" ? <CompressOutlined /> : <ExpandAltOutlined />}
                            onClick={handleProcess}
                            loading={loading}
                            style={{ background: "#52c41a", borderColor: "#52c41a" }}
                        >
                            {mode === "compress" ? "Compress" : "Decompress"}
                        </Button>

                        {error && (
                            <Alert
                                type="error"
                                message="Error"
                                description={error}
                                showIcon
                                style={{ marginTop: 16 }}
                            />
                        )}

                        {output && (
                            <Card
                                type="inner"
                                title={
                                    <Space>
                                        <Text strong>
                                            {mode === "compress" ? "Compressed Output (Base64)" : "Decompressed Text"}
                                        </Text>
                                    </Space>
                                }
                                extra={
                                    <Button icon={<CopyOutlined />} size="small" onClick={copyOutput}>
                                        Copy
                                    </Button>
                                }
                                style={{ marginTop: 16 }}
                            >
                                <TextArea
                                    value={output}
                                    readOnly
                                    rows={6}
                                    style={{
                                        background: "rgba(82, 196, 26, 0.05)",
                                        fontFamily: mode === "compress" ? "monospace" : "inherit",
                                    }}
                                />
                            </Card>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    {stats && (
                        <Card title="Compression Stats" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic
                                        title={mode === "compress" ? "Original" : "Compressed"}
                                        value={stats.original}
                                        suffix="bytes"
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title={mode === "compress" ? "Compressed" : "Decompressed"}
                                        value={stats.compressed}
                                        suffix="bytes"
                                    />
                                </Col>
                            </Row>
                            {compressionRatio && Number(compressionRatio) > 0 && (
                                <div style={{ marginTop: 16, textAlign: "center" }}>
                                    <Text type="secondary">Compression Ratio</Text>
                                    <div style={{ fontSize: 24, fontWeight: 600, color: "#52c41a" }}>
                                        {compressionRatio}% smaller
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    <Card title="About Gzip">
                        <Paragraph type="secondary">
                            Gzip is a popular compression algorithm used widely on the web.
                            The output here is Base64-encoded for easy copying and storage.
                        </Paragraph>
                        <Paragraph type="secondary">
                            Gzip works best on text with repeated patterns.
                            Already compressed data (like images) won't compress well.
                        </Paragraph>
                    </Card>

                    <Card title="Use Cases" style={{ marginTop: 16 }}>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li>Reduce data size for storage</li>
                            <li>Compress API payloads</li>
                            <li>Share large text snippets</li>
                            <li>Reduce bandwidth usage</li>
                            <li>Store compressed data in databases</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Segmented, Table, Tabs } from "antd";
import { TranslationOutlined, CopyOutlined, SwapOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type ConversionType = "escape" | "codepoints" | "utf8hex" | "utf16";

function textToUnicodeEscape(text: string): string {
    return Array.from(text)
        .map((char) => {
            const code = char.codePointAt(0)!;
            if (code > 0xffff) {
                return `\\u{${code.toString(16).toUpperCase()}}`;
            }
            return `\\u${code.toString(16).toUpperCase().padStart(4, "0")}`;
        })
        .join("");
}

function unicodeEscapeToText(escaped: string): string {
    return escaped
        .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function textToCodePoints(text: string): string {
    return Array.from(text)
        .map((char) => `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`)
        .join(" ");
}

function codePointsToText(codepoints: string): string {
    return codepoints
        .split(/\s+/)
        .filter(Boolean)
        .map((cp) => {
            const hex = cp.replace(/^U\+/i, "");
            return String.fromCodePoint(parseInt(hex, 16));
        })
        .join("");
}

function textToUtf8Hex(text: string): string {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    return Array.from(bytes)
        .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
        .join(" ");
}

function utf8HexToText(hex: string): string {
    const bytes = hex
        .split(/\s+/)
        .filter(Boolean)
        .map((h) => parseInt(h, 16));
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(bytes));
}

function textToUtf16(text: string): string {
    return Array.from(text)
        .map((char) => {
            const code = char.charCodeAt(0);
            return code.toString(16).toUpperCase().padStart(4, "0");
        })
        .join(" ");
}

function utf16ToText(hex: string): string {
    return hex
        .split(/\s+/)
        .filter(Boolean)
        .map((h) => String.fromCharCode(parseInt(h, 16)))
        .join("");
}

export default function UnicodeConverterPage() {
    const [input, setInput] = useState("Hello, World! 🌍");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [conversionType, setConversionType] = useState<ConversionType>("escape");

    const output = useMemo(() => {
        if (!input) return "";

        try {
            if (mode === "encode") {
                switch (conversionType) {
                    case "escape": return textToUnicodeEscape(input);
                    case "codepoints": return textToCodePoints(input);
                    case "utf8hex": return textToUtf8Hex(input);
                    case "utf16": return textToUtf16(input);
                }
            } else {
                switch (conversionType) {
                    case "escape": return unicodeEscapeToText(input);
                    case "codepoints": return codePointsToText(input);
                    case "utf8hex": return utf8HexToText(input);
                    case "utf16": return utf16ToText(input);
                }
            }
        } catch (e) {
            return "Error: Invalid input format";
        }
        return "";
    }, [input, mode, conversionType]);

    const charAnalysis = useMemo(() => {
        if (!input || mode !== "encode") return [];
        return Array.from(input).map((char, i) => ({
            key: i,
            char,
            codePoint: char.codePointAt(0)!,
            hex: `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`,
            escape: char.codePointAt(0)! > 0xffff
                ? `\\u{${char.codePointAt(0)!.toString(16).toUpperCase()}}`
                : `\\u${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`,
            name: getCharName(char),
        }));
    }, [input, mode]);

    const copyOutput = () => copyToClipboard(output, "Copied to clipboard!");

    const swapContent = () => {
        setInput(output);
        setMode(mode === "encode" ? "decode" : "encode");
    };

    return (
        <ToolPageLayout
            title="Unicode Converter"
            description="Convert text to/from Unicode escape sequences, code points, and UTF-8 hex"
            icon={<TranslationOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: "Unicode is a universal character encoding standard. This tool converts text to/from various Unicode representations: escape sequences (\\u0048), code points (U+0048), and UTF-8 hex bytes.",
                whyUse: "Working with international text, emojis, or special characters often requires understanding their Unicode representation. This tool helps debug encoding issues and convert between formats.",
                howToUse: [
                    "Select encode or decode mode",
                    "Choose the Unicode format type",
                    "Enter text (encode) or Unicode sequences (decode)",
                    "Copy the converted result"
                ],
                tips: [
                    "\\uXXXX works for BMP characters (U+0000 to U+FFFF)",
                    "Emojis use surrogate pairs or \\u{XXXXX} notation",
                    "UTF-8 bytes vary from 1-4 bytes per character",
                    "Use the character table to explore Unicode blocks"
                ],
                useCases: [
                    "Debugging encoding issues in international applications",
                    "Creating Unicode escape sequences for JSON/JavaScript",
                    "Analyzing character bytes for protocol work",
                    "Finding code points for special symbols"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card>
                        <Space wrap style={{ marginBottom: 16 }}>
                            <Segmented
                                value={mode}
                                onChange={(v) => setMode(v as "encode" | "decode")}
                                options={[
                                    { value: "encode", label: "Text → Unicode" },
                                    { value: "decode", label: "Unicode → Text" },
                                ]}
                            />
                            <Segmented
                                value={conversionType}
                                onChange={(v) => setConversionType(v as ConversionType)}
                                options={[
                                    { value: "escape", label: "\\uXXXX" },
                                    { value: "codepoints", label: "U+XXXX" },
                                    { value: "utf8hex", label: "UTF-8 Hex" },
                                    { value: "utf16", label: "UTF-16" },
                                ]}
                            />
                            <Button icon={<SwapOutlined />} onClick={swapContent}>
                                Swap
                            </Button>
                        </Space>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>
                                    {mode === "encode" ? "Plain Text" : "Unicode Format"}
                                </Text>
                                <TextArea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={mode === "encode"
                                        ? "Enter text to convert..."
                                        : "Enter Unicode to decode..."}
                                    rows={8}
                                />
                            </Col>
                            <Col span={12}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <Text strong>
                                        {mode === "encode" ? "Unicode Format" : "Plain Text"}
                                    </Text>
                                    <Button size="small" icon={<CopyOutlined />} onClick={copyOutput}>
                                        Copy
                                    </Button>
                                </div>
                                <TextArea
                                    value={output}
                                    readOnly
                                    rows={8}
                                    style={{ background: "rgba(19, 194, 194, 0.05)" }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {mode === "encode" && charAnalysis.length > 0 && charAnalysis.length < 50 && (
                        <Card title="Character Analysis" style={{ marginTop: 16 }}>
                            <Table
                                size="small"
                                pagination={false}
                                scroll={{ y: 200 }}
                                dataSource={charAnalysis}
                                columns={[
                                    {
                                        title: "Char",
                                        dataIndex: "char",
                                        width: 60,
                                        render: (text) => <Text code style={{ fontSize: 16 }}>{text}</Text>
                                    },
                                    {
                                        title: "Code Point",
                                        dataIndex: "hex",
                                        width: 100,
                                        render: (text) => <Text code>{text}</Text>
                                    },
                                    {
                                        title: "Escape",
                                        dataIndex: "escape",
                                        width: 120,
                                        render: (text) => <Text code style={{ fontSize: 11 }}>{text}</Text>
                                    },
                                    {
                                        title: "Name",
                                        dataIndex: "name",
                                        render: (text) => <Text type="secondary" style={{ fontSize: 11 }}>{text}</Text>
                                    },
                                ]}
                            />
                        </Card>
                    )}
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Format Reference">
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div style={{ padding: 12, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                                <Text strong>\\uXXXX (Escape)</Text>
                                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                    JavaScript/JSON Unicode escape. E.g., \u0041 = A
                                </Text>
                            </div>
                            <div style={{ padding: 12, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                                <Text strong>U+XXXX (Code Points)</Text>
                                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                    Standard Unicode notation. E.g., U+0041 = A
                                </Text>
                            </div>
                            <div style={{ padding: 12, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                                <Text strong>UTF-8 Hex</Text>
                                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                    Raw UTF-8 bytes in hexadecimal. E.g., 41 = A
                                </Text>
                            </div>
                            <div style={{ padding: 12, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                                <Text strong>UTF-16</Text>
                                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                    UTF-16 code units. E.g., 0041 = A
                                </Text>
                            </div>
                        </div>
                    </Card>

                    <Card title="Quick Examples" style={{ marginTop: 16 }}>
                        <Space wrap>
                            {["Hello", "你好", "🌍🚀", "→↓←↑", "α β γ δ"].map((ex) => (
                                <Button
                                    key={ex}
                                    size="small"
                                    onClick={() => { setInput(ex); setMode("encode"); }}
                                >
                                    {ex}
                                </Button>
                            ))}
                        </Space>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

function getCharName(char: string): string {
    const code = char.codePointAt(0)!;
    if (code >= 0x41 && code <= 0x5a) return "Latin Capital Letter";
    if (code >= 0x61 && code <= 0x7a) return "Latin Small Letter";
    if (code >= 0x30 && code <= 0x39) return "Digit";
    if (code === 0x20) return "Space";
    if (code >= 0x4e00 && code <= 0x9fff) return "CJK Character";
    if (code >= 0x1f600 && code <= 0x1f64f) return "Emoji";
    if (code >= 0x1f300 && code <= 0x1f5ff) return "Symbol/Pictograph";
    if (code >= 0x0391 && code <= 0x03c9) return "Greek Letter";
    if (code >= 0x2190 && code <= 0x21ff) return "Arrow";
    return "Character";
}

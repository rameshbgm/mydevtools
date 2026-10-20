"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Segmented, Table, Alert } from "antd";
import { TranslationOutlined, CopyOutlined, SwapOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text } = Typography;
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
    // One pass preserves escape-like text introduced by a decoded backslash.
    return escaped.replace(/\\u(?:\{([0-9a-fA-F]+)\}|([0-9a-fA-F]{4}))/g,
        (_, codePoint: string | undefined, codeUnit: string | undefined) => codePoint !== undefined
            ? String.fromCodePoint(parseInt(codePoint, 16))
            : String.fromCharCode(parseInt(codeUnit!, 16)));
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
    // UTF-16 represents supplementary characters with two code units. Iterate
    // the original units rather than the string's Unicode code-point iterator.
    return Array.from({ length: text.length }, (_, index) =>
        text.charCodeAt(index).toString(16).toUpperCase().padStart(4, "0")
    ).join(" ");
}

function utf16ToText(hex: string): string {
    return hex
        .split(/\s+/)
        .filter(Boolean)
        .map((h) => String.fromCharCode(parseInt(h, 16)))
        .join("");
}

export default function UnicodeConverterPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState("Hello, World! 🌍");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [conversionType, setConversionType] = useState<ConversionType>("escape");

    const conversion = useMemo(() => {
        const convert = () => {
            if (!input) return "";

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
            return "";
        };
        try { return { output: convert(), error: null }; }
        catch (error) { return { output: "", error: error instanceof Error ? error.message : "" }; }
    }, [input, mode, conversionType]);
    const { output, error } = conversion;

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

    const copyOutput = () => copyToClipboard(output, t("Copied to clipboard!"));

    const swapContent = () => {
        setInput(output);
        setMode(mode === "encode" ? "decode" : "encode");
    };

    return (
        <ToolPageLayout
            title={t("Unicode Converter")}
            description={t("Convert text to/from Unicode escape sequences, code points, and UTF-8 hex")}
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
            {error !== null && <Alert type="error" showIcon title={t("Invalid Unicode input. Check the selected format and code point range, then try again.")} description={error && <pre dir="ltr" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{error}</pre>} style={{ marginBottom: 16 }} />}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card>
                        <Space wrap style={{ marginBottom: 16 }}>
                            <Segmented
                                value={mode}
                                onChange={(v) => setMode(v as "encode" | "decode")}
                                options={[
                                    { value: "encode", label: t("Text → Unicode") },
                                    { value: "decode", label: t("Unicode → Text") },
                                ]}
                            />
                            <Segmented
                                value={conversionType}
                                onChange={(v) => setConversionType(v as ConversionType)}
                                options={[
                                    { value: "escape", label: t("\\uXXXX") },
                                    { value: "codepoints", label: t("U+XXXX") },
                                    { value: "utf8hex", label: t("UTF-8 Hex") },
                                    { value: "utf16", label: t("UTF-16") },
                                ]}
                            />
                            <Button icon={<SwapOutlined />} onClick={swapContent}>
                                {t("Swap")}
                                </Button>
                        </Space>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>
                                    {mode === "encode" ? t("Plain Text") : t("Unicode Format")}
                                </Text>
                                <TextArea
                                    dir={mode === "encode" ? "auto" : "ltr"}
                                    aria-label={t("Input")}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={mode === "encode"
                                        ? t("Enter text to convert...")
                                        : t("Enter Unicode to decode...")}
                                    rows={8}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <Text strong>
                                        {mode === "encode" ? t("Unicode Format") : t("Plain Text")}
                                    </Text>
                                    <Button size="small" icon={<CopyOutlined />} onClick={copyOutput}>
                                        {t("Copy")}
                                        </Button>
                                </div>
                                <TextArea
                                    dir={mode === "encode" ? "ltr" : "auto"}
                                    aria-label={t("Output")}
                                    value={output}
                                    readOnly
                                    rows={8}
                                    style={{ background: "rgba(19, 194, 194, 0.05)" }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {mode === "encode" && charAnalysis.length > 0 && charAnalysis.length < 50 && (
                        <Card title={t("Character Analysis")} style={{ marginTop: 16 }}>
                            <Table
                                size="small"
                                pagination={false}
                                scroll={{ y: 200 }}
                                dataSource={charAnalysis}
                                columns={[
                                    {
                                        title: t("Char"),
                                        dataIndex: "char",
                                        width: 60,
                                        render: (text) => <Text code dir="ltr" style={{ fontSize: 16 }}>{text}</Text>
                                    },
                                    {
                                        title: t("Code Point"),
                                        dataIndex: "hex",
                                        width: 100,
                                        render: (text) => <Text code dir="ltr">{text}</Text>
                                    },
                                    {
                                        title: t("Escape"),
                                        dataIndex: "escape",
                                        width: 120,
                                        render: (text) => <Text code dir="ltr" style={{ fontSize: 11 }}>{text}</Text>
                                    },
                                    {
                                        title: t("Name"),
                                        dataIndex: "name",
                                        render: (text) => <Text type="secondary" style={{ fontSize: 11 }}>{t(text)}</Text>
                                    },
                                ]}
                            />
                        </Card>
                    )}
                </Col>

                <Col xs={24} lg={8}>
                    <Card title={t("Format Reference")}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div style={{ padding: 12, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                                <Text strong>{t("\\\\uXXXX (Escape)")}</Text>
                                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                    {t("JavaScript/JSON Unicode escape. E.g., \\u0041 = A")}
                                    </Text>
                            </div>
                            <div style={{ padding: 12, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                                <Text strong>{t("U+XXXX (Code Points)")}</Text>
                                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                    {t("Standard Unicode notation. E.g., U+0041 = A")}
                                    </Text>
                            </div>
                            <div style={{ padding: 12, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                                <Text strong>{t("UTF-8 Hex")}</Text>
                                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                    {t("Raw UTF-8 bytes in hexadecimal. E.g., 41 = A")}
                                    </Text>
                            </div>
                            <div style={{ padding: 12, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                                <Text strong>{t("UTF-16")}</Text>
                                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                    {t("UTF-16 code units. E.g., 0041 = A")}
                                    </Text>
                            </div>
                        </div>
                    </Card>

                    <Card title={t("Quick Examples")} style={{ marginTop: 16 }}>
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

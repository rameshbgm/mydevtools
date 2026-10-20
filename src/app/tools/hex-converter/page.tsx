"use client";

import React, { useState, useEffect } from "react";
import { Button, Space, Card, Segmented, Select, App, Input, Typography } from "antd";
import { CopyOutlined, ClearOutlined, NumberOutlined, SwapOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text } = Typography;

type Mode = "Encode" | "Decode";
type Format = "lowercase" | "UPPERCASE" | "0xPrefix" | "\\xPrefix" | "spaced";

function textToHex(text: string, format: Format): string {
    const bytes = new TextEncoder().encode(text);
    const hexes = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0"));
    switch (format) {
        case "UPPERCASE":
            return hexes.map((h) => h.toUpperCase()).join("");
        case "0xPrefix":
            return hexes.map((h) => `0x${h}`).join(" ");
        case "\\xPrefix":
            return hexes.map((h) => `\\x${h}`).join("");
        case "spaced":
            return hexes.join(" ");
        case "lowercase":
        default:
            return hexes.join("");
    }
}

function hexToText(hex: string): string {
    const cleaned = hex
        .replace(/0x/gi, "")
        .replace(/\\x/g, "")
        .replace(/[^0-9a-fA-F]/g, "");
    if (cleaned.length % 2 !== 0) {
        throw new Error("Hex string must have an even number of characters");
    }
    const bytes = new Uint8Array(cleaned.length / 2);
    for (let i = 0; i < cleaned.length; i += 2) {
        const byte = parseInt(cleaned.slice(i, i + 2), 16);
        if (Number.isNaN(byte)) throw new Error(`Invalid hex byte at position ${i}`);
        bytes[i / 2] = byte;
    }
    return new TextDecoder().decode(bytes);
}

export default function HexConverterPage() {
    const { t } = useLanguage();
    const { message } = App.useApp();
    const [mode, setMode] = useState<Mode>("Encode");
    const [format, setFormat] = useState<Format>("lowercase");
    const [input, setInput] = useState("Hello, mydevtools!");
    const [output, setOutput] = useState("");

    const run = (m: Mode, src: string, fmt: Format) => {
        try {
            if (!src) {
                setOutput("");
                return;
            }
            if (m === "Encode") {
                setOutput(textToHex(src, fmt));
            } else {
                setOutput(hexToText(src));
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Conversion error";
            message.error(`${t("Unable to convert hex. Check that each byte has two hex digits, then try again.")}\n${msg}`);
            setOutput("");
        }
    };

    useEffect(() => {
        if (input) run(mode, input, format);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, format]);

    const swap = () => {
        if (!output) return;
        setInput(output);
        setMode(mode === "Encode" ? "Decode" : "Encode");
    };

    return (
        <ToolPageLayout
            title={t("Hex Encoder / Decoder")}
            description={t("Convert text to hexadecimal and back (UTF-8)")}
            icon={<NumberOutlined style={{ fontSize: 24, color: "#fa8c16" }} />}
            color="#fa8c16"
            learnMore={{
                whatIs:
                    "A hex (hexadecimal) converter encodes text as a sequence of two-character byte values (00-FF) and decodes hex strings back to text. UTF-8 multi-byte characters are handled correctly in both directions.",
                whyUse:
                    "Hex is the standard way to represent binary data in programming, debugging, and security work. Use this tool to inspect bytes in API tokens, examine wire-format payloads, or generate fixed test data.",
                howToUse: [
                    "Choose Encode (text → hex) or Decode (hex → text)",
                    "Pick an output format: lowercase, UPPERCASE, 0x-prefixed, \\x-prefixed, or spaced",
                    "Paste your input — output updates instantly",
                ],
                tips: [
                    "Decoder accepts mixed input — 0x, \\x, spaces, line breaks all stripped",
                    "Each byte becomes 2 hex chars; UTF-8 chars may produce more bytes",
                    "Use the swap button to round-trip your output back",
                ],
                useCases: [
                    "Inspecting bytes in security tokens",
                    "Generating hex strings for hardware/embedded testing",
                    "Reading hex dumps from Wireshark, gdb, etc.",
                ],
            }}
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Segmented<Mode>
                    options={[{ value: "Encode", label: t("Encode") }, { value: "Decode", label: t("Decode") }]}
                    value={mode}
                    onChange={(v) => setMode(v)}
                    size="large"
                />
                {mode === "Encode" && (
                    <Select
                        value={format}
                        onChange={setFormat}
                        style={{ minWidth: 180, maxWidth: "100%" }}
                        options={[
                            { value: "lowercase", label: t("lowercase (48656c6c6f)") },
                            { value: "UPPERCASE", label: t("UPPERCASE (48656C6C6F)") },
                            { value: "spaced", label: t("Spaced (48 65 6c 6c 6f)") },
                            { value: "0xPrefix", label: t("0x prefix (0x48 0x65)") },
                            { value: "\\xPrefix", label: t("\\x prefix (\\x48\\x65)") },
                        ]}
                    />
                )}
                <Button icon={<SwapOutlined />} onClick={swap}>{t("Swap")}</Button>
                <Button icon={<CopyOutlined />} disabled={!output} onClick={() => copyToClipboard(output)}>{t("Copy")}</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); }}>{t("Clear")}</Button>
            </Space>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title={mode === "Encode" ? t("Text Input") : t("Hex Input")}>
                    <TextArea
                        dir={mode === "Encode" ? "auto" : "ltr"}
                        rows={14}
                        aria-label={t("Input")}
                        value={input}
                        onChange={(e) => { setInput(e.target.value); run(mode, e.target.value, format); }}
                        placeholder={mode === "Encode" ? t("Enter text to encode") : t("Enter hex string to decode")}
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14 }}
                    />
                </Card>
                <Card size="small" title={mode === "Encode" ? t("Hex Output") : t("Text Output")}>
                    <TextArea
                        dir={mode === "Encode" ? "ltr" : "auto"}
                        rows={14}
                        aria-label={t("Output")}
                        value={output}
                        readOnly
                        placeholder={t("Output will appear here")}
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14 }}
                    />
                    {mode === "Encode" && output && (
                        <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
                            {t("{characters} chars → {bytes} bytes", { characters: input.length, bytes: output.replace(/[^0-9a-fA-F]/g, "").length / 2 })}
                            </Text>
                    )}
                </Card>
            </div>
        </ToolPageLayout>
    );
}

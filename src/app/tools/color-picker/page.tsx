"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Card, Input, Typography, ColorPicker, Button, Space } from "antd";
import { BgColorsOutlined, CopyOutlined } from "@ant-design/icons";
import type { Color } from "antd/es/color-picker";
import { copyToClipboard } from "@/lib/clipboard";
import ColorHarmonies from "@/components/ColorHarmonies";
import { parseHexColor } from "@/lib/color-harmonies";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;

export default function ColorPickerPage() {
    const { t } = useLanguage();
    const [color, setColor] = useState<string>("#6366f1");

    const { formats, error } = useMemo(() => {
        try { const parsed = parseHexColor(color), { h, s, l, a } = parsed.hsla; return { formats: [
            { label: "HEX", value: parsed.hex },
            { label: "RGB", value: a === 1 ? `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})` : `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${Number(a.toFixed(4))})` },
            { label: "HSL", value: a === 1 ? `hsl(${Number(h.toFixed(2))}, ${Number(s.toFixed(2))}%, ${Number(l.toFixed(2))}%)` : `hsla(${Number(h.toFixed(2))}, ${Number(s.toFixed(2))}%, ${Number(l.toFixed(2))}%, ${Number(a.toFixed(4))})` },
        ], error: "" }; } catch (cause) { return { formats: [], error: cause instanceof Error ? cause.message : String(cause) }; }
    }, [color]);

    const copyAllFormats = () => {
        copyToClipboard(formats.map((f) => `${f.label}: ${f.value}`).join("\n"), t("All formats copied!"));
    };

    return (
        <ToolPageLayout
            title={t("Color Picker & Converter")}
            description={t("Pick colors and convert between HEX, RGB, HSL")}
            icon={<BgColorsOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: t("A color picker and converter tool for working with colors in different formats. It converts between HEX (#FF5733), RGB (255, 87, 51), and HSL (14°, 100%, 60%) color representations."),
                whyUse: t("Different contexts require different color formats: CSS uses HEX or RGB, design tools use HSL. This tool helps designers and developers quickly convert and pick colors."),
                howToUse: [
                    t("Use the color picker to select any color"),
                    t("View the color in HEX, RGB, and HSL formats"),
                    t("Click any format to copy it to clipboard"),
                    t("Enter a color code to convert to other formats")
                ],
                tips: [
                    t("HSL is intuitive: Hue (color), Saturation, Lightness"),
                    t("HEX is most common in CSS: #RRGGBB"),
                    t("RGB is used in most programming languages"),
                    t("RGBA/HSLA add alpha channel for transparency")
                ],
                useCases: [
                    t("Converting design colors to CSS formats"),
                    t("Creating color palettes for web projects"),
                    t("Adjusting colors using HSL for better control"),
                    t("Finding complementary or analogous colors")
                ]
            }}
        >
            <div className="tool-split-pane" style={{ gap: 24 }}>
                <Card size="small" title={t("Pick a Color")}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <ColorPicker
                            value={error ? "#6366f1" : color}
                            onChange={(c: Color) => setColor(c.toHexString())}
                            size="large"
                            showText
                        />
                    </div>
                    <Input
                        dir="ltr"
                        aria-label={t("Color code")}
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="#6366f1"
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                    />
                </Card>

                <div>
                    <div
                        style={{
                            width: "100%",
                            height: 120,
                            borderRadius: 12,
                            background: error ? "transparent" : color,
                            marginBottom: 16,
                            border: "1px solid var(--wb-card-border)",
                        }}
                    />
                    <Space style={{ marginBottom: 12 }}>
                        <Button disabled={!!error} icon={<CopyOutlined />} onClick={copyAllFormats}>{t("Copy All Formats")}</Button>
                    </Space>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {formats.map((f) => (
                            <Card
                                key={f.label}
                                size="small"
                                title={f.label}
                                extra={<Button aria-label={t("Copy")} size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard(f.value, t("{format} copied!", { format: f.label }))} />}
                            >
                                <Text dir="ltr" code style={{ fontSize: 14 }}>{f.value}</Text>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            {error && <p role="alert">{error === "Enter a HEX color with 3, 4, 6 or 8 digits." ? t(error) : t("Color diagnostic: {detail}", { detail: error })}</p>}
            <ColorHarmonies color={color} />
        </ToolPageLayout>
    );
}

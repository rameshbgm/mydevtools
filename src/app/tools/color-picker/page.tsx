"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, ColorPicker, Button, Space } from "antd";
import { BgColorsOutlined, CopyOutlined } from "@ant-design/icons";
import type { Color } from "antd/es/color-picker";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;

export default function ColorPickerPage() {
    const [color, setColor] = useState<string>("#6366f1");

    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const hexToHsl = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    };

    const formats = useMemo(() => [
        { label: "HEX", value: color },
        { label: "RGB", value: hexToRgb(color) },
        { label: "HSL", value: hexToHsl(color) },
    ], [color]);

    const copyAllFormats = () => {
        copyToClipboard(formats.map((f) => `${f.label}: ${f.value}`).join("\n"), "All formats copied!");
    };

    return (
        <ToolPageLayout
            title="Color Picker & Converter"
            description="Pick colors and convert between HEX, RGB, HSL"
            icon={<BgColorsOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: "A color picker and converter tool for working with colors in different formats. It converts between HEX (#FF5733), RGB (255, 87, 51), and HSL (14°, 100%, 60%) color representations.",
                whyUse: "Different contexts require different color formats: CSS uses HEX or RGB, design tools use HSL. This tool helps designers and developers quickly convert and pick colors.",
                howToUse: [
                    "Use the color picker to select any color",
                    "View the color in HEX, RGB, and HSL formats",
                    "Click any format to copy it to clipboard",
                    "Enter a color code to convert to other formats"
                ],
                tips: [
                    "HSL is intuitive: Hue (color), Saturation, Lightness",
                    "HEX is most common in CSS: #RRGGBB",
                    "RGB is used in most programming languages",
                    "RGBA/HSLA add alpha channel for transparency"
                ],
                useCases: [
                    "Converting design colors to CSS formats",
                    "Creating color palettes for web projects",
                    "Adjusting colors using HSL for better control",
                    "Finding complementary or analogous colors"
                ]
            }}
        >
            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
                <Card size="small" title="Pick a Color">
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <ColorPicker
                            value={color}
                            onChange={(c: Color) => setColor(c.toHexString())}
                            size="large"
                            showText
                        />
                    </div>
                    <Input
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
                            background: color,
                            marginBottom: 16,
                            border: "1px solid #303030",
                        }}
                    />
                    <Space style={{ marginBottom: 12 }}>
                        <Button icon={<CopyOutlined />} onClick={copyAllFormats}>Copy All Formats</Button>
                    </Space>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {formats.map((f) => (
                            <Card
                                key={f.label}
                                size="small"
                                title={f.label}
                                extra={<Button aria-label="Copy" size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard(f.value, `${f.label} copied!`)} />}
                            >
                                <Text code style={{ fontSize: 14 }}>{f.value}</Text>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </ToolPageLayout>
    );
}

"use client";

import React, { useState, useMemo } from "react";
import { Card, ColorPicker, Input, Typography, Tag, Row, Col, Space } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title } = Typography;

function hexToRgb(hex: string): [number, number, number] | null {
    const m = hex.replace("#", "").match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
    if (!m) return null;
    let h = m[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
    const channel = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(fg: [number, number, number], bg: [number, number, number]): number {
    const L1 = relativeLuminance(fg);
    const L2 = relativeLuminance(bg);
    const [a, b] = L1 > L2 ? [L1, L2] : [L2, L1];
    return (a + 0.05) / (b + 0.05);
}

interface RatingProps {
    label: string;
    threshold: number;
    ratio: number;
}

function RatingBadge({ label, threshold, ratio }: Readonly<RatingProps>) {
    const pass = ratio >= threshold;
    return (
        <Tag color={pass ? "success" : "error"} style={{ padding: "4px 12px", fontSize: 13 }}>
            {label}: {pass ? "Pass" : "Fail"} ({threshold.toFixed(1)}:1)
        </Tag>
    );
}

export default function ColorContrastCheckerPage() {
    const [fg, setFg] = useState("#171717");
    const [bg, setBg] = useState("#ffffff");

    const ratio = useMemo(() => {
        const fr = hexToRgb(fg);
        const br = hexToRgb(bg);
        if (!fr || !br) return 0;
        return contrastRatio(fr, br);
    }, [fg, bg]);

    return (
        <ToolPageLayout
            title="Color Contrast Checker"
            description="Check WCAG contrast ratios between foreground and background"
            icon={<BgColorsOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs:
                    "WCAG (Web Content Accessibility Guidelines) defines contrast ratios between text and background to ensure readability. AA requires 4.5:1 for normal text, 3:1 for large text. AAA requires 7:1 for normal text, 4.5:1 for large text.",
                whyUse:
                    "Insufficient contrast makes content unreadable for users with low vision. Audit your designs against WCAG AA / AAA so your site is accessible — and lawsuit-resistant.",
                howToUse: [
                    "Set the foreground (text) and background colors using the pickers",
                    "Read the contrast ratio and AA/AAA pass/fail badges",
                    "Adjust colors until you hit your target rating",
                ],
                tips: [
                    "AA is the legal minimum in many jurisdictions",
                    "Large text = 18pt+ (or 14pt+ bold) — has lower thresholds",
                    "Don't rely on color alone; use text labels too",
                ],
                useCases: [
                    "Auditing design system tokens",
                    "Pre-launch accessibility checks",
                    "Choosing brand colors that work on web",
                ],
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title="Foreground (text)">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <ColorPicker
                                value={fg}
                                onChange={(c) => setFg(c.toHexString())}
                                size="large"
                                showText
                            />
                            <Input value={fg} onChange={(e) => setFg(e.target.value)} prefix="HEX" />
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Background">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <ColorPicker
                                value={bg}
                                onChange={(c) => setBg(c.toHexString())}
                                size="large"
                                showText
                            />
                            <Input value={bg} onChange={(e) => setBg(e.target.value)} prefix="HEX" />
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 24 }}>
                <div
                    style={{
                        background: bg,
                        color: fg,
                        padding: "32px 24px",
                        borderRadius: 12,
                        textAlign: "center",
                        marginBottom: 24,
                        border: "1px solid rgba(0,0,0,0.06)",
                    }}
                >
                    <Title level={2} style={{ color: fg, margin: 0 }}>The quick brown fox</Title>
                    <Text style={{ color: fg, fontSize: 16 }}>jumps over the lazy dog</Text>
                    <p style={{ color: fg, fontSize: 13, margin: "16px 0 0" }}>
                        Body text — 13px regular weight
                    </p>
                </div>

                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <Text style={{ fontSize: 36, fontWeight: 700 }}>{ratio.toFixed(2)} : 1</Text>
                    <div style={{ marginTop: 4 }}>
                        <Text type="secondary">Contrast ratio</Text>
                    </div>
                </div>

                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    <div>
                        <Text strong style={{ display: "block", marginBottom: 6 }}>Normal text</Text>
                        <Space wrap>
                            <RatingBadge label="WCAG AA" threshold={4.5} ratio={ratio} />
                            <RatingBadge label="WCAG AAA" threshold={7} ratio={ratio} />
                        </Space>
                    </div>
                    <div>
                        <Text strong style={{ display: "block", marginBottom: 6 }}>Large text (18pt+, or 14pt+ bold)</Text>
                        <Space wrap>
                            <RatingBadge label="WCAG AA" threshold={3} ratio={ratio} />
                            <RatingBadge label="WCAG AAA" threshold={4.5} ratio={ratio} />
                        </Space>
                    </div>
                    <div>
                        <Text strong style={{ display: "block", marginBottom: 6 }}>UI components / graphics</Text>
                        <Space wrap>
                            <RatingBadge label="WCAG AA" threshold={3} ratio={ratio} />
                        </Space>
                    </div>
                </Space>
            </Card>
        </ToolPageLayout>
    );
}

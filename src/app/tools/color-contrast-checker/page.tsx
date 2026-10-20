"use client";

import React, { useState, useMemo } from "react";
import { Card, ColorPicker, Input, Typography, Tag, Alert, Row, Col, Space } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
import { colorContrast, parseContrastHex } from "@/lib/color-contrast";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title } = Typography;

interface RatingProps {
    label: string;
    threshold: number;
    ratio: number;
}

function RatingBadge({ label, threshold, ratio }: Readonly<RatingProps>) {
    const { t } = useLanguage();
    const pass = ratio >= threshold;
    return (
        <Tag color={pass ? "success" : "error"} style={{ padding: "4px 12px", fontSize: 13 }}>
            {label}: {t(pass ? "Pass" : "Fail")} ({threshold.toFixed(1)}:1)
        </Tag>
    );
}

export default function ColorContrastCheckerPage() {
    const { t } = useLanguage();
    const [fg, setFg] = useState("#171717");
    const [bg, setBg] = useState("#ffffff");

    const ratio = useMemo(() => colorContrast(fg, bg), [fg, bg]);
    const normalized = (value: string) => { const rgb = parseContrastHex(value); return rgb ? "#" + rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("") : undefined; };
    const previewFg = normalized(fg), previewBg = normalized(bg);

    return (
        <ToolPageLayout
            title={t("Color Contrast Checker")}
            description={t("Check WCAG contrast ratios between foreground and background")}
            icon={<BgColorsOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs:
                    t("WCAG (Web Content Accessibility Guidelines) defines contrast ratios between text and background to ensure readability. AA requires 4.5:1 for normal text, 3:1 for large text. AAA requires 7:1 for normal text, 4.5:1 for large text."),
                whyUse:
                    t("Compare opaque foreground and background colors against WCAG text and non-text thresholds. Contrast is one part of an accessibility review."),
                howToUse: [
                    t("Set the foreground (text) and background colors using the pickers"),
                    t("Read the contrast ratio and AA/AAA pass/fail badges"),
                    t("Adjust colors until you hit your target rating"),
                ],
                tips: [
                    t("A passing color pair does not establish that the whole page meets WCAG."),
                    t("Large text = 18pt+ (or 14pt+ bold) — has lower thresholds"),
                    t("Don't rely on color alone; use text labels too"),
                ],
                useCases: [
                    t("Auditing design system tokens"),
                    t("Pre-launch accessibility checks"),
                    t("Choosing brand colors that work on web"),
                ],
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title={t("Foreground (text)")}>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            <ColorPicker
                                value={previewFg ?? "#171717"}
                                onChange={(c) => setFg(c.toHexString())}
                                size="large"
                                showText
                            />
                            <Input dir="ltr" aria-invalid={!previewFg} status={previewFg ? undefined : "error"} aria-label={t("Foreground HEX color")} style={{ fontSize: 16 }} styles={{ input: { direction: "ltr", textAlign: "left" } }} value={fg} onChange={(e) => setFg(e.target.value)} prefix="HEX" />
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title={t("Background")}>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            <ColorPicker
                                value={previewBg ?? "#ffffff"}
                                onChange={(c) => setBg(c.toHexString())}
                                size="large"
                                showText
                            />
                            <Input dir="ltr" aria-invalid={!previewBg} status={previewBg ? undefined : "error"} aria-label={t("Background HEX color")} style={{ fontSize: 16 }} styles={{ input: { direction: "ltr", textAlign: "left" } }} value={bg} onChange={(e) => setBg(e.target.value)} prefix="HEX" />
                        </Space>
                    </Card>
                </Col>
            </Row>

            {ratio === null ? <Alert type="error" showIcon style={{ marginTop: 24 }} title={t("Enter valid 3- or 6-digit HEX colors for both fields.")} /> : <Card style={{ marginTop: 24 }}>
                <div
                    style={{
                        background: previewBg,
                        color: previewFg,
                        padding: "32px 24px",
                        borderRadius: 12,
                        textAlign: "center",
                        marginBottom: 24,
                        border: "1px solid rgba(0,0,0,0.06)",
                    }}
                >
                    <Title level={2} style={{ color: previewFg, margin: 0 }}>{t("The quick brown fox")}</Title>
                    <Text style={{ color: previewFg, fontSize: 16 }}>{t("jumps over the lazy dog")}</Text>
                    <p style={{ color: previewFg, fontSize: 13, margin: "16px 0 0" }}>
                        {t("Body text — 13px regular weight")}</p>
                </div>

                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <Text style={{ fontSize: 36, fontWeight: 700 }}>{ratio.toFixed(2)} : 1</Text>
                    <div style={{ marginTop: 4 }}>
                        <Text type="secondary">{t("Contrast ratio")}</Text>
                        <p>{t("Threshold comparisons use the unrounded ratio.")}</p>
                    </div>
                </div>

                <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                    <div>
                        <Text strong style={{ display: "block", marginBottom: 6 }}>{t("Normal text")}</Text>
                        <Space wrap>
                            <RatingBadge label="WCAG AA" threshold={4.5} ratio={ratio} />
                            <RatingBadge label="WCAG AAA" threshold={7} ratio={ratio} />
                        </Space>
                    </div>
                    <div>
                        <Text strong style={{ display: "block", marginBottom: 6 }}>{t("Large text (18pt+, or 14pt+ bold)")}</Text>
                        <Space wrap>
                            <RatingBadge label="WCAG AA" threshold={3} ratio={ratio} />
                            <RatingBadge label="WCAG AAA" threshold={4.5} ratio={ratio} />
                        </Space>
                    </div>
                    <div>
                        <Text strong style={{ display: "block", marginBottom: 6 }}>{t("UI components / graphics")}</Text>
                        <Space wrap>
                            <RatingBadge label="WCAG AA" threshold={3} ratio={ratio} />
                        </Space>
                    </div>
                </Space>
            </Card>}
        </ToolPageLayout>
    );
}

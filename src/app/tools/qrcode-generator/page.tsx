"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Slider, ColorPicker, Select } from "antd";
import { QrcodeOutlined, CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { downloadText } from "@/lib/download";
import QRCode from "qrcode";

const { Text } = Typography;
const { TextArea } = Input;

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string; recovery: string }[] = [
    { value: "L", label: "Low (L)", recovery: "~7% recovery" },
    { value: "M", label: "Medium (M)", recovery: "~15% recovery" },
    { value: "Q", label: "Quartile (Q)", recovery: "~25% recovery" },
    { value: "H", label: "High (H)", recovery: "~30% recovery" },
];

const PRESETS = [
    { label: "URL", placeholder: "https://example.com" },
    { label: "Email", placeholder: "mailto:user@example.com" },
    { label: "Phone", placeholder: "tel:+1234567890" },
    { label: "SMS", placeholder: "sms:+1234567890?body=Hello" },
    { label: "WiFi", placeholder: "WIFI:T:WPA;S:NetworkName;P:Password;;" },
    { label: "vCard", placeholder: "BEGIN:VCARD\nVERSION:3.0\nN:Doe;John\nTEL:+1234567890\nEND:VCARD" },
];

export default function QRCodeGeneratorPage() {
    const { t } = useLanguage();
    const translation = useRef(t);
    useEffect(() => { translation.current = t; }, [t]);
    const [content, setContent] = useState("https://example.com");
    const [size, setSize] = useState(256);
    const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("M");
    const [foreground, setForeground] = useState("#000000");
    const [background, setBackground] = useState("#ffffff");
    const [qrResult, setQrResult] = useState<{ signature: string; url: string } | null>(null);
    const [generationError, setGenerationError] = useState("");
    const [margin, setMargin] = useState(2);
    const generation = useRef(0);
    const signature = JSON.stringify([content, size, margin, errorLevel, foreground, background]);
    const qrDataUrl = qrResult?.signature === signature ? qrResult.url : "";

    const generateQR = useCallback(async () => {
        const request = ++generation.current;
        setGenerationError("");
        setQrResult(null);
        if (!content.trim()) {
            return;
        }

        try {
            const dataUrl = await QRCode.toDataURL(content, {
                width: size,
                margin: margin,
                errorCorrectionLevel: errorLevel,
                color: {
                    dark: foreground,
                    light: background,
                },
            });
            if (request === generation.current) setQrResult({ signature, url: dataUrl });
        } catch (err: unknown) {
            if (request === generation.current) { setQrResult(null); setGenerationError(err instanceof Error ? err.message : String(err)); }
        }
    }, [content, size, margin, errorLevel, foreground, background, signature]);

    const cancelGeneration = useCallback(() => { generation.current++; }, []);
    useEffect(() => {
        void generateQR();
        return cancelGeneration;
    }, [generateQR, cancelGeneration]);

    const downloadQR = async (format: "png" | "svg") => {
        if (!content.trim()) {
            message.warning(translation.current("Please enter content first"));
            return;
        }

        try {
            let data: string;
            let filename: string;
            let mimeType: string;

            if (format === "svg") {
                data = await QRCode.toString(content, {
                    type: "svg",
                    margin: margin,
                    errorCorrectionLevel: errorLevel,
                    color: {
                        dark: foreground,
                        light: background,
                    },
                });
                filename = "qrcode.svg";
                mimeType = "image/svg+xml";
                downloadText(data, filename, mimeType);
            } else {
                const dataUrl = await QRCode.toDataURL(content, {
                    width: size * 2, // Higher resolution for download
                    margin: margin,
                    errorCorrectionLevel: errorLevel,
                    color: {
                        dark: foreground,
                        light: background,
                    },
                });
                const a = document.createElement("a");
                a.href = dataUrl;
                a.download = "qrcode.png";
                a.click();
            }
            message.success(translation.current("QR code prepared as {format}", { format: format.toUpperCase() }));
        } catch (err: unknown) {
            message.error(`${translation.current("Unable to prepare this QR code. Check the content and try PNG or SVG again.")}\n${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const copyToClipboard = async () => {
        if (!qrDataUrl) return;

        try {
            const response = await fetch(qrDataUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob }),
            ]);
            message.success(translation.current("QR code copied to clipboard!"));
        } catch {
            // Fallback: copy data URL
            try {
                await navigator.clipboard.writeText(qrDataUrl);
                message.success(translation.current("QR code data URL copied!"));
            } catch { message.error(translation.current("Unable to copy the QR code. Download PNG or SVG instead.")); }
        }
    };

    const loadPreset = (placeholder: string) => {
        setContent(placeholder);
    };

    return (
        <ToolPageLayout
            title={t("QR Code Generator")}
            description={t("Generate QR codes from text, URLs, or data with customization options")}
            icon={<QrcodeOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "QR (Quick Response) codes are 2D barcodes that encode data readable by smartphone cameras. They can store URLs, text, contact info, WiFi credentials, and more in a compact visual format.",
                whyUse: "QR codes bridge physical and digital worlds. They provide quick access to URLs, eliminate manual typing, enable contactless payments, and work in marketing, inventory, and authentication.",
                howToUse: [
                    "Enter the content to encode (URL, text, WiFi, contact, etc.)",
                    "Use presets for common formats like URLs, WiFi, or vCards",
                    "Customize colors, size, and error correction level",
                    "Download the QR code as PNG or SVG"
                ],
                tips: [
                    "Higher error correction allows the code to work when partially damaged",
                    "Test your QR code with multiple scanner apps",
                    "Keep good contrast between foreground and background",
                    "SVG format scales without losing quality"
                ],
                useCases: [
                    "Sharing URLs on printed materials",
                    "WiFi network credentials for guests",
                    "Contact information on business cards",
                    "Product tracking and inventory management"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={14}>
                    <Card title={t("Content")}>
                        <Space wrap style={{ marginBottom: 16 }}>
                            {PRESETS.map((preset) => (
                                <Button
                                    key={t(preset.label)}
                                    size="small"
                                    onClick={() => loadPreset(preset.placeholder)}
                                >
                                    {t(preset.label)}
                                </Button>
                            ))}
                        </Space>

                        <TextArea aria-label={t("Content to encode")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t("Enter text, URL, or data to encode...")}
                            rows={4}
                            showCount
                            maxLength={2000}
                        />
                        <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 8 }}>{t("Supports URLs, plain text, vCards, WiFi configs, and more")}</Text>
                    </Card>

                    <Card title={t("Customization")} style={{ marginTop: 16 }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text style={{ display: "block", marginBottom: 8 }}>{t("Size:")}{size}{t("px")}</Text>
                                <Slider aria-label={t("QR size in pixels")}
                                    value={size}
                                    onChange={setSize}
                                    min={128}
                                    max={512}
                                    step={32}
                                />
                            </Col>
                            <Col span={12}>
                                <Text style={{ display: "block", marginBottom: 8 }}>{t("Margin:")}{margin}</Text>
                                <Slider aria-label={t("QR margin")}
                                    value={margin}
                                    onChange={setMargin}
                                    min={0}
                                    max={6}
                                />
                            </Col>
                            <Col span={12}>
                                <Text style={{ display: "block", marginBottom: 8 }}>{t("Error Correction")}</Text>
                                <Select aria-label={t("Error Correction")}
                                    value={errorLevel}
                                    onChange={setErrorLevel}
                                    style={{ width: "100%" }}
                                    options={ERROR_LEVELS.map((l) => ({
                                        value: l.value,
                                        label: `${t(l.label)} - ${t(l.recovery)}`,
                                    }))}
                                />
                            </Col>
                            <Col span={6}>
                                <Text style={{ display: "block", marginBottom: 8 }}>{t("Foreground")}</Text>
                                <ColorPicker aria-label={t("Foreground")}
                                    value={foreground}
                                    onChange={(c) => setForeground(c.toHexString())}
                                    showText
                                />
                            </Col>
                            <Col span={6}>
                                <Text style={{ display: "block", marginBottom: 8 }}>{t("Background")}</Text>
                                <ColorPicker aria-label={t("Background")}
                                    value={background}
                                    onChange={(c) => setBackground(c.toHexString())}
                                    showText
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card
                        title={t("QR Code")}
                        extra={
                            qrDataUrl && (
                                <Space>
                                    <Button icon={<CopyOutlined />} size="small" onClick={copyToClipboard}>{t("Copy")}</Button>
                                </Space>
                            )
                        }
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: 280,
                                background: background,
                                borderRadius: 8,
                                padding: 16,
                            }}
                        >
                            {generationError ? <div role="alert"><p>{t("Unable to generate this QR code. Shorten the content or lower error correction, then try again.")}</p><pre dir="ltr" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{generationError}</pre><Button onClick={() => void generateQR()}>{t("Try again")}</Button></div> : qrDataUrl ? (
                                <img
                                    src={qrDataUrl}
                                    alt={t("QR Code")}
                                    style={{ maxWidth: "100%", imageRendering: "pixelated" }}
                                />
                            ) : (
                                <Text type="secondary">{t("Enter content to generate QR code")}</Text>
                            )}
                        </div>

                        {qrDataUrl && (
                            <Space style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => downloadQR("png")}
                                >{t("Download PNG")}</Button>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => downloadQR("svg")}
                                >{t("Download SVG")}</Button>
                            </Space>
                        )}
                    </Card>

                    <Card title={t("WiFi QR Generator")} style={{ marginTop: 16 }}>
                        <WifiGenerator onGenerate={setContent} />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

function WifiGenerator({ onGenerate }: { onGenerate: (content: string) => void }) {
    const { t } = useLanguage();
    const [ssid, setSsid] = useState("");
    const [password, setPassword] = useState("");
    const [encryption, setEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
    const [hidden] = useState(false);

    const generate = () => {
        const config = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};;`;
        onGenerate(config);
    };

    return (
        <Space orientation="vertical" style={{ width: "100%" }} size="small">
            <Input aria-label={t("Network Name (SSID)")} dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                placeholder={t("Network Name (SSID)")}
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
            />
            <Input.Password aria-label={t("Password")} dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                placeholder={t("Password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Select aria-label={t("WiFi encryption")}
                value={encryption}
                onChange={setEncryption}
                style={{ width: "100%" }}
                options={[
                    { value: "WPA", label: t("WPA/WPA2") },
                    { value: "WEP", label: t("WEP") },
                    { value: "nopass", label: t("No Password") },
                ]}
            />
            <Button type="primary" onClick={generate} disabled={!ssid} block>{t("Generate WiFi QR")}</Button>
        </Space>
    );
}

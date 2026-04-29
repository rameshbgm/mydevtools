"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Slider, ColorPicker, Select, Tabs, Segmented } from "antd";
import { QrcodeOutlined, CopyOutlined, DownloadOutlined, BgColorsOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import QRCode from "qrcode";

const { Text, Paragraph } = Typography;
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
    const [content, setContent] = useState("https://example.com");
    const [size, setSize] = useState(256);
    const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("M");
    const [foreground, setForeground] = useState("#000000");
    const [background, setBackground] = useState("#ffffff");
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [margin, setMargin] = useState(2);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        generateQR();
    }, [content, size, errorLevel, foreground, background, margin]);

    const generateQR = async () => {
        if (!content.trim()) {
            setQrDataUrl("");
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
            setQrDataUrl(dataUrl);
        } catch (err: any) {
            console.error("QR generation error:", err);
        }
    };

    const downloadQR = async (format: "png" | "svg") => {
        if (!content.trim()) {
            message.warning("Please enter content first");
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
                const blob = new Blob([data], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
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
            message.success(`QR code downloaded as ${format.toUpperCase()}`);
        } catch (err: any) {
            message.error("Failed to download: " + err.message);
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
            message.success("QR code copied to clipboard!");
        } catch {
            // Fallback: copy data URL
            navigator.clipboard.writeText(qrDataUrl);
            message.success("QR code data URL copied!");
        }
    };

    const loadPreset = (placeholder: string) => {
        setContent(placeholder);
    };

    return (
        <ToolPageLayout
            title="QR Code Generator"
            description="Generate QR codes from text, URLs, or data with customization options"
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
                    <Card title="Content">
                        <Space wrap style={{ marginBottom: 16 }}>
                            {PRESETS.map((preset) => (
                                <Button
                                    key={preset.label}
                                    size="small"
                                    onClick={() => loadPreset(preset.placeholder)}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </Space>

                        <TextArea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter text, URL, or data to encode..."
                            rows={4}
                            showCount
                            maxLength={2000}
                        />
                        <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 8 }}>
                            Supports URLs, plain text, vCards, WiFi configs, and more
                        </Text>
                    </Card>

                    <Card title="Customization" style={{ marginTop: 16 }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text style={{ display: "block", marginBottom: 8 }}>Size: {size}px</Text>
                                <Slider
                                    value={size}
                                    onChange={setSize}
                                    min={128}
                                    max={512}
                                    step={32}
                                />
                            </Col>
                            <Col span={12}>
                                <Text style={{ display: "block", marginBottom: 8 }}>Margin: {margin}</Text>
                                <Slider
                                    value={margin}
                                    onChange={setMargin}
                                    min={0}
                                    max={6}
                                />
                            </Col>
                            <Col span={12}>
                                <Text style={{ display: "block", marginBottom: 8 }}>Error Correction</Text>
                                <Select
                                    value={errorLevel}
                                    onChange={setErrorLevel}
                                    style={{ width: "100%" }}
                                    options={ERROR_LEVELS.map((l) => ({
                                        value: l.value,
                                        label: `${l.label} - ${l.recovery}`,
                                    }))}
                                />
                            </Col>
                            <Col span={6}>
                                <Text style={{ display: "block", marginBottom: 8 }}>Foreground</Text>
                                <ColorPicker
                                    value={foreground}
                                    onChange={(c) => setForeground(c.toHexString())}
                                    showText
                                />
                            </Col>
                            <Col span={6}>
                                <Text style={{ display: "block", marginBottom: 8 }}>Background</Text>
                                <ColorPicker
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
                        title="QR Code"
                        extra={
                            qrDataUrl && (
                                <Space>
                                    <Button icon={<CopyOutlined />} size="small" onClick={copyToClipboard}>
                                        Copy
                                    </Button>
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
                            {qrDataUrl ? (
                                <img
                                    src={qrDataUrl}
                                    alt="QR Code"
                                    style={{ maxWidth: "100%", imageRendering: "pixelated" }}
                                />
                            ) : (
                                <Text type="secondary">Enter content to generate QR code</Text>
                            )}
                        </div>

                        {qrDataUrl && (
                            <Space style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => downloadQR("png")}
                                >
                                    Download PNG
                                </Button>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => downloadQR("svg")}
                                >
                                    Download SVG
                                </Button>
                            </Space>
                        )}
                    </Card>

                    <Card title="WiFi QR Generator" style={{ marginTop: 16 }}>
                        <WifiGenerator onGenerate={setContent} />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

function WifiGenerator({ onGenerate }: { onGenerate: (content: string) => void }) {
    const [ssid, setSsid] = useState("");
    const [password, setPassword] = useState("");
    const [encryption, setEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
    const [hidden, setHidden] = useState(false);

    const generate = () => {
        const config = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};;`;
        onGenerate(config);
    };

    return (
        <Space direction="vertical" style={{ width: "100%" }} size="small">
            <Input
                placeholder="Network Name (SSID)"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
            />
            <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Select
                value={encryption}
                onChange={setEncryption}
                style={{ width: "100%" }}
                options={[
                    { value: "WPA", label: "WPA/WPA2" },
                    { value: "WEP", label: "WEP" },
                    { value: "nopass", label: "No Password" },
                ]}
            />
            <Button type="primary" onClick={generate} disabled={!ssid} block>
                Generate WiFi QR
            </Button>
        </Space>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Upload, Button, Row, Col, Space, Tag, Slider, Radio, App, Empty } from "antd";
import { CompressOutlined, UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;
const { Dragger } = Upload;

type Format = "image/jpeg" | "image/webp" | "image/png";

interface Original { file: File; img: HTMLImageElement; }

function loadImage(file: File): Promise<Original> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve({ file, img });
            img.onerror = () => reject(new Error("Decode failed"));
            img.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error("Read failed"));
        reader.readAsDataURL(file);
    });
}

function compressImage(img: HTMLImageElement, format: Format, quality: number, maxDim?: number): Promise<Blob> {
    let { width: w, height: h } = { width: img.naturalWidth, height: img.naturalHeight };
    if (maxDim && Math.max(w, h) > maxDim) {
        const scale = maxDim / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    return new Promise((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Encoding failed")), format, quality);
    });
}

function formatBytes(n: number) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageCompressorPage() {
    const { message } = App.useApp();
    const [original, setOriginal] = useState<Original | null>(null);
    const [format, setFormat] = useState<Format>("image/jpeg");
    const [quality, setQuality] = useState(0.7);
    const [maxDim, setMaxDim] = useState(0);
    const [compressed, setCompressed] = useState<{ blob: Blob; url: string } | null>(null);

    useEffect(() => () => { if (compressed) URL.revokeObjectURL(compressed.url); }, [compressed]);

    useEffect(() => {
        if (!original) { setCompressed(null); return; }
        let cancelled = false;
        (async () => {
            try {
                const blob = await compressImage(original.img, format, quality, maxDim || undefined);
                if (cancelled) return;
                setCompressed((prev) => { if (prev) URL.revokeObjectURL(prev.url); return { blob, url: URL.createObjectURL(blob) }; });
            } catch (err) {
                message.error(err instanceof Error ? err.message : String(err));
            }
        })();
        return () => { cancelled = true; };
    }, [original, format, quality, maxDim, message]);

    const upload = {
        beforeUpload: async (file: File) => {
            try {
                const orig = await loadImage(file);
                setOriginal(orig);
            } catch (err) {
                message.error(err instanceof Error ? err.message : String(err));
            }
            return false;
        },
        showUploadList: false,
        accept: "image/*",
    };

    const download = () => {
        if (!compressed || !original) return;
        const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
        const name = original.file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`;
        const a = document.createElement("a");
        a.href = compressed.url;
        a.download = name;
        a.click();
    };

    const origSize = original?.file.size || 0;
    const newSize = compressed?.blob.size || 0;
    const savings = origSize > 0 ? (1 - newSize / origSize) * 100 : 0;

    return (
        <ToolPageLayout
            title="Image Compressor"
            description="Shrink JPEG, PNG and WebP in your browser with quality slider and live preview"
            icon={<CompressOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />}
            color="#0ea5e9"
            learnMore={{
                whatIs: "Image Compressor re-encodes your image through a Canvas at a chosen quality and (optional) maximum dimension. The browser's native JPEG/WebP encoder does the actual compression — same engine that ships images to the web.",
                whyUse: "Cloud compressors upload your file. This one keeps it local, gives a real-time before/after preview, and lets you converge on the smallest acceptable quality.",
                howToUse: [
                    "Drop or select an image",
                    "Pick output format — WebP is usually 25-35% smaller than JPEG at equal quality",
                    "Slide quality down until you see artefacts, then back off one notch",
                    "Optionally set a maximum dimension for thumbnail-size outputs",
                    "Download the compressed file",
                ],
                tips: [
                    "PNG quality is fixed — only re-encoding without alpha may shrink it; switching to WebP usually wins",
                    "Quality 0.7 is a typical web-grade default; 0.85 is near-lossless visually",
                    "For photos: prefer WebP/JPEG. For UI/screenshots with sharp edges: prefer PNG/WebP-lossless",
                ],
                useCases: [
                    "Shrinking screenshots before posting to a PR",
                    "Preparing assets for a website with size budgets",
                    "Batch-checking what quality you can get away with",
                ],
            }}
        >
            {!original ? (
                <Card>
                    <Dragger {...upload} style={{ padding: 32 }}>
                        <UploadOutlined style={{ fontSize: 36, color: "#0ea5e9" }} />
                        <Text style={{ display: "block", marginTop: 12, fontSize: 16 }}>Drop image or click to choose</Text>
                        <Text type="secondary">JPEG · PNG · WebP · GIF · any browser-decodable format</Text>
                    </Dragger>
                </Card>
            ) : (
                <>
                    <Card>
                        <Space wrap size="middle">
                            <Tag>{original.file.name}</Tag>
                            <Tag color="default">{original.img.naturalWidth}×{original.img.naturalHeight}</Tag>
                            <Tag color="default">{formatBytes(origSize)}</Tag>
                            <Button size="small" onClick={() => setOriginal(null)}>Choose another</Button>
                        </Space>
                    </Card>

                    <Card style={{ marginTop: 16 }} title="Settings">
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 6 }}>Format</Text>
                                <Radio.Group
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    options={[
                                        { value: "image/jpeg", label: "JPEG" },
                                        { value: "image/webp", label: "WebP" },
                                        { value: "image/png", label: "PNG" },
                                    ]}
                                    optionType="button"
                                    buttonStyle="solid"
                                />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 6 }}>
                                    Quality: <Tag>{Math.round(quality * 100)}%</Tag>
                                    {format === "image/png" && <Text type="secondary" style={{ marginLeft: 8, fontSize: 11 }}>(PNG ignores quality — try WebP for lossy)</Text>}
                                </Text>
                                <Slider min={0.1} max={1} step={0.01} value={quality} onChange={setQuality} disabled={format === "image/png"} />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 6 }}>
                                    Max dimension: <Tag>{maxDim || "original"}</Tag>
                                </Text>
                                <Slider min={0} max={4096} step={64} value={maxDim} onChange={setMaxDim} />
                            </div>
                        </Space>
                    </Card>

                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} md={12}>
                            <Card size="small" title={<Space><Text strong>Original</Text><Tag>{formatBytes(origSize)}</Tag></Space>}>
                                <img src={original.img.src} alt="original" style={{ width: "100%", display: "block", borderRadius: 4 }} />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card
                                size="small"
                                title={<Space>
                                    <Text strong>Compressed</Text>
                                    {compressed && <Tag color="green">{formatBytes(newSize)}</Tag>}
                                    {compressed && <Tag color={savings > 0 ? "blue" : "default"}>{savings > 0 ? `−${savings.toFixed(1)}%` : `+${(-savings).toFixed(1)}%`}</Tag>}
                                </Space>}
                                extra={compressed && <a onClick={download}><DownloadOutlined /> Download</a>}
                            >
                                {compressed ? (
                                    <img src={compressed.url} alt="compressed" style={{ width: "100%", display: "block", borderRadius: 4 }} />
                                ) : (
                                    <Empty description="Encoding…" />
                                )}
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </ToolPageLayout>
    );
}

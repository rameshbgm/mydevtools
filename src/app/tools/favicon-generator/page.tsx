"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Upload, Button, Row, Col, Space, Tag, App, Checkbox, Empty } from "antd";
import { AppstoreOutlined, UploadOutlined, DownloadOutlined, CopyOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text, Paragraph } = Typography;
const { Dragger } = Upload;

const ALL_SIZES = [
    { size: 16, name: "favicon-16x16.png" },
    { size: 32, name: "favicon-32x32.png" },
    { size: 48, name: "favicon-48x48.png" },
    { size: 96, name: "favicon-96x96.png" },
    { size: 180, name: "apple-touch-icon.png" },
    { size: 192, name: "android-chrome-192x192.png" },
    { size: 512, name: "android-chrome-512x512.png" },
];

interface Variant { size: number; name: string; blob: Blob; url: string; }

function resizeImage(img: HTMLImageElement, size: number): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    // letterbox-fit (preserves aspect ratio inside a square)
    const aspect = img.naturalWidth / img.naturalHeight;
    let dw = size, dh = size, dx = 0, dy = 0;
    if (aspect > 1) { dh = size / aspect; dy = (size - dh) / 2; }
    else if (aspect < 1) { dw = size * aspect; dx = (size - dw) / 2; }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, dw, dh);
    return new Promise((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Encode failed")), "image/png");
    });
}

const HTML_SNIPPET = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

const MANIFEST = JSON.stringify({
    icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
}, null, 2);

export default function FaviconGeneratorPage() {
    const { message } = App.useApp();
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [selected, setSelected] = useState<number[]>(ALL_SIZES.map((s) => s.size));
    const [variants, setVariants] = useState<Variant[]>([]);

    useEffect(() => () => { variants.forEach((v) => URL.revokeObjectURL(v.url)); }, [variants]);

    useEffect(() => {
        if (!img) { setVariants([]); return; }
        let cancelled = false;
        (async () => {
            const out: Variant[] = [];
            for (const s of ALL_SIZES.filter((x) => selected.includes(x.size))) {
                try {
                    const blob = await resizeImage(img, s.size);
                    out.push({ size: s.size, name: s.name, blob, url: URL.createObjectURL(blob) });
                } catch (err) {
                    message.error(`${s.size}px: ${err instanceof Error ? err.message : String(err)}`);
                }
            }
            if (!cancelled) setVariants((prev) => { prev.forEach((v) => URL.revokeObjectURL(v.url)); return out; });
        })();
        return () => { cancelled = true; };
    }, [img, selected, message]);

    const upload = {
        beforeUpload: (file: File) => {
            const reader = new FileReader();
            reader.onload = () => {
                const i = new Image();
                i.onload = () => setImg(i);
                i.onerror = () => message.error("Decode failed");
                i.src = reader.result as string;
            };
            reader.readAsDataURL(file);
            return false;
        },
        showUploadList: false,
        accept: "image/*",
    };

    const downloadOne = (v: Variant) => {
        const a = document.createElement("a"); a.href = v.url; a.download = v.name; a.click();
    };

    const downloadAll = () => {
        variants.forEach((v, i) => setTimeout(() => downloadOne(v), i * 120));
    };

    return (
        <ToolPageLayout
            title="Favicon Generator"
            description="Produce a full favicon pack (16, 32, 48, 96, 180, 192, 512) from a single source image"
            icon={<AppstoreOutlined style={{ fontSize: 24, color: "#0284c7" }} />}
            color="#0284c7"
            learnMore={{
                whatIs: "Favicon Generator takes one source image and resizes it through a Canvas at every common favicon size — browser tab icons (16/32/48), iOS home-screen (apple-touch-icon at 180), and PWA manifest icons (192/512).",
                whyUse: "Modern sites need multiple icon sizes for different platforms. Generating them by hand in a design tool is tedious and easy to get wrong. This tool produces a consistent pack from one source.",
                howToUse: [
                    "Drop a square source image — ideally 1024×1024 or larger so all downscales look crisp",
                    "Toggle which sizes you want",
                    "Preview each variant, download them individually or all at once",
                    "Copy the suggested HTML snippet and manifest into your project",
                ],
                tips: [
                    "Non-square sources are letterboxed (centered) inside a square — sharp designs centred in the source survive best",
                    "Use a PNG or SVG source; JPEG sources retain compression artefacts at small sizes",
                    "The browser uses high-quality scaling — output looks better than a default canvas resize",
                ],
                useCases: [
                    "Setting up favicons for a new web project",
                    "Refreshing a brand's icon set after a redesign",
                    "Generating PWA manifest icons",
                ],
            }}
        >
            {!img ? (
                <Card>
                    <Dragger {...upload} style={{ padding: 32 }}>
                        <UploadOutlined style={{ fontSize: 36, color: "#0284c7" }} />
                        <Text style={{ display: "block", marginTop: 12, fontSize: 16 }}>Drop source image or click</Text>
                        <Text type="secondary">PNG/SVG/JPEG · square 512×512 or larger recommended</Text>
                    </Dragger>
                </Card>
            ) : (
                <>
                    <Card>
                        <Space wrap>
                            <img src={img.src} alt="source" style={{ width: 64, height: 64, objectFit: "contain", background: "rgba(0,0,0,0.04)", borderRadius: 6 }} />
                            <Tag>{img.naturalWidth}×{img.naturalHeight}</Tag>
                            <Button size="small" onClick={() => setImg(null)}>Choose another</Button>
                            <Checkbox.Group
                                value={selected}
                                onChange={(v) => setSelected(v as number[])}
                                options={ALL_SIZES.map((s) => ({ value: s.size, label: `${s.size}px` }))}
                            />
                            <Button type="primary" icon={<DownloadOutlined />} onClick={downloadAll} disabled={!variants.length}>
                                Download all ({variants.length})
                            </Button>
                        </Space>
                    </Card>

                    <Card style={{ marginTop: 16 }} title="Variants">
                        {variants.length === 0 ? (
                            <Empty description="Generating…" />
                        ) : (
                            <Row gutter={[12, 12]}>
                                {variants.map((v) => (
                                    <Col xs={12} sm={8} md={6} lg={4} key={v.size}>
                                        <Card size="small" hoverable onClick={() => downloadOne(v)}>
                                            <div style={{ display: "grid", placeItems: "center", height: 100, background: "rgba(0,0,0,0.04)", borderRadius: 4 }}>
                                                <img src={v.url} alt={v.name} style={{ maxWidth: "100%", maxHeight: "100%" }} />
                                            </div>
                                            <div style={{ textAlign: "center", marginTop: 8, fontSize: 11 }}>
                                                <Tag>{v.size}px</Tag>
                                                <Text type="secondary" style={{ display: "block", marginTop: 4, wordBreak: "break-all" }}>{v.name}</Text>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card>

                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} md={12}>
                            <Card size="small" title="HTML <head>" extra={<a onClick={async () => { await copyToClipboard(HTML_SNIPPET); message.success("HTML copied"); }}><CopyOutlined /></a>}>
                                <Paragraph><pre style={{ margin: 0, fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>{HTML_SNIPPET}</pre></Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card size="small" title="site.webmanifest" extra={<a onClick={async () => { await copyToClipboard(MANIFEST); message.success("Manifest copied"); }}><CopyOutlined /></a>}>
                                <Paragraph><pre style={{ margin: 0, fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>{MANIFEST}</pre></Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </ToolPageLayout>
    );
}

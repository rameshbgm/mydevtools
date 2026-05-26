"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Upload, Button, Row, Col, Space, Tag, Slider, App, Empty } from "antd";
import { DotChartOutlined, UploadOutlined, CopyOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text } = Typography;
const { Dragger } = Upload;

interface Swatch { hex: string; rgb: [number, number, number]; hsl: [number, number, number]; count: number; }

function rgbToHex(r: number, g: number, b: number): string {
    const h = (n: number) => n.toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Simple iterative k-means in RGB space. Sufficient for palette extraction —
// not perceptually-accurate, but cheap and stable for ≤16 swatches.
function kmeans(pixels: number[][], k: number, iters = 8): Swatch[] {
    if (pixels.length === 0) return [];
    // seed by sampling evenly through the pixel array
    const centroids: number[][] = Array.from({ length: k }, (_, i) =>
        [...pixels[Math.floor((i + 0.5) * pixels.length / k)]]);
    const assignments = new Int32Array(pixels.length);

    for (let iter = 0; iter < iters; iter++) {
        // assign
        for (let i = 0; i < pixels.length; i++) {
            const p = pixels[i];
            let best = 0, bestD = Infinity;
            for (let c = 0; c < k; c++) {
                const dr = p[0] - centroids[c][0], dg = p[1] - centroids[c][1], db = p[2] - centroids[c][2];
                const d = dr * dr + dg * dg + db * db;
                if (d < bestD) { bestD = d; best = c; }
            }
            assignments[i] = best;
        }
        // recompute
        const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
        for (let i = 0; i < pixels.length; i++) {
            const c = assignments[i], p = pixels[i];
            sums[c][0] += p[0]; sums[c][1] += p[1]; sums[c][2] += p[2]; sums[c][3]++;
        }
        for (let c = 0; c < k; c++) {
            if (sums[c][3] > 0) {
                centroids[c] = [sums[c][0] / sums[c][3], sums[c][1] / sums[c][3], sums[c][2] / sums[c][3]];
            }
        }
    }

    const counts = new Array(k).fill(0);
    for (let i = 0; i < assignments.length; i++) counts[assignments[i]]++;

    return centroids
        .map((c, i) => {
            const r = Math.round(c[0]), g = Math.round(c[1]), b = Math.round(c[2]);
            return { hex: rgbToHex(r, g, b), rgb: [r, g, b] as [number, number, number], hsl: rgbToHsl(r, g, b), count: counts[i] };
        })
        .sort((a, b) => b.count - a.count);
}

function extractPixels(img: HTMLImageElement, maxDim = 200): number[][] {
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    const out: number[][] = [];
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue; // skip near-transparent
        out.push([data[i], data[i + 1], data[i + 2]]);
    }
    return out;
}

export default function ColorPaletteExtractorPage() {
    const { message } = App.useApp();
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [k, setK] = useState(6);
    const [swatches, setSwatches] = useState<Swatch[]>([]);

    useEffect(() => {
        if (!img) { setSwatches([]); return; }
        const pixels = extractPixels(img);
        setSwatches(kmeans(pixels, k));
    }, [img, k]);

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

    const copyPalette = async () => {
        const lines = swatches.map((s) => `${s.hex}  rgb(${s.rgb.join(", ")})  hsl(${s.hsl[0]}, ${s.hsl[1]}%, ${s.hsl[2]}%)`);
        await copyToClipboard(lines.join("\n"));
        message.success("Palette copied");
    };

    return (
        <ToolPageLayout
            title="Color Palette Extractor"
            description="Extract dominant colours from any image — HEX, RGB and HSL"
            icon={<DotChartOutlined style={{ fontSize: 24, color: "#0369a1" }} />}
            color="#0369a1"
            learnMore={{
                whatIs: "Color Palette Extractor downsamples your image, then runs k-means clustering in RGB space to find a representative set of dominant colours. Each cluster becomes a swatch with HEX, RGB and HSL values.",
                whyUse: "Eyeballing colours from a screenshot is unreliable. K-means converges on the perceptually-prominent colours rather than the technically-most-common pixel value (which is often background).",
                howToUse: [
                    "Drop or select an image",
                    "Pick the palette size (3-16)",
                    "Each swatch shows HEX/RGB/HSL plus the % of pixels it represents",
                    "Copy the whole palette in one click",
                ],
                tips: [
                    "Larger k captures more nuance but starts splitting near-identical shades",
                    "Near-transparent pixels are skipped — useful for icons with alpha",
                    "Image is downsampled to 200px on the longest side for speed; this rarely affects palette accuracy",
                ],
                useCases: [
                    "Building a brand colour palette from a moodboard image",
                    "Extracting theme colours from app screenshots",
                    "Generating dashboard colours that match a logo",
                ],
            }}
        >
            {!img ? (
                <Card>
                    <Dragger {...upload} style={{ padding: 32 }}>
                        <UploadOutlined style={{ fontSize: 36, color: "#0369a1" }} />
                        <Text style={{ display: "block", marginTop: 12, fontSize: 16 }}>Drop image or click to choose</Text>
                    </Dragger>
                </Card>
            ) : (
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={10}>
                        <Card size="small">
                            <img src={img.src} alt="source" style={{ width: "100%", display: "block", borderRadius: 4 }} />
                            <Space style={{ marginTop: 12 }}>
                                <Button size="small" onClick={() => setImg(null)}>Choose another</Button>
                            </Space>
                        </Card>
                        <Card size="small" title="Settings" style={{ marginTop: 16 }}>
                            <Text type="secondary" style={{ display: "block", marginBottom: 6 }}>Palette size: <Tag>{k}</Tag></Text>
                            <Slider min={3} max={16} value={k} onChange={setK} />
                        </Card>
                    </Col>
                    <Col xs={24} md={14}>
                        <Card
                            size="small"
                            title={<Space><Text strong>Palette</Text><Tag>{swatches.length} swatches</Tag></Space>}
                            extra={<a onClick={copyPalette}><CopyOutlined /> Copy</a>}
                        >
                            {swatches.length === 0 ? (
                                <Empty description="Computing…" />
                            ) : (
                                <Space orientation="vertical" style={{ width: "100%" }} size="small">
                                    {swatches.map((s) => {
                                        const total = swatches.reduce((sum, x) => sum + x.count, 0) || 1;
                                        const pct = (s.count / total) * 100;
                                        return (
                                            <div key={s.hex} style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                                                <div style={{ width: 56, height: 56, background: s.hex, borderRadius: 6, border: "1px solid rgba(0,0,0,0.08)" }} />
                                                <div style={{ flex: 1, fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>
                                                    <div><b>{s.hex.toUpperCase()}</b></div>
                                                    <div>rgb({s.rgb.join(", ")})</div>
                                                    <div>hsl({s.hsl[0]}, {s.hsl[1]}%, {s.hsl[2]}%)</div>
                                                </div>
                                                <Tag>{pct.toFixed(1)}%</Tag>
                                                <Button size="small" icon={<CopyOutlined />} onClick={async () => { await copyToClipboard(s.hex); message.success(`${s.hex} copied`); }} />
                                            </div>
                                        );
                                    })}
                                </Space>
                            )}
                        </Card>
                    </Col>
                </Row>
            )}
        </ToolPageLayout>
    );
}

"use client";

/* eslint-disable @next/next/no-img-element -- User-selected data URLs stay in this browser. */

import React, { useEffect, useState, useRef } from "react";
import { Card, Typography, Upload, Button, Row, Col, Space, Tag, Slider, Empty } from "antd";
import { DotChartOutlined, UploadOutlined, CopyOutlined } from "@ant-design/icons";
import { extractPalette, type PaletteSwatch } from "@/lib/color-palette";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text } = Typography;
const { Dragger } = Upload;

function extractPixels(img: HTMLImageElement, maxDim = 200): number[][] {
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is unavailable. Try a browser with Canvas support.");
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
    const { t } = useLanguage();
    const request = useRef(0);
    const [error, setError] = useState("");
    useEffect(() => () => { request.current++; }, []);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [k, setK] = useState(6);
    const [swatches, setSwatches] = useState<PaletteSwatch[]>([]);

    useEffect(() => {
        if (!img) { setSwatches([]); return; }
        try {
            const pixels = extractPixels(img);
            const result = extractPalette(pixels, k);
            setSwatches(result);
            setError(result.length ? "" : "No opaque pixels were found. Choose an image with visible colors.");
        } catch { setSwatches([]); setError("Palette extraction failed. Try another image or a browser with Canvas support."); }
    }, [img, k]);

    const upload = {
        beforeUpload: (file: File) => {
            const current = ++request.current;
            setImg(null); setSwatches([]); setError("");
            if (file.size > 32 * 1024 * 1024) { setError("Image file limit is 32 MiB."); return false; }
            const fail = () => { if (current === request.current) setError("Image could not be read or decoded. Choose another image."); };
            const reader = new FileReader();
            reader.onerror = fail;
            reader.onload = () => {
                if (current !== request.current) return;
                const image = new Image();
                image.onerror = fail;
                image.onload = () => { if (current === request.current) setImg(image); };
                image.src = reader.result as string;
            };
            try { reader.readAsDataURL(file); } catch { fail(); }
            return false;
        },
        showUploadList: false,
        accept: "image/*",
    };

    const copyPalette = async () => {
        if (!swatches.length) return;
        const lines = swatches.map((s) => `${s.hex}  rgb(${s.rgb.join(", ")})  hsl(${s.hsl[0]}, ${s.hsl[1]}%, ${s.hsl[2]}%)`);
        await copyToClipboard(lines.join("\n"), t("Palette copied"));
    };

    return (
        <ToolPageLayout
            title={t("Color Palette Extractor")}
            description={t("Extract dominant colours from any image — HEX, RGB and HSL")}
            icon={<DotChartOutlined style={{ fontSize: 24, color: "#0369a1" }} />}
            color="#0369a1"
            learnMore={{
                whatIs: t("Color Palette Extractor downsamples your image, then runs k-means clustering in RGB space to find a representative set of dominant colours. Each cluster becomes a swatch with HEX, RGB and HSL values."),
                whyUse: t("Group sampled pixels by RGB distance to build a starting palette. Large backgrounds can dominate; this is not a perceptual salience model."),
                howToUse: [
                    t("Drop or select an image"),
                    t("Pick the palette size (3-16)"),
                    t("Each swatch shows HEX/RGB/HSL plus the % of pixels it represents"),
                    t("Copy the whole palette in one click"),
                ],
                tips: [
                    t("Larger k captures more nuance but starts splitting near-identical shades"),
                    t("Near-transparent pixels are skipped — useful for icons with alpha"),
                    t("Images are sampled at up to 200px on the longest side. Small details may disappear from the resulting palette."),
                ],
                useCases: [
                    t("Building a brand colour palette from a moodboard image"),
                    t("Extracting theme colours from app screenshots"),
                    t("Generating dashboard colours that match a logo"),
                ],
            }}
        >
            {error && <p role="alert">{t(error)}</p>}
            {!img ? (
                <Card>
                    <Dragger {...upload} style={{ padding: 32 }}>
                        <UploadOutlined style={{ fontSize: 36, color: "#0369a1" }} />
                        <Text style={{ display: "block", marginTop: 12, fontSize: 16 }}>{t("Drop image or click to choose")}</Text>
                    </Dragger>
                </Card>
            ) : (
                <Row className="signal-working-panes" gutter={[16, 16]}>
                    <Col xs={24} md={10}>
                        <Card size="small">
                            <img src={img.src} alt={t("Source image")} style={{ width: "100%", display: "block", borderRadius: 4 }} />
                            <Space style={{ marginTop: 12 }}>
                                <Button size="small" onClick={() => { request.current++; setImg(null); setSwatches([]); setError(""); }}>{t("Choose another")}</Button>
                            </Space>
                        </Card>
                        <Card size="small" title={t("Settings")} style={{ marginTop: 16 }}>
                            <Text type="secondary" style={{ display: "block", marginBottom: 6 }}>{t("Palette size:")}<Tag>{k}</Tag></Text>
                            <Slider min={3} max={16} value={k} onChange={setK} />
                        </Card>
                    </Col>
                    <Col xs={24} md={14}>
                        <Card
                            size="small"
                            title={<Space><Text strong>{t("Palette")}</Text><Tag>{t("{count} swatches", { count: swatches.length })}</Tag></Space>}
                            extra={<Button size="small" icon={<CopyOutlined />} disabled={!swatches.length} onClick={() => void copyPalette()}>{t("Copy")}</Button>}
                        >
                            {swatches.length === 0 ? (
                                <Empty description={t(error ? "No palette available" : "Computing…")} />
                            ) : (
                                <Space orientation="vertical" style={{ width: "100%" }} size="small">
                                    {swatches.map((s) => {
                                        const total = swatches.reduce((sum, x) => sum + x.count, 0) || 1;
                                        const pct = (s.count / total) * 100;
                                        return (
                                            <div key={s.hex} style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
                                                <div style={{ width: 56, height: 56, background: s.hex, borderRadius: 6, border: "1px solid rgba(0,0,0,0.08)" }} />
                                                <div dir="ltr" style={{ flex: 1, fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>
                                                    <div><b>{s.hex.toUpperCase()}</b></div>
                                                    <div>rgb({s.rgb.join(", ")})</div>
                                                    <div>hsl({s.hsl[0]}, {s.hsl[1]}%, {s.hsl[2]}%)</div>
                                                </div>
                                                <Tag>{pct.toFixed(1)}%</Tag>
                                                <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={async () => { await copyToClipboard(s.hex, t("Color copied")); }} />
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

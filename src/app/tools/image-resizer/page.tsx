"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Card, Typography, Upload, Button, Row, Col, Space, Tag, InputNumber, Radio, Select,
    Slider, Switch, App, Empty,
} from "antd";
import {
    PictureOutlined, UploadOutlined, DownloadOutlined, SwapOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;
const { Dragger } = Upload;

type Format = "keep" | "image/jpeg" | "image/png" | "image/webp";
type FitMode = "fit" | "fill" | "stretch";

interface Original {
    file: File;
    img: HTMLImageElement;
    naturalW: number;
    naturalH: number;
    blobUrl: string;     // for preview
}

interface Resized {
    blob: Blob;
    url: string;
    width: number;
    height: number;
}

const PRESETS: { label: string; width: number; height: number }[] = [
    { label: "1920 × 1080 (FHD)", width: 1920, height: 1080 },
    { label: "1280 × 720 (HD)",   width: 1280, height: 720 },
    { label: "1080 × 1080 (Square)", width: 1080, height: 1080 },
    { label: "1080 × 1350 (Portrait)", width: 1080, height: 1350 },
    { label: "1200 × 630 (OG)",   width: 1200, height: 630 },
    { label: "800 × 600",         width: 800,  height: 600 },
    { label: "512 × 512",         width: 512,  height: 512 },
    { label: "256 × 256",         width: 256,  height: 256 },
];

function loadImage(file: File): Promise<Original> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => resolve({
            file, img, naturalW: img.naturalWidth, naturalH: img.naturalHeight, blobUrl: url,
        });
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Decode failed")); };
        img.src = url;
    });
}

function formatBytes(n: number) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function computeDrawRect(
    srcW: number, srcH: number, dstW: number, dstH: number, fit: FitMode,
): { sx: number; sy: number; sw: number; sh: number; dx: number; dy: number; dw: number; dh: number } {
    if (fit === "stretch") {
        return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: 0, dw: dstW, dh: dstH };
    }
    const srcRatio = srcW / srcH;
    const dstRatio = dstW / dstH;
    if (fit === "fit") {
        // letterbox — preserve full image, may leave transparent/background bars
        if (srcRatio > dstRatio) {
            const dh = dstW / srcRatio;
            return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: (dstH - dh) / 2, dw: dstW, dh };
        }
        const dw = dstH * srcRatio;
        return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: (dstW - dw) / 2, dy: 0, dw, dh: dstH };
    }
    // fill — center-crop, no bars
    if (srcRatio > dstRatio) {
        const sw = srcH * dstRatio;
        return { sx: (srcW - sw) / 2, sy: 0, sw, sh: srcH, dx: 0, dy: 0, dw: dstW, dh: dstH };
    }
    const sh = srcW / dstRatio;
    return { sx: 0, sy: (srcH - sh) / 2, sw: srcW, sh, dx: 0, dy: 0, dw: dstW, dh: dstH };
}

function resize(
    img: HTMLImageElement, width: number, height: number, fit: FitMode,
    format: Format, quality: number, sourceFormat: string,
): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return Promise.reject(new Error("Canvas not supported"));
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (fit === "fit") {
        // letterbox: transparent background unless output is JPEG (no alpha)
        const outputFormat = format === "keep" ? sourceFormat : format;
        if (outputFormat === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
        }
    }

    const rect = computeDrawRect(img.naturalWidth, img.naturalHeight, width, height, fit);
    ctx.drawImage(img, rect.sx, rect.sy, rect.sw, rect.sh, rect.dx, rect.dy, rect.dw, rect.dh);

    const outFormat = format === "keep" ? sourceFormat : format;
    const usesQuality = outFormat === "image/jpeg" || outFormat === "image/webp";
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (b) => b ? resolve(b) : reject(new Error("Encoding failed")),
            outFormat,
            usesQuality ? quality : undefined,
        );
    });
}

export default function ImageResizerPage() {
    const { message } = App.useApp();
    const [original, setOriginal] = useState<Original | null>(null);
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [lockAspect, setLockAspect] = useState(true);
    const [mode, setMode] = useState<"pixels" | "percent">("pixels");
    const [percent, setPercent] = useState(50);
    const [fit, setFit] = useState<FitMode>("fit");
    const [format, setFormat] = useState<Format>("keep");
    const [quality, setQuality] = useState(0.85);
    const [resized, setResized] = useState<Resized | null>(null);
    const [working, setWorking] = useState(false);

    // Track blob URLs in refs so cleanup runs exactly once, outside React's
    // updater functions (which are double-invoked in Strict Mode dev and
    // would otherwise revoke the same URL twice or create leaks).
    const originalUrlRef = useRef<string | null>(null);
    const resizedUrlRef = useRef<string | null>(null);
    useEffect(() => () => {
        if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
        if (resizedUrlRef.current) URL.revokeObjectURL(resizedUrlRef.current);
    }, []);

    // Initialise dimensions when a new image loads.
    useEffect(() => {
        if (!original) return;
        setWidth(original.naturalW);
        setHeight(original.naturalH);
        setPercent(100);
    }, [original]);

    const aspectRatio = original ? original.naturalW / original.naturalH : 1;

    const targetDimensions = useMemo(() => {
        if (!original) return { w: width, h: height };
        if (mode === "percent") {
            return {
                w: Math.max(1, Math.round((original.naturalW * percent) / 100)),
                h: Math.max(1, Math.round((original.naturalH * percent) / 100)),
            };
        }
        return { w: Math.max(1, width), h: Math.max(1, height) };
    }, [mode, percent, width, height, original]);

    // Auto-resize when settings change (debounced via a single setTimeout).
    useEffect(() => {
        if (!original) { setResized(null); return; }
        let cancelled = false;
        const timer = setTimeout(async () => {
            setWorking(true);
            try {
                const blob = await resize(
                    original.img,
                    targetDimensions.w,
                    targetDimensions.h,
                    fit,
                    format,
                    quality,
                    original.file.type,
                );
                if (cancelled) return;
                const newUrl = URL.createObjectURL(blob);
                // Revoke the previous URL exactly once, outside the state updater.
                if (resizedUrlRef.current) URL.revokeObjectURL(resizedUrlRef.current);
                resizedUrlRef.current = newUrl;
                setResized({
                    blob,
                    url: newUrl,
                    width: targetDimensions.w,
                    height: targetDimensions.h,
                });
            } catch (err) {
                message.error(err instanceof Error ? err.message : String(err));
            } finally {
                if (!cancelled) setWorking(false);
            }
        }, 150);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [original, targetDimensions.w, targetDimensions.h, fit, format, quality, message]);

    const upload = {
        beforeUpload: async (file: File) => {
            try {
                const loaded = await loadImage(file);
                if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
                originalUrlRef.current = loaded.blobUrl;
                setOriginal(loaded);
            } catch (err) {
                message.error(err instanceof Error ? err.message : String(err));
            }
            return false;
        },
        showUploadList: false,
        accept: "image/*",
    };

    const updateWidth = (v: number | null) => {
        const w = Math.max(1, Math.round(v ?? 0));
        setWidth(w);
        if (lockAspect && original) setHeight(Math.max(1, Math.round(w / aspectRatio)));
    };

    const updateHeight = (v: number | null) => {
        const h = Math.max(1, Math.round(v ?? 0));
        setHeight(h);
        if (lockAspect && original) setWidth(Math.max(1, Math.round(h * aspectRatio)));
    };

    const applyPreset = (preset: typeof PRESETS[number]) => {
        setMode("pixels");
        setLockAspect(false);
        setWidth(preset.width);
        setHeight(preset.height);
    };

    const swapDimensions = () => {
        setWidth(height);
        setHeight(width);
    };

    const download = () => {
        if (!resized || !original) return;
        const outFormat = format === "keep" ? original.file.type : format;
        const ext = outFormat === "image/jpeg" ? "jpg"
            : outFormat === "image/webp" ? "webp"
            : outFormat === "image/png" ? "png"
            : "bin";
        const baseName = original.file.name.replace(/\.[^.]+$/, "");
        const a = document.createElement("a");
        a.href = resized.url;
        a.download = `${baseName}-${resized.width}x${resized.height}.${ext}`;
        a.click();
    };

    return (
        <ToolPageLayout
            title="Image Resizer"
            description="Resize images by pixels, percent or preset — 100% client-side, files never leave your machine"
            icon={<PictureOutlined style={{ fontSize: 24, color: "#0284c7" }} />}
            color="#0284c7"
            learnMore={{
                whatIs: "Image Resizer scales your image to a chosen size using the browser's Canvas API. Three modes: pixel-precise, percentage, or preset. Three fit strategies: letterbox (preserve full image), center-crop (fill the box), or stretch (ignore aspect ratio).",
                whyUse: "Most online resizers upload your file to a server. This one runs entirely in your browser via Canvas — the file never leaves your device, even for huge images.",
                howToUse: [
                    "Drop or select an image",
                    "Choose pixels / percent / preset and the target dimensions",
                    "Pick a fit mode: fit (letterbox), fill (center-crop), stretch (ignore aspect)",
                    "Optionally switch output format (JPEG/PNG/WebP) and quality",
                    "Download the result",
                ],
                tips: [
                    "Lock aspect ratio: width and height move together so the image stays proportional",
                    "Fit + JPEG output paints a white background (JPEG can't be transparent)",
                    "WebP is usually 25–35% smaller than JPEG at equivalent quality",
                    "Canvas uses high-quality bicubic-ish resampling — sharper than nearest-neighbour",
                ],
                useCases: [
                    "Generating social-media images at platform-specific sizes",
                    "Creating multiple thumbnail sizes for a website",
                    "Shrinking screenshots before uploading to a PR",
                    "Producing avatar variants at standard sizes",
                ],
            }}
        >
            {!original ? (
                <Card>
                    <Dragger {...upload} style={{ padding: 32 }}>
                        <UploadOutlined style={{ fontSize: 36, color: "#0284c7" }} />
                        <Text style={{ display: "block", marginTop: 12, fontSize: 16 }}>Drop image or click to choose</Text>
                        <Text type="secondary">JPEG · PNG · WebP · GIF · any browser-decodable format</Text>
                    </Dragger>
                </Card>
            ) : (
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={8}>
                        <Card size="small" title="Source">
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                <Tag>{original.file.name}</Tag>
                                <Space wrap>
                                    <Tag color="default">{original.naturalW}×{original.naturalH}</Tag>
                                    <Tag>{formatBytes(original.file.size)}</Tag>
                                    <Tag>{original.file.type || "unknown"}</Tag>
                                </Space>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
                                        if (resizedUrlRef.current) URL.revokeObjectURL(resizedUrlRef.current);
                                        originalUrlRef.current = null;
                                        resizedUrlRef.current = null;
                                        setOriginal(null);
                                        setResized(null);
                                    }}
                                >
                                    Choose another
                                </Button>
                            </Space>
                        </Card>

                        <Card size="small" title="Dimensions" style={{ marginTop: 16 }}>
                            <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                <Radio.Group
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    optionType="button"
                                    buttonStyle="solid"
                                    size="small"
                                    options={[
                                        { value: "pixels", label: "Pixels" },
                                        { value: "percent", label: "Percent" },
                                    ]}
                                />
                                {mode === "pixels" ? (
                                    <>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                                <Text type="secondary" style={{ fontSize: 11 }}>Width (px)</Text>
                                                <InputNumber
                                                    value={width}
                                                    onChange={updateWidth}
                                                    min={1}
                                                    max={10000}
                                                    style={{ width: "100%" }}
                                                />
                                            </div>
                                            <Button aria-label="Swap"
                                                icon={<SwapOutlined />}
                                                onClick={swapDimensions}
                                                title="Swap width and height"
                                                style={{ marginTop: 16 }}
                                            />
                                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                                <Text type="secondary" style={{ fontSize: 11 }}>Height (px)</Text>
                                                <InputNumber
                                                    value={height}
                                                    onChange={updateHeight}
                                                    min={1}
                                                    max={10000}
                                                    style={{ width: "100%" }}
                                                />
                                            </div>
                                        </div>
                                        <Space>
                                            <Switch
                                                checked={lockAspect}
                                                onChange={setLockAspect}
                                                size="small"
                                            />
                                            <Text type="secondary" style={{ fontSize: 12 }}>Lock aspect ratio</Text>
                                        </Space>
                                    </>
                                ) : (
                                    <div>
                                        <Text type="secondary" style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
                                            Scale: <Tag>{percent}%</Tag>
                                            <Text type="secondary" style={{ marginLeft: 8, fontSize: 11 }}>
                                                → {targetDimensions.w}×{targetDimensions.h}
                                            </Text>
                                        </Text>
                                        <Slider min={1} max={400} value={percent} onChange={setPercent} />
                                    </div>
                                )}

                                <div>
                                    <Text type="secondary" style={{ display: "block", marginBottom: 4, fontSize: 12 }}>Fit mode</Text>
                                    <Radio.Group
                                        value={fit}
                                        onChange={(e) => setFit(e.target.value)}
                                        optionType="button"
                                        size="small"
                                        options={[
                                            { value: "fit", label: "Fit (letterbox)" },
                                            { value: "fill", label: "Fill (crop)" },
                                            { value: "stretch", label: "Stretch" },
                                        ]}
                                    />
                                </div>

                                <div>
                                    <Text type="secondary" style={{ display: "block", marginBottom: 4, fontSize: 12 }}>Presets</Text>
                                    <Select
                                        size="small"
                                        placeholder="Pick a preset…"
                                        style={{ width: "100%" }}
                                        onChange={(idx) => applyPreset(PRESETS[idx])}
                                        options={PRESETS.map((p, i) => ({ value: i, label: p.label }))}
                                    />
                                </div>
                            </Space>
                        </Card>

                        <Card size="small" title="Output" style={{ marginTop: 16 }}>
                            <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                <div>
                                    <Text type="secondary" style={{ display: "block", marginBottom: 4, fontSize: 12 }}>Format</Text>
                                    <Radio.Group
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value)}
                                        optionType="button"
                                        size="small"
                                        options={[
                                            { value: "keep", label: "Keep" },
                                            { value: "image/jpeg", label: "JPEG" },
                                            { value: "image/png", label: "PNG" },
                                            { value: "image/webp", label: "WebP" },
                                        ]}
                                    />
                                </div>
                                {(format === "image/jpeg" || format === "image/webp" ||
                                  (format === "keep" && (original.file.type === "image/jpeg" || original.file.type === "image/webp"))) && (
                                    <div>
                                        <Text type="secondary" style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
                                            Quality: <Tag>{Math.round(quality * 100)}%</Tag>
                                        </Text>
                                        <Slider min={0.1} max={1} step={0.05} value={quality} onChange={setQuality} />
                                    </div>
                                )}
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    onClick={download}
                                    disabled={!resized || working}
                                    block
                                >
                                    Download
                                </Button>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card
                                    size="small"
                                    title={
                                        <Space>
                                            <Text strong>Original</Text>
                                            <Tag>{original.naturalW}×{original.naturalH}</Tag>
                                            <Tag>{formatBytes(original.file.size)}</Tag>
                                        </Space>
                                    }
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={original.blobUrl}
                                        alt={original.file.name}
                                        style={{ width: "100%", display: "block", borderRadius: 4, background: "rgba(0,0,0,0.04)" }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card
                                    size="small"
                                    title={
                                        <Space>
                                            <Text strong>Resized</Text>
                                            {resized && (
                                                <>
                                                    <Tag color="blue">{resized.width}×{resized.height}</Tag>
                                                    <Tag color="green">{formatBytes(resized.blob.size)}</Tag>
                                                    {resized.blob.size < original.file.size && (
                                                        <Tag color="purple">
                                                            −{Math.round((1 - resized.blob.size / original.file.size) * 100)}%
                                                        </Tag>
                                                    )}
                                                </>
                                            )}
                                        </Space>
                                    }
                                >
                                    {resized ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={resized.url}
                                            alt="resized"
                                            style={{ width: "100%", display: "block", borderRadius: 4, background: "rgba(0,0,0,0.04)" }}
                                        />
                                    ) : (
                                        <Empty description={working ? "Resizing…" : "Adjust the dimensions"} />
                                    )}
                                </Card>
                            </Col>
                        </Row>
                        <Paragraph type="secondary" style={{ marginTop: 12, fontSize: 11, marginBottom: 0 }}>
                            Resizing runs entirely in your browser via the Canvas API — the file is never uploaded to a server.
                        </Paragraph>
                    </Col>
                </Row>
            )}
        </ToolPageLayout>
    );
}

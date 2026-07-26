"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, Typography, Upload, Button, Row, Col, Space, Tag, Radio, Slider, App, Empty } from "antd";
import { PictureOutlined, UploadOutlined, ReloadOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;
const { Dragger } = Upload;

type Mode = "side-by-side" | "overlay" | "difference";

interface LoadedImage { name: string; img: HTMLImageElement; w: number; h: number; }

function loadImageFromFile(file: File): Promise<LoadedImage> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve({ name: file.name, img, w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => reject(new Error("Could not decode image"));
            img.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
    });
}

interface DiffStats { totalPixels: number; diffPixels: number; }

export default function ImageDiffPage() {
    const { message } = App.useApp();
    const [left, setLeft] = useState<LoadedImage | null>(null);
    const [right, setRight] = useState<LoadedImage | null>(null);
    const [mode, setMode] = useState<Mode>("difference");
    const [tolerance, setTolerance] = useState(10);
    const [overlayAlpha, setOverlayAlpha] = useState(50);
    const [stats, setStats] = useState<DiffStats | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const upload = (which: "left" | "right") => ({
        beforeUpload: async (file: File) => {
            try {
                const img = await loadImageFromFile(file);
                (which === "left" ? setLeft : setRight)(img);
            } catch (err) {
                message.error(err instanceof Error ? err.message : String(err));
            }
            return false;
        },
        showUploadList: false,
        accept: "image/*",
    });

    useEffect(() => {
        if (!left || !right) { setStats(null); return; }
        const canvas = canvasRef.current;
        if (!canvas) return;

        const w = Math.max(left.w, right.w);
        const h = Math.max(left.h, right.h);
        canvas.width = mode === "side-by-side" ? w * 2 + 4 : w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (mode === "side-by-side") {
            ctx.drawImage(left.img, 0, 0);
            ctx.fillStyle = "#000";
            ctx.fillRect(w, 0, 4, h);
            ctx.drawImage(right.img, w + 4, 0);
            setStats(null);
            return;
        }

        if (mode === "overlay") {
            ctx.drawImage(left.img, 0, 0, w, h);
            ctx.globalAlpha = overlayAlpha / 100;
            ctx.drawImage(right.img, 0, 0, w, h);
            ctx.globalAlpha = 1;
            setStats(null);
            return;
        }

        // difference mode — pixel comparison
        const aCanvas = document.createElement("canvas"); aCanvas.width = w; aCanvas.height = h;
        const bCanvas = document.createElement("canvas"); bCanvas.width = w; bCanvas.height = h;
        const aCtx = aCanvas.getContext("2d")!;
        const bCtx = bCanvas.getContext("2d")!;
        aCtx.drawImage(left.img, 0, 0, w, h);
        bCtx.drawImage(right.img, 0, 0, w, h);
        const a = aCtx.getImageData(0, 0, w, h);
        const b = bCtx.getImageData(0, 0, w, h);
        const out = ctx.createImageData(w, h);
        let diff = 0;
        for (let i = 0; i < a.data.length; i += 4) {
            const dr = Math.abs(a.data[i] - b.data[i]);
            const dg = Math.abs(a.data[i + 1] - b.data[i + 1]);
            const db = Math.abs(a.data[i + 2] - b.data[i + 2]);
            const maxD = Math.max(dr, dg, db);
            if (maxD > tolerance) {
                diff++;
                out.data[i] = 255; out.data[i + 1] = 0; out.data[i + 2] = 0; out.data[i + 3] = 255;
            } else {
                const grey = (a.data[i] + a.data[i + 1] + a.data[i + 2]) / 3;
                out.data[i] = grey; out.data[i + 1] = grey; out.data[i + 2] = grey; out.data[i + 3] = 64;
            }
        }
        ctx.putImageData(out, 0, 0);
        setStats({ totalPixels: w * h, diffPixels: diff });
    }, [left, right, mode, tolerance, overlayAlpha]);

    const swap = () => { const t = left; setLeft(right); setRight(t); };

    return (
        <ToolPageLayout
            title="Image Diff"
            description="Pixel-perfect visual comparison with side-by-side, overlay and difference modes"
            icon={<PictureOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs: "Image Diff loads two images, scales them to a common canvas, and compares them pixel-by-pixel. Three modes — side-by-side for human review, overlay for alignment checks, and difference for highlighting changed pixels.",
                whyUse: "Visual regression bugs are easy to miss with text diff. A real pixel comparison surfaces a single anti-aliased edge that shifted by one pixel — exactly the kind of thing screenshot tests catch in CI.",
                howToUse: [
                    "Drop two images into the left and right slots (any size, any format the browser decodes)",
                    "Pick a mode: difference colours changed pixels red, overlay blends them, side-by-side puts them next to each other",
                    "In difference mode, raise tolerance to ignore tiny anti-aliasing variations",
                    "Stats below show what % of pixels differ",
                ],
                tips: [
                    "Tolerance of 0 catches every JPEG re-compression artefact — start at 5-10 for realistic comparisons",
                    "If the images have different sizes, both are stretched to the larger dimensions",
                    "Everything runs locally — images never leave your browser",
                ],
                useCases: [
                    "Visual regression testing",
                    "Diffing screenshots from two builds",
                    "Detecting JPEG re-encode quality loss",
                    "Spotting near-identical duplicates",
                ],
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card size="small" title={<Space><Text strong>Left</Text>{left && <Tag>{left.w}×{left.h}</Tag>}</Space>}>
                        {left ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <img src={left.img.src} alt={left.name} style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", background: "rgba(0,0,0,0.04)", borderRadius: 4 }} />
                                <Space><Text type="secondary" style={{ fontSize: 12 }}>{left.name}</Text><Button size="small" onClick={() => setLeft(null)}>Remove</Button></Space>
                            </div>
                        ) : (
                            <Dragger {...upload("left")} style={{ padding: 12 }}>
                                <UploadOutlined style={{ fontSize: 24, color: "#fa541c" }} />
                                <Text style={{ display: "block", marginTop: 8 }}>Drop image or click</Text>
                            </Dragger>
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card size="small" title={<Space><Text strong>Right</Text>{right && <Tag>{right.w}×{right.h}</Tag>}</Space>}>
                        {right ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <img src={right.img.src} alt={right.name} style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", background: "rgba(0,0,0,0.04)", borderRadius: 4 }} />
                                <Space><Text type="secondary" style={{ fontSize: 12 }}>{right.name}</Text><Button size="small" onClick={() => setRight(null)}>Remove</Button></Space>
                            </div>
                        ) : (
                            <Dragger {...upload("right")} style={{ padding: 12 }}>
                                <UploadOutlined style={{ fontSize: 24, color: "#fa541c" }} />
                                <Text style={{ display: "block", marginTop: 8 }}>Drop image or click</Text>
                            </Dragger>
                        )}
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 16 }}>
                <Space wrap size="middle">
                    <Radio.Group
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        options={[
                            { value: "side-by-side", label: "Side-by-side" },
                            { value: "overlay", label: "Overlay" },
                            { value: "difference", label: "Difference" },
                        ]}
                        optionType="button"
                        buttonStyle="solid"
                    />
                    <Button icon={<ReloadOutlined />} onClick={swap} disabled={!left || !right}>Swap</Button>
                    {mode === "difference" && (
                        <Space>
                            <Text type="secondary">Tolerance: {tolerance}</Text>
                            <Slider value={tolerance} onChange={setTolerance} min={0} max={64} style={{ width: 140 }} />
                        </Space>
                    )}
                    {mode === "overlay" && (
                        <Space>
                            <Text type="secondary">Top opacity: {overlayAlpha}%</Text>
                            <Slider value={overlayAlpha} onChange={setOverlayAlpha} min={0} max={100} style={{ width: 140 }} />
                        </Space>
                    )}
                    {stats && (
                        <Space>
                            <Tag color="red">{stats.diffPixels.toLocaleString()} different pixels</Tag>
                            <Tag color="blue">{((stats.diffPixels / stats.totalPixels) * 100).toFixed(2)}%</Tag>
                        </Space>
                    )}
                </Space>
            </Card>

            <Card style={{ marginTop: 16 }} title="Comparison">
                {(!left || !right) ? (
                    <Empty description="Load images on both sides" />
                ) : (
                    <div style={{ overflow: "auto", maxHeight: 600, background: "rgba(0,0,0,0.04)", borderRadius: 6 }}>
                        <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto", maxWidth: "100%" }} />
                    </div>
                )}
            </Card>
        </ToolPageLayout>
    );
}

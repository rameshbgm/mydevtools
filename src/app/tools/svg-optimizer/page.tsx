"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Typography, Input, Row, Col, Switch, Slider, Space, Tag, App } from "antd";
import { ScissorOutlined, CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { optimizeSvg, DEFAULT_OPTS, type OptimizeOptions } from "./optimize";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

function formatBytes(n: number) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

const SAMPLE_SVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (https://inkscape.org) -->
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="100"
   height="100"
   viewBox="0 0 100 100"
   version="1.1"
   xmlns="http://www.w3.org/2000/svg">
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><dc:title></dc:title></rdf:RDF>
  </metadata>
  <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" />
  <circle
     cx="50.000000"
     cy="50.000000"
     r="40.123456789"
     fill="#0891b2"
     inkscape:label="circle" />
</svg>`;

export default function SvgOptimizerPage() {
    const { message } = App.useApp();
    const [mounted, setMounted] = useState(false);
    const [input, setInput] = useState(SAMPLE_SVG);
    const [opts, setOpts] = useState<OptimizeOptions>(DEFAULT_OPTS);

    useEffect(() => { setMounted(true); }, []);

    const output = useMemo(() => optimizeSvg(input, opts), [input, opts]);

    const inSize = new TextEncoder().encode(input).length;
    const outSize = new TextEncoder().encode(output).length;
    const savings = inSize > 0 ? Math.max(0, 100 - (outSize / inSize) * 100) : 0;

    const copyOutput = async () => {
        await copyToClipboard(output);
        message.success("Optimised SVG copied");
    };

    const downloadOutput = () => downloadText(output, "optimized.svg", "image/svg+xml");

    return (
        <ToolPageLayout
            title="SVG Optimizer"
            description="Strip editor metadata, collapse whitespace, round numeric precision — shrink SVG markup safely"
            icon={<ScissorOutlined style={{ fontSize: 24, color: "#38bdf8" }} />}
            color="#38bdf8"
            learnMore={{
                whatIs: "SVG files exported from design tools carry a lot of editor metadata, redundant attributes, generous decimal precision, and pretty-printing whitespace. SVG Optimizer rewrites the markup with safe transformations that don't change rendered output.",
                whyUse: "A typical exported SVG is 5–10× larger than its rendered information requires. Trimming it improves page load, reduces bundle size, and (importantly) makes diffs readable when SVGs are committed to git.",
                howToUse: [
                    "Paste your SVG markup on the left",
                    "Toggle optimisations and decimal precision on the right",
                    "Inspect the rendered preview to confirm visual parity",
                    "Copy or download the result",
                ],
                tips: [
                    "Higher decimal places preserve fidelity but cost bytes — 2–3 is usually invisible",
                    "Editor metadata stripping removes inkscape/sodipodi/sketch attributes that no browser uses",
                    "If the rendered preview changes, lower the precision — that's almost always the cause",
                ],
                useCases: [
                    "Shrinking SVG assets shipped to production",
                    "Cleaning Figma/Sketch exports for inline use",
                    "Making icon set PRs reviewable",
                    "Preparing SVGs for use as React components",
                ],
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card size="small" title={<><Text strong>Input</Text> <Tag style={{ marginLeft: 8 }}>{formatBytes(inSize)}</Tag></>}>
                        <TextArea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoSize={{ minRows: 10, maxRows: 16 }}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                        />
                    </Card>

                    <Card size="small" style={{ marginTop: 16 }} title={
                        <Space>
                            <Text strong>Output</Text>
                            <Tag color="green">{formatBytes(outSize)}</Tag>
                            <Tag color="blue">−{savings.toFixed(1)}%</Tag>
                            <Button type="text" size="small" icon={<CopyOutlined />} onClick={copyOutput}>Copy</Button>
                            <Button type="text" size="small" icon={<DownloadOutlined />} onClick={downloadOutput}>Download</Button>
                        </Space>
                    }>
                        <TextArea
                            value={output}
                            readOnly
                            autoSize={{ minRows: 10, maxRows: 16 }}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    {mounted && (
                        <Card size="small" title="Options">
                            <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                                {([
                                    ["stripComments", "Strip comments"],
                                    ["stripXmlDeclaration", "Strip XML declaration / DOCTYPE"],
                                    ["stripEditorMetadata", "Strip editor metadata"],
                                    ["stripEmptyAttrs", "Strip empty attributes"],
                                    ["collapseWhitespace", "Collapse whitespace"],
                                    ["roundNumbers", "Round numeric precision"],
                                ] as [keyof OptimizeOptions, string][]).map(([k, label]) => (
                                    <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text>{label}</Text>
                                        <Switch
                                            checked={opts[k] as boolean}
                                            onChange={(v) => setOpts((s) => ({ ...s, [k]: v }))}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <Text>Decimal places: <Tag>{opts.decimalPlaces}</Tag></Text>
                                    <Slider
                                        min={0}
                                        max={6}
                                        value={opts.decimalPlaces}
                                        onChange={(v) => setOpts((s) => ({ ...s, decimalPlaces: v }))}
                                        disabled={!opts.roundNumbers}
                                    />
                                </div>
                            </Space>
                        </Card>
                    )}

                    <Card size="small" title="Preview" style={{ marginTop: 16 }}>
                        <Paragraph type="secondary" style={{ fontSize: 12 }}>
                            Rendered from the optimised output. Both panels should look identical.
                        </Paragraph>
                        <iframe
                            title="Optimized SVG preview"
                            sandbox=""
                            referrerPolicy="no-referrer"
                            srcDoc={output}
                            style={{
                                background: "repeating-conic-gradient(rgba(0,0,0,0.04) 0% 25%, transparent 0% 50%) 50% / 16px 16px",
                                width: "100%",
                                minHeight: 160,
                                border: 0,
                                borderRadius: 8,
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

"use client";

import React, { useMemo, useState } from "react";
import { Card, Typography, Input, Row, Col, Space, Tag, Select, App } from "antd";
import { SwapOutlined, CopyOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import YAML from "yaml";
import { parseToml, serializeToml, type TomlValue } from "./toml";

const { Text } = Typography;
const { TextArea } = Input;

type Fmt = "toml" | "json" | "yaml";

function convert(src: string, from: Fmt, to: Fmt): string {
    if (!src.trim()) return "";
    let data: unknown;
    try {
        if (from === "json") data = JSON.parse(src);
        else if (from === "yaml") data = YAML.parse(src);
        else data = parseToml(src);
    } catch (err) {
        throw new Error(`Parse (${from}): ${err instanceof Error ? err.message : String(err)}`);
    }
    try {
        if (to === "json") return JSON.stringify(data, null, 2);
        if (to === "yaml") return YAML.stringify(data);
        return serializeToml(data as TomlValue);
    } catch (err) {
        throw new Error(`Serialize (${to}): ${err instanceof Error ? err.message : String(err)}`);
    }
}

const SAMPLE_TOML = `# Sample config
title = "mydevtools"
version = "1.4"

[server]
host = "0.0.0.0"
port = 3000
enabled = true

[database]
url = "postgres://localhost/app"
pool_size = 10
tags = ["prod", "primary"]`;

export default function TomlConverterPage() {
    const { message } = App.useApp();
    const [from, setFrom] = useState<Fmt>("toml");
    const [to, setTo] = useState<Fmt>("json");
    const [input, setInput] = useState(SAMPLE_TOML);

    const { output, error } = useMemo(() => {
        try { return { output: convert(input, from, to), error: null }; }
        catch (err) { return { output: "", error: err instanceof Error ? err.message : String(err) }; }
    }, [input, from, to]);

    const swap = () => {
        if (!error) setInput(output);
        const t = from; setFrom(to); setTo(t);
    };

    const copyOutput = async () => {
        await copyToClipboard(output);
        message.success(`${to.toUpperCase()} copied`);
    };

    return (
        <ToolPageLayout
            title="TOML Converter"
            description="Convert between TOML, JSON and YAML config formats"
            icon={<SwapOutlined style={{ fontSize: 24, color: "#a16207" }} />}
            color="#a16207"
            learnMore={{
                whatIs: "TOML Converter parses TOML, JSON or YAML input and re-emits it in another format. Useful when migrating between Cargo (TOML), npm/package.json (JSON), GitHub Actions (YAML) and pyproject.toml.",
                whyUse: "Converting between config formats by hand drops types subtly (booleans become strings, ints become floats). A proper round-trip preserves them.",
                howToUse: [
                    "Pick the input format (defaults to TOML)",
                    "Paste your config",
                    "Pick the output format and copy the result",
                    "Use the swap button to invert the conversion",
                ],
                tips: [
                    "TOML support covers sections, dotted keys, scalars, arrays (including nested), inline tables ({ x = 1 }) and arrays of tables ([[server]]). Multi-line strings (\"\"\"...\"\"\") are the main gap — convert via JSON if you hit one.",
                    "A `#` inside a quoted string is kept, not treated as a comment — so `color = \"#ff0000\"` and URLs with fragments round-trip correctly.",
                    "YAML output uses block style for readability; pass it through `yq` if you need flow style.",
                    "Round-trip JSON ↔ YAML is always lossless; TOML may lose comments.",
                ],
                useCases: [
                    "Migrating a Python project's setup.cfg to pyproject.toml",
                    "Converting between docker-compose.yaml and an equivalent JSON",
                    "Generating example configs from a canonical source",
                ],
            }}
        >
            <Card>
                <Space wrap size="middle" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Space>
                        <Text type="secondary">From:</Text>
                        <Select value={from} onChange={setFrom} options={[
                            { value: "toml", label: "TOML" },
                            { value: "json", label: "JSON" },
                            { value: "yaml", label: "YAML" },
                        ]} style={{ width: 100 }} />
                        <a onClick={swap}>↔ swap</a>
                        <Text type="secondary">To:</Text>
                        <Select value={to} onChange={setTo} options={[
                            { value: "toml", label: "TOML" },
                            { value: "json", label: "JSON" },
                            { value: "yaml", label: "YAML" },
                        ]} style={{ width: 100 }} />
                    </Space>
                    {error ? <Tag color="red">Parse error</Tag> : <Tag color="green">OK</Tag>}
                </Space>
            </Card>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                    <Card size="small" title={<Space><Text strong>Input</Text><Tag color="blue">{from.toUpperCase()}</Tag></Space>}>
                        <TextArea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoSize={{ minRows: 16, maxRows: 28 }}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        size="small"
                        title={<Space><Text strong>Output</Text><Tag color="green">{to.toUpperCase()}</Tag></Space>}
                        extra={!error && <a onClick={copyOutput}><CopyOutlined /> Copy</a>}
                    >
                        {error ? (
                            <Text type="danger" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, whiteSpace: "pre-wrap" }}>{error}</Text>
                        ) : (
                            <TextArea
                                value={output}
                                readOnly
                                autoSize={{ minRows: 16, maxRows: 28 }}
                                style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

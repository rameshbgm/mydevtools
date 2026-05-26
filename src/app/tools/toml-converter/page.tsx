"use client";

import React, { useMemo, useState } from "react";
import { Card, Typography, Input, Row, Col, Space, Tag, Select, App } from "antd";
import { SwapOutlined, CopyOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import YAML from "yaml";

const { Text } = Typography;
const { TextArea } = Input;

type Fmt = "toml" | "json" | "yaml";

// ──────────────────────────────────────────────────────────────────────────────
// Minimal TOML parser / serializer.
// Supports: key=value, [section], [nested.section], strings (basic + literal),
// numbers, booleans, dates (as strings), inline arrays of scalars.
// Not supported: inline tables, arrays of tables ([[a.b]]), multi-line strings.
// Adequate for most config-conversion scenarios; fall back to JSON for edge cases.
// ──────────────────────────────────────────────────────────────────────────────

type TomlValue = string | number | boolean | TomlValue[] | { [k: string]: TomlValue };

function parseToml(src: string): TomlValue {
    const root: Record<string, TomlValue> = {};
    let cur: Record<string, TomlValue> = root;
    src.split("\n").forEach((rawLine) => {
        const line = rawLine.replace(/#.*$/, "").trim();
        if (!line) return;
        const section = line.match(/^\[([^\]]+)\]$/);
        if (section) {
            const path = section[1].split(".").map((p) => p.trim());
            cur = root;
            for (const part of path) {
                const next = (cur[part] as Record<string, TomlValue>) || {};
                cur[part] = next;
                cur = next;
            }
            return;
        }
        const kv = line.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.+)$/);
        if (!kv) return;
        cur[kv[1]] = parseTomlValue(kv[2]);
    });
    return root;
}

function parseTomlValue(s: string): TomlValue {
    s = s.trim();
    if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
    if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1);
    if (s === "true") return true;
    if (s === "false") return false;
    if (/^-?\d+$/.test(s)) return parseInt(s, 10);
    if (/^-?\d+\.\d+(e-?\d+)?$/i.test(s)) return parseFloat(s);
    if (s.startsWith("[") && s.endsWith("]")) {
        const inner = s.slice(1, -1).trim();
        if (!inner) return [];
        // simple comma split (won't handle nested arrays/inline tables — OK for most configs)
        return inner.split(",").map((p) => parseTomlValue(p.trim()));
    }
    return s; // fallback: bare string
}

function serializeToml(obj: TomlValue, prefix = ""): string {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
        throw new Error("TOML root must be an object");
    }
    const out: string[] = [];
    // emit scalars first
    const entries = Object.entries(obj);
    const scalars = entries.filter(([, v]) => typeof v !== "object" || Array.isArray(v));
    const tables = entries.filter(([, v]) => typeof v === "object" && !Array.isArray(v));
    if (prefix && (scalars.length || tables.length)) out.push(`[${prefix}]`);
    for (const [k, v] of scalars) out.push(`${k} = ${formatTomlValue(v)}`);
    for (const [k, v] of tables) {
        const newPrefix = prefix ? `${prefix}.${k}` : k;
        const sub = serializeToml(v as TomlValue, newPrefix);
        if (sub) out.push("", sub);
    }
    return out.join("\n").trim();
}

function formatTomlValue(v: unknown): string {
    if (typeof v === "string") return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (Array.isArray(v)) return `[${v.map(formatTomlValue).join(", ")}]`;
    if (v === null) return '""';
    return JSON.stringify(v);
}

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
                    "TOML support here covers the common subset: sections, dotted keys, scalars, arrays of scalars. Inline tables and arrays-of-tables are not supported — convert via JSON if you hit one.",
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

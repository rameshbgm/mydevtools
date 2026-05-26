"use client";

import React, { useMemo, useState } from "react";
import { Card, Typography, Input, Row, Col, Space, Tag, Radio, App, Tooltip } from "antd";
import { CompressOutlined, CopyOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type InputFmt = "json" | "xml";

// ──────────────────────────────────────────────────────────────────────────────
// XML → JS object (uses the browser's DOMParser)
//
// Mapping rules:
//   - Attributes become `@attr` keys
//   - Multiple sibling elements with the same tag become an array
//   - Pure-text leaf elements collapse to the string value
//   - Mixed content keeps text under `#text`
// ──────────────────────────────────────────────────────────────────────────────

function xmlToObject(xml: string): unknown {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const err = doc.querySelector("parsererror");
    if (err) throw new Error(err.textContent?.trim() || "XML parse error");
    return { [doc.documentElement.tagName]: elementToValue(doc.documentElement) };
}

function elementToValue(el: Element): unknown {
    const result: Record<string, unknown> = {};
    for (const attr of Array.from(el.attributes)) {
        result[`@${attr.name}`] = attr.value;
    }
    const children = Array.from(el.children);
    if (children.length === 0) {
        const text = (el.textContent ?? "").trim();
        if (Object.keys(result).length === 0) return text;
        if (text) result["#text"] = text;
        return result;
    }
    const grouped: Record<string, Element[]> = {};
    for (const child of children) {
        (grouped[child.tagName] = grouped[child.tagName] || []).push(child);
    }
    for (const [tag, items] of Object.entries(grouped)) {
        result[tag] = items.length === 1 ? elementToValue(items[0]) : items.map(elementToValue);
    }
    const directText = Array.from(el.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent || "")
        .join("").trim();
    if (directText) result["#text"] = directText;
    return result;
}

// ──────────────────────────────────────────────────────────────────────────────
// TOON encoder
//
// TOON (Token-Oriented Object Notation) is a compact data format that drops
// JSON's structural tokens (quotes, braces, brackets, commas) wherever they
// can be inferred from layout. Key features used here:
//
//   key: value             — scalar
//   key:                   — nested object (children indented 2 sp)
//   key[N]:                — list of N items, each on a `- ` line
//   key[N]{f1,f2,f3}:      — tabular: N rows of CSV-like records
// ──────────────────────────────────────────────────────────────────────────────

const INDENT = "  ";

function encodeToon(value: unknown): string {
    if (value === null || value === undefined) return "null";
    if (typeof value !== "object") return formatScalar(value);
    const lines: string[] = [];
    if (Array.isArray(value)) {
        encodeArrayInline("data", value, lines, 0);
    } else {
        encodeObject(value as Record<string, unknown>, lines, 0);
    }
    return lines.join("\n");
}

function encodeObject(obj: Record<string, unknown>, out: string[], depth: number) {
    const pad = INDENT.repeat(depth);
    for (const [rawKey, val] of Object.entries(obj)) {
        const key = formatKey(rawKey);
        if (Array.isArray(val)) {
            encodeArrayInline(key, val, out, depth);
        } else if (typeof val === "object" && val !== null) {
            const keys = Object.keys(val);
            if (keys.length === 0) {
                out.push(`${pad}${key}: {}`);
            } else {
                out.push(`${pad}${key}:`);
                encodeObject(val as Record<string, unknown>, out, depth + 1);
            }
        } else {
            out.push(`${pad}${key}: ${formatScalar(val)}`);
        }
    }
}

function encodeArrayInline(key: string, arr: unknown[], out: string[], depth: number) {
    const pad = INDENT.repeat(depth);
    if (arr.length === 0) {
        out.push(`${pad}${key}[0]:`);
        return;
    }
    // tabular form: array of objects with same scalar fields → key[N]{f1,f2}:
    const table = detectUniformTable(arr);
    if (table) {
        out.push(`${pad}${key}[${arr.length}]{${table.fields.join(",")}}:`);
        const rowPad = INDENT.repeat(depth + 1);
        for (const row of arr) {
            const r = row as Record<string, unknown>;
            out.push(`${rowPad}${table.fields.map((f) => formatCell(r[f])).join(",")}`);
        }
        return;
    }
    out.push(`${pad}${key}[${arr.length}]:`);
    for (const item of arr) {
        encodeListItem(item, out, depth + 1);
    }
}

function encodeListItem(value: unknown, out: string[], depth: number) {
    const pad = INDENT.repeat(depth);
    if (value === null || value === undefined) { out.push(`${pad}- null`); return; }
    if (typeof value !== "object") { out.push(`${pad}- ${formatScalar(value)}`); return; }
    if (Array.isArray(value)) {
        out.push(`${pad}-`);
        // emit each nested item one deeper, also using `- ` prefix
        for (const item of value) encodeListItem(item, out, depth + 1);
        return;
    }
    const entries = Object.entries(value);
    if (entries.length === 0) { out.push(`${pad}- {}`); return; }
    out.push(`${pad}-`);
    encodeObject(value as Record<string, unknown>, out, depth + 1);
}

function detectUniformTable(arr: unknown[]): { fields: string[] } | null {
    if (arr.length === 0) return null;
    const first = arr[0];
    if (typeof first !== "object" || first === null || Array.isArray(first)) return null;
    const fields = Object.keys(first);
    if (fields.length === 0) return null;
    for (const item of arr) {
        if (typeof item !== "object" || item === null || Array.isArray(item)) return null;
        const keys = Object.keys(item);
        if (keys.length !== fields.length) return null;
        for (let i = 0; i < fields.length; i++) {
            if (keys[i] !== fields[i]) return null;
            const v = (item as Record<string, unknown>)[fields[i]];
            if (v !== null && typeof v === "object") return null; // table cells must be scalar
        }
    }
    return { fields };
}

function formatScalar(v: unknown): string {
    if (v === null) return "null";
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "number") return Number.isFinite(v) ? String(v) : JSON.stringify(String(v));
    if (typeof v === "string") return formatString(v);
    return JSON.stringify(v);
}

// A string can be written bare in TOON when it's free of structural characters,
// doesn't visually collide with reserved literals (true/false/null/numbers),
// and has no leading/trailing whitespace.
function formatString(s: string): string {
    if (s === "") return '""';
    if (/^\s|\s$/.test(s)) return JSON.stringify(s);
    if (/[\n\r\t]/.test(s)) return JSON.stringify(s);
    if (/[:,\[\]{}#"]/.test(s)) return JSON.stringify(s);
    if (s === "true" || s === "false" || s === "null") return JSON.stringify(s);
    if (/^-?\d+(\.\d+)?(e-?\d+)?$/i.test(s)) return JSON.stringify(s);
    return s;
}

// In a tabular row the separator is `,` and newlines break the row, so the
// quoting rules are stricter than for a regular scalar.
function formatCell(v: unknown): string {
    if (v === null || v === undefined) return "";
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "number") return Number.isFinite(v) ? String(v) : JSON.stringify(String(v));
    const s = String(v);
    if (s === "") return '""';
    if (/[,"\n\r]/.test(s)) return JSON.stringify(s);
    return s;
}

function formatKey(k: string): string {
    if (k === "") return '""';
    if (/^[A-Za-z_@#][A-Za-z0-9_\-.@#]*$/.test(k)) return k;
    return JSON.stringify(k);
}

// ──────────────────────────────────────────────────────────────────────────────
// Top-level conversion
// ──────────────────────────────────────────────────────────────────────────────

function convert(src: string, from: InputFmt): { toon: string; intermediate: unknown } {
    if (!src.trim()) return { toon: "", intermediate: null };
    let data: unknown;
    if (from === "json") {
        try { data = JSON.parse(src); }
        catch (err) { throw new Error(`JSON parse error: ${err instanceof Error ? err.message : String(err)}`); }
    } else {
        data = xmlToObject(src);
    }
    return { toon: encodeToon(data), intermediate: data };
}

const SAMPLE_JSON = `{
  "title": "mydevtools",
  "version": "1.4",
  "active": true,
  "users": [
    { "id": 1, "name": "Ada Lovelace", "role": "admin" },
    { "id": 2, "name": "Alan Turing", "role": "user" },
    { "id": 3, "name": "Grace Hopper", "role": "user" }
  ],
  "tags": ["primary", "release", "stable"]
}`;

const SAMPLE_XML = `<library>
  <title>mydevtools</title>
  <books>
    <book id="1">
      <title>Code</title>
      <author>Charles Petzold</author>
    </book>
    <book id="2">
      <title>SICP</title>
      <author>Abelson and Sussman</author>
    </book>
  </books>
</library>`;

export default function ToonConverterPage() {
    const { message } = App.useApp();
    const [from, setFrom] = useState<InputFmt>("json");
    const [input, setInput] = useState(SAMPLE_JSON);

    const { output, error } = useMemo(() => {
        try { return { output: convert(input, from).toon, error: null }; }
        catch (err) { return { output: "", error: err instanceof Error ? err.message : String(err) }; }
    }, [input, from]);

    const switchFrom = (next: InputFmt) => {
        // If the user is on the sample for the old format, swap in the new sample.
        if (next !== from) {
            if (from === "json" && input === SAMPLE_JSON) setInput(SAMPLE_XML);
            else if (from === "xml" && input === SAMPLE_XML) setInput(SAMPLE_JSON);
        }
        setFrom(next);
    };

    const inChars = input.length;
    const outChars = output.length;
    const charsSaved = Math.max(0, inChars - outChars);
    const savingsPct = inChars > 0 ? (charsSaved / inChars) * 100 : 0;

    // Rough token estimate (LLM context): ~4 characters per token for English-like text.
    // Not exact, but a useful order-of-magnitude indicator for prompt budgeting.
    const tokensInApprox = Math.ceil(inChars / 4);
    const tokensOutApprox = Math.ceil(outChars / 4);
    const tokensSaved = Math.max(0, tokensInApprox - tokensOutApprox);

    const copyOutput = async () => {
        await copyToClipboard(output);
        message.success("TOON copied");
    };

    return (
        <ToolPageLayout
            title="TOON Converter"
            description="Convert JSON or XML to TOON (Token-Oriented Object Notation) — compact, LLM-friendly, with live character savings"
            icon={<CompressOutlined style={{ fontSize: 24, color: "#7c3aed" }} />}
            color="#7c3aed"
            learnMore={{
                whatIs: "TOON (Token-Oriented Object Notation) is a compact text format for structured data. It uses indentation instead of braces, declares array shapes upfront (e.g. users[2]{id,name}:), and drops quotes on strings that don't need them. The result reads like YAML but parses more strictly, and uses noticeably fewer characters than equivalent JSON.",
                whyUse: "Large language models price requests by tokens; configuration files and structured fixtures are often the largest single contribution to prompt size. Converting JSON or XML payloads to TOON typically cuts 30–50% of characters for tabular data and 10–25% for nested objects — directly reducing token spend.",
                howToUse: [
                    "Pick the input format (JSON or XML)",
                    "Paste your document on the left",
                    "Compact TOON appears on the right; copy when satisfied",
                    "The 'Characters saved' badge shows the size delta",
                ],
                tips: [
                    "Tabular data (arrays of objects with the same scalar fields) compress the most — TOON emits a header row plus CSV-like rows instead of repeating keys.",
                    "Strings that look like numbers, booleans, null, or contain structural characters are auto-quoted to preserve type information on parse.",
                    "XML attributes are mapped to keys prefixed with @ to preserve them through the conversion.",
                ],
                useCases: [
                    "Reducing token spend on LLM prompts that embed structured data",
                    "Embedding fixtures in markdown documentation without huge JSON blocks",
                    "Producing readable diffs of large configs",
                    "Converting API responses for compact logging",
                ],
            }}
        >
            <Card>
                <Space wrap size="middle" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Space wrap>
                        <Text type="secondary">From:</Text>
                        <Radio.Group
                            value={from}
                            onChange={(e) => switchFrom(e.target.value)}
                            options={[
                                { value: "json", label: "JSON" },
                                { value: "xml", label: "XML" },
                            ]}
                            optionType="button"
                            buttonStyle="solid"
                        />
                        <Text type="secondary">→ TOON</Text>
                    </Space>
                    <Space wrap>
                        <Tooltip title="Input characters">
                            <Tag>in: {inChars.toLocaleString()} chars</Tag>
                        </Tooltip>
                        <Tooltip title="Output characters">
                            <Tag color="purple">out: {outChars.toLocaleString()} chars</Tag>
                        </Tooltip>
                        <Tooltip title="Bytes saved between input and output">
                            <Tag color={charsSaved > 0 ? "green" : "default"}>
                                saved: {charsSaved.toLocaleString()} ({savingsPct.toFixed(1)}%)
                            </Tag>
                        </Tooltip>
                        <Tooltip title="Approximate tokens (≈ 4 chars/token). Useful for LLM budgeting, not exact.">
                            <Tag color={tokensSaved > 0 ? "geekblue" : "default"}>
                                ≈ {tokensSaved} tokens saved
                            </Tag>
                        </Tooltip>
                    </Space>
                </Space>
            </Card>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                    <Card size="small" title={<Space><Text strong>Input</Text><Tag color="blue">{from.toUpperCase()}</Tag></Space>}>
                        <TextArea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoSize={{ minRows: 18, maxRows: 32 }}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        size="small"
                        title={<Space><Text strong>Output</Text><Tag color="purple">TOON</Tag></Space>}
                        extra={!error && output && <a onClick={copyOutput}><CopyOutlined /> Copy</a>}
                    >
                        {error ? (
                            <Text type="danger" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, whiteSpace: "pre-wrap" }}>
                                {error}
                            </Text>
                        ) : (
                            <TextArea
                                value={output}
                                readOnly
                                autoSize={{ minRows: 18, maxRows: 32 }}
                                style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            <Card size="small" style={{ marginTop: 16 }} title="How TOON compresses">
                <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>
                    TOON&rsquo;s biggest savings come from <b>tabular arrays</b> — arrays of objects with the same scalar fields. Instead of repeating keys per row, it emits one header line and CSV-like rows.
                </Paragraph>
                <Row gutter={[12, 12]}>
                    <Col xs={24} md={12}>
                        <Card size="small" type="inner" title="JSON" style={{ background: "rgba(0,0,0,0.02)" }}>
                            <pre style={{ margin: 0, fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>{`[
  {"id":1,"name":"Ada","role":"admin"},
  {"id":2,"name":"Bob","role":"user"},
  {"id":3,"name":"Cora","role":"user"}
]`}</pre>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card size="small" type="inner" title="TOON" style={{ background: "rgba(124,58,237,0.04)" }}>
                            <pre style={{ margin: 0, fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>{`data[3]{id,name,role}:
  1,Ada,admin
  2,Bob,user
  3,Cora,user`}</pre>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </ToolPageLayout>
    );
}

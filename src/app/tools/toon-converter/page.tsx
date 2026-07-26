"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Typography, Input, Row, Col, Space, Tag, Radio, Segmented, App, Tooltip } from "antd";
import { CompressOutlined, CopyOutlined, SwapOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import { encodeToon, decodeToon } from "@/lib/toon";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type StructFmt = "json" | "xml";
type Direction = "encode" | "decode";

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

// JS object → XML, the inverse of xmlToObject's mapping above.
function objectToXml(obj: unknown, rootTag = "root"): string {
    function valueToXml(tag: string, val: unknown): string {
        if (val === null || val === undefined) return `<${tag}/>`;
        if (typeof val !== "object") return `<${tag}>${escapeXml(String(val))}</${tag}>`;
        if (Array.isArray(val)) return val.map((v) => valueToXml(tag, v)).join("");
        const entries = Object.entries(val as Record<string, unknown>);
        const attrs = entries.filter(([k]) => k.startsWith("@"));
        const children = entries.filter(([k]) => !k.startsWith("@") && k !== "#text");
        const text = (val as Record<string, unknown>)["#text"];
        const attrStr = attrs.map(([k, v]) => ` ${k.slice(1)}="${escapeXml(String(v))}"`).join("");
        const childStr = children.map(([k, v]) => valueToXml(k, v)).join("");
        const textStr = typeof text === "string" ? escapeXml(text) : "";
        if (!childStr && !textStr) return `<${tag}${attrStr}/>`;
        return `<${tag}${attrStr}>${childStr}${textStr}</${tag}>`;
    }
    if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
        const entries = Object.entries(obj as Record<string, unknown>);
        if (entries.length === 1) return valueToXml(entries[0][0], entries[0][1]);
    }
    return valueToXml(rootTag, obj);
}

function escapeXml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function convert(src: string, direction: Direction, from: StructFmt, to: StructFmt): { output: string; error: string | null } {
    if (!src.trim()) return { output: "", error: null };
    try {
        if (direction === "encode") {
            const data = from === "json" ? JSON.parse(src) : xmlToObject(src);
            return { output: encodeToon(data), error: null };
        }
        const data = decodeToon(src);
        return { output: to === "xml" ? objectToXml(data) : JSON.stringify(data, null, 2), error: null };
    } catch (err) {
        return { output: "", error: err instanceof Error ? err.message : String(err) };
    }
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

const SAMPLE_TOON = `title: mydevtools
version: 1.4
active: true
users[3]{id,name,role}:
  1,Ada Lovelace,admin
  2,Alan Turing,user
  3,Grace Hopper,user
tags[3]:
  - primary
  - release
  - stable`;

interface ShareState { direction: Direction; structFmt: StructFmt; input: string; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "toon-converter", version: 1 };

export default function ToonConverterPage() {
    const { message } = App.useApp();
    const [direction, setDirection] = useState<Direction>("encode");
    const [structFmt, setStructFmt] = useState<StructFmt>("json");
    const [input, setInput] = useState(SAMPLE_JSON);
    const [tokenCounts, setTokenCounts] = useState<{ in: number; out: number } | null>(null);
    const countTokensRef = useRef<((t: string) => number) | null>(null);

    const from = direction === "encode" ? structFmt : ("toon" as const);
    const to = direction === "encode" ? ("toon" as const) : structFmt;

    const { output, error } = useMemo(
        () => convert(input, direction, structFmt, structFmt),
        [input, direction, structFmt]
    );

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!countTokensRef.current) {
                const { countTokens } = await import("gpt-tokenizer");
                countTokensRef.current = countTokens;
            }
            if (cancelled) return;
            const fn = countTokensRef.current;
            setTokenCounts({ in: fn(input), out: fn(output) });
        })();
        return () => { cancelled = true; };
    }, [input, output]);

    const switchDirection = (next: Direction) => {
        if (next === direction) return;
        // Swap in the matching sample so the user isn't left staring at
        // JSON in a "decode from TOON" pane or vice versa.
        if (next === "decode" && direction === "encode") setInput(SAMPLE_TOON);
        else if (next === "encode" && direction === "decode") setInput(structFmt === "json" ? SAMPLE_JSON : SAMPLE_XML);
        setDirection(next);
    };

    const switchStructFmt = (next: StructFmt) => {
        if (next === structFmt) return;
        if (direction === "encode") {
            if (structFmt === "json" && input === SAMPLE_JSON) setInput(SAMPLE_XML);
            else if (structFmt === "xml" && input === SAMPLE_XML) setInput(SAMPLE_JSON);
        }
        setStructFmt(next);
    };

    const inChars = input.length;
    const outChars = output.length;
    const charsSaved = Math.max(0, inChars - outChars);
    const savingsPct = inChars > 0 ? (charsSaved / inChars) * 100 : 0;

    const tokensIn = tokenCounts?.in ?? 0;
    const tokensOut = tokenCounts?.out ?? 0;
    const tokensSaved = Math.max(0, tokensIn - tokensOut);
    const tokensSavedPct = tokensIn > 0 ? (tokensSaved / tokensIn) * 100 : 0;

    const copyOutput = async () => {
        await copyToClipboard(output);
        message.success("Copied");
    };

    useShareableState(SHARE_SCHEMA, (s) => {
        setDirection(s.direction);
        setStructFmt(s.structFmt);
        setInput(s.input);
    });

    const emitKind = direction === "encode" ? "text" : structFmt;

    return (
        <ToolPageLayout
            title="TOON Converter"
            description="Convert JSON or XML to TOON (Token-Oriented Object Notation) and back — compact, LLM-friendly, with real token savings"
            icon={<CompressOutlined style={{ fontSize: 24, color: "#7c3aed" }} />}
            color="#7c3aed"
            learnMore={{
                whatIs: "TOON (Token-Oriented Object Notation) is a compact text format for structured data. It uses indentation instead of braces, declares array shapes upfront (e.g. users[2]{id,name}:), and drops quotes on strings that don't need them. The result reads like YAML but parses more strictly, and uses noticeably fewer tokens than equivalent JSON.",
                whyUse: "Large language models price requests by tokens, not characters; configuration files and structured fixtures are often the largest single contribution to prompt size. Converting JSON or XML payloads to TOON typically cuts real token counts noticeably for tabular data, and this tool measures the actual token difference rather than approximating from character count.",
                howToUse: [
                    "Choose a direction: encode (JSON/XML → TOON) or decode (TOON → JSON/XML)",
                    "Pick the structured format on the other side of the conversion",
                    "Paste your document; the converted output appears on the right",
                    "The token badges show the real difference, measured with the same tokenizer OpenAI uses server-side",
                ],
                tips: [
                    "Tabular data (arrays of objects with the same scalar fields) compress the most — TOON emits a header row plus CSV-like rows instead of repeating keys.",
                    "Strings that look like numbers, booleans, null, or contain structural characters are auto-quoted to preserve type information on parse.",
                    "XML attributes are mapped to keys prefixed with @ to preserve them through the conversion.",
                    "Decoding is strict about indentation — TOON emitted by this tool round-trips exactly, but hand-edited TOON with inconsistent indentation may not parse as expected.",
                ],
                useCases: [
                    "Reducing token spend on LLM prompts that embed structured data",
                    "Converting a model's TOON output back to JSON for your application code",
                    "Embedding fixtures in markdown documentation without huge JSON blocks",
                    "Producing readable diffs of large configs",
                ],
            }}
        >
            <ToolBridgeBanner
                accepts={["json", "xml", "text"]}
                onAccept={(p) => {
                    if (p.kind === "xml") { setDirection("encode"); setStructFmt("xml"); }
                    else if (p.kind === "json") { setDirection("encode"); setStructFmt("json"); }
                    setInput(p.data);
                }}
            />

            <Card>
                <Space wrap size="middle" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Space wrap>
                        <Segmented
                            value={direction}
                            onChange={(v) => switchDirection(v as Direction)}
                            options={[
                                { value: "encode", label: `${structFmt.toUpperCase()} → TOON` },
                                { value: "decode", label: `TOON → ${structFmt.toUpperCase()}` },
                            ]}
                        />
                        <Text type="secondary">Format:</Text>
                        <Radio.Group
                            value={structFmt}
                            onChange={(e) => switchStructFmt(e.target.value)}
                            options={[
                                { value: "json", label: "JSON" },
                                { value: "xml", label: "XML" },
                            ]}
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </Space>
                    <Space wrap>
                        <Tooltip title="Real token counts, measured with gpt-tokenizer (o200k_base — same tokenizer OpenAI uses for GPT-4o/5.x)">
                            <Tag>in: {tokensIn.toLocaleString()} tok</Tag>
                        </Tooltip>
                        <Tooltip title="Output tokens">
                            <Tag color="purple">out: {tokensOut.toLocaleString()} tok</Tag>
                        </Tooltip>
                        <Tooltip title="Token difference between input and output">
                            <Tag color={tokensSaved > 0 ? "green" : "default"}>
                                {tokensSaved > 0 ? "saved" : "delta"}: {tokensSaved.toLocaleString()} ({tokensSavedPct.toFixed(1)}%)
                            </Tag>
                        </Tooltip>
                        <Tooltip title="Character counts, for reference">
                            <Tag color="default">chars: {inChars.toLocaleString()} → {outChars.toLocaleString()} ({savingsPct.toFixed(0)}%)</Tag>
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
                        title={<Space><Text strong>Output</Text><Tag color="purple">{to.toUpperCase()}</Tag></Space>}
                        extra={
                            <Space>
                                {!error && output && <a onClick={copyOutput}><CopyOutlined /> Copy</a>}
                                <SwapOutlined
                                    onClick={() => { if (!error && output) { setInput(output); switchDirection(direction === "encode" ? "decode" : "encode"); } }}
                                    style={{ cursor: !error && output ? "pointer" : "not-allowed", opacity: !error && output ? 1 : 0.4 }}
                                    title="Send output back as input, flipping direction"
                                />
                            </Space>
                        }
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

            <Space style={{ marginTop: 16 }}>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ direction, structFmt, input })} size="middle" />
                <SendToButton data={output} kind={emitKind} sourceToolId="toon-converter" size="middle" />
            </Space>

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

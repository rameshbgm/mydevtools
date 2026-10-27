"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Segmented, Table, Tag } from "antd";
import { Html5Outlined, CopyOutlined, SwapOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type Mode = "encode" | "decode";
type EncodeType = "all" | "named" | "numeric";

const COMMON_ENTITIES: { char: string; name: string; numeric: string; description: string }[] = [
    { char: "&", name: "&amp;", numeric: "&#38;", description: "Ampersand" },
    { char: "<", name: "&lt;", numeric: "&#60;", description: "Less than" },
    { char: ">", name: "&gt;", numeric: "&#62;", description: "Greater than" },
    { char: '"', name: "&quot;", numeric: "&#34;", description: "Double quote" },
    { char: "'", name: "&apos;", numeric: "&#39;", description: "Single quote" },
    { char: "\u00A0", name: "&nbsp;", numeric: "&#160;", description: "Non-breaking space" },
    { char: "©", name: "&copy;", numeric: "&#169;", description: "Copyright" },
    { char: "®", name: "&reg;", numeric: "&#174;", description: "Registered" },
    { char: "™", name: "&trade;", numeric: "&#8482;", description: "Trademark" },
    { char: "€", name: "&euro;", numeric: "&#8364;", description: "Euro" },
    { char: "£", name: "&pound;", numeric: "&#163;", description: "Pound" },
    { char: "¥", name: "&yen;", numeric: "&#165;", description: "Yen" },
    { char: "•", name: "&bull;", numeric: "&#8226;", description: "Bullet" },
    { char: "—", name: "&mdash;", numeric: "&#8212;", description: "Em dash" },
    { char: "–", name: "&ndash;", numeric: "&#8211;", description: "En dash" },
    { char: "…", name: "&hellip;", numeric: "&#8230;", description: "Ellipsis" },
];

const NAMED_ENTITIES: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
    "\u00A0": "&nbsp;", "©": "&copy;", "®": "&reg;", "™": "&trade;",
    "€": "&euro;", "£": "&pound;", "¥": "&yen;", "•": "&bull;",
    "—": "&mdash;", "–": "&ndash;", "…": "&hellip;",
    "¢": "&cent;", "§": "&sect;", "°": "&deg;", "±": "&plusmn;",
    "¶": "&para;", "·": "&middot;", "½": "&frac12;", "¼": "&frac14;", "¾": "&frac34;",
    "×": "&times;", "÷": "&divide;", "←": "&larr;", "→": "&rarr;", "↑": "&uarr;", "↓": "&darr;",
    "♠": "&spades;", "♣": "&clubs;", "♥": "&hearts;", "♦": "&diams;",
};

const REVERSE_ENTITIES: Record<string, string> = Object.fromEntries(
    Object.entries(NAMED_ENTITIES).map(([k, v]) => [v, k])
);

function encodeHtmlEntities(text: string, type: EncodeType): string {
    let result = "";
    for (const char of text) {
        const code = char.codePointAt(0)!;

        if (type === "named" && NAMED_ENTITIES[char]) {
            result += NAMED_ENTITIES[char];
        } else if (type === "numeric" && code > 127) {
            result += `&#${code};`;
        } else if (type === "all") {
            if (NAMED_ENTITIES[char]) {
                result += NAMED_ENTITIES[char];
            } else if (code > 127) {
                result += `&#${code};`;
            } else {
                result += char;
            }
        } else if (char === "&" || char === "<" || char === ">" || char === '"') {
            result += NAMED_ENTITIES[char] || char;
        } else {
            result += char;
        }
    }
    return result;
}

// HTML numeric-reference legacy control replacements (WHATWG parsing §13.2.5.84).
const NUMERIC_CONTROL_REPLACEMENTS: Readonly<Record<number, number>> = {
    0x80: 0x20ac, 0x82: 0x201a, 0x83: 0x0192, 0x84: 0x201e,
    0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02c6,
    0x89: 0x2030, 0x8a: 0x0160, 0x8b: 0x2039, 0x8c: 0x0152,
    0x8e: 0x017d, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201c,
    0x94: 0x201d, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
    0x98: 0x02dc, 0x99: 0x2122, 0x9a: 0x0161, 0x9b: 0x203a,
    0x9c: 0x0153, 0x9e: 0x017e, 0x9f: 0x0178,
};

function decodeHtmlEntities(text: string): string {
    // Decode one layer only, including the tool's supported named entities.
    // A decoded ampersand must not introduce another entity in this operation.
    return text.replace(/&(?:#(?:[xX]([0-9a-fA-F]+)|([0-9]+))|[a-zA-Z][a-zA-Z0-9]*);/g,
        (reference, hex: string | undefined, decimal: string | undefined) => {
            if (hex === undefined && decimal === undefined) {
                return REVERSE_ENTITIES[reference] ?? reference;
            }
            const code = parseInt(hex ?? decimal!, hex === undefined ? 10 : 16);
            if (code === 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) {
                return "\uFFFD";
            }
            return String.fromCodePoint(NUMERIC_CONTROL_REPLACEMENTS[code] ?? code);
        });
}

interface ShareState { input: string; mode: Mode; encodeType: EncodeType; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "html-entities", version: 1 };

export default function HtmlEntitiesPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState('<div class="example">Hello & welcome!</div>');
    const [mode, setMode] = useState<Mode>("encode");
    const [encodeType, setEncodeType] = useState<EncodeType>("all");

    const output = useMemo(() => {
        if (!input) return "";
        return mode === "encode"
            ? encodeHtmlEntities(input, encodeType)
            : decodeHtmlEntities(input);
    }, [input, mode, encodeType]);

    useShareableState(SHARE_SCHEMA, (s) => {
        setInput(s.input);
        setMode(s.mode);
        setEncodeType(s.encodeType);
    });

    const copyOutput = () => copyToClipboard(output, t("Copied to clipboard!"));

    const swapContent = () => {
        setInput(output);
        setMode(mode === "encode" ? "decode" : "encode");
    };

    const insertEntity = (entity: string) => {
        setInput(input + entity);
    };

    return (
        <ToolPageLayout
            title={t("HTML Entities Encoder")}
            description={t("Encode and decode HTML entities and special characters")}
            icon={<Html5Outlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs: "HTML Entities are special codes that represent characters that have special meaning in HTML or cannot be easily typed. For example, &lt; represents < and &amp; represents &. They can be named (&copy;) or numeric (&#169;).",
                whyUse: "HTML entities prevent XSS attacks by escaping special characters, display reserved HTML characters as text, and allow you to use special symbols that aren't on your keyboard.",
                howToUse: [
                    "Select 'Encode' to convert special characters to entities or 'Decode' to reverse",
                    "Choose encoding type: Named (&copy;), Numeric (&#169;), or All",
                    "Paste your text and view the transformation",
                    "Use the reference table for common entities"
                ],
                tips: [
                    "Named entities are more readable: &amp; vs &#38;",
                    "Always encode < > & and quotes in user content to prevent XSS",
                    "Numeric entities work even when named entities aren't supported",
                    "Use &nbsp; for non-breaking spaces that prevent word wrapping"
                ],
                useCases: [
                    "Escaping user input to prevent XSS vulnerabilities",
                    "Displaying code examples in HTML pages",
                    "Adding special symbols like © ® ™ € in web pages",
                    "Converting text for safe inclusion in HTML attributes"
                ]
            }}
        >
            <ToolBridgeBanner accepts={["text", "html"]} onAccept={(p) => setInput(p.data)} />

            <Row className="signal-working-panes" gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card>
                        <Space style={{ marginBottom: 16 }} wrap>
                            <Segmented
                                value={mode}
                                onChange={(v) => setMode(v as Mode)}
                                options={[
                                    { value: "encode", label: t("Encode") },
                                    { value: "decode", label: t("Decode") },
                                ]}
                            />
                            {mode === "encode" && (
                                <Segmented
                                    value={encodeType}
                                    onChange={(v) => setEncodeType(v as EncodeType)}
                                    options={[
                                        { value: "all", label: t("All Characters") },
                                        { value: "named", label: t("Named Only") },
                                        { value: "numeric", label: t("Numeric Only") },
                                    ]}
                                />
                            )}
                            <Button icon={<SwapOutlined />} onClick={swapContent}>
                                {t("Swap")}
                                </Button>
                            <ShareButton schema={SHARE_SCHEMA} getState={() => ({ input, mode, encodeType })} size="middle" />
                            <SendToButton data={output} kind={mode === "encode" ? "html" : "text"} sourceToolId="html-entities" size="middle" />
                        </Space>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>
                                    {mode === "encode" ? t("Plain Text") : t("Encoded HTML")}
                                </Text>
                                <TextArea
                                    dir={mode === "encode" ? "auto" : "ltr"}
                                    aria-label={t("Input")}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={mode === "encode"
                                        ? t("Enter text to encode...")
                                        : t("Enter HTML entities to decode...")}
                                    rows={10}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <Text strong>
                                        {mode === "encode" ? t("Encoded HTML") : t("Plain Text")}
                                    </Text>
                                    <Button size="small" icon={<CopyOutlined />} onClick={copyOutput}>
                                        {t("Copy")}
                                        </Button>
                                </div>
                                <TextArea
                                    dir={mode === "encode" ? "ltr" : "auto"}
                                    aria-label={t("Output")}
                                    value={output}
                                    readOnly
                                    rows={10}
                                    style={{ background: "var(--signal-inset)" }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    <Card title={t("Quick Insert")} style={{ marginTop: 16 }}>
                        <Space wrap>
                            {COMMON_ENTITIES.slice(0, 12).map((e) => (
                                <Button
                                    key={e.name}
                                    size="small"
                                    onClick={() => insertEntity(e.char)}
                                >
                                    <bdi dir="ltr">{e.char}</bdi> <Text type="secondary" style={{ fontSize: 11 }}><bdi dir="ltr">{e.name}</bdi></Text>
                                </Button>
                            ))}
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title={t("Common HTML Entities")}>
                        <Table
                            size="small"
                            pagination={false}
                            scroll={{ y: 300 }}
                            dataSource={COMMON_ENTITIES.map((e, i) => ({ ...e, key: i }))}
                            columns={[
                                {
                                    title: t("Char"),
                                    dataIndex: "char",
                                    width: 50,
                                    render: (text) => <Text code dir="ltr">{text}</Text>
                                },
                                {
                                    title: t("Named"),
                                    dataIndex: "name",
                                    render: (text) => <Text code dir="ltr" style={{ fontSize: 11 }}>{text}</Text>
                                },
                                {
                                    title: t("Description"),
                                    dataIndex: "description",
                                    render: (text) => <Text type="secondary" style={{ fontSize: 11 }}>{t(text)}</Text>
                                },
                            ]}
                        />
                    </Card>

                    <Card title={t("About HTML Entities")} style={{ marginTop: 16 }}>
                        <Paragraph type="secondary">
                            {t("HTML entities are special codes used to display reserved characters in HTML, or characters that are not present on your keyboard.")}
                            </Paragraph>
                        <Paragraph type="secondary">
                            {t("They begin with an ampersand (&) and end with a semicolon (;).")}
                            </Paragraph>
                        <Space wrap style={{ marginTop: 8 }}>
                            <Tag color="orange">{t("Named: &amp;")}</Tag>
                            <Tag color="blue">{t("Numeric: &#38;")}</Tag>
                            <Tag color="purple">{t("Hex: &#x26;")}</Tag>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

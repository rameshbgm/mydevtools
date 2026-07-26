"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Segmented, Table, Tag } from "antd";
import { Html5Outlined, CopyOutlined, SwapOutlined } from "@ant-design/icons";
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
    { char: " ", name: "&nbsp;", numeric: "&#160;", description: "Non-breaking space" },
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
    " ": "&nbsp;", "©": "&copy;", "®": "&reg;", "™": "&trade;",
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
        const code = char.charCodeAt(0);

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

function decodeHtmlEntities(text: string): string {
    // First decode named entities
    let result = text;
    for (const [entity, char] of Object.entries(REVERSE_ENTITIES)) {
        result = result.split(entity).join(char);
    }

    // Then decode numeric entities
    result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));

    return result;
}

interface ShareState { input: string; mode: Mode; encodeType: EncodeType; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "html-entities", version: 1 };

export default function HtmlEntitiesPage() {
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

    const copyOutput = () => copyToClipboard(output, "Copied to clipboard!");

    const swapContent = () => {
        setInput(output);
        setMode(mode === "encode" ? "decode" : "encode");
    };

    const insertEntity = (entity: string) => {
        setInput(input + entity);
    };

    return (
        <ToolPageLayout
            title="HTML Entities Encoder"
            description="Encode and decode HTML entities and special characters"
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

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card>
                        <Space style={{ marginBottom: 16 }} wrap>
                            <Segmented
                                value={mode}
                                onChange={(v) => setMode(v as Mode)}
                                options={[
                                    { value: "encode", label: "Encode" },
                                    { value: "decode", label: "Decode" },
                                ]}
                            />
                            {mode === "encode" && (
                                <Segmented
                                    value={encodeType}
                                    onChange={(v) => setEncodeType(v as EncodeType)}
                                    options={[
                                        { value: "all", label: "All Characters" },
                                        { value: "named", label: "Named Only" },
                                        { value: "numeric", label: "Numeric Only" },
                                    ]}
                                />
                            )}
                            <Button icon={<SwapOutlined />} onClick={swapContent}>
                                Swap
                            </Button>
                            <ShareButton schema={SHARE_SCHEMA} getState={() => ({ input, mode, encodeType })} size="middle" />
                            <SendToButton data={output} kind={mode === "encode" ? "html" : "text"} sourceToolId="html-entities" size="middle" />
                        </Space>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>
                                    {mode === "encode" ? "Plain Text" : "Encoded HTML"}
                                </Text>
                                <TextArea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={mode === "encode"
                                        ? "Enter text to encode..."
                                        : "Enter HTML entities to decode..."}
                                    rows={10}
                                />
                            </Col>
                            <Col span={12}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <Text strong>
                                        {mode === "encode" ? "Encoded HTML" : "Plain Text"}
                                    </Text>
                                    <Button size="small" icon={<CopyOutlined />} onClick={copyOutput}>
                                        Copy
                                    </Button>
                                </div>
                                <TextArea
                                    value={output}
                                    readOnly
                                    rows={10}
                                    style={{ background: "rgba(250, 84, 28, 0.05)" }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Quick Insert" style={{ marginTop: 16 }}>
                        <Space wrap>
                            {COMMON_ENTITIES.slice(0, 12).map((e) => (
                                <Button
                                    key={e.name}
                                    size="small"
                                    onClick={() => insertEntity(e.char)}
                                >
                                    {e.char} <Text type="secondary" style={{ fontSize: 11 }}>{e.name}</Text>
                                </Button>
                            ))}
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Common HTML Entities">
                        <Table
                            size="small"
                            pagination={false}
                            scroll={{ y: 300 }}
                            dataSource={COMMON_ENTITIES.map((e, i) => ({ ...e, key: i }))}
                            columns={[
                                {
                                    title: "Char",
                                    dataIndex: "char",
                                    width: 50,
                                    render: (text) => <Text code>{text}</Text>
                                },
                                {
                                    title: "Named",
                                    dataIndex: "name",
                                    render: (text) => <Text code style={{ fontSize: 11 }}>{text}</Text>
                                },
                                {
                                    title: "Description",
                                    dataIndex: "description",
                                    render: (text) => <Text type="secondary" style={{ fontSize: 11 }}>{text}</Text>
                                },
                            ]}
                        />
                    </Card>

                    <Card title="About HTML Entities" style={{ marginTop: 16 }}>
                        <Paragraph type="secondary">
                            HTML entities are special codes used to display reserved characters
                            in HTML, or characters that are not present on your keyboard.
                        </Paragraph>
                        <Paragraph type="secondary">
                            They begin with an ampersand (&) and end with a semicolon (;).
                        </Paragraph>
                        <Space wrap style={{ marginTop: 8 }}>
                            <Tag color="orange">Named: &amp;amp;</Tag>
                            <Tag color="blue">Numeric: &amp;#38;</Tag>
                            <Tag color="purple">Hex: &amp;#x26;</Tag>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

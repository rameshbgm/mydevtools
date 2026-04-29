"use client";

import React, { useState, useMemo } from "react";
import { Button, Card, Space, Input, Select, Switch, InputNumber, Typography } from "antd";
import { CopyOutlined, ClearOutlined, LinkOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text } = Typography;

function slugify(
    raw: string,
    opts: { separator: string; lowercase: boolean; maxLength: number; strict: boolean }
): string {
    let str = raw.normalize("NFKD").replace(/[̀-ͯ]/g, "");
    if (opts.lowercase) str = str.toLowerCase();
    if (opts.strict) {
        str = str.replace(/[^a-zA-Z0-9\s_-]/g, "");
    } else {
        str = str.replace(/[^\p{L}\p{N}\s_-]/gu, "");
    }
    str = str.trim().replace(/[\s_-]+/g, opts.separator);
    if (opts.maxLength > 0 && str.length > opts.maxLength) {
        str = str.slice(0, opts.maxLength).replace(new RegExp(`${opts.separator}+$`), "");
    }
    return str;
}

export default function SlugGeneratorPage() {
    const [input, setInput] = useState("Hello World — How to Format JSON & XML in 2026");
    const [separator, setSeparator] = useState("-");
    const [lowercase, setLowercase] = useState(true);
    const [maxLength, setMaxLength] = useState(60);
    const [strict, setStrict] = useState(true);

    const slug = useMemo(
        () => slugify(input, { separator, lowercase, maxLength, strict }),
        [input, separator, lowercase, maxLength, strict]
    );

    const lines = useMemo(() => {
        return input
            .split(/\r?\n/)
            .filter((l) => l.trim())
            .map((l) => slugify(l, { separator, lowercase, maxLength, strict }));
    }, [input, separator, lowercase, maxLength, strict]);

    return (
        <ToolPageLayout
            title="Slug Generator"
            description="Generate URL-safe slugs from any text"
            icon={<LinkOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs:
                    "A slug is the URL-friendly version of a string — used in permalinks, blog post URLs, file names, and identifiers. This tool transliterates Unicode, removes diacritics, and replaces non-alphanumeric characters with a separator of your choice.",
                whyUse:
                    "Clean slugs improve SEO and user experience. /how-to-format-json beats /post?id=42 every time. Generate slugs for blog posts, products, document IDs, or any text-to-URL conversion.",
                howToUse: [
                    "Paste a title or any text into the input",
                    "Pick a separator (- _ or .)",
                    "Toggle lowercase, strict ASCII, and max length to taste",
                    "Copy the resulting slug",
                ],
                tips: [
                    "Strict mode strips all non-ASCII characters (safest for old systems)",
                    "Non-strict mode keeps Unicode letters (good for i18n URLs)",
                    "Max length truncates without leaving trailing separators",
                ],
                useCases: [
                    "Generating blog post URLs",
                    "Creating product or category permalinks",
                    "Building filename-safe identifiers from titles",
                ],
            }}
        >
            <Card title="Options" style={{ marginBottom: 16 }}>
                <Space wrap size="large">
                    <span>
                        <Text type="secondary" style={{ marginRight: 8 }}>Separator:</Text>
                        <Select
                            value={separator}
                            onChange={setSeparator}
                            style={{ width: 110 }}
                            options={[
                                { value: "-", label: "Dash (-)" },
                                { value: "_", label: "Underscore (_)" },
                                { value: ".", label: "Dot (.)" },
                            ]}
                        />
                    </span>
                    <span>
                        <Text type="secondary" style={{ marginRight: 8 }}>Max length:</Text>
                        <InputNumber min={0} max={300} value={maxLength} onChange={(v) => setMaxLength(v ?? 0)} />
                    </span>
                    <span>
                        <Switch checked={lowercase} onChange={setLowercase} /> <Text>Lowercase</Text>
                    </span>
                    <span>
                        <Switch checked={strict} onChange={setStrict} /> <Text>Strict ASCII</Text>
                    </span>
                </Space>
            </Card>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title="Input">
                    <TextArea
                        rows={10}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter title or text (one per line for bulk)"
                    />
                </Card>
                <Card
                    size="small"
                    title="Slug Output"
                    extra={
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(lines.join("\n"))}>
                            Copy
                        </Button>
                    }
                >
                    <div
                        style={{
                            padding: 16,
                            background: "rgba(250, 84, 28, 0.08)",
                            borderRadius: 8,
                            fontFamily: "var(--font-geist-mono)",
                            fontSize: 16,
                            wordBreak: "break-all",
                            marginBottom: 12,
                        }}
                    >
                        {slug || "..."}
                    </div>
                    {lines.length > 1 && (
                        <div
                            style={{
                                padding: 12,
                                background: "rgba(0,0,0,0.04)",
                                borderRadius: 6,
                                fontFamily: "var(--font-geist-mono)",
                                fontSize: 13,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-all",
                                maxHeight: 240,
                                overflowY: "auto",
                            }}
                        >
                            {lines.join("\n")}
                        </div>
                    )}
                    <Space style={{ marginTop: 12 }}>
                        <Button onClick={() => setInput("")} icon={<ClearOutlined />}>Clear</Button>
                    </Space>
                </Card>
            </div>
        </ToolPageLayout>
    );
}

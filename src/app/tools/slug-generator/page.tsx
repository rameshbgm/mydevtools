"use client";

import React, { useState, useMemo } from "react";
import { Button, Card, Space, Input, Select, Switch, InputNumber, Typography } from "antd";
import { CopyOutlined, ClearOutlined, LinkOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
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
        str = str.slice(0, opts.maxLength).replace(new RegExp(`${opts.separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}+$`), "");
    }
    return str;
}

export default function SlugGeneratorPage() {
    const { t } = useLanguage();
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
            title={t("Slug Generator")}
            description={t("Generate URL-safe slugs from any text")}
            icon={<LinkOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs: "Create slugs with Unicode normalization, optional ASCII filtering and a chosen separator.",
                whyUse: "Prepare readable URL segments and identifiers; review the result for your target system.",
                howToUse: ["Enter one title per line. Choose a separator, lowercase setting and maximum length; 0 means no limit."],
                tips: ["Strict ASCII removes non-ASCII characters. Unicode mode keeps letters and numbers; it does not transliterate every writing system."],
            }}
        >
            <Card title={t("Options")} style={{ marginBottom: 16 }}>
                <Space wrap size="large">
                    <span>
                        <Text type="secondary" style={{ marginRight: 8 }}>{t("Separator:")}</Text>
                        <Select aria-label={t("Separator")}
                            value={separator}
                            onChange={setSeparator}
                            style={{ minWidth: 130, maxWidth: "100%" }}
                            options={[
                                { value: "-", label: t("Dash (-)") },
                                { value: "_", label: t("Underscore (_)") },
                                { value: ".", label: t("Dot (.)") },
                            ]}
                        />
                    </span>
                    <span>
                        <Text type="secondary" style={{ marginRight: 8 }}>{t("Max length:")}</Text>
                        <InputNumber dir="ltr" aria-label={t("Maximum length")} styles={{ input: { direction: "ltr", fontSize: 16 } }} min={0} max={300} value={maxLength} onChange={(v) => setMaxLength(v ?? 0)} />
                    </span>
                    <span>
                        <Switch aria-label={t("Lowercase")} checked={lowercase} onChange={setLowercase} /> <Text>{t("Lowercase")}</Text>
                    </span>
                    <span>
                        <Switch aria-label={t("Strict ASCII")} checked={strict} onChange={setStrict} /> <Text>{t("Strict ASCII")}</Text>
                    </span>
                </Space>
            </Card>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title={t("Input")}>
                    <TextArea dir="ltr" aria-label={t("Input")} styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                        rows={10}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t("Enter title or text (one per line for bulk)")}
                    />
                </Card>
                <Card
                    size="small"
                    title={t("Slug Output")}
                    extra={
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(lines.join("\n"))}>{t("Copy")}</Button>
                    }
                >
                    <div dir="ltr"
                        style={{
                            padding: 16,
                            background: "rgba(250, 84, 28, 0.08)",
                            borderRadius: 6,
                            fontFamily: "var(--font-geist-mono)",
                            fontSize: 16,
                            wordBreak: "break-all",
                            marginBottom: 12,
                        }}
                    >
                        {slug || "..."}
                    </div>
                    {lines.length > 1 && (
                        <div dir="ltr"
                            style={{
                                padding: 12,
                                background: "var(--signal-inset)",
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
                        <Button onClick={() => setInput("")} icon={<ClearOutlined />}>{t("Clear")}</Button>
                    </Space>
                </Card>
            </div>
        </ToolPageLayout>
    );
}

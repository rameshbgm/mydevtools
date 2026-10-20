"use client";

import { useLanguage } from "@/components/LanguageProvider";

import React, { useState } from "react";
import { Button, Card, Space, Select, Switch, Alert, Typography, Input } from "antd";
import { CopyOutlined, ClearOutlined, DownloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";
import SpreadsheetConverter from "@/components/SpreadsheetConverter";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

const { Text } = Typography;

const SAMPLE = JSON.stringify(
    [
        { id: 1, name: "Alice", email: "alice@example.com", address: { city: "NYC", zip: "10001" }, tags: ["admin", "active"] },
        { id: 2, name: "Bob", email: "bob@example.com", address: { city: "SF", zip: "94101" }, tags: ["user"] },
        { id: 3, name: "Carol", email: "carol@example.com", address: { city: "LA", zip: "90001" }, tags: [] },
    ],
    null,
    2
);

function flatten(obj: unknown, prefix = "", out: Record<string, unknown> = {}): Record<string, unknown> {
    if (obj === null || obj === undefined) {
        if (prefix) out[prefix] = "";
        return out;
    }
    if (typeof obj !== "object") {
        out[prefix] = obj;
        return out;
    }
    if (Array.isArray(obj)) {
        out[prefix] = obj.join("|");
        return out;
    }
    for (const k of Object.keys(obj as Record<string, unknown>)) {
        const key = prefix ? `${prefix}.${k}` : k;
        flatten((obj as Record<string, unknown>)[k], key, out);
    }
    return out;
}

function escapeCsvCell(value: unknown, delimiter: string): string {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(delimiter) || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

interface ShareState { input: string; delimiter: string; includeHeader: boolean; flattenNested: boolean; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "json-to-csv", version: 1 };

export default function JsonToCsvPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState(SAMPLE);
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [delimiter, setDelimiter] = useState(",");
    const [includeHeader, setIncludeHeader] = useState(true);
    const [flattenNested, setFlattenNested] = useState(true);

    const convert = (src: string) => {
        setError(null);
        try {
            const parsed = JSON.parse(src);
            const arr: unknown[] = Array.isArray(parsed) ? parsed : [parsed];

            const rows = arr.map((row) =>
                flattenNested ? flatten(row) : (row as Record<string, unknown>)
            );

            const headers = Array.from(
                rows.reduce<Set<string>>((set, row) => {
                    Object.keys(row || {}).forEach((k) => set.add(k));
                    return set;
                }, new Set())
            );

            const lines: string[] = [];
            if (includeHeader) {
                lines.push(headers.map((h) => escapeCsvCell(h, delimiter)).join(delimiter));
            }
            for (const row of rows) {
                lines.push(headers.map((h) => escapeCsvCell((row as Record<string, unknown>)[h], delimiter)).join(delimiter));
            }
            setOutput(lines.join("\n"));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(msg);
            setOutput("");
        }
    };

    const handleDownload = () => {
        if (!output) return;
        downloadText(output, "data.csv", "text/csv;charset=utf-8");
    };

    useShareableState(SHARE_SCHEMA, (s) => {
        setInput(s.input);
        setDelimiter(s.delimiter);
        setIncludeHeader(s.includeHeader);
        setFlattenNested(s.flattenNested);
        convert(s.input);
    });

    return (
        <ToolPageLayout
            title={t("JSON to CSV Converter")}
            description={t("Convert JSON arrays to CSV with custom delimiters and flatten options")}
            icon={<FileExcelOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs:
                    "Convert JSON arrays and nested objects into comma-separated values (CSV) with custom delimiters, configurable headers and dot-notation flattening for nested fields.",
                whyUse:
                    "Open API responses in Excel, import JSON data into Google Sheets, or hand structured data to non-developers. CSV remains the universal interchange format for tabular data.",
                howToUse: [
                    "Paste a JSON array (or single object) on the left",
                    "Pick a delimiter (comma, tab, semicolon, pipe)",
                    "Toggle 'Flatten nested' to expand objects with dot notation",
                    "Download or copy the CSV output",
                ],
                tips: [
                    "Tab-delimited works best for pasting into Excel",
                    "Flatten produces columns like 'address.city', 'address.zip'",
                    "Arrays of primitives become pipe-joined strings",
                ],
                useCases: [
                    "Converting API responses for spreadsheet analysis",
                    "Migrating JSON exports into a CSV import format",
                    "Quick data inspection in Excel/Numbers/Sheets",
                ],
            }}
        >
            <ToolBridgeBanner accepts={["json", "text"]} onAccept={(p) => { setInput(p.data); convert(p.data); }} />

            <Space style={{ marginBottom: 16 }} wrap>
                <span>
                    <Text type="secondary" style={{ marginInlineEnd: 8 }}>{t("Delimiter:")}</Text>
                    <Select
                        direction="ltr"
                        styles={{ input: { direction: "ltr", textAlign: "left" }, itemContent: { direction: "ltr", textAlign: "left" } }}
                        aria-label={t("Delimiter")}
                        value={delimiter}
                        onChange={setDelimiter}
                        style={{ minWidth: 130 }}
                        options={[
                            { label: t("Comma ,"), value: "," },
                            { label: t("Tab \\t"), value: "\t" },
                            { label: t("Semicolon ;"), value: ";" },
                            { label: t("Pipe |"), value: "|" },
                        ]}
                    />
                </span>
                <Switch aria-label={t("Headers")} checked={includeHeader} onChange={setIncludeHeader} /> <Text style={{ fontSize: 13 }}>{t("Headers")}</Text>
                <Switch aria-label={t("Flatten nested")} checked={flattenNested} onChange={setFlattenNested} /> <Text style={{ fontSize: 13 }}>{t("Flatten nested")}</Text>
                <Button type="primary" onClick={() => convert(input)}>{t("Convert")}</Button>
                <Button icon={<CopyOutlined />} disabled={!output} onClick={() => copyToClipboard(output)}>{t("Copy")}</Button>
                <Button icon={<DownloadOutlined />} disabled={!output} onClick={handleDownload}>{t("Download")}</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); setError(null); }}>{t("Clear")}</Button>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ input, delimiter, includeHeader, flattenNested })} size="middle" />
                <SendToButton data={output} kind="csv" sourceToolId="json-to-csv" size="middle" />
            </Space>

            {error && <Alert type="error" showIcon title={t("Conversion failed. Check the input and options, then try again.")} description={<bdi dir="ltr">{error}</bdi>} style={{ marginBottom: 16 }} />}
            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title={t("JSON Input")} styles={{ body: { padding: 0 } }}>
                    <CodeEditor value={input} onChange={setInput} language="json" height="500px" />
                </Card>
                <Card size="small" title={t("CSV Output")} styles={{ body: { padding: 0 } }}>
                    <CodeEditor value={output} language="plaintext" height="500px" readOnly />
                </Card>
            </div>
            <SpreadsheetConverter jsonSource={input} onImportJson={setInput} />
        </ToolPageLayout>
    );
}

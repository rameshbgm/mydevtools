"use client";

import React, { useState } from "react";
import { Button, Card, Space, Select, Switch, App, Typography, Input } from "antd";
import { CopyOutlined, ClearOutlined, DownloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

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

export default function JsonToCsvPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState(SAMPLE);
    const [output, setOutput] = useState("");
    const [delimiter, setDelimiter] = useState(",");
    const [includeHeader, setIncludeHeader] = useState(true);
    const [flattenNested, setFlattenNested] = useState(true);

    const convert = (src: string) => {
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
            const msg = e instanceof Error ? e.message : "Parse error";
            message.error("Invalid JSON: " + msg);
            setOutput("");
        }
    };

    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <ToolPageLayout
            title="JSON to CSV Converter"
            description="Convert JSON arrays to CSV with custom delimiters and flatten options"
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
            <Space style={{ marginBottom: 16 }} wrap>
                <span>
                    <Text type="secondary" style={{ marginRight: 8 }}>Delimiter:</Text>
                    <Select
                        value={delimiter}
                        onChange={setDelimiter}
                        style={{ width: 130 }}
                        options={[
                            { label: "Comma ,", value: "," },
                            { label: "Tab \\t", value: "\t" },
                            { label: "Semicolon ;", value: ";" },
                            { label: "Pipe |", value: "|" },
                        ]}
                    />
                </span>
                <Switch checked={includeHeader} onChange={setIncludeHeader} /> <Text style={{ fontSize: 13 }}>Headers</Text>
                <Switch checked={flattenNested} onChange={setFlattenNested} /> <Text style={{ fontSize: 13 }}>Flatten nested</Text>
                <Button type="primary" onClick={() => convert(input)}>Convert</Button>
                <Button icon={<CopyOutlined />} disabled={!output} onClick={() => copyToClipboard(output)}>Copy</Button>
                <Button icon={<DownloadOutlined />} disabled={!output} onClick={handleDownload}>Download</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); }}>Clear</Button>
            </Space>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title="JSON Input" styles={{ body: { padding: 0 } }}>
                    <CodeEditor value={input} onChange={setInput} language="json" height="500px" />
                </Card>
                <Card size="small" title="CSV Output" styles={{ body: { padding: 0 } }}>
                    <CodeEditor value={output} language="plaintext" height="500px" readOnly />
                </Card>
            </div>
        </ToolPageLayout>
    );
}

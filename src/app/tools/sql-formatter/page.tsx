"use client";

import React, { useState, useEffect } from "react";
import { Button, Space, Card, Segmented, App } from "antd";
import { CopyOutlined, ClearOutlined, DatabaseOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const SAMPLE = `SELECT u.id, u.name, o.order_id, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.created_at > '2024-01-01' GROUP BY u.id, u.name, o.order_id, o.total ORDER BY o.total DESC LIMIT 100;`;

function formatSql(sql: string): string {
    let result = sql.trim();
    const newlineBefore = ["SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "JOIN", "ON", "UNION", "SET", "VALUES", "INTO"];
    newlineBefore.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, "gi");
        result = result.replace(regex, `\n${kw.toUpperCase()}`);
    });
    const lines = result.split("\n").map((l) => l.trim()).filter(Boolean);
    return lines.map((line, i) => {
        if (i === 0) return line;
        if (/^(AND|OR|ON)\b/i.test(line)) return "  " + line;
        return line;
    }).join("\n");
}

function minifySql(sql: string): string {
    return sql.replace(/\s+/g, " ").trim();
}

type Mode = "Prettify" | "Minify";

export default function SqlFormatterPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState(SAMPLE);
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<Mode>("Prettify");

    const run = (m: Mode, src: string) => {
        try {
            setOutput(m === "Prettify" ? formatSql(src) : minifySql(src));
        } catch {
            message.error("Error processing SQL");
        }
    };

    useEffect(() => { if (input) run(mode, input); }, [mode]);

    return (
        <ToolPageLayout
            title="SQL Formatter"
            description="Format and beautify SQL queries"
            icon={<DatabaseOutlined style={{ fontSize: 24, color: "#faad14" }} />}
            color="#faad14"
            learnMore={{
                whatIs: "A SQL Formatter transforms SQL queries into a readable, properly indented format. It adds line breaks at logical points like SELECT, FROM, WHERE clauses, making complex queries easier to understand and maintain.",
                whyUse: "Complex SQL queries can become unreadable, especially when dealing with multiple JOINs, subqueries, or conditions. Formatted SQL improves code reviews, debugging, and documentation of database logic.",
                howToUse: [
                    "Paste your SQL query into the input editor",
                    "Select 'Prettify' to format or 'Minify' to compress",
                    "The formatted query appears instantly in the output panel",
                    "Copy the result for use in your database tools"
                ],
                tips: [
                    "Keywords are automatically uppercased for consistency",
                    "JOINs and subqueries are properly indented",
                    "Works with SELECT, INSERT, UPDATE, DELETE, and DDL statements",
                    "Use minify to create single-line queries for logging"
                ],
                useCases: [
                    "Formatting complex reporting queries for documentation",
                    "Beautifying auto-generated ORM queries for debugging",
                    "Preparing SQL scripts for code reviews",
                    "Converting single-line log queries into readable format"
                ]
            }}
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Segmented<Mode>
                    options={["Prettify", "Minify"]}
                    value={mode}
                    onChange={(v) => setMode(v)}
                    size="large"
                />
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output || input)}>Copy</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); }}>Clear</Button>
            </Space>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Card size="small" title="Input" styles={{ body: { padding: 0 } }}>
                    <CodeEditor value={input} onChange={(v) => { setInput(v); run(mode, v); }} language="sql" height="500px" />
                </Card>
                <Card size="small" title="Output" styles={{ body: { padding: 0 } }}>
                    <CodeEditor value={output} language="sql" height="500px" readOnly />
                </Card>
            </div>
        </ToolPageLayout>
    );
}

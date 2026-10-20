"use client";

import React, { useState, useMemo } from "react";
import { Button, Space, Card, Segmented, Select, Alert } from "antd";
import { CopyOutlined, ClearOutlined, DatabaseOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import { useLanguage } from "@/components/LanguageProvider";
import { formatSqlQuery, compactSqlQuery, type SqlDialect } from "@/lib/sql-formatting";

const SAMPLE = `SELECT u.id, u.name, o.order_id, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.created_at > '2024-01-01' GROUP BY u.id, u.name, o.order_id, o.total ORDER BY o.total DESC LIMIT 100;`;

type Mode = "Prettify" | "Minify";

export default function SqlFormatterPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState(SAMPLE);
    const [mode, setMode] = useState<Mode>("Prettify");
    const [dialect, setDialect] = useState<SqlDialect>("postgresql");

    const { output, error } = useMemo(() => {
        try { return { output: mode === "Prettify" ? formatSqlQuery(input, dialect) : compactSqlQuery(input, dialect), error: "" }; }
        catch (cause) { return { output: "", error: cause instanceof Error ? cause.message : "SQL could not be formatted" }; }
    }, [mode, input, dialect]);

    return (
        <ToolPageLayout
            title="SQL Formatter"
            description="Format and beautify SQL queries"
            icon={<DatabaseOutlined style={{ fontSize: 24, color: "#faad14" }} />}
            color="#faad14"
            learnMore={{
                whatIs: "Format PostgreSQL, MySQL and SQLite statements locally without executing a query.",
                whyUse: "Use readable SQL for debugging, documentation and code review.",
                howToUse: ["Paste SQL and select the matching dialect.", "Choose Prettify or Minify, then copy the output."],
                tips: ["Quoted strings and comments retain their contents. Line comments keep the newline that terminates them.", "SQL formatting limit is 500,000 characters.", "Formatting does not validate database permissions or prove that a query is safe to execute."]
            }}
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Select aria-label={t("SQL dialect")} value={dialect} onChange={setDialect} style={{ minWidth: 160 }} options={[{ value: "postgresql", label: "PostgreSQL" }, { value: "mysql", label: "MySQL" }, { value: "sqlite", label: "SQLite" }]} />
                <Segmented<Mode>
                    aria-label={t("SQL formatting mode")}
                    options={[{ value: "Prettify", label: t("Prettify") }, { value: "Minify", label: t("Minify") }]}
                    value={mode}
                    onChange={(v) => setMode(v)}
                    size="large"
                />
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output || input)}>{t("Copy")}</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); }}>{t("Clear")}</Button>
            </Space>
            {error && <Alert type="error" title={t("SQL could not be formatted")} description={<><p>{t("Check the selected dialect and SQL syntax, then edit the query to try again.")}</p><p dir="auto">{t(error)}</p></>} showIcon style={{ marginBottom: 16 }} />}
            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title={t("Input")} styles={{ body: { padding: 0 } }}>
                    <CodeEditor ariaLabel={t("SQL input editor")} value={input} onChange={setInput} language="sql" height="500px" />
                </Card>
                <Card size="small" title={t("Output")} styles={{ body: { padding: 0 } }}>
                    <CodeEditor ariaLabel={t("Formatted SQL editor")} value={output} language="sql" height="500px" readOnly />
                </Card>
            </div>
        </ToolPageLayout>
    );
}

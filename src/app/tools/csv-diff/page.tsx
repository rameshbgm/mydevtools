"use client";

import React, { useMemo, useState } from "react";
import { Card, Typography, Input, Row, Col, Select, Tag, Empty, Space, App } from "antd";
import { FileExcelOutlined, CopyOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

const { Text } = Typography;
const { TextArea } = Input;

type Row = string[];

interface ParsedCsv {
    headers: string[];
    rows: Row[];
    error?: string;
}

// RFC 4180 inspired CSV parser — handles quoted fields with embedded commas / newlines / "".
function parseCsv(text: string): ParsedCsv {
    if (!text.trim()) return { headers: [], rows: [] };
    const rows: Row[] = [];
    let cur: string[] = [];
    let field = "";
    let inQuotes = false;
    let i = 0;
    while (i < text.length) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
                inQuotes = false; i++; continue;
            }
            field += c; i++; continue;
        }
        if (c === '"') { inQuotes = true; i++; continue; }
        if (c === ",") { cur.push(field); field = ""; i++; continue; }
        if (c === "\r") { i++; continue; }
        if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; i++; continue; }
        field += c; i++;
    }
    cur.push(field);
    if (cur.length > 1 || cur[0] !== "") rows.push(cur);
    if (rows.length === 0) return { headers: [], rows: [] };
    const [headers, ...data] = rows;
    return { headers, rows: data };
}

type RowStatus = "added" | "removed" | "modified" | "unchanged";

interface DiffRow {
    status: RowStatus;
    key: string;
    left?: Row;
    right?: Row;
    changedCols?: Set<number>;
}

function diffCsv(left: ParsedCsv, right: ParsedCsv, keyCol: number): DiffRow[] {
    const leftMap = new Map<string, Row>();
    const rightMap = new Map<string, Row>();
    left.rows.forEach((r) => leftMap.set(r[keyCol] ?? "", r));
    right.rows.forEach((r) => rightMap.set(r[keyCol] ?? "", r));

    const allKeys = new Set<string>([...leftMap.keys(), ...rightMap.keys()]);
    const out: DiffRow[] = [];

    allKeys.forEach((key) => {
        const l = leftMap.get(key);
        const r = rightMap.get(key);
        if (l && !r) { out.push({ status: "removed", key, left: l }); return; }
        if (!l && r) { out.push({ status: "added", key, right: r }); return; }
        if (l && r) {
            const cols = Math.max(l.length, r.length);
            const changed = new Set<number>();
            for (let i = 0; i < cols; i++) if ((l[i] ?? "") !== (r[i] ?? "")) changed.add(i);
            if (changed.size === 0) out.push({ status: "unchanged", key, left: l, right: r });
            else out.push({ status: "modified", key, left: l, right: r, changedCols: changed });
        }
    });

    return out.sort((a, b) => {
        const order: Record<RowStatus, number> = { modified: 0, added: 1, removed: 2, unchanged: 3 };
        return order[a.status] - order[b.status];
    });
}

const STATUS_COLOR: Record<RowStatus, string> = {
    added: "#52c41a",
    removed: "#f5222d",
    modified: "#faad14",
    unchanged: "#8c8c8c",
};

const SAMPLE_LEFT = `id,name,email,role
1,Ada,ada@example.com,admin
2,Bob,bob@example.com,user
3,Cora,cora@example.com,user`;

const SAMPLE_RIGHT = `id,name,email,role
1,Ada,ada@example.com,admin
2,Bob,bob.new@example.com,user
4,Dan,dan@example.com,user`;

interface ShareState { leftText: string; rightText: string; keyCol: number; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "csv-diff", version: 1 };

export default function CsvDiffPage() {
    const { message } = App.useApp();
    const [leftText, setLeftText] = useState(SAMPLE_LEFT);
    const [rightText, setRightText] = useState(SAMPLE_RIGHT);
    const [keyCol, setKeyCol] = useState(0);

    useShareableState(SHARE_SCHEMA, (s) => {
        setLeftText(s.leftText);
        setRightText(s.rightText);
        setKeyCol(s.keyCol);
    });

    const parsedLeft = useMemo(() => parseCsv(leftText), [leftText]);
    const parsedRight = useMemo(() => parseCsv(rightText), [rightText]);

    const headers = parsedLeft.headers.length ? parsedLeft.headers : parsedRight.headers;

    const diff = useMemo(
        () => (headers.length ? diffCsv(parsedLeft, parsedRight, keyCol) : []),
        [parsedLeft, parsedRight, keyCol, headers.length],
    );

    const counts = useMemo(() => {
        const c: Record<RowStatus, number> = { added: 0, removed: 0, modified: 0, unchanged: 0 };
        diff.forEach((d) => { c[d.status]++; });
        return c;
    }, [diff]);

    const copyReport = async () => {
        const lines: string[] = [`# CSV Diff Report — key=${headers[keyCol] ?? "col0"}`, ""];
        diff.filter((d) => d.status !== "unchanged").forEach((d) => {
            lines.push(`[${d.status.toUpperCase()}] ${d.key}`);
            if (d.status === "modified" && d.changedCols && d.left && d.right) {
                d.changedCols.forEach((i) => {
                    lines.push(`  ${headers[i] ?? `col${i}`}: ${d.left![i] ?? ""} → ${d.right![i] ?? ""}`);
                });
            }
        });
        await copyToClipboard(lines.join("\n"));
        message.success("Report copied");
    };

    return (
        <ToolPageLayout
            title="CSV Diff"
            description="Row-keyed CSV comparison with column-level change highlighting"
            icon={<FileExcelOutlined style={{ fontSize: 24, color: "#fa8c16" }} />}
            color="#fa8c16"
            learnMore={{
                whatIs: "CSV Diff compares two CSV files row by row, matching rows by a chosen key column. Unlike text diff, it understands CSV structure and highlights changes at the column level rather than the line level.",
                whyUse: "Plain text diff treats reordered rows as huge changes. Key-based diff matches semantically equivalent rows even when they appear in different positions, so you only see real data changes.",
                howToUse: [
                    "Paste two CSV files in the left and right panels",
                    "Pick the key column (defaults to the first)",
                    "Review added, removed, modified and unchanged rows",
                    "Copy the report for a PR comment or audit log",
                ],
                tips: [
                    "Quoted fields with embedded commas/newlines/escaped quotes are supported (RFC 4180)",
                    "Pick a stable identifier (id, primary key, slug) as the key column",
                    "Rows present in both with no column changes are marked 'unchanged'",
                ],
                useCases: [
                    "Auditing data exports between environments",
                    "Reviewing seed / fixture data PRs",
                    "Comparing third-party report exports day over day",
                    "Migrating between spreadsheets",
                ],
            }}
        >
            <ToolBridgeBanner accepts={["csv", "text"]} onAccept={(p) => setLeftText(p.data)} />

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card size="small" title={<><Text strong>Left</Text> <Tag style={{ marginLeft: 8 }}>{parsedLeft.rows.length} rows</Tag></>}>
                        <TextArea
                            value={leftText}
                            onChange={(e) => setLeftText(e.target.value)}
                            placeholder="Paste CSV here…"
                            autoSize={{ minRows: 8, maxRows: 16 }}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card size="small" title={<><Text strong>Right</Text> <Tag style={{ marginLeft: 8 }}>{parsedRight.rows.length} rows</Tag></>}>
                        <TextArea
                            value={rightText}
                            onChange={(e) => setRightText(e.target.value)}
                            placeholder="Paste CSV here…"
                            autoSize={{ minRows: 8, maxRows: 16 }}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 16 }}>
                <Space wrap size="middle" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Space wrap>
                        <Text type="secondary">Key column:</Text>
                        <Select
                            value={keyCol}
                            onChange={setKeyCol}
                            style={{ minWidth: 180 }}
                            disabled={!headers.length}
                            options={headers.map((h, i) => ({ value: i, label: `${i}: ${h || "(empty)"}` }))}
                        />
                    </Space>
                    <Space wrap>
                        {(Object.keys(counts) as RowStatus[]).map((s) => (
                            <Tag key={s} color={STATUS_COLOR[s]}>{s}: {counts[s]}</Tag>
                        ))}
                        <a onClick={copyReport}><CopyOutlined /> Copy report</a>
                        <ShareButton schema={SHARE_SCHEMA} getState={() => ({ leftText, rightText, keyCol })} size="middle" />
                    </Space>
                </Space>
            </Card>

            <Card style={{ marginTop: 16 }} title="Diff">
                {diff.length === 0 ? (
                    <Empty description="Paste CSV in both panels to see a diff" />
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-geist-mono)", fontSize: 13 }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>Status</th>
                                    {headers.map((h, i) => (
                                        <th key={i} style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>{h || `col${i}`}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {diff.map((d, idx) => {
                                    const row = d.status === "removed" ? d.left! : d.status === "added" ? d.right! : d.right!;
                                    return (
                                        <tr key={idx} style={{ background: idx % 2 ? "rgba(0,0,0,0.02)" : "transparent" }}>
                                            <td style={{ padding: "6px 6px", verticalAlign: "top" }}>
                                                <Tag color={STATUS_COLOR[d.status]}>{d.status}</Tag>
                                            </td>
                                            {headers.map((_, i) => {
                                                const changed = d.changedCols?.has(i);
                                                const cell = row[i] ?? "";
                                                if (d.status === "modified" && changed) {
                                                    return (
                                                        <td key={i} style={{ padding: "6px 6px", verticalAlign: "top" }}>
                                                            <div style={{ color: "#f5222d", textDecoration: "line-through" }}>{d.left![i] ?? ""}</div>
                                                            <div style={{ color: "#52c41a" }}>{d.right![i] ?? ""}</div>
                                                        </td>
                                                    );
                                                }
                                                return <td key={i} style={{ padding: "6px 6px", verticalAlign: "top" }}>{cell}</td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </ToolPageLayout>
    );
}

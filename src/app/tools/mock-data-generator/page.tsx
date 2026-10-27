"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
    Card, Typography, Input, InputNumber, Row, Col, Select, Button,
    Space, Tag, App, Radio, Alert,
} from "antd";
import { BuildOutlined, CopyOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text } = Typography;
const { TextArea } = Input;

// ──────────────────────────────────────────────────────────────────────────────
// Field generators
//
// Each generator is a pure function `(rng) => value`. Adding a new type
// is just: register an entry below + add it to FIELD_TYPES.
// ──────────────────────────────────────────────────────────────────────────────

type Rng = () => number;
type FieldType =
    | "first-name" | "last-name" | "full-name" | "email" | "username"
    | "uuid" | "integer" | "float" | "boolean" | "date-iso"
    | "lorem-words" | "lorem-sentence" | "city" | "country" | "phone";

const FIRST_NAMES = ["Ada", "Bob", "Cora", "Dan", "Eli", "Fay", "Gil", "Hana", "Ivy", "Jad", "Kai", "Lia", "Max", "Nia", "Oli", "Pia", "Quy", "Rey", "Sam", "Tia"];
const LAST_NAMES = ["Lovelace", "Turing", "Hopper", "Knuth", "Karp", "Liskov", "Dijkstra", "Wirth", "McCarthy", "Hamilton", "Curie", "Noether", "Erdős", "Tarjan", "Rivest"];
const CITIES = ["Bangalore", "Berlin", "Boston", "Cairo", "Dakar", "Dublin", "Helsinki", "Jakarta", "Lima", "Montreal", "Oslo", "Quito", "Reykjavik", "Seoul", "Taipei"];
const COUNTRIES = ["AU", "BR", "CA", "DE", "DK", "FI", "FR", "IE", "IN", "JP", "KR", "NL", "NO", "NZ", "SG", "UK", "US"];
const LOREM = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");

function pick<T>(arr: readonly T[], rng: Rng): T { return arr[Math.floor(rng() * arr.length)]; }

const GENERATORS: Record<FieldType, (rng: Rng) => string | number | boolean> = {
    "first-name": (r) => pick(FIRST_NAMES, r),
    "last-name": (r) => pick(LAST_NAMES, r),
    "full-name": (r) => `${pick(FIRST_NAMES, r)} ${pick(LAST_NAMES, r)}`,
    "email": (r) => `${pick(FIRST_NAMES, r).toLowerCase()}.${pick(LAST_NAMES, r).toLowerCase()}@example.com`,
    "username": (r) => `${pick(FIRST_NAMES, r).toLowerCase()}${Math.floor(r() * 1000)}`,
    "uuid": (r) => {
        const hex = "0123456789abcdef";
        const n = (count: number) => Array.from({ length: count }, () => hex[Math.floor(r() * 16)]).join("");
        return `${n(8)}-${n(4)}-4${n(3)}-${"89ab"[Math.floor(r() * 4)]}${n(3)}-${n(12)}`;
    },
    "integer": (r) => Math.floor(r() * 10000),
    "float": (r) => Math.round(r() * 100000) / 100,
    "boolean": (r) => r() < 0.5,
    "date-iso": (r) => {
        const ms = Date.UTC(2026, 0, 1) - Math.floor(r() * 365 * 24 * 3600 * 1000);
        return new Date(ms).toISOString();
    },
    "lorem-words": (r) => Array.from({ length: 3 + Math.floor(r() * 5) }, () => pick(LOREM, r)).join(" "),
    "lorem-sentence": (r) => {
        const words = Array.from({ length: 6 + Math.floor(r() * 10) }, () => pick(LOREM, r));
        return words[0][0].toUpperCase() + words[0].slice(1) + " " + words.slice(1).join(" ") + ".";
    },
    "city": (r) => pick(CITIES, r),
    "country": (r) => pick(COUNTRIES, r),
    "phone": (r) => {
        const n = (count: number) => Array.from({ length: count }, () => Math.floor(r() * 10)).join("");
        return `+1-${n(3)}-${n(3)}-${n(4)}`;
    },
};

const FIELD_TYPES: { value: FieldType; label: string }[] = [
    { value: "uuid", label: "UUID" },
    { value: "first-name", label: "First name" },
    { value: "last-name", label: "Last name" },
    { value: "full-name", label: "Full name" },
    { value: "email", label: "Email" },
    { value: "username", label: "Username" },
    { value: "integer", label: "Integer" },
    { value: "float", label: "Float" },
    { value: "boolean", label: "Boolean" },
    { value: "date-iso", label: "Date (ISO)" },
    { value: "lorem-words", label: "Lorem (words)" },
    { value: "lorem-sentence", label: "Lorem (sentence)" },
    { value: "city", label: "City" },
    { value: "country", label: "Country code" },
    { value: "phone", label: "Phone" },
];

interface Field { name: string; type: FieldType; }

// Mulberry32 — small, fast, seedable RNG (for reproducible fixtures).
function makeRng(seed: number): Rng {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

type OutputFormat = "json" | "csv" | "sql";

// ──────────────────────────────────────────────────────────────────────────────
// Output formatters
// ──────────────────────────────────────────────────────────────────────────────

function toJson(rows: Record<string, unknown>[]): string {
    return JSON.stringify(rows, null, 2);
}

function toCsv(fields: Field[], rows: Record<string, unknown>[]): string {
    const escape = (v: unknown): string => {
        const s = String(v);
        if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
        return s;
    };
    // Header goes through the same escaping — a field named `first,name`
    // would otherwise emit an extra column and desync every row below it.
    const header = fields.map((f) => escape(f.name)).join(",");
    const body = rows.map((r) => fields.map((f) => escape(r[f.name])).join(",")).join("\n");
    return `${header}\n${body}`;
}

function toSql(fields: Field[], rows: Record<string, unknown>[], table: string): string {
    if (rows.length === 0) return "";
    const quoteIdentifier = (name: string) => `"${name.replace(/"/g, '""')}"`;
    const cols = fields.map((f) => quoteIdentifier(f.name)).join(", ");
    const literal = (v: unknown): string => {
        if (v === null || v === undefined) return "NULL";
        if (typeof v === "number") return String(v);
        if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
        return `'${String(v).replace(/'/g, "''")}'`;
    };
    const values = rows.map((r) => `(${fields.map((f) => literal(r[f.name])).join(", ")})`);
    return `INSERT INTO ${quoteIdentifier(table)} (${cols}) VALUES\n  ${values.join(",\n  ")};`;
}

export default function MockDataGeneratorPage() {
    const { t } = useLanguage();
    const translation = useRef(t);
    useEffect(() => { translation.current = t; }, [t]);
    const { message } = App.useApp();
    const [fields, setFields] = useState<Field[]>([
        { name: "id", type: "uuid" },
        { name: "name", type: "full-name" },
        { name: "email", type: "email" },
        { name: "joined_at", type: "date-iso" },
    ]);
    const [rowCount, setRowCount] = useState(10);
    const [seed, setSeed] = useState(42);
    const [format, setFormat] = useState<OutputFormat>("json");
    const [tableName, setTableName] = useState("users");

    const generated = useMemo(() => {
        const names = fields.map((field) => field.name);
        if (new Set(names).size !== names.length) return { rows: [], error: true };
        const rng = makeRng(seed);
        const rows = Array.from({ length: rowCount }, () => {
            const row: Record<string, unknown> = Object.create(null);
            fields.forEach((f) => { row[f.name] = GENERATORS[f.type](rng); });
            return row;
        });
        return { rows, error: false };
    }, [fields, rowCount, seed]);
    const rows = generated.rows;

    const output = useMemo(() => {
        if (generated.error) return "";
        if (format === "json") return toJson(rows);
        if (format === "csv") return toCsv(fields, rows);
        return toSql(fields, rows, tableName);
    }, [rows, fields, format, tableName, generated.error]);

    const addField = () => setFields((f) => [...f, { name: `field_${f.length + 1}`, type: "lorem-words" }]);
    const removeField = (i: number) => setFields((f) => f.filter((_, idx) => idx !== i));
    const updateField = (i: number, patch: Partial<Field>) =>
        setFields((f) => f.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

    const copyOutput = async () => {
        if (!output) return;
        await copyToClipboard(output);
        message.success(translation.current("Copied {count} rows as {format}", { count: rows.length, format: format.toUpperCase() }));
    };

    return (
        <ToolPageLayout
            title={t("Mock Data Generator")}
            description={t("Generate realistic fake data as JSON, CSV or SQL — seedable for reproducible fixtures")}
            icon={<BuildOutlined style={{ fontSize: 24, color: "#f59e0b" }} />}
            color="#f59e0b"
            learnMore={{
                whatIs: "Generate fictional fields as JSON, CSV or SQL with a seeded random sequence.",
                whyUse: "Create local demo and test fixtures without copying production records.",
                howToUse: ["Define fields, row count and seed, then choose a format and copy the result."],
                tips: ["Seeded dates are relative to 2026-01-01T00:00:00Z. The same schema, count and seed reproduce identical output."],
            }}
        >
            {generated.error && <Alert type="error" showIcon role="alert" message={t("Field names must be unique. Rename duplicate fields to generate data.")} style={{ marginBottom: 16 }} />}
            <Row className="signal-working-panes" gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card title={t("Schema")} size="small" extra={
                        <Button size="small" icon={<PlusOutlined />} onClick={addField}>{t("Add field")}</Button>
                    }>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            {fields.map((f, i) => (
                                <Space.Compact key={i} style={{ width: "100%" }}>
                                    <Input dir="ltr" aria-label={t("Field name {index}", { index: i + 1 })} styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                        value={f.name}
                                        onChange={(e) => updateField(i, { name: e.target.value })}
                                        style={{ width: "40%" }}
                                        placeholder={t("field name")}
                                    />
                                    <Select aria-label={t("Field type {index}", { index: i + 1 })}
                                        value={f.type}
                                        onChange={(v) => updateField(i, { type: v as FieldType })}
                                        options={FIELD_TYPES.map((field) => ({ ...field, label: t(field.label) }))}
                                        style={{ width: "50%" }}
                                    />
                                    <Button aria-label={t("Delete field {index}", { index: i + 1 })}
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeField(i)}
                                        disabled={fields.length <= 1}
                                    />
                                </Space.Compact>
                            ))}
                        </Space>
                    </Card>

                    <Card title={t("Generation")} size="small" style={{ marginTop: 16 }}>
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>{t("Rows")}</Text>
                                <InputNumber dir="ltr" aria-label={t("Rows")} styles={{ input: { direction: "ltr", fontSize: 16 } }}
                                    min={1}
                                    max={10000}
                                    value={rowCount}
                                    onChange={(v) => setRowCount(v ?? 10)}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>{t("Seed")}</Text>
                                <Space.Compact style={{ width: "100%" }}>
                                    <InputNumber dir="ltr" aria-label={t("Seed")} styles={{ input: { direction: "ltr", fontSize: 16 } }}
                                        value={seed}
                                        onChange={(v) => setSeed(v ?? 0)}
                                        style={{ flex: 1 }}
                                    />
                                    <Button icon={<ReloadOutlined />} onClick={() => setSeed(Math.floor(Math.random() * 1e9))}>{t("Random")}</Button>
                                </Space.Compact>
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>{t("Format")}</Text>
                                <Radio.Group
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    options={[
                                        { value: "json", label: "JSON" },
                                        { value: "csv", label: "CSV" },
                                        { value: "sql", label: "SQL" },
                                    ]}
                                    optionType="button"
                                    buttonStyle="solid"
                                />
                            </div>
                            {format === "sql" && (
                                <div>
                                    <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>{t("Table")}</Text>
                                    <Input dir="ltr" aria-label={t("Table")} styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                        value={tableName}
                                        onChange={(e) => setTableName(e.target.value)}
                                        placeholder={"users"}
                                    />
                                </div>
                            )}
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card
                        size="small"
                        title={<Space><Text strong>{t("Output")}</Text><Tag>{rows.length} {t("rows")}</Tag><Tag color="blue">{format.toUpperCase()}</Tag></Space>}
                        extra={<Button icon={<CopyOutlined />} onClick={copyOutput} disabled={!output}>{t("Copy")}</Button>}
                    >
                        <TextArea dir="ltr" aria-label={t("Output")} styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                            value={output}
                            readOnly
                            autoSize={{ minRows: 20, maxRows: 30 }}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                        />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

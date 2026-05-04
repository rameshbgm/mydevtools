"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Alert, Switch, Select, Segmented } from "antd";
import { FileExcelOutlined, CopyOutlined, ClearOutlined, SwapOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text } = Typography;

const SAMPLE_CSV = `name,email,age,city,active
John Doe,john@example.com,30,New York,true
Jane Smith,jane@example.com,25,Los Angeles,false
Bob Johnson,bob@example.com,35,Chicago,true
Alice Brown,alice@example.com,28,Houston,true`;

function parseCSV(csv: string, delimiter: string = ","): string[][] {
    const rows: string[][] = [];
    const lines = csv.trim().split(/\r?\n/);

    for (const line of lines) {
        const row: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                row.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
        row.push(current.trim());
        rows.push(row);
    }

    return rows;
}

function csvToJson(csv: string, options: { hasHeader: boolean; delimiter: string; arrayFormat: boolean }): string {
    const rows = parseCSV(csv, options.delimiter);
    if (rows.length === 0) return "[]";

    if (!options.hasHeader || options.arrayFormat) {
        return JSON.stringify(rows, null, 2);
    }

    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((header, i) => {
            obj[header] = row[i] || "";
        });
        return obj;
    });

    return JSON.stringify(data, null, 2);
}

function csvToXml(csv: string, options: { hasHeader: boolean; delimiter: string; rootElement: string; rowElement: string }): string {
    const rows = parseCSV(csv, options.delimiter);
    if (rows.length === 0) return "";

    const headers = options.hasHeader ? rows[0] : rows[0].map((_, i) => `field${i + 1}`);
    const dataRows = options.hasHeader ? rows.slice(1) : rows;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<${options.rootElement}>\n`;

    dataRows.forEach((row) => {
        xml += `  <${options.rowElement}>\n`;
        headers.forEach((header, i) => {
            const value = row[i] || "";
            const safeName = header.replace(/[^a-zA-Z0-9_]/g, "_");
            xml += `    <${safeName}>${escapeXml(value)}</${safeName}>\n`;
        });
        xml += `  </${options.rowElement}>\n`;
    });

    xml += `</${options.rootElement}>`;
    return xml;
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export default function CsvConverterPage() {
    const [input, setInput] = useState(SAMPLE_CSV);
    const [outputFormat, setOutputFormat] = useState<"json" | "xml">("json");
    const [hasHeader, setHasHeader] = useState(true);
    const [delimiter, setDelimiter] = useState(",");
    const [arrayFormat, setArrayFormat] = useState(false);
    const [rootElement, setRootElement] = useState("data");
    const [rowElement, setRowElement] = useState("row");

    const { output, conversionError } = useMemo(() => {
        if (!input.trim()) return { output: "", conversionError: null as string | null };
        try {
            if (outputFormat === "json") {
                return {
                    output: csvToJson(input, { hasHeader, delimiter, arrayFormat }),
                    conversionError: null as string | null,
                };
            }
            return {
                output: csvToXml(input, { hasHeader, delimiter, rootElement, rowElement }),
                conversionError: null as string | null,
            };
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            return { output: "", conversionError: msg };
        }
    }, [input, outputFormat, hasHeader, delimiter, arrayFormat, rootElement, rowElement]);

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        message.success(`${outputFormat.toUpperCase()} copied!`);
    };

    return (
        <ToolPageLayout
            title="CSV Converter"
            description="Convert CSV data to JSON or XML format"
            icon={<FileExcelOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "A CSV converter transforms Comma-Separated Values data into structured formats like JSON or XML. It handles headers, custom delimiters, quoted fields, and generates properly formatted output.",
                whyUse: "CSV is a universal data exchange format, but applications often need structured data. This tool converts spreadsheet exports and database dumps into formats suitable for APIs and applications.",
                howToUse: [
                    "Paste your CSV data in the input area",
                    "Select output format: JSON or XML",
                    "Configure options: header row, delimiter, element names",
                    "Copy the converted output"
                ],
                tips: [
                    "Enable 'Has Header Row' to use first row as field names",
                    "Supports comma, semicolon, tab, and pipe delimiters",
                    "Quoted fields with embedded delimiters are handled correctly",
                    "Empty values become empty strings in output"
                ],
                useCases: [
                    "Converting Excel exports to JSON for APIs",
                    "Generating XML configuration from CSV templates",
                    "Importing spreadsheet data into databases",
                    "Transforming CSV logs to structured formats"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Segmented
                        value={outputFormat}
                        onChange={(v) => setOutputFormat(v as "json" | "xml")}
                        options={[
                            { value: "json", label: "CSV → JSON" },
                            { value: "xml", label: "CSV → XML" },
                        ]}
                        block
                        size="large"
                    />
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="CSV Input"
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setInput("")}>
                                Clear
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={input}
                            onChange={(val) => setInput(val || "")}
                            language="plaintext"
                            height={350}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={`${outputFormat.toUpperCase()} Output`}
                        extra={
                            output && (
                                <Button size="small" icon={<CopyOutlined />} onClick={copyOutput}>
                                    Copy
                                </Button>
                            )
                        }
                    >
                        {conversionError ? (
                            <Alert type="error" message={conversionError} showIcon style={{ marginBottom: 16 }} />
                        ) : null}
                        <CodeEditor
                            value={output}
                            language={outputFormat}
                            height={350}
                            readOnly
                        />
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card title="Conversion Options">
                        <Space wrap size="large">
                            <div>
                                <Text style={{ display: "block", marginBottom: 4 }}>Delimiter</Text>
                                <Select
                                    value={delimiter}
                                    onChange={setDelimiter}
                                    style={{ width: 120 }}
                                    options={[
                                        { value: ",", label: "Comma (,)" },
                                        { value: ";", label: "Semicolon (;)" },
                                        { value: "\t", label: "Tab" },
                                        { value: "|", label: "Pipe (|)" },
                                    ]}
                                />
                            </div>
                            <div style={{ paddingTop: 22 }}>
                                <Space>
                                    <Switch checked={hasHeader} onChange={setHasHeader} />
                                    <Text>First Row is Header</Text>
                                </Space>
                            </div>
                            {outputFormat === "json" && (
                                <div style={{ paddingTop: 22 }}>
                                    <Space>
                                        <Switch checked={arrayFormat} onChange={setArrayFormat} />
                                        <Text>Array Format (no objects)</Text>
                                    </Space>
                                </div>
                            )}
                            {outputFormat === "xml" && (
                                <>
                                    <div>
                                        <Text style={{ display: "block", marginBottom: 4 }}>Root Element</Text>
                                        <Input
                                            value={rootElement}
                                            onChange={(e) => setRootElement(e.target.value)}
                                            style={{ width: 120 }}
                                        />
                                    </div>
                                    <div>
                                        <Text style={{ display: "block", marginBottom: 4 }}>Row Element</Text>
                                        <Input
                                            value={rowElement}
                                            onChange={(e) => setRowElement(e.target.value)}
                                            style={{ width: 120 }}
                                        />
                                    </div>
                                </>
                            )}
                        </Space>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

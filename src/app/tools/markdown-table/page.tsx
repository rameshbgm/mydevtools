"use client";

import React, { useState, useCallback } from "react";
import { Button, Card, Space, Typography, Row, Col, InputNumber, Select, App } from "antd";
import { TableOutlined, CopyOutlined, PlusOutlined, DeleteOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title } = Typography;

type Alignment = "left" | "center" | "right";

interface TableState {
    rows: number;
    cols: number;
    headers: string[];
    data: string[][];
    alignments: Alignment[];
}

function generateMarkdown(state: TableState): string {
    const { headers, data, alignments } = state;

    // Header row
    const headerRow = `| ${headers.join(" | ")} |`;

    // Separator row with alignment
    const separatorRow = `| ${alignments.map((a) => {
        if (a === "left") return ":---";
        if (a === "right") return "---:";
        return ":---:";
    }).join(" | ")} |`;

    // Data rows
    const dataRows = data.map((row) => `| ${row.join(" | ")} |`);

    return [headerRow, separatorRow, ...dataRows].join("\n");
}

export default function MarkdownTablePage() {
    const { message } = App.useApp();
    const [table, setTable] = useState<TableState>({
        rows: 3,
        cols: 3,
        headers: ["Header 1", "Header 2", "Header 3"],
        data: [
            ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
            ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
            ["Row 3 Col 1", "Row 3 Col 2", "Row 3 Col 3"],
        ],
        alignments: ["left", "left", "left"],
    });

    const markdown = generateMarkdown(table);

    const updateHeader = (index: number, value: string) => {
        const newHeaders = [...table.headers];
        newHeaders[index] = value;
        setTable({ ...table, headers: newHeaders });
    };

    const updateCell = (rowIndex: number, colIndex: number, value: string) => {
        const newData = table.data.map((row) => [...row]);
        newData[rowIndex][colIndex] = value;
        setTable({ ...table, data: newData });
    };

    const updateAlignment = (index: number, alignment: Alignment) => {
        const newAlignments = [...table.alignments];
        newAlignments[index] = alignment;
        setTable({ ...table, alignments: newAlignments });
    };

    const addRow = () => {
        setTable({
            ...table,
            rows: table.rows + 1,
            data: [...table.data, Array(table.cols).fill("")],
        });
    };

    const removeRow = () => {
        if (table.rows > 1) {
            setTable({
                ...table,
                rows: table.rows - 1,
                data: table.data.slice(0, -1),
            });
        }
    };

    const addColumn = () => {
        setTable({
            ...table,
            cols: table.cols + 1,
            headers: [...table.headers, `Header ${table.cols + 1}`],
            data: table.data.map((row) => [...row, ""]),
            alignments: [...table.alignments, "left"],
        });
    };

    const removeColumn = () => {
        if (table.cols > 1) {
            setTable({
                ...table,
                cols: table.cols - 1,
                headers: table.headers.slice(0, -1),
                data: table.data.map((row) => row.slice(0, -1)),
                alignments: table.alignments.slice(0, -1),
            });
        }
    };

    return (
        <ToolPageLayout
            title="Markdown Table Generator"
            description="Create markdown tables with a visual editor"
            icon={<TableOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "A visual editor for creating Markdown tables. Markdown table syntax can be tedious to write manually; this tool provides a spreadsheet-like interface that generates proper Markdown code.",
                whyUse: "Markdown tables require precise pipe (|) and hyphen (-) alignment. This visual editor eliminates formatting headaches and ensures tables render correctly in any Markdown viewer.",
                howToUse: [
                    "Set the number of rows and columns",
                    "Enter data in the spreadsheet-like grid",
                    "Set column alignment (left, center, right)",
                    "Copy the generated Markdown table code"
                ],
                tips: [
                    "Use tab to move between cells quickly",
                    "Column alignment uses colons in the separator row",
                    "Cells can contain inline Markdown (bold, links)",
                    "Preview shows how the table will render"
                ],
                useCases: [
                    "Creating comparison tables for documentation",
                    "Formatting data for GitHub READMEs",
                    "Building feature matrices",
                    "Creating structured content for wikis"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} xl={14}>
                    <Card
                        title="Table Editor"
                        extra={
                            <Space>
                                <Button size="small" icon={<PlusOutlined />} onClick={addRow}>Row</Button>
                                <Button size="small" icon={<DeleteOutlined />} onClick={removeRow} disabled={table.rows <= 1}>Row</Button>
                                <Button size="small" icon={<PlusOutlined />} onClick={addColumn}>Column</Button>
                                <Button size="small" icon={<DeleteOutlined />} onClick={removeColumn} disabled={table.cols <= 1}>Column</Button>
                            </Space>
                        }
                    >
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                {/* Alignment Row */}
                                <thead>
                                    <tr>
                                        {table.alignments.map((align, i) => (
                                            <th key={`align-${i}`} style={{ padding: "8px 4px", borderBottom: "1px solid #eee" }}>
                                                <Space size={4}>
                                                    <Button aria-label="Align left"
                                                        size="small"
                                                        type={align === "left" ? "primary" : "text"}
                                                        icon={<AlignLeftOutlined />}
                                                        onClick={() => updateAlignment(i, "left")}
                                                    />
                                                    <Button aria-label="Align center"
                                                        size="small"
                                                        type={align === "center" ? "primary" : "text"}
                                                        icon={<AlignCenterOutlined />}
                                                        onClick={() => updateAlignment(i, "center")}
                                                    />
                                                    <Button aria-label="Align right"
                                                        size="small"
                                                        type={align === "right" ? "primary" : "text"}
                                                        icon={<AlignRightOutlined />}
                                                        onClick={() => updateAlignment(i, "right")}
                                                    />
                                                </Space>
                                            </th>
                                        ))}
                                    </tr>
                                    {/* Header Row */}
                                    <tr>
                                        {table.headers.map((header, i) => (
                                            <th key={`header-${i}`} style={{ padding: 4 }}>
                                                <input
                                                    type="text"
                                                    value={header}
                                                    onChange={(e) => updateHeader(i, e.target.value)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px 12px",
                                                        border: "2px solid #1677ff",
                                                        borderRadius: 6,
                                                        fontWeight: 600,
                                                        fontSize: 14,
                                                        textAlign: table.alignments[i],
                                                        background: "rgba(22, 119, 255, 0.05)",
                                                    }}
                                                />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.data.map((row, rowIndex) => (
                                        <tr key={`row-${rowIndex}`}>
                                            {row.map((cell, colIndex) => (
                                                <td key={`cell-${rowIndex}-${colIndex}`} style={{ padding: 4 }}>
                                                    <input
                                                        type="text"
                                                        value={cell}
                                                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                                        style={{
                                                            width: "100%",
                                                            padding: "8px 12px",
                                                            border: "1px solid #d9d9d9",
                                                            borderRadius: 6,
                                                            fontSize: 14,
                                                            textAlign: table.alignments[colIndex],
                                                        }}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} xl={10}>
                    <Card
                        title="Markdown Output"
                        extra={
                            <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(markdown)}>
                                Copy
                            </Button>
                        }
                    >
                        <pre
                            style={{
                                fontFamily: "var(--font-geist-mono)",
                                fontSize: 13,
                                padding: 16,
                                background: "rgba(0,0,0,0.04)",
                                borderRadius: 8,
                                overflow: "auto",
                                whiteSpace: "pre-wrap",
                                margin: 0,
                            }}
                        >
                            {markdown}
                        </pre>
                    </Card>

                    <Card title="Preview" style={{ marginTop: 16 }}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        {table.headers.map((header, i) => (
                                            <th
                                                key={`preview-header-${i}`}
                                                style={{
                                                    padding: "12px 16px",
                                                    borderBottom: "2px solid #d9d9d9",
                                                    textAlign: table.alignments[i],
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.data.map((row, rowIndex) => (
                                        <tr key={`preview-row-${rowIndex}`}>
                                            {row.map((cell, colIndex) => (
                                                <td
                                                    key={`preview-cell-${rowIndex}-${colIndex}`}
                                                    style={{
                                                        padding: "10px 16px",
                                                        borderBottom: "1px solid #f0f0f0",
                                                        textAlign: table.alignments[colIndex],
                                                    }}
                                                >
                                                    {cell || <Text type="secondary">-</Text>}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

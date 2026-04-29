"use client";

import React, { useState, useMemo } from "react";
import { Button, Card, Space, Typography, Row, Col, Input, Segmented, App, Checkbox, Statistic } from "antd";
import { ScissorOutlined, CopyOutlined, SortAscendingOutlined, SortDescendingOutlined, DeleteOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text, Title } = Typography;

type Operation = "sort-asc" | "sort-desc" | "unique" | "reverse" | "shuffle" | "trim" | "remove-empty" | "remove-duplicates" | "lowercase" | "uppercase" | "title-case" | "prefix" | "suffix" | "number-lines" | "join-lines";

const OPERATIONS: { key: Operation; label: string; desc: string }[] = [
    { key: "sort-asc", label: "Sort A→Z", desc: "Sort lines alphabetically" },
    { key: "sort-desc", label: "Sort Z→A", desc: "Sort lines in reverse" },
    { key: "unique", label: "Remove Duplicates", desc: "Keep only unique lines" },
    { key: "reverse", label: "Reverse Order", desc: "Reverse the order of lines" },
    { key: "shuffle", label: "Shuffle", desc: "Randomize line order" },
    { key: "trim", label: "Trim Lines", desc: "Remove leading/trailing whitespace" },
    { key: "remove-empty", label: "Remove Empty", desc: "Remove empty lines" },
    { key: "lowercase", label: "Lowercase", desc: "Convert to lowercase" },
    { key: "uppercase", label: "Uppercase", desc: "Convert to uppercase" },
    { key: "title-case", label: "Title Case", desc: "Capitalize each word" },
    { key: "number-lines", label: "Number Lines", desc: "Add line numbers" },
    { key: "join-lines", label: "Join Lines", desc: "Combine all lines into one" },
];

function processText(text: string, operation: Operation, prefix: string = "", suffix: string = "", joinSeparator: string = " "): string {
    let lines = text.split("\n");

    switch (operation) {
        case "sort-asc":
            lines = lines.sort((a, b) => a.localeCompare(b));
            break;
        case "sort-desc":
            lines = lines.sort((a, b) => b.localeCompare(a));
            break;
        case "unique":
        case "remove-duplicates":
            lines = [...new Set(lines)];
            break;
        case "reverse":
            lines = lines.reverse();
            break;
        case "shuffle":
            for (let i = lines.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [lines[i], lines[j]] = [lines[j], lines[i]];
            }
            break;
        case "trim":
            lines = lines.map((line) => line.trim());
            break;
        case "remove-empty":
            lines = lines.filter((line) => line.trim() !== "");
            break;
        case "lowercase":
            lines = lines.map((line) => line.toLowerCase());
            break;
        case "uppercase":
            lines = lines.map((line) => line.toUpperCase());
            break;
        case "title-case":
            lines = lines.map((line) =>
                line.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
            );
            break;
        case "prefix":
            lines = lines.map((line) => prefix + line);
            break;
        case "suffix":
            lines = lines.map((line) => line + suffix);
            break;
        case "number-lines":
            lines = lines.map((line, i) => `${i + 1}. ${line}`);
            break;
        case "join-lines":
            return lines.filter((l) => l.trim()).join(joinSeparator);
    }

    return lines.join("\n");
}

export default function TextToolsPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState(`apple
banana
cherry
apple
date
elderberry
fig
banana`);
    const [output, setOutput] = useState("");
    const [prefix, setPrefix] = useState("- ");
    const [suffix, setSuffix] = useState("");
    const [joinSeparator, setJoinSeparator] = useState(", ");

    const stats = useMemo(() => {
        const lines = input.split("\n");
        const words = input.split(/\s+/).filter(Boolean);
        const uniqueLines = new Set(lines.filter((l) => l.trim()));
        return {
            lines: lines.length,
            words: words.length,
            characters: input.length,
            uniqueLines: uniqueLines.size,
            duplicateLines: lines.length - uniqueLines.size,
        };
    }, [input]);

    const applyOperation = (op: Operation) => {
        const result = processText(input, op, prefix, suffix, joinSeparator);
        setOutput(result);
    };

    const applyToInput = () => {
        if (output) {
            setInput(output);
            setOutput("");
        }
    };

    return (
        <ToolPageLayout
            title="Text Manipulation Tools"
            description="Sort, filter, transform and manipulate text"
            icon={<ScissorOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: "A comprehensive text manipulation toolkit for sorting lines, removing duplicates, filtering by pattern, adding line numbers, reversing order, and various other transformations.",
                whyUse: "Text processing is common in data cleaning, log analysis, and content preparation. These tools handle tasks that would otherwise require scripts or complex editor commands.",
                howToUse: [
                    "Paste your text in the input area",
                    "View live statistics (lines, words, characters)",
                    "Choose transformation tools from the buttons",
                    "Copy the transformed output"
                ],
                tips: [
                    "Sort alphabetically or by line length",
                    "Use 'Unique' to remove duplicate lines",
                    "Trim removes leading/trailing whitespace",
                    "Chain multiple transformations for complex tasks"
                ],
                useCases: [
                    "Cleaning up lists and removing duplicates",
                    "Sorting and organizing data files",
                    "Preparing content for import/export",
                    "Analyzing text statistics"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                {/* Statistics */}
                <Col xs={24}>
                    <Card size="small">
                        <Row gutter={16}>
                            <Col xs={12} sm={8} md={4}>
                                <Statistic title="Lines" value={stats.lines} />
                            </Col>
                            <Col xs={12} sm={8} md={4}>
                                <Statistic title="Words" value={stats.words} />
                            </Col>
                            <Col xs={12} sm={8} md={4}>
                                <Statistic title="Characters" value={stats.characters} />
                            </Col>
                            <Col xs={12} sm={8} md={4}>
                                <Statistic title="Unique Lines" value={stats.uniqueLines} />
                            </Col>
                            <Col xs={12} sm={8} md={4}>
                                <Statistic title="Duplicates" value={stats.duplicateLines} valueStyle={{ color: stats.duplicateLines > 0 ? "#f5222d" : undefined }} />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Card
                                title="Input"
                                size="small"
                                extra={
                                    <Button size="small" onClick={() => setInput("")}>Clear</Button>
                                }
                            >
                                <TextArea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    rows={16}
                                    placeholder="Enter text, one item per line..."
                                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card
                                title="Output"
                                size="small"
                                extra={
                                    <Space>
                                        <Button size="small" onClick={applyToInput} disabled={!output}>
                                            Use as Input
                                        </Button>
                                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(output)} disabled={!output}>
                                            Copy
                                        </Button>
                                    </Space>
                                }
                            >
                                <TextArea
                                    value={output}
                                    readOnly
                                    rows={16}
                                    placeholder="Result will appear here..."
                                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col xs={24} lg={10}>
                    <Card title="Operations">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {OPERATIONS.map((op) => (
                                <Button
                                    key={op.key}
                                    onClick={() => applyOperation(op.key)}
                                    title={op.desc}
                                >
                                    {op.label}
                                </Button>
                            ))}
                        </div>
                    </Card>

                    <Card title="Prefix / Suffix" style={{ marginTop: 16 }}>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 4 }}>Prefix</Text>
                                <Space.Compact style={{ width: "100%" }}>
                                    <Input
                                        value={prefix}
                                        onChange={(e) => setPrefix(e.target.value)}
                                        placeholder="e.g., - "
                                    />
                                    <Button onClick={() => applyOperation("prefix")}>Apply</Button>
                                </Space.Compact>
                            </div>
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 4 }}>Suffix</Text>
                                <Space.Compact style={{ width: "100%" }}>
                                    <Input
                                        value={suffix}
                                        onChange={(e) => setSuffix(e.target.value)}
                                        placeholder="e.g., ;"
                                    />
                                    <Button onClick={() => applyOperation("suffix")}>Apply</Button>
                                </Space.Compact>
                            </div>
                        </Space>
                    </Card>

                    <Card title="Join Lines" style={{ marginTop: 16 }}>
                        <Space>
                            <Input
                                value={joinSeparator}
                                onChange={(e) => setJoinSeparator(e.target.value)}
                                placeholder="Separator"
                                style={{ width: 120 }}
                            />
                            <Button onClick={() => applyOperation("join-lines")}>Join</Button>
                        </Space>
                        <div style={{ marginTop: 8 }}>
                            <Space wrap size={4}>
                                <Button size="small" type="text" onClick={() => setJoinSeparator(", ")}>comma</Button>
                                <Button size="small" type="text" onClick={() => setJoinSeparator(" ")}>space</Button>
                                <Button size="small" type="text" onClick={() => setJoinSeparator("; ")}>semicolon</Button>
                                <Button size="small" type="text" onClick={() => setJoinSeparator(" | ")}>pipe</Button>
                                <Button size="small" type="text" onClick={() => setJoinSeparator("\t")}>tab</Button>
                            </Space>
                        </div>
                    </Card>

                    <Card title="Quick Actions" style={{ marginTop: 16 }}>
                        <Space wrap>
                            <Button onClick={() => {
                                setOutput(processText(processText(input, "trim"), "remove-empty"));
                            }}>
                                Clean Text
                            </Button>
                            <Button onClick={() => {
                                setOutput(processText(processText(input, "trim"), "sort-asc"));
                            }}>
                                Sort & Trim
                            </Button>
                            <Button onClick={() => {
                                setOutput(processText(processText(processText(input, "trim"), "remove-empty"), "unique"));
                            }}>
                                Unique & Clean
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

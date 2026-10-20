"use client";

import React, { useState, useMemo } from "react";
import { Button, Card, Space, Typography, Row, Col, Input, Statistic } from "antd";
import { ScissorOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text } = Typography;

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
    const { t } = useLanguage();
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
            title={t("Text Manipulation Tools")}
            description={t("Sort, filter, transform and manipulate text")}
            icon={<ScissorOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: "Sort, trim, deduplicate, reverse and transform text lines locally.",
                whyUse: "Clean lists and prepare text without writing a script.",
                howToUse: [
                    "Enter one item per line and choose an operation. Use the output as input to combine operations.",
                ],
                tips: [
                    "Prefix, suffix and separator text are used exactly as entered.",
                ],
            }}
        >
            <Row gutter={[24, 24]}>
                {/* Statistics */}
                <Col xs={24}>
                    <Card size="small">
                        <Row gutter={16}>
                            <Col xs={12} sm={8} md={4}>
                                <Statistic title={t("Lines")} value={stats.lines} />
                            </Col>
                            <Col xs={12} sm={8} md={4}>
                                <Statistic title={t("Words")} value={stats.words} />
                            </Col>
                            <Col xs={12} sm={8} md={4}>
                                <Statistic title={t("Characters")} value={stats.characters} />
                            </Col>
                            <Col xs={12} sm={8} md={4}>
                                <Statistic title={t("Unique Lines")} value={stats.uniqueLines} />
                            </Col>
                            <Col xs={12} sm={8} md={4}>
                                <Statistic title={t("Duplicates")} value={stats.duplicateLines} styles={{ content: { color: stats.duplicateLines > 0 ? "#f5222d" : undefined } }} />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Card
                                title={t("Input")}
                                size="small"
                                extra={
                                    <Button size="small" onClick={() => setInput("")}>{t("Clear")}</Button>
                                }
                            >
                                <TextArea dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                    aria-label={t("Input text")}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    rows={16}
                                    placeholder={t("Enter text, one item per line...")}
                                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card
                                title={t("Output")}
                                size="small"
                                extra={
                                    <Space>
                                        <Button size="small" onClick={applyToInput} disabled={!output}>
                                            {t("Use as Input")}</Button>
                                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(output)} disabled={!output}>
                                            {t("Copy")}</Button>
                                    </Space>
                                }
                            >
                                <TextArea dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                    aria-label={t("Output text")}
                                    value={output}
                                    readOnly
                                    rows={16}
                                    placeholder={t("Result will appear here...")}
                                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16 }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col xs={24} lg={10}>
                    <Card title={t("Operations")}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {OPERATIONS.map((op) => (
                                <Button
                                    key={op.key}
                                    onClick={() => applyOperation(op.key)}
                                    title={t(op.desc)}
                                >
                                    {t(op.label)}
                                </Button>
                            ))}
                        </div>
                    </Card>

                    <Card title={t("Prefix / Suffix")} style={{ marginTop: 16 }}>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Prefix")}</Text>
                                <Space.Compact style={{ width: "100%" }}>
                                    <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                        aria-label={t("Prefix")}
                                        value={prefix}
                                        onChange={(e) => setPrefix(e.target.value)}
                                        placeholder="e.g., - "
                                    />
                                    <Button onClick={() => applyOperation("prefix")}>{t("Apply")}</Button>
                                </Space.Compact>
                            </div>
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 4 }}>{t("Suffix")}</Text>
                                <Space.Compact style={{ width: "100%" }}>
                                    <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                        aria-label={t("Suffix")}
                                        value={suffix}
                                        onChange={(e) => setSuffix(e.target.value)}
                                        placeholder="e.g., ;"
                                    />
                                    <Button onClick={() => applyOperation("suffix")}>{t("Apply")}</Button>
                                </Space.Compact>
                            </div>
                        </Space>
                    </Card>

                    <Card title={t("Join Lines")} style={{ marginTop: 16 }}>
                        <Space>
                            <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                aria-label={t("Separator")}
                                value={joinSeparator}
                                onChange={(e) => setJoinSeparator(e.target.value)}
                                placeholder={t("Separator")}
                                style={{ width: 120 }}
                            />
                            <Button onClick={() => applyOperation("join-lines")}>{t("Join")}</Button>
                        </Space>
                        <div style={{ marginTop: 8 }}>
                            <Space wrap size={4}>
                                <Button size="small" type="text" onClick={() => setJoinSeparator(", ")}>{t("comma")}</Button>
                                <Button size="small" type="text" onClick={() => setJoinSeparator(" ")}>{t("space")}</Button>
                                <Button size="small" type="text" onClick={() => setJoinSeparator("; ")}>{t("semicolon")}</Button>
                                <Button size="small" type="text" onClick={() => setJoinSeparator(" | ")}>{t("pipe")}</Button>
                                <Button size="small" type="text" onClick={() => setJoinSeparator("\t")}>{t("tab")}</Button>
                            </Space>
                        </div>
                    </Card>

                    <Card title={t("Quick Actions")} style={{ marginTop: 16 }}>
                        <Space wrap>
                            <Button onClick={() => {
                                setOutput(processText(processText(input, "trim"), "remove-empty"));
                            }}>
                                {t("Clean Text")}</Button>
                            <Button onClick={() => {
                                setOutput(processText(processText(input, "trim"), "sort-asc"));
                            }}>
                                {t("Sort & Trim")}</Button>
                            <Button onClick={() => {
                                setOutput(processText(processText(processText(input, "trim"), "remove-empty"), "unique"));
                            }}>
                                {t("Unique & Clean")}</Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

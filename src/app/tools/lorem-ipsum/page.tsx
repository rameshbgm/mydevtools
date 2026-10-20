"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Space, InputNumber, Select, Typography, Row, Col } from "antd";
import { FileTextOutlined, CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;

const LOREM_WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
    "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
    "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
    "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
    "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
    "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
    "nesciunt", "neque", "porro", "quisquam", "nihil", "impedit", "quo", "minus",
];

function generateWords(count: number): string {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
        result.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    return result.join(" ");
}

function generateSentence(): string {
    const wordCount = 8 + Math.floor(Math.random() * 10);
    const words = generateWords(wordCount).split(" ");
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ") + ".";
}

function generateParagraph(): string {
    const sentenceCount = 4 + Math.floor(Math.random() * 4);
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
        sentences.push(generateSentence());
    }
    return sentences.join(" ");
}

function generate(type: "words" | "sentences" | "paragraphs", count: number, startWithLorem: boolean): string {
    let result: string[] = [];

    if (type === "words") {
        result = [generateWords(count)];
    } else if (type === "sentences") {
        for (let i = 0; i < count; i++) {
            result.push(generateSentence());
        }
    } else {
        for (let i = 0; i < count; i++) {
            result.push(generateParagraph());
        }
    }

    let output = type === "paragraphs" ? result.join("\n\n") : result.join(" ");

    if (startWithLorem && output.length > 0) {
        output = "Lorem ipsum dolor sit amet, " + output.charAt(0).toLowerCase() + output.slice(1);
    }

    return output;
}

export default function LoremIpsumPage() {
    const { t } = useLanguage();
    const [type, setType] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
    const [count, setCount] = useState(3);
    const [startWithLorem, setStartWithLorem] = useState(true);
    const [output, setOutput] = useState("");

    useEffect(() => { setOutput(generate("paragraphs", 3, true)); }, []);

    const handleGenerate = () => {
        setOutput(generate(type, count, startWithLorem));
    };

    const stats = {
        words: output.split(/\s+/).filter(Boolean).length,
        characters: output.length,
        paragraphs: output.split(/\n\n+/).filter(Boolean).length,
    };

    return (
        <ToolPageLayout
            title={t("Lorem Ipsum Generator")}
            description={t("Generate placeholder text")}
            icon={<FileTextOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: "Generate Latin-style placeholder words, sentences or paragraphs locally.",
                whyUse: "Use placeholder text to test layouts before final copy is ready.",
                howToUse: ["Choose a type and count, then select Generate. Copy keeps the generated text unchanged."],
                tips: ["The interface language changes labels, not the Latin placeholder text."],
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Card title={t("Options")}>
                        <Space orientation="vertical" style={{ width: "100%" }} size="large">
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Type")}</Text>
                                <Select aria-label={t("Type")}
                                    value={type}
                                    onChange={setType}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "words", label: t("Words") },
                                        { value: "sentences", label: t("Sentences") },
                                        { value: "paragraphs", label: t("Paragraphs") },
                                    ]}
                                />
                            </div>

                            <div>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Count")}</Text>
                                <InputNumber dir="ltr" aria-label={t("Count")} styles={{ input: { direction: "ltr", fontSize: 16 } }}
                                    min={1}
                                    max={type === "words" ? 1000 : type === "sentences" ? 100 : 20}
                                    value={count}
                                    onChange={(v) => v && setCount(v)}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={startWithLorem}
                                        onChange={(e) => setStartWithLorem(e.target.checked)}
                                    />
                                    <Text>{t("Start with Lorem ipsum...")}</Text>
                                </label>
                            </div>

                            <Button type="primary" icon={<ReloadOutlined />} onClick={handleGenerate} block>{t("Generate")}</Button>

                            <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output)} block>{t("Copy to Clipboard")}</Button>
                        </Space>
                    </Card>

                    <Card title={t("Statistics")} style={{ marginTop: 16 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, textAlign: "center" }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>{t("Words")}</Text>
                                <div style={{ fontSize: 20, fontWeight: 600 }}>{stats.words}</div>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>{t("Characters")}</Text>
                                <div style={{ fontSize: 20, fontWeight: 600 }}>{stats.characters}</div>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>{t("Paragraphs")}</Text>
                                <div style={{ fontSize: 20, fontWeight: 600 }}>{stats.paragraphs}</div>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <Card title={t("Generated Text")} styles={{ body: { padding: 0 } }}>
                        <textarea dir="ltr" aria-label={t("Generated Text")}
                            value={output}
                            readOnly
                            style={{
                                width: "100%",
                                minHeight: 500,
                                padding: 16,
                                border: "none",
                                outline: "none",
                                resize: "vertical",
                                fontFamily: "var(--font-geist-sans)",
                                fontSize: 16,
                                lineHeight: 1.7,
                                background: "transparent",
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

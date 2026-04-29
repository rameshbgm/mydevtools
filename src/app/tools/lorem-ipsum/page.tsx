"use client";

import React, { useState } from "react";
import { Button, Card, Space, InputNumber, Select, Typography, Row, Col, App } from "antd";
import { FileTextOutlined, CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
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
    const { message } = App.useApp();
    const [type, setType] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
    const [count, setCount] = useState(3);
    const [startWithLorem, setStartWithLorem] = useState(true);
    const [output, setOutput] = useState(() => generate("paragraphs", 3, true));

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
            title="Lorem Ipsum Generator"
            description="Generate placeholder text"
            icon={<FileTextOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: "Lorem Ipsum is placeholder text used in design and publishing since the 1500s. It provides realistic-looking text without distracting from the visual design with meaningful content.",
                whyUse: "Designers and developers need placeholder text to visualize layouts before real content is ready. Lorem Ipsum looks like natural language but doesn't distract reviewers with readable content.",
                howToUse: [
                    "Select output type: paragraphs, sentences, or words",
                    "Set the desired count for your content",
                    "Choose whether to start with 'Lorem ipsum...'",
                    "Generate and copy the placeholder text"
                ],
                tips: [
                    "Paragraphs work best for content blocks",
                    "Words are useful for testing truncation",
                    "The classic 'Lorem ipsum dolor sit amet...' opening is traditional",
                    "Consider using your actual content length estimates"
                ],
                useCases: [
                    "Filling mockups and wireframes with realistic text",
                    "Testing typography and layout designs",
                    "Creating sample content for development",
                    "Populating test databases"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Card title="Options">
                        <Space orientation="vertical" style={{ width: "100%" }} size="large">
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Type</Text>
                                <Select
                                    value={type}
                                    onChange={setType}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "words", label: "Words" },
                                        { value: "sentences", label: "Sentences" },
                                        { value: "paragraphs", label: "Paragraphs" },
                                    ]}
                                />
                            </div>

                            <div>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Count</Text>
                                <InputNumber
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
                                    <Text>Start with &ldquo;Lorem ipsum...&rdquo;</Text>
                                </label>
                            </div>

                            <Button type="primary" icon={<ReloadOutlined />} onClick={handleGenerate} block>
                                Generate
                            </Button>

                            <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output)} block>
                                Copy to Clipboard
                            </Button>
                        </Space>
                    </Card>

                    <Card title="Statistics" style={{ marginTop: 16 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, textAlign: "center" }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Words</Text>
                                <div style={{ fontSize: 20, fontWeight: 600 }}>{stats.words}</div>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Characters</Text>
                                <div style={{ fontSize: 20, fontWeight: 600 }}>{stats.characters}</div>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Paragraphs</Text>
                                <div style={{ fontSize: 20, fontWeight: 600 }}>{stats.paragraphs}</div>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <Card title="Generated Text" styles={{ body: { padding: 0 } }}>
                        <textarea
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
                                fontSize: 14,
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

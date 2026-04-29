"use client";

import React, { useState, useCallback } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Slider, Radio, Statistic, Alert, Spin, Select } from "antd";
import { BulbOutlined, CopyOutlined, ThunderboltOutlined, FileTextOutlined, UnorderedListOutlined, AlignLeftOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

type SummaryStyle = "concise" | "detailed" | "bullets" | "key-points";

interface SummaryResult {
    summary: string;
    wordCount: number;
    sentenceCount: number;
    reductionPercentage: number;
}

export default function TextSummarizerPage() {
    const [text, setText] = useState("");
    const [style, setStyle] = useState<SummaryStyle>("concise");
    const [targetLength, setTargetLength] = useState(30); // percentage
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SummaryResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const countWords = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
    const countSentences = (t: string) => t.split(/[.!?]+/).filter((s) => s.trim()).length;

    const extractKeyPhrases = (sentences: string[]): string[] => {
        // Simple keyword extraction based on frequency and position
        const words: Record<string, number> = {};
        sentences.forEach((sentence, idx) => {
            const weight = 1 + (sentences.length - idx) / sentences.length; // Earlier sentences weighted more
            sentence.toLowerCase().split(/\s+/).forEach((word) => {
                const clean = word.replace(/[^a-zA-Z]/g, "");
                if (clean.length > 4) {
                    words[clean] = (words[clean] || 0) + weight;
                }
            });
        });
        return Object.entries(words)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
    };

    const summarize = useCallback(() => {
        setError(null);
        setResult(null);

        if (!text.trim()) {
            setError("Please enter some text to summarize");
            return;
        }

        const originalWords = countWords(text);
        if (originalWords < 50) {
            setError("Please enter at least 50 words for meaningful summarization");
            return;
        }

        setLoading(true);

        // Simulate processing delay
        setTimeout(() => {
            try {
                // Split into sentences
                const sentences = text
                    .split(/(?<=[.!?])\s+/)
                    .map((s) => s.trim())
                    .filter((s) => s.length > 10);

                // Score sentences
                const keyPhrases = extractKeyPhrases(sentences);
                const scoredSentences = sentences.map((sentence, idx) => {
                    let score = 0;

                    // Position score (first and last sentences important)
                    if (idx === 0) score += 2;
                    if (idx === sentences.length - 1) score += 1;
                    if (idx < 3) score += 1;

                    // Keyword score
                    const lower = sentence.toLowerCase();
                    keyPhrases.forEach((kw) => {
                        if (lower.includes(kw)) score += 1;
                    });

                    // Length penalty (avoid too short or too long)
                    const words = sentence.split(/\s+/).length;
                    if (words > 10 && words < 40) score += 1;

                    return { sentence, score, idx };
                });

                // Sort by score and select top sentences
                const targetSentences = Math.max(
                    2,
                    Math.ceil(sentences.length * (targetLength / 100))
                );

                const selectedSentences = scoredSentences
                    .sort((a, b) => b.score - a.score)
                    .slice(0, targetSentences)
                    .sort((a, b) => a.idx - b.idx) // Restore original order
                    .map((s) => s.sentence);

                let summary: string;
                switch (style) {
                    case "bullets":
                        summary = selectedSentences.map((s) => `• ${s}`).join("\n");
                        break;
                    case "key-points":
                        summary = "Key Points:\n\n" + selectedSentences.map((s, i) => `${i + 1}. ${s}`).join("\n\n");
                        break;
                    case "detailed":
                        summary = selectedSentences.join("\n\n");
                        break;
                    case "concise":
                    default:
                        summary = selectedSentences.join(" ");
                }

                const summaryWords = countWords(summary);
                const reduction = Math.round(((originalWords - summaryWords) / originalWords) * 100);

                setResult({
                    summary,
                    wordCount: summaryWords,
                    sentenceCount: selectedSentences.length,
                    reductionPercentage: reduction,
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, 500);
    }, [text, style, targetLength]);

    const copyResult = () => {
        if (result) {
            navigator.clipboard.writeText(result.summary);
        }
    };

    const originalWords = countWords(text);
    const originalSentences = countSentences(text);

    return (
        <ToolPageLayout
            title="Text Summarizer"
            description="Summarize long text into key points"
            icon={<BulbOutlined style={{ fontSize: 24, color: "#faad14" }} />}
            color="#faad14"
            learnMore={{
                whatIs: "The Text Summarizer condenses long documents into concise summaries, extracting key points and main ideas. It uses NLP techniques to identify the most important sentences and concepts.",
                whyUse: "Reading long documents takes time. This tool helps you quickly understand the gist of articles, reports, or documentation, making research and content review more efficient.",
                howToUse: [
                    "Paste or type the text you want to summarize",
                    "Adjust summary length preference",
                    "Generate the summary",
                    "Review key points and main ideas"
                ],
                tips: [
                    "Works best with well-structured text",
                    "Minimum 100 words recommended for quality summaries",
                    "The tool preserves the original meaning and tone",
                    "Use for articles, reports, documentation, and emails"
                ],
                useCases: [
                    "Quick review of long articles and reports",
                    "Extracting key points from meeting notes",
                    "Research and literature review",
                    "Email triage and prioritization"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={14}>
                    <Card title="Input Text">
                        <TextArea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste or type the text you want to summarize here. For best results, use at least 100 words of content..."
                            rows={12}
                            style={{ marginBottom: 16 }}
                        />

                        <Space style={{ marginBottom: 16 }}>
                            <Text type="secondary">{originalWords} words</Text>
                            <Text type="secondary">•</Text>
                            <Text type="secondary">{originalSentences} sentences</Text>
                        </Space>

                        <div style={{ marginBottom: 16 }}>
                            <Text style={{ display: "block", marginBottom: 8 }}>Summary Style:</Text>
                            <Radio.Group value={style} onChange={(e) => setStyle(e.target.value)}>
                                <Radio.Button value="concise">
                                    <AlignLeftOutlined /> Concise
                                </Radio.Button>
                                <Radio.Button value="detailed">
                                    <FileTextOutlined /> Detailed
                                </Radio.Button>
                                <Radio.Button value="bullets">
                                    <UnorderedListOutlined /> Bullets
                                </Radio.Button>
                                <Radio.Button value="key-points">
                                    <ThunderboltOutlined /> Key Points
                                </Radio.Button>
                            </Radio.Group>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <Text style={{ display: "block", marginBottom: 8 }}>
                                Target Length: {targetLength}% of original
                            </Text>
                            <Slider
                                value={targetLength}
                                onChange={setTargetLength}
                                min={10}
                                max={70}
                                marks={{
                                    10: "10%",
                                    30: "30%",
                                    50: "50%",
                                    70: "70%",
                                }}
                            />
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            icon={<BulbOutlined />}
                            onClick={summarize}
                            loading={loading}
                            disabled={!text.trim()}
                            style={{ background: "#faad14", borderColor: "#faad14" }}
                        >
                            Summarize
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card
                        title="Summary"
                        extra={
                            result && (
                                <Button icon={<CopyOutlined />} onClick={copyResult}>
                                    Copy
                                </Button>
                            )
                        }
                    >
                        {loading ? (
                            <div style={{ textAlign: "center", padding: 60 }}>
                                <Spin />
                                <Text style={{ display: "block", marginTop: 16 }}>Analyzing text...</Text>
                            </div>
                        ) : error ? (
                            <Alert type="error" message={error} showIcon />
                        ) : result ? (
                            <>
                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    <Col span={8}>
                                        <Statistic
                                            title="Words"
                                            value={result.wordCount}
                                            suffix={`/ ${originalWords}`}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic
                                            title="Sentences"
                                            value={result.sentenceCount}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic
                                            title="Reduction"
                                            value={result.reductionPercentage}
                                            suffix="%"
                                            valueStyle={{ color: "#52c41a" }}
                                        />
                                    </Col>
                                </Row>

                                <div
                                    style={{
                                        padding: 16,
                                        background: "rgba(250, 173, 20, 0.05)",
                                        borderRadius: 8,
                                        border: "1px solid rgba(250, 173, 20, 0.2)",
                                        whiteSpace: "pre-wrap",
                                        lineHeight: 1.8,
                                    }}
                                >
                                    {result.summary}
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: "center", padding: 60, color: "#8c8c8c" }}>
                                <BulbOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                                <Text style={{ display: "block" }}>
                                    Enter text and click Summarize to see results
                                </Text>
                            </div>
                        )}
                    </Card>

                    <Card title="Tips" style={{ marginTop: 16 }}>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li>Use at least 100 words for best results</li>
                            <li>Works best with well-structured paragraphs</li>
                            <li>Concise mode creates a single paragraph</li>
                            <li>Bullets mode creates an easy-to-scan list</li>
                            <li>Adjust target length for more or less detail</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

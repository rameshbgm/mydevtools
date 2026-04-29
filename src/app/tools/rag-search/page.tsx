"use client";

import React, { useState } from "react";
import { Card, Input, Button, Upload, Typography, Space, Alert, List, Tag, message } from "antd";
import { DatabaseOutlined, UploadOutlined, SendOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text, Paragraph, Title } = Typography;

// Simple in-browser RAG simulation using keyword matching
// In production, replace with real embeddings (OpenAI, Xenova/transformers)
function chunkText(text: string, chunkSize = 300): string[] {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let current = "";
    for (const s of sentences) {
        if ((current + " " + s).length > chunkSize && current) {
            chunks.push(current.trim());
            current = s;
        } else {
            current += " " + s;
        }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
}

function searchChunks(chunks: string[], query: string): string[] {
    const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = chunks.map((chunk) => {
        const lower = chunk.toLowerCase();
        const score = queryWords.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
        return { chunk, score };
    });
    return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((s) => s.chunk);
}

export default function RagSearchPage() {
    const [documents, setDocuments] = useState<string>("");
    const [chunks, setChunks] = useState<string[]>([]);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [indexed, setIndexed] = useState(false);

    const handleIndex = () => {
        if (!documents.trim()) { message.warning("Please add some documents first"); return; }
        const c = chunkText(documents);
        setChunks(c);
        setIndexed(true);
        message.success(`Indexed ${c.length} chunks!`);
    };

    const handleSearch = () => {
        if (!query.trim()) return;
        const found = searchChunks(chunks, query);
        setResults(found);
    };

    return (
        <ToolPageLayout
            title="RAG Document Q&A"
            description="Upload documents, index them, and query with keyword-based retrieval"
            icon={<DatabaseOutlined style={{ fontSize: 24, color: "#f5222d" }} />}
            color="#f5222d"
            learnMore={{
                whatIs: "RAG (Retrieval-Augmented Generation) Document Q&A lets you upload documents, index them for search, and ask questions to find relevant information. It combines search and AI for intelligent document querying.",
                whyUse: "Finding specific information in large documents is tedious. RAG enables natural language queries over your documents, returning relevant excerpts and answers from your uploaded content.",
                howToUse: [
                    "Upload documents (PDF, TXT, etc.)",
                    "Wait for indexing to complete",
                    "Ask questions in natural language",
                    "View relevant passages and answers"
                ],
                tips: [
                    "This demo uses keyword-based retrieval",
                    "For production, integrate embedding models",
                    "Smaller, focused documents work better",
                    "Clear questions get better results"
                ],
                useCases: [
                    "Searching through documentation",
                    "Finding answers in knowledge bases",
                    "Research across multiple papers",
                    "Querying company policies and manuals"
                ]
            }}
        >
            <Alert
                type="info"
                showIcon
                title="Browser-based RAG"
                description="This is a keyword-based retrieval demo. For production use, integrate OpenAI embeddings or @xenova/transformers for semantic search. The architecture supports swapping in a real vector store."
                style={{ marginBottom: 16 }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                    <Card size="small" title="Documents" style={{ marginBottom: 12 }}>
                        <TextArea
                            rows={12}
                            value={documents}
                            onChange={(e) => { setDocuments(e.target.value); setIndexed(false); }}
                            placeholder="Paste your documents here. You can paste multiple paragraphs, articles, or any text content..."
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                        />
                        <Space style={{ marginTop: 8 }}>
                            <Button type="primary" onClick={handleIndex}>
                                Index Documents ({chunks.length} chunks)
                            </Button>
                            <Upload
                                accept=".txt,.md"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    const reader = new FileReader();
                                    reader.onload = (e) => { setDocuments(e.target?.result as string || ""); setIndexed(false); };
                                    reader.readAsText(file);
                                    return false;
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Upload .txt/.md</Button>
                            </Upload>
                        </Space>
                    </Card>

                    {indexed && <Tag color="green">✅ {chunks.length} chunks indexed</Tag>}
                </div>

                <div>
                    <Card size="small" title="Query" style={{ marginBottom: 12 }}>
                        <Space.Compact style={{ width: "100%" }}>
                            <Input
                                size="large"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onPressEnter={handleSearch}
                                placeholder="Ask a question about your documents..."
                                disabled={!indexed}
                            />
                            <Button type="primary" size="large" icon={<SendOutlined />} onClick={handleSearch} disabled={!indexed}>
                                Search
                            </Button>
                        </Space.Compact>
                    </Card>

                    <Card size="small" title={`Results (${results.length} relevant chunks)`}>
                        {results.length === 0 && (
                            <Text type="secondary">{indexed ? "No results yet. Try asking a question." : "Index your documents first."}</Text>
                        )}
                        <List
                            dataSource={results}
                            renderItem={(item, i) => (
                                <List.Item>
                                    <div>
                                        <Tag color="blue">Chunk {i + 1}</Tag>
                                        <Paragraph style={{ fontSize: 13, marginTop: 4 }}>{item}</Paragraph>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
            </div>
        </ToolPageLayout>
    );
}

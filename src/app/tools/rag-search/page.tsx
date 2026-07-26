"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
    Card,
    Input,
    Typography,
    Space,
    Button,
    Alert,
    Tag,
    Progress,
    Upload,
    Slider,
    Select,
    Switch,
    Table,
    Tooltip,
    Row,
    Col,
    Statistic,
    Collapse,
} from "antd";
import {
    DatabaseOutlined,
    UploadOutlined,
    SendOutlined,
    ThunderboltOutlined,
    CheckCircleFilled,
    LoadingOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const MODEL_ID = "onnx-community/all-MiniLM-L6-v2-ONNX";
const EMBED_DIMS = 384;

interface Chunk {
    id: number;
    text: string;
    embedding: number[];
    chars: number;
    words: number;
}

interface ScoredChunk {
    chunk: Chunk;
    score: number;
    keywordScore: number;
    /** Rank this chunk would have had under plain keyword scoring. */
    keywordRank: number;
    matchedTerms: string[];
}

type LoadState = "idle" | "loading" | "ready" | "error";
type StepState = "pending" | "active" | "done";
type Extractor = (
    texts: string[],
    opts: { pooling: string; normalize: boolean },
) => Promise<{ tolist: () => number[][] }>;

interface PipelineStep {
    key: string;
    label: string;
    detail: string;
    state: StepState;
    ms?: number;
}

// ponytail: sentence-boundary splitter with a configurable overlap, not a
// tokenizer-aware chunker. Overlap matters more than exactness here — it stops
// an answer that straddles a chunk boundary from being split in half.
function chunkText(text: string, chunkSize: number, overlap: number): string[] {
    const sentences = text
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
    if (sentences.length === 0) return [];

    const chunks: string[] = [];
    let current: string[] = [];
    let currentLen = 0;

    for (const sentence of sentences) {
        if (currentLen + sentence.length > chunkSize && current.length > 0) {
            chunks.push(current.join(" "));
            // Carry trailing sentences back into the next chunk until the
            // overlap budget is spent.
            const carried: string[] = [];
            let carriedLen = 0;
            for (let i = current.length - 1; i >= 0 && carriedLen < overlap; i--) {
                carried.unshift(current[i]);
                carriedLen += current[i].length;
            }
            current = overlap > 0 ? carried : [];
            currentLen = current.reduce((n, s) => n + s.length, 0);
        }
        current.push(sentence);
        currentLen += sentence.length;
    }
    if (current.length > 0) chunks.push(current.join(" "));
    return chunks;
}

// Embeddings are requested with normalize:true, so cosine reduces to a dot
// product — but the explicit norms keep this correct if that ever changes.
function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0,
        normA = 0,
        normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

const STOP_WORDS = new Set([
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do", "does",
    "for", "from", "has", "have", "how", "i", "in", "is", "it", "its", "of", "on",
    "or", "that", "the", "this", "to", "was", "what", "when", "where", "which",
    "who", "why", "will", "with", "you", "your",
]);

function terms(text: string): string[] {
    return text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

/** Plain overlap score, shown side by side so the semantic win is visible. */
function keywordScore(queryTerms: string[], chunk: string): { score: number; matched: string[] } {
    if (queryTerms.length === 0) return { score: 0, matched: [] };
    const chunkTerms = new Set(terms(chunk));
    const matched = queryTerms.filter((t) => chunkTerms.has(t));
    return { score: matched.length / queryTerms.length, matched };
}

const SAMPLE_DOC = `mydevtools is a free, privacy-first collection of developer utilities that run entirely in the browser. It includes formatters for JSON, XML, SQL, and YAML that beautify and validate structured data. The validators catch syntax errors before code ships to production. Diff tools compare JSON, XML, CSV, and plain text side by side with highlighted changes. Data converters translate between JSON, XML, CSV, and YAML without a round trip to a server. Cryptography tools cover hashing, HMAC signing, AES encryption, and JWT decoding, all computed locally with the Web Crypto API. Certificate and key tools generate CSRs, inspect X.509 certificates, and parse PKCS12 keystores. Networking tools include a CORS tester, DNS lookup, and subnet calculator. The API request builder supports curl import and Postman collection export for testing REST endpoints. Image tools compress, resize, and optimize SVGs directly on the client. The artificial intelligence category includes protocol inspectors for MCP and A2A agents, a token counter with real BPE tokenization, and a fine-tuning dataset validator for JSONL files.`;

const EXAMPLE_QUERIES = [
    "how do I scramble secrets so nobody can read them",
    "tools for looking at pictures",
    "checking that my markup is well formed",
    "figuring out which machine a hostname points at",
];

export default function RagSearchPage() {
    const [documents, setDocuments] = useState<string>(SAMPLE_DOC);
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ScoredChunk[]>([]);
    const [lastQuery, setLastQuery] = useState("");
    const [loadState, setLoadState] = useState<LoadState>("idle");
    const [loadError, setLoadError] = useState("");
    const [searchError, setSearchError] = useState("");
    const [progress, setProgress] = useState(0);
    const [device, setDevice] = useState<"webgpu" | "wasm" | null>(null);
    const [indexing, setIndexing] = useState(false);
    const [searching, setSearching] = useState(false);

    // Retrieval knobs
    const [chunkSize, setChunkSize] = useState(300);
    const [overlap, setOverlap] = useState(60);
    const [topK, setTopK] = useState(5);
    const [minScore, setMinScore] = useState(0);
    const [showKeywordCompare, setShowKeywordCompare] = useState(true);

    // Observability
    const [steps, setSteps] = useState<PipelineStep[]>([]);
    const [indexMs, setIndexMs] = useState<number | null>(null);
    const [searchMs, setSearchMs] = useState<number | null>(null);
    const [queryVector, setQueryVector] = useState<number[] | null>(null);

    const extractorRef = useRef<Extractor | null>(null);
    // Chunk settings that produced the current index, so we can tell the user
    // when the sliders have drifted from what's actually indexed.
    const indexedWithRef = useRef<{ chunkSize: number; overlap: number } | null>(null);
    const [indexStale, setIndexStale] = useState(false);

    const hasWebGpu = useCallback(
        () => typeof navigator !== "undefined" && "gpu" in navigator,
        [],
    );

    const setStep = (key: string, state: StepState, detail?: string, ms?: number) => {
        setSteps((prev) =>
            prev.map((s) =>
                s.key === key
                    ? { ...s, state, detail: detail ?? s.detail, ms: ms ?? s.ms }
                    : s,
            ),
        );
    };

    const loadModel = async () => {
        if (extractorRef.current) return;
        setLoadState("loading");
        setLoadError("");
        setProgress(0);
        try {
            const { pipeline } = await import("@huggingface/transformers");
            const onProgress = (p: { status: string; progress?: number }) => {
                if (p.status === "progress" && typeof p.progress === "number") {
                    setProgress(Math.round(p.progress));
                }
            };
            const useWebGpu = hasWebGpu();
            let extractor;
            let resolvedDevice: "webgpu" | "wasm";
            try {
                extractor = await pipeline("feature-extraction", MODEL_ID, {
                    device: useWebGpu ? "webgpu" : "wasm",
                    progress_callback: onProgress,
                });
                resolvedDevice = useWebGpu ? "webgpu" : "wasm";
            } catch (err) {
                if (!useWebGpu) throw err;
                // WebGPU init can fail even when navigator.gpu exists (driver/adapter issues) — fall back to WASM.
                extractor = await pipeline("feature-extraction", MODEL_ID, {
                    device: "wasm",
                    progress_callback: onProgress,
                });
                resolvedDevice = "wasm";
            }
            extractorRef.current = extractor as unknown as Extractor;
            setDevice(resolvedDevice);
            setLoadState("ready");
        } catch (err) {
            setLoadState("error");
            setLoadError(err instanceof Error ? err.message : String(err));
        }
    };

    const embed = async (texts: string[]): Promise<number[][]> => {
        const extractor = extractorRef.current;
        if (!extractor) throw new Error("Model not loaded");
        const output = await extractor(texts, { pooling: "mean", normalize: true });
        return output.tolist();
    };

    const handleIndex = async () => {
        if (!documents.trim()) return;
        setSearchError("");
        setSteps([
            { key: "load", label: "Load embedding model", detail: "all-MiniLM-L6-v2 (384-dim)", state: "pending" },
            { key: "chunk", label: "Split text into chunks", detail: `~${chunkSize} chars, ${overlap} char overlap`, state: "pending" },
            { key: "embed", label: "Embed every chunk", detail: "one forward pass per chunk", state: "pending" },
            { key: "store", label: "Build in-memory vector index", detail: "plain array — no vector DB", state: "pending" },
        ]);
        setIndexing(true);
        const t0 = performance.now();
        try {
            setStep("load", "active");
            if (loadState !== "ready") await loadModel();
            if (!extractorRef.current) {
                setStep("load", "pending", "model failed to load");
                return;
            }
            setStep("load", "done", `running on ${hasWebGpu() ? "WebGPU" : "WASM"}`);

            setStep("chunk", "active");
            const tChunk = performance.now();
            const texts = chunkText(documents, chunkSize, overlap);
            setStep(
                "chunk",
                "done",
                `${texts.length} chunk(s) from ${documents.length.toLocaleString()} chars`,
                performance.now() - tChunk,
            );

            setStep("embed", "active");
            const tEmbed = performance.now();
            const embeddings = await embed(texts);
            const embedMs = performance.now() - tEmbed;
            setStep(
                "embed",
                "done",
                `${texts.length} × ${EMBED_DIMS}-dim vectors (${(embedMs / Math.max(1, texts.length)).toFixed(1)} ms/chunk)`,
                embedMs,
            );

            setStep("store", "active");
            setChunks(
                texts.map((text, i) => ({
                    id: i,
                    text,
                    embedding: embeddings[i],
                    chars: text.length,
                    words: text.split(/\s+/).filter(Boolean).length,
                })),
            );
            setResults([]);
            setQueryVector(null);
            indexedWithRef.current = { chunkSize, overlap };
            setIndexStale(false);
            setStep(
                "store",
                "done",
                `${(texts.length * EMBED_DIMS * 4 / 1024).toFixed(1)} KB of float32 held in memory`,
            );
            setIndexMs(performance.now() - t0);
        } catch (err) {
            setSearchError(err instanceof Error ? err.message : String(err));
        } finally {
            setIndexing(false);
        }
    };

    const handleSearch = async () => {
        if (!query.trim() || chunks.length === 0) return;
        setSearching(true);
        setSearchError("");
        const t0 = performance.now();
        try {
            const [queryEmbedding] = await embed([query]);
            const qTerms = terms(query);

            const scored = chunks.map((chunk) => {
                const kw = keywordScore(qTerms, chunk.text);
                return {
                    chunk,
                    score: cosineSimilarity(queryEmbedding, chunk.embedding),
                    keywordScore: kw.score,
                    keywordRank: 0,
                    matchedTerms: kw.matched,
                };
            });

            // Rank under keyword scoring first so each row can show how far the
            // semantic ranking moved it.
            const byKeyword = [...scored].sort((a, b) => b.keywordScore - a.keywordScore);
            byKeyword.forEach((s, i) => {
                s.keywordRank = i + 1;
            });

            const top = scored
                .sort((a, b) => b.score - a.score)
                .filter((s) => s.score >= minScore)
                .slice(0, topK);

            setResults(top);
            setQueryVector(queryEmbedding);
            setLastQuery(query);
            setSearchMs(performance.now() - t0);
        } catch (err) {
            setSearchError(err instanceof Error ? err.message : String(err));
        } finally {
            setSearching(false);
        }
    };

    // Flag when the sliders no longer match what was actually indexed.
    useEffect(() => {
        const indexedWith = indexedWithRef.current;
        if (!indexedWith) return;
        setIndexStale(indexedWith.chunkSize !== chunkSize || indexedWith.overlap !== overlap);
    }, [chunkSize, overlap]);

    useEffect(() => {
        // Nothing persisted anywhere — clearing the ref on unmount is enough,
        // there's no server-side session or storage to clean up.
        return () => {
            extractorRef.current = null;
        };
    }, []);

    const uploadProps: UploadProps = {
        accept: ".txt,.md",
        showUploadList: false,
        beforeUpload: (file) => {
            const reader = new FileReader();
            reader.onload = () => setDocuments(String(reader.result ?? ""));
            reader.readAsText(file);
            return false;
        },
    };

    const chunkPreview = useMemo(
        () => chunkText(documents, chunkSize, overlap),
        [documents, chunkSize, overlap],
    );

    const indexStats = useMemo(() => {
        if (chunks.length === 0) return null;
        const totalChars = chunks.reduce((n, c) => n + c.chars, 0);
        return {
            count: chunks.length,
            avgChars: Math.round(totalChars / chunks.length),
            vectorKb: (chunks.length * EMBED_DIMS * 4) / 1024,
        };
    }, [chunks]);

    const stepIcon = (state: StepState) => {
        if (state === "done") return <CheckCircleFilled style={{ color: "#52c41a" }} />;
        if (state === "active") return <LoadingOutlined style={{ color: "#1677ff" }} />;
        return <ClockCircleOutlined style={{ color: "#bfbfbf" }} />;
    };

    return (
        <ToolPageLayout
            title="Semantic Search Playground"
            description="Real embedding-based search over your own text, computed entirely in your browser — no server, no API key"
            icon={<DatabaseOutlined style={{ fontSize: 24 }} />}
            color="#9254de"
            learnMore={{
                whatIs:
                    "A semantic search playground using real sentence embeddings (all-MiniLM-L6-v2, 384 dimensions) instead of keyword matching. Paste or upload text, it's split into overlapping chunks and embedded locally using WebGPU or WASM, then a query is embedded the same way and ranked against the chunks by cosine similarity — so a query can match a chunk that uses different words but means the same thing. Every stage of the pipeline is shown with its timing, and each result is compared against what plain keyword scoring would have returned.",
                whyUse:
                    "Keyword search fails when a query and a document describe the same idea with different words (\"car\" vs \"automobile\"). Embedding-based search captures meaning, not just literal string overlap. This runs the same class of embedding model production RAG pipelines use, but entirely on your machine — and it exposes the chunking, embedding, and ranking steps that are normally hidden inside a vector database.",
                howToUse: [
                    "Click 'Load model' once — this downloads ~25 MB of model weights from the Hugging Face CDN and caches them in your browser",
                    "Paste or upload the text you want to search over, tune chunk size and overlap, then click 'Index documents'",
                    "Type a natural-language query and click 'Search'",
                    "Compare the semantic rank against the keyword rank column — rows that jump are ones keyword search would have missed",
                ],
                tips: [
                    "The model download only happens once per browser — subsequent visits reuse the cache",
                    "WebGPU is much faster than the WASM fallback; check the device badge to see which one loaded",
                    "Chunk overlap stops an answer that straddles a boundary from being cut in half — raise it if results look truncated",
                    "This is retrieval only, not generation — it finds the most relevant chunks, it doesn't write an answer from them",
                    "A cosine score above ~0.5 is usually a strong match; below ~0.2 is often noise. Use the minimum-score slider to cut the tail",
                ],
                useCases: [
                    "Prototyping the retrieval half of a RAG pipeline before wiring up a real vector database",
                    "Tuning chunk size and overlap against your own documents before committing to them in production",
                    "Showing why semantic retrieval beats keyword search on a concrete example",
                    "Understanding how embedding similarity behaves on your own text before choosing a production embedding model",
                ],
            }}
        >
            <Alert
                type="info"
                showIcon
                title="Model weights (~25 MB) download once from the Hugging Face CDN on first use and are cached by your browser. Your text is never uploaded — embeddings are computed locally."
                style={{ marginBottom: 16 }}
            />

            <Card size="small" style={{ marginBottom: 16 }}>
                <Space wrap align="center">
                    {loadState !== "ready" && (
                        <Button
                            type="primary"
                            icon={<ThunderboltOutlined />}
                            loading={loadState === "loading"}
                            onClick={loadModel}
                        >
                            {loadState === "loading" ? `Loading model… ${progress}%` : "Load model"}
                        </Button>
                    )}
                    {loadState === "ready" && device && (
                        <Tag color={device === "webgpu" ? "green" : "orange"}>
                            Model loaded — running on {device === "webgpu" ? "WebGPU" : "WASM (no WebGPU detected)"}
                        </Tag>
                    )}
                    {loadState === "ready" && <Tag>{MODEL_ID}</Tag>}
                    {loadState === "ready" && <Tag>{EMBED_DIMS} dimensions</Tag>}
                    {loadState === "loading" && <Progress percent={progress} size="small" style={{ width: 200 }} />}
                </Space>
                {loadState === "error" && (
                    <Alert type="error" showIcon title={`Failed to load model: ${loadError}`} style={{ marginTop: 12 }} />
                )}
            </Card>

            {steps.length > 0 && (
                <Card size="small" title="Pipeline" style={{ marginBottom: 16 }}>
                    <Space orientation="vertical" size={8} style={{ width: "100%" }}>
                        {steps.map((s) => (
                            <div key={s.key} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                                <span style={{ width: 18, flexShrink: 0 }}>{stepIcon(s.state)}</span>
                                <Text strong={s.state !== "pending"} style={{ minWidth: 210 }}>
                                    {s.label}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12, flex: 1 }}>
                                    {s.detail}
                                </Text>
                                {s.ms !== undefined && (
                                    <Tag color="blue" style={{ marginInlineEnd: 0 }}>
                                        {s.ms.toFixed(0)} ms
                                    </Tag>
                                )}
                            </div>
                        ))}
                    </Space>
                </Card>
            )}

            {indexStats && (
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col xs={12} md={6}>
                        <Card size="small"><Statistic title="Chunks indexed" value={indexStats.count} /></Card>
                    </Col>
                    <Col xs={12} md={6}>
                        <Card size="small"><Statistic title="Avg chunk size" value={indexStats.avgChars} suffix="chars" /></Card>
                    </Col>
                    <Col xs={12} md={6}>
                        <Card size="small">
                            <Statistic title="Vector memory" value={indexStats.vectorKb.toFixed(1)} suffix="KB" />
                        </Card>
                    </Col>
                    <Col xs={12} md={6}>
                        <Card size="small">
                            <Statistic title="Index time" value={indexMs === null ? "—" : indexMs.toFixed(0)} suffix={indexMs === null ? "" : "ms"} />
                        </Card>
                    </Col>
                </Row>
            )}

            <Card size="small" title="Documents" style={{ marginBottom: 16 }}>
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                    <Upload {...uploadProps}>
                        <Button size="small" icon={<UploadOutlined />}>Upload .txt / .md</Button>
                    </Upload>
                    <TextArea
                        rows={8}
                        value={documents}
                        onChange={(e) => setDocuments(e.target.value)}
                        placeholder="Paste the text you want to search over..."
                    />

                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Text style={{ fontSize: 12 }}>
                                Chunk size: <Text strong>{chunkSize}</Text> chars
                            </Text>
                            <Slider min={100} max={1000} step={50} value={chunkSize} onChange={setChunkSize} />
                        </Col>
                        <Col xs={24} md={12}>
                            <Text style={{ fontSize: 12 }}>
                                Chunk overlap: <Text strong>{overlap}</Text> chars
                            </Text>
                            <Slider min={0} max={300} step={20} value={overlap} onChange={setOverlap} />
                        </Col>
                    </Row>

                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Current settings would produce <Text strong>{chunkPreview.length}</Text> chunk(s) from{" "}
                        {documents.length.toLocaleString()} characters.
                    </Text>

                    <Space wrap>
                        <Button type="primary" onClick={handleIndex} loading={indexing} disabled={!documents.trim()}>
                            Index documents
                        </Button>
                        {chunks.length > 0 && <Tag color="blue">Indexed {chunks.length} chunk(s)</Tag>}
                    </Space>

                    {indexStale && (
                        <Alert
                            type="warning"
                            showIcon
                            title="Chunk settings changed since the last index — re-index to apply them."
                        />
                    )}

                    {chunks.length > 0 && (
                        <Collapse
                            size="small"
                            items={[
                                {
                                    key: "chunks",
                                    label: `Inspect indexed chunks (${chunks.length})`,
                                    children: (
                                        <Table
                                            dataSource={chunks}
                                            rowKey="id"
                                            size="small"
                                            pagination={chunks.length > 10 ? { pageSize: 10 } : false}
                                            columns={[
                                                { title: "#", dataIndex: "id", width: 50, render: (v: number) => v + 1 },
                                                { title: "Chars", dataIndex: "chars", width: 70 },
                                                { title: "Words", dataIndex: "words", width: 70 },
                                                {
                                                    title: "Text",
                                                    dataIndex: "text",
                                                    render: (t: string) => (
                                                        <Text style={{ fontSize: 12 }}>{t}</Text>
                                                    ),
                                                },
                                            ]}
                                        />
                                    ),
                                },
                            ]}
                        />
                    )}
                </Space>
            </Card>

            <Card size="small" title="Search">
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                    <Space.Compact style={{ width: "100%" }}>
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onPressEnter={handleSearch}
                            placeholder="Ask a question about the documents above..."
                            disabled={chunks.length === 0}
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSearch}
                            loading={searching}
                            disabled={chunks.length === 0 || !query.trim()}
                        >
                            Search
                        </Button>
                    </Space.Compact>

                    <Space wrap size={4}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Try:</Text>
                        {EXAMPLE_QUERIES.map((q) => (
                            <Tag
                                key={q}
                                style={{ cursor: "pointer" }}
                                onClick={() => setQuery(q)}
                                color="purple"
                            >
                                {q}
                            </Tag>
                        ))}
                    </Space>

                    <Row gutter={24} align="middle">
                        <Col xs={24} md={8}>
                            <Text style={{ fontSize: 12 }}>Top K: <Text strong>{topK}</Text></Text>
                            <Slider min={1} max={20} value={topK} onChange={setTopK} />
                        </Col>
                        <Col xs={24} md={8}>
                            <Text style={{ fontSize: 12 }}>
                                Min similarity: <Text strong>{minScore.toFixed(2)}</Text>
                            </Text>
                            <Slider min={0} max={0.9} step={0.05} value={minScore} onChange={setMinScore} />
                        </Col>
                        <Col xs={24} md={8}>
                            <Space>
                                <Switch size="small" checked={showKeywordCompare} onChange={setShowKeywordCompare} />
                                <Text style={{ fontSize: 12 }}>Compare vs keyword search</Text>
                            </Space>
                        </Col>
                    </Row>

                    {searchError && <Alert type="error" showIcon title={searchError} />}

                    {searchMs !== null && results.length > 0 && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Embedded the query into a {EMBED_DIMS}-dim vector and scored it against{" "}
                            {chunks.length} chunk(s) in <Text strong>{searchMs.toFixed(0)} ms</Text>. Showing{" "}
                            {results.length} result(s) above a {minScore.toFixed(2)} similarity floor.
                        </Text>
                    )}

                    {searchMs !== null && results.length === 0 && !searchError && (
                        <Alert
                            type="info"
                            showIcon
                            title={`No chunk scored above the ${minScore.toFixed(2)} similarity floor for "${lastQuery}". Lower the minimum similarity slider or re-index with a smaller chunk size.`}
                        />
                    )}

                    {results.length > 0 && (
                        <div>
                            {results.map((r, i) => {
                                const jump = r.keywordRank - (i + 1);
                                return (
                                    <div
                                        key={r.chunk.id}
                                        style={{
                                            padding: "12px 0",
                                            borderTop: i === 0 ? undefined : "1px solid var(--wb-border, rgba(5,5,5,0.06))",
                                        }}
                                    >
                                        <Space orientation="vertical" size={6} style={{ width: "100%" }}>
                                            <Space wrap size={4}>
                                                <Tag color="purple">#{i + 1}</Tag>
                                                <Tooltip title="Cosine similarity between the query vector and this chunk's vector. 1.0 is identical direction.">
                                                    <Tag color="blue">similarity {r.score.toFixed(3)}</Tag>
                                                </Tooltip>
                                                <Tag>chunk {r.chunk.id + 1}</Tag>
                                                {showKeywordCompare && (
                                                    <>
                                                        <Tooltip title="Fraction of the query's non-stopword terms that appear literally in this chunk.">
                                                            <Tag color={r.keywordScore > 0 ? "gold" : undefined}>
                                                                keyword {r.keywordScore.toFixed(2)}
                                                            </Tag>
                                                        </Tooltip>
                                                        {jump > 0 && (
                                                            <Tooltip title={`Keyword ranking put this chunk at #${r.keywordRank}. Semantic search moved it up ${jump} place(s).`}>
                                                                <Tag color="green">▲ {jump} vs keyword</Tag>
                                                            </Tooltip>
                                                        )}
                                                        {r.keywordScore === 0 && (
                                                            <Tooltip title="No query term appears literally in this chunk — pure keyword search would have scored it zero.">
                                                                <Tag color="red">keyword search would miss this</Tag>
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                )}
                                            </Space>
                                            <Progress
                                                percent={Math.max(0, Math.round(r.score * 100))}
                                                size="small"
                                                showInfo={false}
                                                strokeColor="#9254de"
                                            />
                                            <Text>{r.chunk.text}</Text>
                                            {showKeywordCompare && r.matchedTerms.length > 0 && (
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Literal term matches: {r.matchedTerms.join(", ")}
                                                </Text>
                                            )}
                                        </Space>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {queryVector && (
                        <Collapse
                            size="small"
                            items={[
                                {
                                    key: "vector",
                                    label: "Inspect the query vector",
                                    children: (
                                        <Space orientation="vertical" size={8} style={{ width: "100%" }}>
                                            <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
                                                This is what &ldquo;{lastQuery}&rdquo; looks like to the model: {EMBED_DIMS}{" "}
                                                floats, L2-normalised. Ranking is just a dot product between this and each
                                                chunk vector — there is no keyword index anywhere in the pipeline.
                                            </Paragraph>
                                            <Text
                                                code
                                                style={{ fontSize: 11, display: "block", wordBreak: "break-all" }}
                                            >
                                                [{queryVector.slice(0, 12).map((v) => v.toFixed(4)).join(", ")}, … {EMBED_DIMS - 12} more]
                                            </Text>
                                        </Space>
                                    ),
                                },
                            ]}
                        />
                    )}
                </Space>
            </Card>
        </ToolPageLayout>
    );
}

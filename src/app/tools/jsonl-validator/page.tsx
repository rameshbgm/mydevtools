"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, Input, Typography, Space, Select, Segmented, Table, Tag, Upload, Alert, Statistic, Row, Col } from "antd";
import { FileTextOutlined, InboxOutlined, EditOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import ToolPageLayout from "@/components/ToolPageLayout";
import SendToButton from "@/components/SendToButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";

const { Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

type SchemaKey = "openai" | "anthropic" | "gemini" | "mistral" | "llama" | "raw";
type InputMode = "text" | "file";

interface ChatMessage { role?: unknown; content?: unknown; [k: string]: unknown; }

interface LineResult {
    line: number;
    valid: boolean;
    errors: string[];
    tokenCount: number;
    raw: string;
}

const SAMPLE_OPENAI = `{"messages": [{"role": "system", "content": "You are a helpful, concise assistant."}, {"role": "user", "content": "What is the capital of France?"}, {"role": "assistant", "content": "Paris."}]}
{"messages": [{"role": "user", "content": "Summarize: the quick brown fox jumps over the lazy dog."}, {"role": "assistant", "content": "A fox jumps over a dog."}]}
{"messages": [{"role": "system", "content": "You are a helpful, concise assistant."}, {"role": "assistant", "content": "Missing a user turn — this line should fail validation."}]}`;

const SAMPLE_ANTHROPIC = `{"system": "You are a helpful, concise assistant.", "messages": [{"role": "user", "content": "What is the capital of France?"}, {"role": "assistant", "content": "Paris."}]}
{"messages": [{"role": "user", "content": "Summarize: the quick brown fox jumps over the lazy dog."}, {"role": "assistant", "content": "A fox jumps over a dog."}]}
{"messages": [{"role": "assistant", "content": "This line starts with assistant, not user — should fail."}, {"role": "user", "content": "Hi"}]}`;

const SAMPLE_GEMINI = `{"systemInstruction": {"parts": [{"text": "You are a helpful, concise assistant."}]}, "contents": [{"role": "user", "parts": [{"text": "What is the capital of France?"}]}, {"role": "model", "parts": [{"text": "Paris."}]}]}
{"contents": [{"role": "user", "parts": [{"text": "Summarize: the quick brown fox jumps over the lazy dog."}]}, {"role": "model", "parts": [{"text": "A fox jumps over a dog."}]}]}
{"contents": [{"role": "user", "parts": [{"text": "This line ends on a user turn — should fail."}]}]}`;

const SAMPLE_MISTRAL = `{"messages": [{"role": "system", "content": "You are a helpful, concise assistant."}, {"role": "user", "content": "What is the capital of France?"}, {"role": "assistant", "content": "Paris."}]}
{"messages": [{"role": "user", "content": "Summarize: the quick brown fox jumps over the lazy dog."}, {"role": "assistant", "content": "A fox jumps over a dog."}]}
{"messages": [{"role": "user", "content": "No assistant reply — should fail."}]}`;

const SAMPLE_LLAMA = `{"messages": [{"role": "system", "content": "You are a helpful, concise assistant."}, {"role": "user", "content": "What is the capital of France?"}, {"role": "assistant", "content": "Paris."}]}
{"text": "### Human: Summarize the fox sentence.\\n### Assistant: A fox jumps over a dog."}
{"prompt": "Translate to French: hello", "completion": " bonjour"}`;

const SAMPLE_RAW = `{"id": 1, "text": "Any JSON object is accepted in raw mode."}
{"id": 2, "nested": {"ok": true}, "tags": ["a", "b"]}
[1, 2, 3]`;

const SAMPLES: Record<SchemaKey, string> = {
    openai: SAMPLE_OPENAI,
    anthropic: SAMPLE_ANTHROPIC,
    gemini: SAMPLE_GEMINI,
    mistral: SAMPLE_MISTRAL,
    llama: SAMPLE_LLAMA,
    raw: SAMPLE_RAW,
};

const SCHEMA_OPTIONS: { value: SchemaKey; label: string }[] = [
    { value: "openai", label: "OpenAI (messages)" },
    { value: "anthropic", label: "Anthropic (system + messages)" },
    { value: "gemini", label: "Google Gemini (contents + parts)" },
    { value: "mistral", label: "Mistral (messages)" },
    { value: "llama", label: "Llama / open models (messages | text | prompt+completion)" },
    { value: "raw", label: "Raw JSONL (syntax only)" },
];

function validateOpenAI(obj: Record<string, unknown>): string[] {
    const errors: string[] = [];
    if (!Array.isArray(obj.messages)) {
        errors.push('missing or non-array "messages" field');
        return errors;
    }
    const messages = obj.messages as ChatMessage[];
    if (messages.length === 0) errors.push('"messages" array is empty');

    let prevRole: string | null = null;
    messages.forEach((m, i) => {
        if (typeof m.role !== "string" || !["system", "user", "assistant", "tool", "function"].includes(m.role)) {
            errors.push(`message[${i}]: invalid or missing "role" (got ${JSON.stringify(m.role)})`);
        }
        if (typeof m.content !== "string" && m.content !== null) {
            errors.push(`message[${i}]: "content" must be a string`);
        }
        if (m.role === "system" && i !== 0) {
            errors.push(`message[${i}]: "system" role must be the first message`);
        }
        if (m.role === "user" || m.role === "assistant") {
            if (prevRole === m.role) errors.push(`message[${i}]: two consecutive "${m.role}" messages — roles should alternate`);
            prevRole = m.role as string;
        }
    });
    if (messages.length > 0 && messages[messages.length - 1]?.role !== "assistant") {
        errors.push('the last message must have role "assistant"');
    }
    if (!messages.some((m) => m.role === "user")) {
        errors.push('no message with role "user" — a training example needs at least one user turn');
    }
    return errors;
}

function validateAnthropic(obj: Record<string, unknown>): string[] {
    const errors: string[] = [];
    if (obj.system !== undefined && typeof obj.system !== "string") {
        errors.push('"system" must be a string when present');
    }
    if (!Array.isArray(obj.messages)) {
        errors.push('missing or non-array "messages" field');
        return errors;
    }
    const messages = obj.messages as ChatMessage[];
    if (messages.length < 2) errors.push('"messages" must contain at least 2 messages (a user turn and an assistant reply)');
    if (messages[0]?.role !== "user") errors.push('the first message must have role "user"');
    if (messages.length > 0 && messages[messages.length - 1]?.role !== "assistant") {
        errors.push('the last message must have role "assistant"');
    }
    messages.forEach((m, i) => {
        if (typeof m.role !== "string" || !["user", "assistant"].includes(m.role)) {
            errors.push(`message[${i}]: invalid or missing "role" (must be "user" or "assistant", got ${JSON.stringify(m.role)})`);
        }
        if (typeof m.content !== "string") {
            errors.push(`message[${i}]: "content" must be a string`);
        }
        if (i > 0 && m.role === messages[i - 1]?.role) {
            errors.push(`message[${i}]: consecutive messages must alternate user/assistant`);
        }
    });
    return errors;
}

function validateGemini(obj: Record<string, unknown>): string[] {
    const errors: string[] = [];
    if (obj.systemInstruction !== undefined) {
        const si = obj.systemInstruction as { parts?: unknown };
        if (typeof si !== "object" || si === null || !Array.isArray(si.parts)) {
            errors.push('"systemInstruction" must be an object with a "parts" array');
        }
    }
    if (!Array.isArray(obj.contents)) {
        errors.push('missing or non-array "contents" field (Gemini uses "contents", not "messages")');
        return errors;
    }
    const contents = obj.contents as { role?: unknown; parts?: unknown }[];
    if (contents.length < 2) errors.push('"contents" must contain at least a user turn and a model reply');
    if (contents[0]?.role !== "user") errors.push('the first entry must have role "user"');
    if (contents.length > 0 && contents[contents.length - 1]?.role !== "model") {
        errors.push('the last entry must have role "model"');
    }
    contents.forEach((c, i) => {
        if (typeof c.role !== "string" || !["user", "model"].includes(c.role)) {
            errors.push(`contents[${i}]: invalid or missing "role" (must be "user" or "model", got ${JSON.stringify(c.role)})`);
        }
        if (!Array.isArray(c.parts) || c.parts.length === 0) {
            errors.push(`contents[${i}]: "parts" must be a non-empty array`);
        } else if (!c.parts.some((p) => typeof (p as { text?: unknown })?.text === "string")) {
            errors.push(`contents[${i}]: no part carries a "text" string`);
        }
        if (i > 0 && c.role === contents[i - 1]?.role) {
            errors.push(`contents[${i}]: consecutive entries must alternate user/model`);
        }
    });
    return errors;
}

// Mistral follows the OpenAI chat shape but does not accept a "function" role
// and does not require strict user/assistant alternation.
function validateMistral(obj: Record<string, unknown>): string[] {
    const errors: string[] = [];
    if (!Array.isArray(obj.messages)) {
        errors.push('missing or non-array "messages" field');
        return errors;
    }
    const messages = obj.messages as ChatMessage[];
    if (messages.length === 0) errors.push('"messages" array is empty');
    messages.forEach((m, i) => {
        if (typeof m.role !== "string" || !["system", "user", "assistant", "tool"].includes(m.role)) {
            errors.push(`message[${i}]: invalid or missing "role" (got ${JSON.stringify(m.role)})`);
        }
        if (typeof m.content !== "string" && m.content !== null) {
            errors.push(`message[${i}]: "content" must be a string`);
        }
        if (m.role === "system" && i !== 0) {
            errors.push(`message[${i}]: "system" role must be the first message`);
        }
    });
    if (messages.length > 0 && messages[messages.length - 1]?.role !== "assistant") {
        errors.push('the last message must have role "assistant"');
    }
    if (!messages.some((m) => m.role === "user")) {
        errors.push('no message with role "user" — a training example needs at least one user turn');
    }
    return errors;
}

// Open-model tooling (Axolotl, LLaMA-Factory, TRL) accepts several shapes.
// Accept any one of them, and report all three failures only if none match.
function validateLlama(obj: Record<string, unknown>): string[] {
    if (Array.isArray(obj.messages)) return validateMistral(obj);
    if (typeof obj.text === "string") {
        return obj.text.trim().length === 0 ? ['"text" must be a non-empty string'] : [];
    }
    if (obj.prompt !== undefined || obj.completion !== undefined) {
        const errors: string[] = [];
        if (typeof obj.prompt !== "string" || obj.prompt.trim().length === 0) {
            errors.push('"prompt" must be a non-empty string');
        }
        if (typeof obj.completion !== "string" || obj.completion.length === 0) {
            errors.push('"completion" must be a non-empty string');
        }
        return errors;
    }
    return ['line matches none of the accepted shapes — expected "messages", "text", or "prompt" + "completion"'];
}

const VALIDATORS: Record<SchemaKey, (obj: Record<string, unknown>) => string[]> = {
    openai: validateOpenAI,
    anthropic: validateAnthropic,
    gemini: validateGemini,
    mistral: validateMistral,
    llama: validateLlama,
    raw: () => [],
};

export default function JsonlValidatorPage() {
    const [text, setText] = useState(SAMPLE_OPENAI);
    const [schema, setSchema] = useState<SchemaKey>("openai");
    const [inputMode, setInputMode] = useState<InputMode>("text");
    const [fileName, setFileName] = useState<string>("");
    const [results, setResults] = useState<LineResult[]>([]);
    const countTokensRef = useRef<((t: string) => number) | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!countTokensRef.current) {
                const { countTokens } = await import("gpt-tokenizer");
                countTokensRef.current = countTokens;
            }
            const countTokens = countTokensRef.current!;
            const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
            const out: LineResult[] = lines.map((raw, idx) => {
                let parsed: Record<string, unknown> | null = null;
                const errors: string[] = [];
                try {
                    const value = JSON.parse(raw);
                    // Raw mode only checks that each line is valid JSON — a bare
                    // array or scalar is legitimate JSONL there.
                    if (typeof value !== "object" || value === null || Array.isArray(value)) {
                        if (schema !== "raw") {
                            errors.push("line is not a JSON object");
                        }
                    } else {
                        parsed = value as Record<string, unknown>;
                    }
                } catch (err) {
                    errors.push(`invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
                }
                if (parsed) {
                    errors.push(...VALIDATORS[schema](parsed));
                }
                return { line: idx + 1, valid: errors.length === 0, errors, tokenCount: countTokens(raw), raw };
            });
            if (!cancelled) setResults(out);
        })();
        return () => { cancelled = true; };
    }, [text, schema]);

    const stats = useMemo(() => {
        const validCount = results.filter((r) => r.valid).length;
        const totalTokens = results.reduce((sum, r) => sum + r.tokenCount, 0);
        return { total: results.length, valid: validCount, invalid: results.length - validCount, totalTokens };
    }, [results]);

    // Re-parsing can still throw for a line that only passed the syntax check in
    // raw mode, so keep the serialisation total rather than letting it blow up.
    const validJson = useMemo(() => {
        const parsed = results
            .filter((r) => r.valid)
            .map((r) => { try { return JSON.parse(r.raw); } catch { return null; } })
            .filter((v) => v !== null);
        return JSON.stringify(parsed, null, 2);
    }, [results]);

    const uploadProps: UploadProps = {
        accept: ".jsonl,.txt",
        showUploadList: false,
        beforeUpload: (file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setText(String(reader.result ?? ""));
                setFileName(file.name);
            };
            reader.readAsText(file);
            return false;
        },
    };

    const columns = [
        { title: "Line", dataIndex: "line", key: "line", width: 70 },
        {
            title: "Status",
            dataIndex: "valid",
            key: "valid",
            width: 90,
            render: (valid: boolean) => (valid ? <Tag color="green">Valid</Tag> : <Tag color="red">Invalid</Tag>),
        },
        { title: "Tokens", dataIndex: "tokenCount", key: "tokenCount", width: 80 },
        {
            title: "Issues",
            dataIndex: "errors",
            key: "errors",
            render: (errors: string[]) =>
                errors.length === 0 ? (
                    <Text type="secondary">—</Text>
                ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {errors.map((e, i) => <li key={i}><Text type="danger" style={{ fontSize: 12 }}>{e}</Text></li>)}
                    </ul>
                ),
        },
    ];

    return (
        <ToolPageLayout
            title="Fine-Tuning Dataset Validator"
            description="Validate JSONL fine-tuning datasets against OpenAI or Anthropic message schemas — entirely in your browser"
            icon={<FileTextOutlined style={{ fontSize: 24 }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "A line-by-line validator for JSONL (newline-delimited JSON) fine-tuning datasets. Checks each line for valid JSON, then checks the parsed object against the OpenAI or Anthropic chat fine-tuning schema — required fields, role ordering, and alternation rules — and counts tokens per line using the same tokenizer OpenAI uses server-side.",
                whyUse: "A single malformed line, or one example with the wrong role order, can reject an entire fine-tuning job hours into an upload. Catching format errors locally — before uploading — saves the wasted round trip, and estimating token count per example helps budget the total cost of a fine-tuning run before committing to it. Nothing in the file is ever uploaded anywhere by this tool.",
                howToUse: [
                    "Paste JSONL content or drop a .jsonl file",
                    "Pick the target schema — OpenAI or Anthropic — the two providers have different message rules",
                    "Review the per-line table for parse errors, schema violations, and token counts",
                    "Fix flagged lines in your source file and re-check",
                ],
                tips: [
                    "OpenAI requires the last message in each example to have role \"assistant\" and system messages (if present) to come first",
                    "Anthropic's format nests messages under a top-level object and requires the array to start with \"user\" and alternate strictly",
                    "Token counts here use OpenAI's o200k_base encoding — treat Anthropic estimates as approximate, since Claude's tokenizer isn't public",
                ],
                useCases: [
                    "Catching malformed lines before submitting a fine-tuning job",
                    "Estimating total token count (and rough training cost) for a dataset before uploading",
                    "Auditing a dataset exported from another tool for role-ordering mistakes",
                ],
            }}
        >
            <ToolBridgeBanner accepts={["text"]} onAccept={(p) => setText(p.data)} />

            <Space style={{ marginBottom: 16 }} wrap>
                <Select
                    value={schema}
                    onChange={(v) => { setSchema(v); setText(SAMPLES[v]); setFileName(""); }}
                    style={{ width: 340 }}
                    options={SCHEMA_OPTIONS}
                />
                <Segmented
                    value={inputMode}
                    onChange={(v) => setInputMode(v as InputMode)}
                    options={[
                        { label: "Paste text", value: "text", icon: <EditOutlined /> },
                        { label: "Upload file", value: "file", icon: <InboxOutlined /> },
                    ]}
                />
                <SendToButton data={validJson} kind="json" sourceToolId="jsonl-validator" size="middle" />
            </Space>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}><Card size="small"><Statistic title="Lines" value={stats.total} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Valid" value={stats.valid} styles={{ content: { color: "#3f8600" } }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Invalid" value={stats.invalid} styles={{ content: { color: stats.invalid > 0 ? "#cf1322" : undefined } }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="Total tokens" value={stats.totalTokens} /></Card></Col>
            </Row>

            <Card size="small" title="JSONL input" style={{ marginBottom: 16 }}>
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                    {inputMode === "file" ? (
                        <>
                            <Dragger {...uploadProps} style={{ padding: "8px 0" }}>
                                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                                <p className="ant-upload-text">Click or drag a .jsonl file here</p>
                                <p className="ant-upload-hint" style={{ fontSize: 12 }}>The file is read locally — nothing is uploaded to a server.</p>
                            </Dragger>
                            {fileName && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Loaded <Text code>{fileName}</Text> — {stats.total} line(s). Switch to
                                    &ldquo;Paste text&rdquo; to edit the contents.
                                </Text>
                            )}
                        </>
                    ) : (
                        <TextArea
                            rows={10}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder='One JSON object per line, e.g. {"messages": [...]}'
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                        />
                    )}
                </Space>
            </Card>

            {stats.invalid > 0 && (
                <Alert
                    type="warning"
                    showIcon
                    title={`${stats.invalid} of ${stats.total} line(s) failed validation`}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Table
                dataSource={results}
                columns={columns}
                rowKey="line"
                pagination={results.length > 20 ? { pageSize: 20 } : false}
                size="small"
            />
        </ToolPageLayout>
    );
}

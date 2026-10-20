"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, Input, Typography, Space, Select, Segmented, Table, Tag, Upload, Alert, Statistic, Row, Col } from "antd";
import { FileTextOutlined, InboxOutlined, EditOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { formatAiDiagnostic } from "@/lib/i18n/remaining-ai";
import { useLanguage } from "@/components/LanguageProvider";
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
    { value: "llama", label: "Llama / open models (messages ∣ text ∣ prompt+completion)" },
    { value: "raw", label: "Raw JSONL (syntax only)" },
];

function validateOpenAI(obj: Record<string, unknown>): string[] {
    const errors: string[] = [];
    if (!Array.isArray(obj.messages)) {
        errors.push('missing or non-array "messages" field');
        return errors;
    }
    const messages = obj.messages as ChatMessage[];
    if (messages.some((m) => typeof m !== "object" || m === null || Array.isArray(m))) return ['"messages" entries must be objects'];
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
    if (messages.some((m) => typeof m !== "object" || m === null || Array.isArray(m))) return ['"messages" entries must be objects'];
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
    if (contents.some((c) => typeof c !== "object" || c === null || Array.isArray(c))) return ['"contents" entries must be objects'];
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
    if (messages.some((m) => typeof m !== "object" || m === null || Array.isArray(m))) return ['"messages" entries must be objects'];
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
    const { t } = useLanguage();
    const [text, setText] = useState(SAMPLE_OPENAI);
    const [schema, setSchema] = useState<SchemaKey>("openai");
    const [inputMode, setInputMode] = useState<InputMode>("text");
    const [fileName, setFileName] = useState<string>("");
    const [loadError, setLoadError] = useState("");
    const [results, setResults] = useState<LineResult[]>([]);
    const countTokensRef = useRef<((t: string) => number) | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoadError("");
        (async () => {
            if (!countTokensRef.current) {
                const { countTokens } = await import("gpt-tokenizer");
                countTokensRef.current = countTokens;
            }
            const countTokens = countTokensRef.current!;
            const lines = text.split("\n").map((raw, index) => ({ raw: raw.trim(), line: index + 1 })).filter(({ raw }) => raw.length > 0);
            const out: LineResult[] = lines.map(({ raw, line }) => {
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
                return { line, valid: errors.length === 0, errors, tokenCount: countTokens(raw), raw };
            });
            if (!cancelled) setResults(out);
        })().catch((cause) => { if (!cancelled) { setResults([]); setLoadError(cause instanceof Error ? cause.message : String(cause)); } });
        return () => { cancelled = true; };
    }, [text, schema]);

    const stats = useMemo(() => {
        const validCount = results.filter((r) => r.valid).length;
        const totalTokens = results.reduce((sum, r) => sum + r.tokenCount, 0);
        return { total: results.length, valid: validCount, invalid: results.length - validCount, totalTokens };
    }, [results]);

    // Keep source JSON lexemes (including null and large numeric literals) exact.
    const validJson = useMemo(() => `[\n${results.filter((r) => r.valid).map((r) => r.raw).join(",\n")}\n]`, [results]);

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
        { title: t("Line"), dataIndex: "line", key: "line", width: 70 },
        {
            title: t("Status"),
            dataIndex: "valid",
            key: "valid",
            width: 90,
            render: (valid: boolean) => (valid ? <Tag color="green">{t("Valid")}</Tag> : <Tag color="red">{t("Invalid")}</Tag>),
        },
        { title: t("Tokens"), dataIndex: "tokenCount", key: "tokenCount", width: 80 },
        {
            title: t("Issues"),
            dataIndex: "errors",
            key: "errors",
            render: (errors: string[]) =>
                errors.length === 0 ? (
                    <Text type="secondary">—</Text>
                ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {errors.map((e, i) => <li key={i}><Text type="danger" style={{ fontSize: 12 }}>{formatAiDiagnostic(e, t)}</Text></li>)}
                    </ul>
                ),
        },
    ];

    return (
        <ToolPageLayout
            title={t("Fine-Tuning Dataset Validator")}
            description={t("Validate JSONL fine-tuning datasets against selectable chat-shape checks — entirely in your browser")}
            icon={<FileTextOutlined style={{ fontSize: 24 }} />}
            color="#722ed1"
            learnMore={{
                "whatIs": "Checks JSONL syntax and simplified chat-shape presets for OpenAI, Anthropic, Gemini, Mistral and open-model examples. This is not authoritative provider-schema or fine-tuning eligibility validation.",
                "whyUse": "Find malformed lines locally before upload. Token counts use local o200k_base on the original line, not a verified model mapping or API request count.",
                "howToUse": [
                                "Paste JSONL or choose a local file, then select a chat preset or Raw JSONL for syntax only.",
                                "Review physical line numbers, issues and token counts; edit the source and check again."
                ],
                "tips": [
                                "Provider presets cover text-oriented examples and may reject other valid provider content blocks. Confirm provider requirements before training.",
                                "Send To exports valid source lines as a JSON array without changing numeric literals or dropping null."
                ],
                "useCases": [
                                "Audit exported datasets and estimate their encoded text size before a training upload."
                ]
}}
        >
            {loadError && <Alert type="error" showIcon title={t("Local tokenizer could not load")} description={loadError} />}
            <ToolBridgeBanner accepts={["text"]} onAccept={(p) => setText(p.data)} />

            <Space style={{ marginBottom: 16 }} wrap>
                <Select
                    value={schema}
                    onChange={(v) => { setSchema(v); setText(SAMPLES[v]); setFileName(""); }}
                    style={{ width: 340 }}
                    options={SCHEMA_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
                />
                <Segmented
                    value={inputMode}
                    onChange={(v) => setInputMode(v as InputMode)}
                    options={[
                        { label: t("Paste text"), value: "text", icon: <EditOutlined /> },
                        { label: t("Upload file"), value: "file", icon: <InboxOutlined /> },
                    ]}
                />
                <SendToButton data={validJson} kind="json" sourceToolId="jsonl-validator" size="middle" />
            </Space>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}><Card size="small"><Statistic title={t("Lines")} value={stats.total} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title={t("Valid")} value={stats.valid} styles={{ content: { color: "#3f8600" } }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title={t("Invalid")} value={stats.invalid} styles={{ content: { color: stats.invalid > 0 ? "#cf1322" : undefined } }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title={t("Total tokens")} value={stats.totalTokens} /></Card></Col>
            </Row>

            <Card size="small" title={t("JSONL input")} style={{ marginBottom: 16 }}>
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                    {inputMode === "file" ? (
                        <>
                            <Dragger {...uploadProps} style={{ padding: "8px 0" }}>
                                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                                <p className="ant-upload-text">{t("Click or drag a .jsonl file here")}</p>
                                <p className="ant-upload-hint" style={{ fontSize: 12 }}>{t("The file is read locally — nothing is uploaded to a server.")}</p>
                            </Dragger>
                            {fileName && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {t("Loaded {file}: {count} lines. Choose Paste text to edit.", { file: fileName, count: stats.total })}</Text>
                            )}
                        </>
                    ) : (
                        <TextArea
                            rows={10}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={t("One JSON object per line, e.g. {\"messages\": [...]}")}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                        />
                    )}
                </Space>
            </Card>

            {stats.invalid > 0 && (
                <Alert
                    type="warning"
                    showIcon
                    title={t("{invalid} of {total} lines failed validation", { invalid: stats.invalid, total: stats.total })}
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

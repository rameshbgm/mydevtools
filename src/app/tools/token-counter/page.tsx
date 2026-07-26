"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Input, Typography, Space, Select, Progress, Tag, Alert } from "antd";
import { NumberOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";
import { LLM_MODELS, estimateTokens, getModel, modelSelectOptions } from "@/lib/llm-models";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type ModelKey = string;

const DEFAULT_MODEL_ID = "gpt-5-6-sol";

interface ShareState { text: string; model: ModelKey; systemTokens: number; historyTokens: number; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "token-counter", version: 1 };

export default function TokenCounterPage() {
    const [text, setText] = useState("");
    const [model, setModel] = useState<ModelKey>(DEFAULT_MODEL_ID);
    const [count, setCount] = useState<number | null>(null);
    const [systemTokens, setSystemTokens] = useState(0);
    const [historyTokens, setHistoryTokens] = useState(0);
    const countersRef = useRef<Record<string, (t: string) => number>>({});

    // Keyed by tokenizer, not model id — every o200k model shares one loaded encoder.
    const loadCounter = async (m: ModelKey): Promise<(t: string) => number> => {
        const tokenizer = getModel(m)?.tokenizer ?? "estimate";
        if (countersRef.current[tokenizer]) return countersRef.current[tokenizer];
        let fn: (t: string) => number;
        if (tokenizer === "o200k") {
            const { countTokens } = await import("gpt-tokenizer");
            fn = (t: string) => countTokens(t);
        } else if (tokenizer === "cl100k") {
            const { countTokens } = await import("gpt-tokenizer/encoding/cl100k_base");
            fn = (t: string) => countTokens(t);
        } else {
            fn = estimateTokens;
        }
        countersRef.current[tokenizer] = fn;
        return fn;
    };

    useEffect(() => {
        let cancelled = false;
        loadCounter(model).then((fn) => {
            if (!cancelled) setCount(fn(text));
        });
        return () => { cancelled = true; };
    }, [text, model]);

    useShareableState(SHARE_SCHEMA, (s) => {
        setText(s.text);
        setModel(s.model);
        setSystemTokens(s.systemTokens);
        setHistoryTokens(s.historyTokens);
    });

    const info = getModel(model) ?? LLM_MODELS[0];
    const isExact = info.tokenizer !== "estimate";
    const inputTokens = count ?? 0;
    const totalTokens = inputTokens + systemTokens + historyTokens;
    const pct = Math.min(100, (totalTokens / info.contextWindow) * 100);

    return (
        <ToolPageLayout
            title="LLM Token Counter"
            description="Count tokens and estimate context-window usage across GPT, Claude, and open models"
            icon={<NumberOutlined style={{ fontSize: 24 }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: "A token counter that measures how many tokens a piece of text consumes for a given LLM, plus a budget bar showing how much of that model's context window is used. Runs entirely in your browser using the same BPE tokenizer OpenAI uses server-side (via gpt-tokenizer) — no text is sent anywhere.",
                whyUse: "LLM APIs price and limit requests by token count, not character count. Estimating cost or checking whether a prompt plus history plus documents fits in the context window before sending it saves failed requests and surprise bills.",
                howToUse: [
                    "Paste or type text into the input box",
                    "Pick a model family — exact counts for GPT models, labeled estimates for Claude and open models",
                    "Optionally add system-prompt and conversation-history token counts to see total budget usage",
                    "Watch the progress bar for how much of the context window is used",
                ],
                tips: [
                    "GPT counts are exact — gpt-tokenizer implements the same BPE algorithm OpenAI uses",
                    "Claude and Llama counts are approximations (~3.5 characters per token) since those tokenizers aren't public",
                    "Code and non-English text often tokenize less efficiently than plain English prose",
                    "Nothing you type is ever sent to a server — tokenization happens entirely in your browser",
                ],
                useCases: [
                    "Checking a prompt fits within a model's context window before sending it",
                    "Estimating API cost for a batch of documents before processing",
                    "Debugging why a long conversation is hitting context limits",
                    "Comparing how the same text tokenizes differently across model families",
                ],
            }}
        >
            <ToolBridgeBanner accepts={["text", "json"]} onAccept={(p) => setText(p.data)} />

            <Space style={{ marginBottom: 16 }} wrap>
                <Select
                    value={model}
                    onChange={setModel}
                    style={{ width: 300 }}
                    showSearch
                    optionFilterProp="label"
                    options={modelSelectOptions()}
                />
                <Tag color={isExact ? "green" : "orange"}>{isExact ? "Exact" : "Estimate (±10-15%)"}</Tag>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ text, model, systemTokens, historyTokens })} size="middle" />
                <SendToButton data={String(totalTokens)} kind="text" sourceToolId="token-counter" size="middle" />
            </Space>

            {!isExact && (
                <Alert type="warning" showIcon title={info.tokenizerNote} style={{ marginBottom: 16 }} />
            )}

            <Card size="small" title="Text">
                <TextArea
                    rows={12}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste text to count tokens..."
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                />
            </Card>

            <Card size="small" title="Context budget" style={{ marginTop: 16 }}>
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>Input text</Text>
                            <div><Text strong style={{ fontSize: 20 }}>{inputTokens.toLocaleString()}</Text> <Text type="secondary">tokens</Text></div>
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>+ System prompt</Text>
                            <div>
                                <Input
                                    type="number"
                                    size="small"
                                    style={{ width: 100 }}
                                    value={systemTokens}
                                    onChange={(e) => setSystemTokens(Math.max(0, Number(e.target.value) || 0))}
                                    min={0}
                                />
                            </div>
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>+ Conversation history</Text>
                            <div>
                                <Input
                                    type="number"
                                    size="small"
                                    style={{ width: 100 }}
                                    value={historyTokens}
                                    onChange={(e) => setHistoryTokens(Math.max(0, Number(e.target.value) || 0))}
                                    min={0}
                                />
                            </div>
                        </div>
                    </div>

                    <Progress
                        percent={Math.round(pct * 10) / 10}
                        status={pct > 90 ? "exception" : pct > 70 ? "active" : "normal"}
                        format={() => `${totalTokens.toLocaleString()} / ${info.contextWindow.toLocaleString()}`}
                    />

                    <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
                        {info.label} ({info.provider}) has a {info.contextWindow.toLocaleString()}-token context window and a{" "}
                        {info.maxOutput.toLocaleString()}-token max output (standard tier — some providers charge more or cap
                        lower above certain lengths). At ${info.inputPrice.toFixed(2)} per 1M input tokens, sending these{" "}
                        {totalTokens.toLocaleString()} tokens once costs about{" "}
                        <Text strong>${((totalTokens / 1_000_000) * info.inputPrice).toFixed(4)}</Text>.
                    </Paragraph>
                </Space>
            </Card>
        </ToolPageLayout>
    );
}

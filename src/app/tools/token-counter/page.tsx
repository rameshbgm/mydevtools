"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Input, Typography, Space, Select, Progress, Tag, Alert } from "antd";
import { NumberOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";
import { countProviderTokens } from "@/lib/provider-token-count";
import { LLM_MODELS, estimateTokens, getModel, modelSelectOptions } from "@/lib/llm-models";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type ModelKey = string;

const DEFAULT_MODEL_ID = "gpt-5-6-sol";

interface ShareState { text: string; model: ModelKey; systemTokens: number; historyTokens: number; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "token-counter", version: 1 };

export default function TokenCounterPage() {
    const { t } = useLanguage();
    const [apiKey, setApiKey] = useState("");
    const [providerResult, setProviderResult] = useState<{ text: string; model: string; count: number } | null>(null);
    const [providerBusy, setProviderBusy] = useState(false);
    const [providerError, setProviderError] = useState("");
    const [text, setText] = useState("");
    const [model, setModel] = useState<ModelKey>(DEFAULT_MODEL_ID);
    const [counterError, setCounterError] = useState("");
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
        setCounterError("");
        loadCounter(model).then((fn) => {
            if (!cancelled) setCount(fn(text));
        }).catch((cause) => { if (!cancelled) { setCount(null); setCounterError(cause instanceof Error ? cause.message : String(cause)); } });
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
            title={t("LLM Token Counter")}
            description={t("Count tokens and estimate context-window usage across GPT, Claude, and open models")}
            icon={<NumberOutlined style={{ fontSize: 24 }} />}
            color="#13c2c2"
            learnMore={{
                "whatIs": "Counts plain-text tokens locally with o200k_base or cl100k_base, or a labeled character heuristic. Optional provider counting sends one user message directly to the selected provider.",
                "whyUse": "Compare prompt size with listed context limits before sending. Local encoding counts do not prove a model mapping or include API wrappers, tools, images or hidden tokens.",
                "howToUse": [
                                "Paste text, choose a model, and add optional system/history token estimates.",
                                "For an optional provider count, enter a key and choose Send; the key stays in page memory and is excluded from sharing."
                ],
                "tips": [
                                "Heuristics have no measured error bound. Verify current model limits and prices with the provider.",
                                "Context and input-cost estimates exclude output and provider request overhead. Browser CORS may block provider counting."
                ],
                "useCases": [
                                "Check prompt budgets, compare encodings, and investigate context-limit errors."
                ]
}}
        >
            {counterError && <Alert type="error" showIcon title={t("Local tokenizer could not load")} description={counterError} />}
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
                <Tag color={isExact ? "green" : "orange"}>{t(isExact ? "Local encoding count" : "Rough heuristic")}</Tag>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ text, model, systemTokens, historyTokens })} size="middle" />
                <SendToButton data={String(totalTokens)} kind="text" sourceToolId="token-counter" size="middle" />
            </Space>

            {!info.verifiedAt && <Alert type="warning" showIcon title={t("Historical model metadata: limits and prices have not been reverified. Confirm with the provider before budgeting.")} style={{ marginBottom: 16 }} />}
            {!isExact && (
                <Alert type="warning" showIcon title={t(info.tokenizerNote)} style={{ marginBottom: 16 }} />
            )}

            <Card size="small" title={t("Text")}>
                <TextArea
                    rows={12}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t("Paste text to count tokens...")}
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                />
            </Card>

            <Card size="small" title={t("Optional provider count")} style={{ marginTop: 16 }}>
                <Space orientation="vertical" style={{ width: "100%" }}>
                    <Text>{t("Sends one user message directly to {provider}. Your key stays in page memory, is sent only to that provider, and is excluded from saved/shared state. Provider terms and CORS limits apply.", { provider: info.provider })}</Text>
                    <Input.Password aria-label={t("Provider API key")} autoComplete="off" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder={t("Provider API key · never saved")} />
                    <button className="wb-native-button" disabled={providerBusy || !apiKey || !text || !info.apiModelId} onClick={async () => {
                        setProviderBusy(true); setProviderError(""); setProviderResult(null);
                        try { const result = await countProviderTokens(info, text, apiKey); setProviderResult({ text, model, count: result }); }
                        catch (cause) { setProviderError(cause instanceof Error ? cause.message : "Provider count failed. No text was sent through the mydevtools server."); }
                        finally { setProviderBusy(false); }
                    }}>{providerBusy ? t("Counting…") : t("Send text to {provider} and count", { provider: info.provider })}</button>
                    <button className="wb-native-button" onClick={() => { setApiKey(""); setProviderResult(null); }}>{t("Clear key and result")}</button>
                    {providerError && <Text role="alert" type="danger">{t(providerError)}</Text>}
                    {providerResult?.text === text && providerResult.model === model && <Text role="status">{t("Provider input: {count} tokens for this one-message request; manual system/history estimates are excluded.", { count: providerResult.count.toLocaleString() })}</Text>}
                </Space>
            </Card>
            <Card size="small" title={t("Context budget")} style={{ marginTop: 16 }}>
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>{t("Input text")}</Text>
                            <div><Text strong style={{ fontSize: 20 }}>{inputTokens.toLocaleString()}</Text> <Text type="secondary">{t("tokens")}</Text></div>
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>{t("+ System prompt")}</Text>
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
                            <Text type="secondary" style={{ fontSize: 12 }}>{t("+ Conversation history")}</Text>
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
                        {t("{model} ({provider}) lists a {context}-token context window and {output}-token maximum output. At ${price} per million input tokens, this input budget costs about ${cost}. Output and request overhead are additional; verify provider limits and pricing.", { model: info.label, provider: info.provider, context: info.contextWindow.toLocaleString(), output: info.maxOutput.toLocaleString(), price: info.inputPrice.toFixed(2), cost: ((totalTokens / 1_000_000) * info.inputPrice).toFixed(4) })} {info.pricingNote && t(info.pricingNote)}
                    </Paragraph>
                </Space>
            </Card>
        </ToolPageLayout>
    );
}

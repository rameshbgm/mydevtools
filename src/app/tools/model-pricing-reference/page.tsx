"use client";

import { useState, useMemo } from "react";
import { Input, Typography, Table, Tag, Card, Space, Select } from "antd";
import { SearchOutlined, DollarOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { LLM_MODELS, LLM_PROVIDERS, PRICES_LAST_VERIFIED, type LlmModel } from "@/lib/llm-models";

const { Text } = Typography;

function formatTokens(n: number): string {
    if (n >= 1_000_000) return `${n / 1_000_000}M`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
    return String(n);
}

export default function ModelPricingReferencePage() {
    const [search, setSearch] = useState("");
    const [provider, setProvider] = useState<string>("all");

    const providers = useMemo(() => ["all", ...LLM_PROVIDERS], []);

    const filtered = useMemo(() => {
        let result = LLM_MODELS;
        if (provider !== "all") result = result.filter((m) => m.provider === provider);
        if (search) {
            const s = search.toLowerCase();
            result = result.filter((m) => m.label.toLowerCase().includes(s) || m.provider.toLowerCase().includes(s));
        }
        return result;
    }, [search, provider]);

    const columns = [
        {
            title: "Provider",
            dataIndex: "provider",
            key: "provider",
            width: 100,
            render: (p: string) => <Tag>{p}</Tag>,
        },
        {
            title: "Model",
            dataIndex: "model",
            key: "model",
            render: (_: unknown, record: LlmModel) => (
                <a href={record.pricingUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                    {record.label}
                </a>
            ),
        },
        {
            title: "Context",
            dataIndex: "contextWindow",
            key: "contextWindow",
            width: 130,
            sorter: (a: LlmModel, b: LlmModel) => a.contextWindow - b.contextWindow,
            render: (v: number) => formatTokens(v),
        },
        {
            title: "Max Output",
            dataIndex: "maxOutput",
            key: "maxOutput",
            width: 100,
            render: (v: number) => formatTokens(v),
        },
        {
            title: "Input / 1M",
            dataIndex: "inputPrice",
            key: "inputPrice",
            width: 100,
            sorter: (a: LlmModel, b: LlmModel) => a.inputPrice - b.inputPrice,
            render: (v: number) => `$${v.toFixed(2)}`,
        },
        {
            title: "Output / 1M",
            dataIndex: "outputPrice",
            key: "outputPrice",
            width: 100,
            sorter: (a: LlmModel, b: LlmModel) => a.outputPrice - b.outputPrice,
            render: (v: number) => `$${v.toFixed(2)}`,
        },
        {
            title: "Cached Input",
            dataIndex: "cachedInputPrice",
            key: "cachedInputPrice",
            width: 100,
            render: (v?: number) => (v === undefined ? <Text type="secondary">—</Text> : `$${v.toFixed(2)}`),
        },
        {
            title: "Vision",
            dataIndex: "vision",
            key: "vision",
            width: 70,
            render: (v: boolean) => (v ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>),
        },
        {
            title: "Tools",
            dataIndex: "tools",
            key: "tools",
            width: 70,
            render: (v: boolean) => (v ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>),
        },
        { title: "Cutoff", dataIndex: "knowledgeCutoff", key: "knowledgeCutoff", width: 90 },
    ];

    return (
        <ToolPageLayout
            title="Model & Pricing Comparison"
            description="Compare context windows, output limits and per-token pricing across major LLM providers"
            icon={<DollarOutlined style={{ fontSize: 24 }} />}
            color="#fa8c16"
            learnMore={{
                whatIs: "A comparison table of publicly listed API pricing and capabilities for current LLM models from Anthropic, OpenAI, Google, Meta, and Mistral — context window size, max output tokens, per-million-token input/output cost, cached-input discounts, and modality support.",
                whyUse: "Model pricing changes frequently and differs meaningfully across providers and tiers (e.g. long-context surcharges, cached-input discounts). This gives a single place to compare the numbers that actually drive cost when choosing a model for a project.",
                howToUse: [
                    "Search by model or provider name",
                    "Filter by provider using the dropdown",
                    "Sort by input or output price to find the cheapest option for your workload",
                    "Click a model name to open the provider's own pricing page for the current, authoritative number",
                ],
                tips: [
                    "Cached input pricing (prompt caching) can cut input costs by up to 90% for repeated context — check if your workload benefits",
                    "Some providers charge more once a request crosses a context-length threshold (e.g. Gemini Pro above 200K tokens) — this table shows the standard tier",
                    "Batch APIs (where offered) typically halve both input and output pricing in exchange for asynchronous processing",
                ],
                useCases: [
                    "Estimating monthly cost for a planned LLM feature before committing to a provider",
                    "Comparing context window size across providers for a RAG or long-document use case",
                    "Checking whether a model supports vision or tool-calling before building against it",
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Prices last verified {PRICES_LAST_VERIFIED}. LLM pricing changes often — click a model name to confirm the current rate on the provider&rsquo;s own page before relying on it for budgeting.
                    </Text>

                    <Space wrap style={{ width: "100%" }}>
                        <Input
                            style={{ width: 280 }}
                            placeholder="Search by model or provider..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                        />
                        <Select
                            value={provider}
                            onChange={setProvider}
                            style={{ width: 160 }}
                            options={providers.map((p) => ({ value: p, label: p === "all" ? "All providers" : p }))}
                        />
                    </Space>

                    <Table
                        dataSource={filtered}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ x: 900 }}
                    />
                </Space>
            </Card>
        </ToolPageLayout>
    );
}

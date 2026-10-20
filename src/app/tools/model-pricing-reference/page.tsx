"use client";

import { useState, useMemo } from "react";
import { Input, Typography, Table, Tag, Card, Space, Select } from "antd";
import { SearchOutlined, DollarOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { LLM_MODELS, LLM_PROVIDERS, PRICES_LAST_VERIFIED, type LlmModel } from "@/lib/llm-models";

const { Text } = Typography;

function formatTokens(n: number): string {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}
function formatUsd(value: number): string {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 20 }).format(value);
}

export default function ModelPricingReferencePage() {
    const { t } = useLanguage();
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
            title: t("Provider"),
            dataIndex: "provider",
            key: "provider",
            width: 100,
            render: (p: string) => <Tag>{p}</Tag>,
        },
        {
            title: t("Model"),
            dataIndex: "model",
            key: "model",
            render: (_: unknown, record: LlmModel) => (
                <a href={record.pricingUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                    {record.label}
                </a>
            ),
        },
        {
            title: t("Context"),
            dataIndex: "contextWindow",
            key: "contextWindow",
            width: 130,
            sorter: (a: LlmModel, b: LlmModel) => a.contextWindow - b.contextWindow,
            render: (v: number) => formatTokens(v),
        },
        {
            title: t("Max Output"),
            dataIndex: "maxOutput",
            key: "maxOutput",
            width: 100,
            render: (v: number) => formatTokens(v),
        },
        {
            title: t("Input / 1M"),
            dataIndex: "inputPrice",
            key: "inputPrice",
            width: 100,
            sorter: (a: LlmModel, b: LlmModel) => a.inputPrice - b.inputPrice,
            render: (v: number) => formatUsd(v),
        },
        {
            title: t("Output / 1M"),
            dataIndex: "outputPrice",
            key: "outputPrice",
            width: 100,
            sorter: (a: LlmModel, b: LlmModel) => a.outputPrice - b.outputPrice,
            render: (v: number) => formatUsd(v),
        },
        {
            title: t("Cached Input"),
            dataIndex: "cachedInputPrice",
            key: "cachedInputPrice",
            width: 100,
            render: (v?: number) => (v === undefined ? <Text type="secondary">—</Text> : formatUsd(v)),
        },
        {
            title: t("Vision"),
            dataIndex: "vision",
            key: "vision",
            width: 70,
            render: (v: boolean) => (v ? <Tag color="green">{t("Yes")}</Tag> : <Tag>{t("No")}</Tag>),
        },
        {
            title: t("Tools"),
            dataIndex: "tools",
            key: "tools",
            width: 70,
            render: (v: boolean) => (v ? <Tag color="green">{t("Yes")}</Tag> : <Tag>{t("No")}</Tag>),
        },
        { title: t("Review / pricing scope"), key: "review", width: 280, render: (_: unknown, model: LlmModel) => <span>{model.verifiedAt ? t("Reviewed {at}", { at: model.verifiedAt }) : t("Historical · verify before use")}<br />{model.pricingNote && t(model.pricingNote)}<br />{model.metadataUrl && <a href={model.metadataUrl} target="_blank" rel="noopener noreferrer">{t("Model specification")}</a>}</span> },
        { title: t("Cutoff"), dataIndex: "knowledgeCutoff", key: "knowledgeCutoff", width: 90, render: (value: string) => value === "Not listed" ? t(value) : value },
    ];

    return (
        <ToolPageLayout
            title={t("Model & Pricing Comparison")}
            description={t("Compare context windows, output limits and per-token pricing across major LLM providers")}
            icon={<DollarOutlined style={{ fontSize: 24 }} />}
            color="#fa8c16"
            learnMore={{
                whatIs: t("Compare a dated snapshot of selected LLM model prices, context windows and listed capabilities. Historical rows are not reverified."),
                whyUse: t("Compare the listed values in one place, then check the provider's current pricing and model documentation for your workload."),
                howToUse: [
                    t("Search by model or provider name"),
                    t("Filter by provider using the dropdown"),
                    t("Sort the listed input and output prices, and review each row's pricing scope"),
                    t("Open the provider's pricing and specification links before relying on a row"),
                ],
                tips: [
                    t("Amounts are USD per million tokens. Different token classes, context thresholds, regions and service tiers can change the effective price."),
                    t("Cached-input prices apply only under the provider's eligibility and retention rules."),
                    t("Storage, request fees and other modality charges may be outside the listed text-token rates."),
                ],
                useCases: [
                    t("Comparing dated pricing snapshots"),
                    t("Finding provider documentation for a model"),
                    t("Reviewing context and output limits before integration"),
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {t("Selected models reviewed {at}. Historical rows are unverified. Open the provider's page to confirm current prices and terms before budgeting.", { at: PRICES_LAST_VERIFIED })}
                    </Text>

                    <Space wrap style={{ width: "100%" }}>
                        <Input
                            style={{ width: 280, maxWidth: "100%", fontSize: 16 }}
                            placeholder={t("Search by model or provider...")}
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                        />
                        <Select
                            value={provider}
                            onChange={setProvider}
                            style={{ width: 160, maxWidth: "100%" }}
                            options={providers.map((p) => ({ value: p, label: p === "all" ? t("All providers") : p }))}
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

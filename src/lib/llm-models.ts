// Single source of truth for LLM model metadata shared across the AI tools
// (token-counter, jsonl-validator, model-pricing-reference). Previously each
// page carried its own hard-coded list and they drifted apart.
//
// Verified 2026-07. Prices are USD per 1M tokens, standard tier.

export type TokenizerKind =
    | "o200k" // OpenAI GPT-4o / GPT-5.x / o-series
    | "cl100k" // OpenAI GPT-4 / GPT-3.5 / embeddings
    | "estimate"; // no public tokenizer — char-ratio approximation

export interface LlmModel {
    /** Stable key used in URLs and shareable state — do not rename. */
    id: string;
    provider: string;
    /** Human label shown in dropdowns. */
    label: string;
    contextWindow: number;
    maxOutput: number;
    inputPrice: number;
    outputPrice: number;
    cachedInputPrice?: number;
    vision: boolean;
    tools: boolean;
    knowledgeCutoff: string;
    pricingUrl: string;
    tokenizer: TokenizerKind;
    /** Notes shown when the token count is an approximation. */
    tokenizerNote: string;
}

export const PRICES_LAST_VERIFIED = "2026-07";

const OPENAI_PRICING = "https://openai.com/api/pricing";
const ANTHROPIC_PRICING = "https://www.anthropic.com/pricing";
const GOOGLE_PRICING = "https://ai.google.dev/pricing";
const META_PRICING = "https://ai.meta.com/llama/";
const MISTRAL_PRICING = "https://mistral.ai/pricing";
const DEEPSEEK_PRICING = "https://api-docs.deepseek.com/quick_start/pricing";
const XAI_PRICING = "https://x.ai/api";
const COHERE_PRICING = "https://cohere.com/pricing";
const QWEN_PRICING = "https://www.alibabacloud.com/help/en/model-studio/models";

const EXACT_NOTE = "Exact — same BPE tokenizer OpenAI uses server-side.";
const ESTIMATE_NOTE =
    "Estimate only — this provider's tokenizer isn't public. Typically within ±10-15% of the real count.";

export const LLM_MODELS: LlmModel[] = [
    // ── Anthropic ──
    {
        id: "claude-opus-5",
        provider: "Anthropic",
        label: "Claude Opus 5",
        contextWindow: 1_000_000,
        maxOutput: 128_000,
        inputPrice: 5,
        outputPrice: 25,
        vision: true,
        tools: true,
        knowledgeCutoff: "2026-05",
        pricingUrl: ANTHROPIC_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },
    {
        id: "claude-sonnet-5",
        provider: "Anthropic",
        label: "Claude Sonnet 5",
        contextWindow: 1_000_000,
        maxOutput: 128_000,
        inputPrice: 3,
        outputPrice: 15,
        cachedInputPrice: 0.3,
        vision: true,
        tools: true,
        knowledgeCutoff: "2026-05",
        pricingUrl: ANTHROPIC_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },
    {
        id: "claude-haiku-4-5",
        provider: "Anthropic",
        label: "Claude Haiku 4.5",
        contextWindow: 200_000,
        maxOutput: 64_000,
        inputPrice: 1,
        outputPrice: 5,
        cachedInputPrice: 0.1,
        vision: true,
        tools: true,
        knowledgeCutoff: "2025-11",
        pricingUrl: ANTHROPIC_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },
    {
        id: "claude-fable-5",
        provider: "Anthropic",
        label: "Claude Fable 5",
        contextWindow: 1_000_000,
        maxOutput: 128_000,
        inputPrice: 10,
        outputPrice: 50,
        vision: true,
        tools: true,
        knowledgeCutoff: "2026-05",
        pricingUrl: ANTHROPIC_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },
    {
        id: "claude-opus-4-8",
        provider: "Anthropic",
        label: "Claude Opus 4.8",
        contextWindow: 1_000_000,
        maxOutput: 128_000,
        inputPrice: 5,
        outputPrice: 25,
        vision: true,
        tools: true,
        knowledgeCutoff: "2025-11",
        pricingUrl: ANTHROPIC_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },

    // ── OpenAI ──
    {
        id: "gpt-5-6-sol",
        provider: "OpenAI",
        label: "GPT-5.6 Sol",
        contextWindow: 1_000_000,
        maxOutput: 64_000,
        inputPrice: 5,
        outputPrice: 30,
        vision: true,
        tools: true,
        knowledgeCutoff: "2026-06",
        pricingUrl: OPENAI_PRICING,
        tokenizer: "o200k",
        tokenizerNote: EXACT_NOTE,
    },
    {
        id: "gpt-5-6-terra",
        provider: "OpenAI",
        label: "GPT-5.6 Terra",
        contextWindow: 1_000_000,
        maxOutput: 64_000,
        inputPrice: 2.5,
        outputPrice: 15,
        vision: true,
        tools: true,
        knowledgeCutoff: "2026-06",
        pricingUrl: OPENAI_PRICING,
        tokenizer: "o200k",
        tokenizerNote: EXACT_NOTE,
    },
    {
        id: "gpt-5-6-luna",
        provider: "OpenAI",
        label: "GPT-5.6 Luna",
        contextWindow: 1_000_000,
        maxOutput: 32_000,
        inputPrice: 1,
        outputPrice: 6,
        vision: true,
        tools: true,
        knowledgeCutoff: "2026-06",
        pricingUrl: OPENAI_PRICING,
        tokenizer: "o200k",
        tokenizerNote: EXACT_NOTE,
    },
    {
        id: "gpt-4o",
        provider: "OpenAI",
        label: "GPT-4o",
        contextWindow: 128_000,
        maxOutput: 16_384,
        inputPrice: 2.5,
        outputPrice: 10,
        cachedInputPrice: 1.25,
        vision: true,
        tools: true,
        knowledgeCutoff: "2023-10",
        pricingUrl: OPENAI_PRICING,
        tokenizer: "o200k",
        tokenizerNote: EXACT_NOTE,
    },
    {
        id: "gpt-4o-mini",
        provider: "OpenAI",
        label: "GPT-4o mini",
        contextWindow: 128_000,
        maxOutput: 16_384,
        inputPrice: 0.15,
        outputPrice: 0.6,
        cachedInputPrice: 0.075,
        vision: true,
        tools: true,
        knowledgeCutoff: "2023-10",
        pricingUrl: OPENAI_PRICING,
        tokenizer: "o200k",
        tokenizerNote: EXACT_NOTE,
    },
    {
        id: "gpt-4-turbo",
        provider: "OpenAI",
        label: "GPT-4 Turbo",
        contextWindow: 128_000,
        maxOutput: 4_096,
        inputPrice: 10,
        outputPrice: 30,
        vision: true,
        tools: true,
        knowledgeCutoff: "2023-12",
        pricingUrl: OPENAI_PRICING,
        tokenizer: "cl100k",
        tokenizerNote: EXACT_NOTE,
    },
    {
        id: "gpt-3-5-turbo",
        provider: "OpenAI",
        label: "GPT-3.5 Turbo",
        contextWindow: 16_385,
        maxOutput: 4_096,
        inputPrice: 0.5,
        outputPrice: 1.5,
        vision: false,
        tools: true,
        knowledgeCutoff: "2021-09",
        pricingUrl: OPENAI_PRICING,
        tokenizer: "cl100k",
        tokenizerNote: EXACT_NOTE,
    },

    // ── Google ──
    {
        id: "gemini-3-1-pro",
        provider: "Google",
        label: "Gemini 3.1 Pro",
        contextWindow: 1_000_000,
        maxOutput: 64_000,
        inputPrice: 2,
        outputPrice: 12,
        vision: true,
        tools: true,
        knowledgeCutoff: "2026-04",
        pricingUrl: GOOGLE_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },
    {
        id: "gemini-3-6-flash",
        provider: "Google",
        label: "Gemini 3.6 Flash",
        contextWindow: 1_000_000,
        maxOutput: 64_000,
        inputPrice: 1.5,
        outputPrice: 7.5,
        vision: true,
        tools: true,
        knowledgeCutoff: "2026-06",
        pricingUrl: GOOGLE_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },
    {
        id: "gemini-2-5-flash",
        provider: "Google",
        label: "Gemini 2.5 Flash",
        contextWindow: 1_000_000,
        maxOutput: 65_536,
        inputPrice: 0.3,
        outputPrice: 2.5,
        vision: true,
        tools: true,
        knowledgeCutoff: "2025-01",
        pricingUrl: GOOGLE_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },

    // ── Meta ──
    {
        id: "llama-4-scout",
        provider: "Meta",
        label: "Llama 4 Scout",
        contextWindow: 10_000_000,
        maxOutput: 8_192,
        inputPrice: 0.18,
        outputPrice: 0.59,
        vision: true,
        tools: true,
        knowledgeCutoff: "2025-08",
        pricingUrl: META_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },
    {
        id: "llama-4-maverick",
        provider: "Meta",
        label: "Llama 4 Maverick",
        contextWindow: 1_000_000,
        maxOutput: 8_192,
        inputPrice: 0.27,
        outputPrice: 0.85,
        vision: true,
        tools: true,
        knowledgeCutoff: "2025-08",
        pricingUrl: META_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },

    // ── Mistral ──
    {
        id: "mistral-large-3",
        provider: "Mistral",
        label: "Mistral Large 3",
        contextWindow: 256_000,
        maxOutput: 16_000,
        inputPrice: 0.5,
        outputPrice: 1.5,
        vision: true,
        tools: true,
        knowledgeCutoff: "2025-12",
        pricingUrl: MISTRAL_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },
    {
        id: "mistral-small-3",
        provider: "Mistral",
        label: "Mistral Small 3",
        contextWindow: 128_000,
        maxOutput: 16_000,
        inputPrice: 0.1,
        outputPrice: 0.3,
        vision: true,
        tools: true,
        knowledgeCutoff: "2025-10",
        pricingUrl: MISTRAL_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },

    // ── DeepSeek ──
    {
        id: "deepseek-v3",
        provider: "DeepSeek",
        label: "DeepSeek V3",
        contextWindow: 128_000,
        maxOutput: 8_192,
        inputPrice: 0.27,
        outputPrice: 1.1,
        cachedInputPrice: 0.07,
        vision: false,
        tools: true,
        knowledgeCutoff: "2024-07",
        pricingUrl: DEEPSEEK_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },
    {
        id: "deepseek-r1",
        provider: "DeepSeek",
        label: "DeepSeek R1",
        contextWindow: 128_000,
        maxOutput: 32_768,
        inputPrice: 0.55,
        outputPrice: 2.19,
        cachedInputPrice: 0.14,
        vision: false,
        tools: true,
        knowledgeCutoff: "2024-07",
        pricingUrl: DEEPSEEK_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },

    // ── xAI ──
    {
        id: "grok-4",
        provider: "xAI",
        label: "Grok 4",
        contextWindow: 256_000,
        maxOutput: 32_000,
        inputPrice: 3,
        outputPrice: 15,
        vision: true,
        tools: true,
        knowledgeCutoff: "2025-11",
        pricingUrl: XAI_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },

    // ── Cohere ──
    {
        id: "command-a",
        provider: "Cohere",
        label: "Command A",
        contextWindow: 256_000,
        maxOutput: 8_192,
        inputPrice: 2.5,
        outputPrice: 10,
        vision: false,
        tools: true,
        knowledgeCutoff: "2025-01",
        pricingUrl: COHERE_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },

    // ── Alibaba ──
    {
        id: "qwen-3-max",
        provider: "Alibaba",
        label: "Qwen 3 Max",
        contextWindow: 256_000,
        maxOutput: 32_768,
        inputPrice: 1.2,
        outputPrice: 6,
        vision: true,
        tools: true,
        knowledgeCutoff: "2025-09",
        pricingUrl: QWEN_PRICING,
        tokenizer: "estimate",
        tokenizerNote: ESTIMATE_NOTE,
    },
];

export const LLM_PROVIDERS: string[] = Array.from(
    new Set(LLM_MODELS.map((m) => m.provider)),
);

export function getModel(id: string): LlmModel | undefined {
    return LLM_MODELS.find((m) => m.id === id);
}

/** Options for an antd `<Select>`, grouped by provider. */
export function modelSelectOptions() {
    return LLM_PROVIDERS.map((provider) => ({
        label: provider,
        options: LLM_MODELS.filter((m) => m.provider === provider).map((m) => ({
            value: m.id,
            label: m.label,
        })),
    }));
}

// ponytail: a char-ratio approximation for the tokenizers gpt-tokenizer doesn't
// implement (Anthropic, Google, and most open-weight vocabularies are private).
// Anthropic's docs suggest ~3.5 chars/token as a rule of thumb for English prose.
export function estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 3.5);
}

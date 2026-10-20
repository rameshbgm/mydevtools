import type { LlmModel } from "./llm-models";
/** Fixed first-party endpoints; no proxy, persistence, or model generation. */
export function providerTokenRequest(model: Pick<LlmModel, "provider" | "apiModelId">, text: string, apiKey: string) {
    if (!apiKey.trim() || !model.apiModelId || !/^[a-zA-Z0-9._-]+$/.test(model.apiModelId)) throw new Error("Choose a supported model and enter a provider API key.");
    if (new TextEncoder().encode(text).length > 1024 * 1024) throw new Error("Provider counting is limited to 1 MiB of text.");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (model.provider === "OpenAI") return { url: "https://api.openai.com/v1/responses/input_tokens", headers: { ...headers, Authorization: `Bearer ${apiKey.trim()}` }, body: { model: model.apiModelId, input: text }, countKey: "input_tokens" };
    if (model.provider === "Anthropic") return { url: "https://api.anthropic.com/v1/messages/count_tokens", headers: { ...headers, "x-api-key": apiKey.trim(), "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" }, body: { model: model.apiModelId, messages: [{ role: "user", content: text }] }, countKey: "input_tokens" };
    if (model.provider === "Google") return { url: `https://generativelanguage.googleapis.com/v1beta/models/${model.apiModelId}:countTokens`, headers: { ...headers, "x-goog-api-key": apiKey.trim() }, body: { contents: [{ role: "user", parts: [{ text }] }] }, countKey: "totalTokens" };
    throw new Error("Provider counting is available for selected OpenAI, Anthropic and Gemini models.");
}
export async function countProviderTokens(model: Pick<LlmModel, "provider" | "apiModelId">, text: string, apiKey: string, send: typeof fetch = fetch) {
    const request = providerTokenRequest(model, text, apiKey);
    const response = await send(request.url, { method: "POST", headers: request.headers, body: JSON.stringify(request.body), cache: "no-store", credentials: "omit", redirect: "error", signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Provider returned HTTP ${response.status}. Check your key, model access and provider limits.`);
    const result = await response.json();
    const count = result[request.countKey];
    if (!Number.isSafeInteger(count) || count < 0) throw new Error("Provider response did not contain a valid token count.");
    return count as number;
}

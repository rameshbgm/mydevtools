import { asRecord } from "./structured-data";
export type A2aVersion = "1.0" | "0.3" | "legacy";
export const A2A_METHODS = {
    "1.0": { send: "SendMessage", stream: "SendStreamingMessage", get: "GetTask", cancel: "CancelTask" },
    "0.3": { send: "message/send", stream: "message/stream", get: "tasks/get", cancel: "tasks/cancel" },
    legacy: { send: "tasks/send", stream: "tasks/sendSubscribe", get: "tasks/get", cancel: "tasks/cancel" },
} as const;
export function a2aPart(version: A2aVersion, kind: "text" | "data", value: unknown) {
    return version === "1.0" ? { [kind]: value } : { [version === "0.3" ? "kind" : "type"]: kind, [kind]: value };
}
export function a2aMessage(version: A2aVersion, text: string, messageId: string, contextId?: string | null) {
    return { role: version === "1.0" ? "ROLE_USER" : "user", parts: [a2aPart(version, "text", text)],
        ...(version !== "legacy" ? { messageId, ...(contextId ? { contextId } : {}) } : {}) };
}
export function a2aEndpoint(cardValue: unknown, version: A2aVersion, configuredUrl: string): string {
    const card = asRecord(cardValue);
    let endpoint: unknown = card.url || configuredUrl;
    if (version === "1.0") {
        const interfaces = Array.isArray(card.supportedInterfaces) ? card.supportedInterfaces.map(asRecord) : [];
        const selected = interfaces.find((entry) => entry.protocolBinding === "JSONRPC" && /^1\.0(?:\.|$)/.test(String(entry.protocolVersion)));
        if (!selected || typeof selected.url !== "string") throw new Error("The A2A 1.0 card must advertise a JSONRPC supportedInterface with protocolVersion 1.0 and a URL. REST/gRPC bindings are not exercised by this inspector.");
        endpoint = selected.url;
    }
    const url = new URL(String(endpoint), configuredUrl);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("RPC endpoint must be an HTTP(S) URL without embedded credentials.");
    if (url.origin !== new URL(configuredUrl).origin) throw new Error(`Agent card advertises a different origin (${url.origin}). Enter that endpoint explicitly before sending credentials or messages.`);
    return url.toString();
}
export function normalizeA2aResult(value: unknown): Record<string, unknown> {
    const source = asRecord(value);
    const result = asRecord(source.task ?? source.message ?? source.statusUpdate ?? source.artifactUpdate ?? value);
    const status = asRecord(result.status);
    const state = typeof status.state === "string" ? status.state.replace(/^TASK_STATE_/, "").toLowerCase().replace(/_/g, "-") : undefined;
    return { ...result, ...(result.status ? { status: { ...status, ...(state ? { state } : {}) } } : {}),
        ...(result.artifact ? { artifacts: [result.artifact] } : {}) };
}
export function a2aText(parts: unknown) {
    return Array.isArray(parts) ? parts.map(asRecord).filter((part) => typeof part.text === "string").map((part) => part.text).join("") : "";
}
export class A2aStreamAccumulator {
    private artifacts = new Map<string, string>();
    consume(value: unknown) {
        const result = normalizeA2aResult(value), status = asRecord(result.status);
        let finalText: string | null = null;
        if (Array.isArray(result.artifacts)) {
            for (const raw of result.artifacts) {
                const artifact = asRecord(raw), id = String(artifact.artifactId ?? "default");
                this.artifacts.set(id, (result.append === true ? this.artifacts.get(id) ?? "" : "") + a2aText(artifact.parts));
            }
            finalText = [...this.artifacts.values()].join("\n");
        }
        return { deltaText: a2aText(asRecord(status.message).parts) || a2aText(result.parts), finalText,
            state: typeof status.state === "string" ? status.state : undefined,
            taskId: typeof result.id === "string" ? result.id : typeof result.taskId === "string" ? result.taskId : undefined,
            contextId: typeof result.contextId === "string" ? result.contextId : undefined };
    }
}

// Cross-tool pipeline bridge.
//
// One tool emits a `ToolPayload`; another tool reads it on mount. The handoff
// goes through `sessionStorage` so it survives the Next.js client navigation
// to the target tool, and is scoped to the current browser tab (the
// expected workflow is single-window, not cross-tab).
//
// Contract — keep this small and typed. Any tool can produce or consume
// these `kind`s; future kinds should be added here, not invented per tool.

export type ToolPayloadKind = "text" | "json" | "xml" | "csv" | "base64" | "url" | "html" | "binary" | "mermaid";

export interface ToolPayload {
    kind: ToolPayloadKind;
    data: string;             // payload (raw text, JSON string, base64 for binary, etc.)
    sourceToolId?: string;    // for "from [tool]" provenance in the target's banner
    label?: string;           // optional one-liner the target tool can show
    createdAt: number;        // epoch ms — discarded if older than TTL
}

const STORAGE_KEY = "mydevtools.bridge.payload";
const TTL_MS = 60 * 1000; // 1 minute — the handoff is meant to be immediate

/** Drop a payload that the next tool will pick up on mount. */
export function pushToBridge(payload: Omit<ToolPayload, "createdAt">): void {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...payload, createdAt: Date.now() }));
    } catch {
        // sessionStorage can be unavailable (private mode quotas, disabled).
        // The send-to feature is non-essential; silently degrade.
    }
}

/** Read and clear the pending payload (one-shot — re-arming requires another push). */
export function consumeFromBridge(): ToolPayload | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        sessionStorage.removeItem(STORAGE_KEY);
        const parsed = JSON.parse(raw) as ToolPayload;
        if (!parsed || typeof parsed.data !== "string") return null;
        if (Date.now() - parsed.createdAt > TTL_MS) return null;
        return parsed;
    } catch {
        return null;
    }
}

/** Peek without consuming — used by the banner that asks "import this payload?" */
export function peekBridge(): ToolPayload | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as ToolPayload;
        if (!parsed || typeof parsed.data !== "string") return null;
        if (Date.now() - parsed.createdAt > TTL_MS) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function clearBridge(): void {
    if (typeof window === "undefined") return;
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}

// ──────────────────────────────────────────────────────────────────────
// Routing — which tools can consume which payload kinds.
//
// The SendToButton uses this to populate its dropdown. Tool authors opt in
// here rather than adding a tag to the registry, because the consumable set
// often diverges from the obvious category — e.g. base64 accepts `text`
// (to encode) and `base64` (to decode), but is in "Encoding & Decoding".
// ──────────────────────────────────────────────────────────────────────

export interface BridgeTarget {
    toolId: string;
    label: string;          // friendly name shown in the dropdown
    accepts: ToolPayloadKind[];
    description?: string;   // tooltip
}

export const BRIDGE_TARGETS: BridgeTarget[] = [
    { toolId: "json-formatter",  label: "JSON Formatter",     accepts: ["text", "json"] },
    { toolId: "json-validator",  label: "JSON Validator",     accepts: ["text", "json"] },
    { toolId: "json-to-csv",     label: "JSON → CSV",         accepts: ["json"] },
    { toolId: "json-to-xml",     label: "JSON → XML",         accepts: ["json"] },
    { toolId: "json-to-typescript", label: "JSON → TypeScript", accepts: ["json"] },
    { toolId: "json-diff",       label: "JSON Diff (left side)", accepts: ["json", "text"] },
    { toolId: "yaml-json-converter", label: "YAML ↔ JSON",   accepts: ["json", "text"] },
    { toolId: "toon-converter",  label: "TOON Converter",     accepts: ["json", "xml", "text"] },
    { toolId: "xml-formatter",   label: "XML Formatter",      accepts: ["xml", "text"] },
    { toolId: "xml-to-json",     label: "XML → JSON",         accepts: ["xml"] },
    { toolId: "xml-diff",        label: "XML Diff (left)",    accepts: ["xml", "text"] },
    { toolId: "text-diff",       label: "Text Diff (left)",   accepts: ["text", "json", "xml", "csv"] },
    { toolId: "base64",          label: "Base64 Encode/Decode", accepts: ["text", "base64"] },
    { toolId: "url-encoder",     label: "URL Encode/Decode",  accepts: ["text", "url"] },
    { toolId: "hash-generator",  label: "Hash Generator",     accepts: ["text"] },
    { toolId: "hmac-generator",  label: "HMAC Generator",     accepts: ["text"] },
    { toolId: "jwt-decoder",     label: "JWT Decoder",        accepts: ["text"] },
    { toolId: "regex-tester",    label: "Regex Tester (input)", accepts: ["text"] },
    { toolId: "case-converter",  label: "Case Converter",     accepts: ["text"] },
    { toolId: "html-entities",   label: "HTML Entities",      accepts: ["text", "html"] },
    { toolId: "html-formatter",  label: "HTML Formatter",     accepts: ["html", "text"] },
    { toolId: "markdown-preview", label: "Markdown Preview",  accepts: ["text"] },
    { toolId: "csv-to-json",     label: "CSV → JSON",         accepts: ["csv", "text"] },
    { toolId: "csv-diff",        label: "CSV Diff (left)",    accepts: ["csv", "text"] },
    { toolId: "mermaid-formatter", label: "Mermaid Formatter", accepts: ["mermaid", "text"] },
    { toolId: "mermaid-viewer",  label: "Mermaid Viewer",     accepts: ["mermaid", "text"] },
    { toolId: "token-counter",   label: "Token Counter",      accepts: ["text", "json"] },
    { toolId: "jsonl-validator", label: "JSONL Validator",    accepts: ["text"] },
    { toolId: "a2a-inspector",   label: "A2A Inspector",      accepts: ["json"] },
    { toolId: "mcp-inspector",   label: "MCP Inspector",      accepts: ["json"] },
];

export function targetsForKind(kind: ToolPayloadKind): BridgeTarget[] {
    return BRIDGE_TARGETS.filter((t) => t.accepts.includes(kind));
}

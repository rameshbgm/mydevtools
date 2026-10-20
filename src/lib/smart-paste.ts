import type { ToolPayloadKind } from "./tool-bridge";

export interface PasteSuggestion { toolId: string; label: string; kind: ToolPayloadKind; reason: string }
export function detectPaste(input: string): PasteSuggestion[] {
    const text = input.trim();
    if (!text) return [];
    if (new TextEncoder().encode(text).length > 256 * 1024) throw new Error("Smart paste supports up to 256 KiB. Open a tool directly for larger data.");
    if (/-----BEGIN (?:CERTIFICATE|PUBLIC KEY|PRIVATE KEY|RSA PRIVATE KEY|CERTIFICATE REQUEST)-----/.test(text)) return [{ toolId: "certificate-inspector", label: "Inspect PEM data", kind: "text", reason: "PEM certificate, key, or request" }];
    if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(text)) return [{ toolId: "jwt-decoder", label: "Inspect JWT", kind: "text", reason: "Three Base64URL sections" }];
    try { JSON.parse(text); return [{ toolId: "json-formatter", label: "Format JSON", kind: "json", reason: "Valid JSON" }, { toolId: "json-to-typescript", label: "Generate TypeScript", kind: "json", reason: "Infer types from this JSON sample" }, { toolId: "json-diff", label: "Compare JSON", kind: "json", reason: "Use this JSON as a comparison baseline" }]; } catch { /* Try other local formats. */ }
    if (/^<[?!A-Za-z]/.test(text)) return [{ toolId: "xml-formatter", label: "Inspect XML", kind: "xml", reason: "XML-like markup" }, { toolId: "xml-to-json", label: "Convert XML to JSON", kind: "xml", reason: "Transform structured markup" }];
    if (/^https?:\/\/\S+$/.test(text)) return [{ toolId: "url-encoder", label: "Encode URL", kind: "url", reason: "HTTP URL" }];
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length > 1 && [",", "\t", ";"].some((separator) => lines.slice(0, 5).every((line) => line.split(separator).length > 1))) return [{ toolId: "csv-to-json", label: "Convert delimited data", kind: "csv", reason: "Multiple delimited rows" }];
    if (text.length >= 8 && /^[A-Za-z0-9+/]+={0,2}$/.test(text) && text.length % 4 === 0) return [{ toolId: "base64", label: "Inspect Base64", kind: "base64", reason: "Looks like Base64; check the decoder result" }];
    return [{ toolId: "text-diff", label: "Compare text", kind: "text", reason: "Use this text as a comparison baseline" }, { toolId: "regex-tester", label: "Extract with regex", kind: "text", reason: "Search this text for patterns" }];
}

import { parseQueryJson } from "./json-number-source";
import { formatJsonText } from "./json-formatting";
import { redactDocument } from "./redaction";
export const WORKFLOW_OPERATIONS = {
    "format-json": "Format JSON", "minify-json": "Minify JSON", "decode-base64": "Decode Base64", "encode-base64": "Encode Base64",
    "decode-url": "Decode URL", "encode-url": "Encode URL", "jsonpath": "Extract JSONPath", "redact": "Redact sensitive fields", "compare": "Compare with fixture", "sha256": "SHA-256 digest",
} as const;
export type WorkflowOperation = keyof typeof WORKFLOW_OPERATIONS;
export interface WorkflowStep { operation: WorkflowOperation; argument: string }
export interface SavedWorkflow { version: 1; id: string; name: string; steps: WorkflowStep[]; fixture?: string; pinned: boolean }
export const WORKFLOW_STORAGE_KEY = "mydevtools-workflows-v1";
export function validateWorkflow(value: unknown): value is SavedWorkflow {
    if (!value || typeof value !== "object") return false;
    const workflow = value as SavedWorkflow;
    return workflow.version === 1 && typeof workflow.id === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(workflow.id) && typeof workflow.name === "string" && workflow.name.length <= 120 &&
        typeof workflow.pinned === "boolean" && (workflow.fixture === undefined || typeof workflow.fixture === "string") && Array.isArray(workflow.steps) && workflow.steps.length > 0 && workflow.steps.length <= 20 &&
        workflow.steps.every((step) => step && Object.hasOwn(WORKFLOW_OPERATIONS, step.operation) && typeof step.argument === "string" && step.argument.length <= 2 * 1024 * 1024);
}
export async function runWorkflow(input: string, steps: WorkflowStep[]) {
    if (!steps.length || steps.length > 20) throw new Error("Choose between 1 and 20 steps.");
    let output = input;
    const results: { operation: WorkflowOperation; output: string }[] = [];
    for (const [index, step] of steps.entries()) {
        if (new TextEncoder().encode(output).length > 2 * 1024 * 1024) throw new Error(`Step ${index + 1}: data exceeds the 2 MiB limit.`);
        try {
            switch (step.operation) {
                case "format-json": output = formatJsonText(output); break;
                case "minify-json": output = formatJsonText(output, true); break;
                case "decode-base64": output = new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(output.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "")), (c) => c.charCodeAt(0))); break;
                case "encode-base64": { const bytes = new TextEncoder().encode(output); let binary = ""; for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192)); output = btoa(binary); break; }
                case "decode-url": output = decodeURIComponent(output); break;
                case "encode-url": output = encodeURIComponent(output); break;
                case "jsonpath": { const { JSONPath } = await import("jsonpath-plus"); output = JSON.stringify(JSONPath({ path: step.argument, json: parseQueryJson(output), eval: false, wrap: true }), null, 2); break; }
                case "redact": output = redactDocument(output, step.argument.split(",")); break;
                case "compare": { const { diffLines } = await import("diff"); output = JSON.stringify(diffLines(step.argument, output), null, 2); break; }
                case "sha256": output = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(output))), (b) => b.toString(16).padStart(2, "0")).join(""); break;
                default: throw new Error("Unsupported workflow step.");
            }
        } catch (cause) { throw new Error(`Step ${index + 1} (${WORKFLOW_OPERATIONS[step.operation]}): ${cause instanceof Error ? cause.message : String(cause)}`); }
        if (new TextEncoder().encode(output).length > 2 * 1024 * 1024) throw new Error(`Step ${index + 1}: output exceeds the 2 MiB limit.`);
        results.push({ operation: step.operation, output });
    }
    return results;
}

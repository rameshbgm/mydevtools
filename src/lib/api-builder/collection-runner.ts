import { parseDocumentJson } from "../document-json";
import { compileSavedRequest, type ApiSavedRequest, type CompiledApiRequest } from "./request-model";
export type ResultSource = "status" | "header" | "json" | "duration";
export interface RunnerCapture { name: string; source: ResultSource; path: string }
export interface RunnerAssertion { source: ResultSource; path: string; operator: "equals" | "contains" | "exists" | "less-than"; expected: string }
export interface CollectionStep { id: string; requestId: string; assertions: RunnerAssertion[]; captures: RunnerCapture[] }
export interface RunnerResponse { status: number; headers: Record<string, string>; body: string; bodyIsBase64?: boolean; size: number; timing: number }
export interface CollectionResult { stepId: string; requestId: string; name: string; iteration: number; passed: boolean; request?: CompiledApiRequest; requestBodyPreview?: boolean; requestBodyBytes?: number; response?: RunnerResponse; error?: string; assertions: { passed: boolean; description: string; actual?: string }[]; captured: string[]; responseOmitted?: boolean }
export interface CollectionRun { results: CollectionResult[]; variables: Record<string, string>; stopped: "finished" | "failure" | "cancelled" | "budget" }
export type CollectionTransport = (request: CompiledApiRequest, signal: AbortSignal) => Promise<RunnerResponse>;
export function pointerValue(value: unknown, pointer: string): unknown {
    if (pointer === "") return value;
    if (!pointer.startsWith("/") || pointer.length > 256) throw new Error("Use a JSON Pointer such as /data/id or /items/0/id.");
    const parts = pointer.slice(1).split("/"); if (parts.length > 32) throw new Error("JSON Pointer exceeds 32 segments.");
    for (const part of parts) {
        if (/~(?![01])/g.test(part)) throw new Error("JSON Pointer has an invalid ~ escape.");
        const key = part.replace(/~1/g, "/").replace(/~0/g, "~");
        if (["__proto__", "constructor", "prototype"].includes(key)) throw new Error("Reserved object keys are not allowed in a JSON Pointer.");
        if (value === null || typeof value !== "object" || !Object.hasOwn(value, key)) return undefined;
        value = (value as Record<string, unknown>)[key];
    }
    return value;
}
function resultValue(source: ResultSource, path: string, response: RunnerResponse, parsed: () => unknown): unknown {
    if (source === "status") return response.status;
    if (source === "duration") return response.timing;
    if (source === "header") return Object.entries(response.headers).find(([key]) => key.toLowerCase() === path.toLowerCase())?.[1];
    if (source === "json") return pointerValue(parsed(), path);
    throw new Error("Choose status, duration, header or JSON for a result value.");
}
function valueText(value: unknown): string { return typeof value === "string" ? value : JSON.stringify(value) ?? "undefined"; }
export function validateCollectionSteps(steps: unknown): asserts steps is CollectionStep[] {
    if (!Array.isArray(steps) || !steps.length || steps.length > 50) throw new Error("A collection needs 1–50 request steps.");
    const ids = new Set();
    for (const step of steps) {
        if (!step || typeof step.id !== "string" || !step.id || step.id.length > 200 || ids.has(step.id) || typeof step.requestId !== "string" || !step.requestId || step.requestId.length > 200 || !Array.isArray(step.assertions) || step.assertions.length > 20 || !Array.isArray(step.captures) || step.captures.length > 20) throw new Error("Invalid collection step or assertion/capture limit.");
        ids.add(step.id);
        for (const rule of [...step.assertions, ...step.captures]) {
            if (!rule || !["status", "duration", "header", "json"].includes(rule.source) || typeof rule.path !== "string" || rule.path.length > 256) throw new Error("Invalid result source or path.");
            if (rule.source === "json") pointerValue({}, rule.path);
        }
        for (const rule of step.assertions) if (!["equals", "contains", "exists", "less-than"].includes(rule.operator) || typeof rule.expected !== "string" || rule.expected.length > 4096) throw new Error("Invalid assertion operator or expected value.");
        for (const rule of step.captures) if (typeof rule.name !== "string" || !/^[a-z_][\w.-]{0,63}$/i.test(rule.name) || ["__proto__", "constructor", "prototype"].includes(rule.name)) throw new Error("Capture variables need a name of 1–64 letters, digits, dots, dashes or underscores.");
    }
}
export async function runCollection(input: { steps: CollectionStep[]; requests: ApiSavedRequest[]; variables: Record<string, string>; iterations: number; stopOnFailure: boolean; transport: CollectionTransport; signal?: AbortSignal; onResult?: (result: CollectionResult) => void }): Promise<CollectionRun> {
    validateCollectionSteps(input.steps);
    if (!Number.isInteger(input.iterations) || input.iterations < 1 || input.iterations > 10 || input.steps.length * input.iterations > 100) throw new Error("Run 1–10 iterations with at most 100 requests in total.");
    if (Object.entries(input.variables).some(([key, value]) => key.length > 128 || typeof value !== "string" || value.length > 16 * 1024) || JSON.stringify(input.variables).length > 64 * 1024) throw new Error("Initial variables exceed their size limit.");
    const requests = new Map(input.requests.map((request) => [request.id, request]));
    if (input.steps.some((step) => !requests.has(step.requestId))) throw new Error("A collection references a missing saved request.");
    const results: CollectionResult[] = [];
    const controller = new AbortController(), signal = input.signal ? AbortSignal.any([input.signal, controller.signal]) : controller.signal;
    const deadline = setTimeout(() => controller.abort(), 180_000);
    let totalBytes = 0, variables: Record<string, string> = Object.create(null);
    try {
        for (let iteration = 1; iteration <= input.iterations; iteration++) {
            variables = Object.assign(Object.create(null), input.variables, { $iteration: String(iteration) });
            for (const step of input.steps) {
                if (signal.aborted) return { results, variables, stopped: input.signal?.aborted ? "cancelled" : "budget" };
                const saved = requests.get(step.requestId)!;
                const result: CollectionResult = { stepId: step.id, requestId: saved.id, name: saved.name, iteration, passed: false, assertions: [], captured: [] };
                try {
                    result.request = await compileSavedRequest(saved, variables);
                    const response = await input.transport(result.request, signal);
                    if (response.size > 2 * 1024 * 1024 || new TextEncoder().encode(response.body).length > 3 * 1024 * 1024) throw new Error("Runner response exceeds 2 MiB of source bytes.");
                    result.response = response;
                    let parsed: unknown, parsedOnce = false;
                    const json = () => { if (response.bodyIsBase64) throw new Error("Binary responses cannot be read as JSON."); if (!parsedOnce) { parsed = parseDocumentJson(response.body.replace(/^\uFEFF/, "")).value; parsedOnce = true; } return parsed; };
                    for (const rule of step.assertions) {
                        const actual = resultValue(rule.source, rule.path, response, json), text = valueText(actual);
                        const passed = rule.operator === "exists" ? actual !== undefined : rule.operator === "equals" ? actual !== undefined && text === rule.expected : rule.operator === "contains" ? actual !== undefined && text.includes(rule.expected) : typeof actual === "number" && Number.isFinite(Number(rule.expected)) && actual < Number(rule.expected);
                        result.assertions.push({ passed, description: `${rule.source}${rule.path ? ` ${rule.path}` : ""} ${rule.operator}${rule.operator !== "exists" ? ` ${rule.expected}` : ""}`, actual: text.slice(0, 4096) });
                    }
                    const captured: Record<string, string> = Object.create(null);
                    for (const rule of step.captures) {
                        const actual = resultValue(rule.source, rule.path, response, json); if (actual === undefined) throw new Error(`Capture ${rule.name} did not find a result value.`);
                        const value = valueText(actual); if (value.length > 16 * 1024) throw new Error(`Capture ${rule.name} exceeds 16 KiB.`); captured[rule.name] = value;
                    }
                    if (JSON.stringify({ ...variables, ...captured }).length > 64 * 1024) throw new Error("Captured variables exceed the 64 KiB total limit.");
                    Object.assign(variables, captured); result.captured = Object.keys(captured);
                    result.passed = result.assertions.every((rule) => rule.passed) && (response.status >= 200 && response.status < 400 || step.assertions.some((rule) => rule.source === "status" && rule.operator === "equals" && Number(rule.expected) === response.status));
                    if (!result.passed && !result.assertions.some((rule) => !rule.passed)) result.error = `HTTP ${response.status}.`;
                } catch (cause) { result.error = signal.aborted ? "Cancelled or collection time budget exceeded." : cause instanceof Error ? cause.message : "Request failed."; }
                if (result.request?.body && result.request.body.length > 16 * 1024) {
                    result.requestBodyBytes = new TextEncoder().encode(result.request.body).length;
                    result.request = { ...result.request, body: result.request.body.slice(0, 16 * 1024) + "\n[Request body preview truncated]" }; result.requestBodyPreview = true;
                }
                const resultBytes = new TextEncoder().encode(JSON.stringify(result)).length;
                if (totalBytes + resultBytes > 8 * 1024 * 1024 - 128 * 1024) {
                    delete result.response; delete result.request; result.assertions = []; result.captured = [];
                    result.responseOmitted = true; result.passed = false; result.error = "Collection results exceed 8 MiB.";
                    results.push(result); input.onResult?.(result); return { results, variables, stopped: "budget" };
                }
                totalBytes += resultBytes;
                results.push(result); input.onResult?.(result);
                if (signal.aborted) return { results, variables, stopped: input.signal?.aborted ? "cancelled" : "budget" };
                if (!result.passed && input.stopOnFailure) return { results, variables, stopped: "failure" };
            }
        }
        return { results, variables, stopped: "finished" };
    } finally { clearTimeout(deadline); }
}

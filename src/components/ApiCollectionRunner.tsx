"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { Select } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined, PlayCircleOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import { projectStorage } from "@/lib/project-storage";
import { downloadText } from "@/lib/download";
import { connectorRequest } from "@/lib/local-connector-client";
import { parseJsonResponse, type ProxyResponsePayload } from "@/lib/certificate-fetch-response";
import { runCollection, validateCollectionSteps, type CollectionResult, type CollectionRun, type CollectionStep, type ResultSource, type RunnerAssertion, type RunnerCapture } from "@/lib/api-builder/collection-runner";
import type { ApiSavedRequest } from "@/lib/api-builder/request-model";

const KEY = "api-builder-runner-plan-v1";
const errorText = (cause: unknown, source = "The collection could not run.") => ({ source, detail: cause instanceof Error ? cause.message : undefined });

export default function ApiCollectionRunner({ requests, variables, environmentName }: { requests: ApiSavedRequest[]; variables: Record<string, string>; environmentName: string }) {
    const { t } = useLanguage();
    const sources: { value: ResultSource; label: string }[] = [{ value: "status", label: t("HTTP status") }, { value: "header", label: t("Response header") }, { value: "json", label: t("JSON Pointer") }, { value: "duration", label: t("Duration (ms)") }];
    const operators = [{ value: "equals", label: t("Equals") }, { value: "contains", label: t("Contains") }, { value: "exists", label: t("Exists") }, { value: "less-than", label: t("Less than") }];

    const [steps, setSteps] = useState<CollectionStep[]>([]), [iterations, setIterations] = useState(1), [stopOnFailure, setStopOnFailure] = useState(true);
    const [transport, setTransport] = useState("managed"), [results, setResults] = useState<CollectionResult[]>([]), [run, setRun] = useState<CollectionRun | null>(null);
    const [busy, setBusy] = useState(false), [error, setError] = useState<{ source: string; detail?: string } | null>(null), [notice, setNotice] = useState("");
    const abort = useRef<AbortController | null>(null), alive = useRef(true), generation = useRef(0);
    useEffect(() => {
        alive.current = true;
        try { const raw = projectStorage.getItem(KEY); if (raw) { const plan = JSON.parse(raw); validateCollectionSteps(plan.steps); if (!Number.isInteger(plan.iterations) || plan.iterations < 1 || plan.iterations > 10) throw new Error("Invalid saved iteration count."); setSteps(plan.steps); setIterations(plan.iterations); setStopOnFailure(plan.stopOnFailure !== false); } }
        catch (cause) { setError(errorText(cause, "Saved plan could not be loaded.")); }
        const lock = () => { generation.current++; abort.current?.abort(); setResults([]); setRun(null); };
        window.addEventListener("mydevtools-project-lock", lock);
        return () => { alive.current = false; abort.current?.abort(); window.removeEventListener("mydevtools-project-lock", lock); };
    }, []);
    const update = (id: string, patch: Partial<CollectionStep>) => setSteps((rows) => rows.map((step) => step.id === id ? { ...step, ...patch } : step));
    const move = (index: number, direction: number) => setSteps((rows) => { const next = [...rows]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; return next; });
    const save = () => { try { validateCollectionSteps(steps); projectStorage.setItem(KEY, JSON.stringify({ steps, iterations, stopOnFailure })); setNotice("Plan saved in this project. Requests and environment values are managed in the HTTP client."); setError(null); } catch (cause) { setError(errorText(cause)); } };
    const start = async () => {
        if (abort.current) return;
        const controller = new AbortController(), epoch = generation.current; abort.current = controller; setBusy(true); setError(null); setNotice(""); setResults([]); setRun(null);
        try {
            const next = await runCollection({ steps, requests, variables, iterations, stopOnFailure, signal: controller.signal,
                onResult: (result) => { if (alive.current && epoch === generation.current && !controller.signal.aborted) setResults((rows) => [...rows, result]); },
                transport: async (request, signal) => {
                    if (transport === "native") return connectorRequest({ service: "request", ...request }, signal);
                    const response = await fetch("/api/proxy", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", cache: "no-store", body: JSON.stringify({ ...request, sslVerify: true }), signal });
                    const value = await parseJsonResponse<ProxyResponsePayload>(response, "Managed HTTP proxy");
                    if (value.headers["x-mydevtools-truncated"]) throw new Error("The proxy truncated this response.");
                    return value;
                },
            });
            if (alive.current && epoch === generation.current) { setRun(next); setResults(next.results); }
        } catch (cause) { if (alive.current && epoch === generation.current) setError(errorText(cause)); }
        finally { abort.current = null; if (alive.current) setBusy(false); }
    };
    const pathField = (rule: RunnerAssertion | RunnerCapture, change: (patch: Partial<RunnerAssertion & RunnerCapture>) => void, label: string) => <>
        <label>{t("Read from")}<Select aria-label={t("{rule} source", { rule: label })} value={rule.source} options={sources} disabled={busy} onChange={(source) => change({ source, path: "" })} /></label>
        {(rule.source === "json" || rule.source === "header") && <label>{t(rule.source === "json" ? "JSON Pointer" : "Header name")}<input dir="ltr" aria-label={t("{rule} path", { rule: label })} value={rule.path} maxLength={256} placeholder={rule.source === "json" ? "/data/id" : "content-type"} disabled={busy} onChange={(event) => change({ path: event.target.value })} /></label>}
    </>;
    return <div className="wb-workbench wb-api-extension-panel">
        <p>{t("Run saved HTTP requests in order. Capture a response value as a variable for later steps, and check status, headers, JSON or timing. Environment:")} <strong dir="auto">{environmentName}</strong>.</p>
        <div className="wb-api-run-settings"><label>{t("Transport")}<Select aria-label={t("Collection transport")} value={transport} disabled={busy} onChange={setTransport} options={[{ value: "managed", label: t("Managed proxy \u00b7 public endpoints") }, { value: "native", label: t("Local connector \u00b7 private / localhost") }]} /></label><label>{t("Iterations")}<input dir="ltr" type="number" min={1} max={10} value={iterations} disabled={busy} onChange={(event) => setIterations(Number(event.target.value))} /></label><label className="wb-checkbox"><input type="checkbox" checked={stopOnFailure} disabled={busy} onChange={(event) => setStopOnFailure(event.target.checked)} />{t("Stop on failure")}</label></div>
        <p className="wb-api-help">{t("Each iteration starts with the active environment; captures last for that iteration. Use {iteration} for its number. TLS certificates are verified. Limits: 50 steps, 100 requests, 15 seconds per request, 3 minutes per run, 2 MiB per response and 8 MiB of results.", { iteration: "{{$iteration}}" })} {t("Imported test scripts are not executed by the runner.")}</p>
        {!requests.length && <p role="status">{t("Save a request in the HTTP client above, or import a Postman collection, to add the first step.")}</p>}
        <ol className="wb-api-steps">{steps.map((step, index) => {
            const assertion = (ruleIndex: number, patch: Partial<RunnerAssertion>) => update(step.id, { assertions: step.assertions.map((rule, i) => i === ruleIndex ? { ...rule, ...patch } : rule) });
            const capture = (ruleIndex: number, patch: Partial<RunnerCapture>) => update(step.id, { captures: step.captures.map((rule, i) => i === ruleIndex ? { ...rule, ...patch } : rule) });
            return <li key={step.id}>
                <div className="wb-api-step-toolbar"><label>{t("Step {step}", { step: index + 1 })}<Select aria-label={t("Request for step {step}", { step: index + 1 })} value={step.requestId} showSearch optionFilterProp="label" disabled={busy} onChange={(requestId) => update(step.id, { requestId })} options={requests.map((request) => ({ value: request.id, label: request.method + " · " + request.name }))} /></label><div className="wb-workbench-actions"><button type="button" aria-label={t("Move step {step} up", { step: index + 1 })} disabled={busy || index === 0} onClick={() => move(index, -1)}><ArrowUpOutlined />{t("Up")}</button><button type="button" aria-label={t("Move step {step} down", { step: index + 1 })} disabled={busy || index === steps.length - 1} onClick={() => move(index, 1)}><ArrowDownOutlined />{t("Down")}</button><button type="button" aria-label={t("Remove step {step}", { step: index + 1 })} disabled={busy} onClick={() => setSteps(steps.filter((row) => row.id !== step.id))}><DeleteOutlined />{t("Remove")}</button></div></div>
                <details><summary>{t("Assertions ({assertions}) and captures ({captures})", { assertions: step.assertions.length, captures: step.captures.length })}</summary><div className="wb-api-rules">
                    <h4>{t("Assertions")}</h4>{step.assertions.map((rule, i) => <div className="wb-api-rule" key={i}>{pathField(rule, (patch) => assertion(i, patch), t("Assertion {rule} step {step}", { rule: i + 1, step: index + 1 }))}<label>{t("Check")}<Select aria-label={t("Assertion {rule} operator step {step}", { rule: i + 1, step: index + 1 })} value={rule.operator} disabled={busy} options={operators} onChange={(operator) => assertion(i, { operator })} /></label>{rule.operator !== "exists" && <label>{t("Expected")}<input dir="ltr" value={rule.expected} maxLength={4096} disabled={busy} onChange={(event) => assertion(i, { expected: event.target.value })} /></label>}<button type="button" disabled={busy} aria-label={t("Remove assertion {rule} step {step}", { rule: i + 1, step: index + 1 })} onClick={() => update(step.id, { assertions: step.assertions.filter((_, n) => n !== i) })}><DeleteOutlined />{t("Remove")}</button></div>)}
                    <button type="button" disabled={busy || step.assertions.length >= 20} onClick={() => update(step.id, { assertions: [...step.assertions, { source: "status", path: "", operator: "equals", expected: "200" }] })}><PlusOutlined />{t("Add assertion")}</button>
                    <h4>{t("Capture variables")}</h4>{step.captures.map((rule, i) => <div className="wb-api-rule" key={i}>{pathField(rule, (patch) => capture(i, patch), t("Capture {rule} step {step}", { rule: i + 1, step: index + 1 }))}<label>{t("Variable name")}<input dir="ltr" value={rule.name} maxLength={64} placeholder="token" disabled={busy} onChange={(event) => capture(i, { name: event.target.value })} /></label><button type="button" disabled={busy} aria-label={t("Remove capture {rule} step {step}", { rule: i + 1, step: index + 1 })} onClick={() => update(step.id, { captures: step.captures.filter((_, n) => n !== i) })}><DeleteOutlined />{t("Remove")}</button></div>)}
                    <button type="button" disabled={busy || step.captures.length >= 20} onClick={() => update(step.id, { captures: [...step.captures, { source: "json", path: "/id", name: "id" }] })}><PlusOutlined />{t("Add capture")}</button>
                </div></details>
            </li>;
        })}</ol>
        <div className="wb-workbench-actions"><button type="button" disabled={busy || !requests.length || steps.length >= 50} onClick={() => setSteps([...steps, { id: crypto.randomUUID(), requestId: requests[0].id, assertions: [], captures: [] }])}><PlusOutlined />{t("Add request step")}</button><button type="button" disabled={busy || !steps.length} onClick={save}><SaveOutlined />{t("Save plan")}</button><button type="button" disabled={busy || !steps.length} onClick={() => void start()}><PlayCircleOutlined />{t(busy ? "Running…" : "Run collection")}</button><button type="button" disabled={!busy} onClick={() => abort.current?.abort()}><StopOutlined />{t("Cancel run")}</button></div>
        {error && <p role="alert">{t(error.source)}{error.detail && <> <bdi dir="auto">{["Invalid saved iteration count.", "The proxy truncated this response."].includes(error.detail) ? t(error.detail) : error.detail}</bdi></>}</p>}{notice && <p role="status">{t(notice)}</p>}
        {(busy || run) && <p role="status">{busy ? t("Running") : t("Run {state}", { state: t({ finished: "Finished", failure: "Stopped on failure", cancelled: "Cancelled", budget: "Limit reached" }[run!.stopped]) })} · {t("Completed: {count}", { count: results.length })} · {t("Passed: {count}", { count: results.filter((result) => result.passed).length })}</p>}
        {!!results.length && <><div className="wb-api-result-heading"><h3>{t("Collection results")}</h3><button type="button" disabled={busy} onClick={() => downloadText(JSON.stringify(run ?? { results }, null, 2), "collection-results.json", "application/json")}><DownloadOutlined />{t("Export results")}</button></div><p className="wb-api-help">{t("Results stay in page memory and can include credentials and response data. Export only to a trusted destination.")}</p><ol className="wb-api-results">{results.map((result, i) => <li key={i}><details><summary>{t(result.passed ? "Passed" : "Failed")} · {t("Iteration {iteration}", { iteration: result.iteration })} · <bdi dir="auto">{result.name}</bdi>{result.response && <> · <bdi dir="ltr">HTTP {result.response.status} · {result.response.timing} ms</bdi></>}</summary>{result.error && <p role="alert">{t("Request error:")} <bdi dir="auto">{result.error === "The proxy truncated this response." ? t(result.error) : result.error}</bdi></p>}{result.assertions.map((rule, n) => <p key={n}>{t(rule.passed ? "Passed" : "Failed")}: <bdi dir="ltr">{rule.description}</bdi>{rule.actual !== undefined && <> · {t("Actual:")} <bdi dir="ltr">{rule.actual}</bdi></>}</p>)}{!!result.captured.length && <p>{t("Captured:")} <bdi dir="ltr">{result.captured.join(", ")}</bdi></p>}<pre dir="ltr" tabIndex={0}>{JSON.stringify(result.response ?? result, null, 2).slice(0, 16384)}{JSON.stringify(result.response ?? result).length > 16384 ? "\n" + t("[Preview truncated; export for full results]") : ""}</pre></details></li>)}</ol></>}
    </div>;
}

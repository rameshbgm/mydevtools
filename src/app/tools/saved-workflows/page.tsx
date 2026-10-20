"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { projectStorage } from "@/lib/project-storage";
import { useEffect, useState } from "react";
import { ApartmentOutlined } from "@ant-design/icons";
import { Select } from "antd";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import SendToButton from "@/components/SendToButton";
import { WORKFLOW_OPERATIONS, WORKFLOW_STORAGE_KEY, runWorkflow, validateWorkflow, type WorkflowStep, type SavedWorkflow, type WorkflowOperation } from "@/lib/workflow-engine";
import { localizeWorkflowDiagnostic } from "@/lib/i18n/workspace-tools";
import { redactDocument } from "@/lib/redaction";
const DRAFT_KEY = "mydevtools-workflow-draft-v1";
export default function SavedWorkflowsPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState('{"hello":"world"}'); const [name, setName] = useState("My workflow");
    const [steps, setSteps] = useState<WorkflowStep[]>([{ operation: "format-json", argument: "" }]);
    const [saved, setSaved] = useState<SavedWorkflow[]>([]); const [id, setId] = useState(""); const [pinned, setPinned] = useState(false);
    const [saveFixture, setSaveFixture] = useState(false); const [rememberDraft, setRememberDraft] = useState(false);
    const [results, setResults] = useState<Awaited<ReturnType<typeof runWorkflow>>>([]); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
    useEffect(() => {
        try {
            const rows = JSON.parse(projectStorage.getItem(WORKFLOW_STORAGE_KEY) ?? "[]");
            if (Array.isArray(rows)) setSaved(rows.filter(validateWorkflow));
            const draft = projectStorage.getItem(DRAFT_KEY);
            if (draft) { setInput(draft); setRememberDraft(true); }
        } catch { setError("Saved data could not be read. Export or clear it from browser storage before retrying."); }
    }, []);
    useEffect(() => {
        try { if (rememberDraft) projectStorage.setItem(DRAFT_KEY, input); else projectStorage.removeItem(DRAFT_KEY); }
        catch { setError("This browser cannot save the draft. Check storage permissions or available space."); }
    }, [input, rememberDraft]);
    const load = (workflow: SavedWorkflow) => { setName(workflow.name); setSteps(workflow.steps); setId(workflow.id); setPinned(workflow.pinned); setSaveFixture(workflow.fixture !== undefined); if (workflow.fixture !== undefined) setInput(workflow.fixture); setResults([]); };
    useEffect(() => { const found = saved.find((workflow) => workflow.id === window.location.hash.slice(1)); if (found && !id) load(found); }, [saved, id]);
    const persist = (rows: SavedWorkflow[]) => { projectStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(rows)); setSaved(rows); window.dispatchEvent(new Event("mydevtools-workflows-changed")); };
    const save = () => {
        try {
            if (!name.trim()) throw new Error("Name this workflow before saving.");
            const workflow: SavedWorkflow = { version: 1, id: id || crypto.randomUUID(), name: name.trim(), steps: steps.map((step) => step.operation === "compare" ? { ...step, argument: redactDocument(step.argument) } : step), pinned, ...(saveFixture ? { fixture: redactDocument(input) } : {}) };
            if (!validateWorkflow(workflow)) throw new Error("A workflow needs a name and 1–20 supported steps.");
            if (saved.length >= 50 && !saved.some((item) => item.id === workflow.id)) throw new Error("Saved workflow limit is 50. Remove an unused workflow first.");
            persist([...saved.filter((item) => item.id !== workflow.id), workflow]); setId(workflow.id); setError("");
        } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
    };
    const output = results.at(-1)?.output ?? "";
    return <ToolPageLayout title="Saved Workflows" description={t("Chain local developer tools and save repeatable steps, settings, and optional redacted fixtures")} icon={<ApartmentOutlined />} color="#08979c"><div className="wb-workbench wb-workflows">
        <ToolBridgeBanner accepts={["text", "json", "xml", "csv", "base64", "url"]} onAccept={(payload) => setInput(payload.data)} />
        <div className="wb-workflow-toolbar">
            <label htmlFor="saved-workflow">{t("Saved workflows")}<Select id="saved-workflow" aria-label={t("Saved workflows")} value={id} options={[{ value: "", label: t("New workflow") }, ...saved.map((workflow) => ({ value: workflow.id, label: `${workflow.pinned ? `${t("Pinned")} · ` : ""}${workflow.name}` }))]} showSearch={{ optionFilterProp: "label" }} popupMatchSelectWidth styles={{ placeholder: { color: "var(--wb-text-muted)" } }} classNames={{ popup: { root: "wb-workflow-popup" } }} onChange={(value) => { const found = saved.find((workflow) => workflow.id === value); if (found) load(found); else { setId(""); setName("My workflow"); setPinned(false); } }} /></label>
            <label>{t("Workflow name")}<input dir="auto" maxLength={120} value={name} onChange={(event) => setName(event.target.value)} /></label>
        </div>
        <ol className="wb-workflow-step-list">{steps.map((step, index) => <li key={index}><div className="wb-workflow-step-row">
            <label htmlFor={`workflow-operation-${index}`}>{t("Step {number}", { number: index + 1 })}<Select id={`workflow-operation-${index}`} aria-label={t("Step {number} operation", { number: index + 1 })} value={step.operation} options={Object.entries(WORKFLOW_OPERATIONS).map(([value, label]) => ({ value, label: t(label) }))} showSearch={{ optionFilterProp: "label" }} popupMatchSelectWidth styles={{ placeholder: { color: "var(--wb-text-muted)" } }} classNames={{ popup: { root: "wb-workflow-popup" } }} onChange={(value) => setSteps(steps.map((item, i) => i === index ? { ...item, operation: value as WorkflowOperation } : item))} /></label>
            <button type="button" disabled={index === 0} onClick={() => { const next = [...steps]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; setSteps(next); }}>{t("Move up")}</button><button type="button" disabled={steps.length === 1} onClick={() => setSteps(steps.filter((_, i) => i !== index))}>{t("Remove step {number}", { number: index + 1 })}</button></div>
            {["jsonpath", "redact", "compare"].includes(step.operation) && <label>{step.operation === "jsonpath" ? t("JSONPath expression") : step.operation === "redact" ? t("Additional field names, separated by commas") : t("Comparison fixture")}<textarea dir="ltr" rows={2} value={step.argument} onChange={(event) => setSteps(steps.map((item, i) => i === index ? { ...item, argument: event.target.value } : item))} /></label>}
            </li>)}</ol>
        <button disabled={steps.length >= 20} onClick={() => setSteps([...steps, { operation: "format-json", argument: "" }])}>{t("Add step")}</button>
        <label>{t("Input")}<textarea dir="ltr" rows={10} value={input} onChange={(event) => setInput(event.target.value)} /></label>
        <label className="wb-checkbox"><input type="checkbox" checked={rememberDraft} onChange={(event) => setRememberDraft(event.target.checked)} />{t("Remember input on this device · turn off to clear the draft")}</label>
        <label className="wb-checkbox"><input type="checkbox" checked={saveFixture} onChange={(event) => setSaveFixture(event.target.checked)} />{t("Include a redacted input fixture when saving")}</label>
        <label className="wb-checkbox"><input type="checkbox" checked={pinned} onChange={(event) => setPinned(event.target.checked)} />{t("Pin in my workspace")}</label>
        <div className="wb-workbench-actions"><button disabled={busy} onClick={async () => { setBusy(true); setError(""); setResults([]); try { setResults(await runWorkflow(input, steps)); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } finally { setBusy(false); } }}>{busy ? t("Running…") : t("Run workflow")}</button><button onClick={save}>{t("Save workflow")}</button><button disabled={!id} onClick={() => { try { persist(saved.filter((workflow) => workflow.id !== id)); setId(""); setError(""); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } }}>{t("Delete saved workflow")}</button></div>
        <label>{t("Import a workflow JSON file")}<input type="file" accept=".json" onChange={async (event) => { try { const file = event.target.files?.[0]; if (!file) return; if (file.size > 1024 * 1024) throw new Error("Workflow file limit is 1 MiB."); const value = JSON.parse(await file.text()); if (!validateWorkflow(value)) throw new Error("Invalid workflow file or unsupported version."); load({ ...value, id: "imported-" + crypto.randomUUID() }); setError(""); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } }} /></label>
        <button onClick={() => { const workflow = { version: 1, id: id || crypto.randomUUID(), name, steps: steps.map((step) => step.operation === "compare" ? { ...step, argument: redactDocument(step.argument) } : step), pinned, ...(saveFixture ? { fixture: redactDocument(input) } : {}) }; const url = URL.createObjectURL(new Blob([redactDocument(JSON.stringify(workflow))], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = "workflow.json"; link.click(); URL.revokeObjectURL(url); }}>{t("Export redacted workflow")}</button>
        {error && <p role="alert">{t("Review the settings and saved data, then try again.")} {localizeWorkflowDiagnostic(error, t)}</p>}{results.map((result, index) => <details key={index} open={index === results.length - 1}><summary>{t("Step {number}: {operation}", { number: index + 1, operation: t(WORKFLOW_OPERATIONS[result.operation]) })}</summary><pre dir="ltr" tabIndex={0}>{result.output}</pre></details>)}
        {output && <SendToButton data={output} kind="text" sourceToolId="saved-workflows" />}
        <p>{t("Steps run locally. Saved workflows stay on this device. Fixture redaction is a best effort; review exported data and comparison fixtures before sharing.")}</p>
    </div></ToolPageLayout>;
}

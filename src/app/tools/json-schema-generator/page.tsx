"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { FileProtectOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import SendToButton from "@/components/SendToButton";
import { CodeEditor } from "@/components/CodeEditor";
import { inferSchema } from "@/lib/schema-inference";
import { MODEL_TARGETS, type ModelTarget, type GeneratedModelFile } from "@/lib/model-generation";
import { downloadText, downloadBlob } from "@/lib/download";
import { copyToClipboard } from "@/lib/clipboard";
const SAMPLE = '{"id":1,"name":"Example","active":true,"address":{"city":"Singapore"},"tags":["developer"]}';
export default function JsonSchemaGeneratorPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState(SAMPLE), [name, setName] = useState("ExampleModel"), [multiple, setMultiple] = useState(false), [closed, setClosed] = useState(false);
    const [target, setTarget] = useState<ModelTarget>("python"), [schema, setSchema] = useState(""), [code, setCode] = useState(""), [codeTarget, setCodeTarget] = useState<ModelTarget>("python");
    const [files, setFiles] = useState<GeneratedModelFile[]>([]), [fileIndex, setFileIndex] = useState(0);
    const [error, setError] = useState(""), [busy, setBusy] = useState(false);
    const worker = useRef<Worker | null>(null), timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => { worker.current?.terminate(); if (timeout.current) clearTimeout(timeout.current); }, []);
    const generateCode = () => {
        if (worker.current) return;
        setBusy(true); setError(""); setCode(""); setFiles([]);
        const finish = () => { worker.current?.terminate(); worker.current = null; if (timeout.current) clearTimeout(timeout.current); timeout.current = null; setBusy(false); };
        try {
            if (multiple) throw new Error("Model generation treats the input as one JSON document. Turn off multiple samples, or generate a schema first and refine it separately.");
            if (input.length > 2 * 1024 * 1024) throw new Error("Model input limit is 2 MiB.");
            worker.current = new Worker(new URL("../../../workers/model-generation.worker.ts", import.meta.url), { type: "module" });
            timeout.current = setTimeout(() => { finish(); setError("Model generation exceeded 20 seconds. Use a smaller representative sample."); }, 20_000);
            worker.current.onmessage = (event) => { if (event.data.error) setError(event.data.error); else { setFiles(event.data.files); setFileIndex(0); setCode(event.data.files[0].content); setCodeTarget(target); } finish(); };
            worker.current.onerror = () => { finish(); setError("The model generator could not start. Reload the page or try a smaller input."); };
            worker.current.postMessage({ input, target, name });
        } catch (cause) { finish(); setError(cause instanceof Error ? cause.message : String(cause)); }
    };
    return <ToolPageLayout title="JSON Schema & Model Generator" description="Infer Draft 2020-12 schemas and generate typed models for nine languages from sample JSON" icon={<FileProtectOutlined />} color="#08979c"><div className="wb-workbench wb-schema-generator">
        <ToolBridgeBanner accepts={["json", "text"]} onAccept={(payload) => { setInput(payload.data); setSchema(""); setCode(""); }} />
        <label>{t("Type or schema title")}<input dir="ltr" value={name} maxLength={80} disabled={busy} onChange={(event) => setName(event.target.value)} /></label><div aria-label={t("Sample JSON editor")}><CodeEditor ariaLabel={t("Sample JSON editor")} value={input} onChange={setInput} language="json" height={280} readOnly={busy} /></div>
        <section className="wb-workbench"><h2>{t("Infer JSON Schema")}</h2><label className="wb-checkbox"><input type="checkbox" checked={multiple} disabled={busy} onChange={(event) => setMultiple(event.target.checked)} />{t("Treat the top-level array as separate example documents")}</label><label className="wb-checkbox"><input type="checkbox" checked={closed} disabled={busy} onChange={(event) => setClosed(event.target.checked)} />{t("Reject unobserved object properties (additionalProperties: false)")}</label><button disabled={busy} onClick={() => { try { setSchema(JSON.stringify(inferSchema(input, { multipleSamples: multiple, closedObjects: closed, title: name }), null, 2)); setError(""); } catch (cause) { setSchema(""); setError(cause instanceof Error ? cause.message : String(cause)); } }}>{t("Infer schema")}</button>{schema && <><CodeEditor ariaLabel={t("Generated schema editor")} value={schema} language="json" height={340} readOnly /><div className="wb-workbench-actions"><button onClick={() => void copyToClipboard(schema)}>{t("Copy schema")}</button><button onClick={() => downloadText(schema, "schema.json", "application/schema+json")}>{t("Download schema")}</button><SendToButton data={schema} kind="json" sourceToolId="json-schema-generator" /></div></>}{!schema && <p>{t("Generate a schema to inspect or download it here.")}</p>}<p>{t("Integer and number types are classified from the original JSON tokens, including values beyond JavaScript numeric precision.")}</p><p>{t("Required properties are the intersection across observed objects. Empty arrays leave item types open. Samples cannot establish every allowed type, constraint, format or optional field; review the schema before using it as a contract.")}</p></section>
        <section className="wb-workbench" id="models"><h2>{t("Generate typed models")}</h2><label>{t("Model language")}<select dir="ltr" value={target} disabled={busy} onChange={(event) => setTarget(event.target.value as ModelTarget)}>{Object.entries(MODEL_TARGETS).map(([value, item]) => <option key={value} value={value}>{item.name}</option>)}</select></label><button disabled={busy} onClick={generateCode}>{t(busy ? "Generating models…" : "Generate models")}</button>{code && <><label>{t("Generated file")}<select dir="ltr" value={fileIndex} onChange={(event) => { const index = Number(event.target.value); setFileIndex(index); setCode(files[index].content); }}>{files.map((file, index) => <option key={file.filename} value={index}>{file.filename}</option>)}</select></label><CodeEditor ariaLabel={t("Generated model editor")} value={code} language={MODEL_TARGETS[codeTarget].editor} height={440} readOnly /><div className="wb-workbench-actions"><button onClick={() => void copyToClipboard(code)}>{t("Copy generated code")}</button><button onClick={() => downloadText(code, files[fileIndex].filename)}>{t("Download selected file")}</button><button onClick={async () => { try { const { default: JSZip } = await import("jszip"); const zip = new JSZip(); files.forEach((file) => zip.file(file.filename, file.content)); downloadBlob(await zip.generateAsync({ type: "blob" }), "generated-models.zip"); } catch (cause) { setError(String(cause)); } }}>{t("Download all files as ZIP")}</button></div></>}{!code && <p>{t("Generate models to inspect individual files and export them here.")}</p>}<p>{t("Models are inferred with quicktype in a local worker. Output may require the language libraries named in its comments. Review nullable fields, numeric precision, date handling and naming before using it in a project.")}</p></section>
        {error && <div role="alert"><p>{t("Generation failed. Check the JSON, use a smaller representative sample and verify the type name.")}</p><p dir="auto">{t(error)}</p></div>}
    </div></ToolPageLayout>;
}

"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import { ApartmentOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { generateTraceParent, inspectTraceParent, inspectTraceState } from "@/lib/trace-context";
export default function TraceContextPage() {
    const { t } = useLanguage();

    const [parent, setParent] = useState("00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01");
    const [state, setState] = useState("vendor=opaque-value");
    const [result, setResult] = useState(""); const [error, setError] = useState("");
    const inspect = () => { try { setResult(JSON.stringify({ traceparent: inspectTraceParent(parent), tracestate: inspectTraceState(state) }, null, 2)); setError(""); } catch (cause) { setResult(""); setError(String(cause instanceof Error ? cause.message : cause)); } };
    return <ToolPageLayout title={t("Trace Context Inspector")} description={t("Inspect and generate W3C distributed tracing headers locally")} icon={<ApartmentOutlined />} color="#722ed1"><div className="wb-workbench">
        <label>traceparent<input dir="ltr" style={{ fontSize: 16 }} value={parent} onChange={(event) => { setParent(event.target.value); setResult(""); setError(""); }} spellCheck={false} /></label>
        <label>tracestate<input dir="ltr" style={{ fontSize: 16 }} value={state} onChange={(event) => { setState(event.target.value); setResult(""); setError(""); }} spellCheck={false} /></label>
        <div className="wb-workbench-actions"><button onClick={inspect}>{t("Inspect headers")}</button><button onClick={() => { setParent(generateTraceParent()); setResult(""); setError(""); }}>{t("Generate sampled trace")}</button></div>
        {error && <p role="alert">{error.startsWith("Invalid or duplicate tracestate entry: ") ? t("Invalid or duplicate tracestate entry: {entry}", { entry: error.slice(39) }) : t(error)}</p>}{result && <pre dir="ltr" tabIndex={0} aria-label={t("Trace inspection result")}>{result}</pre>}
        <p>{t("Trace IDs correlate a distributed request; parent IDs identify a span. Sampling is the least significant trace-flags bit.")}{" "}<a href="https://www.w3.org/TR/trace-context/" target="_blank" rel="noreferrer">{t("W3C reference")}</a></p>
    </div></ToolPageLayout>;
}

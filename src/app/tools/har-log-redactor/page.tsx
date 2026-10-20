"use client";
import { useState } from "react";
import { SafetyOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { redactDocument } from "@/lib/redaction";

export default function RedactorPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState('{"request":{"headers":[{"name":"Authorization","value":"Bearer example-secret"}]},"email":"person@example.com"}');
    const [fields, setFields] = useState("email");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const preview = () => { setError(""); setOutput(redactDocument(input, fields.split(","))); };
    const download = () => {
        const url = URL.createObjectURL(new Blob([output], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a"); link.href = url; link.download = "redacted.txt"; link.click(); URL.revokeObjectURL(url);
    };
    return <ToolPageLayout title={t("HAR & Log Redactor")} description={t("Preview and remove credential fields from HAR, JSON, and plain-text logs locally")} icon={<SafetyOutlined />} color="#08979c">
        <div className="wb-workbench">
            <label>{t("Additional field names, separated by commas")}<input dir="ltr" value={fields} onChange={(event) => { setFields(event.target.value); setOutput(""); }} /></label>
            <label>{t("Load a local HAR, JSON, or text file")}<input type="file" accept=".har,.json,.txt,.log" onChange={async (event) => {
                const file = event.target.files?.[0]; if (!file) return;
                if (file.size > 5 * 1024 * 1024) { setError("Choose a file smaller than 5 MiB."); return; }
                setInput(await file.text()); setOutput(""); setError("");
            }} /></label>
            <div className="tool-split-pane"><label>{t("Original data")}<textarea dir="ltr" rows={16} value={input} onChange={(event) => { setInput(event.target.value); setOutput(""); }} /></label><label>{t("Redacted preview")}<textarea rows={16} readOnly value={output} placeholder={t("Choose Preview redaction")} /></label></div>
            <div className="wb-workbench-actions"><button onClick={preview}>{t("Preview redaction")}</button><button disabled={!output} onClick={download}>{t("Download redacted data")}</button></div>
            {error && <p role="alert">{t(error)}</p>}
            <p role="status">{t("Review the preview before sharing. Custom identifiers and sensitive free text may need additional redaction. Nothing is uploaded.")}</p>
        </div>
    </ToolPageLayout>;
}

"use client";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function HtmlMarkdownConverter({ onConverted }: { onConverted: (markdown: string) => void }) {
    const { t } = useLanguage();
    const [html, setHtml] = useState("<h1>Example</h1><p>Convert <strong>HTML</strong> into Markdown.</p>");
    const [error, setError] = useState(""), [busy, setBusy] = useState(false), [converted, setConverted] = useState(false);
    const failure = "HTML could not be loaded or converted. Check the source and 1 MiB limit, then try again.";
    return <details style={{ marginBlock: 20 }}>
        <summary>{t("Convert HTML into Markdown")}</summary>
        <div className="wb-workbench" style={{ marginBlockStart: 18 }}>
            <label>{t("HTML source")}<textarea dir="ltr" rows={8} maxLength={1024 * 1024} value={html} onChange={(event) => { setHtml(event.target.value); setConverted(false); }} spellCheck={false} /></label>
            <label>{t("Or open an HTML file")}<input type="file" accept=".html,.htm,text/html" onChange={async (event) => {
                const file = event.target.files?.[0]; event.target.value = "";
                if (!file) return;
                setConverted(false);
                try { if (file.size > 1024 * 1024) throw new Error("HTML file limit is 1 MiB."); setHtml(await file.text()); setError(""); }
                catch (cause) { setError(cause instanceof Error ? cause.message : failure); }
            }} /></label>
            <button disabled={busy || !html.trim()} onClick={async () => {
                setBusy(true); setConverted(false);
                try { const { htmlToMarkdown } = await import("@/lib/html-markdown"); onConverted(await htmlToMarkdown(html)); setError(""); setConverted(true); }
                catch (cause) { setError(cause instanceof Error ? cause.message : failure); }
                finally { setBusy(false); }
            }}>{t(busy ? "Converting…" : "Convert into Markdown editor")}</button>
            {converted && <p role="status">{t("Converted HTML into the Markdown editor below.")}</p>}
            {error && <div role="alert"><p>{t(failure)}</p><p dir="auto">{t(error)}</p></div>}
            <p>{t("Conversion runs locally in an inert parser. Scripts, active elements and unsafe links are removed. Tables, lists, headings and fenced code are supported; arbitrary page layout and styling do not carry over.")}</p>
        </div>
    </details>;
}

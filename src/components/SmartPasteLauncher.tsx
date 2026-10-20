"use client";
import { useLanguage } from "./LanguageProvider";
import { useState } from "react";
import Link from "next/link";
import { detectPaste, type PasteSuggestion } from "@/lib/smart-paste";
import { pushToBridge } from "@/lib/tool-bridge";
import { toolPathFromId } from "@/lib/category-routes";

export default function SmartPasteLauncher() {
    const { t } = useLanguage();
    const [input, setInput] = useState(""); const [suggestions, setSuggestions] = useState<PasteSuggestion[]>([]); const [error, setError] = useState("");
    return <section className="wb-workbench" aria-label={t("Smart paste launcher")}>
        <label>{t("Paste data to find a tool")}<textarea dir="ltr" rows={3} value={input} onChange={(event) => { setInput(event.target.value); setSuggestions([]); setError(""); }} placeholder={t("Paste JSON, a JWT, XML, delimited data, or text…")} /></label>
        <button onClick={() => { try { setSuggestions(detectPaste(input)); setError(""); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } }}>{t("Suggest tools locally")}</button>
        {error && <p role="alert">{t(error)}</p>}
        <div className="wb-workspace-links">{suggestions.map((suggestion) => <Link key={suggestion.toolId} href={toolPathFromId(suggestion.toolId)!} prefetch={false} onClick={() => pushToBridge({ data: input, kind: suggestion.kind, label: t(suggestion.reason) })}>{t(suggestion.label)}<span className="wb-tool-label"> · {t(suggestion.reason)}</span></Link>)}</div>
        <p className="wb-tool-label">{t("Detection runs locally after you choose Suggest. Pasted data is handed to the selected tool in this tab and expires after one minute.")}</p>
    </section>;
}

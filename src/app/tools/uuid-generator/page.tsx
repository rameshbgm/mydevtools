"use client";
import { useState } from "react";
import { KeyOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import { identifierConfigMessage } from "@/lib/i18n/identifier-config";
import ToolPageLayout from "@/components/ToolPageLayout";
import { generateUuids, generateNamedUuids, generateUlids, inspectUuid, inspectUlid, UUID_NAMESPACES } from "@/lib/uuid-tools";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";
type Mode = "4" | "7" | "ulid" | "3" | "5";
export default function UuidGeneratorPage() {
    const { t } = useLanguage();
    const [count, setCount] = useState(5), [mode, setMode] = useState<Mode>("4");
    const [namespace, setNamespace] = useState<string>(UUID_NAMESPACES.DNS), [names, setNames] = useState("www.example.com");
    const [output, setOutput] = useState(""), [input, setInput] = useState(""), [inspection, setInspection] = useState(""), [error, setError] = useState("");
    const named = mode === "3" || mode === "5";
    const generate = () => { try { const values = named ? generateNamedUuids(names.split(/\r?\n/), namespace, mode === "3" ? 3 : 5) : mode === "ulid" ? generateUlids(count) : generateUuids(count, mode === "7" ? 7 : 4); setOutput(values.join("\n")); setError(""); } catch (cause) { setOutput(""); setError(cause instanceof Error ? cause.message : String(cause)); } };
    return <ToolPageLayout title={t("UUID & ULID Generator")} description={t("Generate random, time-ordered and namespace identifiers, or inspect embedded timestamps")} icon={<KeyOutlined />} color="#eb2f96"
        learnMore={{ whatIs: "UUIDv4 and v7 are standardized in RFC 9562. Namespace UUIDv3/v5 deterministically hash an exact name and namespace. ULIDs encode a 48-bit timestamp and 80-bit random component in 26 Base32 characters.", whyUse: "Choose v4 for random IDs, v7/ULID for creation-time ordering, or v5 for repeatable identifiers. Use database uniqueness constraints where uniqueness matters.", howToUse: ["Choose a format", "Set a count, or provide a namespace and one exact name per line", "Generate, copy or download IDs; inspect an ID below"], tips: ["v7 and ULID expose creation time. IDs are not authentication secrets.", "ULIDs increase within this page session when the clock repeats or rolls back.", "Namespace name whitespace and case affect the output. v3 is provided for compatibility; prefer v5 when available."] }}>
        <div className="wb-workbench"><div className="wb-form-grid"><label>{t("Identifier format")}<select value={mode} onChange={(event) => { setMode(event.target.value as Mode); setOutput(""); }}><option value="4">{t("UUIDv4 · random")}</option><option value="7">{t("UUIDv7 · time ordered")}</option><option value="ulid">{t("ULID · monotonic within this session")}</option><option value="5">{t("UUIDv5 · namespace SHA-1")}</option><option value="3">{t("UUIDv3 · namespace MD5")}</option></select></label>{!named && <label>{t("Count")}<input dir="ltr" type="number" min={1} max={1000} value={count} onChange={(event) => setCount(Number(event.target.value))} /></label>}</div>
        {named && <><label>{t("Namespace preset")}<select value={Object.values(UUID_NAMESPACES).includes(namespace) ? namespace : "custom"} onChange={(event) => setNamespace(event.target.value === "custom" ? "" : event.target.value)}>{Object.entries(UUID_NAMESPACES).map(([name, value]) => <option key={name} value={value}>{name}</option>)}<option value="custom">{t("Custom namespace UUID")}</option></select></label><label>{t("Namespace UUID")}<input dir="ltr" value={namespace} onChange={(event) => setNamespace(event.target.value)} spellCheck={false} /></label><label>{t("Names (one per line, preserved exactly)")}<textarea dir="auto" rows={4} maxLength={1_000_000} value={names} onChange={(event) => setNames(event.target.value)} spellCheck={false} /></label></>}
        <div className="wb-workbench-actions"><button onClick={generate}>{t("Generate IDs")}</button><button disabled={!output} onClick={() => void copyToClipboard(output)}>{t("Copy all")}</button><button disabled={!output} onClick={() => downloadText(output + "\n", "identifiers.txt")}>{t("Download IDs")}</button></div>
        <label>{t("Generated IDs")}<textarea dir="ltr" rows={8} readOnly value={output} /></label>
        <label>{t("UUID or ULID to inspect")}<input dir="ltr" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} /></label>
        <button onClick={() => { try { setInspection(JSON.stringify(input.trim().length === 26 ? inspectUlid(input) : inspectUuid(input), null, 2)); setError(""); } catch (cause) { setInspection(""); setError(cause instanceof Error ? cause.message : String(cause)); } }}>{t("Inspect identifier")}</button>
        {error && <p role="alert">{identifierConfigMessage(error, t)}</p>}{inspection && <pre dir="ltr" aria-label={t("Identifier inspection")} tabIndex={0}>{inspection}</pre>}
        <p><a href="https://www.rfc-editor.org/rfc/rfc9562.html" target="_blank" rel="noreferrer">RFC 9562</a> · <a href="https://github.com/ulid/spec" target="_blank" rel="noreferrer">{t("ULID specification")}</a></p></div>
    </ToolPageLayout>;
}

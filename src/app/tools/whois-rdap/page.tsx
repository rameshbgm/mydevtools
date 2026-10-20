"use client";
import { useEffect, useRef, useState } from "react";
import { GlobalOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { rdapQuery, summarizeRdap, lookupRdap, type RdapQuery } from "@/lib/rdap";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";
export default function WhoisRdapPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState("example.com"), [busy, setBusy] = useState(false), [error, setError] = useState("");
    const [result, setResult] = useState<{ query: RdapQuery; summary: ReturnType<typeof summarizeRdap>; raw: string; registryUrl: string; at: string } | null>(null);
    const abort = useRef<AbortController | null>(null);
    useEffect(() => () => abort.current?.abort(), []);
    const lookup = async () => {
        if (busy) return; setError(""); setResult(null);
        try {
            const query = rdapQuery(input); setBusy(true); const controller = new AbortController(); abort.current = controller;
            const record = await lookupRdap(query, AbortSignal.any([controller.signal, AbortSignal.timeout(25_000)]));
            setResult({ query, ...record, at: new Date().toISOString() });
        } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } finally { setBusy(false); abort.current = null; }
    };
    return <ToolPageLayout title={t("Domain & IP Registration (RDAP)")} description={t("Look up registration records, registrars, events, statuses and nameservers using the structured WHOIS successor")} icon={<GlobalOutlined />} color="#08979c"><div className="wb-workbench">
        <label>{t("Domain or IP address / prefix")}<input dir="ltr" value={input} maxLength={300} disabled={busy} onChange={(event) => { setInput(event.target.value); setResult(null); setError(""); }} placeholder="example.com · 8.8.8.8 · 2001:db8::/32" spellCheck={false} /></label><div className="wb-workbench-actions"><button disabled={busy || !input.trim()} onClick={() => void lookup()}>{t(busy ? "Looking up…" : "Look up registration")}</button>{busy && <button onClick={() => abort.current?.abort()}>{t("Cancel lookup")}</button>}</div>
        <p>{t("RDAP replaces unstructured WHOIS responses with registry-defined JSON. Contact details may be absent or redacted, and registry coverage varies. A registration record does not verify current website ownership or availability.")}</p>
        {error && <p role="alert">{t("Registration lookup failed. Review the diagnostic, check the query, or try again later.")} <bdi dir="ltr">{error}</bdi></p>}{result && <><h2>{t("Registration for {value}", { value: result.query.value })}</h2><p>{t("Retrieved {at}. Registry:", { at: result.at })} <a dir="ltr" href={result.registryUrl} target="_blank" rel="noreferrer">{new URL(result.registryUrl).hostname}</a>. {result.summary.redactedFields ? t("The registry marks {count} field(s) as redacted.", { count: result.summary.redactedFields }) : t("Missing details may reflect privacy restrictions or registry policy.")}</p><div className="wb-table-scroll"><table className="wb-data-table"><tbody>{[["Record type", result.summary.kind], ["Name", result.summary.name], ["Handle", result.summary.handle], ["Country", result.summary.country], ["Start address", result.summary.startAddress], ["End address", result.summary.endAddress], ["Statuses", result.summary.statuses.join(", ")]].filter(([, value]) => value).map(([label, value]) => <tr key={label}><th>{t(label)}</th><td dir="ltr">{value}</td></tr>)}</tbody></table></div>
            {result.summary.entities.length > 0 && <><h3>{t("Registrar & registry entities")}</h3><div className="wb-table-scroll"><table className="wb-data-table"><thead><tr><th>{t("Roles")}</th><th>{t("Name")}</th><th>{t("Handle")}</th></tr></thead><tbody>{result.summary.entities.map((entity, index) => <tr key={index}><td>{entity.roles.length ? <bdi dir="ltr">{entity.roles.join(", ")}</bdi> : t("Unspecified")}</td><td>{entity.name ? <bdi dir="ltr">{entity.name}</bdi> : t("Not published")}</td><td dir="ltr">{entity.handle}</td></tr>)}</tbody></table></div></>}
            {result.summary.events.length > 0 && <><h3>{t("Registration events")}</h3><div className="wb-table-scroll"><table className="wb-data-table"><thead><tr><th>{t("Action")}</th><th>{t("Recorded date")}</th><th>{t("Actor")}</th></tr></thead><tbody>{result.summary.events.map((event, index) => <tr key={index}><td dir="ltr">{event.action}</td><td><time dir="ltr">{event.date}</time></td><td dir="ltr">{event.actor}</td></tr>)}</tbody></table></div></>}
            {result.summary.nameservers.length > 0 && <><h3>{t("Nameservers")}</h3><ul>{result.summary.nameservers.map((name, index) => <li key={index}><code dir="ltr">{name}</code></li>)}</ul></>}
            {result.summary.notices.map((notice, index) => <details key={index}><summary>{notice.title ? <bdi dir="ltr">{notice.title}</bdi> : t("Registry notice")}</summary><p dir="ltr" style={{ whiteSpace: "pre-wrap" }}>{notice.description}</p></details>)}
            {result.summary.links.length > 0 && <details><summary>{t("Registry links")}</summary><ul>{result.summary.links.map((link, index) => <li key={index}><a dir="ltr" href={link.href} target="_blank" rel="noopener noreferrer">{link.title}</a></li>)}</ul></details>}
            <details><summary>{t("Raw RDAP JSON")}</summary><label>{t("Full registry response")}<textarea dir="ltr" rows={15} value={result.raw} readOnly /></label></details><div className="wb-workbench-actions"><button onClick={() => void copyToClipboard(result.raw)}>{t("Copy RDAP JSON")}</button><button onClick={() => downloadText(result.raw, "registration-rdap.json", "application/json")}>{t("Download RDAP JSON")}</button></div>
        </>}
        <p><a href="https://www.iana.org/assignments/rdap-dns/" target="_blank" rel="noreferrer">{t("IANA RDAP directory")}</a> · <a href="https://www.rfc-editor.org/rfc/rfc9083.html" target="_blank" rel="noreferrer">{t("RDAP response format")}</a></p>
    </div></ToolPageLayout>;
}

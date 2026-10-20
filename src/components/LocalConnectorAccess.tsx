"use client";
import { useLanguage } from "./LanguageProvider";
import { useEffect, useState } from "react";
import { connectorRequest, clearConnectorAccessKey, setConnectorAccessKey } from "@/lib/local-connector-client";
import { useDesktopRuntime } from "@/lib/desktop-runtime";
export default function LocalConnectorAccess() {
    const { t } = useLanguage();
    const [key, setKey] = useState(""), [status, setStatus] = useState(""), [busy, setBusy] = useState(false);
    const desktop = useDesktopRuntime();
    useEffect(() => { const lock = () => { clearConnectorAccessKey(); setKey(""); setStatus(""); }; window.addEventListener("mydevtools-project-lock", lock); return () => window.removeEventListener("mydevtools-project-lock", lock); }, []);
    return <details className="wb-connector-access"><summary>{t(desktop ? "Desktop connector access" : "Desktop / localhost connector access")}</summary><div className="wb-workbench" style={{ marginBlockStart: 16 }}><p>{t(desktop ? "Native connections run in this desktop app. Access is supplied automatically; its runtime key is never stored in the page." : "For a local web runtime, enable native connectors on localhost and enter its access key. The key stays in this app session’s memory. The desktop app supplies access automatically.")}</p>{!desktop && <label>{t("Local connector access key")}<input type="password" dir="ltr" value={key} autoComplete="off" maxLength={4096} onChange={(event) => { setKey(event.target.value); setConnectorAccessKey(event.target.value); setStatus(""); }} /></label>}<div className="wb-workbench-actions"><button disabled={busy} onClick={async () => { setBusy(true); try { await connectorRequest(); setStatus("Local connector is ready."); } catch (cause) { setStatus(cause instanceof Error ? cause.message : String(cause)); } finally { setBusy(false); } }}>{t(busy ? "Checking…" : "Check connector access")}</button>{!desktop && <button onClick={() => { clearConnectorAccessKey(); setKey(""); setStatus("Access key cleared from page memory."); }}>{t("Clear access key")}</button>}</div>{status && <p role="status">{t(status)}</p>}</div></details>;
}

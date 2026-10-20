"use client";
import { useLanguage } from "./LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { activeSessionProjectId } from "@/lib/project-storage";
import { createVault, openVault, readVault, writeVault } from "@/lib/local-vault";
import { vaultContents, type VaultRecord } from "@/lib/vault-records";
export default function ConnectionVault({ connector, settings, onLoad }: { connector: string; settings: Record<string, unknown>; onLoad: (settings: Record<string, unknown>) => void }) {
    const { t } = useLanguage();
    const [passphrase, setPassphrase] = useState(""), [confirmation, setConfirmation] = useState(""), [draftName, setName] = useState<string | null>(null);
    const name = draftName ?? t("My connection");
    const [exists, setExists] = useState<boolean | null>(null), [records, setRecords] = useState<{ id: string; name: string }[]>([]), [selected, setSelected] = useState("");
    const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
    const generation = useRef(0);
    const id = () => `${activeSessionProjectId()}:credentials`;
    useEffect(() => { let alive = true; readVault(id()).then((value) => { if (alive) setExists(!!value); }).catch((error) => { if (alive) setMessage(error instanceof Error ? error.message : String(error)); }); return () => { alive = false; generation.current++; }; }, []);
    useEffect(() => { if (!passphrase) return; const timeout = setTimeout(() => { generation.current++; setPassphrase(""); setConfirmation(""); setRecords([]); setMessage("Vault passphrase cleared after five minutes."); }, 5 * 60_000); return () => clearTimeout(timeout); }, [passphrase]);
    const operate = async (operation: "list" | "load" | "save") => {
        if (busy) return; setBusy(true); setMessage("");
        const started = generation.current, vaultId = id();
        let opened: Awaited<ReturnType<typeof openVault>> | null = null;
        try {
            const encrypted = await readVault(vaultId);
            if (!encrypted && (operation !== "save" || passphrase !== confirmation)) throw new Error(operation === "save" ? "The new vault passphrases must match." : "Save the first connection to create this project's credential vault.");
            opened = encrypted ? await openVault(encrypted, passphrase, vaultId) : await createVault(passphrase, vaultId, { version: 1, records: [] });
            if (started !== generation.current || id() !== vaultId) throw new Error("Vault operation cancelled. Unlock and retry.");
            const contents = vaultContents(opened.read(), "credentials");
            const matches = contents.records.filter((record) => { if (record.kind !== "connection") return false; try { return JSON.parse(record.value).connector === connector; } catch { return false; } });
            if (operation === "list") { setRecords(matches.map((record) => ({ id: record.id, name: record.name }))); setSelected(matches[0]?.id ?? ""); setMessage(matches.length ? "Select a saved connection, then load it." : "No saved connections for this client in this project."); }
            else if (operation === "load") {
                const record = matches.find((row) => row.id === selected); if (!record) throw new Error("Choose a saved connection.");
                const value = JSON.parse(record.value).settings;
                if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Saved connection settings are invalid.");
                onLoad(value); setPassphrase(""); setConfirmation(""); setRecords([]); setMessage("Connection loaded into this page's memory.");
            } else {
                if (!name.trim()) throw new Error("Name this saved connection.");
                if (contents.records.length >= 500) throw new Error("Credential vault record limit reached. Remove unused records in Credential Vault.");
                const record: VaultRecord = { id: crypto.randomUUID(), kind: "connection", name: name.trim().slice(0, 200), folder: "Connections", username: typeof settings.user === "string" ? settings.user : "", environment: connector, value: JSON.stringify({ connector, settings }), updatedAt: new Date().toISOString() };
                const encrypted = await opened.seal({ version: 1, records: [...contents.records, record] });
                if (started !== generation.current || id() !== vaultId) throw new Error("Vault operation cancelled before saving.");
                await writeVault(vaultId, encrypted);
                if (started !== generation.current) return;
                setExists(true); setPassphrase(""); setConfirmation(""); setRecords([]); setMessage("Connection saved encrypted in this project's credential vault.");
            }
        } catch (cause) { setMessage(cause instanceof Error ? cause.message : String(cause)); } finally { opened?.lock(); setBusy(false); }
    };
    return <details className="wb-connection-vault"><summary>{t("Save or load an encrypted connection")}</summary><div className="wb-workbench" style={{ marginBlockStart: 16 }}><p>{t("Uses this project's Credential Vault. Loading copies credentials into the active client’s memory for requests; they are cleared when the page closes or the project switches.")}</p><div className="wb-form-grid"><label>{t("Connection name")}<input dir="auto" value={name} maxLength={200} onChange={(event) => setName(event.target.value)} /></label><label>{t(exists === false ? "New credential vault passphrase (12+ characters)" : "Credential vault passphrase")}<input type="password" dir="ltr" autoComplete="off" value={passphrase} onChange={(event) => setPassphrase(event.target.value)} /></label>{exists === false && <label>{t("Confirm new vault passphrase")}<input type="password" dir="ltr" autoComplete="off" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>}</div><div className="wb-workbench-actions"><button disabled={busy || exists === null || !passphrase} onClick={() => void operate("save")}>{t("Save current connection encrypted")}</button><button disabled={busy || !exists || !passphrase} onClick={() => void operate("list")}>{t("List saved connections")}</button><button onClick={() => { generation.current++; setPassphrase(""); setConfirmation(""); setRecords([]); setMessage(""); }}>{t("Clear vault passphrase")}</button></div>{records.length > 0 && <><label>{t("Saved connection")}<select value={selected} onChange={(event) => setSelected(event.target.value)}>{records.map((record) => <option key={record.id} value={record.id}>{record.name}</option>)}</select></label><button disabled={busy || !selected || !passphrase} onClick={() => void operate("load")}>{t("Load selected connection")}</button></>}{message && <p role="status">{t(message)}</p>}</div></details>;
}

"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createVault, openVault, readVault, writeVault, type VaultSession } from "@/lib/local-vault";
import { activeSessionProjectId } from "@/lib/project-storage";
import { bytesToBase64, base64ToBytes, vaultContents, type VaultRecord } from "@/lib/vault-records";
import { downloadBlob } from "@/lib/download";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
import { VAULT_INTERFACE_TRANSLATIONS } from "@/lib/i18n/vault-interface";

export default function EncryptedVault({ purpose }: { purpose: "credentials" | "files" }) {
    const { language, t } = useLanguage();
    const session = useRef<VaultSession | null>(null);
    const epoch = useRef(0), working = useRef(false);
    const lastActivity = useRef(0);
    const [records, setRecords] = useState<VaultRecord[]>([]);
    const [ready, setReady] = useState(false), [exists, setExists] = useState(false), [unlocked, setUnlocked] = useState(false);
    const [passphrase, setPassphrase] = useState(""), [confirmation, setConfirmation] = useState("");
    const [backupPassphrase, setBackupPassphrase] = useState("");
    const [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState("");
    const [importedCount, setImportedCount] = useState<number | null>(null);
    const [draft, setDraft] = useState({ id: "", kind: "password" as VaultRecord["kind"], name: "", folder: "", username: "", environment: "dev", value: "" });
    const [search, setSearch] = useState("");
    const context = useCallback(() => `${activeSessionProjectId()}:${purpose}`, [purpose]);
    const resetDraft = () => setDraft({ id: "", kind: "password", name: "", folder: "", username: "", environment: "dev", value: "" });
    const lock = useCallback(() => {
        epoch.current += 1;
        session.current?.lock(); session.current = null; setRecords([]); setUnlocked(false); setPassphrase(""); setConfirmation(""); setBackupPassphrase(""); setSearch(""); setError(""); setNotice(""); setImportedCount(null);
        setDraft({ id: "", kind: "password", name: "", folder: "", username: "", environment: "dev", value: "" });
    }, []);
    useEffect(() => {
        let alive = true;
        lastActivity.current = Date.now();
        readVault(context()).then((value) => { if (alive) { setExists(!!value); setReady(true); } }).catch((cause) => { if (alive) { setError(cause instanceof Error ? cause.message : String(cause)); setReady(true); } });
        const activity = () => { lastActivity.current = Date.now(); };
        const timer = setInterval(() => { if (Date.now() - lastActivity.current >= 5 * 60_000) lock(); }, 5000);
        const leave = () => lock();
        window.addEventListener("pointerdown", activity); window.addEventListener("keydown", activity); window.addEventListener("mydevtools-project-lock", leave); window.addEventListener("pagehide", leave);
        return () => { alive = false; epoch.current += 1; clearInterval(timer); window.removeEventListener("pointerdown", activity); window.removeEventListener("keydown", activity); window.removeEventListener("mydevtools-project-lock", leave); window.removeEventListener("pagehide", leave); session.current?.lock(); session.current = null; };
    }, [lock, context]);
    const perform = async (action: () => Promise<void>) => {
        if (working.current) return;
        working.current = true;
        setBusy(true); setError(""); setNotice(""); setImportedCount(null);
        try { await action(); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } finally { working.current = false; setBusy(false); }
    };
    const save = async (next: VaultRecord[]) => {
        if (!session.current) throw new Error("Unlock the vault before saving.");
        const vaultId = context();
        const current = session.current;
        const contents = vaultContents({ version: 1, records: next }, purpose);
        const envelope = await current.seal(contents);
        if (session.current !== current) throw new Error("Vault locked before saving. Unlock and retry.");
        await writeVault(vaultId, envelope);
        if (session.current !== current) throw new Error("Encrypted changes saved, and the vault is now locked.");
        setRecords(next); setNotice("Encrypted changes saved on this device.");
    };
    const open = async () => {
        const started = epoch.current;
        const vaultId = context();
        const stored = await readVault(vaultId);
        if (!stored && passphrase !== confirmation) throw new Error("The passphrases do not match.");
        const opened = stored ? await openVault(stored, passphrase, vaultId) : await createVault(passphrase, vaultId, { version: 1, records: [] });
        const contents = vaultContents(opened.read(), purpose);
        if (started !== epoch.current) { opened.lock(); throw new Error("Unlock was cancelled because the vault locked. Try again."); }
        if (!stored) await writeVault(vaultId, opened.envelope);
        if (started !== epoch.current) { opened.lock(); throw new Error("Unlock was cancelled because the vault locked. Try again."); }
        session.current = opened; setRecords(contents.records); setUnlocked(true); setExists(true); setPassphrase(""); setConfirmation(""); lastActivity.current = Date.now();
    };
    const importBackup = async (file: File) => {
        const started = epoch.current;
        const vaultId = context();
        if (file.size > 48 * 1024 * 1024) throw new Error("Encrypted backup limit is 48 MiB.");
        if (exists && !session.current) throw new Error("Unlock the current vault before importing a backup.");
        const imported = await openVault(JSON.parse(await file.text()), backupPassphrase);
        try {
            const incoming = vaultContents(imported.read(), purpose).records.map((record) => ({ ...record, id: crypto.randomUUID() }));
            if (started !== epoch.current) throw new Error("Import cancelled because the vault locked. Unlock and retry.");
            if (records.length + incoming.length > 500) throw new Error("The combined vault exceeds 500 records.");
            if (!session.current) {
                if (passphrase !== confirmation) throw new Error("The new vault passphrases do not match.");
                const opened = await createVault(passphrase, vaultId, { version: 1, records: incoming });
                if (started !== epoch.current) { opened.lock(); throw new Error("Import cancelled because the vault locked."); }
                await writeVault(vaultId, opened.envelope);
                if (started !== epoch.current) { opened.lock(); throw new Error("Import saved encrypted data, and the vault is now locked."); }
                session.current = opened; setRecords(incoming); setUnlocked(true); setExists(true); setPassphrase(""); setConfirmation("");
            } else await save([...records, ...incoming]);
            setBackupPassphrase(""); setNotice(""); setImportedCount(incoming.length);
        } finally { imported.lock(); }
    };
    const filtered = records.filter((record) => [record.name, record.folder, record.username, record.environment].join(" ").toLowerCase().includes(search.toLowerCase()));
    return <div className="wb-workbench" aria-busy={busy}>
        <p>{t("Encrypted on this device with AES-256-GCM and a passphrase-derived key. Passphrases are not saved. The vault locks after five minutes without keyboard or pointer activity. Keep an encrypted backup: there is no passphrase reset.")}</p>
        {!ready ? <p role="status">{t("Opening encrypted storage…")}</p> : !unlocked ? <form onSubmit={(event) => { event.preventDefault(); void perform(open); }} className="wb-workbench">
            <label>{t(exists ? "Vault passphrase" : "Create a vault passphrase (at least 12 characters)")}<input dir="ltr" type="password" autoComplete={exists ? "current-password" : "new-password"} value={passphrase} onChange={(event) => setPassphrase(event.target.value)} maxLength={4096} required /></label>
            {!exists && <label>{t("Confirm passphrase")}<input dir="ltr" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /></label>}
            <button disabled={busy} type="submit">{t(busy ? "Opening…" : exists ? "Unlock vault" : "Create encrypted vault")}</button>
        </form> : <>
            <div className="wb-workbench-actions"><button disabled={busy} onClick={lock}>{t("Lock vault")}</button><button disabled={busy} onClick={() => { if (session.current) downloadBlob(JSON.stringify(session.current.envelope, null, 2), `${purpose}-encrypted-backup.json`, "application/json"); }}>{t("Download encrypted backup")}</button><span>{t("{count} of 500 records", { count: records.length.toLocaleString(language) })}</span></div>
            <label>{t("Search names, folders and environments")}<input dir="auto" type="search" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            {purpose === "credentials" ? <form className="wb-workbench" onSubmit={(event) => { event.preventDefault(); void perform(async () => {
                if (!draft.name.trim() || !draft.value) throw new Error("Enter a name and secret value.");
                if (draft.kind === "environment" || draft.kind === "connection") { const value = JSON.parse(draft.value); if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Environment and connection records must be JSON objects."); }
                const record: VaultRecord = { ...draft, id: draft.id || crypto.randomUUID(), updatedAt: new Date().toISOString() };
                await save([...records.filter((row) => row.id !== record.id), record]); resetDraft();
            }); }}>
                <div className="wb-form-grid"><label>{t("Record type")}<select value={draft.kind} onChange={(event) => setDraft({ ...draft, kind: event.target.value as VaultRecord["kind"] })}><option value="password">{t("Password")}</option><option value="api-key">{t("API key")}</option><option value="environment">{t("Environment variables (JSON)")}</option><option value="connection">{t("Connection settings (JSON)")}</option></select></label><label>{t("Name")}<input dir="auto" required maxLength={200} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><label>{t("Folder")}<input dir="auto" maxLength={500} value={draft.folder} onChange={(event) => setDraft({ ...draft, folder: event.target.value })} /></label><label>{t("Username")}<input dir="ltr" autoComplete="off" maxLength={500} value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value })} /></label><label>{t("Environment")}<input dir="ltr" maxLength={100} value={draft.environment} onChange={(event) => setDraft({ ...draft, environment: event.target.value })} /></label></div>
                <label>{t(draft.kind === "environment" || draft.kind === "connection" ? "Secret JSON object" : "Secret value")}{draft.kind === "environment" || draft.kind === "connection" ? <textarea dir="ltr" required rows={5} value={draft.value} onChange={(event) => setDraft({ ...draft, value: event.target.value })} spellCheck={false} autoComplete="off" /> : <input dir="ltr" type="password" autoComplete="off" required value={draft.value} onChange={(event) => setDraft({ ...draft, value: event.target.value })} />}</label>
                <div className="wb-workbench-actions"><button disabled={busy || (!draft.id && records.length >= 500)} type="submit">{t(draft.id ? "Save encrypted record" : "Add encrypted record")}</button>{draft.id && <button type="button" onClick={resetDraft}>{t("Cancel edit")}</button>}</div>
            </form> : <div className="wb-form-grid"><label>{t("Folder for uploaded files")}<input dir="auto" maxLength={500} value={draft.folder} onChange={(event) => setDraft({ ...draft, folder: event.target.value })} /></label><label>{t("Add a file (up to 8 MiB)")}<input type="file" disabled={busy || records.length >= 500} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void perform(async () => {
                if (file.size > 8 * 1024 * 1024) throw new Error("File limit is 8 MiB. Split larger documents before adding them.");
                const record: VaultRecord = { id: crypto.randomUUID(), kind: "file", name: file.name.slice(0, 200), folder: draft.folder, username: "", environment: "", value: bytesToBase64(new Uint8Array(await file.arrayBuffer())), updatedAt: new Date().toISOString(), file: { mime: file.type || "application/octet-stream", size: file.size, modified: file.lastModified } };
                await save([...records, record]);
            }); }} /></label></div>}
            {!filtered.length ? <p>{t(records.length ? "No records match this search." : "Your vault is empty. Add the first record above.")}</p> : <div className="wb-table-scroll"><table className="wb-data-table"><thead><tr><th>{t("Name")}</th><th>{t("Folder")}</th><th>{t(purpose === "files" ? "Size" : "Environment")}</th><th>{t("Actions")}</th></tr></thead><tbody>{filtered.map((record) => <tr key={record.id}><td><bdi dir="auto">{record.name}</bdi><br /><small dir="auto">{record.username || t(record.kind === "api-key" ? "API key" : record.kind === "environment" ? "Environment variables (JSON)" : record.kind === "connection" ? "Connection settings (JSON)" : record.kind === "file" ? "File" : "Password")}</small></td><td><bdi dir="auto">{record.folder || "—"}</bdi></td><td dir="ltr">{record.file ? t("{count} bytes", { count: record.file.size.toLocaleString(language) }) : record.environment}</td><td><div className="wb-workbench-actions">{record.file ? <button disabled={busy} onClick={() => { try { const bytes = base64ToBytes(record.value); if (bytes.length !== record.file!.size) throw new Error("Decrypted file size does not match its metadata."); downloadBlob(bytes.buffer, record.name, record.file!.mime); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } }}>{t("Download decrypted file")}</button> : <><button disabled={busy} onClick={() => { setDraft({ ...record }); setNotice("Record loaded for editing."); }}>{t("Edit")}</button><button disabled={busy} onClick={() => void perform(async () => { if (!await copyToClipboard(record.value)) throw new Error("Clipboard access failed. Use Edit to select the value manually."); setNotice("Secret copied to your clipboard."); })}>{t("Copy secret")}</button></>}<button disabled={busy} onClick={() => void perform(async () => { await save(records.filter((row) => row.id !== record.id)); })}>{t(purpose === "files" ? "Remove file" : "Remove record")}</button></div></td></tr>)}</tbody></table></div>}
        </>}
        <details><summary>{t("Import an encrypted backup")}</summary><div className="wb-workbench"><p>{t(exists ? "Unlock this vault first. Imported records are added; existing records stay intact." : "Choose a new vault passphrase above, then enter the backup passphrase below.")}</p><label>{t("Backup passphrase")}<input dir="ltr" type="password" autoComplete="off" value={backupPassphrase} onChange={(event) => setBackupPassphrase(event.target.value)} /></label><label>{t("Encrypted backup JSON")}<input type="file" accept="application/json,.json" disabled={busy || !ready || !backupPassphrase || (exists && !unlocked)} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void perform(() => importBackup(file)); }} /></label></div></details>
        {notice && <p role="status">{t(notice)}</p>}{importedCount !== null && !notice && <p role="status">{t("{count} records imported. Existing records were preserved.", { count: importedCount.toLocaleString(language) })}</p>}{error && <p role="alert">{Object.hasOwn(VAULT_INTERFACE_TRANSLATIONS, error) ? t(error) : <>{t("The vault operation failed. Review the details and retry.")} <bdi dir="auto">{error}</bdi></>}</p>}
        <p>{t("File names, folders and exact sizes are encrypted inside the payload. Padding groups the total ciphertext size into 64 KiB buckets; approximate total size remains visible. Browser extensions or compromised scripts can access an unlocked vault. Removing a record takes effect immediately; restore it from a previous encrypted backup if needed.")}</p>
    </div>;
}

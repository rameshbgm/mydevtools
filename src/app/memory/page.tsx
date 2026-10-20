"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Modal } from "antd";
import { useLanguage } from "@/components/LanguageProvider";
import { localizeMemoryMessage, memoryRowLabel } from "@/lib/i18n/memory";
import { ApartmentOutlined, CloudOutlined, CodeOutlined, DatabaseOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined, FileTextOutlined, LinkOutlined, LockOutlined, ReloadOutlined, SafetyOutlined, SettingOutlined, SwitcherOutlined, UploadOutlined } from "@ant-design/icons";
import { toolPathFromId } from "@/lib/category-routes";
import { activeSessionProjectId, PERSONAL_PROJECT } from "@/lib/project-storage";
import { downloadBlob } from "@/lib/download";
import { collectStorageInventory, clearStorageRow, exportLocalRecords, formatStorageBytes, restoreLocalRecords, parseLocalRecords, readStorageRow, readStoredPage, storageBytes, storageValueText, type LocalStorageBackup, type StorageEngine, type StorageEnvironment, type StorageRow, type StorageSnapshot } from "@/lib/storage-inventory";

const ENGINES: { id: StorageEngine; title: string; description: string }[] = [
    { id: "local", title: "Local records", description: "Saved tool data and preferences. Sizes below measure the UTF-8 values, rather than browser quota usage." },
    { id: "indexeddb", title: "Databases", description: "Browse records in each object store. An empty store is shown with zero records." },
    { id: "vault", title: "Encrypted vaults", description: "Each row is one encrypted vault. Its record names and contents stay locked until you unlock it in the vault tool." },
    { id: "session", title: "This tab’s session", description: "Temporary data in this tab. Other tabs have separate session storage." },
    { id: "cache", title: "Offline caches", description: "Saved pages and assets. Clearing caches affects offline availability; visiting pages can create new cached data." },
];
const environment = (): StorageEnvironment => ({ local: localStorage, session: sessionStorage, idb: typeof indexedDB === "undefined" ? undefined : indexedDB, cache: typeof caches === "undefined" ? undefined : caches });
function RowIcon({ row }: { row: StorageRow }) {
    if (row.engine === "vault") return <LockOutlined />;
    if (row.engine === "cache") return <CloudOutlined />;
    if (row.engine === "indexeddb" || row.toolId === "sql-client") return <DatabaseOutlined />;
    if (row.toolId === "code-snippets") return <CodeOutlined />;
    if (row.toolId === "resource-bookmarks") return <LinkOutlined />;
    if (row.toolId === "tool-workbench") return <SwitcherOutlined />;
    if (row.toolId === "project-workspaces") return <ApartmentOutlined />;
    if (row.scope === "global") return <SettingOutlined />;
    return <FileTextOutlined />;
}
interface Preview { row: StorageRow; value: unknown; offset: number; hasMore: boolean }

export default function MemoryPage() {
    const { t } = useLanguage();
    const [snapshot, setSnapshot] = useState<StorageSnapshot>({ rows: [], projects: [], warnings: [] });
    const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false);
    const [query, setQuery] = useState(""), [scope, setScope] = useState("all"), [engine, setEngine] = useState("all");
    const [sensitive, setSensitive] = useState(false), [preview, setPreview] = useState<Preview | null>(null);
    const [notice, setNotice] = useState(""), [error, setError] = useState("");
    const [usage, setUsage] = useState<{ usage?: number; quota?: number }>({});
    const [persistent, setPersistent] = useState<boolean | null>(null);
    const [pendingImport, setPendingImport] = useState<LocalStorageBackup | null>(null);
    const [pendingClear, setPendingClear] = useState<StorageRow[] | null>(null);
    const [resetOpen, setResetOpen] = useState(false), [resetText, setResetText] = useState("");
    const importInput = useRef<HTMLInputElement>(null), generation = useRef(0), working = useRef(false);
    const refresh = useCallback(async () => {
        const started = ++generation.current; setLoading(true);
        try {
            const next = await collectStorageInventory(environment());
            if (started !== generation.current) return;
            setSnapshot(next);
            const [estimate, persisted] = await Promise.allSettled([navigator.storage?.estimate?.(), navigator.storage?.persisted?.()]);
            if (started !== generation.current) return;
            if (estimate.status === "fulfilled" && estimate.value) setUsage(estimate.value);
            if (persisted.status === "fulfilled" && typeof persisted.value === "boolean") setPersistent(persisted.value);
        } catch (cause) { setError(cause instanceof Error ? cause.message : "Browser storage could not be read. Check storage permissions and refresh."); }
        finally { if (started === generation.current) setLoading(false); }
    }, []);
    useEffect(() => {
        void refresh();
        const changed = () => { void refresh(); };
        window.addEventListener("storage", changed);
        return () => {
            // This is a request counter, not a DOM ref; invalidate pending reads.
            // eslint-disable-next-line react-hooks/exhaustive-deps
            generation.current++;
            window.removeEventListener("storage", changed);
        };
    }, [refresh]);
    const projectNames = useMemo(() => new Map(snapshot.projects.map((project) => {
        const name = project.id === PERSONAL_PROJECT ? t("Personal") : project.name;
        return [project.id, project.deletedAt ? t("{name} (deleted)", { name }) : name] as const;
    })), [snapshot.projects, t]);
    const scopeLabel = (value: string) => value === "all" ? t("All projects and shared data") : value === "global" ? t("Shared preferences and caches") : projectNames.get(value) ?? t("Unlisted project · {id}", { id: value });
    const scopes = [...new Set(["global", ...snapshot.projects.map((project) => project.id), ...snapshot.rows.map((row) => row.scope)])];
    const filtered = snapshot.rows.filter((row) => (scope === "all" || row.scope === scope) && (engine === "all" || row.engine === engine) && `${memoryRowLabel(row, t)} ${row.label} ${row.key} ${row.database ?? ""} ${scopeLabel(row.scope)}`.toLowerCase().includes(query.trim().toLowerCase()));
    const operate = async (action: () => Promise<void>) => {
        if (working.current) return;
        working.current = true; setBusy(true); setError("");
        try { await action(); } catch (cause) { setError(cause instanceof Error ? cause.message : "The storage action failed. Refresh and retry."); }
        finally { working.current = false; setBusy(false); }
    };
    const openPreview = (row: StorageRow, offset = 0) => operate(async () => {
        const env = environment();
        if (row.engine === "indexeddb") {
            const page = await readStoredPage(row, env, offset);
            setPreview({ row, value: page.entries, offset, hasMore: page.hasMore });
        } else setPreview({ row, value: await readStorageRow(row, env), offset: 0, hasMore: false });
    });
    const exportRow = (row: StorageRow) => operate(async () => {
        const env = environment();
        if (row.engine === "vault") {
            const envelope = await readStorageRow(row, env);
            if (!envelope) throw new Error("This vault no longer exists. Refresh the inventory.");
            downloadBlob(JSON.stringify(envelope, null, 2), `${row.key.replace(/[^a-z0-9-]/gi, "-")}-encrypted-backup.json`, "application/json");
        } else if (row.engine === "indexeddb") {
            const chunks = ["[\n"]; let bytes = 0, offset = 0;
            while (true) {
                const page = await readStoredPage(row, env, offset);
                for (const entry of page.entries) {
                    const text = storageValueText(entry, sensitive, Infinity);
                    bytes += storageBytes(text); if (bytes > 64 * 1024 * 1024) throw new Error("This JSON export exceeds 64 MiB. Export larger task datasets from Task Manager.");
                    if (chunks.length > 1) chunks.push(",\n"); chunks.push(text);
                }
                if (!page.hasMore) break;
                offset += page.entries.length;
            }
            chunks.push("\n]"); downloadBlob(new Blob(chunks, { type: "application/json" }), "indexeddb-records.json");
        } else if (row.engine === "cache") downloadBlob(storageValueText(await readStorageRow(row, env), sensitive, Infinity), "offline-cache-requests.json", "application/json");
        else downloadBlob(JSON.stringify(exportLocalRecords([row], env, sensitive), null, 2), "storage-record.json", "application/json");
    });
    // Keep the selection in state so an open confirmation follows language changes.
    const confirmClear = (rows: StorageRow[]) => setPendingClear(rows.filter((row) => !row.protected));
    const clearSelected = async () => {
        if (!pendingClear || working.current) return;
        working.current = true;
        try {
            setBusy(true); setError(""); window.dispatchEvent(new Event("mydevtools-project-lock"));
            for (const row of pendingClear) await clearStorageRow(row, environment());
            setNotice("Selected data cleared. Reload to apply changes to open tools.");
            setPendingClear(null); await refresh();
        } catch (cause) { setError(`Clearing could not finish; some entries may already be removed. Refresh and retry. ${cause instanceof Error ? cause.message : ""}`); }
        finally { working.current = false; setBusy(false); }
    };
    const importFile = async (file: File) => {
        await operate(async () => { if (file.size > 20 * 1024 * 1024) throw new Error("Storage import limit is 20 MiB."); setPendingImport(parseLocalRecords(await file.text(), activeSessionProjectId())); });
    };
    const applyImport = () => operate(async () => {
        if (!pendingImport) return;
        const env = environment();
        restoreLocalRecords(pendingImport, env);
        window.dispatchEvent(new Event("mydevtools-project-lock")); window.location.reload();
    });
    const resetAll = () => operate(async () => {
        if (resetText !== "CLEAR") return;
        window.dispatchEvent(new Event("mydevtools-project-lock"));
        const env = environment(), fresh = await collectStorageInventory(env);
        if (fresh.warnings.length) throw new Error("Some storage could not be inspected. Resolve the inventory warnings before clearing all site data.");
        for (const row of [...fresh.rows.filter((row) => !row.protected), ...fresh.rows.filter((row) => row.protected)]) await clearStorageRow(row, env, true);
        window.location.reload();
    });
    return <div className="wb-workbench wb-memory-page">
        <header className="wb-memory-header"><div><h1><DatabaseOutlined aria-hidden="true" />{t("Memory & Storage")}</h1><p>{t("See what this site saves on your device, inspect records and manage backups.")}</p></div><button type="button" disabled={loading || busy} onClick={() => void refresh()}><ReloadOutlined aria-hidden="true" />{t(loading ? "Refreshing…" : "Refresh")}</button></header>
        <dl className="wb-memory-stats"><div><dt>{t("Local records")}</dt><dd>{loading ? "…" : snapshot.rows.filter((row) => row.engine === "local").length}</dd></div><div><dt>{t("Databases")}</dt><dd>{loading ? "…" : new Set(snapshot.rows.flatMap((row) => row.database ? [row.database] : [])).size}</dd></div><div><dt>{t("Encrypted vaults")}</dt><dd>{loading ? "…" : snapshot.rows.filter((row) => row.engine === "vault").length}</dd></div><div><dt>{t("Browser usage · approximate")}</dt><dd>{usage.usage === undefined ? t("Not measured") : formatStorageBytes(usage.usage)}{usage.quota !== undefined && <small>{t(" of {quota} available quota", { quota: formatStorageBytes(usage.quota) })}</small>}</dd></div></dl>
        {error && <p role="alert">{localizeMemoryMessage(error, t)}</p>}{snapshot.warnings.length > 0 && <div role="status" className="wb-memory-warning"><strong>{t("Some storage could not be inspected")}</strong><ul>{snapshot.warnings.map((warning) => <li key={warning}>{localizeMemoryMessage(warning, t)}</li>)}</ul></div>}
        {notice && <p role="status">{t(notice)} <button type="button" onClick={() => window.location.reload()}>{t("Reload page")}</button></p>}
        <section className="wb-memory-controls" aria-label={t("Storage filters and actions")}>
            <div className="wb-memory-filters"><label>{t("Search saved data")}<input type="search" placeholder={t("Tool, storage key or database…")} value={query} onChange={(event) => setQuery(event.target.value)} /></label><label>{t("Project scope")}<select value={scope} onChange={(event) => setScope(event.target.value)}><option value="all">{t("All projects and shared data")}</option>{scopes.map((id) => <option key={id} value={id}>{scopeLabel(id)}</option>)}</select></label></div>
            <div className="wb-memory-kind-filter" role="group" aria-label={t("Storage type")}><button aria-pressed={engine === "all"} onClick={() => setEngine("all")}>{t("All types")}</button>{ENGINES.map((type) => <button key={type.id} aria-pressed={engine === type.id} onClick={() => setEngine(type.id)}>{t(type.title)}</button>)}</div>
            <div className="wb-memory-actions"><button disabled={busy || !filtered.some((row) => row.engine === "local" || row.engine === "session")} onClick={() => void operate(async () => { downloadBlob(JSON.stringify(exportLocalRecords(filtered, environment(), sensitive), null, 2), "mydevtools-local-session-storage.json", "application/json"); })}><DownloadOutlined aria-hidden="true" />{t("Export local/session records")}</button><button disabled={busy} onClick={() => importInput.current?.click()}><UploadOutlined aria-hidden="true" />{t("Import records")}</button><button className="wb-memory-danger" disabled={busy || !filtered.some((row) => !row.protected)} onClick={() => confirmClear(filtered)}><DeleteOutlined aria-hidden="true" />{t("Clear shown data")}</button><input ref={importInput} type="file" accept="application/json,.json" hidden onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void importFile(file); }} /></div>
            <label className="wb-checkbox"><input type="checkbox" checked={sensitive} onChange={(event) => setSensitive(event.target.checked)} />{t("Show sensitive values in previews and JSON exports")}</label><p className="wb-memory-caption">{t("Values are redacted by default as a best effort. Review exports before sharing. Local/session exports exclude databases, vaults and cached assets; use their row actions below.")}</p>
        </section>
        {loading && !snapshot.rows.length ? <p role="status">{t("Reading browser storage…")}</p> : !filtered.length ? <div className="wb-memory-empty"><DatabaseOutlined aria-hidden="true" /><h2>{t(snapshot.rows.length ? "No matching storage entries" : "No saved storage found")}</h2><p>{t(snapshot.rows.length ? "Try another search, project scope or storage type." : "Saved tool data will appear here. Storage stays on this browser and device.")}</p></div> : ENGINES.map((type) => {
            const rows = filtered.filter((row) => row.engine === type.id); if (!rows.length) return null;
            return <section key={type.id} className="wb-memory-section" aria-labelledby={`storage-${type.id}`}><div className="wb-memory-section-heading"><h2 id={`storage-${type.id}`}>{t(type.title)}<span>{rows.length}</span></h2><p>{t(type.description)}</p></div><ul className="wb-memory-records">{rows.map((row) => <li key={row.id}>
                <span className="wb-memory-record-icon" aria-hidden="true"><RowIcon row={row} /></span><div className="wb-memory-record-info"><h3>{memoryRowLabel(row, t)}</h3><code>{row.database ? `${row.database} / ${row.key}` : row.key}</code><p>{t(row.description)}</p><span className="wb-memory-record-scope">{scopeLabel(row.scope)}</span></div><div className="wb-memory-record-size">{row.bytes !== undefined ? formatStorageBytes(row.bytes) : row.engine === "vault" ? t("Encrypted") : t(row.engine === "cache" ? "{count} requests" : "{count} records", { count: row.count ?? 0 })}</div><div className="wb-memory-record-actions"><button disabled={busy} onClick={() => void openPreview(row)} aria-label={t("View {name}", { name: memoryRowLabel(row, t) })}><EyeOutlined aria-hidden="true" />{t(row.engine === "indexeddb" ? "Browse" : "View")}</button><button disabled={busy} onClick={() => void exportRow(row)} aria-label={t("Export {name}", { name: memoryRowLabel(row, t) })}><DownloadOutlined aria-hidden="true" />{t(row.engine === "vault" ? "Encrypted backup" : "Export")}</button>{row.toolId && <Link prefetch={false} href={toolPathFromId(row.scope === "global" || row.scope === activeSessionProjectId() ? row.toolId : "project-workspaces")!}>{row.scope === "global" || row.scope === activeSessionProjectId() ? t("Open tool") : t("Switch project")}</Link>}<button className="wb-memory-danger" disabled={busy || row.protected} title={row.protected ? t("Manage projects through Project Workspaces") : undefined} onClick={() => confirmClear([row])} aria-label={t("Clear {name}", { name: memoryRowLabel(row, t) })}><DeleteOutlined aria-hidden="true" />{t("Clear")}</button></div>
            </li>)}</ul></section>;
        })}
        <section className="wb-memory-help"><h2><SafetyOutlined aria-hidden="true" />{t("Storage and recovery")}</h2><details><summary>{t("Backups, restoration and encrypted data")}</summary><p>{t("Local/session record exports restore their original storage keys and project identifiers. Redacted values need to be re-entered. Task database JSON exports are record dumps; use Task Manager for its full import/export format. Restore encrypted vault backups through Credential Vault or Secure Files with their backup passphrase. An encrypted backup does not contain the passphrase.")}</p><div className="wb-memory-links"><Link href={toolPathFromId("todo-list")!}>{t("Task Manager")}</Link><Link href={toolPathFromId("credential-vault")!}>{t("Credential Vault")}</Link><Link href={toolPathFromId("secure-files")!}>{t("Secure Files")}</Link><Link href={toolPathFromId("project-workspaces")!}>{t("Project Workspaces")}</Link></div></details><details><summary>{t("Browser storage limits and persistence")}</summary><p>{t("Quota and usage are estimates for this site, including data beyond the UTF-8 local record sizes shown above. Browsers can evict data; private browsing and storage permissions may restrict access. Keep backups on another device.")}</p><p>{t("Persistent storage: {status}.", { status: t(persistent === null ? "Unavailable" : persistent ? "Granted by this browser" : "Not granted") })}</p>{persistent === false && <button disabled={busy} onClick={() => void operate(async () => { const granted = await navigator.storage.persist(); setPersistent(granted); setNotice(granted ? "Persistent storage granted. Keep backups as well." : "This browser did not grant persistent storage. Keep external backups."); })}>{t("Request persistent storage")}</button>}</details><details><summary>{t("Reset all site data")}</summary><p>{t("Remove local records, this tab’s session, database records, encrypted vaults and offline caches across every project. This cannot be undone. Other tabs may still hold drafts; close them before resetting. Caches can be created again when the app is used.")}</p><button className="wb-memory-danger" disabled={busy || loading} onClick={() => { setResetText(""); setResetOpen(true); }}>{t("Clear all site data")}</button></details></section>
        <Modal open={pendingClear !== null} title={pendingClear?.length === 1 ? t("Clear {name}?", { name: memoryRowLabel(pendingClear[0], t) }) : t("Clear {count} shown storage entries?", { count: pendingClear?.length ?? 0 })} onCancel={() => { if (!busy) setPendingClear(null); }} onOk={() => void clearSelected()} okText={t("Clear permanently")} okButtonProps={{ danger: true, disabled: busy }} cancelText={t("Cancel")} cancelButtonProps={{ disabled: busy }} confirmLoading={busy} closable={!busy} mask={{ closable: !busy }}><div className="wb-workbench"><p>{t("Scope: {scope}. This permanently removes the selected saved data, including any encrypted vault contents in this selection. It cannot be undone. Export backups first and close tools that could save new data.", { scope: [...new Set(pendingClear?.map((row) => scopeLabel(row.scope)) ?? [])].join(", ") })}</p><p>{t("Project catalogue entries remain available in Project Workspaces.")}</p>{error && <p role="alert">{localizeMemoryMessage(error, t)}</p>}</div></Modal>
        <Modal open={preview !== null} onCancel={() => setPreview(null)} footer={null} title={preview ? memoryRowLabel(preview.row, t) : undefined} width={840} destroyOnHidden><div className="wb-workbench wb-memory-preview">{preview && <><p>{scopeLabel(preview.row.scope)} · {preview.row.database ?? t(ENGINES.find((type) => type.id === preview.row.engine)!.title)} · {preview.row.key}</p>{preview.row.engine === "vault" && <p><LockOutlined aria-hidden="true" />{t("Encrypted envelope only. Its secret values and filenames stay encrypted.")}</p>}<label className="wb-checkbox"><input type="checkbox" checked={sensitive} onChange={(event) => setSensitive(event.target.checked)} />{t("Show sensitive values")}</label><pre tabIndex={0}>{storageValueText(preview.value, sensitive, Infinity).slice(0, 65_536)}</pre>{storageValueText(preview.value, sensitive, Infinity).length > 65_536 && <p>{t("Preview truncated. Export to read the complete record.")}</p>}{preview.row.engine === "indexeddb" && <div className="wb-memory-actions"><button disabled={busy || preview.offset === 0} onClick={() => void openPreview(preview.row, Math.max(0, preview.offset - 25))}>{t("Previous page")}</button><span>{Array.isArray(preview.value) && preview.value.length ? t("Records {start}–{end}", { start: preview.offset + 1, end: preview.offset + preview.value.length }) : t("No records")}</span><button disabled={busy || !preview.hasMore} onClick={() => void openPreview(preview.row, preview.offset + 25)}>{t("Next page")}</button></div>}<button disabled={busy} onClick={() => void exportRow(preview.row)}><DownloadOutlined aria-hidden="true" />{t(preview.row.engine === "vault" ? "Download encrypted backup" : "Export this entry")}</button></>}</div></Modal>
        <Modal open={pendingImport !== null} title={t("Import saved records?")} onCancel={() => { if (!busy) setPendingImport(null); }} footer={null} destroyOnHidden><div className="wb-workbench"><p>{t("Restore {count} local/session records to their original keys and project identifiers. Existing values at those keys will be overwritten, and this page will reload. Export your current data first.", { count: pendingImport?.entries.length ?? 0 })}</p>{pendingImport?.redacted && <p>{t("This export contains redacted values. Secrets may need to be entered again.")}</p>}{error && <p role="alert">{localizeMemoryMessage(error, t)}</p>}<div className="wb-memory-actions"><button disabled={busy} onClick={() => setPendingImport(null)}>{t("Cancel")}</button><button disabled={busy} onClick={() => void applyImport()}>{t("Import and reload")}</button></div></div></Modal>
        <Modal open={resetOpen} title={t("Clear all site data permanently?")} onCancel={() => { if (!busy) setResetOpen(false); }} footer={null} destroyOnHidden><div className="wb-workbench"><p>{t("This removes saved data and encrypted vaults for every project on this site. Export backups first. This cannot be undone.")}</p><label>{t("Type CLEAR to confirm")}<input value={resetText} onChange={(event) => setResetText(event.target.value)} disabled={busy} autoComplete="off" /></label>{error && <p role="alert">{localizeMemoryMessage(error, t)}</p>}<div className="wb-memory-actions"><button disabled={busy} onClick={() => setResetOpen(false)}>{t("Cancel")}</button><button className="wb-memory-danger" disabled={busy || resetText !== "CLEAR"} onClick={() => void resetAll()}>{t("Clear everything and reload")}</button></div></div></Modal>
    </div>;
}

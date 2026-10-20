"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useState } from "react";
import { BookOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { projectStorage } from "@/lib/project-storage";
import { parseLibrary, resourceUrl, type ResourceBookmark } from "@/lib/local-library";
import { downloadText } from "@/lib/download";
const KEY = "mydevtools-resource-bookmarks-v1";
const empty = { id: "", title: "", url: "https://", folder: "", tags: "" };
export default function ResourceBookmarksPage() {
    const { t } = useLanguage();
    const [records, setRecords] = useState<ResourceBookmark[]>([]), [draft, setDraft] = useState(empty);
    const [search, setSearch] = useState(""), [folder, setFolder] = useState("");
    const [ready, setReady] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState("");
    const [importedCount, setImportedCount] = useState<number | null>(null);
    const [removed, setRemoved] = useState<ResourceBookmark | null>(null);
    useEffect(() => { try { setRecords(parseLibrary(JSON.parse(projectStorage.getItem(KEY) ?? "[]"), "bookmarks")); setReady(true); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } }, []);
    // Re-read immediately before the synchronous commit. File reads can finish
    // after another edit, delete, import or another tab's storage update.
    const persist = (update: (current: ResourceBookmark[]) => ResourceBookmark[]) => {
        if (!ready) throw new Error("Stored library could not be loaded. Back it up in Memory Manager before clearing or restoring it.");
        const current = parseLibrary(JSON.parse(projectStorage.getItem(KEY) ?? "[]"), "bookmarks");
        const valid = parseLibrary(update(current), "bookmarks");
        projectStorage.setItem(KEY, JSON.stringify(valid));
        setRecords(valid);
    };
    const perform = (action: () => void) => { try { action(); setError(""); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } };
    const folders = [...new Set(records.map((row) => row.folder).filter(Boolean))].sort();
    const visible = records.filter((row) => (!folder || row.folder === folder) && `${row.title} ${row.url} ${row.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
    return <ToolPageLayout title="Resource Bookmarks" description={t("Keep project documentation, repositories and useful links together")} icon={<BookOutlined />} color="#08979c"><div className="wb-workbench">
        <form className="wb-workbench" onSubmit={(event) => { event.preventDefault(); perform(() => { const record = { id: draft.id || crypto.randomUUID(), title: draft.title.trim(), url: resourceUrl(draft.url), folder: draft.folder.trim(), tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean), updatedAt: new Date().toISOString() }; persist((current) => [...current.filter((row) => row.id !== record.id), record]); setDraft(empty); setNotice("Bookmark saved in this project."); }); }}>
            <div className="wb-form-grid"><label>{t("Title")}<input dir="auto" value={draft.title} maxLength={160} required onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label><label>{t("URL")}<input dir="ltr" type="url" value={draft.url} maxLength={8192} required onChange={(event) => setDraft({ ...draft, url: event.target.value })} /></label><label>{t("Folder")}<input dir="auto" value={draft.folder} list="bookmark-folders" maxLength={120} onChange={(event) => setDraft({ ...draft, folder: event.target.value })} /><datalist id="bookmark-folders">{folders.map((name) => <option key={name} value={name} />)}</datalist></label><label>{t("Tags, separated by commas")}<input dir="auto" value={draft.tags} maxLength={1200} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} /></label></div>
            <div className="wb-workbench-actions"><button type="submit" disabled={!ready}>{draft.id ? t("Save bookmark") : t("Add bookmark")}</button>{draft.id && <button type="button" onClick={() => setDraft(empty)}>{t("Cancel edit")}</button>}</div>
        </form>
        <div className="wb-form-grid"><label>{t("Search bookmarks")}<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label>{t("Folder filter")}<select value={folder} onChange={(event) => setFolder(event.target.value)}><option value="">{t("All folders")}</option>{folders.map((name) => <option key={name}>{name}</option>)}</select></label></div>
        {visible.length ? <ul className="wb-resource-list">{visible.map((row) => <li key={row.id}><div><a href={row.url} target="_blank" rel="noopener noreferrer"><bdi>{row.title}</bdi></a><p dir="ltr">{row.url}</p><small dir="auto">{[row.folder, row.tags.join(", ")].filter(Boolean).join(" · ")}</small></div><div className="wb-workbench-actions"><button onClick={() => setDraft({ ...row, tags: row.tags.join(", ") })}>{t("Edit {name}", { name: row.title })}</button><button onClick={() => perform(() => { persist((current) => current.filter((item) => item.id !== row.id)); setRemoved(row); setNotice("Bookmark removed. Undo is available below."); })}>{t("Remove")}</button></div></li>)}</ul> : <p>{ready ? records.length ? t("No bookmarks match these filters.") : t("No bookmarks yet. Add a documentation or repository URL above.") : t("Loading project bookmarks…")}</p>}
        {removed && <button onClick={() => perform(() => { persist((current) => current.some((row) => row.id === removed.id) ? current : [...current, removed]); setRemoved(null); setNotice("Bookmark restored."); })}>{t("Undo removal of {name}", { name: removed.title })}</button>}
        <div className="wb-workbench-actions"><button onClick={() => downloadText(JSON.stringify({ version: 1, kind: "bookmarks", records }, null, 2), "project-bookmarks.json", "application/json")}>{t("Export bookmarks")}</button><label>{t("Import bookmarks JSON")}<input disabled={!ready} type="file" accept=".json,application/json" onChange={async (event) => { const file = event.target.files?.[0]; event.target.value = ""; if (!file) return; try { if (file.size > 2 * 1024 * 1024) throw new Error("Bookmark import limit is 2 MiB."); const value = JSON.parse(await file.text()); if (value.version !== 1 || value.kind !== "bookmarks") throw new Error("Unsupported bookmarks export."); const incoming = parseLibrary(value.records, "bookmarks"); persist((current) => [...current, ...incoming.map((row) => ({ ...row, id: crypto.randomUUID() }))]); setError(""); setNotice(""); setImportedCount(incoming.length); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } }} /></label></div>
        {notice && <p role="status">{t(notice)}</p>}{importedCount !== null && !notice && <p role="status">{t("Imported bookmarks: {count}.", { count: importedCount })}</p>}{error && <p role="alert">{t("Review the settings and saved data, then try again.")} {t(error)}</p>}<p>{t("Links open only when selected. No page titles or favicons are fetched automatically. Bookmarks are stored unencrypted in this project.")}</p>
    </div></ToolPageLayout>;
}

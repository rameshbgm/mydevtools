"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { ACTIVE_PROJECT_KEY, MAX_PROJECTS, PROJECTS_KEY, PERSONAL, activeSessionProjectId, createProject, purgeDeletedProject, queueProjectPurge, readDeletedProjects, readProjects, reloadActiveProject, rememberProjectPath, renameProject, switchProject, type Project } from "@/lib/project-storage";
import { toolPathFromId } from "@/lib/category-routes";
import { clearBridge } from "@/lib/tool-bridge";
import { useLanguage } from "./LanguageProvider";

export default function ProjectSwitcher() {
    const { t, direction } = useLanguage();
    const pathname = usePathname();
    const [projects, setProjects] = useState<Project[]>([PERSONAL]);
    const [active, setActive] = useState(PERSONAL.id);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [notice, setNotice] = useState("");
    const [errorDetail, setErrorDetail] = useState("");
    const [removing, setRemoving] = useState<string | null>(null);
    const bar = useRef<HTMLElement>(null);
    const editor = useRef<HTMLInputElement>(null);
    const selectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const skipBlur = useRef(false);
    const reportError = (cause: unknown) => { setError(cause instanceof Error ? cause.message : String(cause)); setErrorDetail(""); };
    useEffect(() => {
        const refresh = () => { try { setProjects(readProjects(localStorage)); setActive(activeSessionProjectId()); setError(""); } catch (cause) { reportError(cause); } };
        refresh();
        const changed = (event: StorageEvent) => {
            if (event.key === ACTIVE_PROJECT_KEY && event.newValue !== event.oldValue) { reloadActiveProject(); return; }
            if (event.key === PROJECTS_KEY || event.key === null) {
                try {
                    if (!readProjects(localStorage).some((project) => project.id === activeSessionProjectId())) {
                        window.dispatchEvent(new Event("mydevtools-project-lock"));
                        reloadActiveProject();
                    } else refresh();
                } catch (cause) { reportError(cause); }
            }
        };
        window.addEventListener("storage", changed);
        window.addEventListener("mydevtools-projects-changed", refresh);
        return () => { window.removeEventListener("storage", changed); window.removeEventListener("mydevtools-projects-changed", refresh); };
    }, []);
    useEffect(() => {
        if (window.parent !== window) return;
        try { rememberProjectPath(pathname); } catch { /* Navigation can remain session-only when storage is unavailable. */ }
    }, [pathname]);
    useEffect(() => {
        let disposed = false;
        const finishConfirmedClosures = async () => {
            try {
                for (const project of readDeletedProjects(localStorage).filter((row) => row.purgeQueuedAt)) {
                    if (!disposed) setRemoving(project.name);
                    try { await purgeDeletedProject(project.id); }
                    catch (cause) {
                        // Another tab may have finished the same confirmed removal.
                        if (readDeletedProjects(localStorage).some((row) => row.id === project.id)) throw cause;
                    }
                }
                if (!disposed) { setRemoving(null); window.dispatchEvent(new Event("mydevtools-projects-changed")); }
            } catch (cause) {
                if (!disposed) {
                    setRemoving(null);
                    setError("Workspace deletion could not finish. Retry from Deleted projects in Manage projects.");
                    setErrorDetail(cause instanceof Error ? cause.message : String(cause));
                }
            }
        };
        void finishConfirmedClosures();
        return () => { disposed = true; if (selectionTimer.current) clearTimeout(selectionTimer.current); };
    }, []);
    useEffect(() => { if (editing !== null) { editor.current?.focus(); editor.current?.select(); } }, [editing]);
    const refresh = () => window.dispatchEvent(new Event("mydevtools-projects-changed"));
    const focusTab = (id: string) => requestAnimationFrame(() => bar.current?.querySelector<HTMLButtonElement>(`[data-workspace-tab="${id}"]`)?.focus());
    const startEdit = (project: Project) => {
        if (project.id === PERSONAL.id || removing) return;
        if (selectionTimer.current) clearTimeout(selectionTimer.current);
        skipBlur.current = false; setEditing(project.id); setName(project.name); setError("");
    };
    const cancelEdit = () => { const id = editing; setEditing(null); if (id && id !== "new") focusTab(id); };
    const save = () => {
        try {
            const id = editing === "new" ? createProject(name).id : editing;
            if (!id) return;
            if (editing !== "new") renameProject(id, name);
            setEditing(null); refresh(); setError(""); setNotice("Workspace saved."); focusTab(id);
        } catch (cause) { reportError(cause); }
    };
    return <div className="wb-project-bar">
        <div className="wb-project-heading"><span>{t("Workspaces")}</span><span className="wb-project-count" title={t("Up to 10 workspaces, including Personal.")}>{projects.length}/{MAX_PROJECTS}</span></div>
        <nav className="wb-project-tabs" aria-label={t("Workspaces")} ref={bar} onKeyDown={(event) => {
            if (!(event.target instanceof HTMLElement) || !event.target.matches("[data-workspace-tab]")) return;
            const tabs = [...bar.current!.querySelectorAll<HTMLButtonElement>("[data-workspace-tab]")];
            const index = tabs.indexOf(event.target as HTMLButtonElement);
            const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : event.key === "ArrowRight" ? (index + (direction === "rtl" ? -1 : 1) + tabs.length) % tabs.length : event.key === "ArrowLeft" ? (index + (direction === "rtl" ? 1 : -1) + tabs.length) % tabs.length : -1;
            if (next >= 0) { event.preventDefault(); tabs[next]?.focus(); }
        }}>
            {projects.map((project) => <div key={project.id} className={`wb-project-tab${active === project.id ? " is-active" : ""}`}>
                {editing === project.id ? <form className="wb-project-inline-editor wb-project-rename-editor" onSubmit={(event) => { event.preventDefault(); skipBlur.current = true; save(); }}>
                    <input ref={editor} aria-label={t("Workspace name")} dir="auto" maxLength={100} value={name} onChange={(event) => setName(event.target.value)} onBlur={() => { if (!skipBlur.current) save(); }} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); skipBlur.current = true; cancelEdit(); } }} required />
                </form> : <>
                    <button type="button" className="wb-project-tab-name" data-workspace-tab={project.id} aria-current={active === project.id ? "page" : undefined} disabled={removing !== null} title={project.id === PERSONAL.id ? project.name : t("Double-click or press F2 to rename {name}", { name: project.name })} onDoubleClick={() => startEdit(project)} onKeyDown={(event) => { if (event.key === "F2" && project.id !== PERSONAL.id) { event.preventDefault(); startEdit(project); } }} onClick={(event) => {
                        if (selectionTimer.current) clearTimeout(selectionTimer.current);
                        if (active === project.id || event.detail > 1) return;
                        const select = () => { try { switchProject(project.id); } catch (cause) { reportError(cause); } };
                        // A double click on an inactive tab must rename before navigation reloads it.
                        if (event.detail === 0 || project.id === PERSONAL.id) select();
                        else selectionTimer.current = setTimeout(select, 500);
                    }}><bdi>{project.name}</bdi></button>
                    {project.id !== PERSONAL.id && <>
                        <Popconfirm title={t("Delete workspace permanently?")} description={<div className="wb-project-popconfirm"><p>{t("Permanently delete {name} and all its saved content, including encrypted vaults? This cannot be undone.", { name: project.name })}</p>{active === project.id && <p>{t("You will switch to Personal. Open tools reload and vaults lock.")}</p>}</div>} placement="bottom" okText={t("Delete permanently")} cancelText={t("Cancel")} okButtonProps={{ danger: true }} onOpenChange={(open) => { if (open && selectionTimer.current) clearTimeout(selectionTimer.current); }} onConfirm={() => {
                            try { queueProjectPurge(project.id); if (active === project.id) clearBridge(); window.dispatchEvent(new Event("mydevtools-project-lock")); window.location.reload(); } catch (cause) { reportError(cause); }
                        }}>
                            <button type="button" className="wb-project-tab-close" disabled={removing !== null} aria-label={t("Delete workspace {name}", { name: project.name })} title={t("Delete workspace")}><CloseOutlined /></button>
                        </Popconfirm>
                    </>}
                </>}
            </div>)}
        </nav>
        {editing === "new" ? <form className="wb-project-inline-editor wb-project-add-editor" onSubmit={(event) => { event.preventDefault(); save(); }}>
            <input ref={editor} aria-label={t("Workspace name")} placeholder={t("Workspace name")} dir="auto" value={name} maxLength={100} required onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") cancelEdit(); }} />
            <button type="submit" aria-label={t("Save workspace")} title={t("Save workspace")}><CheckOutlined /></button><button type="button" onClick={cancelEdit} aria-label={t("Cancel")} title={t("Cancel")}><CloseOutlined /></button>
        </form> : <button type="button" className="wb-project-add" disabled={removing !== null || projects.length >= MAX_PROJECTS} title={t(projects.length >= MAX_PROJECTS ? "Up to 10 workspaces, including Personal." : "Add workspace")} onClick={() => { setEditing("new"); setName(""); setError(""); }}><PlusOutlined />{t("Add workspace")}</button>}
        <div className="wb-project-links"><Link prefetch={false} href={toolPathFromId("project-workspaces") ?? "/"}>{t("Manage projects")}</Link><Link prefetch={false} href={toolPathFromId("tool-workbench") ?? "/"}>{t("Open tool tabs")}</Link></div>
        <p className={`wb-project-feedback${!error && !removing && !notice ? " sr-only" : ""}`} role={error ? "alert" : "status"}>{error ? <>{t(error)}{errorDetail && <span dir="auto"> {errorDetail}</span>}</> : removing ? t("Deleting {name} and its saved content…", { name: removing }) : notice ? t(notice) : t("Active workspace: {name}. Open tools and saved data belong to this workspace.", { name: projects.find((project) => project.id === active)?.name ?? PERSONAL.name })}</p>
    </div>;
}

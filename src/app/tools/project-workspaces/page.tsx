"use client";
import { useLanguage } from "@/components/LanguageProvider";

import { useEffect, useRef, useState } from "react";
import { ApartmentOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import ToolPageLayout from "@/components/ToolPageLayout";
import {
    MAX_PROJECTS, PERSONAL, PROJECTS_KEY, activeSessionProjectId, createProject, deleteProject,
    readDeletedProjects, readProjects, renameProject, restoreProject, purgeDeletedProject, switchProject,
    type DeletedProject, type Project,
} from "@/lib/project-storage";

export default function ProjectWorkspacesPage() {
    const { t, language } = useLanguage();
    const [projects, setProjects] = useState<Project[]>([PERSONAL]);
    const [deleted, setDeleted] = useState<DeletedProject[]>([]);
    const [active, setActive] = useState(PERSONAL.id);
    const [name, setName] = useState("");
    const [rename, setRename] = useState<Record<string, string>>({});
    const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
    const [pendingPurge, setPendingPurge] = useState<DeletedProject | null>(null);
    const [purgeName, setPurgeName] = useState("");
    const [purging, setPurging] = useState(false);
    const working = useRef(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState<{ source: string; name?: string } | null>(null);
    const refresh = () => {
        setProjects(readProjects(localStorage));
        setDeleted(readDeletedProjects(localStorage));
        setActive(activeSessionProjectId());
    };
    useEffect(() => {
        const update = () => { try { refresh(); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } };
        const changed = (event: StorageEvent) => { if (event.key === PROJECTS_KEY || event.key === null) update(); };
        update();
        window.addEventListener("storage", changed);
        window.addEventListener("mydevtools-projects-changed", update);
        return () => { window.removeEventListener("storage", changed); window.removeEventListener("mydevtools-projects-changed", update); };
    }, []);
    const perform = (action: () => void) => {
        try {
            action(); refresh(); window.dispatchEvent(new Event("mydevtools-projects-changed")); setError("");
        } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
    };
    const confirmDelete = () => {
        if (!pendingDelete) return;
        perform(() => {
            const { wasActive } = deleteProject(pendingDelete.id);
            setNotice({ source: "“{name}” moved to Deleted projects. You can restore it below.", name: pendingDelete.name });
            setPendingDelete(null);
            if (wasActive) switchProject(PERSONAL.id);
        });
    };
    const confirmPurge = async () => {
        if (!pendingPurge || purgeName !== pendingPurge.name || working.current) return;
        working.current = true; setPurging(true); setError("");
        try {
            await purgeDeletedProject(pendingPurge.id);
            setNotice({ source: "“{name}” and its saved project data were permanently deleted from this browser.", name: pendingPurge.name });
            setPendingPurge(null); setPurgeName("");
        } catch (cause) {
            setError(`Permanent deletion could not finish. Some records may already be removed. Retry deletion to finish.\n${cause instanceof Error ? cause.message : String(cause)}`);
        } finally {
            working.current = false; setPurging(false);
            try { refresh(); window.dispatchEvent(new Event("mydevtools-projects-changed")); }
            catch { setError("Refresh the page to verify project storage before continuing."); }
        }
    };

    return <ToolPageLayout title="Project Workspaces" description={t("Keep notes, snippets, bookmarks, workflows and connections separate for each project")} icon={<ApartmentOutlined />} color="#08979c">
        <div className="wb-workbench wb-projects">
            <p>{t("Personal contains your existing saved data. New projects start empty. Appearance settings are shared. Switching projects reloads open tools and locks vaults; save any unfinished work first.")}</p>
            <form className="wb-project-create" onSubmit={(event) => {
                event.preventDefault();
                perform(() => { const project = createProject(name); setName(""); setNotice({ source: "“{name}” created.", name: project.name }); });
            }}>
                <label>{t("New project name")}<input dir="auto" maxLength={100} value={name} onChange={(event) => setName(event.target.value)} required /></label>
                <button type="submit" disabled={projects.length >= MAX_PROJECTS}>{t("Create project")}</button>
            </form>
            <p>{t("{count} / {max} active workspaces, including Personal. Delete a workspace to free a slot; its saved data can be restored later.", { count: projects.length, max: MAX_PROJECTS })}</p>
            {notice && <p role="status">{t(notice.source, { name: notice.name ?? "" })}</p>}
            {error && <p role="alert">{t("Review the settings and saved data, then try again.")} {error.split("\n").map((line, index) => <span key={index}>{index > 0 && " "}{t(line)}</span>)}</p>}
            <table className="wb-data-table wb-projects-table" role="table" aria-label={t("Projects")}>
                <colgroup><col className="wb-project-column-name" /><col className="wb-project-column-date" /><col className="wb-project-column-actions" /></colgroup>
                <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">{t("Project")}</th><th scope="col" role="columnheader">{t("Created")}</th><th scope="col" role="columnheader">{t("Actions")}</th></tr></thead>
                <tbody role="rowgroup">{projects.map((project) => <tr key={project.id} role="row">
                    <td role="cell"><div className="wb-project-name">
                        {project.id === PERSONAL.id ? <span className="wb-project-personal"><bdi>{project.name}</bdi></span> : <input dir="auto" aria-label={t("Name for {name}", { name: project.name })} value={rename[project.id] ?? project.name} maxLength={100} onChange={(event) => setRename({ ...rename, [project.id]: event.target.value })} />}
                        {active === project.id && <span className="wb-project-status">{t("Current")}</span>}
                    </div></td>
                    <td role="cell" className="wb-project-created"><span className="wb-project-mobile-label" aria-hidden="true">{t("Created")}</span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString(language) : t("Existing data")}</td>
                    <td role="cell"><div className="wb-project-actions">
                        {project.id !== PERSONAL.id && <button type="button" aria-label={t("Rename {name}", { name: project.name })} onClick={() => perform(() => { renameProject(project.id, rename[project.id] ?? project.name); setNotice({ source: "Project renamed." }); })}>{t("Rename")}</button>}
                        <button type="button" disabled={active === project.id} aria-label={active === project.id ? t("{name} is the current project", { name: project.name }) : t("Switch to {name}", { name: project.name })} onClick={() => perform(() => switchProject(project.id))}>{active === project.id ? t("Active") : t("Switch")}</button>
                        {project.id !== PERSONAL.id && <button type="button" className="wb-project-delete" aria-label={t("Delete {name}", { name: project.name })} onClick={() => { setError(""); setPendingDelete(project); }}><DeleteOutlined aria-hidden="true" />{t("Delete")}</button>}
                    </div></td>
                </tr>)}</tbody>
            </table>
            {deleted.length > 0 && <details className="wb-project-deleted">
                <summary>{t("Deleted projects ({count})", { count: deleted.length })}</summary>
                <p>{t("Saved data and encrypted vaults stay on this device. Restore a project to use them again.")}</p>
                <ul>{deleted.map((project) => <li key={project.id}>
                    <div className="wb-project-deleted-info"><strong><bdi>{project.name}</bdi></strong><span>{project.purgeStartedAt ? t("Permanent deletion incomplete — retry to finish") : t("Deleted {date}", { date: new Date(project.deletedAt).toLocaleDateString(language) })}</span></div>
                    <div className="wb-project-actions"><button type="button" disabled={purging || !!project.purgeStartedAt || projects.length >= MAX_PROJECTS} aria-label={t("Restore {name}", { name: project.name })} onClick={() => perform(() => { restoreProject(project.id); setNotice({ source: "“{name}” restored with its saved data.", name: project.name }); })}>{t("Restore")}</button><button type="button" disabled={purging} className="wb-project-delete" aria-label={t("Delete {name} permanently", { name: project.name })} onClick={() => { setPendingPurge(project); setPurgeName(""); setError(""); }}><DeleteOutlined aria-hidden="true" />{t("Delete permanently")}</button></div>
                </li>)}</ul>
            </details>}
            <p>{t("Projects separate saved records in this browser. They are not separate user accounts or a security boundary against scripts running on this origin. Use encrypted vaults for secrets and keep backups before clearing browser storage.")}</p>
        </div>
        <Modal open={pendingDelete !== null} title={t("Delete project?")} onCancel={() => setPendingDelete(null)} footer={null} destroyOnHidden>
            <div className="wb-workbench wb-project-delete-confirm">
                <p>{t("Move {name} to Deleted projects? Its saved data and encrypted vaults will stay on this device, and you can restore it from this page.", { name: pendingDelete?.name ?? "" })}</p>
                {pendingDelete?.id === active && <p>{t("You’ll switch to Personal. Open tools will reload and vaults will lock.")}</p>}
                {error && <p role="alert">{t("Review the settings and saved data, then try again.")} {error.split("\n").map((line, index) => <span key={index}>{index > 0 && " "}{t(line)}</span>)}</p>}
                <div className="wb-project-actions"><button type="button" onClick={() => setPendingDelete(null)}>{t("Cancel")}</button><button type="button" className="wb-project-delete" onClick={confirmDelete}>{t("Delete project")}</button></div>
            </div>
        </Modal>
        <Modal open={pendingPurge !== null} title={t("Delete project permanently?")} onCancel={() => { if (!purging) setPendingPurge(null); }} closable={!purging} keyboard={!purging} footer={null} destroyOnHidden>
            <div className="wb-workbench wb-project-delete-confirm" aria-busy={purging}>
                <p>{t("This removes {name}, its saved tool data, tasks, encrypted credentials and files from this browser. This cannot be undone. Export any backups you need first.", { name: pendingPurge?.name ?? "" })}</p>
                <label>{t("Type {name} to confirm", { name: pendingPurge?.name ?? "" })}<input dir="auto" value={purgeName} onChange={(event) => setPurgeName(event.target.value)} disabled={purging} autoComplete="off" spellCheck={false} /></label>
                {error && <p role="alert">{t("Review the settings and saved data, then try again.")} {error.split("\n").map((line, index) => <span key={index}>{index > 0 && " "}{t(line)}</span>)}</p>}
                <div className="wb-project-actions"><button type="button" autoFocus disabled={purging} onClick={() => setPendingPurge(null)}>{t("Cancel")}</button><button type="button" className="wb-project-delete" disabled={purging || purgeName !== pendingPurge?.name} onClick={() => void confirmPurge()}>{purging ? t("Deleting…") : t("Delete permanently")}</button></div>
            </div>
        </Modal>
    </ToolPageLayout>;
}

/** Project storage keeps existing, unprefixed records in Personal. It never copies
 * secrets into a new project. Switching projects reloads the app to drop drafts. */
import { removeProjectIndexedData } from "./project-purge";
import { getToolIdFromPublicPath, toolPathFromId } from "./category-routes";
import { clearBridge } from "./tool-bridge";
export const PROJECTS_KEY = "mydevtools-projects-v1";
export const ACTIVE_PROJECT_KEY = "mydevtools-active-project-v1";
export const PROJECT_LOCATION_KEY = "mydevtools-workspace-location-v1";
export const PERSONAL_PROJECT = "personal";
/** Includes Personal; deleted workspaces do not consume an active slot. */
export const MAX_PROJECTS = 10;
export interface Project { id: string; name: string; createdAt: string }
export interface DeletedProject extends Project { deletedAt: string; purgeStartedAt?: string; purgeQueuedAt?: string }
type StoredProject = Project & { deletedAt?: string; purgeStartedAt?: string; purgeQueuedAt?: string };
export const PERSONAL: Project = { id: PERSONAL_PROJECT, name: "Personal", createdAt: "" };
const PROJECT_ID = /^(personal|[a-f0-9-]{36})$/;
const PREFIX = "mydevtools:project:";
let sessionProject: string | undefined;

function storedProjects(storage: Pick<Storage, "getItem">): StoredProject[] {
    const raw = storage.getItem(PROJECTS_KEY);
    if (!raw) return [PERSONAL];
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) throw new Error("Project list is invalid. Restore a project-list backup before continuing.");
    const projects: StoredProject[] = [PERSONAL];
    for (const row of value) {
        if (row && typeof row === "object" && typeof row.id === "string" && PROJECT_ID.test(row.id) && row.id !== PERSONAL_PROJECT && typeof row.name === "string" && row.name.trim() && !projects.some((p) => p.id === row.id)) {
            projects.push({ id: row.id, name: row.name.slice(0, 100), createdAt: typeof row.createdAt === "string" ? row.createdAt : "", ...(typeof row.deletedAt === "string" && Number.isFinite(Date.parse(row.deletedAt)) ? { deletedAt: row.deletedAt, ...(typeof row.purgeStartedAt === "string" ? { purgeStartedAt: row.purgeStartedAt } : {}), ...(typeof row.purgeQueuedAt === "string" ? { purgeQueuedAt: row.purgeQueuedAt } : {}) } : {}) });
        }
    }
    return projects;
}

export function readProjects(storage: Pick<Storage, "getItem">): Project[] {
    return storedProjects(storage).filter((project) => !project.deletedAt);
}

export function readDeletedProjects(storage: Pick<Storage, "getItem">): DeletedProject[] {
    return storedProjects(storage).filter((project): project is DeletedProject => !!project.deletedAt);
}

export function activeProjectId(storage?: Pick<Storage, "getItem">): string {
    if (!storage && typeof window === "undefined") return PERSONAL_PROJECT;
    const source = storage ?? window.localStorage;
    const id = source.getItem(ACTIVE_PROJECT_KEY) ?? PERSONAL_PROJECT;
    if (!PROJECT_ID.test(id)) return PERSONAL_PROJECT;
    return readProjects(source).some((p) => p.id === id) ? id : PERSONAL_PROJECT;
}

/** Keep a page's records in its original project until reload, including the
 * small interval before another tab's storage event arrives. */
export function activeSessionProjectId(): string {
    if (typeof window === "undefined") return PERSONAL_PROJECT;
    if (sessionProject === undefined) sessionProject = activeProjectId();
    return sessionProject;
}

export function projectKey(key: string, id = activeProjectId()): string {
    if (!PROJECT_ID.test(id)) throw new Error("Invalid project identifier.");
    return id === PERSONAL_PROJECT ? key : `${PREFIX}${id}:${key}`;
}

/** A stale document must never recreate data after another tab closes its
 * workspace. Check the original namespace immediately before each write. */
export function assertProjectWritable(id: string, storage?: Pick<Storage, "getItem">): void {
    if (id === PERSONAL_PROJECT) return;
    const source = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
    if (!source || !readProjects(source).some((project) => project.id === id)) throw new Error("Project not found.");
}

export function createProject(name: string, storage: Storage = window.localStorage): Project {
    if (!name.trim()) throw new Error("Enter a project name.");
    const projects = storedProjects(storage);
    if (projects.filter((project) => !project.deletedAt).length >= MAX_PROJECTS) throw new Error("The workspace limit is 10, including Personal. Delete or reuse an existing workspace.");
    const project = { id: crypto.randomUUID(), name: name.trim().slice(0, 100), createdAt: new Date().toISOString() };
    storage.setItem(PROJECTS_KEY, JSON.stringify([...projects, project]));
    return project;
}

export function renameProject(id: string, name: string, storage: Storage = window.localStorage) {
    if (!name.trim()) throw new Error("Enter a project name.");
    const projects = storedProjects(storage);
    if (id === PERSONAL_PROJECT) throw new Error("Personal is the permanent home of existing data.");
    if (!projects.some((p) => p.id === id && !p.deletedAt)) throw new Error("Project not found.");
    storage.setItem(PROJECTS_KEY, JSON.stringify(projects.map((p) => p.id === id ? { ...p, name: name.trim().slice(0, 100) } : p)));
}

/** Delete only the project-list entry, retaining its storage namespace for Restore.
 * A single atomic write keeps project metadata and its deleted state together. */
export function deleteProject(id: string, storage: Storage = window.localStorage): { wasActive: boolean } {
    if (id === PERSONAL_PROJECT) throw new Error("Personal is the permanent home of existing data and cannot be deleted.");
    const projects = storedProjects(storage);
    if (!projects.some((project) => project.id === id && !project.deletedAt)) throw new Error("Project not found.");
    const wasActive = activeProjectId(storage) === id;
    storage.setItem(PROJECTS_KEY, JSON.stringify(projects.map((project) => project.id === id ? { ...project, deletedAt: new Date().toISOString() } : project)));
    return { wasActive };
}

/** A confirmed tab close queues removal in one write. The shell reloads before
 * processing it so the deleted workspace's mounted tools cannot save new data. */
export function queueProjectPurge(id: string, storage: Storage = window.localStorage): void {
    if (id === PERSONAL_PROJECT) throw new Error("Personal cannot be permanently deleted.");
    const projects = storedProjects(storage);
    if (!projects.some((project) => project.id === id && !project.deletedAt)) throw new Error("Project not found.");
    const now = new Date().toISOString();
    storage.setItem(PROJECTS_KEY, JSON.stringify(projects.map((project) => project.id === id ? { ...project, deletedAt: now, purgeStartedAt: now, purgeQueuedAt: now } : project)));
}

export function restoreProject(id: string, storage: Storage = window.localStorage): void {
    const projects = storedProjects(storage);
    if (!projects.some((project) => project.id === id && project.deletedAt)) throw new Error("Deleted project not found.");
    if (projects.find((project) => project.id === id)?.purgeStartedAt) throw new Error("Permanent deletion has started. Retry deletion to finish removing this project's data.");
    if (projects.filter((project) => !project.deletedAt).length >= MAX_PROJECTS) throw new Error("The workspace limit is 10, including Personal. Delete another workspace before restoring this one.");
    storage.setItem(PROJECTS_KEY, JSON.stringify(projects.map((project) => project.id === id ? { ...project, deletedAt: undefined } : project)));
}

/** Called only after an explicit permanent-deletion confirmation. A durable
 * marker prevents Restore from presenting partially removed data as intact.
 * On failure, the deleted row remains available for a safe, idempotent retry. */
export async function purgeDeletedProject(id: string, storage: Storage = window.localStorage, removeIndexedData = removeProjectIndexedData): Promise<void> {
    if (id === PERSONAL_PROJECT) throw new Error("Personal cannot be permanently deleted.");
    const projects = storedProjects(storage);
    const project = projects.find((row) => row.id === id && row.deletedAt);
    if (!project) throw new Error("Deleted project not found.");
    storage.setItem(PROJECTS_KEY, JSON.stringify(projects.map((row) => row.id === id ? { ...row, purgeStartedAt: row.purgeStartedAt ?? new Date().toISOString() } : row)));
    await removeIndexedData(id);
    const prefix = `${PREFIX}${id}:`;
    const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter((key): key is string => !!key && key.startsWith(prefix));
    for (const key of keys) storage.removeItem(key);
    if (storage.getItem(ACTIVE_PROJECT_KEY) === id) storage.removeItem(ACTIVE_PROJECT_KEY);
    storage.setItem(PROJECTS_KEY, JSON.stringify(storedProjects(storage).filter((row) => row.id !== id)));
}

/** Store only known app paths: shared-input queries, URLs and fragments must not
 * be replayed in another workspace or retained as navigation history. */
export function normalizeProjectPath(pathname: string): string | null {
    if (!pathname.startsWith("/") || pathname.startsWith("//")) return null;
    const path = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
    if (["/", "/memory", "/guides", "/release-notes"].includes(path)) return path;
    const toolId = getToolIdFromPublicPath(path);
    return toolId ? toolPathFromId(toolId) : null;
}

export function rememberProjectPath(pathname: string, storage: Storage = window.localStorage, id = activeSessionProjectId()): void {
    const path = normalizeProjectPath(pathname);
    if (!path) return;
    assertProjectWritable(id, storage);
    storage.setItem(projectKey(PROJECT_LOCATION_KEY, id), path);
}

export function projectDestination(id: string, storage: Storage = window.localStorage): string {
    const fallback = toolPathFromId("tool-workbench") ?? "/";
    try { return normalizeProjectPath(storage.getItem(projectKey(PROJECT_LOCATION_KEY, id)) ?? "") ?? fallback; }
    catch { return fallback; }
}

function projectHostWindow(): Window {
    try { if (window.parent !== window && window.parent.location.origin === window.location.origin) return window.parent; }
    catch { /* Cross-origin embedding cannot navigate its parent. */ }
    return window;
}

/** A full navigation drops the previous document's drafts and frozen storage
 * namespace, while restoring the destination workspace's own last screen. */
export function reloadActiveProject(): void {
    const destination = projectDestination(activeProjectId());
    const host = projectHostWindow();
    clearBridge();
    window.dispatchEvent(new Event("mydevtools-project-lock"));
    if (host !== window) host.dispatchEvent(new Event("mydevtools-project-lock"));
    if (host.location.pathname === destination && !host.location.search && !host.location.hash) host.location.reload();
    else host.location.assign(destination);
}

export function switchProject(id: string) {
    if (!readProjects(window.localStorage).some((p) => p.id === id)) throw new Error("Project not found.");
    // Navigation persistence is optional; a quota error must not prevent a
    // successful active-project write or lose existing saved records.
    try { rememberProjectPath(projectHostWindow().location.pathname); } catch { /* Keep the previous saved path. */ }
    window.localStorage.setItem(ACTIVE_PROJECT_KEY, id);
    reloadActiveProject();
}

/** Factory is also used by regression tests without a browser. */
export function scopedStorage(storage: Storage, id: () => string): Storage {
    const keys = () => Array.from({ length: storage.length }, (_, i) => storage.key(i)).filter((key): key is string => key !== null).filter((key) => id() === PERSONAL_PROJECT ? !key.startsWith(PREFIX) && key !== PROJECTS_KEY && key !== ACTIVE_PROJECT_KEY : key.startsWith(`${PREFIX}${id()}:`));
    return {
        get length() { return keys().length; },
        key(index) { const key = keys()[index]; return key === undefined ? null : id() === PERSONAL_PROJECT ? key : key.slice(`${PREFIX}${id()}:`.length); },
        getItem(key) { return storage.getItem(projectKey(key, id())); },
        setItem(key, value) { const current = id(); assertProjectWritable(current, storage); storage.setItem(projectKey(key, current), value); },
        removeItem(key) { storage.removeItem(projectKey(key, id())); },
        clear() { keys().forEach((key) => storage.removeItem(key)); },
    };
}

export const projectStorage: Pick<Storage, "getItem" | "setItem" | "removeItem"> = {
    getItem(key) { return window.localStorage.getItem(projectKey(key, activeSessionProjectId())); },
    setItem(key, value) { const id = activeSessionProjectId(); assertProjectWritable(id); window.localStorage.setItem(projectKey(key, id), value); },
    removeItem(key) { window.localStorage.removeItem(projectKey(key, activeSessionProjectId())); },
};

export function projectDatabaseName(name: string): string { const id = activeSessionProjectId(); assertProjectWritable(id); return projectKey(name, id); }

/** Appearance stays global; bookmarks and recent tools follow the project. */
export function appStateStorage(storage: Storage, currentProject = () => activeProjectId(storage)): Pick<Storage, "getItem" | "setItem" | "removeItem"> {
    return {
        getItem(name) {
            const original = storage.getItem(name);
            if (currentProject() === PERSONAL_PROJECT) return original;
            const globalState = original ? JSON.parse(original) : { state: {}, version: 0 };
            const scoped = storage.getItem(projectKey(name, currentProject()));
            const localState = scoped ? JSON.parse(scoped) : { state: { recentTools: [], bookmarks: [] }, version: 0 };
            return JSON.stringify({ ...localState, state: { ...localState.state, darkMode: globalState.state.darkMode ?? false, sidebarCollapsed: globalState.state.sidebarCollapsed ?? false } });
        },
        setItem(name, value) {
            const id = currentProject();
            assertProjectWritable(id, storage);
            if (id === PERSONAL_PROJECT) { storage.setItem(name, value); return; }
            const next = JSON.parse(value);
            const original = storage.getItem(name);
            const globalState = original ? JSON.parse(original) : { state: {}, version: 0 };
            storage.setItem(name, JSON.stringify({ ...globalState, state: { ...globalState.state, darkMode: next.state.darkMode, sidebarCollapsed: next.state.sidebarCollapsed } }));
            storage.setItem(projectKey(name, id), value);
        },
        removeItem(name) { storage.removeItem(projectKey(name, currentProject())); },
    };
}

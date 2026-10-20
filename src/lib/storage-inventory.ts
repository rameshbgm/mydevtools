import { ACTIVE_PROJECT_KEY, MAX_PROJECTS, PROJECTS_KEY, PERSONAL_PROJECT, projectKey, readDeletedProjects, readProjects, type Project } from "./project-storage";
import { SEEN_RELEASE_KEY } from "./release-preference";
import { LANGUAGE_KEY } from "./i18n/catalog";
import { redactDocument } from "./redaction";

export type StorageEngine = "local" | "session" | "indexeddb" | "vault" | "cache";
export interface StorageRow {
    id: string; engine: StorageEngine; label: string; key: string; scope: string;
    description: string; count?: number; bytes?: number; database?: string; store?: string;
    recordKey?: IDBValidKey; toolId?: string; protected?: boolean;
}
export interface StorageSnapshot { rows: StorageRow[]; projects: (Project & { deletedAt?: string })[]; warnings: string[] }
export interface StorageEnvironment { local: Storage; session: Storage; idb?: IDBFactory; cache?: CacheStorage }
const KNOWN: Record<string, { label: string; description: string; toolId?: string }> = {
    "mydevtools-sql-queries-v1": { label: "Saved SQL queries", description: "Saved query names and SQL text.", toolId: "sql-client" },
    "mydevtools-code-snippets-v1": { label: "Code snippets", description: "Code, languages and tags.", toolId: "code-snippets" },
    "mydevtools-resource-bookmarks-v1": { label: "Resource bookmarks", description: "Saved external links, folders and tags.", toolId: "resource-bookmarks" },
    "mydevtools-tool-tabs-v1": { label: "Tool tabs", description: "Saved tab list and order.", toolId: "tool-workbench" },
    "api-builder-runner-plan-v1": { label: "API collection plan", description: "Saved request order, assertions, capture rules and iteration settings. Results remain in page memory.", toolId: "api-request-builder" },
    "mydevtools-workflows-v1": { label: "Saved workflows", description: "Workflow steps, pins and optional redacted fixtures.", toolId: "saved-workflows" },
    "mydevtools-workflow-draft-v1": { label: "Workflow input draft", description: "Input saved through the Remember input option.", toolId: "saved-workflows" },
    "devtools-hub-storage": { label: "App preferences and shortcuts", description: "Theme, sidebar, recently used tools and bookmark menu." },
    "mcp-inspector-config": { label: "MCP connection settings", description: "Saved endpoint, authentication and connection options.", toolId: "mcp-inspector" },
    "mcp-inspector-history": { label: "MCP call history", description: "Saved tool call history.", toolId: "mcp-inspector" },
    "a2a-inspector-config": { label: "A2A connection settings", description: "Saved endpoint and connection options.", toolId: "a2a-inspector" },
    "a2a-inspector-url": { label: "A2A endpoint", description: "Legacy saved agent endpoint.", toolId: "a2a-inspector" },
    "api-builder-saved-requests": { label: "Saved API requests", description: "Request definitions saved on this device.", toolId: "api-request-builder" },
    "api-builder-history": { label: "API request history", description: "Past requests saved on this device.", toolId: "api-request-builder" },
    "api-builder-environments": { label: "API environments", description: "Saved environment variables; may contain sensitive values.", toolId: "api-request-builder" },
    "wb-sticky-notes-v1": { label: "Sticky notes", description: "Note titles, content, colors and pins.", toolId: "sticky-notes" },
    "wb-rich-text-docs-v1": { label: "Rich text documents", description: "Document titles, content and timestamps.", toolId: "rich-text-editor" },
    "spin-wheel-items": { label: "Spin wheel options", description: "Saved wheel options.", toolId: "spin-wheel" },
    [PROJECTS_KEY]: { label: "Project catalogue", description: "Active and deleted project names and identifiers. Manage this through Project Workspaces.", toolId: "project-workspaces" },
    [ACTIVE_PROJECT_KEY]: { label: "Active project preference", description: "The selected workspace. Change it through the project selector.", toolId: "project-workspaces" },
    [SEEN_RELEASE_KEY]: { label: "What’s new preference", description: "The last release opened in this browser." },
    [LANGUAGE_KEY]: { label: "Interface language", description: "Shared language preference for this browser profile." },
    "mydevtools-workspace-mode": { label: "Workspace appearance", description: "Focused or full workspace view." },
    "mydevtools.bridge.payload": { label: "Pending tool handoff", description: "Temporary payload in this tab, with a short expiry." },
};
const GLOBAL_KEYS = new Set([PROJECTS_KEY, ACTIVE_PROJECT_KEY, SEEN_RELEASE_KEY, LANGUAGE_KEY, "mydevtools-workspace-mode", "devtools-hub-storage"]);
export function storageScope(key: string): { scope: string; baseKey: string } {
    const match = /^mydevtools:project:([^:]+):(.*)$/.exec(key);
    return match ? { scope: match[1], baseKey: match[2] } : { scope: GLOBAL_KEYS.has(key) ? "global" : PERSONAL_PROJECT, baseKey: key };
}
export function storageBytes(value: string): number { return new TextEncoder().encode(value).length; }
export function formatStorageBytes(bytes?: number): string {
    if (bytes === undefined) return "Not measured";
    return bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
export function storageValueText(value: unknown, raw = false, limit = 65_536): string {
    const seen = new WeakSet<object>();
    const text = typeof value === "string" ? value : JSON.stringify(value, (_key, item) => {
        if (typeof item === "bigint") return item.toString();
        if (item instanceof ArrayBuffer) return { type: "ArrayBuffer", bytes: item.byteLength };
        if (ArrayBuffer.isView(item)) return { type: item.constructor.name, values: Array.from(new Uint8Array(item.buffer, item.byteOffset, Math.min(item.byteLength, 4096))), totalBytes: item.byteLength };
        if (typeof Blob !== "undefined" && item instanceof Blob) return { type: "Blob", mime: item.type, bytes: item.size };
        if (item && typeof item === "object") { if (seen.has(item)) return "[Circular reference]"; seen.add(item); }
        return item;
    }, 2) ?? "null";
    const display = raw ? text : redactDocument(text);
    return display.length > limit ? `${display.slice(0, limit)}\n\nPreview truncated. Export to read the complete record.` : display;
}
export async function openStoredDatabase(factory: IDBFactory, name: string): Promise<IDBDatabase | null> {
    return new Promise((resolve, reject) => {
        let finished = false, missing = false;
        const request = factory.open(name);
        const timer = setTimeout(() => { finished = true; reject(new Error(`Database ${name} did not respond.`)); }, 12_000);
        request.onupgradeneeded = () => { missing = true; request.transaction?.abort(); };
        request.onsuccess = () => { clearTimeout(timer); if (finished) request.result.close(); else { finished = true; resolve(request.result); } };
        request.onerror = () => { clearTimeout(timer); if (finished) return; finished = true; if (missing) resolve(null); else reject(new Error(`Cannot read ${name}. Check browser storage permissions.`)); };
    });
}
function result<T>(request: IDBRequest<T>): Promise<T> { return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error ?? new Error("Storage request failed.")); }); }
export async function collectStorageInventory(env: StorageEnvironment): Promise<StorageSnapshot> {
    const rows: StorageRow[] = [], warnings: string[] = [];
    let projects: StorageSnapshot["projects"] = [];
    try { projects = [...readProjects(env.local), ...readDeletedProjects(env.local)]; } catch { warnings.push("The project catalogue could not be read. Its raw storage record is still listed for recovery."); }
    for (const [engine, storage] of [["local", env.local], ["session", env.session]] as const) {
        try {
            for (let index = 0; index < storage.length; index++) {
                const key = storage.key(index); if (key === null) continue;
                const value = storage.getItem(key); if (value === null) continue;
                const { scope, baseKey } = storageScope(key), known = KNOWN[baseKey];
                rows.push({ id: `${engine}:${key}`, engine, key, scope, label: known?.label ?? baseKey, description: known?.description ?? "Additional data saved on this site; included even when it is not in the tool catalogue.", toolId: known?.toolId, bytes: storageBytes(value), protected: engine === "local" && (key === PROJECTS_KEY || key === ACTIVE_PROJECT_KEY) });
            }
        } catch { warnings.push(`${engine === "local" ? "Local" : "Tab session"} storage could not be fully read.`); }
    }
    if (env.idb) {
        let databases: { name?: string }[];
        try {
            if (typeof env.idb.databases === "function") databases = await env.idb.databases();
            else { databases = [{ name: "DevToolsTodoDB" }, { name: "MyDevToolsEncryptedVaults" }, ...projects.filter((p) => p.id !== PERSONAL_PROJECT).map((p) => ({ name: `mydevtools:project:${p.id}:DevToolsTodoDB` }))]; warnings.push("This browser cannot enumerate databases. Known app databases are shown; other databases may be missing."); }
            for (const entry of databases) {
                if (!entry.name) continue;
                let db: IDBDatabase | null = null;
                try {
                    db = await openStoredDatabase(env.idb, entry.name); if (!db) continue;
                    for (const store of Array.from(db.objectStoreNames)) {
                        if (entry.name === "MyDevToolsEncryptedVaults" && store === "vaults") {
                            const keys = await result(db.transaction(store).objectStore(store).getAllKeys());
                            if (!keys.length) rows.push({ id: `idb:${entry.name}:${store}`, engine: "indexeddb", scope: "global", key: store, database: entry.name, store, count: 0, label: "Encrypted vault store", description: "No encrypted vaults have been saved in this database." });
                            for (const key of keys) {
                                const parts = typeof key === "string" ? key.split(":") : [];
                                const purpose = parts[1];
                                rows.push({ id: `vault:${JSON.stringify(key)}`, engine: "vault", scope: parts[0] || "unassigned", key: String(key), recordKey: key, database: entry.name, store, count: 1, label: purpose === "files" ? "Secure files vault" : purpose === "credentials" ? "Credential vault" : "Encrypted vault record", description: "Encrypted contents stay locked. View or export the encrypted envelope; use the vault tool to unlock its contents.", toolId: purpose === "files" ? "secure-files" : "credential-vault" });
                            }
                        } else {
                            const count = await result(db.transaction(store).objectStore(store).count());
                            const { scope } = storageScope(entry.name);
                            rows.push({ id: `idb:${entry.name}:${store}`, engine: "indexeddb", scope, key: store, database: entry.name, store, count, label: entry.name.endsWith("DevToolsTodoDB") ? `Tasks · ${store}` : `${entry.name} · ${store}`, description: "Browse every record in pages, export JSON or clear this object store.", toolId: entry.name.endsWith("DevToolsTodoDB") ? "todo-list" : undefined });
                        }
                    }
                } catch (cause) { warnings.push(cause instanceof Error ? cause.message : `Cannot read ${entry.name}.`); } finally { db?.close(); }
            }
        } catch { warnings.push("IndexedDB discovery failed. Database and encrypted vault data may be missing."); }
    } else warnings.push("IndexedDB is unavailable. Database and encrypted vault data cannot be inspected.");
    if (env.cache) try {
        for (const name of await env.cache.keys()) {
            const cache = await env.cache.open(name), requests = await cache.keys();
            rows.push({ id: `cache:${name}`, engine: "cache", scope: "global", label: "Offline cache", key: name, count: requests.length, description: "Cached pages and assets. Clearing this may reduce offline availability until pages are visited again." });
        }
    } catch { warnings.push("Offline caches could not be read."); }
    return { rows, projects, warnings };
}
export async function readStoredPage(row: StorageRow, env: StorageEnvironment, offset = 0, limit = 25): Promise<{ entries: { key: IDBValidKey; value: unknown }[]; hasMore: boolean }> {
    if (!env.idb || !row.database || !row.store || row.engine !== "indexeddb") throw new Error("Choose an IndexedDB object store.");
    const db = await openStoredDatabase(env.idb, row.database); if (!db) throw new Error("This database no longer exists. Refresh the inventory.");
    try { return await new Promise((resolve, reject) => {
        const entries: { key: IDBValidKey; value: unknown }[] = [];
        const request = db.transaction(row.store!).objectStore(row.store!).openCursor(); let skipped = offset === 0;
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const cursor = request.result;
            if (!cursor) { resolve({ entries, hasMore: false }); return; }
            if (!skipped) { skipped = true; cursor.advance(offset); return; }
            if (entries.length === limit) { resolve({ entries, hasMore: true }); return; }
            entries.push({ key: cursor.primaryKey, value: cursor.value }); cursor.continue();
        };
    }); } finally { db.close(); }
}
export async function readStorageRow(row: StorageRow, env: StorageEnvironment): Promise<unknown> {
    if (row.engine === "local" || row.engine === "session") return env[row.engine].getItem(row.key);
    if (row.engine === "cache") return (await (await env.cache!.open(row.key)).keys()).map((request) => ({ url: request.url, method: request.method }));
    if (row.engine === "indexeddb") return (await readStoredPage(row, env)).entries;
    if (!env.idb) throw new Error("IndexedDB is unavailable.");
    const db = await openStoredDatabase(env.idb, row.database!); if (!db) throw new Error("The vault no longer exists.");
    try { return await result(db.transaction(row.store!).objectStore(row.store!).get(row.recordKey!)); } finally { db.close(); }
}
export async function clearStorageRow(row: StorageRow, env: StorageEnvironment, includeProtected = false): Promise<void> {
    if (row.protected && !includeProtected) throw new Error("Manage project metadata through Project Workspaces.");
    if (row.engine === "local" || row.engine === "session") { env[row.engine].removeItem(row.key); return; }
    if (row.engine === "cache") { await env.cache!.delete(row.key); return; }
    if (!env.idb) throw new Error("IndexedDB is unavailable.");
    const db = await openStoredDatabase(env.idb, row.database!); if (!db) return;
    try { await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(row.store!, "readwrite");
        if (row.engine === "vault") transaction.objectStore(row.store!).delete(row.recordKey!);
        else transaction.objectStore(row.store!).clear();
        transaction.oncomplete = () => resolve(); transaction.onabort = transaction.onerror = () => reject(new Error("Data could not be cleared. Close other tabs and retry."));
    }); } finally { db.close(); }
}
export interface LocalStorageBackup { format: "mydevtools-storage"; version: 1; exportedAt: string; redacted: boolean; projects?: (Project & { deletedAt?: string; purgeStartedAt?: string })[]; entries: { engine: "local" | "session"; key: string; value: string }[] }
export function exportLocalRecords(rows: StorageRow[], env: StorageEnvironment, includeSensitive = false): LocalStorageBackup {
    const usedScopes = new Set(rows.filter((row) => row.engine === "local" || row.engine === "session").map((row) => row.scope));
    let projects: LocalStorageBackup["projects"] = [];
    try { projects = [...readProjects(env.local), ...readDeletedProjects(env.local)].filter((project) => project.id !== PERSONAL_PROJECT && usedScopes.has(project.id)); } catch { /* A corrupt catalogue remains exportable as its raw record. */ }
    return { format: "mydevtools-storage", version: 1, exportedAt: new Date().toISOString(), redacted: !includeSensitive, projects, entries: rows.filter((row) => row.engine === "local" || row.engine === "session").flatMap((row) => {
        const value = env[row.engine as "local" | "session"].getItem(row.key);
        return value === null ? [] : [{ engine: row.engine as "local" | "session", key: row.key, value: includeSensitive ? value : redactDocument(value) }];
    }) };
}
export function parseLocalRecords(text: string, legacyProjectId = PERSONAL_PROJECT): LocalStorageBackup {
    if (storageBytes(text) > 20 * 1024 * 1024) throw new Error("Storage import limit is 20 MiB.");
    const value = JSON.parse(text);
    if (value && typeof value === "object" && !Array.isArray(value) && !value.format && typeof value.exportedAt === "string") {
        const entries = Object.entries(value).filter(([key]) => key in KNOWN && !GLOBAL_KEYS.has(key) || key === "devtools-hub-storage").map(([key, raw]) => ({ engine: "local" as const, key: projectKey(key, legacyProjectId), value: typeof raw === "string" ? raw : JSON.stringify(raw) }));
        if (entries.length) return { format: "mydevtools-storage", version: 1, exportedAt: value.exportedAt, redacted: true, entries };
    }
    if (value?.format !== "mydevtools-storage" || value.version !== 1 || !Array.isArray(value.entries) || value.entries.length > 10_000 || value.entries.some((entry: Record<string, unknown>) => !entry || !["local", "session"].includes(String(entry.engine)) || typeof entry.key !== "string" || entry.key.length > 2048 || typeof entry.value !== "string")) throw new Error("Choose a version 1 My Dev Tools local/session storage export.");
    const ids = new Set<string>();
    for (const entry of value.entries) { const id = `${entry.engine}:${entry.key}`; if (ids.has(id)) throw new Error("The import contains duplicate storage keys."); ids.add(id); }
    if (value.projects !== undefined && (!Array.isArray(value.projects) || value.projects.some((project: Record<string, unknown>) => !project || typeof project.id !== "string" || !/^[a-f0-9-]{36}$/.test(project.id) || typeof project.name !== "string" || !project.name.trim() || typeof project.createdAt !== "string" || (project.deletedAt !== undefined && (typeof project.deletedAt !== "string" || !Number.isFinite(Date.parse(project.deletedAt)))) || (project.purgeStartedAt !== undefined && (typeof project.purgeStartedAt !== "string" || !Number.isFinite(Date.parse(project.purgeStartedAt))))))) throw new Error("Project metadata in the import is invalid.");
    for (const entry of value.entries) if (entry.engine === "local" && entry.key === PROJECTS_KEY && !Array.isArray(JSON.parse(entry.value))) throw new Error("Project catalogue in the import is invalid.");
    return value as LocalStorageBackup;
}

/** A filtered project export carries enough catalogue metadata to be usable on
 * another device. Merge instead of orphaning projects that already exist. */
export function localImportEntries(backup: LocalStorageBackup, env: StorageEnvironment): LocalStorageBackup["entries"] {
    const catalogue = backup.entries.find((entry) => entry.engine === "local" && entry.key === PROJECTS_KEY);
    const incoming = [...backup.projects ?? [], ...(catalogue ? [...readProjects({ getItem: () => catalogue.value }), ...readDeletedProjects({ getItem: () => catalogue.value })] : [])];
    if (!incoming.length) return backup.entries;
    const current = [...readProjects(env.local), ...readDeletedProjects(env.local)];
    const merged = new Map(current.map((project) => [project.id, project]));
    for (const project of incoming) {
        const existing = merged.get(project.id) as Project & { purgeStartedAt?: string } | undefined;
        // A backup is data, never authorization to run a destructive tab close.
        const imported = { ...project } as Project & { purgeQueuedAt?: string };
        delete imported.purgeQueuedAt;
        merged.set(project.id, existing?.purgeStartedAt ? existing : imported);
    }
    const activeBefore = readProjects(env.local).length;
    const activeAfter = [...merged.values()].filter((project) => !("deletedAt" in project && project.deletedAt)).length;
    if (activeAfter > Math.max(MAX_PROJECTS, activeBefore)) throw new Error("The workspace limit is 10, including Personal. Delete or reuse an existing workspace.");
    return [...backup.entries.filter((entry) => !(entry.engine === "local" && entry.key === PROJECTS_KEY)), { engine: "local", key: PROJECTS_KEY, value: JSON.stringify([...merged.values()]) }];
}

export function restoreLocalRecords(backup: LocalStorageBackup, env: StorageEnvironment): number {
    const entries = localImportEntries(backup, env);
    const originals = entries.map((entry) => ({ ...entry, previous: env[entry.engine].getItem(entry.key) }));
    try { for (const entry of entries) env[entry.engine].setItem(entry.key, entry.value); }
    catch (cause) {
        let rollbackFailed = false;
        for (const entry of originals.toReversed()) {
            try { if (entry.previous === null) env[entry.engine].removeItem(entry.key); else env[entry.engine].setItem(entry.key, entry.previous); }
            catch { rollbackFailed = true; }
        }
        throw new Error(`Import could not finish. ${rollbackFailed ? "Some previous values could not be restored; verify your records and use a backup." : "Previous values were restored."} Check storage permissions/quota. ${cause instanceof Error ? cause.message : ""}`);
    }
    return entries.length;
}

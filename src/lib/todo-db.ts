"use client";

// ─── IndexedDB Todo Database Module ──────────────────────────────────
// Production-grade IndexedDB wrapper for Personal Todo List

const DB_NAME = "DevToolsTodoDB";
const DB_VERSION = 1;
const STORE_NAME = "todos";
const SETTINGS_STORE = "settings";
const CATEGORIES_STORE = "categories";

// ─── Types ───────────────────────────────────────────────────────────

export type Priority = "critical" | "high" | "medium" | "low" | "none";

export type Status =
    | "backlog"
    | "todo"
    | "in-progress"
    | "review"
    | "done"
    | "blocked"
    | "waiting"
    | "cancelled";

export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
    isDefault: boolean;
    createdAt: string;
}

export interface Subtask {
    id: string;
    title: string;
    done: boolean;
    completedAt: string | null;
}

export interface TodoItem {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    categoryId: string;
    dueDate: string | null;
    reminderDate: string | null;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
    tags: string[];
    estimatedHours: number;
    actualHours: number;
    subtasks: Subtask[];
    notes: string;
    // Soft delete & archive
    isArchived: boolean;
    archivedAt: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    // Recurrence
    isRecurring: boolean;
    recurrencePattern: string | null; // e.g., "daily", "weekly", "monthly"
    // Relations
    parentId: string | null;
    projectId: string | null;
}

export interface TodoSettings {
    id: string;
    defaultCategory: string;
    defaultPriority: Priority;
    showArchived: boolean;
    showDeleted: boolean;
    defaultView: "list" | "board" | "calendar";
    autoArchiveCompletedDays: number;
    lastExportDate: string | null;
}

export interface ExportData {
    version: string;
    exportedAt: string;
    todos: TodoItem[];
    categories: Category[];
    settings: TodoSettings;
}

// ─── Default Data ────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: Omit<Category, "createdAt">[] = [
    { id: "work", name: "Work", color: "#1677ff", icon: "💼", isDefault: true },
    { id: "personal", name: "Personal", color: "#722ed1", icon: "👤", isDefault: true },
    { id: "health", name: "Health & Fitness", color: "#52c41a", icon: "💪", isDefault: true },
    { id: "learning", name: "Learning", color: "#fa541c", icon: "📚", isDefault: true },
    { id: "finance", name: "Finance", color: "#faad14", icon: "💰", isDefault: true },
    { id: "home", name: "Home", color: "#eb2f96", icon: "🏠", isDefault: true },
    { id: "shopping", name: "Shopping", color: "#13c2c2", icon: "🛒", isDefault: true },
    { id: "travel", name: "Travel", color: "#2f54eb", icon: "✈️", isDefault: true },
    { id: "social", name: "Social", color: "#f5222d", icon: "🎉", isDefault: true },
    { id: "ideas", name: "Ideas", color: "#a0d911", icon: "💡", isDefault: true },
    { id: "errands", name: "Errands", color: "#fadb14", icon: "📋", isDefault: true },
    { id: "projects", name: "Projects", color: "#597ef7", icon: "🚀", isDefault: true },
    { id: "meetings", name: "Meetings", color: "#ff7a45", icon: "📅", isDefault: true },
    { id: "calls", name: "Calls", color: "#36cfc9", icon: "📞", isDefault: true },
    { id: "emails", name: "Emails", color: "#9254de", icon: "📧", isDefault: true },
    { id: "other", name: "Other", color: "#8c8c8c", icon: "📌", isDefault: true },
];

export const PRIORITY_CONFIG: Record<Priority, { color: string; label: string; order: number }> = {
    critical: { color: "#f5222d", label: "Critical", order: 0 },
    high: { color: "#fa541c", label: "High", order: 1 },
    medium: { color: "#faad14", label: "Medium", order: 2 },
    low: { color: "#52c41a", label: "Low", order: 3 },
    none: { color: "#8c8c8c", label: "None", order: 4 },
};

export const STATUS_CONFIG: Record<Status, { color: string; label: string; order: number; icon: string }> = {
    backlog: { color: "default", label: "Backlog", order: 0, icon: "📥" },
    todo: { color: "default", label: "To Do", order: 1, icon: "📝" },
    "in-progress": { color: "processing", label: "In Progress", order: 2, icon: "🔄" },
    review: { color: "warning", label: "In Review", order: 3, icon: "👀" },
    waiting: { color: "default", label: "Waiting", order: 4, icon: "⏳" },
    blocked: { color: "error", label: "Blocked", order: 5, icon: "🚫" },
    done: { color: "success", label: "Done", order: 6, icon: "✅" },
    cancelled: { color: "default", label: "Cancelled", order: 7, icon: "❌" },
};

// ─── Browser Compatibility Check ─────────────────────────────────────

export function checkIndexedDBSupport(): { supported: boolean; error?: string } {
    if (typeof window === "undefined") {
        return { supported: false, error: "IndexedDB requires a browser environment" };
    }

    if (!window.indexedDB) {
        return {
            supported: false,
            error: "Your browser doesn't support IndexedDB. Please use a modern browser like Chrome, Firefox, Safari, or Edge."
        };
    }

    // Check for private browsing mode issues
    try {
        const testKey = "__idb_test__";
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
    } catch {
        return {
            supported: false,
            error: "IndexedDB may not work in private/incognito mode. Please use a regular browser window."
        };
    }

    return { supported: true };
}

// ─── Database Connection ─────────────────────────────────────────────

let dbInstance: IDBDatabase | null = null;

export function getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            resolve(dbInstance);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(new Error("Failed to open database: " + request.error?.message));
        };

        request.onsuccess = () => {
            dbInstance = request.result;

            // Handle connection closing
            dbInstance.onclose = () => {
                dbInstance = null;
            };

            resolve(dbInstance);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Todos store with indexes
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const todosStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                todosStore.createIndex("status", "status", { unique: false });
                todosStore.createIndex("categoryId", "categoryId", { unique: false });
                todosStore.createIndex("priority", "priority", { unique: false });
                todosStore.createIndex("dueDate", "dueDate", { unique: false });
                todosStore.createIndex("createdAt", "createdAt", { unique: false });
                todosStore.createIndex("isArchived", "isArchived", { unique: false });
                todosStore.createIndex("isDeleted", "isDeleted", { unique: false });
                todosStore.createIndex("tags", "tags", { unique: false, multiEntry: true });
            }

            // Categories store
            if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
                const categoriesStore = db.createObjectStore(CATEGORIES_STORE, { keyPath: "id" });
                categoriesStore.createIndex("name", "name", { unique: false });
            }

            // Settings store
            if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
                db.createObjectStore(SETTINGS_STORE, { keyPath: "id" });
            }
        };
    });
}

// ─── Helper Functions ────────────────────────────────────────────────

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function createEmptyTodo(categoryId: string = "work"): Omit<TodoItem, "id" | "createdAt" | "updatedAt"> {
    return {
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        categoryId,
        dueDate: null,
        reminderDate: null,
        completedAt: null,
        tags: [],
        estimatedHours: 0,
        actualHours: 0,
        subtasks: [],
        notes: "",
        isArchived: false,
        archivedAt: null,
        isDeleted: false,
        deletedAt: null,
        isRecurring: false,
        recurrencePattern: null,
        parentId: null,
        projectId: null,
    };
}

// ─── CRUD Operations: Todos ──────────────────────────────────────────

export async function getAllTodos(includeDeleted: boolean = false): Promise<TodoItem[]> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            let todos = request.result as TodoItem[];
            if (!includeDeleted) {
                todos = todos.filter(t => !t.isDeleted);
            }
            // Sort by createdAt desc
            todos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            resolve(todos);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function getTodoById(id: string): Promise<TodoItem | null> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

export async function addTodo(todo: Omit<TodoItem, "id" | "createdAt" | "updatedAt">): Promise<TodoItem> {
    const db = await getDB();
    const now = new Date().toISOString();
    const newTodo: TodoItem = {
        ...todo,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
    };

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.add(newTodo);

        request.onsuccess = () => resolve(newTodo);
        request.onerror = () => reject(request.error);
    });
}

export async function updateTodo(id: string, updates: Partial<TodoItem>): Promise<TodoItem> {
    const db = await getDB();
    const existing = await getTodoById(id);
    if (!existing) throw new Error("Todo not found");

    const updated: TodoItem = {
        ...existing,
        ...updates,
        id, // Ensure id doesn't change
        updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(updated);

        request.onsuccess = () => resolve(updated);
        request.onerror = () => reject(request.error);
    });
}

export async function softDeleteTodo(id: string): Promise<TodoItem> {
    return updateTodo(id, {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
    });
}

export async function restoreTodo(id: string): Promise<TodoItem> {
    return updateTodo(id, {
        isDeleted: false,
        deletedAt: null,
    });
}

export async function hardDeleteTodo(id: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function archiveTodo(id: string): Promise<TodoItem> {
    return updateTodo(id, {
        isArchived: true,
        archivedAt: new Date().toISOString(),
    });
}

export async function unarchiveTodo(id: string): Promise<TodoItem> {
    return updateTodo(id, {
        isArchived: false,
        archivedAt: null,
    });
}

export async function bulkUpdateTodos(ids: string[], updates: Partial<TodoItem>): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        let completed = 0;
        const now = new Date().toISOString();

        ids.forEach(async (id) => {
            const getReq = store.get(id);
            getReq.onsuccess = () => {
                const existing = getReq.result;
                if (existing) {
                    const updated = { ...existing, ...updates, updatedAt: now };
                    store.put(updated);
                }
                completed++;
                if (completed === ids.length) resolve();
            };
            getReq.onerror = () => reject(getReq.error);
        });

        if (ids.length === 0) resolve();
    });
}

export async function emptyTrash(): Promise<number> {
    const db = await getDB();
    const allTodos = await getAllTodos(true);
    const deletedTodos = allTodos.filter(t => t.isDeleted);

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        let deleted = 0;

        deletedTodos.forEach((todo) => {
            const request = store.delete(todo.id);
            request.onsuccess = () => {
                deleted++;
                if (deleted === deletedTodos.length) resolve(deleted);
            };
            request.onerror = () => reject(request.error);
        });

        if (deletedTodos.length === 0) resolve(0);
    });
}

// ─── CRUD Operations: Categories ─────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(CATEGORIES_STORE, "readonly");
        const store = tx.objectStore(CATEGORIES_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
            const categories = request.result as Category[];
            // Sort: default first, then by name
            categories.sort((a, b) => {
                if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
                return a.name.localeCompare(b.name);
            });
            resolve(categories);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function addCategory(category: Omit<Category, "id" | "createdAt">): Promise<Category> {
    const db = await getDB();
    const newCategory: Category = {
        ...category,
        id: generateId(),
        createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
        const tx = db.transaction(CATEGORIES_STORE, "readwrite");
        const store = tx.objectStore(CATEGORIES_STORE);
        const request = store.add(newCategory);

        request.onsuccess = () => resolve(newCategory);
        request.onerror = () => reject(request.error);
    });
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const db = await getDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(CATEGORIES_STORE, "readwrite");
        const store = tx.objectStore(CATEGORIES_STORE);
        const getReq = store.get(id);

        getReq.onsuccess = () => {
            const existing = getReq.result;
            if (!existing) {
                reject(new Error("Category not found"));
                return;
            }
            const updated = { ...existing, ...updates, id };
            const putReq = store.put(updated);
            putReq.onsuccess = () => resolve(updated);
            putReq.onerror = () => reject(putReq.error);
        };
        getReq.onerror = () => reject(getReq.error);
    });
}

export async function deleteCategory(id: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(CATEGORIES_STORE, "readwrite");
        const store = tx.objectStore(CATEGORIES_STORE);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function initializeDefaultCategories(): Promise<void> {
    const categories = await getAllCategories();
    if (categories.length === 0) {
        const db = await getDB();
        const tx = db.transaction(CATEGORIES_STORE, "readwrite");
        const store = tx.objectStore(CATEGORIES_STORE);
        const now = new Date().toISOString();

        DEFAULT_CATEGORIES.forEach((cat) => {
            store.add({ ...cat, createdAt: now });
        });
    }
}

// ─── Settings ────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: TodoSettings = {
    id: "settings",
    defaultCategory: "work",
    defaultPriority: "medium",
    showArchived: false,
    showDeleted: false,
    defaultView: "list",
    autoArchiveCompletedDays: 0, // 0 = disabled
    lastExportDate: null,
};

export async function getSettings(): Promise<TodoSettings> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(SETTINGS_STORE, "readonly");
        const store = tx.objectStore(SETTINGS_STORE);
        const request = store.get("settings");

        request.onsuccess = () => {
            resolve(request.result || DEFAULT_SETTINGS);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function updateSettings(updates: Partial<TodoSettings>): Promise<TodoSettings> {
    const db = await getDB();
    const current = await getSettings();
    const updated = { ...current, ...updates, id: "settings" };

    return new Promise((resolve, reject) => {
        const tx = db.transaction(SETTINGS_STORE, "readwrite");
        const store = tx.objectStore(SETTINGS_STORE);
        const request = store.put(updated);

        request.onsuccess = () => resolve(updated);
        request.onerror = () => reject(request.error);
    });
}

// ─── Export / Import ─────────────────────────────────────────────────

export async function exportAllData(): Promise<ExportData> {
    const [todos, categories, settings] = await Promise.all([
        getAllTodos(true), // Include deleted for full backup
        getAllCategories(),
        getSettings(),
    ]);

    const exportData: ExportData = {
        version: "2.0.0",
        exportedAt: new Date().toISOString(),
        todos,
        categories,
        settings,
    };

    // Update last export date
    await updateSettings({ lastExportDate: exportData.exportedAt });

    return exportData;
}

export async function importData(data: ExportData, mode: "merge" | "replace"): Promise<{ todosImported: number; categoriesImported: number }> {
    const db = await getDB();

    if (mode === "replace") {
        // Clear existing data
        const clearTx = db.transaction([STORE_NAME, CATEGORIES_STORE], "readwrite");
        clearTx.objectStore(STORE_NAME).clear();
        clearTx.objectStore(CATEGORIES_STORE).clear();
        await new Promise<void>((resolve, reject) => {
            clearTx.oncomplete = () => resolve();
            clearTx.onerror = () => reject(clearTx.error);
        });
    }

    // Import categories first
    let categoriesImported = 0;
    if (data.categories && data.categories.length > 0) {
        const catTx = db.transaction(CATEGORIES_STORE, "readwrite");
        const catStore = catTx.objectStore(CATEGORIES_STORE);

        for (const cat of data.categories) {
            catStore.put(cat);
            categoriesImported++;
        }

        await new Promise<void>((resolve, reject) => {
            catTx.oncomplete = () => resolve();
            catTx.onerror = () => reject(catTx.error);
        });
    }

    // Import todos
    let todosImported = 0;
    if (data.todos && data.todos.length > 0) {
        const todoTx = db.transaction(STORE_NAME, "readwrite");
        const todoStore = todoTx.objectStore(STORE_NAME);

        for (const todo of data.todos) {
            // For merge mode, generate new ID to avoid conflicts
            const todoToAdd = mode === "merge" ? { ...todo, id: generateId() } : todo;
            todoStore.put(todoToAdd);
            todosImported++;
        }

        await new Promise<void>((resolve, reject) => {
            todoTx.oncomplete = () => resolve();
            todoTx.onerror = () => reject(todoTx.error);
        });
    }

    // Import settings (only in replace mode)
    if (mode === "replace" && data.settings) {
        await updateSettings(data.settings);
    }

    return { todosImported, categoriesImported };
}

export function validateImportData(data: unknown): { valid: boolean; error?: string } {
    if (!data || typeof data !== "object") {
        return { valid: false, error: "Invalid data format" };
    }

    const d = data as Record<string, unknown>;

    if (!d.version || typeof d.version !== "string") {
        return { valid: false, error: "Missing or invalid version" };
    }

    if (!Array.isArray(d.todos)) {
        return { valid: false, error: "Missing or invalid todos array" };
    }

    // Basic validation of todo structure
    for (const todo of d.todos) {
        if (!todo || typeof todo !== "object") {
            return { valid: false, error: "Invalid todo item" };
        }
        const t = todo as Record<string, unknown>;
        if (!t.id || !t.title || !t.status || !t.priority) {
            return { valid: false, error: "Todo missing required fields (id, title, status, priority)" };
        }
    }

    return { valid: true };
}

// ─── Statistics ──────────────────────────────────────────────────────

export interface TodoStats {
    total: number;
    active: number;
    done: number;
    inProgress: number;
    overdue: number;
    dueToday: number;
    dueTomorrow: number;
    dueThisWeek: number;
    blocked: number;
    archived: number;
    deleted: number;
    completionRate: number;
    byCategory: Record<string, number>;
    byPriority: Record<Priority, number>;
    byStatus: Record<Status, number>;
    avgCompletionTime: number; // in hours
    totalEstimatedHours: number;
    totalActualHours: number;
}

export async function getTodoStats(): Promise<TodoStats> {
    const todos = await getAllTodos(true);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const activeTodos = todos.filter(t => !t.isDeleted && !t.isArchived);
    const doneTodos = activeTodos.filter(t => t.status === "done");

    // Calculate completion times
    const completionTimes = doneTodos
        .filter(t => t.completedAt && t.createdAt)
        .map(t => (new Date(t.completedAt!).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60));
    const avgCompletionTime = completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 0;

    // By category
    const byCategory: Record<string, number> = {};
    activeTodos.forEach(t => {
        byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + 1;
    });

    // By priority
    const byPriority: Record<Priority, number> = { critical: 0, high: 0, medium: 0, low: 0, none: 0 };
    activeTodos.forEach(t => {
        byPriority[t.priority]++;
    });

    // By status
    const byStatus: Record<Status, number> = {
        backlog: 0, todo: 0, "in-progress": 0, review: 0, waiting: 0, blocked: 0, done: 0, cancelled: 0
    };
    activeTodos.forEach(t => {
        byStatus[t.status]++;
    });

    return {
        total: todos.length,
        active: activeTodos.filter(t => t.status !== "done" && t.status !== "cancelled").length,
        done: doneTodos.length,
        inProgress: activeTodos.filter(t => t.status === "in-progress").length,
        overdue: activeTodos.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== "done" && t.status !== "cancelled").length,
        dueToday: activeTodos.filter(t => t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) < tomorrow).length,
        dueTomorrow: activeTodos.filter(t => t.dueDate && new Date(t.dueDate) >= tomorrow && new Date(t.dueDate) < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)).length,
        dueThisWeek: activeTodos.filter(t => t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) < nextWeek).length,
        blocked: activeTodos.filter(t => t.status === "blocked").length,
        archived: todos.filter(t => t.isArchived && !t.isDeleted).length,
        deleted: todos.filter(t => t.isDeleted).length,
        completionRate: activeTodos.length > 0 ? Math.round((doneTodos.length / activeTodos.length) * 100) : 0,
        byCategory,
        byPriority,
        byStatus,
        avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
        totalEstimatedHours: activeTodos.reduce((sum, t) => sum + t.estimatedHours, 0),
        totalActualHours: activeTodos.reduce((sum, t) => sum + t.actualHours, 0),
    };
}

// ─── Database Cleanup ────────────────────────────────────────────────

export async function closeDB(): Promise<void> {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
    }
}

export async function deleteDatabase(): Promise<void> {
    await closeDB();
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

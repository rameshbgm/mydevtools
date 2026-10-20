import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { removeProjectIndexedData } from "../src/lib/project-purge";
import { ACTIVE_PROJECT_KEY, PERSONAL, PROJECTS_KEY, purgeDeletedProject, queueProjectPurge } from "../src/lib/project-storage";
import { createVault, writeVault } from "../src/lib/local-vault";
import { addTodo, getDB } from "../src/lib/todo-db";

const factory = new IDBFactory();
const first = "11111111-1111-4111-8111-111111111111";
const second = "22222222-2222-4222-8222-222222222222";
const tasks = (id: string) => `mydevtools:project:${id}:DevToolsTodoDB`;
async function open(name: string, stores: string[]) {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = factory.open(name, 1);
        request.onupgradeneeded = () => stores.forEach((store) => request.result.createObjectStore(store));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
async function put(name: string, store: string, entries: [IDBValidKey, unknown][], stores = [store]) {
    const db = await open(name, stores);
    try { await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(store, "readwrite");
        for (const [key, value] of entries) transaction.objectStore(store).put(value, key);
        transaction.oncomplete = () => resolve(); transaction.onabort = () => reject(transaction.error);
    }); } finally { db.close(); }
}
async function keys(name: string, store: string) {
    const db = await open(name, [store]);
    try { return await new Promise<IDBValidKey[]>((resolve, reject) => {
        const request = db.transaction(store).objectStore(store).getAllKeys();
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    }); } finally { db.close(); }
}
async function main() {
    const data = new Map<string, string>();
    const storage: Storage = { get length() { return data.size; }, key: (index) => [...data.keys()][index] ?? null, getItem: (key) => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value); }, removeItem: (key) => { data.delete(key); }, clear: () => data.clear() };
    storage.setItem(PROJECTS_KEY, JSON.stringify([PERSONAL, { id: first, name: "Delete fixture", createdAt: "" }, { id: second, name: "Keep fixture", createdAt: "" }]));
    storage.setItem(ACTIVE_PROJECT_KEY, first);
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: storage } });
    Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: factory });
    await put(tasks(first), "todos", [["first-task", { title: "Public fixture" }]], ["todos", "categories", "settings"]);
    await put(tasks(first), "settings", [["config", { theme: "fixture" }]]);
    await put(tasks(second), "todos", [["second-task", { title: "Keep this fixture" }]]);
    await put("DevToolsTodoDB", "todos", [["personal-task", { title: "Keep Personal" }]]);
    await put("MyDevToolsEncryptedVaults", "vaults", [
        [`${first}:credentials`, { ciphertext: "public-first-fixture" }], [`${first}:files`, { ciphertext: "public-file-fixture" }],
        [`${second}:credentials`, { ciphertext: "keep-second" }], ["personal:files", { ciphertext: "keep-personal" }],
        [`${first}0:credentials`, { ciphertext: "keep-unrelated-prefix" }], [42, "keep-numeric-key"],
    ]);
    await removeProjectIndexedData(first, factory);
    assert.deepEqual(await keys(tasks(first), "todos"), []);
    assert.deepEqual(await keys(tasks(first), "settings"), []);
    assert.deepEqual(await keys(tasks(second), "todos"), ["second-task"]);
    assert.deepEqual(await keys("DevToolsTodoDB", "todos"), ["personal-task"]);
    assert.deepEqual(await keys("MyDevToolsEncryptedVaults", "vaults"), [42, `${first}0:credentials`, `${second}:credentials`, "personal:files"]);
    await removeProjectIndexedData(first, factory);
    await assert.rejects(() => removeProjectIndexedData("personal", factory), /custom project/);
    const missing = "33333333-3333-4333-8333-333333333333";
    await removeProjectIndexedData(missing, factory);
    assert.equal((await factory.databases()).some((db) => db.name === tasks(missing)), false, "inspection must not create empty databases");
    const pendingVault = await createVault("public fixture passphrase", `${first}:credentials`, { records: [] });
    await writeVault(`${first}:credentials`, pendingVault.envelope);
    const cachedTodoDatabase = await getDB();
    const resumedTodoSave = addTodo({ title: "Task queued immediately before close" } as Parameters<typeof addTodo>[0]);
    queueProjectPurge(first, storage);
    await assert.rejects(resumedTodoSave, /Project not found/, "Todo rechecks after its cached database promise resolves, before creating a transaction");
    await assert.rejects(writeVault(`${first}:credentials`, pendingVault.envelope), /Project not found/, "A queued close prevents a late async vault save");
    await purgeDeletedProject(first, storage, (id) => removeProjectIndexedData(id, factory));
    await assert.rejects(writeVault(`${first}:credentials`, pendingVault.envelope), /Project not found/, "A stale document cannot recreate a purged vault");
    await assert.rejects(addTodo({ title: "Late stale task" } as Parameters<typeof addTodo>[0]), /Project not found/, "A cached Todo database cannot accept new work after deletion");
    assert.deepEqual(await keys(tasks(first), "todos"), []);
    assert.deepEqual(await keys("MyDevToolsEncryptedVaults", "vaults"), [42, `${first}0:credentials`, `${second}:credentials`, "personal:files"]);
    const otherVault = await createVault("public fixture passphrase", `${second}:credentials`, { records: [] });
    const personalVault = await createVault("public fixture passphrase", "personal:files", { records: [] });
    await writeVault(`${second}:credentials`, otherVault.envelope);
    await writeVault("personal:files", personalVault.envelope);
    otherVault.lock(); personalVault.lock();
    cachedTodoDatabase.close(); pendingVault.lock();
    console.log("Project purge: exact task namespace and vault contexts removed; Personal, other projects, unrelated prefixes and numeric keys preserved; missing database not created; repeat safe.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

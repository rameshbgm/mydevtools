import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { PROJECTS_KEY, createProject, projectKey, readProjects } from "../src/lib/project-storage";
import { SEEN_RELEASE_KEY } from "../src/lib/release-preference";
import { clearStorageRow, collectStorageInventory, exportLocalRecords, localImportEntries, parseLocalRecords, readStorageRow, readStoredPage, restoreLocalRecords, storageScope, storageValueText, type StorageEnvironment } from "../src/lib/storage-inventory";

function storage(): Storage {
    const values = new Map<string, string>();
    return { get length() { return values.size; }, key: (i) => [...values.keys()][i] ?? null, getItem: (k) => values.get(k) ?? null, setItem: (k, v) => { values.set(k, String(v)); }, removeItem: (k) => { values.delete(k); }, clear: () => values.clear() };
}
async function seed(factory: IDBFactory, name: string, store: string, entries: [IDBValidKey, unknown][]) {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = factory.open(name, 1); request.onupgradeneeded = () => request.result.createObjectStore(store);
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => { const tx = db.transaction(store, "readwrite"); for (const [key, value] of entries) tx.objectStore(store).put(value, key); tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
    db.close();
}
async function main() {
    const local = storage(), session = storage(), idb = new IDBFactory();
    const full = storage();
    Array.from({ length: 9 }, (_, i) => createProject(`Limit fixture ${i}`, full));
    const incomingStorage = storage();
    createProject("Imported workspace", incomingStorage);
    const incomingBackup = { format: "mydevtools-storage" as const, redacted: false, version: 1 as const, exportedAt: new Date().toISOString(), entries: [{ engine: "local" as const, key: PROJECTS_KEY, value: incomingStorage.getItem(PROJECTS_KEY)! }] };
    const beforeImport = full.getItem(PROJECTS_KEY);
    assert.throws(() => restoreLocalRecords(incomingBackup, { local: full, session: storage() }), /limit is 10/);
    assert.equal(full.getItem(PROJECTS_KEY), beforeImport, "over-limit import is rejected before writing records");

    const first = createProject("First project", local), second = createProject("Second project", local);
    local.setItem(projectKey("mydevtools-code-snippets-v1", first.id), '[{"name":"Public fixture","code":"hello"}]');
    local.setItem(projectKey("api-builder-environments", second.id), '{"password":"public-test-secret"}');
    local.setItem(SEEN_RELEASE_KEY, "2.0.0"); local.setItem("previously-uncatalogued-key", "Visible unknown fixture");
    session.setItem("mydevtools.bridge.payload", '{"kind":"text","data":"public fixture"}');
    await seed(idb, projectKey("DevToolsTodoDB", first.id), "todos", Array.from({ length: 72 }, (_, i) => [i, { title: `Public task ${i}` }]));
    const envelope = { version: 1, ciphertext: "public-fixture-ciphertext", context: `${first.id}:credentials` };
    await seed(idb, "MyDevToolsEncryptedVaults", "vaults", [[`${first.id}:credentials`, envelope], [`${second.id}:files`, { ciphertext: "keep-second-fixture" }]]);
    const cacheData = new Map<string, Request[]>([["mydevtools-test", [new Request("https://fixtures.example/one"), new Request("https://fixtures.example/two")]], ["other-cache", []]]);
    const cache = { keys: async () => [...cacheData.keys()], open: async (name: string) => ({ keys: async () => cacheData.get(name) ?? [] }), delete: async (name: string) => cacheData.delete(name) } as unknown as CacheStorage;
    const env: StorageEnvironment = { local, session, idb, cache };
    const snapshot = await collectStorageInventory(env);
    assert.deepEqual(snapshot.warnings, []);
    assert.ok(snapshot.rows.some((row) => row.key === "previously-uncatalogued-key"), "unknown persistent keys must remain visible");
    assert.equal(snapshot.rows.find((row) => row.key === SEEN_RELEASE_KEY)?.scope, "global");
    assert.equal(snapshot.rows.find((row) => row.key === "mydevtools.bridge.payload")?.engine, "session");
    assert.equal(snapshot.rows.find((row) => row.key === projectKey("mydevtools-code-snippets-v1", first.id))?.scope, first.id);
    assert.deepEqual(storageScope(projectKey("custom-key", second.id)), { scope: second.id, baseKey: "custom-key" });
    const tasks = snapshot.rows.find((row) => row.engine === "indexeddb")!;
    assert.equal(tasks.count, 72);
    const pages = await Promise.all([readStoredPage(tasks, env, 0), readStoredPage(tasks, env, 25), readStoredPage(tasks, env, 50)]);
    assert.deepEqual(pages.map((page) => page.entries.length), [25, 25, 22]);
    assert.deepEqual(pages.map((page) => page.hasMore), [true, true, false]);
    assert.equal(pages[1].entries[0].key, 25);
    const vault = snapshot.rows.find((row) => row.engine === "vault" && row.scope === first.id)!;
    assert.deepEqual(await readStorageRow(vault, env), envelope, "encrypted backup must preserve its original envelope");
    const cacheRow = snapshot.rows.find((row) => row.engine === "cache" && row.key === "mydevtools-test")!;
    assert.equal(cacheRow.count, 2);
    assert.equal((await readStorageRow(cacheRow, env) as unknown[]).length, 2);
    const secretRow = snapshot.rows.find((row) => row.key === projectKey("api-builder-environments", second.id))!;
    assert.equal(JSON.stringify(exportLocalRecords([secretRow], env)).includes("public-test-secret"), false);
    assert.equal(JSON.stringify(exportLocalRecords([secretRow], env, true)).includes("public-test-secret"), true);
    assert.ok(storageValueText({ password: "public-test-secret" }).includes("REDACTED"));
    const filteredBackup = parseLocalRecords(JSON.stringify(exportLocalRecords(snapshot.rows.filter((row) => row.scope === first.id), env, true)));
    const destination = storage(); const unrelated = createProject("Keep existing destination", destination);
    const destinationEnv = { ...env, local: destination };
    for (const entry of localImportEntries(filteredBackup, destinationEnv)) destinationEnv[entry.engine].setItem(entry.key, entry.value);
    assert.ok(readProjects(destination).some((project) => project.id === first.id), "filtered exports restore project metadata on a different device");
    assert.ok(readProjects(destination).some((project) => project.id === unrelated.id), "import must preserve existing project catalogue entries");
    const importedQueue = { ...first, deletedAt: "2026-10-21T00:00:00Z", purgeStartedAt: "2026-10-21T00:00:00Z", purgeQueuedAt: "2026-10-21T00:00:00Z" };
    for (const metadata of [{ projects: [importedQueue] }, { entries: [{ engine: "local", key: PROJECTS_KEY, value: JSON.stringify([importedQueue]) }] }]) {
        const untrusted = parseLocalRecords(JSON.stringify({ format: "mydevtools-storage", version: 1, redacted: false, entries: [], ...metadata }));
        const entries = localImportEntries(untrusted, { ...env, local: storage() });
        assert.equal(JSON.stringify(entries).includes("purgeQueuedAt"), false, "Imported data must never authorize automatic permanent deletion");
    }
    const legacy = parseLocalRecords(JSON.stringify({ exportedAt: "2026-10-19", "mydevtools-code-snippets-v1": [{ name: "legacy fixture" }] }), second.id);
    assert.equal(legacy.entries[0].key, projectKey("mydevtools-code-snippets-v1", second.id));
    assert.throws(() => parseLocalRecords('{"version":999,"entries":[]}'), /version 1/);
    assert.throws(() => parseLocalRecords(JSON.stringify({ format: "mydevtools-storage", version: 1, entries: [{ engine: "local", key: "same", value: "one" }, { engine: "local", key: "same", value: "two" }] })), /duplicate/);
    const rollback = storage(); rollback.setItem("existing-one", "original-one"); rollback.setItem("existing-two", "original-two");
    let writes = 0;
    const quotaStorage = { ...rollback, setItem(key: string, value: string) { if (++writes === 3) throw new Error("Fixture quota exceeded"); rollback.setItem(key, value); } };
    const importFixture = parseLocalRecords(JSON.stringify({ format: "mydevtools-storage", version: 1, redacted: false, entries: [
        { engine: "local", key: "existing-one", value: "replacement-one" }, { engine: "local", key: "new-key", value: "new-value" }, { engine: "local", key: "existing-two", value: "replacement-two" },
    ] }));
    assert.throws(() => restoreLocalRecords(importFixture, { ...env, local: quotaStorage }), /Previous values were restored/);
    assert.equal(rollback.getItem("existing-one"), "original-one"); assert.equal(rollback.getItem("existing-two"), "original-two"); assert.equal(rollback.getItem("new-key"), null);
    const catalogue = snapshot.rows.find((row) => row.key === PROJECTS_KEY)!;
    await assert.rejects(() => clearStorageRow(catalogue, env), /Project Workspaces/);
    await clearStorageRow(vault, env);
    const after = await collectStorageInventory(env);
    assert.equal(after.rows.some((row) => row.id === vault.id), false);
    assert.ok(after.rows.some((row) => row.engine === "vault" && row.scope === second.id), "clearing one vault must preserve other projects");
    await clearStorageRow(tasks, env);
    assert.equal((await readStoredPage(tasks, env)).entries.length, 0);
    await clearStorageRow(cacheRow, env);
    assert.equal(cacheData.has("mydevtools-test"), false); assert.equal(cacheData.has("other-cache"), true);
    assert.equal(local.getItem("previously-uncatalogued-key"), "Visible unknown fixture");
    console.log("Storage inventory: all keys, scopes, vault envelopes, cache requests, paged database records, redacted/raw exports, filtered-project and legacy imports, protected metadata and isolated clear actions passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

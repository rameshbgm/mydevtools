/** Remove only the selected project's IndexedDB records. Encrypted vaults
 * share a database, so deleting that database would erase other projects. */
async function existingDatabase(factory: IDBFactory, name: string): Promise<IDBDatabase | null> {
    return new Promise((resolve, reject) => {
        let finished = false, missing = false;
        const request = factory.open(name);
        const timer = setTimeout(() => { finished = true; reject(new Error("Storage did not respond. Close other tabs and retry permanent deletion.")); }, 12_000);
        request.onupgradeneeded = () => { missing = true; request.transaction?.abort(); };
        request.onsuccess = () => {
            clearTimeout(timer);
            if (finished) { request.result.close(); return; }
            finished = true; resolve(request.result);
        };
        request.onerror = () => {
            clearTimeout(timer);
            if (finished) return;
            finished = true;
            if (missing) resolve(null);
            else reject(new Error("Project storage could not be opened. Check browser storage permissions and retry."));
        };
    });
}

async function clearRecords(db: IDBDatabase, projectId?: string): Promise<void> {
    try {
        const names = projectId ? ["vaults"] : Array.from(db.objectStoreNames);
        if (!names.length) return;
        if (names.some((name) => !db.objectStoreNames.contains(name))) throw new Error("Project storage has an unexpected format. Export a backup before retrying.");
        await new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(names, "readwrite");
            const timer = setTimeout(() => { try { transaction.abort(); } catch { /* already finished */ } }, 12_000);
            transaction.oncomplete = () => { clearTimeout(timer); resolve(); };
            transaction.onerror = transaction.onabort = () => { clearTimeout(timer); reject(new Error("Project storage removal was interrupted. Close other tabs and retry permanent deletion.")); };
            if (projectId) {
                const cursor = transaction.objectStore("vaults").openKeyCursor();
                cursor.onsuccess = () => {
                    const row = cursor.result;
                    if (!row) return;
                    if (typeof row.key === "string" && row.key.startsWith(`${projectId}:`)) transaction.objectStore("vaults").delete(row.primaryKey);
                    row.continue();
                };
            } else for (const name of names) transaction.objectStore(name).clear();
        });
    } finally { db.close(); }
}

export async function removeProjectIndexedData(id: string, factory: IDBFactory = indexedDB): Promise<void> {
    if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error("Only a custom project's storage can be removed.");
    const tasks = await existingDatabase(factory, `mydevtools:project:${id}:DevToolsTodoDB`);
    if (tasks) await clearRecords(tasks);
    const vaults = await existingDatabase(factory, "MyDevToolsEncryptedVaults");
    if (vaults) await clearRecords(vaults, id);
}

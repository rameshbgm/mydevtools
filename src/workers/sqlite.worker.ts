import { executeSqlite, type SqliteRequest } from "../lib/sqlite-workspace";
import type { SqlJsStatic } from "sql.js";
const context = self as unknown as {
    importScripts(url: string): void;
    initSqlJs(options: { locateFile: () => string }): Promise<SqlJsStatic>;
    onmessage: ((event: MessageEvent<SqliteRequest>) => void) | null;
    postMessage(value: unknown): void;
};
let engine: Promise<SqlJsStatic> | null = null;
context.onmessage = async (event) => {
    try {
        if (!engine) { context.importScripts("/sqlite/sql-wasm.js"); engine = context.initSqlJs({ locateFile: () => "/sqlite/sql-wasm.wasm" }); }
        context.postMessage(executeSqlite(await engine, event.data));
    } catch (cause) { context.postMessage({ error: cause instanceof Error ? cause.message : String(cause) }); }
};

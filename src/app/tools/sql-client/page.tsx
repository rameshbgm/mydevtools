"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { DatabaseOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import LocalConnectorAccess from "@/components/LocalConnectorAccess";
import ConnectionVault from "@/components/ConnectionVault";
import QueryResultTable from "@/components/QueryResultTable";
import { connectorRequest } from "@/lib/local-connector-client";
import { projectStorage } from "@/lib/project-storage";
import { downloadBytes } from "@/lib/download";
import type { SqlConnection, SqlResult } from "@/lib/sql-connector";
import type { SqliteResponse } from "@/lib/sqlite-workspace";
type Engine = SqlConnection["engine"] | "sqlite";
interface SavedQuery { id: string; name: string; sql: string }
const KEY = "mydevtools-sql-queries-v1";
export default function SqlClientPage() {
    const { t } = useLanguage();
    const [engine, setEngine] = useState<Engine>("sqlite");
    const [connection, setConnection] = useState<SqlConnection>({ engine: "postgresql", host: "127.0.0.1", port: 5432, database: "", user: "", password: "", tls: true });
    const [sql, setSql] = useState("SELECT 1 AS example;"), [parameters, setParameters] = useState("[]"), [write, setWrite] = useState(false);
    const [file, setFile] = useState<File | null>(null), [databaseBytes, setDatabaseBytes] = useState<Uint8Array | null>(null);
    const [result, setResult] = useState<SqlResult | null>(null), [tables, setTables] = useState<SqlResult | null>(null), [columns, setColumns] = useState<SqlResult | null>(null);
    const [busy, setBusy] = useState(false), [error, setError] = useState(""), [saved, setSaved] = useState<SavedQuery[]>([]), [queryDraftName, setQueryName] = useState<string | null>(null), [storageReady, setStorageReady] = useState(false);
    const queryName = queryDraftName ?? t("My query");
    const [history, setHistory] = useState<{ sql: string; rows: number; at: string }[]>([]);
    const [removedQuery, setRemovedQuery] = useState<SavedQuery | null>(null);
    const worker = useRef<Worker | null>(null), timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        try { const value: unknown = JSON.parse(projectStorage.getItem(KEY) ?? "[]"); if (!Array.isArray(value) || value.length > 20 || value.some((row) => !row || typeof row.id !== "string" || typeof row.name !== "string" || typeof row.sql !== "string")) throw new Error("Saved queries are damaged. Export them from Memory Manager before clearing or restoring them."); setSaved(value); setStorageReady(true); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
        return () => { worker.current?.terminate(); if (timer.current) clearTimeout(timer.current); };
    }, []);
    const sqlite = async (statement: string, values: unknown[], writable: boolean): Promise<SqlResult> => {
        worker.current = new Worker(new URL("../../../workers/sqlite.worker.ts", import.meta.url), { type: "classic" });
        const active = worker.current;
        try {
            const bytes = databaseBytes ?? (file ? new Uint8Array(await file.arrayBuffer()) : undefined);
            const response = await new Promise<SqliteResponse>((resolve, reject) => {
                timer.current = setTimeout(() => { active.terminate(); reject(new Error("SQLite query exceeded ten seconds. Simplify the query and retry.")); }, 10_000);
                active.onmessage = (event) => event.data.error ? reject(new Error(event.data.error)) : resolve(event.data);
                active.onerror = () => reject(new Error("SQLite worker could not start. Reload the page and check that local SQLite assets are available."));
                active.postMessage({ bytes, sql: statement, parameters: values, write: writable });
            });
            if (response.bytes) setDatabaseBytes(response.bytes);
            return response.result;
        } finally { active.terminate(); worker.current = null; if (timer.current) clearTimeout(timer.current); timer.current = null; }
    };
    const run = async (operation: "query" | "tables" | "databases" | "columns", extra: Record<string, unknown> = {}) => {
        if (busy) return; setBusy(true); setError("");
        try {
            let values: unknown = [];
            try { values = operation === "query" ? JSON.parse(parameters) : []; }
            catch { throw new Error("Parameters must be a valid JSON array."); }
            if (!Array.isArray(values)) throw new Error("Parameters must be a JSON array.");
            let response: SqlResult;
            if (engine === "sqlite") {
                const statement = operation === "tables" ? "SELECT 'main' AS schema, name, type FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY name" : operation === "columns" ? "SELECT name, type, CASE WHEN \"notnull\" = 1 THEN 'NO' ELSE 'YES' END AS nullable, dflt_value AS default_value FROM pragma_table_info(?)" : sql;
                response = await sqlite(statement, operation === "columns" ? [extra.table] : values, operation === "query" && write);
            } else response = await connectorRequest<SqlResult>({ service: "sql", operation, connection: { ...connection, engine }, ...(operation === "query" ? { sql, parameters: values, write } : extra) });
            if (operation === "tables") { setTables(response); setColumns(null); } else if (operation === "columns") setColumns(response); else { setResult(response); if (operation === "query") setHistory((current) => [{ sql, rows: response.rows.length, at: new Date().toISOString() }, ...current].slice(0, 20)); }
        } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } finally { setBusy(false); }
    };
    const saveQuery = () => { try { if (!queryName.trim()) throw new Error("Name the query before saving."); const match = saved.find((row) => row.name === queryName.trim()); const next = [...saved.filter((row) => row.id !== match?.id), { id: match?.id ?? crypto.randomUUID(), name: queryName.trim().slice(0, 120), sql }]; if (next.length > 20) throw new Error("Saved query limit is 20."); projectStorage.setItem(KEY, JSON.stringify(next)); setSaved(next); setError(""); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } };
    const removeQuery = (query: SavedQuery) => { try { const next = saved.filter((item) => item.id !== query.id); projectStorage.setItem(KEY, JSON.stringify(next)); setSaved(next); setRemovedQuery(query); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } };
    const quote = (name: string) => engine === "postgresql" ? `"${name.replace(/"/g, '""')}"` : engine === "sqlite" ? `"${name.replace(/"/g, '""')}"` : "`" + name.replace(/`/g, "``") + "`";
    return <ToolPageLayout title="SQL Database Workspace" description="Query SQLite files locally or connect to PostgreSQL, MySQL and MariaDB through your local runtime" icon={<DatabaseOutlined />} color="#08979c"><div className="wb-workbench wb-sql-workspace">
        <label>{t("Database engine")}<select value={engine} disabled={busy} onChange={(event) => { const selected = event.target.value as Engine; setEngine(selected); if (selected !== "sqlite") setConnection({ ...connection, engine: selected, port: selected === "postgresql" ? 5432 : 3306 }); setResult(null); setTables(null); setColumns(null); setWrite(false); }}><option value="sqlite">{t("SQLite file · local browser worker")}</option><option value="postgresql">PostgreSQL</option><option value="mysql">MySQL</option><option value="mariadb">MariaDB</option></select></label>
        {engine === "sqlite" ? <><label>{t("SQLite file (up to 32 MiB; optional for a new database)")}<input type="file" accept=".db,.sqlite,.sqlite3,application/vnd.sqlite3" disabled={busy} onChange={(event) => { const next = event.target.files?.[0] ?? null; if (next && next.size > 32 * 1024 * 1024) { setError("SQLite file limit is 32 MiB."); return; } setFile(next); setDatabaseBytes(null); setResult(null); setTables(null); setColumns(null); }} /></label><p>{file ? <bdi>{file.name}</bdi> : t("Using an empty temporary database.")} {t("SQLite processing stays in a local worker. Your original file is not changed. After writes, download the updated copy.")}</p>{databaseBytes && <button disabled={busy} onClick={() => downloadBytes(databaseBytes, file?.name || "database.sqlite", "application/vnd.sqlite3")}>{t("Download updated SQLite database")}</button>}</> : <>
            <LocalConnectorAccess /><div className="wb-form-grid">{(["host", "database", "user", "password"] as const).map((key) => <label key={key}>{t(key === "host" ? "Database host" : key === "user" ? "Username" : key === "password" ? "Database password" : "Database name")}<input type={key === "password" ? "password" : "text"} autoComplete="off" dir="ltr" value={connection[key]} disabled={busy} onChange={(event) => setConnection({ ...connection, [key]: event.target.value })} /></label>)}<label>{t("Port")}<input type="number" min={1} max={65535} value={connection.port} disabled={busy} onChange={(event) => setConnection({ ...connection, port: Number(event.target.value) })} /></label></div><label className="wb-checkbox"><input type="checkbox" checked={connection.tls} disabled={busy} onChange={(event) => setConnection({ ...connection, tls: event.target.checked })} />{t("Use TLS with certificate verification")}</label>
            <ConnectionVault connector="sql" settings={{ ...connection, engine }} onLoad={(value) => { if (!["postgresql", "mysql", "mariadb"].includes(String(value.engine)) || ["host", "database", "user", "password"].some((key) => typeof value[key] !== "string") || typeof value.port !== "number" || typeof value.tls !== "boolean") throw new Error("Saved SQL connection is invalid."); setConnection(value as unknown as SqlConnection); setEngine(value.engine as Engine); }} />
        </>}
        <div className="wb-workbench-actions"><button disabled={busy} onClick={() => void run("tables")}>{t("Browse tables")}</button>{engine !== "sqlite" && <button disabled={busy} onClick={() => void run("databases")}>{t("List databases")}</button>}</div>
        {tables && <section className="wb-workbench"><h2>{t("Schema browser")}</h2>{tables.rows.length ? <ul className="wb-resource-list">{tables.rows.map((row, index) => <li key={index}><span><strong><bdi dir="ltr">{String(row[0])}.{String(row[1])}</bdi></strong> · <bdi dir="ltr">{String(row[2])}</bdi></span><div className="wb-workbench-actions"><button disabled={busy} onClick={() => void run("columns", { schema: String(row[0]), table: String(row[1]) })}>{t("Inspect columns")}</button><button disabled={busy} onClick={() => { setSql(`SELECT * FROM ${quote(String(row[0]))}.${quote(String(row[1]))} LIMIT 100;`); setParameters("[]"); }}>{t("Use SELECT query")}</button></div></li>)}</ul> : <p>{t("No tables or views were returned.")}</p>}{tables.truncated && <p>{t("Showing the first 500 tables. Query information_schema or sqlite_master to filter further.")}</p>}</section>}
        {columns && <QueryResultTable result={columns} title="Table columns" />}
        <label>{t("Saved project query")}<select value="" disabled={busy} onChange={(event) => { const selected = saved.find((query) => query.id === event.target.value); if (selected) { setSql(selected.sql); setQueryName(selected.name); } }}><option value="">{t("Choose a saved query")}</option>{saved.map((query) => <option key={query.id} value={query.id}>{query.name}</option>)}</select></label>
        {saved.length > 0 && <details><summary>{t("Manage saved queries")}</summary><ul className="wb-resource-list">{saved.map((query) => <li key={query.id}><span>{query.name}</span><button disabled={busy} onClick={() => removeQuery(query)}>{t("Delete query")}</button></li>)}</ul></details>}
        {removedQuery && <button onClick={() => { try { const next = [...saved, removedQuery]; if (next.length > 20) throw new Error("Remove another query before restoring this one."); projectStorage.setItem(KEY, JSON.stringify(next)); setSaved(next); setRemovedQuery(null); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } }}>{t("Undo delete {name}", { name: removedQuery.name })}</button>}
        {history.length > 0 && <details><summary>{t("Session query history ({count})", { count: history.length })}</summary><p>{t("Query text only; cleared when this page closes.")}</p><ul className="wb-resource-list">{history.map((item, index) => <li key={index}><span><time dir="ltr">{item.at}</time> · {t("Returned rows: {count}", { count: item.rows })}<br /><code dir="ltr">{item.sql.slice(0, 160)}</code></span><button disabled={busy} onClick={() => { setSql(item.sql); setParameters("[]"); }}>{t("Load query")}</button></li>)}</ul><button onClick={() => setHistory([])}>{t("Clear session history")}</button></details>}
        <label>{t("SQL statement")}<textarea dir="ltr" rows={10} maxLength={500_000} value={sql} disabled={busy} onChange={(event) => setSql(event.target.value)} spellCheck={false} /></label><label>{t("Bound parameters (JSON array)")}<textarea dir="ltr" rows={3} value={parameters} disabled={busy} onChange={(event) => setParameters(event.target.value)} spellCheck={false} /></label>
        <label className="wb-checkbox"><input type="checkbox" checked={write} disabled={busy} onChange={(event) => setWrite(event.target.checked)} />{t("Enable writes for this request")}</label><p>{t(write ? "Write mode commits successful transactional statements after validating the returned result. DDL and nontransactional storage follow database-specific rules." : "Read-only mode is enforced by the database for this request.")} {t("Run one SQL statement at a time.")}<br />{t("Parameter placeholders")}: <bdi dir="ltr"><code>{"PostgreSQL: $1, $2… · MySQL / MariaDB / SQLite: ?"}</code></bdi></p>
        <div className="wb-workbench-actions wb-sql-query-actions"><button disabled={busy || !sql.trim()} onClick={() => void run("query")}>{t(busy ? "Running…" : "Run SQL")}</button><label>{t("Saved query name")}<input dir="auto" maxLength={120} value={queryName} onChange={(event) => setQueryName(event.target.value)} /></label><button disabled={!storageReady || busy || !sql.trim()} onClick={saveQuery}>{t("Save query text")}</button></div><p>{t("Saved query text is unencrypted in this project. Parameter values and result data are not saved. 64-bit integers are returned as text to preserve precision.")}</p>
        {error && <p role="alert">{t(error)}</p>}{result && <QueryResultTable key={JSON.stringify(result.columns) + result.rows.length} result={result} />}
    </div></ToolPageLayout>;
}

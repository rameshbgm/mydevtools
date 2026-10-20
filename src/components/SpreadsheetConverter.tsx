"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { isFileConversionMessage } from "@/lib/i18n/file-conversions";
import { useEffect, useMemo, useRef, useState } from "react";
import { spreadsheetJson } from "@/lib/spreadsheet-grid";
import type { SpreadsheetData } from "@/lib/spreadsheet-conversion";
import { tableToCsv } from "@/lib/table-export";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadBytes, downloadText } from "@/lib/download";
function errorMessage(cause: unknown): string { return cause instanceof Error ? cause.message : String(cause); }
const SAMPLE = '[{"name":"Alice","active":true,"count":3},{"name":"Bob","active":false,"count":0}]';
export default function SpreadsheetConverter({ jsonSource, onImportJson }: { jsonSource?: string; onImportJson?: (value: string) => void }) {
    const { t } = useLanguage();
    const diagnostic = (message: string) => isFileConversionMessage(message) ? t(message) : <>{t("File conversion diagnostic:")} <bdi dir="auto">{message}</bdi></>;
    const [data, setData] = useState<SpreadsheetData | null>(null), [sheet, setSheet] = useState(0), [records, setRecords] = useState(true);
    const [source, setSource] = useState(SAMPLE), [name, setName] = useState("Data"), [busy, setBusy] = useState(false), [error, setError] = useState("");
    const active = useRef<Worker | null>(null), timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => { active.current?.terminate(); if (timeout.current) clearTimeout(timeout.current); }, []);
    const output = useMemo(() => { try { return { json: data ? spreadsheetJson(data.sheets[sheet]?.rows ?? [], records) : "", error: "" }; } catch (cause) { return { json: "", error: errorMessage(cause) }; } }, [data, sheet, records]);
    const run = async (input: Record<string, unknown>): Promise<SpreadsheetData | Uint8Array> => {
        if (active.current) throw new Error("A spreadsheet operation is already running.");
        const worker = new Worker(new URL("../workers/spreadsheet.worker.ts", import.meta.url)); active.current = worker;
        try { return await new Promise((resolve, reject) => {
            timeout.current = setTimeout(() => { worker.terminate(); reject(new Error("Spreadsheet processing exceeded 20 seconds. Try a smaller workbook.")); }, 20_000);
            worker.onmessage = (event) => event.data.error ? reject(new Error(event.data.error)) : resolve(event.data.value);
            worker.onerror = () => reject(new Error("Spreadsheet worker could not start. Reload and retry.")); worker.postMessage(input);
        }); } finally { worker.terminate(); active.current = null; if (timeout.current) clearTimeout(timeout.current); timeout.current = null; }
    };
    return <section className="wb-workbench" style={{ marginBlockStart: 24 }}><h2>{t("Excel XLSX conversion")}</h2><p>{t("Read sheets locally or create an XLSX workbook from JSON. Supports up to 8 MiB compressed, 32 MiB expanded, 30 sheets and 100,000 cells. Formulas are never executed.")}</p>
        <label>{t("Open XLSX workbook")}<input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" disabled={busy} onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; setError(""); if (file.size > 8 * 1024 * 1024) { setError("XLSX file limit is 8 MiB."); return; } setBusy(true); setData(null); try { setData(await run({ operation: "read", bytes: new Uint8Array(await file.arrayBuffer()) }) as SpreadsheetData); setSheet(0); } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(false); } }} /></label>
        {data && <><label>{t("Worksheet")}<select dir="auto" value={sheet} onChange={(event) => setSheet(Number(event.target.value))}>{data.sheets.map((item, index) => <option dir="auto" key={index} value={index}>{t("{name} · {rows} rows", { name: item.name, rows: item.rows.length })}</option>)}</select></label><label className="wb-checkbox"><input type="checkbox" checked={records} onChange={(event) => setRecords(event.target.checked)} />{t("Use the first row as object keys")}</label><div>{data.warnings.map((warning, index) => <p key={index}>{diagnostic(warning)}</p>)}</div>{output.error && <p role="alert">{diagnostic(output.error)}</p>}<label>{t("Imported JSON")}<textarea dir="ltr" readOnly rows={8} value={output.json} /></label><div className="wb-workbench-actions"><button disabled={!output.json} onClick={() => void copyToClipboard(output.json)}>{t("Copy sheet JSON")}</button><button disabled={!output.json} onClick={() => downloadText(output.json, "sheet.json", "application/json")}>{t("Download sheet JSON")}</button><button onClick={() => { const rows = data.sheets[sheet]?.rows ?? []; downloadText(tableToCsv([], rows).replace(/^\r\n/, ""), "sheet.csv", "text/csv;charset=utf-8"); }}>{t("Download sheet CSV")}</button>{onImportJson && <button disabled={!output.json} onClick={() => onImportJson(output.json)}>{t("Use JSON in converter")}</button>}</div></>}
        <h3>{t("Create a workbook")}</h3><p>{t("Quote JSON numbers that need more than 15 significant digits, negative zero or unsupported magnitudes. They export as exact text instead of numeric cells.")}</p>{jsonSource !== undefined ? <p>{t("Uses the JSON input from the converter above. Nested objects become JSON text cells.")}</p> : <label>{t("JSON rows")}<textarea dir="ltr" rows={6} maxLength={8 * 1024 * 1024} value={source} onChange={(event) => setSource(event.target.value)} spellCheck={false} /></label>}<label>{t("Sheet name")}<input dir="auto" maxLength={31} value={name} onChange={(event) => setName(event.target.value)} /></label><button disabled={busy} onClick={async () => { setBusy(true); setError(""); try { const bytes = await run({ operation: "write", json: jsonSource ?? source, name }) as Uint8Array; downloadBytes(bytes, "workbook.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(false); } }}>{t(busy ? "Processing…" : "Download XLSX")}</button>
        {error && <p role="alert">{diagnostic(error)}</p>}<p>{t("Dates import as UTC ISO strings. Exports keep ISO strings as text. Formatted cells, merged layout, formulas and chart presentation do not round-trip. Text beginning with = is written as text.")}</p>
    </section>;
}

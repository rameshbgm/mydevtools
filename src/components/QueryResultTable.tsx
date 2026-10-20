"use client";
import { useLanguage } from "./LanguageProvider";
import { useState } from "react";
import { tableCellText, tableToCsv } from "@/lib/table-export";
import { downloadText } from "@/lib/download";
import { copyToClipboard } from "@/lib/clipboard";
export default function QueryResultTable({ result, title = "Results" }: { result: { columns: string[]; rows: unknown[][]; truncated: boolean; affectedRows?: number }; title?: string }) {
    const { t } = useLanguage();
    const [page, setPage] = useState(0), [protect, setProtect] = useState(true);
    const count = Math.max(1, Math.ceil(result.rows.length / 25)), index = Math.min(page, count - 1), columns = result.columns.slice(0, 100);
    return <section className="wb-workbench"><h2>{t(title)}</h2><p>{t("Returned rows: {count}", { count: result.rows.length })}{result.truncated && <> · {t("First 500 rows only; refine the query for more.")}</>}{result.affectedRows !== undefined && <> · {t("Affected rows: {count}", { count: result.affectedRows })}</>} {t("Duplicate column names are retained in order.")}</p>{result.columns.length > 100 && <p>{t("Displaying the first 100 of {count} columns. Exports include all returned columns.", { count: result.columns.length })}</p>}
        <div className="wb-workbench-actions"><button onClick={() => void copyToClipboard(JSON.stringify(result, null, 2))}>{t("Copy results JSON")}</button><button onClick={() => downloadText(JSON.stringify(result, null, 2), "query-results.json", "application/json")}>{t("Download JSON")}</button><button onClick={() => downloadText("\uFEFF" + tableToCsv(result.columns, result.rows, protect), "query-results.csv", "text/csv;charset=utf-8")}>{t("Download CSV")}</button></div>
        <label className="wb-checkbox"><input type="checkbox" checked={protect} onChange={(event) => setProtect(event.target.checked)} />{t("Protect CSV cells from spreadsheet formulas (prefixes suspicious text with an apostrophe)")}</label>
        {columns.length > 0 ? <div className="wb-table-scroll"><table className="wb-data-table" dir="ltr"><thead><tr>{columns.map((column, i) => <th key={i}>{column}</th>)}</tr></thead><tbody>{result.rows.slice(index * 25, index * 25 + 25).map((row, i) => <tr key={i}>{columns.map((_, column) => { const text = tableCellText(row[column]); return <td key={column} style={{ maxWidth: 320, overflowWrap: "anywhere" }} title={text.slice(0, 3000)}>{row[column] === null ? <em>NULL</em> : text.length > 300 ? text.slice(0, 300) + "…" : text}</td>; })}</tr>)}</tbody></table></div> : <p>{t("The statement returned no columns.")}</p>}
        <div className="wb-workbench-actions"><button disabled={index === 0} onClick={() => setPage(index - 1)}>{t("Previous results page")}</button><span>{t("Page {page} of {count}", { page: index + 1, count })}</span><button disabled={index + 1 >= count} onClick={() => setPage(index + 1)}>{t("Next results page")}</button></div>
    </section>;
}

import ExcelJS from "exceljs";
import type { GridCell } from "./spreadsheet-grid";
export interface SpreadsheetSheet { name: string; rows: GridCell[][] }
export interface SpreadsheetData { sheets: SpreadsheetSheet[]; warnings: string[] }
const MAX_BYTES = 8 * 1024 * 1024, MAX_INFLATED = 32 * 1024 * 1024, MAX_CELLS = 100_000;
/** Validate and stream-decompress before ExcelJS allocates its in-memory workbook. */
export async function checkXlsxArchive(bytes: Uint8Array): Promise<void> {
    if (bytes.length < 22 || bytes.length > MAX_BYTES) throw new Error("Choose an XLSX file up to 8 MiB.");
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); let end = -1;
    for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65_557); offset--) if (view.getUint32(offset, true) === 0x06054b50 && offset + 22 + view.getUint16(offset + 20, true) === bytes.length) { end = offset; break; }
    if (end < 0 || view.getUint16(end + 4, true) || view.getUint16(end + 6, true)) throw new Error("Use a standard single-part XLSX ZIP archive.");
    const entries = view.getUint16(end + 10, true), directorySize = view.getUint32(end + 12, true), directoryStart = view.getUint32(end + 16, true);
    if (!entries || entries > 1000 || view.getUint16(end + 8, true) !== entries || directoryStart + directorySize !== end) throw new Error("The XLSX archive has too many entries or an unsupported ZIP layout.");
    let cursor = directoryStart, total = 0; const names = new Set<string>();
    for (let index = 0; index < entries; index++) {
        if (cursor + 46 > end || view.getUint32(cursor, true) !== 0x02014b50) throw new Error("The XLSX directory is damaged.");
        const flags = view.getUint16(cursor + 8, true), method = view.getUint16(cursor + 10, true), compressed = view.getUint32(cursor + 20, true), declared = view.getUint32(cursor + 24, true), nameLength = view.getUint16(cursor + 28, true), extraLength = view.getUint16(cursor + 30, true), commentLength = view.getUint16(cursor + 32, true), local = view.getUint32(cursor + 42, true);
        if (cursor + 46 + nameLength + extraLength + commentLength > end || flags & 1 || ![0, 8].includes(method) || compressed === 0xffffffff || declared === 0xffffffff || local + 30 > directoryStart) throw new Error("Encrypted, ZIP64 or damaged XLSX entries are unsupported.");
        const name = new TextDecoder().decode(bytes.subarray(cursor + 46, cursor + 46 + nameLength));
        if (names.has(name) || name.startsWith("/") || name.split("/").includes("..")) throw new Error("The XLSX archive has duplicate or unsafe entry names."); names.add(name);
        if (view.getUint32(local, true) !== 0x04034b50 || view.getUint16(local + 8, true) !== method || view.getUint16(local + 6, true) !== flags) throw new Error("The XLSX local entry is damaged.");
        const localNameLength = view.getUint16(local + 26, true), start = local + 30 + localNameLength + view.getUint16(local + 28, true);
        if (localNameLength !== nameLength || new TextDecoder().decode(bytes.subarray(local + 30, local + 30 + localNameLength)) !== name || start + compressed > directoryStart || total + declared > MAX_INFLATED) throw new Error("XLSX content exceeds 32 MiB or has invalid entry sizes.");
        let actual = 0; const xml = /\.(xml|rels)$/i.test(name); let tail = "";
        const source = new Blob([new Uint8Array(bytes.subarray(start, start + compressed))]).stream();
        const reader = (method === 8 ? source.pipeThrough(new DecompressionStream("deflate-raw")) : source).getReader();
        try { while (true) { const { value, done } = await reader.read(); if (done) break; actual += value.length; if (total + actual > MAX_INFLATED || actual > declared) { await reader.cancel(); throw new Error("XLSX inflated content exceeds the declared size or 32 MiB limit."); } if (xml) { const text = tail + new TextDecoder().decode(value); if (/<!DOCTYPE|<!ENTITY/i.test(text)) { await reader.cancel(); throw new Error("XML entity declarations are not supported in XLSX files."); } tail = text.slice(-16); } } } finally { reader.releaseLock(); }
        if (actual !== declared) throw new Error("The XLSX entry size does not match its contents."); total += actual; cursor += 46 + nameLength + extraLength + commentLength;
    }
    if (cursor !== end || !names.has("[Content_Types].xml") || !names.has("xl/workbook.xml")) throw new Error("The archive is not a supported XLSX workbook.");
}
function cellValue(value: ExcelJS.CellValue, warnings: Set<string>): GridCell {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) { if (!Number.isFinite(value.getTime())) throw new Error("Workbook contains an invalid date."); return value.toISOString(); }
    if (typeof value === "string" || typeof value === "boolean" || typeof value === "number") return value;
    if ("formula" in value || "sharedFormula" in value) { warnings.add("Formulas are not executed. Only their cached results are imported; missing results become null."); return cellValue(value.result as ExcelJS.CellValue, warnings); }
    if ("richText" in value) return value.richText.map((part) => part.text).join("");
    if ("hyperlink" in value) { warnings.add("Hyperlinks are imported as display text without opening links."); return value.text; }
    if ("error" in value) { warnings.add("Excel error cells are represented by their error strings."); return value.error; }
    throw new Error("Unsupported spreadsheet cell type.");
}
export async function readSpreadsheet(bytes: Uint8Array): Promise<SpreadsheetData> {
    await checkXlsxArchive(bytes);
    const workbook = new ExcelJS.Workbook(); await workbook.xlsx.load(bytes as unknown as Parameters<typeof workbook.xlsx.load>[0]);
    if (workbook.worksheets.length > 30) throw new Error("Workbook limit is 30 sheets.");
    const warnings = new Set<string>(); let cells = 0;
    const sheets = workbook.worksheets.map((sheet) => {
        if (sheet.rowCount > 10_000 || sheet.columnCount > 200 || (cells += sheet.rowCount * sheet.columnCount) > MAX_CELLS) throw new Error("Workbook limit is 10,000 rows per sheet, 200 columns and 100,000 total grid cells.");
        const rows: GridCell[][] = [];
        for (let row = 1; row <= sheet.rowCount; row++) { const values: GridCell[] = []; for (let column = 1; column <= sheet.columnCount; column++) values.push(cellValue(sheet.getCell(row, column).value, warnings)); rows.push(values); }
        return { name: sheet.name, rows };
    });
    warnings.add("Dates are normalized to ISO 8601 UTC. Styling, charts, macros and workbook metadata are not converted.");
    if (JSON.stringify(sheets).length > 8 * 1024 * 1024) throw new Error("Converted workbook text exceeds 8 MiB.");
    return { sheets, warnings: [...warnings] };
}
export async function writeSpreadsheet(rows: GridCell[][], sheetName: string): Promise<Uint8Array> {
    if (!sheetName.trim() || sheetName.length > 31 || /[\\/*?:\[\]]/.test(sheetName) || sheetName.startsWith("'") || sheetName.endsWith("'")) throw new Error("Use a valid sheet name up to 31 characters, without \\ / * ? : [ ] or leading/trailing apostrophes.");
    const workbook = new ExcelJS.Workbook(), sheet = workbook.addWorksheet(sheetName);
    // Plain strings, including '=...', are written as strings, never formulas.
    sheet.addRows(rows); const output = new Uint8Array(await workbook.xlsx.writeBuffer());
    if (output.length > MAX_BYTES) throw new Error("Generated workbook exceeds 8 MiB."); return output;
}

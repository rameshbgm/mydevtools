import { readSpreadsheet, writeSpreadsheet } from "../lib/spreadsheet-conversion";
import { jsonToSpreadsheetRows } from "../lib/spreadsheet-grid";
self.onmessage = async (event: MessageEvent<{ operation: "read"; bytes: Uint8Array } | { operation: "write"; json: string; name: string }>) => {
    try { const input = event.data; const value = input.operation === "read" ? await readSpreadsheet(input.bytes) : await writeSpreadsheet(jsonToSpreadsheetRows(input.json), input.name); self.postMessage({ value }); }
    catch (cause) { self.postMessage({ error: cause instanceof Error ? cause.message : String(cause) }); }
};

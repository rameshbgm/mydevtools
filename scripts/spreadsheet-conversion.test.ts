import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import JSZip from "jszip";
import { checkXlsxArchive, readSpreadsheet, writeSpreadsheet } from "../src/lib/spreadsheet-conversion";
import { LANGUAGES, translate } from "../src/lib/i18n/catalog";
import { jsonToSpreadsheetRows, spreadsheetJson } from "../src/lib/spreadsheet-grid";
async function main() {
    const book = new ExcelJS.Workbook(), sheet = book.addWorksheet("Dates"), second = book.addWorksheet("Another sheet");
    sheet.addRow(["id", "date", "formula", "text", "empty", "active"]);
    sheet.addRow(["9223372036854775807", new Date("2026-10-19T12:34:56Z"), { formula: "1+2", result: 3 }, '=HYPERLINK("https://example.com")', null, true]);
    second.addRow(["heading", "Unicode 日本語 العربية"]); second.addRow([{ hyperlink: "https://example.com", text: "Example" }, { richText: [{ text: "Hello" }, { text: " world" }] }]);
    const bytes = new Uint8Array(await book.xlsx.writeBuffer());
    const read = await readSpreadsheet(bytes);
    assert.equal(read.sheets.length, 2); assert.equal(read.sheets[0].rows[1][0], "9223372036854775807");
    assert.equal(read.sheets[0].rows[1][1], "2026-10-19T12:34:56.000Z"); assert.equal(read.sheets[0].rows[1][2], 3);
    assert.equal(read.sheets[1].rows[1][0], "Example"); assert.equal(read.sheets[1].rows[1][1], "Hello world");
    const json = spreadsheetJson(read.sheets[0].rows, true), exported = await writeSpreadsheet(jsonToSpreadsheetRows(json), "Round trip");
    const roundtrip = await readSpreadsheet(exported); assert.deepEqual(roundtrip.sheets[0].rows, read.sheets[0].rows);
    const checkBook = new ExcelJS.Workbook(); await checkBook.xlsx.load(exported as unknown as Parameters<typeof checkBook.xlsx.load>[0]); assert.equal(checkBook.worksheets[0].getCell("D2").type, ExcelJS.ValueType.String);
    assert.throws(() => spreadsheetJson([["duplicate", "duplicate"], [1, 2]], true), /unique/);
    assert.deepEqual(JSON.parse(spreadsheetJson([["__proto__"], ["safe"]], true)), [{ ["__proto__"]: "safe" }]);
    assert.deepEqual(jsonToSpreadsheetRows('[{"nested":{"x":1}},{"other":true}]'), [["nested", "other"], ['{"x":1}', null], [null, true]]);
    // Validate original numeric tokens before JSON.parse rounding can reach Excel.
    // Excel also preserves only 15 significant decimal digits even for some values
    // that JavaScript can represent exactly. Quoted strings are the recovery path.
    const recovery = "A JSON number cannot be preserved safely as an Excel numeric cell. Quote precision-sensitive numbers as JSON strings to keep their exact text.";
    const sensitive = ["9223372036854775807", "9007199254740991", "1234567890123456", "0.1234567890123456789", "-0", "1e400", "1e-400", "5e-324"];
    for (const token of sensitive) {
        assert.throws(() => jsonToSpreadsheetRows(`[[${token}]]`), { message: recovery });
        assert.throws(() => jsonToSpreadsheetRows(`[{"nested":{"value":${token}}}]`), { message: recovery });
    }
    for (const locale of LANGUAGES.slice(1)) assert.notEqual(translate(locale.id, recovery), recovery, `${locale.id}: precision recovery translation`);
    const preciseText = [...sensitive, "literal 9223372036854775807", 'quotes " 1e400 \"', "日本語 العربية 🌍", '=HYPERLINK("https://example.com")'];
    const preciseBytes = await writeSpreadsheet(jsonToSpreadsheetRows(JSON.stringify([preciseText])), "Exact text");
    const independent = new ExcelJS.Workbook(); await independent.xlsx.load(preciseBytes as unknown as Parameters<typeof independent.xlsx.load>[0]);
    preciseText.forEach((value, index) => { const cell = independent.worksheets[0].getCell(1, index + 1); assert.equal(cell.type, ExcelJS.ValueType.String); assert.equal(cell.value, value); });
    assert.deepEqual((await readSpreadsheet(preciseBytes)).sheets[0].rows[0], preciseText);
    const packageZip = await JSZip.loadAsync(preciseBytes), sharedStrings = await packageZip.file("xl/sharedStrings.xml")!.async("string");
    for (const token of sensitive) assert.ok(sharedStrings.includes(token), `Exact original source in OOXML: ${token}`);
    assert.deepEqual(jsonToSpreadsheetRows('[[0,3.14,1000000000000000,1.23456789012345,1e-100]]'), [[0, 3.14, 1000000000000000, 1.23456789012345, 1e-100]]);
    const sourceAtLimit = " ".repeat(8 * 1024 * 1024 - 5) + "[[1]]";
    assert.deepEqual(jsonToSpreadsheetRows(sourceAtLimit), [[1]], "8 MiB source support must not regress to the query parser's 2 MiB cap");
    assert.throws(() => jsonToSpreadsheetRows(sourceAtLimit + " "), /8 MiB/);
    assert.throws(() => jsonToSpreadsheetRows('[[' + JSON.stringify("é".repeat(4 * 1024 * 1024)) + ']]'), /8 MiB/, "The byte bound also applies to multibyte source");
    await assert.rejects(() => writeSpreadsheet([[1]], "bad/name"), /valid sheet name/);
    await assert.rejects(() => checkXlsxArchive(new Uint8Array(30)), /ZIP archive/);
    const malicious = await JSZip.loadAsync(bytes); malicious.file("extra.xml", '<!DOCTYPE fixture [<!ENTITY x "bad">]><a>&x;</a>');
    await assert.rejects(async () => readSpreadsheet(await malicious.generateAsync({ type: "uint8array", compression: "DEFLATE" })), /entity declarations/);
    const oversized = await JSZip.loadAsync(bytes); oversized.file("large.xml", "a".repeat(33 * 1024 * 1024)); const bomb = await oversized.generateAsync({ type: "uint8array", compression: "DEFLATE" });
    await assert.rejects(() => readSpreadsheet(bomb), /32 MiB/);
    console.log("XLSX round trips, numeric precision/Excel 15-digit rejection with exact quoted-text recovery, full 8 MiB JSON boundary, text-formula safety and archive limits passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

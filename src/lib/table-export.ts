export function tableCellText(value: unknown): string { return value === null || value === undefined ? "" : typeof value === "object" ? JSON.stringify(value) : String(value); }
export function tableToCsv(columns: string[], rows: unknown[][], protectFormulas = true): string {
    const cell = (value: unknown) => {
        let text = tableCellText(value);
        if (protectFormulas && typeof value !== "number" && /^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = "'" + text;
        return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    return [columns.map(cell).join(","), ...rows.map((row) => row.map(cell).join(","))].join("\r\n");
}

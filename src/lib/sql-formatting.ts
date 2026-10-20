import { format } from "sql-formatter";
export type SqlDialect = "postgresql" | "mysql" | "sqlite";
export function formatSqlQuery(input: string, dialect: SqlDialect): string {
    if (input.length > 500_000) throw new Error("SQL formatting limit is 500,000 characters.");
    return format(input, { language: dialect, keywordCase: "upper" });
}
/** Collapse only whitespace outside quoted literals/identifiers and comments.
 * Line comments retain their terminating newline. No SQL is executed. */
export function compactSqlQuery(input: string, dialect: SqlDialect): string {
    const text = formatSqlQuery(input, dialect); let output = "", index = 0;
    while (index < text.length) {
        const char = text[index];
        if (/\s/.test(char)) { while (index < text.length && /\s/.test(text[index])) index++; if (output && !output.endsWith("\n")) output += " "; continue; }
        if (text.startsWith("--", index) || (dialect === "mysql" && char === "#")) { const end = text.indexOf("\n", index); if (end < 0) { output += text.slice(index); break; } output += text.slice(index, end + 1); index = end + 1; continue; }
        if (text.startsWith("/*", index)) {
            const start = index; index += 2; let depth = 1;
            while (index < text.length && depth) { if (text.startsWith("/*", index)) { depth++; index += 2; } else if (text.startsWith("*/", index)) { depth--; index += 2; } else index++; }
            output += text.slice(start, index); continue;
        }
        const dollar = dialect === "postgresql" ? /^\$(?:[A-Za-z_]\w*)?\$/.exec(text.slice(index))?.[0] : undefined;
        if (dollar) { const end = text.indexOf(dollar, index + dollar.length); if (end < 0) throw new Error("Unclosed PostgreSQL dollar-quoted string."); output += text.slice(index, end + dollar.length); index = end + dollar.length; continue; }
        if (["'", '"', "`", "["].includes(char)) {
            const start = index, close = char === "[" ? "]" : char;
            const backslash = dialect === "mysql" || (char === "'" && /[eE]/.test(text[index - 1] ?? "") && !/[\w]/.test(text[index - 2] ?? ""));
            index++;
            while (index < text.length) {
                if (text[index] === "\\" && backslash) { index += 2; continue; }
                if (text[index] === close) { if (text[index + 1] === close) { index += 2; continue; } index++; break; }
                index++;
            }
            output += text.slice(start, index); continue;
        }
        output += char; index++;
    }
    return output.trim();
}

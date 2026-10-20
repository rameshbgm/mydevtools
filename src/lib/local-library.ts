import { formatJsonText } from "./json-formatting";
export interface ResourceBookmark { id: string; title: string; url: string; folder: string; tags: string[]; updatedAt: string }
export interface CodeSnippet { id: string; title: string; language: string; code: string; tags: string[]; updatedAt: string }
export const SNIPPET_LANGUAGES = ["plaintext", "json", "yaml", "xml", "html", "css", "javascript", "typescript", "python", "go", "rust", "java", "csharp", "sql", "shell", "markdown"] as const;
export function resourceUrl(value: string): string {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("Use an HTTP or HTTPS URL without embedded credentials.");
    return url.href;
}
function tags(value: unknown): value is string[] { return Array.isArray(value) && value.length <= 20 && value.every((tag) => typeof tag === "string" && tag.length <= 60); }
export function parseLibrary<T extends "bookmarks" | "snippets">(value: unknown, kind: T): T extends "bookmarks" ? ResourceBookmark[] : CodeSnippet[] {
    if (!Array.isArray(value) || value.length > (kind === "bookmarks" ? 500 : 100)) throw new Error(`Invalid ${kind} list or record limit exceeded.`);
    const ids = new Set<string>();
    for (const record of value) {
        if (!record || typeof record !== "object" || typeof record.id !== "string" || !record.id || ids.has(record.id) || typeof record.title !== "string" || !record.title.trim() || record.title.length > 160 || !tags(record.tags) || typeof record.updatedAt !== "string") throw new Error(`An imported ${kind} record is invalid.`);
        if (kind === "bookmarks") {
            if (typeof record.url !== "string" || record.url.length > 8192 || typeof record.folder !== "string" || record.folder.length > 120) throw new Error("Invalid bookmark URL or folder.");
            resourceUrl(record.url);
        } else if (typeof record.code !== "string" || record.code.length > 200_000 || !SNIPPET_LANGUAGES.includes(record.language)) throw new Error("Invalid snippet language or code exceeds 200,000 characters.");
        ids.add(record.id);
    }
    return value as T extends "bookmarks" ? ResourceBookmark[] : CodeSnippet[];
}
export function detectCodeLanguage(code: string): string {
    const input = code.trim();
    if (!input) return "plaintext";
    if (/^[{[]/.test(input)) { try { JSON.parse(input); return "json"; } catch { /* Test code syntax below. */ } }
    if (/^<!doctype html|^<\?xml|^<[\w:-]+(?:\s|>)/i.test(input)) return /<!doctype html|<html|<div|<body/i.test(input) ? "html" : "xml";
    if (/^\s*(SELECT|INSERT INTO|UPDATE|CREATE TABLE|WITH)\b/i.test(input)) return "sql";
    if (/^(from \w+ import|import \w+\s*$|def \w+\(|class \w+.*:)/m.test(input)) return "python";
    if (/\bpackage main\b|\bfunc \w+\(/.test(input)) return "go";
    if (/\b(fn \w+|impl |use std::)/.test(input)) return "rust";
    if (/\b(interface \w+|type \w+\s*=|:\s*(string|number|boolean)\b)/.test(input)) return "typescript";
    if (/\b(const |let |function |=>|console\.)/.test(input)) return "javascript";
    if (/\bpublic (class|static)|\bimport java\./.test(input)) return "java";
    if (/^#!.*\b(bash|sh)\b|^\s*(export |echo |curl )/m.test(input)) return "shell";
    if (/^[.#\w][^{]*\{\s*[\w-]+\s*:/.test(input)) return "css";
    if (/^[\w-]+:\s+\S/m.test(input)) return "yaml";
    return "plaintext";
}
export async function formatSnippet(code: string, language: string): Promise<string> {
    if (code.length > 200_000) throw new Error("Snippet limit is 200,000 characters.");
    if (language === "json") { const output = formatJsonText(code); if (output.length > 200_000) throw new Error("Snippet limit is 200,000 characters."); return output; }
    if (language === "yaml") {
        const { parseYamlForFormatting } = await import("./yaml-formatting");
        // Format the document rather than converting it to JavaScript values:
        // Number cannot represent every YAML integer, decimal or exponent.
        const output = parseYamlForFormatting(code).toString();
        if (output.length > 200_000) throw new Error("Snippet limit is 200,000 characters.");
        return output;
    }
    if (language === "sql") { const formatter = await import("sql-formatter"); return formatter.format(code, { language: "postgresql" }); }
    if (["javascript", "typescript", "html", "xml", "css"].includes(language)) {
        const beautify = await import("js-beautify");
        return language === "css" ? beautify.css(code, { indent_size: 2 }) : language === "html" || language === "xml" ? beautify.html(code, { indent_size: 2 }) : beautify.js(code, { indent_size: 2 });
    }
    throw new Error("Formatting is available for JSON, YAML, SQL, JavaScript, TypeScript, HTML, XML and CSS. Other languages still support highlighting and editing.");
}

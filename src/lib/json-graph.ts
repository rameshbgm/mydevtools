import { numberSourceRoundTrips, parseSchemaSamples, SchemaNumber } from "./json-number-source";
export type JsonKind = "object" | "array" | "string" | "number" | "boolean" | "null";
export interface JsonGraphNode { id: number; parent: number | null; key: string; path: string; kind: JsonKind; summary: string; value: unknown; children: number[] }
export interface JsonGraph { nodes: JsonGraphNode[]; unsafeNumbers: boolean }
export interface PlacedJsonNode extends JsonGraphNode { x: number; y: number }
export interface JsonGraphLayout { nodes: PlacedJsonNode[]; width: number; height: number; limited: boolean }
export function indexJsonGraph(input: string): JsonGraph {
    if (new TextEncoder().encode(input).length > 2 * 1024 * 1024) throw new Error("Use JSON up to 2 MiB.");
    let value: unknown;
    try { value = parseSchemaSamples(input); } catch (cause) {
        if (cause instanceof Error && cause.message === "The samples are too large or deeply nested. Use smaller representative examples.") throw new Error("Use at most 10,000 nodes and 80 nesting levels.");
        throw cause;
    }
    const nodes: JsonGraphNode[] = [];
    let unsafeNumbers = false, pathCharacters = 0;
    function visit(value: unknown, parent: number | null, key: string, path: string, depth: number): number {
        if (depth > 80 || nodes.length >= 10_000) throw new Error("Use at most 10,000 nodes and 80 nesting levels.");
        pathCharacters += path.length;
        if (path.length > 8192 || pathCharacters > 8 * 1024 * 1024) throw new Error("JSON paths exceed the 8 KiB per-path or 8 MiB total index limit. Shorten long property names or visualize a smaller branch.");
        if (value instanceof SchemaNumber) {
            if (numberSourceRoundTrips(value.source)) value = Number(value.source);
            else unsafeNumbers = true;
        }
        const kind: JsonKind = value instanceof SchemaNumber ? "number" : value === null ? "null" : Array.isArray(value) ? "array" : typeof value as JsonKind;
        const summary = kind === "array" ? `Array [${(value as unknown[]).length}]` : kind === "object" ? `Object {${Object.keys(value as object).length}}` : graphJsonText(value, 0);
        const node: JsonGraphNode = { id: nodes.length, parent, key, path, kind, summary, value, children: [] };
        nodes.push(node);
        if (kind === "array") (value as unknown[]).forEach((child, index) => {
            const id = visit(child, node.id, String(index), `${path}[${index}]`, depth + 1);
            node.children.push(id); (value as unknown[])[index] = nodes[id].value;
        });
        else if (kind === "object") for (const [name, child] of Object.entries(value as object)) {
            const id = visit(child, node.id, name, `${path}[${JSON.stringify(name)}]`, depth + 1);
            node.children.push(id); Object.defineProperty(value, name, { value: nodes[id].value, enumerable: true, writable: true, configurable: true });
        }
        return node.id;
    }
    visit(value, null, "$", "$", 0);
    return { nodes, unsafeNumbers };
}
/** Source-sensitive JSON numbers remain numeric tokens, never quoted strings or Number approximations. */
export function graphJsonText(value: unknown, indent = 2): string {
    const gap = " ".repeat(Math.max(0, Math.min(10, indent)));
    const render = (item: unknown, depth: number): string => {
        if (item instanceof SchemaNumber) return item.source;
        if (item === null || typeof item !== "object") return JSON.stringify(item) ?? "null";
        const array = Array.isArray(item), entries = array ? item.map((child) => render(child, depth + 1)) : Object.entries(item).map(([key, child]) => `${JSON.stringify(key)}:${gap ? " " : ""}${render(child, depth + 1)}`);
        const [open, close] = array ? ["[", "]"] : ["{", "}"];
        return entries.length ? gap ? `${open}\n${gap.repeat(depth + 1)}${entries.join(`,\n${gap.repeat(depth + 1)}`)}\n${gap.repeat(depth)}${close}` : `${open}${entries.join(",")}${close}` : open + close;
    };
    return render(value, 0);
}
export function graphCellText(value: unknown): string {
    return value == null ? "" : typeof value === "string" ? value : graphJsonText(value, 0);
}
/** Formula protection applies to text; numeric source tokens remain unchanged. */
export function graphTableCsv(columns: string[], rows: unknown[][], protectFormulas = true): string {
    const cell = (value: unknown) => {
        let text = graphCellText(value);
        if (protectFormulas && typeof value !== "number" && !(value instanceof SchemaNumber) && /^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = "'" + text;
        return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '\"\"')}"` : text;
    };
    return [columns.map(cell).join(","), ...rows.map((row) => row.map(cell).join(","))].join("\r\n");
}
export interface JsonGraphLabels { title: string; limitedTitle: string; array: string; object: string }
export function graphNodeSummary(node: JsonGraphNode, labels?: Pick<JsonGraphLabels, "array" | "object">): string {
    return labels && node.kind === "array" ? `${labels.array} [${node.children.length}]` : labels && node.kind === "object" ? `${labels.object} {${node.children.length}}` : node.summary;
}
export function jsonGraphLayout(graph: JsonGraph, collapsed: ReadonlySet<number>, root = 0, limit = 500): JsonGraphLayout {
    if (!Number.isInteger(limit) || limit < 1 || limit > 500 || !graph.nodes[root]) throw new Error("Invalid graph root or display limit.");
    const nodes: PlacedJsonNode[] = [];
    let row = 0, limited = false;
    function place(id: number, depth: number): PlacedJsonNode | undefined {
        if (nodes.length >= limit) { limited = true; return; }
        const node: PlacedJsonNode = { ...graph.nodes[id], x: 24 + depth * 280, y: 0 };
        nodes.push(node);
        const children: PlacedJsonNode[] = [];
        if (!collapsed.has(id)) for (const child of node.children) {
            const placed = place(child, depth + 1); if (placed) children.push(placed); else break;
        }
        node.y = children.length ? (children[0].y + children[children.length - 1].y) / 2 : 24 + row++ * 64;
        return node;
    }
    place(root, 0);
    return { nodes, width: Math.max(...nodes.map((node) => node.x)) + 270, height: Math.max(...nodes.map((node) => node.y)) + 66, limited };
}
export function shortGraphText(value: string, length = 34): string { return value.length > length ? value.slice(0, length - 1) + "…" : value; }
export function graphArrayTable(value: unknown): { columns: string[]; rows: unknown[][]; limited: boolean; objectRows: boolean } | null {
    if (!Array.isArray(value)) return null;
    const selected = value.slice(0, 1000), objects = selected.length > 0 && selected.every((row) => row !== null && typeof row === "object" && !Array.isArray(row) && !(row instanceof SchemaNumber));
    const allKeys = objects ? Array.from(new Set(selected.flatMap((row) => Object.keys(row)))) : ["value"];
    const columns = allKeys.slice(0, 100);
    return { columns, objectRows: objects, rows: selected.map((row) => objects ? columns.map((key) => Object.prototype.hasOwnProperty.call(row, key) ? row[key] : null) : [row]), limited: value.length > 1000 || allKeys.length > 100 };
}
export interface JsonGraphPalette { background: string; node: string; border: string; text: string; muted: string; edge: string; accent: string }
export const JSON_GRAPH_PALETTES: Record<"light" | "dark", JsonGraphPalette> = {
    light: { background: "#e5ebf2", node: "#ffffff", border: "#7c8fa8", text: "#17283d", muted: "#53677d", edge: "#53677d", accent: "#2458d3" },
    dark: { background: "#101a26", node: "#172535", border: "#617994", text: "#e8f0fc", muted: "#a8bad0", edge: "#a8bad0", accent: "#9bbaff" },
};
function xml(value: string): string {
    return value.replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu, "�").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);
}
export function jsonGraphSvg(layout: JsonGraphLayout, collapsed: ReadonlySet<number>, palette: JsonGraphPalette, labels?: JsonGraphLabels): string {
    const visible = new Map(layout.nodes.map((node) => [node.id, node]));
    const edges = layout.nodes.flatMap((node) => {
        const parent = node.parent === null ? undefined : visible.get(node.parent);
        return parent ? [`<path d="M${parent.x + 246},${parent.y + 21} H${node.x - 17} V${node.y + 21} H${node.x}"/>`] : [];
    }).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}"><title>${xml(layout.limited ? labels?.limitedTitle ?? "JSON graph (first 500 visible nodes)" : labels?.title ?? "JSON graph")}</title><rect width="100%" height="100%" fill="${palette.background}"/><g stroke="${palette.edge}" fill="none">${edges}</g>${layout.nodes.map((node) => `<g><title>${xml(node.path)}\n${xml(graphNodeSummary(node, labels))}</title><rect x="${node.x}" y="${node.y}" width="246" height="42" rx="6" fill="${palette.node}" stroke="${palette.border}"/><text x="${node.x + 10}" y="${node.y + 16}" fill="${palette.text}" font-family="monospace" font-size="12">${xml(shortGraphText(node.key, 30))}${node.children.length ? collapsed.has(node.id) ? " [+]" : " [-]" : ""}</text><text x="${node.x + 10}" y="${node.y + 32}" fill="${palette.muted}" font-family="monospace" font-size="11">${xml(shortGraphText(graphNodeSummary(node, labels), 35))}</text></g>`).join("")}</svg>`;
}

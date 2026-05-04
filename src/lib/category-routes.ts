import type { ToolCategory, ToolDefinition } from "./tools-registry";
import { TOOL_ID_TO_CATEGORY } from "./tool-url-table";

/** Stable URL slug for category labels (e.g. `"Diff & Compare"` → `diff-and-compare`). */
export function categoryToSlug(category: string): string {
    return category
        .toLowerCase()
        .trim()
        .replace(/\s*&\s*/g, "-and-")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

const _slugToCategory: Record<string, string> = {};
for (const c of new Set(Object.values(TOOL_ID_TO_CATEGORY))) {
    _slugToCategory[categoryToSlug(c)] = c;
}

export function slugToCategory(slug: string): ToolCategory | null {
    const hit = _slugToCategory[slug];
    return (hit ?? null) as ToolCategory | null;
}

/** First path segment must not be treated as a category slug for tool URLs. */
export const RESERVED_ROUTE_SEGMENTS = new Set([
    "_next",
    "api",
    "tools",
    "memory",
    "release-notes",
]);

/** Canonical public URL `/category-slug/tool-id`. */
export function toolPath(tool: Pick<ToolDefinition, "id" | "category">): string {
    return `/${categoryToSlug(tool.category)}/${tool.id}`;
}

export function toolPathFromId(toolId: string): string | null {
    const cat = TOOL_ID_TO_CATEGORY[toolId as keyof typeof TOOL_ID_TO_CATEGORY];
    return cat ? `/${categoryToSlug(cat)}/${toolId}` : null;
}

/**
 * Extract registry tool id from the visible path (canonical `/formatters/json-formatter`,
 * legacy `/tools/json-formatter` still understood until proxy redirect runs).
 */
export function getToolIdFromPublicPath(pathname: string): string | null {
    const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "";

    const legacy = clean.match(/^\/tools\/([^/]+)$/);
    if (legacy?.[1]) {
        const id = legacy[1];
        return id in TOOL_ID_TO_CATEGORY ? id : null;
    }

    const m = clean.match(/^\/([^/]+)\/([^/]+)$/);
    if (!m) return null;
    const [, seg0, seg1] = m;
    if (RESERVED_ROUTE_SEGMENTS.has(seg0)) return null;
    const expected = slugToCategory(seg0);
    if (!expected) return null;
    const catForId = TOOL_ID_TO_CATEGORY[seg1 as keyof typeof TOOL_ID_TO_CATEGORY];
    if (!catForId || catForId !== expected) return null;
    return seg1;
}

export function dashboardCategoryHashId(cat: ToolCategory): string {
    return `category-${categoryToSlug(cat)}`;
}

import { DEBUGGING_GUIDES, type DebuggingGuide } from "./debugging-guides";
import { toolPathFromId } from "./category-routes";
import type { ToolPayload } from "./tool-bridge";

/** Public fixture IDs travel in the URL so reloads and new tabs work without
 * copying data or relying on storage permission. Only bundled fixtures load. */
export function guideExampleHref(guide: DebuggingGuide): string {
    const path = toolPathFromId(guide.toolId);
    if (!path) throw new Error("The guide's destination tool is unavailable.");
    return guide.id === "cors" ? path : `${path}?example=${encodeURIComponent(guide.id)}`;
}

export function guideExamplePayload(pathname: string, search: string): ToolPayload | null {
    const id = new URLSearchParams(search).get("example");
    if (id === null) return null;
    const guide = DEBUGGING_GUIDES.find((item) => item.id === id && item.id !== "cors");
    if (!guide || pathname !== toolPathFromId(guide.toolId)) throw new Error("This example does not match this tool. Open the Debugging guides and choose its Load example link again.");
    return { kind: guide.kind, data: guide.example, sourceToolId: "guides", label: guide.title, createdAt: Date.now() };
}

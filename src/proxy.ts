import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOOL_ID_TO_CATEGORY } from "@/lib/tool-url-table";

function categoryToSlug(category: string): string {
    return category
        .toLowerCase()
        .trim()
        .replace(/\s*&\s*/g, "-and-")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

const RESERVED = new Set(["_next", "api", "tools", "memory", "release-notes"]);

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (pathname.includes(".") && !pathname.startsWith("/.")) {
        return NextResponse.next();
    }
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] === "tools" && segments.length === 2) {
        const id = segments[1];
        const cat = TOOL_ID_TO_CATEGORY[id as keyof typeof TOOL_ID_TO_CATEGORY];
        if (cat) {
            const url = new URL(`/${categoryToSlug(cat)}/${id}`, request.url);
            return NextResponse.redirect(url, 308);
        }
    }

    if (segments.length === 2 && !RESERVED.has(segments[0])) {
        const catSlug = segments[0];
        const toolId = segments[1];
        const expectedCat = TOOL_ID_TO_CATEGORY[toolId as keyof typeof TOOL_ID_TO_CATEGORY];
        if (expectedCat) {
            if (categoryToSlug(expectedCat) !== catSlug) {
                const url = new URL(`/${categoryToSlug(expectedCat)}/${toolId}`, request.url);
                return NextResponse.redirect(url, 308);
            }
            // Canonical rewrites are declared in next.config.ts. Keeping this
            // branch as `next()` avoids re-running the proxy against the
            // internal `/tools/...` destination and creating a redirect loop.
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|txt|xml|webmanifest|json)$).*)",
    ],
};

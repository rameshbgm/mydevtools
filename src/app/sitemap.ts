import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo-content";
import { toolsRegistry } from "@/lib/tools-registry";
import { toolPath } from "@/lib/category-routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const homepage: MetadataRoute.Sitemap[number] = {
        url: SITE_URL,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1.0,
    };

    const toolPages: MetadataRoute.Sitemap = toolsRegistry.map((t) => ({
        url: `${SITE_URL}${toolPath(t)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [homepage, ...toolPages];
}

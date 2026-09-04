import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo-content";
import { SEO_CONTENT } from "@/lib/seo-content";
import { toolPathFromId } from "@/lib/category-routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const homepage: MetadataRoute.Sitemap[number] = {
        url: SITE_URL,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1.0,
    };

    const toolPages: MetadataRoute.Sitemap = Object.keys(SEO_CONTENT).flatMap((toolId) => {
        const path = toolPathFromId(toolId);
        return path ? [{
            url: `${SITE_URL}${path}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        }] : [];
    });

    return [homepage, ...toolPages];
}

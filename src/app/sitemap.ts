import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo-content";
import toolsRegistry from "@/lib/public-tool-catalog.json";
import { toolPathFromId } from "@/lib/category-routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    const homepage: MetadataRoute.Sitemap[number] = {
        url: SITE_URL,
        changeFrequency: "weekly",
        priority: 1.0,
    };

    const toolPages: MetadataRoute.Sitemap = toolsRegistry.flatMap((tool) => {
        const path = toolPathFromId(tool.id);
        return path ? [{
            url: `${SITE_URL}${path}`,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        }] : [];
    });

    return [homepage, { url: `${SITE_URL}/guides`, changeFrequency: "monthly", priority: 0.7 }, { url: `${SITE_URL}/release-notes`, changeFrequency: "monthly", priority: 0.6 }, ...toolPages];
}

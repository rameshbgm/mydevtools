import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo-content";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${SITE_NAME}: Free Online Developer Tools`,
        short_name: SITE_NAME,
        description: SITE_DESCRIPTION,
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "any",
        background_color: "#0a0a0a",
        theme_color: "#6366f1",
        categories: ["developer", "productivity", "utilities"],
        lang: "en",
        dir: "ltr",
        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-maskable-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
        shortcuts: [
            {
                name: "JSON Formatter",
                short_name: "JSON",
                description: "Format and validate JSON",
                url: "/tools/json-formatter",
            },
            {
                name: "JWT Decoder",
                short_name: "JWT",
                description: "Decode JSON Web Tokens",
                url: "/tools/jwt-decoder",
            },
            {
                name: "UUID Generator",
                short_name: "UUID",
                description: "Generate UUIDs",
                url: "/tools/uuid-generator",
            },
            {
                name: "Regex Tester",
                short_name: "Regex",
                description: "Test regular expressions",
                url: "/tools/regex-tester",
            },
        ],
    };
}

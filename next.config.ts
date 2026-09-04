import type { NextConfig } from "next";
import { TOOL_ID_TO_CATEGORY } from "./src/lib/tool-url-table";

function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/\s*&\s*/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const canonicalToolRewrites = Object.entries(TOOL_ID_TO_CATEGORY).map(([toolId, category]) => ({
  source: `/${categoryToSlug(category)}/${toolId}`,
  destination: `/tools/${toolId}`,
}));

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: canonicalToolRewrites,
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;

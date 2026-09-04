// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useTypeScriptCli: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      // The proxy validates known tool paths and handles legacy redirects;
      // this rewrite serves the validated canonical path without re-entering
      // the proxy and creating a redirect loop.
      beforeFiles: [
        {
          source: "/:categorySlug((?!api(?:/|$)|tools(?:/|$)|_next(?:/|$)|memory(?:/|$)|release-notes(?:/|$))[^/]+)/:toolId",
          destination: "/tools/:toolId",
        },
      ],
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

module.exports = nextConfig;

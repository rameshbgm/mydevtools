// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  logging: false,
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
          source: "/:categorySlug(artificial-intelligence|diff-and-compare|api-and-web-services|encoding-and-decoding|certificates-and-keys|cryptography|data-converters|formatters|fun-and-games|generators|image-and-media|network|text-and-utilities|validators|reference)/:toolId",
          destination: "/tools/:toolId",
        },
      ],
    };
  },
  async headers() {
    return [
      { source: "/api/:path*", headers: [
        { key: "Cache-Control", value: "no-store, private, max-age=0" },
        { key: "CDN-Cache-Control", value: "no-store" },
        { key: "Surrogate-Control", value: "no-store" },
        { key: "Pragma", value: "no-cache" },
        { key: "Expires", value: "0" },
      ] },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

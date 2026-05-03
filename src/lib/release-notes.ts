/**
 * Release notes — append a new entry at the TOP of the array when shipping
 * meaningful changes. Each entry shows on the dashboard "What's New" section.
 *
 * Conventions:
 *   - date:      ISO YYYY-MM-DD, the day the change went live
 *   - version:   bump minor for new tools / categories, patch for fixes,
 *                major for shell or design overhauls
 *   - kind:      "feature" | "fix" | "security" | "ui" | "perf"
 *                drives the badge color; mix kinds with multiple bullets
 *   - title:     short headline (under 80 chars)
 *   - notes:     1-5 bullet points, each one short imperative-tense sentence
 */

export type ReleaseKind = "feature" | "fix" | "security" | "ui" | "perf";

export interface ReleaseNote {
    date: string;          // ISO YYYY-MM-DD
    version: string;       // semver-ish, e.g. "1.4.0"
    kind: ReleaseKind;
    title: string;
    notes: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
    {
        date: "2026-05-03",
        version: "1.6.0",
        kind: "feature",
        title: "App overview, release notes, and richer Learn-More copy",
        notes: [
            "New 'Learn More About This App' panel on the dashboard with privacy and security context.",
            "New 'What's New' release notes section so returning users can scan recent shipping work.",
            "Expanded Learn-More copy for URL Parser, Swagger Viewer, JSONPath Tester, WSDL Parser, IP Address Tools, and MAC Address Tools — RFC references and real-world tips throughout.",
        ],
    },
    {
        date: "2026-05-03",
        version: "1.5.1",
        kind: "fix",
        title: "Honest expectations for in-browser certificate generation",
        notes: [
            "Browser Web Crypto cannot emit a valid X.509 certificate, so the self-signed tab now warns and points users to the OpenSSL command instead of claiming success.",
        ],
    },
    {
        date: "2026-05-03",
        version: "1.5.0",
        kind: "ui",
        title: "Mobile polish and animated tagline",
        notes: [
            "Footer padding now uses clamp() so phones under 360px get tighter spacing.",
            "Matrix-style scramble-decode animation rotates the tagline on the hero.",
            "Certificate Validator URL layout cleaned up on small screens.",
        ],
    },
    {
        date: "2026-04-12",
        version: "1.4.0",
        kind: "security",
        title: "Full privacy hardening",
        notes: [
            "Removed every third-party runtime request — no Google Fonts CDN, no analytics, no remote APIs.",
            "Replaced the crt.sh CT log search with a local live server certificate inspection over a direct TLS socket.",
            "Added a same-origin CORS proxy so the API Request Builder can hit any endpoint without leaking referrer to a third party.",
        ],
    },
    {
        date: "2026-04-05",
        version: "1.3.0",
        kind: "feature",
        title: "PWA support and full mobile responsiveness",
        notes: [
            "Installable as a Progressive Web App with offline support for every tool.",
            "Every tool page is now mobile-responsive end to end.",
            "Added storage and memory management page.",
        ],
    },
    {
        date: "2026-03-24",
        version: "1.2.0",
        kind: "feature",
        title: "Certificate suite consolidation and CSR fixes",
        notes: [
            "Merged 10 separate certificate tools into 4 cohesive ones (Inspector, Chain & SSL, Generator, PKCS#12).",
            "Fixed CSR generation for ECDSA and Ed25519 — signatures now verify correctly with OpenSSL.",
            "Added URL fetch to inspect any live server's certificate directly from the browser.",
        ],
    },
    {
        date: "2026-03-12",
        version: "1.1.0",
        kind: "feature",
        title: "Command palette and search",
        notes: [
            "Cmd/Ctrl-K opens a global command palette to jump to any tool.",
            "Header search is keyboard-navigable with category grouping.",
        ],
    },
    {
        date: "2026-02-28",
        version: "1.0.0",
        kind: "feature",
        title: "Initial public release",
        notes: [
            "80+ developer tools, all running entirely in the browser.",
            "JSON, XML, YAML, CSV converters and validators.",
            "Cryptography (JWT, JWS, JWE, JWK, HMAC, AES, BCrypt, hashing).",
            "Certificate inspection, generation, chain validation; SSH key generation.",
            "Network tools: IP/subnet calculator, MAC lookup, port reference.",
            "REST and SOAP clients, OpenAPI viewer, regex tester, JSONPath/XPath testers.",
        ],
    },
];

export const KIND_LABEL: Record<ReleaseKind, string> = {
    feature:  "Feature",
    fix:      "Fix",
    security: "Security",
    ui:       "UI",
    perf:     "Performance",
};

/* Color tokens are duplicated for both modes; the dashboard picks the right
   one based on `darkMode`. Keep these in sync if you add a new ReleaseKind. */
export const KIND_COLORS: Record<ReleaseKind, { bg: string; bgDark: string; text: string; textDark: string; border: string; borderDark: string }> = {
    feature:  { bg: "rgba(99,102,241,0.10)",  bgDark: "rgba(99,102,241,0.18)",  text: "#4f46e5", textDark: "#a5b4fc", border: "rgba(99,102,241,0.25)",  borderDark: "rgba(99,102,241,0.40)" },
    fix:      { bg: "rgba(16,185,129,0.10)",  bgDark: "rgba(16,185,129,0.18)",  text: "#047857", textDark: "#6ee7b7", border: "rgba(16,185,129,0.25)",  borderDark: "rgba(16,185,129,0.40)" },
    security: { bg: "rgba(244,63,94,0.10)",   bgDark: "rgba(244,63,94,0.18)",   text: "#be123c", textDark: "#fda4af", border: "rgba(244,63,94,0.25)",   borderDark: "rgba(244,63,94,0.40)" },
    ui:       { bg: "rgba(236,72,153,0.10)",  bgDark: "rgba(236,72,153,0.18)",  text: "#be185d", textDark: "#f9a8d4", border: "rgba(236,72,153,0.25)",  borderDark: "rgba(236,72,153,0.40)" },
    perf:     { bg: "rgba(245,158,11,0.10)",  bgDark: "rgba(245,158,11,0.18)",  text: "#b45309", textDark: "#fcd34d", border: "rgba(245,158,11,0.25)",  borderDark: "rgba(245,158,11,0.40)" },
};

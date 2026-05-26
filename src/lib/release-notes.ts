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

/**
 * Public-facing version number shown in the topbar. Bump on a meaningful
 * shipping milestone — does NOT need to match individual entries below.
 */
export const APP_VERSION = "1.4";

export type ReleaseKind = "feature" | "fix" | "security" | "ui" | "perf";

/**
 * One section per ReleaseNote. The dashboard renders the title, the kind
 * badge, the date, and each section as a labeled bullet list. Group related
 * bullets under a section to keep long releases readable.
 */
export interface ReleaseSection {
    label: string;
    bullets: string[];
}

export interface ReleaseNote {
    date: string;          // ISO YYYY-MM-DD
    version: string;       // semver-ish, e.g. "1.1"
    kind: ReleaseKind;
    title: string;
    summary?: string;      // optional one-liner shown above the sections
    sections: ReleaseSection[];
}

/**
 * Release notes — newest entry FIRST. The exported array is sorted on
 * load so out-of-order appends still render correctly.
 *
 * V1.2 — workshop workspace UI, canonical routes on Next.js 16 proxy,
 *        landing/marketing polish, Timer + Stopwatch, 90 audited tools,
 *        routing + lint + converter hardening (see shipped notes).
 *
 * V1.1 — privacy hardening, certificate suite consolidation, command
 *        palette, mobile + PWA polish, dashboard overview panel,
 *        and the release-notes section.
 *
 * V1.0 — initial public release of the toolkit (80+ tools).
 */
const ENTRIES: ReleaseNote[] = [
    {
        date: "2026-05-27",
        version: "1.4",
        kind: "feature",
        title: "V1.4 — Networking, Diff, Image & Media, Data Conversion (14 new tools)",
        summary:
            "Four new directions land fully implemented: Networking & Web (Webhook Receiver, WebSocket Tester, CORS Tester, DNS Lookup), Diff & Compare additions (Image Diff, CSV Diff), a new Image & Media category (Image Compressor, SVG Optimizer, Favicon Generator, Color Palette Extractor, EXIF Viewer), and Data Conversion additions (Mock Data Generator, TOML Converter, TOON Converter). All 14 ship functional — no placeholders.",
        sections: [
            {
                label: "New category — Image & Media (5 tools, all client-side)",
                bullets: [
                    "**Image Compressor** — Canvas re-encode with quality slider, JPEG/WebP/PNG output, optional max-dimension resize, live before/after preview.",
                    "**SVG Optimizer** — strips editor metadata (Inkscape/Sketch/Figma), collapses whitespace, rounds numeric precision with a 0–6 decimal slider, side-by-side rendered preview.",
                    "**Favicon Generator** — produces 7 sizes (16/32/48/96/180/192/512) from one source, with HTML head snippet and PWA manifest scaffolds.",
                    "**Color Palette Extractor** — k-means in RGB space at 200px downsample, configurable palette size 3–16, HEX/RGB/HSL per swatch.",
                    "**EXIF Viewer** — in-browser EXIF parser for JPEG/TIFF; groups Camera/Lens/Capture/Image/GPS tags, decodes GPS to decimal lat/lon with map link.",
                ],
            },
            {
                label: "Networking & Web (4 tools)",
                bullets: [
                    "**Webhook Receiver** — generates a unique inbound URL, captures any HTTP request, surfaces method/headers/query/body live. Uses a new `/api/webhook/[sessionId]` endpoint with in-memory store (1h idle TTL, 200 requests/session).",
                    "**WebSocket Tester** — real ws/wss client with connection state, text frame send, timestamped history.",
                    "**CORS Tester** — sends real fetch from browser, classifies failures as preflight vs simple-request, decodes them into plain English.",
                    "**DNS Lookup** — DoH client (Cloudflare/Google), parallel A/AAAA/CNAME/MX/TXT/NS/SOA/CAA/SRV lookups, zone-file-format copy.",
                ],
            },
            {
                label: "Diff & Compare (2 tools)",
                bullets: [
                    "**CSV Diff** — RFC 4180 parser, key-column row matching, column-level change highlighting, copyable audit report.",
                    "**Image Diff** — pixel-by-pixel comparison with side-by-side, overlay (with opacity slider) and difference modes; tolerance slider and changed-pixel stats.",
                ],
            },
            {
                label: "Data Conversion (3 tools)",
                bullets: [
                    "**Mock Data Generator** — schema builder with 15 field types, seedable Mulberry32 RNG for reproducible fixtures, JSON/CSV/SQL output.",
                    "**TOML Converter** — TOML ↔ JSON ↔ YAML with a minimal in-file TOML parser (sections, scalars, arrays of scalars).",
                    "**TOON Converter** — JSON or XML → TOON (Token-Oriented Object Notation). Tabular array detection emits CSV-like rows instead of repeating keys; live characters-saved and approximate tokens-saved badges for LLM prompt budgeting.",
                ],
            },
            {
                label: "Infrastructure",
                bullets: [
                    "New **Image & Media** category — colour, icon, description, order, union type.",
                    "New `/api/webhook/[sessionId]` and `/api/webhook/[sessionId]/events` routes (long-poll); shared in-memory store at `src/lib/webhook-store.ts`.",
                    "`ServerProxyNotice` extended with two new route ids (`proxy-stream`, `webhook`).",
                    "All 14 tools added to `tool-url-table.ts`, `tools-registry.ts` and `seo-content.ts` — full SEO + structured data from day one.",
                ],
            },
        ],
    },
    {
        date: "2026-05-07",
        version: "1.3.1",
        kind: "fix",
        title: "V1.3.1 — antd v6 fixes, CORS auto-retry, Rich Text Editor UX",
        summary:
            "Sweep of antd v6 deprecation warnings, transparent CORS auto-fallback for SOAP Client and WSDL Parser, WSDL request headers support, Rich Text Editor formatting reliability and notepad UX, and a pkcs12 hydration fix.",
        sections: [
            {
                label: "SOAP Client — CORS auto-retry",
                bullets: [
                    "Direct browser fetches that fail with a network/CORS error now **automatically retry through the server proxy** — no need to toggle 'Force server proxy' manually.",
                    "Fixed `Space direction=\"vertical\"` → `orientation=\"vertical\"` antd v6 deprecation in the SSL tab.",
                ],
            },
            {
                label: "WSDL Parser — request headers & merged XSD",
                bullets: [
                    "New collapsible **Request Headers** section on the WSDL input panel — configure headers in form or JSON mode, applied to every WSDL and XSD fetch.",
                    "WSDL and XSD fetches now **auto-fallback through the server proxy** on CORS failure (same pattern as SOAP Client).",
                    "**External XSD** section is now collapsed inside the WSDL input area rather than a separate tab — less clutter, optional by default.",
                ],
            },
            {
                label: "Rich Text Editor — formatting & UX",
                bullets: [
                    "All toolbar buttons now use `onMouseDown` with `preventDefault` to keep editor focus and selection intact — formatting commands (Bold, Italic, lists, alignment, colours) now work reliably.",
                    "Toolbar link button saves the selection on `mousedown` so the selected text is correctly linkified after the modal opens.",
                    "Editor area restyled as a **document canvas**: white paper background, increased padding, max-width constraint, and a subtle box-shadow separating it from the toolbar.",
                    "Removed 'Start typing here…' default placeholder — new documents open with an empty editor.",
                ],
            },
            {
                label: "antd v6 deprecation fixes",
                bullets: [
                    "`gzip-tools`: replaced static `message.success` import with `messageService` to avoid 'cannot consume context' warning; `Alert message=` → `title=`.",
                    "`ssh-key-generator`: `Alert message=` → `title=`.",
                    "`pkcs12-tool`: added `mounted` guard around `Input.Password` to suppress `data-sharkid` browser-extension hydration mismatch.",
                    "`SslConfigSection`: `Alert message=` → `title=`; `Space direction=` → `orientation=` (fixed in previous patch, documented here).",
                ],
            },
        ],
    },
    {
        date: "2026-05-07",
        version: "1.3",
        kind: "feature",
        title: "V1.3 — AI protocol tooling, Fun & Games expansion, persistence & polish",
        summary:
            "Protocol tooling for the AI era (MCP Inspector, A2A Inspector), a full Fun & Games expansion (Spin the Wheel, Magic 8-Ball, Typing Speed Test), two new persistent-text utilities (Sticky Notes, Rich Text Editor), enhanced WSDL/XSD import, and a reliability sweep fixing antd v6 deprecations and SSR hydration mismatches across the toolkit.",
        sections: [
            {
                label: "MCP Inspector (new tool)",
                bullets: [
                    "Connect to any MCP server over **stdio**, **SSE**, or **HTTP** transport from the browser.",
                    "Four connection modes: **direct** (auto-fallback), **direct-strict** (no fallback), **via-server-proxy** (CORS-safe), and **via-mcp-proxy** (tunnels through `npx @modelcontextprotocol/inspector`).",
                    "Set **custom headers**, **request timeout**, **maximum total timeout**, and optionally **reset timeout on progress** for long-running tool calls.",
                    "**OAuth 2.0** PKCE flow with configurable client ID and redirect URL; **SSL/TLS** toggle and inspector proxy token fields.",
                    "**Diagnose** button runs a connectivity pre-flight and surfaces CORS, auth, and transport errors before you start calling tools.",
                    "Full tool listing, schema display, and interactive **call panel** — fill arguments, fire the call, inspect the raw result.",
                ],
            },
            {
                label: "A2A Protocol Inspector (new tool)",
                bullets: [
                    "Connect to any local or remote **Agent2Agent** agent by URL and inspect its **Agent Card** (name, description, capabilities, skills).",
                    "Supports both current A2A spec (`message/send` + `message/stream`) and legacy protocol (`tasks/send` + `agent.json`).",
                    "**Spec compliance checker** — validates the card against the A2A spec and surfaces missing or malformed fields.",
                    "**Streaming responses** — live-streamed via `fetch` + `ReadableStream`; task lifecycle, **contextId** tracking, and skill testing with structured input.",
                    "**Debug console** — shows every raw **JSON-RPC 2.0** request and response with syntax highlighting and copy-to-clipboard.",
                    "Persistent connection history and per-session message log.",
                ],
            },
            {
                label: "WSDL Parser — external XSD support",
                bullets: [
                    "New **Import XSD** tab: paste an external XSD document or load one by URL to resolve `<xsd:import>` / `<xsd:include>` references that point outside the WSDL.",
                    "Multiple XSD documents can be added to the import set; the parser resolves types across all of them before rendering the schema tree.",
                ],
            },
            {
                label: "Spin the Wheel (new tool)",
                bullets: [
                    "Customisable SVG spinning wheel with 2–12 entries, full-rotation Framer Motion animation, and a winner spotlight on landing.",
                    "Add, rename, or remove items freely; entries persist in **localStorage** across reloads.",
                    "12-colour palette auto-assigned to segments; winner highlight with gold border and animated reveal card.",
                ],
            },
            {
                label: "Magic 8-Ball (new tool)",
                bullets: [
                    "All 20 classic responses (10 positive, 5 neutral, 5 negative — same distribution as the original toy).",
                    "Animated SVG ball with radial-gradient 3D sheen and Framer Motion shake; fortune text rendered inside the triangle window.",
                    "Per-session response stats with animated progress bars and question history tracking last 8 entries.",
                ],
            },
            {
                label: "Typing Speed Test (new tool)",
                bullets: [
                    "Measures **WPM** (words per minute) and accuracy in real time using the standard correctChars ÷ 5 ÷ minutes formula.",
                    "Hidden textarea captures keystrokes; visible display highlights characters green (correct), red (error), purple (cursor), and faded (pending).",
                    "Four durations (15 s / 30 s / 60 s / 2 min); timer starts on first keystroke, auto-finishes when the passage is fully typed.",
                    "Results history shows last 5 tests with WPM, accuracy, and error count.",
                ],
            },
            {
                label: "Sticky Notes & Rich Text Editor (new tools)",
                bullets: [
                    "**Sticky Notes**: multi-board note management with colour themes and persistence in **localStorage**.",
                    "**Rich Text Editor**: WYSIWYG editing with export options, also persisted locally so content survives page reloads.",
                ],
            },
            {
                label: "Antd v6 compatibility & SSR reliability",
                bullets: [
                    "Fixed `Space direction=\"vertical\"` → `orientation=\"vertical\"` deprecation (MCP Inspector, Coin Toss).",
                    "Fixed `Statistic valueStyle` → `styles={{ content }}` and `Progress trailColor` → `railColor` deprecations (Coin Toss, Stopwatch).",
                    "Resolved **SSR hydration mismatch** in Timer's `RingTicks` SVG: `Math.sin`/`Math.cos` coordinates rounded to 4 decimal places so Node.js and browser V8 emit identical strings.",
                    "Added `mounted` guards on antd `InputNumber`/`Input`/`Select` fields in Timer and Dice Roll to prevent browser-extension (`data-sharkid`) attribute injection from causing React hydration warnings.",
                    "Fixed MCP Inspector hydration: `localStorage` read moved from `useState` initialiser to `useEffect` so server and client see the same initial state.",
                ],
            },
        ],
    },
    {
        date: "2026-05-04",
        version: "1.2",
        kind: "feature",
        title: "V1.2 — routing, polish, QA pass across 90 tools",
        summary:
            "Stable canonical URLs everywhere, refreshed workshop chrome aligned with landing marketing, Timer and Stopwatch in the toolkit, and a systematic smoke pass over every registry tool route. Developer ergonomics tightened (ESLint scoping for Monaco/vendor code, converters without side effects inside useMemo, React Compiler–clean fixes in QR, timestamp, URL parser).",
        sections: [
            {
                label: "URLs & deployment (Next.js 16)",
                bullets: [
                    "Public paths stay **`/[categorySlug]/[toolId]`** (example: **`/formatters/html-formatter`**) via **`src/proxy.ts`** — the **`middleware`** file convention used in Next 15 does not forward to routes on this stack.",
                    "**`/tools/[id]`** still works: the proxy issues a **308** redirect to the canonical category URL for known tools.",
                    "Every tool id listed in **`tool-url-table.ts`** was checked with **`next start`**; all **90** canonical URLs returned **HTTP 200** and matching **`/tools/...`** returned **308** as expected.",
                ],
            },
            {
                label: "Workshop UX & branding",
                bullets: [
                    "Post-landing catalogue, **`AppShell`**, dashboards, tools, Memory, Release notes, and 404 styling use **`workspace.css`** with **`--wb-*`** tokens and **`wb-*`** classes — warm stone neutrals plus emerald / amber accents, separate from **`landing-*`** marketing styles in **`globals.css`**.",
                    "Landing page remains a branded scroll experience with hero animations, stats strip, category showcase grid, theme-aware palettes, down to narrow phones.",
                    "Top-bar version **`1.2`** aligns with **`APP_VERSION`** here; **`/release-notes`** documents this changelog.",
                ],
            },
            {
                label: "New productivity tools",
                bullets: [
                    "**Timer**: presets (1 min–1 hr), custom H:M:S, circular ring, completion chime via Web Audio, Pomodoro-style session label.",
                    "**Stopwatch**: 10 ms ticks, laps with best/worst highlights, totals and averages.",
                ],
            },
            {
                label: "Reliability & housekeeping",
                bullets: [
                    "**QR Generator**: hoist async generator with **`useCallback`** before the syncing effect so callbacks are not invoked before initialization.",
                    "**Timestamp Converter**: avoid impure **`Date.now()` / `new Date()`** directly in **`useState` initializers**; seed once in **`useEffect`** after mount.",
                    "**URL Parser**: render the literal **`//` authority separator** safely in JSX (**`{ '//' }`**) so the parser doesn’t treat it as a comment.",
                    "**CSV ↔ JSON/XML** & **YAML ↔ JSON**: derive output and parsing errors purely from **`useMemo`** (**no **`setState` inside **`useMemo`**)**, removing subtle render-loop risk.",
                    "**ESLint**: ignore copied **`public/monaco/**`; relax **`react-hooks/set-state-in-effect`**/**`set-state-in-render`** under **`src`** for established editor-sync patterns; **`no-explicit-any`** and **`no-unescaped-entities`** are warnings until tightened tool-by-tool.",
                    "Lint scope is **`src`** only (**`npm run lint`** uses **`eslint src`**).",
                    "Small **`prefer-const`** cleanups (**Certificate Generator**, **Color Picker**, **Cron** iterator, **certificate SAN** parsing helpers).",
                ],
            },
        ],
    },
    {
        date: "2026-05-03",
        version: "1.1",
        kind: "feature",
        title: "Trust, transparency, and a smarter dashboard",
        summary:
            "A polish-and-trust release. The dashboard now opens with a privacy-first overview, the catalog is searchable end-to-end, and several tools picked up real-world fixes. No paid features, no telemetry — same promise, more honest about its limits.",
        sections: [
            {
                label: "Dashboard overview & navigation",
                bullets: [
                    "New 'Learn More About This App' panel — default expanded, leads with the security and privacy promise.",
                    "Full categorized catalog inside the panel: every section listed with every tool and a short description.",
                    "Removed the matrix-style scramble tagline so the privacy message reads in a single scan.",
                    "Version badge added to the topbar; clicking the Memory icon stays one click away.",
                    "This Release Notes panel itself — collapsible, sorted newest first, color-coded by change kind.",
                ],
            },
            {
                label: "Privacy & security hardening",
                bullets: [
                    "Removed every third-party runtime request — no Google Fonts CDN, no analytics, no telemetry, no external scripts.",
                    "Replaced the crt.sh CT log search with a local live-server certificate inspection over a direct TLS socket. Domain names you inspect never go to a third party.",
                    "Added a same-origin CORS proxy so the API Request Builder can hit any endpoint without leaking the referrer to a third party.",
                    "Honest in-browser certificate-generation messaging: Web Crypto cannot emit a valid X.509 cert, so the self-signed tab now warns and points to the matching OpenSSL command instead of claiming success.",
                    "Open source on GitHub — every privacy claim is independently auditable.",
                ],
            },
            {
                label: "New & improved tools",
                bullets: [
                    "Certificate suite consolidated: 10 separate cert tools merged into 4 cohesive ones (Inspector, Chain & SSL, Generator, PKCS#12).",
                    "Fixed CSR generation for ECDSA and Ed25519 — signatures now verify correctly with OpenSSL.",
                    "URL fetch lets you inspect any live server's certificate chain directly from the browser.",
                    "Expanded Learn-More copy across URL Parser, Swagger Viewer, JSONPath Tester, WSDL Parser, IP Address Tools, and MAC Address Tools — with RFC references and real-world examples.",
                ],
            },
            {
                label: "PWA, mobile, and discoverability",
                bullets: [
                    "Installable as a Progressive Web App with full offline support for every tool.",
                    "Every tool page is mobile-responsive end-to-end; footer padding scales with clamp() so sub-360px phones aren't cramped.",
                    "Cmd/Ctrl-K opens a global command palette that jumps to any tool with keyboard navigation.",
                    "Header search is keyboard-navigable with category grouping in the dropdown.",
                    "Storage & memory management page so you can see and clear what's persisted locally.",
                    "Certificate Validator URL layout cleaned up on small screens.",
                ],
            },
        ],
    },
    {
        date: "2026-02-28",
        version: "1.0",
        kind: "feature",
        title: "Initial public release",
        summary:
            "First public edition of My Dev Tools — a private, offline-capable workshop of developer utilities that runs entirely in your browser. No accounts, no uploads, no tracking.",
        sections: [
            {
                label: "Formatting, validation & diff",
                bullets: [
                    "Formatters for JSON, XML, YAML, HTML, CSS, JavaScript, and SQL with prettify and minify modes.",
                    "Validators for JSON, XML, HTML, XSD schema, email addresses, and credit-card numbers (Luhn).",
                    "Side-by-side diff for JSON, XML, and arbitrary text.",
                ],
            },
            {
                label: "Data conversion",
                bullets: [
                    "Bidirectional XML ↔ JSON, YAML ↔ JSON, CSV ↔ JSON, and CSV ↔ XML converters.",
                    "JSON to TypeScript and Java POJO code generators.",
                    "XSLT transformer with live preview.",
                ],
            },
            {
                label: "Encoding & cryptography",
                bullets: [
                    "Base64, URL, HTML entities, Unicode, Hex, and Gzip encoders/decoders.",
                    "Hash generation: MD5, SHA-1/224/256/384/512, SHA-3, RIPEMD-160; HMAC; BCrypt with verify.",
                    "Full JOSE suite: JWT decoder, JWS sign/verify, JWE encrypt/decrypt, JWK generator.",
                    "AES encrypt/decrypt with passphrase or key.",
                ],
            },
            {
                label: "Certificates, keys & SSH",
                bullets: [
                    "X.509 certificate inspection (PEM/DER), fingerprinting, format conversion, and PEM-bundle parsing.",
                    "Self-signed certificate and CSR generation with RSA/ECDSA keys.",
                    "PKCS#12 (.pfx) and Java KeyStore (.jks) tooling.",
                    "RSA, ECDSA, and Ed25519 key-pair generation; SSH key generation with optional passphrase.",
                ],
            },
            {
                label: "API, web services & network",
                bullets: [
                    "REST API request builder with auth, headers, body, history, and cURL export.",
                    "Swagger / OpenAPI viewer; SOAP client and WSDL parser; JSONPath and XPath testers.",
                    "URL parser; IP address tools (IPv4/IPv6); subnet calculator; MAC address lookup.",
                    "Reference tables: HTTP status codes, MIME types, port numbers, RFC standards, IP ranges.",
                ],
            },
            {
                label: "Generators & utilities",
                bullets: [
                    "UUID, password, QR code, and Lorem Ipsum generators.",
                    "String case converter, escape/unescape, Unix permission calculator, cron expression parser.",
                    "Markdown preview, Markdown table builder, slug generator, regex tester with live highlights.",
                    "Color picker, color-contrast checker, timestamp converter, number-base converter.",
                ],
            },
            {
                label: "Foundations",
                bullets: [
                    "100% client-side execution — no data ever leaves your browser.",
                    "Light and dark themes with persistent preference.",
                    "Open-source under the MIT license.",
                ],
            },
        ],
    },
];

/* Sort newest-first by date, then version, so out-of-order appends still
   render correctly. Frozen so the array can be safely shared at runtime. */
export const RELEASE_NOTES: ReadonlyArray<ReleaseNote> = Object.freeze(
    [...ENTRIES].sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        return a.version < b.version ? 1 : -1;
    })
);

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

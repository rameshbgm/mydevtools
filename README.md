# mydevtools

A privacy-first developer tools portal — **147 utilities** across **15 categories**, all in one place. Built with Next.js 16, React 19, Ant Design 6, Monaco Editor, and Framer Motion.

> Stop context-switching between dozens of single-purpose websites. Format, diff, decode, generate, validate, parse, calculate — all from one workspace, in your browser.

🌐 **Live:** [mydevtools.com](https://mydevtools.com)
📦 **Source:** [github.com/rameshbgm/mydevtools](https://github.com/rameshbgm/mydevtools)

---

## Highlights

- **147 tools** organised into 15 logical categories
- **Product introduction** — direct developer-workspace overview, task links, scroll-driven illustrative project story, processing boundaries and searchable catalog navigation. Landing styles use `landing-*` rules in `globals.css`; the live demo and homepage recent/pinned/smart-paste sections have been removed.
- **Canonical URLs** — each tool opens at **`/<category-slug>/<tool-id>`** (e.g. `/formatters/json-formatter`). Legacy **`/tools/...`** hit a **308** redirect to that path; **`src/proxy.ts`** (Next.js 16 proxy, formerly middleware) rewrites the pretty URL to the existing **`/tools/*`** file routes.
- **Workshop chrome (rebrand 2026)** — post‑landing catalogue + **`AppShell`** + tool shells use **`src/app/workspace.css`** with **`--wb-*`** tokens and **`wb-*`** classes (slate-cool neutrals + **cyan / indigo** accents matching the landing palette), plus **`wb-tool-route`** from **`tools/layout.tsx`**.
- **Installable PWA** — works as an app on iOS, Android, Mac and Windows
- **Mobile-first responsive** — every tool adapts to phone, tablet and desktop
- **Header search** with autocomplete — jump to any tool in two keystrokes
- **Accordion sidebar** that auto-expands the active tool's category
- **Light by default**, with a persistent light/dark preference
- **Navigation loader** with friendly messages and 60-second safety timeout
- **Privacy-first**: local tools run in-browser with no analytics or telemetry; managed network tools disclose their data boundary before use
- **Managed network tools** — proxy, certificate inspection, and webhook capture are enabled by default with SSRF controls and quotas; set `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true` to disable them
- **Production build:** Next.js Node deployment for canonical routing and managed tools
- **MIT licensed** — fork it, modify it, ship it

---

## v2.0.0 release

See the [2.0.0 capability list and release guide](docs/v2.0.md) for the additions, expanded functions, references and verification scope.

The application version is now **2.0.0**, with **147 registered tools** across 15 categories. Project Workspaces, encrypted credential/file vaults, snippets, bookmarks, tool tabs, database/storage clients and deeper data/image utilities are implemented. The release notes and [2.0 guide](docs/v2.0.md) describe the implemented capabilities, reference updates and correctness repairs. Verification evidence and remaining operational limits are tracked in [the capability ledger](docs/capability-expansion-status.json).

Project actions use aligned controls and adapt to narrow layouts. Delete moves a custom project to **Deleted projects**, removes it from the selector, and retains its local records and encrypted vaults for **Restore**. Personal cannot be deleted. Deletion does not free browser storage. **Delete permanently** is available in Deleted projects and requires the project name to confirm. Deleting the active project returns the workspace to Personal and locks open vaults.

Workspace tabs support double-click/F2 inline rename and up to ten active workspaces including Personal. The corner X asks for confirmation before permanently deleting a custom workspace and its contents; Manage projects retains recoverable Delete/Restore. The eight language choices preserve mounted tool drafts; Arabic uses RTL navigation while code stays LTR. Detailed translation coverage and the remaining validation gates are documented in [localization](docs/localization.md) and the [2.0 capability ledger](docs/capability-expansion-status.json).

[Storage and project documentation](docs/storage-and-projects.md) covers inventory, previews, export/import formats, encrypted backups, deletion and recovery. Memory & Storage now includes global/project local records, session records, database stores, encrypted vaults and offline caches, with search, scope filters and confirmed clear actions.

[Tool guidance](docs/tool-guidance.md) documents the shared Learn More sections and collapsed network data disclosures, including direct browser, proxy, localhost and model-download boundaries.


The branding-area **What’s new** link opens the current release. Clicking stores only its version in a global browser preference; later visits show the gift icon with an accessible label and tooltip. A newer release shows the text again. Clearing browser storage resets this preference.

Native SQL, Redis, S3 and document connectors require an explicitly enabled localhost runtime and access key. They are disabled by default. SQLite runs in a browser worker; network clients still require connectivity.

The [desktop edition](docs/desktop.md) bundles the production runtime and local assets. Native access is supplied automatically inside that app. Its installer build, isolation boundary, storage behavior and offline limits are documented separately from the web PWA.

## v1.6 release

Four new tools: Saved Workflows, HAR & Log Redactor, Webhook Signature Debugger, and Trace Context Inspector. UUID generation added v7 with timestamp inspection. That release contained 125 tools across 15 categories.

See the historical [v1.6 validation report](docs/product-upgrade-validation.md) for that release's build results, browser checks and performance measurements. Current 2.0 validation is tracked separately in the [capability ledger](docs/capability-expansion-status.json).

- Saved local workflows run decoding, JSON formatting, JSONPath, redaction, comparison, and hashing; save steps and optional redacted fixtures, pin them, and opt in to draft restoration.
- Task-oriented search shares aliases across the catalog and command palette.
- JSON Schema uses Ajv in a worker with a five-second deadline and explicit dialect/reference errors. OpenAPI diff evaluates selected request/response constraints and marks unsupported semantics for review; it is not a full compatibility proof.
- MCP supports 2026-07-28 stateless metadata/discovery and selectable legacy initialization. A2A supports the 1.0 JSONRPC binding plus labeled 0.3 and older draft modes. Fixtures exercise current and previous formats; these inspectors are not conformance suites.
- Selected current model metadata and prices carry review dates, tier/expiry notes and primary sources. Historical records are unverified. Local token counts cover an encoding or rough heuristic, and optional provider counting sends text and a page-memory key directly to the chosen provider.
- [Debugging guides](/guides) include public JWT, signature, protocol and schema fixtures. Shared source records live in `src/lib/reference-sources.json`; the weekly read-only review workflow uploads a report for human comparison without rewriting datasets or review dates.
- The catalog uses native canonical links and reserves sidebar space before hydration. Marketing no longer waits for entrance animation. Fonts are self-hosted with their licenses, and command/bookmark/shortcut dialogs load on demand.
- PWA caching excludes APIs, authorization-bearing requests and RSC payloads. Open public pages online once before using them offline; uncached tools, network features and optional model downloads need connectivity. Browser storage eviction can remove offline availability. Updates offer an explicit reload action.

### Private self-hosting

```bash
MYDEVTOOLS_SITE_URL=http://localhost:3000 docker compose up --build -d
```

The container uses a nonroot Node 24 standalone runtime, a manifest healthcheck and a loopback port. Set the public canonical URL at build time through `MYDEVTOOLS_SITE_URL` (or `NEXT_PUBLIC_SITE_URL` when building outside Docker). Use your HTTPS reverse proxy for remote access. Managed routes are disabled by default in the provided compose file; enable them only where needed and preserve the existing network policy. No secrets belong in build arguments.

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm start
```

Next.js 16.4 / React 19.3 and current compatible direct dependencies are locked. TypeScript 7's native compiler is paired with the official TypeScript 6 API package for ESLint compatibility. The 2026-10-20 clean-install audit reports 17 upstream advisories (6 high, 11 moderate) across node-forge, Swagger UI, lint tooling and desktop packaging dependencies. No compatible automatic fix is available for all findings; proposed major-version downgrades have not been applied. Certificate RSA checks use Web Crypto, with a regression fixture rejecting the malformed DigestInfo accepted by the affected node-forge verifier. A successful build does not eliminate upstream vulnerabilities.

## v1.5 release

Version 1.5 adds eight local-first tools and strengthens the small set of server-assisted workflows. That release contained 121 tools across 15 categories.

| Area | What’s included | Data boundary |
|---|---|---|
| API contracts | OpenAPI Contract Diff, JSON Schema Workbench, AsyncAPI Explorer, GraphQL Schema & Operation Explorer | Pasted documents are parsed locally. GraphQL validates against the pasted SDL; it does not call an endpoint. |
| Web & identity security | Security Headers & CSP Analyzer, OAuth/OIDC & PKCE Playground, WebAuthn / Passkey Playground | Headers, discovery metadata, and credential fixtures stay in the browser. PKCE values are generated locally. Never paste client secrets or private keys. |
| Platform workflows | Docker Compose Analyzer | Compose YAML is inspected locally; the tool never contacts a Docker daemon. |
| Managed network routes | Proxy, stream proxy, certificate inspection, webhook receiver | Enabled by default with public-address policy checks, DNS pinning, bounded input/output, timeouts, and route-specific disclosure. Set `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true` to disable them. |

The release also sandboxed Mermaid/SVG previews, sanitizes Rich Text Editor content, improved certificate inspection reliability, corrected cross-tool extension payloads, and added regression coverage for network policy and contract tooling.

### Verify locally

```bash
npm test
npm run build
```

`npm run build` runs the catalog parity check first. It verifies every registered tool has its route and SEO entry. The test suite also uses Python 3 (`shlex`) and a POSIX `/bin/sh` as independent oracles for generated command arguments; these are test prerequisites, not production runtime dependencies.

---

## Categories at a Glance

| # | Category | Count | Examples |
|---|----------|------:|----------|
| 1 | Formatters | 8 | JSON, XML, SQL, HTML, JS, CSS, YAML, Mermaid |
| 2 | Validators | 9 | JSON, XML, HTML, XSD, XPath, Regex, Credit Card, Email, JSON Schema |
| 3 | Diff & Compare | 6 | JSON Diff, XML Diff, Text Diff, Image Diff, CSV Diff, OpenAPI Contract Diff |
| 4 | Data Converters | 11 | XML↔JSON, CSV→JSON, CSV→XML, YAML↔JSON, XSLT, JSON→CSV, Mock Data, TOML, TOON |
| 5 | Encoding & Decoding | 7 | Base64, URL, HTML Entities, Unicode, Gzip, String Escape, Hex |
| 6 | Cryptography | 12 | Hash, HMAC, JWT, JWS, JWE, JWK, BCrypt, AES, Webhook Signatures |
| 7 | Certificates & Keys | 8 | X.509 inspector/decoder, SSL checker, CSR, PEM parser, PKCS#12, JKS, SSH keys, WebAuthn |
| 8 | API & Web Services | 13 | Swagger/OpenAPI, REST, GraphQL, AsyncAPI, OAuth/OIDC, JSONPath, URL, WSDL, SOAP |
| 9 | Artificial Intelligence | 6 | MCP Inspector, A2A Inspector, LLM Token Counter, Fine-Tuning Dataset Validator, Agent Card / MCP Manifest Generator, Semantic Search Playground |
| 10 | Network | 11 | IP, Subnet, MAC, Webhook, WebSocket, CORS, DNS, Security Headers, Docker Compose, Trace Context |
| 11 | Generators | 14 | UUID, Password, Credit Card, Lorem Ipsum, QR code, Markdown table, Java POJO, JSON→TypeScript, Slug, Color Contrast |
| 12 | Image & Media | 7 | Image Compressor, Image Resizer, SVG Optimizer, Favicon Generator, Color Palette Extractor, EXIF Viewer |
| 13 | Fun & Games | 7 | Timer, Stopwatch, Coin Toss, Dice Roll, Spin the Wheel, Magic 8-Ball, Typing Speed Test |
| 14 | Text & Utilities | 22 | Case converter, Markdown, Mermaid Viewer, Timestamp, Color picker, Cron parser, Todo list, Sticky Notes, Rich Text Editor, Saved Workflows, HAR/Log Redactor |
| 15 | Reference | 6 | HTTP status codes, MIME types, Port numbers, Model & Pricing comparison, IP ranges, RFC standards |

**New in v1.5:** OpenAPI contract diff · JSON Schema, AsyncAPI and GraphQL contract workbenches · Security Headers/CSP analysis · OAuth/OIDC PKCE and WebAuthn credential inspection · Docker Compose analysis · managed-route hardening and safer untrusted-content previews

---

## Quick Start

```bash
# install (postinstall copies Monaco, SQLite and ONNX Runtime assets locally)
npm install

# dev (http://localhost:3000)
npm run dev

# production build
npm run build

# lint
npm run lint
```

Requires **Node.js 24 or newer** for the complete runtime, including precise JSON handling in native connectors.

The API Request Builder includes a collection runner with response captures/assertions, a proto-based gRPC client and temporary loopback HTTP mocks. Native transports require authenticated localhost connector access. See [API client setup, limits and data handling](docs/api-client.md).

---

## Tech Stack

| Layer | Choice | Why |
|------|--------|-----|
| Framework | **Next.js 16** (App Router, Webpack production build) | Canonical routing and optional managed Route Handlers |
| UI | **React 19.3** + **Ant Design 6** | Stable component library with deep token theming |
| State | **Zustand** with `persist` | Lightweight client state, IndexedDB / localStorage persistence |
| Editor | **Monaco** (self-hosted) | Same engine as VS Code — copied locally to avoid CDN |
| Animation | **Framer Motion** | Smooth page and card transitions |
| Styling | **Tailwind v4** + CSS variables | Theme-aware tokens (`--primary-rgb`, etc.) |
| Crypto | **Web Crypto API** + `crypto-js` + `bcryptjs` | Hashing, AES, JWT/JWS/JWE, key gen, BCrypt |
| Parsing | `fast-xml-parser`, `yaml`, `graphql`, `jsonpath-plus`, `diff` | Pure-JS, no native deps |
| PWA | Native Web Manifest + custom service worker | Installable, offline-capable |

---

## Privacy & Data Handling

This app is built around the principle that **local work stays in your browser by default**. A small set of explicitly labelled network tools uses managed server routes because browsers cannot perform those operations directly.

| Concern | Status | Detail |
|---|---|---|
| Server-side runtime | ✅ Node runtime | Required for canonical routing and managed proxy, certificate, and webhook tools |
| API routes | ✅ Present | Managed routes have SSRF/quota controls and an explicit disable flag; native connectors require a separately authenticated localhost/desktop runtime |
| Analytics packages | ❌ None | No GA, Plausible, Sentry, Hotjar, Mixpanel, Segment, etc. |
| Automatic tool submission | ❌ None | Opening a tool does not automatically send its input or credentials to a configured endpoint; local runtime assets may load |
| Runtime assets | ✅ Bundled | Monaco, SQLite and inference runtimes are local; optional model files and selected network endpoints need explicit actions |
| Next.js build telemetry | ❌ Disabled | `NEXT_TELEMETRY_DISABLED=1` in all npm scripts |
| Cookies | ❌ None | All preferences live in `localStorage` |
| Tracking pixels | ❌ None installed | Markdown previews can load external images after explicit opt-in |

**User-selected network requests** are explicit tool actions. Depending on the selected tool and transport, requests go directly from the browser, through a managed route or through an authenticated desktop/localhost runtime to the configured endpoint. Payloads and credentials follow that transport; managed routes apply their stated public-target policy and limits. See [API client transports and data handling](docs/api-client.md) and each tool's processing disclosure.

**Local storage:**
- Theme & sidebar preference — `localStorage`
- Recently used tools — `localStorage`
- Todo list — IndexedDB
- API Request Builder history — `localStorage` (your device only)

---

## PWA — Installable on All Devices

mydevtools is a Progressive Web App: install it as a real app on iOS, Android, macOS, Windows or Linux.

- **iOS Safari:** Share → Add to Home Screen
- **Android Chrome:** Menu → Install app
- **Desktop Chrome / Edge:** install icon in the address bar
- **Manifest:** `/manifest.webmanifest` with shortcuts to JSON Formatter, JWT Decoder, UUID Generator, Regex Tester
- **Service worker:** caches static assets and HTML for offline use (network-first for HTML, cache-first for hashed assets, stale-while-revalidate fallback)
- **Icons:** 192, 512, maskable-512, apple-touch-180, favicon-16, favicon-32 — generated from a single SVG

---

## Architecture

```
src/
├── app/
│   ├── page.tsx              # Product introduction + searchable categorised tool grid
│   ├── layout.tsx            # Root layout — site-wide metadata + JSON-LD
│   ├── error.tsx             # Global error boundary
│   ├── manifest.ts           # PWA manifest (Next.js metadata route)
│   ├── sitemap.ts            # Auto-generated sitemap.xml
│   ├── robots.ts             # robots.txt
│   ├── globals.css           # Theme variables + landing (`landing-*`) + global overrides
│   ├── workspace.css         # Workspace/catalog/tool-shell tokens & components (below marketing)
│   └── tools/[id]/
│       ├── page.tsx          # Tool implementation (147 registered tools)
│       └── layout.tsx        # Per-tool SEO metadata + JSON-LD schema
├── components/
│   ├── AppShell.tsx          # Layout: sidebar (accordion), header (search + theme)
│   ├── AppFooter.tsx         # Compact footer with social links & tool count
│   ├── ToolPageLayout.tsx    # Tool page wrapper: breadcrumb, header card, learn-more
│   ├── CodeEditor.tsx        # Monaco wrapper with mobile-adaptive height/options
│   ├── NavigationLoader.tsx  # Animated loading overlay (60s safety timeout)
│   └── PwaRegister.tsx       # Service-worker registration (production only)
├── lib/
│   ├── tools-registry.ts     # Single source of truth: tools, categories, colors, icons
│   ├── tool-url-table.ts     # Edge-safe tool-to-category map for canonical routes
│   ├── seo-content.ts        # Hand-crafted SEO metadata (title/desc/keywords) per tool
│   ├── metadata-generator.ts # Builds Next.js Metadata + JSON-LD from registry+seo
│   ├── server-network-policy.ts # Public destination policy and pinned DNS lookup for managed routes
│   ├── store.ts              # Zustand: darkMode, sidebar, recentTools, isNavigating
│   ├── messageService.ts     # Theme-aware antd message bridge
│   ├── todo-db.ts            # IndexedDB helpers for the Todo List tool
│   └── clipboard.ts          # Cross-browser clipboard helper
public/
├── icons/                    # PWA icons (192, 512, maskable-512, apple-touch, favicons)
├── monaco/                   # Monaco editor (auto-copied by postinstall, gitignored)
├── sw.js                     # Service worker
└── .htaccess                 # Hostinger Apache: clean URLs, gzip, security headers
```

### Adding a new tool

1. Add an entry to `src/lib/tools-registry.ts`:
   ```ts
   {
     id: "my-tool",
     name: "My Tool",
     description: "Short pitch shown on dashboard",
     icon: SomeIcon,
     category: "Generators",
     tags: ["...", "..."],
     color: "#1677ff",
   }
   ```
2. Add an SEO entry to `src/lib/seo-content.ts` (title, description, keywords).
3. Create `src/app/tools/my-tool/page.tsx` and wrap your UI in `<ToolPageLayout>`.
4. Create `src/app/tools/my-tool/layout.tsx` (call `generateToolMetadata({ toolId: "my-tool" })`).
5. Run `npm run dev` — sidebar, dashboard and search pick it up automatically.

The tool's category determines its sidebar group, dashboard section, search keywords, and breadcrumb. AI categories automatically get an **ALPHA** tag.

### Adding mobile-friendly two-pane layouts

For typical input/output side-by-side tools, use the `tool-split-pane` class instead of inline grid:

```tsx
<div className="tool-split-pane" style={{ gap: 16 }}>
  <Card title="Input">...</Card>
  <Card title="Output">...</Card>
</div>
```

It auto-collapses to a single column on tablet/mobile (≤991px).

---

## Theming

Themes are driven by:

1. **`<html>.dark` class** — toggled by the theme button, persisted in localStorage
2. **AntD `ConfigProvider`** — supplies token + component overrides (`darkAlgorithm` / `defaultAlgorithm`)
3. **`globals.css`** — brand primitives (`--primary`, `--gradient-brand`, `--elevation-*`) and landing-only classes
4. **`workspace.css`** — workspace palette and helpers: **`--wb-*`** variables and **`wb-cat-*`**, **`wb-shell-*`**, **`wb-tool-*`**, **`wb-cmd-*`**, **`wb-footer`**, **`wb-mem-*`**, **`wb-oops`**. Use **`toolPath`** / **`toolPathFromId`** from **`src/lib/category-routes.ts`** for destinations.
5. **`tool-url-table.ts`** — subset of **`{ toolId → category }`** for the **Edge proxy** (no React / icons). When you add/remove tools or alias routes, extend this alongside **`tools-registry.ts`**.

To tweak **landing**, use **`globals.css`** (`landing-*`). To tweak workspace chrome, edit **`workspace.css`** and **`AppShell`** theme tokens together so contrast stays readable in both light and dark themes.

---

## Deployment

The full product runs as a Next.js Node deployment. This is required for canonical route rewrites and the managed network tools. Production deployments enable managed routes by default; set `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true` to disable them explicitly. `MYDEVTOOLS_ENABLE_MANAGED_ROUTES=true` remains accepted for compatibility.

### Docker (Node runtime)

```bash
MYDEVTOOLS_SITE_URL=http://localhost:3000 docker compose up --build -d
```

Use the checked-in [Dockerfile](Dockerfile) and [Compose configuration](compose.yaml). They build with Node 24 Bookworm, copy the complete standalone runtime and local assets, run as a nonroot user and check manifest health. Compose exposes a loopback port and disables managed routes by default. Set the canonical public origin before building; do not put credentials in build arguments.

---

## SEO

The site serves dedicated tool titles/descriptions, canonical category/tool URLs, social metadata and per-tool SoftwareApplication structured data. Homepage catalog markup uses the registered tool count; FAQ markup is emitted for tool FAQs that are visible in their help section. The generated 1200×630 social preview follows the current version and catalog counts.

Public discovery resources are generated from the same registry, guide fixtures and release notes. Prebuild extracts literal public fields into `public-tool-catalog.json` without executing UI icon imports; the consistency test rejects a stale snapshot. Edit `tools-registry.ts`, then run `npm run generate:public-catalog` when testing before a build. Do not edit the generated JSON by hand.

The public resources are:

| Resource | Content |
| --- | --- |
| `/sitemap.xml` | Homepage, guides, release notes and every registered canonical tool; redirect aliases are excluded |
| `/robots.txt` | Public crawling allowed; API routes excluded from crawling |
| `/llms.txt` | Concise product and processing context, with documentation links |
| `/llms-full.txt` | Combined catalog, guides and current release |
| `/tool-catalog.md` | Every tool URL, description, category and processing boundary |
| `/guides.md`, `/release-notes.md` | Markdown equivalents of guides and the current release |
| `/agents.json` | Custom read-only public catalog; not an A2A card, MCP endpoint or execution API |

These files contain public documentation only, never saved projects, credentials, tool input or runtime access keys. Memory & Storage is marked noindex. Robots directives are crawl guidance, not access controls. Interactive tool execution needs JavaScript; initial HTML includes metadata and tool content for crawlers.

Set `NEXT_PUBLIC_SITE_URL` to the actual public origin **before building**. It controls canonicals, social URLs, sitemap links and discovery links; the existing repository default is `https://mydevtools.com`. Language is a client preference on shared canonical URLs; no translated URL variants or hreflang claims are published. `llms.txt` follows the [open proposal](https://llmstxt.org/); it does not guarantee adoption by every agent or improve rankings by itself. Structured markup follows [Google's content visibility rules](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

Run `npm run test:public-discovery` for catalog/URL coverage. With the production server running, `npm run test:public-discovery:production` checks all canonical tool responses and metadata, actual Markdown/JSON resources, sitemap coverage, noindex settings and PNG bytes/dimensions.

---

## Browser Support

Browser support depends on each tool’s required APIs. Web Crypto requires a secure context, and support for individual algorithms varies; see the [SubtleCrypto compatibility reference](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto). An unsupported algorithm returns an error rather than silently changing algorithms. [PWA installation](https://web.dev/learn/pwa/installation) depends on the browser and operating system; offline page availability also depends on saved caches and storage eviction.

---

## Status & Stability

| Status | Categories |
|-------|-----------|
| Stable | Formatters, Validators, Diff & Compare, Data Converters, Encoding & Decoding, Cryptography, Certificates & Keys, API & Web Services, Network, Generators, Text & Utilities, Reference |
| Alpha | AI Alpha Tools — APIs, defaults, and behaviour may change |

---

## License

[MIT](LICENSE) — fork it, modify it, ship it. Attribution appreciated but not required.

---

## Acknowledgements

Built with [Next.js](https://nextjs.org), [Ant Design](https://ant.design), [Monaco Editor](https://microsoft.github.io/monaco-editor/), [Framer Motion](https://www.framer.com/motion/), and a long list of small focused libraries listed in `package.json`.

Made with 💜 by [Ramesh Maharaddi](https://www.linkedin.com/in/rameshbgm/).


Crypto compatibility checks include `npm run test:jwe-crypto`, `npm run test:jws-jwk`, `npm run test:aes-text` and the portable `npm run test:x509-generation`. Optional `npm run test:ssh-keys:integration` requires an installed `ssh-keygen`; `npm run test:x509-generation:integration` requires OpenSSL and includes larger RSA keys. Both commands create and clean up their own temporary fixture keys. They do not use personal keys.

The AES compatibility tool retains the legacy CryptoJS AES-256-CBC/MD5 derivation format and provides no authentication tag. JWE supports authenticated GCM and CBC-HMAC with exact-sized keys. SSH private-key exports are unencrypted OpenSSH files; add a passphrase locally using `ssh-keygen -p`. Self-signed certificates do not establish public browser trust.

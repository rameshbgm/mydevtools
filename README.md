# mydevtools

A privacy-first developer tools portal — **121 utilities** across **15 categories**, all in one place. Built with Next.js 16, React 19, Ant Design 6, Monaco Editor, and Framer Motion.

> Stop context-switching between dozens of single-purpose websites. Format, diff, decode, generate, validate, parse, calculate — all from one workspace, in your browser.

🌐 **Live:** [mydevtools.com](https://mydevtools.com)
📦 **Source:** [github.com/rameshbgm/mydevtools](https://github.com/rameshbgm/mydevtools)

---

## Highlights

- **121 tools** organised into 15 logical categories
- **Editorial landing page (rebrand 2026)** — tool-themed SVG hero (JSON tree + SHA-256 bars + regex bracket), 3-pillar value section, category grid, spotlight cards and animated marquee. Self-contained `lv-*` styles in `LandingMarketing.tsx` with `lv-light` / `lv-dark` modifier classes.
- **Canonical URLs** — each tool opens at **`/<category-slug>/<tool-id>`** (e.g. `/formatters/json-formatter`). Legacy **`/tools/...`** hit a **308** redirect to that path; **`src/proxy.ts`** (Next.js 16 proxy, formerly middleware) rewrites the pretty URL to the existing **`/tools/*`** file routes.
- **Workshop chrome (rebrand 2026)** — post‑landing catalogue + **`AppShell`** + tool shells use **`src/app/workspace.css`** with **`--wb-*`** tokens and **`wb-*`** classes (slate-cool neutrals + **cyan / indigo** accents matching the landing palette), plus **`wb-tool-route`** from **`tools/layout.tsx`**.
- **Installable PWA** — works as an app on iOS, Android, Mac and Windows
- **Mobile-first responsive** — every tool adapts to phone, tablet and desktop
- **Header search** with autocomplete — jump to any tool in two keystrokes
- **Accordion sidebar** that auto-expands the active tool's category
- **Dark / Light themes** with persistent preference
- **Navigation loader** with friendly messages and 60-second safety timeout
- **Privacy-first**: local tools run in-browser with no analytics or telemetry; managed network tools disclose their data boundary before use
- **Managed network tools** — proxy, certificate inspection, and webhook capture are enabled by default with SSRF controls and quotas; set `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true` to disable them
- **Production build:** Next.js Node deployment for canonical routing and managed tools
- **MIT licensed** — fork it, modify it, ship it

---

## v1.5 release

Version 1.5 adds eight local-first tools and strengthens the small set of server-assisted workflows. The catalog now contains 121 tools across 15 categories.

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

`npm run build` runs the catalog parity check first. It verifies every registered tool has its route and SEO entry.

---

## Categories at a Glance

| # | Category | Count | Examples |
|---|----------|------:|----------|
| 1 | Formatters | 8 | JSON, XML, SQL, HTML, JS, CSS, YAML, Mermaid |
| 2 | Validators | 9 | JSON, XML, HTML, XSD, XPath, Regex, Credit Card, Email, JSON Schema |
| 3 | Diff & Compare | 6 | JSON Diff, XML Diff, Text Diff, Image Diff, CSV Diff, OpenAPI Contract Diff |
| 4 | Data Converters | 10 | XML↔JSON, CSV→JSON, CSV→XML, YAML↔JSON, XSLT, JSON→CSV, Mock Data, TOML, TOON |
| 5 | Encoding & Decoding | 7 | Base64, URL, HTML Entities, Unicode, Gzip, String Escape, Hex |
| 6 | Cryptography | 8 | Hash, HMAC, JWT, JWS, JWE, JWK, BCrypt, AES |
| 7 | Certificates & Keys | 8 | X.509 inspector/decoder, SSL checker, CSR, PEM parser, PKCS#12, JKS, SSH keys, WebAuthn |
| 8 | API & Web Services | 9 | Swagger/OpenAPI, REST, GraphQL, AsyncAPI, OAuth/OIDC, JSONPath, URL, WSDL, SOAP |
| 9 | Artificial Intelligence | 6 | MCP Inspector, A2A Inspector, LLM Token Counter, Fine-Tuning Dataset Validator, Agent Card / MCP Manifest Generator, Semantic Search Playground |
| 10 | Network | 9 | IP, Subnet, MAC, Webhook, WebSocket, CORS, DNS, Security Headers, Docker Compose |
| 11 | Generators | 10 | UUID, Password, Credit Card, Lorem Ipsum, QR code, Markdown table, Java POJO, JSON→TypeScript, Slug, Color Contrast |
| 12 | Image & Media | 6 | Image Compressor, Image Resizer, SVG Optimizer, Favicon Generator, Color Palette Extractor, EXIF Viewer |
| 13 | Fun & Games | 7 | Timer, Stopwatch, Coin Toss, Dice Roll, Spin the Wheel, Magic 8-Ball, Typing Speed Test |
| 14 | Text & Utilities | 12 | Case converter, Markdown, Mermaid Viewer, Timestamp, Color picker, Cron parser, Todo list, Sticky Notes, Rich Text Editor |
| 15 | Reference | 6 | HTTP status codes, MIME types, Port numbers, Model & Pricing comparison, IP ranges, RFC standards |

**New in v1.5:** OpenAPI contract diff · JSON Schema, AsyncAPI and GraphQL contract workbenches · Security Headers/CSP analysis · OAuth/OIDC PKCE and WebAuthn credential inspection · Docker Compose analysis · managed-route hardening and safer untrusted-content previews

---

## Quick Start

```bash
# install (postinstall copies Monaco editor into public/monaco)
npm install

# dev (http://localhost:3000)
npm run dev

# production build
npm run build

# lint
npm run lint
```

Requires **Node.js ≥ 20**.

---

## Tech Stack

| Layer | Choice | Why |
|------|--------|-----|
| Framework | **Next.js 16** (App Router, Turbopack) | App Router with canonical routing and optional managed Route Handlers |
| UI | **React 19.2** + **Ant Design 6** | Stable component library with deep token theming |
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
| API routes | ✅ Present | Enabled by default with SSRF and quota controls; set `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true` to disable them explicitly |
| Analytics packages | ❌ None | No GA, Plausible, Sentry, Hotjar, Mixpanel, Segment, etc. |
| Auto-fetch on mount | ❌ None | No tool calls anything when you open it |
| Third-party CDNs at runtime | ❌ None | Monaco self-hosted; Swagger UI bundled via `swagger-ui-react` |
| Next.js build telemetry | ❌ Disabled | `NEXT_TELEMETRY_DISABLED=1` in all npm scripts |
| Cookies | ❌ None | All preferences live in `localStorage` |
| Tracking pixels | ❌ None | No third-party `<img>` or `<script>` tags anywhere |

**User-typed URL fetches** (in API Request Builder, SOAP Client, WSDL Parser) are explicit user actions — pressing "Send" sends YOUR request from YOUR browser to the URL YOU typed. That's the tool's purpose, not tracking. No metadata is collected about it.

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
│   ├── page.tsx              # Dashboard (categorised tool grid + recents)
│   ├── layout.tsx            # Root layout — site-wide metadata + JSON-LD
│   ├── error.tsx             # Global error boundary
│   ├── manifest.ts           # PWA manifest (Next.js metadata route)
│   ├── sitemap.ts            # Auto-generated sitemap.xml
│   ├── robots.ts             # robots.txt
│   ├── globals.css           # Theme variables + landing (`landing-*`) + global overrides
│   ├── workspace.css         # Workspace/catalog/tool-shell tokens & components (below marketing)
│   └── tools/[id]/
│       ├── page.tsx          # Tool implementation (121 registered tools)
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

To tweak **landing**, use **`globals.css`** (`landing-*`). To tweak workspace chrome, edit **`workspace.css`** and **`AppShell`** theme tokens together so contrast stays strong in **light stone** and **dark espresso** shells.

---

## Deployment

The full product runs as a Next.js Node deployment. This is required for canonical route rewrites and the managed network tools. Production deployments enable managed routes by default; set `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true` to disable them explicitly. `MYDEVTOOLS_ENABLE_MANAGED_ROUTES=true` remains accepted for compatibility.

### Docker (Node runtime)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## SEO

Every tool ships with hand-crafted SEO content:

- **Unique titles** (50–65 chars, keyword-rich)
- **Unique meta descriptions** (145–160 chars)
- **Long-tail keyword arrays** targeting search intent
- **Open Graph + Twitter Card** tags
- **JSON-LD `SoftwareApplication`** structured data per tool
- Site-wide `WebSite`, `Organization`, `CollectionPage` JSON-LD
- Auto-generated `sitemap.xml` and `robots.txt`

---

## Browser Support

Modern evergreen browsers. The crypto tooling uses Web Crypto API (Chromium ≥ 60, Firefox ≥ 57, Safari ≥ 11). PWA install works on iOS Safari ≥ 16.4, Android Chrome, and all desktop Chromium-based browsers.

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

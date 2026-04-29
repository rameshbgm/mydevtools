# DevTools Hub

A private, offline-first developer tools portal — **79 utilities** across **13 categories**, all in one place. Built with Next.js 16, React 19, Ant Design 6, Monaco Editor, and Framer Motion.

> Stop context-switching between dozens of single-purpose websites. Format, diff, decode, generate, validate, parse, calculate — all from one workspace.

---

## Highlights

- **79 tools** organised into 13 logical categories
- **Header search** with autocomplete — jump to any tool in two keystrokes
- **Accordion sidebar** that auto-expands the active tool's category
- **Dark / Light themes** with persistent preference
- **Keyboard-first**, responsive, mobile-friendly
- **Fully client-side** — no server roundtrips, no telemetry, no data leaves your browser
- **Static export** — deploy to any CDN (Vercel, Netlify, Cloudflare Pages, S3, GitHub Pages)
- Production build: **83 static routes pre-rendered**

---

## Categories at a Glance

| # | Category | Count | Examples |
|---|----------|------:|----------|
| 1 | Formatters | 6 | JSON, XML, SQL, HTML, JS, CSS |
| 2 | Validators | 7 | JSON, XML, HTML, XSD, XPath, Regex, Credit Card |
| 3 | Diff & Compare | 3 | JSON Diff, XML Diff, Text Diff |
| 4 | Data Converters | 6 | XML↔JSON, CSV→JSON, CSV→XML, YAML↔JSON, XSLT |
| 5 | Encoding & Decoding | 6 | Base64, URL, HTML Entities, Unicode, Gzip, String Escape |
| 6 | Cryptography | 6 | Hash, HMAC, JWT, JWS, JWE, JWK |
| 7 | Certificates & Keys | 12 | X.509 decoder/generator/CSR/converter, PEM, PKCS#12, JKS, SSH keys, SSL checker, fingerprints |
| 8 | API & Web Services | 6 | Swagger/OpenAPI viewer, REST request builder, JSONPath, URL parser, WSDL, SOAP client |
| 9 | Network | 3 | IP tools, Subnet calculator, MAC address tools |
| 10 | Generators | 7 | UUID, Password, Lorem Ipsum, QR code, Markdown table, Java POJO, JSON→TypeScript |
| 11 | Text & Utilities | 9 | Text manipulation, Markdown preview, Case converter, Timestamp, Color, Number base, Unix permissions, Cron parser, Todo list |
| 12 | **AI Alpha Tools** | 3 | RAG Doc Q&A, Text Summarizer, Code Explainer (early access — may change) |
| 13 | Reference | 5 | HTTP status codes, MIME types, Port numbers, IP ranges, RFC standards |

---

## Quick Start

```bash
# install
npm install

# dev (http://localhost:3000)
npm run dev

# production build
npm run build

# run production build locally
npm start

# lint
npm run lint
```

Requires **Node.js ≥ 20**.

---

## Tech Stack

| Layer | Choice | Why |
|------|--------|-----|
| Framework | **Next.js 16** (App Router, Turbopack) | Latest static-export friendly framework |
| UI | **React 19.2** + **Ant Design 6** | Stable component library with deep token theming |
| State | **Zustand** with `persist` | Lightweight client state, IndexedDB / localStorage persistence |
| Editor | **Monaco** | Same engine as VS Code |
| Animation | **Framer Motion** | Smooth page and card transitions |
| Styling | **Tailwind v4** + CSS variables | Theme-aware tokens (`--primary-rgb`, etc.) |
| Crypto | **Web Crypto API** + `crypto-js` | Hashing, JWT/JWS/JWE, key generation |
| Parsing | `fast-xml-parser`, `yaml`, `jsonpath-plus`, `diff` | Pure-JS, no native deps |

---

## Architecture

```
src/
├── app/
│   ├── page.tsx              # Dashboard (categorised tool grid + recents)
│   ├── layout.tsx            # Root layout — wraps everything in AppShell
│   ├── globals.css           # Theme variables, scrollbar, search dropdown overrides
│   └── tools/[id]/page.tsx   # One folder per tool (79 of them)
├── components/
│   ├── AppShell.tsx          # Layout: sidebar (accordion), header (search + theme)
│   └── ToolPageLayout.tsx    # Shared tool page wrapper: breadcrumb, header card, "Learn More" collapse
└── lib/
    ├── tools-registry.ts     # Single source of truth for tools, categories, colours, icons
    ├── store.ts              # Zustand: darkMode, sidebarCollapsed, recentTools
    ├── messageService.ts     # Theme-aware antd message bridge (replaces deprecated static `message.*`)
    └── clipboard.ts          # Cross-browser clipboard helper
```

### Adding a new tool

1. Add an entry to `src/lib/tools-registry.ts`:
   ```ts
   {
     id: "my-tool",
     name: "My Tool",
     description: "...",
     icon: SomeIcon,
     category: "Generators",
     tags: ["...", "..."],
     color: "#1677ff",
   }
   ```
2. Create `src/app/tools/my-tool/page.tsx` and wrap your UI in `<ToolPageLayout>`.
3. Run `npm run dev` — the sidebar and dashboard pick it up automatically.

The tool's category determines its sidebar group, dashboard section, search keywords, and breadcrumb. AI categories automatically get an **ALPHA** tag.

---

## Theming

Themes are driven by:

1. **`<html>.dark` class** — toggled by the theme button, persisted in localStorage
2. **AntD `ConfigProvider`** — supplies token + component overrides (`darkAlgorithm` / `defaultAlgorithm`)
3. **CSS custom properties** in `globals.css` — `--primary`, `--primary-rgb`, `--gradient-brand`, `--elevation-*`, `--scrollbar-thumb`, `--selection-bg`

To tweak colours, edit `:root { ... }` and `.dark { ... }` in `src/app/globals.css`. Component-specific overrides live in `darkTheme` / `lightTheme` objects in `AppShell.tsx`.

---

## Privacy & Data Handling

- Every tool runs **entirely in your browser**. There is no backend.
- The Todo List uses **IndexedDB** (your machine only).
- AI Alpha tools require an API key (entered locally, kept in browser storage; never sent to anything except the upstream LLM provider you chose).
- Recently used tools and theme preference live in **localStorage**.
- No analytics, no cookies, no tracking pixels.

---

## Deployment

This app builds to a fully static bundle. You can deploy it anywhere that serves files.

### Vercel (one-click)

```bash
npx vercel --prod
```

### Netlify

```bash
npx netlify deploy --prod --dir=.next
```

### Cloudflare Pages / S3 / GitHub Pages

Set `output: "export"` in `next.config.ts` if you want a fully-static `out/` directory:

```ts
const nextConfig = { output: "export" };
export default nextConfig;
```

Then `npm run build` and upload `out/`.

### Docker

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Browser Support

Modern evergreen browsers. The crypto tooling uses Web Crypto API (Chromium ≥ 60, Firefox ≥ 57, Safari ≥ 11).

---

## Status & Stability

| Status | Categories |
|-------|-----------|
| Stable | Formatters, Validators, Diff & Compare, Data Converters, Encoding & Decoding, Cryptography, Certificates & Keys, API & Web Services, Network, Generators, Text & Utilities, Reference |
| Alpha | AI Alpha Tools — APIs, defaults, and behaviour may change |

---

## License

Private project. Ship it where you want, modify it freely.

---

## Acknowledgements

Built with [Next.js](https://nextjs.org), [Ant Design](https://ant.design), [Monaco Editor](https://microsoft.github.io/monaco-editor/), [Framer Motion](https://www.framer.com/motion/), and a long list of small focused libraries listed in `package.json`.

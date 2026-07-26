# Agent notes for **mydevtools**

`AGENTS.md` has the canonical Next.js “read `node_modules/next/dist/docs/`” rule — start there for framework quirks.

## Product layout vs styling zones

| Zone | Responsibility |
|------|----------------|
| **Landing marketing** | `LandingMarketing.tsx` ships its own scoped `<style jsx global>` block with `lv-*` classes and self-contained SVGs. Theme switches via `lv-light` / `lv-dark` modifier classes — no JS color branching. Do **not** change unless the task explicitly asks for landing changes. |
| **Workspace chrome** | **`AppShell.tsx`**, **`workspace.css`** — tokens **`--wb-*`**, helpers **`wb-cat-*`**, **`wb-shell-*`**, **`wb-tool-*`**, **`wb-cmd-*`**, **`wb-footer`**, **`wb-mem-*`**, **`wb-oops`** (loaded after **`globals.css`**). |
| **Tool routes** | Files live under **`src/app/tools/[id]`**; **`src/proxy.ts`** (**Next.js proxy**, formerly middleware) **`rewrites`** public **`/[categorySlug]/[toolId]`** → **`/tools/[toolId]`** and **`308` redirects** **`/tools/...`** → the canonical prettier URL. |
| **Tool chrome** | Shared **`ToolPageLayout.tsx`** + optional **`tools/layout.tsx`** (**`wb-tool-route`** frame). Inner tool logic stays in each **`page.tsx`**. |

## URL scheme

| Item | Detail |
|------|--------|
| **Canonical URL** | `/<categorySlug>/<toolId>` (e.g. `/formatters/json-formatter`). Slug logic: **`category-routes.categoryToSlug`**. |
| **Helpers** | **`toolPath`**, **`toolPathFromId`**, **`getToolIdFromPublicPath`** in **`src/lib/category-routes.ts`**. |
| **Middleware data** | Edge-safe **`src/lib/tool-url-table.ts`** (**`TOOL_ID_TO_CATEGORY`**). When adding a tool, extend the registry **and** this table (+ alias stubs like **`ssl-checker`** if applicable). |

## Design tokens (concise)

- **Theme toggle**: **`dark`** class on `<html>`; pair **`workspace.css`** with **`ConfigProvider`** in **`AppShell`**.
- **Brand palette (rebrand 2026)**: cyan **`#0891b2`** + indigo **`#6366f1`** (light), cyan **`#22d3ee`** + indigo **`#818cf8`** (dark). Both landing (`lv-*`) and chrome (`wb-*`) tokens share this palette.
- Prefer **`var(--wb-*)`** over ad-hoc colours; keep WCAG‑friendly contrast in both themes.

Behaviour (routing, registry, persistence) stays in **`lib/`** and **`store.ts`** — passes should not remove features.

## SSR / hydration patterns

Next.js runs components on the server first. Three patterns are established in this codebase — follow them when adding tools:

| Problem | Pattern |
|---------|---------|
| `localStorage` in `useState` initialiser | `useState(DEFAULT_VALUE)` + patch in `useEffect` after mount |
| antd `InputNumber` / `Input` / `Select` generating internal `<input>` elements that browser extensions (e.g. Shark `data-sharkid`) mutate client-side | Wrap the component tree with `{mounted && (...)}` — no SSR output means no hydration comparison |
| SVG `Math.sin`/`Math.cos` coordinates serialise to different decimal precision in Node.js vs browser V8 | Round to 4 decimal places: `const r4 = (n: number) => Math.round(n * 1e4) / 1e4` |

The `mounted` guard pattern:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
// ...
{mounted && <Select ... />}
```

## Tool counts (v1.4, branch `v1.4`)

**113 tools across 15 categories.** Generators: 10 — includes credit-card-generator, whose brand table and Luhn helpers live in shared `src/lib/credit-card.ts` (imported by credit-card-validator too, so don't reintroduce a local copy). Fun & Games: 7 (coin-toss, dice-roll, timer, stopwatch, spin-wheel, magic-8ball, typing-test). Artificial Intelligence: 6 — mcp-inspector, a2a-inspector, plus follow-up additions token-counter, jsonl-validator, agent-manifest-generator, and rag-search (rebuilt with real embeddings via `@huggingface/transformers`, not the earlier keyword-matching demo). Reference: 6, including model-pricing-reference. Text & Utilities: 12 (includes sticky-notes, rich-text-editor). Image & Media: added in v1.4 (image-compressor, svg-optimizer, favicon-generator, color-palette-extractor, exif-viewer).

`APP_VERSION` in `src/lib/release-notes.ts` is `"1.4"`. The former separate v1.5 changelog entry (pipelines, shareable URLs, PWA, extension, AI category) was **merged into the single v1.4 entry** — there is no v1.5 release. Everything on this branch ships as v1.4.

When adding a tool: extend **`tools-registry.ts`** → **`tool-url-table.ts`** → **`seo-content.ts`** → create **`src/app/tools/[id]/page.tsx`** + **`layout.tsx`**. **`scripts/check-parity.js`** runs on `prebuild` and fails the build if any of these four fall out of sync, or if a tool page advertises itself in `BRIDGE_TARGETS` without actually reading the bridge.

## AI tools — key-free by design

Every tool in the **Artificial Intelligence** category must work with **no API key, no signup, no server round-trip, and no persisted state** — this is a deliberate product constraint, not an oversight. A BYOK prompt playground was evaluated and rejected for exactly this reason (a key in `localStorage`, or transiting the server via `/api/proxy-stream`, both violate it). If a future AI tool idea needs a key, it likely belongs to a different part of the product, not this category.

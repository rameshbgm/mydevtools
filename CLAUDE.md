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

## Tool counts (v1.3)

**90 tools across 14 categories.** Fun & Games: 7 (coin-toss, dice-roll, timer, stopwatch, spin-wheel, magic-8ball, typing-test). Artificial Intelligence: 2 (mcp-inspector, a2a-inspector). Text & Utilities: 11 (includes sticky-notes, rich-text-editor).

When adding a tool: extend **`tools-registry.ts`** → **`tool-url-table.ts`** → **`seo-content.ts`** → create **`src/app/tools/[id]/page.tsx`** + **`layout.tsx`**.

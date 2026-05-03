# Agent notes for **mydevtools**

`AGENTS.md` has the canonical Next.js “read `node_modules/next/dist/docs/`” rule — start there for framework quirks.

## Product layout vs styling zones

| Zone | Responsibility |
|------|----------------|
| **Landing marketing** | `LandingMarketing.tsx` + `globals.css` classes (`landing-*`). Do **not** change unless the task explicitly asks for landing changes. |
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

- **Theme toggle**: **`dark`** class on `<html>`; pair **`workspace.css`** with **`ConfigProvider`** in **`AppShell`** (accent ≈ emerald).
- Prefer **`var(--wb-*)`** over ad-hoc colours; keep WCAG‑friendly contrast in both themes.

Behaviour (routing, registry, persistence) stays in **`lib/`** and **`store.ts`** — passes should not remove features.

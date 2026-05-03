# Agent notes for **mydevtools**

`AGENTS.md` has the canonical Next.js “read `node_modules/next/dist/docs/`” rule — start there for framework quirks.

## Product layout vs styling zones

| Zone | Responsibility |
|------|----------------|
| **Landing marketing** | `LandingMarketing.tsx` + `globals.css` classes (`landing-*`). Do **not** change this block when doing workspace/tool UI work unless the task explicitly asks for landing changes. |
| **Workspace chrome** | **`AppShell.tsx`** (sidebar, header, ⌘K palette, drawers), **`workspace.css`** (all `--app-*` tokens + `app-catalog-*`, `app-shell-*`, `app-tool-*`, `app-cmd-*`, `app-workspace-footer`, memory/404 wrappers). Loaded from **`layout.tsx`** after **`globals.css`**. |
| **Per-tool UI** | Each `src/app/tools/<id>/page.tsx` — behaviour and Ant components stay as-is unless requested; wrapping chrome comes from **`ToolPageLayout.tsx`**. |

## Workspace design system (concise)

- **Theme toggle**: `<html>` gets class **`dark`** in `AppShell`; **`workspace.css`** `:root` vs **`.dark`** define paired token values. Prefer **`var(--app-*)`** in new workspace styles instead of hard-coded hex grays.
- **Catalog (`/` below the fold)** — **`app-catalog-workspace`**, intro/search, **`app-catalog-category-head`** with per-category **`--cat-accent`**, tool grid cards **`app-catalog-tool-card`** + **`--tool-accent`**.
- **Shell** — **`app-shell-layout`**, **`app-shell-sider`**, **`app-shell-header`**, sidebar brand **`app-shell-brand-mark`**.
- **Command palette** — **`app-cmd-overlay`**, **`app-cmd-panel`**, **`app-cmd-row`** ( **`data-active`** for selection).
- **Tool pages** — **`app-tool-shell`**, breadcrumb **`app-tool-breadcrumb`**, hero **`app-tool-hero`** with decorative **`ToolHeroAccentSvg`**; learn-more label colours use **`--app-learn-*`** tokens.

Behaviour (routing, registry, persistence) stays in **`lib/`** and **`store.ts`** — UI passes should not remove features.

When editing themes: keep **contrast readable** in both light and dark; pair **`workspace.css`** tokens with Ant **`ConfigProvider`** component tokens rather than one-off colours.

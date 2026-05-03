# Agent notes for **mydevtools**

`AGENTS.md` has the canonical Next.js “read `node_modules/next/dist/docs/`” rule — start there for framework quirks.

## Product layout vs styling zones

| Zone | Responsibility |
|------|----------------|
| **Landing marketing** | `LandingMarketing.tsx` + `globals.css` classes (`landing-*`). Do not rework this block when doing “workspace” UI passes unless the task explicitly asks for landing changes. |
| **Workspace chrome** | `AppShell.tsx` (sidebar, header, content padding), **`workspace.css`** (CSS variables `--app-*` for shell, catalog band, dashboard cards, tool hero). Imported from `layout.tsx` after `globals.css`. |

Behavior (routing, registry, persistence) stays in **`lib/`** and **`store.ts`** — visual refactors should not remove features.

When editing themes: keep **contrast readable** in both light and dark; prefer `--app-*` and Ant `ConfigProvider` tokens together rather than one-off `#grays`.

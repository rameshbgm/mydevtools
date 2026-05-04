<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Styling split

- **Landing hero / marketing**: `LandingMarketing.tsx` plus `landing-*` rules in `src/app/globals.css`.
- **App workspace** (everything after marketing on `/`, sidebar/header, tool wrappers): **`src/app/workspace.css`** — theme tokens **`--wb-shell-bg`**, **`--wb-cat-*`**, **`--wb-card-*`**, etc., plus helpers like **`.wb-cat-workspace`**, **`.wb-cat-tool-card`**, **`.wb-tool-hero`**.

Do not regress **light/dark readability** when changing colours; preserve existing behaviour unless the task says otherwise.

## Routing

Canonical tool URLs look like **`/[categorySlug]/[toolId]`** (proxy in **`src/proxy.ts`** rewrites internally to **`/tools/[toolId]`**). Prefer **`toolPath`** / **`toolPathFromId`** from **`src/lib/category-routes.ts`** for links.
<!-- END:nextjs-agent-rules -->

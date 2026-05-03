<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Styling split

- **Landing hero / marketing**: `LandingMarketing.tsx` plus `landing-*` rules in `src/app/globals.css`.
- **App workspace** (everything after marketing on `/`, sidebar/header, tool wrappers): **`src/app/workspace.css`** — theme tokens `--app-shell-bg`, `--app-catalog-*`, `--app-card-*`, etc., plus helpers like `.app-catalog-workspace`, `.app-catalog-tool-card`, `.app-tool-hero`.

Do not regress **light/dark readability** when changing colours; preserve existing behaviour unless the task says otherwise.
<!-- END:nextjs-agent-rules -->

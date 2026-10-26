---
name: My Dev Tools 2.1 Decision Prototype
description: Three unselected interactive workspace directions, isolated from production.
colors:
  orbit-light-bg: "#eeebf8"
  orbit-light-panel: "#fff"
  orbit-light-panel-alt: "#f7f5fc"
  orbit-light-ink: "#292139"
  orbit-light-muted: "#6c6379"
  orbit-light-line: "#dcd5e9"
  orbit-light-accent: "#7044c2"
  orbit-light-accent-ink: "#fff"
  orbit-light-soft: "#ece4fb"
  orbit-light-accent-text: "#653bb2"
  orbit-light-success: "#226b50"
  orbit-light-error: "#aa253f"
  orbit-light-code-string: "#397546"
  orbit-light-code-number: "#a04b1a"
  orbit-light-code-key: "#6c40b0"
  orbit-dark-bg: "#15121f"
  orbit-dark-panel: "#211b2d"
  orbit-dark-panel-alt: "#1b1725"
  orbit-dark-ink: "#f0ebfa"
  orbit-dark-muted: "#b7acc8"
  orbit-dark-line: "#3d334e"
  orbit-dark-accent: "#c6adfa"
  orbit-dark-accent-ink: "#25163f"
  orbit-dark-soft: "#372749"
  orbit-dark-accent-text: "#cdb2ff"
  orbit-dark-success: "#88d8b5"
  orbit-dark-error: "#ff98af"
  orbit-dark-code-string: "#a8d6b5"
  orbit-dark-code-number: "#f5ba8f"
  orbit-dark-code-key: "#ccb6fa"
  studio-light-bg: "#f4eae4"
  studio-light-panel: "#fffaf6"
  studio-light-panel-alt: "#f8f0eb"
  studio-light-ink: "#422d3c"
  studio-light-muted: "#79616b"
  studio-light-line: "#e2cfcf"
  studio-light-accent: "#743d60"
  studio-light-accent-ink: "#fff7fb"
  studio-light-soft: "#f1d9e5"
  studio-light-accent-text: "#743d60"
  studio-light-code-key: "#85386b"
  studio-dark-bg: "#251d24"
  studio-dark-panel: "#30242e"
  studio-dark-panel-alt: "#2a2029"
  studio-dark-ink: "#f8eae8"
  studio-dark-muted: "#d2b4bf"
  studio-dark-line: "#59404e"
  studio-dark-accent: "#e6adbf"
  studio-dark-accent-ink: "#35202c"
  studio-dark-soft: "#4c3042"
  studio-dark-accent-text: "#efb4cd"
  studio-dark-code-key: "#e5b2d0"
  signal-light-bg: "#e5ebf2"
  signal-light-panel: "#fff"
  signal-light-panel-alt: "#f0f4f8"
  signal-light-ink: "#17283d"
  signal-light-muted: "#53677d"
  signal-light-line: "#c9d5e2"
  signal-light-accent: "#2458d3"
  signal-light-accent-ink: "#fff"
  signal-light-soft: "#e2eaff"
  signal-light-accent-text: "#2451b8"
  signal-light-code-key: "#2e5bb7"
  signal-dark-bg: "#101a26"
  signal-dark-panel: "#172535"
  signal-dark-panel-alt: "#142130"
  signal-dark-ink: "#e8f0fc"
  signal-dark-muted: "#a8bad0"
  signal-dark-line: "#33465e"
  signal-dark-accent: "#9bbaff"
  signal-dark-accent-ink: "#112956"
  signal-dark-soft: "#223e65"
  signal-dark-accent-text: "#a6c3ff"
  signal-dark-code-key: "#a8c6ff"
typography:
  display:
    fontFamily: "Lab Display, sans-serif"
    fontSize: "35px"
    fontWeight: 550
    lineHeight: 1.22
    letterSpacing: "-.035em"
  body:
    fontFamily: "Lab Sans, sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
  code:
    fontFamily: "Lab Mono, monospace"
    fontSize: "12px"
    lineHeight: 1.85
  tool-title:
    fontFamily: "Lab Sans, sans-serif"
    fontSize: "19px"
    fontWeight: 640
    letterSpacing: "-.025em"
rounded:
  workspace: "14px"
  signal-workspace: "7px"
  button: "7px"
  signal-button: "5px"
  input: "6px"
  dock: "12px"
spacing:
  tool-heading: "23px 24px 20px"
  tool-toolbar: "13px 24px"
  tool-actions: "16px 24px"
  primary-button: "10px 16px"
components:
  button-primary-orbit-light:
    backgroundColor: "{colors.orbit-light-accent}"
    textColor: "{colors.orbit-light-accent-ink}"
    rounded: "{rounded.button}"
    padding: "{spacing.primary-button}"
  button-primary-orbit-dark:
    backgroundColor: "{colors.orbit-dark-accent}"
    textColor: "{colors.orbit-dark-accent-ink}"
    rounded: "{rounded.button}"
    padding: "{spacing.primary-button}"
  workspace-orbit-light:
    backgroundColor: "{colors.orbit-light-panel}"
    rounded: "{rounded.workspace}"
  workspace-orbit-dark:
    backgroundColor: "{colors.orbit-dark-panel}"
    rounded: "{rounded.workspace}"
---

# Design System: My Dev Tools 2.1 Decision Prototype

## Overview

This document describes only `public/v2.1-preview/`. Orbit, Studio and Signal are three unselected proposals for a future 2.1 interface. They are a decision prototype, not a released version or a production design commitment. Their names and descriptions come from the built preview; no single creative direction has been chosen.

- **Orbit:** spatial navigation, violet accents and a connected workbench, with a sidebar and clickable tool constellation.
- **Studio:** an open canvas in apricot and plum, with top branding, offset input/output tiles and a floating tool dock.
- **Signal:** a compact cobalt console, direct sidebar navigation, tighter panels and a persistent desktop inspector.

The shared product commitment from `PRODUCT.md` is useful developer tooling with explicit local-processing and network boundaries. This English-only prototype does not demonstrate the production application's full tool catalog, persistence, localization, routing, desktop edition or connector capabilities.

The implementation sources are [`index.html`](./index.html), [`preview.css`](./preview.css) and [`preview.js`](./preview.js). CSS is the source of truth; frontmatter records its declared theme overrides rather than inventing a merged production palette. Existing root design documents and sidecars remain outside this scope.

Run the standalone preview from the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory public
```

Open `http://127.0.0.1:4173/v2.1-preview/index.html`. Query parameters accept `concept=orbit|studio|signal`, `theme=light|dark`, and `tool=json|api|color`; controls update these using `history.replaceState`. Orbit and Signal default to dark, Studio to light when no valid theme parameter is supplied. Switching concepts preserves the currently selected theme and tool. Next.js also serves these files through its public-directory convention.

## Colors

Theme tokens live on `:root`, with `data-concept` and `data-theme` overrides. The frontmatter prefixes each declaration with its concept and theme. Orbit light is the base; dark overrides apply next, then concept overrides, then concept-dark overrides. Studio and Signal inherit success, error, string and number colors from the corresponding base theme. An omitted variant token means inheritance, not absence.

| Source token | Use |
| --- | --- |
| `--bg` | Surrounding page canvas |
| `--panel` / `--panel-alt` | Main work surface / secondary panels and editor output |
| `--ink` / `--muted` | Primary / supporting text |
| `--line` | Dividers, input outlines and panel boundaries |
| `--accent` / `--accent-ink` | Primary actions and their foreground |
| `--soft` / `--accent-text` | Selected surfaces and readable accent text |
| `--success` / `--error` | Pass/fail and validation feedback |
| `--code-key` / `--code-string` / `--code-number` | Syntax roles; constants use accent text |

Orbit pairs lavender surfaces with violet actions; dark mode uses a pale lavender action on deep violet surfaces. Studio pairs warm paper with plum, shifting to rose actions over dark plum. Signal uses cool white/slate panels and cobalt, shifting to pale blue actions on navy. All three change foregrounds as well as backgrounds between themes.

Studio's decorative apricot tile (`#ebc0ac`, text `#5b352b`) and plum tile (`#743d60`, text `#fff0f7`) remain fixed in both themes. Comparison thumbnails also use fixed per-concept illustrative palettes; they summarize the directions rather than mirroring the active theme. The color-contrast sample intentionally accepts arbitrary user colors, so its preview can display inaccessible pairs while the surrounding tool reports the failure.

## Typography

Three local variable fonts are loaded with `font-display: swap`: Geist as **Lab Sans** (100–900), Geist Mono as **Lab Mono** (100–900), and Sora as **Lab Display** (100–800). Font files and their license text live in [`fonts/`](./fonts/). Generic fallbacks are sans-serif and monospace.

The default hero uses Lab Display at 35px/1.22, weight 550 and negative tracking. Studio expands this to 46px/1.1, weight 480; Signal compresses it to 28px. The base body is 14px/1.5. Tool headings are 19px/640 by default, 22px in Studio and 18px in Signal. Code uses 12px/1.85, with Signal and several compact layouts at 11px. Supporting labels generally use 9–12px; this is a deliberately dense prototype and is not a promise of production accessibility conformance. Numeric metadata uses tabular figures. Display text balances line wrapping.

## Layout

The shared shell is capped at 1800px. A sticky review bar sits above the proposal, with concept choice, comparison and theme controls. Each proposal includes a hero, functional tool surface and derived inspector. Editors normally split into equal columns.

| Direction | Desktop structure |
| --- | --- |
| Orbit | 216px sidebar; main padding 32px; tool plus 222px inspector with 20px gap |
| Studio | 6.3% horizontal inset; 80px top header; centered floating dock; tool plus 230px inspector with 28px gap |
| Signal | 188px sidebar; 20px outer padding and 24px shell gap; tool plus 220px inspector with 16px gap |

The CSS defines four viewport thresholds:

- **1600px and above:** wider Orbit padding, larger hero artwork and headings, and larger shared editor area. Concept-specific rules continue to override shared rules where more specific.
- **1190px and below:** sidebars narrow. Orbit and Studio hide the inspector and use one workspace column. Signal keeps a 180px inspector but stacks its editor panes to preserve room.
- **850px and below:** sidebars narrow again, artwork and type scale down, Signal hides its inspector and returns to two editor columns, and the review footer stacks.
- **620px and below:** the review bar wraps, sidebar navigation becomes a horizontal tool row, all editors stack vertically, API submission becomes full-width, and comparison cards become one column. Studio places its artwork below the heading; Signal stacks its hero and structure diagram. Insets settle around 14–16px. Inspector content is hidden.

The minimum viewport width is 320px. Code panes scroll internally and textarea inputs resize vertically. Base JSON editor height is 250px, Studio 245px and Signal 340px, with smaller viewport overrides. API editors use their own heights. Spacing is component-specific rather than a formal universal scale.

## Elevation & Depth

Orbit and Studio lift tool surfaces through soft shadows; Signal uses borders and tonal changes with `--shadow: none`. Shared review controls retain their own subtle shadow even in Signal.

| Shadow | Source value |
| --- | --- |
| Orbit light workspace | `0 16px 48px -20px #36245735` |
| Orbit dark workspace | `0 18px 60px -24px #0008` |
| Studio light workspace | `0 18px 54px -24px #6e344d45` |
| Studio dark workspace | `0 18px 54px -24px #0008` |
| Studio dock | `0 6px 20px -12px #51203555` |
| Orbit tool node | `0 5px 18px -8px #0004` |

Primary buttons lift 1px on hover; Orbit nodes lift 4px and comparison cards lift 3px. Basic state transitions last 160–200ms. Studio's star rotates into position over 1.5 seconds with `cubic-bezier(.16,1,.3,1)`; Orbit has a 9-second repeating SVG particle. Reduced-motion preference disables CSS animation and transitions, turns off smooth scrolling and hides the particle.

## Shapes

Orbit and Studio use a 14px workspace radius; Signal uses 7px. Buttons are generally 7px, reduced to 5px inside Signal. Inputs use 6px, the Studio dock 12px, and selected navigation items 8px or 5px in Signal. Thin dividers organize editor panels without placing every label inside a container. Circular avatars, constellation tracks and the central data node provide Orbit's softer geometry; rotated rounded tiles distinguish Studio; aligned rectangular diagrams distinguish Signal.

Artwork is inline SVG and CSS. No raster assets or remote image dependencies ship in this preview. Locally copied fonts retain their license files.

## Components

### Review controls and navigation

Concept and tool buttons expose their selected state with `aria-pressed`; theme switching has a descriptive accessible label. The comparison disclosure updates `aria-expanded`, and Escape closes it. Choosing a comparison card selects that concept and focuses the tool workspace. Comparison is an in-page section, not a modal. Orbit's hero nodes are additional working tool shortcuts. The sample avatar displays an informational toast; it does not open or modify a real account or project.

### Buttons, fields and editor panels

Primary actions use accent background and accent foreground, 10px 16px padding and a 40px minimum height. Secondary actions use a panel background and line border. Icon actions use at least 32px dimensions. Inputs have visible or screen-reader labels; focus uses a 2px accent-text outline with 4px offset, with a separate outline for the custom checkbox track. Invalid JSON and hex inputs expose `aria-invalid`. Status messages and toasts use `role="status"`. Disabled request controls visibly dim and prevent repeat submission while a request is active.

The page provides a skip link to the focusable workspace. Code and tree output are keyboard-focusable; tree branches use native `details` and `summary`. Focus is restored after rerenders where a matching enabled control is available. Decorative icons are hidden from assistive technology, while Signal's structure illustration has a description. These are implemented affordances, not a full WCAG certification.

### JSON formatter

The sample loads immediately. The tool formats and validates JSON, minifies it, changes indentation to two spaces, four spaces or tabs, optionally auto-formats on input, clears input, reloads the sample, copies output and downloads `formatted.json`. Command/Ctrl+Enter formats JSON. Copy reports a fallback message if clipboard access fails. Code view adds syntax coloring and line numbers; Tree view uses expandable objects and arrays, with a depth cutoff after eight levels. The inspector derives item counts, depth, type counts and UTF-8 output size from the current valid output. Invalid input clears the output and reports the parse error.

### API request

The tool sends real browser requests only after the user submits the form. It supports GET, POST, PUT, PATCH, DELETE and HEAD; GET and HEAD disable and omit the request body. Other methods validate nonempty JSON before sending and set JSON content type. Accept options are JSON, text or any content type. The sample endpoint is the local [`sample-response.json`](./sample-response.json) fixture.

`fetch` uses `credentials: 'omit'`, `cache: 'no-store'`, an HTTP(S)-only URL check and a 12-second abort timeout. Custom endpoints must allow browser access through CORS. No credentials, existing API configurations or production projects are used. Results show real status, elapsed time and body; parseable JSON is formatted, other content is shown as text, and HTTP/network/timeout failures are reported. Displayed byte count is computed from the formatted output, not measured wire transfer size. The prototype does not provide custom authentication, arbitrary headers, request persistence or a backend CORS proxy.

### Color contrast and inspector

Text and background colors accept six-digit hexadecimal values through text fields or native color pickers. Swap reverses the pair. The tool computes relative luminance contrast and reports AA normal (4.5:1), AA large (3:1) and AAA normal (7:1), with visible Pass/Fail labels as well as color. Invalid entries keep the prior valid preview and show an error. This is a text-color pairing checker, not an audit of the entire application.

### State and verification boundaries

Tool data lives only in the JavaScript state object for the current page. Reloading resets inputs and output; only the concept/theme/tool selection is represented in the URL. No application storage, saved workspace data, cookies, IndexedDB or localStorage are changed. User-triggered copying and JSON downloading are the explicit export actions.

The build's browser review covered both themes and mobile layouts, concept comparison, JSON formatting/error/tree/indentation, real sample API success and invalid-body prevention, and contrast ratios of 21:1 and 1:1 plus invalid color input. This records prototype review coverage; it does not extend to all production tools, authentication, localization, remote endpoint behavior or exhaustive assistive-technology testing.

### Home landing extension

[`landing.js`](./landing.js) and [`landing.css`](./landing.css) add three home compositions to the same isolated prototype. `index.html` loads them beside the shared workspace files. The URL now also records `view=home|workspace`, with **home as the default**. This extends the earlier query/state description. The Home/Workspace review buttons expose selection with `aria-pressed`; switching surfaces focuses and scrolls to the destination. Home tool shortcuts open the corresponding live workspace without sending a request automatically.

| Home | Composition and discovery |
| --- | --- |
| Orbit | Violet constellation hero with three clickable floating tools around a central workspace, followed by a JSON transformation strip and three outlined discovery cards. |
| Studio | Apricot, plum and sage tool objects with rotated geometry, an expressive headline and three raised discovery cards. |
| Signal | Cobalt request/response console with an explicitly labeled illustrative response, followed by compact divider-separated tool rows. Real status and timing appear only after Send in the workspace. |

Homes inherit both themes and local fonts. The canvas caps at 1600px; horizontal insets are 6% by default, 7% for Studio and 5% for Signal. Desktop hero headings use Lab Display at 68px, 72px and 61px respectively. Home primary actions have a 50px minimum height by default; Signal uses 46px. Decorative objects remain SVG/CSS rather than raster images. The late `body { transition: none }` rule makes theme changes immediate, superseding the earlier body-color transition and avoiding unreadable intermediate palettes; other control transitions remain.

Home breakpoints are 1600px, 1200px, 950px, 620px and 370px. At 950px the review bar wraps and Signal's heading/action arrangement stacks. At 620px heroes reflow above their illustrations, discovery becomes one column, Signal's request/response panels stack, and the privacy section uses a `29px minmax(0,1fr)` grid so its copy and action retain useful width. Orbit's central node and API shortcut reposition; Studio's objects shrink without losing their tool links. Below 370px typography and object sizes reduce again. Reduced-motion styling stops the Orbit satellites, Signal pulse and Studio flower animations.

The labeled discovery search filters the three demos by tool name and detail text, case-insensitively, and presents a live-status empty message when nothing matches. “Explore tools” and “Your data” link to page sections. Privacy copy distinguishes on-device JSON/contrast calculations from explicit API submission. Search is transient DOM state; navigation rerenders reset it. Existing in-memory tool data remains shared between home and workspace, and the production-storage boundaries above still apply.

Landing review covered all twelve concept/theme/desktop-mobile combinations, saved under `.impeccable/review/v2.1/home-{concept}-{theme}-{desktop,mobile}.png`. The reported checks confirmed exact background tokens in all six theme/concept combinations, no horizontal overflow at 1440px and 390px, search filtering and its empty state, and a real HTTP 200 after launching the API tool from home. These checks establish prototype behavior, not production release approval.

### Full-catalog extension

[`catalog-data.js`](./catalog-data.js), [`catalog.js`](./catalog.js) and [`catalog.css`](./catalog.css) replace the three-sample home discovery section with **147 actual tools across 15 categories**. The data is a snapshot of `src/lib/public-tool-catalog.json`, including canonical paths derived through `toolPath`; source parity was verified. This supersedes the earlier sample-only catalog/search description. The three working editors remain JSON formatter, API request and color contrast.

Orbit uses a sticky 220px category sidebar and outlined cards. Studio places all 16 choices (All categories plus 15 categories) in a four-column category grid above raised cards. Signal uses a 205px sidebar and defaults to compact list rows. Shared controls offer grid/list layouts and name sorting A–Z or Z–A. All categories initially shows up to three tools per category with Show all/Show fewer; selecting a category, searching or filtering saved tools shows the full matching set.

Search matches every whitespace-separated query word against names, descriptions, categories and tags, case-insensitively. Category counts reflect search and saved filters; a live-status result count accompanies the results. Stars and the Saved filter use an in-memory set, with no production favorites or persistence access. Catalog search, category, saved items, sorting and layout survive page rerenders within this tab and reset on reload, except that a valid initial `category` query parameter can seed the category. This replaces the earlier transient-DOM search behavior.

Non-demo tools open a focusable inline detail panel with description, tags and an explicit statement that the redesigned editor is not implemented in this sample. JSON/API demo actions remain available there. Opening details focuses and scrolls to the panel; closing restores focus to the originating tool when present. Removing the last saved result preserves keyboard focus on Saved, and empty states provide Show all tools. The compact mobile Saved control retains `aria-label="Show saved tools"` when its visible label is hidden.

At 1200px Orbit's card grid reduces from three to two columns; Studio retains three until 950px, when its category grid also reduces to three columns. At 620px every concept uses a labeled native category select and a single card column; Signal retains compact list styling unless Grid is chosen. The select is at least 44px high. Catalog anchors scroll immediately, with sticky-header offsets adjusted at 950px and 620px. Colors, fonts, focus treatment and reduced-motion behavior inherit the scoped preview system.

Catalog review checked all twelve concept/theme/desktop-mobile combinations at 1440×1100 and 390×844 without horizontal overflow; screenshots are `.impeccable/review/v2.1/catalog-*.png`. Reported functional checks covered counts for all 15 categories, three matches for “json schema”, and save/filter/remove-to-empty focus behavior. Full catalog visibility does not imply 147 redesigned working editors or production release approval.

## Do's and Don'ts

- **Do** keep all three directions available until the user chooses one, and keep changes isolated to this prototype.
- **Do** preserve theme foreground/background pairings, focus indicators, labels, visible error explanations and reduced-motion behavior.
- **Do** keep network submission explicit and the local sample endpoint available.
- **Do** derive inspector information from actual tool state and describe fixture data as sample data.
- **Do** retain font licenses when copying or redistributing the local assets.
- **Don't** treat these preview query parameters as replacements for production category/tool routes.
- **Don't** read or write existing application persistence, API credentials or project data from this prototype.
- **Don't** represent the selected preview tab as an approved production direction or a released 2.1 build.
- **Don't** merge this document into root `DESIGN.md`, `PRODUCT.md` or `.impeccable/design.json` before a production direction is selected.

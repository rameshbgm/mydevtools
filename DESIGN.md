---
name: My Dev Tools — Signal
description: 'Approved application-wide developer workspace: compact controls, clear data and direct tool discovery.'
colors:
  light-ground: '#e5ebf2'
  light-surface: '#ffffff'
  light-inset: '#f0f4f8'
  light-text: '#17283d'
  light-secondary: '#53677d'
  light-border: '#c9d5e2'
  light-control-border: '#7c8fa8'
  light-accent: '#2458d3'
  light-action-ink: '#ffffff'
  light-selected: '#e2eaff'
  light-success: '#226b50'
  light-warning: '#925600'
  light-error: '#b22643'
  light-code-key: '#2e5bb7'
  light-code-string: '#397546'
  light-code-number: '#a04b1a'
  dark-ground: '#101a26'
  dark-surface: '#172535'
  dark-inset: '#142130'
  dark-text: '#e8f0fc'
  dark-secondary: '#a8bad0'
  dark-border: '#33465e'
  dark-control-border: '#617994'
  dark-accent: '#9bbaff'
  dark-action-ink: '#112956'
  dark-selected: '#223e65'
  dark-success: '#88d8b5'
  dark-warning: '#ffcf88'
  dark-error: '#ff98af'
  dark-code-key: '#a8c6ff'
  dark-code-string: '#a8d6b5'
  dark-code-number: '#f5ba8f'
typography:
  display:
    fontFamily: Sora, sans-serif
    fontSize: clamp(34px, 3.6cqi, 52px)
    fontWeight: 550
    lineHeight: 1.08
    letterSpacing: -.04em
  page-heading:
    fontFamily: Geist, sans-serif
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -.025em
  tool-heading:
    fontFamily: Geist, sans-serif
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -.03em
  body:
    fontFamily: Geist, sans-serif
    fontSize: 12px
    lineHeight: 1.65
  label:
    fontFamily: Geist, sans-serif
    fontSize: 12px
    fontWeight: 550
    lineHeight: 1.6
  data:
    fontFamily: Geist Mono, monospace
    fontSize: 12px
    lineHeight: 1.8
rounded:
  small: 4px
  control: 5px
  medium: 6px
  panel: 7px
spacing:
  field-gap: 8px
  control-inset: 8px 12px
  form-grid: 22px 24px
  tool-split: 18px
  card-body: 18px
  catalog-grid: 14px
components:
  button-primary:
    backgroundColor: '{colors.light-accent}'
    textColor: '{colors.light-action-ink}'
    rounded: '{rounded.control}'
    height: 40px
    typography: '{typography.label}'
  button-primary-dark:
    backgroundColor: '{colors.dark-accent}'
    textColor: '{colors.dark-action-ink}'
    rounded: '{rounded.control}'
    height: 40px
    typography: '{typography.label}'
  button-secondary:
    backgroundColor: '{colors.light-surface}'
    textColor: '{colors.light-text}'
    rounded: '{rounded.control}'
    height: 40px
    typography: '{typography.label}'
  input:
    backgroundColor: '{colors.light-surface}'
    textColor: '{colors.light-text}'
    rounded: '{rounded.control}'
    height: 40px
    padding: '{spacing.control-inset}'
    typography: '{typography.body}'
  navigation-selected:
    backgroundColor: '{colors.light-selected}'
    textColor: '{colors.light-accent}'
    rounded: '{rounded.small}'
    padding: 10px 9px
    typography: '{typography.body}'
  tag:
    backgroundColor: '{colors.light-surface}'
    textColor: '{colors.light-secondary}'
    rounded: '{rounded.small}'
    padding: 5px 9px
  panel:
    backgroundColor: '{colors.light-surface}'
    textColor: '{colors.light-text}'
    rounded: '{rounded.panel}'
    padding: '{spacing.card-body}'
  catalog-row:
    textColor: '{colors.light-text}'
    padding: 19px 10px
    typography: '{typography.body}'
  carousel-control:
    backgroundColor: '{colors.light-surface}'
    textColor: '{colors.light-accent}'
    rounded: 50%
    width: 36px
    height: 36px
  labeled-toolbar:
    typography: '{typography.body}'
---

# Design System: My Dev Tools — Signal

## Overview

**Creative North Star: "Signal"**

Signal is the user-approved visual direction for the entire application: home, catalog, tool pages, workspaces, supporting pages and shared overlays. It replaces the former introduction-only identity. Pale slate and navy surfaces, blue actions, compact typography and ruled layouts keep real developer work prominent.

The reference preview remains a historical decision artifact. Production follows the later approved headline, feature links, randomized tool carousel and integrated catalog. These design documents record the implemented redesign; they do not announce publication of a 2.1 release.

**Key Characteristics:**

- A coherent paired light/dark semantic palette across custom CSS and Ant Design.
- Compact 12px UI copy, aligned controls and larger purposeful headings.
- Full-width home with integrated category navigation; working controls lead tool pages.
- Real registry-driven discovery, canonical tool links and explicit data boundaries.
- Keyboard operation, reduced-motion behavior and eight-language/RTL support are preserved.

The authoritative implementation is [`signal-theme.ts`](src/lib/signal-theme.ts), [`workspace.css`](src/app/workspace.css), [`globals.css`](src/app/globals.css), [`AppShell`](src/components/AppShell.tsx), [`LandingMarketing`](src/components/LandingMarketing.tsx), [`LandingToolCarousel`](src/components/LandingToolCarousel.tsx) and [`SignalCatalog`](src/components/SignalCatalog.tsx). Marketing remains in LandingMarketing and `landing-*` global rules; shell, catalog and tool wrappers remain in workspace.css. Shared palette and Ant Design settings must agree. Later scoped CSS overrides take precedence over legacy declarations earlier in the stylesheet.

## Colors

### Primary

**Cobalt / pale blue accent** drives actions, links, selected navigation, focus and tool iconography. Its dedicated action foreground changes with the theme. Selected surfaces use the corresponding soft blue token; do not reuse pale dark-theme action text on a light action.

### Secondary

**Success green, warning amber and error rose** carry status meaning. Each has a light/dark pair. Code keys, strings and numbers also have paired colors; code tokens are data roles, not additional brand accents.

### Neutral

**Slate ground, paper or navy surface, and inset panels** separate page, working area and secondary detail. Primary text and secondary text remain distinct from decorative borders. **Control border** is deliberately stronger than the divider border, keeping editable fields identifiable in both themes.

Frontmatter records the actual `--signal-*` primitives from workspace.css. Existing `--wb-*`, background/foreground and primary aliases map to these same values. The `.dark` class switches the palette; AppShell also sets browser `color-scheme`. `SIGNAL_PALETTES` supplies matching Ant Design roles. Component frontmatter describes the light default and named dark variants; sidecar examples bind to live CSS variables.

**The Paired Surface Rule.** Change the complete semantic set together; preserve text, action-foreground, control-border and status relationships in both themes.

## Typography

Locally bundled **Sora** carries the landing display; **Geist** carries navigation, body text, labels and controls; **Geist Mono** carries code, requests and structured data. They load through `next/font/local` with `display: swap`. Preserve font licenses and explicit LTR isolation for code even in RTL interfaces.

The shared interface scale is **12px**, including form labels and values, dropdown items, buttons, catalog tool names/descriptions and navigation. Tool input line height is 22px; ordinary body rhythm is 1.65. Larger headings and numerical visualizations retain hierarchy rather than inheriting the control scale. Small metadata and badges remain source-specific secondary roles.

The desktop landing display uses the frontmatter clamp. At landing-container widths up to 620px it becomes `clamp(28px,8.5cqi,36px)` with line height 1.12. Tool headings use 26px, reducing to 23px on narrow phones. Standard Ant Design heading sizes are 28, 23, 20, 17 and 15px. Carousel headings use `clamp(23px,2.2cqi,30px)` and 23px on mobile. Do not revive earlier 14–16px form overrides: the final shared UI rules establish the current 12px contract.

**The Data Face Rule.** Use mono for actual technical data; keep labels and explanatory UI in Geist and the landing display in Sora.

## Layout

Home spans the available page width with no outer application sidebar. Its centered content caps at 1600px and uses 5% horizontal inset, reducing to 20px on narrow phones. The home header is 76px, reducing to 66px at 540px. It contains branding, discovery navigation and global actions; less critical navigation condenses as available space decreases.

The compact hero pairs the headline “Build. Inspect. Debug.” / “Keep your flow.” with a useful developer description and real links to Project Workspaces, Tool Tabs, Saved Workflows and the catalog. A bounded carousel follows. Its desktop slide is `clamp(260px,38svh,340px)` high with two equal columns; at a 620px landing container it becomes a 258px copy-only slide and hides the illustrative panel. The final composition was reviewed at 1440×900 and 390×844 so the hero fits a normal first screen.

Home categories live **inside the catalog**, in a 205px rail beside a flexible results column with a 28px gap. The rail sticks at 98px and is capped at `calc(100dvh - 122px)`. Its focusable navigation scrolls independently with contained overscroll, keeping all categories reachable on short screens. At 700px the rail becomes a labeled full-width select. Do not add a second category sidebar outside this section.

Other application pages use a fixed 248px sidebar, 64px when collapsed, and a 60px sticky header. Below the 992px desktop breakpoint, the sidebar becomes a direction-aware drawer and content loses its reserved margin. Content and tool wrappers use available width. Supporting guides, release notes, memory and error pages share the same ruled structure and palette.

Tool split panes use two flexible columns with an 18px gap and stack at 1050px. Standard form grids use two columns with 22px row and 24px column gaps; connection grids use a wider endpoint column and two smaller fields, reduce at 1100px and stack at 700px. Fields have `min-width: 0`; labels sit 8px above controls. Tables scroll inside their content wrapper, tab navigation stays bounded, and segmented controls scroll horizontally instead of widening the page. Mobile project tabs and actions reflow into a two-column control row.

## Elevation & Depth

The normal interface is flat. Borders, inset backgrounds and selected fills establish grouping; cards and primary buttons have no ambient shadow. Dialogs, command/navigation overlays and elevated Ant Design surfaces use `0 12px 32px -12px rgb(0 0 0 / 24%)`. The overlay scrim is `rgb(16 26 38 / 65%)`; it does not use glass blur. Avoid decorative gradients and card lift as a substitute for hierarchy.

**The Working Surface Rule.** Keep normal tools and catalog surfaces flat; reserve elevation for layers above the current working context.

## Shapes

Corners are restrained: 4px for small details, 5px for controls, 6px for intermediate containers and 7px for panels, dialogs and the carousel frame. Tool headers and default catalog rows are square, divider-led sections. The carousel's Previous/Next controls are intentionally circular: 36px on desktop and 30px on mobile. Illustration symbols can use larger curves without changing the control grammar.

## Components

### Buttons, fields and forms

Primary actions use the accent/action-foreground pair, weight 550 and no button shadow. Secondary actions use a surface with a line border. Normal single-line tool inputs, selects, request-bar controls and action buttons align at 40px; small and icon controls retain compact source sizes. Controls can grow vertically when translated labels wrap. Textareas start at 110px, resize vertically and preserve their data face. Composite controls own their border and padding; their internal typing input must not add another control box.

Hover and active borders use the accent. Input focus can add a 2px selected-color halo. Global keyboard focus is a 2px accent outline with a 3px offset; catalog search shows its ring around the containing field. Native labels, Ant Design accessible controls, visible status copy and paired error colors remain part of each tool's interaction contract.

**Labeled toolbar.** Shared toolbar controls place labels above fields and align actions with the control baseline, not the label row. The toolbar wraps with `align-items: flex-end` and a 16px gap; each field has a 160px minimum width. Its action group uses an 8px gap. Selects, segmented choices and normal actions align at 40px; segmented controls have 3px inset and 34px inner labels. At 700px and below, fields flex across the available width and actions form a two-column grid: the primary action spans the first row, with secondary actions equally sized beneath. HMAC uses this pattern for Algorithm, Output Format, Generate HMAC, Share and Send; labels and segmented-group accessible names remain associated with their controls.

### Navigation and catalog

The production catalog derives **147 tools across 15 categories** from the real registry. Default list rows show name, task description, icon and processing boundary; Grid is an alternative. The unfiltered overview shows three entries per category with Show all/Show fewer; category selection and search reveal the full matching sets. Search uses the shared locale-aware matching helper; name/category order uses the active language. Query `q` and category hashes can open discovery at a relevant result set.

Bookmarks read existing saved bookmark menus; this is not the preview's in-memory star system. The header manages bookmark menus, and the catalog filters their tool IDs. All rows link to actual canonical tool URLs using `toolPath`, with recents recorded on activation. Empty states explain search or bookmark results and provide a reset. Selected controls expose `aria-pressed`; result counts use status announcements. The command palette remains available through Command/Ctrl+K; the skip link goes to main content.

### Tool pages and supporting content

A compact breadcrumb and ruled tool title lead the page. A relevant collapsed network disclosure can precede the tool; **working controls precede Learn More, reference provenance, FAQs and related tools**. Guidance remains available below rather than occupying the initial working area. Preserve each tool's existing validations, outputs, data disclosures and storage behavior; the visual redesign does not redefine capabilities.

### Discovery carousel

The hero discovers tools from the complete registry rather than a fixed API advertisement. After hydration it selects a random tool; subsequent automatic selections run every **four seconds**, excluding the current tool so generated transitions do not immediately repeat. Each slide shows the actual translated name/description and processing boundary, with a canonical **Open tool** link. Code samples, diagrams and tags are illustrative discovery graphics, not measured executions; rendering them sends no network requests or saved payloads.

Pause/Resume and Shuffle remain explicit. Circular Previous/Next buttons navigate actual visited history (up to 100 entries): Previous disables at the beginning, Next replays forward history or appends a random tool, and Shuffle discards forward history before appending. Circular describes the button shape, not an invented wraparound history behavior.

Autoplay pauses during pointer hover, focus anywhere within the carousel, offscreen visibility and a hidden document. Reduced-motion users start paused; opting to resume remains available. Slides announce politely only while manually paused or keyboard-focused, avoiding automatic live-region chatter. The visual reveal lasts 0.3s with `cubic-bezier(.16,1,.3,1)`; normal component changes use 0.16–0.2s. Reduced-motion CSS minimizes animations/transitions and removes smooth scrolling.

### Localization, data and installation

Preserve English, Hindi, Spanish, French, German, Japanese, Chinese and Arabic choices and their existing translations. Arabic uses RTL shell/drawer/navigation flow; code remains LTR and directional arrows mirror. New visible and accessible copy goes through the language layer. This design record does not imply every legacy string has been independently audited in every locale.

Existing saved projects, notes, snippets, bookmarks, workflows and settings remain intact. Local transformations, explicit network tools and native database/storage operations retain their distinct boundaries. Web installation is offered where supported and hidden in the desktop runtime; offline use depends on cached resources and network tools still need connectivity.

### Verification record

The [Signal review packet](.impeccable/review/signal/review-packet.md) records the direction, rejected layouts, source checks and capture scope. Final reviewer disposition was **ship** after both material fixes were resolved. Final home, Agent Manifest and A2A production captures include desktop and mobile, with paired themes where listed; broad initial-state scans covered all 147 tool routes. These checks establish the reviewed visual implementation, not every possible data-dependent tool state or a new published release. No raster assets were introduced.

## Do's and Don'ts

- Do use Signal across all application pages while retaining the marketing/workspace source split.
- Do use semantic foreground/background pairs and stronger control borders in both themes.
- Do keep body, form and navigation text at the shared 12px scale; preserve heading and numerical hierarchy.
- Do align normal form controls at 40px, allow long labels to wrap, and collapse grids before fields overlap.
- Do keep tool controls above guidance and reference material, with compact network disclosures still available.
- Do derive discovery from the real registry and navigate with toolPath or toolPathFromId.
- Do preserve existing tools, saved data, bookmark menus, projects and all eight locale choices with RTL support.
- Do retain clear pause, focus and reduced-motion behavior for automatic discovery.

- Don't restore duplicate outer home sidebars, an unbounded sticky category list or the removed fixed API call-to-action.
- Don't introduce gradients, glass, decorative shadows or fabricated live tool output into Signal discovery.
- Don't make network requests or access saved payloads merely to animate a carousel illustration.
- Don't mistake the historical three-demo preview for the production tool catalog or its persistence behavior.
- Don't describe this implementation or review as a published 2.1 release or comprehensive functional certification of every tool.

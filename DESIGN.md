---
name: My Dev Tools — Introduction
description: Active developer workbench within the existing product identity; introduction only.
colors:
  landing-ground: "#f5f7fb"
  landing-paper: "#ffffff"
  landing-ink: "#122b42"
  landing-muted: "#526477"
  landing-teal: "#006b79"
  landing-indigo: "#3859d7"
  landing-line: "#cdd9e4"
  landing-tint: "#e7f2f4"
  landing-code: "#edf3f8"
  dark-ground: "#101c2b"
  dark-paper: "#17283a"
  dark-ink: "#edf4fc"
  dark-muted: "#afc2d4"
  dark-teal: "#79d9df"
  dark-indigo: "#afc0ff"
  dark-line: "#39516a"
  dark-tint: "#203d4b"
  dark-code: "#122235"
typography:
  display:
    fontFamily: "Sora, Geist, sans-serif"
    fontSize: "clamp(39px, 5.1cqi, 64px)"
    fontWeight: 650
    lineHeight: 1.09
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Sora, Geist, sans-serif"
    fontSize: "clamp(26px, 3cqi, 36px)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "14px"
    lineHeight: 1.65
  label:
    fontFamily: "Geist, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  data:
    fontFamily: "Geist Mono, monospace"
    fontSize: "12px"
    lineHeight: 1.8
rounded:
  button: "9px"
  preview: "12px"
spacing:
  compact: "8px"
  control: "12px"
  inset: "16px"
  group: "20px"
  section: "36px"
components:
  button-primary:
    backgroundColor: "{colors.landing-ink}"
    textColor: "{colors.landing-paper}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.landing-teal}"
    textColor: "{colors.landing-paper}"
  button-primary-dark:
    backgroundColor: "{colors.dark-ink}"
    textColor: "{colors.dark-paper}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  preview:
    backgroundColor: "{colors.landing-paper}"
    rounded: "{rounded.preview}"
  preview-dark:
    backgroundColor: "{colors.dark-paper}"
    rounded: "{rounded.preview}"
---

# Design System: My Dev Tools — Introduction

## Overview

**Creative North Star: "Active Developer Workbench"**

The introduction explains the developer workspace, leads directly to the tool catalog and illustrates project organization. Cool paper, navy text and restrained teal cues extend the established Sora/Geist identity. The user requested removal of the live demo and its entry points; the introduction now has a single-column hero and one primary catalog action.

This record governs `src/components/LandingMarketing.tsx` and its `landing-*` rules in `src/app/globals.css`. The application shell, sidebar, header, tool wrappers and `src/app/workspace.css` have their own styling contract. Built source and rendered captures remain the authority. `docs/landing-intro-design.md` records the current surface brief.

## Colors

Light and dark each switch the complete semantic set: ground, paper, ink, secondary text, teal action, indigo focus, dividers, local tint and code well. Source values are recorded in frontmatter. Teal marks actions and the selected project feature; indigo marks keyboard focus. Code wells distinguish illustrative structured data from interface copy.

**The Paired Surface Rule.** Switch semantic colors together so text, controls, dividers and example data remain readable in both themes.

## Typography

Sora carries principal headings, Geist carries explanations and controls, and Geist Mono carries technical example data and filenames. Fonts are locally bundled.

The hero uses `clamp(39px, 5.1cqi, 64px)`, weight 650, line height 1.09, tracking -0.035em and a 24ch maximum measure. Its copy container is at most 960px wide. French and German use `clamp(36px, 4.3cqi, 56px)` with the same 24ch measure. Hindi and Arabic use `clamp(35px, 4.5cqi, 58px)`, line height 1.25, normal tracking and the available measure. Japanese and Chinese join translated headline fragments without an inserted English space. Headings allow automatic hyphenation.

At container widths up to 650px, the default hero heading uses `clamp(35px, 8cqi, 49px)` and a 15ch measure; language-specific overrides remain in effect. Hero description text has a 65ch measure, line height 1.65 and 17px type, with a 16px mobile override. Section headings use the headline role in frontmatter. Task descriptions and example metadata use the incumbent compact hierarchy.

**The Data Face Rule.** Use mono type for actual technical data and filenames, Geist for explanation and controls, and Sora for the principal heading hierarchy.

## Layout

The introduction is an inline-size container with fluid horizontal inset `clamp(18px, 3vw, 44px)` and a soft 16px outer silhouette. Responsive decisions follow the introduction's available width within the app shell.

The hero is a single reading column with the product promise, description, catalog action, processing/account facts and release link. It has no second preview column. The task index follows immediately: three columns at wide sizes, two at widths up to 929px and one at widths up to 650px. Task rows use shared alignment and fine dividers.

The project story pairs feature selections with a visibly illustrative project surface. Its preview sticks at 152px on desktop. At widths up to 650px, selections and preview stack, the preview stops sticking, and data/closing sections become single-column layouts. Data boundaries explain local transformations, explicit network requests and browser-local saved work.

The three introduction navigation links are Workspace, Your data and All tools. Navigation sticks at 60px beneath the app header; anchor targets leave room for both headers. The document remains the scroll container. The catalog action and task links use the existing canonical tool routes.

Arabic follows RTL flow for navigation, hero, feature selection and supporting explanations. Directional action arrows mirror. Technical filenames, structured previews and query tables retain explicit LTR direction. Logical insets and workflow output placement follow interface direction.

## Elevation and shapes

The illustrative project surface uses paper, a 12px radius and the existing diffuse shadow `0 16px 42px -18px rgb(18 43 66 / 24%)`. Supporting rows remain flat. Primary catalog actions use a 9px radius, solid ink fill with paper text, a 48px minimum height and an inline arrow. Hover changes the fill to teal and lifts by 2px. Text actions underline on hover. Keyboard focus uses an indigo outline.

**The Working Surface Rule.** Reserve broad ambient elevation for the illustrative project preview; organize supporting links and explanations with alignment, spacing and dividers.

## Components and behavior

### Navigation and discovery

The hero has one primary action: Explore the registry-derived tool count. The release link opens version 2.0.0 notes. Six task links connect concrete developer jobs to their actual tools. Section navigation and a closing catalog action help the visitor continue without a separate demo step.

### Project story

The labeled example project shows project resources, parallel tools and a reusable workflow. It is separate from saved user projects. At sufficient story width, scrolling selects the preview. Clicking remains available at every width; manual selection prevents subsequent scroll takeover. The selected preview links to the real Project Workspaces, Tool Workbench or Saved Workflows tool.

Selections use the existing icon family, descriptive copy, visible selected state and roving keyboard focus. Up/Down and Home/End select a feature. Structured example data keeps its exact technical identifiers and values.

### Localization

The remaining introduction copy uses authored English, Hindi, Spanish, French, German, Japanese, Chinese and Arabic translations. This covers section navigation and accessible names, hero/actions, task descriptions, project previews, data boundaries and installation help. Actual fixture data, algorithm names and technical identifiers remain unchanged. Translation labels wrap and script-specific heading spacing remains intentional. Full-product translation remains in progress independently of introduction coverage.

### Motion

The existing 0.28-second project transition uses easing `[0.16, 1, 0.3, 1]` and a small vertical offset. Scroll progress traces the document position. Reduced motion makes transitions immediate, disables automatic scroll-driven story selection and hides progress. CSS removes transitions and animations under the reduced-motion preference; smooth document scrolling applies only when motion is permitted. First-paint content stays visible, with no autoplay loop or scroll interception.

### Installation

The web install action remains below the introduction. It invokes supported browser installation or explains the available browser option. Offline use requires cached resources; network tools still need connectivity. The desktop app omits the web-install action.

## Do and don't

- Keep introduction styles separate from the workspace styling contract.
- Preserve paired themes, visible keyboard focus, semantic controls and canonical links.
- Keep tool/category counts derived from the registry.
- Label illustrative projects and keep their data separate from user projects.
- State browser, network and native-runtime boundaries accurately.
- Preserve all eight introduction languages and explicit direction for technical data.
- Keep the live demo, demo CTA and demo navigation removed as requested.
- Avoid fake terminal activity, invented customer claims and claims that every tool works offline.
- Do not infer complete product localization from this scoped surface record.

Earlier review captures show the former demo layout and are historical evidence. Current removal and responsive verification are recorded in the capability ledger with the latest production build.

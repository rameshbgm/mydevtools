# Introduction redesign

Scope: replace the introduction in `LandingMarketing.tsx` and its marketing styles. Preserve the app shell, compact language button beside favorites, saved preferences, tool catalog and canonical tool URLs. This is a new composition inside the existing visual identity, not a new identity for the workspace.

Visitor mode: Persuade. A developer arriving with a data or integration task should understand the toolkit, understand the workspace and find a tool within seconds.

Direction: an active developer workbench. Keep Sora for display, Geist for reading and the existing mono face for actual data. Use paper/cool gray, deep navy, teal and indigo: light `#f5f7fb`, paper `#ffffff`, ink `#122b42`, teal `#006b79`, indigo `#3859d7`, secondary `#526477`. Dark equivalents preserve readable surfaces and avoid neon-on-black styling.

Composition: compact section navigation, a direct product headline and concrete actions, a task-oriented tool index, a scrolling project story, an explicit data-boundary explanation and a final catalog link. Exact live tool/category counts are supporting facts rather than oversized metrics. No rotating buzzwords, fake terminal, stock illustration or customer claims.

Signature: the project story changes its preview as the visitor scrolls through project organization, parallel tools and repeatable workflows. Its fixture is visibly an example project, separate from saved user data.

Motion: animate the story preview through meaningful states and show section-scroll progress. Keep first-paint content visible. No scroll hijacking, timed carousel, autoplay media or infinite animation. Reduced-motion users get immediate state changes and click navigation without spatial transitions. Use the installed Motion library and native browser APIs; no new graphics dependency or remote font/image request.

Content rules: browser tools are local by default; network tools contact chosen endpoints after an explicit action. Desktop/local runtime is required for native database/storage connections. JWT decoding never claims signature verification. Projects and preferences are browser-local; encrypted vaults are optional and passphrase protected. Offline availability depends on bundled desktop assets or previously cached web resources.

Verification: bounded desktop/mobile and light/dark inspection, no demo entry points or orphan anchors, keyboard navigation, canonical tool links, scroll navigation/story, reduced motion, no horizontal overflow, no hydration errors and clean production build. Finish with independent review and a scoped visual-system record.

User-requested simplification: remove the live demo CTA, its navigation link and the entire interactive JSON/Base64/JWT panel. Remove unused demo state, styles, helper, tests and translations. Use a single-column hero with one primary catalog action; retain the task index, illustrative project story, data boundaries and install/release links.

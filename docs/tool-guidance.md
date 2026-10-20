# Tool help and network disclosures

Every registered tool page provides “Learn More About This Tool”. Existing page-authored `learnMore` content remains the first choice. `src/lib/tool-help.ts` supplies curated instructions and limits for 21 newer pages through `ToolPageLayout`; the page description supplies their introduction. CSV-to-XML and six legacy certificate aliases open the destination page and its help.

Network-capable pages show a warning disclosure before their controls, collapsed by default using native `details` and `summary`. Expanding it shows why a connection is needed, the fields sent, data handling and source links. Existing `learnMore.serverNotice` definitions retain precedence. `src/lib/tool-network-disclosures.ts` covers the remaining boundaries: direct browser requests, managed proxy routes, authenticated localhost connectors and external model downloads. Local parsing must not be described as uploading user data.

Do not add a generic server warning to a direct browser feature, or imply that local-only modes transmit their inputs. Disclose optional network operations explicitly. Avoid promising deletion, retention or logging behavior that the owning code cannot establish. Source links must name real files.

The tool-page header keeps its Local processing label for local tools. Network pages use the detailed warning instead of the previous generic badge. Catalog cards use the short “Network features · view data disclosure” label; opening the tool exposes the full notice.

The new guidance is authored in English, Hindi, Spanish, French, German, Japanese, Simplified Chinese and Arabic. `src/lib/i18n/tool-guidance.ts` supplies the new shared translation rows. Language changes do not send a request, alter request fields or force the disclosure open.

Run `npm run test:tool-page-guidance` after adding a tool or changing these contracts. It checks all 147 registered routes, six legacy aliases, help/disclosure wiring, real collapsed notice props, route-specific source links and extra content, translation coverage and preserved public request fixtures. These are page/component checks. No browser or visual verification was performed for this change, as requested.

# Product upgrade validation for v1.6.0

Validated locally on 19 October 2026. Changes are uncommitted and unpushed.

The catalog contains **125 tools**. Four additions are Saved Workflows, HAR & Log Redactor, Webhook Signature Debugger and Trace Context Inspector. UUID generation now includes v7. JSON Schema validation, selected OpenAPI comparisons, protocol adapters, privacy boundaries, references, guides, PWA behavior and container delivery were updated.

## Build and checks

- A fresh dependency install from the lockfile passed. A clean production build after deleting `.next` passed, with 143 prerendered pages and no build warnings or errors.
- All 11 test suites and TypeScript checking passed. ESLint reports 0 errors and 207 warnings that remain in the source tree.
- All 139 checked public paths returned HTTP 200, covering canonical tools, allowlisted legacy stubs, guides, release notes, manifest and icons. The legacy UUID URL returns 308 to its canonical route.
- The managed proxy rejects private/loopback targets and returns `Cache-Control: no-store, private`.
- The Dockerfile built successfully on Node 24. Its runtime user is `app` (uid 1001), the healthcheck is healthy, and homepage/manifest/icon responses are 200. With managed routes disabled, a proxy request returns 503 with an explicit disabled message.

## Measured performance

| Measurement | Original local build | Final local build | Reduction |
|---|---:|---:|---:|
| Homepage HTML bytes | 387,241 | 207,391 | 46.4% |
| Referenced initial JavaScript bytes | 1,532,271 | 1,450,396 | 5.3% |
| Sum of gzipped initial JavaScript bytes | 493,207 | 466,601 | 5.4% |

The asset comparison uses the same method before and after: unique script URLs in generated homepage HTML, including conditional polyfills. It is not a measurement of a deployed CDN's transfer encoding.

| Lighthouse 13.5 production audit | Desktop | Simulated mobile |
|---|---:|---:|
| Performance | 99 | 82 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 0.93 s | 4.92 s |
| Blocking time | 0 ms | 57 ms |
| Layout shift | 0 | 0 |

These localhost lab scores are **not directly comparable** to the user's hosted mydevtools.in screenshots (different host and test conditions). Mobile LCP remains about 4.9 seconds; deployment-specific profiling and further critical-path JavaScript reduction are useful follow-up work. No field Core Web Vitals improvement is claimed.

## Behavior verified

- **JSON Schema:** unit fixtures cover dialects, unions, conditionals, composition, formats, booleans, local references and unsupported rules. The production worker rejected an invalid oneOf instance, accepted a valid instance and reported unresolved references without a validity claim.
- **OpenAPI:** request narrowing, response widening, media changes, local references and required fields are evaluated directionally. Composition, callbacks/webhooks, streaming semantics and full compatibility remain manual review areas.
- **MCP/A2A:** modern and legacy adapter fixtures passed. A real browser connected to a localhost MCP fixture using 2026-07-28 metadata, listed and called a tool. A2A 1.0 discovery, one-shot replies and CRLF-framed streamed artifact assembly worked. Browser inspection is scoped to HTTP JSON-RPC; native stdio, deprecated separate GET/SSE transports and full conformance are not verified.
- **Workflows:** a browser decoded Base64, extracted JSONPath, saved and pinned a fixture, reloaded and reproduced the result. Draft saving is opt-in.
- **Signatures:** GitHub, Stripe, Slack and raw HMAC fixtures passed. Exact-byte tampering and expired timestamps fail. The public guide fixture passed in the browser, then failed after a one-space change.
- **Redaction:** header rows, URL credentials, nested JSON strings, custom fields, environment-prefixed secrets, mTLS private keys and PEM private-key blocks are covered. Redaction remains a best effort; free text and unknown identifiers require review before sharing.
- **Certificates:** Web Crypto accepts a valid RSA chain and rejects tampering and malformed nested DigestAlgorithm data accepted by the affected upstream node-forge verifier. Chain checks do not reproduce full PKIX validation, revocation or browser root trust.
- **Privacy/PWA:** a single manifest and working icons are served; APIs, authenticated requests and RSC data are excluded from service-worker persistence. The update/reload flow worked. With the origin stopped, the previously visited trace tool reloaded and computed results. Uncached assets, browser eviction, model downloads and network operations limit offline availability.
- **Workspace/accessibility:** explicit local smart paste, task aliases, persisted workflow pins, compact mode, lazy bookmarks and keyboard command navigation worked. Desktop and 390 px mobile layouts showed no horizontal overflow; light and dark themes were inspected. Tool wrappers render their initial content visibly.
- **References:** current model rows, tier/expiry notes, OAuth/JWT BCPs, UUIDv7, IANA HTTP labels and RFC dates were reviewed. All 14 source-monitor URLs returned 200. The weekly workflow uploads a read-only report for review and never silently changes prices or verification dates.

## Remaining limits

`npm audit` reports **10 advisories: 6 high and 4 moderate**. Remaining roots are node-forge, Swagger UI and the development lint chain. Available archive/brace patches were applied. No patched node-forge release exists for [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv); the affected RSA verification path is avoided and regression-tested. Breaking downgrades suggested by npm audit were not applied. Dependency peer-range and install-script notices still occur during installation.

Optional provider token counting uses fixed first-party endpoints, page-memory keys and explicit sending. Request serialization, failure handling and response validation were tested with fixtures. Live authenticated provider calls were not made because credentials were not supplied. Historical model metadata remains explicitly unverified.

## Reproduce

`npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, then `npm start`. The start wrapper stages public/static files for standalone output. Measure assets with `node scripts/measure-production-assets.mjs`. Run Lighthouse against that local production server, separately for desktop and default mobile. For container use, see the [README](../README.md).

Full numeric evidence is in [product-upgrade-validation.json](product-upgrade-validation.json). Source/version/review records are in [reference-sources.json](../src/lib/reference-sources.json).

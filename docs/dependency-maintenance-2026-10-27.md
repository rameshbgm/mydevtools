# Dependency maintenance — 27–28 October 2026

The dependency refresh preserves the Signal 2.1 UI work and stays on the existing supported major versions. No deployment or plan changes are included.

## Security findings

| Package | Previous | Installed | Result |
| --- | --- | --- | --- |
| Electron | 44.9.0 | 44.9.3 | Includes the compromised eMudhra certificate mitigation. |
| fast-uri | 3.1.8 | 3.1.9 | Resolves all four reported URI parsing and normalization advisories. |
| node-forge | 1.4.0 | 1.4.2 | No longer falls in the reported vulnerable version range; the malformed DigestInfo regression is rejected. |

The cacheable-request alert GHSA-8x6c-cv3v-vp6g was withdrawn. The remaining build-time `cacheable-request@7.0.4` comes through electron-builder / @electron/get / got and resolves `http-cache-semantics@4.3.0`, above the affected `<4.1.1` range. Do not force an incompatible cacheable-request major override merely to remove this withdrawn alert. A third-party scanner may need its advisory database refreshed.

Sources: [Electron advisory](https://github.com/electron/electron/security/advisories/GHSA-jr5w-w6x2-84p9), [fast-uri 3.1.9 security release](https://github.com/fastify/fast-uri/releases/tag/v3.1.9), [node-forge advisory](https://github.com/advisories/GHSA-86w9-cpqp-85rv), [withdrawn cacheable-request advisory](https://github.com/advisories/GHSA-8x6c-cv3v-vp6g).

The node-forge regression previously asserted that the upstream verifier accepted the crafted malformed signature, while the application platform verifier rejected it. It now asserts rejection by the patched upstream verifier as well as the application verifier; the existing valid-chain and tampering assertions remain.

## Direct dependency updates

| Package | Previous constraint | Updated constraint |
| --- | --- | --- |
| `@aws-sdk/client-s3` | `^3.1152.0` | `^3.1157.0` |
| `@next/swc-wasm-nodejs` | `^16.4.2` | `^16.4.3` |
| `@smithy/node-http-handler` | `4.12.1` | `4.13.0` |
| `antd` | `^6.6.6` | `^6.6.8` |
| `bowser` | `^2.14.1` | `^2.15.0` |
| `electron` | `44.9.0` | `44.9.3` |
| `electron-builder` | `26.15.3` | `26.18.0` |
| `eslint-config-next` | `^16.4.2` | `^16.4.3` |
| `framer-motion` | `^14.3.0` | `^14.7.1` |
| `js-base64` | `^3.9.4` | `^3.9.5` |
| `jsonpath-plus` | `^11.2.1` | `^11.2.2` |
| `marked` | `^18.1.1` | `^18.1.2` |
| `next` | `^16.4.2` | `^16.4.3` |
| `node-forge` | `^1.4.0` | `^1.4.2` |
| `sql.js` | `^1.15.0` | `^1.15.2` |
| `swagger-ui-react` | `^5.33.3` | `^5.34.0` |
| `zustand` | `^5.0.15` | `^5.0.16` |

The lockfile also resolves the compatible fast-uri patch. The clean install runs the repository asset-copy hooks for Monaco, SQL.js and ONNX Runtime and preserves the dependency lifecycle-script allowlist. The allowed Electron package entry follows its updated exact version.

## Newer major versions checked

| Package | Installed | Latest stable checked | Decision |
| --- | --- | --- | --- |
| `electron` | `44.9.3` | `45.0.0` | Separate major-version migration; retained the current major for this release. |
| `protobufjs` | `7.6.6` | `8.8.1` | Separate major-version migration; retained the current major for this release. |

Electron 45 has documented changes to sandboxed preloads, workers, permissions and other APIs. Protobufjs 8 is a major upgrade beyond the current protobufjs 7 ecosystem used by gRPC dependencies. These were checked, not silently presented as installed.

## Validation

- `npm ci` completed from the updated lockfile.
- Full dependency audit: **0 vulnerabilities**.
- Production-only audit: **0 vulnerabilities**.
- Full `npm test` suite passed: **93 regression groups**.
- Web and desktop TypeScript checks passed.
- ESLint completed with zero errors and 61 existing warnings.
- OpenSSL integration verified 26 generated certificate/CSR combinations and invalid/tampered inputs.
- gRPC loopback and TLS tests passed, including streams, exact long/map/byte values, authentication failures, cancellation and limits.
- The downloaded Electron runtime reports `v44.9.3`.

- Clean optimized production build passed with Next.js 16.4.3.
- Compiled privacy smoke passed: no stdout/stderr output on startup, requests, failures or shutdown; no runtime filesystem changes from request/file handling; private API headers; live-only webhooks without replay; exact S3 file relay.
- Native production API smoke passed: actual gRPC, authenticated/local-only services, mock lifecycle and rejected history operations.
- Native HTTP/HTTPS and collection integrations passed, including mTLS, exact multipart data, limits, cancellation and forced no-store mock responses.
- Production discovery/canonical routing/assets passed, including 404 responses for removed pages.
- Desktop staging, protocol boundaries and bundled runtime boot/assets/authentication passed.
- Browser checks confirmed 15px landing menu links with bold/underline selection, 12px/650 expanded sidebar labels, no collapsed gift icon, a single wide footer row and the explicit third-party retention notice. Earlier file-input review covered all 147 routes and verified an actual local file load.

## Server privacy changes

Runtime request/response logging and tracing exports are disabled. Connector input and S3 file byte buffers are cleared after use, API responses disallow caching, local mocks no longer retain incoming requests, and webhooks deliver only to a pending browser poll. The server does not create upload files. These controls preserve browser-saved data and intentional writes to external destinations. Network tools remain available with the user-approved external retention notice, translated into all eight languages.

The [server privacy contract](server-privacy.md) documents the live-webhook limitation, transient memory handling and hosting requirements. Hosting/CDN/OS logging settings and previous provider records were not inspected or changed; no deployment was performed.

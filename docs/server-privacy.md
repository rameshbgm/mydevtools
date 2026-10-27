# Server privacy contract

The application server processes network-tool data transiently. It does not create upload files, request/response logs, request history, analytics events, tracing exports, or a payload cache. Production launchers silence runtime stdout/stderr, disable Next telemetry and OpenTelemetry exporters, disable Node diagnostic reports, and exit without printing uncaught exception/rejection details. Build and test output remains available. Development request/fetch/browser-to-terminal logging is disabled.

## Processing and cleanup

- Local formatting/conversion tools keep files in the browser. Selecting a local file does not upload it to this application's server.
- HTTP and streaming proxies relay data to the selected endpoint without application persistence. Private API responses carry `no-store` controls for browser, CDN and surrogate caches. The service worker excludes all `/api/` traffic.
- Native connectors process bounded input in memory and close clients/connections after use. Connector input byte buffers and S3 upload/download byte buffers are cleared in `finally` paths. No upload spool or temporary file is created, so there is no server upload directory to purge. JavaScript strings and transport copies are released for garbage collection; this is not a claim of secure erasure of every RAM copy.
- Webhooks deliver one request directly to a pending browser long-poll. The server has no queue, request history or replay buffer. A missing/disconnected listener produces HTTP 409. Requests between polls can be missed. Pending listeners are removed on delivery, cancellation, replacement, explicit clearing or timeout (at most 25 seconds). The browser displays up to 50 requests in page memory and clears them on reload; the session URL alone is stored on the device.
- Local mocks drain incoming bodies without capturing them. Their active response configuration and aggregate request count exist only while the mock runs (up to 10 minutes). Stop/expiry releases that configuration and closes connections. There are no history/export endpoints or controls.
- Abuse guards retain aggregate route counters for one-minute windows, without IP addresses or user identifiers. They are service-wide quotas, rather than per-user quotas.
- Existing browser-saved projects, request history, notes and vaults remain under the user's local storage controls. This server policy does not erase intentionally saved browser data.

## External services

Network tools remain available by user choice. Every shared network disclosure states that external API/storage providers control their own retention and this application cannot delete their copies. An intentional S3 upload or database write remains at the selected destination until the user deletes it under that provider's rules. The app does not automatically delete destination objects after uploading them.

## Deployment requirements and limits

Use `node scripts/start-production.mjs`, the Dockerfile's preloaded standalone command, or the bundled desktop backend. Each enables privacy controls before starting Next. The instrumentation hook also applies controls when Next registers its runtime; direct unsupported startup wrappers can emit their own output before registration.

Hosting/CDN/load-balancer/WAF access logs, provider APM, packet captures, TLS termination logs, request-body buffering, OS swap/core dumps and platform backups are outside this repository. Disable them in the existing hosting configuration; use an immutable/read-only application filesystem and disable core dumps. Do not inject APM/Node preload instrumentation. The repository changes do not establish that an existing hosting provider has applied these settings, or erase previously collected provider records. No deployment settings or paid plans were changed in this task.

A fresh process is required to discard any in-memory webhook/mock captures from the previous release. Build-time `.next/trace` files describe compilation and are different from runtime request tracing. The clean production build removes prior local `.next` artifacts; deployment should replace the previous runtime and remove old app-generated logs/caches under the operator's retention policy.

## Verification

`npm run test:server-privacy` exercises no-replay delivery, listener cleanup, input-buffer clearing, aggregate quotas, and silent normal/warning/fatal/rejection paths. `node --import tsx scripts/server-privacy-production.integration.ts` starts an isolated compiled server, verifies private API headers and live-only webhooks, sends an exact file payload to an in-process S3 fixture, and checks for runtime filesystem changes and stdout/stderr output. Fixtures contain generated public data only.

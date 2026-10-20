# API client

Open the canonical `/api-and-web-services/api-request-builder` route. Existing HTTP requests, environments and history remain available above the Collections, gRPC & local mocks section.

## Network modes

The managed HTTP proxy runs on the deployment's Node server and accepts public endpoints under the existing network policy. Native HTTP, gRPC and local mocks require the authenticated localhost runtime. They are unavailable on a public-host deployment.

For local web use, set `MYDEVTOOLS_LOCAL_CONNECTORS=true` and `MYDEVTOOLS_LOCAL_CONNECTOR_TOKEN` to a random access key of at least 32 characters before starting the server. Bind the app to loopback. Enter the key in Desktop / localhost connector access. The key remains in page memory and is not forwarded to target APIs. Requests require the local app's origin and correct access key; a shared limit allows four concurrent connector operations. Never use the public fixture key from integration tests in a real installation.

Native HTTP connects directly to the endpoint. It supports private/loopback services but rejects link-local, unspecified and multicast addresses, including mapped IPv6 forms. It does not read ambient proxy settings, cookies, client certificates or cloud credentials. User-entered cookies and authentication are sent only as explicitly composed. TLS verification remains enabled; custom CA and client certificates can be supplied through the HTTP client's SSL settings. Native limits are 1 MiB per request, 2 MiB per response and 15 seconds. Binary responses use base64 and preserve bytes. Redirect following allows at most five requests, strips cross-origin credentials, blocks HTTPS downgrade and requires manual following across origins with custom TLS credentials. Response cookies are displayed rather than installed in a cookie jar.

## Collection runner

Save HTTP requests in the builder or import a Postman collection. Add requests in the desired order, choose the active environment, transport and iteration count, then run. Add assertions for status, response headers, JSON Pointer values or duration. Operators are equals, contains, exists and less than. Without an explicit matching status assertion, HTTP 200–399 counts as success.

Capture a response value under a variable name and use `{{name}}` in a later request. A JSON Pointer such as `/data/id` reads a nested field; `/items/0/id` reads an array item. Literal `/` and `~` in property names use `~1` and `~0`. Integers outside JavaScript's safe range remain exact strings. Variables reset to the active environment at each iteration; `{{$iteration}}` is the one-based iteration number. Missing variables or captures produce a failed step. Imported test scripts are not executed by the runner.

Plans store request references, assertion/capture rules and iteration settings in the current project. Requests and environments retain their existing storage. Results and captured values remain in page memory. Save plan does not save response data. Export results explicitly downloads requests/responses and can include secrets; review before sharing.

Limits: 50 steps, 10 iterations, 100 requests total, 15 seconds per request, 3 minutes per run, 2 MiB response bytes, 8 MiB retained results, 20 assertions/captures per step and 64 KiB captured variables. Native collection HTTPS uses the bundled trusted CAs; per-request custom certificates are available in the individual HTTP client. Cancellation stops subsequent steps and aborts the in-flight request.

Saved requests now retain text form fields and GraphQL operation/variables. Supported Postman import/export includes raw JSON/XML/text, URL-encoded text, multipart text fields and GraphQL. Folder names are flattened. File references require manual attachment; scripts and auth inheritance are not imported.

## gRPC client

Supply the .proto file and every imported file. Relative filenames can be edited to match import paths; bundled `google/protobuf` types are available. Filesystem/remote imports and server reflection are unavailable. Load schema methods compiles the supplied schema without contacting a gRPC service.

Choose a method, host, port and deadline. TLS verifies the server identity. When connecting to an IP with TLS, specify the certificate's DNS server name because the Node gRPC transport requires DNS SNI. Optional PEM CA, client certificate and private key support private PKI and mTLS. Credentials are not persisted.

Unary/server-streaming calls take one JSON object. Client-streaming/bidirectional calls take an array; the client writes it in order, then half-closes. This is a bounded stream invocation, not an interactive infinite stream. Results collect messages until completion, cancellation or deadline and include the gRPC status, details, initial metadata and trailers. Use decimal strings for exact 64-bit integers and base64 for bytes/binary metadata. Protobuf `Any` is represented by its `type_url` and encoded value rather than expanded `@type` JSON.

Limits: 32 proto files / 256 KiB total, 200 methods, 1 MiB request JSON, 100 input/output messages, 2 MiB aggregate response and 100–15,000 ms deadline. Unknown fields, conflicting oneofs, invalid scalar values and missing proto2 required fields fail before network I/O.

## Local HTTP mocks

Edit the example configuration and start a mock. Copy its base URL and append a configured route path. Routes match exact paths and methods (`*` matches any method); query parameters do not affect matching. Each route sets status, response headers, UTF-8 text body and optional delay. Mocks never proxy upstream requests.

Mocks bind to `127.0.0.1` on an ephemeral port. A random capability prefix protects the URL; keep it private. Browser access allows the owner app origin and up to five explicitly configured origins. Opaque/foreign origins and mismatched Host headers are rejected. Framing, CORS and cookie response headers are runtime-controlled.

Two mocks can run concurrently for at most ten minutes or 1,000 requests each. Each supports 20 routes, 64 KiB text per route / 256 KiB total, and delays up to five seconds. Incoming bodies are bounded to 1 MiB. History holds the last 50 completed requests with up to 32 KiB body preview per request. Configuration, URLs, credentials in received requests and history are runtime memory only. Switching projects hides other projects' mocks but leaves their timers running. Closing the page leaves a mock running until Stop, expiry or runtime shutdown. Stop clears its history and connections.

## Verification

`npm test` includes pure request/runner/proto validation. `scripts/api-client-extensions.integration.ts` exercises real loopback HTTP mocks, exact request bytes, redirects, binary/BOM responses, bounds, cancellation and verified HTTPS/mTLS. `scripts/grpc-connector.integration.ts` exercises all four RPC styles, metadata/trailers, exact long/map/byte values, cancellation/deadlines and TLS/mTLS. `scripts/api-native-production.integration.ts` targets the owned test runtime at port 3100 and verifies native route authorization and actual transports. These use public fixture data, not production credentials.

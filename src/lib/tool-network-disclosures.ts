/** Page-level data boundaries. These describe optional network features, not local parsing. */
export interface ToolNetworkDisclosure {
    title: string;
    purpose: string;
    sentFields: string[];
    handling: string;
    sourceFiles: string[];
}
const proxy = "src/app/api/proxy/route.ts";
const local = "src/app/api/local-connectors/route.ts";
const localHandling = "The authenticated localhost runtime forwards the operation to your service and returns its response. Saved connections use the encrypted project vault; query results remain in page memory.";
const proxyHandling = "Direct mode sends requests from your browser to the target. Proxy mode sends the configured request through this deployment; the target also receives it. Review credentials and payloads before sending.";
const field = "Target URL, configured headers and credentials, and the request payload";
export const TOOL_NETWORK_DISCLOSURES: Record<string, ToolNetworkDisclosure> = {
    "sql-client": {
        title: "Remote database actions send data to your local runtime",
        purpose: "SQLite files are processed locally. PostgreSQL, MySQL and MariaDB connections require the authenticated localhost runtime.",
        sentFields: ["Database host, port, database name, username, password and TLS setting", "SQL statement, parameters, schema requests and mutation permission"],
        handling: localHandling, sourceFiles: [local, "src/lib/sql-connector.ts"],
    },
    "redis-browser": {
        title: "Redis actions send data to your local runtime",
        purpose: "The browser uses the authenticated localhost runtime to connect to Redis.",
        sentFields: ["Redis host, port, database index, ACL username, password and TLS setting", "Scan pattern, cursor, key bytes, command arguments and mutation permission"],
        handling: localHandling, sourceFiles: [local, "src/lib/redis-connector.ts"],
    },
    "data-explorer": {
        title: "Database actions send data to your local runtime",
        purpose: "MongoDB, Firestore and Elasticsearch connections require the authenticated localhost runtime.",
        sentFields: ["Service endpoint, database or project identifiers, authentication credentials and connection settings", "Selected resources, filters, projections, queries and pagination parameters"],
        handling: localHandling, sourceFiles: [local, "src/lib/document-http.ts"],
    },
    "s3-browser": {
        title: "Storage actions send data to your local runtime",
        purpose: "The authenticated localhost runtime signs and forwards requests to your S3-compatible storage service.",
        sentFields: ["Storage endpoint, region, access key, secret key and optional session token", "Bucket, object key, listing filters and uploaded file bytes; delete operations when confirmed"],
        handling: "The storage provider receives the signed operation and any uploaded contents. Downloads return through the localhost runtime. Saved credentials use the encrypted project vault.",
        sourceFiles: [local, "src/lib/s3-connector.ts"],
    },
    "whois-rdap": {
        title: "This action sends data to the server",
        purpose: "Read IANA’s official RDAP directory, find the responsible registry and request its public registration record.",
        sentFields: ["The domain, IP address or IP prefix you enter", "The generated IANA-directory and registry URLs, plus ordinary HTTP metadata"],
        handling: "IANA directory matching identifies the registry. Public-target and redirect checks remain enforced. Lookup data is not logged by this route; providers may log requests.",
        sourceFiles: [proxy, "src/lib/rdap.ts"],
    },
    "dns-lookup": {
        title: "DNS lookups connect directly from your browser",
        purpose: "The selected Cloudflare or Google DNS-over-HTTPS resolver answers the query.",
        sentFields: ["The queried hostname or address, DNS record type and ordinary HTTP metadata"],
        handling: "The selected resolver receives the query and may retain it under its own policies. Results remain in this page; the app server does not relay this lookup.",
        sourceFiles: ["src/app/tools/dns-lookup/page.tsx"],
    },
    "email-validator": {
        title: "Optional MX lookup connects directly from your browser",
        purpose: "Email syntax checks are local. The optional MX diagnostic queries the selected DNS-over-HTTPS resolver.",
        sentFields: ["The email domain only, MX queries and fallback A/AAAA queries; the mailbox name is not sent"],
        handling: "Cloudflare or Google receives the domain query and may retain it under its own policies. This diagnostic does not contact the mailbox or prove delivery.",
        sourceFiles: ["src/lib/email-mx.ts"],
    },
    "token-counter": {
        title: "Optional provider counting sends text to the provider",
        purpose: "Local estimates stay in your browser. Provider counting calls the selected provider directly only when requested.",
        sentFields: ["Input text, selected model identifier and your provider API key"],
        handling: "OpenAI, Anthropic or Google receives the counting request under its own policies. The app server does not relay it; the provider key stays in page memory.",
        sourceFiles: ["src/lib/provider-token-count.ts"],
    },
    "websocket-tester": {
        title: "WebSocket connections go directly to your server",
        purpose: "The browser opens a WebSocket connection to the URL you enter.",
        sentFields: ["WebSocket URL and subprotocols, messages you send, and browser-controlled handshake metadata"],
        handling: "The destination receives the connection and messages, including cookies the browser permits. Traffic does not pass through the app proxy; received messages remain in page memory.",
        sourceFiles: ["src/app/tools/websocket-tester/page.tsx"],
    },
    "rag-search": {
        title: "Model loading downloads assets from external hosts",
        purpose: "Semantic search downloads embedding model files from Hugging Face before computing embeddings in your browser. The inference runtime is bundled locally.",
        sentFields: ["Model asset requests with ordinary HTTP metadata; document text and search queries are not uploaded"],
        handling: "Asset hosts receive download requests and may cache or log them. Documents, embeddings and search queries are processed locally in page memory.",
        sourceFiles: ["src/app/tools/rag-search/page.tsx"],
    },
    "a2a-inspector": {
        title: "Agent requests can use your browser or the server proxy",
        purpose: "Discovery, messages and streams contact the configured agent. Proxy mode and CORS fallback use this deployment's server routes.",
        sentFields: [field, "Agent discovery URLs, message parts, task identifiers and stream requests"],
        handling: proxyHandling, sourceFiles: [proxy, "src/app/api/proxy-stream/route.ts", "src/lib/a2a-protocol.ts"],
    },
    "soap-client": {
        title: "SOAP requests can use your browser or the server proxy",
        purpose: "Sending a SOAP envelope contacts your service. Proxy mode or a CORS fallback passes the request through this deployment.",
        sentFields: [field, "SOAPAction, XML envelope and configured TLS certificates or keys when proxying"],
        handling: proxyHandling, sourceFiles: [proxy, "src/app/tools/soap-client/page.tsx"],
    },
    "wsdl-parser": {
        title: "URL loading can use your browser or the server proxy",
        purpose: "Pasted and uploaded WSDL parsing is local. Loading a WSDL URL or explicitly loading an external schema contacts that server, with optional proxy fallback.",
        sentFields: ["WSDL and imported schema URLs, configured request headers and credentials"],
        handling: proxyHandling, sourceFiles: [proxy, "src/app/tools/wsdl-parser/page.tsx"],
    },
    "cors-tester": {
        title: "CORS tests send requests directly to your target",
        purpose: "The browser sends the configured request so you can inspect the response and browser CORS behavior.",
        sentFields: [field, "Browser-controlled Origin and preflight headers; same-origin cookies permitted by browser defaults"],
        handling: "The target may receive a preflight or actual request even when browser CORS rules prevent this page from reading a response. This test does not use the app server proxy.",
        sourceFiles: ["src/app/tools/cors-tester/page.tsx"],
    },
    "swagger-ui": {
        title: "API execution can send requests from your browser",
        purpose: "Parsing a pasted or uploaded specification is local. Swagger UI can contact API servers when you use its request controls.",
        sentFields: ["API server URL, operation parameters, authorization values, headers and request body you configure"],
        handling: "API servers receive requests under their own policies. Third-party Swagger UI may also resolve external specification references. Review the specification and destination before executing requests.",
        sourceFiles: ["src/app/tools/swagger-ui/page.tsx"],
    },
};

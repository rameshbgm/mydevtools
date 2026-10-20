// SEO content database for all tools.
// Each entry is hand-crafted with:
//   - title: 50–65 chars, leads with primary keyword + value props
//   - description: 145–160 chars, keyword-rich, includes CTA/value prop
//   - keywords: long-tail + intent-matched search terms (primary + variants)
//   - h1: optional, used as on-page heading override
//   - faq: optional structured FAQ entries (good for AI/Google FAQ rich results)

export interface ToolSeoContent {
    title: string;
    description: string;
    keywords: string[];
    h1?: string;
    faq?: { q: string; a: string }[];
}

export const SITE_NAME = "mydevtools";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mydevtools.com").replace(/\/+$/, "");
export const SITE_TAGLINE = "Free Online Developer Tools — Client-Side by Default";
export const SITE_DESCRIPTION =
    "Free, privacy-first developer tools. Format, validate, convert, inspect and debug locally by default. Network tools disclose what they send. No signup or tracking.";

export const SEO_CONTENT: Record<string, ToolSeoContent> = {
    "data-explorer": { title: "Document Data Explorer \u2014 My Dev Tools", description: "Browse and query MongoDB, Firestore and Elasticsearch with encrypted saved connections and type-aware exports", keywords: ["mongodb", "firestore", "elasticsearch", "nosql", "documents"] },
    "s3-browser": { title: "S3 Storage Browser \u2014 My Dev Tools", description: "Browse S3-compatible buckets, prefixes and object metadata; transfer files with encrypted saved connections", keywords: ["s3", "storage", "bucket", "object", "aws"] },
    "code-screenshot": { title: "Code Screenshot \u2014 My Dev Tools", description: "Create syntax-highlighted code images with themes, backgrounds, window controls and real PNG export", keywords: ["code", "screenshot", "syntax", "png", "snippet"] },
    "docker-compose-generator": { title: "Docker Compose Generator \u2014 My Dev Tools", description: "Configure a local stack with service starters, ports, named volumes, environment variables and dependencies", keywords: ["docker", "compose", "containers", "yaml", "stack"] },
    "json-visualizer": { title: "JSON Graph Visualizer \u2014 My Dev Tools", description: "Explore JSON with pan, zoom, branch collapse, path search, array tables and SVG/PNG export", keywords: ["json", "graph", "visualizer", "tree", "jsonpath"] },
    "css-generators": { title: "CSS Visual Builders \u2014 My Dev Tools", description: "Design multi-layer shadows, elliptical radii, fluid typography and configurable gradients with live previews", keywords: ["css", "shadow", "radius", "fluid", "gradient"] },
    "user-agent-parser": { title: "User-Agent & Client Hints Parser \u2014 My Dev Tools", description: "Inspect reported browser, OS, engine, device and CPU details locally", keywords: ["useragent", "browser", "device", "client hints", "cpu"] },
    "whois-rdap": { title: "Domain & IP Registration (RDAP) \u2014 My Dev Tools", description: "Look up public domain/IP registration, registrars, events, statuses and nameservers", keywords: ["rdap", "whois", "domain", "ip", "registration"] },
    "redis-browser": { title: "Redis Browser \u2014 My Dev Tools", description: "Scan keys, inspect typed values and run bounded Redis commands with encrypted saved connections", keywords: ["redis", "cache", "keys", "database", "commands"] },
    "gitignore-generator": { title: ".gitignore Generator \u2014 My Dev Tools", description: "Combine stack, editor and operating-system ignore patterns with custom overrides", keywords: ["gitignore", "git", "ignore", "templates"] },
    "keycode-inspector": { title: "Keyboard Event Inspector \u2014 My Dev Tools", description: "Inspect key, code, modifiers, locations and browser keyboard event history", keywords: ["keyboard", "key", "keycode", "events"] },
    "sql-client": { title: "SQL Database Workspace \u2014 My Dev Tools", description: "Query SQLite files locally and connect to PostgreSQL, MySQL and MariaDB with encrypted saved connections", keywords: ["sql", "database", "postgresql", "mysql", "mariadb", "sqlite"] },
    "json-schema-generator": { title: "JSON Schema & Model Generator \u2014 My Dev Tools", description: "Infer JSON Schema from sample data and generate typed models for nine languages", keywords: ["schema", "json", "python", "go", "rust", "csharp", "kotlin", "swift", "dart", "models"] },
    "unit-converter": { title: "Scientific Unit Converter \u2014 My Dev Tools", description: "Convert physical, electrical, thermal and engineering quantities with explicit unit definitions", keywords: ["units", "scientific", "engineering", "temperature"] },
    "timezone-planner": { title: "Timezone Planner \u2014 My Dev Tools", description: "Compare meeting times, UTC offsets, date shifts and working hours across IANA timezones", keywords: ["timezone", "meeting", "dst", "time"] },
    "totp-generator": { title: "TOTP Generator \u2014 My Dev Tools", description: "Generate local RFC 6238 authenticator codes with configurable time-step and public test vectors", keywords: ["totp", "mfa", "2fa", "authenticator"] },
    "resource-bookmarks": { title: "Resource Bookmarks \u2014 My Dev Tools", description: "Organize project documentation, repositories and external links", keywords: ["bookmark", "url", "resource"] },
    "code-snippets": { title: "Code Snippets \u2014 My Dev Tools", description: "Save, search, format and copy project code snippets with syntax highlighting", keywords: ["snippet", "code", "library"] },
    "secure-files": { title: "Secure Files \u2014 My Dev Tools", description: "Encrypt file contents and metadata locally with portable backups", keywords: ["file", "vault", "encrypted", "backup"] },
    "credential-vault": { title: "Credential Vault \u2014 My Dev Tools", description: "Encrypt passwords, API keys, environment variables and saved connections locally", keywords: ["vault", "password", "secret", "encrypted"] },
    "tool-workbench": { title: "Tool Tabs \u2014 My Dev Tools", description: "Keep multiple tools open, switch and reorder tabs without losing input", keywords: ["tabs", "workspace", "multitask"] },
    "project-workspaces": { title: "Project Workspaces \u2014 My Dev Tools", description: "Keep project notes, snippets, workflows and connections separate", keywords: ["project", "workspace", "isolation"] },
    "saved-workflows": { title: "Saved Developer Workflows — Local Tool Pipelines", description: "Chain decoding, JSON formatting, extraction, redaction, comparison and hashing locally. Save reusable steps and optional fixtures on your device.", keywords: ["developer workflow", "pipeline", "recipe", "local tools"] },
    "har-log-redactor": { title: "HAR & Log Redactor — Private Developer Tools", description: "Redact credentials and custom fields from HAR, JSON, and logs locally.", keywords: ["har", "redaction", "logs", "privacy"] },
    "trace-context-inspector": { title: "Trace Context Inspector — Private Developer Tools", description: "Inspect and generate W3C traceparent and tracestate headers.", keywords: ["trace", "w3c", "headers", "observability"] },
    "webhook-signature-debugger": { title: "Webhook Signature Debugger — Private Developer Tools", description: "Verify GitHub, Stripe, Slack, and HMAC webhook signatures locally.", keywords: ["webhook", "signature", "hmac", "verify"] },

    // ===== Formatters =====
    "json-formatter": {
        title: "JSON Formatter & Validator — Beautify, Minify, Tree View Online",
        description:
            "Free online JSON formatter, prettifier, minifier and validator. Beautify messy JSON, fix errors, copy formatted output instantly. 100% private — runs in your browser.",
        keywords: [
            "json formatter",
            "json beautifier",
            "json prettifier",
            "json minifier",
            "json validator online",
            "format json online",
            "json pretty print",
            "online json viewer",
            "json indenter",
            "json tree viewer",
        ],
    },
    "xml-formatter": {
        title: "XML Formatter & Beautifier Online — Pretty Print and Validate XML",
        description:
            "Beautify, format and validate XML documents instantly. Pretty-print messy XML, fix indentation, detect syntax errors. Free, fast and runs entirely client-side.",
        keywords: [
            "xml formatter",
            "xml beautifier",
            "xml pretty print",
            "format xml online",
            "xml indenter",
            "xml prettifier",
            "online xml viewer",
            "xml validator",
        ],
    },
    "sql-formatter": {
        title: "SQL Formatter Online — Beautify SQL Queries (MySQL, PostgreSQL, MSSQL)",
        description:
            "Format and beautify SQL queries online for MySQL, PostgreSQL, SQL Server, Oracle and SQLite. Standardize indentation, keywords and case. Free, no signup.",
        keywords: [
            "sql formatter",
            "sql beautifier",
            "format sql online",
            "sql pretty print",
            "mysql formatter",
            "postgresql formatter",
            "tsql formatter",
            "sql query formatter",
            "sql indenter",
        ],
    },
    "html-formatter": {
        title: "HTML Formatter & Beautifier — Pretty Print HTML Online (Free)",
        description:
            "Beautify and format HTML markup instantly. Customize indentation, wrap long lines, clean up minified HTML. Free, private, runs locally in your browser.",
        keywords: [
            "html formatter",
            "html beautifier",
            "format html online",
            "html prettifier",
            "html pretty print",
            "html indenter",
            "online html beautifier",
        ],
    },
    "js-formatter": {
        title: "JavaScript Formatter & Beautifier — Beautify and Minify JS Online",
        description:
            "Beautify, format and minify JavaScript code online. Configurable indent, line length and braces. Works with ES6+, JSX. Free and 100% client-side.",
        keywords: [
            "javascript formatter",
            "js beautifier",
            "javascript beautifier",
            "format javascript online",
            "js minifier",
            "javascript pretty print",
            "es6 formatter",
            "jsx formatter",
        ],
    },
    "css-formatter": {
        title: "CSS Formatter & Minifier Online — Beautify CSS Stylesheets",
        description:
            "Beautify and minify CSS stylesheets in seconds. Auto-indent rules, sort properties, handle vendor prefixes. Free CSS formatter that works offline in your browser.",
        keywords: [
            "css formatter",
            "css beautifier",
            "css minifier",
            "format css online",
            "css pretty print",
            "css indenter",
            "minify css",
            "stylesheet formatter",
        ],
    },

    // ===== Validators =====
    "json-validator": {
        title: "JSON Validator Online — Check JSON Syntax with Error Line Numbers",
        description:
            "Validate JSON syntax instantly with detailed error messages, line numbers and column positions. Catch missing commas, unquoted keys and bad escapes. Free.",
        keywords: [
            "json validator",
            "validate json online",
            "json syntax checker",
            "json linter",
            "json error checker",
            "json schema validator",
            "check json",
            "json parser online",
        ],
    },
    "xml-validator": {
        title: "XML Validator Online — Check XML Well-Formedness & Syntax Errors",
        description:
            "Validate XML documents for syntax errors and well-formedness. Pinpoint malformed tags, mismatched elements and invalid characters. Free, instant and private.",
        keywords: [
            "xml validator",
            "validate xml online",
            "xml syntax checker",
            "xml well-formed checker",
            "xml linter",
            "check xml",
            "xml parser online",
        ],
    },
    "html-validator": {
        title: "HTML Validator Online — Check HTML Markup for Errors",
        description:
            "Validate HTML markup for syntax errors, unclosed tags and accessibility issues. Free online HTML validator with line-level error reporting.",
        keywords: [
            "html validator",
            "validate html online",
            "html syntax checker",
            "html linter",
            "check html",
            "html error checker",
            "html5 validator",
        ],
    },
    "xsd-validator": {
        title: "XSD Declaration Inspector — XML Root and Namespace Checks",
        description:
            "Inspect XSD declarations locally and check XML well-formedness, the declared root name and root namespace. Full XSD conformance is not validated.",
        keywords: [
            "xsd declaration inspector",
            "xml well-formedness checker",
            "xml root name check",
            "xsd namespace checker",
            "inspect xml schema",
        ],
        faq: [
            { q: "Does this tool perform full XSD validation?", a: "No. It inspects XSD declarations and checks XML well-formedness, the declared root name and the root namespace. Child content, datatypes, cardinality and required attributes are not validated. Use a full XSD validator such as Xerces or libxml2 to establish schema conformance." },
            { q: "Why can the datatype-error example pass the basic checks?", a: "The example keeps the expected root name and namespace. Its invalid field values and missing child content are outside these basic checks, so a result with no root/XML errors does not mean the XML conforms to the XSD." },
        ],
    },
    "credit-card-validator": {
        title: "Credit Card Validator (Luhn) — Generate Test Card Numbers Free",
        description:
            "Check card-number length and Luhn checksums locally. View prefix-based brand hints and generate synthetic format fixtures; no account lookup or payment is performed.",
        keywords: [
            "credit card validator",
            "luhn algorithm checker",
            "credit card number validator",
            "test credit card numbers",
            "fake card number generator",
            "visa test card",
            "card brand detector",
            "luhn validator",
        ],
    },
    "regex-tester": {
        title: "Regex Tester & Debugger — Test Regular Expressions Online",
        description:
            "Test, debug and visualize regular expressions in real time. Live match highlighting, capture groups, flags and replacement preview. Free regex playground.",
        keywords: [
            "regex tester",
            "regular expression tester",
            "regex debugger",
            "regex playground",
            "regex online",
            "test regex",
            "javascript regex tester",
            "regex match online",
            "regex101 alternative",
        ],
    },
    "xpath-tester": {
        title: "XPath Tester Online — Evaluate XPath Expressions Against XML",
        description:
            "Test and evaluate XPath 1.0 and 2.0 expressions against XML documents. See matching nodes, attribute values and computed results instantly. Free and private.",
        keywords: [
            "xpath tester",
            "xpath evaluator",
            "test xpath online",
            "xpath query tool",
            "xpath playground",
            "xpath expression tester",
            "xml query online",
        ],
    },

    // ===== Diff & Compare =====
    "json-diff": {
        title: "JSON Diff Tool — Compare Two JSON Files Side-by-Side Online",
        description:
            "Compare two JSON documents side-by-side with semantic diff highlighting. Spot added, removed and changed keys. Free online JSON compare tool — no upload.",
        keywords: [
            "json diff",
            "compare json",
            "json compare online",
            "json difference",
            "json diff tool",
            "diff two json",
            "json comparator",
            "semantic json diff",
        ],
    },
    "xml-diff": {
        title: "XML Diff Tool — Compare XML Documents with Visual Diff Online",
        description:
            "Compare two XML files side-by-side with line-by-line diff highlighting. Identify changed elements, attributes and text content. Free, private XML compare tool.",
        keywords: [
            "xml diff",
            "compare xml online",
            "xml comparator",
            "xml difference tool",
            "diff two xml",
            "xml compare",
            "xml change detector",
        ],
    },
    "text-diff": {
        title: "Text Diff Tool — Compare Two Text Blocks Online (Free)",
        description:
            "Compare two blocks of text side-by-side with line-by-line diff highlighting. Spot insertions, deletions and edits instantly. Free, no signup, fully private.",
        keywords: [
            "text diff",
            "text comparison",
            "compare text online",
            "diff text",
            "text difference checker",
            "string diff",
            "side by side text compare",
            "free text diff",
        ],
    },

    // ===== Data Converters =====
    "xml-to-json": {
        title: "XML to JSON Converter Online — Convert XML to JSON Free",
        description:
            "Convert XML documents to JSON in one click. Configurable attribute prefixes, array handling and namespace stripping. Free, instant and 100% client-side.",
        keywords: [
            "xml to json",
            "convert xml to json",
            "xml to json converter",
            "xml json transformer",
            "online xml to json",
            "xml2json",
            "xml json conversion",
        ],
    },
    "json-to-xml": {
        title: "JSON to XML Converter — Convert JSON to XML Online (Free)",
        description:
            "Convert JSON objects and arrays to well-formed XML instantly. Custom root element, attribute prefixes and pretty-printed output. Free, private converter.",
        keywords: [
            "json to xml",
            "convert json to xml",
            "json to xml converter",
            "json xml transformer",
            "online json to xml",
            "json2xml",
            "json xml conversion",
        ],
    },
    "csv-to-json": {
        title: "CSV to JSON Converter Online — Convert CSV Spreadsheet to JSON",
        description:
            "Convert CSV data to JSON arrays or objects in seconds. Auto-detect headers, custom delimiters, quote handling and type inference. Free CSV to JSON tool.",
        keywords: [
            "csv to json",
            "convert csv to json",
            "csv to json converter",
            "csv json transformer",
            "spreadsheet to json",
            "online csv to json",
            "csv2json",
        ],
    },
    "csv-to-xml": {
        title: "CSV to XML Converter — Convert Spreadsheet Data to XML Online",
        description:
            "Transform CSV data into XML with customizable root, row and field element names. Auto-detect headers, custom delimiters. Free, fast, fully client-side.",
        keywords: [
            "csv to xml",
            "convert csv to xml",
            "csv to xml converter",
            "csv xml transformer",
            "spreadsheet to xml",
            "csv2xml",
        ],
    },
    "yaml-json-converter": {
        title: "YAML ↔ JSON Converter Online — Bidirectional YAML JSON Tool",
        description:
            "Convert YAML to JSON and JSON to YAML bidirectionally. Preserve comments, anchors and types. Perfect for Kubernetes, Docker Compose and CI/CD configs.",
        keywords: [
            "yaml to json",
            "json to yaml",
            "yaml json converter",
            "convert yaml online",
            "yaml2json",
            "json2yaml",
            "yaml parser online",
            "kubernetes yaml converter",
        ],
    },
    "xslt-transformer": {
        title: "XSLT Transformer Online — Apply XSLT Stylesheets to XML",
        description:
            "Transform XML documents using XSLT 1.0 stylesheets in your browser. Preview output as HTML, XML or text. Free XSLT processor with no upload required.",
        keywords: [
            "xslt transformer",
            "xslt online",
            "xslt processor",
            "apply xslt",
            "xml transform",
            "xsl transform online",
            "xslt 1.0 tool",
            "xslt playground",
        ],
    },

    // ===== Encoding & Decoding =====
    base64: {
        title: "Base64 Encoder & Decoder Online — Encode/Decode Base64 Free",
        description:
            "Encode and decode Base64 strings instantly. Supports text, binary, URL-safe Base64, and file uploads. Free, fast and runs locally — no data uploaded.",
        keywords: [
            "base64 encoder",
            "base64 decoder",
            "base64 online",
            "encode base64",
            "decode base64",
            "base64 converter",
            "url-safe base64",
            "base64 to text",
            "text to base64",
            "base64 file encoder",
            "decode base64 string",
        ],
        faq: [
            { q: "What is Base64 encoding?", a: "Base64 is a binary-to-text encoding that represents binary data using 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It is commonly used to embed binary data (images, files) inside JSON, HTML, emails, and HTTP headers." },
            { q: "What is URL-safe Base64?", a: "URL-safe Base64 replaces + with - and / with _, producing strings that can be safely used in URLs and filenames without percent-encoding. JWTs use URL-safe Base64 without padding." },
            { q: "Does Base64 encrypt my data?", a: "No. Base64 is an encoding, not encryption. Anyone with the encoded string can instantly decode it. Use AES or other encryption if you need to protect sensitive data." },
        ],
    },
    "url-encoder": {
        title: "URL Encoder & Decoder Online — Percent Encode URI Components",
        description:
            "Encode and decode URLs and URI components with proper percent-encoding. Handles query strings, paths and special characters. Free and private.",
        keywords: [
            "url encoder",
            "url decoder",
            "uri encoder",
            "percent encoding",
            "encode url online",
            "decode url online",
            "encodeuricomponent",
            "url escape",
        ],
    },
    "html-entities": {
        title: "HTML Entities Encoder & Decoder — Escape HTML Special Characters",
        description:
            "Encode HTML special characters to entities (&amp;, &lt;, &gt;, &quot;) and decode entities back to text. Prevents XSS, fixes display bugs. Free.",
        keywords: [
            "html entities encoder",
            "html entities decoder",
            "encode html",
            "decode html entities",
            "html escape",
            "html unescape",
            "html special characters",
            "xss prevention",
        ],
    },
    "unicode-converter": {
        title: "Unicode Converter — Encode Text to Unicode Escapes & UTF-8 Hex",
        description:
            "Convert text to and from Unicode escape sequences (\\uXXXX), code points (U+XXXX) and UTF-8 hex bytes. Inspect and decode any Unicode string instantly.",
        keywords: [
            "unicode converter",
            "unicode escape",
            "utf-8 encoder",
            "utf8 to text",
            "code point converter",
            "unicode escape sequences",
            "unicode decoder",
            "string to unicode",
        ],
    },
    "gzip-tools": {
        title: "Gzip Compress & Decompress Online — Gzip + Base64 Tool",
        description:
            "Compress and decompress text using Gzip with Base64-encoded output. Reduce payload size for storage and transmission. Free, instant and client-side.",
        keywords: [
            "gzip online",
            "gzip compress",
            "gzip decompress",
            "compress text gzip",
            "gzip base64",
            "deflate online",
            "gzip encoder",
        ],
    },
    "string-escape": {
        title: "String Escape Tool — Escape JSON, XML, HTML, JS, SQL, CSV Strings",
        description:
            "Escape and unescape strings for JSON, XML, HTML, JavaScript, SQL and CSV contexts. Prevent injection bugs and broken parsing. Free, fast string escape tool.",
        keywords: [
            "string escape",
            "string unescape",
            "json escape",
            "xml escape",
            "html escape",
            "javascript escape",
            "sql escape",
            "csv escape",
            "escape special characters",
        ],
    },

    // ===== Cryptography =====
    "hash-generator": {
        title: "Hash Generator — MD5, SHA-2, Keccak & RIPEMD-160",
        description:
            "Generate text hashes with MD5, SHA-1, SHA-2, Keccak and RIPEMD-160 locally. CryptoJS Keccak outputs are distinct from standardized SHA-3.",
        keywords: [
            "hash generator",
            "md5 generator",
            "sha-256 generator",
            "sha256 hash online",
            "sha-512 hash",
            "keccak hash",
            "ripemd-160 generator",
            "checksum calculator",
            "online hash tool",
            "message digest",
        ],
    },
    "hmac-generator": {
        title: "HMAC Generator Online — HMAC-SHA1, SHA-256, SHA-384, SHA-512",
        description:
            "Generate HMAC signatures with SHA-1, SHA-256, SHA-384 or SHA-512. Sign API requests, verify webhooks, build authentication tokens. Free HMAC tool.",
        keywords: [
            "hmac generator",
            "hmac sha256",
            "hmac sha512",
            "hmac calculator online",
            "hmac signature",
            "api signature generator",
            "webhook signature",
            "hmac sha1",
            "hash mac",
        ],
    },
    "jwt-decoder": {
        title: "JWT Decoder — Decode and Inspect JSON Web Tokens Online",
        description:
            "Decode JSON Web Tokens (JWT) to inspect header, payload and signature. View claims, expiration and algorithm. Free JWT debugger — never sends tokens.",
        keywords: [
            "jwt decoder",
            "decode jwt online",
            "jwt debugger",
            "jwt parser",
            "jwt inspector",
            "json web token decoder",
            "jwt viewer",
            "jwt.io alternative",
        ],
    },
    "jws-tool": {
        title: "JWS Sign & Verify — Generate JSON Web Signatures Online",
        description:
            "Create and verify JSON Web Signatures (JWS) with HS256, RS256, RS512, ES256 and ES512 algorithms. Free, secure JOSE tooling that runs in your browser.",
        keywords: [
            "jws tool",
            "jws sign",
            "jws verify",
            "json web signature",
            "jose tool",
            "jws generator",
            "rs256 sign",
            "es256 sign",
            "hmac jws",
        ],
    },
    "jwe-tool": {
        title: "JWE Encrypt & Decrypt — JSON Web Encryption Tool Online",
        description:
            "Encrypt and decrypt data with JSON Web Encryption (JWE) using RSA-OAEP, AES-GCM and AES-KW algorithms. Free, secure JOSE encryption playground.",
        keywords: [
            "jwe tool",
            "jwe encrypt",
            "jwe decrypt",
            "json web encryption",
            "jose encryption",
            "rsa-oaep jwe",
            "aes-gcm jwe",
            "encrypt jwt",
        ],
    },
    "jwk-generator": {
        title: "JWK Generator Online — Generate JSON Web Keys (RSA, EC, oct)",
        description:
            "Generate JSON Web Keys (JWK) for RSA, EC (P-256, P-384, P-521) and symmetric (oct) algorithms. Includes JWKS export. Free, runs entirely in browser.",
        keywords: [
            "jwk generator",
            "json web key generator",
            "rsa jwk",
            "ec jwk",
            "jwks generator",
            "jose key generator",
            "oct key generator",
            "jwk online",
        ],
    },

    // ===== Certificates & Keys =====
    "certificate-decoder": {
        title: "X.509 Certificate Decoder — Inspect PEM, DER, CRT Online",
        description:
            "Decode X.509 SSL/TLS certificates in PEM, DER, CRT or CER format. View subject, issuer, validity, SANs, key usage and extensions. Free certificate parser.",
        keywords: [
            "certificate decoder",
            "x509 decoder",
            "ssl certificate decoder",
            "pem decoder",
            "der decoder",
            "crt decoder",
            "certificate parser",
            "tls certificate viewer",
            "x.509 inspector",
        ],
    },
    "certificate-generator": {
        title: "Self-Signed Certificate Generator — Free SSL Cert for Dev/Testing",
        description:
            "Generate self-signed X.509 certificates for development, testing and local HTTPS. Custom subject, SANs, validity period, key size. Free, browser-based.",
        keywords: [
            "self-signed certificate generator",
            "x509 generator",
            "ssl certificate generator",
            "dev certificate",
            "localhost https certificate",
            "openssl alternative",
            "create test certificate",
        ],
    },
    "csr-generator": {
        title: "CSR Generator — Create Certificate Signing Requests Online",
        description:
            "Generate Certificate Signing Requests (CSR) for SSL/TLS certificates. Custom subject, SANs, RSA/ECDSA keys. Output PEM CSR + private key. Free.",
        keywords: [
            "csr generator",
            "create csr",
            "certificate signing request",
            "ssl csr generator",
            "tls csr",
            "online csr tool",
            "pem csr generator",
            "openssl csr alternative",
        ],
    },
    "certificate-converter": {
        title: "Certificate Converter — PEM, DER, PFX, P12, P7B, CRT, CER",
        description:
            "Convert SSL/TLS certificates between PEM, DER, PFX/P12, P7B, CRT and CER formats. Free, browser-based certificate format converter — no upload.",
        keywords: [
            "certificate converter",
            "pem to der",
            "der to pem",
            "pem to pfx",
            "pfx to pem",
            "p7b converter",
            "p12 converter",
            "crt to pem",
            "ssl certificate format converter",
        ],
    },
    "certificate-chain-validator": {
        title: "Certificate Chain Validator — Verify SSL Trust Chain Online",
        description:
            "Validate SSL/TLS certificate chains. Verify trust hierarchy from leaf to root CA, check issuer matches, expiry and signatures. Free chain checker.",
        keywords: [
            "certificate chain validator",
            "ssl chain checker",
            "trust chain verifier",
            "certificate hierarchy",
            "intermediate certificate validator",
            "ca chain validator",
            "verify ssl chain",
        ],
    },
    "pem-parser": {
        title: "PEM Parser & Viewer — Decode PEM Certificates, Keys, CSRs",
        description:
            "Parse and view PEM-encoded certificates, private keys, public keys and CSRs. Inspect Base64 contents and decoded ASN.1 structure. Free PEM parser.",
        keywords: [
            "pem parser",
            "pem decoder",
            "pem viewer",
            "decode pem online",
            "pem inspector",
            "certificate pem viewer",
            "private key pem parser",
        ],
    },
    "pkcs12-tool": {
        title: "PKCS#12 / PFX Tool — Create, Extract & Convert P12 Files",
        description:
            "Create, extract and convert PKCS#12 (.pfx/.p12) keystores containing certificates and private keys. Password-protected, free and runs entirely client-side.",
        keywords: [
            "pkcs12 tool",
            "pfx creator",
            "p12 extractor",
            "pkcs12 to pem",
            "pem to pkcs12",
            "pfx converter",
            "keystore converter",
            "openssl pkcs12 alternative",
        ],
    },
    "jks-tool": {
        title: "Java KeyStore Helper — PKCS#12 Builder & keytool Commands",
        description:
            "Build PKCS#12 files from PEM certificates and keys locally. Prepare keytool commands for Java keystore conversion and inspection on your machine.",
        keywords: [
            "jks tool",
            "java keystore tool",
            "java keytool commands",
            "pkcs12 builder",
            "jks command helper",
            "jks to pkcs12",
            "pkcs12 to jks",
            "java truststore tool",
        ],
    },
    "ssl-checker": {
        title: "SSL/TLS Certificate Checker — Test HTTPS Domain Certificates",
        description:
            "Check any HTTPS domain's SSL/TLS certificate online. Inspect expiry, chain, supported protocols, ciphers and common vulnerabilities. Free SSL test.",
        keywords: [
            "ssl checker",
            "tls checker",
            "ssl certificate check",
            "https check",
            "ssl test online",
            "certificate expiry checker",
            "tls cipher checker",
            "ssl scan",
        ],
    },
    "key-pair-generator": {
        title: "Key Pair Generator — RSA, ECDSA, Ed25519 Keys (PEM Output)",
        description:
            "Generate RSA, ECDSA and Ed25519 key pairs locally in PEM or JWK format. Export public and private keys; unsupported browser algorithms fail explicitly.",
        keywords: [
            "key pair generator",
            "rsa key generator",
            "ecdsa key generator",
            "ed25519 key generator",
            "generate private key",
            "generate public key",
            "pem key generator",
            "crypto key generator",
        ],
    },
    "ssh-key-generator": {
        title: "SSH Key Generator — Generate RSA, ECDSA, Ed25519 SSH Keys",
        description:
            "Generate RSA, ECDSA and Ed25519 SSH keys locally in OpenSSH format, with SHA-256 fingerprints. Private exports are unencrypted; add a passphrase locally with ssh-keygen.",
        keywords: [
            "ssh key generator",
            "generate ssh key",
            "ed25519 ssh key",
            "rsa ssh key",
            "ecdsa ssh key",
            "openssh key generator",
            "github ssh key generator",
            "ssh-keygen online",
        ],
    },
    "certificate-fingerprint": {
        title: "Certificate Fingerprint Calculator — MD5, SHA-1, SHA-256",
        description:
            "Calculate MD5, SHA-1 and SHA-256 fingerprints of X.509 certificates for verification, pinning and trust comparison. Free certificate fingerprint tool.",
        keywords: [
            "certificate fingerprint",
            "ssl fingerprint",
            "sha256 fingerprint",
            "sha-1 fingerprint",
            "md5 fingerprint",
            "certificate hash calculator",
            "ssl pinning fingerprint",
        ],
    },

    // ===== API & Web Services =====
    "swagger-ui": {
        title: "Swagger / OpenAPI Viewer — Interactive API Docs from YAML/JSON",
        description:
            "Paste an OpenAPI 3.0 / Swagger 2.0 spec (YAML or JSON) and get interactive, browsable API documentation. Try endpoints right in the browser. Free.",
        keywords: [
            "swagger ui",
            "openapi viewer",
            "swagger viewer",
            "openapi docs",
            "api documentation viewer",
            "swagger ui online",
            "openapi 3.0 viewer",
            "swagger renderer",
        ],
    },
    "api-request-builder": {
        title: "API Client — HTTP, gRPC, Collection Runner & Local Mocks",
        description:
            "Build HTTP requests, run collections with response captures and assertions, and use authenticated localhost gRPC and temporary HTTP mock servers.",
        keywords: [
            "api request builder",
            "rest api tester",
            "http request builder",
            "online postman alternative",
            "test api online",
            "curl builder",
            "api client online",
            "rest client",
            "grpc client",
            "api collection runner",
            "local mock server",
        ],
    },
    "json-path-tester": {
        title: "JSONPath & JMESPath Tester — Query JSON Online",
        description:
            "Query JSON with JSONPath or JMESPath. Preview arrays, objects and scalars, try examples and preserve precision-sensitive input numbers as text.",
        keywords: [
            "jsonpath tester",
            "jsonpath evaluator",
            "test jsonpath online",
            "jsonpath playground",
            "jsonpath query",
            "jsonpath expression tester",
            "json query tool",
        ],
    },
    "url-parser": {
        title: "URL Parser & Analyzer — Break Down URLs into Components",
        description:
            "Parse any URL into protocol, host, port, path, query and fragment. Decode query strings into key-value pairs. Free, instant URL analyzer tool.",
        keywords: [
            "url parser",
            "url analyzer",
            "parse url online",
            "url breakdown",
            "query string parser",
            "url components",
            "url decoder tool",
        ],
    },
    "wsdl-parser": {
        title: "WSDL Parser & Viewer — Inspect SOAP Service Definitions Online",
        description:
            "Parse and visualize WSDL files. View services, ports, operations, messages and types. Generate SOAP request templates. Free WSDL inspector tool.",
        keywords: [
            "wsdl parser",
            "wsdl viewer",
            "wsdl inspector",
            "soap wsdl tool",
            "parse wsdl online",
            "wsdl operations viewer",
            "wsdl analyzer",
        ],
    },
    "soap-client": {
        title: "SOAP Client Online — Test SOAP Web Services in Browser",
        description:
            "Test SOAP web services online. Generate request envelopes from WSDL, set headers, send requests and inspect XML responses. Free SOAP testing tool.",
        keywords: [
            "soap client online",
            "soap tester",
            "test soap api",
            "online soap client",
            "soapui alternative",
            "soap request builder",
            "wsdl soap tester",
        ],
    },

    // ===== Network =====
    "ip-address-tools": {
        title: "IP Address Tools — Validate, Parse & Convert IPv4 / IPv6",
        description:
            "Validate, parse and convert IPv4 and IPv6 addresses. Get binary, hex, decimal, reverse DNS, address class and special-use info. Free IP toolkit.",
        keywords: [
            "ip address tool",
            "ipv4 validator",
            "ipv6 validator",
            "ip converter",
            "ip address parser",
            "ipv6 to ipv4",
            "ip address checker",
            "binary ip converter",
        ],
    },
    "subnet-calculator": {
        title: "Subnet Calculator — CIDR, Mask, Network & Host Range Tool",
        description:
            "Calculate subnet masks, CIDR notation, network address, broadcast, available hosts and IP range. Supports IPv4 and IPv6. Free subnet calculator.",
        keywords: [
            "subnet calculator",
            "cidr calculator",
            "ipv4 subnet calculator",
            "ipv6 subnet calculator",
            "subnet mask calculator",
            "network address calculator",
            "ip range calculator",
        ],
    },
    "mac-address-tools": {
        title: "MAC Address Tools — Validate, Format & Look Up Vendor (OUI)",
        description:
            "Validate, format and generate MAC addresses. Look up vendor (OUI/IEEE) information from MAC prefix. Convert between formats (colon/dash/dot). Free.",
        keywords: [
            "mac address tools",
            "mac address validator",
            "mac vendor lookup",
            "oui lookup",
            "mac address generator",
            "mac formatter",
            "ieee oui database",
        ],
    },

    // ===== Generators =====
    "uuid-generator": {
        title: "UUID & ULID Generator — v3, v4, v5 and v7 Identifiers",
        description:
            "Generate UUID v3/v5 namespace identifiers, random v4, time-ordered v7 and ULIDs locally. Inspect identifier versions and timestamps; copy or download up to 1,000 IDs.",
        keywords: [
            "uuid generator",
            "guid generator",
            "uuid v4 generator",
            "uuid v3 generator",
            "uuid v5 namespace",
            "uuid v7 generator",
            "ulid generator",
            "random uuid",
            "bulk uuid generator",
            "rfc 9562 uuid",
            "online uuid generator",
            "unique id generator",
        ],
    },
    "password-generator": {
        title: "Strong Password Generator — Random, Secure Passwords Online",
        description:
            "Generate strong random passwords with custom length, uppercase, lowercase, numbers, symbols and exclude-similar options. 100% local, never transmitted.",
        keywords: [
            "password generator",
            "strong password generator",
            "random password generator",
            "secure password generator",
            "password creator",
            "password maker",
            "online password generator",
        ],
    },
    "credit-card-generator": {
        title: "Credit Card Generator — Luhn-Valid Test Card Numbers, Free",
        description:
            "Generate synthetic Luhn-valid card-format fixtures with placeholder CVV, expiry and holder details. Local previews and text/CSV/JSON export; no account lookup.",
        keywords: [
            "credit card generator",
            "test credit card numbers",
            "fake credit card generator",
            "luhn valid card generator",
            "visa test card number",
            "mastercard test card number",
            "amex test card number",
            "dummy credit card generator",
        ],
    },
    "lorem-ipsum": {
        title: "Lorem Ipsum Generator — Placeholder Text in Words, Sentences",
        description:
            "Generate Lorem Ipsum placeholder text as words, sentences or paragraphs. Choose the length and classic opening, then copy or download the plain text.",
        keywords: [
            "lorem ipsum generator",
            "placeholder text generator",
            "dummy text generator",
            "lorem ipsum online",
            "filler text generator",
            "lipsum generator",
            "design placeholder text",
        ],
    },
    "qrcode-generator": {
        title: "QR Code Generator — Create QR Codes from Text, URL, WiFi",
        description:
            "Generate QR codes from text, URLs, WiFi credentials, vCards and SMS. Customize size, error correction and download as PNG/SVG. Free, no signup.",
        keywords: [
            "qr code generator",
            "free qr code maker",
            "url qr code generator",
            "wifi qr code",
            "vcard qr code",
            "online qr code creator",
            "qrcode png svg",
            "custom qr code",
        ],
    },
    "markdown-table": {
        title: "Markdown Table Generator — Visual Markdown Table Editor Online",
        description:
            "Build markdown tables with a spreadsheet-like editor. Add rows/columns, alignment, copy as Markdown. Perfect for GitHub, Notion and docs. Free.",
        keywords: [
            "markdown table generator",
            "markdown table editor",
            "create markdown table",
            "github markdown table",
            "online md table",
            "markdown table maker",
        ],
    },
    "java-pojo-generator": {
        title: "Java POJO Generator — JSON / XML to Java Class, Record, Interface",
        description:
            "Generate Java POJOs, records and interfaces from JSON or XML. Configure package, Lombok, Jackson and Builder annotations. Free Java code generator.",
        keywords: [
            "java pojo generator",
            "json to java",
            "xml to java",
            "java record generator",
            "java class generator",
            "lombok pojo",
            "jackson dto generator",
            "json to dto",
        ],
    },
    "json-to-typescript": {
        title: "JSON to TypeScript — Generate TS Interfaces from JSON Online",
        description:
            "Generate TypeScript interfaces and types from JSON. Infer nested objects, array unions and null values, then review and copy the generated code.",
        keywords: [
            "json to typescript",
            "json to interface",
            "ts type generator",
            "json to ts converter",
            "typescript interface generator",
            "json2ts",
            "type inference from json",
        ],
    },

    // ===== Text & Utilities =====
    "text-tools": {
        title: "Text Manipulation Tools — Sort, Dedupe, Trim, Count Lines/Words",
        description:
            "All-in-one text utilities: sort lines, remove duplicates, trim whitespace, count words/characters/lines, reverse lines and more. Free, instant, private.",
        keywords: [
            "text manipulation tools",
            "sort lines",
            "remove duplicate lines",
            "trim whitespace",
            "word counter",
            "line counter",
            "online text utilities",
            "text editor online",
        ],
    },
    "markdown-preview": {
        title: "Markdown Preview — Live Markdown Editor with Side-by-Side Render",
        description:
            "Write Markdown and see GitHub-flavored rendered output live, side-by-side. Supports tables, code, lists, links, images. Free Markdown previewer.",
        keywords: [
            "markdown preview",
            "markdown editor online",
            "live markdown preview",
            "github markdown preview",
            "md viewer",
            "online markdown editor",
            "gfm preview",
        ],
    },
    "case-converter": {
        title: "Case Converter — camelCase, snake_case, kebab-case, PascalCase",
        description:
            "Convert text between camelCase, snake_case, PascalCase, kebab-case, CONSTANT_CASE, Title Case and Sentence case. Free string case converter.",
        keywords: [
            "case converter",
            "camelcase converter",
            "snake_case converter",
            "kebab-case converter",
            "pascalcase converter",
            "string case converter",
            "constant case",
            "title case converter",
        ],
    },
    "timestamp-converter": {
        title: "Unix Timestamp Converter — Epoch to Date Online (UTC, ISO 8601)",
        description:
            "Convert Unix timestamps (seconds and milliseconds) to human-readable UTC, local and ISO 8601 dates. Reverse-convert dates to epoch. Free, instant.",
        keywords: [
            "unix timestamp converter",
            "epoch converter",
            "timestamp to date",
            "date to timestamp",
            "iso 8601 converter",
            "epoch to date online",
            "unix time converter",
            "milliseconds timestamp",
        ],
    },
    "color-picker": {
        title: "Color Picker & Converter — HEX, RGB, HSL, HSV Online",
        description:
            "Pick colors with a visual picker and convert between HEX, RGB, HSL, HSV and CSS color names. Copy values for design, CSS and code. Free.",
        keywords: [
            "color picker online",
            "hex to rgb converter",
            "rgb to hex",
            "hsl converter",
            "color converter",
            "css color picker",
            "rgb hsl hex",
            "color code converter",
        ],
    },
    "number-base": {
        title: "Number Base Converter — Exact Integers in Bases 2–36",
        description:
            "Convert exact signed integers between bases 2–36, detect binary/octal/hex prefixes, swap direction and copy results without JavaScript Number rounding.",
        keywords: [
            "number base converter",
            "decimal to binary",
            "binary to decimal",
            "decimal to hex",
            "hex to decimal",
            "octal converter",
            "base conversion tool",
            "radix converter",
        ],
    },
    "unix-permissions": {
        title: "Unix chmod Calculator — File Permissions to Numeric (777, 644)",
        description:
            "Calculate Unix/Linux file permissions. Convert chmod symbolic (rwxr-xr-x) to numeric (755) and back. Understand owner, group, other bits. Free.",
        keywords: [
            "chmod calculator",
            "unix permissions calculator",
            "linux file permissions",
            "rwx to numeric",
            "777 644 chmod",
            "permissions converter",
            "octal permissions",
            "file mode calculator",
        ],
    },
    "cron-parser": {
        title: "Cron Expression Parser — Validate, Explain, Next Run Times",
        description:
            "Parse, validate and explain cron expressions in plain English. Preview the next 10 run times across timezones. Supports standard and Quartz cron.",
        keywords: [
            "cron expression parser",
            "cron expression generator",
            "cron explainer",
            "next cron run time",
            "cron validator",
            "crontab generator",
            "quartz cron parser",
            "cron schedule tester",
        ],
    },
    "todo-list": {
        title: "Personal Todo List — Offline Task Manager with IndexedDB",
        description:
            "Production-grade personal todo app: categories, subtasks, priorities, archive, trash, import/export. 100% offline, IndexedDB-backed. Free, private.",
        keywords: [
            "personal todo list",
            "offline task manager",
            "indexeddb todo",
            "private todo app",
            "browser todo list",
            "free task tracker",
            "subtasks todo",
            "todo with categories",
        ],
    },

    "rag-search": {
        title: "Semantic Search Playground — Real Embedding Search in Your Browser",
        description:
            "Search your own text by meaning, not keywords, using real sentence embeddings (all-MiniLM-L6-v2) computed entirely in your browser via WebGPU/WASM. No server, no API key.",
        keywords: [
            "semantic search",
            "embedding search online",
            "vector search browser",
            "all-minilm embeddings",
            "rag playground",
            "cosine similarity search",
            "webgpu embeddings",
            "local semantic search",
        ],
        faq: [
    {
        "q": "Does this send my documents to a server?",
        "a": "Text stays on this device. WebGPU falls back to WASM when unavailable; clearing browser storage may require another model download."
    },
    {
        "q": "How is this different from keyword search?",
        "a": "Semantic search compares sentence embedding vectors; keyword comparison measures literal term overlap. Similar meaning can match without shared words, but relevance is not guaranteed."
    },
    {
        "q": "Why does the model take a moment to load?",
        "a": "Load the model; about 91 MB of FP32 weights and metadata download from Hugging Face and may be cached."
    }
],
    },

    // ===== Reference =====
    "http-status-codes": {
        title: "HTTP Status Reference — Selected 1xx–5xx Codes Explained",
        description:
            "Browse selected HTTP status codes with explanations, examples and primary sources. Includes dated notes for temporary registrations and protocol-specific limits.",
        keywords: [
            "http status codes",
            "http status code reference",
            "http response codes",
            "200 ok",
            "404 not found",
            "500 internal server error",
            "rest api status codes",
            "http codes list",
        ],
    },
    "mime-types": {
        title: "MIME Types Reference — Content-Type Database & File Extensions",
        description:
            "Searchable MIME types database. Look up Content-Type for any file extension (PDF, JSON, MP4, etc.). Includes IANA-registered & common types.",
        keywords: [
            "mime types reference",
            "content-type list",
            "mime type lookup",
            "file extension to mime",
            "iana mime types",
            "content-type database",
            "media types reference",
            "http content type",
        ],
    },
    "port-reference": {
        title: "Network Port Reference — TCP/UDP Ports, Protocols & Services",
        description:
            "Searchable reference of common TCP/UDP network ports and the services that use them — HTTP, HTTPS, SSH, DNS, SMTP, MySQL, Postgres and more.",
        keywords: [
            "port number reference",
            "tcp port list",
            "udp port list",
            "well-known ports",
            "port lookup",
            "network ports reference",
            "common ports list",
            "iana port numbers",
        ],
    },
    "model-pricing-reference": {
        title: "LLM Model & Pricing Comparison — Claude, GPT, Gemini, Llama, Mistral",
        description:
            "Compare context windows, max output tokens, and per-million-token pricing across Anthropic, OpenAI, Google, Meta, and Mistral models. Free, no signup.",
        keywords: [
            "llm pricing comparison",
            "ai model pricing",
            "claude pricing",
            "gpt pricing",
            "gemini pricing",
            "llm cost calculator",
            "context window comparison",
            "ai api pricing",
            "llm token pricing",
        ],
        faq: [
    {
        "q": "How often is this pricing updated?",
        "a": "The table shows review dates. Prices, processing tiers and limits can change; open the linked provider pricing before budgeting."
    },
    {
        "q": "What does \"cached input\" pricing mean?",
        "a": "A provider may discount eligible reused prompt tokens. Cache creation, retention, minimum sizes and rates vary by provider and model."
    },
    {
        "q": "Why do some models show a higher price above a certain context length?",
        "a": "Some providers apply different rates or limits to long requests. Read the model note and provider pricing; the listed input rate alone may not cover your request."
    }
],
    },
    "ip-ranges-reference": {
        title: "IP Ranges Reference — Private, Reserved & Special-Use IPs",
        description:
            "Reference for private (RFC 1918), reserved, multicast, link-local, loopback and other special-use IPv4 / IPv6 address ranges. Free quick lookup.",
        keywords: [
            "ip ranges reference",
            "private ip ranges",
            "rfc 1918 ranges",
            "reserved ip addresses",
            "special use ip",
            "loopback addresses",
            "multicast ip ranges",
            "link-local addresses",
        ],
    },
    "rfc-standards": {
        title: "RFC Standards Reference — JWT, OAuth, HTTP, TLS, JOSE, IETF",
        description:
            "Searchable reference of important RFC standards: JWT (7519), JWE (7516), JWS (7515), OAuth 2.0 (6749), HTTP, TLS and more security & web protocols.",
        keywords: [
            "rfc standards reference",
            "rfc 7519 jwt",
            "rfc 6749 oauth",
            "rfc lookup",
            "ietf rfc list",
            "security rfc standards",
            "http rfc",
            "tls rfc",
        ],
    },

    // ===== Newly added tools =====
    "yaml-formatter": {
        title: "YAML Formatter & Validator — Format YAML Online (Free)",
        description:
            "Format, validate and beautify YAML documents online. Custom indentation, error detection, anchors and aliases preserved. Free, instant and 100% client-side.",
        keywords: [
            "yaml formatter",
            "yaml validator",
            "yaml beautifier",
            "format yaml online",
            "yaml prettifier",
            "yaml linter",
            "online yaml editor",
            "kubernetes yaml formatter",
            "docker compose yaml",
        ],
    },
    "mermaid-formatter": {
        title: "Mermaid Diagram Formatter & Viewer — Format and Preview Diagrams Online",
        description:
            "Format, validate and beautify Mermaid diagrams online. Custom indentation, syntax highlighting, and live preview. Free diagram formatter with real-time rendering.",
        keywords: [
            "mermaid formatter",
            "mermaid diagram editor",
            "mermaid preview",
            "mermaid diagram formater online",
            "mermaid linter",
            "flowchart formatter",
            "sequence diagram",
            "online mermaid editor",
            "mermaid validator",
            "mermaid graph builder",
        ],
    },
    "mermaid-viewer": {
        title: "Mermaid Diagram Viewer — Render Mermaid Diagrams Online",
        description:
            "Render and preview Mermaid diagrams online with live editing, theme switching, and SVG export. Free Mermaid viewer for flowcharts, sequence diagrams, and more.",
        keywords: [
            "mermaid viewer",
            "mermaid renderer",
            "mermaid diagram preview",
            "mermaid to svg",
            "online mermaid viewer",
            "flowchart viewer",
            "sequence diagram viewer",
            "mermaid svg export",
            "mermaid theme",
            "mermaid live preview",
        ],
    },
    "email-validator": {
        title: "Email Validator — Check Email Address Format & Validity Online",
        description:
            "Validate email addresses with RFC 5322 syntax checking, disposable email detection, role-based account flags, and bulk validation. Free email checker.",
        keywords: [
            "email validator",
            "email address validator",
            "validate email online",
            "email syntax checker",
            "disposable email checker",
            "rfc 5322 email validator",
            "bulk email validator",
            "check email format",
        ],
    },
    "json-to-csv": {
        title: "JSON to CSV Converter — Convert JSON Arrays to CSV Online",
        description:
            "Convert JSON arrays and nested objects to CSV with custom delimiters, header detection and flatten options. Export Excel-compatible CSV. Free.",
        keywords: [
            "json to csv",
            "convert json to csv",
            "json csv converter",
            "json to spreadsheet",
            "json to excel",
            "json2csv",
            "online json to csv",
            "flatten json to csv",
        ],
    },
    "hex-converter": {
        title: "Hex Encoder & Decoder — Convert Text to Hex and Back (UTF-8)",
        description:
            "Encode text to hexadecimal and decode hex strings back to text. Supports UTF-8, ASCII, with/without prefixes (0x, \\x). Free hex converter tool.",
        keywords: [
            "hex encoder",
            "hex decoder",
            "text to hex",
            "hex to text",
            "hexadecimal converter",
            "utf-8 hex",
            "ascii to hex",
            "hex to ascii",
            "online hex tool",
        ],
    },
    "bcrypt-tool": {
        title: "BCrypt Hash Generator & Verifier — Hash Passwords Online",
        description:
            "Generate BCrypt password hashes with configurable salt rounds (4–15). Verify plain-text passwords against BCrypt hashes. Free, runs entirely in browser.",
        keywords: [
            "bcrypt hash generator",
            "bcrypt password hash",
            "bcrypt online",
            "bcrypt verify",
            "bcrypt password checker",
            "bcrypt salt rounds",
            "password hash generator",
            "bcrypt encoder",
        ],
    },
    "aes-tool": {
        title: "AES-CBC Compatibility Tool — Encrypt & Decrypt Text Locally",
        description:
            "Encrypt and decrypt CryptoJS-compatible AES-256-CBC passphrase text locally. Legacy unauthenticated format; this tool does not use PBKDF2 or accept raw keys.",
        keywords: [
            "aes encrypt",
            "aes decrypt",
            "aes online tool",
            "aes-256 encrypt",
            "aes cbc compatibility",
            "cryptojs passphrase encryption",
            "encrypt text online",
            "decrypt aes",
            "symmetric encryption tool",
            "passphrase encryption",
        ],
    },
    "slug-generator": {
        title: "Slug Generator — Create SEO-Friendly URL Slugs from Text",
        description:
            "Generate URL slugs with Unicode normalization, diacritic removal, character filtering, custom separators, lowercase and a configurable maximum length.",
        keywords: [
            "slug generator",
            "url slug generator",
            "permalink generator",
            "seo slug",
            "kebab case generator",
            "create url slug",
            "slugify online",
            "wordpress slug generator",
        ],
    },
    "color-contrast-checker": {
        title: "Color Contrast Checker — WCAG AA / AAA Ratio Calculator",
        description:
            "Check WCAG color contrast ratios between text and background. Get AA / AAA pass/fail for normal and large text. Free accessibility (a11y) checker.",
        keywords: [
            "color contrast checker",
            "wcag contrast checker",
            "accessibility contrast",
            "a11y contrast",
            "contrast ratio calculator",
            "wcag aa aaa",
            "color accessibility checker",
            "text background contrast",
        ],
    },

    // ===== Certificates & Keys =====
    "certificate-inspector": {
        title: "X.509 Certificate Inspector — Parse, Decode & Analyze SSL Certs",
        description:
            "Inspect X.509 certificates in PEM or DER format. Extract subject, issuer, SANs, validity, public key, signature algorithm and extensions. Free cert decoder.",
        keywords: [
            "x509 certificate inspector",
            "ssl certificate decoder",
            "certificate parser online",
            "pem certificate decoder",
            "der certificate viewer",
            "x509 viewer",
            "certificate details online",
            "ssl cert info",
            "certificate subject issuer",
            "san certificate checker",
        ],
        faq: [
            { q: "What information can I extract from an X.509 certificate?", a: "An X.509 certificate contains the subject (owner), issuer (CA), validity period, Subject Alternative Names (SANs), public key, signature algorithm, serial number, and extensions such as Key Usage and Extended Key Usage." },
            { q: "What is the difference between PEM and DER format?", a: "PEM is a Base64-encoded certificate wrapped in -----BEGIN CERTIFICATE----- headers, commonly used in files. DER is the raw binary form. This tool accepts both formats." },
        ],
    },

    // ===== Artificial Intelligence =====
    "mcp-inspector": {
        title: "MCP Inspector — Test Model Context Protocol Servers Online",
        description:
            "Interactive inspector for Model Context Protocol (MCP) servers. Connect via SSE or Streamable HTTP, discover tools, call them with custom args, inspect JSON-RPC responses.",
        keywords: [
            "mcp inspector",
            "model context protocol inspector",
            "mcp server tester",
            "mcp tool calling",
            "mcp sse transport",
            "mcp http transport",
            "model context protocol debugger",
            "mcp json-rpc",
            "test mcp server online",
            "mcp oauth inspector",
            "anthropic mcp tools",
            "claude mcp server",
        ],
        faq: [
    {
        "q": "What is Model Context Protocol (MCP)?",
        "a": "MCP lets clients discover and invoke tools and resources through a versioned protocol. This inspector covers selected JSONRPC operations and transports, not every protocol capability."
    },
    {
        "q": "What transports does the MCP Inspector support?",
        "a": "Streamable HTTP and legacy SSE are supported. Modes include direct with proxy fallback, direct-strict without fallback, managed server proxy, and a user-run MCP proxy tunnel."
    },
    {
        "q": "How does session tracking work?",
        "a": "MCP 2026-07-28 requests carry version, client identity and capabilities independently and do not use initialization sessions. Selected older versions use initialize and echo a server-provided Mcp-Session-Id on subsequent requests."
    }
],
    },
    "a2a-inspector": {
        title: "A2A Protocol Inspector — Test Agent-to-Agent AI Servers Online",
        description:
            "Inspect Agent-to-Agent (A2A) cards and selected fields, send messages and tasks, stream responses and track contextId. Supports documented JSONRPC modes; not a complete conformance suite.",
        keywords: [
            "a2a inspector",
            "agent to agent protocol",
            "a2a protocol tester",
            "a2a agent card",
            "a2a json-rpc debugger",
            "agent protocol inspector",
            "a2a compliance checker",
            "agent streaming responses",
            "a2a task lifecycle",
            "ai agent protocol debug",
        ],
        faq: [
    {
        "q": "What is the A2A (Agent-to-Agent) protocol?",
        "a": "A2A describes agent discovery and communication. This inspector supports selected 1.0 and 0.3 JSONRPC operations and version-specific agent cards."
    },
    {
        "q": "What does the compliance checker verify?",
        "a": "The inspector checks selected fields and JSONRPC interfaces for the chosen version. It is a partial structural review, not a complete conformance test."
    }
],
    },
    "token-counter": {
        title: "LLM Token Counter — Count Tokens & Estimate Context Window Usage",
        description:
            "Local encoding counts and rough token estimates, plus optional direct provider counting for selected OpenAI, Claude and Gemini models.",
        keywords: [
            "llm token counter",
            "gpt token counter",
            "claude token counter",
            "tokenizer online",
            "context window calculator",
            "token estimator",
            "bpe tokenizer",
            "ai prompt token count",
        ],
        faq: [
    {
        "q": "Is the token count exact or an estimate?",
        "a": "Counts plain-text tokens locally with o200k_base or cl100k_base, or a labeled character heuristic. Optional provider counting sends one user message directly to the selected provider."
    },
    {
        "q": "Does my text get sent anywhere?",
        "a": "Local counts stay on the device. Optional provider counting sends text and the in-memory key directly to the selected provider only after you choose Send."
    },
    {
        "q": "Why does the same text have a different token count for different models?",
        "a": "Encodings use different vocabularies and token boundaries. Some choices here use a character heuristic instead of the model tokenizer; local counts do not verify model mappings or API overhead."
    }
],
    },
    "jsonl-validator": {
        title: "Fine-Tuning Dataset Validator — Check JSONL Files for OpenAI & Anthropic",
        description:
            "Validate JSONL fine-tuning datasets against OpenAI or Anthropic message schemas, with per-line token counts. Runs entirely in your browser — no upload.",
        keywords: [
            "jsonl validator",
            "fine-tuning dataset validator",
            "openai fine-tuning format",
            "anthropic fine-tuning format",
            "jsonl schema check",
            "training data validator",
            "chat fine-tuning jsonl",
            "llm dataset checker",
        ],
        faq: [
    {
        "q": "Does this tool upload my dataset anywhere?",
        "a": "The file is read locally — nothing is uploaded to a server."
    },
    {
        "q": "Which chat checks do the presets perform?",
        "a": "Provider presets cover text-oriented examples and may reject other valid provider content blocks. Confirm provider requirements before training."
    },
    {
        "q": "Why does a line fail even though the JSON is valid?",
        "a": "Checks JSONL syntax and simplified chat-shape presets for OpenAI, Anthropic, Gemini, Mistral and open-model examples. This is not authoritative provider-schema or fine-tuning eligibility validation."
    }
],
    },
    "agent-manifest-generator": {
        title: "Agent Card & MCP Manifest Generator — A2A and MCP Config Builder",
        description:
            "Build a valid A2A agent-card.json or MCP server config with live validation, then test it directly in the A2A or MCP Inspector. Free, no signup.",
        keywords: [
            "a2a agent card generator",
            "agent card json",
            "mcp server config",
            "mcpservers json",
            "a2a manifest builder",
            "mcp json generator",
            "ai agent config",
            "model context protocol config",
        ],
        faq: [
    {
        "q": "What is an A2A agent card?",
        "a": "A2A cards are typically served at /.well-known/agent-card.json; tags describe skills. This form does not certify protocol conformance."
    },
    {
        "q": "What is the MCP server config used for?",
        "a": "A client configuration lists MCP server commands or URLs. Argument parsing and HTTP configuration vary by client; this generator uses a JSON string array to preserve argument spaces."
    },
    {
        "q": "Can I test the generated manifest immediately?",
        "a": "Copy, download, or send the JSON to the matching inspector; this page does not deploy or execute it."
    }
],
    },

    // ===== Fun & Games =====
    "timer": {
        title: "Online Countdown Timer — Pomodoro, Custom Time, Audio Alert",
        description:
            "Free online countdown timer with presets (Pomodoro 25 min, 5 min break, 1 hr), custom hours/minutes/seconds, and audio chime when finished. No signup needed.",
        keywords: [
            "online countdown timer",
            "pomodoro timer",
            "countdown timer online",
            "timer online free",
            "work timer",
            "study timer",
            "focus timer",
            "kitchen timer online",
            "countdown clock",
            "pomodoro technique timer",
            "25 minute timer",
            "time management timer",
        ],
        faq: [
    {
        "q": "What is the Pomodoro technique?",
        "a": "A common routine alternates 25 minutes of focused work with 5-minute breaks, then takes a longer break after several cycles. This timer provides durations; it does not automatically run that cycle."
    },
    {
        "q": "Does the timer play a sound when it finishes?",
        "a": "Background tabs and device sleep can delay the completion chime. Browser audio policies may block sound. Reloading clears the timer."
    }
],
    },
    "stopwatch": {
        title: "Online Stopwatch — Lap Timer with Split Times (Free)",
        description:
            "Browser stopwatch with lap splits, best/worst lap highlighting and a millisecond display. Timing depends on browser scheduling and device conditions.",
        keywords: [
            "online stopwatch",
            "stopwatch with laps",
            "lap timer online",
            "split time stopwatch",
            "precision stopwatch",
            "browser stopwatch",
            "free online stopwatch",
            "workout timer",
            "interval timer",
            "millisecond stopwatch",
        ],
    },
    "coin-toss": {
        title: "Coin Flip Simulator — Online Heads or Tails Flip (Free)",
        description:
            "Flip a virtual coin online. Animated heads/tails result, flip history, and streak stats. Make quick random decisions — no real coin needed. Free, instant.",
        keywords: [
            "coin flip",
            "coin toss online",
            "heads or tails",
            "flip a coin online",
            "virtual coin flip",
            "random coin flip",
            "coin toss simulator",
            "heads tails decision",
            "online coin flipper",
        ],
        faq: [
    {
        "q": "Is the coin flip truly random?",
        "a": "Each flip uses Math.random() with a heads threshold of 0.5. This is pseudorandom entertainment, not cryptographic randomness or a guarantee of balanced results in a short run."
    }
],
    },
    "dice-roll": {
        title: "Dice Roller Online — Roll D4, D6, D8, D10, D12, D20 Dice",
        description:
            "Roll any standard RPG dice online: D4, D6, D8, D10, D12, D20, or D100. Multi-dice mode, custom modifiers, roll history. Perfect for D&D, board games, and tabletop RPGs.",
        keywords: [
            "dice roller online",
            "roll dice online",
            "d20 dice roller",
            "d6 dice roll",
            "rpg dice roller",
            "dungeons and dragons dice",
            "d&d dice roller",
            "tabletop dice roller",
            "virtual dice",
            "dice simulator online",
            "random dice roll",
        ],
        faq: [
    {
        "q": "Which dice types are supported?",
        "a": "D4, D6, D8, D10, D12, D20 and D100 are supported, with multiple dice, individual results and a total."
    },
    {
        "q": "Can I add modifiers to my dice rolls?",
        "a": "A positive or negative integer modifier is added once to the roll total, not once per die."
    }
],
    },
    "spin-wheel": {
        title: "Spin the Wheel — Random Picker & Decision Wheel Online",
        description:
            "Free customizable spinning wheel for random decisions. Add 2–12 options, spin to pick a winner, save your list. Great for classroom names, team selection, giveaways.",
        keywords: [
            "spin the wheel",
            "random wheel spinner",
            "spinning wheel picker",
            "decision wheel online",
            "random name picker wheel",
            "wheel of fortune online",
            "classroom name picker",
            "random team selector",
            "giveaway wheel spinner",
            "yes no wheel",
            "wheel picker free",
        ],
        faq: [
    {
        "q": "How many options can I add to the wheel?",
        "a": "The wheel accepts 2–12 options. A pseudorandom selection determines the winner; the animation displays that result."
    },
    {
        "q": "Are my wheel options saved?",
        "a": "Options are stored for the active workspace on this device when browser storage is available. Clearing that storage removes them."
    }
],
    },
    "magic-8ball": {
        title: "Magic 8-Ball Online — Ask a Question, Get Your Answer",
        description:
            "Ask the virtual Magic 8-Ball any yes/no question and shake it for a fortune. All 20 classic responses, response stats, question history. Free, no signup.",
        keywords: [
            "magic 8 ball online",
            "virtual magic 8 ball",
            "ask the magic 8 ball",
            "online 8 ball",
            "magic 8 ball decision",
            "magic 8 ball game",
            "yes no oracle",
            "random decision maker",
            "fortune teller online",
        ],
        faq: [
    {
        "q": "How many responses does the Magic 8-Ball have?",
        "a": "There are 20 entertainment responses: 10 positive, 5 neutral and 5 negative. They do not predict events."
    }
],
    },
    "typing-test": {
        title: "Typing Speed Test — Measure WPM & Accuracy Online (Free)",
        description:
            "Test your typing speed in words per minute (WPM) and accuracy. Choose 15s, 30s, 1 min or 2 min tests. Real-time character highlighting and results history. Free.",
        keywords: [
            "typing speed test",
            "wpm test online",
            "typing test free",
            "words per minute test",
            "typing accuracy test",
            "online typing test",
            "typing speed checker",
            "touch typing test",
            "typing practice online",
            "keyboard speed test",
            "measure typing speed",
        ],
        faq: [
    {
        "q": "How is WPM calculated?",
        "a": "WPM is rounded from (correct characters ÷ 5) ÷ elapsed minutes. The exercise uses fixed English passages."
    },
    {
        "q": "What counts as an error?",
        "a": "A typed character that differs from the target position is an error. Accuracy compares the current text, and WPM uses only correctly matched characters."
    }
],
    },

    // ===== Text & Utilities =====
    "sticky-notes": {
        title: "Sticky Notes Online — Browser-Based Note Keeper (Free)",
        description:
            "Create, organise and colour-code sticky notes that persist in your browser. No account needed — notes are saved locally in your browser. Fast, private, offline-ready.",
        keywords: [
            "sticky notes online",
            "browser sticky notes",
            "online notepad",
            "virtual sticky notes",
            "local sticky notes",
            "browser notepad free",
            "private notes online",
            "colour coded notes",
            "digital sticky notes",
        ],
    },
    "rich-text-editor": {
        title: "Rich Text Editor Online — WYSIWYG HTML Editor (Free)",
        description:
            "Feature-rich WYSIWYG browser editor: bold, italic, headings, lists, tables, links. Auto-saves to localStorage. Export as HTML or plain text. No signup required.",
        keywords: [
            "rich text editor online",
            "wysiwyg editor online",
            "online html editor",
            "browser text editor",
            "free online editor",
            "rich text format editor",
            "online word processor",
            "html wysiwyg editor",
            "rtf editor online",
            "text formatting online",
        ],
    },

    // ===== v1.4 — Networking & Web =====
    "webhook-receiver": {
        title: "Webhook Receiver Online — Inspect Inbound HTTP Requests in Real Time",
        description:
            "Free webhook tester: generate a unique inbound URL, watch incoming HTTP requests stream in live with full headers, body and timing. No signup, sessions auto-expire.",
        keywords: [
            "webhook receiver",
            "webhook tester online",
            "webhook inspector",
            "webhook url generator",
            "http callback debugger",
            "requestbin alternative",
            "ngrok alternative webhook",
            "inspect incoming webhooks",
            "webhook capture",
        ],
    },
    "websocket-tester": {
        title: "WebSocket Tester Online — Connect, Send, Inspect ws/wss Frames",
        description:
            "Free WebSocket client in your browser. Connect to ws:// and wss:// endpoints, send text and JSON messages, watch frames stream in with timestamps and latency.",
        keywords: [
            "websocket tester",
            "websocket client online",
            "ws tester",
            "wss tester",
            "websocket debugger",
            "websocket inspector",
            "online websocket client",
            "test websocket connection",
            "websocket frame viewer",
        ],
    },
    "cors-tester": {
        title: "CORS Tester Online — Debug Access-Control Headers & Preflight",
        description:
            "Test cross-origin requests from the current browser origin, inspect exposed response headers and review possible reasons for opaque failures. Browser CORS restrictions apply.",
        keywords: [
            "cors tester",
            "cors checker online",
            "cors debugger",
            "test cors headers",
            "access-control-allow-origin tester",
            "preflight tester",
            "cors error explanation",
            "cors policy checker",
        ],
    },
    "dns-lookup": {
        title: "DNS Lookup Online — A, AAAA, MX, TXT, NS, SOA Records",
        description:
            "Free DNS lookup tool: resolve A, AAAA, CNAME, MX, TXT, NS, SOA records for any hostname using public DNS-over-HTTPS resolvers. No signup, JSON-friendly output.",
        keywords: [
            "dns lookup online",
            "dig online",
            "nslookup online",
            "mx record lookup",
            "txt record lookup",
            "dns record checker",
            "doh dns lookup",
            "dns query tool",
            "resolve dns records",
        ],
    },

    // ===== v1.4 — Diff & Compare additions =====
    "image-diff": {
        title: "Image Diff Online — Pixel-Perfect Visual Comparison Tool",
        description:
            "Compare two images pixel by pixel. Side-by-side, overlay and difference modes, adjustable tolerance, runs entirely client-side. Perfect for visual regression tests.",
        keywords: [
            "image diff online",
            "image compare tool",
            "pixel diff",
            "visual diff",
            "image comparison",
            "screenshot diff",
            "visual regression",
            "compare two images online",
        ],
    },
    "csv-diff": {
        title: "CSV Diff Online — Row-Keyed Spreadsheet Comparison",
        description:
            "Compare two CSV files with column-level change highlighting. Detects added, removed and modified rows by key column. Free, private, runs entirely in your browser.",
        keywords: [
            "csv diff",
            "csv compare online",
            "spreadsheet diff",
            "compare csv files",
            "csv comparison tool",
            "csv row diff",
            "csv changes",
            "diff spreadsheet",
        ],
    },
    // ===== v1.4 — Image & Media =====
    "image-compressor": {
        title: "Image Compressor Online — Shrink JPEG, PNG, WebP in Browser",
        description:
            "Compress images directly in your browser with a quality slider and live before/after preview. Supports JPEG, PNG and WebP. Files never leave your device.",
        keywords: [
            "image compressor online",
            "compress jpeg online",
            "compress png online",
            "compress webp",
            "shrink image online",
            "image optimizer",
            "reduce image size",
            "online image compressor free",
        ],
    },
    "image-resizer": {
        title: "Image Resizer Online — Resize JPEG, PNG, WebP by Pixel or Percent",
        description:
            "Resize images directly in your browser with pixel, percentage, or preset dimensions. Fit, fill or stretch modes, JPEG/PNG/WebP output. No upload — runs locally.",
        keywords: [
            "image resizer online",
            "resize image online",
            "resize jpeg",
            "resize png",
            "resize webp",
            "image scaler",
            "scale image online",
            "thumbnail generator",
            "image dimension changer",
            "photo resizer",
        ],
    },
    "svg-optimizer": {
        title: "SVG Optimizer Online — Minify and Clean SVG Markup",
        description:
            "Optimize SVG markup by stripping editor metadata, collapsing transforms and rounding numeric precision. Configurable, fast, runs entirely in your browser.",
        keywords: [
            "svg optimizer online",
            "svg minifier",
            "svg cleaner",
            "svgo online",
            "shrink svg",
            "compress svg",
            "svg optimization",
            "clean svg markup",
        ],
    },
    "favicon-generator": {
        title: "Favicon, ICO & Maskable Icon Generator — Local PNG & ZIP Pack",
        description: "Generate common PNG sizes, a six-size ICO and an opaque maskable PWA icon locally. Download a ZIP with matching manifest and HTML head links.",
        keywords: ["favicon generator", "ico generator", "maskable icon", "pwa icons", "apple touch icon", "favicon zip", "web app manifest"]
    },
    "color-palette-extractor": {
        title: "Color Palette Extractor — Dominant Colors From Any Image",
        description:
            "Extract the dominant colours from any image and copy them as HEX, RGB or HSL. K-means clustering, configurable palette size, runs entirely in your browser.",
        keywords: [
            "color palette extractor",
            "dominant colors image",
            "image color picker",
            "palette from image",
            "extract colors online",
            "image swatch generator",
            "hex from image",
        ],
    },
    "exif-viewer": {
        title: "Image Metadata Viewer & Remover — EXIF, PNG, WebP, TIFF & AVIF",
        description:
            "Inspect common image metadata locally. Remove JPEG/PNG/WebP metadata while preserving compressed image data, or explicitly convert supported formats.",
        keywords: [
            "exif viewer online",
            "exif reader",
            "photo metadata viewer",
            "jpeg exif viewer",
            "gps exif reader",
            "iptc viewer",
            "image metadata online",
            "inspect photo metadata",
        ],
    },

    // ===== v1.4 — Data Conversion additions =====
    "mock-data-generator": {
        title: "Mock Data Generator — Fake JSON, CSV & SQL Test Data",
        description:
            "Generate realistic fake data (names, emails, dates, lorem) as JSON, CSV or SQL inserts. Configurable schema, seedable for reproducible test fixtures.",
        keywords: [
            "mock data generator",
            "fake data generator",
            "test data generator",
            "json mock data",
            "csv mock data",
            "sql insert generator",
            "fixtures generator",
            "seed data generator",
        ],
    },
    "toml-converter": {
        title: "Format Converter — JSON ↔ YAML ↔ TOML ↔ XML",
        description:
            "Convert JSON, YAML, TOML and XML in all twelve directions locally. Preserve supported values and get explicit errors for unsupported mappings.",
        keywords: [
            "toml converter",
            "toml to json",
            "toml to yaml",
            "json to toml",
            "yaml to toml",
            "convert toml online",
            "toml parser online",
            "pyproject converter",
        ],
    },
    "toon-converter": {
        title: "TOON Converter — JSON & XML to TOON Online (Token-Saver)",
        description:
            "Convert JSON or XML to TOON (Token-Oriented Object Notation), a compact format designed for LLM prompts. Live character savings vs JSON — runs entirely in your browser.",
        keywords: [
            "toon converter",
            "json to toon",
            "xml to toon",
            "toon format",
            "token oriented object notation",
            "llm token saver",
            "compact json",
            "json compression",
            "prompt token reducer",
        ],
        faq: [
    {
        "q": "What is TOON?",
        "a": "Converts JSON or an XML object mapping to a supported TOON subset and back. Local o200k_base counts compare encoded text; savings depend on the data."
    },
    {
        "q": "Is TOON lossless from JSON?",
        "a": "Supported JSON values round-trip, but precision-sensitive numbers must be quoted explicitly. XML mapping is lossy. This implementation is a subset, not a complete TOON validator; older root-array exports have an explicit legacy decode switch."
    }
],
    },
    "openapi-contract-diff": {
        title: "OpenAPI Contract Diff — Find Breaking API Changes Online",
        description: "Compare two OpenAPI or Swagger contracts and identify breaking endpoint, parameter, response and schema changes locally in your browser.",
        keywords: ["openapi diff", "swagger diff", "api breaking change checker", "openapi contract testing", "api compatibility"],
    },
    "security-headers-analyzer": {
        title: "Security Headers & CSP Analyzer — Audit HTTP Headers Online",
        description: "Paste HTTP response headers to analyze CSP, HSTS, nosniff, Referrer-Policy and Permissions-Policy gaps. Private local browser analysis.",
        keywords: ["security headers checker", "csp analyzer", "content security policy checker", "hsts checker", "http headers security"],
    },
    "json-schema-workbench": {
        title: "JSON Schema Workbench — Validate JSON Against Schema Online",
        description: "Validate JSON or YAML data against a JSON Schema in your browser. Inspect required fields, types, enums and local references privately.",
        keywords: ["json schema validator", "json schema workbench", "draft 2020-12 validator", "validate json schema", "yaml schema validator"],
    },
    "asyncapi-explorer": {
        title: "AsyncAPI Explorer — Inspect Event API Contracts Online",
        description: "Inspect AsyncAPI JSON and YAML documents locally. Review channels, operations, servers and messages for Kafka, MQTT and WebSocket APIs.",
        keywords: ["asyncapi viewer", "asyncapi validator", "event driven api", "kafka api documentation", "mqtt api contract"],
    },
    "oauth-oidc-playground": {
        title: "OAuth OIDC & PKCE Playground — Test Discovery Metadata",
        description: "Inspect pasted OIDC discovery metadata and generate PKCE S256 verifier and challenge values locally. No client secrets or network calls.",
        keywords: ["oauth pkce generator", "oidc discovery validator", "openid connect playground", "pkce s256", "oauth authorization url"],
    },
    "graphql-explorer": {
        title: "GraphQL Schema Explorer — Validate Queries Against SDL Online",
        description: "Validate GraphQL queries, mutations and subscriptions against an SDL schema locally in your browser. No endpoint connection required.",
        keywords: ["graphql validator", "graphql schema explorer", "graphql query validator", "graphql sdl", "graphql operation checker"],
    },
    "docker-compose-analyzer": {
        title: "Docker Compose Analyzer — Review compose.yaml Online",
        description: "Analyze Docker Compose YAML locally for services, ports, volumes, networking, health checks and common deployment hygiene gaps.",
        keywords: ["docker compose analyzer", "compose yaml validator", "docker compose security", "compose file checker", "container config review"],
    },
    "webauthn-passkey-playground": {
        title: "WebAuthn Passkey Playground — Inspect Credential JSON Online",
        description: "Decode WebAuthn credential response metadata and clientDataJSON locally. Inspect passkey fixtures without transmitting browser credential data.",
        keywords: ["webauthn decoder", "passkey playground", "webauthn credential inspector", "fido credential json", "clientdatajson decoder"],
    },
};

export function getSeoContent(toolId: string): ToolSeoContent | undefined {
    return SEO_CONTENT[toolId];
}

// Snapshot of src/lib/public-tool-catalog.json; canonical paths from toolPath.
const CATALOG_DATA = [
  {
    "id": "data-explorer",
    "name": "Document Data Explorer",
    "description": "Browse and query MongoDB, Firestore and Elasticsearch with encrypted saved connections and type-aware exports",
    "category": "API & Web Services",
    "tags": [
      "mongodb",
      "firestore",
      "elasticsearch",
      "nosql",
      "documents"
    ],
    "color": "#08979c",
    "path": "/api-and-web-services/data-explorer"
  },
  {
    "id": "s3-browser",
    "name": "S3 Storage Browser",
    "description": "Browse S3-compatible buckets, prefixes and object metadata; transfer files with encrypted saved connections",
    "category": "API & Web Services",
    "tags": [
      "s3",
      "storage",
      "bucket",
      "object",
      "aws"
    ],
    "color": "#08979c",
    "path": "/api-and-web-services/s3-browser"
  },
  {
    "id": "code-screenshot",
    "name": "Code Screenshot",
    "description": "Create syntax-highlighted code images with themes, backgrounds, window controls and real PNG export",
    "category": "Image & Media",
    "tags": [
      "code",
      "screenshot",
      "syntax",
      "png",
      "snippet"
    ],
    "color": "#08979c",
    "path": "/image-and-media/code-screenshot"
  },
  {
    "id": "docker-compose-generator",
    "name": "Docker Compose Generator",
    "description": "Configure a local stack with service starters, ports, named volumes, environment variables and dependencies",
    "category": "Generators",
    "tags": [
      "docker",
      "compose",
      "containers",
      "yaml",
      "stack"
    ],
    "color": "#08979c",
    "path": "/generators/docker-compose-generator"
  },
  {
    "id": "json-visualizer",
    "name": "JSON Graph Visualizer",
    "description": "Explore JSON with pan, zoom, branch collapse, path search, array tables and SVG/PNG export",
    "category": "Text & Utilities",
    "tags": [
      "json",
      "graph",
      "visualizer",
      "tree",
      "jsonpath"
    ],
    "color": "#08979c",
    "path": "/text-and-utilities/json-visualizer"
  },
  {
    "id": "css-generators",
    "name": "CSS Visual Builders",
    "description": "Design multi-layer shadows, elliptical radii, fluid typography and configurable gradients with live previews",
    "category": "Generators",
    "tags": [
      "css",
      "shadow",
      "radius",
      "fluid",
      "gradient"
    ],
    "color": "#08979c",
    "path": "/generators/css-generators"
  },
  {
    "id": "user-agent-parser",
    "name": "User-Agent & Client Hints Parser",
    "description": "Inspect reported browser, OS, engine, device and CPU details locally",
    "category": "Text & Utilities",
    "tags": [
      "useragent",
      "browser",
      "device",
      "client hints",
      "cpu"
    ],
    "color": "#08979c",
    "path": "/text-and-utilities/user-agent-parser"
  },
  {
    "id": "whois-rdap",
    "name": "Domain & IP Registration (RDAP)",
    "description": "Look up public domain/IP registration, registrars, events, statuses and nameservers",
    "category": "Network",
    "tags": [
      "rdap",
      "whois",
      "domain",
      "ip",
      "registration"
    ],
    "color": "#08979c",
    "path": "/network/whois-rdap"
  },
  {
    "id": "redis-browser",
    "name": "Redis Browser",
    "description": "Scan keys, inspect typed values and run bounded Redis commands with encrypted saved connections",
    "category": "API & Web Services",
    "tags": [
      "redis",
      "cache",
      "keys",
      "database",
      "commands"
    ],
    "color": "#08979c",
    "path": "/api-and-web-services/redis-browser"
  },
  {
    "id": "gitignore-generator",
    "name": ".gitignore Generator",
    "description": "Combine stack, editor and operating-system ignore patterns with custom overrides",
    "category": "Generators",
    "tags": [
      "gitignore",
      "git",
      "ignore",
      "templates"
    ],
    "color": "#08979c",
    "path": "/generators/gitignore-generator"
  },
  {
    "id": "keycode-inspector",
    "name": "Keyboard Event Inspector",
    "description": "Inspect key, code, modifiers, locations and browser keyboard event history",
    "category": "Text & Utilities",
    "tags": [
      "keyboard",
      "key",
      "keycode",
      "events"
    ],
    "color": "#08979c",
    "path": "/text-and-utilities/keycode-inspector"
  },
  {
    "id": "sql-client",
    "name": "SQL Database Workspace",
    "description": "Query SQLite files locally and connect to PostgreSQL, MySQL and MariaDB with encrypted saved connections",
    "category": "API & Web Services",
    "tags": [
      "sql",
      "database",
      "postgresql",
      "mysql",
      "mariadb",
      "sqlite"
    ],
    "color": "#08979c",
    "path": "/api-and-web-services/sql-client"
  },
  {
    "id": "json-schema-generator",
    "name": "JSON Schema & Model Generator",
    "description": "Infer JSON Schema from sample data and generate typed models for nine languages",
    "category": "Generators",
    "tags": [
      "schema",
      "json",
      "python",
      "go",
      "rust",
      "csharp",
      "kotlin",
      "swift",
      "dart",
      "models"
    ],
    "color": "#08979c",
    "path": "/generators/json-schema-generator"
  },
  {
    "id": "unit-converter",
    "name": "Scientific Unit Converter",
    "description": "Convert physical, electrical, thermal and engineering quantities with explicit unit definitions",
    "category": "Data Converters",
    "tags": [
      "units",
      "scientific",
      "engineering",
      "temperature"
    ],
    "color": "#08979c",
    "path": "/data-converters/unit-converter"
  },
  {
    "id": "timezone-planner",
    "name": "Timezone Planner",
    "description": "Compare meeting times, UTC offsets, date shifts and working hours across IANA timezones",
    "category": "Text & Utilities",
    "tags": [
      "timezone",
      "meeting",
      "dst",
      "time"
    ],
    "color": "#08979c",
    "path": "/text-and-utilities/timezone-planner"
  },
  {
    "id": "totp-generator",
    "name": "TOTP Generator",
    "description": "Generate local RFC 6238 authenticator codes with configurable time-step and public test vectors",
    "category": "Cryptography",
    "tags": [
      "totp",
      "mfa",
      "2fa",
      "authenticator"
    ],
    "color": "#08979c",
    "path": "/cryptography/totp-generator"
  },
  {
    "id": "resource-bookmarks",
    "name": "Resource Bookmarks",
    "description": "Organize project documentation, repositories and external links",
    "category": "Text & Utilities",
    "tags": [
      "bookmark",
      "url",
      "resource"
    ],
    "color": "#08979c",
    "path": "/text-and-utilities/resource-bookmarks"
  },
  {
    "id": "code-snippets",
    "name": "Code Snippets",
    "description": "Save, search, format and copy project code snippets with syntax highlighting",
    "category": "Text & Utilities",
    "tags": [
      "snippet",
      "code",
      "library"
    ],
    "color": "#08979c",
    "path": "/text-and-utilities/code-snippets"
  },
  {
    "id": "secure-files",
    "name": "Secure Files",
    "description": "Encrypt file contents and metadata locally with portable backups",
    "category": "Cryptography",
    "tags": [
      "file",
      "vault",
      "encrypted",
      "backup"
    ],
    "color": "#08979c",
    "path": "/cryptography/secure-files"
  },
  {
    "id": "credential-vault",
    "name": "Credential Vault",
    "description": "Encrypt passwords, API keys, environment variables and saved connections locally",
    "category": "Cryptography",
    "tags": [
      "vault",
      "password",
      "secret",
      "encrypted"
    ],
    "color": "#08979c",
    "path": "/cryptography/credential-vault"
  },
  {
    "id": "tool-workbench",
    "name": "Tool Tabs",
    "description": "Keep multiple tools open, switch and reorder tabs without losing input",
    "category": "Text & Utilities",
    "tags": [
      "tabs",
      "workspace",
      "multitask"
    ],
    "color": "#08979c",
    "path": "/text-and-utilities/tool-workbench"
  },
  {
    "id": "project-workspaces",
    "name": "Project Workspaces",
    "description": "Keep project notes, snippets, workflows and connections separate",
    "category": "Text & Utilities",
    "tags": [
      "project",
      "workspace",
      "isolation"
    ],
    "color": "#08979c",
    "path": "/text-and-utilities/project-workspaces"
  },
  {
    "id": "saved-workflows",
    "name": "Saved Workflows",
    "description": "Chain local tools and save repeatable transformations with settings and fixtures",
    "category": "Text & Utilities",
    "tags": [
      "workflow",
      "pipeline",
      "automation",
      "recipe"
    ],
    "color": "#08979c",
    "path": "/text-and-utilities/saved-workflows"
  },
  {
    "id": "har-log-redactor",
    "name": "HAR & Log Redactor",
    "description": "Redact credentials and custom fields from HAR, JSON, and logs locally",
    "category": "Text & Utilities",
    "tags": [
      "har",
      "redaction",
      "logs",
      "privacy"
    ],
    "color": "#08979c",
    "path": "/text-and-utilities/har-log-redactor"
  },
  {
    "id": "trace-context-inspector",
    "name": "Trace Context Inspector",
    "description": "Inspect and generate W3C traceparent and tracestate headers",
    "category": "Network",
    "tags": [
      "trace",
      "w3c",
      "headers",
      "observability"
    ],
    "color": "#08979c",
    "path": "/network/trace-context-inspector"
  },
  {
    "id": "webhook-signature-debugger",
    "name": "Webhook Signature Debugger",
    "description": "Verify GitHub, Stripe, Slack, and HMAC webhook signatures locally",
    "category": "Cryptography",
    "tags": [
      "webhook",
      "signature",
      "hmac",
      "verify"
    ],
    "color": "#08979c",
    "path": "/cryptography/webhook-signature-debugger"
  },
  {
    "id": "json-formatter",
    "name": "JSON Formatter",
    "description": "Prettify, minify and validate JSON with syntax highlighting and tree view",
    "category": "Formatters",
    "tags": [
      "json",
      "format",
      "prettify",
      "minify",
      "validate"
    ],
    "color": "#1677ff",
    "path": "/formatters/json-formatter"
  },
  {
    "id": "xml-formatter",
    "name": "XML Formatter",
    "description": "Format, prettify and validate XML documents",
    "category": "Formatters",
    "tags": [
      "xml",
      "format",
      "prettify",
      "validate"
    ],
    "color": "#52c41a",
    "path": "/formatters/xml-formatter"
  },
  {
    "id": "sql-formatter",
    "name": "SQL Formatter",
    "description": "Format and beautify SQL queries",
    "category": "Formatters",
    "tags": [
      "sql",
      "format",
      "query",
      "database"
    ],
    "color": "#faad14",
    "path": "/formatters/sql-formatter"
  },
  {
    "id": "html-formatter",
    "name": "HTML Formatter",
    "description": "Format, prettify and beautify HTML documents with customizable indentation",
    "category": "Formatters",
    "tags": [
      "html",
      "format",
      "prettify",
      "beautify"
    ],
    "color": "#fa541c",
    "path": "/formatters/html-formatter"
  },
  {
    "id": "js-formatter",
    "name": "JavaScript Formatter",
    "description": "Beautify and minify JavaScript code with configurable options",
    "category": "Formatters",
    "tags": [
      "javascript",
      "js",
      "beautify",
      "minify",
      "format"
    ],
    "color": "#f7df1e",
    "path": "/formatters/js-formatter"
  },
  {
    "id": "css-formatter",
    "name": "CSS Formatter",
    "description": "Beautify and minify CSS stylesheets with vendor prefix handling",
    "category": "Formatters",
    "tags": [
      "css",
      "beautify",
      "minify",
      "format",
      "stylesheet"
    ],
    "color": "#264de4",
    "path": "/formatters/css-formatter"
  },
  {
    "id": "yaml-formatter",
    "name": "YAML Formatter",
    "description": "Format, validate and beautify YAML documents with indent control",
    "category": "Formatters",
    "tags": [
      "yaml",
      "format",
      "prettify",
      "validate",
      "config"
    ],
    "color": "#cb171e",
    "path": "/formatters/yaml-formatter"
  },
  {
    "id": "mermaid-formatter",
    "name": "Mermaid Formatter",
    "description": "Format, validate and beautify Mermaid diagrams and flowcharts",
    "category": "Formatters",
    "tags": [
      "mermaid",
      "format",
      "diagram",
      "flowchart",
      "validate",
      "graph",
      "chart"
    ],
    "color": "#667eea",
    "path": "/formatters/mermaid-formatter"
  },
  {
    "id": "json-validator",
    "name": "JSON Validator",
    "description": "Validate JSON syntax with detailed error messages and line numbers",
    "category": "Validators",
    "tags": [
      "json",
      "validate",
      "syntax",
      "check"
    ],
    "color": "#52c41a",
    "path": "/validators/json-validator"
  },
  {
    "id": "xml-validator",
    "name": "XML Validator",
    "description": "Validate XML syntax and well-formedness with error highlighting",
    "category": "Validators",
    "tags": [
      "xml",
      "validate",
      "syntax",
      "check",
      "wellformed"
    ],
    "color": "#52c41a",
    "path": "/validators/xml-validator"
  },
  {
    "id": "html-validator",
    "name": "HTML Validator",
    "description": "Validate HTML markup for errors and best practices",
    "category": "Validators",
    "tags": [
      "html",
      "validate",
      "syntax",
      "check",
      "markup"
    ],
    "color": "#fa541c",
    "path": "/validators/html-validator"
  },
  {
    "id": "xsd-validator",
    "name": "XSD Schema Validator",
    "description": "Check XML well-formedness, root names and namespaces alongside a parsed XSD",
    "category": "Validators",
    "tags": [
      "xsd",
      "xml",
      "schema",
      "validate",
      "check"
    ],
    "color": "#13c2c2",
    "path": "/validators/xsd-validator"
  },
  {
    "id": "credit-card-validator",
    "name": "Credit Card Validator",
    "description": "Validate and generate test credit card numbers with Luhn algorithm",
    "category": "Validators",
    "tags": [
      "credit",
      "card",
      "validate",
      "luhn",
      "generate",
      "test"
    ],
    "color": "#1677ff",
    "path": "/validators/credit-card-validator"
  },
  {
    "id": "json-schema-workbench",
    "name": "JSON Schema Workbench",
    "description": "Validate JSON and YAML instances against local JSON Schema rules",
    "category": "Validators",
    "tags": [
      "json",
      "schema",
      "validate",
      "draft-2020-12",
      "api"
    ],
    "color": "#08979c",
    "path": "/validators/json-schema-workbench"
  },
  {
    "id": "regex-tester",
    "name": "Regex Tester",
    "description": "Test regular expressions with live matching and group highlighting",
    "category": "Validators",
    "tags": [
      "regex",
      "regexp",
      "test",
      "match"
    ],
    "color": "#fa541c",
    "path": "/validators/regex-tester"
  },
  {
    "id": "xpath-tester",
    "name": "XPath Tester",
    "description": "Test and evaluate XPath expressions against XML documents",
    "category": "Validators",
    "tags": [
      "xpath",
      "xml",
      "query",
      "test",
      "expression"
    ],
    "color": "#722ed1",
    "path": "/validators/xpath-tester"
  },
  {
    "id": "email-validator",
    "name": "Email Validator",
    "description": "Inspect email syntax and disposable-domain signals",
    "category": "Validators",
    "tags": [
      "email",
      "validate",
      "syntax",
      "rfc",
      "disposable",
      "address"
    ],
    "color": "#1677ff",
    "path": "/validators/email-validator"
  },
  {
    "id": "json-diff",
    "name": "JSON Diff",
    "description": "Compare two JSON documents side by side with highlighted differences",
    "category": "Diff & Compare",
    "tags": [
      "json",
      "diff",
      "compare"
    ],
    "color": "#fa541c",
    "path": "/diff-and-compare/json-diff"
  },
  {
    "id": "openapi-contract-diff",
    "name": "OpenAPI Contract Diff",
    "description": "Compare OpenAPI contracts and flag high-confidence breaking changes",
    "category": "Diff & Compare",
    "tags": [
      "openapi",
      "swagger",
      "api",
      "contract",
      "breaking",
      "diff"
    ],
    "color": "#fa541c",
    "path": "/diff-and-compare/openapi-contract-diff"
  },
  {
    "id": "graphql-explorer",
    "name": "GraphQL Schema & Operation Explorer",
    "description": "Validate GraphQL operations against an SDL schema locally",
    "category": "API & Web Services",
    "tags": [
      "graphql",
      "schema",
      "query",
      "mutation",
      "validate",
      "api"
    ],
    "color": "#e10098",
    "path": "/api-and-web-services/graphql-explorer"
  },
  {
    "id": "xml-diff",
    "name": "XML Diff",
    "description": "Compare two XML documents side by side with highlighted differences",
    "category": "Diff & Compare",
    "tags": [
      "xml",
      "diff",
      "compare"
    ],
    "color": "#fa8c16",
    "path": "/diff-and-compare/xml-diff"
  },
  {
    "id": "text-diff",
    "name": "Text Diff",
    "description": "Compare any two text blocks with line-by-line diff highlighting",
    "category": "Diff & Compare",
    "tags": [
      "text",
      "diff",
      "compare"
    ],
    "color": "#eb2f96",
    "path": "/diff-and-compare/text-diff"
  },
  {
    "id": "xml-to-json",
    "name": "XML to JSON Converter",
    "description": "Convert XML documents to JSON format with attribute handling options",
    "category": "Data Converters",
    "tags": [
      "xml",
      "json",
      "convert",
      "transform"
    ],
    "color": "#faad14",
    "path": "/data-converters/xml-to-json"
  },
  {
    "id": "json-to-xml",
    "name": "JSON to XML Converter",
    "description": "Convert JSON objects to well-formed XML documents",
    "category": "Data Converters",
    "tags": [
      "json",
      "xml",
      "convert",
      "transform"
    ],
    "color": "#faad14",
    "path": "/data-converters/json-to-xml"
  },
  {
    "id": "csv-to-json",
    "name": "CSV to JSON Converter",
    "description": "Convert CSV data to JSON arrays or objects with header detection",
    "category": "Data Converters",
    "tags": [
      "csv",
      "json",
      "convert",
      "excel",
      "spreadsheet"
    ],
    "color": "#52c41a",
    "path": "/data-converters/csv-to-json"
  },
  {
    "id": "csv-to-xml",
    "name": "CSV to XML Converter",
    "description": "Convert CSV data to XML format with customizable element names",
    "category": "Data Converters",
    "tags": [
      "csv",
      "xml",
      "convert",
      "excel",
      "spreadsheet"
    ],
    "color": "#52c41a",
    "path": "/data-converters/csv-to-xml"
  },
  {
    "id": "yaml-json-converter",
    "name": "YAML ↔ JSON Converter",
    "description": "Convert between YAML and JSON formats bidirectionally",
    "category": "Data Converters",
    "tags": [
      "yaml",
      "json",
      "convert",
      "config",
      "transform"
    ],
    "color": "#cb171e",
    "path": "/data-converters/yaml-json-converter"
  },
  {
    "id": "xslt-transformer",
    "name": "XSLT Transformer",
    "description": "Transform XML documents using XSLT stylesheets",
    "category": "Data Converters",
    "tags": [
      "xslt",
      "xml",
      "transform",
      "stylesheet"
    ],
    "color": "#722ed1",
    "path": "/data-converters/xslt-transformer"
  },
  {
    "id": "json-to-csv",
    "name": "JSON to CSV Converter",
    "description": "Convert JSON arrays and objects to CSV with custom delimiters and headers",
    "category": "Data Converters",
    "tags": [
      "json",
      "csv",
      "convert",
      "transform",
      "spreadsheet",
      "excel"
    ],
    "color": "#52c41a",
    "path": "/data-converters/json-to-csv"
  },
  {
    "id": "base64",
    "name": "Base64 Encode / Decode",
    "description": "Encode and decode Base64 strings instantly",
    "category": "Encoding & Decoding",
    "tags": [
      "base64",
      "encode",
      "decode"
    ],
    "color": "#722ed1",
    "path": "/encoding-and-decoding/base64"
  },
  {
    "id": "url-encoder",
    "name": "URL Encode / Decode",
    "description": "Encode and decode URL components",
    "category": "Encoding & Decoding",
    "tags": [
      "url",
      "encode",
      "decode",
      "uri"
    ],
    "color": "#1677ff",
    "path": "/encoding-and-decoding/url-encoder"
  },
  {
    "id": "html-entities",
    "name": "HTML Entities Encoder",
    "description": "Encode and decode HTML entities and special characters",
    "category": "Encoding & Decoding",
    "tags": [
      "html",
      "entities",
      "encode",
      "decode",
      "escape"
    ],
    "color": "#fa541c",
    "path": "/encoding-and-decoding/html-entities"
  },
  {
    "id": "unicode-converter",
    "name": "Unicode Converter",
    "description": "Convert text to/from Unicode escape sequences, code points, and UTF-8 hex",
    "category": "Encoding & Decoding",
    "tags": [
      "unicode",
      "utf8",
      "escape",
      "codepoint",
      "text"
    ],
    "color": "#13c2c2",
    "path": "/encoding-and-decoding/unicode-converter"
  },
  {
    "id": "gzip-tools",
    "name": "Gzip Compress / Decompress",
    "description": "Compress and decompress text using Gzip with Base64 encoding",
    "category": "Encoding & Decoding",
    "tags": [
      "gzip",
      "compress",
      "decompress",
      "zip",
      "deflate"
    ],
    "color": "#52c41a",
    "path": "/encoding-and-decoding/gzip-tools"
  },
  {
    "id": "string-escape",
    "name": "String Escape / Unescape",
    "description": "Escape and unescape strings for JSON, XML, HTML, JavaScript, SQL, and CSV",
    "category": "Encoding & Decoding",
    "tags": [
      "escape",
      "unescape",
      "json",
      "xml",
      "html",
      "javascript",
      "sql",
      "csv"
    ],
    "color": "#eb2f96",
    "path": "/encoding-and-decoding/string-escape"
  },
  {
    "id": "hex-converter",
    "name": "Hex Encoder / Decoder",
    "description": "Encode text to hexadecimal and decode hex strings back to text (UTF-8)",
    "category": "Encoding & Decoding",
    "tags": [
      "hex",
      "hexadecimal",
      "encode",
      "decode",
      "utf-8",
      "binary"
    ],
    "color": "#fa8c16",
    "path": "/encoding-and-decoding/hex-converter"
  },
  {
    "id": "hash-generator",
    "name": "Hash Generator",
    "description": "Generate MD5, SHA-1, SHA-2, Keccak and RIPEMD-160 text hashes",
    "category": "Cryptography",
    "tags": [
      "hash",
      "md5",
      "sha",
      "keccak",
      "ripemd",
      "checksum",
      "digest"
    ],
    "color": "#f5222d",
    "path": "/cryptography/hash-generator"
  },
  {
    "id": "hmac-generator",
    "name": "HMAC Generator",
    "description": "Generate HMAC signatures using SHA-1, SHA-256, SHA-384, SHA-512 algorithms",
    "category": "Cryptography",
    "tags": [
      "hmac",
      "sha",
      "signature",
      "auth",
      "hash",
      "security",
      "digest"
    ],
    "color": "#f5222d",
    "path": "/cryptography/hmac-generator"
  },
  {
    "id": "jwt-decoder",
    "name": "JWT Decoder",
    "description": "Decode and inspect JSON Web Tokens — header, payload and signature",
    "category": "Cryptography",
    "tags": [
      "jwt",
      "token",
      "decode",
      "auth"
    ],
    "color": "#13c2c2",
    "path": "/cryptography/jwt-decoder"
  },
  {
    "id": "jws-tool",
    "name": "JWS Sign & Verify",
    "description": "Create and verify JSON Web Signatures (JWS) with HMAC, RSA, and ECDSA algorithms",
    "category": "Cryptography",
    "tags": [
      "jws",
      "signature",
      "sign",
      "verify",
      "jose",
      "rsa",
      "ecdsa",
      "hmac"
    ],
    "color": "#722ed1",
    "path": "/cryptography/jws-tool"
  },
  {
    "id": "jwe-tool",
    "name": "JWE Encrypt & Decrypt",
    "description": "Encrypt and decrypt data using JSON Web Encryption (JWE) with RSA and AES algorithms",
    "category": "Cryptography",
    "tags": [
      "jwe",
      "encrypt",
      "decrypt",
      "jose",
      "rsa",
      "aes",
      "gcm"
    ],
    "color": "#f5222d",
    "path": "/cryptography/jwe-tool"
  },
  {
    "id": "jwk-generator",
    "name": "JWK Generator",
    "description": "Generate JSON Web Keys (JWK) for RSA, EC, and symmetric algorithms",
    "category": "Cryptography",
    "tags": [
      "jwk",
      "key",
      "generate",
      "jose",
      "rsa",
      "ec",
      "symmetric"
    ],
    "color": "#fa8c16",
    "path": "/cryptography/jwk-generator"
  },
  {
    "id": "bcrypt-tool",
    "name": "BCrypt Hash & Verify",
    "description": "Generate BCrypt hashes for passwords and verify passwords against existing hashes",
    "category": "Cryptography",
    "tags": [
      "bcrypt",
      "password",
      "hash",
      "verify",
      "salt",
      "rounds",
      "auth"
    ],
    "color": "#722ed1",
    "path": "/cryptography/bcrypt-tool"
  },
  {
    "id": "aes-tool",
    "name": "AES Encrypt & Decrypt",
    "description": "Encrypt and decrypt CryptoJS-compatible AES-CBC passphrase text locally",
    "category": "Cryptography",
    "tags": [
      "aes",
      "encrypt",
      "decrypt",
      "cipher",
      "symmetric",
      "crypto",
      "security"
    ],
    "color": "#13c2c2",
    "path": "/cryptography/aes-tool"
  },
  {
    "id": "certificate-inspector",
    "name": "Certificate Inspector",
    "description": "Decode, fingerprint and convert X.509 certificates in PEM or DER; inspect live certificates from permitted public hosts.",
    "category": "Certificates & Keys",
    "tags": [
      "certificate",
      "x509",
      "pem",
      "der",
      "decode",
      "fingerprint",
      "convert",
      "parse",
      "ssl",
      "tls",
      "sha256",
      "md5"
    ],
    "color": "#eb2f96",
    "path": "/certificates-and-keys/certificate-inspector"
  },
  {
    "id": "certificate-chain-validator",
    "name": "Certificate Chain & SSL",
    "description": "Inspect live certificate chains through a disclosed server connection, or analyze pasted certificates locally",
    "category": "Certificates & Keys",
    "tags": [
      "certificate",
      "chain",
      "validate",
      "trust",
      "ca",
      "root",
      "intermediate",
      "ssl",
      "tls",
      "ct",
      "crt.sh",
      "domain"
    ],
    "color": "#13c2c2",
    "path": "/certificates-and-keys/certificate-chain-validator"
  },
  {
    "id": "certificate-generator",
    "name": "Certificate & CSR Generator",
    "description": "Generate self-signed X.509 certificates and Certificate Signing Requests (CSR) with RSA / ECDSA keys",
    "category": "Certificates & Keys",
    "tags": [
      "certificate",
      "x509",
      "self-signed",
      "csr",
      "generate",
      "ssl",
      "tls",
      "rsa",
      "ecdsa",
      "development"
    ],
    "color": "#52c41a",
    "path": "/certificates-and-keys/certificate-generator"
  },
  {
    "id": "pkcs12-tool",
    "name": "PKCS#12 / PFX Tool",
    "description": "Create, extract, and convert PKCS#12/PFX files containing certificates and private keys",
    "category": "Certificates & Keys",
    "tags": [
      "pkcs12",
      "pfx",
      "p12",
      "keystore",
      "certificate",
      "private key",
      "export",
      "import"
    ],
    "color": "#f5222d",
    "path": "/certificates-and-keys/pkcs12-tool"
  },
  {
    "id": "jks-tool",
    "name": "Java KeyStore (JKS) Tool",
    "description": "Build PKCS#12 files from PEM and prepare Java keytool commands for JKS workflows",
    "category": "Certificates & Keys",
    "tags": [
      "jks",
      "keystore",
      "java",
      "certificate",
      "key",
      "truststore",
      "keytool"
    ],
    "color": "#fa541c",
    "path": "/certificates-and-keys/jks-tool"
  },
  {
    "id": "key-pair-generator",
    "name": "Key Pair Generator",
    "description": "Generate RSA, ECDSA, and Ed25519 key pairs in PEM and other formats",
    "category": "Certificates & Keys",
    "tags": [
      "key",
      "rsa",
      "ecdsa",
      "ed25519",
      "generate",
      "private",
      "public",
      "pem"
    ],
    "color": "#597ef7",
    "path": "/certificates-and-keys/key-pair-generator"
  },
  {
    "id": "ssh-key-generator",
    "name": "SSH Key Generator",
    "description": "Generate local RSA, ECDSA and Ed25519 OpenSSH keys with SHA-256 fingerprints",
    "category": "Certificates & Keys",
    "tags": [
      "ssh",
      "key",
      "rsa",
      "ecdsa",
      "ed25519",
      "generate",
      "openssh"
    ],
    "color": "#1890ff",
    "path": "/certificates-and-keys/ssh-key-generator"
  },
  {
    "id": "swagger-ui",
    "name": "Swagger / OpenAPI Viewer",
    "description": "Paste or upload an OpenAPI spec and get interactive API documentation",
    "category": "API & Web Services",
    "tags": [
      "swagger",
      "openapi",
      "api",
      "rest"
    ],
    "color": "#52c41a",
    "path": "/api-and-web-services/swagger-ui"
  },
  {
    "id": "asyncapi-explorer",
    "name": "AsyncAPI Explorer",
    "description": "Inspect AsyncAPI event contracts, channels, operations, servers, and messages",
    "category": "API & Web Services",
    "tags": [
      "asyncapi",
      "event",
      "kafka",
      "mqtt",
      "websocket",
      "api"
    ],
    "color": "#722ed1",
    "path": "/api-and-web-services/asyncapi-explorer"
  },
  {
    "id": "oauth-oidc-playground",
    "name": "OAuth / OIDC & PKCE Playground",
    "description": "Inspect OAuth discovery metadata and generate local PKCE S256 values",
    "category": "API & Web Services",
    "tags": [
      "oauth",
      "oidc",
      "pkce",
      "openid",
      "authentication",
      "security"
    ],
    "color": "#1d39c4",
    "path": "/api-and-web-services/oauth-oidc-playground"
  },
  {
    "id": "webauthn-passkey-playground",
    "name": "WebAuthn / Passkey Playground",
    "description": "Inspect WebAuthn credential response metadata locally",
    "category": "Certificates & Keys",
    "tags": [
      "webauthn",
      "passkey",
      "fido",
      "credential",
      "authentication",
      "security"
    ],
    "color": "#237804",
    "path": "/certificates-and-keys/webauthn-passkey-playground"
  },
  {
    "id": "api-request-builder",
    "name": "API Request Builder",
    "description": "Test HTTP and gRPC APIs, run request collections and start local mock servers",
    "category": "API & Web Services",
    "tags": [
      "api",
      "http",
      "request",
      "rest",
      "postman",
      "curl",
      "grpc",
      "mock",
      "collection",
      "runner"
    ],
    "color": "#52c41a",
    "path": "/api-and-web-services/api-request-builder"
  },
  {
    "id": "json-path-tester",
    "name": "JSONPath Tester",
    "description": "Query JSON with JSONPath or JMESPath, with examples and precision-aware input handling",
    "category": "API & Web Services",
    "tags": [
      "json",
      "jsonpath",
      "jmespath",
      "query",
      "filter",
      "api"
    ],
    "color": "#722ed1",
    "path": "/api-and-web-services/json-path-tester"
  },
  {
    "id": "url-parser",
    "name": "URL Parser",
    "description": "Parse and analyze URLs into components: protocol, host, path, query, fragment",
    "category": "API & Web Services",
    "tags": [
      "url",
      "parse",
      "query",
      "string",
      "analyze"
    ],
    "color": "#1677ff",
    "path": "/api-and-web-services/url-parser"
  },
  {
    "id": "wsdl-parser",
    "name": "WSDL Parser",
    "description": "Parse and visualize WSDL files, view services, ports, operations, and messages",
    "category": "API & Web Services",
    "tags": [
      "wsdl",
      "soap",
      "xml",
      "webservice",
      "parse",
      "api"
    ],
    "color": "#722ed1",
    "path": "/api-and-web-services/wsdl-parser"
  },
  {
    "id": "soap-client",
    "name": "SOAP Client",
    "description": "Test SOAP web services by sending requests and viewing responses",
    "category": "API & Web Services",
    "tags": [
      "soap",
      "wsdl",
      "xml",
      "webservice",
      "test",
      "api"
    ],
    "color": "#fa541c",
    "path": "/api-and-web-services/soap-client"
  },
  {
    "id": "ip-address-tools",
    "name": "IP Address Tools",
    "description": "Validate, parse, and convert IPv4/IPv6 addresses with detailed information",
    "category": "Network",
    "tags": [
      "ip",
      "ipv4",
      "ipv6",
      "network",
      "validate",
      "parse",
      "address"
    ],
    "color": "#1890ff",
    "path": "/network/ip-address-tools"
  },
  {
    "id": "subnet-calculator",
    "name": "Subnet Calculator",
    "description": "Calculate subnet masks, network ranges, CIDR notation, and available hosts",
    "category": "Network",
    "tags": [
      "subnet",
      "cidr",
      "network",
      "mask",
      "ip",
      "range",
      "calculate"
    ],
    "color": "#52c41a",
    "path": "/network/subnet-calculator"
  },
  {
    "id": "mac-address-tools",
    "name": "MAC Address Tools",
    "description": "Validate, format, and generate MAC addresses with vendor lookup",
    "category": "Network",
    "tags": [
      "mac",
      "address",
      "network",
      "hardware",
      "validate",
      "vendor"
    ],
    "color": "#722ed1",
    "path": "/network/mac-address-tools"
  },
  {
    "id": "uuid-generator",
    "name": "UUID Generator & Inspector",
    "description": "Generate UUIDv3/v5 namespace IDs, random UUIDv4, time-ordered UUIDv7 and ULIDs; inspect versions and timestamps",
    "category": "Generators",
    "tags": [
      "uuid",
      "guid",
      "random",
      "id",
      "ulid",
      "namespace",
      "v3",
      "v4",
      "v5",
      "v7"
    ],
    "color": "#eb2f96",
    "path": "/generators/uuid-generator"
  },
  {
    "id": "password-generator",
    "name": "Password Generator",
    "description": "Generate secure random passwords with customizable length and character sets",
    "category": "Generators",
    "tags": [
      "password",
      "secure",
      "random",
      "generate",
      "security"
    ],
    "color": "#52c41a",
    "path": "/generators/password-generator"
  },
  {
    "id": "credit-card-generator",
    "name": "Credit Card Generator",
    "description": "Generate synthetic Luhn-valid card fixtures with security codes and expiry dates",
    "category": "Generators",
    "tags": [
      "credit",
      "card",
      "generate",
      "test",
      "luhn",
      "cvv",
      "payment"
    ],
    "color": "#0891b2",
    "path": "/generators/credit-card-generator"
  },
  {
    "id": "lorem-ipsum",
    "name": "Lorem Ipsum Generator",
    "description": "Generate placeholder text in paragraphs, sentences, or words",
    "category": "Generators",
    "tags": [
      "lorem",
      "ipsum",
      "placeholder",
      "text",
      "dummy"
    ],
    "color": "#13c2c2",
    "path": "/generators/lorem-ipsum"
  },
  {
    "id": "qrcode-generator",
    "name": "QR Code Generator",
    "description": "Generate QR codes from text, URLs, or data with customization options",
    "category": "Generators",
    "tags": [
      "qr",
      "qrcode",
      "barcode",
      "generate",
      "scan"
    ],
    "color": "#1677ff",
    "path": "/generators/qrcode-generator"
  },
  {
    "id": "markdown-table",
    "name": "Markdown Table Generator",
    "description": "Create and edit markdown tables with a visual spreadsheet interface",
    "category": "Generators",
    "tags": [
      "markdown",
      "table",
      "generator",
      "spreadsheet",
      "md"
    ],
    "color": "#1677ff",
    "path": "/generators/markdown-table"
  },
  {
    "id": "java-pojo-generator",
    "name": "Java POJO Generator",
    "description": "Generate Java classes, records, interfaces from JSON/XML or convert Java to JSON/XML",
    "category": "Generators",
    "tags": [
      "java",
      "pojo",
      "class",
      "record",
      "interface",
      "dto",
      "json",
      "xml",
      "code",
      "generator"
    ],
    "color": "#597ef7",
    "path": "/generators/java-pojo-generator"
  },
  {
    "id": "json-to-typescript",
    "name": "JSON to TypeScript",
    "description": "Convert JSON objects to TypeScript interfaces and types automatically",
    "category": "Generators",
    "tags": [
      "json",
      "typescript",
      "interface",
      "type",
      "convert",
      "ts"
    ],
    "color": "#1677ff",
    "path": "/generators/json-to-typescript"
  },
  {
    "id": "slug-generator",
    "name": "Slug Generator",
    "description": "Generate URL-safe slugs from any text — supports unicode, custom separators",
    "category": "Generators",
    "tags": [
      "slug",
      "url",
      "permalink",
      "seo",
      "kebab",
      "generator"
    ],
    "color": "#fa541c",
    "path": "/generators/slug-generator"
  },
  {
    "id": "color-contrast-checker",
    "name": "Color Contrast Checker",
    "description": "Check WCAG contrast ratios between foreground and background colors",
    "category": "Generators",
    "tags": [
      "color",
      "contrast",
      "wcag",
      "accessibility",
      "a11y",
      "checker",
      "aa",
      "aaa"
    ],
    "color": "#52c41a",
    "path": "/generators/color-contrast-checker"
  },
  {
    "id": "text-tools",
    "name": "Text Manipulation Tools",
    "description": "Sort lines, remove duplicates, trim whitespace, count words and more",
    "category": "Text & Utilities",
    "tags": [
      "text",
      "sort",
      "unique",
      "trim",
      "count",
      "lines",
      "words"
    ],
    "color": "#eb2f96",
    "path": "/text-and-utilities/text-tools"
  },
  {
    "id": "markdown-preview",
    "name": "Markdown Preview",
    "description": "Write Markdown and see a live rendered preview side by side",
    "category": "Text & Utilities",
    "tags": [
      "markdown",
      "preview",
      "md"
    ],
    "color": "#1677ff",
    "path": "/text-and-utilities/markdown-preview"
  },
  {
    "id": "mermaid-viewer",
    "name": "Mermaid Viewer",
    "description": "Render and preview Mermaid diagrams with live editing, theme support, and SVG export",
    "category": "Text & Utilities",
    "tags": [
      "mermaid",
      "diagram",
      "flowchart",
      "preview",
      "render",
      "svg",
      "chart"
    ],
    "color": "#667eea",
    "path": "/text-and-utilities/mermaid-viewer"
  },
  {
    "id": "case-converter",
    "name": "String Case Converter",
    "description": "Convert text between camelCase, snake_case, PascalCase, kebab-case and more",
    "category": "Text & Utilities",
    "tags": [
      "case",
      "camel",
      "snake",
      "pascal",
      "kebab",
      "convert",
      "string"
    ],
    "color": "#722ed1",
    "path": "/text-and-utilities/case-converter"
  },
  {
    "id": "timestamp-converter",
    "name": "Timestamp Converter",
    "description": "Convert between Unix timestamps and human-readable dates",
    "category": "Text & Utilities",
    "tags": [
      "timestamp",
      "unix",
      "epoch",
      "date",
      "time"
    ],
    "color": "#faad14",
    "path": "/text-and-utilities/timestamp-converter"
  },
  {
    "id": "color-picker",
    "name": "Color Picker & Converter",
    "description": "Pick colors and convert between HEX, RGB, HSL formats",
    "category": "Text & Utilities",
    "tags": [
      "color",
      "hex",
      "rgb",
      "hsl",
      "picker"
    ],
    "color": "#eb2f96",
    "path": "/text-and-utilities/color-picker"
  },
  {
    "id": "number-base",
    "name": "Number Base Converter",
    "description": "Convert exact signed integers between any bases from 2 through 36",
    "category": "Text & Utilities",
    "tags": [
      "binary",
      "hex",
      "octal",
      "decimal",
      "number"
    ],
    "color": "#13c2c2",
    "path": "/text-and-utilities/number-base"
  },
  {
    "id": "unix-permissions",
    "name": "Unix Permissions Calculator",
    "description": "Calculate chmod numeric values and understand file permission bits",
    "category": "Text & Utilities",
    "tags": [
      "unix",
      "chmod",
      "permissions",
      "linux",
      "file",
      "rwx"
    ],
    "color": "#fa541c",
    "path": "/text-and-utilities/unix-permissions"
  },
  {
    "id": "cron-parser",
    "name": "Cron Expression Parser",
    "description": "Parse, validate and explain cron expressions with next run times",
    "category": "Text & Utilities",
    "tags": [
      "cron",
      "schedule",
      "job",
      "timer",
      "parse",
      "expression"
    ],
    "color": "#faad14",
    "path": "/text-and-utilities/cron-parser"
  },
  {
    "id": "todo-list",
    "name": "Personal Todo List",
    "description": "Production-grade task manager with IndexedDB storage, categories, archive, trash, import/export, subtasks, and more",
    "category": "Text & Utilities",
    "tags": [
      "todo",
      "task",
      "productivity",
      "tracker",
      "list",
      "planner",
      "indexeddb",
      "offline",
      "archive",
      "subtasks"
    ],
    "color": "#52c41a",
    "path": "/text-and-utilities/todo-list"
  },
  {
    "id": "sticky-notes",
    "name": "Sticky Notes",
    "description": "Create, organize, and persist colorful sticky notes in your browser — pin, color-code, search, and delete with full localStorage memory",
    "category": "Text & Utilities",
    "tags": [
      "notes",
      "sticky",
      "memo",
      "reminder",
      "pin",
      "organize",
      "productivity",
      "offline"
    ],
    "color": "#f59e0b",
    "path": "/text-and-utilities/sticky-notes"
  },
  {
    "id": "rich-text-editor",
    "name": "Rich Text Editor",
    "description": "WYSIWYG document editor with full formatting (bold, headings, lists, links, colors), multiple documents, local save, source view, and export",
    "category": "Text & Utilities",
    "tags": [
      "editor",
      "wysiwyg",
      "rich text",
      "notepad",
      "document",
      "format",
      "bold",
      "italic",
      "word processor"
    ],
    "color": "#0891b2",
    "path": "/text-and-utilities/rich-text-editor"
  },
  {
    "id": "mcp-inspector",
    "name": "MCP Inspector",
    "description": "Connect to any Model Context Protocol server, browse tools, and call them interactively over SSE or HTTP",
    "category": "Artificial Intelligence",
    "tags": [
      "mcp",
      "model-context-protocol",
      "ai",
      "tools",
      "llm",
      "agent",
      "sse",
      "http",
      "stdio"
    ],
    "color": "#6366f1",
    "path": "/artificial-intelligence/mcp-inspector"
  },
  {
    "id": "a2a-inspector",
    "name": "A2A Inspector",
    "description": "Inspect Agent-to-Agent cards, check selected fields, exchange messages and view raw JSON-RPC 2.0 responses",
    "category": "Artificial Intelligence",
    "tags": [
      "a2a",
      "agent",
      "protocol",
      "jsonrpc",
      "ai",
      "multi-agent",
      "chat",
      "inspect"
    ],
    "color": "#0891b2",
    "path": "/artificial-intelligence/a2a-inspector"
  },
  {
    "id": "token-counter",
    "name": "LLM Token Counter",
    "description": "Count tokens and estimate context-window usage across GPT, Claude, and open models",
    "category": "Artificial Intelligence",
    "tags": [
      "tokens",
      "llm",
      "gpt",
      "claude",
      "context window",
      "tokenizer",
      "ai",
      "cost",
      "budget"
    ],
    "color": "#13c2c2",
    "path": "/artificial-intelligence/token-counter"
  },
  {
    "id": "jsonl-validator",
    "name": "Fine-Tuning Dataset Validator",
    "description": "Validate JSONL fine-tuning datasets against OpenAI or Anthropic message schemas — entirely in your browser",
    "category": "Artificial Intelligence",
    "tags": [
      "jsonl",
      "fine-tuning",
      "dataset",
      "openai",
      "anthropic",
      "validator",
      "ai",
      "training data"
    ],
    "color": "#722ed1",
    "path": "/artificial-intelligence/jsonl-validator"
  },
  {
    "id": "agent-manifest-generator",
    "name": "Agent Card / MCP Manifest Generator",
    "description": "Build a valid A2A agent-card.json or MCP server config, then send it straight to the A2A or MCP inspector to test",
    "category": "Artificial Intelligence",
    "tags": [
      "a2a",
      "agent card",
      "mcp",
      "manifest",
      "generator",
      "ai",
      "agent",
      "config"
    ],
    "color": "#0891b2",
    "path": "/artificial-intelligence/agent-manifest-generator"
  },
  {
    "id": "rag-search",
    "name": "Semantic Search Playground",
    "description": "Real embedding-based search over your own text, computed entirely in your browser — no server, no API key",
    "category": "Artificial Intelligence",
    "tags": [
      "semantic search",
      "embeddings",
      "rag",
      "vector search",
      "ai",
      "webgpu",
      "similarity"
    ],
    "color": "#9254de",
    "path": "/artificial-intelligence/rag-search"
  },
  {
    "id": "http-status-codes",
    "name": "HTTP Status Codes Reference",
    "description": "Selected HTTP status codes with explanations, examples and primary sources",
    "category": "Reference",
    "tags": [
      "http",
      "status",
      "codes",
      "api",
      "rest",
      "response",
      "reference",
      "documentation",
      "1xx",
      "2xx",
      "3xx",
      "4xx",
      "5xx"
    ],
    "color": "#fa8c16",
    "path": "/reference/http-status-codes"
  },
  {
    "id": "mime-types",
    "name": "MIME Types Reference",
    "description": "Comprehensive searchable database of MIME types (Content-Types) with file extensions, categories, and usage examples for web development, file uploads, and HTTP headers",
    "category": "Reference",
    "tags": [
      "mime",
      "content-type",
      "file",
      "extension",
      "reference",
      "media",
      "type",
      "http",
      "headers",
      "upload"
    ],
    "color": "#fa8c16",
    "path": "/reference/mime-types"
  },
  {
    "id": "port-reference",
    "name": "Port Number Reference",
    "description": "Local reference of selected common ports, protocols and service conventions",
    "category": "Reference",
    "tags": [
      "port",
      "network",
      "tcp",
      "udp",
      "protocol",
      "service",
      "reference"
    ],
    "color": "#13c2c2",
    "path": "/reference/port-reference"
  },
  {
    "id": "model-pricing-reference",
    "name": "Model & Pricing Comparison",
    "description": "Compare context windows, output limits and per-token pricing across major LLM providers",
    "category": "Reference",
    "tags": [
      "llm",
      "pricing",
      "model",
      "ai",
      "cost",
      "comparison",
      "context window",
      "tokens",
      "reference"
    ],
    "color": "#fa8c16",
    "path": "/reference/model-pricing-reference"
  },
  {
    "id": "ip-ranges-reference",
    "name": "IP Ranges Reference",
    "description": "Reference guide for private, reserved, and special-use IP address ranges",
    "category": "Reference",
    "tags": [
      "ip",
      "range",
      "private",
      "reserved",
      "network",
      "reference",
      "cidr"
    ],
    "color": "#eb2f96",
    "path": "/reference/ip-ranges-reference"
  },
  {
    "id": "rfc-standards",
    "name": "RFC Standards Reference",
    "description": "Selected RFCs with explanations, maturity levels and replacement links",
    "category": "Reference",
    "tags": [
      "rfc",
      "standards",
      "jwt",
      "jwe",
      "jws",
      "oauth",
      "http",
      "tls",
      "ssl",
      "security",
      "protocol",
      "ietf",
      "specification"
    ],
    "color": "#722ed1",
    "path": "/reference/rfc-standards"
  },
  {
    "id": "coin-toss",
    "name": "Coin Toss",
    "description": "Flip a fair virtual coin with 3D animation — heads or tails with flip statistics",
    "category": "Fun & Games",
    "tags": [
      "coin",
      "flip",
      "random",
      "heads",
      "tails",
      "chance",
      "probability",
      "fun"
    ],
    "color": "#f59e0b",
    "path": "/fun-and-games/coin-toss"
  },
  {
    "id": "dice-roll",
    "name": "Dice Roll",
    "description": "Roll polyhedral dice (d4–d20) with advantage/disadvantage mode for TTRPGs and probability experiments",
    "category": "Fun & Games",
    "tags": [
      "dice",
      "roll",
      "d6",
      "d20",
      "random",
      "rpg",
      "ttrpg",
      "dnd",
      "probability",
      "fun"
    ],
    "color": "#8b5cf6",
    "path": "/fun-and-games/dice-roll"
  },
  {
    "id": "timer",
    "name": "Timer",
    "description": "Countdown timer with presets, custom duration, audio chime, and Pomodoro support — runs entirely in your browser",
    "category": "Fun & Games",
    "tags": [
      "timer",
      "countdown",
      "pomodoro",
      "alarm",
      "focus",
      "productivity"
    ],
    "color": "#6366f1",
    "path": "/fun-and-games/timer"
  },
  {
    "id": "stopwatch",
    "name": "Stopwatch",
    "description": "Browser stopwatch with lap splits, best/worst lap highlighting and a millisecond display; timing depends on browser scheduling",
    "category": "Fun & Games",
    "tags": [
      "stopwatch",
      "timer",
      "lap",
      "split",
      "timing",
      "benchmark",
      "interval"
    ],
    "color": "#6366f1",
    "path": "/fun-and-games/stopwatch"
  },
  {
    "id": "spin-wheel",
    "name": "Spin the Wheel",
    "description": "Animated prize wheel — add up to 12 custom options and spin to pick a random winner",
    "category": "Fun & Games",
    "tags": [
      "spin",
      "wheel",
      "random",
      "decision",
      "picker",
      "fortune",
      "fun",
      "game",
      "raffle"
    ],
    "color": "#f97316",
    "path": "/fun-and-games/spin-wheel"
  },
  {
    "id": "magic-8ball",
    "name": "Magic 8-Ball",
    "description": "Ask a yes/no question and let the classic Magic 8-Ball reveal your fate with all 20 original responses",
    "category": "Fun & Games",
    "tags": [
      "magic",
      "8ball",
      "fortune",
      "decision",
      "random",
      "fun",
      "oracle",
      "fate"
    ],
    "color": "#6366f1",
    "path": "/fun-and-games/magic-8ball"
  },
  {
    "id": "typing-test",
    "name": "Typing Speed Test",
    "description": "Measure your WPM with real-time character highlighting, accuracy tracking, and timed test modes",
    "category": "Fun & Games",
    "tags": [
      "typing",
      "wpm",
      "speed",
      "accuracy",
      "keyboard",
      "practice",
      "benchmark"
    ],
    "color": "#06b6d4",
    "path": "/fun-and-games/typing-test"
  },
  {
    "id": "webhook-receiver",
    "name": "Webhook Receiver",
    "description": "Generate a unique inbound URL, capture incoming HTTP requests in real time, and inspect headers and body",
    "category": "Network",
    "tags": [
      "webhook",
      "receiver",
      "inspector",
      "http",
      "callback",
      "debug",
      "tunnel"
    ],
    "color": "#0891b2",
    "path": "/network/webhook-receiver"
  },
  {
    "id": "websocket-tester",
    "name": "WebSocket Tester",
    "description": "Connect to ws:// and wss:// endpoints, send messages, watch frames stream in with timestamped history",
    "category": "Network",
    "tags": [
      "websocket",
      "ws",
      "wss",
      "socket",
      "realtime",
      "tester",
      "debug"
    ],
    "color": "#06b6d4",
    "path": "/network/websocket-tester"
  },
  {
    "id": "cors-tester",
    "name": "CORS Tester",
    "description": "Test requests from this browser origin, inspect exposed CORS headers and review possible causes of opaque failures",
    "category": "Network",
    "tags": [
      "cors",
      "preflight",
      "origin",
      "access-control",
      "tester",
      "http",
      "debug"
    ],
    "color": "#22d3ee",
    "path": "/network/cors-tester"
  },
  {
    "id": "dns-lookup",
    "name": "DNS Lookup",
    "description": "Resolve A, AAAA, CNAME, MX, TXT, NS, SOA records for any hostname using public DNS-over-HTTPS resolvers",
    "category": "Network",
    "tags": [
      "dns",
      "lookup",
      "resolve",
      "mx",
      "txt",
      "ns",
      "soa",
      "doh",
      "domain",
      "whois"
    ],
    "color": "#1890ff",
    "path": "/network/dns-lookup"
  },
  {
    "id": "security-headers-analyzer",
    "name": "Security Headers & CSP Analyzer",
    "description": "Audit pasted HTTP response headers and Content Security Policy rules",
    "category": "Network",
    "tags": [
      "security",
      "headers",
      "csp",
      "hsts",
      "http",
      "permissions-policy"
    ],
    "color": "#cf1322",
    "path": "/network/security-headers-analyzer"
  },
  {
    "id": "docker-compose-analyzer",
    "name": "Docker Compose Analyzer",
    "description": "Review Compose YAML services, ports, networks, volumes, and hygiene",
    "category": "Network",
    "tags": [
      "docker",
      "compose",
      "container",
      "yaml",
      "network",
      "devops"
    ],
    "color": "#2496ed",
    "path": "/network/docker-compose-analyzer"
  },
  {
    "id": "image-diff",
    "name": "Image Diff",
    "description": "Pixel-perfect visual comparison: side-by-side, overlay, and difference modes with adjustable tolerance",
    "category": "Diff & Compare",
    "tags": [
      "image",
      "diff",
      "compare",
      "pixel",
      "visual",
      "regression",
      "screenshot"
    ],
    "color": "#fa541c",
    "path": "/diff-and-compare/image-diff"
  },
  {
    "id": "csv-diff",
    "name": "CSV Diff",
    "description": "Row-keyed CSV comparison with column-level change highlighting — handles added, removed, and modified rows",
    "category": "Diff & Compare",
    "tags": [
      "csv",
      "diff",
      "compare",
      "spreadsheet",
      "row",
      "column",
      "data"
    ],
    "color": "#fa8c16",
    "path": "/diff-and-compare/csv-diff"
  },
  {
    "id": "image-compressor",
    "name": "Image Compressor",
    "description": "Compress JPEG, PNG and WebP in your browser with quality slider and live before/after preview",
    "category": "Image & Media",
    "tags": [
      "image",
      "compress",
      "jpeg",
      "png",
      "webp",
      "optimize",
      "lossy",
      "size"
    ],
    "color": "#0ea5e9",
    "path": "/image-and-media/image-compressor"
  },
  {
    "id": "image-resizer",
    "name": "Image Resizer",
    "description": "Resize JPEG, PNG and WebP by pixels, percentage, or preset — fit, fill or stretch, all in your browser",
    "category": "Image & Media",
    "tags": [
      "image",
      "resize",
      "scale",
      "dimensions",
      "thumbnail",
      "jpeg",
      "png",
      "webp"
    ],
    "color": "#0284c7",
    "path": "/image-and-media/image-resizer"
  },
  {
    "id": "svg-optimizer",
    "name": "SVG Optimizer",
    "description": "Shrink SVG markup by stripping editor metadata, collapsing transforms and rounding numeric precision",
    "category": "Image & Media",
    "tags": [
      "svg",
      "optimize",
      "minify",
      "vector",
      "shrink",
      "clean",
      "svgo"
    ],
    "color": "#38bdf8",
    "path": "/image-and-media/svg-optimizer"
  },
  {
    "id": "favicon-generator",
    "name": "Favicon, ICO & Maskable Generator",
    "description": "Generate PNG favicons, a six-size ICO, a safe-zone maskable icon and matching manifest in one ZIP",
    "category": "Image & Media",
    "tags": [
      "favicon",
      "icon",
      "apple-touch-icon",
      "manifest",
      "generator",
      "png",
      "ico"
    ],
    "color": "#0284c7",
    "path": "/image-and-media/favicon-generator"
  },
  {
    "id": "color-palette-extractor",
    "name": "Color Palette Extractor",
    "description": "Extract the dominant colours from any image — outputs HEX, RGB and HSL values ready to copy",
    "category": "Image & Media",
    "tags": [
      "color",
      "palette",
      "extract",
      "dominant",
      "image",
      "hex",
      "rgb",
      "swatch"
    ],
    "color": "#0369a1",
    "path": "/image-and-media/color-palette-extractor"
  },
  {
    "id": "exif-viewer",
    "name": "Image Metadata Viewer & Remover",
    "description": "Inspect image metadata, remove JPEG/PNG/WebP metadata without re-encoding, and convert supported formats locally",
    "category": "Image & Media",
    "tags": [
      "exif",
      "metadata",
      "jpeg",
      "png",
      "webp",
      "tiff",
      "avif",
      "heic",
      "gps",
      "photo",
      "iptc",
      "remove",
      "privacy"
    ],
    "color": "#0c4a6e",
    "path": "/image-and-media/exif-viewer"
  },
  {
    "id": "mock-data-generator",
    "name": "Mock Data Generator",
    "description": "Generate fake but realistic data (names, emails, dates, lorem) as JSON, CSV or SQL inserts",
    "category": "Data Converters",
    "tags": [
      "mock",
      "fake",
      "data",
      "generator",
      "fixtures",
      "seed",
      "test",
      "json",
      "csv"
    ],
    "color": "#f59e0b",
    "path": "/data-converters/mock-data-generator"
  },
  {
    "id": "toml-converter",
    "name": "JSON / YAML / TOML / XML Converter",
    "description": "Convert in all twelve directions between JSON, YAML, TOML and XML with explicit mapping limits",
    "category": "Data Converters",
    "tags": [
      "toml",
      "json",
      "yaml",
      "xml",
      "convert",
      "config",
      "transform"
    ],
    "color": "#a16207",
    "path": "/data-converters/toml-converter"
  },
  {
    "id": "toon-converter",
    "name": "TOON Converter",
    "description": "Convert JSON or XML to TOON (Token-Oriented Object Notation) — a compact, LLM-friendly format with live character savings",
    "category": "Data Converters",
    "tags": [
      "toon",
      "json",
      "xml",
      "convert",
      "tokens",
      "llm",
      "compact",
      "compression"
    ],
    "color": "#7c3aed",
    "path": "/data-converters/toon-converter"
  }
];

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
export const SITE_URL = "https://mydevtools.com";
export const SITE_TAGLINE = "Free Online Developer Tools — 100% Client-Side";
export const SITE_DESCRIPTION =
    "Free, fast, privacy-first developer tools that run entirely in your browser. Format, validate, convert, encode, decode, generate and inspect — no signup, no upload, no tracking.";

export const SEO_CONTENT: Record<string, ToolSeoContent> = {
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
        title: "XSD Schema Validator — Validate XML Against XSD Online",
        description:
            "Validate XML documents against XSD schemas online. Get detailed schema violation reports, type mismatches and missing element errors. Free and private.",
        keywords: [
            "xsd validator",
            "xml schema validator",
            "validate xsd online",
            "xsd checker",
            "xml against xsd",
            "schema validation tool",
            "xsd test",
        ],
    },
    "credit-card-validator": {
        title: "Credit Card Validator (Luhn) — Generate Test Card Numbers Free",
        description:
            "Validate credit card numbers using the Luhn algorithm. Detect card brand (Visa, Mastercard, Amex, Discover) and generate valid test card numbers for development.",
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
        title: "Hash Generator — MD5, SHA-1, SHA-256, SHA-512, SHA-3 Online",
        description:
            "Generate cryptographic hashes (MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA-3, RIPEMD-160) for text and files. Free, instant, fully client-side.",
        keywords: [
            "hash generator",
            "md5 generator",
            "sha-256 generator",
            "sha256 hash online",
            "sha-512 hash",
            "sha-3 hash",
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
        title: "Java KeyStore (JKS) Tool — Create, View, Convert JKS Files",
        description:
            "Create, inspect and manage Java KeyStore (.jks) files. Import/export certificates and keys, convert JKS to PKCS#12 and back. Free keytool alternative.",
        keywords: [
            "jks tool",
            "java keystore tool",
            "jks viewer",
            "jks creator",
            "keytool alternative",
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
            "Generate cryptographic key pairs — RSA (2048/3072/4096), ECDSA (P-256/384/521) and Ed25519 — in PEM, JWK and OpenSSH formats. Free, in-browser.",
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
            "Generate SSH key pairs (RSA, ECDSA, Ed25519) with optional passphrase protection. OpenSSH format ready to paste into GitHub, GitLab or ~/.ssh. Free.",
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
        title: "API Request Builder — Test REST APIs (Postman-Style) Online",
        description:
            "Build, send and test HTTP REST API requests with custom headers, query params, body and authentication. Lightweight Postman-style API client. Free.",
        keywords: [
            "api request builder",
            "rest api tester",
            "http request builder",
            "online postman alternative",
            "test api online",
            "curl builder",
            "api client online",
            "rest client",
        ],
    },
    "json-path-tester": {
        title: "JSONPath Tester — Test and Evaluate JSONPath Expressions",
        description:
            "Test JSONPath expressions against JSON documents in real time. Live result preview, syntax help, recursive descent and filter expressions. Free.",
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
        title: "UUID Generator — Generate UUID v4 (GUID) Online in Bulk",
        description:
            "Generate cryptographically random UUID v4 (GUID) identifiers in bulk. Up to thousands at a time. Free, instant, RFC 4122 compliant — no signup.",
        keywords: [
            "uuid generator",
            "guid generator",
            "uuid v4 generator",
            "random uuid",
            "bulk uuid generator",
            "rfc 4122 uuid",
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
    "lorem-ipsum": {
        title: "Lorem Ipsum Generator — Placeholder Text in Words, Sentences",
        description:
            "Generate Lorem Ipsum placeholder text in words, sentences, paragraphs or HTML. Custom length, start with classic phrase. Free, copy with one click.",
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
            "Convert JSON objects to TypeScript interfaces and types automatically. Type inference, optional fields and nested types. Free JSON-to-TS tool.",
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
        title: "Number Base Converter — Decimal, Binary, Octal, Hex Online",
        description:
            "Convert numbers between decimal, binary, octal and hexadecimal bases. Supports negative numbers, two's complement and arbitrary precision. Free.",
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

    // ===== AI Alpha Tools =====
    "rag-search": {
        title: "RAG Document Q&A — Ask Questions on Your Docs (AI Alpha)",
        description:
            "Upload documents and ask natural-language questions powered by Retrieval Augmented Generation. AI-driven document search and Q&A. Alpha.",
        keywords: [
            "rag document qa",
            "ai document search",
            "retrieval augmented generation",
            "ask questions on documents",
            "ai document qa tool",
            "llm document search",
            "rag online tool",
        ],
    },
    "text-summarizer": {
        title: "AI Text Summarizer — Summarize Long Text into Key Points",
        description:
            "Summarize long articles, papers and notes into concise key points using AI. TL;DR generator with adjustable length. Alpha — may change without notice.",
        keywords: [
            "ai text summarizer",
            "tldr generator",
            "summarize text online",
            "ai article summarizer",
            "long text summarizer",
            "automatic summarizer",
            "ai summary tool",
        ],
    },
    "code-explainer": {
        title: "AI Code Explainer — Explain Code Snippets in Any Language",
        description:
            "Paste code in any language and get plain-English explanations powered by AI. Understand legacy code, learn new languages, debug faster. Alpha.",
        keywords: [
            "ai code explainer",
            "code explanation tool",
            "explain code online",
            "ai code understanding",
            "code to english",
            "legacy code explainer",
            "ai programming helper",
        ],
    },

    // ===== Reference =====
    "http-status-codes": {
        title: "HTTP Status Codes Reference — All 1xx–5xx Codes Explained",
        description:
            "Complete HTTP status codes reference: 1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error. Use cases & best practices.",
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
        title: "AES Encrypt & Decrypt Online — AES-128/192/256 with Passphrase",
        description:
            "Encrypt and decrypt text using AES-128, AES-192 or AES-256 with a passphrase. CBC mode, PBKDF2 key derivation. Free AES tool that runs in your browser.",
        keywords: [
            "aes encrypt",
            "aes decrypt",
            "aes online tool",
            "aes-256 encrypt",
            "aes-128 encrypt",
            "encrypt text online",
            "decrypt aes",
            "symmetric encryption tool",
            "passphrase encryption",
        ],
    },
    "slug-generator": {
        title: "Slug Generator — Create SEO-Friendly URL Slugs from Text",
        description:
            "Generate clean, SEO-friendly URL slugs from any text. Unicode transliteration, custom separators, lowercase, max length. Free permalink generator.",
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
};

export function getSeoContent(toolId: string): ToolSeoContent | undefined {
    return SEO_CONTENT[toolId];
}

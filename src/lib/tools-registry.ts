import {
    CodeOutlined,
    DiffOutlined,
    FileTextOutlined,
    ApiOutlined,
    LockOutlined,
    FieldTimeOutlined,
    BgColorsOutlined,
    NumberOutlined,
    LinkOutlined,
    KeyOutlined,
    FileMarkdownOutlined,
    DatabaseOutlined,
    SwapOutlined,
    SafetyCertificateOutlined,
    SearchOutlined,
    CheckSquareOutlined,
    FormatPainterOutlined,
    BranchesOutlined,
    CloudServerOutlined,
    UnlockOutlined,
    BuildOutlined,
    SettingOutlined,
    EyeOutlined,
    RocketOutlined,
    RobotOutlined,
    ClockCircleOutlined,
    FontSizeOutlined,
    FileProtectOutlined,
    TableOutlined,
    ScissorOutlined,
    ThunderboltOutlined,
    SendOutlined,
    BulbOutlined,
    FileSearchOutlined,
    TranslationOutlined,
    SafetyOutlined,
    Html5Outlined,
    CompressOutlined,
    QrcodeOutlined,
    CheckCircleOutlined,
    CreditCardOutlined,
    NodeIndexOutlined,
    FileExcelOutlined,
    GlobalOutlined,
    OrderedListOutlined,
    CloudOutlined,
    ApartmentOutlined,
    BlockOutlined,
    BookOutlined,
    WifiOutlined,
    ClusterOutlined,
    DesktopOutlined,
    SecurityScanOutlined,
    AuditOutlined,
} from "@ant-design/icons";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconComponent = React.ComponentType<any>;

export interface ToolDefinition {
    id: string;
    name: string;
    description: string;
    icon: IconComponent;
    category: ToolCategory;
    tags: string[];
    color: string;
}

export type ToolCategory =
    | "AI Tools"
    | "API Tools"
    | "Certificates"
    | "Code Generators"
    | "Converters"
    | "Diff Tools"
    | "Encoders & Decoders"
    | "Formatters"
    | "Generators"
    | "Network"
    | "Productivity"
    | "Validators"
    | "Viewers"
    | "Reference"; // Always at bottom

export const CATEGORY_COLORS: Record<ToolCategory, string> = {
    "AI Tools": "#f5222d",
    "API Tools": "#52c41a",
    Certificates: "#eb2f96",
    "Code Generators": "#597ef7",
    Converters: "#faad14",
    "Diff Tools": "#fa541c",
    "Encoders & Decoders": "#722ed1",
    Formatters: "#1677ff",
    Generators: "#eb2f96",
    Network: "#1890ff",
    Productivity: "#52c41a",
    Validators: "#52c41a",
    Viewers: "#13c2c2",
    Reference: "#fa8c16",
};

export const CATEGORY_ICONS: Record<ToolCategory, IconComponent> = {
    "AI Tools": RobotOutlined,
    "API Tools": CloudServerOutlined,
    Certificates: SafetyCertificateOutlined,
    "Code Generators": SettingOutlined,
    Converters: SwapOutlined,
    "Diff Tools": BranchesOutlined,
    "Encoders & Decoders": UnlockOutlined,
    Formatters: FormatPainterOutlined,
    Generators: BuildOutlined,
    Network: WifiOutlined,
    Productivity: RocketOutlined,
    Validators: CheckCircleOutlined,
    Viewers: EyeOutlined,
    Reference: BookOutlined,
};

export const toolsRegistry: ToolDefinition[] = [
    // Formatters
    {
        id: "json-formatter",
        name: "JSON Formatter",
        description: "Prettify, minify and validate JSON with syntax highlighting and tree view",
        icon: CodeOutlined,
        category: "Formatters",
        tags: ["json", "format", "prettify", "minify", "validate"],
        color: "#1677ff",
    },
    {
        id: "xml-formatter",
        name: "XML Formatter",
        description: "Format, prettify and validate XML documents",
        icon: FileTextOutlined,
        category: "Formatters",
        tags: ["xml", "format", "prettify", "validate"],
        color: "#52c41a",
    },
    {
        id: "sql-formatter",
        name: "SQL Formatter",
        description: "Format and beautify SQL queries",
        icon: DatabaseOutlined,
        category: "Formatters",
        tags: ["sql", "format", "query", "database"],
        color: "#faad14",
    },
    // Diff Tools
    {
        id: "json-diff",
        name: "JSON Diff",
        description: "Compare two JSON documents side by side with highlighted differences",
        icon: DiffOutlined,
        category: "Diff Tools",
        tags: ["json", "diff", "compare"],
        color: "#fa541c",
    },
    {
        id: "xml-diff",
        name: "XML Diff",
        description: "Compare two XML documents side by side with highlighted differences",
        icon: DiffOutlined,
        category: "Diff Tools",
        tags: ["xml", "diff", "compare"],
        color: "#fa8c16",
    },
    {
        id: "text-diff",
        name: "Text Diff",
        description: "Compare any two text blocks with line-by-line diff highlighting",
        icon: DiffOutlined,
        category: "Diff Tools",
        tags: ["text", "diff", "compare"],
        color: "#eb2f96",
    },
    // API Tools
    {
        id: "swagger-ui",
        name: "Swagger / OpenAPI Viewer",
        description: "Paste or upload an OpenAPI spec and get interactive API documentation",
        icon: ApiOutlined,
        category: "API Tools",
        tags: ["swagger", "openapi", "api", "rest"],
        color: "#52c41a",
    },
    // Encoders & Decoders
    {
        id: "base64",
        name: "Base64 Encode / Decode",
        description: "Encode and decode Base64 strings instantly",
        icon: SwapOutlined,
        category: "Encoders & Decoders",
        tags: ["base64", "encode", "decode"],
        color: "#722ed1",
    },
    {
        id: "jwt-decoder",
        name: "JWT Decoder",
        description: "Decode and inspect JSON Web Tokens — header, payload and signature",
        icon: SafetyCertificateOutlined,
        category: "Encoders & Decoders",
        tags: ["jwt", "token", "decode", "auth"],
        color: "#13c2c2",
    },
    {
        id: "jws-tool",
        name: "JWS Sign & Verify",
        description: "Create and verify JSON Web Signatures (JWS) with HMAC, RSA, and ECDSA algorithms",
        icon: SecurityScanOutlined,
        category: "Encoders & Decoders",
        tags: ["jws", "signature", "sign", "verify", "jose", "rsa", "ecdsa", "hmac"],
        color: "#722ed1",
    },
    {
        id: "jwe-tool",
        name: "JWE Encrypt & Decrypt",
        description: "Encrypt and decrypt data using JSON Web Encryption (JWE) with RSA and AES algorithms",
        icon: LockOutlined,
        category: "Encoders & Decoders",
        tags: ["jwe", "encrypt", "decrypt", "jose", "rsa", "aes", "gcm"],
        color: "#f5222d",
    },
    {
        id: "jwk-generator",
        name: "JWK Generator",
        description: "Generate JSON Web Keys (JWK) for RSA, EC, and symmetric algorithms",
        icon: KeyOutlined,
        category: "Encoders & Decoders",
        tags: ["jwk", "key", "generate", "jose", "rsa", "ec", "symmetric"],
        color: "#fa8c16",
    },
    {
        id: "url-encoder",
        name: "URL Encode / Decode",
        description: "Encode and decode URL components",
        icon: LinkOutlined,
        category: "Encoders & Decoders",
        tags: ["url", "encode", "decode", "uri"],
        color: "#1677ff",
    },
    {
        id: "hmac-generator",
        name: "HMAC Generator",
        description: "Generate HMAC signatures using SHA-1, SHA-256, SHA-384, SHA-512 algorithms",
        icon: SafetyOutlined,
        category: "Encoders & Decoders",
        tags: ["hmac", "sha", "signature", "auth", "hash", "security", "digest"],
        color: "#f5222d",
    },
    {
        id: "html-entities",
        name: "HTML Entities Encoder",
        description: "Encode and decode HTML entities and special characters",
        icon: Html5Outlined,
        category: "Encoders & Decoders",
        tags: ["html", "entities", "encode", "decode", "escape"],
        color: "#fa541c",
    },
    {
        id: "unicode-converter",
        name: "Unicode Converter",
        description: "Convert text to/from Unicode escape sequences, code points, and UTF-8 hex",
        icon: TranslationOutlined,
        category: "Encoders & Decoders",
        tags: ["unicode", "utf8", "escape", "codepoint", "text"],
        color: "#13c2c2",
    },
    {
        id: "gzip-tools",
        name: "Gzip Compress/Decompress",
        description: "Compress and decompress text using Gzip with Base64 encoding",
        icon: CompressOutlined,
        category: "Encoders & Decoders",
        tags: ["gzip", "compress", "decompress", "zip", "deflate"],
        color: "#52c41a",
    },
    {
        id: "qrcode-generator",
        name: "QR Code Generator",
        description: "Generate QR codes from text, URLs, or data with customization options",
        icon: QrcodeOutlined,
        category: "Generators",
        tags: ["qr", "qrcode", "barcode", "generate", "scan"],
        color: "#1677ff",
    },
    {
        id: "hash-generator",
        name: "Hash Generator",
        description: "Generate MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA-3, RIPEMD-160 hashes",
        icon: LockOutlined,
        category: "Generators",
        tags: ["hash", "md5", "sha", "sha3", "ripemd", "checksum", "digest"],
        color: "#f5222d",
    },
    {
        id: "uuid-generator",
        name: "UUID Generator",
        description: "Generate random UUIDs (v4) in bulk",
        icon: KeyOutlined,
        category: "Generators",
        tags: ["uuid", "guid", "random", "id"],
        color: "#eb2f96",
    },
    // Converters
    {
        id: "timestamp-converter",
        name: "Timestamp Converter",
        description: "Convert between Unix timestamps and human-readable dates",
        icon: FieldTimeOutlined,
        category: "Converters",
        tags: ["timestamp", "unix", "epoch", "date", "time"],
        color: "#faad14",
    },
    {
        id: "color-picker",
        name: "Color Picker & Converter",
        description: "Pick colors and convert between HEX, RGB, HSL formats",
        icon: BgColorsOutlined,
        category: "Converters",
        tags: ["color", "hex", "rgb", "hsl", "picker"],
        color: "#eb2f96",
    },
    {
        id: "number-base",
        name: "Number Base Converter",
        description: "Convert numbers between decimal, binary, octal and hexadecimal",
        icon: NumberOutlined,
        category: "Converters",
        tags: ["binary", "hex", "octal", "decimal", "number"],
        color: "#13c2c2",
    },
    // Viewers
    {
        id: "markdown-preview",
        name: "Markdown Preview",
        description: "Write Markdown and see a live rendered preview side by side",
        icon: FileMarkdownOutlined,
        category: "Viewers",
        tags: ["markdown", "preview", "md"],
        color: "#1677ff",
    },
    {
        id: "regex-tester",
        name: "Regex Tester",
        description: "Test regular expressions with live matching and group highlighting",
        icon: SearchOutlined,
        category: "Viewers",
        tags: ["regex", "regexp", "test", "match"],
        color: "#fa541c",
    },
    // Code Generators
    {
        id: "java-pojo-generator",
        name: "Java POJO Generator",
        description: "Generate Java classes, records, interfaces from JSON/XML or convert Java to JSON/XML",
        icon: CodeOutlined,
        category: "Code Generators",
        tags: ["java", "pojo", "class", "record", "interface", "dto", "json", "xml", "code", "generator"],
        color: "#597ef7",
    },
    // Productivity
    {
        id: "todo-list",
        name: "Personal Todo List",
        description: "Production-grade task manager with IndexedDB storage, categories, archive, trash, import/export, subtasks, and more",
        icon: CheckSquareOutlined,
        category: "Productivity",
        tags: ["todo", "task", "productivity", "tracker", "list", "planner", "indexeddb", "offline", "archive", "subtasks"],
        color: "#52c41a",
    },
    // AI Tools
    {
        id: "rag-search",
        name: "RAG Document Q&A",
        description: "Upload documents and ask questions using AI-powered retrieval augmented generation",
        icon: DatabaseOutlined,
        category: "AI Tools",
        tags: ["rag", "ai", "document", "search", "llm"],
        color: "#f5222d",
    },
    // More Generators
    {
        id: "password-generator",
        name: "Password Generator",
        description: "Generate secure random passwords with customizable length and character sets",
        icon: LockOutlined,
        category: "Generators",
        tags: ["password", "secure", "random", "generate", "security"],
        color: "#52c41a",
    },
    {
        id: "lorem-ipsum",
        name: "Lorem Ipsum Generator",
        description: "Generate placeholder text in paragraphs, sentences, or words",
        icon: FileTextOutlined,
        category: "Generators",
        tags: ["lorem", "ipsum", "placeholder", "text", "dummy"],
        color: "#13c2c2",
    },
    // More Code Generators
    {
        id: "json-to-typescript",
        name: "JSON to TypeScript",
        description: "Convert JSON objects to TypeScript interfaces and types automatically",
        icon: CodeOutlined,
        category: "Code Generators",
        tags: ["json", "typescript", "interface", "type", "convert", "ts"],
        color: "#1677ff",
    },
    // More Converters
    {
        id: "case-converter",
        name: "String Case Converter",
        description: "Convert text between camelCase, snake_case, PascalCase, kebab-case and more",
        icon: FontSizeOutlined,
        category: "Converters",
        tags: ["case", "camel", "snake", "pascal", "kebab", "convert", "string"],
        color: "#722ed1",
    },
    {
        id: "unix-permissions",
        name: "Unix Permissions Calculator",
        description: "Calculate chmod numeric values and understand file permission bits",
        icon: FileProtectOutlined,
        category: "Converters",
        tags: ["unix", "chmod", "permissions", "linux", "file", "rwx"],
        color: "#fa541c",
    },
    // More Productivity
    {
        id: "cron-parser",
        name: "Cron Expression Parser",
        description: "Parse, validate and explain cron expressions with next run times",
        icon: ClockCircleOutlined,
        category: "Productivity",
        tags: ["cron", "schedule", "job", "timer", "parse", "expression"],
        color: "#faad14",
    },
    {
        id: "text-tools",
        name: "Text Manipulation Tools",
        description: "Sort lines, remove duplicates, trim whitespace, count words and more",
        icon: ScissorOutlined,
        category: "Productivity",
        tags: ["text", "sort", "unique", "trim", "count", "lines", "words"],
        color: "#eb2f96",
    },
    // More Generators
    {
        id: "markdown-table",
        name: "Markdown Table Generator",
        description: "Create and edit markdown tables with a visual spreadsheet interface",
        icon: TableOutlined,
        category: "Generators",
        tags: ["markdown", "table", "generator", "spreadsheet", "md"],
        color: "#1677ff",
    },
    // Reference Tools - Knowledge Base for Developers
    {
        id: "http-status-codes",
        name: "HTTP Status Codes Reference",
        description: "Complete reference guide for HTTP status codes (1xx-5xx) with detailed descriptions, use cases, common scenarios, and best practices for REST API development",
        icon: ThunderboltOutlined,
        category: "Reference",
        tags: ["http", "status", "codes", "api", "rest", "response", "reference", "documentation", "1xx", "2xx", "3xx", "4xx", "5xx"],
        color: "#fa8c16",
    },
    // More API Tools
    {
        id: "api-request-builder",
        name: "API Request Builder",
        description: "Build and test HTTP requests with headers, body, and authentication",
        icon: SendOutlined,
        category: "API Tools",
        tags: ["api", "http", "request", "rest", "postman", "curl"],
        color: "#52c41a",
    },
    {
        id: "json-path-tester",
        name: "JSONPath Tester",
        description: "Test and evaluate JSONPath expressions against JSON data",
        icon: FileSearchOutlined,
        category: "API Tools",
        tags: ["json", "jsonpath", "query", "filter", "api"],
        color: "#722ed1",
    },
    // More AI Tools
    {
        id: "text-summarizer",
        name: "Text Summarizer",
        description: "Summarize long text into key points using AI-powered extraction",
        icon: BulbOutlined,
        category: "AI Tools",
        tags: ["ai", "summarize", "text", "extract", "tldr"],
        color: "#faad14",
    },
    {
        id: "code-explainer",
        name: "Code Explainer",
        description: "Get AI-powered explanations for code snippets in any language",
        icon: CodeOutlined,
        category: "AI Tools",
        tags: ["ai", "code", "explain", "learn", "understand"],
        color: "#1677ff",
    },
    // HTML Formatter
    {
        id: "html-formatter",
        name: "HTML Formatter",
        description: "Format, prettify and beautify HTML documents with customizable indentation",
        icon: Html5Outlined,
        category: "Formatters",
        tags: ["html", "format", "prettify", "beautify"],
        color: "#fa541c",
    },
    // JavaScript/CSS Formatters
    {
        id: "js-formatter",
        name: "JavaScript Formatter",
        description: "Beautify and minify JavaScript code with configurable options",
        icon: CodeOutlined,
        category: "Formatters",
        tags: ["javascript", "js", "beautify", "minify", "format"],
        color: "#f7df1e",
    },
    {
        id: "css-formatter",
        name: "CSS Formatter",
        description: "Beautify and minify CSS stylesheets with vendor prefix handling",
        icon: FormatPainterOutlined,
        category: "Formatters",
        tags: ["css", "beautify", "minify", "format", "stylesheet"],
        color: "#264de4",
    },
    // Validators
    {
        id: "json-validator",
        name: "JSON Validator",
        description: "Validate JSON syntax with detailed error messages and line numbers",
        icon: CheckCircleOutlined,
        category: "Validators",
        tags: ["json", "validate", "syntax", "check"],
        color: "#52c41a",
    },
    {
        id: "xml-validator",
        name: "XML Validator",
        description: "Validate XML syntax and well-formedness with error highlighting",
        icon: CheckCircleOutlined,
        category: "Validators",
        tags: ["xml", "validate", "syntax", "check", "wellformed"],
        color: "#52c41a",
    },
    {
        id: "html-validator",
        name: "HTML Validator",
        description: "Validate HTML markup for errors and best practices",
        icon: CheckCircleOutlined,
        category: "Validators",
        tags: ["html", "validate", "syntax", "check", "markup"],
        color: "#fa541c",
    },
    {
        id: "xpath-tester",
        name: "XPath Tester",
        description: "Test and evaluate XPath expressions against XML documents",
        icon: NodeIndexOutlined,
        category: "Validators",
        tags: ["xpath", "xml", "query", "test", "expression"],
        color: "#722ed1",
    },
    {
        id: "credit-card-validator",
        name: "Credit Card Validator",
        description: "Validate and generate test credit card numbers with Luhn algorithm",
        icon: CreditCardOutlined,
        category: "Validators",
        tags: ["credit", "card", "validate", "luhn", "generate", "test"],
        color: "#1677ff",
    },
    // More Converters
    {
        id: "xml-to-json",
        name: "XML to JSON Converter",
        description: "Convert XML documents to JSON format with attribute handling options",
        icon: SwapOutlined,
        category: "Converters",
        tags: ["xml", "json", "convert", "transform"],
        color: "#faad14",
    },
    {
        id: "json-to-xml",
        name: "JSON to XML Converter",
        description: "Convert JSON objects to well-formed XML documents",
        icon: SwapOutlined,
        category: "Converters",
        tags: ["json", "xml", "convert", "transform"],
        color: "#faad14",
    },
    {
        id: "csv-to-json",
        name: "CSV to JSON Converter",
        description: "Convert CSV data to JSON arrays or objects with header detection",
        icon: FileExcelOutlined,
        category: "Converters",
        tags: ["csv", "json", "convert", "excel", "spreadsheet"],
        color: "#52c41a",
    },
    {
        id: "csv-to-xml",
        name: "CSV to XML Converter",
        description: "Convert CSV data to XML format with customizable element names",
        icon: FileExcelOutlined,
        category: "Converters",
        tags: ["csv", "xml", "convert", "excel", "spreadsheet"],
        color: "#52c41a",
    },
    {
        id: "yaml-json-converter",
        name: "YAML ↔ JSON Converter",
        description: "Convert between YAML and JSON formats bidirectionally",
        icon: SwapOutlined,
        category: "Converters",
        tags: ["yaml", "json", "convert", "config", "transform"],
        color: "#cb171e",
    },
    {
        id: "xslt-transformer",
        name: "XSLT Transformer",
        description: "Transform XML documents using XSLT stylesheets",
        icon: SettingOutlined,
        category: "Converters",
        tags: ["xslt", "xml", "transform", "stylesheet"],
        color: "#722ed1",
    },
    // String Escape Tools
    {
        id: "string-escape",
        name: "String Escape/Unescape",
        description: "Escape and unescape strings for JSON, XML, HTML, JavaScript, SQL, and CSV",
        icon: CodeOutlined,
        category: "Encoders & Decoders",
        tags: ["escape", "unescape", "json", "xml", "html", "javascript", "sql", "csv"],
        color: "#eb2f96",
    },
    // Reference - Web Resources
    {
        id: "mime-types",
        name: "MIME Types Reference",
        description: "Comprehensive searchable database of MIME types (Content-Types) with file extensions, categories, and usage examples for web development, file uploads, and HTTP headers",
        icon: OrderedListOutlined,
        category: "Reference",
        tags: ["mime", "content-type", "file", "extension", "reference", "media", "type", "http", "headers", "upload"],
        color: "#fa8c16",
    },
    {
        id: "url-parser",
        name: "URL Parser",
        description: "Parse and analyze URLs into components: protocol, host, path, query, fragment",
        icon: GlobalOutlined,
        category: "API Tools",
        tags: ["url", "parse", "query", "string", "analyze"],
        color: "#1677ff",
    },
    // WSDL/SOAP Tools
    {
        id: "wsdl-parser",
        name: "WSDL Parser",
        description: "Parse and visualize WSDL files, view services, ports, operations, and messages",
        icon: CloudOutlined,
        category: "API Tools",
        tags: ["wsdl", "soap", "xml", "webservice", "parse", "api"],
        color: "#722ed1",
    },
    {
        id: "xsd-validator",
        name: "XSD Schema Validator",
        description: "Validate XML documents against XSD schemas with detailed error reporting",
        icon: BlockOutlined,
        category: "Validators",
        tags: ["xsd", "xml", "schema", "validate", "check"],
        color: "#13c2c2",
    },
    {
        id: "soap-client",
        name: "SOAP Client",
        description: "Test SOAP web services by sending requests and viewing responses",
        icon: ApartmentOutlined,
        category: "API Tools",
        tags: ["soap", "wsdl", "xml", "webservice", "test", "api"],
        color: "#fa541c",
    },
    // Network Tools
    {
        id: "ip-address-tools",
        name: "IP Address Tools",
        description: "Validate, parse, and convert IPv4/IPv6 addresses with detailed information",
        icon: WifiOutlined,
        category: "Network",
        tags: ["ip", "ipv4", "ipv6", "network", "validate", "parse", "address"],
        color: "#1890ff",
    },
    {
        id: "subnet-calculator",
        name: "Subnet Calculator",
        description: "Calculate subnet masks, network ranges, CIDR notation, and available hosts",
        icon: ClusterOutlined,
        category: "Network",
        tags: ["subnet", "cidr", "network", "mask", "ip", "range", "calculate"],
        color: "#52c41a",
    },
    {
        id: "mac-address-tools",
        name: "MAC Address Tools",
        description: "Validate, format, and generate MAC addresses with vendor lookup",
        icon: DesktopOutlined,
        category: "Network",
        tags: ["mac", "address", "network", "hardware", "validate", "vendor"],
        color: "#722ed1",
    },
    // Network References
    {
        id: "port-reference",
        name: "Port Number Reference",
        description: "Comprehensive reference of common network ports, protocols, and services",
        icon: GlobalOutlined,
        category: "Reference",
        tags: ["port", "network", "tcp", "udp", "protocol", "service", "reference"],
        color: "#13c2c2",
    },
    {
        id: "ip-ranges-reference",
        name: "IP Ranges Reference",
        description: "Reference guide for private, reserved, and special-use IP address ranges",
        icon: ClusterOutlined,
        category: "Reference",
        tags: ["ip", "range", "private", "reserved", "network", "reference", "cidr"],
        color: "#eb2f96",
    },

    // RFC Standards Reference
    {
        id: "rfc-standards",
        name: "RFC Standards Reference",
        description: "Comprehensive reference for important RFC standards including JWT, JWE, JWS, OAuth, HTTP, TLS, and other security and web protocols",
        icon: SafetyCertificateOutlined,
        category: "Reference",
        tags: ["rfc", "standards", "jwt", "jwe", "jws", "oauth", "http", "tls", "ssl", "security", "protocol", "ietf", "specification"],
        color: "#722ed1",
    },

    // Certificate Tools
    {
        id: "certificate-decoder",
        name: "Certificate Decoder",
        description: "Decode and inspect X.509 certificates in PEM, DER, CRT, CER formats with detailed field analysis",
        icon: SafetyCertificateOutlined,
        category: "Certificates",
        tags: ["certificate", "x509", "pem", "der", "crt", "cer", "ssl", "tls", "decode", "inspect"],
        color: "#eb2f96",
    },
    {
        id: "certificate-generator",
        name: "Self-Signed Certificate Generator",
        description: "Generate self-signed X.509 certificates for development and testing purposes",
        icon: BuildOutlined,
        category: "Certificates",
        tags: ["certificate", "x509", "self-signed", "generate", "ssl", "tls", "development"],
        color: "#52c41a",
    },
    {
        id: "csr-generator",
        name: "CSR Generator",
        description: "Generate Certificate Signing Requests (CSR) for SSL/TLS certificates",
        icon: FileProtectOutlined,
        category: "Certificates",
        tags: ["csr", "certificate", "signing", "request", "ssl", "tls", "generate"],
        color: "#1677ff",
    },
    {
        id: "certificate-converter",
        name: "Certificate Format Converter",
        description: "Convert certificates between PEM, DER, PFX/P12, P7B, CRT, CER formats",
        icon: SwapOutlined,
        category: "Certificates",
        tags: ["certificate", "convert", "pem", "der", "pfx", "p12", "p7b", "pkcs"],
        color: "#faad14",
    },
    {
        id: "certificate-chain-validator",
        name: "Certificate Chain Validator",
        description: "Validate certificate chains and verify trust hierarchy from leaf to root CA",
        icon: AuditOutlined,
        category: "Certificates",
        tags: ["certificate", "chain", "validate", "trust", "ca", "root", "intermediate"],
        color: "#13c2c2",
    },
    {
        id: "pem-parser",
        name: "PEM Parser & Viewer",
        description: "Parse and view PEM-encoded certificates, keys, and CSRs with syntax highlighting",
        icon: EyeOutlined,
        category: "Certificates",
        tags: ["pem", "parse", "view", "certificate", "key", "csr", "base64"],
        color: "#722ed1",
    },
    {
        id: "pkcs12-tool",
        name: "PKCS#12 / PFX Tool",
        description: "Create, extract, and convert PKCS#12/PFX files containing certificates and private keys",
        icon: LockOutlined,
        category: "Certificates",
        tags: ["pkcs12", "pfx", "p12", "keystore", "certificate", "private key", "export", "import"],
        color: "#f5222d",
    },
    {
        id: "jks-tool",
        name: "Java KeyStore (JKS) Tool",
        description: "Create, view, and manage Java KeyStore files - import/export certificates and keys",
        icon: DatabaseOutlined,
        category: "Certificates",
        tags: ["jks", "keystore", "java", "certificate", "key", "truststore", "keytool"],
        color: "#fa541c",
    },
    {
        id: "ssl-checker",
        name: "SSL/TLS Certificate Checker",
        description: "Check SSL/TLS certificates from any domain - expiry, chain, protocols, and vulnerabilities",
        icon: SecurityScanOutlined,
        category: "Certificates",
        tags: ["ssl", "tls", "check", "certificate", "expiry", "domain", "https", "security"],
        color: "#52c41a",
    },
    {
        id: "key-pair-generator",
        name: "Key Pair Generator",
        description: "Generate RSA, ECDSA, and Ed25519 key pairs in PEM and other formats",
        icon: KeyOutlined,
        category: "Certificates",
        tags: ["key", "rsa", "ecdsa", "ed25519", "generate", "private", "public", "pem"],
        color: "#597ef7",
    },
    {
        id: "ssh-key-generator",
        name: "SSH Key Generator",
        description: "Generate SSH key pairs (RSA, ECDSA, Ed25519) with optional passphrase protection",
        icon: DesktopOutlined,
        category: "Certificates",
        tags: ["ssh", "key", "rsa", "ecdsa", "ed25519", "generate", "openssh"],
        color: "#1890ff",
    },
    {
        id: "certificate-fingerprint",
        name: "Certificate Fingerprint Calculator",
        description: "Calculate MD5, SHA-1, SHA-256 fingerprints of certificates for verification",
        icon: SearchOutlined,
        category: "Certificates",
        tags: ["certificate", "fingerprint", "hash", "sha256", "sha1", "md5", "verify"],
        color: "#13c2c2",
    },
];

export const getToolById = (id: string) => toolsRegistry.find((t) => t.id === id);

export const getToolsByCategory = () => {
    const map = new Map<ToolCategory, ToolDefinition[]>();
    toolsRegistry.forEach((tool) => {
        const arr = map.get(tool.category) || [];
        arr.push(tool);
        map.set(tool.category, arr);
    });

    // Sort tools within each category alphabetically by name
    map.forEach((tools, category) => {
        tools.sort((a, b) => a.name.localeCompare(b.name));
        map.set(category, tools);
    });

    // Return sorted map with Reference at the bottom
    const sortedMap = new Map<ToolCategory, ToolDefinition[]>();
    const categories = Array.from(map.keys()).sort((a, b) => {
        // Reference always at bottom
        if (a === "Reference") return 1;
        if (b === "Reference") return -1;
        return a.localeCompare(b);
    });

    categories.forEach(cat => {
        const tools = map.get(cat);
        if (tools) sortedMap.set(cat, tools);
    });

    return sortedMap;
};

"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Tag, Badge, Space, Collapse } from "antd";
import { ThunderboltOutlined, SearchOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import { REFERENCE_STANDARDS_TRANSLATIONS } from "@/lib/i18n/reference-standards";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;

interface StatusCode {
    code: number;
    name: string;
    description: string;
    category: "info" | "success" | "redirect" | "client-error" | "server-error";
    rfc: string;
    rfcUrl: string;
    useCase?: string;
    example?: string;
    commonWith?: string[];
}

const STATUS_CODES: StatusCode[] = [
    { code: 104, name: "Upload Resumption Supported", description: "Temporary upload-resumption registration; scheduled expiry 2026-11-13, checked 2026-10-21. Verify IANA before use.", category: "info", rfc: "Temporary · expires 2026-11-13", rfcUrl: "https://www.iana.org/assignments/http-status-codes" },
    // 1xx Informational
    { code: 100, name: "Continue", description: "An interim response invites the client to continue sending.", category: "info", rfc: "RFC 9110 §15.2.1", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.2.1", useCase: "Large upload handshake", example: "Client sends headers first, server acknowledges, then client sends body" },
    { code: 101, name: "Switching Protocols", description: "The server agrees to switch protocols.", category: "info", rfc: "RFC 9110 §15.2.2", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.2.2", useCase: "WebSocket upgrade", example: "Upgrade: websocket header triggers protocol switch" },
    { code: 102, name: "Processing", description: "WebDAV processing continues; this registration originates in RFC 2518.", category: "info", rfc: "RFC 2518 (WebDAV)", rfcUrl: "https://www.rfc-editor.org/rfc/rfc2518.html#section-10.1", useCase: "Long-running WebDAV operation", example: "Large file operations that take time" },
    { code: 103, name: "Early Hints", description: "Provides preliminary response fields before the final response.", category: "info", rfc: "RFC 8297", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc8297", useCase: "Early resource preload hints", example: "Link headers for CSS/JS preloading" },

    // 2xx Success
    { code: 200, name: "OK", description: "The request succeeded; meaning depends on the method.", category: "success", rfc: "RFC 9110 §15.3.1", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.1", useCase: "Successful resource retrieval", example: "GET /users/1 returns user data", commonWith: ["GET", "POST", "PUT"] },
    { code: 201, name: "Created", description: "The request created one or more new resources.", category: "success", rfc: "RFC 9110 §15.3.2", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.2", useCase: "Resource creation", example: "POST /users creates a new user, returns 201 with Location header", commonWith: ["POST"] },
    { code: 202, name: "Accepted", description: "Accepted for processing; completion is not guaranteed.", category: "success", rfc: "RFC 9110 §15.3.3", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.3", useCase: "Queued or asynchronous work", example: "Job submission that will be processed later" },
    { code: 203, name: "Non-Authoritative Information", description: "A transforming proxy modified the origin response content.", category: "success", rfc: "RFC 9110 §15.3.4", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.4", useCase: "Proxy content transformation", example: "CDN returning cached but transformed content" },
    { code: 204, name: "No Content", description: "Successful response with no response content.", category: "success", rfc: "RFC 9110 §15.3.5", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.5", useCase: "Successful operation without content", example: "DELETE /users/1 succeeds with no body", commonWith: ["DELETE", "PUT"] },
    { code: 205, name: "Reset Content", description: "Success; the client should reset the document view.", category: "success", rfc: "RFC 9110 §15.3.6", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.6", useCase: "Reset a submitted form", example: "After form POST, clear the form fields" },
    { code: 206, name: "Partial Content", description: "Returns one or more requested representation ranges.", category: "success", rfc: "RFC 9110 §15.3.7", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.7", useCase: "Range downloads and streaming", example: "Range: bytes=0-1023 returns first 1KB" },
    { code: 207, name: "Multi-Status", description: "The response body reports multiple resource statuses.", category: "success", rfc: "RFC 4918 (WebDAV)", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc4918#section-11.1", useCase: "WebDAV batch results", example: "Multiple file operations with individual statuses" },
    { code: 208, name: "Already Reported", description: "Avoids repeating bindings already reported in a WebDAV response.", category: "success", rfc: "RFC 5842 (WebDAV BIND)", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc5842#section-7.1", useCase: "Avoid duplicate WebDAV bindings", example: "Avoid re-listing the same resource in a multi-status reply" },
    { code: 226, name: "IM Used", description: "Returns a representation after supported instance manipulations.", category: "success", rfc: "RFC 3229", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc3229#section-10.4.1", useCase: "Delta-encoded updates", example: "Server returns a diff instead of the full resource" },

    // 3xx Redirection
    { code: 300, name: "Multiple Choices", description: "Multiple alternative representations are available.", category: "redirect", rfc: "RFC 9110 §15.4.1", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.1", useCase: "Alternative representations", example: "Resource available in multiple formats" },
    { code: 301, name: "Moved Permanently", description: "Permanent redirection; clients may change POST to GET.", category: "redirect", rfc: "RFC 9110 §15.4.2", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.2", useCase: "Permanent URL migration", example: "http://old.com → https://new.com (permanent)", commonWith: ["SEO redirects"] },
    { code: 302, name: "Found", description: "Temporary redirection; clients may change POST to GET.", category: "redirect", rfc: "RFC 9110 §15.4.3", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.3", useCase: "Temporary destination", example: "After login, redirect to dashboard temporarily" },
    { code: 303, name: "See Other", description: "Retrieve the indicated resource with GET or HEAD.", category: "redirect", rfc: "RFC 9110 §15.4.4", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.4", useCase: "Post-redirect-get workflow", example: "POST /submit → GET /success (always GET)" },
    { code: 304, name: "Not Modified", description: "A conditional GET or HEAD can reuse the stored representation.", category: "redirect", rfc: "RFC 9110 §15.4.5", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.5", useCase: "Cache validation", example: "If-None-Match matches, return 304 (use cache)", commonWith: ["Caching"] },
    { code: 305, name: "Use Proxy", description: "Deprecated proxy-redirection status; not recommended for new use.", category: "redirect", rfc: "RFC 9110 §15.4.6 (deprecated)", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.6", useCase: "Historical proxy selection", example: "Deprecated — modern clients ignore this response" },
    { code: 307, name: "Temporary Redirect", description: "Temporary redirection preserving the request method.", category: "redirect", rfc: "RFC 9110 §15.4.8", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.8", useCase: "Temporary method-preserving redirect", example: "POST /old → POST /new (keeps POST method)" },
    { code: 308, name: "Permanent Redirect", description: "Permanent redirection preserving the request method.", category: "redirect", rfc: "RFC 9110 §15.4.9", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.9", useCase: "Permanent method-preserving redirect", example: "Like 301 but preserves request method" },

    // 4xx Client Error
    { code: 400, name: "Bad Request", description: "The server cannot process a request because of client error.", category: "client-error", rfc: "RFC 9110 §15.5.1", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.1", useCase: "Malformed request syntax", example: "JSON parse error, invalid email format" },
    { code: 401, name: "Unauthorized", description: "Valid authentication credentials are required; include a challenge.", category: "client-error", rfc: "RFC 9110 §15.5.2", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.2", useCase: "Missing or invalid credentials", example: "No Bearer token or expired JWT", commonWith: ["Authentication"] },
    { code: 402, name: "Payment Required", description: "Reserved for future use; application conventions are not standardized.", category: "client-error", rfc: "RFC 9110 §15.5.3", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.3", useCase: "Application-specific payment convention", example: "Premium content requires payment" },
    { code: 403, name: "Forbidden", description: "The server understands but refuses the request.", category: "client-error", rfc: "RFC 9110 §15.5.4", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.4", useCase: "Insufficient permissions", example: "User authenticated but lacks admin role", commonWith: ["Authorization"] },
    { code: 404, name: "Not Found", description: "No current representation was found, or existence is undisclosed.", category: "client-error", rfc: "RFC 9110 §15.5.5", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.5", useCase: "Missing or hidden resource", example: "GET /users/999 where user 999 doesn't exist" },
    { code: 405, name: "Method Not Allowed", description: "Method unsupported for this resource; report allowed methods.", category: "client-error", rfc: "RFC 9110 §15.5.6", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.6", useCase: "Unsupported resource method", example: "POST /users when only GET is allowed" },
    { code: 406, name: "Not Acceptable", description: "No representation satisfies the request's negotiation preferences.", category: "client-error", rfc: "RFC 9110 §15.5.7", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.7", useCase: "Content negotiation failure", example: "Accept: application/xml but only JSON available" },
    { code: 407, name: "Proxy Authentication Required", description: "Authentication with the proxy is required.", category: "client-error", rfc: "RFC 9110 §15.5.8", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.8", useCase: "Proxy login challenge", example: "Proxy-Authenticate header required" },
    { code: 408, name: "Request Timeout", description: "The server did not receive a complete request in time.", category: "client-error", rfc: "RFC 9110 §15.5.9", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.9", useCase: "Incomplete slow request", example: "Client took too long to send complete request" },
    { code: 409, name: "Conflict", description: "Conflict with resource state; failed If-Match normally uses 412.", category: "client-error", rfc: "RFC 9110 §15.5.10", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.10", useCase: "Resource state conflict", example: "A write conflicts with an existing unique resource" },
    { code: 410, name: "Gone", description: "The resource is unavailable and likely permanently removed.", category: "client-error", rfc: "RFC 9110 §15.5.11", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.11", useCase: "Intentionally removed resource", example: "Deleted account, deprecated API version" },
    { code: 411, name: "Length Required", description: "The request requires a defined Content-Length.", category: "client-error", rfc: "RFC 9110 §15.5.12", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.12", useCase: "Required content length", example: "Content-Length header required but missing" },
    { code: 412, name: "Precondition Failed", description: "A request precondition evaluated to false.", category: "client-error", rfc: "RFC 9110 §15.5.13", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.13", useCase: "Failed conditional request", example: "If-Match header doesn't match current ETag" },
    { code: 413, name: "Content Too Large", description: "Request content exceeds what the server accepts.", category: "client-error", rfc: "RFC 9110 §15.5.14", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.14", useCase: "Upload size limit", example: "Max upload size 10MB, client sends 50MB" },
    { code: 414, name: "URI Too Long", description: "The URI exceeds this server's limit; no universal 2,048-character limit exists.", category: "client-error", rfc: "RFC 9110 §15.5.15", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.15", useCase: "Oversized request target", example: "URL exceeds 2048 character limit" },
    { code: 415, name: "Unsupported Media Type", description: "The resource does not support this request content format.", category: "client-error", rfc: "RFC 9110 §15.5.16", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.16", useCase: "Unsupported Content-Type", example: "Sending XML when only JSON is accepted" },
    { code: 416, name: "Range Not Satisfiable", description: "Requested ranges cannot be satisfied.", category: "client-error", rfc: "RFC 9110 §15.5.17", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.17", useCase: "Unsatisfiable byte range", example: "Range: bytes=500-400 (invalid range)" },
    { code: 417, name: "Expectation Failed", description: "The server cannot meet an Expect requirement.", category: "client-error", rfc: "RFC 9110 §15.5.18", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.18", useCase: "Rejected Expect requirement", example: "Server doesn't support expectations" },
    { code: 418, name: "Unused", description: "Reserved as unused; the teapot response is historical HTCPCP humor.", category: "client-error", rfc: "RFC 9110 §15.5.19", rfcUrl: "https://www.rfc-editor.org/rfc/rfc9110.html#section-15.5.19", useCase: "Historical HTCPCP joke", example: "Hyper Text Coffee Pot Control Protocol joke" },
    { code: 421, name: "Misdirected Request", description: "The server cannot authoritatively answer this target URI.", category: "client-error", rfc: "RFC 9110 §15.5.20", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.20", useCase: "Connection routed to wrong authority", example: "Reusing a TLS connection for a host the server isn't authoritative for" },
    { code: 422, name: "Unprocessable Content", description: "Understood content type and syntax, but cannot process the instructions.", category: "client-error", rfc: "RFC 9110 §15.5.21 (orig. RFC 4918 WebDAV)", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.21", useCase: "Semantically invalid instructions", example: "Valid JSON but invalid business rules" },
    { code: 423, name: "Locked", description: "The source or destination resource is locked.", category: "client-error", rfc: "RFC 4918 (WebDAV)", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc4918#section-11.3", useCase: "WebDAV resource lock", example: "File being edited by another user" },
    { code: 424, name: "Failed Dependency", description: "An action failed because a required dependent action failed.", category: "client-error", rfc: "RFC 4918 (WebDAV)", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc4918#section-11.4", useCase: "Dependent WebDAV action", example: "Child operation fails due to parent failure" },
    { code: 425, name: "Too Early", description: "The server refuses the risk of replaying early data.", category: "client-error", rfc: "RFC 8470", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc8470", useCase: "Early-data replay protection", example: "Replay attack prevention" },
    { code: 426, name: "Upgrade Required", description: "Upgrade is required; the response identifies acceptable protocols.", category: "client-error", rfc: "RFC 9110 §15.5.22", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.22", useCase: "Required protocol upgrade", example: "HTTP/1.1 to HTTP/2 upgrade" },
    { code: 428, name: "Precondition Required", description: "The origin requires a conditional request.", category: "client-error", rfc: "RFC 6585", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc6585#section-3", useCase: "Prevent lost updates", example: "If-Match header required for PUT" },
    { code: 429, name: "Too Many Requests", description: "Too many requests in a time period; Retry-After is optional.", category: "client-error", rfc: "RFC 6585", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc6585#section-4", useCase: "Rate or quota limit", example: "100 requests per minute limit exceeded", commonWith: ["Rate Limiting"] },
    { code: 431, name: "Request Header Fields Too Large", description: "Request header fields exceed the server's size limits.", category: "client-error", rfc: "RFC 6585", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc6585#section-5", useCase: "Oversized cookies or headers", example: "Cookie header exceeds 8KB limit" },
    { code: 451, name: "Unavailable For Legal Reasons", description: "Access is denied because of a legal demand.", category: "client-error", rfc: "RFC 7725", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc7725", useCase: "Legal access restriction", example: "Content blocked in certain regions" },

    // 5xx Server Error
    { code: 500, name: "Internal Server Error", description: "An unexpected server condition prevented fulfillment.", category: "server-error", rfc: "RFC 9110 §15.6.1", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.1", useCase: "Unexpected application failure", example: "Null pointer exception, database error" },
    { code: 501, name: "Not Implemented", description: "The server lacks functionality needed to fulfill the request.", category: "server-error", rfc: "RFC 9110 §15.6.2", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.2", useCase: "Unimplemented server capability", example: "PATCH not implemented on server" },
    { code: 502, name: "Bad Gateway", description: "A gateway received an invalid upstream response.", category: "server-error", rfc: "RFC 9110 §15.6.3", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.3", useCase: "Invalid upstream response", example: "Nginx can't reach backend app server" },
    { code: 503, name: "Service Unavailable", description: "Temporary unavailability, often overload or maintenance.", category: "server-error", rfc: "RFC 9110 §15.6.4", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.4", useCase: "Maintenance or overload", example: "Retry-After header indicates when to retry", commonWith: ["Maintenance"] },
    { code: 504, name: "Gateway Timeout", description: "A gateway did not receive a timely upstream response.", category: "server-error", rfc: "RFC 9110 §15.6.5", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.5", useCase: "Upstream response timeout", example: "Backend took too long to respond" },
    { code: 505, name: "HTTP Version Not Supported", description: "The request's HTTP major version is unsupported.", category: "server-error", rfc: "RFC 9110 §15.6.6", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.6", useCase: "Unsupported HTTP version", example: "Server only supports HTTP/1.1" },
    { code: 506, name: "Variant Also Negotiates", description: "A negotiated variant itself participates in content negotiation.", category: "server-error", rfc: "RFC 2295", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc2295#section-8.1", useCase: "Variant configuration error", example: "Server misconfiguration" },
    { code: 507, name: "Insufficient Storage", description: "Insufficient storage to complete the operation.", category: "server-error", rfc: "RFC 4918 (WebDAV)", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc4918#section-11.5", useCase: "Storage or quota exhaustion", example: "WebDAV storage limit reached" },
    { code: 508, name: "Loop Detected", description: "An infinite loop was detected during WebDAV processing.", category: "server-error", rfc: "RFC 5842 (WebDAV BIND)", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc5842#section-7.2", useCase: "WebDAV binding loop", example: "Circular reference in collections" },
    { code: 510, name: "Not Extended", description: "Obsoleted extension-framework status; retained only as historical reference.", category: "server-error", rfc: "RFC 2774", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc2774#section-7", useCase: "Historical extension framework", example: "HTTP Extension Framework" },
    { code: 511, name: "Network Authentication Required", description: "Authenticate to gain network access, such as a captive portal.", category: "server-error", rfc: "RFC 6585", rfcUrl: "https://datatracker.ietf.org/doc/html/rfc6585#section-6", useCase: "Captive portal login", example: "Airport/hotel WiFi login page" },
];

const CATEGORY_CONFIG = {
    "info": { color: "#1677ff", label: "1xx Informational", icon: <InfoCircleOutlined /> },
    "success": { color: "#52c41a", label: "2xx Success", icon: <CheckCircleOutlined /> },
    "redirect": { color: "#faad14", label: "3xx Redirection", icon: <WarningOutlined /> },
    "client-error": { color: "#fa541c", label: "4xx Client Error", icon: <CloseCircleOutlined /> },
    "server-error": { color: "#f5222d", label: "5xx Server Error", icon: <CloseCircleOutlined /> },
};

const searchable = (value: string) => [value, ...(REFERENCE_STANDARDS_TRANSLATIONS[value] ?? [])].join("\n").toLowerCase();

export default function HttpStatusCodesPage() {
    const { t } = useLanguage();
    const [expandedCodes, setExpandedCodes] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return STATUS_CODES.filter((code) => {
            const query = search.trim().toLowerCase();
            const matchesSearch = !query || [String(code.code), code.name, code.description, code.useCase ?? "", code.rfc, ...(code.commonWith ?? [])].some(value => searchable(value).includes(query));
            const matchesCategory = !selectedCategory || code.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [search, selectedCategory]);

    const grouped = useMemo(() => {
        const groups: Record<string, StatusCode[]> = {};
        filtered.forEach((code) => {
            if (!groups[code.category]) groups[code.category] = [];
            groups[code.category].push(code);
        });
        return groups;
    }, [filtered]);

    return (
        <ToolPageLayout
            title={t("HTTP Status Codes Reference")}
            description={t("Selected HTTP status codes with explanations, examples and primary sources")}
            icon={<ThunderboltOutlined style={{ fontSize: 24, color: "#fa8c16" }} />}
            color="#fa8c16"
            learnMore={{
                whatIs: t("Browse selected HTTP status codes with explanations, use cases and source links. Official reason phrases and examples remain unchanged across languages."),
                whyUse: t("Search by code, name, translated explanation or use case, then filter by status class and expand a row."),
                howToUse: [t("This is a bundled reference, not a live registry or a complete list of every vendor code.")],
                tips: [t("Choose response codes according to method and resource semantics; creation and validation responses depend on the operation."), t("429 may include Retry-After. Redirects 307 and 308 preserve the method; 301 and 302 can change POST to GET."), t("104 is temporary with scheduled expiry 2026-11-13 in the IANA snapshot checked 2026-10-21. Recheck the registry before implementing it.")],
            }}
        >
            <Row className="signal-working-panes" gutter={[24, 24]}>
                <Col xs={24} lg={18}>
                    <Card style={{ marginBottom: 16 }}>
                        <Input
                            size="large"
                            placeholder={t("Search by code, name, description, or use case...")}
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear aria-label={t("Search references")}
                        />
                    </Card>

                    <Space wrap style={{ marginBottom: 16 }}>
                        <Tag
                            style={{ cursor: "pointer", padding: "4px 12px" }}
                            color={selectedCategory === null ? "blue" : undefined}
                            role="button" tabIndex={0} aria-pressed={selectedCategory === null}
                            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedCategory(null); } }}
                            onClick={() => setSelectedCategory(null)}
                        >
                            {t("All ({count})", { count: STATUS_CODES.length })}
                        </Tag>
                        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                            <Tag
                                key={key}
                                style={{ cursor: "pointer", padding: "4px 12px" }}
                                color={selectedCategory === key ? config.color : undefined}
                                role="button" tabIndex={0} aria-pressed={selectedCategory === key}
                                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedCategory(selectedCategory === key ? null : key); } }}
                                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                            >
                                {config.icon} {t(config.label)}
                            </Tag>
                        ))}
                    </Space>

                    <Text role="status">{t("Showing {shown} of {total} status codes", { shown: filtered.length, total: STATUS_CODES.length })}</Text>
                    {filtered.length === 0 && <Paragraph>{t("No matching references")}</Paragraph>}
                    {Object.entries(grouped).map(([category, codes]) => (
                        <Card
                            key={category}
                            title={
                                <Space>
                                    {CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG].icon}
                                    <span>{t(CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG].label)}</span>
                                    <Badge count={codes.length} style={{ backgroundColor: CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG].color }} />
                                </Space>
                            }
                            style={{ marginBottom: 16 }}
                        >
                            <Collapse
                                ghost
                                activeKey={expandedCodes}
                                onChange={(keys) => setExpandedCodes(previous => [...previous.filter(key => !codes.some(code => String(code.code) === key)), ...(Array.isArray(keys) ? keys : [keys]).map(String)])}
                                items={codes.map((code) => ({
                                    key: code.code,
                                    label: (
                                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                            <Text strong style={{ fontSize: 18, color: CATEGORY_CONFIG[code.category].color, minWidth: 50 }}>
                                                {code.code}
                                            </Text>
                                            <div>
                                                <Text strong>{code.name}</Text>
                                                {code.commonWith && code.commonWith.map(tag => (
                                                    <Tag key={tag} style={{ marginLeft: 8, fontSize: 10 }}>{["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH", "OPTIONS"].includes(tag) ? tag : t(tag)}</Tag>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                    children: (
                                        <div style={{ paddingLeft: 66 }}>
                                            <Paragraph style={{ marginBottom: 8 }}>{t(code.description)}</Paragraph>
                                            {code.useCase && (
                                                <div style={{ marginBottom: 8 }}>
                                                    <Text type="secondary" strong>{t("Use Case:")} </Text>
                                                    <Text>{t(code.useCase)}</Text>
                                                </div>
                                            )}
                                            {code.example && (
                                                <div style={{ marginBottom: 8 }}>
                                                    <Text type="secondary" strong>{t("Example:")} </Text>
                                                    <Text code>{code.example}</Text>
                                                </div>
                                            )}
                                            <div>
                                                <Text type="secondary" strong>{t("Spec:")} </Text>
                                                <a href={code.rfcUrl} target="_blank" rel="noopener noreferrer">{code.code === 104 ? t("Temporary registration; scheduled expiry 2026-11-13") : code.rfc}</a>
                                            </div>
                                        </div>
                                    ),
                                }))}
                            />
                        </Card>
                    ))}
                </Col>

                <Col xs={24} lg={6}>
                    <Card title={t("Quick Reference")}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: config.color }} />
                                    <Text>{t(config.label)}</Text>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title={t("Common code examples")} style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {[200, 201, 204, 301, 400, 401, 403, 404, 422, 429, 500, 502, 503].map((code) => {
                                const status = STATUS_CODES.find((s) => s.code === code);
                                if (!status) return null;
                                return (
                                    <div key={code} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text code style={{ color: CATEGORY_CONFIG[status.category].color }}>{code}</Text>
                                        <Text style={{ fontSize: 12, textAlign: "right" }}>{status.name}</Text>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <Card title={t("REST API Guidelines")} style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                            <div><Text strong>{t("GET success:")}</Text> <Text code>200</Text></div>
                            <div><Text strong>{t("POST create:")}</Text> <Text code>201</Text></div>
                            <div><Text strong>{t("DELETE without content:")}</Text> <Text code>204</Text></div>
                            <div><Text strong>{t("Validation error:")}</Text> <Text code>400/422</Text></div>
                            <div><Text strong>{t("Auth required:")}</Text> <Text code>401</Text></div>
                            <div><Text strong>{t("No permission:")}</Text> <Text code>403</Text></div>
                            <div><Text strong>{t("Not found:")}</Text> <Text code>404</Text></div>
                            <div><Text strong>{t("Rate limit:")}</Text> <Text code>429</Text></div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

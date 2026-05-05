"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Tag, Badge, Space, Collapse } from "antd";
import { ThunderboltOutlined, SearchOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title, Paragraph } = Typography;

interface StatusCode {
    code: number;
    name: string;
    description: string;
    category: "info" | "success" | "redirect" | "client-error" | "server-error";
    useCase?: string;
    example?: string;
    commonWith?: string[];
}

const STATUS_CODES: StatusCode[] = [
    // 1xx Informational
    { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body.", category: "info", useCase: "Used with large uploads when client sends Expect: 100-continue header", example: "Client sends headers first, server acknowledges, then client sends body" },
    { code: 101, name: "Switching Protocols", description: "The requester has asked the server to switch protocols and the server has agreed to do so.", category: "info", useCase: "WebSocket connections upgrade from HTTP", example: "Upgrade: websocket header triggers protocol switch" },
    { code: 102, name: "Processing", description: "The server has received and is processing the request, but no response is available yet.", category: "info", useCase: "Long-running WebDAV operations", example: "Large file operations that take time" },
    { code: 103, name: "Early Hints", description: "Used to return some response headers before final HTTP message.", category: "info", useCase: "Preloading resources while server prepares response", example: "Link headers for CSS/JS preloading" },

    // 2xx Success
    { code: 200, name: "OK", description: "The request has succeeded. The meaning depends on the HTTP method used.", category: "success", useCase: "Standard successful response for GET, POST with data", example: "GET /users/1 returns user data", commonWith: ["GET", "POST", "PUT"] },
    { code: 201, name: "Created", description: "The request has been fulfilled and a new resource has been created.", category: "success", useCase: "After successful POST that creates a resource", example: "POST /users creates a new user, returns 201 with Location header", commonWith: ["POST"] },
    { code: 202, name: "Accepted", description: "The request has been accepted for processing, but processing is not complete.", category: "success", useCase: "Async operations, batch jobs, queued tasks", example: "Job submission that will be processed later" },
    { code: 203, name: "Non-Authoritative Information", description: "The returned metadata is not exactly the same as available from the origin server.", category: "success", useCase: "Proxy servers modifying response", example: "CDN returning cached but transformed content" },
    { code: 204, name: "No Content", description: "The server successfully processed the request but is not returning any content.", category: "success", useCase: "DELETE success, PUT with no response body needed", example: "DELETE /users/1 succeeds with no body", commonWith: ["DELETE", "PUT"] },
    { code: 205, name: "Reset Content", description: "The server processed the request and the user agent should reset the document view.", category: "success", useCase: "Form submission that should reset the form", example: "After form POST, clear the form fields" },
    { code: 206, name: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client.", category: "success", useCase: "Video streaming, resumable downloads", example: "Range: bytes=0-1023 returns first 1KB" },
    { code: 207, name: "Multi-Status", description: "The message body contains multiple status codes for multiple independent operations.", category: "success", useCase: "WebDAV batch operations", example: "Multiple file operations with individual statuses" },
    { code: 208, name: "Already Reported", description: "The members of a DAV binding have already been enumerated and are not being included again.", category: "success", useCase: "WebDAV recursive listing optimization", example: "Avoid re-listing the same resource in a multi-status reply" },
    { code: 226, name: "IM Used", description: "The server has fulfilled the request and the response is a representation of the result of one or more instance-manipulations applied to the current instance.", category: "success", useCase: "Delta encoding of resource updates (RFC 3229)", example: "Server returns a diff instead of the full resource" },

    // 3xx Redirection
    { code: 300, name: "Multiple Choices", description: "Multiple options for the resource that the client may follow.", category: "redirect", useCase: "Content negotiation with multiple representations", example: "Resource available in multiple formats" },
    { code: 301, name: "Moved Permanently", description: "The resource has been moved permanently to a new URL.", category: "redirect", useCase: "Domain migration, URL restructuring, HTTPS redirect", example: "http://old.com → https://new.com (permanent)", commonWith: ["SEO redirects"] },
    { code: 302, name: "Found", description: "The resource resides temporarily under a different URL.", category: "redirect", useCase: "Temporary redirects, login redirects", example: "After login, redirect to dashboard temporarily" },
    { code: 303, name: "See Other", description: "The response can be found under a different URL using GET method.", category: "redirect", useCase: "Post-redirect-get pattern", example: "POST /submit → GET /success (always GET)" },
    { code: 304, name: "Not Modified", description: "Resource has not been modified since last requested.", category: "redirect", useCase: "Caching validation with ETag/Last-Modified", example: "If-None-Match matches, return 304 (use cache)", commonWith: ["Caching"] },
    { code: 307, name: "Temporary Redirect", description: "The resource resides temporarily under a different URL. Method and body unchanged.", category: "redirect", useCase: "Preserve method during temporary redirect", example: "POST /old → POST /new (keeps POST method)" },
    { code: 308, name: "Permanent Redirect", description: "The resource has been permanently moved. Method and body unchanged.", category: "redirect", useCase: "Permanent redirect preserving method", example: "Like 301 but preserves request method" },

    // 4xx Client Error
    { code: 400, name: "Bad Request", description: "The server cannot process the request due to client error (malformed syntax, invalid request).", category: "client-error", useCase: "Invalid JSON, missing required fields, validation errors", example: "JSON parse error, invalid email format" },
    { code: 401, name: "Unauthorized", description: "Authentication is required and has failed or has not been provided.", category: "client-error", useCase: "Missing or invalid authentication token", example: "No Bearer token or expired JWT", commonWith: ["Authentication"] },
    { code: 402, name: "Payment Required", description: "Reserved for future use. Originally intended for digital payment systems.", category: "client-error", useCase: "Paywall, subscription required", example: "Premium content requires payment" },
    { code: 403, name: "Forbidden", description: "The server understood the request but refuses to authorize it.", category: "client-error", useCase: "Insufficient permissions, IP blocked", example: "User authenticated but lacks admin role", commonWith: ["Authorization"] },
    { code: 404, name: "Not Found", description: "The requested resource could not be found on the server.", category: "client-error", useCase: "Resource doesn't exist, wrong URL", example: "GET /users/999 where user 999 doesn't exist" },
    { code: 405, name: "Method Not Allowed", description: "The request method is not supported for the requested resource.", category: "client-error", useCase: "POST to a read-only endpoint", example: "POST /users when only GET is allowed" },
    { code: 406, name: "Not Acceptable", description: "The resource is not capable of generating content acceptable according to Accept headers.", category: "client-error", useCase: "Content negotiation failed", example: "Accept: application/xml but only JSON available" },
    { code: 407, name: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy.", category: "client-error", useCase: "Corporate proxy requires login", example: "Proxy-Authenticate header required" },
    { code: 408, name: "Request Timeout", description: "The server timed out waiting for the request.", category: "client-error", useCase: "Slow client, network issues", example: "Client took too long to send complete request" },
    { code: 409, name: "Conflict", description: "The request could not be processed because of conflict in the current state of the resource.", category: "client-error", useCase: "Optimistic locking, duplicate entry", example: "PUT with outdated ETag, unique constraint violation" },
    { code: 410, name: "Gone", description: "The resource is no longer available and will not be available again.", category: "client-error", useCase: "Intentionally removed content", example: "Deleted account, deprecated API version" },
    { code: 411, name: "Length Required", description: "The request did not specify the length of its content, which is required.", category: "client-error", useCase: "Chunked encoding not supported", example: "Content-Length header required but missing" },
    { code: 412, name: "Precondition Failed", description: "The server does not meet one of the preconditions specified in the request.", category: "client-error", useCase: "Conditional requests failed", example: "If-Match header doesn't match current ETag" },
    { code: 413, name: "Payload Too Large", description: "The request is larger than the server is willing or able to process.", category: "client-error", useCase: "File upload exceeds limit", example: "Max upload size 10MB, client sends 50MB" },
    { code: 414, name: "URI Too Long", description: "The URI provided was too long for the server to process.", category: "client-error", useCase: "GET with too many query parameters", example: "URL exceeds 2048 character limit" },
    { code: 415, name: "Unsupported Media Type", description: "The request entity has a media type which the server does not support.", category: "client-error", useCase: "Wrong Content-Type for endpoint", example: "Sending XML when only JSON is accepted" },
    { code: 416, name: "Range Not Satisfiable", description: "The client has asked for a portion of the file that the server cannot supply.", category: "client-error", useCase: "Invalid byte range in video streaming", example: "Range: bytes=500-400 (invalid range)" },
    { code: 417, name: "Expectation Failed", description: "The server cannot meet the requirements of the Expect request-header field.", category: "client-error", useCase: "Expect: 100-continue rejected", example: "Server doesn't support expectations" },
    { code: 418, name: "I'm a Teapot", description: "The server refuses to brew coffee because it is, permanently, a teapot.", category: "client-error", useCase: "Easter egg (RFC 2324)", example: "Hyper Text Coffee Pot Control Protocol joke" },
    { code: 421, name: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response (e.g., due to connection reuse for a different host).", category: "client-error", useCase: "HTTP/2 connection coalescing for the wrong origin", example: "Reusing a TLS connection for a host the server isn't authoritative for" },
    { code: 422, name: "Unprocessable Entity", description: "The request was well-formed but was unable to be followed due to semantic errors.", category: "client-error", useCase: "Business logic validation failed", example: "Valid JSON but invalid business rules" },
    { code: 423, name: "Locked", description: "The resource that is being accessed is locked.", category: "client-error", useCase: "WebDAV locked file", example: "File being edited by another user" },
    { code: 424, name: "Failed Dependency", description: "The request failed because it depended on another request that failed.", category: "client-error", useCase: "WebDAV batch with dependencies", example: "Child operation fails due to parent failure" },
    { code: 425, name: "Too Early", description: "The server is unwilling to risk processing a request that might be replayed.", category: "client-error", useCase: "TLS early data protection", example: "Replay attack prevention" },
    { code: 426, name: "Upgrade Required", description: "The client should switch to a different protocol.", category: "client-error", useCase: "TLS required, protocol upgrade needed", example: "HTTP/1.1 to HTTP/2 upgrade" },
    { code: 428, name: "Precondition Required", description: "The origin server requires the request to be conditional.", category: "client-error", useCase: "Prevent lost updates", example: "If-Match header required for PUT" },
    { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time (rate limiting).", category: "client-error", useCase: "Rate limiting, API quota exceeded", example: "100 requests per minute limit exceeded", commonWith: ["Rate Limiting"] },
    { code: 431, name: "Request Header Fields Too Large", description: "The server is unwilling to process the request because its header fields are too large.", category: "client-error", useCase: "Large cookies, too many headers", example: "Cookie header exceeds 8KB limit" },
    { code: 451, name: "Unavailable For Legal Reasons", description: "The resource is unavailable due to legal reasons.", category: "client-error", useCase: "GDPR, copyright, legal blocks", example: "Content blocked in certain regions" },

    // 5xx Server Error
    { code: 500, name: "Internal Server Error", description: "A generic error message when an unexpected condition was encountered.", category: "server-error", useCase: "Unhandled exception, bug in code", example: "Null pointer exception, database error" },
    { code: 501, name: "Not Implemented", description: "The server does not recognize the request method or lacks the ability to fulfill it.", category: "server-error", useCase: "Unsupported HTTP method", example: "PATCH not implemented on server" },
    { code: 502, name: "Bad Gateway", description: "The server was acting as a gateway and received an invalid response from the upstream server.", category: "server-error", useCase: "Upstream service down, invalid response", example: "Nginx can't reach backend app server" },
    { code: 503, name: "Service Unavailable", description: "The server is currently unavailable (overloaded or down for maintenance).", category: "server-error", useCase: "Maintenance, overload, circuit breaker", example: "Retry-After header indicates when to retry", commonWith: ["Maintenance"] },
    { code: 504, name: "Gateway Timeout", description: "The server was acting as a gateway and did not receive a timely response.", category: "server-error", useCase: "Slow upstream, timeout", example: "Backend took too long to respond" },
    { code: 505, name: "HTTP Version Not Supported", description: "The server does not support the HTTP protocol version used in the request.", category: "server-error", useCase: "HTTP/3 not supported", example: "Server only supports HTTP/1.1" },
    { code: 506, name: "Variant Also Negotiates", description: "Transparent content negotiation for the request results in a circular reference.", category: "server-error", useCase: "Content negotiation configuration error", example: "Server misconfiguration" },
    { code: 507, name: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request.", category: "server-error", useCase: "Disk full, quota exceeded", example: "WebDAV storage limit reached" },
    { code: 508, name: "Loop Detected", description: "The server detected an infinite loop while processing the request.", category: "server-error", useCase: "WebDAV infinite loop", example: "Circular reference in collections" },
    { code: 510, name: "Not Extended", description: "Further extensions to the request are required for the server to fulfill it.", category: "server-error", useCase: "Missing required extension", example: "HTTP Extension Framework" },
    { code: 511, name: "Network Authentication Required", description: "The client needs to authenticate to gain network access.", category: "server-error", useCase: "Captive portal (WiFi login)", example: "Airport/hotel WiFi login page" },
];

const CATEGORY_CONFIG = {
    "info": { color: "#1677ff", label: "1xx Informational", icon: <InfoCircleOutlined /> },
    "success": { color: "#52c41a", label: "2xx Success", icon: <CheckCircleOutlined /> },
    "redirect": { color: "#faad14", label: "3xx Redirection", icon: <WarningOutlined /> },
    "client-error": { color: "#fa541c", label: "4xx Client Error", icon: <CloseCircleOutlined /> },
    "server-error": { color: "#f5222d", label: "5xx Server Error", icon: <CloseCircleOutlined /> },
};

export default function HttpStatusCodesPage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return STATUS_CODES.filter((code) => {
            const matchesSearch = !search ||
                code.code.toString().includes(search) ||
                code.name.toLowerCase().includes(search.toLowerCase()) ||
                code.description.toLowerCase().includes(search.toLowerCase());
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
            title="HTTP Status Codes Reference"
            description="Complete developer reference for HTTP status codes with use cases and examples"
            icon={<ThunderboltOutlined style={{ fontSize: 24, color: "#fa8c16" }} />}
            color="#fa8c16"
            learnMore={{
                whatIs: "HTTP Status Codes are three-digit numbers returned by web servers to indicate the result of a client's HTTP request. They are grouped into five categories: 1xx (Informational), 2xx (Success), 3xx (Redirection), 4xx (Client Errors), and 5xx (Server Errors). Understanding these codes is essential for debugging web applications, APIs, and network issues.",
                whyUse: "When developing web applications or REST APIs, you need to return appropriate status codes to clients. When troubleshooting issues, status codes help identify whether the problem is with the client request (4xx) or the server (5xx). This reference provides definitions, real-world use cases, and examples for each code.",
                howToUse: [
                    "Search by code number, name, or description",
                    "Filter by category (Success, Client Error, Server Error, etc.)",
                    "Click on a status code to expand and see detailed information",
                    "Review use cases and examples to understand when to use each code",
                    "Reference 'Common With' tags for typical scenarios"
                ],
                tips: [
                    "Always return 201 Created (not 200) when creating resources via POST",
                    "Use 204 No Content for successful DELETE requests without response body",
                    "Return 422 Unprocessable Entity for validation errors, not 400 Bad Request",
                    "Include Retry-After header with 429 Too Many Requests responses",
                    "Use 301 for permanent URL redirects, 302 for temporary ones"
                ],
                useCases: [
                    "Debugging API responses in development and production",
                    "Designing REST APIs with proper status code semantics",
                    "Troubleshooting web application and network errors",
                    "Understanding CDN and proxy behavior",
                    "Studying for web development certifications"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={18}>
                    <Card style={{ marginBottom: 16 }}>
                        <Input
                            size="large"
                            placeholder="Search by code, name, description, or use case..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                        />
                    </Card>

                    <Space wrap style={{ marginBottom: 16 }}>
                        <Tag
                            style={{ cursor: "pointer", padding: "4px 12px" }}
                            color={selectedCategory === null ? "blue" : undefined}
                            onClick={() => setSelectedCategory(null)}
                        >
                            All ({STATUS_CODES.length})
                        </Tag>
                        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                            <Tag
                                key={key}
                                style={{ cursor: "pointer", padding: "4px 12px" }}
                                color={selectedCategory === key ? config.color : undefined}
                                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                            >
                                {config.icon} {config.label}
                            </Tag>
                        ))}
                    </Space>

                    {Object.entries(grouped).map(([category, codes]) => (
                        <Card
                            key={category}
                            title={
                                <Space>
                                    {CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG].icon}
                                    <span>{CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG].label}</span>
                                    <Badge count={codes.length} style={{ backgroundColor: CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG].color }} />
                                </Space>
                            }
                            style={{ marginBottom: 16 }}
                        >
                            <Collapse
                                ghost
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
                                                    <Tag key={tag} style={{ marginLeft: 8, fontSize: 10 }}>{tag}</Tag>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                    children: (
                                        <div style={{ paddingLeft: 66 }}>
                                            <Paragraph style={{ marginBottom: 8 }}>{code.description}</Paragraph>
                                            {code.useCase && (
                                                <div style={{ marginBottom: 8 }}>
                                                    <Text type="secondary" strong>Use Case: </Text>
                                                    <Text>{code.useCase}</Text>
                                                </div>
                                            )}
                                            {code.example && (
                                                <div>
                                                    <Text type="secondary" strong>Example: </Text>
                                                    <Text code>{code.example}</Text>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                }))}
                            />
                        </Card>
                    ))}
                </Col>

                <Col xs={24} lg={6}>
                    <Card title="Quick Reference">
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: config.color }} />
                                    <Text>{config.label}</Text>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Most Used Codes" style={{ marginTop: 16 }}>
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

                    <Card title="REST API Guidelines" style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                            <div><Text strong>GET success:</Text> <Text code>200</Text></div>
                            <div><Text strong>POST create:</Text> <Text code>201</Text></div>
                            <div><Text strong>DELETE:</Text> <Text code>204</Text></div>
                            <div><Text strong>Validation error:</Text> <Text code>400/422</Text></div>
                            <div><Text strong>Auth required:</Text> <Text code>401</Text></div>
                            <div><Text strong>No permission:</Text> <Text code>403</Text></div>
                            <div><Text strong>Not found:</Text> <Text code>404</Text></div>
                            <div><Text strong>Rate limit:</Text> <Text code>429</Text></div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

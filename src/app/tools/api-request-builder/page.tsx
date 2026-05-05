"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
    Card,
    Input,
    Select,
    Button,
    Typography,
    Row,
    Col,
    Space,
    Tabs,
    Table,
    Switch,
    Spin,
    Tag,
    Collapse,
    InputNumber,
    Tooltip,
    Divider,
    Modal,
    Form,
    Checkbox,
    Alert,
    Dropdown,
    Badge,
    Segmented,
    Statistic,
} from "antd";
import { messageService as message } from "@/lib/messageService";
import {
    SendOutlined,
    PlusOutlined,
    DeleteOutlined,
    CopyOutlined,
    PlayCircleOutlined,
    ClockCircleOutlined,
    SaveOutlined,
    FolderOpenOutlined,
    HistoryOutlined,
    CodeOutlined,
    KeyOutlined,
    LockOutlined,
    SettingOutlined,
    DownloadOutlined,
    FileTextOutlined,
    ThunderboltOutlined,
    CloudOutlined,
    SafetyCertificateOutlined,
    FormOutlined,
    FileOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text } = Typography;
const { TextArea } = Input;

// ─── Types ───────────────────────────────────────────────────────────

interface KeyValuePair {
    id: string;
    key: string;
    value: string;
    description?: string;
    enabled: boolean;
}

interface AuthConfig {
    type: "none" | "basic" | "bearer" | "api-key" | "oauth2";
    basic?: { username: string; password: string };
    bearer?: { token: string; prefix: string };
    apiKey?: { key: string; value: string; addTo: "header" | "query" };
    oauth2?: { accessToken: string; tokenType: string };
}

interface RequestSettings {
    timeout: number;
    followRedirects: boolean;
    validateSSL: boolean;
}

interface SavedRequest {
    id: string;
    name: string;
    method: string;
    url: string;
    headers: KeyValuePair[];
    queryParams: KeyValuePair[];
    body: string;
    bodyType: BodyType;
    auth: AuthConfig;
    settings: RequestSettings;
    createdAt: string;
}

interface HistoryItem {
    id: string;
    method: string;
    url: string;
    status: number;
    time: number;
    timestamp: string;
}

type BodyType = "none" | "json" | "xml" | "text" | "form-data" | "x-www-form-urlencoded" | "graphql" | "binary";

// ─── Constants ───────────────────────────────────────────────────────

const HTTP_METHODS = [
    { value: "GET", color: "#52c41a" },
    { value: "POST", color: "#1677ff" },
    { value: "PUT", color: "#faad14" },
    { value: "PATCH", color: "#722ed1" },
    { value: "DELETE", color: "#f5222d" },
    { value: "HEAD", color: "#13c2c2" },
    { value: "OPTIONS", color: "#eb2f96" },
];

const COMMON_HEADERS = [
    "Accept",
    "Accept-Charset",
    "Accept-Encoding",
    "Accept-Language",
    "Authorization",
    "Cache-Control",
    "Content-Type",
    "Cookie",
    "Host",
    "If-Match",
    "If-Modified-Since",
    "If-None-Match",
    "Origin",
    "Pragma",
    "Referer",
    "User-Agent",
    "X-Api-Key",
    "X-Correlation-ID",
    "X-Forwarded-For",
    "X-Forwarded-Host",
    "X-Request-ID",
    "X-Requested-With",
];

const CONTENT_TYPES: Record<BodyType, string> = {
    none: "",
    json: "application/json",
    xml: "application/xml",
    text: "text/plain",
    "form-data": "multipart/form-data",
    "x-www-form-urlencoded": "application/x-www-form-urlencoded",
    graphql: "application/json",
    binary: "application/octet-stream",
};

const SAMPLE_GRAPHQL = `query {
  users {
    id
    name
    email
  }
}`;

const SAMPLE_GRAPHQL_VARS = `{
  "limit": 10
}`;

// ─── Helper Functions ────────────────────────────────────────────────

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getStatusColor(code: number): string {
    if (code >= 200 && code < 300) return "#52c41a";
    if (code >= 300 && code < 400) return "#faad14";
    if (code >= 400 && code < 500) return "#fa541c";
    if (code >= 500) return "#f5222d";
    return "#8c8c8c";
}

function getStatusText(code: number): string {
    const statusTexts: Record<number, string> = {
        200: "OK",
        201: "Created",
        204: "No Content",
        301: "Moved Permanently",
        302: "Found",
        304: "Not Modified",
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        409: "Conflict",
        422: "Unprocessable Entity",
        429: "Too Many Requests",
        500: "Internal Server Error",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
    };
    return statusTexts[code] || "";
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ─── Storage Keys ────────────────────────────────────────────────────

const STORAGE_KEYS = {
    SAVED_REQUESTS: "api-builder-saved-requests",
    HISTORY: "api-builder-history",
    ENVIRONMENTS: "api-builder-environments",
};

// ─── Component ───────────────────────────────────────────────────────

export default function ApiRequestBuilderPage() {
    // Request state
    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
    const [headers, setHeaders] = useState<KeyValuePair[]>([
        { id: generateId(), key: "Content-Type", value: "application/json", enabled: true },
        { id: generateId(), key: "Accept", value: "application/json", enabled: true },
    ]);
    const [queryParams, setQueryParams] = useState<KeyValuePair[]>([]);
    const [bodyType, setBodyType] = useState<BodyType>("json");
    const [body, setBody] = useState("");
    const [formData, setFormData] = useState<KeyValuePair[]>([]);
    const [graphqlQuery, setGraphqlQuery] = useState(SAMPLE_GRAPHQL);
    const [graphqlVariables, setGraphqlVariables] = useState(SAMPLE_GRAPHQL_VARS);

    // Auth state
    const [auth, setAuth] = useState<AuthConfig>({
        type: "none",
        basic: { username: "", password: "" },
        bearer: { token: "", prefix: "Bearer" },
        apiKey: { key: "X-Api-Key", value: "", addTo: "header" },
        oauth2: { accessToken: "", tokenType: "Bearer" },
    });

    // Settings state
    const [settings, setSettings] = useState<RequestSettings>({
        timeout: 30000,
        followRedirects: true,
        validateSSL: true,
    });

    // Response state
    const [response, setResponse] = useState<string | null>(null);
    const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const [responseSize, setResponseSize] = useState<number | null>(null);

    // UI state
    const [activeRequestTab, setActiveRequestTab] = useState("body");
    const [activeResponseTab, setActiveResponseTab] = useState("body");
    const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [requestName, setRequestName] = useState("");
    const [showPreRequestScript, setShowPreRequestScript] = useState(false);
    const [preRequestScript, setPreRequestScript] = useState("");
    const [testScript, setTestScript] = useState("");
    const [testResults, setTestResults] = useState<{ name: string; passed: boolean; message?: string }[]>([]);
    const [cookies, setCookies] = useState<KeyValuePair[]>([]);

    // Load saved data
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.SAVED_REQUESTS);
            if (saved) setSavedRequests(JSON.parse(saved));

            const hist = localStorage.getItem(STORAGE_KEYS.HISTORY);
            if (hist) setHistory(JSON.parse(hist));
        } catch (e) {
            console.error("Failed to load saved data:", e);
        }
    }, []);

    // Save to localStorage
    const persistSavedRequests = useCallback((requests: SavedRequest[]) => {
        localStorage.setItem(STORAGE_KEYS.SAVED_REQUESTS, JSON.stringify(requests));
        setSavedRequests(requests);
    }, []);

    const persistHistory = useCallback((items: HistoryItem[]) => {
        // Keep only last 50 items
        const trimmed = items.slice(0, 50);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
        setHistory(trimmed);
    }, []);

    // Build final URL with query params
    const buildUrl = useCallback(() => {
        try {
            const urlObj = new URL(url);
            queryParams.filter((p) => p.enabled && p.key).forEach((p) => {
                urlObj.searchParams.set(p.key, p.value);
            });
            // Add API key to query if configured
            if (auth.type === "api-key" && auth.apiKey?.addTo === "query" && auth.apiKey.value) {
                urlObj.searchParams.set(auth.apiKey.key, auth.apiKey.value);
            }
            return urlObj.toString();
        } catch {
            return url;
        }
    }, [url, queryParams, auth]);

    // Build headers with auth
    const buildHeaders = useCallback((): Record<string, string> => {
        const headerObj: Record<string, string> = {};

        // Add regular headers
        headers.filter((h) => h.enabled && h.key).forEach((h) => {
            headerObj[h.key] = h.value;
        });

        // Add auth headers
        switch (auth.type) {
            case "basic":
                if (auth.basic?.username) {
                    const encoded = btoa(`${auth.basic.username}:${auth.basic.password}`);
                    headerObj["Authorization"] = `Basic ${encoded}`;
                }
                break;
            case "bearer":
                if (auth.bearer?.token) {
                    headerObj["Authorization"] = `${auth.bearer.prefix} ${auth.bearer.token}`;
                }
                break;
            case "api-key":
                if (auth.apiKey?.addTo === "header" && auth.apiKey.value) {
                    headerObj[auth.apiKey.key] = auth.apiKey.value;
                }
                break;
            case "oauth2":
                if (auth.oauth2?.accessToken) {
                    headerObj["Authorization"] = `${auth.oauth2.tokenType} ${auth.oauth2.accessToken}`;
                }
                break;
        }

        // Add cookies
        const enabledCookies = cookies.filter(c => c.enabled && c.key);
        if (enabledCookies.length > 0) {
            headerObj["Cookie"] = enabledCookies.map(c => `${c.key}=${c.value}`).join("; ");
        }

        return headerObj;
    }, [headers, auth, cookies]);

    // Build request body
    const buildBody = useCallback((): string | FormData | null => {
        if (["GET", "HEAD", "OPTIONS"].includes(method)) return null;

        switch (bodyType) {
            case "none":
                return null;
            case "json":
            case "xml":
            case "text":
                return body;
            case "graphql":
                try {
                    const vars = graphqlVariables.trim() ? JSON.parse(graphqlVariables) : {};
                    return JSON.stringify({ query: graphqlQuery, variables: vars });
                } catch {
                    return JSON.stringify({ query: graphqlQuery });
                }
            case "x-www-form-urlencoded":
                return formData
                    .filter(f => f.enabled && f.key)
                    .map(f => `${encodeURIComponent(f.key)}=${encodeURIComponent(f.value)}`)
                    .join("&");
            case "form-data":
                const fd = new FormData();
                formData.filter(f => f.enabled && f.key).forEach(f => {
                    fd.append(f.key, f.value);
                });
                return fd;
            default:
                return body;
        }
    }, [method, bodyType, body, formData, graphqlQuery, graphqlVariables]);

    // Run test script
    const runTestScript = useCallback((responseData: string, statusCode: number, headers: Record<string, string>, time: number) => {
        if (!testScript.trim()) {
            setTestResults([]);
            return;
        }

        const results: { name: string; passed: boolean; message?: string }[] = [];

        // Create test context
        const pm = {
            response: {
                code: statusCode,
                status: getStatusText(statusCode),
                responseTime: time,
                headers: {
                    get: (key: string) => headers[key.toLowerCase()] || headers[key],
                },
                json: () => {
                    try { return JSON.parse(responseData); } catch { return null; }
                },
                text: () => responseData,
            },
            test: (name: string, fn: () => void) => {
                try {
                    fn();
                    results.push({ name, passed: true });
                } catch (e: any) {
                    results.push({ name, passed: false, message: e.message });
                }
            },
            expect: (value: any) => ({
                to: {
                    equal: (expected: any) => {
                        if (value !== expected) throw new Error(`Expected ${expected} but got ${value}`);
                    },
                    be: {
                        true: () => { if (value !== true) throw new Error(`Expected true but got ${value}`); },
                        false: () => { if (value !== false) throw new Error(`Expected false but got ${value}`); },
                        null: () => { if (value !== null) throw new Error(`Expected null but got ${value}`); },
                        undefined: () => { if (value !== undefined) throw new Error(`Expected undefined but got ${value}`); },
                        above: (n: number) => { if (!(value > n)) throw new Error(`Expected > ${n} but got ${value}`); },
                        below: (n: number) => { if (!(value < n)) throw new Error(`Expected < ${n} but got ${value}`); },
                        a: (type: string) => { if (typeof value !== type) throw new Error(`Expected type ${type} but got ${typeof value}`); },
                    },
                    have: {
                        status: (code: number) => { if (statusCode !== code) throw new Error(`Expected status ${code} but got ${statusCode}`); },
                        property: (prop: string) => { if (!(prop in value)) throw new Error(`Missing property: ${prop}`); },
                        lengthOf: (len: number) => { if (value.length !== len) throw new Error(`Expected length ${len} but got ${value.length}`); },
                    },
                    include: (item: any) => {
                        if (Array.isArray(value)) {
                            if (!value.includes(item)) throw new Error(`Array does not include ${item}`);
                        } else if (typeof value === "string") {
                            if (!value.includes(item)) throw new Error(`String does not include ${item}`);
                        }
                    },
                },
                eql: (expected: any) => {
                    if (JSON.stringify(value) !== JSON.stringify(expected)) {
                        throw new Error(`Deep equality failed`);
                    }
                },
            }),
        };

        try {
            // eslint-disable-next-line no-new-func
            const fn = new Function("pm", testScript);
            fn(pm);
        } catch (e: any) {
            results.push({ name: "Script Error", passed: false, message: e.message });
        }

        setTestResults(results);
    }, [testScript]);

    // Send request — all traffic is routed through /api/proxy to bypass CORS and TLS issues
    const sendRequest = async () => {
        setLoading(true);
        setResponse(null);
        setStatus(null);
        setResponseTime(null);
        setResponseSize(null);
        setTestResults([]);

        try {
            const finalUrl = buildUrl();
            const headerObj = buildHeaders();
            const requestBody = buildBody();

            // Serialize the body for the proxy.
            // FormData is serialized to bytes via Response so the multipart boundary is preserved.
            let proxyBody: string | null = null;
            let bodyIsBase64 = false;

            if (requestBody !== null) {
                if (requestBody instanceof FormData) {
                    // Let the browser serialize FormData (adds Content-Type with boundary)
                    const serialized = new Response(requestBody);
                    const contentType = serialized.headers.get("content-type");
                    if (contentType) headerObj["Content-Type"] = contentType;
                    const buf = await serialized.arrayBuffer();
                    proxyBody = btoa(String.fromCharCode(...new Uint8Array(buf)));
                    bodyIsBase64 = true;
                } else {
                    proxyBody = requestBody as string;
                    bodyIsBase64 = false;
                }
            }

            const proxyReq = {
                url: finalUrl,
                method,
                headers: headerObj,
                body: proxyBody,
                bodyIsBase64,
                timeout: settings.timeout,
                followRedirects: settings.followRedirects,
            };

            const proxyRes = await fetch("/api/proxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(proxyReq),
            });

            const data = await proxyRes.json();

            if (!proxyRes.ok && data.error) {
                throw new Error(data.error);
            }

            setResponseTime(data.timing ?? 0);
            setStatus(data.status ?? 0);
            setResponseHeaders(data.headers ?? {});
            setResponseSize(data.size ?? 0);

            // Pretty-print JSON if applicable
            const contentType: string = data.headers?.["content-type"] ?? "";
            let bodyText: string = data.body ?? "";
            if (!data.bodyIsBase64 && contentType.includes("application/json")) {
                try {
                    bodyText = JSON.stringify(JSON.parse(bodyText), null, 2);
                } catch { /* leave as-is */ }
            }
            setResponse(bodyText);

            const historyItem: HistoryItem = {
                id: generateId(),
                method,
                url: finalUrl,
                status: data.status ?? 0,
                time: data.timing ?? 0,
                timestamp: new Date().toISOString(),
            };
            persistHistory([historyItem, ...history]);

            runTestScript(bodyText, data.status ?? 0, data.headers ?? {}, data.timing ?? 0);

        } catch (err: any) {
            setResponse(`Error: ${err.message}`);
            setStatus(0);
        } finally {
            setLoading(false);
        }
    };

    // Key-value pair handlers
    const addItem = (setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>) => {
        setter(prev => [...prev, { id: generateId(), key: "", value: "", enabled: true }]);
    };

    const removeItem = (setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>, id: string) => {
        setter(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (
        setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>,
        id: string,
        field: keyof KeyValuePair,
        value: string | boolean
    ) => {
        setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    // Save request
    const handleSaveRequest = () => {
        if (!requestName.trim()) {
            message.warning("Please enter a request name");
            return;
        }

        const newRequest: SavedRequest = {
            id: generateId(),
            name: requestName,
            method,
            url,
            headers,
            queryParams,
            body,
            bodyType,
            auth,
            settings,
            createdAt: new Date().toISOString(),
        };

        persistSavedRequests([newRequest, ...savedRequests]);
        setSaveModalOpen(false);
        setRequestName("");
        message.success("Request saved!");
    };

    // Load saved request
    const loadRequest = (req: SavedRequest) => {
        setMethod(req.method);
        setUrl(req.url);
        setHeaders(req.headers);
        setQueryParams(req.queryParams);
        setBody(req.body);
        setBodyType(req.bodyType);
        setAuth(req.auth);
        setSettings(req.settings);
        message.success(`Loaded: ${req.name}`);
    };

    // Delete saved request
    const deleteRequest = (id: string) => {
        persistSavedRequests(savedRequests.filter(r => r.id !== id));
        message.success("Request deleted");
    };

    // Load from history
    const loadFromHistory = (item: HistoryItem) => {
        setMethod(item.method);
        setUrl(item.url);
    };

    // Generate cURL command
    const generateCurl = useCallback(() => {
        const parts = [`curl -X ${method}`];
        const headerObj = buildHeaders();

        Object.entries(headerObj).forEach(([key, value]) => {
            parts.push(`-H '${key}: ${value}'`);
        });

        const requestBody = buildBody();
        if (requestBody && typeof requestBody === "string") {
            parts.push(`-d '${requestBody.replace(/'/g, "'\\''")}'`);
        }

        parts.push(`'${buildUrl()}'`);
        return parts.join(" \\\n  ");
    }, [method, buildHeaders, buildBody, buildUrl]);

    // Generate code snippets
    const generateCodeSnippet = useCallback((language: string): string => {
        const finalUrl = buildUrl();
        const headerObj = buildHeaders();
        const requestBody = buildBody();

        switch (language) {
            case "javascript-fetch":
                return `fetch('${finalUrl}', {
  method: '${method}',
  headers: ${JSON.stringify(headerObj, null, 4)},${requestBody ? `
  body: ${typeof requestBody === "string" ? `'${requestBody.replace(/'/g, "\\'")}'` : "formData"},` : ""}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;

            case "javascript-axios":
                return `axios({
  method: '${method.toLowerCase()}',
  url: '${finalUrl}',
  headers: ${JSON.stringify(headerObj, null, 4)},${requestBody ? `
  data: ${typeof requestBody === "string" ? requestBody : "formData"},` : ""}
})
.then(response => console.log(response.data))
.catch(error => console.error(error));`;

            case "python":
                return `import requests

response = requests.${method.toLowerCase()}(
    '${finalUrl}',
    headers=${JSON.stringify(headerObj, null, 4).replace(/"/g, "'")},${requestBody ? `
    ${bodyType === "json" ? "json" : "data"}=${typeof requestBody === "string" ? requestBody : "form_data"},` : ""}
)
print(response.json())`;

            case "java":
                return `HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${finalUrl}"))
    .method("${method}", ${requestBody ? `HttpRequest.BodyPublishers.ofString(${JSON.stringify(requestBody)})` : "HttpRequest.BodyPublishers.noBody()"})
${Object.entries(headerObj).map(([k, v]) => `    .header("${k}", "${v}")`).join("\n")}
    .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`;

            case "csharp":
                return `using var client = new HttpClient();
${Object.entries(headerObj).map(([k, v]) => `client.DefaultRequestHeaders.Add("${k}", "${v}");`).join("\n")}
var response = await client.${method === "GET" ? "GetAsync" : `${method.charAt(0)}${method.slice(1).toLowerCase()}Async`}("${finalUrl}"${requestBody ? `, new StringContent(${JSON.stringify(requestBody)}, Encoding.UTF8, "application/json")` : ""});
var content = await response.Content.ReadAsStringAsync();
Console.WriteLine(content);`;

            default:
                return generateCurl();
        }
    }, [method, buildUrl, buildHeaders, buildBody, bodyType, generateCurl]);

    const methodColor = HTTP_METHODS.find((m) => m.value === method)?.color || "#1677ff";

    // Test results summary
    const testSummary = useMemo(() => {
        const passed = testResults.filter(t => t.passed).length;
        const failed = testResults.filter(t => !t.passed).length;
        return { passed, failed, total: testResults.length };
    }, [testResults]);

    return (
        <ToolPageLayout
            title="API Request Builder"
            description="Advanced HTTP client with authentication, tests, and code generation"
            icon={<SendOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "An advanced HTTP client similar to Postman for testing REST APIs. It supports multiple HTTP methods, authentication types, request/response inspection, automated tests, and code generation.",
                whyUse: "Testing APIs is a core part of development. This tool provides a complete environment for building requests, managing auth, running tests, and generating code for any language - all in your browser.",
                howToUse: [
                    "Enter the API URL and select HTTP method (GET, POST, PUT, etc.)",
                    "Add headers, query params, and request body as needed",
                    "Configure authentication (Bearer token, Basic Auth, API Key)",
                    "Send the request and analyze the response",
                    "Write tests and generate code snippets"
                ],
                tips: [
                    "Use variables with {{variable}} syntax for dynamic values",
                    "Save common requests for reuse",
                    "Test scripts can validate response data automatically",
                    "Generate code for curl, JavaScript, Python, and more"
                ],
                useCases: [
                    "Testing REST API endpoints during development",
                    "Debugging API authentication issues",
                    "Generating API client code for different languages",
                    "Documenting API workflows with saved requests"
                ],
                serverNotice: {
                    route: "proxy",
                    purpose: "Every request is forwarded through a server-side proxy. This is required to bypass browser CORS restrictions and avoid TLS validation errors when testing arbitrary HTTP APIs — features that are simply not possible from a pure browser fetch.",
                    sentFields: [
                        "Target URL",
                        "HTTP method, headers, query string, and body (exactly as you composed them)",
                        "Auth credentials you entered (Bearer/Basic/API key) — these are part of the request and reach the target server",
                    ],
                    extra: (
                        <Text style={{ fontSize: 12 }}>
                            Tests, code generation, response parsing, and history all run 100% in your browser.
                            Only the outbound network call itself transits the proxy.
                        </Text>
                    ),
                },
            }}
        >
            <Row gutter={[16, 16]}>
                {/* Left Panel - Request */}
                <Col xs={24} xl={14}>
                    <Card size="small">
                        {/* URL Bar */}
                        <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
                            <Select
                                value={method}
                                onChange={setMethod}
                                style={{ width: 120 }}
                                size="large"
                            >
                                {HTTP_METHODS.map((m) => (
                                    <Select.Option key={m.value} value={m.value}>
                                        <span style={{ color: m.color, fontWeight: 600 }}>{m.value}</span>
                                    </Select.Option>
                                ))}
                            </Select>
                            <Input
                                size="large"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter request URL"
                                style={{ flex: 1 }}
                                onPressEnter={sendRequest}
                            />
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlayCircleOutlined />}
                                onClick={sendRequest}
                                loading={loading}
                                style={{ background: methodColor }}
                            >
                                Send
                            </Button>
                        </Space.Compact>

                        {/* Request Tabs */}
                        <Tabs
                            activeKey={activeRequestTab}
                            onChange={setActiveRequestTab}
                            size="small"
                            tabBarExtraContent={
                                <Space>
                                    <Tooltip title="Save Request">
                                        <Button size="small" icon={<SaveOutlined />} onClick={() => setSaveModalOpen(true)} />
                                    </Tooltip>
                                </Space>
                            }
                            items={[
                                {
                                    key: "body",
                                    label: <><FileTextOutlined /> Body</>,
                                    children: (
                                        <div>
                                            <Segmented
                                                value={bodyType}
                                                onChange={(v) => {
                                                    setBodyType(v as BodyType);
                                                    // Update Content-Type header
                                                    const ct = CONTENT_TYPES[v as BodyType];
                                                    if (ct) {
                                                        setHeaders(prev => {
                                                            const idx = prev.findIndex(h => h.key === "Content-Type");
                                                            if (idx >= 0) {
                                                                const updated = [...prev];
                                                                updated[idx] = { ...updated[idx], value: ct };
                                                                return updated;
                                                            }
                                                            return [...prev, { id: generateId(), key: "Content-Type", value: ct, enabled: true }];
                                                        });
                                                    }
                                                }}
                                                options={[
                                                    { label: "none", value: "none" },
                                                    { label: "JSON", value: "json" },
                                                    { label: "XML", value: "xml" },
                                                    { label: "Text", value: "text" },
                                                    { label: "Form URL", value: "x-www-form-urlencoded" },
                                                    { label: "Form Data", value: "form-data" },
                                                    { label: "GraphQL", value: "graphql" },
                                                ]}
                                                style={{ marginBottom: 12 }}
                                            />
                                            {bodyType === "none" && (
                                                <Alert message="This request does not have a body" type="info" showIcon />
                                            )}
                                            {(bodyType === "json" || bodyType === "xml" || bodyType === "text") && (
                                                <CodeEditor
                                                    value={body}
                                                    onChange={(val) => setBody(val || "")}
                                                    language={bodyType === "json" ? "json" : bodyType === "xml" ? "xml" : "plaintext"}
                                                    height={180}
                                                />
                                            )}
                                            {bodyType === "graphql" && (
                                                <Row gutter={8}>
                                                    <Col span={14}>
                                                        <Text type="secondary" style={{ fontSize: 11 }}>Query</Text>
                                                        <CodeEditor
                                                            value={graphqlQuery}
                                                            onChange={(val) => setGraphqlQuery(val || "")}
                                                            language="graphql"
                                                            height={150}
                                                        />
                                                    </Col>
                                                    <Col span={10}>
                                                        <Text type="secondary" style={{ fontSize: 11 }}>Variables</Text>
                                                        <CodeEditor
                                                            value={graphqlVariables}
                                                            onChange={(val) => setGraphqlVariables(val || "")}
                                                            language="json"
                                                            height={150}
                                                        />
                                                    </Col>
                                                </Row>
                                            )}
                                            {(bodyType === "x-www-form-urlencoded" || bodyType === "form-data") && (
                                                <div>
                                                    {formData.map((f) => (
                                                        <Space key={f.id} style={{ width: "100%", marginBottom: 8 }}>
                                                            <Switch checked={f.enabled} onChange={(v) => updateItem(setFormData, f.id, "enabled", v)} size="small" />
                                                            <Input value={f.key} onChange={(e) => updateItem(setFormData, f.id, "key", e.target.value)} placeholder="Key" style={{ width: 150 }} />
                                                            <Input value={f.value} onChange={(e) => updateItem(setFormData, f.id, "value", e.target.value)} placeholder="Value" style={{ flex: 1 }} />
                                                            <Button icon={<DeleteOutlined />} danger size="small" onClick={() => removeItem(setFormData, f.id)} />
                                                        </Space>
                                                    ))}
                                                    <Button icon={<PlusOutlined />} size="small" onClick={() => addItem(setFormData)}>Add Field</Button>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    key: "headers",
                                    label: <><FormOutlined /> Headers ({headers.filter(h => h.enabled).length})</>,
                                    children: (
                                        <div>
                                            {headers.map((h) => (
                                                <Space key={h.id} style={{ width: "100%", marginBottom: 8 }} wrap>
                                                    <Switch checked={h.enabled} onChange={(v) => updateItem(setHeaders, h.id, "enabled", v)} size="small" />
                                                    <Select
                                                        value={h.key || undefined}
                                                        onChange={(v) => updateItem(setHeaders, h.id, "key", v)}
                                                        style={{ width: 180 }}
                                                        showSearch
                                                        allowClear
                                                        placeholder="Header name"
                                                    >
                                                        {COMMON_HEADERS.map((name) => (
                                                            <Select.Option key={name} value={name}>{name}</Select.Option>
                                                        ))}
                                                    </Select>
                                                    <Input
                                                        value={h.value}
                                                        onChange={(e) => updateItem(setHeaders, h.id, "value", e.target.value)}
                                                        placeholder="Value"
                                                        style={{ flex: 1, minWidth: 180 }}
                                                    />
                                                    <Button icon={<DeleteOutlined />} danger size="small" onClick={() => removeItem(setHeaders, h.id)} />
                                                </Space>
                                            ))}
                                            <Button icon={<PlusOutlined />} size="small" onClick={() => addItem(setHeaders)}>Add Header</Button>
                                        </div>
                                    ),
                                },
                                {
                                    key: "params",
                                    label: <>Query ({queryParams.filter(p => p.enabled).length})</>,
                                    children: (
                                        <div>
                                            {queryParams.map((p) => (
                                                <Space key={p.id} style={{ width: "100%", marginBottom: 8 }}>
                                                    <Switch checked={p.enabled} onChange={(v) => updateItem(setQueryParams, p.id, "enabled", v)} size="small" />
                                                    <Input value={p.key} onChange={(e) => updateItem(setQueryParams, p.id, "key", e.target.value)} placeholder="Key" style={{ width: 150 }} />
                                                    <Input value={p.value} onChange={(e) => updateItem(setQueryParams, p.id, "value", e.target.value)} placeholder="Value" style={{ flex: 1 }} />
                                                    <Button icon={<DeleteOutlined />} danger size="small" onClick={() => removeItem(setQueryParams, p.id)} />
                                                </Space>
                                            ))}
                                            <Button icon={<PlusOutlined />} size="small" onClick={() => addItem(setQueryParams)}>Add Param</Button>
                                        </div>
                                    ),
                                },
                                {
                                    key: "auth",
                                    label: <><LockOutlined /> Auth</>,
                                    children: (
                                        <div>
                                            <Select
                                                value={auth.type}
                                                onChange={(type) => setAuth({ ...auth, type })}
                                                style={{ width: 200, marginBottom: 16 }}
                                            >
                                                <Select.Option value="none">No Auth</Select.Option>
                                                <Select.Option value="basic"><KeyOutlined /> Basic Auth</Select.Option>
                                                <Select.Option value="bearer"><SafetyCertificateOutlined /> Bearer Token</Select.Option>
                                                <Select.Option value="api-key"><KeyOutlined /> API Key</Select.Option>
                                                <Select.Option value="oauth2"><LockOutlined /> OAuth 2.0</Select.Option>
                                            </Select>

                                            {auth.type === "basic" && (
                                                <Space orientation="vertical" style={{ width: "100%" }}>
                                                    <Input
                                                        prefix={<Text type="secondary">Username:</Text>}
                                                        value={auth.basic?.username}
                                                        onChange={(e) => setAuth({ ...auth, basic: { ...auth.basic!, username: e.target.value } })}
                                                    />
                                                    <Input.Password
                                                        prefix={<Text type="secondary">Password:</Text>}
                                                        value={auth.basic?.password}
                                                        onChange={(e) => setAuth({ ...auth, basic: { ...auth.basic!, password: e.target.value } })}
                                                    />
                                                </Space>
                                            )}

                                            {auth.type === "bearer" && (
                                                <Space orientation="vertical" style={{ width: "100%" }}>
                                                    <Input
                                                        prefix={<Text type="secondary">Prefix:</Text>}
                                                        value={auth.bearer?.prefix}
                                                        onChange={(e) => setAuth({ ...auth, bearer: { ...auth.bearer!, prefix: e.target.value } })}
                                                        style={{ width: 200 }}
                                                    />
                                                    <TextArea
                                                        placeholder="Token"
                                                        value={auth.bearer?.token}
                                                        onChange={(e) => setAuth({ ...auth, bearer: { ...auth.bearer!, token: e.target.value } })}
                                                        rows={3}
                                                    />
                                                </Space>
                                            )}

                                            {auth.type === "api-key" && (
                                                <Space orientation="vertical" style={{ width: "100%" }}>
                                                    <Space>
                                                        <Input
                                                            prefix={<Text type="secondary">Key:</Text>}
                                                            value={auth.apiKey?.key}
                                                            onChange={(e) => setAuth({ ...auth, apiKey: { ...auth.apiKey!, key: e.target.value } })}
                                                            style={{ width: 200 }}
                                                        />
                                                        <Select
                                                            value={auth.apiKey?.addTo}
                                                            onChange={(v) => setAuth({ ...auth, apiKey: { ...auth.apiKey!, addTo: v } })}
                                                            style={{ width: 120 }}
                                                        >
                                                            <Select.Option value="header">Header</Select.Option>
                                                            <Select.Option value="query">Query Param</Select.Option>
                                                        </Select>
                                                    </Space>
                                                    <Input
                                                        prefix={<Text type="secondary">Value:</Text>}
                                                        value={auth.apiKey?.value}
                                                        onChange={(e) => setAuth({ ...auth, apiKey: { ...auth.apiKey!, value: e.target.value } })}
                                                    />
                                                </Space>
                                            )}

                                            {auth.type === "oauth2" && (
                                                <Space orientation="vertical" style={{ width: "100%" }}>
                                                    <Input
                                                        prefix={<Text type="secondary">Token Type:</Text>}
                                                        value={auth.oauth2?.tokenType}
                                                        onChange={(e) => setAuth({ ...auth, oauth2: { ...auth.oauth2!, tokenType: e.target.value } })}
                                                        style={{ width: 200 }}
                                                    />
                                                    <TextArea
                                                        placeholder="Access Token"
                                                        value={auth.oauth2?.accessToken}
                                                        onChange={(e) => setAuth({ ...auth, oauth2: { ...auth.oauth2!, accessToken: e.target.value } })}
                                                        rows={3}
                                                    />
                                                </Space>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    key: "cookies",
                                    label: <>Cookies ({cookies.filter(c => c.enabled).length})</>,
                                    children: (
                                        <div>
                                            {cookies.map((c) => (
                                                <Space key={c.id} style={{ width: "100%", marginBottom: 8 }}>
                                                    <Switch checked={c.enabled} onChange={(v) => updateItem(setCookies, c.id, "enabled", v)} size="small" />
                                                    <Input value={c.key} onChange={(e) => updateItem(setCookies, c.id, "key", e.target.value)} placeholder="Name" style={{ width: 150 }} />
                                                    <Input value={c.value} onChange={(e) => updateItem(setCookies, c.id, "value", e.target.value)} placeholder="Value" style={{ flex: 1 }} />
                                                    <Button icon={<DeleteOutlined />} danger size="small" onClick={() => removeItem(setCookies, c.id)} />
                                                </Space>
                                            ))}
                                            <Button icon={<PlusOutlined />} size="small" onClick={() => addItem(setCookies)}>Add Cookie</Button>
                                        </div>
                                    ),
                                },
                                {
                                    key: "settings",
                                    label: <><SettingOutlined /> Settings</>,
                                    children: (
                                        <Space orientation="vertical" style={{ width: "100%" }}>
                                            <div>
                                                <Text>Timeout (ms):</Text>
                                                <InputNumber
                                                    value={settings.timeout}
                                                    onChange={(v) => setSettings({ ...settings, timeout: v || 30000 })}
                                                    min={1000}
                                                    max={300000}
                                                    step={1000}
                                                    style={{ marginLeft: 8, width: 120 }}
                                                />
                                            </div>
                                            <Checkbox
                                                checked={settings.followRedirects}
                                                onChange={(e) => setSettings({ ...settings, followRedirects: e.target.checked })}
                                            >
                                                Follow Redirects
                                            </Checkbox>
                                        </Space>
                                    ),
                                },
                                {
                                    key: "tests",
                                    label: (
                                        <Space>
                                            <ThunderboltOutlined /> Tests
                                            {testSummary.total > 0 && (
                                                <Badge count={testSummary.failed} showZero={false} size="small" offset={[0, 0]}>
                                                    <Tag color={testSummary.failed > 0 ? "error" : "success"} style={{ marginLeft: 4 }}>
                                                        {testSummary.passed}/{testSummary.total}
                                                    </Tag>
                                                </Badge>
                                            )}
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <Alert
                                                message="Write tests using pm.test() and pm.expect() syntax"
                                                type="info"
                                                showIcon
                                                style={{ marginBottom: 8 }}
                                            />
                                            <CodeEditor
                                                value={testScript}
                                                onChange={(v) => setTestScript(v || "")}
                                                language="javascript"
                                                height={150}
                                            />
                                            <Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 4 }}>
                                                Example: pm.test("Status is 200", () =&gt; pm.expect(pm.response.code).to.equal(200));
                                            </Text>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </Card>

                    {/* Code Generation */}
                    <Collapse
                        style={{ marginTop: 16 }}
                        items={[
                            {
                                key: "code",
                                label: <><CodeOutlined /> Code Snippets</>,
                                children: (
                                    <Tabs
                                        size="small"
                                        items={[
                                            { key: "curl", label: "cURL", children: <pre style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCurl()}</pre> },
                                            { key: "javascript-fetch", label: "JS Fetch", children: <pre style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("javascript-fetch")}</pre> },
                                            { key: "javascript-axios", label: "JS Axios", children: <pre style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("javascript-axios")}</pre> },
                                            { key: "python", label: "Python", children: <pre style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("python")}</pre> },
                                            { key: "java", label: "Java", children: <pre style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("java")}</pre> },
                                            { key: "csharp", label: "C#", children: <pre style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("csharp")}</pre> },
                                        ]}
                                    />
                                ),
                            },
                        ]}
                    />
                </Col>

                {/* Right Panel - Response & Sidebar */}
                <Col xs={24} xl={10}>
                    {/* Response */}
                    <Card
                        size="small"
                        title={
                            <Space>
                                <Text>Response</Text>
                                {status !== null && (
                                    <Tag color={getStatusColor(status)}>{status} {getStatusText(status)}</Tag>
                                )}
                                {responseTime !== null && (
                                    <Tag icon={<ClockCircleOutlined />}>{responseTime}ms</Tag>
                                )}
                                {responseSize !== null && (
                                    <Tag>{formatBytes(responseSize)}</Tag>
                                )}
                            </Space>
                        }
                        extra={
                            response && (
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => {
                                        navigator.clipboard.writeText(response);
                                        message.success("Response copied!");
                                    }}
                                />
                            )
                        }
                    >
                        {loading ? (
                            <div style={{ textAlign: "center", padding: 40 }}>
                                <Spin />
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary">Sending request...</Text>
                                </div>
                            </div>
                        ) : response ? (
                            <Tabs
                                activeKey={activeResponseTab}
                                onChange={setActiveResponseTab}
                                size="small"
                                items={[
                                    {
                                        key: "body",
                                        label: "Body",
                                        children: (
                                            <CodeEditor
                                                value={response}
                                                language={response.trim().startsWith("{") || response.trim().startsWith("[") ? "json" : response.trim().startsWith("<") ? "xml" : "plaintext"}
                                                height={300}
                                                readOnly
                                            />
                                        ),
                                    },
                                    {
                                        key: "headers",
                                        label: `Headers (${Object.keys(responseHeaders).length})`,
                                        children: (
                                            <Table
                                                size="small"
                                                pagination={false}
                                                dataSource={Object.entries(responseHeaders).map(([key, value]) => ({ key, value }))}
                                                columns={[
                                                    { title: "Header", dataIndex: "key", width: 180, render: (k) => <Text code>{k}</Text> },
                                                    { title: "Value", dataIndex: "value", render: (v) => <Text style={{ wordBreak: "break-all" }}>{v}</Text> },
                                                ]}
                                                scroll={{ y: 250 }}
                                            />
                                        ),
                                    },
                                    {
                                        key: "tests",
                                        label: (
                                            <Space>
                                                Tests
                                                {testSummary.total > 0 && (
                                                    <Tag color={testSummary.failed > 0 ? "error" : "success"}>
                                                        {testSummary.passed}/{testSummary.total}
                                                    </Tag>
                                                )}
                                            </Space>
                                        ),
                                        children: (
                                            <div>
                                                {testResults.length === 0 ? (
                                                    <Text type="secondary">No tests to run</Text>
                                                ) : (
                                                    testResults.map((t, i) => (
                                                        <div key={i} style={{ marginBottom: 8 }}>
                                                            <Tag color={t.passed ? "success" : "error"}>{t.passed ? "PASS" : "FAIL"}</Tag>
                                                            <Text>{t.name}</Text>
                                                            {t.message && <Text type="danger" style={{ display: "block", marginLeft: 50 }}>{t.message}</Text>}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        ) : (
                            <div style={{ textAlign: "center", padding: 40, color: "#8c8c8c" }}>
                                <CloudOutlined style={{ fontSize: 48, opacity: 0.3 }} />
                                <div style={{ marginTop: 8 }}>Send a request to see the response</div>
                            </div>
                        )}
                    </Card>

                    {/* Saved Requests & History */}
                    <Collapse
                        style={{ marginTop: 16 }}
                        defaultActiveKey={[]}
                        items={[
                            {
                                key: "saved",
                                label: <><FolderOpenOutlined /> Saved Requests ({savedRequests.length})</>,
                                children: savedRequests.length === 0 ? (
                                    <Text type="secondary">No saved requests</Text>
                                ) : (
                                    <div style={{ maxHeight: 200, overflow: "auto" }}>
                                        {savedRequests.map((req) => (
                                            <div key={req.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                <Tag color={HTTP_METHODS.find(m => m.value === req.method)?.color}>{req.method}</Tag>
                                                <Text style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.name}</Text>
                                                <Button size="small" type="text" onClick={() => loadRequest(req)}>Load</Button>
                                                <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => deleteRequest(req.id)} />
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                            {
                                key: "history",
                                label: <><HistoryOutlined /> History ({history.length})</>,
                                children: history.length === 0 ? (
                                    <Text type="secondary">No request history</Text>
                                ) : (
                                    <div style={{ maxHeight: 200, overflow: "auto" }}>
                                        {history.slice(0, 20).map((item) => (
                                            <div
                                                key={item.id}
                                                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, cursor: "pointer" }}
                                                onClick={() => loadFromHistory(item)}
                                            >
                                                <Tag color={HTTP_METHODS.find(m => m.value === item.method)?.color} style={{ fontSize: 10 }}>{item.method}</Tag>
                                                <Tag color={getStatusColor(item.status)} style={{ fontSize: 10 }}>{item.status}</Tag>
                                                <Text style={{ flex: 1, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {item.url}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 10 }}>{item.time}ms</Text>
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </Col>
            </Row>

            {/* Save Request Modal */}
            <Modal
                title="Save Request"
                open={saveModalOpen}
                onOk={handleSaveRequest}
                onCancel={() => setSaveModalOpen(false)}
                okText="Save"
            >
                <Input
                    placeholder="Request name"
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    onPressEnter={handleSaveRequest}
                />
            </Modal>
        </ToolPageLayout>
    );
}

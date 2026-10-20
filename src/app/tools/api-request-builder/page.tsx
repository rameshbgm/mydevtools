"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { projectStorage } from "@/lib/project-storage";

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
    Card, Input, Select, Button, Typography, Row, Col, Space, Tabs, Table, Switch, Spin,
    Tag, Collapse, InputNumber, Tooltip, Modal, Form, Checkbox, Alert, Badge, Segmented,
    Empty,
} from "antd";
import { messageService as message } from "@/lib/messageService";
import {
    SendOutlined, PlusOutlined, DeleteOutlined, CopyOutlined, PlayCircleOutlined,
    ClockCircleOutlined, SaveOutlined, FolderOpenOutlined, HistoryOutlined, CodeOutlined,
    KeyOutlined, LockOutlined, SettingOutlined, DownloadOutlined, FileTextOutlined,
    ThunderboltOutlined, CloudOutlined, SafetyCertificateOutlined, FormOutlined,
    ImportOutlined, ExportOutlined, StopOutlined, EyeOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import SslConfigSection, { DEFAULT_SSL_CONFIG, buildSslProxyFields, type SslConfig } from "@/components/SslConfigSection";
import { substitute, buildVariableMap, type Environment } from "@/lib/api-builder/variables";
import { generateExtraClientCode, type ExtraCodeTarget } from "@/lib/api-builder/client-codegen";
import { parseCurl } from "@/lib/api-builder/curl-import";
import { parsePostmanCollection, exportPostmanCollection } from "@/lib/api-builder/postman-collection";
import { downloadText, downloadBytes } from "@/lib/download";
import { copyToClipboard } from "@/lib/clipboard";
import { parseJsonResponse, type ProxyResponsePayload } from "@/lib/certificate-fetch-response";
import { legacyFormFields, type ApiSavedRequest } from "@/lib/api-builder/request-model";
import ApiClientExtensions from "@/components/ApiClientExtensions";
import { connectorRequest } from "@/lib/local-connector-client";

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
    maxResponsePreviewBytes: number;
}

type SavedRequest = ApiSavedRequest;

interface HistoryItem {
    id: string;
    method: string;
    url: string;
    status: number;
    time: number;
    timestamp: string;
}

type BodyType = "none" | "json" | "xml" | "text" | "form-data" | "x-www-form-urlencoded" | "graphql" | "binary";

interface ResponseCookie {
    name: string;
    value: string;
    domain?: string;
    path?: string;
    expires?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: string;
}

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
    "Accept", "Accept-Charset", "Accept-Encoding", "Accept-Language", "Authorization",
    "Cache-Control", "Content-Type", "Cookie", "Host", "If-Match", "If-Modified-Since",
    "If-None-Match", "Origin", "Pragma", "Referer", "User-Agent", "X-Api-Key",
    "X-Correlation-ID", "X-Forwarded-For", "X-Forwarded-Host", "X-Request-ID", "X-Requested-With",
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

const MAX_REQUEST_BODY_BYTES = 25 * 1024 * 1024;   // mirror proxy cap
const HISTORY_LIMIT = 100;
const PREVIEW_MAX_DEFAULT = 512 * 1024;            // 512 KB inline preview by default

// ─── Helpers ────────────────────────────────────────────────────────

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
        200: "OK", 201: "Created", 204: "No Content",
        301: "Moved Permanently", 302: "Found", 304: "Not Modified",
        400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found",
        405: "Method Not Allowed", 409: "Conflict", 422: "Unprocessable Entity", 429: "Too Many Requests",
        500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout",
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

function parseSetCookies(headers: Record<string, string>): ResponseCookie[] {
    const raw = headers["set-cookie"] ?? headers["Set-Cookie"];
    if (!raw) return [];
    // Node's http.IncomingMessage joins multi-cookie responses with ", " but
    // expires dates can contain commas. Split on `,(?=[^;]+=)` — comma
    // followed by a token=… start.
    const parts = raw.split(/,(?=\s*[^;,=\s]+=)/);
    return parts.map((p) => parseOneCookie(p.trim())).filter(Boolean) as ResponseCookie[];
}

function parseOneCookie(raw: string): ResponseCookie | null {
    if (!raw) return null;
    const segments = raw.split(";").map((s) => s.trim());
    const first = segments[0];
    const eq = first.indexOf("=");
    if (eq === -1) return null;
    const cookie: ResponseCookie = { name: first.slice(0, eq), value: first.slice(eq + 1) };
    for (let i = 1; i < segments.length; i++) {
        const s = segments[i];
        const eq2 = s.indexOf("=");
        const k = (eq2 === -1 ? s : s.slice(0, eq2)).toLowerCase();
        const v = eq2 === -1 ? "" : s.slice(eq2 + 1);
        if (k === "domain") cookie.domain = v;
        else if (k === "path") cookie.path = v;
        else if (k === "expires") cookie.expires = v;
        else if (k === "secure") cookie.secure = true;
        else if (k === "httponly") cookie.httpOnly = true;
        else if (k === "samesite") cookie.sameSite = v;
    }
    return cookie;
}

function detectContentKind(contentType: string, body: string): "json" | "xml" | "html" | "image" | "text" | "binary" {
    const t = contentType.toLowerCase();
    if (t.includes("application/json") || t.includes("+json")) return "json";
    if (t.includes("xml")) return "xml";
    if (t.includes("text/html")) return "html";
    if (t.startsWith("image/")) return "image";
    if (t.startsWith("text/") || t.includes("javascript") || t.includes("graphql")) return "text";
    // sniff body when content-type is generic
    const trimmed = body.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
    if (trimmed.startsWith("<")) {
        return trimmed.toLowerCase().includes("<html") ? "html" : "xml";
    }
    return "binary";
}

// ─── Storage Keys ────────────────────────────────────────────────────

const STORAGE_KEYS = {
    SAVED_REQUESTS: "api-builder-saved-requests",
    HISTORY: "api-builder-history",
    ENVIRONMENTS: "api-builder-environments",
    ACTIVE_ENV: "api-builder-active-env",
};

// Authored errors retain their source key; provider diagnostics stay verbatim.
interface HttpClientNotice { source: string; values?: Record<string, string | number>; detail?: string; }
class HttpClientValidationError extends Error {
    constructor(readonly source: string, readonly values?: Record<string, string | number>) {
        super(source.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (match, key) => values && Object.hasOwn(values, key) ? String(values[key]) : match));
    }
}

// ─── Component ───────────────────────────────────────────────────────

export default function ApiRequestBuilderPage() {
    const { t } = useLanguage();
    const translateRef = useRef(t);
    useEffect(() => { translateRef.current = t; }, [t]);
    const notify = (kind: "success" | "warning" | "error", source: string, values?: Record<string, string | number>) => message[kind](translateRef.current(source, values));
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

    const [auth, setAuth] = useState<AuthConfig>({
        type: "none",
        basic: { username: "", password: "" },
        bearer: { token: "", prefix: "Bearer" },
        apiKey: { key: "X-Api-Key", value: "", addTo: "header" },
        oauth2: { accessToken: "", tokenType: "Bearer" },
    });

    const [settings, setSettings] = useState<RequestSettings>({
        timeout: 30000,
        followRedirects: true,
        validateSSL: true,
        maxResponsePreviewBytes: PREVIEW_MAX_DEFAULT,
    });

    // Response state
    const [response, setResponse] = useState<string | null>(null);
    const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
    const [responseIsBase64, setResponseIsBase64] = useState(false);
    const [status, setStatus] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const [responseSize, setResponseSize] = useState<number | null>(null);
    const [responseError, setResponseError] = useState<HttpClientNotice | null>(null);
    const [responseCookies, setResponseCookies] = useState<ResponseCookie[]>([]);
    const [responseTruncated, setResponseTruncated] = useState(false);

    // Header JSON/Form mode
    const [headerMode, setHeaderMode] = useState<"form" | "json">("form");
    const [headerJson, setHeaderJson] = useState("{}");

    // SSL/TLS configuration
    const [sslConfig, setSslConfig] = useState<SslConfig>(DEFAULT_SSL_CONFIG);
    const [transport, setTransport] = useState("managed");

    // UI state
    const [activeRequestTab, setActiveRequestTab] = useState("body");
    const [activeResponseTab, setActiveResponseTab] = useState("body");
    const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [requestName, setRequestName] = useState("");
    const [testScript, setTestScript] = useState("");
    const [testResults, setTestResults] = useState<{ name: string; passed: boolean; message?: string }[]>([]);
    const [cookies, setCookies] = useState<KeyValuePair[]>([]);

    // Environments
    const [environments, setEnvironments] = useState<Environment[]>([]);
    const [activeEnvId, setActiveEnvId] = useState<string | null>(null);
    const [envModalOpen, setEnvModalOpen] = useState(false);
    const [editingEnv, setEditingEnv] = useState<Environment | null>(null);

    // Import/Export
    const [curlModalOpen, setCurlModalOpen] = useState(false);
    const [curlText, setCurlText] = useState("");
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importText, setImportText] = useState("");

    // AbortController for in-flight request
    const abortRef = useRef<AbortController | null>(null);
    const confirmationRef = useRef<{ modal: ReturnType<typeof Modal.confirm>; names: string } | null>(null);
    // Refresh only the open confirmation's copy when the language changes.
    useEffect(() => {
        const confirmation = confirmationRef.current;
        confirmation?.modal.update({
            title: t("Unresolved variables"),
            content: t("These {{vars}} have no value in the active environment: {names}. Send anyway?", { names: confirmation.names }),
            okText: t("Send"), cancelText: t("Cancel"),
        });
    }, [t]);

    // SSR guard — antd Input/Select/Segmented internals get mutated by
    // browser extensions (Shark injects `data-sharkid`), so the safe pattern
    // is to render the form on the client only. See CLAUDE.md → "SSR / hydration".
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    // ── Load persisted data ──────────────────────────────────────────
    useEffect(() => {
        try {
            const saved = projectStorage.getItem(STORAGE_KEYS.SAVED_REQUESTS);
            if (saved) setSavedRequests(JSON.parse(saved));
            const hist = projectStorage.getItem(STORAGE_KEYS.HISTORY);
            if (hist) setHistory(JSON.parse(hist));
            const envs = projectStorage.getItem(STORAGE_KEYS.ENVIRONMENTS);
            if (envs) setEnvironments(JSON.parse(envs));
            const activeEnv = projectStorage.getItem(STORAGE_KEYS.ACTIVE_ENV);
            if (activeEnv) setActiveEnvId(activeEnv);
        } catch (e) {
            console.error("Failed to load saved data:", e);
        }
    }, []);

    const persistSavedRequests = useCallback((requests: SavedRequest[]) => {
        projectStorage.setItem(STORAGE_KEYS.SAVED_REQUESTS, JSON.stringify(requests));
        setSavedRequests(requests);
    }, []);

    const persistHistory = useCallback((items: HistoryItem[]) => {
        const trimmed = items.slice(0, HISTORY_LIMIT);
        projectStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
        setHistory(trimmed);
    }, []);

    const persistEnvironments = useCallback((envs: Environment[]) => {
        projectStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(envs));
        setEnvironments(envs);
    }, []);

    // ── Active environment + variable map ───────────────────────────
    const activeEnv = useMemo(
        () => environments.find((e) => e.id === activeEnvId) || null,
        [environments, activeEnvId],
    );
    const varMap = useMemo(() => buildVariableMap(activeEnv), [activeEnv]);

    // Live preview: list of unresolved variables visible in any input.
    const unresolvedVars = useMemo(() => {
        const collected: string[] = [
            url,
            ...headers.filter((h) => h.enabled).flatMap((h) => [h.key, h.value]),
            ...queryParams.filter((p) => p.enabled).flatMap((p) => [p.key, p.value]),
            body || "",
            graphqlQuery || "",
            graphqlVariables || "",
            auth.basic?.username || "", auth.basic?.password || "",
            auth.bearer?.token || "",
            auth.apiKey?.value || "",
            auth.oauth2?.accessToken || "",
        ];
        const u = new Set<string>();
        for (const v of collected) substitute(v, varMap).unresolved.forEach((x) => u.add(x));
        return Array.from(u);
    }, [url, headers, queryParams, body, graphqlQuery, graphqlVariables, auth, varMap]);

    // ── Build outbound request (with variable substitution everywhere) ──
    const buildUrl = useCallback(() => {
        try {
            const resolvedUrl = substitute(url, varMap).resolved;
            const urlObj = new URL(resolvedUrl);
            queryParams.filter((p) => p.enabled && p.key).forEach((p) => {
                const k = substitute(p.key, varMap).resolved;
                const v = substitute(p.value, varMap).resolved;
                urlObj.searchParams.set(k, v);
            });
            if (auth.type === "api-key" && auth.apiKey?.addTo === "query" && auth.apiKey.value) {
                urlObj.searchParams.set(
                    substitute(auth.apiKey.key, varMap).resolved,
                    substitute(auth.apiKey.value, varMap).resolved,
                );
            }
            return urlObj.toString();
        } catch {
            return substitute(url, varMap).resolved;
        }
    }, [url, queryParams, auth, varMap]);

    const buildHeaders = useCallback((): Record<string, string> => {
        const headerObj: Record<string, string> = {};
        headers.filter((h) => h.enabled && h.key).forEach((h) => {
            headerObj[substitute(h.key, varMap).resolved] = substitute(h.value, varMap).resolved;
        });
        switch (auth.type) {
            case "basic":
                if (auth.basic?.username) {
                    const u = substitute(auth.basic.username, varMap).resolved;
                    const p = substitute(auth.basic.password, varMap).resolved;
                    headerObj["Authorization"] = `Basic ${btoa(`${u}:${p}`)}`;
                }
                break;
            case "bearer":
                if (auth.bearer?.token) {
                    headerObj["Authorization"] = `${auth.bearer.prefix} ${substitute(auth.bearer.token, varMap).resolved}`;
                }
                break;
            case "api-key":
                if (auth.apiKey?.addTo === "header" && auth.apiKey.value) {
                    headerObj[substitute(auth.apiKey.key, varMap).resolved] = substitute(auth.apiKey.value, varMap).resolved;
                }
                break;
            case "oauth2":
                if (auth.oauth2?.accessToken) {
                    headerObj["Authorization"] = `${auth.oauth2.tokenType} ${substitute(auth.oauth2.accessToken, varMap).resolved}`;
                }
                break;
        }
        const enabledCookies = cookies.filter((c) => c.enabled && c.key);
        if (enabledCookies.length > 0) {
            headerObj["Cookie"] = enabledCookies
                .map((c) => `${substitute(c.key, varMap).resolved}=${substitute(c.value, varMap).resolved}`)
                .join("; ");
        }
        return headerObj;
    }, [headers, auth, cookies, varMap]);

    const buildBody = useCallback((): string | FormData | null => {
        if (["GET", "HEAD", "OPTIONS"].includes(method)) return null;
        switch (bodyType) {
            case "none":
                return null;
            case "json":
            case "xml":
            case "text":
                return substitute(body, varMap).resolved;
            case "graphql":
                try {
                    const varStr = substitute(graphqlVariables, varMap).resolved;
                    const vars = varStr.trim() ? JSON.parse(varStr) : {};
                    if (!vars || typeof vars !== "object" || Array.isArray(vars)) throw new Error("GraphQL variables must be an object.");
                    return `{"query":${JSON.stringify(substitute(graphqlQuery, varMap).resolved)},"variables":${varStr.trim() || "{}"}}`;
                } catch {
                    return JSON.stringify({ query: substitute(graphqlQuery, varMap).resolved });
                }
            case "x-www-form-urlencoded":
                return formData.filter((f) => f.enabled && f.key)
                    .map((f) => {
                        const k = substitute(f.key, varMap).resolved;
                        const v = substitute(f.value, varMap).resolved;
                        return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
                    }).join("&");
            case "form-data": {
                const fd = new FormData();
                formData.filter((f) => f.enabled && f.key).forEach((f) => {
                    fd.append(substitute(f.key, varMap).resolved, substitute(f.value, varMap).resolved);
                });
                return fd;
            }
            default:
                return substitute(body, varMap).resolved;
        }
    }, [method, bodyType, body, formData, graphqlQuery, graphqlVariables, varMap]);

    // ── Test runner ──────────────────────────────────────────────────
    const runTestScript = useCallback((responseData: string, statusCode: number, hdrs: Record<string, string>, time: number) => {
        if (!testScript.trim()) { setTestResults([]); return; }
        const results: { name: string; passed: boolean; message?: string }[] = [];
        const pm = {
            response: {
                code: statusCode,
                status: getStatusText(statusCode),
                responseTime: time,
                headers: { get: (key: string) => hdrs[key.toLowerCase()] || hdrs[key] },
                json: () => { try { return JSON.parse(responseData); } catch { return null; } },
                text: () => responseData,
            },
            test: (name: string, fn: () => void) => {
                try { fn(); results.push({ name, passed: true }); }
                catch (e) { results.push({ name, passed: false, message: e instanceof Error ? e.message : String(e) }); }
            },
            expect: (value: unknown) => ({
                to: {
                    equal: (expected: unknown) => { if (value !== expected) throw new Error(`Expected ${expected} but got ${value}`); },
                    be: {
                        true: () => { if (value !== true) throw new Error(`Expected true but got ${value}`); },
                        false: () => { if (value !== false) throw new Error(`Expected false but got ${value}`); },
                        null: () => { if (value !== null) throw new Error(`Expected null but got ${value}`); },
                        undefined: () => { if (value !== undefined) throw new Error(`Expected undefined but got ${value}`); },
                        above: (n: number) => { if (!((value as number) > n)) throw new Error(`Expected > ${n} but got ${value}`); },
                        below: (n: number) => { if (!((value as number) < n)) throw new Error(`Expected < ${n} but got ${value}`); },
                        a: (type: string) => { if (typeof value !== type) throw new Error(`Expected type ${type} but got ${typeof value}`); },
                    },
                    have: {
                        status: (code: number) => { if (statusCode !== code) throw new Error(`Expected status ${code} but got ${statusCode}`); },
                        property: (prop: string) => { if (!value || typeof value !== "object" || !(prop in value)) throw new Error(`Missing property: ${prop}`); },
                        lengthOf: (len: number) => { if ((value as { length: number }).length !== len) throw new Error(`Expected length ${len} but got ${(value as { length: number }).length}`); },
                    },
                    include: (item: unknown) => {
                        if (Array.isArray(value)) { if (!value.includes(item)) throw new Error(`Array does not include ${item}`); }
                        else if (typeof value === "string") { if (!value.includes(item as string)) throw new Error(`String does not include ${item}`); }
                    },
                },
                eql: (expected: unknown) => {
                    if (JSON.stringify(value) !== JSON.stringify(expected)) throw new Error("Deep equality failed");
                },
            }),
        };
        try {
            const fn = new Function("pm", testScript);
            fn(pm);
        } catch (e) {
            results.push({ name: "Script Error", passed: false, message: e instanceof Error ? e.message : String(e) });
        }
        setTestResults(results);
    }, [testScript]);

    // ── Send request ─────────────────────────────────────────────────
    const sendRequest = async () => {
        // Edge: bail loudly on obviously broken input rather than going to the proxy.
        const trimmedUrl = url.trim();
        if (!trimmedUrl) { notify("warning", "Enter a URL first"); return; }
        if (unresolvedVars.length > 0) {
            const ok = await new Promise<boolean>((resolve) => {
                const modal = Modal.confirm({
                    title: translateRef.current("Unresolved variables"),
                    content: translateRef.current("These {{vars}} have no value in the active environment: {names}. Send anyway?", { names: unresolvedVars.join(", ") }),
                    okText: translateRef.current("Send"),
                    cancelText: translateRef.current("Cancel"),
                    onOk: () => { confirmationRef.current = null; resolve(true); },
                    onCancel: () => { confirmationRef.current = null; resolve(false); },
                });
                confirmationRef.current = { modal, names: unresolvedVars.join(", ") };
            });
            if (!ok) return;
        }

        setLoading(true);
        setResponse(null);
        setStatus(null);
        setResponseTime(null);
        setResponseSize(null);
        setResponseError(null);
        setResponseCookies([]);
        setResponseTruncated(false);
        setTestResults([]);

        // Cancel any prior in-flight request.
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const finalUrl = buildUrl();
            try { new URL(finalUrl); }
            catch { throw new HttpClientValidationError("Invalid URL after variable substitution: {url}", { url: finalUrl }); }

            const headerObj = buildHeaders();
            if (bodyType === "graphql") {
                const values = JSON.parse(substitute(graphqlVariables, varMap).resolved || "{}");
                if (!values || typeof values !== "object" || Array.isArray(values)) throw new HttpClientValidationError("GraphQL variables must be a JSON object.");
            }
            const requestBody = buildBody();

            let proxyBody: string | null = null;
            let bodyIsBase64 = false;

            if (requestBody !== null) {
                if (requestBody instanceof FormData) {
                    const serialized = new Response(requestBody);
                    const contentType = serialized.headers.get("content-type");
                    if (contentType) headerObj["Content-Type"] = contentType;
                    const buf = await serialized.arrayBuffer();
                    if (buf.byteLength > MAX_REQUEST_BODY_BYTES) {
                        throw new HttpClientValidationError("Request body too large ({size} > {limit})", { size: formatBytes(buf.byteLength), limit: formatBytes(MAX_REQUEST_BODY_BYTES) });
                    }
                    // chunked btoa: avoid the call-stack overflow that String.fromCharCode(...big) hits
                    const u8 = new Uint8Array(buf);
                    let binary = "";
                    const chunk = 0x8000;
                    for (let i = 0; i < u8.length; i += chunk) {
                        binary += String.fromCharCode(...u8.subarray(i, i + chunk));
                    }
                    proxyBody = btoa(binary);
                    bodyIsBase64 = true;
                } else {
                    const s = requestBody as string;
                    if (new Blob([s]).size > MAX_REQUEST_BODY_BYTES) {
                        throw new HttpClientValidationError("Request body too large (> {limit})", { limit: formatBytes(MAX_REQUEST_BODY_BYTES) });
                    }
                    proxyBody = s;
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
                ...buildSslProxyFields({
                    ...sslConfig,
                    sslVerify: sslConfig.sslVerify,
                }),
            };

            let data: ProxyResponsePayload;
            if (transport === "native") {
                if (!sslConfig.sslVerify) throw new HttpClientValidationError("The native HTTP connector requires certificate verification. Enable it in SSL / TLS settings.");
                data = await connectorRequest<ProxyResponsePayload>({ service: "request", url: finalUrl, method, headers: headerObj, body: proxyBody, bodyIsBase64, timeout: Math.max(100, Math.min(15000, settings.timeout)), followRedirects: settings.followRedirects, tls: { ca: sslConfig.sslCaCert, certificate: sslConfig.sslClientCert, privateKey: sslConfig.sslClientKey } }, controller.signal);
            } else {
            const proxyRes = await fetch("/api/proxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(proxyReq),
                signal: controller.signal,
            });

            data = await parseJsonResponse<ProxyResponsePayload>(proxyRes, "Proxy service");
            }

            setResponseTime(data.timing ?? 0);
            setStatus(data.status ?? 0);
            setResponseHeaders(data.headers ?? {});
            setResponseSize(data.size ?? 0);
            setResponseCookies(parseSetCookies(data.headers ?? {}));
            setResponseTruncated(Boolean((data.headers ?? {})["x-mydevtools-truncated"]));

            const contentType: string = data.headers?.["content-type"] ?? "";
            let bodyText: string = data.body ?? "";
            if (!data.bodyIsBase64 && (contentType.includes("application/json") || contentType.includes("+json"))) {
                try { bodyText = JSON.stringify(JSON.parse(bodyText), null, 2); }
                catch { /* keep as-is */ }
            }
            setResponse(bodyText);
            setResponseIsBase64(Boolean(data.bodyIsBase64));

            persistHistory([{
                id: generateId(), method, url: finalUrl,
                status: data.status ?? 0, time: data.timing ?? 0,
                timestamp: new Date().toISOString(),
            }, ...history]);

            runTestScript(bodyText, data.status ?? 0, data.headers ?? {}, data.timing ?? 0);
        } catch (err: unknown) {
            const aborted = err instanceof DOMException && err.name === "AbortError";
            if (aborted) {
                setResponseError({ source: "Cancelled" });
            } else {
                const msg = err instanceof Error ? err.message : String(err);
                setResponseError(err instanceof HttpClientValidationError ? { source: err.source, values: err.values } : { source: "Request failed.", detail: msg });
                setResponse(`Error: ${msg}`);
                setStatus(0);
            }
        } finally {
            setLoading(false);
            abortRef.current = null;
        }
    };

    const cancelRequest = () => abortRef.current?.abort();

    // ── Key-value helpers ────────────────────────────────────────────
    const addItem = (setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>) => {
        setter((prev) => [...prev, { id: generateId(), key: "", value: "", enabled: true }]);
    };
    const removeItem = (setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>, id: string) => {
        setter((prev) => prev.filter((item) => item.id !== id));
    };
    const updateItem = (
        setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>,
        id: string, field: keyof KeyValuePair, value: string | boolean,
    ) => {
        setter((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
    };

    // ── Header form ↔ JSON ───────────────────────────────────────────
    const headersToJson = (hdrs: KeyValuePair[]): string => {
        const obj: Record<string, string> = {};
        hdrs.filter((h) => h.enabled && h.key).forEach((h) => { obj[h.key] = h.value; });
        return Object.keys(obj).length === 0 ? "{}" : JSON.stringify(obj, null, 2);
    };
    const jsonToHeaderPairs = (json: string): KeyValuePair[] | null => {
        try {
            const obj = JSON.parse(json);
            if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return null;
            return Object.entries(obj).map(([key, value]) => ({
                id: generateId(), key, value: String(value), enabled: true,
            }));
        } catch { return null; }
    };
    const switchHeaderMode = (mode: "form" | "json") => {
        if (mode === "json") setHeaderJson(headersToJson(headers));
        else {
            const parsed = jsonToHeaderPairs(headerJson);
            if (parsed !== null) setHeaders(parsed);
        }
        setHeaderMode(mode);
    };

    // ── Save / load requests ─────────────────────────────────────────
    const handleSaveRequest = () => {
        if (!requestName.trim()) { notify("warning", "Please enter a request name"); return; }
        const newRequest: SavedRequest = {
            id: generateId(), name: requestName, method, url,
            headers, queryParams, body, bodyType, auth, settings, formData, graphqlQuery, graphqlVariables,
            createdAt: new Date().toISOString(),
        };
        persistSavedRequests([newRequest, ...savedRequests]);
        setSaveModalOpen(false);
        setRequestName("");
        notify("success", "Request saved!");
    };
    const loadRequest = (req: SavedRequest) => {
        setMethod(req.method); setUrl(req.url);
        setHeaders(req.headers); setQueryParams(req.queryParams);
        setBody(req.body); setBodyType(req.bodyType);
        setFormData(legacyFormFields(req));
        setGraphqlQuery(req.graphqlQuery ?? SAMPLE_GRAPHQL); setGraphqlVariables(req.graphqlVariables ?? "{}");
        setHeaderMode("form"); setCookies([]);
        setAuth(req.auth); setSettings(req.settings);
        notify("success", "Loaded: {name}", { name: req.name });
    };
    const deleteRequest = (id: string) => {
        persistSavedRequests(savedRequests.filter((r) => r.id !== id));
        notify("success", "Request deleted");
    };
    const loadFromHistory = (item: HistoryItem) => { setMethod(item.method); setUrl(item.url); };

    // ── Environment management ────────────────────────────────────────
    const openNewEnv = () => {
        setEditingEnv({ id: generateId(), name: translateRef.current("New Environment"), variables: [] });
        setEnvModalOpen(true);
    };
    const openEditEnv = (env: Environment) => {
        setEditingEnv(JSON.parse(JSON.stringify(env)));
        setEnvModalOpen(true);
    };
    const saveEnv = () => {
        if (!editingEnv) return;
        const others = environments.filter((e) => e.id !== editingEnv.id);
        const next = [...others, editingEnv].sort((a, b) => a.name.localeCompare(b.name));
        persistEnvironments(next);
        setEnvModalOpen(false);
        setEditingEnv(null);
        notify("success", "Environment saved");
    };
    const deleteEnv = (id: string) => {
        persistEnvironments(environments.filter((e) => e.id !== id));
        if (activeEnvId === id) {
            setActiveEnvId(null);
            projectStorage.removeItem(STORAGE_KEYS.ACTIVE_ENV);
        }
        notify("success", "Environment deleted");
    };
    const selectEnv = (id: string | null) => {
        setActiveEnvId(id);
        if (id) projectStorage.setItem(STORAGE_KEYS.ACTIVE_ENV, id);
        else projectStorage.removeItem(STORAGE_KEYS.ACTIVE_ENV);
    };

    // ── cURL import ───────────────────────────────────────────────────
    const handleCurlImport = () => {
        if (!curlText.trim()) { notify("warning", "Paste a curl command"); return; }
        try {
            const parsed = parseCurl(curlText);
            setMethod(parsed.method);
            setUrl(parsed.url);
            setHeaders(parsed.headers.map((h) => ({ id: generateId(), key: h.key, value: h.value, enabled: true })));
            setQueryParams(parsed.queryParams.map((p) => ({ id: generateId(), key: p.key, value: p.value, enabled: true })));
            if (parsed.body !== null) {
                setBody(parsed.body);
                setBodyType(parsed.bodyType === "x-www-form-urlencoded" ? "x-www-form-urlencoded" : parsed.bodyType || "text");
                setFormData(parsed.bodyType === "x-www-form-urlencoded" ? [...new URLSearchParams(parsed.body)].map(([key, value]) => ({ id: generateId(), key, value, enabled: true })) : []);
            } else {
                setBody(""); setBodyType("none");
            }
            if (parsed.basicAuth) {
                setAuth((a) => ({ ...a, type: "basic", basic: parsed.basicAuth! }));
            }
            if (parsed.cookies) {
                const parsed2 = parsed.cookies.split(";").map((c) => c.trim()).filter(Boolean).map((c) => {
                    const eq = c.indexOf("=");
                    return { id: generateId(), key: c.slice(0, eq), value: c.slice(eq + 1), enabled: true };
                });
                setCookies(parsed2);
            }
            setCurlModalOpen(false);
            setCurlText("");
            notify("success", "cURL imported");
        } catch (e) {
            notify("error", "Import failed: {detail}", { detail: e instanceof Error ? e.message : String(e) });
        }
    };

    // ── Postman Collection import / export ────────────────────────────
    const handlePostmanImport = () => {
        if (!importText.trim()) { notify("warning", "Paste a Postman Collection JSON"); return; }
        try {
            const reqs = parsePostmanCollection(importText);
            const mapped: SavedRequest[] = reqs.map((r) => ({
                id: generateId(),
                name: r.name,
                method: r.method,
                url: r.url,
                headers: r.headers.map((h) => ({ id: generateId(), key: h.key, value: h.value, enabled: true })),
                queryParams: r.queryParams.map((q) => ({ id: generateId(), key: q.key, value: q.value, enabled: true })),
                body: r.body,
                formData: r.formData?.map((field) => ({ ...field, id: generateId(), enabled: true })),
                graphqlQuery: r.graphqlQuery,
                graphqlVariables: r.graphqlVariables,
                bodyType: r.bodyMode === "raw"
                    ? (r.rawLanguage === "json" ? "json" : r.rawLanguage === "xml" ? "xml" : "text")
                    : r.bodyMode === "urlencoded" ? "x-www-form-urlencoded"
                        : r.bodyMode === "formdata" ? "form-data" : r.bodyMode === "graphql" ? "graphql" : "none",
                auth: { type: "none", basic: { username: "", password: "" }, bearer: { token: "", prefix: "Bearer" },
                    apiKey: { key: "X-Api-Key", value: "", addTo: "header" }, oauth2: { accessToken: "", tokenType: "Bearer" } },
                settings: { timeout: 30000, followRedirects: true, validateSSL: true, maxResponsePreviewBytes: PREVIEW_MAX_DEFAULT },
                createdAt: new Date().toISOString(),
            }));
            persistSavedRequests([...mapped, ...savedRequests]);
            setImportModalOpen(false);
            setImportText("");
            notify("success", "Requests imported: {count}", { count: mapped.length });
        } catch (e) {
            notify("error", "Import failed: {detail}", { detail: e instanceof Error ? e.message : String(e) });
        }
    };

    const handlePostmanExport = () => {
        if (savedRequests.length === 0) { notify("warning", "No saved requests to export"); return; }
        const json = exportPostmanCollection({
            name: "mydevtools API Request Builder export",
            requests: savedRequests.map((r) => ({
                name: r.name,
                method: r.method,
                url: r.url,
                headers: r.headers.map((h) => ({ key: h.key, value: h.value, enabled: h.enabled })),
                queryParams: r.queryParams.map((q) => ({ key: q.key, value: q.value, enabled: q.enabled })),
                body: r.body,
                bodyType: r.bodyType,
                formData: legacyFormFields(r), graphqlQuery: r.graphqlQuery, graphqlVariables: r.graphqlVariables,
            })),
        });
        downloadText(json, "mydevtools-collection.json", "application/json");
        notify("success", "Collection downloaded");
    };

    // ── Response actions ──────────────────────────────────────────────
    const downloadResponse = () => {
        if (response === null) return;
        const contentType = responseHeaders["content-type"] ?? "application/octet-stream";
        const ext = contentType.includes("json") ? "json" : contentType.includes("xml") ? "xml" : contentType.includes("html") ? "html" : "bin";
        const filename = `response-${Date.now()}.${ext}`;
        if (responseIsBase64) {
            const bin = atob(response);
            const arr = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
            downloadBytes(arr, filename, contentType);
        } else {
            downloadText(response, filename, contentType);
        }
    };

    const copyResponse = () => {
        if (response === null) return;
        copyToClipboard(response, translateRef.current("Response copied"));
    };

    // ── cURL + code snippets ──────────────────────────────────────────
    const generateCurl = useCallback(() => {
        const parts = [`curl -X ${method}`];
        const headerObj = buildHeaders();
        Object.entries(headerObj).forEach(([key, value]) => parts.push(`-H '${key}: ${value}'`));
        const requestBody = buildBody();
        if (requestBody && typeof requestBody === "string") {
            parts.push(`-d '${requestBody.replace(/'/g, "'\\''")}'`);
        }
        parts.push(`'${buildUrl()}'`);
        return parts.join(" \\\n  ");
    }, [method, buildHeaders, buildBody, buildUrl]);

    const generateCodeSnippet = useCallback((language: string): string => {
        const finalUrl = buildUrl();
        const headerObj = buildHeaders();
        const requestBody = buildBody();
        if (["php", "ruby", "csharp"].includes(language)) {
            try {
                const payload = requestBody instanceof FormData ? Array.from(requestBody.entries()).map(([key, value]): [string, string] => { if (typeof value !== "string") throw new Error("Code samples currently support textual multipart fields."); return [key, value]; }) : requestBody;
                return generateExtraClientCode(language as ExtraCodeTarget, { url: finalUrl, method, headers: headerObj, body: payload });
            } catch (cause) { return `${language === "ruby" ? "#" : "//"} ${cause instanceof Error ? cause.message : String(cause)}`; }
        }
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
            case "node-http":
                return `const https = require('https');
const data = ${typeof requestBody === "string" ? JSON.stringify(requestBody) : '""'};
const req = https.request('${finalUrl}', {
  method: '${method}',
  headers: ${JSON.stringify(headerObj, null, 2)},
}, (res) => {
  let body = '';
  res.on('data', (c) => body += c);
  res.on('end', () => console.log(res.statusCode, body));
});
${requestBody ? "req.write(data);" : ""}
req.end();`;
            case "go":
                return `package main

import (
    "fmt"
    "io"
    "net/http"
    "strings"
)

func main() {
    payload := strings.NewReader(${typeof requestBody === "string" ? JSON.stringify(requestBody) : '""'})
    req, _ := http.NewRequest("${method}", "${finalUrl}", payload)
${Object.entries(headerObj).map(([k, v]) => `    req.Header.Set("${k}", "${v}")`).join("\n")}
    res, _ := http.DefaultClient.Do(req)
    defer res.Body.Close()
    body, _ := io.ReadAll(res.Body)
    fmt.Println(string(body))
}`;
            case "java":
                return `HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${finalUrl}"))
    .method("${method}", ${requestBody ? `HttpRequest.BodyPublishers.ofString(${JSON.stringify(requestBody)})` : "HttpRequest.BodyPublishers.noBody()"})
${Object.entries(headerObj).map(([k, v]) => `    .header("${k}", "${v}")`).join("\n")}
    .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`;
            default:
                return generateCurl();
        }
    }, [method, buildUrl, buildHeaders, buildBody, bodyType, generateCurl]);

    const methodColor = HTTP_METHODS.find((m) => m.value === method)?.color || "#1677ff";

    const testSummary = useMemo(() => {
        const passed = testResults.filter((t) => t.passed).length;
        const failed = testResults.filter((t) => !t.passed).length;
        return { passed, failed, total: testResults.length };
    }, [testResults]);

    // ── Response preview content ─────────────────────────────────────
    const responseKind = useMemo(() => {
        if (response === null) return "binary";
        return detectContentKind(responseHeaders["content-type"] ?? "", responseIsBase64 ? "" : response);
    }, [response, responseHeaders, responseIsBase64]);

    const responseDataUrl = useMemo(() => {
        if (response === null || !responseIsBase64) return null;
        const ct = responseHeaders["content-type"] ?? "application/octet-stream";
        return `data:${ct};base64,${response}`;
    }, [response, responseIsBase64, responseHeaders]);

    const responseTooBigForInline = useMemo(() => {
        if (response === null) return false;
        return response.length > settings.maxResponsePreviewBytes;
    }, [response, settings.maxResponsePreviewBytes]);

    return (
        <ToolPageLayout
            title={t("API Request Builder")}
            description={t("HTTP and gRPC clients, collection runner, local mock server, environments, imports and code generation")}
            icon={<SendOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: t("An HTTP client with environment variables, saved requests, cURL/Postman import, response previews, tests and client code generation. A collection runner adds ordered requests, assertions and response captures. The localhost connector supports native HTTP, four gRPC call styles and temporary local HTTP mocks."),
                whyUse: t("Keep saved requests and environments in this browser while choosing how each network action runs. Managed HTTP passes through this deployment's server to a public endpoint. Native HTTP, gRPC and mocks run through your authenticated localhost runtime."),
                howToUse: [
                    t("Enter the URL and pick a method (cURL Import accepts pasted curl commands)"),
                    t("Set up an environment (gear icon) so {{baseUrl}}, {{token}}, etc. resolve at send time"),
                    t("Add headers, query params, body, auth — they all participate in variable substitution"),
                    t("Hit Send; Cancel is available while in-flight"),
                    t("Inspect the response: pretty/raw/preview/cookies/headers/tests"),
                ],
                tips: [
                    t("Variables: `{{var}}` works in URL, headers, query, body, auth — anywhere a value lives"),
                    t("Built-ins: `{{$timestamp}}`, `{{$isoTimestamp}}`, `{{$randomUUID}}`, `{{$randomInt}}` always work without setup"),
                    t("Unresolved variables produce a confirmation prompt before sending — they never silently become empty"),
                    t("Cancel mid-flight to abort long requests cleanly (AbortController under the hood)"),
                    t("Response bigger than 25MB is truncated with a visible warning; binary responses get a download button"),
                    t("Postman imports flatten folders and support raw text, JSON, XML, text form fields and GraphQL. Attach file references manually; collection scripts and auth inheritance are not imported."),
                    t("Use the section below for collection captures/assertions, proto-based gRPC calls and bounded local mock servers."),
                ],
                useCases: [
                    t("Testing REST/GraphQL APIs during development"),
                    t("Reproducing browser network requests by pasting their curl form"),
                    t("Sharing prepared requests with teammates via Postman Collection export"),
                    t("Generating client code in JavaScript, Python, Go, Java, PHP, Ruby and C#"),
                ],
                serverNotice: {
                    route: "proxy",
                    purpose: t("Managed HTTP requests pass through this deployment's proxy. Native HTTP and gRPC require an authenticated localhost runtime. Mock configurations create a temporary loopback server on your device."),
                    sentFields: [
                        t("Target URL after {{variable}} substitution"),
                        t("Method, headers (Authorization included), query string and body — exactly as composed"),
                        t("SSL/TLS options if you configured them (CA bundle, mTLS cert/key)"),
                        t("For gRPC: proto files, selected method, metadata and request messages; for mocks: response configuration and allowed browser origins"),
                    ],
                    extra: (
                        <Text style={{ fontSize: 12 }}>
                            {t("Request credentials and payloads are not written to application logs. Saved HTTP requests, history, environments and collection plans use browser storage. RPC inputs/results remain in page memory. Mock configuration and recent requests remain in the localhost runtime's memory until stopped, expired or restarted.")}
                        </Text>
                    ),
                },
            }}
        >
            {!mounted ? (
                <div style={{ textAlign: "center", padding: 60 }}>
                    <Spin />
                </div>
            ) : (
            <>
            <p><a href="#api-client-extensions">{t("Collection runner, gRPC and local mocks")}</a></p>
            <div className="wb-workbench" style={{ marginBlockEnd: 16 }}><label>{t("HTTP transport")}<Select aria-label={t("HTTP transport")} value={transport} onChange={setTransport} options={[{ value: "managed", label: t("Managed proxy · public endpoints") }, { value: "native", label: t("Local connector · private / localhost") }]} style={{ maxWidth: "100%", width: 360 }} /></label>{transport === "native" && <p>{t("Enable connector access below. Native requests verify TLS, support custom CA / client certificates, and are limited to 1 MiB request, 2 MiB response and 15 seconds.")}</p>}</div>
            <Row gutter={[16, 16]}>
                {/* ── Left: Request ── */}
                <Col xs={24} xl={14}>
                    <Card size="small">
                        {/* Environment + Import bar */}
                        <Space wrap style={{ marginBottom: 12, width: "100%", justifyContent: "space-between" }}>
                            <Space wrap>
                                <Text type="secondary" style={{ fontSize: 12 }}>{t("Environment:")}</Text>
                                <Select
                                    size="small"
                                    value={activeEnvId || "__none__"}
                                    onChange={(v) => selectEnv(v === "__none__" ? null : v)}
                                    style={{ minWidth: 180 }}
                                    options={[
                                        { value: "__none__", label: t("No environment") },
                                        ...environments.map((e) => ({ value: e.id, label: e.name })),
                                    ]}
                                />
                                <Tooltip title={t("Manage environments")}>
                                    <Button aria-label={t("Settings")} size="small" icon={<SettingOutlined />} onClick={openNewEnv} />
                                </Tooltip>
                                {activeEnv && (
                                    <Tag color="blue">{t("Variables: {count}", { count: activeEnv.variables.filter((v) => v.enabled).length })}</Tag>
                                )}
                                {unresolvedVars.length > 0 && (
                                    <Tooltip title={t("Unresolved: {names}", { names: unresolvedVars.join(", ") })}>
                                        <Tag color="red">{t("Unresolved: {count}", { count: unresolvedVars.length })}</Tag>
                                    </Tooltip>
                                )}
                            </Space>
                            <Space wrap>
                                <Tooltip title={t("Import from cURL")}>
                                    <Button size="small" icon={<ImportOutlined />} onClick={() => setCurlModalOpen(true)}>cURL</Button>
                                </Tooltip>
                                <Tooltip title={t("Import Postman Collection")}>
                                    <Button size="small" icon={<ImportOutlined />} onClick={() => setImportModalOpen(true)}>Postman</Button>
                                </Tooltip>
                                <Tooltip title={t("Export saved requests as Postman v2.1 Collection")}>
                                    <Button size="small" icon={<ExportOutlined />} onClick={handlePostmanExport}>{t("Export")}</Button>
                                </Tooltip>
                            </Space>
                        </Space>

                        {/* URL Bar */}
                        <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
                            <Select value={method} onChange={setMethod} aria-label={t("HTTP method")} style={{ minWidth: 120 }} size="large">
                                {HTTP_METHODS.map((m) => (
                                    <Select.Option key={m.value} value={m.value}>
                                        <span dir="ltr" style={{ color: m.color, fontWeight: 600 }}>{m.value}</span>
                                    </Select.Option>
                                ))}
                            </Select>
                            <Input dir="ltr"
                                styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                size="large"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                aria-label={t("Request URL")}
                                placeholder={t("Enter request URL — supports {{variables}}") }
                                style={{ flex: 1 }}
                                onPressEnter={sendRequest}
                            />
                            {loading ? (
                                <Button size="large" danger icon={<StopOutlined />} onClick={cancelRequest}>{t("Cancel")}</Button>
                            ) : (
                                <Button
                                    type="primary" size="large" icon={<PlayCircleOutlined />}
                                    onClick={sendRequest} style={{ background: methodColor }}
                                >
                                    {t("Send")}
                                </Button>
                            )}
                        </Space.Compact>

                        {/* Live URL preview after substitution */}
                        {url && (
                            <div style={{ marginBottom: 12, padding: "6px 10px", background: "rgba(0,0,0,0.03)", borderRadius: 4, fontSize: 11, fontFamily: "var(--font-geist-mono)", wordBreak: "break-all" }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>→ </Text>
                                <Text dir="ltr" style={{ fontSize: 11 }}>{buildUrl()}</Text>
                            </div>
                        )}

                        {/* Request Tabs */}
                        <Tabs
                            activeKey={activeRequestTab}
                            onChange={setActiveRequestTab}
                            size="small"
                            tabBarExtraContent={
                                <Tooltip title={t("Save Request")}>
                                    <Button aria-label={t("Save")} size="small" icon={<SaveOutlined />} onClick={() => setSaveModalOpen(true)} />
                                </Tooltip>
                            }
                            items={[
                                {
                                    key: "body",
                                    label: <><FileTextOutlined /> {t("Body")}</>,
                                    children: (
                                        <div>
                                            <Segmented
                                                value={bodyType}
                                                onChange={(v) => {
                                                    setBodyType(v as BodyType);
                                                    const ct = CONTENT_TYPES[v as BodyType];
                                                    if (ct) {
                                                        setHeaders((prev) => {
                                                            const idx = prev.findIndex((h) => h.key === "Content-Type");
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
                                                    { label: t("none"), value: "none" },
                                                    { label: "JSON", value: "json" },
                                                    { label: "XML", value: "xml" },
                                                    { label: t("Text"), value: "text" },
                                                    { label: t("Form URL"), value: "x-www-form-urlencoded" },
                                                    { label: t("Form Data"), value: "form-data" },
                                                    { label: "GraphQL", value: "graphql" },
                                                ]}
                                                style={{ marginBottom: 12 }}
                                            />
                                            {bodyType === "none" && (
                                                <Alert title={t("This request does not have a body")} type="info" showIcon />
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
                                                        <Text type="secondary" style={{ fontSize: 11 }}>{t("Query")}</Text>
                                                        <CodeEditor value={graphqlQuery} onChange={(val) => setGraphqlQuery(val || "")} language="graphql" height={150} />
                                                    </Col>
                                                    <Col span={10}>
                                                        <Text type="secondary" style={{ fontSize: 11 }}>{t("Variables")}</Text>
                                                        <CodeEditor value={graphqlVariables} onChange={(val) => setGraphqlVariables(val || "")} language="json" height={150} />
                                                    </Col>
                                                </Row>
                                            )}
                                            {(bodyType === "x-www-form-urlencoded" || bodyType === "form-data") && (
                                                <div>
                                                    {formData.map((f) => (
                                                        <Space key={f.id} style={{ width: "100%", marginBottom: 8 }}>
                                                            <Switch aria-label={t("Enable form field")} checked={f.enabled} onChange={(v) => updateItem(setFormData, f.id, "enabled", v)} size="small" />
                                                            <Input dir="ltr" value={f.key} onChange={(e) => updateItem(setFormData, f.id, "key", e.target.value)} placeholder={t("Key")} style={{ width: 150 }} />
                                                            <Input dir="ltr" value={f.value} onChange={(e) => updateItem(setFormData, f.id, "value", e.target.value)} placeholder={t("Value")} style={{ flex: 1 }} />
                                                            <Button aria-label={t("Delete")} icon={<DeleteOutlined />} danger size="small" onClick={() => removeItem(setFormData, f.id)} />
                                                        </Space>
                                                    ))}
                                                    <Button icon={<PlusOutlined />} size="small" onClick={() => addItem(setFormData)}>{t("Add Field")}</Button>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    key: "headers",
                                    label: <><FormOutlined /> {t("Headers")} ({headers.filter((h) => h.enabled).length})</>,
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 12 }}>
                                                <Segmented
                                                    size="small"
                                                    value={headerMode}
                                                    onChange={(v) => switchHeaderMode(v as "form" | "json")}
                                                    options={[
                                                        { label: t("Form"), value: "form" },
                                                        { label: "JSON", value: "json" },
                                                    ]}
                                                />
                                            </div>
                                            {headerMode === "form" ? (
                                                <>
                                                    {headers.map((h) => (
                                                        <Space key={h.id} style={{ width: "100%", marginBottom: 8 }} wrap>
                                                            <Switch aria-label={t("Enable header")} checked={h.enabled} onChange={(v) => updateItem(setHeaders, h.id, "enabled", v)} size="small" />
                                                            <Select
                                                                value={h.key || undefined}
                                                                onChange={(v) => updateItem(setHeaders, h.id, "key", v)}
                                                                style={{ width: 180 }}
                                                                showSearch allowClear placeholder={t("Header name")}
                                                            >
                                                                {COMMON_HEADERS.map((name) => (
                                                                    <Select.Option key={name} value={name}>{name}</Select.Option>
                                                                ))}
                                                            </Select>
                                                            <Input dir="ltr" value={h.value} onChange={(e) => updateItem(setHeaders, h.id, "value", e.target.value)} placeholder={t("Value")} style={{ flex: 1, minWidth: 180 }} />
                                                            <Button aria-label={t("Delete")} icon={<DeleteOutlined />} danger size="small" onClick={() => removeItem(setHeaders, h.id)} />
                                                        </Space>
                                                    ))}
                                                    <Button icon={<PlusOutlined />} size="small" onClick={() => addItem(setHeaders)}>{t("Add Header")}</Button>
                                                </>
                                            ) : (
                                                <div>
                                                    <TextArea dir="ltr"
                                                        value={headerJson}
                                                        onChange={(e) => {
                                                            setHeaderJson(e.target.value);
                                                            const parsed = jsonToHeaderPairs(e.target.value);
                                                            if (parsed !== null) setHeaders(parsed);
                                                        }}
                                                        rows={7}
                                                        style={{ fontFamily: "monospace", fontSize: 12 }}
                                                        placeholder={'{\n  "Authorization": "Bearer xxx",\n  "Accept": "application/json"\n}'}
                                                    />
                                                    <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: "block" }}>
                                                        {t("JSON object — auto-syncs to form when valid")}
                                                    </Text>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    key: "params",
                                    label: <>{t("Query")} ({queryParams.filter((p) => p.enabled).length})</>,
                                    children: (
                                        <div>
                                            {queryParams.map((p) => (
                                                <Space key={p.id} style={{ width: "100%", marginBottom: 8 }}>
                                                    <Switch aria-label={t("Enable query parameter")} checked={p.enabled} onChange={(v) => updateItem(setQueryParams, p.id, "enabled", v)} size="small" />
                                                    <Input dir="ltr" value={p.key} onChange={(e) => updateItem(setQueryParams, p.id, "key", e.target.value)} placeholder={t("Key")} style={{ width: 150 }} />
                                                    <Input dir="ltr" value={p.value} onChange={(e) => updateItem(setQueryParams, p.id, "value", e.target.value)} placeholder={t("Value")} style={{ flex: 1 }} />
                                                    <Button aria-label={t("Delete")} icon={<DeleteOutlined />} danger size="small" onClick={() => removeItem(setQueryParams, p.id)} />
                                                </Space>
                                            ))}
                                            <Button icon={<PlusOutlined />} size="small" onClick={() => addItem(setQueryParams)}>{t("Add Param")}</Button>
                                        </div>
                                    ),
                                },
                                {
                                    key: "auth",
                                    label: <><LockOutlined /> {t("Auth")}</>,
                                    children: (
                                        <div>
                                            <Select
                                                value={auth.type}
                                                onChange={(type) => setAuth({ ...auth, type })}
                                                aria-label={t("Authentication type")}
                                                style={{ minWidth: 200, maxWidth: "100%", marginBottom: 16 }}
                                            >
                                                <Select.Option value="none">{t("No Auth")}</Select.Option>
                                                <Select.Option value="basic"><KeyOutlined /> {t("Basic Auth")}</Select.Option>
                                                <Select.Option value="bearer"><SafetyCertificateOutlined /> {t("Bearer Token")}</Select.Option>
                                                <Select.Option value="api-key"><KeyOutlined /> {t("API Key")}</Select.Option>
                                                <Select.Option value="oauth2"><LockOutlined /> OAuth 2.0</Select.Option>
                                            </Select>
                                            {auth.type === "basic" && (
                                                <Space orientation="vertical" style={{ width: "100%" }}>
                                                    <Input dir="ltr" prefix={<Text type="secondary">{t("Username:")}</Text>} value={auth.basic?.username} onChange={(e) => setAuth({ ...auth, basic: { ...auth.basic!, username: e.target.value } })} />
                                                    <Input.Password dir="ltr" prefix={<Text type="secondary">{t("Password:")}</Text>} value={auth.basic?.password} onChange={(e) => setAuth({ ...auth, basic: { ...auth.basic!, password: e.target.value } })} />
                                                </Space>
                                            )}
                                            {auth.type === "bearer" && (
                                                <Space orientation="vertical" style={{ width: "100%" }}>
                                                    <Input dir="ltr" prefix={<Text type="secondary">{t("Prefix:")}</Text>} value={auth.bearer?.prefix} onChange={(e) => setAuth({ ...auth, bearer: { ...auth.bearer!, prefix: e.target.value } })} style={{ width: 200 }} />
                                                    <TextArea dir="ltr" placeholder={t("Token (supports {{var}})")} value={auth.bearer?.token} onChange={(e) => setAuth({ ...auth, bearer: { ...auth.bearer!, token: e.target.value } })} rows={3} />
                                                </Space>
                                            )}
                                            {auth.type === "api-key" && (
                                                <Space orientation="vertical" style={{ width: "100%" }}>
                                                    <Space>
                                                        <Input dir="ltr" prefix={<Text type="secondary">{t("Key:")}</Text>} value={auth.apiKey?.key} onChange={(e) => setAuth({ ...auth, apiKey: { ...auth.apiKey!, key: e.target.value } })} style={{ width: 200 }} />
                                                        <Select value={auth.apiKey?.addTo} onChange={(v) => setAuth({ ...auth, apiKey: { ...auth.apiKey!, addTo: v } })} style={{ width: 120 }}>
                                                            <Select.Option value="header">{t("Header")}</Select.Option>
                                                            <Select.Option value="query">{t("Query Param")}</Select.Option>
                                                        </Select>
                                                    </Space>
                                                    <Input dir="ltr" prefix={<Text type="secondary">{t("Value:")}</Text>} value={auth.apiKey?.value} onChange={(e) => setAuth({ ...auth, apiKey: { ...auth.apiKey!, value: e.target.value } })} />
                                                </Space>
                                            )}
                                            {auth.type === "oauth2" && (
                                                <Space orientation="vertical" style={{ width: "100%" }}>
                                                    <Input dir="ltr" prefix={<Text type="secondary">{t("Token Type:")}</Text>} value={auth.oauth2?.tokenType} onChange={(e) => setAuth({ ...auth, oauth2: { ...auth.oauth2!, tokenType: e.target.value } })} style={{ width: 200 }} />
                                                    <TextArea dir="ltr" placeholder={t("Access Token (supports {{var}})")} value={auth.oauth2?.accessToken} onChange={(e) => setAuth({ ...auth, oauth2: { ...auth.oauth2!, accessToken: e.target.value } })} rows={3} />
                                                </Space>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    key: "cookies",
                                    label: <>{t("Cookies")} ({cookies.filter((c) => c.enabled).length})</>,
                                    children: (
                                        <div>
                                            {cookies.map((c) => (
                                                <Space key={c.id} style={{ width: "100%", marginBottom: 8 }}>
                                                    <Switch aria-label={t("Enable cookie")} checked={c.enabled} onChange={(v) => updateItem(setCookies, c.id, "enabled", v)} size="small" />
                                                    <Input dir="ltr" value={c.key} onChange={(e) => updateItem(setCookies, c.id, "key", e.target.value)} placeholder={t("Name")} style={{ width: 150 }} />
                                                    <Input dir="ltr" value={c.value} onChange={(e) => updateItem(setCookies, c.id, "value", e.target.value)} placeholder={t("Value")} style={{ flex: 1 }} />
                                                    <Button aria-label={t("Delete")} icon={<DeleteOutlined />} danger size="small" onClick={() => removeItem(setCookies, c.id)} />
                                                </Space>
                                            ))}
                                            <Button icon={<PlusOutlined />} size="small" onClick={() => addItem(setCookies)}>{t("Add Cookie")}</Button>
                                        </div>
                                    ),
                                },
                                {
                                    key: "settings",
                                    label: <><SettingOutlined /> {t("Settings")}</>,
                                    children: (
                                        <Space orientation="vertical" style={{ width: "100%" }}>
                                            <div>
                                                <Text>{t("Timeout (ms):")}</Text>
                                                <InputNumber dir="ltr"
                                                    aria-label={t("Timeout (ms)")}
                                                    value={settings.timeout}
                                                    onChange={(v) => setSettings({ ...settings, timeout: v || 30000 })}
                                                    min={1000} max={300000} step={1000}
                                                    style={{ marginInlineStart: 8, width: 120 }}
                                                />
                                            </div>
                                            <Checkbox
                                                checked={settings.followRedirects}
                                                onChange={(e) => setSettings({ ...settings, followRedirects: e.target.checked })}
                                            >
                                                {t("Follow Redirects (max 10 hops)")}
                                            </Checkbox>
                                            <Checkbox
                                                checked={sslConfig.sslVerify}
                                                onChange={(e) => { setSettings({ ...settings, validateSSL: e.target.checked }); setSslConfig({ ...sslConfig, sslVerify: e.target.checked }); }}
                                            >
                                                {t("Validate SSL certificate (also see SSL tab)")}
                                            </Checkbox>
                                            <div>
                                                <Text>{t("Inline response preview cap:")}</Text>
                                                <InputNumber dir="ltr"
                                                    aria-label={t("Inline response preview cap (bytes)")}
                                                    value={settings.maxResponsePreviewBytes}
                                                    onChange={(v) => setSettings({ ...settings, maxResponsePreviewBytes: v || PREVIEW_MAX_DEFAULT })}
                                                    min={4096} max={10 * 1024 * 1024} step={4096}
                                                    style={{ marginInlineStart: 8, width: 160 }}
                                                />
                                                <Text type="secondary" style={{ fontSize: 11, marginInlineStart: 8 }}>{t("bytes")}</Text>
                                            </div>
                                        </Space>
                                    ),
                                },
                                {
                                    key: "ssl",
                                    label: <><SafetyCertificateOutlined /> SSL</>,
                                    children: <SslConfigSection value={sslConfig} onChange={setSslConfig} />,
                                },
                                {
                                    key: "tests",
                                    label: (
                                        <Space>
                                            <ThunderboltOutlined /> {t("Tests")}
                                            {testSummary.total > 0 && (
                                                <Badge count={testSummary.failed} showZero={false} size="small" offset={[0, 0]}>
                                                    <Tag color={testSummary.failed > 0 ? "error" : "success"} style={{ marginInlineStart: 4 }}>
                                                        {testSummary.passed}/{testSummary.total}
                                                    </Tag>
                                                </Badge>
                                            )}
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <Alert
                                                title={t("Write tests using pm.test() and pm.expect() syntax")}
                                                type="info"
                                                showIcon
                                                style={{ marginBottom: 8 }}
                                            />
                                            <CodeEditor value={testScript} onChange={(v) => setTestScript(v || "")} language="javascript" height={150} />
                                            <Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 4 }}>
                                                {t("Example:")} <code dir="ltr">{'pm.test("Status is 200", () => pm.expect(pm.response.code).to.equal(200));'}</code>
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
                        items={[{
                            key: "code",
                            label: <><CodeOutlined /> {t("Code Snippets")}</>,
                            children: (
                                <Tabs size="small" items={[
                                    { key: "curl", label: "cURL", children: <pre dir="ltr" style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCurl()}</pre> },
                                    { key: "javascript-fetch", label: "JS Fetch", children: <pre dir="ltr" style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("javascript-fetch")}</pre> },
                                    { key: "javascript-axios", label: "JS Axios", children: <pre dir="ltr" style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("javascript-axios")}</pre> },
                                    { key: "node-http", label: "Node http", children: <pre dir="ltr" style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("node-http")}</pre> },
                                    { key: "python", label: "Python", children: <pre dir="ltr" style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("python")}</pre> },
                                    { key: "go", label: "Go", children: <pre dir="ltr" style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("go")}</pre> },
                                    ...([['php', 'PHP'], ['ruby', 'Ruby'], ['csharp', 'C#']] as const).map(([key, label]) => ({ key, label, children: <div className="wb-workbench"><div className="wb-workbench-actions"><button onClick={() => void copyToClipboard(generateCodeSnippet(key))}>{t("Copy {language}", { language: label })}</button><button onClick={() => downloadText(generateCodeSnippet(key), `request.${key === "csharp" ? "cs" : key === "ruby" ? "rb" : "php"}`)}>{t("Download {language}", { language: label })}</button></div><p>{t("Includes resolved values from this request. These samples use 15-second timeouts and do not follow redirects.")}</p><pre dir="ltr" style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{generateCodeSnippet(key)}</pre></div> })),
                                    { key: "java", label: "Java", children: <pre dir="ltr" style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>{generateCodeSnippet("java")}</pre> },
                                ]} />
                            ),
                        }]}
                    />
                </Col>

                {/* ── Right: Response & sidebar ── */}
                <Col xs={24} xl={10}>
                    <Card
                        size="small"
                        title={
                            <Space wrap>
                                <Text>{t("Response")}</Text>
                                {status !== null && status > 0 && (
                                    <Tag color={getStatusColor(status)}>{status} {getStatusText(status)}</Tag>
                                )}
                                {responseTime !== null && <Tag icon={<ClockCircleOutlined />}>{responseTime}ms</Tag>}
                                {responseSize !== null && <Tag>{formatBytes(responseSize)}</Tag>}
                                {responseTruncated && <Tag color="warning">{t("truncated")}</Tag>}
                            </Space>
                        }
                        extra={
                            response && !responseError && (
                                <Space>
                                    <Tooltip title={t("Copy")}>
                                        <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={copyResponse} />
                                    </Tooltip>
                                    <Tooltip title={t("Download")}>
                                        <Button aria-label={t("Download")} size="small" icon={<DownloadOutlined />} onClick={downloadResponse} />
                                    </Tooltip>
                                </Space>
                            )
                        }
                    >
                        {loading ? (
                            <div style={{ textAlign: "center", padding: 40 }}>
                                <Spin />
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary">{t("Sending request… (Cancel above)")}</Text>
                                </div>
                            </div>
                        ) : responseError ? (
                            <Alert type="error" title={t("Request failed")} description={<><span>{t(responseError.source, responseError.values)}</span>{responseError.detail && <pre dir="ltr" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", margin: 0 }}>{responseError.detail}</pre>}</>} showIcon />
                        ) : response ? (
                            <Tabs
                                activeKey={activeResponseTab}
                                onChange={setActiveResponseTab}
                                size="small"
                                items={[
                                    {
                                        key: "body",
                                        label: t("Body"),
                                        children: responseTooBigForInline ? (
                                            <Alert
                                                type="warning"
                                                showIcon
                                                title={t("Body is {size} — preview disabled", { size: formatBytes(response.length) })}
                                                description={
                                                    <Space>
                                                        <Text type="secondary">{t("Raise the preview cap in Settings, or download the body.")}</Text>
                                                        <Button size="small" icon={<DownloadOutlined />} onClick={downloadResponse}>{t("Download")}</Button>
                                                    </Space>
                                                }
                                            />
                                        ) : responseIsBase64 ? (
                                            <Alert
                                                type="info" showIcon
                                                title={t("Binary response")}
                                                description={
                                                    <Space>
                                                        <Text type="secondary">Content-Type: {responseHeaders["content-type"] || t("unknown")}</Text>
                                                        <Button size="small" icon={<DownloadOutlined />} onClick={downloadResponse}>{t("Download")}</Button>
                                                    </Space>
                                                }
                                            />
                                        ) : (
                                            <CodeEditor
                                                value={response}
                                                language={responseKind === "json" ? "json" : responseKind === "xml" || responseKind === "html" ? "xml" : "plaintext"}
                                                height={300}
                                                readOnly
                                            />
                                        ),
                                    },
                                    {
                                        key: "preview",
                                        label: <><EyeOutlined /> {t("Preview")}</>,
                                        children: (
                                            <div>
                                                {responseKind === "html" && !responseIsBase64 ? (
                                                    <iframe
                                                        srcDoc={response}
                                                        sandbox=""
                                                        style={{ width: "100%", height: 320, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 4, background: "#fff" }}
                                                        title={t("HTML preview")}
                                                    />
                                                ) : responseKind === "image" && responseDataUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={responseDataUrl} alt={t("response")} style={{ maxWidth: "100%", maxHeight: 320, display: "block", margin: "0 auto", background: "rgba(0,0,0,0.04)", borderRadius: 4 }} />
                                                ) : (
                                                    <Empty description={t("No special preview for {type}", { type: responseHeaders["content-type"] || t("this content type") })} />
                                                )}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "headers",
                                        label: t("Headers ({count})", { count: Object.keys(responseHeaders).length }),
                                        children: (
                                            <Table
                                                size="small"
                                                pagination={false}
                                                dataSource={Object.entries(responseHeaders).map(([key, value]) => ({ key, value }))}
                                                columns={[
                                                    { title: t("Header"), dataIndex: "key", width: 200, render: (k) => <Text code>{k}</Text> },
                                                    { title: t("Value"), dataIndex: "value", render: (v) => <Text style={{ wordBreak: "break-all" }}>{v}</Text> },
                                                ]}
                                                scroll={{ y: 250 }}
                                            />
                                        ),
                                    },
                                    {
                                        key: "cookies",
                                        label: t("Cookies ({count})", { count: responseCookies.length }),
                                        children: responseCookies.length === 0 ? (
                                            <Empty description={t("No Set-Cookie headers in response")} />
                                        ) : (
                                            <Table
                                                size="small"
                                                pagination={false}
                                                dataSource={responseCookies.map((c, i) => ({ ...c, _k: i }))}
                                                rowKey="_k"
                                                columns={[
                                                    { title: t("Name"), dataIndex: "name", width: 160 },
                                                    { title: t("Value"), dataIndex: "value", render: (v) => <Text style={{ wordBreak: "break-all", fontSize: 11 }}>{v}</Text> },
                                                    { title: t("Domain"), dataIndex: "domain", width: 140 },
                                                    { title: t("Path"), dataIndex: "path", width: 100 },
                                                    { title: t("Flags"), render: (_, r) => (
                                                        <Space size={4}>
                                                            {r.secure && <Tag color="green">Secure</Tag>}
                                                            {r.httpOnly && <Tag color="blue">HttpOnly</Tag>}
                                                            {r.sameSite && <Tag>SameSite={r.sameSite}</Tag>}
                                                        </Space>
                                                    ) },
                                                ]}
                                            />
                                        ),
                                    },
                                    {
                                        key: "tests",
                                        label: (
                                            <Space>
                                                {t("Tests")}
                                                {testSummary.total > 0 && (
                                                    <Tag color={testSummary.failed > 0 ? "error" : "success"}>{testSummary.passed}/{testSummary.total}</Tag>
                                                )}
                                            </Space>
                                        ),
                                        children: (
                                            <div>
                                                {testResults.length === 0 ? (
                                                    <Text type="secondary">{t("No tests to run")}</Text>
                                                ) : testResults.map((result, i) => (
                                                    <div key={i} style={{ marginBottom: 8 }}>
                                                        <Tag color={result.passed ? "success" : "error"}>{t(result.passed ? "PASS" : "FAIL")}</Tag>
                                                        <Text>{result.name}</Text>
                                                        {result.message && <Text type="danger" style={{ display: "block", marginInlineStart: 50 }}>{result.message}</Text>}
                                                    </div>
                                                ))}
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        ) : (
                            <div style={{ textAlign: "center", padding: 40, color: "#8c8c8c" }}>
                                <CloudOutlined style={{ fontSize: 48, opacity: 0.3 }} />
                                <div style={{ marginTop: 8 }}>{t("Send a request to see the response")}</div>
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
                                label: <><FolderOpenOutlined /> {t("Saved Requests")} ({savedRequests.length})</>,
                                children: savedRequests.length === 0 ? (
                                    <Text type="secondary">{t("No saved requests")}</Text>
                                ) : (
                                    <div style={{ maxHeight: 220, overflow: "auto" }}>
                                        {savedRequests.map((req) => (
                                            <div key={req.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                <Tag color={HTTP_METHODS.find((m) => m.value === req.method)?.color}>{req.method}</Tag>
                                                <Text dir="auto" style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.name}</Text>
                                                <Button size="small" type="text" onClick={() => loadRequest(req)}>{t("Load")}</Button>
                                                <Button aria-label={t("Delete")} size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => deleteRequest(req.id)} />
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                            {
                                key: "history",
                                label: <><HistoryOutlined /> {t("History")} ({history.length})</>,
                                children: history.length === 0 ? (
                                    <Text type="secondary">{t("No request history")}</Text>
                                ) : (
                                    <div style={{ maxHeight: 220, overflow: "auto" }}>
                                        {history.slice(0, 30).map((item) => (
                                            <div
                                                key={item.id}
                                                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, cursor: "pointer" }}
                                                onClick={() => loadFromHistory(item)}
                                            >
                                                <Tag color={HTTP_METHODS.find((m) => m.value === item.method)?.color} style={{ fontSize: 10 }}>{item.method}</Tag>
                                                <Tag color={getStatusColor(item.status)} style={{ fontSize: 10 }}>{item.status}</Tag>
                                                <Text dir="ltr" style={{ flex: 1, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</Text>
                                                <Text type="secondary" style={{ fontSize: 10 }}>{item.time}ms</Text>
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                            {
                                key: "environments",
                                label: <><KeyOutlined /> {t("Environments")} ({environments.length})</>,
                                children: (
                                    <div>
                                        <Button size="small" icon={<PlusOutlined />} onClick={openNewEnv} style={{ marginBottom: 8 }}>{t("New Environment")}</Button>
                                        {environments.length === 0 ? (
                                            <div><Text type="secondary">{t("No environments yet")}</Text></div>
                                        ) : environments.map((env) => (
                                            <div key={env.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                                <Tag color={env.id === activeEnvId ? "blue" : "default"}>
                                                    {env.id === activeEnvId ? t("active") : env.variables.filter((v) => v.enabled).length}
                                                </Tag>
                                                <Text dir="auto" style={{ flex: 1 }}>{env.name}</Text>
                                                <Button size="small" type="text" onClick={() => openEditEnv(env)}>{t("Edit")}</Button>
                                                {env.id !== activeEnvId && (
                                                    <Button size="small" type="text" onClick={() => selectEnv(env.id)}>{t("Use")}</Button>
                                                )}
                                                <Button aria-label={t("Delete")} size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => deleteEnv(env.id)} />
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </Col>
            </Row>

            <ApiClientExtensions requests={savedRequests} variables={varMap} environmentName={activeEnv?.name ?? t("No environment")} />

            {/* Save Request Modal */}
            <Modal
                title={t("Save Request")}
                open={saveModalOpen}
                onOk={handleSaveRequest}
                onCancel={() => setSaveModalOpen(false)}
                okText={t("Save")}
                cancelText={t("Cancel")}
            >
                <Input dir="auto"
                    placeholder={t("Request name")}
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    onPressEnter={handleSaveRequest}
                />
            </Modal>

            {/* cURL Import Modal */}
            <Modal
                title={t("Import from cURL")}
                open={curlModalOpen}
                onOk={handleCurlImport}
                onCancel={() => setCurlModalOpen(false)}
                okText={t("Import")}
                cancelText={t("Cancel")}
                width={720}
            >
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {t("Paste a curl command. Multi-line continuations (backslash, ^) and Chrome / Firefox / Postman \"Copy as cURL\" output are supported.")}
                </Text>
                <TextArea dir="ltr"
                    value={curlText}
                    onChange={(e) => setCurlText(e.target.value)}
                    rows={10}
                    placeholder={"curl -X POST 'https://api.example.com/v1/things' \\\n  -H 'Authorization: Bearer xxx' \\\n  -d '{\"name\":\"test\"}'"}
                    style={{ fontFamily: "monospace", fontSize: 12, marginTop: 8 }}
                />
            </Modal>

            {/* Postman Import Modal */}
            <Modal
                title={t("Import Postman Collection (v2.1)")}
                open={importModalOpen}
                onOk={handlePostmanImport}
                onCancel={() => setImportModalOpen(false)}
                okText={t("Import")}
                cancelText={t("Cancel")}
                width={720}
            >
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {t("Paste the full JSON export. Nested folders are flattened with their path prepended (e.g. Auth / Login).") }
                </Text>
                <TextArea dir="ltr"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={12}
                    placeholder='{"info":{"name":"My Collection","schema":"…"},"item":[…]}'
                    style={{ fontFamily: "monospace", fontSize: 12, marginTop: 8 }}
                />
            </Modal>

            {/* Environment Editor Modal */}
            <Modal
                title={editingEnv?.id && environments.find((e) => e.id === editingEnv.id) ? t("Edit Environment") : t("New Environment")}
                open={envModalOpen}
                onOk={saveEnv}
                onCancel={() => { setEnvModalOpen(false); setEditingEnv(null); }}
                okText={t("Save")}
                cancelText={t("Cancel")}
                width={640}
                destroyOnHidden
            >
                {editingEnv && (
                    <Form layout="vertical">
                        <Form.Item label={t("Name")}>
                            <Input dir="auto"
                                value={editingEnv.name}
                                onChange={(e) => setEditingEnv({ ...editingEnv, name: e.target.value })}
                                placeholder={t("e.g. Local, Staging, Production")}
                            />
                        </Form.Item>
                        <Form.Item label={t("Variables")}>
                            <div style={{ maxHeight: 320, overflowY: "auto" }}>
                                {editingEnv.variables.map((v, idx) => (
                                    <Space key={idx} style={{ width: "100%", marginBottom: 6 }}>
                                        <Switch aria-label={t("Enable variable")}
                                            checked={v.enabled} size="small"
                                            onChange={(checked) => setEditingEnv({
                                                ...editingEnv,
                                                variables: editingEnv.variables.map((x, i) => i === idx ? { ...x, enabled: checked } : x),
                                            })}
                                        />
                                        <Input dir="ltr"
                                            value={v.key} placeholder={t("key")} style={{ width: 180 }}
                                            onChange={(e) => setEditingEnv({
                                                ...editingEnv,
                                                variables: editingEnv.variables.map((x, i) => i === idx ? { ...x, key: e.target.value } : x),
                                            })}
                                        />
                                        <Input dir="ltr"
                                            value={v.value} placeholder={t("value")} style={{ flex: 1, minWidth: 220 }}
                                            onChange={(e) => setEditingEnv({
                                                ...editingEnv,
                                                variables: editingEnv.variables.map((x, i) => i === idx ? { ...x, value: e.target.value } : x),
                                            })}
                                        />
                                        <Button aria-label={t("Delete")}
                                            icon={<DeleteOutlined />} danger size="small"
                                            onClick={() => setEditingEnv({
                                                ...editingEnv,
                                                variables: editingEnv.variables.filter((_, i) => i !== idx),
                                            })}
                                        />
                                    </Space>
                                ))}
                            </div>
                            <Button
                                icon={<PlusOutlined />} size="small" style={{ marginTop: 8 }}
                                onClick={() => setEditingEnv({
                                    ...editingEnv,
                                    variables: [...editingEnv.variables, { key: "", value: "", enabled: true }],
                                })}
                            >
                                {t("Add Variable")}
                            </Button>
                        </Form.Item>
                        <Alert
                            type="info" showIcon
                            title={t("Built-ins always available")}
                            description={
                                <Text style={{ fontSize: 11, fontFamily: "monospace" }}>
                                    {"{{$timestamp}} · {{$isoTimestamp}} · {{$randomUUID}} · {{$randomInt}}"}
                                </Text>
                            }
                        />
                    </Form>
                )}
            </Modal>
            </>
            )}
        </ToolPageLayout>
    );
}

"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
    Card, Input, Button, Typography, Row, Col, Space, Tabs, Tag,
    Alert, Empty, Divider, Badge, Descriptions, List, Spin, Tooltip,
    Select, Collapse, Segmented, InputNumber, Switch, Form, Radio,
} from "antd";
import {
    RobotOutlined, SendOutlined, CopyOutlined, DeleteOutlined,
    CheckCircleOutlined, CloseCircleOutlined, WarningOutlined,
    LinkOutlined, BugOutlined, InfoCircleOutlined, ReloadOutlined,
    UserOutlined, ApiOutlined, KeyOutlined, SafetyCertificateOutlined,
    ThunderboltOutlined, PlayCircleOutlined, StopOutlined, FileTextOutlined,
    PlusOutlined, LockOutlined, ExperimentOutlined,
} from "@ant-design/icons";
import { messageService as message } from "@/lib/messageService";
import { useAppStore } from "@/lib/store";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import SslConfigSection, { DEFAULT_SSL_CONFIG, buildSslProxyFields, type SslConfig } from "@/components/SslConfigSection";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// ─── A2A spec types ───────────────────────────────────────────────────

interface AgentSkill {
    id: string;
    name: string;
    description?: string;
    tags?: string[];
    examples?: string[];
    inputModes?: string[];
    outputModes?: string[];
}

interface SecurityScheme {
    type: string;             // "http" | "apiKey" | "oauth2" | "openIdConnect"
    scheme?: string;          // "bearer" | "basic" (when type=http)
    bearerFormat?: string;
    in?: string;              // "header" | "query" | "cookie" (when type=apiKey)
    name?: string;            // API key field name
    flows?: Record<string, unknown>;
    openIdConnectUrl?: string;
    description?: string;
}

interface AgentCard {
    name: string;
    description?: string;
    url: string;
    version?: string;
    documentationUrl?: string;
    capabilities?: { streaming?: boolean; pushNotifications?: boolean; stateTransitionHistory?: boolean };
    skills?: AgentSkill[];
    defaultInputModes?: string[];
    defaultOutputModes?: string[];
    provider?: { organization: string; url?: string };
    securitySchemes?: Record<string, SecurityScheme>;
    security?: Array<Record<string, string[]>>;
    supportsAuthenticatedExtendedCard?: boolean;
    [key: string]: unknown;
}

interface ComplianceCheck {
    field: string;
    status: "ok" | "warn" | "error";
    note: string;
}

interface ChatMessage {
    id: string;
    role: "user" | "agent" | "system";
    content: string;
    ts: number;
    taskId?: string;
    contextId?: string;
    raw?: unknown;
    error?: boolean;
    streaming?: boolean;
}

interface DebugEntry {
    id: string;
    ts: number;
    direction: "out" | "in";
    method: string;
    payload: unknown;
    error?: boolean;
}

interface CustomHeader {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

type AuthType = "none" | "bearer" | "basic" | "apiKey" | "oauth2";

interface AuthConfig {
    type: AuthType;
    bearer: { token: string };
    basic: { username: string; password: string };
    apiKey: { name: string; value: string; in: "header" | "query" };
    oauth2: { accessToken: string; tokenType: string };
}

type ProtocolVersion = "current" | "legacy";
type ConnectionMode = "direct" | "direct-strict" | "via-server-proxy";

interface DiagnosticStep {
    name: string;
    ok: boolean;
    detail: string;
    duration?: number;
}

interface DiagnosticReport {
    targetUrl: string;
    crossOrigin: boolean;
    steps: DiagnosticStep[];
    recommendation: string;
}

// ─── Constants ────────────────────────────────────────────────────────

const STORAGE_KEY = "a2a-inspector-config";

const DEFAULT_AUTH: AuthConfig = {
    type: "none",
    bearer: { token: "" },
    basic: { username: "", password: "" },
    apiKey: { name: "X-API-Key", value: "", in: "header" },
    oauth2: { accessToken: "", tokenType: "Bearer" },
};

const PROTOCOL_INFO: Record<ProtocolVersion, {
    label: string;
    description: string;
    cardPath: string;
    sendMethod: string;
    streamMethod: string;
    partKey: "kind" | "type";    // current uses "kind", legacy uses "type"
}> = {
    current: {
        label: "Current spec (message/*)",
        description: "Uses message/send + message/stream. Card at /.well-known/agent-card.json. Parts use 'kind'.",
        cardPath: "/.well-known/agent-card.json",
        sendMethod: "message/send",
        streamMethod: "message/stream",
        partKey: "kind",
    },
    legacy: {
        label: "Legacy draft (tasks/*)",
        description: "Uses tasks/send + tasks/sendSubscribe. Card at /.well-known/agent.json. Parts use 'type'.",
        cardPath: "/.well-known/agent.json",
        sendMethod: "tasks/send",
        streamMethod: "tasks/sendSubscribe",
        partKey: "type",
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────

let msgIdCounter = 0;
let dbgIdCounter = 0;
let rpcIdCounter = 0;
let hdrIdCounter = 0;

const makeMsgId = () => String(++msgIdCounter);
const makeDbgId = () => String(++dbgIdCounter);
const makeRpcId = () => ++rpcIdCounter;
const makeHdrId = () => String(++hdrIdCounter);

function genUuid(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function buildAuthHeader(auth: AuthConfig): Record<string, string> {
    switch (auth.type) {
        case "bearer":
            return auth.bearer.token ? { Authorization: `Bearer ${auth.bearer.token}` } : {};
        case "basic":
            if (!auth.basic.username && !auth.basic.password) return {};
            return { Authorization: `Basic ${btoa(`${auth.basic.username}:${auth.basic.password}`)}` };
        case "apiKey":
            return auth.apiKey.in === "header" && auth.apiKey.value
                ? { [auth.apiKey.name]: auth.apiKey.value } : {};
        case "oauth2":
            return auth.oauth2.accessToken
                ? { Authorization: `${auth.oauth2.tokenType} ${auth.oauth2.accessToken}` } : {};
        default:
            return {};
    }
}

function applyAuthToUrl(url: string, auth: AuthConfig): string {
    if (auth.type === "apiKey" && auth.apiKey.in === "query" && auth.apiKey.value) {
        const sep = url.includes("?") ? "&" : "?";
        return `${url}${sep}${encodeURIComponent(auth.apiKey.name)}=${encodeURIComponent(auth.apiKey.value)}`;
    }
    return url;
}

function customHeadersToObject(hdrs: CustomHeader[]): Record<string, string> {
    const out: Record<string, string> = {};
    hdrs.filter(h => h.enabled && h.key.trim()).forEach(h => { out[h.key.trim()] = h.value; });
    return out;
}

function headersToJson(hdrs: CustomHeader[]): string {
    const obj = customHeadersToObject(hdrs);
    return Object.keys(obj).length === 0 ? "{}" : JSON.stringify(obj, null, 2);
}

function jsonToHeaders(json: string): CustomHeader[] | null {
    try {
        const obj = JSON.parse(json);
        if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return null;
        return Object.entries(obj).map(([k, v]) => ({
            id: makeHdrId(), key: k, value: String(v), enabled: true,
        }));
    } catch { return null; }
}

function checkCompliance(card: AgentCard, version: ProtocolVersion): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [];

    checks.push(card.name?.trim()
        ? { field: "name", status: "ok", note: "Present" }
        : { field: "name", status: "error", note: "Required field missing" });

    checks.push(card.url?.startsWith("http")
        ? { field: "url", status: "ok", note: card.url }
        : { field: "url", status: "error", note: "Must be a valid HTTP/HTTPS URL" });

    checks.push(card.version
        ? { field: "version", status: "ok", note: card.version }
        : { field: "version", status: "warn", note: "Recommended — not present" });

    checks.push(card.description
        ? { field: "description", status: "ok", note: "Present" }
        : { field: "description", status: "warn", note: "Recommended — not present" });

    const skills = card.skills || [];
    checks.push(skills.length > 0
        ? { field: "skills", status: "ok", note: `${skills.length} skill(s) declared` }
        : { field: "skills", status: "warn", note: "No skills declared" });

    for (const skill of skills) {
        if (!skill.id) checks.push({ field: `skills[].id`, status: "error", note: `Skill missing required 'id'` });
        if (!skill.name) checks.push({ field: `skills[].name`, status: "error", note: `Skill missing required 'name'` });
    }

    checks.push(card.capabilities
        ? { field: "capabilities", status: "ok", note: JSON.stringify(card.capabilities) }
        : { field: "capabilities", status: "warn", note: "Not declared" });

    checks.push(card.defaultInputModes?.length
        ? { field: "defaultInputModes", status: "ok", note: card.defaultInputModes.join(", ") }
        : { field: "defaultInputModes", status: "warn", note: "Not declared" });

    checks.push(card.defaultOutputModes?.length
        ? { field: "defaultOutputModes", status: "ok", note: card.defaultOutputModes.join(", ") }
        : { field: "defaultOutputModes", status: "warn", note: "Not declared" });

    if (version === "current") {
        checks.push(card.securitySchemes
            ? { field: "securitySchemes", status: "ok", note: `${Object.keys(card.securitySchemes).length} declared` }
            : { field: "securitySchemes", status: "warn", note: "No auth schemes declared — agent may be open" });
    }

    return checks;
}

// ─── Component ───────────────────────────────────────────────────────

export default function A2aInspectorPage() {
    const { darkMode } = useAppStore();

    // Connection
    const [agentUrl, setAgentUrl] = useState("http://localhost:10000");
    const [protocolVersion, setProtocolVersion] = useState<ProtocolVersion>("current");
    const [auth, setAuth] = useState<AuthConfig>(DEFAULT_AUTH);
    const [customHeaders, setCustomHeaders] = useState<CustomHeader[]>([]);
    const [headerMode, setHeaderMode] = useState<"form" | "json">("form");
    const [headerJson, setHeaderJson] = useState("{}");
    const [sslConfig, setSslConfig] = useState<SslConfig>(DEFAULT_SSL_CONFIG);
    const [connectionMode, setConnectionMode] = useState<ConnectionMode>("direct");
    const [requestTimeoutMs, setRequestTimeoutMs] = useState(30000);
    const [corsFallbackUsed, setCorsFallbackUsed] = useState(false);
    const [diagnosing, setDiagnosing] = useState(false);
    const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticReport | null>(null);

    // Agent card
    const [agentCard, setAgentCard] = useState<AgentCard | null>(null);
    const [cardJson, setCardJson] = useState("");
    const [loadingCard, setLoadingCard] = useState(false);
    const [cardError, setCardError] = useState("");
    const [compliance, setCompliance] = useState<ComplianceCheck[]>([]);

    // Chat
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatContextId, setChatContextId] = useState<string | null>(null);
    const [inputText, setInputText] = useState("");
    const [sending, setSending] = useState(false);

    // Streaming
    const [streamingMessages, setStreamingMessages] = useState<ChatMessage[]>([]);
    const [streamInput, setStreamInput] = useState("");
    const [streaming, setStreaming] = useState(false);
    const streamAbortRef = useRef<AbortController | null>(null);

    // Skill testing
    const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
    const [skillInput, setSkillInput] = useState("");
    const [skillResult, setSkillResult] = useState<string>("");
    const [callingSkill, setCallingSkill] = useState(false);

    // Tasks
    const [taskIdInput, setTaskIdInput] = useState("");
    const [taskResult, setTaskResult] = useState<string>("");
    const [taskBusy, setTaskBusy] = useState(false);

    // Debug
    const [debugLog, setDebugLog] = useState<DebugEntry[]>([]);

    // UI
    const [activeTab, setActiveTab] = useState("card");
    const [connectionPanelKeys, setConnectionPanelKeys] = useState<string[]>(["connection"]);
    const chatBottomRef = useRef<HTMLDivElement>(null);
    const streamBottomRef = useRef<HTMLDivElement>(null);

    // Persistence — load on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const saved = JSON.parse(raw);
                if (saved.agentUrl) setAgentUrl(saved.agentUrl);
                if (saved.protocolVersion) setProtocolVersion(saved.protocolVersion);
                if (saved.auth) setAuth({ ...DEFAULT_AUTH, ...saved.auth });
                if (Array.isArray(saved.customHeaders)) {
                    setCustomHeaders(saved.customHeaders.map((h: Record<string, unknown>) => ({
                        ...(h as object), id: makeHdrId(),
                    } as CustomHeader)));
                }
                if (saved.sslConfig) setSslConfig({ ...DEFAULT_SSL_CONFIG, ...saved.sslConfig });
                // Migrate legacy forceProxy boolean to connectionMode
                if (typeof saved.connectionMode === "string") {
                    setConnectionMode(saved.connectionMode as ConnectionMode);
                } else if (saved.forceProxy === true) {
                    setConnectionMode("via-server-proxy");
                }
                if (typeof saved.requestTimeoutMs === "number") setRequestTimeoutMs(saved.requestTimeoutMs);
            }
        } catch { /* ignore */ }
    }, []);

    // Persistence — save on change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                agentUrl, protocolVersion, auth, customHeaders, sslConfig, connectionMode, requestTimeoutMs,
            }));
        } catch { /* ignore */ }
    }, [agentUrl, protocolVersion, auth, customHeaders, sslConfig, connectionMode, requestTimeoutMs]);

    useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);
    useEffect(() => { streamBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [streamingMessages]);

    const pushDebug = useCallback((entry: Omit<DebugEntry, "id" | "ts">) => {
        setDebugLog(prev => [{ ...entry, id: makeDbgId(), ts: Date.now() }, ...prev].slice(0, 200));
    }, []);

    const protocolInfo = PROTOCOL_INFO[protocolVersion];
    const baseUrl = agentUrl.replace(/\/$/, "");

    // ── Header sync between form and JSON modes ───────────────────────

    const switchHeaderMode = (mode: "form" | "json") => {
        if (mode === "json") setHeaderJson(headersToJson(customHeaders));
        else {
            const parsed = jsonToHeaders(headerJson);
            if (parsed !== null) setCustomHeaders(parsed);
        }
        setHeaderMode(mode);
    };

    // ── HTTP helpers ──────────────────────────────────────────────────

    function buildRequestHeaders(extra: Record<string, string> = {}): Record<string, string> {
        return {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
            ...customHeadersToObject(customHeaders),
            ...buildAuthHeader(auth),
            ...extra,
        };
    }

    function looksLikeNetworkError(err: unknown): boolean {
        const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
        return msg.includes("failed to fetch") || msg.includes("cors") ||
            msg.includes("networkerror") || msg.includes("network request failed") ||
            msg.includes("ssl") || msg.includes("certificate") || msg.includes("self signed");
    }

    function shouldUseProxy(): boolean {
        if (connectionMode === "via-server-proxy") return true;
        if (sslConfig.sslVerify) return true;
        if (sslConfig.sslCaCert.trim() || sslConfig.sslClientCert.trim() || sslConfig.sslClientKey.trim()) return true;
        return false;
    }

    // True only in "direct" (auto) mode — strict and proxy modes never auto-fall-back.
    function corsFallbackAllowed(): boolean {
        return connectionMode === "direct";
    }

    function buildCorsErrorMessage(originalError: unknown): string {
        const msg = originalError instanceof Error ? originalError.message : String(originalError);
        return (
            `${msg}\n\n` +
            `Likely a browser CORS block. Options:\n` +
            `  1. Enable CORS on the agent (Access-Control-Allow-Origin: * + headers/methods)\n` +
            `  2. Switch Connection Type to "Via Server Proxy" — uses /api/proxy server-side and bypasses browser CORS\n` +
            `  3. Switch Connection Type to "Direct (auto-fallback)" if you want this app to retry through /api/proxy automatically`
        );
    }

    async function httpGet(url: string): Promise<{ data: unknown; usedProxy: boolean; status: number; corsFallback?: boolean }> {
        const finalUrl = applyAuthToUrl(url, auth);
        const headers = buildRequestHeaders();

        if (shouldUseProxy()) {
            return await getViaProxy(finalUrl, headers);
        }
        try {
            const res = await fetch(finalUrl, { headers });
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            return { data: await res.json(), usedProxy: false, status: res.status };
        } catch (err) {
            if (looksLikeNetworkError(err)) {
                if (corsFallbackAllowed()) {
                    const result = await getViaProxy(finalUrl, headers);
                    setCorsFallbackUsed(true);
                    return { ...result, corsFallback: true };
                }
                throw new Error(buildCorsErrorMessage(err));
            }
            throw err;
        }
    }

    async function getViaProxy(url: string, headers: Record<string, string>) {
        const res = await fetch("/api/proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                url, method: "GET", headers, body: null, bodyIsBase64: false,
                timeout: requestTimeoutMs, followRedirects: true,
                ...buildSslProxyFields(sslConfig),
            }),
        });
        const proxy = await res.json();
        if (proxy.error) throw new Error(proxy.error);
        if (proxy.status < 200 || proxy.status >= 300) {
            throw new Error(`HTTP ${proxy.status}: ${proxy.statusText || (proxy.body as string)?.slice?.(0, 120)}`);
        }
        try { return { data: JSON.parse(proxy.body), usedProxy: true, status: proxy.status }; }
        catch { throw new Error(`Non-JSON response: ${(proxy.body as string)?.slice?.(0, 200)}`); }
    }

    async function rpcCall(method: string, params: unknown): Promise<unknown> {
        const id = makeRpcId();
        const body = { jsonrpc: "2.0", id, method, params };
        pushDebug({ direction: "out", method, payload: body });

        const url = applyAuthToUrl(baseUrl + "/", auth);
        const headers = buildRequestHeaders();
        const useProxy = shouldUseProxy();

        try {
            let resJson: { jsonrpc?: string; id?: number; result?: unknown; error?: { message?: string; code?: number } };

            if (useProxy) {
                const proxyRes = await fetch("/api/proxy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        url, method: "POST", headers,
                        body: JSON.stringify(body), bodyIsBase64: false,
                        timeout: requestTimeoutMs, followRedirects: true,
                        ...buildSslProxyFields(sslConfig),
                    }),
                });
                const proxy = await proxyRes.json();
                if (proxy.error) throw new Error(proxy.error);
                if (proxy.status < 200 || proxy.status >= 300) {
                    throw new Error(`HTTP ${proxy.status}: ${proxy.statusText || (proxy.body as string)?.slice?.(0, 120)}`);
                }
                try { resJson = JSON.parse(proxy.body); }
                catch { throw new Error(`Non-JSON response: ${(proxy.body as string)?.slice?.(0, 200)}`); }
            } else {
                try {
                    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
                    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                    resJson = await res.json();
                } catch (err) {
                    if (!looksLikeNetworkError(err)) throw err;
                    // CORS/cert fallback — only when the user has chosen "direct" auto mode.
                    if (!corsFallbackAllowed()) {
                        throw new Error(buildCorsErrorMessage(err));
                    }
                    const proxyRes = await fetch("/api/proxy", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            url, method: "POST", headers,
                            body: JSON.stringify(body), bodyIsBase64: false,
                            timeout: requestTimeoutMs, followRedirects: true,
                            ...buildSslProxyFields(sslConfig),
                        }),
                    });
                    const proxy = await proxyRes.json();
                    if (proxy.error) throw new Error(proxy.error);
                    if (proxy.status < 200 || proxy.status >= 300) {
                        throw new Error(`HTTP ${proxy.status}: ${proxy.statusText || (proxy.body as string)?.slice?.(0, 120)}`);
                    }
                    resJson = JSON.parse(proxy.body);
                    setCorsFallbackUsed(true);
                }
            }

            pushDebug({ direction: "in", method, payload: resJson, error: !!resJson.error });
            if (resJson.error) throw new Error(resJson.error.message || JSON.stringify(resJson.error));
            return resJson.result;
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            pushDebug({ direction: "in", method, payload: { error: msg }, error: true });
            throw err;
        }
    }

    // ── Streaming via fetch + ReadableStream (EventSource can't send headers) ──

    async function rpcStream(
        method: string,
        params: unknown,
        onEvent: (data: unknown) => void,
        signal: AbortSignal,
    ): Promise<void> {
        const id = makeRpcId();
        const body = { jsonrpc: "2.0", id, method, params };
        pushDebug({ direction: "out", method, payload: body });

        const url = applyAuthToUrl(baseUrl + "/", auth);
        const headers = { ...buildRequestHeaders(), "Accept": "text/event-stream" };

        // Streaming through the proxy isn't supported (proxy buffers the full body).
        // For SSE we always go direct browser-to-agent; the agent must allow CORS.
        if (shouldUseProxy()) {
            throw new Error(
                "Streaming requires a direct browser connection. Switch Connection Type to 'Direct (auto-fallback)' or 'Direct (strict)' and remove SSL options to stream."
            );
        }

        let res: Response;
        try {
            res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal });
        } catch (err) {
            if (looksLikeNetworkError(err)) throw new Error(buildCorsErrorMessage(err));
            throw err;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                // SSE framing: events separated by blank line; data: prefix on each line
                let idx;
                while ((idx = buffer.indexOf("\n\n")) !== -1) {
                    const block = buffer.slice(0, idx);
                    buffer = buffer.slice(idx + 2);
                    const dataLines = block.split("\n").filter(l => l.startsWith("data:")).map(l => l.slice(5).trim());
                    if (dataLines.length === 0) continue;
                    const dataStr = dataLines.join("\n");
                    if (dataStr === "[DONE]") return;
                    try {
                        const parsed = JSON.parse(dataStr);
                        pushDebug({ direction: "in", method: `${method} (event)`, payload: parsed, error: !!parsed.error });
                        if (parsed.error) throw new Error(parsed.error.message || JSON.stringify(parsed.error));
                        onEvent(parsed.result ?? parsed);
                    } catch (e) {
                        if (e instanceof SyntaxError) continue;
                        throw e;
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    // ── Fetch agent card ──────────────────────────────────────────────

    // ── Diagnose connection ──────────────────────────────────────────
    const handleDiagnose = async () => {
        setDiagnosing(true);
        setDiagnosticResult(null);
        try {
            const target = baseUrl + protocolInfo.cardPath;
            let parsed: URL;
            try { parsed = new URL(target); }
            catch {
                setDiagnosticResult({
                    targetUrl: target, crossOrigin: false,
                    steps: [{ name: "Parse URL", ok: false, detail: "Invalid agent URL" }],
                    recommendation: "Fix the agent URL.",
                });
                return;
            }
            const sameOrigin = typeof window !== "undefined" && parsed.origin === window.location.origin;
            const steps: DiagnosticStep[] = [];

            // Step 1: direct OPTIONS preflight
            const t1 = Date.now();
            try {
                const res = await fetch(target, { method: "OPTIONS" });
                steps.push({
                    name: "Direct OPTIONS (CORS preflight)",
                    ok: true,
                    detail: `HTTP ${res.status}. Access-Control-Allow-Origin=${res.headers.get("access-control-allow-origin") || "(not set)"}, Allow-Methods=${res.headers.get("access-control-allow-methods") || "(not set)"}`,
                    duration: Date.now() - t1,
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                steps.push({
                    name: "Direct OPTIONS (CORS preflight)",
                    ok: false,
                    detail: msg + (looksLikeNetworkError(err) ? " — likely CORS or network failure" : ""),
                    duration: Date.now() - t1,
                });
            }

            // Step 2: direct GET of the agent card
            const t2 = Date.now();
            try {
                const res = await fetch(target);
                steps.push({
                    name: "Direct GET agent card",
                    ok: res.ok,
                    detail: `HTTP ${res.status} ${res.statusText}`,
                    duration: Date.now() - t2,
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                steps.push({
                    name: "Direct GET agent card",
                    ok: false,
                    detail: msg + (looksLikeNetworkError(err) ? " — likely CORS block" : ""),
                    duration: Date.now() - t2,
                });
            }

            // Step 3: via /api/proxy
            const t3 = Date.now();
            try {
                const proxyRes = await fetch("/api/proxy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        url: target, method: "GET",
                        headers: buildRequestHeaders(),
                        body: null, bodyIsBase64: false,
                        timeout: 10000, followRedirects: true,
                        ...buildSslProxyFields(sslConfig),
                    }),
                });
                const data = await proxyRes.json();
                steps.push({
                    name: "Via Server Proxy",
                    ok: !data.error && data.status >= 200 && data.status < 500,
                    detail: data.error ? `Proxy error: ${data.error}` : `HTTP ${data.status} ${data.statusText || ""} (${data.size ?? 0} bytes)`,
                    duration: Date.now() - t3,
                });
            } catch (err) {
                steps.push({
                    name: "Via Server Proxy",
                    ok: false,
                    detail: err instanceof Error ? err.message : String(err),
                    duration: Date.now() - t3,
                });
            }

            const directOk = steps[1]?.ok;
            const proxyOk = steps[2]?.ok;
            let recommendation = "";
            if (directOk) {
                recommendation = "Direct connection works. Use 'Direct (strict)' for the lowest latency. Streaming will work.";
            } else if (proxyOk && !directOk) {
                recommendation = "Direct fetch is blocked (likely CORS). Use 'Via Server Proxy' for reliable access — note that streaming will not work in proxy mode. To enable direct connections, configure the agent to send Access-Control-Allow-Origin: *.";
            } else if (!proxyOk) {
                recommendation = "Neither direct nor proxy reached the agent. Check the URL, that the agent is running, and (if HTTPS) the SSL settings.";
            }

            setDiagnosticResult({ targetUrl: target, crossOrigin: !sameOrigin, steps, recommendation });
        } finally {
            setDiagnosing(false);
        }
    };

    const fetchAgentCard = async () => {
        if (!agentUrl.trim()) { message.warning("Enter an agent URL"); return; }
        setLoadingCard(true);
        setCardError("");
        setAgentCard(null);
        setCardJson("");
        setCompliance([]);
        setCorsFallbackUsed(false);

        const cardUrl = baseUrl + protocolInfo.cardPath;
        pushDebug({ direction: "out", method: `GET ${protocolInfo.cardPath}`, payload: { url: cardUrl } });

        try {
            const result = await httpGet(cardUrl) as { data: AgentCard; usedProxy: boolean; status: number; corsFallback?: boolean };
            const { data: json, usedProxy, corsFallback } = result;
            setAgentCard(json);
            setCardJson(JSON.stringify(json, null, 2));
            setCompliance(checkCompliance(json, protocolVersion));
            pushDebug({ direction: "in", method: "agent card", payload: json });
            message.success(
                corsFallback ? "Agent card loaded — direct fetch was blocked by CORS, retried via /api/proxy"
                    : usedProxy ? "Agent card loaded via server proxy"
                        : "Agent card loaded"
            );
        } catch (err) {
            // If current spec failed at /.well-known/agent-card.json, try legacy path silently
            if (protocolVersion === "current") {
                try {
                    const fallback = baseUrl + "/.well-known/agent.json";
                    pushDebug({ direction: "out", method: `GET /.well-known/agent.json (fallback)`, payload: { url: fallback } });
                    const { data: json } = await httpGet(fallback) as { data: AgentCard; usedProxy: boolean; status: number };
                    setAgentCard(json);
                    setCardJson(JSON.stringify(json, null, 2));
                    setCompliance(checkCompliance(json, protocolVersion));
                    pushDebug({ direction: "in", method: "agent card (legacy path)", payload: json });
                    message.warning("Agent card found at legacy path /.well-known/agent.json — consider switching protocol to 'Legacy draft'");
                    setLoadingCard(false);
                    return;
                } catch { /* fall through to original error */ }
            }
            const msg = err instanceof Error ? err.message : String(err);
            setCardError(msg);
            pushDebug({ direction: "in", method: "agent card", payload: { error: msg }, error: true });
            message.error("Failed to load agent card: " + msg);
        } finally {
            setLoadingCard(false);
        }
    };

    // ── Send chat ─────────────────────────────────────────────────────

    function buildA2aMessage(text: string, contextId: string | null): unknown {
        const partKey = protocolInfo.partKey;
        const part = { [partKey]: "text", text };
        const messageId = genUuid();
        if (protocolVersion === "current") {
            return {
                role: "user",
                parts: [part],
                messageId,
                ...(contextId ? { contextId } : {}),
            };
        }
        // Legacy: tasks/send takes a top-level params with id + message
        return {
            role: "user",
            parts: [part],
        };
    }

    function extractAgentText(result: unknown): { text: string; taskId?: string; contextId?: string } {
        const r = result as Record<string, unknown> | undefined;
        if (!r) return { text: "(empty response)" };

        // Result might be a Task or a Message
        // Task: { id, contextId, status: { message: { parts: [...] } }, artifacts: [{ parts: [...] }, ...] }
        // Message: { role, parts, messageId, contextId, taskId }

        const status = r.status as Record<string, unknown> | undefined;
        const parts: Array<Record<string, unknown>> = [];

        // Direct message parts
        if (Array.isArray(r.parts)) parts.push(...(r.parts as Array<Record<string, unknown>>));

        // Status message parts
        const statusMsg = status?.message as Record<string, unknown> | undefined;
        if (Array.isArray(statusMsg?.parts)) parts.push(...(statusMsg.parts as Array<Record<string, unknown>>));

        // Artifact parts
        const artifacts = r.artifacts as Array<Record<string, unknown>> | undefined;
        if (Array.isArray(artifacts)) {
            for (const a of artifacts) {
                if (Array.isArray(a.parts)) parts.push(...(a.parts as Array<Record<string, unknown>>));
            }
        }

        const text = parts
            .filter(p => (p.kind === "text" || p.type === "text") && typeof p.text === "string")
            .map(p => p.text as string)
            .join("\n");

        return {
            text: text || JSON.stringify(result, null, 2),
            taskId: typeof r.id === "string" ? r.id : (typeof r.taskId === "string" ? r.taskId : undefined),
            contextId: typeof r.contextId === "string" ? r.contextId : undefined,
        };
    }

    const sendChatMessage = async () => {
        if (!inputText.trim() || sending) return;
        const text = inputText.trim();
        setInputText("");
        setSending(true);

        const userMsg: ChatMessage = {
            id: makeMsgId(), role: "user", content: text, ts: Date.now(),
            contextId: chatContextId ?? undefined,
        };
        setChatMessages(prev => [...prev, userMsg]);

        try {
            const agentMessage = buildA2aMessage(text, chatContextId);
            const params = protocolVersion === "current"
                ? { message: agentMessage }
                : { id: genUuid(), message: agentMessage };

            const result = await rpcCall(protocolInfo.sendMethod, params);
            const { text: agentText, taskId, contextId } = extractAgentText(result);

            if (contextId) setChatContextId(contextId);

            setChatMessages(prev => [...prev, {
                id: makeMsgId(), role: "agent", content: agentText, ts: Date.now(),
                taskId, contextId, raw: result,
            }]);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setChatMessages(prev => [...prev, {
                id: makeMsgId(), role: "system", content: "Error: " + msg, ts: Date.now(), error: true,
            }]);
        } finally {
            setSending(false);
        }
    };

    // ── Streaming chat ────────────────────────────────────────────────

    const sendStreamingMessage = async () => {
        if (!streamInput.trim() || streaming) return;
        if (!agentCard?.capabilities?.streaming) {
            message.warning("Agent has not declared streaming capability — try anyway?");
        }
        const text = streamInput.trim();
        setStreamInput("");

        const userMsg: ChatMessage = {
            id: makeMsgId(), role: "user", content: text, ts: Date.now(),
        };
        setStreamingMessages(prev => [...prev, userMsg]);

        const agentMsgId = makeMsgId();
        setStreamingMessages(prev => [...prev, {
            id: agentMsgId, role: "agent", content: "", ts: Date.now(), streaming: true,
        }]);

        const controller = new AbortController();
        streamAbortRef.current = controller;
        setStreaming(true);

        try {
            const agentMessage = buildA2aMessage(text, chatContextId);
            const params = protocolVersion === "current"
                ? { message: agentMessage }
                : { id: genUuid(), message: agentMessage };

            await rpcStream(protocolInfo.streamMethod, params, (data) => {
                const { text: chunkText, taskId, contextId } = extractAgentText(data);
                if (contextId) setChatContextId(contextId);
                setStreamingMessages(prev => prev.map(m =>
                    m.id === agentMsgId
                        ? { ...m, content: m.content ? m.content + "\n" + chunkText : chunkText, taskId, contextId }
                        : m
                ));
            }, controller.signal);

            setStreamingMessages(prev => prev.map(m =>
                m.id === agentMsgId ? { ...m, streaming: false } : m
            ));
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            const isAbort = err instanceof DOMException && err.name === "AbortError";
            setStreamingMessages(prev => prev.map(m =>
                m.id === agentMsgId
                    ? { ...m, streaming: false, error: !isAbort, content: m.content || (isAbort ? "(stopped)" : "Error: " + msg) }
                    : m
            ));
        } finally {
            setStreaming(false);
            streamAbortRef.current = null;
        }
    };

    const stopStreaming = () => {
        streamAbortRef.current?.abort();
    };

    // ── Skill testing ─────────────────────────────────────────────────

    const callSkill = async () => {
        if (!selectedSkillId) return;
        const skill = agentCard?.skills?.find(s => s.id === selectedSkillId);
        if (!skill) return;
        setCallingSkill(true);
        setSkillResult("");
        try {
            // Skills are invoked via message/send with the skill name in the prompt or a structured part.
            // The A2A spec doesn't mandate a single skill-invocation shape, so we send the input as a text part
            // tagged with the skill id — agents that route by skill should match on the structured 'data' part.
            const partKey = protocolInfo.partKey;
            const dataPart = { [partKey]: "data", data: { skillId: skill.id, input: skillInput } };
            const textPart = { [partKey]: "text", text: skillInput || `(invoke skill: ${skill.name})` };

            const agentMessage = {
                role: "user",
                parts: [textPart, dataPart],
                ...(protocolVersion === "current" ? { messageId: genUuid() } : {}),
            };
            const params = protocolVersion === "current"
                ? { message: agentMessage }
                : { id: genUuid(), message: agentMessage };

            const result = await rpcCall(protocolInfo.sendMethod, params);
            setSkillResult(JSON.stringify(result, null, 2));
            message.success(`Skill '${skill.name}' invoked`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setSkillResult("Error: " + msg);
            message.error("Skill call failed: " + msg);
        } finally {
            setCallingSkill(false);
        }
    };

    // ── Tasks ─────────────────────────────────────────────────────────

    const fetchTask = async () => {
        if (!taskIdInput.trim()) return;
        setTaskBusy(true);
        try {
            const result = await rpcCall("tasks/get", { id: taskIdInput.trim() });
            setTaskResult(JSON.stringify(result, null, 2));
            message.success("Task fetched");
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setTaskResult("Error: " + msg);
            message.error("Failed to fetch task: " + msg);
        } finally { setTaskBusy(false); }
    };

    const cancelTask = async () => {
        if (!taskIdInput.trim()) return;
        setTaskBusy(true);
        try {
            const result = await rpcCall("tasks/cancel", { id: taskIdInput.trim() });
            setTaskResult(JSON.stringify(result, null, 2));
            message.success("Cancellation requested");
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setTaskResult("Error: " + msg);
            message.error("Failed to cancel task: " + msg);
        } finally { setTaskBusy(false); }
    };

    // ── Header form helpers ───────────────────────────────────────────

    const addHeader = () => setCustomHeaders(prev => [...prev, { id: makeHdrId(), key: "", value: "", enabled: true }]);
    const updateHeader = (id: string, patch: Partial<CustomHeader>) =>
        setCustomHeaders(prev => prev.map(h => h.id === id ? { ...h, ...patch } : h));
    const removeHeader = (id: string) => setCustomHeaders(prev => prev.filter(h => h.id !== id));

    const complianceSummary = {
        ok: compliance.filter(c => c.status === "ok").length,
        warn: compliance.filter(c => c.status === "warn").length,
        error: compliance.filter(c => c.status === "error").length,
    };

    // ────────────────────────────────────────────────────────────────────
    return (
        <ToolPageLayout
            title="A2A Inspector"
            description="Connect, discover, and test Agent-to-Agent (A2A) protocol agents"
            icon={<RobotOutlined style={{ fontSize: 24, color: "#0891b2" }} />}
            color="#0891b2"
            learnMore={{
                whatIs: "The Agent-to-Agent (A2A) Protocol is an open standard from Google for AI agents to communicate, delegate tasks, and collaborate across systems and vendors. Every A2A agent publishes an Agent Card — a JSON manifest at /.well-known/agent-card.json — that describes its identity, capabilities, skills, and authentication requirements. This inspector connects to any A2A-compatible agent, validates its card against the spec, and lets you exercise the full API: message/send (one-shot), message/stream (SSE), tasks/get (task lookup), and tasks/cancel.",
                whyUse: "Building or integrating A2A agents requires verifying the card structure, exercising message flows, tracking multi-turn context IDs, and debugging raw JSON-RPC exchange. This inspector covers the full A2A surface — discovery, skill testing, streaming responses, task lifecycle management — with support for all auth schemes, mTLS, custom headers, and both the current spec and the legacy draft format.",
                howToUse: [
                    "Enter the agent's base URL (the root, not the card path — the inspector appends /.well-known/agent-card.json automatically)",
                    "Choose the Protocol Version: 'Current (A2A v1)' uses message/send + message/stream and agent-card.json; 'Legacy Draft' uses tasks/send + tasks/get and agent.json — switch if you get a 404 on discovery",
                    "Set the Connection Type: 'Direct (auto-fallback)' tries a browser fetch and retries via /api/proxy on CORS failure; 'Direct (strict)' surfaces errors and is required for streaming; 'Via Server Proxy' always routes server-side (no streaming support)",
                    "Click Diagnose to test direct fetch, OPTIONS preflight, and proxy connectivity — it recommends the best Connection Type before you start",
                    "Open the Authentication panel to configure Bearer token, HTTP Basic, API Key, or OAuth 2.0 — values are applied to every request",
                    "Add Custom Headers for any non-standard headers the agent requires",
                    "Click Discover to fetch and validate the Agent Card; compliance checks highlight missing required fields",
                    "In the Skills tab, select a skill and send a test message; the agent's response is shown with the raw JSON-RPC payload in Debug",
                    "Use Chat for multi-turn conversations — context IDs are tracked automatically so the agent maintains state across turns",
                    "Use Streaming to call message/stream and watch SSE events arrive token-by-token in real time",
                    "Use Tasks to look up a task by ID or cancel an in-progress task",
                    "Open the SSL/TLS panel to configure custom CA bundles, client certificates (mTLS), and whether to verify server certificates",
                ],
                tips: [
                    "Streaming uses fetch + ReadableStream instead of EventSource so custom Authorization headers are honoured",
                    "The 'current' spec uses /.well-known/agent-card.json and parts with 'kind: text'; the legacy draft uses /.well-known/agent.json and parts with 'type: text' — the inspector falls back to agent.json automatically and warns if it succeeds",
                    "Context IDs (contextId) persist across chat turns so the agent can maintain conversation state — visible in the Debug tab",
                    "SSL/TLS configuration (CA bundle, client cert, mTLS key) routes traffic through the server-side proxy; streaming via proxy is not supported (SSE requires a persistent streaming connection)",
                    "CORS fallback (orange badge) means the browser direct fetch was blocked — add 'Access-Control-Allow-Origin: *' to the agent to eliminate the extra hop",
                    "The Debug tab shows every outbound request and inbound response in raw JSON-RPC format — useful for validating payload structure against the spec",
                    "Compliance checks on the card tab flag missing required fields (name, url, version) and warn on optional ones (skills, capabilities, securitySchemes)",
                    "Bearer tokens and API keys from the Authentication panel are sent on every request, including streaming — you don't need to add them to Custom Headers separately",
                ],
                useCases: [
                    "Validating a newly built A2A agent's card structure and spec compliance before publishing",
                    "Debugging multi-turn conversations and tracking contextId continuity across turns",
                    "Testing the full task lifecycle: submitted → working → completed (or failed/cancelled)",
                    "Exercising streaming responses and verifying SSE event framing matches the spec",
                    "Testing agents protected by Bearer tokens, Basic auth, API keys, or OAuth 2.0",
                    "Connecting to agents behind mTLS or custom certificate authorities via the SSL/TLS panel",
                    "Smoke-testing A2A agent endpoints in CI/CD after deployment",
                    "Exploring a third-party agent's available skills before integrating it into your system",
                ],
            }}
        >
            {/* URL bar + protocol */}
            <Card size="small" style={{ marginBottom: 12 }}>
                <Row gutter={[8, 8]} align="middle">
                    <Col xs={24} md={14}>
                        <Space.Compact style={{ width: "100%" }}>
                            <Input
                                value={agentUrl}
                                onChange={e => setAgentUrl(e.target.value)}
                                onPressEnter={fetchAgentCard}
                                placeholder="http://localhost:10000"
                                prefix={<LinkOutlined style={{ color: "#0891b2" }} />}
                                size="large"
                            />
                            <Button
                                size="large"
                                type="primary"
                                onClick={fetchAgentCard}
                                loading={loadingCard}
                                icon={<ReloadOutlined />}
                                style={{ background: "#0891b2", borderColor: "#0891b2" }}
                            >
                                Discover
                            </Button>
                            <Tooltip title="Test connectivity: tries direct fetch, OPTIONS preflight, and the server proxy. Recommends a Connection Type based on the results.">
                                <Button
                                    size="large"
                                    icon={<ExperimentOutlined />}
                                    onClick={handleDiagnose}
                                    loading={diagnosing}
                                >
                                    Diagnose
                                </Button>
                            </Tooltip>
                        </Space.Compact>
                    </Col>
                    <Col xs={24} md={10}>
                        <Space wrap>
                            <Text type="secondary" style={{ fontSize: 12 }}>Protocol:</Text>
                            <Select
                                size="small"
                                value={protocolVersion}
                                onChange={(v) => setProtocolVersion(v)}
                                style={{ minWidth: 200 }}
                                options={Object.entries(PROTOCOL_INFO).map(([k, v]) => ({
                                    value: k, label: v.label,
                                }))}
                            />
                            <Tooltip title={protocolInfo.description}>
                                <InfoCircleOutlined style={{ color: "#9a9a9a" }} />
                            </Tooltip>
                            <Text type="secondary" style={{ fontSize: 12 }}>Connection:</Text>
                            <Select
                                size="small"
                                value={connectionMode}
                                onChange={(v) => setConnectionMode(v)}
                                style={{ minWidth: 180 }}
                                options={[
                                    { value: "direct", label: "Direct (auto-fallback)" },
                                    { value: "direct-strict", label: "Direct (strict)" },
                                    { value: "via-server-proxy", label: "Via Server Proxy" },
                                ]}
                            />
                            <Tooltip
                                title={
                                    <div style={{ fontSize: 12 }}>
                                        <div><b>Direct (auto-fallback):</b> browser → agent. Auto-retries via /api/proxy on CORS failure.</div>
                                        <div style={{ marginTop: 4 }}><b>Direct (strict):</b> direct only — surfaces CORS errors. Required for streaming.</div>
                                        <div style={{ marginTop: 4 }}><b>Via Server Proxy:</b> always /api/proxy. Bypasses browser CORS; required for SSL/TLS options. Streaming will not work.</div>
                                    </div>
                                }
                            >
                                <InfoCircleOutlined style={{ color: "#9a9a9a" }} />
                            </Tooltip>
                            {agentCard && <Badge status="success" text="Connected" />}
                            {corsFallbackUsed && (
                                <Tooltip title="Direct fetch was blocked by CORS — auto-fell back to /api/proxy. Switch to 'Via Server Proxy' to skip the fallback hop.">
                                    <Tag color="warning">CORS fallback</Tag>
                                </Tooltip>
                            )}
                        </Space>
                    </Col>
                </Row>
                {cardError && (
                    <Alert
                        type="error"
                        message={cardError}
                        showIcon
                        closable
                        onClose={() => setCardError("")}
                        style={{ marginTop: 8, whiteSpace: "pre-wrap" }}
                        description={`Tried ${baseUrl + protocolInfo.cardPath}.`}
                    />
                )}
                {diagnosticResult && (
                    <Alert
                        type={diagnosticResult.steps.some(s => s.ok) ? "info" : "error"}
                        closable
                        onClose={() => setDiagnosticResult(null)}
                        style={{ marginTop: 8 }}
                        message={
                            <Space>
                                <Text strong>Connection Diagnostic</Text>
                                {diagnosticResult.crossOrigin
                                    ? <Tag color="orange">cross-origin</Tag>
                                    : <Tag color="green">same-origin</Tag>}
                            </Space>
                        }
                        description={
                            <Space direction="vertical" size={6} style={{ width: "100%" }}>
                                {diagnosticResult.steps.map((step, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                        {step.ok
                                            ? <CheckCircleOutlined style={{ color: "#22c55e", marginTop: 3 }} />
                                            : <CloseCircleOutlined style={{ color: "#ef4444", marginTop: 3 }} />}
                                        <div style={{ flex: 1 }}>
                                            <Text strong style={{ fontSize: 12 }}>{step.name}</Text>
                                            {step.duration !== undefined && (
                                                <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>({step.duration}ms)</Text>
                                            )}
                                            <div><Text type="secondary" style={{ fontSize: 11 }}>{step.detail}</Text></div>
                                        </div>
                                    </div>
                                ))}
                                <Divider style={{ margin: "6px 0" }} />
                                <Text style={{ fontSize: 12 }}>
                                    <Text strong>Recommendation: </Text>{diagnosticResult.recommendation}
                                </Text>
                            </Space>
                        }
                    />
                )}
            </Card>

            {/* Connection settings: collapsible */}
            <Collapse
                activeKey={connectionPanelKeys}
                onChange={(keys) => setConnectionPanelKeys(keys as string[])}
                style={{ marginBottom: 16 }}
                items={[
                    {
                        key: "connection",
                        label: (
                            <Space>
                                <SettingOutlinedIcon />
                                <Text strong>Connection Settings</Text>
                                {auth.type !== "none" && <Tag color="blue">{auth.type}</Tag>}
                                {customHeaders.filter(h => h.enabled && h.key.trim()).length > 0 && (
                                    <Tag color="purple">{customHeaders.filter(h => h.enabled && h.key.trim()).length} header(s)</Tag>
                                )}
                                {(sslConfig.sslVerify || sslConfig.sslCaCert.trim() || sslConfig.sslClientCert.trim()) && (
                                    <Tag color="orange" icon={<SafetyCertificateOutlined />}>SSL</Tag>
                                )}
                                {connectionMode !== "direct" && <Tag color="cyan">{connectionMode === "via-server-proxy" ? "Proxied" : "Strict"}</Tag>}
                            </Space>
                        ),
                        children: (
                            <Tabs
                                size="small"
                                items={[
                                    {
                                        key: "auth",
                                        label: <><KeyOutlined /> Authentication</>,
                                        children: <AuthPanel value={auth} onChange={setAuth} card={agentCard} />,
                                    },
                                    {
                                        key: "headers",
                                        label: <><FileTextOutlined /> Headers ({customHeaders.filter(h => h.enabled && h.key.trim()).length})</>,
                                        children: (
                                            <HeadersPanel
                                                headers={customHeaders}
                                                mode={headerMode}
                                                json={headerJson}
                                                onModeChange={switchHeaderMode}
                                                onAdd={addHeader}
                                                onUpdate={updateHeader}
                                                onRemove={removeHeader}
                                                onJsonChange={(v) => {
                                                    setHeaderJson(v);
                                                    const parsed = jsonToHeaders(v);
                                                    if (parsed !== null) setCustomHeaders(parsed);
                                                }}
                                            />
                                        ),
                                    },
                                    {
                                        key: "ssl",
                                        label: <><SafetyCertificateOutlined /> SSL / TLS</>,
                                        children: (
                                            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                                                <Alert
                                                    type="info"
                                                    showIcon
                                                    message="SSL options auto-route through /api/proxy"
                                                    description="When any SSL option is set, requests are sent server-side regardless of Connection Type. Streaming is incompatible with SSL options — switch back to plain Direct mode and remove SSL settings to stream."
                                                    style={{ fontSize: 12 }}
                                                />
                                                <SslConfigSection value={sslConfig} onChange={setSslConfig} compact />
                                            </Space>
                                        ),
                                    },
                                    {
                                        key: "advanced",
                                        label: <><SettingOutlinedIcon /> Advanced</>,
                                        children: (
                                            <Form layout="vertical" size="small">
                                                <Form.Item label={`Request timeout: ${(requestTimeoutMs / 1000).toFixed(0)}s`}>
                                                    <InputNumber
                                                        value={requestTimeoutMs}
                                                        onChange={v => setRequestTimeoutMs(v || 30000)}
                                                        min={1000} max={300000} step={1000}
                                                        style={{ width: 200 }}
                                                    />
                                                </Form.Item>
                                                <Form.Item label="Conversation context">
                                                    <Space>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {chatContextId ? <>Active: <Text code style={{ fontSize: 11 }}>{chatContextId}</Text></> : "No context yet"}
                                                        </Text>
                                                        {chatContextId && (
                                                            <Button size="small" onClick={() => setChatContextId(null)}>
                                                                Reset context
                                                            </Button>
                                                        )}
                                                    </Space>
                                                </Form.Item>
                                            </Form>
                                        ),
                                    },
                                ]}
                            />
                        ),
                    },
                ]}
            />

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    // ── Agent Card ────────────────────────────────────────
                    {
                        key: "card",
                        label: (
                            <Space size={4}>
                                <InfoCircleOutlined />
                                Agent Card
                                {agentCard && <Badge status="success" />}
                            </Space>
                        ),
                        children: agentCard ? (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={12}>
                                    <Card size="small" title={<><RobotOutlined style={{ color: "#0891b2" }} /> {agentCard.name}</>}>
                                        {agentCard.description && (
                                            <Paragraph type="secondary" style={{ fontSize: 13 }}>{agentCard.description}</Paragraph>
                                        )}
                                        <Descriptions size="small" column={1} bordered>
                                            <Descriptions.Item label="URL">
                                                <Text code copyable style={{ fontSize: 11 }}>{agentCard.url}</Text>
                                            </Descriptions.Item>
                                            {agentCard.version && (
                                                <Descriptions.Item label="Version"><Tag>{agentCard.version}</Tag></Descriptions.Item>
                                            )}
                                            {agentCard.provider && (
                                                <Descriptions.Item label="Provider">
                                                    {agentCard.provider.organization}
                                                </Descriptions.Item>
                                            )}
                                            {agentCard.capabilities && (
                                                <Descriptions.Item label="Capabilities">
                                                    <Space wrap>
                                                        {agentCard.capabilities.streaming && <Tag color="blue">Streaming</Tag>}
                                                        {agentCard.capabilities.pushNotifications && <Tag color="purple">Push</Tag>}
                                                        {agentCard.capabilities.stateTransitionHistory && <Tag color="cyan">State History</Tag>}
                                                    </Space>
                                                </Descriptions.Item>
                                            )}
                                            {agentCard.defaultInputModes?.length && (
                                                <Descriptions.Item label="Input Modes">
                                                    {agentCard.defaultInputModes.map(m => <Tag key={m}>{m}</Tag>)}
                                                </Descriptions.Item>
                                            )}
                                            {agentCard.defaultOutputModes?.length && (
                                                <Descriptions.Item label="Output Modes">
                                                    {agentCard.defaultOutputModes.map(m => <Tag key={m}>{m}</Tag>)}
                                                </Descriptions.Item>
                                            )}
                                            {agentCard.securitySchemes && (
                                                <Descriptions.Item label="Security">
                                                    <Space direction="vertical" size={4} style={{ width: "100%" }}>
                                                        {Object.entries(agentCard.securitySchemes).map(([name, scheme]) => (
                                                            <div key={name}>
                                                                <Tag color="gold" icon={<LockOutlined />}>{name}</Tag>
                                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                                    {scheme.type}{scheme.scheme ? ` (${scheme.scheme})` : ""}
                                                                    {scheme.in ? ` in ${scheme.in}` : ""}
                                                                    {scheme.name ? `: ${scheme.name}` : ""}
                                                                </Text>
                                                            </div>
                                                        ))}
                                                    </Space>
                                                </Descriptions.Item>
                                            )}
                                        </Descriptions>

                                        {agentCard.skills && agentCard.skills.length > 0 && (
                                            <>
                                                <Divider style={{ margin: "12px 0" }}>Skills ({agentCard.skills.length})</Divider>
                                                {agentCard.skills.map(skill => (
                                                    <Card key={skill.id} size="small" style={{ marginBottom: 8 }}>
                                                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                                                            <div>
                                                                <Text strong style={{ fontSize: 12 }}>{skill.name}</Text>
                                                                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>{skill.id}</Text>
                                                            </div>
                                                            <Button
                                                                size="small"
                                                                type="link"
                                                                icon={<ExperimentOutlined />}
                                                                onClick={() => {
                                                                    setSelectedSkillId(skill.id);
                                                                    setActiveTab("skills");
                                                                }}
                                                            >
                                                                Test
                                                            </Button>
                                                        </Space>
                                                        {skill.description && (
                                                            <Text style={{ fontSize: 11, display: "block", marginTop: 4 }}>{skill.description}</Text>
                                                        )}
                                                        {skill.tags?.length && (
                                                            <div style={{ marginTop: 4 }}>
                                                                {skill.tags.map(t => <Tag key={t} style={{ fontSize: 10 }}>{t}</Tag>)}
                                                            </div>
                                                        )}
                                                    </Card>
                                                ))}
                                            </>
                                        )}
                                    </Card>
                                </Col>

                                <Col xs={24} lg={12}>
                                    <Card
                                        size="small"
                                        title={
                                            <Space>
                                                <CheckCircleOutlined style={{ color: "#0891b2" }} />
                                                Spec Compliance
                                                <Tag color="success">{complianceSummary.ok} OK</Tag>
                                                {complianceSummary.warn > 0 && <Tag color="warning">{complianceSummary.warn} Warn</Tag>}
                                                {complianceSummary.error > 0 && <Tag color="error">{complianceSummary.error} Error</Tag>}
                                            </Space>
                                        }
                                        style={{ marginBottom: 12 }}
                                    >
                                        <List
                                            size="small"
                                            dataSource={compliance}
                                            renderItem={check => (
                                                <List.Item style={{ padding: "4px 0" }}>
                                                    <Space style={{ width: "100%" }}>
                                                        {check.status === "ok" && <CheckCircleOutlined style={{ color: "#22c55e", flexShrink: 0 }} />}
                                                        {check.status === "warn" && <WarningOutlined style={{ color: "#f59e0b", flexShrink: 0 }} />}
                                                        {check.status === "error" && <CloseCircleOutlined style={{ color: "#ef4444", flexShrink: 0 }} />}
                                                        <Text code style={{ fontSize: 11, flexShrink: 0 }}>{check.field}</Text>
                                                        <Text type="secondary" style={{ fontSize: 11, flex: 1 }}>{check.note}</Text>
                                                    </Space>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>

                                    <Card
                                        size="small"
                                        title="Raw card JSON"
                                        extra={
                                            <Button
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => { navigator.clipboard.writeText(cardJson); message.success("Copied!"); }}
                                            />
                                        }
                                    >
                                        <CodeEditor value={cardJson} language="json" height={220} readOnly />
                                    </Card>
                                </Col>
                            </Row>
                        ) : (
                            <Card>
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        loadingCard
                                            ? <Spin tip="Loading agent card…" />
                                            : "Enter an agent URL above and click 'Discover'"
                                    }
                                />
                            </Card>
                        ),
                    },

                    // ── Skills ────────────────────────────────────────────
                    {
                        key: "skills",
                        label: (
                            <Space size={4}>
                                <ExperimentOutlined />
                                Skills
                                {agentCard?.skills && <Badge count={agentCard.skills.length} size="small" color="#6366f1" />}
                            </Space>
                        ),
                        children: !agentCard ? (
                            <Card><Empty description="Discover an agent card first" /></Card>
                        ) : !agentCard.skills?.length ? (
                            <Card><Empty description="This agent declares no skills" /></Card>
                        ) : (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={10}>
                                    <Card size="small" title="Choose skill">
                                        <List
                                            dataSource={agentCard.skills}
                                            renderItem={(skill) => {
                                                const selected = skill.id === selectedSkillId;
                                                return (
                                                    <List.Item
                                                        onClick={() => setSelectedSkillId(skill.id)}
                                                        style={{
                                                            cursor: "pointer",
                                                            padding: 8,
                                                            border: `1px solid ${selected ? "#0891b2" : "transparent"}`,
                                                            borderRadius: 6,
                                                            background: selected ? (darkMode ? "rgba(8,145,178,0.12)" : "rgba(8,145,178,0.05)") : undefined,
                                                            marginBottom: 4,
                                                        }}
                                                    >
                                                        <div style={{ width: "100%" }}>
                                                            <Text strong style={{ fontSize: 12 }}>{skill.name}</Text>
                                                            <div><Text type="secondary" style={{ fontSize: 10 }}>{skill.id}</Text></div>
                                                            {skill.description && (
                                                                <Text style={{ fontSize: 11 }}>{skill.description}</Text>
                                                            )}
                                                        </div>
                                                    </List.Item>
                                                );
                                            }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} lg={14}>
                                    <Card
                                        size="small"
                                        title={selectedSkillId ? `Invoke: ${agentCard.skills.find(s => s.id === selectedSkillId)?.name}` : "Select a skill"}
                                        extra={
                                            <Button
                                                size="small"
                                                type="primary"
                                                icon={<PlayCircleOutlined />}
                                                disabled={!selectedSkillId || callingSkill}
                                                loading={callingSkill}
                                                onClick={callSkill}
                                                style={{ background: "#0891b2", borderColor: "#0891b2" }}
                                            >
                                                Call
                                            </Button>
                                        }
                                    >
                                        {selectedSkillId ? (
                                            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                                                {(() => {
                                                    const skill = agentCard.skills?.find(s => s.id === selectedSkillId);
                                                    return skill?.examples?.length ? (
                                                        <div>
                                                            <Text type="secondary" style={{ fontSize: 11 }}>Examples:</Text>
                                                            <Space wrap style={{ marginTop: 4 }}>
                                                                {skill.examples.map((ex, i) => (
                                                                    <Button
                                                                        key={i}
                                                                        size="small"
                                                                        onClick={() => setSkillInput(ex)}
                                                                        style={{ fontSize: 11 }}
                                                                    >
                                                                        {ex.length > 30 ? ex.slice(0, 30) + "…" : ex}
                                                                    </Button>
                                                                ))}
                                                            </Space>
                                                        </div>
                                                    ) : null;
                                                })()}
                                                <div>
                                                    <Text strong style={{ fontSize: 12 }}>Input</Text>
                                                    <TextArea
                                                        value={skillInput}
                                                        onChange={e => setSkillInput(e.target.value)}
                                                        rows={4}
                                                        placeholder="Free-text input. The skill ID is also sent as a structured data part so agents that route by skill can match."
                                                    />
                                                </div>
                                                {skillResult && (
                                                    <div>
                                                        <Text strong style={{ fontSize: 12 }}>Result</Text>
                                                        <CodeEditor value={skillResult} language="json" height={200} readOnly />
                                                    </div>
                                                )}
                                            </Space>
                                        ) : <Empty description="Select a skill on the left" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },

                    // ── Chat ──────────────────────────────────────────────
                    {
                        key: "chat",
                        label: (
                            <Space size={4}>
                                <SendOutlined />
                                Chat
                                {chatMessages.length > 0 && <Badge count={chatMessages.filter(m => m.role === "agent").length} size="small" color="#0891b2" />}
                            </Space>
                        ),
                        children: (
                            <ChatPanel
                                messages={chatMessages}
                                input={inputText}
                                setInput={setInputText}
                                onSend={sendChatMessage}
                                onClear={() => { setChatMessages([]); setChatContextId(null); }}
                                sending={sending}
                                agentCard={agentCard}
                                bottomRef={chatBottomRef}
                                darkMode={darkMode}
                                contextId={chatContextId}
                                title={`Chat (${protocolInfo.sendMethod})`}
                            />
                        ),
                    },

                    // ── Streaming ─────────────────────────────────────────
                    {
                        key: "stream",
                        label: (
                            <Space size={4}>
                                <ThunderboltOutlined />
                                Streaming
                                {streaming && <Badge status="processing" />}
                            </Space>
                        ),
                        children: (
                            <ChatPanel
                                messages={streamingMessages}
                                input={streamInput}
                                setInput={setStreamInput}
                                onSend={sendStreamingMessage}
                                onClear={() => setStreamingMessages([])}
                                sending={streaming}
                                onStop={streaming ? stopStreaming : undefined}
                                agentCard={agentCard}
                                bottomRef={streamBottomRef}
                                darkMode={darkMode}
                                contextId={chatContextId}
                                title={`Streaming (${protocolInfo.streamMethod})`}
                                sendIcon={<ThunderboltOutlined />}
                                streamingNotice={!agentCard?.capabilities?.streaming
                                    ? "Agent has not declared streaming capability — request may fail."
                                    : undefined}
                            />
                        ),
                    },

                    // ── Tasks ─────────────────────────────────────────────
                    {
                        key: "tasks",
                        label: <Space size={4}><FileTextOutlined />Tasks</Space>,
                        children: (
                            <Card size="small" title="Task lookup & cancel">
                                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                                    <Alert
                                        type="info"
                                        showIcon
                                        message="Task IDs are returned by message/send (current spec) or from the chat tab's response"
                                        style={{ fontSize: 12 }}
                                    />
                                    <Space.Compact style={{ width: "100%" }}>
                                        <Input
                                            value={taskIdInput}
                                            onChange={e => setTaskIdInput(e.target.value)}
                                            placeholder="task-id-here"
                                            prefix={<KeyOutlined />}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<ReloadOutlined />}
                                            onClick={fetchTask}
                                            loading={taskBusy}
                                            disabled={!taskIdInput.trim()}
                                            style={{ background: "#0891b2", borderColor: "#0891b2" }}
                                        >
                                            tasks/get
                                        </Button>
                                        <Button
                                            danger
                                            icon={<StopOutlined />}
                                            onClick={cancelTask}
                                            loading={taskBusy}
                                            disabled={!taskIdInput.trim()}
                                        >
                                            tasks/cancel
                                        </Button>
                                    </Space.Compact>
                                    {taskResult && (
                                        <div>
                                            <Text strong style={{ fontSize: 12 }}>Result</Text>
                                            <CodeEditor value={taskResult} language="json" height={300} readOnly />
                                        </div>
                                    )}
                                </Space>
                            </Card>
                        ),
                    },

                    // ── Debug Console ─────────────────────────────────────
                    {
                        key: "debug",
                        label: (
                            <Space size={4}>
                                <BugOutlined />
                                Debug
                                {debugLog.length > 0 && <Badge count={debugLog.length} size="small" color="#6366f1" overflowCount={99} />}
                            </Space>
                        ),
                        children: (
                            <Card
                                size="small"
                                title={<Space><BugOutlined style={{ color: "#6366f1" }} /> JSON-RPC 2.0 Messages</Space>}
                                extra={
                                    debugLog.length > 0 && (
                                        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => setDebugLog([])}>
                                            Clear
                                        </Button>
                                    )
                                }
                            >
                                {debugLog.length === 0 ? (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No messages yet" />
                                ) : (
                                    <div style={{ maxHeight: 560, overflowY: "auto" }}>
                                        {debugLog.map(entry => {
                                            const payloadStr = JSON.stringify(entry.payload, null, 2);
                                            return (
                                                <div
                                                    key={entry.id}
                                                    style={{
                                                        marginBottom: 8, padding: 10, borderRadius: 6,
                                                        border: `1px solid ${entry.error ? "rgba(239,68,68,0.3)" : entry.direction === "out" ? "rgba(8,145,178,0.3)" : "rgba(99,102,241,0.3)"}`,
                                                        background: entry.error
                                                            ? (darkMode ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)")
                                                            : entry.direction === "out"
                                                                ? (darkMode ? "rgba(8,145,178,0.08)" : "rgba(8,145,178,0.05)")
                                                                : (darkMode ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)"),
                                                    }}
                                                >
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                                        <Tag color={entry.direction === "out" ? "cyan" : "purple"} style={{ fontSize: 10, margin: 0 }}>
                                                            {entry.direction === "out" ? "→ OUT" : "← IN"}
                                                        </Tag>
                                                        <Text code style={{ fontSize: 11 }}>{entry.method}</Text>
                                                        {entry.error && <Tag color="error" style={{ fontSize: 10 }}>Error</Tag>}
                                                        <Text type="secondary" style={{ fontSize: 10, marginLeft: "auto" }}>
                                                            {new Date(entry.ts).toLocaleTimeString()}
                                                        </Text>
                                                        <Tooltip title="Copy">
                                                            <Button
                                                                size="small" type="text" icon={<CopyOutlined />}
                                                                style={{ padding: "0 4px" }}
                                                                onClick={() => { navigator.clipboard.writeText(payloadStr); message.success("Copied!"); }}
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                    <pre style={{
                                                        fontSize: 10, margin: 0, maxHeight: 200, overflow: "auto",
                                                        fontFamily: "var(--font-geist-mono), monospace",
                                                        whiteSpace: "pre-wrap", wordBreak: "break-all",
                                                    }}>
                                                        {payloadStr}
                                                    </pre>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </Card>
                        ),
                    },
                ]}
            />
        </ToolPageLayout>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────

// Local icon shim — antd's SettingOutlined is verbose to import among the others
function SettingOutlinedIcon() {
    return <ApiOutlined style={{ fontSize: 14 }} />;
}

interface AuthPanelProps {
    value: AuthConfig;
    onChange: (next: AuthConfig) => void;
    card: AgentCard | null;
}

function AuthPanel({ value, onChange, card }: AuthPanelProps) {
    const securityHints = card?.securitySchemes
        ? Object.entries(card.securitySchemes).map(([name, scheme]) => `${name}: ${scheme.type}${scheme.scheme ? "/" + scheme.scheme : ""}`)
        : [];

    return (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {securityHints.length > 0 && (
                <Alert
                    type="info"
                    showIcon
                    icon={<LockOutlined />}
                    message="Agent declares the following security schemes"
                    description={securityHints.join(" · ")}
                    style={{ fontSize: 12 }}
                />
            )}
            <Radio.Group
                value={value.type}
                onChange={e => onChange({ ...value, type: e.target.value })}
                optionType="button"
                buttonStyle="solid"
            >
                <Radio.Button value="none">None</Radio.Button>
                <Radio.Button value="bearer">Bearer</Radio.Button>
                <Radio.Button value="basic">Basic</Radio.Button>
                <Radio.Button value="apiKey">API Key</Radio.Button>
                <Radio.Button value="oauth2">OAuth 2.0</Radio.Button>
            </Radio.Group>

            {value.type === "bearer" && (
                <Form layout="vertical" size="small">
                    <Form.Item label="Bearer token" tooltip="Sent as 'Authorization: Bearer <token>'">
                        <Input.Password
                            value={value.bearer.token}
                            onChange={e => onChange({ ...value, bearer: { token: e.target.value } })}
                            placeholder="eyJhbGciOi..."
                        />
                    </Form.Item>
                </Form>
            )}

            {value.type === "basic" && (
                <Form layout="vertical" size="small">
                    <Form.Item label="Username">
                        <Input
                            value={value.basic.username}
                            onChange={e => onChange({ ...value, basic: { ...value.basic, username: e.target.value } })}
                        />
                    </Form.Item>
                    <Form.Item label="Password">
                        <Input.Password
                            value={value.basic.password}
                            onChange={e => onChange({ ...value, basic: { ...value.basic, password: e.target.value } })}
                        />
                    </Form.Item>
                </Form>
            )}

            {value.type === "apiKey" && (
                <Form layout="vertical" size="small">
                    <Form.Item label="Add to">
                        <Radio.Group
                            value={value.apiKey.in}
                            onChange={e => onChange({ ...value, apiKey: { ...value.apiKey, in: e.target.value } })}
                        >
                            <Radio.Button value="header">Header</Radio.Button>
                            <Radio.Button value="query">Query parameter</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Key name">
                        <Input
                            value={value.apiKey.name}
                            onChange={e => onChange({ ...value, apiKey: { ...value.apiKey, name: e.target.value } })}
                            placeholder="X-API-Key"
                        />
                    </Form.Item>
                    <Form.Item label="Value">
                        <Input.Password
                            value={value.apiKey.value}
                            onChange={e => onChange({ ...value, apiKey: { ...value.apiKey, value: e.target.value } })}
                        />
                    </Form.Item>
                </Form>
            )}

            {value.type === "oauth2" && (
                <Form layout="vertical" size="small">
                    <Alert
                        type="warning"
                        showIcon
                        message="Browser-side OAuth 2.0 flows require server support."
                        description="Paste a pre-obtained access token below — it will be sent as 'Authorization: <tokenType> <accessToken>'."
                        style={{ marginBottom: 12, fontSize: 12 }}
                    />
                    <Form.Item label="Token type">
                        <Input
                            value={value.oauth2.tokenType}
                            onChange={e => onChange({ ...value, oauth2: { ...value.oauth2, tokenType: e.target.value } })}
                            placeholder="Bearer"
                        />
                    </Form.Item>
                    <Form.Item label="Access token">
                        <Input.Password
                            value={value.oauth2.accessToken}
                            onChange={e => onChange({ ...value, oauth2: { ...value.oauth2, accessToken: e.target.value } })}
                            placeholder="ya29.a0AfH6S..."
                        />
                    </Form.Item>
                </Form>
            )}
        </Space>
    );
}

interface HeadersPanelProps {
    headers: CustomHeader[];
    mode: "form" | "json";
    json: string;
    onModeChange: (mode: "form" | "json") => void;
    onAdd: () => void;
    onUpdate: (id: string, patch: Partial<CustomHeader>) => void;
    onRemove: (id: string) => void;
    onJsonChange: (v: string) => void;
}

function HeadersPanel({ headers, mode, json, onModeChange, onAdd, onUpdate, onRemove, onJsonChange }: HeadersPanelProps) {
    return (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Segmented
                size="small"
                value={mode}
                onChange={(v) => onModeChange(v as "form" | "json")}
                options={[
                    { label: "Form", value: "form" },
                    { label: "JSON", value: "json" },
                ]}
            />
            {mode === "form" ? (
                <>
                    {headers.length === 0 && (
                        <Text type="secondary" style={{ fontSize: 12 }}>No custom headers configured.</Text>
                    )}
                    {headers.map(h => (
                        <Space key={h.id} style={{ display: "flex", width: "100%" }}>
                            <Switch checked={h.enabled} onChange={(v) => onUpdate(h.id, { enabled: v })} size="small" />
                            <Input
                                placeholder="Header name"
                                value={h.key}
                                onChange={e => onUpdate(h.id, { key: e.target.value })}
                                style={{ width: 200 }}
                            />
                            <Input
                                placeholder="Value"
                                value={h.value}
                                onChange={e => onUpdate(h.id, { value: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onRemove(h.id)} />
                        </Space>
                    ))}
                    <Button type="dashed" icon={<PlusOutlined />} onClick={onAdd} block>
                        Add header
                    </Button>
                </>
            ) : (
                <>
                    <TextArea
                        value={json}
                        onChange={e => onJsonChange(e.target.value)}
                        rows={6}
                        style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12 }}
                        placeholder={'{\n  "X-Custom-Header": "value"\n}'}
                    />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        Valid JSON object — auto-syncs to form when parseable.
                    </Text>
                </>
            )}
        </Space>
    );
}

interface ChatPanelProps {
    messages: ChatMessage[];
    input: string;
    setInput: (v: string) => void;
    onSend: () => void;
    onClear: () => void;
    onStop?: () => void;
    sending: boolean;
    agentCard: AgentCard | null;
    bottomRef: React.RefObject<HTMLDivElement | null>;
    darkMode: boolean;
    contextId: string | null;
    title: string;
    sendIcon?: React.ReactNode;
    streamingNotice?: string;
}

function ChatPanel({
    messages, input, setInput, onSend, onClear, onStop, sending,
    agentCard, bottomRef, darkMode, contextId, title, sendIcon, streamingNotice,
}: ChatPanelProps) {
    return (
        <Card
            title={
                <Space>
                    <RobotOutlined style={{ color: "#0891b2" }} />
                    {title}
                    {agentCard && <Tag color="cyan">{agentCard.name}</Tag>}
                    {!agentCard && <Tag color="default">No agent loaded</Tag>}
                    {contextId && <Tag color="purple" icon={<KeyOutlined />}>ctx</Tag>}
                </Space>
            }
            extra={
                messages.length > 0 && (
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={onClear}>
                        Clear
                    </Button>
                )
            }
        >
            {streamingNotice && (
                <Alert type="warning" showIcon message={streamingNotice} style={{ marginBottom: 8, fontSize: 12 }} />
            )}
            <div style={{ height: 420, overflowY: "auto", padding: "8px 0", marginBottom: 12 }}>
                {messages.length === 0 && (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={agentCard ? "Send a message to start" : "Discover an agent first"} />
                )}
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        style={{
                            display: "flex",
                            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                            marginBottom: 8, gap: 8,
                        }}
                    >
                        {msg.role !== "user" && (
                            <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: msg.error ? "#ef4444" : "#0891b2",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, marginTop: 2,
                            }}>
                                {msg.role === "agent"
                                    ? <RobotOutlined style={{ color: "#fff", fontSize: 14 }} />
                                    : <InfoCircleOutlined style={{ color: "#fff", fontSize: 14 }} />}
                            </div>
                        )}
                        <div style={{
                            maxWidth: "72%", padding: "8px 12px",
                            borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                            background: msg.role === "user"
                                ? "#0891b2"
                                : msg.error
                                    ? (darkMode ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)")
                                    : "var(--wb-card-solid-bg)",
                            border: msg.role === "user" ? "none" : "1px solid var(--wb-card-border)",
                        }}>
                            <Text style={{
                                fontSize: 13,
                                color: msg.role === "user" ? "#fff" : undefined,
                                whiteSpace: "pre-wrap", wordBreak: "break-word",
                            }}>
                                {msg.content || (msg.streaming ? "…" : "")}
                            </Text>
                            <div>
                                <Text style={{
                                    fontSize: 10, opacity: 0.6,
                                    color: msg.role === "user" ? "#fff" : undefined,
                                }}>
                                    {new Date(msg.ts).toLocaleTimeString()}
                                    {msg.taskId && ` · task: ${msg.taskId.slice(0, 8)}`}
                                    {msg.streaming && " · streaming"}
                                </Text>
                            </div>
                        </div>
                        {msg.role === "user" && (
                            <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: "#6366f1",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, marginTop: 2,
                            }}>
                                <UserOutlined style={{ color: "#fff", fontSize: 14 }} />
                            </div>
                        )}
                    </div>
                ))}
                {sending && !messages.some(m => m.streaming) && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0891b2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <RobotOutlined style={{ color: "#fff", fontSize: 14 }} />
                        </div>
                        <Spin size="small" />
                        <Text type="secondary" style={{ fontSize: 12 }}>Agent is responding…</Text>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <Space.Compact style={{ width: "100%" }}>
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onPressEnter={onSend}
                    placeholder={agentCard ? `Message ${agentCard.name}…` : "Discover an agent first"}
                    disabled={!agentCard || sending}
                    size="large"
                />
                {onStop && sending ? (
                    <Button
                        size="large" danger icon={<StopOutlined />} onClick={onStop}
                    >
                        Stop
                    </Button>
                ) : (
                    <Button
                        size="large" type="primary"
                        icon={sending ? <ReloadOutlined spin /> : (sendIcon ?? <SendOutlined />)}
                        onClick={onSend}
                        disabled={!agentCard || !input.trim() || sending}
                        style={{ background: "#0891b2", borderColor: "#0891b2" }}
                    >
                        Send
                    </Button>
                )}
            </Space.Compact>
        </Card>
    );
}

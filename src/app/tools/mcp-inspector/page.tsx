"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
    Card, Input, Button, Typography, Row, Col, Space, Tabs, Tag,
    Select, Switch, InputNumber, Table, Collapse, Alert, Empty,
    Divider, Tooltip, Badge, Form, Spin, Segmented,
} from "antd";
import {
    ApiOutlined, PlayCircleOutlined, CopyOutlined, DeleteOutlined,
    PlusOutlined, SettingOutlined, HistoryOutlined, ThunderboltOutlined,
    CloseCircleOutlined, CheckCircleOutlined, ClockCircleOutlined,
    CodeOutlined, ReloadOutlined, KeyOutlined, SafetyCertificateOutlined,
    InfoCircleOutlined, ExperimentOutlined,
} from "@ant-design/icons";
import { messageService as message } from "@/lib/messageService";
import { useAppStore } from "@/lib/store";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import SslConfigSection, { type SslConfig } from "@/components/SslConfigSection";
import type { ColumnsType } from "antd/es/table/interface";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// ─── Types ────────────────────────────────────────────────────────────

type TransportType = "stdio" | "sse" | "http";
type ConnectionMode = "direct" | "direct-strict" | "via-server-proxy" | "via-mcp-proxy";

interface McpHeader { key: string; value: string; id: string; }

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

interface OAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    scope: string;
    accessToken: string;
    tokenUrl: string;
}

interface McpTool {
    name: string;
    description?: string;
    inputSchema?: Record<string, unknown>;
}

interface CallHistoryEntry {
    id: string;
    ts: number;
    tool: string;
    args: string;
    result: string;
    durationMs: number;
    error: boolean;
}

interface McpConfig {
    transport: TransportType;
    connectionMode: ConnectionMode;
    // stdio
    command: string;
    args: string;
    serverEntry: string;
    // sse / http
    serverUrl: string;
    // common
    headers: McpHeader[];
    requestTimeoutMs: number;
    maxTotalTimeoutMs: number;
    resetTimeoutOnProgress: boolean;
    proxyAddress: string;
    proxySessionToken: string;
    taskTtlMs: number;
    // OAuth 2.0 client credentials (token can be exchanged or pasted directly)
    oauth: OAuthConfig;
    // SSL/TLS configuration (applied when traffic is routed through /api/proxy)
    sslVerify: boolean;
    sslCaCert: string;
    sslClientCert: string;
    sslClientKey: string;
}

const DEFAULT_CONFIG: McpConfig = {
    transport: "sse",
    connectionMode: "direct",
    command: "npx",
    args: "-y @modelcontextprotocol/server-everything",
    serverEntry: "",
    serverUrl: "http://localhost:3001/sse",
    headers: [],
    requestTimeoutMs: 30000,
    maxTotalTimeoutMs: 120000,
    resetTimeoutOnProgress: true,
    proxyAddress: "http://localhost:6277",
    proxySessionToken: "",
    taskTtlMs: 300000,
    oauth: {
        clientId: "",
        clientSecret: "",
        redirectUrl: "",
        scope: "",
        accessToken: "",
        tokenUrl: "",
    },
    sslVerify: false,
    sslCaCert: "",
    sslClientCert: "",
    sslClientKey: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────

let hdrIdCounter = 0;
let histIdCounter = 0;

function makeHeaderId() { return String(++hdrIdCounter); }
function makeHistId() { return String(++histIdCounter); }

function sslFields(cfg: McpConfig): Record<string, unknown> {
    const out: Record<string, unknown> = { sslVerify: cfg.sslVerify };
    if (cfg.sslCaCert?.trim()) out.sslCaCert = cfg.sslCaCert;
    if (cfg.sslClientCert?.trim()) out.sslClientCert = cfg.sslClientCert;
    if (cfg.sslClientKey?.trim()) out.sslClientKey = cfg.sslClientKey;
    return out;
}

function buildCliCommand(cfg: McpConfig): string {
    const args = cfg.args.trim();
    const entry = cfg.serverEntry.trim();
    const parts = ["npx", "@modelcontextprotocol/inspector"];
    if (cfg.command && cfg.command !== "npx") parts.push(`--command "${cfg.command}"`);
    if (args) parts.push(`-- ${args}`);
    if (entry) parts.push(entry);
    return parts.join(" ");
}

function formatMs(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

function headersToJson(headers: McpHeader[]): string {
    const obj: Record<string, string> = {};
    headers.filter(h => h.key).forEach(h => { obj[h.key] = h.value; });
    return Object.keys(obj).length === 0 ? "{}" : JSON.stringify(obj, null, 2);
}

function jsonToHeaders(json: string): McpHeader[] | null {
    try {
        const obj = JSON.parse(json);
        if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return null;
        return Object.entries(obj).map(([key, value]) => ({
            key,
            value: String(value),
            id: makeHeaderId(),
        }));
    } catch {
        return null;
    }
}

/**
 * Parse a Streamable-HTTP MCP response. Per spec, the server may answer with either
 * `application/json` (a single JSON-RPC envelope) or `text/event-stream` (one or more
 * `data:` events, each carrying a JSON-RPC envelope). We pick the last data event that
 * decodes to a JSON-RPC response, which matches what the official inspector does.
 */
function parseMcpResponse(text: string, contentType: string): unknown {
    const isSse = contentType.includes("text/event-stream") || /^(event|data):/m.test(text);
    if (isSse) {
        const lines = text.split(/\r?\n/);
        let lastParsed: unknown = null;
        for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
                lastParsed = JSON.parse(payload);
            } catch { /* keep scanning */ }
        }
        if (lastParsed !== null) return lastParsed;
        throw new Error("SSE response had no parseable data event");
    }
    if (!text) return { jsonrpc: "2.0", result: null };
    try {
        return JSON.parse(text);
    } catch {
        throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
    }
}

/**
 * Build the standard request headers for a Streamable-HTTP MCP call:
 *   - merge user-configured headers (preserved as-is, including auth)
 *   - force JSON content type and SSE-or-JSON Accept
 *   - echo the Mcp-Session-Id from a previous response, when we have one
 */
function buildMcpHeaders(userHeaders: Record<string, string>, sessionId?: string): Record<string, string> {
    return {
        ...userHeaders,
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
    };
}

async function mcpFetchDirect(
    url: string,
    headers: Record<string, string>,
    body: unknown,
    timeoutMs: number,
    sessionId?: string,
): Promise<{ data: unknown; sessionId?: string }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    try {
        res = await fetch(url, {
            method: "POST",
            headers: buildMcpHeaders(headers, sessionId),
            body: JSON.stringify(body),
            signal: controller.signal,
        });
    } catch (err: any) {
        clearTimeout(timer);
        if (err?.name === "AbortError") throw new Error(`Request timed out after ${timeoutMs}ms`);
        throw err;
    }
    clearTimeout(timer);

    const nextSessionId = res.headers.get("mcp-session-id") || sessionId;

    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText}${txt ? ": " + txt.slice(0, 300) : ""}`);
    }

    // 202 Accepted: notification or async response; nothing to parse.
    if (res.status === 202) {
        return { data: { jsonrpc: "2.0", id: (body as any)?.id ?? null, result: null }, sessionId: nextSessionId };
    }

    const text = await res.text();
    const contentType = res.headers.get("content-type") || "";
    return { data: parseMcpResponse(text, contentType), sessionId: nextSessionId };
}

async function mcpFetchViaProxy(
    url: string,
    headers: Record<string, string>,
    body: unknown,
    timeoutMs: number,
    sslFields: Record<string, unknown> = {},
    sessionId?: string,
): Promise<{ data: unknown; sessionId?: string }> {
    const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            url,
            method: "POST",
            headers: buildMcpHeaders(headers, sessionId),
            body: JSON.stringify(body),
            bodyIsBase64: false,
            timeout: timeoutMs,
            followRedirects: true,
            ...sslFields,
        }),
    });
    const proxy = await res.json();
    if (proxy.error) throw new Error(proxy.error);

    const respHeaders = (proxy.headers ?? {}) as Record<string, string>;
    const nextSessionId = respHeaders["mcp-session-id"] || sessionId;
    const contentType = respHeaders["content-type"] || "";

    if (proxy.status < 200 || proxy.status >= 300) {
        const snippet = typeof proxy.body === "string" ? proxy.body.slice(0, 200) : "";
        throw new Error(`HTTP ${proxy.status}: ${proxy.statusText || snippet}`);
    }
    if (proxy.status === 202) {
        return { data: { jsonrpc: "2.0", id: (body as any)?.id ?? null, result: null }, sessionId: nextSessionId };
    }
    return { data: parseMcpResponse(proxy.body || "", contentType), sessionId: nextSessionId };
}

function isLikelyCorsError(err: unknown): boolean {
    const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
    return msg.includes("failed to fetch") || msg.includes("cors") || msg.includes("networkerror");
}

/**
 * Try a direct browser fetch first. If it fails with what looks like a CORS or
 * network error, automatically retry through /api/proxy so the inspector keeps
 * working against MCP servers that don't ship CORS headers. Returns whether the
 * proxy was used so the caller can surface a notice/badge.
 */
/**
 * Apply the user's chosen connection mode to the request before it is sent.
 * - "direct": no rewrite. Auto-fallback to /api/proxy on CORS/network errors.
 * - "direct-strict": no rewrite. Never fall back; surface CORS errors to the user.
 * - "via-server-proxy": always send via /api/proxy (Node-side; bypasses browser CORS).
 * - "via-mcp-proxy": rewrite the URL to tunnel through a user-run MCP proxy at proxyAddress
 *   (e.g. `npx @modelcontextprotocol/inspector` proxy on :6277). The MCP_PROXY_AUTH_TOKEN
 *   and Bearer header are added so the proxy authorizes the request.
 */
function applyConnectionMode(
    url: string,
    headers: Record<string, string>,
    mode: ConnectionMode,
    proxyAddress: string,
    proxySessionToken: string,
): { url: string; headers: Record<string, string>; forceServerProxy: boolean; mode: ConnectionMode } {
    if (mode === "via-mcp-proxy" && proxyAddress.trim()) {
        try {
            const proxy = new URL(proxyAddress);
            const target = new URL(url);
            proxy.pathname = target.pathname || "/";
            // Carry over original target search; add MCP auth token query as a fallback for
            // proxies that authenticate via query (matches the official inspector pattern).
            const params = new URLSearchParams(target.search);
            if (proxySessionToken && !params.has("MCP_PROXY_AUTH_TOKEN")) {
                params.set("MCP_PROXY_AUTH_TOKEN", proxySessionToken);
            }
            proxy.search = params.toString() ? "?" + params.toString() : "";
            const newHeaders = { ...headers };
            if (proxySessionToken && !newHeaders["Authorization"]) {
                newHeaders["Authorization"] = `Bearer ${proxySessionToken}`;
            }
            return { url: proxy.toString(), headers: newHeaders, forceServerProxy: false, mode };
        } catch {
            // Invalid proxy address — fall through to direct
            return { url, headers, forceServerProxy: false, mode: "direct" };
        }
    }
    return {
        url,
        headers,
        forceServerProxy: mode === "via-server-proxy",
        mode,
    };
}

async function mcpFetch(
    url: string,
    headers: Record<string, string>,
    body: unknown,
    timeoutMs: number,
    sslFields: Record<string, unknown> = {},
    mode: ConnectionMode = "direct",
    proxyAddress: string = "",
    proxySessionToken: string = "",
    sessionId?: string,
): Promise<{ data: unknown; usedProxy: boolean; corsFallback: boolean; sessionId?: string }> {
    const applied = applyConnectionMode(url, headers, mode, proxyAddress, proxySessionToken);
    const hasSslConfig = sslFields.sslVerify === true ||
        !!sslFields.sslCaCert || !!sslFields.sslClientCert || !!sslFields.sslClientKey;

    // Hard-routed through /api/proxy: explicit user choice or SSL options that the browser cannot honour.
    if (applied.forceServerProxy || hasSslConfig) {
        const r = await mcpFetchViaProxy(applied.url, applied.headers, body, timeoutMs, sslFields, sessionId);
        return { data: r.data, usedProxy: true, corsFallback: false, sessionId: r.sessionId };
    }
    try {
        const r = await mcpFetchDirect(applied.url, applied.headers, body, timeoutMs, sessionId);
        return { data: r.data, usedProxy: false, corsFallback: false, sessionId: r.sessionId };
    } catch (err) {
        // Auto-fallback only in "direct" mode. "direct-strict" and "via-mcp-proxy" surface the error.
        if (applied.mode === "direct" && isLikelyCorsError(err)) {
            const r = await mcpFetchViaProxy(applied.url, applied.headers, body, timeoutMs, sslFields, sessionId);
            return { data: r.data, usedProxy: true, corsFallback: true, sessionId: r.sessionId };
        }
        if (isLikelyCorsError(err)) {
            const original = err instanceof Error ? err.message : String(err);
            throw new Error(
                `${original}\n\nLikely a browser CORS block. Options:\n` +
                `  1. Enable CORS on the target server (Access-Control-Allow-Origin: *)\n` +
                `  2. Switch Connection Type to "Via Server Proxy" (uses this app's /api/proxy to bypass browser CORS)\n` +
                `  3. If you are running ` + "`npx @modelcontextprotocol/inspector`" + `, switch to "Via MCP Proxy" and paste the proxy address + session token.`
            );
        }
        throw err;
    }
}

// ─── Component ───────────────────────────────────────────────────────

export default function McpInspectorPage() {
    const { darkMode } = useAppStore();

    const [config, setConfig] = useState<McpConfig>(DEFAULT_CONFIG);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("mcp-inspector-config");
            const parsed = saved ? JSON.parse(saved) : {};
            setConfig(prev => ({
                ...prev,
                ...parsed,
                oauth: {
                    ...prev.oauth,
                    redirectUrl: `${window.location.origin}/oauth/callback`,
                    ...(parsed.oauth || {}),
                },
            }));
        } catch {
            setConfig(prev => ({
                ...prev,
                oauth: { ...prev.oauth, redirectUrl: `${window.location.origin}/oauth/callback` },
            }));
        }
    }, []);

    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);
    const [tools, setTools] = useState<McpTool[]>([]);
    const [selectedTool, setSelectedTool] = useState<McpTool | null>(null);
    const [callArgs, setCallArgs] = useState("{}");
    const [calling, setCalling] = useState(false);
    const [lastResult, setLastResult] = useState<string>("");
    const [lastError, setLastError] = useState<string>("");
    const [history, setHistory] = useState<CallHistoryEntry[]>(() => {
        try {
            const saved = typeof window !== "undefined" ? localStorage.getItem("mcp-inspector-history") : null;
            return JSON.parse(saved || "[]");
        } catch { return []; }
    });
    const [activeTab, setActiveTab] = useState("connect");
    const [proxyInUse, setProxyInUse] = useState(false);
    const [corsFallback, setCorsFallback] = useState(false);
    const [diagnosing, setDiagnosing] = useState(false);
    const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticReport | null>(null);
    const [headerMode, setHeaderMode] = useState<"form" | "json">("form");
    const [headerJson, setHeaderJson] = useState("{}");

    const patchConfig = (patch: Partial<McpConfig>) => {
        setConfig(prev => {
            const next = { ...prev, ...patch };
            try { localStorage.setItem("mcp-inspector-config", JSON.stringify(next)); } catch {}
            return next;
        });
    };

    const addHeader = () => patchConfig({ headers: [...config.headers, { key: "", value: "", id: makeHeaderId() }] });
    const updateHeader = (id: string, field: "key" | "value", val: string) =>
        patchConfig({ headers: config.headers.map(h => h.id === id ? { ...h, [field]: val } : h) });
    const removeHeader = (id: string) => patchConfig({ headers: config.headers.filter(h => h.id !== id) });

    const switchHeaderMode = (mode: "form" | "json") => {
        if (mode === "json") {
            setHeaderJson(headersToJson(config.headers));
        } else {
            const parsed = jsonToHeaders(headerJson);
            if (parsed !== null) patchConfig({ headers: parsed });
        }
        setHeaderMode(mode);
    };

    const pushHistory = useCallback((entry: CallHistoryEntry) => {
        setHistory(prev => {
            const next = [entry, ...prev].slice(0, 100);
            try { localStorage.setItem("mcp-inspector-history", JSON.stringify(next)); } catch {}
            return next;
        });
    }, []);

    // ── Connect ──────────────────────────────────────────────────────

    const handleConnect = async () => {
        if (config.transport === "stdio") {
            setActiveTab("connect");
            message.info("stdio transport: copy the CLI command below and run it in your terminal, then switch to SSE/HTTP to connect from the browser.");
            return;
        }

        setConnecting(true);
        setConnected(false);
        setSessionId(undefined);
        setTools([]);
        setSelectedTool(null);
        setLastResult("");
        setLastError("");

        try {
            // User-configured headers + OAuth — passed through on every request below.
            const headers: Record<string, string> = {};
            config.headers.filter(h => h.key).forEach(h => { headers[h.key] = h.value; });
            if (config.oauth.accessToken && !headers["Authorization"]) {
                headers["Authorization"] = `Bearer ${config.oauth.accessToken}`;
            }

            // Use the URL exactly as the user typed it. Don't strip /sse or append /.
            const url = config.serverUrl.trim();

            let viaProxy = false;
            let corsHit = false;

            // 1. initialize — captures Mcp-Session-Id
            const init = await mcpFetch(url, headers,
                { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "mydevtools-mcp-inspector", version: "1.3" } } },
                config.requestTimeoutMs,
                sslFields(config),
                config.connectionMode,
                config.proxyAddress,
                config.proxySessionToken,
            );
            viaProxy = viaProxy || init.usedProxy;
            corsHit = corsHit || init.corsFallback;
            const sid = init.sessionId;
            setSessionId(sid);

            const initData = init.data as any;
            if (initData?.error) throw new Error(`initialize: ${initData.error.message || JSON.stringify(initData.error)}`);

            // 2. notifications/initialized — required by spec; servers usually 202 here.
            await mcpFetch(url, headers,
                { jsonrpc: "2.0", method: "notifications/initialized", params: {} },
                config.requestTimeoutMs,
                sslFields(config),
                config.connectionMode,
                config.proxyAddress,
                config.proxySessionToken,
                sid,
            ).catch(() => undefined);

            // 3. tools/list — uses the session
            const list = await mcpFetch(url, headers,
                { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
                config.requestTimeoutMs,
                sslFields(config),
                config.connectionMode,
                config.proxyAddress,
                config.proxySessionToken,
                sid,
            );
            viaProxy = viaProxy || list.usedProxy;
            corsHit = corsHit || list.corsFallback;
            if (list.sessionId) setSessionId(list.sessionId);

            const listData = list.data as any;
            if (listData?.error) throw new Error(`tools/list: ${listData.error.message || JSON.stringify(listData.error)}`);
            setTools(listData?.result?.tools || []);

            setProxyInUse(viaProxy);
            setCorsFallback(corsHit);
            setConnected(true);
            setActiveTab("tools");
            message.success(
                corsHit ? "Connected — direct fetch was blocked by CORS, retried via server proxy"
                    : viaProxy ? "Connected via server proxy"
                        : "Connected — tool list loaded"
            );
        } catch (err: any) {
            setLastError(err.message);
            message.error("Connection failed: " + err.message);
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = () => {
        setConnected(false);
        setSessionId(undefined);
        setTools([]);
        setSelectedTool(null);
        setProxyInUse(false);
        setCorsFallback(false);
        message.info("Disconnected");
    };

    // ── Diagnose connection ─────────────────────────────────────────
    // Runs without committing to a connection: tests direct fetch, OPTIONS preflight, and proxy.
    // Helps the user understand exactly what's blocking before they try Connect.
    const handleDiagnose = async () => {
        if (config.transport === "stdio") {
            message.warning("Diagnose only works for SSE/HTTP transports.");
            return;
        }
        setDiagnosing(true);
        setDiagnosticResult(null);
        try {
            const target = config.serverUrl.trim();
            if (!target) {
                message.warning("Enter a server URL first.");
                return;
            }
            let parsed: URL;
            try { parsed = new URL(target); }
            catch {
                setDiagnosticResult({
                    targetUrl: target, crossOrigin: false,
                    steps: [{ name: "Parse URL", ok: false, detail: "Invalid URL" }],
                    recommendation: "Fix the URL format (must include http:// or https://).",
                });
                return;
            }
            const sameOrigin = typeof window !== "undefined" && parsed.origin === window.location.origin;
            const steps: DiagnosticStep[] = [];

            // Step 1: direct browser fetch (just connectivity / CORS check)
            const t1 = Date.now();
            try {
                const res = await fetch(target, { method: "OPTIONS" });
                steps.push({
                    name: "Direct OPTIONS (CORS preflight)",
                    ok: true,
                    detail: `HTTP ${res.status}. CORS headers: Access-Control-Allow-Origin=${res.headers.get("access-control-allow-origin") || "(not set)"}`,
                    duration: Date.now() - t1,
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                steps.push({
                    name: "Direct OPTIONS (CORS preflight)",
                    ok: false,
                    detail: `${msg}${isLikelyCorsError(err) ? " — likely CORS or network failure" : ""}`,
                    duration: Date.now() - t1,
                });
            }

            // Step 2: direct browser POST with the real init request
            const t2 = Date.now();
            try {
                const res = await fetch(target, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jsonrpc: "2.0", id: 0, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "diagnose", version: "1.0" } } }),
                });
                steps.push({
                    name: "Direct POST initialize",
                    ok: res.ok,
                    detail: `HTTP ${res.status} ${res.statusText}`,
                    duration: Date.now() - t2,
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                steps.push({
                    name: "Direct POST initialize",
                    ok: false,
                    detail: msg + (isLikelyCorsError(err) ? " — likely CORS block" : ""),
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
                        url: target,
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ jsonrpc: "2.0", id: 0, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "diagnose", version: "1.0" } } }),
                        bodyIsBase64: false,
                        timeout: 10000,
                        followRedirects: true,
                        ...sslFields(config),
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

            // Recommendation
            const directOk = steps[1]?.ok;
            const proxyOk = steps[2]?.ok;
            let recommendation = "";
            if (directOk) {
                recommendation = "Direct connection works. Use 'Direct' or 'Direct (strict)' for the lowest latency.";
            } else if (proxyOk && !directOk) {
                recommendation = "Direct fetch is blocked (likely CORS). Use 'Via Server Proxy' for reliable access. To enable direct connections, configure your MCP server to send Access-Control-Allow-Origin: *.";
            } else if (!proxyOk) {
                recommendation = "Neither direct nor proxy could reach the server. Check the URL, that the server is running, and (if behind HTTPS) the SSL settings.";
            }

            setDiagnosticResult({ targetUrl: target, crossOrigin: !sameOrigin, steps, recommendation });
        } finally {
            setDiagnosing(false);
        }
    };

    // ── Call tool ─────────────────────────────────────────────────────

    const handleCall = async () => {
        if (!selectedTool) return;
        setCalling(true);
        setLastResult("");
        setLastError("");

        let parsedArgs: Record<string, unknown> = {};
        try {
            parsedArgs = JSON.parse(callArgs || "{}");
        } catch {
            setLastError("Invalid JSON in arguments");
            setCalling(false);
            return;
        }

        const start = Date.now();
        try {
            const headers: Record<string, string> = {};
            config.headers.filter(h => h.key).forEach(h => { headers[h.key] = h.value; });
            if (config.oauth.accessToken && !headers["Authorization"]) {
                headers["Authorization"] = `Bearer ${config.oauth.accessToken}`;
            }

            const url = config.serverUrl.trim();
            const effectiveTimeout = Math.min(config.requestTimeoutMs, config.maxTotalTimeoutMs);
            const result = await mcpFetch(
                url,
                headers,
                { jsonrpc: "2.0", id: Date.now(), method: "tools/call", params: { name: selectedTool.name, arguments: parsedArgs } },
                effectiveTimeout,
                sslFields(config),
                config.connectionMode,
                config.proxyAddress,
                config.proxySessionToken,
                sessionId,
            );
            if (result.usedProxy) setProxyInUse(true);
            if (result.sessionId && result.sessionId !== sessionId) setSessionId(result.sessionId);
            const json = result.data as any;

            const durationMs = Date.now() - start;

            if (json.error) {
                const errStr = JSON.stringify(json.error, null, 2);
                setLastError(errStr);
                pushHistory({ id: makeHistId(), ts: Date.now(), tool: selectedTool.name, args: callArgs, result: errStr, durationMs, error: true });
            } else {
                const resultStr = JSON.stringify(json.result, null, 2);
                setLastResult(resultStr);
                pushHistory({ id: makeHistId(), ts: Date.now(), tool: selectedTool.name, args: callArgs, result: resultStr, durationMs, error: false });
            }
        } catch (err: any) {
            const durationMs = Date.now() - start;
            setLastError(err.message);
            pushHistory({ id: makeHistId(), ts: Date.now(), tool: selectedTool.name, args: callArgs, result: err.message, durationMs, error: true });
        } finally {
            setCalling(false);
        }
    };

    // ── Auto-populate args scaffold from schema ───────────────────────
    const scaffoldArgs = (tool: McpTool) => {
        try {
            const props = (tool.inputSchema as any)?.properties || {};
            const scaffold: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(props)) {
                const vt = (v as any)?.type;
                scaffold[k] = vt === "number" || vt === "integer" ? 0 : vt === "boolean" ? false : "";
            }
            setCallArgs(JSON.stringify(scaffold, null, 2));
        } catch {
            setCallArgs("{}");
        }
    };

    const historyColumns: ColumnsType<CallHistoryEntry> = [
        {
            title: "Tool",
            dataIndex: "tool",
            width: 160,
            render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text>,
        },
        {
            title: "Duration",
            dataIndex: "durationMs",
            width: 80,
            render: (v: number) => <Text style={{ fontSize: 11 }}>{formatMs(v)}</Text>,
        },
        {
            title: "Status",
            dataIndex: "error",
            width: 70,
            render: (err: boolean) => err
                ? <Tag color="error" icon={<CloseCircleOutlined />}>Error</Tag>
                : <Tag color="success" icon={<CheckCircleOutlined />}>OK</Tag>,
        },
        {
            title: "Time",
            dataIndex: "ts",
            width: 80,
            render: (ts: number) => <Text type="secondary" style={{ fontSize: 10 }}>{new Date(ts).toLocaleTimeString()}</Text>,
        },
    ];

    return (
        <ToolPageLayout
            title="MCP Inspector"
            description="Test and inspect Model Context Protocol servers"
            icon={<ThunderboltOutlined style={{ fontSize: 24, color: "#6366f1" }} />}
            color="#6366f1"
            learnMore={{
                whatIs: "The MCP Inspector is a fully configurable client for the Model Context Protocol (MCP) — the open standard for connecting AI assistants to external tools and data sources. It connects to any MCP server over SSE or HTTP, lists all available tools, lets you call them interactively with auto-scaffolded arguments, and shows raw JSON-RPC 2.0 responses. For stdio-based servers it generates the exact CLI command to paste into your terminal. stdio config generates the equivalent CLI command.",
                whyUse: "MCP is the foundation for AI agent tooling. Use this inspector to develop and debug MCP server implementations, explore what tools a server exposes before wiring them into an agent, validate request/response shapes match your expectations, and diagnose CORS or connectivity issues before your agent goes live.",
                howToUse: [
                    "Choose a Transport: SSE (point at the /sse endpoint) or HTTP (streamable HTTP, typically /mcp) for browser connections; stdio generates a CLI command to run locally",
                    "Set the Connection Type to control CORS handling — 'Direct (auto-fallback)' tries a browser fetch and retries via server proxy on CORS failure; 'Direct (strict)' surfaces errors; 'Via Server Proxy' always routes via /api/proxy; 'Via MCP Proxy' tunnels through npx @modelcontextprotocol/inspector running locally",
                    "Click Diagnose to test direct fetch, CORS preflight, and proxy connectivity before committing to a connection",
                    "Open Authentication (collapsed by default) to add Custom Headers (Form or JSON), OAuth 2.0 client credentials, or paste an Access Token directly",
                    "Open Configuration to adjust request/max timeouts, task TTL, and Reset Timeout on Progress for long-running tools",
                    "For Via MCP Proxy: run 'npx @modelcontextprotocol/inspector' locally — it prints the proxy address and a session token; paste both in Configuration → Inspector Proxy",
                    "Click Connect to establish the session and load the tool list",
                    "Select a tool from the list — arguments are auto-scaffolded from its JSON Schema — fill them in, and click Call",
                    "View results in the JSON editor and expand History rows to compare args vs results across calls",
                ],
                tips: [
                    "SSE endpoint is usually /sse; HTTP endpoint is usually /mcp — check your server's README",
                    "Diagnose before Connect: it reveals exactly which step fails and recommends a Connection Type",
                    "CORS fallback tag (orange) means the browser was blocked — add 'Access-Control-Allow-Origin: *' to the server to remove the extra round-trip",
                    "Custom Headers accept 'Authorization: Bearer <token>' in Form or JSON mode — JSON auto-syncs back to the form",
                    "Via MCP Proxy uses dual auth: Bearer header + MCP_PROXY_AUTH_TOKEN query param to match the official inspector's authentication pattern",
                    "SSL options (CA bundle, client cert, mTLS key) force routing through the server-side proxy — the browser cannot handle custom TLS",
                    "Reset Timeout on Progress keeps long-running tools alive as long as the server streams progress events — useful for generation or search tools",
                    "Call history is persisted to localStorage (up to 100 entries) — expand any row to see the full args and result",
                ],
                useCases: [
                    "Debugging a custom MCP server implementation before deploying it to production",
                    "Exploring available tools on a third-party MCP server before wiring them into an AI agent",
                    "Validating that a server's input/output schemas match what your agent expects",
                    "Diagnosing CORS and proxy connectivity issues in CI or staging environments",
                    "Testing OAuth-protected MCP servers by pasting an access token directly",
                    "Connecting to MCP servers behind mTLS or custom CA certificates via the SSL/TLS panel",
                ],
                serverNotice: {
                    route: "proxy",
                    purpose: "MCP traffic goes directly from your browser to the MCP server. If the browser blocks the request with a CORS error, the inspector automatically retries through this app's server-side /api/proxy (Node.js), which is not subject to browser same-origin restrictions. A 'CORS fallback' badge (orange) appears when this happens; a 'via proxy' badge (cyan) appears when you explicitly chose Via Server Proxy.",
                    sentFields: [
                        "MCP server URL",
                        "Custom headers you configured (including any Authorization / Bearer tokens)",
                        "OAuth Access Token (sent as Authorization: Bearer header)",
                        "JSON-RPC 2.0 payload: initialize handshake, tools/list discovery, tools/call with your arguments",
                        "SSL/TLS fields when configured (CA bundle, client cert, client key — used server-side only)",
                    ],
                    extra: (
                        <Text style={{ fontSize: 12 }}>
                            <Text strong>To keep traffic 100% in-browser:</Text> configure your MCP server with{" "}
                            <Text code>Access-Control-Allow-Origin: *</Text> and{" "}
                            <Text code>Access-Control-Allow-Headers: Content-Type, Authorization</Text>.
                            Direct browser fetch will then succeed and no proxy badges will appear.
                        </Text>
                    ),
                },
            }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                tabBarExtraContent={
                    <Space>
                        {connected
                            ? <Badge status="success" text={<Text style={{ fontSize: 12, color: "#22c55e" }}>Connected</Text>} />
                            : <Badge status="default" text={<Text type="secondary" style={{ fontSize: 12 }}>Disconnected</Text>} />}
                        {connected && corsFallback && (
                            <Tooltip title="Browser direct fetch was blocked by CORS — auto-fell back to /api/proxy. Switch Connection Type to 'Via Server Proxy' to skip this fallback in future, or fix CORS on the agent.">
                                <Tag color="warning" style={{ fontSize: 11, margin: 0 }}>CORS fallback</Tag>
                            </Tooltip>
                        )}
                        {connected && proxyInUse && !corsFallback && (
                            <Tooltip title="Requests are being routed through this app's /api/proxy (chosen by your Connection Type or required by SSL config).">
                                <Tag color="cyan" style={{ fontSize: 11, margin: 0 }}>via proxy</Tag>
                            </Tooltip>
                        )}
                        {connected && (
                            <Button size="small" danger icon={<CloseCircleOutlined />} onClick={handleDisconnect}>
                                Disconnect
                            </Button>
                        )}
                    </Space>
                }
                items={[
                    // ── Connection tab ──────────────────────────────────────
                    {
                        key: "connect",
                        label: <><SettingOutlined /> Connection</>,
                        children: (
                            <Row gutter={[16, 16]}>
                                {/* Top: URL + Connection Type + Connect button */}
                                <Col xs={24}>
                                    <Card>
                                        <Form layout="vertical" size="small">
                                            <Row gutter={12}>
                                                <Col xs={24} md={6}>
                                                    <Form.Item label="Transport">
                                                        <Select
                                                            value={config.transport}
                                                            onChange={(v) => patchConfig({ transport: v })}
                                                            options={[
                                                                { label: "SSE", value: "sse" },
                                                                { label: "HTTP", value: "http" },
                                                                { label: "stdio (CLI)", value: "stdio" },
                                                            ]}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={config.transport === "stdio" ? 18 : 12}>
                                                    <Form.Item label={config.transport === "stdio" ? "Command + arguments" : config.transport === "sse" ? "SSE Server URL" : "HTTP Server URL"}>
                                                        {config.transport === "stdio" ? (
                                                            <Input.Group compact>
                                                                <Input
                                                                    value={config.command}
                                                                    onChange={e => patchConfig({ command: e.target.value })}
                                                                    placeholder="npx"
                                                                    style={{ width: "30%" }}
                                                                />
                                                                <Input
                                                                    value={config.args}
                                                                    onChange={e => patchConfig({ args: e.target.value })}
                                                                    placeholder="-y @modelcontextprotocol/server-everything"
                                                                    style={{ width: "70%" }}
                                                                />
                                                            </Input.Group>
                                                        ) : (
                                                            <Input
                                                                value={config.serverUrl}
                                                                onChange={e => patchConfig({ serverUrl: e.target.value })}
                                                                placeholder={config.transport === "sse" ? "http://localhost:3001/sse" : "http://localhost:3001/mcp"}
                                                                prefix={<ApiOutlined />}
                                                            />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                {config.transport !== "stdio" && (
                                                    <Col xs={24} md={6}>
                                                        <Form.Item
                                                            label={
                                                                <Space>
                                                                    Connection Type
                                                                    <Tooltip
                                                                        title={
                                                                            <div style={{ fontSize: 12 }}>
                                                                                <div><b>Direct (auto-fallback):</b> browser → MCP server. If a CORS error occurs, automatically retries through this app&apos;s /api/proxy.</div>
                                                                                <div style={{ marginTop: 4 }}><b>Direct (strict):</b> direct only — surfaces CORS errors instead of falling back. Useful for debugging CORS configuration on the agent.</div>
                                                                                <div style={{ marginTop: 4 }}><b>Via Server Proxy:</b> always routes through /api/proxy. Bypasses browser CORS entirely; required for SSL/TLS options.</div>
                                                                                <div style={{ marginTop: 4 }}><b>Via MCP Proxy:</b> tunnels through the user-run <code>npx @modelcontextprotocol/inspector</code> proxy at the configured address (with session token).</div>
                                                                            </div>
                                                                        }
                                                                    >
                                                                        <InfoCircleOutlined style={{ color: "#9a9a9a" }} />
                                                                    </Tooltip>
                                                                </Space>
                                                            }
                                                        >
                                                            <Select
                                                                value={config.connectionMode}
                                                                onChange={(v) => patchConfig({ connectionMode: v })}
                                                                options={[
                                                                    { label: "Direct (auto-fallback)", value: "direct" },
                                                                    { label: "Direct (strict)", value: "direct-strict" },
                                                                    { label: "Via Server Proxy", value: "via-server-proxy" },
                                                                    { label: "Via MCP Proxy", value: "via-mcp-proxy" },
                                                                ]}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                )}
                                            </Row>
                                            <Space.Compact block>
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    icon={connecting ? <ReloadOutlined spin /> : <PlayCircleOutlined />}
                                                    onClick={handleConnect}
                                                    loading={connecting}
                                                    disabled={connected}
                                                    style={{ background: "#6366f1", borderColor: "#6366f1", flex: 1 }}
                                                >
                                                    {config.transport === "stdio" ? "Generate CLI Command" : connecting ? "Connecting…" : "Connect"}
                                                </Button>
                                                {config.transport !== "stdio" && (
                                                    <Tooltip title="Test connectivity to the server: tries direct fetch, CORS preflight, and the server proxy. Recommends a Connection Type based on the results.">
                                                        <Button
                                                            size="large"
                                                            icon={<ExperimentOutlined />}
                                                            onClick={handleDiagnose}
                                                            loading={diagnosing}
                                                        >
                                                            Diagnose
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                            </Space.Compact>
                                            {diagnosticResult && (
                                                <Alert
                                                    type={diagnosticResult.steps.some(s => s.ok) ? "info" : "error"}
                                                    closable
                                                    onClose={() => setDiagnosticResult(null)}
                                                    style={{ marginTop: 12 }}
                                                    message={
                                                        <Space>
                                                            <Text strong>Connection Diagnostic</Text>
                                                            {diagnosticResult.crossOrigin
                                                                ? <Tag color="orange">cross-origin</Tag>
                                                                : <Tag color="green">same-origin</Tag>}
                                                        </Space>
                                                    }
                                                    description={
                                                        <Space orientation="vertical" size={6} style={{ width: "100%" }}>
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
                                            {config.transport === "stdio" && (
                                                <div style={{ marginTop: 12 }}>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>Generated command (run in your terminal):</Text>
                                                    <Input.TextArea
                                                        value={buildCliCommand(config)}
                                                        readOnly
                                                        rows={2}
                                                        style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, marginTop: 4 }}
                                                    />
                                                    <Button
                                                        size="small"
                                                        icon={<CopyOutlined />}
                                                        style={{ marginTop: 4 }}
                                                        onClick={() => { navigator.clipboard.writeText(buildCliCommand(config)); message.success("Copied!"); }}
                                                    >
                                                        Copy command
                                                    </Button>
                                                </div>
                                            )}
                                        </Form>
                                    </Card>
                                </Col>

                                {/* Authentication + Configuration + SSL — collapsible panels */}
                                <Col xs={24}>
                                    <Collapse
                                        items={[
                                            {
                                                key: "auth",
                                                label: (
                                                    <Space>
                                                        <KeyOutlined />
                                                        <Text strong>Authentication</Text>
                                                        {config.headers.filter(h => h.key.trim()).length > 0 && (
                                                            <Tag color="purple">{config.headers.filter(h => h.key.trim()).length} header(s)</Tag>
                                                        )}
                                                        {config.oauth.accessToken && <Tag color="gold">OAuth token</Tag>}
                                                    </Space>
                                                ),
                                                children: (
                                                    <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                                                        {/* Custom Headers */}
                                                        <div>
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                                                <Text strong style={{ fontSize: 13 }}>Custom Headers</Text>
                                                                <Segmented
                                                                    size="small"
                                                                    value={headerMode}
                                                                    onChange={(v) => switchHeaderMode(v as "form" | "json")}
                                                                    options={[
                                                                        { label: "Form", value: "form" },
                                                                        { label: "JSON", value: "json" },
                                                                    ]}
                                                                />
                                                            </div>
                                                            {headerMode === "form" ? (
                                                                <>
                                                                    {config.headers.map(h => (
                                                                        <Row gutter={8} key={h.id} style={{ marginBottom: 6 }}>
                                                                            <Col span={10}>
                                                                                <Input placeholder="Header name" value={h.key} onChange={e => updateHeader(h.id, "key", e.target.value)} />
                                                                            </Col>
                                                                            <Col span={12}>
                                                                                <Input placeholder="Value" value={h.value} onChange={e => updateHeader(h.id, "value", e.target.value)} />
                                                                            </Col>
                                                                            <Col span={2}>
                                                                                <Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeHeader(h.id)} />
                                                                            </Col>
                                                                        </Row>
                                                                    ))}
                                                                    <Button size="small" icon={<PlusOutlined />} onClick={addHeader}>
                                                                        Add header
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <div>
                                                                    <TextArea
                                                                        value={headerJson}
                                                                        onChange={e => {
                                                                            setHeaderJson(e.target.value);
                                                                            const parsed = jsonToHeaders(e.target.value);
                                                                            if (parsed !== null) patchConfig({ headers: parsed });
                                                                        }}
                                                                        rows={5}
                                                                        style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12 }}
                                                                        placeholder={'{\n  "Authorization": "Bearer xxx"\n}'}
                                                                    />
                                                                    <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: "block" }}>
                                                                        JSON object — auto-syncs to form when valid
                                                                    </Text>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <Divider style={{ margin: "0" }} />

                                                        {/* OAuth 2.0 Flow */}
                                                        <div>
                                                            <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
                                                                <Space>
                                                                    OAuth 2.0 Flow
                                                                    <Tooltip title="When an access token is set it will be sent as 'Authorization: Bearer <token>'. Other fields are stored for documentation; full browser-side OAuth requires server-side token exchange.">
                                                                        <InfoCircleOutlined style={{ color: "#9a9a9a" }} />
                                                                    </Tooltip>
                                                                </Space>
                                                            </Text>
                                                            <Form layout="vertical" size="small">
                                                                <Row gutter={8}>
                                                                    <Col xs={24} md={12}>
                                                                        <Form.Item label="Client ID">
                                                                            <Input
                                                                                value={config.oauth.clientId}
                                                                                onChange={e => patchConfig({ oauth: { ...config.oauth, clientId: e.target.value } })}
                                                                                placeholder="Client ID"
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xs={24} md={12}>
                                                                        <Form.Item label="Client Secret (optional)">
                                                                            <Input.Password
                                                                                value={config.oauth.clientSecret}
                                                                                onChange={e => patchConfig({ oauth: { ...config.oauth, clientSecret: e.target.value } })}
                                                                                placeholder="Client Secret"
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Row gutter={8}>
                                                                    <Col xs={24} md={12}>
                                                                        <Form.Item label="Redirect URL">
                                                                            <Input
                                                                                value={config.oauth.redirectUrl}
                                                                                onChange={e => patchConfig({ oauth: { ...config.oauth, redirectUrl: e.target.value } })}
                                                                                placeholder="http://localhost:3000/oauth/callback"
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col xs={24} md={12}>
                                                                        <Form.Item label="Scope (space-separated)">
                                                                            <Input
                                                                                value={config.oauth.scope}
                                                                                onChange={e => patchConfig({ oauth: { ...config.oauth, scope: e.target.value } })}
                                                                                placeholder="read write"
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Form.Item label="Token URL (optional)">
                                                                    <Input
                                                                        value={config.oauth.tokenUrl}
                                                                        onChange={e => patchConfig({ oauth: { ...config.oauth, tokenUrl: e.target.value } })}
                                                                        placeholder="https://auth.example.com/oauth/token"
                                                                    />
                                                                </Form.Item>
                                                                <Form.Item label="Access Token">
                                                                    <Input.Password
                                                                        value={config.oauth.accessToken}
                                                                        onChange={e => patchConfig({ oauth: { ...config.oauth, accessToken: e.target.value } })}
                                                                        placeholder="Paste a pre-obtained access token"
                                                                    />
                                                                </Form.Item>
                                                            </Form>
                                                        </div>
                                                    </Space>
                                                ),
                                            },
                                            {
                                                key: "config",
                                                label: (
                                                    <Space>
                                                        <SettingOutlined />
                                                        <Text strong>Configuration</Text>
                                                        <Tag>{formatMs(config.requestTimeoutMs)}</Tag>
                                                    </Space>
                                                ),
                                                children: (
                                                    <Form layout="vertical" size="small">
                                                        <Row gutter={12}>
                                                            <Col xs={24} md={8}>
                                                                <Form.Item label={`Request Timeout (${formatMs(config.requestTimeoutMs)})`}>
                                                                    <InputNumber
                                                                        value={config.requestTimeoutMs}
                                                                        onChange={v => patchConfig({ requestTimeoutMs: v || 30000 })}
                                                                        min={1000} max={300000} step={1000}
                                                                        style={{ width: "100%" }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col xs={24} md={8}>
                                                                <Form.Item label={`Max Total Timeout (${formatMs(config.maxTotalTimeoutMs)})`}>
                                                                    <InputNumber
                                                                        value={config.maxTotalTimeoutMs}
                                                                        onChange={v => patchConfig({ maxTotalTimeoutMs: v || 120000 })}
                                                                        min={1000} max={3600000} step={5000}
                                                                        style={{ width: "100%" }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col xs={24} md={8}>
                                                                <Form.Item label={`Task TTL (${formatMs(config.taskTtlMs)})`}>
                                                                    <InputNumber
                                                                        value={config.taskTtlMs}
                                                                        onChange={v => patchConfig({ taskTtlMs: v || 300000 })}
                                                                        min={1000} max={86400000} step={60000}
                                                                        style={{ width: "100%" }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Form.Item>
                                                            <Space>
                                                                <Switch
                                                                    checked={config.resetTimeoutOnProgress}
                                                                    onChange={v => patchConfig({ resetTimeoutOnProgress: v })}
                                                                    size="small"
                                                                />
                                                                <Text style={{ fontSize: 12 }}>Reset timeout on progress</Text>
                                                                <Tooltip title="When the server emits progress notifications during a long-running tool call, restart the request timer.">
                                                                    <InfoCircleOutlined style={{ color: "#9a9a9a" }} />
                                                                </Tooltip>
                                                            </Space>
                                                        </Form.Item>

                                                        <Divider style={{ margin: "12px 0" }}>Inspector Proxy (only used when Connection Type = "Via MCP Proxy")</Divider>
                                                        <Alert
                                                            type="info"
                                                            showIcon
                                                            message="Run the official inspector locally to get these values"
                                                            description={
                                                                <div>
                                                                    <Text code style={{ fontSize: 11 }}>npx @modelcontextprotocol/inspector</Text>
                                                                    <Text style={{ fontSize: 11, display: "block", marginTop: 4 }}>
                                                                        It will print the proxy address (default <Text code>http://localhost:6277</Text>) and a session token. Paste both below.
                                                                    </Text>
                                                                </div>
                                                            }
                                                            style={{ marginBottom: 12, fontSize: 12 }}
                                                        />
                                                        <Row gutter={12}>
                                                            <Col xs={24} md={12}>
                                                                <Form.Item
                                                                    label={
                                                                        <Space>
                                                                            Inspector Proxy Address
                                                                            <Tooltip title="Set this if you are running the MCP Inspector Proxy on a non-default address. Example: http://10.1.1.22:5577">
                                                                                <InfoCircleOutlined style={{ color: "#9a9a9a" }} />
                                                                            </Tooltip>
                                                                        </Space>
                                                                    }
                                                                >
                                                                    <Input
                                                                        value={config.proxyAddress}
                                                                        onChange={e => patchConfig({ proxyAddress: e.target.value })}
                                                                        placeholder="http://localhost:6277"
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col xs={24} md={12}>
                                                                <Form.Item
                                                                    label={
                                                                        <Space>
                                                                            Proxy Session Token
                                                                            <Tooltip title="Session token for authenticating with the MCP Proxy Server (displayed in proxy console on startup as 🔑 Session token: ...)">
                                                                                <InfoCircleOutlined style={{ color: "#9a9a9a" }} />
                                                                            </Tooltip>
                                                                        </Space>
                                                                    }
                                                                >
                                                                    <Input.Password
                                                                        value={config.proxySessionToken}
                                                                        onChange={e => patchConfig({ proxySessionToken: e.target.value })}
                                                                        placeholder="c97d7ad9f3e400c68fa443eeb076d944..."
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                ),
                                            },
                                            {
                                                key: "ssl",
                                                label: (
                                                    <Space>
                                                        <SafetyCertificateOutlined />
                                                        <Text strong>SSL / TLS</Text>
                                                        {(config.sslVerify || config.sslCaCert.trim() || config.sslClientCert.trim()) && (
                                                            <Tag color="orange">configured</Tag>
                                                        )}
                                                    </Space>
                                                ),
                                                children: (
                                                    <SslConfigSection
                                                        value={{
                                                            sslVerify: config.sslVerify,
                                                            sslCaCert: config.sslCaCert,
                                                            sslClientCert: config.sslClientCert,
                                                            sslClientKey: config.sslClientKey,
                                                        }}
                                                        onChange={(next: SslConfig) => patchConfig(next)}
                                                    />
                                                ),
                                            },
                                        ]}
                                    />
                                </Col>
                            </Row>
                        ),
                    },

                    // ── Tools tab ───────────────────────────────────────────
                    {
                        key: "tools",
                        label: (
                            <Space size={4}>
                                <CodeOutlined />
                                Tools
                                {tools.length > 0 && <Badge count={tools.length} size="small" color="#6366f1" />}
                            </Space>
                        ),
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={8}>
                                    <Card
                                        size="small"
                                        title={
                                            <Space>
                                                <ApiOutlined style={{ color: "#6366f1" }} />
                                                <Text>Available Tools</Text>
                                                {tools.length > 0 && <Tag>{tools.length}</Tag>}
                                            </Space>
                                        }
                                    >
                                        {!connected ? (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Not connected" />
                                        ) : tools.length === 0 ? (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No tools found" />
                                        ) : (
                                            <div style={{ maxHeight: 480, overflowY: "auto" }}>
                                                {tools.map(tool => (
                                                    <div
                                                        key={tool.name}
                                                        onClick={() => { setSelectedTool(tool); scaffoldArgs(tool); }}
                                                        style={{
                                                            padding: "8px 12px",
                                                            cursor: "pointer",
                                                            borderRadius: 6,
                                                            marginBottom: 4,
                                                            background: selectedTool?.name === tool.name
                                                                ? (darkMode ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)")
                                                                : "transparent",
                                                            border: selectedTool?.name === tool.name
                                                                ? "1px solid rgba(99,102,241,0.4)"
                                                                : "1px solid transparent",
                                                        }}
                                                    >
                                                        <Text code style={{ fontSize: 12 }}>{tool.name}</Text>
                                                        {tool.description && (
                                                            <div>
                                                                <Text type="secondary" style={{ fontSize: 11 }}>{tool.description}</Text>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Card>
                                </Col>

                                <Col xs={24} lg={16}>
                                    {selectedTool ? (
                                        <>
                                            <Card
                                                size="small"
                                                title={
                                                    <Space>
                                                        <ThunderboltOutlined style={{ color: "#6366f1" }} />
                                                        <Text code>{selectedTool.name}</Text>
                                                    </Space>
                                                }
                                                extra={
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        icon={calling ? <ReloadOutlined spin /> : <PlayCircleOutlined />}
                                                        onClick={handleCall}
                                                        loading={calling}
                                                        disabled={!connected}
                                                        style={{ background: "#6366f1", borderColor: "#6366f1" }}
                                                    >
                                                        Call
                                                    </Button>
                                                }
                                            >
                                                {selectedTool.description && (
                                                    <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>
                                                        {selectedTool.description}
                                                    </Paragraph>
                                                )}

                                                <Text style={{ display: "block", marginBottom: 4, fontSize: 12 }} strong>
                                                    Arguments (JSON)
                                                </Text>
                                                <CodeEditor
                                                    value={callArgs}
                                                    onChange={v => setCallArgs(v || "{}")}
                                                    language="json"
                                                    height={140}
                                                />

                                                {selectedTool.inputSchema && (
                                                    <Collapse
                                                        size="small"
                                                        style={{ marginTop: 8 }}
                                                        items={[{
                                                            key: "schema",
                                                            label: <Text style={{ fontSize: 11 }}>Input Schema</Text>,
                                                            children: (
                                                                <pre style={{ fontSize: 10, margin: 0, overflow: "auto", maxHeight: 160 }}>
                                                                    {JSON.stringify(selectedTool.inputSchema, null, 2)}
                                                                </pre>
                                                            ),
                                                        }]}
                                                    />
                                                )}
                                            </Card>

                                            {(lastResult || lastError) && (
                                                <Card
                                                    size="small"
                                                    title={
                                                        <Space>
                                                            {lastError
                                                                ? <CloseCircleOutlined style={{ color: "#ef4444" }} />
                                                                : <CheckCircleOutlined style={{ color: "#22c55e" }} />}
                                                            <Text>{lastError ? "Error" : "Result"}</Text>
                                                        </Space>
                                                    }
                                                    style={{ marginTop: 8 }}
                                                    extra={
                                                        <Button
                                                            size="small"
                                                            icon={<CopyOutlined />}
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(lastResult || lastError);
                                                                message.success("Copied!");
                                                            }}
                                                        />
                                                    }
                                                >
                                                    <CodeEditor
                                                        value={lastResult || lastError}
                                                        language="json"
                                                        height={200}
                                                        readOnly
                                                    />
                                                </Card>
                                            )}
                                        </>
                                    ) : (
                                        <Card>
                                            <Empty
                                                description={connected ? "Select a tool to call it" : "Connect to a server first"}
                                            />
                                        </Card>
                                    )}
                                </Col>
                            </Row>
                        ),
                    },

                    // ── History tab ────────────────────────────────────────
                    {
                        key: "history",
                        label: (
                            <Space size={4}>
                                <HistoryOutlined />
                                History
                                {history.length > 0 && <Badge count={history.length} size="small" color="#6366f1" overflowCount={99} />}
                            </Space>
                        ),
                        children: (
                            <Card
                                title={
                                    <Space>
                                        <HistoryOutlined style={{ color: "#6366f1" }} />
                                        Call History
                                    </Space>
                                }
                                extra={
                                    history.length > 0 && (
                                        <Button
                                            size="small"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => {
                                                setHistory([]);
                                                try { localStorage.removeItem("mcp-inspector-history"); } catch {}
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    )
                                }
                            >
                                {history.length === 0 ? (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No calls yet" />
                                ) : (
                                    <Table<CallHistoryEntry>
                                        columns={historyColumns}
                                        dataSource={history}
                                        rowKey="id"
                                        size="small"
                                        pagination={{ pageSize: 20, showSizeChanger: false }}
                                        expandable={{
                                            expandedRowRender: (record) => (
                                                <Row gutter={8}>
                                                    <Col span={12}>
                                                        <Text style={{ fontSize: 11 }} strong>Args</Text>
                                                        <pre style={{ fontSize: 10, maxHeight: 120, overflow: "auto", marginTop: 4 }}>{record.args}</pre>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text style={{ fontSize: 11 }} strong>Result</Text>
                                                        <pre style={{ fontSize: 10, maxHeight: 120, overflow: "auto", marginTop: 4 }}>{record.result}</pre>
                                                    </Col>
                                                </Row>
                                            ),
                                        }}
                                    />
                                )}
                            </Card>
                        ),
                    },
                ]}
            />
        </ToolPageLayout>
    );
}

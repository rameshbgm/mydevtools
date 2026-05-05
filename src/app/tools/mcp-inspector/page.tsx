"use client";

import React, { useState, useCallback } from "react";
import {
    Card, Input, Button, Typography, Row, Col, Space, Tabs, Tag,
    Select, Switch, InputNumber, Table, Collapse, Alert, Empty,
    Divider, Tooltip, Badge, Form, Spin,
} from "antd";
import {
    ApiOutlined, PlayCircleOutlined, CopyOutlined, DeleteOutlined,
    PlusOutlined, SettingOutlined, HistoryOutlined, ThunderboltOutlined,
    CloseCircleOutlined, CheckCircleOutlined, ClockCircleOutlined,
    CodeOutlined, ReloadOutlined,
} from "@ant-design/icons";
import { messageService as message } from "@/lib/messageService";
import { useAppStore } from "@/lib/store";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import type { ColumnsType } from "antd/es/table/interface";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// ─── Types ────────────────────────────────────────────────────────────

type TransportType = "stdio" | "sse" | "http";

interface McpHeader { key: string; value: string; id: string; }

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
}

const DEFAULT_CONFIG: McpConfig = {
    transport: "sse",
    command: "npx",
    args: "-y @modelcontextprotocol/server-everything",
    serverEntry: "",
    serverUrl: "http://localhost:3001/sse",
    headers: [],
    requestTimeoutMs: 30000,
    maxTotalTimeoutMs: 120000,
    resetTimeoutOnProgress: true,
    proxyAddress: "http://localhost:3000",
    proxySessionToken: "",
    taskTtlMs: 300000,
};

// ─── Helpers ──────────────────────────────────────────────────────────

let hdrIdCounter = 0;
let histIdCounter = 0;

function makeHeaderId() { return String(++hdrIdCounter); }
function makeHistId() { return String(++histIdCounter); }

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

async function mcpFetch(
    url: string,
    headers: Record<string, string>,
    body: unknown,
    timeoutMs: number,
): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    try {
        res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: controller.signal,
        });
    } catch (err: any) {
        clearTimeout(timer);
        if (err?.name === "AbortError") throw new Error(`Request timed out after ${timeoutMs}ms`);
        const msg = err?.message || String(err);
        if (msg.toLowerCase().includes("failed to fetch") || msg.toLowerCase().includes("cors")) {
            throw new Error(
                `${msg}\n\nCORS tip: start your MCP server with CORS headers enabled, e.g.:\n  Access-Control-Allow-Origin: *\n  Access-Control-Allow-Headers: Content-Type`,
            );
        }
        throw err;
    }
    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
    }
}

// ─── Component ───────────────────────────────────────────────────────

export default function McpInspectorPage() {
    const { darkMode } = useAppStore();

    const [config, setConfig] = useState<McpConfig>(() => {
        try {
            const saved = typeof window !== "undefined" ? localStorage.getItem("mcp-inspector-config") : null;
            if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
        } catch {}
        return DEFAULT_CONFIG;
    });

    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
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
        setTools([]);
        setSelectedTool(null);
        setLastResult("");
        setLastError("");

        try {
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            config.headers.filter(h => h.key).forEach(h => { headers[h.key] = h.value; });
            if (config.proxySessionToken) headers["x-session-token"] = config.proxySessionToken;

            const base = config.transport === "sse"
                ? config.serverUrl.replace(/\/sse$/, "")
                : config.serverUrl.replace(/\/$/, "");

            if (config.transport === "sse") {
                // initialize handshake
                await mcpFetch(`${base}/`, headers,
                    { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "mydevtools-mcp-inspector", version: "1.3" } } },
                    config.requestTimeoutMs,
                );
                // tools/list
                const listJson = await mcpFetch(`${base}/`, headers,
                    { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
                    config.requestTimeoutMs,
                ) as any;
                setTools(listJson?.result?.tools || []);
            } else {
                const listJson = await mcpFetch(`${base}/`, headers,
                    { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} },
                    config.requestTimeoutMs,
                ) as any;
                setTools(listJson?.result?.tools || []);
            }

            setConnected(true);
            setActiveTab("tools");
            message.success("Connected — tool list loaded");
        } catch (err: any) {
            setLastError(err.message);
            message.error("Connection failed: " + err.message);
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = () => {
        setConnected(false);
        setTools([]);
        setSelectedTool(null);
        message.info("Disconnected");
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
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            config.headers.filter(h => h.key).forEach(h => { headers[h.key] = h.value; });
            if (config.proxySessionToken) headers["x-session-token"] = config.proxySessionToken;

            const base = config.transport === "sse"
                ? config.serverUrl.replace(/\/sse$/, "")
                : config.serverUrl.replace(/\/$/, "");

            const effectiveTimeout = Math.min(config.requestTimeoutMs, config.maxTotalTimeoutMs);
            const json = await mcpFetch(
                `${base}/`,
                headers,
                { jsonrpc: "2.0", id: Date.now(), method: "tools/call", params: { name: selectedTool.name, arguments: parsedArgs } },
                effectiveTimeout,
            ) as any;

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
                whatIs: "The MCP Inspector connects to any Model Context Protocol server and lets you browse its tools, call them interactively, and inspect raw JSON-RPC 2.0 responses. Supports SSE and HTTP transports directly from the browser; stdio config generates the equivalent CLI command.",
                whyUse: "MCP is the open standard for connecting AI assistants to data sources and tools. Use this inspector to debug server implementations, explore available tools before wiring them into an agent, and validate request/response shapes.",
                howToUse: [
                    "Choose a transport (SSE or HTTP for browser use; stdio generates a CLI command)",
                    "Enter the server URL and configure timeouts, headers, and proxy options",
                    "Click Connect to fetch the tool list",
                    "Select a tool, fill in arguments (auto-scaffolded from the schema), and click Call",
                    "Review results and call history; all settings and history persist across page reloads",
                ],
                tips: [
                    "SSE transport: point at the /sse endpoint of an MCP server running locally",
                    "HTTP transport: use the streamable-HTTP endpoint (typically /mcp)",
                    "If you see a CORS error, start your MCP server with Access-Control-Allow-Origin: * headers",
                    "Custom headers are useful for bearer tokens or API keys required by the server",
                    "Reset Timeout on Progress: keeps long-running tools alive as long as they stream progress events",
                ],
                useCases: [
                    "Debugging a custom MCP server implementation before deploying it",
                    "Exploring available tools on a third-party MCP server",
                    "Validating input/output schemas match what your agent expects",
                    "Stress-testing timeout and progress-reset behaviour",
                ],
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
                                <Col xs={24} lg={14}>
                                    <Card title="Transport & Server">
                                        <Form layout="vertical" size="small">
                                            <Form.Item label="Transport">
                                                <Select
                                                    value={config.transport}
                                                    onChange={(v) => patchConfig({ transport: v })}
                                                    options={[
                                                        { label: "SSE (Server-Sent Events)", value: "sse" },
                                                        { label: "HTTP (Streamable HTTP)", value: "http" },
                                                        { label: "stdio (CLI — generates command)", value: "stdio" },
                                                    ]}
                                                />
                                            </Form.Item>

                                            {config.transport === "stdio" ? (
                                                <>
                                                    <Row gutter={8}>
                                                        <Col span={8}>
                                                            <Form.Item label="Command">
                                                                <Input value={config.command} onChange={e => patchConfig({ command: e.target.value })} placeholder="npx" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={16}>
                                                            <Form.Item label="Arguments">
                                                                <Input value={config.args} onChange={e => patchConfig({ args: e.target.value })} placeholder="-y @modelcontextprotocol/server-everything" />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Form.Item label="Server Entry (optional path after args)">
                                                        <Input value={config.serverEntry} onChange={e => patchConfig({ serverEntry: e.target.value })} placeholder="./dist/index.js" />
                                                    </Form.Item>
                                                    <Form.Item label="Generated CLI command">
                                                        <Input.TextArea
                                                            value={buildCliCommand(config)}
                                                            readOnly
                                                            rows={2}
                                                            style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11 }}
                                                        />
                                                        <Button
                                                            size="small"
                                                            icon={<CopyOutlined />}
                                                            style={{ marginTop: 4 }}
                                                            onClick={() => { navigator.clipboard.writeText(buildCliCommand(config)); message.success("Copied!"); }}
                                                        >
                                                            Copy command
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            ) : (
                                                <Form.Item label={config.transport === "sse" ? "SSE Server URL" : "HTTP Server URL"}>
                                                    <Input
                                                        value={config.serverUrl}
                                                        onChange={e => patchConfig({ serverUrl: e.target.value })}
                                                        placeholder={config.transport === "sse" ? "http://localhost:3001/sse" : "http://localhost:3001/mcp"}
                                                        prefix={<ApiOutlined />}
                                                    />
                                                </Form.Item>
                                            )}

                                            <Divider style={{ margin: "8px 0" }}>Custom Headers</Divider>
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
                                            <Button size="small" icon={<PlusOutlined />} onClick={addHeader} style={{ marginBottom: 8 }}>
                                                Add header
                                            </Button>
                                        </Form>
                                    </Card>
                                </Col>

                                <Col xs={24} lg={10}>
                                    <Card title="Timeouts & Proxy">
                                        <Form layout="vertical" size="small">
                                            <Form.Item label={`Request Timeout (${formatMs(config.requestTimeoutMs)})`}>
                                                <InputNumber
                                                    value={config.requestTimeoutMs}
                                                    onChange={v => patchConfig({ requestTimeoutMs: v || 30000 })}
                                                    min={1000} max={300000} step={1000}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                            <Form.Item label={`Max Total Timeout (${formatMs(config.maxTotalTimeoutMs)})`}>
                                                <InputNumber
                                                    value={config.maxTotalTimeoutMs}
                                                    onChange={v => patchConfig({ maxTotalTimeoutMs: v || 120000 })}
                                                    min={1000} max={3600000} step={5000}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                            <Form.Item label={`Task TTL (${formatMs(config.taskTtlMs)})`}>
                                                <InputNumber
                                                    value={config.taskTtlMs}
                                                    onChange={v => patchConfig({ taskTtlMs: v || 300000 })}
                                                    min={1000} max={86400000} step={60000}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Space>
                                                    <Switch
                                                        checked={config.resetTimeoutOnProgress}
                                                        onChange={v => patchConfig({ resetTimeoutOnProgress: v })}
                                                        size="small"
                                                    />
                                                    <Text style={{ fontSize: 12 }}>Reset timeout on progress</Text>
                                                </Space>
                                            </Form.Item>
                                            <Divider style={{ margin: "8px 0" }}>Inspector Proxy</Divider>
                                            <Form.Item label="Proxy Address">
                                                <Input
                                                    value={config.proxyAddress}
                                                    onChange={e => patchConfig({ proxyAddress: e.target.value })}
                                                    placeholder="http://localhost:3000"
                                                />
                                            </Form.Item>
                                            <Form.Item label="Proxy Session Token">
                                                <Input.Password
                                                    value={config.proxySessionToken}
                                                    onChange={e => patchConfig({ proxySessionToken: e.target.value })}
                                                    placeholder="Optional session token"
                                                />
                                            </Form.Item>
                                        </Form>
                                    </Card>

                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        icon={connecting ? <ReloadOutlined spin /> : <PlayCircleOutlined />}
                                        onClick={handleConnect}
                                        loading={connecting}
                                        disabled={connected}
                                        style={{ marginTop: 16, background: "#6366f1", borderColor: "#6366f1" }}
                                    >
                                        {config.transport === "stdio" ? "Generate CLI Command" : connecting ? "Connecting…" : "Connect"}
                                    </Button>
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

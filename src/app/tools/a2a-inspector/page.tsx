"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
    Card, Input, Button, Typography, Row, Col, Space, Tabs, Tag,
    Alert, Empty, Divider, Badge, Descriptions, List, Spin, Tooltip,
} from "antd";
import {
    RobotOutlined, SendOutlined, CopyOutlined, DeleteOutlined,
    CheckCircleOutlined, CloseCircleOutlined, WarningOutlined,
    LinkOutlined, BugOutlined, InfoCircleOutlined, ReloadOutlined,
    UserOutlined, ApiOutlined,
} from "@ant-design/icons";
import { messageService as message } from "@/lib/messageService";
import { useAppStore } from "@/lib/store";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text, Paragraph } = Typography;

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

interface AgentCapabilities {
    streaming?: boolean;
    pushNotifications?: boolean;
    stateTransitionHistory?: boolean;
}

interface AgentCard {
    name: string;
    description?: string;
    url: string;
    version?: string;
    documentationUrl?: string;
    capabilities?: AgentCapabilities;
    skills?: AgentSkill[];
    defaultInputModes?: string[];
    defaultOutputModes?: string[];
    provider?: { organization: string; url?: string };
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
    raw?: unknown;
    error?: boolean;
}

interface DebugEntry {
    id: string;
    ts: number;
    direction: "out" | "in";
    method: string;
    payload: unknown;
    error?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────

let msgIdCounter = 0;
let dbgIdCounter = 0;
let rpcIdCounter = 0;

const makeMsgId = () => String(++msgIdCounter);
const makeDbgId = () => String(++dbgIdCounter);
const makeRpcId = () => ++rpcIdCounter;

function checkCompliance(card: AgentCard): ComplianceCheck[] {
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
        if (!skill.id) checks.push({ field: `skills[].id`, status: "error", note: `Skill missing required 'id' field` });
        if (!skill.name) checks.push({ field: `skills[].name`, status: "error", note: `Skill missing required 'name' field` });
    }

    checks.push(card.capabilities
        ? { field: "capabilities", status: "ok", note: JSON.stringify(card.capabilities) }
        : { field: "capabilities", status: "warn", note: "Not declared — capabilities unknown to clients" });

    checks.push(card.defaultInputModes?.length
        ? { field: "defaultInputModes", status: "ok", note: card.defaultInputModes.join(", ") }
        : { field: "defaultInputModes", status: "warn", note: "Not declared" });

    checks.push(card.defaultOutputModes?.length
        ? { field: "defaultOutputModes", status: "ok", note: card.defaultOutputModes.join(", ") }
        : { field: "defaultOutputModes", status: "warn", note: "Not declared" });

    return checks;
}

// ─── Component ───────────────────────────────────────────────────────

export default function A2aInspectorPage() {
    const { darkMode } = useAppStore();

    const [agentUrl, setAgentUrl] = useState(() => {
        try {
            return (typeof window !== "undefined" ? localStorage.getItem("a2a-inspector-url") : null) || "http://localhost:10000";
        } catch { return "http://localhost:10000"; }
    });
    const [agentCard, setAgentCard] = useState<AgentCard | null>(null);
    const [cardJson, setCardJson] = useState("");
    const [loadingCard, setLoadingCard] = useState(false);
    const [cardError, setCardError] = useState("");
    const [compliance, setCompliance] = useState<ComplianceCheck[]>([]);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [sending, setSending] = useState(false);

    const [debugLog, setDebugLog] = useState<DebugEntry[]>([]);

    const [activeTab, setActiveTab] = useState("card");
    const chatBottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const pushDebug = useCallback((entry: Omit<DebugEntry, "id" | "ts">) => {
        setDebugLog(prev => [{ ...entry, id: makeDbgId(), ts: Date.now() }, ...prev].slice(0, 200));
    }, []);

    const baseUrl = agentUrl.replace(/\/$/, "");

    // ── Fetch Agent Card ──────────────────────────────────────────────

    const fetchAgentCard = async () => {
        if (!agentUrl.trim()) { message.warning("Enter an agent URL"); return; }
        setLoadingCard(true);
        setCardError("");
        setAgentCard(null);
        setCardJson("");
        setCompliance([]);

        const cardUrl = `${baseUrl}/.well-known/agent.json`;

        pushDebug({ direction: "out", method: "GET /.well-known/agent.json", payload: { url: cardUrl } });

        try {
            const res = await fetch(cardUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            const json: AgentCard = await res.json();
            setAgentCard(json);
            setCardJson(JSON.stringify(json, null, 2));
            setCompliance(checkCompliance(json));
            pushDebug({ direction: "in", method: "agent.json", payload: json });
            message.success("Agent card loaded");
            try { localStorage.setItem("a2a-inspector-url", agentUrl); } catch {}
        } catch (err: any) {
            const msg = err.message;
            setCardError(msg);
            pushDebug({ direction: "in", method: "agent.json", payload: { error: msg }, error: true });
            message.error("Failed to load agent card: " + msg);
        } finally {
            setLoadingCard(false);
        }
    };

    // ── JSON-RPC call ─────────────────────────────────────────────────

    const rpcCall = async (method: string, params: unknown): Promise<unknown> => {
        const id = makeRpcId();
        const body = { jsonrpc: "2.0", id, method, params };
        pushDebug({ direction: "out", method, payload: body });

        const res = await fetch(`${baseUrl}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errMsg = `HTTP ${res.status}: ${res.statusText}`;
            pushDebug({ direction: "in", method, payload: { error: errMsg }, error: true });
            throw new Error(errMsg);
        }

        const json = await res.json();
        pushDebug({ direction: "in", method, payload: json, error: !!json.error });

        if (json.error) throw new Error(json.error.message || JSON.stringify(json.error));
        return json.result;
    };

    // ── Send chat message ─────────────────────────────────────────────

    const sendMessage = async () => {
        if (!inputText.trim() || sending) return;
        const text = inputText.trim();
        setInputText("");
        setSending(true);

        const taskId = `task-${Date.now()}`;

        setChatMessages(prev => [...prev, {
            id: makeMsgId(),
            role: "user",
            content: text,
            ts: Date.now(),
            taskId,
        }]);

        try {
            const result = await rpcCall("tasks/send", {
                id: taskId,
                message: {
                    role: "user",
                    parts: [{ type: "text", text }],
                },
            }) as any;

            const agentParts = result?.status?.message?.parts || result?.artifacts?.[0]?.parts || [];
            const agentText = agentParts
                .filter((p: any) => p.type === "text")
                .map((p: any) => p.text)
                .join("\n") || JSON.stringify(result, null, 2);

            setChatMessages(prev => [...prev, {
                id: makeMsgId(),
                role: "agent",
                content: agentText,
                ts: Date.now(),
                taskId,
                raw: result,
            }]);
        } catch (err: any) {
            setChatMessages(prev => [...prev, {
                id: makeMsgId(),
                role: "system",
                content: "Error: " + err.message,
                ts: Date.now(),
                error: true,
            }]);
        } finally {
            setSending(false);
        }
    };

    const complianceSummary = {
        ok: compliance.filter(c => c.status === "ok").length,
        warn: compliance.filter(c => c.status === "warn").length,
        error: compliance.filter(c => c.status === "error").length,
    };

    return (
        <ToolPageLayout
            title="A2A Inspector"
            description="Test and inspect Agent-to-Agent (A2A) protocol agents"
            icon={<RobotOutlined style={{ fontSize: 24, color: "#0891b2" }} />}
            color="#0891b2"
            learnMore={{
                whatIs: "The Agent-to-Agent (A2A) Protocol is an open standard for AI agents to communicate, delegate tasks, and collaborate across systems. This inspector connects to any A2A-compatible agent, reads its Agent Card, validates spec compliance, lets you chat with the agent via JSON-RPC 2.0, and shows every raw message in the debug console.",
                whyUse: "Building or integrating A2A agents requires verifying the card structure, testing the tasks/send flow, and debugging raw message exchange. This tool removes the need for curl scripts and log tailing during development.",
                howToUse: [
                    "Enter the agent's base URL (e.g. http://localhost:10000)",
                    "Click 'Load Agent Card' to fetch /.well-known/agent.json and run the spec compliance checks",
                    "Switch to the Chat tab to send tasks and see the agent's responses",
                    "Open the Debug Console tab to inspect every raw JSON-RPC 2.0 request and response",
                ],
                tips: [
                    "The Agent Card is always at /.well-known/agent.json on the agent's host",
                    "tasks/send creates a new task per message; the task ID is shown in the debug console",
                    "Agents that support streaming will respond via SSE — this inspector shows the final aggregated result",
                    "CORS must be enabled on the agent for browser-based inspection to work",
                ],
                useCases: [
                    "Validating a newly built A2A agent against the spec before publishing its card",
                    "Debugging task routing between multiple agents in a multi-agent system",
                    "Exploring a third-party agent's capabilities before integrating it into a workflow",
                    "Smoke-testing agent endpoints during CI/CD pipelines",
                ],
            }}
        >
            {/* URL bar */}
            <Card style={{ marginBottom: 16 }}>
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
                        Load Agent Card
                    </Button>
                </Space.Compact>
                {cardError && (
                    <Alert
                        type="error"
                        message={cardError}
                        showIcon
                        style={{ marginTop: 8 }}
                        description="Make sure the agent is running and CORS is enabled. The card endpoint must be /.well-known/agent.json"
                    />
                )}
            </Card>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    // ── Agent Card ──────────────────────────────────────────
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
                                                        {agentCard.capabilities.pushNotifications && <Tag color="purple">Push Notifications</Tag>}
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
                                        </Descriptions>

                                        {agentCard.skills && agentCard.skills.length > 0 && (
                                            <>
                                                <Divider style={{ margin: "12px 0" }}>Skills ({agentCard.skills.length})</Divider>
                                                {agentCard.skills.map(skill => (
                                                    <Card key={skill.id} size="small" style={{ marginBottom: 8 }}>
                                                        <Text strong style={{ fontSize: 12 }}>{skill.name}</Text>
                                                        <Text type="secondary" style={{ fontSize: 11, display: "block" }}>{skill.id}</Text>
                                                        {skill.description && (
                                                            <Text style={{ fontSize: 11 }}>{skill.description}</Text>
                                                        )}
                                                        {skill.tags?.length && (
                                                            <div style={{ marginTop: 4 }}>
                                                                {skill.tags.map(t => <Tag key={t} style={{ fontSize: 10 }}>{t}</Tag>)}
                                                            </div>
                                                        )}
                                                        {skill.examples?.length && (
                                                            <div style={{ marginTop: 4 }}>
                                                                <Text type="secondary" style={{ fontSize: 10 }}>Examples:</Text>
                                                                {skill.examples.map((ex, i) => (
                                                                    <div key={i}>
                                                                        <Text code style={{ fontSize: 10 }}>{ex}</Text>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </Card>
                                                ))}
                                            </>
                                        )}
                                    </Card>
                                </Col>

                                <Col xs={24} lg={12}>
                                    {/* Compliance checker */}
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

                                    {/* Raw JSON */}
                                    <Card
                                        size="small"
                                        title="Raw agent.json"
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
                                            : "Enter an agent URL above and click 'Load Agent Card'"
                                    }
                                />
                            </Card>
                        ),
                    },

                    // ── Chat ───────────────────────────────────────────────
                    {
                        key: "chat",
                        label: (
                            <Space size={4}>
                                <SendOutlined />
                                Live Chat
                                {chatMessages.length > 0 && <Badge count={chatMessages.filter(m => m.role === "agent").length} size="small" color="#0891b2" />}
                            </Space>
                        ),
                        children: (
                            <Card
                                title={
                                    <Space>
                                        <RobotOutlined style={{ color: "#0891b2" }} />
                                        Chat with Agent
                                        {agentCard && <Tag color="cyan">{agentCard.name}</Tag>}
                                        {!agentCard && <Tag color="default">No agent loaded</Tag>}
                                    </Space>
                                }
                                extra={
                                    chatMessages.length > 0 && (
                                        <Button
                                            size="small"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => setChatMessages([])}
                                        >
                                            Clear
                                        </Button>
                                    )
                                }
                            >
                                {/* Message list */}
                                <div style={{ height: 400, overflowY: "auto", padding: "8px 0", marginBottom: 12 }}>
                                    {chatMessages.length === 0 && (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={agentCard ? "Send a message to start" : "Load an agent card first"}
                                        />
                                    )}
                                    {chatMessages.map(msg => (
                                        <div
                                            key={msg.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                                marginBottom: 8,
                                                gap: 8,
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
                                                        : <InfoCircleOutlined style={{ color: "#fff", fontSize: 14 }} />
                                                    }
                                                </div>
                                            )}
                                            <div style={{
                                                maxWidth: "72%",
                                                padding: "8px 12px",
                                                borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                                                background: msg.role === "user"
                                                    ? "#0891b2"
                                                    : msg.error
                                                        ? (darkMode ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)")
                                                        : "var(--wb-card-solid-bg)",
                                                border: msg.role === "user" ? "none" : "1px solid var(--wb-card-border)",
                                            }}>
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        color: msg.role === "user" ? "#fff" : undefined,
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {msg.content}
                                                </Text>
                                                <div>
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            opacity: 0.6,
                                                            color: msg.role === "user" ? "#fff" : undefined,
                                                        }}
                                                    >
                                                        {new Date(msg.ts).toLocaleTimeString()}
                                                        {msg.taskId && ` · ${msg.taskId}`}
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
                                    {sending && (
                                        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }}>
                                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0891b2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <RobotOutlined style={{ color: "#fff", fontSize: 14 }} />
                                            </div>
                                            <Spin size="small" />
                                            <Text type="secondary" style={{ fontSize: 12 }}>Agent is responding…</Text>
                                        </div>
                                    )}
                                    <div ref={chatBottomRef} />
                                </div>

                                {/* Input */}
                                <Space.Compact style={{ width: "100%" }}>
                                    <Input
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        onPressEnter={sendMessage}
                                        placeholder={agentCard ? `Message ${agentCard.name}…` : "Load an agent card first"}
                                        disabled={!agentCard || sending}
                                        size="large"
                                    />
                                    <Button
                                        size="large"
                                        type="primary"
                                        icon={sending ? <ReloadOutlined spin /> : <SendOutlined />}
                                        onClick={sendMessage}
                                        disabled={!agentCard || !inputText.trim() || sending}
                                        style={{ background: "#0891b2", borderColor: "#0891b2" }}
                                    >
                                        Send
                                    </Button>
                                </Space.Compact>
                            </Card>
                        ),
                    },

                    // ── Debug Console ──────────────────────────────────────
                    {
                        key: "debug",
                        label: (
                            <Space size={4}>
                                <BugOutlined />
                                Debug Console
                                {debugLog.length > 0 && <Badge count={debugLog.length} size="small" color="#6366f1" overflowCount={99} />}
                            </Space>
                        ),
                        children: (
                            <Card
                                title={
                                    <Space>
                                        <BugOutlined style={{ color: "#6366f1" }} />
                                        JSON-RPC 2.0 Messages
                                    </Space>
                                }
                                extra={
                                    debugLog.length > 0 && (
                                        <Button
                                            size="small"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => setDebugLog([])}
                                        >
                                            Clear
                                        </Button>
                                    )
                                }
                            >
                                {debugLog.length === 0 ? (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No messages yet — load a card or send a chat message" />
                                ) : (
                                    <div style={{ maxHeight: 560, overflowY: "auto" }}>
                                        {debugLog.map(entry => {
                                            const payloadStr = JSON.stringify(entry.payload, null, 2);
                                            return (
                                                <div
                                                    key={entry.id}
                                                    style={{
                                                        marginBottom: 8,
                                                        padding: 10,
                                                        borderRadius: 6,
                                                        border: `1px solid ${entry.error ? "rgba(239,68,68,0.3)" : entry.direction === "out" ? "rgba(8,145,178,0.3)" : "rgba(99,102,241,0.3)"}`,
                                                        background: entry.error
                                                            ? (darkMode ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)")
                                                            : entry.direction === "out"
                                                                ? (darkMode ? "rgba(8,145,178,0.08)" : "rgba(8,145,178,0.05)")
                                                                : (darkMode ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)"),
                                                    }}
                                                >
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                                        <Tag
                                                            color={entry.direction === "out" ? "cyan" : "purple"}
                                                            style={{ fontSize: 10, margin: 0 }}
                                                        >
                                                            {entry.direction === "out" ? "→ OUT" : "← IN"}
                                                        </Tag>
                                                        <Text code style={{ fontSize: 11 }}>{entry.method}</Text>
                                                        {entry.error && <Tag color="error" style={{ fontSize: 10 }}>Error</Tag>}
                                                        <Text type="secondary" style={{ fontSize: 10, marginLeft: "auto" }}>
                                                            {new Date(entry.ts).toLocaleTimeString()}
                                                        </Text>
                                                        <Tooltip title="Copy">
                                                            <Button
                                                                size="small"
                                                                type="text"
                                                                icon={<CopyOutlined />}
                                                                style={{ padding: "0 4px" }}
                                                                onClick={() => { navigator.clipboard.writeText(payloadStr); message.success("Copied!"); }}
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                    <pre style={{
                                                        fontSize: 10,
                                                        margin: 0,
                                                        maxHeight: 200,
                                                        overflow: "auto",
                                                        fontFamily: "var(--font-geist-mono), monospace",
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-all",
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

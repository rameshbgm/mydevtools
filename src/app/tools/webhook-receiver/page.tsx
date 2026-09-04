"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Card, Typography, Input, Button, Space, Tag, App, Empty, Collapse,
} from "antd";
import {
    InboxOutlined, CopyOutlined, DeleteOutlined, ReloadOutlined, LinkOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text, Paragraph } = Typography;

interface CapturedRequest {
    id: number;
    receivedAt: number;
    method: string;
    path: string;
    query: Record<string, string>;
    headers: Record<string, string>;
    bodyText: string;
    bodyBase64?: string;
    remoteIp?: string;
}

function randomSessionId(): string {
    const bytes = new Uint8Array(18);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 24);
}

const METHOD_COLOR: Record<string, string> = {
    GET: "blue", POST: "green", PUT: "orange", PATCH: "purple",
    DELETE: "red", OPTIONS: "default", HEAD: "default",
};

export default function WebhookReceiverPage() {
    const { message } = App.useApp();
    const [mounted, setMounted] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [polling, setPolling] = useState(true);
    const [requests, setRequests] = useState<CapturedRequest[]>([]);
    const lastIdRef = useRef(0);
    const sessionRef = useRef("");

    useEffect(() => {
        setMounted(true);
        const stored = typeof window !== "undefined" ? localStorage.getItem("webhook-session-id") : null;
        if (stored && /^[A-Za-z0-9_-]{16,64}$/.test(stored)) {
            setSessionId(stored);
            sessionRef.current = stored;
        } else {
            const id = randomSessionId();
            setSessionId(id);
            sessionRef.current = id;
            if (typeof window !== "undefined") localStorage.setItem("webhook-session-id", id);
        }
    }, []);

    const url = mounted && sessionId && typeof window !== "undefined"
        ? `${window.location.origin}/api/webhook/${sessionId}`
        : "";

    // Returns false when the request failed, so the loop can back off instead
    // of spinning. The signal aborts the in-flight long-poll on unmount.
    const pollOnce = useCallback(async (signal: AbortSignal): Promise<boolean> => {
        if (!sessionRef.current) return false;
        try {
            const res = await fetch(
                `/api/webhook/${sessionRef.current}/events?since=${lastIdRef.current}&wait=20000`,
                { signal },
            );
            if (!res.ok) return false;
            const data = (await res.json()) as { requests: CapturedRequest[] };
            if (data.requests.length) {
                setRequests((prev) => [...data.requests.reverse(), ...prev]);
                lastIdRef.current = Math.max(lastIdRef.current, ...data.requests.map((r) => r.id));
            }
            return true;
        } catch {
            // network blip or abort; the caller decides whether to retry
            return false;
        }
    }, []);

    useEffect(() => {
        if (!mounted || !polling || !sessionId) return;
        let active = true;
        const controller = new AbortController();
        sessionRef.current = sessionId;
        const loop = async () => {
            while (active) {
                const ok = await pollOnce(controller.signal);
                if (!active) return;
                // Without this, a server that fails fast turns the long-poll
                // into a tight request loop.
                if (!ok) await new Promise((r) => setTimeout(r, 2000));
            }
        };
        loop();
        return () => {
            active = false;
            controller.abort();
        };
    }, [mounted, polling, sessionId, pollOnce]);

    const newSession = () => {
        const id = randomSessionId();
        setSessionId(id);
        sessionRef.current = id;
        lastIdRef.current = 0;
        setRequests([]);
        if (typeof window !== "undefined") localStorage.setItem("webhook-session-id", id);
        message.success("New session URL generated");
    };

    const clearHistory = async () => {
        if (!sessionId) return;
        await fetch(`/api/webhook/${sessionId}/events`, { method: "DELETE" });
        setRequests([]);
        lastIdRef.current = 0;
    };

    const copyUrl = async () => {
        if (!url) return;
        await copyToClipboard(url);
        message.success("Webhook URL copied");
    };

    const formatBody = (r: CapturedRequest) => {
        if (!r.bodyText) return "";
        try {
            const parsed = JSON.parse(r.bodyText);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return r.bodyText;
        }
    };

    return (
        <ToolPageLayout
            title="Webhook Receiver"
            description="Generate a unique URL and capture inbound HTTP requests in real time"
            icon={<InboxOutlined style={{ fontSize: 24, color: "#0891b2" }} />}
            color="#0891b2"
            learnMore={{
                whatIs: "Webhook Receiver gives you a unique URL that captures any HTTP request sent to it — method, headers, query, body. Useful when you need to see what an upstream system is actually sending.",
                whyUse: "Webhook bugs are notoriously hard to debug because the upstream system is the originator. Pointing it at this URL gives you a faithful, persistent record of every callback.",
                howToUse: [
                    "Copy the unique URL below",
                    "Configure your upstream service (Stripe, GitHub, Slack, your own backend) to send to it",
                    "Each inbound request streams into this page in real time",
                    "Click a request to expand headers, body, and query",
                ],
                tips: [
                    "Session URL is stored in localStorage so refreshes keep your history",
                    "Server holds up to 50 requests or 5 MB per session, auto-expires after 1 hour idle, and may not survive a deployment restart",
                    "All methods are accepted (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD)",
                    "Binary bodies are surfaced as base64 inside the captured request",
                ],
                useCases: [
                    "Debugging webhook integrations (Stripe, GitHub, SendGrid)",
                    "Inspecting what your own backend POSTs to a callback",
                    "Reproducing a webhook payload from production into a dev fixture",
                ],
                serverNotice: {
                    route: "webhook",
                    purpose: "Webhook Receiver keeps captured requests in process memory for the session lifetime (1 hour idle, up to 50 requests or 5 MB). It is not durable across deployment restarts or shared across server instances.",
                    sentFields: ["session id", "captured request headers", "captured request body"],
                },
            }}
        >
            {mounted && (
                <>
                    <Card>
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>Your webhook URL</Text>
                                <Space.Compact style={{ width: "100%" }}>
                                    <Input
                                        value={url}
                                        readOnly
                                        prefix={<LinkOutlined />}
                                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                                    />
                                    <Button icon={<CopyOutlined />} onClick={copyUrl}>Copy</Button>
                                    <Button icon={<ReloadOutlined />} onClick={newSession}>New session</Button>
                                </Space.Compact>
                            </div>
                            <Space wrap>
                                <Tag color={polling ? "processing" : "default"}>{polling ? "Listening…" : "Paused"}</Tag>
                                <Button size="small" onClick={() => setPolling((p) => !p)}>
                                    {polling ? "Pause" : "Resume"}
                                </Button>
                                <Button size="small" icon={<DeleteOutlined />} onClick={clearHistory} disabled={!requests.length}>
                                    Clear history
                                </Button>
                                <Tag>{requests.length} captured</Tag>
                            </Space>
                            <Paragraph type="secondary" style={{ fontSize: 11, marginBottom: 0 }}>
                                Try it: <code style={{ fontSize: 11 }}>curl -X POST {url} -H {'"Content-Type: application/json"'} -d {'{"hello":"world"}'}</code>
                            </Paragraph>
                        </Space>
                    </Card>

                    <Card style={{ marginTop: 16 }} title="Captured requests">
                        {requests.length === 0 ? (
                            <Empty description="Waiting for your first request…" />
                        ) : (
                            <Collapse
                                items={requests.map((r) => ({
                                    key: r.id,
                                    label: (
                                        <Space wrap>
                                            <Tag color={METHOD_COLOR[r.method] || "default"}>{r.method}</Tag>
                                            <Text strong style={{ fontFamily: "var(--font-geist-mono)" }}>{r.path}</Text>
                                            {Object.keys(r.query).length > 0 && <Tag>{Object.keys(r.query).length} query params</Tag>}
                                            <Text type="secondary" style={{ fontSize: 11 }}>{new Date(r.receivedAt).toLocaleTimeString()}</Text>
                                        </Space>
                                    ),
                                    children: (
                                        <Space orientation="vertical" style={{ width: "100%" }}>
                                            <div>
                                                <Text strong style={{ fontSize: 12 }}>Headers</Text>
                                                <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, marginTop: 4 }}>
                                                    {Object.entries(r.headers).map(([k, v]) => (
                                                        <div key={k} style={{ padding: "2px 0" }}>
                                                            <Text type="secondary">{k}:</Text> {v}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {Object.keys(r.query).length > 0 && (
                                                <div>
                                                    <Text strong style={{ fontSize: 12 }}>Query</Text>
                                                    <pre style={{ margin: "4px 0 0", fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>
                                                        {JSON.stringify(r.query, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                            {r.bodyText && (
                                                <div>
                                                    <Space style={{ marginBottom: 4 }}>
                                                        <Text strong style={{ fontSize: 12 }}>Body</Text>
                                                        <a onClick={async () => { await copyToClipboard(r.bodyText); message.success("Body copied"); }}>
                                                            <CopyOutlined /> copy
                                                        </a>
                                                    </Space>
                                                    <pre style={{ margin: 0, fontFamily: "var(--font-geist-mono)", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-all", background: "rgba(0,0,0,0.03)", padding: 8, borderRadius: 4 }}>
                                                        {formatBody(r)}
                                                    </pre>
                                                </div>
                                            )}
                                            {r.bodyBase64 && (
                                                <div>
                                                    <Text strong style={{ fontSize: 12 }}>Body (base64)</Text>
                                                    <pre style={{ margin: "4px 0 0", fontFamily: "var(--font-geist-mono)", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                                                        {r.bodyBase64}
                                                    </pre>
                                                </div>
                                            )}
                                            {r.remoteIp && <Text type="secondary" style={{ fontSize: 11 }}>From {r.remoteIp}</Text>}
                                        </Space>
                                    ),
                                }))}
                            />
                        )}
                    </Card>
                </>
            )}
        </ToolPageLayout>
    );
}

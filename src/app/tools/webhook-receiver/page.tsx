"use client";
import { projectStorage } from "@/lib/project-storage";

import { useLanguage } from "@/components/LanguageProvider";
import React, { useRef, useEffect, useCallback, useState } from "react";
import {
    Card, Typography, Input, Button, Space, Tag, App, Empty, Collapse,
} from "antd";
import {
    InboxOutlined, CopyOutlined, DeleteOutlined, ReloadOutlined, LinkOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { parseJsonResponse } from "@/lib/certificate-fetch-response";
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
    const { t, language } = useLanguage();
    const tCurrent = useRef(t);
    useEffect(() => { tCurrent.current = t; }, [t]);
    const { message } = App.useApp();
    const [mounted, setMounted] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [polling, setPolling] = useState(true);
    const [requests, setRequests] = useState<CapturedRequest[]>([]);
    const lastIdRef = useRef(0);
    const sessionRef = useRef("");
    const captureEpoch = useRef(0);

    useEffect(() => {
        setMounted(true);
        const stored = typeof window !== "undefined" ? projectStorage.getItem("webhook-session-id") : null;
        if (stored && /^[A-Za-z0-9_-]{16,64}$/.test(stored)) {
            setSessionId(stored);
            sessionRef.current = stored;
        } else {
            const id = randomSessionId();
            setSessionId(id);
            sessionRef.current = id;
            if (typeof window !== "undefined") projectStorage.setItem("webhook-session-id", id);
        }
    }, []);

    const url = mounted && sessionId && typeof window !== "undefined"
        ? `${window.location.origin}/api/webhook/${sessionId}`
        : "";

    // Returns false when the request failed, so the loop can back off instead
    // of spinning. The signal aborts the in-flight long-poll on unmount.
    const pollOnce = useCallback(async (signal: AbortSignal): Promise<boolean> => {
        if (!sessionRef.current) return false;
        const polledSession = sessionRef.current;
        const polledEpoch = captureEpoch.current;
        try {
            const res = await fetch(
                `/api/webhook/${sessionRef.current}/events?since=${lastIdRef.current}&wait=20000`,
                { signal },
            );
            if (!res.ok) return false;
            const data = await parseJsonResponse<{ requests: CapturedRequest[] }>(res, "Webhook service");
            if (signal.aborted || sessionRef.current !== polledSession || captureEpoch.current !== polledEpoch) return false;
            if (data.requests.length) {
                setRequests((prev) => [...data.requests.reverse(), ...prev].slice(0, 50));
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
        if (typeof window !== "undefined") projectStorage.setItem("webhook-session-id", id);
        message.success(tCurrent.current("New session URL generated"));
    };

    const clearHistory = async () => {
        if (!sessionId) return;
        const clearingSession = sessionId;
        try {
            const res = await fetch(`/api/webhook/${clearingSession}/events`, { method: "DELETE" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            if (sessionRef.current !== clearingSession) return;
            captureEpoch.current++;
            setRequests([]);
            lastIdRef.current = 0;
        } catch (err) { message.error(tCurrent.current("Could not clear history: {error}", { error: err instanceof Error ? err.message : String(err) })); }
    };

    const copyUrl = async () => {
        if (url) await copyToClipboard(url);
    };


    return (
        <ToolPageLayout
            title={t("Webhook Receiver")}
            description={t("Generate a unique URL and capture inbound HTTP requests in real time")}
            icon={<InboxOutlined style={{ fontSize: 24, color: "var(--wb-accent)" }} />}
            color="#0891b2"
            learnMore={{
                whatIs: t("Capture inbound HTTP requests at a session URL served by this deployment."),
                whyUse: t("Copy the URL, configure your sender, and expand a captured request to inspect its original body and headers."),
                howToUse: [t("The session ID is stored on this device. Captures live in server memory, not durable browser history.")],
                tips: [t("The server retains at most 50 requests or 5 MB and expires idle sessions after one hour; restarts and multiple instances can affect availability."), t("Anyone with the session URL can send requests. Use test data and treat the URL as a secret.")],
                serverNotice: { route: "webhook", purpose: t("The server retains at most 50 requests or 5 MB and expires idle sessions after one hour; restarts and multiple instances can affect availability."), sentFields: [t("session id"), t("captured request headers"), t("captured request body")] },
            }}
        >
            {mounted && (
                <>
                    <Card>
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>{t("Your webhook URL")}</Text>
                                <Space.Compact style={{ width: "100%" }}>
                                    <Input
                                        value={url}
                                        readOnly
                                        prefix={<LinkOutlined />}
                                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }} dir="ltr" aria-label={t("Your webhook URL")}
                                    />
                                    <Button icon={<CopyOutlined />} onClick={copyUrl}>{t("Copy")}</Button>
                                    <Button icon={<ReloadOutlined />} onClick={newSession}>{t("New session")}</Button>
                                </Space.Compact>
                            </div>
                            <Space wrap>
                                <Tag color={polling ? "processing" : "default"}>{polling ? t("Listening…") : t("Paused")}</Tag>
                                <Button size="small" onClick={() => setPolling((p) => !p)}>
                                    {polling ? t("Pause") : t("Resume")}
                                </Button>
                                <Button size="small" icon={<DeleteOutlined />} onClick={clearHistory} disabled={!requests.length}>
                                    {t("Clear history")}
                                </Button>
                                <Tag>{t("{count} captured", { count: requests.length })}</Tag>
                            </Space>
                            <Paragraph type="secondary" style={{ fontSize: 11, marginBottom: 0 }}>
                                {t("Try it:")} <code style={{ fontSize: 11 }}>curl -X POST {url} -H {'"Content-Type: application/json"'} -d {'{"hello":"world"}'}</code>
                            </Paragraph>
                        </Space>
                    </Card>

                    <Card style={{ marginTop: 16 }} title={t("Captured requests")}>
                        {requests.length === 0 ? (
                            <Empty description={t("Waiting for your first request…")} />
                        ) : (
                            <Collapse
                                items={requests.map((r) => ({
                                    key: r.id,
                                    label: (
                                        <Space wrap>
                                            <Tag color={METHOD_COLOR[r.method] || "default"}>{r.method}</Tag>
                                            <Text strong style={{ fontFamily: "var(--font-geist-mono)" }}>{r.path}</Text>
                                            {Object.keys(r.query).length > 0 && <Tag>{t("{count} query parameters", { count: Object.keys(r.query).length })}</Tag>}
                                            <Text type="secondary" style={{ fontSize: 11 }}>{new Date(r.receivedAt).toLocaleTimeString(language)}</Text>
                                        </Space>
                                    ),
                                    children: (
                                        <Space orientation="vertical" style={{ width: "100%" }}>
                                            <div>
                                                <Text strong style={{ fontSize: 12 }}>{t("Headers")}</Text>
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
                                                    <Text strong style={{ fontSize: 12 }}>{t("Query")}</Text>
                                                    <pre style={{ margin: "4px 0 0", fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>
                                                        {JSON.stringify(r.query, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                            {r.bodyText && (
                                                <div>
                                                    <Space style={{ marginBottom: 4 }}>
                                                        <Text strong style={{ fontSize: 12 }}>{t("Body")}</Text>
                                                        <a onClick={async () => { await copyToClipboard(r.bodyText); }}>
                                                            <CopyOutlined /> {t("copy")}
                                                        </a>
                                                    </Space>
                                                    <pre style={{ margin: 0, fontFamily: "var(--font-geist-mono)", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-all", background: "var(--signal-inset)", padding: 8, borderRadius: 4 }}>
                                                        {r.bodyText}
                                                    </pre>
                                                </div>
                                            )}
                                            {r.bodyBase64 && (
                                                <div>
                                                    <Text strong style={{ fontSize: 12 }}>{t("Body (base64)")}</Text>
                                                    <pre style={{ margin: "4px 0 0", fontFamily: "var(--font-geist-mono)", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                                                        {r.bodyBase64}
                                                    </pre>
                                                </div>
                                            )}
                                            {r.remoteIp && <Text type="secondary" style={{ fontSize: 11 }}>{t("From {address}", { address: r.remoteIp })}</Text>}
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

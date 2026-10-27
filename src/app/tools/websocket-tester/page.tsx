"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, Typography, Input, Button, Row, Col, Space, Tag, App, Empty } from "antd";
import { DisconnectOutlined, SendOutlined, DeleteOutlined, ApiOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type Direction = "sent" | "received" | "system";
interface Frame { id: number; direction: Direction; data: string; at: number; notice?: { source: string; values?: Record<string, string | number> }; }

const DIRECTION_COLOR: Record<Direction, string> = {
    sent: "#1890ff",
    received: "#52c41a",
    system: "#8c8c8c",
};

export default function WebsocketTesterPage() {
    const { t, language } = useLanguage();
    const tRef = useRef(t);
    useEffect(() => { tRef.current = t; }, [t]);
    const { message } = App.useApp();
    const [url, setUrl] = useState("wss://echo.websocket.org");
    const [outgoing, setOutgoing] = useState('{"hello":"world"}');
    const [status, setStatus] = useState<"closed" | "connecting" | "open" | "closing">("closed");
    const [frames, setFrames] = useState<Frame[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const idRef = useRef(0);

    const append = (direction: Direction, data: string, notice?: Frame["notice"]) => {
        setFrames((f) => [...f, { id: ++idRef.current, direction, data, notice, at: Date.now() }]);
    };

    useEffect(() => () => { wsRef.current?.close(); }, []);

    const connect = () => {
        if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) return;
        try {
            const ws = new WebSocket(url);
            wsRef.current = ws;
            setStatus("connecting");
            append("system", `Connecting to ${url}…`, { source: "Connecting to {url}…", values: { url } });
            ws.onopen = () => { setStatus("open"); append("system", "Connection opened", { source: "Connection opened" }); };
            ws.onmessage = (ev) => {
                const data: string = typeof ev.data === "string"
                    ? ev.data
                    : ev.data instanceof Blob
                        ? `[binary blob, ${ev.data.size} bytes]`
                        : `[binary, ${(ev.data as ArrayBuffer).byteLength} bytes]`;
                append("received", data, typeof ev.data === "string" ? undefined : { source: ev.data instanceof Blob ? "[binary blob, {count} bytes]" : "[binary, {count} bytes]", values: { count: ev.data instanceof Blob ? ev.data.size : (ev.data as ArrayBuffer).byteLength } });
            };
            ws.onerror = () => { append("system", "Socket error", { source: "Socket error" }); };
            ws.onclose = (ev) => {
                setStatus("closed");
                append("system", `Closed (code ${ev.code}${ev.reason ? `, reason: ${ev.reason}` : ""})`, { source: ev.reason ? "Closed (code {code}, reason: {reason})" : "Closed (code {code})", values: ev.reason ? { code: ev.code, reason: ev.reason } : { code: ev.code } });
            };
        } catch (err) {
            message.error(err instanceof Error ? err.message : String(err));
            setStatus("closed");
        }
    };

    const disconnect = () => {
        if (!wsRef.current) return;
        setStatus("closing");
        wsRef.current.close();
    };

    const send = () => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            message.warning(tRef.current("Socket not open"));
            return;
        }
        try {
            wsRef.current.send(outgoing);
            append("sent", outgoing);
        } catch (err) {
            message.error(err instanceof Error ? err.message : String(err));
        }
    };

    const clear = () => setFrames([]);

    const statusColor: Record<typeof status, string> = {
        closed: "default", connecting: "processing", open: "success", closing: "warning",
    };

    return (
        <ToolPageLayout
            title={t("WebSocket Tester")}
            description={t("Connect to ws:// and wss:// endpoints, send messages, watch frames stream in")}
            icon={<DisconnectOutlined style={{ fontSize: 24, color: "var(--wb-accent)" }} />}
            color="#06b6d4"
            learnMore={{
                whatIs: t("Open a browser WebSocket connection, send text frames and inspect received messages with timestamps."),
                whyUse: t("Exercise a WebSocket endpoint independently of an application and inspect connection events."),
                howToUse: [t("Enter a ws:// or wss:// endpoint and select Connect."), t("When connected, enter a message and select Send frame."), t("Disconnect to close the socket. Clear removes displayed frames.")],
                tips: [t("HTTPS pages normally require wss://. Server origin checks and network policy can reject connections."), t("Binary messages show their byte length; their contents are not decoded.")],
                useCases: [t("Reproduce a failing message or inspect application heartbeat traffic. Browser clients cannot send protocol-level ping frames.")],
            }}
        >
            <Row className="signal-working-panes" gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card size="small" title={t("Connection")}>
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                            <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                aria-label={t("WebSocket URL")} placeholder="wss://echo.websocket.org"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={status !== "closed"}
                                prefix={<ApiOutlined />}
                            />
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={connect}
                                    disabled={status !== "closed"}
                                    loading={status === "connecting"}
                                >
                                    {t("Connect")}</Button>
                                <Button onClick={disconnect} disabled={status !== "open"}>
                                    {t("Disconnect")}</Button>
                                <Tag color={statusColor[status]}>{t(status)}</Tag>
                            </Space>
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>{t("Send")}</Text>
                                <TextArea dir="ltr"
                                    aria-label={t("Message to send")} value={outgoing}
                                    onChange={(e) => setOutgoing(e.target.value)}
                                    autoSize={{ minRows: 4, maxRows: 8 }}
                                    placeholder='{"action":"subscribe","channel":"…"}'
                                    style={{ direction: "ltr", textAlign: "left", fontFamily: "var(--font-geist-mono)", fontSize: 16 }}
                                />
                            </div>
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={send}
                                disabled={status !== "open"}
                                block
                            >
                                {t("Send frame")}</Button>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card
                        size="small"
                        title={<Space><Text strong>{t("Frames")}</Text><Tag>{frames.length}</Tag></Space>}
                        extra={
                            <Button size="small" icon={<DeleteOutlined />} onClick={clear} disabled={!frames.length}>
                                {t("Clear")}</Button>
                        }
                    >
                        {frames.length === 0 ? (
                            <Empty description={t("Connect and send a frame")} />
                        ) : (
                            <div style={{ maxHeight: 520, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                                {frames.map((f) => (
                                    <div
                                        key={f.id}
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            padding: "6px 10px",
                                            background: f.direction === "system" ? "var(--signal-inset)" : "var(--signal-inset)",
                                            borderInlineStart: `1px solid ${DIRECTION_COLOR[f.direction]}`,
                                            borderRadius: 4,
                                        }}
                                    >
                                        <Tag color={DIRECTION_COLOR[f.direction]} style={{ minWidth: 0, textAlign: "center", margin: 0 }}>
                                            {f.direction === "sent" ? t("Sent") : f.direction === "received" ? t("Received") : t("System")}
                                        </Tag>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <Paragraph dir={f.notice ? "auto" : "ltr"} style={{
                                                    margin: 0,
                                                    fontFamily: "var(--font-geist-mono)",
                                                    fontSize: 16,
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-all",
                                                }}
                                            >
                                                {f.notice ? t(f.notice.source, f.notice.values) : f.data}
                                            </Paragraph>
                                            <Text type="secondary" style={{ fontSize: 10 }}>
                                                {new Date(f.at).toLocaleTimeString(language)}
                                            </Text>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

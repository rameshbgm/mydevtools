"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, Typography, Input, Button, Row, Col, Space, Tag, App, Empty } from "antd";
import { DisconnectOutlined, SendOutlined, DeleteOutlined, ApiOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type Direction = "sent" | "received" | "system";
interface Frame { id: number; direction: Direction; data: string; at: number; }

const DIRECTION_COLOR: Record<Direction, string> = {
    sent: "#1890ff",
    received: "#52c41a",
    system: "#8c8c8c",
};

export default function WebsocketTesterPage() {
    const { message } = App.useApp();
    const [url, setUrl] = useState("wss://echo.websocket.org");
    const [outgoing, setOutgoing] = useState('{"hello":"world"}');
    const [status, setStatus] = useState<"closed" | "connecting" | "open" | "closing">("closed");
    const [frames, setFrames] = useState<Frame[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const idRef = useRef(0);

    const append = (direction: Direction, data: string) => {
        setFrames((f) => [...f, { id: ++idRef.current, direction, data, at: Date.now() }]);
    };

    useEffect(() => () => { wsRef.current?.close(); }, []);

    const connect = () => {
        if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) return;
        try {
            const ws = new WebSocket(url);
            wsRef.current = ws;
            setStatus("connecting");
            append("system", `Connecting to ${url}…`);
            ws.onopen = () => { setStatus("open"); append("system", "Connection opened"); };
            ws.onmessage = (ev) => {
                const data: string = typeof ev.data === "string"
                    ? ev.data
                    : ev.data instanceof Blob
                        ? `[binary blob, ${ev.data.size} bytes]`
                        : `[binary, ${(ev.data as ArrayBuffer).byteLength} bytes]`;
                append("received", data);
            };
            ws.onerror = () => { append("system", "Socket error"); };
            ws.onclose = (ev) => {
                setStatus("closed");
                append("system", `Closed (code ${ev.code}${ev.reason ? `, reason: ${ev.reason}` : ""})`);
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
            message.warning("Socket not open");
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
            title="WebSocket Tester"
            description="Connect to ws:// and wss:// endpoints, send messages, watch frames stream in"
            icon={<DisconnectOutlined style={{ fontSize: 24, color: "#06b6d4" }} />}
            color="#06b6d4"
            learnMore={{
                whatIs: "WebSocket Tester is a minimal browser-based WebSocket client. It opens a real connection to any ws:// or wss:// endpoint, sends text frames you craft, and prints each received frame with a timestamp.",
                whyUse: "Browser DevTools shows WebSocket frames but only when an app is using a socket. To exercise a socket endpoint on its own — sanity check, send custom payloads, watch keepalives — you need a dedicated client.",
                howToUse: [
                    "Enter the WebSocket URL (use wss:// for TLS)",
                    "Click Connect — connection status appears below the URL",
                    "Type a message and click Send",
                    "Received frames stream into the history; click Clear to reset",
                ],
                tips: [
                    "Mixed-content: an https:// page cannot open a ws:// (unencrypted) socket — use wss://",
                    "Binary frames are reported as [binary, N bytes] — text frames show inline",
                    "WebSockets bypass CORS, but server-side origin checks may still reject your origin",
                ],
                useCases: [
                    "Smoke-testing a new socket endpoint",
                    "Reproducing a bug seen in production by sending the suspect frame manually",
                    "Inspecting heartbeat / ping-pong intervals",
                ],
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card size="small" title="Connection">
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                            <Input
                                placeholder="wss://echo.websocket.org"
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
                                    Connect
                                </Button>
                                <Button onClick={disconnect} disabled={status !== "open"}>
                                    Disconnect
                                </Button>
                                <Tag color={statusColor[status]}>{status}</Tag>
                            </Space>
                            <div>
                                <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>Send</Text>
                                <TextArea
                                    value={outgoing}
                                    onChange={(e) => setOutgoing(e.target.value)}
                                    autoSize={{ minRows: 4, maxRows: 8 }}
                                    placeholder='{"action":"subscribe","channel":"…"}'
                                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                                />
                            </div>
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={send}
                                disabled={status !== "open"}
                                block
                            >
                                Send frame
                            </Button>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card
                        size="small"
                        title={<Space><Text strong>Frames</Text><Tag>{frames.length}</Tag></Space>}
                        extra={
                            <Button size="small" icon={<DeleteOutlined />} onClick={clear} disabled={!frames.length}>
                                Clear
                            </Button>
                        }
                    >
                        {frames.length === 0 ? (
                            <Empty description="Connect and send a frame" />
                        ) : (
                            <div style={{ maxHeight: 520, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                                {frames.map((f) => (
                                    <div
                                        key={f.id}
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            padding: "6px 10px",
                                            background: f.direction === "system" ? "rgba(0,0,0,0.02)" : "rgba(0,0,0,0.03)",
                                            borderLeft: `3px solid ${DIRECTION_COLOR[f.direction]}`,
                                            borderRadius: 4,
                                        }}
                                    >
                                        <Tag color={DIRECTION_COLOR[f.direction]} style={{ minWidth: 70, textAlign: "center", margin: 0 }}>
                                            {f.direction === "sent" ? "▲ sent" : f.direction === "received" ? "▼ recv" : "•"}
                                        </Tag>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <Paragraph
                                                style={{
                                                    margin: 0,
                                                    fontFamily: "var(--font-geist-mono)",
                                                    fontSize: 12,
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-all",
                                                }}
                                            >
                                                {f.data}
                                            </Paragraph>
                                            <Text type="secondary" style={{ fontSize: 10 }}>
                                                {new Date(f.at).toLocaleTimeString()}
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

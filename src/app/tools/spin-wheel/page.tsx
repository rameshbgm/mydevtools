"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Card, Input, Typography, Space, Tag, Tooltip, Row, Col } from "antd";
import {
    SyncOutlined, DeleteOutlined, PlusOutlined, TrophyOutlined, ReloadOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { Text, Title } = Typography;

const SEGMENT_COLORS = [
    "#f97316", "#8b5cf6", "#06b6d4", "#ec4899", "#22c55e",
    "#f59e0b", "#6366f1", "#10b981", "#ef4444", "#3b82f6",
    "#a855f7", "#14b8a6",
];

const DEFAULT_ITEMS = ["Option A", "Option B", "Option C", "Option D", "Option E", "Option F"];
const LS_KEY = "spin-wheel-items";

function segmentPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
    const toRad = (d: number) => (d - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

function labelPos(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const mid = (startDeg + endDeg) / 2;
    const toRad = (d: number) => (d - 90) * (Math.PI / 180);
    const dist = r * 0.62;
    return {
        x: cx + dist * Math.cos(toRad(mid)),
        y: cy + dist * Math.sin(toRad(mid)),
        rot: mid,
    };
}

function truncate(s: string, max: number) {
    return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export default function SpinWheelPage() {
    const { darkMode } = useAppStore();
    const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
    const [newItem, setNewItem] = useState("");
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
    const spinRef = useRef(rotation);
    spinRef.current = rotation;

    useEffect(() => {
        try {
            const saved = localStorage.getItem(LS_KEY);
            if (saved) setItems(JSON.parse(saved));
        } catch {}
    }, []);

    const saveItems = (next: string[]) => {
        setItems(next);
        try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
    };

    const addItem = () => {
        const t = newItem.trim();
        if (!t || items.length >= 12) return;
        saveItems([...items, t]);
        setNewItem("");
    };

    const removeItem = (i: number) => {
        const next = items.filter((_, idx) => idx !== i);
        saveItems(next.length >= 2 ? next : next);
        setWinner(null);
        setWinnerIdx(null);
    };

    const spin = useCallback(() => {
        if (spinning || items.length < 2) return;
        setSpinning(true);
        setWinner(null);
        setWinnerIdx(null);

        const segDeg = 360 / items.length;
        const targetIdx = Math.floor(Math.random() * items.length);
        // How many extra full spins (5–8)
        const extraSpins = 5 + Math.floor(Math.random() * 4);
        // Angle within the winning segment (land somewhere in the middle)
        const segOffset = segDeg * 0.2 + Math.random() * segDeg * 0.6;
        // We want the pointer (top = 0°) to land on segment targetIdx
        // Segment targetIdx starts at targetIdx * segDeg
        const targetAngle = targetIdx * segDeg + segOffset;
        const newRotation = spinRef.current + 360 * extraSpins + (360 - (spinRef.current % 360)) + (360 - targetAngle);

        setRotation(newRotation);

        setTimeout(() => {
            setWinner(items[targetIdx]);
            setWinnerIdx(targetIdx);
            setHistory(prev => [items[targetIdx], ...prev].slice(0, 10));
            setSpinning(false);
        }, 4200);
    }, [spinning, items]);

    const bg = darkMode ? "#141414" : "#f8fafc";
    const cardBg = darkMode ? "#1d1d1d" : "#ffffff";
    const border = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const muted = darkMode ? "#6b7280" : "#9ca3af";
    const n = items.length;
    const segDeg = n > 0 ? 360 / n : 360;
    const cx = 160; const cy = 160; const r = 148;

    return (
        <ToolPageLayout
            title="Spin the Wheel"
            description="Randomly select from custom options with an animated spinning wheel"
            icon={<SyncOutlined style={{ fontSize: 24, color: "#f97316" }} />}
            color="#f97316"
            learnMore={{
                whatIs: "An animated prize wheel that randomly picks one of your custom options. Add up to 12 items, spin, and get a fair random result with satisfying visual momentum.",
                whyUse: "Great for picking dinner spots, assigning tasks, selecting random team members, or any decision you want to delegate to chance.",
                howToUse: [
                    "Add or remove options in the list (2–12 items)",
                    "Click Spin to start the wheel",
                    "The winner is highlighted and added to history",
                    "Items persist across page reloads",
                ],
                tips: [
                    "Each segment has equal probability",
                    "Spin history tracks the last 10 results",
                    "Use short labels for the best display",
                ],
                useCases: ["Team standups", "Game nights", "Random task assignment", "Decision making"],
            }}
        >
            <Row gutter={[20, 20]}>
                {/* Wheel */}
                <Col xs={24} lg={14}>
                    <Card style={{ background: cardBg, textAlign: "center" }}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                            {/* Pointer */}
                            <div style={{
                                position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)",
                                zIndex: 10, width: 0, height: 0,
                                borderLeft: "12px solid transparent",
                                borderRight: "12px solid transparent",
                                borderTop: "28px solid #f97316",
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                            }} />

                            {/* Wheel SVG */}
                            <motion.div
                                style={{ display: "inline-block", transformOrigin: "center" }}
                                animate={{ rotate: rotation }}
                                transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 1.0] }}
                            >
                                <svg width={320} height={320} viewBox="0 0 320 320">
                                    {/* Shadow ring */}
                                    <circle cx={cx} cy={cy} r={r + 4} fill="rgba(0,0,0,0.15)" />
                                    {/* Segments */}
                                    {items.map((item, i) => {
                                        const start = i * segDeg;
                                        const end = start + segDeg;
                                        const lp = labelPos(cx, cy, r, start, end);
                                        const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
                                        const isWinner = winnerIdx === i;
                                        return (
                                            <g key={i}>
                                                <path
                                                    d={segmentPath(cx, cy, r, start, end)}
                                                    fill={color}
                                                    stroke={darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)"}
                                                    strokeWidth={1.5}
                                                    opacity={winnerIdx !== null && !isWinner ? 0.55 : 1}
                                                />
                                                <text
                                                    x={lp.x} y={lp.y}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    transform={`rotate(${lp.rot}, ${lp.x}, ${lp.y})`}
                                                    fontSize={n <= 6 ? 13 : n <= 9 ? 10 : 8}
                                                    fontWeight="700"
                                                    fill="rgba(255,255,255,0.95)"
                                                    style={{ pointerEvents: "none", userSelect: "none" }}
                                                >
                                                    {truncate(item, n <= 6 ? 12 : 8)}
                                                </text>
                                            </g>
                                        );
                                    })}
                                    {/* Center hub */}
                                    <circle cx={cx} cy={cy} r={22} fill={darkMode ? "#1d1d1d" : "#ffffff"} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
                                    <circle cx={cx} cy={cy} r={10} fill="#f97316" />
                                </svg>
                            </motion.div>
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={spinning ? <SyncOutlined spin /> : <SyncOutlined />}
                                onClick={spin}
                                disabled={spinning || items.length < 2}
                                style={{ background: "#f97316", borderColor: "#f97316", minWidth: 140, fontSize: 16, height: 48 }}
                            >
                                {spinning ? "Spinning…" : "Spin!"}
                            </Button>
                        </div>

                        {/* Winner banner */}
                        <AnimatePresence>
                            {winner && !spinning && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    style={{ marginTop: 16 }}
                                >
                                    <div style={{
                                        padding: "12px 24px",
                                        borderRadius: 12,
                                        background: `${SEGMENT_COLORS[winnerIdx! % SEGMENT_COLORS.length]}22`,
                                        border: `2px solid ${SEGMENT_COLORS[winnerIdx! % SEGMENT_COLORS.length]}66`,
                                        display: "inline-block",
                                    }}>
                                        <TrophyOutlined style={{ color: "#f59e0b", fontSize: 18, marginRight: 8 }} />
                                        <Text strong style={{ fontSize: 18, color: SEGMENT_COLORS[winnerIdx! % SEGMENT_COLORS.length] }}>
                                            {winner}
                                        </Text>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </Col>

                {/* Items editor + History */}
                <Col xs={24} lg={10}>
                    <Space orientation="vertical" style={{ width: "100%" }} size={16}>
                        <Card size="small" style={{ background: cardBg }} title={<Text strong>Items <Tag>{items.length} / 12</Tag></Text>}>
                            <Space.Compact style={{ width: "100%", marginBottom: 12 }}>
                                <Input
                                    value={newItem}
                                    onChange={e => setNewItem(e.target.value)}
                                    onPressEnter={addItem}
                                    placeholder="Add option…"
                                    maxLength={30}
                                    disabled={items.length >= 12}
                                />
                                <Button aria-label="Add" icon={<PlusOutlined />} onClick={addItem} disabled={!newItem.trim() || items.length >= 12} />
                            </Space.Compact>

                            <div style={{ maxHeight: 280, overflowY: "auto" }}>
                                {items.map((item, i) => (
                                    <div key={i} style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "5px 0",
                                        borderBottom: i < items.length - 1 ? `1px solid ${border}` : "none",
                                    }}>
                                        <div style={{
                                            width: 12, height: 12, borderRadius: 3, flexShrink: 0,
                                            background: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                                        }} />
                                        <Text style={{ flex: 1, fontSize: 13 }}>{item}</Text>
                                        <Button aria-label="Delete"
                                            type="text" danger size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeItem(i)}
                                            disabled={items.length <= 2}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 8 }}>
                                <Button
                                    size="small" icon={<ReloadOutlined />}
                                    onClick={() => { saveItems(DEFAULT_ITEMS); setWinner(null); setWinnerIdx(null); }}
                                >
                                    Reset to defaults
                                </Button>
                            </div>
                        </Card>

                        {history.length > 0 && (
                            <Card size="small" style={{ background: cardBg }}
                                title={<Text strong>Spin History</Text>}
                                extra={<Button size="small" danger onClick={() => setHistory([])}>Clear</Button>}
                            >
                                {history.map((h, i) => (
                                    <div key={i} style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "4px 0",
                                        opacity: 1 - i * 0.07,
                                    }}>
                                        <Text type="secondary" style={{ fontSize: 11, fontVariantNumeric: "tabular-nums", minWidth: 20 }}>#{i + 1}</Text>
                                        <Text style={{ fontSize: 13 }}>{h}</Text>
                                    </div>
                                ))}
                            </Card>
                        )}
                    </Space>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

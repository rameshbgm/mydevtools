"use client";
import { projectStorage } from "@/lib/project-storage";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Card, Input, Typography, Space, Tag, Row, Col } from "antd";
import {
    SyncOutlined, DeleteOutlined, PlusOutlined, TrophyOutlined, ReloadOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { Text } = Typography;

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
    const chars = Array.from(s);
    return chars.length > max ? chars.slice(0, max - 1).join("") + "…" : s;
}

export default function SpinWheelPage() {
    const { darkMode } = useAppStore();
    const { t } = useLanguage();
    const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
    const [newItem, setNewItem] = useState("");
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
    const spinRef = useRef(0);
    const resultRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => { if (resultRef.current) clearTimeout(resultRef.current); }, []);

    useEffect(() => {
        spinRef.current = rotation;
    }, [rotation]);

    useEffect(() => {
        try {
            const saved = projectStorage.getItem(LS_KEY);
            if (saved) {
                const parsed: unknown = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length >= 2 && parsed.length <= 12 && parsed.every(item => typeof item === "string" && item.trim() && item.length <= 30)) setItems(parsed);
            }
        } catch {}
    }, []);

    const saveItems = (next: string[]) => {
        setItems(next);
        try { projectStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
    };

    const addItem = () => {
        const t = newItem.trim();
        if (spinning || !t || items.length >= 12) return;
        saveItems([...items, t]);
        setNewItem("");
    };

    const removeItem = (i: number) => {
        if (spinning || items.length <= 2) return;
        const next = items.filter((_, idx) => idx !== i);
        saveItems(next);
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

        resultRef.current = setTimeout(() => {
            setWinner(items[targetIdx]);
            setWinnerIdx(targetIdx);
            setHistory(prev => [items[targetIdx], ...prev].slice(0, 10));
            setSpinning(false);
        }, 4200);
    }, [spinning, items]);

    const cardBg = darkMode ? "#1d1d1d" : "#ffffff";
    const border = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const n = items.length;
    const segDeg = n > 0 ? 360 / n : 360;
    const cx = 160; const cy = 160; const r = 148;

    return (
        <ToolPageLayout
            title={t("Spin the Wheel")}
            description={t("Randomly select from custom options with an animated spinning wheel")}
            icon={<SyncOutlined style={{ fontSize: 24, color: "#f97316" }} />}
            color="#f97316"
            learnMore={{
                whatIs: t("An animated wheel chooses equally among 2–12 custom options using Math.random. It is intended for casual choices."),
                howToUse: [t("Add or remove options before spinning. The selected option is highlighted and added to the last 10 results.")],
                tips: [t("Options are saved in the current workspace. Sample labels and your own labels keep their original text when you change language.")],
            }}
        >
            <Row className="signal-working-panes" gutter={[20, 20]}>
                {/* Wheel */}
                <Col xs={24} lg={14}>
                    <Card style={{ background: cardBg, textAlign: "center" }}>
                        <div className="signal-spin-wheel" style={{ position: "relative", display: "inline-block" }}>
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
                                style={{ display: "block", width: "100%", transformOrigin: "center" }}
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
                                {spinning ? t("Spinning…") : t("Spin!")}
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
                        <Card size="small" style={{ background: cardBg }} title={<Text strong>{t("Items")} <Tag>{items.length} / 12</Tag></Text>}>
                            <Space.Compact style={{ width: "100%", marginBottom: 12 }}>
                                <Input aria-label={t("Add option…")} dir="auto" style={{ fontSize: 16 }}
                                    value={newItem}
                                    onChange={e => setNewItem(e.target.value)}
                                    onPressEnter={addItem}
                                    placeholder={t("Add option…")}
                                    maxLength={30}
                                    disabled={spinning || items.length >= 12}
                                />
                                <Button aria-label={t("Add")} icon={<PlusOutlined />} onClick={addItem} disabled={spinning || !newItem.trim() || items.length >= 12} />
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
                                        <Button aria-label={t("Delete")}
                                            type="text" danger size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeItem(i)}
                                            disabled={spinning || items.length <= 2}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 8 }}>
                                <Button
                                    size="small" icon={<ReloadOutlined />}
                                    disabled={spinning}
                                    onClick={() => { if (spinning) return; saveItems(DEFAULT_ITEMS); setWinner(null); setWinnerIdx(null); }}
                                >
                                    {t("Reset to defaults")}</Button>
                            </div>
                        </Card>

                        {history.length > 0 && (
                            <Card size="small" style={{ background: cardBg }}
                                title={<Text strong>{t("Spin History")}</Text>}
                                extra={<Button size="small" danger onClick={() => setHistory([])}>{t("Clear")}</Button>}
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

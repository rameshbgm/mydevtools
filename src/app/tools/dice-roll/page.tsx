"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button, Card, Row, Col, Select, InputNumber, Typography, Space, Tag } from "antd";
import { ThunderboltOutlined, ReloadOutlined, HistoryOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { Text, Title } = Typography;

// ─── Dice SVG ────────────────────────────────────────────────────────────────

const DOT_POSITIONS: Record<number, Array<[number, number]>> = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

function D6Face({ value, size, color }: { value: number; size: number; color: string }) {
    const dots = DOT_POSITIONS[value] || [];
    const r = size / 7;
    return (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <rect x="4" y="4" width="92" height="92" rx="18" ry="18"
                fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
            <rect x="4" y="4" width="92" height="50" rx="18" ry="18"
                fill="rgba(255,255,255,0.08)" />
            {dots.map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.9)" />
            ))}
        </svg>
    );
}

function PolyDiceFace({ sides, value, size, color }: { sides: number; value: number; size: number; color: string }) {
    const label = value === sides ? "⚡" : String(value);
    const fontSize = value >= 10 ? 22 : 28;
    const shapes: Record<number, string> = {
        4:  "50,8 92,82 8,82",
        8:  "50,6 94,50 50,94 6,50",
        10: "50,8 88,34 88,66 50,92 12,66 12,34",
        12: "50,6 85,22 95,60 72,92 28,92 5,60 15,22",
        20: "50,6 90,32 82,78 18,78 10,32",
    };
    const shape = shapes[sides] || "50,6 94,50 50,94 6,50";

    return (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <polygon points={shape} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
            <polygon points={shape} fill="rgba(255,255,255,0.08)" clipPath="url(#top-half)" />
            <text
                x="50" y="58"
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="700"
                fill="rgba(255,255,255,0.92)"
                fontFamily="monospace"
            >
                {label}
            </text>
        </svg>
    );
}

function DiceFace({ sides, value, size, color, rolling }: {
    sides: number; value: number; size: number; color: string; rolling: boolean;
}) {
    return (
        <motion.div
            animate={rolling ? {
                rotate: [0, -15, 20, -10, 15, 0],
                scale: [1, 1.15, 0.95, 1.1, 1],
                transition: { duration: 0.7, ease: "easeInOut" }
            } : { rotate: 0, scale: 1 }}
            style={{ display: "inline-block", filter: rolling ? "blur(1px)" : "none" }}
        >
            {sides === 6
                ? <D6Face value={value} size={size} color={color} />
                : <PolyDiceFace sides={sides} value={value} size={size} color={color} />
            }
        </motion.div>
    );
}

// ─── Config ──────────────────────────────────────────────────────────────────

const DICE_TYPES = [4, 6, 8, 10, 12, 20] as const;
type DieType = typeof DICE_TYPES[number];

const DIE_COLORS: Record<DieType, string> = {
    4:  "#ef4444",
    6:  "#3b82f6",
    8:  "#8b5cf6",
    10: "#f59e0b",
    12: "#10b981",
    20: "#ec4899",
};

type RollMode = "normal" | "advantage" | "disadvantage";

interface HistoryEntry {
    id: string;
    sides: DieType;
    count: number;
    rolls: number[];
    total: number;
    mode: RollMode;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiceRollPage() {
    const { darkMode } = useAppStore();
    const { t } = useLanguage();

    const [mounted, setMounted] = useState(false);
    const [dieType, setDieType] = useState<DieType>(6);
    const [dieCount, setDieCount] = useState(2);
    const [mode, setMode] = useState<RollMode>("normal");
    const [rolling, setRolling] = useState(false);
    const [currentRolls, setCurrentRolls] = useState<number[]>([]);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => { setMounted(true); }, []);

    const animationRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const resultRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => {
        if (animationRef.current) clearInterval(animationRef.current);
        if (resultRef.current) clearTimeout(resultRef.current);
    }, []);

    const roll = useCallback(() => {
        if (rolling) return;
        setRolling(true);

        const count = mode === "normal" ? dieCount : 2;

        // Show animated random values during roll
        const animInterval = animationRef.current = setInterval(() => {
            setCurrentRolls(Array.from({ length: count }, () => Math.floor(Math.random() * dieType) + 1));
        }, 80);

        resultRef.current = setTimeout(() => {
            clearInterval(animInterval);
            const finalRolls = Array.from({ length: count }, () => Math.floor(Math.random() * dieType) + 1);
            setCurrentRolls(finalRolls);
            setRolling(false);

            const displayRolls = mode === "normal" ? finalRolls : [
                mode === "advantage" ? Math.max(...finalRolls) : Math.min(...finalRolls)
            ];
            const total = displayRolls.reduce((s, v) => s + v, 0);

            setHistory(h => [{
                id: Date.now().toString(36),
                sides: dieType,
                count: dieCount,
                rolls: finalRolls,
                total,
                mode,
            }, ...h].slice(0, 20));
        }, 700);
    }, [rolling, dieType, dieCount, mode]);

    const displayRolls = mode === "normal"
        ? currentRolls
        : currentRolls.length >= 2
            ? [mode === "advantage" ? Math.max(...currentRolls) : Math.min(...currentRolls)]
            : currentRolls;

    const total = displayRolls.reduce((s, v) => s + v, 0);
    const isMax = total === dieType * displayRolls.length;
    const isMin = total === displayRolls.length;
    const color = DIE_COLORS[dieType];

    const cardBg = darkMode ? "#1a1a1a" : "#ffffff";
    const muted = darkMode ? "#737373" : "#9a9a9a";
    const border = darkMode ? "#2a2a2a" : "#f0f0f0";

    return (
        <ToolPageLayout
            title={t("Dice Roll")}
            description={t("Roll any polyhedral dice — d4, d6, d8, d10, d12, d20")}
            icon={<ThunderboltOutlined style={{ fontSize: 24, color: "#8b5cf6" }} />}
            color="#8b5cf6"
            learnMore={{
                whatIs: t("Roll d4, d6, d8, d10, d12 or d20 dice locally. Advantage keeps the higher of two rolls; disadvantage keeps the lower."),
                howToUse: [t("Choose dice, count and mode, then roll. Configuration is locked during the animation.")],
                tips: [t("Results use Math.random, not a cryptographic generator. History keeps the last 20 rolls in this tab.")],
            }}
        >
            <Row gutter={[20, 20]}>
                {/* Config + Roll */}
                <Col xs={24} lg={14}>
                    <Card style={{ background: cardBg }}>
                        {/* Config row — deferred to client to avoid SSR/hydration mismatch on antd Select IDs */}
                        {mounted && (
                        <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
                            <Col xs={24} sm={8}>
                                <Text style={{ display: "block", fontSize: 11, fontWeight: 600, color: muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t("Die type")}</Text>
                                <Select aria-label={t("Die type")}
                                    disabled={rolling}
                                    value={dieType}
                                    onChange={(v) => { setDieType(v); setCurrentRolls([]); }}
                                    style={{ width: "100%" }}
                                    options={DICE_TYPES.map(d => ({ value: d, label: `d${d}` }))}
                                    size="large"
                                />
                            </Col>
                            <Col xs={12} sm={8}>
                                <Text style={{ display: "block", fontSize: 11, fontWeight: 600, color: muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t("Count")}</Text>
                                <InputNumber aria-label={t("Count")} precision={0}
                                    min={1} max={10} value={dieCount}
                                    onChange={(v) => { if (v) { setDieCount(Math.max(1, Math.min(10, Math.trunc(v)))); setCurrentRolls([]); } }}
                                    style={{ width: "100%" }}
                                    size="large"
                                    disabled={rolling || mode !== "normal"}
                                />
                            </Col>
                            <Col xs={12} sm={8}>
                                <Text style={{ display: "block", fontSize: 11, fontWeight: 600, color: muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t("Mode")}</Text>
                                <Select aria-label={t("Mode")}
                                    disabled={rolling}
                                    value={mode}
                                    onChange={next => { setMode(next); setCurrentRolls([]); }}
                                    style={{ width: "100%" }}
                                    size="large"
                                    options={[
                                        { value: "normal", label: t("Normal") },
                                        { value: "advantage", label: t("Advantage ↑") },
                                        { value: "disadvantage", label: t("Disadvantage ↓") },
                                    ]}
                                />
                            </Col>
                        </Row>
                        )}

                        {/* Dice display */}
                        <div style={{ minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 12, padding: "8px 0 20px" }}>
                            {currentRolls.length === 0 ? (
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ opacity: 0.6, marginBottom: 8 }}>
                                        {dieType === 6
                                            ? <D6Face value={1} size={90} color={color} />
                                            : <PolyDiceFace sides={dieType} value={Math.ceil(dieType / 2)} size={90} color={color} />
                                        }
                                    </div>
                                    <Text style={{ color: muted }}>{t("Press Roll to throw {count}d{sides}", { count: mode !== "normal" ? 2 : dieCount, sides: dieType })}</Text>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {currentRolls.map((val, i) => {
                                        const isKept = mode === "normal" || (
                                            mode === "advantage" ? val === Math.max(...currentRolls) : val === Math.min(...currentRolls)
                                        );
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, rotate: -20 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                style={{ opacity: mode !== "normal" && !isKept ? 0.35 : 1 }}
                                            >
                                                <DiceFace sides={dieType} value={val} size={90} color={color} rolling={rolling} />
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Total */}
                        {displayRolls.length > 0 && !rolling && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ textAlign: "center", marginBottom: 20, padding: "12px", borderRadius: 10, background: isMax ? "rgba(245,158,11,0.12)" : isMin ? "rgba(239,68,68,0.1)" : darkMode ? "#111" : "#f8fafc" }}
                            >
                                <Title level={1} style={{ margin: 0, color: isMax ? "#f59e0b" : isMin ? "#ef4444" : color, lineHeight: 1 }}>
                                    {total}
                                </Title>
                                {displayRolls.length > 1 && (
                                    <Text style={{ color: muted, fontSize: 12 }}>
                                        ({displayRolls.join(" + ")})
                                    </Text>
                                )}
                                {isMax && <div><Tag color="gold" style={{ marginTop: 4 }}>{t("⚡ Critical Hit!")}</Tag></div>}
                                {isMin && !isMax && <div><Tag color="red" style={{ marginTop: 4 }}>{t("Critical Fail")}</Tag></div>}
                            </motion.div>
                        )}

                        <Space.Compact block>
                            <Button
                                type="primary"
                                size="large"
                                icon={<ThunderboltOutlined />}
                                onClick={roll}
                                loading={rolling}
                                style={{ background: color, borderColor: color, fontWeight: 700, fontSize: 16, height: 48, flex: 1 }}
                            >
                                {rolling ? t("Rolling…") : t("Roll {count}d{sides}", { count: mode !== "normal" ? 2 : dieCount, sides: dieType })}
                            </Button>
                            <Button
                                size="large"
                                icon={<ReloadOutlined />}
                                onClick={() => setCurrentRolls([])}
                                disabled={rolling || currentRolls.length === 0}
                                style={{ height: 48 }}
                            >
                                {t("Reset")}</Button>
                        </Space.Compact>
                    </Card>
                </Col>

                {/* History */}
                <Col xs={24} lg={10}>
                    <Card
                        size="small"
                        title={
                            <Space>
                                <HistoryOutlined />
                                <Text style={{ fontSize: 13, fontWeight: 600 }}>{t("Roll History")}</Text>
                                {history.length > 0 && (
                                    <Button type="text" size="small" icon={<ReloadOutlined />}
                                        onClick={() => setHistory([])}
                                        style={{ color: muted, fontSize: 11 }}
                                    >{t("Clear")}</Button>
                                )}
                            </Space>
                        }
                        style={{ background: cardBg }}
                    >
                        {history.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "24px 0", color: muted, fontSize: 13 }}>
                                {t("No rolls yet")}</div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 380, overflowY: "auto" }}>
                                <AnimatePresence>
                                    {history.map((entry) => {
                                        const entryColor = DIE_COLORS[entry.sides];
                                        const maxPossible = entry.sides * (entry.mode === "normal" ? entry.count : 1);
                                        const minPossible = entry.mode === "normal" ? entry.count : 1;
                                        const entryIsMax = entry.total === maxPossible;
                                        const entryIsMin = entry.total === minPossible && !entryIsMax;
                                        return (
                                            <motion.div
                                                key={entry.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 10,
                                                    padding: "8px 10px",
                                                    borderRadius: 8,
                                                    background: darkMode ? "#111" : "#f8fafc",
                                                    border: `1px solid ${border}`,
                                                }}
                                            >
                                                <span style={{
                                                    width: 32, height: 32, borderRadius: 8,
                                                    background: entryColor,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
                                                }}>
                                                    {"d"}{entry.sides}
                                                </span>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 11, color: muted }}>
                                                        {entry.mode !== "normal" ? t(entry.mode === "advantage" ? "Advantage" : "Disadvantage") : t("{count} dice", { count: entry.count })}
                                                        {" · "}[{entry.rolls.join(", ")}]
                                                    </div>
                                                </div>
                                                <span style={{
                                                    fontSize: 18, fontWeight: 800,
                                                    color: entryIsMax ? "#f59e0b" : entryIsMin ? "#ef4444" : entryColor,
                                                    flexShrink: 0,
                                                }}>
                                                    {entry.total}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

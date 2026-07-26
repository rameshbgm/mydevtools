"use client";

import React, { useState, useCallback } from "react";
import { Button, Card, Row, Col, Statistic, Typography, Space, Switch, InputNumber } from "antd";
import { SyncOutlined, ReloadOutlined, ClearOutlined, StopOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { Text, Title } = Typography;

// ─── Coin SVG faces ──────────────────────────────────────────────────────────

function HeadsFace({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 200 200">
            <defs>
                <radialGradient id="heads-grad" cx="38%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#fde68a" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                </radialGradient>
                <radialGradient id="heads-rim" cx="50%" cy="50%" r="50%">
                    <stop offset="85%" stopColor="transparent" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="98" fill="url(#heads-grad)" />
            <circle cx="100" cy="100" r="98" fill="url(#heads-rim)" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
            {/* Crown */}
            <g fill="rgba(255,255,255,0.85)" transform="translate(100,100)">
                <polygon points="0,-36 -10,-16 -32,-20 -18,-4 -22,18 0,8 22,18 18,-4 32,-20 10,-16" />
                <circle cx="-22" cy="-22" r="5" fill="#ef4444" />
                <circle cx="0" cy="-38" r="5" fill="#3b82f6" />
                <circle cx="22" cy="-22" r="5" fill="#22c55e" />
            </g>
            <text x="100" y="155" textAnchor="middle" fontSize="14" fontWeight="700" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif" letterSpacing="3">HEADS</text>
        </svg>
    );
}

function TailsFace({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 200 200">
            <defs>
                <radialGradient id="tails-grad" cx="38%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#f1f5f9" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                </radialGradient>
                <radialGradient id="tails-rim" cx="50%" cy="50%" r="50%">
                    <stop offset="85%" stopColor="transparent" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="98" fill="url(#tails-grad)" />
            <circle cx="100" cy="100" r="98" fill="url(#tails-rim)" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            {/* Star */}
            <g transform="translate(100,96)">
                <polygon points="0,-36 8,-14 32,-14 14,4 22,28 0,16 -22,28 -14,4 -32,-14 -8,-14"
                    fill="rgba(255,255,255,0.85)" />
            </g>
            <text x="100" y="155" textAnchor="middle" fontSize="14" fontWeight="700" fill="rgba(255,255,255,0.6)" fontFamily="sans-serif" letterSpacing="3">TAILS</text>
        </svg>
    );
}

// ─── 3D Coin ─────────────────────────────────────────────────────────────────

interface CoinProps {
    result: "heads" | "tails" | null;
    isFlipping: boolean;
    size?: number;
}

function Coin({ result, isFlipping, size = 160 }: CoinProps) {
    return (
        <div style={{ perspective: 600, width: size, height: size, margin: "0 auto" }}>
            <motion.div
                style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d" }}
                animate={
                    isFlipping
                        ? { rotateY: [0, 360 * 4], transition: { duration: 1.4, ease: [0.17, 0.67, 0.83, 0.67] } }
                        : { rotateY: result === "tails" ? 180 : 0, transition: { duration: 0.4, ease: "easeOut" } }
                }
            >
                <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                    <HeadsFace size={size} />
                </div>
                <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <TailsFace size={size} />
                </div>
            </motion.div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoinTossPage() {
    const { darkMode } = useAppStore();

    const [result, setResult] = useState<"heads" | "tails" | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [stats, setStats] = useState({ heads: 0, tails: 0 });
    const [history, setHistory] = useState<Array<"heads" | "tails">>([]);
    const [autoFlip, setAutoFlip] = useState(false);
    const [autoInterval, setAutoInterval] = useState(1.5);
    const [autoMaxFlips, setAutoMaxFlips] = useState(0);
    const autoRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const flip = useCallback(() => {
        if (isFlipping) return;
        setIsFlipping(true);
        setResult(null);

        setTimeout(() => {
            const outcome: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
            setResult(outcome);
            setIsFlipping(false);
            setStats(s => ({ ...s, [outcome]: s[outcome] + 1 }));
            setHistory(h => [outcome, ...h].slice(0, 50));
        }, 1400);
    }, [isFlipping]);

    const clearStats = useCallback(() => {
        setStats({ heads: 0, tails: 0 });
        setHistory([]);
        setResult(null);
        setAutoFlip(false);
    }, []);

    // Auto-flip mode: after each flip completes, schedule the next one after the interval
    const autoStartedRef = React.useRef(false);
    React.useEffect(() => {
        const count = stats.heads + stats.tails;
        if (autoFlip && !isFlipping) {
            if (autoMaxFlips > 0 && count >= autoMaxFlips) {
                setAutoFlip(false);
                autoStartedRef.current = false;
                return;
            }
            // Skip the interval delay only for the very first flip (already triggered by Switch onChange)
            if (!autoStartedRef.current) {
                autoStartedRef.current = true;
                return;
            }
            autoRef.current = setTimeout(flip, autoInterval * 1000);
        }
        if (!autoFlip) autoStartedRef.current = false;
        return () => { if (autoRef.current) clearTimeout(autoRef.current); };
    }, [autoFlip, isFlipping, flip, autoInterval, autoMaxFlips, stats]);

    const total = stats.heads + stats.tails;
    const headsRate = total > 0 ? ((stats.heads / total) * 100).toFixed(1) : "—";
    const tailsRate = total > 0 ? ((stats.tails / total) * 100).toFixed(1) : "—";

    const accent = darkMode ? "#22d3ee" : "#0891b2";
    const cardBg = darkMode ? "#1a1a1a" : "#ffffff";
    const muted = darkMode ? "#737373" : "#9a9a9a";
    const border = darkMode ? "#2a2a2a" : "#f0f0f0";

    const resultLabel = result === "heads" ? "HEADS" : result === "tails" ? "TAILS" : null;
    const resultColor = result === "heads" ? "#f59e0b" : result === "tails" ? "#94a3b8" : accent;

    return (
        <ToolPageLayout
            title="Coin Toss"
            description="Flip a fair virtual coin — heads or tails"
            icon={<SyncOutlined style={{ fontSize: 24, color: "#f59e0b" }} />}
            color="#f59e0b"
            learnMore={{
                whatIs: "A fair virtual coin flip using a cryptographically seeded random number generator. Each flip is statistically independent with a 50/50 probability of heads or tails.",
                howToUse: [
                    "Click 'Flip Coin' to toss",
                    "Enable Auto Flip and set the interval and max count",
                    "Click Clear Stats to reset your session counters",
                ],
                tips: [
                    "Each flip is truly random — past results don't influence future ones",
                    "Use auto-flip to run a quick probability experiment",
                    "Over many flips, the ratio should converge toward 50/50",
                ],
            }}
        >
            <Row gutter={[20, 20]}>
                {/* Coin display */}
                <Col xs={24} lg={14}>
                    <Card style={{ background: cardBg, textAlign: "center" }}>
                        <div style={{ padding: "24px 0 16px" }}>
                            <Coin result={result} isFlipping={isFlipping} size={180} />
                        </div>

                        <AnimatePresence mode="wait">
                            {resultLabel && !isFlipping && (
                                <motion.div
                                    key={resultLabel}
                                    initial={{ opacity: 0, y: 12, scale: 0.85 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    style={{ marginBottom: 16 }}
                                >
                                    <Title level={2} style={{ margin: 0, color: resultColor, letterSpacing: 4 }}>
                                        {resultLabel}
                                    </Title>
                                </motion.div>
                            )}
                            {isFlipping && (
                                <motion.div
                                    key="flipping"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ marginBottom: 16 }}
                                >
                                    <Text style={{ color: muted, fontSize: 16 }}>Flipping…</Text>
                                </motion.div>
                            )}
                            {!resultLabel && !isFlipping && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ marginBottom: 16 }}
                                >
                                    <Text style={{ color: muted, fontSize: 15 }}>Press flip to toss the coin</Text>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Space size={12} wrap style={{ justifyContent: "center" }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<SyncOutlined spin={isFlipping} />}
                                onClick={flip}
                                disabled={isFlipping || autoFlip}
                                style={{ minWidth: 140, background: accent, borderColor: accent, fontWeight: 600 }}
                            >
                                {isFlipping ? "Flipping…" : "Flip Coin"}
                            </Button>
                            {autoFlip && (
                                <Button
                                    size="large"
                                    danger
                                    icon={<StopOutlined />}
                                    onClick={() => setAutoFlip(false)}
                                    style={{ fontWeight: 600 }}
                                >
                                    Stop
                                </Button>
                            )}
                        </Space>

                        {/* Auto flip config */}
                        <div style={{ marginTop: 20, padding: "16px 0 0", borderTop: `1px solid ${border}` }}>
                            <Space orientation="vertical" size={10} style={{ width: "100%" }}>
                                <Space wrap style={{ justifyContent: "center" }}>
                                    <Switch
                                        checked={autoFlip}
                                        onChange={(checked) => {
                                            setAutoFlip(checked);
                                            if (checked && !isFlipping) flip();
                                        }}
                                        size="small"
                                    />
                                    <Text style={{ color: muted, fontSize: 13 }}>Auto flip</Text>
                                    {autoFlip && total > 0 && autoMaxFlips > 0 && (
                                        <Text style={{ color: accent, fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
                                            {total} / {autoMaxFlips} flipped
                                        </Text>
                                    )}
                                    {autoFlip && total > 0 && autoMaxFlips === 0 && (
                                        <Text style={{ color: muted, fontSize: 12 }}>{total} flipped</Text>
                                    )}
                                </Space>

                                {autoFlip && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <Row gutter={12} style={{ maxWidth: 320, margin: "0 auto" }}>
                                            <Col span={12}>
                                                <Text style={{ color: muted, fontSize: 11, display: "block", marginBottom: 4 }}>
                                                    Interval (sec)
                                                </Text>
                                                <InputNumber
                                                    min={0.5}
                                                    max={60}
                                                    step={0.5}
                                                    value={autoInterval}
                                                    onChange={v => setAutoInterval(v ?? 1.5)}
                                                    size="small"
                                                    style={{ width: "100%" }}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <Text style={{ color: muted, fontSize: 11, display: "block", marginBottom: 4 }}>
                                                    Max flips (0 = ∞)
                                                </Text>
                                                <InputNumber
                                                    min={0}
                                                    max={10000}
                                                    value={autoMaxFlips}
                                                    onChange={v => setAutoMaxFlips(v ?? 0)}
                                                    size="small"
                                                    style={{ width: "100%" }}
                                                />
                                            </Col>
                                        </Row>
                                    </motion.div>
                                )}
                            </Space>
                        </div>
                    </Card>
                </Col>

                {/* Stats panel */}
                <Col xs={24} lg={10}>
                    <Space orientation="vertical" style={{ width: "100%" }} size={16}>
                        <Card size="small" style={{ background: cardBg }}>
                            <Row gutter={16}>
                                <Col span={12} style={{ textAlign: "center", borderRight: `1px solid ${border}` }}>
                                    <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 4 }}>👑</div>
                                    <Statistic title="Heads" value={stats.heads} styles={{ content: { color: "#f59e0b", fontWeight: 700 } }} />
                                    <Text style={{ fontSize: 11, color: muted }}>{headsRate}%</Text>
                                </Col>
                                <Col span={12} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 4 }}>⭐</div>
                                    <Statistic title="Tails" value={stats.tails} styles={{ content: { color: "#94a3b8", fontWeight: 700 } }} />
                                    <Text style={{ fontSize: 11, color: muted }}>{tailsRate}%</Text>
                                </Col>
                            </Row>
                            <div style={{ textAlign: "center", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${border}` }}>
                                <Text style={{ color: muted, fontSize: 12 }}>{total} flip{total !== 1 ? "s" : ""} total</Text>
                                {total > 0 && (
                                    <Button
                                        size="small"
                                        danger
                                        icon={<ClearOutlined />}
                                        onClick={clearStats}
                                        style={{ marginLeft: 8, fontSize: 11 }}
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>
                        </Card>

                        {history.length > 0 && (
                            <Card
                                size="small"
                                title={<Text style={{ fontSize: 12, fontWeight: 600 }}>Recent flips</Text>}
                                extra={
                                    <Button aria-label="Reset"
                                        type="text"
                                        size="small"
                                        icon={<ReloadOutlined />}
                                        onClick={() => setHistory([])}
                                        style={{ color: muted, fontSize: 11 }}
                                    />
                                }
                                style={{ background: cardBg }}
                            >
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                    {history.slice(0, 30).map((h, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            style={{
                                                width: 26, height: 26, borderRadius: "50%",
                                                background: h === "heads"
                                                    ? "radial-gradient(circle at 35% 35%, #fde68a, #f59e0b)"
                                                    : "radial-gradient(circle at 35% 35%, #e2e8f0, #94a3b8)",
                                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 12, flexShrink: 0,
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                            }}
                                        >
                                            {h === "heads" ? "H" : "T"}
                                        </motion.span>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </Space>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

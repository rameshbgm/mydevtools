"use client";

import React, { useState, useCallback } from "react";
import { Button, Card, Typography, Tag, Row, Col, Divider } from "antd";
import { QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { Text } = Typography;

const FORTUNES = [
    // Positive (10)
    { text: "It is certain.", type: "positive" as const },
    { text: "It is decidedly so.", type: "positive" as const },
    { text: "Without a doubt.", type: "positive" as const },
    { text: "Yes, definitely.", type: "positive" as const },
    { text: "You may rely on it.", type: "positive" as const },
    { text: "As I see it, yes.", type: "positive" as const },
    { text: "Most likely.", type: "positive" as const },
    { text: "Outlook good.", type: "positive" as const },
    { text: "Yes.", type: "positive" as const },
    { text: "Signs point to yes.", type: "positive" as const },
    // Neutral (5)
    { text: "Reply hazy, try again.", type: "neutral" as const },
    { text: "Ask again later.", type: "neutral" as const },
    { text: "Better not tell you now.", type: "neutral" as const },
    { text: "Cannot predict now.", type: "neutral" as const },
    { text: "Concentrate and ask again.", type: "neutral" as const },
    // Negative (5)
    { text: "Don't count on it.", type: "negative" as const },
    { text: "My reply is no.", type: "negative" as const },
    { text: "My sources say no.", type: "negative" as const },
    { text: "Outlook not so good.", type: "negative" as const },
    { text: "Very doubtful.", type: "negative" as const },
];

const TYPE_COLOR: Record<string, string> = {
    positive: "#22c55e",
    neutral: "#f59e0b",
    negative: "#ef4444",
};

const TYPE_LABEL: Record<string, string> = {
    positive: "Positive",
    neutral: "Neutral",
    negative: "Negative",
};

export default function Magic8BallPage() {
    const { darkMode } = useAppStore();
    const [question, setQuestion] = useState("");
    const [fortune, setFortune] = useState<typeof FORTUNES[0] | null>(null);
    const [shaking, setShaking] = useState(false);
    const [history, setHistory] = useState<Array<{ q: string; f: typeof FORTUNES[0] }>>([]);
    const [counts, setCounts] = useState({ positive: 0, neutral: 0, negative: 0 });

    const shake = useCallback(() => {
        if (shaking) return;
        setShaking(true);
        setFortune(null);

        setTimeout(() => {
            const f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
            setFortune(f);
            setShaking(false);
            setCounts(prev => ({ ...prev, [f.type]: prev[f.type] + 1 }));
            if (question.trim()) {
                setHistory(prev => [{ q: question.trim(), f }, ...prev].slice(0, 8));
            }
        }, 900);
    }, [shaking, question]);

    const reset = () => {
        setFortune(null);
        setQuestion("");
        setHistory([]);
        setCounts({ positive: 0, neutral: 0, negative: 0 });
    };

    const cardBg = darkMode ? "#1d1d1d" : "#ffffff";
    const border = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const total = counts.positive + counts.neutral + counts.negative;

    return (
        <ToolPageLayout
            title="Magic 8-Ball"
            description="Ask a yes/no question and let the Magic 8-Ball decide your fate"
            icon={<QuestionCircleOutlined style={{ fontSize: 24, color: "#6366f1" }} />}
            color="#6366f1"
            learnMore={{
                whatIs: "A digital recreation of the classic Magic 8-Ball toy. Ask any yes/no question, shake the ball, and receive one of 20 authentic responses across positive, neutral, and negative categories.",
                whyUse: "Perfect for settling debates, breaking decision paralysis, or just having fun. Tracks your question history and response distribution across all three outcome types.",
                howToUse: [
                    "Type your yes/no question (optional but more fun)",
                    "Click 'Ask the 8-Ball' or press Enter",
                    "Wait for the ball to stop shaking",
                    "Read your fate in the triangle window",
                ],
                tips: [
                    "All 20 responses are from the original Magic 8-Ball toy",
                    "10 positive, 5 neutral, 5 negative — same distribution as the original",
                    "History tracks the last 8 questions with answers",
                ],
                useCases: ["Team decision making", "Game nights", "Breaking ties", "General cosmic consultation"],
            }}
        >
            <Row gutter={[20, 20]}>
                {/* Ball */}
                <Col xs={24} lg={13}>
                    <Card style={{ background: cardBg, textAlign: "center" }}>
                        {/* Question input */}
                        <div style={{ maxWidth: 400, margin: "0 auto 24px" }}>
                            <input
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") shake(); }}
                                placeholder="Ask a yes or no question…"
                                style={{
                                    width: "100%",
                                    padding: "10px 16px",
                                    borderRadius: 8,
                                    border: `1px solid ${border}`,
                                    background: darkMode ? "#141414" : "#f8fafc",
                                    color: darkMode ? "#e5e7eb" : "#111827",
                                    fontSize: 14,
                                    outline: "none",
                                    textAlign: "center",
                                }}
                            />
                        </div>

                        {/* The Ball */}
                        <motion.div
                            animate={shaking ? {
                                x: [0, -18, 18, -14, 14, -8, 8, -4, 4, 0],
                                rotate: [0, -6, 6, -5, 5, -3, 3, -1, 1, 0],
                            } : { x: 0, rotate: 0 }}
                            transition={{ duration: 0.85, ease: "easeInOut" }}
                            style={{ display: "inline-block", cursor: shaking ? "default" : "pointer" }}
                            onClick={shaking ? undefined : shake}
                            whileHover={!shaking ? { scale: 1.03 } : {}}
                        >
                            <svg width={280} height={280} viewBox="0 0 280 280">
                                <defs>
                                    <radialGradient id="ballGrad" cx="38%" cy="32%" r="62%">
                                        <stop offset="0%" stopColor="#2d2060" />
                                        <stop offset="45%" stopColor="#0f0a30" />
                                        <stop offset="100%" stopColor="#040212" />
                                    </radialGradient>
                                    <radialGradient id="sheen" cx="35%" cy="25%" r="45%">
                                        <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                                    </radialGradient>
                                    <radialGradient id="triangleGrad" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#1a103d" />
                                        <stop offset="100%" stopColor="#0a0620" />
                                    </radialGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                    </filter>
                                </defs>

                                {/* Ball shadow */}
                                <ellipse cx={140} cy={270} rx={90} ry={10} fill="rgba(0,0,0,0.35)" />
                                {/* Main ball */}
                                <circle cx={140} cy={140} r={130} fill="url(#ballGrad)" />
                                {/* Sheen */}
                                <circle cx={140} cy={140} r={130} fill="url(#sheen)" />

                                {/* 8 label */}
                                <text x={140} y={90} textAnchor="middle" dominantBaseline="middle"
                                    fontSize={40} fontWeight="900" fill="white" opacity={0.12}
                                    style={{ userSelect: "none" }}>8</text>

                                {/* Triangle window */}
                                <polygon
                                    points="140,92 185,172 95,172"
                                    fill="url(#triangleGrad)"
                                    stroke="rgba(99,102,241,0.4)"
                                    strokeWidth={1.5}
                                />

                                {/* Fortune text */}
                                <AnimatePresence>
                                    {fortune && !shaking && (
                                        <foreignObject x={97} y={96} width={86} height={74}>
                                            <div
                                                style={{
                                                    width: "100%", height: "100%",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    textAlign: "center",
                                                    padding: "4px 2px",
                                                }}
                                            >
                                                <span style={{
                                                    fontSize: fortune.text.length > 14 ? 8 : 9,
                                                    fontWeight: 700,
                                                    color: TYPE_COLOR[fortune.type],
                                                    lineHeight: 1.3,
                                                    letterSpacing: "0.01em",
                                                    textTransform: "uppercase",
                                                    display: "block",
                                                }}>
                                                    {fortune.text}
                                                </span>
                                            </div>
                                        </foreignObject>
                                    )}
                                </AnimatePresence>

                                {/* Idle "8" in triangle */}
                                {!fortune && !shaking && (
                                    <text x={140} y={145} textAnchor="middle" dominantBaseline="middle"
                                        fontSize={34} fontWeight="900" fill="rgba(255,255,255,0.6)"
                                        style={{ userSelect: "none" }}>8</text>
                                )}

                                {/* Outer ring highlight */}
                                <circle cx={140} cy={140} r={130} fill="none"
                                    stroke="rgba(255,255,255,0.06)" strokeWidth={2} />
                            </svg>
                        </motion.div>

                        <div style={{ marginTop: 16 }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={shaking ? <ReloadOutlined spin /> : <QuestionCircleOutlined />}
                                onClick={shake}
                                disabled={shaking}
                                style={{ background: "#6366f1", borderColor: "#6366f1", minWidth: 160, height: 44 }}
                            >
                                {shaking ? "Shaking…" : "Ask the 8-Ball"}
                            </Button>
                        </div>

                        {/* Fortune display below ball */}
                        <AnimatePresence>
                            {fortune && !shaking && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ marginTop: 16 }}
                                >
                                    <Tag color={fortune.type === "positive" ? "success" : fortune.type === "negative" ? "error" : "warning"}
                                        style={{ fontSize: 14, padding: "4px 14px" }}>
                                        {TYPE_LABEL[fortune.type]}
                                    </Tag>
                                    <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, color: TYPE_COLOR[fortune.type] }}>
                                        {fortune.text}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </Col>

                {/* Stats + History */}
                <Col xs={24} lg={11}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Stats */}
                        {total > 0 && (
                            <Card size="small" style={{ background: cardBg }}
                                title={<Text strong>Response Stats ({total} asks)</Text>}
                                extra={<Button size="small" danger onClick={reset}>Reset</Button>}
                            >
                                {(["positive", "neutral", "negative"] as const).map(type => {
                                    const count = counts[type];
                                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                    return (
                                        <div key={type} style={{ marginBottom: 10 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                <Text style={{ fontSize: 12, color: TYPE_COLOR[type], fontWeight: 600 }}>
                                                    {TYPE_LABEL[type]}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>{count} ({pct}%)</Text>
                                            </div>
                                            <div style={{
                                                height: 8, borderRadius: 4,
                                                background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                                                overflow: "hidden",
                                            }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.5 }}
                                                    style={{ height: "100%", borderRadius: 4, background: TYPE_COLOR[type] }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </Card>
                        )}

                        {/* History */}
                        {history.length > 0 && (
                            <Card size="small" style={{ background: cardBg }} title={<Text strong>Question History</Text>}>
                                {history.map((h, i) => (
                                    <div key={i} style={{
                                        padding: "8px 0",
                                        borderBottom: i < history.length - 1 ? `1px solid ${border}` : "none",
                                        opacity: 1 - i * 0.09,
                                    }}>
                                        <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 2 }}>
                                            {h.q}
                                        </Text>
                                        <Text style={{ fontSize: 13, fontWeight: 600, color: TYPE_COLOR[h.f.type] }}>
                                            {h.f.text}
                                        </Text>
                                    </div>
                                ))}
                            </Card>
                        )}

                        {total === 0 && (
                            <Card size="small" style={{ background: cardBg, textAlign: "center" }}>
                                <div style={{ fontSize: 48, marginBottom: 8 }}>🎱</div>
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    Ask a question and shake the ball to reveal your destiny.
                                </Text>
                            </Card>
                        )}
                    </div>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Card, Typography, Tag, Row, Col, Select, Progress } from "antd";
import { ReloadOutlined, FontSizeOutlined, TrophyOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { Text } = Typography;

const TEXTS = [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.",
    "To be or not to be, that is the question. Whether tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
    "All that is gold does not glitter, not all those who wander are lost. The old that is strong does not wither, deep roots are not reached by the frost.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. First make it work, then make it right, then make it fast.",
    "The internet is becoming the town square for the global village of tomorrow. In a global economy, the currency of leadership is transparency, authenticity, and accountability.",
];

const DURATIONS = [
    { label: "15s", value: 15 },
    { label: "30s", value: 30 },
    { label: "60s", value: 60 },
    { label: "2min", value: 120 },
];

interface TestResult {
    wpm: number;
    accuracy: number;
    errors: number;
    duration: number;
    ts: number;
}

function calcWpm(correctChars: number, elapsedSec: number): number {
    if (elapsedSec < 1) return 0;
    return Math.round((correctChars / 5) / (elapsedSec / 60));
}

function calcAccuracy(typed: string, target: string): { accuracy: number; errors: number } {
    if (!typed.length) return { accuracy: 100, errors: 0 };
    let errors = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] !== target[i]) errors++;
    }
    const accuracy = Math.round(((typed.length - errors) / typed.length) * 100);
    return { accuracy, errors };
}

export default function TypingTestPage() {
    const { darkMode } = useAppStore();
    const [duration, setDuration] = useState(60);
    const [textIdx, setTextIdx] = useState(0);
    const [typed, setTyped] = useState("");
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [results, setResults] = useState<TestResult[]>([]);
    const [mounted, setMounted] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { setTimeLeft(duration); }, [duration]);

    const target = TEXTS[textIdx];

    const startTimer = useCallback(() => {
        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const left = Math.max(0, duration - elapsed);
            setTimeLeft(left);
            if (left === 0) {
                clearInterval(intervalRef.current!);
                setFinished(true);
            }
        }, 250);
    }, [duration]);

    const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (finished) return;

        if (!started) {
            setStarted(true);
            startTimer();
        }

        // Cap at target length
        if (val.length <= target.length) {
            setTyped(val);
        }

        // Auto-finish when full text typed correctly
        if (val === target) {
            clearInterval(intervalRef.current!);
            setFinished(true);
        }
    }, [finished, started, startTimer, target]);

    useEffect(() => {
        if (finished) {
            const elapsed = started ? Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000)) : duration;
            const correctChars = typed.split("").filter((c, i) => c === target[i]).length;
            const { accuracy, errors } = calcAccuracy(typed, target);
            const wpm = calcWpm(correctChars, elapsed);
            const result: TestResult = { wpm, accuracy, errors, duration: elapsed, ts: Date.now() };
            setResults(prev => [result, ...prev].slice(0, 5));
        }
    }, [finished]);

    const reset = () => {
        clearInterval(intervalRef.current!);
        setTyped("");
        setStarted(false);
        setFinished(false);
        setTimeLeft(duration);
        setTextIdx(Math.floor(Math.random() * TEXTS.length));
        setTimeout(() => textareaRef.current?.focus(), 50);
    };

    // Live stats
    const elapsed = started ? Math.max(1, (duration - timeLeft)) : 0;
    const correctChars = typed.split("").filter((c, i) => c === target[i]).length;
    const liveWpm = started ? calcWpm(correctChars, elapsed) : 0;
    const { accuracy: liveAccuracy, errors: liveErrors } = calcAccuracy(typed, target);
    const progress = Math.round((timeLeft / duration) * 100);
    const progressColor = timeLeft > duration * 0.5 ? "#22c55e" : timeLeft > duration * 0.2 ? "#f59e0b" : "#ef4444";

    const cardBg = darkMode ? "#1d1d1d" : "#ffffff";
    const border = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const muted = darkMode ? "#6b7280" : "#9ca3af";

    // Character render
    const renderText = () => {
        return target.split("").map((char, i) => {
            let color = muted;
            let bg = "transparent";
            let fontWeight: number | string = 400;
            if (i < typed.length) {
                const correct = typed[i] === char;
                color = correct ? (darkMode ? "#86efac" : "#16a34a") : "#ef4444";
                bg = correct ? "transparent" : (darkMode ? "rgba(239,68,68,0.18)" : "rgba(239,68,68,0.12)");
                fontWeight = 500;
            } else if (i === typed.length) {
                // Cursor position
                bg = darkMode ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.25)";
                color = darkMode ? "#e5e7eb" : "#111827";
            } else {
                color = darkMode ? "#9ca3af" : "#6b7280";
            }
            return (
                <span key={i} style={{ color, background: bg, fontWeight, borderRadius: 2 }}>
                    {char === " " ? " " : char}
                </span>
            );
        });
    };

    return (
        <ToolPageLayout
            title="Typing Speed Test"
            description="Measure your typing speed in WPM with real-time accuracy tracking"
            icon={<FontSizeOutlined style={{ fontSize: 24, color: "#06b6d4" }} />}
            color="#06b6d4"
            learnMore={{
                whatIs: "A typing speed test that measures your words per minute (WPM) and accuracy in real time. Characters highlight green for correct, red for incorrect, and faded for untyped. Finishes when the timer runs out or you complete the passage.",
                whyUse: "Track your typing progress over time, warm up before a coding session, or compete with yourself. Results history shows your last 5 tests.",
                howToUse: [
                    "Choose a duration (15s, 30s, 60s, or 2 minutes)",
                    "Click the text area and start typing — the timer starts on your first keystroke",
                    "Green = correct, red = error, faded = not yet typed",
                    "Results are shown when time runs out or you finish the text",
                    "Click Restart to try a new passage",
                ],
                tips: [
                    "WPM = correct characters ÷ 5 ÷ minutes (standard formula)",
                    "Focus on accuracy first — errors waste time on corrections",
                    "Shorter durations (15–30s) give higher burst WPM; 60s+ is more representative",
                ],
                useCases: ["Typing practice", "Pre-coding warm-up", "Measuring progress", "Friendly competitions"],
            }}
        >
            <Row gutter={[20, 20]}>
                {/* Main test area */}
                <Col xs={24} lg={16}>
                    <Card style={{ background: cardBg }}>
                        {/* Controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                            {mounted && (
                                <Select
                                    value={duration}
                                    onChange={v => { setDuration(v); reset(); }}
                                    options={DURATIONS}
                                    disabled={started && !finished}
                                    style={{ width: 90 }}
                                />
                            )}
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={reset}
                                size="small"
                            >
                                Restart
                            </Button>
                            <div style={{ flex: 1 }} />
                            {/* Timer */}
                            <div style={{
                                fontFamily: "var(--font-geist-mono), monospace",
                                fontSize: 28,
                                fontWeight: 800,
                                color: progressColor,
                                minWidth: 50,
                                textAlign: "right",
                                fontVariantNumeric: "tabular-nums",
                            }}>
                                {timeLeft}s
                            </div>
                        </div>

                        {/* Progress bar */}
                        <Progress
                            percent={progress}
                            showInfo={false}
                            strokeColor={progressColor}
                            railColor={darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
                            style={{ marginBottom: 16 }}
                        />

                        {/* Text display */}
                        <div
                            style={{
                                fontFamily: "var(--font-geist-mono), monospace",
                                fontSize: 16,
                                lineHeight: 1.9,
                                letterSpacing: "0.03em",
                                padding: "16px",
                                background: darkMode ? "#141414" : "#f8fafc",
                                borderRadius: 8,
                                marginBottom: 16,
                                minHeight: 110,
                                userSelect: "none",
                                border: `1px solid ${border}`,
                                wordBreak: "break-word",
                            }}
                        >
                            {renderText()}
                        </div>

                        {/* Hidden textarea for input capture */}
                        <textarea
                            ref={textareaRef}
                            value={typed}
                            onChange={handleInput}
                            disabled={finished}
                            autoFocus
                            aria-label="Typing test input"
                            title="Typing test input"
                            spellCheck={false}
                            autoCorrect="off"
                            autoCapitalize="off"
                            style={{
                                position: "absolute",
                                opacity: 0,
                                pointerEvents: finished ? "none" : "all",
                                width: 1,
                                height: 1,
                                overflow: "hidden",
                            }}
                        />

                        {/* Click to focus overlay when not started */}
                        {!started && !finished && (
                            <div
                                onClick={() => textareaRef.current?.focus()}
                                style={{
                                    textAlign: "center",
                                    padding: "8px 0",
                                    cursor: "text",
                                    color: muted,
                                    fontSize: 13,
                                }}
                            >
                                Click here and start typing to begin the test
                            </div>
                        )}

                        {/* Live stats */}
                        <Row gutter={16} style={{ marginTop: 16 }}>
                            {[
                                { label: "WPM", value: liveWpm, color: "#06b6d4" },
                                { label: "Accuracy", value: `${liveAccuracy}%`, color: liveAccuracy >= 90 ? "#22c55e" : liveAccuracy >= 70 ? "#f59e0b" : "#ef4444" },
                                { label: "Errors", value: liveErrors, color: liveErrors === 0 ? "#22c55e" : "#ef4444" },
                                { label: "Chars", value: typed.length, color: muted },
                            ].map(stat => (
                                <Col span={6} key={stat.label} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, fontVariantNumeric: "tabular-nums" }}>
                                        {stat.value}
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                        {stat.label}
                                    </Text>
                                </Col>
                            ))}
                        </Row>
                    </Card>

                    {/* Finished result */}
                    <AnimatePresence>
                        {finished && results.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{ marginTop: 16 }}
                            >
                                <Card style={{
                                    background: darkMode ? "#1a1a2e" : "#f0f7ff",
                                    border: "2px solid #06b6d4",
                                    textAlign: "center",
                                }}>
                                    <TrophyOutlined style={{ fontSize: 28, color: "#f59e0b", marginBottom: 8 }} />
                                    <div style={{ fontSize: 48, fontWeight: 900, color: "#06b6d4", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                                        {results[0].wpm}
                                        <span style={{ fontSize: 18, fontWeight: 600, color: muted, marginLeft: 4 }}>WPM</span>
                                    </div>
                                    <div style={{ marginTop: 8, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                                        <Tag color={results[0].accuracy >= 90 ? "success" : results[0].accuracy >= 70 ? "warning" : "error"}>
                                            {results[0].accuracy}% accuracy
                                        </Tag>
                                        <Tag color={results[0].errors === 0 ? "success" : "default"}>
                                            {results[0].errors} error{results[0].errors !== 1 ? "s" : ""}
                                        </Tag>
                                        <Tag>{results[0].duration}s</Tag>
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<ReloadOutlined />}
                                        onClick={reset}
                                        style={{ marginTop: 16, background: "#06b6d4", borderColor: "#06b6d4" }}
                                    >
                                        Try Again
                                    </Button>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Col>

                {/* History */}
                <Col xs={24} lg={8}>
                    <Card size="small" style={{ background: cardBg }} title={<Text strong>History</Text>}>
                        {results.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "24px 0" }}>
                                <div style={{ fontSize: 36, marginBottom: 8 }}>⌨️</div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Complete a test to see results</Text>
                            </div>
                        ) : (
                            results.map((r, i) => (
                                <div key={r.ts} style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "8px 0",
                                    borderBottom: i < results.length - 1 ? `1px solid ${border}` : "none",
                                    opacity: 1 - i * 0.12,
                                }}>
                                    <div style={{
                                        fontSize: 20, fontWeight: 800, color: "#06b6d4",
                                        minWidth: 44, fontVariantNumeric: "tabular-nums",
                                    }}>
                                        {r.wpm}
                                        <span style={{ fontSize: 9, color: muted, fontWeight: 500, marginLeft: 2 }}>WPM</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div>
                                            <Tag color={r.accuracy >= 90 ? "success" : r.accuracy >= 70 ? "warning" : "error"} style={{ fontSize: 10 }}>
                                                {r.accuracy}%
                                            </Tag>
                                            <Text type="secondary" style={{ fontSize: 10 }}>{r.duration}s</Text>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 10 }}>{r.errors} error{r.errors !== 1 ? "s" : ""}</Text>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

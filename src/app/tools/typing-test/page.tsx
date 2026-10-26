"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Card, Typography, Tag, Row, Col, Select, Progress } from "antd";
import { ReloadOutlined, FontSizeOutlined, TrophyOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
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
    const { t } = useLanguage();
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

    useEffect(() => { setMounted(true); return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, []);
    useEffect(() => { setTimeLeft(duration); }, [duration]);

    const target = TEXTS[textIdx];

    const latestTyped = useRef(typed);
    useEffect(() => { latestTyped.current = typed; }, [typed]);
    const recorded = useRef(false);
    const finish = useCallback((value: string) => {
        if (recorded.current) return;
        recorded.current = true;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setFinished(true);
        const elapsed = Math.max(1, Math.min(duration, (Date.now() - startTimeRef.current) / 1000));
        const correctChars = value.split("").filter((c, i) => c === target[i]).length;
        const { accuracy, errors } = calcAccuracy(value, target);
        setResults(prev => [{ wpm: calcWpm(correctChars, elapsed), accuracy, errors, duration: Math.round(elapsed * 100) / 100, ts: Date.now() }, ...prev].slice(0, 5));
    }, [duration, target]);

    const startTimer = useCallback(() => {
        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const left = Math.max(0, duration - elapsed);
            setTimeLeft(left);
            if (left === 0) {
                clearInterval(intervalRef.current!);
                finish(latestTyped.current);
            }
        }, 250);
    }, [duration, finish]);

    const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (finished) return;

        if (!started && !val.length) return;
        if (!started) {
            setStarted(true);
            startTimer();
        }

        // Cap at target length
        if (val.length <= target.length) {
            latestTyped.current = val;
            setTyped(val);
        }

        // Auto-finish when full text typed correctly
        if (val === target) {
            clearInterval(intervalRef.current!);
            finish(val);
        }
    }, [finished, started, startTimer, target, finish]);


    const reset = (nextDuration = duration) => {
        recorded.current = false;
        latestTyped.current = "";
        clearInterval(intervalRef.current!);
        setTyped("");
        setStarted(false);
        setFinished(false);
        setTimeLeft(nextDuration);
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
            title={t("Typing Speed Test")}
            description={t("Measure your typing speed in WPM with real-time accuracy tracking")}
            icon={<FontSizeOutlined style={{ fontSize: 24, color: "var(--wb-accent)" }} />}
            color="#06b6d4"
            learnMore={{
                whatIs: t("Practice typing with fixed English passages. WPM is correct characters divided by five and by elapsed minutes; accuracy compares your current text with the passage."),
                howToUse: [t("Choose a duration and type to start. The test ends when time runs out or the full passage matches. Restart selects a new passage.")],
                tips: [t("The interface language does not change the English practice passage or reset a running test. The last five results stay in this tab.")],
            }}
        >
            <Row gutter={[20, 20]}>
                {/* Main test area */}
                <Col xs={24} lg={16}>
                    <Card style={{ background: cardBg }}>
                        {/* Controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                            {mounted && (
                                <Select aria-label={t("Custom Duration")}
                                    value={duration}
                                    onChange={v => { setDuration(v); reset(v); }}
                                    options={DURATIONS.map(option => ({ ...option, label: t(option.label) }))}
                                    disabled={started && !finished}
                                    style={{ width: 90 }}
                                />
                            )}
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => reset()}
                                size="small"
                            >
                                {t("Restart")}</Button>
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
                                {timeLeft}{t("s")}</div>
                        </div>

                        {/* Progress bar */}
                        <Progress
                            percent={progress}
                            showInfo={false}
                            strokeColor={progressColor}
                            railColor={darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
                            style={{ marginBottom: 16 }}
                        />

                        <Text type="secondary">{t("English practice passage")}</Text>
                        {/* Text display */}
                        <div dir="ltr"
                            style={{
                                fontFamily: "var(--font-geist-mono), monospace",
                                fontSize: 16,
                                lineHeight: 1.9,
                                letterSpacing: "0.03em",
                                padding: "16px",
                                background: darkMode ? "var(--wb-card-bg)" : "var(--wb-card-bg)",
                                borderRadius: 6,
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
                        <textarea dir="ltr"
                            ref={textareaRef}
                            value={typed}
                            onChange={handleInput}
                            disabled={finished}
                            autoFocus
                            aria-label={t("Typing test input")}
                            title={t("Typing test input")}
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
                                {t("Click here and start typing to begin the test")}</div>
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
                                        {t(stat.label)}
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
                                    <div style={{ fontSize: 48, fontWeight: 900, color: "var(--wb-accent)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                                        {results[0].wpm}
                                        <span style={{ fontSize: 18, fontWeight: 600, color: muted, marginLeft: 4 }}>{t("WPM")}</span>
                                    </div>
                                    <div style={{ marginTop: 8, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                                        <Tag color={results[0].accuracy >= 90 ? "success" : results[0].accuracy >= 70 ? "warning" : "error"}>
                                            {t("{percent}% accuracy", { percent: results[0].accuracy })}
                                        </Tag>
                                        <Tag color={results[0].errors === 0 ? "success" : "default"}>
                                            {t("{count} errors", { count: results[0].errors })}
                                        </Tag>
                                        <Tag>{results[0].duration}{t("s")}</Tag>
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<ReloadOutlined />}
                                        onClick={() => reset()}
                                        style={{ marginTop: 16, background: "var(--wb-accent-soft)", borderColor: "var(--wb-accent)" }}
                                    >
                                        {t("Try Again")}</Button>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Col>

                {/* History */}
                <Col xs={24} lg={8}>
                    <Card size="small" style={{ background: cardBg }} title={<Text strong>{t("History")}</Text>}>
                        {results.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "24px 0" }}>
                                <div style={{ fontSize: 36, marginBottom: 8 }}>⌨️</div>
                                <Text type="secondary" style={{ fontSize: 12 }}>{t("Complete a test to see results")}</Text>
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
                                        fontSize: 20, fontWeight: 800, color: "var(--wb-accent)",
                                        minWidth: 44, fontVariantNumeric: "tabular-nums",
                                    }}>
                                        {r.wpm}
                                        <span style={{ fontSize: 9, color: muted, fontWeight: 500, marginLeft: 2 }}>{t("WPM")}</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div>
                                            <Tag color={r.accuracy >= 90 ? "success" : r.accuracy >= 70 ? "warning" : "error"} style={{ fontSize: 10 }}>
                                                {r.accuracy}%
                                            </Tag>
                                            <Text type="secondary" style={{ fontSize: 10 }}>{r.duration}{t("s")}</Text>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 10 }}>{t("{count} errors", { count: r.errors })}</Text>
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

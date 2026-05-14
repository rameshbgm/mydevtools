"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Card, Input, InputNumber, Space, Typography, Tooltip, Progress, Row, Col } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, SoundOutlined, ClockCircleOutlined, CheckCircleOutlined, BellOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;

const PRESETS: { label: string; seconds: number }[] = [
    { label: "1 min", seconds: 60 },
    { label: "5 min", seconds: 300 },
    { label: "10 min", seconds: 600 },
    { label: "15 min", seconds: 900 },
    { label: "25 min", seconds: 1500 },
    { label: "30 min", seconds: 1800 },
    { label: "1 hr", seconds: 3600 },
];

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

const r4 = (n: number) => Math.round(n * 1e4) / 1e4;

// SVG tick marks overlay on the progress ring
function RingTicks({ size, color }: { size: number; color: string }) {
    const cx = size / 2;
    const r = size / 2 - 8;
    return (
        <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            {Array.from({ length: 60 }, (_, i) => {
                const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
                const isMajor = i % 5 === 0;
                const innerR = r - (isMajor ? 11 : 5);
                const x1 = r4(cx + innerR * Math.cos(angle));
                const y1 = r4(cx + innerR * Math.sin(angle));
                const x2 = r4(cx + r * Math.cos(angle));
                const y2 = r4(cx + r * Math.sin(angle));
                return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={color} strokeWidth={isMajor ? 2.5 : 1}
                        strokeOpacity={isMajor ? 0.45 : 0.15} strokeLinecap="round" />
                );
            })}
        </svg>
    );
}

function playAlarmChime(): void {
    try {
        const ctx = new AudioContext();
        const tones = [523.25, 659.25, 783.99];
        tones.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.35);
            gain.gain.setValueAtTime(0.5, ctx.currentTime + i * 0.35);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.35 + 0.3);
            osc.start(ctx.currentTime + i * 0.35);
            osc.stop(ctx.currentTime + i * 0.35 + 0.35);
        });
        setTimeout(() => ctx.close(), 2000);
    } catch {
        // AudioContext not available
    }
}

export default function TimerPage() {
    const { darkMode } = useAppStore();

    const [mounted, setMounted] = useState<boolean>(false);
    useEffect(() => { setMounted(true); }, []);

    const [totalSeconds, setTotalSeconds] = useState<number>(1500);
    const [remainingSeconds, setRemainingSeconds] = useState<number>(1500);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [timerLabel, setTimerLabel] = useState<string>("");
    const [sessions, setSessions] = useState<number>(0);

    const [inputHours, setInputHours] = useState<number>(0);
    const [inputMinutes, setInputMinutes] = useState<number>(25);
    const [inputSeconds, setInputSeconds] = useState<number>(0);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setRemainingSeconds((prev) => {
                    if (prev <= 1) {
                        clearTimer();
                        setIsRunning(false);
                        setIsComplete(true);
                        setSessions(s => s + 1);
                        playAlarmChime();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearTimer();
        }
        return clearTimer;
    }, [isRunning, clearTimer]);

    const applyCustomDuration = useCallback(() => {
        const total = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
        if (total <= 0) return;
        clearTimer();
        setIsRunning(false);
        setIsComplete(false);
        setTotalSeconds(total);
        setRemainingSeconds(total);
    }, [inputHours, inputMinutes, inputSeconds, clearTimer]);

    const applyPreset = useCallback((seconds: number) => {
        clearTimer();
        setIsRunning(false);
        setIsComplete(false);
        setTotalSeconds(seconds);
        setRemainingSeconds(seconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        setInputHours(h);
        setInputMinutes(m);
        setInputSeconds(s);
    }, [clearTimer]);

    const handleStart = useCallback(() => {
        if (remainingSeconds <= 0) return;
        setIsComplete(false);
        setIsRunning(true);
    }, [remainingSeconds]);

    const handlePause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const handleReset = useCallback(() => {
        clearTimer();
        setIsRunning(false);
        setIsComplete(false);
        setRemainingSeconds(totalSeconds);
    }, [clearTimer, totalSeconds]);

    const progressPercent = totalSeconds > 0 ? Math.round(((totalSeconds - remainingSeconds) / totalSeconds) * 100) : 0;
    const strokeColor = isComplete ? "#10b981" : "#6366f1";

    const cardBg = "var(--wb-card-solid-bg)";
    const cardBorder = "var(--wb-card-border)";
    const textColor = "var(--wb-text-heading)";
    const secondaryColor = "var(--wb-text-muted)";

    return (
        <ToolPageLayout
            title="Timer"
            description="Countdown timer with presets, custom duration, and audio chime — runs entirely in your browser"
            icon={<ClockCircleOutlined />}
            color="#6366f1"
            learnMore={{
                whatIs: "A countdown timer that runs entirely in your browser — no server, no tracking. Set any duration and get an audio alert when time is up.",
                whyUse: "Pomodoro technique sessions, cooking timers, meeting time-boxing, focus sprints, and lab timers.",
                howToUse: ["Pick a preset or enter custom hours/minutes/seconds", "Optionally give your timer a name", "Hit Start — the ring shows progress", "A chime plays when time is up"],
                tips: ["The timer keeps running if you switch tabs", "Sound uses Web Audio API — no permissions needed", "Refresh resets the timer"],
                useCases: ["25-min Pomodoro focus blocks", "5-min breaks", "Presentation time limits", "Recipe cooking times"],
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={14}>
                    <AnimatePresence mode="wait">
                        {isComplete ? (
                            <motion.div
                                key="complete"
                                animate={{
                                    boxShadow: [
                                        "0 0 0 0 rgba(16,185,129,0)",
                                        "0 0 20px 8px rgba(16,185,129,0.4)",
                                        "0 0 0 0 rgba(16,185,129,0)",
                                    ],
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ borderRadius: 16 }}
                            >
                                <Card
                                    style={{
                                        background: cardBg,
                                        border: `2px solid #10b981`,
                                        borderRadius: 16,
                                        textAlign: "center",
                                    }}
                                >
                                    <Space orientation="vertical" size={24} style={{ width: "100%" }}>
                                        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                            <Progress
                                                type="circle"
                                                percent={100}
                                                size={240}
                                                strokeColor="#10b981"
                                                strokeWidth={6}
                                                format={() => null}
                                            />
                                            <RingTicks size={240} color="#10b981" />
                                            <div style={{ position: "absolute", textAlign: "center" }}>
                                                <div style={{ fontSize: 64, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#10b981", lineHeight: 1, letterSpacing: "-2px" }}>
                                                    {formatTime(0)}
                                                </div>
                                                {sessions > 0 && (
                                                    <Text style={{ fontSize: 12, color: "#10b981", opacity: 0.75 }}>
                                                        Session {sessions}
                                                    </Text>
                                                )}
                                            </div>
                                        </div>

                                        <Space orientation="vertical" size={8}>
                                            <Space>
                                                <CheckCircleOutlined style={{ color: "#10b981", fontSize: 24 }} />
                                                <Text style={{ color: "#10b981", fontSize: 22, fontWeight: 600 }}>
                                                    Time&apos;s Up!
                                                </Text>
                                            </Space>
                                            {timerLabel && (
                                                <Text style={{ color: secondaryColor, fontSize: 16 }}>{timerLabel}</Text>
                                            )}
                                        </Space>

                                        <Button
                                            size="large"
                                            icon={<ReloadOutlined />}
                                            onClick={handleReset}
                                            style={{
                                                background: "#10b981",
                                                borderColor: "#10b981",
                                                color: "#fff",
                                                fontWeight: 600,
                                                height: 44,
                                                paddingInline: 32,
                                            }}
                                        >
                                            Reset
                                        </Button>
                                    </Space>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Card
                                    style={{
                                        background: cardBg,
                                        border: `1px solid ${cardBorder}`,
                                        borderRadius: 16,
                                        textAlign: "center",
                                    }}
                                >
                                    <Space orientation="vertical" size={24} style={{ width: "100%" }}>
                                        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                            {isRunning && (
                                                <motion.div
                                                    style={{ position: "absolute", width: 252, height: 252, borderRadius: "50%", background: `radial-gradient(circle, ${strokeColor}18 0%, transparent 70%)` }}
                                                    animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                />
                                            )}
                                            <Progress
                                                type="circle"
                                                percent={progressPercent}
                                                size={240}
                                                strokeColor={strokeColor}
                                                strokeWidth={6}
                                                format={() => null}
                                            />
                                            <RingTicks size={240} color={isRunning ? strokeColor : (darkMode ? "#ffffff" : "#000000")} />
                                            <div style={{ position: "absolute", textAlign: "center" }}>
                                                <div style={{ fontSize: 64, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: textColor, lineHeight: 1, letterSpacing: "-2px" }}>
                                                    {formatTime(remainingSeconds)}
                                                </div>
                                                {sessions > 0 && (
                                                    <Text style={{ fontSize: 12, color: strokeColor, opacity: 0.8 }}>
                                                        {sessions} session{sessions !== 1 ? "s" : ""} done
                                                    </Text>
                                                )}
                                            </div>
                                        </div>

                                        {timerLabel && (
                                            <Text style={{ color: secondaryColor, fontSize: 16 }}>{timerLabel}</Text>
                                        )}

                                        <Space size={12}>
                                            {!isRunning ? (
                                                <Tooltip title={remainingSeconds === 0 ? "Reset to start" : "Start"}>
                                                    <Button
                                                        size="large"
                                                        icon={<PlayCircleOutlined />}
                                                        onClick={handleStart}
                                                        disabled={remainingSeconds === 0}
                                                        style={{
                                                            background: "#6366f1",
                                                            borderColor: "#6366f1",
                                                            color: "#fff",
                                                            fontWeight: 600,
                                                            height: 44,
                                                            paddingInline: 28,
                                                        }}
                                                    >
                                                        Start
                                                    </Button>
                                                </Tooltip>
                                            ) : (
                                                <Button
                                                    size="large"
                                                    icon={<PauseCircleOutlined />}
                                                    onClick={handlePause}
                                                    style={{
                                                        background: "#f59e0b",
                                                        borderColor: "#f59e0b",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        height: 44,
                                                        paddingInline: 28,
                                                    }}
                                                >
                                                    Pause
                                                </Button>
                                            )}
                                            <Tooltip title="Reset">
                                                <Button
                                                    size="large"
                                                    icon={<ReloadOutlined />}
                                                    onClick={handleReset}
                                                    style={{
                                                        height: 44,
                                                        paddingInline: 20,
                                                        borderColor: cardBorder,
                                                        color: textColor,
                                                        background: "transparent",
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                            </Tooltip>
                                        </Space>
                                    </Space>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Col>

                <Col xs={24} lg={10}>
                    <Space orientation="vertical" size={20} style={{ width: "100%" }}>
                        <Card
                            title={
                                <Text style={{ color: textColor, fontWeight: 600 }}>Presets</Text>
                            }
                            style={{
                                background: cardBg,
                                border: `1px solid ${cardBorder}`,
                                borderRadius: 12,
                            }}
                            styles={{ body: { paddingTop: 12 } }}
                        >
                            <Space wrap>
                                {PRESETS.map((p) => (
                                    <Button
                                        key={p.label}
                                        size="small"
                                        onClick={() => applyPreset(p.seconds)}
                                        style={{
                                            borderColor: totalSeconds === p.seconds ? "#6366f1" : cardBorder,
                                            color: totalSeconds === p.seconds ? "#6366f1" : secondaryColor,
                                            background: totalSeconds === p.seconds
                                                ? darkMode ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)"
                                                : "transparent",
                                            fontWeight: totalSeconds === p.seconds ? 600 : 400,
                                        }}
                                    >
                                        {p.label}
                                    </Button>
                                ))}
                            </Space>
                        </Card>

                        <Card
                            title={
                                <Text style={{ color: textColor, fontWeight: 600 }}>Custom Duration</Text>
                            }
                            style={{
                                background: cardBg,
                                border: `1px solid ${cardBorder}`,
                                borderRadius: 12,
                            }}
                            styles={{ body: { paddingTop: 12 } }}
                        >
                            <Space orientation="vertical" size={12} style={{ width: "100%" }}>
                                {mounted && (
                                <Space wrap>
                                    <Space orientation="vertical" size={2}>
                                        <Text style={{ color: secondaryColor, fontSize: 12 }}>Hours</Text>
                                        <InputNumber
                                            min={0}
                                            max={23}
                                            value={inputHours}
                                            onChange={(v) => setInputHours(v ?? 0)}
                                            style={{ width: 80 }}
                                        />
                                    </Space>
                                    <Space orientation="vertical" size={2}>
                                        <Text style={{ color: secondaryColor, fontSize: 12 }}>Minutes</Text>
                                        <InputNumber
                                            min={0}
                                            max={59}
                                            value={inputMinutes}
                                            onChange={(v) => setInputMinutes(v ?? 0)}
                                            style={{ width: 80 }}
                                        />
                                    </Space>
                                    <Space orientation="vertical" size={2}>
                                        <Text style={{ color: secondaryColor, fontSize: 12 }}>Seconds</Text>
                                        <InputNumber
                                            min={0}
                                            max={59}
                                            value={inputSeconds}
                                            onChange={(v) => setInputSeconds(v ?? 0)}
                                            style={{ width: 80 }}
                                        />
                                    </Space>
                                </Space>
                                )}
                                <Button
                                    block
                                    onClick={applyCustomDuration}
                                    style={{
                                        borderColor: "#6366f1",
                                        color: "#6366f1",
                                        background: "transparent",
                                        fontWeight: 500,
                                    }}
                                >
                                    Apply
                                </Button>
                            </Space>
                        </Card>

                        <Card
                            title={
                                <Text style={{ color: textColor, fontWeight: 600 }}>Timer Label</Text>
                            }
                            style={{
                                background: cardBg,
                                border: `1px solid ${cardBorder}`,
                                borderRadius: 12,
                            }}
                            styles={{ body: { paddingTop: 12 } }}
                        >
                            {mounted && (
                            <Input
                                placeholder='e.g. "Pomodoro", "Break", "Presentation"'
                                value={timerLabel}
                                onChange={(e) => setTimerLabel(e.target.value)}
                                prefix={<BellOutlined style={{ color: secondaryColor }} />}
                                maxLength={60}
                                allowClear
                            />
                            )}
                        </Card>

                        {isRunning && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card
                                    style={{
                                        background: darkMode ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.06)",
                                        border: `1px solid rgba(99,102,241,0.3)`,
                                        borderRadius: 12,
                                    }}
                                    styles={{ body: { padding: "12px 16px" } }}
                                >
                                    <Space>
                                        <SoundOutlined style={{ color: "#6366f1" }} />
                                        <Text style={{ color: "#6366f1", fontSize: 13 }}>
                                            Timer running — audio chime plays on completion
                                        </Text>
                                    </Space>
                                </Card>
                            </motion.div>
                        )}
                    </Space>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

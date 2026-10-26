"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Card, Input, InputNumber, Space, Typography, Tooltip, Progress, Row, Col } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, SoundOutlined, ClockCircleOutlined, CheckCircleOutlined, BellOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "@/components/LanguageProvider";
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
    const { t } = useLanguage();

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

    const deadlineRef = useRef(0);
    const remainingMsRef = useRef(remainingSeconds * 1000);
    const completedRef = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const completeTimer = useCallback(() => {
        if (completedRef.current) return;
        completedRef.current = true;
        remainingMsRef.current = 0;
        clearTimer();
        setRemainingSeconds(0);
        setIsRunning(false);
        setIsComplete(true);
        setSessions(count => count + 1);
        playAlarmChime();
    }, [clearTimer]);

    useEffect(() => {
        if (!isRunning) return clearTimer;
        const tick = () => {
            const remaining = Math.max(0, deadlineRef.current - Date.now());
            remainingMsRef.current = remaining;
            setRemainingSeconds(Math.ceil(remaining / 1000));
            if (remaining === 0) completeTimer();
        };
        intervalRef.current = setInterval(tick, 250);
        return clearTimer;
    }, [isRunning, clearTimer, completeTimer]);

    const applyCustomDuration = useCallback(() => {
        const total = Math.trunc(inputHours) * 3600 + Math.trunc(inputMinutes) * 60 + Math.trunc(inputSeconds);
        if (total <= 0) return;
        clearTimer();
        setIsRunning(false);
        setIsComplete(false);
        remainingMsRef.current = total * 1000;
        completedRef.current = false;
        setTotalSeconds(total);
        setRemainingSeconds(total);
    }, [inputHours, inputMinutes, inputSeconds, clearTimer]);

    const applyPreset = useCallback((seconds: number) => {
        clearTimer();
        setIsRunning(false);
        setIsComplete(false);
        remainingMsRef.current = seconds * 1000;
        completedRef.current = false;
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
        deadlineRef.current = Date.now() + remainingMsRef.current;
        completedRef.current = false;
        setIsComplete(false);
        setIsRunning(true);
    }, [remainingSeconds]);

    const handlePause = useCallback(() => {
        clearTimer();
        remainingMsRef.current = Math.max(0, deadlineRef.current - Date.now());
        if (remainingMsRef.current === 0) { completeTimer(); return; }
        setRemainingSeconds(Math.ceil(remainingMsRef.current / 1000));
        setIsRunning(false);
    }, [clearTimer, completeTimer]);

    const handleReset = useCallback(() => {
        clearTimer();
        setIsRunning(false);
        setIsComplete(false);
        remainingMsRef.current = totalSeconds * 1000;
        completedRef.current = false;
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
            title={t("Timer")}
            description={t("Countdown timer with presets, custom duration, and audio chime — runs entirely in your browser")}
            icon={<ClockCircleOutlined />}
            color="#6366f1"
            learnMore={{
                whatIs: t("A local countdown with presets, a custom duration and an optional label. Remaining time is calculated from a deadline rather than counting callbacks."),
                howToUse: [t("Choose a preset or enter hours, minutes and seconds, apply the duration, then start. Pause, resume or reset as needed.")],
                tips: [t("Background tabs and device sleep can delay the completion chime. Browser audio policies may block sound. Reloading clears the timer.")],
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
                                style={{ borderRadius: 6 }}
                            >
                                <Card
                                    style={{
                                        background: cardBg,
                                        border: `2px solid #10b981`,
                                        borderRadius: 6,
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
                                                        {t("Session {number}", { number: sessions })}
                                                    </Text>
                                                )}
                                            </div>
                                        </div>

                                        <Space orientation="vertical" size={8}>
                                            <Space>
                                                <CheckCircleOutlined style={{ color: "#10b981", fontSize: 24 }} />
                                                <Text style={{ color: "#10b981", fontSize: 22, fontWeight: 600 }}>
                                                    {t("Time’s up!")}
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
                                                background: "var(--wb-accent)",
                                                borderColor: "var(--wb-accent)",
                                                color: "var(--signal-action-ink)",
                                                fontWeight: 600,
                                                height: 44,
                                                paddingInline: 32,
                                            }}
                                        >
                                            {t("Reset")}</Button>
                                    </Space>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Card
                                    style={{
                                        background: cardBg,
                                        border: `1px solid ${cardBorder}`,
                                        borderRadius: 6,
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
                                                        {t("{count} sessions done", { count: sessions })}
                                                    </Text>
                                                )}
                                            </div>
                                        </div>

                                        {timerLabel && (
                                            <Text style={{ color: secondaryColor, fontSize: 16 }}>{timerLabel}</Text>
                                        )}

                                        <Space size={12}>
                                            {!isRunning ? (
                                                <Tooltip title={remainingSeconds === 0 ? t("Reset to start") : t("Start")}>
                                                    <Button
                                                        size="large"
                                                        icon={<PlayCircleOutlined />}
                                                        onClick={handleStart}
                                                        disabled={remainingSeconds === 0}
                                                        style={{
                                                            background: "var(--wb-accent)",
                                                            borderColor: "var(--wb-accent)",
                                                            color: "var(--signal-action-ink)",
                                                            fontWeight: 600,
                                                            height: 44,
                                                            paddingInline: 28,
                                                        }}
                                                    >
                                                        {t("Start")}</Button>
                                                </Tooltip>
                                            ) : (
                                                <Button
                                                    size="large"
                                                    icon={<PauseCircleOutlined />}
                                                    onClick={handlePause}
                                                    style={{
                                                        background: "var(--wb-accent-soft)",
                                                        borderColor: "var(--wb-accent)",
                                                        color: "var(--wb-accent)",
                                                        fontWeight: 600,
                                                        height: 44,
                                                        paddingInline: 28,
                                                    }}
                                                >
                                                    {t("Pause")}</Button>
                                            )}
                                            <Tooltip title={t("Reset")}>
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
                                                    {t("Reset")}</Button>
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
                                <Text style={{ color: textColor, fontWeight: 600 }}>{t("Presets")}</Text>
                            }
                            style={{
                                background: cardBg,
                                border: `1px solid ${cardBorder}`,
                                borderRadius: 6,
                            }}
                            styles={{ body: { paddingTop: 12 } }}
                        >
                            <Space wrap>
                                {PRESETS.map((p) => (
                                    <Button
                                        key={t(p.label)}
                                        size="small"
                                        onClick={() => applyPreset(p.seconds)}
                                        style={{
                                            borderColor: totalSeconds === p.seconds ? "var(--wb-accent)" : cardBorder,
                                            color: totalSeconds === p.seconds ? "var(--wb-accent)" : secondaryColor,
                                            background: totalSeconds === p.seconds
                                                ? darkMode ? "var(--wb-accent-soft)" : "var(--wb-accent-soft)"
                                                : "transparent",
                                            fontWeight: totalSeconds === p.seconds ? 600 : 400,
                                        }}
                                    >
                                        {t(p.label)}
                                    </Button>
                                ))}
                            </Space>
                        </Card>

                        <Card
                            title={
                                <Text style={{ color: textColor, fontWeight: 600 }}>{t("Custom Duration")}</Text>
                            }
                            style={{
                                background: cardBg,
                                border: `1px solid ${cardBorder}`,
                                borderRadius: 6,
                            }}
                            styles={{ body: { paddingTop: 12 } }}
                        >
                            <Space orientation="vertical" size={12} style={{ width: "100%" }}>
                                {mounted && (
                                <Space wrap>
                                    <Space orientation="vertical" size={2}>
                                        <Text style={{ color: secondaryColor, fontSize: 12 }}>{t("Hours")}</Text>
                                        <InputNumber precision={0}
                                            min={0}
                                            max={23}
                                            aria-label={t("Hours")}
                                            value={inputHours}
                                            onChange={(v) => setInputHours(v ?? 0)}
                                            style={{ width: 80 }}
                                        />
                                    </Space>
                                    <Space orientation="vertical" size={2}>
                                        <Text style={{ color: secondaryColor, fontSize: 12 }}>{t("Minutes")}</Text>
                                        <InputNumber precision={0}
                                            min={0}
                                            max={59}
                                            aria-label={t("Minutes")}
                                            value={inputMinutes}
                                            onChange={(v) => setInputMinutes(v ?? 0)}
                                            style={{ width: 80 }}
                                        />
                                    </Space>
                                    <Space orientation="vertical" size={2}>
                                        <Text style={{ color: secondaryColor, fontSize: 12 }}>{t("Seconds")}</Text>
                                        <InputNumber precision={0}
                                            min={0}
                                            max={59}
                                            aria-label={t("Seconds")}
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
                                        borderColor: "var(--wb-accent)",
                                        color: "var(--wb-accent)",
                                        background: "transparent",
                                        fontWeight: 500,
                                    }}
                                >
                                    {t("Apply")}</Button>
                            </Space>
                        </Card>

                        <Card
                            title={
                                <Text style={{ color: textColor, fontWeight: 600 }}>{t("Timer Label")}</Text>
                            }
                            style={{
                                background: cardBg,
                                border: `1px solid ${cardBorder}`,
                                borderRadius: 6,
                            }}
                            styles={{ body: { paddingTop: 12 } }}
                        >
                            {mounted && (
                            <Input aria-label={t("Timer Label")} dir="auto" style={{ fontSize: 16 }}
                                placeholder={t("e.g. \"Pomodoro\", \"Break\", \"Presentation\"")}
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
                                        background: darkMode ? "var(--wb-accent-soft)" : "var(--wb-accent-soft)",
                                        border: "1px solid var(--wb-card-border)",
                                        borderRadius: 6,
                                    }}
                                    styles={{ body: { padding: "12px 16px" } }}
                                >
                                    <Space>
                                        <SoundOutlined style={{ color: "var(--wb-accent)" }} />
                                        <Text style={{ color: "var(--wb-accent)", fontSize: 13 }}>
                                            {t("Timer running — audio chime plays on completion")}</Text>
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

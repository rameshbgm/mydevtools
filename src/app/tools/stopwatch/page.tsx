"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Card, Space, Typography, Table, Tag, Statistic, Row, Col, Tooltip } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, FlagOutlined, TrophyOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import ToolPageLayout from "@/components/ToolPageLayout";
import type { ColumnsType } from "antd/es/table/interface";

const { Text } = Typography;

interface LapRecord {
    key: number;
    number: number;
    lapTime: number;
    splitTime: number;
    timestamp: number;
}

function formatTime(ms: number): string {
    const totalCs = Math.floor(ms / 10);
    const cs = totalCs % 100;
    const totalSeconds = Math.floor(totalCs / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function formatLapTime(ms: number): string {
    return formatTime(ms);
}

export default function StopwatchPage() {
    const { darkMode } = useAppStore();
    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [laps, setLaps] = useState<LapRecord[]>([]);
    const [display, setDisplay] = useState(0);

    const startTimeRef = useRef<number>(0);
    const elapsedRef = useRef<number>(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastLapSplitRef = useRef<number>(0);

    const tick = useCallback(() => {
        const now = Date.now();
        const current = elapsedRef.current + (now - startTimeRef.current);
        setDisplay(current);
    }, []);

    useEffect(() => {
        if (running) {
            startTimeRef.current = Date.now();
            intervalRef.current = setInterval(tick, 10);
        } else {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [running, tick]);

    const handleStartPause = useCallback(() => {
        if (running) {
            const now = Date.now();
            elapsedRef.current = elapsedRef.current + (now - startTimeRef.current);
            setElapsed(elapsedRef.current);
            setRunning(false);
        } else {
            setRunning(true);
        }
    }, [running]);

    const handleLap = useCallback(() => {
        if (!running) return;
        const now = Date.now();
        const currentElapsed = elapsedRef.current + (now - startTimeRef.current);
        const lapTime = currentElapsed - lastLapSplitRef.current;
        lastLapSplitRef.current = currentElapsed;

        setLaps((prev) => {
            const lapNumber = prev.length + 1;
            return [
                {
                    key: lapNumber,
                    number: lapNumber,
                    lapTime,
                    splitTime: currentElapsed,
                    timestamp: now,
                },
                ...prev,
            ];
        });
    }, [running]);

    const handleReset = useCallback(() => {
        if (running) return;
        elapsedRef.current = 0;
        lastLapSplitRef.current = 0;
        setElapsed(0);
        setDisplay(0);
        setLaps([]);
    }, [running]);

    const fastestLap = laps.length >= 2
        ? laps.reduce((min, l) => l.lapTime < min.lapTime ? l : min, laps[0])
        : null;
    const slowestLap = laps.length >= 2
        ? laps.reduce((max, l) => l.lapTime > max.lapTime ? l : max, laps[0])
        : null;

    const avgLapMs = laps.length > 0
        ? laps.reduce((sum, l) => sum + l.lapTime, 0) / laps.length
        : 0;

    const displayColor = running ? "#6366f1" : elapsed > 0 ? "#f59e0b" : "var(--wb-text-heading)";

    const columns: ColumnsType<LapRecord> = [
        {
            title: "#",
            dataIndex: "number",
            key: "number",
            width: 60,
            render: (num: number) => (
                <Text strong style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 13 }}>
                    {num}
                </Text>
            ),
        },
        {
            title: "Lap Time",
            dataIndex: "lapTime",
            key: "lapTime",
            render: (ms: number) => (
                <Text style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 13 }}>
                    {formatLapTime(ms)}
                </Text>
            ),
        },
        {
            title: "Split",
            dataIndex: "splitTime",
            key: "splitTime",
            render: (ms: number) => (
                <Text type="secondary" style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 13 }}>
                    {formatTime(ms)}
                </Text>
            ),
        },
        {
            title: "Badge",
            key: "badge",
            width: 80,
            render: (_: unknown, record: LapRecord) => {
                if (laps.length < 2) return null;
                if (fastestLap && record.number === fastestLap.number) {
                    return <Tag color="success">Best</Tag>;
                }
                if (slowestLap && record.number === slowestLap.number) {
                    return <Tag color="error">Worst</Tag>;
                }
                return null;
            },
        },
    ];

    const getRowClassName = (record: LapRecord): string => {
        if (laps.length < 3) return "";
        if (fastestLap && record.number === fastestLap.number) return "lap-row-best";
        if (slowestLap && record.number === slowestLap.number) return "lap-row-worst";
        return "";
    };

    return (
        <ToolPageLayout
            title="Stopwatch"
            description="High-precision stopwatch with lap splits"
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: "#6366f1" }} />}
            color="#6366f1"
            learnMore={{
                whatIs: "A high-precision stopwatch that records lap splits — runs entirely in your browser with millisecond accuracy.",
                whyUse: "Track multiple split times in one session, compare lap performance visually, and export or screenshot results.",
                howToUse: ["Press Start to begin counting", "Press Lap to record a split without stopping", "Press Pause to freeze, Resume to continue", "Press Reset to clear everything"],
                tips: ["Lap button only works while running", "Best and worst laps are highlighted automatically", "Millisecond precision via performance timing"],
                useCases: ["Race timing", "Workout intervals", "Presentation rehearsal", "Load test manual benchmarking"],
            }}
        >
            <style>{`
                .lap-row-best td {
                    background-color: ${darkMode ? "rgba(74, 222, 128, 0.12) !important" : "rgba(34, 197, 94, 0.1) !important"};
                }
                .lap-row-worst td {
                    background-color: ${darkMode ? "rgba(251, 146, 60, 0.12) !important" : "rgba(239, 68, 68, 0.1) !important"};
                }
            `}</style>

            <Card
                style={{
                    textAlign: "center",
                    marginBottom: 16,
                    background: "var(--wb-card-solid-bg)",
                    border: "1px solid var(--wb-card-border)",
                    borderRadius: 16,
                }}
            >
                <div style={{ padding: "24px 0 16px" }}>
                    {running ? (
                        <motion.div
                            animate={{ opacity: [1, 0.85, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <div
                                style={{
                                    fontSize: 84,
                                    fontFamily: "var(--font-geist-mono), monospace",
                                    fontWeight: 700,
                                    color: displayColor,
                                    lineHeight: 1,
                                    letterSpacing: "-2px",
                                    userSelect: "none",
                                }}
                            >
                                {formatTime(display)}
                            </div>
                        </motion.div>
                    ) : (
                        <div
                            style={{
                                fontSize: 84,
                                fontFamily: "var(--font-geist-mono), monospace",
                                fontWeight: 700,
                                color: displayColor,
                                lineHeight: 1,
                                letterSpacing: "-2px",
                                userSelect: "none",
                            }}
                        >
                            {formatTime(display)}
                        </div>
                    )}
                </div>

                <Space size="middle" style={{ marginTop: 8 }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={running ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        onClick={handleStartPause}
                        style={{
                            background: running ? "#f59e0b" : "#6366f1",
                            borderColor: running ? "#f59e0b" : "#6366f1",
                            minWidth: 130,
                            fontWeight: 600,
                        }}
                    >
                        {running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
                    </Button>

                    <Tooltip title={!running ? "Start the stopwatch first" : "Record lap split"}>
                        <Button
                            size="large"
                            icon={<FlagOutlined />}
                            onClick={handleLap}
                            disabled={!running}
                            style={{ minWidth: 90 }}
                        >
                            Lap
                        </Button>
                    </Tooltip>

                    <Tooltip title={running ? "Pause before resetting" : "Reset timer and clear laps"}>
                        <Button
                            size="large"
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                            disabled={running}
                            danger={!running && (elapsed > 0 || laps.length > 0)}
                        >
                            Reset
                        </Button>
                    </Tooltip>
                </Space>
            </Card>

            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ textAlign: "center", background: "var(--wb-card-solid-bg)" }}>
                        <Statistic
                            title="Total Laps"
                            value={laps.length}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ fontSize: 22 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ textAlign: "center", background: "var(--wb-card-solid-bg)" }}>
                        <Statistic
                            title="Best Lap"
                            value={fastestLap ? formatLapTime(fastestLap.lapTime) : "—"}
                            valueStyle={{ fontSize: 18, color: "#22c55e", fontFamily: "var(--font-geist-mono), monospace" }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ textAlign: "center", background: "var(--wb-card-solid-bg)" }}>
                        <Statistic
                            title="Worst Lap"
                            value={slowestLap ? formatLapTime(slowestLap.lapTime) : "—"}
                            valueStyle={{ fontSize: 18, color: "#ef4444", fontFamily: "var(--font-geist-mono), monospace" }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ textAlign: "center", background: "var(--wb-card-solid-bg)" }}>
                        <Statistic
                            title="Average Lap"
                            value={laps.length > 0 ? formatLapTime(avgLapMs) : "—"}
                            valueStyle={{ fontSize: 18, fontFamily: "var(--font-geist-mono), monospace" }}
                        />
                    </Card>
                </Col>
            </Row>

            <AnimatePresence>
                {laps.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card
                            size="small"
                            title={
                                <Space>
                                    <FlagOutlined style={{ color: "#6366f1" }} />
                                    <span>Lap Records</span>
                                    <Tag>{laps.length}</Tag>
                                </Space>
                            }
                            style={{ background: "var(--wb-card-solid-bg)" }}
                        >
                            <Table<LapRecord>
                                columns={columns}
                                dataSource={laps}
                                pagination={laps.length > 10 ? { pageSize: 10, showSizeChanger: false } : false}
                                size="small"
                                rowClassName={getRowClassName}
                                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                            />
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </ToolPageLayout>
    );
}

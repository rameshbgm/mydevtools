"use client";

import React from "react";
import { Typography, Breadcrumb, Collapse, Card, Alert, Tag } from "antd";
import {
    HomeOutlined,
    RightOutlined,
    InfoCircleOutlined,
    QuestionCircleOutlined,
    BulbOutlined,
    ExperimentOutlined,
    UnorderedListOutlined,
    AimOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";

const { Title, Text, Paragraph } = Typography;

interface ToolPageLayoutProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    children: React.ReactNode;
    alpha?: boolean;
    learnMore?: {
        whatIs?: string;
        whyUse?: string;
        howToUse?: string[];
        tips?: string[];
        useCases?: string[];
    };
}

export default function ToolPageLayout({
    title,
    description,
    icon,
    color,
    children,
    alpha,
    learnMore,
}: Readonly<ToolPageLayoutProps>) {
    const { darkMode } = useAppStore();

    return (
        <motion.div
            className="app-tool-shell"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ width: "100%" }}
        >
            <Breadcrumb
                className="app-tool-breadcrumb"
                separator={<RightOutlined style={{ fontSize: 10, opacity: 0.5 }} />}
                style={{ marginBottom: 20 }}
                items={[
                    {
                        title: (
                            <Link
                                href="/"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    color: darkMode ? "#cbd5e1" : "#475569",
                                }}
                            >
                                <HomeOutlined style={{ fontSize: 14 }} />
                                <span>Dashboard</span>
                            </Link>
                        )
                    },
                    {
                        title: (
                            <span style={{
                                color: darkMode ? "#e5e5e5" : "#171717",
                                fontWeight: 500,
                            }}>
                                {title}
                            </span>
                        )
                    },
                ]}
            />

            <motion.div
                className="app-tool-hero"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                    flexWrap: "wrap",
                    background: `linear-gradient(135deg, ${color}${darkMode ? "22" : "18"}, transparent 58%), var(--app-tool-hero-bg)`,
                }}
            >
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    style={{
                        width: 48,
                        height: 48,
                        minWidth: 48,
                        borderRadius: 14,
                        background: `${color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 4px 12px ${color}20`,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </motion.div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <Title
                            level={2}
                            style={{
                                margin: 0,
                                fontWeight: 700,
                                letterSpacing: "-0.5px",
                                fontSize: "clamp(17px, 3.4vw, 24px)",
                                lineHeight: 1.2,
                            }}
                        >
                            {title}
                        </Title>
                        {alpha && (
                            <Tag
                                color="purple"
                                icon={<ExperimentOutlined />}
                                style={{ margin: 0, fontWeight: 700, letterSpacing: 0.6 }}
                            >
                                ALPHA
                            </Tag>
                        )}
                    </div>
                    <Text
                        style={{
                            color: darkMode ? "#a1a1aa" : "#64748b",
                            fontSize: "clamp(12px, 1.6vw, 14px)",
                            marginTop: 4,
                            display: "block",
                            lineHeight: 1.4,
                        }}
                    >
                        {description}
                    </Text>
                </div>
            </motion.div>

            {learnMore && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    style={{ marginBottom: 24 }}
                >
                    <Collapse
                        ghost
                        className="app-tool-learn-collapse"
                        items={[
                            {
                                key: "learn-more",
                                label: (
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <InfoCircleOutlined style={{ color, fontSize: 16 }} />
                                        <Text strong style={{ fontSize: 14 }}>Learn More About This Tool</Text>
                                    </div>
                                ),
                                children: (
                                    <Card
                                        className="app-tool-learn-card"
                                        styles={{ body: { padding: 20 } }}
                                    >
                                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                            {learnMore.whatIs && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <QuestionCircleOutlined style={{ color: "#3b82f6", fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14, color: "#3b82f6" }}>What is it?</Text>
                                                    </div>
                                                    <Paragraph style={{ margin: 0, color: darkMode ? "#d4d4d8" : "#334155", lineHeight: 1.7 }}>
                                                        {learnMore.whatIs}
                                                    </Paragraph>
                                                </div>
                                            )}

                                            {learnMore.whyUse && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <BulbOutlined style={{ color: "#f59e0b", fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14, color: "#f59e0b" }}>Why use it?</Text>
                                                    </div>
                                                    <Paragraph style={{ margin: 0, color: darkMode ? "#d4d4d8" : "#334155", lineHeight: 1.7 }}>
                                                        {learnMore.whyUse}
                                                    </Paragraph>
                                                </div>
                                            )}

                                            {learnMore.howToUse && learnMore.howToUse.length > 0 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <UnorderedListOutlined style={{ color: "#10b981", fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14, color: "#10b981" }}>How to use</Text>
                                                    </div>
                                                    <ol style={{ margin: 0, paddingLeft: 20, color: darkMode ? "#d4d4d8" : "#334155" }}>
                                                        {learnMore.howToUse.map((step) => (
                                                            <li key={`step-${step.slice(0, 20)}`} style={{ marginBottom: 6, lineHeight: 1.6 }}>{step}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}

                                            {learnMore.useCases && learnMore.useCases.length > 0 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <AimOutlined style={{ color: "#8b5cf6", fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14, color: "#8b5cf6" }}>Use Cases</Text>
                                                    </div>
                                                    <ul style={{ margin: 0, paddingLeft: 20, color: darkMode ? "#d4d4d8" : "#334155" }}>
                                                        {learnMore.useCases.map((useCase) => (
                                                            <li key={`usecase-${useCase.slice(0, 20)}`} style={{ marginBottom: 6, lineHeight: 1.6 }}>{useCase}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {learnMore.tips && learnMore.tips.length > 0 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <ThunderboltOutlined style={{ color: "#ec4899", fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14, color: "#ec4899" }}>Pro Tips</Text>
                                                    </div>
                                                    <ul style={{ margin: 0, paddingLeft: 20, color: darkMode ? "#d4d4d8" : "#334155" }}>
                                                        {learnMore.tips.map((tip) => (
                                                            <li key={`tip-${tip.slice(0, 20)}`} style={{ marginBottom: 6, lineHeight: 1.6 }}>{tip}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ),
                            },
                        ]}
                    />
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

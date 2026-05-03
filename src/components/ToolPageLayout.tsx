"use client";

import React, { useId } from "react";
import { Typography, Breadcrumb, Collapse, Card, Tag } from "antd";
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

const { Title, Text, Paragraph } = Typography;

function ToolHeroAccentSvg(props: Readonly<{ className?: string }>) {
    const raw = useId();
    const gid = raw.replace(/:/g, "");
    const gradId = `tool-hero-sheen-${gid}`;
    return (
        <svg
            className={props.className}
            viewBox="0 0 400 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="currentColor" stopOpacity="0.5" />
                    <stop offset="0.35" stopColor="currentColor" stopOpacity="0.12" />
                    <stop offset="0.7" stopColor="currentColor" stopOpacity="0.35" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0.08" />
                </linearGradient>
            </defs>
            <path
                d="M0 96C72 72 120 118 188 104c68-14 132-92 212-74v110H0V96z"
                fill={`url(#${gradId})`}
            />
            <path
                d="M0 118c88-38 146 22 230 10 52-8 108-62 170-54v66H0v-22z"
                fill="currentColor"
                fillOpacity="0.08"
            />
            <circle cx="312" cy="38" r="6" fill="currentColor" fillOpacity="0.35" />
            <circle cx="332" cy="52" r="3.5" fill="currentColor" fillOpacity="0.5" />
        </svg>
    );
}

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
                style={{ marginBottom: 22 }}
                items={[
                    {
                        title: (
                            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <HomeOutlined style={{ fontSize: 14 }} />
                                <span>Dashboard</span>
                            </Link>
                        )
                    },
                    {
                        title: (
                            <span
                                style={{
                                    fontWeight: 600,
                                    color: "var(--app-text-heading)",
                                }}
                            >
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
                transition={{ delay: 0.1, duration: 0.32 }}
                style={
                    {
                        marginBottom: 26,
                        "--hero-accent": color,
                    } as React.CSSProperties
                }
            >
                <ToolHeroAccentSvg className="app-tool-hero-svg" />
                <div className="app-tool-hero-layout">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 4 }}
                        transition={{ type: "spring", stiffness: 380, damping: 18 }}
                        className="app-tool-hero-icon"
                    >
                        {icon}
                    </motion.div>
                    <div className="app-tool-hero-titles">
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <Title
                                level={2}
                                style={{
                                    margin: 0,
                                    fontWeight: 800,
                                    letterSpacing: "-0.03em",
                                    fontSize: "clamp(18px, 3.8vw, 26px)",
                                    lineHeight: 1.18,
                                    color: "var(--app-text-heading)",
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
                                color: "var(--app-text-body)",
                                fontSize: "clamp(13px, 1.7vw, 15px)",
                                marginTop: 6,
                                display: "block",
                                lineHeight: 1.45,
                            }}
                        >
                            {description}
                        </Text>
                    </div>
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
                                                        <QuestionCircleOutlined className="app-learn-label-what" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="app-learn-label-what">
                                                            What is it?
                                                        </Text>
                                                    </div>
                                                    <Paragraph className="app-learn-body">{learnMore.whatIs}</Paragraph>
                                                </div>
                                            )}

                                            {learnMore.whyUse && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <BulbOutlined className="app-learn-label-why" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="app-learn-label-why">
                                                            Why use it?
                                                        </Text>
                                                    </div>
                                                    <Paragraph className="app-learn-body">{learnMore.whyUse}</Paragraph>
                                                </div>
                                            )}

                                            {learnMore.howToUse && learnMore.howToUse.length > 0 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <UnorderedListOutlined className="app-learn-label-how" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="app-learn-label-how">
                                                            How to use
                                                        </Text>
                                                    </div>
                                                    <ol
                                                        style={{
                                                            margin: 0,
                                                            paddingLeft: 20,
                                                            color: "var(--app-text-body)",
                                                        }}
                                                    >
                                                        {learnMore.howToUse.map((step) => (
                                                            <li key={`step-${step.slice(0, 20)}`} style={{ marginBottom: 6, lineHeight: 1.6 }}>{step}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}

                                            {learnMore.useCases && learnMore.useCases.length > 0 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <AimOutlined className="app-learn-label-use" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="app-learn-label-use">
                                                            Use cases
                                                        </Text>
                                                    </div>
                                                    <ul
                                                        style={{
                                                            margin: 0,
                                                            paddingLeft: 20,
                                                            color: "var(--app-text-body)",
                                                        }}
                                                    >
                                                        {learnMore.useCases.map((useCase) => (
                                                            <li key={`usecase-${useCase.slice(0, 20)}`} style={{ marginBottom: 6, lineHeight: 1.6 }}>{useCase}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {learnMore.tips && learnMore.tips.length > 0 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <ThunderboltOutlined className="app-learn-label-tips" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="app-learn-label-tips">
                                                            Pro tips
                                                        </Text>
                                                    </div>
                                                    <ul
                                                        style={{
                                                            margin: 0,
                                                            paddingLeft: 20,
                                                            color: "var(--app-text-body)",
                                                        }}
                                                    >
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

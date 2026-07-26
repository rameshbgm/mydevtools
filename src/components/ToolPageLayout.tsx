"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
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
import { getToolIdFromPublicPath, dashboardCategoryHashId, toolPath } from "@/lib/category-routes";
import { toolsRegistry } from "@/lib/tools-registry";
import { SEO_CONTENT } from "@/lib/seo-content";
import ServerProxyNotice, { type ServerRouteId } from "@/components/ServerProxyNotice";

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
        serverNotice?: {
            route: ServerRouteId;
            purpose: string;
            sentFields: string[];
            extra?: React.ReactNode;
        };
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
    const pathname = usePathname();
    const toolId = getToolIdFromPublicPath(pathname);
    const regTool = toolId ? toolsRegistry.find((t) => t.id === toolId) : undefined;
    const category = regTool?.category;

    // ponytail: category+tag lookup from existing registry data — add a curated
    // `related` registry field only if a hand-picked order is ever demanded.
    const relatedTools = useMemo(() => {
        if (!regTool) return [];
        return toolsRegistry
            .filter((t) => t.id !== regTool.id && t.category === regTool.category)
            .map((t) => ({ tool: t, score: t.tags.filter((tag) => regTool.tags.includes(tag)).length }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 6)
            .map((x) => x.tool);
    }, [regTool]);

    const faq = toolId ? SEO_CONTENT[toolId]?.faq : undefined;

    // Universal SSR-hydration guard for every tool's interactive body.
    // antd Input/Select/Segmented internals get mutated by browser extensions
    // (Shark injects `data-sharkid`), which trips React's hydration check
    // because the server didn't emit that attribute. Rendering `children`
    // client-only fixes it for all 104 tools at once. The SEO content
    // (breadcrumb, title, learnMore) above still SSRs normally.
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const breadcrumbItems = useMemo(() => {
        const items: {
            title: React.ReactNode;
        }[] = [
            {
                title: (
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <HomeOutlined style={{ fontSize: 14 }} />
                        <span>Dashboard</span>
                    </Link>
                ),
            },
        ];
        if (category) {
            items.push({
                title: (
                    <Link href={`/#${dashboardCategoryHashId(category)}`} style={{ fontWeight: 500 }}>
                        {category}
                    </Link>
                ),
            });
        }
        items.push({
            title: (
                <span
                    style={{
                        fontWeight: 600,
                        color: "var(--wb-text-heading)",
                    }}
                >
                    {title}
                </span>
            ),
        });
        return items;
    }, [category, title]);

    return (
        <motion.div
            className="wb-tool-shell"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ width: "100%" }}
        >
            <Breadcrumb
                className="wb-tool-breadcrumb"
                separator={<RightOutlined style={{ fontSize: 10, opacity: 0.5 }} />}
                style={{ marginBottom: 22 }}
                items={breadcrumbItems}
            />

            <motion.div
                className="wb-tool-hero"
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
                <ToolHeroAccentSvg className="wb-tool-hero-svg" />
                <div className="wb-tool-hero-layout">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 4 }}
                        transition={{ type: "spring", stiffness: 380, damping: 18 }}
                        className="wb-tool-hero-icon"
                    >
                        {icon}
                    </motion.div>
                    <div className="wb-tool-hero-titles">
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <Title
                                level={2}
                                style={{
                                    margin: 0,
                                    fontWeight: 800,
                                    letterSpacing: "-0.03em",
                                    fontSize: "clamp(18px, 3.8vw, 26px)",
                                    lineHeight: 1.18,
                                    color: "var(--wb-text-heading)",
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
                                color: "var(--wb-text-body)",
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
                        className="wb-tool-learn-collapse"
                        defaultActiveKey={undefined}
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
                                        className="wb-tool-learn-card"
                                        styles={{ body: { padding: 20 } }}
                                    >
                                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                            {learnMore.whatIs && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <QuestionCircleOutlined className="wb-learn-label-what" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="wb-learn-label-what">
                                                            What is it?
                                                        </Text>
                                                    </div>
                                                    <Paragraph className="wb-learn-body">{learnMore.whatIs}</Paragraph>
                                                </div>
                                            )}

                                            {learnMore.whyUse && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <BulbOutlined className="wb-learn-label-why" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="wb-learn-label-why">
                                                            Why use it?
                                                        </Text>
                                                    </div>
                                                    <Paragraph className="wb-learn-body">{learnMore.whyUse}</Paragraph>
                                                </div>
                                            )}

                                            {learnMore.howToUse && learnMore.howToUse.length > 0 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <UnorderedListOutlined className="wb-learn-label-how" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="wb-learn-label-how">
                                                            How to use
                                                        </Text>
                                                    </div>
                                                    <ol
                                                        style={{
                                                            margin: 0,
                                                            paddingLeft: 20,
                                                            color: "var(--wb-text-body)",
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
                                                        <AimOutlined className="wb-learn-label-use" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="wb-learn-label-use">
                                                            Use cases
                                                        </Text>
                                                    </div>
                                                    <ul
                                                        style={{
                                                            margin: 0,
                                                            paddingLeft: 20,
                                                            color: "var(--wb-text-body)",
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
                                                        <ThunderboltOutlined className="wb-learn-label-tips" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="wb-learn-label-tips">
                                                            Pro tips
                                                        </Text>
                                                    </div>
                                                    <ul
                                                        style={{
                                                            margin: 0,
                                                            paddingLeft: 20,
                                                            color: "var(--wb-text-body)",
                                                        }}
                                                    >
                                                        {learnMore.tips.map((tip) => (
                                                            <li key={`tip-${tip.slice(0, 20)}`} style={{ marginBottom: 6, lineHeight: 1.6 }}>{tip}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {learnMore.serverNotice && (
                                                <ServerProxyNotice
                                                    route={learnMore.serverNotice.route}
                                                    purpose={learnMore.serverNotice.purpose}
                                                    sentFields={learnMore.serverNotice.sentFields}
                                                    extra={learnMore.serverNotice.extra}
                                                />
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
                {mounted ? children : (
                    <div style={{ minHeight: 320 }} aria-hidden />
                )}
            </motion.div>

            {faq && faq.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <Title level={4} style={{ marginBottom: 12, color: "var(--wb-text-heading)" }}>
                        Frequently asked questions
                    </Title>
                    <Collapse
                        ghost
                        className="wb-tool-learn-collapse"
                        items={faq.map((item, i) => ({
                            key: `faq-${i}`,
                            label: <Text strong style={{ fontSize: 14 }}>{item.q}</Text>,
                            children: <Paragraph className="wb-learn-body">{item.a}</Paragraph>,
                        }))}
                    />
                </div>
            )}

            {relatedTools.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <Title level={4} style={{ marginBottom: 12, color: "var(--wb-text-heading)" }}>
                        Related tools
                    </Title>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {relatedTools.map((t) => (
                            <Link key={t.id} href={toolPath(t)}>
                                <Card size="small" hoverable style={{ minWidth: 160 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <t.icon style={{ fontSize: 16, color: t.color }} />
                                        <Text strong style={{ fontSize: 13 }}>{t.name}</Text>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

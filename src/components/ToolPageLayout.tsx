"use client";

import React, { useMemo } from "react";
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
import { getToolIdFromPublicPath, dashboardCategoryHashId, toolPath } from "@/lib/category-routes";
import { toolsRegistry } from "@/lib/tools-registry";
import { SEO_CONTENT } from "@/lib/seo-content";
import ServerProxyNotice, { type ServerRouteId } from "@/components/ServerProxyNotice";
import { TOOL_NETWORK_DISCLOSURES } from "@/lib/tool-network-disclosures";
import { TOOL_HELP } from "@/lib/tool-help";
import ReferenceProvenance from "@/components/ReferenceProvenance";
import { BOUNDARY_LABELS, dataBoundaryForTool } from "@/lib/data-boundaries";
import { useLanguage } from "./LanguageProvider";

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
    children,
    alpha,
    learnMore: suppliedLearnMore,
}: Readonly<ToolPageLayoutProps>) {
    const { t } = useLanguage();
    const pathname = usePathname();
    const toolId = getToolIdFromPublicPath(pathname);
    const regTool = toolId ? toolsRegistry.find((t) => t.id === toolId) : undefined;
    const category = regTool?.category;
    const learnMore: ToolPageLayoutProps["learnMore"] = suppliedLearnMore ?? (toolId && TOOL_HELP[toolId] ? { whatIs: description, ...TOOL_HELP[toolId] } : undefined);
    const networkNotice = learnMore?.serverNotice ?? (toolId ? TOOL_NETWORK_DISCLOSURES[toolId] : undefined);

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

    const breadcrumbItems = useMemo(() => {
        const items: {
            title: React.ReactNode;
        }[] = [
            {
                title: (
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <HomeOutlined style={{ fontSize: 14 }} />
                        <span>{t("Dashboard")}</span>
                    </Link>
                ),
            },
        ];
        if (category) {
            items.push({
                title: (
                    <Link href={`/#${dashboardCategoryHashId(category)}`} style={{ fontWeight: 500 }}>
                        {t(category)}
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
                    {t(title)}
                </span>
            ),
        });
        return items;
    }, [category, title, t]);

    return (
        <div
            className="wb-tool-shell" data-signal-tool={toolId ?? title}
            style={{ width: "100%" }}
        >
            <Breadcrumb
                className="wb-tool-breadcrumb"
                separator={<RightOutlined style={{ fontSize: 10, opacity: 0.5 }} />}
                style={{ marginBottom: 12 }}
                items={breadcrumbItems}
            />

            <div
                className="wb-tool-hero"
                style={
                    {
                        marginBottom: 18,
                        "--hero-accent": "var(--wb-accent)",
                    } as React.CSSProperties
                }
            >
                <div className="wb-tool-hero-layout">
                    <div
                        className="wb-tool-hero-icon"
                    >
                        {icon}
                    </div>
                    <div className="wb-tool-hero-titles">
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <Title
                                level={1}
                                style={{
                                    margin: 0,
                                    fontWeight: 600,
                                    letterSpacing: "-0.03em",
                                    fontSize: 26,
                                    lineHeight: 1.18,
                                    color: "var(--wb-text-heading)",
                                }}
                            >
                                {t(title)}
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
                            {dataBoundaryForTool(toolId) === "local" && <Tag>{t(BOUNDARY_LABELS.local)}</Tag>}
                        </div>
                        <Text
                            style={{
                                color: "var(--wb-text-body)",
                                fontSize: 14,
                                marginTop: 6,
                                display: "block",
                                lineHeight: 1.45,
                            }}
                        >
                            {t(description)}
                        </Text>
                    </div>
                </div>
            </div>

            {networkNotice && <ServerProxyNotice {...networkNotice} />}

            {children}

            {learnMore && (
                <div
                    style={{ marginTop: 28, marginBottom: 16 }}
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
                                        <InfoCircleOutlined style={{ color: "var(--wb-accent)", fontSize: 16 }} />
                                        <Text strong style={{ fontSize: 14 }}>{t("Learn More About This Tool")}</Text>
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
                                                            {t("What is it?")}
                                                        </Text>
                                                    </div>
                                                    <Paragraph className="wb-learn-body">{t(learnMore.whatIs)}</Paragraph>
                                                </div>
                                            )}

                                            {learnMore.whyUse && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <BulbOutlined className="wb-learn-label-why" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="wb-learn-label-why">
                                                            {t("Why use it?")}
                                                        </Text>
                                                    </div>
                                                    <Paragraph className="wb-learn-body">{t(learnMore.whyUse)}</Paragraph>
                                                </div>
                                            )}

                                            {learnMore.howToUse && learnMore.howToUse.length > 0 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <UnorderedListOutlined className="wb-learn-label-how" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="wb-learn-label-how">
                                                            {t("How to use")}
                                                        </Text>
                                                    </div>
                                                    <ol
                                                        style={{
                                                            margin: 0,
                                                            paddingInlineStart: 20,
                                                            color: "var(--wb-text-body)",
                                                        }}
                                                    >
                                                        {learnMore.howToUse.map((step) => (
                                                            <li key={`step-${step.slice(0, 20)}`} style={{ marginBottom: 6, lineHeight: 1.6 }}>{t(step)}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}

                                            {learnMore.useCases && learnMore.useCases.length > 0 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <AimOutlined className="wb-learn-label-use" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="wb-learn-label-use">
                                                            {t("Use cases")}
                                                        </Text>
                                                    </div>
                                                    <ul
                                                        style={{
                                                            margin: 0,
                                                            paddingInlineStart: 20,
                                                            color: "var(--wb-text-body)",
                                                        }}
                                                    >
                                                        {learnMore.useCases.map((useCase) => (
                                                            <li key={`usecase-${useCase.slice(0, 20)}`} style={{ marginBottom: 6, lineHeight: 1.6 }}>{t(useCase)}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {learnMore.tips && learnMore.tips.length > 0 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <ThunderboltOutlined className="wb-learn-label-tips" style={{ fontSize: 16 }} />
                                                        <Text strong style={{ fontSize: 14 }} className="wb-learn-label-tips">
                                                            {t("Pro tips")}
                                                        </Text>
                                                    </div>
                                                    <ul
                                                        style={{
                                                            margin: 0,
                                                            paddingInlineStart: 20,
                                                            color: "var(--wb-text-body)",
                                                        }}
                                                    >
                                                        {learnMore.tips.map((tip) => (
                                                            <li key={`tip-${tip.slice(0, 20)}`} style={{ marginBottom: 6, lineHeight: 1.6 }}>{t(tip)}</li>
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
                </div>
            )}

            <ReferenceProvenance toolId={toolId} />

            {faq && faq.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <Title level={4} style={{ marginBottom: 12, color: "var(--wb-text-heading)" }}>
                        {t("Frequently asked questions")}
                    </Title>
                    <Collapse
                        ghost
                        className="wb-tool-learn-collapse"
                        items={faq.map((item, i) => ({
                            key: `faq-${i}`,
                            label: <Text strong style={{ fontSize: 14 }}>{t(item.q)}</Text>,
                            children: <Paragraph className="wb-learn-body">{t(item.a)}</Paragraph>,
                        }))}
                    />
                </div>
            )}

            {relatedTools.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <Title level={4} style={{ marginBottom: 12, color: "var(--wb-text-heading)" }}>
                        {t("Related tools")}
                    </Title>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {relatedTools.map((tool) => (
                            <Link key={tool.id} href={toolPath(tool)}>
                                <Card size="small" hoverable style={{ minWidth: 160 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <tool.icon style={{ fontSize: 16, color: "var(--wb-accent)" }} />
                                        <Text strong style={{ fontSize: 13 }}>{t(tool.name)}</Text>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

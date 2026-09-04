"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    Tag,
    Typography,
    Row,
    Col,
    Space,
    Badge,
    Empty,
} from "antd";
import {
    SearchOutlined,
    ClockCircleOutlined,
    VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import {
    toolsRegistry,
    getToolsByCategory,
    CATEGORY_COLORS,
    CATEGORY_ICONS,
    CATEGORY_DESCRIPTIONS,
    ALPHA_CATEGORIES,
    type ToolCategory,
    type ToolDefinition,
} from "@/lib/tools-registry";
import { dashboardCategoryHashId, toolPathFromId } from "@/lib/category-routes";
import { useAppStore } from "@/lib/store";
import LandingMarketing from "@/components/LandingMarketing";

const { Title, Text } = Typography;

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const item = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4 },
    },
};

export default function Dashboard() {
    const router = useRouter();
    const { darkMode, recentTools, addRecentTool, clearRecentTools, setNavigating } = useAppStore();
    const [search, setSearch] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const allCategorized = useMemo(() => getToolsByCategory(), []);
    const toolsGridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 280);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /** Open `/` with `#category-*` jumps to catalog section smoothly after paint */
    useEffect(() => {
        const id = window.location.hash.slice(1);
        if (!id.startsWith("category-")) return;
        const t = window.setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
        return () => window.clearTimeout(t);
    }, []);

    const marqueeTools = useMemo(
        () =>
            toolsRegistry
                .slice()
                .sort((a, b) => a.id.localeCompare(b.id))
                .filter((_, i) => i % 3 === 0)
                .slice(0, 28)
                .map((t) => ({ id: t.id, name: t.name, color: t.color })),
        []
    );

    const filteredCategorized = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return allCategorized;
        const result = new Map<ToolCategory, ToolDefinition[]>();
        allCategorized.forEach((tools, category) => {
            const matches = tools.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
                    category.toLowerCase().includes(q)
            );
            if (matches.length > 0) result.set(category, matches);
        });
        return result;
    }, [search, allCategorized]);

    const matchCount = useMemo(
        () => Array.from(filteredCategorized.values()).reduce((sum, t) => sum + t.length, 0),
        [filteredCategorized]
    );

    const handleToolClick = (id: string) => {
        addRecentTool(id);
        setNavigating(true, id);
        const p = toolPathFromId(id);
        if (p) router.push(p);
    };

    const stats = {
        total: toolsRegistry.length,
        categories: allCategorized.size,
    };

    const shellText = darkMode ? "#e5e5e5" : "#171717";

    return (
        <div
            className="landing-page-shell"
            style={{
                width: "100%",
                minWidth: 0,
                maxWidth: "100%",
                boxSizing: "border-box",
                color: shellText,
            }}
        >
            <LandingMarketing
                darkMode={darkMode}
                stats={stats}
                marqueeTools={marqueeTools}
                onToolClick={handleToolClick}
            />

            <div id="landing-full-catalog" className="wb-cat-workspace">
                <div className="wb-cat-workspace-inner">
                    {/* Catalog intro + search + grid (landing marketing above is unchanged) */}
                    <div className="wb-cat-intro">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="wb-cat-intro-eyebrow">The full catalog</div>
                            <h2 className="wb-cat-intro-title">
                                {stats.total} tools, organised across {stats.categories} categories.
                            </h2>
                            <p className="wb-cat-intro-desc">
                                Search by name, tag, or category — or jump straight in.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="wb-cat-search-wrap"
                    >
                        <div suppressHydrationWarning>
                            <div className="wb-cat-search-field">
                                <span className="wb-cat-search-icon">
                                    <SearchOutlined style={{ fontSize: 18 }} />
                                </span>
                                <input
                                    type="text"
                                    aria-label="Search tools"
                                    className="landing-catalog-search-input wb-cat-search-input"
                                    placeholder={`Search ${stats.total} tools…`}
                                    value={search}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                    suppressHydrationWarning
                                    style={{
                                        paddingRight: search ? 44 : 20,
                                        fontFamily: "inherit",
                                    }}
                                />
                        {search && (
                            <button
                                type="button"
                                aria-label="Clear tool search"
                                onClick={() => setSearch("")}
                                style={{
                                    position: "absolute",
                                    right: 14,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 7,
                                    border: "none",
                                    cursor: "pointer",
                                    background: darkMode ? "#2a2a2a" : "#f4f4f5",
                                    color: darkMode ? "#737373" : "#71717a",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 15,
                                    fontWeight: 700,
                                    lineHeight: 1,
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                    {search.trim() && (
                        <p className="wb-cat-match-hint">
                            {matchCount} {matchCount === 1 ? "tool" : "tools"} matching{" "}
                            <strong style={{ color: "var(--wb-accent)" }}>&ldquo;{search}&rdquo;</strong>
                        </p>
                    )}
                </div>
            </motion.div>

            {/* ================================================================
                Recent Tools
            ================================================================ */}
            <AnimatePresence>
                {recentTools.length > 0 && !search.trim() && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="wb-cat-recent-block"
                    >
                        <div className="wb-cat-recent-head">
                            <ClockCircleOutlined style={{ color: "var(--wb-accent-2)", fontSize: 18 }} />
                            <Title level={5} className="wb-cat-recent-title">
                                Recently used
                            </Title>
                            <button
                                type="button"
                                className="wb-cat-recent-clear"
                                onClick={clearRecentTools}
                            >
                                Clear all
                            </button>
                        </div>
                        <Space wrap size={[10, 10]}>
                            {recentTools.slice(0, 8).map((id) => {
                                const tool = toolsRegistry.find((t) => t.id === id);
                                if (!tool) return null;
                                const ToolIcon = tool.icon;
                                return (
                                    <motion.div
                                        key={id}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Tag className="wb-cat-recent-chip" onClick={() => handleToolClick(id)}>
                                            <ToolIcon style={{ marginRight: 6, fontSize: 14 }} />
                                            {tool.name}
                                        </Tag>
                                    </motion.div>
                                );
                            })}
                        </Space>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty state when search has no matches */}
            {search.trim() && filteredCategorized.size === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ padding: "60px 0", textAlign: "center" }}
                >
                    <Empty
                        description={
                            <Text style={{ color: "var(--wb-text-muted)" }}>
                                No tools match &ldquo;{search}&rdquo;
                            </Text>
                        }
                    />
                </motion.div>
            )}

            {/* ================================================================
                Tool Grid by Category
            ================================================================ */}
            <div ref={toolsGridRef}>
                {Array.from(filteredCategorized.entries()).map(([category, tools]) => {
                    const CategoryIcon = CATEGORY_ICONS[category];
                    const categoryColor = CATEGORY_COLORS[category];
                    const categoryDesc = CATEGORY_DESCRIPTIONS[category];
                    const isAlpha = ALPHA_CATEGORIES.includes(category);
                    const anchorId = dashboardCategoryHashId(category);

                    return (
                        <motion.div
                            key={category}
                            id={anchorId}
                            className="wb-cat-category-block"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            style={
                                {
                                    "--cat-accent": categoryColor,
                                } as React.CSSProperties
                            }
                        >
                            <div className="wb-cat-category-head">
                                <div className="wb-cat-category-icon">
                                    <CategoryIcon style={{ fontSize: 22, color: categoryColor }} />
                                </div>
                                <div className="wb-cat-category-titles">
                                    <div className="wb-cat-category-name">
                                        {category}
                                        <span className="wb-cat-count-badge">
                                            <Badge
                                                count={tools.length}
                                                style={{
                                                    backgroundColor: categoryColor,
                                                }}
                                            />
                                        </span>
                                        {isAlpha && (
                                            <Tag color="purple" style={{ margin: 0, fontWeight: 700, letterSpacing: 0.6 }}>
                                                ALPHA
                                            </Tag>
                                        )}
                                    </div>
                                    {categoryDesc && (
                                        <span className="wb-cat-category-desc landing-category-desc">
                                            {categoryDesc}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <motion.div variants={container} initial="hidden" animate="show">
                                <Row gutter={[16, 18]} wrap>
                                    {tools.map((tool) => (
                                        <Col xs={24} sm={12} lg={8} xl={6} key={tool.id}>
                                            <ToolCard tool={tool} onClick={() => handleToolClick(tool.id)} />
                                        </Col>
                                    ))}
                                </Row>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
                </div>
            </div>

            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        key="landing-scroll-top"
                        type="button"
                        aria-label="Back to top"
                        className="wb-cat-scroll-top"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        <VerticalAlignTopOutlined style={{ fontSize: 20 }} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

interface ToolCardProps {
    tool: (typeof toolsRegistry)[0];
    onClick: () => void;
}

function ToolCard({ tool, onClick }: Readonly<ToolCardProps>) {
    const isAlpha = ALPHA_CATEGORIES.includes(tool.category);
    return (
        <motion.div variants={item} whileTap={{ scale: 0.98 }} style={{ height: "100%" }}>
            <Card
                className="wb-cat-tool-card"
                onClick={onClick}
                hoverable={false}
                style={
                    {
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                        "--tool-accent": tool.color,
                    } as React.CSSProperties
                }
                styles={{
                    body: { padding: 22 },
                }}
            >
                {isAlpha && (
                    <Tag
                        color="purple"
                        style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: 0.6,
                            margin: 0,
                            padding: "0 6px",
                            lineHeight: "16px",
                        }}
                    >
                        ALPHA
                    </Tag>
                )}
                <motion.div
                    whileHover={{ scale: 1.06, rotate: 4 }}
                    transition={{ type: "spring", stiffness: 380, damping: 18 }}
                    className="wb-cat-tool-icon-wrap"
                    style={{ color: tool.color }}
                >
                    {React.createElement(tool.icon, {
                        style: { fontSize: 26, color: tool.color },
                    })}
                </motion.div>

                <Title level={5} className="wb-cat-tool-name">
                    {tool.name}
                </Title>
                <Text className="wb-cat-tool-desc">{tool.description}</Text>

                <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {tool.tags.slice(0, 3).map((tag) => (
                        <Tag key={tag} className="wb-cat-tag">
                            {tag}
                        </Tag>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
}

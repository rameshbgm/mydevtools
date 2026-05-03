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
    const [searchFocused, setSearchFocused] = useState(false);
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
        router.push(`/tools/${id}`);
    };

    const stats = {
        total: toolsRegistry.length,
        categories: allCategorized.size,
    };

    const landHeading = darkMode ? "#fafafa" : "#09090b";
    const landBody = darkMode ? "#a3a3a3" : "#404040";
    const landMuted = darkMode ? "#737373" : "#71717a";
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

            {/* ================================================================
                SECTION 8: Catalog header (intro to tool grid below)
            ================================================================ */}
            <div
                id="landing-full-catalog"
                style={{ padding: "clamp(40px, 6vw, 64px) clamp(16px, 4vw, 24px) 16px", maxWidth: 1200, margin: "0 auto" }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: "center", marginBottom: 24 }}
                >
                    <div style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: 12,
                        color: darkMode ? "#6366f1" : "#4f46e5",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        marginBottom: 10,
                    }}>
                        The full catalog
                    </div>
                    <h2 style={{
                        fontSize: "clamp(26px, 3.5vw, 38px)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        margin: 0,
                        color: landHeading,
                    }}>
                        {stats.total} tools, organised across {stats.categories} categories.
                    </h2>
                    <p style={{
                        fontSize: 15,
                        color: landBody,
                        marginTop: 12,
                        marginBottom: 0,
                        lineHeight: 1.55,
                        maxWidth: "52ch",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}>
                        Search by name, tag, or category. Or jump straight in.
                    </p>
                </motion.div>
            </div>


            {/* ================================================================
                Search bar
            ================================================================ */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: 40 }}
            >
                <div style={{ maxWidth: 580, margin: "0 auto", padding: "0 12px" }} suppressHydrationWarning>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <span
                            style={{
                                position: "absolute",
                                left: 18,
                                display: "flex",
                                alignItems: "center",
                                color: searchFocused
                                    ? darkMode ? "#6366f1" : "#4f46e5"
                                    : darkMode ? "#555" : "#71717a",
                                pointerEvents: "none",
                                zIndex: 1,
                                transition: "color 0.15s",
                            }}
                        >
                            <SearchOutlined style={{ fontSize: 17 }} />
                        </span>
                        <input
                            type="text"
                            className="landing-catalog-search-input"
                            placeholder={`Search ${stats.total} tools…`}
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            suppressHydrationWarning
                            style={{
                                width: "100%",
                                height: 54,
                                paddingLeft: 50,
                                paddingRight: search ? 44 : 20,
                                borderRadius: 14,
                                border: `1.5px solid ${
                                    searchFocused
                                        ? darkMode ? "#6366f1" : "#4f46e5"
                                        : darkMode ? "#2a2a2a" : "#d1d5db"
                                }`,
                                background: darkMode ? "#141414" : "#ffffff",
                                fontSize: 15,
                                color: darkMode ? "#e5e5e5" : "#171717",
                                outline: "none",
                                boxShadow: searchFocused
                                    ? darkMode
                                        ? "0 0 0 3px rgba(99,102,241,0.2)"
                                        : "0 0 0 3px rgba(79,70,229,0.12)"
                                    : darkMode
                                        ? "0 4px 20px rgba(0,0,0,0.3)"
                                        : "0 4px 20px rgba(0,0,0,0.06)",
                                transition: "border-color 0.15s, box-shadow 0.15s",
                                fontFamily: "inherit",
                            }}
                        />
                        {search && (
                            <button
                                type="button"
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
                        <p
                            style={{
                                marginTop: 10,
                                marginBottom: 0,
                                fontSize: 13,
                                textAlign: "center",
                                color: darkMode ? "#737373" : "#71717a",
                            }}
                        >
                            {matchCount} {matchCount === 1 ? "tool" : "tools"} matching{" "}
                            <strong style={{ color: darkMode ? "#a78bfa" : "#4f46e5" }}>
                                &ldquo;{search}&rdquo;
                            </strong>
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
                        style={{ marginBottom: 48 }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 16,
                            }}
                        >
                            <ClockCircleOutlined
                                style={{
                                    color: darkMode ? "#737373" : "#a3a3a3",
                                    fontSize: 16,
                                }}
                            />
                            <Title
                                level={5}
                                style={{
                                    margin: 0,
                                    color: darkMode ? "#737373" : "#525252",
                                    fontWeight: 500,
                                    flex: 1,
                                }}
                            >
                                Recently Used
                            </Title>
                            <button
                                type="button"
                                onClick={clearRecentTools}
                                style={{
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    fontSize: 12,
                                    color: darkMode ? "#555" : "#71717a",
                                    padding: "2px 8px",
                                    borderRadius: 6,
                                    fontFamily: "inherit",
                                    fontWeight: 500,
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = darkMode ? "#a78bfa" : "#4f46e5"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = darkMode ? "#555" : "#71717a"; }}
                            >
                                Clear all
                            </button>
                        </div>
                        <Space wrap size={[8, 8]}>
                            {recentTools.slice(0, 8).map((id) => {
                                const tool = toolsRegistry.find((t) => t.id === id);
                                if (!tool) return null;
                                const ToolIcon = tool.icon;
                                return (
                                    <motion.div
                                        key={id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Tag
                                            style={{
                                                cursor: "pointer",
                                                padding: "6px 14px",
                                                borderRadius: 10,
                                                fontSize: 13,
                                                fontWeight: 500,
                                                background: darkMode
                                                    ? "rgba(99, 102, 241, 0.15)"
                                                    : "rgba(79, 70, 229, 0.08)",
                                                border: `1px solid ${darkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.2)"}`,
                                                color: darkMode ? "#a78bfa" : "#4f46e5",
                                            }}
                                            onClick={() => handleToolClick(id)}
                                        >
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
                            <Text style={{ color: landMuted }}>
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
                    const anchorId = `category-${category.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}`;

                    return (
                        <motion.div
                            key={category}
                            id={anchorId}
                            style={{ marginBottom: 48 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: 12,
                                    marginBottom: 8,
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        background: `${categoryColor}1f`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CategoryIcon
                                        style={{ fontSize: 18, color: categoryColor }}
                                    />
                                </div>
                                <Title
                                    level={4}
                                    style={{ margin: 0, fontWeight: 600, color: landHeading }}
                                >
                                    {category}
                                </Title>
                                <Badge
                                    count={tools.length}
                                    style={{
                                        backgroundColor: categoryColor,
                                        fontWeight: 600,
                                        fontSize: 11,
                                    }}
                                />
                                {isAlpha && (
                                    <Tag
                                        color="purple"
                                        style={{
                                            margin: 0,
                                            fontWeight: 700,
                                            letterSpacing: 0.6,
                                        }}
                                    >
                                        ALPHA
                                    </Tag>
                                )}
                            </div>
                            {categoryDesc && (
                                <Text
                                    className="landing-category-desc"
                                    style={{
                                        display: "block",
                                        marginBottom: 18,
                                        paddingLeft: 48,
                                        fontSize: 13,
                                        color: landBody,
                                        lineHeight: 1.55,
                                    }}
                                >
                                    {categoryDesc}
                                </Text>
                            )}

                            <motion.div variants={container} initial="hidden" animate="show">
                                <Row gutter={[14, 16]} wrap>
                                    {tools.map((tool) => (
                                        <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} key={tool.id}>
                                            <ToolCard
                                                tool={tool}
                                                darkMode={darkMode}
                                                onClick={() => handleToolClick(tool.id)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        key="landing-scroll-top"
                        type="button"
                        aria-label="Back to top"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        style={{
                            position: "fixed",
                            right: "max(16px, env(safe-area-inset-right, 0px))",
                            bottom: "max(20px, env(safe-area-inset-bottom, 0px))",
                            zIndex: 200,
                            width: 46,
                            height: 46,
                            borderRadius: "50%",
                            border: `1px solid ${darkMode ? "#3f3f46" : "#d4d4d8"}`,
                            background: darkMode ? "rgba(24,24,27,0.92)" : "rgba(255,255,255,0.96)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            boxShadow: darkMode ? "0 10px 36px rgba(0,0,0,0.5)" : "0 10px 28px rgba(15,23,42,0.12)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: darkMode ? "#fafafa" : "#18181b",
                            padding: 0,
                        }}
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
    darkMode: boolean;
    onClick: () => void;
}

function ToolCard({ tool, darkMode, onClick }: Readonly<ToolCardProps>) {
    const isAlpha = ALPHA_CATEGORIES.includes(tool.category);
    return (
        <motion.div variants={item} whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }}>
            <Card
                className="tool-card"
                onClick={onClick}
                hoverable
                style={{
                    borderRadius: 16,
                    border: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                    background: darkMode
                        ? "linear-gradient(145deg, #1a1a1a 0%, #141414 100%)"
                        : "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                }}
                styles={{
                    body: { padding: 20 },
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
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: `${tool.color}1f`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                    }}
                >
                    {React.createElement(tool.icon, {
                        style: { fontSize: 24, color: tool.color },
                    })}
                </motion.div>

                <Title
                    level={5}
                    style={{
                        marginBottom: 6,
                        fontWeight: 600,
                        fontSize: 15,
                        color: darkMode ? "#fafafa" : "#09090b",
                    }}
                >
                    {tool.name}
                </Title>
                <Text
                    style={{
                        color: darkMode ? "#a3a3a3" : "#404040",
                        fontSize: 13,
                        lineHeight: 1.5,
                        display: "block",
                    }}
                >
                    {tool.description}
                </Text>

                <div style={{ marginTop: 12, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {tool.tags.slice(0, 3).map((tag) => (
                        <Tag
                            key={tag}
                            style={{
                                fontSize: 11,
                                padding: "2px 8px",
                                borderRadius: 6,
                                margin: 0,
                                background: darkMode ? "#262626" : "#f5f5f5",
                                border: "none",
                                color: darkMode ? "#a3a3a3" : "#525252",
                            }}
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
}

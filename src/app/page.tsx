"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    SafetyCertificateOutlined,
    LockOutlined,
    ThunderboltOutlined,
    InfoCircleOutlined,
    GithubOutlined,
    ArrowRightOutlined,
    CloseOutlined,
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

const fadeIn = {
    hidden: { opacity: 0, y: -16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Module-level flag: resets when the JS bundle is reloaded (page refresh / new tab),
// but survives client-side navigation so the panel stays dismissed within a session.
let _aboutDismissed = false;

export default function Dashboard() {
    const router = useRouter();
    const { darkMode, recentTools, addRecentTool, clearRecentTools, setNavigating } = useAppStore();
    const [search, setSearch] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    const allCategorized = useMemo(() => getToolsByCategory(), []);

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

    const [aboutDismissed, setAboutDismissed] = useState(_aboutDismissed);
    const dismissAbout = () => {
        _aboutDismissed = true;
        setAboutDismissed(true);
    };

    return (
        <div style={{ width: "100%" }}>
            {/* Hero Section */}
            <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="show"
                style={{ textAlign: "center", marginBottom: 56 }}
            >
                {!aboutDismissed && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: "94%",
                        margin: "0 auto 28px",
                        textAlign: "left",
                        borderRadius: 14,
                        border: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                        background: darkMode ? "rgba(20,20,20,0.6)" : "#ffffff",
                        overflow: "hidden",
                    }}
                >
                    {/* Header row */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        borderBottom: `1px solid ${darkMode ? "#262626" : "#f0f0f0"}`,
                    }}>
                        <InfoCircleOutlined style={{ color: darkMode ? "#a78bfa" : "#4f46e5", fontSize: 16 }} />
                        <Text strong style={{ fontSize: 14, flex: 1 }}>Learn More About This App</Text>
                        <button
                            type="button"
                            onClick={dismissAbout}
                            title="Dismiss"
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                border: "none",
                                cursor: "pointer",
                                background: "transparent",
                                color: darkMode ? "#555" : "#bbb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 0,
                                flexShrink: 0,
                            }}
                        >
                            <CloseOutlined style={{ fontSize: 12 }} />
                        </button>
                    </div>
                    {/* Content */}
                    <Card
                        style={{
                            background: darkMode ? "#141414" : "#ffffff",
                            border: "none",
                            borderRadius: 0,
                        }}
                        styles={{ body: { padding: 22 } }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                                            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: darkMode ? "#d4d4d4" : "#374151" }}>
                                                <strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>My Dev Tools</strong> is a private,
                                                offline-capable workshop of <strong>{stats.total}+ developer utilities</strong> — formatters, validators,
                                                converters, generators, certificate &amp; cryptography tools, network calculators, and references — all
                                                running entirely in your browser.
                                            </p>

                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                    <span style={{ fontSize: 16 }}>🎯</span>
                                                    <Text strong style={{ fontSize: 13, color: "#f59e0b", letterSpacing: 0.3 }}>THE PROBLEM</Text>
                                                </div>
                                                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: darkMode ? "#a3a3a3" : "#4b5563" }}>
                                                    Most online dev tools <strong>upload your data to a server</strong> — pasting a JWT, an API key,
                                                    a private cert, or a customer payload sends it across the network and onto someone else&rsquo;s logs.
                                                    That&rsquo;s a real exposure for any team handling tokens, PII, or production payloads.
                                                </p>
                                            </div>

                                            <div style={{
                                                background: darkMode ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.06)",
                                                border: `1px solid ${darkMode ? "rgba(16, 185, 129, 0.25)" : "rgba(16, 185, 129, 0.20)"}`,
                                                borderRadius: 10,
                                                padding: "14px 16px",
                                            }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                                    <LockOutlined style={{ color: "#10b981", fontSize: 16 }} />
                                                    <Text strong style={{ fontSize: 13, color: "#10b981", letterSpacing: 0.3 }}>PRIVACY &amp; SECURITY — BY DEFAULT</Text>
                                                </div>
                                                <ul style={{ margin: "0 0 12px", paddingLeft: 20, color: darkMode ? "#a3a3a3" : "#4b5563", fontSize: 13.5, lineHeight: 1.75 }}>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>Everything runs locally.</strong>{" "}Parsing, signing, hashing, encryption, certificate work — all happens in your browser tab. Your input never leaves your machine.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>No accounts, no tracking, no analytics.</strong>{" "}Nothing is logged. No cookies that follow you around. No third-party scripts.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>No third-party CDNs at runtime.</strong>{" "}Fonts, code editors, and crypto libraries are bundled — no external requests on tool use.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>Works offline.</strong>{" "}Installable as a PWA; once loaded, keeps working without a network.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>Open source.</strong>{" "}Every line is auditable on GitHub — verify the privacy claims yourself.</li>
                                                </ul>
                                                <div style={{ paddingLeft: 4 }}>
                                                    <Text style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: 0.4, color: darkMode ? "#6ee7b7" : "#047857", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                                                        Real-world examples
                                                    </Text>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                                        {[
                                                            { e: "🔑", t: "Decode a JWT — see claims, expiry, and signature status entirely in your tab, never transmitted" },
                                                            { e: "🔒", t: "Inspect a TLS certificate chain — the domain name never goes to any third party" },
                                                            { e: "🔐", t: "Test a bcrypt hash against a password — your plaintext stays on your machine" },
                                                            { e: "📡", t: "Build an API request with the local CORS proxy — headers and body never touch an intermediary server" },
                                                            { e: "📝", t: "Format a 10 MB JSON file — no upload, no size limit, no timeout" },
                                                        ].map(({ e, t }) => (
                                                            <div key={t} style={{ display: "flex", gap: 8, fontSize: 12.5, color: darkMode ? "#a3a3a3" : "#4b5563", lineHeight: 1.5 }}>
                                                                <span style={{ flexShrink: 0 }}>{e}</span>
                                                                <span>{t}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                    <ThunderboltOutlined style={{ color: darkMode ? "#a78bfa" : "#4f46e5", fontSize: 16 }} />
                                                    <Text strong style={{ fontSize: 13, color: darkMode ? "#a78bfa" : "#4f46e5", letterSpacing: 0.3 }}>WHY DEVELOPERS USE IT</Text>
                                                </div>
                                                <ul style={{ margin: 0, paddingLeft: 20, color: darkMode ? "#a3a3a3" : "#4b5563", fontSize: 13.5, lineHeight: 1.75 }}>
                                                    <li><strong>Safe to use at work</strong> — paste production tokens, internal certs, and customer payloads without compliance worry.</li>
                                                    <li><strong>One tab, every utility</strong> — formatters, JWT, certificates, regex, network, encoding, hashing — no tool-hopping.</li>
                                                    <li><strong>Fast and frictionless</strong> — no signup, no quotas, no rate limits, no upsell.</li>
                                                    <li><strong>Mobile-friendly</strong> — every tool works on a phone, useful for on-call debugging.</li>
                                                </ul>
                                            </div>

                                            <div style={{
                                                display: "flex",
                                                gap: 10,
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                                paddingTop: 14,
                                                borderTop: `1px dashed ${darkMode ? "#262626" : "#e5e5e5"}`,
                                            }}>
                                                <a
                                                    href="https://github.com/rameshbgm/mydevtools"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        padding: "6px 12px",
                                                        borderRadius: 8,
                                                        fontSize: 12.5,
                                                        fontWeight: 500,
                                                        background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                                                        border: `1px solid ${darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                                                        color: darkMode ? "#e5e5e5" : "#171717",
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    <GithubOutlined /> View source on GitHub
                                                </a>
                                                <span style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    padding: "6px 12px",
                                                    borderRadius: 8,
                                                    fontSize: 12.5,
                                                    fontWeight: 500,
                                                    background: darkMode ? "rgba(16,185,129,0.10)" : "rgba(16,185,129,0.08)",
                                                    border: `1px solid ${darkMode ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.20)"}`,
                                                    color: "#10b981",
                                                }}>
                                                    <SafetyCertificateOutlined /> Zero data collection
                                                </span>
                                                <Link
                                                    href="/release-notes"
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        padding: "6px 12px",
                                                        borderRadius: 8,
                                                        fontSize: 12.5,
                                                        fontWeight: 500,
                                                        marginLeft: "auto",
                                                        background: darkMode ? "rgba(99,102,241,0.10)" : "rgba(79,70,229,0.07)",
                                                        border: `1px solid ${darkMode ? "rgba(99,102,241,0.25)" : "rgba(79,70,229,0.18)"}`,
                                                        color: darkMode ? "#a78bfa" : "#4f46e5",
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    <ArrowRightOutlined /> See full catalog &amp; release notes
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                                )}

                {/* Privacy badge row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                    {[
                        { icon: "⚡", label: `${stats.total} tools`, color: "#8b5cf6" },
                        { icon: "🔒", label: "100% Private", color: "#10b981" },
                        { icon: "🌐", label: "Works Offline", color: "#3b82f6" },
                        { icon: "🚫", label: "No Tracking", color: "#f59e0b" },
                    ].map(({ icon, label, color }) => (
                        <motion.span
                            key={label}
                            whileHover={{ scale: 1.05 }}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "5px 12px",
                                borderRadius: 20,
                                fontSize: 12,
                                fontWeight: 600,
                                background: darkMode ? `${color}18` : `${color}12`,
                                border: `1px solid ${color}40`,
                                color: color,
                                letterSpacing: "0.2px",
                                cursor: "default",
                            }}
                        >
                            <span>{icon}</span>
                            {label}
                        </motion.span>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ textAlign: "center", marginBottom: 48 }}
                >
                    <h1 className="neon-text">My Dev Tools</h1>
                </motion.div>

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
                                    : darkMode ? "#555" : "#aaa",
                                pointerEvents: "none",
                                zIndex: 1,
                                transition: "color 0.15s",
                            }}
                        >
                            <SearchOutlined style={{ fontSize: 17 }} />
                        </span>
                        <input
                            type="text"
                            placeholder={`Search ${stats.total} tools by name, tag, or category…`}
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
                                        : darkMode ? "#2a2a2a" : "#e0e0e0"
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
                                    background: darkMode ? "#2a2a2a" : "#efefef",
                                    color: darkMode ? "#737373" : "#aaa",
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
                                color: darkMode ? "#737373" : "#aaa",
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

            {/* Recent Tools */}
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
                                    color: darkMode ? "#555" : "#bbb",
                                    padding: "2px 8px",
                                    borderRadius: 6,
                                    fontFamily: "inherit",
                                    fontWeight: 500,
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = darkMode ? "#a78bfa" : "#4f46e5"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = darkMode ? "#555" : "#bbb"; }}
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
                            <Text style={{ color: darkMode ? "#737373" : "#a3a3a3" }}>
                                No tools match &ldquo;{search}&rdquo;
                            </Text>
                        }
                    />
                </motion.div>
            )}

            {/* Tool Grid by Category */}
            {Array.from(filteredCategorized.entries()).map(([category, tools]) => {
                const CategoryIcon = CATEGORY_ICONS[category];
                const categoryColor = CATEGORY_COLORS[category];
                const categoryDesc = CATEGORY_DESCRIPTIONS[category];
                const isAlpha = ALPHA_CATEGORIES.includes(category);

                return (
                    <motion.div
                        key={category}
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
                                style={{ margin: 0, fontWeight: 600 }}
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
                                type="secondary"
                                style={{
                                    display: "block",
                                    marginBottom: 18,
                                    paddingLeft: 48,
                                    fontSize: 13,
                                }}
                            >
                                {categoryDesc}
                            </Text>
                        )}

                        <motion.div variants={container} initial="hidden" animate="show">
                            <Row gutter={[20, 20]}>
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
                    }}
                >
                    {tool.name}
                </Title>
                <Text
                    style={{
                        color: darkMode ? "#a3a3a3" : "#525252",
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

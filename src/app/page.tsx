"use client";

import React, { useMemo, useState } from "react";
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
    LockOutlined,
    InfoCircleOutlined,
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
                {/* Privacy badges + title sit above the panel so they're always visible */}
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
                                color,
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
                    style={{ textAlign: "center", marginBottom: 28 }}
                >
                    <h1 className="neon-text">My Dev Tools</h1>
                </motion.div>

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
                                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                            {/* Intro */}
                                            <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.8, color: darkMode ? "#d4d4d4" : "#374151" }}>
                                                <strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>My Dev Tools</strong> is a{" "}
                                                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.88em", color: darkMode ? "#a78bfa" : "#4f46e5" }}>private, offline-capable</span>{" "}
                                                developer toolkit for engineers who routinely work with
                                                sensitive data — tokens, certificates, credentials, and production payloads. Every operation
                                                executes{" "}
                                                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.88em", color: darkMode ? "#a78bfa" : "#4f46e5" }}>entirely within your browser tab</span>,
                                                with no data ever transmitted to any server.{" "}
                                                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.88em", color: darkMode ? "#34d399" : "#059669", fontWeight: 600 }}>Nothing is uploaded. Nothing is logged.</span>{" "}
                                                No accounts. No telemetry. No exceptions.
                                            </p>

                                            {/* Category chips */}
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                                                {[
                                                    { label: "Encoding & Decoding",   color: "#14b8a6" },
                                                    { label: "Diff & Compare",         color: "#f97316" },
                                                    { label: "Formatters",             color: "#6366f1" },
                                                    { label: "Validators",             color: "#3b82f6" },
                                                    { label: "Converters",             color: "#0ea5e9" },
                                                    { label: "Generators",             color: "#8b5cf6" },
                                                    { label: "Certificates & Crypto",  color: "#10b981" },
                                                    { label: "Network & Calculators",  color: "#f59e0b" },
                                                ].map(({ label, color }) => (
                                                    <span key={label} style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        padding: "3px 11px",
                                                        borderRadius: 20,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        background: `${color}18`,
                                                        border: `1px solid ${color}40`,
                                                        color,
                                                        letterSpacing: "0.1px",
                                                    }}>
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Featured tools — simple 3-col bullet list, no tiles */}
                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 170px), 1fr))",
                                                gap: "4px 8px",
                                            }}>
                                                {[
                                                    { name: "JWT Decoder",          color: "#6366f1" },
                                                    { name: "JSON Formatter",        color: "#6366f1" },
                                                    { name: "Regex Tester",          color: "#6366f1" },
                                                    { name: "Base64 Encoder",        color: "#14b8a6" },
                                                    { name: "Encoding & Decoding",   color: "#14b8a6" },
                                                    { name: "QR Code Generator",     color: "#8b5cf6" },
                                                    { name: "POJO Generator",        color: "#8b5cf6" },
                                                    { name: "Certificate Inspector", color: "#10b981" },
                                                    { name: "CSR Generator",         color: "#10b981" },
                                                    { name: "AES Encrypt / Decrypt", color: "#10b981" },
                                                    { name: "Hash Generator",        color: "#10b981" },
                                                    { name: "Bcrypt Tool",           color: "#10b981" },
                                                    { name: "API Request Builder",   color: "#f59e0b" },
                                                    { name: "IP Address Tools",      color: "#f59e0b" },
                                                    { name: "URL Parser",            color: "#0ea5e9" },
                                                ].map(({ name, color }) => (
                                                    <div key={name} style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 7,
                                                        padding: "4px 2px",
                                                    }}>
                                                        <span style={{
                                                            width: 5,
                                                            height: 5,
                                                            borderRadius: "50%",
                                                            background: color,
                                                            flexShrink: 0,
                                                        }} />
                                                        <span style={{
                                                            fontSize: 12.5,
                                                            fontWeight: 500,
                                                            color: darkMode ? "#d4d4d4" : "#374151",
                                                            lineHeight: 1.4,
                                                        }}>
                                                            {name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Privacy */}
                                            <div style={{
                                                background: darkMode ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.06)",
                                                border: `1px solid ${darkMode ? "rgba(16, 185, 129, 0.25)" : "rgba(16, 185, 129, 0.20)"}`,
                                                borderRadius: 10,
                                                padding: "14px 16px",
                                            }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                                    <LockOutlined style={{ color: "#10b981", fontSize: 16 }} />
                                                    <Text strong style={{ fontSize: 14, color: "#10b981", letterSpacing: 0.3 }}>PRIVACY &amp; SECURITY — BY DEFAULT</Text>
                                                </div>
                                                <ul style={{ margin: 0, paddingLeft: 20, color: darkMode ? "#a3a3a3" : "#4b5563", fontSize: 14.5, lineHeight: 1.75 }}>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>Everything runs locally.</strong>{" "}All parsing, signing, hashing, encryption, and certificate operations execute in your browser tab. Your input never leaves your machine.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>No accounts, no tracking, no analytics.</strong>{" "}Nothing is logged. No session cookies. No third-party scripts.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>No external dependencies at runtime.</strong>{" "}Fonts, editors, and cryptographic libraries are bundled — no outbound requests during tool use.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>Works fully offline.</strong>{" "}Installable as a Progressive Web App; all tools remain functional without a network connection.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>Open source and auditable.</strong>{" "}Every line of code is publicly available on GitHub — the privacy guarantees are verifiable, not assumed.</li>
                                                </ul>
                                            </div>

                                            {/* Why */}
                                            <div>
                                                <Text strong style={{ fontSize: 13, letterSpacing: 0.5, textTransform: "uppercase", color: darkMode ? "#a78bfa" : "#4f46e5", display: "block", marginBottom: 8 }}>Why developers choose it</Text>
                                                <ul style={{ margin: 0, paddingLeft: 20, color: darkMode ? "#a3a3a3" : "#4b5563", fontSize: 14.5, lineHeight: 1.75 }}>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>Compliant by design</strong> — paste production tokens, certificates, and internal payloads without violating data handling policies.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>Consolidated toolchain</strong> — formatting, cryptography, certificates, network utilities, and encoding in one place.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>Zero friction</strong> — no sign-up, no quotas, no rate limits, no advertisements.</li>
                                                    <li><strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>Mobile-ready</strong> — every tool is responsive and functional on a phone for on-call workflows.</li>
                                                </ul>
                                            </div>

                                            <div style={{
                                                paddingTop: 14,
                                                borderTop: `1px dashed ${darkMode ? "#262626" : "#e5e5e5"}`,
                                                display: "flex",
                                                justifyContent: "center",
                                            }}>
                                                <button
                                                    type="button"
                                                    onClick={dismissAbout}
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        padding: "6px 16px",
                                                        borderRadius: 8,
                                                        fontSize: 13.5,
                                                        fontWeight: 500,
                                                        cursor: "pointer",
                                                        background: darkMode ? "rgba(16,185,129,0.10)" : "rgba(16,185,129,0.08)",
                                                        border: `1px solid ${darkMode ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.20)"}`,
                                                        color: "#10b981",
                                                    }}
                                                >
                                                    <CloseOutlined style={{ fontSize: 11 }} />
                                                    Close this section
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                                )}

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

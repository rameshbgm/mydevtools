"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Typography, Badge, Breadcrumb, Collapse } from "antd";
import {
    HomeOutlined,
    RightOutlined,
    HistoryOutlined,
    BookOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { RELEASE_NOTES, KIND_LABEL, KIND_COLORS, APP_VERSION } from "@/lib/release-notes";
import {
    toolsRegistry,
    getToolsByCategory,
    CATEGORY_ICONS,
    CATEGORY_COLORS,
    CATEGORY_DESCRIPTIONS,
    type ToolCategory,
} from "@/lib/tools-registry";

const { Title, Text } = Typography;

export default function ReleaseNotesPage() {
    const { darkMode, addRecentTool, setNavigating } = useAppStore();
    const router = useRouter();
    const allCategorized = useMemo(() => getToolsByCategory(), []);
    const totalTools = useMemo(
        () => Array.from(allCategorized.values()).reduce((a, b) => a + b.length, 0),
        [allCategorized]
    );

    const latestKey = RELEASE_NOTES[0]
        ? `${RELEASE_NOTES[0].version}-${RELEASE_NOTES[0].date}`
        : undefined;

    const navigateToTool = (id: string) => {
        addRecentTool(id);
        setNavigating(true, id);
        router.push(`/tools/${id}`);
    };

    return (
        <div style={{ width: "100%" }}>
            {/* Breadcrumb */}
            <Breadcrumb
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
                                    color: darkMode ? "#a3a3a3" : "#525252",
                                }}
                            >
                                <HomeOutlined style={{ fontSize: 14 }} />
                                <span>Dashboard</span>
                            </Link>
                        ),
                    },
                    {
                        title: (
                            <span style={{ color: darkMode ? "#e5e5e5" : "#171717", fontWeight: 500 }}>
                                Release Notes &amp; Catalog
                            </span>
                        ),
                    },
                ]}
            />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 36,
                    padding: "clamp(14px, 2.5vw, 22px) clamp(16px, 2.5vw, 26px)",
                    borderRadius: 16,
                    background: darkMode
                        ? "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 100%)"
                        : "linear-gradient(135deg, rgba(79,70,229,0.06) 0%, transparent 100%)",
                    border: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: darkMode ? "rgba(99,102,241,0.15)" : "rgba(79,70,229,0.10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <HistoryOutlined style={{ fontSize: 26, color: darkMode ? "#a78bfa" : "#4f46e5" }} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <Title
                        level={2}
                        style={{
                            margin: 0,
                            fontWeight: 700,
                            letterSpacing: "-0.5px",
                            fontSize: "clamp(18px, 3.2vw, 26px)",
                        }}
                    >
                        Release Notes &amp; Catalog
                    </Title>
                    <Text style={{ color: darkMode ? "#737373" : "#737373", fontSize: 13, marginTop: 2, display: "block" }}>
                        V{APP_VERSION} · What&apos;s new, what&apos;s inside, and every tool at a glance
                    </Text>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "5px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            background: darkMode ? "rgba(99,102,241,0.12)" : "rgba(79,70,229,0.08)",
                            border: `1px solid ${darkMode ? "rgba(99,102,241,0.3)" : "rgba(79,70,229,0.2)"}`,
                            color: darkMode ? "#a78bfa" : "#4f46e5",
                        }}
                    >
                        {RELEASE_NOTES.length} releases
                    </span>
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "5px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            background: darkMode ? "rgba(52,211,153,0.10)" : "rgba(5,150,105,0.08)",
                            border: `1px solid ${darkMode ? "rgba(52,211,153,0.25)" : "rgba(5,150,105,0.2)"}`,
                            color: darkMode ? "#34d399" : "#059669",
                        }}
                    >
                        {totalTools} tools
                    </span>
                </div>
            </motion.div>

            {/* ── Release History ─────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4 }}
                style={{
                    marginBottom: 52,
                    padding: "20px 22px",
                    borderRadius: 14,
                    border: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                    background: darkMode
                        ? "linear-gradient(145deg, rgba(99,102,241,0.06) 0%, transparent 100%)"
                        : "linear-gradient(145deg, rgba(79,70,229,0.04) 0%, transparent 100%)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 10,
                        marginBottom: 18,
                    }}
                >
                    <HistoryOutlined style={{ fontSize: 17, color: darkMode ? "#a78bfa" : "#4f46e5" }} />
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                        Release History
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: "auto" }}>
                        newest first · click a version to expand
                    </Text>
                </div>

                <Collapse
                    defaultActiveKey={latestKey ? [latestKey] : undefined}
                    expandIconPlacement="end"
                    style={{ background: "transparent", border: 0 }}
                    items={RELEASE_NOTES.map((release) => {
                        const key = `${release.version}-${release.date}`;
                        const c = KIND_COLORS[release.kind];
                        const bg = darkMode ? c.bgDark : c.bg;
                        const fg = darkMode ? c.textDark : c.text;
                        const borderC = darkMode ? c.borderDark : c.border;

                        return {
                            key,
                            style: {
                                marginBottom: 10,
                                borderRadius: 12,
                                border: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                                background: darkMode ? "#141414" : "#ffffff",
                                overflow: "hidden",
                            },
                            label: (
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "var(--font-geist-mono), monospace",
                                            fontSize: 12.5,
                                            fontWeight: 700,
                                            color: darkMode ? "#a78bfa" : "#4f46e5",
                                            background: darkMode
                                                ? "rgba(99,102,241,0.12)"
                                                : "rgba(79,70,229,0.08)",
                                            padding: "2px 10px",
                                            borderRadius: 6,
                                            letterSpacing: 0.4,
                                        }}
                                    >
                                        V{release.version}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            letterSpacing: 0.4,
                                            textTransform: "uppercase" as const,
                                            padding: "2px 8px",
                                            borderRadius: 6,
                                            background: bg,
                                            color: fg,
                                            border: `1px solid ${borderC}`,
                                        }}
                                    >
                                        {KIND_LABEL[release.kind]}
                                    </span>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: 14,
                                            color: darkMode ? "#e5e5e5" : "#171717",
                                        }}
                                    >
                                        {release.title}
                                    </Text>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 12, marginLeft: "auto" }}
                                    >
                                        {release.date}
                                    </Text>
                                </div>
                            ),
                            children: (
                                <div>
                                    {release.summary && (
                                        <p
                                            style={{
                                                margin: "0 0 18px",
                                                fontSize: 13.5,
                                                lineHeight: 1.65,
                                                color: darkMode ? "#d4d4d4" : "#374151",
                                                fontStyle: "italic",
                                                paddingLeft: 12,
                                                borderLeft: `3px solid ${darkMode ? "rgba(99,102,241,0.35)" : "rgba(79,70,229,0.25)"}`,
                                            }}
                                        >
                                            {release.summary}
                                        </p>
                                    )}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 16,
                                        }}
                                    >
                                        {release.sections.map((section) => (
                                            <div key={section.label}>
                                                <Text
                                                    strong
                                                    style={{
                                                        display: "block",
                                                        marginBottom: 6,
                                                        fontSize: 11.5,
                                                        letterSpacing: 0.5,
                                                        textTransform: "uppercase",
                                                        color: darkMode ? "#a78bfa" : "#4f46e5",
                                                    }}
                                                >
                                                    {section.label}
                                                </Text>
                                                <ul
                                                    style={{
                                                        margin: 0,
                                                        paddingLeft: 20,
                                                        color: darkMode ? "#a3a3a3" : "#525252",
                                                        fontSize: 13,
                                                        lineHeight: 1.75,
                                                    }}
                                                >
                                                    {section.bullets.map((b) => (
                                                        <li
                                                            key={b.slice(0, 40)}
                                                            style={{ marginBottom: 4 }}
                                                        >
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ),
                        };
                    })}
                />

                <p
                    style={{
                        marginTop: 14,
                        marginBottom: 0,
                        textAlign: "center",
                        fontSize: 12,
                        color: darkMode ? "#737373" : "#a3a3a3",
                    }}
                >
                    Full commit history on{" "}
                    <a
                        href="https://github.com/rameshbgm/mydevtools/commits/main"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: darkMode ? "#a78bfa" : "#4f46e5" }}
                    >
                        GitHub
                    </a>
                    .
                </p>
            </motion.div>

            {/* ── Full Catalog ─────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.4 }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 12,
                    }}
                >
                    <BookOutlined
                        style={{ fontSize: 20, color: darkMode ? "#34d399" : "#059669" }}
                    />
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                        What&apos;s Inside — Full Catalog
                    </Title>
                    <Badge
                        count={`${totalTools} tools across ${allCategorized.size} categories`}
                        style={{
                            backgroundColor: darkMode
                                ? "rgba(52,211,153,0.15)"
                                : "rgba(5,150,105,0.10)",
                            color: darkMode ? "#34d399" : "#059669",
                            fontWeight: 600,
                            fontSize: 11,
                            boxShadow: "none",
                        }}
                    />
                </div>

                <p
                    style={{
                        margin: "0 0 8px",
                        fontSize: 13.5,
                        lineHeight: 1.65,
                        color: darkMode ? "#a3a3a3" : "#4b5563",
                    }}
                >
                    Every tool below runs <strong style={{ color: darkMode ? "#e5e5e5" : "#111827" }}>entirely in your browser</strong> — paste
                    tokens, certs, passwords, or payloads without any data leaving your machine. Click any tool
                    to open it instantly.
                </p>

                {/* Highlight examples */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 28,
                        padding: "12px 16px",
                        borderRadius: 10,
                        background: darkMode ? "rgba(52,211,153,0.06)" : "rgba(5,150,105,0.04)",
                        border: `1px solid ${darkMode ? "rgba(52,211,153,0.15)" : "rgba(5,150,105,0.12)"}`,
                    }}
                >
                    {[
                        { emoji: "🔑", text: "Decode a JWT — see claims, expiry, and signature details locally" },
                        { emoji: "🔒", text: "Inspect a TLS cert — domain never sent to any third party" },
                        { emoji: "🔐", text: "Test a bcrypt hash — your plaintext stays in your tab" },
                        { emoji: "📡", text: "Build an API request with a local CORS proxy — headers stay private" },
                        { emoji: "📝", text: "Format a 10 MB JSON file — no upload, no timeout, no size limit" },
                    ].map(({ emoji, text }) => (
                        <span
                            key={text}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "4px 10px",
                                borderRadius: 20,
                                fontSize: 12,
                                color: darkMode ? "#a3a3a3" : "#4b5563",
                                background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                            }}
                        >
                            <span>{emoji}</span>
                            {text}
                        </span>
                    ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {Array.from(allCategorized.entries()).map(([category, tools]) => {
                        const CategoryIcon = CATEGORY_ICONS[category as ToolCategory];
                        const catColor = CATEGORY_COLORS[category as ToolCategory];
                        const catDesc = CATEGORY_DESCRIPTIONS[category as ToolCategory];

                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    borderRadius: 14,
                                    border: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                                    overflow: "hidden",
                                }}
                            >
                                {/* Category header */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "13px 18px",
                                        background: darkMode
                                            ? `linear-gradient(90deg, ${catColor}12 0%, transparent 100%)`
                                            : `linear-gradient(90deg, ${catColor}08 0%, transparent 100%)`,
                                        borderBottom: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            background: `${catColor}22`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <CategoryIcon style={{ fontSize: 18, color: catColor }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <Text
                                                strong
                                                style={{
                                                    fontSize: 14.5,
                                                    color: darkMode ? "#e5e5e5" : "#111827",
                                                }}
                                            >
                                                {category}
                                            </Text>
                                            <span
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    padding: "1px 8px",
                                                    borderRadius: 10,
                                                    background: `${catColor}22`,
                                                    color: catColor,
                                                    letterSpacing: 0.3,
                                                }}
                                            >
                                                {tools.length} tools
                                            </span>
                                        </div>
                                        {catDesc && (
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: darkMode ? "#737373" : "#9ca3af",
                                                    display: "block",
                                                    marginTop: 1,
                                                }}
                                            >
                                                {catDesc}
                                            </Text>
                                        )}
                                    </div>
                                </div>

                                {/* Tools grid */}
                                <div
                                    style={{
                                        padding: "12px 16px",
                                        background: darkMode ? "#141414" : "#ffffff",
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fill, minmax(260px, 1fr))",
                                        gap: "4px 16px",
                                    }}
                                >
                                    {tools.map((tool) => (
                                        <div
                                            key={tool.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => navigateToTool(tool.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ")
                                                    navigateToTool(tool.id);
                                            }}
                                            onMouseEnter={(e) => {
                                                (
                                                    e.currentTarget as HTMLDivElement
                                                ).style.background = darkMode
                                                    ? "rgba(255,255,255,0.04)"
                                                    : "rgba(0,0,0,0.03)";
                                            }}
                                            onMouseLeave={(e) => {
                                                (
                                                    e.currentTarget as HTMLDivElement
                                                ).style.background = "transparent";
                                            }}
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 9,
                                                cursor: "pointer",
                                                padding: "7px 8px",
                                                borderRadius: 8,
                                                transition: "background 0.1s",
                                                outline: "none",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 26,
                                                    height: 26,
                                                    borderRadius: 7,
                                                    background: `${tool.color}22`,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                    marginTop: 1,
                                                }}
                                            >
                                                {React.createElement(tool.icon, {
                                                    style: { fontSize: 13, color: tool.color },
                                                })}
                                            </span>
                                            <div style={{ minWidth: 0 }}>
                                                <div
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: darkMode ? "#d4d4d4" : "#374151",
                                                        lineHeight: 1.3,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 5,
                                                    }}
                                                >
                                                    {tool.name}
                                                    <ArrowRightOutlined
                                                        style={{
                                                            fontSize: 10,
                                                            opacity: 0.35,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 11.5,
                                                        color: darkMode ? "#737373" : "#6b7280",
                                                        lineHeight: 1.4,
                                                        marginTop: 1,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {tool.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <p
                    style={{
                        marginTop: 28,
                        textAlign: "center",
                        fontSize: 13,
                        color: darkMode ? "#555" : "#bbb",
                    }}
                >
                    {toolsRegistry.length} tools · all client-side · no account required ·{" "}
                    <a
                        href="https://github.com/rameshbgm/mydevtools"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: darkMode ? "#a78bfa" : "#4f46e5" }}
                    >
                        open source
                    </a>
                </p>
            </motion.div>
        </div>
    );
}

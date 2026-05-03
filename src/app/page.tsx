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
    Button,
} from "antd";
import {
    SearchOutlined,
    ClockCircleOutlined,
    LockOutlined,
    GithubOutlined,
    CheckCircleFilled,
    CodeOutlined,
    BankOutlined,
    SafetyCertificateOutlined,
    ArrowRightOutlined,
    DisconnectOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
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
import { APP_VERSION } from "@/lib/release-notes";

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

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-20%" });
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const duration = 1400;
        const start = performance.now();
        let raf = 0;
        const tick = () => {
            const elapsed = performance.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(to * eased));
            if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, to]);
    return <span ref={ref}>{value}{suffix}</span>;
}

export default function Dashboard() {
    const router = useRouter();
    const { darkMode, recentTools, addRecentTool, clearRecentTools, setNavigating } = useAppStore();
    const [search, setSearch] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const allCategorized = useMemo(() => getToolsByCategory(), []);
    const toolsGridRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();
    const bgParallax = useTransform(scrollY, [0, 800], [0, 120]);
    const blobParallax = useTransform(scrollY, [0, 800], [0, 200]);
    const blobParallaxReverse = useTransform(scrollY, [0, 800], [0, -150]);

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

    return (
        <div style={{ width: "100%" }}>
            {/* ================================================================
                SECTION 1 — Cinematic hero with parallax dot grid
            ================================================================ */}
            <motion.section
                style={{
                    position: "relative",
                    padding: "clamp(72px, 11vw, 140px) clamp(16px, 4vw, 24px) clamp(56px, 8vw, 96px)",
                    overflow: "hidden",
                    borderBottom: `1px solid ${darkMode ? "#161616" : "#ececec"}`,
                }}
            >
                {/* Parallax dotted grid */}
                <motion.div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: "-10% -10% -10% -10%",
                        backgroundImage: darkMode
                            ? "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)"
                            : "radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 90%)",
                        maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 90%)",
                        y: bgParallax,
                        pointerEvents: "none",
                    }}
                />
                {/* Color blobs */}
                <motion.div
                    aria-hidden
                    style={{
                        position: "absolute",
                        top: "10%",
                        left: "8%",
                        width: 320,
                        height: 320,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(99,102,241,0.20), transparent 70%)",
                        filter: "blur(40px)",
                        y: blobParallax,
                        pointerEvents: "none",
                    }}
                />
                <motion.div
                    aria-hidden
                    style={{
                        position: "absolute",
                        bottom: "5%",
                        right: "10%",
                        width: 380,
                        height: 380,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(236,72,153,0.16), transparent 70%)",
                        filter: "blur(50px)",
                        y: blobParallaxReverse,
                        pointerEvents: "none",
                    }}
                />

                <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto" }}>
                    {/* Status pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "6px 14px",
                            borderRadius: 999,
                            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                            fontSize: 12,
                            background: darkMode ? "rgba(99,102,241,0.10)" : "rgba(79,70,229,0.06)",
                            border: `1px solid ${darkMode ? "rgba(99,102,241,0.25)" : "rgba(79,70,229,0.18)"}`,
                            color: darkMode ? "#a5b4fc" : "#4f46e5",
                            marginBottom: 28,
                        }}
                    >
                        <motion.span
                            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }}
                        />
                        v{APP_VERSION} live &nbsp;·&nbsp; {stats.total} tools online &nbsp;·&nbsp; MIT licensed
                    </motion.div>

                    {/* Headline — word-by-word entrance */}
                    <h1
                        style={{
                            fontSize: "clamp(38px, 7.4vw, 84px)",
                            lineHeight: 0.98,
                            fontWeight: 800,
                            letterSpacing: "-0.035em",
                            margin: 0,
                            color: darkMode ? "#fafafa" : "#0a0a0a",
                            maxWidth: 980,
                        }}
                    >
                        {["The", "developer", "toolkit", "that"].map((w, i) => (
                            <motion.span
                                key={w + i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.05 + i * 0.06 }}
                                style={{ display: "inline-block", marginRight: "0.28em" }}
                            >
                                {w}
                            </motion.span>
                        ))}
                        <br />
                        <motion.span
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            style={{
                                background: "var(--gradient-brand)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                color: "transparent",
                                display: "inline-block",
                            }}
                        >
                            never phones home.
                        </motion.span>
                    </h1>

                    {/* Subhead */}
                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        style={{
                            fontSize: "clamp(16px, 1.7vw, 20px)",
                            lineHeight: 1.55,
                            color: darkMode ? "#a3a3a3" : "#525252",
                            margin: "26px 0 0",
                            maxWidth: 680,
                            fontWeight: 400,
                        }}
                    >
                        Format payloads, decode tokens, inspect certificates, generate keys.
                        {stats.total} tools in one workspace, every byte stays inside your browser tab.
                    </motion.p>

                    {/* Action row */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.85 }}
                        style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 36 }}
                    >
                        <Button
                            type="primary"
                            size="large"
                            icon={<ArrowRightOutlined rotate={90} />}
                            onClick={() => toolsGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                            style={{ height: 50, paddingInline: 26, fontWeight: 600, borderRadius: 10, fontSize: 15 }}
                        >
                            Open the toolkit
                        </Button>
                        <Button
                            size="large"
                            icon={<GithubOutlined />}
                            href="https://github.com/rameshbgm/mydevtools"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                height: 50,
                                paddingInline: 22,
                                fontWeight: 500,
                                borderRadius: 10,
                                fontSize: 15,
                                background: darkMode ? "transparent" : "#ffffff",
                                borderColor: darkMode ? "#2a2a2a" : "#d4d4d4",
                                color: darkMode ? "#e5e5e5" : "#171717",
                            }}
                        >
                            Audit the source
                        </Button>
                    </motion.div>

                    {/* Scroll cue */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        style={{
                            position: "absolute",
                            bottom: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontFamily: "var(--font-geist-mono), monospace",
                            fontSize: 11,
                            letterSpacing: "0.15em",
                            color: darkMode ? "#525252" : "#a3a3a3",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <span>SCROLL</span>
                        <motion.span
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            style={{ fontSize: 14 }}
                        >
                            ↓
                        </motion.span>
                    </motion.div>
                </div>
            </motion.section>

            {/* ================================================================
                SECTION 2 — Manifesto strip
            ================================================================ */}
            <section style={{ padding: "clamp(80px, 12vw, 160px) clamp(20px, 5vw, 32px)" }}>
                <div style={{ maxWidth: 980, margin: "0 auto" }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 0.6 }}
                        style={{
                            fontFamily: "var(--font-geist-mono), monospace",
                            fontSize: 12,
                            color: darkMode ? "#6366f1" : "#4f46e5",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            marginBottom: 24,
                        }}
                    >
                        The premise
                    </motion.div>
                    <h2
                        style={{
                            fontSize: "clamp(28px, 4.4vw, 52px)",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                            margin: 0,
                            color: darkMode ? "#fafafa" : "#0a0a0a",
                        }}
                    >
                        {[
                            "Every week, your engineers paste",
                            "production tokens, internal payloads,",
                            "and customer data into",
                            "random websites they",
                            "found on Google.",
                        ].map((line, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-15%" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                style={{ display: "block" }}
                            >
                                {line}
                            </motion.span>
                        ))}
                        <motion.span
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-15%" }}
                            transition={{ duration: 0.7, delay: 0.7 }}
                            style={{
                                display: "block",
                                marginTop: 12,
                                background: "var(--gradient-brand)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                color: "transparent",
                            }}
                        >
                            We built the alternative.
                        </motion.span>
                    </h2>
                </div>
            </section>

            {/* ================================================================
                SECTION 3 — Live counter stats
            ================================================================ */}
            <section style={{ padding: "0 clamp(20px, 5vw, 32px) clamp(80px, 10vw, 120px)" }}>
                <div
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 1,
                        background: darkMode ? "#1a1a1a" : "#ececec",
                        border: `1px solid ${darkMode ? "#1a1a1a" : "#ececec"}`,
                        borderRadius: 18,
                        overflow: "hidden",
                    }}
                >
                    {[
                        { value: stats.total, suffix: "", label: "Tools shipped", sub: "across the catalog", color: "#6366f1" },
                        { value: stats.categories, suffix: "", label: "Categories", sub: "format · crypto · network · more", color: "#0ea5e9" },
                        { value: 0, suffix: "", label: "Trackers", sub: "no analytics, no fingerprinting", color: "#10b981" },
                        { value: 100, suffix: "%", label: "Client-side", sub: "every byte stays in your tab", color: "#f59e0b" },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-20%" }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            style={{
                                background: darkMode ? "#0a0a0a" : "#ffffff",
                                padding: "36px 26px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "clamp(38px, 5vw, 56px)",
                                    fontWeight: 800,
                                    lineHeight: 1,
                                    letterSpacing: "-0.03em",
                                    color: s.color,
                                    fontFamily: "var(--font-geist-mono), monospace",
                                    marginBottom: 14,
                                }}
                            >
                                <AnimatedCounter to={s.value} suffix={s.suffix} />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: darkMode ? "#fafafa" : "#0a0a0a", marginBottom: 4 }}>
                                {s.label}
                            </div>
                            <div style={{ fontSize: 12.5, color: darkMode ? "#737373" : "#737373" }}>
                                {s.sub}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ================================================================
                SECTION 4 — Bento grid: what's inside
            ================================================================ */}
            <section style={{ padding: "0 clamp(20px, 5vw, 32px) clamp(80px, 10vw, 120px)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-15%" }}
                        transition={{ duration: 0.5 }}
                        style={{ marginBottom: 32 }}
                    >
                        <div style={{
                            fontFamily: "var(--font-geist-mono), monospace",
                            fontSize: 12,
                            color: darkMode ? "#6366f1" : "#4f46e5",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            marginBottom: 12,
                        }}>
                            What&apos;s inside
                        </div>
                        <h2 style={{
                            fontSize: "clamp(28px, 4vw, 44px)",
                            fontWeight: 700,
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            margin: 0,
                            maxWidth: 720,
                            color: darkMode ? "#fafafa" : "#0a0a0a",
                        }}>
                            One workshop, the entire backend toolbelt.
                        </h2>
                    </motion.div>

                    <div className="landing-bento">
                        {/* Featured tools rotating card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                            whileHover={{ y: -4 }}
                            className="b-big"
                            style={{
                                background: darkMode ? "linear-gradient(135deg, #111111, #1a1a2a)" : "linear-gradient(135deg, #ffffff, #f5f5ff)",
                                border: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                                borderRadius: 16,
                                padding: 28,
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <div style={{
                                fontFamily: "var(--font-geist-mono), monospace",
                                fontSize: 11,
                                color: "#6366f1",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                marginBottom: 14,
                            }}>
                                Engineer favorites
                            </div>
                            <div style={{
                                fontSize: 22,
                                fontWeight: 700,
                                lineHeight: 1.25,
                                color: darkMode ? "#fafafa" : "#0a0a0a",
                                marginBottom: 18,
                            }}>
                                The 15 tools opened most often.
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 160px), 1fr))",
                                gap: "6px 10px",
                            }}>
                                {[
                                    { name: "JWT Decoder",          color: "#6366f1", id: "jwt-decoder" },
                                    { name: "JSON Formatter",        color: "#6366f1", id: "json-formatter" },
                                    { name: "Regex Tester",          color: "#6366f1", id: "regex-tester" },
                                    { name: "Base64 Encoder",        color: "#14b8a6", id: "base64" },
                                    { name: "URL Parser",            color: "#0ea5e9", id: "url-parser" },
                                    { name: "QR Code Generator",     color: "#8b5cf6", id: "qrcode-generator" },
                                    { name: "POJO Generator",        color: "#8b5cf6", id: "java-pojo-generator" },
                                    { name: "Certificate Inspector", color: "#10b981", id: "certificate-inspector" },
                                    { name: "CSR Generator",         color: "#10b981", id: "certificate-generator" },
                                    { name: "AES Encrypt / Decrypt", color: "#10b981", id: "aes-tool" },
                                    { name: "Hash Generator",        color: "#10b981", id: "hash-generator" },
                                    { name: "Bcrypt Tool",           color: "#10b981", id: "bcrypt-tool" },
                                    { name: "API Request Builder",   color: "#f59e0b", id: "api-request-builder" },
                                    { name: "IP Address Tools",      color: "#f59e0b", id: "ip-address-tools" },
                                    { name: "Cron Parser",           color: "#52c41a", id: "cron-parser" },
                                ].map(({ name, color, id }) => (
                                    <button
                                        type="button"
                                        key={name}
                                        onClick={() => handleToolClick(id)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 7,
                                            padding: "5px 6px",
                                            background: "transparent",
                                            border: "none",
                                            borderRadius: 6,
                                            cursor: "pointer",
                                            textAlign: "left",
                                            color: darkMode ? "#d4d4d4" : "#374151",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            transition: "background 0.15s, color 0.15s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
                                            e.currentTarget.style.color = color;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.color = darkMode ? "#d4d4d4" : "#374151";
                                        }}
                                    >
                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Lock card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.12 }}
                            whileHover={{ y: -4 }}
                            className="b-tall"
                            style={{
                                background: darkMode ? "linear-gradient(160deg, rgba(16,185,129,0.10), #0a0a0a)" : "linear-gradient(160deg, rgba(16,185,129,0.08), #ffffff)",
                                border: `1px solid ${darkMode ? "rgba(16,185,129,0.30)" : "rgba(16,185,129,0.25)"}`,
                                borderRadius: 16,
                                padding: 24,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 4, -4, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                style={{ fontSize: 38, color: "#10b981", lineHeight: 1 }}
                            >
                                <LockOutlined />
                            </motion.div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: darkMode ? "#fafafa" : "#0a0a0a", marginBottom: 6 }}>
                                    Compliant by design
                                </div>
                                <div style={{ fontSize: 13, lineHeight: 1.5, color: darkMode ? "#a3a3a3" : "#525252" }}>
                                    Paste production tokens and certificates without violating data handling policies.
                                </div>
                            </div>
                        </motion.div>

                        {/* Open source */}
                        <motion.a
                            href="https://github.com/rameshbgm/mydevtools"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.18 }}
                            whileHover={{ y: -4 }}
                            className="b-square"
                            style={{
                                background: darkMode ? "#111111" : "#ffffff",
                                border: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                                borderRadius: 16,
                                padding: 22,
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <GithubOutlined style={{ fontSize: 32, color: darkMode ? "#fafafa" : "#0a0a0a", flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: darkMode ? "#fafafa" : "#0a0a0a" }}>
                                    MIT licensed source
                                </div>
                                <div style={{ fontSize: 12, color: darkMode ? "#737373" : "#737373", marginTop: 2 }}>
                                    Every line auditable on GitHub
                                </div>
                            </div>
                        </motion.a>

                        {/* PWA */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.24 }}
                            whileHover={{ y: -4 }}
                            className="b-square"
                            style={{
                                background: darkMode ? "linear-gradient(160deg, rgba(99,102,241,0.10), #0a0a0a)" : "linear-gradient(160deg, rgba(99,102,241,0.08), #ffffff)",
                                border: `1px solid ${darkMode ? "rgba(99,102,241,0.30)" : "rgba(99,102,241,0.25)"}`,
                                borderRadius: 16,
                                padding: 22,
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}
                        >
                            <DisconnectOutlined style={{ fontSize: 30, color: "#6366f1", flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: darkMode ? "#fafafa" : "#0a0a0a" }}>
                                    Works offline
                                </div>
                                <div style={{ fontSize: 12, color: darkMode ? "#737373" : "#737373", marginTop: 2 }}>
                                    Install as a PWA, run on a plane
                                </div>
                            </div>
                        </motion.div>

                        {/* Wide row: categories ribbon */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.30 }}
                            whileHover={{ y: -4 }}
                            className="b-wide"
                            style={{
                                background: darkMode ? "#111111" : "#ffffff",
                                border: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                                borderRadius: 16,
                                padding: 22,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: 12,
                            }}
                        >
                            <div style={{
                                fontFamily: "var(--font-geist-mono), monospace",
                                fontSize: 11,
                                color: darkMode ? "#737373" : "#737373",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                            }}>
                                Categories
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {[
                                    { label: "Formatters",            color: "#6366f1" },
                                    { label: "Validators",             color: "#3b82f6" },
                                    { label: "Diff & Compare",         color: "#f97316" },
                                    { label: "Data Converters",        color: "#0ea5e9" },
                                    { label: "Encoding & Decoding",    color: "#14b8a6" },
                                    { label: "Cryptography",           color: "#10b981" },
                                    { label: "Certificates & Keys",    color: "#10b981" },
                                    { label: "API & Web Services",     color: "#f59e0b" },
                                    { label: "Network",                color: "#f59e0b" },
                                    { label: "Generators",             color: "#8b5cf6" },
                                    { label: "Text & Utilities",       color: "#52c41a" },
                                    { label: "Reference",              color: "#fa8c16" },
                                ].map(({ label, color }) => (
                                    <span key={label} style={{
                                        padding: "3px 10px",
                                        borderRadius: 999,
                                        fontSize: 11.5,
                                        fontWeight: 600,
                                        background: `${color}15`,
                                        border: `1px solid ${color}30`,
                                        color,
                                    }}>
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================================================================
                SECTION 5 — The privacy promise (5 guarantees + flow diagram)
            ================================================================ */}
            <section style={{ padding: "0 clamp(20px, 5vw, 32px) clamp(80px, 10vw, 120px)" }}>
                <div
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        background: darkMode ? "#0a0a0a" : "#fafafa",
                        border: `1px solid ${darkMode ? "#1f1f1f" : "#ececec"}`,
                        borderRadius: 20,
                        padding: "clamp(36px, 5vw, 56px)",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Accent gradient line at top */}
                    <div
                        aria-hidden
                        style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0,
                            height: 3,
                            background: "linear-gradient(90deg, transparent, #10b981, transparent)",
                        }}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                    >
                        <div style={{
                            fontFamily: "var(--font-geist-mono), monospace",
                            fontSize: 12,
                            color: "#10b981",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            marginBottom: 12,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}>
                            <LockOutlined />
                            Privacy &amp; security &mdash; by default
                        </div>
                        <h2 style={{
                            fontSize: "clamp(28px, 4vw, 44px)",
                            fontWeight: 700,
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            margin: "0 0 36px",
                            maxWidth: 720,
                            color: darkMode ? "#fafafa" : "#0a0a0a",
                        }}>
                            Five promises. None of them have an asterisk.
                        </h2>
                    </motion.div>

                    {/* Flow diagram */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            marginBottom: 40,
                            padding: "20px 0",
                            borderTop: `1px dashed ${darkMode ? "#262626" : "#e5e5e5"}`,
                            borderBottom: `1px dashed ${darkMode ? "#262626" : "#e5e5e5"}`,
                        }}
                    >
                        {[
                            { label: "Your input", sub: "in your tab", color: "#6366f1" },
                            { label: "Tool runs", sub: "in your browser", color: "#6366f1" },
                            { label: "Your output", sub: "stays with you", color: "#10b981" },
                        ].map((node, i, arr) => (
                            <React.Fragment key={node.label}>
                                <div style={{
                                    padding: "14px 22px",
                                    borderRadius: 12,
                                    background: darkMode ? "#1a1a1a" : "#ffffff",
                                    border: `1px solid ${node.color}55`,
                                    minWidth: 150,
                                    textAlign: "center",
                                }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: darkMode ? "#fafafa" : "#0a0a0a" }}>
                                        {node.label}
                                    </div>
                                    <div style={{
                                        fontSize: 11.5,
                                        color: darkMode ? "#737373" : "#737373",
                                        marginTop: 2,
                                        fontFamily: "var(--font-geist-mono), monospace",
                                    }}>
                                        {node.sub}
                                    </div>
                                </div>
                                {i < arr.length - 1 && (
                                    <div style={{ position: "relative", width: 60, height: 2, background: darkMode ? "#262626" : "#d4d4d4" }}>
                                        {i === 0 && (
                                            <div style={{
                                                position: "absolute",
                                                top: -26,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                fontFamily: "var(--font-geist-mono), monospace",
                                                fontSize: 11,
                                                color: "#ef4444",
                                                whiteSpace: "nowrap",
                                                textDecoration: "line-through",
                                                opacity: 0.7,
                                            }}>
                                                no server
                                            </div>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </motion.div>

                    {/* Five promises */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: 18,
                    }}>
                        {[
                            {
                                title: "Everything runs locally",
                                body: "Parsing, signing, hashing, encryption, certificate operations &mdash; all of it executes in your browser tab. Your input never leaves your machine.",
                            },
                            {
                                title: "No accounts, no analytics",
                                body: "Nothing is logged. No session cookies, no third-party scripts, no cross-site tracking, no fingerprinting.",
                            },
                            {
                                title: "Bundled at build time",
                                body: "Fonts, the Monaco editor, every cryptographic library &mdash; all bundled. Zero outbound requests once the page renders.",
                            },
                            {
                                title: "Functional offline",
                                body: "Installable as a Progressive Web App. Every tool keeps working without a network connection, ideal for plane mode and air-gapped networks.",
                            },
                            {
                                title: "Open source &amp; auditable",
                                body: "Every line of code is on GitHub under MIT. The privacy guarantees are verifiable, not assumed.",
                            },
                        ].map((promise, i) => (
                            <motion.div
                                key={promise.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-30px" }}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                                style={{
                                    background: darkMode ? "#111111" : "#ffffff",
                                    border: `1px solid ${darkMode ? "#1f1f1f" : "#ececec"}`,
                                    borderRadius: 12,
                                    padding: 18,
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 8,
                                    fontSize: 14.5,
                                    fontWeight: 700,
                                    color: darkMode ? "#fafafa" : "#0a0a0a",
                                }}>
                                    <CheckCircleFilled style={{ color: "#10b981", fontSize: 14 }} />
                                    <span dangerouslySetInnerHTML={{ __html: promise.title }} />
                                </div>
                                <p style={{
                                    margin: 0,
                                    fontSize: 13.5,
                                    lineHeight: 1.6,
                                    color: darkMode ? "#a3a3a3" : "#525252",
                                }}
                                dangerouslySetInnerHTML={{ __html: promise.body }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================
                SECTION 6 — Built for engineers in regulated environments
            ================================================================ */}
            <section style={{ padding: "0 clamp(20px, 5vw, 32px) clamp(80px, 10vw, 120px)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-15%" }}
                        transition={{ duration: 0.5 }}
                        style={{ marginBottom: 36 }}
                    >
                        <div style={{
                            fontFamily: "var(--font-geist-mono), monospace",
                            fontSize: 12,
                            color: darkMode ? "#6366f1" : "#4f46e5",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            marginBottom: 12,
                        }}>
                            Built for
                        </div>
                        <h2 style={{
                            fontSize: "clamp(28px, 4vw, 44px)",
                            fontWeight: 700,
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            margin: 0,
                            maxWidth: 760,
                            color: darkMode ? "#fafafa" : "#0a0a0a",
                        }}>
                            The teams that read every clause of the data agreement.
                        </h2>
                    </motion.div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 18,
                    }}>
                        {[
                            {
                                icon: <CodeOutlined />,
                                accent: "#6366f1",
                                tag: "Individual developers",
                                title: "Stop juggling 30 browser tabs.",
                                bullets: [
                                    "Cmd+K jumps to any of 90 tools in two keystrokes",
                                    "Monaco editor on the inside, the same engine VS Code uses",
                                    "No sign-up, no quotas, no rate limits, no ads",
                                    "Every tool stays mobile-friendly for on-call workflows",
                                ],
                            },
                            {
                                icon: <BankOutlined />,
                                accent: "#0ea5e9",
                                tag: "Enterprise IT",
                                title: "Replace the random formatter websites.",
                                bullets: [
                                    "Static build deploys to an internal portal in five minutes",
                                    "Lock the whole site behind your existing SSO or VPN",
                                    "Audit every dependency in package.json on GitHub",
                                    "No data egress, no SaaS contract, no quarterly review",
                                ],
                            },
                            {
                                icon: <SafetyCertificateOutlined />,
                                accent: "#10b981",
                                tag: "Government &amp; regulated",
                                title: "Air-gapped by design.",
                                bullets: [
                                    "Ships as static HTML, hosts on any internal web server",
                                    "Zero outbound requests once the page is served",
                                    "Useful for FedRAMP, HIPAA, PCI, ITAR, IL5 environments",
                                    "Drop the build folder onto a classified network, open it offline",
                                ],
                            },
                        ].map((card, i) => (
                            <motion.div
                                key={card.tag}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ y: -6 }}
                                style={{
                                    background: darkMode ? "#111111" : "#ffffff",
                                    border: `1px solid ${darkMode ? "#262626" : "#ececec"}`,
                                    borderRadius: 16,
                                    padding: 26,
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Accent corner */}
                                <div
                                    aria-hidden
                                    style={{
                                        position: "absolute",
                                        top: 0, right: 0,
                                        width: 80,
                                        height: 80,
                                        background: `radial-gradient(circle at top right, ${card.accent}25, transparent 70%)`,
                                        pointerEvents: "none",
                                    }}
                                />
                                <div style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 42,
                                    height: 42,
                                    borderRadius: 12,
                                    background: card.accent + "1a",
                                    color: card.accent,
                                    fontSize: 20,
                                    marginBottom: 18,
                                }}>
                                    {card.icon}
                                </div>
                                <div style={{
                                    fontFamily: "var(--font-geist-mono), monospace",
                                    fontSize: 11,
                                    color: card.accent,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    marginBottom: 10,
                                }}
                                dangerouslySetInnerHTML={{ __html: card.tag }}
                                />
                                <h3 style={{
                                    fontSize: 19,
                                    fontWeight: 700,
                                    lineHeight: 1.3,
                                    margin: "0 0 16px",
                                    color: darkMode ? "#fafafa" : "#0a0a0a",
                                }}>
                                    {card.title}
                                </h3>
                                <ul style={{
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 9,
                                }}>
                                    {card.bullets.map((b, j) => (
                                        <li key={j} style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 8,
                                            fontSize: 13.5,
                                            lineHeight: 1.5,
                                            color: darkMode ? "#a3a3a3" : "#525252",
                                        }}>
                                            <span style={{
                                                marginTop: 6,
                                                width: 4,
                                                height: 4,
                                                borderRadius: "50%",
                                                background: card.accent,
                                                flexShrink: 0,
                                            }} />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================
                SECTION 7 — Tool marquee (infinite ticker)
            ================================================================ */}
            <section style={{ padding: "0 0 clamp(80px, 10vw, 120px)" }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    style={{
                        textAlign: "center",
                        padding: "0 clamp(20px, 5vw, 32px)",
                        marginBottom: 28,
                    }}
                >
                    <div style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: 12,
                        color: darkMode ? "#6366f1" : "#4f46e5",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        marginBottom: 8,
                    }}>
                        The catalog at a glance
                    </div>
                    <div style={{
                        fontSize: "clamp(15px, 1.6vw, 18px)",
                        color: darkMode ? "#a3a3a3" : "#525252",
                    }}>
                        {stats.total} tools, hover to pause.
                    </div>
                </motion.div>

                <div className="tool-marquee-mask">
                    <div className="tool-marquee-track">
                        {[...marqueeTools, ...marqueeTools].map((tool, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleToolClick(tool.id)}
                                style={{
                                    flexShrink: 0,
                                    padding: "10px 16px",
                                    borderRadius: 999,
                                    border: `1px solid ${darkMode ? "#262626" : "#ececec"}`,
                                    background: darkMode ? "#111111" : "#ffffff",
                                    color: darkMode ? "#d4d4d4" : "#374151",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-geist-mono), monospace",
                                    whiteSpace: "nowrap",
                                    transition: "border-color 0.15s, color 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = tool.color;
                                    e.currentTarget.style.color = tool.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = darkMode ? "#262626" : "#ececec";
                                    e.currentTarget.style.color = darkMode ? "#d4d4d4" : "#374151";
                                }}
                            >
                                <span style={{
                                    display: "inline-block",
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: tool.color,
                                    marginRight: 8,
                                    verticalAlign: "middle",
                                }} />
                                {tool.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================
                SECTION 8 — Catalog header (intro to tool grid below)
            ================================================================ */}
            <div style={{ padding: "clamp(40px, 6vw, 64px) clamp(16px, 4vw, 24px) 16px", maxWidth: 1200, margin: "0 auto" }}>
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
                        color: darkMode ? "#fafafa" : "#0a0a0a",
                    }}>
                        {stats.total} tools, organised across {stats.categories} categories.
                    </h2>
                    <p style={{
                        fontSize: 15,
                        color: darkMode ? "#a3a3a3" : "#525252",
                        marginTop: 12,
                        marginBottom: 0,
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

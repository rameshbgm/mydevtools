"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Button } from "antd";
import {
    ArrowRightOutlined,
    GithubOutlined,
    LockOutlined,
    CodeOutlined,
    BankOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import { motion, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";
import {
    SvgCategoryGlyph,
    LandingStatIcon,
} from "@/components/landing-visuals";
import {
    CATEGORY_COLORS,
    CATEGORY_DESCRIPTIONS,
    CATEGORY_ORDER,
    type ToolCategory,
} from "@/lib/tools-registry";
import { triggerPwaInstallPrompt } from "@/lib/pwa-install-prompt";
import { messageService } from "@/lib/messageService";

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

function categoryAnchorId(category: ToolCategory) {
    return `category-${category.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}`;
}

function PwaInstallLink({ accent, darkMode }: { accent: string; darkMode: boolean }) {
    const runInstall = async (e: React.MouseEvent) => {
        e.preventDefault();
        const prompted = await triggerPwaInstallPrompt();
        if (!prompted) {
            messageService.info(
                'Use your browser’s install control in the address bar (monitor + arrow icon), or wait a moment and try again once the page has finished loading.',
            );
        }
    };

    const bodyColor = darkMode ? "#e4e4e7" : "#27272a";

    return (
        <div
            style={{
                flex: "1 1 0%",
                minWidth: 0,
                fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 400,
                lineHeight: 1.35,
                color: bodyColor,
            }}
        >
            <button
                type="button"
                onClick={runInstall}
                aria-label="Install My Dev Tools as a web app on this device."
                style={{
                    display: "inline",
                    verticalAlign: "baseline",
                    font: "inherit",
                    fontWeight: 600,
                    color: accent,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                }}
            >
                Install as an app
            </button>
            <span>
                {": Keep the full toolkit on your device. Works offline, so untrusted or captive Wi-Fi never has to be part of the story."}
            </span>
        </div>
    );
}

function scrollToCatalog() {
    document.getElementById("landing-full-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Short capability cues inside hero orbit circles (matches registry domains). */
const HERO_ORBIT_CAPABILITIES: Partial<Record<ToolCategory, string>> = {
    Formatters: "JSON · XML · SQL · YAML · CSS",
    Validators: "Schema · XPath · Cron · payloads",
    "Diff & Compare": "Text · JSON · XML deltas",
    "Data Converters": "JSON ↔ CSV ↔ XML ↔ YAML",
    "Encoding & Decoding": "Base64 · URL · hex · gzip",
    Cryptography: "Hash · HMAC · JWT · AES · RSA",
    "Certificates & Keys": "X.509 · CSR · PEM · SSH keys",
    "API & Web Services": "REST · SOAP · Swagger · WSDL",
};

function splitHeroCapabilityLine(s: string): [string, string | undefined] {
    const bits = s.split(" · ").map((b) => b.trim()).filter(Boolean);
    if (bits.length <= 2) return [s, undefined];
    const mid = Math.ceil(bits.length / 2);
    return [bits.slice(0, mid).join(" · "), bits.slice(mid).join(" · ")];
}

function HeroConstellation({ dark }: { dark: boolean }) {
    const nodes = CATEGORY_ORDER.slice(0, 8);
    const cx = 200;
    const cy = 200;
    const r = 142;
    const orbitR = 58;
    const subFill = dark ? "#94a3b8" : "#64748b";
    return (
        <svg
            viewBox="0 0 400 400"
            className="w-full max-w-[min(100%,440px)] mx-auto"
            style={{ overflow: "visible" }}
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <radialGradient id="heroOrb" cx="50%" cy="40%">
                    <stop offset="0%" stopColor={dark ? "#2dd4bf" : "#14b8a6"} stopOpacity={0.35} />
                    <stop offset="55%" stopColor={dark ? "#6366f1" : "#4f46e5"} stopOpacity={0.12} />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>
            <motion.circle cx={cx} cy={cy} r={172} fill="url(#heroOrb)" animate={{ opacity: [0.7, 1, 0.7], scale: [0.96, 1.02, 0.96] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

            {[0, 1, 2, 3, 4, 5].map((seg) => {
                const ang = (seg / 6) * Math.PI * 2 - Math.PI / 2;
                const x = cx + Math.cos(ang) * 118;
                const y = cy + Math.sin(ang) * 118;
                const x2 = cx + Math.cos(ang + 0.2) * 168;
                const y2 = cy + Math.sin(ang + 0.2) * 168;
                return (
                    <motion.line
                        key={`r-${seg}`}
                        x1={x}
                        y1={y}
                        x2={x2}
                        y2={y2}
                        stroke={dark ? "#3f3f46" : "#d4d4d8"}
                        strokeWidth={1}
                        strokeDasharray="4 10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ duration: 1.2, delay: seg * 0.08 }}
                    />
                );
            })}

            <motion.g animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: `${cx}px ${cy}px` }}>
                <motion.rect x={cx - 92} y={cy - 64} width={184} height={128} rx={22} fill={dark ? "#18181b" : "#fafafa"} stroke={dark ? "#71717a" : "#94a3b8"} strokeWidth={1.75} opacity={0.95} />
                <rect x={cx - 92} y={cy - 64} width={184} height={28} rx={12} fill={dark ? "#27272a" : "#e4e4e7"} />
                <circle cx={cx - 72} cy={cy - 50} r={5} fill="#f87171" />
                <circle cx={cx - 56} cy={cy - 50} r={5} fill="#fbbf24" />
                <circle cx={cx - 40} cy={cy - 50} r={5} fill="#34d399" />
                {[0, 1, 2].map((i) => (
                    <motion.rect key={i} x={cx - 70} y={cy - 26 + i * 26} width={138 - i * 12} height={10} rx={4} fill={dark ? "#3f3f46" : "#cbd5e1"} opacity={0.45} animate={{ opacity: [0.3, 0.65, 0.3] }} transition={{ duration: 2.4 + i * 0.2, repeat: Infinity }} />
                ))}
                <motion.path d={`M${cx - 62} ${cy + 54} Q ${cx - 28} ${cy + 74} ${cx + 18} ${cy + 62}`} fill="none" stroke="#34d399" strokeWidth={2} strokeDasharray="6 6" animate={{ strokeDashoffset: [0, -24] }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} />
                <motion.rect x={cx - 74} y={cy + 40} width={148} height={22} rx={8} stroke="#22d3ee" strokeWidth={1.2} fill="none" animate={{ opacity: [0.4, 0.95, 0.4] }} transition={{ duration: 2.8, repeat: Infinity }} />
            </motion.g>

            <text x={cx} y={cy - 86} fill={dark ? "#a1a1aa" : "#64748b"} fontSize={8.5} fontWeight={600} fontFamily="system-ui,sans-serif" textAnchor="middle" letterSpacing="0.08em">
                PLATFORM CAPABILITIES
            </text>

            {nodes.map((cat, idx) => {
                const theta = (-Math.PI / 2 + (idx / nodes.length) * Math.PI * 2);
                const gx = cx + Math.cos(theta) * r;
                const gy = cy + Math.sin(theta) * r;
                const col = CATEGORY_COLORS[cat];
                const capsRaw = HERO_ORBIT_CAPABILITIES[cat] ?? "";
                const [capLineA, capLineB] = splitHeroCapabilityLine(capsRaw);
                const parts =
                    cat.includes("&") ? cat.split("&").map((s) => s.trim()) : null;
                return (
                    <motion.g key={cat} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + idx * 0.06, duration: 0.45 }}>
                        <circle cx={gx} cy={gy} r={orbitR} fill={dark ? "#0c0c0e" : "#ffffff"} stroke={col} strokeWidth={1.4} opacity={0.97} />
                        <circle cx={gx + (idx % 2 ? 24 : -24)} cy={gy - orbitR + 14} r={5} fill={col} opacity={0.88} />
                        {/* Category title */}
                        <text fill={dark ? "#fafafa" : "#18181b"} fontWeight={700} textAnchor="middle">
                            {!parts ? (
                                <tspan x={gx} y={gy - 16} fontSize={8}>
                                    {cat.length > 20 ? `${cat.slice(0, 18)}\u2026` : cat}
                                </tspan>
                            ) : (
                                <>
                                    <tspan x={gx} y={gy - 22} fontSize={7.6}>
                                        {parts[0].length > 15 ? `${parts[0].slice(0, 14)}\u2026` : parts[0]}
                                    </tspan>
                                    <tspan x={gx} y={gy - 10} fontSize={7.6}>
                                        &amp; {parts[1]?.length ? (parts[1].length > 15 ? `${parts[1].slice(0, 14)}\u2026` : parts[1]) : ""}
                                    </tspan>
                                </>
                            )}
                        </text>
                        {/* Platform capabilities (muted, below category title) */}
                        {capsRaw.length > 0 && (
                            <text fill={subFill} fontWeight={500} textAnchor="middle" fontFamily="system-ui,-apple-system,BlinkMacSystemFont,sans-serif">
                                <tspan x={gx} y={gy + (parts ? 14 : 6)} fontSize={5.95}>
                                    {capLineA}
                                </tspan>
                                {capLineB ? (
                                    <tspan x={gx} y={gy + (parts ? 24 : 16)} fontSize={5.85}>
                                        {capLineB}
                                    </tspan>
                                ) : null}
                            </text>
                        )}
                    </motion.g>
                );
            })}
        </svg>
    );
}

interface LandingMarketingProps {
    darkMode: boolean;
    stats: { total: number; categories: number };
    marqueeTools: Array<{ id: string; name: string; color: string }>;
    onToolClick: (id: string) => void;
}

const FAVORITE_TOOLS: Array<{ name: string; id: string; color: string }> = [
    { name: "JWT Decoder", color: "#6366f1", id: "jwt-decoder" },
    { name: "JSON Formatter", color: "#6366f1", id: "json-formatter" },
    { name: "Regex Tester", color: "#6366f1", id: "regex-tester" },
    { name: "Base64 Encoder", color: "#14b8a6", id: "base64" },
    { name: "URL Parser", color: "#0ea5e9", id: "url-parser" },
    { name: "QR Code Generator", color: "#8b5cf6", id: "qrcode-generator" },
    { name: "POJO Generator", color: "#8b5cf6", id: "java-pojo-generator" },
    { name: "Certificate Inspector", color: "#10b981", id: "certificate-inspector" },
    { name: "CSR Generator", color: "#10b981", id: "certificate-generator" },
    { name: "AES Encrypt / Decrypt", color: "#10b981", id: "aes-tool" },
    { name: "Hash Generator", color: "#10b981", id: "hash-generator" },
    { name: "Bcrypt Tool", color: "#10b981", id: "bcrypt-tool" },
    { name: "API Request Builder", color: "#f59e0b", id: "api-request-builder" },
    { name: "IP Address Tools", color: "#f59e0b", id: "ip-address-tools" },
    { name: "Cron Parser", color: "#52c41a", id: "cron-parser" },
];

export default function LandingMarketing({ darkMode, stats, marqueeTools, onToolClick }: Readonly<LandingMarketingProps>) {
    const accent = darkMode ? "#22d3ee" : "#0891b2";
    const surface = darkMode ? "#09090b" : "#f4f4f5";
    const line = darkMode ? "#27272a" : "#d1d5db";
    const textMuted = darkMode ? "#a1a1aa" : "#44403c";
    /** Section titles */
    const textHeading = darkMode ? "#fafafa" : "#09090b";
    /** Labels, pills, chrome on cards */
    const textInk = darkMode ? "#fafafa" : "#18181b";
    /** Hero wordmark beside gradient title */
    const textHero = darkMode ? "#e4e4e7" : "#18181b";

    const { scrollY } = useScroll();
    const meshY = useTransform(scrollY, [0, 600], [0, 80]);
    const reduceMotion = useReducedMotion();
    const categoryStripChips = useMemo(
        () => (reduceMotion === true ? [...CATEGORY_ORDER] : [...CATEGORY_ORDER, ...CATEGORY_ORDER]),
        [reduceMotion],
    );

    const scrollCat = (category: ToolCategory) => {
        const id = categoryAnchorId(category);
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        const path = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}#${id}` : `#${id}`;
        window.history.replaceState(null, "", path);
    };

    const privacyBullets = useMemo(
        () => [
            { t: "Local execution", d: "Hashing, crypto, parsers: everything runs inside your browser tab." },
            { t: "Zero telemetry", d: "No analytics scripts, trackers, or session backchannels." },
            { t: "Auditable bundles", d: "Static assets only after load; verify the OSS repo yourself." },
        ],
        []
    );

    const builtCards = [
        {
            icon: <CodeOutlined />,
            accent: "#22d3ee",
            tag: "Developers",
            title: "One surface for formatters and debuggers.",
            bullets: [
                `${stats.total}+ tools with instant navigation`,
                "Monaco inside for serious editing",
                "Mobile-friendly for on-call",
            ],
        },
        {
            icon: <BankOutlined />,
            accent: "#f59e0b",
            tag: "Platform teams",
            title: "Self-host or drop behind SSO.",
            bullets: ["Static deploy in minutes", "No data leaves your perimeter", "MIT license, full repo access"],
        },
        {
            icon: <SafetyCertificateOutlined />,
            accent: "#34d399",
            tag: "Regulated",
            title: "Built for constrained networks.",
            bullets: ["PWA-ready offline toolkit", "No mandatory cloud calls", "Air-gap friendly"],
        },
    ];

    const shellInk = darkMode ? "#e5e5e5" : "#171717";

    return (
        <div className="landing-marketing-root" style={{ width: "100%", minWidth: 0, color: shellInk }}>
            {/* Hero */}
            <section
                style={{
                    position: "relative",
                    padding: "clamp(4px, 1vw, 10px) clamp(16px, 4vw, 36px) clamp(12px, 2.4vw, 24px)",
                    borderBottom: `1px solid ${line}`,
                    background: darkMode
                        ? "radial-gradient(120% 80% at 10% -10%, rgba(34,211,238,0.08), transparent 45%), radial-gradient(90% 60% at 100% 0%, rgba(99,102,241,0.1), transparent 50%), #09090b"
                        : "radial-gradient(120% 80% at 0% 0%, rgba(79,70,229,0.07), transparent 42%), radial-gradient(80% 50% at 100% -10%, rgba(14,165,233,0.07), transparent 46%), #f8fafc",
                    overflow: "hidden",
                }}
            >
                <motion.div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: darkMode ? 0.06 : 0.1,
                        backgroundImage: darkMode
                            ? "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)"
                            : "linear-gradient(rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.08) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                        y: meshY,
                        pointerEvents: "none",
                        maskImage: "radial-gradient(ellipse 72% 64% at 38% 32%, black, transparent)",
                        WebkitMaskImage: "radial-gradient(ellipse 72% 64% at 38% 32%, black, transparent)",
                    }}
                />

                <div
                    style={{
                        maxWidth: 1240,
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "minmax(0,1fr) minmax(0,min(100%,440px))",
                        gap: "clamp(24px,5vw,48px)",
                        alignItems: "start",
                    }}
                    className="landing-fresh-hero-grid"
                >
                    <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
                        <motion.h1
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                margin: "clamp(32px, 5vw, 68px) 0 12px",
                                padding: 0,
                                border: "none",
                                font: "inherit",
                                fontFamily: "var(--font-landing-display), var(--font-geist-sans), system-ui, sans-serif",
                                fontWeight: 800,
                                fontSize: "clamp(calc(2.5rem + 5px), calc(6vw + 5px), calc(4.35rem + 5px))",
                                lineHeight: 1.06,
                                letterSpacing: "-0.03em",
                                color: textHero,
                            }}
                        >
                            <span
                                className="landing-hero-title-cool"
                                style={{
                                    display: "inline-block",
                                    backgroundImage: darkMode
                                        ? "linear-gradient(105deg,#0e7490 0%,#06b6d4 11%,#22d3ee 20%,#38bdf8 28%,#6366f1 40%,#818cf8 48%,#2dd4bf 58%,#22d3ee 68%,#a78bfa 78%,#f472b6 86%,#fbbf24 100%)"
                                        : "linear-gradient(105deg,#075985 0%,#0369a1 10%,#0284c7 18%,#0ea5e9 26%,#4f46e5 38%,#6366f1 46%,#14b8a6 54%,#0ea5e9 62%,#7c3aed 74%,#c026d3 84%,#ea580c 100%)",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent",
                                }}
                            >
                                My Dev Tools
                            </span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.08 }}
                            style={{
                                margin: "0 0 20px",
                                maxWidth: "44rem",
                                fontFamily: 'var(--font-fraunces), "Palatino Linotype", Palatino, Georgia, serif',
                                fontSize: "clamp(13px, 1.55vw, 15.5px)",
                                lineHeight: 1.55,
                                fontWeight: 520,
                                letterSpacing: "0.02em",
                                color: darkMode ? "#c7d2fe" : "#1e3a5f",
                            }}
                        >
                            Strictly inside this browser tab.
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.18, duration: 0.5 }}
                            style={{
                                margin: "clamp(14px, 2.6vw, 24px) 0 clamp(22px, 3vw, 32px)",
                                maxWidth: "52ch",
                                fontSize: "clamp(15px, 1.5vw, 17px)",
                                lineHeight: 1.62,
                                color: textMuted,
                                fontWeight: 500,
                            }}
                        >
                            Your inputs never round-trip through our servers: what you paste stays inside this tab.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.24 }}
                            style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 6 }}
                        >
                            <Button
                                className="landing-open-catalog-btn"
                                size="large"
                                type="default"
                                onClick={scrollToCatalog}
                                style={{
                                    height: 44,
                                    paddingInline: 22,
                                    fontWeight: 650,
                                    borderRadius: 0,
                                    border: darkMode ? "1px solid #919cff" : "1px solid #6366f1",
                                    backgroundColor: "transparent",
                                    backgroundImage: "none",
                                    color: darkMode ? "#66eaff" : "#0891b2",
                                    boxShadow: darkMode
                                        ? "0 0 16px rgba(123, 140, 255, 0.28), inset 0 1px 0 rgba(255,255,255,0.06)"
                                        : "inset 0 1px 0 rgba(255,255,255,0.1)",
                                    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                                }}
                            >
                                Open catalog <ArrowRightOutlined style={{ marginLeft: 8 }} />
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.18 }} style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ filter: darkMode ? "drop-shadow(0 40px 60px rgba(0,0,0,0.55))" : "drop-shadow(0 36px 48px rgba(15,23,42,0.12))" }}>
                            <HeroConstellation dark={darkMode} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Telemetry strip */}
            <section style={{ padding: "clamp(40px,6vw,72px) clamp(16px,4vw,32px)", background: surface, borderBottom: `1px solid ${line}` }}>
                <div style={{ maxWidth: 1180, margin: "0 auto", borderRadius: 14, overflow: "hidden", border: `1px solid ${line}` }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
                            gap: 1,
                            background: line,
                        }}
                    >
                        {[
                        { kind: "tools" as const, value: stats.total, suffix: "", label: "Utilities available", sub: "formatters to crypto", color: "#22d3ee" },
                        { kind: "categories" as const, value: stats.categories, suffix: "", label: "Coverage areas", sub: "grouped by craft", color: "#a78bfa" },
                        { kind: "trackers" as const, value: 0, suffix: "", label: "Third-party pings", sub: "none wired in", color: "#34d399" },
                        { kind: "client" as const, value: 100, suffix: "%", label: "Work stays client-side", sub: "air-gap friendly UX", color: "#fbbf24" },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} style={{ padding: "clamp(20px,4vw,28px) clamp(18px,3vw,24px)", background: darkMode ? "#0c0c0f" : "#ffffff", minWidth: 0 }}>
                            <div style={{ marginBottom: 10 }}>
                                <LandingStatIcon kind={s.kind} color={s.color} />
                            </div>
                            <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "clamp(2rem,4vw,2.75rem)", fontWeight: 800, letterSpacing: "-0.04em", color: s.color }}>
                                <AnimatedCounter to={s.value} suffix={s.suffix} />
                            </div>
                            <div style={{ marginTop: 8, fontWeight: 650, fontSize: 14, color: textInk }}>{s.label}</div>
                            <div style={{ fontSize: 12.5, color: textMuted }}>{s.sub}</div>
                        </motion.div>
                    ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section style={{ padding: "clamp(40px,9vw,96px) clamp(16px,4vw,32px)", borderBottom: `1px solid ${line}`, background: darkMode ? "#0c0c0f" : "#ffffff" }}>
                <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gap: "clamp(28px,5vw,48px)", gridTemplateColumns: "minmax(0,1fr) minmax(0,340px)", alignItems: "start" }} className="landing-fresh-split">
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ minWidth: 0 }}>
                        <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: accent }}>
                            Why exists
                        </span>
                        <h2 style={{ margin: "14px 0 18px", fontSize: "clamp(1.75rem,3.6vw,2.65rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, color: textHeading }}>
                            Your incident room shouldn&apos;t hinge on whoever ranks first on Google.
                        </h2>
                        <p
                            style={{
                                margin: 0,
                                maxWidth: "44rem",
                                fontFamily: 'var(--font-fraunces), "Palatino Linotype", Palatino, Georgia, serif',
                                fontSize: "clamp(11.75px, 1.28vw, 13.75px)",
                                lineHeight: 1.52,
                                fontWeight: 520,
                                letterSpacing: "0.02em",
                                color: darkMode ? "#c7d2fe" : "#1e3a5f",
                            }}
                        >
                            Paste payloads, certs, JWTs: same ergonomics everywhere, guarded by identical execution rules.
                            Every window is deterministic static JS: what you decrypt never transits someone else&apos;s ingestion queue.
                        </p>
                        <motion.button type="button" onClick={() => scrollCat("Cryptography")} style={{ marginTop: 26, padding: "10px 16px", borderRadius: 999, border: `1px solid ${line}`, background: "transparent", color: accent, cursor: "pointer", fontWeight: 650, fontSize: 13 }}>
                            Jump to cryptography &rarr;
                        </motion.button>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ borderRadius: 18, padding: "20px", border: `1px solid ${line}`, background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", minWidth: 0 }}>
                        <StoryMiniSvg dark={darkMode} />
                    </motion.div>
                </div>
            </section>

            {/* Focus band: picks + pillars */}
            <section style={{ padding: "clamp(40px,8vw,90px) clamp(16px,4vw,32px)", background: surface, borderBottom: `1px solid ${line}` }}>
                <div style={{ maxWidth: 1180, margin: "0 auto" }}>
                    <div className="landing-momentum-head" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, alignItems: "baseline", marginBottom: 26 }}>
                        <h2 style={{ margin: 0, fontSize: "clamp(1.65rem,3.2vw,2.35rem)", fontWeight: 800, letterSpacing: "-0.03em", color: textHeading }}>Momentum picks</h2>
                        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: "0.2em", color: textMuted }}>UPDATED WEEKLY CURATION</span>
                    </div>
                    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", alignItems: "stretch" }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            style={{
                                borderRadius: 22,
                                boxSizing: "border-box",
                                overflow: "visible",
                                padding: "24px",
                                paddingBottom: 28,
                                background: darkMode ? "#09090b" : "#ffffff",
                                border: `1px solid ${line}`,
                            }}
                        >
                            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: "0.16em", color: "#a78bfa", marginBottom: 14 }}>
                                ENGINEER FAVORITES
                            </div>
                            <div style={{ fontWeight: 800, fontSize: "clamp(1.15rem,2.2vw,1.35rem)", color: textHeading, marginBottom: 18 }}>
                                The {FAVORITE_TOOLS.length} tools opened most often.
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                                    gap: "4px 10px",
                                    paddingBottom: 2,
                                }}
                                className="landing-favorites-grid"
                            >
                                {FAVORITE_TOOLS.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => onToolClick(t.id)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            minHeight: 36,
                                            padding: "6px 8px",
                                            border: "none",
                                            background: "transparent",
                                            borderRadius: 8,
                                            cursor: "pointer",
                                            color: darkMode ? "#e4e4e7" : "#27272a",
                                            textAlign: "left",
                                            fontSize: 13,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.045)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                        }}
                                    >
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                                        <span style={{ lineHeight: 1.35 }}>{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.05 }} style={{ borderRadius: 18, border: `1px solid ${darkMode ? "rgba(34,211,238,0.35)" : "rgba(8,145,178,0.45)"}`, padding: 22, background: darkMode ? "linear-gradient(150deg,rgba(34,211,238,0.08),transparent)" : "linear-gradient(150deg,rgba(14,165,233,0.12),#ffffff)", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
                            <LandingStatIcon kind="trackers" color="#34d399" />
                            <h3 style={{ margin: "12px 0 8px", fontSize: 18, fontWeight: 780, color: textHeading }}>Operational privacy</h3>
                            <p style={{ margin: 0, fontSize: 14, color: textMuted, lineHeight: 1.6 }}>
                                SOC reports stay believable: there isn&apos;t a surprise vendor staring at pasted JWT fragments.
                            </p>
                            <ul
                                style={{
                                    margin: "16px 0 0",
                                    padding: 0,
                                    listStyle: "none",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    flex: 1,
                                    minHeight: 0,
                                }}
                            >
                                {[
                                    "Zero bundled analytics or session replay: nothing phones home while you work.",
                                    "Inputs stay in tab memory unless you explicitly copy, download, or navigate away.",
                                    "No hidden ingestion pipeline: subcontractors never receive your paste buffers.",
                                    "Same execution story for auditors: tooling is deterministic static bundles on disk.",
                                ].map((bullet) => (
                                    <li
                                        key={bullet}
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "flex-start",
                                            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                                            fontSize: 13,
                                            fontWeight: 400,
                                            lineHeight: 1.35,
                                            color: darkMode ? "#e4e4e7" : "#27272a",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 6,
                                                height: 6,
                                                flexShrink: 0,
                                                marginTop: 5,
                                                borderRadius: "50%",
                                                background: "#34d399",
                                            }}
                                        />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.08 }} style={{ borderRadius: 18, border: `1px solid ${line}`, padding: 22, display: "flex", flexDirection: "column", gap: 14, background: darkMode ? "#09090b" : "#ffffff", height: "100%", boxSizing: "border-box" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <GithubOutlined style={{ fontSize: 26, color: textInk }} />
                                <div>
                                    <div style={{ fontWeight: 750, fontSize: 16, color: textHeading }}>Auditable codebase</div>
                                    <a href="https://github.com/rameshbgm/mydevtools" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: accent }}>
                                        github.com/rameshbgm/mydevtools →
                                    </a>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", borderTop: `1px dashed ${line}`, paddingTop: 14 }}>
                                <LandingStatIcon kind="client" color="#6366f1" />
                                <PwaInstallLink accent={accent} darkMode={darkMode} />
                            </div>
                            <ul
                                style={{
                                    margin: 0,
                                    padding: `14px 0 0`,
                                    listStyle: "none",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    borderTop: `1px dashed ${line}`,
                                    flex: 1,
                                    minHeight: 0,
                                }}
                            >
                                {[
                                    "MIT licensed: fork, self-host, or pin an internal build behind SSO.",
                                    "Shipped as static assets: vet hashes and file contents exactly as deployed.",
                                    "Open issues and PR history: regressions surface where reviewers already look.",
                                    "Offline shell reuses the same bundles: installs add a launcher, not a new trust surface.",
                                ].map((bullet) => (
                                    <li
                                        key={bullet}
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "flex-start",
                                            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                                            fontSize: 13,
                                            fontWeight: 400,
                                            lineHeight: 1.35,
                                            color: darkMode ? "#e4e4e7" : "#27272a",
                                        }}
                                    >
                                        <span style={{ width: 6, height: 6, flexShrink: 0, marginTop: 5, borderRadius: "50%", background: "#6366f1" }} />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Category explorer */}
            <section style={{ padding: "clamp(40px,7vw,80px) 0 clamp(40px,6vw,72px)", background: darkMode ? "#050506" : "#f4f4f5", borderBottom: `1px solid ${line}` }}>
                <div style={{ paddingInline: "clamp(16px,4vw,32px)", maxWidth: 1240, margin: "0 auto", minWidth: 0 }}>
                    <div className="landing-cat-explorer-head" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18, alignItems: "baseline" }}>
                        <h2 style={{ margin: 0, fontWeight: 800, letterSpacing: "-0.025em", fontSize: "clamp(1.6rem,3vw,2.2rem)", color: textHeading }}>Navigate by discipline</h2>
                        <span style={{ color: textMuted, fontSize: 13 }}>
                            {CATEGORY_ORDER.length} namespaces · row auto-scrolls (hover or keyboard focus to pause and open a chip)
                        </span>
                    </div>
                    <div className="landing-cat-marquee-mask">
                        <div className="landing-cat-marquee-track landing-cat-strip">
                            {categoryStripChips.map((cat, i) => {
                                const c = CATEGORY_COLORS[cat];
                                const hash = categoryAnchorId(cat);
                                return (
                                    <motion.a
                                        key={`${cat}-${i}`}
                                        href={`#${hash}`}
                                        aria-label={`Jump to ${cat} tools in the catalog`}
                                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                            e.preventDefault();
                                            scrollCat(cat);
                                        }}
                                        whileHover={{ y: -2 }}
                                        className="landing-cat-chip-link"
                                        style={{
                                            flex: "0 0 auto",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "12px 18px",
                                            borderRadius: 999,
                                            border: `1px solid ${darkMode ? "#27272a" : "#d4d4d8"}`,
                                            background: darkMode ? "#0c0c0f" : "#ffffff",
                                            color: textInk,
                                            cursor: "pointer",
                                            fontWeight: 600,
                                            fontSize: 13,
                                            textDecoration: "none",
                                            WebkitTapHighlightColor: "transparent",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        <SvgCategoryGlyph category={cat} color={c} />
                                        {cat}
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                    <div style={{ marginTop: 20, columnCount: 2, columnGap: "clamp(16px,3vw,32px)", color: textMuted, fontSize: 12.75, lineHeight: 1.55 }} className="landing-fresh-meta">
                        {CATEGORY_ORDER.slice(0, 8).map((cat) => (
                            <div key={`d-${cat}`} style={{ breakInside: "avoid", marginBottom: 12 }}>
                                <strong style={{ color: textInk }}>{cat}</strong>
                                {": "}
                                <span>{CATEGORY_DESCRIPTIONS[cat]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Privacy */}
            <section style={{ padding: "clamp(40px,7vw,86px) clamp(16px,4vw,32px)", background: surface, borderBottom: `1px solid ${line}` }}>
                <div style={{ maxWidth: 1080, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#34d399", marginBottom: 14 }}>
                        <LockOutlined /> Trust model
                    </div>
                    <div style={{ display: "grid", gap: "clamp(28px,4vw,40px)", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }} className="landing-fresh-privacy-grid">
                        <div>
                            <h2 style={{ margin: "0 0 16px", fontSize: "clamp(1.8rem,3.8vw,2.6rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.06, color: textHeading }}>
                                You own the silicon path your bytes travel.
                            </h2>
                            <p style={{ margin: 0, color: textMuted, fontSize: 15, lineHeight: 1.7 }}>Five promises still hold: summarized sharper so legal can skim without squinting.</p>
                            <div style={{ marginTop: 22, borderRadius: 16, overflow: "hidden", border: `1px solid ${line}` }}>
                                {privacyBullets.map((p, idx) => (
                                    <div key={p.t} style={{ padding: "16px 18px", borderBottom: idx < privacyBullets.length - 1 ? `1px solid ${line}` : undefined, background: darkMode ? "#09090b" : "#ffffff" }}>
                                        <div style={{ fontWeight: 750, marginBottom: 4, fontSize: 14, color: textHeading }}>{p.t}</div>
                                        <div style={{ fontSize: 13, color: textMuted }}>{p.d}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <PrivacyFlowGraphic dark={darkMode} />
                    </div>
                </div>
            </section>

            {/* Built-for */}
            <section style={{ padding: "clamp(40px,8vw,88px) clamp(16px,4vw,32px)", background: darkMode ? "#09090b" : "#f8fafc", borderBottom: `1px solid ${line}` }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <h2 className="landing-built-for-heading" style={{ margin: "0 0 clamp(26px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.03em", color: textHeading }}>
                        Architected alongside security reviews.
                    </h2>
                    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 268px), 1fr))" }}>
                        {builtCards.map((card, i) => (
                            <motion.div key={card.tag} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} style={{ padding: "24px", borderRadius: 16, border: `1px solid ${line}`, background: darkMode ? "#0c0c0f" : "#ffffff" }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${card.accent}1a`, color: card.accent, display: "grid", placeItems: "center", fontSize: 20, marginBottom: 14 }}>{card.icon}</div>
                                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: "0.18em", color: card.accent }}>{card.tag}</span>
                                <h3 style={{ margin: "12px 0", fontSize: 18.5, fontWeight: 750, letterSpacing: "-0.015em", color: textHeading }}>{card.title}</h3>
                                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                                    {card.bullets.map((b) => (
                                        <li key={b} style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 13.5, color: textMuted }}>
                                            <span style={{ width: 4, height: 4, flexShrink: 0, marginTop: 7, borderRadius: "50%", background: card.accent }} /> {b}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Marquee */}
            <section style={{ padding: "clamp(40px,6vw,72px) 0 clamp(40px,5vw,64px)", background: darkMode ? "#030304" : "#f4f4f5", borderBottom: `1px solid ${line}` }}>
                <div className="landing-marquee-intro" style={{ textAlign: "center", padding: "0 clamp(16px,4vw,32px)", marginBottom: 26 }}>
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: "0.22em", color: accent }}>
                        SAMPLE OF THE CATALOG
                    </span>
                    <div style={{ marginTop: 8, fontSize: "clamp(13px,3.8vw,15px)", color: textMuted, paddingInline: 4, maxWidth: "min(44ch,100%)", marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
                        Hover the belt to freeze · {stats.total} tools live underneath
                    </div>
                </div>
                <div className="tool-marquee-mask">
                    <div className="tool-marquee-track">
                        {[...marqueeTools, ...marqueeTools].map((tool, i) => (
                            <button
                                key={`${tool.id}-${i}`}
                                type="button"
                                onClick={() => onToolClick(tool.id)}
                                style={{
                                    flexShrink: 0,
                                    padding: "10px 16px",
                                    borderRadius: 999,
                                    border: `1px solid ${darkMode ? "#27272a" : "#e4e4e7"}`,
                                    background: darkMode ? "#0c0c0f" : "#ffffff",
                                    color: textInk,
                                    fontFamily: "var(--font-geist-mono)",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    fontWeight: 500,
                                }}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, { borderColor: tool.color, color: tool.color })}
                                onMouseLeave={(e) =>
                                    Object.assign(e.currentTarget.style, {
                                        borderColor: darkMode ? "#27272a" : "#e4e4e7",
                                        color: textInk,
                                    })}
                            >
                                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: tool.color, marginRight: 10, verticalAlign: "middle" }} />
                                {tool.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

/** Compact story illustration: broken cloud vs guarded tab */
function StoryMiniSvg({ dark }: { dark: boolean }) {
    return (
        <svg viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg" aria-hidden className="landing-story-svg mx-auto block h-auto w-full max-w-full">
            <motion.rect x={36} y={48} width={108} height={140} rx={14} fill={dark ? "#18181b" : "#fafafa"} stroke="#f97373" strokeWidth={2} strokeDasharray="5 6" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />
            <motion.path d="M68 118 L132 208 M132 118 L68 208" stroke="#fb7185" strokeWidth={2.8} strokeLinecap="round" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} />
            <text x={90} y={36} fill={dark ? "#71717a" : "#71717a"} fontSize={10} textAnchor="middle" fontFamily="monospace">
                unknown host
            </text>

            <motion.rect x={184} y={40} width={112} height={156} rx={16} fill={dark ? "#0c0c0f" : "#ffffff"} stroke={dark ? "#3f3f46" : "#cbd5e1"} strokeWidth={1.8} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }} />
            <motion.rect x={196} y={52} width={88} height={18} rx={6} fill="#22d3ee22" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2.6 }} />
            <motion.path d="M204 138 H268 M204 160 H246 M204 182 H258" stroke={dark ? "#52525b" : "#cbd5e1"} strokeWidth={6} strokeLinecap="round" opacity={0.45} />
            <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                <circle cx={240} cy={210} r={22} stroke="#34d399" strokeWidth={2} fill="#34d39911" />
                <path d="M228 210 L236 218 L253 194" stroke="#34d399" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </motion.g>
            <text x={240} y={228} dy={22} fill={dark ? "#fafafa" : "#18181b"} fontSize={11} fontWeight={600} textAnchor="middle" fontFamily="system-ui">
                My Dev Tools
            </text>
        </svg>
    );
}

function PrivacyFlowGraphic({ dark }: { dark: boolean }) {
    const cols = dark ? "#e4e4e7" : "#18181b";
    const sub = dark ? "#a1a1aa" : "#52525b";
    return (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ borderRadius: 18, border: `1px solid ${dark ? "#27272a" : "#d1d5db"}`, padding: "clamp(22px, 3vw, 28px)", background: dark ? "#09090b" : "#ffffff", minWidth: 0, overflow: "hidden" }}>
            <FlowSvg dark={dark} />
            <div style={{ marginTop: 18, fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#818cf8" }}>PIPELINE VISUALIZATION</div>
            {[
                ["Input", "Touched exclusively by Chromium/WebKit primitives"],
                ["Transform", "Your CPU time: no outsourced worker"],
                ["Output", "Clipboard + screen buffers you already control"],
            ].map(([a, b], i) => (
                <div key={a} style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 740, fontSize: 14, color: cols }}>{a}</div>
                    <div style={{ fontSize: 13, color: sub }}>{b}</div>
                    {i < 2 ? <motion.div animate={{ opacity: [0.3, 0.95, 0.3], scaleY: [0.9, 1, 0.9] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }} style={{ marginTop: 10, marginBottom: -4, marginLeft: 6, borderLeft: "2px dashed #6366f1", height: 18 }} /> : null}
                </div>
            ))}
        </motion.div>
    );
}

function FlowSvg({ dark }: { dark: boolean }) {
    const stroke = dark ? "#3f3f46" : "#d4d4d8";
    return (
        <svg viewBox="0 0 360 108" xmlns="http://www.w3.org/2000/svg" aria-hidden className="mx-auto block h-auto w-full max-w-full">
            {[0, 1, 2].map((i) => {
                const cx = 60 + i * 120;
                return (
                    <g key={i}>
                        <rect x={cx - 54} y={18} width={108} height={52} rx={12} stroke={stroke} strokeWidth={1.4} fill={dark ? "#0c0c0f" : "#fafafa"} />
                        <motion.circle cx={cx} cy={44} r={6} fill={i < 2 ? "#6366f1" : "#34d399"} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity }} />
                        <text x={cx} y={88} fill={dark ? "#a1a1aa" : "#52525b"} fontSize={11} fontFamily="var(--font-geist-mono), monospace" textAnchor="middle">
                            {["paste", "transform", "return"][i]}
                        </text>
                    </g>
                );
            })}
            <motion.path d="M120 43 H168" stroke="#6366f1" strokeWidth={2} fill="none" strokeDasharray="6 10" animate={{ strokeDashoffset: [-16, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />
            <motion.path d="M240 43 H288" stroke="#6366f1" strokeWidth={2} fill="none" strokeDasharray="6 10" animate={{ strokeDashoffset: [-16, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear", delay: 0.4 }} />
        </svg>
    );
}

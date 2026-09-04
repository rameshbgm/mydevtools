"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
    CATEGORY_COLORS,
    CATEGORY_ORDER,
    type ToolCategory,
} from "@/lib/tools-registry";
import { dashboardCategoryHashId } from "@/lib/category-routes";
import { APP_VERSION } from "@/lib/release-notes";
import { triggerPwaInstallPrompt } from "@/lib/pwa-install-prompt";
import { messageService } from "@/lib/messageService";

interface LandingMarketingProps {
    darkMode: boolean;
    stats: { total: number; categories: number };
    marqueeTools: Array<{ id: string; name: string; color: string }>;
    onToolClick: (id: string) => void;
}

/* ────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────── */

function scrollToCatalog() {
    document
        .getElementById("landing-full-catalog")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [value, setValue] = useState(to);
    useEffect(() => {
        setValue(0);
        const duration = 1200;
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
    }, [to]);
    return (
        <span ref={ref}>
            {value}
            {suffix}
        </span>
    );
}

/* ────────────────────────────────────────────────────────────────
   Spotlight tools (curated)
   ──────────────────────────────────────────────────────────────── */

const SPOTLIGHT: Array<{
    id: string;
    name: string;
    blurb: string;
    visual: "json" | "hash" | "regex" | "jwt";
}> = [
    {
        id: "json-formatter",
        name: "JSON Formatter",
        blurb: "Pretty-print, validate and explore JSON trees with depth-aware folding.",
        visual: "json",
    },
    {
        id: "regex-tester",
        name: "Regex Tester",
        blurb: "Live match highlighting, capture groups and flag-aware previews.",
        visual: "regex",
    },
    {
        id: "hash-generator",
        name: "Hash Generator",
        blurb: "MD5, SHA family, BLAKE — drag a file or paste text, get digests instantly.",
        visual: "hash",
    },
    {
        id: "jwt-decoder",
        name: "JWT Decoder",
        blurb: "Decode header, payload and signature without the token leaving the tab.",
        visual: "jwt",
    },
];

/* ────────────────────────────────────────────────────────────────
   Inline SVG illustrations (currentColor + theme variables)
   ──────────────────────────────────────────────────────────────── */

function HeroIllustration() {
    return (
        <svg
            viewBox="0 0 520 420"
            className="lv-hero-svg"
            role="img"
            aria-label="Stylised developer tools — JSON tree, hash bars and a regex bracket"
        >
            <defs>
                <linearGradient id="lv-hero-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--lv-accent)" />
                    <stop offset="100%" stopColor="var(--lv-accent-2)" />
                </linearGradient>
                <linearGradient id="lv-hero-fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--lv-accent)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="var(--lv-accent)" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Soft backdrop card */}
            <rect
                x="20"
                y="20"
                width="480"
                height="380"
                rx="22"
                fill="var(--lv-card)"
                stroke="var(--lv-line)"
                strokeWidth="1"
            />
            <rect x="20" y="20" width="480" height="160" rx="22" fill="url(#lv-hero-fade)" />

            {/* Window dots */}
            <g transform="translate(44 50)">
                <circle r="6" cx="0" cy="0" fill="var(--lv-line-strong)" />
                <circle r="6" cx="20" cy="0" fill="var(--lv-line-strong)" />
                <circle r="6" cx="40" cy="0" fill="var(--lv-line-strong)" />
            </g>

            {/* JSON tree (left column) */}
            <g
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize="13"
                fill="var(--lv-text)"
            >
                <text x="46" y="100">{"{"}</text>
                <text x="66" y="124" fill="var(--lv-accent)">{"\"name\""}</text>
                <text x="115" y="124">: </text>
                <text x="128" y="124" fill="var(--lv-accent-2)">{"\"mytools\""}</text>
                <text x="66" y="148" fill="var(--lv-accent)">{"\"version\""}</text>
                <text x="128" y="148">: </text>
                <text x="141" y="148" fill="var(--lv-accent-2)">{`"${APP_VERSION}"`}</text>
                <text x="66" y="172" fill="var(--lv-accent)">{"\"local\""}</text>
                <text x="115" y="172">: </text>
                <text x="128" y="172" fill="var(--lv-accent-2)">true</text>
                <text x="46" y="196">{"}"}</text>
            </g>

            {/* Tree connector lines */}
            <g
                stroke="var(--lv-line)"
                strokeWidth="1"
                strokeDasharray="2 4"
                fill="none"
            >
                <path d="M55 108 L55 178" />
                <path d="M55 122 L65 122" />
                <path d="M55 146 L65 146" />
                <path d="M55 170 L65 170" />
            </g>

            {/* Hash bars (centre) */}
            <g transform="translate(248 86)">
                <text
                    x="0"
                    y="-6"
                    fontFamily="ui-monospace, monospace"
                    fontSize="11"
                    fill="var(--lv-text-muted)"
                    letterSpacing="1"
                >
                    SHA-256
                </text>
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {Array.from({ length: 32 }).map((_, i) => {
                        const h = 6 + ((i * 37) % 70);
                        return (
                            <rect
                                key={i}
                                x={i * 6}
                                y={70 - h}
                                width="3.4"
                                height={h}
                                rx="1.2"
                                fill="url(#lv-hero-grad)"
                                opacity={0.5 + ((i * 7) % 50) / 100}
                            />
                        );
                    })}
                </motion.g>
                <text
                    x="0"
                    y="92"
                    fontFamily="ui-monospace, monospace"
                    fontSize="10"
                    fill="var(--lv-text-muted)"
                >
                    a3f2…91c4
                </text>
            </g>

            {/* Regex bracket (right) */}
            <g transform="translate(396 64)">
                <rect
                    width="98"
                    height="118"
                    rx="14"
                    fill="var(--lv-card-2)"
                    stroke="var(--lv-line)"
                />
                <text
                    x="49"
                    y="32"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="11"
                    fill="var(--lv-text-muted)"
                    letterSpacing="1"
                >
                    REGEX
                </text>
                <text
                    x="49"
                    y="68"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="22"
                    fontWeight="700"
                    fill="var(--lv-accent)"
                >
                    /^\d+$/
                </text>
                <g
                    fontFamily="ui-monospace, monospace"
                    fontSize="10"
                    fill="var(--lv-text-muted)"
                >
                    <text x="14" y="92">42</text>
                    <text x="38" y="92">2026</text>
                    <text x="74" y="92">v1</text>
                </g>
                <line
                    x1="14"
                    y1="98"
                    x2="32"
                    y2="98"
                    stroke="var(--lv-accent)"
                    strokeWidth="2"
                />
                <line
                    x1="38"
                    y1="98"
                    x2="68"
                    y2="98"
                    stroke="var(--lv-accent)"
                    strokeWidth="2"
                />
            </g>

            {/* Lower row: chips */}
            <g transform="translate(44 232)">
                {[
                    { l: "JWT", w: 56 },
                    { l: "Base64", w: 72 },
                    { l: "URL", w: 56 },
                    { l: "YAML", w: 64 },
                    { l: "X.509", w: 64 },
                    { l: "Cron", w: 60 },
                ].map((c, i, arr) => {
                    const x = arr.slice(0, i).reduce((s, b) => s + b.w + 8, 0);
                    return (
                        <g key={c.l} transform={`translate(${x} 0)`}>
                            <rect
                                width={c.w}
                                height="28"
                                rx="14"
                                fill="var(--lv-card-2)"
                                stroke="var(--lv-line)"
                            />
                            <text
                                x={c.w / 2}
                                y="18"
                                textAnchor="middle"
                                fontFamily="ui-monospace, monospace"
                                fontSize="11"
                                fill="var(--lv-text)"
                            >
                                {c.l}
                            </text>
                        </g>
                    );
                })}
            </g>

            {/* Bottom: privacy lock badge */}
            <g transform="translate(44 282)">
                <rect
                    width="432"
                    height="92"
                    rx="14"
                    fill="var(--lv-card-2)"
                    stroke="var(--lv-line)"
                />
                <g transform="translate(20 24)">
                    <circle cx="22" cy="22" r="22" fill="url(#lv-hero-grad)" opacity="0.15" />
                    <path
                        d="M14 22 v-4 a8 8 0 0 1 16 0 v4 M10 22 h28 v18 h-28z"
                        fill="none"
                        stroke="var(--lv-accent)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <text
                    x="80"
                    y="46"
                    fontFamily="var(--font-geist-sans), system-ui"
                    fontSize="13"
                    fontWeight="700"
                    fill="var(--lv-text)"
                >
                    Runs entirely in your browser
                </text>
                <text
                    x="80"
                    y="64"
                    fontFamily="var(--font-geist-sans), system-ui"
                    fontSize="12"
                    fill="var(--lv-text-muted)"
                >
                    No server round-trip · zero telemetry · install offline
                </text>
            </g>
        </svg>
    );
}

function PillarIcon({ kind }: { kind: "privacy" | "speed" | "open" }) {
    if (kind === "privacy") {
        return (
            <svg viewBox="0 0 64 64" className="lv-pillar-svg" aria-hidden="true">
                <path
                    d="M32 6 L54 16 V32 C54 46 44 56 32 60 C20 56 10 46 10 32 V16 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                />
                <path
                    d="M22 32 l8 8 14-16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }
    if (kind === "speed") {
        return (
            <svg viewBox="0 0 64 64" className="lv-pillar-svg" aria-hidden="true">
                <path
                    d="M32 4 L8 36 H28 L20 60 L56 24 H36 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 64 64" className="lv-pillar-svg" aria-hidden="true">
            <path
                d="M22 14 L8 32 L22 50 M42 14 L56 32 L42 50 M36 10 L28 54"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CategoryGlyph({ category }: { category: ToolCategory }) {
    const initials = category
        .split(/\s+/)
        .map((w) => w[0])
        .filter((c) => /[A-Za-z]/.test(c))
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return (
        <svg viewBox="0 0 56 56" className="lv-cat-glyph" aria-hidden="true">
            <rect
                x="2"
                y="2"
                width="52"
                height="52"
                rx="14"
                fill="currentColor"
                opacity="0.12"
            />
            <rect
                x="2"
                y="2"
                width="52"
                height="52"
                rx="14"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.5"
                strokeWidth="1"
            />
            <text
                x="28"
                y="35"
                textAnchor="middle"
                fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                fontSize="18"
                fontWeight="700"
                fill="currentColor"
            >
                {initials}
            </text>
        </svg>
    );
}

function SpotlightVisual({ kind }: { kind: "json" | "hash" | "regex" | "jwt" }) {
    if (kind === "json") {
        return (
            <svg viewBox="0 0 200 120" className="lv-spot-svg" aria-hidden="true">
                <rect width="200" height="120" rx="10" fill="var(--lv-card-2)" />
                <g
                    fontFamily="ui-monospace, monospace"
                    fontSize="10"
                    fill="var(--lv-text)"
                >
                    <text x="14" y="22">{"{"}</text>
                    <text x="26" y="40" fill="var(--lv-accent)">{"\"id\""}</text>
                    <text x="48" y="40">: 42,</text>
                    <text x="26" y="58" fill="var(--lv-accent)">{"\"tags\""}</text>
                    <text x="60" y="58">: [</text>
                    <text x="38" y="76" fill="var(--lv-accent-2)">{"\"json\""}</text>
                    <text x="68" y="76">,</text>
                    <text x="38" y="94" fill="var(--lv-accent-2)">{"\"yaml\""}</text>
                    <text x="26" y="112">],</text>
                </g>
            </svg>
        );
    }
    if (kind === "hash") {
        return (
            <svg viewBox="0 0 200 120" className="lv-spot-svg" aria-hidden="true">
                <rect width="200" height="120" rx="10" fill="var(--lv-card-2)" />
                {Array.from({ length: 40 }).map((_, i) => {
                    const h = 8 + ((i * 41) % 70);
                    return (
                        <rect
                            key={i}
                            x={10 + i * 4.5}
                            y={104 - h}
                            width="2.4"
                            height={h}
                            rx="1"
                            fill="var(--lv-accent)"
                            opacity={0.4 + ((i * 11) % 50) / 100}
                        />
                    );
                })}
            </svg>
        );
    }
    if (kind === "regex") {
        return (
            <svg viewBox="0 0 200 120" className="lv-spot-svg" aria-hidden="true">
                <rect width="200" height="120" rx="10" fill="var(--lv-card-2)" />
                <text
                    x="100"
                    y="56"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="20"
                    fontWeight="700"
                    fill="var(--lv-accent)"
                >
                    /\b\w+@\w+/g
                </text>
                <g fontFamily="ui-monospace, monospace" fontSize="10" fill="var(--lv-text-muted)">
                    <text x="20" y="86">user@host</text>
                    <text x="100" y="86">a@b.io</text>
                </g>
                <line x1="20" y1="92" x2="76" y2="92" stroke="var(--lv-accent)" strokeWidth="2" />
                <line x1="100" y1="92" x2="138" y2="92" stroke="var(--lv-accent)" strokeWidth="2" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 200 120" className="lv-spot-svg" aria-hidden="true">
            <rect width="200" height="120" rx="10" fill="var(--lv-card-2)" />
            <g fontFamily="ui-monospace, monospace" fontSize="9">
                <rect x="10" y="14" width="56" height="92" rx="6" fill="var(--lv-accent)" opacity="0.18" />
                <rect x="72" y="14" width="56" height="92" rx="6" fill="var(--lv-accent-2)" opacity="0.18" />
                <rect x="134" y="14" width="56" height="92" rx="6" fill="var(--lv-text-muted)" opacity="0.16" />
                <text x="38" y="34" textAnchor="middle" fill="var(--lv-accent)" fontWeight="700">HEAD</text>
                <text x="100" y="34" textAnchor="middle" fill="var(--lv-accent-2)" fontWeight="700">PAYLOAD</text>
                <text x="162" y="34" textAnchor="middle" fill="var(--lv-text-muted)" fontWeight="700">SIG</text>
                <text x="38" y="58" textAnchor="middle" fill="var(--lv-text)">alg</text>
                <text x="38" y="74" textAnchor="middle" fill="var(--lv-text)">typ</text>
                <text x="100" y="58" textAnchor="middle" fill="var(--lv-text)">sub</text>
                <text x="100" y="74" textAnchor="middle" fill="var(--lv-text)">exp</text>
                <text x="100" y="90" textAnchor="middle" fill="var(--lv-text)">iat</text>
            </g>
        </svg>
    );
}

/* ────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────── */

export default function LandingMarketing({
    darkMode,
    stats,
    marqueeTools,
    onToolClick,
}: Readonly<LandingMarketingProps>) {
    const reduceMotion = useReducedMotion();

    const marqueeRow = useMemo(
        () => (reduceMotion === true ? marqueeTools : [...marqueeTools, ...marqueeTools]),
        [marqueeTools, reduceMotion],
    );

    const handleInstall = async () => {
        const ok = await triggerPwaInstallPrompt();
        if (!ok) {
            messageService.info(
                "Use your browser's install control in the address bar — works on Chrome, Edge and Safari.",
            );
        }
    };

    return (
        <div className={`lv-root ${darkMode ? "lv-dark" : "lv-light"}`}>
            <ScopedStyles />

            {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
            <section className="lv-hero">
                <div className="lv-container lv-hero-grid">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                        className="lv-hero-copy"
                    >
                        <div className="lv-eyebrow">
                            <span className="lv-eyebrow-dot" />
                            <span>v{APP_VERSION} · {Math.max(stats.total, 80)}+ tools, all local</span>
                        </div>
                        <h1 className="lv-hero-title">
                            The developer toolkit that <em>never leaves your tab.</em>
                        </h1>
                        <p className="lv-hero-sub">
                            Format, validate, decode, hash, diff, convert. Browser-native
                            tools for the things you reach for ten times a day — without
                            a paste-buffer ever leaving your machine.
                        </p>

                        <div className="lv-cta-row">
                            <button
                                type="button"
                                onClick={scrollToCatalog}
                                className="lv-btn lv-btn-primary"
                            >
                                Browse the catalog
                                <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                                    <path
                                        d="M4 10 h12 M11 5 l5 5 -5 5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={handleInstall}
                                className="lv-btn lv-btn-ghost"
                            >
                                <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                                    <path
                                        d="M10 3 v10 M5 8 l5 5 5-5 M3 16 h14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Install offline app
                            </button>
                        </div>

                        <dl className="lv-hero-stats">
                            <div>
                                <dt>Tools</dt>
                                <dd>
                                    <AnimatedCounter to={Math.max(stats.total, 80)} suffix="+" />
                                </dd>
                            </div>
                            <div>
                                <dt>Categories</dt>
                                <dd>
                                    <AnimatedCounter to={stats.categories} />
                                </dd>
                            </div>
                        </dl>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="lv-hero-art"
                    >
                        <HeroIllustration />
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════ PILLARS ═══════════════════════════════ */}
            <section className="lv-section lv-pillars">
                <div className="lv-container">
                    <header className="lv-section-head">
                        <span className="lv-section-eyebrow">Why mytools</span>
                        <h2 className="lv-section-title">Three principles, no exceptions.</h2>
                    </header>

                    <div className="lv-pillar-grid">
                        {[
                            {
                                kind: "privacy" as const,
                                title: "Private by construction",
                                body: "Every tool runs in the browser. Your tokens, payloads and certificates never reach a server because there isn't one.",
                            },
                            {
                                kind: "speed" as const,
                                title: "Instant by default",
                                body: "Zero round-trips. Zero loading spinners on tools you use daily. Cached after first visit, fully usable offline.",
                            },
                            {
                                kind: "open" as const,
                                title: "Open and inspectable",
                                body: "MIT-licensed source. Static bundles. Self-host behind SSO or audit the build — no hidden network calls to grep for.",
                            },
                        ].map((p, i) => (
                            <motion.article
                                key={p.kind}
                                className="lv-pillar"
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.45, delay: i * 0.08 }}
                            >
                                <div className="lv-pillar-icon">
                                    <PillarIcon kind={p.kind} />
                                </div>
                                <h3>{p.title}</h3>
                                <p>{p.body}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════ CATEGORIES ═══════════════════════════════ */}
            <section className="lv-section lv-categories">
                <div className="lv-container">
                    <header className="lv-section-head lv-section-head-row">
                        <div>
                            <span className="lv-section-eyebrow">Catalog</span>
                            <h2 className="lv-section-title">Navigate by discipline.</h2>
                        </div>
                        <button
                            type="button"
                            className="lv-link-btn"
                            onClick={scrollToCatalog}
                        >
                            See full grid
                            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                                <path
                                    d="M3 8 h10 M9 4 l4 4 -4 4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </header>

                    <div className="lv-cat-grid">
                        {CATEGORY_ORDER.map((category, i) => {
                            const color = CATEGORY_COLORS[category];
                            return (
                                <motion.button
                                    key={category}
                                    type="button"
                                    className="lv-cat-tile"
                                    style={{ color }}
                                    onClick={() => {
                                        const id = dashboardCategoryHashId(category);
                                        document
                                            .getElementById(id)
                                            ?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.35, delay: (i % 8) * 0.04 }}
                                    whileHover={{ y: -3 }}
                                >
                                    <CategoryGlyph category={category} />
                                    <span className="lv-cat-label">{category}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════ SPOTLIGHT ═══════════════════════════════ */}
            <section className="lv-section lv-spotlight">
                <div className="lv-container">
                    <header className="lv-section-head">
                        <span className="lv-section-eyebrow">Most used</span>
                        <h2 className="lv-section-title">The four tools nobody admits to opening daily.</h2>
                    </header>

                    <div className="lv-spot-grid">
                        {SPOTLIGHT.map((s, i) => (
                            <motion.button
                                type="button"
                                key={s.id}
                                onClick={() => onToolClick(s.id)}
                                className="lv-spot-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.45, delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                            >
                                <SpotlightVisual kind={s.visual} />
                                <h3>{s.name}</h3>
                                <p>{s.blurb}</p>
                                <span className="lv-spot-cta">
                                    Open
                                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                                        <path
                                            d="M3 8 h10 M9 4 l4 4 -4 4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════ FINAL CTA ═══════════════════════════════ */}
            <section className="lv-section lv-final">
                <div className="lv-container">
                    <div className="lv-final-card">
                        <div className="lv-final-copy">
                            <h2>Open one tool. Stay for the rest.</h2>
                            <p>
                                No accounts, no upsells, no telemetry. Just the toolbelt you
                                already wish your bookmarks bar held.
                            </p>
                            <div className="lv-cta-row">
                                <button
                                    type="button"
                                    onClick={scrollToCatalog}
                                    className="lv-btn lv-btn-primary"
                                >
                                    Browse {Math.max(stats.total, 80)}+ tools
                                </button>
                            </div>
                        </div>
                        <svg
                            viewBox="0 0 280 220"
                            className="lv-final-art"
                            aria-hidden="true"
                        >
                            <defs>
                                <linearGradient id="lv-final-grad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="var(--lv-accent)" />
                                    <stop offset="100%" stopColor="var(--lv-accent-2)" />
                                </linearGradient>
                            </defs>
                            <circle cx="140" cy="110" r="92" fill="url(#lv-final-grad)" opacity="0.18" />
                            <circle cx="140" cy="110" r="64" fill="none" stroke="url(#lv-final-grad)" strokeWidth="2" strokeDasharray="3 5" />
                            <g fontFamily="ui-monospace, monospace" fontSize="11" fill="var(--lv-text)">
                                <text x="140" y="100" textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--lv-accent)">
                                    {Math.max(stats.total, 80)}+
                                </text>
                                <text x="140" y="124" textAnchor="middle" fill="var(--lv-text-muted)">
                                    tools, no accounts
                                </text>
                            </g>
                        </svg>
                    </div>

                    {/* Marquee strip */}
                    {marqueeTools.length > 0 && (
                        <div className="lv-marquee">
                            <div className={`lv-marquee-track ${reduceMotion ? "lv-marquee-static" : ""}`}>
                                {marqueeRow.map((t, i) => (
                                    <button
                                        key={`${t.id}-${i}`}
                                        type="button"
                                        className="lv-chip"
                                        onClick={() => onToolClick(t.id)}
                                        style={{ ["--chip-color" as string]: t.color }}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────
   Scoped styles — single style tag, all classes prefixed `lv-`
   Theme switches via `.lv-dark` / `.lv-light` modifier classes,
   so we never branch in JS. SVGs use var(--lv-*) tokens.
   ──────────────────────────────────────────────────────────────── */

function ScopedStyles() {
    return (
        <style jsx global>{`
            .lv-root {
                --lv-accent: #0891b2;
                --lv-accent-2: #6366f1;
                --lv-bg: #f8fafc;
                --lv-bg-2: #ffffff;
                --lv-card: #ffffff;
                --lv-card-2: #f4f4f5;
                --lv-line: #e4e4e7;
                --lv-line-strong: #d4d4d8;
                --lv-text: #18181b;
                --lv-text-muted: #52525b;
                --lv-shadow: 0 1px 2px rgba(15, 23, 42, 0.04),
                    0 8px 24px rgba(15, 23, 42, 0.06);
                width: 100%;
                color: var(--lv-text);
                background: var(--lv-bg);
                font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif;
            }
            .lv-root.lv-dark {
                --lv-accent: #22d3ee;
                --lv-accent-2: #818cf8;
                --lv-bg: #09090b;
                --lv-bg-2: #0c0c0f;
                --lv-card: #111114;
                --lv-card-2: #1a1a1f;
                --lv-line: #27272a;
                --lv-line-strong: #3f3f46;
                --lv-text: #fafafa;
                --lv-text-muted: #a1a1aa;
                --lv-shadow: 0 1px 2px rgba(0, 0, 0, 0.5),
                    0 8px 24px rgba(0, 0, 0, 0.4);
            }

            .lv-container {
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 clamp(16px, 4vw, 32px);
                box-sizing: border-box;
            }

            /* ───── HERO ───── */
            .lv-hero {
                position: relative;
                padding: clamp(40px, 7vw, 88px) 0 clamp(48px, 8vw, 104px);
                overflow: hidden;
                background:
                    radial-gradient(60% 50% at 8% 0%, color-mix(in oklab, var(--lv-accent) 14%, transparent), transparent 60%),
                    radial-gradient(50% 40% at 100% 0%, color-mix(in oklab, var(--lv-accent-2) 14%, transparent), transparent 60%),
                    var(--lv-bg);
                border-bottom: 1px solid var(--lv-line);
            }
            .lv-hero-grid {
                display: grid;
                gap: clamp(28px, 4vw, 56px);
                grid-template-columns: 1fr;
                align-items: center;
            }
            @media (min-width: 1024px) {
                .lv-hero-grid {
                    grid-template-columns: 1.15fr 1fr;
                }
            }
            .lv-eyebrow {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 6px 12px;
                border-radius: 999px;
                background: color-mix(in oklab, var(--lv-accent) 10%, transparent);
                color: var(--lv-accent);
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.02em;
                border: 1px solid color-mix(in oklab, var(--lv-accent) 30%, transparent);
            }
            .lv-eyebrow-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: currentColor;
                box-shadow: 0 0 0 4px color-mix(in oklab, var(--lv-accent) 20%, transparent);
            }
            .lv-hero-title {
                margin: 18px 0 16px;
                font-size: clamp(2rem, 5.4vw, 3.75rem);
                font-weight: 800;
                line-height: 1.05;
                letter-spacing: -0.035em;
                color: var(--lv-text);
            }
            .lv-hero-title em {
                font-style: normal;
                background: linear-gradient(120deg, var(--lv-accent), var(--lv-accent-2));
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }
            .lv-hero-sub {
                margin: 0 0 28px;
                font-size: clamp(1rem, 1.5vw, 1.15rem);
                line-height: 1.6;
                color: var(--lv-text-muted);
                max-width: 56ch;
            }
            .lv-cta-row {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin-bottom: clamp(28px, 4vw, 40px);
            }
            .lv-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 12px 20px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                font-family: inherit;
                cursor: pointer;
                border: 1px solid transparent;
                transition: transform 0.15s ease, background 0.15s ease,
                    border-color 0.15s ease, box-shadow 0.15s ease;
                white-space: nowrap;
            }
            .lv-btn:hover { transform: translateY(-1px); }
            .lv-btn:active { transform: translateY(0); }
            .lv-btn-primary {
                background: linear-gradient(120deg, var(--lv-accent), var(--lv-accent-2));
                color: #fff;
                box-shadow: 0 6px 18px color-mix(in oklab, var(--lv-accent) 30%, transparent);
            }
            .lv-btn-ghost {
                background: var(--lv-card);
                color: var(--lv-text);
                border-color: var(--lv-line);
            }
            .lv-btn-ghost:hover {
                border-color: var(--lv-accent);
                color: var(--lv-accent);
            }
            .lv-hero-stats {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 12px;
                max-width: 320px;
                margin: 0;
                padding: 0;
            }
            .lv-hero-stats div {
                padding: 14px 16px;
                border: 1px solid var(--lv-line);
                border-radius: 14px;
                background: var(--lv-card);
            }
            .lv-hero-stats dt {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: var(--lv-text-muted);
                margin: 0 0 4px;
            }
            .lv-hero-stats dd {
                margin: 0;
                font-size: clamp(1.4rem, 2.4vw, 1.85rem);
                font-weight: 800;
                color: var(--lv-text);
                font-variant-numeric: tabular-nums;
            }
            .lv-hero-art {
                width: 100%;
                display: flex;
                justify-content: center;
            }
            .lv-hero-svg {
                width: 100%;
                max-width: 560px;
                height: auto;
                filter: drop-shadow(0 16px 40px color-mix(in oklab, var(--lv-accent) 18%, transparent));
            }

            /* ───── SECTION SCAFFOLD ───── */
            .lv-section {
                padding: clamp(56px, 9vw, 112px) 0;
                border-bottom: 1px solid var(--lv-line);
            }
            .lv-section:nth-of-type(odd) { background: var(--lv-bg); }
            .lv-section:nth-of-type(even) { background: var(--lv-bg-2); }
            .lv-section-head {
                margin-bottom: clamp(28px, 4vw, 48px);
            }
            .lv-section-head-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                gap: 16px;
                flex-wrap: wrap;
            }
            .lv-section-eyebrow {
                display: inline-block;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--lv-accent);
                margin-bottom: 12px;
            }
            .lv-section-title {
                margin: 0;
                font-size: clamp(1.6rem, 3.4vw, 2.4rem);
                font-weight: 800;
                letter-spacing: -0.02em;
                line-height: 1.15;
                color: var(--lv-text);
                max-width: 32ch;
            }
            .lv-link-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: none;
                border: none;
                color: var(--lv-accent);
                font: 600 14px/1 inherit;
                cursor: pointer;
                padding: 8px 4px;
            }
            .lv-link-btn:hover { text-decoration: underline; text-underline-offset: 4px; }

            /* ───── PILLARS ───── */
            .lv-pillar-grid {
                display: grid;
                gap: 18px;
                grid-template-columns: 1fr;
            }
            @media (min-width: 720px) {
                .lv-pillar-grid { grid-template-columns: repeat(3, 1fr); }
            }
            .lv-pillar {
                padding: clamp(22px, 3vw, 32px);
                background: var(--lv-card);
                border: 1px solid var(--lv-line);
                border-radius: 18px;
                transition: transform 0.2s ease, border-color 0.2s ease;
            }
            .lv-pillar:hover {
                transform: translateY(-2px);
                border-color: color-mix(in oklab, var(--lv-accent) 40%, var(--lv-line));
            }
            .lv-pillar-icon {
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--lv-accent);
                background: color-mix(in oklab, var(--lv-accent) 12%, transparent);
                border-radius: 12px;
                margin-bottom: 18px;
            }
            .lv-pillar-svg { width: 28px; height: 28px; }
            .lv-pillar h3 {
                margin: 0 0 8px;
                font-size: 1.18rem;
                font-weight: 750;
                color: var(--lv-text);
                letter-spacing: -0.012em;
            }
            .lv-pillar p {
                margin: 0;
                font-size: 0.95rem;
                line-height: 1.6;
                color: var(--lv-text-muted);
            }

            /* ───── CATEGORIES ───── */
            .lv-cat-grid {
                display: grid;
                gap: 12px;
                grid-template-columns: repeat(2, 1fr);
            }
            @media (min-width: 560px) { .lv-cat-grid { grid-template-columns: repeat(3, 1fr); } }
            @media (min-width: 820px) { .lv-cat-grid { grid-template-columns: repeat(4, 1fr); } }
            @media (min-width: 1100px) { .lv-cat-grid { grid-template-columns: repeat(5, 1fr); } }
            .lv-cat-tile {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 14px;
                background: var(--lv-card);
                border: 1px solid var(--lv-line);
                border-radius: 14px;
                cursor: pointer;
                font-family: inherit;
                text-align: left;
                min-width: 0;
                width: 100%;
                box-sizing: border-box;
                overflow: hidden;
                transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
            }
            .lv-cat-tile:hover {
                border-color: currentColor;
                background: color-mix(in oklab, currentColor 6%, var(--lv-card));
            }
            .lv-cat-glyph {
                width: 40px;
                height: 40px;
                flex: 0 0 40px;
            }
            .lv-cat-label {
                font-size: 0.93rem;
                font-weight: 600;
                color: var(--lv-text);
                line-height: 1.25;
                letter-spacing: -0.005em;
                min-width: 0;
                flex: 1 1 auto;
                overflow-wrap: anywhere;
                word-break: break-word;
                hyphens: auto;
            }

            /* ───── SPOTLIGHT ───── */
            .lv-spot-grid {
                display: grid;
                gap: 18px;
                grid-template-columns: 1fr;
            }
            @media (min-width: 640px) { .lv-spot-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (min-width: 1024px) { .lv-spot-grid { grid-template-columns: repeat(4, 1fr); } }
            .lv-spot-card {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                text-align: left;
                padding: 18px;
                background: var(--lv-card);
                border: 1px solid var(--lv-line);
                border-radius: 18px;
                cursor: pointer;
                font-family: inherit;
                transition: transform 0.2s ease, border-color 0.2s ease,
                    box-shadow 0.2s ease;
            }
            .lv-spot-card:hover {
                border-color: color-mix(in oklab, var(--lv-accent) 40%, var(--lv-line));
                box-shadow: var(--lv-shadow);
            }
            .lv-spot-svg {
                width: 100%;
                aspect-ratio: 200 / 120;
                height: auto;
                border-radius: 10px;
                margin-bottom: 14px;
            }
            .lv-spot-card h3 {
                margin: 0 0 6px;
                font-size: 1.08rem;
                font-weight: 730;
                color: var(--lv-text);
                letter-spacing: -0.012em;
            }
            .lv-spot-card p {
                margin: 0 0 14px;
                font-size: 0.9rem;
                line-height: 1.55;
                color: var(--lv-text-muted);
            }
            .lv-spot-cta {
                margin-top: auto;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: var(--lv-accent);
                font-size: 13px;
                font-weight: 700;
            }

            /* ───── FINAL ───── */
            .lv-final-card {
                display: grid;
                gap: clamp(24px, 4vw, 48px);
                grid-template-columns: 1fr;
                align-items: center;
                padding: clamp(28px, 5vw, 56px);
                background: linear-gradient(
                    135deg,
                    color-mix(in oklab, var(--lv-accent) 12%, var(--lv-card)) 0%,
                    color-mix(in oklab, var(--lv-accent-2) 12%, var(--lv-card)) 100%
                );
                border: 1px solid var(--lv-line);
                border-radius: 24px;
                box-shadow: var(--lv-shadow);
            }
            @media (min-width: 820px) {
                .lv-final-card { grid-template-columns: 1.6fr 1fr; }
            }
            .lv-final-copy h2 {
                margin: 0 0 12px;
                font-size: clamp(1.6rem, 3.2vw, 2.2rem);
                font-weight: 800;
                letter-spacing: -0.025em;
                color: var(--lv-text);
            }
            .lv-final-copy p {
                margin: 0 0 22px;
                font-size: 1rem;
                line-height: 1.6;
                color: var(--lv-text-muted);
                max-width: 50ch;
            }
            .lv-final-art {
                width: 100%;
                max-width: 320px;
                height: auto;
                justify-self: center;
            }

            /* ───── MARQUEE ───── */
            .lv-marquee {
                margin-top: clamp(32px, 5vw, 56px);
                overflow: hidden;
                mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
                -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
            }
            .lv-marquee-track {
                display: flex;
                gap: 10px;
                width: max-content;
                animation: lv-scroll 60s linear infinite;
            }
            .lv-marquee-static { animation: none; flex-wrap: wrap; width: 100%; justify-content: center; }
            @keyframes lv-scroll {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
            }
            .lv-chip {
                display: inline-flex;
                align-items: center;
                padding: 8px 14px;
                border-radius: 999px;
                background: var(--lv-card);
                border: 1px solid var(--lv-line);
                color: var(--lv-text);
                font: 600 13px/1 inherit;
                cursor: pointer;
                white-space: nowrap;
                transition: border-color 0.15s ease, color 0.15s ease,
                    transform 0.15s ease;
            }
            .lv-chip:hover {
                color: var(--chip-color, var(--lv-accent));
                border-color: var(--chip-color, var(--lv-accent));
                transform: translateY(-1px);
            }

            @media (prefers-reduced-motion: reduce) {
                .lv-marquee-track { animation: none; }
            }
        `}</style>
    );
}

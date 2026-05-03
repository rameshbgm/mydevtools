"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import type { ToolCategory } from "@/lib/tools-registry";

/** Left column: browser stays local vs risky “paste anywhere”. */
export function PremiseDiagramSvg({ dark }: { dark: boolean }) {
    const frame = dark ? "#262626" : "#e5e5e5";
    const panel = dark ? "#141414" : "#fafafa";
    const text = dark ? "#fafafa" : "#171717";
    const mute = dark ? "#737373" : "#9ca3af";
    const bad = "#f87171";
    const ok = "#34d399";
    return (
        <svg viewBox="0 0 420 380" xmlns="http://www.w3.org/2000/svg" aria-hidden className="w-full max-w-md mx-auto">
            <defs>
                <linearGradient id="premiseGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={dark ? "0.35" : "0.2"} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={dark ? "0.2" : "0.15"} />
                </linearGradient>
            </defs>
            <motion.rect
                x={24}
                y={56}
                width={170}
                height={200}
                rx={14}
                fill={panel}
                stroke={bad}
                strokeWidth={2}
                strokeDasharray="6 6"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
            />
            <motion.path
                d="M70 118 L148 218 M148 118 L70 218"
                stroke={bad}
                strokeWidth={3}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
            />
            <text x={109} y={44} textAnchor="middle" fill={mute} fontSize={11} fontFamily="monospace">
                Paste into random tabs
            </text>
            <rect x={48} y={88} width={122} height={10} rx={3} fill={mute} opacity={0.25} />
            <rect x={48} y={108} width={92} height={10} rx={3} fill={mute} opacity={0.18} />
            <rect x={48} y={128} width={110} height={10} rx={3} fill={mute} opacity={0.15} />

            <motion.rect
                x={226}
                y={40}
                width={170}
                height={240}
                rx={16}
                fill={panel}
                stroke={frame}
                strokeWidth={1.5}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
            />
            <motion.rect
                x={238}
                y={54}
                width={146}
                height={18}
                rx={6}
                fill="url(#premiseGlow)"
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: 146 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
            />
            <motion.path
                d="M263 146 L349 146 M263 174 L319 174 M263 202 L337 202"
                stroke={mute}
                strokeWidth={6}
                strokeLinecap="round"
                opacity={0.35}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.45 }}
            />
            <motion.g
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.5 }}
            >
                <circle cx={311} cy={260} r={36} fill={dark ? "#111827" : "#ecfdf5"} stroke={ok} strokeWidth={2} />
                <path
                    d="M295 260 L305 272 L330 244"
                    fill="none"
                    stroke={ok}
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </motion.g>
            <text x={311} y={322} textAnchor="middle" fill={text} fontSize={12} fontWeight={600} fontFamily="system-ui">
                Stays in your browser
            </text>
            <text x={311} y={342} textAnchor="middle" fill={mute} fontSize={10} fontFamily="system-ui">
                No upload hop · No outbound call
            </text>
        </svg>
    );
}

/** Animated: static bundles ship to the browser; work stays inside the tab (no SaaS straw). */
function LocalFirstArcDiagramSvg({ dark }: { dark: boolean }) {
    const uid = useId().replace(/:/g, "");
    const markerId = `la-${uid}`;
    const stroke = dark ? "#525252" : "#cbd5e1";
    const accent = "#818cf8";
    const ram = "#10b981";
    const cloudBlock = "#f8717188";
    return (
        <svg viewBox="0 0 320 120" className="w-full max-h-[100px]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
                <marker id={markerId} markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                    <path d="M0 0 L6 3 L0 6 Z" fill={accent} />
                </marker>
            </defs>
            {/* NPM / bundle → edge */}
            <rect x={8} y={38} width={52} height={44} rx={8} fill={dark ? "#1f1f23" : "#f1f5f9"} stroke={stroke} strokeWidth={1.2} />
            <path d="M18 54h22M18 62h28M18 70h14" stroke={accent} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
            <text x={34} y={32} textAnchor="middle" fill={stroke} fontSize={9} fontFamily="monospace">
                Bundled JS
            </text>
            <motion.path
                d="M60 62 H88"
                stroke={accent}
                strokeWidth={2}
                fill="none"
                markerEnd={`url(#${markerId})`}
                initial={{ pathLength: 0, opacity: 0.4 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.85, ease: "easeOut" }}
            />
            {/* Browser window */}
            <rect x={92} y={28} width={136} height={72} rx={10} fill={dark ? "#12121a" : "#ffffff"} stroke={accent} strokeWidth={1.5} opacity={0.95} />
            <rect x={92} y={28} width={136} height={16} rx={10} fill={dark ? "#252530" : "#e8e9ef"} opacity={dark ? 1 : 0.9} />
            <circle cx={104} cy={36} r={4} fill="#f97373" opacity={0.9} />
            <circle cx={118} cy={36} r={4} fill="#eab308" opacity={0.75} />
            <circle cx={132} cy={36} r={4} fill="#34d399" opacity={0.8} />
            <rect x={102} y={52} width={116} height={6} rx={2} fill={stroke} opacity={0.2} />
            <rect x={102} y={64} width={88} height={6} rx={2} fill={stroke} opacity={0.15} />
            <rect x={102} y={76} width={100} height={6} rx={2} fill={stroke} opacity={0.12} />
            <text x={160} y={102} textAnchor="middle" fill={accent} fontSize={9} fontFamily="system-ui" fontWeight={600}>
                Runs in-memory in this tab
            </text>
            {/* Pulses inside tab */}
            <motion.circle
                cx={150}
                cy={66}
                r={4}
                fill={ram}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.35, 1, 0.35], scale: [0.92, 1.15, 0.92] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
                cx={170}
                cy={58}
                r={3}
                fill={accent}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.25, 0.95, 0.25] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
            />
            {/* Broken path to cloud (blocked egress) */}
            <path d="M232 62 H284" stroke={cloudBlock} strokeWidth={2} strokeDasharray="4 6" />
            <path d="M258 54 L274 74 M274 54 L258 74" stroke={cloudBlock} strokeWidth={2.2} strokeLinecap="round" />
            <rect x={270} y={44} width={42} height={36} rx={8} fill="none" stroke={cloudBlock} strokeWidth={1.2} strokeDasharray="3 5" opacity={0.7} />
            <text x={291} y={98} textAnchor="middle" fill={cloudBlock} fontSize={8} fontFamily="system-ui">
                No pipeline
            </text>
            {/* RAM chip accent */}
            <motion.g animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2.4, repeat: Infinity }}>
                <rect x={198} y={78} width={28} height={18} rx={3} fill="none" stroke={ram} strokeWidth={1.3} opacity={0.9} />
                <text x={212} y={90} textAnchor="middle" fill={ram} fontSize={7} fontFamily="monospace" fontWeight={700}>
                    RAM
                </text>
            </motion.g>
        </svg>
    );
}

/** Right column: short privacy story with motion. */
export function LocalFirstPulsePanel({ dark }: { dark: boolean }) {
    const border = dark ? "rgba(99,102,241,0.35)" : "rgba(79,70,229,0.25)";
    const bg = dark ? "rgba(99,102,241,0.06)" : "rgba(79,70,229,0.05)";
    const lines = [
        { title: "Input", sub: "Only you see the paste buffer" },
        { title: "Compute", sub: "WASM & JS runs in-memory" },
        { title: "Output", sub: "Results never round-trip to our infra" },
    ];
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            style={{
                position: "relative",
                borderRadius: 18,
                border: `1px solid ${border}`,
                background: bg,
                padding: "14px 16px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: 12,
                overflow: "hidden",
            }}
        >
            <motion.div
                aria-hidden
                style={{
                    position: "absolute",
                    inset: "-25% -20%",
                    background: "radial-gradient(circle at 55% 0%, rgba(99,102,241,0.12), transparent 50%)",
                }}
                animate={{ rotate: [0, 6, 0], scale: [1, 1.02, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <div style={{ position: "relative", zIndex: 1, marginBottom: 2 }}>
                <LocalFirstArcDiagramSvg dark={dark} />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
                <div
                    style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: dark ? "#818cf8" : "#4f46e5",
                        marginBottom: 6,
                    }}
                >
                    Local-first arc
                </div>
                <p
                    style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.55,
                        fontWeight: 600,
                        color: dark ? "#f5f5f5" : "#0f172a",
                    }}
                >
                    Every formatter, decoder, and cert helper is a static artifact. Your payload touches RAM in this tab: not a third-party ingestion pipeline.
                </p>
            </div>
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                {lines.map(({ title, sub }, i) => (
                    <motion.div
                        key={title}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.12 * i }}
                        style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: dark ? "rgba(10,10,10,0.55)" : "rgba(255,255,255,0.8)",
                            border: `1px solid ${dark ? "#262626" : "#e5e7eb"}`,
                        }}
                    >
                        <motion.span
                            aria-hidden
                            style={{
                                width: 10,
                                height: 10,
                                marginTop: 4,
                                borderRadius: "50%",
                                background: "#10b981",
                                flexShrink: 0,
                            }}
                            animate={{ scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }}
                            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.25 }}
                        />
                        <span>
                            <span style={{ display: "block", fontWeight: 700, fontSize: 13, color: dark ? "#fafafa" : "#0a0a0a" }}>
                                {title}
                            </span>
                            <span style={{ fontSize: 12.5, color: dark ? "#a3a3a3" : "#525252", lineHeight: 1.45 }}>{sub}</span>
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

function IconRoot({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <g stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                {children}
            </g>
        </svg>
    );
}

export function SvgCategoryGlyph({ category, color }: { category: ToolCategory; color: string }) {
    switch (category) {
        case "Formatters":
            return (
                <IconRoot color={color}>
                    <path d="M7 8h10M7 12h7M7 16h10" />
                    <rect x={4} y={4} width={16} height={16} rx={2} />
                </IconRoot>
            );
        case "Validators":
            return (
                <IconRoot color={color}>
                    <path d="M9 12l2 2 4-4" />
                    <circle cx={12} cy={12} r={8} />
                </IconRoot>
            );
        case "Diff & Compare":
            return (
                <IconRoot color={color}>
                    <path d="M8 17V7M8 7L5 10M8 7l3 3" />
                    <path d="M16 7v10m0 0l3-3m-3 3l-3-3" />
                </IconRoot>
            );
        case "Data Converters":
            return (
                <IconRoot color={color}>
                    <path d="M7 7h6v6H7zM11 11h6v6h-6z" />
                    <path d="M10 13h2v2h-2" />
                </IconRoot>
            );
        case "Encoding & Decoding":
            return (
                <IconRoot color={color}>
                    <rect x={5} y={5} width={14} height={14} rx={2} />
                    <path d="M9 15V9l6 6V9" />
                </IconRoot>
            );
        case "Cryptography":
            return (
                <IconRoot color={color}>
                    <path d="M10 11V9a4 4 0 018 0v2" />
                    <rect x={8} y={11} width={8} height={8} rx={2} />
                    <path d="M12 14v2" strokeWidth={2} />
                </IconRoot>
            );
        case "Certificates & Keys":
            return (
                <IconRoot color={color}>
                    <rect x={6} y={9} width={12} height={11} rx={2} />
                    <path d="M9 9V7a3 3 0 016 0v2M12 13v4" />
                </IconRoot>
            );
        case "API & Web Services":
            return (
                <IconRoot color={color}>
                    <path d="M4 17h16M4 12h10M4 7h13" />
                    <circle cx={18} cy={7} r={2} />
                </IconRoot>
            );
        case "Network":
            return (
                <IconRoot color={color}>
                    <path d="M5 12h3l2-4 4 8 2-4h3" />
                    <path d="M3 19h18" />
                </IconRoot>
            );
        case "Generators":
            return (
                <IconRoot color={color}>
                    <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />
                </IconRoot>
            );
        case "Text & Utilities":
            return (
                <IconRoot color={color}>
                    <path d="M4 20l4-16M12 20l4-16M6 12h8" />
                </IconRoot>
            );
        case "AI Alpha Tools":
            return (
                <IconRoot color={color}>
                    <rect x={5} y={7} width={14} height={12} rx={2} />
                    <path d="M9 7V5h6v2M12 11v3" />
                    <circle cx={10} cy={15} r={0.9} fill={color} stroke="none" />
                    <circle cx={14} cy={15} r={0.9} fill={color} stroke="none" />
                </IconRoot>
            );
        case "Reference":
            return (
                <IconRoot color={color}>
                    <path d="M6 4h5a3 3 0 013 3v14a2 2 0 00-2-2H6V4zM18 4h-3v16h3a2 2 0 002-2V7a3 3 0 00-3-3z" />
                </IconRoot>
            );
        default:
            return (
                <IconRoot color={color}>
                    <circle cx={12} cy={12} r={7} />
                </IconRoot>
            );
    }
}

/** Small hero accent: shield + tab outline. */
/** 20×20 accents for the live stat tiles. */
export function LandingStatIcon({
    kind,
    color,
}: {
    kind: "tools" | "categories" | "trackers" | "client";
    color: string;
}) {
    const w = 22;
    const h = 22;
    const common = { width: w, height: h, viewBox: "0 0 24 24", fill: "none" as const };
    switch (kind) {
        case "tools":
            return (
                <svg {...common} xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path
                        d="M4 19V5a1 1 0 011-1h5l2 2h7a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1z"
                        stroke={color}
                        strokeWidth={1.65}
                        strokeLinejoin="round"
                    />
                    <path d="M8 12h8M8 16h5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
                </svg>
            );
        case "categories":
            return (
                <svg {...common} xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x={4} y={4} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.5} />
                    <rect x={13} y={4} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.5} />
                    <rect x={4} y={13} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.5} />
                    <rect x={13} y={13} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.5} />
                </svg>
            );
        case "trackers":
            return (
                <svg {...common} xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <circle cx={12} cy={12} r={8} stroke={color} strokeWidth={1.5} />
                    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 6l3-2M6 18l3-2" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.35} />
                </svg>
            );
        case "client":
            return (
                <svg {...common} xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x={4} y={5} width={16} height={12} rx={2} stroke={color} strokeWidth={1.5} />
                    <path d="M8 21h8M12 17v4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
                    <circle cx={17} cy={9} r={2.5} stroke={color} strokeWidth={1.2} />
                </svg>
            );
    }
}

/** Marquee / band decoration. */
export function CatalogRibbonSvg({ color }: { color: string }) {
    return (
        <svg width={120} height={14} viewBox="0 0 120 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M0 7h40M80 7h40M45 7h5M70 7h5" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
            <circle cx={60} cy={7} r={3} stroke={color} strokeWidth={1.2} />
            <path d="M58.5 7l1.8 1.6L63 5.2" stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function HeroTrustGlyph({ color }: { color: string }) {
    return (
        <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x={8} y={10} width={32} height={28} rx={5} stroke={color} strokeWidth={1.5} opacity={0.45} />
            <path d="M24 6v36" stroke={color} strokeWidth={1} strokeDasharray="2 4" opacity={0.25} />
            <path
                d="M24 34c-6-4-10-10-10-16V14l10-6 10 6v4c0 6-4 12-10 16z"
                stroke={color}
                strokeWidth={1.75}
                fill="none"
            />
            <path d="M19 29l3 3 7-10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

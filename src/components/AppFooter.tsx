"use client";

import React from "react";
import { Typography, Tooltip } from "antd";
import { GithubOutlined, LinkedinFilled, HeartFilled, ThunderboltFilled } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { toolsRegistry } from "@/lib/tools-registry";

const { Text } = Typography;

export default function AppFooter() {
    const { darkMode } = useAppStore();
    const year = new Date().getFullYear();

    return (
        <footer
            style={{
                position: "relative",
                marginTop: 48,
                padding: "32px 24px 28px",
                borderTop: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                background: darkMode
                    ? "linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.04) 100%)"
                    : "linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.03) 100%)",
                overflow: "hidden",
            }}
        >
            {/* Subtle background gradient orb */}
            <motion.div
                aria-hidden
                animate={{
                    x: [0, 24, 0],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    top: "-50%",
                    left: "20%",
                    width: 400,
                    height: 200,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    position: "relative",
                    zIndex: 1,
                    textAlign: "center",
                }}
            >
                {/* Tagline pill */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        borderRadius: 24,
                        background: darkMode
                            ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.10))"
                            : "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))",
                        border: `1px solid ${darkMode ? "rgba(139,92,246,0.25)" : "rgba(99,102,241,0.18)"}`,
                    }}
                >
                    <ThunderboltFilled style={{ color: "#8b5cf6", fontSize: 13 }} />
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: 0.4,
                            color: darkMode ? "#c4b5fd" : "#7c3aed",
                            textTransform: "uppercase",
                        }}
                    >
                        One stop for all developer tools
                    </Text>
                </motion.div>

                {/* Made with love */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexWrap: "wrap",
                        justifyContent: "center",
                        fontSize: 14,
                    }}
                >
                    <Text style={{ color: darkMode ? "#a3a3a3" : "#525252" }}>Made with</Text>
                    <motion.span
                        animate={{ scale: [1, 1.25, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ display: "inline-flex" }}
                    >
                        <HeartFilled style={{ color: "#ec4899", fontSize: 16 }} />
                    </motion.span>
                    <Text style={{ color: darkMode ? "#a3a3a3" : "#525252" }}>by</Text>
                    <a
                        href="https://www.linkedin.com/in/rameshbgm/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontWeight: 600,
                            background: "var(--gradient-brand)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            color: "transparent",
                            textDecoration: "none",
                        }}
                    >
                        Ramesh Maharaddi
                    </a>
                </div>

                {/* Social links */}
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Tooltip title="LinkedIn">
                        <motion.a
                            href="https://www.linkedin.com/in/rameshbgm/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3, scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="LinkedIn profile"
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: darkMode
                                    ? "rgba(10, 102, 194, 0.15)"
                                    : "rgba(10, 102, 194, 0.08)",
                                border: `1px solid ${darkMode ? "rgba(10, 102, 194, 0.3)" : "rgba(10, 102, 194, 0.18)"}`,
                                color: "#0a66c2",
                                textDecoration: "none",
                            }}
                        >
                            <LinkedinFilled style={{ fontSize: 18 }} />
                        </motion.a>
                    </Tooltip>

                    <Tooltip title="GitHub">
                        <motion.a
                            href="https://github.com/rameshbgm"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3, scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="GitHub profile"
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: darkMode
                                    ? "rgba(255, 255, 255, 0.06)"
                                    : "rgba(0, 0, 0, 0.04)",
                                border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.10)"}`,
                                color: darkMode ? "#e5e5e5" : "#171717",
                                textDecoration: "none",
                            }}
                        >
                            <GithubOutlined style={{ fontSize: 18 }} />
                        </motion.a>
                    </Tooltip>
                </div>

                {/* Stat strip */}
                <div
                    style={{
                        display: "flex",
                        gap: 18,
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 4,
                        opacity: 0.7,
                    }}
                >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        © {year} DevTools Hub
                    </Text>
                    <span
                        style={{
                            display: "inline-block",
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: darkMode ? "#404040" : "#d4d4d4",
                        }}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {toolsRegistry.length} tools
                    </Text>
                    <span
                        style={{
                            display: "inline-block",
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: darkMode ? "#404040" : "#d4d4d4",
                        }}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        100% client-side · no data leaves your browser
                    </Text>
                </div>
            </div>
        </footer>
    );
}

"use client";

import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button, Tag, Typography, Space } from "antd";
import {
    HomeOutlined,
    SearchOutlined,
    CompassOutlined,
    ThunderboltOutlined,
    ApiOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { toolsRegistry } from "@/lib/tools-registry";
import { useAppStore } from "@/lib/store";

const { Title, Text, Paragraph } = Typography;

function levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let prev = dp[0];
        dp[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const tmp = dp[j];
            dp[j] = a[i - 1] === b[j - 1]
                ? prev
                : 1 + Math.min(prev, dp[j], dp[j - 1]);
            prev = tmp;
        }
    }
    return dp[b.length];
}

export default function NotFound() {
    const router = useRouter();
    const pathname = usePathname();
    const { darkMode } = useAppStore();

    const requestedSlug = useMemo(() => {
        const m = pathname?.match(/^\/tools\/([^/]+)/);
        return m?.[1] ?? "";
    }, [pathname]);

    const suggestions = useMemo(() => {
        if (!requestedSlug) {
            // No tool slug — surface a few popular tools
            return toolsRegistry
                .filter((t) =>
                    ["json-formatter", "jwt-decoder", "uuid-generator", "regex-tester"].includes(t.id)
                )
                .slice(0, 4);
        }
        const target = requestedSlug.toLowerCase().replace(/-/g, "");
        const scored = toolsRegistry.map((t) => {
            const id = t.id.toLowerCase().replace(/-/g, "");
            const name = t.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const idDist = levenshtein(target, id);
            const nameDist = levenshtein(target, name);
            const tagBonus = t.tags.some((tag) => target.includes(tag.toLowerCase().replace(/[^a-z0-9]/g, ""))) ? -3 : 0;
            return { tool: t, score: Math.min(idDist, nameDist) + tagBonus };
        });
        scored.sort((a, b) => a.score - b.score);
        return scored.slice(0, 4).map((s) => s.tool);
    }, [requestedSlug]);

    return (
        <div
            style={{
                minHeight: "calc(100vh - 60px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Floating gradient blobs */}
            <motion.div
                aria-hidden
                animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "10%",
                    width: 320,
                    height: 320,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                }}
            />
            <motion.div
                aria-hidden
                animate={{
                    x: [0, -40, 0],
                    y: [0, 30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    bottom: "10%",
                    right: "10%",
                    width: 360,
                    height: 360,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(168,85,247,0.22), transparent 70%)",
                    filter: "blur(50px)",
                    pointerEvents: "none",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    maxWidth: 640,
                    width: "100%",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Animated 404 */}
                <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    style={{ position: "relative", marginBottom: 8 }}
                >
                    <Title
                        className="gradient-text"
                        style={{
                            fontSize: "clamp(96px, 22vw, 200px)",
                            fontWeight: 900,
                            margin: 0,
                            letterSpacing: "-6px",
                            lineHeight: 1,
                        }}
                    >
                        404
                    </Title>
                    {/* Glitch overlay */}
                    <motion.div
                        aria-hidden
                        animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "clamp(96px, 22vw, 200px)",
                            fontWeight: 900,
                            color: "#ec4899",
                            mixBlendMode: "screen",
                            transform: "translateX(4px)",
                            pointerEvents: "none",
                        }}
                    >
                        404
                    </motion.div>
                </motion.div>

                {/* Floating compass badge */}
                <motion.div
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 14px",
                        borderRadius: 24,
                        background: darkMode
                            ? "rgba(139,92,246,0.18)"
                            : "rgba(139,92,246,0.10)",
                        border: `1px solid ${darkMode ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.25)"}`,
                        marginBottom: 18,
                    }}
                >
                    <CompassOutlined style={{ color: "#8b5cf6", fontSize: 14 }} />
                    <Text style={{ color: darkMode ? "#c4b5fd" : "#7c3aed", fontSize: 12, fontWeight: 600, letterSpacing: 0.4 }}>
                        OFF THE MAP
                    </Text>
                </motion.div>

                <Title
                    level={2}
                    style={{
                        margin: "0 0 12px",
                        fontWeight: 700,
                        letterSpacing: "-0.5px",
                        fontSize: "clamp(20px, 3.5vw, 28px)",
                    }}
                >
                    {requestedSlug
                        ? "That tool doesn't exist (yet)"
                        : "We can't find that page"}
                </Title>

                <Paragraph
                    style={{
                        color: darkMode ? "#a3a3a3" : "#525252",
                        fontSize: "clamp(13px, 1.5vw, 15px)",
                        maxWidth: 480,
                        margin: "0 auto 8px",
                        lineHeight: 1.6,
                    }}
                >
                    {requestedSlug ? (
                        <>
                            We searched our toolbox of {toolsRegistry.length} utilities and couldn't find{" "}
                            <code
                                style={{
                                    background: darkMode ? "#1f1f1f" : "#f5f5f5",
                                    padding: "2px 8px",
                                    borderRadius: 6,
                                    fontSize: "0.9em",
                                    color: darkMode ? "#f59e0b" : "#dc2626",
                                }}
                            >
                                {requestedSlug}
                            </code>
                            . Maybe one of these does the trick?
                        </>
                    ) : (
                        <>
                            The path <code style={{ background: darkMode ? "#1f1f1f" : "#f5f5f5", padding: "2px 8px", borderRadius: 6, fontSize: "0.9em" }}>{pathname}</code>{" "}
                            isn't part of mydevtools.
                        </>
                    )}
                </Paragraph>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        style={{ marginTop: 28, marginBottom: 32 }}
                    >
                        <Text
                            style={{
                                display: "block",
                                marginBottom: 14,
                                color: darkMode ? "#737373" : "#737373",
                                fontSize: 12,
                                letterSpacing: 0.6,
                                textTransform: "uppercase",
                                fontWeight: 600,
                            }}
                        >
                            {requestedSlug ? "Did you mean…" : "Popular tools"}
                        </Text>
                        <Space wrap size={[10, 10]} style={{ justifyContent: "center", display: "flex" }}>
                            {suggestions.map((tool) => {
                                const ToolIcon = tool.icon;
                                return (
                                    <motion.div
                                        key={tool.id}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <Tag
                                            onClick={() => router.push(`/tools/${tool.id}`)}
                                            style={{
                                                cursor: "pointer",
                                                padding: "8px 14px",
                                                borderRadius: 12,
                                                fontSize: 13,
                                                fontWeight: 500,
                                                background: `${tool.color}1a`,
                                                border: `1px solid ${tool.color}55`,
                                                color: tool.color,
                                                margin: 0,
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 6,
                                            }}
                                        >
                                            <ToolIcon style={{ fontSize: 14 }} />
                                            {tool.name}
                                        </Tag>
                                    </motion.div>
                                );
                            })}
                        </Space>
                    </motion.div>
                )}

                {/* CTAs */}
                <Space size={12} wrap style={{ justifyContent: "center", display: "flex" }}>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<HomeOutlined />}
                            onClick={() => router.push("/")}
                            style={{
                                height: 46,
                                paddingLeft: 22,
                                paddingRight: 22,
                                borderRadius: 12,
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                border: "none",
                                boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                            }}
                        >
                            Back to Dashboard
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            size="large"
                            icon={<SearchOutlined />}
                            onClick={() => router.push("/")}
                            style={{
                                height: 46,
                                paddingLeft: 22,
                                paddingRight: 22,
                                borderRadius: 12,
                                fontWeight: 500,
                            }}
                        >
                            Search all tools
                        </Button>
                    </motion.div>
                </Space>

                {/* Stat strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        marginTop: 40,
                        display: "flex",
                        gap: 24,
                        justifyContent: "center",
                        flexWrap: "wrap",
                        opacity: 0.7,
                    }}
                >
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                        <ThunderboltOutlined style={{ color: "#8b5cf6" }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {toolsRegistry.length} tools
                        </Text>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                        <ApiOutlined style={{ color: "#6366f1" }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            13 categories
                        </Text>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                        <CompassOutlined style={{ color: "#ec4899" }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            HTTP {pathname || "404"}
                        </Text>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

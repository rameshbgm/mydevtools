"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    Input,
    Tag,
    Typography,
    Row,
    Col,
    Space,
    Badge,
    Empty,
} from "antd";
import { SearchOutlined, ThunderboltOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import {
    toolsRegistry,
    getToolsByCategory,
    CATEGORY_COLORS,
    CATEGORY_ICONS,
} from "@/lib/tools-registry";
import { useAppStore } from "@/lib/store";

const { Title, Text, Paragraph } = Typography;

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4 }
    },
};

const fadeIn = {
    hidden: { opacity: 0, y: -16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Dashboard() {
    const router = useRouter();
    const { darkMode, recentTools, addRecentTool } = useAppStore();
    const [search, setSearch] = useState("");

    const filtered = search
        ? toolsRegistry.filter(
            (t) =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.description.toLowerCase().includes(search.toLowerCase()) ||
                t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
        )
        : toolsRegistry;

    const categorized = getToolsByCategory();

    const handleToolClick = (id: string) => {
        addRecentTool(id);
        router.push(`/tools/${id}`);
    };

    const stats = {
        total: toolsRegistry.length,
        categories: new Set(toolsRegistry.map(t => t.category)).size,
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
                {/* Badge */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 18px",
                        borderRadius: 24,
                        background: darkMode
                            ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))"
                            : "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
                        border: `1px solid ${darkMode ? "rgba(139,92,246,0.3)" : "rgba(99,102,241,0.2)"}`,
                        marginBottom: 20,
                    }}
                >
                    <ThunderboltOutlined style={{ color: "#8b5cf6", fontSize: 16 }} />
                    <Text style={{
                        color: darkMode ? "#c4b5fd" : "#7c3aed",
                        fontSize: 13,
                        fontWeight: 500,
                        letterSpacing: "0.3px"
                    }}>
                        {stats.total} tools across {stats.categories} categories
                    </Text>
                </motion.div>

                {/* Title */}
                <Title
                    level={1}
                    style={{
                        background: darkMode
                            ? "linear-gradient(135deg, #818cf8, #a78bfa, #c4b5fd)"
                            : "linear-gradient(135deg, #4f46e5, #7c3aed, #8b5cf6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "clamp(32px, 5vw, 52px)",
                        fontWeight: 800,
                        marginBottom: 12,
                        letterSpacing: "-1px",
                    }}
                >
                    DevTools Hub
                </Title>

                {/* Subtitle */}
                <Paragraph
                    style={{
                        fontSize: 18,
                        color: darkMode ? "#a3a3a3" : "#525252",
                        maxWidth: 600,
                        margin: "0 auto 32px",
                        lineHeight: 1.6,
                    }}
                >
                    Your personal developer toolkit. Format, diff, decode, generate —
                    all in one beautiful, private workspace.
                </Paragraph>

                {/* Search */}
                <motion.div
                    whileFocus={{ scale: 1.01 }}
                    style={{ maxWidth: 520, margin: "0 auto" }}
                >
                    <Input
                        size="large"
                        placeholder="Search tools by name, description, or tag..."
                        prefix={<SearchOutlined style={{ color: darkMode ? "#737373" : "#a3a3a3", fontSize: 18 }} />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            borderRadius: 14,
                            height: 52,
                            fontSize: 15,
                            boxShadow: darkMode
                                ? "0 4px 20px rgba(0,0,0,0.3)"
                                : "0 4px 20px rgba(0,0,0,0.08)",
                        }}
                        allowClear
                    />
                </motion.div>
            </motion.div>

            {/* Recent Tools */}
            <AnimatePresence>
                {recentTools.length > 0 && !search && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ marginBottom: 48 }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 16
                        }}>
                            <ClockCircleOutlined style={{
                                color: darkMode ? "#737373" : "#a3a3a3",
                                fontSize: 16
                            }} />
                            <Title level={5} style={{
                                margin: 0,
                                color: darkMode ? "#737373" : "#525252",
                                fontWeight: 500,
                            }}>
                                Recently Used
                            </Title>
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

            {/* Tool Grid */}
            {search ? (
                filtered.length > 0 ? (
                    <motion.div variants={container} initial="hidden" animate="show">
                        <Row gutter={[20, 20]}>
                            {filtered.map((tool) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={tool.id}>
                                    <ToolCard tool={tool} darkMode={darkMode} onClick={() => handleToolClick(tool.id)} />
                                </Col>
                            ))}
                        </Row>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: "center", padding: "60px 0" }}
                    >
                        <Empty
                            description={
                                <Text style={{ color: darkMode ? "#737373" : "#a3a3a3" }}>
                                    No tools found for &ldquo;{search}&rdquo;
                                </Text>
                            }
                        />
                    </motion.div>
                )
            ) : (
                Array.from(categorized.entries()).map(([category, tools]) => {
                    const CategoryIcon = CATEGORY_ICONS[category];
                    const categoryColor = CATEGORY_COLORS[category];

                    return (
                        <motion.div
                            key={category}
                            style={{ marginBottom: 48 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Category Header */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                marginBottom: 20
                            }}>
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        background: `${categoryColor}15`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CategoryIcon style={{
                                        fontSize: 18,
                                        color: categoryColor
                                    }} />
                                </div>
                                <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
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
                            </div>

                            {/* Tools Grid */}
                            <motion.div variants={container} initial="hidden" animate="show">
                                <Row gutter={[20, 20]}>
                                    {tools.map((tool) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={tool.id}>
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
                })
            )}
        </div>
    );
}

interface ToolCardProps {
    tool: (typeof toolsRegistry)[0];
    darkMode: boolean;
    onClick: () => void;
}

function ToolCard({ tool, darkMode, onClick }: Readonly<ToolCardProps>) {
    return (
        <motion.div
            variants={item}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
        >
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
                }}
                styles={{
                    body: { padding: 20 }
                }}
            >
                {/* Icon */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: `${tool.color}15`,
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

                {/* Content */}
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

                {/* Tags preview */}
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

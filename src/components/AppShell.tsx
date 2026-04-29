"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
    Layout,
    Menu,
    theme,
    ConfigProvider,
    Button,
    Typography,
    Tooltip,
    App,
} from "antd";
import { setMessageInstance } from "@/lib/messageService";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    SunOutlined,
    MoonOutlined,
    CodeOutlined,
    DownOutlined,
    UpOutlined,
} from "@ant-design/icons";
import { getToolsByCategory, CATEGORY_ICONS, CATEGORY_COLORS, toolsRegistry } from "@/lib/tools-registry";
import type { ToolCategory } from "@/lib/tools-registry";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

function MessageBridge() {
    const { message } = App.useApp();
    useEffect(() => { setMessageInstance(message); }, [message]);
    return null;
}

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const pathname = usePathname();
    const { darkMode, toggleDarkMode, sidebarCollapsed, toggleSidebar } =
        useAppStore();
    const activeCategory = useMemo(() => {
        const match = pathname.match(/^\/tools\/([^/]+)/);
        if (!match) return null;
        return toolsRegistry.find((t) => t.id === match[1])?.category ?? null;
    }, [pathname]);

    const [openKeys, setOpenKeys] = useState<string[]>(activeCategory ? [activeCategory] : []);
    const [lastCategory, setLastCategory] = useState<string | null>(activeCategory);

    if (activeCategory !== lastCategory) {
        setLastCategory(activeCategory);
        if (activeCategory && !openKeys.includes(activeCategory)) {
            setOpenKeys([...openKeys, activeCategory]);
        }
    }

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", darkMode);
        root.style.colorScheme = darkMode ? "dark" : "light";
    }, [darkMode]);

    const categorized = useMemo(() => getToolsByCategory(), []);
    const categoryKeys = useMemo(() => Array.from(categorized.keys()), [categorized]);

    const expandAll = () => setOpenKeys(categoryKeys);
    const collapseAll = () => setOpenKeys([]);

    const menuItems = useMemo(() => [
        {
            key: "/",
            icon: <HomeOutlined style={{ fontSize: 16 }} />,
            label: <span style={{ fontWeight: 500 }}>Dashboard</span>,
        },
        ...Array.from(categorized.entries()).map(([category, tools]) => {
            const CategoryIcon = CATEGORY_ICONS[category as ToolCategory];
            const categoryColor = CATEGORY_COLORS[category as ToolCategory];
            return {
                key: category,
                icon: <CategoryIcon style={{ fontSize: 16, color: categoryColor }} />,
                label: <span style={{ fontWeight: 500 }}>{category}</span>,
                children: tools.map((t) => ({
                    key: `/tools/${t.id}`,
                    icon: React.createElement(t.icon, {
                        style: { fontSize: 14, color: t.color }
                    }),
                    label: <span style={{ fontSize: 13 }}>{t.name}</span>,
                })),
            };
        }),
    ], [categorized]);

    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: "#6366f1",
            colorBgContainer: "#141414",
            colorBgLayout: "#0a0a0a",
            colorBgElevated: "#1f1f1f",
            colorBorder: "#303030",
            colorBorderSecondary: "#262626",
            borderRadius: 10,
            fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: 14,
            colorText: "#e5e5e5",
            colorTextSecondary: "#a3a3a3",
            colorTextTertiary: "#737373",
        },
        components: {
            Menu: {
                itemBg: "transparent",
                subMenuItemBg: "transparent",
                itemSelectedBg: "rgba(99, 102, 241, 0.15)",
                itemHoverBg: "rgba(99, 102, 241, 0.08)",
                itemSelectedColor: "#a78bfa",
                itemColor: "#a3a3a3",
                groupTitleColor: "#737373",
            },
            Card: {
                colorBgContainer: "#1a1a1a",
                colorBorder: "#262626",
            },
            Button: {
                borderRadius: 8,
            },
            Input: {
                borderRadius: 8,
                colorBgContainer: "#1a1a1a",
            },
            Select: {
                borderRadius: 8,
                colorBgContainer: "#1a1a1a",
            },
            Table: {
                colorBgContainer: "#141414",
                headerBg: "#1a1a1a",
            },
            Modal: {
                contentBg: "#1a1a1a",
                headerBg: "#1a1a1a",
            },
        },
    };

    const lightTheme = {
        algorithm: theme.defaultAlgorithm,
        token: {
            colorPrimary: "#4f46e5",
            colorBgContainer: "#ffffff",
            colorBgLayout: "#fafafa",
            colorBgElevated: "#ffffff",
            colorBorder: "#e5e5e5",
            colorBorderSecondary: "#f0f0f0",
            borderRadius: 10,
            fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: 14,
            colorText: "#171717",
            colorTextSecondary: "#525252",
            colorTextTertiary: "#737373",
        },
        components: {
            Menu: {
                itemBg: "transparent",
                subMenuItemBg: "transparent",
                itemSelectedBg: "rgba(79, 70, 229, 0.08)",
                itemHoverBg: "rgba(79, 70, 229, 0.04)",
                itemSelectedColor: "#4f46e5",
                itemColor: "#525252",
                groupTitleColor: "#737373",
            },
            Card: {
                colorBgContainer: "#ffffff",
                colorBorder: "#e5e5e5",
            },
            Button: {
                borderRadius: 8,
            },
            Input: {
                borderRadius: 8,
            },
            Select: {
                borderRadius: 8,
            },
            Table: {
                headerBg: "#fafafa",
            },
        },
    };

    return (
        <ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
            <App>
                <MessageBridge />
                <Layout style={{ minHeight: "100vh" }}>
                    <Sider
                        collapsible
                        collapsed={sidebarCollapsed}
                        onCollapse={toggleSidebar}
                        trigger={null}
                        width={280}
                        collapsedWidth={72}
                        style={{
                            background: darkMode
                                ? "linear-gradient(180deg, #141414 0%, #0d0d0d 100%)"
                                : "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
                            borderRight: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                            position: "fixed",
                            height: "100vh",
                            left: 0,
                            top: 0,
                            zIndex: 100,
                            overflow: "auto",
                        }}
                    >
                        {/* Logo */}
                        <div
                            style={{
                                padding: sidebarCollapsed ? "20px 12px" : "20px 20px",
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                borderBottom: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                                marginBottom: 8,
                            }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                                    cursor: "pointer",
                                }}
                                onClick={() => router.push("/")}
                            >
                                <CodeOutlined style={{ color: "#fff", fontSize: 20 }} />
                            </motion.div>
                            {!sidebarCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Title
                                        level={4}
                                        className="gradient-text-soft"
                                        style={{
                                            margin: 0,
                                            whiteSpace: "nowrap",
                                            fontWeight: 700,
                                            letterSpacing: "-0.5px",
                                        }}
                                    >
                                        DevTools Hub
                                    </Title>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            opacity: 0.5,
                                            letterSpacing: "0.5px",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Developer Portal
                                    </Text>
                                </motion.div>
                            )}
                        </div>

                        {/* Expand/Collapse All Buttons */}
                        {!sidebarCollapsed && (
                            <div style={{
                                display: "flex",
                                gap: 4,
                                padding: "8px 12px",
                                borderBottom: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                            }}>
                                <Button
                                    size="small"
                                    type="text"
                                    icon={<DownOutlined style={{ fontSize: 10 }} />}
                                    onClick={expandAll}
                                    style={{ flex: 1, fontSize: 11 }}
                                >
                                    Expand All
                                </Button>
                                <Button
                                    size="small"
                                    type="text"
                                    icon={<UpOutlined style={{ fontSize: 10 }} />}
                                    onClick={collapseAll}
                                    style={{ flex: 1, fontSize: 11 }}
                                >
                                    Collapse
                                </Button>
                            </div>
                        )}

                        <Menu
                            mode="inline"
                            selectedKeys={[pathname]}
                            openKeys={openKeys}
                            onOpenChange={setOpenKeys}
                            items={menuItems}
                            onClick={({ key }) => {
                                if (key.startsWith("/")) router.push(key);
                            }}
                            style={{
                                border: "none",
                                background: "transparent",
                                padding: "0 8px",
                            }}
                        />
                    </Sider>

                    <Layout
                        style={{
                            marginLeft: sidebarCollapsed ? 72 : 280,
                            transition: "margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            background: darkMode ? "#0a0a0a" : "#fafafa",
                        }}
                    >
                        <Header
                            style={{
                                background: darkMode
                                    ? "rgba(10, 10, 10, 0.85)"
                                    : "rgba(250, 250, 250, 0.85)",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                padding: "0 24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottom: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                                position: "sticky",
                                top: 0,
                                zIndex: 50,
                                height: 60,
                            }}
                        >
                            <Tooltip title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                                <Button
                                    type="text"
                                    icon={
                                        sidebarCollapsed ? (
                                            <MenuUnfoldOutlined style={{ fontSize: 18 }} />
                                        ) : (
                                            <MenuFoldOutlined style={{ fontSize: 18 }} />
                                        )
                                    }
                                    onClick={toggleSidebar}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                    }}
                                />
                            </Tooltip>

                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            type="text"
                                            icon={
                                                darkMode ? (
                                                    <SunOutlined style={{ fontSize: 18, color: "#faad14" }} />
                                                ) : (
                                                    <MoonOutlined style={{ fontSize: 18, color: "#6366f1" }} />
                                                )
                                            }
                                            onClick={toggleDarkMode}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 10,
                                                background: darkMode
                                                    ? "rgba(250, 173, 20, 0.1)"
                                                    : "rgba(99, 102, 241, 0.1)",
                                            }}
                                        />
                                    </motion.div>
                                </Tooltip>
                            </div>
                        </Header>

                        <Content
                            style={{
                                padding: "28px 3%",
                                minHeight: "calc(100vh - 60px)",
                                background: darkMode ? "#0a0a0a" : "#fafafa",
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {children}
                            </motion.div>
                        </Content>
                    </Layout>
                </Layout>
            </App>
        </ConfigProvider>
    );
}

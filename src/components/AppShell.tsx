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
    AutoComplete,
    Input,
    Tag,
    Drawer,
    Grid,
} from "antd";
import { setMessageInstance } from "@/lib/messageService";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    SunOutlined,
    MoonOutlined,
    CodeOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    getToolsByCategory,
    CATEGORY_ICONS,
    CATEGORY_COLORS,
    ALPHA_CATEGORIES,
    toolsRegistry,
} from "@/lib/tools-registry";
import type { ToolCategory } from "@/lib/tools-registry";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import AppFooter from "./AppFooter";
import NavigationLoader from "./NavigationLoader";

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const SIDER_WIDTH = 320;
const SIDER_COLLAPSED_WIDTH = 72;

function MessageBridge() {
    const { message } = App.useApp();
    useEffect(() => {
        setMessageInstance(message);
    }, [message]);
    return null;
}

function AlphaTag() {
    return (
        <Tag
            color="purple"
            style={{
                marginLeft: 6,
                fontSize: 9,
                lineHeight: "14px",
                padding: "0 4px",
                fontWeight: 600,
                letterSpacing: 0.4,
            }}
        >
            ALPHA
        </Tag>
    );
}

interface SearchOption {
    value: string;
    label: React.ReactNode;
    keywords: string;
    category: ToolCategory;
}

function buildSearchOptions(): SearchOption[] {
    return toolsRegistry.map((t) => {
        const Icon = t.icon;
        const isAlpha = ALPHA_CATEGORIES.includes(t.category);
        return {
            value: t.id,
            keywords: `${t.name} ${t.description} ${t.tags.join(" ")} ${t.category}`.toLowerCase(),
            category: t.category,
            label: (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "2px 0",
                    }}
                >
                    <span
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: `${t.color}1f`,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <Icon style={{ color: t.color, fontSize: 14 }} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                        <span
                            style={{
                                display: "block",
                                fontWeight: 500,
                                fontSize: 13,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {t.name}
                            {isAlpha && <AlphaTag />}
                        </span>
                        <span
                            style={{
                                display: "block",
                                fontSize: 11,
                                opacity: 0.6,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {t.category}
                        </span>
                    </span>
                </div>
            ),
        };
    });
}

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const pathname = usePathname();
    const screens = useBreakpoint();
    const isMobile = !screens.lg;

    const { darkMode, toggleDarkMode, sidebarCollapsed, toggleSidebar, setNavigating } = useAppStore();

    const navigate = React.useCallback(
        (path: string) => {
            if (path === pathname) return;
            const match = path.match(/^\/tools\/([^/]+)/);
            const targetId = match ? match[1] : null;
            setNavigating(true, targetId);
            router.push(path);
        },
        [pathname, router, setNavigating]
    );
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const activeCategory = useMemo(() => {
        const match = pathname.match(/^\/tools\/([^/]+)/);
        if (!match) return null;
        return toolsRegistry.find((t) => t.id === match[1])?.category ?? null;
    }, [pathname]);

    // Accordion: only ONE category open at a time
    const [openKey, setOpenKey] = useState<string | null>(activeCategory);
    const [lastCategory, setLastCategory] = useState<string | null>(activeCategory);

    if (activeCategory !== lastCategory) {
        setLastCategory(activeCategory);
        if (activeCategory) {
            setOpenKey(activeCategory);
        }
    }

    const openKeys = openKey ? [openKey] : [];

    const handleOpenChange = (keys: string[]) => {
        // Pick the newly-opened key (the one not in current openKeys); collapse all others
        const newlyOpened = keys.find((k) => k !== openKey);
        setOpenKey(newlyOpened ?? null);
    };

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", darkMode);
        root.style.colorScheme = darkMode ? "dark" : "light";
    }, [darkMode]);

    // Close mobile drawer on navigation
    useEffect(() => {
        setMobileDrawerOpen(false);
    }, [pathname]);

    const categorized = useMemo(() => getToolsByCategory(), []);
    const searchOptions = useMemo(buildSearchOptions, []);

    const filteredOptions = useMemo(() => {
        if (!searchValue.trim()) return [];
        const q = searchValue.toLowerCase();
        return searchOptions.filter((o) => o.keywords.includes(q)).slice(0, 12);
    }, [searchValue, searchOptions]);

    const isDashboard = pathname === "/";


    const menuItems = useMemo(
        () => [
            {
                key: "/",
                icon: <HomeOutlined style={{ fontSize: 16 }} />,
                label: <span style={{ fontWeight: 500 }}>Dashboard</span>,
            },
            ...Array.from(categorized.entries()).map(([category, tools]) => {
                const CategoryIcon = CATEGORY_ICONS[category as ToolCategory];
                const categoryColor = CATEGORY_COLORS[category as ToolCategory];
                const isAlpha = ALPHA_CATEGORIES.includes(category as ToolCategory);
                return {
                    key: category,
                    icon: <CategoryIcon style={{ fontSize: 16, color: categoryColor }} />,
                    label: (
                        <span
                            style={{
                                fontWeight: 500,
                                display: "inline-flex",
                                alignItems: "center",
                            }}
                        >
                            {category}
                            {isAlpha && <AlphaTag />}
                        </span>
                    ),
                    children: tools.map((t) => ({
                        key: `/tools/${t.id}`,
                        icon: React.createElement(t.icon, {
                            style: { fontSize: 14, color: t.color },
                        }),
                        label: (
                            <span
                                style={{
                                    fontSize: 13,
                                    whiteSpace: "normal",
                                    lineHeight: 1.3,
                                    display: "inline-block",
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                }}
                            >
                                {t.name}
                            </span>
                        ),
                    })),
                };
            }),
        ],
        [categorized]
    );

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
            fontFamily:
                'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
                itemHeight: 38,
            },
            Card: { colorBgContainer: "#1a1a1a", colorBorder: "#262626" },
            Button: { borderRadius: 8 },
            Input: { borderRadius: 8, colorBgContainer: "#1a1a1a" },
            Select: { borderRadius: 8, colorBgContainer: "#1a1a1a" },
            Table: { colorBgContainer: "#141414", headerBg: "#1a1a1a" },
            Modal: { contentBg: "#1a1a1a", headerBg: "#1a1a1a" },
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
            fontFamily:
                'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
                itemHeight: 38,
            },
            Card: { colorBgContainer: "#ffffff", colorBorder: "#e5e5e5" },
            Button: { borderRadius: 8 },
            Input: { borderRadius: 8 },
            Select: { borderRadius: 8 },
            Table: { headerBg: "#fafafa" },
        },
    };

    const handleSearchSelect = (toolId: string) => {
        setSearchValue("");
        navigate(`/tools/${toolId}`);
    };

    const sidebarContent = (
        <>
            <div
                style={{
                    padding: sidebarCollapsed && !isMobile ? "20px 12px" : "20px 20px",
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
                    onClick={() => navigate("/")}
                >
                    <CodeOutlined style={{ color: "#fff", fontSize: 20 }} />
                </motion.div>
                {(!sidebarCollapsed || isMobile) && (
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
                            mydevtools
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

            <Menu
                mode="inline"
                selectedKeys={[pathname]}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                items={menuItems}
                onClick={({ key }) => {
                    if (key.startsWith("/")) navigate(key);
                }}
                style={{
                    border: "none",
                    background: "transparent",
                    padding: "0 8px 24px",
                }}
            />
        </>
    );

    const headerSearch = (
        <AutoComplete
            value={searchValue}
            options={filteredOptions}
            onChange={setSearchValue}
            onSelect={handleSearchSelect}
            popupMatchSelectWidth={420}
            style={{ width: "100%", maxWidth: 480 }}
            classNames={{ popup: { root: "header-search-dropdown" } }}
            allowClear
            open={searchValue.trim().length > 0 && filteredOptions.length > 0}
            notFoundContent={null}
        >
            <Input
                size="middle"
                prefix={<SearchOutlined style={{ color: darkMode ? "#737373" : "#a3a3a3" }} />}
                placeholder={`Search ${toolsRegistry.length} tools…`}
                style={{
                    borderRadius: 10,
                    height: 40,
                }}
            />
        </AutoComplete>
    );

    return (
        <ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
            <App>
                <MessageBridge />
                <NavigationLoader />
                <Layout style={{ minHeight: "100vh" }}>
                    {!isMobile && (
                        <Sider
                            collapsible
                            collapsed={sidebarCollapsed}
                            onCollapse={toggleSidebar}
                            trigger={null}
                            width={SIDER_WIDTH}
                            collapsedWidth={SIDER_COLLAPSED_WIDTH}
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
                            {sidebarContent}
                        </Sider>
                    )}

                    {isMobile && (
                        <Drawer
                            placement="left"
                            open={mobileDrawerOpen}
                            onClose={() => setMobileDrawerOpen(false)}
                            size={Math.min(320, typeof window !== "undefined" ? window.innerWidth - 48 : 320)}
                            styles={{
                                body: { padding: 0 },
                                header: { display: "none" },
                                section: {
                                    background: darkMode
                                        ? "linear-gradient(180deg, #141414 0%, #0d0d0d 100%)"
                                        : "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
                                },
                            }}
                        >
                            {sidebarContent}
                        </Drawer>
                    )}

                    <Layout
                        style={{
                            marginLeft: isMobile ? 0 : sidebarCollapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH,
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
                                padding: isMobile ? "0 12px" : "0 24px",
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                borderBottom: `1px solid ${darkMode ? "#262626" : "#e5e5e5"}`,
                                position: "sticky",
                                top: 0,
                                zIndex: 50,
                                height: 60,
                            }}
                        >
                            <Tooltip title={isMobile ? "Open menu" : sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                                <Button
                                    type="text"
                                    icon={
                                        isMobile ? (
                                            <MenuUnfoldOutlined style={{ fontSize: 18 }} />
                                        ) : sidebarCollapsed ? (
                                            <MenuUnfoldOutlined style={{ fontSize: 18 }} />
                                        ) : (
                                            <MenuFoldOutlined style={{ fontSize: 18 }} />
                                        )
                                    }
                                    onClick={() => {
                                        if (isMobile) setMobileDrawerOpen(true);
                                        else toggleSidebar();
                                    }}
                                    style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }}
                                />
                            </Tooltip>

                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 0,
                                    height: "100%",
                                }}
                            >
                                {!isDashboard && headerSearch}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                                <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                                padding: isMobile ? "20px 16px" : "28px clamp(16px, 3%, 48px)",
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
                        <AppFooter />
                    </Layout>
                </Layout>
            </App>
        </ConfigProvider>
    );
}

"use client";

import dynamic from "next/dynamic";
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
    DatabaseOutlined,
    StarOutlined,
    HeartFilled,
    LinkedinFilled,
    GithubOutlined,
} from "@ant-design/icons";
import {
    getToolsByCategory,
    CATEGORY_ICONS,
    CATEGORY_COLORS,
    ALPHA_CATEGORIES,
    toolsRegistry,
} from "@/lib/tools-registry";
import type { ToolCategory } from "@/lib/tools-registry";
import { getToolIdFromPublicPath, toolPath } from "@/lib/category-routes";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import AppFooter from "./AppFooter";
import NavigationLoader from "./NavigationLoader";
import ProjectSwitcher from "./ProjectSwitcher";
import WhatsNewLink from "./WhatsNewLink";
import LanguagePicker from "./LanguagePicker";
import { useLanguage } from "./LanguageProvider";
import enUS from "antd/locale/en_US";
import hiIN from "antd/locale/hi_IN";
import esES from "antd/locale/es_ES";
import frFR from "antd/locale/fr_FR";
import deDE from "antd/locale/de_DE";
import jaJP from "antd/locale/ja_JP";
import zhCN from "antd/locale/zh_CN";
import arEG from "antd/locale/ar_EG";

const componentLocales = { en: enUS, hi: hiIN, es: esES, fr: frFR, de: deDE, ja: jaJP, zh: zhCN, ar: arEG };

const CommandPalette = dynamic(() => import("./WorkspaceOverlays").then((module) => module.CommandPalette), { ssr: false });
const BookmarkButton = dynamic(() => import("./WorkspaceOverlays").then((module) => module.BookmarkButton), { ssr: false });
const ShortcutsHelp = dynamic(() => import("./ShortcutsHelp"), { ssr: false });

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
                marginInlineStart: 6,
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

// ─── Command Palette ─────────────────────────────────────────────────────────

// ─── App Shell ───────────────────────────────────────────────────────────────

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
    const { language, direction, t } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const screens = useBreakpoint();
    const isMobile = !screens.lg;

    const { darkMode, toggleDarkMode, sidebarCollapsed, toggleSidebar, setNavigating } = useAppStore();
    const [commandOpen, setCommandOpen] = useState(false);

    const navigate = React.useCallback(
        (path: string) => {
            if (path === pathname) return;
            const targetId =
                path === "/memory" || path === "/release-notes" ? null : getToolIdFromPublicPath(path);
            setNavigating(true, targetId);
            router.push(path);
        },
        [pathname, router, setNavigating]
    );

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);
    const [bookmarksLoaded, setBookmarksLoaded] = useState(false);
    const [embedded, setEmbedded] = useState(false);
    useEffect(() => { setEmbedded(window.parent !== window); }, []);

    // ⌘K / Ctrl+K opens the command palette; "?" (outside inputs) opens the
    // shortcuts help modal.
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen((v) => !v);
                return;
            }
            if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
                const target = e.target as HTMLElement;
                const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
                if (!isTyping) {
                    e.preventDefault();
                    setShortcutsOpen((v) => !v);
                }
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const currentToolId = useMemo(() => getToolIdFromPublicPath(pathname), [pathname]);

    const activeCategory = useMemo(() => {
        if (!currentToolId) return null;
        return toolsRegistry.find((t) => t.id === currentToolId)?.category ?? null;
    }, [currentToolId]);

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
        const newlyOpened = keys.find((k) => k !== openKey);
        setOpenKey(newlyOpened ?? null);
    };

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", darkMode);
        root.style.colorScheme = darkMode ? "dark" : "light";
    }, [darkMode]);

    useEffect(() => {
        setMobileDrawerOpen(false);
    }, [pathname]);

    const categorized = useMemo(() => getToolsByCategory(), []);

    const menuItems = useMemo(
        () => [
            {
                key: "/",
                icon: <HomeOutlined style={{ fontSize: 16 }} />,
                label: <span style={{ fontWeight: 500 }}>{t("Dashboard")}</span>,
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
                            {t(category)}
                            {isAlpha && <AlphaTag />}
                        </span>
                    ),
                    children: tools.map((tool) => ({
                        key: toolPath(tool),
                        icon: React.createElement(tool.icon, {
                            style: { fontSize: 14, color: tool.color },
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
                                {t(tool.name)}
                            </span>
                        ),
                    })),
                };
            }),
        ],
        [categorized, t]
    );

    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: "#22d3ee",
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
            colorTextSecondary: "#b4b4bf",
            colorTextTertiary: "#8e8e9a",
        },
        components: {
            Menu: {
                itemBg: "transparent",
                subMenuItemBg: "transparent",
                itemSelectedBg: "rgba(34, 211, 238, 0.16)",
                itemHoverBg: "rgba(34, 211, 238, 0.08)",
                itemSelectedColor: "#67e8f9",
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
            colorPrimary: "#0891b2",
            colorBgContainer: "#ffffff",
            colorBgLayout: "#fafafa",
            colorBgElevated: "#ffffff",
            colorBorder: "#d1d5db",
            colorBorderSecondary: "#e5e7eb",
            borderRadius: 10,
            fontFamily:
                'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: 14,
            colorText: "#171717",
            colorTextSecondary: "#475569",
            colorTextTertiary: "#737373",
        },
        components: {
            Menu: {
                itemBg: "transparent",
                subMenuItemBg: "transparent",
                itemSelectedBg: "rgba(8, 145, 178, 0.1)",
                itemHoverBg: "rgba(8, 145, 178, 0.05)",
                itemSelectedColor: "#0e7490",
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

    const sidebarContent = (
        <>
            <div
                style={{
                    padding: sidebarCollapsed && !isMobile ? "20px 12px" : "20px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexDirection: sidebarCollapsed && !isMobile ? "column" : "row",
                    borderBottom: "1px solid var(--wb-header-border)",
                    marginBottom: 8,
                }}
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="wb-shell-brand-mark" onClick={() => navigate("/")}>
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
                            My Dev Tools
                        </Title>
                        <div className="wb-shell-brand-meta">
                        <Text
                            style={{
                                fontSize: 11,
                                opacity: 0.5,
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                            }}
                        >
                            {t("Developer Toolkit")}
                        </Text>
                        <WhatsNewLink onOpen={() => setMobileDrawerOpen(false)} />
                        </div>
                    </motion.div>
                )}
                {sidebarCollapsed && !isMobile && <WhatsNewLink compact />}
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

    // ── Command palette trigger button ──────────────────────────────────────
    const triggerBorder = darkMode ? "#2a2a2a" : "#e2e2e2";
    const triggerBg     = darkMode ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)";
    const triggerText   = darkMode ? "#b4b4bf" : "#52525b";
    const kbdBg         = darkMode ? "#1e1e1e" : "#f2f2f2";
    const kbdBorder     = darkMode ? "#333" : "#ddd";

    const searchTrigger = (
        <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label={`${t("Search tools…")} ⌘K`}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 14px",
                height: 40,
                borderRadius: 10,
                border: `1px solid ${triggerBorder}`,
                background: triggerBg,
                cursor: "pointer",
                fontSize: 13.5,
                lineHeight: 1,
                color: triggerText,
                minWidth: isMobile ? 40 : 200,
                maxWidth: 400,
                width: isMobile ? 40 : "clamp(200px, 35vw, 380px)",
                transition: "border-color 0.15s, background 0.15s",
                outline: "none",
                justifyContent: isMobile ? "center" : "flex-start",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = darkMode ? "#22d3ee" : "#0891b2";
                (e.currentTarget as HTMLButtonElement).style.background = darkMode
                    ? "rgba(34,211,238,0.1)"
                    : "rgba(8,145,178,0.06)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = triggerBorder;
                (e.currentTarget as HTMLButtonElement).style.background = triggerBg;
            }}
        >
            <SearchOutlined style={{ fontSize: 15, flexShrink: 0 }} />
            {!isMobile && (
                <>
                    <span style={{ flex: 1, textAlign: "start" }}>{t("Search tools…")}</span>
                    <kbd
                        style={{
                            padding: "2px 7px",
                            borderRadius: 6,
                            fontSize: 11,
                            background: kbdBg,
                            border: `1px solid ${kbdBorder}`,
                            color: triggerText,
                            fontFamily: "inherit",
                            lineHeight: "16px",
                            flexShrink: 0,
                        }}
                    >
                        ⌘K
                    </kbd>
                </>
            )}
        </button>
    );

    if (embedded) return <ConfigProvider locale={componentLocales[language]} direction={direction} theme={darkMode ? darkTheme : lightTheme}><App><MessageBridge /><main className="wb-embedded-content">{children}</main></App></ConfigProvider>;

    return (
        <ConfigProvider locale={componentLocales[language]} direction={direction} theme={darkMode ? darkTheme : lightTheme}>
            <App>
                <MessageBridge />
                <NavigationLoader />

                {/* Global command palette */}
                <AnimatePresence>
                    {commandOpen && (
                        <CommandPalette
                            key="cmd-palette"
                            onClose={() => setCommandOpen(false)}
                            darkMode={darkMode}
                        />
                    )}
                </AnimatePresence>

                {shortcutsOpen && <ShortcutsHelp onClose={() => setShortcutsOpen(false)} />}

                <Layout className="wb-shell-layout" style={{ minHeight: "100vh" }} suppressHydrationWarning>
                    {(
                        <Sider
                            className="wb-shell-sider wb-desktop-sidebar"
                            collapsible
                            collapsed={sidebarCollapsed}
                            onCollapse={toggleSidebar}
                            trigger={null}
                            width={SIDER_WIDTH}
                            collapsedWidth={SIDER_COLLAPSED_WIDTH}
                            style={{
                                position: "fixed",
                                height: "100vh",
                                insetInlineStart: 0,
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
                            placement={direction === "rtl" ? "right" : "left"}
                            open={mobileDrawerOpen}
                            onClose={() => setMobileDrawerOpen(false)}
                            size={Math.min(320, typeof window !== "undefined" ? window.innerWidth - 48 : 320)}
                            classNames={{ body: "wb-shell-drawer-body", mask: "wb-shell-drawer-mask" }}
                            styles={{
                                body: { padding: 0, background: "var(--wb-sider-bg)" },
                                header: { display: "none" },
                                section: { background: "var(--wb-sider-bg)" },
                            }}
                        >
                            {sidebarContent}
                        </Drawer>
                    )}

                    <Layout
                        className={`wb-shell-content-frame${sidebarCollapsed ? " wb-sidebar-collapsed" : ""}`}
                        style={{
                            background: "var(--wb-shell-bg)",
                        }}
                        suppressHydrationWarning
                    >
                        <Header
                            className="wb-shell-header"
                            style={{
                                background: "var(--wb-header-bg)",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                padding: isMobile ? "0 12px" : "0 24px",
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                position: "sticky",
                                top: 0,
                                zIndex: 50,
                                height: 60,
                                borderBottom: "1px solid var(--wb-header-border)",
                            }}
                            suppressHydrationWarning
                        >
                            <Tooltip
                                title={
                                    isMobile
                                        ? t("Open menu")
                                        : sidebarCollapsed
                                        ? t("Expand sidebar")
                                        : t("Collapse sidebar")
                                }
                            >
                                <Button
                                    type="text"
                                    aria-label={isMobile ? t("Open menu") : sidebarCollapsed ? t("Expand sidebar") : t("Collapse sidebar")}
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

                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                                <Tooltip title={t("Memory & Storage Manager")}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            type="text"
                                            aria-label={t("Memory & Storage Manager")}
                                            icon={<DatabaseOutlined style={{ fontSize: 17, color: darkMode ? "#22d3ee" : "#0891b2" }} />}
                                            onClick={() => navigate("/memory")}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 10,
                                                background: darkMode
                                                    ? "rgba(34, 211, 238, 0.12)"
                                                    : "rgba(8, 145, 178, 0.1)",
                                                flexShrink: 0,
                                            }}
                                        />
                                    </motion.div>
                                </Tooltip>
                                <Tooltip title={t(darkMode ? "Switch to Light Mode" : "Switch to Dark Mode")}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            type="text"
                                            aria-label={t(darkMode ? "Switch to Light Mode" : "Switch to Dark Mode")}
                                            icon={
                                                darkMode ? (
                                                    <SunOutlined style={{ fontSize: 18, color: "#faad14" }} />
                                                ) : (
                                                    <MoonOutlined style={{ fontSize: 18, color: "#0891b2" }} />
                                                )
                                            }
                                            onClick={toggleDarkMode}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 10,
                                                background: darkMode
                                                    ? "rgba(250, 173, 20, 0.1)"
                                                    : "rgba(8, 145, 178, 0.1)",
                                            }}
                                        />
                                    </motion.div>
                                </Tooltip>
                            </div>

                            {bookmarksLoaded ? (                            <BookmarkButton
                                darkMode={darkMode}
                                currentToolId={currentToolId}
                                onNavigate={navigate}
                            />) : <Button aria-label={t("Open bookmarks")} icon={<StarOutlined />} onClick={() => setBookmarksLoaded(true)} style={{ width: 40, height: 40 }} />}

                            <LanguagePicker />

                            {/* Center: search trigger */}
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 0,
                                }}
                            >
                                {searchTrigger}
                            </div>

                            {!isMobile && (
                                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                                        <Text style={{ color: "var(--wb-text-body)" }}>{t("Made with")}</Text>
                                        <motion.span
                                            animate={{ scale: [1, 1.25, 1] }}
                                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                            style={{ display: "inline-flex" }}
                                        >
                                            <HeartFilled style={{ color: "#ec4899", fontSize: 14 }} />
                                        </motion.span>
                                        <Text style={{ color: "var(--wb-text-body)" }}>{t("by")}</Text>
                                        <a
                                            href="https://rameshsnotebook.com/"
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
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            Ramesh Maharaddi
                                        </a>
                                    </div>

                                    <Tooltip title="LinkedIn">
                                        <motion.a
                                            href="https://www.linkedin.com/in/rameshbgm/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -2, scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            aria-label={t("LinkedIn profile")}
                                            style={{
                                                width: 34,
                                                height: 34,
                                                borderRadius: 9,
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: darkMode
                                                    ? "rgba(10, 102, 194, 0.15)"
                                                    : "rgba(10, 102, 194, 0.08)",
                                                border: `1px solid ${darkMode ? "rgba(10, 102, 194, 0.3)" : "rgba(10, 102, 194, 0.18)"}`,
                                                color: "#0a66c2",
                                                textDecoration: "none",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <LinkedinFilled style={{ fontSize: 16 }} />
                                        </motion.a>
                                    </Tooltip>

                                    <Tooltip title="GitHub">
                                        <motion.a
                                            href="https://github.com/rameshbgm/mydevtools"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -2, scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            aria-label={t("GitHub profile")}
                                            style={{
                                                width: 34,
                                                height: 34,
                                                borderRadius: 9,
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: darkMode
                                                    ? "rgba(255, 255, 255, 0.06)"
                                                    : "rgba(0, 0, 0, 0.04)",
                                                border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.10)"}`,
                                                color: darkMode ? "#e5e5e5" : "#171717",
                                                textDecoration: "none",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <GithubOutlined style={{ fontSize: 16 }} />
                                        </motion.a>
                                    </Tooltip>
                                </div>
                            )}
                        </Header>

                        <Content
                            style={{
                                padding:
                                    pathname === "/"
                                        ? isMobile
                                            ? "10px 16px 20px"
                                            : "12px clamp(16px, 3%, 48px) 28px"
                                        : isMobile
                                          ? "20px 16px"
                                          : "28px clamp(16px, 3%, 48px)",
                                minHeight: "calc(100vh - 60px)",
                                background: "var(--wb-content-bg)",
                            }}
                            suppressHydrationWarning
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProjectSwitcher />
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

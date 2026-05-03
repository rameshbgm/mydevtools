"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
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

// ─── Command Palette ─────────────────────────────────────────────────────────

interface CommandPaletteProps {
    onClose: () => void;
    darkMode: boolean;
}

function CommandPalette({ onClose, darkMode }: CommandPaletteProps) {
    const router = useRouter();
    const { recentTools, addRecentTool, setNavigating } = useAppStore();
    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 40);
    }, []);

    const recentDefs = useMemo(
        () =>
            recentTools
                .slice(0, 8)
                .map((id) => toolsRegistry.find((t) => t.id === id))
                .filter(Boolean) as typeof toolsRegistry,
        [recentTools]
    );

    const searchResults = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return [];
        return toolsRegistry
            .filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.category.toLowerCase().includes(q) ||
                    t.tags.some((tag) => tag.toLowerCase().includes(q))
            )
            .slice(0, 18);
    }, [query]);

    const grouped = useMemo(() => {
        const map = new Map<string, typeof searchResults>();
        for (const t of searchResults) {
            const arr = map.get(t.category) ?? [];
            arr.push(t);
            map.set(t.category, arr);
        }
        return map;
    }, [searchResults]);

    const flatList = query.trim() ? searchResults : recentDefs;

    useEffect(() => setActiveIdx(0), [query]);

    // Scroll active item into view
    useEffect(() => {
        const el = listRef.current?.querySelector<HTMLElement>("[data-active='true']");
        el?.scrollIntoView({ block: "nearest" });
    }, [activeIdx]);

    const navigate = useCallback(
        (id: string) => {
            addRecentTool(id);
            setNavigating(true, id);
            onClose();
            router.push(`/tools/${id}`);
        },
        [addRecentTool, setNavigating, onClose, router]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case "Escape":
                onClose();
                break;
            case "ArrowDown":
                e.preventDefault();
                setActiveIdx((i) => Math.min(i + 1, flatList.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIdx((i) => Math.max(i - 1, 0));
                break;
            case "Enter":
                if (flatList[activeIdx]) navigate(flatList[activeIdx].id);
                break;
        }
    };

    // Theme tokens
    const bg         = darkMode ? "#161616" : "#ffffff";
    const border      = darkMode ? "#2a2a2a" : "#e8e8e8";
    const divider     = darkMode ? "#1f1f1f" : "#f2f2f2";
    const textPrimary = darkMode ? "#e5e5e5" : "#171717";
    const textMuted   = darkMode ? "#737373" : "#9a9a9a";
    const activeBg    = darkMode ? "rgba(99,102,241,0.16)" : "rgba(79,70,229,0.08)";
    const activeAccent = darkMode ? "#6366f1" : "#4f46e5";
    const kbdBg       = darkMode ? "#222" : "#f4f4f4";
    const kbdBorder   = darkMode ? "#333" : "#ddd";

    const renderItem = (tool: (typeof toolsRegistry)[0], idx: number) => {
        const isActive = idx === activeIdx;
        const Icon = tool.icon;
        return (
            <div
                key={tool.id}
                data-active={isActive ? "true" : undefined}
                onClick={() => navigate(tool.id)}
                onMouseEnter={() => setActiveIdx(idx)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 20px",
                    cursor: "pointer",
                    background: isActive ? activeBg : "transparent",
                    borderLeft: `3px solid ${isActive ? activeAccent : "transparent"}`,
                    transition: "background 0.08s",
                }}
            >
                <span
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: `${tool.color}22`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Icon style={{ fontSize: 16, color: tool.color }} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                        style={{
                            display: "block",
                            fontWeight: 500,
                            fontSize: 13.5,
                            color: textPrimary,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {tool.name}
                    </span>
                    <span
                        style={{
                            display: "block",
                            fontSize: 11.5,
                            color: textMuted,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {tool.description}
                    </span>
                </span>
                {isActive && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeAccent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "clamp(48px, 12vh, 110px) 16px 16px",
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -14 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: "100%",
                    maxWidth: 660,
                    borderRadius: 18,
                    overflow: "hidden",
                    background: bg,
                    border: `1px solid ${border}`,
                    boxShadow: darkMode
                        ? "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.04)"
                        : "0 40px 100px rgba(0,0,0,0.14), 0 0 0 1px rgba(99,102,241,0.06)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Search input row ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "16px 20px",
                        borderBottom: `1px solid ${divider}`,
                    }}
                >
                    <SearchOutlined
                        style={{
                            fontSize: 19,
                            color: activeAccent,
                            flexShrink: 0,
                        }}
                    />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search tools, categories, tags…"
                        autoComplete="off"
                        spellCheck={false}
                        style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            fontSize: 16,
                            fontWeight: 400,
                            color: textPrimary,
                            fontFamily: "inherit",
                        }}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                            style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                border: "none",
                                cursor: "pointer",
                                background: darkMode ? "#2a2a2a" : "#efefef",
                                color: textMuted,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 14,
                                fontWeight: 700,
                                flexShrink: 0,
                                lineHeight: 1,
                            }}
                        >
                            ×
                        </button>
                    )}
                    <kbd
                        style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontSize: 11,
                            background: kbdBg,
                            color: textMuted,
                            border: `1px solid ${kbdBorder}`,
                            fontFamily: "inherit",
                            lineHeight: "16px",
                            flexShrink: 0,
                        }}
                    >
                        esc
                    </kbd>
                </div>

                {/* ── Results area ── */}
                <div
                    ref={listRef}
                    style={{ maxHeight: 420, overflowY: "auto", overflowX: "hidden" }}
                >
                    {/* Section label */}
                    {flatList.length > 0 && (
                        <div
                            style={{
                                padding: "10px 20px 5px",
                                fontSize: 10.5,
                                fontWeight: 700,
                                letterSpacing: "0.07em",
                                textTransform: "uppercase",
                                color: textMuted,
                            }}
                        >
                            {query.trim()
                                ? `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`
                                : "Recently used"}
                        </div>
                    )}

                    {/* Grouped results when searching */}
                    {query.trim() &&
                        Array.from(grouped.entries()).map(([category, tools]) => (
                            <div key={category}>
                                <div
                                    style={{
                                        padding: "8px 20px 3px",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: CATEGORY_COLORS[category as ToolCategory] ?? textMuted,
                                        opacity: 0.85,
                                    }}
                                >
                                    {category}
                                </div>
                                {tools.map((tool) => renderItem(tool, flatList.indexOf(tool)))}
                            </div>
                        ))}

                    {/* Recent tools flat list */}
                    {!query.trim() && recentDefs.map((tool, idx) => renderItem(tool, idx))}

                    {/* Empty states */}
                    {query.trim() && searchResults.length === 0 && (
                        <div
                            style={{
                                padding: "40px 20px",
                                textAlign: "center",
                                color: textMuted,
                                fontSize: 14,
                            }}
                        >
                            No tools match &ldquo;{query}&rdquo;
                        </div>
                    )}
                    {!query.trim() && recentDefs.length === 0 && (
                        <div
                            style={{
                                padding: "40px 20px",
                                textAlign: "center",
                                color: textMuted,
                                fontSize: 14,
                            }}
                        >
                            Start typing to search {toolsRegistry.length} tools
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div
                    style={{
                        padding: "9px 20px",
                        borderTop: `1px solid ${divider}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        fontSize: 11.5,
                        color: textMuted,
                    }}
                >
                    {(
                        [
                            ["↑↓", "navigate"],
                            ["↵", "open"],
                            ["esc", "close"],
                        ] as [string, string][]
                    ).map(([key, label]) => (
                        <span
                            key={key}
                            style={{ display: "flex", alignItems: "center", gap: 5 }}
                        >
                            <kbd
                                style={{
                                    padding: "2px 6px",
                                    borderRadius: 5,
                                    fontSize: 11,
                                    background: kbdBg,
                                    border: `1px solid ${kbdBorder}`,
                                    fontFamily: "inherit",
                                }}
                            >
                                {key}
                            </kbd>
                            {label}
                        </span>
                    ))}
                    <span style={{ marginLeft: "auto", opacity: 0.6 }}>
                        {toolsRegistry.length} tools
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── App Shell ───────────────────────────────────────────────────────────────

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const pathname = usePathname();
    const screens = useBreakpoint();
    const isMobile = !screens.lg;

    const { darkMode, toggleDarkMode, sidebarCollapsed, toggleSidebar, setNavigating } = useAppStore();
    const [commandOpen, setCommandOpen] = useState(false);

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

    // ⌘K / Ctrl+K global shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen((v) => !v);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const activeCategory = useMemo(() => {
        const match = pathname.match(/^\/tools\/([^/]+)/);
        if (!match) return null;
        return toolsRegistry.find((t) => t.id === match[1])?.category ?? null;
    }, [pathname]);

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
            colorBorder: "#d1d5db",
            colorBorderSecondary: "#e5e7eb",
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
                            My Dev Tools
                        </Title>
                        <Text
                            style={{
                                fontSize: 11,
                                opacity: 0.5,
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                            }}
                        >
                            Developer Toolkit
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

    // ── Command palette trigger button ──────────────────────────────────────
    const triggerBorder = darkMode ? "#2a2a2a" : "#e2e2e2";
    const triggerBg     = darkMode ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)";
    const triggerText   = darkMode ? "#555" : "#71717a";
    const kbdBg         = darkMode ? "#1e1e1e" : "#f2f2f2";
    const kbdBorder     = darkMode ? "#333" : "#ddd";

    const searchTrigger = (
        <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Search tools (⌘K)"
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
                color: triggerText,
                minWidth: isMobile ? 40 : 200,
                maxWidth: 400,
                width: isMobile ? 40 : "clamp(200px, 35vw, 380px)",
                transition: "border-color 0.15s, background 0.15s",
                outline: "none",
                justifyContent: isMobile ? "center" : "flex-start",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = darkMode ? "#6366f1" : "#4f46e5";
                (e.currentTarget as HTMLButtonElement).style.background = darkMode ? "rgba(99,102,241,0.08)" : "rgba(79,70,229,0.04)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = triggerBorder;
                (e.currentTarget as HTMLButtonElement).style.background = triggerBg;
            }}
        >
            <SearchOutlined style={{ fontSize: 15, flexShrink: 0 }} />
            {!isMobile && (
                <>
                    <span style={{ flex: 1, textAlign: "left" }}>Search tools…</span>
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

    return (
        <ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
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

                <Layout style={{ minHeight: "100vh" }} suppressHydrationWarning>
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
                        suppressHydrationWarning
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
                            suppressHydrationWarning
                        >
                            <Tooltip
                                title={
                                    isMobile
                                        ? "Open menu"
                                        : sidebarCollapsed
                                        ? "Expand sidebar"
                                        : "Collapse sidebar"
                                }
                            >
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

                            <Tooltip title="Memory & Storage Manager">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        type="text"
                                        icon={<DatabaseOutlined style={{ fontSize: 17, color: darkMode ? "#6366f1" : "#4f46e5" }} />}
                                        onClick={() => navigate("/memory")}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: darkMode
                                                ? "rgba(99, 102, 241, 0.1)"
                                                : "rgba(79, 70, 229, 0.08)",
                                            flexShrink: 0,
                                        }}
                                    />
                                </motion.div>
                            </Tooltip>

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
                                padding:
                                    pathname === "/"
                                        ? isMobile
                                            ? "10px 16px 20px"
                                            : "12px clamp(16px, 3%, 48px) 28px"
                                        : isMobile
                                          ? "20px 16px"
                                          : "28px clamp(16px, 3%, 48px)",
                                minHeight: "calc(100vh - 60px)",
                                background: darkMode ? "#0a0a0a" : "#fafafa",
                            }}
                            suppressHydrationWarning
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

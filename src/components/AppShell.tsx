"use client";

/* ----------------------------------------------------------------------------
 * AppShell — "Press" edition (UI redesign).
 * Editorial top-nav layout. No sidebar, no glass blur, no gradients.
 * Categories live in a horizontal nav with hover dropdowns; mobile uses an
 * overlay menu. Search is a centered ⌘K command palette.
 * Functionality preserved: dark mode toggle, recent tools, navigation, palette.
 * -------------------------------------------------------------------------- */

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { App, ConfigProvider, theme } from "antd";
import {
    toolsRegistry,
    getToolsByCategory,
    CATEGORY_ORDER,
    type ToolCategory,
} from "@/lib/tools-registry";
import { useAppStore } from "@/lib/store";
import { setMessageInstance } from "@/lib/messageService";
import AppFooter from "./AppFooter";
import NavigationLoader from "./NavigationLoader";

/* ─── Bridges and small helpers ──────────────────────────────────────────── */

function MessageBridge() {
    const { message } = App.useApp();
    useEffect(() => {
        setMessageInstance(message);
    }, [message]);
    return null;
}

function IconSearch() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-5-5" strokeLinecap="round" />
        </svg>
    );
}
function IconSun() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
    );
}
function IconMoon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}
function IconMenu() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
    );
}
function IconClose() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
        </svg>
    );
}
function IconArchive() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8H3M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8M21 8l-2-4H5L3 8M10 12h4" />
        </svg>
    );
}

/* ─── Command palette ────────────────────────────────────────────────────── */

interface CommandPaletteProps {
    onClose: () => void;
}

function CommandPalette({ onClose }: CommandPaletteProps) {
    const router = useRouter();
    const { recentTools, addRecentTool, setNavigating } = useAppStore();
    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const t = setTimeout(() => inputRef.current?.focus(), 30);
        return () => clearTimeout(t);
    }, []);

    const recentDefs = useMemo(
        () =>
            recentTools
                .slice(0, 8)
                .map((id) => toolsRegistry.find((t) => t.id === id))
                .filter(Boolean) as typeof toolsRegistry,
        [recentTools]
    );

    const results = useMemo(() => {
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
            .slice(0, 30);
    }, [query]);

    const grouped = useMemo(() => {
        const map = new Map<string, typeof results>();
        for (const t of results) {
            const arr = map.get(t.category) ?? [];
            arr.push(t);
            map.set(t.category, arr);
        }
        return map;
    }, [results]);

    const flat = query.trim() ? results : recentDefs;

    useEffect(() => setActiveIdx(0), [query]);

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
                setActiveIdx((i) => Math.min(i + 1, flat.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIdx((i) => Math.max(i - 1, 0));
                break;
            case "Enter":
                if (flat[activeIdx]) navigate(flat[activeIdx].id);
                break;
        }
    };

    const renderItem = (tool: (typeof toolsRegistry)[0], idx: number) => {
        const isActive = idx === activeIdx;
        return (
            <div
                key={tool.id}
                className="press-cmdk__item"
                data-active={isActive ? "true" : undefined}
                onClick={() => navigate(tool.id)}
                onMouseEnter={() => setActiveIdx(idx)}
            >
                <span className="press-cmdk__item-num">
                    {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                    <div className="press-cmdk__item-name">{tool.name}</div>
                    <div className="press-cmdk__item-desc">{tool.description}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="press-cmdk-overlay" onClick={onClose}>
            <div
                className="press-cmdk"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Search tools"
            >
                <div className="press-cmdk__input-row">
                    <IconSearch />
                    <input
                        ref={inputRef}
                        className="press-cmdk__input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Find a tool, category, or tag…"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <kbd>esc</kbd>
                </div>

                <div className="press-cmdk__list" ref={listRef}>
                    {flat.length === 0 && (
                        <div className="press-cmdk__group-label">
                            {query.trim()
                                ? `No tools match "${query}"`
                                : `Start typing — ${toolsRegistry.length} tools indexed`}
                        </div>
                    )}

                    {!query.trim() && recentDefs.length > 0 && (
                        <>
                            <div className="press-cmdk__group-label">Recently opened</div>
                            {recentDefs.map((tool, idx) => renderItem(tool, idx))}
                        </>
                    )}

                    {query.trim() &&
                        Array.from(grouped.entries()).map(([category, tools]) => (
                            <div key={category}>
                                <div className="press-cmdk__group-label">{category}</div>
                                {tools.map((tool) =>
                                    renderItem(tool, flat.indexOf(tool))
                                )}
                            </div>
                        ))}
                </div>

                <div className="press-cmdk__foot">
                    <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
                    <span><kbd>↵</kbd> open</span>
                    <span><kbd>esc</kbd> close</span>
                    <span style={{ marginLeft: "auto" }}>{toolsRegistry.length} tools</span>
                </div>
            </div>
        </div>
    );
}

/* ─── Top navigation ─────────────────────────────────────────────────────── */

interface NavDropdownProps {
    category: ToolCategory;
    tools: { id: string; name: string }[];
    onNavigate: (path: string) => void;
}

function NavDropdown({ category, tools, onNavigate }: NavDropdownProps) {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const handleEnter = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpen(true);
    };
    const handleLeave = () => {
        closeTimer.current = setTimeout(() => setOpen(false), 120);
    };

    return (
        <div
            ref={wrapRef}
            style={{ position: "relative" }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <button
                type="button"
                className="press-nav__link"
                style={{ background: "none", border: 0, cursor: "pointer" }}
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open ? "true" : "false"}
            >
                {category}
            </button>
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: 0,
                        background: "var(--paper)",
                        border: "1px solid var(--ink)",
                        boxShadow: "6px 6px 0 var(--rule-soft)",
                        minWidth: 280,
                        maxWidth: 360,
                        zIndex: 40,
                        padding: "10px 0",
                    }}
                >
                    <div
                        style={{
                            font: "var(--type-eyebrow)",
                            color: "var(--ink-faint)",
                            padding: "4px 18px 8px",
                            borderBottom: "1px solid var(--rule-soft)",
                            marginBottom: 6,
                        }}
                    >
                        {category} · {tools.length}
                    </div>
                    {tools.map((t, i) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                onNavigate(`/tools/${t.id}`);
                            }}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "32px 1fr",
                                gap: 10,
                                width: "100%",
                                padding: "6px 18px",
                                textAlign: "left",
                                background: "transparent",
                                border: 0,
                                cursor: "pointer",
                                color: "var(--ink)",
                                fontFamily: "var(--font-sans), sans-serif",
                                fontSize: 13.5,
                                lineHeight: 1.4,
                                transition: "background 100ms ease",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "var(--paper-tint)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 11,
                                    color: "var(--ink-faint)",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span>{t.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─── Mobile menu ────────────────────────────────────────────────────────── */

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    categorized: Map<ToolCategory, { id: string; name: string }[]>;
    onNavigate: (path: string) => void;
}

function MobileMenu({ open, onClose, categorized, onNavigate }: MobileMenuProps) {
    if (!open) return null;
    return (
        <div className="press-mobile-menu">
            <div className="press-mobile-menu__head">
                <Link href="/" onClick={onClose} className="press-mast" style={{ flex: 1 }}>
                    <span className="press-mast__name">mydevtools</span>
                </Link>
                <button
                    type="button"
                    className="press-iconbtn"
                    aria-label="Close menu"
                    onClick={onClose}
                >
                    <IconClose />
                </button>
            </div>
            <div className="press-mobile-menu__body">
                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        onNavigate("/");
                    }}
                    style={{
                        background: "transparent",
                        border: 0,
                        padding: "12px 0",
                        font: "600 18px/1 var(--font-serif)",
                        color: "var(--ink)",
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%",
                        borderBottom: "1px solid var(--rule)",
                    }}
                >
                    Index
                </button>

                {Array.from(categorized.entries()).map(([category, tools]) => (
                    <div key={category} style={{ marginTop: 24 }}>
                        <div
                            style={{
                                font: "var(--type-eyebrow)",
                                color: "var(--ink-faint)",
                                marginBottom: 8,
                            }}
                        >
                            {category} · {tools.length}
                        </div>
                        {tools.map((t, i) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onNavigate(`/tools/${t.id}`);
                                }}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "32px 1fr",
                                    gap: 10,
                                    width: "100%",
                                    padding: "10px 0",
                                    textAlign: "left",
                                    background: "transparent",
                                    border: 0,
                                    borderTop: "1px solid var(--rule-soft)",
                                    cursor: "pointer",
                                    color: "var(--ink)",
                                    font: "600 15px/1.3 var(--font-serif)",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 11,
                                        color: "var(--ink-faint)",
                                    }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span>{t.name}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Shell ──────────────────────────────────────────────────────────────── */

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const pathname = usePathname();
    const { darkMode, toggleDarkMode, setNavigating } = useAppStore();

    const [paletteOpen, setPaletteOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigate = useCallback(
        (path: string) => {
            if (path === pathname) return;
            const match = path.match(/^\/tools\/([^/]+)/);
            const targetId = match ? match[1] : null;
            setNavigating(true, targetId);
            router.push(path);
        },
        [pathname, router, setNavigating]
    );

    /* ⌘K shortcut */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setPaletteOpen((v) => !v);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    /* Theme class */
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", darkMode);
        root.style.colorScheme = darkMode ? "dark" : "light";
    }, [darkMode]);

    /* Auto-close mobile menu on route change */
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const categorized = useMemo(() => {
        const all = getToolsByCategory();
        const out = new Map<ToolCategory, { id: string; name: string }[]>();
        for (const cat of CATEGORY_ORDER) {
            const list = all.get(cat);
            if (list?.length) {
                out.set(cat, list.map((t) => ({ id: t.id, name: t.name })));
            }
        }
        return out;
    }, []);

    /* Ant Design theme tokens — match the white "press" palette */
    const antTheme = useMemo(
        () => ({
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
                colorPrimary: darkMode ? "#6dbb83" : "#2f6b3f",
                colorBgBase: darkMode ? "#0f0f0f" : "#ffffff",
                colorBgContainer: darkMode ? "#0f0f0f" : "#ffffff",
                colorBgElevated: darkMode ? "#181818" : "#ffffff",
                colorBgLayout: darkMode ? "#0f0f0f" : "#ffffff",
                colorBorder: darkMode ? "#2a2a2a" : "#e2e2e2",
                colorBorderSecondary: darkMode ? "#2a2a2a" : "#e2e2e2",
                colorText: darkMode ? "#f5f5f5" : "#111111",
                colorTextSecondary: darkMode ? "#c8c8c8" : "#444444",
                colorTextTertiary: darkMode ? "#888888" : "#767676",
                borderRadius: 2,
                borderRadiusLG: 6,
                fontFamily:
                    "var(--font-plex-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontFamilyCode: "var(--font-plex-mono), 'SFMono-Regular', Menlo, monospace",
                fontSize: 14,
                wireframe: false,
            },
        }),
        [darkMode]
    );

    return (
        <ConfigProvider theme={antTheme}>
            <App>
                <MessageBridge />
                <NavigationLoader />

                {paletteOpen && (
                    <CommandPalette onClose={() => setPaletteOpen(false)} />
                )}

                <MobileMenu
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    categorized={categorized}
                    onNavigate={navigate}
                />

                <div className="press-shell">
                    <header className="press-topbar">
                        <div className="press-topbar__inner">
                            <Link href="/" className="press-mast">
                                <span className="press-mast__name">mydevtools</span>
                                <span className="press-mast__edition">Edition №1</span>
                            </Link>

                            <nav className="press-nav" aria-label="Primary">
                                {Array.from(categorized.entries())
                                    .slice(0, 5)
                                    .map(([category, tools]) => (
                                        <NavDropdown
                                            key={category}
                                            category={category}
                                            tools={tools}
                                            onNavigate={navigate}
                                        />
                                    ))}
                                <Link href="/" className="press-nav__link" data-active={pathname === "/" ? "true" : undefined}>
                                    All
                                </Link>
                            </nav>

                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                                <button
                                    type="button"
                                    className="press-search-trigger"
                                    onClick={() => setPaletteOpen(true)}
                                    aria-label="Open search (⌘K)"
                                >
                                    <IconSearch />
                                    <span>Search</span>
                                    <span style={{ marginLeft: "auto" }}>
                                        <kbd>⌘K</kbd>
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="press-iconbtn"
                                    aria-label="Storage manager"
                                    onClick={() => navigate("/memory")}
                                >
                                    <IconArchive />
                                </button>

                                <button
                                    type="button"
                                    className="press-iconbtn"
                                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                                    onClick={toggleDarkMode}
                                >
                                    {darkMode ? <IconSun /> : <IconMoon />}
                                </button>

                                <button
                                    type="button"
                                    className="press-iconbtn press-hamburger"
                                    aria-label="Open menu"
                                    aria-haspopup="true"
                                    onClick={() => setMobileOpen(true)}
                                >
                                    <IconMenu />
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="press-main">{children}</main>

                    <AppFooter />
                </div>
            </App>
        </ConfigProvider>
    );
}

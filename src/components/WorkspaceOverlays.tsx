"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Tooltip, Popover } from "antd";
import { SearchOutlined, StarOutlined } from "@ant-design/icons";
import { CATEGORY_COLORS, toolsRegistry, type ToolCategory } from "@/lib/tools-registry";
import { toolPath } from "@/lib/category-routes";
import { matchesToolQuery } from "@/lib/tool-search";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "./LanguageProvider";
import { motion } from "framer-motion";

interface CommandPaletteProps {
    onClose: () => void;
    darkMode: boolean;
}

export function CommandPalette({ onClose, darkMode }: CommandPaletteProps) {
    const { language, t } = useLanguage();
    const router = useRouter();
    const { recentTools, addRecentTool, setNavigating } = useAppStore();
    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        const timer = setTimeout(() => inputRef.current?.focus(), 40);
        return () => { clearTimeout(timer); previous?.focus(); };
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
                    matchesToolQuery(t, q, language)
            )
            .slice(0, 18);
    }, [query, language]);

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

    useEffect(() => setActiveIdx(0), [query, language]);

    // Scroll active item into view
    useEffect(() => {
        const el = listRef.current?.querySelector<HTMLElement>("[data-active='true']");
        el?.scrollIntoView({ block: "nearest" });
    }, [activeIdx]);

    const navigate = useCallback(
        (id: string) => {
            const def = toolsRegistry.find((t) => t.id === id);
            if (!def) return;
            addRecentTool(id);
            setNavigating(true, id);
            onClose();
            router.push(toolPath(def));
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

    const textPrimary = darkMode ? "#e5e5e5" : "#171717";
    const textMuted = darkMode ? "#aaaab5" : "#52525b";
    const activeAccent = darkMode ? "#22d3ee" : "#0891b2";
    const kbdBg = darkMode ? "#222" : "#f4f4f4";
    const kbdBorder = darkMode ? "#333" : "#ddd";

    const renderItem = (tool: (typeof toolsRegistry)[0], idx: number) => {
        const isActive = idx === activeIdx;
        const Icon = tool.icon;
        return (
            <Link
                href={toolPath(tool)} prefetch={false}
                key={tool.id}
                data-active={isActive ? "true" : undefined}
                className="wb-cmd-row"
                onClick={(event) => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); navigate(tool.id); }}
                onMouseEnter={() => setActiveIdx(idx)}
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
                        {t(tool.name)}
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
                        {t(tool.description)}
                    </span>
                </span>
                {isActive && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeAccent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                )}
            </Link>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="wb-cmd-overlay"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -14 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                ref={panelRef} role="dialog" aria-modal="true" aria-label={t("Search developer tools")}
                onKeyDown={(event) => {
                    if (event.key === "Escape") { event.stopPropagation(); onClose(); }
                    if (event.key === "Tab") {
                        const focusable = panelRef.current?.querySelectorAll<HTMLElement>('input, button, a[href]');
                        if (!focusable?.length) return;
                        const first = focusable[0], last = focusable[focusable.length - 1];
                        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
                    }
                }}
                className="wb-cmd-panel"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="wb-cmd-input-row">
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
                        aria-label={t("Search developer tools")}
                        placeholder={t("Search tools, categories, tags…")}
                        autoComplete="off"
                        spellCheck={false}
                        className="wb-cmd-field"
                    />
                    {query && (
                        <button aria-label={t("Clear search")}
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

                <div ref={listRef} className="wb-cmd-results">
                    {flatList.length > 0 && (
                        <div
                            style={{
                                padding: "10px 20px 5px",
                                fontSize: 10.5,
                                fontWeight: 700,
                                letterSpacing: "0.07em",
                                textTransform: "uppercase",
                            }}
                            className="wb-cmd-muted"
                        >
                            {query.trim()
                                ? t("Results: {count}", { count: searchResults.length })
                                : t("Recently used")}
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
                                    {t(category)}
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
                            {t("No tools match “{query}”", { query })}
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
                            {t("Start typing to search {count} tools", { count: toolsRegistry.length })}
                        </div>
                    )}
                </div>

                <div className="wb-cmd-footer">
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
                            {t(label)}
                        </span>
                    ))}
                    <span className="wb-cmd-muted" style={{ marginInlineStart: "auto" }}>
                        {t("{count} tools", { count: toolsRegistry.length })}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Bookmark Button & Panel ─────────────────────────────────────────────────

interface BookmarkButtonProps {
    darkMode: boolean;
    currentToolId: string | null;
    onNavigate: (path: string) => void;
}

export function BookmarkButton({ darkMode, currentToolId, onNavigate }: BookmarkButtonProps) {
    const { language, t } = useLanguage();
    const {
        bookmarks,
        addBookmarkMenu,
        removeBookmarkMenu,
        renameBookmarkMenu,
        addToolToBookmark,
        removeToolFromBookmark,
    } = useAppStore();

    const [open, setOpen] = useState(true);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(bookmarks[0]?.id ?? null);
    const [addQuery, setAddQuery] = useState("");
    const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
    const [editNameValue, setEditNameValue] = useState("");
    const [newMenuInput, setNewMenuInput] = useState(false);
    const [newMenuName, setNewMenuName] = useState("");
    const addInputRef = useRef<HTMLInputElement>(null);

    const activeMenu = useMemo(
        () => bookmarks.find((m) => m.id === activeMenuId) ?? bookmarks[0] ?? null,
        [bookmarks, activeMenuId]
    );

    useEffect(() => {
        if (!activeMenuId && bookmarks.length > 0) {
            setActiveMenuId(bookmarks[0].id);
        } else if (activeMenuId && !bookmarks.find((m) => m.id === activeMenuId)) {
            setActiveMenuId(bookmarks[0]?.id ?? null);
        }
    }, [bookmarks, activeMenuId]);

    const commitNewMenu = (name: string) => {
        const trimmed = name.trim();
        if (trimmed && bookmarks.length < 3) {
            const newId = `bm-${Date.now().toString(36)}`;
            addBookmarkMenu(trimmed, newId);
            setActiveMenuId(newId);
        }
        setNewMenuInput(false);
        setNewMenuName("");
    };

    const handleRemoveMenu = (id: string) => {
        removeBookmarkMenu(id);
        if (activeMenuId === id) {
            setActiveMenuId(bookmarks.filter((m) => m.id !== id)[0]?.id ?? null);
        }
    };

    const addResults = useMemo(() => {
        if (!addQuery.trim() || !activeMenu) return [];
        const q = addQuery.toLowerCase();
        return toolsRegistry
            .filter(
                (t) =>
                    !activeMenu.toolIds.includes(t.id) &&
                    matchesToolQuery(t, q, language)
            )
            .slice(0, 6);
    }, [addQuery, activeMenu, language]);

    const totalPinned = bookmarks.reduce((sum, m) => sum + m.toolIds.length, 0);

    const accent   = darkMode ? "#22d3ee" : "#0891b2";
    const bg       = darkMode ? "#1a1a1a" : "#ffffff";
    const border   = darkMode ? "#303030" : "#e5e7eb";
    const textPrimary = darkMode ? "#e5e5e5" : "#171717";
    const textMuted   = darkMode ? "#aaaab5" : "#52525b";
    const hoverBg  = darkMode ? "rgba(34,211,238,0.08)" : "rgba(8,145,178,0.06)";
    const inputBg  = darkMode ? "#111" : "#f9fafb";
    const shadow   = darkMode ? "0 8px 32px rgba(0,0,0,0.55)" : "0 8px 32px rgba(0,0,0,0.12)";

    const currentToolDef = currentToolId
        ? toolsRegistry.find((t) => t.id === currentToolId) ?? null
        : null;
    const currentInMenu = !!activeMenu?.toolIds.includes(currentToolId ?? "");

    const panelContent = (
        <div className="wb-bookmark-panel" style={{ userSelect: "none" }}>
            {/* ── Browser-tab style menu row ── */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, marginBottom: 14, borderBottom: `1px solid ${border}` }}>
                {bookmarks.map((menu) => {
                    const isActive = menu.id === activeMenu?.id;
                    return (
                        <div
                            key={menu.id}
                            onClick={() => { if (editingMenuId !== menu.id) { setActiveMenuId(menu.id); setAddQuery(""); } }}
                            style={{
                                display: "flex", alignItems: "center", gap: 4,
                                padding: "6px 8px 6px 10px",
                                borderRadius: "7px 7px 0 0",
                                border: `1px solid ${isActive ? border : "transparent"}`,
                                borderBottom: isActive ? `1px solid ${bg}` : "1px solid transparent",
                                background: isActive ? bg : "transparent",
                                cursor: "pointer", marginBottom: isActive ? -1 : 0,
                                transition: "all 0.15s", maxWidth: 120, flexShrink: 1,
                            }}
                        >
                            {editingMenuId === menu.id ? (
                                <input
                                    aria-label={t("Rename bookmark menu")}
                                    autoFocus
                                    value={editNameValue}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => setEditNameValue(e.target.value)}
                                    onBlur={() => {
                                        if (editNameValue.trim()) renameBookmarkMenu(menu.id, editNameValue.trim());
                                        setEditingMenuId(null);
                                    }}
                                    onKeyDown={(e) => {
                                        e.stopPropagation();
                                        if (e.key === "Enter") { if (editNameValue.trim()) renameBookmarkMenu(menu.id, editNameValue.trim()); setEditingMenuId(null); }
                                        else if (e.key === "Escape") setEditingMenuId(null);
                                    }}
                                    style={{ width: 72, border: `1px solid ${accent}`, borderRadius: 4, padding: "1px 5px", fontSize: 11.5, background: bg, color: textPrimary, outline: "none", fontWeight: 600 }}
                                />
                            ) : (
                                <span
                                    onDoubleClick={(e) => { e.stopPropagation(); setEditingMenuId(menu.id); setEditNameValue(menu.name); }}
                                    title={t("{name} · {count}/10 (double-click to rename)", { name: menu.name, count: menu.toolIds.length })}
                                    style={{ fontSize: 12, fontWeight: 600, color: isActive ? textPrimary : textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 80 }}
                                >
                                    {menu.name}
                                </span>
                            )}
                            <button
                                type="button"
                                aria-label={t("Remove {name} bookmark menu", { name: menu.name })}
                                onClick={(e) => { e.stopPropagation(); handleRemoveMenu(menu.id); }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ef4444")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = textMuted)}
                                style={{ width: 14, height: 14, border: "none", background: "transparent", color: textMuted, cursor: "pointer", fontSize: 13, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, borderRadius: 3, flexShrink: 0 }}
                            >
                                ×
                            </button>
                        </div>
                    );
                })}

                {/* New menu tab — either + button or name input */}
                {bookmarks.length < 3 && !newMenuInput && (
                    <Tooltip title={t("New bookmark menu (max 3)")}>
                        <button
                            type="button"
                            onClick={() => setNewMenuInput(true)}
                            style={{ padding: "5px 10px", borderRadius: "7px 7px 0 0", border: "1px solid transparent", borderBottom: "none", background: "transparent", color: textMuted, fontSize: 17, cursor: "pointer", lineHeight: 1, marginBottom: 0 }}
                        >
                            +
                        </button>
                    </Tooltip>
                )}
                {newMenuInput && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 4px 6px", marginBottom: -1 }}>
                        <input
                            autoFocus
                            aria-label={t("New bookmark menu name")}
                            value={newMenuName}
                            onChange={(e) => setNewMenuName(e.target.value)}
                            onBlur={() => commitNewMenu(newMenuName)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") commitNewMenu(newMenuName);
                                else if (e.key === "Escape") { setNewMenuInput(false); setNewMenuName(""); }
                            }}
                            placeholder={t("Menu name…")}
                            style={{ width: 96, border: `1px solid ${accent}`, borderRadius: 5, padding: "3px 8px", fontSize: 12, background: inputBg, color: textPrimary, outline: "none" }}
                        />
                    </div>
                )}
            </div>

            {/* ── Empty state ── */}
            {bookmarks.length === 0 && !newMenuInput && (
                <div style={{ textAlign: "center", padding: "24px 0 20px" }}>
                    <StarOutlined style={{ fontSize: 28, color: textMuted, marginBottom: 10, display: "block" }} />
                    <div style={{ fontSize: 13, color: textPrimary, fontWeight: 500, marginBottom: 4 }}>{t("Bookmark your favorite tools")}</div>
                    <div style={{ fontSize: 12, color: textMuted, marginBottom: 16 }}>{t("Up to 3 menus · 10 tools each")}</div>
                    <button
                        type="button"
                        onClick={() => setNewMenuInput(true)}
                        style={{ padding: "7px 18px", borderRadius: 8, border: `1px solid ${accent}`, background: `${accent}1a`, color: accent, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                    >
                        {t("Create first menu")}
                    </button>
                </div>
            )}

            {/* ── Active menu content ── */}
            {activeMenu && (
                <>
                    {/* Count label */}
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                        {t("{count}/10 tools pinned", { count: activeMenu.toolIds.length })}
                    </div>

                    {/* Quick-pin current tool */}
                    {currentToolDef && (
                        <button
                            type="button"
                            onClick={() => {
                                if (currentInMenu) removeToolFromBookmark(activeMenu.id, currentToolDef.id);
                                else if (activeMenu.toolIds.length < 10) addToolToBookmark(activeMenu.id, currentToolDef.id);
                            }}
                            disabled={activeMenu.toolIds.length >= 10 && !currentInMenu}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                width: "100%", padding: "7px 10px", borderRadius: 8,
                                border: `1px solid ${currentInMenu ? accent : border}`,
                                background: currentInMenu ? `${accent}18` : "transparent",
                                color: currentInMenu ? accent : textPrimary,
                                fontSize: 12, fontWeight: 500, textAlign: "start",
                                cursor: activeMenu.toolIds.length >= 10 && !currentInMenu ? "not-allowed" : "pointer",
                                marginBottom: 10,
                                opacity: activeMenu.toolIds.length >= 10 && !currentInMenu ? 0.45 : 1,
                                transition: "all 0.15s",
                            }}
                        >
                            <span style={{ fontSize: 15, lineHeight: 1 }}>{currentInMenu ? "★" : "☆"}</span>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {currentInMenu ? t("Pinned — click to unpin") : t('Pin "{tool}"', { tool: t(currentToolDef.name) })}
                            </span>
                        </button>
                    )}

                    {/* Pinned tools list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 220, overflowY: "auto", marginBottom: 10 }}>
                        {activeMenu.toolIds.length === 0 && (
                            <div style={{ padding: "14px 0", textAlign: "center", color: textMuted, fontSize: 12 }}>
                                {t("No tools pinned — search below to add")}
                            </div>
                        )}
                        {activeMenu.toolIds.map((toolId) => {
                            const tool = toolsRegistry.find((t) => t.id === toolId);
                            if (!tool) return null;
                            const Icon = tool.icon;
                            return (
                                <div
                                    key={toolId}
                                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 7, cursor: "pointer", transition: "background 0.12s" }}
                                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = hoverBg)}
                                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
                                >
                                    <span
                                        onClick={() => { onNavigate(toolPath(tool)); setOpen(false); }}
                                        style={{ width: 28, height: 28, borderRadius: 7, background: `${tool.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                                    >
                                        <Icon style={{ fontSize: 13, color: tool.color }} />
                                    </span>
                                    <span
                                        onClick={() => { onNavigate(toolPath(tool)); setOpen(false); }}
                                        style={{ flex: 1, fontSize: 12.5, color: textPrimary, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                    >
                                        {t(tool.name)}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label={t("Remove tool from bookmark")}
                                        onClick={() => removeToolFromBookmark(activeMenu.id, toolId)}
                                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ef4444")}
                                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = textMuted)}
                                        style={{ width: 20, height: 20, border: "none", background: "transparent", color: textMuted, cursor: "pointer", fontSize: 16, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: 4, padding: 0 }}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add tool search */}
                    {activeMenu.toolIds.length < 10 ? (
                        <div style={{ position: "relative" }}>
                            <input
                                ref={addInputRef}
                                aria-label={t("Search tools to add to bookmark")}
                                value={addQuery}
                                onChange={(e) => setAddQuery(e.target.value)}
                                placeholder={t("Search to add a tool…")}
                                onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                                onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                                style={{ width: "100%", padding: "7px 10px", borderRadius: 7, border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                            />
                            {addResults.length > 0 && (
                                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: bg, border: `1px solid ${border}`, borderRadius: 8, overflow: "hidden", zIndex: 1000, boxShadow: shadow }}>
                                    {addResults.map((tool) => {
                                        const Icon = tool.icon;
                                        return (
                                            <div
                                                key={tool.id}
                                                onMouseDown={(e) => { e.preventDefault(); addToolToBookmark(activeMenu.id, tool.id); setAddQuery(""); addInputRef.current?.focus(); }}
                                                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = hoverBg)}
                                                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
                                                style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", cursor: "pointer", transition: "background 0.12s" }}
                                            >
                                                <span style={{ width: 24, height: 24, borderRadius: 6, background: `${tool.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <Icon style={{ fontSize: 12, color: tool.color }} />
                                                </span>
                                                <span style={{ flex: 1, fontSize: 12, color: textPrimary, fontWeight: 500 }}>{t(tool.name)}</span>
                                                <span style={{ fontSize: 10.5, color: textMuted }}>{t(tool.category)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ fontSize: 11.5, color: textMuted, textAlign: "center", padding: "4px 0" }}>
                            {t("Menu is full · 10/10 tools pinned")}
                        </div>
                    )}
                </>
            )}
        </div>
    );

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
            trigger="click"
            placement="bottomLeft"
            arrow={false}
            content={panelContent}
            classNames={{ root: "wb-bookmark-popover" }}
            styles={{ container: { padding: 16 }, content: { padding: 0 } }}
        >
            <Tooltip title={t("Bookmarks")} open={open ? false : undefined}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        aria-label={t("Open bookmarks")} aria-expanded={open}
                        type="text"
                        icon={
                            <StarOutlined
                                style={{
                                    fontSize: 17,
                                    color: open || totalPinned > 0
                                        ? (darkMode ? "#22d3ee" : "#0891b2")
                                        : undefined,
                                }}
                            />
                        }
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: open || totalPinned > 0
                                ? (darkMode ? "rgba(34,211,238,0.12)" : "rgba(8,145,178,0.1)")
                                : "transparent",
                            flexShrink: 0,
                        }}
                    />
                </motion.div>
            </Tooltip>
        </Popover>
    );
}

"use client";
import { projectStorage } from "@/lib/project-storage";

import React, { useState, useEffect } from "react";
import { Button, Input, Tooltip, Popconfirm, Empty, Typography } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    PushpinOutlined,
    PushpinFilled,
    CheckOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;
const { TextArea } = Input;

const STORAGE_KEY = "wb-sticky-notes-v1";

interface StickyNote {
    id: string;
    title: string;
    content: string;
    color: string;
    createdAt: number;
    updatedAt: number;
    pinned: boolean;
}

const NOTE_COLORS: Array<{ name: string; bg: string; border: string }> = [
    { name: "Yellow", bg: "#fef08a", border: "#fde047" },
    { name: "Blue",   bg: "#bfdbfe", border: "#93c5fd" },
    { name: "Green",  bg: "#bbf7d0", border: "#86efac" },
    { name: "Pink",   bg: "#fbcfe8", border: "#f9a8d4" },
    { name: "Orange", bg: "#fed7aa", border: "#fdba74" },
    { name: "Purple", bg: "#e9d5ff", border: "#d8b4fe" },
    { name: "Teal",   bg: "#99f6e4", border: "#5eead4" },
    { name: "Red",    bg: "#fecaca", border: "#fca5a5" },
];

function uid() {
    return `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadNotes(): StickyNote[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(projectStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
}

function persist(notes: StickyNote[]) {
    projectStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export default function StickyNotesPage() {
    const { t, language } = useLanguage();
    const [notes, setNotes] = useState<StickyNote[]>([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        setNotes(loadNotes());
    }, []);

    const patch = (id: string, changes: Partial<StickyNote>) => {
        setNotes(prev => {
            const updated = prev.map(n =>
                n.id === id ? { ...n, ...changes, updatedAt: Date.now() } : n
            );
            persist(updated);
            return updated;
        });
    };

    const addNote = () => {
        const note: StickyNote = {
            id: uid(),
            title: t("New Note"),
            content: "",
            color: NOTE_COLORS[0].bg,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            pinned: false,
        };
        setNotes(prev => {
            const updated = [note, ...prev];
            persist(updated);
            return updated;
        });
        setEditingId(note.id);
    };

    const deleteNote = (id: string) => {
        setNotes(prev => {
            const updated = prev.filter(n => n.id !== id);
            persist(updated);
            return updated;
        });
        if (editingId === id) setEditingId(null);
    };

    const sorted = [...notes]
        .filter(n =>
            !search ||
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            return b.updatedAt - a.updatedAt;
        });

    return (
        <ToolPageLayout
            title={t("Sticky Notes")}
            description={t("Create, organize, and persist colorful sticky notes. Notes auto-save to your browser's localStorage — no account needed.")}
            icon={<PushpinOutlined />}
            color="#f59e0b"
            learnMore={{
                whatIs: t("A digital sticky notes board that lives entirely in your browser. All notes are stored in localStorage — no server, no account, no sync required."),
                whyUse: t("Keep reminders and non-sensitive snippets near your tools. Notes are not encrypted; do not store API keys, passwords or other secrets here."),
                howToUse: [
                    t("Click 'New Note' to create a note."),
                    t("Click any note to start editing its title and content."),
                    t("Pick a color from the swatches at the bottom of each note."),
                    t("Pin important notes to keep them at the top of the board."),
                    t("Use the search bar to filter notes by title or content."),
                ],
                tips: [
                    t("Notes auto-save on every keystroke — no save button needed."),
                    t("Pinned notes always stay at the top of the board."),
                    t("Clearing browser localStorage will erase notes — copy important content elsewhere if needed."),
                ],
            }}
        >
            {/* Toolbar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={addNote}>
                    {t("New Note")}</Button>
                <Input dir="auto" styles={{ input: { fontSize: 16 } }}
                    prefix={<SearchOutlined />}
                    placeholder={t("Search notes…")}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    allowClear
                    style={{ maxWidth: 260 }}
                />
                {notes.length > 0 && (
                    <Text type="secondary" style={{ marginInlineStart: "auto", fontSize: 13 }}>
                        {t("Notes shown: {visible} / {total}", { visible: sorted.length, total: notes.length })}
                    </Text>
                )}
            </div>

            {/* Notes grid */}
            {sorted.length === 0 ? (
                <Empty
                    description={
                        search
                            ? t("No notes match your search")
                            : t("No notes yet — click 'New Note' to get started")
                    }
                    style={{ padding: "60px 0" }}
                />
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(230px, 100%), 1fr))",
                        gap: 16,
                        alignItems: "start",
                    }}
                >
                    <AnimatePresence>
                        {sorted.map(note => {
                            const colorInfo = NOTE_COLORS.find(c => c.bg === note.color) ?? NOTE_COLORS[0];
                            const isEditing = editingId === note.id;

                            return (
                                <motion.div
                                    key={note.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: -8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ duration: 0.18 }}
                                    style={{
                                        background: note.color,
                                        border: `1px solid ${colorInfo.border}`,
                                        borderRadius: 8,
                                        padding: "12px 14px 10px",
                                        position: "relative",
                                        boxShadow: note.pinned
                                            ? "0 4px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)"
                                            : "0 2px 6px rgba(0,0,0,0.08)",
                                        cursor: isEditing ? "default" : "pointer",
                                        minHeight: 130,
                                        display: "flex",
                                        flexDirection: "column",
                                        userSelect: isEditing ? "text" : "none",
                                        transition: "box-shadow 0.15s",
                                    }}
                                    onClick={() => !isEditing && setEditingId(note.id)}
                                >
                                    {/* Pin indicator */}
                                    {note.pinned && (
                                        <PushpinFilled
                                            style={{
                                                position: "absolute",
                                                top: -8,
                                                insetInlineEnd: 12,
                                                color: "#dc2626",
                                                fontSize: 16,
                                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                                            }}
                                        />
                                    )}

                                    {/* Title */}
                                    {isEditing ? (
                                        <Input dir="auto" styles={{ input: { fontSize: 16 } }}
                                            aria-label={t("Note title")} value={note.title}
                                            onChange={e => patch(note.id, { title: e.target.value })}
                                            variant="borderless"
                                            autoFocus
                                            style={{
                                                padding: "0 0 4px",
                                                fontWeight: 700,
                                                fontSize: 16,
                                                color: "#111827",
                                                borderBottom: "1px dashed rgba(0,0,0,0.25)",
                                                borderRadius: 0,
                                                marginBottom: 8,
                                                background: "transparent",
                                            }}
                                            onClick={e => e.stopPropagation()}
                                        />
                                    ) : (
                                        <Text
                                            strong
                                            style={{
                                                display: "block",
                                                fontSize: 16,
                                                color: "#111827",
                                                marginBottom: 6,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {note.title || t("Untitled")}
                                        </Text>
                                    )}

                                    {/* Content */}
                                    {isEditing ? (
                                        <TextArea dir="auto"
                                            aria-label={t("Note content")} value={note.content}
                                            onChange={e => patch(note.id, { content: e.target.value })}
                                            autoSize={{ minRows: 3, maxRows: 14 }}
                                            variant="borderless"
                                            placeholder={t("Write your note…")}
                                            style={{
                                                padding: 0,
                                                flex: 1,
                                                fontSize: 16,
                                                color: "#1f2937",
                                                background: "transparent",
                                                resize: "none",
                                            }}
                                            onClick={e => e.stopPropagation()}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                flex: 1,
                                                fontSize: 16,
                                                color: "#374151",
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 7,
                                                WebkitBoxOrient: "vertical",
                                            } as React.CSSProperties}
                                        >
                                            {note.content || (
                                                <span style={{ opacity: 0.8, fontStyle: "italic" }}>
                                                    {t("Empty note…")}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Timestamp */}
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: "#374151",
                                            marginTop: 8,
                                            textAlign: "end",
                                        }}
                                    >
                                        {new Date(note.updatedAt).toLocaleDateString(language, {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>

                                    {/* Footer toolbar */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 3,
                                            marginTop: 6,
                                            paddingTop: 8,
                                            borderTop: `1px solid ${colorInfo.border}`,
                                        }}
                                    >
                                        {/* Color swatches */}
                                        <div style={{ display: "flex", gap: 4, flex: 1, flexWrap: "wrap" }}>
                                            {NOTE_COLORS.map(c => (
                                                <Tooltip key={c.name} title={t(c.name)} mouseEnterDelay={0.6}>
                                                    <button type="button" aria-label={t("Set note color: {color}", { color: t(c.name) })} aria-pressed={note.color === c.bg}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            patch(note.id, { color: c.bg });
                                                        }}
                                                        style={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: "50%",
                                                            background: c.bg,
                                                            border: note.color === c.bg
                                                                ? "2px solid #111827"
                                                                : `1px solid ${c.border}`,
                                                            cursor: "pointer",
                                                            flexShrink: 0,
                                                            padding: 0,
                                                        }}
                                                    />
                                                </Tooltip>
                                            ))}
                                        </div>

                                        <Tooltip title={note.pinned ? t("Unpin") : t("Pin to top")}>
                                            <Button
                                                aria-label={note.pinned ? t("Unpin") : t("Pin to top")} type="text"
                                                size="small"
                                                icon={note.pinned ? <PushpinFilled /> : <PushpinOutlined />}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    patch(note.id, { pinned: !note.pinned });
                                                }}
                                                style={{ color: note.pinned ? "#dc2626" : "#6b7280" }}
                                            />
                                        </Tooltip>

                                        {isEditing && (
                                            <Tooltip title={t("Done editing")}>
                                                <Button aria-label={t("Done editing")}
                                                    type="text"
                                                    size="small"
                                                    icon={<CheckOutlined />}
                                                    onClick={e => { e.stopPropagation(); setEditingId(null); }}
                                                    style={{ color: "#16a34a" }}
                                                />
                                            </Tooltip>
                                        )}

                                        <Popconfirm
                                            title={t("Delete this note?")}
                                            description={t("This cannot be undone.")}
                                            onConfirm={() => deleteNote(note.id)}
                                            okText={t("Delete")}
                                            cancelText={t("Cancel")}
                                            okType="danger"
                                            onPopupClick={e => e.stopPropagation()}
                                        >
                                            <Tooltip title={t("Delete")}>
                                                <Button aria-label={t("Delete")}
                                                    type="text"
                                                    size="small"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                            </Tooltip>
                                        </Popconfirm>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </ToolPageLayout>
    );
}

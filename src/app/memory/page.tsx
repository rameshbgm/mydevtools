"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge, Button, Card, Collapse, Empty, Modal, Tag, Typography } from "antd";
import {
    CheckCircleOutlined,
    ClearOutlined,
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DatabaseOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    InfoCircleOutlined,
    ReloadOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

const { Title, Text, Paragraph } = Typography;

// ─── Storage catalogue ────────────────────────────────────────────────────────

interface StorageEntry {
    id: string;
    label: string;
    description: string;
    keys: string[];      // localStorage keys this entry covers
    type: "preferences" | "tool-data" | "database";
    icon: string;
    color: string;
}

const STORAGE_CATALOGUE: StorageEntry[] = [
    {
        id: "app-prefs",
        label: "App Preferences",
        description: "Your theme preference, sidebar state, and recently visited tools.",
        keys: ["devtools-hub-storage"],
        type: "preferences",
        icon: "⚙️",
        color: "#6366f1",
    },
    {
        id: "api-builder",
        label: "API Request Builder",
        description: "Saved requests, request history, and environment variables.",
        keys: ["api-builder-saved-requests", "api-builder-history", "api-builder-environments"],
        type: "tool-data",
        icon: "📡",
        color: "#10b981",
    },
    {
        id: "todo-db",
        label: "Task Manager",
        description: "To-do tasks stored in a local IndexedDB database (DevToolsTodoDB).",
        keys: [],          // IndexedDB — handled separately
        type: "database",
        icon: "✅",
        color: "#f59e0b",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function byteSize(str: string): number {
    return new TextEncoder().encode(str).length;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readLocalStorageEntries(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const out: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) out[k] = localStorage.getItem(k) ?? "";
    }
    return out;
}

async function clearIndexedDB(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase(name);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
        req.onblocked = () => reject(new Error("IndexedDB delete blocked"));
    });
}

async function indexedDBExists(name: string): Promise<boolean> {
    try {
        const dbs = await indexedDB.databases();
        return dbs.some((d) => d.name === name);
    } catch {
        return false; // Safari doesn't support databases()
    }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SizeBadge({ bytes, darkMode }: { bytes: number; darkMode: boolean }) {
    const label = formatBytes(bytes);
    const color = bytes === 0 ? (darkMode ? "#333" : "#ddd") : bytes < 5000 ? "#10b981" : bytes < 50000 ? "#f59e0b" : "#ef4444";
    return (
        <span
            style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 6,
                background: `${color}22`,
                color,
                border: `1px solid ${color}44`,
                fontVariantNumeric: "tabular-nums",
            }}
        >
            {label}
        </span>
    );
}

function DataPreviewModal({
    open,
    label,
    data,
    onClose,
    darkMode,
}: {
    open: boolean;
    label: string;
    data: string;
    onClose: () => void;
    darkMode: boolean;
}) {
    const formatted = useMemo(() => {
        try { return JSON.stringify(JSON.parse(data), null, 2); }
        catch { return data; }
    }, [data]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <EyeOutlined style={{ color: "#6366f1" }} />
                    {label}
                </span>
            }
            width={680}
        >
            <pre
                style={{
                    maxHeight: 420,
                    overflowY: "auto",
                    background: darkMode ? "#0d0d0d" : "#f9f9f9",
                    border: `1px solid ${darkMode ? "#2a2a2a" : "#e5e5e5"}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    color: darkMode ? "#a3a3a3" : "#444",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                }}
            >
                {formatted || <em>(empty)</em>}
            </pre>
        </Modal>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MemoryPage() {
    const { darkMode, clearRecentTools } = useAppStore();
    const [lsSnapshot, setLsSnapshot] = useState<Record<string, string>>({});
    const [idbEntries, setIdbEntries] = useState<Record<string, boolean>>({});
    const [preview, setPreview] = useState<{ label: string; data: string } | null>(null);
    const [cleared, setCleared] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const refresh = useCallback(async () => {
        setLsSnapshot(readLocalStorageEntries());
        const idb: Record<string, boolean> = {};
        idb["DevToolsTodoDB"] = await indexedDBExists("DevToolsTodoDB");
        setIdbEntries(idb);
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    // ── Total size across all known keys ──────────────────────────────────────
    const totalBytes = useMemo(() => {
        let sum = 0;
        for (const v of Object.values(lsSnapshot)) sum += byteSize(v);
        return sum;
    }, [lsSnapshot]);

    // ── Per-entry stats ───────────────────────────────────────────────────────
    const entryStats = useMemo(() =>
        STORAGE_CATALOGUE.map((entry) => {
            if (entry.type === "database") {
                return { ...entry, keys: [], totalBytes: 0, exists: idbEntries["DevToolsTodoDB"] ?? false };
            }
            const pairs = entry.keys.map((k) => ({ key: k, value: lsSnapshot[k] ?? "" }));
            const bytes = pairs.reduce((s, p) => s + byteSize(p.value), 0);
            return { ...entry, pairs, totalBytes: bytes, exists: pairs.some((p) => p.value !== "") };
        }),
        [lsSnapshot, idbEntries]
    );

    // ── Clear one entry ───────────────────────────────────────────────────────
    const clearEntry = useCallback(async (entry: StorageEntry) => {
        if (entry.type === "database") {
            await clearIndexedDB("DevToolsTodoDB").catch(() => {});
        } else {
            entry.keys.forEach((k) => localStorage.removeItem(k));
            if (entry.id === "app-prefs") clearRecentTools();
        }
        setCleared((prev) => [...prev, entry.id]);
        setTimeout(() => setCleared((prev) => prev.filter((id) => id !== entry.id)), 2000);
        await refresh();
    }, [clearRecentTools, refresh]);

    // ── Clear ALL ─────────────────────────────────────────────────────────────
    const clearAll = useCallback(() => {
        Modal.confirm({
            title: "Clear all stored data?",
            icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
            content: "This will permanently delete your preferences, saved API requests, history, environments, and task data. This cannot be undone.",
            okText: "Yes, clear everything",
            okButtonProps: { danger: true },
            cancelText: "Cancel",
            onOk: async () => {
                STORAGE_CATALOGUE.forEach((e) => {
                    if (e.type !== "database") e.keys.forEach((k) => localStorage.removeItem(k));
                });
                clearRecentTools();
                await clearIndexedDB("DevToolsTodoDB").catch(() => {});
                await refresh();
            },
        });
    }, [clearRecentTools, refresh]);

    // ── Export ────────────────────────────────────────────────────────────────
    const exportData = useCallback(() => {
        const payload: Record<string, unknown> = { exportedAt: new Date().toISOString() };
        STORAGE_CATALOGUE.forEach((e) => {
            if (e.type !== "database") {
                e.keys.forEach((k) => {
                    const raw = localStorage.getItem(k);
                    if (raw !== null) {
                        try { payload[k] = JSON.parse(raw); }
                        catch { payload[k] = raw; }
                    }
                });
            }
        });
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mydevtools-storage-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    // ── Import ────────────────────────────────────────────────────────────────
    const importData = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const parsed = JSON.parse(ev.target?.result as string);
                const knownKeys = STORAGE_CATALOGUE.flatMap((e) => e.keys);
                let count = 0;
                for (const [k, v] of Object.entries(parsed)) {
                    if (knownKeys.includes(k)) {
                        localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
                        count++;
                    }
                }
                refresh();
                Modal.success({
                    title: "Import successful",
                    content: `${count} storage entr${count !== 1 ? "ies" : "y"} restored.`,
                });
            } catch {
                Modal.error({ title: "Import failed", content: "The file could not be parsed. Make sure it's a valid My Dev Tools export." });
            }
        };
        reader.readAsText(file);
    }, [refresh]);

    const bg = darkMode ? "#141414" : "#ffffff";
    const border = darkMode ? "#2a2a2a" : "#e8e8e8";
    const textMuted = darkMode ? "#737373" : "#9a9a9a";
    const cardBg = darkMode ? "#1a1a1a" : "#fafafa";

    return (
        <div className="app-memory-page">
            {/* ── Header ───────────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ marginBottom: 32 }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 14,
                                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                            }}>
                                <DatabaseOutlined style={{ color: "#fff", fontSize: 22 }} />
                            </div>
                            <div>
                                <Title level={3} style={{ margin: 0, fontWeight: 700, letterSpacing: "-0.5px" }}>
                                    Memory &amp; Storage
                                </Title>
                                <Text style={{ color: textMuted, fontSize: 13 }}>
                                    Everything My Dev Tools stores on this device
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* Total usage chip */}
                    <div className="app-memory-chip">
                        <DatabaseOutlined style={{ color: "#6366f1", fontSize: 16 }} />
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{formatBytes(totalBytes)}</div>
                            <div style={{ fontSize: 11, color: textMuted }}>total stored</div>
                        </div>
                    </div>
                </div>

                {/* Action bar */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
                    <Button
                        icon={<CloudDownloadOutlined />}
                        onClick={exportData}
                        style={{ borderRadius: 9, fontWeight: 500 }}
                    >
                        Export All
                    </Button>
                    <Button
                        icon={<CloudUploadOutlined />}
                        onClick={() => fileInputRef.current?.click()}
                        style={{ borderRadius: 9, fontWeight: 500 }}
                    >
                        Import
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) { importData(f); e.target.value = ""; }
                        }}
                    />
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={refresh}
                        style={{ borderRadius: 9 }}
                    >
                        Refresh
                    </Button>
                    <Button
                        danger
                        icon={<ClearOutlined />}
                        onClick={clearAll}
                        style={{ borderRadius: 9, fontWeight: 500, marginLeft: "auto" }}
                    >
                        Clear All Data
                    </Button>
                </div>
            </motion.div>

            {/* ── Storage entries ───────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                <AnimatePresence>
                    {entryStats.map((entry, idx) => {
                        const isClearedRecently = cleared.includes(entry.id);
                        return (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: idx * 0.07 }}
                            >
                                <Card
                                    style={{
                                        borderRadius: 16,
                                        border: `1px solid ${border}`,
                                        background: bg,
                                        overflow: "hidden",
                                    }}
                                    styles={{ body: { padding: 0 } }}
                                >
                                    {/* Card header */}
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: 14,
                                        padding: "18px 20px",
                                        borderBottom: entry.type !== "database" && (entry as { pairs?: { key: string; value: string }[] }).pairs?.some(p => p.value)
                                            ? `1px solid ${darkMode ? "#1f1f1f" : "#f0f0f0"}`
                                            : "none",
                                    }}>
                                        <span style={{
                                            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                                            background: `${entry.color}20`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 20,
                                        }}>
                                            {entry.icon}
                                        </span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                                <Text strong style={{ fontSize: 14.5 }}>{entry.label}</Text>
                                                <Tag
                                                    style={{
                                                        margin: 0, fontSize: 10, fontWeight: 600,
                                                        background: `${entry.color}18`,
                                                        border: `1px solid ${entry.color}40`,
                                                        color: entry.color,
                                                        borderRadius: 5,
                                                    }}
                                                >
                                                    {entry.type === "database" ? "IndexedDB" : entry.type === "preferences" ? "Preferences" : "Tool Data"}
                                                </Tag>
                                                {"totalBytes" in entry && <SizeBadge bytes={entry.totalBytes as number} darkMode={darkMode} />}
                                            </div>
                                            <Text style={{ fontSize: 12.5, color: textMuted }}>{entry.description}</Text>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                                            <AnimatePresence>
                                                {isClearedRecently && (
                                                    <motion.span
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        style={{ color: "#10b981", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}
                                                    >
                                                        <CheckCircleOutlined /> Cleared
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                            <Button
                                                size="small"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => clearEntry(entry)}
                                                disabled={
                                                    entry.type === "database"
                                                        ? !(entry as { exists?: boolean }).exists
                                                        : !("totalBytes" in entry && (entry as { totalBytes: number }).totalBytes > 0)
                                                }
                                                style={{ borderRadius: 8 }}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Key-level rows (localStorage only) */}
                                    {entry.type !== "database" && (
                                        <div>
                                            {(entry as { pairs: { key: string; value: string }[] }).pairs?.map((pair) => {
                                                const size = byteSize(pair.value);
                                                const hasData = pair.value !== "";
                                                return (
                                                    <div
                                                        key={pair.key}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: 12,
                                                            padding: "10px 20px 10px 74px",
                                                            borderBottom: `1px solid ${darkMode ? "#1a1a1a" : "#f5f5f5"}`,
                                                            background: hasData ? "transparent" : darkMode ? "#111" : "#fefefe",
                                                            opacity: hasData ? 1 : 0.5,
                                                        }}
                                                    >
                                                        <code style={{
                                                            flex: 1, fontSize: 11.5, fontFamily: "monospace",
                                                            color: darkMode ? "#a3a3a3" : "#555",
                                                            background: darkMode ? "#1f1f1f" : "#f0f0f0",
                                                            padding: "2px 8px", borderRadius: 5,
                                                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                                            maxWidth: 280,
                                                        }}>
                                                            {pair.key}
                                                        </code>
                                                        <SizeBadge bytes={size} darkMode={darkMode} />
                                                        {hasData && (
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<EyeOutlined />}
                                                                onClick={() => setPreview({ label: pair.key, data: pair.value })}
                                                                style={{ color: textMuted, borderRadius: 7 }}
                                                            >
                                                                View
                                                            </Button>
                                                        )}
                                                        {!hasData && (
                                                            <Text style={{ fontSize: 11, color: textMuted }}>empty</Text>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* IndexedDB status row */}
                                    {entry.type === "database" && (
                                        <div style={{
                                            padding: "10px 20px 10px 74px",
                                            display: "flex", alignItems: "center", gap: 10,
                                        }}>
                                            <code style={{
                                                fontSize: 11.5, fontFamily: "monospace",
                                                color: darkMode ? "#a3a3a3" : "#555",
                                                background: darkMode ? "#1f1f1f" : "#f0f0f0",
                                                padding: "2px 8px", borderRadius: 5,
                                            }}>
                                                DevToolsTodoDB
                                            </code>
                                            {(entry as { exists?: boolean }).exists ? (
                                                <Badge color="#10b981" text={<Text style={{ fontSize: 12, color: "#10b981" }}>Exists on device</Text>} />
                                            ) : (
                                                <Text style={{ fontSize: 12, color: textMuted }}>Not created yet</Text>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {entryStats.every((e) => !("exists" in e ? e.exists : ("totalBytes" in e ? (e as { totalBytes: number }).totalBytes > 0 : false))) && (
                    <Empty
                        description={<Text style={{ color: textMuted }}>No data stored yet. Use the tools to get started.</Text>}
                        style={{ padding: "40px 0" }}
                    />
                )}
            </div>

            {/* ── Learn More ────────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Collapse
                    defaultActiveKey={[]}
                    style={{ borderRadius: 16, border: `1px solid ${border}`, background: cardBg, overflow: "hidden" }}
                    items={[
                        {
                            key: "learn-more",
                            label: (
                                <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 14 }}>
                                    <InfoCircleOutlined style={{ color: "#6366f1" }} />
                                    Learn More About Memory Management
                                </span>
                            ),
                            children: (
                                <div style={{ padding: "4px 0 8px" }}>
                                    {[
                                        {
                                            icon: <SafetyOutlined style={{ color: "#10b981", fontSize: 18 }} />,
                                            title: "Your data never leaves your device",
                                            body: "Every byte My Dev Tools stores lives exclusively in your browser — localStorage and IndexedDB are sandboxed to this origin. Nothing is sent to any server, cloud, or third party. Not even analytics.",
                                        },
                                        {
                                            icon: <DatabaseOutlined style={{ color: "#6366f1", fontSize: 18 }} />,
                                            title: "What is actually stored and why",
                                            body: "Preferences (dark mode, sidebar state, recent tools) keep the app feeling familiar on your next visit. API Request Builder saves your requests and history so you don't re-type them. The Task Manager uses IndexedDB for larger structured data.",
                                        },
                                        {
                                            icon: <ThunderboltOutlined style={{ color: "#f59e0b", fontSize: 18 }} />,
                                            title: "Export & Import for portability",
                                            body: "Export creates a dated JSON snapshot of all localStorage data. Import restores only keys My Dev Tools recognises — unknown keys are ignored. IndexedDB data (tasks) is not included in the export because it requires separate tooling.",
                                        },
                                        {
                                            icon: <DeleteOutlined style={{ color: "#ef4444", fontSize: 18 }} />,
                                            title: "Clearing storage",
                                            body: "Clearing a single entry removes only that tool's data. \"Clear All\" wipes every key, resets preferences to defaults, and deletes the task database. The app will reload its defaults on next visit. This action is permanent.",
                                        },
                                        {
                                            icon: <InfoCircleOutlined style={{ color: "#3b82f6", fontSize: 18 }} />,
                                            title: "Browser storage limits",
                                            body: "Most browsers allow 5–10 MB of localStorage per origin. IndexedDB limits are much higher (often gigabytes). My Dev Tools uses far less than 1 MB under typical usage. If storage becomes full, the app may warn you or silently skip saving.",
                                        },
                                    ].map(({ icon, title, body }) => (
                                        <div
                                            key={title}
                                            style={{
                                                display: "flex", gap: 14, padding: "14px 4px",
                                                borderBottom: `1px solid ${darkMode ? "#1f1f1f" : "#f0f0f0"}`,
                                            }}
                                        >
                                            <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
                                            <div>
                                                <Text strong style={{ display: "block", marginBottom: 4, fontSize: 13.5 }}>{title}</Text>
                                                <Paragraph style={{ margin: 0, fontSize: 13, color: textMuted, lineHeight: 1.65 }}>{body}</Paragraph>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ),
                        },
                    ]}
                />
            </motion.div>

            {/* Preview modal */}
            {preview && (
                <DataPreviewModal
                    open
                    label={preview.label}
                    data={preview.data}
                    onClose={() => setPreview(null)}
                    darkMode={darkMode}
                />
            )}
        </div>
    );
}

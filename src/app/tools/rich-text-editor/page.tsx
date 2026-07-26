"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Button,
    Tabs,
    Input,
    Tooltip,
    Select,
    Typography,
    Modal,
    Dropdown,
} from "antd";
import type { MenuProps } from "antd";
import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    MenuOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    UndoOutlined,
    RedoOutlined,
    LinkOutlined,
    DisconnectOutlined,
    MinusOutlined,
    ClearOutlined,
    CodeOutlined,
    DownloadOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FormOutlined,
    FileTextOutlined,
    FontColorsOutlined,
    BgColorsOutlined,
    EditOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { downloadText } from "@/lib/download";

const { Text } = Typography;

const STORAGE_KEY = "wb-rich-text-docs-v1";

interface RichDoc {
    id: string;
    title: string;
    content: string;
    createdAt: number;
    updatedAt: number;
}

function uid() {
    return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function loadDocs(): RichDoc[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
}

function saveDocs(docs: RichDoc[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

function defaultDoc(title = "Untitled Document"): RichDoc {
    return {
        id: uid(),
        title,
        content: "<p><br></p>",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
}

const BLOCK_FORMATS = [
    { value: "p", label: "Normal" },
    { value: "h1", label: "Heading 1" },
    { value: "h2", label: "Heading 2" },
    { value: "h3", label: "Heading 3" },
    { value: "h4", label: "Heading 4" },
    { value: "blockquote", label: "Blockquote" },
    { value: "pre", label: "Code Block" },
];

const FONT_SIZES = [
    { value: "1", label: "8 pt" },
    { value: "2", label: "10 pt" },
    { value: "3", label: "12 pt" },
    { value: "4", label: "14 pt" },
    { value: "5", label: "18 pt" },
    { value: "6", label: "24 pt" },
    { value: "7", label: "36 pt" },
];

export default function RichTextEditorPage() {
    const [docs, setDocs] = useState<RichDoc[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const [sourceView, setSourceView] = useState(false);
    const [renaming, setRenaming] = useState<string | null>(null);
    const [renameVal, setRenameVal] = useState("");
    const [linkOpen, setLinkOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const editorRef = useRef<HTMLDivElement>(null);
    const savedRangeRef = useRef<Range | null>(null);

    useEffect(() => {
        const stored = loadDocs();
        if (stored.length) {
            setDocs(stored);
            setActiveId(stored[0].id);
        } else {
            const d = defaultDoc();
            setDocs([d]);
            setActiveId(d.id);
            saveDocs([d]);
        }
    }, []);

    // Persist the editor's selection whenever it changes — toolbar buttons restore from here
    useEffect(() => {
        const handler = () => {
            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0) return;
            const range = sel.getRangeAt(0);
            if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
                savedRangeRef.current = range.cloneRange();
            }
        };
        document.addEventListener("selectionchange", handler);
        return () => document.removeEventListener("selectionchange", handler);
    }, []);

    const activeDoc = docs.find(d => d.id === activeId);

    const updateDoc = useCallback((id: string, patch: Partial<RichDoc>) => {
        setDocs(prev => {
            const updated = prev.map(d =>
                d.id === id ? { ...d, ...patch, updatedAt: Date.now() } : d
            );
            saveDocs(updated);
            return updated;
        });
    }, []);

    const flush = useCallback(() => {
        if (!editorRef.current || !activeId || sourceView) return;
        updateDoc(activeId, { content: editorRef.current.innerHTML });
    }, [activeId, sourceView, updateDoc]);

    useEffect(() => {
        if (sourceView || !editorRef.current || !activeDoc) return;
        if (editorRef.current.innerHTML !== activeDoc.content) {
            editorRef.current.innerHTML = activeDoc.content;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId, sourceView]);

    const wordCount = (activeDoc?.content ?? "")
        .replace(/<[^>]*>/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
    const charCount = (activeDoc?.content ?? "").replace(/<[^>]*>/g, "").length;

    const restoreSelection = () => {
        if (!editorRef.current) return;
        editorRef.current.focus();
        if (!savedRangeRef.current) return;
        const sel = window.getSelection();
        if (!sel) return;
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
    };

    const exec = useCallback((cmd: string, val?: string) => {
        if (!editorRef.current) return;
        restoreSelection();
        if (["foreColor", "hiliteColor", "backColor"].includes(cmd)) {
            document.execCommand("styleWithCSS", false, "true");
        }
        document.execCommand(cmd, false, val);
        flush();
    }, [flush]);

    const insertLink = () => {
        if (linkUrl) {
            const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
            exec("createLink", url);
        }
        setLinkOpen(false);
        setLinkUrl("");
    };

    const addDoc = () => {
        const d = defaultDoc();
        setDocs(prev => {
            const updated = [...prev, d];
            saveDocs(updated);
            return updated;
        });
        setActiveId(d.id);
        setSourceView(false);
    };

    const removeDoc = (id: string) => {
        setDocs(prev => {
            const updated = prev.filter(d => d.id !== id);
            if (!updated.length) {
                const fresh = defaultDoc();
                saveDocs([fresh]);
                setActiveId(fresh.id);
                return [fresh];
            }
            saveDocs(updated);
            if (activeId === id) setActiveId(updated[updated.length - 1].id);
            return updated;
        });
    };

    const exportDoc = (type: "html" | "txt") => {
        if (!activeDoc) return;
        const content =
            type === "html"
                ? `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${activeDoc.title}</title></head><body>${activeDoc.content}</body></html>`
                : activeDoc.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        downloadText(content, `${activeDoc.title}.${type === "html" ? "html" : "txt"}`, type === "html" ? "text/html" : "text/plain");
    };

    const exportMenu: MenuProps = {
        items: [
            { key: "html", label: "Export as HTML", icon: <CodeOutlined /> },
            { key: "txt", label: "Export as Plain Text", icon: <FileTextOutlined /> },
        ],
        onClick: ({ key }) => exportDoc(key as "html" | "txt"),
    };

    const startRename = (id: string, title: string) => {
        setRenaming(id);
        setRenameVal(title);
    };

    const confirmRename = () => {
        if (renaming && renameVal.trim()) updateDoc(renaming, { title: renameVal.trim() });
        setRenaming(null);
    };

    const tabItems = docs.map(doc => {
        const isActive = doc.id === activeId;
        const isRenaming = renaming === doc.id;
        return {
            key: doc.id,
            closable: docs.length > 1,
            label: isRenaming ? (
                <Input
                    size="small"
                    value={renameVal}
                    onChange={e => setRenameVal(e.target.value)}
                    onBlur={confirmRename}
                    onPressEnter={confirmRename}
                    onKeyDown={e => { if (e.key === "Escape") setRenaming(null); }}
                    style={{ width: 160, fontSize: 12 }}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                />
            ) : (
                <span
                    onClick={e => {
                        // Click on the already-active tab → enter inline rename
                        if (isActive) {
                            e.stopPropagation();
                            startRename(doc.id, doc.title);
                        }
                    }}
                    onDoubleClick={e => {
                        e.stopPropagation();
                        startRename(doc.id, doc.title);
                    }}
                    title={isActive ? "Click to rename" : doc.title}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                    <FileTextOutlined style={{ fontSize: 11, opacity: 0.65 }} />
                    <span>{doc.title}</span>
                    {isActive && (
                        <EditOutlined
                            style={{ fontSize: 10, opacity: 0.5, marginLeft: 2 }}
                        />
                    )}
                </span>
            ),
        };
    });

    // Toolbar button helper
    const TB = ({ tip, cmd, val, children }: {
        tip: string; cmd: string; val?: string; children: React.ReactNode;
    }) => (
        <Tooltip title={tip}>
            <Button
                size="small"
                type="text"
                disabled={sourceView}
                icon={children}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => exec(cmd, val)}
                style={{ width: 32, height: 32, borderRadius: 6 }}
            />
        </Tooltip>
    );

    const VDivider = () => (
        <span
            aria-hidden
            style={{
                display: "inline-block",
                width: 1,
                height: 22,
                background: "var(--wb-card-border)",
                margin: "0 6px",
                alignSelf: "center",
                flexShrink: 0,
            }}
        />
    );

    return (
        <ToolPageLayout
            title="Rich Text Editor"
            description="WYSIWYG document editor with full formatting, multiple documents, local save, and HTML export — all in your browser."
            icon={<FormOutlined />}
            color="#0891b2"
            learnMore={{
                whatIs: "A full-featured WYSIWYG (What You See Is What You Get) rich text editor. Multiple documents, full formatting toolbar, raw HTML source view, and export — all stored locally.",
                whyUse: "Draft API documentation, write formatted notes, or author HTML content without any sign-in or cloud service.",
                howToUse: [
                    "Use the toolbar to format selected text: headings, bold, italic, lists, links, colors, and more.",
                    "Click the '+' at the end of the tab bar to open a new document.",
                    "Click the active tab title (or double-click any tab) to rename inline.",
                    "Toggle 'Source' to inspect or paste raw HTML directly.",
                    "Click 'Export' to download as an HTML file or plain text.",
                ],
                tips: [
                    "Documents auto-save on every keystroke — no save button needed.",
                    "Ctrl+B / Cmd+B = Bold · Ctrl+I = Italic · Ctrl+Z = Undo.",
                    "Use Export → HTML to get clean, embeddable HTML markup.",
                    "Source view lets you clean up or paste HTML from external sources.",
                ],
            }}
        >
            {/* Editor shell — single elevated card */}
            <div
                style={{
                    background: "var(--wb-card-solid-bg)",
                    border: "1px solid var(--wb-card-border)",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
                }}
            >
                {/* Document tabs */}
                <div style={{ padding: "10px 12px 0", background: "var(--wb-card-solid-bg)" }}>
                    <Tabs
                        type="editable-card"
                        size="small"
                        activeKey={activeId}
                        onChange={key => { flush(); setActiveId(key); setSourceView(false); }}
                        onEdit={(key, action) => {
                            if (action === "add") addDoc();
                            if (action === "remove") removeDoc(key as string);
                        }}
                        items={tabItems}
                        style={{ marginBottom: 0 }}
                    />
                </div>

                {/* Toolbar */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        padding: "10px 14px",
                        background: "var(--wb-card-solid-bg)",
                        borderTop: "1px solid var(--wb-card-border)",
                        borderBottom: "1px solid var(--wb-card-border)",
                        alignItems: "center",
                    }}
                >
                    <Select
                        size="small"
                        style={{ width: 132 }}
                        defaultValue="p"
                        options={BLOCK_FORMATS}
                        disabled={sourceView}
                        onChange={v => exec("formatBlock", v)}
                        popupMatchSelectWidth={false}
                    />
                    <span style={{ width: 6 }} />
                    <Select
                        size="small"
                        style={{ width: 80 }}
                        defaultValue="4"
                        options={FONT_SIZES}
                        disabled={sourceView}
                        onChange={v => exec("fontSize", v)}
                        popupMatchSelectWidth={false}
                    />

                    <VDivider />

                    <TB tip="Bold (Ctrl+B)" cmd="bold"><BoldOutlined /></TB>
                    <TB tip="Italic (Ctrl+I)" cmd="italic"><ItalicOutlined /></TB>
                    <TB tip="Underline (Ctrl+U)" cmd="underline"><UnderlineOutlined /></TB>
                    <TB tip="Strikethrough" cmd="strikeThrough"><StrikethroughOutlined /></TB>

                    <Tooltip title="Text Color">
                        <Button
                            size="small"
                            type="text"
                            disabled={sourceView}
                            style={{ width: 32, height: 32, position: "relative", overflow: "hidden", borderRadius: 6 }}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <FontColorsOutlined />
                            <input
                                type="color"
                                aria-label="Text color"
                                title="Text color"
                                disabled={sourceView}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    opacity: 0,
                                    width: "100%",
                                    height: "100%",
                                    cursor: "pointer",
                                }}
                                onInput={e => exec("foreColor", (e.target as HTMLInputElement).value)}
                            />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Highlight Color">
                        <Button
                            size="small"
                            type="text"
                            disabled={sourceView}
                            style={{ width: 32, height: 32, position: "relative", overflow: "hidden", borderRadius: 6 }}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <BgColorsOutlined />
                            <input
                                type="color"
                                aria-label="Highlight color"
                                title="Highlight color"
                                defaultValue="#ffff00"
                                disabled={sourceView}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    opacity: 0,
                                    width: "100%",
                                    height: "100%",
                                    cursor: "pointer",
                                }}
                                onInput={e => exec("hiliteColor", (e.target as HTMLInputElement).value)}
                            />
                        </Button>
                    </Tooltip>

                    <VDivider />

                    <TB tip="Align Left" cmd="justifyLeft"><AlignLeftOutlined /></TB>
                    <TB tip="Align Center" cmd="justifyCenter"><AlignCenterOutlined /></TB>
                    <TB tip="Align Right" cmd="justifyRight"><AlignRightOutlined /></TB>
                    <TB tip="Justify" cmd="justifyFull"><MenuOutlined /></TB>

                    <VDivider />

                    <TB tip="Ordered List" cmd="insertOrderedList"><OrderedListOutlined /></TB>
                    <TB tip="Unordered List" cmd="insertUnorderedList"><UnorderedListOutlined /></TB>
                    <TB tip="Indent" cmd="indent"><MenuFoldOutlined /></TB>
                    <TB tip="Outdent" cmd="outdent"><MenuUnfoldOutlined /></TB>

                    <VDivider />

                    <Tooltip title="Insert Link">
                        <Button aria-label="Link"
                            size="small"
                            type="text"
                            icon={<LinkOutlined />}
                            disabled={sourceView}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setLinkOpen(true)}
                            style={{ width: 32, height: 32, borderRadius: 6 }}
                        />
                    </Tooltip>
                    <TB tip="Remove Link" cmd="unlink"><DisconnectOutlined /></TB>
                    <TB tip="Horizontal Rule" cmd="insertHorizontalRule"><MinusOutlined /></TB>

                    <VDivider />

                    <TB tip="Undo (Ctrl+Z)" cmd="undo"><UndoOutlined /></TB>
                    <TB tip="Redo (Ctrl+Y)" cmd="redo"><RedoOutlined /></TB>
                    <TB tip="Clear Formatting" cmd="removeFormat"><ClearOutlined /></TB>

                    <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                        <Tooltip title={sourceView ? "Back to WYSIWYG" : "View / edit raw HTML"}>
                            <Button
                                size="small"
                                icon={<CodeOutlined />}
                                type={sourceView ? "primary" : "default"}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { if (!sourceView) flush(); setSourceView(v => !v); }}
                            >
                                Source
                            </Button>
                        </Tooltip>
                        <Dropdown menu={exportMenu}>
                            <Button
                                size="small"
                                icon={<DownloadOutlined />}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                Export
                            </Button>
                        </Dropdown>
                    </div>
                </div>

                {/* Document canvas */}
                <div
                    style={{
                        background: "var(--wb-content-bg)",
                        padding: "28px 16px",
                    }}
                >
                    {sourceView ? (
                        <Input.TextArea
                            value={activeDoc?.content ?? ""}
                            onChange={e => activeDoc && updateDoc(activeDoc.id, { content: e.target.value })}
                            style={{
                                fontFamily: "var(--font-geist-mono), monospace",
                                fontSize: 13,
                                background: "var(--wb-card-solid-bg)",
                                color: "var(--wb-text-body)",
                                border: "1px solid var(--wb-card-border)",
                                borderRadius: 10,
                                maxWidth: 920,
                                margin: "0 auto",
                                display: "block",
                            }}
                            autoSize={{ minRows: 22 }}
                        />
                    ) : (
                        <div
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            spellCheck
                            onInput={flush}
                            onBlur={flush}
                            className="rte-canvas"
                            style={{
                                minHeight: 560,
                                padding: "56px 72px",
                                outline: "none",
                                background: "var(--wb-card-solid-bg)",
                                color: "var(--wb-text-body)",
                                fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
                                fontSize: 15,
                                lineHeight: 1.75,
                                maxWidth: 920,
                                margin: "0 auto",
                                borderRadius: 10,
                                border: "1px solid var(--wb-card-border)",
                                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
                            }}
                        />
                    )}
                </div>

                {/* Status bar */}
                <div
                    style={{
                        display: "flex",
                        gap: 18,
                        padding: "8px 18px",
                        background: "var(--wb-card-solid-bg)",
                        borderTop: "1px solid var(--wb-card-border)",
                        fontSize: 12,
                        color: "var(--wb-text-muted)",
                        userSelect: "none",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 12, color: "var(--wb-text-muted)" }}>
                        Words <span style={{ color: "var(--wb-text-body)", fontWeight: 600 }}>{wordCount}</span>
                    </Text>
                    <Text style={{ fontSize: 12, color: "var(--wb-text-muted)" }}>
                        Characters <span style={{ color: "var(--wb-text-body)", fontWeight: 600 }}>{charCount}</span>
                    </Text>
                    {activeDoc && (
                        <Text
                            style={{
                                fontSize: 12,
                                marginLeft: "auto",
                                color: "var(--wb-text-muted)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    background: "var(--wb-accent)",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                }}
                            />
                            Auto-saved · {new Date(activeDoc.updatedAt).toLocaleTimeString()}
                        </Text>
                    )}
                </div>
            </div>

            {/* Editor content styling — applies inside the contentEditable div */}
            <style jsx global>{`
                .rte-canvas h1 { font-size: 2rem; font-weight: 700; margin: 1.2em 0 0.6em; color: var(--wb-text-heading); line-height: 1.25; }
                .rte-canvas h2 { font-size: 1.6rem; font-weight: 700; margin: 1.1em 0 0.5em; color: var(--wb-text-heading); line-height: 1.3; }
                .rte-canvas h3 { font-size: 1.3rem; font-weight: 600; margin: 1em 0 0.5em; color: var(--wb-text-heading); }
                .rte-canvas h4 { font-size: 1.1rem; font-weight: 600; margin: 1em 0 0.4em; color: var(--wb-text-heading); }
                .rte-canvas p { margin: 0 0 0.8em; }
                .rte-canvas blockquote {
                    margin: 1em 0; padding: 0.5em 1em;
                    border-left: 3px solid var(--wb-accent);
                    color: var(--wb-text-muted); font-style: italic;
                    background: var(--wb-accent-soft); border-radius: 4px;
                }
                .rte-canvas pre {
                    margin: 1em 0; padding: 12px 14px;
                    background: var(--wb-content-bg);
                    border: 1px solid var(--wb-card-border);
                    border-radius: 6px;
                    font-family: var(--font-geist-mono), monospace;
                    font-size: 13px; line-height: 1.5;
                    overflow-x: auto;
                }
                .rte-canvas a { color: var(--wb-accent); text-decoration: underline; }
                .rte-canvas ul, .rte-canvas ol { margin: 0.6em 0 0.8em; padding-left: 1.6em; }
                .rte-canvas li { margin: 0.25em 0; }
                .rte-canvas hr { border: none; border-top: 1px solid var(--wb-card-border); margin: 1.5em 0; }
                .rte-canvas:focus { outline: none; }
            `}</style>

            {/* Insert link modal */}
            <Modal
                title="Insert Link"
                open={linkOpen}
                onOk={insertLink}
                onCancel={() => { setLinkOpen(false); setLinkUrl(""); }}
                okText="Insert"
                destroyOnHidden
            >
                <Input
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    onPressEnter={insertLink}
                    autoFocus
                    style={{ marginTop: 8 }}
                />
            </Modal>
        </ToolPageLayout>
    );
}

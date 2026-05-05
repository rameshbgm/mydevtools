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
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

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
        content: "<p>Start typing here…</p>",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
}

const BLOCK_FORMATS = [
    { value: "p",          label: "Normal"      },
    { value: "h1",         label: "Heading 1"   },
    { value: "h2",         label: "Heading 2"   },
    { value: "h3",         label: "Heading 3"   },
    { value: "h4",         label: "Heading 4"   },
    { value: "blockquote", label: "Blockquote"  },
    { value: "pre",        label: "Code Block"  },
];

const FONT_SIZES = [
    { value: "1", label: "8pt"  },
    { value: "2", label: "10pt" },
    { value: "3", label: "12pt" },
    { value: "4", label: "14pt" },
    { value: "5", label: "18pt" },
    { value: "6", label: "24pt" },
    { value: "7", label: "36pt" },
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

    // Flush contentEditable HTML to state
    const flush = useCallback(() => {
        if (!editorRef.current || !activeId || sourceView) return;
        updateDoc(activeId, { content: editorRef.current.innerHTML });
    }, [activeId, sourceView, updateDoc]);

    // Sync editor when switching document or toggling source view
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

    const exec = useCallback((cmd: string, val?: string) => {
        if (!editorRef.current) return;
        editorRef.current.focus();
        if (["foreColor", "hiliteColor", "backColor"].includes(cmd)) {
            document.execCommand("styleWithCSS", false, "true");
        }
        document.execCommand(cmd, false, val);
        flush();
    }, [flush]);

    const saveRange = () => {
        const sel = window.getSelection();
        if (sel?.rangeCount) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    };

    const insertLink = () => {
        if (savedRangeRef.current) {
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(savedRangeRef.current);
        }
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
        const blob = new Blob([content], { type: type === "html" ? "text/html" : "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement("a"), {
            href: url,
            download: `${activeDoc.title}.${type === "html" ? "html" : "txt"}`,
        });
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const exportMenu: MenuProps = {
        items: [
            { key: "html", label: "Export as HTML",       icon: <CodeOutlined />     },
            { key: "txt",  label: "Export as Plain Text", icon: <FileTextOutlined /> },
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

    const tabItems = docs.map(doc => ({
        key: doc.id,
        closable: docs.length > 1,
        label:
            renaming === doc.id ? (
                <Input
                    size="small"
                    value={renameVal}
                    onChange={e => setRenameVal(e.target.value)}
                    onBlur={confirmRename}
                    onPressEnter={confirmRename}
                    style={{ width: 120, fontSize: 12 }}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                />
            ) : (
                <span
                    onDoubleClick={e => { e.stopPropagation(); startRename(doc.id, doc.title); }}
                    title="Double-click to rename"
                >
                    {doc.title}
                </span>
            ),
    }));

    // Small toolbar button helper
    const TB = ({
        tip,
        cmd,
        val,
        children,
    }: {
        tip: string;
        cmd: string;
        val?: string;
        children: React.ReactNode;
    }) => (
        <Tooltip title={tip}>
            <Button
                size="small"
                disabled={sourceView}
                icon={children}
                onClick={() => exec(cmd, val)}
            />
        </Tooltip>
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
                    "Double-click a tab title to rename the document.",
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
            {/* Document tabs */}
            <Tabs
                type="editable-card"
                activeKey={activeId}
                onChange={key => { flush(); setActiveId(key); setSourceView(false); }}
                onEdit={(key, action) => {
                    if (action === "add") addDoc();
                    if (action === "remove") removeDoc(key as string);
                }}
                items={tabItems}
                style={{ marginBottom: 0 }}
            />

            {/* Toolbar */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    padding: "8px 10px",
                    background: "var(--wb-surface-2)",
                    borderLeft: "1px solid var(--wb-border)",
                    borderRight: "1px solid var(--wb-border)",
                    alignItems: "center",
                    minHeight: 44,
                }}
            >
                {/* Block format */}
                <Select
                    size="small"
                    style={{ width: 128 }}
                    defaultValue="p"
                    options={BLOCK_FORMATS}
                    disabled={sourceView}
                    onChange={v => exec("formatBlock", v)}
                    popupMatchSelectWidth={false}
                />

                {/* Font size */}
                <Select
                    size="small"
                    style={{ width: 88 }}
                    defaultValue="4"
                    options={FONT_SIZES}
                    disabled={sourceView}
                    onChange={v => exec("fontSize", v)}
                    popupMatchSelectWidth={false}
                />

                <span aria-hidden style={{ display: "inline-block", width: 1, height: 20, background: "var(--wb-border)", margin: "0 4px", alignSelf: "center", flexShrink: 0 }} />

                {/* Text style */}
                <TB tip="Bold (Ctrl+B)"       cmd="bold">          <BoldOutlined />          </TB>
                <TB tip="Italic (Ctrl+I)"     cmd="italic">        <ItalicOutlined />        </TB>
                <TB tip="Underline (Ctrl+U)"  cmd="underline">     <UnderlineOutlined />     </TB>
                <TB tip="Strikethrough"       cmd="strikeThrough"> <StrikethroughOutlined /> </TB>

                {/* Text color — native color picker hidden inside button */}
                <Tooltip title="Text Color">
                    <Button
                        size="small"
                        disabled={sourceView}
                        style={{ position: "relative", overflow: "hidden" }}
                    >
                        <FontColorsOutlined />
                        <input
                            type="color"
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

                {/* Highlight color */}
                <Tooltip title="Highlight Color">
                    <Button
                        size="small"
                        disabled={sourceView}
                        style={{ position: "relative", overflow: "hidden" }}
                    >
                        <BgColorsOutlined />
                        <input
                            type="color"
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

                <span aria-hidden style={{ display: "inline-block", width: 1, height: 20, background: "var(--wb-border)", margin: "0 4px", alignSelf: "center", flexShrink: 0 }} />

                {/* Alignment */}
                <TB tip="Align Left"   cmd="justifyLeft">   <AlignLeftOutlined />   </TB>
                <TB tip="Align Center" cmd="justifyCenter"> <AlignCenterOutlined /> </TB>
                <TB tip="Align Right"  cmd="justifyRight">  <AlignRightOutlined />  </TB>
                <TB tip="Justify"      cmd="justifyFull">   <MenuOutlined />        </TB>

                <span aria-hidden style={{ display: "inline-block", width: 1, height: 20, background: "var(--wb-border)", margin: "0 4px", alignSelf: "center", flexShrink: 0 }} />

                {/* Lists & indent */}
                <TB tip="Ordered List"   cmd="insertOrderedList">   <OrderedListOutlined />   </TB>
                <TB tip="Unordered List" cmd="insertUnorderedList"> <UnorderedListOutlined /> </TB>
                <TB tip="Indent"         cmd="indent">              <MenuFoldOutlined />      </TB>
                <TB tip="Outdent"        cmd="outdent">             <MenuUnfoldOutlined />    </TB>

                <span aria-hidden style={{ display: "inline-block", width: 1, height: 20, background: "var(--wb-border)", margin: "0 4px", alignSelf: "center", flexShrink: 0 }} />

                {/* Link / HR */}
                <Tooltip title="Insert Link">
                    <Button
                        size="small"
                        icon={<LinkOutlined />}
                        disabled={sourceView}
                        onClick={() => { saveRange(); setLinkOpen(true); }}
                    />
                </Tooltip>
                <TB tip="Remove Link"     cmd="unlink">               <LinkOutlined />  </TB>
                <TB tip="Horizontal Rule" cmd="insertHorizontalRule"> <MinusOutlined /> </TB>

                <span aria-hidden style={{ display: "inline-block", width: 1, height: 20, background: "var(--wb-border)", margin: "0 4px", alignSelf: "center", flexShrink: 0 }} />

                {/* History */}
                <TB tip="Undo (Ctrl+Z)" cmd="undo"> <UndoOutlined /> </TB>
                <TB tip="Redo (Ctrl+Y)" cmd="redo"> <RedoOutlined /> </TB>
                <TB tip="Clear Formatting" cmd="removeFormat"> <ClearOutlined /> </TB>

                {/* Source + Export pushed right */}
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                    <Tooltip title={sourceView ? "Back to WYSIWYG" : "View / edit raw HTML"}>
                        <Button
                            size="small"
                            icon={<CodeOutlined />}
                            type={sourceView ? "primary" : "default"}
                            onClick={() => { if (!sourceView) flush(); setSourceView(v => !v); }}
                        >
                            Source
                        </Button>
                    </Tooltip>
                    <Dropdown menu={exportMenu}>
                        <Button size="small" icon={<DownloadOutlined />}>
                            Export
                        </Button>
                    </Dropdown>
                </div>
            </div>

            {/* Editor / source area */}
            <div
                style={{
                    border: "1px solid var(--wb-border)",
                    borderTop: "none",
                    borderRadius: "0 0 8px 8px",
                    overflow: "hidden",
                }}
            >
                {sourceView ? (
                    <Input.TextArea
                        value={activeDoc?.content ?? ""}
                        onChange={e => activeDoc && updateDoc(activeDoc.id, { content: e.target.value })}
                        style={{
                            fontFamily: "var(--font-mono, monospace)",
                            fontSize: 13,
                            borderRadius: 0,
                            resize: "vertical",
                            background: "var(--wb-surface-1)",
                            color: "var(--wb-text-body)",
                        }}
                        autoSize={{ minRows: 22 }}
                    />
                ) : (
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={flush}
                        onBlur={flush}
                        style={{
                            minHeight: 480,
                            padding: "20px 28px",
                            outline: "none",
                            background: "var(--wb-surface-1)",
                            color: "var(--wb-text-body)",
                            fontSize: 15,
                            lineHeight: 1.75,
                        }}
                    />
                )}

                {/* Status bar */}
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        padding: "5px 16px",
                        background: "var(--wb-surface-2)",
                        borderTop: "1px solid var(--wb-border)",
                        fontSize: 12,
                        color: "var(--wb-text-secondary, #8c8c8c)",
                        userSelect: "none",
                    }}
                >
                    <Text style={{ fontSize: 12 }}>Words: {wordCount}</Text>
                    <Text style={{ fontSize: 12 }}>Characters: {charCount}</Text>
                    {activeDoc && (
                        <Text style={{ fontSize: 12, marginLeft: "auto" }}>
                            Auto-saved · {new Date(activeDoc.updatedAt).toLocaleTimeString()}
                        </Text>
                    )}
                </div>
            </div>

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

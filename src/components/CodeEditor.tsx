"use client";

import { useLanguage } from "./LanguageProvider";
import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { loader, type BeforeMount } from "@monaco-editor/react";
import { SIGNAL_PALETTES } from "@/lib/signal-theme";
import { useAppStore } from "@/lib/store";
import { Spin, Button, Tooltip } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";

// Self-host Monaco editor — by default @monaco-editor/react loads core from
// cdn.jsdelivr.net which leaks user IP/UA on every tool open. We ship the
// monaco-editor/min/vs directory in /public/monaco/vs so everything stays
// in-browser and offline-friendly.
if (typeof window !== "undefined") {
    loader.config({ paths: { vs: "/monaco/vs" } });
}

const registerSignalEditorThemes: BeforeMount = (monaco) => {
    for (const [mode, p] of Object.entries(SIGNAL_PALETTES)) {
        const dark = mode === "dark";
        monaco.editor.defineTheme(`signal-${mode}`, {
            base: dark ? "vs-dark" : "vs", inherit: true,
            rules: [
                { token: "string", foreground: dark ? "A8D6B5" : "397546" },
                { token: "string.key.json", foreground: dark ? "A8C6FF" : "2E5BB7" },
                { token: "number", foreground: dark ? "F5BA8F" : "A04B1A" },
                { token: "keyword", foreground: p.accent.slice(1) },
                { token: "comment", foreground: p.secondary.slice(1) },
            ],
            colors: {
                "focusBorder": p.controlBorder,
                "input.border": p.controlBorder, "inputOption.activeBorder": p.controlBorder, "inputOption.activeBackground": p.inset,
                "list.focusOutline": p.controlBorder, "list.focusBackground": p.inset, "list.focusForeground": p.text,
                "list.activeSelectionBackground": p.inset, "list.activeSelectionForeground": p.text,
                "editor.background": p.surface, "editor.foreground": p.text, "editorGutter.background": p.surface,
                "editorLineNumber.foreground": p.secondary, "editorLineNumber.activeForeground": p.accent,
                "editor.selectionBackground": dark ? "#33465E" : "#D7E0EB", "editor.inactiveSelectionBackground": p.inset,
                "editorCursor.foreground": p.text, "editor.lineHighlightBackground": p.inset,
                "editorWidget.background": p.inset, "editorWidget.border": p.border,
                "editorSuggestWidget.background": p.surface, "editorSuggestWidget.border": p.border,
                "editorSuggestWidget.foreground": p.text, "editorSuggestWidget.selectedBackground": p.selected,
                "editorHoverWidget.background": p.surface, "editorHoverWidget.foreground": p.text,
                "editorHoverWidget.border": p.border, "editorIndentGuide.background1": p.border,
                "scrollbarSlider.background": dark ? "#33465E80" : "#C9D5E280",
            },
        });
    }
};

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, [breakpoint]);
    return isMobile;
}

// Lazy load Monaco Editor for better performance
const Editor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
    ssr: false,
    loading: () => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200 }}>
            <Spin />
        </div>
    ),
});

const DiffEditorComponent = dynamic(() => import("@monaco-editor/react").then((m) => m.DiffEditor), {
    ssr: false,
    loading: () => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200 }}>
            <Spin />
        </div>
    ),
});

interface CodeEditorProps {
    value: string;
    onChange?: (value: string) => void;
    language?: string;
    height?: string | number;
    readOnly?: boolean;
    showCopy?: boolean;
    copyLabel?: string;
    ariaLabel?: string;
}

export function CodeEditor({
    value,
    onChange,
    language = "json",
    height = "400px",
    readOnly = false,
    showCopy = true,
    copyLabel,
    ariaLabel,
}: CodeEditorProps) {
    const { t } = useLanguage();
    const { darkMode } = useAppStore();
    const isMobile = useIsMobile();
    const [copied, setCopied] = useState(false);

    const responsiveHeight = isMobile
        ? typeof height === "number"
            ? Math.min(height, 320)
            : "300px"
        : height;

    const handleCopy = useCallback(() => {
        copyToClipboard(value, copyLabel);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [value, copyLabel]);

    return (
        <div dir="ltr" className="signal-code-editor" style={{ position: "relative" }}>
            {showCopy && value && (
                <Tooltip title={copied ? t("Copied!") : t("Copy to clipboard")}>
                    <Button
                        size="small"
                        type={copied ? "primary" : "text"}
                        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                        aria-label={t("Copy to clipboard")}
                        onClick={handleCopy}
                        style={{
                            position: "absolute",
                            top: 8,
                            right: 24,
                            zIndex: 10,
                            opacity: copied ? 1 : 0.7,
                            transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = copied ? "1" : "0.7")}
                    />
                </Tooltip>
            )}
            <Editor
                height={responsiveHeight}
                language={language}
                beforeMount={registerSignalEditorThemes}
                theme={darkMode ? "signal-dark" : "signal-light"}
                value={value}
                onChange={(v) => onChange?.(v ?? "")}
                loading={<Spin />}
                options={{
                    ariaLabel: ariaLabel ?? t("Code editor"),
                    minimap: { enabled: false },
                    fontSize: 12,
                    fontFamily: "var(--font-geist-mono), monospace",
                    lineHeight: 23,
                    lineNumbers: isMobile ? "off" : "on",
                    wordWrap: "on",
                    readOnly,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12 },
                    roundedSelection: true,
                    renderLineHighlight: "gutter",
                    folding: !isMobile,
                    glyphMargin: false,
                    lineDecorationsWidth: isMobile ? 4 : 10,
                    lineNumbersMinChars: isMobile ? 0 : 3,
                }}
            />
        </div>
    );
}

interface CodeDiffProps {
    original: string;
    modified: string;
    language?: string;
    height?: string | number;
    showCopy?: boolean;
}

export function CodeDiff({
    original,
    modified,
    language = "json",
    height = "500px",
    showCopy = true,
}: CodeDiffProps) {
    const { t } = useLanguage();
    const { darkMode } = useAppStore();
    const isMobile = useIsMobile();
    const [copiedOrig, setCopiedOrig] = useState(false);
    const [copiedMod, setCopiedMod] = useState(false);

    const responsiveHeight = isMobile
        ? typeof height === "number"
            ? Math.min(height, 360)
            : "360px"
        : height;

    const handleCopyOrig = useCallback(() => {
        copyToClipboard(original, t("Original copied!"));
        setCopiedOrig(true);
        setTimeout(() => setCopiedOrig(false), 2000);
    }, [original, t]);

    const handleCopyMod = useCallback(() => {
        copyToClipboard(modified, t("Modified copied!"));
        setCopiedMod(true);
        setTimeout(() => setCopiedMod(false), 2000);
    }, [modified, t]);

    return (
        <div dir="ltr" className="signal-code-editor" style={{ position: "relative" }}>
            {showCopy && (
                <div style={{ position: "absolute", top: 8, right: 24, zIndex: 10, display: "flex", gap: 4 }}>
                    <Tooltip title={copiedOrig ? t("Copied!") : t("Copy original")}>
                        <Button
                            size="small"
                            type={copiedOrig ? "primary" : "text"}
                            icon={copiedOrig ? <CheckOutlined /> : <CopyOutlined />}
                            onClick={handleCopyOrig}
                            style={{ opacity: copiedOrig ? 1 : 0.7 }}
                        >
                            {t("Left")}
                        </Button>
                    </Tooltip>
                    <Tooltip title={copiedMod ? t("Copied!") : t("Copy modified")}>
                        <Button
                            size="small"
                            type={copiedMod ? "primary" : "text"}
                            icon={copiedMod ? <CheckOutlined /> : <CopyOutlined />}
                            onClick={handleCopyMod}
                            style={{ opacity: copiedMod ? 1 : 0.7 }}
                        >
                            {t("Right")}
                        </Button>
                    </Tooltip>
                </div>
            )}
            <DiffEditorComponent
                height={responsiveHeight}
                language={language}
                beforeMount={registerSignalEditorThemes}
                theme={darkMode ? "signal-dark" : "signal-light"}
                original={original}
                modified={modified}
                loading={<Spin />}
                options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    fontFamily: "var(--font-geist-mono), monospace",
                    lineHeight: 23,
                    readOnly: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    renderSideBySide: !isMobile,
                    padding: { top: 12 },
                    folding: !isMobile,
                    glyphMargin: false,
                    lineNumbersMinChars: isMobile ? 0 : 3,
                }}
            />
        </div>
    );
}

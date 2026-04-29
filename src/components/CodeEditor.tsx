"use client";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAppStore } from "@/lib/store";
import { Spin, Button, Tooltip } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";

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
}

export function CodeEditor({
    value,
    onChange,
    language = "json",
    height = "400px",
    readOnly = false,
    showCopy = true,
    copyLabel,
}: CodeEditorProps) {
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
        <div style={{ position: "relative" }}>
            {showCopy && value && (
                <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                    <Button
                        size="small"
                        type={copied ? "primary" : "text"}
                        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
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
                theme={darkMode ? "vs-dark" : "light"}
                value={value}
                onChange={(v) => onChange?.(v ?? "")}
                loading={<Spin />}
                options={{
                    minimap: { enabled: false },
                    fontSize: isMobile ? 13 : 14,
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
        copyToClipboard(original, "Original copied!");
        setCopiedOrig(true);
        setTimeout(() => setCopiedOrig(false), 2000);
    }, [original]);

    const handleCopyMod = useCallback(() => {
        copyToClipboard(modified, "Modified copied!");
        setCopiedMod(true);
        setTimeout(() => setCopiedMod(false), 2000);
    }, [modified]);

    return (
        <div style={{ position: "relative" }}>
            {showCopy && (
                <div style={{ position: "absolute", top: 8, right: 24, zIndex: 10, display: "flex", gap: 4 }}>
                    <Tooltip title={copiedOrig ? "Copied!" : "Copy original"}>
                        <Button
                            size="small"
                            type={copiedOrig ? "primary" : "text"}
                            icon={copiedOrig ? <CheckOutlined /> : <CopyOutlined />}
                            onClick={handleCopyOrig}
                            style={{ opacity: copiedOrig ? 1 : 0.7 }}
                        >
                            Left
                        </Button>
                    </Tooltip>
                    <Tooltip title={copiedMod ? "Copied!" : "Copy modified"}>
                        <Button
                            size="small"
                            type={copiedMod ? "primary" : "text"}
                            icon={copiedMod ? <CheckOutlined /> : <CopyOutlined />}
                            onClick={handleCopyMod}
                            style={{ opacity: copiedMod ? 1 : 0.7 }}
                        >
                            Right
                        </Button>
                    </Tooltip>
                </div>
            )}
            <DiffEditorComponent
                height={responsiveHeight}
                language={language}
                theme={darkMode ? "vs-dark" : "light"}
                original={original}
                modified={modified}
                loading={<Spin />}
                options={{
                    minimap: { enabled: false },
                    fontSize: isMobile ? 13 : 14,
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

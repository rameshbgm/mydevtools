"use client";

import React, { useState } from "react";
import { Button, Space, Card } from "antd";
import { DiffOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor, CodeDiff } from "@/components/CodeEditor";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

interface ShareState { left: string; right: string; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "text-diff", version: 1 };

export default function TextDiffPage() {
    const [left, setLeft] = useState("The quick brown fox\njumps over the lazy dog\nLine three here\nFinal line");
    const [right, setRight] = useState("The quick brown cat\njumps over the lazy dog\nLine three modified\nFinal line\nNew line added");
    const [showDiff, setShowDiff] = useState(false);

    useShareableState(SHARE_SCHEMA, (s) => {
        setLeft(s.left);
        setRight(s.right);
    });

    return (
        <ToolPageLayout
            title="Text Diff"
            description="Compare any two text blocks with highlighted differences"
            icon={<DiffOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: "Text Diff compares any two text blocks and highlights line-by-line differences. It shows added, removed, and modified lines similar to Git diff output.",
                whyUse: "Comparing text files, code snippets, or documents helps identify changes quickly. It's essential for code reviews, document versioning, and troubleshooting.",
                howToUse: [
                    "Paste the original text in the left editor",
                    "Paste the modified text in the right editor",
                    "Click 'Compare' to see line-by-line differences",
                    "Review additions (green) and deletions (red)"
                ],
                tips: [
                    "Works with any plain text: code, logs, configs, etc.",
                    "Line-level diff shows exactly which lines changed",
                    "Character-level highlighting within changed lines",
                    "Use for comparing code before and after refactoring"
                ],
                useCases: [
                    "Comparing code versions during review",
                    "Tracking changes in configuration files",
                    "Diffing log files to find differences",
                    "Verifying text transformations"
                ]
            }}
        >
            <ToolBridgeBanner accepts={["text", "json", "xml", "csv"]} onAccept={(p) => setLeft(p.data)} />

            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<DiffOutlined />} onClick={() => setShowDiff(true)}>Compare</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setLeft(""); setRight(""); setShowDiff(false); }}>Clear</Button>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ left, right })} size="middle" />
            </Space>

            {!showDiff ? (
                <div className="tool-split-pane" style={{ gap: 16 }}>
                    <Card size="small" title="Original" styles={{ body: { padding: 0 } }}>
                        <CodeEditor value={left} onChange={setLeft} language="plaintext" height="500px" />
                    </Card>
                    <Card size="small" title="Modified" styles={{ body: { padding: 0 } }}>
                        <CodeEditor value={right} onChange={setRight} language="plaintext" height="500px" />
                    </Card>
                </div>
            ) : (
                <Card size="small" title="Diff View" styles={{ body: { padding: 0 } }} extra={<Button size="small" onClick={() => setShowDiff(false)}>Edit</Button>}>
                    <CodeDiff original={left} modified={right} language="plaintext" height="550px" />
                </Card>
            )}
        </ToolPageLayout>
    );
}

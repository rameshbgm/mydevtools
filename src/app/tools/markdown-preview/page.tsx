"use client";

import React, { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, Button, Tooltip, Space, Spin } from "antd";
import { FileMarkdownOutlined, CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

// Lazy load ReactMarkdown
const ReactMarkdown = dynamic(() => import("react-markdown"), {
    ssr: false,
    loading: () => <Spin />,
});

const SAMPLE = `# Markdown Preview

Welcome to the **Markdown Preview** tool! 🎉

## Features

- **Bold** and *italic* text
- [Links](https://example.com)
- Code blocks with syntax highlighting

\`\`\`javascript
const greeting = "Hello, mydevtools!";
console.log(greeting);
\`\`\`

## Table

| Feature | Status |
|---------|--------|
| JSON Formatter | ✅ Done |
| XML Diff | ✅ Done |
| RAG Search | 🚧 Coming |

> "The best tools are the ones you build yourself."

---

### Todo
- [x] Build the portal
- [x] Add dark mode
- [ ] Add more tools
`;

interface ShareState { markdown: string; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "markdown-preview", version: 1 };

export default function MarkdownPreviewPage() {
    const [markdown, setMarkdown] = useState(SAMPLE);

    const handleDownload = () => downloadText(markdown, "document.md", "text/markdown");

    useShareableState(SHARE_SCHEMA, (s) => { setMarkdown(s.markdown); });

    return (
        <ToolPageLayout
            title="Markdown Preview"
            description="Write Markdown and see a live rendered preview"
            icon={<FileMarkdownOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "A Markdown editor with live preview. Markdown is a lightweight markup language that converts plain text to formatted HTML, widely used for documentation, README files, and content writing.",
                whyUse: "Markdown is the standard for developer documentation, GitHub READMEs, and technical writing. A live preview helps you see exactly how your content will render.",
                howToUse: [
                    "Write Markdown in the left editor panel",
                    "See rendered output instantly on the right",
                    "Use toolbar buttons for common formatting",
                    "Download or copy your Markdown content"
                ],
                tips: [
                    "# for headings, ** for bold, * for italic",
                    "Use ``` for code blocks with syntax highlighting",
                    "[text](url) for links, ![alt](url) for images",
                    "- or * for bullet lists, 1. for numbered lists"
                ],
                useCases: [
                    "Writing README files for GitHub projects",
                    "Creating technical documentation",
                    "Drafting blog posts or articles",
                    "Writing formatted notes and checklists"
                ]
            }}
        >
            <ToolBridgeBanner accepts={["text"]} onAccept={(p) => setMarkdown(p.data)} />

            <Space style={{ marginBottom: 12 }} wrap>
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(markdown, "Markdown copied!")}>
                    Copy Markdown
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                    Download .md
                </Button>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ markdown })} size="middle" />
                <SendToButton data={markdown} kind="text" sourceToolId="markdown-preview" size="middle" />
            </Space>
            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title="Markdown" styles={{ body: { padding: 0 } }}>
                    <CodeEditor value={markdown} onChange={setMarkdown} language="markdown" height="600px" showCopy={false} />
                </Card>
                <Card size="small" title="Preview" styles={{ body: { padding: "16px 24px", overflow: "auto", maxHeight: 640 } }}>
                    <div className="prose prose-invert max-w-none" style={{ fontSize: 14, lineHeight: 1.8 }}>
                        <Suspense fallback={<Spin />}>
                            <ReactMarkdown>{markdown}</ReactMarkdown>
                        </Suspense>
                    </div>
                </Card>
            </div>
        </ToolPageLayout>
    );
}

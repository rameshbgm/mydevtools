"use client";

import React, { useState, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, Button, Space, Spin, Alert, Checkbox } from "antd";
import { FileMarkdownOutlined, CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";
import HtmlMarkdownConverter from "@/components/HtmlMarkdownConverter";
import remarkGfm from "remark-gfm";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import { useLanguage } from "@/components/LanguageProvider";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

// Lazy load ReactMarkdown
const ReactMarkdown = dynamic(() => import("react-markdown"), {
    ssr: false,
    loading: () => <Spin />,
});

const MARKDOWN_PLUGINS = [remarkGfm];

function MarkdownImage({ src, alt, enabled }: Readonly<{ src?: string | Blob; alt?: string; enabled: boolean }>) {
    const { t } = useLanguage();
    return enabled ? <img src={src} alt={alt ?? ""} style={{ maxWidth: "100%" }} /> : <span dir="auto">{t("Image loading disabled: {alt}", { alt: alt || t("Image") })}</span>;
}

// A locale change updates image guidance through its own context consumer;
// parsing and rendering the user's Markdown depend only on the document/options.
const MarkdownDocument = React.memo(function MarkdownDocument({ markdown, loadImages }: Readonly<{ markdown: string; loadImages: boolean }>) {
    const components = useMemo(() => ({ img: ({ src, alt }: { src?: string | Blob; alt?: string }) => <MarkdownImage src={src} alt={alt} enabled={loadImages} /> }), [loadImages]);
    return <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS} components={components}>{markdown}</ReactMarkdown>;
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
| RAG Search | ✅ Available |

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
    const { t } = useLanguage();
    const [markdown, setMarkdown] = useState(SAMPLE);
    const [exporting, setExporting] = useState(false), [exportError, setExportError] = useState("");
    const [loadImages, setLoadImages] = useState(false);

    const handleDownload = () => downloadText(markdown, "document.md", "text/markdown");

    useShareableState(SHARE_SCHEMA, (s) => { setMarkdown(s.markdown); });

    return (
        <ToolPageLayout
            title={t("Markdown Preview")}
            description={t("Write Markdown and see a live rendered preview")}
            icon={<FileMarkdownOutlined style={{ fontSize: 24, color: "var(--wb-accent)" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "Write Markdown locally with tables, task lists and fenced code blocks.",
                whyUse: "Preview documentation and export Markdown or sanitized HTML.",
                howToUse: [
                    "Edit Markdown to update the preview. Copy or download your document.",
                ],
                tips: [
                    "External images load only when enabled. HTML conversion is limited to 1 MiB. Shared links contain document text.",
                ],
            }}
        >
            <ToolBridgeBanner accepts={["text"]} onAccept={(p) => setMarkdown(p.data)} />

            <Space style={{ marginBottom: 12 }} wrap>
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(markdown)}>
                    {t("Copy Markdown")}
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                    {t("Download .md")}
                </Button>
                <Button disabled={exporting} onClick={async () => { setExporting(true); try { const { markdownToHtmlDocument } = await import("@/lib/html-markdown"); downloadText(await markdownToHtmlDocument(markdown), "document.html", "text/html"); setExportError(""); } catch (cause) { setExportError(cause instanceof Error ? cause.message : "HTML export failed"); } finally { setExporting(false); } }}>{t(exporting ? "Preparing HTML…" : "Download .html")}</Button>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ markdown })} size="middle" />
                <SendToButton data={markdown} kind="text" sourceToolId="markdown-preview" size="middle" />
            </Space>
            <HtmlMarkdownConverter onConverted={setMarkdown} />
            {exportError && <Alert type="error" title={t("HTML export failed")} description={<><p>{t("Check the document and 1 MiB limit, then try exporting again.")}</p><p dir="auto">{t(exportError)}</p></>} />}
            <p>{t("HTML exports block scripts and remote resource loading. Links remain clickable.")}</p>
            <Checkbox checked={loadImages} onChange={(event) => setLoadImages(event.target.checked)} style={{ marginBottom: 16 }}>{t("Load external images in preview (sends requests to image URLs)")}</Checkbox>
            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title="Markdown" styles={{ body: { padding: 0 } }}>
                    <CodeEditor ariaLabel={t("Markdown editor")} value={markdown} onChange={setMarkdown} language="markdown" height="600px" showCopy={false} />
                </Card>
                <Card size="small" title={t("Preview")} styles={{ body: { padding: "16px 24px", overflow: "auto", maxHeight: 640 } }}>
                    <div dir="ltr" className="prose prose-invert max-w-none" style={{ fontSize: 16, lineHeight: 1.8 }}>
                        <Suspense fallback={<Spin />}>
                            <MarkdownDocument markdown={markdown} loadImages={loadImages} />
                        </Suspense>
                    </div>
                </Card>
            </div>
        </ToolPageLayout>
    );
}

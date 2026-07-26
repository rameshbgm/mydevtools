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
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "xml-diff", version: 1 };

export default function XmlDiffPage() {
    const [left, setLeft] = useState(`<?xml version="1.0"?>\n<catalog>\n  <book id="1">\n    <title>Old Title</title>\n    <price>10.00</price>\n  </book>\n</catalog>`);
    const [right, setRight] = useState(`<?xml version="1.0"?>\n<catalog>\n  <book id="1">\n    <title>New Title</title>\n    <price>12.50</price>\n  </book>\n  <book id="2">\n    <title>Extra Book</title>\n  </book>\n</catalog>`);
    const [showDiff, setShowDiff] = useState(false);

    useShareableState(SHARE_SCHEMA, (s) => {
        setLeft(s.left);
        setRight(s.right);
    });

    return (
        <ToolPageLayout
            title="XML Diff"
            description="Compare two XML documents side by side"
            icon={<DiffOutlined style={{ fontSize: 24, color: "#fa8c16" }} />}
            color="#fa8c16"
            learnMore={{
                whatIs: "XML Diff compares two XML documents and shows the differences in a visual side-by-side format. It highlights changes in elements, attributes, and text content.",
                whyUse: "XML documents are common in enterprise systems. Comparing configurations, SOAP messages, or data exports helps identify changes and troubleshoot integration issues.",
                howToUse: [
                    "Paste the original XML in the left editor",
                    "Paste the modified XML in the right editor",
                    "Click 'Compare' to view differences",
                    "Review highlighted additions, deletions, and changes"
                ],
                tips: [
                    "Format XML first for cleaner comparison results",
                    "Whitespace differences are typically ignored",
                    "The diff handles namespaces and complex structures",
                    "Use for comparing SOAP request/response pairs"
                ],
                useCases: [
                    "Comparing SOAP messages for debugging",
                    "Reviewing XML configuration changes",
                    "Validating XML transformations (XSLT output)",
                    "Auditing data export changes"
                ]
            }}
        >
            <ToolBridgeBanner accepts={["xml", "text"]} onAccept={(p) => setLeft(p.data)} />

            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<DiffOutlined />} onClick={() => setShowDiff(true)}>Compare</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setLeft(""); setRight(""); setShowDiff(false); }}>Clear</Button>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ left, right })} size="middle" />
            </Space>

            {!showDiff ? (
                <div className="tool-split-pane" style={{ gap: 16 }}>
                    <Card size="small" title="Original" styles={{ body: { padding: 0 } }}>
                        <CodeEditor value={left} onChange={setLeft} language="xml" height="500px" />
                    </Card>
                    <Card size="small" title="Modified" styles={{ body: { padding: 0 } }}>
                        <CodeEditor value={right} onChange={setRight} language="xml" height="500px" />
                    </Card>
                </div>
            ) : (
                <Card size="small" title="Diff View" styles={{ body: { padding: 0 } }} extra={<Button size="small" onClick={() => setShowDiff(false)}>Edit</Button>}>
                    <CodeDiff original={left} modified={right} language="xml" height="550px" />
                </Card>
            )}
        </ToolPageLayout>
    );
}

"use client";

import React, { useState } from "react";
import { Button, Space, message, Card } from "antd";
import { DiffOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor, CodeDiff } from "@/components/CodeEditor";

export default function JsonDiffPage() {
    const [left, setLeft] = useState(`{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}`);
    const [right, setRight] = useState(`{\n  "name": "Jane",\n  "age": 25,\n  "city": "New York",\n  "country": "US"\n}`);
    const [showDiff, setShowDiff] = useState(false);

    return (
        <ToolPageLayout
            title="JSON Diff"
            description="Compare two JSON documents side by side"
            icon={<DiffOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs: "JSON Diff compares two JSON documents and highlights the differences between them. It shows added, removed, and modified keys/values in a visual side-by-side format.",
                whyUse: "When debugging API responses, configuration changes, or data migrations, seeing exactly what changed between two JSON documents saves time and prevents errors.",
                howToUse: [
                    "Paste the original JSON in the left editor",
                    "Paste the modified JSON in the right editor",
                    "Click 'Compare' to see highlighted differences",
                    "Green = added, red = removed, yellow = modified"
                ],
                tips: [
                    "Format both JSON documents first for better comparison",
                    "Use semantic diff to compare by structure, not just text",
                    "The diff tool handles nested objects and arrays",
                    "Order of keys doesn't affect semantic comparison"
                ],
                useCases: [
                    "Comparing API response changes between versions",
                    "Reviewing configuration file changes",
                    "Debugging data transformation pipelines",
                    "Verifying database exports against expected output"
                ]
            }}
        >
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<DiffOutlined />} onClick={() => setShowDiff(true)}>
                    Compare
                </Button>
                <Button icon={<ClearOutlined />} onClick={() => { setLeft(""); setRight(""); setShowDiff(false); }}>
                    Clear
                </Button>
            </Space>

            {!showDiff ? (
                <div className="tool-split-pane" style={{ gap: 16 }}>
                    <Card size="small" title="Original" styles={{ body: { padding: 0 } }}>
                        <CodeEditor value={left} onChange={setLeft} language="json" height="500px" />
                    </Card>
                    <Card size="small" title="Modified" styles={{ body: { padding: 0 } }}>
                        <CodeEditor value={right} onChange={setRight} language="json" height="500px" />
                    </Card>
                </div>
            ) : (
                <Card size="small" title="Diff View" styles={{ body: { padding: 0 } }} extra={<Button size="small" onClick={() => setShowDiff(false)}>Edit</Button>}>
                    <CodeDiff original={left} modified={right} language="json" height="550px" />
                </Card>
            )}
        </ToolPageLayout>
    );
}

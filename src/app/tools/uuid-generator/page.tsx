"use client";

import React, { useState } from "react";
import { Button, Card, Space, InputNumber, Typography, List } from "antd";
import { KeyOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { v4 as uuidv4 } from "uuid";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;

export default function UuidGeneratorPage() {
    const [count, setCount] = useState(5);
    const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, () => uuidv4()));

    const generate = () => setUuids(Array.from({ length: count }, () => uuidv4()));

    const copyAll = () => copyToClipboard(uuids.join("\n"), "All UUIDs copied!");

    return (
        <ToolPageLayout
            title="UUID Generator"
            description="Generate random UUIDs (v4)"
            icon={<KeyOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: "A UUID (Universally Unique Identifier) is a 128-bit identifier guaranteed to be unique across space and time. Version 4 UUIDs are randomly generated, making them ideal for distributed systems where coordination isn't possible.",
                whyUse: "UUIDs are essential for database primary keys, session tokens, distributed systems, and anywhere you need unique identifiers without a central authority. They're URL-safe and widely supported.",
                howToUse: [
                    "Set the number of UUIDs to generate (1-100)",
                    "Click 'Generate' to create new UUIDs",
                    "Click on any UUID to copy it individually",
                    "Use 'Copy All' to copy all UUIDs at once"
                ],
                tips: [
                    "UUIDv4 has 122 random bits - collision is astronomically unlikely",
                    "UUIDs are 36 characters: 8-4-4-4-12 format with hyphens",
                    "Most databases have native UUID types for efficient storage",
                    "Consider UUIDv7 for time-sortable IDs (not yet standard)"
                ],
                useCases: [
                    "Generating primary keys for database records",
                    "Creating unique session or transaction IDs",
                    "Identifying resources in distributed systems",
                    "Generating correlation IDs for logging"
                ]
            }}
        >
            <Space style={{ marginBottom: 16 }}>
                <Text>Count:</Text>
                <InputNumber min={1} max={100} value={count} onChange={(v) => setCount(v ?? 5)} />
                <Button type="primary" onClick={generate}>Generate</Button>
                <Button icon={<CopyOutlined />} onClick={copyAll}>Copy All</Button>
            </Space>

            <Card size="small">
                <List
                    dataSource={uuids}
                    renderItem={(uuid, i) => (
                        <List.Item
                            extra={
                                <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(uuid)} />
                            }
                        >
                            <Text code style={{ fontSize: 14 }}>{uuid}</Text>
                        </List.Item>
                    )}
                />
            </Card>
        </ToolPageLayout>
    );
}

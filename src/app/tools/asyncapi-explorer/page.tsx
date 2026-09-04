"use client";

import { useMemo, useState } from "react";
import { Alert, Card, Col, Descriptions, Input, Row, Space, Tag, Typography } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { inspectAsyncApi } from "@/lib/asyncapi";
import { parseStructuredData } from "@/lib/structured-data";

const { TextArea } = Input;
const { Text } = Typography;
const SAMPLE = `asyncapi: 3.0.0
info:
  title: Order events
  version: 1.0.0
servers:
  production:
    host: broker.example.com
    protocol: wss
channels:
  orderCreated:
    address: orders.created
operations:
  receiveOrderCreated:
    action: receive
    channel:
      $ref: '#/channels/orderCreated'
components:
  messages:
    OrderCreated:
      name: OrderCreated`;

export default function AsyncApiExplorerPage() {
    const [document, setDocument] = useState(SAMPLE);
    const result = useMemo(() => {
        try { return { summary: inspectAsyncApi(parseStructuredData(document)), error: null }; }
        catch (error) { return { summary: null, error: error instanceof Error ? error.message : "Unable to parse the document." }; }
    }, [document]);
    return (
        <ToolPageLayout
            title="AsyncAPI Explorer"
            description="Inspect message-driven API contracts for channels, operations, servers, and messages"
            icon={<ApartmentOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "A local explorer for AsyncAPI 2.x and 3.x documents—the contract format for event-driven APIs such as Kafka, MQTT, AMQP, and WebSockets.",
                whyUse: "Event contracts are hard to review in raw YAML. This tool gives teams a fast structural summary before they generate clients or deploy a broker integration.",
                howToUse: ["Paste an AsyncAPI JSON or YAML document", "Review the live document summary", "Fix the listed required-field or version issues", "Pair it with the WebSocket Tester for runtime checks"],
                tips: ["AsyncAPI 3 separates channels and operations more explicitly than v2.", "Keep broker-specific detail in protocol bindings.", "The explorer does not connect to your broker."],
                useCases: ["Kafka topic contract reviews", "WebSocket event documentation", "Event-driven service onboarding"],
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}><Card title="AsyncAPI document"><TextArea aria-label="AsyncAPI JSON or YAML document" value={document} onChange={(event) => setDocument(event.target.value)} autoSize={{ minRows: 24, maxRows: 40 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col>
                <Col xs={24} lg={10}><Card title="Document summary">{result.error ? <Alert type="error" showIcon title="Invalid document" description={result.error} /> : result.summary && <Space orientation="vertical" size="middle" style={{ width: "100%" }}><Descriptions bordered size="small" column={1} styles={{ label: { width: 130 } }}><Descriptions.Item label="Title">{result.summary.title}</Descriptions.Item><Descriptions.Item label="AsyncAPI"><Tag color="purple">{result.summary.version}</Tag></Descriptions.Item><Descriptions.Item label="Channels">{result.summary.channels}</Descriptions.Item><Descriptions.Item label="Operations">{result.summary.operations}</Descriptions.Item><Descriptions.Item label="Servers">{result.summary.servers}</Descriptions.Item><Descriptions.Item label="Messages">{result.summary.messages}</Descriptions.Item></Descriptions>{result.summary.issues.length === 0 ? <Alert type="success" showIcon title="Core document fields are present" /> : result.summary.issues.map((issue) => <Alert key={issue} type="warning" showIcon title={issue} />)}<Text type="secondary">Your document is parsed in this browser only.</Text></Space>}</Card></Col>
            </Row>
        </ToolPageLayout>
    );
}

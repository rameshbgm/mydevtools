"use client";

import { useState } from "react";
import { Alert, App, Button, Card, Col, Input, Row, Space, Tag, Typography } from "antd";
import { FileProtectOutlined, ReloadOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { validateJsonSchema, type SchemaIssue } from "@/lib/json-schema-workbench";
import { parseStructuredData } from "@/lib/structured-data";

const { TextArea } = Input;
const { Text } = Typography;
const SAMPLE_SCHEMA = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": { "type": "string", "minLength": 2 },
    "email": { "type": "string", "pattern": "^[^@]+@[^@]+$" },
    "role": { "enum": ["admin", "member"] }
  },
  "additionalProperties": false
}`;
const SAMPLE_INSTANCE = `{
  "name": "A",
  "email": "not-an-email",
  "role": "owner"
}`;

export default function JsonSchemaWorkbenchPage() {
    const { message } = App.useApp();
    const [schema, setSchema] = useState(SAMPLE_SCHEMA);
    const [instance, setInstance] = useState(SAMPLE_INSTANCE);
    const [issues, setIssues] = useState<SchemaIssue[] | null>(null);

    const validate = () => {
        try {
            setIssues(validateJsonSchema(parseStructuredData(instance), parseStructuredData(schema)));
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Unable to validate the document.");
        }
    };
    return (
        <ToolPageLayout
            title="JSON Schema Workbench"
            description="Validate JSON or YAML data against a local JSON Schema and explain each issue"
            icon={<FileProtectOutlined style={{ fontSize: 24, color: "#08979c" }} />}
            color="#08979c"
            learnMore={{
                whatIs: "A privacy-preserving JSON Schema validator for common Draft 2020-12 keywords, including types, required fields, enums, strings, arrays, local references, and additional properties.",
                whyUse: "It gives an API author and a consumer a shared way to test sample payloads before a service is deployed.",
                howToUse: ["Paste a JSON Schema on the left", "Paste a JSON or YAML instance on the right", "Choose Validate instance", "Use the JSON Pointer path in each result to correct the payload or schema"],
                tips: ["Local #/$defs and #/definitions references are supported.", "This MVP intentionally does not evaluate remote references, conditionals, or custom formats.", "Keep a minimal valid example beside each schema in version control."],
                useCases: ["OpenAPI payload design", "Configuration-file validation", "Webhook fixture testing"],
            }}
        >
            <Space wrap style={{ marginBottom: 16 }}><Button type="primary" icon={<FileProtectOutlined />} onClick={validate}>Validate instance</Button><Button icon={<ReloadOutlined />} onClick={() => { setSchema(SAMPLE_SCHEMA); setInstance(SAMPLE_INSTANCE); setIssues(null); }}>Reset example</Button>{issues && <Tag color={issues.length ? "error" : "success"}>{issues.length ? `${issues.length} issue${issues.length === 1 ? "" : "s"}` : "Valid instance"}</Tag>}</Space>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}><Card title="JSON Schema"><TextArea aria-label="JSON Schema" value={schema} onChange={(event) => setSchema(event.target.value)} autoSize={{ minRows: 20, maxRows: 36 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col>
                <Col xs={24} lg={12}><Card title="Instance data"><TextArea aria-label="JSON or YAML instance data" value={instance} onChange={(event) => setInstance(event.target.value)} autoSize={{ minRows: 20, maxRows: 36 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col>
            </Row>
            {issues && <Card title="Validation result" style={{ marginTop: 16 }}>{issues.length === 0 ? <Alert type="success" showIcon title="The instance satisfies the supported schema rules" /> : <Space orientation="vertical" size="middle" style={{ width: "100%" }}>{issues.map((issue) => <Space align="start" key={`${issue.path}:${issue.message}`}><Tag color="error">{issue.path}</Tag><Text>{issue.message}</Text></Space>)}</Space>}</Card>}
        </ToolPageLayout>
    );
}

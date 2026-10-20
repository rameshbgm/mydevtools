"use client";

import { useState } from "react";
import { Alert, App, Button, Card, Col, Input, Row, Space, Tag, Typography } from "antd";
import { FileProtectOutlined, ReloadOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import type { SchemaIssue } from "@/lib/json-schema-workbench";
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
    const { t } = useLanguage();
    const { message } = App.useApp();
    const [schema, setSchema] = useState(SAMPLE_SCHEMA);
    const [instance, setInstance] = useState(SAMPLE_INSTANCE);
    const [issues, setIssues] = useState<SchemaIssue[] | null>(null);
    const [validating, setValidating] = useState(false);

    const validate = async () => {
        setIssues(null);
        setValidating(true);
        let worker: Worker | undefined;
        try {
            if (new TextEncoder().encode(schema + instance).length > 2 * 1024 * 1024) throw new Error(t("Schema and instance together exceed the 2 MiB limit."));
            const payload = { instance: parseStructuredData(instance), schema: parseStructuredData(schema) };
            worker = new Worker(new URL("../../../workers/schema.worker.ts", import.meta.url), { type: "module" });
            const activeWorker = worker;
            const result = await new Promise<SchemaIssue[]>((resolve, reject) => {
                const timer = setTimeout(() => { activeWorker.terminate(); reject(new Error(t("Validation exceeded five seconds. Simplify the schema or input; validity has not been determined."))); }, 5000);
                activeWorker.onmessage = (event) => { clearTimeout(timer); resolve(event.data); };
                activeWorker.onerror = () => { clearTimeout(timer); reject(new Error(t("Validation worker failed. No validity claim can be made."))); };
                activeWorker.postMessage(payload);
            });
            setIssues(result);
        } catch (error) {
            message.error(<div>{t("Unable to validate the document. Check the schema and instance, then try again.")}{error instanceof Error && <pre dir="ltr" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{error.message}</pre>}</div>);
        } finally {
            worker?.terminate();
            setValidating(false);
        }
    };
    return (
        <ToolPageLayout
            title={t("JSON Schema Workbench")}
            description={t("Validate JSON or YAML data against a local JSON Schema and explain each issue")}
            icon={<FileProtectOutlined style={{ fontSize: 24, color: "#08979c" }} />}
            color="#08979c"
            learnMore={{
                whatIs: "A local JSON Schema validator supporting Draft 2020-12, Draft 2019-09 and Draft-07, including composition, conditionals, formats and local references.",
                whyUse: "It gives an API author and a consumer a shared way to test sample payloads before a service is deployed.",
                howToUse: ["Paste a JSON Schema on the left", "Paste a JSON or YAML instance on the right", "Choose Validate instance", "Use the JSON Pointer path in each result to correct the payload or schema"],
                tips: ["Local #/$defs and #/definitions references are supported.", "Remote references are never fetched. Unresolved references, unknown keywords and unsupported dialects produce schema errors instead of a validity claim.", "Validation runs in a separate worker with a five-second limit to keep the page responsive."],
                useCases: ["OpenAPI payload design", "Configuration-file validation", "Webhook fixture testing"],
            }}
        >
            <ToolBridgeBanner accepts={["json"]} onAccept={(payload) => { try { const fixture = JSON.parse(payload.data); if (fixture.schema !== undefined && fixture.instance !== undefined) { setSchema(JSON.stringify(fixture.schema, null, 2)); setInstance(JSON.stringify(fixture.instance, null, 2)); setIssues(null); } else message.error(t("Expected an object with schema and instance fields.")); } catch { message.error(t("Invalid JSON fixture.")); } }} />
            <Space wrap style={{ marginBottom: 16 }}><Button type="primary" loading={validating} icon={<FileProtectOutlined />} onClick={validate}>{t("Validate instance")}</Button><Button disabled={validating} icon={<ReloadOutlined />} onClick={() => { setSchema(SAMPLE_SCHEMA); setInstance(SAMPLE_INSTANCE); setIssues(null); }}>{t("Reset example")}</Button>{issues && <Tag color={issues.length ? "error" : "success"}>{issues.length ? t("Issues: {count}", { count: issues.length }) : t("Valid instance")}</Tag>}</Space>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}><Card title={t("JSON Schema")}><TextArea dir="ltr" aria-label={t("JSON Schema")} disabled={validating} value={schema} onChange={(event) => { setSchema(event.target.value); setIssues(null); }} autoSize={{ minRows: 20, maxRows: 36 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col>
                <Col xs={24} lg={12}><Card title={t("Instance data")}><TextArea dir="ltr" aria-label={t("JSON or YAML instance data")} disabled={validating} value={instance} onChange={(event) => { setInstance(event.target.value); setIssues(null); }} autoSize={{ minRows: 20, maxRows: 36 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col>
            </Row>
            {issues && <Card title={t("Validation result")} style={{ marginTop: 16 }}>{issues.length === 0 ? <Alert type="success" showIcon title={t("The instance satisfies the schema")} /> : <Space orientation="vertical" size="middle" style={{ width: "100%" }}>{issues.map((issue) => <Space align="start" key={`${issue.path}:${issue.message}`}><Tag color="error" dir="ltr">{issue.path}</Tag><Space orientation="vertical"><Text>{t(issue.kind === "schema" ? "Schema error. Check the schema and local references." : "Instance issue. Check the value at this path.")}</Text><pre dir="ltr" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", margin: 0 }}>{issue.message}</pre></Space></Space>)}</Space>}</Card>}
        </ToolPageLayout>
    );
}

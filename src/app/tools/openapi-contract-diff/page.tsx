"use client";

import { useLanguage } from "@/components/LanguageProvider";

import { useState } from "react";
import { Alert, App, Button, Card, Col, Input, Row, Space, Tag, Typography } from "antd";
import { DiffOutlined, ReloadOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { compareOpenApiContracts, validateOpenApiDocument, type ContractChange } from "@/lib/openapi-contract";
import { parseStructuredData } from "@/lib/structured-data";

const { TextArea } = Input;
const { Text } = Typography;

const BEFORE = `openapi: 3.1.0
info: { title: Accounts API, version: 1.0.0 }
paths:
  /accounts:
    get:
      responses: { "200": { description: OK } }
components:
  schemas:
    Account:
      type: object
      properties: { id: { type: string }, name: { type: string } }
      required: [id]`;

const AFTER = `openapi: 3.1.0
info: { title: Accounts API, version: 2.0.0 }
paths:
  /accounts:
    get:
      parameters:
        - { name: region, in: query, required: true, schema: { type: string } }
      responses: { "200": { description: OK } }
components:
  schemas:
    Account:
      type: object
      properties: { id: { type: string }, name: { type: string } }
      required: [id, name]`;

const SEVERITY_LABEL: Record<ContractChange["severity"], string> = { breaking: "Breaking", attention: "Needs review", info: "Information" };

const tagColor: Record<ContractChange["severity"], string> = { breaking: "error", attention: "warning", info: "processing" };

export default function OpenApiContractDiffPage() {
    const { t, language } = useLanguage();
    const { message } = App.useApp();
    const [before, setBefore] = useState(BEFORE);
    const [after, setAfter] = useState(AFTER);
    const [changes, setChanges] = useState<ContractChange[] | null>(null);

    const compare = () => {
        try {
            const oldDocument = parseStructuredData(before);
            const newDocument = parseStructuredData(after);
            const oldError = validateOpenApiDocument(oldDocument);
            const newError = validateOpenApiDocument(newDocument);
            if (oldError || newError) throw new Error(`Baseline: ${oldError ?? "valid"}. Candidate: ${newError ?? "valid"}.`);
            setChanges(compareOpenApiContracts(oldDocument, newDocument));
        } catch (error) {
            message.error(<>{t("Unable to compare these contracts.")} <bdi dir="ltr">{error instanceof Error ? error.message : String(error)}</bdi></>);
        }
    };

    const breaking = changes?.filter((change) => change.severity === "breaking").length ?? 0;
    return (
        <ToolPageLayout
            title={t("OpenAPI Contract Diff")}
            description={t("Compare API specifications and surface breaking contract changes before release")}
            icon={<DiffOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs: "A structural diff for OpenAPI and Swagger documents. It compares operations, required parameters, responses, and component-schema requirements rather than just lines of YAML.",
                whyUse: "A text diff cannot tell a release manager whether a change breaks an existing client. This tool labels conservative, actionable compatibility risks.",
                howToUse: ["Paste the currently published contract on the left", "Paste the proposed contract on the right", "Run Compare contracts", "Resolve every breaking finding or document it in your release notes"],
                tips: ["Coverage: operation removal, required parameters, request/response schemas, media types, types, enum sets, bounds, and required properties. Changed composition, security, and unresolved references require review.", "Keep external $ref files bundled before comparing.", "Use JSON or YAML; nothing leaves this browser."],
                useCases: ["API release reviews", "CI contract-check baselines", "Partner API migration planning"],
            }}
        >
            <Space wrap style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<DiffOutlined />} onClick={compare}>{t("Compare contracts")}</Button>
                <Button icon={<ReloadOutlined />} onClick={() => { setBefore(BEFORE); setAfter(AFTER); setChanges(null); }}>{t("Reset example")}</Button>
                {changes && <Tag color={breaking ? "error" : "success"}>{breaking ? t("Breaking changes: {count}", { count: breaking.toLocaleString(language) }) : t("No breaking changes found in evaluated rules")}</Tag>}
            </Space>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}><Card title={t("Published baseline")}><TextArea dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left" } }} aria-label={t("Published OpenAPI contract")} value={before} onChange={(event) => setBefore(event.target.value)} autoSize={{ minRows: 18, maxRows: 32 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col>
                <Col xs={24} lg={12}><Card title={t("Proposed contract")}><TextArea dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left" } }} aria-label={t("Proposed OpenAPI contract")} value={after} onChange={(event) => setAfter(event.target.value)} autoSize={{ minRows: 18, maxRows: 32 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col>
            </Row>
            {changes && <Card title={t("Compatibility findings")} style={{ marginTop: 16 }}>
                {changes.length === 0 ? <Alert type="success" showIcon title={t("No compatibility findings in evaluated rules")} description={t("Tested document families: Swagger 2.0 and OpenAPI 3.0, 3.1 and 3.2. Review behavioral changes, composition and reference warnings separately. An empty report is not a guarantee of full compatibility.")} /> : <Space orientation="vertical" size="middle" style={{ width: "100%" }}>{changes.map((change) => <Space align="start" key={`${change.location}:${change.message}`}><Tag color={tagColor[change.severity]}>{t(SEVERITY_LABEL[change.severity])}</Tag><div><Text strong><bdi dir="ltr">{change.location}</bdi></Text><br /><Text type="secondary"><bdi dir="ltr">{change.message}</bdi></Text></div></Space>)}</Space>}
            </Card>}
        </ToolPageLayout>
    );
}

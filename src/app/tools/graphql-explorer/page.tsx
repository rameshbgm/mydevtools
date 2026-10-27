"use client";
import { useLanguage } from "@/components/LanguageProvider";

import { useState } from "react";
import { Alert, Button, Card, Col, Input, Row, Space, Tag, Typography } from "antd";
import { ApiOutlined, ReloadOutlined } from "@ant-design/icons";
import { parse, validate } from "graphql";
import GraphqlVisualBuilder from "@/components/GraphqlVisualBuilder";
import { formatGraphql, parseBuilderSchema } from "@/lib/graphql-builder";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text } = Typography;
const SAMPLE_SCHEMA = `type Query {
  user(id: ID!): User
  users(limit: Int = 20): [User!]!
}

type User {
  id: ID!
  name: String!
  email: String!
}`;
const SAMPLE_OPERATION = `query FindUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}`;

export default function GraphqlExplorerPage() {
    const { t } = useLanguage();
    const [schemaSource, setSchemaSource] = useState(SAMPLE_SCHEMA);
    const [operationSource, setOperationSource] = useState(SAMPLE_OPERATION);
    const [errors, setErrors] = useState<string[] | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const inspect = () => {
        setNotice(null);
        try {
            const schema = parseBuilderSchema(schemaSource);
            if (operationSource.length > 500_000) { setErrors([]); setNotice("Operation limit is 500,000 characters."); return; }
            const document = parse(operationSource, { maxTokens: 30_000 });
            setErrors(validate(schema, document).map((error) => error.message));
        } catch (error) {
            if (error instanceof Error) setErrors([error.message]);
            else { setErrors([]); setNotice("Unable to parse schema or operation."); }
        }
    };
    return <ToolPageLayout title={t("GraphQL Schema & Operation Explorer")} description={t("Validate GraphQL operations against an SDL schema without contacting an endpoint")} icon={<ApiOutlined style={{ fontSize: 24, color: "#e10098" }} />} color="#e10098" learnMore={{ whatIs: t("A local GraphQL SDL and operation validator powered by the official GraphQL parser."), whyUse: t("It catches unknown fields, wrong argument types, invalid selections, and schema syntax before a query reaches production."), howToUse: [t("Paste a GraphQL SDL schema"), t("Paste a query, mutation, or subscription"), t("Validate the operation"), t("Fix the reported schema or operation errors")], tips: [t("This tool validates shape only; it does not execute a query or introspect a remote service."), t("Use a checked-in schema snapshot for repeatable review.")], useCases: [t("Frontend query reviews"), t("GraphQL migration checks"), t("API client test fixtures")] }}>
        <Space wrap style={{ marginBottom: 16 }}><Button type="primary" onClick={inspect}>{t("Validate operation")}</Button><Button icon={<ReloadOutlined />} onClick={() => { setSchemaSource(SAMPLE_SCHEMA); setOperationSource(SAMPLE_OPERATION); setErrors(null); setNotice(null); }}>{t("Reset example")}</Button>{errors && !notice && <Tag color={errors.length ? "error" : "success"}>{errors.length ? t("Validation errors: {count}", { count: errors.length }) : t("Operation is valid")}</Tag>}</Space>
        <Space wrap style={{ marginBottom: 16 }}>{[false, true].map((minify) => <Button key={String(minify)} onClick={() => { setNotice(null); try { setOperationSource(formatGraphql(operationSource, minify)); setErrors(null); setNotice(null); } catch (cause) { setErrors([String(cause)]); } }}>{t(minify ? "Minify operation" : "Format operation")}</Button>)}</Space>
        <Row className="signal-working-panes" gutter={[16, 16]}><Col xs={24} lg={12}><Card title={t("Schema (SDL)")}><TextArea dir="ltr" aria-label={t("GraphQL schema SDL")} maxLength={500_000} value={schemaSource} onChange={(event) => setSchemaSource(event.target.value)} autoSize={{ minRows: 18, maxRows: 32 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col><Col xs={24} lg={12}><Card title={t("Operation")}><TextArea dir="ltr" aria-label={t("GraphQL operation")} maxLength={500_000} value={operationSource} onChange={(event) => setOperationSource(event.target.value)} autoSize={{ minRows: 18, maxRows: 32 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col></Row>
        {notice && <Alert type="error" showIcon title={t(notice)} />}
        {errors && !notice && <Card title={t("Validation result")} style={{ marginTop: 16 }}>{errors.length === 0 ? <Alert type="success" showIcon title={t("The operation matches this schema")} /> : <Space orientation="vertical" style={{ width: "100%" }}>{errors.map((error) => <Text key={error} type="danger">{error}</Text>)}</Space>}</Card>}
        <GraphqlVisualBuilder schemaSource={schemaSource} onUse={(value) => { setOperationSource(value); setErrors(null); setNotice(null); }} />
    </ToolPageLayout>;
}

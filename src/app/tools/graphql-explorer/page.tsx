"use client";

import { useState } from "react";
import { Alert, Button, Card, Col, Input, Row, Space, Tag, Typography } from "antd";
import { ApiOutlined, ReloadOutlined } from "@ant-design/icons";
import { buildSchema, parse, validate } from "graphql";
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
    const [schemaSource, setSchemaSource] = useState(SAMPLE_SCHEMA);
    const [operationSource, setOperationSource] = useState(SAMPLE_OPERATION);
    const [errors, setErrors] = useState<string[] | null>(null);
    const inspect = () => {
        try {
            const schema = buildSchema(schemaSource);
            const document = parse(operationSource);
            setErrors(validate(schema, document).map((error) => error.message));
        } catch (error) {
            setErrors([error instanceof Error ? error.message : "Unable to parse schema or operation."]);
        }
    };
    return <ToolPageLayout title="GraphQL Schema & Operation Explorer" description="Validate GraphQL operations against an SDL schema without contacting an endpoint" icon={<ApiOutlined style={{ fontSize: 24, color: "#e10098" }} />} color="#e10098" learnMore={{ whatIs: "A local GraphQL SDL and operation validator powered by the official GraphQL parser.", whyUse: "It catches unknown fields, wrong argument types, invalid selections, and schema syntax before a query reaches production.", howToUse: ["Paste a GraphQL SDL schema", "Paste a query, mutation, or subscription", "Validate the operation", "Fix the reported schema or operation errors"], tips: ["This tool validates shape only; it does not execute a query or introspect a remote service.", "Use a checked-in schema snapshot for repeatable review."], useCases: ["Frontend query reviews", "GraphQL migration checks", "API client test fixtures"] }}>
        <Space wrap style={{ marginBottom: 16 }}><Button type="primary" onClick={inspect}>Validate operation</Button><Button icon={<ReloadOutlined />} onClick={() => { setSchemaSource(SAMPLE_SCHEMA); setOperationSource(SAMPLE_OPERATION); setErrors(null); }}>Reset example</Button>{errors && <Tag color={errors.length ? "error" : "success"}>{errors.length ? `${errors.length} validation error${errors.length === 1 ? "" : "s"}` : "Operation is valid"}</Tag>}</Space>
        <Row gutter={[16, 16]}><Col xs={24} lg={12}><Card title="Schema (SDL)"><TextArea aria-label="GraphQL schema SDL" value={schemaSource} onChange={(event) => setSchemaSource(event.target.value)} autoSize={{ minRows: 18, maxRows: 32 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col><Col xs={24} lg={12}><Card title="Operation"><TextArea aria-label="GraphQL operation" value={operationSource} onChange={(event) => setOperationSource(event.target.value)} autoSize={{ minRows: 18, maxRows: 32 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col></Row>
        {errors && <Card title="Validation result" style={{ marginTop: 16 }}>{errors.length === 0 ? <Alert type="success" showIcon title="The operation matches this schema" /> : <Space orientation="vertical" style={{ width: "100%" }}>{errors.map((error) => <Text key={error} type="danger">{error}</Text>)}</Space>}</Card>}
    </ToolPageLayout>;
}

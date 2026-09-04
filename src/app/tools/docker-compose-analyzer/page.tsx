"use client";

import { useMemo, useState } from "react";
import { Alert, Card, Col, Descriptions, Input, Row, Space, Tag, Typography } from "antd";
import { DeploymentUnitOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { analyseComposeDocument, type ComposeFinding } from "@/lib/docker-compose";
import { parseStructuredData } from "@/lib/structured-data";

const { TextArea } = Input;
const { Text } = Typography;
const SAMPLE = `services:
  web:
    build: .
    ports: ["3000:3000"]
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: development-only
    volumes: [db-data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
volumes:
  db-data: {}`;
const colors: Record<ComposeFinding["severity"], string> = { error: "error", warning: "warning", info: "processing" };

export default function DockerComposeAnalyzerPage() {
    const [source, setSource] = useState(SAMPLE);
    const result = useMemo(() => { try { return { summary: analyseComposeDocument(parseStructuredData(source)), error: null }; } catch (error) { return { summary: null, error: error instanceof Error ? error.message : "Unable to parse Compose YAML." }; } }, [source]);
    return <ToolPageLayout title="Docker Compose Analyzer" description="Review Compose YAML services, networking, port exposure, and deployment hygiene locally" icon={<DeploymentUnitOutlined style={{ fontSize: 24, color: "#2496ed" }} />} color="#2496ed" learnMore={{ whatIs: "A local Docker Compose structure and risk analyzer for services, ports, volumes, networks, privilege, host networking, and health checks.", whyUse: "Compose files grow into production-like architecture quickly. This summarizes topology and highlights a few high-signal deployment concerns.", howToUse: ["Paste a compose.yaml file", "Review service, volume, and network totals", "Work through errors and warnings", "Keep runtime secrets in a protected environment source"], tips: ["This tool does not start containers or upload a compose file.", "It complements, but does not replace, Docker Compose config validation.", "A healthcheck should reflect real application readiness."], useCases: ["Local development stack reviews", "Container security checks", "Architecture onboarding"] }}>
        <Row gutter={[16, 16]}><Col xs={24} lg={14}><Card title="compose.yaml"><TextArea aria-label="Docker Compose YAML" value={source} onChange={(event) => setSource(event.target.value)} autoSize={{ minRows: 24, maxRows: 40 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} /></Card></Col><Col xs={24} lg={10}><Card title="Stack summary">{result.error ? <Alert type="error" showIcon title="Invalid Compose document" description={result.error} /> : result.summary && <Space orientation="vertical" size="middle" style={{ width: "100%" }}><Descriptions bordered size="small" column={1} styles={{ label: { width: 120 } }}><Descriptions.Item label="Services">{result.summary.services}</Descriptions.Item><Descriptions.Item label="Networks">{result.summary.networks}</Descriptions.Item><Descriptions.Item label="Volumes">{result.summary.volumes}</Descriptions.Item></Descriptions>{result.summary.findings.map((finding, index) => <Space align="start" key={`${finding.service}:${index}`}><Tag color={colors[finding.severity]}>{finding.severity.toUpperCase()}</Tag><Text>{finding.service ? `${finding.service}: ` : ""}{finding.message}</Text></Space>)}<Text type="secondary">Parsed in this browser only; no Docker daemon is contacted.</Text></Space>}</Card></Col></Row>
    </ToolPageLayout>;
}

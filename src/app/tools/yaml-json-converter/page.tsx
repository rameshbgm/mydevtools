"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Alert, Segmented } from "antd";
import { SwapOutlined, CopyOutlined, ClearOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import YAML from "yaml";

const { Text } = Typography;

const SAMPLE_YAML = `# Application Configuration
server:
  host: localhost
  port: 8080
  ssl:
    enabled: true
    cert: /path/to/cert.pem

database:
  type: postgresql
  host: db.example.com
  port: 5432
  credentials:
    username: admin
    password: secret123

features:
  - name: authentication
    enabled: true
  - name: analytics
    enabled: false
  - name: notifications
    enabled: true

logging:
  level: INFO
  format: json
  outputs:
    - console
    - file`;

const SAMPLE_JSON = `{
  "server": {
    "host": "localhost",
    "port": 8080,
    "ssl": {
      "enabled": true,
      "cert": "/path/to/cert.pem"
    }
  },
  "database": {
    "type": "postgresql",
    "host": "db.example.com",
    "port": 5432,
    "credentials": {
      "username": "admin",
      "password": "secret123"
    }
  },
  "features": [
    { "name": "authentication", "enabled": true },
    { "name": "analytics", "enabled": false },
    { "name": "notifications", "enabled": true }
  ],
  "logging": {
    "level": "INFO",
    "format": "json",
    "outputs": ["console", "file"]
  }
}`;

export default function YamlJsonConverterPage() {
    const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
    const [yamlInput, setYamlInput] = useState(SAMPLE_YAML);
    const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
    const [error, setError] = useState<string | null>(null);

    const input = mode === "yaml-to-json" ? yamlInput : jsonInput;
    const setInput = mode === "yaml-to-json" ? setYamlInput : setJsonInput;

    const output = useMemo(() => {
        setError(null);
        if (!input.trim()) return "";

        try {
            if (mode === "yaml-to-json") {
                const parsed = YAML.parse(input);
                return JSON.stringify(parsed, null, 2);
            } else {
                const parsed = JSON.parse(input);
                return YAML.stringify(parsed, { indent: 2 });
            }
        } catch (err: any) {
            setError(err.message);
            return "";
        }
    }, [input, mode]);

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        message.success(`${mode === "yaml-to-json" ? "JSON" : "YAML"} copied!`);
    };

    const swapContent = () => {
        if (output && !error) {
            if (mode === "yaml-to-json") {
                setJsonInput(output);
            } else {
                setYamlInput(output);
            }
            setMode(mode === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json");
        }
    };

    return (
        <ToolPageLayout
            title="YAML ↔ JSON Converter"
            description="Convert between YAML and JSON formats"
            icon={<SwapOutlined style={{ fontSize: 24, color: "#cb171e" }} />}
            color="#cb171e"
            learnMore={{
                whatIs: "A bidirectional converter that transforms data between YAML (YAML Ain't Markup Language) and JSON formats. YAML is more human-readable, while JSON is more widely supported in programming.",
                whyUse: "YAML is preferred for configuration files (Kubernetes, Docker Compose, GitHub Actions) due to readability, while JSON is standard for APIs. This tool bridges both worlds seamlessly.",
                howToUse: [
                    "Select conversion direction: YAML → JSON or JSON → YAML",
                    "Paste your input data in the left editor",
                    "The converted output appears instantly on the right",
                    "Copy the result for use in your files"
                ],
                tips: [
                    "YAML uses indentation for structure - be careful with spaces",
                    "Comments in YAML are lost when converting to JSON",
                    "JSON requires quoted strings and explicit syntax",
                    "Use YAML for config files, JSON for API data"
                ],
                useCases: [
                    "Converting Kubernetes manifests between formats",
                    "Debugging YAML configuration by viewing as JSON",
                    "Generating YAML from JSON API responses",
                    "Migrating configuration between different systems"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Space style={{ width: "100%", justifyContent: "center" }}>
                        <Segmented
                            value={mode}
                            onChange={(v) => setMode(v as "yaml-to-json" | "json-to-yaml")}
                            options={[
                                { value: "yaml-to-json", label: "YAML → JSON" },
                                { value: "json-to-yaml", label: "JSON → YAML" },
                            ]}
                            size="large"
                        />
                        {output && !error && (
                            <Button icon={<SwapOutlined />} onClick={swapContent}>
                                Swap
                            </Button>
                        )}
                    </Space>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={mode === "yaml-to-json" ? "YAML Input" : "JSON Input"}
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setInput("")}>
                                Clear
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={input}
                            onChange={(val) => setInput(val || "")}
                            language={mode === "yaml-to-json" ? "yaml" : "json"}
                            height={450}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={mode === "yaml-to-json" ? "JSON Output" : "YAML Output"}
                        extra={
                            output && (
                                <Button size="small" icon={<CopyOutlined />} onClick={copyOutput}>
                                    Copy
                                </Button>
                            )
                        }
                    >
                        {error ? (
                            <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />
                        ) : null}
                        <CodeEditor
                            value={output}
                            language={mode === "yaml-to-json" ? "json" : "yaml"}
                            height={450}
                            readOnly
                        />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

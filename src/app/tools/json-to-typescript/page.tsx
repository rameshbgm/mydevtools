"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Space, Typography, Row, Col, Input } from "antd";
import { CodeOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

const { Text } = Typography;

const SAMPLE_JSON = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "roles": ["admin", "user"],
  "metadata": {
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLogin": null
  }
}`;

const TYPESCRIPT_RESERVED = new Set(["break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "function", "if", "import", "in", "instanceof", "new", "null", "return", "super", "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while", "with", "implements", "interface", "let", "package", "private", "protected", "public", "static", "yield", "any", "boolean", "number", "string", "symbol", "unknown", "never", "object", "undefined", "type", "namespace", "await"]);
function jsonToTypeScript(json: unknown, interfaceName: string = "Root"): string {
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(interfaceName) || TYPESCRIPT_RESERVED.has(interfaceName)) {
        throw new Error("Use a valid TypeScript interface name: start with an ASCII letter, _ or $, and avoid reserved words.");
    }
    const definitions: string[] = [], names = new Set([interfaceName]);
    const shape = (value: unknown): string => value === null ? "null" : Array.isArray(value) ? `array(${[...new Set(value.map(shape))].sort().join("|")})` : typeof value === "object" ? `object(${Object.entries(value as Record<string, unknown>).map(([key, child]) => JSON.stringify(key) + ":" + shape(child)).join(",")})` : typeof value;
    const objects = new Map<string, string>();
    const uniqueName = (suggested: string) => {
        let base = suggested.replace(/[^a-zA-Z0-9_$]/g, "_");
        if (!/^[a-zA-Z_$]/.test(base)) base = "Value_" + base;
        if (TYPESCRIPT_RESERVED.has(base)) base = "Value_" + base;
        let name = base || "Value", suffix = 2;
        while (names.has(name)) name = `${base}${suffix++}`;
        names.add(name); return name;
    };
    const infer = (value: unknown, suggested: string, root = false): string => {
        if (value === null) return "null";
        if (Array.isArray(value)) {
            const types = [...new Set(value.map((item) => infer(item, suggested + "Item")))];
            if (!types.length) return "unknown[]";
            return (types.length > 1 ? `(${types.join(" | ")})` : types[0].includes(" | ") ? `(${types[0]})` : types[0]) + "[]";
        }
        if (typeof value === "object") {
            const signature = shape(value);
            if (!root && objects.has(signature)) return objects.get(signature)!;
            const name = root ? interfaceName : uniqueName(suggested);
            objects.set(signature, name);
            const lines = Object.entries(value as Record<string, unknown>).map(([key, child]) => {
                const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
                const childName = key.charAt(0).toUpperCase() + key.slice(1);
                return `  ${safeKey}: ${infer(child, childName)};`;
            });
            definitions.push(`interface ${name} {\n${lines.join("\n")}\n}`);
            return name;
        }
        return typeof value;
    };
    const type = infer(json, interfaceName, !Array.isArray(json) && json !== null && typeof json === "object");
    if (type !== interfaceName) definitions.push(`type ${interfaceName} = ${type};`);
    return definitions.join("\n\n");
}

interface ShareState { input: string; interfaceName: string; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "json-to-typescript", version: 1 };

export default function JsonToTypescriptPage() {
    const { t } = useLanguage();
    const [input, setInput] = useState(SAMPLE_JSON);
    const [output, setOutput] = useState("");
    const [interfaceName, setInterfaceName] = useState("Root");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const parsed = JSON.parse(input);
            const ts = jsonToTypeScript(parsed, interfaceName);
            setOutput(ts);
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setOutput("");
        }
    }, [input, interfaceName]);

    useShareableState(SHARE_SCHEMA, (s) => {
        setInput(s.input);
        setInterfaceName(s.interfaceName);
    });

    return (
        <ToolPageLayout
            title={t("JSON to TypeScript")}
            description={t("Convert JSON to TypeScript interfaces")}
            icon={<CodeOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "Infer TypeScript interfaces and array unions from a JSON sample.",
                whyUse: "Start API response types from representative examples, then review the generated code.",
                howToUse: ["Paste valid JSON and enter a valid root name. Generated output updates automatically."],
                tips: ["All array items contribute to the type. Null stays null; missing fields and large numeric precision still need review."],
            }}
        >
            <ToolBridgeBanner accepts={["json"]} onAccept={(p) => setInput(p.data)} />

            <Space style={{ marginBottom: 16 }} wrap>
                <Text>{t("Root Interface Name:")}</Text>
                <Input dir="ltr" aria-label={t("Root Interface Name:")} styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                    value={interfaceName}
                    onChange={(e) => setInterfaceName(e.target.value || "Root")}
                    style={{ width: 150 }}
                    placeholder={"Root"}
                />
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(output)} disabled={!output}>{t("Copy TypeScript")}</Button>
                <ShareButton schema={SHARE_SCHEMA} getState={() => ({ input, interfaceName })} size="middle" />
                <SendToButton data={output} kind="text" sourceToolId="json-to-typescript" size="middle" />
            </Space>

            {error && (
                <div style={{ marginBottom: 16, padding: "8px 12px", background: "rgba(255,77,79,0.1)", borderRadius: 8 }}>
                    <Text type="danger">{t("Check the JSON input and root interface name.")}</Text>
                    <pre dir="ltr" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{t(error)}</pre>
                </div>
            )}

            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <Card size="small" title={t("JSON Input")} styles={{ body: { padding: 0 } }}>
                        <CodeEditor ariaLabel={t("JSON Input")}
                            value={input}
                            onChange={setInput}
                            language="json"
                            height="500px"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card size="small" title={t("TypeScript Output")} styles={{ body: { padding: 0 } }}>
                        <CodeEditor ariaLabel={t("TypeScript Output")}
                            value={output}
                            language="typescript"
                            height="500px"
                            readOnly
                        />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}

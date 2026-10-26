"use client";

import { useMemo, useState } from "react";
import { Card, Input, Typography, Space, Tabs, Button, Tag, Form, Switch, Select } from "antd";
import { RobotOutlined, PlusOutlined, DeleteOutlined, CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import { formatAiDiagnostic } from "@/lib/i18n/remaining-ai";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";
import SendToButton from "@/components/SendToButton";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// ─── A2A Agent Card ────────────────────────────────────────────────────

interface SkillDraft { id: string; name: string; description: string; tags: string; }

interface AgentCardDraft {
    protocolVersion: "1.0" | "0.3";
    name: string;
    description: string;
    url: string;
    version: string;
    documentationUrl: string;
    streaming: boolean;
    pushNotifications: boolean;
    defaultInputModes: string;
    defaultOutputModes: string;
    orgName: string;
    orgUrl: string;
    skills: SkillDraft[];
}

const DEFAULT_CARD: AgentCardDraft = {
    protocolVersion: "1.0",
    name: "My Agent",
    description: "An agent that does something useful.",
    url: "https://example.com/a2a",
    version: "1.0.0",
    documentationUrl: "",
    streaming: false,
    pushNotifications: false,
    defaultInputModes: "text/plain",
    defaultOutputModes: "text/plain",
    orgName: "",
    orgUrl: "",
    skills: [{ id: "default", name: "Default skill", description: "Handles general requests.", tags: "" }],
};

function buildAgentCard(d: AgentCardDraft): Record<string, unknown> {
    const card: Record<string, unknown> = {
        name: d.name,
        description: d.description,
        ...(d.protocolVersion === "1.0" ? { supportedInterfaces: [{ url: d.url, protocolBinding: "JSONRPC", protocolVersion: "1.0" }] } : { url: d.url, protocolVersion: "0.3.0" }),
        version: d.version,
    };
    if (d.documentationUrl) card.documentationUrl = d.documentationUrl;
    card.capabilities = { streaming: d.streaming, pushNotifications: d.pushNotifications };
    card.defaultInputModes = d.defaultInputModes.split(",").map((s) => s.trim()).filter(Boolean);
    card.defaultOutputModes = d.defaultOutputModes.split(",").map((s) => s.trim()).filter(Boolean);
    if (d.orgName) card.provider = { organization: d.orgName, ...(d.orgUrl ? { url: d.orgUrl } : {}) };
    card.skills = d.skills.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        tags: s.tags.split(",").map((t) => t.trim()).filter(Boolean),
    }));
    return card;
}

function validateAgentCard(d: AgentCardDraft): string[] {
    const errors: string[] = [];
    if (!d.description.trim()) errors.push('"description" is required');
    if (!d.defaultInputModes.trim() || !d.defaultOutputModes.trim()) errors.push("Input and output modes are required");
    if (!d.name.trim()) errors.push('"name" is required');
    if (!d.url.trim()) errors.push('"url" is required');
    else {
        try { if (!["http:", "https:"].includes(new URL(d.url).protocol)) throw new Error(); } catch { errors.push('"url" must be a valid absolute URL'); }
    }
    if (!d.version.trim()) errors.push('"version" is required');
    if (d.skills.length === 0) errors.push("at least one skill is required");
    d.skills.forEach((s, i) => {
        if (!s.id.trim()) errors.push(`skill[${i}]: "id" is required`);
        if (!s.description.trim()) errors.push(`skill[${i}]: "description" is required`);
        if (!s.name.trim()) errors.push(`skill[${i}]: "name" is required`);
    });
    return errors;
}

// ─── MCP Server Config ─────────────────────────────────────────────────

interface EnvVar { key: string; value: string; }

interface McpDraft {
    serverName: string;
    transport: "stdio" | "http";
    command: string;
    args: string;
    url: string;
    env: EnvVar[];
}

const DEFAULT_MCP: McpDraft = {
    serverName: "my-server",
    transport: "stdio",
    command: "npx",
    args: '["-y", "@my-org/my-mcp-server"]',
    url: "http://localhost:3001/mcp",
    env: [{ key: "API_KEY", value: "" }],
};

function parseMcpArgs(raw: string): string[] {
    const value: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(value) || value.some((arg) => typeof arg !== "string")) throw new Error("Arguments must be a JSON array of strings");
    return value;
}
function buildMcpConfig(d: McpDraft): Record<string, unknown> {
    const env = Object.fromEntries(d.env.filter((e) => e.key.trim()).map((e) => [e.key, e.value]));
    const entry: Record<string, unknown> =
        d.transport === "stdio"
            ? { command: d.command, args: parseMcpArgs(d.args) }
            : { url: d.url };
    if (Object.keys(env).length > 0) entry.env = env;
    return { mcpServers: { [d.serverName || "server"]: entry } };
}

function validateMcp(d: McpDraft): string[] {
    const errors: string[] = [];
    if (!d.serverName.trim()) errors.push("server name is required");
    if (d.transport === "stdio" && !d.command.trim()) errors.push('"command" is required for stdio transport');
    if (d.transport === "stdio") {
        try { parseMcpArgs(d.args); } catch { errors.push("Arguments must be a JSON array of strings"); }
    }
    if (new Set(d.env.filter((e) => e.key.trim()).map((e) => e.key)).size !== d.env.filter((e) => e.key.trim()).length) errors.push("Environment keys must be unique");
    if (d.transport === "http") {
        if (!d.url.trim()) errors.push('"url" is required for HTTP transport');
        else { try { if (!["http:", "https:"].includes(new URL(d.url).protocol)) throw new Error(); } catch { errors.push('"url" must be a valid absolute URL'); } }
    }
    return errors;
}

export default function AgentManifestGeneratorPage() {
    const { t } = useLanguage();
    const [card, setCard] = useState<AgentCardDraft>(DEFAULT_CARD);
    const [mcp, setMcp] = useState<McpDraft>(DEFAULT_MCP);

    const cardJson = useMemo(() => JSON.stringify(buildAgentCard(card), null, 2), [card]);
    const cardErrors = useMemo(() => validateAgentCard(card), [card]);

    const mcpJson = useMemo(() => { try { return JSON.stringify(buildMcpConfig(mcp), null, 2); } catch { return ""; } }, [mcp]);
    const mcpErrors = useMemo(() => validateMcp(mcp), [mcp]);

    const updateSkill = (i: number, patch: Partial<SkillDraft>) => {
        setCard((c) => ({ ...c, skills: c.skills.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }));
    };
    const addSkill = () => setCard((c) => ({ ...c, skills: [...c.skills, { id: "", name: "", description: "", tags: "" }] }));
    const removeSkill = (i: number) => setCard((c) => ({ ...c, skills: c.skills.filter((_, idx) => idx !== i) }));

    const updateEnv = (i: number, patch: Partial<EnvVar>) => {
        setMcp((m) => ({ ...m, env: m.env.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) }));
    };
    const addEnv = () => setMcp((m) => ({ ...m, env: [...m.env, { key: "", value: "" }] }));
    const removeEnv = (i: number) => setMcp((m) => ({ ...m, env: m.env.filter((_, idx) => idx !== i) }));

    return (
        <ToolPageLayout
            title={t("Agent Card / MCP Manifest Generator")}
            description={t("Build an A2A 1.0 or 0.3 JSONRPC agent-card.json or MCP server config, then send it straight to the A2A or MCP inspector to test")}
            icon={<RobotOutlined style={{ fontSize: 24 }} />}
            color="#0891b2"
            learnMore={{
                "whatIs": "Builds A2A 1.0 or 0.3 JSONRPC agent cards and MCP client configuration JSON with live structural checks.",
                "whyUse": "Scaffold required fields and inspect the resulting JSON before configuring a client or publishing a card.",
                "howToUse": [
                                "Choose an A2A card or MCP config, fill the fields, and review validation messages.",
                                "Copy, download, or send the JSON to the matching inspector; this page does not deploy or execute it."
                ],
                "tips": [
                                "A2A cards are typically served at /.well-known/agent-card.json; tags describe skills. This form does not certify protocol conformance.",
                                "For MCP stdio, enter command arguments as a JSON string array so spaces are preserved. Client-specific HTTP configuration may differ.",
                                "Environment values can contain secrets. They are included verbatim in copied, downloaded and shared-to-tool JSON; keep that output private."
                ],
                "useCases": [
                                "Prepare a new agent card or a local MCP client configuration."
                ]
}}
        >
            <Tabs
                items={[
                    {
                        key: "a2a",
                        label: t("A2A Agent Card"),
                        children: (
                            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                                <Card size="small" title={t("Agent details")}>
                                    <Form layout="vertical" className="signal-form-grid">
                                        <Form.Item label={t("A2A protocol")} htmlFor="agent-protocol"><Select id="agent-protocol" value={card.protocolVersion} onChange={protocolVersion => setCard({ ...card, protocolVersion })} options={[{ value: "1.0", label: t("1.0 · current") }, { value: "0.3", label: t("0.3 · previous") }]} /></Form.Item>
                                        <Form.Item label={t("Name")} htmlFor="agent-name" required><Input id="agent-name" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} /></Form.Item>
                                        <Form.Item className="signal-field-wide" label={t("Description")} htmlFor="agent-description"><TextArea id="agent-description" rows={3} value={card.description} onChange={e => setCard({ ...card, description: e.target.value })} /></Form.Item>
                                        <Form.Item className="signal-field-wide" label={t("Agent URL (A2A endpoint)")} htmlFor="agent-url" required><Input id="agent-url" dir="ltr" value={card.url} onChange={e => setCard({ ...card, url: e.target.value })} placeholder="https://example.com/a2a" /></Form.Item>
                                        <Form.Item label={t("Version")} htmlFor="agent-version" required><Input id="agent-version" value={card.version} onChange={e => setCard({ ...card, version: e.target.value })} /></Form.Item>
                                        <Form.Item label={t("Documentation URL")} htmlFor="agent-documentation"><Input id="agent-documentation" dir="ltr" value={card.documentationUrl} onChange={e => setCard({ ...card, documentationUrl: e.target.value })} /></Form.Item>
                                        <div className="signal-field-wide signal-capability-row"><Form.Item label={t("Streaming")}><Switch aria-label={t("Streaming")} checked={card.streaming} onChange={v => setCard({ ...card, streaming: v })} /></Form.Item><Form.Item label={t("Push notifications")}><Switch aria-label={t("Push notifications")} checked={card.pushNotifications} onChange={v => setCard({ ...card, pushNotifications: v })} /></Form.Item></div>
                                        <Form.Item label={t("Input modes (comma-separated)")} htmlFor="agent-input-modes"><Input id="agent-input-modes" value={card.defaultInputModes} onChange={e => setCard({ ...card, defaultInputModes: e.target.value })} /></Form.Item>
                                        <Form.Item label={t("Output modes (comma-separated)")} htmlFor="agent-output-modes"><Input id="agent-output-modes" value={card.defaultOutputModes} onChange={e => setCard({ ...card, defaultOutputModes: e.target.value })} /></Form.Item>
                                        <Form.Item label={t("Provider organization")} htmlFor="agent-provider"><Input id="agent-provider" value={card.orgName} onChange={e => setCard({ ...card, orgName: e.target.value })} /></Form.Item>
                                        <Form.Item label={t("Provider URL")} htmlFor="agent-provider-url"><Input id="agent-provider-url" dir="ltr" value={card.orgUrl} onChange={e => setCard({ ...card, orgUrl: e.target.value })} /></Form.Item>
                                    </Form>
                                </Card>

                                <Card
                                    size="small"
                                    title={t("Skills")}
                                    extra={<Button size="small" icon={<PlusOutlined />} onClick={addSkill}>{t("Add skill")}</Button>}
                                >
                                    <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                                        {card.skills.map((s, i) => (
                                            <Card key={i} size="small" type="inner" title={t("Skill {number}", { number: i + 1 })} extra={
                                                <Button aria-label={t("Delete")} size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => removeSkill(i)} />
                                            }>
                                                <Space wrap style={{ width: "100%" }}>
                                                    <Input placeholder={t("id (required)")} value={s.id} onChange={(e) => updateSkill(i, { id: e.target.value })} style={{ width: 160 }} />
                                                    <Input placeholder={t("name (required)")} value={s.name} onChange={(e) => updateSkill(i, { name: e.target.value })} style={{ width: 200 }} />
                                                    <Input placeholder={t("tags (comma-separated)")} value={s.tags} onChange={(e) => updateSkill(i, { tags: e.target.value })} style={{ width: 200 }} />
                                                </Space>
                                                <Input style={{ marginTop: 8 }} placeholder={t("description")} value={s.description} onChange={(e) => updateSkill(i, { description: e.target.value })} />
                                            </Card>
                                        ))}
                                    </Space>
                                </Card>

                                <ManifestPreview
                                    json={cardJson}
                                    errors={cardErrors}
                                    filename="agent-card.json"
                                    sendKind="json"
                                    sendSourceId="agent-manifest-generator"
                                />
                            </Space>
                        ),
                    },
                    {
                        key: "mcp",
                        label: t("MCP Server Config"),
                        children: (
                            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                                <Card size="small" title={t("Server details")}>
                                    <Form layout="vertical" className="signal-form-stack">
                                        <Form.Item label={t("Server name (key in mcpServers)")} required>
                                            <Input value={mcp.serverName} onChange={(e) => setMcp({ ...mcp, serverName: e.target.value })} style={{ width: 260 }} />
                                        </Form.Item>
                                        <Form.Item label={t("Transport")}>
                                            <Select
                                                value={mcp.transport}
                                                onChange={(v) => setMcp({ ...mcp, transport: v })}
                                                style={{ width: 200 }}
                                                options={[
                                                    { value: "stdio", label: t("stdio (local subprocess)") },
                                                    { value: "http", label: t("HTTP / SSE (remote URL)") },
                                                ]}
                                            />
                                        </Form.Item>
                                        {mcp.transport === "stdio" ? (
                                            <Space size="large" wrap>
                                                <Form.Item label={t("Command")} required>
                                                    <Input value={mcp.command} onChange={(e) => setMcp({ ...mcp, command: e.target.value })} style={{ width: 140 }} />
                                                </Form.Item>
                                                <Form.Item label={t("Args (JSON string array)")}>
                                                    <Input value={mcp.args} onChange={(e) => setMcp({ ...mcp, args: e.target.value })} style={{ width: 360 }} />
                                                </Form.Item>
                                            </Space>
                                        ) : (
                                            <Form.Item label={t("Server URL")} required>
                                                <Input value={mcp.url} onChange={(e) => setMcp({ ...mcp, url: e.target.value })} style={{ width: 400 }} placeholder="http://localhost:3001/mcp" />
                                            </Form.Item>
                                        )}
                                    </Form>
                                </Card>

                                <Card
                                    size="small"
                                    title={t("Environment variables")}
                                    extra={<Button size="small" icon={<PlusOutlined />} onClick={addEnv}>{t("Add variable")}</Button>}
                                >
                                    <Space orientation="vertical" size="small" style={{ width: "100%" }}>
                                        {mcp.env.map((e, i) => (
                                            <Space key={i} wrap>
                                                <Input placeholder={t("KEY")} value={e.key} onChange={(ev) => updateEnv(i, { key: ev.target.value })} style={{ width: 200 }} />
                                                <Input placeholder={t("value")} value={e.value} onChange={(ev) => updateEnv(i, { value: ev.target.value })} style={{ width: 260 }} />
                                                <Button aria-label={t("Delete")} size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => removeEnv(i)} />
                                            </Space>
                                        ))}
                                    </Space>
                                </Card>

                                <ManifestPreview
                                    json={mcpJson}
                                    errors={mcpErrors}
                                    filename="mcp.json"
                                    sendKind="json"
                                    sendSourceId="agent-manifest-generator"
                                />
                            </Space>
                        ),
                    },
                ]}
            />
        </ToolPageLayout>
    );
}

function ManifestPreview({ json, errors, filename, sendKind, sendSourceId }: {
    json: string;
    errors: string[];
    filename: string;
    sendKind: "json";
    sendSourceId: string;
}) {
    const { t } = useLanguage();
    return (
        <Card
            size="small"
            title={
                <Space>
                    <Text strong>{t("Preview")}</Text>
                    {errors.length === 0 ? <Tag color="green">{t("Form checks passed")}</Tag> : <Tag color="red">{errors.length} {t("issue(s)")}</Tag>}
                </Space>
            }
            extra={
                <Space>
                    <Button size="small" icon={<CopyOutlined />} disabled={errors.length > 0} onClick={() => copyToClipboard(json)}>{t("Copy")}</Button>
                    <Button size="small" icon={<DownloadOutlined />} disabled={errors.length > 0} onClick={() => downloadText(json, filename, "application/json")}>{t("Download")}</Button>
                    <SendToButton data={errors.length === 0 ? json : ""} kind={sendKind} sourceToolId={sendSourceId} size="small" />
                </Space>
            }
        >
            {errors.length > 0 && (
                <Space orientation="vertical" size={2} style={{ marginBottom: 12, width: "100%" }}>
                    {errors.map((e, i) => <Text key={i} type="danger" style={{ fontSize: 12 }}>• {formatAiDiagnostic(e, t)}</Text>)}
                </Space>
            )}
            <Paragraph style={{ marginBottom: 0 }}>
                <pre style={{ margin: 0, fontFamily: "var(--font-geist-mono)", fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{json}</pre>
            </Paragraph>
        </Card>
    );
}

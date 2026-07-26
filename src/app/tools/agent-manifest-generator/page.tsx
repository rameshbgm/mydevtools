"use client";

import { useMemo, useState } from "react";
import { Card, Input, Typography, Space, Tabs, Button, Tag, Form, Switch, Select } from "antd";
import { RobotOutlined, PlusOutlined, DeleteOutlined, CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";
import SendToButton from "@/components/SendToButton";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// ─── A2A Agent Card ────────────────────────────────────────────────────

interface SkillDraft { id: string; name: string; description: string; tags: string; }

interface AgentCardDraft {
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
        url: d.url,
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
        ...(s.description ? { description: s.description } : {}),
        ...(s.tags ? { tags: s.tags.split(",").map((t) => t.trim()).filter(Boolean) } : {}),
    }));
    return card;
}

function validateAgentCard(d: AgentCardDraft): string[] {
    const errors: string[] = [];
    if (!d.name.trim()) errors.push('"name" is required');
    if (!d.url.trim()) errors.push('"url" is required');
    else {
        try { new URL(d.url); } catch { errors.push('"url" must be a valid absolute URL'); }
    }
    if (!d.version.trim()) errors.push('"version" is required');
    if (d.skills.length === 0) errors.push("at least one skill is required");
    d.skills.forEach((s, i) => {
        if (!s.id.trim()) errors.push(`skill[${i}]: "id" is required`);
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
    args: "-y @my-org/my-mcp-server",
    url: "http://localhost:3001/mcp",
    env: [{ key: "API_KEY", value: "" }],
};

function buildMcpConfig(d: McpDraft): Record<string, unknown> {
    const env = Object.fromEntries(d.env.filter((e) => e.key.trim()).map((e) => [e.key, e.value]));
    const entry: Record<string, unknown> =
        d.transport === "stdio"
            ? { command: d.command, args: d.args.split(" ").filter(Boolean) }
            : { url: d.url };
    if (Object.keys(env).length > 0) entry.env = env;
    return { mcpServers: { [d.serverName || "server"]: entry } };
}

function validateMcp(d: McpDraft): string[] {
    const errors: string[] = [];
    if (!d.serverName.trim()) errors.push("server name is required");
    if (d.transport === "stdio" && !d.command.trim()) errors.push('"command" is required for stdio transport');
    if (d.transport === "http") {
        if (!d.url.trim()) errors.push('"url" is required for HTTP transport');
        else { try { new URL(d.url); } catch { errors.push('"url" must be a valid absolute URL'); } }
    }
    return errors;
}

export default function AgentManifestGeneratorPage() {
    const [card, setCard] = useState<AgentCardDraft>(DEFAULT_CARD);
    const [mcp, setMcp] = useState<McpDraft>(DEFAULT_MCP);

    const cardJson = useMemo(() => JSON.stringify(buildAgentCard(card), null, 2), [card]);
    const cardErrors = useMemo(() => validateAgentCard(card), [card]);

    const mcpJson = useMemo(() => JSON.stringify(buildMcpConfig(mcp), null, 2), [mcp]);
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
            title="Agent Card / MCP Manifest Generator"
            description="Build a valid A2A agent-card.json or MCP server config, then send it straight to the A2A or MCP inspector to test"
            icon={<RobotOutlined style={{ fontSize: 24 }} />}
            color="#0891b2"
            learnMore={{
                whatIs: "A form-based generator for the two manifest formats used by AI agent protocols: the A2A (Agent-to-Agent) agent-card.json that agents publish at /.well-known/agent-card.json, and the MCP (Model Context Protocol) mcpServers client config used by Claude Desktop, Claude Code, and other MCP clients.",
                whyUse: "Both formats have required fields and easy-to-miss structural rules (a skill needs both an id and a name; an MCP stdio server needs a command; a URL needs to actually parse). This catches those mistakes with live validation as you fill in the form, and lets you immediately test the result in the A2A Inspector or MCP Inspector already on this site via the Send To button.",
                howToUse: [
                    "Pick the A2A Agent Card or MCP Server Config tab",
                    "Fill in the form fields — the JSON preview updates live on the right",
                    "Fix any validation errors shown below the form",
                    "Download the JSON, copy it, or send it directly to the matching inspector tool",
                ],
                tips: [
                    "An A2A agent card is normally served at /.well-known/agent-card.json (or the legacy /.well-known/agent.json) — this tool just builds the JSON body",
                    "MCP stdio servers run as a local subprocess (command + args); HTTP/SSE servers are reached by URL — pick the transport that matches how your server actually runs",
                    "Skill tags help clients discover the right skill for a task — keep them short and specific",
                ],
                useCases: [
                    "Scaffolding a new A2A agent's card before wiring up the actual server",
                    "Generating an MCP client config to drop into Claude Desktop or Claude Code",
                    "Testing a hand-written agent card or MCP config for structural mistakes before deploying",
                ],
            }}
        >
            <Tabs
                items={[
                    {
                        key: "a2a",
                        label: "A2A Agent Card",
                        children: (
                            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                                <Card size="small" title="Agent details">
                                    <Form layout="vertical">
                                        <Form.Item label="Name" required>
                                            <Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                                        </Form.Item>
                                        <Form.Item label="Description">
                                            <TextArea rows={2} value={card.description} onChange={(e) => setCard({ ...card, description: e.target.value })} />
                                        </Form.Item>
                                        <Form.Item label="Agent URL (A2A endpoint)" required>
                                            <Input value={card.url} onChange={(e) => setCard({ ...card, url: e.target.value })} placeholder="https://example.com/a2a" />
                                        </Form.Item>
                                        <Space size="large" wrap>
                                            <Form.Item label="Version" required>
                                                <Input value={card.version} onChange={(e) => setCard({ ...card, version: e.target.value })} style={{ width: 140 }} />
                                            </Form.Item>
                                            <Form.Item label="Documentation URL">
                                                <Input value={card.documentationUrl} onChange={(e) => setCard({ ...card, documentationUrl: e.target.value })} style={{ width: 260 }} />
                                            </Form.Item>
                                        </Space>
                                        <Space size="large" wrap>
                                            <Form.Item label="Streaming"><Switch checked={card.streaming} onChange={(v) => setCard({ ...card, streaming: v })} /></Form.Item>
                                            <Form.Item label="Push notifications"><Switch checked={card.pushNotifications} onChange={(v) => setCard({ ...card, pushNotifications: v })} /></Form.Item>
                                        </Space>
                                        <Space size="large" wrap>
                                            <Form.Item label="Input modes (comma-separated)">
                                                <Input value={card.defaultInputModes} onChange={(e) => setCard({ ...card, defaultInputModes: e.target.value })} style={{ width: 220 }} />
                                            </Form.Item>
                                            <Form.Item label="Output modes (comma-separated)">
                                                <Input value={card.defaultOutputModes} onChange={(e) => setCard({ ...card, defaultOutputModes: e.target.value })} style={{ width: 220 }} />
                                            </Form.Item>
                                        </Space>
                                        <Space size="large" wrap>
                                            <Form.Item label="Provider organization">
                                                <Input value={card.orgName} onChange={(e) => setCard({ ...card, orgName: e.target.value })} style={{ width: 220 }} />
                                            </Form.Item>
                                            <Form.Item label="Provider URL">
                                                <Input value={card.orgUrl} onChange={(e) => setCard({ ...card, orgUrl: e.target.value })} style={{ width: 220 }} />
                                            </Form.Item>
                                        </Space>
                                    </Form>
                                </Card>

                                <Card
                                    size="small"
                                    title="Skills"
                                    extra={<Button size="small" icon={<PlusOutlined />} onClick={addSkill}>Add skill</Button>}
                                >
                                    <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                                        {card.skills.map((s, i) => (
                                            <Card key={i} size="small" type="inner" title={`Skill ${i + 1}`} extra={
                                                <Button aria-label="Delete" size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => removeSkill(i)} />
                                            }>
                                                <Space wrap style={{ width: "100%" }}>
                                                    <Input placeholder="id (required)" value={s.id} onChange={(e) => updateSkill(i, { id: e.target.value })} style={{ width: 160 }} />
                                                    <Input placeholder="name (required)" value={s.name} onChange={(e) => updateSkill(i, { name: e.target.value })} style={{ width: 200 }} />
                                                    <Input placeholder="tags (comma-separated)" value={s.tags} onChange={(e) => updateSkill(i, { tags: e.target.value })} style={{ width: 200 }} />
                                                </Space>
                                                <Input style={{ marginTop: 8 }} placeholder="description" value={s.description} onChange={(e) => updateSkill(i, { description: e.target.value })} />
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
                        label: "MCP Server Config",
                        children: (
                            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                                <Card size="small" title="Server details">
                                    <Form layout="vertical">
                                        <Form.Item label="Server name (key in mcpServers)" required>
                                            <Input value={mcp.serverName} onChange={(e) => setMcp({ ...mcp, serverName: e.target.value })} style={{ width: 260 }} />
                                        </Form.Item>
                                        <Form.Item label="Transport">
                                            <Select
                                                value={mcp.transport}
                                                onChange={(v) => setMcp({ ...mcp, transport: v })}
                                                style={{ width: 200 }}
                                                options={[
                                                    { value: "stdio", label: "stdio (local subprocess)" },
                                                    { value: "http", label: "HTTP / SSE (remote URL)" },
                                                ]}
                                            />
                                        </Form.Item>
                                        {mcp.transport === "stdio" ? (
                                            <Space size="large" wrap>
                                                <Form.Item label="Command" required>
                                                    <Input value={mcp.command} onChange={(e) => setMcp({ ...mcp, command: e.target.value })} style={{ width: 140 }} />
                                                </Form.Item>
                                                <Form.Item label="Args (space-separated)">
                                                    <Input value={mcp.args} onChange={(e) => setMcp({ ...mcp, args: e.target.value })} style={{ width: 360 }} />
                                                </Form.Item>
                                            </Space>
                                        ) : (
                                            <Form.Item label="Server URL" required>
                                                <Input value={mcp.url} onChange={(e) => setMcp({ ...mcp, url: e.target.value })} style={{ width: 400 }} placeholder="http://localhost:3001/mcp" />
                                            </Form.Item>
                                        )}
                                    </Form>
                                </Card>

                                <Card
                                    size="small"
                                    title="Environment variables"
                                    extra={<Button size="small" icon={<PlusOutlined />} onClick={addEnv}>Add variable</Button>}
                                >
                                    <Space orientation="vertical" size="small" style={{ width: "100%" }}>
                                        {mcp.env.map((e, i) => (
                                            <Space key={i} wrap>
                                                <Input placeholder="KEY" value={e.key} onChange={(ev) => updateEnv(i, { key: ev.target.value })} style={{ width: 200 }} />
                                                <Input placeholder="value" value={e.value} onChange={(ev) => updateEnv(i, { value: ev.target.value })} style={{ width: 260 }} />
                                                <Button aria-label="Delete" size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => removeEnv(i)} />
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
    return (
        <Card
            size="small"
            title={
                <Space>
                    <Text strong>Preview</Text>
                    {errors.length === 0 ? <Tag color="green">Valid</Tag> : <Tag color="red">{errors.length} issue(s)</Tag>}
                </Space>
            }
            extra={
                <Space>
                    <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(json)}>Copy</Button>
                    <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadText(json, filename, "application/json")}>Download</Button>
                    <SendToButton data={json} kind={sendKind} sourceToolId={sendSourceId} size="small" />
                </Space>
            }
        >
            {errors.length > 0 && (
                <Space orientation="vertical" size={2} style={{ marginBottom: 12, width: "100%" }}>
                    {errors.map((e, i) => <Text key={i} type="danger" style={{ fontSize: 12 }}>• {e}</Text>)}
                </Space>
            )}
            <Paragraph style={{ marginBottom: 0 }}>
                <pre style={{ margin: 0, fontFamily: "var(--font-geist-mono)", fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{json}</pre>
            </Paragraph>
        </Card>
    );
}

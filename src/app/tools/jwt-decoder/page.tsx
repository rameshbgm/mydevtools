"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Input,
    Card,
    Typography,
    Tag,
    Space,
    Button,
    App,
    Tabs,
    Tooltip,
    Alert,
    Divider,
} from "antd";
import {
    SafetyCertificateOutlined,
    CopyOutlined,
    EditOutlined,
    ReloadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CodeOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import { copyToClipboard } from "@/lib/clipboard";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema as ShareSchemaT } from "@/lib/shareable-state";

const { Text } = Typography;

const SAMPLE_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.abc123signature";

// ── helpers ──────────────────────────────────────────────────────────────────

function b64urlDecode(s: string): string {
    const base64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return decodeURIComponent(
        atob(padded)
            .split("")
            .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("")
    );
}

function b64urlEncode(obj: object): string {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeJwt(token: string): {
    header: object;
    payload: object;
    signature: string;
    headerRaw: string;
    payloadRaw: string;
} {
    const parts = token.trim().split(".");
    if (parts.length !== 3) throw new Error("JWT must have exactly 3 parts separated by '.'");
    const header = JSON.parse(b64urlDecode(parts[0]));
    const payload = JSON.parse(b64urlDecode(parts[1]));
    return { header, payload, signature: parts[2], headerRaw: parts[0], payloadRaw: parts[1] };
}

function encodeJwt(header: object, payload: object, signatureHint: string): string {
    const h = b64urlEncode(header);
    const p = b64urlEncode(payload);
    // Preserve original signature (tampered notice shown in UI — full HMAC signing needs backend key)
    return `${h}.${p}.${signatureHint}`;
}

function expiryLabel(exp: unknown): { label: string; expired: boolean } | null {
    if (typeof exp !== "number") return null;
    const now = Math.floor(Date.now() / 1000);
    const diff = exp - now;
    const expired = diff < 0;
    if (expired) {
        const ago = Math.abs(diff);
        if (ago < 60) return { label: `Expired ${ago}s ago`, expired: true };
        if (ago < 3600) return { label: `Expired ${Math.floor(ago / 60)}m ago`, expired: true };
        if (ago < 86400) return { label: `Expired ${Math.floor(ago / 3600)}h ago`, expired: true };
        return { label: `Expired ${Math.floor(ago / 86400)}d ago`, expired: true };
    }
    if (diff < 60) return { label: `Expires in ${diff}s`, expired: false };
    if (diff < 3600) return { label: `Expires in ${Math.floor(diff / 60)}m`, expired: false };
    if (diff < 86400) return { label: `Expires in ${Math.floor(diff / 3600)}h`, expired: false };
    return { label: `Expires in ${Math.floor(diff / 86400)}d`, expired: false };
}

// ── component ─────────────────────────────────────────────────────────────────

interface ShareState { token: string; }
const SHARE_SCHEMA: ShareSchemaT<ShareState> = { toolId: "jwt-decoder", version: 1 };

export default function JwtDecoderPage() {
    const { message } = App.useApp();
    const [token, setToken] = useState(SAMPLE_TOKEN);
    const [decoded, setDecoded] = useState<ReturnType<typeof decodeJwt> | null>(null);
    const [error, setError] = useState("");

    // Editor state (JSON strings for Monaco)
    const [headerJson, setHeaderJson] = useState("");
    const [payloadJson, setPayloadJson] = useState("");
    const [editError, setEditError] = useState("");
    const [modifiedToken, setModifiedToken] = useState("");
    const [activeTab, setActiveTab] = useState("decode");

    const decode = useCallback((raw: string) => {
        if (!raw.trim()) { setDecoded(null); setError(""); return; }
        try {
            const result = decodeJwt(raw);
            setDecoded(result);
            setHeaderJson(JSON.stringify(result.header, null, 2));
            setPayloadJson(JSON.stringify(result.payload, null, 2));
            setError("");
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Invalid JWT");
            setDecoded(null);
        }
    }, []);

    useEffect(() => { decode(token); }, []);

    useShareableState(SHARE_SCHEMA, (s) => { setToken(s.token); decode(s.token); });

    const handleReEncode = () => {
        try {
            const header = JSON.parse(headerJson);
            const payload = JSON.parse(payloadJson);
            const newToken = encodeJwt(header, payload, decoded?.signature ?? "UNSIGNED");
            setModifiedToken(newToken);
            setEditError("");
            message.success("Re-encoded! Note: signature is NOT re-signed (needs your secret key).");
        } catch (e: unknown) {
            setEditError(e instanceof Error ? e.message : "Invalid JSON in header or payload");
        }
    };

    const expiry = decoded
        ? expiryLabel((decoded.payload as Record<string, unknown>).exp)
        : null;

    const iat = decoded
        ? (decoded.payload as Record<string, unknown>).iat
        : null;

    return (
        <ToolPageLayout
            title="JWT Decoder & Editor"
            description="Decode, inspect and re-encode JSON Web Tokens"
            icon={<SafetyCertificateOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: "JWT (JSON Web Token) is a compact, URL-safe token format used for authentication and information exchange. It has three parts: header (algorithm), payload (claims), and signature. This tool decodes and inspects JWTs.",
                whyUse: "Debugging authentication issues requires inspecting JWT contents. This tool decodes tokens to reveal claims (user ID, expiration, roles) without needing the secret key.",
                howToUse: [
                    "Paste your JWT token in the input field",
                    "View the decoded header and payload",
                    "Check expiration time and other claims",
                    "Edit claims and re-encode with a secret (for testing)"
                ],
                tips: [
                    "Never share JWTs with sensitive data publicly",
                    "Check 'exp' claim for token expiration",
                    "'iat' is issued-at time, 'nbf' is not-before time",
                    "Signature verification requires the secret key"
                ],
                useCases: [
                    "Debugging OAuth2 and OIDC authentication",
                    "Inspecting API authorization tokens",
                    "Verifying token claims and expiration",
                    "Creating test tokens for development"
                ]
            }}
        >
            <ToolBridgeBanner
                accepts={["text"]}
                onAccept={(p) => { setToken(p.data); decode(p.data); }}
            />

            {/* Token Input */}
            <Card
                size="small"
                style={{ marginBottom: 16 }}
                extra={
                    <Space>
                        <ShareButton
                            schema={SHARE_SCHEMA}
                            getState={() => ({ token })}
                            sensitiveFieldHint="JWT tokens often carry sensitive claims (user IDs, scopes). Only share with people you trust."
                        />
                        {decoded && (
                            <SendToButton
                                data={JSON.stringify(decoded.payload, null, 2)}
                                kind="json"
                                sourceToolId="jwt-decoder"
                                label="JWT payload"
                            />
                        )}
                    </Space>
                }
            >
                <Text type="secondary" style={{ display: "block", marginBottom: 6, fontSize: 12 }}>
                    Paste a JWT token
                </Text>
                <Input.TextArea
                    rows={3}
                    value={token}
                    onChange={(e) => { setToken(e.target.value); decode(e.target.value); }}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                />
                {error && (
                    <Text type="danger" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
                        ❌ {error}
                    </Text>
                )}
                {decoded && (
                    <Space style={{ marginTop: 8 }} wrap>
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            Valid structure
                        </Tag>
                        <Tag color="blue">
                            {(decoded.header as Record<string, unknown>).alg as string ?? "?"}
                        </Tag>
                        <Tag color="purple">
                            {(decoded.header as Record<string, unknown>).typ as string ?? "JWT"}
                        </Tag>
                        {expiry && (
                            <Tag
                                icon={expiry.expired ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                                color={expiry.expired ? "error" : "success"}
                            >
                                {expiry.label}
                            </Tag>
                        )}
                        {typeof iat === "number" && (
                            <Tag color="default">
                                Issued: {new Date(iat * 1000).toLocaleString()}
                            </Tag>
                        )}
                        <Button
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(token)}
                        >
                            Copy Token
                        </Button>
                    </Space>
                )}
            </Card>

            {decoded && (
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: "decode",
                            label: "Decoded View",
                            icon: <CodeOutlined />,
                            children: (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                                    {/* Header */}
                                    <Card
                                        size="small"
                                        title={
                                            <Space>
                                                <Tag color="blue">Header</Tag>
                                                <Text type="secondary" style={{ fontSize: 11 }}>ALGORITHM & TYPE</Text>
                                            </Space>
                                        }
                                        extra={
                                            <Button aria-label="Copy" size="small" icon={<CopyOutlined />}
                                                onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2))} />
                                        }
                                    >
                                        <pre style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, whiteSpace: "pre-wrap", margin: 0 }}>
                                            {JSON.stringify(decoded.header, null, 2)}
                                        </pre>
                                    </Card>

                                    {/* Payload */}
                                    <Card
                                        size="small"
                                        title={
                                            <Space>
                                                <Tag color="green">Payload</Tag>
                                                <Text type="secondary" style={{ fontSize: 11 }}>CLAIMS</Text>
                                            </Space>
                                        }
                                        extra={
                                            <Button aria-label="Copy" size="small" icon={<CopyOutlined />}
                                                onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2))} />
                                        }
                                    >
                                        <PayloadClaims payload={decoded.payload as Record<string, unknown>} />
                                    </Card>

                                    {/* Signature */}
                                    <Card
                                        size="small"
                                        title={<Space><Tag color="red">Signature</Tag><Text type="secondary" style={{ fontSize: 11 }}>BASE64URL</Text></Space>}
                                        extra={<Button aria-label="Copy" size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(decoded.signature)} />}
                                    >
                                        <Text code style={{ fontSize: 12, wordBreak: "break-all" }}>
                                            {decoded.signature}
                                        </Text>
                                        <Divider style={{ margin: "12px 0 8px" }} />
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            ⚠️ Signature verification requires the secret/public key on the server side.
                                        </Text>
                                    </Card>
                                </div>
                            ),
                        },
                        {
                            key: "edit",
                            label: "Edit & Re-encode",
                            icon: <EditOutlined />,
                            children: (
                                <div>
                                    <Alert
                                        type="warning"
                                        showIcon
                                        title="Signature will NOT be re-signed"
                                        description="Editing header/payload and re-encoding produces a structurally valid JWT but the signature becomes invalid. You need the original secret key to produce a verifiable token."
                                        style={{ marginBottom: 16 }}
                                    />
                                    <div className="tool-split-pane" style={{ gap: 16, marginBottom: 16 }}>
                                        <Card size="small" title={<><Tag color="blue">Header</Tag> Edit JSON</>} styles={{ body: { padding: 0 } }}>
                                            <CodeEditor
                                                value={headerJson}
                                                onChange={setHeaderJson}
                                                language="json"
                                                height="200px"
                                            />
                                        </Card>
                                        <Card size="small" title={<><Tag color="green">Payload</Tag> Edit Claims</>} styles={{ body: { padding: 0 } }}>
                                            <CodeEditor
                                                value={payloadJson}
                                                onChange={setPayloadJson}
                                                language="json"
                                                height="200px"
                                            />
                                        </Card>
                                    </div>

                                    <Space style={{ marginBottom: 16 }}>
                                        <Button
                                            type="primary"
                                            icon={<ReloadOutlined />}
                                            onClick={handleReEncode}
                                        >
                                            Re-encode Token
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setHeaderJson(JSON.stringify(decoded.header, null, 2));
                                                setPayloadJson(JSON.stringify(decoded.payload, null, 2));
                                                setModifiedToken("");
                                                setEditError("");
                                            }}
                                        >
                                            Reset to Original
                                        </Button>
                                    </Space>

                                    {editError && (
                                        <Alert
                                            type="error"
                                            title="JSON Parse Error"
                                            description={editError}
                                            showIcon
                                            style={{ marginBottom: 16 }}
                                        />
                                    )}

                                    {modifiedToken && (
                                        <Card
                                            size="small"
                                            title="Modified JWT Token"
                                            extra={
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => copyToClipboard(modifiedToken)}
                                                >
                                                    Copy
                                                </Button>
                                            }
                                        >
                                            <Text code style={{ fontSize: 12, wordBreak: "break-all", display: "block" }}>
                                                <span style={{ color: "#1677ff" }}>
                                                    {modifiedToken.split(".")[0]}
                                                </span>
                                                <span style={{ color: "#666" }}>.</span>
                                                <span style={{ color: "#52c41a" }}>
                                                    {modifiedToken.split(".")[1]}
                                                </span>
                                                <span style={{ color: "#666" }}>.</span>
                                                <span style={{ color: "#f5222d", textDecoration: "line-through", opacity: 0.6 }}>
                                                    {modifiedToken.split(".")[2]}
                                                </span>
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 8 }}>
                                                🔵 Header &nbsp;|&nbsp; 🟢 Payload &nbsp;|&nbsp; 🔴 Signature (invalidated — original preserved as placeholder)
                                            </Text>
                                        </Card>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                />
            )}
        </ToolPageLayout>
    );
}

// ── Payload Claims table ───────────────────────────────────────────────────────

const CLAIM_DESCRIPTIONS: Record<string, string> = {
    sub: "Subject — who the token refers to",
    iss: "Issuer — who issued the token",
    aud: "Audience — intended recipients",
    exp: "Expiration Time",
    nbf: "Not Before — token is invalid before this time",
    iat: "Issued At",
    jti: "JWT ID — unique identifier",
    name: "Full name",
    email: "Email address",
    role: "Role",
    roles: "Roles",
    scope: "OAuth2 scopes",
};

function PayloadClaims({ payload }: { payload: Record<string, unknown> }) {
    return (
        <div style={{ fontSize: 13 }}>
            {Object.entries(payload).map(([key, val]) => {
                let display: React.ReactNode = String(val);
                if (key === "exp" || key === "iat" || key === "nbf") {
                    if (typeof val === "number") {
                        const d = new Date(val * 1000);
                        display = (
                            <span>
                                <Text code>{val}</Text>
                                <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
                                    ({d.toLocaleString()})
                                </Text>
                            </span>
                        );
                    }
                } else if (typeof val === "object") {
                    display = <Text code style={{ fontSize: 11 }}>{JSON.stringify(val)}</Text>;
                } else {
                    display = <Text code>{String(val)}</Text>;
                }

                return (
                    <div key={key} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                        <Tooltip title={CLAIM_DESCRIPTIONS[key] ?? "Custom claim"}>
                            <Tag color={CLAIM_DESCRIPTIONS[key] ? "cyan" : "default"} style={{ flexShrink: 0, fontFamily: "var(--font-geist-mono)" }}>
                                {key}
                            </Tag>
                        </Tooltip>
                        <span style={{ wordBreak: "break-all" }}>{display}</span>
                    </div>
                );
            })}
        </div>
    );
}

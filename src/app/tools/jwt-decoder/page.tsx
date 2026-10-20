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
import { useLanguage } from "@/components/LanguageProvider";
import { localizeJoseError } from "@/lib/i18n/jose-tools";
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
    if (!header || typeof header !== "object" || Array.isArray(header) || !payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("JWT header and claims must be JSON objects");
    return { header, payload, signature: parts[2], headerRaw: parts[0], payloadRaw: parts[1] };
}

function encodeJwt(header: object, payload: object, signatureHint: string): string {
    if (!header || typeof header !== "object" || Array.isArray(header) || !payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("JWT header and claims must be JSON objects");
    const h = b64urlEncode(header);
    const p = b64urlEncode(payload);
    // Preserve original signature (tampered notice shown in UI — signing requires a key and the separate JWS tool)
    return `${h}.${p}.${signatureHint}`;
}

function expiryLabel(exp: unknown, t: (source: string, values?: Record<string, string | number>) => string, language: string): { label: string; expired: boolean } | null {
    if (typeof exp !== "number" || !Number.isFinite(exp)) return null;
    const now = Math.floor(Date.now() / 1000);
    const diff = exp - now;
    const expired = diff < 0;
    if (expired) {
        const ago = Math.abs(diff);
        if (ago < 60) return { label: t("Expired {count} seconds ago", { count: new Intl.NumberFormat(language).format(ago) }), expired: true };
        if (ago < 3600) return { label: t("Expired {count} minutes ago", { count: new Intl.NumberFormat(language).format(Math.floor(ago / 60)) }), expired: true };
        if (ago < 86400) return { label: t("Expired {count} hours ago", { count: new Intl.NumberFormat(language).format(Math.floor(ago / 3600)) }), expired: true };
        return { label: t("Expired {count} days ago", { count: new Intl.NumberFormat(language).format(Math.floor(ago / 86400)) }), expired: true };
    }
    if (diff < 60) return { label: t("Expires in {count} seconds", { count: new Intl.NumberFormat(language).format(diff) }), expired: false };
    if (diff < 3600) return { label: t("Expires in {count} minutes", { count: new Intl.NumberFormat(language).format(Math.floor(diff / 60)) }), expired: false };
    if (diff < 86400) return { label: t("Expires in {count} hours", { count: new Intl.NumberFormat(language).format(Math.floor(diff / 3600)) }), expired: false };
    return { label: t("Expires in {count} days", { count: new Intl.NumberFormat(language).format(Math.floor(diff / 86400)) }), expired: false };
}

// ── component ─────────────────────────────────────────────────────────────────

interface ShareState { token: string; }
const SHARE_SCHEMA: ShareSchemaT<ShareState> = { toolId: "jwt-decoder", version: 1 };

export default function JwtDecoderPage() {
    const { t, language } = useLanguage();
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

    useEffect(() => { decode(token); }, [token, decode]);

    useShareableState(SHARE_SCHEMA, (s) => { setToken(s.token); decode(s.token); });

    const handleReEncode = () => {
        try {
            const header = JSON.parse(headerJson);
            const payload = JSON.parse(payloadJson);
            const newToken = encodeJwt(header, payload, decoded?.signature ?? "UNSIGNED");
            setModifiedToken(newToken);
            setEditError("");
            message.success(t("Re-encoded! Note: signature is NOT re-signed (needs your secret key)."));
        } catch (e: unknown) {
            setEditError(e instanceof Error ? e.message : "Invalid JSON in header or payload");
        }
    };

    const expiry = decoded
        ? expiryLabel((decoded.payload as Record<string, unknown>).exp, t, language)
        : null;

    const iat = decoded
        ? (decoded.payload as Record<string, unknown>).iat
        : null;

    return (
        <ToolPageLayout
            title={t("JWT Decoder & Editor")}
            description={t("Decode, inspect and re-encode JSON Web Tokens")}
            icon={<SafetyCertificateOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: "JWT (JSON Web Token) is a compact, URL-safe token format used for authentication and information exchange. It has three parts: header (algorithm), payload (claims), and signature. This tool decodes and inspects JWTs.",
                whyUse: "Debugging authentication issues requires inspecting JWT contents. This tool decodes tokens to reveal claims (user ID, expiration, roles) without needing the secret key.",
                howToUse: [
                    "Paste your JWT token in the input field",
                    "View the decoded header and payload",
                    "Check expiration time and other claims",
                    "Edit claims and re-encode for testing; the original signature is preserved, not renewed"
                ],
                tips: [
                    "Never share JWTs with sensitive data publicly",
                    "Check 'exp' claim for token expiration",
                    "'iat' is issued-at time, 'nbf' is not-before time",
                    "Signature verification requires a trusted secret or public key; this decoder does not verify signatures."
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

            <Alert type="warning" showIcon title={t("Decoded claims are untrusted")} description={t("Decoding does not verify a signature. Follow RFC 8725: allow only expected algorithms and trusted keys, then validate issuer, audience, expiry and token purpose in your application.")} style={{ marginBottom: 16 }} />
            {/* Token Input */}
            <Card
                size="small"
                style={{ marginBottom: 16 }}
                extra={
                    <Space>
                        <ShareButton
                            schema={SHARE_SCHEMA}
                            getState={() => ({ token })}
                            sensitiveFieldHint={t("JWT tokens often carry sensitive claims (user IDs, scopes). Only share with people you trust.")}
                        />
                        {decoded && (
                            <SendToButton
                                data={JSON.stringify(decoded.payload, null, 2)}
                                kind="json"
                                sourceToolId="jwt-decoder"
                                label={t("JWT payload")}
                            />
                        )}
                    </Space>
                }
            >
                <Text type="secondary" style={{ display: "block", marginBottom: 6, fontSize: 12 }}>
                    {t("Paste a JWT token")}</Text>
                <Input.TextArea aria-label={t("JWT token")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                    rows={3}
                    value={token}
                    onChange={(e) => { setToken(e.target.value); decode(e.target.value); }}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                />
                {error && (
                    <Text type="danger" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
                        {t("Unable to decode this JWT. Check its three parts and JSON content.")}<br /><span dir="ltr">{localizeJoseError(t, error)}</span>
                    </Text>
                )}
                {decoded && (
                    <Space style={{ marginTop: 8 }} wrap>
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            {t("Valid structure")}</Tag>
                        <Tag color="blue">
                            {typeof (decoded.header as Record<string, unknown>).alg === "string" ? String((decoded.header as Record<string, unknown>).alg) : "?"}
                        </Tag>
                        <Tag color="purple">
                            {typeof (decoded.header as Record<string, unknown>).typ === "string" ? String((decoded.header as Record<string, unknown>).typ) : "JWT"}
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
                                {t("Issued:")}{new Date(iat * 1000).toLocaleString(language)}
                            </Tag>
                        )}
                        <Button
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(token)}
                        >
                            {t("Copy Token")}</Button>
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
                            label: t("Decoded View"),
                            icon: <CodeOutlined />,
                            children: (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: 16 }}>
                                    {/* Header */}
                                    <Card
                                        size="small"
                                        title={
                                            <Space>
                                                <Tag color="blue">{t("Header")}</Tag>
                                                <Text type="secondary" style={{ fontSize: 11 }}>{t("ALGORITHM & TYPE")}</Text>
                                            </Space>
                                        }
                                        extra={
                                            <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />}
                                                onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2))} />
                                        }
                                    >
                                        <pre dir="ltr" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, whiteSpace: "pre-wrap", margin: 0 }}>
                                            {JSON.stringify(decoded.header, null, 2)}
                                        </pre>
                                    </Card>

                                    {/* Payload */}
                                    <Card
                                        size="small"
                                        title={
                                            <Space>
                                                <Tag color="green">{t("Payload")}</Tag>
                                                <Text type="secondary" style={{ fontSize: 11 }}>{t("CLAIMS")}</Text>
                                            </Space>
                                        }
                                        extra={
                                            <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />}
                                                onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2))} />
                                        }
                                    >
                                        <PayloadClaims payload={decoded.payload as Record<string, unknown>} />
                                    </Card>

                                    {/* Signature */}
                                    <Card
                                        size="small"
                                        title={<Space><Tag color="red">{t("Signature")}</Tag><Text type="secondary" style={{ fontSize: 11 }}>BASE64URL</Text></Space>}
                                        extra={<Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(decoded.signature)} />}
                                    >
                                        <Text dir="ltr" code style={{ fontSize: 12, wordBreak: "break-all" }}>
                                            {decoded.signature}
                                        </Text>
                                        <Divider style={{ margin: "12px 0 8px" }} />
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            {t("Signature verification requires a trusted secret or public key; this decoder does not verify signatures.")}</Text>
                                    </Card>
                                </div>
                            ),
                        },
                        {
                            key: "edit",
                            label: t("Edit & Re-encode"),
                            icon: <EditOutlined />,
                            children: (
                                <div>
                                    <Alert
                                        type="warning"
                                        showIcon
                                        title={t("Signature will NOT be re-signed")}
                                        description={t("Editing header/payload and re-encoding produces a structurally valid JWT but the signature becomes invalid. You need the original secret key to produce a verifiable token.")}
                                        style={{ marginBottom: 16 }}
                                    />
                                    <div className="tool-split-pane" style={{ gap: 16, marginBottom: 16 }}>
                                        <Card size="small" title={<><Tag color="blue">{t("Header")}</Tag> {t("Edit JSON")}</>} styles={{ body: { padding: 0 } }}>
                                            <CodeEditor
                                                ariaLabel={t("Header")}
                                                value={headerJson}
                                                onChange={setHeaderJson}
                                                language="json"
                                                height="200px"
                                            />
                                        </Card>
                                        <Card size="small" title={<><Tag color="green">{t("Payload")}</Tag> {t("Edit Claims")}</>} styles={{ body: { padding: 0 } }}>
                                            <CodeEditor
                                                ariaLabel={t("Payload")}
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
                                            {t("Re-encode Token")}</Button>
                                        <Button
                                            onClick={() => {
                                                setHeaderJson(JSON.stringify(decoded.header, null, 2));
                                                setPayloadJson(JSON.stringify(decoded.payload, null, 2));
                                                setModifiedToken("");
                                                setEditError("");
                                            }}
                                        >
                                            {t("Reset to Original")}</Button>
                                    </Space>

                                    {editError && (
                                        <Alert
                                            type="error"
                                            title={t("JSON Parse Error")}
                                            description={<>{t("Check the header and payload JSON, then try again.")}<br /><span dir="ltr">{editError}</span></>}
                                            showIcon
                                            style={{ marginBottom: 16 }}
                                        />
                                    )}

                                    {modifiedToken && (
                                        <Card
                                            size="small"
                                            title={t("Modified JWT Token")}
                                            extra={
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => copyToClipboard(modifiedToken)}
                                                >
                                                    {t("Copy")}</Button>
                                            }
                                        >
                                            <Text dir="ltr" code style={{ fontSize: 12, wordBreak: "break-all", display: "block", direction: "ltr" }}>
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
                                                {t("Header | Payload | Signature (invalidated — original preserved as placeholder)")}</Text>
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
    const { t, language } = useLanguage();
    return (
        <div dir="ltr" style={{ fontSize: 13 }}>
            {Object.entries(payload).map(([key, val]) => {
                let display: React.ReactNode = String(val);
                if (key === "exp" || key === "iat" || key === "nbf") {
                    if (typeof val === "number") {
                        const d = new Date(val * 1000);
                        display = (
                            <span>
                                <Text dir="ltr" code>{val}</Text>
                                <Text type="secondary" style={{ fontSize: 11, marginInlineStart: 6 }}>
                                    ({d.toLocaleString(language)})</Text>
                            </span>
                        );
                    }
                } else if (typeof val === "object") {
                    display = <Text dir="ltr" code style={{ fontSize: 11 }}>{JSON.stringify(val)}</Text>;
                } else {
                    display = <Text dir="ltr" code>{String(val)}</Text>;
                }

                return (
                    <div key={key} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                        <Tooltip title={t(CLAIM_DESCRIPTIONS[key] ?? "Custom claim")}>
                            <Tag color={CLAIM_DESCRIPTIONS[key] ? "cyan" : "default"} style={{ flexShrink: 0, fontFamily: "var(--font-geist-mono)" }}>
                                {key}
                            </Tag>
                        </Tooltip>
                        <span dir="ltr" style={{ wordBreak: "break-all" }}>{display}</span>
                    </div>
                );
            })}
        </div>
    );
}

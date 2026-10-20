"use client";
import { useLanguage } from "@/components/LanguageProvider";

import { useState, useRef, useEffect } from "react";
import { Alert, App, Button, Card, Descriptions, Input, Space, Tag, Typography } from "antd";
import { KeyOutlined, ReloadOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { asRecord, getArray, getString, parseStructuredData } from "@/lib/structured-data";

const { TextArea } = Input;
const { Text } = Typography;
const SAMPLE_DISCOVERY = `{
  "issuer": "https://id.example.com",
  "authorization_endpoint": "https://id.example.com/authorize",
  "token_endpoint": "https://id.example.com/token",
  "jwks_uri": "https://id.example.com/.well-known/jwks.json",
  "response_types_supported": ["code"],
  "code_challenge_methods_supported": ["S256"]
}`;

function base64Url(bytes: Uint8Array): string {
    let text = "";
    for (const byte of bytes) text += String.fromCharCode(byte);
    return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function createPkcePair(): Promise<{ verifier: string; challenge: string; state: string; nonce: string }> {
    const random = crypto.getRandomValues(new Uint8Array(48));
    const verifier = base64Url(random);
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    return { verifier, challenge: base64Url(new Uint8Array(digest)), state: base64Url(crypto.getRandomValues(new Uint8Array(32))), nonce: base64Url(crypto.getRandomValues(new Uint8Array(32))) };
}

type DiscoveryResult = { issuer?: string; issues: string[]; supportsS256: boolean; endpoints: Record<string, string> };
function inspectDiscovery(input: string): DiscoveryResult {
    const document = asRecord(parseStructuredData(input));
    const issues: string[] = [];
    const issuer = getString(document.issuer);
    if (!issuer?.startsWith("https://")) issues.push("Issuer should be an HTTPS URL.");
    const endpoints: Record<string, string> = {};
    for (const key of ["authorization_endpoint", "token_endpoint", "jwks_uri", "userinfo_endpoint"]) {
        const endpoint = getString(document[key]);
        if (endpoint) endpoints[key] = endpoint;
    }
    if (!endpoints.authorization_endpoint) issues.push("Missing authorization_endpoint.");
    if (!endpoints.token_endpoint) issues.push("Missing token_endpoint.");
    if (!endpoints.jwks_uri) issues.push("Missing jwks_uri for signed-token key discovery.");
    const methods = getArray(document.code_challenge_methods_supported).filter((item): item is string => typeof item === "string");
    const supportsS256 = methods.includes("S256");
    if (!supportsS256) issues.push("Provider does not advertise the recommended S256 PKCE method.");
    return { issuer, issues, supportsS256, endpoints };
}

export default function OAuthOidcPlaygroundPage() {
    const { t } = useLanguage();
    const translateRef = useRef(t);
    useEffect(() => { translateRef.current = t; }, [t]);
    const notice = (source: string, values?: Record<string, string | number>) => translateRef.current(source, values);

    const { message } = App.useApp();
    const [discovery, setDiscovery] = useState(SAMPLE_DISCOVERY);
    const [redirectUri, setRedirectUri] = useState("http://localhost:3000/callback");
    const [clientId, setClientId] = useState("my-client-id");
    const [scope, setScope] = useState("openid profile email");
    const [result, setResult] = useState<DiscoveryResult | null>(null);
    const [pkce, setPkce] = useState<{ verifier: string; challenge: string; state: string; nonce: string } | null>(null);

    const inspect = () => {
        try { setResult(inspectDiscovery(discovery)); }
        catch (error) { message.error(error instanceof Error ? error.message : notice("Invalid discovery metadata.")); }
    };
    const generatePkce = async () => {
        try { setPkce(await createPkcePair()); message.success(notice("PKCE S256 pair generated locally")); }
        catch { message.error(notice("This browser cannot generate a PKCE pair.")); }
    };
    let authorizationUrl: string | null = null;
    if (result?.endpoints.authorization_endpoint && pkce) {
        try {
            const url = new URL(result.endpoints.authorization_endpoint);
            if (url.protocol !== "https:") throw new Error("HTTPS required");
            for (const [key, value] of Object.entries({ response_type: "code", client_id: clientId, redirect_uri: redirectUri, scope, state: pkce.state, nonce: pkce.nonce, code_challenge: pkce.challenge, code_challenge_method: "S256" })) url.searchParams.set(key, value);
            authorizationUrl = url.toString();
        } catch { /* Unsafe metadata must not produce a runnable authorization URL. */ }
    }

    return (
        <ToolPageLayout
            title={t("OAuth / OIDC & PKCE Playground")}
            description={t("Inspect discovery metadata, generate PKCE S256 values, and assemble a safe authorization request")}
            icon={<KeyOutlined style={{ fontSize: 24, color: "#1d39c4" }} />}
            color="#1d39c4"
            learnMore={{
                whatIs: "A local OAuth and OpenID Connect configuration workbench. It reviews pasted discovery metadata and creates a cryptographically random PKCE verifier and S256 challenge.",
                whyUse: "OAuth integration mistakes often appear in redirect URIs, metadata, or PKCE configuration. This gives developers a private preflight before wiring an application to an identity provider.",
                howToUse: ["Paste an OIDC discovery document", "Inspect the required endpoints and S256 support", "Generate a PKCE pair", "Fill your public client ID, redirect URI, and scopes to preview an authorization URL"],
                tips: ["Never paste a client secret into a browser tool.", "Use exact registered redirect URIs, not wildcard patterns.", "The preview URL is never opened automatically and discovery URLs are never fetched."],
                useCases: ["OIDC provider integration", "PKCE test fixtures", "Authorization-code flow troubleshooting"],
            }}
        >
            <Alert type="info" showIcon title={t("RFC 9700 · OAuth Security BCP")} description={t("Prefer Authorization Code + PKCE S256. Register exact redirects; avoid implicit grants and never use the password grant. Bind and validate state and OIDC nonce in your application; this preview does not complete a login or validate tokens.")} style={{ marginBottom: 16 }} />
            <Card title={t("Provider discovery metadata")}>
                <TextArea dir="ltr" aria-label={t("OIDC discovery metadata")} value={discovery} onChange={(event) => setDiscovery(event.target.value)} autoSize={{ minRows: 13, maxRows: 28 }} style={{ direction: "ltr", textAlign: "left",  fontFamily: "var(--font-geist-mono)", fontSize: 16 }} />
                <Space wrap style={{ marginTop: 12 }}><Button type="primary" onClick={inspect}>{t("Inspect metadata")}</Button><Button onClick={generatePkce}>{t("Generate PKCE S256")}</Button><Button icon={<ReloadOutlined />} onClick={() => { setDiscovery(SAMPLE_DISCOVERY); setResult(null); setPkce(null); }}>{t("Reset example")}</Button></Space>
            </Card>
            <Card title={t("Authorization request")} style={{ marginTop: 16 }}>
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}><div><Text strong>{t("Client ID")}</Text><Input styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }} aria-label={t("OAuth client ID")} value={clientId} onChange={(event) => setClientId(event.target.value)} /></div><div><Text strong>{t("Redirect URI")}</Text><Input styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }} aria-label={t("OAuth redirect URI")} value={redirectUri} onChange={(event) => setRedirectUri(event.target.value)} /></div><div><Text strong>{t("Scopes")}</Text><Input styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }} aria-label={t("OAuth scopes")} value={scope} onChange={(event) => setScope(event.target.value)} /></div>{pkce && <Descriptions bordered size="small" column={1} styles={{ label: { width: 130 } }}><Descriptions.Item label={t("Verifier")}><Text dir="ltr" code copyable>{pkce.verifier}</Text></Descriptions.Item><Descriptions.Item label={t("S256 challenge")}><Text dir="ltr" code copyable>{pkce.challenge}</Text></Descriptions.Item><Descriptions.Item label={t("State")}><Text dir="ltr" code copyable>{pkce.state}</Text></Descriptions.Item><Descriptions.Item label={t("OIDC nonce")}><Text dir="ltr" code copyable>{pkce.nonce}</Text></Descriptions.Item></Descriptions>}{authorizationUrl && <Alert type="info" showIcon title={t("Authorization URL preview")} description={<Text dir="ltr" code copyable style={{ wordBreak: "break-all" }}>{authorizationUrl}</Text>} />}</Space>
            </Card>
            {result && <Card title={t("Discovery review")} style={{ marginTop: 16 }}><Space orientation="vertical" size="middle" style={{ width: "100%" }}><Descriptions bordered size="small" column={1} styles={{ label: { width: 180 } }}><Descriptions.Item label={t("Issuer")}>{result.issuer ?? "—"}</Descriptions.Item><Descriptions.Item label="S256 PKCE"><Tag color={result.supportsS256 ? "success" : "warning"}>{result.supportsS256 ? t("Advertised") : t("Not advertised")}</Tag></Descriptions.Item>{Object.entries(result.endpoints).map(([name, value]) => <Descriptions.Item key={name} label={name}><Text dir="ltr" code>{value}</Text></Descriptions.Item>)}</Descriptions>{result.issues.length ? result.issues.map((issue) => <Alert key={issue} type="warning" showIcon title={t(issue)} />) : <Alert type="success" showIcon title={t("Core discovery fields look complete")} />}</Space></Card>}
        </ToolPageLayout>
    );
}

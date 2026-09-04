"use client";

import { useState } from "react";
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

async function createPkcePair(): Promise<{ verifier: string; challenge: string }> {
    const random = crypto.getRandomValues(new Uint8Array(48));
    const verifier = base64Url(random);
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    return { verifier, challenge: base64Url(new Uint8Array(digest)) };
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
    const { message } = App.useApp();
    const [discovery, setDiscovery] = useState(SAMPLE_DISCOVERY);
    const [redirectUri, setRedirectUri] = useState("http://localhost:3000/callback");
    const [clientId, setClientId] = useState("my-client-id");
    const [scope, setScope] = useState("openid profile email");
    const [result, setResult] = useState<DiscoveryResult | null>(null);
    const [pkce, setPkce] = useState<{ verifier: string; challenge: string } | null>(null);

    const inspect = () => {
        try { setResult(inspectDiscovery(discovery)); }
        catch (error) { message.error(error instanceof Error ? error.message : "Invalid discovery metadata."); }
    };
    const generatePkce = async () => {
        try { setPkce(await createPkcePair()); message.success("PKCE S256 pair generated locally"); }
        catch { message.error("This browser cannot generate a PKCE pair."); }
    };
    const authorizationUrl = result?.endpoints.authorization_endpoint && pkce ? `${result.endpoints.authorization_endpoint}?${new URLSearchParams({ response_type: "code", client_id: clientId, redirect_uri: redirectUri, scope, code_challenge: pkce.challenge, code_challenge_method: "S256" }).toString()}` : null;

    return (
        <ToolPageLayout
            title="OAuth / OIDC & PKCE Playground"
            description="Inspect discovery metadata, generate PKCE S256 values, and assemble a safe authorization request"
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
            <Card title="Provider discovery metadata">
                <TextArea aria-label="OIDC discovery metadata" value={discovery} onChange={(event) => setDiscovery(event.target.value)} autoSize={{ minRows: 13, maxRows: 28 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} />
                <Space wrap style={{ marginTop: 12 }}><Button type="primary" onClick={inspect}>Inspect metadata</Button><Button onClick={generatePkce}>Generate PKCE S256</Button><Button icon={<ReloadOutlined />} onClick={() => { setDiscovery(SAMPLE_DISCOVERY); setResult(null); setPkce(null); }}>Reset example</Button></Space>
            </Card>
            <Card title="Authorization request" style={{ marginTop: 16 }}>
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}><div><Text strong>Client ID</Text><Input aria-label="OAuth client ID" value={clientId} onChange={(event) => setClientId(event.target.value)} /></div><div><Text strong>Redirect URI</Text><Input aria-label="OAuth redirect URI" value={redirectUri} onChange={(event) => setRedirectUri(event.target.value)} /></div><div><Text strong>Scopes</Text><Input aria-label="OAuth scopes" value={scope} onChange={(event) => setScope(event.target.value)} /></div>{pkce && <Descriptions bordered size="small" column={1} styles={{ label: { width: 130 } }}><Descriptions.Item label="Verifier"><Text code copyable>{pkce.verifier}</Text></Descriptions.Item><Descriptions.Item label="S256 challenge"><Text code copyable>{pkce.challenge}</Text></Descriptions.Item></Descriptions>}{authorizationUrl && <Alert type="info" showIcon title="Authorization URL preview" description={<Text code copyable style={{ wordBreak: "break-all" }}>{authorizationUrl}</Text>} />}</Space>
            </Card>
            {result && <Card title="Discovery review" style={{ marginTop: 16 }}><Space orientation="vertical" size="middle" style={{ width: "100%" }}><Descriptions bordered size="small" column={1} styles={{ label: { width: 180 } }}><Descriptions.Item label="Issuer">{result.issuer ?? "—"}</Descriptions.Item><Descriptions.Item label="S256 PKCE"><Tag color={result.supportsS256 ? "success" : "warning"}>{result.supportsS256 ? "Advertised" : "Not advertised"}</Tag></Descriptions.Item>{Object.entries(result.endpoints).map(([name, value]) => <Descriptions.Item key={name} label={name}><Text code>{value}</Text></Descriptions.Item>)}</Descriptions>{result.issues.length ? result.issues.map((issue) => <Alert key={issue} type="warning" showIcon title={issue} />) : <Alert type="success" showIcon title="Core discovery fields look complete" />}</Space></Card>}
        </ToolPageLayout>
    );
}

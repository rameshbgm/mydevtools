"use client";

import { useEffect, useState } from "react";
import { Alert, App, Button, Card, Descriptions, Input, Space, Tag, Typography } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { inspectPasskeyCredential } from "@/lib/webauthn-tools";
import { parseStructuredData } from "@/lib/structured-data";

const { TextArea } = Input;
const { Text } = Typography;
const SAMPLE = `{
  "id": "ZmFrZS1jcmVkZW50aWFsLWlk",
  "type": "public-key",
  "response": {
    "clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiZGVtbyIsIm9yaWdpbiI6Imh0dHBzOi8vYXBwLmV4YW1wbGUuY29tIn0",
    "authenticatorData": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  }
}`;

export default function WebauthnPasskeyPlaygroundPage() {
    const { t } = useLanguage();
    const { message } = App.useApp();
    const [credential, setCredential] = useState(SAMPLE);
    const [result, setResult] = useState<ReturnType<typeof inspectPasskeyCredential> | null>(null);
    const inspect = () => { try { setResult(inspectPasskeyCredential(parseStructuredData(credential))); } catch (error) { message.error(error instanceof Error ? error.message : t("Invalid credential JSON.")); } };
    const [supported, setSupported] = useState(false);
    useEffect(() => { setSupported("PublicKeyCredential" in window); }, []);
    return <ToolPageLayout title={t("WebAuthn / Passkey Playground")} description={t("Inspect WebAuthn credential response JSON and decode browser-safe client-data metadata")} icon={<SafetyCertificateOutlined style={{ fontSize: 24, color: "#237804" }} />} color="#237804" learnMore={{ whatIs: "A local WebAuthn inspection workspace for credential JSON captured by your application. It decodes base64url clientDataJSON and reports basic credential metadata.", whyUse: "Passkey integrations involve opaque browser payloads. Decoding their public metadata helps developers debug challenge, origin, and ceremony mismatches without exposing private keys.", howToUse: ["Paste a serialised credential response", "Inspect the credential", "Review decoded clientDataJSON and authenticator-data size", "Compare the origin and challenge with your server-side expectations"], tips: ["Never paste a private key, token, or production user data.", "Real registration and assertion ceremonies need a configured relying-party origin and server-side challenge validation.", "This tool does not create or transmit a credential."], useCases: ["Passkey integration debugging", "WebAuthn fixture inspection", "Origin and challenge troubleshooting"] }}>
        <Card title={t("Credential response")}><TextArea dir="ltr" aria-label={t("WebAuthn credential response JSON")} value={credential} onChange={(event) => setCredential(event.target.value)} autoSize={{ minRows: 16, maxRows: 32 }} style={{ direction: "ltr", textAlign: "left", fontFamily: "var(--font-geist-mono)", fontSize: 16 }} /><Space wrap style={{ marginTop: 12 }}><Button type="primary" onClick={inspect}>{t("Inspect credential")}</Button><Tag color={supported ? "success" : "warning"}>{t(supported ? "WebAuthn supported by this browser" : "WebAuthn unavailable in this browser")}</Tag></Space></Card>
        {result && <Card title={t("Credential inspection")} style={{ marginTop: 16 }}><Space orientation="vertical" size="middle" style={{ width: "100%" }}><Descriptions bordered size="small" column={1} styles={{ label: { width: 170 } }}><Descriptions.Item label={t("Credential ID")}><Text code dir="ltr">{result.credentialId || "—"}</Text></Descriptions.Item><Descriptions.Item label={t("Authenticator data")}>{result.authenticatorDataBytes === undefined ? t("Not supplied") : t("{count} bytes", { count: result.authenticatorDataBytes })}</Descriptions.Item>{result.clientData && <Descriptions.Item label={t("Client data JSON")}><Text code dir="ltr">{JSON.stringify(result.clientData)}</Text></Descriptions.Item>}</Descriptions>{result.issues.length ? result.issues.map((issue) => <Alert key={issue} type="warning" showIcon title={t(issue)} />) : <Alert type="success" showIcon title={t("Credential metadata decoded")} />}</Space></Card>}
    </ToolPageLayout>;
}

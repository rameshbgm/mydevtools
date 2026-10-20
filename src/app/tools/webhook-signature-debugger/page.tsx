"use client";
import { useState } from "react";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { verifyWebhookSignature, type WebhookProvider } from "@/lib/webhook-signatures";
export default function WebhookSignaturePage() {
    const { t } = useLanguage();
    const [provider, setProvider] = useState<WebhookProvider>("github");
    const [body, setBody] = useState('{"event":"example"}'); const [secret, setSecret] = useState("");
    const [signature, setSignature] = useState(""); const [timestamp, setTimestamp] = useState("");
    const [result, setResult] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
    const verify = async () => { setBusy(true); setError(""); setResult(""); try { setResult(JSON.stringify(await verifyWebhookSignature({ provider, body, secret, signature, timestamp }), null, 2)); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } finally { setBusy(false); } };
    return <ToolPageLayout title={t("Webhook Signature Debugger")} description={t("Verify GitHub, Stripe, Slack, or HMAC-SHA256 webhook signatures locally")} icon={<SafetyCertificateOutlined />} color="#13a8a8"><div className="wb-workbench">
        <ToolBridgeBanner accepts={["json"]} onAccept={(payload) => { try { const fixture = JSON.parse(payload.data); if (!["github", "stripe", "slack", "hmac"].includes(fixture.provider) || ![fixture.body, fixture.secret, fixture.signature].every((value) => typeof value === "string")) throw new Error(); setProvider(fixture.provider); setBody(fixture.body); setSecret(fixture.secret); setSignature(fixture.signature); setTimestamp(fixture.timestamp || ""); setResult(""); } catch { setError("Invalid webhook fixture."); } }} />
        <label>{t("Signature scheme")}<select value={provider} onChange={(event) => { setProvider(event.target.value as WebhookProvider); setResult(""); }}><option value="github">GitHub · X-Hub-Signature-256</option><option value="stripe">Stripe · Stripe-Signature</option><option value="slack">Slack · X-Slack-Signature</option><option value="hmac">{t("Raw HMAC-SHA256 hex")}</option></select></label>
        <label>{t("Signing secret")}<input dir="ltr" type="password" autoComplete="off" value={secret} onChange={(event) => { setSecret(event.target.value); setResult(""); }} /></label>
        <label>{t("Signature header")}<input dir="ltr" value={signature} onChange={(event) => { setSignature(event.target.value); setResult(""); }} spellCheck={false} /></label>
        {provider === "slack" && <label>X-Slack-Request-Timestamp<input dir="ltr" value={timestamp} onChange={(event) => { setTimestamp(event.target.value); setResult(""); }} inputMode="numeric" /></label>}
        <label>{t("Load the exact raw UTF-8 request body")}<input type="file" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 1024 * 1024) { setError("Body limit is 1 MiB."); return; } try { setBody(new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(await file.arrayBuffer())); } catch { setError("The file is not valid UTF-8. Body bytes were not changed or verified."); } setResult(""); }} /></label>
        <label>{t("Raw body · editing whitespace changes the signature")}<textarea dir="ltr" rows={12} value={body} onChange={(event) => { setBody(event.target.value); setResult(""); }} spellCheck={false} /></label>
        <button disabled={busy} onClick={verify}>{t(busy ? "Verifying…" : "Verify signature")}</button>
        {error && <p role="alert">{t(error)}</p>}{result && <><p>{t(JSON.parse(result).explanation)}</p><pre dir="ltr" tabIndex={0} aria-label={t("Signature verification result")}>{result}</pre></>}
        <p>{t("Secrets are kept only in this page's memory. Stripe and Slack timestamps use a five-minute tolerance. Use test credentials; verify production webhooks on your server.")}</p>
    </div></ToolPageLayout>;
}

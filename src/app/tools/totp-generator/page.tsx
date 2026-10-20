"use client";
import { useEffect, useState } from "react";
import { SafetyOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { totp } from "@/lib/totp";
import { copyToClipboard } from "@/lib/clipboard";
export default function TotpGeneratorPage() {
    const { t } = useLanguage();
    const [secret, setSecret] = useState(""), [live, setLive] = useState(true), [now, setNow] = useState(0), [timestamp, setTimestamp] = useState("59");
    const [algorithm, setAlgorithm] = useState<"SHA-1" | "SHA-256" | "SHA-512">("SHA-1"), [digits, setDigits] = useState<6 | 8>(6), [period, setPeriod] = useState(30);
    const [result, setResult] = useState<Awaited<ReturnType<typeof totp>> | null>(null), [error, setError] = useState("");
    useEffect(() => { const tick = () => setNow(Math.floor(Date.now() / 1000)); tick(); const timer = setInterval(tick, 1000); return () => clearInterval(timer); }, []);
    const seconds = live ? now : Number(timestamp);
    useEffect(() => {
        let alive = true; setError("");
        if (!secret.trim()) setResult(null);
        if (secret.trim() && (!live || seconds)) void totp(secret, { algorithm, digits, period, seconds }).then((value) => { if (alive) setResult(value); }).catch((cause) => { if (alive) { setResult(null); setError(cause instanceof Error ? cause.message : String(cause)); } });
        return () => { alive = false; };
    }, [secret, seconds, algorithm, digits, period, live]);
    return <ToolPageLayout title={t("TOTP Generator")} description={t("Generate RFC 6238 authenticator codes locally for MFA testing")} icon={<SafetyOutlined />} color="#be123c"><div className="wb-workbench" dir="auto">
        <label>{t("Base32 authenticator secret")}<input dir="ltr" type="password" autoComplete="off" value={secret} maxLength={2048} onChange={(event) => { setSecret(event.target.value); setResult(null); }} spellCheck={false} /></label>
        <div className="wb-form-grid"><label>{t("HMAC algorithm")}<select value={algorithm} onChange={(event) => { setAlgorithm(event.target.value as typeof algorithm); setResult(null); }}><option>SHA-1</option><option>SHA-256</option><option>SHA-512</option></select></label><label>{t("Digits")}<select value={digits} onChange={(event) => { setDigits(Number(event.target.value) as 6 | 8); setResult(null); }}><option value="6">6</option><option value="8">8</option></select></label><label>{t("Time step in seconds")}<input dir="ltr" type="number" min={1} max={3600} value={period} onChange={(event) => { setPeriod(Number(event.target.value)); setResult(null); }} /></label></div>
        <label className="wb-checkbox"><input dir="ltr" type="checkbox" checked={live} onChange={(event) => setLive(event.target.checked)} />{t("Use the current device time")}</label>{!live && <label>{t("Unix timestamp in seconds")}<input dir="ltr" value={timestamp} onChange={(event) => setTimestamp(event.target.value)} inputMode="numeric" /></label>}
        {result ? <><output dir="ltr" className="wb-otp-code" aria-label={t("Authenticator code")} aria-live="polite">{result.code}</output><p>{t("{seconds} seconds until the next code · counter {counter}", { seconds: result.remaining, counter: result.counter })}</p></> : <p>{t("Enter a Base32 secret to generate a code.")}</p>}
        <div className="wb-workbench-actions"><button disabled={!result} onClick={() => { if (result) void copyToClipboard(result.code); }}>{t("Copy code")}</button><button onClick={() => { setSecret(""); setResult(null); }}>{t("Clear secret")}</button><button onClick={() => { setSecret("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"); setLive(false); setTimestamp("59"); setPeriod(30); setDigits(8); setAlgorithm("SHA-1"); }}>{t("Load public RFC test fixture")}</button></div>
        {error && <p role="alert">{t(error)}</p>}<p>{t("Secrets are not saved or sent. The default is SHA-1, six digits and 30 seconds. Your authenticator and server must use the same parameters and synchronized clocks. The public fixture should produce 94287082.")}</p><a href="https://www.rfc-editor.org/rfc/rfc6238.html" target="_blank" rel="noreferrer">{t("RFC 6238 and test vectors")}</a>
    </div></ToolPageLayout>;
}

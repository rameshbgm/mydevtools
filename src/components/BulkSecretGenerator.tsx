"use client";
import { useState } from "react";
import { SECRET_ALPHABETS, generateSecrets } from "@/lib/random-secrets";
import { downloadText } from "@/lib/download";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";

type AlphabetPreset = keyof typeof SECRET_ALPHABETS | "custom";
export default function BulkSecretGenerator() {
    const { t } = useLanguage();
    const [preset, setPreset] = useState<AlphabetPreset>("base64url");
    const [alphabet, setAlphabet] = useState<string>(SECRET_ALPHABETS.base64url), [length, setLength] = useState(32), [count, setCount] = useState(10);
    const [output, setOutput] = useState(""), [error, setError] = useState("");
    return <section className="wb-workbench" style={{ marginBlockStart: 28 }}>
        <h2>{t("Bulk secrets and API keys")}</h2>
        <div className="wb-form-grid">
            <label>{t("Alphabet preset")}<select value={preset} onChange={(event) => {
                const next = event.target.value as AlphabetPreset;
                setPreset(next);
                if (next !== "custom") setAlphabet(SECRET_ALPHABETS[next]);
            }}>
                <option value="base64url">{t("URL-safe Base64 alphabet")}</option>
                <option value="alphanumeric">{t("Letters and digits")}</option>
                <option value="hex">{t("Hexadecimal")}</option>
                <option value="readable">{t("Without ambiguous characters")}</option>
                <option value="custom">{t("Custom alphabet")}</option>
            </select></label>
            <label>{t("Characters per secret")}<input dir="ltr" type="number" min={1} max={4096} value={length} onChange={(event) => setLength(Number(event.target.value))} /></label>
            <label>{t("Number of secrets")}<input dir="ltr" type="number" min={1} max={1000} value={count} onChange={(event) => setCount(Number(event.target.value))} /></label>
        </div>
        <label>{t("Secret alphabet (unique characters)")}<input dir="ltr" maxLength={512} value={alphabet} onChange={(event) => { setAlphabet(event.target.value); setPreset("custom"); }} spellCheck={false} autoComplete="off" autoCapitalize="off" /></label>
        <div className="wb-workbench-actions">
            <button onClick={() => {
                try { setOutput(generateSecrets(alphabet, length, count).join("\n")); setError(""); }
                catch (cause) { setOutput(""); setError(cause instanceof Error ? cause.message : "Secrets could not be generated. Check the alphabet and size limits, then try again."); }
            }}>{t("Generate bulk secrets")}</button>
            <button disabled={!output} onClick={() => void copyToClipboard(output)}>{t("Copy generated secrets")}</button>
            <button disabled={!output} onClick={() => downloadText(output, "generated-secrets.txt")}>{t("Download secrets")}</button>
            <button onClick={() => { setOutput(""); setError(""); }}>{t("Clear generated secrets")}</button>
        </div>
        <label>{t("Generated secrets")}<textarea dir="ltr" rows={8} readOnly value={output} placeholder={t("Generate secrets to see the results here.")} spellCheck={false} /></label>
        {error && <div role="alert"><p>{t("Secrets could not be generated. Check the alphabet and size limits, then try again.")}</p><p dir="auto">{t(error)}</p></div>}
        <p>{t("Uses Web Crypto with rejection sampling to avoid modulo bias. Results stay in page memory until copied or downloaded. Downloaded files are unencrypted.")}</p>
    </section>;
}

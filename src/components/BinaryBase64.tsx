"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { isFileConversionMessage } from "@/lib/i18n/file-conversions";
import { useState, useRef, useEffect } from "react";
import { encodeBinaryBase64, decodeBinaryBase64, MAX_BINARY_BYTES } from "@/lib/binary-base64";
import { downloadBytes, downloadText } from "@/lib/download";
import { copyToClipboard } from "@/lib/clipboard";
export default function BinaryBase64() {
    const { t, language } = useLanguage();
    const readId = useRef(0);
    const [reading, setReading] = useState(false);
    useEffect(() => () => { readId.current++; }, []);
    const diagnostic = (message: string) => isFileConversionMessage(message) ? t(message) : <>{t("File conversion diagnostic:")} <bdi dir="auto">{message}</bdi></>;
    const [value, setValue] = useState(""), [mime, setMime] = useState("application/octet-stream"), [filename, setFilename] = useState("decoded.bin"), [uri, setUri] = useState(true), [error, setError] = useState(""), [notice, setNotice] = useState<{ source: string; bytes: number } | null>(null);
    return <section className="wb-workbench" style={{ marginBlockStart: 28 }}><h2>{t("Images and binary files")}</h2><div className="wb-form-grid"><label>{t("File to encode (up to 8 MiB)")}<input type="file" onChange={async (event) => {
            const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
            const current = ++readId.current;
            setValue(""); setNotice(null); setError(""); setReading(true);
            try {
                if (file.size > MAX_BINARY_BYTES) throw new Error("File limit is 8 MiB.");
                const type = file.type || "application/octet-stream";
                setMime(type); setFilename(file.name);
                const bytes = new Uint8Array(await file.arrayBuffer());
                if (current !== readId.current) return;
                setValue(encodeBinaryBase64(bytes, type, uri));
                setNotice({ source: "{bytes} bytes encoded locally.", bytes: bytes.length });
            } catch (cause) { if (current === readId.current) setError(cause instanceof Error ? cause.message : String(cause)); }
            finally { if (current === readId.current) setReading(false); }
        }} /></label><label>{t("MIME type")}<input dir="ltr" disabled={reading} value={mime} onChange={(event) => setMime(event.target.value)} maxLength={200} /></label><label>{t("Decoded filename")}<input dir="auto" disabled={reading} value={filename} onChange={(event) => setFilename(event.target.value)} maxLength={200} /></label></div>
        <label className="wb-checkbox"><input type="checkbox" disabled={reading} checked={uri} onChange={(event) => { const next = event.target.checked; setUri(next); if (value) try { const decoded = decodeBinaryBase64(value); setValue(encodeBinaryBase64(decoded.bytes, mime, next)); setError(""); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } }} />{t("Include Data URI prefix")}</label>
        <label>{t("Binary Base64 or Data URI")}<textarea dir="ltr" disabled={reading} rows={8} value={value} maxLength={Math.ceil(MAX_BINARY_BYTES / 3) * 4 + 1000} onChange={(event) => setValue(event.target.value)} spellCheck={false} /></label>
        <div className="wb-workbench-actions"><button disabled={!value} onClick={() => void copyToClipboard(value)}>{t("Copy binary Base64")}</button><button disabled={!value} onClick={() => downloadText(value, "encoded-base64.txt")}>{t("Download encoded text")}</button><button disabled={!value} onClick={() => { try { const decoded = decodeBinaryBase64(value); downloadBytes(decoded.bytes, filename || "decoded.bin", decoded.mime); setError(""); setNotice({ source: "{bytes} bytes decoded.", bytes: decoded.bytes.length }); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } }}>{t("Decode and download file")}</button><button onClick={() => { readId.current++; setReading(false); setValue(""); setNotice(null); setError(""); }}>{t("Clear binary input")}</button></div>
        {reading && <p role="status">{t("Processing…")}</p>}
        {notice && <p role="status">{t(notice.source, { bytes: notice.bytes.toLocaleString(language) })}</p>}{error && <p role="alert">{diagnostic(error)}</p>}<p>{t("Binary data is kept separate from text sharing. Files and Data URIs are processed locally and are not previewed or executed.")}</p>
    </section>;
}

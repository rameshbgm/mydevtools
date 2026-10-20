"use client";
import { useMemo, useState } from "react";
import { NumberOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { numericUtilityMessage } from "@/lib/i18n/numeric-utilities";
import { convertIntegerBase } from "@/lib/number-base";
import { copyToClipboard } from "@/lib/clipboard";
const bases = Array.from({ length: 35 }, (_, index) => index + 2);
export default function NumberBasePage() {
    const { t } = useLanguage();
    const [input, setInput] = useState("255"), [from, setFrom] = useState<number | "auto">(10), [to, setTo] = useState(16);
    const result = useMemo(() => {
        try { return { output: convertIntegerBase(input, from, to), common: [2, 8, 10, 16].map((base) => ({ base, output: convertIntegerBase(input, from, base) })), error: "" }; }
        catch (cause) { return { output: "", common: [], error: cause instanceof Error ? cause.message : String(cause) }; }
    }, [input, from, to]);
    return <ToolPageLayout title={t("Number Base Converter")} description={t("Convert exact integers between any bases from 2 through 36")} icon={<NumberOutlined />} color="#08979c" learnMore={{ whatIs: "Convert integer representations without losing precision through JavaScript Number. Digits above 9 use a–z. Fractions are not supported.", howToUse: ["Choose the source and destination bases.", "Enter an integer, optionally signed. Auto detects 0x, 0b and 0o prefixes; other inputs use decimal.", "Copy the result or the common binary, octal, decimal and hexadecimal representations."], tips: ["Inputs are limited to 4096 characters.", "Prefixes are consumed only in Auto mode or when they match the chosen source base.", "The conversion validates every digit instead of accepting a partial number."] }}><div className="wb-workbench">
        <div className="wb-form-grid"><label>{t("Source base")}<select dir="ltr" value={from} onChange={(event) => setFrom(event.target.value === "auto" ? "auto" : Number(event.target.value))}><option value="auto">{t("Auto detect prefix")}</option>{bases.map((base) => <option key={base} value={base}>{base}</option>)}</select></label><label>{t("Destination base")}<select dir="ltr" value={to} onChange={(event) => setTo(Number(event.target.value))}>{bases.map((base) => <option key={base} value={base}>{base}</option>)}</select></label></div>
        <label>{t("Integer to convert")}<textarea dir="ltr" rows={3} maxLength={4096} value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} /></label>
        {result.error ? <p role="alert">{numericUtilityMessage(t, result.error) ?? <>{t("Conversion diagnostic")}: <bdi dir="auto">{result.error}</bdi></>}</p> : <><label>{t("Base {base} result", { base: to })}<textarea dir="ltr" readOnly rows={3} value={result.output} /></label><div className="wb-workbench-actions"><button onClick={() => void copyToClipboard(result.output)}>{t("Copy result")}</button><button onClick={() => void copyToClipboard(result.common.map((row) => `Base ${row.base}: ${row.output}`).join("\n"))}>{t("Copy common bases")}</button><button onClick={() => { setInput(result.output); setFrom(to); setTo(from === "auto" ? 10 : from); }}>{t("Swap conversion direction")}</button></div><div className="wb-table-scroll"><table className="wb-data-table"><thead><tr><th>{t("Base")}</th><th>{t("Representation")}</th><th>{t("Copy")}</th></tr></thead><tbody>{result.common.map((row) => <tr key={row.base}><td dir="ltr">{row.base}</td><td><code dir="ltr" style={{ overflowWrap: "anywhere" }}>{row.output}</code></td><td><button onClick={() => void copyToClipboard(row.output)}>{t("Copy base {base}", { base: row.base })}</button></td></tr>)}</tbody></table></div></>}
    </div></ToolPageLayout>;
}

"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { CRON_FIELDS } from "@/lib/cron-schedule";
export default function CronFieldControl({ index, value, onChange }: { index: number; value: string; onChange: (value: string) => void }) {
    const { t } = useLanguage();
    const field = CRON_FIELDS[index];
    const mode = value === "*" ? "every" : /^\d+$/.test(value) ? "at" : /^\*\/\d+$/.test(value) ? "step" : /^\d+-\d+$/.test(value) ? "range" : /^\d+(,\d+)+$/.test(value) ? "list" : "custom";
    const [start, end] = value.split("-");
    return <fieldset className="wb-cron-field"><legend>{t(field.name)}</legend><label>{t("Pattern")}<select value={mode} onChange={(event) => { const next = event.target.value; onChange(next === "every" ? "*" : next === "at" ? String(field.min) : next === "step" ? "*/2" : next === "range" ? `${field.min}-${field.max}` : next === "list" ? `${field.min},${field.min + 1}` : "*/5,7"); }}><option value="every">{t("Every value")}</option><option value="at">{t("One value")}</option><option value="step">{t("Interval")}</option><option value="range">{t("Range")}</option><option value="list">{t("List")}</option><option value="custom">{t("Custom field")}</option></select></label>
        {mode === "at" && <label>{t("At ({min}–{max})", { min: field.min, max: field.max })}<input dir="ltr" type="number" min={field.min} max={field.max} value={value} onChange={(event) => onChange(event.target.value)} /></label>}
        {mode === "step" && <label>{t("Every n values")}<input dir="ltr" type="number" min={1} max={field.max - field.min + 1} value={value.slice(2)} onChange={(event) => onChange(`*/${event.target.value}`)} /></label>}
        {mode === "range" && <div className="wb-form-grid"><label>{t("From")}<input dir="ltr" type="number" min={field.min} max={field.max} value={start} onChange={(event) => onChange(`${event.target.value}-${end}`)} /></label><label>{t("Through")}<input dir="ltr" type="number" min={field.min} max={field.max} value={end} onChange={(event) => onChange(`${start}-${event.target.value}`)} /></label></div>}
        {(mode === "list" || mode === "custom") && <label>{t(mode === "list" ? "Comma-separated values" : "Field expression")}<input dir="ltr" value={value} maxLength={100} onChange={(event) => onChange(event.target.value)} spellCheck={false} /></label>}
        {index === 4 && <p>{t("0 and 7 = Sunday; 1 = Monday … 6 = Saturday.")}</p>}
    </fieldset>;
}

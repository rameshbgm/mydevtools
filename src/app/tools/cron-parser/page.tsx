"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useMemo, useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import CronFieldControl from "@/components/CronFieldControl";
import { CRON_FIELDS, CRON_PRESETS, nextCronRuns, parseCronSchedule } from "@/lib/cron-schedule";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";
export default function CronParserPage() {
    const { t, language } = useLanguage();
    const [expression, setExpression] = useState("0 9 * * 1-5"), [timezone, setTimezone] = useState("UTC"), [reference, setReference] = useState("");
    const [runs, setRuns] = useState<string[]>([]), [error, setError] = useState<{ source?: string; detail?: string } | null>(null);
    useEffect(() => { setReference(new Date().toISOString()); }, []);
    const parsed = useMemo(() => { try { const value = parseCronSchedule(expression, timezone, new Date("2026-01-01T00:00:00Z")); return { valid: true, normalized: value.stringify(), error: "" }; } catch (cause) { return { valid: false, normalized: "", error: String(cause) }; } }, [expression, timezone]);
    const fields = expression.trim().split(/\s+/);
    const changeExpression = (value: string) => { setExpression(value); setRuns([]); setError(null); };
    return <ToolPageLayout title={t("Cron Parser & Visual Builder")} description={t("Build five-field cron schedules and preview execution times in an IANA timezone")} icon={<ClockCircleOutlined />} color="#fa8c16" learnMore={{ whatIs: t("Five-field cron schedules describe minute, hour, day of month, month and day of week. This tool uses cron-parser for validation and timezone-aware run previews."), whyUse: t("Build schedules with visual controls and check their next dates before deploying them."), howToUse: [t("Choose a preset or edit the five fields"), t("Set an IANA timezone and reference timestamp"), t("Preview the next five runs and copy the expression")], tips: [t("When both day-of-month and day-of-week are restricted, standard cron matches either field (OR)."), t("Schedulers differ around daylight-saving transitions. Check the behavior of your actual runtime."), t("This interface uses five numeric fields; Quartz seconds, names and extensions are not accepted.")] }}>
        <div className="wb-workbench"><label>{t("Preset")}<select value="" onChange={(event) => changeExpression(event.target.value)}><option value="">{t("Choose a schedule")}</option>{CRON_PRESETS.map(([label, value]) => <option key={value} value={value}>{t(label)}</option>)}</select></label>
            <label>{t("Cron expression")}<input dir="ltr" maxLength={512} value={expression} onChange={(event) => changeExpression(event.target.value)} spellCheck={false} /></label>
            {fields.length === 5 ? <div className="wb-cron-grid">{CRON_FIELDS.map((field, index) => <CronFieldControl key={field.name} index={index} value={fields[index]} onChange={(value) => changeExpression(fields.map((item, position) => index === position ? value : item).join(" "))} />)}</div> : <p>{t("Enter five fields to use visual controls.")}</p>}
            {parsed.valid ? <p role="status">{t("Valid five-field schedule:")} <code dir="ltr">{parsed.normalized}</code></p> : <p role="alert">{parsed.error}</p>}
            <div className="wb-workbench-actions"><button disabled={!parsed.valid} onClick={() => void copyToClipboard(expression.trim())}>{t("Copy cron")}</button><button disabled={!parsed.valid} onClick={() => downloadText(expression.trim() + "\n", "schedule.cron")}>{t("Download expression")}</button></div>
            <div className="wb-form-grid"><label>{t("IANA timezone")}<input dir="ltr" value={timezone} onChange={(event) => { setTimezone(event.target.value); setRuns([]); }} placeholder="America/New_York" spellCheck={false} /></label><label>{t("Preview after (ISO 8601 with offset)")}<input dir="ltr" value={reference} onChange={(event) => { setReference(event.target.value); setRuns([]); }} spellCheck={false} /></label></div>
            <button disabled={!parsed.valid || !reference} onClick={() => { try { if (!/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/i.test(reference)) { setRuns([]); setError({ source: "Include Z or an explicit UTC offset in the reference timestamp." }); return; } setRuns(nextCronRuns(expression, timezone, new Date(reference))); setError(null); } catch (cause) { setRuns([]); setError({ detail: String(cause) }); } }}>{t("Preview next five runs")}</button>
            {error && <p role="alert">{error.source ? t(error.source) : error.detail}</p>}{runs.length > 0 && <div className="wb-table-scroll"><table className="wb-data-table"><caption>{t("Next executions after the selected reference time")}</caption><thead><tr><th>{t("In {timezone}", { timezone })}</th><th>UTC</th></tr></thead><tbody>{runs.map((run) => <tr key={run}><td>{new Intl.DateTimeFormat(language, { timeZone: timezone, dateStyle: "full", timeStyle: "long" }).format(new Date(run))}</td><td><time dir="ltr" dateTime={run}>{run}</time></td></tr>)}</tbody></table></div>}
            <p>{t("Day-of-month and day-of-week restrictions use OR matching when both are set. A restricted field is respected when the other is *. Sunday is 0 or 7. These previews do not create or run a scheduled job.")}</p>
        </div>
    </ToolPageLayout>;
}

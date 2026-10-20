import { CronExpressionParser } from "cron-parser";
export const CRON_FIELDS = [
    { name: "Minute", min: 0, max: 59 }, { name: "Hour", min: 0, max: 23 }, { name: "Day of month", min: 1, max: 31 }, { name: "Month", min: 1, max: 12 }, { name: "Day of week", min: 0, max: 7 },
] as const;
export const CRON_PRESETS = [
    ["Every minute", "* * * * *"], ["Every 15 minutes", "*/15 * * * *"], ["Every hour", "0 * * * *"], ["Daily at midnight", "0 0 * * *"], ["Weekdays at 09:00", "0 9 * * 1-5"], ["Sunday at midnight", "0 0 * * 0"], ["First day of month", "0 0 1 * *"], ["January 1", "0 0 1 1 *"],
] as const;
export function parseCronSchedule(expression: string, timezone = "UTC", start = new Date()) {
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5 || expression.length > 512 || parts.some((part) => !/^[\d*,/\-]+$/.test(part))) throw new Error("Use five numeric cron fields with *, comma, ranges and / steps. Sunday is 0 or 7.");
    new Intl.DateTimeFormat("en", { timeZone: timezone }).format(start);
    if (!Number.isFinite(start.getTime())) throw new Error("Enter a valid reference date/time with a UTC offset.");
    return CronExpressionParser.parse(parts.join(" "), { tz: timezone, currentDate: start });
}
export function nextCronRuns(expression: string, timezone: string, start: Date, count = 5): string[] {
    if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("Choose 1–20 preview runs.");
    const interval = parseCronSchedule(expression, timezone, start);
    return Array.from({ length: count }, () => interval.next().toDate().toISOString());
}

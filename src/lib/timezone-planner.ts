export interface WallTime { year: number; month: number; day: number; hour: number; minute: number; second: number }
const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(zone: string) {
    if (!formatters.has(zone)) formatters.set(zone, new Intl.DateTimeFormat("en-CA-u-ca-iso8601", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }));
    return formatters.get(zone)!;
}
export function zoneParts(milliseconds: number, zone: string): WallTime {
    const parts = Object.fromEntries(formatter(zone).formatToParts(milliseconds).map((part) => [part.type, part.value]));
    return { year: Number(parts.year), month: Number(parts.month), day: Number(parts.day), hour: Number(parts.hour), minute: Number(parts.minute), second: Number(parts.second) };
}
const same = (a: WallTime, b: WallTime) => Object.keys(a).every((key) => a[key as keyof WallTime] === b[key as keyof WallTime]);
const nominal = (parts: WallTime) => Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
export function zonedTimeToEpoch(input: string, zone: string, occurrence: "reject" | "earlier" | "later" = "reject"): number {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(input);
    if (!match) throw new Error("Choose a date and time in YYYY-MM-DDTHH:mm format.");
    const wall = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]), hour: Number(match[4]), minute: Number(match[5]), second: Number(match[6] ?? 0) };
    const target = nominal(wall);
    if (wall.year < 1970 || wall.year > 2100 || !same(zoneParts(target, "UTC"), wall)) throw new Error("Choose a valid date from 1970 through 2100.");
    const offsets = new Set<number>();
    for (let hours = -36; hours <= 36; hours += 3) { const candidate = target + hours * 3600000; offsets.add(nominal(zoneParts(candidate, zone)) - candidate); }
    const matches = [...offsets].map((offset) => target - offset).filter((candidate) => same(zoneParts(candidate, zone), wall)).sort((a, b) => a - b);
    if (!matches.length) throw new Error("This local time does not exist because the timezone's clock moves forward. Choose another time.");
    if (matches.length > 1 && occurrence === "reject") throw new Error("This local time occurs twice when the clock moves back. Choose the earlier or later occurrence.");
    return occurrence === "later" ? matches.at(-1)! : matches[0];
}
export function timezoneRow(milliseconds: number, zone: string, referenceZone: string, startHour = 9, endHour = 17) {
    const local = zoneParts(milliseconds, zone), reference = zoneParts(milliseconds, referenceZone);
    const offsetSeconds = (nominal(local) - Math.floor(milliseconds / 1000) * 1000) / 1000;
    const sign = offsetSeconds < 0 ? "−" : "+", offset = Math.abs(offsetSeconds);
    const utcOffset = offsetSeconds === 0 ? "UTC" : `UTC${sign}${String(Math.floor(offset / 3600)).padStart(2, "0")}:${String(Math.floor(offset % 3600 / 60)).padStart(2, "0")}${offset % 60 ? ":" + String(offset % 60).padStart(2, "0") : ""}`;
    const day = Date.UTC(local.year, local.month - 1, local.day), referenceDay = Date.UTC(reference.year, reference.month - 1, reference.day), weekday = new Date(day).getUTCDay();
    const insideHours = startHour < endHour ? local.hour >= startHour && local.hour < endHour : startHour > endHour ? local.hour >= startHour || local.hour < endHour : false;
    return { zone, date: `${local.year}-${String(local.month).padStart(2, "0")}-${String(local.day).padStart(2, "0")}`, time: `${String(local.hour).padStart(2, "0")}:${String(local.minute).padStart(2, "0")}`, utcOffset, dayShift: (day - referenceDay) / 86400000, working: weekday > 0 && weekday < 6 && insideHours };
}

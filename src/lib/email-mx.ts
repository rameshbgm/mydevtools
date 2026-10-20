export type MxStatus = "mx" | "null-mx" | "implicit" | "no-address" | "nxdomain" | "invalid-mx";
export interface MxDiagnostic { domain: string; status: MxStatus; records: { priority: number; exchange: string; ttl: number }[]; addresses: string[]; authenticated: boolean }
interface Answer { type: number; data: string; TTL: number }
interface DnsJson { Status: number; Answer?: Answer[]; AD?: boolean; TC?: boolean }
export const MX_RESOLVERS = { cloudflare: "https://cloudflare-dns.com/dns-query", google: "https://dns.google/resolve" } as const;
export function normalizeMxDomain(source: string): string {
    const raw = source.trim().replace(/\.$/, "");
    if (!raw || raw.length > 253 || /[\s/@\\?#:]/.test(raw)) throw new Error("Enter an email domain without a protocol or path.");
    const domain = new URL("https://" + raw).hostname.toLowerCase();
    if (domain.length > 253 || !domain.includes(".") || domain.split(".").some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) || /^\d+(?:\.\d+){3}$/.test(domain)) throw new Error("Enter a valid public domain name.");
    return domain;
}
export function classifyMx(domain: string, answer: DnsJson, addressAnswers: DnsJson[] = []): MxDiagnostic {
    if (answer.TC) throw new Error("The resolver truncated its response. Retry with the other resolver.");
    const base = { domain, records: [] as MxDiagnostic["records"], addresses: [] as string[], authenticated: answer.AD === true };
    if (answer.Status === 3) return { ...base, status: "nxdomain" };
    if (answer.Status !== 0) throw new Error(`DNS resolver returned status ${answer.Status}. This does not establish whether mail is accepted.`);
    const records = (answer.Answer ?? []).filter((item) => item.type === 15).map((item) => {
        const match = /^(\d+)\s+(\S+)\.?$/.exec(item.data);
        if (!match || Number(match[1]) > 65535 || !Number.isInteger(item.TTL) || item.TTL < 0) throw new Error("The resolver returned malformed MX data.");
        return { priority: Number(match[1]), exchange: match[2] === "." ? "." : normalizeMxDomain(match[2]), ttl: item.TTL };
    }).sort((left, right) => left.priority - right.priority || left.exchange.localeCompare(right.exchange));
    const nulls = records.filter((item) => item.exchange === ".");
    if (nulls.length) return { ...base, records, status: records.length === 1 && records[0].priority === 0 ? "null-mx" : "invalid-mx" };
    if (records.length) return { ...base, records, status: "mx" };
    for (const reply of addressAnswers) if (reply.TC || ![0, 3].includes(reply.Status)) throw new Error("MX was absent, but the fallback address lookup failed. Retry before drawing a conclusion.");
    const addresses = addressAnswers.flatMap((reply) => (reply.Answer ?? []).filter((item) => item.type === 1 || item.type === 28).map((item) => item.data));
    return { ...base, addresses, status: addresses.length ? "implicit" : "no-address" };
}
async function readDnsJson(response: Response): Promise<DnsJson> {
    if (!response.ok) throw new Error(`DNS resolver returned HTTP ${response.status}.`);
    if (!response.body) throw new Error("DNS resolver returned an empty response.");
    const reader = response.body.getReader(), parts: Uint8Array[] = []; let length = 0;
    try { while (true) { const { done, value } = await reader.read(); if (done) break; length += value.length; if (length > 64 * 1024) { await reader.cancel(); throw new Error("DNS response exceeds 64 KiB."); } parts.push(value); } } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(length); let offset = 0; parts.forEach((part) => { bytes.set(part, offset); offset += part.length; });
    const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!value || !Number.isInteger(value.Status) || value.Status < 0 || value.Status > 23 || value.Answer !== undefined && (!Array.isArray(value.Answer) || value.Answer.length > 1000 || value.Answer.some((item: unknown) => !item || typeof item !== "object" || typeof (item as Answer).data !== "string" || !Number.isInteger((item as Answer).type) || !Number.isInteger((item as Answer).TTL)))) throw new Error("DNS resolver response has an invalid shape.");
    return value;
}
export async function lookupEmailMx(source: string, resolver: keyof typeof MX_RESOLVERS, fetcher: typeof fetch = fetch): Promise<MxDiagnostic> {
    const domain = normalizeMxDomain(source), endpoint = MX_RESOLVERS[resolver]; if (!endpoint) throw new Error("Choose a supported DNS resolver.");
    const signal = AbortSignal.timeout(8000);
    const query = async (type: "MX" | "A" | "AAAA") => readDnsJson(await fetcher(`${endpoint}?name=${encodeURIComponent(domain)}&type=${type}`, { headers: { Accept: "application/dns-json" }, credentials: "omit", redirect: "error", cache: "no-store", signal }));
    const mx = await query("MX");
    if (mx.Status !== 0 || mx.Answer?.some((item) => item.type === 15)) return classifyMx(domain, mx);
    return classifyMx(domain, mx, await Promise.all([query("A"), query("AAAA")]));
}

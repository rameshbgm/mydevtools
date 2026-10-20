import { normalizeMxDomain } from "./email-mx";
export interface RdapQuery { type: "domain" | "ip"; value: string; bootstrapUrl: string; path: string }
export function rdapQuery(source: string): RdapQuery {
    const value = source.trim(); if (!value || value.length > 300) throw new Error("Enter a domain or IPv4/IPv6 address, with an optional IP prefix.");
    const parts = value.split("/"); if (parts.length > 2) throw new Error("Use a domain or IP address without a URL/path.");
    const address = parts[0].replace(/^\[|\]$/g, ""); let canonical = "", maximum = 0;
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(address)) { const octets = address.split(".").map(Number); if (octets.some((octet) => octet > 255)) throw new Error("Invalid IPv4 address."); canonical = octets.join("."); maximum = 32; }
    else if (address.includes(":")) { try { canonical = new URL(`https://[${address}]/`).hostname.slice(1, -1); maximum = 128; } catch { throw new Error("Invalid IPv6 address."); } }
    if (canonical) { if (parts[1] !== undefined && (!/^\d{1,3}$/.test(parts[1]) || Number(parts[1]) > maximum)) throw new Error(`IP prefix length must be 0–${maximum}.`); const suffix = parts[1] === undefined ? "" : "/" + Number(parts[1]); return { type: "ip", value: canonical + suffix, bootstrapUrl: `https://data.iana.org/rdap/ipv${maximum === 32 ? 4 : 6}.json`, path: "ip/" + encodeURIComponent(canonical) + suffix }; }
    if (parts.length !== 1) throw new Error("Only IP addresses accept a CIDR prefix.");
    const domain = normalizeMxDomain(value); return { type: "domain", value: domain, bootstrapUrl: "https://data.iana.org/rdap/dns.json", path: "domain/" + encodeURIComponent(domain) };
}
type JsonObject = Record<string, unknown>;
const object = (value: unknown): JsonObject | null => value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : null;
const string = (value: unknown, maximum = 1000) => typeof value === "string" ? value.slice(0, maximum) : "";
const strings = (value: unknown, maximum = 100) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, maximum).map((item) => item.slice(0, 2000)) : [];
function ipBits(source: string, version: 4 | 6): bigint {
    if (version === 4) {
        if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(source) || source.split(".").some((part) => Number(part) > 255)) throw new Error("Invalid bootstrap IPv4 prefix.");
        return source.split(".").reduce((value, part) => value * BigInt(256) + BigInt(part), BigInt(0));
    }
    const canonical = new URL(`https://[${source}]/`).hostname.slice(1, -1), halves = canonical.split("::"), left = halves[0].split(":").filter(Boolean), right = halves[1]?.split(":").filter(Boolean) ?? [];
    const parts = halves.length === 2 ? [...left, ...Array(8 - left.length - right.length).fill("0"), ...right] : left;
    if (parts.length !== 8) throw new Error("Invalid bootstrap IPv6 prefix.");
    return parts.reduce((value, part) => (value << BigInt(16)) | BigInt("0x" + part), BigInt(0));
}
/** RFC 9224: longest matching DNS suffix or IP prefix; prefer HTTPS. */
export function rdapRegistryUrl(query: RdapQuery, bootstrap: unknown): string {
    const services = object(bootstrap)?.services;
    if (!Array.isArray(services) || services.length > 5000) throw new Error("IANA returned an invalid RDAP bootstrap directory.");
    let longest = -1, candidates: string[] = [], count = 0;
    const address = query.value.split("/")[0], version = address.includes(":") ? 6 : 4, value = query.type === "ip" ? ipBits(address, version) : null;
    for (const service of services) {
        if (!Array.isArray(service) || service.length !== 2 || !Array.isArray(service[0]) || !Array.isArray(service[1])) throw new Error("IANA returned an invalid RDAP service entry.");
        for (const entry of service[0]) {
            if (++count > 20_000 || typeof entry !== "string" || entry.length > 300) throw new Error("IANA bootstrap directory exceeds supported limits.");
            let score = -1;
            if (query.type === "domain") { if (query.value === entry || query.value.endsWith("." + entry)) score = entry.split(".").length; }
            else {
                const [prefix, length, extra] = entry.split("/");
                if (extra !== undefined || !/^\d{1,3}$/.test(length ?? "") || Number(length) > (version === 4 ? 32 : 128)) throw new Error("IANA returned an invalid IP prefix.");
                const shift = BigInt((version === 4 ? 32 : 128) - Number(length));
                if ((value! >> shift) === (ipBits(prefix, version) >> shift)) score = Number(length);
            }
            if (score < 0 || score < longest) continue;
            const urls = service[1].filter((url): url is string => typeof url === "string" && url.length < 2000);
            if (score > longest) { longest = score; candidates = urls; } else candidates.push(...urls);
        }
    }
    for (const candidate of candidates) { try { const base = new URL(candidate); if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash || !base.pathname.endsWith("/")) continue; return new URL(query.path, base).href; } catch {} }
    throw new Error(longest < 0 ? "IANA has no RDAP service entry for this domain or IP range." : "No supported HTTPS RDAP service is listed for this registration.");
}
const bootstrapCache = new Map<string, { value: unknown; expires: number }>();
export async function lookupRdap(query: RdapQuery, signal: AbortSignal, fetcher: typeof fetch = fetch) {
    const request = async (url: string): Promise<unknown> => {
        const response = await fetcher("/api/proxy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, method: "GET", headers: { Accept: "application/rdap+json, application/json" }, timeout: 15_000, followRedirects: true }), signal, cache: "no-store", credentials: "same-origin" });
        if (!response.ok) throw new Error(`RDAP proxy returned HTTP ${response.status}. The deployment may have disabled managed network tools.`);
        const payload = await response.json();
        if (payload.error) throw new Error(String(payload.error));
        if (payload.status === 404) throw new Error("No registration record was found by this RDAP service. Registry coverage and privacy restrictions vary.");
        if (payload.status === 429) throw new Error("The registry rate-limited this lookup. Wait before trying again.");
        if (typeof payload.status !== "number" || payload.status < 200 || payload.status >= 300) throw new Error(`Registration service returned HTTP ${payload.status}.`);
        if (typeof payload.body !== "string" || payload.body.length > 2 * 1024 * 1024 || payload.headers?.["x-mydevtools-truncated"]) throw new Error("Registration response exceeds the 2 MiB display limit or was truncated.");
        const raw = payload.bodyIsBase64 ? new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(payload.body), (character) => character.charCodeAt(0))) : payload.body;
        return JSON.parse(raw);
    };
    const cached = bootstrapCache.get(query.bootstrapUrl), bootstrap = cached && cached.expires > Date.now() ? cached.value : await request(query.bootstrapUrl);
    const registryUrl = rdapRegistryUrl(query, bootstrap);
    bootstrapCache.set(query.bootstrapUrl, { value: bootstrap, expires: Date.now() + 12 * 60 * 60_000 });
    const value = await request(registryUrl);
    return { summary: summarizeRdap(value), raw: JSON.stringify(value, null, 2), registryUrl };
}
export function summarizeRdap(value: unknown) {
    const input = object(value); if (!input || !["domain", "ip network"].includes(String(input.objectClassName))) throw new Error("The service did not return a supported RDAP domain or IP-network record.");
    const entities: { handle: string; name: string; roles: string[] }[] = [], queue = Array.isArray(input.entities) ? input.entities.map((entity) => ({ entity, depth: 0 })) : [];
    while (queue.length && entities.length < 300) {
        const entry = queue.shift()!, entity = object(entry.entity); if (!entity) continue;
        let name = ""; const card = entity.vcardArray;
        if (Array.isArray(card) && Array.isArray(card[1])) {
            for (const row of card[1]) if (Array.isArray(row) && ["fn", "org"].includes(String(row[0]))) { name = typeof row[3] === "string" ? row[3] : Array.isArray(row[3]) ? strings(row[3]).join(" · ") : ""; if (row[0] === "fn" && name) break; }
        }
        entities.push({ handle: string(entity.handle), name: name.slice(0, 1000), roles: strings(entity.roles, 20) });
        if (entry.depth < 5 && Array.isArray(entity.entities)) queue.push(...entity.entities.slice(0, 300).map((child) => ({ entity: child, depth: entry.depth + 1 })));
    }
    const events = (Array.isArray(input.events) ? input.events : []).slice(0, 100).flatMap((entry) => { const event = object(entry); return event ? [{ action: string(event.eventAction), date: string(event.eventDate), actor: string(event.eventActor) }] : []; });
    const nameservers = (Array.isArray(input.nameservers) ? input.nameservers : []).slice(0, 100).flatMap((entry) => { const server = object(entry); return server ? [string(server.unicodeName) || string(server.ldhName)] : []; }).filter(Boolean);
    const notices = [...(Array.isArray(input.notices) ? input.notices : []), ...(Array.isArray(input.remarks) ? input.remarks : [])].slice(0, 30).flatMap((entry) => { const notice = object(entry); return notice ? [{ title: string(notice.title), description: strings(notice.description, 20).join("\n").slice(0, 5000) }] : []; });
    const links = (Array.isArray(input.links) ? input.links : []).slice(0, 30).flatMap((entry) => { const link = object(entry); if (!link || typeof link.href !== "string") return []; try { const url = new URL(link.href); if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return []; return [{ href: url.href, title: string(link.title) || string(link.rel) || url.hostname }]; } catch { return []; } });
    return { kind: string(input.objectClassName), name: string(input.unicodeName) || string(input.ldhName) || string(input.name), handle: string(input.handle), country: string(input.country), startAddress: string(input.startAddress), endAddress: string(input.endAddress), statuses: strings(input.status), events, nameservers, entities, notices, links, redactedFields: Array.isArray(input.redacted) ? input.redacted.length : 0, conformance: strings(input.rdapConformance) };
}

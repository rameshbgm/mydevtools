import dns from "node:dns/promises";
import net, { type LookupFunction } from "node:net";

export interface ResolvedAddress {
    address: string;
    family: 4 | 6;
}

const PRIVATE_V4_RANGES: Array<[string, number]> = [
    ["0.0.0.0", 8],
    ["10.0.0.0", 8],
    ["100.64.0.0", 10],
    ["127.0.0.0", 8],
    ["169.254.0.0", 16],
    ["172.16.0.0", 12],
    ["192.0.0.0", 24],
    ["192.0.2.0", 24],
    ["192.168.0.0", 16],
    ["198.18.0.0", 15],
    ["198.51.100.0", 24],
    ["203.0.113.0", 24],
    ["224.0.0.0", 4],
    ["240.0.0.0", 4],
];

function ipv4ToNumber(address: string): number {
    return address.split(".").reduce((value, part) => (value * 256) + Number(part), 0);
}

function isIpv4InRange(address: string, base: string, prefix: number): boolean {
    const divisor = 2 ** (32 - prefix);
    return Math.floor(ipv4ToNumber(address) / divisor) === Math.floor(ipv4ToNumber(base) / divisor);
}

function normaliseIp(address: string): string {
    return address.replace(/^\[|\]$/g, "").toLowerCase();
}

/** True only for addresses that are safe to reach from a public service. */
export function isPublicIp(address: string): boolean {
    const ip = normaliseIp(address);
    const family = net.isIP(ip);
    if (family === 4) {
        return !PRIVATE_V4_RANGES.some(([base, prefix]) => isIpv4InRange(ip, base, prefix));
    }
    if (family !== 6) return false;

    // IPv4-mapped IPv6 addresses need the same policy as their IPv4 form.
    const mapped = ip.match(/^(?:0*:)*ffff:(\d+\.\d+\.\d+\.\d+)$/i);
    if (mapped) return isPublicIp(mapped[1]);

    // Unspecified/loopback, unique-local, link-local, documentation and multicast.
    if (ip === "::" || ip === "::1" || ip === "0:0:0:0:0:0:0:1") return false;
    return !(
        ip.startsWith("fc") ||
        ip.startsWith("fd") ||
        /^fe[89ab]/.test(ip) ||
        ip.startsWith("ff") ||
        ip.startsWith("2001:db8")
    );
}

/**
 * Resolve every record before connecting. Rejecting a mixed public/private
 * result prevents a hostname from being used to reach private infrastructure.
 */
export async function resolvePublicHost(hostname: string): Promise<ResolvedAddress[]> {
    const host = normaliseIp(hostname);
    const directFamily = net.isIP(host);
    if (directFamily) {
        if (!isPublicIp(host)) throw new Error("Private, loopback, link-local, and reserved targets are blocked");
        return [{ address: host, family: directFamily as 4 | 6 }];
    }

    const addresses = await dns.lookup(host, { all: true, verbatim: true });
    if (!addresses.length || addresses.some(({ address }) => !isPublicIp(address))) {
        throw new Error("Target must resolve only to public internet addresses");
    }
    return addresses.map(({ address, family }) => ({ address, family: family as 4 | 6 }));
}

/** Pin Node's outbound connection to an already validated IP to resist DNS rebinding. */
export function createPinnedLookup(addresses: ResolvedAddress[]): LookupFunction {
    return (_hostname, options, callback) => {
        const requestedFamily = options.family ?? 0;
        const matches = addresses.filter((entry) => requestedFamily === 0 || entry.family === requestedFamily);
        if (!matches.length) {
            const error = new Error("No validated address matches the requested IP family") as NodeJS.ErrnoException;
            error.code = "ENOTFOUND";
            callback(error, "");
            return;
        }
        // Node's TLS client can request `all: true` when it selects an address
        // family itself. Preserve the native dns.lookup return shape in that mode.
        if (options.all) {
            callback(null, matches);
            return;
        }
        callback(null, matches[0].address, matches[0].family);
    };
}

/** Managed server routes are available in development and opt-in in production. */
export function managedRoutesEnabled(): boolean {
    return process.env.NODE_ENV !== "production" || process.env.MYDEVTOOLS_ENABLE_MANAGED_ROUTES === "true";
}

type RateWindow = { count: number; resetAt: number };
const RATE_LIMIT_KEY = "__mydevtools_managed_route_rate_limits__";
const rateLimits: Map<string, RateWindow> =
    (globalThis as unknown as Record<string, Map<string, RateWindow>>)[RATE_LIMIT_KEY] ?? new Map();
(globalThis as unknown as Record<string, Map<string, RateWindow>>)[RATE_LIMIT_KEY] = rateLimits;

function clientKey(request: Request): string {
    return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
        || request.headers.get("x-real-ip")
        || "unknown";
}

/** Lightweight process-local abuse guard. Production still needs gateway-level quotas. */
export function consumeManagedRouteQuota(request: Request, scope: string, limit = 60): boolean {
    const now = Date.now();
    for (const [key, window] of rateLimits) {
        if (window.resetAt <= now) rateLimits.delete(key);
    }
    const key = `${scope}:${clientKey(request)}`;
    const window = rateLimits.get(key);
    if (!window || window.resetAt <= now) {
        rateLimits.set(key, { count: 1, resetAt: now + 60_000 });
        return true;
    }
    if (window.count >= limit) return false;
    window.count += 1;
    return true;
}

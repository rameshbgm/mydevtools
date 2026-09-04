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

function parseIpv6Words(address: string): number[] | null {
    let value = address.toLowerCase();

    // Expand an embedded IPv4 suffix into the final two IPv6 words first.
    if (value.includes(".")) {
        const separator = value.lastIndexOf(":");
        if (separator < 0) return null;
        const octets = value.slice(separator + 1).split(".");
        if (octets.length !== 4 || octets.some((octet) => !/^\d+$/.test(octet) || Number(octet) > 255)) return null;
        const high = (Number(octets[0]) << 8) | Number(octets[1]);
        const low = (Number(octets[2]) << 8) | Number(octets[3]);
        value = `${value.slice(0, separator)}:${high.toString(16)}:${low.toString(16)}`;
    }

    const halves = value.split("::");
    if (halves.length > 2) return null;
    const parseHalf = (half: string): number[] | null => {
        if (!half) return [];
        const parts = half.split(":");
        if (parts.some((part) => !/^[0-9a-f]{1,4}$/.test(part))) return null;
        return parts.map((part) => parseInt(part, 16));
    };

    const left = parseHalf(halves[0]);
    const right = parseHalf(halves[1] ?? "");
    if (!left || !right) return null;
    if (halves.length === 1) return left.length === 8 ? left : null;

    const omitted = 8 - left.length - right.length;
    if (omitted < 1) return null;
    return [...left, ...Array.from({ length: omitted }, () => 0), ...right];
}

/** True only for addresses that are safe to reach from a public service. */
export function isPublicIp(address: string): boolean {
    const ip = normaliseIp(address);
    const family = net.isIP(ip);
    if (family === 4) {
        return !PRIVATE_V4_RANGES.some(([base, prefix]) => isIpv4InRange(ip, base, prefix));
    }
    if (family !== 6) return false;

    const words = parseIpv6Words(ip);
    if (!words) return false;

    // Unspecified and loopback.
    if (words.every((word) => word === 0)) return false;
    if (words.slice(0, 7).every((word) => word === 0) && words[7] === 1) return false;

    // IPv4-mapped IPv6 addresses need the same policy as their IPv4 form,
    // including hexadecimal forms such as ::ffff:7f00:1.
    const mapped = words.slice(0, 5).every((word) => word === 0) && words[5] === 0xffff;
    if (mapped) {
        const ipv4 = [words[6] >> 8, words[6] & 0xff, words[7] >> 8, words[7] & 0xff].join(".");
        return isPublicIp(ipv4);
    }

    // IPv4-compatible IPv6 addresses are deprecated and can encode private
    // destinations without the mapped marker; reject the entire ::/96 range.
    if (words.slice(0, 6).every((word) => word === 0)) return false;

    const first = words[0];
    // Unique-local, link-local, multicast, and documentation ranges.
    if ((first & 0xfe00) === 0xfc00) return false;
    if ((first & 0xffc0) === 0xfe80) return false;
    if ((first & 0xff00) === 0xff00) return false;
    if (words[0] === 0x2001 && words[1] === 0x0db8) return false;

    return true;
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

/** Managed routes are enabled by default; deployments can explicitly disable them. */
export function managedRoutesEnabled(): boolean {
    return process.env.MYDEVTOOLS_DISABLE_MANAGED_ROUTES !== "true"
        && process.env.MYDEVTOOLS_ENABLE_MANAGED_ROUTES !== "false";
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

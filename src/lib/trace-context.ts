export function inspectTraceParent(input: string) {
    const value = input.trim();
    const match = /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})(.*)$/.exec(value);
    if (!match || match[1] === "ff") throw new Error("Use a lowercase W3C traceparent: version-traceId-parentId-flags.");
    const [, version, traceId, parentId, flags, extra] = match;
    if (/^0+$/.test(traceId) || /^0+$/.test(parentId)) throw new Error("Trace and parent IDs must be nonzero.");
    if ((version === "00" && extra) || (extra && !/^-[0-9a-f]+(?:-[0-9a-f]+)*$/.test(extra))) throw new Error("Invalid version-specific traceparent fields.");
    return { version, traceId, parentId, flags, sampled: (parseInt(flags, 16) & 1) === 1 };
}

export function inspectTraceState(input: string) {
    if (!input.trim()) return [];
    if (input.length > 512) throw new Error("Tracestate exceeds 512 characters.");
    const entries = input.split(",").map((entry) => entry.trim());
    if (entries.length > 32) throw new Error("Tracestate supports at most 32 entries.");
    const seen = new Set<string>();
    return entries.map((entry) => {
        const separator = entry.indexOf("=");
        const key = entry.slice(0, separator), value = entry.slice(separator + 1);
        const validKey = /^(?:[a-z][a-z0-9_*/-]{0,255}|[a-z0-9][a-z0-9_*/-]{0,240}@[a-z][a-z0-9_*/-]{0,13})$/.test(key);
        if (separator < 1 || !validKey || !/^[\x20-\x2b\x2d-\x3c\x3e-\x7e]{1,256}$/.test(value) || value.endsWith(" ") || seen.has(key)) throw new Error(`Invalid or duplicate tracestate entry: ${key || entry}`);
        seen.add(key);
        return { key, value };
    });
}

function randomHex(length: number) { return Array.from(crypto.getRandomValues(new Uint8Array(length)), (b) => b.toString(16).padStart(2, "0")).join(""); }
export function generateTraceParent(sampled = true) { return `00-${randomHex(16)}-${randomHex(8)}-${sampled ? "01" : "00"}`; }

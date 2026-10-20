import Bowser from "bowser";
export interface UserAgentHints extends Bowser.ClientHints { bitness?: string; fullVersionList?: { brand: string; version: string }[] }
export function parseUserAgentHints(source: string): UserAgentHints | undefined {
    if (!source.trim()) return undefined;
    if (source.length > 32_768) throw new Error("Client Hints JSON limit is 32 KiB.");
    const value: unknown = JSON.parse(source);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Client Hints must be a JSON object.");
    const input = value as Record<string, unknown>, hints: UserAgentHints = {};
    for (const name of ["platform", "platformVersion", "architecture", "bitness", "model"] as const) if (input[name] !== undefined) { if (typeof input[name] !== "string" || input[name].length > 200) throw new Error(`Client Hint ${name} must be text up to 200 characters.`); hints[name] = input[name]; }
    for (const name of ["mobile", "wow64"] as const) if (input[name] !== undefined) { if (typeof input[name] !== "boolean") throw new Error(`Client Hint ${name} must be a boolean.`); hints[name] = input[name]; }
    for (const name of ["brands", "fullVersionList"] as const) if (input[name] !== undefined) { const brands = input[name]; if (!Array.isArray(brands) || brands.length > 20 || brands.some((brand) => !brand || typeof brand.brand !== "string" || brand.brand.length > 100 || typeof brand.version !== "string" || brand.version.length > 100)) throw new Error(`Client Hint ${name} needs up to 20 brand/version objects.`); hints[name] = brands.map((brand) => ({ brand: brand.brand, version: brand.version })); }
    return hints;
}
export function inspectUserAgent(source: string, hintsSource = "") {
    if (!source.trim() || source.length > 16_384) throw new Error("Enter a User-Agent string up to 16 KiB.");
    const hints = parseUserAgentHints(hintsSource), parsed = Bowser.parse(source, hints?.fullVersionList ? { ...hints, brands: hints.fullVersionList } : hints);
    let architecture = "Unknown", architectureSource = "Not reported";
    if (hints?.architecture) { architecture = hints.architecture + (hints.bitness ? ` (${hints.bitness}-bit)` : ""); architectureSource = "Client Hints (reported)"; }
    else {
        const patterns: [RegExp, string][] = [[/aarch64|arm64/i, "ARM64"], [/armv7|armv6|armv8l/i, "ARM 32-bit"], [/x86_64|amd64|Win64|WOW64|\bx64\b/i, "x86-64"], [/i[3-6]86|\bx86\b/i, "x86"], [/Intel Mac/i, "x86 (bitness not reported)"], [/ppc64|powerpc64/i, "PowerPC 64-bit"], [/ppc|powerpc/i, "PowerPC"], [/riscv64/i, "RISC-V 64-bit"]];
        const match = patterns.find(([pattern]) => pattern.test(source)); if (match) { architecture = match[1]; architectureSource = "User-Agent token (reported)"; }
    }
    return { browser: { name: parsed.browser.name || "Unknown", version: parsed.browser.version || "Unknown" }, operatingSystem: { name: parsed.os.name || "Unknown", version: parsed.os.version || "Unknown", versionName: parsed.os.versionName ?? null }, engine: { name: parsed.engine.name || "Unknown", version: parsed.engine.version || "Unknown" }, device: { type: parsed.platform.type ?? (hints?.mobile ? "mobile" : "Unknown"), vendor: parsed.platform.vendor || "Unknown", model: hints?.model || parsed.platform.model || "Unknown" }, cpu: { architecture, source: architectureSource }, automationTokenDetected: /bot|crawler|spider|slurp|bingpreview|Google-InspectionTool|facebookexternalhit|HeadlessChrome/i.test(source), clientHints: hints ?? null };
}

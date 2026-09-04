import YAML from "yaml";

export type DataRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is DataRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asRecord(value: unknown): DataRecord {
    return isRecord(value) ? value : {};
}

/** Parse JSON first for precise JSON errors, then accept YAML 1.2 documents. */
export function parseStructuredData(input: string): unknown {
    if (!input.trim()) throw new Error("Paste a JSON or YAML document first.");
    try {
        return JSON.parse(input);
    } catch {
        try {
            return YAML.parse(input);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unable to parse JSON or YAML.");
        }
    }
}

export function getString(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
}

export function getArray(value: unknown): unknown[] {
    return Array.isArray(value) ? value : [];
}

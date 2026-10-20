export interface VaultRecord {
    id: string;
    kind: "password" | "api-key" | "environment" | "connection" | "file";
    name: string;
    folder: string;
    username: string;
    environment: string;
    value: string;
    updatedAt: string;
    file?: { mime: string; size: number; modified: number };
}
export interface VaultContents { version: 1; records: VaultRecord[] }
/** Validate standard padded or unpadded Base64 without allocating decoded files. */
function fileContentMatchesSize(value: string, size: number): boolean {
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value)) return false;
    const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
    const symbols = value.length - padding;
    const remainder = symbols % 4;
    if (remainder === 1 || (padding > 0 && (value.length % 4 !== 0 || padding !== 4 - remainder))) return false;
    if (Math.floor(symbols * 3 / 4) !== size) return false;
    // Unused bits in the final symbol must be zero; permissive decoders can
    // otherwise accept multiple encodings for the same bytes.
    const last = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(value[symbols - 1] ?? "");
    return remainder === 2 ? (last & 15) === 0 : remainder === 3 ? (last & 3) === 0 : true;
}
export function vaultContents(value: unknown, purpose: "credentials" | "files"): VaultContents {
    if (!value || typeof value !== "object" || !("version" in value) || value.version !== 1 || !("records" in value) || !Array.isArray(value.records) || value.records.length > 500) throw new Error("Unsupported vault contents.");
    const ids = new Set<string>();
    for (const record of value.records) {
        if (!record || typeof record !== "object" || typeof record.id !== "string" || !record.id || ids.has(record.id) || !["password", "api-key", "environment", "connection", "file"].includes(record.kind) || ["name", "folder", "username", "environment", "value", "updatedAt"].some((key) => typeof record[key] !== "string") || record.name.length > 200 || record.folder.length > 500 || record.username.length > 500 || record.environment.length > 100 || record.value.length > 12 * 1024 * 1024) throw new Error("Vault contains an invalid record.");
        if (purpose === "files" ? record.kind !== "file" : record.kind === "file") throw new Error("This backup belongs to a different vault type.");
        if (record.kind === "file" && (!record.file || typeof record.file.mime !== "string" || !Number.isInteger(record.file.size) || record.file.size < 0 || record.file.size > 8 * 1024 * 1024 || typeof record.file.modified !== "number" || !/^[A-Za-z0-9+/]*={0,2}$/.test(record.value))) throw new Error("Vault file metadata is invalid.");
        if (record.kind === "file" && !fileContentMatchesSize(record.value, record.file.size)) throw new Error("Vault contains an invalid record.");
        ids.add(record.id);
    }
    return value as VaultContents;
}
export function bytesToBase64(bytes: Uint8Array): string {
    let output = "";
    for (let offset = 0; offset < bytes.length; offset += 8192) output += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    return btoa(output);
}
export function base64ToBytes(value: string): Uint8Array<ArrayBuffer> { return Uint8Array.from(atob(value), (char) => char.charCodeAt(0)); }

/** Portable, authenticated encryption. No passphrase or key is persisted. */
import { assertProjectWritable } from "./project-storage";
export interface VaultEnvelope {
    format: "mydevtools-vault";
    version: 1;
    kdf: "PBKDF2-SHA256";
    iterations: number;
    salt: string;
    cipher: "AES-256-GCM";
    iv: string;
    context: string;
    ciphertext: string;
}
const ITERATIONS = 600_000;
const MAX_BYTES = 32 * 1024 * 1024;
const BLOCK = 64 * 1024;
const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true });

function base64(bytes: Uint8Array): string {
    let result = "";
    for (let offset = 0; offset < bytes.length; offset += 8192) result += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    return btoa(result);
}
function unbase64(value: string, max: number): Uint8Array<ArrayBuffer> {
    if (value.length > Math.ceil(max / 3) * 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4) throw new Error("Invalid encrypted vault encoding.");
    const decoded = atob(value);
    if (decoded.length > max) throw new Error("Encrypted vault exceeds the size limit.");
    return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
}
function header(envelope: Omit<VaultEnvelope, "ciphertext">): Uint8Array<ArrayBuffer> {
    return encoder.encode(JSON.stringify([envelope.format, envelope.version, envelope.kdf, envelope.iterations, envelope.salt, envelope.cipher, envelope.iv, envelope.context]));
}
async function derive(passphrase: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<CryptoKey> {
    if (!passphrase || passphrase.length > 4096) throw new Error("Enter the vault passphrase (maximum 4096 characters).");
    const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
export function parseVaultEnvelope(value: unknown): VaultEnvelope {
    if (!value || typeof value !== "object") throw new Error("This file is not an encrypted My Dev Tools vault.");
    const e = value as Partial<VaultEnvelope>;
    if (e.format !== "mydevtools-vault" || e.version !== 1 || e.kdf !== "PBKDF2-SHA256" || e.cipher !== "AES-256-GCM" || !Number.isInteger(e.iterations) || e.iterations! < ITERATIONS || e.iterations! > 2_000_000 || typeof e.salt !== "string" || typeof e.iv !== "string" || typeof e.context !== "string" || e.context.length > 200 || typeof e.ciphertext !== "string") throw new Error("Unsupported or damaged vault format.");
    if (unbase64(e.salt, 16).length !== 16 || unbase64(e.iv, 12).length !== 12) throw new Error("Invalid vault salt or nonce.");
    if (unbase64(e.ciphertext, MAX_BYTES + BLOCK + 16).length < 20) throw new Error("The encrypted vault is truncated.");
    return e as VaultEnvelope;
}
function pack(value: unknown): Uint8Array<ArrayBuffer> {
    const text = encoder.encode(JSON.stringify(value));
    if (text.length > MAX_BYTES) throw new Error("Vault contents exceed 32 MiB. Export and split the vault.");
    const padded = new Uint8Array(Math.ceil((text.length + 4) / BLOCK) * BLOCK);
    new DataView(padded.buffer).setUint32(0, text.length);
    padded.set(text, 4);
    return padded;
}
function unpack(bytes: ArrayBuffer): unknown {
    const view = new DataView(bytes);
    const length = view.getUint32(0);
    if (length > MAX_BYTES || length > bytes.byteLength - 4) throw new Error("Vault payload is damaged.");
    return JSON.parse(decoder.decode(new Uint8Array(bytes, 4, length)));
}
export interface VaultSession {
    envelope: VaultEnvelope;
    read(): unknown;
    seal(value: unknown): Promise<VaultEnvelope>;
    lock(): void;
}
function session(keyValue: CryptoKey, initial: unknown, envelope: VaultEnvelope): VaultSession {
    let key: CryptoKey | null = keyValue;
    let contents: unknown = initial;
    return {
        envelope,
        read() { if (!key) throw new Error("Vault is locked."); return contents; },
        async seal(value) {
            if (!key) throw new Error("Vault is locked.");
            const nonce = crypto.getRandomValues(new Uint8Array(12));
            const { ciphertext: _old, ...previous } = this.envelope;
            void _old;
            const next = { ...previous, iv: base64(nonce) };
            const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce, additionalData: header(next), tagLength: 128 }, key, pack(value));
            if (!key) throw new Error("Vault locked while saving. Unlock and retry.");
            this.envelope = { ...next, ciphertext: base64(new Uint8Array(ciphertext)) };
            contents = value;
            return this.envelope;
        },
        lock() { key = null; contents = null; },
    };
}
export async function createVault(passphrase: string, context: string, initial: unknown): Promise<VaultSession> {
    if (passphrase.length < 12) throw new Error("Use a passphrase with at least 12 characters.");
    if (!context || context.length > 200) throw new Error("Invalid vault context.");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await derive(passphrase, salt, ITERATIONS);
    const envelope: VaultEnvelope = { format: "mydevtools-vault", version: 1, kdf: "PBKDF2-SHA256", iterations: ITERATIONS, salt: base64(salt), cipher: "AES-256-GCM", iv: "", context, ciphertext: "" };
    const opened = session(key, initial, envelope);
    await opened.seal(initial);
    return opened;
}
export async function openVault(value: unknown, passphrase: string, expectedContext?: string): Promise<VaultSession> {
    const envelope = parseVaultEnvelope(value);
    if (expectedContext && envelope.context !== expectedContext) throw new Error("This vault belongs to a different project or vault type. Use Import to move a backup.");
    const key = await derive(passphrase, unbase64(envelope.salt, 16), envelope.iterations);
    let contents: unknown;
    try {
        const bytes = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unbase64(envelope.iv, 12), additionalData: header(envelope), tagLength: 128 }, key, unbase64(envelope.ciphertext, MAX_BYTES + BLOCK + 16));
        contents = unpack(bytes);
    } catch { throw new Error("Could not unlock. Check the passphrase and that the backup is intact."); }
    return session(key, contents, envelope);
}

const DB_NAME = "MyDevToolsEncryptedVaults";
async function database(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => request.result.createObjectStore("vaults");
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error("Cannot open encrypted storage. Check browser storage permissions."));
    });
}
export async function readVault(id: string): Promise<VaultEnvelope | null> {
    const db = await database();
    try { return await new Promise((resolve, reject) => {
        const request = db.transaction("vaults", "readonly").objectStore("vaults").get(id);
        request.onsuccess = () => { try { resolve(request.result ? parseVaultEnvelope(request.result) : null); } catch (error) { reject(error); } };
        request.onerror = () => reject(new Error("Could not read encrypted storage."));
    }); } finally { db.close(); }
}
export async function writeVault(id: string, envelope: VaultEnvelope): Promise<void> {
    parseVaultEnvelope(envelope);
    const db = await database();
    try { await new Promise<void>((resolve, reject) => {
        const projectId = id.split(":", 1)[0];
        if (/^[a-f0-9-]{36}$/.test(projectId)) assertProjectWritable(projectId);
        const transaction = db.transaction("vaults", "readwrite");
        transaction.objectStore("vaults").put(envelope, id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(new Error("Encrypted vault could not be saved. Check storage quota and export a backup."));
        transaction.onabort = () => reject(new Error("Encrypted vault save was interrupted. Retry or export a backup."));
    }); } finally { db.close(); }
}

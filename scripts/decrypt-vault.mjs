#!/usr/bin/env node
// Standalone recovery, Node 20+. No application server or npm dependencies.
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { webcrypto } from "node:crypto";

async function password() {
    process.stderr.write("Backup passphrase: ");
    const terminal = !!process.stdin.isTTY;
    if (terminal) process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8"); process.stdin.resume();
    try {
        return await new Promise((accept, reject) => {
            let value = "";
            const cleanup = () => { process.stdin.removeListener("data", data); process.stdin.removeListener("end", end); };
            const end = () => { cleanup(); accept(value); };
            const data = (chunk) => {
                for (const char of chunk) {
                    if (char === "\u0003") { cleanup(); reject(new Error("Recovery cancelled.")); return; }
                    if (char === "\n" || char === "\r") { cleanup(); accept(value); return; }
                    if (char === "\u007f" || char === "\b") value = Array.from(value).slice(0, -1).join("");
                    else value += char;
                    if (value.length > 4096) { cleanup(); reject(new Error("Passphrase exceeds 4096 characters.")); return; }
                }
            };
            process.stdin.on("data", data); process.stdin.on("end", end);
        });
    } finally { if (terminal) process.stdin.setRawMode(false); process.stdin.pause(); process.stderr.write("\n"); }
}
async function main() {
    const args = process.argv.slice(2);
    const input = args[args.indexOf("--input") + 1];
    const output = args[args.indexOf("--output") + 1];
    if (!args.includes("--input") || !args.includes("--output") || !input || !output || input.startsWith("--") || output.startsWith("--")) throw new Error("Usage: node scripts/decrypt-vault.mjs --input encrypted-backup.json --output recovered-directory");
    if ((await stat(input)).size > 48 * 1024 * 1024) throw new Error("Encrypted backup exceeds 48 MiB.");
    const e = JSON.parse(await readFile(input, "utf8"));
    const decode = (value, length) => {
        if (typeof value !== "string" || value.length > Math.ceil(length / 3) * 4 || value.length % 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) throw new Error("Invalid encrypted backup encoding.");
        const bytes = Buffer.from(value, "base64");
        if (bytes.length > length) throw new Error("Encrypted data exceeds its limit.");
        return bytes;
    };
    if (e.format !== "mydevtools-vault" || e.version !== 1 || e.kdf !== "PBKDF2-SHA256" || e.cipher !== "AES-256-GCM" || !Number.isInteger(e.iterations) || e.iterations < 600000 || e.iterations > 2000000 || typeof e.context !== "string" || e.context.length > 200) throw new Error("Unsupported encrypted backup format.");
    const salt = decode(e.salt, 16), iv = decode(e.iv, 12), ciphertext = decode(e.ciphertext, 32 * 1024 * 1024 + 65536 + 16);
    if (salt.length !== 16 || iv.length !== 12) throw new Error("Invalid encryption parameters.");
    let passphrase = await password();
    const material = await webcrypto.subtle.importKey("raw", Buffer.from(passphrase, "utf8"), "PBKDF2", false, ["deriveKey"]);
    passphrase = "";
    const key = await webcrypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: e.iterations, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    const aad = Buffer.from(JSON.stringify([e.format, e.version, e.kdf, e.iterations, e.salt, e.cipher, e.iv, e.context]));
    let plain;
    try { plain = Buffer.from(await webcrypto.subtle.decrypt({ name: "AES-GCM", iv, additionalData: aad, tagLength: 128 }, key, ciphertext)); }
    catch { throw new Error("Cannot decrypt: incorrect passphrase or damaged backup."); }
    if (plain.length < 4 || plain.readUInt32BE(0) > plain.length - 4) throw new Error("Invalid decrypted payload.");
    const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(plain.subarray(4, plain.readUInt32BE(0) + 4)));
    if (value.version !== 1 || !Array.isArray(value.records) || value.records.length > 500) throw new Error("Unsupported vault contents.");
    const files = [], credentials = [];
    for (const [index, row] of value.records.entries()) {
        if (!row || typeof row.name !== "string" || typeof row.value !== "string") throw new Error("Invalid vault record.");
        if (row.kind === "file") {
            if (!row.file || !Number.isInteger(row.file.size) || row.file.size < 0 || row.file.size > 8 * 1024 * 1024) throw new Error("Invalid file metadata.");
            const bytes = decode(row.value, 8 * 1024 * 1024);
            if (bytes.length !== row.file.size) throw new Error("File contents do not match their saved size.");
            const basename = row.name.split(/[\\/]/).at(-1).replace(/[<>:"|?*\x00-\x1f]/g, "_").slice(0, 180) || "file";
            files.push({ name: `${index + 1}-${basename}`, bytes });
        } else if (["password", "api-key", "environment", "connection"].includes(row.kind)) credentials.push(row);
        else throw new Error("Unknown vault record type.");
    }
    const directory = resolve(output);
    await mkdir(directory, { recursive: true, mode: 0o700 });
    for (const file of files) await writeFile(join(directory, file.name), file.bytes, { flag: "wx", mode: 0o600 });
    if (credentials.length) await writeFile(join(directory, "credentials.json"), JSON.stringify({ version: 1, records: credentials }, null, 2), { flag: "wx", mode: 0o600 });
    plain.fill(0);
    process.stdout.write(`Recovered ${files.length} files and ${credentials.length} credential records. Decrypted output is unencrypted; protect the output directory.\n`);
}
main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });

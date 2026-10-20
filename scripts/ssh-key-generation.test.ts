import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash, webcrypto } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import type { generateSSHKeyPair as Generate, SSHGenerationOptions } from "../src/lib/ssh-key-generation";

const root = resolve(process.argv[2] ?? ".");
const source = readFileSync(resolve(root, "src/lib/ssh-key-generation.ts"), "utf8");
const compiled = { exports: {} as { generateSSHKeyPair: typeof Generate } };
const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
runInNewContext(code, { module: compiled, exports: compiled.exports, crypto: webcrypto, TextEncoder, Uint8Array, DataView, atob, btoa });
const { generateSSHKeyPair } = compiled.exports;
const dir = mkdtempSync(resolve(tmpdir(), "mydevtools-ssh-fixtures-"));
function cli(args: string[], input?: string) {
    return spawnSync("ssh-keygen", args, { input, encoding: "utf8", timeout: 15000, env: { ...process.env, SSH_ASKPASS_REQUIRE: "never" } });
}
function checked(args: string[], input?: string) {
    const result = cli(args, input);
    assert.equal(result.status, 0, `ssh-keygen ${args.join(" ")}: ${result.stderr}`);
    return result.stdout;
}
function publicParts(line: string) { return line.trim().split(/\s+/).slice(0, 2).join(" "); }
const fixtures: SSHGenerationOptions[] = [
    ...([2048, 3072, 4096] as const).map((rsaSize) => ({ type: "RSA" as const, rsaSize, comment: "café 日本語 العربية 🌍" })),
    ...(["P-256", "P-384", "P-521"] as const).map((curve) => ({ type: "ECDSA" as const, curve, comment: "café 日本語 العربية 🌍" })),
    { type: "Ed25519", comment: "café 日本語 العربية 🌍" },
];
async function main() {
try {
    assert.equal(cli(["-?"]).error, undefined, "The independent OpenSSH ssh-keygen fixture oracle must be installed");
    for (const [index, options] of fixtures.entries()) {
        const pair = await generateSSHKeyPair(options);
        assert.equal(pair.comment, options.comment);
        assert.ok(pair.publicKey.endsWith(options.comment), "UTF-8 comment retained in authorized_keys line");
        const name = resolve(dir, `key-${index}`);
        writeFileSync(name, pair.privateKey, { mode: 0o600 });
        writeFileSync(`${name}.pub`, `${pair.publicKey}\n`);
        const derived = checked(["-y", "-P", "", "-f", name]).trim();
        assert.equal(derived, pair.publicKey, "Independent ssh-keygen derives identical public bytes and Unicode comment from private file");
        const fingerprint = checked(["-l", "-E", "sha256", "-f", `${name}.pub`]);
        assert.equal(fingerprint.split(/\s+/)[1], pair.fingerprint);
        const wire = Buffer.from(pair.publicKey.split(" ")[1], "base64");
        assert.equal(`SHA256:${createHash("sha256").update(wire).digest("base64").replace(/=+$/, "")}`, pair.fingerprint);
        const expectedAlgorithm = options.type === "RSA" ? "ssh-rsa" : options.type === "ECDSA" ? `ecdsa-sha2-nistp${options.curve!.slice(2)}` : "ssh-ed25519";
        assert.equal(pair.publicKey.split(" ")[0], expectedAlgorithm);
        assert.equal(wire.subarray(4, 4 + wire.readUInt32BE()).toString(), expectedAlgorithm);
        assert.equal(Number(fingerprint.split(/\s+/)[0]), options.type === "RSA" ? options.rsaSize : options.type === "ECDSA" ? Number(options.curve!.slice(2)) : 256);
        const message = resolve(dir, `message-${index}`);
        const payload = "Public local test fixture: café 你好 العربية 🌍\n";
        writeFileSync(message, payload);
        checked(["-Y", "sign", "-f", name, "-n", "mydevtools-test", message]);
        const allowed = resolve(dir, `allowed-${index}`);
        writeFileSync(allowed, `fixture ${publicParts(pair.publicKey)}\n`);
        checked(["-Y", "verify", "-f", allowed, "-I", "fixture", "-n", "mydevtools-test", "-s", `${message}.sig`], payload);
        assert.notEqual(cli(["-Y", "verify", "-f", allowed, "-I", "fixture", "-n", "mydevtools-test", "-s", `${message}.sig`], `${payload}tampered`).status, 0);
        // Add encryption using OpenSSH itself; original export remains unencrypted.
        checked(["-p", "-P", "", "-N", "public-fixture-passphrase", "-f", name]);
        assert.equal(checked(["-y", "-P", "public-fixture-passphrase", "-f", name]).trim(), pair.publicKey);
        assert.notEqual(cli(["-y", "-P", "wrong-public-fixture", "-f", name]).status, 0);
        // Corrupt only one of the duplicate private envelope check integers.
        const body = Buffer.from(pair.privateKey.replace(/-----[^\n]+-----|\s/g, ""), "base64");
        let offset = "openssh-key-v1\0".length;
        for (let field = 0; field < 3; field++) offset += 4 + body.readUInt32BE(offset);
        assert.equal(body.readUInt32BE(offset), 1); offset += 4;
        offset += 4 + body.readUInt32BE(offset); // outer public blob
        offset += 4; // private section length
        body[offset] ^= 1;
        const corrupted = resolve(dir, `corrupt-${index}`);
        writeFileSync(corrupted, `-----BEGIN OPENSSH PRIVATE KEY-----\n${body.toString("base64").match(/.{1,70}/g)!.join("\n")}\n-----END OPENSSH PRIVATE KEY-----\n`, { mode: 0o600 });
        assert.notEqual(cli(["-y", "-P", "", "-f", corrupted]).status, 0, "OpenSSH rejects a mismatched private check integer");
        console.log(`OpenSSH interoperability: ${pair.keyType} public/private, UTF-8 comment, fingerprint, signature/tamper and passphrase re-encryption pass.`);
    }
    for (const comment of ["line\nbreak", "line\rbreak", "nul\0", "tab\t", "\u2028", "\uD800"]) await assert.rejects(generateSSHKeyPair({ type: "Ed25519", comment }), /comment/);
    await assert.rejects(generateSSHKeyPair({ type: "invalid", comment: "" } as unknown as SSHGenerationOptions), /Unsupported SSH/);
    await assert.rejects(generateSSHKeyPair({ type: "RSA", rsaSize: 1024, comment: "" } as unknown as SSHGenerationOptions), /Unsupported RSA/);
    await assert.rejects(generateSSHKeyPair({ type: "ECDSA", curve: "P-224", comment: "" } as unknown as SSHGenerationOptions), /Unsupported ECDSA/);
    const empty = await generateSSHKeyPair({ type: "Ed25519", comment: "" });
    assert.equal(empty.publicKey.split(" ").length, 2, "Empty comment produces no spurious third field");
    // Unsupported Ed25519 rejects without invoking a different algorithm.
    const attempts: string[] = [];
    const unavailable = { exports: {} as { generateSSHKeyPair: typeof Generate } };
    runInNewContext(code, { module: unavailable, exports: unavailable.exports, crypto: { subtle: { generateKey: async (algorithm: { name: string }) => { attempts.push(algorithm.name); throw new Error("Ed25519 unavailable"); } } }, TextEncoder, Uint8Array, DataView, atob, btoa });
    await assert.rejects(unavailable.exports.generateSSHKeyPair({ type: "Ed25519", comment: "" }), /Ed25519 unavailable/);
    assert.deepEqual(attempts, ["Ed25519"]);
} finally { rmSync(dir, { recursive: true, force: true }); }
console.log("SSH generation: all 7 selections pass independent installed ssh-keygen interoperability; no fake passphrase or algorithm fallback.");

}
main().catch((error) => { console.error(error); process.exitCode = 1; });

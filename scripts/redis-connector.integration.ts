import assert from "node:assert/strict";
import { createClient } from "redis";
import { parseRedisConnection, runRedis, type RedisScanResult, type RedisInspection } from "../src/lib/redis-connector";
async function main() {
    const port = Number(process.env.EXPANSION_REDIS_PORT); if (!port) throw new Error("Set EXPANSION_REDIS_PORT to the owned fixture port.");
    const connection = parseRedisConnection({ host: "127.0.0.1", port, username: "", password: "public-fixture-password-only", database: 0, tls: false });
    const fixture = createClient({ socket: { host: connection.host, port, reconnectStrategy: false }, password: connection.password }); fixture.on("error", () => {}); await fixture.connect();
    const prefix = "expansion-public-fixture:", binaryKey = Buffer.from([0xff, 0, 1]);
    try {
        await fixture.set(prefix + "text", "日本語 العربية"); await fixture.set(binaryKey, Buffer.from([0, 1, 128, 255])); await fixture.set(prefix + "big", "9223372036854775806"); await fixture.set(prefix + "large", "x".repeat(70_000));
        await fixture.hSet(prefix + "hash", { field: "value" }); await fixture.rPush(prefix + "list", ["first", "second"]); await fixture.sAdd(prefix + "set", ["a", "b"]); await fixture.zAdd(prefix + "zset", [{ score: 1.5, value: "a" }]); await fixture.xAdd(prefix + "stream", "*", { name: "fixture" }); await fixture.pExpire(prefix + "text", 60_000);
        const scan = await runRedis(connection, "scan", { pattern: prefix + "*", cursor: "0" }) as RedisScanResult;
        assert.ok(scan.keys.some((key) => key.display === prefix + "text")); assert.match(scan.cursor, /^\d+$/);
        const inspect = async (key: string | Buffer) => await runRedis(connection, "inspect", { keyBase64: Buffer.from(key).toString("base64") }) as RedisInspection;
        const text = await inspect(prefix + "text"); assert.equal(text.type, "string"); assert.ok(Number(text.ttlMilliseconds) > 0); assert.deepEqual(text.value, { type: "bytes", bytes: Buffer.byteLength("日本語 العربية"), base64: Buffer.from("日本語 العربية").toString("base64"), text: "日本語 العربية" });
        const binary = await inspect(binaryKey); assert.equal(binary.key.base64, binaryKey.toString("base64")); assert.deepEqual(binary.value, { type: "bytes", bytes: 4, base64: "AAGA/w==" });
        assert.equal((await inspect(prefix + "large")).truncated, true);
        for (const type of ["hash", "list", "set", "zset", "stream"]) { const result = await inspect(prefix + type); assert.equal(result.type, type); assert.ok(result.value); }
        assert.equal((await inspect(prefix + "missing")).ttlMilliseconds, "-2");
        await assert.rejects(() => runRedis(connection, "command", { arguments: ["SET", prefix + "blocked", "value"] }), /Enable writes/); assert.equal(await fixture.exists(prefix + "blocked"), 0);
        const increment = await runRedis(connection, "command", { arguments: ["INCR", prefix + "big"], write: true }) as { value: string }; assert.equal(increment.value, "9223372036854775807");
        for (const args of [["KEYS", "*"], ["EVAL", "return 1", "0"], ["CONFIG", "GET", "*"], ["FLUSHDB"], ["LRANGE", "key", "0", "-1"], ["GET", prefix + "large"]]) await assert.rejects(() => runRedis(connection, "command", { arguments: args, write: true }));
        const mutation = await runRedis(connection, "command", { arguments: ["SET", prefix + "written", "public-fixture"], write: true }) as { mutation: boolean }; assert.equal(mutation.mutation, true); assert.equal(await fixture.get(prefix + "written"), "public-fixture");
        const rawBinary = await runRedis(connection, "command", { arguments: ["GET", { base64: binaryKey.toString("base64") }] }) as { value: { base64: string } }; assert.equal(rawBinary.value.base64, "AAGA/w==");
        await assert.rejects(() => runRedis({ ...connection, password: "public-fixture-wrong-password" }, "command", { arguments: ["PING"] }), (error: unknown) => error instanceof Error && !error.message.includes("public-fixture-wrong-password"));
        console.log("Real Redis scan, binary keys/values, Unicode, TTL, all six preview types, exact 64-bit replies, write gates and bounded command rejection passed.");
    } finally { const keys = await fixture.keys(prefix + "*"); if (keys.length) await fixture.del(keys); await fixture.del(binaryKey); fixture.destroy(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

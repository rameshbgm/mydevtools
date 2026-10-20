import { createClient, RESP_TYPES } from "redis";
import { connectorHost, connectorObject, connectorPort, connectorText } from "./connector-config";
import { ConnectorHttpError } from "./local-connector-auth";
export interface RedisConnection { host: string; port: number; username: string; password: string; database: number; tls: boolean }
export interface RedisKey { base64: string; display: string }
export interface RedisScanResult { cursor: string; keys: RedisKey[] }
export interface RedisInspection { key: RedisKey; type: string; ttlMilliseconds: string; value: unknown; truncated: boolean; nextCursor?: string }
export function parseRedisConnection(value: unknown): RedisConnection {
    const input = connectorObject(value), database = input.database;
    if (typeof database !== "number" || !Number.isInteger(database) || database < 0 || database > 65535 || typeof input.tls !== "boolean") throw new ConnectorHttpError("Check the Redis database index and TLS setting.", 400);
    return { host: connectorHost(input.host), port: connectorPort(input.port), username: connectorText(input.username, "username", 200), password: connectorText(input.password, "password"), database, tls: input.tls };
}
function binaryArgument(value: unknown): string | Buffer {
    if (typeof value === "string" && Buffer.byteLength(value) <= 65_536) return value;
    if (value && typeof value === "object" && typeof (value as { base64?: unknown }).base64 === "string") {
        const source = (value as { base64: string }).base64;
        if (source.length <= 87_384 && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(source)) { const bytes = Buffer.from(source, "base64"); if (bytes.toString("base64") === source && bytes.length <= 65_536) return bytes; }
    }
    throw new ConnectorHttpError("Redis arguments must be text or canonical {base64: string} objects, up to 64 KiB each.", 400);
}
function buffer(value: unknown): Buffer { if (Buffer.isBuffer(value)) return value; if (typeof value === "string") return Buffer.from(value); throw new Error("Redis returned an unexpected string value."); }
function text(value: unknown): string { return buffer(value).toString("utf8"); }
function key(value: unknown): RedisKey { const bytes = buffer(value); let display: string; try { display = new TextDecoder("utf8", { fatal: true }).decode(bytes); } catch { display = "Binary key · " + bytes.toString("hex").slice(0, 80); } return { base64: bytes.toString("base64"), display: display.slice(0, 1000) }; }
function jsonReply(value: unknown, budget = { bytes: 0, nodes: 0 }): unknown {
    if (++budget.nodes > 20_000) throw new Error("Redis reply has too many items; narrow the command.");
    if (Buffer.isBuffer(value)) { budget.bytes += value.length; if (budget.bytes > 1024 * 1024) throw new Error("Redis reply exceeds 1 MiB; use a bounded range or scan."); let utf8: string | null = null; try { utf8 = new TextDecoder("utf8", { fatal: true }).decode(value); } catch {} return { type: "bytes", bytes: value.length, base64: value.toString("base64"), ...(utf8 !== null ? { text: utf8 } : {}) }; }
    if (Array.isArray(value)) return value.map((item) => jsonReply(item, budget));
    if (value instanceof Map) return [...value].map(([name, item]) => [jsonReply(name, budget), jsonReply(item, budget)]);
    if (value instanceof Set) return [...value].map((item) => jsonReply(item, budget));
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "string") { budget.bytes += Buffer.byteLength(value); if (budget.bytes > 1024 * 1024) throw new Error("Redis reply exceeds 1 MiB."); }
    return value;
}
const READ_COMMANDS = new Set(["PING", "TYPE", "TTL", "PTTL", "STRLEN", "LLEN", "HLEN", "SCARD", "ZCARD", "XLEN", "EXISTS", "GET", "GETRANGE", "LRANGE", "ZRANGE", "SCAN", "HSCAN", "SSCAN", "ZSCAN", "XRANGE"]);
const WRITE_COMMANDS = new Set(["SET", "SETEX", "PSETEX", "SETNX", "DEL", "UNLINK", "EXPIRE", "PEXPIRE", "PERSIST", "RENAME", "RENAMENX", "HSET", "HDEL", "LPUSH", "RPUSH", "LPOP", "RPOP", "LSET", "LREM", "SADD", "SREM", "ZADD", "ZREM", "INCR", "DECR", "INCRBY", "DECRBY", "APPEND"]);
function boundedCommand(args: (string | Buffer)[], write: boolean): string {
    if (!args.length || args.length > 200 || typeof args[0] !== "string" || args.reduce((sum, value) => sum + Buffer.byteLength(value), 0) > 128 * 1024) throw new ConnectorHttpError("Enter a JSON argument array up to 200 items / 128 KiB total.", 400);
    const command = args[0].toUpperCase(); args[0] = command;
    if (!READ_COMMANDS.has(command) && !WRITE_COMMANDS.has(command)) throw new ConnectorHttpError("This command is outside the supported key/inspection commands. Administrative, scripting, blocking and unbounded collection commands are not available.", 400);
    if (WRITE_COMMANDS.has(command) && !write) throw new ConnectorHttpError("Enable writes explicitly before sending this mutation.", 400);
    const int = (index: number) => typeof args[index] === "string" && /^\d+$/.test(args[index] as string) && Number.isSafeInteger(Number(args[index])) ? Number(args[index]) : -1;
    if (["GETRANGE", "LRANGE", "ZRANGE"].includes(command)) {
        const start = int(2), end = int(3), maximum = command === "GETRANGE" ? 65_536 : 200;
        if (start < 0 || end < start || end - start + 1 > maximum || args.length > (command === "ZRANGE" ? 5 : 4) || args.length < 4 || args[4] && String(args[4]).toUpperCase() !== "WITHSCORES") throw new ConnectorHttpError(`Use a nonnegative index range of up to ${maximum} ${command === "GETRANGE" ? "bytes" : "entries"}.`, 400);
    }
    if (["SCAN", "HSCAN", "SSCAN", "ZSCAN"].includes(command)) {
        const offset = command === "SCAN" ? 1 : 2;
        if (typeof args[offset] !== "string" || !/^\d{1,20}$/.test(args[offset] as string) || BigInt(args[offset] as string) > BigInt("18446744073709551615")) throw new ConnectorHttpError("Use an unsigned 64-bit scan cursor.", 400);
        const rest = args.slice(offset + 1); let hasCount = false;
        for (let index = 0; index < rest.length; index += 2) {
            const option = String(rest[index]).toUpperCase(), value = rest[index + 1];
            if (option === "MATCH" && typeof value === "string" && value.length <= 256) continue;
            if (option === "COUNT" && typeof value === "string" && /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 200 && !hasCount) { hasCount = true; continue; }
            throw new ConnectorHttpError("Scan options support MATCH (up to 256 characters) and COUNT 1–200.", 400);
        }
        if (!hasCount) args.push("COUNT", "100");
    }
    if (command === "XRANGE" && (args.length !== 6 || String(args[4]).toUpperCase() !== "COUNT" || int(5) < 1 || int(5) > 200)) throw new ConnectorHttpError("Use XRANGE key start end COUNT 1–200.", 400);
    if (["LPOP", "RPOP"].includes(command) && (args.length > 3 || args.length === 3 && (int(2) < 1 || int(2) > 200))) throw new ConnectorHttpError("Pop commands allow a count of 1–200.", 400);
    return command;
}
export async function runRedis(config: RedisConnection, operation: string, input: Record<string, unknown>): Promise<unknown> {
    const socket = config.tls ? { host: config.host, port: config.port, tls: true as const, rejectUnauthorized: true, connectTimeout: 5000, reconnectStrategy: false as const } : { host: config.host, port: config.port, connectTimeout: 5000, reconnectStrategy: false as const };
    const client = createClient({ socket, username: config.username || undefined, password: config.password || undefined, database: config.database, disableOfflineQueue: true, commandsQueueMaxLength: 200, RESP: 2 }).withTypeMapping({ [RESP_TYPES.BLOB_STRING]: Buffer, [RESP_TYPES.NUMBER]: String, [RESP_TYPES.DOUBLE]: String, [RESP_TYPES.BIG_NUMBER]: String });
    client.on("error", () => {});
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
        return await Promise.race([new Promise<never>((_, reject) => { timeout = setTimeout(() => { if (client.isOpen) client.destroy(); reject(new Error("Redis operation exceeded twelve seconds. A sent mutation may already have completed; inspect the key before retrying.")); }, 12_000); }), (async () => {
            await client.connect();
            const send = (args: (string | Buffer)[]) => client.sendCommand(args);
            let output: unknown;
            if (operation === "scan") {
                const cursor = connectorText(input.cursor, "scan cursor", 20, false), pattern = connectorText(input.pattern, "key pattern", 256);
                if (!/^\d+$/.test(cursor)) throw new ConnectorHttpError("Use a numeric scan cursor.", 400);
                const reply = await send(["SCAN", cursor, "MATCH", pattern || "*", "COUNT", "100"]) as unknown as [unknown, unknown[]];
                output = { cursor: text(reply[0]), keys: reply[1].map(key) } satisfies RedisScanResult;
            } else if (operation === "inspect") {
                const bytes = binaryArgument({ base64: input.keyBase64 });
                if (!Buffer.isBuffer(bytes)) throw new Error("Invalid key encoding.");
                const type = String(await send(["TYPE", bytes])), ttl = String(await send(["PTTL", bytes]));
                let value: unknown = null, truncated = false, nextCursor: string | undefined;
                if (type === "string") { const size = Number(await send(["STRLEN", bytes])); value = await send(["GETRANGE", bytes, "0", "65535"]); truncated = size > 65_536; }
                else if (["hash", "set"].includes(type)) { const reply = await send([type === "hash" ? "HSCAN" : "SSCAN", bytes, "0", "COUNT", "100"]) as unknown as [unknown, unknown[]]; nextCursor = text(reply[0]); value = reply[1]; truncated = nextCursor !== "0"; }
                else if (type === "list") { value = await send(["LRANGE", bytes, "0", "199"]); truncated = Number(await send(["LLEN", bytes])) > 200; }
                else if (type === "zset") { value = await send(["ZRANGE", bytes, "0", "199", "WITHSCORES"]); truncated = Number(await send(["ZCARD", bytes])) > 200; }
                else if (type === "stream") { value = await send(["XRANGE", bytes, "-", "+", "COUNT", "100"]); truncated = Number(await send(["XLEN", bytes])) > 100; }
                else if (type !== "none") value = { message: "This module value type has no built-in preview." };
                output = { key: key(bytes), type, ttlMilliseconds: ttl, value: jsonReply(value), truncated, ...(nextCursor ? { nextCursor } : {}) } satisfies RedisInspection;
            } else if (operation === "command") {
                if (!Array.isArray(input.arguments)) throw new ConnectorHttpError("Commands use a JSON array of arguments.", 400);
                const args = input.arguments.map(binaryArgument), command = boundedCommand(args, input.write === true);
                if (command === "GET" && args.length === 2 && Number(await send(["STRLEN", args[1]])) > 65_536) throw new ConnectorHttpError("GET value exceeds 64 KiB. Use GETRANGE with a bounded range.", 400);
                output = { command, value: jsonReply(await send(args)), mutation: WRITE_COMMANDS.has(command) };
            } else throw new ConnectorHttpError("Unsupported Redis operation.", 400);
            if (Buffer.byteLength(JSON.stringify(output)) > 2 * 1024 * 1024) throw new Error("Redis result exceeds 2 MiB. Narrow the operation."); return output;
        })()]);
    } catch (cause) { const message = cause instanceof Error ? cause.message : String(cause); throw new ConnectorHttpError((config.password ? message.split(config.password).join("[REDACTED]") : message).slice(0, 2000), cause instanceof ConnectorHttpError ? cause.status : 502); }
    finally { if (timeout) clearTimeout(timeout); if (client.isOpen) client.destroy(); }
}

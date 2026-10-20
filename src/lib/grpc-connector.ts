import { EventEmitter } from "node:events";
import { isIP } from "node:net";
import * as grpc from "@grpc/grpc-js";
import { createSecureContext, getCACertificates, checkServerIdentity } from "node:tls";
import { connectorHost, connectorObject, connectorPort, connectorText } from "./connector-config";
import { ConnectorHttpError } from "./local-connector-auth";
import { compileGrpcSchema, grpcMessages, grpcResponseJson } from "./grpc-proto";

export interface GrpcConnection { host: string; port: number; tls: boolean; serverName: string; ca: string; certificate: string; privateKey: string }
export interface GrpcCallResult { method: string; messages: unknown[]; initialMetadata: Record<string, string[]>; trailers: Record<string, string[]>; status: { code: number; name: string; details: string }; elapsedMs: number }
export function parseGrpcConnection(value: unknown): GrpcConnection {
    const input = connectorObject(value);
    const tls = input.tls !== false;
    const host = connectorHost(input.host), serverName = connectorText(input.serverName ?? "", "TLS server name", 253);
    if (serverName && (isIP(serverName) || connectorHost(serverName) !== serverName)) throw new ConnectorHttpError("TLS server name must be a DNS hostname matching the certificate.", 400);
    if (tls && isIP(host) && !serverName) throw new ConnectorHttpError("For gRPC TLS to an IP address, enter the certificate's DNS server name, or connect using its DNS hostname. Current Node runtimes reject IP addresses in TLS SNI.", 400);
    const ca = connectorText(input.ca ?? "", "CA certificate", 64 * 1024), certificate = connectorText(input.certificate ?? "", "client certificate", 64 * 1024), privateKey = connectorText(input.privateKey ?? "", "client private key", 64 * 1024);
    if (!!certificate !== !!privateKey) throw new ConnectorHttpError("Provide both the client certificate and its private key for mTLS.", 400);
    if (!tls && (ca || certificate || privateKey || serverName)) throw new ConnectorHttpError("Certificate settings require TLS.", 400);
    return { host, port: connectorPort(input.port), tls, serverName, ca, certificate, privateKey };
}
const PROTECTED_METADATA = /^(?:grpc-|:|content-type$|te$|user-agent$)/i;
export function grpcRequestMetadata(value: unknown): grpc.Metadata {
    const input = connectorObject(value ?? {}), metadata = new grpc.Metadata(); let bytes = 0, fields = 0;
    for (const [key, raw] of Object.entries(input)) {
        if (!/^[a-z\d_.-]{1,128}$/.test(key) || PROTECTED_METADATA.test(key)) throw new ConnectorHttpError("Use lowercase application metadata keys; gRPC transport headers are reserved.", 400);
        const values = Array.isArray(raw) ? raw : [raw];
        if (!values.length || values.length > 10) throw new ConnectorHttpError("Each metadata key supports 1–10 values.", 400);
        for (const item of values) {
            if (typeof item !== "string" || item.length > 4096 || ++fields > 100) throw new ConnectorHttpError("Metadata supports at most 100 string values, each up to 4096 characters.", 400);
            bytes += Buffer.byteLength(key) + Buffer.byteLength(item); if (bytes > 16 * 1024) throw new ConnectorHttpError("Metadata exceeds 16 KiB.", 400);
            if (key.endsWith("-bin")) {
                if (item.length % 4 !== 0 || !/^(?:[a-z\d+/]{4})*(?:[a-z\d+/]{2}==|[a-z\d+/]{3}=)?$/i.test(item)) throw new ConnectorHttpError("Binary metadata values must be padded base64 strings.", 400);
                metadata.add(key, Buffer.from(item, "base64"));
            } else { if (!/^[\x20-\x7e]*$/.test(item)) throw new ConnectorHttpError("Text metadata values must be printable ASCII; use -bin for binary data.", 400); metadata.add(key, item); }
        }
    }
    return metadata;
}
function metadataJson(value: grpc.Metadata): Record<string, string[]> {
    const out: Record<string, string[]> = Object.create(null);
    for (const key of Object.keys(value.getMap())) out[key] = value.get(key).map((item) => Buffer.isBuffer(item) ? item.toString("base64") : item);
    if (Buffer.byteLength(JSON.stringify(out)) > 32 * 1024) throw new ConnectorHttpError("RPC metadata response exceeds 32 KiB.", 413);
    return out;
}
export async function runGrpc(input: Record<string, unknown>, signal?: AbortSignal): Promise<unknown> {
    const schema = compileGrpcSchema(input.files);
    if (input.operation === "describe") return { methods: schema.methods };
    if (input.operation !== "call") throw new ConnectorHttpError("Choose describe or call for gRPC.", 400);
    const connection = parseGrpcConnection(input.connection);
    const method = schema.methods.find((entry) => entry.path === input.method);
    if (!method) throw new ConnectorHttpError("Choose a method from this proto set.", 400);
    const messages = grpcMessages(schema, method, input.messages), metadata = grpcRequestMetadata(input.metadata);
    const timeoutMs = input.timeoutMs ?? 10_000;
    if (typeof timeoutMs !== "number" || !Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 15_000) throw new ConnectorHttpError("RPC deadline must be 100–15,000 milliseconds.", 400);
    const service = schema.definition[method.service] as grpc.ServiceDefinition;
    const definition = Object.values(service).find((entry) => entry.path === method.path);
    if (!definition) throw new ConnectorHttpError("The RPC method definition is unavailable.", 400);
    const credentials = connection.tls ? grpc.credentials.createFromSecureContext(createSecureContext({ ca: connection.ca || getCACertificates("bundled"), cert: connection.certificate || undefined, key: connection.privateKey || undefined, minVersion: "TLSv1.2" }), { rejectUnauthorized: true, checkServerIdentity }) : grpc.credentials.createInsecure();
    const address = connection.host.includes(":") ? `[${connection.host}]:${connection.port}` : `${connection.host}:${connection.port}`;
    const client = new grpc.Client(address, credentials, {
        "grpc.enable_http_proxy": 0, "grpc.enable_retries": 0, "grpc.service_config_disable_resolution": 1,
        "grpc.max_receive_message_length": 2 * 1024 * 1024, "grpc.max_send_message_length": 1024 * 1024,
        "grpc.max_metadata_size": 32 * 1024, "grpc.use_local_subchannel_pool": 1, "grpc.enable_channelz": 0,
        ...(connection.serverName ? { "grpc.ssl_target_name_override": connection.serverName } : {}),
    });
    const started = Date.now();
    try { return await new Promise<GrpcCallResult>((resolve, reject) => {
        let settled = false, call: grpc.ClientUnaryCall | grpc.ClientReadableStream<unknown> | grpc.ClientWritableStream<unknown> | grpc.ClientDuplexStream<unknown, unknown> | undefined;
        let initialMetadata: Record<string, string[]> = {}, bytes = 0;
        const responses: unknown[] = [];
        const cleanup = () => { clearTimeout(timer); signal?.removeEventListener("abort", abort); };
        const fail = (cause: unknown) => { if (settled) return; settled = true; cleanup(); call?.cancel(); reject(cause instanceof Error ? cause : new Error("RPC failed.")); };
        const add = (value: unknown) => {
            try { const json = grpcResponseJson(schema, method, value); bytes += Buffer.byteLength(JSON.stringify(json)); if (responses.length >= 100 || bytes > 2 * 1024 * 1024) throw new ConnectorHttpError("RPC response exceeds 100 messages or 2 MiB.", 413); responses.push(json); }
            catch (cause) { fail(cause); }
        };
        const abort = () => call?.cancel();
        const timer = setTimeout(() => fail(new ConnectorHttpError("RPC exceeded its deadline.", 504)), timeoutMs + 500);
        const options: grpc.CallOptions = { deadline: new Date(started + timeoutMs) };
        const callback = (_error: grpc.ServiceError | null, response?: unknown) => { if (response !== undefined) add(response); };
        try {
            if (method.requestStream && method.responseStream) call = client.makeBidiStreamRequest(method.path, definition.requestSerialize, definition.responseDeserialize, metadata, options);
            else if (method.requestStream) call = client.makeClientStreamRequest(method.path, definition.requestSerialize, definition.responseDeserialize, metadata, options, callback);
            else if (method.responseStream) call = client.makeServerStreamRequest(method.path, definition.requestSerialize, definition.responseDeserialize, messages[0], metadata, options);
            else call = client.makeUnaryRequest(method.path, definition.requestSerialize, definition.responseDeserialize, messages[0], metadata, options, callback);
            const events = call as EventEmitter;
            events.on("metadata", (value: grpc.Metadata) => { try { initialMetadata = metadataJson(value); } catch (cause) { fail(cause); } });
            events.on("error", () => { /* Status event below retains gRPC code, details and partial messages. */ });
            events.on("status", (status: grpc.StatusObject) => {
                if (settled) return;
                try {
                    const trailers = metadataJson(status.metadata); settled = true; cleanup();
                    resolve({ method: method.path, messages: responses, initialMetadata, trailers, status: { code: status.code, name: grpc.status[status.code] ?? "UNKNOWN", details: status.details }, elapsedMs: Date.now() - started });
                } catch (cause) { fail(cause); }
            });
            if (method.responseStream) events.on("data", add);
            signal?.addEventListener("abort", abort, { once: true }); if (signal?.aborted) abort();
            if (method.requestStream) {
                const writer = call as grpc.ClientWritableStream<unknown>;
                // At most 100 messages / 1 MiB in total; stream backpressure is
                // retained by Writable's own bounded queue and the RPC deadline.
                for (const message of messages) writer.write(message);
                writer.end();
            }
        } catch (cause) { fail(cause); }
    }); } finally { client.close(); }
}

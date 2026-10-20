import protobuf from "protobufjs";
import * as protoLoader from "@grpc/proto-loader";
import path from "node:path";
import { parseDocumentJson } from "./document-json";
import { ConnectorHttpError } from "./local-connector-auth";

export interface ProtoFile { name: string; source: string }
export interface GrpcMethodInfo { service: string; name: string; path: string; requestStream: boolean; responseStream: boolean; requestType: string; responseType: string; sample: Record<string, unknown> }
export interface GrpcSchema { definition: protoLoader.PackageDefinition; methods: GrpcMethodInfo[]; root: protobuf.Root }
const LOADER_OPTIONS: protoLoader.Options = { keepCase: true, longs: String, enums: String, bytes: String, oneofs: true, json: false };
const RESERVED = new Set(["__proto__", "prototype", "constructor"]);
function invalid(message: string): never { throw new ConnectorHttpError(message, 400); }
function filename(value: string): string {
    if (typeof value !== "string" || value.length > 200 || !/^[a-z\d_./-]+\.proto$/i.test(value) || value.startsWith("/") || value.includes("\\")) invalid("Use relative .proto file names with letters, numbers, dashes or underscores.");
    const normalized = path.posix.normalize(value);
    if (normalized.startsWith("../") || normalized === "..") invalid("Proto imports cannot leave the uploaded file set.");
    return normalized;
}
function sample(type: protobuf.Type, depth = 0): Record<string, unknown> {
    const out: Record<string, unknown> = Object.create(null);
    for (const field of type.fieldsArray.slice(0, 20)) {
        if (field.partOf && field.partOf.oneof[0] !== field.name) continue;
        if (field.map) out[field.name] = {};
        else if (field.repeated) out[field.name] = [];
        else if (field.resolvedType instanceof protobuf.Type) { if (depth < 2) out[field.name] = sample(field.resolvedType, depth + 1); }
        else if (field.resolvedType instanceof protobuf.Enum) out[field.name] = Object.keys(field.resolvedType.values)[0];
        else out[field.name] = field.type === "string" ? "example" : field.type === "bytes" ? "" : field.type === "bool" ? false : /64$/.test(field.type) ? "0" : 0;
    }
    return out;
}
export function compileGrpcSchema(value: unknown): GrpcSchema {
    if (!Array.isArray(value) || !value.length || value.length > 32) invalid("Provide 1–32 .proto files.");
    const files = new Map<string, string>(); let bytes = 0;
    for (const file of value) {
        if (!file || typeof file.name !== "string" || typeof file.source !== "string") invalid("Each proto file needs a name and source text.");
        const name = filename(file.name); if (files.has(name)) invalid(`Duplicate proto file: ${name}.`);
        bytes += Buffer.byteLength(file.source); if (bytes > 256 * 1024) invalid("The uploaded proto set exceeds 256 KiB.");
        // Bound recursive grammar nesting before entering the synchronous parser.
        let depth = 0;
        for (const token of file.source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, "").match(/[{}[\]]/g) ?? []) {
            depth += token === "{" || token === "[" ? 1 : -1; if (depth > 40) invalid("Proto nesting exceeds 40 levels.");
        }
        files.set(name, file.source);
    }
    const root = new protobuf.Root(), loaded = new Set<string>();
    const load = (name: string, importer = "") => {
        const bundled = name.startsWith("google/protobuf/") && name.endsWith(".proto") ? (protobuf.common as unknown as Record<string, protobuf.INamespace>)[name] : undefined;
        const resolved = files.has(name) || bundled ? name : filename(path.posix.join(path.posix.dirname(importer), name));
        if (loaded.has(resolved)) return;
        loaded.add(resolved);
        if (!files.has(resolved) && bundled) { root.addJSON(bundled.nested ?? {}); return; }
        const source = files.get(resolved); if (source === undefined) invalid(`Missing uploaded proto import: ${name}. File-system and URL imports are disabled.`);
        const parsed = protobuf.parse(source, root, { keepCase: true });
        for (const dependency of [...parsed.imports ?? [], ...parsed.weakImports ?? []]) load(dependency, resolved);
    };
    try {
        for (const name of files.keys()) load(name);
        root.resolveAll();
        let nodes = 0;
        const inspect = (node: protobuf.ReflectionObject) => {
            if (++nodes > 10_000) invalid("Proto declarations exceed the 10,000-node limit.");
            if (RESERVED.has(node.name)) invalid("This proto uses a field or declaration name reserved by the JavaScript runtime.");
            if (node instanceof protobuf.Type) for (const field of node.fieldsArray) { if (++nodes > 10_000) invalid("Proto declarations exceed the 10,000-node limit."); if (RESERVED.has(field.name)) invalid("This proto uses a reserved field name."); }
            if (node instanceof protobuf.Namespace) node.nestedArray.forEach(inspect);
        };
        inspect(root);
        const methods: GrpcMethodInfo[] = [];
        const services = (node: protobuf.Namespace) => {
            for (const child of node.nestedArray) {
                if (child instanceof protobuf.Service) for (const method of child.methodsArray) methods.push({ service: child.fullName.slice(1), name: method.name, path: `/${child.fullName.slice(1)}/${method.name}`, requestStream: method.requestStream === true, responseStream: method.responseStream === true, requestType: method.resolvedRequestType!.fullName.slice(1), responseType: method.resolvedResponseType!.fullName.slice(1), sample: sample(method.resolvedRequestType!) });
                else if (child instanceof protobuf.Namespace) services(child);
            }
        };
        services(root);
        if (!methods.length || methods.length > 200) invalid("Provide a proto set containing 1–200 RPC methods.");
        return { root, methods, definition: protoLoader.fromJSON(root.toJSON(), LOADER_OPTIONS) };
    } catch (cause) { if (cause instanceof ConnectorHttpError) throw cause; invalid(`Proto could not be compiled: ${cause instanceof Error ? cause.message : "invalid declarations"}`); }
}
const SIGNED32: [bigint, bigint] = [BigInt("-2147483648"), BigInt("2147483647")];
const UNSIGNED32: [bigint, bigint] = [BigInt(0), BigInt("4294967295")];
const SIGNED64: [bigint, bigint] = [BigInt("-9223372036854775808"), BigInt("9223372036854775807")];
const UNSIGNED64: [bigint, bigint] = [BigInt(0), BigInt("18446744073709551615")];
const INTEGER_TYPES: Record<string, [bigint, bigint]> = { int32: SIGNED32, sint32: SIGNED32, sfixed32: SIGNED32, uint32: UNSIGNED32, fixed32: UNSIGNED32, int64: SIGNED64, sint64: SIGNED64, sfixed64: SIGNED64, uint64: UNSIGNED64, fixed64: UNSIGNED64 };

export function grpcMessages(schema: GrpcSchema, method: GrpcMethodInfo, source: unknown): Record<string, unknown>[] {
    if (typeof source !== "string" || Buffer.byteLength(source) > 1024 * 1024) invalid("RPC request JSON must fit within 1 MiB.");
    let parsed: unknown;
    try { parsed = parseDocumentJson(source, "reject").value; } catch (cause) { invalid(`Invalid RPC request JSON: ${cause instanceof Error ? cause.message : "parse error"}`); }
    const values = method.requestStream ? parsed : [parsed];
    if (!Array.isArray(values) || values.length > 100) invalid("Streaming request input must be a JSON array with at most 100 messages.");
    const type = schema.root.lookupType(method.requestType); let nodes = 0;
    const scalar = (field: protobuf.Field, value: unknown, depth: number): void => {
        if (value === null) return;
        if (++nodes > 10_000 || depth > 40) invalid("RPC request structure exceeds the nesting/value limit.");
        if (field.resolvedType instanceof protobuf.Type) { message(field.resolvedType, value, depth + 1); return; }
        if (field.resolvedType instanceof protobuf.Enum) { if (typeof value === "string" && Object.hasOwn(field.resolvedType.values, value) || typeof value === "number" && Number.isInteger(value) && value >= -2147483648 && value <= 2147483647) return; invalid(`Invalid enum value in ${field.name}.`); }
        if (INTEGER_TYPES[field.type]) {
            if (typeof value === "number" ? !Number.isSafeInteger(value) : typeof value !== "string" || !/^-?\d{1,20}$/.test(value)) invalid(`Use an integer or decimal string for ${field.name}; 64-bit values must not be rounded.`);
            const integer = BigInt(value as string | number), [min, max] = INTEGER_TYPES[field.type];
            if (integer < min || integer > max) invalid(`Integer is outside the ${field.type} range in ${field.name}.`);
        } else if (field.type === "string") { if (typeof value !== "string") invalid(`${field.name} must be a string.`); }
        else if (field.type === "bool") { if (typeof value !== "boolean") invalid(`${field.name} must be a boolean.`); }
        else if (field.type === "bytes") { if (typeof value !== "string" || value.length % 4 !== 0 || !/^(?:[a-z\d+/]{4})*(?:[a-z\d+/]{2}==|[a-z\d+/]{3}=)?$/i.test(value)) invalid(`${field.name} must be a padded base64 string.`); }
        else if (!["NaN", "Infinity", "-Infinity"].includes(String(value))) {
            if (typeof value !== "number" || !Number.isFinite(value)) invalid(`${field.name} must be a number.`);
            if (field.type === "float" && Math.abs(value as number) > 3.4028234663852886e38) invalid(`${field.name} exceeds the finite float32 range. Use an explicit Infinity string if intended.`);
        }
    };
    const message = (current: protobuf.Type, input: unknown, depth: number) => {
        if (!input || typeof input !== "object" || Array.isArray(input)) invalid(`Message ${current.fullName} must be a JSON object.`);
        for (const [key, value] of Object.entries(input)) {
            if (!Object.hasOwn(current.fields, key)) invalid(`Unknown field ${key} in ${current.fullName}.`);
            const field = current.fields[key]; if (value === null) continue;
            if (field instanceof protobuf.MapField) {
                if (typeof value !== "object" || Array.isArray(value)) invalid(`${key} must be an object map.`);
                const keyType = field.keyType;
                for (const [mapKey, item] of Object.entries(value)) {
                    if (RESERVED.has(mapKey)) invalid("Map keys cannot use reserved JavaScript names.");
                    if (keyType === "bool" && !["true", "false"].includes(mapKey)) invalid(`${key} needs boolean map keys.`);
                    if (INTEGER_TYPES[keyType]) { if (!/^-?\d{1,20}$/.test(mapKey)) invalid(`${key} needs integer map keys.`); const integer = BigInt(mapKey), [min, max] = INTEGER_TYPES[keyType]; if (integer < min || integer > max) invalid(`${key} has an out-of-range map key.`); }
                    if (item === null) invalid(`${key} map values cannot be null.`);
                    scalar(field, item, depth);
                }
            }
            else if (field.repeated) { if (!Array.isArray(value)) invalid(`${key} must be an array.`); value.forEach((item) => { if (item === null) invalid(`${key} array items cannot be null.`); scalar(field, item, depth); }); }
            else scalar(field, value, depth);
        }
        for (const oneof of current.oneofsArray) if (oneof.oneof.filter((key) => (input as Record<string, unknown>)[key] != null).length > 1) invalid(`Set only one field in oneof ${oneof.name}.`);
        for (const field of current.fieldsArray) if (field.required && (input as Record<string, unknown>)[field.name] == null) invalid(`Required field ${field.name} is missing.`);
    };
    for (const value of values) message(type, value, 0);
    return values as Record<string, unknown>[];
}

/** protobufjs stores decoded 64-bit map keys as eight-byte hashes. Convert
 * those hashes back to decimal strings before presenting/exporting JSON. */
export function grpcResponseJson(schema: GrpcSchema, method: GrpcMethodInfo, value: unknown): unknown {
    const scalar = (field: protobuf.Field, item: unknown): unknown => field.resolvedType instanceof protobuf.Type ? message(field.resolvedType, item) : typeof item === "number" && !Number.isFinite(item) ? String(item) : item;
    const message = (type: protobuf.Type, input: unknown): unknown => {
        if (!input || typeof input !== "object" || Array.isArray(input)) return input;
        const out: Record<string, unknown> = Object.create(null);
        for (const [key, item] of Object.entries(input)) {
            const field = type.fields[key];
            if (!field || item == null) { out[key] = item; continue; }
            if (field instanceof protobuf.MapField) {
                const values: Record<string, unknown> = Object.create(null);
                for (const [mapKey, entry] of Object.entries(item)) values[/64$/.test(field.keyType) ? protobuf.util.longFromHash(mapKey, field.keyType === "uint64" || field.keyType === "fixed64").toString() : mapKey] = scalar(field, entry);
                out[key] = values;
            } else out[key] = field.repeated && Array.isArray(item) ? item.map((entry) => scalar(field, entry)) : scalar(field, item);
        }
        return out;
    };
    return message(schema.root.lookupType(method.responseType), value);
}

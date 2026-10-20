import { S3Client, ListBucketsCommand, ListObjectsV2Command, HeadObjectCommand, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { Readable, Transform } from "node:stream";
import { createHash } from "node:crypto";
import { Agent as HttpAgent } from "node:http";
import { Agent as HttpsAgent } from "node:https";
import { connectorHost, connectorObject, connectorText } from "./connector-config";
import { ConnectorHttpError } from "./local-connector-auth";
export interface S3Connection { endpoint: string; region: string; accessKeyId: string; secretAccessKey: string; sessionToken: string; forcePathStyle: boolean; allowHttp: boolean }
export interface S3BucketPage { buckets: { name: string; createdAt: string | null }[]; nextToken: string; truncated: boolean }
export interface S3ObjectPage { prefix: string; folders: string[]; objects: { key: string; size: string; modifiedAt: string | null; etag: string }[]; nextToken: string; truncated: boolean }
export interface S3ObjectInfo { key: string; size: string; contentType: string; etag: string; modifiedAt: string | null; versionId: string; metadata: Record<string,string> }
export interface S3Download { info: S3ObjectInfo; base64: string; bytes: number }
const MAX_FILE = 8 * 1024 * 1024;
// Serialize writes from this runtime even when a compatible server ignores
// If-None-Match. Other clients still require server-enforced conditions.
const mutationQueues = new Map<string,Promise<void>>();
export function parseS3Connection(value: unknown): S3Connection {
    const input = connectorObject(value);
    if (typeof input.forcePathStyle !== "boolean" || typeof input.allowHttp !== "boolean") throw new ConnectorHttpError("Check the S3 address style and HTTP setting.",400);
    let endpoint: URL; try { endpoint = new URL(connectorText(input.endpoint,"endpoint",2048,false)); } catch { throw new ConnectorHttpError("Enter an absolute S3 service endpoint URL.",400); }
    if (!["https:","http:"].includes(endpoint.protocol) || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || endpoint.pathname !== "/") throw new ConnectorHttpError("Use an HTTP(S) service endpoint without credentials, path, query or fragment.",400);
    connectorHost(endpoint.hostname);
    if (endpoint.protocol === "http:" && !input.allowHttp) throw new ConnectorHttpError("Enable unencrypted HTTP explicitly for this development endpoint, or use HTTPS.",400);
    const region = connectorText(input.region,"signing region",63,false), accessKeyId = connectorText(input.accessKeyId,"access key ID",200,false), secretAccessKey = connectorText(input.secretAccessKey,"secret access key",4096,false), sessionToken = connectorText(input.sessionToken,"session token",8192);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(region) || !/^[A-Za-z0-9_+=.@-]+$/.test(accessKeyId) || /[\x00-\x1f\x7f]/.test(secretAccessKey + sessionToken)) throw new ConnectorHttpError("Check the signing region and credentials; control characters are not supported.",400);
    return { endpoint:endpoint.origin,region,accessKeyId,secretAccessKey,sessionToken,forcePathStyle:input.forcePathStyle,allowHttp:input.allowHttp };
}
/** Bound raw XML/error responses before the SDK parses them, as well as object streams. */
export class BoundedS3HttpHandler extends NodeHttpHandler {
    constructor(private readonly maximumBytes: number) { super({connectionTimeout:5000,requestTimeout:12000,httpAgent:new HttpAgent({keepAlive:true,maxSockets:4}),httpsAgent:new HttpsAgent({keepAlive:true,maxSockets:4,rejectUnauthorized:true})}); }
    override async handle(...args: Parameters<NodeHttpHandler["handle"]>) {
        const result = await super.handle(...args), source = result.response.body as Readable;
        if (!source || typeof source.pipe !== "function") return result;
        const declared = result.response.headers["content-length"];
        if (args[0].method !== "HEAD" && declared && /^\d+$/.test(declared) && Number(declared) > this.maximumBytes) { source.destroy(); throw new ConnectorHttpError("Storage response exceeds the operation’s size limit. Use a smaller object or narrower listing.",413); }
        let size = 0;
        const maximum = this.maximumBytes;
        const bounded = new Transform({ transform(chunk: Buffer, _encoding, callback) { size += chunk.length; if (size > maximum) callback(new ConnectorHttpError("Storage response exceeds the operation’s size limit. Use a smaller object or narrower listing.",413)); else callback(null,chunk); } });
        bounded.on("error",()=>{}); source.on("error",(cause)=>bounded.destroy(cause)); bounded.on("close",()=>{ if (!source.destroyed) source.destroy(); });
        result.response.body = source.pipe(bounded);
        return result;
    }
}
function bucketName(value: unknown): string {
    const bucket = connectorText(value,"bucket",63,false);
    if (bucket.length < 3 || !/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(bucket) || bucket.includes("..") || /^\d+\.\d+\.\d+\.\d+$/.test(bucket)) throw new ConnectorHttpError("Use a 3–63 character DNS-style bucket name. Access-point ARNs and directory buckets are outside this client’s scope.",400);
    if (bucket.endsWith("--x-s3") || bucket.endsWith(".mrap") || bucket.endsWith("-s3alias")) throw new ConnectorHttpError("Use a general-purpose S3 bucket or an S3-compatible bucket.",400);
    return bucket;
}
function objectKey(value: unknown, allowEmpty = false): string {
    const key = connectorText(value,"object key/prefix",1024,allowEmpty);
    if (Buffer.byteLength(key) > 1024 || /[\x00-\x1f\x7f\uD800-\uDFFF]/u.test(key)) throw new ConnectorHttpError("Object keys/prefixes must be valid Unicode up to 1024 UTF-8 bytes, without control characters.",400);
    return key;
}
const pageToken = (value: unknown) => value === undefined ? "" : connectorText(value,"pagination token",8192);
function objectInfo(key: string, value: { ContentLength?: number; ContentType?: string; ETag?: string; LastModified?: Date; VersionId?: string; Metadata?: Record<string,string> }): S3ObjectInfo {
    return {key,size:String(value.ContentLength ?? 0),contentType:value.ContentType ?? "application/octet-stream",etag:value.ETag ?? "",modifiedAt:value.LastModified?.toISOString() ?? null,versionId:value.VersionId ?? "",metadata:value.Metadata ?? {}};
}
export async function runS3(config: S3Connection, operation: string, input: Record<string,unknown>): Promise<unknown> {
    if (!["buckets","objects","info","download","upload","delete"].includes(operation)) throw new ConnectorHttpError("Unsupported S3 operation.",400);
    const bucket = operation === "buckets" ? "" : bucketName(input.bucket), key = ["info","download","upload","delete"].includes(operation) ? objectKey(input.key) : "";
    if (["upload","delete"].includes(operation) && input.write !== true) throw new ConnectorHttpError("Enable storage writes explicitly before uploading or deleting.",400);
    if (operation === "delete" && input.confirmKey !== key) throw new ConnectorHttpError("Confirm deletion by entering the complete object key.",400);
    const controller = new AbortController(), timeout = setTimeout(()=>controller.abort(),15_000);
    let client: S3Client | undefined, release: (()=>void) | undefined, queue: Promise<void> | undefined, queueKey = "";
    try {
        if (["upload","delete"].includes(operation)) {
            queueKey = createHash("sha256").update(JSON.stringify([config.endpoint,bucket,key])).digest("hex");
            const previous = mutationQueues.get(queueKey) ?? Promise.resolve(), gate = new Promise<void>((resolve)=>{release=resolve;});
            queue = previous.catch(()=>{}).then(()=>gate); mutationQueues.set(queueKey,queue);
            await previous.catch(()=>{});
        }
        if (controller.signal.aborted) throw new Error("StorageQueueTimeout");
        client = new S3Client({ endpoint:config.endpoint,region:config.region,credentials:{accessKeyId:config.accessKeyId,secretAccessKey:config.secretAccessKey,...(config.sessionToken ? {sessionToken:config.sessionToken} : {})},forcePathStyle:config.forcePathStyle,followRegionRedirects:false,useArnRegion:false,disableMultiregionAccessPoints:true,disableS3ExpressSessionAuth:true,useFipsEndpoint:false,useDualstackEndpoint:false,maxAttempts:1,requestChecksumCalculation:"WHEN_REQUIRED",responseChecksumValidation:"WHEN_REQUIRED",requestHandler:new BoundedS3HttpHandler(operation === "download" ? MAX_FILE : 2 * 1024 * 1024) });
        const request = {abortSignal:controller.signal};
        if (operation === "buckets") {
            const token = pageToken(input.cursor), response = await client.send(new ListBucketsCommand({MaxBuckets:100,...(token ? {ContinuationToken:token} : {})}),request);
            return {buckets:(response.Buckets ?? []).slice(0,100).map((bucket)=>({name:bucket.Name ?? "",createdAt:bucket.CreationDate?.toISOString() ?? null})),nextToken:response.ContinuationToken ?? "",truncated:!!response.ContinuationToken || (response.Buckets?.length ?? 0)>100} satisfies S3BucketPage;
        }
        if (operation === "objects") {
            const prefix = objectKey(input.prefix ?? "",true), token = pageToken(input.cursor), response = await client.send(new ListObjectsV2Command({Bucket:bucket,Prefix:prefix,Delimiter:"/",MaxKeys:100,...(token ? {ContinuationToken:token} : {})}),request);
            return {prefix,folders:(response.CommonPrefixes ?? []).slice(0,100).map((item)=>item.Prefix ?? ""),objects:(response.Contents ?? []).slice(0,100).map((item)=>({key:item.Key ?? "",size:String(item.Size ?? 0),modifiedAt:item.LastModified?.toISOString() ?? null,etag:item.ETag ?? ""})),nextToken:response.NextContinuationToken ?? "",truncated:response.IsTruncated === true} satisfies S3ObjectPage;
        }
        if (operation === "info") return objectInfo(key,await client.send(new HeadObjectCommand({Bucket:bucket,Key:key}),request));
        if (operation === "download") {
            const response = await client.send(new GetObjectCommand({Bucket:bucket,Key:key}),request);
            if (!response.Body || !(Symbol.asyncIterator in response.Body)) throw new Error("StorageBodyUnavailable");
            let size = 0; const parts: Buffer[] = [];
            for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {size += chunk.length;if(size>MAX_FILE)throw new ConnectorHttpError("Object exceeds the 8 MiB download limit.",413);parts.push(Buffer.from(chunk));}
            return {info:objectInfo(key,response),base64:Buffer.concat(parts,size).toString("base64"),bytes:size} satisfies S3Download;
        }
        if (operation === "upload") {
            const base64 = connectorText(input.base64,"file data",Math.ceil(MAX_FILE/3)*4);
            if (base64.length % 4 || /[^A-Za-z0-9+/=]/.test(base64)) throw new ConnectorHttpError("Upload data must use canonical Base64.",400);
            const bytes = Buffer.from(base64,"base64");if(bytes.length>MAX_FILE||bytes.toString("base64")!==base64)throw new ConnectorHttpError("File data must be canonical Base64 up to 8 MiB.",413);
            const contentType = connectorText(input.contentType ?? "application/octet-stream","content type",200,false);
            if (!/^[\x20-\x7e]+$/.test(contentType)) throw new ConnectorHttpError("Use a printable ASCII content type.",400);
            if (input.overwrite !== true) {
                try {await client.send(new HeadObjectCommand({Bucket:bucket,Key:key}),request);throw new ConnectorHttpError("An object already exists at this key. Enable overwrite explicitly or choose another key.",409);} catch(cause) { if (!(cause && typeof cause === "object" && "$metadata" in cause && (cause as {$metadata?:{httpStatusCode?:number}}).$metadata?.httpStatusCode === 404)) throw cause; }
            }
            const response = await client.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:bytes,ContentLength:bytes.length,ContentType:contentType,ContentMD5:createHash("md5").update(bytes).digest("base64"),...(input.overwrite === true ? {} : {IfNoneMatch:"*"})}),request);
            return {key,bytes:bytes.length,etag:response.ETag ?? "",versionId:response.VersionId ?? "",createdOnly:input.overwrite !== true};
        }
        const response = await client.send(new DeleteObjectCommand({Bucket:bucket,Key:key}),request);
        return {key,deleteMarker:response.DeleteMarker ?? false,versionId:response.VersionId ?? "",deleted:true};
    } catch(cause) {
        if (cause instanceof ConnectorHttpError) throw cause;
        if (controller.signal.aborted) throw new ConnectorHttpError("Storage request exceeded fifteen seconds. A sent upload/delete may already have completed; refresh before retrying.",504);
        const details = cause && typeof cause === "object" ? cause as {name?:unknown;$metadata?:{httpStatusCode?:number}} : {};
        const code = typeof details.name === "string" && /^[A-Za-z0-9_]{1,64}$/.test(details.name) && ![config.accessKeyId,config.secretAccessKey,config.sessionToken].some((secret)=>secret && (details.name as string).includes(secret)) ? details.name : "StorageRequestFailed", status = details.$metadata?.httpStatusCode;
        const explanations: Record<string,string> = {TimeoutError:"The request timed out. A sent upload/delete may already have completed; refresh before retrying.",AccessDenied:"Check bucket permissions and credentials.",InvalidAccessKeyId:"Check the access key ID.",SignatureDoesNotMatch:"Check the signing region, credentials and endpoint.",NoSuchBucket:"The bucket does not exist or is not visible to this account.",NoSuchKey:"The object does not exist.",NotFound:"The object/bucket was not found or is not visible.",PreconditionFailed:"The object now exists. Refresh and choose a new key or explicitly enable overwrite.",NotImplemented:"This server does not implement the requested S3 operation or condition.",PermanentRedirect:"Use the bucket’s correct regional service endpoint.",AuthorizationHeaderMalformed:"Check the signing region and service endpoint."};
        throw new ConnectorHttpError(`${code}${status ? ` (HTTP ${status})` : ""}. ${explanations[code] ?? "Check the endpoint, TLS, signing region and permissions. The service may not support this operation."}`,status === 404 ? 404 : status === 403 ? 403 : status === 412 ? 409 : 502);
    } finally {
        clearTimeout(timeout); client?.destroy(); release?.();
        if (queue) void queue.then(()=>{if(mutationQueues.get(queueKey)===queue)mutationQueues.delete(queueKey);});
    }
}

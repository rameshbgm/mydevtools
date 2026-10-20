import { substitute } from "./variables";
export interface ApiPair { id: string; key: string; value: string; enabled: boolean; description?: string }
export interface ApiAuth { type: "none" | "basic" | "bearer" | "api-key" | "oauth2"; basic?: { username: string; password: string }; bearer?: { token: string; prefix: string }; apiKey?: { key: string; value: string; addTo: "header" | "query" }; oauth2?: { accessToken: string; tokenType: string } }
export type ApiBodyType = "none" | "json" | "xml" | "text" | "form-data" | "x-www-form-urlencoded" | "graphql" | "binary";
export interface ApiRequestSettings { timeout: number; followRedirects: boolean; validateSSL: boolean; maxResponsePreviewBytes: number }
export interface ApiSavedRequest { id: string; name: string; method: string; url: string; headers: ApiPair[]; queryParams: ApiPair[]; body: string; bodyType: ApiBodyType; auth: ApiAuth; settings: ApiRequestSettings; createdAt: string; formData?: ApiPair[]; graphqlQuery?: string; graphqlVariables?: string; bodyIsBase64?: boolean }
export interface CompiledApiRequest { method: string; url: string; headers: Record<string, string>; body?: string; bodyIsBase64: boolean; timeout: number; followRedirects: boolean }
const METHODS = new Set(["GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"]);
const BODY_TYPES = new Set(["none", "json", "xml", "text", "form-data", "x-www-form-urlencoded", "graphql", "binary"]);
function validPairs(value: unknown): value is ApiPair[] { return Array.isArray(value) && value.length <= 100 && value.every((row) => row && typeof row.id === "string" && typeof row.key === "string" && row.key.length <= 1024 && typeof row.value === "string" && row.value.length <= 32 * 1024 && typeof row.enabled === "boolean"); }
export function validSavedRequest(value: unknown): value is ApiSavedRequest {
    if (!value || typeof value !== "object") return false;
    const row = value as ApiSavedRequest;
    return typeof row.id === "string" && !!row.id && row.id.length <= 200 && typeof row.name === "string" && row.name.length <= 200 && METHODS.has(row.method) && typeof row.url === "string" && row.url.length <= 8192 && validPairs(row.headers) && validPairs(row.queryParams) && typeof row.body === "string" && row.body.length <= 2 * 1024 * 1024 && BODY_TYPES.has(row.bodyType) && !!row.auth && ["none", "basic", "bearer", "api-key", "oauth2"].includes(row.auth.type) && !!row.settings && Number.isFinite(row.settings.timeout) && (row.formData === undefined || validPairs(row.formData)) && (row.graphqlQuery === undefined || typeof row.graphqlQuery === "string" && row.graphqlQuery.length <= 1024 * 1024) && (row.graphqlVariables === undefined || typeof row.graphqlVariables === "string" && row.graphqlVariables.length <= 1024 * 1024);
}
export function legacyFormFields(request: ApiSavedRequest): ApiPair[] {
    if (request.formData) return request.formData;
    if (!["form-data", "x-www-form-urlencoded"].includes(request.bodyType) || !request.body) return [];
    return [...new URLSearchParams(request.body)].map(([key, value], index) => ({ id: `legacy-${index}`, key, value, enabled: true }));
}
function base64(value: string): string { let binary = ""; for (const byte of new TextEncoder().encode(value)) binary += String.fromCharCode(byte); return btoa(binary); }
export async function compileSavedRequest(request: ApiSavedRequest, variables: Record<string, string>): Promise<CompiledApiRequest> {
    if (!validSavedRequest(request)) throw new Error("The saved request is invalid or exceeds runner limits. Open and save it again in the request builder.");
    const resolve = (value: string) => { if (typeof value !== "string") throw new Error("A saved authentication field is invalid."); const result = substitute(value, variables); if (result.unresolved.size) throw new Error(`Unresolved variables: ${[...result.unresolved].join(", ")}.`); return result.resolved; };
    const url = new URL(resolve(request.url));
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.hash) throw new Error("Requests need an HTTP(S) URL without embedded credentials or fragments.");
    for (const pair of request.queryParams) if (pair.enabled && pair.key) url.searchParams.append(resolve(pair.key), resolve(pair.value));
    const headers: Record<string, string> = Object.create(null);
    for (const pair of request.headers) if (pair.enabled && pair.key) headers[resolve(pair.key).toLowerCase()] = resolve(pair.value);
    const auth = request.auth;
    if (auth.type === "basic") { if (!auth.basic) throw new Error("Basic authentication settings are missing."); headers.authorization = `Basic ${base64(resolve(auth.basic.username) + ":" + resolve(auth.basic.password))}`; }
    else if (auth.type === "bearer") { if (!auth.bearer) throw new Error("Bearer authentication settings are missing."); headers.authorization = `${resolve(auth.bearer.prefix)} ${resolve(auth.bearer.token)}`; }
    else if (auth.type === "oauth2") { if (!auth.oauth2) throw new Error("OAuth token settings are missing."); headers.authorization = `${resolve(auth.oauth2.tokenType)} ${resolve(auth.oauth2.accessToken)}`; }
    else if (auth.type === "api-key") {
        if (!auth.apiKey || !["header", "query"].includes(auth.apiKey.addTo)) throw new Error("API key settings are missing.");
        if (auth.apiKey.addTo === "query") url.searchParams.append(resolve(auth.apiKey.key), resolve(auth.apiKey.value));
        else headers[resolve(auth.apiKey.key).toLowerCase()] = resolve(auth.apiKey.value);
    }
    let body: string | undefined, bodyIsBase64 = false;
    if (!["GET", "HEAD"].includes(request.method) && request.bodyType !== "none") {
        const defaults: Partial<Record<ApiBodyType, string>> = { json: "application/json", xml: "application/xml", text: "text/plain; charset=utf-8", "x-www-form-urlencoded": "application/x-www-form-urlencoded", graphql: "application/json", binary: "application/octet-stream" };
        if (defaults[request.bodyType] && !headers["content-type"]) headers["content-type"] = defaults[request.bodyType]!;
        if (request.bodyType === "form-data" || request.bodyType === "x-www-form-urlencoded") {
            const fields = legacyFormFields(request).filter((field) => field.enabled && field.key);
            if (request.bodyType === "form-data") {
                const data = new FormData(); fields.forEach((field) => data.append(resolve(field.key), resolve(field.value)));
                const serialized = new Response(data); headers["content-type"] = serialized.headers.get("content-type")!; body = await serialized.text();
            } else body = fields.map((field) => `${encodeURIComponent(resolve(field.key))}=${encodeURIComponent(resolve(field.value))}`).join("&");
        } else if (request.bodyType === "graphql") {
            const source = request.graphqlQuery ?? request.body;
            if (!source.trim()) throw new Error("GraphQL operation is empty. Open and save the request's GraphQL inputs first.");
            const variablesText = resolve(request.graphqlVariables ?? "{}");
            const values = JSON.parse(variablesText || "{}"); if (!values || typeof values !== "object" || Array.isArray(values)) throw new Error("GraphQL variables must be an object.");
            body = `{"query":${JSON.stringify(resolve(source))},"variables":${variablesText.trim() || "{}"}}`;
        } else { body = resolve(request.body); bodyIsBase64 = request.bodyType === "binary" && request.bodyIsBase64 === true; }
    }
    if (bodyIsBase64 && body && (body.length % 4 !== 0 || !/^(?:[a-z\d+/]{4})*(?:[a-z\d+/]{2}==|[a-z\d+/]{3}=)?$/i.test(body))) throw new Error("Binary request body must be padded base64.");
    const bodyBytes = bodyIsBase64 && body ? body.length / 4 * 3 - (body.endsWith("==") ? 2 : body.endsWith("=") ? 1 : 0) : new TextEncoder().encode(body ?? "").length;
    if (bodyBytes > 1024 * 1024) throw new Error("Runner request body exceeds 1 MiB.");
    for (const [key, value] of Object.entries(headers)) if (!/^[!#$%&'*+.^_`|~\w-]+$/.test(key) || /[\r\n\x00]/.test(value)) throw new Error("A resolved header contains invalid characters.");
    if (new TextEncoder().encode(JSON.stringify(headers)).length > 32 * 1024) throw new Error("Resolved request headers exceed 32 KiB.");
    return { method: request.method, url: url.href, headers, ...(body !== undefined ? { body } : {}), bodyIsBase64, timeout: Math.max(100, Math.min(15_000, request.settings.timeout)), followRedirects: request.settings.followRedirects === true };
}

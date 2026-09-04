export interface ManagedProxyRequest {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string | null;
    bodyIsBase64: boolean;
    timeout?: number;
    followRedirects?: boolean;
    sslVerify?: boolean;
    sslCaCert?: string;
    sslClientCert?: string;
    sslClientKey?: string;
}

export const MANAGED_PROXY_METHODS = new Set([
    "GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
    return isRecord(value) && Object.values(value).every((entry) => typeof entry === "string");
}

/** Validate and normalise JSON sent to either managed proxy route. */
export function parseManagedProxyRequest(input: unknown, defaultMethod: string): ManagedProxyRequest | string {
    if (!isRecord(input)) return "Request body must be a JSON object";

    const url = input.url;
    if (typeof url !== "string" || !url.trim()) return "Missing required field: url";

    const methodValue = input.method;
    if (methodValue !== undefined && typeof methodValue !== "string") {
        return "Invalid field: method must be a string";
    }
    const method = (methodValue || defaultMethod).toUpperCase();
    if (!MANAGED_PROXY_METHODS.has(method)) return "Unsupported HTTP method";

    if (input.headers !== undefined && !isStringRecord(input.headers)) {
        return "Invalid field: headers must be an object of strings";
    }
    if (input.body !== undefined && input.body !== null && typeof input.body !== "string") {
        return "Invalid field: body must be a string or null";
    }
    if (input.bodyIsBase64 !== undefined && typeof input.bodyIsBase64 !== "boolean") {
        return "Invalid field: bodyIsBase64 must be a boolean";
    }
    if (input.timeout !== undefined && (typeof input.timeout !== "number" || !Number.isFinite(input.timeout))) {
        return "Invalid field: timeout must be a finite number";
    }
    if (input.followRedirects !== undefined && typeof input.followRedirects !== "boolean") {
        return "Invalid field: followRedirects must be a boolean";
    }
    if (input.sslVerify !== undefined && typeof input.sslVerify !== "boolean") {
        return "Invalid field: sslVerify must be a boolean";
    }
    for (const field of ["sslCaCert", "sslClientCert", "sslClientKey"] as const) {
        if (input[field] !== undefined && typeof input[field] !== "string") {
            return `Invalid field: ${field} must be a string`;
        }
    }

    return {
        url,
        method,
        headers: (input.headers as Record<string, string> | undefined) ?? {},
        body: (input.body as string | null | undefined) ?? null,
        bodyIsBase64: (input.bodyIsBase64 as boolean | undefined) ?? false,
        timeout: input.timeout as number | undefined,
        followRedirects: (input.followRedirects as boolean | undefined) ?? false,
        sslVerify: input.sslVerify as boolean | undefined,
        sslCaCert: input.sslCaCert as string | undefined,
        sslClientCert: input.sslClientCert as string | undefined,
        sslClientKey: input.sslClientKey as string | undefined,
    };
}

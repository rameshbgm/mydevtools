export interface CertificateFetchResponse {
    pems?: string[];
    error?: string;
}

export interface ProxyResponsePayload {
    error?: string;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    bodyIsBase64: boolean;
    size: number;
    timing: number;
}

export async function parseJsonResponse<T>(response: Response, serviceName: string): Promise<T> {
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const body = await response.text();

    let data: T | null = null;
    try {
        if (contentType.includes("application/json")) {
            data = JSON.parse(body) as T;
        }
    } catch {
        throw new Error(`${serviceName} returned invalid JSON (HTTP ${response.status})`);
    }

    if (!response.ok) {
        const error = data && typeof data === "object" && "error" in data
            ? String((data as { error?: unknown }).error ?? "")
            : "";
        throw new Error(error || `${serviceName} returned HTTP ${response.status} (${contentType || "unknown content type"})`);
    }

    if (data === null) {
        throw new Error(
            `${serviceName} returned HTTP ${response.status} instead of JSON (${contentType || "unknown content type"})`
        );
    }

    if (typeof data === "object" && data !== null && "error" in data) {
        const error = (data as { error?: unknown }).error;
        if (error) throw new Error(String(error));
    }

    return data;
}

/** Parse the certificate route response without assuming the server returned JSON. */
export function parseCertificateFetchResponse(response: Response): Promise<CertificateFetchResponse> {
    return parseJsonResponse<CertificateFetchResponse>(response, "Certificate service");
}

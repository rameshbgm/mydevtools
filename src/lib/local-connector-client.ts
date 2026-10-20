let accessKey = "";
export function setConnectorAccessKey(value: string) { accessKey = value; }
export function clearConnectorAccessKey() { accessKey = ""; }
export async function connectorRequest<T>(input?: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
    const response = await fetch("/api/local-connectors", {
        method: input ? "POST" : "GET",
        headers: { ...(input ? { "Content-Type": "application/json" } : {}), ...(accessKey ? { "X-MyDevtools-Local-Token": accessKey } : {}) },
        body: input ? JSON.stringify(input) : undefined,
        credentials: "same-origin", cache: "no-store", signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(20_000)]) : AbortSignal.timeout(20_000),
    });
    const value = await response.json();
    if (!response.ok) throw new Error(typeof value.error === "string" ? value.error : `Connector returned HTTP ${response.status}.`);
    return value as T;
}

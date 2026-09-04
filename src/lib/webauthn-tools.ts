export type PasskeyInspection = { credentialId: string; clientData?: Record<string, unknown>; authenticatorDataBytes?: number; issues: string[] };

function decodeBase64Url(value: string): Uint8Array {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
    const text = atob(normalized);
    return Uint8Array.from(text, (character) => character.charCodeAt(0));
}

export function inspectPasskeyCredential(value: unknown): PasskeyInspection {
    const credential = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;
    const response = (typeof credential.response === "object" && credential.response !== null ? credential.response : {}) as Record<string, unknown>;
    const issues: string[] = [];
    const credentialId = typeof credential.id === "string" ? credential.id : "";
    if (!credentialId) issues.push("Credential id is missing.");
    let clientData: Record<string, unknown> | undefined;
    if (typeof response.clientDataJSON === "string") {
        try { clientData = JSON.parse(new TextDecoder().decode(decodeBase64Url(response.clientDataJSON))) as Record<string, unknown>; }
        catch { issues.push("clientDataJSON is not valid base64url-encoded JSON."); }
    } else issues.push("clientDataJSON is missing.");
    let authenticatorDataBytes: number | undefined;
    if (typeof response.authenticatorData === "string") {
        try { authenticatorDataBytes = decodeBase64Url(response.authenticatorData).length; }
        catch { issues.push("authenticatorData is not valid base64url."); }
    }
    return { credentialId, clientData, authenticatorDataBytes, issues };
}

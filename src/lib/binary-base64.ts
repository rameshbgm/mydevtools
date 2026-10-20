import { bytesToBase64, base64ToBytes } from "./vault-records";
export const MAX_BINARY_BYTES = 8 * 1024 * 1024;
export function encodeBinaryBase64(bytes: Uint8Array, mime: string, dataUri: boolean): string {
    if (bytes.length > MAX_BINARY_BYTES) throw new Error("Binary file limit is 8 MiB.");
    if (!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i.test(mime)) throw new Error("Enter a MIME type such as image/png or application/octet-stream.");
    return (dataUri ? `data:${mime};base64,` : "") + bytesToBase64(bytes);
}
export function decodeBinaryBase64(input: string): { bytes: Uint8Array<ArrayBuffer>; mime: string } {
    let value = input.trim(), mime = "application/octet-stream";
    if (value.startsWith("data:")) {
        const comma = value.indexOf(",");
        const header = value.slice(5, comma);
        if (comma < 0 || !/;base64$/i.test(header)) throw new Error("The Data URI must use Base64 encoding.");
        mime = header.split(";")[0] || "text/plain";
        if (!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i.test(mime)) throw new Error("The Data URI has an invalid MIME type.");
        value = value.slice(comma + 1);
    }
    value = value.replace(/\s/g, "");
    if (value.length > Math.ceil(MAX_BINARY_BYTES / 3) * 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4 === 1 || (value.includes("=") && value.length % 4 !== 0)) throw new Error("Enter valid Base64 for a file of up to 8 MiB.");
    const bytes = base64ToBytes(value);
    if (bytes.length > MAX_BINARY_BYTES || bytesToBase64(bytes).replace(/=+$/, "") !== value.replace(/=+$/, "")) throw new Error("Invalid or noncanonical Base64 padding bits.");
    return { bytes, mime };
}

import { pngChunks } from "./image-metadata";
/** PNG-compressed ICO entries target modern icon decoders (Windows Vista+). */
export function packIco(images: { size: number; bytes: Uint8Array }[]): Uint8Array {
    if (!images.length || images.length > 10 || new Set(images.map((image) => image.size)).size !== images.length) throw new Error("Use 1–10 unique icon sizes.");
    const ordered = [...images].sort((left, right) => left.size - right.size);
    for (const image of ordered) {
        if (!Number.isInteger(image.size) || image.size < 1 || image.size > 256 || image.bytes.length > 2 * 1024 * 1024) throw new Error("ICO PNG entries must be 1–256 pixels and up to 2 MiB each.");
        const header = pngChunks(image.bytes)[0].data, view = new DataView(header.buffer, header.byteOffset, header.byteLength);
        if (view.getUint32(0) !== image.size || view.getUint32(4) !== image.size) throw new Error("ICO entry dimensions must match its square PNG image.");
    }
    const headerSize = 6 + ordered.length * 16, size = headerSize + ordered.reduce((total, image) => total + image.bytes.length, 0);
    if (size > 8 * 1024 * 1024) throw new Error("ICO output exceeds 8 MiB.");
    const output = new Uint8Array(size), view = new DataView(output.buffer); view.setUint16(2, 1, true); view.setUint16(4, ordered.length, true); let offset = headerSize;
    ordered.forEach((image, index) => { const entry = 6 + index * 16; output[entry] = image.size === 256 ? 0 : image.size; output[entry + 1] = output[entry]; view.setUint16(entry + 4, 1, true); view.setUint16(entry + 6, 32, true); view.setUint32(entry + 8, image.bytes.length, true); view.setUint32(entry + 12, offset, true); output.set(image.bytes, offset); offset += image.bytes.length; });
    return output;
}
/** Fit every corner inside the manifest maskable safe-zone circle (radius 40%). */
export function maskableImageRect(width: number, height: number, size = 512) {
    if (![width, height, size].every((value) => Number.isFinite(value) && value > 0) || size > 4096) throw new Error("Enter positive image dimensions and an icon size up to 4096.");
    const scale = size * 0.8 / Math.hypot(width, height), drawWidth = width * scale, drawHeight = height * scale;
    return { x: (size - drawWidth) / 2, y: (size - drawHeight) / 2, width: drawWidth, height: drawHeight };
}

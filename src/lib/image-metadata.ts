export type ImageKind = "jpeg" | "png" | "webp" | "tiff" | "avif" | "heic" | "gif" | "bmp";
const signature = (bytes: Uint8Array, offset: number, text: string) => text.split("").every((character, index) => bytes[offset + index] === character.charCodeAt(0));
export function imageKind(bytes: Uint8Array): ImageKind {
    if (bytes.length > 16 * 1024 * 1024) throw new Error("Image file limit is 16 MiB.");
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
    if ([137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) return "png";
    if (signature(bytes, 0, "RIFF") && signature(bytes, 8, "WEBP")) return "webp";
    if (signature(bytes, 0, "II*\0") || signature(bytes, 0, "MM\0*")) return "tiff";
    if (signature(bytes, 0, "GIF87a") || signature(bytes, 0, "GIF89a")) return "gif";
    if (signature(bytes, 0, "BM")) return "bmp";
    if (bytes.length >= 16 && signature(bytes, 4, "ftyp")) { const brands = new TextDecoder("latin1").decode(bytes.subarray(8, Math.min(bytes.length, new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(0), 256))); if (/avif|avis/.test(brands)) return "avif"; if (/heic|heix|hevc|hevx|mif1|msf1/.test(brands)) return "heic"; }
    throw new Error("Unsupported image header. Choose JPEG, PNG, WebP, TIFF, HEIC/AVIF, GIF or BMP.");
}
const CRC_TABLE = Array.from({ length: 256 }, (_, value) => { let code = value; for (let index = 0; index < 8; index++) code = code & 1 ? 0xedb88320 ^ (code >>> 1) : code >>> 1; return code >>> 0; });
export function imageCrc32(bytes: Uint8Array): number { let value = 0xffffffff; for (const byte of bytes) value = CRC_TABLE[(value ^ byte) & 255] ^ (value >>> 8); return (value ^ 0xffffffff) >>> 0; }
export interface ImageChunk { type: string; start: number; end: number; data: Uint8Array }
export function pngChunks(bytes: Uint8Array): ImageChunk[] {
    if (imageKind(bytes) !== "png") throw new Error("Not a PNG file.");
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), chunks: ImageChunk[] = []; let offset = 8, hasImage = false;
    while (offset + 12 <= bytes.length && chunks.length < 10_000) {
        const length = view.getUint32(offset), end = offset + 12 + length, type = new TextDecoder("ascii").decode(bytes.subarray(offset + 4, offset + 8));
        if (end > bytes.length || !/^[A-Za-z]{4}$/.test(type) || imageCrc32(bytes.subarray(offset + 4, end - 4)) !== view.getUint32(end - 4)) throw new Error("PNG contains a damaged chunk or CRC.");
        if (!chunks.length && (type !== "IHDR" || length !== 13)) throw new Error("PNG must begin with a valid IHDR chunk.");
        chunks.push({ type, start: offset, end, data: bytes.subarray(offset + 8, end - 4) }); if (type === "IDAT") hasImage = true;
        if (type === "IEND") { if (length || !hasImage) throw new Error("PNG has an invalid image/end structure."); return chunks; } offset = end;
    }
    throw new Error("PNG is truncated or has too many chunks.");
}
export function webpChunks(bytes: Uint8Array): ImageChunk[] {
    if (imageKind(bytes) !== "webp" || bytes.length < 20) throw new Error("Not a complete WebP file.");
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), limit = view.getUint32(4, true) + 8, chunks: ImageChunk[] = []; let offset = 12;
    if (limit > bytes.length || limit < 20) throw new Error("WebP has an invalid RIFF size.");
    while (offset + 8 <= limit && chunks.length < 10_000) { const length = view.getUint32(offset + 4, true), end = offset + 8 + length + (length % 2); if (end > limit) throw new Error("WebP has a damaged chunk length."); chunks.push({ type: new TextDecoder("ascii").decode(bytes.subarray(offset, offset + 4)), start: offset, end, data: bytes.subarray(offset + 8, offset + 8 + length) }); offset = end; }
    if (offset !== limit || !chunks.some((chunk) => ["VP8 ", "VP8L", "ANMF"].includes(chunk.type))) throw new Error("WebP is truncated or missing image data."); return chunks;
}
function joinBytes(parts: Uint8Array[]): Uint8Array { const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0)); let offset = 0; for (const part of parts) { output.set(part, offset); offset += part.length; } return output; }
export interface MetadataRemoval { bytes: Uint8Array; kind: "jpeg" | "png" | "webp"; removed: Record<string, number>; warnings: string[] }
export function stripImageMetadata(bytes: Uint8Array): MetadataRemoval {
    const kind = imageKind(bytes), removed: Record<string, number> = {}, warnings = ["Encoded image/frame data is retained. ICC/color information is kept; this is not a guarantee of anonymity."];
    const drop = (name: string) => { removed[name] = (removed[name] ?? 0) + 1; };
    if (kind === "png") {
        const chunks = pngChunks(bytes), keep = new Set(["IHDR", "PLTE", "IDAT", "IEND", "tRNS", "cHRM", "gAMA", "iCCP", "sBIT", "sRGB", "pHYs", "cICP", "mDCV", "cLLI", "acTL", "fcTL", "fdAT"]), output = [bytes.subarray(0, 8)];
        for (const chunk of chunks) { if (keep.has(chunk.type)) output.push(bytes.subarray(chunk.start, chunk.end)); else if (chunk.type[0] === chunk.type[0].toLowerCase()) drop(chunk.type); else throw new Error(`Unsupported critical PNG chunk: ${chunk.type}.`); }
        if (chunks.at(-1)!.end < bytes.length) drop("trailing data");
        if (removed.eXIf) warnings.push("EXIF orientation is removed. If the image relies on that tag, use canvas conversion to bake its displayed orientation.");
        return { bytes: joinBytes(output), kind, removed, warnings };
    }
    if (kind === "webp") {
        const chunks = webpChunks(bytes), keep = new Set(["VP8 ", "VP8L", "VP8X", "ALPH", "ANIM", "ANMF", "ICCP"]), output = [bytes.slice(0, 12)];
        for (const chunk of chunks) { if (!keep.has(chunk.type)) { drop(chunk.type.trim()); continue; } const part = bytes.slice(chunk.start, chunk.end); if (chunk.type === "VP8X") { if (chunk.data.length !== 10) throw new Error("Invalid extended WebP header."); part[8] &= ~(0x08 | 0x04); } output.push(part); }
        const clean = joinBytes(output); new DataView(clean.buffer).setUint32(4, clean.length - 8, true);
        if (chunks.at(-1)!.end < bytes.length) drop("trailing data");
        if (removed.EXIF) warnings.push("EXIF orientation is removed. Canvas conversion can bake the displayed orientation but re-encodes frames.");
        return { bytes: clean, kind, removed, warnings };
    }
    if (kind !== "jpeg") throw new Error("Removal without re-encoding supports JPEG, PNG and WebP. Use canvas conversion for other browser-decodable formats.");
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), output = [bytes.subarray(0, 2)]; let offset = 2, count = 0, hasScan = false;
    while (offset < bytes.length && count++ < 20_000) {
        const start = offset; if (bytes[offset] !== 0xff) throw new Error("Invalid JPEG marker structure."); while (bytes[offset] === 0xff) offset++; const marker = bytes[offset++];
        if (marker === 0xd9) { if (!hasScan) throw new Error("JPEG is missing image scan data."); output.push(bytes.subarray(start, offset)); if (offset < bytes.length) drop("trailing data"); warnings.push("EXIF orientation and embedded thumbnails are removed. Orientation may change; canvas conversion can bake it in."); return { bytes: joinBytes(output), kind, removed, warnings }; }
        if (marker === 0x01 || marker >= 0xd0 && marker <= 0xd7) { output.push(bytes.subarray(start, offset)); continue; }
        if (marker === 0x00 || marker === 0xd8 || offset + 2 > bytes.length) throw new Error("Invalid or truncated JPEG marker.");
        const length = view.getUint16(offset), end = offset + length, data = offset + 2;
        if (length < 2 || end > bytes.length) throw new Error("Invalid JPEG segment length.");
        if (marker === 0xda) {
            hasScan = true; let cursor = end;
            while (cursor < bytes.length) { if (bytes[cursor] !== 0xff) { cursor++; continue; } const candidate = cursor; while (bytes[cursor] === 0xff) cursor++; const next = bytes[cursor]; if (next === 0x00 || next >= 0xd0 && next <= 0xd7) { cursor++; continue; } cursor = candidate; break; }
            if (cursor >= bytes.length) throw new Error("JPEG is missing its end marker."); output.push(bytes.subarray(start, cursor)); offset = cursor; continue;
        }
        const application = marker >= 0xe0 && marker <= 0xef;
        if (marker === 0xe0 && signature(bytes, data, "JFIF\0") && length >= 16) {
            const header = bytes.slice(start, data + 14); new DataView(header.buffer).setUint16(offset - start, 16); header[header.length - 2] = 0; header[header.length - 1] = 0; output.push(header); if (end > data + 14) drop("JFIF thumbnail");
        } else if (marker === 0xe2 && signature(bytes, data, "ICC_PROFILE\0") || marker === 0xee && signature(bytes, data, "Adobe")) output.push(bytes.subarray(start, end));
        else if (application || marker === 0xfe) drop(marker === 0xfe ? "JPEG comment" : `APP${marker - 0xe0}`);
        else output.push(bytes.subarray(start, end));
        offset = end;
    }
    throw new Error("JPEG is truncated or has too many segments.");
}

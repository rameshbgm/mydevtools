import { parse } from "exifr";
import { imageKind, pngChunks, webpChunks } from "./image-metadata";
export async function inspectImageMetadata(bytes: Uint8Array) {
    const kind = imageKind(bytes), containers: { type: string; bytes: number }[] = [];
    let payload = bytes;
    if (kind === "png") containers.push(...pngChunks(bytes).map((chunk) => ({ type: chunk.type, bytes: chunk.data.length })));
    if (kind === "webp") {
        const chunks = webpChunks(bytes); containers.push(...chunks.map((chunk) => ({ type: chunk.type, bytes: chunk.data.length })));
        const exif = chunks.find((chunk) => chunk.type === "EXIF");
        if (!exif) return { kind, containers, metadata: {}, note: "No WebP EXIF chunk was present. XMP/ICC/other container chunks are listed by type and size; their contents are not decoded here." };
        payload = new TextDecoder("ascii").decode(exif.data.subarray(0, 6)) === "Exif\0\0" ? exif.data.subarray(6) : exif.data;
    }
    if (["gif", "bmp"].includes(kind)) return { kind, containers, metadata: {}, note: "This format has no EXIF parser here. Browser canvas conversion can create a PNG/JPEG/WebP snapshot without copying source metadata." };
    const metadata = await parse(payload, { tiff: true, exif: true, gps: true, xmp: true, iptc: true, icc: false, jfif: true, ihdr: true, ifd1: false, mergeOutput: false, sanitize: true });
    let nodes = 0;
    const encoded = JSON.stringify(metadata ?? {}, (_key, value: unknown) => {
        if (++nodes > 50_000) throw new Error("Image metadata has too many fields.");
        if (ArrayBuffer.isView(value)) { const data = new Uint8Array(value.buffer, value.byteOffset, value.byteLength); return { type: "binary", bytes: data.length, previewHex: Array.from(data.subarray(0, 128)).map((byte) => byte.toString(16).padStart(2, "0")).join("") }; }
        if (typeof value === "number" && !Number.isFinite(value)) return String(value);
        if (typeof value === "bigint") return value.toString();
        return value;
    });
    if (encoded.length > 2 * 1024 * 1024) throw new Error("Decoded metadata exceeds 2 MiB.");
    return { kind, containers, metadata: JSON.parse(encoded) as Record<string, unknown>, note: "Common EXIF/GPS, TIFF, XMP and IPTC fields are decoded where supported. ICC profiles and embedded thumbnails are not decoded; proprietary maker tags and some compressed/container metadata may be incomplete." };
}

import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { imageKind, imageCrc32, pngChunks, webpChunks, stripImageMetadata } from "../src/lib/image-metadata";
import { inspectImageMetadata } from "../src/lib/image-inspection";
const root = resolve("scripts/fixtures/images");
const file = async (name: string) => new Uint8Array(await readFile(join(root, name)));
async function main() {
    assert.equal(imageCrc32(new TextEncoder().encode("123456789")), 0xcbf43926);
    const temporary = await mkdtemp(join(tmpdir(), "mydevtools-image-strip-"));
    try {
        for (const name of ["metadata.jpg", "metadata-cmyk.jpg", "metadata.png", "metadata.webp", "animated.webp", "metadata.tiff", "metadata.avif"]) {
            const source = await file(name), inspected = await inspectImageMetadata(source); assert.ok(JSON.stringify(inspected.metadata).includes("PUBLIC-FIXTURE-CAMERA"), name + " metadata");
            if (["tiff", "avif"].includes(inspected.kind)) { assert.throws(() => stripImageMetadata(source), /without re-encoding/); continue; }
            const clean = stripImageMetadata(source); assert.ok(clean.bytes.length < source.length); assert.ok(!new TextDecoder().decode(clean.bytes).includes("PUBLIC-FIXTURE"));
            assert.ok(!JSON.stringify((await inspectImageMetadata(clean.bytes)).metadata).includes("Public fixture artist"));
            await writeFile(join(temporary, name), clean.bytes);
            if (inspected.kind === "png") { const before = pngChunks(source).filter((chunk) => chunk.type === "IDAT").map((chunk) => [...chunk.data]); const after = pngChunks(clean.bytes).filter((chunk) => chunk.type === "IDAT").map((chunk) => [...chunk.data]); assert.deepEqual(after, before); assert.ok(pngChunks(clean.bytes).some((chunk) => chunk.type === "iCCP")); }
            if (inspected.kind === "webp") { const essential = ["VP8 ", "VP8L", "ANIM", "ANMF", "ICCP"]; assert.deepEqual(webpChunks(clean.bytes).filter((chunk) => essential.includes(chunk.type)).map((chunk) => [chunk.type, [...chunk.data]]), webpChunks(source).filter((chunk) => essential.includes(chunk.type)).map((chunk) => [chunk.type, [...chunk.data]])); assert.equal(webpChunks(clean.bytes).find((chunk) => chunk.type === "VP8X")!.data[0] & 0x0c, 0); }
        }
        // Metadata can occur after a progressive JPEG's final entropy scan.
        const jpeg = await file("metadata.jpg"), message = new TextEncoder().encode("PUBLIC-LATE-COMMENT"), comment = new Uint8Array(message.length + 4); comment.set([0xff, 0xfe, 0, message.length + 2]); comment.set(message, 4);
        const withComment = new Uint8Array(jpeg.length + comment.length); withComment.set(jpeg.subarray(0, -2)); withComment.set(comment, jpeg.length - 2); withComment.set(jpeg.subarray(-2), jpeg.length - 2 + comment.length);
        const late = stripImageMetadata(withComment); assert.equal(late.removed["JPEG comment"], 1); assert.ok(!new TextDecoder().decode(late.bytes).includes("PUBLIC-LATE-COMMENT"));
        const badPng = (await file("metadata.png")).slice(); badPng[badPng.length - 1] ^= 1; assert.throws(() => stripImageMetadata(badPng), /CRC/);
        assert.throws(() => stripImageMetadata(jpeg.subarray(0, jpeg.length - 5)), /JPEG/);
        assert.throws(() => imageKind(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"/>')), /Unsupported image/);
        if (process.env.EXPANSION_IMAGE_CODEC === "true") {
            const report = execFileSync("python3", ["-c", `from PIL import Image
from pathlib import Path
import sys
for name in ['metadata.jpg','metadata-cmyk.jpg','metadata.png','metadata.webp','animated.webp']:
    before = Image.open(Path(sys.argv[1]) / name)
    after = Image.open(Path(sys.argv[2]) / name)
    assert before.size == after.size, name
    assert getattr(before, 'n_frames', 1) == getattr(after, 'n_frames', 1), name
    for frame in range(getattr(before, 'n_frames', 1)):
        before.seek(frame); after.seek(frame)
        assert before.convert('RGBA').tobytes() == after.convert('RGBA').tobytes(), (name, frame)
print('Pillow independently decoded identical image pixels and every animation frame after stripping, including progressive and CMYK JPEG.')`, root, temporary], { encoding: "utf8" }); console.log(report.trim());
        }
        console.log("JPEG/PNG/WebP/TIFF/AVIF EXIF parsing, known metadata removal, compressed pixel/frame preservation, color-profile retention, late JPEG comments and damaged-input fixtures passed.");
    } finally { await rm(temporary, { recursive: true, force: true }); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

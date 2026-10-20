import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { packIco, maskableImageRect } from "../src/lib/favicon-exports";
async function main() {
    const images = await Promise.all([256, 16, 32].map(async (size) => ({ size, bytes: new Uint8Array(await readFile(`scripts/fixtures/images/icon-${size}.png`)) })));
    const ico = packIco(images), view = new DataView(ico.buffer);
    assert.equal(view.getUint16(0, true), 0); assert.equal(view.getUint16(2, true), 1); assert.equal(view.getUint16(4, true), 3);
    let offset = 6 + 3 * 16;
    for (const [index, size] of [16, 32, 256].entries()) { const entry = 6 + index * 16, source = images.find((image) => image.size === size)!; assert.equal(ico[entry] || 256, size); assert.equal(ico[entry + 1] || 256, size); assert.equal(view.getUint16(entry + 4, true), 1); assert.equal(view.getUint32(entry + 8, true), source.bytes.length); assert.equal(view.getUint32(entry + 12, true), offset); assert.deepEqual(ico.subarray(offset, offset + source.bytes.length), source.bytes); offset += source.bytes.length; }
    assert.equal(offset, ico.length); assert.throws(() => packIco([images[0], images[0]])); assert.throws(() => packIco([{ size: 64, bytes: images[0].bytes }]));
    for (const [width, height] of [[512, 512], [1024, 256], [256, 1024], [1, 5000]]) { const rectangle = maskableImageRect(width, height); assert.ok(Math.abs(rectangle.width / rectangle.height - width / height) < 1e-10); for (const x of [rectangle.x, rectangle.x + rectangle.width]) for (const y of [rectangle.y, rectangle.y + rectangle.height]) assert.ok(Math.hypot(x - 256, y - 256) <= 204.8 + 1e-9); }
    assert.throws(() => maskableImageRect(0, 10));
    if (process.env.EXPANSION_IMAGE_CODEC === "true") { const directory = await mkdtemp(join(tmpdir(), "mydevtools-ico-")); try { const file = join(directory, "favicon.ico"); await writeFile(file, ico); const result = execFileSync("python3", ["-c", "from PIL import Image; import sys; image=Image.open(sys.argv[1]); assert image.format=='ICO'; assert image.ico.sizes()=={(16,16),(32,32),(256,256)}; [image.ico.getimage(size).load() for size in image.ico.sizes()]; print('Pillow independently decoded all three ICO entries.')", file], { encoding: "utf8" }); console.log(result.trim()); } finally { await rm(directory, { recursive: true, force: true }); } }
    console.log("ICO directory/offset/dimension/PNG preservation and maskable artwork safe-zone/centering/aspect fixtures passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

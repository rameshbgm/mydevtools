import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = dirname(fileURLToPath(import.meta.resolve("onnxruntime-web/webgpu")));
const target = join(root, "public/onnx");
const notices = join(root, "third-party/onnxruntime");
const source = JSON.parse(await readFile(join(notices, "source.json"), "utf8"));
const commit = (await readFile(join(dist, "../__commit.txt"), "utf8")).trim();
if (commit !== source.commit) throw new Error("Update ONNX Runtime notices for the installed package revision before copying assets.");
// The Transformers WebGPU backend uses asyncify; older Safari falls back to
// the plain WASM build. Both factories must match the locked runtime package.
const names = ["ort-wasm-simd-threaded", "ort-wasm-simd-threaded.asyncify"];
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
for (const name of names) for (const extension of ["mjs", "wasm"]) {
    await copyFile(join(dist, `${name}.${extension}`), join(target, `${name}.${extension}`));
}
await copyFile(join(notices, "LICENSE"), join(target, "LICENSE.txt"));
await copyFile(join(notices, "ThirdPartyNotices.txt"), join(target, "ThirdPartyNotices.txt"));
const { version } = JSON.parse(await readFile(join(dist, "../package.json"), "utf8"));
await writeFile(join(target, "version.json"), JSON.stringify({ package: "onnxruntime-web", version, ...source }) + "\n");
console.log(`Copied local ONNX Runtime ${version} factories, WASM and license.`);

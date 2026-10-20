import assert from "node:assert/strict";
import { fork } from "node:child_process";
import { resolve } from "node:path";
const child = fork(resolve("desktop/backend.cjs"), [resolve(".desktop/runtime")], { stdio: ["ignore", "ignore", "pipe", "ipc"], env: { ...process.env, MYDEVTOOLS_LOCAL_CONNECTORS: "true", MYDEVTOOLS_LOCAL_CONNECTOR_TOKEN: "public-desktop-runtime-fixture-key-0000000000", MYDEVTOOLS_DESKTOP: "true", NODE_ENV: "production" } });
let diagnostics = "";
child.stderr.on("data", (chunk) => { diagnostics = (diagnostics + chunk.toString()).slice(-4096); });
try {
    const port = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Runtime startup timed out. " + diagnostics)), 30000);
        child.once("exit", (code) => { clearTimeout(timer); reject(new Error("Runtime exited " + code + ". " + diagnostics)); });
        child.on("message", (message) => { if (message.ready) { clearTimeout(timer); resolve(message.port); } else if (message.error) { clearTimeout(timer); reject(new Error(message.error + " " + diagnostics)); } });
    });
    const origin = "http://127.0.0.1:" + port;
    assert.equal((await fetch(origin + "/api-and-web-services/api-request-builder")).status, 200);
    assert.equal((await fetch(origin + "/api/local-connectors")).status, 401);
    const available = await fetch(origin + "/api/local-connectors", { headers: { Origin: origin, "X-MyDevtools-Local-Token": "public-desktop-runtime-fixture-key-0000000000" } });
    assert.equal(available.status, 200); assert.ok((await available.json()).services.includes("grpc"));
    for (const path of ["/icons/icon-192.png", "/sqlite/sql-wasm.wasm", "/monaco/vs/loader.js", "/onnx/ort-wasm-simd-threaded.asyncify.mjs", "/onnx/ort-wasm-simd-threaded.asyncify.wasm", "/onnx/ort-wasm-simd-threaded.wasm"]) {
        const response = await fetch(origin + path);
        assert.equal(response.status, 200, path);
        if (path.endsWith(".wasm")) assert.match(response.headers.get("content-type"), /application\/wasm/, path);
        await response.body.cancel();
    }
    console.log("Bundled integrated Next runtime: ephemeral loopback port, canonical app route, authenticated native services, local icons, SQLite/ONNX WASM and Monaco assets pass.");
} finally {
    child.kill("SIGTERM");
    await new Promise((resolve) => { if (child.exitCode !== null) resolve(); else { const timer = setTimeout(() => { child.kill("SIGKILL"); resolve(); }, 3000); child.once("exit", () => { clearTimeout(timer); resolve(); }); } });
}

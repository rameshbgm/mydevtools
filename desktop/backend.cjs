// Start the same integrated Next server as the generated standalone launcher.
// Unlike a custom HTTP server, this preserves Next's router/upgrade handling.
// The pinned Next build is staged with its traced dependencies and config.
require("./privacy.cjs")();
const { createRequire } = require("node:module");
const { join, resolve } = require("node:path");
const { readFileSync } = require("node:fs");
const runtime = resolve(process.argv[2]);
const runtimeRequire = createRequire(join(runtime, "server.js"));
/** @param {{ready?: boolean, port?: number, error?: string}} message */
const send = (message) => process.parentPort ? process.parentPort.postMessage(message) : process.send?.(message);
process.env.NODE_ENV = "production";
process.env.NEXT_TELEMETRY_DISABLED = "1";
process.chdir(runtime);
const config = JSON.parse(readFileSync(join(runtime, "desktop-runtime-config.json"), "utf8"));
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config);
runtimeRequire("next");
runtimeRequire("next/dist/server/lib/start-server").startServer({ dir: runtime, isDev: false, hostname: "127.0.0.1", port: 0, allowRetry: false }).then(() => {
    const port = Number(process.env.PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid runtime port.");
    send({ ready: true, port });
}).catch(() => { send({ error: "The bundled local runtime could not start." }); process.exit(1); });

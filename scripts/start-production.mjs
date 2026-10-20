import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
// Standalone output omits public/static files by design; stage them for npm start.
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
    if (args[i] === "--port" || args[i] === "-p") process.env.PORT = args[++i];
    else if (args[i] === "--hostname" || args[i] === "-H") process.env.HOSTNAME = args[++i];
    else throw new Error(`Unknown start option: ${args[i]}`);
}
const server = resolve(".next/standalone/server.js");
if (!existsSync(server)) throw new Error("Production output is missing. Run npm run build first.");
mkdirSync(".next/standalone/.next", { recursive: true });
cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
cpSync("public", ".next/standalone/public", { recursive: true });
await import(pathToFileURL(server).href);

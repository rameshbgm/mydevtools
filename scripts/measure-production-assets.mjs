import { readFileSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
const html = readFileSync(".next/server/app/index.html", "utf8");
const urls = [...new Set([...html.matchAll(/src="(\/_next\/static\/[^"?]+\.js)/g)].map((match) => match[1]))];
const chunks = urls.map((url) => {
    const data = readFileSync(".next/" + url.slice("/_next/".length));
    return { url, bytes: data.length, gzipBytes: gzipSync(data).length };
});
const result = { htmlBytes: Buffer.byteLength(html), initialJsBytes: chunks.reduce((total, chunk) => total + chunk.bytes, 0), gzipJsBytes: chunks.reduce((total, chunk) => total + chunk.gzipBytes, 0), chunks };
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({ ...result, chunks: chunks.length }, null, 2));

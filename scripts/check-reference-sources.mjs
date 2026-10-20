import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const sources = JSON.parse(await readFile(new URL("../src/lib/reference-sources.json", import.meta.url), "utf8"));
const { version } = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const report = [];
for (const source of sources) {
    const reviewDue = Date.now() - Date.parse(source.verifiedAt) >= source.reviewDays * 86400000;
    try {
        const response = await fetch(source.url, { signal: AbortSignal.timeout(25000), headers: { "User-Agent": `mydevtools-reference-review/${version}` } });
        const content = await response.text();
        report.push({ id: source.id, url: source.url, status: response.status, reviewDue, lastReviewed: source.verifiedAt, sha256: createHash("sha256").update(content).digest("hex"), etag: response.headers.get("etag"), lastModified: response.headers.get("last-modified"), action: response.ok ? "Compare with the previous report; review content and fixtures before updating the date or dataset." : "Investigate source availability; do not update verifiedAt." });
    } catch (error) { report.push({ id: source.id, url: source.url, reviewDue, error: error.message }); }
}
const output = { checkedAt: new Date().toISOString(), policy: "Read-only monitoring; no automatic edits to prices, protocol versions, claims or verification dates.", sources: report };
await writeFile(process.argv[2] || "reference-source-report.json", JSON.stringify(output, null, 2) + "\n");
console.log(`${report.length} sources checked; ${report.filter((row) => row.reviewDue).length} due for review; ${report.filter((row) => row.error || row.status >= 400).length} unavailable.`);
if (report.some((row) => row.error || row.status >= 400)) process.exitCode = 1;

import assert from "node:assert/strict";
import { SITE_URL } from "../src/lib/seo-content";
import { toolsRegistry } from "../src/lib/tools-registry";
import { toolPath } from "../src/lib/category-routes";
import { APP_VERSION } from "../src/lib/app-version";
const origin = process.env.MYDEVTOOLS_TEST_BASE_URL || "http://127.0.0.1:3100";
const get = async (path: string) => {
    const response = await fetch(`${origin}${path}`, { redirect: "manual", signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, path);
    return response;
};
async function main() {
    for (const path of ["/llms.txt", "/llms-full.txt", "/tool-catalog.md", "/guides.md", "/release-notes.md"]) {
        const response = await get(path), text = await response.text();
        assert.match(response.headers.get("content-type")!, /^text\/(plain|markdown); charset=utf-8$/);
        assert.equal(response.headers.get("x-content-type-options"), "nosniff");
        assert.ok(text.startsWith("# ") && !text.includes("<!DOCTYPE html>"), path);
    }
    const manifest = await (await get("/agents.json")).json();
    assert.equal(manifest.version, APP_VERSION); assert.equal(manifest.executionApi, null);
    assert.equal(manifest.tools.length, toolsRegistry.length);
    for (const tool of toolsRegistry) assert.ok(manifest.tools.some((row: { id: string; url: string }) => row.id === tool.id && row.url === `${SITE_URL}${toolPath(tool)}`));
    const xml = await (await get("/sitemap.xml")).text();
    const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    assert.equal(new Set(locations).size, toolsRegistry.length + 3);
    assert.ok(locations.includes(`${SITE_URL}/release-notes`));
    const html = await (await get("/")).text();
    const data = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    assert.equal(data.find((item) => item["@type"] === "SoftwareApplication")?.softwareVersion, APP_VERSION);
    assert.equal(data.find((item) => item["@type"] === "CollectionPage")?.mainEntity?.numberOfItems, toolsRegistry.length);
    assert.ok(!data.some((item) => item["@type"] === "FAQPage"), "homepage must not claim a hidden FAQ");
    const paths = ["/guides", "/release-notes", ...toolsRegistry.map(toolPath)];
    for (let start = 0; start < paths.length; start += 8) await Promise.all(paths.slice(start, start + 8).map(async (path) => {
        const page = await (await get(path)).text();
        const canonicalTag = (page.match(/<link\b[^>]*>/g) ?? []).find((tag) => tag.includes('rel="canonical"'));
        assert.ok(canonicalTag?.includes(`href="${SITE_URL}${path}"`), path);
        assert.ok(/<title>[^<]+<\/title>/.test(page), `server-rendered title ${path}`);
        assert.ok(/<meta[^>]*name="description"[^>]*content="[^"]+"/.test(page), `server-rendered description ${path}`);
    }));
    assert.match(await (await get("/memory")).text(), /name="robots"[^>]*content="noindex, nofollow"/);
    const image = await get("/og-image.png");
    assert.match(image.headers.get("content-type")!, /^image\/png/);
    const png = Buffer.from(await image.arrayBuffer());
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
    console.log("Production discovery: static text/JSON resources, canonical catalog, no-JS HTML structured counts, page canonicals, noindex settings and actual 1200x630 PNG passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

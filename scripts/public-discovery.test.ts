import generatedCatalog from "../src/lib/public-tool-catalog.json";
import assert from "node:assert/strict";
import { toolsRegistry } from "../src/lib/tools-registry";
import { toolPath } from "../src/lib/category-routes";
import { APP_VERSION } from "../src/lib/app-version";
import { SITE_URL } from "../src/lib/seo-content";
import { agentCatalog, llmsIndex, publicTextResponse, publicToolCatalog, releaseMarkdown, toolCatalogMarkdown } from "../src/lib/public-discovery";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";

assert.deepEqual(generatedCatalog, toolsRegistry.map(({ id, name, description, category, tags, color }) => ({ id, name, description, category, tags, color })), "run npm run generate:public-catalog after changing registry literals");
const catalog = publicToolCatalog();
assert.equal(catalog.length, toolsRegistry.length);
assert.equal(new Set(catalog.map((tool) => tool.url)).size, catalog.length);
for (const tool of toolsRegistry) {
    const entry = catalog.find((row) => row.id === tool.id)!;
    assert.equal(entry.url, `${SITE_URL}${toolPath(tool)}`);
    assert.ok(toolCatalogMarkdown().includes(`](${entry.url})`));
    assert.ok(entry.description && entry.processingLabel);
}
const manifest = agentCatalog();
assert.equal(manifest.executionApi, null, "discovery must not claim to expose an execution API");
assert.equal(manifest.version, APP_VERSION);
assert.equal(manifest.tools.length, toolsRegistry.length);
assert.ok(llmsIndex().startsWith("# My Dev Tools\n\n>"));
for (const file of ["tool-catalog.md", "release-notes.md", "agents.json", "llms-full.txt"]) assert.ok(llmsIndex().includes(`${SITE_URL}/${file}`));
assert.ok(!("guides" in manifest.documentation));
assert.ok(releaseMarkdown().includes(APP_VERSION));
assert.equal(publicTextResponse("fixture", true).headers.get("content-type"), "text/markdown; charset=utf-8");
const urls = sitemap().map((row) => row.url);
assert.equal(new Set(urls).size, toolsRegistry.length + 2);
for (const tool of catalog) assert.ok(urls.includes(tool.url));
assert.ok(!urls.includes(`${SITE_URL}/guides`) && urls.includes(`${SITE_URL}/release-notes`));
assert.ok(!urls.some((url) => url.includes("/memory") || url.includes("/api/") || url.includes("/tools/")));
assert.deepEqual(robots().rules, [{ userAgent: "*", allow: "/", disallow: "/api/" }]);
console.log("Public discovery: complete canonical catalog, processing boundaries, current release, Markdown resources, read-only manifest, sitemap coverage and robots rules passed.");

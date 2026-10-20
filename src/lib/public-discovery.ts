import toolsRegistry from "./public-tool-catalog.json";
import type { ToolCategory } from "./tools-registry";
import { toolPath } from "./category-routes";
import { BOUNDARY_LABELS, dataBoundaryForTool } from "./data-boundaries";
import { DEBUGGING_GUIDES } from "./debugging-guides";
import { RELEASE_NOTES } from "./release-notes";
import { APP_VERSION } from "./app-version";
import { SITE_URL } from "./seo-content";

export function publicToolCatalog() {
    return toolsRegistry.map((tool) => ({ id: tool.id, name: tool.name, category: tool.category, description: tool.description, url: `${SITE_URL}${toolPath({ id: tool.id, category: tool.category as ToolCategory })}`, processing: dataBoundaryForTool(tool.id), processingLabel: BOUNDARY_LABELS[dataBoundaryForTool(tool.id)] }));
}
export function toolCatalogMarkdown() {
    const tools = publicToolCatalog();
    const categories = [...new Set(tools.map((tool) => tool.category))];
    return `# My Dev Tools catalog\n\nVersion ${APP_VERSION}. ${tools.length} tools across ${categories.length} categories.\n\nLocal tools run on your device. Network tools may contact selected endpoints or managed routes after an explicit action. Native database/storage connectors need the desktop app or an authenticated localhost runtime. This catalog contains public descriptions only.\n\n${categories.map((category) => `## ${category}\n\n${tools.filter((tool) => tool.category === category).map((tool) => `- [${tool.name}](${tool.url}): ${tool.description}. Processing: ${tool.processingLabel}.`).join("\n")}`).join("\n\n")}\n`;
}
export function guidesMarkdown() {
    return `# Debugging guides\n\nPublic fixtures and expected results. Loading an example fills a form; it does not send a request.\n\n${DEBUGGING_GUIDES.map((guide) => `## ${guide.title}\n\n${guide.explanation}\n\n${guide.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\nExpected result: ${guide.expected}\n\nTool: ${publicToolCatalog().find((tool) => tool.id === guide.toolId)?.url}\n\nPrimary reference: ${guide.source}\n\nPublic fixture:\n\n\`\`\`${guide.kind === "json" ? "json" : "text"}\n${guide.example}\n\`\`\``).join("\n\n")}\n`;
}
export function releaseMarkdown() {
    const release = RELEASE_NOTES.find((entry) => entry.version === APP_VERSION);
    return `# My Dev Tools ${APP_VERSION}\n\n${release?.title ?? "Current release"}\n\n${release?.summary ?? ""}\n\n${release?.sections.map((section) => `## ${section.label}\n\n${section.bullets.map((bullet) => `- ${bullet}`).join("\n")}`).join("\n\n") ?? ""}\n\n[Release history](${SITE_URL}/release-notes)\n`;
}
export function llmsIndex() {
    return `# My Dev Tools\n\n> A developer workspace with ${toolsRegistry.length} tools for formatting, validation, conversion, inspection and debugging. Version ${APP_VERSION}. Local processing by default; network boundaries are shown per tool.\n\nNo account is required to open the tools. Saved projects and preferences stay in the current browser or desktop profile. Vaults use passphrase-protected encryption. Tool inputs, credentials and saved records are not public documentation and are not exposed by these discovery files.\n\nThe web app needs JavaScript for interactive execution. Previously cached local tools can work offline; network tools and uncached model weights need connectivity. The desktop edition bundles local runtime assets. Native connectors are not public execution APIs. Interface language choices are English, Hindi, Spanish, French, German, Japanese, Chinese and Arabic; detailed copy may fall back to English.\n\n## Documentation\n\n- [Tool catalog](${SITE_URL}/tool-catalog.md): Every canonical tool URL, description, category and processing boundary.\n- [Debugging guides](${SITE_URL}/guides.md): Public fixtures, steps, expected results and primary references.\n- [Current release](${SITE_URL}/release-notes.md): Version ${APP_VERSION} capabilities and scope.\n\n## Optional\n\n- [Machine-readable catalog](${SITE_URL}/agents.json): Custom read-only catalog; not an A2A card, MCP server or execution API.\n- [Combined documentation](${SITE_URL}/llms-full.txt): Catalog, guides and current release in one response.\n- [Interactive workspace](${SITE_URL}/): Open tools and search the catalog.\n- [Sitemap](${SITE_URL}/sitemap.xml): Indexable HTML pages.\n`;
}
export function agentCatalog() {
    return { schemaVersion: 1, kind: "developer-tool-catalog", name: "My Dev Tools", version: APP_VERSION, url: SITE_URL, interactiveExecutionRequiresJavaScript: true, executionApi: null, documentation: { overview: `${SITE_URL}/llms.txt`, catalog: `${SITE_URL}/tool-catalog.md`, guides: `${SITE_URL}/guides.md`, release: `${SITE_URL}/release-notes.md` }, storage: "Project records stay in the current browser/desktop profile. Vaults are passphrase encrypted. Discovery files contain public documentation only.", tools: publicToolCatalog() };
}
export function publicTextResponse(text: string, markdown = false) {
    return new Response(text, { headers: { "Content-Type": `${markdown ? "text/markdown" : "text/plain"}; charset=utf-8`, "X-Content-Type-Options": "nosniff", Link: `</llms.txt>; rel="describedby"` } });
}

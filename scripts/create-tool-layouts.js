const fs = require("fs");
const path = require("path");

// Read tools registry
const registryPath = path.join(__dirname, "../src/lib/tools-registry.ts");
const registryContent = fs.readFileSync(registryPath, "utf8");

// Parse tools from registry
const toolMatches = registryContent.match(/\{\s*id:\s*"([^"]+)".*?name:\s*"([^"]+)".*?description:\s*"([^"]+)".*?category:\s*"([^"]+)".*?tags:\s*\[(.*?)\]/gs);

if (!toolMatches) {
    console.error("Could not parse tools registry");
    process.exit(1);
}

const tools = toolMatches.map((match) => {
    const idMatch = match.match(/id:\s*"([^"]+)"/);
    const nameMatch = match.match(/name:\s*"([^"]+)"/);
    const descMatch = match.match(/description:\s*"([^"]+)"/);
    const catMatch = match.match(/category:\s*"([^"]+)"/);
    const tagMatch = match.match(/tags:\s*\[(.*?)\]/);

    const tags = tagMatch ? tagMatch[1]
        .split(",")
        .map(t => t.trim().replace(/"/g, ""))
        .filter(t => t)
        : [];

    return {
        id: idMatch ? idMatch[1] : "",
        name: nameMatch ? nameMatch[1] : "",
        description: descMatch ? descMatch[1] : "",
        category: catMatch ? catMatch[1] : "",
        tags,
    };
});

console.log(`Found ${tools.length} tools`);

// For each tool, create a layout.tsx with generateMetadata
tools.forEach((tool) => {
    const toolDir = path.join(
        __dirname,
        `../src/app/tools/${tool.id}`
    );
    const layoutPath = path.join(toolDir, "layout.tsx");
    const pagePath = path.join(toolDir, "page.tsx");

    if (!fs.existsSync(pagePath)) {
        console.warn(`⚠️  Page not found: ${pagePath}`);
        return;
    }

    // Only create layout if it doesn't exist
    if (fs.existsSync(layoutPath)) {
        console.log(`✓ ${tool.name} already has layout.tsx`);
        return;
    }

    const tagsStr = tool.tags.map(t => `"${t}"`).join(", ");
    const description = tool.description
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');

    const layoutContent = `import { Metadata } from "next";
import { ReactNode } from "react";

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = "https://devtools-hub.com";
    const toolName = "${tool.name}";
    const description = "${description}";
    const toolId = "${tool.id}";
    const category = "${tool.category}";
    const tags = [${tagsStr}];
    const pageUrl = \`\${baseUrl}/tools/\${toolId}\`;
    const ogImage = \`\${baseUrl}/og-image.png\`;

    return {
        title: \`\${toolName} - DevTools Hub\`,
        description,
        keywords: [toolName, category, ...tags, "developer tools", "open source"].join(", "),
        canonical: pageUrl,
        openGraph: {
            title: \`\${toolName} - DevTools Hub\`,
            description,
            url: pageUrl,
            type: "website",
            images: [{
                url: ogImage,
                width: 1200,
                height: 630,
                alt: toolName,
            }],
        },
        twitter: {
            card: "summary_large_image",
            title: \`\${toolName} - DevTools Hub\`,
            description,
            images: [ogImage],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}
`;

    fs.writeFileSync(layoutPath, layoutContent);
    console.log(`✅ Created layout.tsx for ${tool.name}`);
});

console.log("✅ Done!");

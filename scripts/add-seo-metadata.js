const fs = require("fs");
const path = require("path");

// Read tools registry to get tool info
const registryPath = path.join(__dirname, "../src/lib/tools-registry.ts");
const registryContent = fs.readFileSync(registryPath, "utf8");

// Parse tools from registry using regex
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

// For each tool, add metadata to its page.tsx
tools.forEach((tool) => {
    const pagePath = path.join(
        __dirname,
        `../src/app/tools/${tool.id}/page.tsx`
    );

    if (!fs.existsSync(pagePath)) {
        console.warn(`⚠️  Page not found: ${pagePath}`);
        return;
    }

    let content = fs.readFileSync(pagePath, "utf8");

    // Check if metadata already exists
    if (content.includes("generateMetadata")) {
        console.log(`✓ ${tool.name} already has metadata`);
        return;
    }

    // Add Metadata import if not present
    if (!content.includes("import { Metadata }")) {
        content = content.replace(
            '"use client";\n\nimport',
            '"use client";\n\nimport { Metadata } from "next";\nimport'
        );
    }

    // Find the last export default function and add metadata after it
    const defaultExportIndex = content.lastIndexOf("export default function");
    if (defaultExportIndex === -1) {
        console.warn(`⚠️  No export default found in ${tool.name}`);
        return;
    }

    // Find the closing brace of the component
    let braceCount = 0;
    let componentEndIndex = defaultExportIndex;
    let inFunction = false;

    for (let i = defaultExportIndex; i < content.length; i++) {
        const char = content[i];
        if (char === "{") {
            braceCount++;
            inFunction = true;
        } else if (char === "}") {
            braceCount--;
            if (inFunction && braceCount === 0) {
                componentEndIndex = i + 1;
                break;
            }
        }
    }

    // Create metadata function
    const tagsStr = tool.tags.map(t => `"${t}"`).join(", ");
    const metadataFunction = `

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = "https://devtools-hub.com";
    const toolName = "${tool.name}";
    const description = "${tool.description.replace(/"/g, '\\"')}";
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
}`;

    // Insert metadata function after component
    content = content.slice(0, componentEndIndex) + metadataFunction + content.slice(componentEndIndex);

    // Write back
    fs.writeFileSync(pagePath, content);
    console.log(`✅ Added metadata to ${tool.name}`);
});

console.log("✅ Done!");

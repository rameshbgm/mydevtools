const fs = require("fs");
const path = require("path");

const toolsPath = path.join(__dirname, "../src/app/tools");
const dirs = fs.readdirSync(toolsPath);

let fixed = 0;

dirs.forEach((dir) => {
    const layoutPath = path.join(toolsPath, dir, "layout.tsx");

    if (!fs.existsSync(layoutPath)) return;

    let content = fs.readFileSync(layoutPath, "utf8");

    // Fix the metadata return object
    const oldMetadata = `return {
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
    };`;

    const newMetadata = `return {
        title: \`\${toolName} - DevTools Hub\`,
        description,
        keywords: [toolName, category, ...tags, "developer tools", "open source"].join(", "),
        alternates: {
            canonical: pageUrl,
        },
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
    };`;

    if (content.includes("canonical: pageUrl,")) {
        content = content.replace(oldMetadata, newMetadata);
        fs.writeFileSync(layoutPath, content);
        fixed++;
    }
});

console.log(`✅ Fixed metadata in ${fixed} layout files`);

const fs = require("fs");
const path = require("path");

// Find all page.tsx files with generateMetadata
const toolsPath = path.join(__dirname, "../src/app/tools");
const dirs = fs.readdirSync(toolsPath);

let removed = 0;

dirs.forEach((dir) => {
    const pagePath = path.join(toolsPath, dir, "page.tsx");

    if (!fs.existsSync(pagePath)) return;

    let content = fs.readFileSync(pagePath, "utf8");

    // Remove generateMetadata function
    const metadataFunctionRegex = /\n\nexport async function generateMetadata\(\): Promise<Metadata> \{[\s\S]*?\n\}/;
    if (content.match(metadataFunctionRegex)) {
        content = content.replace(metadataFunctionRegex, "");
        removed++;
    }

    // Remove Metadata import if it's the only thing from that import
    content = content.replace(/import { Metadata } from "next";\n\n/, "");
    content = content.replace(/\nimport { Metadata } from "next";/, "");

    fs.writeFileSync(pagePath, content);
});

console.log(`✅ Removed generateMetadata from ${removed} files`);

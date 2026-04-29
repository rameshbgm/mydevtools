const fs = require("fs");
const path = require("path");

// Find all page.tsx files with generateMetadata but missing Metadata import
const toolsPath = path.join(__dirname, "../src/app/tools");
const dirs = fs.readdirSync(toolsPath);

let fixed = 0;

dirs.forEach((dir) => {
    const pagePath = path.join(toolsPath, dir, "page.tsx");

    if (!fs.existsSync(pagePath)) return;

    let content = fs.readFileSync(pagePath, "utf8");

    // Check if it has generateMetadata but missing Metadata import
    if (content.includes("generateMetadata") && !content.includes("import { Metadata }")) {
        // Add Metadata import after "use client"
        content = content.replace(
            '"use client";\n\n',
            '"use client";\n\nimport { Metadata } from "next";\n\n'
        );

        fs.writeFileSync(pagePath, content);
        console.log(`✅ Added Metadata import to ${dir}`);
        fixed++;
    }
});

console.log(`\n✅ Fixed ${fixed} files`);

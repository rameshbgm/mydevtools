const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Find all TypeScript/TSX files
const result = execSync('find src -type f \\( -name "*.ts" -o -name "*.tsx" \\)').toString();
const files = result.split("\n").filter(f => f.trim());

let updated = 0;

files.forEach((file) => {
    const filePath = path.join("/Users/laxmi/ramesh/code/mytool", file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, "utf8");
    const original = content;

    // Replace "DevTools Hub" with "mydevtools" but keep context
    content = content.replace(/DevTools Hub/g, "mydevtools");

    // Also update specific phrases
    content = content.replace(/DevTools Hub — Your Personal Developer Portal/g, "mydevtools — Your Personal Developer Portal");
    content = content.replace(/isn't part of DevTools Hub/g, "isn't part of mydevtools");

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        updated++;
        console.log(`✅ Updated ${file}`);
    }
});

console.log(`\n✅ Rebranded ${updated} files to mydevtools`);

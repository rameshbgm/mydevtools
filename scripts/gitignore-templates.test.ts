import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { generateGitignore, GITIGNORE_TEMPLATES } from "../src/lib/gitignore-templates";
const directory = mkdtempSync(join(tmpdir(), "mydevtools-ignore-"));
try {
    assert.equal(new Set(GITIGNORE_TEMPLATES.map((item) => item.id)).size, GITIGNORE_TEMPLATES.length);
    assert.equal(spawnSync("git", ["init", "--quiet", directory], { encoding: "utf8" }).status, 0);
    writeFileSync(join(directory, ".gitignore"), generateGitignore(["node", "next", "python", "rust", "macos", "vscode", "secrets"], "*.fixture\n!important.fixture\n"));
    const paths = ["node_modules/pkg/index.js", ".next/cache/item", "nested/__pycache__/thing.pyc", "target/debug/bin", ".DS_Store", ".env", ".env.production", ".env.example", ".vscode/local.json", ".vscode/settings.json", "package-lock.json", "Cargo.lock", "src/main.rs", "test.fixture", "important.fixture"];
    const result = spawnSync("git", ["-C", directory, "-c", "core.excludesFile=/dev/null", "check-ignore", "--no-index", "--stdin"], { input: paths.join("\n") + "\n", encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(new Set(result.stdout.trim().split("\n")), new Set(paths.filter((path) => ![".env.example", ".vscode/settings.json", "package-lock.json", "Cargo.lock", "src/main.rs", "important.fixture"].includes(path))));
    assert.throws(() => generateGitignore(["not-a-template"]));
    assert.throws(() => generateGitignore([], "bad\0pattern"));
    console.log("Git checked starter patterns, nested build exclusions, environment/editor exceptions and custom negation order.");
} finally { rmSync(directory, { recursive: true, force: true }); }

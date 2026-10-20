export interface GitignoreTemplate { id: string; name: string; group: "Stack" | "Editor" | "Operating system" | "Local data"; patterns: string[] }
/** Original starter patterns; lockfiles remain tracked unless the user adds an override. */
export const GITIGNORE_TEMPLATES: GitignoreTemplate[] = [
    { id: "node", name: "Node.js", group: "Stack", patterns: ["node_modules/", "npm-debug.log*", "yarn-debug.log*", "yarn-error.log*", ".npm/", ".pnpm-store/", "coverage/", "*.tsbuildinfo"] },
    { id: "next", name: "Next.js", group: "Stack", patterns: [".next/", "out/", ".vercel/", "next-env.d.ts"] },
    { id: "frontend", name: "Vite / frontend builds", group: "Stack", patterns: ["dist/", ".vite/", ".turbo/", ".parcel-cache/", "storybook-static/"] },
    { id: "python", name: "Python", group: "Stack", patterns: ["__pycache__/", "*.py[cod]", ".venv/", "venv/", ".pytest_cache/", ".mypy_cache/", ".ruff_cache/", ".coverage", "htmlcov/", "*.egg-info/", "build/", "dist/"] },
    { id: "jupyter", name: "Jupyter", group: "Stack", patterns: [".ipynb_checkpoints/", ".jupyter/", "profile_default/"] },
    { id: "java", name: "Java / Maven", group: "Stack", patterns: ["*.class", "target/", ".classpath", ".project", ".settings/"] },
    { id: "gradle", name: "Gradle", group: "Stack", patterns: [".gradle/", "build/", "!gradle/wrapper/gradle-wrapper.jar"] },
    { id: "go", name: "Go", group: "Stack", patterns: ["*.test", "*.out", "/bin/", "/vendor/"] },
    { id: "rust", name: "Rust", group: "Stack", patterns: ["/target/", "**/*.rs.bk"] },
    { id: "dotnet", name: ".NET", group: "Stack", patterns: ["[Bb]in/", "[Oo]bj/", ".vs/", "*.user", "*.suo", "TestResults/", "*.nupkg"] },
    { id: "ruby", name: "Ruby / Bundler", group: "Stack", patterns: [".bundle/", "vendor/bundle/", "*.gem", "coverage/", ".yardoc/", "doc/"] },
    { id: "rails", name: "Rails", group: "Stack", patterns: ["/log/*", "/tmp/*", "!/log/.keep", "!/tmp/.keep", "/storage/*", "!/storage/.keep", "/config/master.key", "/config/credentials/*.key", "/public/assets/"] },
    { id: "php", name: "PHP / Composer", group: "Stack", patterns: ["/vendor/", "/.phpunit.cache/", "/.phpunit.result.cache", "/composer.phar"] },
    { id: "laravel", name: "Laravel", group: "Stack", patterns: ["/storage/*.key", "/storage/framework/cache/data/*", "/storage/framework/sessions/*", "/storage/framework/views/*", "/storage/logs/*", "/public/hot", "/public/build/"] },
    { id: "cpp", name: "C / C++ / CMake", group: "Stack", patterns: ["*.o", "*.obj", "*.a", "*.so", "*.dylib", "*.dll", "*.exe", "CMakeFiles/", "CMakeCache.txt", "cmake-build-*/", "/build/"] },
    { id: "swift", name: "Swift / Xcode", group: "Stack", patterns: [".build/", "DerivedData/", "xcuserdata/", "*.xcuserstate", ".swiftpm/xcode/package.xcworkspace/"] },
    { id: "android", name: "Android", group: "Stack", patterns: [".gradle/", "local.properties", "captures/", ".cxx/", "build/", "*.apk", "*.aab"] },
    { id: "flutter", name: "Flutter / Dart", group: "Stack", patterns: [".dart_tool/", ".flutter-plugins", ".flutter-plugins-dependencies", ".packages", "/build/", "coverage/"] },
    { id: "unity", name: "Unity", group: "Stack", patterns: ["/[Ll]ibrary/", "/[Tt]emp/", "/[Oo]bj/", "/[Bb]uild/", "/[Bb]uilds/", "/[Ll]ogs/", "/[Uu]ser[Ss]ettings/", "*.csproj", "*.sln"] },
    { id: "terraform", name: "Terraform", group: "Stack", patterns: [".terraform/", "*.tfstate", "*.tfstate.*", "crash.log", "*.tfplan", "*.tfvars", "!*.tfvars.example", "override.tf", "override.tf.json", "*_override.tf", "*_override.tf.json"] },
    { id: "pulumi", name: "Pulumi local state", group: "Stack", patterns: [".pulumi/", "Pulumi.*.yaml", "!Pulumi.yaml", "!Pulumi.*.example.yaml"] },
    { id: "vscode", name: "Visual Studio Code", group: "Editor", patterns: [".vscode/*", "!.vscode/settings.json", "!.vscode/tasks.json", "!.vscode/launch.json", "!.vscode/extensions.json", "*.code-workspace"] },
    { id: "jetbrains", name: "JetBrains", group: "Editor", patterns: [".idea/", "*.iml"] },
    { id: "vim", name: "Vim", group: "Editor", patterns: ["*.swp", "*.swo", ".*.sw?", "Session.vim"] },
    { id: "emacs", name: "Emacs", group: "Editor", patterns: ["*~", "\\#*\\#", ".\\#*"] },
    { id: "macos", name: "macOS", group: "Operating system", patterns: [".DS_Store", "._*", ".Spotlight-V100/", ".Trashes/"] },
    { id: "windows", name: "Windows", group: "Operating system", patterns: ["Thumbs.db", "Thumbs.db:encryptable", "Desktop.ini", "$RECYCLE.BIN/"] },
    { id: "linux", name: "Linux", group: "Operating system", patterns: ["*~", ".nfs*", ".Trash-*/"] },
    { id: "secrets", name: "Local environment / private keys", group: "Local data", patterns: [".env", ".env.*", "!.env.example", "!.env.sample", "*.key", "*.p12", "*.pfx", "/secrets/"] },
    { id: "logs", name: "Logs / temporary output", group: "Local data", patterns: ["*.log", "/tmp/", "/temp/", ".cache/"] },
];
export function generateGitignore(ids: string[], custom = ""): string {
    if (custom.length > 100_000 || custom.includes("\0")) throw new Error("Custom patterns must be plain text up to 100,000 characters.");
    const sections = ["# Generated with My Dev Tools\n# Review patterns for your repository before use."];
    const seen = new Set<string>();
    for (const id of ids) { if (seen.has(id)) continue; seen.add(id); const template = GITIGNORE_TEMPLATES.find((item) => item.id === id); if (!template) throw new Error(`Unknown template: ${id}`); sections.push(`# ${template.name}\n${template.patterns.join("\n")}`); }
    if (custom.trim()) sections.push("# Custom patterns (last matching pattern wins)\n" + custom.replace(/\r\n/g, "\n"));
    return sections.join("\n\n").replace(/\n*$/, "\n");
}

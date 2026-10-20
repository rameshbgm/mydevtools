export const MODEL_TARGETS = {
    typescript: { name: "TypeScript", editor: "typescript", extension: "ts" },
    java: { name: "Java", editor: "java", extension: "java" },
    python: { name: "Python", editor: "python", extension: "py" },
    go: { name: "Go", editor: "go", extension: "go" },
    rust: { name: "Rust", editor: "rust", extension: "rs" },
    csharp: { name: "C#", editor: "csharp", extension: "cs" },
    kotlin: { name: "Kotlin", editor: "kotlin", extension: "kt" },
    swift: { name: "Swift", editor: "swift", extension: "swift" },
    dart: { name: "Dart", editor: "dart", extension: "dart" },
} as const;
export type ModelTarget = keyof typeof MODEL_TARGETS;
export interface GeneratedModelFile { filename: string; content: string }
export async function generateModelFiles(input: string, target: ModelTarget, name: string): Promise<GeneratedModelFile[]> {
    if (!Object.hasOwn(MODEL_TARGETS, target)) throw new Error("Choose a supported model language.");
    if (input.length > 2 * 1024 * 1024) throw new Error("Model generation input limit is 2 MiB.");
    if (!/^[A-Za-z_][A-Za-z0-9_]{0,79}$/.test(name)) throw new Error("Use a type name beginning with a letter or underscore, up to 80 characters.");
    JSON.parse(input);
    // Import the engine and string-input API directly. The package's barrel also
    // exports Node filesystem/URL loaders which do not belong in a local worker.
    const [{ quicktypeMultiFile }, { InputData, jsonInputForTargetLanguage }] = await Promise.all([
        import("quicktype-core/dist/esm/Run.js"),
        import("quicktype-core/dist/esm/input/Inputs.js"),
    ]);
    const json = jsonInputForTargetLanguage(target, undefined, false);
    await json.addSource({ name, samples: [input] });
    const inputData = new InputData(); inputData.addInput(json);
    const rendererOptions = target === "rust" || target === "go" ? {} : { "just-types": true };
    const result = await quicktypeMultiFile({ inputData, lang: target, inferEnums: false, outputFilename: `${name}.${MODEL_TARGETS[target].extension}`, rendererOptions });
    const files = [...result].map(([filename, file]) => ({ filename, content: file.lines.join("\n") }));
    if (!files.length || files.reduce((size, file) => size + file.content.length, 0) > 8 * 1024 * 1024) throw new Error("Generated output is empty or exceeds 8 MiB. Use a smaller sample.");
    return files;
}

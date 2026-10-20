import { SchemaNumber, parseSchemaSamples } from "./json-number-source";
export interface InferredSchema { [key: string]: unknown }
export function inferSchema(input: string, options: { multipleSamples?: boolean; closedObjects?: boolean; title?: string } = {}): InferredSchema {
    if (input.length > 2 * 1024 * 1024) throw new Error("Schema inference input limit is 2 MiB.");
    const parsed = parseSchemaSamples(input);
    const samples = options.multipleSamples ? parsed : [parsed];
    if (!Array.isArray(samples) || !samples.length) throw new Error("Multiple samples must be a nonempty JSON array of example documents.");
    let visited = 0;
    const kind = (value: unknown): string => value instanceof SchemaNumber ? value.integer ? "integer" : "number" : value === null ? "null" : Array.isArray(value) ? "array" : typeof value === "number" ? Number.isInteger(value) ? "integer" : "number" : typeof value;
    const infer = (values: unknown[], depth: number): InferredSchema => {
        visited += values.length;
        if (visited > 100_000 || depth > 80) throw new Error("The samples are too large or deeply nested. Use smaller representative examples.");
        const groups = new Map<string, unknown[]>();
        const hasFraction = values.some((value) => kind(value) === "number");
        for (const value of values) {
            const type = kind(value) === "integer" && hasFraction ? "number" : kind(value);
            const existing = groups.get(type);
            if (existing) existing.push(value); else groups.set(type, [value]);
        }
        const branches = [...groups].map(([type, group]): InferredSchema => {
            if (type === "object") {
                const objects = group as Record<string, unknown>[];
                const names = [...new Set(objects.flatMap((object) => Object.keys(object)))];
                const properties: Record<string, InferredSchema> = Object.create(null);
                for (const name of names) properties[name] = infer(objects.filter((object) => Object.hasOwn(object, name)).map((object) => object[name]), depth + 1);
                const required = names.filter((name) => objects.every((object) => Object.hasOwn(object, name)));
                return { type, properties, ...(required.length ? { required } : {}), ...(options.closedObjects ? { additionalProperties: false } : {}) };
            }
            if (type === "array") { const items = (group as unknown[][]).flat(); return { type, items: items.length ? infer(items, depth + 1) : {} }; }
            return { type };
        });
        return branches.length === 1 ? branches[0] : { anyOf: branches };
    };
    return { $schema: "https://json-schema.org/draft/2020-12/schema", ...(options.title?.trim() ? { title: options.title.trim().slice(0, 100) } : {}), ...infer(samples, 0) };
}

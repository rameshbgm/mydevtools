// Environment variable substitution for the API Request Builder.
//
// Syntax: `{{variableName}}` — replaced with the active environment's value.
// Unknown variables are left intact so users can see exactly what failed to
// resolve, rather than silently being substituted to "".
//
// Built-in placeholders are also supported (`{{$timestamp}}`, `{{$randomUUID}}`)
// so quick tests don't require setting up an environment first.

export interface Environment {
    id: string;
    name: string;
    variables: { key: string; value: string; enabled: boolean }[];
}

type ResolveResult = { resolved: string; unresolved: Set<string> };

const VAR_PATTERN = /\{\{\s*([\w$.-]+)\s*\}\}/g;

function builtin(name: string): string | null {
    if (name === "$timestamp") return String(Math.floor(Date.now() / 1000));
    if (name === "$isoTimestamp") return new Date().toISOString();
    if (name === "$randomUUID") {
        // RFC 4122 v4 — uses crypto.randomUUID when available (HTTPS / modern browsers),
        // falls back to a deterministic-shape string with Math.random() for old contexts.
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    if (name === "$randomInt") return String(Math.floor(Math.random() * 1000));
    return null;
}

export function buildVariableMap(env: Environment | null): Record<string, string> {
    if (!env) return {};
    const out: Record<string, string> = {};
    for (const v of env.variables) {
        if (v.enabled && v.key) out[v.key] = v.value;
    }
    return out;
}

export function substitute(input: string, vars: Record<string, string>): ResolveResult {
    const unresolved = new Set<string>();
    const resolved = input.replace(VAR_PATTERN, (_match, name: string) => {
        const b = builtin(name);
        if (b !== null) return b;
        if (Object.prototype.hasOwnProperty.call(vars, name)) return vars[name];
        unresolved.add(name);
        return `{{${name}}}`;
    });
    return { resolved, unresolved };
}

export function substituteAll(values: string[], vars: Record<string, string>): { resolved: string[]; unresolved: Set<string> } {
    const unresolved = new Set<string>();
    const resolved = values.map((v) => {
        const r = substitute(v, vars);
        r.unresolved.forEach((u) => unresolved.add(u));
        return r.resolved;
    });
    return { resolved, unresolved };
}

/** Has any `{{...}}` placeholder, resolved or otherwise. */
export function hasVariableSyntax(s: string): boolean {
    return VAR_PATTERN.test(s);
}

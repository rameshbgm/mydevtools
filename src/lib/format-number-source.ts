import { numberSourceRoundTrips } from "./json-number-source";

export const CONVERSION_PRECISION_ERROR = "A numeric value would lose precision or negative zero during conversion. Encode the original value as a quoted string, then convert again.";

/** Called only for numeric YAML nodes, not numeric-looking quoted/plain strings. */
export function checkYamlNumber(source: string, value: number | bigint): void {
    if (typeof value === "bigint") {
        if (value === BigInt(0) && source.startsWith("-")) throw new Error(CONVERSION_PRECISION_ERROR);
        return; // Integer magnitudes are checked before serialization.
    }
    const decimal = source.replace(/^\+/, "").replace(/^(\-?)\./, "$10.").replace(/\.(?=[eE]|$)/, ".0");
    if (!numberSourceRoundTrips(decimal)) throw new Error(CONVERSION_PRECISION_ERROR);
}

/** Walk already-valid TOML syntax, preserving dates as ISO text before the
 * parser's Date representation can truncate fractional seconds. This scanner
 * only inspects value tokens; table names, keys, strings and comments are opaque.
 * The authoritative TOML parser validates the complete document first. */
export function prepareTomlSource(input: string): string {
    type Context = { kind: "root" | "array" | "inline"; phase: "key" | "value" | "separator" };
    const stack: Context[] = [{ kind: "root", phase: "key" }];
    const replacements: { start: number; end: number; text: string }[] = [];
    let index = 0;
    const skipString = () => {
        const quote = input[index];
        const multiline = input.startsWith(quote.repeat(3), index);
        index += multiline ? 3 : 1;
        while (index < input.length) {
            if (quote === '"' && input[index] === "\\") { index += 2; continue; }
            if (input[index] !== quote) { index++; continue; }
            if (!multiline) { index++; return; }
            let end = index;
            while (input[end] === quote) end++;
            if (end - index >= 3) { index = end; return; }
            index = end;
        }
    };
    while (index < input.length) {
        const context = stack[stack.length - 1];
        const char = input[index];
        if (char === "#") { while (index < input.length && input[index] !== "\n") index++; continue; }
        if (/\s/.test(char)) {
            if ((char === "\n" || char === "\r") && context.kind === "root") context.phase = "key";
            index++; continue;
        }
        if (char === '"' || char === "'") {
            skipString();
            if (context.phase === "value") context.phase = "separator";
            continue;
        }
        if (context.phase === "key") {
            if (context.kind === "root" && char === "[") {
                // A table/array-of-tables header; quoted names may contain ].
                index++;
                while (index < input.length && input[index] !== "\n") {
                    if (input[index] === "#") { while (index < input.length && input[index] !== "\n") index++; break; }
                    if (input[index] === '"' || input[index] === "'") skipString();
                    else index++;
                }
                continue;
            }
            if (char === "=") context.phase = "value";
            if (char === "}" && context.kind === "inline") { stack.pop(); stack[stack.length - 1].phase = "separator"; }
            index++; continue;
        }
        if (char === "]" || char === "}") {
            stack.pop();
            stack[stack.length - 1].phase = "separator";
            index++; continue;
        }
        if (char === ",") { context.phase = context.kind === "inline" ? "key" : "value"; index++; continue; }
        if (context.phase === "value" && (char === "[" || char === "{")) {
            stack.push({ kind: char === "[" ? "array" : "inline", phase: char === "[" ? "value" : "key" });
            index++; continue;
        }
        const start = index;
        while (index < input.length && !/[#\n\r,\]}]/.test(input[index])) index++;
        const source = input.slice(start, index).trimEnd();
        if (/^(?:\d{4}-\d{2}-\d{2}(?:[Tt ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:[Zz]|[+-]\d{2}:\d{2})?)?|\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)$/.test(source)) {
            replacements.push({ start, end: start + source.length, text: JSON.stringify(source.replace(/^(\d{4}-\d{2}-\d{2})[t ]/, "$1T").replace(/z$/, "Z")) });
        } else if (!/^[+-]?0[xob]/i.test(source) && /^[+-]?\d/.test(source)) {
            const decimal = source.replace(/_/g, "").replace(/^\+/, "");
            // Large integers remain BigInt until the common range check, so
            // their existing explicit recovery is retained.
            if ((/[.eE]/.test(decimal) || /^-0$/.test(decimal)) && !numberSourceRoundTrips(decimal)) throw new Error(CONVERSION_PRECISION_ERROR);
        }
        context.phase = "separator";
    }
    let output = "", position = 0;
    for (const replacement of replacements) {
        output += input.slice(position, replacement.start) + replacement.text;
        position = replacement.end;
    }
    return output + input.slice(position);
}

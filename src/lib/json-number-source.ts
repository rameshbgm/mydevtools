const TOKEN = /"(?:[^"\\]|\\[\s\S])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}\[\]:,]/g;

function decimalParts(source: string) {
    const match = /^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i.exec(source)!;
    const coefficient = (match[2] + (match[3] ?? "")).replace(/^0+/, "");
    const digits = coefficient.replace(/0+$/, "");
    const rawExponent = match[4] ?? "0";
    const exponentDigits = rawExponent.replace(/^[+-]/, "").replace(/^0+/, "") || "0";
    const exponent = exponentDigits === "0" ? "0" : `${rawExponent.startsWith("-") ? "-" : ""}${exponentDigits}`;
    const hugeExponent = exponent.replace(/^[+-]/, "").length > 8;
    // Input is bounded to 2 MiB, so an exponent with >8 significant digits
    // dominates every possible fraction length without parsing a giant BigInt.
    const scale = hugeExponent ? exponent.startsWith("-") ? -Infinity : Infinity : Number(exponent) - (match[3]?.length ?? 0) + coefficient.length - digits.length;
    return { negative: match[1] === "-", digits, scale, exponent };
}

function canonicalDecimal(source: string): string {
    const parts = decimalParts(source);
    if (!parts.digits) return "0";
    return `${parts.negative ? "-" : ""}${parts.digits}e${Number.isFinite(parts.scale) ? parts.scale : parts.exponent}`;
}

/** Compare decimal values rather than their spelling (1.00 and 1e0 agree).
 * This catches underflow and rounded fractions as well as overflowing values. */
export function numberSourceRoundTrips(source: string): boolean {
    if (!/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(source)) return false;
    const number = Number(source);
    return Number.isFinite(number) && !Object.is(number, -0) && canonicalDecimal(source) === canonicalDecimal(String(number));
}

/** Only the parser can create these nodes; user objects with similar keys
 * remain ordinary objects. Classification uses decimal tokens, never Number. */
export class SchemaNumber {
    readonly integer: boolean;
    constructor(readonly source: string) {
        const parts = decimalParts(source);
        this.integer = !parts.digits || parts.scale >= 0;
    }
}

function validatedTokens(input: string) {
    if (input.length > 2 * 1024 * 1024) throw new Error("JSON source input limit is 2 MiB.");
    JSON.parse(input); // Native grammar validation; parsed numeric values are unused.
    return input.match(TOKEN)!;
}

export function parseSchemaSamples(input: string): unknown {
    const tokens = validatedTokens(input);
    let index = 0, visited = 0;
    const value = (depth: number): unknown => {
        if (++visited > 100_000 || depth > 80) throw new Error("The samples are too large or deeply nested. Use smaller representative examples.");
        const token = tokens[index++];
        if (token === "{") {
            const result: Record<string, unknown> = {};
            while (tokens[index] !== "}") {
                const key = JSON.parse(tokens[index++]) as string;
                index++; // Colon; grammar was validated above.
                Object.defineProperty(result, key, { value: value(depth + 1), enumerable: true, writable: true, configurable: true });
                if (tokens[index] !== ",") break;
                index++;
            }
            index++;
            return result;
        }
        if (token === "[") {
            const result: unknown[] = [];
            while (tokens[index] !== "]") {
                result.push(value(depth + 1));
                if (tokens[index] !== ",") break;
                index++;
            }
            index++;
            return result;
        }
        if (token.startsWith('"')) return JSON.parse(token);
        if (token === "true") return true;
        if (token === "false") return false;
        if (token === "null") return null;
        return new SchemaNumber(token);
    };
    return value(0);
}

export type QueryNumberMode = "reject" | "strings";
export function parseQueryJson(input: string, mode: QueryNumberMode = "reject", precisionError = "A JSON number would lose precision or negative zero. Quote that value, or enable Preserve precision-sensitive numbers as text."): unknown {
    const tokens = validatedTokens(input);
    const output = tokens.map((token) => {
        if (!/^[-\d]/.test(token)) return token;
        if (numberSourceRoundTrips(token)) return token;
        if (mode === "reject") throw new Error(precisionError);
        return JSON.stringify(token);
    });
    return JSON.parse(output.join(""));
}

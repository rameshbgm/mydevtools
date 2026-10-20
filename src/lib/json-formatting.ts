/** Format tokens without reserializing values. Preserve numeric spelling,
 * negative zero, escaped strings, key order and duplicate properties. */
export function formatJsonText(input: string, compact = false): string {
    if (input.length > 2 * 1024 * 1024) throw new Error("JSON formatting input limit is 2 MiB.");
    JSON.parse(input); // Validate grammar only; never serialize rounded Numbers.
    const tokens = input.match(/"(?:[^"\\]|\\[\s\S])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}\[\]:,]/g)!;
    const output: string[] = [];
    let depth = 0, length = 0;
    const append = (value: string) => {
        length += value.length;
        if (length > 8 * 1024 * 1024) throw new Error("Formatted JSON exceeds 8 MiB. Use compact output or a smaller document.");
        output.push(value);
    };
    const newline = () => { if (!compact) append(`\n${"  ".repeat(depth)}`); };
    for (const [index, token] of tokens.entries()) {
        if (token === "{" || token === "[") {
            append(token);
            if (++depth > 128) throw new Error("JSON formatting supports up to 128 nesting levels.");
            if (tokens[index + 1] !== "}" && tokens[index + 1] !== "]") newline();
        } else if (token === "}" || token === "]") {
            depth--;
            if (tokens[index - 1] !== "{" && tokens[index - 1] !== "[") newline();
            append(token);
        } else if (token === ",") { append(token); newline(); }
        else append(token === ":" && !compact ? ": " : token);
    }
    return output.join("");
}

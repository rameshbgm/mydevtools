const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";
export function convertIntegerBase(input: string, from: number | "auto", to: number): string {
    if (!Number.isInteger(to) || to < 2 || to > 36 || (from !== "auto" && (!Number.isInteger(from) || from < 2 || from > 36))) throw new Error("Choose integer bases from 2 through 36.");
    let text = input.trim().toLowerCase();
    if (!text || text.length > 4096) throw new Error("Enter an integer of up to 4096 characters.");
    let negative = false;
    if (text[0] === "-" || text[0] === "+") { negative = text[0] === "-"; text = text.slice(1); }
    const prefix = text.startsWith("0x") ? 16 : text.startsWith("0b") ? 2 : text.startsWith("0o") ? 8 : null;
    const base = from === "auto" ? prefix ?? 10 : from;
    if (prefix && (from === "auto" || prefix === base)) text = text.slice(2);
    if (!text) throw new Error("Enter digits after the sign or prefix.");
    let result = BigInt(0);
    for (const char of text) {
        const value = DIGITS.indexOf(char);
        if (value < 0 || value >= base) throw new Error(`“${char}” is not a digit in base ${base}.`);
        result = result * BigInt(base) + BigInt(value);
    }
    return (negative ? -result : result).toString(to);
}

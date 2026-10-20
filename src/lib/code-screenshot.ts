export type CodeTone = "plain" | "keyword" | "string" | "number" | "comment" | "title" | "type" | "property";
export interface CodeToken { text: string; tone: CodeTone }
export type CodeLine = CodeToken[];
export interface CodeTheme { name: string; surface: string; foreground: string; muted: string; border: string; tones: Record<CodeTone,string> }
export const CODE_THEMES: Record<string,CodeTheme> = {
    midnight: { name:"Midnight",surface:"#161b22",foreground:"#e6edf3",muted:"#8b949e",border:"#30363d",tones:{plain:"#e6edf3",keyword:"#ff7b72",string:"#a5d6ff",number:"#79c0ff",comment:"#8b949e",title:"#d2a8ff",type:"#ffa657",property:"#7ee787"} },
    paper: { name:"Paper",surface:"#ffffff",foreground:"#24292f",muted:"#57606a",border:"#d0d7de",tones:{plain:"#24292f",keyword:"#cf222e",string:"#0a3069",number:"#0550ae",comment:"#57606a",title:"#8250df",type:"#953800",property:"#116329"} },
    forest: { name:"Forest",surface:"#14231c",foreground:"#e6f0e9",muted:"#a3b7a8",border:"#40594a",tones:{plain:"#e6f0e9",keyword:"#e7bd85",string:"#b9dea2",number:"#98d5d0",comment:"#a3b7a8",title:"#d4b4de",type:"#eac59d",property:"#a5d8ba"} },
};
export function validateScreenshotCode(source: string): string {
    if (!source.trim()) throw new Error("Enter code to render.");
    if (source.length > 20_000 || new TextEncoder().encode(source).length > 64 * 1024) throw new Error("Use up to 20,000 characters and 64 KiB of code.");
    const normalized = source.replace(/\r\n?/g,"\n");
    if (normalized.split("\n").length > 500) throw new Error("Use up to 500 source lines.");
    if (/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(normalized)) throw new Error("Remove nonprinting control characters from the code.");
    return normalized;
}
const role = (classes: string[], inherited: CodeTone): CodeTone => {
    if (classes.some((c) => /comment|quote/.test(c))) return "comment";
    if (classes.some((c) => /keyword|literal|selector-tag/.test(c))) return "keyword";
    if (classes.some((c) => /string|regexp/.test(c))) return "string";
    if (classes.some((c) => /number|symbol/.test(c))) return "number";
    if (classes.some((c) => /title/.test(c))) return "title";
    if (classes.some((c) => /type|built_in/.test(c))) return "type";
    if (classes.some((c) => /attr|property|attribute/.test(c))) return "property";
    return inherited;
};
/** Consume text from HAST only. No HTML, styles, links or executable code is used. */
interface TokenTree { type: string; value?: unknown; properties?: { className?: unknown }; children?: TokenTree[] }
export function codeTokensFromTree(tree: unknown): CodeLine[] {
    const lines: CodeLine[] = [[]]; let count = 0;
    function walk(node: TokenTree, tone: CodeTone, depth: number) {
        if (++count > 50_000 || depth > 64) throw new Error("Syntax tree exceeds the rendering limit. Try plain text or a smaller sample.");
        if (node.type === "text" && typeof node.value === "string") {
            const parts = node.value.split("\n");
            parts.forEach((part: string,index: number) => { if (index) lines.push([]); if (part) lines[lines.length - 1].push({text:part,tone}); });
        } else if (Array.isArray(node.children)) {
            const classes = node.properties?.className;
            const next = role(Array.isArray(classes) ? classes.filter((value): value is string => typeof value === "string") : [],tone); node.children.forEach((child) => walk(child,next,depth + 1));
        }
    }
    walk(tree as TokenTree,"plain",0); return lines;
}
export function plainCodeLines(source: string): CodeLine[] { return source.split("\n").map((text) => text ? [{ text,tone:"plain" }] : []); }
export interface CodeRenderLine { sourceLine: number; continuation: boolean; tokens: CodeLine }
/** Tabs align with four-column stops in the source; wrap uses measured glyph widths. */
export function layoutCodeLines(lines: CodeLine[], measure: (text:string) => number, width: number, wrap: boolean): CodeRenderLine[] {
    if (!Number.isFinite(width) || width <= 0) throw new Error("Code width must be positive.");
    const output: CodeRenderLine[] = [];
    const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter(undefined,{granularity:"grapheme"}) : null;
    lines.forEach((line,index) => {
        let row: CodeRenderLine = { sourceLine:index + 1,continuation:false,tokens:[] }, column = 0, used = 0;
        output.push(row);
        for (const token of line) {
            const expanded = token.text.replace(/\t|[^\t]+/g,(part) => { if (part === "\t") { const spaces = 4 - column % 4; column += spaces; return " ".repeat(spaces); } column += Array.from(part).length; return part; });
            const characters = segmenter ? Array.from(segmenter.segment(expanded),(item) => item.segment) : Array.from(expanded);
            for (const character of characters) {
                const size = measure(character);
                if (!wrap && used + size > width + .1) throw new Error(`Line ${index + 1} exceeds the image width. Enable line wrapping, increase width or reduce font size.`);
                if (wrap && used && used + size > width) { row = {sourceLine:index + 1,continuation:true,tokens:[]};output.push(row);used = 0; }
                if (size > width) throw new Error("A glyph exceeds the available code width. Increase the image width.");
                const previous = row.tokens[row.tokens.length - 1]; if (previous?.tone === token.tone) previous.text += character; else row.tokens.push({text:character,tone:token.tone}); used += size;
                if (output.length > 700) throw new Error("The image would exceed 700 visual lines. Increase width or shorten the sample.");
            }
        }
    });
    return output;
}

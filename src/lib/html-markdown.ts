/** Parse in a pure JavaScript DOM, never a native document which could fetch
 * an image/iframe while parsing. Do not execute scripts or keep active markup. */
async function inertDocument(html: string) {
    if (html.length > 1024 * 1024) throw new Error("HTML/Markdown conversion limit is 1 MiB.");
    const { createDocument } = await import("@mixmark-io/domino");
    const document = createDocument(html);
    for (const element of Array.from(document.querySelectorAll("script,style,iframe,object,embed,link,meta,base,form,button,textarea,select,svg,math"))) element.parentNode?.removeChild(element);
    for (const element of Array.from(document.querySelectorAll("input"))) { if (element.getAttribute("type") !== "checkbox") element.parentNode?.removeChild(element); else element.setAttribute("disabled", ""); }
    for (const element of Array.from(document.querySelectorAll("*"))) {
        for (const attribute of Array.from(element.attributes)) {
            const name = attribute.name.toLowerCase();
            if (!["href", "src", "alt", "title", "class", "colspan", "rowspan", "align", "start", "type", "checked", "disabled"].includes(name)) element.removeAttribute(attribute.name);
        }
        for (const attribute of ["href", "src"]) {
            const value = element.getAttribute(attribute);
            if (!value) continue;
            try {
                const url = new URL(value, "https://relative.invalid/");
                const allowedData = attribute === "src" && /^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/i.test(value);
                if (!(["https:", "http:"].includes(url.protocol) || (attribute === "href" && ["mailto:", "tel:"].includes(url.protocol)) || allowedData)) element.removeAttribute(attribute);
            } catch { element.removeAttribute(attribute); }
        }
    }
    return document;
}
export async function htmlToMarkdown(html: string): Promise<string> {
    const [document, { default: TurndownService }, { gfm }] = await Promise.all([inertDocument(html), import("turndown"), import("turndown-plugin-gfm")]);
    const service = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
    service.use(gfm);
    return service.turndown(document.body);
}
export async function markdownToHtmlDocument(markdown: string): Promise<string> {
    if (markdown.length > 1024 * 1024) throw new Error("HTML/Markdown conversion limit is 1 MiB.");
    const { marked } = await import("marked");
    const document = await inertDocument(marked.parse(markdown, { async: false, gfm: true }));
    return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>Markdown document</title><style>body{max-width:76ch;margin:40px auto;padding:0 20px;font:16px/1.7 system-ui,sans-serif;color:#172033;background:#fff}pre{overflow:auto;padding:16px;background:#f1f5f9}code{font-family:monospace}table{border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:8px}img{max-width:100%}a{color:#075985}</style></head><body>${document.body.innerHTML}</body></html>`;
}

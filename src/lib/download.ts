// Shared browser download helper — Blob + object URL + synthetic anchor click.

export function downloadBytes(bytes: Uint8Array, filename: string, mime = "application/octet-stream") {
    const blob = new Blob([new Uint8Array(bytes)], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function downloadText(text: string, filename: string, mime = "text/plain") {
    downloadBytes(new TextEncoder().encode(text), filename, mime);
}

export function downloadBlob(contents: BlobPart, filename: string, type = "text/plain;charset=utf-8") {
    const blob = contents instanceof Blob ? contents : new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.replace(/[\\/\x00-\x1f]/g, "_");
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadBytes(bytes: Uint8Array, filename: string, mime = "application/octet-stream") {
    downloadBlob(new Uint8Array(bytes).buffer, filename, mime);
}

export function downloadText(text: string, filename: string, mime = "text/plain") {
    downloadBlob(text, filename, mime);
}

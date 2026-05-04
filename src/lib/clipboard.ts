import { messageService } from "@/lib/messageService";

function fallbackCopy(text: string) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
}

export async function copyToClipboard(text: string, label?: string) {
    try {
        if (navigator.clipboard && globalThis.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            fallbackCopy(text);
        }
        messageService.success(label ?? "Copied!");
    } catch {
        try {
            fallbackCopy(text);
            messageService.success(label ?? "Copied!");
        } catch {
            messageService.error("Copy failed — please copy manually");
        }
    }
}

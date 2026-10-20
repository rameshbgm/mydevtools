import { messageService } from "@/lib/messageService";
import { translate } from "@/lib/i18n/catalog";
import { readLanguage } from "@/lib/i18n/preference";

function fallbackCopy(text: string) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
        if (!document.execCommand("copy")) throw new Error("Copy was rejected.");
    } finally { textarea.remove(); }
}

export async function copyToClipboard(text: string, label?: string) {
    try {
        if (navigator.clipboard && globalThis.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            fallbackCopy(text);
        }
        messageService.success(label ?? translate(readLanguage(), "Copied!"));
        return true;
    } catch {
        try {
            fallbackCopy(text);
            messageService.success(label ?? translate(readLanguage(), "Copied!"));
            return true;
        } catch {
            messageService.error(translate(readLanguage(), "Copy failed — please copy manually"));
            return false;
        }
    }
}

import { useSyncExternalStore } from "react";

/**
 * Chromium `beforeinstallprompt`; capture early so Strict Mode effect cleanup cannot drop the listener
 * before the event fires once.
 */
export type BeforeInstallPromptEventChrome = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstallPromptEventChrome | null = null;
const listeners = new Set<() => void>();

function notify() {
    for (const cb of listeners) cb();
}

function onBeforeInstallPrompt(e: Event) {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEventChrome;
    notify();
}

let listenerAttached = false;

/** Run once per tab as soon as this module loads on the client. */
function ensureCaptureInstalled() {
    if (typeof window === "undefined" || listenerAttached) return;
    listenerAttached = true;
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
}

ensureCaptureInstalled();

export function getDeferredPwaInstallPrompt(): BeforeInstallPromptEventChrome | null {
    return deferred;
}

export function subscribePwaInstallPrompt(onStoreChange: () => void): () => void {
    listeners.add(onStoreChange);
    return () => listeners.delete(onStoreChange);
}

export function useHasDeferredPwaInstallPrompt(): boolean {
    return useSyncExternalStore(
        subscribePwaInstallPrompt,
        () => deferred !== null,
        () => false
    );
}

/**
 * Opens the OS/browser install sheet when a deferred prompt exists (same as the omnibox install control).
 * Returns whether a prompt was shown.
 */
export async function triggerPwaInstallPrompt(): Promise<boolean> {
    if (!deferred) return false;
    const ev = deferred;
    deferred = null;
    notify();
    try {
        await ev.prompt();
        await ev.userChoice;
        return true;
    } catch {
        return false;
    }
}

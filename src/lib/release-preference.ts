/** A device preference shared across projects; no tool data is stored here. */
import { APP_VERSION } from "./app-version";
export const SEEN_RELEASE_KEY = "mydevtools-seen-release-v1";
const CHANGE_EVENT = "mydevtools:release-seen";
let sessionSeenRelease: string | null | undefined;

export function seenRelease(): string | null {
    if (sessionSeenRelease !== undefined) return sessionSeenRelease;
    try { return window.localStorage.getItem(SEEN_RELEASE_KEY); }
    catch { return null; }
}

export function markReleaseSeen(version: string): void {
    try {
        window.localStorage.setItem(SEEN_RELEASE_KEY, version);
        sessionSeenRelease = undefined;
    }
    catch { sessionSeenRelease = version; }
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToSeenRelease(listener: () => void): () => void {
    const syncAttribute = () => { document.documentElement.dataset.releaseSeen = seenRelease() === APP_VERSION ? "true" : "false"; };
    const notify = () => { syncAttribute(); listener(); };
    syncAttribute();
    const onStorage = (event: StorageEvent) => {
        if (event.key === SEEN_RELEASE_KEY || event.key === null) {
            sessionSeenRelease = undefined;
            notify();
        }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, notify);
    return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(CHANGE_EVENT, notify);
    };
}

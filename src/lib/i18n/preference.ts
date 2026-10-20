import { LANGUAGE_KEY, validLanguage, type Language } from "./catalog";
const CHANGED = "mydevtools-language-changed";
let sessionLanguage: Language | undefined;
export function readLanguage(): Language {
    if (sessionLanguage) return sessionLanguage;
    try { return validLanguage(window.localStorage.getItem(LANGUAGE_KEY)); } catch { return "en"; }
}
export function writeLanguage(language: Language): boolean {
    sessionLanguage = validLanguage(language);
    let persisted = true;
    try { window.localStorage.setItem(LANGUAGE_KEY, sessionLanguage); sessionLanguage = undefined; } catch { persisted = false; }
    window.dispatchEvent(new Event(CHANGED));
    return persisted;
}
export function subscribeLanguage(listener: () => void): () => void {
    const storage = (event: StorageEvent) => { if (event.key === LANGUAGE_KEY || event.key === null) { sessionLanguage = undefined; listener(); } };
    window.addEventListener("storage", storage);
    window.addEventListener(CHANGED, listener);
    return () => { window.removeEventListener("storage", storage); window.removeEventListener(CHANGED, listener); };
}

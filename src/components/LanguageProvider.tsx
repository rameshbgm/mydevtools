"use client";
import { createContext, useContext, useLayoutEffect, useMemo, useState, useSyncExternalStore } from "react";
import { translate, type Language } from "@/lib/i18n/catalog";
import { readLanguage, subscribeLanguage, writeLanguage } from "@/lib/i18n/preference";

const englishSnapshot = (): Language => "en";
type LanguageContextValue = { language: Language; direction: "ltr" | "rtl"; t: (source: string, values?: Record<string, string | number>) => string; setLanguage: (language: Language) => void; persistenceError: boolean };
const LanguageContext = createContext<LanguageContextValue>({ language: "en", direction: "ltr", t: (source, values) => translate("en", source, values), setLanguage: () => {}, persistenceError: false });
export default function LanguageProvider({ children }: { children: React.ReactNode }) {
    const language = useSyncExternalStore(subscribeLanguage, readLanguage, englishSnapshot);
    const [persistenceError, setPersistenceError] = useState(false);
    const direction = language === "ar" ? "rtl" : "ltr";
    useLayoutEffect(() => { document.documentElement.lang = language; document.documentElement.dir = direction; }, [language, direction]);
    const value = useMemo<LanguageContextValue>(() => ({ language, direction, persistenceError, t: (source, values) => translate(language, source, values), setLanguage: (next) => setPersistenceError(!writeLanguage(next)) }), [language, direction, persistenceError]);
    // No locale key, navigation or remount: input and editor state stays alive.
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }

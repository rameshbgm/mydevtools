"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
export default function WorkspaceModeToggle() {
    const { t } = useLanguage();
    const [focused, setFocused] = useState(true);
    useEffect(() => { setFocused(document.documentElement.dataset.workspaceMode === "focused"); }, []);
    return <div className="wb-workspace-view-control"><button type="button" aria-pressed={focused} onClick={() => {
        const next = !focused; setFocused(next); document.documentElement.dataset.workspaceMode = next ? "focused" : "full";
        try { localStorage.setItem("mydevtools-workspace-mode", next ? "focused" : "full"); } catch { /* Session-only preference. */ }
    }}>{t(focused ? "Show introduction" : "Use compact workspace")}</button><a href="/guides">{t("Debugging guides")}</a></div>;
}

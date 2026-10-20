"use client";

import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useLanguage } from "./LanguageProvider";
import {
    triggerPwaInstallPrompt,
    useHasDeferredPwaInstallPrompt,
} from "@/lib/pwa-install-prompt";

/**
 * Compact "Install app" button. Renders only when the browser has fired
 * `beforeinstallprompt` (i.e. the OS/browser thinks the app is installable
 * and the user hasn't already installed it).
 *
 * Auto-hides itself in display-mode `standalone` (already running as PWA)
 * even if a stale prompt is still hanging around.
 */
export default function PwaInstallButton({ compact = false }: { compact?: boolean }) {
    const { t } = useLanguage();
    const hasPrompt = useHasDeferredPwaInstallPrompt();
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const m = window.matchMedia("(display-mode: standalone)");
        setIsStandalone(m.matches);
        const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
        m.addEventListener?.("change", handler);
        return () => m.removeEventListener?.("change", handler);
    }, []);

    if (!hasPrompt || isStandalone) return null;

    const onClick = async () => { await triggerPwaInstallPrompt(); };

    if (compact) {
        return (
            <Tooltip title={t("Install mydevtools as an app")}>
                <Button size="small" icon={<DownloadOutlined />} onClick={onClick} />
            </Tooltip>
        );
    }
    return (
        <Button size="small" icon={<DownloadOutlined />} onClick={onClick}>
            {t("Install app")}
        </Button>
    );
}

"use client";

import "@/lib/pwa-install-prompt";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export default function PwaRegister() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [update, setUpdate] = useState<ServiceWorker | null>(null);
    useEffect(() => {
        if (process.env.NODE_ENV !== "production" || !/^https?:$/.test(location.protocol) || !("serviceWorker" in navigator)) return;
        let disposed = false;
        const register = async () => {
            try {
                const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
                const check = () => { if (!disposed && registration.waiting && navigator.serviceWorker.controller) setUpdate(registration.waiting); };
                check();
                registration.addEventListener("updatefound", () => registration.installing?.addEventListener("statechange", check));
            } catch { /* Offline and storage restrictions must not prevent normal app use. */ }
        };
        void register();
        const offlineNavigation = (event: MouseEvent) => {
            if (navigator.onLine || event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const anchor = (event.target as Element)?.closest("a");
            if (!anchor || anchor.target || anchor.download || !anchor.href) return;
            const url = new URL(anchor.href);
            if (url.origin === location.origin && url.pathname !== location.pathname && !url.search) {
                event.preventDefault(); event.stopPropagation(); location.assign(url.href);
            }
        };
        document.addEventListener("click", offlineNavigation, true);
        return () => { disposed = true; document.removeEventListener("click", offlineNavigation, true); };
    }, []);
    useEffect(() => {
        if (process.env.NODE_ENV !== "production" || !/^https?:$/.test(location.protocol) || !("serviceWorker" in navigator)) return;
        let active = true;
        navigator.serviceWorker.ready.then((registration) => { if (active) registration.active?.postMessage({ type: "CACHE_PUBLIC_PAGE", path: pathname, assets: [...Array.from(document.scripts, (script) => script.src), ...Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'), (link) => link.href), ...performance.getEntriesByType("resource").map((entry) => entry.name)] }); });
        return () => { active = false; };
    }, [pathname]);
    if (!update) return null;
    return <div role="status" className="wb-update-notice">{t("An app update is ready.")} <button type="button" onClick={() => {
        navigator.serviceWorker.addEventListener("controllerchange", () => location.reload(), { once: true });
        update.postMessage({ type: "ACTIVATE_UPDATE" });
    }}>{t("Reload to update")}</button><button type="button" onClick={() => setUpdate(null)}>{t("Later")}</button></div>;
}

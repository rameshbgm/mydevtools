"use client";

import "@/lib/pwa-install-prompt";
import { useEffect } from "react";

export default function PwaRegister() {
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (process.env.NODE_ENV !== "production") return;
        if (!("serviceWorker" in navigator)) return;

        const onLoad = () => {
            navigator.serviceWorker
                .register("/sw.js", { scope: "/" })
                .catch(() => {
                    // silent — SW registration failure is non-fatal
                });
        };
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
    }, []);

    return null;
}

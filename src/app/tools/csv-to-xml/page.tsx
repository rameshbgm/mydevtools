"use client";

import { useLanguage } from "@/components/LanguageProvider";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toolPathFromId } from "@/lib/category-routes";

export default function CsvToXmlRedirect() {
    const { t } = useLanguage();
    const router = useRouter();

    useEffect(() => {
        const p = toolPathFromId("csv-to-json");
        if (p) router.replace(`${p}?format=xml`);
    }, [router]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <p>{t("Redirecting to CSV Converter...")}</p>
        </div>
    );
}

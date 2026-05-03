"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toolPathFromId } from "@/lib/category-routes";

export default function CsvToXmlRedirect() {
    const router = useRouter();

    useEffect(() => {
        const p = toolPathFromId("csv-to-json");
        if (p) router.replace(`${p}?format=xml`);
    }, [router]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <p>Redirecting to CSV Converter...</p>
        </div>
    );
}

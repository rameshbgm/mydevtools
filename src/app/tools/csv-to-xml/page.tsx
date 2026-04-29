"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CsvToXmlRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the combined CSV converter with XML format
        router.replace("/tools/csv-to-json?format=xml");
    }, [router]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <p>Redirecting to CSV Converter...</p>
        </div>
    );
}

import { Metadata } from "next";
import { ReactNode } from "react";
import { generateToolMetadata, generateToolStructuredData } from "@/lib/metadata-generator";

export async function generateMetadata(): Promise<Metadata> {
    return generateToolMetadata({ toolId: "json-formatter" });
}

export default function Layout({ children }: { children: ReactNode }) {
    const structuredData = generateToolStructuredData("json-formatter");
    return (
        <>
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            )}
            {children}
        </>
    );
}

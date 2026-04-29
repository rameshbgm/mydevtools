import { Metadata } from "next";
import { ReactNode } from "react";
import { generateToolMetadata, generateToolStructuredData } from "@/lib/metadata-generator";

export async function generateMetadata(): Promise<Metadata> {
    return generateToolMetadata({ toolId: "swagger-ui" });
}

export default function Layout({ children }: { children: ReactNode }) {
    const structuredData = generateToolStructuredData("swagger-ui");
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

import { Metadata } from "next";
import { ReactNode } from "react";
import { generateToolMetadata, generateToolStructuredData } from "@/lib/metadata-generator";

export async function generateMetadata(): Promise<Metadata> {
    return generateToolMetadata({ toolId: "color-palette-extractor" });
}

export default function Layout({ children }: { children: ReactNode }) {
    const structuredData = generateToolStructuredData("color-palette-extractor");
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

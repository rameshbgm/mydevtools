import { Metadata } from "next";
import { ReactNode } from "react";
import { generateToolMetadata, generateToolStructuredData } from "@/lib/metadata-generator";

export async function generateMetadata(): Promise<Metadata> {
    return generateToolMetadata({ toolId: "key-pair-generator" });
}

export default function Layout({ children }: { children: ReactNode }) {
    const structuredData = generateToolStructuredData("key-pair-generator");
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

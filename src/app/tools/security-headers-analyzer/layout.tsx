import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generateToolMetadata, generateToolStructuredData } from "@/lib/metadata-generator";

export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata({ toolId: "security-headers-analyzer" }); }
export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
    const structuredData = generateToolStructuredData("security-headers-analyzer");
    return <>{structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />}{children}</>;
}

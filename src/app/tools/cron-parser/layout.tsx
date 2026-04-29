import { Metadata } from "next";
import { ReactNode } from "react";

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = "https://devtools-hub.com";
    const toolName = "Cron Expression Parser";
    const description = "Parse, validate and explain cron expressions with next run times";
    const toolId = "cron-parser";
    const category = "Text & Utilities";
    const tags = ["cron", "schedule", "job", "timer", "parse", "expression"];
    const pageUrl = `${baseUrl}/tools/${toolId}`;
    const ogImage = `${baseUrl}/og-image.png`;

    return {
        title: `${toolName} - mydevtools`,
        description,
        keywords: [toolName, category, ...tags, "developer tools", "open source"].join(", "),
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title: `${toolName} - mydevtools`,
            description,
            url: pageUrl,
            type: "website",
            images: [{
                url: ogImage,
                width: 1200,
                height: 630,
                alt: toolName,
            }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${toolName} - mydevtools`,
            description,
            images: [ogImage],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}

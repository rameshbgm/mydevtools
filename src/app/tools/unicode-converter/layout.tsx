import { Metadata } from "next";
import { ReactNode } from "react";

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = "https://devtools-hub.com";
    const toolName = "Unicode Converter";
    const description = "Convert text to/from Unicode escape sequences, code points, and UTF-8 hex";
    const toolId = "unicode-converter";
    const category = "Encoding & Decoding";
    const tags = ["unicode", "utf8", "escape", "codepoint", "text"];
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

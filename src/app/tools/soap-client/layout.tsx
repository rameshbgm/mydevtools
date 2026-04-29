import { Metadata } from "next";
import { ReactNode } from "react";

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = "https://devtools-hub.com";
    const toolName = "SOAP Client";
    const description = "Test SOAP web services by sending requests and viewing responses";
    const toolId = "soap-client";
    const category = "API & Web Services";
    const tags = ["soap", "wsdl", "xml", "webservice", "test", "api"];
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

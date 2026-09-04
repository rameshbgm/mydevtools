import { Metadata } from "next";
import { getSeoContent, SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./seo-content";
import { toolPathFromId } from "./category-routes";
import { TOOL_ID_TO_CATEGORY } from "./tool-url-table";

interface ToolMetadataParams {
    toolId: string;
}

export function generateToolMetadata(params: ToolMetadataParams): Metadata {
    const { toolId } = params;
    const seo = getSeoContent(toolId);
    const category = TOOL_ID_TO_CATEGORY[toolId as keyof typeof TOOL_ID_TO_CATEGORY];

    const fallbackTitle = toolId ? `${toolId} — ${SITE_NAME}` : SITE_NAME;
    const fallbackDescription = SITE_DESCRIPTION;
    const fallbackKeywords: string[] = [];

    const title = seo?.title ?? fallbackTitle;
    const description = seo?.description ?? fallbackDescription;
    const keywords = seo?.keywords ?? fallbackKeywords;

    const canon = toolPathFromId(toolId);
    const pageUrl = `${SITE_URL}${canon ?? `/tools/${toolId}`}`;
    const ogImage = `${SITE_URL}/og-image.png`;

    return {
        title,
        description,
        keywords: keywords.join(", "),
        authors: [{ name: SITE_NAME }],
        creator: SITE_NAME,
        publisher: SITE_NAME,
        applicationName: SITE_NAME,
        category: category ?? "Developer Tools",
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: SITE_NAME,
            type: "website",
            locale: "en_US",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
            creator: "@mydevtools",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

export function generateToolStructuredData(toolId: string) {
    const seo = getSeoContent(toolId);
    const category = TOOL_ID_TO_CATEGORY[toolId as keyof typeof TOOL_ID_TO_CATEGORY];
    if (!category) return null;

    const canon = toolPathFromId(toolId);
    const pageUrl = `${SITE_URL}${canon ?? `/tools/${toolId}`}`;
    const description = seo?.description ?? SITE_DESCRIPTION;
    const name = seo?.title?.split(" — ")[0]?.split(" | ")[0] ?? toolId;

    const data: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        alternateName: toolId,
        description,
        url: pageUrl,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: category,
        keywords: (seo?.keywords ?? []).join(", "),
        operatingSystem: "Any (Web Browser)",
        browserRequirements: "Requires JavaScript. Requires a modern browser.",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        author: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
        },
        publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
        },
        isAccessibleForFree: true,
        inLanguage: "en",
    };

    if (seo?.faq && seo.faq.length > 0) {
        data.mainEntity = {
            "@type": "FAQPage",
            mainEntity: seo.faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: item.a,
                },
            })),
        };
    }

    return data;
}

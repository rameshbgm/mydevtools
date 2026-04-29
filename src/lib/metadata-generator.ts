import { Metadata } from "next";

interface ToolMetadataParams {
  toolName: string;
  toolId: string;
  description: string;
  category: string;
  tags: string[];
}

export function generateToolMetadata(params: ToolMetadataParams): Metadata {
  const {
    toolName,
    toolId,
    description,
    category,
    tags,
  } = params;

  const baseUrl = "https://devtools-hub.com";
  const pageUrl = `${baseUrl}/tools/${toolId}`;
  const ogImage = `${baseUrl}/og-image.png`;

  const keywords = [
    toolName,
    category,
    ...tags,
    "developer tools",
    "open source",
    "free tools",
  ].filter(Boolean);

  return {
    title: `${toolName} - mydevtools`,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${toolName} - mydevtools`,
      description,
      url: pageUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: toolName,
        },
      ],
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

export function generateToolStructuredData(params: ToolMetadataParams) {
  const {
    toolName,
    toolId,
    description,
    category,
    tags,
  } = params;

  const baseUrl = "https://devtools-hub.com";
  const pageUrl = `${baseUrl}/tools/${toolId}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolName,
    description,
    url: pageUrl,
    applicationCategory: category,
    keywords: tags.join(", "),
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "mydevtools Community",
    },
    isAccessibleForFree: true,
  };
}

import type { Metadata, Viewport } from "next";
import { IBM_Plex_Serif, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import PwaRegister from "@/components/PwaRegister";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/seo-content";
import { toolsRegistry } from "@/lib/tools-registry";

const plexSerif = IBM_Plex_Serif({
    variable: "--font-plex-serif",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
    variable: "--font-plex-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
    variable: "--font-plex-mono",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
    width: "device-width",
    initialScale: 1,
};

const SITE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        "developer tools",
        "online developer tools",
        "free developer tools",
        "json formatter",
        "regex tester",
        "base64 encoder",
        "jwt decoder",
        "uuid generator",
        "qr code generator",
        "api tester",
        "ssl checker",
        "private developer tools",
        "client-side developer tools",
        "browser developer tools",
        "no signup developer tools",
    ].join(", "),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    applicationName: SITE_NAME,
    category: "Developer Tools",
    alternates: { canonical: SITE_URL },
    openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        siteName: SITE_NAME,
        type: "website",
        locale: "en_US",
        images: [
            {
                url: `${SITE_URL}/og-image.png`,
                width: 1200,
                height: 630,
                alt: SITE_NAME,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [`${SITE_URL}/og-image.png`],
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
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
            { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: [
            { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
        capable: true,
        title: SITE_NAME,
        statusBarStyle: "black-translucent",
    },
    formatDetection: {
        telephone: false,
        email: false,
        address: false,
    },
};

const SITE_STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
    },
    potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
    },
};

const ORG_STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    description: SITE_DESCRIPTION,
    sameAs: [
        "https://github.com/rameshbgm/mydevtools",
    ],
};

const COLLECTION_STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE_NAME} — All Developer Tools`,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    hasPart: toolsRegistry.map((t) => ({
        "@type": "SoftwareApplication",
        name: t.name,
        url: `${SITE_URL}/tools/${t.id}`,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: t.category,
    })),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${plexSerif.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_STRUCTURED_DATA) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_STRUCTURED_DATA) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_STRUCTURED_DATA) }}
                />
            </head>
            <body className="min-h-full flex flex-col">
                <PwaRegister />
                <AppShell>{children}</AppShell>
            </body>
        </html>
    );
}

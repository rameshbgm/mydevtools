import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import "./workspace.css";
import AppShell from "@/components/AppShell";
import PwaRegister from "@/components/PwaRegister";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/seo-content";
import { SEO_CONTENT } from "@/lib/seo-content";
import { toolPathFromId } from "@/lib/category-routes";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const fraunces = Fraunces({
    variable: "--font-fraunces",
    subsets: ["latin"],
    axes: ["SOFT", "WONK", "opsz"],
});

/** Hero wordmark (“My Dev Tools”): Sora — geometric / tech-forward, distinct from Geist */
const landingDisplay = Sora({
    variable: "--font-landing-display",
    subsets: ["latin"],
    weight: ["600", "700", "800"],
});

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
    width: "device-width",
    initialScale: 1,
};

const SITE_TITLE = `${SITE_NAME}: ${SITE_TAGLINE}`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        // Core brand
        "developer tools online",
        "free developer tools",
        "online developer tools",
        "browser developer tools",
        "client-side developer tools",
        "no signup developer tools",
        "private developer tools",
        // Formatters & validators
        "json formatter online",
        "xml formatter",
        "sql formatter",
        "json validator",
        "regex tester online",
        // Encoding & crypto
        "base64 encoder decoder",
        "jwt decoder online",
        "hash generator",
        "aes encrypt online",
        "url encoder decoder",
        // Generators & converters
        "uuid generator",
        "qr code generator",
        "json to csv converter",
        "xml to json converter",
        "yaml to json",
        // Certificates & network
        "ssl certificate checker",
        "x509 certificate decoder",
        "subnet calculator",
        "ip address tools",
        // API & AI tools
        "api request builder",
        "swagger ui viewer",
        "mcp inspector",
        "a2a inspector",
        // Fun & productivity
        "typing speed test",
        "pomodoro timer online",
        "spin the wheel online",
        "sticky notes browser",
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

const PLATFORM_STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: "121 free developer tools in one place — format, validate, convert, encode, decode, generate, inspect and test. Most tools run locally; selected network tools use clearly disclosed managed routes.",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Developer Productivity",
    operatingSystem: "Any (Web Browser)",
    browserRequirements: "Requires JavaScript. Works in all modern browsers.",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
    featureList: [
        "JSON, XML, SQL, HTML, CSS, YAML formatters",
        "JWT decoder and generator",
        "Base64, URL, Unicode encoding/decoding",
        "AES, HMAC, BCrypt cryptography tools",
        "X.509 certificate inspector and decoder",
        "MCP and A2A protocol inspectors",
        "UUID, QR code, password generators",
        "Regex tester with match highlighting",
        "REST API request builder",
        "Typing speed test (WPM)",
        "Countdown timer and stopwatch",
        "Spin the wheel random picker",
    ],
    author: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
    },
    isAccessibleForFree: true,
    inLanguage: "en",
};

const SITE_FAQ_STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "Is mydevtools really free?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, 100% free. No signup, no credit card, no premium tier. All 121 tools are permanently free.",
            },
        },
        {
            "@type": "Question",
            name: "Does my data leave my browser?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Most tools run entirely in your browser. Network features such as server proxying, certificate fetching, and webhook capture clearly disclose when data is sent to a managed server route.",
            },
        },
        {
            "@type": "Question",
            name: "Can I use mydevtools offline?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. mydevtools is a Progressive Web App (PWA) and can be installed on any device. Once installed, a service worker caches the app so it works without an internet connection.",
            },
        },
        {
            "@type": "Question",
            name: "How many tools does mydevtools have?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "mydevtools has 121 tools across 15 categories: Formatters, Validators, Diff & Compare, Data Converters, Encoding & Decoding, Cryptography, Certificates & Keys, API & Web Services, Artificial Intelligence, Network, Generators, Image & Media, Fun & Games, Text & Utilities, and Reference.",
            },
        },
        {
            "@type": "Question",
            name: "Does mydevtools work on mobile?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Every tool is designed to be mobile-responsive and adapts to phone, tablet and desktop screen sizes. You can also install it as a PWA on iOS and Android.",
            },
        },
    ],
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
    name: `${SITE_NAME}: All Developer Tools`,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    hasPart: Object.entries(SEO_CONTENT).flatMap(([toolId, seo]) => {
        const path = toolPathFromId(toolId);
        if (!path) return [];
        return [{
            "@type": "SoftwareApplication",
            name: seo.h1 ?? seo.title.split(" — ")[0],
            url: `${SITE_URL}${path}`,
            applicationCategory: "DeveloperApplication",
        }];
    }),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${landingDisplay.variable} h-full antialiased`}
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
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(PLATFORM_STRUCTURED_DATA) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_FAQ_STRUCTURED_DATA) }}
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

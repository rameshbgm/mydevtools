import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./workspace.css";
import AppShell from "@/components/AppShell";
import LanguageProvider from "@/components/LanguageProvider";
import PwaRegister from "@/components/PwaRegister";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/seo-content";
import toolsRegistry from "@/lib/public-tool-catalog.json";
import { APP_VERSION } from "@/lib/app-version";
import { SEEN_RELEASE_KEY } from "@/lib/release-preference";

const geistSans = localFont({ src: "./fonts/geist.woff2", variable: "--font-geist-sans", weight: "100 900", display: "swap" });
const geistMono = localFont({ src: "./fonts/geist-mono.woff2", variable: "--font-geist-mono", weight: "100 900", display: "swap", preload: false });
const landingDisplay = localFont({ src: "./fonts/sora.woff2", variable: "--font-landing-display", weight: "100 800", display: "swap" });

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
    description: `${toolsRegistry.length} developer tools to format, validate, convert, inspect and debug. Local tools process on your device; network tools disclose their connection boundary.`,
    softwareVersion: APP_VERSION,
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

const ORG_STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
    description: SITE_DESCRIPTION,
    sameAs: [
        "https://github.com/rameshbgm/mydevtools",
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            data-workspace-mode="focused"
            className={`${geistSans.variable} ${geistMono.variable} ${landingDisplay.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <head>
                <link rel="describedby" href="/llms.txt" type="text/plain" />
                <link rel="describedby" href="/tool-catalog.md" type="text/markdown" title="Developer tool catalog" />
                <link rel="describedby" href="/agents.json" type="application/json" title="Machine-readable tool catalog" />
                <script dangerouslySetInnerHTML={{ __html: "try{var l=localStorage.getItem('mydevtools-language');l=['en','hi','es','fr','de','ja','zh','ar'].includes(l)?l:'en';document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'}catch{}" }} />
                <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.releaseSeen=localStorage.getItem(${JSON.stringify(SEEN_RELEASE_KEY)})===${JSON.stringify(APP_VERSION)}?'true':'false'}catch{}` }} />
                <script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.workspaceMode=localStorage.getItem('mydevtools-workspace-mode')==='full'?'full':'focused';var p=JSON.parse(localStorage.getItem('devtools-hub-storage')||'{}');var d=p.state?.darkMode===true;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch{}" }} />
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
            </head>
            <body className="min-h-full flex flex-col">
                <LanguageProvider><PwaRegister /><AppShell>{children}</AppShell></LanguageProvider>
            </body>
        </html>
    );
}

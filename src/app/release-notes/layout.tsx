import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/seo-content";
import { APP_VERSION } from "@/lib/app-version";
export const metadata: Metadata = {
    title: `Release Notes — Version ${APP_VERSION}`,
    description: "Read the current release, new tools, workspace improvements and documented limitations.",
    alternates: { canonical: `${SITE_URL}/release-notes`, types: { "text/markdown": `${SITE_URL}/release-notes.md` } },
    openGraph: { title: `My Dev Tools ${APP_VERSION} release notes`, description: "New tools and workspace improvements.", url: `${SITE_URL}/release-notes` },
};
export default function ReleaseNotesLayout({ children }: { children: ReactNode }) { return children; }

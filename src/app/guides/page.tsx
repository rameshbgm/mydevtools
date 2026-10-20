import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo-content";
import DebuggingGuides from "@/components/DebuggingGuides";
export const metadata: Metadata = {
    title: "Developer Debugging Guides", description: "Reproduce CORS, webhook, protocol and schema problems with public fixtures and expected results.",
    alternates: { canonical: `${SITE_URL}/guides`, types: { "text/markdown": `${SITE_URL}/guides.md` } },
    openGraph: { title: "Developer Debugging Guides", description: "Public fixtures, expected results and primary references.", url: `${SITE_URL}/guides` },
};
export default function GuidesPage() {
    return <DebuggingGuides />;
}

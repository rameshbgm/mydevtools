"use client";

import { useAppStore } from "@/lib/store";
import { toolsRegistry, getToolsByCategory } from "@/lib/tools-registry";
import { toolPath } from "@/lib/category-routes";
import { SITE_URL } from "@/lib/seo-content";
import LandingMarketing from "@/components/LandingMarketing";
import SignalCatalog from "@/components/SignalCatalog";

export default function Dashboard() {
    const darkMode = useAppStore(s => s.darkMode);
    const addRecentTool = useAppStore(s => s.addRecentTool);
    return (
        <div className="landing-page-shell" style={{ width: "100%", minWidth: 0 }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org", "@type": "CollectionPage", name: "My Dev Tools catalog", url: SITE_URL,
                mainEntity: { "@type": "ItemList", numberOfItems: toolsRegistry.length, itemListElement: toolsRegistry.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: `${SITE_URL}${toolPath(tool)}` })) },
            }).replace(/</g, "\u003c") }} />
            <LandingMarketing darkMode={darkMode} stats={{ total: toolsRegistry.length, categories: getToolsByCategory().size }}
                onToolClick={addRecentTool}><SignalCatalog /></LandingMarketing>
        </div>
    );
}

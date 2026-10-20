"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toolsRegistry, getToolsByCategory, CATEGORY_COLORS, CATEGORY_DESCRIPTIONS, type ToolCategory } from "@/lib/tools-registry";
import { dashboardCategoryHashId, toolPath } from "@/lib/category-routes";
import { useAppStore } from "@/lib/store";
import { BOUNDARY_LABELS, dataBoundaryForTool } from "@/lib/data-boundaries";
import { matchesToolQuery } from "@/lib/tool-search";
import WorkspaceModeToggle from "@/components/WorkspaceModeToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { SITE_URL } from "@/lib/seo-content";
import LandingMarketing from "@/components/LandingMarketing";

export default function Dashboard() {
    const { language, t } = useLanguage();
    const darkMode = useAppStore((s) => s.darkMode);
    const addRecentTool = useAppStore((s) => s.addRecentTool);
    const [search, setSearch] = useState("");
    const categorized = useMemo(() => getToolsByCategory(), []);
    useEffect(() => {
        const query = new URLSearchParams(window.location.search).get("q");
        if (query) { setSearch(query); document.getElementById("landing-full-catalog")?.scrollIntoView(); }
    }, []);
    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return [...categorized.entries()].map(([category, tools]) => [category,
            tools.filter((tool) => matchesToolQuery(tool, query, language)),
        ] as const).filter(([, tools]) => tools.length);
    }, [search, categorized, language]);
    const count = filtered.reduce((n, [, tools]) => n + tools.length, 0);
    return (
        <div className="landing-page-shell" style={{ width: "100%", minWidth: 0 }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org", "@type": "CollectionPage", name: "My Dev Tools catalog", url: SITE_URL,
                mainEntity: { "@type": "ItemList", numberOfItems: toolsRegistry.length, itemListElement: toolsRegistry.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: `${SITE_URL}${toolPath(tool)}` })) },
            }).replace(/</g, "\u003c") }} />
            <WorkspaceModeToggle />
            <div className="wb-marketing-area"><LandingMarketing darkMode={darkMode} stats={{ total: toolsRegistry.length, categories: categorized.size }}
                onToolClick={addRecentTool} /></div>
            <div id="landing-full-catalog" className="wb-cat-workspace">
                <div className="wb-cat-workspace-inner">
                    <div className="wb-cat-intro">
                        <h2 className="wb-cat-intro-title">{t("{count} tools for everyday development.", { count: toolsRegistry.length })}</h2>
                        <p className="wb-cat-intro-desc">{t("Find a tool by name, task, format, or category.")}</p>
                    </div>
                    <div className="wb-cat-search-wrap">
                        <label htmlFor="catalog-search" className="sr-only">{t("Search tools")}</label>
                        <input id="catalog-search" type="search" className="wb-cat-search-input" placeholder={t("Search tools, formats, or tasks…")} value={search} onChange={(event) => setSearch(event.target.value)} style={{ paddingLeft: 18 }} />
                        <p className="wb-cat-match-hint" role="status">{t("{count} matching tools", { count })}</p>
                    </div>
                    {!count && <p role="status">{t("No tools match “{query}”. Try a format such as JSON, XML, or JWT.", { query: search })}</p>}
                    {filtered.map(([category, tools]) => <section key={category} id={dashboardCategoryHashId(category)} className="wb-cat-category-block" aria-labelledby={`title-${dashboardCategoryHashId(category)}`}>
                        <div className="wb-cat-category-head" style={{ "--cat-accent": CATEGORY_COLORS[category as ToolCategory] } as React.CSSProperties}>
                            <div className="wb-cat-category-titles"><h2 id={`title-${dashboardCategoryHashId(category)}`} className="wb-cat-category-name">{t(category)} <span className="wb-native-tag">{tools.length}</span></h2><p className="wb-cat-category-desc">{t(CATEGORY_DESCRIPTIONS[category])}</p></div>
                        </div>
                        <div className="wb-catalog-grid">
                            {tools.map((tool) => <Link key={tool.id} href={toolPath(tool)} prefetch={false} onClick={() => addRecentTool(tool.id)} className="wb-cat-tool-card" style={{ "--tool-accent": tool.color } as React.CSSProperties}>
                                <h3 className="wb-cat-tool-name">{t(tool.name)}</h3>
                                <p className="wb-cat-tool-desc">{t(tool.description)}</p>
                                <span className="wb-tool-label">{t(BOUNDARY_LABELS[dataBoundaryForTool(tool.id)])}</span>
                                <div className="wb-native-tags">{tool.tags.slice(0, 3).map((tag) => <span key={tag} className="wb-native-tag">{tag}</span>)}</div>
                            </Link>)}
                        </div>
                    </section>)}
                    <a href="#landing-full-catalog" className="wb-tool-label">{t("Back to catalog search")}</a>
                </div>
            </div>
        </div>
    );
}
